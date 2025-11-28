import json
import google.generativeai as genai
from app.core.config import get_settings

FALLBACK_MODEL = "gemini-1.5-flash"


async def analyze_image_intents(image_bytes: bytes) -> dict:
    """
    Calls Google Gemini Vision model with the given image bytes.
    
    Returns a Python dict matching the expected JSON:
    { 'intents': [ { 'label': ..., 'confidence': ..., 'category': ..., 'reasoning': ... }, ... ] }
    """
    settings = get_settings()
    
    # Configure Gemini API
    genai.configure(api_key=settings.GEMINI_API_KEY)

    def _init_model(model_name: str):
        return genai.GenerativeModel(
            model_name=model_name,
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 0.7,
            }
        )

    # Initialize the model, falling back to a v1beta-compatible option if needed
    model_name = settings.GEMINI_MODEL_NAME or FALLBACK_MODEL
    try:
        model = _init_model(model_name)
    except Exception as e:
        if model_name == FALLBACK_MODEL:
            raise Exception(f"Gemini API error: {str(e)}")
        try:
            model = _init_model(FALLBACK_MODEL)
            model_name = FALLBACK_MODEL
        except Exception as fallback_error:
            raise Exception(
                "Gemini API error: failed to initialize models. "
                f"Primary '{model_name}' failed with: {str(e)}. "
                f"Fallback '{FALLBACK_MODEL}' failed with: {str(fallback_error)}."
            )
    
    # System prompt
    system_prompt = """You are an assistant helping parents and teachers understand the intent of an autistic child's sketch or photo.

You will receive one image. You must output ONLY a JSON object with an 'intents' list.

Each intent represents a possible meaning or need behind the drawing.

Format:
{ 'intents': [ { 'label': string, 'confidence': number, 'category': string, 'reasoning': string }, ... ] }

'label' must be short, in Vietnamese, e.g. 'Con muốn uống nước'.
'confidence' is from 0.0 to 1.0.
'category' can be 'need', 'emotion', 'object', or 'activity'.
'reasoning' is a short explanation in simple Vietnamese.

If the drawing is unclear, return low confidence and explain the uncertainty in 'reasoning'.

Always return at least one intent, even if confidence is low."""
    
    # Prepare the prompt with image
    prompt = system_prompt
    
    try:
        # Generate content with image
        response = model.generate_content([prompt, {"mime_type": "image/jpeg", "data": image_bytes}])
        
        # Parse JSON response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        result = json.loads(response_text)
        
        # Validate structure
        if "intents" not in result:
            result = {"intents": []}
        
        # Ensure all intents have required fields
        for intent in result.get("intents", []):
            if "label" not in intent:
                intent["label"] = "Không xác định"
            if "confidence" not in intent:
                intent["confidence"] = 0.0
            if "category" not in intent:
                intent["category"] = "object"
            if "reasoning" not in intent:
                intent["reasoning"] = "Không thể phân tích được."
        
        return result
        
    except json.JSONDecodeError as e:
        # If JSON parsing fails, return a default response
        return {
            "intents": [{
                "label": "Lỗi phân tích",
                "confidence": 0.0,
                "category": "object",
                "reasoning": f"Không thể phân tích phản hồi từ AI: {str(e)}"
            }]
        }
    except Exception as e:
        # Handle other errors
        raise Exception(f"Gemini API error: {str(e)}")




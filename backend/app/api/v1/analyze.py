import base64
import logging
from fastapi import APIRouter, HTTPException
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.core.gemini_client import analyze_image_intents

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(request: AnalyzeRequest):
    """
    Analyze an image (drawing or photo) and return possible intents.
    
    Accepts a base64-encoded image and returns a list of intents with
    label, confidence, category, and reasoning.
    """
    try:
        # Decode base64 image
        try:
            # Remove data URL prefix if present
            image_base64 = request.image_base64
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
            
            image_bytes = base64.b64decode(image_base64)
        except Exception as e:
            logger.error(f"Base64 decoding failed: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid base64 image data: {str(e)}"
            )
        
        # Analyze image with Gemini
        try:
            result = await analyze_image_intents(image_bytes)
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Image analysis failed: {str(e)}"
            )
        
        # Validate and return response
        try:
            response = AnalyzeResponse(**result)
            return response
        except Exception as e:
            logger.error(f"Response validation failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Invalid response format: {str(e)}"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )




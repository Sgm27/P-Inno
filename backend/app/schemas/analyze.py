from pydantic import BaseModel
from typing import List


class AnalyzeRequest(BaseModel):
    image_base64: str


class Intent(BaseModel):
    label: str
    confidence: float
    category: str
    reasoning: str


class AnalyzeResponse(BaseModel):
    intents: List[Intent]




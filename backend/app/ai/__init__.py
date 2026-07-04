"""
AI/ML integration module.

Architecture:
    Services → AIService → AIProvider (abstract) → SarvamProvider → Sarvam API

Import specific capabilities from submodules:
    from app.ai.ai_service import AIService
    from app.ai.complaint_classifier import classify_complaint
    from app.ai.translation import translate
    from app.ai.speech import speech_to_text
    from app.ai.summary import summarize_complaint
    from app.ai.vision import analyze_complaint_image
    from app.ai.geo_engine import validate_location
"""

from app.ai.provider import AIProvider, AIResponse
from app.ai.ai_service import AIService, ai_service

__all__ = [
    "AIProvider",
    "AIResponse",
    "AIService",
    "ai_service",
]

"""
AI-powered multilingual translation and transliteration.

Uses Sarvam AI's native translation API (Mayura model) for
Indic language pairs, with LLM fallback for unsupported combinations.

Supported languages:
    English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada,
    Malayalam, Punjabi, Bengali, Odia, Assamese, Urdu, Nepali, and more.
"""

import logging
from typing import Dict, List, Optional

from app.ai.ai_service import AIService

logger = logging.getLogger("app.ai.translation")

SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi",
    "gu": "Gujarati",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "bn": "Bengali",
    "od": "Odia",
    "as": "Assamese",
    "ur": "Urdu",
    "ne": "Nepali",
    "sd": "Sindhi",
    "ks": "Kashmiri",
    "kok": "Kokkani",
    "mai": "Maithili",
    "sa": "Sanskrit",
}


async def translate(
    text: str,
    source_language: str = "auto",
    target_language: str = "en",
) -> Dict[str, Any]:
    """
    Translate text between supported Indian languages.

    Args:
        text: Text to translate.
        source_language: Source language code (e.g. 'hi', 'ta', 'auto').
        target_language: Target language code (e.g. 'en', 'mr').

    Returns:
        Dict with: translated_text, source_language, target_language, method.
    """
    logger.info("Translation request: %s→%s | chars=%d", source_language, target_language, len(text))
    return await AIService.translate(text, source_language, target_language)


async def translate_complaint(
    original_text: str,
    original_language: str,
) -> Dict[str, str]:
    """
    Translate a complaint from any supported language to English.

    Used internally to normalise multilingual complaints for classification.

    Returns:
        Dict with: original_text, english_text, source_language.
    """
    if original_language.lower().startswith("en"):
        return {
            "original_text": original_text,
            "english_text": original_text,
            "source_language": "en",
        }

    result = await translate(original_text, original_language, "en")
    return {
        "original_text": original_text,
        "english_text": result.get("translated_text", original_text),
        "source_language": original_language,
    }


async def back_translate(
    english_text: str,
    target_language: str,
) -> str:
    """Translate English text back to the citizen's language for display."""
    if target_language.lower().startswith("en"):
        return english_text

    result = await translate(english_text, "en", target_language)
    return result.get("translated_text", english_text)


def get_supported_languages() -> Dict[str, str]:
    """Return a map of supported language codes to their names."""
    return dict(SUPPORTED_LANGUAGES)


def is_supported(language_code: str) -> bool:
    """Check if a language code is supported."""
    code = language_code.split("-")[0].lower()
    return code in SUPPORTED_LANGUAGES

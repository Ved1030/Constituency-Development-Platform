"""
AI-powered speech processing.

Provides:
- Speech-to-text (STT) using Sarvam Saarika model
- Text-to-speech (TTS) using Sarvam Bulbul model
- Language detection from audio
- Translation of transcripts to English
- Full voice complaint processing pipeline

Citizens can file voice complaints in any supported Indic language.
The system transcribes, classifies, and translates automatically.
"""

import logging
import time
from typing import Any, Dict, List, Optional

from app.ai.ai_service import AIService

logger = logging.getLogger("app.ai.speech")

# ---------------------------------------------------------------------------
# Supported Sarvam STT language codes with display names
# ---------------------------------------------------------------------------
SUPPORTED_STT_LANGUAGES: List[Dict[str, str]] = [
    {"code": "hi-IN", "name": "Hindi", "native_name": "हिन्दी"},
    {"code": "bn-IN", "name": "Bengali", "native_name": "বাংলা"},
    {"code": "gu-IN", "name": "Gujarati", "native_name": "ગુજરાતી"},
    {"code": "kn-IN", "name": "Kannada", "native_name": "ಕನ್ನಡ"},
    {"code": "ml-IN", "name": "Malayalam", "native_name": "മലയാളം"},
    {"code": "mr-IN", "name": "Marathi", "native_name": "मराठी"},
    {"code": "od-IN", "name": "Odia", "native_name": "ଓଡ଼ିଆ"},
    {"code": "pa-IN", "name": "Punjabi", "native_name": "ਪੰਜਾਬੀ"},
    {"code": "ta-IN", "name": "Tamil", "native_name": "தமிழ்"},
    {"code": "te-IN", "name": "Telugu", "native_name": "తెలుగు"},
    {"code": "ur-IN", "name": "Urdu", "native_name": "اردو"},
    {"code": "en-IN", "name": "English", "native_name": "English"},
    {"code": "as-IN", "name": "Assamese", "native_name": "অসমীয়া"},
    {"code": "ne-IN", "name": "Nepali", "native_name": "नेपाली"},
    {"code": "sd-IN", "name": "Sindhi", "native_name": "سنڌي"},
    {"code": "ks-IN", "name": "Kashmiri", "native_name": "कॉशुर"},
    {"code": "kok-IN", "name": "Konkani", "native_name": "कोंकणी"},
    {"code": "mai-IN", "name": "Maithili", "native_name": "मैथिली"},
]

# Quick lookup by code
_LANG_CODE_MAP: Dict[str, Dict[str, str]] = {lang["code"]: lang for lang in SUPPORTED_STT_LANGUAGES}
_LANG_NAME_MAP: Dict[str, Dict[str, str]] = {lang["name"].lower(): lang for lang in SUPPORTED_STT_LANGUAGES}


def get_supported_languages() -> List[Dict[str, str]]:
    """Return all supported STT languages."""
    return SUPPORTED_STT_LANGUAGES


def get_language_info(code: str) -> Optional[Dict[str, str]]:
    """Look up language info by code or name."""
    if code in _LANG_CODE_MAP:
        return _LANG_CODE_MAP[code]
    return _LANG_NAME_MAP.get(code.lower())


# ---------------------------------------------------------------------------
# Core STT
# ---------------------------------------------------------------------------

async def speech_to_text(
    audio_bytes: bytes,
    language_code: str = "hi-IN",
    audio_format: str = "wav",
) -> Dict[str, Any]:
    """
    Transcribe audio to text using Sarvam STT (Saarika model).

    Args:
        audio_bytes: Raw audio data.
        language_code: BCP-47 language code (e.g. 'hi-IN', 'ta-IN').
        audio_format: Audio format ('wav', 'mp3', 'webm', 'ogg').

    Returns:
        Dict with: transcript, language, language_code, confidence, success, error.
    """
    logger.info("STT request | lang=%s | bytes=%d | format=%s", language_code, len(audio_bytes), audio_format)
    result = await AIService.speech_to_text(audio_bytes, language_code, audio_format)
    return result


# ---------------------------------------------------------------------------
# Translation
# ---------------------------------------------------------------------------

async def translate_to_english(
    text: str,
    source_language: str,
) -> Dict[str, Any]:
    """
    Translate text to English using Sarvam Translate (Mayura model).

    Args:
        text: Text to translate.
        source_language: Source language code or name.

    Returns:
        Dict with: translated_text, source_language, target_language, success, error.
    """
    if not text or not text.strip():
        return {"translated_text": "", "source_language": source_language, "target_language": "en", "success": True}

    # Skip translation if already English
    lang_lower = source_language.lower()
    if lang_lower in ("en", "en-in", "english"):
        return {"translated_text": text, "source_language": source_language, "target_language": "en", "success": True}

    logger.info("Translating to English | source=%s | chars=%d", source_language, len(text))
    result = await AIService.translate(text, source_language=source_language, target_language="en")
    return result


# ---------------------------------------------------------------------------
# Language detection via LLM
# ---------------------------------------------------------------------------

async def detect_language_from_text(text: str) -> Dict[str, Any]:
    """
    Detect the language of a text string using Sarvam chat.

    Args:
        text: Text to identify language for.

    Returns:
        Dict with: language, language_code, confidence, success.
    """
    if not text or not text.strip():
        return {"language": "English", "language_code": "en-IN", "confidence": 0.0, "success": False}

    prompt = (
        f"Identify the language of this text. Return ONLY a JSON object:\n"
        f'{{"language": "<name>", "language_code": "<BCP-47 code>", "confidence": <0.0-1.0>}}\n\n'
        f"Supported codes: hi-IN, bn-IN, gu-IN, kn-IN, ml-IN, mr-IN, od-IN, pa-IN, ta-IN, te-IN, ur-IN, en-IN\n\n"
        f"Text: {text[:500]}"
    )

    result = await AIService.generate_text(
        prompt,
        system_prompt="You are a language detection engine. Respond with ONLY valid JSON.",
        temperature=0.1,
        max_tokens=256,
    )

    import json
    try:
        parsed = json.loads(result.strip().strip("`"))
        return {
            "language": parsed.get("language", "English"),
            "language_code": parsed.get("language_code", "en-IN"),
            "confidence": float(parsed.get("confidence", 0.5)),
            "success": True,
        }
    except (json.JSONDecodeError, TypeError, ValueError):
        return {"language": "English", "language_code": "en-IN", "confidence": 0.3, "success": False}


# ---------------------------------------------------------------------------
# Full voice complaint pipeline
# ---------------------------------------------------------------------------

async def process_voice_complaint(
    audio_bytes: bytes,
    audio_format: str = "webm",
    language_code: Optional[str] = None,
) -> Dict[str, Any]:
    """
    End-to-end voice complaint processing pipeline.

    1. Transcribe audio → text (auto-detect language if not specified)
    2. Translate to English if non-English
    3. Return transcript with metadata

    Args:
        audio_bytes: Raw audio data.
        audio_format: Audio format.
        language_code: Optional language hint. If None, Sarvam auto-detects.

    Returns:
        Dict with: original_text, english_translation, language, language_code,
                    confidence, speech_duration_seconds, success, error.
    """
    t0 = time.perf_counter()

    # If no language hint, try auto-detect by transcribing with each likely language
    # Sarvam STT requires a language code, so we use a heuristic:
    # Try Hindi first (most common), then check if the transcript makes sense
    if not language_code:
        language_code = "hi-IN"

    # Step 1: Transcribe
    stt_result = await speech_to_text(audio_bytes, language_code, audio_format)

    if not stt_result.get("success"):
        logger.error("Voice processing STT failed: %s", stt_result.get("error"))
        return {
            "original_text": "",
            "english_translation": "",
            "language": _get_language_name(language_code),
            "language_code": language_code,
            "confidence": 0.0,
            "speech_duration_seconds": 0.0,
            "success": False,
            "error": stt_result.get("error", "Speech recognition failed"),
        }

    transcript = stt_result.get("transcript", "")
    if not transcript:
        return {
            "original_text": "",
            "english_translation": "",
            "language": _get_language_name(language_code),
            "language_code": language_code,
            "confidence": 0.0,
            "speech_duration_seconds": 0.0,
            "success": False,
            "error": "No speech detected in the audio",
        }

    # Step 2: Detect actual language from transcript
    lang_detection = await detect_language_from_text(transcript)
    detected_lang_code = lang_detection.get("language_code", language_code)
    detected_lang_name = lang_detection.get("language", _get_language_name(language_code))
    detected_confidence = lang_detection.get("confidence", 0.5)

    # Step 3: Translate to English if non-English
    english_translation = ""
    if detected_lang_code not in ("en-IN", "en"):
        translation_result = await translate_to_english(transcript, detected_lang_code)
        english_translation = translation_result.get("translated_text", "")
    else:
        english_translation = transcript

    total_time = time.perf_counter() - t0

    logger.info(
        "Voice processing complete | lang=%s | confidence=%.2f | chars=%d | time=%.2fs",
        detected_lang_name,
        detected_confidence,
        len(transcript),
        total_time,
    )

    return {
        "original_text": transcript,
        "english_translation": english_translation,
        "language": detected_lang_name,
        "language_code": detected_lang_code,
        "confidence": detected_confidence,
        "speech_duration_seconds": 0.0,  # Browser calculates this
        "success": True,
    }


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_language_name(code: str) -> str:
    """Get display name from language code."""
    info = _LANG_CODE_MAP.get(code)
    return info["name"] if info else code

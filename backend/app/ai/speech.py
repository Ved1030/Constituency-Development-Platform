"""
AI-powered speech processing.

Provides:
- Speech-to-text (STT) using Sarvam Saarika model
- Text-to-speech (TTS) using Sarvam Bulbul model
- Language detection from audio
- Translation of transcripts to English
- Full voice complaint processing pipeline

Every error path returns an `error_stage` key so the API layer
can tell the frontend exactly WHERE the failure occurred.
"""

import json
import logging
import time
import traceback
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

_LANG_CODE_MAP: Dict[str, Dict[str, str]] = {lang["code"]: lang for lang in SUPPORTED_STT_LANGUAGES}
_LANG_NAME_MAP: Dict[str, Dict[str, str]] = {lang["name"].lower(): lang for lang in SUPPORTED_STT_LANGUAGES}


def get_supported_languages() -> List[Dict[str, str]]:
    return SUPPORTED_STT_LANGUAGES


def get_language_info(code: str) -> Optional[Dict[str, str]]:
    if code in _LANG_CODE_MAP:
        return _LANG_CODE_MAP[code]
    return _LANG_NAME_MAP.get(code.lower())


def _make_error(stage: str, message: str, details: Optional[str] = None) -> Dict[str, Any]:
    """Build a consistent error dict with stage info."""
    err = {
        "success": False,
        "error_stage": stage,
        "error": message,
        "original_text": "",
        "english_translation": "",
        "language": "Unknown",
        "language_code": "unknown",
        "confidence": 0.0,
        "speech_duration_seconds": 0.0,
    }
    if details:
        err["error_details"] = details
    return err


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
    Returns dict with: transcript, language, success, error, error_stage.
    """
    logger.info(
        "STT request | lang=%s | bytes=%d | format=%s",
        language_code, len(audio_bytes), audio_format,
    )

    t0 = time.perf_counter()
    try:
        result = await AIService.speech_to_text(audio_bytes, language_code, audio_format)
    except Exception as exc:
        tb = traceback.format_exc()
        logger.error("STT call crashed:\n%s", tb)
        return {
            "success": False,
            "transcript": "",
            "language": language_code,
            "error_stage": "stt_exception",
            "error": f"Speech-to-text service error: {type(exc).__name__}: {exc}",
        }

    latency = (time.perf_counter() - t0) * 1000

    # Check if AIService returned an error
    if not result.get("success"):
        raw_error = result.get("error", "Unknown STT error")
        logger.error("STT failed | lang=%s | error=%s | %.0fms", language_code, raw_error, latency)
        return {
            "success": False,
            "transcript": "",
            "language": language_code,
            "error_stage": "stt",
            "error": f"Speech recognition failed: {raw_error}",
        }

    transcript = result.get("transcript", "")
    if not transcript or not transcript.strip():
        logger.warning("STT returned empty transcript | lang=%s | %.0fms", language_code, latency)
        return {
            "success": False,
            "transcript": "",
            "language": language_code,
            "error_stage": "stt_empty",
            "error": "No speech detected in the audio. Please try speaking louder or closer to the microphone.",
        }

    logger.info(
        "STT success | lang=%s | chars=%d | %.0fms",
        language_code, len(transcript), latency,
    )
    return {
        "success": True,
        "transcript": transcript,
        "language": language_code,
    }


# ---------------------------------------------------------------------------
# Translation
# ---------------------------------------------------------------------------

async def translate_to_english(
    text: str,
    source_language: str,
) -> Dict[str, Any]:
    if not text or not text.strip():
        return {"translated_text": "", "source_language": source_language, "target_language": "en", "success": True}

    lang_lower = source_language.lower()
    if lang_lower in ("en", "en-in", "english"):
        return {"translated_text": text, "source_language": source_language, "target_language": "en", "success": True}

    logger.info("Translating to English | source=%s | chars=%d", source_language, len(text))

    try:
        result = await AIService.translate(text, source_language=source_language, target_language="en")
    except Exception as exc:
        logger.error("Translation crashed: %s", exc)
        return {
            "translated_text": text,
            "source_language": source_language,
            "target_language": "en",
            "success": False,
            "error": f"Translation error: {exc}",
        }

    return result


# ---------------------------------------------------------------------------
# Language detection via LLM
# ---------------------------------------------------------------------------

async def detect_language_from_text(text: str) -> Dict[str, Any]:
    if not text or not text.strip():
        return {"language": "English", "language_code": "en-IN", "confidence": 0.0, "success": False}

    prompt = (
        f"Identify the language of this text. Return ONLY a JSON object:\n"
        f'{{"language": "<name>", "language_code": "<BCP-47 code>", "confidence": <0.0-1.0>}}\n\n'
        f"Supported codes: hi-IN, bn-IN, gu-IN, kn-IN, ml-IN, mr-IN, od-IN, pa-IN, ta-IN, te-IN, ur-IN, en-IN\n\n"
        f"Text: {text[:500]}"
    )

    try:
        result = await AIService.generate_text(
            prompt,
            system_prompt="You are a language detection engine. Respond with ONLY valid JSON.",
            temperature=0.1,
            max_tokens=256,
        )
    except Exception as exc:
        logger.warning("Language detection failed: %s", exc)
        return {"language": "Hindi", "language_code": "hi-IN", "confidence": 0.3, "success": False}

    try:
        parsed = json.loads(result.strip().strip("`"))
        return {
            "language": parsed.get("language", "Hindi"),
            "language_code": parsed.get("language_code", "hi-IN"),
            "confidence": float(parsed.get("confidence", 0.5)),
            "success": True,
        }
    except (json.JSONDecodeError, TypeError, ValueError) as exc:
        logger.warning("Language detection JSON parse failed: %s", exc)
        return {"language": "Hindi", "language_code": "hi-IN", "confidence": 0.3, "success": False}


# ---------------------------------------------------------------------------
# Full voice complaint pipeline
# ---------------------------------------------------------------------------

async def process_voice_complaint(
    audio_bytes: bytes,
    audio_format: str = "webm",
    language_code: Optional[str] = None,
    speech_duration: Optional[float] = None,
) -> Dict[str, Any]:
    """
    End-to-end voice complaint processing pipeline.
    Each step propagates error_stage on failure.
    """
    t0 = time.perf_counter()

    if not language_code:
        language_code = "hi-IN"

    logger.info(
        "Pipeline start | format=%s | lang_hint=%s | audio_bytes=%d | duration=%.1fs",
        audio_format, language_code, len(audio_bytes), speech_duration or 0,
    )

    # Step 1: Transcribe
    logger.info("Step 1/3: Calling Sarvam STT...")
    stt_result = await speech_to_text(audio_bytes, language_code, audio_format)

    if not stt_result.get("success"):
        logger.error("Pipeline failed at STT | stage=%s | error=%s", stt_result.get("error_stage"), stt_result.get("error"))
        return {
            "original_text": "",
            "english_translation": "",
            "language": _get_language_name(language_code),
            "language_code": language_code,
            "confidence": 0.0,
            "speech_duration_seconds": speech_duration or 0.0,
            "success": False,
            "error_stage": stt_result.get("error_stage", "stt"),
            "error": stt_result.get("error", "Speech recognition failed"),
        }

    transcript = stt_result.get("transcript", "")
    logger.info("Step 1/3: STT complete | chars=%d", len(transcript))

    # Step 2: Detect language
    logger.info("Step 2/3: Detecting language from transcript...")
    try:
        lang_detection = await detect_language_from_text(transcript)
    except Exception as exc:
        logger.warning("Language detection failed, using hint: %s", exc)
        lang_detection = {"language_code": language_code, "language": _get_language_name(language_code), "confidence": 0.3}

    detected_lang_code = lang_detection.get("language_code", language_code)
    detected_lang_name = lang_detection.get("language", _get_language_name(language_code))
    detected_confidence = lang_detection.get("confidence", 0.5)
    logger.info("Step 2/3: Language detected | lang=%s | confidence=%.2f", detected_lang_name, detected_confidence)

    # Step 3: Translate to English
    english_translation = ""
    if detected_lang_code not in ("en-IN", "en"):
        logger.info("Step 3/3: Translating %s → English...", detected_lang_name)
        try:
            translation_result = await translate_to_english(transcript, detected_lang_code)
        except Exception as exc:
            logger.error("Translation crashed: %s", exc)
            translation_result = {"translated_text": transcript, "success": False, "error": str(exc)}

        english_translation = translation_result.get("translated_text", "")
        if not translation_result.get("success"):
            logger.warning("Translation incomplete, using original transcript as fallback")
        logger.info("Step 3/3: Translation done | chars=%d", len(english_translation))
    else:
        english_translation = transcript
        logger.info("Step 3/3: Language is English, skipping translation")

    total_time = time.perf_counter() - t0
    logger.info(
        "Pipeline COMPLETE | lang=%s | confidence=%.2f | transcript_chars=%d | translation_chars=%d | total=%.2fs",
        detected_lang_name, detected_confidence, len(transcript), len(english_translation), total_time,
    )

    return {
        "original_text": transcript,
        "english_translation": english_translation,
        "language": detected_lang_name,
        "language_code": detected_lang_code,
        "confidence": detected_confidence,
        "speech_duration_seconds": speech_duration or 0.0,
        "success": True,
    }


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_language_name(code: str) -> str:
    info = _LANG_CODE_MAP.get(code)
    return info["name"] if info else code

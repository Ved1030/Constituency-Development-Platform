"""
AI-powered speech processing.

Provides:
- Speech-to-text (STT) using Sarvam Saarika model with auto language detection
- Text-to-speech (TTS) using Sarvam Bulbul model
- Translation of transcripts (on-demand only)
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
    language_code: str = "auto",
    audio_format: str = "wav",
) -> Dict[str, Any]:
    """
    Transcribe audio to text using Sarvam STT (Saarika model).

    When language_code is "auto" (the default), Sarvam automatically detects
    the spoken language and returns it in the response.  The transcript is
    ALWAYS in the original spoken language — no translation is performed.

    Returns dict with: transcript, language, language_code, confidence, success, error, error_stage.
    """
    is_auto = language_code.strip().lower() in ("auto", "")

    logger.info(
        "STT request | lang=%s (auto=%s) | bytes=%d | format=%s",
        language_code, is_auto, len(audio_bytes), audio_format,
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
            "language": "Unknown",
            "language_code": "unknown",
            "confidence": 0.0,
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
            "language": "Unknown",
            "language_code": "unknown",
            "confidence": 0.0,
            "error_stage": "stt",
            "error": f"Speech recognition failed: {raw_error}",
        }

    transcript = result.get("transcript", "")
    if not transcript or not transcript.strip():
        logger.warning("STT returned empty transcript | lang=%s | %.0fms", language_code, latency)
        return {
            "success": False,
            "transcript": "",
            "language": "Unknown",
            "language_code": "unknown",
            "confidence": 0.0,
            "error_stage": "stt_empty",
            "error": "No speech detected in the audio. Please try speaking louder or closer to the microphone.",
        }

    # Sarvam returns the detected language_code in the result
    detected_lang_code = result.get("language", "unknown")
    detected_lang_name = _get_language_name(detected_lang_code)

    # Estimate confidence based on transcript quality when Sarvam doesn't
    # provide an explicit confidence score.
    confidence = _estimate_confidence(transcript, detected_lang_code)

    logger.info(
        "STT success | detected_lang=%s (%s) | confidence=%.2f | chars=%d | %.0fms",
        detected_lang_name, detected_lang_code, confidence, len(transcript), latency,
    )
    return {
        "success": True,
        "transcript": transcript,
        "language": detected_lang_name,
        "language_code": detected_lang_code,
        "confidence": confidence,
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
# Language detection via LLM (used for text-only detection, not primary)
# ---------------------------------------------------------------------------

async def detect_language_from_text(text: str) -> Dict[str, Any]:
    """Detect language from text using LLM.  Used as a fallback only — Sarvam
    STT auto-detection is the primary method."""
    if not text or not text.strip():
        return {"language": "Unknown", "language_code": "unknown", "confidence": 0.0, "success": False}

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
        return {"language": "Unknown", "language_code": "unknown", "confidence": 0.0, "success": False}

    try:
        parsed = json.loads(result.strip().strip("`"))
        return {
            "language": parsed.get("language", "Unknown"),
            "language_code": parsed.get("language_code", "unknown"),
            "confidence": float(parsed.get("confidence", 0.5)),
            "success": True,
        }
    except (json.JSONDecodeError, TypeError, ValueError) as exc:
        logger.warning("Language detection JSON parse failed: %s", exc)
        return {"language": "Unknown", "language_code": "unknown", "confidence": 0.0, "success": False}


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

    The pipeline:
      1. Sends audio to Sarvam STT with auto language detection
      2. Sarvam detects the language and returns transcript in original language
      3. NO automatic translation — transcript stays in the spoken language
      4. Returns original transcript + detected language + confidence

    Each step propagates error_stage on failure.
    """
    t0 = time.perf_counter()

    # Default to auto-detection — never force a language
    if not language_code or language_code.strip().lower() in ("auto", ""):
        language_code = "auto"

    # Calculate audio metrics for logging
    audio_size_mb = len(audio_bytes) / (1024 * 1024)
    audio_duration = speech_duration or 0.0

    logger.info(
        "=== PIPELINE START ===\n"
        "  Request ID      : pl-%d\n"
        "  Audio format    : %s\n"
        "  Audio size      : %.4f MB (%d bytes)\n"
        "  Audio duration  : %.1fs\n"
        "  Language hint   : %s\n"
        "  Pipeline        : STT (auto-detect) → NO translation",
        int(t0 * 1000), audio_format, audio_size_mb, len(audio_bytes),
        audio_duration, language_code,
    )

    # Step 1: Transcribe with auto language detection
    logger.info("Step 1/2: Calling Sarvam STT with auto language detection...")
    stt_result = await speech_to_text(audio_bytes, language_code, audio_format)

    if not stt_result.get("success"):
        logger.error(
            "Pipeline failed at STT | stage=%s | error=%s",
            stt_result.get("error_stage"), stt_result.get("error"),
        )
        return {
            "original_text": "",
            "english_translation": "",
            "language": "Unknown",
            "language_code": "unknown",
            "confidence": 0.0,
            "speech_duration_seconds": audio_duration,
            "success": False,
            "error_stage": stt_result.get("error_stage", "stt"),
            "error": stt_result.get("error", "Speech recognition failed"),
        }

    transcript = stt_result.get("transcript", "")
    detected_lang_code = stt_result.get("language_code", "unknown")
    detected_lang_name = stt_result.get("language", "Unknown")
    confidence = stt_result.get("confidence", 0.0)

    logger.info(
        "Step 1/2: STT complete | detected=%s (%s) | confidence=%.2f | chars=%d",
        detected_lang_name, detected_lang_code, confidence, len(transcript),
    )

    # Step 2: NO automatic translation — transcript stays in original language
    # Translation is only performed if explicitly requested by the user
    english_translation = ""
    logger.info("Step 2/2: Skipping auto-translation — transcript kept in original language (%s)", detected_lang_name)

    total_time = time.perf_counter() - t0
    logger.info(
        "=== PIPELINE COMPLETE ===\n"
        "  Detected language : %s (%s)\n"
        "  Confidence       : %.2f\n"
        "  Transcript chars : %d\n"
        "  Translation      : NONE (on-demand only)\n"
        "  Total latency    : %.2fs",
        detected_lang_name, detected_lang_code, confidence,
        len(transcript), total_time,
    )

    return {
        "original_text": transcript,
        "english_translation": english_translation,
        "language": detected_lang_name,
        "language_code": detected_lang_code,
        "confidence": confidence,
        "speech_duration_seconds": audio_duration,
        "success": True,
    }


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_language_name(code: str) -> str:
    info = _LANG_CODE_MAP.get(code)
    return info["name"] if info else code


def _estimate_confidence(transcript: str, language_code: str) -> float:
    """Estimate transcription confidence from transcript quality metrics.

    Sarvam STT does not always return an explicit confidence score, so we
    estimate one from observable properties of the transcript:

    - **Length**: Longer transcripts imply the model found more speech to
      decode, which generally correlates with higher confidence.
    - **Language code presence**: If Sarvam returned a valid language code,
      the model was confident enough to commit to a language.
    - **Character diversity**: A transcript with reasonable character
      diversity (not just repeated characters) suggests genuine speech.

    The score is in the range [0.3, 1.0].  The floor of 0.3 indicates that
    STT was successful but with limited data; the ceiling of 1.0 represents
    a long, diverse transcript with a valid language code.
    """
    if not transcript or not transcript.strip():
        return 0.0

    score = 0.3  # base score for any successful transcription

    # Length component: longer transcripts → higher confidence (max +0.35)
    char_count = len(transcript.strip())
    if char_count > 200:
        score += 0.35
    elif char_count > 100:
        score += 0.28
    elif char_count > 50:
        score += 0.20
    elif char_count > 20:
        score += 0.12
    elif char_count > 5:
        score += 0.05

    # Language code component: valid detected code → more confidence (+0.15)
    if language_code and language_code != "unknown" and language_code != "auto":
        score += 0.15

    # Character diversity component: more unique chars → better quality (+0.20)
    if char_count > 0:
        unique_chars = len(set(transcript.strip()))
        diversity_ratio = unique_chars / char_count
        if diversity_ratio > 0.5:
            score += 0.20
        elif diversity_ratio > 0.3:
            score += 0.12
        elif diversity_ratio > 0.15:
            score += 0.06

    return min(1.0, round(score, 2))

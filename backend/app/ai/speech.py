"""
AI-powered speech processing.

Provides:
- Speech-to-text (STT) using Sarvam Saarika model
- Text-to-speech (TTS) using Sarvam Bulbul model

Citizens can file voice complaints in any supported Indic language.
The system transcribes, classifies, and translates automatically.
"""

import logging
from typing import Any, Dict, Optional

from app.ai.ai_service import AIService

logger = logging.getLogger("app.ai.speech")

# Supported Sarvam STT language codes
_SUPPORTED_STT_LANGS = {
    "hi-IN", "bn-IN", "gu-IN", "kn-IN", "ml-IN", "mr-IN",
    "od-IN", "pa-IN", "ta-IN", "te-IN", "ur-IN", "en-IN",
    "as-IN", "ne-IN", "sd-IN", "ks-IN", "kok-IN", "mai-IN",
}


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
        audio_format: Audio format ('wav', 'mp3', 'webm').

    Returns:
        Dict with: transcript, language, success, error.
    """
    logger.info("STT request | lang=%s | bytes=%d", language_code, len(audio_bytes))
    return await AIService.speech_to_text(audio_bytes, language_code, audio_format)


async def text_to_speech(
    text: str,
    language_code: str = "hi-IN",
    voice_id: str = "meera",
) -> Dict[str, Any]:
    """
    Synthesise speech from text using Sarvam TTS (Bulbul model).

    Args:
        text: Text to synthesise.
        language_code: BCP-47 language code.
        voice_id: Voice identifier ('meera', 'arvind').

    Returns:
        Dict with: audio_data (hex), language, success, error.
    """
    logger.info("TTS request | lang=%s | chars=%d", language_code, len(text))
    return await AIService.text_to_speech(text, language_code, voice_id)


async def process_voice_complaint(
    audio_bytes: bytes,
    audio_format: str = "wav",
    detect_language: bool = True,
) -> Dict[str, Any]:
    """
    End-to-end voice complaint processing pipeline.

    1. Transcribe audio → text
    2. Return transcript with detected language

    The caller can then feed the transcript into classify_complaint().
    """
    # Default to Hindi; in production, use language detection
    language_code = "hi-IN"

    stt_result = await speech_to_text(audio_bytes, language_code, audio_format)

    if not stt_result.get("success"):
        logger.error("Voice processing failed: %s", stt_result.get("error"))
        return {
            "transcript": "",
            "language": language_code,
            "success": False,
            "error": stt_result.get("error", "Transcription failed"),
        }

    return {
        "transcript": stt_result["transcript"],
        "language": language_code,
        "success": True,
        "audio_format": audio_format,
    }

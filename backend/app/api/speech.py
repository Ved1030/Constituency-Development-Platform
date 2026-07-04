"""
Speech processing API endpoints.

Provides:
- POST /transcribe — Audio → text + language detection + translation
- POST /classify — Background complaint classification
- GET /languages — List supported languages
"""

import logging
import time
from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from app.schemas.speech import (
    TranscriptionResponse,
    BackgroundClassificationRequest,
    BackgroundClassificationResponse,
    SupportedLanguagesResponse,
    SupportedLanguage,
)
from app.services.speech_service import SpeechService
from app.core.logger import log_api_request

logger = logging.getLogger("app.api.speech")

router = APIRouter()

# Max audio size: 25MB
MAX_AUDIO_SIZE = 25 * 1024 * 1024

# Allowed audio MIME types
ALLOWED_AUDIO_TYPES = {
    "audio/webm",
    "audio/wav",
    "audio/x-wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/ogg",
    "audio/flac",
    "video/webm",  # Some browsers record as video/webm
}


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file to transcribe"),
    language_code: Optional[str] = Form(None, description="Language hint (auto-detect if omitted)"),
):
    """
    Transcribe audio to text with language detection and English translation.

    Accepts audio in webm, wav, mp3, ogg, or flac format.
    Sarvam AI automatically detects the spoken language and translates to English.
    """
    t0 = time.perf_counter()

    # Validate file type
    content_type = file.content_type or "audio/webm"
    if content_type not in ALLOWED_AUDIO_TYPES:
        # Be lenient — try to process anyway
        logger.warning("Unexpected audio content type: %s", content_type)

    # Read audio bytes
    audio_bytes = await file.read()

    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file")

    if len(audio_bytes) > MAX_AUDIO_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"Audio file too large. Maximum size is {MAX_AUDIO_SIZE // (1024*1024)}MB",
        )

    # Determine audio format from content type or filename
    audio_format = _detect_audio_format(content_type, file.filename)

    logger.info(
        "POST /speech/transcribe | file=%s | size=%d | type=%s | format=%s",
        file.filename or "unknown",
        len(audio_bytes),
        content_type,
        audio_format,
    )

    # Log recording started
    log_api_request("POST", "/api/v1/speech/transcribe", status_code=200, execution_time_ms=0)

    try:
        result = await SpeechService.transcribe_audio(
            audio_bytes=audio_bytes,
            audio_format=audio_format,
            language_hint=language_code,
        )
    except Exception as exc:
        latency = (time.perf_counter() - t0) * 1000
        logger.error("Transcription failed: %s | %.0fms", exc, latency)
        raise HTTPException(
            status_code=500,
            detail="Speech recognition failed. Please try again.",
        )

    latency = (time.perf_counter() - t0) * 1000

    if not result.get("success"):
        logger.warning("Transcription unsuccessful: %s", result.get("error"))
        return TranscriptionResponse(
            success=False,
            language=result.get("language", "Unknown"),
            language_code=result.get("language_code", "unknown"),
            confidence=0.0,
            original_text="",
            english_translation="",
            speech_duration_seconds=0.0,
            error=result.get("error", "Transcription failed"),
        )

    # Log success
    logger.info(
        "Transcription success | lang=%s | confidence=%.2f | chars=%d | %.0fms",
        result.get("language"),
        result.get("confidence", 0),
        len(result.get("original_text", "")),
        latency,
    )

    return TranscriptionResponse(
        success=True,
        language=result.get("language", "Unknown"),
        language_code=result.get("language_code", "unknown"),
        confidence=result.get("confidence", 0.0),
        original_text=result.get("original_text", ""),
        english_translation=result.get("english_translation", ""),
        speech_duration_seconds=result.get("speech_duration_seconds", 0.0),
    )


@router.post("/classify", response_model=BackgroundClassificationResponse)
async def classify_complaint(request: BackgroundClassificationRequest):
    """
    Background AI classification of complaint text.

    Called in real-time as the user types or edits their complaint.
    By Step 5, the AI summary is already computed and ready to display instantly.
    """
    t0 = time.perf_counter()

    logger.info(
        "POST /speech/classify | title=%s... | cat=%s",
        request.title[:40],
        request.category or "auto",
    )

    try:
        result = await SpeechService.classify_complaint_text(
            title=request.title,
            description=request.description,
            category=request.category,
            original_language=request.original_language,
            english_translation=request.english_translation,
        )
    except Exception as exc:
        latency = (time.perf_counter() - t0) * 1000
        logger.error("Classification failed: %s | %.0fms", exc, latency)
        return BackgroundClassificationResponse(
            success=False,
            error="Classification failed",
        )

    latency = (time.perf_counter() - t0) * 1000
    logger.info(
        "Classification success | cat=%s | dept=%s | latency=%.0fms",
        result.get("detected_category"),
        result.get("detected_department"),
        latency,
    )

    return BackgroundClassificationResponse(
        success=True,
        detected_category=result.get("detected_category"),
        detected_department=result.get("detected_department"),
        detected_sector=result.get("detected_sector"),
        severity=result.get("severity", "medium"),
        priority_score=result.get("priority_score", 50),
        confidence=result.get("confidence", 0.5),
        keywords=result.get("keywords", []),
        estimated_resolution_days=result.get("estimated_resolution_days", 14),
    )


@router.get("/languages", response_model=SupportedLanguagesResponse)
async def get_supported_languages():
    """Return list of all supported speech languages."""
    languages = SpeechService.get_supported_languages()
    return SupportedLanguagesResponse(
        languages=[
            SupportedLanguage(
                code=lang["code"],
                name=lang["name"],
                native_name=lang.get("native_name", ""),
            )
            for lang in languages
        ]
    )


def _detect_audio_format(content_type: str, filename: Optional[str] = None) -> str:
    """Detect audio format from MIME type or filename extension."""
    ct_map = {
        "audio/webm": "webm",
        "video/webm": "webm",
        "audio/wav": "wav",
        "audio/x-wav": "wav",
        "audio/mp3": "mp3",
        "audio/mpeg": "mp3",
        "audio/ogg": "ogg",
        "audio/flac": "flac",
    }
    if content_type in ct_map:
        return ct_map[content_type]

    if filename:
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        ext_map = {"webm": "webm", "wav": "wav", "mp3": "mp3", "ogg": "ogg", "flac": "flac"}
        if ext in ext_map:
            return ext_map[ext]

    return "webm"

"""
Speech processing API endpoints.

Provides:
- POST /transcribe — Audio → text + language detection + translation
- POST /classify — Background complaint classification
- GET /languages — List supported languages
"""

import logging
import time
import traceback
from typing import Any, Dict, Optional

from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from fastapi.responses import JSONResponse

from app.schemas.speech import (
    TranscriptionResponse,
    BackgroundClassificationRequest,
    BackgroundClassificationResponse,
    SupportedLanguagesResponse,
    SupportedLanguage,
)
from app.services.speech_service import SpeechService
from app.core.config import settings
from app.core.logger import log_api_request

logger = logging.getLogger("app.api.speech")

router = APIRouter()

MAX_AUDIO_SIZE = 25 * 1024 * 1024
MIN_AUDIO_DURATION_BYTES = 1024

ALLOWED_AUDIO_TYPES = {
    "audio/webm",
    "audio/wav",
    "audio/x-wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/ogg",
    "audio/flac",
    "video/webm",
}


def _structured_error(
    status_code: int,
    stage: str,
    message: str,
    details: Optional[str] = None,
    suggestion: Optional[str] = None,
) -> JSONResponse:
    """Return a structured error response the frontend can display intelligently."""
    body: Dict[str, Any] = {
        "success": False,
        "stage": stage,
        "message": message,
    }
    if details:
        body["details"] = details
    if suggestion:
        body["suggestion"] = suggestion
    logger.error("Speech error | stage=%s | msg=%s | details=%s", stage, message, details or "")
    return JSONResponse(status_code=status_code, content=body)


@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file to transcribe"),
    language_code: Optional[str] = Form(None),
    speech_duration: Optional[float] = Form(None),
):
    t0 = time.perf_counter()
    request_id = f"sr-{int(t0 * 1000)}"

    logger.info("[%s] Speech request received", request_id)

    # ── 1. Check SARVAM_API_KEY ──────────────────────────────────────
    if not settings.SARVAM_API_KEY:
        logger.error("[%s] SARVAM_API_KEY is not configured", request_id)
        return _structured_error(
            500,
            stage="configuration",
            message="Sarvam API key is not configured on the server.",
            details="The SARVAM_API_KEY environment variable is missing or empty.",
            suggestion="Set SARVAM_API_KEY in backend/.env and restart the backend server.",
        )

    # ── 2. Read audio bytes ──────────────────────────────────────────
    content_type = file.content_type or "audio/webm"
    filename = file.filename or "recording.webm"

    logger.info(
        "[%s] Audio file | filename=%s | content_type=%s",
        request_id, filename, content_type,
    )

    try:
        audio_bytes = await file.read()
    except Exception as exc:
        logger.error("[%s] Failed to read uploaded file: %s", request_id, exc)
        return _structured_error(
            400,
            stage="upload",
            message="Failed to read the uploaded audio file.",
            details=str(exc),
        )

    size_mb = len(audio_bytes) / (1024 * 1024)
    logger.info("[%s] Audio size: %.2f MB (%d bytes)", request_id, size_mb, len(audio_bytes))

    # ── 3. Validate audio ────────────────────────────────────────────
    if len(audio_bytes) == 0:
        return _structured_error(
            400,
            stage="validation",
            message="The recorded audio is empty.",
            details="Audio file has 0 bytes. The recording may have failed to start.",
            suggestion="Please try recording again. Ensure your microphone is working.",
        )

    if len(audio_bytes) < MIN_AUDIO_DURATION_BYTES:
        return _structured_error(
            400,
            stage="validation",
            message="The recording is too short.",
            details=f"Audio is only {len(audio_bytes)} bytes. A meaningful recording should be at least 1KB.",
            suggestion="Please speak for at least 2-3 seconds before stopping the recording.",
        )

    if len(audio_bytes) > MAX_AUDIO_SIZE:
        max_mb = MAX_AUDIO_SIZE // (1024 * 1024)
        return _structured_error(
            413,
            stage="validation",
            message=f"Audio file too large (max {max_mb}MB).",
            details=f"Uploaded {size_mb:.1f}MB, limit is {max_mb}MB.",
            suggestion="Try recording a shorter clip.",
        )

    # ── 4. Detect format ─────────────────────────────────────────────
    audio_format = _detect_audio_format(content_type, filename)
    logger.info("[%s] Audio format: %s", request_id, audio_format)

    # ── 5. Call transcription pipeline ───────────────────────────────
    try:
        result = await SpeechService.transcribe_audio(
            audio_bytes=audio_bytes,
            audio_format=audio_format,
            language_hint=language_code,
            speech_duration=speech_duration,
        )
    except Exception as exc:
        tb = traceback.format_exc()
        logger.error(
            "[%s] Transcription pipeline crashed:\n%s",
            request_id, tb,
        )
        return _structured_error(
            500,
            stage="pipeline",
            message="An unexpected error occurred during speech processing.",
            details=f"{type(exc).__name__}: {exc}",
        )

    latency = (time.perf_counter() - t0) * 1000

    # ── 6. Check for pipeline-level failure ──────────────────────────
    if not result.get("success"):
        stage = result.get("error_stage", "transcription")
        raw_error = result.get("error", "Unknown error")

        logger.warning(
            "[%s] Transcription failed at stage=%s | error=%s | %.0fms",
            request_id, stage, raw_error, latency,
        )

        return JSONResponse(
            status_code=200,
            content={
                "success": False,
                "stage": stage,
                "message": raw_error,
                "language": result.get("language", "Unknown"),
                "language_code": result.get("language_code", "unknown"),
                "confidence": 0.0,
                "original_text": "",
                "english_translation": "",
                "speech_duration_seconds": speech_duration or 0.0,
            },
        )

    # ── 7. Success ───────────────────────────────────────────────────
    logger.info(
        "[%s] SUCCESS | lang=%s | confidence=%.2f | chars=%d | %.0fms",
        request_id,
        result.get("language"),
        result.get("confidence", 0),
        len(result.get("original_text", "")),
        latency,
    )

    return {
        "success": True,
        "language": result.get("language", "Unknown"),
        "language_code": result.get("language_code", "unknown"),
        "confidence": result.get("confidence", 0.0),
        "original_text": result.get("original_text", ""),
        "english_translation": result.get("english_translation", ""),
        "speech_duration_seconds": speech_duration or result.get("speech_duration_seconds", 0.0),
    }


@router.post("/classify", response_model=BackgroundClassificationResponse)
async def classify_complaint(request: BackgroundClassificationRequest):
    t0 = time.perf_counter()

    if not settings.SARVAM_API_KEY:
        return BackgroundClassificationResponse(
            success=False,
            error="Sarvam API key not configured",
        )

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
        tb = traceback.format_exc()
        logger.error("Classification crashed:\n%s", tb)
        return BackgroundClassificationResponse(
            success=False,
            error=f"{type(exc).__name__}: {exc}",
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


@router.get("/health")
async def speech_health():
    """Health check for speech subsystem."""
    has_key = bool(settings.SARVAM_API_KEY)
    return {
        "sarvam_api_key_configured": has_key,
        "sarvam_base_url": settings.SARVAM_BASE_URL,
        "timeout": settings.SARVAM_TIMEOUT,
    }


def _detect_audio_format(content_type: str, filename: Optional[str] = None) -> str:
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

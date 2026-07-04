"""
Speech processing service.

Coordinates Sarvam STT, language detection, and translation.
Provides a clean interface for the speech API endpoint.
"""

import logging
import time
from typing import Any, Dict, Optional

from app.ai import speech as speech_ai
from app.ai.ai_service import AIService

logger = logging.getLogger("app.services.speech")


class SpeechService:
    """Handles speech processing: STT, language detection, translation."""

    @staticmethod
    async def transcribe_audio(
        audio_bytes: bytes,
        audio_format: str = "webm",
        language_hint: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Full transcription pipeline: audio → text → detect language → translate.

        Returns structured response with original text, translation, and metadata.
        """
        t0 = time.perf_counter()

        logger.info(
            "SpeechService.transcribe_audio | bytes=%d | format=%s | hint=%s",
            len(audio_bytes),
            audio_format,
            language_hint or "auto",
        )

        # Use the speech AI pipeline
        result = await speech_ai.process_voice_complaint(
            audio_bytes=audio_bytes,
            audio_format=audio_format,
            language_code=language_hint,
        )

        latency = time.perf_counter() - t0
        logger.info(
            "Transcription complete | success=%s | lang=%s | latency=%.2fs",
            result.get("success"),
            result.get("language"),
            latency,
        )

        return result

    @staticmethod
    async def classify_complaint_text(
        title: str,
        description: str,
        category: Optional[str] = None,
        original_language: Optional[str] = None,
        english_translation: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Background classification of complaint text using AI.

        Sends text to Sarvam for category, department, sector, severity detection.
        Used for real-time predictions before the user reaches Step 5.
        """
        t0 = time.perf_counter()

        # Use English translation for classification if available, else original
        text_for_classification = english_translation or description

        logger.info(
            "Background classification | title=%s... | lang=%s",
            title[:40],
            original_language or "unknown",
        )

        # Call AI classification
        classification = await AIService.classify_complaint(
            title=title,
            description=text_for_classification,
            language=original_language or "en",
        )

        # Also detect department and severity in parallel-ish
        department_result = await AIService.detect_department(
            title=title,
            description=text_for_classification,
            category=category or classification.get("category", "other"),
        )

        latency = time.perf_counter() - t0
        logger.info(
            "Classification complete | category=%s | dept=%s | severity=%s | latency=%.2fs",
            classification.get("category"),
            department_result.get("department"),
            classification.get("severity"),
            latency,
        )

        return {
            "detected_category": classification.get("category", category or "other"),
            "detected_department": department_result.get("department", "General Administration"),
            "detected_sector": classification.get("sector", department_result.get("sector", "General")),
            "severity": classification.get("severity", "medium"),
            "priority_score": _calculate_priority(
                classification.get("severity", "medium"),
                classification.get("confidence", 0.5),
            ),
            "confidence": classification.get("confidence", 0.5),
            "keywords": classification.get("keywords", []),
            "estimated_resolution_days": department_result.get("estimated_days", 14),
        }

    @staticmethod
    def get_supported_languages() -> list:
        """Return list of supported speech languages."""
        return speech_ai.get_supported_languages()


def _calculate_priority(severity: str, confidence: float) -> float:
    """Calculate priority score from severity and confidence."""
    severity_scores = {
        "critical": 90,
        "high": 70,
        "medium": 45,
        "low": 20,
    }
    base = severity_scores.get(severity, 45)
    # Confidence modifier
    return min(100.0, base * (0.7 + 0.3 * confidence))

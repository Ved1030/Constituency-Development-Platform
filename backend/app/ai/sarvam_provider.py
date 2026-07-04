"""
Sarvam AI provider implementation.

ALL Sarvam API communication lives exclusively in this file.
To swap providers, change DEFAULT_AI_PROVIDER — this file is never
imported by business logic directly.

Sarvam API reference (OpenAI-compatible):
    Base URL  : https://api.sarvam.ai
    Auth      : api-subscription-key header
    Chat      : POST /chat/completions
    Translate : POST /translate
    STT       : POST /speech-to-text
    TTS       : POST /text-to-speech
"""

import json
import logging
import time
from typing import Any, Dict, List, Optional

import httpx

from app.ai.provider import AIProvider, AIResponse
from app.core.config import settings

logger = logging.getLogger("app.ai.sarvam")


# ---------------------------------------------------------------------------
# Sarvam-specific request/response models
# ---------------------------------------------------------------------------
class SarvamProvider(AIProvider):
    """Sarvam AI provider – the current default."""

    provider_name = "sarvam"

    BASE_URL: str = "https://api.sarvam.ai"
    CHAT_ENDPOINT = "/chat/completions"
    TRANSLATE_ENDPOINT = "/translate"
    STT_ENDPOINT = "/speech-to-text"
    TTS_ENDPOINT = "/text-to-speech"

    def __init__(self) -> None:
        self._api_key: str = settings.SARVAM_API_KEY or ""
        self._model: str = settings.SARVAM_MODEL
        self._timeout: int = settings.SARVAM_TIMEOUT

    # -- Helpers -----------------------------------------------------------
    def _headers(self, extra: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        h = {
            "api-subscription-key": self._api_key,
            "Content-Type": "application/json",
        }
        if extra:
            h.update(extra)
        return h

    def _multipart_headers(self) -> Dict[str, str]:
        return {"api-subscription-key": self._api_key}

    async def _post(
        self,
        path: str,
        payload: Dict[str, Any],
        *,
        timeout: Optional[int] = None,
    ) -> Dict[str, Any]:
        """POST JSON to a Sarvam endpoint and return the parsed body."""
        url = f"{self.BASE_URL}{path}"
        t0 = time.perf_counter()

        try:
            async with httpx.AsyncClient(timeout=timeout or self._timeout) as client:
                resp = await client.post(
                    url,
                    json=payload,
                    headers=self._headers(),
                )
                resp.raise_for_status()
                data = resp.json()
        except httpx.TimeoutException:
            latency = (time.perf_counter() - t0) * 1000
            logger.error("Sarvam timeout: %s | %.0fms", path, latency)
            raise
        except httpx.HTTPStatusError as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error(
                "Sarvam HTTP %d: %s | %.0fms | body=%s",
                exc.response.status_code,
                path,
                latency,
                exc.response.text[:500],
            )
            raise
        except Exception as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error("Sarvam request failed: %s | %.0fms | %s", path, latency, exc)
            raise

        latency = (time.perf_counter() - t0) * 1000
        logger.debug("Sarvam %s | %.0fms", path, latency)
        return data

    async def _post_multipart(
        self,
        path: str,
        files: Dict[str, Any],
        data: Optional[Dict[str, Any]] = None,
        *,
        timeout: Optional[int] = None,
    ) -> Dict[str, Any]:
        """POST multipart/form-data to a Sarvam endpoint."""
        url = f"{self.BASE_URL}{path}"
        t0 = time.perf_counter()

        try:
            async with httpx.AsyncClient(timeout=timeout or self._timeout) as client:
                resp = await client.post(
                    url,
                    files=files,
                    data=data or {},
                    headers=self._multipart_headers(),
                )
                resp.raise_for_status()
                result = resp.json()
        except Exception as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error("Sarvam multipart failed: %s | %.0fms | %s", path, latency, exc)
            raise

        latency = (time.perf_counter() - t0) * 1000
        logger.debug("Sarvam multipart %s | %.0fms", path, latency)
        return result

    # -- Text generation (chat completions) ---------------------------------
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        *,
        temperature: float = 0.3,
        max_tokens: int = 2048,
        system_prompt: Optional[str] = None,
    ) -> AIResponse:
        t0 = time.perf_counter()

        full_messages = list(messages)
        if system_prompt:
            full_messages.insert(0, {"role": "system", "content": system_prompt})

        payload = {
            "model": self._model,
            "messages": full_messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }

        try:
            data = await self._post(self.CHAT_ENDPOINT, payload)
            latency = (time.perf_counter() - t0) * 1000

            choice = data.get("choices", [{}])[0]
            content = choice.get("message", {}).get("content", "")
            usage = data.get("usage", {})
            tokens = usage.get("total_tokens", 0)

            logger.info(
                "Chat completion | model=%s | tokens=%d | %.0fms",
                self._model,
                tokens,
                latency,
            )

            return AIResponse(
                success=True,
                content=content,
                raw=data,
                model=self._model,
                latency_ms=latency,
                tokens_used=tokens,
            )
        except Exception as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error("Chat completion failed: %s | %.0fms", exc, latency)
            return AIResponse(
                success=False,
                error=str(exc),
                model=self._model,
                latency_ms=latency,
            )

    # -- Translation --------------------------------------------------------
    async def translate(
        self,
        text: str,
        *,
        source_language: str,
        target_language: str,
    ) -> AIResponse:
        t0 = time.perf_counter()

        # Sarvam translate API uses specific language codes
        src = _normalise_lang_code(source_language)
        tgt = _normalise_lang_code(target_language)

        payload = {
            "input": text,
            "source_language_code": src,
            "target_language_code": tgt,
            "mode": "formal",
            "model": "mayura:v2",
        }

        try:
            data = await self._post(self.TRANSLATE_ENDPOINT, payload)
            latency = (time.perf_counter() - t0) * 1000

            translated = data.get("translated_text", "")
            logger.info(
                "Translation | %s→%s | chars=%d | %.0fms",
                src,
                tgt,
                len(text),
                latency,
            )

            return AIResponse(
                success=True,
                content=translated,
                raw=data,
                model="mayura:v2",
                latency_ms=latency,
            )
        except Exception as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error("Translation failed: %s→%s | %s", src, tgt, exc)
            return AIResponse(
                success=False,
                error=str(exc),
                model="mayura:v2",
                latency_ms=latency,
            )

    # -- Speech-to-text -----------------------------------------------------
    async def speech_to_text(
        self,
        audio_bytes: bytes,
        *,
        language_code: str = "hi-IN",
        audio_format: str = "wav",
    ) -> AIResponse:
        t0 = time.perf_counter()
        lang = _normalise_lang_code(language_code)

        try:
            files = {
                "file": (f"audio.{audio_format}", audio_bytes, f"audio/{audio_format}"),
            }
            data_payload = {
                "model": "saarika:v2",
                "language_code": lang,
            }

            data = await self._post_multipart(
                self.STT_ENDPOINT,
                files=files,
                data=data_payload,
            )
            latency = (time.perf_counter() - t0) * 1000

            transcript = data.get("transcript", "")
            logger.info(
                "STT | lang=%s | chars=%d | %.0fms",
                lang,
                len(transcript),
                latency,
            )

            return AIResponse(
                success=True,
                content=transcript,
                raw=data,
                model="saarika:v2",
                latency_ms=latency,
            )
        except Exception as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error("STT failed: lang=%s | %s", lang, exc)
            return AIResponse(
                success=False,
                error=str(exc),
                model="saarika:v2",
                latency_ms=latency,
            )

    # -- Text-to-speech -----------------------------------------------------
    async def text_to_speech(
        self,
        text: str,
        *,
        language_code: str = "hi-IN",
        voice_id: str = "meera",
    ) -> AIResponse:
        t0 = time.perf_counter()
        lang = _normalise_lang_code(language_code)

        payload = {
            "input": text,
            "model": "bulbul:v1",
            "language_code": lang,
            "voice_id": voice_id,
        }

        try:
            url = f"{self.BASE_URL}{self.TTS_ENDPOINT}"
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                resp = await client.post(
                    url,
                    json=payload,
                    headers=self._headers(),
                )
                resp.raise_for_status()
                # TTS returns audio bytes
                audio_data = resp.content
                latency = (time.perf_counter() - t0) * 1000

                logger.info(
                    "TTS | lang=%s | voice=%s | bytes=%d | %.0fms",
                    lang,
                    voice_id,
                    len(audio_data),
                    latency,
                )

                return AIResponse(
                    success=True,
                    content=audio_data.hex(),  # hex-encoded audio for transport
                    raw={"audio_size": len(audio_data)},
                    model="bulbul:v1",
                    latency_ms=latency,
                )
        except Exception as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error("TTS failed: lang=%s | %s", lang, exc)
            return AIResponse(
                success=False,
                error=str(exc),
                model="bulbul:v1",
                latency_ms=latency,
            )

    # -- Image analysis (placeholder for future Sarvam vision) --------------
    async def analyze_image(
        self,
        image_bytes: bytes,
        *,
        prompt: str = "Describe this image in detail.",
        mime_type: str = "image/jpeg",
    ) -> AIResponse:
        """
        Placeholder — Sarvam does not yet offer a vision endpoint.
        Architecture supports swapping to Gemini Vision later by changing
        DEFAULT_AI_PROVIDER.
        """
        logger.warning("Sarvam does not support image analysis yet — returning placeholder")
        return AIResponse(
            success=True,
            content="Image analysis not available via Sarvam. Configure Gemini provider for vision.",
            raw={"placeholder": True},
            model="none",
        )

    # -- Health check -------------------------------------------------------
    async def health_check(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                resp = await client.get(
                    f"{self.BASE_URL}/models",
                    headers=self._headers(),
                )
                return resp.status_code == 200
        except Exception:
            return False


# ---------------------------------------------------------------------------
# Sarvam language-code normalisation
# ---------------------------------------------------------------------------
_LANG_MAP: Dict[str, str] = {
    "english": "en-IN",
    "hindi": "hi-IN",
    "marathi": "mr-IN",
    "gujarati": "gu-IN",
    "tamil": "ta-IN",
    "telugu": "te-IN",
    "kannada": "kn-IN",
    "malayalam": "ml-IN",
    "punjabi": "pa-IN",
    "bengali": "bn-IN",
    "odia": "od-IN",
    "assamese": "as-IN",
    "urdu": "ur-IN",
    "nepali": "ne-IN",
    "sindhi": "sd-IN",
    "kashmiri": "ks-IN",
    "konkani": "kok-IN",
    "maithili": "mai-IN",
    "sanskrit": "sa-IN",
}


def _normalise_lang_code(code: str) -> str:
    """Accept 'hindi', 'hi', 'hi-IN' — return Sarvam-expected 'hi-IN'."""
    code = code.strip().lower()
    if code in _LANG_MAP:
        return _LANG_MAP[code]
    if len(code) == 2:
        return f"{code}-IN"
    return code.upper() if len(code) <= 5 else code

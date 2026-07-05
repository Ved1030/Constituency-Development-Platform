"""
Sarvam AI provider implementation.

ALL Sarvam API communication lives exclusively in this file.
To swap providers, change DEFAULT_AI_PROVIDER — this file is never
imported by business logic directly.

Sarvam API reference:
    Base URL  : https://api.sarvam.ai
    Auth      : api-subscription-key header
    Chat      : POST /v1/chat/completions  (model: sarvam-30b / sarvam-105b)
    Translate : POST /translate            (model: mayura:v2)
    STT       : POST /speech-to-text       (model: saaras:v3)
    TTS       : POST /text-to-speech       (model: bulbul:v3)
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
    CHAT_ENDPOINT = "/v1/chat/completions"
    TRANSLATE_ENDPOINT = "/translate"
    STT_ENDPOINT = "/speech-to-text"
    TTS_ENDPOINT = "/text-to-speech"

    STT_MODEL = "saaras:v3"
    TTS_MODEL = "bulbul:v3"
    TRANSLATE_MODEL = "mayura:v2"

    def __init__(self) -> None:
        self._api_key: str = settings.SARVAM_API_KEY or ""
        self._model: str = settings.SARVAM_MODEL
        self._timeout: int = settings.SARVAM_TIMEOUT

        # Log configuration on startup
        logger.info("=" * 60)
        logger.info("Sarvam Configuration")
        logger.info("  Provider : %s", self.provider_name)
        logger.info("  Chat Model : %s", self._model)
        logger.info("  STT Model : %s", self.STT_MODEL)
        logger.info("  TTS Model : %s", self.TTS_MODEL)
        logger.info("  Translate Model : %s", self.TRANSLATE_MODEL)
        logger.info("  Base URL : %s", self.BASE_URL)
        logger.info("  API Key : %s", "Loaded" if self._api_key else "MISSING")
        logger.info("  Timeout : %ds", self._timeout)
        logger.info("=" * 60)

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

        if not self._api_key:
            raise ValueError("SARVAM_API_KEY is not configured. Set it in backend/.env")

        try:
            async with httpx.AsyncClient(timeout=timeout or self._timeout) as client:
                resp = await client.post(
                    url,
                    files=files,
                    data=data or {},
                    headers=self._multipart_headers(),
                )

                latency = (time.perf_counter() - t0) * 1000

                if resp.status_code == 401:
                    body_text = resp.text[:500]
                    logger.error(
                        "Sarvam auth failed (401): %s | %.0fms | body=%s",
                        path, latency, body_text,
                    )
                    raise ValueError(
                        f"Sarvam API authentication failed (401). "
                        f"Check your SARVAM_API_KEY. Response: {body_text[:200]}"
                    )

                if resp.status_code == 429:
                    logger.error("Sarvam rate limited (429): %s | %.0fms", path, latency)
                    raise ValueError("Sarvam API rate limit exceeded. Please try again in a few seconds.")

                if resp.status_code >= 400:
                    body_text = resp.text[:500]
                    logger.error(
                        "Sarvam HTTP %d: %s | %.0fms | body=%s",
                        resp.status_code, path, latency, body_text,
                    )
                    raise ValueError(
                        f"Sarvam API returned HTTP {resp.status_code}. "
                        f"Response: {body_text[:200]}"
                    )

                result = resp.json()
        except ValueError:
            raise
        except httpx.TimeoutException:
            latency = (time.perf_counter() - t0) * 1000
            logger.error("Sarvam timeout: %s | %.0fms", path, latency)
            raise ValueError(
                f"Sarvam API timed out after {timeout or self._timeout}s. "
                f"The audio may be too long. Try a shorter recording."
            )
        except httpx.ConnectError as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error("Sarvam connection failed: %s | %.0fms | %s", path, latency, exc)
            raise ValueError(
                f"Cannot connect to Sarvam API. Check your internet connection. "
                f"Details: {exc}"
            )
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

        logger.info(
            "Calling Sarvam\n"
            "  Endpoint : %s\n"
            "  Method   : POST\n"
            "  Model    : %s\n"
            "  Payload  : messages=%d, temperature=%.2f, max_tokens=%d",
            self.CHAT_ENDPOINT, self._model, len(full_messages), temperature, max_tokens,
        )

        try:
            data = await self._post(self.CHAT_ENDPOINT, payload)
            latency = (time.perf_counter() - t0) * 1000

            choice = data.get("choices", [{}])[0]
            content = choice.get("message", {}).get("content", "")
            usage = data.get("usage", {})
            tokens = usage.get("total_tokens", 0)

            logger.info(
                "Sarvam chat completion OK | model=%s | tokens=%d | %.0fms",
                self._model, tokens, latency,
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
            logger.error(
                "Sarvam chat completion FAILED\n"
                "  Endpoint : %s\n"
                "  Model    : %s\n"
                "  Error    : %s\n"
                "  Latency  : %.0fms",
                self.CHAT_ENDPOINT, self._model, exc, latency,
            )
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
            "model": self.TRANSLATE_MODEL,
        }

        logger.info(
            "Calling Sarvam\n"
            "  Endpoint : %s\n"
            "  Method   : POST\n"
            "  Model    : %s\n"
            "  Payload  : %s→%s, chars=%d",
            self.TRANSLATE_ENDPOINT, self.TRANSLATE_MODEL, src, tgt, len(text),
        )

        try:
            data = await self._post(self.TRANSLATE_ENDPOINT, payload)
            latency = (time.perf_counter() - t0) * 1000

            translated = data.get("translated_text", "")
            logger.info(
                "Sarvam translate OK | model=%s | %s→%s | chars=%d→%d | %.0fms",
                self.TRANSLATE_MODEL, src, tgt, len(text), len(translated), latency,
            )

            return AIResponse(
                success=True,
                content=translated,
                raw=data,
                model=self.TRANSLATE_MODEL,
                latency_ms=latency,
            )
        except Exception as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error(
                "Sarvam translate FAILED\n"
                "  Endpoint : %s\n"
                "  Model    : %s\n"
                "  Route    : %s→%s\n"
                "  Error    : %s\n"
                "  Latency  : %.0fms",
                self.TRANSLATE_ENDPOINT, self.TRANSLATE_MODEL, src, tgt, exc, latency,
            )
            return AIResponse(
                success=False,
                error=str(exc),
                model=self.TRANSLATE_MODEL,
                latency_ms=latency,
            )

    # -- Speech-to-text -----------------------------------------------------
    async def speech_to_text(
        self,
        audio_bytes: bytes,
        *,
        language_code: str = "auto",
        audio_format: str = "wav",
    ) -> AIResponse:
        t0 = time.perf_counter()
        is_auto = language_code.strip().lower() in ("auto", "")
        lang = "auto" if is_auto else _normalise_lang_code(language_code)

        logger.info(
            "Calling Sarvam\n"
            "  Endpoint : %s\n"
            "  Method   : POST (multipart)\n"
            "  Model    : %s\n"
            "  Payload  : lang=%s (auto=%s), audio_bytes=%d, format=%s",
            self.STT_ENDPOINT, self.STT_MODEL, lang, is_auto, len(audio_bytes), audio_format,
        )

        try:
            files = {
                "file": (f"audio.{audio_format}", audio_bytes, f"audio/{audio_format}"),
            }
            # When language_code is "auto", omit it from the payload so Sarvam
            # auto-detects the spoken language.  Only send it when explicitly
            # specified (e.g. user selected a language before recording).
            data_payload: Dict[str, str] = {"model": self.STT_MODEL}
            if not is_auto:
                data_payload["language_code"] = lang

            data = await self._post_multipart(
                self.STT_ENDPOINT,
                files=files,
                data=data_payload,
            )
            latency = (time.perf_counter() - t0) * 1000

            transcript = data.get("transcript", "")
            detected_lang = data.get("language_code", lang if not is_auto else "")

            logger.info(
                "Sarvam STT OK | model=%s | requested_lang=%s | detected_lang=%s | chars=%d | latency=%.0fms",
                self.STT_MODEL, lang, detected_lang, len(transcript), latency,
            )

            return AIResponse(
                success=True,
                content=transcript,
                raw={"language_code": detected_lang, "raw_sarvam_response": data},
                model=self.STT_MODEL,
                latency_ms=latency,
            )
        except ValueError as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error(
                "Sarvam STT FAILED\n"
                "  Endpoint : %s\n"
                "  Model    : %s\n"
                "  Lang     : %s\n"
                "  Error    : %s\n"
                "  Latency  : %.0fms",
                self.STT_ENDPOINT, self.STT_MODEL, lang, exc, latency,
            )
            return AIResponse(
                success=False,
                error=str(exc),
                model=self.STT_MODEL,
                latency_ms=latency,
            )
        except Exception as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error(
                "Sarvam STT FAILED\n"
                "  Endpoint : %s\n"
                "  Model    : %s\n"
                "  Lang     : %s\n"
                "  Error    : %s\n"
                "  Latency  : %.0fms",
                self.STT_ENDPOINT, self.STT_MODEL, lang, exc, latency,
            )
            return AIResponse(
                success=False,
                error=f"Sarvam STT error: {type(exc).__name__}: {exc}",
                model=self.STT_MODEL,
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
            "model": self.TTS_MODEL,
            "language_code": lang,
            "voice_id": voice_id,
        }

        logger.info(
            "Calling Sarvam\n"
            "  Endpoint : %s\n"
            "  Method   : POST\n"
            "  Model    : %s\n"
            "  Payload  : lang=%s, voice=%s, chars=%d",
            self.TTS_ENDPOINT, self.TTS_MODEL, lang, voice_id, len(text),
        )

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
                    "Sarvam TTS OK | model=%s | lang=%s | bytes=%d | %.0fms",
                    self.TTS_MODEL, lang, len(audio_data), latency,
                )

                return AIResponse(
                    success=True,
                    content=audio_data.hex(),  # hex-encoded audio for transport
                    raw={"audio_size": len(audio_data)},
                    model=self.TTS_MODEL,
                    latency_ms=latency,
                )
        except Exception as exc:
            latency = (time.perf_counter() - t0) * 1000
            logger.error(
                "Sarvam TTS FAILED\n"
                "  Endpoint : %s\n"
                "  Model    : %s\n"
                "  Lang     : %s\n"
                "  Error    : %s\n"
                "  Latency  : %.0fms",
                self.TTS_ENDPOINT, self.TTS_MODEL, lang, exc, latency,
            )
            return AIResponse(
                success=False,
                error=str(exc),
                model=self.TTS_MODEL,
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

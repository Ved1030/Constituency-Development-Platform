"""
Abstract AI Provider interface.

All business logic calls AIProvider — never a concrete implementation.
To swap providers, change DEFAULT_AI_PROVIDER env var only.

Call chain:
    Business Layer → AIService → AIProvider (this) → SarvamProvider / GeminiProvider / …
"""

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

logger = logging.getLogger("app.ai.provider")


# ---------------------------------------------------------------------------
# Standardised response container
# ---------------------------------------------------------------------------
@dataclass
class AIResponse:
    """Uniform response wrapper returned by every provider method."""

    success: bool = True
    content: str = ""
    raw: Dict[str, Any] = field(default_factory=dict)
    model: str = ""
    latency_ms: float = 0.0
    tokens_used: int = 0
    error: Optional[str] = None

    @property
    def failed(self) -> bool:
        return not self.success or self.error is not None


# ---------------------------------------------------------------------------
# Abstract provider
# ---------------------------------------------------------------------------
class AIProvider(ABC):
    """
    Contract every AI provider must fulfil.

    Methods are grouped by capability.  A provider that does not support
    a capability should raise ``NotImplementedError`` – the AIService
    layer catches this and falls back gracefully.
    """

    provider_name: str = "base"

    # -- Text generation ----------------------------------------------------
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        *,
        temperature: float = 0.3,
        max_tokens: int = 2048,
        system_prompt: Optional[str] = None,
    ) -> AIResponse:
        """
        Send a chat-completion request and return the assistant message.

        Providers that do NOT support text generation should override this
        to return a clear "not supported" response — never raise 404s.
        """
        logger.warning(
            "chat_completion not implemented by %s — returning not-supported",
            self.provider_name,
        )
        return AIResponse(
            success=False,
            error=f"Text generation (chat completion) is not supported by {self.provider_name}. "
                  f"This provider only supports: STT, Translation, TTS.",
            model=self.provider_name,
        )

    async def generate_text(
        self,
        prompt: str,
        *,
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> AIResponse:
        """
        Convenience wrapper: single prompt → text response.

        Providers that do NOT support text generation should override this
        to return a clear "not supported" response.
        """
        logger.warning(
            "generate_text not implemented by %s — returning not-supported",
            self.provider_name,
        )
        return AIResponse(
            success=False,
            error=f"Text generation is not supported by {self.provider_name}. "
                  f"This provider only supports: STT, Translation, TTS.",
            model=self.provider_name,
        )

    # -- Translation --------------------------------------------------------
    @abstractmethod
    async def translate(
        self,
        text: str,
        *,
        source_language: str,
        target_language: str,
    ) -> AIResponse:
        """Translate text between languages."""
        ...

    # -- Speech-to-text -----------------------------------------------------
    @abstractmethod
    async def speech_to_text(
        self,
        audio_bytes: bytes,
        *,
        language_code: str = "hi-IN",
        audio_format: str = "wav",
    ) -> AIResponse:
        """Transcribe audio to text."""
        ...

    # -- Text-to-speech -----------------------------------------------------
    @abstractmethod
    async def text_to_speech(
        self,
        text: str,
        *,
        language_code: str = "hi-IN",
        voice_id: str = "meera",
    ) -> AIResponse:
        """Synthesise speech from text.  ``content`` holds the audio URL/data."""
        ...

    # -- Image analysis (vision) --------------------------------------------
    async def analyze_image(
        self,
        image_bytes: bytes,
        *,
        prompt: str = "Describe this image in detail.",
        mime_type: str = "image/jpeg",
    ) -> AIResponse:
        """Analyse an image.  Default raises — override in providers with vision."""
        raise NotImplementedError("Image analysis not supported by this provider")

    # -- Health / info ------------------------------------------------------
    async def health_check(self) -> bool:
        """Return True if the provider is reachable."""
        return True

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} provider={self.provider_name}>"

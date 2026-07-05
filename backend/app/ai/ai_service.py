"""
AI Service — the single entry point for all AI capabilities.

Business logic calls AIService methods, never the provider directly.
AIService selects the correct provider based on DEFAULT_AI_PROVIDER
and handles fallbacks, retries, and error wrapping.

Call chain:
    Services → AIService → AIProvider → SarvamProvider → Sarvam API
"""

import json
import logging
import time
from typing import Any, Dict, List, Optional

from app.ai.provider import AIProvider, AIResponse
from app.ai import prompts
from app.core.config import settings
from app.core.logger import log_ai_step

logger = logging.getLogger("app.ai.service")


# ═══════════════════════════════════════════════════════════════════════════
# Provider factory
# ═══════════════════════════════════════════════════════════════════════════

_provider_instance: Optional[AIProvider] = None


def _get_provider() -> AIProvider:
    """Lazy-initialise and return the configured AI provider."""
    global _provider_instance
    if _provider_instance is not None:
        return _provider_instance

    provider_name = settings.DEFAULT_AI_PROVIDER.lower()

    if provider_name == "sarvam":
        from app.ai.sarvam_provider import SarvamProvider
        _provider_instance = SarvamProvider()
    # elif provider_name == "gemini":
    #     from app.ai.gemini_provider import GeminiProvider
    #     _provider_instance = GeminiProvider()
    # elif provider_name == "openai":
    #     from app.ai.openai_provider import OpenAIProvider
    #     _provider_instance = OpenAIProvider()
    else:
        raise ValueError(f"Unknown AI provider: {provider_name}")

    logger.info("AI provider initialised: %s", _provider_instance.provider_name)
    return _provider_instance


def reset_provider() -> None:
    """Force re-initialisation of the provider (useful for env changes)."""
    global _provider_instance
    _provider_instance = None


# ═══════════════════════════════════════════════════════════════════════════
# Helper: parse JSON from AI response
# ═══════════════════════════════════════════════════════════════════════════

def _parse_json_response(text: str) -> Dict[str, Any]:
    """Extract a JSON object/array from AI text that may contain markdown fences."""
    text = text.strip()
    # Strip markdown code fences
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find a JSON substring
        for start_char, end_char in [("{", "}"), ("[", "]")]:
            start = text.find(start_char)
            end = text.rfind(end_char)
            if start != -1 and end > start:
                try:
                    return json.loads(text[start : end + 1])
                except json.JSONDecodeError:
                    continue
        return {"raw": text}


# ═══════════════════════════════════════════════════════════════════════════
# AIService
# ═══════════════════════════════════════════════════════════════════════════

class AIService:
    """
    Facade for all AI capabilities.

    Every method is async, returns structured results, and logs every step.
    """

    # -- Low-level ----------------------------------------------------------
    @staticmethod
    def provider() -> AIProvider:
        return _get_provider()

    # -- Classification -----------------------------------------------------
    @staticmethod
    async def classify_complaint(
        title: str,
        description: str,
        location: str = "",
        language: str = "en",
    ) -> Dict[str, Any]:
        """Classify a complaint into category, department, severity."""
        t0 = time.perf_counter()
        log_ai_step("classify_complaint_start", title=title[:60])

        prompt = prompts.classify_complaint_prompt(title, description, location, language)
        resp = await _get_provider().generate_text(
            prompt,
            system_prompt=prompts.SYSTEM_PROMPT_CLASSIFIER,
            temperature=0.2,
        )

        result = _parse_json_response(resp.content) if resp.success else {}
        latency = (time.perf_counter() - t0) * 1000

        log_ai_step(
            "classify_complaint_done",
            category=result.get("category", "?"),
            department=result.get("department", "?"),
            severity=result.get("severity", "?"),
            confidence=result.get("confidence", 0),
            latency_ms=round(latency),
        )

        result.setdefault("category", "other")
        result.setdefault("department", "General Administration")
        result.setdefault("severity", "medium")
        result.setdefault("sector", "General")
        result.setdefault("confidence", 0.5)
        result.setdefault("keywords", [])
        return result

    # -- Department detection -----------------------------------------------
    @staticmethod
    async def detect_department(
        title: str,
        description: str,
        category: str = "",
    ) -> Dict[str, Any]:
        """Detect the correct government department for a complaint."""
        t0 = time.perf_counter()

        prompt = prompts.detect_department_prompt(title, description, category)
        resp = await _get_provider().generate_text(
            prompt,
            system_prompt=prompts.SYSTEM_PROMPT_CLASSIFIER,
            temperature=0.2,
        )

        result = _parse_json_response(resp.content) if resp.success else {}
        latency = (time.perf_counter() - t0) * 1000

        log_ai_step(
            "detect_department_done",
            department=result.get("department", "?"),
            confidence=result.get("confidence", 0),
            latency_ms=round(latency),
        )

        result.setdefault("department", "General Administration")
        result.setdefault("sector", "General")
        result.setdefault("estimated_days", 14)
        result.setdefault("confidence", 0.5)
        return result

    # -- Severity prediction ------------------------------------------------
    @staticmethod
    async def detect_severity(
        title: str,
        description: str,
        category: str = "",
        duplicate_count: int = 0,
    ) -> Dict[str, Any]:
        """Predict complaint severity."""
        t0 = time.perf_counter()

        prompt = prompts.detect_severity_prompt(title, description, category, duplicate_count)
        resp = await _get_provider().generate_text(
            prompt,
            system_prompt=prompts.SYSTEM_PROMPT_CLASSIFIER,
            temperature=0.2,
        )

        result = _parse_json_response(resp.content) if resp.success else {}
        latency = (time.perf_counter() - t0) * 1000

        log_ai_step(
            "detect_severity_done",
            severity=result.get("severity", "?"),
            priority_score=result.get("priority_score", 0),
            latency_ms=round(latency),
        )

        result.setdefault("severity", "medium")
        result.setdefault("priority_score", 50)
        result.setdefault("confidence", 0.5)
        return result

    # -- Summarization ------------------------------------------------------
    @staticmethod
    async def summarize(title: str, description: str) -> str:
        """Summarize a complaint into 1-2 sentences."""
        t0 = time.perf_counter()

        prompt = prompts.summarize_complaint_prompt(title, description)
        resp = await _get_provider().generate_text(
            prompt,
            system_prompt=prompts.SYSTEM_PROMPT_SUMMARY,
            temperature=0.3,
            max_tokens=256,
        )

        latency = (time.perf_counter() - t0) * 1000
        log_ai_step("summarize_done", chars=len(resp.content), latency_ms=round(latency))

        return resp.content if resp.success else title

    @staticmethod
    async def summarize_cluster(
        cluster_title: str,
        report_count: int,
        sample_descriptions: List[str],
    ) -> str:
        """Summarise a cluster of duplicate complaints."""
        prompt = prompts.summarize_cluster_prompt(cluster_title, report_count, sample_descriptions)
        resp = await _get_provider().generate_text(
            prompt,
            system_prompt=prompts.SYSTEM_PROMPT_SUMMARY,
            temperature=0.3,
            max_tokens=256,
        )
        return resp.content if resp.success else cluster_title

    # -- Keyword extraction -------------------------------------------------
    @staticmethod
    async def extract_keywords(text: str) -> List[str]:
        """Extract relevant keywords from complaint text."""
        t0 = time.perf_counter()

        prompt = prompts.extract_keywords_prompt(text)
        resp = await _get_provider().generate_text(
            prompt,
            system_prompt=prompts.SYSTEM_PROMPT_KEYWORDS,
            temperature=0.2,
            max_tokens=256,
        )

        if resp.success:
            try:
                keywords = json.loads(resp.content.strip().strip("`"))
                if isinstance(keywords, list):
                    return [str(k).lower().strip() for k in keywords[:10]]
            except (json.JSONDecodeError, TypeError):
                pass

        latency = (time.perf_counter() - t0) * 1000
        log_ai_step("extract_keywords_done", count=0, latency_ms=round(latency))
        return []

    # -- Translation --------------------------------------------------------
    @staticmethod
    async def translate(
        text: str,
        source_language: str = "auto",
        target_language: str = "en",
    ) -> Dict[str, Any]:
        """
        Translate text between Indian languages.

        Uses Sarvam's native translate API when source is known.
        Falls back to LLM-based translation when needed.
        """
        t0 = time.perf_counter()
        log_ai_step(
            "translate_start",
            source=source_language,
            target=target_language,
            chars=len(text),
        )

        provider = _get_provider()

        # Use native Sarvam translate when source language is known
        if source_language != "auto" and provider.provider_name == "sarvam":
            resp = await provider.translate(
                text,
                source_language=source_language,
                target_language=target_language,
            )
            if resp.success:
                latency = (time.perf_counter() - t0) * 1000
                log_ai_step(
                    "translate_done",
                    source=source_language,
                    target=target_language,
                    latency_ms=round(latency),
                )
                return {
                    "translated_text": resp.content,
                    "source_language": source_language,
                    "target_language": target_language,
                    "method": "native",
                }

        # Fallback: LLM-based translation
        prompt = prompts.translation_prompt(text, source_language, target_language)
        resp = await provider.generate_text(
            prompt,
            system_prompt=prompts.SYSTEM_PROMPT_TRANSLATION,
            temperature=0.3,
        )

        latency = (time.perf_counter() - t0) * 1000
        log_ai_step(
            "translate_done",
            source=source_language,
            target=target_language,
            method="llm_fallback",
            latency_ms=round(latency),
        )

        return {
            "translated_text": resp.content if resp.success else text,
            "source_language": source_language,
            "target_language": target_language,
            "method": "llm_fallback",
        }

    # -- Speech-to-text -----------------------------------------------------
    @staticmethod
    async def speech_to_text(
        audio_bytes: bytes,
        language_code: str = "auto",
        audio_format: str = "wav",
    ) -> Dict[str, Any]:
        """Transcribe audio to text using Sarvam STT with auto language detection."""
        t0 = time.perf_counter()
        log_ai_step("stt_start", lang=language_code, audio_bytes=len(audio_bytes))

        resp = await _get_provider().speech_to_text(
            audio_bytes,
            language_code=language_code,
            audio_format=audio_format,
        )

        latency = (time.perf_counter() - t0) * 1000

        # Extract detected language from provider raw response
        detected_lang = resp.raw.get("language_code", language_code) if resp.raw else language_code

        log_ai_step(
            "stt_done",
            lang=detected_lang,
            transcript_length=len(resp.content),
            latency_ms=round(latency),
        )

        return {
            "transcript": resp.content,
            "language": detected_lang,
            "success": resp.success,
            "error": resp.error,
        }

    # -- Text-to-speech -----------------------------------------------------
    @staticmethod
    async def text_to_speech(
        text: str,
        language_code: str = "hi-IN",
        voice_id: str = "meera",
    ) -> Dict[str, Any]:
        """Synthesise speech from text using Sarvam TTS."""
        t0 = time.perf_counter()

        resp = await _get_provider().text_to_speech(
            text,
            language_code=language_code,
            voice_id=voice_id,
        )

        latency = (time.perf_counter() - t0) * 1000
        log_ai_step("tts_done", lang=language_code, latency_ms=round(latency))

        return {
            "audio_data": resp.content,
            "language": language_code,
            "success": resp.success,
            "error": resp.error,
        }

    # -- Image analysis -----------------------------------------------------
    @staticmethod
    async def analyze_image(
        image_bytes: bytes,
        context: str = "",
        mime_type: str = "image/jpeg",
    ) -> Dict[str, Any]:
        """Analyse an image for complaint evidence."""
        t0 = time.perf_counter()

        prompt = prompts.analyze_image_prompt(context)
        resp = await _get_provider().analyze_image(
            image_bytes,
            prompt=prompt,
            mime_type=mime_type,
        )

        if resp.success and not resp.raw.get("placeholder"):
            result = _parse_json_response(resp.content)
        else:
            result = {
                "issue_type": "unknown",
                "severity": "medium",
                "affected_area": "unknown",
                "hazards": [],
                "confidence": 0.0,
                "note": resp.content,
            }

        latency = (time.perf_counter() - t0) * 1000
        log_ai_step("analyze_image_done", latency_ms=round(latency))
        return result

    # -- AI Copilot ---------------------------------------------------------
    @staticmethod
    async def generate_copilot_response(
        query: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Generate a copilot response for an MP/MLA."""
        t0 = time.perf_counter()

        messages = prompts.copilot_prompt(query, context)
        resp = await _get_provider().chat_completion(
            messages,
            temperature=0.4,
            max_tokens=2048,
        )

        latency = (time.perf_counter() - t0) * 1000
        log_ai_step("copilot_done", latency_ms=round(latency))

        return resp.content if resp.success else "I'm unable to process that request right now."

    # -- Recommendations ----------------------------------------------------
    @staticmethod
    async def generate_recommendation(
        constituency_data: Dict[str, Any],
        complaint_patterns: Dict[str, Any],
        budget_info: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """Generate development project recommendations."""
        t0 = time.perf_counter()

        prompt = prompts.generate_recommendation_prompt(
            constituency_data, complaint_patterns, budget_info
        )
        resp = await _get_provider().generate_text(
            prompt,
            system_prompt=prompts.SYSTEM_PROMPT_RECOMMENDATION,
            temperature=0.4,
        )

        if resp.success:
            result = _parse_json_response(resp.content)
            if isinstance(result, list):
                return result
            return [result]

        latency = (time.perf_counter() - t0) * 1000
        log_ai_step("generate_recommendation_done", latency_ms=round(latency))
        return []

    # -- Policy generation --------------------------------------------------
    @staticmethod
    async def generate_policy(
        topic: str,
        data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Generate a policy suggestion for an MP."""
        t0 = time.perf_counter()

        prompt = prompts.generate_policy_prompt(topic, data)
        resp = await _get_provider().generate_text(
            prompt,
            system_prompt=prompts.SYSTEM_PROMPT_COPILOT,
            temperature=0.4,
        )

        result = _parse_json_response(resp.content) if resp.success else {}
        latency = (time.perf_counter() - t0) * 1000
        log_ai_step("generate_policy_done", latency_ms=round(latency))
        return result

    # -- Raw text generation (escape hatch) ---------------------------------
    @staticmethod
    async def generate_text(
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str:
        """Raw text generation for any custom prompt."""
        resp = await _get_provider().generate_text(
            prompt,
            system_prompt=system_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return resp.content if resp.success else ""

    # -- Health -------------------------------------------------------------
    @staticmethod
    async def health_check() -> Dict[str, Any]:
        """Check if the configured AI provider is reachable."""
        provider = _get_provider()
        ok = await provider.health_check()
        return {
            "provider": provider.provider_name,
            "healthy": ok,
        }


# Module-level singleton for convenience
ai_service = AIService()

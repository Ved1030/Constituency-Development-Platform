"""
Pydantic schemas for Speech processing API request/response.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class TranscriptionResponse(BaseModel):
    """Response from speech transcription endpoint."""
    success: bool = True
    language: str = Field(..., description="Detected language name (e.g. 'Hindi')")
    language_code: str = Field(..., description="BCP-47 language code (e.g. 'hi-IN')")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence 0-1")
    original_text: str = Field(..., description="Transcribed text in original language")
    english_translation: str = Field("", description="English translation of the transcript")
    speech_duration_seconds: float = Field(0.0, description="Duration of speech in seconds")
    error: Optional[str] = None


class SpeechTranscribeRequest(BaseModel):
    """Request payload for speech transcription."""
    language_code: Optional[str] = Field(None, description="Hint for language (auto-detect if omitted)")
    audio_format: str = Field("webm", description="Audio format (webm, wav, mp3, ogg)")


class BackgroundClassificationRequest(BaseModel):
    """Request for background AI classification of complaint text."""
    title: str = Field(..., min_length=3, max_length=300)
    description: str = Field(..., min_length=5)
    category: Optional[str] = None
    original_language: Optional[str] = None
    english_translation: Optional[str] = None


class BackgroundClassificationResponse(BaseModel):
    """Response from background classification."""
    success: bool = True
    detected_category: Optional[str] = None
    detected_department: Optional[str] = None
    detected_sector: Optional[str] = None
    severity: str = "medium"
    priority_score: float = 50.0
    confidence: float = 0.5
    keywords: List[str] = []
    estimated_resolution_days: int = 14
    error: Optional[str] = None


class SupportedLanguage(BaseModel):
    """A supported speech language."""
    code: str = Field(..., description="BCP-47 language code")
    name: str = Field(..., description="Language display name")
    native_name: str = Field("", description="Language name in its own script")


class SupportedLanguagesResponse(BaseModel):
    """List of supported languages."""
    languages: List[SupportedLanguage] = []


class VoiceNoteResult(BaseModel):
    """Result of a single voice note transcription."""
    audio_blob_url: Optional[str] = None
    transcript: str = ""
    language: str = ""
    language_code: str = ""
    confidence: float = 0.0
    english_translation: str = ""
    duration_seconds: float = 0.0

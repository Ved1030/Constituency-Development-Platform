"""
Global application settings loaded from environment variables.

Uses pydantic-settings for .env file support and type coercion.
"""

from typing import List, Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with .env override."""

    # -- Project metadata ---------------------------------------------------
    PROJECT_NAME: str = "Constituency Development Platform"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    # -- CORS ---------------------------------------------------------------
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # -- Database -----------------------------------------------------------
    DATABASE_URL: str = "sqlite+aiosqlite:///./cdp.db"
    DATABASE_ECHO: bool = False

    # -- AI Provider --------------------------------------------------------
    DEFAULT_AI_PROVIDER: str = "sarvam"

    # -- Sarvam AI ----------------------------------------------------------
    SARVAM_API_KEY: Optional[str] = None
    SARVAM_BASE_URL: str = "https://api.sarvam.ai"
    SARVAM_MODEL: str = "sarvam-2b-v0.5"
    SARVAM_TIMEOUT: int = 60

    # -- Gemini (fallback / future) -----------------------------------------
    GOOGLE_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.0-flash"
    VECTOR_STORE_PATH: str = "./data/vector_store"

    # -- Geo Verification ---------------------------------------------------
    DUPLICATE_RADIUS_METERS: float = 25.0
    DUPLICATE_RADIUS_MEDIUM: float = 50.0
    DUPLICATE_RADIUS_LARGE: float = 100.0
    GPS_ACCURACY_THRESHOLD: float = 100.0
    MIN_GPS_ACCURACY_WARN: float = 50.0
    REVERSE_GEOCODE_TIMEOUT: int = 10
    NOMINATIM_URL: str = "https://nominatim.openstreetmap.org"
    GEOAPIFY_KEY: Optional[str] = None

    # -- Evidence Scoring ---------------------------------------------------
    EVIDENCE_WEIGHTS: dict = {
        "gps_present": 15,
        "photo_present": 15,
        "voice_present": 10,
        "image_metadata": 5,
        "multiple_reports": 10,
        "duplicate_radius": 10,
        "location_accuracy": 15,
        "timestamp": 5,
        "ai_confidence": 15,
    }

    # -- Logging ------------------------------------------------------------
    LOG_DIR: str = "logs"
    LOG_LEVEL: str = "INFO"
    DEBUG: bool = False

    # -- Auth (future) ------------------------------------------------------
    # SECRET_KEY: str = ""
    # ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }


settings = Settings()

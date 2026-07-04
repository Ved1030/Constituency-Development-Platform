"""
Custom exception classes for the Constituency Development Platform.

All exceptions are caught by the global exception handler in main.py
and returned as structured JSON error responses.
"""

from typing import Any, Dict, Optional


class CDPException(Exception):
    """Base exception for the platform."""

    def __init__(
        self,
        message: str = "An unexpected error occurred",
        status_code: int = 500,
        detail: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.detail = detail or {}
        super().__init__(self.message)


class GPSDeniedError(CDPException):
    """Citizen denied GPS permission or location unavailable."""

    def __init__(self, message: str = "GPS location access denied by user"):
        super().__init__(message=message, status_code=400)


class GPSAccuracyError(CDPException):
    """GPS accuracy is below acceptable threshold."""

    def __init__(self, accuracy: float, threshold: float = 100.0):
        super().__init__(
            message=f"GPS accuracy {accuracy}m exceeds threshold {threshold}m",
            status_code=400,
            detail={"accuracy": accuracy, "threshold": threshold},
        )


class ReverseGeocodeError(CDPException):
    """Reverse geocoding service failed."""

    def __init__(self, message: str = "Reverse geocoding service unavailable"):
        super().__init__(message=message, status_code=422)


class DuplicateComplaintError(CDPException):
    """A very similar complaint already exists nearby."""

    def __init__(self, cluster_id: str, existing_count: int):
        super().__init__(
            message=f"Similar complaint found. Merged into cluster {cluster_id}",
            status_code=200,
            detail={"cluster_id": cluster_id, "existing_reports": existing_count},
        )


class ComplaintNotFoundError(CDPException):
    """Complaint not found."""

    def __init__(self, complaint_id: str):
        super().__init__(
            message=f"Complaint {complaint_id} not found",
            status_code=404,
        )


class AIProcessingError(CDPException):
    """AI processing pipeline failed."""

    def __init__(self, step: str, message: str = "AI processing failed"):
        super().__init__(
            message=f"AI error at step '{step}': {message}",
            status_code=422,
            detail={"failed_step": step},
        )


class AIProviderError(CDPException):
    """AI provider returned an error or is unreachable."""

    def __init__(self, provider: str, message: str = "AI provider error"):
        super().__init__(
            message=f"[{provider}] {message}",
            status_code=502,
            detail={"provider": provider},
        )


class AIProviderNotConfiguredError(CDPException):
    """Requested AI provider is missing configuration (e.g. API key)."""

    def __init__(self, provider: str):
        super().__init__(
            message=f"AI provider '{provider}' is not configured. Set the required environment variables.",
            status_code=500,
            detail={"provider": provider},
        )


class NetworkTimeoutError(CDPException):
    """External service timed out."""

    def __init__(self, service: str):
        super().__init__(
            message=f"Timeout communicating with {service}",
            status_code=504,
            detail={"service": service},
        )


class ValidationError(CDPException):
    """Input validation failed."""

    def __init__(self, field: str, message: str = "Invalid value"):
        super().__init__(
            message=f"Validation error on '{field}': {message}",
            status_code=422,
            detail={"field": field},
        )

"""
Structured logging configuration for the Constituency Development Platform.

Provides:
- Rotating file handlers for application.log, error.log, ai.log, api.log
- Structured console output with timestamps, request IDs, execution times
- Separate AI module logging
- DEBUG mode for SQL queries, AI prompts, memory usage
"""

import logging
import logging.handlers
import os
import sys
import time
import uuid
from contextvars import ContextVar
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Context variables for request-scoped data
# ---------------------------------------------------------------------------
request_id_var: ContextVar[str] = ContextVar("request_id", default="")
user_id_var: ContextVar[str] = ContextVar("user_id", default="")


def generate_request_id() -> str:
    """Generate a short unique request ID."""
    return uuid.uuid4().hex[:12]


# ---------------------------------------------------------------------------
# Custom formatter
# ---------------------------------------------------------------------------
class StructuredFormatter(logging.Formatter):
    """
    Format:
    [2026-07-04 11:42:15] INFO  POST /api/v1/complaints Citizen ID-1045
    Village: Gandhi Nagar | Evidence Score: 94 | Completed 221ms
    """

    COLORS = {
        logging.DEBUG: "\033[36m",     # cyan
        logging.INFO: "\033[32m",      # green
        logging.WARNING: "\033[33m",   # yellow
        logging.ERROR: "\033[31m",     # red
        logging.CRITICAL: "\033[1;31m",  # bold red
    }
    RESET = "\033[0m"

    def __init__(self, use_color: bool = True):
        super().__init__()
        self.use_color = use_color

    def format(self, record: logging.LogRecord) -> str:
        timestamp = self.formatTime(record, "%Y-%m-%d %H:%M:%S")
        level = record.levelname.ljust(8)
        name = record.name
        message = record.getMessage()

        rid = request_id_var.get("")
        uid = user_id_var.get("")

        parts = [f"[{timestamp}] {level} [{name}]"]

        if rid:
            parts.append(f"req={rid}")
        if uid:
            parts.append(f"user={uid}")

        parts.append(message)

        # Add exception info if present
        if record.exc_info and record.exc_info[1]:
            parts.append(f"\n{self.formatException(record.exc_info)}")

        line = " ".join(parts)

        if self.use_color:
            color = self.COLORS.get(record.levelno, "")
            return f"{color}{line}{self.RESET}"

        return line


class JSONFormatter(logging.Formatter):
    """JSON structured log for file handlers."""

    def format(self, record: logging.LogRecord) -> str:
        import json

        log_entry = {
            "timestamp": self.formatTime(record, "%Y-%m-%dT%H:%M:%S"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": request_id_var.get(""),
            "user_id": user_id_var.get(""),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        if record.exc_info and record.exc_info[1]:
            log_entry["exception"] = self.formatException(record.exc_info)

        # Merge any extra fields passed via `extra=`
        for key in ("endpoint", "method", "status_code", "execution_time_ms",
                     "village", "ward", "evidence_score", "citizen_id",
                     "cluster_id", "verification_status", "lat", "lng"):
            val = getattr(record, key, None)
            if val is not None:
                log_entry[key] = val

        return json.dumps(log_entry, default=str)


# ---------------------------------------------------------------------------
# Logger setup
# ---------------------------------------------------------------------------
_LOG_DIR: Optional[Path] = None
_initialized = False


def _ensure_log_dir(log_dir: str = "logs") -> Path:
    global _LOG_DIR
    if _LOG_DIR is None:
        _LOG_DIR = Path(log_dir)
        _LOG_DIR.mkdir(parents=True, exist_ok=True)
    return _LOG_DIR


def setup_logging(
    log_dir: str = "logs",
    debug: bool = False,
    log_level: str = "INFO",
) -> None:
    """
    Initialize application logging.

    Creates rotating file handlers for:
    - application.log  (general, 10MB, 5 backups)
    - error.log        (ERROR+ only, 10MB, 5 backups)
    - ai.log           (AI module, 10MB, 3 backups)
    - api.log          (API requests, 10MB, 5 backups)

    Also configures console output with structured format.
    """
    global _initialized
    if _initialized:
        return
    _initialized = True

    log_path = _ensure_log_dir(log_dir)
    level = logging.DEBUG if debug else getattr(logging, log_level.upper(), logging.INFO)

    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)  # capture everything; handlers filter

    # Remove existing handlers to avoid duplicates on reload
    root_logger.handlers.clear()

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_handler.setFormatter(StructuredFormatter(use_color=True))
    root_logger.addHandler(console_handler)

    # -- application.log (rotating, JSON) -----------------------------------
    app_handler = logging.handlers.RotatingFileHandler(
        log_path / "application.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    app_handler.setLevel(level)
    app_handler.setFormatter(JSONFormatter())
    root_logger.addHandler(app_handler)

    # -- error.log (ERROR+ only) --------------------------------------------
    error_handler = logging.handlers.RotatingFileHandler(
        log_path / "error.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(JSONFormatter())
    root_logger.addHandler(error_handler)

    # -- ai.log (AI module events) ------------------------------------------
    ai_handler = logging.handlers.RotatingFileHandler(
        log_path / "ai.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=3,
        encoding="utf-8",
    )
    ai_handler.setLevel(logging.DEBUG)
    ai_handler.setFormatter(JSONFormatter())

    ai_logger = logging.getLogger("app.ai")
    ai_logger.addHandler(ai_handler)
    ai_logger.setLevel(logging.DEBUG)

    # -- api.log (API requests) ---------------------------------------------
    api_handler = logging.handlers.RotatingFileHandler(
        log_path / "api.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    api_handler.setLevel(level)
    api_handler.setFormatter(JSONFormatter())

    api_logger = logging.getLogger("app.api")
    api_logger.addHandler(api_handler)
    api_logger.setLevel(level)

    # Quiet down noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.DEBUG if debug else logging.WARNING
    )

    logging.getLogger("app").info(
        "Logging initialized | debug=%s | level=%s | dir=%s",
        debug, level, log_path,
    )


def get_logger(name: str) -> logging.Logger:
    """Get a child logger with the given name."""
    return logging.getLogger(name)


def log_ai_step(step: str, **kwargs) -> None:
    """Log an AI pipeline step with structured metadata."""
    logger = logging.getLogger("app.ai")
    extra_parts = " | ".join(f"{k}={v}" for k, v in kwargs.items())
    message = f"AI_STEP: {step}"
    if extra_parts:
        message += f" | {extra_parts}"
    logger.info(message)


def log_api_request(
    method: str,
    endpoint: str,
    citizen_id: str = "",
    status_code: int = 200,
    execution_time_ms: float = 0,
    **kwargs,
) -> None:
    """Log an API request with structured metadata."""
    logger = logging.getLogger("app.api")
    logger.info(
        "%s %s | citizen=%s | status=%d | %.1fms",
        method,
        endpoint,
        citizen_id or "anonymous",
        status_code,
        execution_time_ms,
        extra={
            "endpoint": endpoint,
            "method": method,
            "status_code": status_code,
            "execution_time_ms": execution_time_ms,
            "citizen_id": citizen_id,
            **kwargs,
        },
    )

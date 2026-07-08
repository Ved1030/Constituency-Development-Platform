"""
FastAPI Application Entry Point

Architecture (feature-based):
- app/main.py            : Entry point. Creates FastAPI app, registers middleware, routers.
  |-- GET /              : Root – API info.
  |-- GET /health        : Liveness check.
  |-- /api/v1/*          : All feature API routes.

- app/core/config.py     : Pydantic settings (.env + defaults).
- app/core/logger.py     : Structured logging with rotating file handlers.
- app/api/               : Feature-separated API endpoints (health, complaints, dashboard, etc.).
- app/ai/                : AI/ML integration (LangChain + Gemini + FAISS).
- app/services/          : Business logic layer (called by endpoints).
- app/database/          : DB connection, session, migrations (SQLAlchemy + Alembic).
- app/models/            : SQLAlchemy ORM models.
- app/schemas/           : Pydantic request/response schemas.
- app/middleware/         : Custom ASGI middleware.
- app/utils/             : Shared utility functions.
"""

import logging
import traceback

from contextlib import asynccontextmanager
from typing import Any, Generator, Literal

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.exceptions import CDPException
from app.core.logger import setup_logging
from app.database.base import Base
from app.database.session import engine
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.middleware.rate_limiter import RateLimiterMiddleware
from app.api import api_router

# Import models so they register with Base.metadata
from app.models import Complaint, IssueCluster  # noqa: F401
from app.models import (  # noqa: F401
    CensusData,
    EducationSpending,
    MpladsFundsAllocated,
    MpladsProject,
    MpladsSectorAllocation,
    MpladsStateExpenditure,
    MpladsUnspentBalance,
    RoadData,
    SchoolInfrastructure,
    TransportData,
)

# ---------------------------------------------------------------------------
# Fix: typing-inspection 0.4.2 does not recursively flatten nested Literal types
# ---------------------------------------------------------------------------
try:
    import typing_inspection.introspection as _tii
    import pydantic.json_schema as _pjs
    from pydantic_core import core_schema  # noqa: F401

    _original_get_literal_values = _tii.get_literal_values

    def _is_nested_literal(value: Any) -> bool:
        return hasattr(value, "__origin__") and getattr(value, "__origin__", None) is Literal

    def _patched_get_literal_values(
        annotation: Any,
        /,
        *,
        type_check: bool = False,
        unpack_type_aliases: str = "eager",
    ) -> Generator[Any, None, None]:
        for value in _original_get_literal_values(
            annotation,
            type_check=type_check,
            unpack_type_aliases=unpack_type_aliases,
        ):
            if _is_nested_literal(value):
                yield from _patched_get_literal_values(
                    value,
                    type_check=type_check,
                    unpack_type_aliases=unpack_type_aliases,
                )
            else:
                yield value

    _tii.get_literal_values = _patched_get_literal_values
    _pjs.get_literal_values = _patched_get_literal_values
except Exception:
    pass

# ---------------------------------------------------------------------------
# Initialize logging
# ---------------------------------------------------------------------------
setup_logging(log_dir=settings.LOG_DIR, debug=settings.DEBUG, log_level=settings.LOG_LEVEL)

logger = logging.getLogger("app")

# ---------------------------------------------------------------------------
# Lifespan: create tables on startup
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created/verified")
    yield
    await engine.dispose()


# ---------------------------------------------------------------------------
# Create FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Constituency Development Platform API",
    description="Constituency Development Platform API – scalable AI SaaS backend",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# Middleware — CORSMiddleware MUST be first (outermost layer).
#
# In Starlette, add_middleware(A) then add_middleware(B) creates A(B(app)).
# The outermost layer runs first on every request. If CORS is not outermost,
# an exception in an inner middleware prevents CORS headers from being set.
# ---------------------------------------------------------------------------

allow_origins = list(settings.BACKEND_CORS_ORIGINS)

# Always allow production origin
production_origin = "https://constituency-development-platform.vercel.app"
if production_origin not in allow_origins:
    allow_origins.append(production_origin)

# Allow localhost for development if not in production
if settings.DEBUG:
    dev_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
    for o in dev_origins:
        if o not in allow_origins:
            allow_origins.append(o)

if settings.FRONTEND_URL and settings.FRONTEND_URL not in allow_origins:
    allow_origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

# Rate limiter (disabled in debug/dev mode to avoid friction during development)
if not settings.DEBUG:
    app.add_middleware(RateLimiterMiddleware, max_requests=200, window_seconds=60)

# ---------------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------------

@app.exception_handler(CDPException)
async def cdp_exception_handler(request: Request, exc: CDPException):
    """Handle all custom platform exceptions."""
    logger.warning(
        "CDPException: %s | status=%d | path=%s",
        exc.message,
        exc.status_code,
        request.url.path,
        extra={"endpoint": str(request.url.path), "method": request.method, "status_code": exc.status_code},
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.message,
            "detail": exc.detail,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic/FastAPI validation errors (422)."""
    errors = exc.errors()
    detail = [
        {"field": e.get("loc", ["unknown"])[-1], "message": e.get("msg", "Invalid value"), "type": e.get("type", "")}
        for e in errors
    ]
    logger.warning(
        "Validation error: %s | path=%s",
        detail,
        request.url.path,
        extra={"endpoint": str(request.url.path), "method": request.method, "status_code": 422},
    )
    return JSONResponse(
        status_code=422,
        content={
            "error": True,
            "message": "Validation failed",
            "detail": detail,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle all HTTP exceptions — always return JSON."""
    status_code = exc.status_code
    detail = exc.detail if isinstance(exc.detail, str) else "HTTP error occurred"
    logger.warning(
        "HTTP %d: %s | path=%s",
        status_code,
        detail,
        request.url.path,
        extra={"endpoint": str(request.url.path), "method": request.method, "status_code": status_code},
    )
    return JSONResponse(
        status_code=status_code,
        content={
            "error": True,
            "message": detail,
            "detail": {"path": request.url.path, "method": request.method},
        },
    )

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# ---------------------------------------------------------------------------
# Liveness / health checks
# ---------------------------------------------------------------------------

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint – API information."""
    return {
        "message": "Constituency Development Platform API",
        "status": "running",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring / load balancers."""
    return {"status": "healthy"}

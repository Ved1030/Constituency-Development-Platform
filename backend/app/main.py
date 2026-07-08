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
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.exceptions import CDPException
from app.core.logger import setup_logging
from app.database.base import Base
from app.database.session import engine, async_session_factory
from app.middleware.logging_middleware import LoggingMiddleware
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
# (e.g. Literal[Literal['a','b'], Literal['c','d']]). This breaks pydantic's
# OpenAPI schema generation via CoreSchemaOrFieldType.
# ---------------------------------------------------------------------------
import typing_inspection.introspection as _tii
import pydantic.json_schema as _pjs
from pydantic_core import core_schema

_original_get_literal_values = _tii.get_literal_values


def _is_nested_literal(value: Any) -> bool:
    """Check if a value is a nested Literal (Literal inside Literal)."""
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
    # Create all tables via ORM metadata (PostgreSQL compatible)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created/verified")
    yield
    # Shutdown
    await engine.dispose()


# ---------------------------------------------------------------------------
# Create FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Constituency Development Platform API – scalable AI SaaS backend",
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# Middleware (order matters: last added = first executed)
# ---------------------------------------------------------------------------
app.add_middleware(LoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled exceptions – never crash."""
    logger.error(
        "Unhandled exception: %s | path=%s\n%s",
        str(exc),
        request.url.path,
        traceback.format_exc(),
        extra={"endpoint": str(request.url.path), "method": request.method, "status_code": 500},
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "An internal server error occurred",
            "detail": {},
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

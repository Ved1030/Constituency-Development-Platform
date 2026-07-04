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

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.exceptions import CDPException
from app.core.logger import setup_logging
from app.database.base import Base
from app.database.session import engine
from app.middleware.logging_middleware import LoggingMiddleware
from app.api import api_router

# Import models so they register with Base.metadata
from app.models import Complaint, IssueCluster  # noqa: F401

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
    # Create all tables
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

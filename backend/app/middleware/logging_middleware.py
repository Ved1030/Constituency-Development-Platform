"""
Request/response logging middleware for FastAPI.

Logs every incoming request and outgoing response with:
- Timestamp, method, path, status code
- Execution time in milliseconds
- Request ID (generated per-request)
- User ID (if available)
"""

import time
import uuid
from typing import Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.logger import (
    generate_request_id,
    get_logger,
    log_api_request,
    request_id_var,
    user_id_var,
)

logger = get_logger("app.api.middleware")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware that logs all HTTP requests and responses."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate and set request ID
        req_id = generate_request_id()
        token_rid = request_id_var.set(req_id)

        # Try to extract user ID from headers or query params
        uid = request.headers.get("X-User-ID", request.query_params.get("user_id", ""))
        token_uid = user_id_var.set(uid)

        # Store on request state for downstream access
        request.state.request_id = req_id
        request.state.user_id = uid

        # Log incoming request
        start_time = time.perf_counter()
        logger.info(
            "REQUEST  %s %s",
            request.method,
            request.url.path,
            extra={
                "endpoint": str(request.url.path),
                "method": request.method,
            },
        )

        try:
            response = await call_next(request)
        except Exception as exc:
            elapsed_ms = (time.perf_counter() - start_time) * 1000
            logger.error(
                "UNHANDLED  %s %s | %.1fms | %s",
                request.method,
                request.url.path,
                elapsed_ms,
                str(exc),
                extra={
                    "endpoint": str(request.url.path),
                    "method": request.method,
                    "status_code": 500,
                    "execution_time_ms": elapsed_ms,
                },
            )
            raise
        finally:
            request_id_var.reset(token_rid)
            user_id_var.reset(token_uid)

        elapsed_ms = (time.perf_counter() - start_time) * 1000

        # Add custom headers
        response.headers["X-Request-ID"] = req_id
        response.headers["X-Execution-Time-Ms"] = f"{elapsed_ms:.1f}"

        # Log response
        log_api_request(
            method=request.method,
            endpoint=str(request.url.path),
            citizen_id=uid,
            status_code=response.status_code,
            execution_time_ms=elapsed_ms,
        )

        return response

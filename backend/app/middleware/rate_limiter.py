"""
Simple in-memory rate limiter.

Provides basic rate limiting per IP address using a sliding window.
This is not a replacement for a production-grade distributed rate limiter
(Redis-based) but offers reasonable protection for single-instance deployments.
"""

import logging
import time
from collections import defaultdict
from typing import Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

logger = logging.getLogger("app.middleware.ratelimit")


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """In-memory rate limiter middleware.

    Limits requests per IP using a sliding window.
    """

    def __init__(self, app, max_requests: int = 200, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._clients: dict[str, list[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next: Callable):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        window_start = now - self.window_seconds

        self._clients[client_ip] = [
            t for t in self._clients[client_ip] if t > window_start
        ]

        if len(self._clients[client_ip]) >= self.max_requests:
            logger.warning("Rate limit exceeded for %s (%d requests)", client_ip, self.max_requests)
            return JSONResponse(
                status_code=429,
                content={
                    "error": True,
                    "message": "Too many requests. Please try again later.",
                    "detail": {"retry_after_seconds": self.window_seconds},
                },
            )

        self._clients[client_ip].append(now)
        response = await call_next(request)
        return response

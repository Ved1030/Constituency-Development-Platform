"""
Central API router – aggregates all feature-based route modules.

Each module under api/ exposes a `router` (APIRouter) that gets
included here and mounted at the API_V1_PREFIX in main.py.
"""

from fastapi import APIRouter

from app.api import health
from app.api import complaints
from app.api import dashboard
from app.api import simulator
from app.api import copilot
from app.api import analytics
from app.api import projects
from app.api import recommendation

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["Complaints"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(simulator.router, prefix="/simulator", tags=["Simulator"])
api_router.include_router(copilot.router, prefix="/copilot", tags=["Copilot"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(recommendation.router, prefix="/recommendations", tags=["Recommendations"])

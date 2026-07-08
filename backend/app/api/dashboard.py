"""Dashboard API endpoints."""

import logging

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.common import DashboardResponse, DashboardSummary
from app.services.dashboard_service import dashboard_service

router = APIRouter()
logger = logging.getLogger("app.api.dashboard")


@router.get("/", response_model=DashboardResponse)
async def get_dashboard(
    constituency: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Full dashboard payload."""
    data = await dashboard_service.get_dashboard(db, constituency=constituency)
    return DashboardResponse(**data)


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    constituency: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Summary counts only."""
    data = await dashboard_service.get_summary(db, constituency=constituency)
    return DashboardSummary(**data)

"""Analytics API endpoints."""

import logging

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.common import AnalyticsResponse
from app.services.analytics_service import analytics_service

router = APIRouter()
logger = logging.getLogger("app.api.analytics")


@router.get("/", response_model=AnalyticsResponse)
async def get_analytics(
    days: int = Query(30, ge=1, le=365),
    constituency: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Full analytics payload."""
    data = await analytics_service.get_analytics(db, days=days, constituency=constituency)
    return AnalyticsResponse(**data)


@router.get("/trends")
async def get_trends(
    days: int = Query(30, ge=1, le=365),
    constituency: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Complaint trends over time."""
    return await analytics_service.get_trends(db, days=days, constituency=constituency)


@router.get("/departments")
async def get_department_analytics(
    constituency: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Department breakdown."""
    return await analytics_service.get_departments(db, constituency=constituency)

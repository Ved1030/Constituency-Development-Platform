"""Business logic for analytics computation."""

import logging
from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.analytics_repository import analytics_repo

logger = logging.getLogger("app.services.analytics")


class AnalyticsService:
    """Service for analytics data."""

    async def get_analytics(self, db: AsyncSession, days: int = 30, constituency: Optional[str] = None) -> Dict[str, Any]:
        trends = await analytics_repo.get_complaint_trends(db, days=days, constituency=constituency)
        dept = await analytics_repo.get_department_breakdown(db, constituency=constituency)
        villages = await analytics_repo.get_village_breakdown(db, constituency=constituency)
        severity = await analytics_repo.get_severity_distribution(db, constituency=constituency)
        resolution = await analytics_repo.get_resolution_time_avg(db, constituency=constituency)
        categories = await analytics_repo.get_category_distribution(db, constituency=constituency)
        return {
            "complaint_trends": trends,
            "department_breakdown": dept,
            "village_breakdown": villages,
            "severity_distribution": severity,
            "resolution_time_avg": resolution,
            "category_distribution": categories,
        }

    async def get_trends(self, db: AsyncSession, days: int = 30, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        return await analytics_repo.get_complaint_trends(db, days=days, constituency=constituency)

    async def get_departments(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        return await analytics_repo.get_department_breakdown(db, constituency=constituency)


analytics_service = AnalyticsService()

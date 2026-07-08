"""Business logic for dashboard data aggregation."""

import logging
from typing import Any, Dict, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.dashboard_repository import dashboard_repo

logger = logging.getLogger("app.services.dashboard")


class DashboardService:
    """Aggregates data for the dashboard views."""

    async def get_dashboard(self, db: AsyncSession, constituency: Optional[str] = None) -> Dict[str, Any]:
        summary = await dashboard_repo.get_summary(db, constituency=constituency)
        dept_perf = await dashboard_repo.get_department_performance(db, constituency=constituency)
        village_stats = await dashboard_repo.get_village_stats(db, constituency=constituency)
        recent = await dashboard_repo.get_recent_activity(db, constituency=constituency)
        severity = await dashboard_repo.get_severity_breakdown(db, constituency=constituency)
        return {
            "summary": summary,
            "department_performance": dept_perf,
            "village_stats": village_stats,
            "recent_activity": recent,
            "severity_breakdown": severity,
        }

    async def get_summary(self, db: AsyncSession, constituency: Optional[str] = None) -> Dict[str, Any]:
        return await dashboard_repo.get_summary(db, constituency=constituency)


dashboard_service = DashboardService()

"""Repository for analytics data."""

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.complaint import Complaint


class AnalyticsRepository:
    """Data access for analytics views."""

    async def get_complaint_trends(self, db: AsyncSession, days: int = 30, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        since = datetime.utcnow() - timedelta(days=days)
        q = select(
            func.date(Complaint.created_at).label("date"),
            func.count(Complaint.id).label("count"),
        ).where(Complaint.created_at >= since)
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(func.date(Complaint.created_at)).order_by(func.date(Complaint.created_at))
        rows = await db.execute(q)
        return [{"date": str(r.date), "count": r.count} for r in rows]

    async def get_department_breakdown(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        rows = await db.execute(
            select(
                Complaint.department,
                func.count(Complaint.id).label("total"),
                func.sum(
                    case((Complaint.status == "resolved", 1), else_=0)
                ).label("resolved"),
            )
            .where(Complaint.department.isnot(None))
            .group_by(Complaint.department)
            .order_by(func.count(Complaint.id).desc())
        )
        return [
            {
                "department": r.department,
                "total": r.total,
                "resolved": r.resolved or 0,
                "resolution_rate": round((r.resolved or 0) / r.total * 100, 1) if r.total > 0 else 0,
            }
            for r in rows
        ]

    async def get_village_breakdown(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.village,
            func.count(Complaint.id).label("total"),
            func.sum(
                case((Complaint.severity == "critical", 1), else_=0)
            ).label("critical"),
        ).where(Complaint.village.isnot(None))
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.village).order_by(func.count(Complaint.id).desc())
        rows = await db.execute(q)
        return [
            {
                "village": r.village,
                "total": r.total,
                "critical": r.critical or 0,
            }
            for r in rows
        ]

    async def get_severity_distribution(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.severity,
            func.count(Complaint.id).label("count"),
        )
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.severity)
        rows = await db.execute(q)
        total = sum(r.count for r in rows) or 1
        return [
            {
                "severity": r.severity or "unknown",
                "count": r.count,
                "percentage": round(r.count / total * 100, 1),
            }
            for r in rows
        ]

    async def get_resolution_time_avg(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.department,
            func.avg(Complaint.estimated_resolution_days).label("avg_days"),
            func.count(Complaint.id).label("count"),
        ).where(
            Complaint.department.isnot(None),
            Complaint.estimated_resolution_days.isnot(None),
        )
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.department).order_by(func.avg(Complaint.estimated_resolution_days))
        rows = await db.execute(q)
        return [
            {
                "department": r.department,
                "avg_days": round(float(r.avg_days), 1) if r.avg_days else 0,
                "count": r.count,
            }
            for r in rows
        ]

    async def get_category_distribution(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.category,
            func.count(Complaint.id).label("count"),
        )
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.category).order_by(func.count(Complaint.id).desc())
        rows = await db.execute(q)
        total = sum(r.count for r in rows) or 1
        return [
            {
                "category": r.category or "other",
                "count": r.count,
                "percentage": round(r.count / total * 100, 1),
            }
            for r in rows
        ]


analytics_repo = AnalyticsRepository()

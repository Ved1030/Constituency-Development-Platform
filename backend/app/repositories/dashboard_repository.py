"""Repository for dashboard data aggregation."""

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from sqlalchemy import case, func, select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.complaint import Complaint


class DashboardRepository:
    """Data access for dashboard view. Only SQLAlchemy here."""

    async def get_summary(self, db: AsyncSession, constituency: Optional[str] = None) -> Dict[str, Any]:
        def _filter(q):
            return q.where(Complaint.constituency_name == constituency) if constituency else q

        total = await db.scalar(_filter(select(func.count(Complaint.id)))) or 0
        open_ = await db.scalar(
            _filter(select(func.count(Complaint.id)).where(Complaint.status == "pending"))
        ) or 0
        in_progress = await db.scalar(
            _filter(select(func.count(Complaint.id)).where(Complaint.status == "in_progress"))
        ) or 0
        resolved = await db.scalar(
            _filter(select(func.count(Complaint.id)).where(
                Complaint.status.in_(["resolved", "closed"])
            ))
        ) or 0
        critical = await db.scalar(
            _filter(select(func.count(Complaint.id)).where(Complaint.severity == "critical"))
        ) or 0
        high = await db.scalar(
            _filter(select(func.count(Complaint.id)).where(Complaint.severity == "high"))
        ) or 0

        dept_q = select(Complaint.department).where(Complaint.department.isnot(None)).distinct()
        if constituency:
            dept_q = dept_q.where(Complaint.constituency_name == constituency)
        dept_rows = await db.execute(dept_q)
        departments_involved = len(dept_rows.all())

        return {
            "total_complaints": total,
            "open_complaints": open_,
            "in_progress_complaints": in_progress,
            "resolved_complaints": resolved,
            "critical_complaints": critical,
            "high_priority_complaints": high,
            "departments_involved": departments_involved,
        }

    async def get_department_performance(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.department,
            func.count(Complaint.id).label("total"),
            func.sum(
                case((Complaint.status == "resolved", 1), else_=0)
            ).label("resolved"),
            func.avg(Complaint.estimated_resolution_days).label("avg_days"),
        ).where(Complaint.department.isnot(None))
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.department).order_by(func.count(Complaint.id).desc())
        rows = await db.execute(q)
        return [
            {
                "department": r.department,
                "total": r.total,
                "resolved": r.resolved or 0,
                "avg_resolution_days": round(float(r.avg_days), 1) if r.avg_days else 0,
            }
            for r in rows
        ]

    async def get_village_stats(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.village,
            func.count(Complaint.id).label("total"),
            func.sum(
                case((Complaint.severity == "critical", 1), else_=0)
            ).label("critical_count"),
        ).where(Complaint.village.isnot(None))
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.village).order_by(func.count(Complaint.id).desc())
        rows = await db.execute(q)
        return [
            {
                "village": r.village,
                "total": r.total,
                "critical_count": r.critical_count or 0,
            }
            for r in rows
        ]

    async def get_recent_activity(self, db: AsyncSession, limit: int = 10, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.complaint_uid,
            Complaint.title,
            Complaint.status,
            Complaint.severity,
            Complaint.village,
            Complaint.created_at,
        )
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.order_by(Complaint.created_at.desc()).limit(limit)
        result = await db.execute(q)
        return [
            {
                "complaint_uid": r.complaint_uid,
                "title": r.title,
                "status": r.status or "pending",
                "severity": r.severity or "medium",
                "village": r.village,
                "created_at": str(r.created_at) if r.created_at else None,
            }
            for r in result
        ]

    async def get_severity_breakdown(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.severity,
            func.count(Complaint.id).label("count"),
        )
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.severity).order_by(func.count(Complaint.id).desc())
        rows = await db.execute(q)
        return [
            {"severity": r.severity or "unknown", "count": r.count} for r in rows
        ]

    async def get_status_breakdown(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.status,
            func.count(Complaint.id).label("count"),
        )
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.status).order_by(func.count(Complaint.id).desc())
        rows = await db.execute(q)
        return [
            {"status": r.status or "unknown", "count": r.count} for r in rows
        ]


dashboard_repo = DashboardRepository()

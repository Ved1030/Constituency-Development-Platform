"""Repository for Complaint model - all SQLAlchemy access."""

import json
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import func, select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.complaint import Complaint, IssueCluster


class ComplaintRepository:
    """Data access layer for complaints. Only this class touches SQLAlchemy."""

    async def get_complaint_by_uid(self, db: AsyncSession, uid: str) -> Optional[Dict[str, Any]]:
        result = await db.execute(select(Complaint).where(Complaint.complaint_uid == uid))
        complaint = result.scalar_one_or_none()
        return self._to_dict(complaint) if complaint else None

    async def list_complaints(
        self,
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        category: Optional[str] = None,
        ward: Optional[str] = None,
        village: Optional[str] = None,
        constituency: Optional[str] = None,
    ) -> Tuple[List[Dict[str, Any]], int]:
        conditions = []
        if status:
            conditions.append(Complaint.status == status)
        if category:
            conditions.append(Complaint.category == category)
        if ward:
            conditions.append(Complaint.ward == ward)
        if village:
            conditions.append(Complaint.village == village)
        if constituency:
            conditions.append(Complaint.constituency_name == constituency)

        count_q = select(func.count(Complaint.id))
        if conditions:
            count_q = count_q.where(and_(*conditions))
        total = await db.scalar(count_q) or 0

        query = select(Complaint).order_by(Complaint.created_at.desc())
        if conditions:
            query = query.where(and_(*conditions))
        query = query.offset((page - 1) * page_size).limit(page_size)
        result = await db.execute(query)
        complaints = result.scalars().all()
        return [self._to_dict(c) for c in complaints], total

    async def get_complaint_stats(self, db: AsyncSession, constituency: Optional[str] = None) -> Dict[str, Any]:
        total_q = select(func.count(Complaint.id))
        verified_q = select(func.count(Complaint.id)).where(Complaint.verification_status == "verified")
        pending_q = select(func.count(Complaint.id)).where(Complaint.status == "pending")
        resolved_q = select(func.count(Complaint.id)).where(Complaint.status == "resolved")
        clusters_q = select(func.count(IssueCluster.id))

        if constituency:
            total_q = total_q.where(Complaint.constituency_name == constituency)
            verified_q = verified_q.where(Complaint.constituency_name == constituency)
            pending_q = pending_q.where(Complaint.constituency_name == constituency)
            resolved_q = resolved_q.where(Complaint.constituency_name == constituency)

        total = await db.scalar(total_q) or 0
        verified = await db.scalar(verified_q) or 0
        pending = await db.scalar(pending_q) or 0
        resolved = await db.scalar(resolved_q) or 0

        avg_q = select(func.avg(Complaint.evidence_score))
        if constituency:
            avg_q = avg_q.where(Complaint.constituency_name == constituency)
        avg_score = await db.scalar(avg_q) or 0.0

        total_clusters = await db.scalar(clusters_q) or 0

        return {
            "total_complaints": total,
            "verified_complaints": verified,
            "pending_complaints": pending,
            "resolved_complaints": resolved,
            "avg_evidence_score": round(float(avg_score), 2),
            "total_clusters": total_clusters,
        }

    async def get_all_complaints(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(Complaint).order_by(Complaint.created_at.desc())
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        result = await db.execute(q)
        return [self._to_dict(c) for c in result.scalars().all()]

    async def get_critical_complaints(self, db: AsyncSession, limit: int = 10, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(Complaint).where(Complaint.severity == "critical").order_by(Complaint.created_at.desc()).limit(limit)
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        result = await db.execute(q)
        return [self._to_dict(c) for c in result.scalars().all()]

    async def get_recent_complaints(self, db: AsyncSession, limit: int = 10, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(Complaint).order_by(Complaint.created_at.desc()).limit(limit)
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        result = await db.execute(q)
        return [self._to_dict(c) for c in result.scalars().all()]

    async def get_complaints_by_department(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(Complaint.department, func.count(Complaint.id).label("total"))
        q = q.where(Complaint.department.isnot(None))
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.department).order_by(func.count(Complaint.id).desc())
        rows = await db.execute(q)
        return [{"department": r.department, "total": r.total} for r in rows]

    async def get_daily_trends(self, db: AsyncSession, days: int = 30, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
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

    async def get_complaint_markers(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.id,
            Complaint.complaint_uid,
            Complaint.title,
            Complaint.gps_latitude,
            Complaint.gps_longitude,
            Complaint.severity,
            Complaint.status,
            Complaint.department,
            Complaint.village,
            Complaint.ward,
        ).where(
            Complaint.gps_latitude.isnot(None),
            Complaint.gps_longitude.isnot(None),
        )
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        result = await db.execute(q)
        return [
            {
                "id": r.id,
                "complaint_uid": r.complaint_uid,
                "title": r.title,
                "lat": r.gps_latitude,
                "lng": r.gps_longitude,
                "severity": r.severity or "medium",
                "status": r.status or "pending",
                "department": r.department,
                "village": r.village,
                "ward": r.ward,
            }
            for r in result
        ]

    async def get_heatmap_points(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        result = await db.execute(
            select(
                Complaint.gps_latitude,
                Complaint.gps_longitude,
                Complaint.priority_prediction,
                Complaint.severity,
            ).where(
                Complaint.gps_latitude.isnot(None),
                Complaint.gps_longitude.isnot(None),
            )
        )
        return [
            {
                "lat": r.gps_latitude,
                "lng": r.gps_longitude,
                "intensity": (r.priority_prediction or 0) * (
                    1.5 if r.severity == "critical" else
                    1.2 if r.severity == "high" else
                    1.0 if r.severity == "medium" else 0.5
                ),
            }
            for r in result
        ]

    async def get_severity_counts(self, db: AsyncSession, constituency: Optional[str] = None) -> Dict[str, int]:
        q = select(Complaint.severity, func.count(Complaint.id).label("count"))
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.severity)
        rows = await db.execute(q)
        counts = {r.severity or "unknown": r.count for r in rows}
        return {
            "critical": counts.get("critical", 0),
            "high": counts.get("high", 0),
            "medium": counts.get("medium", 0),
            "low": counts.get("low", 0),
        }

    async def get_status_counts(self, db: AsyncSession, constituency: Optional[str] = None) -> Dict[str, int]:
        q = select(Complaint.status, func.count(Complaint.id).label("count"))
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.status)
        rows = await db.execute(q)
        return {r.status or "unknown": r.count for r in rows}

    def _to_dict(self, complaint: Complaint) -> Dict[str, Any]:
        return {
            "id": complaint.id,
            "complaint_uid": complaint.complaint_uid,
            "title": complaint.title,
            "description": complaint.description,
            "category": complaint.category,
            "sector": complaint.sector,
            "department": complaint.department,
            "severity": complaint.severity,
            "status": complaint.status,
            "gps_latitude": complaint.gps_latitude,
            "gps_longitude": complaint.gps_longitude,
            "gps_accuracy": complaint.gps_accuracy,
            "gps_altitude": complaint.gps_altitude,
            "gps_speed": complaint.gps_speed,
            "gps_heading": complaint.gps_heading,
            "gps_timestamp": str(complaint.gps_timestamp) if complaint.gps_timestamp else None,
            "village": complaint.village,
            "ward": complaint.ward,
            "taluka": complaint.taluka,
            "district": complaint.district,
            "state": complaint.state,
            "pincode": complaint.pincode,
            "assembly_constituency": complaint.assembly_constituency,
            "lok_sabha_constituency": complaint.lok_sabha_constituency,
            "constituency_name": complaint.constituency_name,
            "nearest_landmark": complaint.nearest_landmark,
            "verification_status": complaint.verification_status,
            "verification_confidence": complaint.verification_confidence,
            "evidence_score": complaint.evidence_score,
            "duplicate_probability": complaint.duplicate_probability,
            "cluster_id": complaint.cluster_id,
            "duplicate_count": complaint.duplicate_count,
            "ai_detected_category": complaint.ai_detected_category,
            "ai_detected_department": complaint.ai_detected_department,
            "ai_detected_sector": complaint.ai_detected_sector,
            "ai_confidence": complaint.ai_confidence,
            "priority_prediction": complaint.priority_prediction,
            "estimated_resolution_days": complaint.estimated_resolution_days,
            "images": json.loads(complaint.images) if complaint.images else [],
            "voice_url": complaint.voice_url,
            "video_url": complaint.video_url,
            "citizen_id": complaint.citizen_id,
            "citizen_name": complaint.citizen_name,
            "heatmap_key": complaint.heatmap_key,
            "original_language": complaint.original_language,
            "language_code": complaint.language_code,
            "original_text": complaint.original_text,
            "final_text": complaint.final_text,
            "english_translation": complaint.english_translation,
            "created_at": str(complaint.created_at) if complaint.created_at else None,
            "updated_at": str(complaint.updated_at) if complaint.updated_at else None,
        }


complaint_repo = ComplaintRepository()

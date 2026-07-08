"""Repository for Digital Twin data."""

import json
from typing import Any, Dict, List, Optional

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.complaint import Complaint


class DigitalTwinRepository:
    """Data access for the Digital Twin map view."""

    async def get_all_complaints(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(Complaint).order_by(Complaint.created_at.desc())
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        result = await db.execute(q)
        return [self._to_marker_dict(c) for c in result.scalars().all()]

    async def get_complaint_markers(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.complaint_uid,
            Complaint.title,
            Complaint.description,
            Complaint.gps_latitude,
            Complaint.gps_longitude,
            Complaint.severity,
            Complaint.status,
            Complaint.department,
            Complaint.village,
            Complaint.ward,
            Complaint.ai_confidence,
            Complaint.priority_prediction,
            Complaint.estimated_resolution_days,
            Complaint.citizen_name,
            Complaint.created_at,
            Complaint.evidence_score,
            Complaint.images,
        ).where(
            Complaint.gps_latitude.isnot(None),
            Complaint.gps_longitude.isnot(None),
        )
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        result = await db.execute(q)
        return [
            {
                "id": r.complaint_uid,
                "title": r.title,
                "description": r.description,
                "latitude": r.gps_latitude,
                "longitude": r.gps_longitude,
                "priority": self._severity_to_priority(r.severity),
                "severity": r.severity or "medium",
                "status": self._db_status_to_display(r.status),
                "department": r.department,
                "village": r.village,
                "ward": r.ward,
                "aiConfidence": r.ai_confidence or 0,
                "priorityScore": r.priority_prediction or 0,
                "expectedResolution": r.estimated_resolution_days,
                "citizenName": r.citizen_name,
                "reportedAt": str(r.created_at) if r.created_at else None,
                "evidenceScore": r.evidence_score or 0,
                "images": json.loads(r.images) if r.images else [],
            }
            for r in result
        ]

    async def get_heatmap_data(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.gps_latitude,
            Complaint.gps_longitude,
            Complaint.priority_prediction,
            Complaint.severity,
        ).where(
            Complaint.gps_latitude.isnot(None),
            Complaint.gps_longitude.isnot(None),
        )
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        result = await db.execute(q)
        return [
            {
                "lat": r.gps_latitude,
                "lng": r.gps_longitude,
                "weight": (r.priority_prediction or 0.5) * (
                    1.5 if r.severity == "critical" else
                    1.2 if r.severity == "high" else 1.0
                ),
            }
            for r in result
        ]

    async def get_department_stats(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.department,
            func.count(Complaint.id).label("count"),
            func.sum(
                case((Complaint.severity == "critical", 1), else_=0)
            ).label("critical"),
        ).where(Complaint.department.isnot(None))
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.department)
        rows = await db.execute(q)
        return [
            {"department": r.department, "count": r.count, "critical": r.critical or 0}
            for r in rows
        ]

    async def get_village_stats(self, db: AsyncSession, constituency: Optional[str] = None) -> List[Dict[str, Any]]:
        q = select(
            Complaint.village,
            func.count(Complaint.id).label("count"),
            func.sum(
                case((Complaint.severity == "critical", 1), else_=0)
            ).label("critical"),
        ).where(Complaint.village.isnot(None))
        if constituency:
            q = q.where(Complaint.constituency_name == constituency)
        q = q.group_by(Complaint.village)
        rows = await db.execute(q)
        return [
            {"village": r.village, "count": r.count, "critical": r.critical or 0}
            for r in rows
        ]

    async def get_full_complaint(self, db: AsyncSession, uid: str) -> Dict[str, Any]:
        result = await db.execute(
            select(Complaint).where(Complaint.complaint_uid == uid)
        )
        complaint = result.scalar_one_or_none()
        if not complaint:
            return None
        d = self._to_marker_dict(complaint)
        d["description"] = complaint.description
        d["citizen_id"] = complaint.citizen_id
        d["citizen_name"] = complaint.citizen_name
        d["assembly_constituency"] = complaint.assembly_constituency
        d["lok_sabha_constituency"] = complaint.lok_sabha_constituency
        d["district"] = complaint.district
        d["state"] = complaint.state
        d["taluka"] = complaint.taluka
        d["pincode"] = complaint.pincode
        d["nearest_landmark"] = complaint.nearest_landmark
        d["verification_status"] = complaint.verification_status
        d["verification_confidence"] = complaint.verification_confidence
        d["evidence_score"] = complaint.evidence_score
        d["duplicate_probability"] = complaint.duplicate_probability
        d["duplicate_count"] = complaint.duplicate_count
        d["ai_detected_category"] = complaint.ai_detected_category
        d["ai_detected_department"] = complaint.ai_detected_department
        d["ai_detected_sector"] = complaint.ai_detected_sector
        d["priority_prediction"] = complaint.priority_prediction
        d["estimated_resolution_days"] = complaint.estimated_resolution_days
        d["voice_url"] = complaint.voice_url
        d["video_url"] = complaint.video_url
        d["heatmap_key"] = complaint.heatmap_key
        d["original_language"] = complaint.original_language
        d["english_translation"] = complaint.english_translation
        d["created_at"] = str(complaint.created_at) if complaint.created_at else None
        d["updated_at"] = str(complaint.updated_at) if complaint.updated_at else None
        return d

    def _to_marker_dict(self, c: Complaint) -> Dict[str, Any]:
        return {
            "id": c.complaint_uid,
            "title": c.title,
            "latitude": c.gps_latitude,
            "longitude": c.gps_longitude,
            "priority": self._severity_to_priority(c.severity),
            "severity": c.severity or "medium",
            "status": self._db_status_to_display(c.status),
            "department": c.department,
            "village": c.village,
            "ward": c.ward,
            "aiConfidence": c.ai_confidence or 0,
            "priorityScore": c.priority_prediction or 0,
            "expectedResolution": c.estimated_resolution_days,
            "citizenName": c.citizen_name,
            "reportedAt": str(c.created_at) if c.created_at else None,
            "evidenceScore": c.evidence_score or 0,
            "images": json.loads(c.images) if c.images else [],
        }

    def _severity_to_priority(self, severity: str) -> str:
        mapping = {"critical": "Critical", "high": "High", "medium": "Medium", "low": "Low"}
        return mapping.get(severity, "Medium")

    def _db_status_to_display(self, status: str) -> str:
        mapping = {"pending": "Open", "in_progress": "In Progress", "resolved": "Resolved", "closed": "Closed"}
        return mapping.get(status, "Open")


digital_twin_repo = DigitalTwinRepository()

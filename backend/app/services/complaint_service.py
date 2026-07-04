"""
Business logic for complaint management.

Handles:
- Creating complaints with full geo-verification pipeline
- Retrieving complaints
- Issue cluster management
- Statistics
"""

import json
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.geo_engine import (
    generate_complaint_uid,
    generate_issue_cluster_uid,
)
from app.core.exceptions import ComplaintNotFoundError
from app.core.logger import log_ai_step
from app.models.complaint import Complaint, IssueCluster
from app.schemas.complaint import (
    ComplaintCreateRequest,
    ComplaintResponse,
    ComplaintSubmitResponse,
    DuplicateCheckResult,
    IssueClusterInfo,
)
from app.services.geo_verification_service import geo_verification_service

logger = logging.getLogger("app.services.complaint")


class ComplaintService:
    """Handles complaint CRUD and business logic."""

    # -- Create Complaint ---------------------------------------------------
    @staticmethod
    async def create_complaint(
        db: AsyncSession,
        request: ComplaintCreateRequest,
    ) -> ComplaintSubmitResponse:
        """
        Create a new complaint through the full geo-verification pipeline.
        """
        log_ai_step("create_complaint_start", title=request.title)

        # Fetch existing complaints for duplicate detection
        existing = await ComplaintService._get_existing_for_duplicates(db)

        # Run geo-verification pipeline
        processing_result = await geo_verification_service.process_complaint(
            request=request,
            existing_complaints=existing,
        )

        # Generate UIDs
        complaint_uid = generate_complaint_uid()

        # Handle duplicate merging into cluster
        cluster_id = processing_result.get("cluster_id")
        cluster_info = None
        duplicate_info = None

        if processing_result["duplicate_probability"] > 0.5 and cluster_id:
            # Try to merge into existing cluster
            existing_cluster = await ComplaintService._find_or_create_cluster(
                db=db,
                complaint_uid=cluster_id,
                processing_result=processing_result,
                request=request,
            )
            if existing_cluster:
                processing_result["cluster_id"] = existing_cluster.id
                cluster_info = IssueClusterInfo(
                    id=existing_cluster.id,
                    cluster_uid=existing_cluster.cluster_uid,
                    report_count=existing_cluster.report_count,
                    category=existing_cluster.category,
                    department=existing_cluster.department,
                    centroid_lat=existing_cluster.centroid_lat,
                    centroid_lng=existing_cluster.centroid_lng,
                    radius_meters=existing_cluster.radius_meters,
                    severity=existing_cluster.severity,
                    village=existing_cluster.village,
                    ward=existing_cluster.ward,
                )
                duplicate_info = DuplicateCheckResult(
                    is_duplicate=True,
                    cluster_id=existing_cluster.id,
                    cluster_uid=existing_cluster.cluster_uid,
                    existing_report_count=existing_cluster.report_count,
                    nearest_distance_meters=0,
                    merged_into_cluster=True,
                )
        else:
            # Create new cluster for this complaint
            if processing_result["gps_latitude"] is not None:
                cluster_uid = generate_issue_cluster_uid(
                    category=request.category,
                    latitude=processing_result["gps_latitude"],
                    longitude=processing_result["gps_longitude"],
                )
                new_cluster = IssueCluster(
                    cluster_uid=cluster_uid,
                    category=request.category,
                    department=processing_result.get("ai_detected_department"),
                    sector=processing_result.get("ai_detected_sector"),
                    title=request.title,
                    description=request.description,
                    centroid_lat=processing_result["gps_latitude"],
                    centroid_lng=processing_result["gps_longitude"],
                    radius_meters=25.0,
                    report_count=1,
                    severity="medium",
                    priority_score=processing_result.get("priority_prediction", 0),
                    village=processing_result.get("village"),
                    ward=processing_result.get("ward"),
                    taluka=processing_result.get("taluka"),
                    district=processing_result.get("district"),
                    state=processing_result.get("state"),
                    assembly_constituency=processing_result.get("assembly_constituency"),
                    lok_sabha_constituency=processing_result.get("lok_sabha_constituency"),
                )
                db.add(new_cluster)
                await db.flush()

                processing_result["cluster_id"] = new_cluster.id
                cluster_info = IssueClusterInfo(
                    id=new_cluster.id,
                    cluster_uid=new_cluster.cluster_uid,
                    report_count=1,
                    category=new_cluster.category,
                    department=new_cluster.department,
                    centroid_lat=new_cluster.centroid_lat,
                    centroid_lng=new_cluster.centroid_lng,
                    radius_meters=new_cluster.radius_meters,
                    severity=new_cluster.severity,
                    village=new_cluster.village,
                    ward=new_cluster.ward,
                )

        # Create complaint record
        evidence = request.evidence
        images_json = json.dumps(evidence.image_urls) if evidence and evidence.image_urls else None

        complaint = Complaint(
            complaint_uid=complaint_uid,
            title=request.title,
            description=request.description,
            category=request.category,
            sector=processing_result.get("ai_detected_sector"),
            department=processing_result.get("ai_detected_department"),
            severity="medium",
            status="pending",

            # GPS
            gps_latitude=processing_result["gps_latitude"],
            gps_longitude=processing_result["gps_longitude"],
            gps_accuracy=processing_result["gps_accuracy"],
            gps_altitude=processing_result["gps_altitude"],
            gps_speed=processing_result["gps_speed"],
            gps_heading=processing_result["gps_heading"],
            gps_timestamp=processing_result["gps_timestamp"],

            # Geocoded address
            village=processing_result.get("village"),
            ward=processing_result.get("ward"),
            taluka=processing_result.get("taluka"),
            district=processing_result.get("district"),
            state=processing_result.get("state"),
            pincode=processing_result.get("pincode"),
            assembly_constituency=processing_result.get("assembly_constituency"),
            lok_sabha_constituency=processing_result.get("lok_sabha_constituency"),
            nearest_landmark=processing_result.get("nearest_landmark"),

            # Verification
            verification_status=processing_result["verification_status"],
            verification_confidence=processing_result["verification_confidence"],
            evidence_score=processing_result["evidence_score"],

            # Duplicate
            duplicate_probability=processing_result["duplicate_probability"],
            cluster_id=processing_result.get("cluster_id"),
            duplicate_count=processing_result["duplicate_count"],

            # AI
            ai_detected_category=processing_result.get("ai_detected_category"),
            ai_detected_department=processing_result.get("ai_detected_department"),
            ai_detected_sector=processing_result.get("ai_detected_sector"),
            ai_confidence=processing_result["ai_confidence"],
            priority_prediction=processing_result["priority_prediction"],
            estimated_resolution_days=processing_result.get("estimated_resolution_days"),

            # Evidence
            images=images_json,
            voice_url=evidence.voice_url if evidence else None,
            video_url=evidence.video_url if evidence else None,

            # Citizen
            citizen_id=request.citizen_id,
            citizen_name=request.citizen_name,

            # Heatmap
            heatmap_key=processing_result.get("heatmap_key"),
        )

        db.add(complaint)
        await db.flush()

        log_ai_step(
            "create_complaint_stored",
            complaint_uid=complaint_uid,
            evidence_score=processing_result["evidence_score"],
        )

        # Build AI preview
        ai_preview = geo_verification_service.build_ai_preview(
            processing_result, request
        )

        # Build response
        response_complaint = ComplaintResponse.model_validate(complaint)

        return ComplaintSubmitResponse(
            success=True,
            complaint=response_complaint,
            ai_preview=ai_preview,
            duplicate_info=duplicate_info,
            cluster_info=cluster_info,
            message="Complaint submitted and verified successfully",
        )

    # -- Get Complaint ------------------------------------------------------
    @staticmethod
    async def get_complaint(
        db: AsyncSession,
        complaint_uid: str,
    ) -> ComplaintResponse:
        """Get a complaint by its UID."""
        stmt = select(Complaint).where(Complaint.complaint_uid == complaint_uid)
        result = await db.execute(stmt)
        complaint = result.scalar_one_or_none()

        if not complaint:
            raise ComplaintNotFoundError(complaint_uid)

        return ComplaintResponse.model_validate(complaint)

    # -- List Complaints ----------------------------------------------------
    @staticmethod
    async def list_complaints(
        db: AsyncSession,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
        category: Optional[str] = None,
        ward: Optional[str] = None,
        village: Optional[str] = None,
    ) -> Tuple[List[ComplaintResponse], int]:
        """List complaints with optional filters."""
        stmt = select(Complaint)
        count_stmt = select(func.count(Complaint.id))

        if status:
            stmt = stmt.where(Complaint.status == status)
            count_stmt = count_stmt.where(Complaint.status == status)
        if category:
            stmt = stmt.where(Complaint.category == category)
            count_stmt = count_stmt.where(Complaint.category == category)
        if ward:
            stmt = stmt.where(Complaint.ward == ward)
            count_stmt = count_stmt.where(Complaint.ward == ward)
        if village:
            stmt = stmt.where(Complaint.village == village)
            count_stmt = count_stmt.where(Complaint.village == village)

        # Total count
        total_result = await db.execute(count_stmt)
        total = total_result.scalar() or 0

        # Paginated results
        offset = (page - 1) * page_size
        stmt = stmt.order_by(Complaint.created_at.desc()).offset(offset).limit(page_size)
        result = await db.execute(stmt)
        complaints = result.scalars().all()

        return [ComplaintResponse.model_validate(c) for c in complaints], total

    # -- Complaint Stats ----------------------------------------------------
    @staticmethod
    async def get_stats(db: AsyncSession) -> Dict[str, Any]:
        """Get complaint statistics."""
        total = await db.scalar(select(func.count(Complaint.id)))
        verified = await db.scalar(
            select(func.count(Complaint.id)).where(
                Complaint.verification_status == "verified"
            )
        )
        pending = await db.scalar(
            select(func.count(Complaint.id)).where(Complaint.status == "pending")
        )
        resolved = await db.scalar(
            select(func.count(Complaint.id)).where(Complaint.status == "resolved")
        )
        avg_score = await db.scalar(
            select(func.avg(Complaint.evidence_score))
        )
        cluster_count = await db.scalar(select(func.count(IssueCluster.id)))

        return {
            "total_complaints": total or 0,
            "verified_complaints": verified or 0,
            "pending_complaints": pending or 0,
            "resolved_complaints": resolved or 0,
            "avg_evidence_score": round(float(avg_score or 0), 1),
            "total_clusters": cluster_count or 0,
        }

    # -- Internal helpers ---------------------------------------------------
    @staticmethod
    async def _get_existing_for_duplicates(
        db: AsyncSession,
    ) -> List[Dict[str, Any]]:
        """Fetch recent complaints for duplicate detection."""
        stmt = (
            select(Complaint)
            .where(Complaint.gps_latitude.isnot(None))
            .where(Complaint.gps_longitude.isnot(None))
            .order_by(Complaint.created_at.desc())
            .limit(500)
        )
        result = await db.execute(stmt)
        complaints = result.scalars().all()

        return [
            {
                "complaint_uid": c.complaint_uid,
                "gps_latitude": c.gps_latitude,
                "gps_longitude": c.gps_longitude,
                "category": c.category,
                "title": c.title,
                "cluster_id": c.cluster_id,
            }
            for c in complaints
        ]

    @staticmethod
    async def _find_or_create_cluster(
        db: AsyncSession,
        complaint_uid: str,
        processing_result: Dict[str, Any],
        request: ComplaintCreateRequest,
    ) -> Optional[IssueCluster]:
        """Find existing cluster or update centroid for merging."""
        # Try to find a complaint that already has this cluster
        stmt = select(Complaint).where(Complaint.complaint_uid == complaint_uid)
        result = await db.execute(stmt)
        existing_complaint = result.scalar_one_or_none()

        if existing_complaint and existing_complaint.cluster_id:
            # Get the cluster
            cluster_stmt = select(IssueCluster).where(
                IssueCluster.id == existing_complaint.cluster_id
            )
            cluster_result = await db.execute(cluster_stmt)
            cluster = cluster_result.scalar_one_or_none()

            if cluster:
                # Update centroid (running average)
                n = cluster.report_count
                new_lat = processing_result.get("gps_latitude", cluster.centroid_lat)
                new_lng = processing_result.get("gps_longitude", cluster.centroid_lng)

                if new_lat and new_lng:
                    cluster.centroid_lat = (cluster.centroid_lat * n + new_lat) / (n + 1)
                    cluster.centroid_lng = (cluster.centroid_lng * n + new_lng) / (n + 1)

                cluster.report_count = n + 1
                cluster.updated_at = datetime.utcnow()

                # Update severity based on report count
                if cluster.report_count >= 10:
                    cluster.severity = "critical"
                elif cluster.report_count >= 5:
                    cluster.severity = "high"
                elif cluster.report_count >= 3:
                    cluster.severity = "medium"

                log_ai_step(
                    "cluster_updated",
                    cluster_uid=cluster.cluster_uid,
                    new_count=cluster.report_count,
                )

                return cluster

        return None


# Convenience alias
complaint_service = ComplaintService()

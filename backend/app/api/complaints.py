"""
Complaints API endpoints.

POST   /api/v1/complaints              – Submit a new complaint (full geo-pipeline)
GET    /api/v1/complaints              – List complaints (paginated, filterable)
GET    /api/v1/complaints/{uid}        – Get complaint by UID
GET    /api/v1/complaints/stats        – Get complaint statistics
"""

import logging
import time

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import CDPException
from app.database.session import get_db
from app.schemas.complaint import (
    ComplaintCreateRequest,
    ComplaintListResponse,
    ComplaintResponse,
    ComplaintStatsResponse,
    ComplaintSubmitResponse,
)
from app.services.complaint_service import complaint_service

router = APIRouter()
logger = logging.getLogger("app.api.complaints")


@router.post("/", response_model=ComplaintSubmitResponse)
async def submit_complaint(
    request: ComplaintCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Submit a new complaint through the AI geo-verification pipeline.

    Steps:
    1. Validate GPS data
    2. Reverse geocode to address
    3. Detect constituency
    4. AI department/sector detection
    5. Duplicate search in radius
    6. Evidence score calculation
    7. Store complaint with cluster
    """
    start = time.perf_counter()

    try:
        response = await complaint_service.create_complaint(db, request)
        elapsed = (time.perf_counter() - start) * 1000

        logger.info(
            "POST /complaints | uid=%s | score=%.1f | status=%s | %.1fms",
            response.complaint.complaint_uid,
            response.complaint.evidence_score,
            response.complaint.verification_status,
            elapsed,
        )

        return response

    except CDPException:
        raise
    except Exception as e:
        elapsed = (time.perf_counter() - start) * 1000
        logger.error(
            "POST /complaints FAILED | error=%s | %.1fms",
            str(e),
            elapsed,
            exc_info=True,
        )
        raise CDPException(
            message=f"Failed to submit complaint: {str(e)}",
            status_code=500,
        )


@router.get("/", response_model=ComplaintListResponse)
async def list_complaints(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    category: str = Query(None),
    ward: str = Query(None),
    village: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List complaints with optional filters and pagination."""
    complaints, total = await complaint_service.list_complaints(
        db=db,
        page=page,
        page_size=page_size,
        status=status,
        category=category,
        ward=ward,
        village=village,
    )
    return ComplaintListResponse(
        complaints=complaints,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/stats", response_model=ComplaintStatsResponse)
async def get_complaint_stats(
    db: AsyncSession = Depends(get_db),
):
    """Get complaint statistics for dashboard."""
    stats = await complaint_service.get_stats(db)
    return ComplaintStatsResponse(**stats)


@router.get("/{complaint_uid}", response_model=ComplaintResponse)
async def get_complaint(
    complaint_uid: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single complaint by its UID."""
    return await complaint_service.get_complaint(db, complaint_uid)

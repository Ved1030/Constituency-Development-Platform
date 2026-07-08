"""Digital Twin API endpoints."""

import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.common import DigitalTwinResponse
from app.services.digital_twin_service import digital_twin_service

router = APIRouter()
logger = logging.getLogger("app.api.digital_twin")


@router.get("/", response_model=DigitalTwinResponse)
async def get_digital_twin(
    constituency: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """All digital twin data: markers, heatmap, stats."""
    data = await digital_twin_service.get_digital_twin(db, constituency=constituency)
    return DigitalTwinResponse(**data)


@router.get("/complaints/{complaint_uid}")
async def get_complaint_detail(
    complaint_uid: str,
    db: AsyncSession = Depends(get_db),
):
    """Full complaint detail for the right intelligence panel."""
    data = await digital_twin_service.get_full_complaint(db, complaint_uid)
    if not data:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return data

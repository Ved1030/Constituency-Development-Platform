"""Demo data seeding API endpoints."""

import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.services.seed_service import seed_constituency, count_existing

router = APIRouter()
logger = logging.getLogger("app.api.seed")


@router.post("/ensure")
async def ensure_demo_data(
    constituency: str = Query(..., description="Constituency name to seed"),
    min_count: int = Query(25, ge=1),
    max_count: int = Query(40, ge=1),
    db: AsyncSession = Depends(get_db),
):
    """Ensure a constituency has demo data (seed if below threshold)."""
    try:
        result = await seed_constituency(db, constituency, min_count=min_count, max_count=max_count)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/status")
async def seed_status(
    constituency: str = Query(..., description="Constituency name"),
    db: AsyncSession = Depends(get_db),
):
    """Check how many complaints exist for a constituency."""
    count = await count_existing(db, constituency)
    return {"constituency": constituency, "complaint_count": count}

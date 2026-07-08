"""Demo data seeding API endpoints."""

import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.services.seed_service import seed_constituency, count_existing
from app.services.user_service import seed_mp_accounts

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


@router.post("/mp-users")
async def seed_mp_users():
    """Create the 3 demo MP accounts in Supabase Auth.

    These are the official demo MP accounts:

    | Email                    | Password      | Constituency    | MP Name          |
    |--------------------------|---------------|-----------------|------------------|
    | mp.northchennai@gov.in   | Password123   | North Chennai   | Dr. Rajesh Sharma|
    | mp.mumbai@gov.in         | Password123   | South Mumbai    | Smt. Meera Desai |
    | mp.surat@gov.in          | Password123   | Central Surat   | Shri Amit Joshi  |

    The DB trigger `on_profile_mp_promotion` auto-sets their role to 'mp'
    when the profile is created, so no additional SQL is needed.

    Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend .env.
    """
    result = await seed_mp_accounts()
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result


@router.get("/status")
async def seed_status(
    constituency: str = Query(..., description="Constituency name"),
    db: AsyncSession = Depends(get_db),
):
    """Check how many complaints exist for a constituency."""
    count = await count_existing(db, constituency)
    return {"constituency": constituency, "complaint_count": count}

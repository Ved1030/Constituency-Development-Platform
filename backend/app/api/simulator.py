"""Impact simulator API endpoints."""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.services.simulator_service import simulator_service

router = APIRouter()
logger = logging.getLogger("app.api.simulator")


@router.get("/projects")
async def list_simulator_projects(db: AsyncSession = Depends(get_db)):
    """List projects available for simulation."""
    projects = await simulator_service.get_projects(db)
    return {"projects": projects, "total": len(projects)}


@router.post("/simulate")
async def run_simulation(
    request: dict,
    db: AsyncSession = Depends(get_db),
):
    """Run an impact simulation."""
    return await simulator_service.run_simulation(db, request)

"""Projects API endpoints."""

import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.common import ProjectResponse
from app.services.project_service import project_service

router = APIRouter()
logger = logging.getLogger("app.api.projects")


@router.get("/", response_model=ProjectResponse)
async def list_projects(db: AsyncSession = Depends(get_db)):
    """List all development projects."""
    projects = await project_service.get_projects(db)
    return ProjectResponse(projects=projects, total=len(projects))


@router.get("/{project_id}")
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    """Get single project by ID."""
    project = await project_service.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

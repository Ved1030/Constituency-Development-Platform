"""AI Copilot API endpoints."""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.common import CopilotResponse
from app.services.copilot_service import copilot_service

router = APIRouter()
logger = logging.getLogger("app.api.copilot")


@router.get("/context", response_model=CopilotResponse)
async def get_copilot_context(db: AsyncSession = Depends(get_db)):
    """Get context data for copilot."""
    data = await copilot_service.get_context(db)
    return CopilotResponse(**data)


@router.post("/query")
async def copilot_query(
    request: dict,
    db: AsyncSession = Depends(get_db),
):
    """Handle a copilot query."""
    return await copilot_service.handle_query(db, request.get("query", ""))

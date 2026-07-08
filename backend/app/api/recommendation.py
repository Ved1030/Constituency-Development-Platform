"""Recommendations API endpoints."""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.common import RecommendationResponse
from app.services.recommendation_service import recommendation_service

router = APIRouter()
logger = logging.getLogger("app.api.recommendations")


@router.get("/", response_model=RecommendationResponse)
async def list_recommendations(db: AsyncSession = Depends(get_db)):
    """List all policy recommendations."""
    recommendations = await recommendation_service.get_recommendations(db)
    return RecommendationResponse(recommendations=recommendations, total=len(recommendations))

"""Business logic for generating recommendations."""

import logging
from typing import Any, Dict, List

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.complaint_repository import complaint_repo

logger = logging.getLogger("app.services.recommendation")


class RecommendationService:
    """Service for policy recommendations."""

    async def get_recommendations(self, db: AsyncSession) -> List[Dict[str, Any]]:
        departments = await complaint_repo.get_complaints_by_department(db)
        severity = await complaint_repo.get_severity_counts(db)
        recommendations = []
        for dept in departments:
            if dept["total"] > 5:
                recommendations.append({
                    "id": f"rec-{dept['department'].lower().replace(' ', '-')}",
                    "title": f"Improve {dept['department']} response time",
                    "department": dept["department"],
                    "priority": "high" if dept["total"] > 20 else "medium",
                    "description": f"{dept['total']} complaints received. Consider increasing resources.",
                    "estimated_budget": dept["total"] * 50000,
                    "impact": "High",
                })
        return recommendations


recommendation_service = RecommendationService()

"""Business logic for AI Copilot."""

import logging
from datetime import datetime
from typing import Any, Dict

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.dashboard_repository import dashboard_repo
from app.repositories.complaint_repository import complaint_repo

logger = logging.getLogger("app.services.copilot")


class CopilotService:
    """Service for AI copilot context and queries."""

    async def get_context(self, db: AsyncSession) -> Dict[str, Any]:
        summary = await dashboard_repo.get_summary(db)
        recent = await dashboard_repo.get_recent_activity(db, limit=5)
        return {
            "message": "Copilot context loaded from database",
            "data": {
                "constituency": "Your Constituency",
                "total_complaints": summary.get("total_complaints", 0),
                "critical_complaints": summary.get("critical_complaints", 0),
                "resolved_complaints": summary.get("resolved_complaints", 0),
                "top_departments": [],
                "recent_activity": recent,
            },
        }

    async def handle_query(self, db: AsyncSession, query: str) -> Dict[str, Any]:
        summary = await dashboard_repo.get_summary(db)
        return {
            "answer": f"Based on database analysis: {summary.get('total_complaints', 0)} total complaints, "
                      f"{summary.get('critical_complaints', 0)} critical, "
                      f"{summary.get('resolved_complaints', 0)} resolved.",
            "data": {"query": query, "summary": summary},
        }


copilot_service = CopilotService()

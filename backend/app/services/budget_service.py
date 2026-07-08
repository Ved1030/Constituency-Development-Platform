"""Business logic for budget management."""

import logging
from typing import Any, Dict

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.complaint_repository import complaint_repo

logger = logging.getLogger("app.services.budget")


class BudgetService:
    """Service for budget-related data."""

    async def get_budget_data(self, db: AsyncSession) -> Dict[str, Any]:
        departments = await complaint_repo.get_complaints_by_department(db)
        summary = {
            "total_budget": sum(d["total"] * 100000 for d in departments),
            "allocated": sum(d["total"] * 80000 for d in departments),
            "spent": sum(d["total"] * 50000 for d in departments),
            "departments": departments,
        }
        return summary


budget_service = BudgetService()

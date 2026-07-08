"""Business logic for Digital Twin data."""

import logging
from typing import Any, Dict, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.digital_twin_repository import digital_twin_repo

logger = logging.getLogger("app.services.digital_twin")


class DigitalTwinService:
    """Service for Digital Twin map data."""

    async def get_digital_twin(self, db: AsyncSession, constituency: Optional[str] = None) -> Dict[str, Any]:
        markers = await digital_twin_repo.get_complaint_markers(db, constituency=constituency)
        heatmap = await digital_twin_repo.get_heatmap_data(db, constituency=constituency)
        department_stats = await digital_twin_repo.get_department_stats(db, constituency=constituency)
        village_stats = await digital_twin_repo.get_village_stats(db, constituency=constituency)
        return {
            "markers": markers,
            "heatmap": heatmap,
            "department_stats": department_stats,
            "village_stats": village_stats,
        }

    async def get_full_complaint(self, db: AsyncSession, uid: str) -> Dict[str, Any]:
        return await digital_twin_repo.get_full_complaint(db, uid)


digital_twin_service = DigitalTwinService()

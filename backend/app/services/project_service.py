"""Business logic for project management."""

import logging
from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger("app.services.project")


class ProjectService:
    """Service for project data."""

    async def get_projects(self, db: AsyncSession) -> List[Dict[str, Any]]:
        return []

    async def get_project(self, db: AsyncSession, project_id: str) -> Optional[Dict[str, Any]]:
        return None


project_service = ProjectService()

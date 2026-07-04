"""Health-check route (example of a route module under routes/)."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "healthy"}

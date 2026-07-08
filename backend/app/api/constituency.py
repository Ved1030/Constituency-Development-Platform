"""Constituency profile API endpoints."""

import json
import logging
from pathlib import Path

from fastapi import APIRouter, HTTPException

router = APIRouter()
logger = logging.getLogger("app.api.constituency")

CONSTITUENCIES_PATH = Path(__file__).resolve().parent.parent / "data" / "constituencies.json"


def _load_constituencies():
    if not CONSTITUENCIES_PATH.exists():
        return {}
    with open(CONSTITUENCIES_PATH) as f:
        return json.load(f)


@router.get("/")
async def list_constituencies():
    """List all available constituencies."""
    data = _load_constituencies()
    return [
        {
            "name": v["name"],
            "slug": v["slug"],
            "state": v["state"],
            "district": v["district"],
            "center": v["center"],
            "zoom": v["zoom"],
            "mp_name": v["mp_name"],
        }
        for v in data.values()
    ]


@router.get("/{name}")
async def get_constituency_profile(name: str):
    """Get full profile for a constituency by name."""
    data = _load_constituencies()
    if name not in data:
        raise HTTPException(status_code=404, detail=f"Constituency '{name}' not found")
    return data[name]

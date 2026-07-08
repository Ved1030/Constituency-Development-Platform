"""
Social Media Intelligence API endpoints.

GET /social/feed          - Paginated social feed with filters
GET /social/posts         - All posts
GET /social/posts/{id}    - Single post
GET /social/news          - News articles
GET /social/trending      - Trending data
GET /social/sync          - Force sync from live platforms
GET /social/status        - Current data source status
GET /social/report        - Startup integrity report
GET /social/media/{path}  - Cached media files (with demo fallback)
"""

import os
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from app.services.social_service import (
    get_feed,
    get_posts,
    get_news,
    get_data_source,
    sync_all_platforms,
    SOCIAL_DIR,
    DEMO_DIR,
    startup_report,
)

router = APIRouter()


@router.get("/feed")
async def social_feed(
    cursor: Optional[str] = Query(None, description="Pagination cursor"),
    limit: int = Query(20, ge=1, le=100, description="Posts per page"),
    platform: Optional[str] = Query(None, description="Filter by platform (comma-separated): twitter,instagram,facebook,youtube,news"),
    category: Optional[str] = Query(None, description="Filter by category (comma-separated): Roads,Water Supply,..."),
    severity: Optional[str] = Query(None, description="Filter by severity: Critical,High,Medium,Low"),
    min_likes: Optional[int] = Query(None, ge=0, description="Minimum likes threshold"),
    search: Optional[str] = Query(None, description="Search text (matches author, text, category, location)"),
):
    """
    Paginated social media intelligence feed with server-side filtering.

    Supports cursor-based pagination and multi-dimensional filtering.
    Data source is live (Apify) when APIFY_TOKEN is set, otherwise mock.
    """
    return get_feed(
        cursor=cursor,
        limit=limit,
        platform=platform,
        category=category,
        severity=severity,
        min_likes=min_likes,
        search=search,
    )


@router.get("/posts")
async def social_posts():
    """All social posts."""
    return {"posts": get_posts(), "source": get_data_source()}


@router.get("/posts/{post_id}")
async def social_post(post_id: str):
    """Single post by ID."""
    for post in get_posts():
        if post["id"] == post_id:
            return post
    raise HTTPException(status_code=404, detail=f"Post {post_id} not found")


@router.get("/news")
async def social_news():
    """News articles."""
    return {"articles": get_news(), "source": get_data_source()}


@router.get("/trending")
async def social_trending():
    """Trending topics and wards."""
    from app.services.social_service import _generate_trending_topics
    return {
        "topics": _generate_trending_topics(),
    }


@router.post("/sync")
async def social_sync():
    """
    Force sync all platforms from live sources.

    Bypasses the cache and re-fetches from Apify.
    Returns status of the sync operation.
    """
    return sync_all_platforms()


@router.get("/status")
async def social_status():
    """Current data source and cache status."""
    from app.services.social_service import _live_timestamp, _live_source, settings
    import time
    age = time.time() - _live_timestamp if _live_timestamp else None
    return {
        "source": _live_source,
        "cacheAge": round(age, 1) if age else None,
        "cacheTTL": settings.APIFY_CACHE_TTL,
        "apifyConfigured": bool(settings.APIFY_TOKEN),
    }


@router.get("/report")
async def media_report():
    """Startup media integrity report."""
    return startup_report()


@router.get("/media/{file_path:path}")
async def serve_media(file_path: str):
    """
    Serve cached media files.

    Looks in media/social/ first, falls back to media/demo/ (including subfolders).
    The frontend never depends on third-party image URLs.
    """
    filename = os.path.basename(file_path)

    # Try social cache first
    social_path = SOCIAL_DIR / filename
    if social_path.exists():
        return _file_response(social_path)

    # Fallback: try demo assets (flat)
    demo_path = DEMO_DIR / filename
    if demo_path.exists():
        return _file_response(demo_path)

    # Fallback: search demo subdirectories
    for subdir in DEMO_DIR.iterdir():
        if subdir.is_dir():
            candidate = subdir / filename
            if candidate.exists():
                return _file_response(candidate)

    # Handle old-format paths like "media/social/file.svg"
    if "media/social/" in file_path:
        just_name = file_path.split("media/social/")[-1]
        social_path2 = SOCIAL_DIR / os.path.basename(just_name)
        if social_path2.exists():
            return _file_response(social_path2)

    raise HTTPException(status_code=404, detail=f"Media not found: {filename}")


def _file_response(path):
    """Build a FileResponse with correct content type and caching."""
    suffix = path.suffix.lower()
    content_types = {
        ".svg": "image/svg+xml",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".mp4": "video/mp4",
        ".webm": "video/webm",
    }
    ct = content_types.get(suffix, "application/octet-stream")
    return FileResponse(
        path=str(path),
        media_type=ct,
        headers={"Cache-Control": "public, max-age=86400"},
    )

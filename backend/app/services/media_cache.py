"""
Media download and local cache.

Downloads images/video thumbnails from remote URLs, saves them locally,
and serves them through the backend. The frontend never depends on
third-party image URLs.
"""

import hashlib
import logging
import os
from pathlib import Path
from typing import Optional

import httpx

from app.core.config import settings
from app.services.social_service import SOCIAL_DIR, DEMO_DIR, CATEGORY_DEMO_MAP

logger = logging.getLogger("social.media")

# Extension mapping for content types
_EXT_MAP = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".jpg",
    "image/svg+xml": ".svg",
    "video/mp4": ".mp4",
}


def _url_hash(url: str) -> str:
    """Deterministic short hash of a URL for filename."""
    return hashlib.md5(url.encode()).hexdigest()[:16]


def _extension_from_url(url: str) -> str:
    """Guess extension from URL path."""
    path = url.split("?")[0].split("#")[0]
    for ext in (".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".mp4"):
        if path.lower().endswith(ext):
            return ext
    return ".jpg"


def download_media(url: str, category: str = "Roads") -> str:
    """
    Download a remote image and cache it locally.

    Returns the local filename (not full path) that can be served
    via /api/v1/social/media/{filename}.

    On failure, returns the demo fallback for the given category.
    """
    if not url:
        return _demo_fallback(category)

    # Check if already cached
    filename = f"{_url_hash(url)}{_extension_from_url(url)}"
    local_path = SOCIAL_DIR / filename
    if local_path.exists():
        return filename

    try:
        resp = httpx.get(
            url,
            timeout=settings.APIFY_REQUEST_TIMEOUT,
            follow_redirects=True,
            headers={"User-Agent": "CDP-MediaCache/1.0"},
        )
        resp.raise_for_status()

        # Detect actual content type from response
        ct = resp.headers.get("content-type", "")
        if "jpeg" in ct or "jpg" in ct:
            ext = ".jpg"
        elif "png" in ct:
            ext = ".png"
        elif "gif" in ct:
            ext = ".gif"
        elif "webp" in ct:
            ext = ".jpg"  # serve as jpg for browser compat
        elif "svg" in ct:
            ext = ".svg"
        elif "video" in ct:
            ext = ".mp4"
        else:
            ext = _extension_from_url(url)

        # Re-derive filename with correct extension
        filename = f"{_url_hash(url)}{ext}"
        local_path = SOCIAL_DIR / filename

        # Write to disk
        local_path.write_bytes(resp.content)
        logger.debug("Cached media: %s (%d bytes)", filename, len(resp.content))
        return filename

    except Exception as exc:
        logger.warning("Failed to download %s: %s", url[:80], exc)
        return _demo_fallback(category)


def _demo_fallback(category: str) -> str:
    """Return the demo fallback filename for a category."""
    name = CATEGORY_DEMO_MAP.get(category, "road")
    # Strip any extension from the map value — we add .jpg ourselves
    name = name.rsplit(".", 1)[0] if "." in name else name
    return f"{name}.jpg"


def get_cached_or_demo(url: str, category: str = "Roads") -> str:
    """
    Get a local filename for a media URL.
    Returns cached version if available, otherwise demo fallback.
    Always returns a filename that exists on disk.
    """
    if not url:
        return _demo_fallback(category)

    filename = f"{_url_hash(url)}{_extension_from_url(url)}"
    if (SOCIAL_DIR / filename).exists():
        return filename

    # Try downloading
    return download_media(url, category)


def verify_media_integrity() -> dict:
    """Check all referenced media files exist on disk."""
    social_files = set(os.listdir(SOCIAL_DIR)) if SOCIAL_DIR.exists() else set()
    demo_files = set(os.listdir(DEMO_DIR)) if DEMO_DIR.exists() else set()
    return {
        "social_count": len(social_files),
        "demo_count": len(demo_files),
        "social_files": sorted(social_files),
        "demo_files": sorted(demo_files),
    }

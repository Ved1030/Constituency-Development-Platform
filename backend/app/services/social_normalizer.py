"""
Normalize raw platform data into the unified SocialPost schema.

Each platform returns different field names and structures.
This module maps them all to a single format the frontend expects.
"""

import re
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.services.media_cache import get_cached_or_demo

# ---------------------------------------------------------------------------
# Category keyword detection
# ---------------------------------------------------------------------------

_CATEGORY_KEYWORDS = {
    "Water Supply": ["water", "pipeline", "borewell", "tanker", "supply", "drought", "groundwater"],
    "Roads": ["road", "pothole", "traffic", "bridge", "pavement", "footpath", "metro"],
    "Drainage": ["drain", "sewage", "flood", "waterlogging", "overflow", "stormwater"],
    "Electricity": ["power", "electricity", "blackout", "transformer", "outage", "energy"],
    "Garbage": ["garbage", "waste", "trash", "dump", "plastic", "litter"],
    "Healthcare": ["hospital", "doctor", "patient", "medical", "phc", "clinic", "health"],
    "Public Safety": ["accident", "safety", "crime", "fire", "police", "protest"],
    "Education": ["school", "college", "student", "teacher", "education", "anganwadi"],
    "Housing": ["house", "housing", "flat", "apartment", "slum", "eviction", "shelter"],
    "Agriculture": ["farm", "crop", "agriculture", "irrigation", "farmer", "harvest"],
    "Environment": ["environment", "pollution", "mangrove", "coast", "fishing", "air quality"],
    "Sanitation": ["sanitation", "toilet", "hygiene", "clean", "sewage treatment"],
}

_SEVERITY_KEYWORDS = {
    "Critical": ["urgent", "emergency", "death", "collapsed", "protest", "blocked", "blast", "fire"],
    "High": ["severe", "critical", "dangerous", "overflow", "shortage", "crisis"],
    "Medium": ["damaged", "broken", "needed", "required", "complaint"],
    "Low": ["update", "progress", "improvement", "completed", "resolved"],
}


def _detect_category(text: str) -> str:
    """Detect complaint category from post text."""
    lower = text.lower()
    scores = {}
    for cat, keywords in _CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in lower)
        if score > 0:
            scores[cat] = score
    if scores:
        return max(scores, key=scores.get)
    return "Roads"  # default


def _detect_severity(text: str) -> str:
    """Detect severity from text."""
    lower = text.lower()
    for level in ["Critical", "High", "Medium", "Low"]:
        if any(kw in lower for kw in _SEVERITY_KEYWORDS[level]):
            return level
    return "Medium"


def _detect_sentiment(text: str) -> str:
    """Simple keyword-based sentiment detection."""
    lower = text.lower()
    positive = ["good", "great", "thank", "appreciate", "improvement", "progress", "resolved", "help"]
    negative = ["bad", "terrible", "worst", "danger", "crisis", "broken", "failed", "protest", "death"]
    pos = sum(1 for w in positive if w in lower)
    neg = sum(1 for w in negative if w in lower)
    if pos > neg:
        return "positive"
    if neg > pos:
        return "negative"
    return "neutral"


def _extract_hashtags(text: str) -> List[str]:
    """Extract hashtags from text."""
    return list(set(re.findall(r"#\w+", text)))


def _extract_mentions(text: str) -> List[str]:
    """Extract @mentions from text."""
    return list(set(re.findall(r"@\w+", text)))


def _estimate_engagement(raw: Dict[str, Any]) -> Dict[str, int]:
    """Extract or estimate engagement metrics from raw data."""
    # Try common field names
    likes = (
        raw.get("likesCount")
        or raw.get("likes")
        or raw.get("favorite_count")
        or raw.get("likeCount")
        or 0
    )
    comments = (
        raw.get("commentsCount")
        or raw.get("comments")
        or raw.get("reply_count")
        or raw.get("commentCount")
        or 0
    )
    shares = (
        raw.get("sharesCount")
        or raw.get("shares")
        or raw.get("retweet_count")
        or raw.get("shareCount")
        or 0
    )
    views = (
        raw.get("viewsCount")
        or raw.get("views")
        or raw.get("view_count")
        or raw.get("playCount")
        or 0
    )
    return {
        "likes": int(likes) if likes else 0,
        "comments": int(comments) if comments else 0,
        "shares": int(shares) if shares else 0,
        "views": int(views) if views else 0,
    }


def _extract_media(
    raw: Dict[str, Any],
    platform: str,
    category: str,
) -> List[Dict[str, Any]]:
    """Extract media attachments from raw data, download/cache each."""
    media = []

    # Collect all image/video URLs from various platform formats
    image_urls = []
    video_url = None
    video_thumb = None
    duration = None

    if platform == "twitter":
        # Twitter media format
        media_entities = raw.get("media") or raw.get("extendedEntities", {}).get("media", [])
        for m in media_entities:
            if m.get("type") == "video":
                variants = m.get("video_info", {}).get("variants", [])
                for v in variants:
                    if v.get("content_type") == "video/mp4":
                        video_url = v.get("url", "")
                        break
                video_thumb = m.get("media_url_https", "")
            elif m.get("type") in ("photo", "animated_gif"):
                image_urls.append(m.get("media_url_https", ""))
        # Also check for images in photos array
        if not image_urls:
            image_urls = [p.get("url", "") for p in raw.get("photos", []) if p.get("url")]

    elif platform == "instagram":
        # Apify instagram-scraper output: displayUrl, sideCar children
        image_urls = [raw.get("displayUrl", "")]
        # Sidecar posts have children with their own images
        children = raw.get("children", [])
        for child in children[:2]:
            if child.get("displayUrl"):
                image_urls.append(child["displayUrl"])
        if raw.get("videoUrl"):
            video_url = raw["videoUrl"]
            video_thumb = raw.get("displayUrl", "")

    elif platform == "facebook":
        # Apify facebook-posts-scraper output: text, user object, url
        image_urls = []
        # Facebook posts may have shared link preview
        if raw.get("link"):
            image_urls = []  # links don't have inline images usually
        if raw.get("videoUrl"):
            video_url = raw["videoUrl"]

    elif platform == "youtube":
        video_thumb = raw.get("thumbnailUrl", "") or raw.get("imageUrl", "")
        video_url = raw.get("url", "") or raw.get("videoUrl", "")
        duration = raw.get("duration")

    elif platform == "news":
        image_urls = [raw.get("image", "")]

    # Download/cache images
    for i, url in enumerate(image_urls[:2]):  # max 2 images
        if url:
            filename = get_cached_or_demo(url, category)
            media.append({
                "id": f"media-{uuid.uuid4().hex[:8]}",
                "type": "image",
                "url": f"/media/social/{filename}",
                "thumbnailUrl": f"/media/social/{filename}",
                "width": 800,
                "height": 600,
            })

    # Download/cache video thumbnail
    if video_url or video_thumb:
        thumb_url = video_thumb or video_url
        filename = get_cached_or_demo(thumb_url, category)
        if duration and isinstance(duration, str):
            # Parse "PT1M30S" or "90" formats
            try:
                if duration.startswith("PT"):
                    mins = 0
                    secs = 0
                    if "H" in duration:
                        parts = duration.split("H")
                        mins = int(parts[0].replace("PT", "")) * 60
                        duration = parts[1]
                    if "M" in duration:
                        parts = duration.split("M")
                        mins += int(parts[0].replace("PT", ""))
                        duration = parts[1]
                    if "S" in duration:
                        secs = int(duration.replace("S", ""))
                    duration = mins * 60 + secs
                else:
                    duration = int(duration)
            except (ValueError, IndexError):
                duration = 60
        media.append({
            "id": f"media-{uuid.uuid4().hex[:8]}",
            "type": "video" if not video_thumb else "short",
            "url": f"/media/social/{filename}",
            "thumbnailUrl": f"/media/social/{filename}",
            "duration": duration or 60,
            "width": 1280,
            "height": 720,
        })

    # Guarantee at least one image
    if not media:
        filename = get_cached_or_demo("", category)
        media.append({
            "id": f"media-{uuid.uuid4().hex[:8]}",
            "type": "image",
            "url": f"/media/social/{filename}",
            "thumbnailUrl": f"/media/social/{filename}",
            "width": 800,
            "height": 600,
        })

    return media


def _parse_timestamp(raw: Dict[str, Any], platform: str) -> str:
    """Extract and normalize timestamp to ISO format."""
    ts = (
        raw.get("time")  # Facebook uses 'time'
        or raw.get("timestamp")
        or raw.get("createdAt")
        or raw.get("created_at")
        or raw.get("published")
        or raw.get("publishedAt")
        or ""
    )
    if not ts:
        return datetime.now(timezone.utc).isoformat()

    # Try parsing common formats
    for fmt in (
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S%z",
        "%a %b %d %H:%M:%S %z %Y",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ):
        try:
            dt = datetime.strptime(ts, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.isoformat()
        except ValueError:
            continue

    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Platform normalizers
# ---------------------------------------------------------------------------

def normalize_twitter(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize a Twitter/X post."""
    text = raw.get("full_text") or raw.get("text") or ""
    author = raw.get("author", {})
    if isinstance(author, str):
        author = {"name": author, "userName": author}

    category = _detect_category(text)
    engagement = _estimate_engagement(raw)

    return {
        "id": f"tw-{raw.get('id') or uuid.uuid4().hex[:12]}",
        "platform": "twitter",
        "authorName": author.get("name") or author.get("userName", "Unknown"),
        "authorUsername": f"@{author.get('userName', 'unknown')}",
        "authorAvatar": "".join(w[0] for w in (author.get("name", "U")).split()[:2]).upper(),
        "isVerified": author.get("isVerified", False),
        "timestamp": _parse_timestamp(raw, "twitter"),
        "text": text,
        "hashtags": _extract_hashtags(text),
        "mentions": _extract_mentions(text),
        "geoLocation": {
            "lat": raw.get("coordinate", {}).get("lat", 13.12) if isinstance(raw.get("coordinate"), dict) else 13.12,
            "lng": raw.get("coordinate", {}).get("lng", 80.28) if isinstance(raw.get("coordinate"), dict) else 80.28,
            "ward": raw.get("place", {}).get("name", "Unknown"),
            "village": raw.get("place", {}).get("fullName", "Chennai"),
        },
        "category": category,
        "severity": _detect_severity(text),
        "sentiment": _detect_sentiment(text),
        "likes": engagement["likes"],
        "comments": engagement["comments"],
        "shares": engagement["shares"],
        "views": engagement["views"],
        "media": _extract_media(raw, "twitter", category),
        "originalUrl": raw.get("url") or f"https://x.com/i/status/{raw.get('id', '')}",
        "ai": _default_ai(category, text),
        "isFakeNews": False,
    }


def normalize_instagram(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize an Instagram post. Matches apify~instagram-scraper output."""
    text = raw.get("caption") or raw.get("text") or ""
    # Apify IG scraper doesn't return ownerUsername directly; derive from inputUrl or use shortCode
    author = raw.get("ownerUsername") or raw.get("inputUrl", "").split("/")[-2] or "user"
    if author.startswith("explore"):
        author = "chennai"
    short_code = raw.get("shortCode", "")

    category = _detect_category(text)
    engagement = _estimate_engagement(raw)

    return {
        "id": f"ig-{raw.get('id') or short_code or uuid.uuid4().hex[:12]}",
        "platform": "instagram",
        "authorName": author.title(),
        "authorUsername": f"@{author}",
        "authorAvatar": "".join(w[0] for w in author.title().split()[:2]),
        "isVerified": False,
        "timestamp": _parse_timestamp(raw, "instagram"),
        "text": text,
        "hashtags": raw.get("hashtags", []) or _extract_hashtags(text),
        "mentions": raw.get("mentions", []) or _extract_mentions(text),
        "geoLocation": {
            "lat": 13.12,
            "lng": 80.28,
            "ward": "Chennai",
            "village": "Chennai",
        },
        "category": category,
        "severity": _detect_severity(text),
        "sentiment": _detect_sentiment(text),
        "likes": engagement["likes"],
        "comments": engagement["comments"],
        "shares": engagement["shares"],
        "views": engagement["views"],
        "media": _extract_media(raw, "instagram", category),
        "originalUrl": raw.get("url") or "",
        "ai": _default_ai(category, text),
        "isFakeNews": False,
    }


def normalize_facebook(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize a Facebook post. Matches apify~facebook-posts-scraper output."""
    text = raw.get("text") or raw.get("message") or ""
    # Apify FB scraper returns user as object with name, profileUrl, profilePic
    user = raw.get("user", {})
    if isinstance(user, dict):
        author = user.get("name", "Unknown")
        profile_url = user.get("profileUrl", "")
        avatar_url = user.get("profilePic", "")
    else:
        author = str(user) if user else "Unknown"
        profile_url = ""
        avatar_url = ""
    page_name = raw.get("pageName", "")

    category = _detect_category(text)
    engagement = _estimate_engagement(raw)

    return {
        "id": f"fb-{raw.get('postId') or raw.get('id') or uuid.uuid4().hex[:12]}",
        "platform": "facebook",
        "authorName": author or page_name,
        "authorUsername": profile_url,
        "authorAvatar": "".join(w[0] for w in author.split()[:2]).upper() if author else "FB",
        "isVerified": False,
        "timestamp": _parse_timestamp(raw, "facebook"),
        "text": text,
        "hashtags": _extract_hashtags(text),
        "mentions": _extract_mentions(text),
        "geoLocation": {
            "lat": 13.12,
            "lng": 80.28,
            "ward": "Chennai",
            "village": "Chennai",
        },
        "category": category,
        "severity": _detect_severity(text),
        "sentiment": _detect_sentiment(text),
        "likes": engagement["likes"],
        "comments": engagement["comments"],
        "shares": engagement["shares"],
        "views": engagement["views"],
        "media": _extract_media(raw, "facebook", category),
        "originalUrl": raw.get("url") or "",
        "ai": _default_ai(category, text),
        "isFakeNews": False,
    }


def normalize_youtube(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize a YouTube video."""
    title = raw.get("title") or raw.get("name") or ""
    description = raw.get("description") or raw.get("text", "")
    text = f"{title}. {description}" if description else title
    author = raw.get("authorName") or raw.get("channelName", "Unknown")

    category = _detect_category(text)
    engagement = _estimate_engagement(raw)

    duration_secs = raw.get("duration")
    if isinstance(duration_secs, str):
        try:
            duration_secs = int(duration_secs)
        except ValueError:
            duration_secs = 120

    return {
        "id": f"yt-{raw.get('id') or uuid.uuid4().hex[:12]}",
        "platform": "youtube",
        "authorName": author,
        "authorUsername": raw.get("channelUrl", ""),
        "authorAvatar": "".join(w[0] for w in author.split()[:2]).upper(),
        "isVerified": raw.get("isVerified", False),
        "timestamp": _parse_timestamp(raw, "youtube"),
        "text": text[:500],
        "hashtags": _extract_hashtags(text),
        "mentions": _extract_mentions(text),
        "geoLocation": {
            "lat": 13.12,
            "lng": 80.28,
            "ward": "Unknown",
            "village": "Chennai",
        },
        "category": category,
        "severity": _detect_severity(text),
        "sentiment": _detect_sentiment(text),
        "likes": engagement["likes"],
        "comments": engagement["comments"],
        "shares": engagement["shares"],
        "views": engagement["views"],
        "media": _extract_media(raw, "youtube", category),
        "originalUrl": raw.get("url") or raw.get("link", ""),
        "ai": _default_ai(category, text),
        "isFakeNews": False,
    }


def normalize_news(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize an RSS news item."""
    text = raw.get("title", "") + ". " + raw.get("summary", "")
    source = raw.get("source", "News")

    category = _detect_category(text)

    return {
        "id": f"news-{uuid.uuid4().hex[:12]}",
        "platform": "news",
        "authorName": source,
        "authorUsername": raw.get("author", ""),
        "authorAvatar": "".join(w[0] for w in source.split()[:2]).upper(),
        "isVerified": True,
        "timestamp": _parse_timestamp(raw, "news"),
        "text": text[:500],
        "hashtags": _extract_hashtags(text),
        "mentions": _extract_mentions(text),
        "geoLocation": {
            "lat": 13.12,
            "lng": 80.28,
            "ward": "Unknown",
            "village": "Chennai",
        },
        "category": category,
        "severity": _detect_severity(text),
        "sentiment": _detect_sentiment(text),
        "likes": 0,
        "comments": 0,
        "shares": 0,
        "views": 0,
        "media": _extract_media(raw, "news", category),
        "originalUrl": raw.get("link", ""),
        "ai": _default_ai(category, text),
        "isFakeNews": False,
    }


def _default_ai(category: str, text: str) -> Dict[str, Any]:
    """Generate a default AI analysis block."""
    severity = _detect_severity(text)
    confidence = 75 if len(text) > 50 else 50

    departments = {
        "Roads": "Roads & Infrastructure",
        "Water Supply": "Water Supply Department",
        "Drainage": "Sanitation Department",
        "Electricity": "Electricity Board",
        "Garbage": "Solid Waste Management",
        "Healthcare": "Health Department",
        "Public Safety": "Public Safety Department",
        "Education": "Education Department",
        "Housing": "Housing Department",
        "Agriculture": "Agriculture Department",
        "Environment": "Environment Department",
        "Sanitation": "Sanitation Department",
    }

    return {
        "category": category,
        "severity": severity,
        "confidence": confidence,
        "duplicateScore": 0,
        "fakeNewsProbability": 0,
        "department": departments.get(category, "General"),
        "priorityScore": {"Critical": 90, "High": 70, "Medium": 50, "Low": 30}.get(severity, 50),
        "urgencyScore": {"Critical": 90, "High": 70, "Medium": 50, "Low": 30}.get(severity, 50),
        "suggestedAction": f"Investigate {category.lower()} issue and deploy response team",
        "estimatedImpact": f"Community impact in area",
        "estimatedAffected": 1000,
        "aiSummary": f"Auto-classified {category.lower()} post. Severity: {severity}.",
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

_NORMALIZERS = {
    "twitter": normalize_twitter,
    "instagram": normalize_instagram,
    "facebook": normalize_facebook,
    "youtube": normalize_youtube,
    "news": normalize_news,
}


def normalize_all(raw_data: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """
    Normalize raw data from all platforms into a unified post list.
    Returns sorted by timestamp (newest first).
    """
    all_posts = []
    for platform, items in raw_data.items():
        normalizer = _NORMALIZERS.get(platform)
        if not normalizer:
            continue
        for item in items:
            try:
                post = normalizer(item)
                all_posts.append(post)
            except Exception:
                continue

    all_posts.sort(key=lambda p: p.get("timestamp", ""), reverse=True)
    return all_posts

"""
Apify API client for social media scraping.

Wraps Apify actor runs for Twitter/X, Instagram, Facebook, YouTube.
Falls back gracefully when APIFY_TOKEN is not set or actors fail.
FREE plan limitations: Twitter may return empty, YouTube may fail.
Instagram and RSS feeds work reliably.
"""

import asyncio
import logging
from typing import Any, Dict, List, Optional

import httpx

from app.core.config import settings

logger = logging.getLogger("social.apify")

APIFY_BASE = "https://api.apify.com/v2"


def _token() -> Optional[str]:
    return settings.APIFY_TOKEN


def _headers() -> Dict[str, str]:
    token = _token()
    if not token:
        return {}
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------------------
# Generic actor runner
# ---------------------------------------------------------------------------

async def run_actor(
    actor_id: str,
    input_data: Dict[str, Any],
    timeout_secs: int = 120,
) -> List[Dict[str, Any]]:
    """
    Trigger an Apify actor run and return its dataset items.

    Returns empty list on any failure — never raises.
    """
    token = _token()
    if not token:
        logger.warning("APIFY_TOKEN not set — skipping actor %s", actor_id)
        return []

    url = f"{APIFY_BASE}/acts/{actor_id}/runs"
    try:
        async with httpx.AsyncClient(timeout=settings.APIFY_REQUEST_TIMEOUT) as client:
            resp = await client.post(url, json=input_data, headers=_headers())
            resp.raise_for_status()
            run_data = resp.json().get("data", {})
            run_id = run_data.get("id")
            if not run_id:
                logger.error("No run_id returned from %s", actor_id)
                return []

            # Poll until terminal
            status_url = f"{APIFY_BASE}/actor-runs/{run_id}"
            deadline = asyncio.get_event_loop().time() + timeout_secs
            while asyncio.get_event_loop().time() < deadline:
                await asyncio.sleep(3)
                poll = await client.get(status_url, headers=_headers())
                poll.raise_for_status()
                state = poll.json().get("data", {}).get("status")
                if state in ("SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"):
                    if state != "SUCCEEDED":
                        logger.warning("Actor run %s ended with status %s", run_id, state)
                        return []
                    break
            else:
                logger.warning("Actor run %s timed out after %ds", run_id, timeout_secs)
                return []

            dataset_id = poll.json().get("data", {}).get("defaultDatasetId")
            if not dataset_id:
                return []
            items_resp = await client.get(
                f"{APIFY_BASE}/datasets/{dataset_id}/items",
                headers=_headers(),
            )
            items_resp.raise_for_status()
            items = items_resp.json()
            # Filter out empty/error items
            return [i for i in items if i and not i.get("error") and not i.get("noResults")]

    except httpx.HTTPError as exc:
        logger.error("Apify HTTP error for %s: %s", actor_id, exc)
        return []
    except Exception as exc:
        logger.error("Unexpected error running %s: %s", actor_id, exc)
        return []


# ---------------------------------------------------------------------------
# Platform-specific fetchers (correct input formats)
# ---------------------------------------------------------------------------

async def fetch_twitter(query: str, count: int = 50) -> List[Dict[str, Any]]:
    """Fetch recent tweets. Note: may return empty on FREE plan."""
    return await run_actor(
        "apidojo~tweet-scraper",
        {
            "searchTerms": [query],
            "maxTweets": count,
            "sort": "Latest",
            "tweetLanguage": "en",
        },
    )


async def fetch_instagram(hashtag: str, count: int = 50) -> List[Dict[str, Any]]:
    """Fetch recent Instagram posts by hashtag. Works on FREE plan."""
    tag = hashtag.lstrip("#")
    return await run_actor(
        "apify~instagram-scraper",
        {
            "directUrls": [f"https://www.instagram.com/explore/tags/{tag}/"],
            "resultsType": "posts",
            "resultsLimit": count,
        },
    )


async def fetch_facebook(group_url: str, count: int = 50) -> List[Dict[str, Any]]:
    """Fetch recent Facebook group posts."""
    return await run_actor(
        "apify~facebook-posts-scraper",
        {
            "startUrls": [{"url": group_url}],
            "maxPosts": count,
        },
    )


async def fetch_youtube(query: str, count: int = 20) -> List[Dict[str, Any]]:
    """Fetch recent YouTube videos. Note: may fail on FREE plan."""
    return await run_actor(
        "streamers~youtube-scraper",
        {
            "searchTerms": [query],
            "maxResults": count,
        },
    )


async def fetch_news_rss(feed_url: str, max_items: int = 30) -> List[Dict[str, Any]]:
    """Fetch and parse an RSS feed. No Apify needed — uses feedparser."""
    import feedparser

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(feed_url)
            resp.raise_for_status()
        feed = feedparser.parse(resp.text)
        items = []
        for entry in feed.entries[:max_items]:
            items.append({
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "summary": entry.get("summary", ""),
                "published": entry.get("published", ""),
                "author": entry.get("author", ""),
                "source": feed.feed.get("title", ""),
                "image": (
                    entry.get("media_content", [{}])[0].get("url")
                    or entry.get("media_thumbnail", [{}])[0].get("url")
                    or ""
                ),
            })
        return items
    except Exception as exc:
        logger.error("RSS fetch failed for %s: %s", feed_url, exc)
        return []


# ---------------------------------------------------------------------------
# Batch fetcher
# ---------------------------------------------------------------------------

NEWS_FEEDS = [
    "https://feeds.feedburner.com/ndtvnews-latest",
    "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    "https://www.thehindu.com/feeder/default.rss",
]

DEFAULT_QUERIES = [
    "Chennai water crisis",
    "Chennai road damage pothole",
    "Chennai drainage flooding",
    "Chennai power outage electricity",
    "Chennai garbage sanitation",
    "Chennai hospital healthcare",
    "North Chennai complaint",
]


async def fetch_all_platforms(
    queries: Optional[List[str]] = None,
    count_per_platform: int = 30,
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Fetch from all platforms concurrently.
    Returns dict with keys: twitter, instagram, facebook, youtube, news.
    """
    q = queries or DEFAULT_QUERIES
    primary_query = q[0] if q else "Chennai"

    results = await asyncio.gather(
        fetch_twitter(primary_query, count_per_platform),
        fetch_instagram(primary_query, count_per_platform),
        fetch_facebook("https://www.facebook.com/ndtv", count_per_platform),
        fetch_youtube(primary_query, count_per_platform),
        asyncio.gather(*[fetch_news_rss(url) for url in NEWS_FEEDS]),
        return_exceptions=True,
    )

    def safe_list(val: Any) -> List[Dict]:
        if isinstance(val, Exception):
            logger.error("Platform fetch failed: %s", val)
            return []
        if isinstance(val, list):
            return val
        if isinstance(val, tuple):
            flat = []
            for item in val:
                if isinstance(item, list):
                    flat.extend(item)
            return flat
        return []

    return {
        "twitter": safe_list(results[0]),
        "instagram": safe_list(results[1]),
        "facebook": safe_list(results[2]),
        "youtube": safe_list(results[3]),
        "news": safe_list(results[4]),
    }

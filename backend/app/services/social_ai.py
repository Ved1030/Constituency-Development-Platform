"""
Social media AI analysis — category classification, severity scoring,
sentiment analysis, duplicate detection, department routing.
"""

import logging
import re
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger("social.ai")

# ---------------------------------------------------------------------------
# Keyword-based category classifier (fast, no external API needed)
# ---------------------------------------------------------------------------

_CATEGORY_KEYWORDS: Dict[str, List[str]] = {
    "Water Supply": ["water", "pipeline", "borewell", "tanker", "supply", "drought", "groundwater", "hydrant"],
    "Roads": ["road", "pothole", "traffic", "bridge", "pavement", "footpath", "metro", "concrete"],
    "Drainage": ["drain", "sewage", "flood", "waterlogging", "overflow", "stormwater", "manhole"],
    "Electricity": ["power", "electricity", "blackout", "transformer", "outage", "energy", "wire", "eb "],
    "Garbage": ["garbage", "waste", "trash", "dump", "plastic", "litter", "collection"],
    "Healthcare": ["hospital", "doctor", "patient", "medical", "phc", "clinic", "health", "ambulance"],
    "Public Safety": ["accident", "safety", "crime", "fire", "police", "protest", "streetlight", "dark"],
    "Education": ["school", "college", "student", "teacher", "education", "anganwadi", "classroom"],
    "Housing": ["house", "housing", "flat", "apartment", "slum", "eviction", "shelter", "roof"],
    "Agriculture": ["farm", "crop", "agriculture", "irrigation", "farmer", "harvest", "lake"],
    "Environment": ["environment", "pollution", "mangrove", "coast", "fishing", "air quality", "tree"],
    "Sanitation": ["sanitation", "toilet", "hygiene", "clean", "sewage treatment", "open drain"],
}

_SEVERITY_KEYWORDS: Dict[str, List[str]] = {
    "Critical": ["urgent", "emergency", "death", "collapsed", "protest", "blocked", "blast", "fire", "accident"],
    "High": ["severe", "critical", "dangerous", "overflow", "shortage", "crisis", "hazard"],
    "Medium": ["damaged", "broken", "needed", "required", "complaint", "issue"],
    "Low": ["update", "progress", "improvement", "completed", "resolved", "good"],
}

_SENTIMENT_WORDS = {
    "positive": ["good", "great", "thank", "appreciate", "improvement", "progress", "resolved", "help", "happy"],
    "negative": ["bad", "terrible", "worst", "danger", "crisis", "broken", "failed", "protest", "death", "sick"],
}

_DEPARTMENTS = {
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


def classify_category(text: str) -> str:
    lower = text.lower()
    scores = {}
    for cat, keywords in _CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in lower)
        if score:
            scores[cat] = score
    return max(scores, key=scores.get) if scores else "Roads"


def classify_severity(text: str) -> str:
    lower = text.lower()
    for level in ["Critical", "High", "Medium", "Low"]:
        if any(kw in lower for kw in _SEVERITY_KEYWORDS[level]):
            return level
    return "Medium"


def classify_sentiment(text: str) -> str:
    lower = text.lower()
    pos = sum(1 for w in _SENTIMENT_WORDS["positive"] if w in lower)
    neg = sum(1 for w in _SENTIMENT_WORDS["negative"] if w in lower)
    if pos > neg:
        return "positive"
    if neg > pos:
        return "negative"
    return "neutral"


def extract_department(category: str) -> str:
    return _DEPARTMENTS.get(category, "General")


def compute_priority_score(severity: str, engagement_total: int) -> int:
    base = {"Critical": 80, "High": 60, "Medium": 40, "Low": 20}.get(severity, 40)
    engagement_bonus = min(20, engagement_total // 5000)
    return min(100, base + engagement_bonus)


# ---------------------------------------------------------------------------
# Duplicate complaint clustering
# ---------------------------------------------------------------------------

def _text_signature(text: str) -> str:
    """Normalized text for similarity comparison."""
    text = re.sub(r"https?://\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#\w+", "", text)
    text = re.sub(r"\s+", " ", text).strip().lower()
    # Keep only significant words (len > 3)
    words = [w for w in text.split() if len(w) > 3]
    return " ".join(sorted(set(words)))


def _signature_words(sig: str) -> set:
    return set(sig.split())


def detect_duplicates(posts: List[Dict[str, Any]], radius_meters: float = 25.0) -> Dict[str, int]:
    """
    Cluster posts by text similarity + geo proximity.
    Returns dict mapping post_id -> cluster_id.
    """
    sigs = {}
    for p in posts:
        sigs[p["id"]] = _text_signature(p.get("text", ""))

    clusters: List[Dict[str, Any]] = []
    post_cluster = {}

    for post in posts:
        pid = post["id"]
        sig_words = _signature_words(sigs[pid])
        geo = post.get("geoLocation", {})
        lat = geo.get("lat", 0)
        lng = geo.get("lng", 0)

        matched_cluster = None
        for ci, cluster in enumerate(clusters):
            # Check text similarity
            overlap = len(sig_words & cluster["words"])
            total = max(len(sig_words | cluster["words"]), 1)
            similarity = overlap / total

            # Check geo proximity
            dlat = abs(lat - cluster["lat"])
            dlng = abs(lng - cluster["lng"])
            geo_close = (dlat < 0.001 and dlng < 0.001)  # ~100m

            if similarity > 0.4 or (similarity > 0.2 and geo_close):
                matched_cluster = ci
                break

        if matched_cluster is not None:
            post_cluster[pid] = matched_cluster
            clusters[matched_cluster]["words"] |= sig_words
            clusters[matched_cluster]["count"] += 1
        else:
            new_id = len(clusters)
            post_cluster[pid] = new_id
            clusters.append({
                "words": sig_words,
                "lat": lat,
                "lng": lng,
                "count": 1,
            })

    return post_cluster


def enrich_with_ai(posts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Run AI analysis on all posts: classify, score, detect duplicates.
    Modifies posts in-place and returns them.
    """
    if not posts:
        return posts

    # Classify each post
    for post in posts:
        text = post.get("text", "")
        category = post.get("category") or classify_category(text)
        severity = post.get("severity") or classify_severity(text)
        sentiment = post.get("sentiment") or classify_sentiment(text)
        total_engagement = post.get("likes", 0) + post.get("comments", 0) + post.get("shares", 0)

        post["category"] = category
        post["severity"] = severity
        post["sentiment"] = sentiment

        ai = post.get("ai", {})
        ai["category"] = category
        ai["severity"] = severity
        ai["department"] = extract_department(category)
        ai["priorityScore"] = compute_priority_score(severity, total_engagement)
        ai["urgencyScore"] = {"Critical": 90, "High": 70, "Medium": 50, "Low": 30}.get(severity, 50)
        ai["confidence"] = min(99, 60 + len(text) // 10)
        post["ai"] = ai

    # Duplicate detection
    clusters = detect_duplicates(posts)
    cluster_sizes = defaultdict(int)
    for cid in clusters.values():
        cluster_sizes[cid] += 1

    for post in posts:
        cid = clusters.get(post["id"], -1)
        post["ai"]["duplicateScore"] = round(
            (cluster_sizes.get(cid, 1) - 1) / max(len(posts), 1) * 100, 1
        )

    return posts

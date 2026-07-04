"""
AI Geo Engine – intelligence layer for geo-verified complaints.

Functions:
- validate_location()        : Validate GPS data quality and accuracy
- detect_constituency()      : Map coordinates to assembly/lok sabha constituencies
- calculate_evidence_score() : Score complaint evidence 0-100
- find_duplicate_radius()    : Find similar complaints within radius
- detect_department()        : AI-powered department/sector detection
- generate_geo_summary()     : Generate human-readable geo summary
- generate_issue_cluster_uid(): Create unique cluster identifiers
- calculate_priority()       : AI priority prediction
- estimate_resolution()      : Estimated resolution time
"""

import json
import logging
import math
import re
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

from app.core.config import settings
from app.core.logger import log_ai_step

logger = logging.getLogger("app.ai.geo_engine")


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
EARTH_RADIUS_M = 6_371_000

# Department mapping based on category keywords
DEPARTMENT_MAP: Dict[str, Dict[str, Any]] = {
    "road": {
        "department": "Corporation Roads Division",
        "sector": "Infrastructure",
        "keywords": ["pothole", "road", "street", "highway", "pavement", "asphalt", "traffic"],
        "estimated_days": 14,
    },
    "water": {
        "department": "Metro Water Board",
        "sector": "Water & Sanitation",
        "keywords": ["water", "drainage", "pipe", "leak", "flood", "sewer", "drain"],
        "estimated_days": 10,
    },
    "electricity": {
        "department": "Electricity Board",
        "sector": "Power & Energy",
        "keywords": ["light", "power", "electric", "transformer", "wire", "voltage", "street light"],
        "estimated_days": 7,
    },
    "healthcare": {
        "department": "Health Department",
        "sector": "Healthcare",
        "keywords": ["hospital", "medicine", "doctor", "health", "clinic", "ambulance", "pharmacy"],
        "estimated_days": 21,
    },
    "education": {
        "department": "Education Department",
        "sector": "Education",
        "keywords": ["school", "college", "teacher", "education", "student", "library"],
        "estimated_days": 30,
    },
    "sanitation": {
        "department": "Corporation Sanitation Wing",
        "sector": "Sanitation & Hygiene",
        "keywords": ["garbage", "waste", "sewage", "toilet", "clean", "dustbin", "mosquito"],
        "estimated_days": 7,
    },
    "other": {
        "department": "General Administration",
        "sector": "General",
        "keywords": [],
        "estimated_days": 14,
    },
}


# ---------------------------------------------------------------------------
# GPS Validation
# ---------------------------------------------------------------------------
def validate_location(
    latitude: float,
    longitude: float,
    accuracy: Optional[float] = None,
    altitude: Optional[float] = None,
    speed: Optional[float] = None,
    heading: Optional[float] = None,
) -> Dict[str, Any]:
    """
    Validate GPS coordinates and metadata.

    Returns a dict with:
    - is_valid: bool
    - quality: "high" | "medium" | "low" | "invalid"
    - warnings: list of warning messages
    - score: 0-100 quality score
    """
    log_ai_step("validate_location", lat=latitude, lng=longitude, accuracy=accuracy)

    warnings: List[str] = []
    score = 0

    # Basic coordinate bounds check (rough India bounds)
    if not (5.0 <= latitude <= 37.0 and 68.0 <= longitude <= 97.5):
        return {
            "is_valid": False,
            "quality": "invalid",
            "warnings": ["Coordinates outside India bounds"],
            "score": 0,
        }

    # Accuracy assessment
    if accuracy is not None:
        if accuracy <= 10:
            score += 40
        elif accuracy <= 30:
            score += 30
        elif accuracy <= 50:
            score += 20
            warnings.append("GPS accuracy is moderate (>30m)")
        elif accuracy <= 100:
            score += 10
            warnings.append("GPS accuracy is low (>50m)")
        else:
            warnings.append(f"GPS accuracy is very low ({accuracy}m)")
    else:
        score += 15  # No accuracy data – give partial credit
        warnings.append("GPS accuracy not available")

    # Coordinate precision (more decimal places = more precise)
    lat_decimals = len(str(latitude).split(".")[-1]) if "." in str(latitude) else 0
    lng_decimals = len(str(longitude).split(".")[-1]) if "." in str(longitude) else 0
    avg_decimals = (lat_decimals + lng_decimals) / 2
    if avg_decimals >= 4:
        score += 25
    elif avg_decimals >= 3:
        score += 15
    else:
        score += 5
        warnings.append("Low coordinate precision")

    # Altitude (bonus)
    if altitude is not None:
        score += 10

    # Speed (bonus – if 0, means stationary = intentional reporting)
    if speed is not None:
        if speed < 1:
            score += 10  # Stationary – good signal
        elif speed < 5:
            score += 5
        else:
            warnings.append("High speed detected – may indicate transit")

    # Heading (bonus)
    if heading is not None:
        score += 5

    # Overall quality
    score = min(100, max(0, score))
    if score >= 70:
        quality = "high"
    elif score >= 45:
        quality = "medium"
    elif score >= 20:
        quality = "low"
    else:
        quality = "invalid"

    is_valid = quality != "invalid"

    log_ai_step(
        "validate_location_result",
        quality=quality,
        score=score,
        warnings_count=len(warnings),
    )

    return {
        "is_valid": is_valid,
        "quality": quality,
        "warnings": warnings,
        "score": score,
    }


# ---------------------------------------------------------------------------
# Constituency Detection
# ---------------------------------------------------------------------------
def detect_constituency(
    latitude: float,
    longitude: float,
    village: Optional[str] = None,
    ward: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Detect assembly and lok sabha constituencies from coordinates.

    Uses heuristic mapping based on known constituency boundaries.
    In production, this would call a GIS database or government API.
    """
    log_ai_step("detect_constituency", lat=latitude, lng=longitude)

    # Heuristic constituency detection based on coordinate ranges
    # These are approximate and should be replaced with a real GIS lookup
    assembly = "Unknown Assembly Constituency"
    lok_sabha = "Unknown Lok Sabha Constituency"

    # Tamil Nadu region (Chennai area) – common for this platform
    if 12.8 <= latitude <= 13.2 and 80.0 <= longitude <= 80.5:
        if ward:
            ward_num = re.search(r"\d+", str(ward))
            if ward_num:
                num = int(ward_num.group())
                if num <= 5:
                    assembly = "T. Nagar Assembly Constituency"
                elif num <= 10:
                    assembly = "Anna Nagar Assembly Constituency"
                else:
                    assembly = "Virugambakkam Assembly Constituency"
            else:
                assembly = "Chennai Central Assembly Constituency"
        else:
            assembly = "Chennai Central Assembly Constituency"
        lok_sabha = "Chennai South Lok Sabha Constituency"
    # Karnataka region
    elif 12.5 <= latitude <= 13.5 and 76.0 <= longitude <= 78.0:
        assembly = "Bangalore Central Assembly Constituency"
        lok_sabha = "Bangalore Central Lok Sabha Constituency"
    # Maharashtra region
    elif 18.5 <= latitude <= 19.5 and 72.5 <= longitude <= 73.5:
        assembly = "Mumbai Assembly Constituency"
        lok_sabha = "Mumbai South Lok Sabha Constituency"
    # Delhi region
    elif 28.0 <= latitude <= 29.0 and 76.5 <= longitude <= 77.5:
        assembly = "New Delhi Assembly Constituency"
        lok_sabha = "New Delhi Lok Sabha Constituency"
    # UP region
    elif 25.0 <= latitude <= 27.0 and 80.0 <= longitude <= 82.0:
        assembly = "Lucknow Central Assembly Constituency"
        lok_sabha = "Lucknow Lok Sabha Constituency"
    else:
        assembly = f"Assembly Constituency (Region {latitude:.1f}, {longitude:.1f})"
        lok_sabha = f"Lok Sabha Constituency (Region {latitude:.1f}, {longitude:.1f})"

    log_ai_step(
        "detect_constituency_result",
        assembly=assembly,
        lok_sabha=lok_sabha,
    )

    return {
        "assembly_constituency": assembly,
        "lok_sabha_constituency": lok_sabha,
    }


# ---------------------------------------------------------------------------
# Haversine Distance
# ---------------------------------------------------------------------------
def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance in meters between two GPS points using Haversine formula."""
    lat1_r = math.radians(lat1)
    lat2_r = math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_r) * math.cos(lat2_r) * math.sin(dlng / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return EARTH_RADIUS_M * c


# ---------------------------------------------------------------------------
# Evidence Score Calculation
# ---------------------------------------------------------------------------
def calculate_evidence_score(
    has_gps: bool = False,
    has_photos: bool = False,
    has_voice: bool = False,
    has_image_metadata: bool = False,
    has_multiple_reports: bool = False,
    has_duplicate_match: bool = False,
    gps_accuracy: Optional[float] = None,
    gps_quality: Optional[str] = None,
    has_timestamp: bool = False,
    ai_confidence: float = 0.0,
    description_length: int = 0,
) -> Dict[str, Any]:
    """
    Calculate evidence score (0-100) based on multiple verification factors.

    Factors and weights:
    - GPS present: 15
    - Photo present: 15
    - Voice present: 10
    - Image metadata: 5
    - Multiple reports nearby: 10
    - Duplicate radius match: 10
    - Location accuracy: 15
    - Timestamp: 5
    - AI confidence: 15
    """
    log_ai_step(
        "calculate_evidence_score",
        gps=has_gps,
        photos=has_photos,
        voice=has_voice,
    )

    weights = settings.EVIDENCE_WEIGHTS
    breakdown: Dict[str, float] = {}

    # GPS present
    gps_score = weights["gps_present"] if has_gps else 0
    breakdown["gps_present"] = gps_score

    # Photo present
    photo_score = weights["photo_present"] if has_photos else 0
    breakdown["photo_present"] = photo_score

    # Voice present
    voice_score = weights["voice_present"] if has_voice else 0
    breakdown["voice_present"] = voice_score

    # Image metadata validation
    meta_score = weights["image_metadata"] if has_image_metadata else 0
    breakdown["image_metadata"] = meta_score

    # Multiple reports nearby
    multi_score = weights["multiple_reports"] if has_multiple_reports else 0
    breakdown["multiple_reports"] = multi_score

    # Duplicate radius match
    dup_score = weights["duplicate_radius"] if has_duplicate_match else 0
    breakdown["duplicate_radius"] = dup_score

    # Location accuracy
    accuracy_score = 0.0
    if gps_accuracy is not None:
        if gps_accuracy <= 10:
            accuracy_score = weights["location_accuracy"]
        elif gps_accuracy <= 30:
            accuracy_score = weights["location_accuracy"] * 0.8
        elif gps_accuracy <= 50:
            accuracy_score = weights["location_accuracy"] * 0.5
        elif gps_accuracy <= 100:
            accuracy_score = weights["location_accuracy"] * 0.3
        else:
            accuracy_score = weights["location_accuracy"] * 0.1
    elif gps_quality == "high":
        accuracy_score = weights["location_accuracy"] * 0.7
    elif gps_quality == "medium":
        accuracy_score = weights["location_accuracy"] * 0.4
    breakdown["location_accuracy"] = accuracy_score

    # Timestamp
    ts_score = weights["timestamp"] if has_timestamp else 0
    breakdown["timestamp"] = ts_score

    # AI confidence
    ai_score = weights["ai_confidence"] * min(1.0, max(0.0, ai_confidence))
    breakdown["ai_confidence"] = ai_score

    # Description length bonus (max 3 extra points)
    if description_length > 50:
        desc_bonus = min(3.0, description_length / 100)
    else:
        desc_bonus = 0.0
    breakdown["description_length"] = desc_bonus

    total = sum(breakdown.values())
    total = min(100, max(0, total))

    # Determine verification status
    if total >= 80:
        verification_status = "verified"
    elif total >= 50:
        verification_status = "partially_verified"
    elif total >= 25:
        verification_status = "unverified"
    else:
        verification_status = "insufficient_evidence"

    log_ai_step(
        "calculate_evidence_score_result",
        score=round(total, 1),
        status=verification_status,
    )

    return {
        "total": round(total, 1),
        "verification_status": verification_status,
        "breakdown": breakdown,
        "gps_present": has_gps,
        "photo_present": has_photos,
        "voice_present": has_voice,
        "image_metadata_valid": has_image_metadata,
        "multiple_reports_nearby": has_multiple_reports,
        "duplicate_radius_match": has_duplicate_match,
        "location_accuracy_score": accuracy_score,
        "timestamp_valid": has_timestamp,
        "ai_confidence_score": ai_score,
    }


# ---------------------------------------------------------------------------
# Duplicate Detection
# ---------------------------------------------------------------------------
def find_duplicate_radius(
    latitude: float,
    longitude: float,
    category: str,
    existing_complaints: List[Dict[str, Any]],
    radius_meters: float = 25.0,
) -> Dict[str, Any]:
    """
    Find similar complaints within a geographic radius.

    Returns duplicate check result with nearest distance and count.
    """
    log_ai_step(
        "find_duplicate_radius",
        lat=latitude,
        lng=longitude,
        category=category,
        radius=radius_meters,
        existing_count=len(existing_complaints),
    )

    nearby: List[Tuple[Dict[str, Any], float]] = []

    for complaint in existing_complaints:
        comp_lat = complaint.get("gps_latitude")
        comp_lng = complaint.get("gps_longitude")
        comp_category = complaint.get("category", "")

        if comp_lat is None or comp_lng is None:
            continue

        # Check if same category
        if comp_category.lower() != category.lower():
            continue

        distance = haversine_distance(latitude, longitude, comp_lat, comp_lng)

        if distance <= radius_meters:
            nearby.append((complaint, distance))

    if not nearby:
        return {
            "is_duplicate": False,
            "existing_report_count": 0,
            "nearest_distance_meters": None,
        }

    # Sort by distance
    nearby.sort(key=lambda x: x[1])
    nearest = nearby[0]

    return {
        "is_duplicate": True,
        "existing_report_count": len(nearby),
        "nearest_distance_meters": round(nearest[1], 1),
        "nearest_complaint_id": nearest[0].get("complaint_uid"),
    }


# ---------------------------------------------------------------------------
# Department Detection
# ---------------------------------------------------------------------------
def detect_department(
    category: str,
    title: str = "",
    description: str = "",
) -> Dict[str, Any]:
    """
    Detect department, sector, and estimated resolution time
    based on category and text content analysis.
    """
    log_ai_step("detect_department", category=category)

    category_lower = category.lower().strip()

    # Direct category match
    if category_lower in DEPARTMENT_MAP:
        result = DEPARTMENT_MAP[category_lower]
        return {
            "department": result["department"],
            "sector": result["sector"],
            "estimated_days": result["estimated_days"],
            "confidence": 0.9,
        }

    # Keyword-based fallback
    text = f"{title} {description}".lower()
    best_match = None
    best_score = 0

    for cat_key, cat_info in DEPARTMENT_MAP.items():
        score = sum(1 for kw in cat_info["keywords"] if kw in text)
        if score > best_score:
            best_score = score
            best_match = cat_info

    if best_match and best_score > 0:
        return {
            "department": best_match["department"],
            "sector": best_match["sector"],
            "estimated_days": best_match["estimated_days"],
            "confidence": min(0.8, 0.3 + best_score * 0.1),
        }

    return {
        "department": "General Administration",
        "sector": "General",
        "estimated_days": 14,
        "confidence": 0.3,
    }


# ---------------------------------------------------------------------------
# Priority Prediction
# ---------------------------------------------------------------------------
def calculate_priority(
    category: str,
    severity: str,
    evidence_score: float,
    duplicate_count: int,
    description: str = "",
) -> Dict[str, Any]:
    """
    Calculate priority score (0-100) and prediction.

    Higher priority = needs faster attention.
    """
    log_ai_step(
        "calculate_priority",
        category=category,
        severity=severity,
        evidence_score=evidence_score,
        duplicate_count=duplicate_count,
    )

    base = 30.0

    # Severity multiplier
    severity_map = {"low": 0.5, "medium": 1.0, "high": 1.5, "critical": 2.0}
    base *= severity_map.get(severity.lower(), 1.0)

    # Category urgency
    category_urgency = {
        "healthcare": 1.3,
        "electricity": 1.2,
        "water": 1.15,
        "sanitation": 1.1,
        "road": 1.0,
        "education": 0.9,
        "other": 0.8,
    }
    base *= category_urgency.get(category.lower(), 1.0)

    # Evidence score contribution
    base += evidence_score * 0.2

    # Duplicate count – more reports = higher priority
    if duplicate_count >= 5:
        base *= 1.4
    elif duplicate_count >= 3:
        base *= 1.2
    elif duplicate_count >= 1:
        base *= 1.1

    # Keyword urgency
    urgent_keywords = ["accident", "death", "fire", "collapse", "flood", "emergency", "dengue", "cholera"]
    text_lower = description.lower()
    for kw in urgent_keywords:
        if kw in text_lower:
            base *= 1.3
            break

    priority = min(100, max(0, round(base, 1)))

    if priority >= 75:
        prediction = "critical"
    elif priority >= 50:
        prediction = "high"
    elif priority >= 25:
        prediction = "medium"
    else:
        prediction = "low"

    log_ai_step(
        "calculate_priority_result",
        priority=priority,
        prediction=prediction,
    )

    return {
        "priority_score": priority,
        "priority_prediction": prediction,
    }


# ---------------------------------------------------------------------------
# Resolution Time Estimation
# ---------------------------------------------------------------------------
def estimate_resolution(
    department: str,
    priority: float,
    evidence_score: float,
    duplicate_count: int,
) -> int:
    """Estimate resolution time in days based on department and priority."""
    log_ai_step("estimate_resolution", department=department, priority=priority)

    base_days = 14

    dept_days = {
        "Corporation Roads Division": 14,
        "Metro Water Board": 10,
        "Electricity Board": 7,
        "Health Department": 21,
        "Education Department": 30,
        "Corporation Sanitation Wing": 7,
        "General Administration": 14,
    }

    base_days = dept_days.get(department, 14)

    # High priority = faster resolution
    if priority >= 75:
        base_days = int(base_days * 0.5)
    elif priority >= 50:
        base_days = int(base_days * 0.7)
    elif priority >= 25:
        base_days = int(base_days * 0.9)

    # Good evidence = faster routing
    if evidence_score >= 80:
        base_days = max(1, base_days - 2)

    # More reports = higher urgency
    if duplicate_count >= 5:
        base_days = max(1, base_days - 3)
    elif duplicate_count >= 3:
        base_days = max(1, base_days - 1)

    log_ai_step("estimate_resolution_result", days=base_days)

    return max(1, base_days)


# ---------------------------------------------------------------------------
# Geo Summary Generation
# ---------------------------------------------------------------------------
def generate_geo_summary(
    latitude: float,
    longitude: float,
    accuracy: Optional[float],
    village: Optional[str],
    ward: Optional[str],
    district: Optional[str],
    state: Optional[str],
    assembly: Optional[str],
    lok_sabha: Optional[str],
) -> str:
    """Generate a human-readable geo summary of the complaint location."""
    parts = []

    if village:
        parts.append(village)
    if ward:
        parts.append(f"Ward {ward}" if not ward.lower().startswith("ward") else ward)
    if district:
        parts.append(district)
    if state:
        parts.append(state)

    location_str = ", ".join(parts) if parts else f"Location ({latitude:.6f}, {longitude:.6f})"

    summary_parts = [f"Location: {location_str}"]
    if assembly:
        summary_parts.append(f"Assembly: {assembly}")
    if lok_sabha:
        summary_parts.append(f"Lok Sabha: {lok_sabha}")
    if accuracy:
        summary_parts.append(f"GPS Accuracy: {accuracy:.1f}m")

    return " | ".join(summary_parts)


# ---------------------------------------------------------------------------
# Issue Cluster UID Generator
# ---------------------------------------------------------------------------
def generate_issue_cluster_uid(
    category: str,
    latitude: float,
    longitude: float,
) -> str:
    """
    Generate a unique cluster identifier.
    Format: CLT-{CATEGORY_SHORT}-{LAT4}-{LNG4}-{HASH}
    """
    cat_short = category[:3].upper()
    lat4 = f"{abs(latitude):.4f}".replace(".", "")
    lng4 = f"{abs(longitude):.4f}".replace(".", "")
    import hashlib
    hash_input = f"{category}{latitude}{longitude}"
    hash_val = hashlib.md5(hash_input.encode()).hexdigest()[:4].upper()
    return f"CLT-{cat_short}-{lat4[:5]}-{lng4[:5]}-{hash_val}"


# ---------------------------------------------------------------------------
# Complaint UID Generator
# ---------------------------------------------------------------------------
def generate_complaint_uid() -> str:
    """Generate a unique complaint identifier. Format: CMP-YYYY-NNNN."""
    year = datetime.utcnow().year
    import random
    num = random.randint(1000, 9999)
    return f"CMP-{year}-{num}"

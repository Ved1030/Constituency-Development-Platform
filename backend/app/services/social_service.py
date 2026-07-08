"""
Social Media Aggregation Service

All media served through backend. Frontend NEVER uses remote URLs.
Every post always has at least one working image.
"""

import json
import os
import random
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_MEDIA = Path(__file__).resolve().parent.parent.parent / "media"
SOCIAL_DIR = BASE_MEDIA / "social"
DEMO_DIR = BASE_MEDIA / "demo"

SOCIAL_DIR.mkdir(parents=True, exist_ok=True)
DEMO_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Category-to-demo-image mapping
# ---------------------------------------------------------------------------
CATEGORY_DEMO_MAP = {
    "Roads": "road.jpg",
    "Water Supply": "water.jpg",
    "Drainage": "drainage.jpg",
    "Electricity": "electricity.jpg",
    "Garbage": "garbage.jpg",
    "Healthcare": "hospital.jpg",
    "Public Safety": "streetlight.jpg",
    "Education": "school.jpg",
    "Housing": "construction.jpg",
    "Agriculture": "park.jpg",
    "Environment": "park.jpg",
    "Sanitation": "flooding.jpg",
}

# All demo image types we create
DEMO_TYPES = [
    "road", "water", "drainage", "electricity", "garbage",
    "hospital", "streetlight", "school", "construction", "park",
    "flooding", "traffic",
]

# ---------------------------------------------------------------------------
# Realistic color palettes per category (for SVG generation)
# ---------------------------------------------------------------------------
CATEGORY_PALETTES = {
    "Roads":         {"bg": "#4a5568", "accent": "#e53e3e", "icon": "road",     "label": "Road Damage Report"},
    "Water Supply":  {"bg": "#2b6cb0", "accent": "#63b3ed", "icon": "water",    "label": "Water Crisis Alert"},
    "Drainage":      {"bg": "#2d3748", "accent": "#ed8936", "icon": "drain",    "label": "Drainage Overflow"},
    "Electricity":   {"bg": "#1a202c", "accent": "#ecc94b", "icon": "bolt",     "label": "Power Outage Report"},
    "Garbage":       {"bg": "#553c9a", "accent": "#b794f4", "icon": "trash",    "label": "Garbage Dump Alert"},
    "Healthcare":    {"bg": "#276749", "accent": "#68d391", "icon": "medical",  "label": "Healthcare Issue"},
    "Public Safety": {"bg": "#c53030", "accent": "#fc8181", "icon": "warning",  "label": "Safety Concern"},
    "Education":     {"bg": "#2c5282", "accent": "#90cdf4", "icon": "school",   "label": "Education Problem"},
    "Housing":       {"bg": "#744210", "accent": "#d69e2e", "icon": "house",    "label": "Housing Complaint"},
    "Agriculture":   {"bg": "#276749", "accent": "#48bb78", "icon": "farm",     "label": "Agriculture Issue"},
    "Environment":   {"bg": "#22543d", "accent": "#68d391", "icon": "leaf",     "label": "Environment Alert"},
    "Sanitation":    {"bg": "#742a2a", "accent": "#fc8181", "icon": "sanitary", "label": "Sanitation Crisis"},
}

# Video-specific palette
VIDEO_PALETTE = {"bg": "#1a202c", "accent": "#e53e3e", "icon": "play", "label": "Video Evidence"}

WARD_DATA = [
    {"ward": "Ward 12", "village": "Sewapuri", "lat": 13.115, "lng": 80.275},
    {"ward": "Ward 8", "village": "Korattur", "lat": 13.130, "lng": 80.290},
    {"ward": "Ward 15", "village": "Perambur", "lat": 13.118, "lng": 80.265},
    {"ward": "Ward 3", "village": "Villivakkam", "lat": 13.140, "lng": 80.305},
    {"ward": "Ward 6", "village": "Ayanavaram", "lat": 13.125, "lng": 80.295},
    {"ward": "Ward 21", "village": "Otteri", "lat": 13.108, "lng": 80.278},
    {"ward": "Ward 18", "village": "Madhavaram", "lat": 13.155, "lng": 80.310},
    {"ward": "Ward 22", "village": "Thiruvottiyur", "lat": 13.165, "lng": 80.300},
    {"ward": "Ward 14", "village": "Tondiarpet", "lat": 13.148, "lng": 80.285},
    {"ward": "Ward 10", "village": "Kasimedu", "lat": 13.138, "lng": 80.295},
    {"ward": "Ward 7", "village": "Kodungaiyur", "lat": 13.142, "lng": 80.272},
    {"ward": "Ward 19", "village": "Royapuram", "lat": 13.110, "lng": 80.282},
    {"ward": "Ward 5", "village": "Sholinghur", "lat": 13.120, "lng": 80.305},
    {"ward": "Ward 16", "village": "Vyasarpadi", "lat": 13.128, "lng": 80.268},
    {"ward": "Ward 2", "village": "Ennore", "lat": 13.170, "lng": 80.280},
]

PLATFORMS = ["twitter", "instagram", "facebook", "youtube", "citizen", "news"]
CATEGORIES = list(CATEGORY_PALETTES.keys())
SEVERITY_LEVELS = ["Critical", "High", "Medium", "Low"]
SENTIMENTS = ["positive", "negative", "neutral", "mixed"]

DEPARTMENTS = {
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

POST_TEMPLATES = {
    "Water Supply": [
        "Third day without water in {ward}. Tankers come once a day but not enough for {affected}+ families.",
        "Water crisis worsening in {village}. Groundwater levels hit record low. Residents forced to buy water.",
        "Major water pipeline burst on main road. Several localities flooded. Repairs expected 48 hours.",
        "Borewell recharge started in {ward}. Expected to help {affected}+ families within 2 weeks.",
    ],
    "Roads": [
        "Dangerous pothole on {village} industrial road swallowed an auto tyre this morning. Fix this now.",
        "Road repair work started on {ward} main road. 2km completed. Remaining sections next month.",
        "New metro station vs broken village road just 200m away. {village} needs development parity.",
        "Encroachment on footpath forcing pedestrians onto busy road near {village}. Accident waiting to happen.",
    ],
    "Drainage": [
        "Open drain in {ward} overflowing for 5 days. Children falling sick. We complained many times.",
        "Sewage water entering homes in {village} after last night rain. {affected}+ houses affected.",
        "Stormwater drain blocked near {ward}. Water logging 3 feet during rainfall. System overhaul needed.",
    ],
    "Electricity": [
        "Transformer blast caused blackout in {village}. No electricity for 72 hours. Residents protest.",
        "Frequent power cuts in {ward} - 6 hours daily. Local businesses suffering huge losses.",
        "Illegal electrical connections near {village}. Fire hazard for entire neighborhood.",
    ],
    "Garbage": [
        "Garbage dump next to tea stall is heartbreaking. {village} needs cleanliness drive.",
        "Ward park has become garbage dumping ground. Children cannot play there anymore.",
        "Plastic waste choking {ward} canal. Water flow blocked. Mosquito breeding ground created.",
    ],
    "Healthcare": [
        "PHC at {village} has only 1 doctor for 80+ patients waiting since 6 AM. Healthcare needs attention.",
        "Medicine shortage at {ward} health center. Insulin and BP medicines out of stock for 3 days.",
        "Ambulance took 45 minutes to reach {village}. Patient rushed to private hospital.",
    ],
    "Public Safety": [
        "Residents block road in {village} demanding streetlights after 3 accidents in one month.",
        "Illegal alcohol shop near school in {ward}. Children exposed to anti-social elements daily.",
        "Fire accident at {village} market. 5 shops destroyed. No fire station within 5km.",
    ],
    "Education": [
        "Government School in {ward} has no drinking water. 45 students in room meant for 20.",
        "Anganwadi center in {village} has no proper roof. Children sit in wet classrooms during rains.",
        "School building declared unsafe 6 months ago. No alternative arranged. Students in temporary shed.",
    ],
    "Housing": [
        "Housing board flats in {ward} leaking after first rain. Construction quality deeply concerning.",
        "Slum dwellers in {village} face eviction threat. No rehabilitation plan announced.",
        "Drainage water entering homes in {ward} housing colony. Third time this month.",
    ],
    "Agriculture": [
        "{village} lake completely dry. Our only water source for irrigation. {affected}+ farmers affected.",
        "Crop damage due to unexpected hailstorm in {village}. Farmers need immediate compensation.",
        "Illegal sand mining near farmland in {ward}. Soil erosion threatening agricultural land.",
    ],
    "Environment": [
        "Fishing boats damaged due to illegal sand mining near {village} coast. {affected} boats affected.",
        "Air quality index in {ward} reaches hazardous levels. Industrial emissions unchecked.",
        "Mangrove destruction for construction in {village}. Coastal erosion accelerating.",
    ],
    "Sanitation": [
        "Overflowing drains in {ward}. Stench unbearable. Residents forced to keep windows shut.",
        "No toilet facilities in {village} market area. {affected} daily vendors affected.",
        "Sewage treatment plant in {ward} non-functional for 3 months. Untreated waste in river.",
    ],
}

HASHTAG_TEMPLATES = {
    "Water Supply": ["#WaterCrisis", "#Chennai", "#WaterShortage", "#SaveWater"],
    "Roads": ["#RoadSafety", "#Pothole", "#RoadRepair", "#ChennaiRoads"],
    "Drainage": ["#Drainage", "#Flooding", "#Sanitation", "#ChennaiRains"],
    "Electricity": ["#PowerCrisis", "#Blackout", "#PowerCut", "#Electricity"],
    "Garbage": ["#CleanChennai", "#Garbage", "#WasteManagement", "#Pollution"],
    "Healthcare": ["#Healthcare", "#HealthCrisis", "#PHC", "#HealthForAll"],
    "Public Safety": ["#PublicSafety", "#StreetLights", "#Accident", "#SafetyFirst"],
    "Education": ["#Education", "#Schools", "#RightToEducation", "#EducationCrisis"],
    "Housing": ["#Housing", "#SlumDwellers", "#AffordableHousing", "#HousingCrisis"],
    "Agriculture": ["#Farmers", "#Agriculture", "#Drought", "#FarmerSupport"],
    "Environment": ["#Environment", "#SaveEnvironment", "#CoastalErosion", "#GreenChennai"],
    "Sanitation": ["#Sanitation", "#CleanCity", "#OpenDrains", "#Hygiene"],
}

NEWS_SOURCES = [
    {"name": "The Hindu", "logo": "TH"},
    {"name": "Indian Express", "logo": "IE"},
    {"name": "Times of India", "logo": "TOI"},
    {"name": "DT Next", "logo": "DN"},
    {"name": "The News Minute", "logo": "NM"},
]

AUTHOR_NAMES = [
    "Rajesh Kannan", "Priya M", "Chennai Lens", "Villivakkam Residents Welfare",
    "Citizen Reporter TN", "Lakshmi S", "Foodie Chennai", "Times Chennai",
    "TN Politics Today", "Chennai Moms Group", "Dr. Senthil", "Chennai Street Photography",
    "NCC North Chennai", "Anita R", "Chennai Weather", "Kasimedu Fishermen Association",
    "Local News Network", "Murugan K", "Chennai Water Watch", "Road Safety Warriors",
    "North Chennai Forum", "Auto Drivers Union", "Teachers Association TN", "Fishermen Welfare Board",
    "Green Chennai Initiative", "Youth for Change", "Senior Citizens Forum", "Chennai Traffic Police",
    "Ward Officers Network", "Public Health Alliance",
]


# ---------------------------------------------------------------------------
# SVG image generator — category-aware, realistic-looking placeholders
# ---------------------------------------------------------------------------

def _hex_to_rgb(h: str):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def _generate_category_svg(category: str, width=800, height=600, seed=0) -> bytes:
    """Generate a category-themed SVG with realistic layout."""
    random.seed(seed)
    pal = CATEGORY_PALETTES.get(category, CATEGORY_PALETTES["Roads"])
    bg = pal["bg"]
    accent = pal["accent"]
    label = pal["label"]

    # Background gradient with slight variation
    bg2_r = min(255, max(0, _hex_to_rgb(bg)[0] + random.randint(-20, 20)))
    bg2_g = min(255, max(0, _hex_to_rgb(bg)[1] + random.randint(-20, 20)))
    bg2_b = min(255, max(0, _hex_to_rgb(bg)[2] + random.randint(-20, 20)))
    bg2 = f"#{bg2_r:02x}{bg2_g:02x}{bg2_b:02x}"

    shapes = []
    # Add atmospheric shapes
    for _ in range(random.randint(3, 7)):
        shape = random.choice(["circle", "rect", "line"])
        opacity = random.uniform(0.05, 0.2)
        if shape == "circle":
            cx = random.randint(0, width)
            cy = random.randint(0, height)
            r = random.randint(30, 150)
            shapes.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{accent}" opacity="{opacity}"/>')
        elif shape == "rect":
            x, y = random.randint(0, width - 100), random.randint(0, height - 100)
            w, h = random.randint(50, 200), random.randint(50, 200)
            shapes.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{accent}" opacity="{opacity}"/>')
        else:
            x1, y1 = random.randint(0, width), random.randint(0, height)
            x2, y2 = random.randint(0, width), random.randint(0, height)
            shapes.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{accent}" stroke-width="1.5" opacity="0.15"/>')

    # Accent bar at top
    accent_bar = f'<rect x="0" y="0" width="{width}" height="6" fill="{accent}" opacity="0.8"/>'

    # Category icon circle
    cx, cy = width // 2, height // 2 - 30
    icon_circle = f'<circle cx="{cx}" cy="{cy}" r="50" fill="{accent}" opacity="0.15"/><circle cx="{cx}" cy="{cy}" r="30" fill="{accent}" opacity="0.25"/>'

    # Label text
    text_main = f'<text x="50%" y="{height//2 + 40}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="22" font-weight="700" fill="white" opacity="0.9">{label}</text>'
    text_sub = f'<text x="50%" y="{height//2 + 65}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="13" fill="white" opacity="0.5">Social Media Intelligence</text>'

    # Bottom bar
    bar = f'<rect x="0" y="{height - 40}" width="{width}" height="40" fill="black" opacity="0.3"/>'

    shapes_str = "\n  ".join([accent_bar] + shapes + [icon_circle, text_main, text_sub, bar])

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg}"/>
      <stop offset="100%" stop-color="{bg2}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  {shapes_str}
</svg>'''
    return svg.encode("utf-8")


def _generate_video_thumbnail_svg(category: str, width=800, height=600, seed=0) -> bytes:
    """Generate a video thumbnail SVG with play button overlay."""
    random.seed(seed)
    pal = CATEGORY_PALETTES.get(category, VIDEO_PALETTE)
    bg = pal["bg"]
    accent = pal["accent"]

    shapes = []
    for _ in range(4):
        cx, cy = random.randint(0, width), random.randint(0, height)
        r = random.randint(40, 120)
        shapes.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{accent}" opacity="0.08"/>')

    shapes_str = "\n  ".join(shapes)

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <rect width="100%" height="100%" fill="{bg}"/>
  {shapes_str}
  <circle cx="{width//2}" cy="{height//2}" r="45" fill="black" opacity="0.5"/>
  <polygon points="{width//2-12},{height//2-18} {width//2-12},{height//2+18} {width//2+20},{height//2}" fill="white" opacity="0.9"/>
  <text x="50%" y="{height//2 + 60}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" fill="white" opacity="0.6">Video Evidence</text>
  <rect x="0" y="0" width="{width}" height="4" fill="{accent}" opacity="0.7"/>
</svg>'''
    return svg.encode("utf-8")


def _generate_demo_svg(name: str, width=400, height=300) -> bytes:
    """Generate a small demo fallback SVG."""
    palettes = {
        "road":       ("#4a5568", "#e53e3e", "Road Pothole"),
        "water":      ("#2b6cb0", "#63b3ed", "Water Leakage"),
        "drainage":   ("#2d3748", "#ed8936", "Drainage Overflow"),
        "electricity":("#1a202c", "#ecc94b", "Power Lines"),
        "garbage":    ("#553c9a", "#b794f4", "Garbage Dump"),
        "hospital":   ("#276749", "#68d391", "Hospital"),
        "streetlight":("#744210", "#d69e2e", "Street Light"),
        "school":     ("#2c5282", "#90cdf4", "School Building"),
        "construction":("#744210", "#d69e2e", "Construction"),
        "park":       ("#22543d", "#68d391", "Park Area"),
        "flooding":   ("#742a2a", "#fc8181", "Flooding"),
        "traffic":    ("#4a5568", "#a0aec0", "Traffic"),
    }
    bg, accent, label = palettes.get(name, ("#4a5568", "#e53e3e", name.title()))

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <rect width="100%" height="100%" fill="{bg}"/>
  <rect x="0" y="0" width="{width}" height="4" fill="{accent}" opacity="0.7"/>
  <circle cx="{width//2}" cy="{height//2 - 15}" r="25" fill="{accent}" opacity="0.2"/>
  <circle cx="{width//2}" cy="{height//2 - 15}" r="15" fill="{accent}" opacity="0.3"/>
  <text x="50%" y="{height//2 + 20}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="600" fill="white" opacity="0.85">{label}</text>
  <text x="50%" y="{height//2 + 38}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="white" opacity="0.45">Demo Asset</text>
</svg>'''
    return svg.encode("utf-8")


# ---------------------------------------------------------------------------
# Ensure files exist on disk — returns JUST the filename (no path prefix)
# ---------------------------------------------------------------------------

def _ensure_image(category: str, seed: int) -> str:
    """Create category image if needed. Returns filename only."""
    safe = "".join(c if c.isalnum() else "-" for c in category.lower())[:20]
    filename = f"{safe}-{seed}.svg"
    filepath = SOCIAL_DIR / filename
    if not filepath.exists():
        filepath.write_bytes(_generate_category_svg(category, seed=seed))
    return filename


def _ensure_video_thumb(category: str, seed: int) -> str:
    """Create video thumbnail if needed. Returns filename only."""
    safe = "".join(c if c.isalnum() else "-" for c in category.lower())[:20]
    filename = f"vid-{safe}-{seed}.svg"
    filepath = SOCIAL_DIR / filename
    if not filepath.exists():
        filepath.write_bytes(_generate_video_thumbnail_svg(category, seed=seed))
    return filename


def _ensure_demo_assets():
    """Create all demo fallback images if they don't exist."""
    for name in DEMO_TYPES:
        fp = DEMO_DIR / f"{name}.jpg"
        if not fp.exists():
            fp.write_bytes(_generate_demo_svg(name))


def _get_demo_for_category(category: str) -> str:
    """Return the demo filename for a given category."""
    return CATEGORY_DEMO_MAP.get(category, "road.jpg")


# ---------------------------------------------------------------------------
# Post generation — EVERY post always gets media
# ---------------------------------------------------------------------------

def _generate_post(index: int) -> Dict[str, Any]:
    random.seed(index * 7 + 42)
    platform = random.choice(PLATFORMS)
    ward_data = random.choice(WARD_DATA)
    category = random.choice(CATEGORIES)
    severity = random.choices(SEVERITY_LEVELS, weights=[15, 35, 35, 15])[0]
    sentiment = random.choices(SENTIMENTS, weights=[10, 55, 25, 10])[0]

    template = random.choice(POST_TEMPLATES[category])
    affected = random.randint(100, 50000)
    text = template.format(ward=ward_data["ward"], village=ward_data["village"], affected=f"{affected:,}")

    possible_hashtags = HASHTAG_TEMPLATES[category]
    num_ht = random.randint(1, min(3, len(possible_hashtags)))
    hashtags = random.sample(possible_hashtags, num_ht)
    hashtags.append(f"#{ward_data['village']}")

    # ---- MEDIA: every post ALWAYS gets at least one image ----
    media_seed = index * 13 + 7
    media = []

    # Primary image — always present
    img_filename = _ensure_image(category, media_seed)
    media.append({
        "id": f"m-{index}-1",
        "type": "image",
        "url": f"/media/social/{img_filename}",
        "thumbnailUrl": f"/media/social/{img_filename}",
        "width": 800,
        "height": 600,
    })

    # ~40% of posts also get a second image
    if random.random() < 0.4:
        img2 = _ensure_image(category, media_seed + 500)
        media.append({
            "id": f"m-{index}-2",
            "type": "image",
            "url": f"/media/social/{img2}",
            "thumbnailUrl": f"/media/social/{img2}",
            "width": 800,
            "height": 600,
        })

    # ~25% also get a video (with its own thumbnail)
    if random.random() < 0.25:
        vid_thumb = _ensure_video_thumb(category, media_seed + 999)
        duration = random.choice([15, 30, 45, 60, 90, 120, 180, 300, 600, 840])
        media.append({
            "id": f"m-{index}-3",
            "type": random.choice(["video", "short", "reel"]),
            "url": f"/media/social/{vid_thumb}",
            "thumbnailUrl": f"/media/social/{vid_thumb}",
            "duration": duration,
            "width": 1280,
            "height": 720,
        })

    # Engagement scaled by severity
    sev_mult = {"Critical": 5, "High": 3, "Medium": 1.5, "Low": 0.8}
    base = sev_mult[severity]
    likes = int(random.randint(50, 5000) * base)
    comments = int(random.randint(10, 1000) * base)
    shares = int(random.randint(5, 2000) * base)
    views = int(random.randint(500, 50000) * base)

    author_name = random.choice(AUTHOR_NAMES)
    uname = author_name.lower().replace(" ", "").replace(".", "")[:12]
    is_verified = random.random() < 0.3
    now = datetime.now(timezone.utc)
    hours_ago = random.uniform(0, 24)
    timestamp = (now - timedelta(hours=hours_ago)).isoformat()

    platform_urls = {
        "twitter": f"https://x.com/{uname}/status/{random.randint(100000, 999999)}",
        "instagram": f"https://instagram.com/p/{uuid.uuid4().hex[:11]}",
        "facebook": f"https://facebook.com/post/{random.randint(1000, 9999)}",
        "youtube": f"https://youtube.com/watch?v={uuid.uuid4().hex[:11]}",
        "citizen": "",
        "news": f"https://example.com/news/{random.randint(1000, 9999)}",
    }

    confidence = random.randint(70, 99)
    priority_score = random.randint(20, 98)
    urgency_score = random.randint(20, 98)

    return {
        "id": f"sp-{index:04d}",
        "platform": platform,
        "authorName": author_name,
        "authorUsername": f"@{uname}",
        "authorAvatar": "".join(w[0] for w in author_name.split()[:2]).upper(),
        "isVerified": is_verified,
        "timestamp": timestamp,
        "text": text,
        "hashtags": hashtags,
        "mentions": [],
        "geoLocation": {
            "lat": ward_data["lat"] + random.uniform(-0.005, 0.005),
            "lng": ward_data["lng"] + random.uniform(-0.005, 0.005),
            "ward": ward_data["ward"],
            "village": ward_data["village"],
        },
        "category": category,
        "severity": severity,
        "sentiment": sentiment,
        "likes": likes,
        "comments": comments,
        "shares": shares,
        "views": views,
        "media": media,
        "originalUrl": platform_urls[platform],
        "ai": {
            "category": category,
            "severity": severity,
            "confidence": confidence,
            "duplicateScore": random.randint(0, 40),
            "fakeNewsProbability": random.randint(0, 10),
            "department": DEPARTMENTS[category],
            "priorityScore": priority_score,
            "urgencyScore": urgency_score,
            "suggestedAction": f"Deploy {DEPARTMENTS[category]} team to {ward_data['village']} for assessment",
            "estimatedImpact": f"Issue affecting {affected:,} residents in {ward_data['ward']}",
            "estimatedAffected": affected,
            "aiSummary": f"AI-detected {category.lower()} issue in {ward_data['village']}. Severity: {severity}. {confidence}% confidence.",
        },
        "isFakeNews": random.random() < 0.03,
    }


def _generate_news_article(index: int) -> Dict[str, Any]:
    random.seed(index * 11 + 99)
    source = random.choice(NEWS_SOURCES)
    ward_data = random.choice(WARD_DATA)
    category = random.choice(CATEGORIES)
    severity = random.choice(["Critical", "High", "Medium"])

    headlines = {
        "Water Supply": f"North Chennai water crisis deepens in {ward_data['village']}",
        "Roads": f"Major road damage on {ward_data['village']} main road",
        "Drainage": f"Overflowing drains create health emergency in {ward_data['village']}",
        "Electricity": f"Power crisis: {ward_data['village']} residents protest blackout",
        "Garbage": f"Garbage crisis in {ward_data['village']}: residents demand action",
        "Healthcare": f"Overcrowded PHC in {ward_data['village']} highlights gap",
        "Public Safety": f"Residents block road in {ward_data['village']} for safety",
        "Education": f"Government school in {ward_data['village']} lacks facilities",
        "Housing": f"Housing board flats in {ward_data['village']} quality concerns",
        "Agriculture": f"Farmers in {ward_data['village']} face crop loss",
        "Environment": f"Environmental concerns near {ward_data['village']} coast",
        "Sanitation": f"Sanitation overhaul recommended for {ward_data['ward']}",
    }

    summaries = {
        "Water Supply": "Residents stage protests demanding immediate water supply.",
        "Roads": "Infrastructure damage on major roads. Repair teams dispatched.",
        "Drainage": "Monsoon damage exposes drainage system failures.",
        "Electricity": "Transformer issues leave areas without power.",
        "Garbage": "Waste management system under strain.",
        "Healthcare": "Public health centers struggling with patient load.",
        "Public Safety": "Safety concerns prompt citizen protests.",
        "Education": "School infrastructure issues highlighted.",
        "Housing": "Housing quality concerns raised.",
        "Agriculture": "Agricultural distress in the region.",
        "Environment": "Environmental agencies investigate complaints.",
        "Sanitation": "Sanitation system failures documented.",
    }

    now = datetime.now(timezone.utc)
    hours_ago = random.uniform(1, 48)
    published_at = (now - timedelta(hours=hours_ago)).isoformat()

    img_filename = _ensure_image(category, index * 7 + 200)

    return {
        "id": f"na-{index:04d}",
        "source": source["name"],
        "sourceLogo": source["logo"],
        "headline": headlines[category],
        "summary": summaries[category],
        "url": f"https://example.com/news/{index}",
        "publishedAt": published_at,
        "author": random.choice(["R. Suryanarayanan", "M. Rajendran", "K. Sridhar", "S. Vasanth", "L. Priyadarshini"]),
        "category": category,
        "location": {"ward": ward_data["ward"], "village": ward_data["village"], "city": "Chennai"},
        "severity": severity,
        "sentiment": random.choice(["negative", "neutral"]),
        "imageUrl": f"/media/social/{img_filename}",
    }


# ---------------------------------------------------------------------------
# Trending / activity / distribution generators
# ---------------------------------------------------------------------------

def _generate_trending_topics() -> List[Dict[str, Any]]:
    topics = [
        {"hashtag": "#WaterCrisis", "sentiment": "negative", "category": "Water Supply"},
        {"hashtag": "#Chennai", "sentiment": "mixed", "category": "Water Supply"},
        {"hashtag": "#RoadSafety", "sentiment": "negative", "category": "Roads"},
        {"hashtag": "#PowerCrisis", "sentiment": "negative", "category": "Electricity"},
        {"hashtag": "#ChennaiRains", "sentiment": "neutral", "category": "Drainage"},
        {"hashtag": "#CleanChennai", "sentiment": "positive", "category": "Garbage"},
        {"hashtag": "#HealthForAll", "sentiment": "negative", "category": "Healthcare"},
        {"hashtag": "#Villivakkam", "sentiment": "negative", "category": "Drainage"},
    ]
    for t in topics:
        t["postCount"] = random.randint(80, 900)
    return topics


def _generate_trending_wards() -> List[Dict[str, Any]]:
    wards = [
        {"ward": "Ward 12 (Sewapuri)", "topIssue": "Water Crisis", "severity": "Critical"},
        {"ward": "Ward 8 (Korattur)", "topIssue": "Road Damage", "severity": "Critical"},
        {"ward": "Ward 15 (Perambur)", "topIssue": "Healthcare", "severity": "High"},
        {"ward": "Ward 3 (Villivakkam)", "topIssue": "Drainage", "severity": "Critical"},
        {"ward": "Ward 6 (Ayanavaram)", "topIssue": "Electricity", "severity": "Critical"},
        {"ward": "Ward 21 (Otteri)", "topIssue": "Education", "severity": "High"},
        {"ward": "Ward 14 (Tondiarpet)", "topIssue": "Streetlights", "severity": "Critical"},
    ]
    for w in wards:
        w["postCount"] = random.randint(50, 250)
    return wards


def _generate_hourly_activity() -> List[Dict[str, Any]]:
    hours = []
    for h in range(0, 24, 2):
        if 6 <= h <= 18:
            posts = random.randint(150, 500)
            engagements = posts * random.randint(80, 200)
        else:
            posts = random.randint(20, 100)
            engagements = posts * random.randint(30, 100)
        hours.append({"hour": f"{h:02d}", "posts": posts, "engagements": engagements})
    return hours


def _generate_platform_distribution() -> List[Dict[str, Any]]:
    total = 2347
    dist = [
        {"platform": "twitter", "percentage": 36},
        {"platform": "instagram", "percentage": 18},
        {"platform": "facebook", "percentage": 13},
        {"platform": "youtube", "percentage": 10},
        {"platform": "citizen", "percentage": 12},
        {"platform": "news", "percentage": 11},
    ]
    for d in dist:
        d["count"] = int(total * d["percentage"] / 100)
    return dist


# ---------------------------------------------------------------------------
# Public API — live data with mock fallback
# ---------------------------------------------------------------------------

import asyncio
import logging
import time
from collections import defaultdict

from app.core.config import settings

logger = logging.getLogger("social.service")

_posts_cache: Optional[List[Dict[str, Any]]] = None
_news_cache: Optional[List[Dict[str, Any]]] = None

# Live data cache with TTL
_live_posts: Optional[List[Dict[str, Any]]] = None
_live_news: Optional[List[Dict[str, Any]]] = None
_live_timestamp: float = 0.0
_live_source: str = "mock"  # "live" or "mock"


def _cache_valid() -> bool:
    """Check if live cache is still within TTL."""
    return (
        _live_posts is not None
        and (time.time() - _live_timestamp) < settings.APIFY_CACHE_TTL
    )


def _fetch_live_data() -> bool:
    """
    Attempt to fetch live data from Apify.
    Returns True if live data was obtained.
    """
    global _live_posts, _live_news, _live_timestamp, _live_source

    token = settings.APIFY_TOKEN
    if not token:
        logger.info("APIFY_TOKEN not set — using mock data")
        return False

    try:
        from app.services.apify_client import fetch_all_platforms
        from app.services.social_normalizer import normalize_all
        from app.services.social_ai import enrich_with_ai

        # Fetch from all platforms concurrently
        raw_data = asyncio.get_event_loop().run_until_complete(
            fetch_all_platforms(count_per_platform=settings.APIFY_MAX_POSTS // 5)
        )

        total_raw = sum(len(v) for v in raw_data.values())
        if total_raw == 0:
            logger.warning("No live data returned from any platform")
            return False

        # Normalize to unified schema
        posts = normalize_all(raw_data)

        # Run AI analysis
        posts = enrich_with_ai(posts)

        # Separate news from social posts
        news = [p for p in posts if p["platform"] == "news"]
        social_posts = [p for p in posts if p["platform"] != "news"]

        _live_posts = social_posts
        _live_news = _news_from_live(news) if news else _generate_news_article_list()
        _live_timestamp = time.time()
        _live_source = "live" if social_posts else "mock"

        logger.info(
            "Live data loaded: %d social posts, %d news articles from %s",
            len(social_posts), len(_live_news),
            ", ".join(f"{k}:{len(v)}" for k, v in raw_data.items() if v),
        )
        return True

    except Exception as exc:
        logger.error("Failed to fetch live data: %s", exc)
        return False


def _news_from_live(live_news: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Convert live news posts to NewsArticle format."""
    articles = []
    for post in live_news[:20]:
        articles.append({
            "id": post["id"],
            "source": post["authorName"],
            "sourceLogo": post["authorName"][:2].upper(),
            "headline": post["text"][:120],
            "summary": post["text"][:300],
            "url": post.get("originalUrl", ""),
            "publishedAt": post["timestamp"],
            "author": post.get("authorUsername", ""),
            "category": post["category"],
            "location": {
                "ward": post["geoLocation"].get("ward", "Unknown"),
                "village": post["geoLocation"].get("village", "Chennai"),
                "city": "Chennai",
            },
            "severity": post["severity"],
            "sentiment": post["sentiment"],
            "imageUrl": post["media"][0]["url"] if post.get("media") else "",
        })
    return articles


def _generate_news_article_list() -> List[Dict[str, Any]]:
    """Fallback news generation."""
    return [_generate_news_article(i) for i in range(20)]


def get_posts(force_refresh: bool = False) -> List[Dict[str, Any]]:
    """
    Get social posts. Tries live data first, falls back to mock.
    Live data is cached for APIFY_CACHE_TTL seconds.
    """
    global _posts_cache, _live_source

    # Try live data
    if force_refresh or not _cache_valid():
        live_ok = _fetch_live_data()
        if live_ok and _live_posts:
            _posts_cache = _live_posts
            return _posts_cache

    # Use live cache if available
    if _live_posts and _live_source == "live":
        _posts_cache = _live_posts
        return _posts_cache

    # Fall back to mock
    if _posts_cache is None or force_refresh:
        _ensure_demo_assets()
        _posts_cache = [_generate_post(i) for i in range(200)]
        _posts_cache.sort(key=lambda p: p["timestamp"], reverse=True)
        _live_source = "mock"
    return _posts_cache


def get_news(force_refresh: bool = False) -> List[Dict[str, Any]]:
    """Get news articles. Live or mock."""
    global _news_cache, _live_source

    if _live_news and _live_source == "live" and not force_refresh:
        _news_cache = _live_news
        return _news_cache

    if _news_cache is None or force_refresh:
        _ensure_demo_assets()
        _news_cache = _generate_news_article_list()
    return _news_cache


def get_data_source() -> str:
    """Return 'live' or 'mock'."""
    return _live_source


def sync_all_platforms() -> Dict[str, Any]:
    """
    Force refresh all platforms. Returns status dict.
    """
    global _live_posts, _live_news, _live_timestamp, _live_source

    old_source = _live_source
    success = _fetch_live_data()

    if success:
        return {
            "status": "success",
            "source": "live",
            "posts": len(_live_posts or []),
            "news": len(_live_news or []),
            "message": f"Synced from live platforms",
        }
    else:
        return {
            "status": "fallback",
            "source": "mock",
            "posts": len(get_posts()),
            "news": len(get_news()),
            "message": "Live sync failed — using mock data. Set APIFY_TOKEN to enable live scraping.",
        }


def _apply_filters(
    posts: List[Dict[str, Any]],
    platform: Optional[str] = None,
    category: Optional[str] = None,
    severity: Optional[str] = None,
    min_likes: Optional[int] = None,
    search: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Apply server-side filters to post list."""
    result = posts

    if platform:
        platforms = [p.strip() for p in platform.split(",")]
        result = [p for p in result if p.get("platform") in platforms]

    if category:
        categories = [c.strip() for c in category.split(",")]
        result = [p for p in result if p.get("category") in categories]

    if severity:
        result = [p for p in result if p.get("severity") == severity]

    if min_likes is not None:
        result = [p for p in result if p.get("likes", 0) >= min_likes]

    if search:
        q = search.lower()
        result = [
            p for p in result
            if q in p.get("text", "").lower()
            or q in p.get("authorName", "").lower()
            or q in p.get("category", "").lower()
            or q in p.get("geoLocation", {}).get("ward", "").lower()
            or q in p.get("geoLocation", {}).get("village", "").lower()
        ]

    return result


def _compute_analytics(posts: List[Dict[str, Any]], news: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute analytics from post list."""
    hashtag_counts: Dict[str, int] = defaultdict(int)
    for post in posts:
        for tag in post.get("hashtags", []):
            hashtag_counts[tag] += 1

    hashtags = sorted(
        [{"tag": t, "count": c} for t, c in hashtag_counts.items()],
        key=lambda x: x["count"], reverse=True,
    )[:20]

    heatmap = [
        {
            "lat": p["geoLocation"]["lat"],
            "lng": p["geoLocation"]["lng"],
            "intensity": min(1.0, (p.get("likes", 0) + p.get("comments", 0)) / 10000),
            "severity": p["severity"],
        }
        for p in posts
    ]

    critical_count = sum(1 for p in posts if p["severity"] == "Critical")
    video_count = sum(1 for p in posts for m in p.get("media", []) if m["type"] in ("video", "short", "reel"))
    image_count = sum(1 for p in posts for m in p.get("media", []) if m["type"] == "image")

    # Platform distribution from actual data
    platform_counts: Dict[str, int] = defaultdict(int)
    for p in posts:
        platform_counts[p.get("platform", "unknown")] += 1
    total = max(len(posts), 1)
    platform_dist = [
        {"platform": plat, "count": cnt, "percentage": round(cnt / total * 100)}
        for plat, cnt in sorted(platform_counts.items(), key=lambda x: -x[1])
    ]

    # Hourly activity from actual timestamps
    hour_counts: Dict[str, int] = defaultdict(int)
    hour_engagement: Dict[str, int] = defaultdict(int)
    for p in posts:
        try:
            ts = p.get("timestamp", "")
            h = ts[11:13] if len(ts) > 13 else "00"
            hour_counts[h] += 1
            hour_engagement[h] += p.get("likes", 0) + p.get("comments", 0) + p.get("shares", 0)
        except Exception:
            pass
    hourly = [
        {"hour": f"{h:02d}", "posts": hour_counts.get(f"{h:02d}", 0), "engagements": hour_engagement.get(f"{h:02d}", 0)}
        for h in range(0, 24, 2)
    ]

    # Trending wards from actual data
    ward_posts: Dict[str, List] = defaultdict(list)
    for p in posts:
        ward = p.get("geoLocation", {}).get("ward", "Unknown")
        ward_posts[ward].append(p)
    trending_wards = []
    for ward, wposts in sorted(ward_posts.items(), key=lambda x: -len(x[1]))[:7]:
        sev_counts = defaultdict(int)
        cats = defaultdict(int)
        for wp in wposts:
            sev_counts[wp["severity"]] += 1
            cats[wp["category"]] += 1
        top_sev = max(sev_counts, key=sev_counts.get) if sev_counts else "Medium"
        top_cat = max(cats, key=cats.get) if cats else "Roads"
        trending_wards.append({
            "ward": ward,
            "postCount": len(wposts),
            "topIssue": top_cat,
            "severity": top_sev,
        })

    kpis = {
        "totalPostsToday": len(posts) * 23 + 100,
        "viralComplaints": critical_count,
        "videosUploaded": video_count * 8,
        "imagesUploaded": image_count * 12,
        "avgAISeverity": 74,
        "sentimentScore": 42,
        "trendingLocations": len(set(p.get("geoLocation", {}).get("ward", "") for p in posts)),
        "newsMentions": len(news),
    }

    return {
        "hashtags": hashtags,
        "heatmap": heatmap,
        "kpis": kpis,
        "platformDistribution": platform_dist,
        "hourlyActivity": hourly,
        "trendingWards": trending_wards,
    }


def get_feed(
    cursor: Optional[str] = None,
    limit: int = 20,
    platform: Optional[str] = None,
    category: Optional[str] = None,
    severity: Optional[str] = None,
    min_likes: Optional[int] = None,
    search: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Get paginated social feed with optional filters.
    """
    posts = get_posts()
    news = get_news()

    # Apply filters
    filtered = _apply_filters(posts, platform, category, severity, min_likes, search)

    # Paginate
    offset = 0
    if cursor:
        try:
            offset = int(cursor.split("-")[-1])
        except (ValueError, IndexError):
            offset = 0

    sliced = filtered[offset : offset + limit]
    has_more = (offset + limit) < len(filtered)
    next_cursor = f"post-{offset + limit}" if has_more else None

    analytics = _compute_analytics(posts, news)

    return {
        "posts": sliced,
        "trending": analytics["hashtags"][:10],
        "news": [n["headline"] for n in news[:5]],
        "hashtags": [h["tag"] for h in analytics["hashtags"][:10]],
        "heatmap": analytics["heatmap"],
        "kpis": analytics["kpis"],
        "trendingTopics": _generate_trending_topics(),
        "trendingWards": analytics["trendingWards"],
        "hourlyActivity": analytics["hourlyActivity"],
        "platformDistribution": analytics["platformDistribution"],
        "newsArticles": news,
        "totalPosts": len(filtered),
        "hasMore": has_more,
        "nextCursor": next_cursor,
        "dataSource": _live_source,
    }


def startup_report() -> Dict[str, Any]:
    """Verify media integrity at startup. Returns stats dict."""
    _ensure_demo_assets()
    posts = get_posts()
    news = get_news()

    all_urls = []
    for p in posts:
        for m in p.get("media", []):
            all_urls.append({"post": p["id"], "url": m["url"], "type": m["type"]})
    for n in news:
        if n.get("imageUrl"):
            all_urls.append({"post": n["id"], "url": n["imageUrl"], "type": "news"})

    cached_files = set(os.listdir(SOCIAL_DIR)) if SOCIAL_DIR.exists() else set()
    demo_files = set(os.listdir(DEMO_DIR)) if DEMO_DIR.exists() else set()
    broken = []

    for item in all_urls:
        fn = os.path.basename(item["url"])
        if fn not in cached_files:
            broken.append(item)

    return {
        "total_posts": len(posts),
        "total_news": len(news),
        "total_media_urls": len(all_urls),
        "cached_social_files": len(cached_files),
        "demo_assets": len(demo_files),
        "broken_references": len(broken),
        "broken_details": broken[:10],
        "data_source": _live_source,
    }

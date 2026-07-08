"""Service for auto-seeding demo complaint data per constituency."""

import json
import logging
import random
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List

from sqlalchemy import text, select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.complaint import Complaint, IssueCluster

logger = logging.getLogger("app.services.seed")

CONSTITUENCIES_PATH = Path(__file__).resolve().parent.parent / "data" / "constituencies.json"

CATEGORIES = [
    "road", "water", "electricity", "sanitation",
    "healthcare", "education", "safety", "housing",
]

DEPARTMENTS = {
    "road": "Roads & Infrastructure",
    "water": "Water Supply",
    "electricity": "Electricity",
    "sanitation": "Sanitation",
    "healthcare": "Healthcare",
    "education": "Education",
    "safety": "Public Safety",
    "housing": "Housing",
}

SEVERITIES = ["low", "medium", "high", "critical"]
STATUSES = ["pending", "in_progress", "resolved"]

TITLES = {
    "road": [
        "Potholes on main road near {village}",
        "Road widening needed in {village} area",
        "Damaged road surface on {ward} road",
        "Street lighting not working on {village} main road",
        "Footpath encroachment on {ward} market road",
    ],
    "water": [
        "Water supply irregular in {village}",
        "Borewell damaged near {ward}",
        "Contaminated drinking water in {village}",
        "Water tanker not reaching {village} regularly",
        "Drainage overflow mixing with water supply in {ward}",
    ],
    "electricity": [
        "Power fluctuations in {village} causing appliance damage",
        "Transformer blown near {ward}",
        "No street lights in {village} for past week",
        "Voltage too low in {ward} area during peak hours",
        "Electric pole leaning dangerously in {village}",
    ],
    "sanitation": [
        "Garbage not collected in {village} for weeks",
        "Open drainage causing health issues in {ward}",
        "Public toilet broken in {village} market area",
        "Solid waste dumping near {village} residential area",
        "Sewage overflow on {ward} main street",
    ],
    "healthcare": [
        "PHC lacks basic medicines in {village}",
        "No doctor available at {ward} health center",
        "Ambulance not reaching {village} in time",
        "Vaccination drive incomplete in {ward}",
        "Pest infestation spreading diseases in {village}",
    ],
    "education": [
        "School building needs repairs in {village}",
        "No proper toilets for girls at {ward} school",
        "Mid-day meal quality poor in {village} school",
        "Teacher absenteeism in {ward} government school",
        "Playground encroached in {village} school",
    ],
    "safety": [
        "Street crime increasing in {village}",
        "No CCTV cameras in {ward} market area",
        "Women safety concerns in {village} outskirts",
        "Traffic signal not working at {ward} junction",
        "Stray dog menace in {village} residential area",
    ],
    "housing": [
        "Delay in PM Awas Yojana funds in {village}",
        "Substandard construction materials in {ward} housing project",
        "No basic amenities in {village} slum rehabilitation",
        "Housing loan subsidy not released for {ward} beneficiaries",
        "Cracked walls in new houses at {village} colony",
    ],
}

CITIZEN_NAMES = [
    "Arun Kumar", "Priya Sharma", "Rahul Verma", "Sneha Patel",
    "Vijay Singh", "Anita Reddy", "Suresh Nair", "Lakshmi Iyer",
    "Manoj Joshi", "Deepa Menon", "Karthik Rajan", "Pooja Deshmukh",
    "Ramesh Gupta", "Kavita Das", "Siddharth Mishra", "Meena Chopra",
    "Ganesh Pillai", "Rekha Saxena", "Amit Thakur", "Nandini Rao",
]


def _load_constituency(name: str) -> Dict:
    if not CONSTITUENCIES_PATH.exists():
        raise FileNotFoundError(f"Constituencies data not found at {CONSTITUENCIES_PATH}")
    with open(CONSTITUENCIES_PATH) as f:
        data = json.load(f)
    if name not in data:
        raise ValueError(f"Constituency '{name}' not found")
    return data[name]


def _generate_gps(constituency: Dict) -> tuple:
    center = constituency["center"]
    lat = center["lat"] + random.uniform(-0.04, 0.04)
    lng = center["lng"] + random.uniform(-0.04, 0.04)
    return round(lat, 6), round(lng, 6)


async def count_existing(db: AsyncSession, constituency: str) -> int:
    result = await db.execute(
        select(func.count(Complaint.id)).where(Complaint.constituency_name == constituency)
    )
    return result.scalar() or 0


async def seed_constituency(db: AsyncSession, constituency_name: str, min_count: int = 25, max_count: int = 40) -> Dict:
    """Seed demo complaints for a constituency. Returns summary."""
    existing = await count_existing(db, constituency_name)
    if existing >= min_count:
        return {"constituency": constituency_name, "existing": existing, "created": 0, "message": "Sufficient data already exists"}

    profile = _load_constituency(constituency_name)
    villages = profile.get("villages_list", [])
    wards = profile.get("wards_list", [])
    target = random.randint(min_count, max_count)
    to_create = max(target - existing, 0)

    created = 0
    for _ in range(to_create):
        category = random.choice(CATEGORIES)
        village = random.choice(villages) if villages else "Unknown"
        ward = random.choice(wards) if wards else "Unknown"
        title_template = random.choice(TITLES[category])
        title = title_template.format(village=village, ward=ward)
        lat, lng = _generate_gps(profile)
        days_ago = random.randint(0, 90)
        created_at = datetime.utcnow() - timedelta(days=days_ago, hours=random.randint(0, 23))
        severity = random.choices(SEVERITIES, weights=[0.15, 0.35, 0.35, 0.15])[0]
        status = random.choices(STATUSES, weights=[0.4, 0.3, 0.3])[0]
        evidence_score = round(random.uniform(0.3, 0.95), 2)
        priority_prediction = round(random.uniform(0.0, 1.0), 2)
        ai_confidence = round(random.uniform(0.6, 0.98), 2)
        citizen_name = random.choice(CITIZEN_NAMES)

        complaint_uid = f"DEMO-{uuid.uuid4().hex[:8].upper()}"
        complaint = Complaint(
            complaint_uid=complaint_uid,
            title=title,
            description=f"Resident of {village} reports: {title.lower()}. This issue has been pending for {random.randint(2, 60)} days and requires immediate attention from the {DEPARTMENTS[category]} department.",
            category=category,
            department=DEPARTMENTS[category],
            severity=severity,
            status=status,
            gps_latitude=lat,
            gps_longitude=lng,
            gps_accuracy=random.uniform(3, 25),
            village=village,
            ward=ward.split(" - ")[0] if " - " in ward else ward,
            district=profile.get("district"),
            state=profile.get("state"),
            assembly_constituency=constituency_name,
            lok_sabha_constituency=profile.get("lok_sabha"),
            constituency_name=constituency_name,
            verification_status=random.choices(["verified", "unverified", "pending"], weights=[0.5, 0.3, 0.2])[0],
            verification_confidence=ai_confidence,
            evidence_score=evidence_score,
            ai_detected_category=category,
            ai_detected_department=DEPARTMENTS[category],
            priority_prediction=priority_prediction,
            ai_confidence=ai_confidence,
            estimated_resolution_days=random.randint(7, 90),
            images=json.dumps([
                f"https://placehold.co/800x600/3b82f6/ffffff?text={complaint_uid}-img1",
                f"https://placehold.co/800x600/ef4444/ffffff?text={complaint_uid}-img2",
            ]),
            citizen_id=f"CIT-{uuid.uuid4().hex[:6].upper()}",
            citizen_name=citizen_name,
            created_at=created_at,
            updated_at=created_at,
        )
        db.add(complaint)
        created += 1

    await db.commit()
    logger.info("Seeded %d complaints for %s", created, constituency_name)
    return {"constituency": constituency_name, "existing": existing, "created": created, "message": f"Created {created} demo complaints"}

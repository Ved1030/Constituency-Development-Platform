"""
Seed script: populates cdp.db with sample complaints and issue clusters
for the North Chennai constituency.

Usage:
    python seed.py          # Creates tables + inserts seed data
    python seed.py --clear  # Drops all data first, then re-seeds
"""

import asyncio
import sys
import uuid
from datetime import datetime, timedelta

from app.database.base import Base
from app.database.session import engine, async_session_factory
from app.models.complaint import Complaint, IssueCluster


def _uid() -> str:
    return uuid.uuid4().hex[:16]


def _cluster_uid() -> str:
    return "CLT-" + uuid.uuid4().hex[:8].upper()


def _cmp_uid(n: int) -> str:
    return f"CMP-2025-{n:03d}"


def _days_ago(n: int) -> datetime:
    return datetime.utcnow() - timedelta(days=n)


def _future_days(n: int) -> datetime:
    return datetime.utcnow() + timedelta(days=n)


# ─── Realistic complaint templates (North Chennai) ─────────────────────
SEED_COMPLAINTS = [
    # (uid_suffix, title, desc, category, department, severity, status, lat, lng, village, ward, landmark, days_ago)
    (1, "Severe Waterlogging in Gandhi Nagar Main Road",
     "The main road in Gandhi Nagar has been waterlogged for over a week. Drainage system is completely blocked causing health hazards for residents.",
     "water", "Corporation Water Board", "critical", "in-progress",
     13.0827, 80.2707, "Gandhi Nagar", "7", "Gandhi Nagar Main Road", 25),

    (2, "Broken Street Lights on 3rd Cross Road",
     "Street lights on 3rd Cross Road have been non-functional for 3 weeks. The area becomes completely dark after sunset raising safety concerns.",
     "electricity", "Electricity Board", "high", "verified",
     13.0840, 80.2720, "Gandhi Nagar", "7", "3rd Cross Road", 18),

    (3, "Multiple Potholes on School Road",
     "Multiple deep potholes on the road leading to Government High School. Risk of accidents for school children and vehicles.",
     "road", "Corporation Roads Division", "high", "in-progress",
     13.0790, 80.2750, "Ward 5 Central", "5", "School Road", 30),

    (4, "PHC Medicine Shortage in Ward 7",
     "Ward 7 Government Primary Health Centre has been facing shortage of essential medicines for the past month.",
     "healthcare", "Health Department", "critical", "resolved",
     13.0810, 80.2690, "Gandhi Nagar", "7", "PHC Ward 7", 45),

    (5, "Open Sewage in Krishna Nagar Colony",
     "Open sewage line in Krishna Nagar Colony causing foul smell and breeding mosquitoes. Several cases of dengue reported.",
     "sanitation", "Corporation Sanitation Wing", "critical", "pending",
     13.0860, 80.2680, "Krishna Nagar", "7", "Krishna Nagar Colony", 5),

    (6, "Anganwadi Center Roof Leaking",
     "The Anganwadi center in Ward 7 has a leaking roof and broken furniture. Children are being forced to sit on the floor.",
     "education", "Education Department", "medium", "in-progress",
     13.0830, 80.2730, "Gandhi Nagar", "7", "Anganwadi Center", 20),

    (7, "Irregular Water Supply in Ramesh Nagar",
     "Water supply has been highly irregular for 2 months. Residents getting water only once in 3 days for 30 minutes.",
     "water", "Metro Water Board", "high", "verified",
     13.0780, 80.2710, "Ramesh Nagar", "7", "Ramesh Nagar", 15),

    (8, "Garbage Not Collected for 2 Weeks",
     "Solid waste has not been collected from Krishna Nagar for 2 weeks. Garbage piles accumulating on street corners.",
     "sanitation", "Corporation Sanitation Wing", "high", "in-progress",
     13.0850, 80.2700, "Krishna Nagar", "7", "Krishna Nagar Main", 10),

    (9, "Road Cave-In Near Velachery Market",
     "Portion of road near the main market has caved in creating a 3ft deep pit. Risk to pedestrians and vehicles.",
     "road", "Corporation Roads Division", "critical", "pending",
     13.1240, 80.2810, "Velachery", "4", "Velachery Market", 2),

    (10, "Transformer Blown Near T Nagar Park",
     "Main transformer has blown affecting power supply to 200+ houses. Area without power for 24+ hours.",
     "electricity", "Electricity Board", "critical", "in-progress",
     13.1345, 80.2770, "T Nagar", "3", "T Nagar Park", 1),

    (11, "Water Pipe Burst on 5th Street Adyar",
     "Main water pipe has burst flooding the street. Water wastage for 2 days. 500+ families affected.",
     "water", "Metro Water Board", "high", "in-progress",
     13.1395, 80.2910, "Adyar East", "2", "5th Street Adyar", 3),

    (12, "Damaged School Wall at T Nagar Primary",
     "Boundary wall of T Nagar Primary School partially collapsed after heavy rain. Risk to 400+ students.",
     "education", "Education Department", "high", "verified",
     13.1350, 80.2780, "T Nagar", "3", "T Nagar Primary School", 12),

    (13, "Mosquito Breeding in Vacant Lot Sholinganallur",
     "Vacant lot has stagnant water breeding mosquitoes. Dengue risk high in surrounding residential area.",
     "sanitation", "Corporation Sanitation Wing", "medium", "pending",
     13.1550, 80.2900, "Sholinganallur", "1", "Sholinganallur Colony", 4),

    (14, "Electric Pole Leaning Dangerously in Taramani",
     "Concrete electric pole tilted at 30-degree angle after vehicle collision. Risk of falling on pedestrians.",
     "electricity", "Electricity Board", "critical", "pending",
     13.1280, 80.2850, "Taramani", "6", "Taramani Bus Stop", 1),

    (15, "Non-Functional Traffic Signal at T Nagar Junction",
     "Traffic signal at major T Nagar junction has been blinking yellow for 2 weeks causing accidents.",
     "road", "Public Safety", "medium", "verified",
     13.1330, 80.2760, "T Nagar", "3", "T Nagar Junction", 20),

    (16, "Ambulance Delayed Due to Road Condition",
     "Critical ambulance response was delayed by 20 minutes due to extremely poor road conditions in Taramani.",
     "healthcare", "Health Department", "critical", "in-progress",
     13.1260, 80.2830, "Taramani", "6", "Taramani Main Road", 8),

    (17, "Solar Street Light Installation Needed in Ward 5",
     "Recently developed residential colony has no street lighting. Residents afraid to go out after dark.",
     "electricity", "Electricity Board", "medium", "pending",
     13.1420, 80.2850, "Ward 5 Central", "5", "Ward 5 Colony", 6),

    (18, "Broken Sewage Pump in Marina Ward",
     "Sewage pumping station motor burned out. Raw sewage backing up into residential streets.",
     "sanitation", "Corporation Water Board", "critical", "in-progress",
     13.1500, 80.2820, "Marina Ward", "8", "Marina Pump Station", 7),

    (19, "Contaminated Drinking Water in Sholinganallur",
     "Water testing reveals contamination in supply. 500+ families at risk of waterborne diseases.",
     "water", "Metro Water Board", "critical", "pending",
     13.1570, 80.2930, "Sholinganallur", "1", "Sholinganallur Water Tank", 3),

    (20, "Asbestos Roof at Adyar East Health Center",
     "OPD still has damaged asbestos roofing which is a health hazard for patients and staff.",
     "healthcare", "Health Department", "high", "verified",
     13.1380, 80.2920, "Adyar East", "2", "PHC Adyar East", 14),
]

SEED_CLUSTERS = [
    # (cluster_uid, category, department, title, lat, lng, radius, count, severity, village, ward)
    ("CLT-WAT-001", "water", "Corporation Water Board",
     "Waterlogging cluster: Gandhi Nagar and surrounding areas", 13.0827, 80.2707, 50, 3, "critical", "Gandhi Nagar", "7"),
    ("CLT-ROAD-001", "road", "Corporation Roads Division",
     "Road damage cluster: Velachery to Taramani corridor", 13.1250, 80.2820, 200, 2, "critical", "Velachery", "4"),
    ("CLT-SAN-001", "sanitation", "Corporation Sanitation Wing",
     "Sanitation cluster: Krishna Nagar garbage and sewage", 13.0855, 80.2690, 80, 3, "high", "Krishna Nagar", "7"),
    ("CLT-ELEC-001", "electricity", "Electricity Board",
     "Power infrastructure cluster: T Nagar transformer and lines", 13.1345, 80.2770, 100, 2, "critical", "T Nagar", "3"),
]


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Tables created/verified")


async def clear_data():
    async with async_session_factory() as session:
        await session.execute(Complaint.__table__.delete())
        await session.execute(IssueCluster.__table__.delete())
        await session.commit()
    print("[OK] Existing data cleared")


async def seed_clusters():
    async with async_session_factory() as session:
        for c in SEED_CLUSTERS:
            cluster = IssueCluster(
                id=_uid(),
                cluster_uid=c[0],
                category=c[1],
                department=c[2],
                title=c[3],
                description=f"AI-detected cluster of related {c[1]} complaints in {c[8]} area.",
                centroid_lat=c[4],
                centroid_lng=c[5],
                radius_meters=c[6],
                report_count=c[7],
                severity=c[8],
                village=c[9],
                ward=c[10],
                district="Chennai",
                state="Tamil Nadu",
                assembly_constituency="North Chennai",
                lok_sabha_constituency="Chennai North",
                priority_score=95.0 if c[8] == "critical" else 70.0,
                created_at=_days_ago(30),
                updated_at=_days_ago(1),
            )
            session.add(cluster)
        await session.commit()
    print(f"[OK] Seeded {len(SEED_CLUSTERS)} issue clusters")


async def seed_complaints():
    clusters = {}
    async with async_session_factory() as session:
        from sqlalchemy import select
        result = await session.execute(select(IssueCluster))
        for row in result.scalars().all():
            clusters[row.category] = row.id

        for s in SEED_COMPLAINTS:
            uid_suffix, title, desc, category, department, severity, status, lat, lng, village, ward, landmark, days_ago = s

            resolved = status == "resolved"
            estimated_days = None if resolved else (
                7 if severity == "critical" else 14 if severity == "high" else 30
            )
            evidence = 95.0 if lat else 0.0
            ai_conf = 0.92 if severity in ("critical", "high") else 0.78
            dup_prob = 0.15 if category in ("water", "road") else 0.05
            created = _days_ago(days_ago)
            updated = _days_ago(max(1, days_ago - 3)) if not resolved else _days_ago(2)

            complaint = Complaint(
                id=_uid(),
                complaint_uid=_cmp_uid(uid_suffix),
                title=title,
                description=desc,
                category=category,
                department=department,
                severity=severity,
                status=status,
                gps_latitude=lat,
                gps_longitude=lng,
                gps_accuracy=8.0 if lat else None,
                village=village,
                ward=ward,
                taluka="Chennai",
                district="Chennai",
                state="Tamil Nadu",
                pincode="600001",
                assembly_constituency="North Chennai",
                lok_sabha_constituency="Chennai North",
                nearest_landmark=landmark,
                verification_status="verified" if lat else "unverified",
                verification_confidence=0.90 if lat else 0.0,
                evidence_score=evidence,
                duplicate_probability=dup_prob,
                cluster_id=clusters.get(category),
                duplicate_count=2 if dup_prob > 0.1 else 0,
                ai_detected_category=category,
                ai_detected_department=department,
                ai_detected_sector="Infrastructure",
                ai_confidence=ai_conf,
                priority_prediction=95.0 if severity == "critical" else 70.0 if severity == "high" else 40.0,
                estimated_resolution_days=estimated_days,
                citizen_id=f"CIT-{uid_suffix:03d}",
                citizen_name=["Arun Kumar", "Priya Sharma", "Rajesh Patel", "Sneha Gupta", "Vikram Singh"][uid_suffix % 5],
                images=None,
                voice_url=None,
                video_url=None,
                heatmap_key=f"{village}|{ward}|{department}",
                original_language="Tamil",
                language_code="ta",
                created_at=created,
                updated_at=updated,
            )
            session.add(complaint)

        await session.commit()
    print(f"[OK] Seeded {len(SEED_COMPLAINTS)} complaints")


async def main():
    if "--clear" in sys.argv:
        await clear_data()
    await create_tables()
    await seed_clusters()
    await seed_complaints()
    print("\n[OK] Database seeded successfully!")
    print(f"   - {len(SEED_COMPLAINTS)} complaints")
    print(f"   - {len(SEED_CLUSTERS)} issue clusters")


if __name__ == "__main__":
    asyncio.run(main())

"""
SQLAlchemy ORM models for Complaints and Issue Clusters.

Complaint: the core entity with full GPS, geolocation, evidence, and
verification fields.
IssueCluster: groups similar complaints within a defined radius.
"""

import uuid
from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


def _uuid() -> str:
    return uuid.uuid4().hex[:16]


class IssueCluster(Base):
    """Groups duplicate/related complaints within a geographic radius."""

    __tablename__ = "issue_clusters"

    id = Column(String(32), primary_key=True, default=_uuid)
    cluster_uid = Column(String(20), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False)
    department = Column(String(100), nullable=True)
    sector = Column(String(100), nullable=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)

    # Centroid of the cluster (average of member lat/lng)
    centroid_lat = Column(Float, nullable=False)
    centroid_lng = Column(Float, nullable=False)
    radius_meters = Column(Float, default=25.0)

    report_count = Column(Integer, default=1)
    severity = Column(String(20), default="medium")
    priority_score = Column(Float, default=0.0)

    # Geo
    village = Column(String(200), nullable=True)
    ward = Column(String(100), nullable=True)
    taluka = Column(String(200), nullable=True)
    district = Column(String(200), nullable=True)
    state = Column(String(200), nullable=True)
    assembly_constituency = Column(String(200), nullable=True)
    lok_sabha_constituency = Column(String(200), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    complaints = relationship("Complaint", back_populates="cluster", lazy="selectin")


class Complaint(Base):
    """
    Core complaint entity with GPS, geolocation, evidence, and AI verification.
    """

    __tablename__ = "complaints"

    # -- Identity -----------------------------------------------------------
    id = Column(String(32), primary_key=True, default=_uuid)
    complaint_uid = Column(String(20), unique=True, nullable=False, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)

    # -- Category / routing -------------------------------------------------
    category = Column(String(50), nullable=False)
    sector = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    severity = Column(String(20), default="medium")
    status = Column(String(30), default="pending")

    # -- GPS ----------------------------------------------------------------
    gps_latitude = Column(Float, nullable=True)
    gps_longitude = Column(Float, nullable=True)
    gps_accuracy = Column(Float, nullable=True)
    gps_altitude = Column(Float, nullable=True)
    gps_speed = Column(Float, nullable=True)
    gps_heading = Column(Float, nullable=True)
    gps_timestamp = Column(DateTime, nullable=True)

    # -- Reverse Geocoding --------------------------------------------------
    village = Column(String(200), nullable=True)
    ward = Column(String(100), nullable=True)
    taluka = Column(String(200), nullable=True)
    district = Column(String(200), nullable=True)
    state = Column(String(200), nullable=True)
    pincode = Column(String(10), nullable=True)
    assembly_constituency = Column(String(200), nullable=True)
    lok_sabha_constituency = Column(String(200), nullable=True)
    constituency_name = Column(String(200), nullable=True, index=True)
    nearest_landmark = Column(String(300), nullable=True)

    # -- Evidence & Verification --------------------------------------------
    verification_status = Column(String(30), default="unverified")
    verification_confidence = Column(Float, default=0.0)
    evidence_score = Column(Float, default=0.0)

    # -- Duplicate Detection ------------------------------------------------
    duplicate_probability = Column(Float, default=0.0)
    cluster_id = Column(String(32), ForeignKey("issue_clusters.id"), nullable=True)
    duplicate_count = Column(Integer, default=0)

    # -- AI Classification --------------------------------------------------
    ai_detected_category = Column(String(50), nullable=True)
    ai_detected_department = Column(String(100), nullable=True)
    ai_detected_sector = Column(String(100), nullable=True)
    ai_confidence = Column(Float, default=0.0)
    priority_prediction = Column(Float, default=0.0)
    estimated_resolution_days = Column(Integer, nullable=True)

    # -- Evidence files (JSON list of URLs) ----------------------------------
    images = Column(Text, nullable=True)       # JSON array of image URLs
    voice_url = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)

    # -- Citizen / Reporter -------------------------------------------------
    citizen_id = Column(String(50), nullable=True)
    citizen_name = Column(String(200), nullable=True)

    # -- Heatmap integration ------------------------------------------------
    heatmap_key = Column(String(200), nullable=True)  # village+ward+department composite

    # -- Multilingual -------------------------------------------------------
    original_language = Column(String(50), nullable=True)
    language_code = Column(String(10), nullable=True)
    original_text = Column(Text, nullable=True)
    final_text = Column(Text, nullable=True)
    english_translation = Column(Text, nullable=True)

    # -- Timestamps ---------------------------------------------------------
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # -- Relationship -------------------------------------------------------
    cluster = relationship("IssueCluster", back_populates="complaints", lazy="selectin")

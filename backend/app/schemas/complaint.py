"""
Pydantic schemas for Complaint API request/response validation.

All API payloads and responses for the complaint feature flow through these.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# GPS / Location schemas
# ---------------------------------------------------------------------------

class GPSLocation(BaseModel):
    """Browser-captured GPS coordinates."""
    latitude: float = Field(..., description="Latitude in decimal degrees")
    longitude: float = Field(..., description="Longitude in decimal degrees")
    accuracy: Optional[float] = Field(None, description="Accuracy in meters")
    altitude: Optional[float] = Field(None, description="Altitude in meters")
    speed: Optional[float] = Field(None, description="Speed in m/s")
    heading: Optional[float] = Field(None, description="Heading in degrees")
    timestamp: Optional[datetime] = Field(None, description="GPS capture timestamp")


class GeoAddress(BaseModel):
    """Reverse-geocoded address components."""
    village: Optional[str] = None
    ward: Optional[str] = None
    taluka: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    assembly_constituency: Optional[str] = None
    lok_sabha_constituency: Optional[str] = None
    nearest_landmark: Optional[str] = None
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    raw_display: Optional[str] = None


# ---------------------------------------------------------------------------
# Evidence schemas
# ---------------------------------------------------------------------------

class EvidenceUpload(BaseModel):
    """Evidence attached to a complaint."""
    image_urls: List[str] = Field(default_factory=list)
    voice_url: Optional[str] = None
    video_url: Optional[str] = None
    text_description: Optional[str] = None


class EvidenceScore(BaseModel):
    """Calculated evidence score breakdown."""
    total: float = Field(..., ge=0, le=100, description="Overall evidence score 0-100")
    gps_present: bool = False
    photo_present: bool = False
    voice_present: bool = False
    image_metadata_valid: bool = False
    multiple_reports_nearby: bool = False
    duplicate_radius_match: bool = False
    location_accuracy_score: float = 0.0
    timestamp_valid: bool = False
    ai_confidence_score: float = 0.0
    breakdown: Dict[str, float] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Duplicate / Cluster schemas
# ---------------------------------------------------------------------------

class DuplicateCheckResult(BaseModel):
    """Result of duplicate radius search."""
    is_duplicate: bool = False
    cluster_id: Optional[str] = None
    cluster_uid: Optional[str] = None
    existing_report_count: int = 0
    nearest_distance_meters: Optional[float] = None
    merged_into_cluster: bool = False


class IssueClusterInfo(BaseModel):
    """Issue cluster summary for display."""
    id: str
    cluster_uid: str
    report_count: int
    category: str
    department: Optional[str] = None
    centroid_lat: float
    centroid_lng: float
    radius_meters: float
    severity: str
    village: Optional[str] = None
    ward: Optional[str] = None


# ---------------------------------------------------------------------------
# AI Preview schemas
# ---------------------------------------------------------------------------

class AIPreview(BaseModel):
    """AI-generated preview shown before complaint submission."""
    detected_department: Optional[str] = None
    detected_sector: Optional[str] = None
    detected_category: Optional[str] = None
    detected_location: Optional[GeoAddress] = None
    gps_accuracy: Optional[float] = None
    evidence_score: Optional[EvidenceScore] = None
    duplicate_probability: float = 0.0
    priority_prediction: float = 0.0
    estimated_resolution_days: Optional[int] = None
    ai_confidence: float = 0.0
    similar_complaints_nearby: int = 0


# ---------------------------------------------------------------------------
# Complaint Create / Request
# ---------------------------------------------------------------------------

class ComplaintCreateRequest(BaseModel):
    """Full complaint submission payload from citizen."""
    title: str = Field(..., min_length=3, max_length=300)
    description: Optional[str] = None
    category: str = Field(..., description="Complaint category")
    sector: Optional[str] = None

    # GPS
    gps: Optional[GPSLocation] = None

    # Geocoded address (populated by backend if not provided)
    address: Optional[GeoAddress] = None

    # Evidence
    evidence: Optional[EvidenceUpload] = None

    # Citizen info
    citizen_id: Optional[str] = None
    citizen_name: Optional[str] = None

    # Optional manual corrections
    manual_ward: Optional[str] = None
    manual_village: Optional[str] = None


# ---------------------------------------------------------------------------
# Complaint Response
# ---------------------------------------------------------------------------

class ComplaintResponse(BaseModel):
    """Full complaint response with all geo, evidence, and AI fields."""
    id: str
    complaint_uid: str
    title: str
    description: Optional[str] = None

    category: str
    sector: Optional[str] = None
    department: Optional[str] = None
    severity: str
    status: str

    # GPS
    gps_latitude: Optional[float] = None
    gps_longitude: Optional[float] = None
    gps_accuracy: Optional[float] = None
    gps_altitude: Optional[float] = None
    gps_speed: Optional[float] = None
    gps_heading: Optional[float] = None

    # Geocoded address
    village: Optional[str] = None
    ward: Optional[str] = None
    taluka: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    assembly_constituency: Optional[str] = None
    lok_sabha_constituency: Optional[str] = None
    nearest_landmark: Optional[str] = None

    # Verification
    verification_status: str
    verification_confidence: float
    evidence_score: float

    # Duplicate
    duplicate_probability: float
    cluster_id: Optional[str] = None
    cluster_uid: Optional[str] = None
    duplicate_count: int

    # AI
    ai_detected_category: Optional[str] = None
    ai_detected_department: Optional[str] = None
    ai_detected_sector: Optional[str] = None
    ai_confidence: float
    priority_prediction: float
    estimated_resolution_days: Optional[int] = None

    # Evidence
    images: Optional[List[str]] = None
    voice_url: Optional[str] = None

    # Citizen
    citizen_id: Optional[str] = None
    citizen_name: Optional[str] = None

    # Heatmap
    heatmap_key: Optional[str] = None

    # Timestamps
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# API wrapper response
# ---------------------------------------------------------------------------

class ComplaintSubmitResponse(BaseModel):
    """Response after submitting a complaint – includes AI preview data."""
    success: bool = True
    complaint: ComplaintResponse
    ai_preview: Optional[AIPreview] = None
    duplicate_info: Optional[DuplicateCheckResult] = None
    cluster_info: Optional[IssueClusterInfo] = None
    message: str = "Complaint submitted and verified successfully"


class ComplaintListResponse(BaseModel):
    """Paginated list of complaints."""
    complaints: List[ComplaintResponse]
    total: int
    page: int
    page_size: int


class ComplaintStatsResponse(BaseModel):
    """Complaint statistics for dashboard."""
    total_complaints: int = 0
    verified_complaints: int = 0
    pending_complaints: int = 0
    resolved_complaints: int = 0
    avg_evidence_score: float = 0.0
    total_clusters: int = 0

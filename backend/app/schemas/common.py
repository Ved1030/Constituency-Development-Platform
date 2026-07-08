"""
Common Pydantic response schemas for all non-complaint endpoints.

Each response model corresponds to a specific API endpoint group.
"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------

class DashboardSummary(BaseModel):
    """Aggregated counts for the dashboard hero cards."""
    total_complaints: int = 0
    open_complaints: int = 0
    in_progress_complaints: int = 0
    resolved_complaints: int = 0
    critical_complaints: int = 0
    departments_involved: int = 0


class DepartmentPerformance(BaseModel):
    """Per-department resolution metrics."""
    department: str
    total: int = 0
    resolved: int = 0
    avg_resolution_days: float = 0.0


class DashboardResponse(BaseModel):
    """Full dashboard payload."""
    summary: DashboardSummary
    department_performance: List[DepartmentPerformance] = Field(default_factory=list)
    village_stats: List[Dict[str, Any]] = Field(default_factory=list)
    recent_activity: List[Dict[str, Any]] = Field(default_factory=list)
    severity_breakdown: List[Dict[str, Any]] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Analytics
# ---------------------------------------------------------------------------

class AnalyticsResponse(BaseModel):
    """Aggregated analytics payload."""
    complaint_trends: List[Dict[str, Any]] = Field(default_factory=list)
    department_breakdown: List[Dict[str, Any]] = Field(default_factory=list)
    village_breakdown: List[Dict[str, Any]] = Field(default_factory=list)
    severity_distribution: List[Dict[str, Any]] = Field(default_factory=list)
    resolution_time_avg: List[Dict[str, Any]] = Field(default_factory=list)
    category_distribution: List[Dict[str, Any]] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Digital Twin
# ---------------------------------------------------------------------------

class DigitalTwinResponse(BaseModel):
    """Map / heatmap data for the digital twin view."""
    markers: List[Dict[str, Any]] = Field(default_factory=list)
    heatmap: List[Dict[str, Any]] = Field(default_factory=list)
    department_stats: List[Dict[str, Any]] = Field(default_factory=list)
    village_stats: List[Dict[str, Any]] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Priority Engine
# ---------------------------------------------------------------------------

class PriorityItem(BaseModel):
    """A single prioritised issue from the AI engine."""
    rank: int
    title: str
    category: str
    severity: str
    score: float
    affected_citizens: int
    village: str
    ai_confidence: float
    reason: str
    complaint_uid: str


class PriorityEngineResponse(BaseModel):
    """Output of the priority engine."""
    priorities: List[PriorityItem] = Field(default_factory=list)
    last_updated: str = ""


# ---------------------------------------------------------------------------
# Copilot
# ---------------------------------------------------------------------------

class CopilotResponse(BaseModel):
    """AI copilot context payload."""
    message: str = ""
    data: Dict[str, Any] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------

class ProjectResponse(BaseModel):
    """Paginated project list."""
    projects: List[Dict[str, Any]] = Field(default_factory=list)
    total: int = 0


# ---------------------------------------------------------------------------
# Recommendations
# ---------------------------------------------------------------------------

class RecommendationResponse(BaseModel):
    """Paginated recommendation list."""
    recommendations: List[Dict[str, Any]] = Field(default_factory=list)
    total: int = 0

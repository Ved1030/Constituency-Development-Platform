"""
Pydantic schemas for dataset API endpoints.

Includes MPLADS, Roads, Budget, and analytics responses.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class MpladsProjectOut(BaseModel):
    id: int
    mp_name: str
    constituency: str
    entitlement: float = 0
    fund_received_goi: float = 0
    amount_available: float = 0
    works_recommended_cost: float = 0
    works_sanctioned_cost: float = 0
    actual_expenditure_incurred: float = 0
    utilization_over_release: float = 0
    unspent_balance: float = 0


class MpladsProjectsResponse(BaseModel):
    projects: List[MpladsProjectOut] = Field(default_factory=list)
    total: int = 0


class MpladsSectorOut(BaseModel):
    state_ut: str
    railways_roads_pathways_bridges: float = 0
    education: float = 0
    drinking_water_facility: float = 0
    sanitation_public_health: float = 0
    other_public_facilities: float = 0
    others: float = 0


class MpladsSectorResponse(BaseModel):
    sectors: List[MpladsSectorOut] = Field(default_factory=list)
    total: int = 0


class MpladsUnspentOut(BaseModel):
    states_uts: str
    unspent_balance_crore: float = 0


class MpladsUnspentResponse(BaseModel):
    items: List[MpladsUnspentOut] = Field(default_factory=list)
    total: int = 0


class MpladsExpenditureOut(BaseModel):
    state: str
    exp_2016_17_incurred: float = 0
    exp_2016_17_completed_works: float = 0
    exp_2017_18_incurred: float = 0
    exp_2017_18_completed_works: float = 0
    exp_2018_19_incurred: float = 0
    exp_2018_19_completed_works: float = 0
    exp_2019_20_incurred: float = 0
    exp_2019_20_completed_works: float = 0


class MpladsExpenditureResponse(BaseModel):
    items: List[MpladsExpenditureOut] = Field(default_factory=list)
    total: int = 0


class MpladsFundsOut(BaseModel):
    year: str
    funds_allocated: float = 0


class MpladsFundsResponse(BaseModel):
    items: List[MpladsFundsOut] = Field(default_factory=list)


class RoadDataOut(BaseModel):
    id: int
    state: str
    year: int
    road_length_km: float = 0
    habs_completed: int = 0
    cumulative: int = 0
    proportion: float = 0
    proportionate_gains: float = 0
    expenditure_rs_cr: float = 0


class RoadDataResponse(BaseModel):
    items: List[RoadDataOut] = Field(default_factory=list)
    total: int = 0


class TransportOut(BaseModel):
    state_ut: str
    count_2023: int = 0
    count_2024: int = 0
    increase_decrease: int = 0
    percentage_share: float = 0


class TransportResponse(BaseModel):
    items: List[TransportOut] = Field(default_factory=list)
    total: int = 0


class CensusOut(BaseModel):
    name: str
    level: Optional[str] = None
    rural_urban: Optional[str] = None
    inhabited_villages: int = 0
    uninhabited_villages: int = 0
    number_of_towns: int = 0
    number_of_households: int = 0
    population_persons: int = 0
    population_males: int = 0
    population_females: int = 0
    area_sq_km: float = 0
    population_per_sq_km: int = 0


class CensusResponse(BaseModel):
    items: List[CensusOut] = Field(default_factory=list)
    total: int = 0


class BudgetOverview(BaseModel):
    total_entitlement: float = 0
    total_fund_received: float = 0
    total_expenditure: float = 0
    total_unspent: float = 0
    utilization_percentage: float = 0


class BudgetDetail(BaseModel):
    department: str
    allocated: float = 0
    spent: float = 0
    unspent: float = 0
    utilization: float = 0


class BudgetDashboardResponse(BaseModel):
    overview: BudgetOverview
    departments: List[BudgetDetail] = Field(default_factory=list)


class NeedsVsSpendItem(BaseModel):
    category: str
    need_score: float = 0
    current_spend: float = 0
    gap: float = 0
    priority: str = "medium"


class NeedsVsSpendResponse(BaseModel):
    items: List[NeedsVsSpendItem] = Field(default_factory=list)
    total_gap: float = 0
    top_priority: str = ""


class DatasetAnalyticsResponse(BaseModel):
    total_mplads_projects: int = 0
    total_road_length_km: float = 0
    total_schools_funded: int = 0
    total_census_households: int = 0
    total_census_population: int = 0
    avg_education_spending_pct: float = 0
    mplads_unspent_total_crore: float = 0


class MpladsBudgetSummary(BaseModel):
    """Budget summary for a specific constituency."""
    constituency: str
    mp_name: str = ""
    entitlement: float = 0
    fund_received: float = 0
    amount_available: float = 0
    works_cost: float = 0
    expenditure: float = 0
    unspent_balance: float = 0
    utilization_pct: float = 0


class ConstituencyBudgetResponse(BaseModel):
    summary: MpladsBudgetSummary
    sector_breakdown: List[Dict[str, Any]] = Field(default_factory=list)
    yearly_trend: List[Dict[str, Any]] = Field(default_factory=list)

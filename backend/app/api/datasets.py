"""API endpoints for imported government datasets."""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.dataset_schemas import (
    BudgetDashboardResponse,
    BudgetOverview,
    ConstituencyBudgetResponse,
    DatasetAnalyticsResponse,
    MpladsBudgetSummary,
    MpladsExpenditureResponse,
    MpladsFundsResponse,
    MpladsProjectsResponse,
    MpladsSectorResponse,
    MpladsUnspentResponse,
    NeedsVsSpendResponse,
    RoadDataResponse,
    TransportResponse,
)
from app.services.dataset_service import dataset_service

router = APIRouter()


@router.get("/mplads/projects", response_model=MpladsProjectsResponse)
async def list_mplads_projects(
    constituency: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
):
    """List MPLADS projects, optionally filtered by constituency."""
    return await dataset_service.get_mplads_projects(db, constituency=constituency, skip=skip, limit=limit)


@router.get("/mplads/sectors", response_model=MpladsSectorResponse)
async def list_mplads_sectors(
    state: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List MPLADS sector allocations, optionally filtered by state."""
    return await dataset_service.get_mplads_sectors(db, state=state)


@router.get("/mplads/unspent", response_model=MpladsUnspentResponse)
async def list_mplads_unspent(
    db: AsyncSession = Depends(get_db),
):
    """List MPLADS unspent balances by state."""
    return await dataset_service.get_mplads_unspent(db)


@router.get("/mplads/expenditure", response_model=MpladsExpenditureResponse)
async def list_mplads_expenditure(
    state: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List MPLADS expenditure by state across years."""
    return await dataset_service.get_mplads_expenditure(db, state=state)


@router.get("/mplads/funds", response_model=MpladsFundsResponse)
async def list_mplads_funds(
    db: AsyncSession = Depends(get_db),
):
    """List MPLADS yearly fund allocations."""
    return await dataset_service.get_mplads_funds(db)


@router.get("/roads", response_model=RoadDataResponse)
async def list_road_data(
    state: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
):
    """List road data, optionally filtered by state."""
    return await dataset_service.get_road_data(db, state=state, skip=skip, limit=limit)


@router.get("/transport", response_model=TransportResponse)
async def list_transport_data(
    db: AsyncSession = Depends(get_db),
):
    """List transport statistics by state."""
    return await dataset_service.get_transport_data(db)


@router.get("/budget/overview", response_model=BudgetDashboardResponse)
async def get_budget_overview(
    constituency: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Get budget overview from MPLADS data."""
    result = await dataset_service.get_budget_overview(db, constituency=constituency)
    return BudgetDashboardResponse(**result)


@router.get("/budget/constituency/{constituency}", response_model=ConstituencyBudgetResponse)
async def get_constituency_budget(
    constituency: str,
    db: AsyncSession = Depends(get_db),
):
    """Get detailed budget for a specific constituency."""
    return await dataset_service.get_constituency_budget(db, constituency)


@router.get("/needs-vs-spend", response_model=NeedsVsSpendResponse)
async def get_needs_vs_spend(
    constituency: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Get needs vs spend analysis."""
    return await dataset_service.get_needs_vs_spend(db, constituency=constituency)


@router.get("/analytics/summary", response_model=DatasetAnalyticsResponse)
async def get_dataset_analytics(
    db: AsyncSession = Depends(get_db),
):
    """Get aggregate analytics across all datasets."""
    return await dataset_service.get_analytics(db)

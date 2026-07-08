"""
ETL Pipeline: Import all CSV/XLSX datasets from backend/datasets/ into SQLite.

Run:  python -m app.etl.import_datasets
      (from the backend/ directory with venv activated)

Strategy:
1. Create all tables via SQLAlchemy ORM (Base.metadata.create_all)
2. Clear existing data
3. Read each dataset with pandas
4. Insert using raw INSERT statements matching ORM column names
"""

import logging
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

import sqlalchemy as sa
from app.core.config import settings
from app.database.base import Base
from app.models.dataset_models import (
    CensusData,
    EducationSpending,
    MpladsFundsAllocated,
    MpladsProject,
    MpladsSectorAllocation,
    MpladsStateExpenditure,
    MpladsUnspentBalance,
    RoadData,
    SchoolInfrastructure,
    TransportData,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("etl")

DATASETS_DIR = Path(__file__).resolve().parent.parent.parent / "datasets"


def _to(v, dtype=float):
    if pd.isna(v):
        return 0 if dtype is float else 0 if dtype is int else ""
    try:
        return dtype(v)
    except (ValueError, TypeError):
        return 0 if dtype in (float, int) else ""


def _clean_str(v):
    s = str(v).strip()
    return s.title() if s.lower() != s else s


def bulk_insert_sqlite(conn, table_name, rows, chunk=500):
    """Insert rows using executemany with dict params."""
    if not rows:
        return
    keys = list(rows[0].keys())
    cols = ", ".join(f'"{k}"' for k in keys)
    placeholders = ", ".join(f":{k}" for k in keys)
    sql = f'INSERT INTO "{table_name}" ({cols}) VALUES ({placeholders})'
    for i in range(0, len(rows), chunk):
        batch = rows[i:i + chunk]
        conn.execute(sa.text(sql), batch)


# ---------------------------------------------------------------------------
# 1. MPLADS Projects
# ---------------------------------------------------------------------------
def imp_mplads_projects():
    path = DATASETS_DIR / "4d2bc892-cd12-4f17-befa-aa7efb6e210b.csv"
    logger.info("  Reading %s", path.name)
    df = pd.read_csv(path)
    col_map = {
        "MP Name": "mp_name", "Constituency ": "constituency",
        "Entitlement": "entitlement", "FundReceivedGOI": "fund_received_goi",
        "AmountAvailable": "amount_available", "WorksRecommCost": "works_recommended_cost",
        "WSCost": "works_sanctioned_cost", "ActualExpenditureIncurred": "actual_expenditure_incurred",
        "UtilizationOverRelease": "utilization_over_release", "UnspentBalance": "unspent_balance",
    }
    df = df.rename(columns=col_map)
    rows = []
    for _, r in df.iterrows():
        rows.append({
            "mp_name": _clean_str(r.get("mp_name", "")),
            "constituency": str(r.get("constituency", "")).strip(),
            "entitlement": _to(r.get("entitlement")),
            "fund_received_goi": _to(r.get("fund_received_goi")),
            "amount_available": _to(r.get("amount_available")),
            "works_recommended_cost": _to(r.get("works_recommended_cost")),
            "works_sanctioned_cost": _to(r.get("works_sanctioned_cost")),
            "actual_expenditure_incurred": _to(r.get("actual_expenditure_incurred")),
            "utilization_over_release": _to(r.get("utilization_over_release")),
            "unspent_balance": _to(r.get("unspent_balance")),
        })
    return MpladsProject, rows


# ---------------------------------------------------------------------------
# 2. MPLADS Sector Allocations
# ---------------------------------------------------------------------------
def imp_mplads_sectors():
    path = DATASETS_DIR / "rs_Session240_as278_1.1.csv"
    logger.info("  Reading %s", path.name)
    df = pd.read_csv(path)
    col_map = {
        "State/ UT Name": "state_ut",
        "Railways, Roads, Pathways & Bridges": "railways_roads_pathways_bridges",
        "Education": "education",
        "Drinking Water Facility": "drinking_water_facility",
        "Sanitation & Public Health": "sanitation_public_health",
        "Other Public Facilities": "other_public_facilities",
        "Others": "others",
    }
    df = df.rename(columns=col_map)
    rows = []
    for _, r in df.iterrows():
        rows.append({
            k: _to(r.get(k)) if k != "state_ut" else str(r.get(k, "")).strip()
            for k in ["state_ut", "railways_roads_pathways_bridges", "education",
                      "drinking_water_facility", "sanitation_public_health",
                      "other_public_facilities", "others"]
        })
    return MpladsSectorAllocation, rows


# ---------------------------------------------------------------------------
# 3. MPLADS Unspent Balance
# ---------------------------------------------------------------------------
def imp_mplads_unspent():
    path = DATASETS_DIR / "RS_Session_247_AS_175.csv"
    logger.info("  Reading %s", path.name)
    df = pd.read_csv(path)
    col_map = {"States/UTs": "states_uts", "Unspent Balance (in Rs. Crore)": "unspent_balance_crore"}
    df = df.rename(columns=col_map)
    rows = [{"states_uts": str(r.get("states_uts", "")).strip(), "unspent_balance_crore": _to(r.get("unspent_balance_crore"))}
            for _, r in df.iterrows()]
    return MpladsUnspentBalance, rows


# ---------------------------------------------------------------------------
# 4. MPLADS Funds Allocated
# ---------------------------------------------------------------------------
def imp_mplads_funds():
    path = DATASETS_DIR / "RS_Session_263_AU_738_A_to_B.csv"
    logger.info("  Reading %s", path.name)
    df = pd.read_csv(path)
    col_map = {"Year": "year", "Funds Allocated": "funds_allocated"}
    df = df.rename(columns=col_map)
    rows = [{"year": str(r.get("year", "")).strip(), "funds_allocated": _to(r.get("funds_allocated"))}
            for _, r in df.iterrows()]
    return MpladsFundsAllocated, rows


# ---------------------------------------------------------------------------
# 5. MPLADS State Expenditure
# ---------------------------------------------------------------------------
def imp_mplads_expenditure():
    path = DATASETS_DIR / "RS-Session-251-AU3002-Annexure-I.csv"
    logger.info("  Reading %s", path.name)
    df = pd.read_csv(path)
    col_map = {
        "State": "state",
        "2016-17 - Expenditure - Incurred With (Rs. Crore)": "exp_2016_17_incurred",
        "2016-17 - Completed - Works": "exp_2016_17_completed_works",
        "2016-17 - Expenditure - Incurred With (Rs. Crore).1": "exp_2017_18_incurred",
        "2016-17 - Completed - Works.1": "exp_2017_18_completed_works",
        "2018-19 - Expenditure - Incurred With (Rs. Crore)": "exp_2018_19_incurred",
        "2018-19 - Completed - Works": "exp_2018_19_completed_works",
        "2019-20 - Expenditure - Incurred With (Rs. Crore)": "exp_2019_20_incurred",
        "2019-20 - Completed - Works": "exp_2019_20_completed_works",
    }
    df = df.rename(columns=col_map)
    keys = ["state", "exp_2016_17_incurred", "exp_2016_17_completed_works",
            "exp_2017_18_incurred", "exp_2017_18_completed_works",
            "exp_2018_19_incurred", "exp_2018_19_completed_works",
            "exp_2019_20_incurred", "exp_2019_20_completed_works"]
    rows = [{k: _to(r.get(k)) if k != "state" else str(r.get(k, "")).strip() for k in keys} for _, r in df.iterrows()]
    return MpladsStateExpenditure, rows


# ---------------------------------------------------------------------------
# 6. Road Data
# ---------------------------------------------------------------------------
def imp_road_data():
    path = DATASETS_DIR / "State_Road_Data.xlsx"
    logger.info("  Reading %s", path.name)
    df = pd.read_excel(path)
    col_map = {
        "State": "state", "Year": "year", "Road_Length_km": "road_length_km",
        "Habs_Completed": "habs_completed", "Cumulative": "cumulative",
        "Proportion": "proportion", "Proportionate_Gains": "proportionate_gains",
        "Expenditure_RsCr": "expenditure_rs_cr",
    }
    df = df.rename(columns=col_map)
    rows = []
    for _, r in df.iterrows():
        rows.append({
            "state": str(r.get("state", "")).strip(),
            "year": int(_to(r.get("year"), int)),
            "road_length_km": _to(r.get("road_length_km")),
            "habs_completed": int(_to(r.get("habs_completed"), int)),
            "cumulative": int(_to(r.get("cumulative"), int)),
            "proportion": _to(r.get("proportion")),
            "proportionate_gains": _to(r.get("proportionate_gains")),
            "expenditure_rs_cr": _to(r.get("expenditure_rs_cr")),
        })
    return RoadData, rows


# ---------------------------------------------------------------------------
# 7. Transport Data
# ---------------------------------------------------------------------------
def imp_transport_data():
    path = DATASETS_DIR / "Transport_2024_Annexure_44.csv"
    logger.info("  Reading %s", path.name)
    df = pd.read_csv(path)
    col_map = {
        "State/UT": "state_ut",
        "2023 (in Number)": "count_2023",
        "2024 (in Number)": "count_2024",
        "Increase/Decrease (in Number)": "increase_decrease",
        "Percentage Share in Total Increase and Decrease": "percentage_share",
    }
    df = df.rename(columns=col_map)
    rows = [{
        "state_ut": str(r.get("state_ut", "")).strip(),
        "count_2023": int(_to(r.get("count_2023"), int)),
        "count_2024": int(_to(r.get("count_2024"), int)),
        "increase_decrease": int(_to(r.get("increase_decrease"), int)),
        "percentage_share": _to(r.get("percentage_share")),
    } for _, r in df.iterrows()]
    return TransportData, rows


# ---------------------------------------------------------------------------
# 8. School Infrastructure
# ---------------------------------------------------------------------------
def imp_school_data():
    path = DATASETS_DIR / "RS_Session_267_AU_2091_D.1.ii_.csv"
    logger.info("  Reading %s", path.name)
    df = pd.read_csv(path)
    col_map = {
        "State/UT": "state_ut",
        "2023 - KVS": "kvs_2023", "2023 - NVS": "nvs_2023",
        "2024 - KVS": "kvs_2024", "2024 - NVS": "nvs_2024",
        "2025 - KVS": "kvs_2025", "2025 - NVS": "nvs_2025",
        "2025 - NCERT*": "ncert_2025", "Total": "total",
    }
    df = df.rename(columns=col_map)
    keys = ["state_ut", "kvs_2023", "nvs_2023", "kvs_2024", "nvs_2024",
            "kvs_2025", "nvs_2025", "ncert_2025", "total"]
    rows = [{k: _to(r.get(k)) if k != "state_ut" else str(r.get(k, "")).strip() for k in keys} for _, r in df.iterrows()]
    return SchoolInfrastructure, rows


# ---------------------------------------------------------------------------
# 9. Census Data
# ---------------------------------------------------------------------------
def imp_census_data():
    path = DATASETS_DIR / "A-1_NO_OF_VILLAGES_TOWNS_HOUSEHOLDS_POPULATION_AND_AREA.xlsx"
    logger.info("  Reading %s", path.name)
    df = pd.read_excel(path, sheet_name="Sheet1", header=None, skiprows=4)
    df.columns = [
        "state_code", "district_code", "sub_district_code", "level", "name",
        "rural_urban", "inhabited_villages", "uninhabited_villages",
        "number_of_towns", "number_of_households", "population_persons",
        "population_males", "population_females", "area_sq_km", "population_per_sq_km",
    ]
    rows = []
    for _, r in df.iterrows():
        rows.append({
            "state_code": str(r.get("state_code", "")).strip(),
            "district_code": str(r.get("district_code", "")).strip(),
            "sub_district_code": str(r.get("sub_district_code", "")).strip(),
            "level": str(r.get("level", "")).strip(),
            "name": str(r.get("name", "")).strip(),
            "rural_urban": str(r.get("rural_urban", "")).strip(),
            "inhabited_villages": int(_to(r.get("inhabited_villages"), int)),
            "uninhabited_villages": int(_to(r.get("uninhabited_villages"), int)),
            "number_of_towns": int(_to(r.get("number_of_towns"), int)),
            "number_of_households": int(_to(r.get("number_of_households"), int)),
            "population_persons": int(_to(r.get("population_persons"), int)),
            "population_males": int(_to(r.get("population_males"), int)),
            "population_females": int(_to(r.get("population_females"), int)),
            "area_sq_km": _to(r.get("area_sq_km")),
            "population_per_sq_km": int(_to(r.get("population_per_sq_km"), int)),
        })
    return CensusData, rows


# ---------------------------------------------------------------------------
# 10. Education Spending
# ---------------------------------------------------------------------------
def imp_education():
    path = DATASETS_DIR / "API_SE.XPD.TOTL.GD.ZS_DS2_en_csv_v2_3460.csv"
    logger.info("  Reading %s", path.name)
    df = pd.read_csv(path, skiprows=4)
    col_map = {
        "Country Name": "country_name",
        "Country Code": "country_code",
        "Indicator Name": "indicator_name",
        "Indicator Code": "indicator_code",
    }
    df = df.rename(columns=col_map)
    year_map = {str(y): f"year_{y}" for y in range(2015, 2024)}
    df = df.rename(columns=year_map)
    rows = []
    for _, r in df.iterrows():
        rows.append({
            "country_name": str(r.get("country_name", "")).strip(),
            "country_code": str(r.get("country_code", "")).strip(),
            "indicator_name": str(r.get("indicator_name", "")).strip(),
            "indicator_code": str(r.get("indicator_code", "")).strip(),
            **{f"year_{y}": _to(r.get(f"year_{y}")) for y in range(2015, 2024)},
        })
    return EducationSpending, rows


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
IMPORTERS = [
    ("MPLADS Projects", imp_mplads_projects),
    ("MPLADS Sectors", imp_mplads_sectors),
    ("MPLADS Unspent", imp_mplads_unspent),
    ("MPLADS Funds", imp_mplads_funds),
    ("MPLADS Expenditure", imp_mplads_expenditure),
    ("Road Data", imp_road_data),
    ("Transport Data", imp_transport_data),
    ("School Infrastructure", imp_school_data),
    ("Census Data", imp_census_data),
    ("Education Spending", imp_education),
]

ALL_MODELS = [
    MpladsProject, MpladsSectorAllocation, MpladsUnspentBalance,
    MpladsFundsAllocated, MpladsStateExpenditure, RoadData,
    TransportData, SchoolInfrastructure, CensusData, EducationSpending,
]


def main():
    db_url = settings.DATABASE_URL
    db_url = db_url.replace("sqlite+aiosqlite:///", "sqlite:///")
    logger.info("Connecting to: %s", db_url)

    sync_engine = sa.create_engine(db_url)

    # Step 1: Create all tables via ORM metadata
    Base.metadata.create_all(sync_engine)
    logger.info("Tables created/verified via ORM metadata")

    # Step 2: Clear existing data
    with sync_engine.begin() as conn:
        conn.execute(sa.text("PRAGMA journal_mode=WAL"))
        conn.execute(sa.text("PRAGMA synchronous=OFF"))
        conn.execute(sa.text("PRAGMA foreign_keys=OFF"))
        for model in ALL_MODELS:
            try:
                conn.execute(sa.text(f'DELETE FROM "{model.__tablename__}"'))
            except Exception as e:
                logger.warning("  Could not clear %s: %s", model.__tablename__, e)

    # Step 3: Import each dataset
    for name, fn in IMPORTERS:
        logger.info("Importing %s...", name)
        try:
            model_class, rows = fn()
            table_name = model_class.__tablename__
            with sync_engine.begin() as conn:
                bulk_insert_sqlite(conn, table_name, rows)
            logger.info("  -> %s rows", len(rows))
        except Exception as e:
            logger.error("  FAILED: %s", e)
            import traceback
            traceback.print_exc()
            raise

    # Step 4: Verify
    logger.info("")
    logger.info("=== Import Summary ===")
    with sync_engine.connect() as conn:
        for model in ALL_MODELS:
            count = conn.execute(sa.text(f'SELECT COUNT(*) FROM "{model.__tablename__}"')).scalar()
            logger.info("  %s: %d rows", model.__tablename__, count)


if __name__ == "__main__":
    main()

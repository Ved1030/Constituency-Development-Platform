"""
SQLAlchemy ORM models for imported government datasets.

Tables:
- dataset_mplads_projects: MPLADS project-level data by MP/constituency
- dataset_mplads_sector_allocations: State-wise MPLADS sector spending
- dataset_mplads_unspent_balance: State-wise unspent balance
- dataset_mplads_funds_allocated: Yearly MPLADS fund allocation
- dataset_mplads_state_expenditure: State-wise expenditure by year
- dataset_road_data: State-wise road length and expenditure
- dataset_transport_data: State-wise transport statistics
- dataset_school_infrastructure: KVS/NVS school allocations by state
- dataset_census: Village/town/household/population data
- dataset_education_spending: World Bank education spending (% of GDP)
"""

from sqlalchemy import Column, Float, Integer, String, Text

from app.database.base import Base


class MpladsProject(Base):
    __tablename__ = "dataset_mplads_projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    mp_name = Column(String(200), nullable=False, index=True)
    constituency = Column(String(200), nullable=False, index=True)
    entitlement = Column(Float, default=0)
    fund_received_goi = Column(Float, default=0)
    amount_available = Column(Float, default=0)
    works_recommended_cost = Column(Float, default=0)
    works_sanctioned_cost = Column(Float, default=0)
    actual_expenditure_incurred = Column(Float, default=0)
    utilization_over_release = Column(Float, default=0)
    unspent_balance = Column(Float, default=0)


class MpladsSectorAllocation(Base):
    __tablename__ = "dataset_mplads_sector_allocations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    state_ut = Column(String(200), nullable=False, index=True)
    railways_roads_pathways_bridges = Column(Float, default=0)
    education = Column(Float, default=0)
    drinking_water_facility = Column(Float, default=0)
    sanitation_public_health = Column(Float, default=0)
    other_public_facilities = Column(Float, default=0)
    others = Column(Float, default=0)


class MpladsUnspentBalance(Base):
    __tablename__ = "dataset_mplads_unspent_balance"

    id = Column(Integer, primary_key=True, autoincrement=True)
    states_uts = Column(String(200), nullable=False, index=True)
    unspent_balance_crore = Column(Float, default=0)


class MpladsFundsAllocated(Base):
    __tablename__ = "dataset_mplads_funds_allocated"

    id = Column(Integer, primary_key=True, autoincrement=True)
    year = Column(String(20), nullable=False)
    funds_allocated = Column(Float, default=0)


class MpladsStateExpenditure(Base):
    __tablename__ = "dataset_mplads_state_expenditure"

    id = Column(Integer, primary_key=True, autoincrement=True)
    state = Column(String(200), nullable=False, index=True)
    exp_2016_17_incurred = Column(Float, default=0)
    exp_2016_17_completed_works = Column(Float, default=0)
    exp_2017_18_incurred = Column(Float, default=0)
    exp_2017_18_completed_works = Column(Float, default=0)
    exp_2018_19_incurred = Column(Float, default=0)
    exp_2018_19_completed_works = Column(Float, default=0)
    exp_2019_20_incurred = Column(Float, default=0)
    exp_2019_20_completed_works = Column(Float, default=0)


class RoadData(Base):
    __tablename__ = "dataset_road_data"

    id = Column(Integer, primary_key=True, autoincrement=True)
    state = Column(String(200), nullable=False, index=True)
    year = Column(Integer, nullable=False)
    road_length_km = Column(Float, default=0)
    habs_completed = Column(Integer, default=0)
    cumulative = Column(Integer, default=0)
    proportion = Column(Float, default=0)
    proportionate_gains = Column(Float, default=0)
    expenditure_rs_cr = Column(Float, default=0)


class TransportData(Base):
    __tablename__ = "dataset_transport_data"

    id = Column(Integer, primary_key=True, autoincrement=True)
    state_ut = Column(String(200), nullable=False, index=True)
    count_2023 = Column(Integer, default=0)
    count_2024 = Column(Integer, default=0)
    increase_decrease = Column(Integer, default=0)
    percentage_share = Column(Float, default=0)


class SchoolInfrastructure(Base):
    __tablename__ = "dataset_school_infrastructure"

    id = Column(Integer, primary_key=True, autoincrement=True)
    state_ut = Column(String(200), nullable=False, index=True)
    kvs_2023 = Column(Float, default=0)
    nvs_2023 = Column(Float, default=0)
    kvs_2024 = Column(Float, default=0)
    nvs_2024 = Column(Float, default=0)
    kvs_2025 = Column(Float, default=0)
    nvs_2025 = Column(Float, default=0)
    ncert_2025 = Column(Float, default=0)
    total = Column(Float, default=0)


class CensusData(Base):
    __tablename__ = "dataset_census"

    id = Column(Integer, primary_key=True, autoincrement=True)
    state_code = Column(String(10), nullable=True)
    district_code = Column(String(10), nullable=True)
    sub_district_code = Column(String(10), nullable=True)
    level = Column(String(30), nullable=True)
    name = Column(String(200), nullable=False, index=True)
    rural_urban = Column(String(20), nullable=True)
    inhabited_villages = Column(Integer, default=0)
    uninhabited_villages = Column(Integer, default=0)
    number_of_towns = Column(Integer, default=0)
    number_of_households = Column(Integer, default=0)
    population_persons = Column(Integer, default=0)
    population_males = Column(Integer, default=0)
    population_females = Column(Integer, default=0)
    area_sq_km = Column(Float, default=0)
    population_per_sq_km = Column(Integer, default=0)


class EducationSpending(Base):
    __tablename__ = "dataset_education_spending"

    id = Column(Integer, primary_key=True, autoincrement=True)
    country_name = Column(String(200), nullable=False)
    country_code = Column(String(10), nullable=False, index=True)
    indicator_name = Column(String(300), nullable=True)
    indicator_code = Column(String(50), nullable=True)
    year_2015 = Column(Float, nullable=True)
    year_2016 = Column(Float, nullable=True)
    year_2017 = Column(Float, nullable=True)
    year_2018 = Column(Float, nullable=True)
    year_2019 = Column(Float, nullable=True)
    year_2020 = Column(Float, nullable=True)
    year_2021 = Column(Float, nullable=True)
    year_2022 = Column(Float, nullable=True)
    year_2023 = Column(Float, nullable=True)

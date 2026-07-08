# Constituency Development Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python" alt="Python 3.13" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Sarvam_AI-6366F1?style=for-the-badge&logo=robot" alt="Sarvam AI" />
  <img src="https://img.shields.io/badge/LangChain-0.3-1C3C3C?style=for-the-badge&logo=langchain" alt="LangChain" />
  <img src="https://img.shields.io/badge/FAISS-vector--search-0052CC?style=for-the-badge" alt="FAISS" />
</p>

<p align="center">
  <strong>AI-Powered Governance Platform for Indian Constituencies</strong><br />
  Bridging the gap between citizens and their elected representatives through intelligent complaint management, geospatial analytics, and data-driven policy recommendations.
</p>

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
  - [Citizen Portal](#-citizen-portal)
  - [MP Governance Portal](#-mp-governance-portal)
- [AI Capabilities](#-ai-capabilities)
- [Multilingual Support](#-multilingual-support)
- [Datasets Used](#-datasets-used)
- [Setup & Installation](#setup--installation)
- [Demo Credentials](#demo-credentials)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

The **Constituency Development Platform (CDP)** is a full-stack, AI-powered governance system designed for Indian constituencies. It connects citizens with their Members of Parliament (MPs) through a unified digital platform featuring intelligent complaint filing, real-time geospatial analytics, multilingual support, and an AI co-pilot for data-driven governance decisions.

The platform serves three pilot constituencies:
- **North Chennai** (Tamil Nadu) — Dr. Rajesh Sharma
- **South Mumbai** (Maharashtra) — Smt. Meera Desai
- **Central Surat** (Gujarat) — Shri Amit Joshi

---

## Problem Statement

Indian constituencies face several governance challenges:

1. **No unified complaint channel** — Citizens lack a transparent, trackable way to report issues.
2. **Data overload for MPs** — Thousands of complaints with no AI-powered triage or prioritization.
3. **Language barriers** — Complaints filed in 22+ scheduled languages cannot be processed uniformly.
4. **No geospatial intelligence** — MPs cannot visualize issue density, clusters, or infrastructure gaps.
5. **Limited data-driven policy** — Budget allocation and development planning rely on intuition rather than analytics.
6. **No community participation** — Citizens have no mechanism to vote on or prioritize development projects.
7. **Fragmented social intelligence** — MP offices cannot track public sentiment across social media platforms.

---

## Solution

The Constituency Development Platform solves these challenges with:

- **AI-powered complaint classification** — Automatic categorization, department detection, severity scoring, and duplicate detection.
- **Digital Twin maps** — Real-time geospatial visualization of all complaints with clustering, heatmaps, and overlay layers.
- **AI Co-pilot** — Natural language query interface for MPs to ask questions about their constituency data.
- **Multilingual pipeline** — Speech-to-text, translation, and text-to-speech supporting 17 Indian languages.
- **Priority Engine** — Data-driven urgency scoring combining AI confidence, evidence quality, community votes, and social sentiment.
- **Need vs Spend analysis** — Compare citizen demand against government spending to identify gaps.
- **Development Impact Simulator** — Model the projected impact of infrastructure projects before approval.
- **Social Intelligence** — Aggregate and analyze social media sentiment, trending issues, and public opinion.
- **Community Voting** — Citizens vote on development priorities, directly influencing policy decisions.
- **Government Schemes Integration** — MPLADS data integration for budget transparency and fund utilization tracking.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 16)                        │
│                                                                     │
│  App Router  │  shadcn/ui  │  Tailwind v4  │  Recharts  │  Leaflet │
│  Supabase Auth  │  i18n (10 langs)  │  React Query  │  Framer      │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP / REST
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI / Python 3.13)                  │
│                                                                     │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────────┐   │
│  │  API    │──│ Services │──│    AI     │──│   Database        │   │
│  │ Layer   │  │  Layer   │  │  Engine   │  │   (SQLAlchemy)    │   │
│  └─────────┘  └──────────┘  └───────────┘  └──────────────────┘   │
│     │              │              │                  │             │
│     ▼              ▼              ▼                  ▼             │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────────┐   │
│  │ 16 API  │  │ 18 Service│ │  11 AI    │  │  PostgreSQL via   │   │
│  │ Routers │  │  Modules  │ │  Modules  │  │  Supabase         │   │
│  └─────────┘  └──────────┘  └───────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │  Supabase    │    │  Sarvam AI   │    │   Apify /    │
  │  PostgreSQL  │    │  + Gemini    │    │  Social API  │
  └──────────────┘    └──────────────┘    └──────────────┘
```

### Key Design Decisions

- **No backend auth** — Authentication is handled entirely by Supabase Auth (client-side). The backend uses the Supabase service role key for database access.
- **Feature-based architecture** — Both frontend and backend are organized by feature, not by layer type.
- **Service layer pattern** — All business logic lives in `app/services/`, never in API route handlers.
- **AI abstraction** — The `AIService` facade routes to the configured provider (Sarvam AI primary, Gemini fallback).

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | Next.js 16 (App Router) | SSR, SSG, ISR, Edge Middleware |
| **UI Library** | React 19 | Component model |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first design system |
| **Charts & Maps** | Recharts, Leaflet, MapLibre GL | Analytics dashboards, GIS maps |
| **State / Data** | TanStack React Query, Axios | Server state, API client |
| **Authentication** | Supabase Auth (SSR) | Email/password auth, session management |
| **Internationalization** | Custom i18n (10 locales) | Multilingual UI |
| **Animations** | Framer Motion | Page transitions, micro-interactions |
| **Backend Framework** | FastAPI 0.115 | Async Python REST API |
| **Database** | PostgreSQL (Supabase) + SQLAlchemy 2.0 | ORM, migrations, async session |
| **AI / ML** | Sarvam AI, LangChain, FAISS, Sentence Transformers | Classification, RAG, vector search |
| **Speech AI** | Sarvam STT / TTS | Indian language speech processing |
| **Translation** | Sarvam Mayura model | 17 Indian language translation |
| **Social Scraping** | Apify | Social media data aggregation |
| **Maps** | Leaflet + OpenStreetMap + Esri Satellite | GIS visualization |
| **Vector Store** | FAISS | Semantic search over complaints |

---

## Features

### 👤 Citizen Portal

| Feature | Description |
|---------|-------------|
| **Complaint Filing** | File complaints with GPS location, photo evidence, and voice recordings in any of 17 Indian languages |
| **Complaint Tracking** | Real-time status tracking with timeline view |
| **Community Voting** | Vote on development proposals and prioritize community needs |
| **Nearby Issues** | Map view of all reported issues in the vicinity |
| **Government Schemes** | Browse and check eligibility for central/state government schemes |
| **Notifications** | Real-time updates on complaint status, voting outcomes, and project announcements |
| **Multilingual UI** | Full interface in English, Hindi, Tamil, Marathi, Gujarati, Bengali, Kannada, Malayalam, Punjabi, and Telugu |
| **Voice Complaints** | File complaints entirely by voice — record, automatically transcribe, and classify |
| **Profile Management** | Constituency assignment, contact information, preferences |

### 🏛️ MP Governance Portal

| Feature | Description |
|---------|-------------|
| **Executive Dashboard** | 6 KPI cards + Digital Twin preview + Need-vs-Spend + AI insights |
| **Digital Twin** | Interactive GIS map with complaint markers, heatmaps, satellite view, and 10+ overlay layers (schools, hospitals, projects, roads, water supply, electricity, drainage, population density, complaint density) |
| **AI Co-pilot** | Natural language chatbot that answers questions about constituency data, complaint patterns, and development metrics |
| **Complaint Intelligence** | AI-powered analytics: category distribution, severity breakdown, department trends, daily/weekly complaint patterns |
| **Priority Engine** | Data-driven priority scoring combining AI confidence, evidence quality, community sentiment, social media buzz, and historical patterns |
| **Need vs Spend** | Gap analysis comparing citizen demand against government spending across 8 departments |
| **Development Impact Simulator** | Model the projected impact of infrastructure projects (jobs created, infrastructure score, citizen satisfaction, risk factors) |
| **Budget Optimizer** | Department-wise budget allocation with utilization tracking, surplus/deficit analysis |
| **Social Intelligence** | Social media sentiment analysis, trending topics, ward-level issue detection, cross-platform feed (Twitter, Facebook, News, WhatsApp) |
| **Project Monitoring** | Track 10+ active development projects with status (on-track, delayed, at-risk, completed), budget tracking, timeline management |
| **Policy Recommendations** | AI-generated policy suggestions with budget estimates, beneficiary counts, implementation timelines |
| **MPLADS Integration** | Real MPLADS dataset integration for fund allocation, expenditure tracking, and unspent balance monitoring |
| **Analytics Suite** | Comprehensive analytics: trends, department breakdowns, ward-level statistics, AI confidence distribution |

---

## 🤖 AI Capabilities

| Capability | Module | Description |
|-----------|--------|-------------|
| **Complaint Classification** | `complaint_classifier.py` | Auto-categorizes complaints into 8 categories (road, water, electricity, sanitation, healthcare, education, safety, housing) |
| **Department Detection** | `ai_service.py`, `geo_engine.py` | Routes complaints to the correct government department based on text + category |
| **Severity Scoring** | `ai_service.py`, `geo_engine.py` | Predicts severity (critical/high/medium/low) combining text, evidence, duplicates |
| **Geo-verification** | `geo_engine.py` | Validates GPS quality (India bounds, accuracy, coordinate precision), detects constituency from coordinates, scores evidence 0-100 |
| **Duplicate Detection** | `geo_engine.py` | Finds similar complaints within geographic radius (25m/50m/100m), clusters duplicates |
| **Speech-to-Text** | `speech.py` | Transcribes audio in 17 Indian languages using Sarvam STT (Saarika model) |
| **Text-to-Speech** | `ai_service.py` | Synthesizes speech in Indian languages using Sarvam TTS |
| **Translation** | `translation.py` | Translates between 20 Indian languages using Sarvam Mayura model |
| **Image Analysis** | `vision.py` | Analyzes complaint images for issue type, severity, damage assessment, repair urgency |
| **AI Co-pilot** | `ai_service.py`, `copilot_service.py` | Natural language Q&A over constituency data |
| **Policy Recommendations** | `ai_service.py` | Generates structured policy suggestions from constituency data + complaint patterns |
| **RAG Pipeline** | `rag.py` | Retrieval-Augmented Generation using FAISS vector store + embeddings |
| **Summarization** | `ai_service.py` | Generates 1-2 sentence complaint summaries for quick review |
| **Keyword Extraction** | `ai_service.py` | Extracts relevant keywords from complaint text |
| **Social Sentiment** | `social_ai.py` | Sentiment analysis of social media posts aggregated by Apify |

---

## 🌐 Multilingual Support

The platform supports **10 UI languages** for the interface and **17 languages** for speech processing:

**UI Locales:**
- English (`en`), Hindi (`hi`), Tamil (`ta`), Marathi (`mr`), Gujarati (`gu`), Bengali (`bn`), Kannada (`kn`), Malayalam (`ml`), Punjabi (`pa`), Telugu (`te`)

**Speech Recognition (Sarvam STT):**
- 17 Indian languages + English, with auto-language detection.

**Translation Engine:**
- 20 Indian languages supported via Sarvam Mayura model with LLM fallback.

**Implementation:**
- Frontend: Custom i18n hook with locale JSON files per language
- Backend: AI-powered translation pipeline for complaint normalization
- Voice: End-to-end voice complaint flow (record → transcribe → classify → respond in native language)

---

## 📊 Datasets Used

The platform integrates real government datasets for data-driven governance:

| Dataset | Source | Format | Usage |
|---------|--------|--------|-------|
| **MPLADS Projects** | Rajya Sabha (Session 251, 240, 263, 247, 267) | CSV | Fund allocation, project tracking, expenditure analysis |
| **Census Data** | Census of India | XLSX | Village/town population, household counts, area statistics |
| **State Road Data** | Ministry of Road Transport | XLSX | Road infrastructure analysis |
| **Transport Statistics** | Rajya Sabha (Session 2024) | CSV | Transport infrastructure by state |
| **Education Spending** | World Bank API | CSV | Education expenditure as % of GDP |
| **Constituency Profiles** | Custom JSON | JSON | 3 constituency definitions with center, zoom, boundary files |
| **Mock Complaint Data** | Seed Service | Generated | 20+ demo complaints per constituency for testing |
| **Social Media Mock** | Social Service | Generated | Realistic social media posts with images for demo |

---

## Setup & Installation

### Prerequisites

- **Node.js** 20+ (recommended: 22+)
- **Python** 3.13+
- **npm** 10+
- **A Supabase project** (free tier works)

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev        # → http://localhost:3000
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase and AI provider credentials

# Start development server
uvicorn app.main:app --reload   # → http://localhost:8000
```

### Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to your project's **SQL Editor** and run the full migration at `docs/supabase-migration.sql`.
3. Disable email confirmation (recommended for demo):
   - **Authentication → Settings → Disable "Confirm email"**.
4. Copy your project URL, anon key, and service role key from **Project Settings → API**.
5. Seed MP accounts by calling the backend endpoint:
   ```bash
   curl -X POST http://localhost:8000/api/v1/seed/mp-users
   ```
   Or register the MP emails via the app signup form — the database trigger auto-promotes them to MP role.

### Environment Variables

**Frontend** (`frontend/.env.local`):
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API (use production URL for production builds)
# Development: http://localhost:8000
# Production: https://constituency-development-backend.onrender.com
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

**Backend** (`backend/.env`):
```env
PROJECT_NAME=Constituency Development Platform
VERSION=0.1.0
API_V1_PREFIX=/api/v1

# CORS — comma-separated list of allowed origins
BACKEND_CORS_ORIGINS=["http://localhost:3000","https://constituency-development-platform.vercel.app"]

# Supabase PostgreSQL
DATABASE_URL=postgresql+asyncpg://postgres:password@db.your-project.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI / Sarvam AI (primary AI provider)
DEFAULT_AI_PROVIDER=sarvam
SARVAM_API_KEY=your-sarvam-api-key
SARVAM_BASE_URL=https://api.sarvam.ai
SARVAM_MODEL=saarika:v2.5
SARVAM_TIMEOUT=60

# Gemini (fallback)
GOOGLE_API_KEY=your-google-api-key
GEMINI_MODEL=gemini-2.0-flash

# Vector Store
VECTOR_STORE_PATH=./data/vector_store

# Geo Verification
GEOAPIFY_KEY=

# Social Media Scraping (Apify)
APIFY_TOKEN=
APIFY_CACHE_TTL=900
APIFY_MAX_POSTS=100

# Logging
LOG_DIR=logs
LOG_LEVEL=INFO
DEBUG=False
```

### Quick Start

```bash
# 1. Start backend
cd backend && venv\Scripts\activate && uvicorn app.main:app --reload

# 2. Start frontend (in a new terminal)
cd frontend && npm run dev

# 3. Open http://localhost:3000
# 4. Register or use demo credentials
# 5. Seed complaint data: POST http://localhost:8000/api/v1/seed/ensure?constituency=North%20Chennai
```

---

## Demo Credentials

### MP Accounts

| Constituency | Email | Password | MP Name |
|-------------|-------|----------|---------|
| North Chennai | `mp.northchennai@gov.in` | `Password123` | Dr. Rajesh Sharma |
| South Mumbai | `mp.mumbai@gov.in` | `Password123` | Smt. Meera Desai |
| Central Surat | `mp.surat@gov.in` | `Password123` | Shri Amit Joshi |

> **Note:** These are demo credentials. In production, use proper authentication with email verification.

### Citizen Account

Register a new account via the signup page at `/register`. All new users default to the citizen role.

### How to Use MP Accounts

1. Start the backend and frontend servers.
2. Seed the MP users by calling:
   ```bash
   curl -X POST http://localhost:8000/api/v1/seed/mp-users
   ```
   (This requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to be set in backend `.env`.)
3. Alternatively, sign up via the app with an MP email — the database trigger auto-promotes the profile to MP role.
4. Log in at `/login` with the MP credentials above.
5. You will be redirected to the MP dashboard at `/mp/dashboard`.

---

## Project Structure

### Top-Level

```
constituency-development-platform/
├── frontend/                  # Next.js 16 application
├── backend/                   # FastAPI Python backend
├── docs/                      # Documentation, SQL migrations
├── scripts/                   # Utility scripts
├── AGENTS.md                  # AI agent conventions
└── README.md
```

### Frontend (`frontend/src/`)

```
src/
├── app/                       # Next.js App Router
│   ├── (landing)/             # Landing page route group
│   ├── login/                 # Single login page (citizen + MP)
│   ├── register/              # Registration page
│   ├── forgot-password/       # Password reset
│   ├── citizen/               # Citizen portal
│   │   ├── dashboard/         # Personalized dashboard with KPIs
│   │   ├── complaints/        # File and track complaints
│   │   ├── voting/            # Community voting on proposals
│   │   ├── nearby/            # Nearby issues map
│   │   ├── projects/          # Development project tracking
│   │   ├── schemes/           # Government schemes browser
│   │   ├── notifications/     # Real-time updates
│   │   ├── tracking/          # Complaint tracking
│   │   ├── profile/           # User profile
│   │   └── help/              # Help & support
│   └── mp/                    # MP governance portal
│       ├── dashboard/         # Executive dashboard (6 KPIs)
│       ├── constituency-twin/ # Digital Twin GIS map
│       ├── copilot/           # AI Co-pilot chat interface
│       ├── complaint-intelligence/ # AI complaint analytics
│       ├── priority-engine/   # Data-driven priority scoring
│       ├── need-vs-spend/     # Demand vs spending gap analysis
│       ├── simulator/         # Development impact simulator
│       ├── budget/            # Budget optimizer
│       ├── social-intelligence/ # Social media sentiment
│       ├── project-monitoring/ # Project status tracking
│       ├── projects/          # Development projects
│       ├── recommendations/   # AI policy recommendations
│       ├── analytics/         # Comprehensive analytics
│       ├── departments/       # Department management
│       └── settings/          # MP profile settings
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── common/                # Shared components
│   ├── auth/                  # Login, register, forgot password forms
│   ├── landing/               # Landing page sections
│   ├── dashboard/             # Dashboard widgets
│   ├── map/                   # Leaflet map components
│   ├── charts/                # Recharts wrappers
│   ├── ai/                    # AI interface components
│   ├── citizen/               # Citizen-specific components
│   ├── social-intelligence/   # Social media components
│   └── simulator/             # Impact simulator UI
├── features/                  # Feature modules
│   ├── copilot/               # AI Co-pilot logic
│   ├── priority-engine/       # Priority scoring UI
│   ├── need-vs-spend/         # Gap analysis charts
│   ├── impact-simulator/      # Simulation models
│   ├── project-comparison/    # Project comparison UI
│   └── multilingual/          # i18n framework
├── hooks/                     # Custom React hooks
├── services/
│   ├── api/                   # Backend API client (axios)
│   ├── auth/                  # Supabase auth service
│   └── supabase/              # Supabase data service
├── types/                     # TypeScript type definitions
├── data/                      # Static data & mock data
└── locales/                   # i18n translations (10 languages)
    ├── en/                    # English (804 keys)
    ├── hi/                    # Hindi
    ├── ta/                    # Tamil
    ├── mr/                    # Marathi
    ├── gu/                    # Gujarati
    ├── bn/                    # Bengali
    ├── kn/                    # Kannada
    ├── ml/                    # Malayalam
    ├── pa/                    # Punjabi
    └── te/                    # Telugu
```

### Backend (`backend/app/`)

```
app/
├── main.py                    # FastAPI entry point
├── api/                       # 16 API route modules
│   ├── complaints.py          # Complaint CRUD + search
│   ├── analytics.py           # Analytics endpoints
│   ├── digital_twin.py        # Digital Twin GIS data
│   ├── copilot.py             # AI Co-pilot chat
│   ├── simulator.py           # Impact simulator
│   ├── dashboard.py           # Dashboard aggregation
│   ├── social.py              # Social media intelligence
│   ├── recommendation.py      # Policy recommendations
│   ├── projects.py            # Development projects
│   ├── budget.py              # Budget optimizer
│   ├── constituency.py        # Constituency profiles
│   ├── datasets.py            # Government dataset queries
│   ├── speech.py              # Speech-to-text + classification
│   ├── seed.py                # Demo data seeding
│   └── health.py              # Liveness check
├── ai/                        # 11 AI modules
│   ├── ai_service.py          # Central AI facade (536 lines)
│   ├── geo_engine.py          # Geo-verification engine (725 lines)
│   ├── complaint_classifier.py
│   ├── speech.py              # STT / TTS pipeline
│   ├── translation.py         # Multilingual translation
│   ├── vision.py              # Image analysis
│   ├── multilingual.py        # Multilingual framework
│   ├── impact_simulator.py    # Project impact modeling
│   ├── recommendation_engine.py
│   ├── urgency_engine.py      # Urgency scoring
│   └── rag.py                 # RAG + FAISS pipeline
├── services/                  # 18 business logic modules
│   ├── complaint_service.py
│   ├── digital_twin_service.py
│   ├── copilot_service.py
│   ├── social_service.py      # Social media aggregation (1036 lines)
│   ├── social_ai.py           # Social sentiment analysis
│   ├── social_normalizer.py   # Social data normalization
│   ├── analytics_service.py
│   ├── dashboard_service.py
│   ├── simulator_service.py
│   ├── budget_service.py
│   ├── project_service.py
│   ├── recommendation_service.py
│   ├── dataset_service.py
│   ├── seed_service.py        # Auto-generates demo data
│   ├── user_service.py        # MP user seeding
│   ├── geo_verification_service.py
│   ├── apify_client.py        # Social media scraping client
│   └── speech_service.py
├── models/                    # SQLAlchemy ORM models
│   ├── complaint.py           # Complaint + IssueCluster
│   └── dataset_models.py      # CensusData, Mplads*, RoadData, etc.
├── schemas/                   # Pydantic request/response models
├── core/                      # Config, exceptions, logger
├── database/                  # Engine, session, base
├── data/                      # Static constituency data
├── middleware/                 # Custom ASGI middleware
└── utils/                     # Shared utilities
```

---

## API Documentation

When the backend is running, interactive API docs are available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Health** | `/api/v1/health` | GET | Liveness check |
| **Complaints** | `/api/v1/complaints/` | POST | Submit complaint with AI geo-verification |
| | `/api/v1/complaints/` | GET | List complaints (paginated, filterable) |
| | `/api/v1/complaints/stats` | GET | Complaint statistics |
| | `/api/v1/complaints/{uid}` | GET | Single complaint detail |
| **Digital Twin** | `/api/v1/digital-twin/` | GET | Full GIS data (markers, heatmap, stats) |
| | `/api/v1/digital-twin/complaints/{uid}` | GET | Complaint detail for intelligence panel |
| **Dashboard** | `/api/v1/dashboard/` | GET | Full dashboard payload |
| | `/api/v1/dashboard/summary` | GET | Summary KPI counts |
| **Analytics** | `/api/v1/analytics/` | GET | Full analytics payload |
| | `/api/v1/analytics/trends` | GET | Complaint trends over time |
| | `/api/v1/analytics/departments` | GET | Department breakdown |
| **Copilot** | `/api/v1/copilot/context` | GET | Constituency context for co-pilot |
| | `/api/v1/copilot/query` | POST | Ask AI co-pilot a question |
| **Simulator** | `/api/v1/simulator/projects` | GET | Projects available for simulation |
| | `/api/v1/simulator/simulate` | POST | Run impact simulation |
| **Recommendations** | `/api/v1/recommendations/` | GET | AI policy recommendations |
| **Projects** | `/api/v1/projects/` | GET | List development projects |
| | `/api/v1/projects/{id}` | GET | Single project detail |
| **Social** | `/api/v1/social/feed` | GET | Social media feed (paginated) |
| | `/api/v1/social/trending` | GET | Trending topics & wards |
| | `/api/v1/social/sync` | POST | Force sync social media data |
| **Constituency** | `/api/v1/constituency/` | GET | List all constituencies |
| | `/api/v1/constituency/{name}` | GET | Full constituency profile |
| **Datasets** | `/api/v1/datasets/mplads/projects` | GET | MPLADS project data |
| | `/api/v1/datasets/needs-vs-spend` | GET | Needs vs spend analysis |
| | `/api/v1/datasets/budget/overview` | GET | Budget overview |
| **Speech** | `/api/v1/speech/transcribe` | POST | Audio → text transcription |
| | `/api/v1/speech/classify` | POST | Classify complaint from text |
| | `/api/v1/speech/languages` | GET | Supported languages |
| **Seed** | `/api/v1/seed/ensure` | POST | Seed demo data for constituency |
| | `/api/v1/seed/mp-users` | POST | Create demo MP accounts |

---

## Screenshots

> Screenshots will be added as the platform evolves.

| Page | Preview |
|------|---------|
| Landing Page | `<!-- TODO: Add screenshot -->` |
| Citizen Dashboard | `<!-- TODO: Add screenshot -->` |
| MP Dashboard | `<!-- TODO: Add screenshot -->` |
| Digital Twin | `<!-- TODO: Add screenshot -->` |
| Need vs Spend | `<!-- TODO: Add screenshot -->` |
| Complaint Intelligence | `<!-- TODO: Add screenshot -->` |
| Social Intelligence | `<!-- TODO: Add screenshot -->` |
| AI Copilot | `<!-- TODO: Add screenshot -->` |
| Raise Complaint | `<!-- TODO: Add screenshot -->` |
| Community Voting | `<!-- TODO: Add screenshot -->` |

---

## Deployment

### Frontend (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Connect your GitHub repository to Vercel.
2. Set the **Root Directory** to `frontend`.
3. Add the following environment variables in Vercel dashboard:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_API_URL` | `https://constituency-development-backend.onrender.com` |

4. Deploy — zero configuration required.

### Backend (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3.13
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
4. Add all environment variables listed below.
5. Deploy.

#### Required Environment Variables (Backend)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Supabase PostgreSQL connection string |
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `BACKEND_CORS_ORIGINS` | ✅ | `["https://constituency-development-platform.vercel.app"]` |
| `SARVAM_API_KEY` | ✅ | Sarvam AI API key |
| `GOOGLE_API_KEY` | ⬜ | Gemini fallback |
| `APIFY_TOKEN` | ⬜ | Social media scraping |
| `GEOAPIFY_KEY` | ⬜ | Reverse geocoding |

#### Required Environment Variables (Frontend)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `NEXT_PUBLIC_API_URL` | ✅ | Backend URL (`https://constituency-development-backend.onrender.com`) |

### Supabase

- Hosted PostgreSQL database with built-in auth, RLS, and auto-scaling.
- Run `docs/supabase-migration.sql` in the Supabase SQL Editor.
- Configure Authentication settings (disable email confirmation for demo).

### Production Checklist

- ✅ No hardcoded localhost URLs — all URLs use environment variables
- ✅ CORS configured to allow only production + localhost origins
- ✅ Security headers enabled (X-Content-Type-Options, X-Frame-Options, etc.)
- ✅ Rate limiting enabled in production (200 req/min per IP)
- ✅ All API errors return structured JSON, never HTML
- ✅ Request timeout (30s) with automatic retry (1 retry)
- ✅ Frontend loading skeletons for all route segments
- ✅ Error boundaries with retry buttons at route group level
- ✅ Production logging (no debug logs, no console.warn)
- ✅ Health check endpoint at `/health` and `/api/v1/health`

---

## License

MIT

---

<p align="center">
  Built for better governance in India
</p>

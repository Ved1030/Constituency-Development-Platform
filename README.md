# Constituency Development Platform

AI-Powered Decision Support System for MPs.

## Architecture

```
├── frontend/       # Next.js 15 + App Router + shadcn/ui + TypeScript
├── backend/        # FastAPI + SQLAlchemy + LangChain + Gemini + FAISS
├── docs/           # Documentation
├── .gitignore
├── AGENTS.md       # Team conventions
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, React Leaflet |
| Backend | FastAPI, Python 3.13, SQLAlchemy, PostgreSQL, LangChain, Gemini, FAISS |
| AI | LangChain chains, Gemini LLM, FAISS vector search, RAG pipeline |

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.13+
- A Supabase project (free tier works)

### Frontend
```bash
cd frontend
npm install
npm run dev        # → http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload   # → http://localhost:8000
```

### API Docs
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Authentication Setup

This app uses **Supabase Auth** for authentication. No mock auth remains.

### 1. Supabase Project
Create a free project at [supabase.com](https://supabase.com).

### 2. Database Migration
Open your Supabase project's **SQL Editor** and run the full migration at:
```
docs/supabase-migration.sql
```
This creates:
- `profiles` table (linked to `auth.users`)
- Auto-create profile on signup (trigger)
- `updated_at` trigger
- Row-Level Security (RLS) policies
- Indexes on email, role, and constituency
- MP seed data (safe — only updates if profiles exist)

### 3. Environment Variables

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql+asyncpg://postgres:password@db.your-project.supabase.co:5432/postgres
```

### 4. Disable Email Confirmation (Recommended)
In your Supabase dashboard:
1. Go to **Authentication → Settings**
2. Turn **OFF** "Confirm email"
3. Click **Save**

This allows users to sign in immediately after signup without email verification.

### 5. Seed MP Accounts
After the first user with an MP email signs up via the app, run this in Supabase SQL Editor to promote them:
```sql
UPDATE public.profiles SET role = 'mp'
WHERE email IN ('mp.northchennai@gov.in', 'mp.mumbai@gov.in', 'mp.surat@gov.in');
```
Or use the migration script's built-in safe version (already handles existence checks).

### Role System
- **No role selection during signup** — all users default to `citizen`
- **MP access** determined by email whitelist in the `profiles` table
- After login, users are redirected to `/mp/dashboard` (if `role = 'mp'`) or `/citizen/dashboard` (default)

### Route Protection
- `/citizen/*` routes — require authentication, accessible by all authenticated users
- `/mp/*` routes — require authentication + `role = 'mp'`
- `/login`, `/register`, `/forgot-password` — public; authenticated users are redirected to their dashboard

## Project Structure

### Frontend (`frontend/src/`)
- `app/` — Next.js App Router routes: `(landing)`, `citizen/`, `mp/`, `login/`
- `components/` — Reusable UI: `ui/`, `common/`, `dashboard/`, `ai/`, etc.
- `features/` — Self-contained feature modules (copilot, simulator, etc.)
- `services/` — API client calls
- `data/` — Static JSON data files
- `lib/`, `utils/`, `types/` — Shared utilities and types

### Backend (`backend/app/`)
- `api/` — Feature-separated HTTP endpoints
- `ai/` — LangChain + Gemini + FAISS logic
- `services/` — Business logic layer
- `models/` — SQLAlchemy ORM models
- `schemas/` — Pydantic request/response schemas
- `database/` — DB session, engine, Alembic migrations
- `core/` — Application settings
- `middleware/` — Custom ASGI middleware

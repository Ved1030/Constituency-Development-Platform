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

# Constituency Development Platform – Backend

## Architecture

```
backend/
├── app/
│   ├── __init__.py          # Package marker
│   ├── main.py              # FastAPI app entry point
│   ├── api/                 # API router aggregation
│   ├── ai/                  # AI/ML integration layer
│   ├── core/                # Settings, config, logging
│   ├── config/              # Additional configuration
│   ├── database/            # DB connection, session, migrations
│   ├── middleware/          # Custom ASGI middleware
│   ├── models/              # ORM models (SQLAlchemy / Beanie)
│   ├── routes/              # Route modules (health, etc.)
│   ├── schemas/             # Pydantic request/response schemas
│   ├── services/            # Business logic layer
│   ├── static/              # Static files
│   └── utils/               # Shared utilities
├── tests/                   # Pytest test suite
├── requirements.txt
└── .env
```

## Getting started

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Visit http://localhost:8000 for the API, http://localhost:8000/docs for Swagger.

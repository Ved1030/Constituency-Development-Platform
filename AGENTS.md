<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Constituency Development Platform — Team Conventions

## Branch Strategy

```
main                    # Production-ready, protected
├── develop             # Integration branch, protected
    ├── feature/<name>  # New features (e.g., feature/complaint-classifier)
    ├── fix/<name>      # Bug fixes
    ├── refactor/<name> # Code restructuring
    └── docs/<name>     # Documentation only
```

- Always branch off `develop`.
- PR into `develop` — squash-merge with a descriptive message.
- Release branches (`release/*`) merge into `main` and `develop`.

---

## Naming Conventions

### Frontend
| Entity | Convention | Example |
|--------|-----------|---------|
| Directories | `kebab-case` | `impact-simulator/` |
| Components | `PascalCase` | `ComplaintCard.tsx` |
| Files (non-component) | `kebab-case` | `api-client.ts` |
| Functions/Variables | `camelCase` | `fetchComplaints()` |
| Types/Interfaces | `PascalCase` | `ComplaintStatus` |

### Backend
| Entity | Convention | Example |
|--------|-----------|---------|
| Files | `snake_case` | `complaint_service.py` |
| Classes | `PascalCase` | `ComplaintService` |
| Functions | `snake_case` | `classify_complaint()` |
| Routes | `snake_case` | `router = APIRouter()` |
| DB Models | `PascalCase` | `Complaint` |
| Schemas | `PascalCase` | `ComplaintCreate` |

---

## Import Order

### Frontend (TS/TSX)
1. React / Next.js
2. Third-party libraries
3. `@/components/…`
4. `@/features/…`
5. `@/services/…`
6. `@/hooks/…`
7. `@/lib/…`
8. `@/types/…`
9. `@/utils/…`
10. Relative imports (`./…`)

### Backend (Python)
1. Standard library
2. Third-party (fastapi, sqlalchemy, etc.)
3. `app.core.…`
4. `app.models.…`
5. `app.schemas.…`
6. `app.services.…`
7. `app.ai.…`
8. `app.api.…`
9. `app.database.…`
10. `app.utils.…`

---

## API Pattern (Backend)

Every endpoint module in `app/api/` follows this structure:

```python
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()

@router.get("/")
async def list_():
    """List all items."""
    return []

@router.post("/")
async def create_():
    """Create an item."""
    return {}

@router.get("/{id}")
async def get_(id: int):
    """Get item by ID."""
    return {}

@router.put("/{id}")
async def update_(id: int):
    """Update item by ID."""
    return {}

@router.delete("/{id}")
async def delete_(id: int):
    """Delete item by ID."""
    return {}
```

- Endpoints call service layer — never put business logic in the route handler.
- Use Pydantic schemas for request/response validation.

---

## Architecture Rules

### Backend
1. **API layer** (`app/api/`) → handles HTTP, calls services.
2. **Service layer** (`app/services/`) → business logic, calls models/ai.
3. **AI layer** (`app/ai/`) → LangChain chains, Gemini calls, FAISS queries.
4. **Database layer** (`app/database/`) → session, engine, migrations.
5. **Models** (`app/models/`) → SQLAlchemy ORM classes only.
6. **Schemas** (`app/schemas/`) → Pydantic request/response models only.
7. No circular imports. Services import models/schemas, not vice versa.

### Frontend
1. **App Router** → route groups: `(landing)`, `citizen/`, `mp/`, `login/`.
2. **Components** → `components/ui/` (shadcn), `components/common/` (shared), feature-specific.
3. **Features** → self-contained modules with their own hooks, utils, types.
4. **Services** → API client calls only (axios/fetch).
5. **Data** → static JSON in `data/`, replaced by DB calls later.

---

## TypeScript Path Aliases

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

Use `@/components/…`, `@/lib/…`, `@/features/…`, etc.

---

## Running the Project

```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
```

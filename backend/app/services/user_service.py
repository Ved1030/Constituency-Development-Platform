"""Business logic for user seeding via Supabase Admin API."""

import logging

import httpx

from app.core.config import settings

logger = logging.getLogger("app.services.user")

MP_ACCOUNTS = [
    {
        "email": "mp.northchennai@gov.in",
        "password": "Password123",
        "name": "Dr. Rajesh Sharma",
        "constituency": "North Chennai",
    },
    {
        "email": "mp.mumbai@gov.in",
        "password": "Password123",
        "name": "Smt. Meera Desai",
        "constituency": "South Mumbai",
    },
    {
        "email": "mp.surat@gov.in",
        "password": "Password123",
        "name": "Shri Amit Joshi",
        "constituency": "Central Surat",
    },
]


async def seed_mp_accounts() -> dict:
    """Create MP users in Supabase Auth if they don't already exist.

    Uses the Supabase Service Role Key to call the Admin API.
    The DB trigger `on_profile_mp_promotion` will auto-set their role to 'mp'.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        return {"error": "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured"}

    created = []
    already_exists = []
    failed = []

    async with httpx.AsyncClient(timeout=15) as client:
        for account in MP_ACCOUNTS:
            resp = await client.post(
                f"{settings.SUPABASE_URL}/auth/v1/admin/users",
                headers={
                    "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
                    "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "email": account["email"],
                    "password": account["password"],
                    "email_confirm": True,
                    "user_metadata": {
                        "name": account["name"],
                        "constituency": account["constituency"],
                    },
                },
            )

            if resp.status_code == 200:
                created.append(account["email"])
                logger.info("Created MP user: %s", account["email"])
            elif resp.status_code == 422:
                already_exists.append(account["email"])
                logger.info("MP user already exists: %s", account["email"])
            else:
                failed.append({"email": account["email"], "status": resp.status_code, "detail": resp.text})
                logger.warning("Failed to create MP user %s: %s", account["email"], resp.text)

    return {
        "created": created,
        "already_exists": already_exists,
        "failed": failed,
        "total": len(MP_ACCOUNTS),
    }

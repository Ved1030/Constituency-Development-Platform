"""
AI-powered complaint and cluster summarization.

Provides concise summaries for:
- Individual complaints (1-2 sentences)
- Complaint clusters (collective issue summary)
- MP briefing summaries
"""

import logging
from typing import Any, Dict, List, Optional

from app.ai.ai_service import AIService

logger = logging.getLogger("app.ai.summary")


async def summarize_complaint(title: str, description: str) -> str:
    """
    Summarize a single complaint into 1-2 concise sentences.

    Captures: what the issue is, where, and urgency level.
    """
    logger.info("Summarizing complaint: %s", title[:60])
    return await AIService.summarize(title, description)


async def summarize_cluster(
    cluster_title: str,
    report_count: int,
    sample_descriptions: List[str],
) -> str:
    """
    Summarize a cluster of duplicate complaints.

    Combines multiple citizen reports into a single collective issue statement.
    """
    logger.info("Summarizing cluster: %s (%d reports)", cluster_title, report_count)
    return await AIService.summarize_cluster(cluster_title, report_count, sample_descriptions)


async def generate_mp_briefing(
    complaints_summary: Dict[str, Any],
    time_period: str = "last 7 days",
) -> str:
    """
    Generate a concise briefing for an MP/MLA about recent complaints.
    """
    import json
    data_str = json.dumps(complaints_summary, default=str, indent=2)[:3000]

    prompt = (
        f"Generate a concise MP briefing for {time_period}:\n\n"
        f"{data_str}\n\n"
        f"Include: top issues, severity trends, departments needing attention, "
        f"and 2-3 recommended actions. Keep it under 300 words."
    )

    return await AIService.generate_text(
        prompt,
        system_prompt="You are a political briefing assistant. Be concise, factual, and actionable.",
        temperature=0.3,
    )

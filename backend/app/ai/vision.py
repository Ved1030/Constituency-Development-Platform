"""
AI vision module for image analysis of complaint evidence.

Currently uses placeholder implementation — architecture supports
swapping to Gemini Vision or any vision-capable provider by
changing DEFAULT_AI_PROVIDER.

Future: real damage assessment, severity from photos, etc.
"""

import logging
from typing import Any, Dict, Optional

from app.ai.ai_service import AIService

logger = logging.getLogger("app.ai.vision")


async def analyze_complaint_image(
    image_bytes: bytes,
    context: str = "",
    mime_type: str = "image/jpeg",
) -> Dict[str, Any]:
    """
    Analyse an image attached to a complaint.

    Identifies:
    - Issue type visible in the image
    - Severity assessment
    - Estimated affected area
    - Any visible hazards

    Returns dict with: issue_type, severity, affected_area, hazards, confidence.
    """
    logger.info("Analyzing complaint image | bytes=%d | context=%s", len(image_bytes), context[:50])
    return await AIService.analyze_image(image_bytes, context, mime_type)


async def assess_damage(
    image_bytes: bytes,
    department: str = "",
    mime_type: str = "image/jpeg",
) -> Dict[str, Any]:
    """
    Assess infrastructure damage from an image.

    Specialised view for department-specific damage assessment.
    """
    context = f"Department context: {department}" if department else ""
    result = await analyze_complaint_image(image_bytes, context, mime_type)

    # Enrich with department-specific assessment
    result["department"] = department
    result["repair_urgency"] = _estimate_repair_urgency(result.get("severity", "medium"))
    return result


def _estimate_repair_urgency(severity: str) -> str:
    """Map severity to repair urgency."""
    mapping = {
        "critical": "immediate",
        "high": "within_48h",
        "medium": "within_1_week",
        "low": "scheduled",
    }
    return mapping.get(severity, "scheduled")

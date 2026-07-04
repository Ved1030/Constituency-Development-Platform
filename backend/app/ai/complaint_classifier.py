"""
AI-powered complaint classification and categorization.

This module provides convenience wrappers around AIService for
complaint classification workflows.  Business logic can import
from here or directly from AIService.
"""

import logging
from typing import Any, Dict, List, Optional

from app.ai.ai_service import AIService

logger = logging.getLogger("app.ai.complaint_classifier")


async def classify_complaint(
    title: str,
    description: str,
    location: str = "",
    language: str = "en",
) -> Dict[str, Any]:
    """
    Classify a complaint using AI.

    Returns dict with: category, department, severity, sector, keywords, confidence.
    """
    return await AIService.classify_complaint(title, description, location, language)


async def detect_department(
    title: str,
    description: str,
    category: str = "",
) -> Dict[str, Any]:
    """
    Detect the responsible government department.

    Returns dict with: department, sector, estimated_days, confidence.
    """
    return await AIService.detect_department(title, description, category)


async def detect_severity(
    title: str,
    description: str,
    category: str = "",
    duplicate_count: int = 0,
) -> Dict[str, Any]:
    """
    Predict complaint severity using AI.

    Returns dict with: severity, priority_score, reasoning, confidence.
    """
    return await AIService.detect_severity(title, description, category, duplicate_count)


async def extract_keywords(text: str) -> List[str]:
    """Extract relevant keywords from complaint text."""
    return await AIService.extract_keywords(text)

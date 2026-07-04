"""
Centralized prompt templates for all AI interactions.

RULES:
- Every prompt lives here — never inline in business logic.
- Each prompt is a function returning a string (or messages list).
- Prompts accept data via parameters, never hardcode values.
- When swapping providers, only the model changes — prompts stay.
"""

from typing import Any, Dict, List, Optional


# ═══════════════════════════════════════════════════════════════════════════
# System prompts
# ═══════════════════════════════════════════════════════════════════════════

SYSTEM_PROMPT_GENERAL = (
    "You are an AI assistant for the Constituency Development Platform of India. "
    "You help citizens file, track, and resolve civic complaints. "
    "You are helpful, accurate, and respond in the language the user prefers. "
    "Always return valid JSON when the user asks for structured output."
)

SYSTEM_PROMPT_CLASSIFIER = (
    "You are an expert civic-complaint classifier for Indian municipal governance. "
    "Analyse the given complaint text and return a JSON object with: "
    "category, department, severity, sector, keywords, and confidence. "
    "Categories: road, water, electricity, healthcare, education, agriculture, "
    "sanitation, women_safety, public_transport, other. "
    "Departments: PWD, Water Department, Health Department, Education Department, "
    "Electricity Board, Municipal Corporation, Agriculture Department, Police, "
    "Transport Department, General Administration. "
    "Severity: critical, high, medium, low. "
    "Respond ONLY with the JSON object, no extra text."
)

SYSTEM_PROMPT_TRANSLATION = (
    "You are a professional translator specialising in Indian languages. "
    "Translate the given text accurately while preserving meaning, tone, "
    "and any proper nouns. Do not add explanations — return only the translation."
)

SYSTEM_PROMPT_SUMMARY = (
    "You are a complaint summarisation engine. "
    "Condense the given complaint into a concise 1-2 sentence summary "
    "that captures: what the issue is, where it is, and the urgency level. "
    "Return only the summary text, no extra formatting."
)

SYSTEM_PROMPT_KEYWORDS = (
    "You are a keyword extraction engine. "
    "Extract 5-10 relevant keywords from the complaint text that would help "
    "in searching, categorising, and finding similar complaints. "
    "Return a JSON array of lowercase keyword strings."
)

SYSTEM_PROMPT_COPILOT = (
    "You are an AI governance copilot for Indian elected representatives (MPs/MLAs). "
    "You help analyse constituency data, prioritise complaints, suggest policy actions, "
    "and prepare briefings. Be concise, data-driven, and actionable."
)

SYSTEM_PROMPT_RECOMMENDATION = (
    "You are a development recommendation engine for Indian constituencies. "
    "Based on complaint patterns, demographics, and budget data, suggest "
    "3-5 actionable development projects. Return JSON with: title, description, "
    "estimated_budget, priority, expected_impact, department."
)


# ═══════════════════════════════════════════════════════════════════════════
# Complaint classification
# ═══════════════════════════════════════════════════════════════════════════

def classify_complaint_prompt(
    title: str,
    description: str,
    location: str = "",
    language: str = "en",
) -> str:
    """Build the classification prompt for a complaint."""
    return (
        f"Classify this civic complaint:\n\n"
        f"Title: {title}\n"
        f"Description: {description}\n"
        f"Location: {location}\n\n"
        f"Return JSON: {{"
        f'"category": "...", '
        f'"department": "...", '
        f'"severity": "...", '
        f'"sector": "...", '
        f'"keywords": ["..."], '
        f'"confidence": 0.0-1.0'
        f"}}"
    )


def detect_department_prompt(
    title: str,
    description: str,
    category: str = "",
) -> str:
    """Build the department detection prompt."""
    return (
        f"Detect the correct government department for this complaint:\n\n"
        f"Category: {category}\n"
        f"Title: {title}\n"
        f"Description: {description}\n\n"
        f"Return JSON: {{"
        f'"department": "...", '
        f'"sector": "...", '
        f'"estimated_days": <number>, '
        f'"confidence": 0.0-1.0'
        f"}}"
    )


def detect_severity_prompt(
    title: str,
    description: str,
    category: str = "",
    duplicate_count: int = 0,
) -> str:
    """Build the severity prediction prompt."""
    return (
        f"Predict the severity of this civic complaint:\n\n"
        f"Title: {title}\n"
        f"Description: {description}\n"
        f"Category: {category}\n"
        f"Number of similar complaints nearby: {duplicate_count}\n\n"
        f"Severity levels:\n"
        f"- critical: Immediate danger to life/health, infrastructure collapse\n"
        f"- high: Affects large population, worsening rapidly\n"
        f"- medium: Affects daily life, needs timely attention\n"
        f"- low: Minor inconvenience, can be scheduled\n\n"
        f"Return JSON: {{"
        f'"severity": "critical|high|medium|low", '
        f'"priority_score": 0-100, '
        f'"reasoning": "...", '
        f'"confidence": 0.0-1.0'
        f"}}"
    )


# ═══════════════════════════════════════════════════════════════════════════
# Summarization
# ═══════════════════════════════════════════════════════════════════════════

def summarize_complaint_prompt(title: str, description: str) -> str:
    """Build the complaint summarization prompt."""
    return (
        f"Summarise this complaint in 1-2 concise sentences:\n\n"
        f"Title: {title}\n"
        f"Description: {description}"
    )


def summarize_cluster_prompt(
    cluster_title: str,
    report_count: int,
    sample_descriptions: List[str],
) -> str:
    """Build a prompt to summarise a cluster of duplicate complaints."""
    desc_text = "\n".join(f"- {d}" for d in sample_descriptions[:5])
    return (
        f"{report_count} citizens reported similar issues:\n\n"
        f"Cluster title: {cluster_title}\n"
        f"Sample reports:\n{desc_text}\n\n"
        f"Write a 2-sentence summary of the collective issue."
    )


# ═══════════════════════════════════════════════════════════════════════════
# Keyword extraction
# ═══════════════════════════════════════════════════════════════════════════

def extract_keywords_prompt(text: str) -> str:
    """Build the keyword extraction prompt."""
    return (
        f"Extract 5-10 relevant keywords from this text:\n\n"
        f"{text}\n\n"
        f"Return a JSON array of lowercase keyword strings only."
    )


# ═══════════════════════════════════════════════════════════════════════════
# Translation
# ═══════════════════════════════════════════════════════════════════════════

def translation_prompt(
    text: str,
    source_language: str,
    target_language: str,
) -> str:
    """Build the translation prompt (fallback when native API unavailable)."""
    return (
        f"Translate the following text from {source_language} to {target_language}.\n"
        f"Return ONLY the translated text, nothing else.\n\n"
        f"Text: {text}"
    )


# ═══════════════════════════════════════════════════════════════════════════
# AI Copilot
# ═══════════════════════════════════════════════════════════════════════════

def copilot_prompt(
    user_query: str,
    context: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, str]]:
    """Build the copilot conversation messages."""
    system = SYSTEM_PROMPT_COPILOT
    user_msg = user_query

    if context:
        import json
        ctx_str = json.dumps(context, default=str, indent=2)[:3000]
        user_msg = f"Context data:\n{ctx_str}\n\nUser question: {user_query}"

    return [
        {"role": "system", "content": system},
        {"role": "user", "content": user_msg},
    ]


# ═══════════════════════════════════════════════════════════════════════════
# Recommendations
# ═══════════════════════════════════════════════════════════════════════════

def generate_recommendation_prompt(
    constituency_data: Dict[str, Any],
    complaint_patterns: Dict[str, Any],
    budget_info: Optional[Dict[str, Any]] = None,
) -> str:
    """Build the recommendation generation prompt."""
    import json
    patterns_str = json.dumps(complaint_patterns, default=str, indent=2)[:2000]
    budget_str = json.dumps(budget_info, default=str, indent=2)[:1000] if budget_info else "Not available"

    return (
        f"Analyse these constituency complaint patterns and suggest 3-5 "
        f"development projects:\n\n"
        f"Complaint patterns:\n{patterns_str}\n\n"
        f"Budget info:\n{budget_str}\n\n"
        f"Return JSON array: [{{"
        f'"title": "...", '
        f'"description": "...", '
        f'"estimated_budget": "₹X Lakh/Crore", '
        f'"priority": "high|medium|low", '
        f'"expected_impact": "...", '
        f'"department": "..."'
        f"}}]"
    )


# ═══════════════════════════════════════════════════════════════════════════
# Policy generation
# ═══════════════════════════════════════════════════════════════════════════

def generate_policy_prompt(
    topic: str,
    data: Optional[Dict[str, Any]] = None,
) -> str:
    """Build a policy suggestion prompt."""
    data_str = ""
    if data:
        import json
        data_str = f"\nRelevant data:\n{json.dumps(data, default=str, indent=2)[:2000]}\n"

    return (
        f"Suggest a policy action for the following topic in an Indian "
        f"constituency context:\n\n"
        f"Topic: {topic}{data_str}\n"
        f"Return JSON: {{"
        f'"policy_title": "...", '
        f'"objective": "...", '
        f'"key_actions": ["..."], '
        f'"estimated_impact": "...", '
        f'"implementation_timeline": "..."'
        f"}}"
    )


# ═══════════════════════════════════════════════════════════════════════════
# Vision (image analysis)
# ═══════════════════════════════════════════════════════════════════════════

def analyze_image_prompt(context: str = "") -> str:
    """Build the image analysis prompt for complaint evidence."""
    base = (
        "Analyse this image as civic complaint evidence. Identify:\n"
        "1. What issue is visible (pothole, waterlogging, garbage, damage, etc.)\n"
        "2. Severity assessment (critical/high/medium/low)\n"
        "3. Estimated affected area\n"
        "4. Any visible hazards\n"
        "Return JSON: {"
        '"issue_type": "...", '
        '"severity": "...", '
        '"affected_area": "...", '
        '"hazards": ["..."], '
        '"confidence": 0.0-1.0'
        "}"
    )
    if context:
        return f"{base}\n\nAdditional context: {context}"
    return base

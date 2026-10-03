import json
import re
import logging
from typing import Any, Dict
from pydantic import ValidationError
from app.schemas import AIStructuredOutput
from app.utils.errors import AIParseError

logger = logging.getLogger("firstpr.ai.analyzer")


def extract_and_parse_json(raw_text: str) -> Dict[str, Any]:
    """
    Extracts JSON substring from LLM response even if surrounded by Markdown formatting or reasoning.
    """
    text = raw_text.strip()

    # 1. Direct parse attempt
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 2. Extract from markdown code fences: ```json ... ```
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fence_match:
        try:
            return json.loads(fence_match.group(1))
        except json.JSONDecodeError:
            pass

    # 3. Find outer-most braces { ... }
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        snippet = text[first_brace : last_brace + 1]
        try:
            return json.loads(snippet)
        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse outer brace JSON: {e}")

    raise AIParseError(f"Model output could not be parsed as JSON: {raw_text[:250]}...")


def validate_ai_output(data: Dict[str, Any]) -> AIStructuredOutput:
    """
    Validates the parsed dictionary against the Pydantic AIStructuredOutput schema.
    Performs safe normalization if minor fields are missing.
    """
    # Safe normalization of common minor model omissions
    if "recommended_issue" in data and isinstance(data["recommended_issue"], dict):
        rec = data["recommended_issue"]
        if "match_score" in rec:
            try:
                rec["match_score"] = max(0, min(100, int(rec["match_score"])))
            except (ValueError, TypeError):
                rec["match_score"] = 85
        if not rec.get("difficulty"):
            rec["difficulty"] = "Beginner"
        if not rec.get("contribution_type"):
            rec["contribution_type"] = "Bug Fix / Improvement"

    try:
        return AIStructuredOutput(**data)
    except ValidationError as ve:
        logger.error(f"Pydantic validation error on AI output: {ve}")
        raise AIParseError(f"AI response failed schema validation: {ve.errors()[:2]}")

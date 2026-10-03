import pytest
from app.ai.analyzer import extract_and_parse_json, validate_ai_output
from app.utils.errors import AIParseError


def test_extract_direct_json():
    raw = '{"recommended_issue": {"number": 1, "title": "Test", "difficulty": "Beginner", "match_score": 90, "contribution_type": "Bug Fix", "reason": "Good fit", "skills_required": ["Python"], "relevant_files": []}, "why_this_issue": ["Reason 1"], "what_you_will_learn": ["Testing"], "roadmap": [{"step": 1, "title": "Setup", "description": "Do setup", "files": []}], "risks": [], "first_action": "Open test.py"}'
    parsed = extract_and_parse_json(raw)
    assert parsed["recommended_issue"]["number"] == 1

    validated = validate_ai_output(parsed)
    assert validated.recommended_issue.number == 1
    assert validated.recommended_issue.match_score == 90


def test_extract_markdown_fenced_json():
    raw = """
Here is the recommended issue:
```json
{
  "recommended_issue": {
    "number": 42,
    "title": "Fix logging error",
    "difficulty": "Beginner",
    "match_score": 95,
    "contribution_type": "Bug Fix",
    "reason": "Clear problem",
    "skills_required": ["Python"],
    "relevant_files": [{"path": "app/log.py", "reason": "Fix bug"}]
  },
  "why_this_issue": ["Great fit"],
  "what_you_will_learn": ["Logging"],
  "roadmap": [{"step": 1, "title": "Clone", "description": "Clone repo", "files": []}],
  "risks": [],
  "first_action": "Open app/log.py"
}
```
Hope this helps!
"""
    parsed = extract_and_parse_json(raw)
    assert parsed["recommended_issue"]["number"] == 42
    validated = validate_ai_output(parsed)
    assert validated.recommended_issue.relevant_files[0].path == "app/log.py"


def test_invalid_json_raises_parse_error():
    with pytest.raises(AIParseError):
        extract_and_parse_json("This is purely text without any JSON structure.")


def test_missing_fields_validation():
    # Incomplete schema missing roadmap
    bad_data = {
        "recommended_issue": {
            "number": 1,
            "title": "T",
            "difficulty": "Beginner",
            "match_score": 50,
            "contribution_type": "Bug",
            "reason": "R",
        },
        "why_this_issue": ["R1"],
        "first_action": "Do something",
    }
    with pytest.raises(AIParseError):
        validate_ai_output(bad_data)

"""
Curated real repository snapshots for resilient development fallback.
Used when unauthenticated public IP rate limit is exhausted on GitHub,
ensuring hackathon judges can test the full end-to-end flow without requiring immediate API keys.
"""

from typing import Any, Dict, Optional

DEMO_SNAPSHOTS: Dict[str, Dict[str, Any]] = {
    "pallets/flask": {
        "repository": {
            "name": "flask",
            "owner": "pallets",
            "full_name": "pallets/flask",
            "description": "The Python micro framework for building web applications.",
            "stars": 69200,
            "forks": 16100,
            "open_issues_count": 48,
            "default_branch": "main",
            "html_url": "https://github.com/pallets/flask",
            "primary_language": "Python",
            "languages": {"Python": 982000, "HTML": 12000, "CSS": 8000},
        },
        "readme": """# Flask
Flask is a lightweight WSGI web application framework. It is designed to make getting started quick and easy, with the ability to scale up to complex applications. It began as a simple wrapper around Werkzeug and Jinja and has become one of the most popular Python web application frameworks.
## Installing
Install and update using pip:
```bash
pip install -U Flask
```
## A Simple Example
```python
from flask import Flask
app = Flask(__name__)
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```
""",
        "contributing": """# How to contribute to Flask
Thank you for considering contributing to Flask!
- Report bugs and request features in the issue tracker.
- Start with issues labeled 'good first issue' or 'help wanted'.
- Run tests with pytest before submitting a pull request.
- Ensure all commits follow conventional commit formats.
""",
        "key_paths": [
            "src/flask/__init__.py",
            "src/flask/app.py",
            "src/flask/blueprints.py",
            "src/flask/cli.py",
            "src/flask/config.py",
            "src/flask/ctx.py",
            "src/flask/globals.py",
            "src/flask/helpers.py",
            "src/flask/json/__init__.py",
            "src/flask/logging.py",
            "src/flask/sessions.py",
            "src/flask/signals.py",
            "src/flask/templating.py",
            "src/flask/typing.py",
            "src/flask/wrappers.py",
            "tests/test_basic.py",
            "tests/test_blueprints.py",
            "tests/test_cli.py",
            "tests/test_config.py",
            "tests/test_helpers.py",
            "tests/test_json.py",
            "tests/test_logging.py",
            "pyproject.toml",
            "README.md",
            "CONTRIBUTING.md",
        ],
        "candidate_issues": [
            {
                "number": 5421,
                "title": "Improve error message when custom json encoder fails serialization",
                "body_snippet": "Currently, when a custom JSON serializer fails inside jsonify(), the exception output loses the underlying TypeError details. It would be much clearer for developers if we wrapped or chained the original exception.",
                "labels": ["good first issue", "enhancement", "json"],
                "comments_count": 4,
                "html_url": "https://github.com/pallets/flask/issues/5421",
                "is_beginner_labelled": True,
            },
            {
                "number": 5398,
                "title": "Add type annotations to CLI runner test helpers",
                "body_snippet": "Several helper fixtures in tests/test_cli.py lack complete PEP 484 type hints. Adding TypedDict or parameter annotations would improve IDE type-checking for contributors.",
                "labels": ["good first issue", "typing", "tests"],
                "comments_count": 2,
                "html_url": "https://github.com/pallets/flask/issues/5398",
                "is_beginner_labelled": True,
            },
            {
                "number": 5352,
                "title": "Clarify blueprint url_prefix inheritance behavior in documentation",
                "body_snippet": "The documentation in blueprints.rst does not clearly explain how nested blueprint url_prefixes combine when registered with multiple levels. A concise example in the docs would help beginners.",
                "labels": ["documentation", "good first issue"],
                "comments_count": 3,
                "html_url": "https://github.com/pallets/flask/issues/5352",
                "is_beginner_labelled": True,
            },
            {
                "number": 5290,
                "title": "Warn when debug mode is enabled in production server environments",
                "body_snippet": "Inspect request environment flags to issue a UserWarning when DEBUG is enabled under non-development WSGI servers.",
                "labels": ["help wanted", "core"],
                "comments_count": 6,
                "html_url": "https://github.com/pallets/flask/issues/5290",
                "is_beginner_labelled": False,
            },
        ],
    },
    "fastapi/fastapi": {
        "repository": {
            "name": "fastapi",
            "owner": "fastapi",
            "full_name": "fastapi/fastapi",
            "description": "FastAPI framework, high performance, easy to learn, fast to code, ready for production",
            "stars": 78000,
            "forks": 6500,
            "open_issues_count": 120,
            "default_branch": "master",
            "html_url": "https://github.com/fastapi/fastapi",
            "primary_language": "Python",
            "languages": {"Python": 995000, "Markdown": 15000},
        },
        "readme": """# FastAPI
FastAPI framework, high performance, easy to learn, fast to code, ready for production.
Key Features:
- Fast: Very high performance, on par with NodeJS and Go.
- Fast to code: Increase speed to develop features by about 200% to 300%.
- Fewer bugs: Reduce about 40% of human induced errors.
- Intuitive: Great editor support. Completion everywhere. Less time debugging.
- Easy: Designed to be easy to use and learn. Less time reading docs.
""",
        "contributing": """# Contributing to FastAPI
You can contribute by:
- Helping others with questions.
- Reviewing pull requests.
- Contributing translations.
- Adding regression tests for existing issues.
""",
        "key_paths": [
            "fastapi/__init__.py",
            "fastapi/applications.py",
            "fastapi/background.py",
            "fastapi/datastructures.py",
            "fastapi/encoders.py",
            "fastapi/exceptions.py",
            "fastapi/params.py",
            "fastapi/routing.py",
            "fastapi/utils.py",
            "tests/test_tutorial/test_first_steps.py",
            "tests/test_exceptions.py",
            "tests/test_encoders.py",
            "pyproject.toml",
            "README.md",
        ],
        "candidate_issues": [
            {
                "number": 11020,
                "title": "Fix docstring typo in HTTPException headers parameter description",
                "body_snippet": "In fastapi/exceptions.py, the docstring for HTTPException states 'headers to send with respones' instead of 'responses'.",
                "labels": ["documentation", "good first issue"],
                "comments_count": 1,
                "html_url": "https://github.com/fastapi/fastapi/issues/11020",
                "is_beginner_labelled": True,
            },
            {
                "number": 10984,
                "title": "Add test case for custom JSONResponse with status_code 204 No Content",
                "body_snippet": "Ensure that returning a 204 status with custom response classes correctly strips response body without raising encoding warnings.",
                "labels": ["tests", "help wanted"],
                "comments_count": 3,
                "html_url": "https://github.com/fastapi/fastapi/issues/10984",
                "is_beginner_labelled": False,
            },
        ],
    },
}


def get_demo_snapshot(owner: str, repo: str) -> Optional[Dict[str, Any]]:
    key = f"{owner.lower()}/{repo.lower()}"
    return DEMO_SNAPSHOTS.get(key)

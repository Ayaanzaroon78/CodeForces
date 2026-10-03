import pytest
from unittest.mock import AsyncMock, patch
from app.github.issues import IssuesService
from app.utils.errors import NoIssuesFoundError


@pytest.mark.asyncio
async def test_filter_candidate_issues_removes_prs():
    issues_service = IssuesService()
    raw_data = [
        {"number": 1, "title": "Good bug fix", "body": "Details here", "labels": [{"name": "bug"}], "comments": 2},
        {"number": 2, "title": "Pull Request #2", "pull_request": {"url": "..."}, "labels": []},
        {"number": 3, "title": "Add docs", "body": "Need documentation", "labels": [{"name": "good first issue"}], "comments": 1},
    ]

    with patch("app.github.issues.github_client.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = raw_data
        candidates = await issues_service.get_candidate_issues("owner", "repo")

        # Must filter out PR #2
        numbers = [c["number"] for c in candidates]
        assert 2 not in numbers
        assert 1 in numbers
        assert 3 in numbers
        # Candidate with "good first issue" should be prioritized at top
        assert candidates[0]["number"] == 3


@pytest.mark.asyncio
async def test_empty_issues_raises_error():
    issues_service = IssuesService()
    with patch("app.github.issues.github_client.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = []
        with pytest.raises(NoIssuesFoundError):
            await issues_service.get_candidate_issues("owner", "repo")

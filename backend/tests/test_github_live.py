import pytest
from app.github.repository import repository_service
from app.github.issues import issues_service
from app.utils.errors import GitHubRateLimitError


@pytest.mark.asyncio
async def test_live_github_metadata_fetch():
    try:
        details = await repository_service.get_repository_details("encode", "httpx")
        assert details["name"] == "httpx"
        assert details["owner"] == "encode"
        assert details["stars"] > 1000
    except GitHubRateLimitError:
        pytest.skip("GitHub unauthenticated rate limit reached on current IP; test passed rate limit handling.")


@pytest.mark.asyncio
async def test_live_github_issues_fetch():
    try:
        issues = await issues_service.get_candidate_issues("encode", "httpx")
        assert len(issues) > 0
        assert "number" in issues[0]
        assert "title" in issues[0]
    except GitHubRateLimitError:
        pytest.skip("GitHub unauthenticated rate limit reached on current IP; test passed rate limit handling.")

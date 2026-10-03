import time
import logging
from typing import Any, Dict, Optional
import httpx
from app.config import settings
from app.utils.errors import RepositoryNotFoundError, GitHubRateLimitError, AppError

logger = logging.getLogger("firstpr.github")


class GitHubClient:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._cache_ttl = 900  # 15 minutes TTL

    def _get_headers(self) -> Dict[str, str]:
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "FirstPR-AI-Assistant/1.0",
        }
        if settings.GITHUB_TOKEN and settings.GITHUB_TOKEN.strip():
            headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN.strip()}"
        return headers

    async def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Any:
        cache_key = f"{endpoint}:{str(sorted(params.items()) if params else '')}"
        now = time.time()

        if cache_key in self._cache:
            entry = self._cache[cache_key]
            if now - entry["timestamp"] < self._cache_ttl:
                logger.info(f"GitHub cache hit for {endpoint}")
                return entry["data"]

        url = f"{self.base_url}{endpoint}"
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                response = await client.get(url, headers=self._get_headers(), params=params)
            except httpx.TimeoutException:
                raise AppError("GITHUB_TIMEOUT", "GitHub API timed out. Please try again in a few moments.", status_code=504)
            except httpx.RequestError as exc:
                raise AppError("GITHUB_NETWORK_ERROR", f"Network error contacting GitHub API: {str(exc)}", status_code=502)

            # Check rate limiting
            remaining = response.headers.get("x-ratelimit-remaining")
            if remaining == "0" or response.status_code == 403 and "rate limit" in response.text.lower():
                raise GitHubRateLimitError()

            if response.status_code == 404:
                raise RepositoryNotFoundError(f"Resource not found on GitHub at '{endpoint}'.")

            if response.status_code >= 400:
                raise AppError(
                    "GITHUB_API_ERROR",
                    f"GitHub API returned error ({response.status_code}): {response.text[:200]}",
                    status_code=response.status_code,
                )

            data = response.json()
            self._cache[cache_key] = {"timestamp": now, "data": data}
            return data


github_client = GitHubClient()

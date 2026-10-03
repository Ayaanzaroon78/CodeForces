import base64
import logging
from typing import Any, Dict, List, Optional
from app.github.client import github_client

logger = logging.getLogger("firstpr.github.repository")


class RepositoryService:
    async def get_repository_details(self, owner: str, repo: str) -> Dict[str, Any]:
        """Fetch general repository metadata."""
        data = await github_client.get(f"/repos/{owner}/{repo}")
        return {
            "name": data.get("name"),
            "owner": data.get("owner", {}).get("login"),
            "full_name": data.get("full_name"),
            "description": data.get("description") or "No description provided.",
            "stars": data.get("stargazers_count", 0),
            "forks": data.get("forks_count", 0),
            "open_issues_count": data.get("open_issues_count", 0),
            "default_branch": data.get("default_branch", "main"),
            "html_url": data.get("html_url"),
            "primary_language": data.get("language"),
        }

    async def get_languages(self, owner: str, repo: str) -> Dict[str, int]:
        """Fetch repository language breakdown."""
        try:
            return await github_client.get(f"/repos/{owner}/{repo}/languages")
        except Exception as e:
            logger.warning(f"Could not fetch languages for {owner}/{repo}: {e}")
            return {}

    async def get_readme(self, owner: str, repo: str) -> Optional[str]:
        """Fetch and decode the repository README (capped at 4000 chars)."""
        try:
            data = await github_client.get(f"/repos/{owner}/{repo}/readme")
            if data and "content" in data and data.get("encoding") == "base64":
                raw_bytes = base64.b64decode(data["content"])
                content = raw_bytes.decode("utf-8", errors="replace")
                return content[:4000]
        except Exception as e:
            logger.info(f"README not found or inaccessible for {owner}/{repo}: {e}")
        return None

    async def get_contributing(self, owner: str, repo: str) -> Optional[str]:
        """Fetch CONTRIBUTING guide if available (capped at 2000 chars)."""
        candidates = ["CONTRIBUTING.md", ".github/CONTRIBUTING.md", "contributing.md"]
        for candidate in candidates:
            try:
                data = await github_client.get(f"/repos/{owner}/{repo}/contents/{candidate}")
                if data and "content" in data and data.get("encoding") == "base64":
                    raw_bytes = base64.b64decode(data["content"])
                    content = raw_bytes.decode("utf-8", errors="replace")
                    return content[:2000]
            except Exception:
                continue
        return None

    async def get_repository_structure(self, owner: str, repo: str, default_branch: str = "main") -> List[str]:
        """
        Fetch top-level and key nested file paths to understand project layout.
        Returns a curated list of up to 40 indicative file and directory paths.
        """
        try:
            data = await github_client.get(
                f"/repos/{owner}/{repo}/git/trees/{default_branch}",
                params={"recursive": "1"}
            )
            tree = data.get("tree", [])
            paths = []
            for item in tree:
                path = item.get("path", "")
                # Ignore heavy hidden directories (.git, .github/workflows is ok, node_modules, etc.)
                if path.startswith(".git/") or "node_modules" in path or "__pycache__" in path:
                    continue
                # Keep files up to depth 3
                if path.count("/") <= 2:
                    paths.append(path)
                if len(paths) >= 45:
                    break
            return paths
        except Exception as e:
            logger.warning(f"Could not fetch git tree for {owner}/{repo}: {e}")
            # Fallback to contents root
            try:
                contents = await github_client.get(f"/repos/{owner}/{repo}/contents")
                return [item.get("path", "") for item in contents if isinstance(item, dict)]
            except Exception:
                return []


repository_service = RepositoryService()

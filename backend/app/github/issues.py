import logging
from typing import Any, Dict, List
from app.github.client import github_client
from app.utils.errors import NoIssuesFoundError

logger = logging.getLogger("firstpr.github.issues")

BEGINNER_LABELS = {
    "good first issue",
    "good-first-issue",
    "beginner",
    "beginner-friendly",
    "easy",
    "easy pick",
    "starter",
    "first-timers-only",
    "help wanted",
    "help-wanted",
    "documentation",
    "docs",
    "minor",
    "up-for-grabs",
}


class IssuesService:
    async def get_candidate_issues(self, owner: str, repo: str) -> List[Dict[str, Any]]:
        """
        Fetches open issues from the repository, filters out pull requests,
        and curates 8-12 quality candidate issues for AI analysis.
        """
        raw_items = await github_client.get(
            f"/repos/{owner}/{repo}/issues",
            params={"state": "open", "per_page": 40, "sort": "updated", "direction": "desc"},
        )

        if not raw_items or not isinstance(raw_items, list):
            raise NoIssuesFoundError(f"No open issues found for repository {owner}/{repo}.")

        candidates = []
        for item in raw_items:
            # Filter out pull requests
            if "pull_request" in item:
                continue

            # Skip locked or invalid items
            if item.get("locked"):
                continue

            labels = [l.get("name", "") for l in item.get("labels", []) if isinstance(l, dict)]
            title = item.get("title", "").strip()
            body = (item.get("body") or "").strip()

            # Skip issues that are virtually empty or spam
            if len(title) < 4:
                continue

            # Score priority for ordering
            label_lower = [l.lower() for l in labels]
            is_beginner_labelled = any(bl in label_lower for bl in BEGINNER_LABELS)

            candidates.append({
                "number": item.get("number"),
                "title": title,
                "body_snippet": body[:1200] if body else "No detailed description provided.",
                "labels": labels,
                "comments_count": item.get("comments", 0),
                "html_url": item.get("html_url"),
                "is_beginner_labelled": is_beginner_labelled,
            })

        if not candidates:
            raise NoIssuesFoundError(f"No open actionable issues found for repository {owner}/{repo}.")

        # Sort candidate pool: beginner-labelled first, then by comment activity
        candidates.sort(key=lambda x: (x["is_beginner_labelled"], x["comments_count"] >= 1), reverse=True)

        # Return top 10 candidate issues to keep AI context focused and fast
        return candidates[:10]


issues_service = IssuesService()

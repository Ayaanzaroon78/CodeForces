import re
from typing import Tuple, List
from app.utils.errors import InvalidURLError, ValidationInputError


GITHUB_URL_PATTERN = re.compile(
    r"^(?:https?://)?(?:www\.)?github\.com/([a-zA-Z0-9_.-]+)/([a-zA-Z0-9_.-]+)(?:/.*)?$"
)
SHORT_REPO_PATTERN = re.compile(
    r"^([a-zA-Z0-9_.-]+)/([a-zA-Z0-9_.-]+)$"
)

VALID_EXPERIENCES = {"Beginner", "Intermediate", "Advanced"}


def parse_github_url(url: str) -> Tuple[str, str]:
    """
    Parses a GitHub URL or short path (owner/repo) and returns (owner, repo).
    Strips trailing slashes and .git extensions.
    Raises InvalidURLError if the format is invalid.
    """
    if not url or not isinstance(url, str):
        raise InvalidURLError("A GitHub repository URL or identifier is required.")

    clean_url = url.strip()

    # Try full github.com URL
    match = GITHUB_URL_PATTERN.match(clean_url)
    if match:
        owner = match.group(1)
        repo = match.group(2)
        if repo.endswith(".git"):
            repo = repo[:-4]
        return owner, repo

    # Try short "owner/repo" format
    match_short = SHORT_REPO_PATTERN.match(clean_url)
    if match_short:
        owner = match_short.group(1)
        repo = match_short.group(2)
        if repo.endswith(".git"):
            repo = repo[:-4]
        return owner, repo

    raise InvalidURLError(
        f"'{url}' is not a valid GitHub repository URL. Format should be: https://github.com/owner/repository"
    )


def validate_developer_profile(skills: List[str], experience: str) -> Tuple[List[str], str]:
    """
    Validates developer skills and experience level.
    """
    if not skills:
        raise ValidationInputError("Please provide at least one programming skill.")

    cleaned_skills = [s.strip() for s in skills if s and s.strip()]
    if not cleaned_skills:
        raise ValidationInputError("Please provide at least one non-empty programming skill.")

    exp_clean = experience.strip().capitalize() if experience else ""
    if exp_clean not in VALID_EXPERIENCES:
        raise ValidationInputError("Experience must be one of: Beginner, Intermediate, or Advanced.")

    return cleaned_skills, exp_clean

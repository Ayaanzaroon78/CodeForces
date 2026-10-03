import pytest
from app.utils.validation import parse_github_url, validate_developer_profile
from app.utils.errors import InvalidURLError, ValidationInputError


def test_parse_github_url_standard():
    owner, repo = parse_github_url("https://github.com/fastapi/fastapi")
    assert owner == "fastapi"
    assert repo == "fastapi"


def test_parse_github_url_with_trailing_slash_and_git():
    owner, repo = parse_github_url("https://github.com/psf/requests.git/")
    assert owner == "psf"
    assert repo == "requests"


def test_parse_github_url_short_format():
    owner, repo = parse_github_url("pallets/flask")
    assert owner == "pallets"
    assert repo == "flask"


def test_parse_github_url_with_subpath():
    owner, repo = parse_github_url("https://github.com/torvalds/linux/issues/100")
    assert owner == "torvalds"
    assert repo == "linux"


def test_parse_github_url_invalid():
    with pytest.raises(InvalidURLError):
        parse_github_url("not_a_url")

    with pytest.raises(InvalidURLError):
        parse_github_url("https://gitlab.com/owner/repo")


def test_validate_developer_profile():
    skills, exp = validate_developer_profile(["Python", "React", "  "], "beginner")
    assert skills == ["Python", "React"]
    assert exp == "Beginner"


def test_validate_developer_profile_empty():
    with pytest.raises(ValidationInputError):
        validate_developer_profile([], "Beginner")

    with pytest.raises(ValidationInputError):
        validate_developer_profile(["Python"], "Expert")

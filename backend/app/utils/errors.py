from typing import Optional
from fastapi import HTTPException


class AppError(HTTPException):
    def __init__(self, code: str, message: str, status_code: int = 400, details: Optional[dict] = None):
        self.code = code
        self.message = message
        self.details = details or {}
        super().__init__(status_code=status_code, detail={"error": {"code": code, "message": message, "details": self.details}})


class RepositoryNotFoundError(AppError):
    def __init__(self, message: str = "We could not find this GitHub repository. Please verify the owner and repository name."):
        super().__init__(code="REPOSITORY_NOT_FOUND", message=message, status_code=404)


class GitHubRateLimitError(AppError):
    def __init__(self, message: str = "GitHub API rate limit exceeded. To increase limits, configure a GITHUB_TOKEN in your environment."):
        super().__init__(code="GITHUB_RATE_LIMIT", message=message, status_code=429)


class NoIssuesFoundError(AppError):
    def __init__(self, message: str = "No actionable open issues found in this repository to recommend."):
        super().__init__(code="NO_ISSUES_FOUND", message=message, status_code=404)


class InsufficientContextError(AppError):
    def __init__(self, message: str = "Insufficient repository context to make a reliable recommendation."):
        super().__init__(code="INSUFFICIENT_CONTEXT", message=message, status_code=422)


class InvalidURLError(AppError):
    def __init__(self, message: str = "Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repository)."):
        super().__init__(code="INVALID_URL", message=message, status_code=400)


class ValidationInputError(AppError):
    def __init__(self, message: str):
        super().__init__(code="VALIDATION_ERROR", message=message, status_code=422)


class AIProviderError(AppError):
    def __init__(self, message: str = "The AI reasoning provider is currently unavailable or returned an error."):
        super().__init__(code="AI_PROVIDER_ERROR", message=message, status_code=502)


class AITimeoutError(AppError):
    def __init__(self, message: str = "The AI reasoning provider timed out while evaluating the repository."):
        super().__init__(code="AI_TIMEOUT", message=message, status_code=504)


class AIParseError(AppError):
    def __init__(self, message: str = "Failed to parse structured contribution recommendation from the AI response."):
        super().__init__(code="AI_PARSE_ERROR", message=message, status_code=502)

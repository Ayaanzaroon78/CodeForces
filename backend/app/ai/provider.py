import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, Tuple
import httpx

from app.config import settings
from app.schemas import AIStructuredOutput, RecommendedIssue, RelevantFile, RoadmapStep
from app.ai.prompts import SYSTEM_PROMPT, CHAT_SYSTEM_PROMPT
from app.ai.analyzer import extract_and_parse_json, validate_ai_output
from app.utils.errors import AIProviderError, AITimeoutError

logger = logging.getLogger("firstpr.ai.provider")


class AIProvider(ABC):
    @abstractmethod
    async def analyze_repository(
        self, prompt_text: str, context_payload: Dict[str, Any]
    ) -> Tuple[AIStructuredOutput, str, bool]:
        """Analyzes repo context and returns (structured_output, provider_name, is_fallback)."""
        pass

    @abstractmethod
    async def chat(
        self, question: str, repository_context: Dict[str, Any], recommendation: Dict[str, Any]
    ) -> str:
        """Answers developer follow-up questions grounded in repo context."""
        pass


class OpenWeightProvider(AIProvider):
    def __init__(self):
        self.base_url = settings.MODEL_BASE_URL.rstrip("/")
        self.model_name = settings.MODEL_NAME
        self.api_key = settings.MODEL_API_KEY

    def _headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key and self.api_key.strip():
            headers["Authorization"] = f"Bearer {self.api_key.strip()}"
        return headers

    async def analyze_repository(
        self, prompt_text: str, context_payload: Dict[str, Any]
    ) -> Tuple[AIStructuredOutput, str, bool]:
        url = f"{self.base_url}/chat/completions"
        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt_text},
            ],
            "temperature": 0.2,
            "max_tokens": 2500,
        }

        # Try with response_format json_object if supported
        if "groq.com" in self.base_url or "openai" in self.base_url or "openrouter" in self.base_url:
            payload["response_format"] = {"type": "json_object"}

        async with httpx.AsyncClient(timeout=45.0) as client:
            try:
                response = await client.post(url, headers=self._headers(), json=payload)
            except httpx.TimeoutException:
                raise AITimeoutError()
            except httpx.RequestError as exc:
                raise AIProviderError(f"Network error calling AI provider: {exc}")

            if response.status_code >= 400:
                logger.error(f"AI API error {response.status_code}: {response.text}")
                raise AIProviderError(
                    f"AI model provider error ({response.status_code}): {response.text[:200]}"
                )

            res_json = response.json()
            raw_content = res_json.get("choices", [{}])[0].get("message", {}).get("content", "")
            if not raw_content:
                raise AIProviderError("Empty response returned from open-weight model.")

            parsed_dict = extract_and_parse_json(raw_content)
            structured = validate_ai_output(parsed_dict)
            return structured, f"Open-Weight ({self.model_name})", False

    async def chat(
        self, question: str, repository_context: Dict[str, Any], recommendation: Dict[str, Any]
    ) -> str:
        url = f"{self.base_url}/chat/completions"
        prompt_content = f"""
Developer Question: {question}

Repository: {repository_context.get('full_name')}
Description: {repository_context.get('description')}
Languages: {repository_context.get('languages')}

Recommended Issue:
#{recommendation.get('number')}: {recommendation.get('title')}
Difficulty: {recommendation.get('difficulty')}
Relevant Files: {[f.get('path') for f in recommendation.get('relevant_files', [])]}
First Action: {recommendation.get('first_action')}

Provide a direct, practical, and grounded answer to help this developer succeed with this specific issue.
"""
        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": CHAT_SYSTEM_PROMPT},
                {"role": "user", "content": prompt_content},
            ],
            "temperature": 0.3,
            "max_tokens": 1000,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(url, headers=self._headers(), json=payload)
            except httpx.TimeoutException:
                raise AITimeoutError()
            except httpx.RequestError as exc:
                raise AIProviderError(f"Network error during mentor chat: {exc}")

            if response.status_code >= 400:
                raise AIProviderError(f"Chat provider error: {response.text[:150]}")

            res_json = response.json()
            return res_json.get("choices", [{}])[0].get("message", {}).get("content", "").strip()


class DevFallbackProvider(AIProvider):
    """
    Intelligent development fallback analyzer.
    Activates when running locally without an external LLM key or in offline mode.
    Dynamically analyzes the genuine GitHub candidate issues and repository tree
    rather than returning static mocks.
    """

    async def analyze_repository(
        self, prompt_text: str, context_payload: Dict[str, Any]
    ) -> Tuple[AIStructuredOutput, str, bool]:
        repo_ctx = context_payload["repository_context"]
        dev_prof = context_payload["developer_profile"]
        candidates = repo_ctx.get("candidate_issues", [])
        key_paths = repo_ctx.get("key_paths", [])

        if not candidates:
            raise AIProviderError("No candidate issues available to analyze.")

        # Rank candidates based on developer skills and labels
        user_skills_lower = [s.lower() for s in dev_prof["skills"]]
        selected_issue = None
        best_score = -1

        for issue in candidates:
            score = 70
            title_lower = issue["title"].lower()
            body_lower = issue.get("body_snippet", "").lower()

            if issue.get("is_beginner_labelled"):
                score += 15

            for skill in user_skills_lower:
                if skill in title_lower or skill in body_lower:
                    score += 10

            if "doc" in title_lower or "readme" in title_lower:
                if dev_prof["experience"] == "Beginner":
                    score += 8

            if score > best_score:
                best_score = score
                selected_issue = issue

        if not selected_issue:
            selected_issue = candidates[0]

        # Calculate final match score
        normalized_score = min(96, max(75, best_score))

        # Find realistic relevant files from repository tree
        relevant_files = []
        matching_paths = [
            p for p in key_paths if not p.endswith((".md", ".txt", ".json", ".lock", ".yml"))
        ]
        test_paths = [p for p in key_paths if "test" in p.lower()]

        if matching_paths:
            relevant_files.append(
                RelevantFile(
                    path=matching_paths[0],
                    reason="Primary source file likely requiring modification or inspection for this issue.",
                )
            )

        if test_paths:
            relevant_files.append(
                RelevantFile(
                    path=test_paths[0],
                    reason="Existing test suite file to validate changes and verify regressions.",
                )
            )

        if not relevant_files and key_paths:
            relevant_files.append(
                RelevantFile(
                    path=key_paths[0],
                    reason="Key repository configuration or source file.",
                )
            )

        first_path = relevant_files[0].path if relevant_files else "README.md"
        primary_lang = repo_ctx.get("primary_language", "code")

        output = AIStructuredOutput(
            recommended_issue=RecommendedIssue(
                number=selected_issue["number"],
                title=selected_issue["title"],
                difficulty=dev_prof["experience"],
                match_score=normalized_score,
                contribution_type="Bug Fix / Improvement" if not selected_issue.get("is_beginner_labelled") else "Good First Issue",
                reason=f"Matches your {', '.join(dev_prof['skills'])} background with a well-scoped problem statement that avoids touching large subsystem architectures.",
                skills_required=dev_prof["skills"][:2] + [f"{primary_lang} fundamentals"],
                repository_knowledge_required="Basic understanding of repository module layout",
                estimated_scope="Small (1-3 hours)",
                relevant_files=relevant_files,
                issue_url=selected_issue.get("html_url"),
            ),
            why_this_issue=[
                f"Directly leverages your {dev_prof['skills'][0]} experience.",
                "Has a focused, self-contained scope suitable for a first-time contributor.",
                "Existing repository tests provide a safe feedback loop to verify your solution.",
                "Active community issue with clear context provided by maintainers.",
            ],
            what_you_will_learn=[
                f"How {repo_ctx['name']} organizes its {primary_lang} codebase and imports.",
                "Standard open-source PR submission, code review, and CI verification workflows.",
                "Writing regression tests and conforming to project code formatting guidelines.",
            ],
            roadmap=[
                RoadmapStep(
                    step=1,
                    title="Fork & Clone Repository",
                    description=f"Fork {repo_ctx['full_name']} to your GitHub account and clone it locally.",
                    files=[],
                ),
                RoadmapStep(
                    step=2,
                    title="Install Dependencies & Run Tests",
                    description="Follow the README instructions to set up the local development environment and run tests.",
                    files=["CONTRIBUTING.md" if "CONTRIBUTING.md" in key_paths else "README.md"],
                ),
                RoadmapStep(
                    step=3,
                    title="Inspect Relevant Code",
                    description=f"Open `{first_path}` and examine the logic related to #{selected_issue['number']}.",
                    files=[first_path],
                ),
                RoadmapStep(
                    step=4,
                    title="Implement Solution & Verify",
                    description="Make the minimal necessary change and run test commands to verify your fix.",
                    files=[f.path for f in relevant_files],
                ),
                RoadmapStep(
                    step=5,
                    title="Submit Pull Request",
                    description=f"Push to a feature branch on your fork and open a PR with 'Fixes #{selected_issue['number']}'.",
                    files=[],
                ),
            ],
            risks=[
                "Ensure changes match project linting and formatting conventions.",
                "Make sure not to introduce unexpected breaking changes or API signature alterations.",
            ],
            first_action=f"Open `{first_path}` in your editor and locate the section addressing issue #{selected_issue['number']}.",
        )

        return (
            output,
            "Development Heuristic Engine (Ready for Open-Weight Live Model)",
            True,
        )

    async def chat(
        self, question: str, repository_context: Dict[str, Any], recommendation: Dict[str, Any]
    ) -> str:
        rec_title = recommendation.get("title", "the recommended issue")
        rec_num = recommendation.get("number", "")
        repo_name = repository_context.get("full_name", "the repository")
        files = recommendation.get("relevant_files", [])
        file_hint = f" You'll be working mainly in `{files[0].get('path')}`." if files else ""

        q_lower = question.lower()
        if "first" in q_lower or "start" in q_lower:
            return (
                f"To get started on #{rec_num} ('{rec_title}'), your very first step is to fork and clone {repo_name}.{file_hint} "
                f"Once cloned, run the test suite to make sure everything passes in your clean local environment before editing."
            )
        elif "why" in q_lower or "suitable" in q_lower or "match" in q_lower:
            return (
                f"We chose #{rec_num} ('{rec_title}') because its scope is contained and well-documented. "
                f"It allows you to make a meaningful first PR without getting lost in the entire {repo_name} architecture."
            )
        elif "test" in q_lower:
            return (
                f"Testing is critical! Check the test directory in {repo_name} (e.g., in `tests/`). "
                f"Before writing code, run the existing tests. Once your fix is ready, add a new test case that specifically verifies #{rec_num}."
            )
        else:
            return (
                f"Great question regarding #{rec_num} ('{rec_title}'). In {repo_name},{file_hint} "
                f"the best approach is to make small, atomic changes, verify locally against existing tests, "
                f"and adhere strictly to the project's contribution guidelines."
            )


def get_ai_provider() -> AIProvider:
    """
    Factory function returning the configured AI Provider.
    If open_weight is selected and has an API key or points to local/remote endpoint, uses OpenWeightProvider.
    Otherwise falls back smoothly to DevFallbackProvider.
    """
    if settings.AI_PROVIDER == "dev_fallback":
        return DevFallbackProvider()

    # If open_weight is requested:
    # If API key is present OR base_url is a local URL (e.g. localhost/127.0.0.1 Ollama/vLLM), use OpenWeightProvider
    if settings.MODEL_API_KEY and settings.MODEL_API_KEY.strip():
        return OpenWeightProvider()
    if "localhost" in settings.MODEL_BASE_URL or "127.0.0.1" in settings.MODEL_BASE_URL:
        return OpenWeightProvider()

    # If no key is set for remote provider, log warning and use DevFallbackProvider
    logger.warning("No MODEL_API_KEY configured for remote AI provider; activating DevFallbackProvider.")
    return DevFallbackProvider()

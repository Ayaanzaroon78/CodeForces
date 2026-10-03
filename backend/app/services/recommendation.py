import logging
from typing import Optional, List
from app.utils.validation import parse_github_url, validate_developer_profile
from app.services.context_builder import context_builder
from app.ai.provider import get_ai_provider
from app.schemas import (
    RecommendationResponse,
    RepositorySummaryInfo,
    RecommendedIssue,
    RelevantFile,
    RoadmapStep,
)

logger = logging.getLogger("firstpr.services.recommendation")


class RecommendationService:
    async def generate_recommendation(
        self,
        repo_url: str,
        skills: List[str],
        experience: str,
        learning_goal: Optional[str] = None,
    ) -> RecommendationResponse:
        """
        Orchestrates full analysis pipeline:
        1. Parse & validate inputs
        2. Fetch real GitHub repository data, docs, tree, candidate issues
        3. Build delimited prompt context
        4. Execute AI reasoning via Open-Weight or Dev Fallback provider
        5. Decorate with GitHub URLs and skill matrix
        """
        owner, repo = parse_github_url(repo_url)
        clean_skills, clean_exp = validate_developer_profile(skills, experience)

        logger.info(f"Building context for {owner}/{repo} with developer profile: {clean_skills}, {clean_exp}")
        context_payload = await context_builder.build_context(
            owner=owner,
            repo=repo,
            skills=clean_skills,
            experience=clean_exp,
            learning_goal=learning_goal,
        )

        prompt_text = context_builder.format_prompt_context(context_payload)

        provider = get_ai_provider()
        ai_output, provider_used, is_fallback = await provider.analyze_repository(
            prompt_text=prompt_text, context_payload=context_payload
        )

        repo_meta = context_payload["repository"]
        repo_summary = RepositorySummaryInfo(
            name=repo_meta["name"],
            owner=repo_meta["owner"],
            full_name=repo_meta["full_name"],
            description=repo_meta.get("description"),
            stars=repo_meta.get("stars", 0),
            forks=repo_meta.get("forks", 0),
            open_issues_count=repo_meta.get("open_issues_count", 0),
            default_branch=repo_meta.get("default_branch", "main"),
            html_url=repo_meta["html_url"],
            languages=repo_meta.get("languages", {}),
            primary_language=repo_meta.get("primary_language"),
        )

        # Ensure direct GitHub links on relevant files
        rec_issue = ai_output.recommended_issue
        if not rec_issue.issue_url:
            rec_issue.issue_url = f"https://github.com/{owner}/{repo}/issues/{rec_issue.number}"

        branch = repo_summary.default_branch or "main"
        for rf in rec_issue.relevant_files:
            if not rf.github_url and rf.path:
                rf.github_url = f"https://github.com/{owner}/{repo}/blob/{branch}/{rf.path}"

        # Skill difference calculation
        user_skills_lower = set(s.lower() for s in clean_skills)
        skills_to_learn = [
            req for req in rec_issue.skills_required if req.lower() not in user_skills_lower
        ]
        if not skills_to_learn:
            skills_to_learn = [f"{repo_meta.get('primary_language', 'Project')} Conventions", "PR Review Process"]

        return RecommendationResponse(
            repository=repo_summary,
            recommended_issue=rec_issue,
            why_this_issue=ai_output.why_this_issue,
            what_you_will_learn=ai_output.what_you_will_learn,
            roadmap=ai_output.roadmap,
            risks=ai_output.risks,
            first_action=ai_output.first_action,
            user_skills=clean_skills,
            skills_to_learn=skills_to_learn,
            provider_used=provider_used,
            is_fallback=is_fallback,
        )


recommendation_service = RecommendationService()

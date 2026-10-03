import json
from typing import Any, Dict, List, Optional
from app.github.repository import repository_service
from app.github.issues import issues_service


class ContextBuilder:
    async def build_context(
        self,
        owner: str,
        repo: str,
        skills: List[str],
        experience: str,
        learning_goal: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Gathers repository metadata, README, contributing guidelines,
        directory structure, and candidate issues, then packages them into a clean payload.
        """
        from app.github.snapshots import get_demo_snapshot
        from app.utils.errors import GitHubRateLimitError

        snapshot = get_demo_snapshot(owner, repo)

        try:
            # Fetch repository details
            repo_details = await repository_service.get_repository_details(owner, repo)
            languages = await repository_service.get_languages(owner, repo)
            repo_details["languages"] = languages

            # Fetch README and CONTRIBUTING guidelines
            readme = await repository_service.get_readme(owner, repo)
            contributing = await repository_service.get_contributing(owner, repo)

            # Fetch directory layout / tree
            default_branch = repo_details.get("default_branch", "main")
            structure = await repository_service.get_repository_structure(owner, repo, default_branch)

            # Fetch open candidate issues
            candidate_issues = await issues_service.get_candidate_issues(owner, repo)
        except GitHubRateLimitError as rle:
            if snapshot:
                repo_details = snapshot["repository"]
                languages = repo_details.get("languages", {})
                readme = snapshot["readme"]
                contributing = snapshot["contributing"]
                structure = snapshot["key_paths"]
                candidate_issues = snapshot["candidate_issues"]
                default_branch = repo_details.get("default_branch", "main")
            else:
                raise rle

        developer_profile = {
            "skills": skills,
            "experience": experience,
            "learning_goal": learning_goal or "Contribute effectively to open-source.",
        }

        repository_context = {
            "name": repo_details["name"],
            "owner": repo_details["owner"],
            "full_name": repo_details["full_name"],
            "description": repo_details["description"],
            "primary_language": repo_details.get("primary_language"),
            "languages": languages,
            "stars": repo_details["stars"],
            "default_branch": default_branch,
            "readme_excerpt": readme or "No README file found.",
            "contributing_excerpt": contributing or "No CONTRIBUTING.md guide found.",
            "key_paths": structure[:35],
            "candidate_issues": candidate_issues,
        }

        return {
            "repository": repo_details,
            "repository_context": repository_context,
            "developer_profile": developer_profile,
        }

    def format_prompt_context(self, context_payload: Dict[str, Any]) -> str:
        """
        Formats the context with strong XML delimiters for prompt injection defense.
        """
        repo_ctx = context_payload["repository_context"]
        dev_prof = context_payload["developer_profile"]

        prompt_text = f"""
<developer_profile>
Skills: {', '.join(dev_prof['skills'])}
Experience Level: {dev_prof['experience']}
Learning Goal: {dev_prof['learning_goal']}
</developer_profile>

<repository_data>
Repository: {repo_ctx['full_name']}
Description: {repo_ctx['description']}
Primary Language: {repo_ctx.get('primary_language', 'Unknown')}
Languages: {json.dumps(repo_ctx['languages'])}
Key Directory Structure / Files:
{json.dumps(repo_ctx['key_paths'], indent=2)}

README Excerpt:
\"\"\"
{repo_ctx['readme_excerpt']}
\"\"\"

CONTRIBUTING Excerpt:
\"\"\"
{repo_ctx['contributing_excerpt']}
\"\"\"

Candidate Open Issues (Evaluate each carefully against developer profile):
{json.dumps(repo_ctx['candidate_issues'], indent=2)}
</repository_data>
"""
        return prompt_text.strip()


context_builder = ContextBuilder()

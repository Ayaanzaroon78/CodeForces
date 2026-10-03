from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator


# --- Input Requests ---

class AnalyzeRequest(BaseModel):
    repo_url: str = Field(..., description="GitHub repository URL (e.g., https://github.com/owner/repo)")
    skills: List[str] = Field(..., min_length=1, description="List of developer programming skills")
    experience: str = Field(..., description="Experience level: Beginner, Intermediate, or Advanced")
    learning_goal: Optional[str] = Field(default=None, description="Optional developer learning goal")

    @field_validator("skills")
    @classmethod
    def validate_skills_not_empty(cls, v: List[str]) -> List[str]:
        cleaned = [s.strip() for s in v if s and s.strip()]
        if not cleaned:
            raise ValueError("Skills list cannot be empty.")
        return cleaned

    @field_validator("experience")
    @classmethod
    def validate_experience_value(cls, v: str) -> str:
        clean = v.strip().capitalize()
        if clean not in {"Beginner", "Intermediate", "Advanced"}:
            raise ValueError("Experience must be Beginner, Intermediate, or Advanced.")
        return clean


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, description="Follow-up question for the AI mentor")
    repository_context: Dict[str, Any] = Field(..., description="Repository context snapshot")
    recommendation: Dict[str, Any] = Field(..., description="Current recommendation data")


# --- Structured AI & Output Schemas (Matches Section 15) ---

class RelevantFile(BaseModel):
    path: str = Field(..., description="File path relative to repository root")
    reason: str = Field(..., description="Explanation why this file is relevant")
    github_url: Optional[str] = Field(default=None, description="Direct URL to view file on GitHub")


class RecommendedIssue(BaseModel):
    number: int = Field(..., description="GitHub issue number")
    title: str = Field(..., description="GitHub issue title")
    difficulty: str = Field(..., description="Beginner | Intermediate | Advanced")
    match_score: int = Field(..., ge=0, le=100, description="Contribution match score percentage (0-100)")
    contribution_type: str = Field(..., description="e.g. Bug Fix, Documentation, Refactor, Testing, Feature")
    reason: str = Field(..., description="Concise rationale for recommendation")
    skills_required: List[str] = Field(default_factory=list, description="Skills required for this issue")
    repository_knowledge_required: str = Field(default="Basic", description="Knowledge level needed of repo internals")
    estimated_scope: str = Field(default="Small", description="Estimated scope/effort")
    relevant_files: List[RelevantFile] = Field(default_factory=list, description="Key files involved in contribution")
    issue_url: Optional[str] = Field(default=None, description="Direct link to GitHub issue")


class RoadmapStep(BaseModel):
    step: int = Field(..., description="Step sequence number")
    title: str = Field(..., description="Short descriptive title of this step")
    description: str = Field(..., description="Actionable explanation of what to do")
    files: List[str] = Field(default_factory=list, description="Files associated with this step")


class AIStructuredOutput(BaseModel):
    recommended_issue: RecommendedIssue
    why_this_issue: List[str] = Field(..., min_length=1, description="3-5 bullet reasons why this is suitable")
    what_you_will_learn: List[str] = Field(default_factory=list, description="Knowledge gained from this contribution")
    roadmap: List[RoadmapStep] = Field(..., min_length=1, description="Step-by-step contribution roadmap")
    risks: List[str] = Field(default_factory=list, description="Potential challenges or considerations")
    first_action: str = Field(..., description="Concrete immediate first action (e.g. Open file X and inspect function Y)")


class RepositorySummaryInfo(BaseModel):
    name: str
    owner: str
    full_name: str
    description: Optional[str] = None
    stars: int = 0
    forks: int = 0
    open_issues_count: int = 0
    default_branch: str = "main"
    html_url: str
    languages: Dict[str, int] = Field(default_factory=dict)
    primary_language: Optional[str] = None


class RecommendationResponse(BaseModel):
    repository: RepositorySummaryInfo
    recommended_issue: RecommendedIssue
    why_this_issue: List[str]
    what_you_will_learn: List[str]
    roadmap: List[RoadmapStep]
    risks: List[str]
    first_action: str
    user_skills: List[str]
    skills_to_learn: List[str]
    provider_used: str
    is_fallback: bool = False


class ChatResponse(BaseModel):
    answer: str

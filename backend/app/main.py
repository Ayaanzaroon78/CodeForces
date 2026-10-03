import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.schemas import AnalyzeRequest, RecommendationResponse, ChatRequest, ChatResponse
from app.services.recommendation import recommendation_service
from app.ai.provider import get_ai_provider
from app.utils.errors import AppError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("firstpr.main")

app = FastAPI(
    title="FirstPR AI API",
    description="Your AI guide to your first open-source contribution.",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": exc.message, "details": exc.details}},
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    clean_details = [
        {"field": ".".join(str(l) for l in err.get("loc", []) if l != "body"), "message": err.get("msg", "")}
        for err in errors
    ]
    msg = clean_details[0]["message"] if clean_details else "Invalid request data provided."
    return JSONResponse(
        status_code=422,
        content={"error": {"code": "VALIDATION_ERROR", "message": f"Input validation error: {msg}", "details": clean_details}},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred while analyzing the repository. Please try again.",
            }
        },
    )


@app.get("/")
async def root():
    return {
        "name": "FirstPR AI API",
        "tagline": "Your AI guide to your first open-source contribution.",
        "status": "online",
        "docs": "/docs",
    }


@app.get("/api/health")
async def health():
    provider = get_ai_provider()
    return {
        "status": "healthy",
        "ai_provider_configured": settings.AI_PROVIDER,
        "model_name": settings.MODEL_NAME,
        "active_provider_class": provider.__class__.__name__,
        "github_token_configured": bool(settings.GITHUB_TOKEN and settings.GITHUB_TOKEN.strip()),
    }


@app.post("/api/analyze", response_model=RecommendationResponse)
async def analyze_repository(request: AnalyzeRequest):
    """
    Analyze a GitHub repository and developer profile to recommend an optimal first contribution.
    """
    logger.info(f"Incoming analyze request: {request.repo_url}, skills={request.skills}, exp={request.experience}")
    result = await recommendation_service.generate_recommendation(
        repo_url=request.repo_url,
        skills=request.skills,
        experience=request.experience,
        learning_goal=request.learning_goal,
    )
    return result


@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_mentor(request: ChatRequest):
    """
    Chat with the FirstPR AI mentor about the recommended issue and repository.
    """
    provider = get_ai_provider()
    answer = await provider.chat(
        question=request.question,
        repository_context=request.repository_context,
        recommendation=request.recommendation,
    )
    return ChatResponse(answer=answer)

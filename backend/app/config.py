import os
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


# Find .env in project root or current backend folder
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = ROOT_DIR / ".env"
BACKEND_ENV = ROOT_DIR / "backend" / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(str(ENV_PATH), str(BACKEND_ENV)),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # GitHub
    GITHUB_TOKEN: Optional[str] = None

    # AI Configuration (Open-Weight Model)
    AI_PROVIDER: str = "open_weight"  # "open_weight" or "dev_fallback"
    MODEL_NAME: str = "llama-3.3-70b-versatile"
    MODEL_BASE_URL: str = "https://api.groq.com/openai/v1"
    MODEL_API_KEY: Optional[str] = None

    # Server
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()

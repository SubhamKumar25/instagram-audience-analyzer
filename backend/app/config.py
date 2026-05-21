import os
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Instagram Audience Analyzer API"
    API_V1_STR: str = "/api/v1"
    
    # Database (supports sqlite+aiosqlite locally or PostgreSQL in production)
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./instagram_analyzer.db",
        validation_alias="DATABASE_URL"
    )
    
    # Redis Cache and Rate Limiting
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        validation_alias="REDIS_URL"
    )
    
    # Security and Origins
    SECRET_KEY: str = Field(
        default="antigravity_ig_analyzer_super_secret_key_2026",
        validation_alias="SECRET_KEY"
    )
    
    # CORS Origins (Vite React default + production)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://instagram-analyzer.vercel.app",
        "https://instagaram.vercel.app"
    ]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 30
    
    # Scraper settings
    PLAYWRIGHT_HEADLESS: bool = True
    PROXY_SERVER: str = Field(default="", validation_alias="PROXY_SERVER")
    
    # AI Heuristic Weights
    WEIGHT_USERNAME_RANDOMNESS: float = 0.15
    WEIGHT_FOLLOWER_RATIO: float = 0.25
    WEIGHT_POST_COUNT: float = 0.15
    WEIGHT_BIO_QUALITY: float = 0.20
    WEIGHT_ENGAGEMENT_CONSISTENCY: float = 0.25

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()

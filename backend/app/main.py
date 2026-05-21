import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import engine, Base
from app.routes.analyze import router as analyze_router

# Configure Logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup events (creating SQL schemas in PostgreSQL) and 
    shutdown events gracefully.
    """
    logger.info("Starting up FastAPI application...")
    async with engine.begin() as conn:
        logger.info("Initializing PostgreSQL database schemas...")
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database schemas initialized.")
    yield
    logger.info("Shutting down FastAPI application...")
    await engine.dispose()
    logger.info("Database engine connections closed.")

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="High-Performance Asynchronous AI-Powered Instagram Audience Analyzer REST API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Policy Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(analyze_router)

@app.get("/", tags=["Health"])
async def health_check():
    """Simple API status health endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    # Local runtime entrypoint
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

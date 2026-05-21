from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from datetime import datetime, timedelta
import logging

from app.database import get_db
from app.models import Profile, AnalysisRun
from app.schemas import (
    AnalyzeRequest, 
    AnalysisResponse, 
    CompareRequest, 
    CompareResponse,
    ProfileOut,
    AnalysisRunOut
)
from app.scraper.instagram import scrape_instagram_profile, extract_username
from app.analyzer.scoring import analyze_profile_quality
from app.analyzer.nlp import estimate_country_distribution

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["Analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_profile(request: AnalyzeRequest, db: AsyncSession = Depends(get_db)):
    """
    Analyzes an Instagram profile.
    Checks the database for recent runs (24-hour cache window) to prevent redundant scraping.
    Runs stealth scraper + AI scoring + NLP demographics, then saves to PostgreSQL.
    """
    try:
        username = extract_username(request.profile_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    # 1. Check for a cached/saved run in the last 24 hours
    cache_window = datetime.utcnow() - timedelta(hours=24)
    
    stmt = select(Profile).where(Profile.username == username)
    result = await db.execute(stmt)
    db_profile = result.scalars().first()
    
    if db_profile and db_profile.updated_at > cache_window:
        # Check if there is an analysis run
        run_stmt = select(AnalysisRun).where(AnalysisRun.profile_id == db_profile.id).order_by(desc(AnalysisRun.created_at))
        run_result = await db.execute(run_stmt)
        latest_run = run_result.scalars().first()
        
        if latest_run:
            logger.info(f"Returning cached analysis for username: {username}")
            return AnalysisResponse(
                profile=ProfileOut.model_validate(db_profile),
                analysis=AnalysisRunOut.model_validate(latest_run),
                cached=True,
                source=latest_run.countries_json[0].get("source", "simulated") if latest_run.countries_json else "simulated"
            )
            
    # 2. Not cached / stale - Scrape public profile info (with simulator fallback)
    logger.info(f"Running fresh analysis for username: {username}")
    profile_data = await scrape_instagram_profile(request.profile_url)
    
    # 3. Compute weighted bot scores & metrics
    scores = analyze_profile_quality(
        username=profile_data["username"],
        followers=profile_data["followers"],
        following=profile_data["following"],
        posts=profile_data["posts"],
        bio=profile_data["bio"],
        is_verified=profile_data["is_verified"]
    )
    
    # 4. Estimate Country demographics (NLP-based)
    countries = estimate_country_distribution(
        bio=profile_data["bio"],
        username=profile_data["username"]
    )
    
    # Tag primary country json with source info
    for item in countries:
        item["source"] = profile_data["source"]
        
    # 5. Save or update Profile details in PostgreSQL
    if not db_profile:
        db_profile = Profile(
            username=profile_data["username"],
            full_name=profile_data["full_name"],
            bio=profile_data["bio"],
            followers=profile_data["followers"],
            following=profile_data["following"],
            posts=profile_data["posts"],
            profile_pic_url=profile_data["profile_pic_url"],
            is_verified=profile_data["is_verified"]
        )
        db.add(db_profile)
    else:
        db_profile.full_name = profile_data["full_name"]
        db_profile.bio = profile_data["bio"]
        db_profile.followers = profile_data["followers"]
        db_profile.following = profile_data["following"]
        db_profile.posts = profile_data["posts"]
        db_profile.profile_pic_url = profile_data["profile_pic_url"]
        db_profile.is_verified = profile_data["is_verified"]
        db_profile.updated_at = datetime.utcnow()
        
    await db.flush()  # Retrieve profile ID for ForeignKey constraint
    
    # 6. Save new AnalysisRun in PostgreSQL
    new_run = AnalysisRun(
        profile_id=db_profile.id,
        fake_percentage=scores["fake_percentage"],
        organic_percentage=scores["organic_percentage"],
        audience_score=scores["audience_score"],
        influencer_score=scores["influencer_score"],
        trust_score=scores["trust_score"],
        bot_probability=scores["bot_probability"],
        countries_json=countries,
        quality_breakdown_json=scores["quality_breakdown"],
        engagement_json=scores["engagement"],
        activity_json=scores["activity"]
    )
    db.add(new_run)
    await db.commit()
    
    await db.refresh(db_profile)
    await db.refresh(new_run)
    
    return AnalysisResponse(
        profile=ProfileOut.model_validate(db_profile),
        analysis=AnalysisRunOut.model_validate(new_run),
        cached=False,
        source=profile_data["source"]
    )

@router.get("/history", response_model=list[AnalysisResponse])
async def get_history(db: AsyncSession = Depends(get_db)):
    """
    Fetches the 10 most recently analyzed profiles and their reports.
    """
    # Fetch distinct profiles ordered by updated_at
    stmt = select(Profile).order_by(desc(Profile.updated_at)).limit(10)
    result = await db.execute(stmt)
    profiles = result.scalars().all()
    
    history_list = []
    for profile in profiles:
        run_stmt = select(AnalysisRun).where(AnalysisRun.profile_id == profile.id).order_by(desc(AnalysisRun.created_at))
        run_result = await db.execute(run_stmt)
        latest_run = run_result.scalars().first()
        
        if latest_run:
            history_list.append(
                AnalysisResponse(
                    profile=ProfileOut.model_validate(profile),
                    analysis=AnalysisRunOut.model_validate(latest_run),
                    cached=True,
                    source=latest_run.countries_json[0].get("source", "simulated") if latest_run.countries_json else "simulated"
                )
            )
            
    return history_list

@router.post("/compare", response_model=CompareResponse)
async def compare_profiles(request: CompareRequest, db: AsyncSession = Depends(get_db)):
    """
    Convenient wrapper to run or retrieve analysis for two distinct profiles
    and return them together for side-by-side dynamic charts.
    """
    # Analyze profile 1
    req1 = AnalyzeRequest(profile_url=request.profile_url_1)
    res1 = await analyze_profile(req1, db)
    
    # Analyze profile 2
    req2 = AnalyzeRequest(profile_url=request.profile_url_2)
    res2 = await analyze_profile(req2, db)
    
    return CompareResponse(
        profile_1=res1.profile,
        analysis_1=res1.analysis,
        profile_2=res2.profile,
        analysis_2=res2.analysis
    )

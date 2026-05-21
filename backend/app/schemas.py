from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# Profile schemas
class ProfileBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    followers: int = 0
    following: int = 0
    posts: int = 0
    profile_pic_url: Optional[str] = None
    is_verified: bool = False

class ProfileCreate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

# Analysis Report schemas
class AnalysisRunBase(BaseModel):
    fake_percentage: float
    organic_percentage: float
    audience_score: float
    influencer_score: float
    trust_score: float
    bot_probability: float
    countries_json: List[Dict[str, Any]]
    quality_breakdown_json: Dict[str, Any]
    engagement_json: Dict[str, Any]
    activity_json: Dict[str, Any]

class AnalysisRunCreate(AnalysisRunBase):
    profile_id: int

class AnalysisRunOut(AnalysisRunBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Endpoint validation structures
class AnalyzeRequest(BaseModel):
    profile_url: str = Field(..., description="Valid public Instagram profile URL (e.g., https://instagram.com/therock)")

class AnalysisResponse(BaseModel):
    profile: ProfileOut
    analysis: AnalysisRunOut
    cached: bool = False
    source: str = Field(..., description="Indicator of whether data was scraped or simulated ('scraped' | 'simulated')")

class CompareRequest(BaseModel):
    profile_url_1: str = Field(..., description="First profile URL to compare")
    profile_url_2: str = Field(..., description="Second profile URL to compare")

class CompareResponse(BaseModel):
    profile_1: ProfileOut
    analysis_1: AnalysisRunOut
    profile_2: ProfileOut
    analysis_2: AnalysisRunOut

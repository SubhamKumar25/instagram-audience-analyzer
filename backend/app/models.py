from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    followers = Column(Integer, default=0, nullable=False)
    following = Column(Integer, default=0, nullable=False)
    posts = Column(Integer, default=0, nullable=False)
    profile_pic_url = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    analysis_runs = relationship(
        "AnalysisRun",
        back_populates="profile",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

class AnalysisRun(Base):
    __tablename__ = "analysis_runs"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    
    # AI Estimation metrics
    fake_percentage = Column(Float, nullable=False)
    organic_percentage = Column(Float, nullable=False)
    audience_score = Column(Float, nullable=False)
    influencer_score = Column(Float, nullable=False)
    trust_score = Column(Float, nullable=False)
    bot_probability = Column(Float, nullable=False)
    
    # Demographic & behavioral distributions (JSON arrays/objects)
    countries_json = Column(JSON, nullable=False)          # e.g., [{"country": "India", "percentage": 30}]
    quality_breakdown_json = Column(JSON, nullable=False)  # e.g., {"real": 70, "suspicious": 10, ...}
    engagement_json = Column(JSON, nullable=False)         # e.g., {"rate": 3.4, "average_likes": 102}
    activity_json = Column(JSON, nullable=False)           # e.g., {"active": 75, "inactive": 25}
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    profile = relationship("Profile", back_populates="analysis_runs")

-- Database Schema for Instagram Audience Analyzer
-- Suitable for PostgreSQL (e.g. Supabase)

-- Drop tables if they exist to allow clean installations
DROP TABLE IF EXISTS analysis_runs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Table for storing profile general data
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(200),
    bio TEXT,
    followers INTEGER NOT NULL DEFAULT 0,
    following INTEGER NOT NULL DEFAULT 0,
    posts INTEGER NOT NULL DEFAULT 0,
    profile_pic_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing audience analysis runs (history)
CREATE TABLE analysis_runs (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
    fake_percentage DOUBLE PRECISION NOT NULL,
    organic_percentage DOUBLE PRECISION NOT NULL,
    audience_score DOUBLE PRECISION NOT NULL,
    influencer_score DOUBLE PRECISION NOT NULL,
    trust_score DOUBLE PRECISION NOT NULL,
    bot_probability DOUBLE PRECISION NOT NULL,
    
    -- JSON blocks to store detailed breakdown distributions
    countries_json JSONB NOT NULL,          -- e.g. [{"country": "United States", "percentage": 34.5}, ...]
    quality_breakdown_json JSONB NOT NULL,  -- e.g. {"real": 45, "suspicious": 20, "bots": 15, "inactive": 20}
    engagement_json JSONB NOT NULL,         -- e.g. {"average_likes": 12450, "average_comments": 820, "rate": 4.2, "consistency": 85.0}
    activity_json JSONB NOT NULL,           -- e.g. {"active": 72.5, "inactive": 27.5}
    
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index username for fast historical reports lookup
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_analysis_runs_profile ON analysis_runs(profile_id);

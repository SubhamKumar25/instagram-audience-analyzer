import math
import random
from typing import Dict, Any, Tuple
from app.config import settings

def calculate_username_entropy(username: str) -> float:
    """
    Calculates the Shannon Entropy of a username string to detect random,
    machine-generated, or bot-like usernames (e.g. 'ajfhg987123').
    Returns a score between 0.0 (highly structured/normal) and 1.0 (highly random).
    """
    if not username:
        return 0.0
    
    # Count frequencies
    char_counts = {}
    for char in username:
        char_counts[char] = char_counts.get(char, 0) + 1
        
    # Calculate Shannon Entropy
    entropy = 0.0
    length = len(username)
    for count in char_counts.values():
        prob = count / length
        entropy -= prob * math.log2(prob)
        
    # Max possible entropy for username length (capped at 8 chars normal limit for comparison)
    max_entropy = math.log2(min(length, 26)) if length > 0 else 1.0
    normalized_entropy = entropy / max_entropy if max_entropy > 0 else 0.0
    
    # Penalize excessive digits or underscores (common in bot accounts)
    digit_count = sum(c.isdigit() for c in username)
    digit_penalty = (digit_count / length) * 0.4 if length > 0 else 0.0
    
    final_score = min(1.0, (normalized_entropy * 0.6) + digit_penalty)
    return final_score

def analyze_profile_quality(
    username: str,
    followers: int,
    following: int,
    posts: int,
    bio: str,
    is_verified: bool
) -> Dict[str, Any]:
    """
    Evaluates the public metrics of a profile and computes structured AI estimates.
    Provides detailed probability breakdowns and weighted metrics.
    """
    # 1. Evaluate Username randomness
    username_randomness = calculate_username_entropy(username)
    
    # 2. Evaluate Follower-to-Following ratio
    # Normal users have relatively balanced ratios. Bots have extreme following compared to followers.
    ratio_score = 0.0
    if following > 0:
        ratio = followers / following
        if ratio < 0.1:  # Follows 10x more than followed (highly suspicious)
            ratio_score = 0.85
        elif ratio < 0.5: # Follows 2x more
            ratio_score = 0.50
        elif ratio > 100.0: # Huge follower count, tiny following (celebrity ratio, organic)
            ratio_score = 0.05
    else:
        ratio_score = 0.40 # No following, suspicious
        
    # 3. Post Count Penalty
    # Zero or tiny post count with followers points to low quality or bot-farm origin
    post_score = 0.0
    if posts == 0:
        post_score = 0.90
    elif posts < 5:
        post_score = 0.60
    elif posts < 15:
        post_score = 0.30
        
    # 4. Bio Quality Score
    # Bots often have empty bios, repetitive keywords, or no links.
    bio_score = 0.0
    bio_len = len(bio) if bio else 0
    if bio_len == 0:
        bio_score = 0.80
    elif bio_len < 15:
        bio_score = 0.40
    
    # Link presence is a good indicator of business/human presence
    has_link = "http" in bio.lower() or "www." in bio.lower() or ".com" in bio.lower() or "@" in bio.lower()
    if has_link:
        bio_score = max(0.0, bio_score - 0.25)
        
    # 5. Verified Accounts are highly authentic
    verified_bonus = 0.95 if is_verified else 0.0
    
    # --- WEIGHTED BOT PROBABILITY ---
    bot_probability = (
        (username_randomness * settings.WEIGHT_USERNAME_RANDOMNESS) +
        (ratio_score * settings.WEIGHT_FOLLOWER_RATIO) +
        (post_score * settings.WEIGHT_POST_COUNT) +
        (bio_score * settings.WEIGHT_BIO_QUALITY)
    )
    
    # Apply Verified discount
    bot_probability = max(0.02, bot_probability - verified_bonus)
    # Clamp between 2% and 98% (realistic estimation bounds)
    bot_probability = min(0.98, max(0.02, bot_probability))
    
    # Make it positive and negative correlation
    # 6. Audience Quality & Quality Breakdown
    # Distribute the followers into Real, Suspicious, Bots, Inactive based on profile risk tier
    fake_percentage = bot_probability * 100
    
    # Add minor noise for realistic percentage distributions
    noise = random.uniform(-3.5, 3.5)
    fake_percentage = min(95.0, max(2.5, fake_percentage + noise))
    
    organic_percentage = 100.0 - fake_percentage
    
    # Subdivide fake_percentage into Bots and Suspicious
    bot_ratio = 0.65  # 65% of fake are automated bots, 35% are suspicious inactive shells
    bots_pct = round(fake_percentage * bot_ratio, 1)
    suspicious_pct = round(fake_percentage * (1.0 - bot_ratio), 1)
    
    # Subdivide organic into Real (Active Engagers) and Inactive
    # Inactive organic are real accounts that became stagnant
    inactive_ratio = 0.20 if followers > 100000 else 0.12
    inactive_pct = round(organic_percentage * inactive_ratio, 1)
    real_pct = round(organic_percentage * (1.0 - inactive_ratio), 1)
    
    # Make sure they add up cleanly to 100
    sum_parts = real_pct + suspicious_pct + bots_pct + inactive_pct
    diff = 100.0 - sum_parts
    real_pct = round(real_pct + diff, 1)

    quality_breakdown = {
        "real": real_pct,
        "suspicious": suspicious_pct,
        "bots": bots_pct,
        "inactive": inactive_pct
    }
    
    # 7. Engagement & Activity Estimation
    # Ideal engagement rates vary by follower count tiers (higher followers, lower rate)
    if followers < 5000:
        base_eng_rate = random.uniform(4.5, 9.2)
    elif followers < 20000:
        base_eng_rate = random.uniform(2.5, 5.5)
    elif followers < 100000:
        base_eng_rate = random.uniform(1.8, 3.8)
    elif followers < 1000000:
        base_eng_rate = random.uniform(1.2, 2.5)
    else:
        base_eng_rate = random.uniform(0.6, 1.8)
        
    # High bot percentages reduce actual authentic engagement
    penalty_factor = (organic_percentage / 100.0)
    engagement_rate = base_eng_rate * (0.4 + 0.6 * penalty_factor)
    
    # Calculate absolute averages
    avg_likes = int(followers * (engagement_rate / 100.0) * 0.94)
    avg_comments = int(followers * (engagement_rate / 100.0) * 0.06)
    
    # Ensure minimum values
    avg_likes = max(1, avg_likes)
    avg_comments = max(0, avg_comments)
    
    # Re-calculate exact rate based on whole numbers
    total_actions = avg_likes + avg_comments
    engagement_rate = round((total_actions / followers * 100.0) if followers > 0 else 0.0, 2)
    
    # Engagement consistency (higher is better, bot accounts have volatile spikes)
    engagement_consistency = round(min(98.0, max(30.0, organic_percentage * 0.9 + random.uniform(2, 8))), 1)
    
    # Viral probability
    viral_prob = round(min(99.0, max(1.0, (engagement_rate * 4.5) + (posts * 0.02) - (bot_probability * 30) + random.uniform(-5, 5))), 1)
    
    engagement_data = {
        "average_likes": avg_likes,
        "average_comments": avg_comments,
        "rate": engagement_rate,
        "consistency": engagement_consistency,
        "viral_probability": viral_prob
    }
    
    # 8. Activity Estimation
    active_followers_pct = round(organic_percentage * (0.8 + random.uniform(0.02, 0.12)), 1)
    active_followers_pct = min(98.0, max(5.0, active_followers_pct))
    inactive_followers_pct = round(100.0 - active_followers_pct, 1)
    
    activity_data = {
        "active": active_followers_pct,
        "inactive": inactive_followers_pct
    }
    
    # 9. Key Unified Scores: Audience Score, Influencer Score, Trust Score
    audience_score = round(real_pct + (inactive_pct * 0.4), 1)
    audience_score = min(100.0, max(1.0, audience_score))
    
    # Influencer Authenticity Score: High if engagement is steady and fake followers are low
    influencer_score = round((organic_percentage * 0.6) + (engagement_consistency * 0.4), 1)
    
    # Verified accounts get a natural trust boost
    verified_trust = 15.0 if is_verified else 0.0
    trust_score = round((audience_score * 0.5) + (100.0 - fake_percentage) * 0.5 + verified_trust, 1)
    trust_score = min(100.0, max(1.0, trust_score))
    
    return {
        "fake_percentage": round(fake_percentage, 1),
        "organic_percentage": round(organic_percentage, 1),
        "audience_score": audience_score,
        "influencer_score": influencer_score,
        "trust_score": trust_score,
        "bot_probability": round(bot_probability * 100.0, 1),
        "quality_breakdown": quality_breakdown,
        "engagement": engagement_data,
        "activity": activity_data
    }

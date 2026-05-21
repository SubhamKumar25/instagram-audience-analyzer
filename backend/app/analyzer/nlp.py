import re
import random
from typing import List, Dict, Any

# Map flags and keywords to countries
FLAG_MAP = {
    "🇺🇸": "United States",
    "🇮🇳": "India",
    "🇬🇧": "United Kingdom",
    "🇧🇷": "Brazil",
    "🇨🇦": "Canada",
    "🇦🇺": "Australia",
    "🇫🇷": "France",
    "🇩🇪": "Germany",
    "🇯🇵": "Japan",
    "🇦🇪": "United Arab Emirates",
    "🇪🇸": "Spain",
    "🇮🇹": "Italy",
    "🇲🇽": "Mexico",
    "🇿🇦": "South Africa"
}

KEYWORD_MAP = {
    r"\b(nyc|new york|la|los angeles|cali|chicago|miami|usa|america)\b": "United States",
    r"\b(mumbai|delhi|bangalore|hyderabad|india|pune|chennai)\b": "India",
    r"\b(london|manchester|birmingham|uk|england|scotland)\b": "United Kingdom",
    r"\b(sao paulo|rio|brasil|brazil)\b": "Brazil",
    r"\b(toronto|vancouver|montreal|canada)\b": "Canada",
    r"\b(sydney|melbourne|brisbane|aus|australia)\b": "Australia",
    r"\b(paris|france)\b": "France",
    r"\b(berlin|munich|germany|deutschland)\b": "Germany",
    r"\b(tokyo|kyoto|japan)\b": "Japan",
    r"\b(dubai|abudhabi|uae)\b": "United Arab Emirates",
    r"\b(madrid|barcelona|espana|spain)\b": "Spain",
    r"\b(rome|milan|italia|italy)\b": "Italy",
    r"\b(mexico city|mexico)\b": "Mexico",
    r"\b(cape town|joburg|south africa)\b": "South Africa"
}

GLOBAL_BASELINE = [
    {"country": "United States", "percentage": 32.5},
    {"country": "India", "percentage": 18.0},
    {"country": "United Kingdom", "percentage": 12.5},
    {"country": "Brazil", "percentage": 8.5},
    {"country": "Canada", "percentage": 6.0},
    {"country": "Germany", "percentage": 4.5},
    {"country": "Others", "percentage": 18.0}
]

def estimate_country_distribution(bio: str, username: str) -> List[Dict[str, Any]]:
    """
    NLP & Heuristic country estimation based on:
    1. Emoji flags in biography.
    2. Regional keywords and city mentions.
    3. Global baseline distributions with minor random perturbations for realism.
    """
    bio_lower = bio.lower() if bio else ""
    detected_country = None
    
    # 1. Look for flag emojis in bio
    for flag, country in FLAG_MAP.items():
        if flag in bio:
            detected_country = country
            break
            
    # 2. Look for keywords if no flag detected
    if not detected_country:
        for regex, country in KEYWORD_MAP.items():
            if re.search(regex, bio_lower) or re.search(regex, username.lower()):
                detected_country = country
                break
                
    # If a specific country is detected, skew the audience towards it
    if detected_country:
        distribution = []
        
        # Primary country gets major weight
        primary_pct = round(random.uniform(50.0, 72.0), 1)
        distribution.append({"country": detected_country, "percentage": primary_pct})
        
        # Select 3-4 other random countries from maps to form a logical spread
        available_countries = [c for c in FLAG_MAP.values() if c != detected_country]
        selected_others = random.sample(available_countries, k=3)
        
        remaining = 100.0 - primary_pct
        
        # Split remaining logic
        pct2 = round(remaining * 0.45, 1)
        pct3 = round(remaining * 0.30, 1)
        pct4 = round(remaining * 0.15, 1)
        pct_others = round(remaining - (pct2 + pct3 + pct4), 1)
        
        distribution.append({"country": selected_others[0], "percentage": pct2})
        distribution.append({"country": selected_others[1], "percentage": pct3})
        distribution.append({"country": selected_others[2], "percentage": pct4})
        distribution.append({"country": "Others", "percentage": pct_others})
        
        # Sort desc
        distribution.sort(key=lambda x: x["percentage"], reverse=True)
        return distribution
        
    else:
        # Fall back to realistic global distribution with minor variations
        distribution = []
        sum_pct = 0.0
        
        for item in GLOBAL_BASELINE[:-1]:
            # Add minor noise (-2.5% to +2.5%)
            perturbed_pct = round(max(1.0, item["percentage"] + random.uniform(-2.5, 2.5)), 1)
            distribution.append({"country": item["country"], "percentage": perturbed_pct})
            sum_pct += perturbed_pct
            
        others_pct = round(100.0 - sum_pct, 1)
        distribution.append({"country": "Others", "percentage": others_pct})
        
        distribution.sort(key=lambda x: x["percentage"], reverse=True)
        return distribution

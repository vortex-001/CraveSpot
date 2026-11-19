"""
CraveSpot Craving-Based Recommendation Engine
Natural Language understanding and multi-attribute recommendation engine:
- Analyzes food cravings (tastes, textures, moods, budget constraints, dietary needs).
- Computes multi-factor relevance scores for dishes and restaurants.
- Generates transparent match explanations ("Why this fits your craving").
- Powers the "Surprise Me" smart discovery feature.
- Operates 100% offline out-of-the-box with zero mandatory external API keys.
"""

import re
import random
import logging
from .places_service import haversine_distance

logger = logging.getLogger(__name__)

# Keywords mapping dictionary
TASTE_KEYWORDS = {
    "spicy": ["spicy", "hot", "fiery", "chilli", "chili", "schezwan", "peri peri", "tikka", "masala", "pepper"],
    "cheesy": ["cheese", "cheesy", "mozzarella", "cheddar", "gouda", "gooey", "melted"],
    "sweet": ["sweet", "sugar", "dessert", "chocolate", "chocolaty", "brownie", "fudge", "cake", "ice cream", "gulab jamun", "halwa", "waffle"],
    "creamy": ["creamy", "butter", "makhani", "malai", "velvet", "rich", "korma"],
    "tangy": ["tangy", "sour", "chatpata", "lemon", "tamarind", "tomato", "chutney"],
    "savory": ["savory", "savoury", "salty", "garlic", "herb", "seasoned"]
}

TEXTURE_KEYWORDS = {
    "crispy": ["crispy", "crunchy", "fried", "kurkure", "crust", "toast", "cracker"],
    "soft": ["soft", "melt in mouth", "juicy", "steamed", "dumpling", "tender"],
    "comfort": ["comfort", "hearty", "warm", "homestyle", "dal", "khichdi", "soup", "slow-cooked", "traditional"],
    "refreshing": ["refreshing", "cold", "chilled", "shake", "cooler", "beverage", "drink", "smoothie", "fresh"],
    "healthy": ["healthy", "salad", "fresh", "diet", "protein", "low calorie", "light", "steamed", "guilt-free"]
}

MOOD_KEYWORDS = {
    "late-night": ["midnight", "late night", "night", "insomnia", "hunger attack", "post party"],
    "cheat-meal": ["cheat meal", "cheat day", "loaded", "indulgent", "heavy", "feast"],
    "quick-bite": ["quick", "snack", "fast", "on the go", "street food", "roll", "bite"]
}

FOOD_TYPES = {
    "pizza": ["pizza", "margherita", "slice", "flatbread"],
    "biryani": ["biryani", "dum biryani", "rice", "pulao"],
    "burger": ["burger", "cheeseburger", "patty", "smash"],
    "momos": ["momos", "momo", "dimsum", "dumplings"],
    "noodles": ["noodles", "chowmein", "hakka", "ramen", "pasta", "spaghetti"],
    "curry": ["paneer", "butter chicken", "dal", "curry", "gravy", "roti", "naan"],
    "dessert": ["brownie", "cake", "ice cream", "gulab jamun", "pastry", "waffle", "sweet"],
    "fries": ["fries", "finger chips", "loaded fries", "wedges"],
    "beverage": ["shake", "coffee", "smoothie", "thickshake", "cooler", "beverage", "juice"]
}


def parse_craving_intent(query_text):
    """
    Parse natural language craving input into structured intent parameters.
    Examples:
      - "I want something spicy and cheesy under ₹200"
      - "Craving crispy chicken burger nearby"
      - "Healthy veg lunch"
    """
    text = (query_text or "").lower().strip()

    intent = {
        "raw_query": query_text,
        "tastes": [],
        "textures": [],
        "moods": [],
        "food_types": [],
        "max_budget": None,
        "dietary": None,  # "veg", "non_veg", None
        "tokens": re.findall(r"\b[a-z0-9\u20B9]+\b", text)
    }

    # 1. Detect Dietary Preference
    if re.search(r"\b(pure veg|strictly veg|pure-vegetarian)\b", text):
        intent["dietary"] = "pure_veg"
    elif re.search(r"\b(vegetarian|veg)\b", text) and not re.search(r"\b(non-veg|non veg)\b", text):
        intent["dietary"] = "veg"
    elif re.search(r"\b(non-veg|non veg|chicken|mutton|meat|fish|egg)\b", text):
        intent["dietary"] = "non_veg"

    # 2. Detect Budget Constraint (e.g. "under 200", "under ₹300", "<150", "below 250")
    budget_match = re.search(r"(?:under|below|less than|<|within|\u20B9|rs\.?)\s*(\d{2,4})", text)
    if budget_match:
        try:
            intent["max_budget"] = float(budget_match.group(1))
        except (ValueError, TypeError):
            pass
    elif "cheap" in text or "budget" in text or "affordable" in text:
        intent["max_budget"] = 200.0

    # 3. Detect Tastes
    for taste, keywords in TASTE_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            intent["tastes"].append(taste)

    # 4. Detect Textures / Feelings
    for texture, keywords in TEXTURE_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            intent["textures"].append(texture)

    # 5. Detect Moods
    for mood, keywords in MOOD_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            intent["moods"].append(mood)

    # 6. Detect Food Types
    for food_type, keywords in FOOD_TYPES.items():
        if any(kw in text for kw in keywords):
            intent["food_types"].append(food_type)

    return intent


def score_food_item(item, intent, user_lat=None, user_lng=None):
    """
    Score a food item against parsed user craving intent.
    Returns: (score: float, match_reasons: list[str])
    """
    score = 0.0
    reasons = []

    name = (item.get("name") or "").lower()
    description = (item.get("description") or "").lower()
    tags = (item.get("tags") or "").lower()
    taste_profile = (item.get("taste_profile") or "").lower()
    texture = (item.get("texture") or "").lower()
    category = (item.get("category") or "").lower()
    item_is_veg = bool(item.get("is_veg"))
    price = float(item.get("price") or 0)
    rating = float(item.get("rating") or 0)

    combined_text = f"{name} {description} {tags} {category} {taste_profile} {texture}"

    # Dietary Filter Check
    if intent["dietary"] in ("veg", "pure_veg") and not item_is_veg:
        return 0.0, []
    if intent["dietary"] == "non_veg" and item_is_veg:
        score -= 15.0

    # 1. Food Type Match (High Weight: 35 pts)
    for ft in intent["food_types"]:
        if ft in combined_text:
            score += 35.0
            reasons.append(f"Authentic {ft.title()}")
            break

    # 2. Taste Matches (Up to 25 pts)
    matched_tastes = []
    for taste in intent["tastes"]:
        taste_synonyms = TASTE_KEYWORDS.get(taste, [taste])
        if any(s in combined_text for s in taste_synonyms):
            score += 15.0
            matched_tastes.append(taste.capitalize())
    if matched_tastes:
        reasons.append(f"{', '.join(matched_tastes)} taste")

    # 3. Texture / Mood Matches (Up to 20 pts)
    matched_textures = []
    for tex in intent["textures"]:
        tex_synonyms = TEXTURE_KEYWORDS.get(tex, [tex])
        if any(s in combined_text for s in tex_synonyms):
            score += 12.0
            matched_textures.append(tex.capitalize())
    if matched_textures:
        reasons.append(f"{', '.join(matched_textures)} texture")

    # 4. Budget Compatibility (Up to 15 pts)
    if intent["max_budget"] is not None:
        if price <= intent["max_budget"]:
            score += 15.0
            reasons.append(f"Within budget (\u20B9{int(price)} <= \u20B9{int(intent['max_budget'])})")
        else:
            # Penalize price exceeding budget
            score -= min(30.0, (price - intent["max_budget"]) * 0.2)
    elif price <= 200:
        score += 5.0  # Slight bonus for pocket-friendly items

    # 5. Raw Keyword Overlap (Up to 15 pts)
    query_tokens = [t for t in intent["tokens"] if len(t) > 2 and t not in ("want", "need", "give", "find", "food", "something")]
    token_matches = 0
    for tok in query_tokens:
        if tok in combined_text:
            token_matches += 1
            score += 6.0
    if token_matches > 0 and not reasons:
        reasons.append("Matches your craving keywords")

    # 6. Quality & Popularity Bonus (Up to 10 pts)
    if rating >= 4.5:
        score += 8.0
        reasons.append(f"Top Rated ({rating}\u2605)")
    elif rating >= 4.0:
        score += 4.0

    if item.get("is_bestseller"):
        score += 5.0
        reasons.append("Customer Bestseller")

    # 7. Proximity Bonus (If restaurant coordinates available)
    res_lat = item.get("restaurant_latitude") or item.get("latitude")
    res_lng = item.get("restaurant_longitude") or item.get("longitude")
    if user_lat is not None and user_lng is not None and res_lat and res_lng:
        dist = haversine_distance(user_lat, user_lng, float(res_lat), float(res_lng))
        item["distance_km"] = dist
        if dist <= 2.0:
            score += 10.0
            reasons.append(f"Nearby ({dist} km)")
        elif dist <= 5.0:
            score += 5.0
        elif dist > 15.0:
            score -= 10.0  # Too far

    explanation = " • ".join(reasons[:3]) if reasons else "Recommended based on your taste profile"
    return max(0.0, score), explanation


def rank_cravings(items, query_text, user_lat=None, user_lng=None, limit=20):
    """
    Ranks a list of food items based on natural language craving text.
    """
    intent = parse_craving_intent(query_text)
    ranked = []

    for item in items:
        # Create shallow copy to avoid mutating original
        item_copy = dict(item)
        score, explanation = score_food_item(item_copy, intent, user_lat, user_lng)
        if score > 0 or not query_text.strip():
            item_copy["craving_score"] = round(score, 1)
            item_copy["match_reason"] = explanation
            ranked.append(item_copy)

    # Sort descending by score
    ranked.sort(key=lambda x: (x.get("craving_score", 0), x.get("rating", 0)), reverse=True)
    return ranked[:limit], intent


def surprise_me_pick(items, user_lat=None, user_lng=None, max_budget=None, dietary=None):
    """
    Selects an exciting, top-quality surprise dish tailored to the user's constraints.
    """
    candidates = []
    for it in items:
        price = float(it.get("price") or 0)
        is_veg = bool(it.get("is_veg"))
        rating = float(it.get("rating") or 0)

        if dietary == "veg" and not is_veg:
            continue
        if dietary == "non_veg" and is_veg:
            continue
        if max_budget and price > max_budget:
            continue
        if rating < 4.2:
            continue

        candidates.append(it)

    if not candidates:
        candidates = items

    if not candidates:
        return None

    selected = dict(random.choice(candidates))
    selected["surprise_message"] = random.choice([
        "🎲 Today's Chef Surprise: Bursting with flavor and highly loved by foodies!",
        "✨ Hand-picked for you: A crowd-favorite delight guaranteed to hit the spot!",
        "🔥 Craving resolved: Treat yourself to this mouthwatering discovery today!",
        "🌟 Fresh recommendation: Prepared with perfection by our top-rated vendor!"
    ])
    return selected

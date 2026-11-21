"""
CraveSpot Production Backend Application
Framework: Flask + Flask-CORS + MySQL Connector
Database: project (Configurable via DB_NAME in .env)
Features:
- Live Location & Overpass OSM Places Discovery
- Natural Language Craving-Based Recommendation Engine
- Token-Based User Authentication & Dietary Profiles
- Favorites, Search History & Restaurant Reviews
- Rate Limiting & Security Hardening Headers
"""

import os
import sys
import re
import math
import time
import logging
from pathlib import Path
from decimal import Decimal
from datetime import datetime, date

import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from dotenv import load_dotenv

# Ensure project root and backend folder are in Python path for all execution modes
backend_dir = Path(__file__).resolve().parent
project_root = backend_dir.parent
for p in [str(project_root), str(backend_dir)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.services.places_service import geocode_address, fetch_osm_overpass_restaurants, haversine_distance
    from backend.services.craving_engine import parse_craving_intent, rank_cravings, surprise_me_pick
except ImportError:
    try:
        from services.places_service import geocode_address, fetch_osm_overpass_restaurants, haversine_distance
        from services.craving_engine import parse_craving_intent, rank_cravings, surprise_me_pick
    except ImportError:
        from .services.places_service import geocode_address, fetch_osm_overpass_restaurants, haversine_distance
        from .services.craving_engine import parse_craving_intent, rank_cravings, surprise_me_pick

# ---------------------------------------------------------------------
# Load Environment Variables from project root
# ---------------------------------------------------------------------
root_env = Path(__file__).resolve().parent.parent / ".env"
local_env = Path(__file__).resolve().parent / ".env"

if root_env.exists():
    load_dotenv(dotenv_path=root_env, override=True)
elif local_env.exists():
    load_dotenv(dotenv_path=local_env, override=True)
else:
    load_dotenv(override=True)

# Initialize Flask app
app = Flask(__name__)

# Security & CORS configuration
SECRET_KEY = os.getenv("SECRET_KEY", "cravespot-insecure-dev-secret-key-change-in-prod-2026")
TOKEN_SERIALIZER = URLSafeTimedSerializer(SECRET_KEY)
TOKEN_MAX_AGE_SECONDS = 86400 * 7  # 7 days

cors_origins = os.getenv("CORS_ORIGINS", "*")
CORS(app, resources={r"/*": {"origins": cors_origins}}, supports_credentials=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

# In-memory sliding window rate limiter
_RATE_LIMIT_STORE = {}


def check_rate_limit(key, max_requests=5, window_seconds=60):
    """Simple sliding-window rate limiter per client IP."""
    now = time.time()
    history = _RATE_LIMIT_STORE.get(key, [])
    history = [t for t in history if now - t < window_seconds]
    if len(history) >= max_requests:
        return False
    history.append(now)
    _RATE_LIMIT_STORE[key] = history
    return True


# =====================================================================
# 1. DATABASE CONNECTION & SERIALIZATION
# =====================================================================

def get_db():
    """Create and return a new MySQL database connection."""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "project"),
        connection_timeout=5
    )


def serialize_row(row):
    """Normalize row types (Decimals to floats, dates to ISO strings)."""
    if row is None:
        return None
    normalized = {}
    for key, value in row.items():
        if isinstance(value, Decimal):
            normalized[key] = float(value)
        elif isinstance(value, (datetime, date)):
            normalized[key] = value.isoformat()
        else:
            normalized[key] = value
    return normalized


def serialize_rows(rows):
    """Normalize a list of database rows."""
    return [serialize_row(r) for r in rows] if rows else []


# =====================================================================
# 2. SECURITY HEADERS MIDDLEWARE
# =====================================================================

@app.after_request
def set_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


def get_current_user_id():
    """Extract and verify user_id from Authorization Bearer token."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    token = auth_header[7:].strip()
    try:
        data = TOKEN_SERIALIZER.loads(token, max_age=TOKEN_MAX_AGE_SECONDS)
        return data.get("user_id")
    except (SignatureExpired, BadSignature, Exception):
        return None


# =====================================================================
# 3. ROOT & HEALTH CHECK
# =====================================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "name": "CraveSpot API",
        "version": "2.0.0",
        "database": os.getenv("DB_NAME", "project"),
        "message": "CraveSpot Backend & Recommendation Engine is Running!"
    }), 200


@app.route("/api/health", methods=["GET"])
def health():
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()

        return jsonify({
            "success": True,
            "database": os.getenv("DB_NAME", "project"),
            "message": "MySQL connected successfully"
        }), 200

    except mysql.connector.Error as err:
        app.logger.exception("Database health check failed")
        return jsonify({
            "success": False,
            "error_code": getattr(err, "errno", None),
            "message": f"Database connection failed: {str(err)}"
        }), 503

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 4. LOCATION & LIVE PLACES ENDPOINTS
# =====================================================================

@app.route("/api/location/geocode", methods=["GET"])
def geocode_endpoint():
    """Geocode city, locality or pincode into coordinates."""
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify({"success": False, "message": "Query parameter 'q' is required"}), 400

    result = geocode_address(q)
    if not result:
        return jsonify({"success": False, "message": "Location not found"}), 404

    return jsonify({"success": True, "location": result}), 200


@app.route("/api/restaurants/live-nearby", methods=["GET"])
def live_nearby_restaurants():
    """
    Discover real live nearby restaurants by combining local MySQL database
    records with OpenStreetMap Overpass live data.
    """
    try:
        lat_val = request.args.get("lat") if request.args.get("lat") is not None else request.args.get("latitude")
        lng_val = request.args.get("lng") if request.args.get("lng") is not None else request.args.get("longitude")
        if lat_val is None or lng_val is None:
            raise ValueError("Missing coordinates")
        lat = float(lat_val)
        lng = float(lng_val)
        radius_km = float(request.args.get("radius") or request.args.get("radius_km") or 15.0)
    except (TypeError, ValueError):
        return jsonify({"success": False, "message": "Valid 'lat' and 'lng' query parameters are required"}), 400

    # 1. Fetch DB restaurants and calculate real Haversine distance
    all_db_restaurants = []
    in_radius_restaurants = []
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM restaurants WHERE latitude IS NOT NULL AND longitude IS NOT NULL")
        rows = cursor.fetchall()
        for r in rows:
            dist = haversine_distance(lat, lng, float(r["latitude"]), float(r["longitude"]))
            r["distance_km"] = dist
            r["delivery_time_mins"] = max(15, min(65, int(15 + dist * 3.5)))
            r["source"] = "database"
            serialized = serialize_row(r)
            all_db_restaurants.append(serialized)
            if dist <= radius_km:
                in_radius_restaurants.append(serialized)
    except Exception as e:
        app.logger.warning(f"Error querying DB for live nearby restaurants: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

    # Sort in-radius restaurants by distance
    in_radius_restaurants.sort(key=lambda x: x.get("distance_km", 999))

    # If within-radius count is low, supplement with the closest DB restaurants
    # so discovery never leaves the user with a blank screen
    if len(in_radius_restaurants) < 5 and all_db_restaurants:
        all_db_restaurants.sort(key=lambda x: x.get("distance_km", 999))
        seen_ids = {r.get("restaurant_id") for r in in_radius_restaurants}
        for r in all_db_restaurants:
            if r.get("restaurant_id") not in seen_ids:
                in_radius_restaurants.append(r)
                seen_ids.add(r.get("restaurant_id"))
            if len(in_radius_restaurants) >= 8:
                break

    # 2. Fetch Live OpenStreetMap Overpass restaurants if online
    live_osm = fetch_osm_overpass_restaurants(lat, lng, radius_km=radius_km, limit=15)
    for osm_r in live_osm:
        dist = osm_r.get("distance_km", 2.0)
        osm_r["delivery_time_mins"] = max(15, min(65, int(15 + dist * 3.5)))

    # Combine and sort by distance
    all_nearby = in_radius_restaurants + live_osm
    all_nearby.sort(key=lambda x: x.get("distance_km", 999))

    return jsonify({
        "success": True,
        "count": len(all_nearby),
        "center": {"lat": lat, "lng": lng, "radius_km": radius_km},
        "restaurants": all_nearby
    }), 200


# =====================================================================
# 5. CRAVING RECOMMENDATION ENGINE ENDPOINTS
# =====================================================================

@app.route("/api/cravings/recommend", methods=["GET", "POST"])
def recommend_cravings():
    """
    Core Craving Discovery API.
    Parses natural language cravings (e.g. 'spicy and cheesy under ₹200')
    and returns ranked food items with hosting restaurant and match reasons.
    """
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        query = data.get("query", "").strip()
        user_lat = data.get("latitude")
        user_lng = data.get("longitude")
        budget = data.get("budget")
        dietary = data.get("dietary")
    else:
        query = request.args.get("q", "").strip()
        user_lat = request.args.get("lat", type=float)
        user_lng = request.args.get("lng", type=float)
        budget = request.args.get("budget", type=float)
        dietary = request.args.get("dietary")

    # Early validation — must have a non-empty query string
    if not query:
        return jsonify({"success": False, "message": "A craving query is required"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Join food_items with restaurants for complete restaurant context
        cursor.execute(
            """
            SELECT f.*, r.name AS restaurant_name, r.address AS restaurant_address,
                   r.rating AS restaurant_rating, r.latitude AS restaurant_latitude,
                   r.longitude AS restaurant_longitude, r.offer AS restaurant_offer,
                   r.phone AS restaurant_phone
            FROM food_items AS f
            JOIN restaurants AS r ON f.restaurant_id = r.restaurant_id
            WHERE f.is_available = 1
            """
        )
        food_items = serialize_rows(cursor.fetchall())

        if not food_items:
            # Fallback to menu_items table if food_items was empty
            cursor.execute(
                """
                SELECT m.*, r.name AS restaurant_name, r.address AS restaurant_address,
                       r.rating AS restaurant_rating, r.latitude AS restaurant_latitude,
                       r.longitude AS restaurant_longitude, r.offer AS restaurant_offer
                FROM menu_items AS m
                JOIN restaurants AS r ON m.restaurant_id = r.restaurant_id
                """
            )
            food_items = serialize_rows(cursor.fetchall())

        ranked, intent = rank_cravings(food_items, query, user_lat=user_lat, user_lng=user_lng, limit=25)

        return jsonify({
            "success": True,
            "query": query,
            "parsed_intent": intent,
            "count": len(ranked),
            "recommendations": ranked
        }), 200

    except Exception:
        app.logger.exception("Craving recommendation failed")
        return jsonify({"success": False, "message": "Recommendation processing failed"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/cravings/surprise-me", methods=["GET"])
def surprise_me_endpoint():
    """Surprise Me random craving pick matching optional budget/dietary constraints."""
    user_lat = request.args.get("lat", type=float)
    user_lng = request.args.get("lng", type=float)
    budget = request.args.get("budget", type=float)
    dietary = request.args.get("dietary")

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT f.*, r.name AS restaurant_name, r.address AS restaurant_address,
                   r.rating AS restaurant_rating, r.latitude AS restaurant_latitude,
                   r.longitude AS restaurant_longitude
            FROM food_items AS f
            JOIN restaurants AS r ON f.restaurant_id = r.restaurant_id
            WHERE f.is_available = 1
            """
        )
        food_items = serialize_rows(cursor.fetchall())
        pick = surprise_me_pick(food_items, user_lat, user_lng, budget, dietary)

        if not pick:
            return jsonify({"success": False, "message": "No surprise dish found"}), 404

        return jsonify({"success": True, "surprise": pick}), 200

    except Exception:
        app.logger.exception("Surprise Me pick failed")
        return jsonify({"success": False, "message": "Failed to pick surprise item"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/cravings/taxonomy", methods=["GET"])
def get_cravings_taxonomy():
    """List all curated visual craving categories."""
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM cravings ORDER BY craving_id ASC")
        cravings = serialize_rows(cursor.fetchall())
        return jsonify({"success": True, "cravings": cravings}), 200
    except Exception:
        app.logger.exception("Failed to fetch cravings taxonomy")
        return jsonify({"success": False, "message": "Failed to fetch cravings"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 6. RESTAURANTS DIRECTORY ENDPOINTS
# =====================================================================

@app.route("/api/restaurants", methods=["GET"])
def get_restaurants():
    """Fetch restaurants with filters (search, cuisine, city, veg, rating, sort)."""
    search = request.args.get("search", "").strip()
    cuisine = request.args.get("cuisine", "").strip()
    city = request.args.get("city", "").strip()
    veg_only = request.args.get("veg_only", "").lower() in ("1", "true")
    min_rating = request.args.get("min_rating", type=float)
    sort = request.args.get("sort", "").strip().lower()

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM restaurants WHERE 1=1"
        params = []

        if search:
            query += " AND (LOWER(name) LIKE %s OR LOWER(cuisine) LIKE %s OR LOWER(address) LIKE %s)"
            pattern = f"%{search.lower()}%"
            params.extend([pattern, pattern, pattern])

        if cuisine:
            query += " AND LOWER(cuisine) LIKE %s"
            params.append(f"%{cuisine.lower()}%")

        if city:
            query += " AND LOWER(address) LIKE %s"
            params.append(f"%{city.lower()}%")

        if veg_only:
            query += " AND is_veg = 1"

        if min_rating is not None:
            query += " AND rating >= %s"
            params.append(min_rating)

        if sort == "rating":
            query += " ORDER BY rating DESC"
        elif sort == "price_low":
            query += " ORDER BY price_for_two ASC"
        elif sort == "price_high":
            query += " ORDER BY price_for_two DESC"
        elif sort == "name":
            query += " ORDER BY name ASC"
        else:
            query += " ORDER BY restaurant_id ASC"

        cursor.execute(query, tuple(params))
        restaurants = serialize_rows(cursor.fetchall())
        return jsonify(restaurants), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch restaurants")
        return jsonify({"success": False, "message": "Unable to fetch restaurants"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/restaurants/<int:restaurant_id>", methods=["GET"])
def get_restaurant(restaurant_id):
    """Fetch complete details of a single restaurant including location and cuisines."""
    # Reject invalid IDs early
    if restaurant_id <= 0:
        return jsonify({"success": False, "message": "Invalid restaurant ID"}), 404

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM restaurants WHERE restaurant_id = %s LIMIT 1", (restaurant_id,))
        restaurant = cursor.fetchone()

        if not restaurant:
            return jsonify({"success": False, "message": f"Restaurant {restaurant_id} not found"}), 404

        # Fetch location details if available
        cursor.execute("SELECT * FROM restaurant_locations WHERE restaurant_id = %s LIMIT 1", (restaurant_id,))
        location = cursor.fetchone()
        restaurant["location_details"] = serialize_row(location)

        # Fetch menu count — use .get() safely in case cursor returns a MagicMock or dict without key
        cursor.execute("SELECT COUNT(*) AS total_dishes FROM menu_items WHERE restaurant_id = %s", (restaurant_id,))
        count_row = cursor.fetchone()
        if count_row and isinstance(count_row, dict):
            restaurant["total_dishes"] = count_row.get("total_dishes", 0)
        elif count_row and isinstance(count_row, (list, tuple)):
            restaurant["total_dishes"] = count_row[0] if count_row else 0
        else:
            restaurant["total_dishes"] = 0

        return jsonify({"success": True, "restaurant": serialize_row(restaurant)}), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch restaurant details")
        return jsonify({"success": False, "message": "Unable to fetch restaurant details"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/restaurants/<int:restaurant_id>/menu", methods=["GET"])
def get_restaurant_menu(restaurant_id):
    """Fetch all menu dishes for a specific restaurant."""
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT * FROM menu_items
            WHERE restaurant_id = %s
            ORDER BY item_id ASC
            """,
            (restaurant_id,)
        )
        menu_items = serialize_rows(cursor.fetchall())
        return jsonify(menu_items), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch restaurant menu")
        return jsonify({"success": False, "message": "Unable to fetch restaurant menu"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 7. FOOD ITEMS & CATEGORIES ENDPOINTS
# =====================================================================

@app.route("/api/menu-items", methods=["GET"])
@app.route("/api/dishes", methods=["GET"])
def get_menu_items():
    """Fetch menu items/dishes with filters."""
    search = request.args.get("search", "").strip()
    category = request.args.get("category", "").strip()
    restaurant_id = request.args.get("restaurant_id", type=int)
    veg_only = request.args.get("veg_only", "").lower() in ("1", "true")
    max_price = request.args.get("max_price", type=float)
    min_rating = request.args.get("min_rating", type=float)

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM menu_items WHERE 1=1"
        params = []

        if search:
            query += " AND (LOWER(name) LIKE %s OR LOWER(description) LIKE %s OR LOWER(category) LIKE %s)"
            pattern = f"%{search.lower()}%"
            params.extend([pattern, pattern, pattern])

        if category and category.lower() != "all":
            query += " AND LOWER(category) = %s"
            params.append(category.lower())

        if restaurant_id is not None:
            query += " AND restaurant_id = %s"
            params.append(restaurant_id)

        if veg_only:
            query += " AND is_veg = 1"

        if max_price is not None:
            query += " AND price <= %s"
            params.append(max_price)

        if min_rating is not None:
            query += " AND rating >= %s"
            params.append(min_rating)

        query += " ORDER BY item_id ASC"

        cursor.execute(query, tuple(params))
        items = serialize_rows(cursor.fetchall())
        return jsonify(items), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch menu items")
        return jsonify({"success": False, "message": "Unable to fetch menu items"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/menu-items/<int:item_id>", methods=["GET"])
@app.route("/api/dishes/<int:item_id>", methods=["GET"])
def get_single_dish(item_id):
    """Fetch details of a single dish with parent restaurant information."""
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT m.*, r.name AS restaurant_name, r.address AS restaurant_address,
                   r.rating AS restaurant_rating, r.phone AS restaurant_phone
            FROM menu_items AS m
            LEFT JOIN restaurants AS r ON m.restaurant_id = r.restaurant_id
            WHERE m.item_id = %s
            LIMIT 1
            """,
            (item_id,)
        )
        dish = cursor.fetchone()

        if not dish:
            return jsonify({"success": False, "message": f"Dish {item_id} not found"}), 404

        return jsonify(serialize_row(dish)), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch dish")
        return jsonify({"success": False, "message": "Unable to fetch dish"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Fetch food categories list."""
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM food_categories ORDER BY display_order ASC")
        categories = serialize_rows(cursor.fetchall())
        if not categories:
            cursor.execute("SELECT * FROM categories ORDER BY category_id ASC")
            categories = serialize_rows(cursor.fetchall())
        return jsonify(categories), 200
    except mysql.connector.Error:
        app.logger.exception("Failed to fetch categories")
        return jsonify({"success": False, "message": "Unable to fetch categories"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/cuisines", methods=["GET"])
def get_cuisines():
    """Fetch cuisines taxonomy."""
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM cuisines ORDER BY cuisine_id ASC")
        return jsonify(serialize_rows(cursor.fetchall())), 200
    except mysql.connector.Error:
        app.logger.exception("Failed to fetch cuisines")
        return jsonify({"success": False, "message": "Unable to fetch cuisines"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 8. REVIEWS ENDPOINTS
# =====================================================================

@app.route("/api/restaurants/<int:restaurant_id>/reviews", methods=["GET"])
def get_restaurant_reviews(restaurant_id):
    """Fetch reviews for a specific restaurant."""
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT * FROM reviews
            WHERE restaurant_id = %s
            ORDER BY created_at DESC
            """,
            (restaurant_id,)
        )
        reviews = serialize_rows(cursor.fetchall())
        return jsonify(reviews), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch reviews")
        return jsonify({"success": False, "message": "Unable to fetch reviews"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/restaurants/<int:restaurant_id>/reviews", methods=["POST"])
@app.route("/api/reviews", methods=["POST"])
def add_review(restaurant_id=None):
    """Submit a new review for a restaurant."""
    data = request.get_json(silent=True) or {}

    res_id = restaurant_id or data.get("restaurant_id")
    user_name = data.get("user_name", "").strip() or data.get("name", "").strip()
    rating = data.get("rating")
    comment = data.get("comment", "").strip()
    user_id = get_current_user_id() or data.get("user_id")

    if not res_id:
        return jsonify({"success": False, "message": "Restaurant ID is required"}), 400

    if not user_name:
        return jsonify({"success": False, "message": "Reviewer name is required"}), 400

    try:
        rating = int(rating)
        if not 1 <= rating <= 5:
            raise ValueError()
    except (TypeError, ValueError):
        return jsonify({"success": False, "message": "Rating must be an integer between 1 and 5"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO reviews (restaurant_id, user_id, user_name, rating, comment)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (res_id, user_id, user_name, rating, comment)
        )
        conn.commit()

        # Update average restaurant rating & review count
        cursor.execute(
            """
            UPDATE restaurants
            SET rating = (
                SELECT ROUND(AVG(rating), 1)
                FROM reviews
                WHERE restaurant_id = %s
            ),
            review_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE restaurant_id = %s
            )
            WHERE restaurant_id = %s
            """,
            (res_id, res_id, res_id)
        )
        conn.commit()

        return jsonify({"success": True, "message": "Review submitted successfully"}), 201

    except mysql.connector.Error:
        if conn:
            conn.rollback()
        app.logger.exception("Failed to save review")
        return jsonify({"success": False, "message": "Unable to save review"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 9. USER AUTHENTICATION (SECURED & RATE-LIMITED)
# =====================================================================

@app.route("/api/register", methods=["POST"])
def register():
    """User registration with rate-limiting and validation."""
    client_ip = request.remote_addr or "unknown"
    if not check_rate_limit(f"reg_{client_ip}", max_requests=6, window_seconds=60):
        return jsonify({"success": False, "message": "Too many registration attempts. Please wait a minute."}), 429

    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    phone = data.get("phone", "").strip()

    if not name or not email or not password:
        return jsonify({"success": False, "message": "Name, email and password are required"}), 400

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify({"success": False, "message": "Please enter a valid email address"}), 400

    if len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT user_id FROM users WHERE LOWER(email) = %s LIMIT 1", (email,))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Email is already registered"}), 409

        hashed_password = generate_password_hash(password)
        cursor.execute(
            """
            INSERT INTO users (name, email, password, phone)
            VALUES (%s, %s, %s, %s)
            """,
            (name, email, hashed_password, phone)
        )
        conn.commit()
        new_user_id = cursor.lastrowid

        # Create default profile & preferences
        cursor.execute(
            "INSERT INTO user_profiles (user_id, bio, city) VALUES (%s, %s, %s)",
            (new_user_id, "Food lover on CraveSpot", "Chandigarh")
        )
        cursor.execute(
            "INSERT INTO user_preferences (user_id, dietary) VALUES (%s, %s)",
            (new_user_id, "all")
        )
        conn.commit()

        token = TOKEN_SERIALIZER.dumps({"user_id": new_user_id, "email": email})

        return jsonify({
            "success": True,
            "message": "Registration successful",
            "token": token,
            "user": {
                "user_id": new_user_id,
                "name": name,
                "email": email
            }
        }), 201

    except mysql.connector.Error:
        if conn:
            conn.rollback()
        app.logger.exception("Registration failed")
        return jsonify({"success": False, "message": "Unable to complete registration"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/login", methods=["POST"])
def login():
    """User authentication with rate-limiting and token issuance."""
    client_ip = request.remote_addr or "unknown"
    if not check_rate_limit(f"login_{client_ip}", max_requests=8, window_seconds=60):
        return jsonify({"success": False, "message": "Too many login attempts. Please try again after 60 seconds."}), 429

    data = request.get_json(silent=True) or {}
    raw_email = data.get("email", "")
    password = data.get("password", "")

    # Type check — email must be a string
    if not isinstance(raw_email, str) or not isinstance(password, str):
        return jsonify({"success": False, "message": "Email and password must be strings"}), 400

    email = raw_email.strip().lower()

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    # Basic format validation
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify({"success": False, "message": "Please enter a valid email address"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT user_id, name, email, password, role
            FROM users
            WHERE LOWER(email) = %s
            LIMIT 1
            """,
            (email,)
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401

        stored_password = user["password"]

        # Support Werkzeug password hashes, migrate plaintext if encountered
        if stored_password.startswith(("scrypt:", "pbkdf2:")):
            valid = check_password_hash(stored_password, password)
        else:
            valid = (stored_password == password)
            if valid:
                cursor.execute(
                    "UPDATE users SET password = %s WHERE user_id = %s",
                    (generate_password_hash(password), user["user_id"])
                )
                conn.commit()

        if not valid:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401

        # Record last login
        cursor.execute("UPDATE users SET last_login = NOW() WHERE user_id = %s", (user["user_id"],))
        conn.commit()

        token = TOKEN_SERIALIZER.dumps({"user_id": user["user_id"], "email": user["email"]})

        return jsonify({
            "success": True,
            "message": "Login successful",
            "token": token,
            "user": {
                "user_id": user["user_id"],
                "name": user["name"],
                "email": user["email"],
                "role": user.get("role", "user")
            }
        }), 200

    except mysql.connector.Error:
        app.logger.exception("Login failed")
        return jsonify({"success": False, "message": "Unable to process login"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/auth/me", methods=["GET"])
def get_authenticated_user():
    """Verify auth token and return current session profile."""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Not authenticated or token expired"}), 401

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT u.user_id, u.name, u.email, u.phone, u.role,
                   p.bio, p.city, p.avatar_url, p.default_radius
            FROM users AS u
            LEFT JOIN user_profiles AS p ON u.user_id = p.user_id
            WHERE u.user_id = %s
            LIMIT 1
            """,
            (user_id,)
        )
        user = cursor.fetchone()
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        return jsonify({"success": True, "user": serialize_row(user)}), 200

    except Exception:
        return jsonify({"success": False, "message": "Failed to fetch user"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 10. USER FAVORITES, PREFERENCES & PROFILE
# =====================================================================

@app.route("/api/user/profile", methods=["GET", "PUT"])
def user_profile_endpoint():
    """Get or update the current user's profile information."""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Authentication required"}), 401

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        if request.method == "GET":
            cursor.execute(
                """
                SELECT u.user_id, u.name, u.email, u.phone, u.role,
                       p.bio, p.city, p.avatar_url, p.default_radius
                FROM users AS u
                LEFT JOIN user_profiles AS p ON u.user_id = p.user_id
                WHERE u.user_id = %s LIMIT 1
                """,
                (user_id,)
            )
            user = cursor.fetchone()
            if not user:
                return jsonify({"success": False, "message": "User not found"}), 404
            return jsonify({"success": True, "user": serialize_row(user)}), 200

        # PUT — update profile fields
        data = request.get_json(silent=True) or {}
        city       = data.get("city", "")
        bio        = data.get("bio", "")
        address    = data.get("address", "")
        avatar_url = data.get("avatar_url", "")

        # Upsert user_profiles row
        cursor.execute(
            """
            INSERT INTO user_profiles (user_id, bio, city, avatar_url)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                bio        = VALUES(bio),
                city       = VALUES(city),
                avatar_url = VALUES(avatar_url)
            """,
            (user_id, bio, city, avatar_url)
        )
        conn.commit()
        return jsonify({"success": True, "message": "Profile updated"}), 200

    except Exception:
        app.logger.exception("Failed to handle user profile")
        return jsonify({"success": False, "message": "Profile operation failed"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/user/favorites", methods=["GET"])
def get_user_favorites():
    """Fetch saved restaurants and dishes for the current user."""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Authentication required"}), 401

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT fav.favorite_id, fav.created_at,
                   r.restaurant_id, r.name AS restaurant_name, r.cuisine,
                   r.address, r.rating, r.image_url, r.offer
            FROM favorites AS fav
            JOIN restaurants AS r ON fav.restaurant_id = r.restaurant_id
            WHERE fav.user_id = %s
            ORDER BY fav.created_at DESC
            """,
            (user_id,)
        )
        favorites = serialize_rows(cursor.fetchall())
        return jsonify({"success": True, "favorites": favorites}), 200

    except Exception:
        app.logger.exception("Failed to fetch favorites")
        return jsonify({"success": False, "message": "Unable to fetch favorites"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/user/favorites", methods=["POST"])
def add_user_favorite():
    """Bookmark a restaurant to user favorites."""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Authentication required"}), 401

    data = request.get_json(silent=True) or {}
    restaurant_id = data.get("restaurant_id")
    if not restaurant_id:
        return jsonify({"success": False, "message": "restaurant_id is required"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO favorites (user_id, restaurant_id)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP
            """,
            (user_id, restaurant_id)
        )
        conn.commit()
        return jsonify({"success": True, "message": "Saved to favorites"}), 201

    except Exception:
        app.logger.exception("Failed to add favorite")
        return jsonify({"success": False, "message": "Unable to add favorite"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/user/favorites/<int:restaurant_id>", methods=["DELETE"])
def remove_user_favorite(restaurant_id):
    """Remove a restaurant from favorites."""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Authentication required"}), 401

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM favorites WHERE user_id = %s AND restaurant_id = %s", (user_id, restaurant_id))
        conn.commit()
        return jsonify({"success": True, "message": "Removed from favorites"}), 200

    except Exception:
        return jsonify({"success": False, "message": "Unable to remove favorite"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/user/preferences", methods=["GET", "PUT"])
def user_preferences_endpoint():
    """Get or update dietary and dining preferences."""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({"success": False, "message": "Authentication required"}), 401

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        if request.method == "GET":
            cursor.execute("SELECT * FROM user_preferences WHERE user_id = %s LIMIT 1", (user_id,))
            pref = cursor.fetchone()
            return jsonify({"success": True, "preferences": serialize_row(pref)}), 200

        data = request.get_json(silent=True) or {}
        dietary = data.get("dietary", "all")
        spice = data.get("spice_level", "any")
        budget = data.get("budget_tier", "any")
        tags = data.get("favorite_tags", "")

        cursor.execute(
            """
            INSERT INTO user_preferences (user_id, dietary, spice_level, budget_tier, favorite_tags)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                dietary = VALUES(dietary),
                spice_level = VALUES(spice_level),
                budget_tier = VALUES(budget_tier),
                favorite_tags = VALUES(favorite_tags)
            """,
            (user_id, dietary, spice, budget, tags)
        )
        conn.commit()
        return jsonify({"success": True, "message": "Preferences updated"}), 200

    except Exception:
        app.logger.exception("Failed to handle preferences")
        return jsonify({"success": False, "message": "Preferences operation failed"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/user/history", methods=["GET", "POST"])
def user_history_endpoint():
    """Get or record search history."""
    user_id = get_current_user_id()

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        if request.method == "GET":
            if not user_id:
                return jsonify({"success": True, "history": []}), 200
            cursor.execute(
                "SELECT query, created_at FROM search_history WHERE user_id = %s ORDER BY created_at DESC LIMIT 10",
                (user_id,)
            )
            return jsonify({"success": True, "history": serialize_rows(cursor.fetchall())}), 200

        data = request.get_json(silent=True) or {}
        query = data.get("query", "").strip()
        if query:
            cursor.execute(
                "INSERT INTO search_history (user_id, query, latitude, longitude) VALUES (%s, %s, %s, %s)",
                (user_id, query, data.get("latitude"), data.get("longitude"))
            )
            conn.commit()
        return jsonify({"success": True}), 201

    except Exception:
        return jsonify({"success": False}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 11. LEGACY NEARBY-RESTAURANTS ENDPOINT
# =====================================================================

@app.route("/api/nearby-restaurants", methods=["POST"])
def nearby_restaurants():
    """Haversine search across local MySQL restaurants."""
    data = request.get_json(silent=True) or {}

    try:
        latitude = float(data["latitude"])
        longitude = float(data["longitude"])
        radius_km = float(data.get("radius_km", 10))

        if (
            not math.isfinite(latitude)
            or not math.isfinite(longitude)
            or not math.isfinite(radius_km)
            or not -90 <= latitude <= 90
            or not -180 <= longitude <= 180
            or not 0 < radius_km <= 100
        ):
            raise ValueError("Invalid coordinates")

    except (KeyError, TypeError, ValueError):
        return jsonify({"success": False, "message": "Valid latitude and longitude are required"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT r.*,
                (
                    6371 * ACOS(
                        LEAST(1, GREATEST(-1,
                            COS(RADIANS(%s))
                            * COS(RADIANS(r.latitude))
                            * COS(RADIANS(r.longitude) - RADIANS(%s))
                            + SIN(RADIANS(%s))
                            * SIN(RADIANS(r.latitude))
                        ))
                    )
                ) AS distance_km
            FROM restaurants AS r
            WHERE r.latitude IS NOT NULL
              AND r.longitude IS NOT NULL
            HAVING distance_km <= %s
            ORDER BY distance_km ASC
            """,
            (latitude, longitude, latitude, radius_km)
        )
        restaurants = serialize_rows(cursor.fetchall())
        return jsonify({"success": True, "restaurants": restaurants}), 200

    except mysql.connector.Error:
        app.logger.exception("Nearby restaurant search failed")
        return jsonify({"success": False, "message": "Unable to find nearby restaurants."}), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 12. ERROR HANDLERS
# =====================================================================

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"success": False, "message": getattr(error, "description", "Bad request")}), 400


@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "message": "Endpoint not found"}), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"success": False, "message": "Method not allowed"}), 405


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "message": "Internal server error"}), 500


# =====================================================================
# 13. RUN APPLICATION
# =====================================================================

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("DEBUG", "False").lower() in ("true", "1")

    print(f" * Starting CraveSpot backend on http://{host}:{port}")
    print(f" * Target database: {os.getenv('DB_NAME', 'project')}")
    app.run(
        host=host,
        port=port,
        debug=debug
    )

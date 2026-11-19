"""
CraveSpot Backend Application
Framework: Flask + Flask-CORS + MySQL Connector
Database: project
"""

import os
import re
import math
import logging
from pathlib import Path
from decimal import Decimal
from datetime import datetime, date

import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# ---------------------------------------------------------------------
# Load Environment Variables from project root or current working dir
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

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "*")
CORS(app, resources={r"/*": {"origins": cors_origins}}, supports_credentials=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)


# =====================================================================
# 1. DATABASE CONNECTION
# =====================================================================

def get_db():
    """Create and return a new MySQL database connection."""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "CraveSpot"),
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
# 2. HOME / ROOT ROUTE
# =====================================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "name": "CraveSpot API",
        "version": "1.0.0",
        "database": os.getenv("DB_NAME", "CraveSpot"),
        "message": "CraveSpot Backend is Running!"
    }), 200


# =====================================================================
# 3. DATABASE HEALTH CHECK
# =====================================================================

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
            "database": os.getenv("DB_NAME", "CraveSpot"),
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
# 4. RESTAURANTS ENDPOINTS
# =====================================================================

@app.route("/api/restaurants", methods=["GET"])
def get_restaurants():
    """
    Fetch all restaurants, with optional query filters:
    - search: keyword search in name, cuisine, or address
    - cuisine: cuisine filter
    - city: address / city filter
    - veg_only: 1 or true
    - min_rating: minimum float rating
    - sort: rating, name
    """
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
        elif sort == "name":
            query += " ORDER BY name ASC"
        else:
            query += " ORDER BY restaurant_id ASC"

        cursor.execute(query, tuple(params))
        restaurants = serialize_rows(cursor.fetchall())
        return jsonify(restaurants), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch restaurants")
        return jsonify({
            "success": False,
            "message": "Unable to fetch restaurants"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/restaurants/<int:restaurant_id>", methods=["GET"])
def get_restaurant(restaurant_id):
    """Fetch details of a single restaurant by ID."""
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM restaurants WHERE restaurant_id = %s LIMIT 1",
            (restaurant_id,)
        )
        restaurant = cursor.fetchone()

        if not restaurant:
            return jsonify({
                "success": False,
                "message": f"Restaurant with ID {restaurant_id} not found"
            }), 404

        return jsonify(serialize_row(restaurant)), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch restaurant details")
        return jsonify({
            "success": False,
            "message": "Unable to fetch restaurant details"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/restaurants/<int:restaurant_id>/menu", methods=["GET"])
def get_restaurant_menu(restaurant_id):
    """Fetch menu items for a specific restaurant."""
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM menu_items
            WHERE restaurant_id = %s
            ORDER BY item_id ASC
            """,
            (restaurant_id,)
        )
        menu_items = serialize_rows(cursor.fetchall())
        return jsonify(menu_items), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch restaurant menu")
        return jsonify({
            "success": False,
            "message": "Unable to fetch restaurant menu"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 5. MENU ITEMS / DISHES ENDPOINTS
# =====================================================================

@app.route("/api/menu-items", methods=["GET"])
@app.route("/api/dishes", methods=["GET"])
def get_menu_items():
    """Fetch all menu items/dishes with optional filtering."""
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
        return jsonify({
            "success": False,
            "message": "Unable to fetch menu items"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route("/api/menu-items/<int:item_id>", methods=["GET"])
@app.route("/api/dishes/<int:item_id>", methods=["GET"])
def get_single_dish(item_id):
    """Fetch details of a single dish by ID."""
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT m.*, r.name AS restaurant_name, r.address AS restaurant_address
            FROM menu_items AS m
            LEFT JOIN restaurants AS r ON m.restaurant_id = r.restaurant_id
            WHERE m.item_id = %s
            LIMIT 1
            """,
            (item_id,)
        )
        dish = cursor.fetchone()

        if not dish:
            return jsonify({
                "success": False,
                "message": f"Dish with ID {item_id} not found"
            }), 404

        return jsonify(serialize_row(dish)), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch dish")
        return jsonify({
            "success": False,
            "message": "Unable to fetch dish"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 6. CATEGORIES ENDPOINT
# =====================================================================

@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Fetch food categories."""
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM categories ORDER BY category_id ASC")
        categories = serialize_rows(cursor.fetchall())
        return jsonify(categories), 200

    except mysql.connector.Error:
        app.logger.exception("Failed to fetch categories")
        return jsonify({
            "success": False,
            "message": "Unable to fetch categories"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 7. REVIEWS ENDPOINTS
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
        return jsonify({
            "success": False,
            "message": "Unable to fetch reviews"
        }), 500

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
    user_id = data.get("user_id")

    if not res_id:
        return jsonify({
            "success": False,
            "message": "Restaurant ID is required"
        }), 400

    if not user_name:
        return jsonify({
            "success": False,
            "message": "User name is required"
        }), 400

    try:
        rating = int(rating)
        if not 1 <= rating <= 5:
            raise ValueError()
    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Rating must be an integer between 1 and 5"
        }), 400

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

        # Update average restaurant rating
        cursor.execute(
            """
            UPDATE restaurants
            SET rating = (
                SELECT ROUND(AVG(rating), 1)
                FROM reviews
                WHERE restaurant_id = %s
            )
            WHERE restaurant_id = %s
            """,
            (res_id, res_id)
        )
        conn.commit()

        return jsonify({
            "success": True,
            "message": "Review submitted successfully"
        }), 201

    except mysql.connector.Error:
        if conn:
            conn.rollback()
        app.logger.exception("Failed to save review")
        return jsonify({
            "success": False,
            "message": "Unable to save review"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 8. USER REGISTRATION
# =====================================================================

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    phone = data.get("phone", "").strip()

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Name, email and password are required"
        }), 400

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify({
            "success": False,
            "message": "Please enter a valid email address"
        }), 400

    if len(password) < 6:
        return jsonify({
            "success": False,
            "message": "Password must be at least 6 characters"
        }), 400

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT user_id FROM users WHERE LOWER(email) = %s LIMIT 1",
            (email,)
        )

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "message": "Email is already registered"
            }), 409

        cursor.execute(
            """
            INSERT INTO users (name, email, password, phone)
            VALUES (%s, %s, %s, %s)
            """,
            (
                name,
                email,
                generate_password_hash(password),
                phone
            )
        )
        conn.commit()

        return jsonify({
            "success": True,
            "message": "Registration successful"
        }), 201

    except mysql.connector.Error:
        if conn:
            conn.rollback()
        app.logger.exception("Registration failed")
        return jsonify({
            "success": False,
            "message": "Unable to complete registration"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 9. USER LOGIN
# =====================================================================

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT user_id, name, email, password
            FROM users
            WHERE LOWER(email) = %s
            LIMIT 1
            """,
            (email,)
        )
        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401

        stored_password = user["password"]

        # Support Werkzeug password hashes, migrate plaintext if encountered
        if stored_password.startswith(("scrypt:", "pbkdf2:")):
            valid = check_password_hash(stored_password, password)
        else:
            valid = (stored_password == password)
            if valid:
                cursor.execute(
                    """
                    UPDATE users
                    SET password = %s
                    WHERE user_id = %s
                    """,
                    (
                        generate_password_hash(password),
                        user["user_id"]
                    )
                )
                conn.commit()

        if not valid:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "user_id": user["user_id"],
                "name": user["name"],
                "email": user["email"]
            }
        }), 200

    except mysql.connector.Error:
        app.logger.exception("Login failed")
        return jsonify({
            "success": False,
            "message": "Unable to process login"
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 10. FIND NEARBY RESTAURANTS (HAVERSINE DISTANCE)
# =====================================================================

@app.route("/api/nearby-restaurants", methods=["POST"])
def nearby_restaurants():
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
        return jsonify({
            "success": False,
            "message": "Valid latitude and longitude are required"
        }), 400

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

        return jsonify({
            "success": True,
            "restaurants": restaurants
        }), 200

    except mysql.connector.Error:
        app.logger.exception("Nearby restaurant search failed")
        return jsonify({
            "success": False,
            "message": "Unable to find nearby restaurants. Verify database coordinates."
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# =====================================================================
# 11. ERROR HANDLERS
# =====================================================================

@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        "success": False,
        "message": getattr(error, "description", "Bad request")
    }), 400


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "Endpoint not found"
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "success": False,
        "message": "Method not allowed"
    }), 405


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "message": "Internal server error"
    }), 500


# =====================================================================
# 12. RUN APPLICATION
# =====================================================================

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("DEBUG", "False").lower() in ("true", "1")

    print(f" * Starting CraveSpot backend on http://{host}:{port}")
    print(f" * Target database: {os.getenv('DB_NAME', 'CraveSpot')}")
    app.run(
        host=host,
        port=port,
        debug=debug
    )


import os
import re
import math
import logging

import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)


# ==================================================
# 1. DATABASE CONNECTION
# ==================================================

def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "food_website"),
        connection_timeout=5
    )


# ==================================================
# 2. HOME
# ==================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "CraveSpot Backend is Running!"
    })


# ==================================================
# 3. DATABASE HEALTH CHECK
# ==================================================

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
            "message": "MySQL connected successfully"
        })

    except mysql.connector.Error:
        app.logger.exception("Database health check failed")
        return jsonify({
            "success": False,
            "message": "Database connection failed"
        }), 503

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# ==================================================
# 4. GET ALL RESTAURANTS
# ==================================================

@app.route("/api/restaurants", methods=["GET"])
def get_restaurants():
    conn = None
    cursor = None

    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM restaurants")

        return jsonify(cursor.fetchall()), 200

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


# ==================================================
# 5. GET ALL MENU ITEMS
# ==================================================

@app.route("/api/menu-items", methods=["GET"])
def get_menu_items():
    conn = None
    cursor = None

    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM menu_items")

        return jsonify(cursor.fetchall()), 200

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


# ==================================================
# 6. GET MENU FOR A SPECIFIC RESTAURANT
# ==================================================

@app.route(
    "/api/restaurants/<int:restaurant_id>/menu",
    methods=["GET"]
)
def get_restaurant_menu(restaurant_id):
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
            """,
            (restaurant_id,)
        )

        return jsonify(cursor.fetchall()), 200

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


# ==================================================
# 7. USER REGISTRATION
# ==================================================

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


# ==================================================
# 8. USER LOGIN
# ==================================================

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

        # Support Werkzeug password hashes.
        # Temporarily migrate existing plaintext passwords.
        if stored_password.startswith(("scrypt:", "pbkdf2:")):
            valid = check_password_hash(stored_password, password)
        else:
            valid = stored_password == password

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


# ==================================================
# 9. FIND NEARBY RESTAURANTS USING USER LOCATION
# ==================================================

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

        restaurants = cursor.fetchall()

        return jsonify({
            "success": True,
            "restaurants": restaurants
        }), 200

    except mysql.connector.Error:
        app.logger.exception("Nearby restaurant search failed")
        return jsonify({
            "success": False,
            "message": (
                "Unable to find nearby restaurants. "
                "Check that restaurant latitude and longitude columns exist."
            )
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


# ==================================================
# 10. ERROR HANDLERS
# ==================================================

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


# ==================================================
# 11. START THE BACKEND
# ==================================================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )


from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)


# DATABASE CONNECTION
def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "bscr@123"),
        database=os.getenv("DB_NAME", "food_website")
    )


# HOME
@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "CraveSpot Backend is Running!"
    })


# HEALTH CHECK
@app.route("/api/health")
def health():
    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT 1")

        return jsonify({
            "success": True,
            "message": "Database connected"
        })
    except mysql.connector.Error:
        app.logger.exception("Database health check failed")
        return jsonify({
            "success": False,
            "message": "Database connection failed"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


# LIVE RESTAURANTS
@app.route("/api/restaurants", methods=["GET"])
def get_restaurants():
    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT *
            FROM restaurants
            WHERE is_live = TRUE
        """
        params = []

        search = request.args.get("search", "").strip()
        if search:
            query += " AND (name LIKE %s OR cuisine LIKE %s)"
            params.extend([f"%{search}%", f"%{search}%"])

        city = request.args.get("city", "").strip()
        if city:
            query += " AND city = %s"
            params.append(city)

        if request.args.get("open_only", "false").lower() == "true":
            query += " AND is_open = TRUE"

        query += " ORDER BY restaurant_id DESC"

        cursor.execute(query, tuple(params))
        return jsonify(cursor.fetchall())

    except mysql.connector.Error:
        app.logger.exception("Could not fetch restaurants")
        return jsonify({
            "success": False,
            "message": "Could not fetch restaurants"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


# SINGLE RESTAURANT
@app.route("/api/restaurants/<int:restaurant_id>", methods=["GET"])
def get_restaurant(restaurant_id):
    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM restaurants
            WHERE restaurant_id = %s
              AND is_live = TRUE
        """, (restaurant_id,))

        restaurant = cursor.fetchone()

        if not restaurant:
            return jsonify({
                "success": False,
                "message": "Restaurant not found"
            }), 404

        return jsonify(restaurant)

    except mysql.connector.Error:
        app.logger.exception("Could not fetch restaurant")
        return jsonify({
            "success": False,
            "message": "Could not fetch restaurant"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


# ALL AVAILABLE MENU ITEMS
@app.route("/api/menu-items", methods=["GET"])
def get_menu_items():
    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        query = """
            SELECT m.*
            FROM menu_items AS m
            INNER JOIN restaurants AS r
                ON m.restaurant_id = r.restaurant_id
            WHERE r.is_live = TRUE
              AND m.is_available = TRUE
        """
        params = []

        restaurant_id = request.args.get("restaurant_id", type=int)
        if restaurant_id is not None:
            query += " AND m.restaurant_id = %s"
            params.append(restaurant_id)

        search = request.args.get("search", "").strip()
        if search:
            query += " AND m.name LIKE %s"
            params.append(f"%{search}%")

        if request.args.get("veg_only", "false").lower() == "true":
            query += " AND m.is_veg = TRUE"

        query += " ORDER BY m.restaurant_id, m.name"

        cursor.execute(query, tuple(params))
        return jsonify(cursor.fetchall())

    except mysql.connector.Error:
        app.logger.exception("Could not fetch menu items")
        return jsonify({
            "success": False,
            "message": "Could not fetch menu items"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


# MENU FOR A PARTICULAR RESTAURANT
@app.route(
    "/api/restaurants/<int:restaurant_id>/menu",
    methods=["GET"]
)
def restaurant_menu(restaurant_id):
    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT restaurant_id
            FROM restaurants
            WHERE restaurant_id = %s
              AND is_live = TRUE
        """, (restaurant_id,))

        if not cursor.fetchone():
            return jsonify({
                "success": False,
                "message": "Restaurant not found"
            }), 404

        cursor.execute("""
            SELECT m.*
            FROM menu_items AS m
            INNER JOIN restaurants AS r
                ON m.restaurant_id = r.restaurant_id
            WHERE m.restaurant_id = %s
              AND r.is_live = TRUE
              AND m.is_available = TRUE
            ORDER BY m.name
        """, (restaurant_id,))

        return jsonify(cursor.fetchall())

    except mysql.connector.Error:
        app.logger.exception("Could not fetch restaurant menu")
        return jsonify({
            "success": False,
            "message": "Could not fetch restaurant menu"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


# RESTAURANT MAP DATA
@app.route("/api/restaurants/map", methods=["GET"])
def restaurant_map():
    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                restaurant_id,
                name,
                cuisine,
                city,
                is_open,
                latitude,
                longitude,
                image_url,
                delivery_time,
                average_rating
            FROM restaurants
            WHERE is_live = TRUE
              AND latitude IS NOT NULL
              AND longitude IS NOT NULL
        """)

        return jsonify(cursor.fetchall())

    except mysql.connector.Error:
        app.logger.exception("Could not fetch map locations")
        return jsonify({
            "success": False,
            "message": "Could not fetch map locations"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


# RESTAURANT OPEN/CLOSED STATUS
# Add owner/admin authentication before public deployment.
@app.route(
    "/api/restaurants/<int:restaurant_id>/availability",
    methods=["PATCH"]
)
def update_availability(restaurant_id):
    data = request.get_json(silent=True) or {}

    if not isinstance(data.get("is_open"), bool):
        return jsonify({
            "success": False,
            "message": "is_open must be true or false"
        }), 400

    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute("""
            UPDATE restaurants
            SET is_open = %s
            WHERE restaurant_id = %s
        """, (data["is_open"], restaurant_id))

        if cursor.rowcount == 0:
            db.rollback()
            return jsonify({
                "success": False,
                "message": "Restaurant not found"
            }), 404

        db.commit()

        return jsonify({
            "success": True,
            "restaurant_id": restaurant_id,
            "is_open": data["is_open"]
        })

    except mysql.connector.Error:
        if db:
            db.rollback()

        app.logger.exception("Could not update availability")
        return jsonify({
            "success": False,
            "message": "Could not update availability"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


# CUSTOMER LOGIN
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # Compatible with your existing plaintext-password table.
        # Migrate to password hashing before production deployment.
        cursor.execute("""
            SELECT user_id, name, email
            FROM users
            WHERE email = %s AND password = %s
        """, (email, password))

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": user
        })

    except mysql.connector.Error:
        app.logger.exception("Login failed")
        return jsonify({
            "success": False,
            "message": "Login failed"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


# CUSTOMER REGISTRATION
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Name, email and password are required"
        }), 400

    db = None
    cursor = None

    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT user_id
            FROM users
            WHERE email = %s
        """, (email,))

        if cursor.fetchone():
            return jsonify({
                "success": False,
                "message": "An account with this email already exists"
            }), 409

        # Compatible with your current database schema.
        # Store password hashes instead for production.
        cursor.execute("""
            INSERT INTO users (name, email, password, phone)
            VALUES (%s, %s, %s, %s)
        """, (name, email, password, phone))

        db.commit()

        return jsonify({
            "success": True,
            "message": "Account created successfully"
        }), 201

    except mysql.connector.IntegrityError:
        if db:
            db.rollback()

        return jsonify({
            "success": False,
            "message": "An account with this email already exists"
        }), 409

    except mysql.connector.Error:
        if db:
            db.rollback()

        app.logger.exception("Registration failed")
        return jsonify({
            "success": False,
            "message": "Registration failed"
        }), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()


# RUN SERVER
if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )

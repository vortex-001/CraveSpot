from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


# ---------------- DATABASE CONNECTION ----------------

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="bscr@123",
        database="food_website"
    )


# ---------------- HOME ----------------

@app.route("/")
def home():
    return jsonify({
        "message": "CraveSpot Backend is Running!"
    })


# ---------------- RESTAURANTS ----------------

@app.route("/api/restaurants", methods=["GET"])
def get_restaurants():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM restaurants
    """)

    restaurants = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(restaurants)


# ---------------- MENU ITEMS ----------------

@app.route("/api/menu-items", methods=["GET"])
def get_menu_items():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM menu_items
    """)

    items = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(items)


# ---------------- RESTAURANT MENU ----------------

@app.route(
    "/api/restaurants/<int:restaurant_id>/menu",
    methods=["GET"]
)
def restaurant_menu(restaurant_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM menu_items
        WHERE restaurant_id = %s
    """, (restaurant_id,))

    items = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(items)


# ---------------- LOGIN ----------------

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT user_id, name, email
        FROM users
        WHERE email = %s AND password = %s
    """, (email, password))

    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user:

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": user
        })

    return jsonify({
        "success": False,
        "message": "Invalid email or password"
    }), 401


# ---------------- REGISTRATION ----------------

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")


    # Check required fields

    if not name or not email or not password:

        return jsonify({
            "success": False,
            "message": "Name, email and password are required"
        }), 400


    db = get_db()
    cursor = db.cursor(dictionary=True)


    # Check if email already exists

    cursor.execute("""
        SELECT user_id
        FROM users
        WHERE email = %s
    """, (email,))

    existing_user = cursor.fetchone()


    if existing_user:

        cursor.close()
        db.close()

        return jsonify({
            "success": False,
            "message": "An account with this email already exists"
        }), 409


    # Create new user

    cursor.execute("""
        INSERT INTO users
        (name, email, password, phone)
        VALUES (%s, %s, %s, %s)
    """, (
        name,
        email,
        password,
        phone
    ))


    db.commit()

    cursor.close()
    db.close()


    return jsonify({
        "success": True,
        "message": "Account created successfully"
    }), 201


# ---------------- RUN SERVER ----------------

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
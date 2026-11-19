"""
Automated Test Suite for CraveSpot Backend
Using Python's standard unittest framework (zero extra test dependencies).
"""

import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

# Ensure backend can be imported
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "backend"))

from werkzeug.security import generate_password_hash
from backend.app import app


class CraveSpotBackendTests(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    # =====================================================================
    # 1. Root & Health Check Tests
    # =====================================================================

    def test_home_route(self):
        """Test GET / returns 200, confirmation message, and database 'CraveSpot'."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertIn("CraveSpot", data["message"])
        self.assertEqual(data["database"], "CraveSpot")

    def test_health_check_handles_db_failure_gracefully(self):
        """Test GET /api/health returns 503 structured JSON if MySQL is down."""
        with patch("backend.app.get_db") as mock_get_db:
            import mysql.connector
            mock_get_db.side_effect = mysql.connector.Error("Connection refused")
            response = self.client.get("/api/health")
            self.assertEqual(response.status_code, 503)
            data = response.get_json()
            self.assertFalse(data["success"])
            self.assertIn("Database connection failed", data["message"])

    def test_health_check_success(self):
        """Test GET /api/health when DB is healthy."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchone.return_value = (1,)
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.get("/api/health")
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(data["database"], "CraveSpot")

    # =====================================================================
    # 2. Registration Validation Tests
    # =====================================================================

    def test_register_missing_fields(self):
        """Test register fails when required fields are missing."""
        response = self.client.post("/api/register", json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("required", response.get_json()["message"])

    def test_register_invalid_email(self):
        """Test register fails when email format is invalid."""
        response = self.client.post("/api/register", json={
            "name": "Test User",
            "email": "not-an-email",
            "password": "Password123"
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("valid email", response.get_json()["message"])

    def test_register_short_password(self):
        """Test register fails when password is less than 6 chars."""
        response = self.client.post("/api/register", json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "123"
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("at least 6 characters", response.get_json()["message"])

    def test_register_success(self):
        """Test successful user registration with mocked DB."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchone.return_value = None  # No existing user
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.post("/api/register", json={
                "name": "Jane Doe",
                "email": "jane@example.com",
                "password": "SecurePassword123",
                "phone": "9876543210"
            })
            self.assertEqual(response.status_code, 201)
            self.assertTrue(response.get_json()["success"])

    def test_register_duplicate_email(self):
        """Test register rejects duplicate emails."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchone.return_value = (1,)  # Existing user found
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.post("/api/register", json={
                "name": "Jane Doe",
                "email": "jane@example.com",
                "password": "SecurePassword123"
            })
            self.assertEqual(response.status_code, 409)
            self.assertIn("already registered", response.get_json()["message"])

    # =====================================================================
    # 3. Login Validation & Auth Tests
    # =====================================================================

    def test_login_missing_fields(self):
        """Test login fails when fields are omitted."""
        response = self.client.post("/api/login", json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("required", response.get_json()["message"])

    def test_login_user_not_found(self):
        """Test login fails with 401 when user does not exist."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchone.return_value = None
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.post("/api/login", json={
                "email": "nobody@example.com",
                "password": "Password123"
            })
            self.assertEqual(response.status_code, 401)
            self.assertIn("Invalid", response.get_json()["message"])

    def test_login_success(self):
        """Test successful login with password hash verification."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            hashed_pw = generate_password_hash("Password123")
            mock_cursor.fetchone.return_value = {
                "user_id": 1,
                "name": "Harsh Garg",
                "email": "demo@cravespot.com",
                "password": hashed_pw
            }
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.post("/api/login", json={
                "email": "demo@cravespot.com",
                "password": "Password123"
            })
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(data["user"]["name"], "Harsh Garg")

    def test_login_invalid_password(self):
        """Test login fails with 401 when password does not match."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            hashed_pw = generate_password_hash("CorrectPassword")
            mock_cursor.fetchone.return_value = {
                "user_id": 1,
                "name": "Harsh Garg",
                "email": "demo@cravespot.com",
                "password": hashed_pw
            }
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.post("/api/login", json={
                "email": "demo@cravespot.com",
                "password": "WrongPassword"
            })
            self.assertEqual(response.status_code, 401)
            self.assertIn("Invalid", response.get_json()["message"])

    # =====================================================================
    # 4. Nearby Restaurants (Haversine) Tests
    # =====================================================================

    def test_nearby_restaurants_invalid_coords(self):
        """Test invalid coordinates return 400."""
        response = self.client.post("/api/nearby-restaurants", json={
            "latitude": 999.0,
            "longitude": 76.77
        })
        self.assertEqual(response.status_code, 400)

    def test_nearby_restaurants_valid(self):
        """Test nearby restaurants returns list when coords valid."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchall.return_value = [
                {"restaurant_id": 1, "name": "Spice Garden", "distance_km": 1.2}
            ]
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.post("/api/nearby-restaurants", json={
                "latitude": 30.74,
                "longitude": 76.76
            })
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.get_json()["restaurants"]), 1)

    # =====================================================================
    # 5. Restaurant & Menu Endpoints Tests
    # =====================================================================

    def test_get_restaurants(self):
        """Test GET /api/restaurants returns restaurant list."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchall.return_value = [
                {"restaurant_id": 1, "name": "Spice Garden", "rating": 4.5}
            ]
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.get("/api/restaurants")
            self.assertEqual(response.status_code, 200)
            items = response.get_json()
            self.assertIsInstance(items, list)
            self.assertEqual(items[0]["name"], "Spice Garden")

    def test_get_single_restaurant_not_found(self):
        """Test GET /api/restaurants/<id> returns 404 if missing."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchone.return_value = None
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.get("/api/restaurants/9999")
            self.assertEqual(response.status_code, 404)

    def test_get_single_restaurant_success(self):
        """Test GET /api/restaurants/<id> returns restaurant object."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchone.return_value = {
                "restaurant_id": 1,
                "name": "Spice Garden",
                "cuisine": "North Indian",
                "address": "Sector 17, Chandigarh"
            }
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.get("/api/restaurants/1")
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertEqual(data["restaurant_id"], 1)
            self.assertEqual(data["name"], "Spice Garden")

    def test_get_restaurant_menu(self):
        """Test GET /api/restaurants/<id>/menu returns menu items."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchall.return_value = [
                {"item_id": 1, "restaurant_id": 1, "name": "Paneer Butter Masala", "price": 249.00}
            ]
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.get("/api/restaurants/1/menu")
            self.assertEqual(response.status_code, 200)
            menu = response.get_json()
            self.assertEqual(len(menu), 1)
            self.assertEqual(menu[0]["name"], "Paneer Butter Masala")

    def test_get_categories(self):
        """Test GET /api/categories returns categories list."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchall.return_value = [
                {"category_id": 1, "name": "Biryani"},
                {"category_id": 2, "name": "Pizza"}
            ]
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.get("/api/categories")
            self.assertEqual(response.status_code, 200)
            cats = response.get_json()
            self.assertEqual(len(cats), 2)
            self.assertEqual(cats[0]["name"], "Biryani")

    # =====================================================================
    # 6. Error Handlers Tests
    # =====================================================================

    def test_404_handler(self):
        """Test 404 handler returns clean JSON message."""
        response = self.client.get("/api/non-existent-endpoint")
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertFalse(data["success"])
        self.assertIn("not found", data["message"].lower())


if __name__ == "__main__":
    unittest.main()

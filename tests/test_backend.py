"""
Automated Test Suite for CraveSpot Backend
Using Python's standard unittest framework.
Tests:
- API routes, validation, and error handlers
- Craving recommendation engine & taxonomy
- Geolocation and geocoding endpoints
- User authentication, tokens, and rate-limiting
- Security headers
"""

import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(PROJECT_ROOT / "backend"))

from werkzeug.security import generate_password_hash
from backend.app import app, TOKEN_SERIALIZER


class CraveSpotBackendTests(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    # =====================================================================
    # 1. Root & Health Check & Security Headers Tests
    # =====================================================================

    def test_home_route(self):
        """Test GET / returns 200, confirmation message, and database 'CraveSpot'."""
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertIn("CraveSpot", data["message"])
        self.assertEqual(data["database"], "CraveSpot")

    def test_security_headers_present(self):
        """Verify that security headers are injected into HTTP responses."""
        response = self.client.get("/")
        self.assertEqual(response.headers.get("X-Content-Type-Options"), "nosniff")
        self.assertEqual(response.headers.get("X-Frame-Options"), "SAMEORIGIN")
        self.assertEqual(response.headers.get("X-XSS-Protection"), "1; mode=block")

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
    # 2. Craving Recommendation Engine Tests
    # =====================================================================

    def test_cravings_recommendation_flow(self):
        """Test natural language craving search endpoint."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchall.return_value = [
                {
                    "item_id": 1,
                    "restaurant_id": 1,
                    "name": "Classic Double Cheese Margherita",
                    "description": "Cheesy pizza with mozzarella",
                    "tags": "pizza,cheesy,cheese",
                    "price": 280.0,
                    "is_veg": 1,
                    "rating": 4.6,
                    "restaurant_name": "Pizza Corner",
                    "restaurant_address": "Sector 22, Chandigarh",
                    "restaurant_rating": 4.4,
                    "restaurant_latitude": 30.7333,
                    "restaurant_longitude": 76.7794
                },
                {
                    "item_id": 2,
                    "restaurant_id": 2,
                    "name": "Fiery Chilli Chicken Dry",
                    "description": "Extra spicy chicken",
                    "tags": "chicken,spicy,fiery",
                    "price": 240.0,
                    "is_veg": 0,
                    "rating": 4.5,
                    "restaurant_name": "Wok Express",
                    "restaurant_address": "Sector 35, Chandigarh",
                    "restaurant_rating": 4.2,
                    "restaurant_latitude": 30.7224,
                    "restaurant_longitude": 76.7688
                }
            ]
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            # Query for cheesy vegetarian pizza
            response = self.client.post("/api/cravings/recommend", json={
                "query": "I want cheesy veg pizza",
                "latitude": 30.7333,
                "longitude": 76.7794
            })
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertTrue(data["success"])
            self.assertGreater(data["count"], 0)
            top_rec = data["recommendations"][0]
            self.assertEqual(top_rec["name"], "Classic Double Cheese Margherita")
            self.assertIn("match_reason", top_rec)

    def test_cravings_surprise_me(self):
        """Test surprise me endpoint returns a valid random pick."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchall.return_value = [
                {
                    "item_id": 1,
                    "restaurant_id": 1,
                    "name": "Hyderabadi Dum Biryani",
                    "price": 220.0,
                    "is_veg": 0,
                    "rating": 4.8,
                    "restaurant_name": "Urban Tadka",
                    "restaurant_address": "Sector 17, Chandigarh"
                }
            ]
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.get("/api/cravings/surprise-me")
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertTrue(data["success"])
            self.assertIn("surprise", data)
            self.assertIn("surprise_message", data["surprise"])

    def test_cravings_taxonomy(self):
        """Test taxonomy endpoint returns categories."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchall.return_value = [
                {"craving_id": 1, "title": "Spicy & Fiery", "icon": "flame"},
                {"craving_id": 2, "title": "Cheesy & Gooey", "icon": "cheese"}
            ]
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.get("/api/cravings/taxonomy")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.get_json()["cravings"]), 2)

    # =====================================================================
    # 3. Location & Geocoding Tests
    # =====================================================================

    def test_location_geocode_success(self):
        """Test geocoding a known city returns coordinates."""
        response = self.client.get("/api/location/geocode?q=Chandigarh")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertIn("latitude", data["location"])
        self.assertIn("longitude", data["location"])

    def test_location_geocode_missing_param(self):
        """Test geocode returns 400 when query parameter is omitted."""
        response = self.client.get("/api/location/geocode")
        self.assertEqual(response.status_code, 400)

    # =====================================================================
    # 4. User Authentication & Profile Tests
    # =====================================================================

    def test_register_validation(self):
        """Test registration field requirements."""
        response = self.client.post("/api/register", json={})
        self.assertEqual(response.status_code, 400)

        response = self.client.post("/api/register", json={
            "name": "Test",
            "email": "invalid-email",
            "password": "Password123"
        })
        self.assertEqual(response.status_code, 400)

    def test_login_success_returns_token(self):
        """Test login returns signed bearer token."""
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            hashed_pw = generate_password_hash("Password123")
            mock_cursor.fetchone.return_value = {
                "user_id": 1,
                "name": "Harsh Garg",
                "email": "demo@cravespot.com",
                "password": hashed_pw,
                "role": "user"
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
            self.assertIn("token", data)
            self.assertEqual(data["user"]["name"], "Harsh Garg")

    def test_favorites_unauthorized_without_token(self):
        """Test protected favorites endpoint returns 401 if unauthenticated."""
        response = self.client.get("/api/user/favorites")
        self.assertEqual(response.status_code, 401)

    def test_favorites_authorized_with_token(self):
        """Test favorites endpoint works with signed bearer token."""
        token = TOKEN_SERIALIZER.dumps({"user_id": 1, "email": "demo@cravespot.com"})
        with patch("backend.app.get_db") as mock_get_db:
            mock_conn = MagicMock()
            mock_cursor = MagicMock()
            mock_conn.cursor.return_value = mock_cursor
            mock_cursor.fetchall.return_value = [
                {"favorite_id": 1, "restaurant_id": 1, "restaurant_name": "Spice Garden"}
            ]
            mock_conn.is_connected.return_value = True
            mock_get_db.return_value = mock_conn

            response = self.client.get("/api/user/favorites", headers={"Authorization": f"Bearer {token}"})
            self.assertEqual(response.status_code, 200)
            data = response.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(len(data["favorites"]), 1)

    # =====================================================================
    # 5. Restaurants & Error Handlers
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
            self.assertEqual(len(items), 1)

    def test_404_handler(self):
        """Test 404 handler returns clean JSON."""
        response = self.client.get("/api/non-existent-endpoint")
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertFalse(data["success"])


if __name__ == "__main__":
    unittest.main()

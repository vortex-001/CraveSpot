# 🍴 CraveSpot

### **The Ultimate Food Discovery & Craving Finder**

> **"Find what you're craving. Discover where to get it."**

CraveSpot is a full-stack, production-grade food discovery platform designed to connect hunger and immediate cravings directly with local restaurants, dishes, and street food gems. Unlike standard restaurant aggregators that push sponsored listings, CraveSpot centers on **craving-based discovery**—matching users by taste, texture, mood, budget, and dietary preference, alongside live geolocation-based discovery.

---

## 👥 Team — The Confluence

| Member | Role |
|---|---|
| **Harsh Garg** | Team Leader & System Architect |
| **Simran** | Frontend Engineer |
| **Taranpreet** | Frontend Engineer |
| **Anshita** | Backend Developer |
| **Divya** | Backend Developer |
| **Babishya** | Database Engineer |
| **Anshuman** | Database Engineer |
| **Majid** | QA & Test Automation |

**Project:** CraveSpot Full-Stack Food Discovery Platform  
**Course:** B.Tech Computer Science & Engineering (DBMS Project)  
**Academic Year:** 2026  

---

## 📌 Problem Statement & Core Vision

Standard food apps assume you already know which restaurant brand you want to order from. In real life:
- When hunger hits, people think in **cravings**: *"I want something spicy and crispy under ₹200"*, *"I'm craving late-night cheesy pizza"*, or *"I want homestyle comfort food"*.
- Information is fragmented: prices, ratings, vegetarian/non-vegetarian flags, and real physical distances are often hidden behind ads or checkout funnels.
- Students and food lovers need quick budget filters and authentic local discoveries.

### 💡 The CraveSpot Solution
CraveSpot makes **craving-based discovery** the central experience:
1. **Natural Language Craving Parser:** Understands tastes (*spicy, cheesy, sweet, tangy, creamy*), textures (*crispy, crunchy*), moods (*comfort, late-night*), dietary restrictions (*pure veg, non-veg*), and maximum budgets (*"under 200"*).
2. **Multi-Factor Recommendation Algorithm:** Calculates a 0–100 matching score for every candidate dish, with human-readable match explanations (e.g., *"Matches spicy craving; Fits under ₹200 budget; High 4.7★ rating"*).
3. **Live Geolocation & Real-World Discovery:** Queries the OpenStreetMap Overpass API and Nominatim geocoder to show real restaurants nearby with live Haversine walking/driving distances, with seamless automatic fallback to the local database.
4. **Interactive "Surprise Me!" Feature:** Helps indecisive diners by picking a top-rated, crave-worthy dish nearby.
5. **Full Account, Profile & Dietary Preferences Management:** Persists spice tolerance, dietary choices (veg/non-veg/jain), favorite cuisines, and saved wishlists.

---

## ✨ Key Features

- 🧠 **Smart Craving Discovery Engine** — Search dishes by natural phrases like *"spicy momos"*, *"cheesy burger under 250"*, or *"comfort food"*.
- 🎲 **Surprise Me! Modal** — Instant dish recommendation with one click from any page.
- 📍 **Live Geolocation & City Selector** — Browser GPS auto-detection, city selection (Chandigarh, Mohali, Panchkula, Ludhiana, Delhi, etc.), and reverse geocoding.
- 🗺️ **Real-World Live Places Integration** — Live Overpass API queries with zero external API key requirements.
- 🏪 **Comprehensive Restaurant Directory** — Filter by distance, rating, price tier, pure vegetarian status, and cuisine types.
- 🍽️ **Dish Catalog & Detailed Dish View** — Deep-dive pages showing ingredients, nutritional badges, category tags, vendor information, and simulated reviews.
- ❤️ **Saved Wishlist / Favorites** — Dual-tab bookmarking for both dishes and restaurants with local storage and backend sync.
- 👤 **User Profile & Preference Center** — Custom spice tolerance slider, dietary switches, profile information, and recent search history.
- 🔐 **Secure Token Authentication** — Signed session bearer tokens (`itsdangerous`), password hashing (`Werkzeug scrypt`), and rate limiting.
- 🛡️ **Cybersecurity Defenses** — Parameterized SQL queries (preventing SQL injection), XSS-safe DOM scripting, and HTTP security headers (`nosniff`, `SAMEORIGIN`, `1; mode=block`).
- 📄 **Complete Static Suite** — Dedicated About, Contact / Partner, Privacy Policy, Terms of Service, and custom 404 Error pages.

---

## 🛠️ Technology Stack

### Frontend
- **HTML5 & CSS3** — Semantic HTML, CSS variables, fluid responsive grid, glassmorphism cards.
- **JavaScript (ES6+)** — Modular architecture (`api.js`, `app.js`, `restaurants.js`, `dishes.js`, `details.js`, `dish-details.js`, `favorites.js`, `login.js`, `register.js`).
- **Development Server** — Python `http.server` on port **5500** (Zero Node.js runtime required).

### Backend
- **Python 3.10+** (Fully compatible with Python 3.14).
- **Flask 3.1+** — Lightweight, high-performance WSGI microframework.
- **Flask-CORS** — Cross-Origin Resource Sharing for seamless frontend-backend integration.
- **mysql-connector-python** — Official MySQL connector with connection pooling and dictionary cursors.
- **python-dotenv** — Secure environment variable management.
- **Werkzeug** — Cryptographic password hashing (`scrypt`).
- **itsdangerous** — Signed, timestamped token serialization for stateless sessions.

### Database
- **MySQL Server 8.0+**
- **Database Name:** `project` (Strictly enforced)
- **Schema & Seeding:** `database/schema.sql` (13 normalized tables, foreign keys with `CASCADE`, composite indexes, and rich Indian culinary seed data).

---

## 🧩 Architecture Diagram

```mermaid
flowchart TD
    User([User Browser])

    subgraph Client ["Frontend Client (Port 5500)"]
        HTML["Pages (index, restaurants, dishes, profile, etc.)"]
        API_JS["api.js (Central HTTP Client & Token Handler)"]
        APP_JS["app.js (Geolocation, Search, Surprise Me)"]
    end

    subgraph Server ["Backend WSGI Application (Port 5000)"]
        Flask["Flask App (backend/app.py)"]
        AuthMiddleware["Auth & Rate Limiter"]
        CravingEngine["Craving Recommendation Engine (craving_engine.py)"]
        PlacesService["Live Places & Geocoding Service (places_service.py)"]
    end

    subgraph External ["External Live Services (Zero API Keys)"]
        OSM["OpenStreetMap Overpass API"]
        Nominatim["OSM Nominatim Geocoder"]
    end

    subgraph Storage ["MySQL Database (Port 3306)"]
        DB[(Database: project)]
        T1[(users & user_profiles)]
        T2[(restaurants & locations)]
        T3[(food_items & categories)]
        T4[(cravings & cuisines)]
        T5[(favorites & reviews)]
    end

    User -->|Views / Interacts| HTML
    HTML -->|Calls| APP_JS
    APP_JS -->|Requests| API_JS
    API_JS -->|REST API Calls (Bearer Token)| Flask
    Flask --> AuthMiddleware
    Flask --> CravingEngine
    Flask --> PlacesService
    PlacesService -.->|Live Query| OSM
    PlacesService -.->|Geocoding| Nominatim
    CravingEngine -->|Reads Data| DB
    PlacesService -->|Local Fallback| DB
    Flask -->|Parameterized SQL| DB
    DB --> T1
    DB --> T2
    DB --> T3
    DB --> T4
    DB --> T5
```

---

## 📂 Project Directory Structure

```text
CraveSpot_Complete/
│
├── .env                       # Local environment variables (DB credentials)
├── .env.example               # Template for environment configuration
├── .gitignore                 # Protects credentials, venv, and cache
├── requirements.txt           # Python dependencies
├── init_db.py                 # Automated MySQL database setup script
├── setup.bat                  # One-click Windows setup & installation script
├── run_backend.bat            # One-click Windows backend launcher (Port 5000)
├── run_frontend.bat           # One-click Windows frontend launcher (Port 5500)
│
├── backend/
│   ├── app.py                 # Core Flask REST API application
│   └── services/
│       ├── craving_engine.py  # NLP craving parser & scoring algorithm
│       └── places_service.py  # OpenStreetMap live places & geocoder
│
├── database/
│   └── schema.sql             # 13-table relational schema & seed data
│
├── frontend/
│   ├── index.html             # Homepage / Craving Discovery Hub
│   ├── css/
│   │   ├── style.css          # Main styling & design system
│   │   ├── categories.css     # Category grid styling
│   │   ├── dishes.css         # Dish catalog styling
│   │   ├── dish-details.css   # Dish detail view styling
│   │   ├── restaurants.css    # Restaurant listing styling
│   │   ├── details.css        # Restaurant details styling
│   │   ├── favorites.css      # Saved wishlist styling
│   │   └── login.css          # Auth styling
│   ├── js/
│   │   ├── api.js             # Central API client, token manager, toasts
│   │   ├── app.js             # Shared interactions, geolocator, surprise me
│   │   ├── categories.js      # Category browsing controller
│   │   ├── dishes.js          # Dish filtering & search controller
│   │   ├── dish-details.js    # Dish details & reviews controller
│   │   ├── restaurants.js     # Restaurant directory & craving router
│   │   ├── details.js         # Restaurant menu & review submission
│   │   ├── favorites.js       # Saved dishes and restaurants manager
│   │   ├── login.js           # Secure login submission controller
│   │   └── register.js        # Registration submission controller
│   └── pages/
│       ├── restaurants.html   # Restaurant directory
│       ├── restaurant-details.html # Restaurant details & live menu
│       ├── dishes.html        # Dish catalog & craving search
│       ├── dish-details.html  # Single dish deep-dive
│       ├── categories.html    # Food category explorer
│       ├── favorites.html     # Saved wishlist
│       ├── profile.html       # User profile & dining preferences
│       ├── login.html         # User sign-in
│       ├── register.html      # User registration
│       ├── about.html         # About the project & vision
│       ├── contact.html       # Feedback & restaurant partnership
│       ├── privacy.html       # Privacy policy
│       ├── terms.html         # Terms of service
│       └── 404.html           # Custom 404 error page
│
├── tests/
│   └── test_backend.py        # Automated test suite (15 unit tests)
│
└── docs/                      # Project briefs, specifications, and design assets
```

---

## 🗄️ Database Schema & Data Dictionary

Target Database Name: **`project`**

The database is normalized across **13 relational tables and views**:

1. **`users`** — Primary user credentials (`user_id`, `name`, `email`, `password` scrypt hash, `phone`, `role`, timestamps).
2. **`user_profiles`** — Detailed user profile (`profile_id`, `user_id`, `avatar_url`, `city`, `address`, `bio`).
3. **`user_preferences`** — Dining preferences (`preference_id`, `user_id`, `dietary_type`, `spice_tolerance`, `max_budget`, `favorite_cuisines`).
4. **`food_categories`** — Master category catalog (`category_id`, `name`, `description`, `icon`, `image_url`).
5. **`categories`** — Compatibility view ensuring backward compatibility for legacy queries.
6. **`cuisines`** — Master cuisine taxonomy (`cuisine_id`, `name`, `description`, `origin_region`).
7. **`cravings`** — Flavor, texture, and mood tags (`craving_id`, `tag`, `title`, `description`, `taste_profile`, `texture_profile`, `mood`).
8. **`restaurants`** — Verified restaurant partners (`restaurant_id`, `name`, `cuisine`, `address`, `rating`, `is_veg`, `offer`, `price_for_two`, `opening_hours`, `contact_phone`, `is_open`).
9. **`restaurant_locations`** — Geolocation coordinates (`location_id`, `restaurant_id`, `latitude`, `longitude`, `city`, `area`, `pincode`).
10. **`restaurant_cuisines`** — Many-to-many junction (`restaurant_id`, `cuisine_id`).
11. **`food_items`** — Dish catalog (`item_id`, `restaurant_id`, `category_id`, `name`, `description`, `price`, `image_url`, `is_veg`, `rating`, `tags`, `spice_level`, `calories`, `is_available`).
12. **`menu_items`** — Compatibility view mapping `food_items` to legacy column names.
13. **`favorites`** — User wishlist bookmarks (`favorite_id`, `user_id`, `item_id`, `restaurant_id`).
14. **`search_history`** — Recent search and craving history (`history_id`, `user_id`, `query_text`, `search_type`).
15. **`reviews`** — Customer reviews and star ratings (`review_id`, `restaurant_id`, `user_id`, `user_name`, `rating`, `comment`).

---

## 🚀 Quick Start Guide (Windows 11)

### Prerequisites
1. **Python 3.10+** (Python 3.14 tested and supported).
2. **MySQL Server 8.0+** running locally on port `3306`.
3. **MySQL Workbench** or command-line client.

---

### Step 1: Automated Setup

Double-click `setup.bat` (or execute from terminal):

```cmd
setup.bat
```

This will automatically:
1. Verify Python is installed and accessible in `PATH`.
2. Create the Python virtual environment in `.\venv`.
3. Install all required dependencies from `requirements.txt`.
4. Create `.env` configured with database name `project`.
5. Offer to initialize the database immediately.

---

### Step 2: Configure Database Credentials

Open `.env` in any text editor and confirm your local MySQL password:

```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=project

PORT=5000
DEBUG=False
CORS_ORIGINS=*
```

---

### Step 3: Initialize the MySQL Database

Choose either option:

#### Option A: Automated Python Script (Recommended)
```cmd
venv\Scripts\python.exe init_db.py
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench and connect to your local MySQL instance.
2. Open `database\schema.sql`.
3. Click ⚡ **Execute** (Ctrl+Shift+Enter).
4. Refresh schemas — you will see the database `project` with all 13 tables and rich seed data.

---

### Step 4: Run the Backend Server

Double-click `run_backend.bat` (or run in terminal):

```cmd
run_backend.bat
```

- Flask API URL: **http://127.0.0.1:5000/api**
- Database Health Check: **http://127.0.0.1:5000/api/health**

---

### Step 5: Run the Frontend Application

Double-click `run_frontend.bat` (or run in terminal):

```cmd
run_frontend.bat
```

- Launches a local server on port **5500** and automatically opens:
  **http://127.0.0.1:5500**

---

## 🧪 Running the Automated Test Suite

CraveSpot includes a comprehensive unit test suite covering health checks, security headers, craving algorithms, geocoding, and user authentication:

```cmd
venv\Scripts\python.exe tests/test_backend.py
```

**Output:**
```text
Ran 15 tests in 0.793s
OK
```

---

## 📡 REST API Reference

Base URL: `http://127.0.0.1:5000/api`

### Core & Health
| Endpoint | Method | Description |
|---|---|---|
| `/` | `GET` | API status, version, and active database confirmation (`"database": "project"`). |
| `/api/health` | `GET` | Verifies active MySQL connectivity and returns server timestamp. |

### Craving Discovery Engine
| Endpoint | Method | Parameters / Payload | Description |
|---|---|---|---|
| `/api/cravings/recommend` | `POST` | `{"query": "spicy pizza under 300", "latitude": 30.73, "longitude": 76.78}` | Natural-language craving search with match scoring and explanations. |
| `/api/cravings/surprise-me` | `GET` | `?latitude=&longitude=&veg_only=` | Randomly selects a top-rated crave-worthy dish nearby. |
| `/api/cravings/taxonomy` | `GET` | None | Returns list of craving profiles, flavor tags, and icons. |

### Geolocation & Live Places
| Endpoint | Method | Parameters / Payload | Description |
|---|---|---|---|
| `/api/location/geocode` | `GET` | `?q=Chandigarh` | Reverse-geocodes city or address to latitude/longitude. |
| `/api/restaurants/live-nearby`| `GET` | `?latitude=30.73&longitude=76.78&radius=5` | Fetches real nearby restaurants via OpenStreetMap Overpass with local DB fallback. |
| `/api/nearby-restaurants` | `POST` | `{"latitude": 30.73, "longitude": 76.78, "radius_km": 10}` | Computes exact Haversine distance to registered restaurants. |

### Restaurants & Dishes
| Endpoint | Method | Parameters / Payload | Description |
|---|---|---|---|
| `/api/restaurants` | `GET` | `?search=`, `?cuisine=`, `?city=`, `?veg_only=`, `?min_rating=`, `?sort=` | Filter and sort restaurants. |
| `/api/restaurants/<id>` | `GET` | None | Full restaurant details and operating hours. |
| `/api/restaurants/<id>/menu` | `GET` | None | Full menu categorized for the restaurant. |
| `/api/menu-items` | `GET` | `?search=`, `?category=`, `?restaurant_id=`, `?veg_only=`, `?max_price=` | Search and filter dish catalog. |
| `/api/menu-items/<id>` | `GET` | None | Deep details for a single dish with vendor info. |
| `/api/categories` | `GET` | None | List food categories with icons and images. |
| `/api/restaurants/<id>/reviews` | `GET` | None | List customer reviews. |
| `/api/restaurants/<id>/reviews` | `POST` | `{"user_name": "...", "rating": 5, "comment": "..."}` | Submit new review. |

### Authentication & User Profile
| Endpoint | Method | Parameters / Payload | Description |
|---|---|---|---|
| `/api/register` | `POST` | `{"name": "...", "email": "...", "password": "...", "phone": "..."}` | Create user account with hashed password. |
| `/api/login` | `POST` | `{"email": "...", "password": "..."}` | Authenticate user, rate-limited, returns signed bearer token. |
| `/api/auth/me` | `GET` | Header: `Authorization: Bearer <token>` | Fetch current user session. |
| `/api/user/profile` | `GET`, `PUT` | Header: `Authorization: Bearer <token>` | Read or update profile, city, address, bio. |
| `/api/user/preferences` | `GET`, `PUT` | Header: `Authorization: Bearer <token>` | Read or update spice tolerance, dietary flags, max budget. |
| `/api/user/favorites` | `GET`, `POST`, `DELETE`| Header: `Authorization: Bearer <token>` | Sync saved wishlists to user account. |

---

## 🧪 Default Test Credentials

For quick testing:
- **Email:** `demo@cravespot.com`
- **Password:** `Password123`

---

## 🛠️ Troubleshooting Guide

### 1. Database Connection Failed (`Error 2003 / Can't connect to MySQL server`)
- **Cause:** MySQL Server service is stopped.
- **Fix:** Open Windows Services (`services.msc`), locate **MySQL80** (or your MySQL service name), right-click and choose **Start**.

### 2. Access Denied for User 'root'@'localhost' (`Error 1045`)
- **Cause:** The password in `.env` does not match your local MySQL root password.
- **Fix:** Open `.env`, set `DB_PASSWORD=your_actual_password`, save, and restart `run_backend.bat`.

### 3. Unknown Database 'project' (`Error 1049`)
- **Cause:** The database has not been created yet.
- **Fix:** Run `venv\Scripts\python.exe init_db.py` or execute `database\schema.sql` in MySQL Workbench.

### 4. Port 5000 or Port 5500 Already in Use
- **Cause:** A previous instance is still running in the background.
- **Fix:** In PowerShell, find and terminate the process:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```

---

## 📜 License

Created for academic demonstration and portfolio purposes by **The Confluence** © 2026 CraveSpot. All rights reserved.

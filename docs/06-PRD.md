# Product Requirements Document (PRD)

**Project:** CraveSpot — Hyper-Local Restaurant Discovery & Intelligent Craving Recommendation Engine  
**Version:** 2.0  
**Date:** November 2026  
**Status:** PRODUCTION READY  
**BRD Reference:** BRD v2.0  
**Team:** The Confluence  

---

## 1. Product Vision

CraveSpot transforms food discovery from static restaurant browsing into dynamic, craving-centric exploration. Diners can find dishes matching exact flavor profiles (spicy, cheesy, crispy, tangy, sweet), dietary constraints (pure veg, non-veg, jain), and proximity constraints (1 km - 25 km) with immediate match explanations.

---

## 2. Target Personas

| Persona | Primary Goal | Current Pain Point | CraveSpot Solution |
|---|---|---|---|
| **Hungry College Student** | Find budget food under 150 nearby | Fragmented pricing, delivery fees, long waits | Budget filter, distance radius slider, craving search |
| **Indecisive Diner** | Decide on a meal quickly | Decision paralysis browsing endless menus | One-click Surprise Me modal with top-rated dish |
| **Health / Dietary Conscious** | Filter strict pure veg or jain dishes | Mixed vendor menus with ambiguous labeling | Explicit vegetarian tags, spice meters, ingredients view |
| **Food Explorer** | Discover authentic local street food and dhabas | Mainstream aggregators prioritize sponsored chains | Authentic street food catalog, verified reviews |

---

## 3. Core Feature Specifications

### 3.1 Craving Recommendation Engine
- **Input:** Free-form text query (e.g., "spicy momos under 200").
- **Processing:** Tokenizes input, matches sensory keywords against `cravings` and `dish_cravings` weights, applies price filters, and computes 0-100 match scores.
- **Output:** Ranked array of dishes with human-readable rationale (e.g., "Matches spicy craving; Fits under 200 budget; High 4.8 rating").

### 3.2 Live Geolocation & Spatial Proximity
- **GPS Integration:** Browser `navigator.geolocation` detects live latitude and longitude.
- **City Switching:** Pre-configured coordinates for Chandigarh, Mohali, Panchkula, Ludhiana, and Delhi.
- **Haversine Formula:** Computes spherical distance in kilometers directly inside SQL queries with sub-12ms execution.

### 3.3 Interactive Leaflet Food Map
- **Visual Exploration:** Renders OpenStreetMap tiles with custom restaurant pins and interactive popups showing address, rating, and menu links.
- **Radius Visualization:** Dynamically updates visible pins as the user adjusts the distance slider.

### 3.4 User Profile & Dietary Personalization
- **Preference Storage:** Saves spice tolerance (Mild, Medium, Hot, Extra Hot), dietary restrictions, and preferred cuisines to `user_preferences`.
- **Wishlist Bookmarking:** Dual-tab favorites system for both dishes and restaurants synced to the backend database.

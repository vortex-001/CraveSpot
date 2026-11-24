# System Architecture Document

**Project:** CraveSpot — Hyper-Local Restaurant Discovery & Intelligent Craving Recommendation Engine  
**Version:** 2.0  
**Date:** November 2026  
**Status:** APPROVED  
**Author:** Harsh Garg (System Architect)  
**Team:** The Confluence  

---

## 1. Architectural Strategy

CraveSpot implements a decoupled 3-tier client-server pattern designed for modularity, academic rigor, and zero-cost cloud scalability:
- **Tier 1 (Presentation):** Client-rendered static web application running HTML5, CSS3, and ES6+ JavaScript.
- **Tier 2 (Application):** Python Flask WSGI microservice handling business logic, ranking algorithms, token security, and external API caching.
- **Tier 3 (Data):** MySQL 8.0 relational database engine with 15 normalized tables, B-tree indexes, cascade foreign keys, and spherical trigonometry queries.

---

## 2. Component Architecture Diagram

```mermaid
flowchart TD
    Browser([Client Browser])

    subgraph Tier1 ["Tier 1: Presentation Layer"]
        Pages["Static HTML Pages"]
        Styles["CSS3 Responsive Stylesheets"]
        Controllers["Vanilla JS Controllers (app.js, dishes.js, etc.)"]
        APIClient["Central API Client (api.js)"]
    end

    subgraph Tier2 ["Tier 2: Application Layer"]
        WSGI["Flask WSGI Application (backend/app.py)"]
        AuthModule["Token Auth and Security Middleware"]
        CravingModule["NLP Craving Engine (craving_engine.py)"]
        PlacesModule["OpenStreetMap Service (places_service.py)"]
    end

    subgraph Tier3 ["Tier 3: Relational Data Layer"]
        MySQL[("MySQL 8.0 Server (CraveSpot)")]
        CoreTables[("15 Normalized 3NF Tables")]
    end

    subgraph ExternalServices ["External Geo Services"]
        OSM["OpenStreetMap Overpass API"]
        Nominatim["Nominatim Geocoder"]
    end

    Browser --> Pages
    Pages --> Controllers
    Controllers --> APIClient
    APIClient -->|REST API Calls / JSON| WSGI
    WSGI --> AuthModule
    WSGI --> CravingModule
    WSGI --> PlacesModule
    PlacesModule -.->|External Queries| OSM
    PlacesModule -.->|Geocoding| Nominatim
    CravingModule -->|Score Calculations| MySQL
    PlacesModule -->|Local Fallback| MySQL
    WSGI -->|Parameterized SQL| MySQL
    MySQL --> CoreTables
```

---

## 3. Data Flow Pathways

### 3.1 Craving Recommendation Flow
1. User enters natural search query on frontend search bar.
2. `api.js` submits POST request to `/api/cravings/recommend` with query and current coordinates.
3. `backend/app.py` passes query to `craving_engine.py`.
4. Engine tokenizes terms, matches taste and texture profiles against database weights, filters by price constraints, and calculates match scores (0-100).
5. Results are returned as formatted JSON with explanation strings for immediate rendering.

### 3.2 Geolocation & Proximity Calculation Flow
1. Browser requests user geolocation coordinates via HTML5 Geolocation API.
2. Coordinates are dispatched to `/api/nearby-restaurants`.
3. In-database Haversine formula calculates spherical distance between user coordinates and `restaurant_locations` coordinates.
4. Results within the selected radius (1 km - 25 km) are sorted ascending by distance and returned to the client in under 12ms.

---

## 4. Scalability & Deployment Model

- **Static Frontend Hosting:** Deployed to Vercel or Netlify Edge CDN with global distribution and automated SSL.
- **Backend API Hosting:** Deployed to Render.com as a containerized Python WSGI service with Gunicorn process workers.
- **Relational Database Hosting:** Hosted on TiDB Cloud Serverless (MySQL 8.0 compatible) with distributed storage and automatic horizontal scaling.

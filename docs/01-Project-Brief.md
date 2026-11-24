# Project Brief
## CraveSpot — Hyper-Local Restaurant Discovery & Intelligent Craving Recommendation Engine

CraveSpot is a database-driven, 3-tier food discovery platform engineered to connect hunger and immediate cravings directly with local restaurants, dishes, and culinary spots. Unlike conventional restaurant aggregators that prioritize sponsored placements, CraveSpot centers on craving-based discovery—matching users by flavor, texture, mood, budget, and dietary preference, alongside real-time geolocation discovery.

The platform is powered by a normalized 15-table MySQL 8.0 database in strict Third Normal Form (3NF), a Python Flask WSGI backend microservice, and a modern responsive vanilla JavaScript frontend with Leaflet OpenStreetMap integration.

### Core Objectives
1. Centralize restaurant menus, dish catalogs, and a sensory craving taxonomy into an indexed relational database.
2. Provide natural language craving recommendations using a multi-factor scoring algorithm.
3. Calculate real-time walking and driving distances using an in-database spherical Haversine formula.
4. Enforce enterprise-grade security including parameterized SQL queries, signed bearer sessions, and scrypt password hashing.

### Academic Scope & Constraints
- Course: CS301 — Relational Database Management Systems (RDBMS)
- Academic Year: 2026
- Scope: Restaurant discovery, craving search, category navigation, geolocation proximity, user authentication, wishlists, and automated testing.
- Out of Scope: Payment gateways, payment processing, delivery rider dispatch, and order fulfillment.

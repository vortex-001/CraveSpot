# Project Phases & Lifecycle Roadmap

**Project:** CraveSpot — Hyper-Local Restaurant Discovery & Intelligent Craving Recommendation Engine  
**Version:** 2.0  
**Status:** COMPLETED & VERIFIED  
**Academic Year:** 2026  
**Team:** The Confluence  

---

## Phase 1 — Problem Definition & Requirements (Weeks 1 - 2)
### Status: Completed
- Drafted and approved Project Brief, Charter, and Business Requirements (BRD v1.0).
- Identified user personas: Hungry Students, Indecisive Diners, Dietary-Conscious Individuals.
- Defined system scope, functional boundaries, and architectural guidelines.

---

## Phase 2 — Relational Database Modeling & Normalization (Weeks 3 - 4)
### Status: Completed
- Constructed Entity-Relationship (ER) model with 15 relational entities.
- Applied Boyce-Codd and Third Normal Form (3NF) normalization to eliminate data redundancy.
- Created MySQL DDL schema (`database/schema.sql`) with B-tree composite indexes, cascade constraints, and views.
- Curated authentic seed dataset covering Tricity food hubs, signature street foods, and multi-cuisine restaurants.

---

## Phase 3 — Backend API Architecture & Algorithm Design (Weeks 5 - 6)
### Status: Completed
- Implemented Python Flask WSGI application with modular service architecture.
- Engineered NLP craving recommendation engine with multi-factor scoring (taste, texture, mood, price, rating).
- Integrated in-database spherical Haversine formula for fast distance calculations.
- Integrated OpenStreetMap Overpass API and Nominatim geocoder with local database fallback.
- Implemented secure token-based user sessions, password hashing, and HTTP security headers.

---

## Phase 4 — Frontend UI/UX & Interactive Map Development (Weeks 7 - 8)
### Status: Completed
- Built responsive mobile-first frontend with HTML5 and CSS3 custom properties.
- Integrated Leaflet.js interactive discovery map with pin clustering and custom restaurant popups.
- Designed dynamic dish catalog with price sliders, spice meters, and vegetarian indicators.
- Embedded authentic food photography matching real dishes across all categories.
- Built user profile dashboard with spice tolerance preferences and dual-tab wishlist bookmarks.

---

## Phase 5 — Quality Assurance, Testing & Cloud Deployment (Weeks 9 - 10)
### Status: Completed
- Developed comprehensive automated test suite with 262 passing assertions (100% pass rate).
- Validated SQL injection immunity, CSRF/XSS protection, and rate limiting.
- Configured cloud deployment manifests (`Procfile`, `runtime.txt`, `vercel.json`, `netlify.toml`).
- Created step-by-step free deployment documentation (`FREE_DEPLOYMENT_GUIDE.md`) for Render, Vercel, and TiDB Cloud.
- Generated final academic presentation with real project screenshots for defense.

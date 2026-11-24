# Business Requirements Document (BRD)

**Project:** CraveSpot — Hyper-Local Restaurant Discovery & Intelligent Craving Recommendation Engine  
**Version:** 2.0 (Production Release)  
**Date:** November 2026  
**Status:** APPROVED & DEPLOYED  
**Project Type:** CS301 RDBMS Capstone Project  
**Team:** The Confluence  

---

## 1. Executive Summary

CraveSpot bridges the disconnect between hunger cravings and restaurant offerings. Standard food applications require users to know restaurant names in advance and hide price points, diet flags, and distances behind marketing funnels. 

CraveSpot introduces an intelligent craving-first paradigm: users state what they desire (for example, "spicy momos under 150" or "late-night cheesy pizza"), and the system returns top-matching dishes and restaurants nearby using multi-factor ranking, live spatial distance calculation, and verified user reviews.

---

## 2. Team Roster & Accountability

| Name | Project Role | Primary Ownership |
|---|---|---|
| **Harsh Garg** | Team Leader & System Architect | Full-stack architecture, database design, Render/Vercel deployment |
| **Simran** | Frontend Engineer | Mobile-first UI layouts, responsive CSS grids, category views |
| **Taranpreet** | Frontend Engineer | Client controller logic, Leaflet map integration, UI animations |
| **Anshita** | Backend Developer | Flask API endpoints, parameter validation, bearer token sessions |
| **Divya** | Backend Developer | Craving recommendation algorithm, Haversine formula, OSM places |
| **Babishya** | Database Engineer | 3NF relational normalization, B-tree indexes, cascade foreign keys |
| **Anshuman** | Database Engineer | DDL scripts, seed data curation, backward-compatible views |
| **Majid** | QA & Test Automation | 262-test automated regression suite, defect tracking, verification |

---

## 3. Business & Academic Objectives

| Metric | Baseline | Target | Achieved |
|---|---|---|---|
| Database Normalization | 1NF / Unnormalized | 3NF (15 Tables) | Strict 3NF across all entities |
| Craving Match Precision | Keyword match only | Multi-factor (0-100) | Flavor, texture, mood, price, rating |
| Spatial Query Latency | Over 200ms | Under 20ms | Sub-12ms using B-tree indexed Haversine |
| Automated Test Pass Rate | Zero automated tests | 100% (Over 200 tests) | 262 / 262 Passed (100%) |
| Cloud Deployment Cost | Unknown | $0 / Month | $0 (Render + Vercel + TiDB Serverless) |

---

## 4. Scope Boundaries

### In Scope
- Restaurant directory with search, cuisine, rating, price tier, and vegetarian filters.
- Food item catalog with dish-specific nutrition tags, authentic photography, and spice meters.
- Sensory craving taxonomy supporting flavors, textures, and moods.
- Live geolocation with browser GPS auto-detection, city selection, and radius filtering (1 km to 25 km).
- User authentication with scrypt password hashing and signed session bearer tokens.
- User profile dashboard managing dietary preferences (pure veg, non-veg, jain) and spice tolerance.
- Dual-tab wishlist / bookmarking system for dishes and restaurants.
- Customer reviews and star rating submission with immediate average recalculation.

### Out of Scope
- Online financial payment processing (Razorpay, Stripe, UPI).
- Real-time courier / rider delivery tracking.
- Table reservation billing systems.

---

## 5. Functional Requirements

- **FR-01:** System shall support natural language craving queries parsed into taste, texture, mood, and budget constraints.
- **FR-02:** System shall calculate candidate dish match scores from 0 to 100 with clear explanation strings.
- **FR-03:** System shall provide a Surprise Me feature returning a randomized top-rated local dish.
- **FR-04:** System shall calculate distances using spherical trigonometry without requiring external paid GIS software.
- **FR-05:** System shall fail over gracefully to local database records if external map services experience rate limits.
- **FR-06:** System shall enforce user registration uniqueness on email and phone number.
- **FR-07:** System shall protect administrative and profile mutations behind signed bearer tokens.

---

## 6. Non-Functional Requirements

- **NFR-01 Security:** Zero plain-text passwords; all database calls parameterized to eliminate SQL injection.
- **NFR-02 Performance:** REST API response latency under 50ms for local queries; under 200ms for spatial lookups.
- **NFR-03 Reliability:** High availability with automatic database reconnection pooling.
- **NFR-04 Portability:** Deployable on standard Linux WSGI environments (Gunicorn) and cloud PaaS (Render, Vercel).
- **NFR-05 Compatibility:** Responsive on desktop, tablet, and mobile displays without layout breakage.

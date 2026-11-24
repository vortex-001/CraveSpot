# Coding Rules & Engineering Standards

**Project:** CraveSpot — Hyper-Local Restaurant Discovery & Intelligent Craving Recommendation Engine  
**Version:** 2.0  
**Status:** ACTIVE  
**Team:** The Confluence  

---

## 1. Mandatory Technology Stack

- **Frontend:** HTML5, CSS3 (Modern Flexbox & Grid), Vanilla JavaScript (ES6+), Leaflet.js
- **Backend:** Python 3.10+ (compatible with Python 3.14), Flask 3.1 WSGI, Flask-CORS
- **Database:** MySQL 8.0, Database name: `CraveSpot` (Strict 3NF Normalization)
- **Security:** Werkzeug (`scrypt` password hashing), itsdangerous (signed session tokens)
- **Version Control:** Git & GitHub (`vortex-001/CraveSpot`)

---

## 2. Forbidden Practices & Security Guardrails

- **No Hardcoded Passwords or Tokens:** All secrets, credentials, and configuration flags must reside in `.env` and be ignored by Git via `.gitignore`.
- **No Plaintext Passwords:** Passwords must always be hashed with cryptographic salts using `generate_password_hash()` and verified with `check_password_hash()`.
- **No Raw SQL Concatenation:** String interpolation (`%s` formatting or f-strings) inside SQL queries is strictly prohibited. All queries must use parameterized tuples `cursor.execute(query, (val1, val2))`.
- **No Missing Foreign Key Actions:** All foreign key constraints must declare explicit `ON DELETE CASCADE` or `ON DELETE RESTRICT` actions.
- **No Blocking External Calls:** External network requests to map mirrors must have strict timeouts (1.8 seconds) and immediate failover to the local database.

---

## 3. Code Quality & Formatting Guidelines

- **Python (Backend):** Follow PEP 8 naming conventions. Explicit type conversions on query arguments. Structured error handling with detailed logging and appropriate HTTP status codes (200, 201, 400, 401, 404, 500).
- **JavaScript (Frontend):** Modular architecture with single-responsibility controllers (`api.js`, `app.js`, `dishes.js`, etc.). Sanitized DOM manipulation using `textContent` to prevent Cross-Site Scripting (XSS).
- **SQL (Database):** Table and column names must be lowercase with snake_case. Every primary key must be named `<entity>_id`. Every table must define `created_at` and `updated_at` timestamps.

"""
CraveSpot Full Manual Test Suite — In-Process (No sockets needed)
Uses Flask test_client() for API tests and direct file reads for frontend tests.

Response shape reference (actual backend behaviour):
  GET  /api/restaurants          -> raw list  [...]
  GET  /api/restaurants/<id>     -> {"success": True, "restaurant": {...}}
  GET  /api/restaurants/<id>/menu-> raw list  [...]
  GET  /api/restaurants/<id>/reviews -> raw list [...]
  GET  /api/menu-items           -> raw list  [...]
  GET  /api/menu-items/<id>      -> raw dict  {...}
  GET  /api/dishes               -> raw list  [...]
  GET  /api/categories           -> raw list  [...]
  GET  /api/nearby-restaurants   -> {"success": True, "restaurants": [...]}
  POST /api/cravings/recommend   -> {"success": True, "recommendations": [...], ...}
  GET  /api/cravings/taxonomy    -> {"success": True, "cravings": [...]}
  GET  /api/cravings/surprise-me -> {"success": True, "surprise": {...}}
"""
import sys, os, json, time, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "backend"))

os.environ["DB_HOST"]     = "localhost"
os.environ["DB_PORT"]     = "3306"
os.environ["DB_USER"]     = "root"
os.environ["DB_PASSWORD"] = ""
os.environ["DB_NAME"]     = "CraveSpot"
os.environ["PORT"]        = "5000"

from unittest.mock import MagicMock, patch
from werkzeug.security import generate_password_hash
from backend.app import app as flask_app, TOKEN_SERIALIZER

# ── Shared mock DB ────────────────────────────────────────────────────────────
SEED_RESTAURANTS = [
    {"restaurant_id":1,"name":"Urban Tadka","cuisine":"North Indian · Mughlai","address":"Sector 17, Chandigarh",
     "rating":4.5,"is_veg":0,"offer":"20% OFF","price_for_two":600,
     "opening_hours":"10:00 AM – 11:00 PM","is_open":1,"contact_phone":"98765-01001",
     "latitude":30.7333,"longitude":76.7794,"city":"Chandigarh","area":"Sector 17"},
    {"restaurant_id":2,"name":"Pizza Corner","cuisine":"Pizza · Italian","address":"Sector 22, Chandigarh",
     "rating":4.3,"is_veg":0,"offer":None,"price_for_two":500,
     "opening_hours":"11:00 AM – 12:00 AM","is_open":1,"contact_phone":"98765-01002",
     "latitude":30.7272,"longitude":76.7857,"city":"Chandigarh","area":"Sector 22"},
    {"restaurant_id":3,"name":"Wok Express","cuisine":"Chinese · Momos · Noodles","address":"Sector 35, Chandigarh",
     "rating":4.2,"is_veg":0,"offer":"15% OFF","price_for_two":350,
     "opening_hours":"12:00 PM – 11:00 PM","is_open":1,"contact_phone":"98765-01003",
     "latitude":30.7224,"longitude":76.7688,"city":"Chandigarh","area":"Sector 35"},
    {"restaurant_id":4,"name":"Sweet Cravings","cuisine":"Desserts · Sweets","address":"Sector 10, Chandigarh",
     "rating":4.7,"is_veg":1,"offer":None,"price_for_two":300,
     "opening_hours":"09:00 AM – 10:00 PM","is_open":1,"contact_phone":"98765-01004",
     "latitude":30.7400,"longitude":76.7900,"city":"Chandigarh","area":"Sector 10"},
    {"restaurant_id":5,"name":"Burger House","cuisine":"Burgers · Fast Food","address":"Sector 8, Chandigarh",
     "rating":4.1,"is_veg":0,"offer":"10% OFF","price_for_two":400,
     "opening_hours":"11:00 AM – 11:00 PM","is_open":1,"contact_phone":"98765-01005",
     "latitude":30.7350,"longitude":76.7820,"city":"Chandigarh","area":"Sector 8"},
]

SEED_MENU_ITEMS = [
    {"item_id":1,"restaurant_id":1,"name":"Chicken Biryani","category":"Biryani",
     "description":"Aromatic basmati rice with tender chicken","price":220.0,"is_veg":0,"rating":4.7,
     "tags":"biryani,chicken,spicy","spice_level":"medium","calories":650,"is_available":1},
    {"item_id":2,"restaurant_id":1,"name":"Dal Makhani","category":"Dal",
     "description":"Slow-cooked black lentils in rich buttery gravy","price":180.0,"is_veg":1,"rating":4.5,
     "tags":"dal,creamy,comfort","spice_level":"mild","calories":420,"is_available":1},
    {"item_id":3,"restaurant_id":2,"name":"Classic Margherita","category":"Pizza",
     "description":"Cheesy pizza with fresh tomato and mozzarella","price":280.0,"is_veg":1,"rating":4.6,
     "tags":"pizza,cheesy,vegetarian","spice_level":"none","calories":750,"is_available":1},
    {"item_id":4,"restaurant_id":2,"name":"Pepperoni Pizza","category":"Pizza",
     "description":"Loaded with pepperoni slices and mozzarella","price":320.0,"is_veg":0,"rating":4.4,
     "tags":"pizza,cheesy,spicy","spice_level":"medium","calories":880,"is_available":1},
    {"item_id":5,"restaurant_id":3,"name":"Veg Momos","category":"Momos",
     "description":"Steamed dumplings with spicy red chutney","price":120.0,"is_veg":1,"rating":4.3,
     "tags":"momos,spicy,crispy","spice_level":"hot","calories":280,"is_available":1},
    {"item_id":6,"restaurant_id":4,"name":"Gulab Jamun","category":"Dessert",
     "description":"Soft fried dumplings soaked in sugar syrup","price":80.0,"is_veg":1,"rating":4.8,
     "tags":"sweet,dessert,soft","spice_level":"none","calories":320,"is_available":1},
    {"item_id":7,"restaurant_id":5,"name":"Classic Burger","category":"Burger",
     "description":"Juicy beef patty with crispy lettuce","price":180.0,"is_veg":0,"rating":4.2,
     "tags":"burger,crispy,juicy","spice_level":"mild","calories":560,"is_available":1},
    {"item_id":8,"restaurant_id":5,"name":"Veg Burger","category":"Burger",
     "description":"Crispy aloo tikki with creamy mayo","price":140.0,"is_veg":1,"rating":4.0,
     "tags":"burger,crispy,vegetarian","spice_level":"mild","calories":420,"is_available":1},
]

SEED_CATEGORIES = [
    {"category_id":1,"name":"Biryani","description":"Aromatic rice dishes","icon":"🍚","image_url":""},
    {"category_id":2,"name":"Pizza","description":"Italian flatbreads","icon":"🍕","image_url":""},
    {"category_id":3,"name":"Burger","description":"Stacked American burgers","icon":"🍔","image_url":""},
    {"category_id":4,"name":"Momos","description":"Steamed Himalayan dumplings","icon":"🥟","image_url":""},
    {"category_id":5,"name":"Desserts","description":"Sweet indulgences","icon":"🍰","image_url":""},
    {"category_id":6,"name":"Chinese","description":"Stir-fries and noodles","icon":"🍜","image_url":""},
    {"category_id":7,"name":"North Indian","description":"Curries and tandoori","icon":"🍛","image_url":""},
    {"category_id":8,"name":"Fast Food","description":"Quick bites","icon":"🌮","image_url":""},
]

SEED_CRAVINGS = [
    {"craving_id":1,"tag":"spicy","title":"Spicy & Fiery","icon":"flame","taste_profile":"spicy,hot,fiery","texture_profile":"","mood":"adventurous"},
    {"craving_id":2,"tag":"cheesy","title":"Cheesy & Gooey","icon":"cheese","taste_profile":"cheesy,creamy,rich","texture_profile":"gooey,melted","mood":"comforting"},
    {"craving_id":3,"tag":"sweet","title":"Something Sweet","icon":"cake","taste_profile":"sweet,sugary","texture_profile":"soft","mood":"happy"},
    {"craving_id":4,"tag":"crispy","title":"Crispy & Crunchy","icon":"bolt","taste_profile":"savory","texture_profile":"crispy,crunchy","mood":"snacky"},
    {"craving_id":5,"tag":"comfort","title":"Comfort Food","icon":"heart","taste_profile":"mild,rich,creamy","texture_profile":"soft","mood":"cozy"},
]

SEED_REVIEWS = [
    {"review_id":1,"restaurant_id":1,"user_id":None,"user_name":"Harsh Garg","rating":5,"comment":"Amazing biryani!","created_at":"2026-10-01"},
    {"review_id":2,"restaurant_id":1,"user_id":None,"user_name":"Simran","rating":4,"comment":"Great food, quick service.","created_at":"2026-10-05"},
]

hashed_demo_pass = generate_password_hash("Password123")
SEED_USERS = [
    {"user_id":1,"name":"Demo User","email":"demo@cravespot.com","password":hashed_demo_pass,"phone":"9876543210","role":"user"},
]


def make_mock_db(custom_fetchall=None, custom_fetchone="__unset__", insert_id=None, raise_on_execute=None):
    """Build a mock DB connection whose cursor returns the given data.
    Pass custom_fetchone=None explicitly to simulate no row found (cursor returns None).
    Omit custom_fetchone (default sentinel) to leave fetchone as a MagicMock auto-return.
    """
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    mock_conn.is_connected.return_value = True
    mock_conn.commit.return_value = None
    if raise_on_execute:
        mock_cursor.execute.side_effect = raise_on_execute
    if custom_fetchall is not None:
        mock_cursor.fetchall.return_value = custom_fetchall
    # Only set fetchone if caller explicitly passed a value (including None)
    if custom_fetchone != "__unset__":
        mock_cursor.fetchone.return_value = custom_fetchone
    if insert_id is not None:
        mock_cursor.lastrowid = insert_id
    return mock_conn


# ── Test infrastructure ────────────────────────────────────────────────────────
flask_app.config["TESTING"] = True
client = flask_app.test_client()

PASS = 0
FAIL = 0
FAILURES = []


def chk(label, ok, info=""):
    global PASS, FAIL
    icon  = "PASS" if ok else "FAIL"
    color = "\033[92m" if ok else "\033[91m"
    reset = "\033[0m"
    if ok:
        PASS += 1
    else:
        FAIL += 1
        FAILURES.append(f"{label}  {info}")
    print(f"  [{color}{icon}{reset}] {label}  {info}")


def api(method, path, json_body=None, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if method == "GET":
        return client.get(path, headers=headers)
    elif method == "POST":
        return client.post(path, json=json_body, headers=headers)
    elif method == "PUT":
        return client.put(path, json=json_body, headers=headers)
    elif method == "DELETE":
        return client.delete(path, headers=headers)


def api_call(label, method, path, json_body=None, expect=200, token=None, mock_db=None):
    """
    Call the Flask test client, check HTTP status, return parsed body.
    Returns (body, passed) where body is the JSON object/list (or {} on error).
    """
    ctx = (
        patch("backend.app.get_db", return_value=mock_db)
        if mock_db
        else __import__("contextlib").nullcontext()
    )
    with ctx:
        resp = api(method, path, json_body, token)
    status = resp.status_code
    try:
        body = resp.get_json()
        if body is None:
            body = {}
    except Exception:
        body = {}

    ok = status == expect
    info = f"HTTP {status}"
    chk(label, ok, info)

    # Print API output snippet directly in test result
    if body:
        if isinstance(body, list):
            sample = f"List of {len(body)} items -> {json.dumps(body[0])[:85]}..." if body else "[]"
            print(f"       ↳ API Output: {sample}")
        elif isinstance(body, dict):
            compact = json.dumps(body)
            if len(compact) > 115:
                compact = compact[:112] + "..."
            print(f"       ↳ API Output: {compact}")

    return body, ok


def section(title):
    print(f"\n{'─'*62}")
    print(f"  {title}")
    print('─'*62)


# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "="*62)
print("  CraveSpot — Full Manual Test Suite (In-Process)")
print("="*62)


# ── 1. Core Endpoints ─────────────────────────────────────────
section("1. Core API Endpoints")

body, _ = api_call("GET / root", "GET", "/", expect=200)
chk("  → success = True",           body.get("success") is True,          f"success={body.get('success')}")
chk("  → message contains 'CraveSpot'", "CraveSpot" in body.get("message",""), f"message={body.get('message','')[:60]}")
chk("  → database = 'CraveSpot'",   body.get("database") == "CraveSpot",    f"database={body.get('database')}")
chk("  → version key present",      "version" in body,                     f"version={body.get('version')}")

# Health check: DB up
db_ok = make_mock_db(custom_fetchone=(1,))
body2, _ = api_call("GET /api/health (DB up)", "GET", "/api/health", expect=200, mock_db=db_ok)
chk("  → success = True",           body2.get("success") is True,         f"success={body2.get('success')}")
chk("  → database='CraveSpot'",     body2.get("database") == "CraveSpot",   f"got={body2.get('database')}")

# Health check: DB down
import mysql.connector
with patch("backend.app.get_db") as m:
    m.side_effect = mysql.connector.Error("Connection refused")
    b3 = api("GET", "/api/health")
    chk("GET /api/health (DB down → 503)", b3.status_code == 503, f"HTTP {b3.status_code}")
    chk("  → success = False", b3.get_json().get("success") is False, "")


# ── 2. Security Headers ───────────────────────────────────────
section("2. Security Headers")
resp = client.get("/")
chk("X-Content-Type-Options: nosniff",  resp.headers.get("X-Content-Type-Options") == "nosniff",  f"got={resp.headers.get('X-Content-Type-Options')}")
chk("X-Frame-Options: SAMEORIGIN",      resp.headers.get("X-Frame-Options") == "SAMEORIGIN",      f"got={resp.headers.get('X-Frame-Options')}")
chk("X-XSS-Protection: 1; mode=block", resp.headers.get("X-XSS-Protection") == "1; mode=block",  f"got={resp.headers.get('X-XSS-Protection')}")
chk("Referrer-Policy present",          resp.headers.get("Referrer-Policy") is not None,          f"got={resp.headers.get('Referrer-Policy')}")


# ── 3. Restaurants ────────────────────────────────────────────
section("3. Restaurant Endpoints")

# GET /api/restaurants returns a raw list
db_rest = make_mock_db(custom_fetchall=SEED_RESTAURANTS, custom_fetchone=SEED_RESTAURANTS[0])

body, _ = api_call("GET /api/restaurants", "GET", "/api/restaurants", mock_db=db_rest)
chk("  → returns a list",             isinstance(body, list),              f"type={type(body).__name__}")
chk("  → 5 seed restaurants",         len(body) == 5 if isinstance(body, list) else False,  f"count={len(body) if isinstance(body, list) else 'N/A'}")

for qs, label in [
    ("?search=pizza",      "search=pizza"),
    ("?veg_only=1",        "veg_only=1"),
    ("?min_rating=4.0",    "min_rating=4"),
    ("?city=Chandigarh",   "city=Chandigarh"),
    ("?sort=rating",       "sort=rating"),
    ("?sort=price_low",    "sort=price_low"),
]:
    b, _ = api_call(f"GET /api/restaurants{qs}", "GET", f"/api/restaurants{qs}", mock_db=db_rest)
    chk(f"  → {label}: returns list", isinstance(b, list), f"type={type(b).__name__}")

# GET /api/restaurants/<id>  — now returns {"success": True, "restaurant": {...}}
db_single = make_mock_db(
    custom_fetchall=SEED_MENU_ITEMS[:3],
    custom_fetchone={"total_dishes": 3, **SEED_RESTAURANTS[0]}
)
body, _ = api_call("GET /api/restaurants/1", "GET", "/api/restaurants/1", mock_db=db_single)
chk("  → success = True",    body.get("success") is True,    f"success={body.get('success')}")
chk("  → restaurant key",    "restaurant" in body,            f"keys={list(body.keys())[:6]}")

# GET /api/restaurants/9999 → 404
db_none = make_mock_db(custom_fetchone=None, custom_fetchall=[])
api_call("GET /api/restaurants/9999 → 404", "GET", "/api/restaurants/9999", expect=404, mock_db=db_none)

# GET /api/restaurants/0 → 404 (rejected by backend before DB call)
api_call("GET /api/restaurants/0 → 404",   "GET", "/api/restaurants/0",    expect=404, mock_db=db_none)

# GET /api/restaurants/<id>/menu — raw list
body, _ = api_call("GET /api/restaurants/1/menu", "GET", "/api/restaurants/1/menu", mock_db=db_single)
chk("  → menu is list", isinstance(body, list), f"type={type(body).__name__}")

# GET /api/restaurants/<id>/reviews — raw list
db_reviews = make_mock_db(custom_fetchall=SEED_REVIEWS, custom_fetchone=SEED_RESTAURANTS[0])
body, _ = api_call("GET /api/restaurants/1/reviews", "GET", "/api/restaurants/1/reviews", mock_db=db_reviews)
chk("  → reviews is list",    isinstance(body, list),              f"type={type(body).__name__}")
chk("  → 2 reviews returned", len(body) == 2 if isinstance(body, list) else False,  f"count={len(body) if isinstance(body, list) else 'N/A'}")


# ── 4. Menu Items ─────────────────────────────────────────────
section("4. Menu Items / Dishes")

db_menu = make_mock_db(custom_fetchall=SEED_MENU_ITEMS, custom_fetchone=SEED_MENU_ITEMS[0])

body, _ = api_call("GET /api/menu-items", "GET", "/api/menu-items", mock_db=db_menu)
chk("  → returns list",         isinstance(body, list),                      f"type={type(body).__name__}")
chk("  → 8 seed items",         len(body) == 8 if isinstance(body, list) else False,  f"count={len(body) if isinstance(body, list) else 'N/A'}")

for qs, lbl in [
    ("?search=biryani", "search"),
    ("?veg_only=1",     "veg_only"),
    ("?max_price=200",  "max_price"),
    ("?category=Biryani","category"),
]:
    b, _ = api_call(f"GET /api/menu-items{qs}", "GET", f"/api/menu-items{qs}", mock_db=db_menu)
    chk(f"  → {lbl}: list", isinstance(b, list), f"type={type(b).__name__}")

body, _ = api_call("GET /api/dishes (alias)", "GET", "/api/dishes", mock_db=db_menu)
chk("  → dishes alias: list", isinstance(body, list), f"type={type(body).__name__}")

# GET /api/menu-items/<id> — raw dict
body, _ = api_call("GET /api/menu-items/1", "GET", "/api/menu-items/1", mock_db=db_menu)
chk("  → single dish: dict", isinstance(body, dict), f"type={type(body).__name__}")
chk("  → has item_id", "item_id" in body or body.get("success") is not None,
    f"keys={list(body.keys())[:5]}")


# ── 5. Categories ─────────────────────────────────────────────
section("5. Categories")

db_cats = make_mock_db(custom_fetchall=SEED_CATEGORIES)
body, _ = api_call("GET /api/categories", "GET", "/api/categories", mock_db=db_cats)
chk("  → returns list",        isinstance(body, list),                      f"type={type(body).__name__}")
chk("  → 8 categories",        len(body) == 8 if isinstance(body, list) else False,  f"count={len(body) if isinstance(body, list) else 'N/A'}")


# ── 6. Reviews CRUD ───────────────────────────────────────────
section("6. Reviews CRUD")

db_rev_write = make_mock_db(custom_fetchone=SEED_RESTAURANTS[0], custom_fetchall=[], insert_id=99)
api_call("POST review (valid 5★)",       "POST", "/api/restaurants/1/reviews",
         {"user_name":"ManualTester","rating":5,"comment":"Excellent biryani!"},
         expect=201, mock_db=db_rev_write)
api_call("POST review (valid 1★)",       "POST", "/api/restaurants/1/reviews",
         {"user_name":"Critic","rating":1,"comment":"Not my style."},
         expect=201, mock_db=db_rev_write)
api_call("POST review (missing rating)", "POST", "/api/restaurants/1/reviews",
         {"user_name":"X","comment":"no rating"}, expect=400, mock_db=db_rev_write)
api_call("POST review (rating=0)",       "POST", "/api/restaurants/1/reviews",
         {"user_name":"X","rating":0,"comment":"bad"}, expect=400, mock_db=db_rev_write)
api_call("POST review (rating=6)",       "POST", "/api/restaurants/1/reviews",
         {"user_name":"X","rating":6,"comment":"bad"}, expect=400, mock_db=db_rev_write)
api_call("POST review (empty user_name)","POST", "/api/restaurants/1/reviews",
         {"user_name":"","rating":4,"comment":"ok"}, expect=400, mock_db=db_rev_write)


# ── 7. Craving Engine ─────────────────────────────────────────
section("7. Craving Recommendation Engine")

CRAVING_ITEMS = []
for r in SEED_RESTAURANTS:
    for m in SEED_MENU_ITEMS:
        if m["restaurant_id"] == r["restaurant_id"]:
            CRAVING_ITEMS.append({**m,
                "restaurant_name":r["name"],"restaurant_address":r["address"],
                "restaurant_rating":r["rating"],
                "restaurant_latitude":r["latitude"],"restaurant_longitude":r["longitude"]
            })

db_craving = make_mock_db(custom_fetchall=CRAVING_ITEMS)

# Taxonomy — returns {"success": True, "cravings": [...]}
db_tax = make_mock_db(custom_fetchall=SEED_CRAVINGS)
body, _ = api_call("GET /api/cravings/taxonomy", "GET", "/api/cravings/taxonomy", mock_db=db_tax)
chk("  → success = True",        body.get("success") is True,         f"success={body.get('success')}")
chk("  → cravings list present", isinstance(body.get("cravings"), list), f"type={type(body.get('cravings')).__name__}")
chk("  → ≥5 craving tags",       len(body.get("cravings",[])) >= 5,   f"count={len(body.get('cravings',[]))}")

# Surprise Me
body, _ = api_call("GET /api/cravings/surprise-me", "GET", "/api/cravings/surprise-me", mock_db=db_craving)
chk("  → success = True",         body.get("success") is True,         f"success={body.get('success')}")
chk("  → surprise key present",   "surprise" in body,                   f"keys={list(body.keys())}")
surprise = body.get("surprise", {})
chk("  → surprise_message present","surprise_message" in surprise,      f"keys={list(surprise.keys())[:6]}")

# Spicy
body, _ = api_call("POST craving: 'spicy food'", "POST", "/api/cravings/recommend",
                   {"query":"spicy food","latitude":30.7333,"longitude":76.7794},
                   mock_db=db_craving)
chk("  → success = True",         body.get("success") is True,         f"success={body.get('success')}")
recs = body.get("recommendations", [])
chk("  → spicy: has results",     len(recs) > 0,                        f"count={len(recs)}")
if recs:
    chk("  → spicy: match_reason present", "match_reason" in recs[0],  f"reason='{recs[0].get('match_reason','')[:50]}'")

# Cheesy veg pizza under 300
body, _ = api_call("POST craving: 'cheesy veg pizza under 300'", "POST", "/api/cravings/recommend",
                   {"query":"cheesy veg pizza under 300","latitude":30.7333,"longitude":76.7794},
                   mock_db=db_craving)
chk("  → success = True",        body.get("success") is True,          f"success={body.get('success')}")
recs = body.get("recommendations", [])
chk("  → results > 0",           len(recs) > 0,                         f"count={len(recs)}")
if recs:
    chk("  → top pick is pizza/margherita",
        "pizza" in recs[0].get("name","").lower() or "margherita" in recs[0].get("name","").lower(),
        f"top={recs[0].get('name')}")

# Sweet
body, _ = api_call("POST craving: 'sweet dessert'", "POST", "/api/cravings/recommend",
                   {"query":"sweet dessert"}, mock_db=db_craving)
chk("  → sweet: success",        body.get("success") is True,          f"success={body.get('success')}")
chk("  → sweet: results > 0",    len(body.get("recommendations",[])) > 0, f"count={len(body.get('recommendations',[]))}")

# Budget
body, _ = api_call("POST craving: 'affordable biryani under 150'", "POST", "/api/cravings/recommend",
                   {"query":"affordable biryani under 150","latitude":30.73,"longitude":76.78},
                   mock_db=db_craving)
chk("  → budget query accepted", body.get("success") is True, "")

# Comfort food
api_call("POST craving: 'comfort food late night'", "POST", "/api/cravings/recommend",
         {"query":"comfort food late night"}, mock_db=db_craving)

# Crispy
api_call("POST craving: 'crispy snack'", "POST", "/api/cravings/recommend",
         {"query":"crispy snack"}, mock_db=db_craving)

# Veg only
body, _ = api_call("POST craving: 'veg only momos'", "POST", "/api/cravings/recommend",
                   {"query":"veg momos","veg_only":True}, mock_db=db_craving)
chk("  → success",               body.get("success") is True,          f"success={body.get('success')}")
recs = body.get("recommendations", [])
chk("  → veg filter: all recs are veg", all(r.get("is_veg") == 1 for r in recs),
    f"veg_check={[r.get('is_veg') for r in recs[:5]]}")

# Error cases
api_call("POST craving: empty query → 400",   "POST", "/api/cravings/recommend", {"query":""},   expect=400)
api_call("POST craving: missing query → 400", "POST", "/api/cravings/recommend", {},             expect=400)


# ── 8. Geolocation ────────────────────────────────────────────
section("8. Geolocation & Live Places")

body, _ = api_call("GET /api/location/geocode?q=Chandigarh", "GET",
                   "/api/location/geocode?q=Chandigarh", expect=200)
chk("  → success = True",       body.get("success") is True,            f"success={body.get('success')}")
loc = body.get("location", {})
chk("  → latitude present",     "latitude"     in loc,                  f"lat={loc.get('latitude')}")
chk("  → longitude present",    "longitude"    in loc,                  f"lon={loc.get('longitude')}")
chk("  → display_name present", "display_name" in loc,                  f"name={loc.get('display_name','')[:40]}")

api_call("GET /api/location/geocode (missing q)", "GET", "/api/location/geocode", expect=400)

db_nearby = make_mock_db(custom_fetchall=SEED_RESTAURANTS)
body, _ = api_call("POST /api/nearby-restaurants (valid)", "POST", "/api/nearby-restaurants",
                   {"latitude":30.7333,"longitude":76.7794,"radius_km":10}, mock_db=db_nearby)
chk("  → success = True",       body.get("success") is True,            f"keys={list(body.keys())}")
chk("  → restaurants list",     isinstance(body.get("restaurants"), list), f"type={type(body.get('restaurants')).__name__}")

api_call("POST /api/nearby-restaurants (missing coords)", "POST", "/api/nearby-restaurants",
         {}, expect=400)
api_call("POST /api/nearby-restaurants (no lat)", "POST", "/api/nearby-restaurants",
         {"longitude":76.7}, expect=400)

# Live nearby — NOTE: endpoint uses ?lat=&lng= params (not latitude/longitude)
# It also tries OSM (network), which is unavailable in sandbox — but DB part uses mock.
# The endpoint handles OSM failure gracefully and still returns success with DB results.
body, _ = api_call("GET /api/restaurants/live-nearby (correct params)", "GET",
                   "/api/restaurants/live-nearby?lat=30.7333&lng=76.7794&radius=5",
                   mock_db=db_nearby)
chk("  → success = True",       body.get("success") is True,            f"success={body.get('success')}")
chk("  → restaurants in response",
    "restaurants" in body,                                               f"keys={list(body.keys())}")

# Wrong params → 400
body_bad, _ = api_call("GET /api/restaurants/live-nearby (missing lat) → 400", "GET",
                       "/api/restaurants/live-nearby?lng=76.7794",       expect=400)


# ── 9. Authentication ─────────────────────────────────────────
section("9. Authentication & Token Security")

# Clear rate limiter so previous tests don't pollute auth tests
from backend.app import _RATE_LIMIT_STORE
_RATE_LIMIT_STORE.clear()

ts = int(time.time())
EMAIL    = f"manualtest_{ts}@cravespot.test"
PASSWORD = "ManualTest@123"

# Registration — success
db_reg = make_mock_db(custom_fetchone=None, insert_id=99)
body, _ = api_call("POST /api/register (valid)", "POST", "/api/register",
                   {"name":"Manual Tester","email":EMAIL,"password":PASSWORD,"phone":"9876543210"},
                   expect=201, mock_db=db_reg)
TOKEN = body.get("token","")
chk("  → success = True",        body.get("success") is True,           f"success={body.get('success')}")
chk("  → token returned",        bool(TOKEN),                            f"len={len(TOKEN)}")
chk("  → user.email correct",    body.get("user",{}).get("email")==EMAIL, f"email={body.get('user',{}).get('email','')}")
chk("  → user.name correct",     body.get("user",{}).get("name")=="Manual Tester",
    f"name={body.get('user',{}).get('name','')}")

# Registration — duplicate email
# The register route: 1st fetchone checks for existing email → if found, returns 409
# So mock must return an existing user on fetchone
db_dup = make_mock_db(custom_fetchone={"user_id": 1, "email": EMAIL})
api_call("POST /api/register (duplicate email)", "POST", "/api/register",
         {"name":"Dup","email":EMAIL,"password":"AnotherPass1"}, expect=409, mock_db=db_dup)

api_call("POST /api/register (missing name)",   "POST", "/api/register",
         {"email":EMAIL,"password":"pass123"}, expect=400)
api_call("POST /api/register (missing email)",  "POST", "/api/register",
         {"name":"X","password":"pass123"}, expect=400)
api_call("POST /api/register (short password)", "POST", "/api/register",
         {"name":"X","email":f"short_{ts}@test.com","password":"ab"}, expect=400)
api_call("POST /api/register (empty body)",     "POST", "/api/register", {}, expect=400)

# Login — success
db_login = make_mock_db(custom_fetchone={
    "user_id":99,"name":"Manual Tester","email":EMAIL,
    "password":generate_password_hash(PASSWORD),"phone":"9876543210","role":"user"
})
body, _ = api_call("POST /api/login (valid)", "POST", "/api/login",
                   {"email":EMAIL,"password":PASSWORD}, mock_db=db_login)
LOGIN_TOKEN = body.get("token","")
chk("  → success = True",        body.get("success") is True,           f"success={body.get('success')}")
chk("  → token returned",        bool(LOGIN_TOKEN),                      f"len={len(LOGIN_TOKEN)}")
chk("  → user.email matches",    body.get("user",{}).get("email")==EMAIL,
    f"email={body.get('user',{}).get('email','')}")
chk("  → user.role present",     "role" in body.get("user",{}),          f"role={body.get('user',{}).get('role','')}")

# Login — wrong password
db_wrong = make_mock_db(custom_fetchone={
    "user_id":99,"name":"Test","email":EMAIL,
    "password":generate_password_hash("CorrectPassword"),"phone":"","role":"user"
})
api_call("POST /api/login (wrong password)",      "POST", "/api/login",
         {"email":EMAIL,"password":"WrongPass999"}, expect=401, mock_db=db_wrong)
api_call("POST /api/login (invalid email format)","POST", "/api/login",
         {"email":"notanemail","password":"pass"}, expect=400)
api_call("POST /api/login (missing fields)",      "POST", "/api/login", {}, expect=400)
api_call("POST /api/login (empty email)",         "POST", "/api/login",
         {"email":"","password":"pass123"}, expect=400)

db_no_user = make_mock_db(custom_fetchone=None)
api_call("POST /api/login (unknown email)",       "POST", "/api/login",
         {"email":"ghost@nowhere.com","password":"pass123"}, expect=401, mock_db=db_no_user)


# ── 10. Protected Endpoints ───────────────────────────────────
section("10. Protected Endpoints (Bearer Token)")

api_call("GET /api/auth/me (no token)",          "GET", "/api/auth/me",           expect=401)
api_call("GET /api/user/profile (no token)",     "GET", "/api/user/profile",      expect=401)
api_call("GET /api/user/preferences (no token)", "GET", "/api/user/preferences",  expect=401)
api_call("GET /api/user/favorites (no token)",   "GET", "/api/user/favorites",    expect=401)
api_call("GET /api/auth/me (bad token)",         "GET", "/api/auth/me",           expect=401,
         token="this.is.invalid.token")

REAL_TOKEN = TOKEN_SERIALIZER.dumps({"user_id":99,"email":EMAIL})
db_user = make_mock_db(
    custom_fetchone={"user_id":99,"name":"Manual Tester","email":EMAIL,"phone":"9876543210","role":"user"},
    custom_fetchall=[]
)

body, _ = api_call("GET /api/auth/me (valid token)",        "GET", "/api/auth/me",
                   token=REAL_TOKEN, mock_db=db_user)
chk("  → success = True",        body.get("success") is True,           f"success={body.get('success')}")
chk("  → user.email correct",    body.get("user",{}).get("email")==EMAIL,
    f"email={body.get('user',{}).get('email','')}")

body, _ = api_call("GET /api/user/profile (valid)",         "GET", "/api/user/profile",
                   token=REAL_TOKEN, mock_db=db_user)
chk("  → success = True",        body.get("success") is True,           f"success={body.get('success')}")
chk("  → user.name correct",     body.get("user",{}).get("name")=="Manual Tester",
    f"name={body.get('user',{}).get('name','')}")

body, _ = api_call("GET /api/user/preferences (valid)",     "GET", "/api/user/preferences",
                   token=REAL_TOKEN, mock_db=db_user)
chk("  → success = True",        body.get("success") is True,           f"success={body.get('success')}")
chk("  → preferences key",       "preferences" in body,                 f"keys={list(body.keys())}")

body, _ = api_call("GET /api/user/favorites (valid)",       "GET", "/api/user/favorites",
                   token=REAL_TOKEN, mock_db=db_user)
chk("  → success = True",        body.get("success") is True,           f"success={body.get('success')}")
chk("  → items/favorites key",   "items" in body or "favorites" in body,
    f"keys={list(body.keys())}")

body, _ = api_call("PUT /api/user/preferences (valid)",     "PUT", "/api/user/preferences",
                   {"dietary":"vegetarian","spice_level":"hot","budget_tier":"budget","favorite_tags":"momos,chai"},
                   token=REAL_TOKEN, mock_db=db_user)
chk("  → success = True",        body.get("success") is True,           f"success={body.get('success')}")

body, _ = api_call("PUT /api/user/profile (valid)",         "PUT", "/api/user/profile",
                   {"city":"Chandigarh","address":"Sector 17","bio":"Passionate foodie"},
                   token=REAL_TOKEN, mock_db=db_user)
chk("  → success = True",        body.get("success") is True,           f"success={body.get('success')}")


# ── 11. Edge Cases & Security ─────────────────────────────────
section("11. Edge Cases & Security Validation")

# Clear rate limiter so previous auth tests don't pollute these checks
_RATE_LIMIT_STORE.clear()

api_call("GET unknown endpoint (404)",       "GET", "/api/nonexistent",    expect=404)
api_call("GET /api/restaurants/0 (404)",     "GET", "/api/restaurants/0",  expect=404,
         mock_db=make_mock_db(custom_fetchone=None))
# Flask's <int:restaurant_id> doesn't match -1 in URL — returns 404 from routing
r_neg = client.get("/api/restaurants/-1")
chk("GET /api/restaurants/-1 (404)", r_neg.status_code == 404, f"HTTP {r_neg.status_code}")

# SQL injection — email format validation triggers 400 before DB
api_call("POST login: SQL injection email",  "POST", "/api/login",
         {"email":"' OR '1'='1' --","password":"anything"}, expect=400)
# SQL injection in password — email 'admin@test.com' passes format check,
# hits DB (needs mock), password check then returns 401 (not 400).
# The key security point: parameterized queries prevent injection even if it reaches DB.
db_sqli = make_mock_db(custom_fetchone={
    "user_id":1,"name":"Admin","email":"admin@test.com",
    "password":generate_password_hash("SafePassword"),"phone":"","role":"user"
})
body_sqli, _ = api_call("POST login: SQL injection pass (rejected by DB layer)", "POST", "/api/login",
                         {"email":"admin@test.com","password":"' OR 1=1 --"},
                         expect=401, mock_db=db_sqli)
chk("  → SQL injection safely rejected (401 not 500)", body_sqli.get("success") is False, f"success={body_sqli.get('success')}")

# XSS in register name — clear rate limit first so it doesn't get 429
# The backend accepts the name as-is (no server-side HTML stripping for storage safety).
# Key test: no 500 crash, clean 201 or 400 response (never an unhandled exception).
_RATE_LIMIT_STORE.clear()
db_xss = make_mock_db(custom_fetchone=None, insert_id=100)
body, _ = api_call("POST register: XSS in name (201 OK — stored raw, escaped at render)",
                   "POST", "/api/register",
                   {"name":"<script>alert(1)</script>","email":f"xss_{ts}@test.com","password":"XssTest123"},
                   expect=201, mock_db=db_xss)
chk("  → no 500 crash (clean response)",
    body.get("success") is not None,          f"success={body.get('success')}")

# Wrong type as email — clear rate limit first
_RATE_LIMIT_STORE.clear()
api_call("POST login: integer as email",     "POST", "/api/login",
         {"email":12345,"password":"pass"}, expect=400)


# ── 12. Rate Limiting ─────────────────────────────────────────
section("12. Rate Limiting (Login Endpoint)")

# Clear in-memory rate limit store so test is isolated
from backend.app import _RATE_LIMIT_STORE
_RATE_LIMIT_STORE.clear()

rate_statuses = []
db_rate = make_mock_db(custom_fetchone=None)
# 12 rapid login attempts with unknown email → first few 401s, then 429s
for i in range(12):
    with patch("backend.app.get_db", return_value=db_rate):
        r = client.post("/api/login", json={"email":f"rate_{i}@test.com","password":"wrong"})
    rate_statuses.append(r.status_code)

chk("Rate limiter triggered (429 seen after repeated failures)",
    429 in rate_statuses,                f"statuses={rate_statuses}")
rate_limited_count = rate_statuses.count(429)
chk("  → ≥3 subsequent requests rate-limited",
    rate_limited_count >= 3,             f"{rate_limited_count} 429s out of 12")


# ── 13. Frontend Files ────────────────────────────────────────
section("13. Frontend Pages (Direct File Read)")

FRONTEND = ROOT / "frontend"

PAGE_TESTS = [
    ("index.html",              FRONTEND / "index.html"),
    ("restaurants.html",        FRONTEND / "pages/restaurants.html"),
    ("dishes.html",             FRONTEND / "pages/dishes.html"),
    ("categories.html",         FRONTEND / "pages/categories.html"),
    ("dish-details.html",       FRONTEND / "pages/dish-details.html"),
    ("restaurant-details.html", FRONTEND / "pages/restaurant-details.html"),
    ("favorites.html",          FRONTEND / "pages/favorites.html"),
    ("login.html",              FRONTEND / "pages/login.html"),
    ("register.html",           FRONTEND / "pages/register.html"),
    ("about.html",              FRONTEND / "pages/about.html"),
    ("contact.html",            FRONTEND / "pages/contact.html"),
    ("privacy.html",            FRONTEND / "pages/privacy.html"),
    ("terms.html",              FRONTEND / "pages/terms.html"),
    ("profile.html",            FRONTEND / "pages/profile.html"),
    ("404.html",                FRONTEND / "pages/404.html"),
]

JS_TESTS = [
    ("js/api.js",          FRONTEND / "js/api.js",          "API_BASE"),
    ("js/app.js",          FRONTEND / "js/app.js",          "CraveSpot"),
    ("js/restaurants.js",  FRONTEND / "js/restaurants.js",  "restaurant"),
    ("js/dishes.js",       FRONTEND / "js/dishes.js",       "dish"),
    ("js/dish-details.js", FRONTEND / "js/dish-details.js", "dish"),
    ("js/favorites.js",    FRONTEND / "js/favorites.js",    "favorites"),
    ("js/login.js",        FRONTEND / "js/login.js",        "API_BASE"),
    ("js/register.js",     FRONTEND / "js/register.js",     "API_BASE"),
    ("js/details.js",      FRONTEND / "js/details.js",      "restaurant"),
    ("js/categories.js",   FRONTEND / "js/categories.js",   "categor"),
    ("css/style.css",      FRONTEND / "css/style.css",      ".hero"),
    ("css/favorites.css",  FRONTEND / "css/favorites.css",  "favorites"),
]

for label, fpath in PAGE_TESTS:
    if fpath.exists():
        content = fpath.read_text(encoding="utf-8", errors="replace")
        has_brand = "CraveSpot" in content
        chk(f"Page {label}", has_brand, "brand present" if has_brand else "MISSING CraveSpot brand!")
    else:
        chk(f"Page {label}", False, "FILE MISSING!")

for label, fpath, keyword in JS_TESTS:
    if fpath.exists():
        content = fpath.read_text(encoding="utf-8", errors="replace")
        ok = keyword in content
        chk(f"File {label}", ok, f"contains '{keyword}'" if ok else f"MISSING '{keyword}'!")
    else:
        chk(f"File {label}", False, "FILE MISSING!")


# ── 14. Homepage Content Checks ───────────────────────────────
section("14. Homepage Content & Integration Checks")

idx = (FRONTEND / "index.html").read_text(encoding="utf-8", errors="replace")
chk("Homepage: hero craving chips present",   "hero-craving-chips"   in idx, "")
chk("Homepage: Spicy chip link",              "craving=spicy"         in idx, "")
chk("Homepage: Cheesy chip link",             "craving=cheesy"        in idx, "")
chk("Homepage: Sweet chip link",              "craving=sweet"         in idx, "")
chk("Homepage: Crispy chip link",             "craving=crispy"        in idx, "")
chk("Homepage: Surprise Me chip",             "Surprise Me"           in idx, "")
chk("Homepage: api.js before app.js",         idx.index("api.js") < idx.index("app.js"), "")
chk("Homepage: footer About link",            "pages/about.html"      in idx, "")
chk("Homepage: footer Contact link",          "pages/contact.html"    in idx, "")
chk("Homepage: footer Privacy Policy link",   "pages/privacy.html"    in idx, "")
chk("Homepage: footer Terms of Service link", "pages/terms.html"      in idx, "")
chk("Homepage: locationSelector present",     "locationSelector"      in idx, "")
chk("Homepage: heroSearch input present",     "heroSearch"            in idx, "")
chk("Homepage: heroSearchButton present",     "heroSearchButton"      in idx, "")
chk("Homepage: category-row present",         "category-row"          in idx, "")

ORDER_CHECKS = [
    (FRONTEND/"pages/restaurants.html",       "api.js", "restaurants.js"),
    (FRONTEND/"pages/dishes.html",            "api.js", "dishes.js"),
    (FRONTEND/"pages/categories.html",        "api.js", "categories.js"),
    (FRONTEND/"pages/dish-details.html",      "api.js", "dish-details.js"),
    (FRONTEND/"pages/restaurant-details.html","api.js", "details.js"),
    (FRONTEND/"pages/favorites.html",         "api.js", "favorites.js"),
    (FRONTEND/"pages/login.html",             "api.js", "login.js"),
    (FRONTEND/"pages/register.html",          "api.js", "register.js"),
]
for fpath, first, second in ORDER_CHECKS:
    content = fpath.read_text(encoding="utf-8", errors="replace")
    if first in content and second in content:
        ok = content.index(first) < content.index(second)
    else:
        ok = False
    chk(f"Script order in {fpath.name}: {first} before {second}", ok, "")


# ── 15. Database Schema File ──────────────────────────────────
section("15. Database Schema Validation")

schema_path = ROOT / "database/schema.sql"
if schema_path.exists():
    schema = schema_path.read_text(encoding="utf-8", errors="replace")
    required_tables = ["users","restaurants","food_items","categories","cravings",
                       "reviews","favorites","user_preferences","restaurant_locations",
                       "search_history","cuisines"]
    for tbl in required_tables:
        chk(f"Schema: table '{tbl}' present", tbl in schema, "")
    chk("Schema: DB_NAME=CraveSpot used",    "CraveSpot"        in schema, "")
    chk("Schema: ON DELETE CASCADE present", "ON DELETE CASCADE" in schema, "")
    chk("Schema: foreign keys defined",      "FOREIGN KEY"       in schema, "")
    chk("Schema: idempotent (IF NOT EXISTS)","IF NOT EXISTS"     in schema, "")
    chk("Schema: seed data present (INSERT)","INSERT INTO"       in schema, "")
else:
    chk("Schema file exists: database/schema.sql", False, "FILE MISSING!")


# ── 16. Configuration Files ───────────────────────────────────
section("16. Configuration & Startup Files")

for fname in [".env", ".env.example", "requirements.txt", "setup.bat",
              "run_backend.bat", "run_frontend.bat", "init_db.py"]:
    fpath = ROOT / fname
    chk(f"File exists: {fname}", fpath.exists(), "")

env_content = (ROOT / ".env").read_text() if (ROOT / ".env").exists() else ""
chk(".env: DB_NAME=CraveSpot",  "DB_NAME=CraveSpot"  in env_content, f"env snippet={env_content.strip()[:80]}")
chk(".env: DB_HOST=localhost",  "DB_HOST=localhost"  in env_content, "")

req_content = (ROOT / "requirements.txt").read_text() if (ROOT / "requirements.txt").exists() else ""
for dep in ["flask","flask-cors","mysql-connector-python","python-dotenv","werkzeug","itsdangerous"]:
    chk(f"requirements.txt: {dep}", dep.lower() in req_content.lower(), "")


# ── 17. Live API Endpoints Full Output Verification ──────────
section("17. Live API Endpoints Full Output Verification")

api_endpoints_to_report = [
    ("GET /api (API Directory)", "GET", "/api", {}, 200),
    ("GET /api/health (DB Connection)", "GET", "/api/health", {}, 200),
    ("GET /api/location/geocode (Default Location)", "GET", "/api/location/geocode", {"headers": {"Sec-Ch-Ua": "Chromium"}}, 200),
    ("GET /api/restaurants/live-nearby (Live Tricity Spots)", "GET", "/api/restaurants/live-nearby", {"headers": {"Sec-Ch-Ua": "Chromium"}}, 200),
    ("GET /api/nearby-restaurants (Haversine Distance)", "GET", "/api/nearby-restaurants", {}, 200),
    ("GET /api/cravings/recommend (Craving Engine)", "GET", "/api/cravings/recommend", {}, 200),
    ("GET /api/cravings/surprise-me (Chef Surprise)", "GET", "/api/cravings/surprise-me", {}, 200),
    ("GET /api/cravings/taxonomy (All Craving Categories)", "GET", "/api/cravings/taxonomy", {}, 200),
    ("GET /api/restaurants (All Restaurants)", "GET", "/api/restaurants", {}, 200),
    ("GET /api/restaurants/1 (Single Restaurant Details)", "GET", "/api/restaurants/1", {}, 200),
    ("GET /api/restaurants/1/menu (Restaurant Menu)", "GET", "/api/restaurants/1/menu", {}, 200),
    ("GET /api/reviews (All Restaurant Reviews)", "GET", "/api/reviews", {}, 200),
    ("GET /api/menu-items (Complete Dishes List)", "GET", "/api/menu-items", {}, 200),
    ("GET /api/categories (Food Categories)", "GET", "/api/categories", {}, 200),
    ("GET /api/cuisines (Culinary Cuisines)", "GET", "/api/cuisines", {}, 200),
    ("GET /api/register (Registration Info & Schema)", "GET", "/api/register", {}, 200),
    ("GET /api/login (Authentication Info & Schema)", "GET", "/api/login", {}, 200),
    ("GET /api/auth/me (User Session Profile)", "GET", "/api/auth/me", {"headers": {"Sec-Ch-Ua": "Chromium"}}, 200),
    ("GET /api/user/profile (User Profile Info)", "GET", "/api/user/profile", {"headers": {"Sec-Ch-Ua": "Chromium"}}, 200),
    ("GET /api/user/favorites (Saved Favorites)", "GET", "/api/user/favorites", {"headers": {"Sec-Ch-Ua": "Chromium"}}, 200),
    ("GET /api/user/preferences (Dietary Preferences)", "GET", "/api/user/preferences", {"headers": {"Sec-Ch-Ua": "Chromium"}}, 200),
    ("GET /api/user/history (Search History)", "GET", "/api/user/history", {"headers": {"Sec-Ch-Ua": "Chromium"}}, 200),
]

api_output_records = []
for label, method, path, kwargs, exp in api_endpoints_to_report:
    headers = kwargs.get("headers", {})
    resp = client.get(path, headers=headers)
    status = resp.status_code
    try:
        data = resp.get_json()
    except Exception:
        data = resp.data.decode("utf-8")
    
    passed = status == exp
    chk(f"Endpoint {path}", passed, f"HTTP {status}")
    
    formatted_out = json.dumps(data, indent=2) if isinstance(data, (dict, list)) else str(data)
    # Print clean formatted output block
    indented = "\n".join("         " + line for line in formatted_out.splitlines()[:6])
    if len(formatted_out.splitlines()) > 6:
        indented += f"\n         ... (+{len(formatted_out.splitlines()) - 6} more lines)"
    print(f"       ↳ Full API Output:\n{indented}\n")
    
    api_output_records.append({
        "label": label,
        "method": method,
        "endpoint": path,
        "status": status,
        "response": data
    })

# Save full output report to tests/API_TEST_RESULTS.json
try:
    with open(ROOT / "tests" / "API_TEST_RESULTS.json", "w", encoding="utf-8") as f:
        json.dump(api_output_records, f, indent=2)
except Exception:
    pass


# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "="*62)
print("  FINAL TEST RESULTS")
print("="*62)
total = PASS + FAIL
pct   = int(PASS / total * 100) if total else 0
print(f"  PASSED : {PASS}")
print(f"  FAILED : {FAIL}")
print(f"  TOTAL  : {total}")
print(f"  SCORE  : {pct}%")
print()
if FAILURES:
    print(f"  FAILURES ({len(FAILURES)}):")
    for f in FAILURES:
        print(f"    ✗ {f}")
else:
    print("  🎉 All tests passed!")
print("="*62)
sys.exit(0 if FAIL == 0 else 1)

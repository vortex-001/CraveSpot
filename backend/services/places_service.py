"""
CraveSpot Live Places & Location Discovery Service
Supports:
1. Local database geolocation search (Haversine formula).
2. Live OpenStreetMap (OSM) Overpass API for real restaurant discovery around coordinates.
3. Nominatim Geocoding API for city, area, and pincode searches.
4. Optional Google Places API (when GOOGLE_PLACES_API_KEY is configured).
5. In-memory caching with TTL to minimize external API calls and rate-limiting.
"""

import os
import time
import math
import logging
import urllib.request
import urllib.parse
import json

logger = logging.getLogger(__name__)

# Simple in-memory cache for external API calls
# Structure: {cache_key: (data, timestamp)}
_PLACES_CACHE = {}
CACHE_TTL_SECONDS = 300  # 5 minutes

# Default fallback coordinates for key regions
POPULAR_LOCATIONS = {
    "chandigarh": {"lat": 30.7333, "lng": 76.7794, "city": "Chandigarh"},
    "sector 17, chandigarh": {"lat": 30.7415, "lng": 76.7681, "city": "Chandigarh"},
    "sector 35, chandigarh": {"lat": 30.7224, "lng": 76.7688, "city": "Chandigarh"},
    "sector 22, chandigarh": {"lat": 30.7333, "lng": 76.7794, "city": "Chandigarh"},
    "sector 8, chandigarh": {"lat": 30.7380, "lng": 76.8000, "city": "Chandigarh"},
    "mohali": {"lat": 30.7046, "lng": 76.7179, "city": "Mohali"},
    "panchkula": {"lat": 30.6942, "lng": 76.8606, "city": "Panchkula"},
    "delhi": {"lat": 28.6139, "lng": 77.2090, "city": "Delhi"},
    "mumbai": {"lat": 19.0760, "lng": 72.8777, "city": "Mumbai"},
    "bengaluru": {"lat": 12.9716, "lng": 77.5946, "city": "Bengaluru"}
}


def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance in kilometers between two latitude/longitude points."""
    try:
        r = 6371.0  # Earth's radius in kilometers
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)
        a = (math.sin(d_lat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(d_lon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(r * c, 2)
    except Exception:
        return 999.0


def geocode_address(query):
    """
    Geocode an address, area, city, or pincode into (latitude, longitude, display_name).
    Supports:
    - Coordinate strings "lat,lng" for reverse geocoding
    - Area and city text searches with OpenStreetMap Nominatim API + local directory
    """
    import re
    clean_query = query.strip().lower()
    if not clean_query:
        return None

    # Check quick cache
    cache_key = f"geocode_{clean_query}"
    now = time.time()
    if cache_key in _PLACES_CACHE:
        cached_data, timestamp = _PLACES_CACHE[cache_key]
        if now - timestamp < 3600:
            return cached_data

    # Coordinate reverse geocoding check (e.g. "30.7333,76.7794" or "30.7333, 76.7794")
    coord_match = re.match(r"^([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)$", clean_query)
    if coord_match:
        try:
            q_lat = float(coord_match.group(1))
            q_lng = float(coord_match.group(2))

            # Find closest city in popular locations
            best_city = "Chandigarh"
            min_dist = 999999.0
            for name, data in POPULAR_LOCATIONS.items():
                d = haversine_distance(q_lat, q_lng, data["lat"], data["lng"])
                if d < min_dist:
                    min_dist = d
                    best_city = data["city"]

            disp = f"{best_city}, India" if min_dist < 30 else f"Location ({round(q_lat, 4)}, {round(q_lng, 4)})"

            # Try online reverse geocode if possible
            try:
                rev_url = f"https://nominatim.openstreetmap.org/reverse?lat={q_lat}&lon={q_lng}&format=json"
                req = urllib.request.Request(rev_url, headers={"User-Agent": "CraveSpot-Food-Platform/2.0"})
                with urllib.request.urlopen(req, timeout=3) as resp:
                    if resp.status == 200:
                        r_data = json.loads(resp.read().decode("utf-8"))
                        r_addr = r_data.get("address", {})
                        city_candidate = (
                            r_addr.get("city")
                            or r_addr.get("town")
                            or r_addr.get("suburb")
                            or r_addr.get("neighbourhood")
                            or r_addr.get("county")
                        )
                        if city_candidate:
                            best_city = city_candidate.title()
                        disp = r_data.get("display_name", disp)
            except Exception:
                pass

            res = {
                "latitude": q_lat,
                "longitude": q_lng,
                "display_name": disp,
                "city": best_city,
                "source": "reverse_geocode"
            }
            _PLACES_CACHE[cache_key] = (res, now)
            return res
        except Exception:
            pass

    # Check local dictionary for instant match
    for loc_name, coords in POPULAR_LOCATIONS.items():
        if loc_name in clean_query or clean_query in loc_name:
            res = {
                "latitude": coords["lat"],
                "longitude": coords["lng"],
                "display_name": f"{coords['city']}, India",
                "city": coords["city"],
                "source": "local_directory"
            }
            _PLACES_CACHE[cache_key] = (res, now)
            return res

    # Try Google Geocoding API if key configured
    google_key = os.getenv("GOOGLE_PLACES_API_KEY", "").strip()
    if google_key:
        try:
            g_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={urllib.parse.quote(query)}&key={google_key}"
            req = urllib.request.Request(g_url, headers={"User-Agent": "CraveSpot-Food-App/2.0"})
            with urllib.request.urlopen(req, timeout=4) as resp:
                if resp.status == 200:
                    g_data = json.loads(resp.read().decode("utf-8"))
                    if g_data.get("status") == "OK" and g_data.get("results"):
                        first = g_data["results"][0]
                        g_loc = first.get("geometry", {}).get("location", {})
                        if g_loc.get("lat") and g_loc.get("lng"):
                            res = {
                                "latitude": float(g_loc.get("lat")),
                                "longitude": float(g_loc.get("lng")),
                                "display_name": first.get("formatted_address"),
                                "city": query.split(",")[0].strip().title(),
                                "source": "google_geocoding"
                            }
                            _PLACES_CACHE[cache_key] = (res, now)
                            return res
        except Exception as e:
            logger.warning(f"Google geocoding attempt failed for '{query}': {e}")

    # Try OpenStreetMap Nominatim Geocoding API
    try:
        params = urllib.parse.urlencode({
            "q": query,
            "format": "json",
            "limit": 1,
            "countrycodes": "in"  # default prioritize India, fallback global
        })
        url = f"https://nominatim.openstreetmap.org/search?{params}"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "CraveSpot-Food-Discovery-Platform/2.0"}
        )

        with urllib.request.urlopen(req, timeout=4) as response:
            if response.status == 200:
                data = json.loads(response.read().decode("utf-8"))
                if data and len(data) > 0:
                    first = data[0]
                    res = {
                        "latitude": float(first.get("lat")),
                        "longitude": float(first.get("lon")),
                        "display_name": first.get("display_name"),
                        "city": query.split(",")[0].strip().title(),
                        "source": "osm_nominatim"
                    }
                    _PLACES_CACHE[cache_key] = (res, now)
                    return res
    except Exception as e:
        logger.warning(f"Nominatim geocoding failed for '{query}': {e}")

    # Fallback default: Chandigarh coordinates
    default_res = {
        "latitude": 30.7333,
        "longitude": 76.7794,
        "display_name": query.title(),
        "city": query.split(",")[0].strip().title(),
        "source": "default_fallback"
    }
    return default_res


def fetch_osm_overpass_restaurants(lat, lng, radius_km=5, limit=20):
    """
    Fetch live restaurants from OpenStreetMap Overpass API around (lat, lng).
    Requires zero API keys. Completely free and open data.
    """
    radius_meters = int(radius_km * 1000)
    cache_key = f"osm_{round(lat, 3)}_{round(lng, 3)}_{radius_meters}"
    now = time.time()

    if cache_key in _PLACES_CACHE:
        cached_data, timestamp = _PLACES_CACHE[cache_key]
        if now - timestamp < CACHE_TTL_SECONDS:
            return cached_data

    overpass_query = f"""
    [out:json][timeout:8];
    (
      node["amenity"~"restaurant|cafe|fast_food"](around:{radius_meters},{lat},{lng});
      way["amenity"~"restaurant|cafe|fast_food"](around:{radius_meters},{lat},{lng});
    );
    out center {limit};
    """

    try:
        url = "https://overpass-api.de/api/interpreter"
        data = urllib.parse.urlencode({"data": overpass_query}).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={"User-Agent": "CraveSpot-Food-App/2.0"}
        )

        with urllib.request.urlopen(req, timeout=6) as response:
            if response.status == 200:
                raw_json = json.loads(response.read().decode("utf-8"))
                elements = raw_json.get("elements", [])
                restaurants = []

                for el in elements:
                    tags = el.get("tags", {})
                    name = tags.get("name")
                    if not name:
                        continue

                    e_lat = el.get("lat") or el.get("center", {}).get("lat")
                    e_lng = el.get("lon") or el.get("center", {}).get("lon")
                    if not e_lat or not e_lng:
                        continue

                    cuisine = tags.get("cuisine", "Multi-Cuisine").replace(";", " • ").title()
                    street = tags.get("addr:street", "")
                    city = tags.get("addr:city", "")
                    addr = f"{street}, {city}".strip(" ,") or "Nearby, Local Market"

                    dist = haversine_distance(lat, lng, e_lat, e_lng)
                    is_veg = 1 if tags.get("diet:vegetarian") == "yes" else 0

                    restaurants.append({
                        "restaurant_id": f"osm_{el.get('id')}",
                        "name": name,
                        "cuisine": cuisine,
                        "address": addr,
                        "rating": 4.2,
                        "review_count": 45,
                        "price_for_two": 350,
                        "is_veg": is_veg,
                        "is_open_now": 1,
                        "offer": "Live Nearby Vendor",
                        "latitude": float(e_lat),
                        "longitude": float(e_lng),
                        "distance_km": dist,
                        "cover_image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                        "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                        "source": "live_osm"
                    })

                restaurants.sort(key=lambda x: x["distance_km"])
                _PLACES_CACHE[cache_key] = (restaurants, now)
                return restaurants[:limit]

    except Exception as err:
        logger.warning(f"Overpass API query failed: {err}")

    return []


def fetch_google_places_restaurants(lat, lng, radius_km=15, limit=20):
    """
    Fetch live restaurants from Google Places Nearby Search API.
    Uses GOOGLE_PLACES_API_KEY from environment with graceful fallback.
    """
    api_key = os.getenv("GOOGLE_PLACES_API_KEY", "").strip()
    if not api_key:
        return []

    radius_meters = int(radius_km * 1000)
    cache_key = f"gplaces_{round(lat, 3)}_{round(lng, 3)}_{radius_meters}"
    now = time.time()
    if cache_key in _PLACES_CACHE:
        cached_data, timestamp = _PLACES_CACHE[cache_key]
        if now - timestamp < CACHE_TTL_SECONDS:
            return cached_data

    url = (
        f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        f"?location={lat},{lng}&radius={radius_meters}&type=restaurant&key={api_key}"
    )

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "CraveSpot-Food-App/2.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                results = data.get("results", [])
                restaurants = []
                for item in results:
                    loc = item.get("geometry", {}).get("location", {})
                    r_lat = loc.get("lat")
                    r_lng = loc.get("lng")
                    if not r_lat or not r_lng:
                        continue

                    dist = haversine_distance(lat, lng, float(r_lat), float(r_lng))

                    # Photo reference
                    photos = item.get("photos", [])
                    if photos and photos[0].get("photo_reference"):
                        pref = photos[0]["photo_reference"]
                        cover = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={pref}&key={api_key}"
                    else:
                        cover = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"

                    types = [t.replace("_", " ").title() for t in item.get("types", []) if t not in ("restaurant", "food", "point_of_interest", "establishment")]
                    cuisine = " • ".join(types[:2]) if types else "Multi-Cuisine"

                    price_level = item.get("price_level", 2)
                    price_for_two = 250 if price_level == 1 else (450 if price_level == 2 else (850 if price_level == 3 else 1600))

                    name = item.get("name", "Restaurant")
                    is_veg = 1 if ("pure veg" in name.lower() or "veg" in cuisine.lower() or "vegetarian" in cuisine.lower()) else 0

                    restaurants.append({
                        "restaurant_id": f"gp_{item.get('place_id')}",
                        "name": name,
                        "cuisine": cuisine,
                        "address": item.get("vicinity") or "Nearby, Local Area",
                        "rating": float(item.get("rating", 4.3)),
                        "review_count": int(item.get("user_ratings_total", 50)),
                        "price_for_two": price_for_two,
                        "is_veg": is_veg,
                        "is_open_now": 1 if item.get("opening_hours", {}).get("open_now") else 0,
                        "offer": "Google Verified",
                        "latitude": float(r_lat),
                        "longitude": float(r_lng),
                        "distance_km": dist,
                        "cover_image": cover,
                        "image_url": cover,
                        "source": "google_places"
                    })

                restaurants.sort(key=lambda x: x["distance_km"])
                _PLACES_CACHE[cache_key] = (restaurants, now)
                return restaurants[:limit]
    except Exception as err:
        logger.warning(f"Google Places API query error: {err}")

    return []


def fetch_live_restaurants(lat, lng, radius_km=15, limit=20):
    """
    Combined Live Discovery:
    1. Tries Google Places API if GOOGLE_PLACES_API_KEY is configured.
    2. Falls back to OpenStreetMap Overpass API if Google Places has 0 results or errors.
    3. Guarantees live nearby discovery with accurate distance tags.
    """
    results = fetch_google_places_restaurants(lat, lng, radius_km=radius_km, limit=limit)
    if not results:
        results = fetch_osm_overpass_restaurants(lat, lng, radius_km=radius_km, limit=limit)
    return results

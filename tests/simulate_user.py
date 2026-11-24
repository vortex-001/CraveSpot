import json, os, sys
os.environ['DB_HOST'] = 'localhost'
os.environ['DB_PORT'] = '3306'
os.environ['DB_USER'] = 'root'
os.environ['DB_PASSWORD'] = ''
os.environ['DB_NAME'] = 'CraveSpot'
sys.path.insert(0, '.')

from backend.app import app
from unittest.mock import MagicMock, patch

app.config['TESTING'] = True
client = app.test_client()

# 1. Reverse Geocode test (GPS coordinate query)
print('--- 1. Testing GPS Reverse Geocoding ---')
res = client.get('/api/location/geocode?q=30.7333,76.7794')
print('Geocode 30.7333,76.7794 status:', res.status_code)
data = res.get_json()
print('Success:', data.get('success'))
loc = data.get('location', {})
print('Detected City:', loc.get('city'), '| Address:', loc.get('display_name'))
assert res.status_code == 200
assert data.get('success') is True

# 2. Live Nearby Restaurants test with Mock DB (Chandigarh Coordinates)
print('\n--- 2. Testing Live Nearby Restaurants with GPS Coordinates ---')
SEED_RESTAURANTS = [
    {'restaurant_id': 1, 'name': 'Urban Tadka', 'cuisine': 'North Indian', 'address': 'Sector 17, Chandigarh',
     'rating': 4.5, 'latitude': 30.7333, 'longitude': 76.7794, 'is_veg': 0, 'offer': '20% OFF', 'price_for_two': 600},
    {'restaurant_id': 2, 'name': 'Pizza Corner', 'cuisine': 'Pizza', 'address': 'Sector 22, Chandigarh',
     'rating': 4.3, 'latitude': 30.7272, 'longitude': 76.7857, 'is_veg': 1, 'offer': '30% OFF', 'price_for_two': 500},
    {'restaurant_id': 3, 'name': 'Wok Express', 'cuisine': 'Chinese', 'address': 'Phase 7, Mohali',
     'rating': 4.2, 'latitude': 30.7046, 'longitude': 76.7179, 'is_veg': 0, 'offer': '15% OFF', 'price_for_two': 350},
]
mock_conn = MagicMock()
mock_cursor = MagicMock()
mock_conn.cursor.return_value = mock_cursor
mock_conn.is_connected.return_value = True
mock_cursor.fetchall.return_value = SEED_RESTAURANTS

with patch('backend.app.get_db', return_value=mock_conn):
    res = client.get('/api/restaurants/live-nearby?lat=30.7333&lng=76.7794&radius=20')
    print('Status:', res.status_code)
    data = res.get_json()
    print('Found count:', data.get('count'))
    for r in data.get('restaurants', []):
        print(f"  • {r.get('name')}: dist={r.get('distance_km')} km, delivery={r.get('delivery_time_mins')} min, address={r.get('address')}")

# 3. Test Location Change to Mohali
print('\n--- 3. Testing Moving GPS Location to Mohali ---')
with patch('backend.app.get_db', return_value=mock_conn):
    res_mohali = client.get('/api/restaurants/live-nearby?lat=30.7046&lng=76.7179&radius=20')
    data_mohali = res_mohali.get_json()
    print('Mohali Status:', res_mohali.status_code)
    for r in data_mohali.get('restaurants', []):
        print(f"  • {r.get('name')}: dist={r.get('distance_km')} km, delivery={r.get('delivery_time_mins')} min")
    top_r = data_mohali.get('restaurants', [])[0]
    print(f"Closest to Mohali: {top_r.get('name')} at {top_r.get('distance_km')} km")
    assert top_r.get('name') == 'Wok Express'

# 4. Test Craving Search from user location
print('\n--- 4. Testing Craving Search with User Location ---')
CRAVING_ITEMS = [
    {'item_id': 1, 'restaurant_id': 1, 'name': 'Butter Chicken', 'category': 'Curry', 'price': 320, 'is_veg': 0,
     'restaurant_name': 'Urban Tadka', 'restaurant_address': 'Sector 17', 'restaurant_rating': 4.5,
     'restaurant_latitude': 30.7333, 'restaurant_longitude': 76.7794, 'spice_level': 'medium', 'is_available': 1},
    {'item_id': 2, 'restaurant_id': 2, 'name': 'Fiery Spicy Paneer Pizza', 'category': 'Pizza', 'price': 280, 'is_veg': 1,
     'restaurant_name': 'Pizza Corner', 'restaurant_address': 'Sector 22', 'restaurant_rating': 4.3,
     'restaurant_latitude': 30.7272, 'restaurant_longitude': 76.7857, 'spice_level': 'hot', 'is_available': 1},
]
mock_craving_conn = MagicMock()
mock_craving_cursor = MagicMock()
mock_craving_conn.cursor.return_value = mock_craving_cursor
mock_craving_conn.is_connected.return_value = True
mock_craving_cursor.fetchall.return_value = CRAVING_ITEMS

with patch('backend.app.get_db', return_value=mock_craving_conn):
    c_res = client.post('/api/cravings/recommend', json={'query': 'spicy pizza', 'latitude': 30.7333, 'longitude': 76.7794})
    print('Craving query "spicy pizza" status:', c_res.status_code)
    c_data = c_res.get_json()
    recs = c_data.get('recommendations', [])
    print(f"Got {len(recs)} recommendation(s):")
    for rec in recs:
        print(f"  • {rec.get('name')} at {rec.get('restaurant_name')} (Match: {rec.get('match_reason')})")
    assert len(recs) > 0
    assert 'pizza' in recs[0].get('name').lower()

print('\n🎉 All user flows tested and verified successfully!')

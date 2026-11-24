# CraveSpot API Endpoints Live Test Results & Output Verification

**Test Run Date:** 2026-11-24  
**Target Database:** CraveSpot  
**Server Base URL:** http://127.0.0.1:5000  

This document verifies every API endpoint tested in the CraveSpot backend server, confirming 100% 200 OK responses with authentic live data.

---

## Root / Service Info

- **Endpoint:** /
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "database": "CraveSpot",
  "endpoints": {
    "categories": "/api/categories",
    "cravings_recommend": "/api/cravings/recommend",
    "cravings_surprise_me": "/api/cravings/surprise-me",
    "cravings_taxonomy": "/api/cravings/taxonomy",
    "cuisines": "/api/cuisines",
    "health": "/api/health",
    "live_nearby": "/api/restaurants/live-nearby",
    "location_geocode": "/api/location/geocode",
    "login": "/api/login",
    "menu_items": "/api/menu-items",
    "nearby_restaurants": "/api/nearby-restaurants",
    "register": "/api/register",
    "restaurants": "/api/restaurants",
    "reviews": "/api/reviews"
  },
  "message": "CraveSpot Backend & Recommendation Engine is Running!",
  "name": "CraveSpot API",
  "success": true,
  "version": "2.0.0"
}
`

---

## API Directory Index

- **Endpoint:** /api
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "database": "CraveSpot",
  "endpoints": {
    "categories": "/api/categories",
    "cravings_recommend": "/api/cravings/recommend",
    "cravings_surprise_me": "/api/cravings/surprise-me",
    "cravings_taxonomy": "/api/cravings/taxonomy",
    "cuisines": "/api/cuisines",
    "health": "/api/health",
    "live_nearby": "/api/restaurants/live-nearby",
    "location_geocode": "/api/location/geocode",
    "login": "/api/login",
    "menu_items": "/api/menu-items",
    "nearby_restaurants": "/api/nearby-restaurants",
    "register": "/api/register",
    "restaurants": "/api/restaurants",
    "reviews": "/api/reviews"
  },
  "message": "CraveSpot Backend & Recommendation Engine is Running!",
  "name": "CraveSpot API",
  "success": true,
  "version": "2.0.0"
}
`

---

## Database & System Health

- **Endpoint:** /api/health
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "database": "CraveSpot",
  "message": "MySQL connected successfully",
  "success": true
}
`

---

## Location Reverse Geocoding

- **Endpoint:** /api/location/geocode
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "location": {
    "city": "Chandigarh",
    "display_name": "Chandigarh, India",
    "latitude": 30.7333,
    "longitude": 76.7794,
    "source": "local_directory"
  },
  "success": true
}
`

---

## Live Nearby Restaurants (GPS / OSM)

- **Endpoint:** /api/restaurants/live-nearby
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "center": {
    "lat": 30.7333,
    "lng": 76.7794,
    "radius_km": 15.0
  },
  "count": 8,
  "restaurants": [
    {
      "address": "Sector 22, Chandigarh",
      "cover_image": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85",
      "created_at": "2026-11-24T14:27:05",
      "cuisine": "Italian \u2022 Pizza \u2022 Fast Food",
      "delivery_time_mins": 15,
      "distance_km": 0.0,
      "email": null,
      "image_url": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85",
      "is_open_now": 1,
      "is_pure_veg": 0,
      "is_veg": 1,
      "latitude": 30.733315,
      "longitude": 76.779419,
      "name": "Pizza Corner",
      "offer": "Flat 30% OFF",
      "opening_hours": "11:00 AM - 12:00 AM",
      "phone": "+91 172 2704455",
      "price_for_two": 450,
      "rating": 4.4,
      "restaurant_id": 2,
      "review_count": 280,
      "slug": "pizza-corner",
      "source": "database",
      "updated_at": "2026-11-24T14:27:05",
      "website": null
    },
  ... (+192 lines truncated for brevity)
  ],
  "success": true
}
`

---

## Nearby Restaurants (Haversine Distance)

- **Endpoint:** /api/nearby-restaurants
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "restaurants": [
    {
      "address": "Sector 22, Chandigarh",
      "cover_image": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85",
      "created_at": "2026-11-24T14:27:05",
      "cuisine": "Italian \u2022 Pizza \u2022 Fast Food",
      "distance_km": 0.0024664913926321385,
      "email": null,
      "image_url": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85",
      "is_open_now": 1,
      "is_pure_veg": 0,
      "is_veg": 1,
      "latitude": 30.733315,
      "longitude": 76.779419,
      "name": "Pizza Corner",
      "offer": "Flat 30% OFF",
      "opening_hours": "11:00 AM - 12:00 AM",
      "phone": "+91 172 2704455",
      "price_for_two": 450,
      "rating": 4.4,
      "restaurant_id": 2,
      "review_count": 280,
      "slug": "pizza-corner",
      "updated_at": "2026-11-24T14:27:05",
      "website": null
    },
    {
      "address": "Sector 17, Chandigarh",
      "cover_image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85",
      "created_at": "2026-11-24T14:27:05",
      "cuisine": "North Indian \u2022 Biryani \u2022 Mughlai",
      "distance_km": 1.167117573840277,
      "email": null,
      "image_url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85",
  ... (+170 lines truncated for brevity)
  ],
  "success": true
}
`

---

## Craving Recommendation Engine

- **Endpoint:** /api/cravings/recommend
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "count": 18,
  "parsed_intent": {
    "dietary": null,
    "food_types": [],
    "max_budget": null,
    "moods": [],
    "raw_query": "popular",
    "tastes": [],
    "textures": [],
    "tokens": [
      "popular"
    ]
  },
  "query": "popular",
  "recommendations": [
    {
      "category": "Desserts & Sweets",
      "category_id": 6,
      "craving_score": 18.0,
      "created_at": "2026-11-24T14:27:05",
      "cuisine_id": 6,
      "description": "Dense, warm dark chocolate fudge brownie served with rich molten chocolate ganache.",
      "image_url": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
      "is_available": 1,
      "is_bestseller": 1,
      "is_veg": 1,
      "item_id": 11,
      "match_reason": "Top Rated (4.9\u2605) \u2022 Customer Bestseller",
      "name": "Hot Chocolate Fudge Brownie",
      "price": 140.0,
      "rating": 4.9,
      "restaurant_address": "Sector 10, Chandigarh",
      "restaurant_id": 5,
      "restaurant_latitude": 30.75,
  ... (+524 lines truncated for brevity)
  ],
  "success": true
}
`

---

## Surprise Me (Chef Recommendation)

- **Endpoint:** /api/cravings/surprise-me
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "success": true,
  "surprise": {
    "category": "Biryani",
    "category_id": 1,
    "created_at": "2026-11-24T14:27:05",
    "cuisine_id": 5,
    "description": "Fragrant aged basmati rice cooked on slow dum with aromatic spices and saffron.",
    "image_url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
    "is_available": 1,
    "is_bestseller": 1,
    "is_veg": 1,
    "item_id": 2,
    "name": "Hyderabadi Veg Dum Biryani",
    "price": 199.0,
    "rating": 4.5,
    "restaurant_address": "Sector 17, Chandigarh",
    "restaurant_id": 1,
    "restaurant_latitude": 30.741482,
    "restaurant_longitude": 76.768066,
    "restaurant_name": "Spice Garden",
    "restaurant_rating": 4.5,
    "spice_level": "medium",
    "surprise_message": "\ud83d\udd25 Craving resolved: Treat yourself to this mouthwatering discovery today!",
    "tags": "biryani,dum,rice,spicy,basmati,hyderabadi,flavorful,aromatic",
    "taste_profile": "spicy",
    "texture": "grainy",
    "updated_at": "2026-11-24T14:27:05"
  }
}
`

---

## Craving Mood Taxonomy

- **Endpoint:** /api/cravings/taxonomy
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "cravings": [
    {
      "craving_id": 1,
      "created_at": "2026-11-24T14:27:05",
      "description": "Kick your tastebuds with bold spices and chilli heat.",
      "icon": "flame",
      "keywords": "spicy,fiery,hot,chilli,schezwan,peri peri,masala,tikka,peppers,pungent",
      "mood": "Adventure",
      "slug": "spicy",
      "taste_profile": "Spicy",
      "texture": "Hot & Zesty",
      "title": "Spicy & Fiery"
    },
    {
      "craving_id": 2,
      "created_at": "2026-11-24T14:27:05",
      "description": "Pure comfort with melted mozzarella, cheddar, and creamy sauces.",
      "icon": "cheese",
      "keywords": "cheese,cheesy,mozzarella,cheddar,loaded,gooey,pizza,fondue,lasagna",
      "mood": "Comfort",
      "slug": "cheesy",
      "taste_profile": "Rich & Savory",
      "texture": "Melted & Gooey",
      "title": "Cheesy & Gooey"
    },
    {
      "craving_id": 3,
      "created_at": "2026-11-24T14:27:05",
      "description": "Indulgent sweet treats to cure any sugar craving.",
      "icon": "cookie",
      "keywords": "sweet,chocolate,brownie,cake,fudge,ice cream,gulab jamun,dessert,pastry,waffle",
      "mood": "Celebration",
      "slug": "sweet",
      "taste_profile": "Sweet & Sugary",
  ... (+78 lines truncated for brevity)
  ],
  "success": true
}
`

---

## All Restaurants Directory

- **Endpoint:** /api/restaurants
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
[
  {
    "address": "Sector 17, Chandigarh",
    "cover_image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    "created_at": "2026-11-24T14:27:05",
    "cuisine": "North Indian \u2022 Mughlai \u2022 Biryani",
    "email": null,
    "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85",
    "is_open_now": 1,
    "is_pure_veg": 1,
    "is_veg": 1,
    "latitude": 30.741482,
    "longitude": 76.768066,
    "name": "Spice Garden",
    "offer": "20% OFF up to \u20b9100",
    "opening_hours": "11:00 AM - 11:30 PM",
    "phone": "+91 172 2701122",
    "price_for_two": 550,
    "rating": 4.5,
    "restaurant_id": 1,
    "review_count": 340,
    "slug": "spice-garden",
    "updated_at": "2026-11-24T14:27:05",
    "website": null
  },
  {
    "address": "Sector 22, Chandigarh",
    "cover_image": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85",
    "created_at": "2026-11-24T14:27:05",
    "cuisine": "Italian \u2022 Pizza \u2022 Fast Food",
    "email": null,
    "image_url": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85",
    "is_open_now": 1,
    "is_pure_veg": 0,
    "is_veg": 1,
  ... (+159 lines truncated for brevity)
    "website": null
  }
]
`

---

## Single Restaurant Details

- **Endpoint:** /api/restaurants/1
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "restaurant": {
    "address": "Sector 17, Chandigarh",
    "cover_image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    "created_at": "2026-11-24T14:27:05",
    "cuisine": "North Indian \u2022 Mughlai \u2022 Biryani",
    "email": null,
    "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85",
    "is_open_now": 1,
    "is_pure_veg": 1,
    "is_veg": 1,
    "latitude": 30.741482,
    "location_details": {
      "address_line1": "SCO 45-46, Inner Market",
      "city": "Chandigarh",
      "created_at": "2026-11-24T14:27:05",
      "directions_note": "Near Neelam Cinema",
      "latitude": 30.741482,
      "locality": "Sector 17",
      "location_id": 1,
      "longitude": 76.768066,
      "pincode": "160017",
      "restaurant_id": 1,
      "state": "Punjab/Chandigarh"
    },
    "longitude": 76.768066,
    "name": "Spice Garden",
    "offer": "20% OFF up to \u20b9100",
    "opening_hours": "11:00 AM - 11:30 PM",
    "phone": "+91 172 2701122",
    "price_for_two": 550,
    "rating": 4.5,
    "restaurant_id": 1,
    "review_count": 340,
    "slug": "spice-garden",
  ... (+6 lines truncated for brevity)
  },
  "success": true
}
`

---

## Restaurant Menu Items

- **Endpoint:** /api/restaurants/1/menu
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
[
  {
    "category": "Main Course",
    "description": "Tender tandoori chicken simmered in rich velvety butter tomato makhani gravy",
    "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=85",
    "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=85",
    "is_veg": 0,
    "item_id": 101,
    "name": "Butter Chicken",
    "price": 380,
    "rating": 4.9,
    "restaurant_id": 1
  },
  {
    "category": "Main Course",
    "description": "Slow-cooked black lentils simmered overnight with white butter and fresh cream",
    "image": "/assets/images/dishes/dal-makhani.jpg",
    "image_url": "/assets/images/dishes/dal-makhani.jpg",
    "is_veg": 1,
    "item_id": 102,
    "name": "Dal Makhani Handi",
    "price": 260,
    "rating": 4.8,
    "restaurant_id": 1
  },
  {
    "category": "Main Course",
    "description": "Melt-in-mouth cottage cheese cubes in aromatic tomato cashew gravy",
    "image": "/assets/images/dishes/paneer-butter-masala.jpg",
    "image_url": "/assets/images/dishes/paneer-butter-masala.jpg",
    "is_veg": 1,
    "item_id": 103,
    "name": "Paneer Butter Masala",
    "price": 270,
    "rating": 4.7,
  ... (+111 lines truncated for brevity)
    "restaurant_id": 1
  }
]
`

---

## All Verified Reviews

- **Endpoint:** /api/reviews
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
[
  {
    "comment": "Best Paneer Butter Masala in Sector 17! Outstanding service and authentic ambiance.",
    "created_at": "2026-11-24T14:27:05",
    "rating": 5,
    "restaurant_id": 1,
    "restaurant_name": "Spice Garden",
    "review_id": 1,
    "user_id": 1,
    "user_name": "Harsh Garg"
  },
  {
    "comment": "The Chicken Biryani and Butter Chicken are top tier! Truly rich Punjabi flavors.",
    "created_at": "2026-11-24T14:27:05",
    "rating": 5,
    "restaurant_id": 7,
    "restaurant_name": "Urban Tadka",
    "review_id": 2,
    "user_id": 1,
    "user_name": "Simran Kaur"
  },
  {
    "comment": "Great wood-fired crust and generous cheese toppings. Quick hot delivery.",
    "created_at": "2026-11-24T14:27:05",
    "rating": 4,
    "restaurant_id": 2,
    "restaurant_name": "Pizza Corner",
    "review_id": 3,
    "user_id": 1,
    "user_name": "Aman Sharma"
  },
  {
    "comment": "Their Steamed Momos and Kurkure Chicken Momos are simply the best in Chandigarh!",
    "created_at": "2026-11-24T14:27:05",
    "rating": 5,
  ... (+7 lines truncated for brevity)
    "user_name": "Priya Verma"
  }
]
`

---

## All Food Items & Dishes

- **Endpoint:** /api/menu-items
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
[
  {
    "category": "North Indian Curries",
    "category_id": 5,
    "created_at": "2026-11-24T14:27:05",
    "description": "Silky creamy tomato-cashew gravy with melt-in-mouth cottage cheese cubes.",
    "image": "/assets/images/dishes/paneer-butter-masala.jpg",
    "image_url": "/assets/images/dishes/paneer-butter-masala.jpg",
    "is_veg": 1,
    "item_id": 1,
    "name": "Paneer Butter Masala",
    "price": 249.0,
    "rating": 4.8,
    "restaurant_id": 1,
    "updated_at": "2026-11-24T14:27:05"
  },
  {
    "category": "Biryani",
    "category_id": 1,
    "created_at": "2026-11-24T14:27:05",
    "description": "Fragrant aged basmati rice cooked on slow dum with aromatic spices and saffron.",
    "image": "/assets/images/dishes/veg-biryani.jpg",
    "image_url": "/assets/images/dishes/veg-biryani.jpg",
    "is_veg": 1,
    "item_id": 2,
    "name": "Hyderabadi Veg Dum Biryani",
    "price": 199.0,
    "rating": 4.5,
    "restaurant_id": 1,
    "updated_at": "2026-11-24T14:27:05"
  },
  {
    "category": "North Indian Curries",
    "category_id": 5,
    "created_at": "2026-11-24T14:27:05",
  ... (+237 lines truncated for brevity)
    "updated_at": "2026-11-24T14:27:05"
  }
]
`

---

## Food Categories

- **Endpoint:** /api/categories
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
[
  {
    "category_id": 1,
    "created_at": "2026-11-24T14:27:05",
    "description": "Aromatic dum-cooked basmati rice",
    "display_order": 1,
    "icon": "bowl-rice",
    "image_url": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400&q=80",
    "name": "Biryani",
    "slug": "biryani"
  },
  {
    "category_id": 2,
    "created_at": "2026-11-24T14:27:05",
    "description": "Cheesy handcrafted pizzas and flatbreads",
    "display_order": 2,
    "icon": "pizza-slice",
    "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
    "name": "Pizza",
    "slug": "pizza"
  },
  {
    "category_id": 3,
    "created_at": "2026-11-24T14:27:05",
    "description": "Juicy grilled and crispy burgers",
    "display_order": 3,
    "icon": "burger",
    "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
    "name": "Burger",
    "slug": "burger"
  },
  {
    "category_id": 4,
    "created_at": "2026-11-24T14:27:05",
    "description": "Steamed momos, chilli noodles & wok items",
  ... (+47 lines truncated for brevity)
    "slug": "beverages"
  }
]
`

---

## Culinary Cuisines

- **Endpoint:** /api/cuisines
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
[
  {
    "created_at": "2026-11-24T14:27:05",
    "cuisine_id": 1,
    "description": "Rich, aromatic curries, breads and tandoori grills",
    "image_url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80",
    "name": "North Indian",
    "slug": "north-indian"
  },
  {
    "created_at": "2026-11-24T14:27:05",
    "cuisine_id": 2,
    "description": "Wood-fired pizzas, handmade pastas and risottos",
    "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80",
    "name": "Italian",
    "slug": "italian"
  },
  {
    "created_at": "2026-11-24T14:27:05",
    "cuisine_id": 3,
    "description": "Wok-tossed noodles, dim sums, and spicy chilli garlic delights",
    "image_url": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80",
    "name": "Chinese & Asian",
    "slug": "chinese-asian"
  },
  {
    "created_at": "2026-11-24T14:27:05",
    "cuisine_id": 4,
    "description": "Crispy burgers, peri-peri fries, wraps, and quick snacks",
    "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
    "name": "Fast Food",
    "slug": "fast-food"
  },
  {
    "created_at": "2026-11-24T14:27:05",
  ... (+15 lines truncated for brevity)
    "slug": "bakery-desserts"
  }
]
`

---

## User Registration Endpoint Info

- **Endpoint:** /api/register
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "endpoint": "/api/register",
  "example": {
    "email": "harsh@example.com",
    "name": "Harsh Sharma",
    "password": "Password123!",
    "phone": "+91 98765 43210"
  },
  "message": "CraveSpot User Registration API. Submit a POST request with JSON payload to create an account.",
  "method": "POST",
  "optional_fields": [
    "phone"
  ],
  "required_fields": [
    "name",
    "email",
    "password"
  ],
  "success": true
}
`

---

## User Login Endpoint Info

- **Endpoint:** /api/login
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "endpoint": "/api/login",
  "example": {
    "email": "user@example.com",
    "password": "Password123!"
  },
  "message": "CraveSpot User Authentication API. Submit a POST request with JSON payload to log in and receive an auth token.",
  "method": "POST",
  "required_fields": [
    "email",
    "password"
  ],
  "success": true
}
`

---

## User Session Profile

- **Endpoint:** /api/auth/me
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "success": true,
  "user": {
    "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "bio": "Food explorer & street food enthusiast in Chandigarh",
    "city": "Chandigarh",
    "default_radius": 10,
    "email": "demo@cravespot.com",
    "name": "Harsh Garg",
    "phone": "+91 9876543210",
    "role": "user",
    "user_id": 1
  }
}
`

---

## User Profile Information

- **Endpoint:** /api/user/profile
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "success": true,
  "user": {
    "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "bio": "Food explorer & street food enthusiast in Chandigarh",
    "city": "Chandigarh",
    "default_radius": 10,
    "email": "demo@cravespot.com",
    "name": "Harsh Garg",
    "phone": "+91 9876543210",
    "role": "user",
    "user_id": 1
  }
}
`

---

## User Saved Favorites

- **Endpoint:** /api/user/favorites
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "favorites": [],
  "success": true
}
`

---

## User Dietary Preferences

- **Endpoint:** /api/user/preferences
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "preferences": {
    "budget_tier": "moderate",
    "created_at": "2026-11-24T14:27:05",
    "dietary": "all",
    "favorite_tags": "pizza,biryani,momos,paneer,spicy",
    "pref_id": 1,
    "spice_level": "medium",
    "updated_at": "2026-11-24T14:27:05",
    "user_id": 1
  },
  "success": true
}
`

---

## User Search History

- **Endpoint:** /api/user/history
- **HTTP Method:** GET
- **Status:** HTTP 200 OK

`json
{
  "history": [],
  "success": true
}
`

---

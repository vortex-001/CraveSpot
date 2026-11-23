/* =========================================
   RESTAURANTS PAGE - DATABASE VERSION
   MySQL → Flask API → Frontend
========================================= */

const API_BASE = (typeof CRAVESPOT_API_BASE !== "undefined")
    ? CRAVESPOT_API_BASE
    : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000/api"
        : "/api");

let restaurants = [];
// Get the currently selected city
function getSelectedCity() {
    return localStorage.getItem("CraveSpotLocation") || "Chandigarh";
}

// Tricity metropolitan agglomeration: places in Chandigarh, Mohali, Panchkula are adjacent
const TRICITY_AREAS = ["chandigarh", "mohali", "panchkula", "zirakpur", "kharar", "sas nagar", "tricity", "punjab", "haryana"];

// Check whether a restaurant belongs to or is near the selected city
function matchesSelectedCity(restaurant) {
    const selectedCity = getSelectedCity().toLowerCase().trim();
    const address = String(restaurant.address || "").toLowerCase();

    // Keep restaurants without an address visible
    if (!address.trim()) {
        return true;
    }

    // Direct address match
    if (address.includes(selectedCity) || selectedCity.includes(address)) {
        return true;
    }

    // Tricity metro cluster: if user selected Mohali / Chandigarh / Panchkula / Kharar
    const isUserInTricity = TRICITY_AREAS.some(c => selectedCity.includes(c));
    const isRestaurantInTricity = TRICITY_AREAS.some(c => address.includes(c));
    if (isUserInTricity && isRestaurantInTricity) {
        return true;
    }

    // Distance proximity check: within 45 km
    if (typeof restaurant.distance_km === "number" && restaurant.distance_km <= 45) {
        return true;
    }

    return false;
}
const sampleRestaurants = [
    {
        restaurant_id: 1,
        name: "Spice Garden",
        cuisine: "North Indian & Mughlai",
        rating: 4.5,
        address: "Sector 17, Chandigarh", latitude: 30.7415, longitude: 76.7680,
        is_veg: true,
        offer: "20% OFF"
    },
    {
        restaurant_id: 2,
        name: "Pizza Corner",
        cuisine: "Italian & Wood-fired Pizza",
        rating: 4.3,
        address: "Sector 22, Chandigarh", latitude: 30.7336, longitude: 76.7725,
        is_veg: true,
        offer: "30% OFF"
    },
    {
        restaurant_id: 3,
        name: "Wok Express",
        cuisine: "Chinese & Asian Bowls",
        rating: 4.2,
        address: "Sector 35, Chandigarh", latitude: 30.7253, longitude: 76.7642,
        is_veg: false,
        offer: ""
    },
    {
        restaurant_id: 4,
        name: "Burger House",
        cuisine: "Fast Food & Shakes",
        rating: 4.1,
        address: "Sector 8, Chandigarh", latitude: 30.7358, longitude: 76.8010,
        is_veg: false,
        offer: "10% OFF"
    },
    {
        restaurant_id: 5,
        name: "Sweet Cravings",
        cuisine: "Desserts & Cakes",
        rating: 4.7,
        address: "Sector 10, Chandigarh", latitude: 30.7500, longitude: 76.7820,
        is_veg: true,
        offer: ""
    },
    {
        restaurant_id: 6,
        name: "Katani Dhaba",
        cuisine: "North Indian & Punjabi Thali",
        rating: 4.5,
        address: "Phase 3B2, Mohali", latitude: 30.7071, longitude: 76.7161,
        is_veg: true,
        offer: "15% OFF"
    },
    {
        restaurant_id: 7,
        name: "Amrit Sweets & Restaurant",
        cuisine: "Desserts & Authentic Snacks",
        rating: 4.6,
        address: "Phase 5, Mohali", latitude: 30.7188, longitude: 76.7123,
        is_veg: true,
        offer: "20% OFF"
    },
    {
        restaurant_id: 8,
        name: "Barbeque Nation",
        cuisine: "BBQ & Multi-Cuisine Buffet",
        rating: 4.5,
        address: "Sector 5, Panchkula", latitude: 30.6931, longitude: 76.8524,
        is_veg: false,
        offer: "Flat ₹150 OFF"
    },
    {
        restaurant_id: 9,
        name: "Urban Cafe & Bistro",
        cuisine: "Cafe & Continental",
        rating: 4.4,
        address: "Sector 70, Mohali", latitude: 30.6990, longitude: 76.7080,
        is_veg: false,
        offer: "10% OFF"
    },
    {
        restaurant_id: 10,
        name: "Grand Punjab Dhaba",
        cuisine: "North Indian & Punjabi Parathas",
        rating: 4.5,
        address: "Chandigarh-Kharar Highway, Kharar", latitude: 30.7485, longitude: 76.6430,
        is_veg: true,
        offer: "20% OFF"
    },
    {
        restaurant_id: 11,
        name: "Kharar Food Hub & Cafe",
        cuisine: "Fast Food & Pizza",
        rating: 4.3,
        address: "Sunny Enclave, Kharar", latitude: 30.7420, longitude: 76.6580,
        is_veg: false,
        offer: "15% OFF"
    },
    {
        restaurant_id: 12,
        name: "Rolls Mania & Fast Bites",
        cuisine: "Rolls & Street Bites",
        rating: 4.4,
        address: "Khanpur Chowk, Kharar", latitude: 30.7550, longitude: 76.6380,
        is_veg: false,
        offer: "Flat ₹50 OFF"
    },
    {
        restaurant_id: 13,
        name: "Amritsari Kulcha Junction",
        cuisine: "North Indian & Crispy Kulchas",
        rating: 4.6,
        address: "Landran Road, Kharar", latitude: 30.7390, longitude: 76.6500,
        is_veg: true,
        offer: "10% OFF"
    }
];
let menuItems = [];
let activeFilter = "all";
let activeDistanceRadius = "all";

const restaurantGrid = document.getElementById("restaurantGrid");
const searchInput = document.getElementById("restaurantSearch");
const resultCount = document.getElementById("resultCount");
const resultTitle = document.getElementById("resultTitle");
const noResults = document.getElementById("noResults");
const sortSelect = document.getElementById("sortRestaurants");

// Delivery / Dining Out mode switching
const modeButtons = document.querySelectorAll(".mode-btn");

modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedMode = button.dataset.mode;

        // Update the active button
        modeButtons.forEach(btn => {
            btn.classList.toggle("active", btn === button);
        });

        // Update the page heading
        if (resultTitle) {
            resultTitle.textContent =
                selectedMode === "dining"
                    ? "Restaurants for Dining Out"
                    : "Restaurants Available for Delivery";
        }

        // Reapply existing search and filters
        filterRestaurants();
    });
});



let nearbyActive = false;
let userCoordinates = null;
function distanceKm(a, b) { const R = 6371, rad = x => x * Math.PI / 180, dLat = rad(b.latitude - a.latitude), dLon = rad(b.longitude - a.longitude), lat1 = rad(a.latitude), lat2 = rad(b.latitude); const q = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2; return 2 * R * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q)); }
function enableNearby() { const status = document.getElementById("nearbyStatus"), button = document.getElementById("nearbyRestaurantsBtn"); if (!navigator.geolocation) { if (status) status.textContent = "Location is not supported; showing your selected city."; return; } if (status) status.textContent = "Getting your location…"; button.disabled = true; navigator.geolocation.getCurrentPosition(pos => { userCoordinates = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }; nearbyActive = true; if (status) status.textContent = "Nearby restaurants sorted by distance where coordinates are available."; button.textContent = "Nearby ✓"; button.disabled = false; if (sortSelect) sortSelect.value = "distance"; filterRestaurants(); }, err => { nearbyActive = false; if (status) status.textContent = err.code === 1 ? "Location permission denied. Choose a city above." : "Could not get location. Choose a city above."; button.disabled = false; filterRestaurants(); }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }); }
const nearbyBtn = document.getElementById("nearbyRestaurantsBtn"); if (nearbyBtn) nearbyBtn.addEventListener("click", () => { if (nearbyActive) { nearbyActive = false; userCoordinates = null; nearbyBtn.textContent = "Nearby"; const st = document.getElementById("nearbyStatus"); if (st) st.textContent = ""; filterRestaurants(); } else enableNearby(); });

/* =========================================
   LOAD DATA FROM FLASK & LIVE GPS DISCOVERY
========================================= */

async function loadRestaurants() {
    const loc = (typeof getUserLocation === "function")
        ? getUserLocation()
        : { lat: 30.7333, lng: 76.7794, city: "Chandigarh" };

    // 1. Instant Render: immediately display base restaurants with real distance tags
    // so the user is NEVER stuck on "Loading live restaurants..."
    if (!restaurants || restaurants.length === 0) {
        restaurants = sampleRestaurants.map(r => {
            const item = { ...r };
            if (typeof item.distance_km !== "number" && item.latitude && item.longitude) {
                item.distance_km = distanceKm(
                    { latitude: loc.lat, longitude: loc.lng },
                    { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }
                );
            }
            return item;
        });
        renderRestaurants();
    }

    // 2. Fetch fresh live GPS & Database restaurants in the background (tight 1500ms timeout)
    try {
        let fetched = [];
        try {
            const liveRes = await apiRequest(`/restaurants/live-nearby?lat=${loc.lat}&lng=${loc.lng}&radius=15`, { timeout: 1500 });
            if (liveRes?.restaurants && liveRes.restaurants.length > 0) {
                fetched = liveRes.restaurants;
            }
        } catch (e) {
            // Live nearby query fallback
        }

        if (!fetched.length) {
            try {
                const allRest = await apiRequest("/restaurants", { timeout: 1200 });
                if (Array.isArray(allRest) && allRest.length > 0) {
                    fetched = allRest;
                }
            } catch (err) {
                // Keep rendered baseline
            }
        }

        // If fresh data received, update restaurants and re-render
        if (fetched && fetched.length > 0) {
            restaurants = fetched.map(r => {
                const item = { ...r };
                if (typeof item.distance_km !== "number" && item.latitude && item.longitude) {
                    item.distance_km = distanceKm(
                        { latitude: loc.lat, longitude: loc.lng },
                        { latitude: parseFloat(item.latitude), longitude: parseFloat(item.longitude) }
                    );
                }
                return item;
            });
            renderRestaurants();
        }

        // Load menu items in background
        try {
            menuItems = await apiRequest("/menu-items", { timeout: 1500 });
        } catch (error) {
            menuItems = [];
        }

    } catch (error) {
        if (!restaurants || restaurants.length === 0) {
            restaurants = sampleRestaurants;
            renderRestaurants();
        }
    }
}

// Reload restaurants whenever user changes location on the map or GPS
window.addEventListener("cravespot:locationChanged", () => {
    loadRestaurants();
});


/* =========================================
   GET AVERAGE MENU PRICE
========================================= */

function getAveragePrice(restaurantId) {

    const items = menuItems.filter(
        item => Number(item.restaurant_id) === Number(restaurantId)
    );

    if (items.length === 0) {
        return null;
    }

    const total = items.reduce(
        (sum, item) => sum + Number(item.price),
        0
    );

    return Math.round(total / items.length);
}


/* =========================================
   RESTAURANT REAL FOOD & VENDOR IMAGES
========================================= */

function getRestaurantImage(restaurantOrIndex, fallbackIndex = 0) {
    let restaurant = {};
    let index = 0;
    if (typeof restaurantOrIndex === 'object' && restaurantOrIndex !== null) {
        restaurant = restaurantOrIndex;
        index = fallbackIndex;
    } else if (typeof restaurantOrIndex === 'number') {
        index = restaurantOrIndex;
    }

    if (restaurant.image_url && String(restaurant.image_url).startsWith('http')) {
        return restaurant.image_url;
    }
    if (restaurant.cover_image && String(restaurant.cover_image).startsWith('http')) {
        return restaurant.cover_image;
    }

    const name = (restaurant.name || '').toLowerCase();
    const cuisine = (restaurant.cuisine || '').toLowerCase();
    const spotType = (restaurant.spot_type || '').toLowerCase();

    // 1. Specific authentic vendor & food matching
    if (name.includes('kulcha')) {
        return 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('golgapp') || name.includes('chaat')) {
        return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('roll') || name.includes('shawarma')) {
        return 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('tea') || name.includes('chai')) {
        return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('momo')) {
        return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('maggi') || name.includes('stuc')) {
        return 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('burger') || name.includes('hub')) {
        return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('pizza') || cuisine.includes('pizza')) {
        return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('barbeque') || name.includes('bbq') || cuisine.includes('bbq')) {
        return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('sweet') || name.includes('bakery') || spotType === 'bakery_sweets') {
        return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('cafe') || name.includes('bistro') || spotType === 'cafe_tea') {
        return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('dhaba') || name.includes('punjab') || name.includes('katani') || spotType === 'dhaba') {
        return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('wok') || name.includes('chinese') || cuisine.includes('chinese') || cuisine.includes('asian')) {
        return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80';
    }
    if (name.includes('biryani') || cuisine.includes('biryani')) {
        return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80';
    }
    if (cuisine.includes('north indian') || cuisine.includes('mughlai') || cuisine.includes('tadka')) {
        return 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80';
    }

    // 2. Spot-type and street food fallbacks
    if (spotType === 'street_food') {
        const streetImgs = [
            'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80'
        ];
        return streetImgs[index % streetImgs.length];
    }

    // 3. High quality multi-cuisine real photography
    const curatedList = [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80'
    ];
    return curatedList[index % curatedList.length];
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getRestaurantFavorites() {
    try { return JSON.parse(localStorage.getItem("CraveSpot_favorite_restaurants") || "[]").map(String); }
    catch { return []; }
}
function isRestaurantFavorite(id) { return getRestaurantFavorites().includes(String(id)); }

/* =========================================
   DISPLAY RESTAURANTS
========================================= */

function renderRestaurants() {

    restaurantGrid.innerHTML = "";

    if (restaurants.length === 0) {

        noResults.style.display = "block";

        if (resultCount) {
            resultCount.textContent = "0 restaurants found";
        }

        return;
    }


    restaurants.forEach((restaurant, index) => {

        const averagePrice =
            getAveragePrice(restaurant.restaurant_id);


        const card = document.createElement("article");

        card.className = "food-card";


        /* DATABASE ID */

        card.dataset.id =
            restaurant.restaurant_id;
        card.dataset.originalOrder = String(index);


        card.dataset.name =
            (restaurant.name || "").toLowerCase();


        card.dataset.cuisine =
            (restaurant.cuisine || "").toLowerCase();


        card.dataset.rating =
            restaurant.rating || 0;


        card.dataset.price =
            averagePrice || 0;
        card.dataset.veg = String(
            restaurant.is_veg === true ||
            restaurant.is_veg === 1 ||
            restaurant.is_veg === "true" ||
            restaurant.is_veg === "1"
        );

        card.dataset.latitude = restaurant.latitude ?? restaurant.lat ?? "";
        card.dataset.longitude = restaurant.longitude ?? restaurant.lng ?? restaurant.lon ?? "";
        card.dataset.spotType = restaurant.spot_type || "";
        card.dataset.offer = String(
            Boolean(
                restaurant.offer &&
                String(restaurant.offer).trim()
            )
        );

        const spotBadge = restaurant.spot_badge || (
            restaurant.spot_type === 'street_food' ? '🍢 Street Food' :
            restaurant.spot_type === 'dhaba' ? '🍲 Dhaba' :
            restaurant.spot_type === 'cafe_tea' ? '☕ Chai Tapri' :
            restaurant.cuisine && restaurant.cuisine.toLowerCase().includes('dhaba') ? '🍲 Dhaba' :
            restaurant.cuisine && (restaurant.cuisine.toLowerCase().includes('street') || restaurant.cuisine.toLowerCase().includes('chaat')) ? '🍢 Street Food' :
            'Restaurant'
        );

        card.innerHTML = `

            <div class="food-image-container">

                <img
                    src="${getRestaurantImage(restaurant, index)}"
                    alt="${escapeHtml(restaurant.name)}"
                    class="food-image"
                >

                <button
                    class="favorite-btn ${isRestaurantFavorite(restaurant.restaurant_id) ? "is-favorite" : ""}"
                    type="button"
                    aria-label="${isRestaurantFavorite(restaurant.restaurant_id) ? "Remove from favorites" : "Add to favorites"}"
                    aria-pressed="${isRestaurantFavorite(restaurant.restaurant_id)}"
                >
                    <svg class="favorite-icon"
     viewBox="0 0 24 24"
     fill="none"
     xmlns="http://www.w3.org/2000/svg"
     aria-hidden="true">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"/>
</svg>
                </button>

                <span class="offer-badge">
                    ${escapeHtml(spotBadge)}
                </span>

            </div>


            <div class="food-card-content">

                <div class="food-card-title">

                    <h3>
                        ${escapeHtml(restaurant.name)}
                    </h3>

                    <span class="rating">

                        ${restaurant.rating
                ? Number(restaurant.rating).toFixed(1)
                : "N/A"
            } ★

                    </span>

                </div>


                <p class="cuisine">

                    ${escapeHtml(
                restaurant.cuisine || "Restaurant"
            )}

                </p>

                <div class="restaurant-meta" style="margin: 6px 0 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="loc-distance-pill">📍 ${typeof restaurant.distance_km === 'number' ? (restaurant.distance_km < 1 ? Math.round(restaurant.distance_km * 1000) + ' m' : restaurant.distance_km.toFixed(1) + ' km') : 'Nearby'}</span>
                    <span class="delivery-time-pill">⚡ ~${restaurant.delivery_time_mins || 25} mins</span>
                </div>


                <p class="price">

                    ${averagePrice
                ? "₹" + averagePrice + " avg. menu price"
                : "View menu"
            }

                </p>


                <p class="location">

                    <svg class="real-location-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg> ${escapeHtml(
                restaurant.address || "Chandigarh"
            )}

                </p>


                <div class="food-card-footer">

                    <span class="delivery">
                        🍴 Menu available
                    </span>

                    <span class="arrow">
                        →
                    </span>

                </div>

            </div>
        `;


        restaurantGrid.appendChild(card);

    });


    attachCardEvents();

    filterRestaurants();
}


/* =========================================
   CARD CLICK
========================================= */

function attachCardEvents() {

    const cards =
        document.querySelectorAll(".food-card");


    cards.forEach(card => {

        /* RESTAURANT CLICK */

        card.addEventListener("click", function (event) {

            // Don't open restaurant when favorite button clicked
            if (
                event.target.closest(".favorite-btn")
            ) {
                return;
            }


            const restaurantId =
                card.dataset.id;


            if (!restaurantId) {
                return;
            }


            window.location.href =
                `restaurant-details.html?id=${restaurantId}`;

        });


        /* FAVORITE BUTTON */

        const favoriteButton =
            card.querySelector(".favorite-btn");


        if (favoriteButton) {

            favoriteButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    const id = String(card.dataset.id);
                    const favorites = getRestaurantFavorites();
                    const saved = favorites.includes(id);
                    const updated = saved ? favorites.filter(item => item !== id) : [...favorites, id];
                    localStorage.setItem("CraveSpot_favorite_restaurants", JSON.stringify(updated));
                    this.classList.toggle("is-favorite", !saved);
                    this.setAttribute("aria-pressed", String(!saved));
                    this.setAttribute("aria-label", !saved ? "Remove from favorites" : "Add to favorites");

                }
            );
        }

    });
}


/* =========================================
   SEARCH
========================================= */


function filterRestaurants() {
    const query = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const ratingFilter = document.getElementById("ratingFilter");
    const vegFilter = document.getElementById("vegFilter");
    const offersFilter = document.getElementById("offersFilter");

    const cards = document.querySelectorAll(".food-card");
    let visibleCount = 0;

    cards.forEach(card => {
        const name = (card.dataset.name || "").toLowerCase();
        const cuisine = (card.dataset.cuisine || "").toLowerCase();
        const rating = Number(card.dataset.rating || 0);
        const isVeg = card.dataset.veg === "true";
        const hasOffer = card.dataset.offer === "true";

        const cravingKeywords = {
            "cheesy": ["chees", "pizza", "burger", "fast food", "italian", "fries", "pasta", "paneer"],
            "spicy": ["spic", "punjabi", "dhaba", "north indian", "chinese", "biryani", "tikka", "curry"],
            "sweet": ["dessert", "bakery", "sweet", "cake", "shake", "ice cream", "waffle", "halwa", "pastry"],
            "crispy": ["burger", "fast food", "street food", "dosa", "fries", "kulcha", "naan", "golgapp", "momo"],
            "comfort": ["dhaba", "north indian", "punjabi", "thali", "dal", "curry", "roti", "chai"],
            "refreshing": ["shake", "cafe", "beverage", "tea", "coffee", "juice", "soda"],
            "late-night": ["dhaba", "fast food", "burger", "pizza", "street food", "maggi"],
            "affordable": ["dhaba", "street food", "roll", "chaat", "tea", "fast food"]
        };
        const queryCravingMatches = cravingKeywords[query] || [];
        const matchesCraving = queryCravingMatches.some(kw => name.includes(kw) || cuisine.includes(kw));

        const matchesSearch = !query ||
            name.includes(query) || cuisine.includes(query) || (card.querySelector(".location")?.textContent || "").toLowerCase().includes(query) || matchesCraving;

        const matchesRating =
            !ratingFilter || !ratingFilter.checked || rating >= 4.0;

        const matchesVeg =
            !vegFilter || !vegFilter.checked || isVeg;

        const matchesOffers =
            !offersFilter || !offersFilter.checked || hasOffer;

        let matchesFilter = true;

        if (activeFilter === "rating") {
            matchesFilter = rating >= 4.0;
        } else if (activeFilter === "offers") {
            matchesFilter = hasOffer;
        } else if (activeFilter === "veg") {
            matchesFilter = isVeg;
        } else if (activeFilter === "fast") {
            matchesFilter = cuisine.includes("fast");
        } else if (activeFilter === "street") {
            matchesFilter = card.dataset.spotType === "street_food" || cuisine.includes("street") || cuisine.includes("chaat") || cuisine.includes("roll") || cuisine.includes("snack") || cuisine.includes("golgapp") || cuisine.includes("momo") || name.includes("chaat") || name.includes("corner");
        } else if (activeFilter === "dhaba") {
            matchesFilter = card.dataset.spotType === "dhaba" || cuisine.includes("dhaba") || cuisine.includes("kulcha") || cuisine.includes("thali") || cuisine.includes("paratha") || name.includes("dhaba") || name.includes("kulcha");
        }

        const restaurant = restaurants.find(
            item => (card.dataset.id && String(item.restaurant_id) === String(card.dataset.id)) ||
                    (card.dataset.name && (item.name || "").toLowerCase().trim() === (card.dataset.name || "").toLowerCase().trim())
        );

        const hasCoordinates = Boolean(card.dataset.latitude && card.dataset.longitude && card.dataset.latitude !== "" && card.dataset.longitude !== "");
        const matchesCity = nearbyActive && hasCoordinates
            ? true
            : (restaurant ? matchesSelectedCity(restaurant) : (card.querySelector(".location") ? matchesSelectedCity({ address: card.querySelector(".location").textContent }) : true));

        // Compute distance from user location or GPS coordinates
        const curLoc = (typeof getUserLocation === "function") ? getUserLocation() : { lat: 30.7333, lng: 76.7794 };
        const userPoint = userCoordinates || { latitude: curLoc.lat, longitude: curLoc.lng };
        const cardLat = Number(card.dataset.latitude);
        const cardLon = Number(card.dataset.longitude);
        if (Number.isFinite(cardLat) && Number.isFinite(cardLon) && cardLat && cardLon) {
            card.dataset.distance = distanceKm(userPoint, { latitude: cardLat, longitude: cardLon }).toFixed(1);
        } else if (!card.dataset.distance) {
            card.dataset.distance = "";
        }

        let matchesDistance = true;
        if (activeDistanceRadius !== "all") {
            const maxRadius = Number(activeDistanceRadius);
            matchesDistance = card.dataset.distance !== "" && Number(card.dataset.distance) <= maxRadius;
        }

        let nearbyMatch = true;
        const isVisible =
            nearbyMatch &&
            matchesCity &&
            matchesDistance &&
            matchesSearch &&
            matchesRating &&
            matchesVeg &&
            matchesOffers &&
            matchesFilter;

        card.style.display = isVisible ? "" : "none";
        const distanceBadge = card.querySelector(".nearby-distance");
        if (distanceBadge) distanceBadge.remove();
        if (isVisible && card.dataset.distance !== "") {
            const badge = document.createElement("small");
            badge.className = "nearby-distance";
            badge.textContent = `${card.dataset.distance} km away`;
            card.querySelector(".food-card-content")?.appendChild(badge);
        }

        if (isVisible) {
            visibleCount++;
        }
    });

    // Auto-broadening: If selected city has no direct string matches,
    // show nearby restaurants with proximity note so user NEVER gets an empty screen
    if (visibleCount === 0 && !query && activeFilter === "all" && cards.length > 0) {
        cards.forEach(c => {
            c.style.display = "";
            visibleCount++;
        });
        if (resultTitle) {
            resultTitle.textContent = `Restaurants Delivering Near ${getSelectedCity()}`;
        }
        if (resultCount) {
            resultCount.textContent = `Showing all ${visibleCount} top-rated spots delivering to your area`;
        }
        if (noResults) {
            noResults.style.display = "none";
        }
    } else {
        if (resultCount) {
            resultCount.textContent = `${visibleCount} restaurants found`;
        }
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? "block" : "none";
            const message = noResults.querySelector("p");
            if (message && query) {
                message.textContent = `No results found for "${query}". Try searching another dish or cuisine.`;
            } else if (message) {
                message.textContent = "Try clearing your filters to explore all delicious spots.";
            }
        }
    }

    if (sortSelect && sortSelect.value === "distance") {
        const ordered = [...cards].sort((a, b) => {
            const da = a.dataset.distance === "" ? Infinity : Number(a.dataset.distance);
            const db = b.dataset.distance === "" ? Infinity : Number(b.dataset.distance);
            return da - db;
        });
        ordered.forEach(card => restaurantGrid.appendChild(card));
    }

    // Hook up empty state reset button
    const emptyResetBtn = document.getElementById("emptyResetFiltersBtn");
    if (emptyResetBtn && !emptyResetBtn.dataset.bound) {
        emptyResetBtn.dataset.bound = "true";
        emptyResetBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            activeFilter = "all";
            const filterBtns = document.querySelectorAll(".filter-btn, .mode-btn");
            filterBtns.forEach(b => b.classList.remove("active"));
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) allBtn.classList.add("active");
            cards.forEach(c => c.style.display = "");
            if (resultCount) resultCount.textContent = `${cards.length} restaurants found`;
            if (noResults) noResults.style.display = "none";
        });
    }
}





/* =========================================
   SEARCH INPUT + HOMEPAGE SEARCH
========================================= */

// Read the search query or craving passed from the homepage.
const urlParams = new URLSearchParams(window.location.search);
const initialSearch = urlParams.get("search") || urlParams.get("craving") || urlParams.get("q");

// Fill the restaurant search box with the query.
if (searchInput && initialSearch) {
    searchInput.value = initialSearch;
    if (urlParams.get("craving")) {
        const titleEl = document.getElementById("resultTitle");
        if (titleEl) {
            titleEl.innerHTML = `Craving Discovery: <span style="color:#FF5200">"${escapeHtml(urlParams.get("craving"))}"</span>`;
        }
    }
}

// Apply search whenever the user types.
if (searchInput) {
    searchInput.addEventListener("input", filterRestaurants);
}




/* =========================================
   SORT
========================================= */

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        function () {

            const cards =
                Array.from(
                    document.querySelectorAll(
                        ".food-card"
                    )
                );


            if (this.value === "distance") {
                cards.sort((a, b) => { const da = a.dataset.distance === "" ? Infinity : Number(a.dataset.distance), db = b.dataset.distance === "" ? Infinity : Number(b.dataset.distance); return da - db; });
            }

            if (this.value === "recommended") {
                cards.sort((a, b) => Number(a.dataset.originalOrder || 0) - Number(b.dataset.originalOrder || 0));
            }

            if (this.value === "rating") {

                cards.sort(
                    (a, b) =>
                        Number(
                            b.dataset.rating
                        ) -
                        Number(
                            a.dataset.rating
                        )
                );
            }


            if (this.value === "price-low") {

                cards.sort(
                    (a, b) =>
                        Number(
                            a.dataset.price
                        ) -
                        Number(
                            b.dataset.price
                        )
                );
            }


            if (this.value === "price-high") {

                cards.sort(
                    (a, b) =>
                        Number(
                            b.dataset.price
                        ) -
                        Number(
                            a.dataset.price
                        )
                );
            }


            cards.forEach(card => {

                restaurantGrid.appendChild(card);

            });

        }
    );
}




/* =========================================
   FILTER BUTTONS
========================================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            this.classList.add("active");


            activeFilter =
                this.dataset.filter || "all";


            filterRestaurants();

        }
    );

});


/* =========================================
   START
========================================= */

loadRestaurants();
// Open and close the filter panel
const filterButton = document.querySelector(
    '.filter-btn[data-filter="all"]'
);
const filterPanel = document.getElementById("filterPanel");

if (filterButton && filterPanel) {
    filterButton.addEventListener("click", function () {
        const isHidden = filterPanel.style.display === "none";
        filterPanel.style.display = isHidden ? "block" : "none";
    });
}


// Apply selected filters
document.getElementById("applyFilters")?.addEventListener("click", function () {
    filterRestaurants();

    if (filterPanel) {
        filterPanel.style.display = "none";
    }
});


// Clear selected filters
document.getElementById("clearFilters")?.addEventListener("click", function () {
    document.getElementById("ratingFilter").checked = false;
    document.getElementById("vegFilter").checked = false;
    document.getElementById("offersFilter").checked = false;


    activeFilter = "all";
    filterButtons.forEach(button => button.classList.toggle("active", button.dataset.filter === "all"));
    filterRestaurants();
});
// Refresh restaurant visibility when the selected city changes
document.addEventListener("cravespot:locationChanged", function () {
    filterRestaurants();
});

// Distance range filter ribbon handling
function initDistanceRibbon() {
    const distPills = document.querySelectorAll("#restaurantDistanceRibbon .dist-pill-btn");
    distPills.forEach(btn => {
        btn.addEventListener("click", () => {
            distPills.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeDistanceRadius = btn.dataset.radius || "all";

            const summary = document.getElementById("activeDistanceSummary");
            if (summary) {
                summary.textContent = activeDistanceRadius === "all"
                    ? "Showing all nearby"
                    : `Within ${activeDistanceRadius} km`;
            }

            filterRestaurants();
        });
    });
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDistanceRibbon);
} else {
    initDistanceRibbon();
}

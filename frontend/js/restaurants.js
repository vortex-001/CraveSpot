/* =========================================
   RESTAURANTS PAGE - DATABASE VERSION
   MySQL → Flask API → Frontend
========================================= */

const API_BASE = "http://127.0.0.1:5000/api";

let restaurants = [];
// Get the currently selected city
function getSelectedCity() {
    return localStorage.getItem("CraveSpotLocation") || "Chandigarh";
}

// Check whether a restaurant belongs to the selected city
function matchesSelectedCity(restaurant) {
    const selectedCity = getSelectedCity().toLowerCase();

    const address = String(restaurant.address || "").toLowerCase();

    // Keep restaurants without an address visible
    if (!address.trim()) {
        return true;
    }

    return address.includes(selectedCity);
}
const sampleRestaurants = [
    {
        restaurant_id: 1,
        name: "Spice Garden",
        cuisine: "North Indian",
        rating: 4.5,
        address: "Sector 17, Chandigarh", latitude: 30.7415, longitude: 76.7680,
        is_veg: true,
        offer: "20% OFF"
    },
    {
        restaurant_id: 2,
        name: "Pizza Corner",
        cuisine: "Italian",
        rating: 4.3,
        address: "Sector 22, Chandigarh", latitude: 30.7336, longitude: 76.7725,
        is_veg: true,
        offer: "30% OFF"
    },
    {
        restaurant_id: 3,
        name: "Wok Express",
        cuisine: "Chinese",
        rating: 4.2,
        address: "Sector 35, Chandigarh", latitude: 30.7253, longitude: 76.7642,
        is_veg: false,
        offer: ""
    },
    {
        restaurant_id: 4,
        name: "Burger House",
        cuisine: "Fast Food",
        rating: 4.1,
        address: "Sector 8, Chandigarh", latitude: 30.7358, longitude: 76.8010,
        is_veg: false,
        offer: "10% OFF"
    },
    {
        restaurant_id: 5,
        name: "Sweet Cravings",
        cuisine: "Desserts",
        rating: 4.7,
        address: "Sector 10, Chandigarh", latitude: 30.7500, longitude: 76.7820,
        is_veg: true,
        offer: ""
    }
];
let menuItems = [];
let activeFilter = "all";

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
function distanceKm(a,b){const R=6371,rad=x=>x*Math.PI/180,dLat=rad(b.latitude-a.latitude),dLon=rad(b.longitude-a.longitude),lat1=rad(a.latitude),lat2=rad(b.latitude);const q=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;return 2*R*Math.atan2(Math.sqrt(q),Math.sqrt(1-q));}
function enableNearby(){const status=document.getElementById("nearbyStatus"),button=document.getElementById("nearbyRestaurantsBtn");if(!navigator.geolocation){if(status)status.textContent="Location is not supported; showing your selected city.";return;}if(status)status.textContent="Getting your location…";button.disabled=true;navigator.geolocation.getCurrentPosition(pos=>{userCoordinates={latitude:pos.coords.latitude,longitude:pos.coords.longitude};nearbyActive=true;if(status)status.textContent="Nearby restaurants sorted by distance where coordinates are available.";button.textContent="Nearby ✓";button.disabled=false;if(sortSelect)sortSelect.value="distance";filterRestaurants();},err=>{nearbyActive=false;if(status)status.textContent=err.code===1?"Location permission denied. Choose a city above.":"Could not get location. Choose a city above.";button.disabled=false;filterRestaurants();},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});}
const nearbyBtn=document.getElementById("nearbyRestaurantsBtn");if(nearbyBtn)nearbyBtn.addEventListener("click",()=>{if(nearbyActive){nearbyActive=false;userCoordinates=null;nearbyBtn.textContent="Nearby";const st=document.getElementById("nearbyStatus");if(st)st.textContent="";filterRestaurants();}else enableNearby();});

/* =========================================
   LOAD DATA FROM FLASK & LIVE GPS DISCOVERY
========================================= */

async function loadRestaurants() {
    try {
        restaurantGrid.innerHTML = "<p>Loading live restaurants...</p>";

        const loc = (typeof getUserLocation === "function") 
            ? getUserLocation() 
            : { lat: 30.7333, lng: 76.7794, city: "Chandigarh" };

        let fetched = [];
        try {
            const liveRes = await apiRequest(`/restaurants/live-nearby?lat=${loc.lat}&lng=${loc.lng}&radius=35`);
            if (liveRes?.restaurants && liveRes.restaurants.length > 0) {
                fetched = liveRes.restaurants;
            }
        } catch (e) {
            console.warn("Live nearby query failed; trying /restaurants fallback:", e);
        }

        if (!fetched.length) {
            fetched = await apiRequest("/restaurants");
        }

        // Compute distance for all items if not already computed
        restaurants = (Array.isArray(fetched) ? fetched : []).map(r => {
            if (typeof r.distance_km !== "number" && r.latitude && r.longitude) {
                r.distance_km = distanceKm(
                    { latitude: loc.lat, longitude: loc.lng },
                    { latitude: parseFloat(r.latitude), longitude: parseFloat(r.longitude) }
                );
            }
            return r;
        });

        // Load menu items too
        try {
            menuItems = await apiRequest("/menu-items");
        } catch (error) {
            console.log("Menu data could not be loaded.");
            menuItems = [];
        }

        renderRestaurants();

    } catch (error) {
        console.error("Could not load restaurants from API:", error);

        // Keep the frontend usable when the backend is unavailable
        restaurants = sampleRestaurants;
        menuItems = [];

        renderRestaurants();
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
   RESTAURANT IMAGES
========================================= */

function getRestaurantImage(index) {

    const images = [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9"
    ];

    return images[index % images.length];
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
card.dataset.offer = String(
    Boolean(
        restaurant.offer &&
        String(restaurant.offer).trim()
    )
);




        card.innerHTML = `

            <div class="food-image-container">

                <img
                    src="${getRestaurantImage(index)}"
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
                    Restaurant
                </span>

            </div>


            <div class="food-card-content">

                <div class="food-card-title">

                    <h3>
                        ${escapeHtml(restaurant.name)}
                    </h3>

                    <span class="rating">

                        ${
                            restaurant.rating
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

                    ${
                        averagePrice
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

        card.addEventListener("click", function(event) {

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
                function(event) {

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

        const matchesSearch =
            name.includes(query) || cuisine.includes(query) || (card.querySelector(".location")?.textContent || "").toLowerCase().includes(query);

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
        }

        const restaurant = restaurants.find(
    item => String(item.restaurant_id) === String(card.dataset.id)
);

const hasCoordinates = card.dataset.latitude !== "" && card.dataset.longitude !== "";
const matchesCity = nearbyActive && hasCoordinates
    ? true
    : (restaurant ? matchesSelectedCity(restaurant) : false);

let nearbyMatch = true;
if(nearbyActive && userCoordinates){const lat=Number(card.dataset.latitude),lon=Number(card.dataset.longitude);if(Number.isFinite(lat)&&Number.isFinite(lon)&&lat&&lon){card.dataset.distance=distanceKm(userCoordinates,{latitude:lat,longitude:lon}).toFixed(1);}else{card.dataset.distance="";nearbyMatch=true;}}
const isVisible =
    nearbyMatch &&
    matchesCity &&
    matchesSearch &&
    matchesRating &&
    matchesVeg &&
    matchesOffers &&
    matchesFilter;

        card.style.display = isVisible ? "" : "none";
        const distanceBadge=card.querySelector(".nearby-distance");if(distanceBadge)distanceBadge.remove();if(isVisible&&nearbyActive&&card.dataset.distance!==""){const badge=document.createElement("small");badge.className="nearby-distance";badge.textContent=card.dataset.distance+" km away";card.querySelector(".food-card-content")?.appendChild(badge);}

        if (isVisible) {
            visibleCount++;
        }
    });

    if(nearbyActive && sortSelect && sortSelect.value === "distance"){const ordered=[...cards].sort((a,b)=>{const da=a.dataset.distance===""?Infinity:Number(a.dataset.distance),db=b.dataset.distance===""?Infinity:Number(b.dataset.distance);return da-db;});ordered.forEach(card=>restaurantGrid.appendChild(card));}

    if (resultCount) {
        resultCount.textContent = `${visibleCount} restaurants found`;
    }

    if (noResults) {
        noResults.style.display = visibleCount === 0 ? "block" : "none";
        const message = noResults.querySelector("p");
        if (message && !query && activeFilter === "all") {
            message.textContent = `No restaurants are listed for ${getSelectedCity()} yet. Try another city or search.`;
        } else if (message) {
            message.textContent = "Try another restaurant, cuisine or filter.";
        }
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
        function() {

            const cards =
                Array.from(
                    document.querySelectorAll(
                        ".food-card"
                    )
                );


            if (this.value === "distance") {
                cards.sort((a,b)=>{const da=a.dataset.distance===""?Infinity:Number(a.dataset.distance),db=b.dataset.distance===""?Infinity:Number(b.dataset.distance);return da-db;});
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
        function() {

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
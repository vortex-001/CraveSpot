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
        address: "Sector 17, Chandigarh",
        is_veg: true,
        offer: "20% OFF"
    },
    {
        restaurant_id: 2,
        name: "Pizza Corner",
        cuisine: "Italian",
        rating: 4.3,
        address: "Sector 22, Chandigarh",
        is_veg: true,
        offer: "30% OFF"
    },
    {
        restaurant_id: 3,
        name: "Wok Express",
        cuisine: "Chinese",
        rating: 4.2,
        address: "Sector 35, Chandigarh",
        is_veg: false,
        offer: ""
    },
    {
        restaurant_id: 4,
        name: "Burger House",
        cuisine: "Fast Food",
        rating: 4.1,
        address: "Sector 8, Chandigarh",
        is_veg: false,
        offer: "10% OFF"
    },
    {
        restaurant_id: 5,
        name: "Sweet Cravings",
        cuisine: "Desserts",
        rating: 4.7,
        address: "Sector 10, Chandigarh",
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



/* =========================================
   LOAD DATA FROM FLASK
========================================= */

async function loadRestaurants() {
    try {
        restaurantGrid.innerHTML = "<p>Loading restaurants...</p>";

        // Load restaurants using the shared API helper
        restaurants = await apiRequest("/restaurants");

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
                    class="favorite-btn"
                    type="button"
                    aria-label="Add to favorites"
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


                  if (!this.classList.contains("is-favorite")) {

    this.classList.add("is-favorite");

    this.style.color = "#e23744";

} else {

    this.classList.remove("is-favorite");

    this.style.color = "#222";
}

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
            name.includes(query) || cuisine.includes(query);

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

const matchesCity = restaurant
    ? matchesSelectedCity(restaurant)
    : false;

const isVisible =
    matchesCity &&
    matchesSearch &&
    matchesRating &&
    matchesVeg &&
    matchesOffers &&
    matchesFilter;

        card.style.display = isVisible ? "" : "none";

        if (isVisible) {
            visibleCount++;
        }
    });

    if (resultCount) {
        resultCount.textContent = `${visibleCount} restaurants found`;
    }

    if (noResults) {
        noResults.style.display =
            visibleCount === 0 ? "block" : "none";
    }
}





/* =========================================
   SEARCH INPUT + HOMEPAGE SEARCH
========================================= */

// Read the search query passed from the homepage.
const urlParams = new URLSearchParams(window.location.search);
const initialSearch = urlParams.get("search");

// Fill the restaurant search box with the query.
if (searchInput && initialSearch) {
    searchInput.value = initialSearch;
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
filterRestaurants();
});
// Refresh restaurant visibility when the selected city changes
document.addEventListener("cravespot:locationChanged", function () {
    filterRestaurants();
});
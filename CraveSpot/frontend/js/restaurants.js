/* =========================================
   RESTAURANTS PAGE - DATABASE VERSION
   MySQL → Flask API → Frontend
========================================= */

const API_BASE = "http://127.0.0.1:5000/api";

let restaurants = [];
let menuItems = [];
let activeFilter = "all";

const restaurantGrid = document.getElementById("restaurantGrid");
const searchInput = document.getElementById("restaurantSearch");
const resultCount = document.getElementById("resultCount");
const resultTitle = document.getElementById("resultTitle");
const noResults = document.getElementById("noResults");
const sortSelect = document.getElementById("sortRestaurants");


/* =========================================
   LOAD DATA FROM FLASK
========================================= */

async function loadRestaurants() {
    try {
        restaurantGrid.innerHTML = "<p>Loading restaurants...</p>";

        const restaurantResponse =
            await fetch(`${API_BASE}/restaurants`);

        if (!restaurantResponse.ok) {
            throw new Error("Restaurant API failed");
        }

        restaurants = await restaurantResponse.json();

        // Load menu items too
        try {
            const menuResponse =
                await fetch(`${API_BASE}/menu-items`);

            if (menuResponse.ok) {
                menuItems = await menuResponse.json();
            }
        } catch (error) {
            console.log("Menu data could not be loaded.");
        }

        renderRestaurants();

    } catch (error) {

        console.error(error);

        restaurantGrid.innerHTML = `
            <p style="padding:20px;">
                Unable to load restaurants.
                Please make sure Flask is running on port 5000.
            </p>
        `;
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
                    ♡
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

                    📍 ${escapeHtml(
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


                    if (
                        this.textContent.trim() === "♡"
                    ) {

                        this.textContent = "♥";

                        this.style.color =
                            "#e23744";

                    } else {

                        this.textContent = "♡";

                        this.style.color =
                            "#222";
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

    const query =
        searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";


    const cards =
        document.querySelectorAll(".food-card");


    let visibleCount = 0;


    cards.forEach(card => {

        const name =
            card.dataset.name || "";


        const cuisine =
            card.dataset.cuisine || "";


        const rating =
            Number(card.dataset.rating || 0);


        const matchesSearch =
            name.includes(query) ||
            cuisine.includes(query);


        let matchesFilter = true;


        if (activeFilter === "rating") {

            matchesFilter =
                rating >= 4.0;
        }


        if (
            matchesSearch &&
            matchesFilter
        ) {

            card.style.display = "block";

            visibleCount++;

        } else {

            card.style.display = "none";
        }

    });


    if (resultCount) {

        resultCount.textContent =
            `${visibleCount} restaurants found`;
    }


    if (noResults) {

        noResults.style.display =
            visibleCount === 0
            ? "block"
            : "none";
    }
}


/* =========================================
   SEARCH INPUT
========================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterRestaurants
    );
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
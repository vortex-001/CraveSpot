/* ==========================================
   CraveSpot
   RESTAURANT DETAILS
   MySQL -> Flask -> Website
========================================== */

const API_BASE = "http://127.0.0.1:5000/api";

let currentRestaurant = null;
let selectedRating = 0;


/* ==========================================
   GET RESTAURANT FROM URL
========================================== */

const params = new URLSearchParams(window.location.search);

const restaurantId = params.get("id");
const vendor = params.get("vendor");


/* ==========================================
   LOAD RESTAURANTS FROM MYSQL
========================================== */

async function loadRestaurant() {

    try {

        const response = await fetch(
            `${API_BASE}/restaurants`
        );

        if (!response.ok) {
            throw new Error("Restaurant API failed");
        }

        const restaurants = await response.json();

        /*
           First try restaurant ID.
           Example:
           restaurant-details.html?id=4
        */

        if (restaurantId) {

            currentRestaurant = restaurants.find(
                r => String(r.restaurant_id) === String(restaurantId)
            );

        }


        /*
           Also support vendor name.
           Example:
           restaurant-details.html?vendor=Swagath%20Restaurant%20And%20Bar
        */

        if (!currentRestaurant && vendor) {

            currentRestaurant = restaurants.find(
                r =>
                    r.name.toLowerCase() ===
                    vendor.toLowerCase()
            );

        }


        if (!currentRestaurant) {

            document.getElementById("restaurantName").textContent =
                "Restaurant not found";

            return;

        }


        displayRestaurant();

        await loadMenu();

        loadReviews();

        loadRatingSummary();

    }

    catch (error) {

        console.error(error);

        const name =
            document.getElementById("restaurantName");

        if (name) {

            name.textContent =
                "Unable to load restaurant";

        }

        console.error(
            "Make sure Flask is running on port 5000."
        );

    }

}


/* ==========================================
   DISPLAY RESTAURANT INFORMATION
========================================== */

function displayRestaurant() {

    const r = currentRestaurant;


    document.getElementById("restaurantName").textContent =
        r.name;


    document.getElementById("restaurantCuisine").textContent =
        r.cuisine || "Restaurant";


    document.getElementById("restaurantLocation").textContent =
        "📍 " + (r.address || "Chandigarh");


    document.getElementById("restaurantRating").textContent =
        r.rating || "N/A";


    /*
       Your database currently doesn't have
       price/time/offer columns.
    */

    document.getElementById("restaurantPrice").textContent =
        "See menu";


    document.getElementById("restaurantTime").textContent =
        "—";


    document.getElementById("restaurantOffer").textContent =
        "Available";


    /*
       Overview section
    */

    const overviewText =
        document.getElementById("overviewText");

    if (overviewText) {

        overviewText.textContent =
            `${r.name} is located at ${r.address}.`;

    }


    const overviewCuisine =
        document.getElementById("overviewCuisine");

    if (overviewCuisine) {

        overviewCuisine.textContent =
            r.cuisine || "Restaurant";

    }


    const overviewLocation =
        document.getElementById("overviewLocation");

    if (overviewLocation) {

        overviewLocation.textContent =
            r.address || "Chandigarh";

    }


    const overviewPrice =
        document.getElementById("overviewPrice");

    if (overviewPrice) {

        overviewPrice.textContent =
            "Prices shown in menu";

    }


    const overviewTime =
        document.getElementById("overviewTime");

    if (overviewTime) {

        overviewTime.textContent =
            "Check restaurant for delivery time";

    }

}


/* ==========================================
   LOAD MENU FROM MYSQL
========================================== */

async function loadMenu() {

    const menuGrid =
        document.getElementById("menuGrid");


    if (!menuGrid) {
        return;
    }


    menuGrid.innerHTML = `
        <p>Loading menu...</p>
    `;


    try {

        const response = await fetch(
            `${API_BASE}/restaurants/${currentRestaurant.restaurant_id}/menu`
        );


        if (!response.ok) {

            throw new Error("Menu API failed");

        }


        const dishes = await response.json();


        menuGrid.innerHTML = "";


        if (dishes.length === 0) {

            menuGrid.innerHTML = `
                <p>No menu items available.</p>
            `;

            return;

        }


        dishes.forEach(dish => {

            const card =
                document.createElement("div");

            card.className = "menu-card";


            const image =
                dish.image_url ||
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836";


            card.innerHTML = `

                <img
                    src="${image}"
                    alt="${dish.name}"
                    class="menu-image"
                >

                <div class="menu-info">

                    <h3>
                        ${dish.name}
                    </h3>

                    <p>
                        ${dish.category || ""}
                    </p>

                    <p>
                        ${dish.description || ""}
                    </p>

                    <p class="menu-price">
                        ₹${Number(dish.price).toFixed(2)}
                    </p>

                </div>

                <button
                    class="dish-favorite"
                    onclick="toggleDishFavorite(this)"
                >
                    ♡
                </button>

            `;


            menuGrid.appendChild(card);

        });


        const dishCount =
            document.getElementById("dishCount");


        if (dishCount) {

            dishCount.textContent =
                dishes.length + " dishes";

        }

    }

    catch (error) {

        console.error(error);

        menuGrid.innerHTML = `
            <p>
                Unable to load menu.
                Make sure Flask is running.
            </p>
        `;

    }

}


/* ==========================================
   TABS
========================================== */

function showSection(section, button) {

    const menu =
        document.getElementById("menuSection");

    const overview =
        document.getElementById("overviewSection");

    const reviews =
        document.getElementById("reviewsSection");


    if (menu) {
        menu.classList.add("hidden");
    }

    if (overview) {
        overview.classList.add("hidden");
    }

    if (reviews) {
        reviews.classList.add("hidden");
    }


    if (section === "menu" && menu) {

        menu.classList.remove("hidden");

    }


    if (section === "overview" && overview) {

        overview.classList.remove("hidden");

    }


    if (section === "reviews" && reviews) {

        reviews.classList.remove("hidden");

    }


    document
        .querySelectorAll(".tab-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }

}


/* ==========================================
   RESTAURANT FAVORITE
========================================== */

function toggleFavorite() {

    const button =
        document.getElementById("favoriteBtn");


    if (!button) {
        return;
    }


    button.classList.toggle("saved");


    button.textContent =
        button.classList.contains("saved")
            ? "♥"
            : "♡";

}


/* ==========================================
   DISH FAVORITE
========================================== */

function toggleDishFavorite(button) {

    button.classList.toggle("saved");


    button.textContent =
        button.classList.contains("saved")
            ? "♥"
            : "♡";

}


/* ==========================================
   SEARCH
========================================== */

function searchRestaurant() {

    const input =
        document.getElementById("searchInput");


    if (!input) {
        return;
    }


    const query =
        input.value.trim();


    if (query === "") {
        return;
    }


    window.location.href =
        "restaurants.html?search=" +
        encodeURIComponent(query);

}


/* ==========================================
   REVIEWS
   Reviews are currently stored in browser
   localStorage because there is no reviews
   table in your MySQL database yet.
========================================== */

function getReviewKey() {

    if (!currentRestaurant) {

        return "CraveSpot_reviews_unknown";

    }

    return (
        "CraveSpot_reviews_" +
        currentRestaurant.restaurant_id
    );

}


function getStoredReviews() {

    const data =
        localStorage.getItem(
            getReviewKey()
        );


    if (!data) {
        return [];
    }


    try {

        return JSON.parse(data);

    }

    catch {

        return [];

    }

}


function saveStoredReview(review) {

    const reviews =
        getStoredReviews();


    reviews.push(review);


    localStorage.setItem(
        getReviewKey(),
        JSON.stringify(reviews)
    );

}


/* ==========================================
   OPEN REVIEW FORM
========================================== */

function openReviewForm() {

    const form =
        document.getElementById("reviewForm");


    if (form) {

        form.style.display = "block";

        form.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* ==========================================
   CLOSE REVIEW FORM
========================================== */

function closeReviewForm() {

    const form =
        document.getElementById("reviewForm");


    if (form) {

        form.style.display = "none";

    }


    selectedRating = 0;


    document
        .querySelectorAll("#starRating button")
        .forEach(button => {

            button.classList.remove("selected");

        });

}


/* ==========================================
   SELECT RATING
========================================== */

function selectRating(rating) {

    selectedRating = rating;


    document
        .querySelectorAll("#starRating button")
        .forEach((star, index) => {

            if (index < rating) {

                star.classList.add("selected");

            }

            else {

                star.classList.remove("selected");

            }

        });

}


/* ==========================================
   SUBMIT REVIEW
========================================== */

function submitReview() {

    const nameInput =
        document.getElementById("reviewerName");

    const textInput =
        document.getElementById("reviewText");


    if (!nameInput || !textInput) {
        return;
    }


    const name =
        nameInput.value.trim();


    const text =
        textInput.value.trim();


    if (name === "") {

        alert("Please enter your name.");

        return;

    }


    if (selectedRating === 0) {

        alert("Please select a rating.");

        return;

    }


    if (text === "") {

        alert("Please write your review.");

        return;

    }


    const review = {

        name: name,

        rating: selectedRating,

        text: text,

        date:
            new Date().toLocaleDateString()

    };


    saveStoredReview(review);


    alert(
        "Your review has been added!"
    );


    nameInput.value = "";

    textInput.value = "";


    closeReviewForm();

    loadReviews();

    loadRatingSummary();

}


/* ==========================================
   DISPLAY REVIEWS
========================================== */

function loadReviews() {

    const container =
        document.getElementById(
            "reviewsContainer"
        );


    if (!container || !currentRestaurant) {
        return;
    }


    const reviews =
        getStoredReviews();


    container.innerHTML = "";


    if (reviews.length === 0) {

        container.innerHTML = `
            <div class="review-card">
                <p>No reviews yet.</p>
            </div>
        `;

        return;

    }


    reviews.forEach(review => {

        const stars =
            "★".repeat(
                Number(review.rating)
            ) +
            "☆".repeat(
                5 - Number(review.rating)
            );


        const card =
            document.createElement("div");


        card.className =
            "review-card";


        card.innerHTML = `

            <div class="review-top">

                <span class="reviewer-name">
                    ${review.name}
                </span>

                <span class="review-date">
                    ${review.date}
                </span>

            </div>

            <div class="review-stars">
                ${stars}
            </div>

            <p class="review-text">
                ${review.text}
            </p>

        `;


        container.appendChild(card);

    });

}


/* ==========================================
   RATING SUMMARY
========================================== */

function loadRatingSummary() {

    if (!currentRestaurant) {
        return;
    }


    const reviews =
        getStoredReviews();


    const overall =
        document.getElementById(
            "overallRating"
        );


    /*
       If there are no user reviews,
       show the rating from MySQL.
    */

    if (reviews.length === 0) {

        if (overall) {

            overall.textContent =
                Number(
                    currentRestaurant.rating || 0
                ).toFixed(1);

        }

        return;

    }


    let total = 0;


    const counts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };


    reviews.forEach(review => {

        const rating =
            Number(review.rating);


        total += rating;


        if (counts[rating] !== undefined) {

            counts[rating]++;

        }

    });


    const average =
        total / reviews.length;


    if (overall) {

        overall.textContent =
            average.toFixed(1);

    }


    for (let rating = 1; rating <= 5; rating++) {

        const fill =
            document.getElementById(
                "rating" + rating
            );


        const count =
            document.getElementById(
                "rating" + rating + "Count"
            );


        const percentage =
            (counts[rating] /
                reviews.length) * 100;


        if (fill) {

            fill.style.width =
                percentage + "%";

        }


        if (count) {

            count.textContent =
                counts[rating];

        }

    }

}


/* ==========================================
   START
========================================== */

loadRestaurant();
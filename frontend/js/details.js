/* ==========================================
   CraveSpot
   RESTAURANT DETAILS
   MySQL -> Flask -> Website
========================================== */

const API_BASE = "http://127.0.0.1:5000/api";

let currentRestaurant = null;
const sampleRestaurant = {
    restaurant_id: 1,
    name: "Spice Garden",
    cuisine: "North Indian Ã¢â‚¬Â¢ Mughlai Ã¢â‚¬Â¢ Biryani",
    address: "Chandigarh",
    rating: 4.5
};
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
        const restaurants = await apiRequest("/restaurants");

        if (!Array.isArray(restaurants)) {
            throw new Error("Invalid restaurant data");
        }

        if (restaurantId) {
            currentRestaurant = restaurants.find(
                r => String(r.restaurant_id) === String(restaurantId)
            );
        }

        if (!currentRestaurant && vendor) {
            currentRestaurant = restaurants.find(
                r => (r.name || "").toLowerCase() === vendor.toLowerCase()
            );
        }

        if (!currentRestaurant) {
            currentRestaurant = sampleRestaurant;
        }

    } catch (error) {
        console.warn("Using sample restaurant data:", error);
        currentRestaurant = sampleRestaurant;
    }

    displayRestaurant();
    await loadMenu();
    loadReviews();
    loadRatingSummary();
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
       (r.address || "Chandigarh");


    document.getElementById("restaurantRating").textContent =
        r.rating || "N/A";


    /*
       Your database currently doesn't have
       price/time/offer columns.
    */

    document.getElementById("restaurantPrice").textContent =
        "See menu";


    document.getElementById("restaurantTime").textContent =
        "Ã¢â‚¬â€";


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
    const menuGrid = document.getElementById("menuGrid");
    const dishCount = document.getElementById("dishCount");

    if (!menuGrid) return;

    menuGrid.innerHTML = "<p>Loading menu...</p>";

    // Sample dishes for frontend testing
    const sampleDishes = [
        {
            name: "Paneer Butter Masala",
            category: "North Indian",
            description: "Creamy tomato gravy with soft paneer.",
            price: 249,
            image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7"
        },
        {
            name: "Veg Biryani",
            category: "Rice",
            description: "Fragrant basmati rice with aromatic spices.",
            price: 199,
            image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0"
        },
        {
            name: "Margherita Pizza",
            category: "Italian",
            description: "Classic pizza with cheese and tomato.",
            price: 229,
            image_url: "https://images.unsplash.com/photo-1579751626657-72bc17010498"
        },
        {
            name: "Crispy Veg Burger",
            category: "Fast Food",
            description: "A crispy vegetable patty with fresh toppings.",
            price: 149,
            image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
        },
        {
            name: "Chocolate Brownie",
            category: "Desserts",
            description: "A rich chocolate treat.",
            price: 99,
            image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c"
        },
        {
            name: "Masala Dosa",
            category: "South Indian",
            description: "Crispy dosa served with potato filling.",
            price: 129,
            image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976"
        }
    ];

    let dishes = [];

   try {
    dishes = await apiRequest(
        `/restaurants/${currentRestaurant.restaurant_id}/menu`
    );

    // Use sample dishes if the backend returns an empty menu
    if (!Array.isArray(dishes) || dishes.length === 0) {
        dishes = sampleDishes;
    }
} catch (error) {
    console.warn("Using sample menu data:", error);
    dishes = sampleDishes;
}

    menuGrid.innerHTML = "";

    dishes.forEach(dish => {
        const card = document.createElement("div");
        card.className = "menu-card";

        const image = dish.image_url ||
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836";

        const imageElement = document.createElement("img");
        imageElement.src = image;
        imageElement.alt = dish.name || "Food dish";
        imageElement.className = "menu-image";

        const info = document.createElement("div");
        info.className = "menu-info";

        const name = document.createElement("h3");
        name.textContent = dish.name || "Food Item";

        const category = document.createElement("p");
        category.textContent = dish.category || "";

        const description = document.createElement("p");
        description.textContent = dish.description || "";

        const price = document.createElement("p");
        price.className = "menu-price";
        price.textContent = "\u20B9" + Number(dish.price || 0).toFixed(2);

        info.append(name, category, description, price);

        const favorite = document.createElement("button");
        favorite.className = "dish-favorite";
        favorite.type = "button";
       favorite.innerHTML = `
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
`;
favorite.setAttribute("aria-label", "Add to favorites");
        favorite.addEventListener("click", function () {
            toggleDishFavorite(this);
        });

        card.append(imageElement, info, favorite);
        card.style.cursor = "pointer";
        card.addEventListener("click", function (event) {
            if (event.target.closest("button")) return;
            const dishSlug = (dish.name || "")
                .toLowerCase().trim()
                .replace(/&/g, "and")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            if (dishSlug) {
                window.location.href = `dish-details.html?dish=${encodeURIComponent(dishSlug)}&name=${encodeURIComponent(dish.name || "")}&category=${encodeURIComponent(dish.category || "")}&description=${encodeURIComponent(dish.description || "")}&price=${encodeURIComponent(dish.price || 0)}&image=${encodeURIComponent(dish.image_url || "")}&restaurantId=${encodeURIComponent(currentRestaurant.restaurant_id || "")}`;
            }
        });
        menuGrid.appendChild(card);
    });

    if (dishCount) {
        dishCount.textContent = `${dishes.length} dishes`;
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
    document.getElementById("reviews");

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
    const button = document.getElementById("favoriteBtn");

    if (!button) {
        return;
    }

    button.classList.toggle("saved");

    button.setAttribute(
        "aria-label",
        button.classList.contains("saved")
            ? "Remove from favorites"
            : "Add to favorites"
    );
}


/* ==========================================
   DISH FAVORITE
========================================== */

function toggleDishFavorite(button) {
    if (!button) {
        button = document.getElementById("dishFavoriteBtn");
    }

    if (!button) {
        return;
    }

    button.classList.toggle("saved");

    button.setAttribute(
        "aria-label",
        button.classList.contains("saved")
            ? "Remove from favorites"
            : "Add to favorites"
    );
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
            "Ã¢Ëœâ€¦".repeat(
                Number(review.rating)
            ) +
            "Ã¢Ëœâ€ ".repeat(
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

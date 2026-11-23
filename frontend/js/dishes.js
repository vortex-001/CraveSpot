/* =========================================
   DISHES PAGE JAVASCRIPT
========================================= */


const dishSearch =
    document.getElementById("dishSearch");

const heroDishSearch =
    document.getElementById("heroDishSearch");

const dishCards =
    document.querySelectorAll(".dish-card");

const dishNoResults =
    document.getElementById("dishNoResults");

const dishResultCount =
    document.getElementById("dishResultCount");

const dishResultTitle =
    document.getElementById("dishResultTitle");

const dishSort =
    document.getElementById("dishSort");


let selectedCategory = "all";

let selectedFilter = "all";

let selectedCraving = "all";

let selectedRestaurant = "all";



/* =========================================
   FILTER DISHES
========================================= */

function filterDishes() {

    const query =
        dishSearch.value.toLowerCase().trim();


    let visibleCount = 0;


    dishCards.forEach(card => {
        card.dataset.originalOrder = card.dataset.originalOrder || String(Array.from(dishCards).indexOf(card));
        const name =
            card.dataset.name.toLowerCase();

        const category =
            card.dataset.category.toLowerCase();

        const price =
            Number(card.dataset.price);

        const rating =
            Number(card.dataset.rating);

        const veg =
            card.dataset.veg === "true";


        const matchesSearch =
            name.includes(query) ||
            category.includes(query);


        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;


        let matchesFilter = true;


        if (selectedFilter === "veg") {

            matchesFilter = veg;

        }


        if (selectedFilter === "under200") {

            matchesFilter = price < 200;

        }


        if (selectedFilter === "rating") {

            matchesFilter = rating >= 4;

        }


        

        const cravingAttr = (card.dataset.craving || "").toLowerCase();
        let matchesCraving = true;
        if (selectedCraving === "spicy") {
            matchesCraving = cravingAttr.includes("spicy") || name.includes("chilli") || name.includes("biryani") || name.includes("tikka") || name.includes("curry") || name.includes("spic");
        } else if (selectedCraving === "cheesy") {
            matchesCraving = cravingAttr.includes("cheesy") || name.includes("cheese") || name.includes("pizza") || name.includes("fries") || name.includes("paneer") || category.includes("pizza") || category.includes("burger");
        } else if (selectedCraving === "crispy") {
            matchesCraving = cravingAttr.includes("crispy") || name.includes("burger") || name.includes("fries") || name.includes("crisp") || name.includes("kulcha") || name.includes("naan") || name.includes("crunch") || name.includes("waffle") || name.includes("dosa") || name.includes("golgappe");
        } else if (selectedCraving === "comfort") {
            matchesCraving = cravingAttr.includes("comfort") || name.includes("dal") || name.includes("butter") || name.includes("noodles") || name.includes("momos") || name.includes("kulcha") || name.includes("naan") || name.includes("halwa") || name.includes("phirni") || name.includes("tukda");
        } else if (selectedCraving === "sweet") {
            matchesCraving = cravingAttr.includes("sweet") || category.includes("dessert") || name.includes("brownie") || name.includes("jamun") || name.includes("sweet") || name.includes("halwa") || name.includes("waffle") || name.includes("phirni") || name.includes("tukda") || name.includes("cake") || name.includes("pastry") || name.includes("cheesecake") || name.includes("shake") || name.includes("jalebi") || name.includes("rasgulla") || name.includes("rasmalai");
        } else if (selectedCraving === "budget") {
            matchesCraving = cravingAttr.includes("budget") || price <= 160;
        }

        const restaurantName = (card.dataset.restaurant || card.querySelector(".dish-price-row span")?.textContent || "").toLowerCase();
        let matchesRestaurant = true;
        if (selectedRestaurant !== "all") {
            matchesRestaurant = restaurantName.includes(selectedRestaurant);
        }

        const advancedPrice = maxDishPrice.value.trim();
        const maxPrice = advancedPrice === "" ? Infinity : Number(advancedPrice);
        const minRating = Number(minDishRating.value);

        const matchesAdvanced =
            (!advancedVeg.checked || veg) &&
            price <= maxPrice &&
            rating >= minRating;

        if (
            matchesSearch &&
            matchesCategory &&
            matchesFilter &&
            matchesAdvanced &&
            matchesCraving &&
            matchesRestaurant
        ) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }

    }); // Closes dishCards.forEach()

    dishResultCount.textContent = visibleCount + " dishes found";

    if (visibleCount === 0) {
        dishNoResults.style.display = "block";
    } else {
        dishNoResults.style.display = "none";
    }

    if (selectedCraving !== "all") {
        const cravingTitles = {
            spicy: "Spicy & Fiery Cravings",
            cheesy: "Cheesy & Melty Cravings",
            crispy: "Crispy & Crunchy Cravings",
            comfort: "Warm & Soulful Comfort Cravings",
            sweet: "Sweet Tooth Delights",
            budget: "Pocket-Friendly Bites (< ₹150)"
        };
        dishResultTitle.textContent = cravingTitles[selectedCraving] || "Craving Discovery";
    } else if (selectedRestaurant !== "all") {
        dishResultTitle.textContent = `Dishes from ${selectedRestaurant.toUpperCase()}`;
    } else if (selectedCategory === "all") {
        dishResultTitle.textContent = "Popular dishes";
    } else {
        dishResultTitle.textContent =
            selectedCategory.charAt(0).toUpperCase() +
            selectedCategory.slice(1) +
            " dishes";
    }

} // Closes filterDishes()
/* =========================================
   SEARCH
========================================= */

function updateDishSearch(value) {

    dishSearch.value = value;

    heroDishSearch.value = value;

    filterDishes();

}

function handleDishSearch(value) {
    const query = value.toLowerCase().trim();

    dishSearch.value = value;
    heroDishSearch.value = value;

    const categoryAliases = {
        "all": "all",
        "street food": "street food",
        "street-food": "street food",
        "fast food": "burger",
        "popular": "all",
        "burger": "burger",
        "burgers": "burger",
        "chinese": "chinese",
        "north indian": "north indian",
        "dessert": "dessert",
        "desserts": "dessert",
        "biryani": "biryani",
        "pizza": "pizza"
    };

    if (query === "") {
        selectedCategory = "all";
    } else if (Object.prototype.hasOwnProperty.call(categoryAliases, query)) {
        selectedCategory = categoryAliases[query];
    } else {
        const matchingDish = Array.from(dishCards).find(card =>
            (card.dataset.name || "").toLowerCase().trim() === query
        ) || Array.from(dishCards).find(card =>
            (card.dataset.name || "").toLowerCase().trim().includes(query)
        );

        selectedCategory = matchingDish
            ? matchingDish.dataset.category.toLowerCase().trim()
            : "all";
    }

    categoryButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category.toLowerCase().trim() === selectedCategory
        );
    });

    filterDishes();
}

dishSearch.addEventListener("input", function() {
    handleDishSearch(this.value);
});

heroDishSearch.addEventListener("input", function() {
    handleDishSearch(this.value);
});
/* =========================================
   CATEGORY BUTTONS
========================================= */

const categoryButtons =
    document.querySelectorAll(
        ".dish-category"
    );


categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            categoryButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            this.classList.add("active");
selectedCategory = this.dataset.category.toLowerCase().trim();

            filterDishes();

        }
    );

});



/* =========================================
   FILTER BUTTONS
========================================= */

const filterToggle = document.getElementById("filterToggle");

const filterButtons = document.querySelectorAll(
    '.dish-filter[data-filter]'
);

filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        filterButtons.forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");
        selectedFilter = this.dataset.filter;

        filterDishes();
    });
});


/* =========================================
   SORT DISHES
========================================= */

dishSort.addEventListener(
    "change",
    function() {

        const grid =
            document.getElementById(
                "dishGrid"
            );


        const cards =
            Array.from(
                document.querySelectorAll(
                    ".dish-card"
                )
            );


        if (this.value === "recommended") {
            cards.sort((a, b) => Number(a.dataset.originalOrder || 0) - Number(b.dataset.originalOrder || 0));
        }

        if (
            this.value ===
            "price-low"
        ) {

            cards.sort(
                (a, b) =>
                    Number(a.dataset.price) -
                    Number(b.dataset.price)
            );

        }


        if (
            this.value ===
            "price-high"
        ) {

            cards.sort(
                (a, b) =>
                    Number(b.dataset.price) -
                    Number(a.dataset.price)
            );

        }


        if (
            this.value ===
            "rating"
        ) {

            cards.sort(
                (a, b) =>
                    Number(b.dataset.rating) -
                    Number(a.dataset.rating)
            );

        }


        cards.forEach(card => {

            grid.appendChild(card);

        });

    }
);



/* =========================================
   FAVORITES
========================================= */

const hearts =
    document.querySelectorAll(
        ".dish-heart"
    );

const savedDishFavorites = (() => { try { return JSON.parse(localStorage.getItem("CraveSpot_favorite_dishes") || "[]"); } catch { return []; } })();
hearts.forEach(heart => {
    const card = heart.closest(".dish-card");
    const favoriteName = card?.dataset.name || card?.querySelector("h3")?.textContent.trim();
    if (savedDishFavorites.includes(favoriteName)) heart.classList.add("is-favorite");
    heart.setAttribute("aria-pressed", String(heart.classList.contains("is-favorite")));
    heart.addEventListener("click", function(event) {
        event.stopPropagation();

        const id = this.dataset.dishId || this.closest(".dish-card")?.dataset.name || this.closest(".quick-dish-card")?.querySelector("h3")?.textContent.trim();
        const favorites = JSON.parse(localStorage.getItem("CraveSpot_favorite_dishes") || "[]");
        const saved = favorites.includes(id);
        const next = saved ? favorites.filter(item => item !== id) : [...favorites, id];
        localStorage.setItem("CraveSpot_favorite_dishes", JSON.stringify(next));
        this.classList.toggle("is-favorite", !saved);
        this.setAttribute("aria-pressed", String(!saved));
    });
});
/* ==========================================
   STEP 9D: CONNECT DISH CARDS
========================================== */




dishCards.forEach(card => {

    card.addEventListener("click", function(event) {

        /*
         * Don't open details when clicking
         * the favorite button.
         */

        if (
            event.target.closest(".favorite-btn") ||
            event.target.closest("button")
        ) {
            return;
        }


        /* Get dish name */

        const dishName =
            card.dataset.name;


        if (!dishName) {
            return;
        }


        /* Create URL-friendly slug */

        const dishSlug =
            dishName
                .toLowerCase()
                .trim()
                .replace(/&/g, "and")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

        const dishImg = card.querySelector(".dish-image img")?.src || "";
        const dishCat = card.dataset.category || "";
        const dishPrice = card.dataset.price || "";

        /* Open dish details with full metadata and image */

        window.location.href =
            "dish-details.html?dish=" +
            encodeURIComponent(dishSlug) +
            "&name=" + encodeURIComponent(dishName) +
            "&category=" + encodeURIComponent(dishCat) +
            "&price=" + encodeURIComponent(dishPrice) +
            "&image=" + encodeURIComponent(dishImg);

    });

});
/* ADVANCED DISH FILTERS */

const advancedPanel = document.getElementById("advancedFilterPanel");
const advancedVeg = document.getElementById("advancedVeg");
const maxDishPrice = document.getElementById("maxDishPrice");
const minDishRating = document.getElementById("minDishRating");

filterToggle.addEventListener("click", function () {
    advancedPanel.hidden = !advancedPanel.hidden;

    this.textContent = advancedPanel.hidden
        ? "☰ Filters"
        : "✕ Close Filters";
});

document.getElementById("applyAdvancedFilters").addEventListener("click", function () {
    filterDishes();
});

document.getElementById("resetAdvancedFilters").addEventListener("click", function () {
    advancedVeg.checked = false;
    maxDishPrice.value = "";
    minDishRating.value = "0";

    selectedFilter = "all";
    filterButtons.forEach(btn => btn.classList.remove("active"));

    const allButton = document.querySelector(
        '.dish-filter[data-filter="all"]'
    );

    if (allButton) {
        allButton.classList.add("active");
    }

    filterDishes();
});
// ================= CATEGORY FROM URL =================

const params = new URLSearchParams(window.location.search);
const categoryFromURL = params.get("category");

if (categoryFromURL) {
    const normalized = categoryFromURL.toLowerCase().trim();

    const categoryAliases = {
        "burgers": "burger",
        "desserts": "dessert",
        "street-food": "street food",
        "street food": "street food"
    };

    const targetCategory = categoryAliases[normalized] || normalized;

    const matchingButton = Array.from(categoryButtons).find(button =>
        button.dataset.category.toLowerCase().trim() === targetCategory
    );

    if (matchingButton) {
        categoryButtons.forEach(button => button.classList.remove("active"));
        matchingButton.classList.add("active");

        selectedCategory = targetCategory;

        if (dishSearch) dishSearch.value = "";
        if (heroDishSearch) heroDishSearch.value = "";

        filterDishes();
    } else {
        console.warn("No matching dish category found:", categoryFromURL);
    }
}
const initialDishQuery = new URLSearchParams(window.location.search).get("search");
if (initialDishQuery) {
    handleDishSearch(initialDishQuery);
}

// ================= CRAVING MOOD CHIPS =================
const cravingChips = document.querySelectorAll(".craving-chip");
cravingChips.forEach(chip => {
    chip.addEventListener("click", function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        cravingChips.forEach(c => c.classList.remove("active"));
        this.classList.add("active");
        selectedCraving = this.dataset.craving || "all";
        filterDishes();
    });
});

// ================= RESTAURANT FILTER DROPDOWN =================
const dishRestaurantFilter = document.getElementById("dishRestaurantFilter");
if (dishRestaurantFilter) {
    dishRestaurantFilter.addEventListener("change", function() {
        selectedRestaurant = this.value.toLowerCase().trim();
        filterDishes();
    });
}

// ================= CRAVING FROM URL =================
const cravingFromURL = params.get("craving");
if (cravingFromURL) {
    const normCraving = cravingFromURL.toLowerCase().trim();
    const matchingChip = Array.from(cravingChips).find(c =>
        (c.dataset.craving || "").toLowerCase().trim() === normCraving
    );
    if (matchingChip) {
        cravingChips.forEach(c => c.classList.remove("active"));
        matchingChip.classList.add("active");
        selectedCraving = normCraving;
        filterDishes();
    }
}


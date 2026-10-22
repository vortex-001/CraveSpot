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



/* =========================================
   FILTER DISHES
========================================= */

function filterDishes() {

    const query =
        dishSearch.value.toLowerCase().trim();


    let visibleCount = 0;


    dishCards.forEach(card => {

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
            matchesAdvanced
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

    if (selectedCategory === "all") {
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

hearts.forEach(heart => {
    heart.addEventListener("click", function(event) {
        event.stopPropagation();

        const isFavorite = this.classList.contains("is-favorite");

       if (isFavorite) {
    this.classList.remove("is-favorite");
} else {
    this.classList.add("is-favorite");
}
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


        /* Open dish details */

        window.location.href =
            "dish-details.html?dish=" +
            encodeURIComponent(dishSlug);

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
        "desserts": "dessert"
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
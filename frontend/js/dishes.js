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


        if (
            matchesSearch &&
            matchesCategory &&
            matchesFilter
        ) {

            card.style.display = "block";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    dishResultCount.textContent =
        visibleCount +
        " dishes found";


    if (visibleCount === 0) {

        dishNoResults.style.display =
            "block";

    } else {

        dishNoResults.style.display =
            "none";

    }


    if (selectedCategory === "all") {

        dishResultTitle.textContent =
            "Popular dishes";

    } else {

        dishResultTitle.textContent =
            selectedCategory
                .charAt(0)
                .toUpperCase() +
            selectedCategory.slice(1) +
            " dishes";

    }

}



/* =========================================
   SEARCH
========================================= */

function updateDishSearch(value) {

    dishSearch.value = value;

    heroDishSearch.value = value;

    filterDishes();

}


dishSearch.addEventListener(
    "input",
    function() {

        heroDishSearch.value =
            this.value;

        filterDishes();

    }
);


heroDishSearch.addEventListener(
    "input",
    function() {

        dishSearch.value =
            this.value;

        filterDishes();

    }
);



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


            selectedCategory =
                this.dataset.category;


            filterDishes();

        }
    );

});



/* =========================================
   FILTER BUTTONS
========================================= */

const filterButtons =
    document.querySelectorAll(
        ".dish-filter"
    );


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            this.classList.add("active");


            selectedFilter =
                this.dataset.filter;


            filterDishes();

        }
    );

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

    heart.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            if (
                this.textContent === "♡"
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

});



/* =========================================
   HOMEPAGE CATEGORY LINK
========================================= */

const params =
    new URLSearchParams(
        window.location.search
    );


const categoryFromURL =
    params.get("category");


if (categoryFromURL) {

    const normalized =
        categoryFromURL.toLowerCase();


    const matchingButton =
        Array.from(categoryButtons)
        .find(button =>
            button.dataset.category ===
            normalized
        );


    if (matchingButton) {

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        matchingButton.classList.add(
            "active"
        );


        selectedCategory =
            normalized;

    }


    dishSearch.value =
        categoryFromURL;

    heroDishSearch.value =
        categoryFromURL;


    filterDishes();

}
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
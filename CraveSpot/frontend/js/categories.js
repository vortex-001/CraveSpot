
/* =========================================
   CATEGORIES PAGE JAVASCRIPT
========================================= */


const categorySearch =
    document.getElementById(
        "categorySearch"
    );


const heroCategorySearch =
    document.getElementById(
        "heroCategorySearch"
    );


const categoryCards =
    document.querySelectorAll(
        ".big-category-card"
    );


const categoryNoResults =
    document.getElementById(
        "categoryNoResults"
    );


const categoryCount =
    document.getElementById(
        "categoryCount"
    );



/* =========================================
   CATEGORY SEARCH
========================================= */

function searchCategories() {

    const query =
        categorySearch.value
        .toLowerCase()
        .trim();


    let visibleCount = 0;


    categoryCards.forEach(card => {

        const name =
            card.dataset.name
            .toLowerCase();


        if (
            name.includes(query)
        ) {

            card.style.display =
                "block";

            visibleCount++;

        } else {

            card.style.display =
                "none";

        }

    });


    categoryCount.textContent =
        visibleCount +
        " categories";


    if (visibleCount === 0) {

        categoryNoResults.style.display =
            "block";

    } else {

        categoryNoResults.style.display =
            "none";

    }

}



/* =========================================
   NAVBAR SEARCH
========================================= */

categorySearch.addEventListener(
    "input",
    function() {

        heroCategorySearch.value =
            this.value;

        searchCategories();

    }
);



/* =========================================
   HERO SEARCH
========================================= */

heroCategorySearch.addEventListener(
    "input",
    function() {

        categorySearch.value =
            this.value;

        searchCategories();

    }
);
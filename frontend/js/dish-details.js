
/* ==========================================
   DISH DETAILS DATA
========================================== */

const dishData = {

    "chicken-biryani": {
        name: "Chicken Biryani",
        category: "Biryani",
        cuisine: "North Indian",
        price: 220,
        rating: 4.7,
        reviews: "120+ reviews",

        restaurant: "Urban Tadka",
        restaurantSlug: "urban-tadka",
        location: "Sector 17, Chandigarh",

        image:
        "../assets/images/chicken-biryani.jpg",
        
           // "Aromatic basmati rice cooked with tender chicken, fragrant spices and traditional biryani masala.",

        longDescription:
            "Chicken Biryani is a flavorful rice dish prepared with aromatic basmati rice, tender chicken and a blend of traditional Indian spices. It is slow-cooked to bring together the rich flavors and aroma."
    },


    "classic-cheese-pizza": {
        name: "Classic Cheese Pizza",
        category: "Pizza",
        cuisine: "Italian",
        price: 280,
        rating: 4.5,
        reviews: "95+ reviews",

        restaurant: "Pizza Street",
        restaurantSlug: "pizza-street",
        location: "Sector 34, Chandigarh",

       image:
    "../assets/images/classic-cheese-pizza.jpg",
        description:
            "Classic pizza topped with rich tomato sauce, mozzarella cheese and Italian herbs.",

        longDescription:
            "Our Classic Cheese Pizza combines a crispy base with rich tomato sauce, melted mozzarella and aromatic Italian herbs. A simple but delicious choice for pizza lovers."
    },


    "classic-chicken-burger": {
        name: "Classic Chicken Burger",
        category: "Burger",
        cuisine: "Fast Food",
        price: 160,
        rating: 4.4,
        reviews: "80+ reviews",

        restaurant: "The Food Factory",
        restaurantSlug: "the-food-factory",
        location: "Phase 7, Mohali",

        image:
    "../assets/images/classic-chicken-burger.jpg",
        description:
            "Juicy chicken patty served inside a soft bun with fresh vegetables and signature sauce.",

        longDescription:
            "The Classic Chicken Burger features a juicy chicken patty, fresh vegetables and signature sauce served in a soft toasted bun. Perfect for a quick and satisfying meal."
    },


    "steamed-veg-momos": {
        name: "Steamed Veg Momos",
        category: "Chinese",
        cuisine: "Chinese / Tibetan",
        price: 120,
        rating: 4.6,
        reviews: "110+ reviews",

        restaurant: "Wok & Roll",
        restaurantSlug: "wok-and-roll",
        location: "Sector 35, Chandigarh",

        image:
    "../assets/images/steamed-veg-momos.jpg",
        description:
            "Soft steamed dumplings filled with seasoned vegetables and served with spicy chutney.",

        longDescription:
            "Steamed Veg Momos are soft dumplings filled with seasoned vegetables. They are steamed until perfectly cooked and served with a flavorful spicy chutney."
    },


    "butter-chicken": {
        name: "Butter Chicken",
        category: "North Indian",
        cuisine: "North Indian",
        price: 320,
        rating: 4.8,
        reviews: "150+ reviews",

        restaurant: "Urban Tadka",
        restaurantSlug: "urban-tadka",
        location: "Sector 17, Chandigarh",

        image:
    "../assets/images/butter-chicken.jpg",
        description:
            "Tender chicken cooked in a rich, creamy tomato-based gravy with aromatic Indian spices.",

        longDescription:
            "Butter Chicken is a classic North Indian dish made with tender chicken pieces cooked in a creamy tomato-based gravy. The dish is finished with butter and aromatic spices."
    },


    "loaded-fries": {
        name: "Loaded Fries",
        category: "Burger",
        cuisine: "Fast Food",
        price: 180,
        rating: 4.3,
        reviews: "70+ reviews",

        restaurant: "The Food Factory",
        restaurantSlug: "the-food-factory",
        location: "Phase 7, Mohali",

        image:
    "../assets/images/loaded-fries.jpg",
        description:
            "Crispy fries loaded with delicious toppings and creamy sauces.",

        longDescription:
            "Loaded Fries are crispy golden fries topped with flavorful sauces and delicious toppings. They make a great snack or side dish."
    },


    "chilli-garlic-noodles": {
        name: "Chilli Garlic Noodles",
        category: "Chinese",
        cuisine: "Chinese",
        price: 190,
        rating: 4.5,
        reviews: "90+ reviews",

        restaurant: "Wok & Roll",
        restaurantSlug: "wok-and-roll",
        location: "Sector 35, Chandigarh",

        image:
    "../assets/images/chilli-garlic-noodles.jpg",
        description:
            "Stir-fried noodles tossed with garlic, chilli and flavorful Chinese sauces.",

        longDescription:
            "Chilli Garlic Noodles are stir-fried with fresh garlic, chilli and flavorful sauces. The combination gives the noodles a delicious spicy and savory taste."
    },


    "chocolate-brownie": {
        name: "Chocolate Brownie",
        category: "Dessert",
        cuisine: "Dessert",
        price: 150,
        rating: 4.7,
        reviews: "100+ reviews",

        restaurant: "Sweet Treats",
        restaurantSlug: "sweet-treats",
        location: "Chandigarh",

       image:
    "../assets/images/chocolate-brownie.jpg",
        description:
            "Rich and fudgy chocolate brownie with a soft centre and deep chocolate flavor.",

        longDescription:
            "This rich chocolate brownie has a soft, fudgy centre and an intense chocolate flavor. It is a perfect sweet treat after a delicious meal."
    }

};


/* ==========================================
   GET DISH FROM URL
========================================== */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const dishSlug =
    urlParams.get("dish");


/* ==========================================
   LOAD DISH
========================================== */

function loadDish() {

    const dish =
        dishData[dishSlug];


    if (!dish) {

        document.getElementById("dishName").textContent =
            "Dish Not Found";

        document.getElementById("dishDescription").textContent =
            "Sorry, this dish could not be found.";

        return;
    }


    /* Image */

    document.getElementById("dishImage").src =
        dish.image;

    document.getElementById("dishImage").alt =
        dish.name;


    /* Name */

    document.getElementById("dishName").textContent =
        dish.name;


    document.getElementById("breadcrumbDish").textContent =
        dish.name;


    /* Category */

    document.getElementById("dishCategory").textContent =
        dish.category;


    /* Rating */

    document.getElementById("dishRating").textContent =
        "⭐ " + dish.rating;


    document.getElementById("dishReviews").textContent =
        dish.reviews;


    /* Price */

    document.getElementById("dishPrice").textContent =
        "₹" + dish.price;

    document.getElementById("dishPriceInfo").textContent =
        "₹" + dish.price;


    /* Description */

    document.getElementById("dishDescription").textContent =
        dish.description;

    document.getElementById("longDescription").textContent =
        dish.longDescription;


    /* Cuisine */

    document.getElementById("dishCuisine").textContent =
        dish.cuisine;


    document.getElementById("dishRatingInfo").textContent =
        dish.rating + " / 5";


    /* Restaurant */

    document.getElementById("restaurantName").textContent =
        dish.restaurant;

    document.getElementById("restaurantLocation").textContent =
        dish.location;

}


/* ==========================================
   FAVORITE
========================================== */

function toggleDishFavorite() {

    const button =
        document.getElementById(
            "dishFavoriteBtn"
        );


    const favorites =
        JSON.parse(
            localStorage.getItem(
                "CraveSpot_favorite_dishes"
            )
        ) || [];


    const index =
        favorites.indexOf(dishSlug);


    if (index === -1) {

        favorites.push(dishSlug);

        button.textContent =
            "♥ Added to Favorites";

        button.classList.add(
            "favorite-active"
        );

    } else {

        favorites.splice(index, 1);

        button.textContent =
            "♡ Add to Favorites";

        button.classList.remove(
            "favorite-active"
        );

    }


    localStorage.setItem(
        "CraveSpot_favorite_dishes",
        JSON.stringify(favorites)
    );

}


/* ==========================================
   LOAD FAVORITE STATE
========================================== */

function loadFavoriteState() {

    const favorites =
        JSON.parse(
            localStorage.getItem(
                "CraveSpot_favorite_dishes"
            )
        ) || [];


    const button =
        document.getElementById(
            "dishFavoriteBtn"
        );


    if (
        button &&
        favorites.includes(dishSlug)
    ) {

        button.textContent =
            "♥ Added to Favorites";

        button.classList.add(
            "favorite-active"
        );

    }

}


/* ==========================================
   VIEW RESTAURANT
========================================== */

function viewRestaurant() {

    const dish =
        dishData[dishSlug];


    if (!dish) {
        return;
    }


    window.location.href =
        "restaurant-details.html?vendor=" +
        encodeURIComponent(
            dish.restaurantSlug
        );

}


/* ==========================================
   SEARCH
========================================== */

function searchDish() {

    const input =
        document.getElementById(
            "dishSearch"
        );


    const query =
        input.value.trim();


    if (query === "") {

        alert(
            "Please enter a dish name."
        );

        return;
    }


    window.location.href =
        "dishes.html?search=" +
        encodeURIComponent(query);

}


/* ==========================================
   ENTER KEY SEARCH
========================================== */

const dishSearch =
    document.getElementById(
        "dishSearch"
    );


if (dishSearch) {

    dishSearch.addEventListener(
        "keypress",
        function(event) {

            if (event.key === "Enter") {
                searchDish();
            }

        }
    );

}


/* ==========================================
   PAGE INITIALIZATION
========================================== */

loadDish();

loadFavoriteState();
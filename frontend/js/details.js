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
    cuisine: "North Indian • Mughlai • Biryani",
    address: "Sector 17, Chandigarh",
    rating: 4.5,
    price_for_two: 450,
    delivery_time_mins: 30,
    offer: "20% OFF"
};

const sampleDishes = [
    { item_id: 101, name: "Butter Chicken", category: "Main Course", price: 380, rating: 4.8, is_veg: 0, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=85", description: "Tender chicken cooked in rich makhani gravy with cream and butter." },
    { item_id: 102, name: "Dal Makhani", category: "Main Course", price: 260, rating: 4.7, is_veg: 1, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=85", description: "Slow-cooked black lentils with cream, tomatoes and butter." },
    { item_id: 103, name: "Fiery Paneer Pizza", category: "Pizzas", price: 320, rating: 4.6, is_veg: 1, image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=85", description: "Spicy marinated paneer with capsicum, oregano and mozzarella." },
    { item_id: 104, name: "Classic Margherita Pizza", category: "Pizzas", price: 280, rating: 4.7, is_veg: 1, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=85", description: "Fresh tomato basil sauce with premium melted mozzarella." },
    { item_id: 105, name: "Special Paneer Kathi Roll", category: "Rolls", price: 150, rating: 4.7, is_veg: 1, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=85", description: "Flaky paratha loaded with spiced paneer, onions and mint chutney." },
    { item_id: 106, name: "Amritsari Stuffed Kulcha Thali", category: "Thalis", price: 140, rating: 4.8, is_veg: 1, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=85", description: "Crispy tandoori kulcha with spicy chhole, butter and tangy chutney." },
    { item_id: 107, name: "Kadak Masala Chai & Bun Maska", category: "Street Bites", price: 70, rating: 4.8, is_veg: 1, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85", description: "Steaming hot ginger cardamom chai served with soft toasted bun and butter." },
    { item_id: 108, name: "Special Double Cheese Maggi", category: "Street Bites", price: 90, rating: 4.7, is_veg: 1, image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=85", description: "2-minute noodles cooked with buttery veggies, oregano herbs and shredded mozzarella." }
];

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
    const priceEl = document.getElementById("restaurantPrice");
    if (priceEl) {
        priceEl.textContent = r.price_for_two ? `₹${r.price_for_two} for two` : "₹350 for two";
    }

    const timeEl = document.getElementById("restaurantTime");
    if (timeEl) {
        timeEl.textContent = r.delivery_time_mins ? `${r.delivery_time_mins} mins` : "25-30 mins";
    }

    const offerEl = document.getElementById("restaurantOffer");
    if (offerEl) {
        const offerText = r.offer || "20% OFF on selected items";
        offerEl.textContent = offerText.includes("OFF") && !offerText.includes("selected") ? `${offerText} on selected items` : offerText;
    }


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
   AUTHENTIC FOOD IMAGE RESOLVER
   Ensures every dish has its true matching photo
   and prevents generic placeholder fallback
========================================== */

function resolveDishImage(dishName = "", category = "", existingUrl = "") {
    const text = (dishName + " " + category).toLowerCase();

    // 1. Rolls, Wraps & Shawarmas - ALWAYS match authentic roll photo
    if (text.includes("roll") || text.includes("kathi") || text.includes("wrap") || text.includes("shawarma")) {
        return "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=85";
    }

    // 2. Shakes, Thickshakes, Smoothies & Cold Coffee - ALWAYS match authentic tall glass shake photo
    if (text.includes("shake") || text.includes("thickshake") || text.includes("smoothie") || text.includes("cold coffee") || text.includes("frappe")) {
        if (text.includes("strawberry") || text.includes("berry") || text.includes("fruit")) {
            return "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=85";
        }
        return "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=85";
    }

    // 3. Indian Sweets: Gulab Jamun, Jalebi, Rasgulla, Halwa, Phirni
    if (text.includes("gulab jamun") || text.includes("jamun")) {
        return "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("jalebi") || text.includes("rabri")) {
        return "https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("rasgulla") || text.includes("rasmalai")) {
        return "https://images.unsplash.com/photo-1714799263412-2e0c1f875959?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("halwa") || text.includes("kesari") || text.includes("phirni") || text.includes("shahi tukda") || text.includes("mithai") || text.includes("falooda")) {
        return "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=85";
    }

    // 4. Kulchas & Chole Thalis - ALWAYS match authentic kulcha photo
    if (text.includes("kulcha") || text.includes("chhole") || text.includes("chole") || text.includes("bhatur")) {
        return "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=85";
    }

    // Reject generic placeholders and mismatched thali/steak/mojito/bad roll images
    const isBadImage = !existingUrl || typeof existingUrl !== "string" || !existingUrl.startsWith("http") ||
        existingUrl.includes("photo-1504674900247-0877df9cc836") ||
        existingUrl.includes("photo-1555396273-367ea4eb4db5") ||
        existingUrl.includes("photo-1627308595229-7830a5c91f9f") ||
        existingUrl.includes("photo-1544145945-f90425340c7e") ||
        existingUrl.includes("photo-1551183053-bf91a1d81141") ||
        (existingUrl.includes("photo-1626777552726-4a6b54c97e46") && !text.includes("thali") && !text.includes("naan") && !text.includes("roti") && !text.includes("paratha"));

    if (!isBadImage) {
        return existingUrl;
    }

    // 3. Butter Chicken & Makhani Chicken
    if (text.includes("butter chicken") || text.includes("makhani chicken") || text.includes("murgh makhani")) {
        return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=85";
    }

    // 4. Dal Makhani & Lentils
    if (text.includes("dal makhani") || text.includes("makhani dal") || text.includes("bukhara") || text.includes("black lentil") || text.includes("daal")) {
        return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=85";
    }

    // 5. Paneer Curries
    if (text.includes("paneer butter") || text.includes("shahi paneer") || text.includes("kadai paneer") || text.includes("matar paneer")) {
        return "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=85";
    }

    // 6. Pizzas
    if (text.includes("pizza") || text.includes("margherita") || text.includes("mozzarella")) {
        if (text.includes("peri") || text.includes("paneer") || text.includes("spic")) {
            return "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=85";
        }
        if (text.includes("pepperoni") || text.includes("chicken")) {
            return "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=85";
        }
        return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=85";
    }

    // 7. Garlic Bread & Sides
    if (text.includes("garlic bread") || text.includes("breadsticks")) {
        return "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=85";
    }

    // 8. Biryani & Pulao
    if (text.includes("biryani") || text.includes("pulao") || text.includes("dum rice")) {
        return "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=85";
    }

    // 9. Burgers
    if (text.includes("burger") || text.includes("cheeseburger") || text.includes("smash") || text.includes("zinger")) {
        return text.includes("smash")
            ? "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=85"
            : "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85";
    }

    // 10. Fries & Wings
    if (text.includes("fries") || text.includes("peri-peri fries")) {
        return "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("wing") || text.includes("barbecue") || text.includes("bbq") || text.includes("grilled chicken")) {
        return "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=85";
    }

    // 11. Momos & Dim Sum
    if (text.includes("momo") || text.includes("dimsum") || text.includes("dumpling")) {
        return text.includes("fried") || text.includes("kurkure")
            ? "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=85"
            : "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=800&q=85";
    }

    // 12. Noodles & Manchurian
    if (text.includes("noodle") || text.includes("hakka") || text.includes("chowmein") || text.includes("schezwan")) {
        return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("manchurian")) {
        return "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("chilli paneer")) {
        return "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=85";
    }

    // 13. Golgappe, Chaat & Street Food
    if (text.includes("golgapp") || text.includes("pani puri") || text.includes("chaat") || text.includes("papdi") || text.includes("tikki") || text.includes("pav bhaji")) {
        return "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85";
    }

    // 14. Desserts, Brownies & Sweets
    if (text.includes("brownie") || text.includes("fudge")) {
        return "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("cake") || text.includes("pastry") || text.includes("cheesecake")) {
        return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("jamun") || text.includes("kesar") || text.includes("mithai") || text.includes("falooda")) {
        return "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?auto=format&fit=crop&w=800&q=85";
    }

    // 15. Chai & Hot Drinks
    if (text.includes("chai") || text.includes("tea") || text.includes("bun maska")) {
        return "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("maggi")) {
        return "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("shake") || text.includes("thickshake") || text.includes("smoothie") || text.includes("cold coffee")) {
        return "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("dosa") || text.includes("south indian")) {
        return "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=85";
    }
    if (text.includes("thali")) {
        return "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=85";
    }

    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85";
}


/* ==========================================
   LOAD MENU FROM MYSQL / RESTAURANT ENGINE
========================================== */

let activeMenuCategory = "all";
let allLoadedDishes = [];

async function loadMenu() {
    const menuGrid = document.getElementById("menuGrid");
    const dishCount = document.getElementById("dishCount");

    if (!menuGrid) return;

    menuGrid.innerHTML = "<p>Loading menu...</p>";

    try {
        allLoadedDishes = await apiRequest(
            `/restaurants/${currentRestaurant.restaurant_id}/menu`
        );

        if (!Array.isArray(allLoadedDishes) || allLoadedDishes.length === 0) {
            allLoadedDishes = sampleDishes;
        }
    } catch (error) {
        console.warn("Using sample menu data:", error);
        allLoadedDishes = sampleDishes;
    }

    renderMenuCategoryTabs(allLoadedDishes);
    renderFilteredMenuCards();
}

function renderMenuCategoryTabs(dishes) {
    let tabsContainer = document.getElementById("menuCategoryTabs");
    if (!tabsContainer) {
        tabsContainer = document.createElement("div");
        tabsContainer.id = "menuCategoryTabs";
        tabsContainer.className = "menu-category-tabs";
        const menuSection = document.getElementById("menuSection");
        const menuGrid = document.getElementById("menuGrid");
        if (menuSection && menuGrid) {
            menuSection.insertBefore(tabsContainer, menuGrid);
        }
    }

    if (!tabsContainer) return;

    // Collect unique categories with counts
    const categoryMap = { "all": dishes.length };
    dishes.forEach(d => {
        const cat = d.category || "General";
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categories = Object.keys(categoryMap);

    tabsContainer.innerHTML = "";
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `menu-category-btn ${activeMenuCategory === cat ? "active" : ""}`;
        btn.dataset.category = cat;

        const label = cat === "all" ? "All Dishes" : cat;
        btn.innerHTML = `<span>${label}</span> <span class="cat-pill-count">${categoryMap[cat]}</span>`;

        btn.addEventListener("click", () => {
            activeMenuCategory = cat;
            document.querySelectorAll(".menu-category-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderFilteredMenuCards();
        });

        tabsContainer.appendChild(btn);
    });
}

function renderFilteredMenuCards() {
    const menuGrid = document.getElementById("menuGrid");
    const dishCount = document.getElementById("dishCount");
    if (!menuGrid) return;

    menuGrid.innerHTML = "";

    const filtered = allLoadedDishes.filter(dish => {
        if (activeMenuCategory === "all") return true;
        return (dish.category || "General").toLowerCase() === activeMenuCategory.toLowerCase();
    });

    if (dishCount) {
        dishCount.textContent = `${filtered.length} of ${allLoadedDishes.length} dishes`;
    }

    if (filtered.length === 0) {
        menuGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #777; padding: 30px;">No dishes in this category.</p>`;
        return;
    }

    filtered.forEach(dish => {
        const card = document.createElement("div");
        card.className = "menu-card";

        const resolvedImage = resolveDishImage(dish.name, dish.category, dish.image_url || dish.image);
        const isVeg = dish.is_veg === 1 || dish.is_veg === true || dish.is_veg === "true" || dish.is_veg === "1";

        const imageElement = document.createElement("img");
        imageElement.src = resolvedImage;
        imageElement.alt = dish.name || "Food dish";
        imageElement.className = "menu-image";
        imageElement.loading = "lazy";

        const info = document.createElement("div");
        info.className = "menu-info";

        const headerRow = document.createElement("div");
        headerRow.className = "menu-card-header";
        headerRow.style.display = "flex";
        headerRow.style.alignItems = "center";
        headerRow.style.gap = "8px";
        headerRow.style.marginBottom = "4px";

        // Veg / Non-Veg Indicator Dot
        const dietBadge = document.createElement("span");
        dietBadge.className = `diet-badge ${isVeg ? "veg" : "non-veg"}`;
        dietBadge.title = isVeg ? "Pure Veg" : "Non-Veg";
        dietBadge.innerHTML = `<span class="diet-dot"></span>`;

        const name = document.createElement("h3");
        name.style.margin = "0";
        name.textContent = dish.name || "Food Item";

        headerRow.append(dietBadge, name);

        const category = document.createElement("span");
        category.className = "menu-category-tag";
        category.textContent = dish.category || "Specialty";

        const description = document.createElement("p");
        description.textContent = dish.description || "Authentic freshly prepared specialty dish.";

        const priceRow = document.createElement("div");
        priceRow.className = "menu-price-row";
        priceRow.style.display = "flex";
        priceRow.style.alignItems = "center";
        priceRow.style.justifyContent = "space-between";
        priceRow.style.marginTop = "auto";

        const price = document.createElement("span");
        price.className = "menu-price";
        price.textContent = "\u20B9" + Number(dish.price || 0).toFixed(2);

        const ratingVal = Number(dish.rating || 4.6).toFixed(1);
        const rating = document.createElement("span");
        rating.className = "menu-rating-chip";
        rating.innerHTML = `<span style="color:#F59E0B;">\u2605</span> ${ratingVal}`;

        priceRow.append(price, rating);

        info.append(headerRow, category, description, priceRow);

        const favorite = document.createElement("button");
        favorite.className = "dish-favorite";
        favorite.type = "button";
        favorite.setAttribute("aria-label", `Save ${dish.name} to favorites`);
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

        favorite.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleDishFavorite(this);
        });

        card.append(imageElement, info, favorite);

        card.style.cursor = "pointer";
        card.addEventListener("click", function (event) {
            if (event.target.closest("button")) return;

            const dishSlug = (dish.name || "")
                .toLowerCase()
                .trim()
                .replace(/&/g, "and")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            const restName = currentRestaurant ? currentRestaurant.name : "Restaurant";
            const restId = currentRestaurant ? currentRestaurant.restaurant_id : "";
            const restLoc = currentRestaurant ? (currentRestaurant.address || "Chandigarh") : "Chandigarh";

            const url = `dish-details.html?dish=${encodeURIComponent(dishSlug)}&name=${encodeURIComponent(dish.name || "")}&category=${encodeURIComponent(dish.category || "")}&description=${encodeURIComponent(dish.description || "")}&price=${encodeURIComponent(dish.price || 0)}&rating=${encodeURIComponent(dish.rating || 4.6)}&image=${encodeURIComponent(resolvedImage)}&restaurant=${encodeURIComponent(restName)}&restaurantId=${encodeURIComponent(restId)}&restaurantLocation=${encodeURIComponent(restLoc)}`;

            window.location.href = url;
        });

        menuGrid.appendChild(card);
    });
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
    const nameInput = document.getElementById("reviewerName");
    const textInput = document.getElementById("reviewText");

    if (!nameInput || !textInput) {
        return;
    }

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

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
        date: new Date().toLocaleDateString()
    };

    saveStoredReview(review);

    alert("Your review has been added!");

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
    const container = document.getElementById("reviewsContainer");

    if (!container || !currentRestaurant) {
        return;
    }

    const reviews = getStoredReviews();
    container.innerHTML = "";

    if (!reviews || reviews.length === 0) {
        container.innerHTML = `
            <div class="review-card">
                <p>No reviews yet.</p>
            </div>
        `;
        return;
    }

    reviews.forEach(review => {
        const rating = Math.max(
            0,
            Math.min(5, Number(review.rating) || 0)
        );

        const stars =
            "\u2605".repeat(Math.floor(rating)) +
            "\u2606".repeat(5 - Math.floor(rating));

        const card = document.createElement("div");
        card.className = "review-card";

        card.innerHTML = `
            <div class="review-top">
                <span class="reviewer-name"></span>
                <span class="review-date"></span>
            </div>

            <div class="review-stars">${stars}</div>

            <p class="review-text"></p>
        `;

        card.querySelector(".reviewer-name").textContent =
            review.name || "Anonymous";

        card.querySelector(".review-date").textContent =
            review.date || "";

        card.querySelector(".review-text").textContent =
            review.text || "";

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

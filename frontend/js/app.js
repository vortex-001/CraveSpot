
function performSearch() {
    const input = document.getElementById("heroSearch");

    if (!input) {
        return;
    }

    const query = input.value.trim();

    if (query === "") {
        alert("Please enter a restaurant, dish or cuisine.");
        return;
    }

    window.location.href =
        "pages/restaurants.html?search=" +
        encodeURIComponent(query);
}


function openLogin() {
    alert(
        "Login functionality will be connected to the backend later."
    );
}


/* Only add Enter-key listener if heroSearch exists */

const heroSearch =
    document.getElementById("heroSearch");

if (heroSearch) {

    heroSearch.addEventListener(
        "keypress",
        function(event) {

            if (event.key === "Enter") {
                performSearch();
            }

        }
    );

}
// ================================
// LOGIN / LOGOUT STATE
// ================================

const authArea = document.getElementById("authArea");

if (authArea) {

    const loggedIn =
        localStorage.getItem("CraveSpotLoggedIn");

    if (loggedIn === "true") {

        authArea.innerHTML = `
            <div class="user-menu">
                <span class="user-name">👤 Welcome!</span>
                <button class="logout-btn" onclick="logoutUser()">
                    Logout
                </button>
            </div>
        `;

    }

}


// ---------- LOGOUT ----------

function logoutUser() {

    localStorage.removeItem("CraveSpotLoggedIn");

    window.location.reload();

}
// ================================
// HOME PAGE RESTAURANT CARD NAVIGATION
// ================================

if (document.getElementById("heroSearch")) {
    document.querySelectorAll(".restaurant-card").forEach((card) => {
        card.addEventListener("click", () => {
            const name = card
                .querySelector(".restaurant-name h3")
                ?.textContent.trim();

            if (!name) {
                return;
            }

            window.location.href =
                "pages/restaurant-details.html?vendor=" +
                encodeURIComponent(name);
        });
    });
}
// ================================
// HOME PAGE COLLECTION NAVIGATION
// ================================

if (document.getElementById("heroSearch")) {
    const collectionSearchTerms = [
    "chinese",
    "pizza",
    "north indian"
];

    document.querySelectorAll(".collection-card").forEach((card, index) => {
        card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");

        const openCollection = () => {
            const searchTerm = collectionSearchTerms[index];

            if (!searchTerm) {
                return;
            }

            window.location.href =
                "pages/restaurants.html?search=" +
                encodeURIComponent(searchTerm);
        };

        card.addEventListener("click", openCollection);

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCollection();
            }
        });
    });
}
/* =========================================
   SHARED LOCATION SELECTOR
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const selector = document.getElementById("locationSelector");
    const dropdown = document.getElementById("locationDropdown");
    const citySelect = document.getElementById("locationCity");
    const locationLabel = document.getElementById("selectedLocation");
    const saveButton = document.getElementById("saveLocation");

    if (!selector || !dropdown || !citySelect || !locationLabel || !saveButton) {
        return;
    }

    const savedCity = localStorage.getItem("CraveSpotLocation") || "Chandigarh";

    citySelect.value = savedCity;
    locationLabel.textContent = savedCity;

    selector.addEventListener("click", () => {
        dropdown.hidden = !dropdown.hidden;
    });

    selector.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            dropdown.hidden = !dropdown.hidden;
        }
    });

    saveButton.addEventListener("click", () => {
        const city = citySelect.value;

        localStorage.setItem("CraveSpotLocation", city);
        locationLabel.textContent = city;
        dropdown.hidden = true;

        document.dispatchEvent(
            new CustomEvent("cravespot:locationChanged", {
                detail: { city }
            })
        );
    });
    window.addEventListener("pageshow", function () {
    const latestCity =
        localStorage.getItem("CraveSpotLocation") || "Chandigarh";

    locationLabel.textContent = latestCity;
    citySelect.value = latestCity;
});

    document.addEventListener("click", (event) => {
        if (!selector.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.hidden = true;
        }
    });
});
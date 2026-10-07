
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
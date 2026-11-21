/**
 * CraveSpot Central API Client & Utilities
 * Handles REST calls, auth tokens, toast notifications, and geolocation persistence.
 */

const CRAVESPOT_API_BASE = window.CRAVESPOT_API_BASE
    || localStorage.getItem("cravespot_api_url")
    || (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000/api"
        : "/api");

// ---------------------------------------------------------------------
// 1. Toast Notification Utility
// ---------------------------------------------------------------------
function showToast(message, type = "info") {
    let container = document.getElementById("cravespot-toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "cravespot-toast-container";
        container.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const bgColors = {
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#FF5200"
    };

    toast.style.cssText = `
        background: ${bgColors[type] || bgColors.info};
        color: #FFFFFF;
        padding: 12px 20px;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 8px;
        pointer-events: auto;
        opacity: 0;
        transform: translateY(15px);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    const icon = type === "success" ? "✓" : (type === "error" ? "✕" : "🍴");
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    // Animate out
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px)";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ---------------------------------------------------------------------
// 2. API Request Wrapper with Bearer Auth Token
// ---------------------------------------------------------------------
async function apiRequest(endpoint, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    const token = localStorage.getItem("cravespot_token");
    if (token && !headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    if (config.body && typeof config.body === "object") {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(`${CRAVESPOT_API_BASE}${endpoint}`, config);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMsg = data.message || `Request failed with status ${response.status}`;
            throw new Error(errorMsg);
        }

        return data;
    } catch (err) {
        console.warn(`API Error [${endpoint}]:`, err.message);
        throw err;
    }
}

// Convenient method helpers
const api = {
    get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: "GET" }),
    post: (endpoint, body = {}, options = {}) => apiRequest(endpoint, { ...options, method: "POST", body }),
    put: (endpoint, body = {}, options = {}) => apiRequest(endpoint, { ...options, method: "PUT", body }),
    delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: "DELETE" })
};

// ---------------------------------------------------------------------
// 3. User Geolocation & City Helpers
// ---------------------------------------------------------------------
function getUserLocation() {
    try {
        const saved = localStorage.getItem("cravespot_coords");
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) { }
    // Default: Sector 17, Chandigarh
    return { lat: 30.7333, lng: 76.7794, city: "Chandigarh", display_name: "Chandigarh, India" };
}

function setUserLocation(lat, lng, city = "Chandigarh", displayName = "") {
    const loc = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        city: city || "Chandigarh",
        display_name: displayName || `${city}, India`
    };
    localStorage.setItem("cravespot_coords", JSON.stringify(loc));
    localStorage.setItem("CraveSpotLocation", loc.city);
    window.dispatchEvent(new CustomEvent("cravespot:locationChanged", { detail: loc }));
    return loc;
}

// ---------------------------------------------------------------------
// 4. User Session Helpers
// ---------------------------------------------------------------------
function getCurrentUser() {
    try {
        const user = localStorage.getItem("cravespot_user");
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
}

function setCurrentUser(user, token) {
    if (user) {
        localStorage.setItem("cravespot_user", JSON.stringify(user));
        localStorage.setItem("CraveSpotLoggedIn", "true");
    }
    if (token) {
        localStorage.setItem("cravespot_token", token);
    }
    window.dispatchEvent(new CustomEvent("cravespot:authChanged"));
}

function logoutCurrentUser() {
    localStorage.removeItem("cravespot_user");
    localStorage.removeItem("cravespot_token");
    localStorage.removeItem("CraveSpotLoggedIn");
    window.dispatchEvent(new CustomEvent("cravespot:authChanged"));
    showToast("Logged out successfully", "info");
    setTimeout(() => window.location.reload(), 400);
}

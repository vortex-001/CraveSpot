'use strict';

/**
 * CraveSpot Core Application Script
 * Features:
 * - HTML5 Geolocation Auto-Detection & Geocoding Search Modal
 * - Natural Language Craving Search & Quick Craving Tags
 * - "Surprise Me" Interactive Food Discovery Modal
 * - Auth Session Management (User Profile Pill, Saved Wishlist Link, Logout)
 * - Mobile Navigation Drawer
 * - Universal Image Fallback Handlers
 */

// ---------------------------------------------------------------------
// 1. Natural Language Craving Search & Navigation
// ---------------------------------------------------------------------
function performCravingSearch(customQuery) {
    const input = document.getElementById('heroSearch');
    const query = (customQuery || (input ? input.value : '')).trim();

    if (!query) {
        if (input) input.focus();
        if (typeof showToast === 'function') {
            showToast('Please type what you are craving (e.g. "spicy momos under ₹150")', 'info');
        } else {
            alert('Please enter what you are craving!');
        }
        return;
    }

    // Determine correct path depending on current page level
    const isPagesDir = window.location.pathname.includes('/pages/');
    const targetUrl = (isPagesDir ? 'restaurants.html' : 'pages/restaurants.html') + 
        '?craving=' + encodeURIComponent(query);
    
    window.location.href = targetUrl;
}

const heroSearch = document.getElementById('heroSearch');
const heroSearchButton = document.getElementById('heroSearchButton');

if (heroSearchButton) {
    heroSearchButton.addEventListener('click', () => performCravingSearch());
}
if (heroSearch) {
    heroSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performCravingSearch();
    });
}

// ---------------------------------------------------------------------
// 2. Interactive Location Selector (Auto-detect + City Search Modal)
// ---------------------------------------------------------------------
function initLocationSystem() {
    const label = document.getElementById('selectedLocation');
    const selector = document.getElementById('locationSelector');
    const dropdown = document.getElementById('locationDropdown');
    const detectBtn = document.getElementById('detectLocationBtn');
    const cityInput = document.getElementById('locationSearchInput');
    const suggestionsBox = document.getElementById('locationSuggestions');

    // Load initial saved location
    const currentLoc = (typeof getUserLocation === 'function') 
        ? getUserLocation() 
        : { city: localStorage.getItem('CraveSpotLocation') || 'Chandigarh' };

    if (label) {
        label.textContent = currentLoc.city || 'Chandigarh';
    }

    if (selector && dropdown) {
        selector.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.hidden = !dropdown.hidden;
            if (!dropdown.hidden && cityInput) {
                cityInput.focus();
            }
        });

        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.hidden = true;
            }
        });
    }

    // A. Browser HTML5 Geolocation (Auto-detect)
    if (detectBtn) {
        detectBtn.addEventListener('click', () => {
            if (!navigator.geolocation) {
                if (typeof showToast === 'function') showToast('Geolocation is not supported by your browser', 'error');
                return;
            }

            detectBtn.disabled = true;
            detectBtn.innerHTML = '<span>📍</span> Detecting location...';

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    let cityName = 'Current Location';
                    try {
                        const geocode = await apiRequest(`/location/geocode?q=${lat},${lng}`);
                        if (geocode?.location?.city) {
                            cityName = geocode.location.city;
                        }
                    } catch (err) {
                        // Keep fallback
                    }

                    if (typeof setUserLocation === 'function') {
                        setUserLocation(lat, lng, cityName, `${cityName} (GPS)`);
                    } else {
                        localStorage.setItem('CraveSpotLocation', cityName);
                    }

                    if (label) label.textContent = cityName;
                    if (dropdown) dropdown.hidden = true;
                    detectBtn.disabled = false;
                    detectBtn.innerHTML = '<span>📍</span> Use my current location (GPS)';

                    if (typeof showToast === 'function') {
                        showToast(`Location set to ${cityName}`, 'success');
                    }
                },
                (error) => {
                    detectBtn.disabled = false;
                    detectBtn.innerHTML = '<span>📍</span> Use my current location (GPS)';
                    let msg = 'Could not access location';
                    if (error.code === error.PERMISSION_DENIED) {
                        msg = 'Location permission denied. Please select a city manually.';
                    }
                    if (typeof showToast === 'function') showToast(msg, 'warning');
                },
                { timeout: 8000, maximumAge: 60000 }
            );
        });
    }

    // B. Manual City / Locality Search
    if (cityInput) {
        cityInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const val = cityInput.value.trim();
                if (!val) return;

                cityInput.disabled = true;
                try {
                    const res = await apiRequest(`/location/geocode?q=${encodeURIComponent(val)}`);
                    if (res?.location) {
                        const loc = res.location;
                        if (typeof setUserLocation === 'function') {
                            setUserLocation(loc.latitude, loc.longitude, loc.city, loc.display_name);
                        } else {
                            localStorage.setItem('CraveSpotLocation', loc.city);
                        }
                        if (label) label.textContent = loc.city;
                        if (dropdown) dropdown.hidden = true;
                        if (typeof showToast === 'function') showToast(`Location updated to ${loc.city}`, 'success');
                    }
                } catch (err) {
                    if (typeof showToast === 'function') showToast(`Location "${val}" not found`, 'error');
                } finally {
                    cityInput.disabled = false;
                }
            }
        });
    }

    // Quick City Buttons
    document.querySelectorAll('.quick-city-chip').forEach(btn => {
        btn.addEventListener('click', async () => {
            const cityName = btn.dataset.city;
            if (!cityName) return;

            try {
                const res = await apiRequest(`/location/geocode?q=${encodeURIComponent(cityName)}`);
                if (res?.location) {
                    const loc = res.location;
                    if (typeof setUserLocation === 'function') {
                        setUserLocation(loc.latitude, loc.longitude, loc.city, loc.display_name);
                    }
                    if (label) label.textContent = loc.city;
                }
            } catch (e) {
                if (label) label.textContent = cityName;
                localStorage.setItem('CraveSpotLocation', cityName);
            }

            if (dropdown) dropdown.hidden = true;
            if (typeof showToast === 'function') showToast(`Selected city: ${cityName}`, 'info');
        });
    });
}

// ---------------------------------------------------------------------
// 3. "Surprise Me" Interactive Modal
// ---------------------------------------------------------------------
function initSurpriseMe() {
    const triggerButtons = document.querySelectorAll('.surprise-me-trigger, #surpriseMeBtn');
    if (!triggerButtons.length) return;

    let modal = document.getElementById('surpriseModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'surpriseModal';
        modal.className = 'cravespot-modal';
        modal.hidden = true;
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content animate-pop">
                <button class="modal-close" id="closeSurpriseModal" aria-label="Close">&times;</button>
                <div class="surprise-card" id="surpriseCardContent">
                    <div class="surprise-loader">
                        <span class="spinner"></span>
                        <p>Finding a delicious surprise for you...</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.hidden = true);
        modal.querySelector('#closeSurpriseModal').addEventListener('click', () => modal.hidden = true);
    }

    triggerButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            modal.hidden = false;
            const cardContent = document.getElementById('surpriseCardContent');
            cardContent.innerHTML = `
                <div class="surprise-loader">
                    <span class="spinner"></span>
                    <p>Cooking up your craving surprise...</p>
                </div>
            `;

            try {
                const loc = (typeof getUserLocation === 'function') ? getUserLocation() : { lat: 30.7333, lng: 76.7794 };
                const res = await apiRequest(`/cravings/surprise-me?lat=${loc.lat}&lng=${loc.lng}`);
                
                if (res?.surprise) {
                    const item = res.surprise;
                    const isPagesDir = window.location.pathname.includes('/pages/');
                    const detailsUrl = (isPagesDir ? 'dish-details.html' : 'pages/dish-details.html') + 
                        `?dish=${encodeURIComponent(item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}&name=${encodeURIComponent(item.name)}&price=${item.price}&restaurant=${encodeURIComponent(item.restaurant_name || '')}`;

                    cardContent.innerHTML = `
                        <div class="surprise-badge">🎲 CraveSpot Surprise</div>
                        <img src="${item.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'}" alt="${item.name}" class="surprise-img" />
                        <div class="surprise-details">
                            <h3 class="surprise-title">${item.name}</h3>
                            <p class="surprise-restaurant">By <strong>${item.restaurant_name || 'Top Local Vendor'}</strong></p>
                            <p class="surprise-msg">"${item.surprise_message || 'Chef special recommendation for your cravings!'}"</p>
                            <div class="surprise-meta">
                                <span class="surprise-price">₹${item.price}</span>
                                <span class="surprise-rating">★ ${item.rating || 4.5}</span>
                            </div>
                            <div class="surprise-actions">
                                <a href="${detailsUrl}" class="primary-btn">View Dish Details</a>
                                <button class="secondary-btn" id="rollAgainBtn">Roll Another 🎲</button>
                            </div>
                        </div>
                    `;

                    document.getElementById('rollAgainBtn')?.addEventListener('click', () => {
                        btn.click();
                    });
                }
            } catch (err) {
                cardContent.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p style="color: #EF4444; font-weight: 600;">Could not roll surprise right now.</p>
                        <button class="primary-btn" onclick="document.getElementById('surpriseModal').hidden = true">Close</button>
                    </div>
                `;
            }
        });
    });
}

// ---------------------------------------------------------------------
// 4. Auth Navigation & User State (Profile, Saved Wishlist, Logout)
// ---------------------------------------------------------------------
function syncAuthState() {
    const isPagesDir = window.location.pathname.includes('/pages/');
    const loginPath = isPagesDir ? 'login.html' : 'pages/login.html';
    const registerPath = isPagesDir ? 'register.html' : 'pages/register.html';
    const profilePath = isPagesDir ? 'profile.html' : 'pages/profile.html';
    const favoritesPath = isPagesDir ? 'favorites.html' : 'pages/favorites.html';

    const token = localStorage.getItem('cravespot_token');
    const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    const isLoggedIn = Boolean(token || localStorage.getItem('CraveSpotLoggedIn') === 'true');

    document.querySelectorAll('.auth-buttons, #authArea').forEach(container => {
        if (isLoggedIn) {
            const displayName = user?.name ? user.name.split(' ')[0] : 'Foodie';
            container.innerHTML = `
                <div class="user-nav-dropdown">
                    <a href="${favoritesPath}" class="nav-fav-link" title="My Wishlist">
                        <span class="fav-heart">❤️</span>
                        <span class="nav-fav-label">Saved</span>
                    </a>
                    <a href="${profilePath}" class="user-profile-pill">
                        <span class="user-avatar-icon">👤</span>
                        <span class="user-name">Hi, ${displayName}</span>
                    </a>
                    <button class="logout-btn" type="button" title="Sign Out">Logout</button>
                </div>
            `;

            container.querySelector('.logout-btn')?.addEventListener('click', () => {
                if (typeof logoutCurrentUser === 'function') {
                    logoutCurrentUser();
                } else {
                    localStorage.clear();
                    window.location.reload();
                }
            });
        } else {
            container.innerHTML = `
                <a href="${loginPath}" class="login-btn">Login</a>
                <a href="${registerPath}" class="signup-btn">Sign Up</a>
            `;
        }
    });
}

// ---------------------------------------------------------------------
// 5. Global Image Fallback Handler
// ---------------------------------------------------------------------
function initImageFallbacks() {
    const fallbackSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23FFF5F0"/%3E%3Ccircle cx="300" cy="200" r="110" fill="%23FFE3D6"/%3E%3Ctext x="50%25" y="48%25" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="%23FF5200" text-anchor="middle" dominant-baseline="middle"%3ECraveSpot%3C/text%3E%3Ctext x="50%25" y="58%25" font-family="system-ui, sans-serif" font-size="16" fill="%23888" text-anchor="middle" dominant-baseline="middle"%3E%F0%9F%8D%B4 Food Discovery%3C/text%3E%3C/svg%3E';

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.fallbackApplied) {
                this.dataset.fallbackApplied = 'true';
                this.src = fallbackSvg;
            }
        });
        if (img.complete && img.naturalWidth === 0) {
            img.src = fallbackSvg;
        }
    });
}

// ---------------------------------------------------------------------
// 6. Application Initializer
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initLocationSystem();
    initSurpriseMe();
    syncAuthState();
    initImageFallbacks();

    // Quick craving category pill clicks
    document.querySelectorAll('.craving-chip, .quick-craving-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const craving = pill.dataset.craving || pill.textContent.trim();
            performCravingSearch(craving);
        });
    });

    window.addEventListener('cravespot:authChanged', syncAuthState);
});

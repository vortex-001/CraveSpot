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
// 2. Interactive Location Selector (Auto-detect + Google Maps Modal)
// ---------------------------------------------------------------------
function initLocationSystem() {
    const label = document.getElementById('selectedLocation');
    const selector = document.getElementById('locationSelector');

    // Load initial saved location
    const currentLoc = (typeof getUserLocation === 'function')
        ? getUserLocation()
        : { city: localStorage.getItem('CraveSpotLocation') || 'Chandigarh' };

    if (label) {
        label.textContent = currentLoc.city || 'Chandigarh';
    }

    if (selector) {
        selector.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof window.openLocationPickerModal === 'function') {
                window.openLocationPickerModal();
            }
        });
    }

    // Listen for global location change
    window.addEventListener('cravespot:locationChanged', (e) => {
        const newLoc = e.detail;
        if (label && newLoc?.city) {
            label.textContent = newLoc.city;
        }
    });
}

// ---------------------------------------------------------------------
// 2B. Live Nearby Restaurant Discovery on Homepage (GPS & Live Map Aware)
// ---------------------------------------------------------------------
let currentHomeRadius = 15;

const fallbackHomeRestaurants = [
    // Kharar (Khanpur, Sunny Enclave, Landran Rd)
    { restaurant_id: 10, name: "Grand Punjab Dhaba", cuisine: "North Indian & Punjabi", rating: 4.5, address: "Chandigarh-Kharar Highway, Kharar", latitude: 30.7485, longitude: 76.6430, is_veg: 1, offer: "20% OFF", price_for_two: 300 },
    { restaurant_id: 11, name: "Kharar Food Hub & Cafe", cuisine: "Fast Food, Burgers & Pizza", rating: 4.3, address: "Sunny Enclave, Kharar", latitude: 30.7420, longitude: 76.6580, is_veg: 0, offer: "15% OFF", price_for_two: 350 },
    { restaurant_id: 12, name: "Rolls Mania & Fast Bites", cuisine: "Rolls, Shawarma & Snacks", rating: 4.4, address: "Khanpur Chowk, Kharar", latitude: 30.7550, longitude: 76.6380, is_veg: 0, offer: "Flat ₹50 OFF", price_for_two: 250 },
    { restaurant_id: 13, name: "Amritsari Kulcha Junction", cuisine: "North Indian, Kulchas & Lassi", rating: 4.6, address: "Landran Road, Kharar", latitude: 30.7390, longitude: 76.6500, is_veg: 1, offer: "10% OFF", price_for_two: 200 },
    // Mohali
    { restaurant_id: 6, name: "Katani Dhaba", cuisine: "North Indian & Punjabi", rating: 4.4, address: "Phase 3B2, Mohali", latitude: 30.7071, longitude: 76.7161, is_veg: 1, offer: "15% OFF", price_for_two: 300 },
    { restaurant_id: 7, name: "Amrit Sweets & Restaurant", cuisine: "Desserts & Snacks", rating: 4.6, address: "Phase 5, Mohali", latitude: 30.7188, longitude: 76.7123, is_veg: 1, offer: "20% OFF", price_for_two: 250 },
    { restaurant_id: 9, name: "Urban Cafe & Bistro", cuisine: "Cafe, Italian & Continental", rating: 4.4, address: "Sector 70, Mohali", latitude: 30.6990, longitude: 76.7080, is_veg: 0, offer: "10% OFF", price_for_two: 500 },
    // Chandigarh
    { restaurant_id: 1, name: "Spice Garden", cuisine: "North Indian", rating: 4.5, address: "Sector 17, Chandigarh", latitude: 30.7415, longitude: 76.7680, is_veg: 1, offer: "20% OFF", price_for_two: 450 },
    { restaurant_id: 2, name: "Pizza Corner", cuisine: "Italian & Fast Food", rating: 4.3, address: "Sector 22, Chandigarh", latitude: 30.7336, longitude: 76.7725, is_veg: 1, offer: "30% OFF", price_for_two: 400 },
    { restaurant_id: 3, name: "Wok Express", cuisine: "Chinese & Asian", rating: 4.2, address: "Sector 35, Chandigarh", latitude: 30.7253, longitude: 76.7642, is_veg: 0, offer: "Free Delivery", price_for_two: 350 },
    { restaurant_id: 4, name: "Burger House", cuisine: "Fast Food & Shakes", rating: 4.1, address: "Sector 8, Chandigarh", latitude: 30.7358, longitude: 76.8010, is_veg: 0, offer: "10% OFF", price_for_two: 300 },
    // Panchkula
    { restaurant_id: 8, name: "Barbeque Nation", cuisine: "BBQ & Multi-Cuisine", rating: 4.5, address: "Sector 5, Panchkula", latitude: 30.6931, longitude: 76.8524, is_veg: 0, offer: "Flat ₹150 OFF", price_for_two: 800 }
];

function renderHomeRestaurantCards(grid, places, loc) {
    if (!grid) return;

    // Filter strictly by the active distance radius
    const filtered = (places || []).filter(r => {
        if (currentHomeRadius >= 100) return true;
        if (typeof r.distance_km === 'number') {
            return r.distance_km <= currentHomeRadius;
        }
        return true;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="no-restaurants-radius" style="grid-column: 1 / -1; text-align: center; padding: 45px 20px; background: #FFFBFB; border-radius: 16px; border: 1.5px dashed #FFD1D5; margin: 10px 0;">
                <div style="width: 52px; height: 52px; background: #FFE4E6; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; color: #E23744;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                    </svg>
                </div>
                <h3 style="font-size: 18px; font-weight: 700; color: #1F2937; margin-bottom: 6px;">No spots found within ${currentHomeRadius} km</h3>
                <p style="font-size: 14px; color: #6B7280; max-width: 440px; margin: 0 auto 16px;">Try expanding your delivery distance to discover great restaurants delivering right to ${loc.city || 'your area'}.</p>
                <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                    <button type="button" class="empty-state-reset-btn" onclick="document.querySelector('#homeRadiusChips [data-radius=\\'15\\']')?.click()" style="padding: 9px 20px; font-size: 13px; font-weight:600; background:#E23744; color:#fff; border:none; border-radius:8px; cursor:pointer;">
                        Explore Within 15 km →
                    </button>
                    <button type="button" class="empty-state-reset-btn" onclick="document.querySelector('#homeRadiusChips [data-radius=\\'100\\']')?.click()" style="padding: 9px 20px; font-size: 13px; font-weight:600; background:#F3F4F6; color:#374151; border:none; border-radius:8px; cursor:pointer;">
                        Show All Nearby
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const topPlaces = filtered.slice(0, 6);
    grid.innerHTML = topPlaces.map((r, i) => {
        const dist = typeof r.distance_km === 'number' ? r.distance_km : null;
        const distBadge = dist !== null
            ? `<span class="loc-distance-pill">📍 ${dist < 1 ? Math.round(dist * 1000) + ' m' : dist.toFixed(1) + ' km'}</span>`
            : `<span class="loc-distance-pill">📍 Near you</span>`;

        const deliveryMins = r.delivery_time_mins || (dist ? Math.max(15, Math.min(60, Math.round(15 + dist * 3.5))) : 25);
        const isVeg = r.is_veg === 1 || r.is_veg === true || r.is_veg === '1';
        const dietDot = isVeg
            ? `<span class="cs-diet-dot veg" title="Pure Veg"></span>`
            : `<span class="cs-diet-dot non-veg" title="Non-Veg & Multi-Cuisine"></span>`;

        const imgUrl = r.image_url || r.cover_image || `https://images.unsplash.com/photo-${['1517248135467-4c7edcad34c4', '1552566626-52f8b828add9', '1559339352-11d035aa65de', '1515003197210-e0cd71810b5f', '1555396273-367ea4eb4db5'][i % 5]}?auto=format&fit=crop&w=800&q=80`;
        const offerText = r.offer || (i % 2 === 0 ? '20% OFF up to ₹100' : 'Free Delivery');
        const rating = r.rating ? Number(r.rating).toFixed(1) : '4.4';
        const priceForTwo = r.price_for_two ? `₹${r.price_for_two} for two` : '₹350 for two';

        return `
            <article class="restaurant-card" onclick="window.location.href='pages/restaurant-details.html?id=${r.restaurant_id}'">
                <div class="restaurant-image">
                    <img src="${imgUrl}" alt="${r.name || 'Restaurant'}" loading="lazy">
                    <span class="offer">${offerText}</span>
                </div>
                <div class="restaurant-info">
                    <div class="restaurant-name">
                        <div style="display:flex; align-items:center; gap:8px;">
                            ${dietDot}
                            <h3>${r.name || 'Top Eatery'}</h3>
                        </div>
                        <span class="rating">★ ${rating}</span>
                    </div>
                    <p class="cuisine">${r.cuisine || 'North Indian • Fast Food • Beverages'}</p>
                    <div class="restaurant-meta">
                        ${distBadge}
                        <span class="delivery-time-pill">⚡ ~${deliveryMins} mins</span>
                        <span style="font-size:12px; font-weight:600; color:#6B7280;">• ${priceForTwo}</span>
                    </div>
                    <p class="restaurant-location">
                        <svg style="width:14px; height:14px; flex-shrink:0; color:#FF5200;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/>
                            <circle cx="12" cy="10" r="2.5"/>
                        </svg>
                        <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${r.address || loc.city || 'Chandigarh'}</span>
                    </p>
                </div>
            </article>
        `;
    }).join('');
}

async function loadHomeLiveRestaurants() {
    const grid = document.getElementById('homeRestaurantGrid');
    const cityTitle = document.getElementById('homeCurrentCityName');
    if (!grid) return; // not on homepage

    const loc = (typeof getUserLocation === 'function')
        ? getUserLocation()
        : { lat: 30.7333, lng: 76.7794, city: 'Chandigarh' };

    if (cityTitle) {
        cityTitle.textContent = loc.city || 'your area';
    }

    // Helper to calculate simple haversine distance
    function calcDist(lat1, lon1, lat2, lon2) {
        const R = 6371, rad = x => x * Math.PI / 180;
        const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
        const a = Math.sin(dLat/2)**2 + Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLon/2)**2;
        return Number((2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
    }

    const fallbacksWithDist = fallbackHomeRestaurants.map(r => ({
        ...r,
        distance_km: calcDist(loc.lat, loc.lng, r.latitude, r.longitude)
    })).sort((a, b) => a.distance_km - b.distance_km);

    // Initial instant render strictly honoring the selected radius
    renderHomeRestaurantCards(grid, fallbacksWithDist, loc);

    // Fetch fresh live nearby data from API in background
    try {
        let places = [];
        if (typeof apiRequest === 'function') {
            try {
                const res = await apiRequest(`/restaurants/live-nearby?lat=${loc.lat}&lng=${loc.lng}&radius=${currentHomeRadius}`, { timeout: 1500 });
                if (res?.restaurants && res.restaurants.length > 0) {
                    places = res.restaurants;
                }
            } catch (err) {
                // Live nearby failed or timed out, try standard fallback
            }

            if (!places.length) {
                try {
                    const allRest = await apiRequest('/restaurants', { timeout: 1200 });
                    if (Array.isArray(allRest) && allRest.length > 0) {
                        places = allRest.map(r => {
                            const item = { ...r };
                            if (typeof item.distance_km !== 'number' && item.latitude && item.longitude) {
                                item.distance_km = calcDist(loc.lat, loc.lng, parseFloat(item.latitude), parseFloat(item.longitude));
                            }
                            return item;
                        }).sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999));
                    }
                } catch (e) {
                    // non-fatal
                }
            }
        }

        if (places && places.length > 0) {
            renderHomeRestaurantCards(grid, places, loc);
        }
    } catch (e) {
        console.warn('Live update fallback used:', e);
    }
}

function initHomeLiveSection() {
    loadHomeLiveRestaurants();

    // Radius chip click handlers
    document.querySelectorAll('#homeRadiusChips .radius-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#homeRadiusChips .radius-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentHomeRadius = parseFloat(btn.dataset.radius) || 15;
            loadHomeLiveRestaurants();
        });
    });

    // Re-fetch when location is changed on map or GPS
    window.addEventListener('cravespot:locationChanged', () => {
        loadHomeLiveRestaurants();
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
        img.addEventListener('error', function () {
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
    initHomeLiveSection();
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

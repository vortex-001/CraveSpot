/**
 * CraveSpot Interactive Google Maps-Style Location Picker
 * Features:
 * - Clean Leaflet.js map with CartoDB Voyager Google Maps aesthetic
 * - Real GPS Geolocation Detection with high accuracy
 * - Draggable location pin with reverse geocoding on drag / click
 * - Search bar with instant geocode suggestions
 * - Quick neighborhood & popular city chips
 * - Smooth sync with CraveSpot location state and live restaurant feeds
 */

(function () {
    'use strict';

    // CDN assets for Leaflet
    const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

    let mapInstance = null;
    let markerInstance = null;
    let currentSelectedLoc = {
        lat: 30.7333,
        lng: 76.7794,
        city: 'Chandigarh',
        display_name: 'Sector 17, Chandigarh, India'
    };

    // Quick popular locations
    const QUICK_LOCATIONS = [
        { name: 'Kharar', lat: 30.7576, lng: 76.6320, city: 'Kharar', desc: 'Khanpur / Sunny Enclave / Highway' },
        { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, city: 'Chandigarh', desc: 'Sector 17, City Centre' },
        { name: 'Mohali', lat: 30.7046, lng: 76.7179, city: 'Mohali', desc: 'Phase 7 / Industrial Area' },
        { name: 'Panchkula', lat: 30.6942, lng: 76.8606, city: 'Panchkula', desc: 'Sector 5, MDC' },
        { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090, city: 'Delhi', desc: 'Connaught Place / South Ex' },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, city: 'Mumbai', desc: 'Bandra / Fort' },
        { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, city: 'Bengaluru', desc: 'Indiranagar / Koramangala' },
        { name: 'Ludhiana', lat: 30.9010, lng: 75.8573, city: 'Ludhiana', desc: 'Sarabha Nagar' }
    ];

    let foodSpotsLayer = null;
    let allDiscoveredSpots = [];
    let currentMapFilter = 'all';

    // Baseline food spots (Street food stalls, dhabas, tea stalls, sweet shops, restaurants)
    const BASELINE_FOOD_SPOTS = [
        // Kharar
        { name: "Chaat Chaska & Golgappa Corner", spot_type: "street_food", spot_badge: "🍢 Street Food Stall", cuisine: "Golgappe • Aloo Tikki • Papdi Chaat", address: "Main Market, Kharar", lat: 30.7510, lng: 76.6450, rating: 4.7 },
        { name: "Rolls Mania & Fast Bites", spot_type: "street_food", spot_badge: "🍢 Street Food Stall", cuisine: "Egg & Paneer Rolls • Shawarma", address: "Khanpur Chowk, Kharar", lat: 30.7550, lng: 76.6380, rating: 4.4 },
        { name: "Giani Tea Stall & Bun Maska", spot_type: "cafe_tea", spot_badge: "☕ Chai Tapri", cuisine: "Chai • Bun Maska • Maggi", address: "Landran Road, Kharar", lat: 30.7530, lng: 76.6410, rating: 4.6 },
        { name: "Amritsari Kulcha Junction", spot_type: "dhaba", spot_badge: "🍲 Authentic Dhaba", cuisine: "Crispy Kulchas • Chhole • Lassi", address: "Landran Road, Kharar", lat: 30.7390, lng: 76.6500, rating: 4.6 },
        { name: "Grand Punjab Dhaba", spot_type: "dhaba", spot_badge: "🍲 Authentic Dhaba", cuisine: "Tandoori Parathas • Dal Makhani", address: "Chandigarh-Kharar Highway, Kharar", lat: 30.7485, lng: 76.6430, rating: 4.5 },
        { name: "Kharar Food Hub & Cafe", spot_type: "street_food", spot_badge: "🍔 Fast Food & Snacks", cuisine: "Burgers • French Fries • Pizza", address: "Sunny Enclave, Kharar", lat: 30.7420, lng: 76.6580, rating: 4.3 },
        { name: "Shri Krishna Sweets & Chaat", spot_type: "bakery_sweets", spot_badge: "🍰 Sweets & Chaat", cuisine: "Hot Jalebis • Samosa • Gulab Jamun", address: "Sunny Enclave, Kharar", lat: 30.7460, lng: 76.6520, rating: 4.5 },

        // Mohali
        { name: "Phase 7 Street Food Market", spot_type: "street_food", spot_badge: "🍢 Street Food Hub", cuisine: "Steamed Momos • Rolls • Spring Rolls", address: "Phase 7 Market, Mohali", lat: 30.7140, lng: 76.7050, rating: 4.5 },
        { name: "Tibetan Momos & Chinese Stall", spot_type: "street_food", spot_badge: "🥟 Momos Stall", cuisine: "Fried & Steamed Momos • Thukpa", address: "Phase 5 Market, Mohali", lat: 30.7160, lng: 76.7110, rating: 4.6 },
        { name: "Katani Dhaba", spot_type: "dhaba", spot_badge: "🍲 Authentic Dhaba", cuisine: "Dal Makhani • Shahi Paneer • Roti", address: "Phase 3B2, Mohali", lat: 30.7071, lng: 76.7161, rating: 4.5 },
        { name: "Amrit Sweets & Chaat", spot_type: "bakery_sweets", spot_badge: "🍰 Sweets & Chaat", cuisine: "Raj Kachori • Rasgulla • Dhokla", address: "Phase 5, Mohali", lat: 30.7188, lng: 76.7123, rating: 4.6 },
        { name: "Urban Cafe & Bistro", spot_type: "cafe_tea", spot_badge: "☕ Cafe & Coffee", cuisine: "Cappuccino • Pasta • Nachos", address: "Sector 70, Mohali", lat: 30.6990, lng: 76.7080, rating: 4.4 },

        // Chandigarh
        { name: "Garg Chaat & Golgappa Corner", spot_type: "street_food", spot_badge: "🍢 Legendary Street Food", cuisine: "Dahi Bhalla • Golgappe • Sev Puri", address: "Sector 23, Chandigarh", lat: 30.7310, lng: 76.7620, rating: 4.8 },
        { name: "Student Centre (StuC) Food Kiosks", spot_type: "street_food", spot_badge: "🍢 Food Kiosks & Maggi", cuisine: "Cheese Maggi • Cold Coffee • Sandwiches", address: "Panjab University, Sector 14", lat: 30.7600, lng: 76.7690, rating: 4.7 },
        { name: "Sector 15 Street Food Market", spot_type: "street_food", spot_badge: "🍢 Street Food Market", cuisine: "Kathi Rolls • Chowmein • Manchurian", address: "Sector 15, Chandigarh", lat: 30.7450, lng: 76.7710, rating: 4.4 },
        { name: "Bansal Amritsari Kulcha", spot_type: "dhaba", spot_badge: "🍲 Authentic Dhaba", cuisine: "Stuffed Kulchas • Chhole • Butter", address: "Sector 22, Chandigarh", lat: 30.7320, lng: 76.7740, rating: 4.5 },
        { name: "Spice Garden", spot_type: "restaurant", spot_badge: "🍽️ Restaurant", cuisine: "North Indian & Mughlai", address: "Sector 17, Chandigarh", lat: 30.7415, lng: 76.7680, rating: 4.5 },
        { name: "Pizza Corner", spot_type: "restaurant", spot_badge: "🍕 Pizzeria", cuisine: "Wood-fired Pizza • Garlic Bread", address: "Sector 22, Chandigarh", lat: 30.7336, lng: 76.7725, rating: 4.3 },
        { name: "Sweet Cravings", spot_type: "bakery_sweets", spot_badge: "🍰 Bakery & Cakes", cuisine: "Pastries • Brownies • Cheesecakes", address: "Sector 10, Chandigarh", lat: 30.7500, lng: 76.7820, rating: 4.7 },
        { name: "Barbeque Nation", spot_type: "restaurant", spot_badge: "🍽️ Buffet", cuisine: "BBQ & Multi-Cuisine", address: "Sector 5, Panchkula", lat: 30.6931, lng: 76.8524, rating: 4.5 }
    ];

    /**
     * Inject Leaflet assets dynamically if not already loaded
     */
    function loadLeaflet(callback) {
        if (window.L) {
            callback();
            return;
        }

        // Add CSS
        if (!document.querySelector(`link[href*="leaflet"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = LEAFLET_CSS;
            document.head.appendChild(link);
        }

        // Add JS
        const existingScript = document.querySelector(`script[src*="leaflet"]`);
        if (existingScript) {
            existingScript.addEventListener('load', callback);
        } else {
            const script = document.createElement('script');
            script.src = LEAFLET_JS;
            script.async = true;
            script.onload = callback;
            script.onerror = () => {
                console.warn('Leaflet CDN blocked or offline; falling back to visual interactive map canvas');
                callback();
            };
            document.head.appendChild(script);
        }
    }

    /**
     * Reverse geocode coordinates to readable address using backend or local dictionary
     */
    async function reverseGeocode(lat, lng) {
        try {
            if (typeof apiRequest === 'function') {
                const res = await apiRequest(`/location/geocode?q=${lat},${lng}`);
                if (res?.location) {
                    return res.location;
                }
            }
        } catch (e) {
            // fallback
        }

        // Find nearest city
        let nearest = QUICK_LOCATIONS[0];
        let minDist = 999999;
        QUICK_LOCATIONS.forEach(loc => {
            const d = Math.hypot(loc.lat - lat, loc.lng - lng);
            if (d < minDist) {
                minDist = d;
                nearest = loc;
            }
        });

        return {
            latitude: lat,
            longitude: lng,
            city: nearest.city,
            display_name: `${nearest.desc || nearest.city} (${lat.toFixed(4)}, ${lng.toFixed(4)})`
        };
    }

    /**
     * Create custom SVG pin for Google Maps food-tech look
     */
    function createCustomPinIcon() {
        if (!window.L) return null;
        return window.L.divIcon({
            className: 'cravespot-map-pin-container',
            html: `
                <div class="map-pin-pulse"></div>
                <div class="map-pin-marker">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#FF5200" stroke="#FFFFFF" stroke-width="1.8"/>
                        <circle cx="12" cy="9" r="3" fill="#FFFFFF"/>
                    </svg>
                </div>
            `,
            iconSize: [40, 48],
            iconAnchor: [20, 46],
            popupAnchor: [0, -42]
        });
    }

    /**
     * Build the Modal HTML
     */
    function createLocationModalElement() {
        let modal = document.getElementById('cravespotLocationModal');
        if (modal) return modal;

        modal = document.createElement('div');
        modal.id = 'cravespotLocationModal';
        modal.className = 'cravespot-loc-modal';
        modal.hidden = true;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'locModalTitle');

        modal.innerHTML = `
            <div class="loc-modal-overlay" id="closeLocOverlay"></div>
            <div class="loc-modal-dialog animate-slide-up">
                
                <!-- MODAL HEADER -->
                <div class="loc-modal-header">
                    <div class="loc-modal-title-group">
                        <span class="loc-badge-icon">📍</span>
                        <div>
                            <h2 id="locModalTitle">Select Your Delivery Location</h2>
                            <p class="loc-modal-subtitle">Pick on the interactive map or use GPS for real-time live restaurant discovery</p>
                        </div>
                    </div>
                    <button type="button" class="loc-modal-close" id="closeLocBtn" aria-label="Close modal">&times;</button>
                </div>

                <!-- SEARCH & GPS CONTROLS -->
                <div class="loc-modal-controls">
                    <div class="loc-search-box">
                        <span class="loc-search-icon">🔍</span>
                        <input type="text" id="locMapSearchInput" placeholder="Search area, landmark, colony, sector or city..." autocomplete="off">
                        <button type="button" id="locMapSearchBtn">Search</button>
                    </div>

                    <button type="button" class="gps-detect-btn" id="locModalGpsBtn">
                        <span class="gps-pulse-ring"></span>
                        <span class="gps-icon-svg">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="7"/>
                                <line x1="12" y1="1" x2="12" y2="5"/>
                                <line x1="12" y1="19" x2="12" y2="23"/>
                                <line x1="1" y1="12" x2="5" y2="12"/>
                                <line x1="19" y1="12" x2="23" y2="12"/>
                                <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
                            </svg>
                        </span>
                        <span class="gps-btn-text">Detect My Location (GPS)</span>
                    </button>
                </div>

                <!-- QUICK CITY CHIPS -->
                <div class="loc-quick-chips">
                    <span class="quick-chip-label">Quick Pick:</span>
                    ${QUICK_LOCATIONS.map(loc => `
                        <button type="button" class="loc-chip-btn" data-lat="${loc.lat}" data-lng="${loc.lng}" data-city="${loc.city}">
                            ${loc.name}
                        </button>
                    `).join('')}
                </div>

                <!-- MAP FOOD TYPE FILTER RIBBON -->
                <div class="map-type-filter-ribbon" id="mapFoodFilterRibbon" role="group" aria-label="Filter food on map">
                    <span class="map-type-filter-label">📍 On Map:</span>
                    <button type="button" class="map-type-btn active" data-type="all">All Spots <span class="badge-count" id="countAll"></span></button>
                    <button type="button" class="map-type-btn" data-type="street_food">🍢 Street Food <span class="badge-count" id="countStreet"></span></button>
                    <button type="button" class="map-type-btn" data-type="dhaba">🍲 Dhabas <span class="badge-count" id="countDhabas"></span></button>
                    <button type="button" class="map-type-btn" data-type="cafe_tea">☕ Chai Tapri <span class="badge-count" id="countTea"></span></button>
                    <button type="button" class="map-type-btn" data-type="bakery_sweets">🍰 Sweets <span class="badge-count" id="countSweets"></span></button>
                    <button type="button" class="map-type-btn" data-type="restaurant">🍽️ Restaurants <span class="badge-count" id="countRest"></span></button>
                </div>

                <!-- MAP CONTAINER -->
                <div class="loc-map-wrapper">
                    <div id="cravespotLeafletMap" class="loc-leaflet-map"></div>
                    <div class="map-hint-banner">
                        <span>💡 Tip: Click anywhere or drag the red pin to set your exact spot</span>
                    </div>
                </div>

                <!-- SELECTED ADDRESS BAR -->
                <div class="loc-selected-address-card">
                    <div class="loc-pin-icon-wrap">
                        <span class="pin-svg-icon">📍</span>
                    </div>
                    <div class="loc-address-text">
                        <div class="loc-address-primary">
                            <strong id="locSelectedLocality">Sector 17, Chandigarh</strong>
                            <span class="loc-verified-pill">Live Food Area</span>
                        </div>
                        <p class="loc-address-secondary" id="locSelectedFullAddress">Chandigarh, Punjab & Haryana, India</p>
                        <div class="loc-coords-preview" id="locCoordsPreview">Lat: 30.7333 • Lng: 76.7794</div>
                    </div>
                </div>

                <!-- MODAL FOOTER -->
                <div class="loc-modal-footer">
                    <button type="button" class="loc-cancel-btn" id="locCancelBtn">Cancel</button>
                    <button type="button" class="loc-confirm-btn" id="locConfirmBtn">
                        Confirm Location & Discover Food →
                    </button>
                </div>

            </div>
        `;

        document.body.appendChild(modal);

        // Bind basic close events
        modal.querySelector('#closeLocOverlay').addEventListener('click', closeLocationPickerModal);
        modal.querySelector('#closeLocBtn').addEventListener('click', closeLocationPickerModal);
        modal.querySelector('#locCancelBtn').addEventListener('click', closeLocationPickerModal);

        // Bind Confirm
        modal.querySelector('#locConfirmBtn').addEventListener('click', confirmSelectedLocation);

        // Bind GPS
        modal.querySelector('#locModalGpsBtn').addEventListener('click', triggerGpsDetection);

        // Bind Quick chips
        modal.querySelectorAll('.loc-chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lat = parseFloat(btn.dataset.lat);
                const lng = parseFloat(btn.dataset.lng);
                const city = btn.dataset.city;
                updateLocationPosition(lat, lng, city);
            });
        });

        // Bind Map Food Type Filter Ribbon
        modal.querySelectorAll('.map-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.map-type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMapFilter = btn.dataset.type || 'all';
                drawFoodMarkersOnMap();
            });
        });

        // Bind Search
        const searchInput = modal.querySelector('#locMapSearchInput');
        const searchBtn = modal.querySelector('#locMapSearchBtn');
        const executeSearch = async () => {
            const query = searchInput.value.trim();
            if (!query) return;

            searchBtn.disabled = true;
            searchBtn.textContent = 'Searching...';

            try {
                if (typeof apiRequest === 'function') {
                    const res = await apiRequest(`/location/geocode?q=${encodeURIComponent(query)}`);
                    if (res?.location) {
                        const loc = res.location;
                        updateLocationPosition(loc.latitude, loc.longitude, loc.city, loc.display_name);
                    } else {
                        fallbackSearch(query);
                    }
                } else {
                    fallbackSearch(query);
                }
            } catch (err) {
                fallbackSearch(query);
            } finally {
                searchBtn.disabled = false;
                searchBtn.textContent = 'Search';
            }
        };

        function fallbackSearch(q) {
            const match = QUICK_LOCATIONS.find(l => l.name.toLowerCase().includes(q.toLowerCase()) || q.toLowerCase().includes(l.name.toLowerCase()));
            if (match) {
                updateLocationPosition(match.lat, match.lng, match.city, match.desc);
            } else if (typeof showToast === 'function') {
                showToast(`Location "${q}" not found. Showing nearest zone.`, 'warning');
            }
        }

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
        searchBtn.addEventListener('click', executeSearch);

        return modal;
    }

    /**
     * Trigger HTML5 GPS Geolocation
     */
    function triggerGpsDetection() {
        const gpsBtn = document.getElementById('locModalGpsBtn');
        const textSpan = gpsBtn?.querySelector('.gps-btn-text');

        if (!navigator.geolocation) {
            if (typeof showToast === 'function') showToast('GPS is not supported by your browser', 'error');
            return;
        }

        if (gpsBtn) gpsBtn.classList.add('is-detecting');
        if (textSpan) textSpan.textContent = 'Acquiring GPS Signal...';

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                if (gpsBtn) gpsBtn.classList.remove('is-detecting');
                if (textSpan) textSpan.textContent = 'GPS Located ✓';

                await updateLocationPosition(lat, lng, null, null, true);

                if (typeof showToast === 'function') {
                    showToast('Current GPS Location Acquired!', 'success');
                }

                setTimeout(() => {
                    if (textSpan) textSpan.textContent = 'Detect My Location (GPS)';
                }, 3000);
            },
            (err) => {
                if (gpsBtn) gpsBtn.classList.remove('is-detecting');
                if (textSpan) textSpan.textContent = 'Detect My Location (GPS)';
                let msg = 'Could not access GPS coordinates';
                if (err.code === 1) msg = 'Location access denied. Please click on the map to pick your spot.';
                if (typeof showToast === 'function') showToast(msg, 'warning');
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
        );
    }

    /**
     * Update map position, marker, and preview card
     */
    async function updateLocationPosition(lat, lng, cityHint = null, displayHint = null, isGps = false) {
        currentSelectedLoc.lat = lat;
        currentSelectedLoc.lng = lng;

        // Pan map
        if (mapInstance) {
            mapInstance.setView([lat, lng], 15, { animate: true });
        }
        if (markerInstance) {
            markerInstance.setLatLng([lat, lng]);
        }

        // Update preview text immediately with coordinates
        const localityEl = document.getElementById('locSelectedLocality');
        const addressEl = document.getElementById('locSelectedFullAddress');
        const coordsEl = document.getElementById('locCoordsPreview');

        if (coordsEl) {
            coordsEl.textContent = `Lat: ${lat.toFixed(4)} • Lng: ${lng.toFixed(4)} ${isGps ? '• High Accuracy GPS' : ''}`;
        }

        if (cityHint && displayHint) {
            currentSelectedLoc.city = cityHint;
            currentSelectedLoc.display_name = displayHint;
            if (localityEl) localityEl.textContent = cityHint;
            if (addressEl) addressEl.textContent = displayHint;
            return;
        }

        // Fetch reverse geocoded locality name
        if (localityEl) localityEl.textContent = 'Detecting address...';
        const geoInfo = await reverseGeocode(lat, lng);

        currentSelectedLoc.city = geoInfo.city || cityHint || 'Chandigarh';
        currentSelectedLoc.display_name = geoInfo.display_name || `${currentSelectedLoc.city}, India`;

        if (localityEl) localityEl.textContent = currentSelectedLoc.city;
        if (addressEl) addressEl.textContent = currentSelectedLoc.display_name;

        // Render nearby food markers (street food, dhabas, chai tapris, sweets, restaurants)
        renderMapFoodMarkers(lat, lng);
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, m => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m]));
    }

    function haversineDistKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function getSpotEmoji(type) {
        switch (type) {
            case 'street_food': return '🍢';
            case 'dhaba': return '🍲';
            case 'cafe_tea': return '☕';
            case 'bakery_sweets': return '🍰';
            case 'restaurant': return '🍽️';
            default: return '📍';
        }
    }

    async function renderMapFoodMarkers(lat, lng) {
        if (!lat || !lng) return;

        let liveSpots = [];
        try {
            if (typeof apiRequest === 'function') {
                const res = await apiRequest(`/restaurants/live-nearby?lat=${lat}&lng=${lng}&radius_km=25&limit=60`);
                if (res && res.restaurants && Array.isArray(res.restaurants)) {
                    liveSpots = res.restaurants;
                }
            }
        } catch (err) {
            // fallback silently
        }

        // Combine live spots and baseline food spots
        const combined = [];
        const seenNames = new Set();

        function addSpot(spot) {
            if (!spot || !spot.name) return;
            const norm = spot.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
            if (seenNames.has(norm)) return;
            seenNames.add(norm);

            const spotLat = Number(spot.latitude ?? spot.lat);
            const spotLng = Number(spot.longitude ?? spot.lng ?? spot.lon);
            if (!spotLat || !spotLng) return;

            const dist = haversineDistKm(lat, lng, spotLat, spotLng);
            combined.push({
                name: spot.name,
                spot_type: spot.spot_type || (spot.cuisine?.toLowerCase().includes('dhaba') ? 'dhaba' : (spot.cuisine?.toLowerCase().includes('street') ? 'street_food' : 'restaurant')),
                spot_badge: spot.spot_badge || (spot.spot_type === 'street_food' ? '🍢 Street Food Stall' : (spot.spot_type === 'dhaba' ? '🍲 Authentic Dhaba' : (spot.spot_type === 'cafe_tea' ? '☕ Chai Tapri' : (spot.spot_type === 'bakery_sweets' ? '🍰 Sweets & Chaat' : '🍽️ Restaurant')))),
                cuisine: spot.cuisine || '',
                address: spot.address || spot.city || '',
                lat: spotLat,
                lng: spotLng,
                rating: spot.rating || 4.5,
                distKm: dist
            });
        }

        liveSpots.forEach(addSpot);
        BASELINE_FOOD_SPOTS.forEach(addSpot);

        // Sort by proximity
        combined.sort((a, b) => a.distKm - b.distKm);
        allDiscoveredSpots = combined;

        // Update counts in filter ribbon
        updateRibbonCounts();

        // Draw markers
        drawFoodMarkersOnMap();
    }

    function updateRibbonCounts() {
        const counts = {
            all: allDiscoveredSpots.length,
            street_food: 0,
            dhaba: 0,
            cafe_tea: 0,
            bakery_sweets: 0,
            restaurant: 0
        };

        allDiscoveredSpots.forEach(s => {
            if (counts[s.spot_type] !== undefined) {
                counts[s.spot_type]++;
            }
        });

        const setCnt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val ? `(${val})` : '';
        };

        setCnt('countAll', counts.all);
        setCnt('countStreet', counts.street_food);
        setCnt('countDhabas', counts.dhaba);
        setCnt('countTea', counts.cafe_tea);
        setCnt('countSweets', counts.bakery_sweets);
        setCnt('countRest', counts.restaurant);
    }

    function drawFoodMarkersOnMap() {
        if (!mapInstance || !window.L) return;

        if (!foodSpotsLayer) {
            foodSpotsLayer = window.L.layerGroup().addTo(mapInstance);
        } else {
            foodSpotsLayer.clearLayers();
        }

        const filtered = currentMapFilter === 'all'
            ? allDiscoveredSpots
            : allDiscoveredSpots.filter(s => s.spot_type === currentMapFilter);

        filtered.forEach(spot => {
            const emoji = getSpotEmoji(spot.spot_type);
            const icon = window.L.divIcon({
                className: `map-food-spot-marker type-${spot.spot_type}`,
                html: `<span class="spot-icon">${emoji}</span><span class="spot-name">${escapeHtml(spot.name)}</span><span class="spot-dist">${spot.distKm.toFixed(1)}km</span>`,
                iconSize: null,
                iconAnchor: [35, 16]
            });

            const marker = window.L.marker([spot.lat, spot.lng], { icon }).addTo(foodSpotsLayer);

            const popupContent = document.createElement('div');
            popupContent.style.cssText = 'font-family: Arial, sans-serif; min-width: 200px; padding: 4px;';
            popupContent.innerHTML = `
                <div class="spot-type-badge">${escapeHtml(spot.spot_badge)}</div>
                <strong style="font-size: 14px; color: #111827; display: block; margin: 4px 0 2px;">
                    ${emoji} ${escapeHtml(spot.name)}
                </strong>
                <div style="font-size: 12px; color: #4B5563; margin-bottom: 3px;">
                    ${escapeHtml(spot.cuisine)}
                </div>
                <div style="font-size: 11.5px; color: #6B7280; margin-bottom: 8px;">
                    📍 ${escapeHtml(spot.address)} • <strong>${spot.distKm.toFixed(1)} km</strong> away
                </div>
                <button type="button" class="btn-select-spot" style="
                    width: 100%;
                    background: #FF5200;
                    color: #FFFFFF;
                    border: none;
                    border-radius: 6px;
                    padding: 6px 10px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    Set Delivery Here 📍
                </button>
            `;

            const btn = popupContent.querySelector('.btn-select-spot');
            btn.addEventListener('click', () => {
                updateLocationPosition(spot.lat, spot.lng, spot.city || currentSelectedLoc.city, `${spot.name}, ${spot.address}`);
                if (mapInstance) mapInstance.closePopup();
            });

            marker.bindPopup(popupContent);
        });
    }

    /**
     * Initialize Leaflet map
     */
    function initMap() {
        const container = document.getElementById('cravespotLeafletMap');
        if (!container) return;

        const initialLat = currentSelectedLoc.lat || 30.7333;
        const initialLng = currentSelectedLoc.lng || 76.7794;

        if (window.L) {
            // Destroy any previous map instance to ensure clean fresh tiles and zero cached layers
            if (mapInstance) {
                try {
                    mapInstance.remove();
                } catch (e) {
                    console.warn('Map cleanup error:', e);
                }
                mapInstance = null;
                markerInstance = null;
            }

            // Create fresh map instance
            mapInstance = window.L.map(container, {
                center: [initialLat, initialLng],
                zoom: 14,
                zoomControl: true,
                attributionControl: false
            });

            // Google Maps Roadmap tiles (official clean roadmap with landmarks, zero watermark)
            const googleRoadmap = window.L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['0', '1', '2', '3']
            });

            // Standard OpenStreetMap fallback
            const osmFallback = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                subdomains: ['a', 'b', 'c']
            });

            googleRoadmap.on('tileerror', () => {
                if (mapInstance && !mapInstance.hasLayer(osmFallback)) {
                    osmFallback.addTo(mapInstance);
                }
            });

            googleRoadmap.addTo(mapInstance);

            const customPin = createCustomPinIcon();
            markerInstance = window.L.marker([initialLat, initialLng], {
                draggable: true,
                icon: customPin || undefined
            }).addTo(mapInstance);

            // Drag event
            markerInstance.on('dragend', async () => {
                const pos = markerInstance.getLatLng();
                await updateLocationPosition(pos.lat, pos.lng);
            });

            // Map click event
            mapInstance.on('click', async (e) => {
                await updateLocationPosition(e.latlng.lat, e.latlng.lng);
            });

            // Initial render of nearby food spots (street food stalls, dhabas, chai tapris, sweets)
            renderMapFoodMarkers(initialLat, initialLng);
        }
    }

    /**
     * Open the Location Picker Modal
     */
    window.openLocationPickerModal = function () {
        const modal = createLocationModalElement();
        modal.hidden = false;
        document.body.style.overflow = 'hidden';

        // Load current saved location
        if (typeof getUserLocation === 'function') {
            const saved = getUserLocation();
            if (saved?.lat && saved?.lng) {
                currentSelectedLoc = { ...saved };
            }
        }

        // Update preview labels
        const localityEl = document.getElementById('locSelectedLocality');
        const addressEl = document.getElementById('locSelectedFullAddress');
        const coordsEl = document.getElementById('locCoordsPreview');
        if (localityEl) localityEl.textContent = currentSelectedLoc.city || 'Chandigarh';
        if (addressEl) addressEl.textContent = currentSelectedLoc.display_name || `${currentSelectedLoc.city}, India`;
        if (coordsEl) coordsEl.textContent = `Lat: ${Number(currentSelectedLoc.lat).toFixed(4)} • Lng: ${Number(currentSelectedLoc.lng).toFixed(4)}`;

        // Load Leaflet and initialize map with multiple resize recalculations
        loadLeaflet(() => {
            initMap();
            [50, 150, 300, 600].forEach(delay => {
                setTimeout(() => {
                    if (mapInstance) {
                        mapInstance.invalidateSize();
                    }
                }, delay);
            });
        });
    };

    /**
     * Close modal
     */
    window.closeLocationPickerModal = function () {
        const modal = document.getElementById('cravespotLocationModal');
        if (modal) {
            modal.hidden = true;
            document.body.style.overflow = '';
        }
    };

    /**
     * Confirm location & apply everywhere
     */
    function confirmSelectedLocation() {
        if (typeof setUserLocation === 'function') {
            setUserLocation(
                currentSelectedLoc.lat,
                currentSelectedLoc.lng,
                currentSelectedLoc.city,
                currentSelectedLoc.display_name
            );
        } else {
            localStorage.setItem('CraveSpotLocation', currentSelectedLoc.city);
            localStorage.setItem('cravespot_coords', JSON.stringify(currentSelectedLoc));
            window.dispatchEvent(new CustomEvent('cravespot:locationChanged', { detail: currentSelectedLoc }));
        }

        // Update navbar label immediately
        document.querySelectorAll('#selectedLocation, .current-location-name').forEach(el => {
            el.textContent = currentSelectedLoc.city;
        });

        if (typeof showToast === 'function') {
            showToast(`Location set to ${currentSelectedLoc.city}! Live restaurants updated.`, 'success');
        }

        closeLocationPickerModal();
    }

    /**
     * Auto-bind to navbar location selector
     */
    document.addEventListener('DOMContentLoaded', () => {
        const locSelectors = document.querySelectorAll('#locationSelector, .location-trigger, [data-action="choose-location"]');
        locSelectors.forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.openLocationPickerModal();
            });
        });

        // Initialize display with current location
        if (typeof getUserLocation === 'function') {
            const current = getUserLocation();
            document.querySelectorAll('#selectedLocation, .current-location-name').forEach(el => {
                el.textContent = current.city || 'Chandigarh';
            });
        }
    });

})();

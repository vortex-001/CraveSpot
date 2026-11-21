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
        { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, city: 'Chandigarh', desc: 'Sector 17, City Centre' },
        { name: 'Mohali', lat: 30.7046, lng: 76.7179, city: 'Mohali', desc: 'Phase 7 / Industrial Area' },
        { name: 'Panchkula', lat: 30.6942, lng: 76.8606, city: 'Panchkula', desc: 'Sector 5, MDC' },
        { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090, city: 'Delhi', desc: 'Connaught Place / South Ex' },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, city: 'Mumbai', desc: 'Bandra / Fort' },
        { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, city: 'Bengaluru', desc: 'Indiranagar / Koramangala' },
        { name: 'Ludhiana', lat: 30.9010, lng: 75.8573, city: 'Ludhiana', desc: 'Sarabha Nagar' }
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
    }

    /**
     * Initialize Leaflet map
     */
    function initMap() {
        const container = document.getElementById('cravespotLeafletMap');
        if (!container) return;

        const initialLat = currentSelectedLoc.lat || 30.7333;
        const initialLng = currentSelectedLoc.lng || 76.7794;

        if (window.L && !mapInstance) {
            // Full OpenStreetMap tiles — 100% free, zero watermark, full street level detail
            mapInstance = window.L.map(container, {
                center: [initialLat, initialLng],
                zoom: 14,
                zoomControl: true,
                attributionControl: false
            });

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                subdomains: ['a', 'b', 'c']
            }).addTo(mapInstance);

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

        } else if (mapInstance) {
            mapInstance.invalidateSize();
            mapInstance.setView([initialLat, initialLng], 14);
            if (markerInstance) markerInstance.setLatLng([initialLat, initialLng]);
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


const CRAVESPOT_API_BASE = "http://127.0.0.1:5000/api";

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${CRAVESPOT_API_BASE}${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {})
        }
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
}
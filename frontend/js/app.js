'use strict';

/* Shared frontend behaviour for CraveSpot pages. */

function performSearch() {
    const input = document.getElementById('heroSearch');
    const query = input ? input.value.trim() : '';
    if (!query) {
        input?.focus();
        alert('Enter a dish, restaurant or cuisine to search.');
        return;
    }
    window.location.href = 'pages/restaurants.html?search=' + encodeURIComponent(query);
}

const heroSearch = document.getElementById('heroSearch');
const heroSearchButton = document.getElementById('heroSearchButton');
heroSearchButton?.addEventListener('click', performSearch);
heroSearch?.addEventListener('keydown', event => {
    if (event.key === 'Enter') performSearch();
});

/* Shared location selector. */
(function initLocationSelector() {
    const selector = document.getElementById('locationSelector');
    const dropdown = document.getElementById('locationDropdown');
    const citySelect = document.getElementById('locationCity');
    const label = document.getElementById('selectedLocation');
    const save = document.getElementById('saveLocation');
    if (!selector || !dropdown || !citySelect || !label || !save) return;

    const saved = localStorage.getItem('CraveSpotLocation') || 'Chandigarh';
    if (![...citySelect.options].some(option => option.value === saved)) {
        citySelect.value = 'Chandigarh';
    } else citySelect.value = saved;
    label.textContent = citySelect.value;

    function setOpen(open) {
        dropdown.hidden = !open;
        selector.setAttribute('aria-expanded', String(open));
        if (open) citySelect.focus();
    }
    selector.setAttribute('aria-haspopup', 'listbox');
    selector.setAttribute('aria-expanded', 'false');
    selector.addEventListener('click', () => setOpen(dropdown.hidden));
    selector.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); setOpen(dropdown.hidden);
        }
        if (event.key === 'Escape') setOpen(false);
    });
    save.addEventListener('click', () => {
        const city = citySelect.value;
        localStorage.setItem('CraveSpotLocation', city);
        label.textContent = city;
        setOpen(false);
        document.dispatchEvent(new CustomEvent('cravespot:locationChanged', {detail:{city}}));
        const notice = document.getElementById('locationNotice');
        if (notice) notice.textContent = 'Showing options for ' + city + '.';
    });
    document.addEventListener('click', event => {
        if (!selector.contains(event.target) && !dropdown.contains(event.target)) setOpen(false);
    });
    window.addEventListener('pageshow', () => {
        const latest = localStorage.getItem('CraveSpotLocation') || 'Chandigarh';
        if ([...citySelect.options].some(option => option.value === latest)) citySelect.value = latest;
        label.textContent = citySelect.value;
    });
})();

/* Home-page quick diet filters. */
(function initHomeFoodFilters() {
    const buttons = document.querySelectorAll('.food-filter[data-filter]');
    const cards = document.querySelectorAll('.quick-dish-card[data-diet]');
    if (!buttons.length || !cards.length) return;
    buttons.forEach(button => button.addEventListener('click', () => {
        const filter = button.dataset.filter || 'all';
        buttons.forEach(btn => {
            const active = btn === button;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-pressed', String(active));
        });
        let count = 0;
        cards.forEach(card => {
            const show = filter === 'all' || card.dataset.diet === filter;
            card.hidden = !show;
            if (show) count++;
        });
        const countEl = document.getElementById('quickDishCount');
        if (countEl) countEl.textContent = count + (count === 1 ? ' dish' : ' dishes');
    }));
})();

/* Logged-in state across the site. */
(function initAuthNav() {
    const loggedIn = localStorage.getItem('CraveSpotLoggedIn') === 'true' || sessionStorage.getItem('CraveSpotLoggedIn') === 'true';
    const user = localStorage.getItem('CraveSpotUser') || sessionStorage.getItem('CraveSpotUser') || 'Food lover';
    document.querySelectorAll('.auth-buttons').forEach(area => {
        if (!loggedIn) return;
        area.innerHTML = `<span class="user-welcome" title="Signed in">Hi, ${escapeText(user.split(' ')[0])}</span><button class="logout-btn" type="button">Log out</button>`;
        area.querySelector('.logout-btn').addEventListener('click', () => {
            localStorage.removeItem('CraveSpotLoggedIn');
            localStorage.removeItem('CraveSpotUser');
            sessionStorage.removeItem('CraveSpotLoggedIn');
            sessionStorage.removeItem('CraveSpotUser');
            window.location.reload();
        });
    });
})();
function escapeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

/* Homepage card and collection navigation. */
if (heroSearch) {
    document.querySelectorAll('.restaurant-card').forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('.restaurant-name h3')?.textContent.trim();
            if (name) window.location.href = 'pages/restaurant-details.html?vendor=' + encodeURIComponent(name);
        });
    });
    const collectionTerms = ['burger','pizza','all'];
    document.querySelectorAll('.collection-card').forEach((card, index) => {
        card.setAttribute('role','link'); card.setAttribute('tabindex','0');
        const go = () => window.location.href = 'pages/dishes.html?search=' + encodeURIComponent(collectionTerms[index] || '');
        card.addEventListener('click', go);
        card.addEventListener('keydown', event => { if(event.key==='Enter'||event.key===' '){event.preventDefault();go();} });
    });
}

/* Replace failed remote food images with a quiet branded placeholder. */
document.querySelectorAll('img').forEach(image => {
    const applyFallback = function() {
        if (this.dataset.fallbackApplied) return;
        this.dataset.fallbackApplied = '1';
        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320"%3E%3Crect width="480" height="320" fill="%23f4eee8"/%3E%3Ccircle cx="240" cy="160" r="94" fill="none" stroke="%23d8c9bd" stroke-width="12"/%3E%3Ccircle cx="240" cy="160" r="67" fill="none" stroke="%23e2d4c8" stroke-width="8"/%3E%3Cpath d="M205 158c22-40 65-30 70 7-9 30-44 40-70-7Z" fill="%23e5b98f"/%3E%3C/svg%3E';
    };
    image.addEventListener('error', applyFallback);
    if (image.complete && image.naturalWidth === 0) applyFallback.call(image);
});

/* Homepage featured dish favorites */
(function initQuickFavorites(){
  document.querySelectorAll('.quick-dish-card .quick-favorite').forEach(button=>{
    const card=button.closest('.quick-dish-card');
    const name=card?.querySelector('h3')?.textContent.trim();
    if(!name) return;
    let saved=[];try{saved=JSON.parse(localStorage.getItem('CraveSpot_favorite_dishes')||'[]')}catch{}
    const on=saved.some(item=>String(item).toLowerCase()===name.toLowerCase());
    button.classList.toggle('saved',on);button.textContent=on?'♥':'♡';button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'Remove from saved dishes':'Save dish');
    button.addEventListener('click',event=>{event.stopPropagation();let list=[];try{list=JSON.parse(localStorage.getItem('CraveSpot_favorite_dishes')||'[]')}catch{};const exists=list.some(item=>String(item).toLowerCase()===name.toLowerCase());list=exists?list.filter(item=>String(item).toLowerCase()!==name.toLowerCase()):[...list,name];localStorage.setItem('CraveSpot_favorite_dishes',JSON.stringify(list));button.classList.toggle('saved',!exists);button.textContent=!exists?'♥':'♡';button.setAttribute('aria-pressed',String(!exists));button.setAttribute('aria-label',!exists?'Remove from saved dishes':'Save dish');});
  });
})();

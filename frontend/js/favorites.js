'use strict';
(() => {
  const grid = document.getElementById('favoritesGrid');
  const empty = document.getElementById('favoritesEmpty');
  const tabs = [...document.querySelectorAll('.favorites-tab')];
  const dishCount = document.getElementById('dishFavCount');
  const restaurantCount = document.getElementById('restaurantFavCount');
  let activeTab = 'dishes';
  let dishCatalog = [];
  let restaurantsCatalog = [];

  const normalize = value => String(value || '').toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const readList = key => { try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  async function loadDishes() {
    try {
      const response = await fetch('dishes.html');
      if (!response.ok) throw new Error('Dish page unavailable');
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      dishCatalog = [...doc.querySelectorAll('.dish-card, .quick-dish-card')].map(card => {
        const name = card.dataset.name || card.querySelector('h3')?.textContent.trim() || '';
        const quick = card.classList.contains('quick-dish-card');
        const image = card.querySelector('img')?.getAttribute('src') || '';
        const description = card.querySelector('.dish-description')?.textContent.trim() || card.querySelector('p')?.textContent.trim() || '';
        const price = card.dataset.price || card.querySelector('.dish-price')?.textContent.replace(/[^0-9]/g,'') || card.querySelector('strong')?.textContent.replace(/[^0-9]/g,'') || '';
        const category = card.dataset.category || card.dataset.diet || 'Dish';
        return {name, image, description, price, category, id: normalize(name), href: `dish-details.html?dish=${encodeURIComponent(normalize(name))}&name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&image=${encodeURIComponent(image)}&description=${encodeURIComponent(description)}`};
      });
      const homeResponse = await fetch('../index.html');
      if (homeResponse.ok) { const homeDoc = new DOMParser().parseFromString(await homeResponse.text(), 'text/html'); homeDoc.querySelectorAll('.quick-dish-card').forEach(card=>{ const name=card.querySelector('h3')?.textContent.trim()||''; const image=card.querySelector('img')?.getAttribute('src')||''; const description=card.querySelector('p')?.textContent.trim()||''; const price=card.querySelector('strong')?.textContent.replace(/[^0-9]/g,'')||''; if(name&&!dishCatalog.some(d=>normalize(d.name)===normalize(name))) dishCatalog.push({name,image,description,price,category:card.dataset.diet||'Dish',id:normalize(name),href:`dish-details.html?dish=${encodeURIComponent(normalize(name))}&name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&image=${encodeURIComponent(image)}&description=${encodeURIComponent(description)}`}); }); }
    } catch (error) { console.warn('Could not read dish catalogue for saved items.', error); }
  }

  async function loadRestaurants() {
    const fallback = [
      {restaurant_id:1,name:'Spice Garden',cuisine:'North Indian · Mughlai · Biryani',address:'Sector 17, Chandigarh',rating:4.5},
      {restaurant_id:2,name:'Pizza Corner',cuisine:'Pizza · Italian · Fast Food',address:'Sector 22, Chandigarh',rating:4.3},
      {restaurant_id:3,name:'Wok Express',cuisine:'Chinese · Momos · Noodles',address:'Sector 35, Chandigarh',rating:4.2},
      {restaurant_id:4,name:'Burger House',cuisine:'Burgers · Fast Food',address:'Sector 8, Chandigarh',rating:4.1},
      {restaurant_id:5,name:'Sweet Cravings',cuisine:'Desserts',address:'Sector 10, Chandigarh',rating:4.7}
    ];
    try {
      const res = await fetch('http://127.0.0.1:5000/api/restaurants');
      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      restaurantsCatalog = Array.isArray(data) ? data : fallback;
    } catch { restaurantsCatalog = fallback; }
  }

  function restaurantImage(index) {
    const imgs = [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80'
    ];
    return imgs[index % imgs.length];
  }

  function render() {
    const savedDishes = readList('CraveSpot_favorite_dishes');
    const savedRestaurants = readList('CraveSpot_favorite_restaurants').map(String);
    dishCount.textContent = savedDishes.length;
    restaurantCount.textContent = savedRestaurants.length;
    tabs.forEach(tab => { const on = tab.dataset.tab === activeTab; tab.classList.toggle('active', on); tab.setAttribute('aria-selected', String(on)); });
    grid.innerHTML = '';
    let items = [];
    if (activeTab === 'dishes') {
      items = savedDishes.map(saved => dishCatalog.find(d => normalize(d.name) === normalize(saved) || d.id === normalize(saved))).filter(Boolean);
      items.forEach(item => grid.appendChild(makeCard(item, 'dish')));
    } else {
      items = savedRestaurants.map(id => restaurantsCatalog.find(r => String(r.restaurant_id) === id)).filter(Boolean);
      items.forEach((item, index) => grid.appendChild(makeCard({name:item.name, image:restaurantImage(index), description:item.cuisine || item.address || 'Restaurant', price:'', id:String(item.restaurant_id), href:`restaurant-details.html?id=${encodeURIComponent(item.restaurant_id)}&vendor=${encodeURIComponent(item.name)}`, rating:item.rating}, 'restaurant')));
    }
    empty.hidden = items.length > 0;
    grid.hidden = items.length === 0;
  }

  function makeCard(item, kind) {
    const card = document.createElement('article');
    card.className = 'saved-card';
    const price = item.price ? `<div class="saved-price">₹${esc(item.price)}</div>` : '';
    const rating = item.rating ? `<p>★ ${esc(item.rating)}${item.address ? ` · ${esc(item.address)}` : ''}</p>` : '';
    card.innerHTML = `<img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy"><button class="saved-remove" type="button" aria-label="Remove ${esc(item.name)} from saved items">×</button><div class="saved-card-body"><h3>${esc(item.name)}</h3><p>${esc(item.description || item.cuisine || '')}</p>${price}${rating}<a class="saved-open" href="${esc(item.href)}">View details →</a></div>`;
    card.querySelector('.saved-remove').addEventListener('click', () => {
      const key = kind === 'dish' ? 'CraveSpot_favorite_dishes' : 'CraveSpot_favorite_restaurants';
      const list = readList(key);
      const value = kind === 'dish' ? item.name : String(item.id);
      localStorage.setItem(key, JSON.stringify(list.filter(saved => normalize(saved) !== normalize(value))));
      render();
    });
    return card;
  }

  tabs.forEach(tab => tab.addEventListener('click', () => { activeTab = tab.dataset.tab; render(); }));
  window.addEventListener('storage', event => { if (event.key?.includes('favorite')) render(); });
  Promise.all([loadDishes(), loadRestaurants()]).then(render);
})();

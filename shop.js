/* ===================================================================
   URARTOO — Shop Page Interactive Filtering Script
   =================================================================== */

(function () {
  'use strict';

  const CART_KEY = 'urartoo_cart_v1';
  const WISHLIST_KEY = 'urartoo_wishlist_v1';

  const STONE_DOTS = {
    'Նռնաքար': '#7B2D3B',
    'Օբսիդիան': '#17181A',
    'Փիրուզ': '#2E8C8C',
    'Հասպիս': '#A4442B',
    'Եղնգաքար': '#1B1D1C',
    'Ագաթ': '#C2A379',
    'Քվարց': '#6B5B4E'
  };

  function getProductsList() {
    if (window.NovaSanity && window.NovaSanity._ready) {
      return window.NovaSanity.getProducts();
    }
    return [];
  }

  let activeCat = 'all';
  let activeStone = 'all';
  let searchQuery = '';
  let minPrice = 100;
  let maxPrice = 600;
  let activeSort = 'new';
  // Initialize from localStorage
  var savedItems = {};
  var addedItems = {};

  // Load wishlist state from localStorage
  try {
    var storedWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    storedWishlist.forEach(function (id) { savedItems[id] = true; });
  } catch (e) {}

  // Load cart state from localStorage
  try {
    var storedCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    storedCart.forEach(function (item) { addedItems[item.id] = true; });
  } catch (e) {}

  // Sync cart badge on load
  syncCartBadge();

  function syncCartBadge() {
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) {}
    var totalQty = cart.reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (badge) {
      badge.textContent = totalQty;
    });
  }

  const gridEl = document.getElementById('shop-products-grid');
  const countEl = document.getElementById('results-count');
  const searchInput = document.getElementById('shop-search-input');
  const priceMinInput = document.getElementById('price-min');
  const priceMaxInput = document.getElementById('price-max');
  const sortSelect = document.getElementById('sort-select');
  const clearBtn = document.getElementById('clear-filters-btn');
  const mobileFilterBtn = document.getElementById('mobile-filter-btn');
  const mobileDrawer = document.getElementById('shop-sidebar');

  if (!gridEl) return;

  function filterAndSort() {
    const productsList = getProductsList();
    let list = productsList.filter(function (p) {
      if (activeCat !== 'all' && p.cat !== activeCat) return false;
      if (activeStone !== 'all' && p.stone !== activeStone) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (searchQuery) {
        var q = searchQuery.toLowerCase();
        var match = p.name.toLowerCase().includes(q) ||
                    p.stone.toLowerCase().includes(q) ||
                    (p.region && p.region.toLowerCase().includes(q)) ||
                    p.cat.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    if (activeSort === 'low') {
      list.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'high') {
      list.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'hy'));
    }

    renderGrid(list);
  }

  function renderGrid(items) {
    countEl.textContent = 'Ցուցադրված է ' + items.length + ' զարդ';

    if (items.length === 0) {
      gridEl.innerHTML = '<div class="shop-empty-state">' +
        '<p>Համապատասխան զարդեր չեն գտնվել։</p>' +
        '<button class="filter-clear-btn" id="reset-empty-btn">Մաքրել ֆիլտրերը</button>' +
      '</div>';
      var rBtn = document.getElementById('reset-empty-btn');
      if (rBtn) rBtn.addEventListener('click', resetAll);
      return;
    }

    gridEl.innerHTML = items.map(function (p) {
      var dot = STONE_DOTS[p.stone] || '#2C2F2E';
      var isSold = p.sold;
      var isAdded = !!addedItems[p.id];
      var isSaved = !!savedItems[p.id];

      var heartSvg = '<svg width="15" height="15" viewBox="0 0 24 24" fill="' +
        (isSaved ? '#2D6B4F' : 'none') + '" stroke="' +
        (isSaved ? '#2D6B4F' : '#0C0E0D') + '" stroke-width="1.5">' +
        '<path d="M12 20.5l-7.1-7a4.4 4.4 0 016.2-6.2l.9.9.9-.9a4.4 4.4 0 016.2 6.2z"/></svg>';

      return '<div class="product-card' + (isSold ? ' sold' : '') + '" data-id="' + p.id + '">' +
        '<div class="media">' +
          '<a href="product.html?id=' + p.id + '" class="media-inner">' +
            '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
          '</a>' +
          '<button class="heart' + (isSaved ? ' saved' : '') + '" data-save="' + p.id + '" aria-label="Պահպանել զարդը">' + heartSvg + '</button>' +
          (isSold
            ? '<span class="sold-badge">Վաճառված</span>'
            : '<button class="add-btn' + (isAdded ? ' added' : '') + '" data-add="' + p.id + '">' +
                (isAdded ? 'Ավելացված է' : 'Ավելացնել զամբյուղ') +
              '</button>'
          ) +
        '</div>' +
        '<div class="card-head">' +
          '<span class="card-name">' + p.name + '</span>' +
          '<span class="card-price">$' + p.price + '</span>' +
        '</div>' +
        '<div class="card-meta">' +
          '<span class="stone-dot" style="background:' + dot + '"></span>' +
          '<span class="card-stone">' + p.stone + ' · ' + p.region + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function resetAll() {
    activeCat = 'all';
    activeStone = 'all';
    searchQuery = '';
    minPrice = 100;
    maxPrice = 600;
    activeSort = 'new';

    if (searchInput) searchInput.value = '';
    if (priceMinInput) priceMinInput.value = 100;
    if (priceMaxInput) priceMaxInput.value = 600;
    if (sortSelect) sortSelect.value = 'new';

    document.querySelectorAll('#cat-chips .filter-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('#cat-chips [data-cat="all"]')?.classList.add('active');

    document.querySelectorAll('#stone-chips .filter-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('#stone-chips [data-stone="all"]')?.classList.add('active');

    filterAndSort();
  }

  // Category chip clicks
  document.querySelectorAll('#cat-chips .filter-chip').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#cat-chips .filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      filterAndSort();
    });
  });

  // Stone chip clicks
  document.querySelectorAll('#stone-chips .filter-chip').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#stone-chips .filter-chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      activeStone = btn.dataset.stone;
      filterAndSort();
    });
  });

  // Inputs
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      searchQuery = e.target.value;
      filterAndSort();
    });
  }

  if (priceMinInput) {
    priceMinInput.addEventListener('input', function (e) {
      minPrice = Number(e.target.value) || 0;
      filterAndSort();
    });
  }

  if (priceMaxInput) {
    priceMaxInput.addEventListener('input', function (e) {
      maxPrice = Number(e.target.value) || 10000;
      filterAndSort();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function (e) {
      activeSort = e.target.value;
      filterAndSort();
    });
  }

  if (clearBtn) clearBtn.addEventListener('click', resetAll);

  if (mobileFilterBtn && mobileDrawer) {
    mobileFilterBtn.addEventListener('click', function () {
      mobileDrawer.classList.toggle('open');
    });
  }

  // Grid delegation — persist to localStorage
  gridEl.addEventListener('click', function (e) {
    var addBtn = e.target.closest('[data-add]');
    var saveBtn = e.target.closest('[data-save]');

    if (addBtn) {
      var id = addBtn.dataset.add;
      var product = allProducts.find(function (p) {
        return String(p.id) === String(id) || String(p._sanityId) === String(id);
      });
      if (!product || product.sold || product.stock === 0) return;

      // Read current cart from localStorage
      var cart = [];
      try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }

      // Check if already in cart
      var existingIdx = cart.findIndex(function (c) {
        return String(c.id) === String(product.id) || String(c._sanityId) === String(product.id) || (product._sanityId && String(c.id) === String(product._sanityId));
      });

      if (existingIdx > -1) {
        cart[existingIdx].qty = (cart[existingIdx].qty || 1) + 1;
      } else {
        cart.push({
          id: product.id || product._sanityId,
          _sanityId: product._sanityId,
          name: product.name,
          price: product.price,
          img: product.img || product.image || 'Images/bracelet.webp',
          cat: product.cat || product.category || 'Մատանիներ',
          qty: 1
        });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      addedItems[id] = true;
      syncCartBadge();
      filterAndSort();

      var toastContainer = document.getElementById('storefront-toast-container');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'storefront-toast-container';
        toastContainer.style.cssText = 'position:fixed; bottom:28px; right:28px; z-index:100000; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
        document.body.appendChild(toastContainer);
      }

      var toast = document.createElement('div');
      toast.style.cssText = 'background:#17181A; color:#FFFFFF; font-family:var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif); font-size:13px; font-weight:600; padding:14px 20px; border-left:4px solid #C2A379; border-radius:6px; box-shadow:0 12px 36px rgba(0,0,0,0.5); display:flex; align-items:center; gap:12px; opacity:0; transform:translateY(16px); transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1); pointer-events:auto; max-width:380px;';

      toast.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>' +
        '<span style="flex:1; line-height:1.4;">«' + product.name + '» ավելացվեց զամբյուղում:</span>' +
        '<a href="cart.html" style="color:#C2A379; text-decoration:none; font-weight:700; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid #C2A379; padding-bottom:1px; flex-shrink:0;">ԶԱՄԲՅՈՒՂ →</a>';

      toastContainer.appendChild(toast);

      requestAnimationFrame(function() {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });

      setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(16px)';
        setTimeout(function() {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 350);
      }, 4000);
    }

    if (saveBtn) {
      var id2 = Number(saveBtn.dataset.save);
      savedItems[id2] = !savedItems[id2];

      // Rebuild wishlist array from savedItems and persist
      var wishlistIds = [];
      for (var key in savedItems) {
        if (savedItems[key]) wishlistIds.push(Number(key));
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
      filterAndSort();
    }
  });

  filterAndSort();
  window.addEventListener('sanityCatalogReady', filterAndSort);
  window.addEventListener('urartoo:products-updated', filterAndSort);

  if (window.NovaSanity && !window.NovaSanity._ready) {
    window.NovaSanity.init().then(filterAndSort);
  }

})();

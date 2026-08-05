/* ===================================================================
   URARTOO — Shop Page Interactive Filtering Script
   =================================================================== */

(function () {
  'use strict';

  const STONE_DOTS = {
    'Նռնաքար': '#7B2D3B',
    'Օբսիդիան': '#17181A',
    'Փիրուզ': '#2E8C8C',
    'Հասպիս': '#A4442B',
    'Եղնգաքար': '#1B1D1C',
    'Ագաթ': '#C2A379',
    'Քվարց': '#6B5B4E'
  };

  const allProducts = [
    { id: 1, name: 'Վայոց Ձորի նռնաքարով մատանի', cat: 'Մատանիներ', stone: 'Նռնաքար', region: 'Վայոց Ձոր', price: 340, img: 'Images/bracelet.webp', sold: false },
    { id: 2, name: 'Գուտանասարի օբսիդիանով կախազարդ', cat: 'Վզնոցներ', stone: 'Օբսիդիան', region: 'Գուտանասար', price: 265, img: 'Images/bracelet.webp', sold: false },
    { id: 3, name: 'Սյունիքի փիրուզով ապարանջան', cat: 'Ապարանջաններ', stone: 'Փիրուզ', region: 'Սյունիք', price: 410, img: 'Images/bracelet.webp', sold: false },
    { id: 4, name: 'Արենիի հասպիսով ականջօղեր', cat: 'Ականջօղեր', stone: 'Հասպիս', region: 'Արենի', price: 190, img: 'Images/bracelet.webp', sold: true },
    { id: 5, name: 'Սևանի եղնգաքարով մատանի', cat: 'Մատանիներ', stone: 'Եղնգաքար', region: 'Սևան', price: 380, img: 'Images/bracelet.webp', sold: false },
    { id: 6, name: 'Արարատյան ագաթով վզնոց', cat: 'Վզնոցներ', stone: 'Ագաթ', region: 'Արարատյան դաշտ', price: 455, img: 'Images/bracelet.webp', sold: false },
    { id: 7, name: 'Արագածի քվարցով կախազարդ', cat: 'Վզնոցներ', stone: 'Քվարց', region: 'Արագած', price: 295, img: 'Images/bracelet.webp', sold: false },
    { id: 8, name: 'Գառնիի նռնաքարով ապարանջան', cat: 'Ապարանջաններ', stone: 'Նռնաքար', region: 'Վայոց Ձոր', price: 520, img: 'Images/bracelet.webp', sold: false }
  ];

  let activeCat = 'all';
  let activeStone = 'all';
  let searchQuery = '';
  let minPrice = 100;
  let maxPrice = 600;
  let activeSort = 'new';
  const savedItems = {};
  const addedItems = {};

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
    let list = allProducts.filter(function (p) {
      if (activeCat !== 'all' && p.cat !== activeCat) return false;
      if (activeStone !== 'all' && p.stone !== activeStone) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (searchQuery) {
        var q = searchQuery.toLowerCase();
        var match = p.name.toLowerCase().includes(q) ||
                    p.stone.toLowerCase().includes(q) ||
                    p.region.toLowerCase().includes(q) ||
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
        (isSaved ? '#7B2D3B' : 'none') + '" stroke="' +
        (isSaved ? '#7B2D3B' : '#0C0E0D') + '" stroke-width="1.5">' +
        '<path d="M12 20.5l-7.1-7a4.4 4.4 0 016.2-6.2l.9.9.9-.9a4.4 4.4 0 016.2 6.2z"/></svg>';

      return '<div class="product-card' + (isSold ? ' sold' : '') + '" data-id="' + p.id + '">' +
        '<div class="media">' +
          '<a href="#piece-' + p.id + '" class="media-inner">' +
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

  // Grid delegation
  gridEl.addEventListener('click', function (e) {
    var addBtn = e.target.closest('[data-add]');
    var saveBtn = e.target.closest('[data-save]');

    if (addBtn) {
      var id = Number(addBtn.dataset.add);
      addedItems[id] = true;
      filterAndSort();
    }
    if (saveBtn) {
      var id2 = Number(saveBtn.dataset.save);
      savedItems[id2] = !savedItems[id2];
      filterAndSort();
    }
  });

  filterAndSort();

})();

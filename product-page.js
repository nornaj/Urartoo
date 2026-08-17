/* ===================================================================
   URARTOO — Product Detail Page Script
   Reads ?id= from URL and renders the product
   =================================================================== */

(function () {
  'use strict';

  var CART_KEY = 'urartoo_cart_v1';
  var WISHLIST_KEY = 'urartoo_wishlist_v1';

  var STONE_DOTS = {
    '\u0546\u057C\u0576\u0561\u0584\u0561\u0580': '#7B2D3B',
    '\u0555\u0562\u057D\u056B\u0564\u056B\u0561\u0576': '#17181A',
    '\u0553\u056B\u057C\u0578\u0582\u0566': '#2E8C8C',
    '\u0540\u0561\u057D\u057A\u056B\u057D': '#A4442B',
    '\u0535\u0572\u0576\u0563\u0561\u0584\u0561\u0580': '#1B1D1C',
    '\u0531\u0563\u0561\u0569': '#C2A379',
    '\u0554\u057E\u0561\u0580\u0581': '#6B5B4E'
  };

  var allProducts = [
    { id: 1, name: '\u054E\u0561\u0575\u0578\u0581 \u0541\u0578\u0580\u056B \u0576\u057C\u0576\u0561\u0584\u0561\u0580\u0578\u057E \u0574\u0561\u057F\u0561\u0576\u056B', cat: '\u0544\u0561\u057F\u0561\u0576\u056B\u0576\u0565\u0580', stone: '\u0546\u057C\u0576\u0561\u0584\u0561\u0580', region: '\u054E\u0561\u0575\u0578\u0581 \u0541\u0578\u0580', price: 340, img: 'Images/bracelet.webp', sold: false,
      desc: '\u0535\u0566\u0561\u056F\u056B \u0576\u057C\u0576\u0561\u0584\u0561\u0580\u056B \u056F\u057F\u0578\u0580\u0568\u0589 \u0570\u0561\u057E\u0561\u0584\u057E\u0561\u056E \u054E\u0561\u0575\u0578\u0581 \u0541\u0578\u0580\u056B \u0563\u0565\u057F\u0561\u0583\u0576\u0575\u0561\u056C\u0576\u0565\u0580\u056B\u0581\u0589 \u0570\u0572\u056F\u057E\u0561\u056E \u0565\u057E \u057F\u0565\u0572\u0561\u0564\u0580\u057E\u0561\u056E 925 \u0570\u0561\u0580\u0563\u056B \u0561\u0580\u056E\u0561\u0569\u056B \u0574\u0565\u057B\u0589 \u0574\u0565\u056F \u057E\u0561\u0580\u057A\u0565\u057F\u056B \u056F\u0578\u0572\u0574\u056B\u0581\u0589 \u0535\u0580\u0587\u0561\u0576\u0578\u0582\u0574\u0589' },
    { id: 2, name: '\u0533\u0578\u0582\u057F\u0561\u0576\u0561\u057D\u0561\u0580\u056B \u0585\u0562\u057D\u056B\u0564\u056B\u0561\u0576\u0578\u057E \u056F\u0561\u056D\u0561\u0566\u0561\u0580\u0564', cat: '\u054E\u0566\u0576\u0578\u0581\u0576\u0565\u0580', stone: '\u0555\u0562\u057D\u056B\u0564\u056B\u0561\u0576', region: '\u0533\u0578\u0582\u057F\u0561\u0576\u0561\u057D\u0561\u0580', price: 265, img: 'Images/bracelet.webp', sold: false,
      desc: '\u054D\u0587 \u0585\u0562\u057D\u056B\u0564\u056B\u0561\u0576\u056B \u056F\u057F\u0578\u0580\u0568\u0589 \u0570\u0561\u057E\u0561\u0584\u057E\u0561\u056E \u0533\u0578\u0582\u057F\u0561\u0576\u0561\u057D\u0561\u0580\u056B \u0570\u0580\u0561\u0562\u056D\u0561\u0575\u056B\u0576\u056B\u0581\u0589 \u057F\u0565\u0572\u0561\u0564\u0580\u057E\u0561\u056E \u0561\u0580\u056E\u0561\u0569\u0565 \u0577\u0572\u0569\u0561\u0575\u056B \u057E\u0580\u0561\u0589 \u0570\u0561\u057E\u0565\u0580\u056A\u0561\u056F\u0561\u0576 \u056F\u0561\u056D\u0561\u0566\u0561\u0580\u0564\u0589' },
    { id: 3, name: '\u054D\u0575\u0578\u0582\u0576\u056B\u0584\u056B \u0583\u056B\u057C\u0578\u0582\u0566\u0578\u057E \u0561\u057A\u0561\u0580\u0561\u0576\u057B\u0561\u0576', cat: '\u0531\u057A\u0561\u0580\u0561\u0576\u057B\u0561\u0576\u0576\u0565\u0580', stone: '\u0553\u056B\u057C\u0578\u0582\u0566', region: '\u054D\u0575\u0578\u0582\u0576\u056B\u0584', price: 410, img: 'Images/bracelet.webp', sold: false,
      desc: '\u0553\u056B\u057C\u0578\u0582\u0566\u056B \u0565\u0580\u056F\u0578\u0582 \u056F\u057F\u0578\u0580\u056B \u056F\u0578\u0574\u0562\u056B\u0576\u0561\u0581\u056B\u0561\u0589 \u057F\u0565\u0572\u0561\u0564\u0580\u057E\u0561\u056E \u054D\u0575\u0578\u0582\u0576\u056B\u0584\u056B \u0584\u0561\u0580\u0565\u0580\u056B\u0581\u0589 925 \u0570\u0561\u0580\u0563\u056B \u0561\u0580\u056E\u0561\u0569\u0565 \u0561\u057A\u0561\u0580\u0561\u0576\u057B\u0561\u0576\u0589' },
    { id: 4, name: '\u0531\u0580\u0565\u0576\u056B\u056B \u0570\u0561\u057D\u057A\u056B\u057D\u0578\u057E \u0561\u056F\u0561\u0576\u057B\u0585\u0572\u0565\u0580', cat: '\u0531\u056F\u0561\u0576\u057B\u0585\u0572\u0565\u0580', stone: '\u0540\u0561\u057D\u057A\u056B\u057D', region: '\u0531\u0580\u0565\u0576\u056B', price: 190, img: 'Images/bracelet.webp', sold: true,
      desc: '\u0540\u0561\u057D\u057A\u056B\u057D\u056B \u057B\u0565\u0580\u0574 \u056F\u0561\u0580\u0574\u056B\u0580 \u0565\u0580\u0561\u0576\u0563\u0576\u0565\u0580\u0578\u057E \u0561\u056F\u0561\u0576\u057B\u0585\u0572\u0565\u0580\u0589 \u0570\u0561\u057E\u0561\u0584\u057E\u0561\u056E \u0531\u0580\u0565\u0576\u056B\u056B \u0577\u0580\u057B\u0561\u056F\u0561\u0575\u0584\u056B\u0581\u0589 \u0561\u0580\u0564\u0565\u0576 \u057E\u0561\u0573\u0561\u057C\u057E\u0561\u056E \u0567\u0589' },
    { id: 5, name: '\u054D\u0587\u0561\u0576\u056B \u0565\u0572\u0576\u0563\u0561\u0584\u0561\u0580\u0578\u057E \u0574\u0561\u057F\u0561\u0576\u056B', cat: '\u0544\u0561\u057F\u0561\u0576\u056B\u0576\u0565\u0580', stone: '\u0535\u0572\u0576\u0563\u0561\u0584\u0561\u0580', region: '\u054D\u0587\u0561\u0576', price: 380, img: 'Images/bracelet.webp', sold: false,
      desc: '\u054D\u0587\u0561\u0576\u0561 \u056C\u0573\u056B \u0565\u0572\u0576\u0563\u0561\u0584\u0561\u0580\u056B \u056F\u057F\u0578\u0580\u0568\u0589 \u0570\u0572\u056F\u057E\u0561\u056E \u0587 \u057F\u0565\u0572\u0561\u0564\u0580\u057E\u0561\u056E \u0561\u0580\u056E\u0561\u0569\u056B \u0574\u0565\u057B\u0589 \u0575\u0578\u0582\u0580\u0561\u0584\u0561\u0576\u0579\u0575\u0578\u0582\u0580 \u0564\u056B\u0566\u0561\u0575\u0576\u0589' },
    { id: 6, name: '\u0531\u0580\u0561\u0580\u0561\u057F\u0575\u0561\u0576 \u0561\u0563\u0561\u0569\u0578\u057E \u057E\u0566\u0576\u0578\u0581', cat: '\u054E\u0566\u0576\u0578\u0581\u0576\u0565\u0580', stone: '\u0531\u0563\u0561\u0569', region: '\u0531\u0580\u0561\u0580\u0561\u057F\u0575\u0561\u0576 \u0564\u0561\u0577\u057F', price: 455, img: 'Images/bracelet.webp', sold: false,
      desc: '\u0531\u0563\u0561\u0569\u056B \u056F\u057F\u0578\u0580\u0568\u0589 \u0570\u0561\u057E\u0561\u0584\u057E\u0561\u056E \u0531\u0580\u0561\u0580\u0561\u057F\u0575\u0561\u0576 \u0564\u0561\u0577\u057F\u056B\u0581\u0589 \u057F\u0565\u0572\u0561\u0564\u0580\u057E\u0561\u056E \u0561\u0580\u056E\u0561\u0569\u0565 \u0577\u0572\u0569\u0561\u0575\u056B \u057E\u0580\u0561\u0589 \u0576\u0580\u0562\u0561\u0563\u057A\u0561\u0577\u057F \u057E\u0566\u0576\u0578\u0581\u0589' },
    { id: 7, name: '\u0531\u0580\u0561\u0563\u0561\u056E\u056B \u0584\u057E\u0561\u0580\u0581\u0578\u057E \u056F\u0561\u056D\u0561\u0566\u0561\u0580\u0564', cat: '\u054E\u0566\u0576\u0578\u0581\u0576\u0565\u0580', stone: '\u0554\u057E\u0561\u0580\u0581', region: '\u0531\u0580\u0561\u0563\u0561\u056E', price: 295, img: 'Images/bracelet.webp', sold: false,
      desc: '\u0554\u057E\u0561\u0580\u0581\u056B \u056F\u057F\u0578\u0580\u0568\u0589 \u0570\u0561\u057E\u0561\u0584\u057E\u0561\u056E \u0531\u0580\u0561\u0563\u0561\u056E\u056B \u056C\u0565\u057C\u0576\u0565\u0580\u056B\u0581\u0589 \u0569\u0561\u0583\u0561\u0576\u0581\u056B\u056F \u0587 \u056F\u056B\u057D\u0561\u0569\u0561\u0583\u0561\u0576\u0581\u056B\u056F \u056F\u0561\u056D\u0561\u0566\u0561\u0580\u0564\u0589' },
    { id: 8, name: '\u0533\u0561\u057C\u0576\u056B\u056B \u0576\u057C\u0576\u0561\u0584\u0561\u0580\u0578\u057E \u0561\u057A\u0561\u0580\u0561\u0576\u057B\u0561\u0576', cat: '\u0531\u057A\u0561\u0580\u0561\u0576\u057B\u0561\u0576\u0576\u0565\u0580', stone: '\u0546\u057C\u0576\u0561\u0584\u0561\u0580', region: '\u054E\u0561\u0575\u0578\u0581 \u0541\u0578\u0580', price: 520, img: 'Images/bracelet.webp', sold: false,
      desc: '\u0546\u057C\u0576\u0561\u0584\u0561\u0580\u056B \u0565\u0580\u056F\u0578\u0582 \u056F\u057F\u0578\u0580\u056B\u0581\u0589 \u057F\u0565\u0572\u0561\u0564\u0580\u057E\u0561\u056E \u0561\u0580\u056E\u0561\u0569\u0565 \u0561\u057A\u0561\u0580\u0561\u0576\u057B\u0561\u0576\u056B \u0574\u0565\u057B\u0589 \u0540\u0561\u0575\u0561\u057D\u057F\u0561\u0576\u056B \u0561\u0574\u0565\u0576\u0561\u056D\u0578\u0580\u0568 \u0584\u0561\u0580\u0568\u0589' }
  ];

  var currentCatalog = (window.NovaSanity && window.NovaSanity._ready)
    ? window.NovaSanity.getProducts()
    : allProducts;

  // Get product ID from URL
  var params = new URLSearchParams(window.location.search);
  var rawId = params.get('id');
  var productId = Number(rawId) || rawId;
  var product = currentCatalog.find(function (p) {
    return String(p.id) === String(rawId) || String(p._sanityId) === String(rawId) || p.id === productId;
  });

  if (!product) {
    document.getElementById('pdp-content').innerHTML =
      '<div style="text-align:center; padding: 80px 20px;">' +
        '<h2 style="font-family: var(--font-serif); font-size: 28px; margin-bottom: 16px;">\u0536\u0561\u0580\u0564\u0568 \u0579\u056B \u0563\u057F\u0576\u057E\u0565\u056C</h2>' +
        '<p style="color: var(--tuff); margin-bottom: 24px;">\u054D\u056D\u0561\u056C \u0570\u0561\u057D\u0581\u0565 \u056F\u0561\u0574 \u0566\u0561\u0580\u0564\u0568 \u0561\u0575\u056C\u0587\u057D \u0570\u0561\u057D\u0561\u0576\u0565\u056C\u056B \u0579\u0567\u0589</p>' +
        '<a href="shop.html" class="btn-primary" style="display:inline-block; padding:15px 32px; text-decoration:none;">\u054E\u0565\u0580\u0561\u0564\u0561\u057C\u0576\u0561\u056C \u056D\u0561\u0576\u0578\u0582\u0569</a>' +
      '</div>';
    return;
  }

  // Set page title
  document.title = product.name + ' \u2014 Urartoo';

  // Populate breadcrumb
  document.getElementById('bc-category').textContent = product.cat;
  document.getElementById('bc-product-name').textContent = product.name;

  // Main image
  document.getElementById('pdp-main-img').src = product.img;
  document.getElementById('pdp-main-img').alt = product.name;

  // Sold badge
  if (product.sold) {
    document.getElementById('pdp-sold-badge').classList.remove('hidden');
  }

  // Product info
  document.getElementById('pdp-title').textContent = product.name;
  document.getElementById('pdp-price').textContent = '$' + product.price;
  document.getElementById('pdp-stone').innerHTML = '<span class="pdp-stone-dot" style="background:' + (STONE_DOTS[product.stone] || '#2C2F2E') + '"></span>' + product.stone;
  document.getElementById('pdp-region').textContent = product.region;
  document.getElementById('pdp-category').textContent = product.cat;
  document.getElementById('pdp-description').textContent = product.desc || '';
  document.getElementById('pdp-detail-desc').textContent = product.desc || '';

  // Status
  var statusEl = document.getElementById('pdp-status');
  if (product.sold) {
    statusEl.textContent = '\u054E\u0561\u0573\u0561\u057C\u057E\u0561\u056E';
    statusEl.className = 'pdp-status pdp-status-sold';
  } else {
    statusEl.textContent = '\u0540\u0561\u057D\u0561\u0576\u0565\u056C\u056B';
    statusEl.className = 'pdp-status pdp-status-available';
  }

  // Cart button
  var cartBtn = document.getElementById('pdp-add-cart');
  if (product.sold) {
    cartBtn.disabled = true;
    cartBtn.textContent = '\u054E\u0561\u0573\u0561\u057C\u057E\u0561\u056E \u0567';
    cartBtn.classList.add('pdp-btn-disabled');
  } else {
    cartBtn.addEventListener('click', function () {
      var cart = [];
      try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }
      var idx = cart.findIndex(function (c) { return c.id === product.id; });
      if (idx > -1) {
        cart[idx].qty += 1;
      } else {
        cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
      }
      localStorage.setItem(CART_KEY, JSON.stringify(cart));

      // Update badge
      var totalQty = cart.reduce(function (s, i) { return s + (i.qty || 1); }, 0);
      document.querySelectorAll('[data-cart-count]').forEach(function (b) { b.textContent = totalQty; });

      // Visual feedback
      cartBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> \u0531\u057e\u0565\u056c\u0561\u0581\u057e\u0561\u056e \u0567';
      cartBtn.classList.add('pdp-btn-added');
      setTimeout(function () {
        cartBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> \u0531\u057e\u0565\u056c\u0561\u0581\u0576\u0565\u056c \u0566\u0561\u0574\u0562\u0575\u0578\u0582\u0572';
        cartBtn.classList.remove('pdp-btn-added');
      }, 1500);
    });
  }

  // Wishlist button
  var wishBtn = document.getElementById('pdp-add-wish');
  var wishlistIds = [];
  try { wishlistIds = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; } catch (e) {}
  var isWished = wishlistIds.includes(product.id);

  function updateWishBtn() {
    if (isWished) {
      wishBtn.classList.add('pdp-wished');
      wishBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#2D6B4F" stroke="#2D6B4F" stroke-width="1.6"><path d="M12 20.5l-7.1-7a4.4 4.4 0 016.2-6.2l.9.9.9-.9a4.4 4.4 0 016.2 6.2z"/></svg>';
    } else {
      wishBtn.classList.remove('pdp-wished');
      wishBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20.5l-7.1-7a4.4 4.4 0 016.2-6.2l.9.9.9-.9a4.4 4.4 0 016.2 6.2z"/></svg>';
    }
  }
  updateWishBtn();

  wishBtn.addEventListener('click', function () {
    isWished = !isWished;
    if (isWished) {
      wishlistIds.push(product.id);
    } else {
      wishlistIds = wishlistIds.filter(function (i) { return i !== product.id; });
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
    updateWishBtn();
  });

  // Related products (same category or stone, exclude current, always show 4)
  var related = allProducts.filter(function (p) {
    return p.id !== product.id && (p.cat === product.cat || p.stone === product.stone);
  });

  // Backfill with other products if fewer than 4
  if (related.length < 4) {
    var others = allProducts.filter(function (p) {
      return p.id !== product.id && !related.some(function (r) { return r.id === p.id; });
    });
    related = related.concat(others).slice(0, 4);
  } else {
    related = related.slice(0, 4);
  }

  var relGrid = document.getElementById('pdp-related-grid');
  if (relGrid && related.length > 0) {
    relGrid.innerHTML = related.map(function (p) {
      var dot = STONE_DOTS[p.stone] || '#2C2F2E';
      return '<a href="product.html?id=' + p.id + '" class="pdp-rel-card">' +
        '<div class="pdp-rel-img"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
          (p.sold ? '<span class="pdp-rel-sold">\u054E\u0561\u0573\u0561\u057C\u057E\u0561\u056E</span>' : '') +
        '</div>' +
        '<div class="pdp-rel-body">' +
          '<span class="pdp-rel-name">' + p.name + '</span>' +
          '<span class="pdp-rel-price">$' + p.price + '</span>' +
          '<span class="pdp-rel-stone"><span class="stone-dot" style="background:' + dot + '"></span>' + p.stone + '</span>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  // === FAQ Accordion Animation ===
  var faqBlocks = document.querySelectorAll('[data-faq]');
  faqBlocks.forEach(function (block) {
    var btn = block.querySelector('.pdp-faq-summary');
    var body = block.querySelector('.pdp-faq-body');
    if (!btn || !body) return;

    // Initialize: if first one is open, set its max-height
    if (btn.getAttribute('aria-expanded') === 'true') {
      body.style.maxHeight = body.scrollHeight + 'px';
      body.classList.add('open');
    }

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        // Close: animate max-height to 0
        body.style.maxHeight = body.scrollHeight + 'px';
        // Force reflow
        body.offsetHeight;
        body.style.maxHeight = '0';
        body.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        // Close all others first
        faqBlocks.forEach(function (other) {
          var otherBtn = other.querySelector('.pdp-faq-summary');
          var otherBody = other.querySelector('.pdp-faq-body');
          if (other !== block && otherBtn && otherBody && otherBtn.getAttribute('aria-expanded') === 'true') {
            otherBody.style.maxHeight = otherBody.scrollHeight + 'px';
            otherBody.offsetHeight;
            otherBody.style.maxHeight = '0';
            otherBody.classList.remove('open');
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Open this one
        body.style.maxHeight = body.scrollHeight + 'px';
        body.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');

        // After transition, set auto so it adapts to content changes
        body.addEventListener('transitionend', function handler() {
          if (btn.getAttribute('aria-expanded') === 'true') {
            body.style.maxHeight = 'none';
          }
          body.removeEventListener('transitionend', handler);
        });
      }
    });
  });

})();

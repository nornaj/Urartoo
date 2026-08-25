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

  var allProducts = [];

  async function initProductPage() {
    let currentCatalog = [];
    if (window.NovaSanity) {
      if (!window.NovaSanity._ready) {
        currentCatalog = await window.NovaSanity.init();
      } else {
        currentCatalog = window.NovaSanity.getProducts();
      }
    }

    if (!currentCatalog || currentCatalog.length === 0) {
      currentCatalog = allProducts;
    }

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
          '<h2 style="font-family: var(--font-serif); font-size: 28px; margin-bottom: 16px;">Զարդը չի գտնվել</h2>' +
          '<p style="color: var(--tuff); margin-bottom: 24px;">Սխալ հասցե կամ զարդը այլևս հասանելի չէ։</p>' +
          '<a href="shop.html" class="btn-primary" style="display:inline-block; padding:15px 32px; text-decoration:none;">Վերադառնալ խանութ</a>' +
        '</div>';
      return;
    }

    renderProductDetails(product, currentCatalog);
  }

  function renderProductDetails(product, catalog) {
    // Set page title
    document.title = product.name + ' — Urartoo';

    // Populate breadcrumb
    if (document.getElementById('bc-category')) document.getElementById('bc-category').textContent = product.cat || product.category || 'Մատանիներ';
    if (document.getElementById('bc-product-name')) document.getElementById('bc-product-name').textContent = product.name;

    // Main image
    var mainImg = product.img || product.image || 'Images/bracelet.webp';
    if (document.getElementById('pdp-main-img')) {
      document.getElementById('pdp-main-img').src = mainImg;
      document.getElementById('pdp-main-img').alt = product.name;
    }

    // Sold badge
    if (document.getElementById('pdp-sold-badge')) {
      if (product.sold || product.stock === 0) {
        document.getElementById('pdp-sold-badge').classList.remove('hidden');
      } else {
        document.getElementById('pdp-sold-badge').classList.add('hidden');
      }
    }

    // Product info
    if (document.getElementById('pdp-title')) document.getElementById('pdp-title').textContent = product.name;
    if (document.getElementById('pdp-price')) document.getElementById('pdp-price').textContent = product.price + '֏';
    if (document.getElementById('pdp-stone')) {
      document.getElementById('pdp-stone').innerHTML = '<span class="pdp-stone-dot" style="background:' + (STONE_DOTS[product.stone] || '#2C2F2E') + '"></span>' + (product.stone || 'Նռնաքար');
    }
    if (document.getElementById('pdp-region')) document.getElementById('pdp-region').textContent = product.region || product.stoneOrigin || 'Վայոց Ձոր';
    if (document.getElementById('pdp-category')) document.getElementById('pdp-category').textContent = product.cat || product.category || 'Մատանիներ';
    if (document.getElementById('pdp-description')) document.getElementById('pdp-description').textContent = product.desc || product.description || '';
    if (document.getElementById('pdp-detail-desc')) document.getElementById('pdp-detail-desc').textContent = product.desc || product.description || '';

    // Status
    var statusEl = document.getElementById('pdp-status');
    if (statusEl) {
      if (product.sold || product.stock === 0) {
        statusEl.textContent = 'Վաճառված';
        statusEl.className = 'pdp-status pdp-status-sold';
      } else {
        statusEl.textContent = 'Հասանելի';
        statusEl.className = 'pdp-status pdp-status-available';
      }
    }

    // Cart button
    var cartBtn = document.getElementById('pdp-add-cart');
    if (cartBtn) {
      if (product.sold || product.stock === 0) {
        cartBtn.disabled = true;
        cartBtn.textContent = 'Վաճառված է';
        cartBtn.classList.add('pdp-btn-disabled');
      } else {
        cartBtn.disabled = false;
        cartBtn.textContent = 'Ավելացնել զամբյուղ';
        cartBtn.classList.remove('pdp-btn-disabled');
        cartBtn.onclick = function () {
          var cart = [];
          try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }
          var idx = cart.findIndex(function (c) { return String(c.id) === String(product.id); });
          if (idx > -1) {
            cart[idx].qty += 1;
          } else {
            cart.push({ id: product.id, name: product.name, price: product.price, img: mainImg, qty: 1 });
          }
          localStorage.setItem(CART_KEY, JSON.stringify(cart));

          var totalQty = cart.reduce(function (s, i) { return s + (i.qty || 1); }, 0);
          document.querySelectorAll('[data-cart-count]').forEach(function (b) { b.textContent = totalQty; });

          cartBtn.innerHTML = '✓ Ավելացված է';
          cartBtn.classList.add('pdp-btn-added');
          setTimeout(function () {
            cartBtn.innerHTML = 'Ավելացնել զամբյուղ';
            cartBtn.classList.remove('pdp-btn-added');
          }, 1500);
        };
      }
    }

    // Wishlist button
    var wishBtn = document.getElementById('pdp-add-wish');
    if (wishBtn) {
      var prodIdStr = String(product.id || product._sanityId);
      var getWished = function () {
        var ids = [];
        try { ids = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; } catch (e) {}
        return ids.some(function (i) { return String(i) === prodIdStr || (product._sanityId && String(i) === String(product._sanityId)); });
      };

      var updateWishBtn = function() {
        var isWished = getWished();
        if (isWished) {
          wishBtn.classList.add('pdp-wished');
          wishBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#A4442B" stroke="#A4442B" stroke-width="1.6"><path d="M12 20.5l-7.1-7a4.4 4.4 0 016.2-6.2l.9.9.9-.9a4.4 4.4 0 016.2 6.2z"/></svg>';
        } else {
          wishBtn.classList.remove('pdp-wished');
          wishBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20.5l-7.1-7a4.4 4.4 0 016.2-6.2l.9.9.9-.9a4.4 4.4 0 016.2 6.2z"/></svg>';
        }
      };
      updateWishBtn();

      wishBtn.onclick = function () {
        var wishlistIds = [];
        try { wishlistIds = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; } catch (e) {}
        var isWished = wishlistIds.some(function (i) { return String(i) === prodIdStr || (product._sanityId && String(i) === String(product._sanityId)); });

        if (isWished) {
          wishlistIds = wishlistIds.filter(function (i) { return String(i) !== prodIdStr && (!product._sanityId || String(i) !== String(product._sanityId)); });
        } else {
          wishlistIds.push(prodIdStr);
        }
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
        updateWishBtn();
        window.dispatchEvent(new CustomEvent('urartoo:wishlist-updated', { detail: { id: prodIdStr, saved: !isWished } }));
      };

      window.addEventListener('urartoo:wishlist-updated', updateWishBtn);
      window.addEventListener('storage', function(e) {
        if (e.key === WISHLIST_KEY) updateWishBtn();
      });
    }

    // Related products (same category or stone, exclude current, always show 4)
    var catalogList = catalog || [];
    var related = catalogList.filter(function (p) {
      return String(p.id) !== String(product.id) && (p.cat === product.cat || p.stone === product.stone);
    });

    if (related.length < 4) {
      var others = catalogList.filter(function (p) {
        return String(p.id) !== String(product.id) && !related.some(function (r) { return String(r.id) === String(p.id); });
      });
      related = related.concat(others).slice(0, 4);
    } else {
      related = related.slice(0, 4);
    }

    var relGrid = document.getElementById('pdp-related-grid');
    if (relGrid && related.length > 0) {
      relGrid.innerHTML = related.map(function (p) {
        var dot = STONE_DOTS[p.stone] || '#2C2F2E';
        var pImg = p.img || p.image || 'Images/bracelet.webp';
        var pId = p._sanityId || p.id;
        return '<a href="product.html?id=' + pId + '" class="pdp-rel-card">' +
          '<div class="pdp-rel-img"><img src="' + pImg + '" alt="' + p.name + '" loading="lazy">' +
            (p.sold ? '<span class="pdp-rel-sold">Վաճառված</span>' : '') +
          '</div>' +
          '<div class="pdp-rel-body">' +
            '<span class="pdp-rel-name">' + p.name + '</span>' +
            '<span class="pdp-rel-price">' + p.price + '֏</span>' +
            '<span class="pdp-rel-stone"><span class="stone-dot" style="background:' + dot + '"></span>' + (p.stone || 'Նռնաքար') + '</span>' +
          '</div>' +
        '</a>';
      }).join('');
    }
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPage);
  } else {
    initProductPage();
  }

  window.addEventListener('sanityCatalogReady', initProductPage);

})();

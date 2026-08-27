/* ===================================================================
   URARTOO — Cart Page Script
   Reads from localStorage urartoo_cart_v1 and renders the cart table
   =================================================================== */

(function () {
  'use strict';

  var CART_KEY = 'urartoo_cart_v1';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Update all badge counts on page
    var totalQty = cart.reduce(function (s, i) { return s + (i.qty || 1); }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (b) {
      b.textContent = totalQty;
    });
  }

  function parsePrice(val) {
    if (typeof val === 'number') return val;
    return Number(String(val || 0).replace(/[^0-9.]/g, '')) || 0;
  }

  function renderCart() {
    var cart = getCart();
    var listEl = document.getElementById('cart-items-list');
    var emptyEl = document.getElementById('cart-empty');
    var totalsCol = document.getElementById('cart-totals-col');
    var subtotalEl = document.getElementById('cart-subtotal');
    var totalEl = document.getElementById('cart-total');
    var checkoutBtn = document.getElementById('cart-checkout-btn');
    var tableHead = document.querySelector('.cart-table-head');

    if (!listEl) return;

    var gridEl = document.getElementById('cart-page-grid');

    if (cart.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
      totalsCol.classList.add('hidden');
      if (tableHead) tableHead.classList.add('hidden');
      if (gridEl) gridEl.classList.add('cart-is-empty');
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    emptyEl.classList.add('hidden');
    totalsCol.classList.remove('hidden');
    if (tableHead) tableHead.classList.remove('hidden');
    if (gridEl) gridEl.classList.remove('cart-is-empty');
    if (checkoutBtn) checkoutBtn.disabled = false;

    var subtotal = 0;

    listEl.innerHTML = cart.map(function (item, idx) {
      var itemPrice = parsePrice(item.price);
      var lineTotal = itemPrice * (item.qty || 1);
      subtotal += lineTotal;

      return '<div class="cart-item" data-idx="' + idx + '">' +
        '<button class="cart-item-remove" data-remove="' + idx + '" aria-label="Remove">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '<a href="/product/' + (item.slug || item.id) + '" class="cart-item-img">' +
          '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy">' +
        '</a>' +
        '<a href="/product/' + (item.slug || item.id) + '" class="cart-item-name">' + item.name + '</a>' +
        '<span class="cart-item-price">' + itemPrice + '֏' + '</span>' +
        '<div class="cart-item-qty">' +
          '<button class="qty-btn" data-qty-minus="' + idx + '">-</button>' +
          '<span class="qty-val">' + (item.qty || 1) + '</span>' +
          '<button class="qty-btn" data-qty-plus="' + idx + '">+</button>' +
        '</div>' +
        '<span class="cart-item-subtotal">' + lineTotal + '֏' + '</span>' +
      '</div>';
    }).join('');

    subtotalEl.textContent = subtotal + '֏';
    totalEl.textContent = subtotal + '֏';
  }

  // Event delegation for cart actions
  document.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('[data-remove]');
    var minusBtn = e.target.closest('[data-qty-minus]');
    var plusBtn = e.target.closest('[data-qty-plus]');
    var checkoutBtnClick = e.target.closest('#cart-checkout-btn');

    if (checkoutBtnClick) {
      e.preventDefault();
      window.location.href = 'checkout.html';
      return;
    }

    if (removeBtn) {
      var cart = getCart();
      var idx = Number(removeBtn.dataset.remove);
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
    }

    if (minusBtn) {
      var cart2 = getCart();
      var idx2 = Number(minusBtn.dataset.qtyMinus);
      if (cart2[idx2]) {
        cart2[idx2].qty = Math.max(1, (cart2[idx2].qty || 1) - 1);
        saveCart(cart2);
        renderCart();
      }
    }

    if (plusBtn) {
      var cart3 = getCart();
      var idx3 = Number(plusBtn.dataset.qtyPlus);
      if (cart3[idx3]) {
        cart3[idx3].qty = (cart3[idx3].qty || 1) + 1;
        saveCart(cart3);
        renderCart();
      }
    }
  });

  // --- CHECKOUT REDIRECTS TO checkout.html ---

  // Card Number Auto-Formatter (16 digits with 4-digit spacing)
  var cardNumInput = document.getElementById('chk-card-num');
  if (cardNumInput) {
    cardNumInput.addEventListener('input', function (e) {
      var val = e.target.value.replace(/\D/g, '').substring(0, 16);
      var parts = [];
      for (var i = 0; i < val.length; i += 4) {
        parts.push(val.substring(i, i + 4));
      }
      e.target.value = parts.join(' ');
    });
  }

  // Card Expiry Auto-Formatter (MM/YY)
  var cardExpInput = document.getElementById('chk-card-exp');
  if (cardExpInput) {
    cardExpInput.addEventListener('input', function (e) {
      var val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2);
      } else {
        e.target.value = val;
      }
    });
  }

  // handleCheckoutSubmit is now defined in the checkout page IIFE below

  // Checkout button event listener
  var checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      window.location.href = 'checkout.html';
    });
  }

  renderCart();
})();

// ═══ CHECKOUT PAGE INIT ═══
// If we're on checkout.html, automatically initialize checkout on page load
(function() {
  if (!window.location.pathname.includes('checkout.html')) return;

  var cart = [];
  try { cart = JSON.parse(localStorage.getItem('urartoo_cart_v1')) || []; } catch (e) {}

  var emptyState = document.getElementById('checkout-empty-state');
  var checkoutLayout = document.getElementById('checkout-layout');
  var formEl = document.getElementById('checkout-form');

  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = '';
    if (checkoutLayout) checkoutLayout.style.display = 'none';
    if (formEl) formEl.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  // Auto-fill from logged-in user
  var user = null;
  try { user = JSON.parse(localStorage.getItem('urartoo_user_session_v1')); } catch (e) {}

  var userBadge = document.getElementById('checkout-user-badge');
  var badgeText = document.getElementById('checkout-user-info-text');

  if (user) {
    if (userBadge) userBadge.classList.remove('hidden');
    if (badgeText) badgeText.textContent = '\u2713 \u0544\u0578\u0582\u057F\u0584 \u0563\u0578\u0580\u056E\u057E\u0561\u056E \u0567 \u0578\u0580\u057A\u0565\u057D: ' + (user.name || user.email) + ' (' + user.email + ')';
    if (user.name && document.getElementById('chk-name')) document.getElementById('chk-name').value = user.name;
    if (user.email && document.getElementById('chk-email')) document.getElementById('chk-email').value = user.email;
    if (user.phone && document.getElementById('chk-phone')) document.getElementById('chk-phone').value = user.phone;
    if (user.address) {
      if (user.address.city && document.getElementById('chk-city')) document.getElementById('chk-city').value = user.address.city;
      if (user.address.street && document.getElementById('chk-street')) document.getElementById('chk-street').value = user.address.street;
    }
  } else {
    if (userBadge) userBadge.classList.add('hidden');
  }

  // Render order summary items
  var previewEl = document.getElementById('chk-items-preview');
  var subtotalEl = document.getElementById('chk-subtotal');
  var grandTotalEl = document.getElementById('chk-grand-total-val');

  function parsePrice(p) {
    if (typeof p === 'number') return p;
    return Number(String(p).replace(/[^0-9.]/g, '')) || 0;
  }

  var subtotal = 0;
  if (previewEl) {
    previewEl.innerHTML = cart.map(function (item) {
      var numPrice = parsePrice(item.price);
      var lineTotal = numPrice * (item.qty || 1);
      subtotal += lineTotal;
      return '<div class="chk-summary-item">' +
        '<img class="chk-summary-item-img" src="' + (item.img || item.image || 'Images/bracelet.webp') + '" alt="' + item.name + '">' +
        '<div class="chk-summary-item-info">' +
          '<div class="chk-summary-item-name">' + item.name + '</div>' +
          '<div class="chk-summary-item-qty">x' + (item.qty || 1) + '</div>' +
        '</div>' +
        '<div class="chk-summary-item-price">' + lineTotal + '֏' + '</div>' +
      '</div>';
    }).join('');
  }

  if (subtotalEl) subtotalEl.textContent = subtotal + '֏';
  if (grandTotalEl) grandTotalEl.textContent = subtotal + '֏';

  // Card number formatter
  var cardNumInput = document.getElementById('chk-card-num');
  if (cardNumInput) {
    cardNumInput.addEventListener('input', function (e) {
      var val = e.target.value.replace(/\D/g, '').substring(0, 16);
      var parts = [];
      for (var i = 0; i < val.length; i += 4) {
        parts.push(val.substring(i, i + 4));
      }
      e.target.value = parts.join(' ');
    });
  }

  // Card expiry formatter
  var cardExpInput = document.getElementById('chk-card-exp');
  if (cardExpInput) {
    cardExpInput.addEventListener('input', function (e) {
      var val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2);
      } else {
        e.target.value = val;
      }
    });
  }

  // Override handleCheckoutSubmit for the checkout page
  window.handleCheckoutSubmit = function (e) {
    if (e && e.preventDefault) e.preventDefault();

    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('urartoo_cart_v1')) || []; } catch (er) {}
    if (cart.length === 0) return;

    var name = document.getElementById('chk-name').value.trim();
    var email = document.getElementById('chk-email').value.trim();
    var phone = document.getElementById('chk-phone').value.trim();
    var city = document.getElementById('chk-city').value.trim();
    var street = document.getElementById('chk-street').value.trim();
    var fullAddress = street + (city ? (', ' + city) : '');

    var submitBtn = document.getElementById('btn-chk-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '\u23F3 \u053F\u0561\u057F\u0561\u0580\u057E\u0578\u0582\u0574 \u0567 \u057E\u0573\u0561\u0580\u0578\u0582\u0574\u0568...';
    }

    setTimeout(function () {
      var subtotal = cart.reduce(function (s, i) { return s + (Number(i.price) || 0) * (i.qty || 1); }, 0);

      var newOrder = null;
      if (window.WooCommerceAdmin && typeof window.WooCommerceAdmin.addOrder === 'function') {
        newOrder = window.WooCommerceAdmin.addOrder(
          { name: name, email: email, phone: phone, address: fullAddress },
          cart,
          subtotal
        );
      } else {
        var orders = [];
        try { orders = JSON.parse(localStorage.getItem('urartoo_orders_v1')) || []; } catch (err) {}
        newOrder = {
          id: 'UR-' + Math.floor(1000 + Math.random() * 9000),
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          customer: name,
          email: email,
          phone: phone,
          address: fullAddress,
          total: subtotal,
          status: 'pending',
          items: cart
        };
        orders.unshift(newOrder);
        localStorage.setItem('urartoo_orders_v1', JSON.stringify(orders));
      }

      // Append to user profile
      var user = null;
      try { user = JSON.parse(localStorage.getItem('urartoo_user_session_v1')); } catch (err) {}
      if (user) {
        if (!user.orders) user.orders = [];
        user.orders.unshift(newOrder);
        localStorage.setItem('urartoo_user_session_v1', JSON.stringify(user));
        try {
          var usersDB = JSON.parse(localStorage.getItem('urartoo_users_db_v1')) || [];
          var uIdx = usersDB.findIndex(function(u) { return u.email === user.email; });
          if (uIdx > -1) {
            if (!usersDB[uIdx].orders) usersDB[uIdx].orders = [];
            usersDB[uIdx].orders.unshift(newOrder);
            localStorage.setItem('urartoo_users_db_v1', JSON.stringify(usersDB));
          }
        } catch (err) {}
      }

      // Empty cart
      localStorage.setItem('urartoo_cart_v1', '[]');

      // Show success state
      document.getElementById('checkout-page-content').style.display = 'none';
      var successPage = document.getElementById('checkout-success-state');
      if (successPage) {
        successPage.classList.add('show');
        document.getElementById('succ-order-id').textContent = newOrder.id;
        document.getElementById('succ-cust-name').textContent = name;
        document.getElementById('succ-cust-email').textContent = email;
        document.getElementById('succ-cust-phone').textContent = phone;
        document.getElementById('succ-cust-address').textContent = fullAddress;
        document.getElementById('succ-order-total').textContent = subtotal + '֏';
      }

      // Update cart badge
      document.querySelectorAll('[data-cart-count]').forEach(function(el) { el.textContent = '0'; });

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '\uD83D\uDD12 \u054E\u0543\u0531\u054C\u0535\u053C \u0535\u054E \u0533\u054C\u0531\u0546\u0551\u0535\u053C \u054A\u0531\u054F\u054E\u0535\u054C\u0538';
      }
    }, 1200);
  };
})();

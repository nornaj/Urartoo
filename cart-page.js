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
      checkoutBtn.disabled = true;
      return;
    }

    emptyEl.classList.add('hidden');
    totalsCol.classList.remove('hidden');
    if (tableHead) tableHead.classList.remove('hidden');
    if (gridEl) gridEl.classList.remove('cart-is-empty');
    checkoutBtn.disabled = false;

    var subtotal = 0;

    listEl.innerHTML = cart.map(function (item, idx) {
      var lineTotal = item.price * (item.qty || 1);
      subtotal += lineTotal;

      return '<div class="cart-item" data-idx="' + idx + '">' +
        '<button class="cart-item-remove" data-remove="' + idx + '" aria-label="Remove">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '<a href="product.html?id=' + item.id + '" class="cart-item-img">' +
          '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy">' +
        '</a>' +
        '<a href="product.html?id=' + item.id + '" class="cart-item-name">' + item.name + '</a>' +
        '<span class="cart-item-price">$' + item.price + '</span>' +
        '<div class="cart-item-qty">' +
          '<button class="qty-btn" data-qty-minus="' + idx + '">-</button>' +
          '<span class="qty-val">' + (item.qty || 1) + '</span>' +
          '<button class="qty-btn" data-qty-plus="' + idx + '">+</button>' +
        '</div>' +
        '<span class="cart-item-subtotal">$' + lineTotal + '</span>' +
      '</div>';
    }).join('');

    subtotalEl.textContent = '$' + subtotal;
    totalEl.textContent = '$' + subtotal;
  }

  // Event delegation for cart actions
  document.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('[data-remove]');
    var minusBtn = e.target.closest('[data-qty-minus]');
    var plusBtn = e.target.closest('[data-qty-plus]');

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

  // --- CHECKOUT & ORDER LOGIC ---
  window.openCheckoutModal = function () {
    var cart = getCart();
    if (cart.length === 0) return;

    var modal = document.getElementById('checkout-modal');
    if (!modal) return;

    // Read logged-in user session for auto-filling customer info
    var user = null;
    try { user = JSON.parse(localStorage.getItem('urartoo_user_session_v1')); } catch (e) {}

    var userBadge = document.getElementById('checkout-user-badge');
    var badgeText = document.getElementById('checkout-user-info-text');

    if (user) {
      if (userBadge) userBadge.classList.remove('hidden');
      if (badgeText) badgeText.textContent = '✓ Մուտք գործված է որպես: ' + (user.name || user.email) + ' (' + user.email + ')';

      // Auto fill form fields from logged-in account
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

    // Render items summary preview inside modal
    var previewEl = document.getElementById('chk-items-preview');
    var subtotalEl = document.getElementById('chk-subtotal');
    var grandTotalEl = document.getElementById('chk-grand-total-val');

    var subtotal = 0;
    if (previewEl) {
      previewEl.innerHTML = cart.map(function (item) {
        var lineTotal = (Number(item.price) || 0) * (item.qty || 1);
        subtotal += lineTotal;
        return '<div class="chk-item-row">' +
          '<span>' + item.name + ' (x' + (item.qty || 1) + ')</span>' +
          '<strong>$' + lineTotal + '</strong>' +
        '</div>';
      }).join('');
    }

    if (subtotalEl) subtotalEl.textContent = '$' + subtotal;
    if (grandTotalEl) grandTotalEl.textContent = '$' + subtotal;

    modal.classList.add('open');
  };

  window.closeCheckoutModal = function () {
    var modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('open');
  };

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

  // Handle Checkout Form Submission & Order Processing
  window.handleCheckoutSubmit = function (e) {
    if (e && e.preventDefault) e.preventDefault();

    var cart = getCart();
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
      submitBtn.textContent = '⏳ Կատարվում է վճարումը...';
    }

    setTimeout(function () {
      var subtotal = cart.reduce(function (s, i) { return s + (Number(i.price) || 0) * (i.qty || 1); }, 0);

      // Register order with WooCommerceAdmin
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

      // Also append order to current user's profile if logged in!
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
      saveCart([]);
      renderCart();
      closeCheckoutModal();

      // Show Success Modal
      var succModal = document.getElementById('checkout-success-modal');
      if (succModal) {
        document.getElementById('succ-order-id').textContent = newOrder.id;
        document.getElementById('succ-cust-name').textContent = name;
        document.getElementById('succ-cust-email').textContent = email;
        document.getElementById('succ-cust-phone').textContent = phone;
        document.getElementById('succ-cust-address').textContent = fullAddress;
        document.getElementById('succ-order-total').textContent = '$' + subtotal;
        succModal.classList.add('open');
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🔒 ՎՃԱՐԵԼ ԵՎ ԳՐԱՆՑԵԼ ՊԱՏՎԵՐԸ';
      }
    }, 1200);
  };

  // Checkout button event listener
  var checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      openCheckoutModal();
    });
  }

  renderCart();
})();

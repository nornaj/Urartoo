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

    if (cart.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
      totalsCol.classList.add('hidden');
      if (tableHead) tableHead.classList.add('hidden');
      checkoutBtn.disabled = true;
      return;
    }

    emptyEl.classList.add('hidden');
    totalsCol.classList.remove('hidden');
    if (tableHead) tableHead.classList.remove('hidden');
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

  // Checkout button
  var checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      alert('\u0547\u0576\u0578\u0580\u0570\u0561\u056F\u0561\u056C\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0589 \u054A\u0561\u057F\u057E\u0565\u0580\u056B \u0571\u0587\u0561\u056F\u0565\u0580\u057A\u0578\u0582\u0574\u0568 \u0577\u0578\u0582\u057F\u0578\u057E \u057A\u0561\u057F\u0580\u0561\u057D\u057F \u056F\u056C\u056B\u0576\u056B\u0589');
    });
  }

  renderCart();
})();

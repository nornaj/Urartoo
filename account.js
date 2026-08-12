/* ===================================================================
   URARTOO — My Account & Authentication Logic Script
   =================================================================== */

(function () {
  'use strict';

  // Storage Keys
  const USERS_DB_KEY = 'urartoo_users_db_v1';
  const SESSION_KEY = 'urartoo_user_session_v1';
  const WISHLIST_KEY = 'urartoo_wishlist_v1';
  const CART_KEY = 'urartoo_cart_v1';

  // Default Demo Products Catalog (for Wishlist rendering)
  const CATALOG_PRODUCTS = [
    { id: 1, name: 'Վայոց Ձորի նռնաքարով մատանի', cat: 'Մատանիներ', stone: 'Նռնաքար', region: 'Վայոց Ձոր', price: 340, img: 'Images/bracelet.webp' },
    { id: 2, name: 'Գուտանասարի օբսիդիանով կախազարդ', cat: 'Վզնոցներ', stone: 'Օբսիդիան', region: 'Գուտանասար', price: 265, img: 'Images/bracelet.webp' },
    { id: 3, name: 'Սյունիքի փիրուզով ապարանջան', cat: 'Ապարանջաններ', stone: 'Փիրուզ', region: 'Սյունիք', price: 410, img: 'Images/bracelet.webp' },
    { id: 4, name: 'Արենիի հասպիսով ականջօղեր', cat: 'Ականջօղեր', stone: 'Հասպիս', region: 'Արենի', price: 190, img: 'Images/bracelet.webp' },
    { id: 5, name: 'Սևանի եղնգաքարով մատանի', cat: 'Մատանիներ', stone: 'Եղնգաքար', region: 'Սևան', price: 380, img: 'Images/bracelet.webp' },
    { id: 6, name: 'Արարատյան ագաթով վզնոց', cat: 'Վզնոցներ', stone: 'Ագաթ', region: 'Արարատյան դաշտ', price: 455, img: 'Images/bracelet.webp' },
    { id: 7, name: 'Արագածի քվարցով կախազարդ', cat: 'Վզնոցներ', stone: 'Քվարց', region: 'Արագած', price: 295, img: 'Images/bracelet.webp' },
    { id: 8, name: 'Գառնիի նռնաքարով ապարանջան', cat: 'Ապարանջաններ', stone: 'Նռնաքար', region: 'Վայոց Ձոր', price: 520, img: 'Images/bracelet.webp' }
  ];

  // Seed default demo user in local database
  function initUsersDatabase() {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
    } catch (e) {
      users = [];
    }

    const demoUserExists = users.some(u => u.email === 'anahit@example.com');
    if (!demoUserExists) {
      users.push({
        id: 'usr_demo_101',
        name: 'Անահիտ Սարգսյան',
        email: 'anahit@example.com',
        password: 'password123',
        phone: '+374 91 234567',
        joined: '2026',
        address: {
          city: 'Երևան',
          street: 'Աբովյան փող․ 12, բն․ 4',
          zip: '0001'
        },
        orders: [
          {
            id: 'UR-1082',
            date: '04 Օգոստոսի 2026',
            status: 'processing',
            statusText: 'Վերամշակվում է',
            items: [{ name: 'Վայոց Ձորի նռնաքարով մատանի', price: 340, qty: 1 }],
            total: 340
          },
          {
            id: 'UR-1049',
            date: '19 Հուլիսի 2026',
            status: 'completed',
            statusText: 'Առաքված է',
            items: [{ name: 'Գուտանասարի օբսիդիանով կախազարդ', price: 265, qty: 1 }],
            total: 265
          }
        ]
      });
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }
  }

  // Session Helper Functions
  function getUsersDB() {
    try {
      return JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveUsersDB(users) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      updateNavIconBadges(true);
    } else {
      localStorage.removeItem(SESSION_KEY);
      updateNavIconBadges(false);
    }
  }

  function updateNavIconBadges(isLoggedIn) {
    document.querySelectorAll('.nav-account-icon').forEach(icon => {
      if (isLoggedIn) {
        icon.classList.add('is-logged-in');
        icon.setAttribute('title', 'Իմ հաշիվը (Մուտք գործված է)');
      } else {
        icon.classList.remove('is-logged-in');
        icon.setAttribute('title', 'Իմ հաշիվը');
      }
    });
  }

  // --- Auth Tab Switching ---
  window.switchAuthTab = function (tab) {
    const btnSignin = document.getElementById('tab-btn-signin');
    const btnRegister = document.getElementById('tab-btn-register');
    const formSignin = document.getElementById('form-signin');
    const formRegister = document.getElementById('form-register');
    const alertBox = document.getElementById('auth-alert');

    if (alertBox) {
      alertBox.className = 'acc-alert';
      alertBox.textContent = '';
    }

    if (tab === 'signin') {
      btnSignin?.classList.add('active');
      btnRegister?.classList.remove('active');
      formSignin?.classList.remove('hidden');
      formRegister?.classList.add('hidden');
    } else {
      btnRegister?.classList.add('active');
      btnSignin?.classList.remove('active');
      formRegister?.classList.remove('hidden');
      formSignin?.classList.add('hidden');
    }
  };

  // --- Demo Credentials Autofill ---
  window.fillDemoCredentials = function () {
    const emailInput = document.getElementById('signin-email');
    const passInput = document.getElementById('signin-password');
    if (emailInput) emailInput.value = 'anahit@example.com';
    if (passInput) passInput.value = 'password123';

    // Submit form automatically
    const form = document.getElementById('form-signin');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  // --- Sign In Handler ---
  window.handleUserSignIn = function (e) {
    e.preventDefault();
    const alertBox = document.getElementById('auth-alert');
    const email = document.getElementById('signin-email')?.value.trim().toLowerCase();
    const password = document.getElementById('signin-password')?.value;

    const users = getUsersDB();
    const foundUser = users.find(u => u.email.toLowerCase() === email && u.password === password);

    if (foundUser) {
      showAlert(alertBox, 'Բարի գալուստ, ' + foundUser.name + '։ Մուտքը հաջողվեց։', 'success');
      setCurrentUser(foundUser);
      setTimeout(() => {
        renderAccountPage();
      }, 400);
    } else {
      showAlert(alertBox, 'Էլ․ փոստը կամ գաղտնաբառը սխալ է։ Խնդրում ենք փորձել նորից։', 'error');
    }
  };

  // --- Register Handler ---
  window.handleUserRegister = function (e) {
    e.preventDefault();
    const alertBox = document.getElementById('auth-alert');
    const name = document.getElementById('reg-name')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim().toLowerCase();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const password = document.getElementById('reg-password')?.value;
    const confirm = document.getElementById('reg-confirm')?.value;

    if (password !== confirm) {
      showAlert(alertBox, 'Գաղտնաբառերը չեն համապատասխանում։', 'error');
      return;
    }

    const users = getUsersDB();
    const exists = users.some(u => u.email.toLowerCase() === email);

    if (exists) {
      showAlert(alertBox, 'Այս էլ․ փոստով հաշիվ արդեն գոյություն ունի։', 'error');
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name,
      email: email,
      phone: phone || '',
      password: password,
      joined: '2026',
      address: { city: '', street: '', zip: '' },
      orders: []
    };

    users.push(newUser);
    saveUsersDB(users);
    setCurrentUser(newUser);

    showAlert(alertBox, 'Շնորհավորում ենք, Ձեր հաշիվը հաջողությամբ ստեղծվեց։', 'success');
    setTimeout(() => {
      renderAccountPage();
    }, 500);
  };

  // --- Show Alert Utility ---
  function showAlert(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = 'acc-alert visible ' + type;
  }

  // --- Logout Handler ---
  window.handleUserLogout = function () {
    setCurrentUser(null);
    renderAccountPage();
  };

  // --- Dashboard Tab Switcher ---
  window.switchDashTab = function (tabName) {
    document.querySelectorAll('.dash-nav-btn').forEach(btn => {
      if (btn.dataset.dashTab === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('.dash-panel').forEach(panel => {
      if (panel.id === 'dash-panel-' + tabName) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  };

  // --- Forgot Password Notice ---
  window.showForgotNotice = function () {
    const alertBox = document.getElementById('auth-alert');
    showAlert(alertBox, 'Գաղտնաբառի վերականգնման հղումն ուղարկվել է Ձեր էլ․ փոստին (դեմո ռեժիմ)։', 'success');
  };

  // --- Profile Update Handler ---
  window.handleProfileUpdate = function (e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    const alertBox = document.getElementById('profile-alert');
    const newName = document.getElementById('edit-name')?.value.trim();
    const newPhone = document.getElementById('edit-phone')?.value.trim();

    user.name = newName;
    user.phone = newPhone;

    // Update session & database
    setCurrentUser(user);
    const users = getUsersDB();
    const idx = users.findIndex(u => u.email === user.email);
    if (idx > -1) {
      users[idx].name = newName;
      users[idx].phone = newPhone;
      saveUsersDB(users);
    }

    showAlert(alertBox, 'Անձնական տվյալները հաջողությամբ թարմացվեցին։', 'success');
    renderUserBanner(user);
  };

  // --- Address Update Handler ---
  window.handleAddressUpdate = function (e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    const alertBox = document.getElementById('address-alert');
    user.address = {
      city: document.getElementById('addr-city')?.value.trim() || '',
      street: document.getElementById('addr-street')?.value.trim() || '',
      zip: document.getElementById('addr-zip')?.value.trim() || ''
    };

    setCurrentUser(user);
    const users = getUsersDB();
    const idx = users.findIndex(u => u.email === user.email);
    if (idx > -1) {
      users[idx].address = user.address;
      saveUsersDB(users);
    }

    showAlert(alertBox, 'Առաքման հասցեն հաջողությամբ պահպանվեց։', 'success');
  };

  // --- Main Page Renderer ---
  function renderAccountPage() {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const user = getCurrentUser();

    updateNavIconBadges(!!user);

    if (!user) {
      // Show Auth Section
      if (authSection) authSection.style.display = 'block';
      if (dashboardSection) dashboardSection.classList.add('hidden');
    } else {
      // Show Dashboard Section
      if (authSection) authSection.style.display = 'none';
      if (dashboardSection) dashboardSection.classList.remove('hidden');

      renderUserBanner(user);
      renderOrdersPanel(user);
      renderWishlistPanel();
      populateProfileForm(user);
      populateAddressForm(user);
    }
  }

  // Render User Banner
  function renderUserBanner(user) {
    const avatarEl = document.getElementById('user-avatar-badge');
    const nameEl = document.getElementById('dash-user-name');
    const emailEl = document.getElementById('dash-user-email');
    const joinedEl = document.getElementById('dash-user-joined');

    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (joinedEl) joinedEl.textContent = 'Անդամ ' + (user.joined || '2026') + ' թ․-ից';

    if (avatarEl && user.name) {
      const parts = user.name.split(' ');
      const initials = parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : user.name.substring(0, 2).toUpperCase();
      avatarEl.textContent = initials;
    }
  }

  // Render Orders Panel
  function renderOrdersPanel(user) {
    const container = document.getElementById('orders-container');
    const badge = document.getElementById('orders-count-badge');
    if (!container) return;

    const orders = user.orders || [];
    if (badge) badge.textContent = orders.length;

    if (orders.length === 0) {
      container.innerHTML = '<div class="empty-dash-state">' +
        '<p>Դուք դեռ չունեք կատարված պատվերներ։</p>' +
        '<a href="shop.html" class="btn-primary" style="display:inline-block; padding:12px 24px; text-decoration:none;">Գնալ խանութ</a>' +
      '</div>';
      return;
    }

    container.innerHTML = '<div class="orders-stack">' +
      orders.map(o => {
        let statusClass = 'status-pending';
        if (o.status === 'processing') statusClass = 'status-processing';
        if (o.status === 'completed') statusClass = 'status-completed';

        return '<div class="order-card-item">' +
          '<div class="order-card-header">' +
            '<div>' +
              '<div class="order-id-code">Պատվեր #' + o.id + '</div>' +
              '<div class="order-date-str">' + o.date + '</div>' +
            '</div>' +
            '<span class="order-status-badge ' + statusClass + '">' + (o.statusText || o.status) + '</span>' +
          '</div>' +
          '<div class="order-items-list">' +
            o.items.map(it => '<div class="order-sub-item"><span>' + it.name + ' × ' + it.qty + '</span><span>$' + it.price + '</span></div>').join('') +
          '</div>' +
          '<div class="order-card-footer">' +
            '<span>Ընդհանուր գումար:</span>' +
            '<span style="color:var(--amber); font-family:var(--mono);">$' + o.total + '</span>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  // Render Wishlist Panel
  function renderWishlistPanel() {
    const container = document.getElementById('wishlist-container');
    const badge = document.getElementById('wishlist-count-badge');
    if (!container) return;

    let wishlistIds = [];
    try {
      wishlistIds = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) {
      wishlistIds = [];
    }

    if (badge) badge.textContent = wishlistIds.length;

    const savedItems = CATALOG_PRODUCTS.filter(p => wishlistIds.includes(p.id));

    if (savedItems.length === 0) {
      container.innerHTML = '<div class="empty-dash-state">' +
        '<p>Դուք դեռ չունեք պահպանված զարդեր։</p>' +
        '<a href="shop.html" class="btn-primary" style="display:inline-block; padding:12px 24px; text-decoration:none;">Ուսումնասիրել տեսականին</a>' +
      '</div>';
      return;
    }

    container.innerHTML = '<div class="account-wishlist-grid">' +
      savedItems.map(p => {
        return '<div class="wishlist-card" data-id="' + p.id + '">' +
          '<div class="wishlist-card-media">' +
            '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
          '</div>' +
          '<div class="wishlist-card-body">' +
            '<div class="wishlist-card-name">' + p.name + '</div>' +
            '<div class="wishlist-card-price">$' + p.price + '</div>' +
            '<div class="wishlist-actions">' +
              '<button class="btn-wish-add" onclick="addWishlistItemToCart(' + p.id + ')">Ավելացնել զամբյուղ</button>' +
              '<button class="btn-wish-remove" onclick="removeWishlistItem(' + p.id + ')">×</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  // Add Item from Wishlist to Cart
  window.addWishlistItemToCart = function (id) {
    const prod = CATALOG_PRODUCTS.find(p => p.id === id);
    if (!prod) return;

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) { cart = []; }

    const idx = cart.findIndex(c => c.id === id);
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({ id: prod.id, name: prod.name, price: prod.price, img: prod.img, qty: 1 });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    // Update cart badge
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('[data-cart-count]').forEach(badge => badge.textContent = totalQty);

    alert('«' + prod.name + '» զարդն ավելացվեց զամբյուղում։');
  };

  // Remove Item from Wishlist
  window.removeWishlistItem = function (id) {
    let wishlistIds = [];
    try {
      wishlistIds = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) { wishlistIds = []; }

    wishlistIds = wishlistIds.filter(itemId => itemId !== id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
    renderWishlistPanel();
  };

  // Populate Profile Form
  function populateProfileForm(user) {
    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
  }

  // Populate Address Form
  function populateAddressForm(user) {
    const cityInput = document.getElementById('addr-city');
    const streetInput = document.getElementById('addr-street');
    const zipInput = document.getElementById('addr-zip');

    const addr = user.address || {};
    if (cityInput) cityInput.value = addr.city || '';
    if (streetInput) streetInput.value = addr.street || '';
    if (zipInput) zipInput.value = addr.zip || '';
  }

  // --- Initialize Page on Load ---
  document.addEventListener('DOMContentLoaded', function () {
    initUsersDatabase();
    renderAccountPage();
  });

})();

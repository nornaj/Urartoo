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

  function getCatalogProducts() {
    if (window.NovaSanity && window.NovaSanity._ready) {
      return window.NovaSanity.getProducts();
    }
    return [];
  }

  // Seed default demo user in local database
  function initUsersDatabase() {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
      if (!Array.isArray(users)) users = [];
    } catch (e) {
      users = [];
    }

    let modified = false;

    const adminUserExists = users.some(u => u && u.email && u.email.toLowerCase() === 'najaryannorayr209@gmail.com');
    if (!adminUserExists) {
      users.push({
        id: 'usr_admin_001',
        name: 'Նորայր Նաջարյան (Ադմին)',
        email: 'najaryannorayr209@gmail.com',
        password: 'Ananan05071998',
        phone: '+374 91 000000',
        joined: '2026',
        isAdmin: true,
        role: 'Super Admin',
        address: { city: 'Երևան', street: 'Կենտրոն', zip: '0001' },
        orders: []
      });
      modified = true;
    }

    const admin2UserExists = users.some(u => u && u.email && u.email.toLowerCase() === 'mineralsarm@gmail.com');
    if (!admin2UserExists) {
      users.push({
        id: 'usr_admin_002',
        name: 'Minerals Armenia (Ադմին)',
        email: 'mineralsarm@gmail.com',
        password: 'K7#vQ2!minerals',
        phone: '+374 91 000000',
        joined: '2026',
        isAdmin: true,
        role: 'Super Admin',
        address: { city: 'Երևան', street: 'Կենտրոն', zip: '0001' },
        orders: []
      });
      modified = true;
    }

    const admin3UserExists = users.some(u => u && u.email && u.email.toLowerCase() === 'norayrnajaryann@gmail.com');
    if (!admin3UserExists) {
      users.push({
        id: 'usr_admin_003',
        name: 'Նորայր Նաջարյան (Ադմին)',
        email: 'norayrnajaryann@gmail.com',
        password: 'Ananan05071998',
        phone: '+374 91 000000',
        joined: '2026',
        isAdmin: true,
        role: 'Super Admin',
        address: { city: 'Երևան', street: 'Կենտրոն', zip: '0001' },
        orders: []
      });
      modified = true;
    }

    const demoUserExists = users.some(u => u && u.email && u.email.toLowerCase() === 'anahit@example.com');
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
        orders: []
      });
      modified = true;
    }

    if (modified || localStorage.getItem(USERS_DB_KEY) === null) {
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

  // --- Sanity API helpers (direct, no dependency on NovaSanity loading) ---
  const SANITY_PROJECT = 'g1vi85kp';
  const SANITY_DATASET = 'production';
  const SANITY_API_VER = '2024-01-01';
  const SANITY_TOKEN = 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud';
  const SANITY_BASE = 'https://' + SANITY_PROJECT + '.api.sanity.io/v' + SANITY_API_VER + '/data';

  async function sanityQuery(groq) {
    const url = SANITY_BASE + '/query/' + SANITY_DATASET + '?query=' + encodeURIComponent(groq);
    const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + SANITY_TOKEN } });
    if (!res.ok) throw new Error('Sanity query failed: ' + res.status);
    const data = await res.json();
    return data.result || [];
  }

  async function sanityMutate(mutations) {
    const url = SANITY_BASE + '/mutate/' + SANITY_DATASET;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SANITY_TOKEN },
      body: JSON.stringify({ mutations: mutations })
    });
    if (!res.ok) throw new Error('Sanity mutate failed: ' + res.status);
    return await res.json();
  }

  // --- Sign In Handler (Sanity-first) ---
  window.handleUserSignIn = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const alertBox = document.getElementById('auth-alert');
    const emailEl = document.getElementById('signin-email');
    const passEl = document.getElementById('signin-password');

    const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
    const password = passEl ? passEl.value : '';

    if (!email || !password) {
      showAlert(alertBox, 'Խնդրում ենք լրացնել էլ․ փոստը և գաղտնաբառը։', 'error');
      return;
    }

    showAlert(alertBox, 'Ստուգվում են տվյալները...', 'info');

    try {
      // Query Sanity for a user with this email
      const groq = '*[_type == "userAccount" && email == "' + email + '"][0]{ _id, name, email, password, phone, joined, isAdmin, role, address, orders }';
      const foundUser = await sanityQuery(groq);

      if (!foundUser || !foundUser.email) {
        showAlert(alertBox, 'Այս էլ․ փոստով հաշիվ չի գտնվել։ Խնդրում ենք գրանցվել։', 'error');
        return;
      }

      if (String(foundUser.password) !== password) {
        showAlert(alertBox, 'Մուտքագրված գաղտնաբառը սխալ է։ Խնդրում ենք փորձել նորից։', 'error');
        return;
      }

      // Successful login
      const SUPER_ADMINS = ['najaryannorayr209@gmail.com', 'mineralsarm@gmail.com', 'norayrnajaryann@gmail.com'];
      const isSuper = SUPER_ADMINS.includes(email);

      const sessionUser = {
        id: foundUser._id,
        name: foundUser.name || email,
        email: foundUser.email,
        phone: foundUser.phone || '',
        joined: foundUser.joined || '2026',
        isAdmin: isSuper || Boolean(foundUser.isAdmin),
        role: isSuper ? 'Super Admin' : (foundUser.role || 'Customer'),
        address: foundUser.address || { city: '', street: '', zip: '' },
        orders: foundUser.orders || []
      };

      setCurrentUser(sessionUser);

      if (window.WooCommerceAdmin) {
        window.WooCommerceAdmin.currentUser = { email: sessionUser.email, role: sessionUser.role, name: sessionUser.name };
      }

      showAlert(alertBox, 'Բարի գալուստ, ' + sessionUser.name + '։ Մուտքը հաջողվեց։', 'success');
      setTimeout(function () { renderAccountPage(); }, 400);

    } catch (err) {
      console.error('Sign in error:', err);
      showAlert(alertBox, 'Կապի խնդիր՝ խնդրում ենք փորձել նորից։', 'error');
    }
  };

  // --- Register Handler (Sanity-first) ---
  window.handleUserRegister = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const alertBox = document.getElementById('auth-alert');
    const nameEl = document.getElementById('reg-name');
    const emailEl = document.getElementById('reg-email');
    const phoneEl = document.getElementById('reg-phone');
    const passEl = document.getElementById('reg-password');
    const confirmEl = document.getElementById('reg-confirm');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const password = passEl ? passEl.value : '';
    const confirm = confirmEl ? confirmEl.value : '';

    if (!name || !email || !password) {
      showAlert(alertBox, 'Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
      return;
    }

    if (password.length < 4) {
      showAlert(alertBox, 'Գաղտնաբառը պետք է պարունակի առնվազն 4 նիշ։', 'error');
      return;
    }

    if (password !== confirm) {
      showAlert(alertBox, 'Գաղտնաբառերը չեն համապատասխանում։', 'error');
      return;
    }

    showAlert(alertBox, 'Գրանցվում է...', 'info');

    try {
      var checkGroq = '*[_type == "userAccount" && email == "' + email + '"][0]{ _id, email }';
      var existing = await sanityQuery(checkGroq);

      if (existing && existing.email) {
        showAlert(alertBox, 'Այս էլ․ փոստով հաշիվ արդեն գոյություն ունի։', 'error');
        return;
      }

      var SUPER_ADMINS = ['najaryannorayr209@gmail.com', 'mineralsarm@gmail.com', 'norayrnajaryann@gmail.com'];
      var isSuper = SUPER_ADMINS.includes(email);
      var docId = 'user-' + email.replace(/[^a-z0-9]/gi, '-');

      var userDoc = {
        _id: docId,
        _type: 'userAccount',
        name: name,
        email: email,
        phone: phone,
        password: password,
        joined: String(new Date().getFullYear()),
        isAdmin: isSuper,
        role: isSuper ? 'Super Admin' : 'Customer',
        address: { city: '', street: '', zip: '' },
        orders: []
      };

      await sanityMutate([{ createOrReplace: userDoc }]);

      var sessionUser = {
        id: docId,
        name: name,
        email: email,
        phone: phone,
        joined: userDoc.joined,
        isAdmin: isSuper,
        role: userDoc.role,
        address: userDoc.address,
        orders: []
      };

      setCurrentUser(sessionUser);
      window.dispatchEvent(new CustomEvent('urartoo:users-updated', { detail: sessionUser }));

      showAlert(alertBox, 'Շնորհավորում ենք, Ձեր հաշիվը հաջողությամբ ստեղծվեց։', 'success');
      setTimeout(function () { renderAccountPage(); }, 400);

    } catch (err) {
      console.error('Registration error:', err);
      showAlert(alertBox, 'Գրանցման խնդիր՝ խնդրում ենք փորձել նորից։', 'error');
    }
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
      // Show Auth Section, Hide Dashboard
      if (authSection) {
        authSection.classList.remove('hidden');
        authSection.style.display = 'block';
      }
      if (dashboardSection) {
        dashboardSection.classList.add('hidden');
        dashboardSection.style.display = 'none';
      }
    } else {
      // Hide Auth Section, Show Dashboard
      if (authSection) {
        authSection.classList.add('hidden');
        authSection.style.display = 'none';
      }
      if (dashboardSection) {
        dashboardSection.classList.remove('hidden');
        dashboardSection.style.display = 'flex';
      }

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
    const adminBtn = document.getElementById('btn-admin-access');

    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (joinedEl) joinedEl.textContent = 'Անդամ ' + (user.joined || '2026') + ' թ․-ից';

    const userEmail = (user.email || '').toLowerCase();
    const isAdmin = user.isAdmin || userEmail === 'najaryannorayr209@gmail.com' || userEmail === 'mineralsarm@gmail.com' || userEmail === 'norayrnajaryann@gmail.com';
    if (adminBtn) {
      if (isAdmin) {
        adminBtn.classList.remove('hidden');
        adminBtn.style.display = 'inline-block';
      } else {
        adminBtn.classList.add('hidden');
        adminBtn.style.display = 'none';
      }
    }

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

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('msg') === 'unauthorized') {
      const alertBox = document.getElementById('auth-alert');
      if (alertBox) {
        showAlert(alertBox, '🔒 Ադմինիստրատորի էջ մուտք գործելու համար անհրաժեշտ է մուտք գործել ադմինիստրատորի հաշվով։', 'error');
      }
    }
  });

})();

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
        if (alertBox) {
          alertBox.innerHTML = 'Այս էլ․ փոստով հաշիվ չի գտնվել։ Կարող եք <a href="#" onclick="switchAuthTab(\'register\'); return false;" style="color:var(--amber); text-decoration:underline; font-weight:600;">գրանցվել</a>։';
          alertBox.className = 'acc-alert visible error';
        }
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
        _id: foundUser._id,
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

      // Sync local users database
      const users = getUsersDB();
      const idx = users.findIndex(u => u && u.email && u.email.toLowerCase() === email);
      if (idx > -1) {
        users[idx] = { ...users[idx], ...sessionUser };
      } else {
        users.push(sessionUser);
      }
      saveUsersDB(users);

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
        _id: docId,
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

      var users = getUsersDB();
      var idx = users.findIndex(u => u && u.email && u.email.toLowerCase() === email);
      if (idx > -1) {
        users[idx] = { ...users[idx], ...sessionUser };
      } else {
        users.push(sessionUser);
      }
      saveUsersDB(users);

      window.dispatchEvent(new CustomEvent('urartoo:users-updated', { detail: sessionUser }));
      window.dispatchEvent(new CustomEvent('urartoo:session-updated', { detail: sessionUser }));

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

  // --- Profile Update Handler (Sanity-First Cloud Sync) ---
  window.handleProfileUpdate = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const user = getCurrentUser();
    const alertBox = document.getElementById('profile-alert');
    const submitBtn = document.querySelector('#form-update-profile button[type="submit"]');

    if (!user || !user.email) {
      showAlert(alertBox, 'Խնդրում ենք նախ մուտք գործել համակարգ։', 'error');
      return;
    }

    const newName = document.getElementById('edit-name')?.value.trim();
    const newPhone = document.getElementById('edit-phone')?.value.trim() || '';

    if (!newName) {
      showAlert(alertBox, 'Անուն դաշտը չի կարող դատարկ լինել։', 'error');
      return;
    }

    const origBtnText = submitBtn ? submitBtn.textContent : 'Պահպանել տվյալները';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Պահպանվում է...';
    }
    showAlert(alertBox, 'Տվյալները պահպանվում են...', 'info');

    const email = user.email.trim().toLowerCase();
    const docId = user._id || user.id || ('user-' + email.replace(/[^a-z0-9]/gi, '-'));

    try {
      // 1. Mutate in Sanity CMS Cloud first
      try {
        await sanityMutate([
          {
            patch: {
              id: docId,
              set: {
                name: newName,
                phone: newPhone
              }
            }
          }
        ]);
      } catch (patchErr) {
        console.warn('Direct patch failed, falling back to query & createOrReplace:', patchErr);
        const found = await sanityQuery('*[_type == "userAccount" && email == "' + email + '"][0]{ _id, password, joined, isAdmin, role, address, orders }');
        const targetId = (found && found._id) ? found._id : docId;
        const fullDoc = {
          _id: targetId,
          _type: 'userAccount',
          name: newName,
          email: email,
          phone: newPhone,
          password: (found && found.password) || user.password || '',
          joined: (found && found.joined) || user.joined || String(new Date().getFullYear()),
          isAdmin: (found && found.isAdmin !== undefined) ? found.isAdmin : Boolean(user.isAdmin),
          role: (found && found.role) || user.role || (user.isAdmin ? 'Super Admin' : 'Customer'),
          address: (found && found.address) || user.address || { city: '', street: '', zip: '' },
          orders: (found && found.orders) || user.orders || []
        };
        await sanityMutate([{ createOrReplace: fullDoc }]);
      }

      // 2. Update current session and local database
      user.name = newName;
      user.phone = newPhone;
      setCurrentUser(user);

      const users = getUsersDB();
      const idx = users.findIndex(u => u && u.email && u.email.toLowerCase() === email);
      if (idx > -1) {
        users[idx].name = newName;
        users[idx].phone = newPhone;
      } else {
        users.push(user);
      }
      saveUsersDB(users);

      if (window.WooCommerceAdmin && window.WooCommerceAdmin.currentUser) {
        window.WooCommerceAdmin.currentUser.name = newName;
      }

      // 3. Update UI banner and badges
      renderUserBanner(user);
      window.dispatchEvent(new CustomEvent('urartoo:users-updated', { detail: user }));
      window.dispatchEvent(new CustomEvent('urartoo:session-updated', { detail: user }));

      showAlert(alertBox, 'Անձնական տվյալները հաջողությամբ պահպանվեցին։', 'success');
    } catch (err) {
      console.error('Profile update error:', err);
      showAlert(alertBox, 'Տվյալների պահպանման խնդիր՝ խնդրում ենք փորձել նորից։', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = origBtnText;
      }
    }
  };

  // --- Address Update Handler (Sanity-First Cloud Sync) ---
  window.handleAddressUpdate = async function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const user = getCurrentUser();
    const alertBox = document.getElementById('address-alert');
    const submitBtn = document.querySelector('#form-update-address button[type="submit"]');

    if (!user || !user.email) {
      showAlert(alertBox, 'Խնդրում ենք նախ մուտք գործել համակարգ։', 'error');
      return;
    }

    const city = document.getElementById('addr-city')?.value.trim() || '';
    const street = document.getElementById('addr-street')?.value.trim() || '';
    const zip = document.getElementById('addr-zip')?.value.trim() || '';
    const addressObj = { city, street, zip };

    const origBtnText = submitBtn ? submitBtn.textContent : 'Պահպանել հասցեն';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Պահպանվում է...';
    }
    showAlert(alertBox, 'Հասցեն պահպանվում է...', 'info');

    const email = user.email.trim().toLowerCase();
    const docId = user._id || user.id || ('user-' + email.replace(/[^a-z0-9]/gi, '-'));

    try {
      // 1. Mutate in Sanity CMS Cloud first
      try {
        await sanityMutate([
          {
            patch: {
              id: docId,
              set: {
                address: addressObj
              }
            }
          }
        ]);
      } catch (patchErr) {
        console.warn('Direct patch failed, falling back to query & createOrReplace:', patchErr);
        const found = await sanityQuery('*[_type == "userAccount" && email == "' + email + '"][0]{ _id, name, phone, password, joined, isAdmin, role, orders }');
        const targetId = (found && found._id) ? found._id : docId;
        const fullDoc = {
          _id: targetId,
          _type: 'userAccount',
          name: (found && found.name) || user.name || email,
          email: email,
          phone: (found && found.phone) || user.phone || '',
          password: (found && found.password) || user.password || '',
          joined: (found && found.joined) || user.joined || String(new Date().getFullYear()),
          isAdmin: (found && found.isAdmin !== undefined) ? found.isAdmin : Boolean(user.isAdmin),
          role: (found && found.role) || user.role || (user.isAdmin ? 'Super Admin' : 'Customer'),
          address: addressObj,
          orders: (found && found.orders) || user.orders || []
        };
        await sanityMutate([{ createOrReplace: fullDoc }]);
      }

      // 2. Update current session and local database
      user.address = addressObj;
      setCurrentUser(user);

      const users = getUsersDB();
      const idx = users.findIndex(u => u && u.email && u.email.toLowerCase() === email);
      if (idx > -1) {
        users[idx].address = addressObj;
      } else {
        users.push(user);
      }
      saveUsersDB(users);

      window.dispatchEvent(new CustomEvent('urartoo:users-updated', { detail: user }));
      window.dispatchEvent(new CustomEvent('urartoo:session-updated', { detail: user }));

      showAlert(alertBox, 'Առաքման հասցեն հաջողությամբ պահպանվեց։', 'success');
    } catch (err) {
      console.error('Address update error:', err);
      showAlert(alertBox, 'Հասցեի պահպանման խնդիր՝ խնդրում ենք փորձել նորից։', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = origBtnText;
      }
    }
  };

  // --- Background sync active session directly from Sanity Cloud ---
  async function syncCurrentSessionFromSanity() {
    const user = getCurrentUser();
    if (!user || !user.email) return;
    try {
      const email = user.email.trim().toLowerCase();
      const groq = '*[_type == "userAccount" && email == "' + email + '"][0]{ _id, name, email, phone, joined, isAdmin, role, address, orders }';
      const cloudUser = await sanityQuery(groq);
      if (cloudUser && cloudUser.email) {
        const SUPER_ADMINS = ['najaryannorayr209@gmail.com', 'mineralsarm@gmail.com', 'norayrnajaryann@gmail.com'];
        const isSuper = SUPER_ADMINS.includes(email);

        user._id = cloudUser._id;
        user.id = cloudUser._id;
        if (cloudUser.name) user.name = cloudUser.name;
        if (cloudUser.phone !== undefined) user.phone = cloudUser.phone;
        if (cloudUser.address) user.address = cloudUser.address;
        if (cloudUser.joined) user.joined = cloudUser.joined;
        user.isAdmin = isSuper || Boolean(cloudUser.isAdmin);
        user.role = isSuper ? 'Super Admin' : (cloudUser.role || 'Customer');
        if (Array.isArray(cloudUser.orders)) user.orders = cloudUser.orders;

        setCurrentUser(user);

        const users = getUsersDB();
        const idx = users.findIndex(u => u && u.email && u.email.toLowerCase() === email);
        if (idx > -1) {
          users[idx] = { ...users[idx], ...user };
        } else {
          users.push(user);
        }
        saveUsersDB(users);

        renderUserBanner(user);
        populateProfileForm(user);
        populateAddressForm(user);
        renderOrdersPanel(user);
      }
    } catch (err) {
      console.warn('Session sync from Sanity error:', err);
    }
  }

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

    if (nameEl) nameEl.textContent = user.name || user.email;
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

    if (avatarEl && (user.name || user.email)) {
      const displayName = (user.name || user.email).trim();
      const parts = displayName.split(/\s+/).filter(Boolean);
      let initials = '';
      if (parts.length > 1) {
        initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else if (displayName.length >= 2) {
        initials = displayName.substring(0, 2).toUpperCase();
      } else {
        initials = displayName.toUpperCase();
      }
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
            o.items.map(it => '<div class="order-sub-item"><span>' + it.name + ' × ' + it.qty + '</span><span>' + it.price + '֏' + '</span></div>').join('') +
          '</div>' +
          '<div class="order-card-footer">' +
            '<span>Ընդհանուր գումար:</span>' +
            '<span style="color:var(--amber); font-family:var(--mono);">' + o.total + '֏' + '</span>' +
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
      if (!Array.isArray(wishlistIds)) wishlistIds = [];
    } catch (e) {
      wishlistIds = [];
    }

    if (badge) badge.textContent = wishlistIds.length;

    const allProducts = getCatalogProducts();
    const savedItems = allProducts.filter(p => {
      return wishlistIds.some(wid => String(wid) === String(p.id) || (p._sanityId && String(wid) === String(p._sanityId)));
    });

    if (wishlistIds.length === 0 || savedItems.length === 0) {
      container.innerHTML = '<div class="empty-dash-state">' +
        '<p>' + (wishlistIds.length > 0 && allProducts.length === 0 ? 'Բեռնվում են պահպանված զարդերը...' : 'Դուք դեռ չունեք պահպանված զարդեր։') + '</p>' +
        '<a href="shop.html" class="btn-primary" style="display:inline-block; padding:12px 24px; text-decoration:none;">Ուսումնասիրել տեսականին</a>' +
      '</div>';
      return;
    }

    container.innerHTML = '<div class="account-wishlist-grid">' +
      savedItems.map(p => {
        const pId = p.id || p._sanityId;
        const pImg = p.img || p.image || 'Images/bracelet.webp';
        const formattedPrice = typeof p.price === 'number' ? (p.price + '֏') : p.price;
        return '<div class="wishlist-card" data-id="' + pId + '">' +
          '<div class="wishlist-card-media">' +
            '<a href="/product/' + (p.slug || pId) + '" style="display:block; width:100%; height:100%;"><img src="' + pImg + '" alt="' + p.name + '" loading="lazy"></a>' +
          '</div>' +
          '<div class="wishlist-card-body">' +
            '<div class="wishlist-card-name"><a href="/product/' + (p.slug || pId) + '" style="color:inherit;text-decoration:none;">' + p.name + '</a></div>' +
            '<div class="wishlist-card-price">' + formattedPrice + '</div>' +
            '<div class="wishlist-actions">' +
              '<button class="btn-wish-add" onclick="addWishlistItemToCart(\'' + pId + '\')">Ավելացնել զամբյուղ</button>' +
              '<button class="btn-wish-remove" onclick="removeWishlistItem(\'' + pId + '\')" title="Հեռացնել">×</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  // Add Item from Wishlist to Cart
  window.addWishlistItemToCart = function (id) {
    const allProducts = getCatalogProducts();
    const prod = allProducts.find(p => String(p.id) === String(id) || String(p._sanityId) === String(id));
    if (!prod) return;

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) { cart = []; }

    const idx = cart.findIndex(c => String(c.id) === String(prod.id) || (prod._sanityId && String(c.id) === String(prod._sanityId)) || (c._sanityId && String(c._sanityId) === String(prod._sanityId)));
    if (idx > -1) {
      cart[idx].qty = (cart[idx].qty || 1) + 1;
    } else {
      cart.push({
        id: prod.id || prod._sanityId,
        _sanityId: prod._sanityId,
        name: prod.name,
        price: Number(prod.price) || 0,
        img: prod.img || prod.image || 'Images/bracelet.webp',
        cat: prod.cat || prod.category || 'Մատանիներ',
        qty: 1
      });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    // Update cart badge
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    document.querySelectorAll('[data-cart-count]').forEach(badge => badge.textContent = totalQty);

    alert('«' + prod.name + '» զարդն ավելացվեց զամբյուղում։');
  };

  // Remove Item from Wishlist
  window.removeWishlistItem = function (id) {
    let wishlistIds = [];
    try {
      wishlistIds = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) { wishlistIds = []; }

    const targetIdStr = String(id);
    wishlistIds = wishlistIds.filter(itemId => String(itemId) !== targetIdStr);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
    renderWishlistPanel();
    window.dispatchEvent(new CustomEvent('urartoo:wishlist-updated', { detail: { id: targetIdStr, saved: false } }));
  };

  window.addEventListener('urartoo:wishlist-updated', function () {
    renderWishlistPanel();
  });
  window.addEventListener('storage', function (e) {
    if (e.key === WISHLIST_KEY) renderWishlistPanel();
  });
  window.addEventListener('sanityCatalogReady', function () {
    renderWishlistPanel();
  });

  if (window.NovaSanity) {
    window.NovaSanity.init().then(function () {
      renderWishlistPanel();
    });
  }

  // Populate Profile Form
  function populateProfileForm(user, force) {
    if (!user) return;
    const nameInput = document.getElementById('edit-name');
    const emailInput = document.getElementById('edit-email');
    const phoneInput = document.getElementById('edit-phone');

    if (nameInput && (force || document.activeElement !== nameInput)) {
      nameInput.value = user.name || '';
    }
    if (emailInput && (force || document.activeElement !== emailInput)) {
      emailInput.value = user.email || '';
    }
    if (phoneInput && (force || document.activeElement !== phoneInput)) {
      phoneInput.value = user.phone || '';
    }
  }

  // Populate Address Form
  function populateAddressForm(user, force) {
    if (!user) return;
    const cityInput = document.getElementById('addr-city');
    const streetInput = document.getElementById('addr-street');
    const zipInput = document.getElementById('addr-zip');

    const addr = user.address || {};
    if (cityInput && (force || document.activeElement !== cityInput)) {
      cityInput.value = addr.city || '';
    }
    if (streetInput && (force || document.activeElement !== streetInput)) {
      streetInput.value = addr.street || '';
    }
    if (zipInput && (force || document.activeElement !== zipInput)) {
      zipInput.value = addr.zip || '';
    }
  }

  // --- Dashboard Tab Switching ---
  window.switchDashTab = function (tabName) {
    const tabs = document.querySelectorAll('.dash-nav-btn');
    const panels = document.querySelectorAll('.dash-panel');

    tabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.dashTab === tabName);
    });

    panels.forEach(p => {
      const isTarget = p.id === 'dash-panel-' + tabName;
      p.classList.toggle('active', isTarget);
      if (isTarget) {
        p.style.display = 'block';
      } else {
        p.style.display = 'none';
      }
    });

    if (tabName === 'wishlist') {
      renderWishlistPanel();
    }
  };

  // --- Initialize Page on Load ---
  document.addEventListener('DOMContentLoaded', function () {
    initUsersDatabase();
    renderAccountPage();
    syncCurrentSessionFromSanity();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('msg') === 'unauthorized') {
      const alertBox = document.getElementById('auth-alert');
      if (alertBox) {
        showAlert(alertBox, '🔒 Ադմինիստրատորի էջ մուտք գործելու համար անհրաժեշտ է մուտք գործել ադմինիստրատորի հաշվով։', 'error');
      }
    }

    const targetTab = urlParams.get('tab') || (window.location.hash ? window.location.hash.replace('#', '') : null);
    if (targetTab && (targetTab === 'orders' || targetTab === 'wishlist' || targetTab === 'profile')) {
      window.switchDashTab(targetTab);
    }
  });

})();

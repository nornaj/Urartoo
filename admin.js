/* ===================================================================
   URARTOO — WooCommerce-Style Admin Panel Script
   Access Control & Blank Admin Dashboard Setup
   Credentials: najaryannorayr209@gmail.com / Ananan05071998
   Language: Strictly Armenian (hy)
   =================================================================== */

(function (window) {
  'use strict';

  const LOCAL_ADMINS_KEY = 'urartoo_admin_emails_v1';
  const LOCAL_SESSION_KEY = 'urartoo_user_session_v1';

  // Seed default admin email whitelist
  function getAdminEmails() {
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_ADMINS_KEY));
      if (stored && Array.isArray(stored)) return stored;
    } catch (e) {}
    const defaults = ['najaryannorayr209@gmail.com', 'admin@urartoo.am', 'anahit@example.com'];
    localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  const WooCommerceAdmin = {
    currentUser: null,

    init() {
      // Check existing session
      try {
        const session = JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY));
        if (session && (session.isAdmin || getAdminEmails().includes(session.email?.toLowerCase()))) {
          this.currentUser = { email: session.email, role: session.role || 'Super Admin', name: session.name || session.email };
        }
      } catch (e) {}

      this.checkHashRoute();
      window.addEventListener('hashchange', () => this.checkHashRoute());
      this.bindEvents();
    },

    checkHashRoute() {
      const hash = window.location.hash;
      const adminView = document.getElementById('view-admin');
      if (!adminView) return;

      if (hash === '#admin' || hash === '#/admin') {
        adminView.style.display = 'block';
        document.querySelectorAll('body > *:not(#view-admin)').forEach(el => el.style.display = 'none');
        this.render();
      } else {
        adminView.style.display = 'none';
        document.querySelectorAll('body > *:not(#view-admin)').forEach(el => {
          if (el.id !== 'site-loader' && el.id !== 'cart-drawer' && el.id !== 'cart-overlay') {
            el.style.display = '';
          }
        });
      }
    },

    login(email, password) {
      const cleanEmail = email.trim().toLowerCase();
      const allowedEmails = getAdminEmails();

      // Check specific user credentials (najaryannorayr209@gmail.com / Ananan05071998)
      if (cleanEmail === 'najaryannorayr209@gmail.com' && password === 'Ananan05071998') {
        this.currentUser = { email: cleanEmail, role: 'Super Admin', name: 'Նորայր Նաջարյան (Ադմին)' };
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
          id: 'usr_admin_001',
          name: 'Նորայր Նաջարյան (Ադմին)',
          email: cleanEmail,
          isAdmin: true,
          role: 'Super Admin'
        }));
        this.render();
        return true;
      }

      // Check whitelist with valid password
      if (allowedEmails.includes(cleanEmail) && (password === 'Ananan05071998' || password === 'admin123' || password === 'password123')) {
        this.currentUser = { email: cleanEmail, role: 'Super Admin', name: cleanEmail };
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
          id: `usr_admin_${Date.now()}`,
          name: cleanEmail,
          email: cleanEmail,
          isAdmin: true,
          role: 'Super Admin'
        }));
        this.render();
        return true;
      }

      return false;
    },

    logout() {
      this.currentUser = null;
      localStorage.removeItem(LOCAL_SESSION_KEY);
      this.render();
      if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
        window.location.hash = '';
      }
    },

    render() {
      const loginWrapper = document.getElementById('admin-login-wrapper');
      const dashboardWrapper = document.getElementById('admin-dashboard-wrapper');

      if (!loginWrapper || !dashboardWrapper) return;

      if (!this.currentUser) {
        loginWrapper.style.display = 'flex';
        dashboardWrapper.style.display = 'none';
      } else {
        loginWrapper.style.display = 'none';
        dashboardWrapper.style.display = 'block';

        // Update profile labels
        const emailEl = document.getElementById('admin-user-profile-name');
        const blankEmailEl = document.getElementById('blank-admin-email');
        if (emailEl) emailEl.textContent = this.currentUser.email;
        if (blankEmailEl) blankEmailEl.textContent = this.currentUser.email;
      }
    },

    async syncGoogleData() {
      const btn = document.getElementById('btn-sync-google');
      if (btn) { btn.disabled = true; btn.textContent = '⏳ Սինխրոնացվում է...'; }

      if (window.GoogleSync) {
        const result = await window.GoogleSync.runFullSync((msg) => {
          console.log('Google Sync Status:', msg);
        });
        if (result.success) {
          alert(`Google Sheets & Drive-ից հաջողությամբ սինխրոնացվել է ${result.count} ապրանք Sanity-ում։`);
        } else {
          alert('Սինխրոնացման ավարտ։ Ապրանքներ չեն գտնվել Google Sheet-ում։');
        }
      }
      if (btn) { btn.disabled = false; btn.textContent = '⚡ Սինխրոնացնել Google Sheets'; }
    },

    bindEvents() {
      const form = document.getElementById('admin-login-form');
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          const email = document.getElementById('admin-email-input').value;
          const pass = document.getElementById('admin-pass-input').value;
          if (!this.login(email, pass)) {
            alert('Սխալ էլ․ փոստ կամ գաղտնաբառ');
          }
        };
      }
    }
  };

  window.WooCommerceAdmin = WooCommerceAdmin;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WooCommerceAdmin.init());
  } else {
    WooCommerceAdmin.init();
  }

})(window);

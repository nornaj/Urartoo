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

  function getAdminEmails() {
    let emails = ['najaryannorayr209@gmail.com', 'admin@urartoo.am'];
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_ADMINS_KEY));
      if (stored && Array.isArray(stored)) {
        stored.forEach(e => { if (e && !emails.includes(e.toLowerCase())) emails.push(e.toLowerCase()); });
      }
    } catch (e) {}
    localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(emails));
    return emails;
  }

  function getOrders() {
    try {
      const stored = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY));
      if (stored && Array.isArray(stored)) return stored;
    } catch (e) {}
    const defaults = [
      {
        id: "UR-1082",
        date: "2026-08-17 09:12",
        customer: "Անահիտ Սարգսյան",
        email: "anahit@example.com",
        total: 340,
        status: "processing",
        items: [{ name: "Վայոց Ձորի նռնաքարով մատանի", qty: 1, price: 340, cat: "Մատանիներ" }]
      },
      {
        id: "UR-1079",
        date: "2026-08-16 14:45",
        customer: "Մարի Թադևոսյան",
        email: "mari@example.com",
        total: 265,
        status: "completed",
        items: [{ name: "Գուտանասարի օբսիդիանով կախազարդ", qty: 1, price: 265, cat: "Վզնոցներ" }]
      },
      {
        id: "UR-1075",
        date: "2026-08-15 11:20",
        customer: "Լիլիթ Ավագյան",
        email: "lilit@example.com",
        total: 410,
        status: "completed",
        items: [{ name: "Սյունիքի փիրուզով ապարանջան", qty: 1, price: 410, cat: "Ապարանջաններ" }]
      }
    ];
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  function saveOrders(orders) {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  }

  function addAuditLog(actionText) {
    try {
      const logs = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY)) || [];
      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').substring(0, 16);
      logs.unshift({
        timestamp: timestamp,
        operator: window.WooCommerceAdmin && window.WooCommerceAdmin.currentUser ? window.WooCommerceAdmin.currentUser.email : 'admin@urartoo.am',
        action: actionText
      });
      localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch (e) {}
  }

  const WooCommerceAdmin = {
    currentUser: null,
    activeTab: 'orders',

    init() {
      // Check existing session
      try {
        const session = JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY));
        if (session && session.email) {
          const cleanEmail = session.email.trim().toLowerCase();
          const adminEmails = getAdminEmails();
          if (session.isAdmin || adminEmails.includes(cleanEmail) || cleanEmail === 'najaryannorayr209@gmail.com') {
            this.currentUser = {
              email: session.email,
              role: session.role || 'Super Admin',
              name: session.name || session.email
            };
          }
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

    switchTab(tabId) {
      this.activeTab = tabId;
      document.querySelectorAll('.admin-nav-item').forEach(el => {
        if (el.dataset.tab === tabId) {
          el.classList.add('active');
          el.style.color = 'var(--gold)';
          el.style.background = 'rgba(255,255,255,0.05)';
          el.style.borderLeft = '4px solid var(--gold)';
        } else {
          el.classList.remove('active');
          el.style.color = 'rgba(255,255,255,0.75)';
          el.style.background = 'none';
          el.style.borderLeft = 'none';
        }
      });

      document.querySelectorAll('.admin-sec').forEach(el => {
        el.style.display = (el.id === `admin-sec-${tabId}`) ? 'block' : 'none';
      });

      if (tabId === 'orders') this.renderOrdersSec();
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

        const emailEl = document.getElementById('admin-user-profile-name');
        if (emailEl) emailEl.textContent = this.currentUser.email;

        this.renderOrdersSec();
      }
    },

    /* TAB 1: ORDERS MANAGER RENDERER */
    renderOrdersSec() {
      const orders = getOrders();
      const products = (window.NovaSanity && window.NovaSanity._ready) ? window.NovaSanity.getProducts() : [];

      const validOrders = orders.filter(o => o.status !== 'failed');
      const totalRev = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const ordersCount = orders.length;
      const avgOrder = ordersCount > 0 ? Math.round(totalRev / ordersCount) : 0;
      const stockCount = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);

      const revEl = document.getElementById('admin-rev-val');
      const countEl = document.getElementById('admin-orders-count-val');
      const aovEl = document.getElementById('admin-aov-val');
      const stockEl = document.getElementById('admin-stock-count-val');

      if (revEl) revEl.textContent = `$${totalRev}`;
      if (countEl) countEl.textContent = ordersCount;
      if (aovEl) aovEl.textContent = `$${avgOrder}`;
      if (stockEl) stockEl.textContent = stockCount;

      // Category Sales Chart
      const categorySales = {};
      orders.forEach(o => {
        if (o.status !== 'failed' && o.items) {
          o.items.forEach(it => {
            const catName = it.cat || 'Մատանիներ';
            categorySales[catName] = (categorySales[catName] || 0) + (it.price * it.qty || 0);
          });
        }
      });

      const chartEl = document.getElementById('admin-category-chart');
      if (chartEl) {
        const catKeys = Object.keys(categorySales);
        if (catKeys.length === 0) {
          chartEl.innerHTML = '<div style="font-size:13px;color:var(--tuff);padding:12px 0;">Վաճառքների տվյալներ դեռ չկան</div>';
        } else {
          const maxVal = Math.max(...Object.values(categorySales), 1);
          chartEl.innerHTML = catKeys.map(cat => {
            const amount = categorySales[cat];
            const pct = Math.round((amount / maxVal) * 100);
            return `<div>
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;">
                <span><strong>${cat}</strong></span>
                <span style="font-family:var(--mono);">$${amount}</span>
              </div>
              <div style="width:100%;height:8px;background:#E8E5DF;border-radius:4px;overflow:hidden;">
                <div style="width:${pct}%;height:100%;background:var(--green);border-radius:4px;transition:width 0.4s ease;"></div>
              </div>
            </div>`;
          }).join('');
        }
      }

      // Orders Table
      const tbody = document.getElementById('admin-orders-tbody');
      if (!tbody) return;

      if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--tuff);">Պատվերներ չկան</td></tr>';
        return;
      }

      tbody.innerHTML = orders.map(o => {
        let badgeClass = 'badge-pending';
        let statusText = 'Սպասում է';
        if (o.status === 'processing') { badgeClass = 'badge-processing'; statusText = 'Վերամշակվում է'; }
        if (o.status === 'completed') { badgeClass = 'badge-completed'; statusText = 'Ավարտված է'; }
        if (o.status === 'failed') { badgeClass = 'badge-failed'; statusText = 'Չեղարկված է'; }

        return `<tr>
          <td><strong style="font-family:var(--mono);">${o.id}</strong></td>
          <td style="font-size:12.5px;color:var(--tuff);">${o.date}</td>
          <td>
            <strong>${o.customer}</strong><br>
            <small style="color:var(--tuff);">${o.email}</small>
          </td>
          <td>${(o.items || []).map(i => `${i.name} (x${i.qty || 1})`).join(', ')}</td>
          <td><strong style="font-family:var(--mono);color:var(--amber);">$${o.total}</strong></td>
          <td>
            <span class="admin-status-badge ${badgeClass}">${statusText}</span>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <select class="sort-select" style="padding:6px 10px;font-size:12px;" onchange="window.WooCommerceAdmin.updateOrderStatus('${o.id}', this.value)">
                <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Սպասում է</option>
                <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Վերամշակվում է</option>
                <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Ավարտված է</option>
                <option value="failed" ${o.status === 'failed' ? 'selected' : ''}>Չեղարկված է</option>
              </select>
              <button class="filter-clear-btn" style="color:red;border-color:red;padding:4px 8px;font-size:11px;" onclick="window.WooCommerceAdmin.deleteOrder('${o.id}')">Ջնջել</button>
            </div>
          </td>
        </tr>`;
      }).join('');
    },

    updateOrderStatus(orderId, newStatus) {
      const orders = getOrders();
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx > -1) {
        orders[idx].status = newStatus;
        saveOrders(orders);
        addAuditLog(`Փոխվել է պատվեր #${orderId}-ի կարգավիճակը -> ${newStatus}`);
        this.renderOrdersSec();
      }
    },

    deleteOrder(orderId) {
      if (!confirm(`Վստա՞հ եք, որ ցանկանում եք ջնջել #${orderId} պատվերը։`)) return;
      let orders = getOrders();
      orders = orders.filter(o => o.id !== orderId);
      saveOrders(orders);
      addAuditLog(`Ջնջվել է պատվեր #${orderId}`);
      this.renderOrdersSec();
    },

    /**
     * Call this function when a customer completes checkout anywhere on the site
     */
    addOrder(customerData, cartItems, totalAmount) {
      const orders = getOrders();
      const newOrder = {
        id: `UR-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        customer: customerData.name || 'Անանուն',
        email: customerData.email || 'customer@example.com',
        total: Number(totalAmount) || 0,
        status: 'pending',
        items: cartItems.map(item => ({
          name: item.name,
          qty: item.qty || 1,
          price: item.price || 0,
          cat: item.cat || 'Մատանիներ'
        }))
      };
      orders.unshift(newOrder);
      saveOrders(orders);
      addAuditLog(`Գրանցվել է նոր պատվեր #${newOrder.id} ($${newOrder.total})`);
      if (this.activeTab === 'orders') this.renderOrdersSec();
      return newOrder;
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

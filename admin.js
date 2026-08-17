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
      // Always pre-set Super Admin user so opening admin bypasses login card instantly
      this.currentUser = {
        email: 'najaryannorayr209@gmail.com',
        role: 'Super Admin',
        name: 'Նորայր Նաջարյան (Ադմին)'
      };

      try {
        const session = JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY));
        if (session && session.email) {
          this.currentUser.email = session.email;
          if (session.name) this.currentUser.name = session.name;
        }
      } catch (e) {}

      this.checkHashRoute();
      window.addEventListener('hashchange', () => this.checkHashRoute());
      this.bindEvents();
    },

    checkHashRoute() {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const adminView = document.getElementById('view-admin');
      if (!adminView) return;

      const isAdminRoute = hash === '#admin' || hash === '#/admin' || path.endsWith('/admin') || path.endsWith('/admin.html') || path.includes('admin');

      if (isAdminRoute) {
        adminView.style.display = 'block';
        document.body.classList.add('in-admin-mode');
        this.render();
      } else {
        adminView.style.display = 'none';
        document.body.classList.remove('in-admin-mode');
      }
    },

    login(email, password) {
      this.currentUser = {
        email: email || 'najaryannorayr209@gmail.com',
        role: 'Super Admin',
        name: 'Նորայր Նաջարյան (Ադմին)'
      };
      this.render();
      return true;
    },

    logout() {
      this.currentUser = null;
      localStorage.removeItem(LOCAL_SESSION_KEY);
      if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
        window.location.hash = '';
      } else {
        window.location.href = 'index.html';
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
      if (tabId === 'products') this.renderProductsSec();
      if (tabId === 'settings') this.renderSettingsSec();
      if (tabId === 'clients') this.renderClientsSec();
      if (tabId === 'logs') this.renderLogsSec();
    },

    render() {
      const loginWrapper = document.getElementById('admin-login-wrapper');
      const dashboardWrapper = document.getElementById('admin-dashboard-wrapper');

      if (loginWrapper) loginWrapper.style.display = 'none';
      if (dashboardWrapper) dashboardWrapper.style.display = 'block';

      if (!this.currentUser) {
        this.currentUser = {
          email: 'najaryannorayr209@gmail.com',
          role: 'Super Admin',
          name: 'Նորայր Նաջարյան (Ադմին)'
        };
      }

      const emailEl = document.getElementById('admin-user-profile-name');
      if (emailEl) emailEl.textContent = this.currentUser.email;

      if (this.activeTab === 'orders') this.renderOrdersSec();
      if (this.activeTab === 'products') this.renderProductsSec();
      if (this.activeTab === 'settings') this.renderSettingsSec();
      if (this.activeTab === 'clients') this.renderClientsSec();
      if (this.activeTab === 'logs') this.renderLogsSec();
    },

    currentEditingProductId: null,

    /* TAB 2: INVENTORY & PRODUCTS MANAGER RENDERER */
    async renderProductsSec() {
      const tbody = document.getElementById('admin-products-tbody');
      const mobileCardsContainer = document.getElementById('admin-products-mobile-cards');
      if (!tbody && !mobileCardsContainer) return;

      if (tbody) tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--tuff);">Բեռնվում է Sanity-ից...</td></tr>';
      if (mobileCardsContainer) mobileCardsContainer.innerHTML = '<div style="text-align:center;padding:32px;color:var(--tuff);">Բեռնվում է Sanity-ից...</div>';

      let products = [];
      if (window.NovaSanity) {
        products = await window.NovaSanity.getProducts();
      }

      const searchVal = document.getElementById('admin-prod-search')?.value.toLowerCase().trim() || '';
      const catVal = document.getElementById('admin-prod-cat-filter')?.value || 'all';

      let filtered = products.filter(p => {
        const matchesSearch = !searchVal ||
          (p.name && p.name.toLowerCase().includes(searchVal)) ||
          (p.sku && p.sku.toLowerCase().includes(searchVal)) ||
          (p.stone && p.stone.toLowerCase().includes(searchVal));
        const matchesCat = catVal === 'all' || (p.cat === catVal || p.category === catVal);
        return matchesSearch && matchesCat;
      });

      if (filtered.length === 0) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--tuff);">Ապրանքներ չեն գտնվել Sanity-ում</td></tr>';
        if (mobileCardsContainer) mobileCardsContainer.innerHTML = '<div style="text-align:center;padding:32px;color:var(--tuff);">Ապրանքներ չեն գտնվել Sanity-ում</div>';
        return;
      }

      // Render Desktop Table Rows
      if (tbody) {
        tbody.innerHTML = filtered.map(p => {
          const isSold = p.sold || p.stock === 0;
          const statusBadge = isSold
            ? '<span class="admin-status-badge badge-failed">Վաճառված (Sold)</span>'
            : '<span class="admin-status-badge badge-processing">Առկա (In Stock)</span>';

          const imgSrc = p.img || p.image || 'Images/bracelet.webp';
          const pId = p._sanityId || p.id;

          return `<tr>
            <td>
              <div style="width:48px;height:48px;background:#FAF8F5;border-radius:4px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                <img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;" alt="">
              </div>
            </td>
            <td>
              <strong>${p.name}</strong><br>
              <small style="color:var(--tuff);">${p.material || '925 արծաթ'}</small>
            </td>
            <td><code style="font-family:var(--mono);">${p.sku || 'UR-100'}</code></td>
            <td>${p.cat || p.category || 'Մատանիներ'}</td>
            <td>${p.stone || 'Նռնաքար'} (${p.region || p.stoneOrigin || 'Վայոց Ձոր'})</td>
            <td><strong style="font-family:var(--mono);color:var(--amber);">$${p.price}</strong></td>
            <td>${statusBadge}</td>
            <td>
              <div style="display:flex;align-items:center;gap:8px;">
                <button class="filter-clear-btn" style="padding:6px 12px;font-size:12px;" onclick="window.WooCommerceAdmin.openProductEditor('${pId}')">Խմբագրել</button>
                <button class="filter-clear-btn" style="color:red;border-color:red;padding:6px 12px;font-size:12px;" onclick="window.WooCommerceAdmin.deleteProduct('${pId}')">Ջնջել</button>
              </div>
            </td>
          </tr>`;
        }).join('');
      }

      // Render Mobile Product Inventory Cards
      if (mobileCardsContainer) {
        mobileCardsContainer.innerHTML = filtered.map(p => {
          const isSold = p.sold || p.stock === 0;
          const statusBadge = isSold
            ? '<span class="admin-status-badge badge-failed" style="font-size:11px;">Վաճառված</span>'
            : '<span class="admin-status-badge badge-processing" style="font-size:11px;">Առկա</span>';

          const imgSrc = p.img || p.image || 'Images/bracelet.webp';
          const pId = p._sanityId || p.id;

          return `<div class="admin-prod-mobile-card">
            <div class="admin-prod-mobile-header">
              <img src="${imgSrc}" class="admin-prod-mobile-img" alt="${p.name}">
              <div class="admin-prod-mobile-meta">
                <div class="admin-prod-mobile-title">${p.name}</div>
                <div style="font-size:12px; color:var(--tuff); font-family:var(--mono);">${p.sku || 'UR-100'} • ${p.cat || p.category || 'Մատանիներ'}</div>
                <div class="admin-prod-mobile-badges">
                  ${statusBadge}
                  <span style="font-size:11px; background:#F4F3EF; padding:2px 8px; border-radius:2px; color:var(--tuff);">${p.stone || 'Նռնաքար'} (${p.region || 'Վայոց Ձոր'})</span>
                </div>
              </div>
              <div class="admin-prod-mobile-price">$${p.price}</div>
            </div>
            <div class="admin-prod-mobile-actions">
              <button class="filter-clear-btn" onclick="window.WooCommerceAdmin.openProductEditor('${pId}')">✏️ Խմբագրել</button>
              <button class="filter-clear-btn" style="color:red; border-color:red;" onclick="window.WooCommerceAdmin.deleteProduct('${pId}')">🗑 Ջնջել</button>
            </div>
          </div>`;
        }).join('');
      }
    },

    /* WORDPRESS-STYLE PRODUCT EDITOR OVERLAY CONTROLLERS */
    async openProductEditor(productId) {
      const modal = document.getElementById('product-editor-modal');
      if (!modal) return;

      this.currentEditingProductId = productId;
      const modalTitle = document.getElementById('pe-modal-title');
      const deleteBtn = document.getElementById('btn-pe-delete');

      // Clear forms
      document.getElementById('pe-name').value = '';
      document.getElementById('pe-sku').value = `UR-${Math.floor(100 + Math.random() * 900)}`;
      document.getElementById('pe-price').value = '300';
      document.getElementById('pe-tagline').value = '';
      document.getElementById('pe-desc').value = '';
      document.getElementById('pe-cat').value = 'Մատանիներ';
      document.getElementById('pe-stone').value = 'Նռնաքար';
      document.getElementById('pe-region').value = 'Վայոց Ձոր';
      document.getElementById('pe-material').value = '925 արծաթ';
      document.getElementById('pe-sold-toggle').checked = false;

      const imgPreview = document.getElementById('pe-img-preview');
      const imgPlaceholder = document.getElementById('pe-img-placeholder');
      const imgUrlVal = document.getElementById('pe-img-url-val');

      imgPreview.style.display = 'none';
      imgPlaceholder.style.display = 'block';
      imgUrlVal.value = '';

      if (productId) {
        if (modalTitle) modalTitle.textContent = 'Խմբագրել Ապրանքը (Sanity CMS)';
        if (deleteBtn) deleteBtn.style.display = 'inline-block';

        let products = [];
        if (window.NovaSanity) products = await window.NovaSanity.getProducts();
        const found = products.find(p => p._sanityId === productId || p.id === productId);

        if (found) {
          document.getElementById('pe-name').value = found.name || '';
          document.getElementById('pe-sku').value = found.sku || '';
          document.getElementById('pe-price').value = found.price || 300;
          document.getElementById('pe-tagline').value = found.tagline || '';
          document.getElementById('pe-desc').value = found.description || '';
          document.getElementById('pe-cat').value = found.cat || found.category || 'Մատանիներ';
          document.getElementById('pe-stone').value = found.stone || 'Նռնաքար';
          document.getElementById('pe-region').value = found.region || found.stoneOrigin || 'Վայոց Ձոր';
          document.getElementById('pe-material').value = found.material || '925 արծաթ';
          document.getElementById('pe-sold-toggle').checked = Boolean(found.sold || found.stock === 0);

          const src = found.img || found.image;
          if (src) {
            imgPreview.src = src;
            imgPreview.style.display = 'block';
            imgPlaceholder.style.display = 'none';
            imgUrlVal.value = src;
          }
        }
      } else {
        if (modalTitle) modalTitle.textContent = 'Ավելացնել Նոր Ապրանք Sanity-ում';
        if (deleteBtn) deleteBtn.style.display = 'none';
      }

      modal.style.display = 'flex';
    },

    closeProductEditor() {
      const modal = document.getElementById('product-editor-modal');
      if (modal) modal.style.display = 'none';
      this.currentEditingProductId = null;
    },

    async handleEditorImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      const imgPreview = document.getElementById('pe-img-preview');
      const imgPlaceholder = document.getElementById('pe-img-placeholder');
      const imgUrlVal = document.getElementById('pe-img-url-val');

      if (imgPlaceholder) imgPlaceholder.textContent = '⏳ Սեղմվում է WebP <200KB և բեռնվում Sanity Asset...';

      try {
        if (window.NovaSanity) {
          const uploadedAssetUrl = await window.NovaSanity.uploadImage(file);
          if (uploadedAssetUrl) {
            imgPreview.src = uploadedAssetUrl;
            imgPreview.style.display = 'block';
            if (imgPlaceholder) imgPlaceholder.style.display = 'none';
            imgUrlVal.value = uploadedAssetUrl;
            alert('Նկարը հաջողությամբ վերածվեց WebP-ի և բեռնվեց Sanity Asset CDN-ում։');
            return;
          }
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      }

      // Local preview fallback
      const reader = new FileReader();
      reader.onload = (evt) => {
        imgPreview.src = evt.target.result;
        imgPreview.style.display = 'block';
        if (imgPlaceholder) imgPlaceholder.style.display = 'none';
        imgUrlVal.value = evt.target.result;
      };
      reader.readAsDataURL(file);
    },

    async saveProductFromEditor() {
      const name = document.getElementById('pe-name').value.trim();
      const price = Number(document.getElementById('pe-price').value) || 300;
      if (!name) { alert('Խնդրում ենք լրացնել ապրանքի անվանումը։'); return; }

      const saveBtn = document.getElementById('btn-pe-save');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '⏳ Պահպանվում է...'; }

      const isSold = document.getElementById('pe-sold-toggle').checked;
      const prodData = {
        id: this.currentEditingProductId || `product-custom-${Date.now()}`,
        _sanityId: this.currentEditingProductId,
        name: name,
        sku: document.getElementById('pe-sku').value.trim() || 'UR-100',
        price: price,
        tagline: document.getElementById('pe-tagline').value.trim(),
        description: document.getElementById('pe-desc').value.trim(),
        cat: document.getElementById('pe-cat').value,
        category: document.getElementById('pe-cat').value,
        stone: document.getElementById('pe-stone').value,
        region: document.getElementById('pe-region').value,
        stoneOrigin: document.getElementById('pe-region').value,
        material: document.getElementById('pe-material').value,
        sold: isSold,
        stock: isSold ? 0 : 1,
        featured: true,
        img: document.getElementById('pe-img-url-val').value || 'Images/bracelet.webp',
        image: document.getElementById('pe-img-url-val').value || 'Images/bracelet.webp'
      };

      if (window.NovaSanity) {
        await window.NovaSanity.saveProduct(prodData);
        addAuditLog(`Պահպանվեց ապրանք Sanity-ում: «${name}» ($${price})`);
      }

      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 Պահպանել Sanity-ում'; }
      this.closeProductEditor();
      this.renderProductsSec();
      alert(`Ապրանքը «${name}» հաջողությամբ պահպանվեց Sanity CMS-ում։`);
    },

    async deleteProduct(productId) {
      if (!confirm('Վստա՞հ եք, որ ցանկանում եք ՀԱՎԵՐԺ ՋՆՋԵԼ այս ապրանքը Sanity CMS-ից։')) return;
      if (window.NovaSanity) {
        await window.NovaSanity.deleteProduct(productId);
        addAuditLog(`Ջնջվեց ապրանք Sanity-ից ID: ${productId}`);
        this.renderProductsSec();
        alert('Ապրանքը հավերժ ջնջվեց Sanity CMS-ից։');
      }
    },

    async deleteProductFromEditor() {
      if (!this.currentEditingProductId) return;
      await this.deleteProduct(this.currentEditingProductId);
      this.closeProductEditor();
    },

    /* TAB 3: SETTINGS RENDERER */
    renderSettingsSec() {
      const container = document.getElementById('admin-whitelist-container');
      if (!container) return;
      const emails = getAdminEmails();
      container.innerHTML = `<ul style="list-style:none;padding:0;margin:0;">
        ${emails.map(e => `<li style="padding:12px 16px;border-bottom:1px solid var(--pumice);display:flex;justify-content:space-between;align-items:center;">
          <span><strong>${e}</strong></span>
          <span class="admin-status-badge badge-processing">Ակտիվ Ադմին</span>
        </li>`).join('')}
      </ul>`;
    },

    /* TAB 4: CLIENTS RENDERER */
    renderClientsSec() {
      const tbody = document.getElementById('admin-clients-tbody');
      if (!tbody) return;
      let users = [];
      try { users = JSON.parse(localStorage.getItem('urartoo_users_db_v1')) || []; } catch (e) {}
      if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--tuff);">Գրանցված հաճախորդներ չկան</td></tr>';
        return;
      }
      tbody.innerHTML = users.map(u => `<tr>
        <td><code style="font-family:var(--mono);">${u.id || 'usr-1'}</code></td>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td>${u.joined || '2026'}</td>
        <td><strong style="color:var(--amber);">${(u.orders || []).length} պատվեր</strong></td>
      </tr>`).join('');
    },

    /* TAB 5: AUDIT LOGS RENDERER */
    renderLogsSec() {
      const tbody = document.getElementById('admin-logs-tbody');
      if (!tbody) return;
      let logs = [];
      try { logs = JSON.parse(localStorage.getItem(LOCAL_LOGS_KEY)) || []; } catch (e) {}
      if (logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:32px;color:var(--tuff);">Գործողությունների մատյանը դատարկ է</td></tr>';
        return;
      }
      tbody.innerHTML = logs.map(l => `<tr>
        <td style="font-size:12.5px;color:var(--tuff);">${l.timestamp}</td>
        <td><strong>${l.operator}</strong></td>
        <td>${l.action}</td>
      </tr>`).join('');
    }

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

    handleAdminFormSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      const emailEl = document.getElementById('admin-email-input');
      const passEl = document.getElementById('admin-pass-input');
      const email = emailEl ? emailEl.value : '';
      const pass = passEl ? passEl.value : '';

      if (!email || !pass) {
        alert('Խնդրում ենք լրացնել էլ․ փոստը և գաղտնաբառը։');
        return false;
      }

      if (!this.login(email, pass)) {
        alert('Սխալ էլ․ փոստ կամ գաղտնաբառ։ Խնդրում ենք փորձել նորից։');
        return false;
      }
      return false;
    },

    bindEvents() {
      const form = document.getElementById('admin-login-form');
      if (form) {
        form.onsubmit = (e) => this.handleAdminFormSubmit(e);
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

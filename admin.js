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
    let emails = ['najaryannorayr209@gmail.com', 'mineralsarm@gmail.com', 'norayrnajaryann@gmail.com'];
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
    const defaults = [];
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
        operator: window.WooCommerceAdmin && window.WooCommerceAdmin.currentUser ? window.WooCommerceAdmin.currentUser.email : 'mineralsarm@gmail.com',
        action: actionText
      });
      localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch (e) {}
  }

  var _switchingTab = false;
  window.switchAdminTab = function (tabName) {
    if (_switchingTab) return;
    _switchingTab = true;

    try {
      const validTabs = ['orders', 'products', 'clients', 'journal'];
      const activeTab = validTabs.includes(tabName) ? tabName : 'orders';

      console.log('[Admin] switchAdminTab →', activeTab);

      validTabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        const sec = document.getElementById(`admin-sec-${t}`);
        const isActive = (t === activeTab);

        if (btn) {
          if (isActive) {
            btn.classList.add('active');
            btn.style.color = 'var(--gold)';
            btn.style.background = 'rgba(255,255,255,0.05)';
            btn.style.borderLeft = '4px solid var(--gold)';
          } else {
            btn.classList.remove('active');
            btn.style.color = 'rgba(255,255,255,0.75)';
            btn.style.background = 'none';
            btn.style.borderLeft = 'none';
          }
        }

        if (sec) {
          sec.style.setProperty('display', isActive ? 'block' : 'none', 'important');
        }
      });

      try {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, null, `#${activeTab}`);
        }
      } catch (e) {}

      if (window.WooCommerceAdmin) {
        window.WooCommerceAdmin.activeTab = activeTab;
        if (activeTab === 'products') window.WooCommerceAdmin.renderProductsSec();
        else if (activeTab === 'clients') window.WooCommerceAdmin.renderClientsSec();
        else if (activeTab === 'journal') window.WooCommerceAdmin.renderJournalSec();
        else if (activeTab === 'settings') window.WooCommerceAdmin.renderSettingsSec();
        else window.WooCommerceAdmin.renderOrdersSec();
      }
    } catch (err) {
      console.error('[Admin] switchAdminTab error:', err);
    } finally {
      _switchingTab = false;
    }
  };

  const WooCommerceAdmin = {
    currentUser: null,
    activeTab: 'orders',

    getCurrentSession() {
      try {
        const session = JSON.parse(localStorage.getItem(LOCAL_SESSION_KEY));
        if (session && session.email) {
          const lowerEmail = session.email.toLowerCase();
          const allowedAdmins = getAdminEmails();
          if (session.isAdmin === true || allowedAdmins.includes(lowerEmail)) {
            return {
              email: session.email,
              role: 'Super Admin',
              name: session.name || session.email,
              isAdmin: true
            };
          }
        }
      } catch (e) {}
      return null;
    },

    init() {
      this.currentUser = this.getCurrentSession();

      const initHash = (window.location.hash || '').replace('#', '').replace('/', '').trim().toLowerCase();
      if (initHash === 'products' || initHash === 'inventory') {
        this.activeTab = 'products';
      } else if (initHash === 'journal' || initHash === 'blog') {
        this.activeTab = 'journal';
      } else if (initHash === 'clients') {
        this.activeTab = 'clients';
      } else {
        this.activeTab = 'orders';
      }

      this.checkHashRoute();
      window.addEventListener('hashchange', () => this.checkHashRoute());
      this.bindEvents();
    },

    checkHashRoute() {
      const rawHash = window.location.hash || '';
      const hash = rawHash.replace('#', '').replace('/', '').trim().toLowerCase();
      const path = window.location.pathname;
      const adminView = document.getElementById('view-admin');
      if (!adminView) return;

      const isAdminRoute = rawHash.includes('admin') || hash === 'products' || hash === 'orders' || hash === 'clients' || hash === 'journal' || hash === 'blog' || path.endsWith('/admin') || path.endsWith('/admin.html') || path.includes('admin');

      if (isAdminRoute) {
        const session = this.getCurrentSession();
        if (!session) {
          adminView.style.display = 'none';
          document.body.classList.remove('in-admin-mode');
          if (!window.location.pathname.endsWith('account.html')) {
            window.location.href = 'account.html?redirect=admin&msg=unauthorized';
          }
          return;
        }

        this.currentUser = session;
        adminView.style.display = 'block';
        document.body.classList.add('in-admin-mode');

        if (hash === 'products' || hash === 'inventory') {
          this.activeTab = 'products';
        } else if (hash === 'journal' || hash === 'blog') {
          this.activeTab = 'journal';
        } else if (hash === 'clients') {
          this.activeTab = 'clients';
        } else if (hash === 'orders') {
          this.activeTab = 'orders';
        }

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
      if (window.switchAdminTab) {
        window.switchAdminTab(tabId);
      }
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

      if (window.switchAdminTab) {
        window.switchAdminTab(this.activeTab || 'orders');
      }
    },

    currentEditingProductId: null,

    /* TAB 2: INVENTORY & PRODUCTS MANAGER RENDERER */
    async renderProductsSec() {
      const tbody = document.getElementById('admin-products-tbody');
      const mobileCardsContainer = document.getElementById('admin-products-mobile-cards');
      if (!tbody && !mobileCardsContainer) return;

      try {
        if (window.NovaSanity) {
          let liveProducts = window.NovaSanity.getProducts();
          if (!window.NovaSanity._ready) {
            liveProducts = await window.NovaSanity.init();
          }
          this.populateProductsHTML(liveProducts || []);
          return;
        }
      } catch (err) {
        console.error('Error fetching Sanity products:', err);
      }

      this.populateProductsHTML([]);
    },

    populateProductsHTML(products) {
      const tbody = document.getElementById('admin-products-tbody');
      const mobileCardsContainer = document.getElementById('admin-products-mobile-cards');
      if (!tbody && !mobileCardsContainer) return;

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
        if (tbody) tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:36px 16px;color:var(--tuff);">Ապրանքներ չեն գտնվել</td></tr>';
        if (mobileCardsContainer) mobileCardsContainer.innerHTML = '<div style="text-align:center;padding:32px;color:var(--tuff);">Ապրանքներ չեն գտնվել</div>';
        return;
      }

      if (tbody) {
        tbody.innerHTML = filtered.map((p, idx) => {
          const isSold = p.sold || p.stock === 0;
          const statusBadge = isSold
            ? '<span class="admin-status-badge badge-failed">Վաճառված</span>'
            : '<span class="admin-status-badge badge-processing">Առկա</span>';

          const imgSrc = p.img || p.image || 'Images/bracelet.webp';
          const pId = p._sanityId || p.id;
          const currentStock = p.stock !== undefined ? p.stock : (p.sold ? 0 : 1);
          const pSku = p.sku || ('UR-' + String(idx + 1).padStart(3, '0'));

          return `<tr>
            <td style="text-align:center;">
              <input type="checkbox" class="admin-prod-checkbox" value="${pId}" style="width:16px; height:16px; cursor:pointer;">
            </td>
            <td>
              <div style="width:48px;height:48px;background:#FAF8F5;border-radius:4px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                <img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;" alt="">
              </div>
            </td>
            <td>
              <strong>${p.name}</strong><br>
              <small style="color:var(--tuff);">${p.material || '925 արծաթ'}</small>
            </td>
            <td><code style="font-family:var(--mono);">${pSku}</code></td>
            <td>${p.cat || p.category || 'Մատանիներ'}</td>
            <td>${p.stone || 'Նռնաքար'} (${p.region || p.stoneOrigin || 'Վայոց Ձոր'})</td>
            <td><strong style="font-family:var(--mono);color:var(--amber);">${p.price}֏</strong></td>
            <td style="text-align:center;">
              <input type="number" min="0" value="${currentStock}" onchange="window.WooCommerceAdmin.updateQuickStock('${pId}', this.value)" style="width:65px; padding:6px 8px; border:1px solid var(--pumice); border-radius:4px; font-weight:700; font-family:var(--mono); text-align:center; outline:none; background:#FFF;">
            </td>
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

      if (mobileCardsContainer) {
        mobileCardsContainer.innerHTML = filtered.map((p, idx) => {
          const isSold = p.sold || p.stock === 0;
          const statusBadge = isSold
            ? '<span class="admin-status-badge badge-failed" style="font-size:11px;">Վաճառված</span>'
            : '<span class="admin-status-badge badge-processing" style="font-size:11px;">Առկա</span>';

          const imgSrc = p.img || p.image || 'Images/bracelet.webp';
          const pId = p._sanityId || p.id;
          const currentStock = p.stock !== undefined ? p.stock : (p.sold ? 0 : 1);
          const pSku = p.sku || ('UR-' + String(idx + 1).padStart(3, '0'));

          return `<div class="admin-prod-mobile-card">
            <div class="admin-prod-mobile-header">
              <input type="checkbox" class="admin-prod-checkbox" value="${pId}" style="width:18px; height:18px; cursor:pointer; margin-right:6px;">
              <img src="${imgSrc}" class="admin-prod-mobile-img" alt="${p.name}">
              <div class="admin-prod-mobile-meta">
                <div class="admin-prod-mobile-title">${p.name}</div>
                <div style="font-size:12px; color:var(--tuff); font-family:var(--mono);">${pSku} • ${p.cat || p.category || 'Մատանիներ'}</div>
                <div class="admin-prod-mobile-badges">
                  ${statusBadge}
                  <span style="font-size:11px; background:#F4F3EF; padding:2px 8px; border-radius:2px; color:var(--tuff);">${p.stone || 'Նռնաքար'} (${p.region || 'Վայոց Ձոր'})</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px; margin-top:6px;">
                  <span style="font-size:11.5px; color:var(--tuff); font-weight:600;">Քանակ:</span>
                  <input type="number" min="0" value="${currentStock}" onchange="window.WooCommerceAdmin.updateQuickStock('${pId}', this.value)" style="width:55px; padding:4px 6px; border:1px solid var(--pumice); border-radius:4px; font-weight:700; font-family:var(--mono); text-align:center; font-size:12px; background:#FFF;">
                </div>
              </div>
              <div class="admin-prod-mobile-price">${p.price}֏</div>
            </div>
            <div class="admin-prod-mobile-actions">
              <button class="filter-clear-btn" onclick="window.WooCommerceAdmin.openProductEditor('${pId}')">✏️ Խմբագրել</button>
              <button class="filter-clear-btn" style="color:red; border-color:red;" onclick="window.WooCommerceAdmin.deleteProduct('${pId}')">🗑 Ջնջել</button>
            </div>
          </div>`;
        }).join('');
      }

      if (window.initCustomSelects) {
        setTimeout(() => window.initCustomSelects(), 50);
      }
    },

    /* BULK ACTIONS CONTROLLERS */
    toggleSelectAllProducts(isChecked) {
      document.querySelectorAll('.admin-prod-checkbox').forEach(cb => {
        cb.checked = isChecked;
      });
    },

    /* CUSTOM BOTTOM-LEFT TOAST NOTIFICATION & ACTION LOADER SYSTEM */
    showToast(msg, type = 'info', duration = 3500) {
      if (!msg) return null;
      let container = document.getElementById('admin-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'admin-toast-container';
        container.style.cssText = 'position:fixed; bottom:24px; left:24px; z-index:100000; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      
      let borderColor = '#C9A227';
      let icon = '';

      if (type === 'loading') {
        borderColor = '#C9A227';
        icon = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C9A227" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: urartooSpin 0.8s linear infinite; flex-shrink:0;"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/></svg>`;
      } else if (type === 'success') {
        borderColor = '#2D6B4F';
        icon = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else if (type === 'danger' || type === 'delete') {
        borderColor = '#D9534F';
        icon = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D9534F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
      } else if (type === 'sync') {
        borderColor = '#C9A227';
        icon = `<span style="color:#C9A227; font-weight:bold; font-size:15px; flex-shrink:0;">⚡</span>`;
      } else {
        icon = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C2A379" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
      }

      toast.style.cssText = `
        background: #17181A;
        color: #FFFFFF;
        font-family: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.2px;
        padding: 13px 20px;
        border-left: 4px solid ${borderColor};
        border-radius: 4px;
        box-shadow: 0 12px 36px rgba(0,0,0,0.55);
        display: flex;
        align-items: center;
        gap: 12px;
        opacity: 0;
        transform: translateY(16px);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: auto;
        max-width: 440px;
        line-height: 1.4;
      `;

      toast.innerHTML = `${icon}<span class="toast-msg-text">${msg}</span>`;
      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });

      let autoTimer = null;
      if (duration > 0) {
        autoTimer = setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(16px)';
          setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
          }, 350);
        }, duration);
      }

      return {
        update(newMsg, newType = 'success', autoCloseDuration = 3500) {
          if (autoTimer) clearTimeout(autoTimer);

          let newBorderColor = '#2D6B4F';
          let newIcon = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>`;

          if (newType === 'danger' || newType === 'delete') {
            newBorderColor = '#D9534F';
            newIcon = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D9534F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
          } else if (newType === 'sync') {
            newBorderColor = '#C9A227';
            newIcon = `<span style="color:#C9A227; font-weight:bold; font-size:15px; flex-shrink:0;">⚡</span>`;
          }

          toast.style.borderLeftColor = newBorderColor;
          toast.innerHTML = `${newIcon}<span class="toast-msg-text">${newMsg}</span>`;

          if (autoCloseDuration > 0) {
            setTimeout(() => {
              toast.style.opacity = '0';
              toast.style.transform = 'translateY(16px)';
              setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
              }, 350);
            }, autoCloseDuration);
          }
        },
        remove() {
          if (autoTimer) clearTimeout(autoTimer);
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(16px)';
          setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
          }, 350);
        }
      };
    },

    getSelectedProductIds() {
      const checkboxes = document.querySelectorAll('.admin-prod-checkbox:checked');
      const ids = new Set();
      checkboxes.forEach(cb => ids.add(cb.value));
      return Array.from(ids);
    },

    async executeBulkAction() {
      const selectEl = document.getElementById('admin-bulk-action-select');
      const action = selectEl ? selectEl.value : '';

      if (!action) return;

      const selectedIds = this.getSelectedProductIds();
      if (selectedIds.length === 0) {
        this.showToast('Խնդրում ենք ընտրել առնվազն 1 ապրանք:', 'info', 3000);
        return;
      }

      if (action === 'delete') {
        const loadingToast = this.showToast(`Ջնջվում են ընտրված ${selectedIds.length} ապրանքները...`, 'loading', 0);

        let deletedCount = 0;
        for (const id of selectedIds) {
          try {
            if (window.NovaSanity) {
              await window.NovaSanity.deleteProduct(id);
              deletedCount++;
            }
          } catch (e) {
            console.error('Error bulk deleting product:', id, e);
          }
        }

        addAuditLog(`Խմբաքանակային ջնջում: ${deletedCount} ապրանք(ներ)`);

        if (selectEl) selectEl.value = '';
        const selectAll = document.getElementById('admin-prod-select-all');
        if (selectAll) selectAll.checked = false;

        this.renderProductsSec();

        if (loadingToast) {
          loadingToast.update(`${deletedCount} ապրանք հաջողությամբ ջնջվեց։`, 'danger', 4000);
        }
      }
    },

    async updateQuickStock(productId, newStockVal) {
      const stockNum = Math.max(0, parseInt(newStockVal, 10) || 0);
      const isSold = stockNum === 0;

      try {
        if (window.NovaSanity) {
          const products = await window.NovaSanity.getProducts();
          const found = products.find(p => String(p._sanityId) === String(productId) || String(p.id) === String(productId));

          if (found) {
            const loadingToast = this.showToast(`Թարմացվում է «${found.name}» քանակը...`, 'loading', 0);
            found.stock = stockNum;
            found.sold = isSold;
            await window.NovaSanity.saveProduct(found);
            addAuditLog(`Քանակի արագ փոփոխություն: «${found.name}» -> ${stockNum}`);

            if (loadingToast) {
              loadingToast.update(`«${found.name}» քանակը թարմացվեց: ${stockNum} ${isSold ? '(Վաճառված)' : ''}`, 'success', 3500);
            }
          }
        }
      } catch (err) {
        console.error('Error updating quick stock:', err);
      }

      this.renderProductsSec();
    },

    /* WORDPRESS-STYLE PRODUCT EDITOR GALLERY & CONTROLLERS */
    currentGallery: [],
    activeImageIndex: 0,

    renderGalleryThumbnails() {
      const container = document.getElementById('pe-gallery-thumbnails-container');
      const imgPreview = document.getElementById('pe-img-preview');
      const imgPlaceholder = document.getElementById('pe-img-placeholder');
      const imgUrlVal = document.getElementById('pe-img-url-val');

      const activeUrl = this.currentGallery[this.activeImageIndex] || '';

      if (imgPreview && imgPlaceholder) {
        if (activeUrl) {
          imgPreview.src = activeUrl;
          imgPreview.style.display = 'block';
          imgPlaceholder.style.display = 'none';
        } else {
          imgPreview.src = '';
          imgPreview.style.display = 'none';
          imgPlaceholder.style.display = 'block';
        }
      }

      if (imgUrlVal) {
        imgUrlVal.value = activeUrl;
      }

      if (!container) return;

      let html = '';
      this.currentGallery.forEach((url, idx) => {
        const isActive = idx === this.activeImageIndex;
        const borderStyle = isActive ? '2px solid #0066cc' : '1px solid #D0CEC5';

        html += `
          <div style="width:60px; height:60px; border:${borderStyle}; border-radius:6px; overflow:hidden; position:relative; cursor:pointer; background:#FFF; display:flex; align-items:center; justify-content:center; box-sizing:border-box;" onclick="window.WooCommerceAdmin.setActiveGalleryImage(${idx})">
            <img src="${url}" style="width:100%; height:100%; object-fit:cover;" alt="Thumbnail ${idx + 1}">
            <button type="button" onclick="event.stopPropagation(); window.WooCommerceAdmin.removeGalleryImage(${idx})" style="position:absolute; top:2px; right:2px; background:rgba(0,0,0,0.6); color:#FFF; border:none; border-radius:50%; width:16px; height:16px; font-size:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; line-height:1;" title="Remove image">✕</button>
          </div>
        `;
      });

      // Add Plus button "+ Add more images" matching screenshot
      html += `
        <label style="width:60px; height:60px; border:2px dashed #0066cc; border-radius:6px; background:#F0F7FF; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; position:relative; box-sizing:border-box;" title="Add more images">
          <span style="font-size:24px; color:#0066cc; line-height:1; font-weight:300;">+</span>
          <input type="file" accept="image/*" multiple onchange="window.WooCommerceAdmin.handleEditorImageUpload(event)" style="display:none;">
        </label>
      `;

      container.innerHTML = html;
    },

    setActiveGalleryImage(index) {
      if (index >= 0 && index < this.currentGallery.length) {
        this.activeImageIndex = index;
        this.renderGalleryThumbnails();
      }
    },

    removeGalleryImage(index) {
      if (index >= 0 && index < this.currentGallery.length) {
        this.currentGallery.splice(index, 1);
        if (this.activeImageIndex >= this.currentGallery.length) {
          this.activeImageIndex = Math.max(0, this.currentGallery.length - 1);
        }
        this.renderGalleryThumbnails();
      }
    },

    // --- STONE MANAGER METHODS ---
    getStones() {
      const defaultStones = [
        { name: 'Նռնաքար', color: '#7B2D3B', region: 'Վայոց Ձոր' },
        { name: 'Օբսիդիան', color: '#17181A', region: 'Գուտանասար' },
        { name: 'Փիրուզ', color: '#2E8C8C', region: 'Սյունիք' },
        { name: 'Հասպիս', color: '#A4442B', region: 'Արենի' },
        { name: 'Եղնգաքար', color: '#1B1D1C', region: 'Լոռի' },
        { name: 'Ագաթ', color: '#C2A379', region: 'Տավուշ' },
        { name: 'Քվարց', color: '#6B5B4E', region: 'Գեղարքունիք' }
      ];

      let customStones = [];
      try {
        customStones = JSON.parse(localStorage.getItem('urartoo_stones_db_v1')) || [];
      } catch (e) {}

      const mergedMap = new Map();
      defaultStones.forEach(s => mergedMap.set(s.name, s));
      customStones.forEach(s => mergedMap.set(s.name, s));

      return Array.from(mergedMap.values());
    },

    populateStoneDropdown() {
      const selectEl = document.getElementById('pe-stone');
      if (!selectEl) return;

      const stones = this.getStones();
      const currentVal = selectEl.value;

      selectEl.innerHTML = stones.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
      if (currentVal && Array.from(selectEl.options).some(opt => opt.value === currentVal)) {
        selectEl.value = currentVal;
      }
    },

    openStoneEditor() {
      this._editingStoneName = null; // New stone, not editing
      console.log('[Urartoo] openStoneEditor called');
      const modal = document.getElementById('stone-editor-modal');
      if (!modal) {
        console.error('[Urartoo] stone-editor-modal element not found!');
        return;
      }

      if (document.getElementById('se-name')) document.getElementById('se-name').value = '';
      if (document.getElementById('se-color')) document.getElementById('se-color').value = '#7B2D3B';
      if (document.getElementById('se-color-hex')) document.getElementById('se-color-hex').value = '#7B2D3B';
      if (document.getElementById('se-color-preview')) document.getElementById('se-color-preview').style.background = '#7B2D3B';

      modal.style.setProperty('display', 'flex', 'important');
      modal.style.setProperty('visibility', 'visible', 'important');
      modal.style.setProperty('opacity', '1', 'important');
      modal.style.setProperty('pointer-events', 'auto', 'important');
      document.body.style.overflow = 'hidden';
      console.log('[Urartoo] stone-editor-modal should now be visible');
    },

    closeStoneEditor() {
      const modal = document.getElementById('stone-editor-modal');
      if (modal) {
        modal.style.setProperty('display', 'none', 'important');
      }
      document.body.style.overflow = '';
    },

    saveStoneFromEditor() {
      const nameInput = document.getElementById('se-name');
      const colorInput = document.getElementById('se-color');
      const regionInput = document.getElementById('se-region');

      if (!nameInput || !nameInput.value.trim()) {
        if (this.showToast) this.showToast('Խնդրում ենք մուտքագրել քարի անվանումը։', 'danger', 3000);
        return;
      }

      const stoneName = nameInput.value.trim();
      const stoneColor = (colorInput ? colorInput.value : '#7B2D3B') || '#7B2D3B';
      const stoneRegion = (regionInput ? regionInput.value.trim() : '') || 'Հայաստան';

      let customStones = [];
      try {
        customStones = JSON.parse(localStorage.getItem('urartoo_stones_db_v1')) || [];
      } catch (e) {}

      const originalName = this._editingStoneName || null;
      const newStoneObj = { name: stoneName, color: stoneColor, region: stoneRegion };

      // If editing an existing stone, remove old entry first (by original name)
      if (originalName) {
        customStones = customStones.filter(s => s.name.toLowerCase() !== originalName.toLowerCase());
      } else {
        // Check if name already exists (for new stones)
        customStones = customStones.filter(s => s.name.toLowerCase() !== stoneName.toLowerCase());
      }
      customStones.push(newStoneObj);
      this._editingStoneName = null; // Reset

      try {
        localStorage.setItem('urartoo_stones_db_v1', JSON.stringify(customStones));
      } catch (e) {}

      this.populateStoneDropdown();
      const peStoneEl = document.getElementById('pe-stone');
      if (peStoneEl) peStoneEl.value = stoneName;

      const peRegionEl = document.getElementById('pe-region');
      if (peRegionEl && stoneRegion) peRegionEl.value = stoneRegion;

      this.closeStoneEditor();
      this.renderStonesSec();

      window.dispatchEvent(new CustomEvent('urartoo:stones-updated', { detail: newStoneObj }));

      if (window.showToastNotification) {
        window.showToastNotification(`✓ «${stoneName}» քարը հաջողությամբ ավելացվեց։`, 'success', 3500);
      }
    },

    async openProductEditor(productId) {
      const modal = document.getElementById('product-editor-modal');
      if (!modal) return;

      this.populateStoneDropdown();
      this.currentEditingProductId = productId;
      this._currentEditingSku = null;
      const modalTitle = document.getElementById('pe-modal-title');

      // Clear forms
      document.getElementById('pe-name').value = '';
      document.getElementById('pe-price').value = '300';
      if (document.getElementById('pe-stock')) document.getElementById('pe-stock').value = '1';
      document.getElementById('pe-desc').value = '';
      document.getElementById('pe-cat').value = 'Մատանիներ';
      document.getElementById('pe-stone').value = 'Նռնաքար';
      document.getElementById('pe-region').value = 'Վայոց Ձոր';
      document.getElementById('pe-material').value = '925 արծաթ';

      if (productId) {
        if (modalTitle) modalTitle.textContent = 'Խմբագրել Ապրանքը';

        let products = [];
        if (window.NovaSanity) products = await window.NovaSanity.getProducts();
        const found = products.find(p => p._sanityId === productId || p.id === productId);

        if (found) {
          this._currentEditingSku = found.sku || null;
          document.getElementById('pe-name').value = found.name || '';
          document.getElementById('pe-price').value = found.price || 300;
          if (document.getElementById('pe-stock')) {
            document.getElementById('pe-stock').value = found.stock !== undefined ? found.stock : (found.sold ? 0 : 1);
          }
          document.getElementById('pe-desc').value = found.description || '';
          document.getElementById('pe-cat').value = found.cat || found.category || 'Մատանիներ';
          document.getElementById('pe-stone').value = found.stone || 'Նռնաքար';
          document.getElementById('pe-region').value = found.region || found.stoneOrigin || 'Վայոց Ձոր';
          document.getElementById('pe-material').value = found.material || '925 արծաթ';

          const galleryImgs = found.images || found.gallery || [found.img || found.image].filter(Boolean);
          this.currentGallery = galleryImgs.length > 0 ? [...galleryImgs] : [];
          this.activeImageIndex = 0;
        } else {
          this.currentGallery = [];
          this.activeImageIndex = 0;
        }
      } else {
        if (modalTitle) modalTitle.textContent = 'Ավելացնել Նոր Ապրանք';
        this.currentGallery = [];
        this.activeImageIndex = 0;
      }

      this.renderGalleryThumbnails();
      modal.style.display = 'flex';
      if (window.initCustomSelects) {
        setTimeout(() => window.initCustomSelects(), 50);
      }
    },

    closeProductEditor() {
      const modal = document.getElementById('product-editor-modal');
      if (modal) modal.style.display = 'none';
      this.currentEditingProductId = null;
      this.currentGallery = [];
      this.activeImageIndex = 0;
    },

    async handleEditorImageUpload(e) {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const imgPlaceholder = document.getElementById('pe-img-placeholder');
      if (imgPlaceholder) {
        imgPlaceholder.style.display = 'block';
        imgPlaceholder.textContent = '⏳ Սեղմվում է WebP <200KB...';
      }

      for (const file of files) {
        try {
          const webpBlob = await this.compressToWebP(file);
          if (window.NovaSanity && typeof window.NovaSanity.uploadImage === 'function') {
            const uploadedAssetUrl = await window.NovaSanity.uploadImage(webpBlob);
            if (uploadedAssetUrl) {
              this.currentGallery.push(uploadedAssetUrl);
              continue;
            }
          }

          // Local fallback base64 with compressed blob
          await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (evt) => {
              if (evt.target.result) this.currentGallery.push(evt.target.result);
              resolve();
            };
            reader.readAsDataURL(webpBlob);
          });
        } catch (err) {
          console.error('Image upload failed:', err);
        }
      }

      this.activeImageIndex = Math.max(0, this.currentGallery.length - 1);
      this.renderGalleryThumbnails();
    },


    /**
     * Generates the next sequential SKU (UR-001, UR-002, etc.)
     * by scanning all existing products for the highest UR-XXX number.
     */
    getNextSKU() {
      let maxNum = 0;
      // Scan Sanity products
      if (window.NovaSanity) {
        const products = window.NovaSanity.getProducts();
        products.forEach(p => {
          if (p.sku) {
            const match = p.sku.match(/^UR-(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxNum) maxNum = num;
            }
          }
        });
      }
      // Also scan trash for used SKUs
      try {
        const trash = JSON.parse(localStorage.getItem('urartoo_trash_v1')) || [];
        trash.forEach(p => {
          if (p.sku) {
            const match = p.sku.match(/^UR-(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxNum) maxNum = num;
            }
          }
        });
      } catch (e) {}
      const next = maxNum + 1;
      return 'UR-' + String(next).padStart(3, '0');
    },

    async saveProductFromEditor() {
      const nameInput = document.getElementById('pe-name');
      const name = nameInput ? nameInput.value.trim() : '';
      const price = Number(document.getElementById('pe-price').value) || 300;
      const stockEl = document.getElementById('pe-stock');
      const stockVal = stockEl ? Math.max(0, parseInt(stockEl.value, 10) || 0) : 1;

      if (!name) {
        if (nameInput) nameInput.focus();
        return;
      }

      const saveBtn = document.getElementById('btn-pe-save');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '⏳ Պահպանվում է...'; }

      const finalIsSold = stockVal === 0;
      const catVal = document.getElementById('pe-cat').value.trim() || 'Մատանիներ';
      const stoneVal = document.getElementById('pe-stone').value.trim() || 'Նռնաքար';
      const regionVal = document.getElementById('pe-region').value.trim() || 'Վայոց Ձոր';
      const matVal = document.getElementById('pe-material').value.trim() || '925 արծաթ';
      const mainImg = this.currentGallery[0] || 'Images/bracelet.webp';

      const loadingToast = this.showToast(`Պահպանվում է ապրանքը «${name}»...`, 'loading', 0);

      const prodData = {
        id: this.currentEditingProductId || `product-custom-${Date.now()}`,
        _sanityId: this.currentEditingProductId,
        name: name,
        sku: this.currentEditingProductId ? (this._currentEditingSku || this.getNextSKU()) : this.getNextSKU(),
        price: price,
        description: document.getElementById('pe-desc').value.trim(),
        cat: catVal,
        category: catVal,
        stone: stoneVal,
        region: regionVal,
        stoneOrigin: regionVal,
        material: matVal,
        sold: finalIsSold,
        stock: stockVal,
        featured: true,
        img: mainImg,
        image: mainImg,
        images: this.currentGallery
      };

      if (window.NovaSanity) {
        await window.NovaSanity.saveProduct(prodData);
        addAuditLog(`Պահպանվեց ապրանք: «${name}» (${price}֏)`);
      }

      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 ՊԱՀՊԱՆԵԼ'; }
      this.closeProductEditor();
      this.renderProductsSec();

      if (loadingToast) {
        loadingToast.update(`Ապրանք «${name}» հաջողությամբ պահպանվեց։`, 'success', 4000);
      }
    },


    /* ═══ PRODUCT SUBTAB NAVIGATION ═══ */
    switchProductSubtab(subtab) {
      document.querySelectorAll('.admin-subtab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.subtab === subtab);
      });
      const productsContent = document.getElementById('admin-subtab-products-content');
      const trashContent = document.getElementById('admin-subtab-trash-content');
      const stonesContent = document.getElementById('admin-subtab-stones-content');
      if (productsContent) productsContent.style.display = subtab === 'products' ? '' : 'none';
      if (trashContent) trashContent.style.display = subtab === 'trash' ? '' : 'none';
      if (stonesContent) stonesContent.style.display = subtab === 'stones' ? '' : 'none';
      if (subtab === 'trash') this.renderTrashSec();
      if (subtab === 'stones') this.renderStonesSec();
    },

    /* ═══ TRASH MANAGEMENT ═══ */
    renderTrashSec() {
      const tbody = document.getElementById('admin-trash-tbody');
      const emptyMsg = document.getElementById('admin-trash-empty');
      if (!tbody) return;
      let trash = [];
      try { trash = JSON.parse(localStorage.getItem('urartoo_trash_v1')) || []; } catch (e) {}
      if (trash.length === 0) {
        tbody.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = '';
        return;
      }
      if (emptyMsg) emptyMsg.style.display = 'none';
      tbody.innerHTML = trash.map((item, idx) => {
        const img = item.img || item.image || 'Images/bracelet.webp';
        const name = item.name || 'Ապրանք';
        const cat = item.cat || item.category || '-';
        const deletedAt = item._deletedAt || '-';
        return '<tr>' +
          '<td><img src="' + img + '" alt="' + name + '" style="width:44px; height:44px; object-fit:cover; border-radius:6px; border:1px solid #E2E0D8;"></td>' +
          '<td style="font-weight:600;">' + name + '</td>' +
          '<td>' + cat + '</td>' +
          '<td style="font-size:12px; color:var(--tuff);">' + deletedAt + '</td>' +
          '<td><div style="display:flex; gap:6px; align-items:center;">' +
            '<button class="trash-restore-btn" onclick="window.WooCommerceAdmin.restoreProduct(' + idx + ')">Վերականգնել</button>' +
            '<button class="trash-delete-btn" onclick="window.WooCommerceAdmin.permanentlyDeleteProduct(' + idx + ')">Ջնջել Ընդմիշտ</button>' +
          '</div></td>' +
        '</tr>';
      }).join('');
    },

    async restoreProduct(trashIdx) {
      let trash = [];
      try { trash = JSON.parse(localStorage.getItem('urartoo_trash_v1')) || []; } catch (e) {}
      if (trashIdx < 0 || trashIdx >= trash.length) return;
      const product = trash.splice(trashIdx, 1)[0];
      delete product._deletedAt;
      localStorage.setItem('urartoo_trash_v1', JSON.stringify(trash));
      if (window.NovaSanity) {
        await window.NovaSanity.saveProduct(product);
      }
      this.renderTrashSec();
      this.renderProductsSec();
      addAuditLog('Վերականգնվեց աղբամանից: ' + product.name);
      if (this.showToast) {
        this.showToast('✅ «' + product.name + '» վերականգնվեց։', 'success', 3500);
      }
    },

    permanentlyDeleteProduct(trashIdx) {
      let trash = [];
      try { trash = JSON.parse(localStorage.getItem('urartoo_trash_v1')) || []; } catch (e) {}
      if (trashIdx < 0 || trashIdx >= trash.length) return;
      const product = trash.splice(trashIdx, 1)[0];
      localStorage.setItem('urartoo_trash_v1', JSON.stringify(trash));
      if (window.NovaSanity && product._sanityId) {
        window.NovaSanity.deleteProduct(product._sanityId);
      }
      this.renderTrashSec();
      addAuditLog('Ընդմիշտ ջնջվեց: ' + product.name);
      if (this.showToast) {
        this.showToast('🗑 «' + product.name + '» ընդմիշտ ջնջվեց։', 'danger', 3500);
      }
    },

    emptyTrash() {
      if (!confirm('Վստահավե՞ք։ Աղբամանի բոլոր ապրանքները ընդմիշտ կջնջվեն։')) return;
      localStorage.setItem('urartoo_trash_v1', '[]');
      this.renderTrashSec();
      addAuditLog('Աղբամանը դատարկվեց');
    },

    /* ═══ STONES MANAGEMENT ═══ */
    renderStonesSec() {
      const grid = document.getElementById('admin-stones-grid');
      const emptyMsg = document.getElementById('admin-stones-empty');
      if (!grid) return;
      const defaultStones = [
        { name: '\u0546\u057C\u0576\u0561\u0584\u0561\u0580', color: '#7B2D3B', isDefault: true },
        { name: '\u0555\u0562\u057D\u056B\u0564\u056B\u0561\u0576', color: '#17181A', isDefault: true },
        { name: '\u0553\u056B\u0580\u0578\u0582\u0566', color: '#2E8C8C', isDefault: true },
        { name: '\u0540\u0561\u057D\u057A\u056B\u057D', color: '#A4442B', isDefault: true },
        { name: '\u0535\u0572\u0576\u0563\u0561\u0584\u0561\u0580', color: '#1B1D1C', isDefault: true },
        { name: '\u0531\u0563\u0561\u0569', color: '#C2A379', isDefault: true },
        { name: '\u0554\u057E\u0561\u0580\u0581', color: '#6B5B4E', isDefault: true }
      ];
      let customStones = [];
      try { customStones = JSON.parse(localStorage.getItem('urartoo_stones_db_v1')) || []; } catch (e) {}
      const mergedMap = new Map();
      defaultStones.forEach(s => mergedMap.set(s.name, s));
      customStones.forEach(s => mergedMap.set(s.name, { ...s, isDefault: false }));
      const allStones = Array.from(mergedMap.values());
      if (allStones.length === 0) {
        grid.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = '';
        return;
      }
      if (emptyMsg) emptyMsg.style.display = 'none';
      grid.innerHTML = allStones.map(s => {
        return '<div class="admin-stone-card">' +
          '<div class="admin-stone-swatch" style="background:' + s.color + ';"></div>' +
          '<div class="admin-stone-info">' +
            '<div class="admin-stone-name">' + s.name + '</div>' +
          '</div>' +
          '<div class="admin-stone-actions">' +
            '<button class="stone-btn-edit" onclick="window.WooCommerceAdmin.editStone(\'' + s.name.replace(/'/g, "\\'") + '\')">✎ Խմբագրել</button>' +
            '<button class="stone-btn-delete" onclick="window.WooCommerceAdmin.deleteStone(\'' + s.name.replace(/'/g, "\\'") + '\')">🗑</button>' +
          '</div>' +
        '</div>';
      }).join('');
    },

    editStone(stoneName) {
      this._editingStoneName = stoneName; // Track original name for updates
      const defaultStones = [
        { name: '\u0546\u057C\u0576\u0561\u0584\u0561\u0580', color: '#7B2D3B' },
        { name: '\u0555\u0562\u057D\u056B\u0564\u056B\u0561\u0576', color: '#17181A' },
        { name: '\u0553\u056B\u0580\u0578\u0582\u0566', color: '#2E8C8C' },
        { name: '\u0540\u0561\u057D\u057A\u056B\u057D', color: '#A4442B' },
        { name: '\u0535\u0572\u0576\u0563\u0561\u0584\u0561\u0580', color: '#1B1D1C' },
        { name: '\u0531\u0563\u0561\u0569', color: '#C2A379' },
        { name: '\u0554\u057E\u0561\u0580\u0581', color: '#6B5B4E' }
      ];
      let customStones = [];
      try { customStones = JSON.parse(localStorage.getItem('urartoo_stones_db_v1')) || []; } catch (e) {}
      const allStones = [...defaultStones, ...customStones];
      const stone = allStones.find(s => s.name === stoneName);
      if (!stone) return;
      const modal = document.getElementById('stone-editor-modal');
      if (!modal) return;
      const nameEl = document.getElementById('se-name');
      const colorEl = document.getElementById('se-color');
      const colorHexEl = document.getElementById('se-color-hex');
      const colorPreview = document.getElementById('se-color-preview');
      const previewName = document.getElementById('se-preview-name');
      const previewHex = document.getElementById('se-preview-hex');
      const modalTitle = document.getElementById('stone-modal-title');
      if (nameEl) nameEl.value = stone.name;
      if (colorEl) colorEl.value = stone.color;
      if (colorHexEl) colorHexEl.value = stone.color;
      if (colorPreview) colorPreview.style.background = stone.color;
      if (previewName) previewName.textContent = stone.name;
      if (previewHex) previewHex.textContent = stone.color;
      if (modalTitle) modalTitle.textContent = 'Խմբագրել Քարը';
      modal.style.setProperty('display', 'flex', 'important');
      modal.style.setProperty('visibility', 'visible', 'important');
      modal.style.setProperty('opacity', '1', 'important');
      modal.style.setProperty('pointer-events', 'auto', 'important');
      document.body.style.overflow = 'hidden';
    },

    deleteStone(stoneName) {
      let customStones = [];
      try { customStones = JSON.parse(localStorage.getItem('urartoo_stones_db_v1')) || []; } catch (e) {}
      customStones = customStones.filter(s => s.name !== stoneName);
      localStorage.setItem('urartoo_stones_db_v1', JSON.stringify(customStones));
      this.renderStonesSec();
      this.populateStoneDropdown();
      window.dispatchEvent(new CustomEvent('urartoo:stones-updated'));
      addAuditLog('Ջնջվեց քարը: ' + stoneName);
      if (this.showToast) {
        this.showToast('🗑 «' + stoneName + '» քարը ջնջվեց։', 'danger', 3500);
      }
    },

    async deleteProduct(productId) {
      let prodName = 'Ապրանք';
      let product = null;
      if (window.NovaSanity) {
        const products = window.NovaSanity.getProducts();
        product = products.find(p => String(p._sanityId) === String(productId) || String(p.id) === String(productId));
        if (product) prodName = product.name;
      }

      const loadingToast = this.showToast(`Ջնջվում է «${prodName}»...`, 'loading', 0);

      // Soft-delete: move to trash before removing
      if (product) {
        let trash = [];
        try { trash = JSON.parse(localStorage.getItem('urartoo_trash_v1')) || []; } catch (e) {}
        product._deletedAt = new Date().toLocaleDateString('hy-AM');
        trash.push({ ...product });
        localStorage.setItem('urartoo_trash_v1', JSON.stringify(trash));
      }

      if (window.NovaSanity) {
        await window.NovaSanity.deleteProduct(productId);
        addAuditLog(`Ջնջվեց ապրանք Sanity-ից ID: ${productId}`);
        this.renderProductsSec();
      }

      if (loadingToast) {
        loadingToast.update(`«${prodName}» տեղափոխվեց աղբաման։`, 'warning', 4000);
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

    /* TAB 4: CLIENTS RENDERER (fetches from Sanity) */
    async renderClientsSec() {
      // Delegate to the detailed Sanity-based renderer
      await this._renderClientsFromSanity();
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

      if (revEl) revEl.textContent = `${totalRev}֏`;
      if (countEl) countEl.textContent = ordersCount;
      if (aovEl) aovEl.textContent = `${avgOrder}֏`;
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
                <span style="font-family:var(--mono);">${amount}֏</span>
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

        const itemsHtml = (o.items || []).map(i => {
          const itemImg = i.img || i.image || 'Images/bracelet.webp';
          const itemPrice = Number(i.price) || 0;
          const itemQty = i.qty || 1;
          const itemSubtotal = itemPrice * itemQty;

          return `<div style="display:flex; align-items:center; gap:10px; padding:6px 0; border-bottom:1px solid #ECE8DF;">
            <img src="${itemImg}" style="width:36px; height:36px; object-fit:cover; border-radius:4px; border:1px solid var(--pumice); flex-shrink:0;" alt="${i.name}">
            <div style="display:flex; flex-direction:column; gap:2px; min-width:0;">
              <div style="font-weight:700; font-size:12.5px; color:var(--ink);">${i.name}</div>
              <div style="font-size:11px; color:var(--tuff); font-family:var(--mono);">
                ${i.cat || 'Մատանիներ'} ${i.stone ? ('• ' + i.stone) : ''}
              </div>
              <div style="font-size:11.5px; color:var(--charcoal);">
                <span style="color:var(--amber); font-family:var(--mono); font-weight:700;">${itemPrice}֏</span> × ${itemQty} = <strong style="font-family:var(--mono); color:var(--ink);">${itemSubtotal}֏</strong>
              </div>
            </div>
          </div>`;
        }).join('');

        const custInfoHtml = `<div>
          <div style="font-weight:700; font-size:13.5px; color:var(--ink);">${o.customer}</div>
          <div style="font-size:12px; color:var(--tuff); margin-top:2px;">✉️ ${o.email}</div>
          ${o.phone ? `<div style="font-size:12px; color:var(--tuff); margin-top:1px;">📞 ${o.phone}</div>` : ''}
          ${o.address ? `<div style="font-size:11.5px; color:var(--charcoal); margin-top:4px; background:#F5F3ED; padding:3px 8px; border-radius:4px; border:1px solid #E6E2D8; line-height:1.35;">📍 ${o.address}</div>` : ''}
        </div>`;

        return `<tr>
          <td><strong style="font-family:var(--mono); color:var(--amber);">${o.id}</strong></td>
          <td style="font-size:12px; color:var(--tuff); white-space:nowrap;">${o.date}</td>
          <td style="min-width:180px;">${custInfoHtml}</td>
          <td style="min-width:240px;">${itemsHtml}</td>
          <td><strong style="font-family:var(--mono); color:var(--amber); font-size:14.5px;">${o.total}֏</strong></td>
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
        this.showToast(`Պատվերի #${orderId} կարգավիճակը թարմացվեց: ${newStatus}`, 'success', 3500);
      }
    },

    deleteOrder(orderId) {
      let orders = getOrders();
      orders = orders.filter(o => o.id !== orderId);
      saveOrders(orders);
      addAuditLog(`Ջնջվել է պատվեր #${orderId}`);
      this.renderOrdersSec();
      this.showToast(`Պատվերը #${orderId} ջնջվեց։`, 'danger', 3500);
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
        phone: customerData.phone || '',
        address: customerData.address || '',
        total: Number(totalAmount) || 0,
        status: 'pending',
        items: cartItems.map(item => ({
          name: item.name,
          qty: item.qty || 1,
          price: Number(item.price) || 0,
          img: item.img || item.image || 'Images/bracelet.webp',
          cat: item.cat || item.category || 'Մատանիներ',
          stone: item.stone || ''
        }))
      };
      orders.unshift(newOrder);
      saveOrders(orders);
      addAuditLog(`Գրանցվել է նոր պատվեր #${newOrder.id} (${newOrder.total}֏) - ${newOrder.customer}`);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('urartoo:orders-updated', { detail: newOrder }));
      }

      if (this.activeTab === 'orders') this.renderOrdersSec();
      return newOrder;
    },

    async syncGoogleData() {
      const btn = document.getElementById('btn-sync-google');
      if (btn) { btn.disabled = true; btn.textContent = '⏳ Սինխրոնացվում է...'; }
      const loadingToast = this.showToast('Սինխրոնացվում է Google Sheets & Drive տվյալների հետ...', 'loading', 0);

      try {
        if (window.GoogleSync) {
          await window.GoogleSync.runFullSync((msg) => {
            console.log('Google Sync Status:', msg);
          });
        }
        if (loadingToast) {
          loadingToast.update('Google Sheets սինխրոնացումը ավարտվեց։', 'sync', 4500);
        }
      } catch (e) {
        console.error('Google Sync failed:', e);
        if (loadingToast) {
          loadingToast.update('Google Sheets սինխրոնացման սխալ։', 'danger', 4000);
        }
      }

      if (btn) { btn.disabled = false; btn.textContent = '⚡ Սինխրոնացնել Google Sheets'; }
      this.renderProductsSec();
    },

    async renderClientsSec() {
      await this._renderClientsFromSanity();
    },

    async _renderClientsFromSanity() {
      const tbody = document.getElementById('admin-clients-tbody');
      const searchInput = document.getElementById('admin-client-search');
      const searchQ = searchInput ? searchInput.value.trim().toLowerCase() : '';

      const orders = getOrders();

      // 1. Initial immediate populate from local storage database
      let localDB = [];
      try {
        localDB = JSON.parse(localStorage.getItem('urartoo_users_db_v1')) || [];
      } catch (e) { localDB = []; }

      // 2. Fetch users from Sanity CMS (sole source of truth)
      let usersDB = localDB;
      try {
        const SANITY_TOKEN = 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud';
        const groq = encodeURIComponent('*[_type in ["userAccount", "user"]]{ _id, name, email, phone, joined, isAdmin, role, address, orders }');
        const url = 'https://g1vi85kp.api.sanity.io/v2024-01-01/data/query/production?query=' + groq;
        const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + SANITY_TOKEN } });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.result) && data.result.length > 0) {
            usersDB = data.result;
            try {
              localStorage.setItem('urartoo_users_db_v1', JSON.stringify(usersDB));
            } catch (e) {}
          }
        }
      } catch (e) { console.warn('Failed to fetch users from Sanity:', e); }

      const clientMap = new Map();

      // 1. Populate registered users from database
      usersDB.forEach(u => {
        const email = (u.email || '').toLowerCase().trim();
        if (!email) return;
        clientMap.set(email, {
          id: u._id || u.id,
          name: u.name || email,
          email: email,
          phone: u.phone || '',
          address: u.address || { city: '', street: '', zip: '' },
          joined: u.joined || '2026',
          isAdmin: Boolean(u.isAdmin) || u.role === 'Super Admin' || ['najaryannorayr209@gmail.com', 'mineralsarm@gmail.com', 'norayrnajaryann@gmail.com'].includes(email),
          role: u.role || (u.isAdmin ? 'Super Admin' : 'Customer'),
          ordersCount: Array.isArray(u.orders) ? u.orders.length : 0,
          totalSpent: Array.isArray(u.orders) ? u.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0) : 0,
          lastOrderDate: (Array.isArray(u.orders) && u.orders.length > 0) ? u.orders[0].date : ''
        });
      });

      // 2. Merge orders list (for guest checkouts or additional orders)
      orders.forEach(o => {
        const email = (o.email || 'customer@example.com').toLowerCase().trim();
        if (!clientMap.has(email)) {
          clientMap.set(email, {
            name: o.customer || 'Գնորդ',
            email: email,
            phone: o.phone || '',
            address: { city: '', street: o.address || '', zip: '' },
            joined: '2026',
            isAdmin: false,
            role: 'Customer',
            ordersCount: 0,
            totalSpent: 0,
            lastOrderDate: o.date
          });
        }
        const client = clientMap.get(email);
        client.ordersCount += 1;
        client.totalSpent += (Number(o.total) || 0);
        if (o.phone && !client.phone) client.phone = o.phone;
        if (!client.lastOrderDate || new Date(o.date) > new Date(client.lastOrderDate)) {
          client.lastOrderDate = o.date;
        }
      });

      let clients = Array.from(clientMap.values());
      if (searchQ) {
        clients = clients.filter(c => 
          (c.name && c.name.toLowerCase().includes(searchQ)) || 
          (c.email && c.email.toLowerCase().includes(searchQ)) || 
          (c.phone && c.phone.toLowerCase().includes(searchQ))
        );
      }

      // Update stat cards
      const countEl = document.getElementById('admin-clients-count-val');
      const activeEl = document.getElementById('admin-active-buyers-val');
      const ltvEl = document.getElementById('admin-client-ltv-val');

      if (countEl) countEl.textContent = clients.length;
      if (activeEl) activeEl.textContent = clients.filter(c => c.ordersCount > 0).length;

      const totalLtv = clients.reduce((sum, c) => sum + c.totalSpent, 0);
      const avgLtv = clients.length > 0 ? Math.round(totalLtv / clients.length) : 0;
      if (ltvEl) ltvEl.textContent = `${avgLtv.toLocaleString()}֏`;

      if (!tbody) return;

      if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--tuff);">Գրանցված հաճախորդներ չեն գտնվել։</td></tr>';
        return;
      }

      tbody.innerHTML = clients.map(c => {
        let badgeClass = 'badge-pending';
        let statusText = 'Գրանցված';
        if (c.isAdmin) {
          badgeClass = 'badge-completed';
          statusText = 'Ադմին';
        } else if (c.ordersCount > 0) {
          badgeClass = 'badge-processing';
          statusText = 'Ակտիվ Գնորդ';
        }

        const addressText = c.address && (c.address.city || c.address.street) 
          ? [c.address.city, c.address.street].filter(Boolean).join(', ') 
          : '';

        return `<tr>
          <td>
            <strong style="font-size:13.5px; color:var(--ink);">${c.name}</strong>
            ${c.phone ? `<div style="font-size:12px; color:var(--tuff); margin-top:2px;">📞 ${c.phone}</div>` : ''}
            ${addressText ? `<div style="font-size:11.5px; color:var(--tuff); margin-top:2px;">📍 ${addressText}</div>` : ''}
            <div style="font-size:11px; color:var(--tuff); margin-top:1px;">Գրանցված: ${c.joined} թ․</div>
          </td>
          <td style="font-size:13px; color:var(--charcoal); font-weight:500;">✉️ ${c.email}</td>
          <td><span class="admin-status-badge ${c.ordersCount > 0 ? 'badge-processing' : 'badge-pending'}">${c.ordersCount} պատվեր</span></td>
          <td style="font-family:var(--mono); font-weight:700; color:var(--amber); font-size:14px;">${c.totalSpent.toLocaleString()}֏</td>
          <td style="font-size:12px; color:var(--tuff);">${c.lastOrderDate || '—'}</td>
          <td><span class="admin-status-badge ${badgeClass}">${statusText}</span></td>
        </tr>`;
      }).join('');
    },

    renderSettingsSec() {
      try {
        const savedSett = JSON.parse(localStorage.getItem('urartoo_store_settings_v1'));
        if (savedSett) {
          if (savedSett.name && document.getElementById('sett-store-name')) document.getElementById('sett-store-name').value = savedSett.name;
          if (savedSett.email && document.getElementById('sett-support-email')) document.getElementById('sett-support-email').value = savedSett.email;
          if (savedSett.currency && document.getElementById('sett-currency')) document.getElementById('sett-currency').value = savedSett.currency;
        }
      } catch (e) {}
    },

    saveSettings(e) {
      if (e && e.preventDefault) e.preventDefault();
      const name = document.getElementById('sett-store-name') ? document.getElementById('sett-store-name').value : 'Urartoo Jewelry';
      const email = document.getElementById('sett-support-email') ? document.getElementById('sett-support-email').value : 'najaryannorayr209@gmail.com';
      const currency = document.getElementById('sett-currency') ? document.getElementById('sett-currency').value : 'USD';

      const sett = { name, email, currency };
      localStorage.setItem('urartoo_store_settings_v1', JSON.stringify(sett));
      addAuditLog(`Թարմացվեցին խանութի կարգավորումները (${name}, ${currency})`);
      this.showToast('Խանութի կարգավորումները պահպանվեցին։', 'success', 3500);
    },

    /* ===================================================================
       TAB 4: JOURNAL / BLOG POSTS MANAGER & ACF/SCF EDITOR
       =================================================================== */
    currentEditingBlogId: null,
    currentBlogFaqs: [],

    /**
     * WebP Compression Engine: Converts File / Blob / Image to WebP format,
     * targeting >= 90% quality and strictly capping file size < 200 KB (204,800 bytes).
     */
    async compressToWebP(fileOrImg, initialQuality = 0.90, maxSizeBytes = 204800) {
      let imgSource = fileOrImg;
      if (fileOrImg instanceof Blob || fileOrImg instanceof File) {
        imgSource = await new Promise((resolve, reject) => {
          const img = new Image();
          const objUrl = URL.createObjectURL(fileOrImg);
          img.onload = () => resolve(img);
          img.onerror = (e) => reject(e);
          img.src = objUrl;
        });
      }

      return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = imgSource.naturalWidth || imgSource.width || 1200;
        let height = imgSource.naturalHeight || imgSource.height || 1200;

        const MAX_DIM = 1600;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(imgSource, 0, 0, width, height);

        let quality = initialQuality;
        const attemptCompress = () => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob failed'));
              return;
            }
            if (blob.size <= maxSizeBytes || quality <= 0.5) {
              console.log(`[Urartoo Media] WebP Auto-Compressed: ${(blob.size / 1024).toFixed(1)} KB, Quality=${(quality * 100).toFixed(0)}%`);
              resolve(blob);
            } else {
              quality -= 0.08;
              attemptCompress();
            }
          }, 'image/webp', quality);
        };
        attemptCompress();
      });
    },

    async renderClientsSec() {
      const tbody = document.getElementById('admin-clients-tbody');
      const regCountEl = document.getElementById('admin-clients-count-val');
      const activeBuyersEl = document.getElementById('admin-active-buyers-val');
      const ltvValEl = document.getElementById('admin-client-ltv-val');
      const searchInput = document.getElementById('admin-client-search');
      const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

      // 1. Initial local cache render for instant display
      let users = [];
      try {
        const localDb = JSON.parse(localStorage.getItem('urartoo_users_db_v1') || '[]');
        if (Array.isArray(localDb) && localDb.length > 0) {
          users = localDb;
        }
      } catch (e) {}

      const renderUserList = (list) => {
        if (!tbody) return;

        // Stats calculation
        if (regCountEl) regCountEl.textContent = list.length;
        
        let activeCount = 0;
        let totalSpend = 0;

        list.forEach(u => {
          const ords = Array.isArray(u.orders) ? u.orders : [];
          if (ords.length > 0) activeCount++;
          ords.forEach(o => {
            totalSpend += (Number(o.total) || 0);
          });
        });

        if (activeBuyersEl) activeBuyersEl.textContent = activeCount;
        if (ltvValEl) {
          const avgLtv = list.length > 0 ? Math.round(totalSpend / list.length) : 0;
          ltvValEl.textContent = avgLtv > 0 ? `$${avgLtv}` : '0 $';
        }

        // Search filtering
        const filtered = list.filter(u => {
          if (!searchVal) return true;
          const nameStr = (u.name || '').toLowerCase();
          const emailStr = (u.email || '').toLowerCase();
          const phoneStr = (u.phone || '').toLowerCase();
          const cityStr = (u.address?.city || '').toLowerCase();
          return nameStr.includes(searchVal) || emailStr.includes(searchVal) || phoneStr.includes(searchVal) || cityStr.includes(searchVal);
        });

        if (filtered.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:36px; color:var(--tuff);">Գրանցված հաճախորդներ չեն գտնվել</td></tr>';
          return;
        }

        tbody.innerHTML = filtered.map(u => {
          const ordCount = Array.isArray(u.orders) ? u.orders.length : 0;
          let userSpend = 0;
          if (Array.isArray(u.orders)) {
            u.orders.forEach(o => { userSpend += (Number(o.total) || 0); });
          }

          let badgeHtml = '';
          if (u.isAdmin) {
            badgeHtml = '<span style="display:inline-block; padding:3px 10px; font-size:11.5px; font-weight:700; border-radius:12px; background:#FFF3D6; color:#946300; border:1px solid #FFE082;">👑 Ադմին</span>';
          } else if (ordCount > 0) {
            badgeHtml = '<span style="display:inline-block; padding:3px 10px; font-size:11.5px; font-weight:600; border-radius:12px; background:#E6F4EA; color:#137333; border:1px solid #CEEAD6;">Ակտիվ Գնորդ</span>';
          } else {
            badgeHtml = '<span style="display:inline-block; padding:3px 10px; font-size:11.5px; font-weight:600; border-radius:12px; background:#F1F3F4; color:#5F6368; border:1px solid #DADCE0;">Գրանցված</span>';
          }

          const cityInfo = (u.address && u.address.city) ? ` · ${u.address.city}` : '';

          return `
            <tr>
              <td>
                <strong style="color:var(--obsidian); font-size:13.5px; display:block;">${u.name || 'Անանուն Գնորդ'}</strong>
                <span style="font-size:12px; color:var(--tuff);">${u.phone || 'Հեռ․ նշված չէ'}${cityInfo}</span>
              </td>
              <td><span style="font-family:var(--mono); font-size:12.5px; color:#444;">${u.email || '-'}</span></td>
              <td><strong style="font-size:13px;">${ordCount}</strong> <span style="font-size:11.5px; color:var(--tuff);">պատվեր</span></td>
              <td><strong style="color:var(--green); font-size:13px;">${userSpend > 0 ? ('$' + userSpend.toLocaleString()) : '$0'}</strong></td>
              <td style="font-size:12.5px; color:#666;">${u.joined || '2026'}</td>
              <td>${badgeHtml}</td>
            </tr>
          `;
        }).join('');
      };

      if (users.length > 0) {
        renderUserList(users);
      }

      // 2. Fetch live data directly from Sanity Cloud
      try {
        const SANITY_TOKEN = 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud';
        const groq = encodeURIComponent('*[_type in ["userAccount", "user", "customer"]]{ _id, name, email, phone, address, joined, isAdmin, role, orders } | order(joined desc)');
        const url = `https://g1vi85kp.api.sanity.io/v2024-01-01/data/query/production?query=${groq}`;

        const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + SANITY_TOKEN } });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.result) && data.result.length > 0) {
            users = data.result;
            try {
              localStorage.setItem('urartoo_users_db_v1', JSON.stringify(users));
            } catch (e) {}
            renderUserList(users);
          }
        }
      } catch (err) {
        console.warn('[Admin] Live clients fetch error:', err);
      }
    },

    async renderJournalSec() {
      const tbody = document.getElementById('admin-journal-tbody');
      const mobileCards = document.getElementById('admin-journal-mobile-cards');
      if (!tbody && !mobileCards) return;

      let posts = [];
      if (window.NovaSanity) {
        posts = window.NovaSanity.getJournalPosts();
        if (!window.NovaSanity._ready) {
          await window.NovaSanity.init();
          posts = window.NovaSanity.getJournalPosts();
        }
      }

      this.populateJournalHTML(posts || []);
    },

    populateJournalHTML(posts) {
      const tbody = document.getElementById('admin-journal-tbody');
      const mobileCards = document.getElementById('admin-journal-mobile-cards');
      const countVal = document.getElementById('admin-journal-count-val');
      const featVal = document.getElementById('admin-journal-featured-val');
      const topicsVal = document.getElementById('admin-journal-topics-val');

      const searchVal = document.getElementById('admin-journal-search')?.value.toLowerCase().trim() || '';
      const topicVal = document.getElementById('admin-journal-filter-topic')?.value || 'all';

      // Summary Stats
      if (countVal) countVal.textContent = posts.length;
      const featuredPost = posts.find(p => p.featured);
      if (featVal) featVal.textContent = featuredPost ? featuredPost.title : 'Ընտրված չէ';
      const uniqueTopics = new Set(posts.map(p => p.topic).filter(Boolean));
      if (topicsVal) topicsVal.textContent = uniqueTopics.size || 4;

      let filtered = posts.filter(p => {
        const titleMatch = (p.title && p.title.toLowerCase().includes(searchVal)) ||
                           (p.location && p.location.toLowerCase().includes(searchVal)) ||
                           (p.slug && p.slug.toLowerCase().includes(searchVal));
        const topicMatch = topicVal === 'all' || p.topic === topicVal;
        return titleMatch && topicMatch;
      });

      if (filtered.length === 0) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:36px 16px;color:var(--tuff);">Նշումներ չեն գտնվել</td></tr>';
        if (mobileCards) mobileCards.innerHTML = '<div style="text-align:center;padding:32px;color:var(--tuff);">Նշումներ չեն գտնվել</div>';
        return;
      }

      if (tbody) {
        tbody.innerHTML = filtered.map(p => {
          const pId = p.id || p._sanityId || p.slug;
          const heroImg = p.heroImg || 'Images/author.webp';
          const isFeat = Boolean(p.featured);

          return `
            <tr>
              <td style="text-align:center;"><input type="checkbox" class="admin-journal-checkbox" value="${pId}" style="width:16px; height:16px; cursor:pointer;"></td>
              <td>
                <div style="width:52px; height:42px; background:#FAF8F5; border-radius:4px; overflow:hidden; display:flex; align-items:center; justify-content:center; border:1px solid #EAE8E2;">
                  <img src="${heroImg}" style="width:100%; height:100%; object-fit:cover;" alt="">
                </div>
              </td>
              <td>
                <strong style="color:var(--obsidian); font-size:14px;">${p.title || 'Անվերնագիր'}</strong>
                <div style="font-size:12px; color:var(--tuff); max-width:380px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px;">
                  ${p.lead || p.excerpt || ''}
                </div>
                <small style="color:#888; font-family:var(--mono); font-size:11px;">slug: ${p.slug || pId}</small>
              </td>
              <td>
                <span style="display:inline-block; padding:3px 10px; font-size:11.5px; font-weight:600; border-radius:12px; background:#F4F3EF; color:var(--obsidian); border:1px solid #E2E0D8;">
                  ${p.topic || 'Քարահավաք'}
                </span>
              </td>
              <td style="font-size:13px; color:#555;">${p.date || '-'}</td>
              <td style="font-size:13px; color:#555;">${p.location || '-'}</td>
              <td style="text-align:center;">
                <span class="journal-featured-star ${isFeat ? 'active' : ''}" onclick="window.WooCommerceAdmin.toggleJournalFeatured('${pId}')" title="${isFeat ? 'Գլխավոր նշում է (Սեղմեք անջատելու համար)' : 'Դարձնել գլխավոր նշում'}">
                  ${isFeat ? '★' : '☆'}
                </span>
              </td>
              <td style="text-align:right;">
                <div style="display:inline-flex; align-items:center; gap:6px;">
                  <button type="button" class="filter-clear-btn" style="padding:5px 10px; font-size:11.5px;" onclick="window.WooCommerceAdmin.openBlogEditor('${pId}')" title="Խմբագրել ACF դաշտերը">✏️ Խմբագրել</button>
                  <a href="journal-post.html?id=${p.slug || pId}" target="_blank" class="filter-clear-btn" style="padding:5px 8px; font-size:11.5px; text-decoration:none; display:inline-flex; align-items:center;" title="Դիտել կայքում">👁</a>
                  <button type="button" class="filter-clear-btn" style="color:#C5221F; border-color:#E8C4C4; padding:5px 8px; font-size:11.5px;" onclick="window.WooCommerceAdmin.deleteJournalPost('${pId}')" title="Ջնջել նշումը">🗑</button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }

      if (mobileCards) {
        mobileCards.innerHTML = filtered.map(p => {
          const pId = p.id || p._sanityId || p.slug;
          const heroImg = p.heroImg || 'Images/author.webp';
          const isFeat = Boolean(p.featured);

          return `
            <div class="admin-prod-mobile-card">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                <input type="checkbox" class="admin-journal-checkbox" value="${pId}" style="width:18px; height:18px; cursor:pointer;">
                <span style="font-size:12px; color:var(--tuff);">Ընտրել</span>
              </div>
              <div class="admin-prod-mobile-header">
                <img src="${heroImg}" class="admin-prod-mobile-img" alt="${p.title}">
                <div class="admin-prod-mobile-meta">
                  <div class="admin-prod-mobile-title">${p.title}</div>
                  <div style="font-size:12px; color:var(--tuff); margin-top:2px;">${p.date || ''} • ${p.location || ''}</div>
                  <div class="admin-prod-mobile-badges" style="margin-top:4px;">
                    <span style="font-size:11px; background:#F4F3EF; padding:2px 8px; border-radius:2px; color:var(--tuff);">${p.topic || 'Քարահավաք'}</span>
                    ${isFeat ? '<span style="font-size:10.5px; background:var(--gold); color:var(--green); font-weight:700; padding:2px 6px; border-radius:2px;">★ ԳԼԽԱՎՈՐ</span>' : ''}
                  </div>
                </div>
              </div>
              <div class="admin-prod-mobile-actions" style="margin-top:10px;">
                <button class="filter-clear-btn" onclick="window.WooCommerceAdmin.openBlogEditor('${pId}')">✏️ Խմբագրել</button>
                <a href="journal-post.html?id=${p.slug || pId}" target="_blank" class="filter-clear-btn" style="text-decoration:none;">👁 Դիտել</a>
                <button class="filter-clear-btn" style="color:red; border-color:red;" onclick="window.WooCommerceAdmin.deleteJournalPost('${pId}')">🗑 Ջնջել</button>
              </div>
            </div>
          `;
        }).join('');
      }

      if (window.initCustomSelects) {
        setTimeout(() => window.initCustomSelects(), 50);
      }
    },

    async toggleJournalFeatured(postId) {
      if (!window.NovaSanity) return;
      const posts = window.NovaSanity.getJournalPosts();
      const target = posts.find(p => String(p.id) === String(postId) || String(p._sanityId) === String(postId) || String(p.slug) === String(postId));
      if (!target) return;

      const newFeat = !target.featured;
      // If turning ON, unset other featured posts so there is 1 main lead
      if (newFeat) {
        posts.forEach(p => { p.featured = false; });
      }
      target.featured = newFeat;
      await window.NovaSanity.saveJournalPost(target);
      this.renderJournalSec();
    },

    populateBlogProductDropdown(selectedTitle) {
      const select = document.getElementById('be-featprod-select');
      if (!select) return;

      let products = [];
      if (window.NovaSanity) products = window.NovaSanity.getProducts();

      let html = '<option value="">-- Չկցել ապրանք --</option>';
      products.forEach(p => {
        const isSel = (selectedTitle && (p.name === selectedTitle || (p.name && selectedTitle.includes(p.name))));
        html += `<option value="${p.id || p._sanityId}" ${isSel ? 'selected' : ''} data-name="${p.name}" data-price="${p.price}" data-img="${p.img || p.image || ''}">${p.name} ($${p.price})</option>`;
      });
      select.innerHTML = html;
    },

    handleBlogFeaturedProductSelect(prodId) {
      if (!prodId) return;
      const select = document.getElementById('be-featprod-select');
      const opt = select ? select.options[select.selectedIndex] : null;
      if (!opt) return;

      const name = opt.dataset.name || opt.textContent;
      const price = opt.dataset.price || '265';
      const img = opt.dataset.img || 'Images/ring.webp';

      const titleInput = document.getElementById('be-featprod-title');
      const priceInput = document.getElementById('be-featprod-price');
      const badgeInput = document.getElementById('be-featprod-badge');
      const imgInput = document.getElementById('be-featprod-img');

      if (titleInput) titleInput.value = name;
      if (priceInput) priceInput.value = '$' + price.replace('$', '');
      if (badgeInput && !badgeInput.value) badgeInput.value = 'Եզակի (1 of 1)';
      if (imgInput) imgInput.value = img;
    },

    async openBlogEditor(postId) {
      const modal = document.getElementById('blog-editor-modal');
      if (!modal) return;

      this.currentEditingBlogId = postId;
      this.currentBlogFaqs = [];

      const modalTitle = document.getElementById('blog-modal-title');
      const previewBtn = document.getElementById('btn-blog-preview');

      // Populate products dropdown
      this.populateBlogProductDropdown();

      if (postId) {
        if (modalTitle) modalTitle.textContent = '📝 Խմբագրել Դաշտային Նշումը (ACF Editor)';

        let post = null;
        if (window.NovaSanity) post = window.NovaSanity.getJournalPostById(postId);

        if (post) {
          if (document.getElementById('be-title')) document.getElementById('be-title').value = post.title || '';
          if (document.getElementById('be-date')) document.getElementById('be-date').value = post.date || '';
          if (document.getElementById('be-location')) document.getElementById('be-location').value = post.location || '';
          if (document.getElementById('be-readtime')) document.getElementById('be-readtime').value = post.readTime || '';
          if (document.getElementById('be-slug')) document.getElementById('be-slug').value = post.slug || post.id || '';
          if (document.getElementById('be-lead')) document.getElementById('be-lead').value = post.lead || post.excerpt || '';
          if (document.getElementById('be-topic')) document.getElementById('be-topic').value = post.topic || 'Քարահավաք';
          if (document.getElementById('be-featured')) document.getElementById('be-featured').checked = Boolean(post.featured);

          // Hero image
          const heroUrl = post.heroImg || '';
          this.updateBlogThumbnailFromUrl(heroUrl);
          if (document.getElementById('be-hero-caption')) document.getElementById('be-hero-caption').value = post.heroCaption || '';

          // Content
          const contentHtml = post.contentHtml || post.content || '';
          const visualEl = document.getElementById('be-content-visual');
          const textEl = document.getElementById('be-content-text');
          if (visualEl) visualEl.innerHTML = contentHtml;
          if (textEl) textEl.value = contentHtml;

          // FAQs
          this.currentBlogFaqs = Array.isArray(post.faqs) ? JSON.parse(JSON.stringify(post.faqs)) : [];

          // Featured Product
          if (post.featuredProduct) {
            if (document.getElementById('be-featprod-title')) document.getElementById('be-featprod-title').value = post.featuredProduct.title || '';
            if (document.getElementById('be-featprod-price')) document.getElementById('be-featprod-price').value = post.featuredProduct.price || '';
            if (document.getElementById('be-featprod-badge')) document.getElementById('be-featprod-badge').value = post.featuredProduct.badge || 'Եզակի (1 of 1)';
            if (document.getElementById('be-featprod-img')) document.getElementById('be-featprod-img').value = post.featuredProduct.img || '';
            this.populateBlogProductDropdown(post.featuredProduct.title);
          }

          if (previewBtn) previewBtn.href = `journal-post.html?id=${post.slug || post.id}`;
        }
      } else {
        // New post
        if (modalTitle) modalTitle.textContent = '📝 Ավելացնել Նոր Նշում (ACF Editor)';

        if (document.getElementById('be-title')) document.getElementById('be-title').value = '';
        if (document.getElementById('be-date')) {
          const now = new Date();
          const months = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս', 'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'];
          document.getElementById('be-date').value = `${months[now.getMonth()]} ${now.getFullYear()}`;
        }
        if (document.getElementById('be-location')) document.getElementById('be-location').value = 'Հայաստան';
        if (document.getElementById('be-readtime')) document.getElementById('be-readtime').value = '5 րոպե';
        if (document.getElementById('be-slug')) document.getElementById('be-slug').value = '';
        if (document.getElementById('be-lead')) document.getElementById('be-lead').value = '';
        if (document.getElementById('be-topic')) document.getElementById('be-topic').value = 'Քարահավաք';
        if (document.getElementById('be-featured')) document.getElementById('be-featured').checked = false;

        this.updateBlogThumbnailFromUrl('');
        if (document.getElementById('be-hero-caption')) document.getElementById('be-hero-caption').value = '';

        const visualEl = document.getElementById('be-content-visual');
        const textEl = document.getElementById('be-content-text');
        if (visualEl) visualEl.innerHTML = '<p>Գրեք Ձեր դաշտային նշումը այստեղ...</p>';
        if (textEl) textEl.value = '<p>Գրեք Ձեր դաշտային նշումը այստեղ...</p>';

        this.currentBlogFaqs = [];

        if (document.getElementById('be-featprod-title')) document.getElementById('be-featprod-title').value = '';
        if (document.getElementById('be-featprod-price')) document.getElementById('be-featprod-price').value = '';
        if (document.getElementById('be-featprod-badge')) document.getElementById('be-featprod-badge').value = 'Եզակի (1 of 1)';
        if (document.getElementById('be-featprod-img')) document.getElementById('be-featprod-img').value = '';

        if (previewBtn) previewBtn.href = 'journal-post.html';
      }

      this.renderBlogFaqs();
      this.switchBlogEditorMode('visual');

      const visualEl = document.getElementById('be-content-visual');
      if (visualEl && !visualEl._mediaListenerAttached) {
        visualEl._mediaListenerAttached = true;
        visualEl.addEventListener('click', (e) => {
          const fig = e.target.closest('figure, .journal-post-figure-img, .journal-post-hero-placeholder, .article-figure');
          if (fig) {
            e.stopPropagation();
            window.WooCommerceAdmin._activeTargetFigure = fig.closest('figure') || fig;
            const fileInput = document.getElementById('be-media-file-input');
            if (fileInput) fileInput.click();
          }
        });
      }

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      if (window.initCustomSelects) {
        setTimeout(() => window.initCustomSelects(), 50);
      }
    },

    closeBlogEditor() {
      const modal = document.getElementById('blog-editor-modal');
      if (modal) modal.style.display = 'none';
      document.body.style.overflow = '';
      this.currentEditingBlogId = null;
      this._activeTargetFigure = null;
    },

    updateBlogThumbnailFromUrl(url) {
      const img = document.getElementById('be-hero-preview');
      const placeholder = document.getElementById('be-hero-placeholder');
      const input = document.getElementById('be-hero-url');

      const cleanUrl = (url || '').trim();
      if (input && input.value !== cleanUrl) input.value = cleanUrl;

      if (cleanUrl && img && placeholder) {
        img.src = cleanUrl;
        img.style.display = 'block';
        placeholder.style.display = 'none';
      } else if (img && placeholder) {
        img.src = '';
        img.style.display = 'none';
        placeholder.style.display = 'block';
      }
    },

    clearBlogThumbnail() {
      const img = document.getElementById('be-hero-preview');
      const placeholder = document.getElementById('be-hero-placeholder');
      const input = document.getElementById('be-hero-url');
      const captionInput = document.getElementById('be-hero-caption');
      const fileInput = document.getElementById('be-hero-file');

      if (input) input.value = '';
      if (captionInput) captionInput.value = '';
      if (fileInput) fileInput.value = '';

      if (img) {
        img.src = '';
        img.style.display = 'none';
      }
      if (placeholder) {
        placeholder.style.display = 'block';
      }

      if (typeof this.showToast === 'function') {
        this.showToast('Գլխավոր լուսանկարը հեռացվեց։', 'info', 2500);
      }
    },

    /**
     * Compresses any image file/blob to WebP (< 200KB, at least 90% quality)
     */
    async compressToWebP(fileOrBlob) {
      if (!fileOrBlob) throw new Error('No file provided');

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.onload = (e) => {
          const img = new Image();
          img.onerror = () => reject(new Error('Failed to load image element'));
          img.onload = () => {
            try {
              let w = img.naturalWidth || img.width || 1200;
              let h = img.naturalHeight || img.height || 1200;

              // Max dimension 1920px for crisp high-res blog & product displays
              const maxDim = 1920;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }

              const canvas = document.createElement('canvas');
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, w, h);

              // Target: under 200KB with at least 90% quality (0.94 -> 0.92 -> 0.90)
              const tryQualities = [0.94, 0.92, 0.90];
              let currentIdx = 0;

              function attemptCompression() {
                const quality = tryQualities[currentIdx] || 0.90;
                canvas.toBlob((blob) => {
                  if (!blob) {
                    return resolve(fileOrBlob);
                  }

                  // If under 200KB (204,800 bytes) or we've reached 90% quality floor
                  if (blob.size <= 200 * 1024 || currentIdx >= tryQualities.length - 1) {
                    console.log(`[Urartoo Image Optimizer] Compressed to WebP: ${(blob.size / 1024).toFixed(1)} KB (quality: ${(quality * 100).toFixed(0)}%)`);
                    return resolve(blob);
                  }

                  // If still > 200KB, attempt next quality step down to 90%
                  currentIdx++;
                  attemptCompression();
                }, 'image/webp', quality);
              }

              attemptCompression();
            } catch (err) {
              console.warn('[Urartoo Image Optimizer] Canvas conversion error:', err);
              resolve(fileOrBlob);
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(fileOrBlob);
      });
    },

    async handleBlogThumbnailUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const toast = this.showToast ? this.showToast('Գլխավոր նկարը սեղմվում է WebP (<200KB)...', 'loading', 0) : null;

      try {
        console.log('[Urartoo] Compressing blog thumbnail to WebP < 200KB...');
        const webpBlob = await this.compressToWebP(file);
        
        let cdnUrl = '';
        if (window.NovaSanity && typeof window.NovaSanity.uploadImage === 'function') {
          cdnUrl = await window.NovaSanity.uploadImage(webpBlob);
        }

        if (!cdnUrl) {
          try {
            const SANITY_TOKEN = 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud';
            const uploadRes = await fetch('https://g1vi85kp.api.sanity.io/v2024-01-01/assets/images/production', {
              method: 'POST',
              headers: {
                'Content-Type': 'image/webp',
                'Authorization': 'Bearer ' + SANITY_TOKEN
              },
              body: webpBlob
            });
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              if (uploadData && uploadData.document && uploadData.document.url) {
                cdnUrl = uploadData.document.url;
              }
            }
          } catch (directErr) {
            console.warn('Direct Sanity asset upload failed:', directErr);
          }
        }

        if (!cdnUrl) {
          cdnUrl = URL.createObjectURL(webpBlob);
        }

        this.updateBlogThumbnailFromUrl(cdnUrl);
        if (toast) toast.update('Գլխավոր նկարը հաջողությամբ վերբեռնվեց (WebP, <200KB)։', 'success', 3500);
        event.target.value = '';
      } catch (err) {
        console.error('Error uploading blog thumbnail:', err);
        if (toast) toast.update('Նկարի վերբեռնումը ձախողվեց։', 'danger', 3500);
        alert('Նկարի վերբեռնումը ձախողվեց։ Խնդրում ենք կրկին փորձել։');
      }
    },

    async handleBlogAddMedia(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const toast = this.showToast ? this.showToast('Նկարը սեղմվում է WebP (<200KB) և վերբեռնվում...', 'loading', 0) : null;

      try {
        console.log('[Urartoo] Compressing in-content media to WebP < 200KB...');
        const webpBlob = await this.compressToWebP(file);

        let cdnUrl = '';
        if (window.NovaSanity && typeof window.NovaSanity.uploadImage === 'function') {
          cdnUrl = await window.NovaSanity.uploadImage(webpBlob);
        }

        if (!cdnUrl) {
          try {
            const SANITY_TOKEN = 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud';
            const uploadRes = await fetch('https://g1vi85kp.api.sanity.io/v2024-01-01/assets/images/production', {
              method: 'POST',
              headers: {
                'Content-Type': 'image/webp',
                'Authorization': 'Bearer ' + SANITY_TOKEN
              },
              body: webpBlob
            });
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              if (uploadData && uploadData.document && uploadData.document.url) {
                cdnUrl = uploadData.document.url;
              }
            }
          } catch (directErr) {
            console.warn('Direct Sanity asset upload failed:', directErr);
          }
        }

        if (!cdnUrl) {
          cdnUrl = URL.createObjectURL(webpBlob);
        }

        // Get caption
        let defaultCaption = '';
        if (this._activeTargetFigure) {
          const existingCaption = this._activeTargetFigure.querySelector('figcaption, .journal-post-figure-caption');
          if (existingCaption) defaultCaption = existingCaption.textContent.trim();
        }

        const caption = prompt('Մուտքագրեք լուսանկարի նկարագրությունը (Caption, ոչ պարտադիր):', defaultCaption) || defaultCaption;

        const figureHtml = `
          <figure class="article-figure" style="margin:28px 0; text-align:center;">
            <img src="${cdnUrl}" alt="${caption}" style="max-width:100%; height:auto; border-radius:3px; display:block; margin:0 auto;" loading="lazy">
            ${caption ? `<figcaption style="font-size:12.5px; color:#787C82; margin-top:8px; font-style:italic;">${caption}</figcaption>` : ''}
          </figure>
          <p><br></p>
        `;

        this.switchBlogEditorMode('visual');
        const visualEl = document.getElementById('be-content-visual');
        if (visualEl) {
          if (this._activeTargetFigure && this._activeTargetFigure.parentElement) {
            const targetFig = this._activeTargetFigure;
            this._activeTargetFigure = null;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = figureHtml.trim();
            const newFig = tempDiv.firstElementChild;
            targetFig.replaceWith(newFig);
          } else {
            visualEl.focus();
            document.execCommand('insertHTML', false, figureHtml);
          }
          this.syncBlogVisualToText();
        }

        if (toast) toast.update('Նկարը հաջողությամբ ավելացվեց (WebP, <200KB)։', 'success', 3500);
        event.target.value = '';
      } catch (err) {
        console.error('Error adding in-content media:', err);
        if (toast) toast.update('Նկարի ավելացումը ձախողվեց։', 'danger', 3500);
        alert('Նկարի ավելացումը ձախողվեց։ Խնդրում ենք կրկին փորձել։');
      }
    },

    switchBlogEditorMode(mode) {
      const visualTab = document.getElementById('btn-editor-mode-visual');
      const textTab = document.getElementById('btn-editor-mode-text');
      const visualEl = document.getElementById('be-content-visual');
      const textEl = document.getElementById('be-content-text');
      const toolbar = document.getElementById('scf-editor-toolbar');

      if (mode === 'visual') {
        if (visualTab) visualTab.classList.add('active');
        if (textTab) textTab.classList.remove('active');
        if (toolbar) toolbar.style.display = 'flex';

        if (textEl && visualEl) {
          visualEl.innerHTML = textEl.value;
          visualEl.style.display = 'block';
          textEl.style.display = 'none';
        }
      } else {
        if (textTab) textTab.classList.add('active');
        if (visualTab) visualTab.classList.remove('active');
        if (toolbar) toolbar.style.display = 'none';

        if (visualEl && textEl) {
          textEl.value = visualEl.innerHTML;
          textEl.style.display = 'block';
          visualEl.style.display = 'none';
        }
      }
    },

    execBlogCommand(cmd, val = null) {
      const visualEl = document.getElementById('be-content-visual');
      if (!visualEl) return;
      visualEl.focus();
      document.execCommand(cmd, false, val);
      this.syncBlogVisualToText();
    },

    execBlogFormat(tag) {
      const visualEl = document.getElementById('be-content-visual');
      if (!visualEl) return;
      visualEl.focus();
      document.execCommand('formatBlock', false, `<${tag}>`);
      this.syncBlogVisualToText();
    },

    execBlogBlockquote() {
      const visualEl = document.getElementById('be-content-visual');
      if (!visualEl) return;
      visualEl.focus();
      const selection = window.getSelection();
      const selectedText = selection.toString() || 'Մեջբերում...';
      const quoteHtml = `<blockquote><span>${selectedText}</span></blockquote><p><br></p>`;
      document.execCommand('insertHTML', false, quoteHtml);
      this.syncBlogVisualToText();
    },

    execBlogLink() {
      const url = prompt('Մուտքագրեք հղման URL-ը (e.g. https://... կամ shop.html):', 'https://');
      if (url) {
        this.execBlogCommand('createLink', url);
      }
    },

    syncBlogVisualToText() {
      const visualEl = document.getElementById('be-content-visual');
      const textEl = document.getElementById('be-content-text');
      if (visualEl && textEl) {
        textEl.value = visualEl.innerHTML;
      }
    },

    syncBlogTextToVisual() {
      const visualEl = document.getElementById('be-content-visual');
      const textEl = document.getElementById('be-content-text');
      if (visualEl && textEl) {
        visualEl.innerHTML = textEl.value;
      }
    },

    addBlogFaqRow(q = '', a = '') {
      this.currentBlogFaqs.push({ q, a });
      this.renderBlogFaqs();
    },

    removeBlogFaqRow(idx) {
      if (idx >= 0 && idx < this.currentBlogFaqs.length) {
        this.currentBlogFaqs.splice(idx, 1);
        this.renderBlogFaqs();
      }
    },

    renderBlogFaqs() {
      const container = document.getElementById('be-faqs-container');
      if (!container) return;

      if (this.currentBlogFaqs.length === 0) {
        container.innerHTML = '<div style="font-size:12.5px; color:var(--tuff); text-align:center; padding:12px; margin-bottom:10px;">Հարցեր չկան։ Սեղմեք «+ Ավելացնել Նոր Հարց»։</div>';
        return;
      }

      container.innerHTML = this.currentBlogFaqs.map((faq, idx) => `
        <div class="scf-faq-item">
          <button type="button" class="scf-faq-remove-btn" onclick="window.WooCommerceAdmin.removeBlogFaqRow(${idx})" title="Ջնջել հարցը">✕</button>
          <div class="admin-form-group" style="margin-bottom:8px;">
            <label style="font-size:11.5px; font-weight:600; color:#333; display:block; margin-bottom:4px;">Հարց #${idx + 1}</label>
            <input type="text" class="admin-input" value="${(faq.q || '').replace(/"/g, '&quot;')}" oninput="window.WooCommerceAdmin.currentBlogFaqs[${idx}].q = this.value;" placeholder="օր․ Կարո՞ղ եմ խնդրել քար որոշակի վայրից։">
          </div>
          <div class="admin-form-group" style="margin-bottom:0;">
            <label style="font-size:11.5px; font-weight:600; color:#333; display:block; margin-bottom:4px;">Պատասխան</label>
            <textarea class="admin-input" rows="2" oninput="window.WooCommerceAdmin.currentBlogFaqs[${idx}].a = this.value;" placeholder="Մանրամասն պատասխան...">${faq.a || ''}</textarea>
          </div>
        </div>
      `).join('');
    },

    async saveBlogFromEditor() {
      const titleInput = document.getElementById('be-title');
      if (!titleInput || !titleInput.value.trim()) {
        alert('Խնդրում ենք մուտքագրել հոդվածի վերնագիրը։');
        return;
      }

      const title = titleInput.value.trim();
      const date = document.getElementById('be-date')?.value.trim() || '2026';
      const location = document.getElementById('be-location')?.value.trim() || 'Հայաստան';
      const readTime = document.getElementById('be-readtime')?.value.trim() || '5 րոպե';
      let slug = document.getElementById('be-slug')?.value.trim();
      if (!slug) {
        slug = this.currentEditingBlogId || ('post-' + Date.now());
      }
      const lead = document.getElementById('be-lead')?.value.trim() || '';
      const topic = document.getElementById('be-topic')?.value || 'Քարահավաք';
      const featured = Boolean(document.getElementById('be-featured')?.checked);

      const heroImg = (document.getElementById('be-hero-url')?.value || '').trim();
      const heroCaption = (document.getElementById('be-hero-caption')?.value || '').trim();

      const visualEl = document.getElementById('be-content-visual');
      const textEl = document.getElementById('be-content-text');
      const contentHtml = (textEl && textEl.style.display !== 'none') ? textEl.value : (visualEl ? visualEl.innerHTML : '');

      // Featured product
      const featTitle = document.getElementById('be-featprod-title')?.value.trim();
      let featuredProduct = null;
      if (featTitle) {
        featuredProduct = {
          title: featTitle,
          price: document.getElementById('be-featprod-price')?.value.trim() || '$265',
          badge: document.getElementById('be-featprod-badge')?.value.trim() || 'Եզակի (1 of 1)',
          img: document.getElementById('be-featprod-img')?.value.trim() || 'Images/ring.webp',
          link: 'shop.html'
        };
      }

      // FAQs
      const faqs = (this.currentBlogFaqs || []).filter(f => f.q && f.q.trim());

      const postData = {
        id: this.currentEditingBlogId || slug,
        slug: slug,
        title: title,
        date: date,
        location: location,
        readTime: readTime,
        lead: lead,
        excerpt: lead,
        topic: topic,
        featured: featured,
        heroImg: heroImg,
        heroCaption: heroCaption,
        contentHtml: contentHtml,
        content: contentHtml,
        featuredProduct: featuredProduct,
        faqs: faqs
      };

      if (window.NovaSanity) {
        await window.NovaSanity.saveJournalPost(postData);
      }

      this.closeBlogEditor();
      this.renderJournalSec();

      if (typeof window.showToastNotification === 'function') {
        window.showToastNotification(`✓ «${title}» նշումը հաջողությամբ պահպանվեց։`, 'success', 3500);
      } else {
        console.log(`[Urartoo] Saved post: «${title}»`);
      }
    },

    async deleteJournalPost(postId) {
      if (!confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս նշումը։')) return;

      if (window.NovaSanity) {
        await window.NovaSanity.deleteJournalPost(postId);
      }

      this.renderJournalSec();

      if (typeof window.showToastNotification === 'function') {
        window.showToastNotification('✓ Նշումը ջնջվեց։', 'success', 3500);
      }
    },

    /* JOURNAL BULK ACTIONS */
    toggleSelectAllJournal(isChecked) {
      document.querySelectorAll('.admin-journal-checkbox').forEach(cb => {
        cb.checked = isChecked;
      });
    },

    getSelectedJournalIds() {
      const checkboxes = document.querySelectorAll('.admin-journal-checkbox:checked');
      const ids = new Set();
      checkboxes.forEach(cb => ids.add(cb.value));
      return Array.from(ids);
    },

    async executeBulkJournalAction() {
      const selectEl = document.getElementById('admin-journal-bulk-action');
      const action = selectEl ? selectEl.value : '';

      if (!action) return;

      const selectedIds = this.getSelectedJournalIds();
      if (selectedIds.length === 0) {
        this.showToast('Խնդրում ենք նշել գոնե մեկ նշում։', 'info', 3000);
        return;
      }

      if (action === 'delete') {
        if (!confirm(`Վստա՞հ եք, որ ցանկանում եք ջնջել ${selectedIds.length} նշում։`)) return;

        const loadingToast = this.showToast(`Ջնջվում է ${selectedIds.length} նշում...`, 'loading', 0);

        let deletedCount = 0;
        for (const id of selectedIds) {
          try {
            if (window.NovaSanity) {
              await window.NovaSanity.deleteJournalPost(id);
              deletedCount++;
            }
          } catch (e) {
            console.error('Error bulk deleting journal post:', id, e);
          }
        }

        if (selectEl) selectEl.value = '';
        const selectAll = document.getElementById('admin-journal-select-all');
        if (selectAll) selectAll.checked = false;

        this.renderJournalSec();

        if (loadingToast) {
          loadingToast.update(`${deletedCount} նշում հաջողությամբ ջնջվեց։`, 'danger', 4000);
        }
      }
    },

    handleAdminFormSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      const emailEl = document.getElementById('admin-email-input');
      const passEl = document.getElementById('admin-pass-input');
      const email = emailEl ? emailEl.value : '';
      const pass = passEl ? passEl.value : '';

      if (!email || !pass) {
        if (emailEl) emailEl.focus();
        return false;
      }

      if (!this.login(email, pass)) {
        if (passEl) passEl.focus();
        return false;
      }
      return false;
    },

    bindEvents() {
      // Global click delegation for all nav items across desktop and mobile
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.admin-nav-item');
        if (btn) {
          const tab = btn.dataset.tab;
          if (tab) {
            e.preventDefault();
            this.switchTab(tab);
          }
        }
      });
    }
  };

  window.initCustomSelects = function () {
    const selects = document.querySelectorAll('select:not([data-customized])');
    selects.forEach(select => {
      select.setAttribute('data-customized', 'true');
      select.style.display = 'none';

      const wrapper = document.createElement('div');
      wrapper.className = 'ura-custom-select';
      if (select.id) wrapper.id = `ura-custom-${select.id}`;
      if (select.style.maxWidth) wrapper.style.maxWidth = select.style.maxWidth;
      if (select.style.width) wrapper.style.width = select.style.width;
      if (select.style.minWidth) wrapper.style.minWidth = select.style.minWidth;
      if (select.style.flex) wrapper.style.flex = select.style.flex;

      const trigger = document.createElement('div');
      trigger.className = 'ura-select-trigger';

      const label = document.createElement('span');
      label.className = 'ura-select-label';
      const selectedOption = select.options[select.selectedIndex] || select.options[0];
      label.textContent = selectedOption ? selectedOption.textContent : '';

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('class', 'ura-select-arrow');
      arrow.setAttribute('viewBox', '0 0 24 24');
      arrow.setAttribute('fill', 'none');
      arrow.setAttribute('stroke', 'currentColor');
      arrow.setAttribute('stroke-width', '2.2');
      arrow.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';

      trigger.appendChild(label);
      trigger.appendChild(arrow);
      wrapper.appendChild(trigger);

      const menu = document.createElement('div');
      menu.className = 'ura-select-menu';

      const updateMenuOptions = () => {
        menu.innerHTML = '';
        Array.from(select.options).forEach((opt, idx) => {
          const item = document.createElement('div');
          item.className = 'ura-select-option' + (idx === select.selectedIndex ? ' selected' : '');
          item.dataset.value = opt.value;
          item.textContent = opt.textContent;

          item.addEventListener('click', (e) => {
            e.stopPropagation();
            select.selectedIndex = idx;
            select.value = opt.value;
            label.textContent = opt.textContent;

            menu.querySelectorAll('.ura-select-option').forEach(o => o.classList.remove('selected'));
            item.classList.add('selected');

            wrapper.classList.remove('active');
            select.dispatchEvent(new Event('change', { bubbles: true }));
          });

          menu.appendChild(item);
        });
      };

      updateMenuOptions();
      wrapper.appendChild(menu);

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        updateMenuOptions();
        document.querySelectorAll('.ura-custom-select.active').forEach(w => {
          if (w !== wrapper) w.classList.remove('active');
        });
        wrapper.classList.toggle('active');
      });

      select.parentNode.insertBefore(wrapper, select.nextSibling);
    });
  };

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.ura-custom-select')) {
      document.querySelectorAll('.ura-custom-select.active').forEach(w => w.classList.remove('active'));
    }
  });

  window.WooCommerceAdmin = WooCommerceAdmin;

  window.addEventListener('urartoo:products-updated', () => {
    if (window.WooCommerceAdmin && typeof window.WooCommerceAdmin.renderProductsSec === 'function') {
      window.WooCommerceAdmin.renderProductsSec();
    }
  });

  window.addEventListener('urartoo:orders-updated', () => {
    if (window.WooCommerceAdmin && typeof window.WooCommerceAdmin.renderOrdersSec === 'function') {
      window.WooCommerceAdmin.renderOrdersSec();
    }
  });

  window.addEventListener('urartoo:users-updated', () => {
    if (window.WooCommerceAdmin && typeof window.WooCommerceAdmin.renderClientsSec === 'function') {
      window.WooCommerceAdmin.renderClientsSec();
    }
  });

  window.addEventListener('urartoo:journal-updated', () => {
    if (window.WooCommerceAdmin && typeof window.WooCommerceAdmin.renderJournalSec === 'function') {
      window.WooCommerceAdmin.renderJournalSec();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      WooCommerceAdmin.init();
      window.initCustomSelects();
    });
  } else {
    WooCommerceAdmin.init();
    window.initCustomSelects();
  }

})(window);

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

  window.switchAdminTab = function (tabName) {
    const validTabs = ['orders', 'products', 'clients'];
    const activeTab = validTabs.includes(tabName) ? tabName : 'orders';

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
      else if (activeTab === 'settings') window.WooCommerceAdmin.renderSettingsSec();
      else window.WooCommerceAdmin.renderOrdersSec();
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

      const isAdminRoute = rawHash.includes('admin') || hash === 'products' || hash === 'orders' || path.endsWith('/admin') || path.endsWith('/admin.html') || path.includes('admin');

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
        tbody.innerHTML = filtered.map(p => {
          const isSold = p.sold || p.stock === 0;
          const statusBadge = isSold
            ? '<span class="admin-status-badge badge-failed">Վաճառված</span>'
            : '<span class="admin-status-badge badge-processing">Առկա</span>';

          const imgSrc = p.img || p.image || 'Images/bracelet.webp';
          const pId = p._sanityId || p.id;
          const currentStock = p.stock !== undefined ? p.stock : (p.sold ? 0 : 1);

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
            <td><code style="font-family:var(--mono);">${p.sku || 'UR-100'}</code></td>
            <td>${p.cat || p.category || 'Մատանիներ'}</td>
            <td>${p.stone || 'Նռնաքար'} (${p.region || p.stoneOrigin || 'Վայոց Ձոր'})</td>
            <td><strong style="font-family:var(--mono);color:var(--amber);">$${p.price}</strong></td>
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
        mobileCardsContainer.innerHTML = filtered.map(p => {
          const isSold = p.sold || p.stock === 0;
          const statusBadge = isSold
            ? '<span class="admin-status-badge badge-failed" style="font-size:11px;">Վաճառված</span>'
            : '<span class="admin-status-badge badge-processing" style="font-size:11px;">Առկա</span>';

          const imgSrc = p.img || p.image || 'Images/bracelet.webp';
          const pId = p._sanityId || p.id;
          const currentStock = p.stock !== undefined ? p.stock : (p.sold ? 0 : 1);

          return `<div class="admin-prod-mobile-card">
            <div class="admin-prod-mobile-header">
              <input type="checkbox" class="admin-prod-checkbox" value="${pId}" style="width:18px; height:18px; cursor:pointer; margin-right:6px;">
              <img src="${imgSrc}" class="admin-prod-mobile-img" alt="${p.name}">
              <div class="admin-prod-mobile-meta">
                <div class="admin-prod-mobile-title">${p.name}</div>
                <div style="font-size:12px; color:var(--tuff); font-family:var(--mono);">${p.sku || 'UR-100'} • ${p.cat || p.category || 'Մատանիներ'}</div>
                <div class="admin-prod-mobile-badges">
                  ${statusBadge}
                  <span style="font-size:11px; background:#F4F3EF; padding:2px 8px; border-radius:2px; color:var(--tuff);">${p.stone || 'Նռնաքար'} (${p.region || 'Վայոց Ձոր'})</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px; margin-top:6px;">
                  <span style="font-size:11.5px; color:var(--tuff); font-weight:600;">Քանակ:</span>
                  <input type="number" min="0" value="${currentStock}" onchange="window.WooCommerceAdmin.updateQuickStock('${pId}', this.value)" style="width:55px; padding:4px 6px; border:1px solid var(--pumice); border-radius:4px; font-weight:700; font-family:var(--mono); text-align:center; font-size:12px; background:#FFF;">
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
        alert('Խնդրում ենք մուտքագրել քարի անվանումը։');
        return;
      }

      const stoneName = nameInput.value.trim();
      const stoneColor = (colorInput ? colorInput.value : '#7B2D3B') || '#7B2D3B';
      const stoneRegion = (regionInput ? regionInput.value.trim() : '') || 'Հայաստան';

      let customStones = [];
      try {
        customStones = JSON.parse(localStorage.getItem('urartoo_stones_db_v1')) || [];
      } catch (e) {}

      const existingIdx = customStones.findIndex(s => s.name.toLowerCase() === stoneName.toLowerCase());
      const newStoneObj = { name: stoneName, color: stoneColor, region: stoneRegion };

      if (existingIdx >= 0) {
        customStones[existingIdx] = newStoneObj;
      } else {
        customStones.push(newStoneObj);
      }

      try {
        localStorage.setItem('urartoo_stones_db_v1', JSON.stringify(customStones));
      } catch (e) {}

      this.populateStoneDropdown();
      const peStoneEl = document.getElementById('pe-stone');
      if (peStoneEl) peStoneEl.value = stoneName;

      const peRegionEl = document.getElementById('pe-region');
      if (peRegionEl && stoneRegion) peRegionEl.value = stoneRegion;

      this.closeStoneEditor();

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
          if (window.NovaSanity) {
            const uploadedAssetUrl = await window.NovaSanity.uploadImage(file);
            if (uploadedAssetUrl) {
              this.currentGallery.push(uploadedAssetUrl);
              continue;
            }
          }
        } catch (err) {
          console.error('Image upload failed:', err);
        }

        // Local fallback base64
        await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            if (evt.target.result) this.currentGallery.push(evt.target.result);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }

      this.activeImageIndex = Math.max(0, this.currentGallery.length - 1);
      this.renderGalleryThumbnails();
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
        sku: `UR-${Math.floor(100 + Math.random() * 900)}`,
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
        addAuditLog(`Պահպանվեց ապրանք: «${name}» ($${price})`);
      }

      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 ՊԱՀՊԱՆԵԼ'; }
      this.closeProductEditor();
      this.renderProductsSec();

      if (loadingToast) {
        loadingToast.update(`Ապրանք «${name}» հաջողությամբ պահպանվեց։`, 'success', 4000);
      }
    },

    async deleteProduct(productId) {
      let prodName = 'Ապրանք';
      if (window.NovaSanity) {
        const products = await window.NovaSanity.getProducts();
        const found = products.find(p => String(p._sanityId) === String(productId) || String(p.id) === String(productId));
        if (found) prodName = found.name;
      }

      const loadingToast = this.showToast(`Ջնջվում է «${prodName}»...`, 'loading', 0);

      if (window.NovaSanity) {
        await window.NovaSanity.deleteProduct(productId);
        addAuditLog(`Ջնջվեց ապրանք Sanity-ից ID: ${productId}`);
        this.renderProductsSec();
      }

      if (loadingToast) {
        loadingToast.update(`Ապրանք «${prodName}» ջնջվեց։`, 'danger', 4000);
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
                <span style="color:var(--amber); font-family:var(--mono); font-weight:700;">$${itemPrice}</span> × ${itemQty} = <strong style="font-family:var(--mono); color:var(--ink);">$${itemSubtotal}</strong>
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
          <td><strong style="font-family:var(--mono); color:var(--amber); font-size:14.5px;">$${o.total}</strong></td>
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
      addAuditLog(`Գրանցվել է նոր պատվեր #${newOrder.id} ($${newOrder.total}) - ${newOrder.customer}`);

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

    async _renderClientsFromSanity() {
      const tbody = document.getElementById('admin-clients-tbody');
      const searchInput = document.getElementById('admin-client-search');
      const searchQ = searchInput ? searchInput.value.trim().toLowerCase() : '';

      const orders = getOrders();

      // Fetch users from Sanity CMS (sole source of truth)
      let usersDB = [];
      try {
        const SANITY_TOKEN = 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud';
        const groq = encodeURIComponent('*[_type == "userAccount"]{ _id, name, email, phone, joined, isAdmin, role, orders }');
        const url = 'https://g1vi85kp.api.sanity.io/v2024-01-01/data/query/production?query=' + groq;
        const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + SANITY_TOKEN } });
        if (res.ok) {
          const data = await res.json();
          usersDB = data.result || [];
        }
      } catch (e) { console.warn('Failed to fetch users from Sanity:', e); }

      const clientMap = new Map();

      // 1. Populate registered users from database
      usersDB.forEach(u => {
        const email = (u.email || '').toLowerCase();
        if (!email) return;
        clientMap.set(email, {
          name: u.name || 'Անանուն',
          email: email,
          phone: u.phone || '',
          joined: u.joined || '2026',
          isAdmin: !!u.isAdmin || u.role === 'Super Admin',
          ordersCount: (u.orders || []).length,
          totalSpent: (u.orders || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0),
          lastOrderDate: (u.orders && u.orders.length > 0) ? u.orders[0].date : ''
        });
      });

      // 2. Merge orders list (for guest checkouts or additional orders)
      orders.forEach(o => {
        const email = (o.email || 'customer@example.com').toLowerCase();
        if (!clientMap.has(email)) {
          clientMap.set(email, {
            name: o.customer || 'Գնորդ',
            email: email,
            phone: o.phone || '',
            joined: '2026',
            isAdmin: false,
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
        clients = clients.filter(c => c.name.toLowerCase().includes(searchQ) || c.email.toLowerCase().includes(searchQ) || c.phone.toLowerCase().includes(searchQ));
      }

      // Update stat cards
      const countEl = document.getElementById('admin-clients-count-val');
      const activeEl = document.getElementById('admin-active-buyers-val');
      const ltvEl = document.getElementById('admin-client-ltv-val');

      if (countEl) countEl.textContent = clients.length;
      if (activeEl) activeEl.textContent = clients.filter(c => c.ordersCount > 0).length;

      const totalLtv = clients.reduce((sum, c) => sum + c.totalSpent, 0);
      const avgLtv = clients.length > 0 ? Math.round(totalLtv / clients.length) : 0;
      if (ltvEl) ltvEl.textContent = `$${avgLtv}`;

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

        return `<tr>
          <td>
            <strong style="font-size:13.5px; color:var(--ink);">${c.name}</strong>
            ${c.phone ? `<div style="font-size:12px; color:var(--tuff); margin-top:2px;">📞 ${c.phone}</div>` : ''}
            <div style="font-size:11px; color:var(--tuff); margin-top:1px;">Գրանցված: ${c.joined}</div>
          </td>
          <td style="font-size:13px; color:var(--charcoal); font-weight:500;">✉️ ${c.email}</td>
          <td><span class="admin-status-badge ${c.ordersCount > 0 ? 'badge-processing' : 'badge-pending'}">${c.ordersCount} պատվեր</span></td>
          <td style="font-family:var(--mono); font-weight:700; color:var(--amber); font-size:14px;">$${c.totalSpent}</td>
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

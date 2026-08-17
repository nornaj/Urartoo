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

  window.switchAdminTab = function (tabName) {
    const isProducts = (tabName === 'products' || tabName === 'inventory');

    const btnOrders = document.getElementById('tab-btn-orders');
    const btnProducts = document.getElementById('tab-btn-products');

    if (btnOrders) {
      if (isProducts) {
        btnOrders.classList.remove('active');
        btnOrders.style.color = 'rgba(255,255,255,0.75)';
        btnOrders.style.background = 'none';
        btnOrders.style.borderLeft = 'none';
      } else {
        btnOrders.classList.add('active');
        btnOrders.style.color = 'var(--gold)';
        btnOrders.style.background = 'rgba(255,255,255,0.05)';
        btnOrders.style.borderLeft = '4px solid var(--gold)';
      }
    }

    if (btnProducts) {
      if (isProducts) {
        btnProducts.classList.add('active');
        btnProducts.style.color = 'var(--gold)';
        btnProducts.style.background = 'rgba(255,255,255,0.05)';
        btnProducts.style.borderLeft = '4px solid var(--gold)';
      } else {
        btnProducts.classList.remove('active');
        btnProducts.style.color = 'rgba(255,255,255,0.75)';
        btnProducts.style.background = 'none';
        btnProducts.style.borderLeft = 'none';
      }
    }

    const secOrders = document.getElementById('admin-sec-orders');
    const secProducts = document.getElementById('admin-sec-products');

    if (secOrders) {
      secOrders.style.setProperty('display', isProducts ? 'none' : 'block', 'important');
    }
    if (secProducts) {
      secProducts.style.setProperty('display', isProducts ? 'block' : 'none', 'important');
    }

    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, null, isProducts ? '#products' : '#orders');
      }
    } catch (e) {}

    if (window.WooCommerceAdmin) {
      window.WooCommerceAdmin.activeTab = isProducts ? 'products' : 'orders';
      if (isProducts) {
        window.WooCommerceAdmin.renderProductsSec();
      } else {
        window.WooCommerceAdmin.renderOrdersSec();
      }
    }
  };

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

      const seedProducts = (window.NovaSanity && window.NovaSanity.INITIAL_SEED_PRODUCTS)
        ? window.NovaSanity.INITIAL_SEED_PRODUCTS
        : [
          { id: "ring-1", name: "Վայոց Ձորի նռնաքարով մատանի", sku: "UR-RING-GAR-01", category: "Մատանիներ", stone: "Նռնաքար", region: "Վայոց Ձոր", price: 340, sold: false, img: "Images/bracelet.webp" },
          { id: "pendant-2", name: "Գուտանասարի օբսիդիանով կախազարդ", sku: "UR-PEND-OBS-02", category: "Վզնոցներ", stone: "Օբսիդիան", region: "Գուտանասար", price: 265, sold: false, img: "Images/bracelet.webp" },
          { id: "bracelet-3", name: "Սյունիքի փիրուզով ապարանջան", sku: "UR-BRAC-TUR-03", category: "Ապարանջաններ", stone: "Փիրուզ", region: "Սյունիք", price: 410, sold: false, img: "Images/bracelet.webp" },
          { id: "earring-4", name: "Արենիի հասպիսով ականջօղեր", sku: "UR-EAR-JAS-04", category: "Ականջօղեր", stone: "Հասպիս", region: "Արենի", price: 190, sold: true, img: "Images/bracelet.webp" }
        ];

      // Render seed products immediately (0ms delay!)
      this.populateProductsHTML(seedProducts);

      try {
        if (window.NovaSanity) {
          const liveProducts = await window.NovaSanity.getProducts();
          if (liveProducts && liveProducts.length > 0) {
            this.populateProductsHTML(liveProducts);
          }
        }
      } catch (err) {
        console.error('Error fetching Sanity products:', err);
      }
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
        if (tbody) tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--tuff);">Ապրանքներ չեն գտնվել</td></tr>';
        if (mobileCardsContainer) mobileCardsContainer.innerHTML = '<div style="text-align:center;padding:32px;color:var(--tuff);">Ապրանքներ չեն գտնվել</div>';
        return;
      }

      if (tbody) {
        tbody.innerHTML = filtered.map(p => {
          const isSold = p.sold || p.stock === 0;
          const statusBadge = isSold
            ? '<span class="admin-status-badge badge-failed">Վաճառված (Sold)</span>'
            : '<span class="admin-status-badge badge-processing">Առկա (In Stock)</span>';

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
                  <span style="font-size:11.5px; color:var(--tuff); font-weight:600;">Քանակ (Stock):</span>
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
    },

    /* BULK ACTIONS CONTROLLERS */
    toggleSelectAllProducts(isChecked) {
      document.querySelectorAll('.admin-prod-checkbox').forEach(cb => {
        cb.checked = isChecked;
      });
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

      if (!action) {
        alert('Խնդրում ենք ընտրել գործողություն (օր․ 🗑 Ջնջել ընտրվածները)։');
        return;
      }

      const selectedIds = this.getSelectedProductIds();
      if (selectedIds.length === 0) {
        alert('Խնդրում ենք ընտրել առնվազն մեկ ապրանք՝ վանդակը (checkbox) նշելով։');
        return;
      }

      if (action === 'delete') {
        if (!confirm(`Վստա՞հ եք, որ ցանկանում եք ՀԱՎԵՐԺ ՋՆՋԵԼ ընտրված ${selectedIds.length} ապրանք(ները) Sanity CMS-ից։`)) return;

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
        alert(`Ընտրված ${deletedCount} ապրանք(ները) հաջողությամբ ջնջվեցին։`);
      }
    },

    async updateQuickStock(productId, newStockVal) {
      const stockNum = Math.max(0, parseInt(newStockVal, 10) || 0);
      const isSold = stockNum === 0;

      try {
        if (window.NovaSanity) {
          const products = await window.NovaSanity.getProducts();
          const found = products.find(p => p._sanityId === productId || p.id === productId);

          if (found) {
            found.stock = stockNum;
            found.sold = isSold;
            await window.NovaSanity.saveProduct(found);
            addAuditLog(`Քանակի արագ փոփոխություն: «${found.name}» -> ${stockNum}`);
          }
        }
      } catch (err) {
        console.error('Error updating quick stock:', err);
      }

      this.renderProductsSec();
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
      document.getElementById('pe-price').value = '300';
      if (document.getElementById('pe-stock')) document.getElementById('pe-stock').value = '1';
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
        if (modalTitle) modalTitle.textContent = 'Ավելացնել Նոր Ապրանք';
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

      if (imgPlaceholder) imgPlaceholder.textContent = '⏳ Սեղմվում է WebP <200KB...';

      try {
        if (window.NovaSanity) {
          const uploadedAssetUrl = await window.NovaSanity.uploadImage(file);
          if (uploadedAssetUrl) {
            imgPreview.src = uploadedAssetUrl;
            imgPreview.style.display = 'block';
            if (imgPlaceholder) imgPlaceholder.style.display = 'none';
            imgUrlVal.value = uploadedAssetUrl;
            alert('Նկարը հաջողությամբ վերածվեց WebP-ի և բեռնվեց CDN-ում։');
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
      const stockEl = document.getElementById('pe-stock');
      const stockVal = stockEl ? Math.max(0, parseInt(stockEl.value, 10) || 0) : 1;

      if (!name) { alert('Խնդրում ենք լրացնել ապրանքի անվանումը։'); return; }

      const saveBtn = document.getElementById('btn-pe-save');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '⏳ Պահպանվում է...'; }

      const isSoldToggle = document.getElementById('pe-sold-toggle').checked;
      const finalIsSold = isSoldToggle || stockVal === 0;
      const catVal = document.getElementById('pe-cat').value.trim() || 'Մատանիներ';
      const stoneVal = document.getElementById('pe-stone').value.trim() || 'Նռնաքար';
      const regionVal = document.getElementById('pe-region').value.trim() || 'Վայոց Ձոր';
      const matVal = document.getElementById('pe-material').value.trim() || '925 արծաթ';

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
        img: document.getElementById('pe-img-url-val').value || 'Images/bracelet.webp',
        image: document.getElementById('pe-img-url-val').value || 'Images/bracelet.webp'
      };

      if (window.NovaSanity) {
        await window.NovaSanity.saveProduct(prodData);
        addAuditLog(`Պահպանվեց ապրանք: «${name}» ($${price})`);
      }

      if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '💾 ՊԱՀՊԱՆԵ🇱'; }
      this.closeProductEditor();
      this.renderProductsSec();
      alert(`Ապրանքը «${name}» հաջողությամբ պահպանվեց։`);
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

  window.WooCommerceAdmin = WooCommerceAdmin;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => WooCommerceAdmin.init());
  } else {
    WooCommerceAdmin.init();
  }

})(window);

# Admin Panel — Complete HTML Structure Reference

This file documents the exact HTML structure the admin panel must follow.
All IDs, classes, and data attributes are critical for JS binding.

## Admin View Section
```html
<section id="view-admin" class="route-view admin-view hidden" style="padding-top: 130px;">
```

---

## 1. Login Gateway

```html
<div id="admin-login-wrapper" class="admin-login-wrapper">
  <div class="login-card">
    <div class="login-card-header text-center">
      <h3 class="serif-title" data-trans="admin_login_title">Admin Login</h3>
    </div>
    <form id="admin-login-form" onsubmit="submitAdminCredentials(event)">
      <div class="form-group">
        <label for="admin-email-input" data-trans="checkout_email">Email *</label>
        <input type="email" id="admin-email-input" required class="admin-input">
      </div>
      <div class="form-group">
        <label for="admin-pass-input" data-trans="checkout_password_label">Password *</label>
        <input type="password" id="admin-pass-input" required class="admin-input">
      </div>
      <button type="submit" class="btn-primary" data-trans="btn_admin_login">Login</button>
    </form>
  </div>
</div>
```

---

## 2. Dashboard Wrapper

```html
<div id="admin-dashboard-wrapper" class="admin-dashboard-wrapper hidden">
  <div class="container">

    <!-- Admin Header -->
    <div class="admin-header">
      <div class="admin-logo">
        <svg><!-- chart icon --></svg>
        <span data-trans="admin_title">Control Panel</span>
        <span id="admin-user-role-badge">Super Admin</span>
      </div>
      <div>
        <span id="admin-user-profile-name">Logged in as ...</span>
        <button onclick="handleAdminLogout()" data-trans="nav_logout">Log out</button>
        <a href="/shop" data-trans="admin_view_frontend">View Front End</a>
      </div>
    </div>

    <!-- Admin Layout: Sidebar + Content -->
    <div class="admin-layout">
```

---

## 3. Sidebar Navigation

```html
<aside class="admin-sidebar">
  <div class="admin-nav-item active" data-admin-tab="orders">
    <svg><!-- clipboard icon --></svg>
    <span data-trans="admin_nav_orders">Orders Manager</span>
  </div>
  <div class="admin-nav-item" data-admin-tab="inventory">
    <svg><!-- box icon --></svg>
    <span data-trans="admin_nav_inventory">Inventory Tracker</span>
  </div>
  <div class="admin-nav-item" data-admin-tab="developer">
    <svg><!-- gear icon --></svg>
    <span data-trans="admin_nav_dev">Settings</span>
  </div>
  <div class="admin-nav-item" data-admin-tab="clients">
    <svg><!-- users icon --></svg>
    <span data-trans="admin_nav_clients">Clients</span>
  </div>
  <div class="admin-nav-item" data-admin-tab="logs">
    <svg><!-- clock icon --></svg>
    <span data-trans="admin_nav_logs">Activity Logs</span>
  </div>
  <div class="admin-nav-item" data-admin-tab="blog">
    <svg><!-- newspaper icon --></svg>
    <span data-trans="admin_nav_blog">Blog Manager</span>
  </div>
</aside>
```

### Tab Switching JavaScript Pattern
```javascript
document.querySelectorAll('[data-admin-tab]').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.admin-panel-sub').forEach(p => p.classList.add('hidden'));
    const targetPanel = document.getElementById('admin-sec-' + this.dataset.adminTab);
    if (targetPanel) targetPanel.classList.remove('hidden');
  });
});
```

---

## 4. Orders Panel

```html
<div id="admin-sec-orders" class="admin-panel-sub">
  <!-- Stats Grid -->
  <div class="admin-stats-grid">
    <div class="stat-card">
      <div class="stat-label" data-trans="admin_total_revenue">Total Revenue</div>
      <div id="admin-revenue-val" class="stat-val">$0</div>
    </div>
    <div class="stat-card">
      <div class="stat-label" data-trans="admin_orders_placed">Orders Placed</div>
      <div id="admin-orders-val" class="stat-val">0</div>
    </div>
    <div class="stat-card">
      <div class="stat-label" data-trans="admin_avg_order_value">Avg. Order</div>
      <div id="admin-aov-val" class="stat-val">$0</div>
    </div>
    <div class="stat-card">
      <div class="stat-label" data-trans="admin_total_stock">Total Stock</div>
      <div id="admin-stock-val" class="stat-val">0</div>
    </div>
  </div>

  <!-- Sales Chart -->
  <div class="admin-card">
    <h3 class="admin-card-title">Sales Performance</h3>
    <div class="analytics-chart-container" id="admin-brand-chart"></div>
  </div>

  <!-- Orders Table -->
  <div class="admin-card">
    <h3 class="admin-card-title" data-trans="admin_orders_list">Orders List</h3>
    <div class="admin-table-wrap">
      <table class="admin-table text-left">
        <thead>
          <tr>
            <th data-trans="admin_th_order_id">Order ID</th>
            <th data-trans="admin_th_date">Date</th>
            <th data-trans="admin_th_customer">Customer</th>
            <th data-trans="admin_th_items">Items</th>
            <th data-trans="admin_th_total">Total</th>
            <th data-trans="admin_th_status">Status</th>
            <th data-trans="admin_th_actions">Actions</th>
          </tr>
        </thead>
        <tbody id="admin-orders-tbody"></tbody>
      </table>
    </div>
  </div>
</div>
```

---

## 5. Inventory Panel (3 Sub-Tabs)

```html
<div id="admin-sec-inventory" class="admin-panel-sub hidden">
  <!-- Sub-tab buttons -->
  <div style="display:flex; gap:0; margin-bottom:20px; border-bottom:2px solid var(--color-border);">
    <button class="inventory-sub-tab active" data-inv-tab="products" 
            onclick="switchInventorySubTab('products')">Products</button>
    <button class="inventory-sub-tab" data-inv-tab="brands"
            onclick="switchInventorySubTab('brands')">Brands</button>
    <button class="inventory-sub-tab" data-inv-tab="trash"
            onclick="switchInventorySubTab('trash')">Trash</button>
  </div>

  <!-- Products Sub-Panel -->
  <div id="inv-sub-products" class="inv-sub-panel">
    <div class="admin-card">
      <div>
        <h3 class="admin-card-title" data-trans="admin_inventory_title">Inventory & Price Control</h3>
        <button class="btn-primary" onclick="openNewProductModal()">Add New Product</button>
        <button class="btn-primary" onclick="document.getElementById('csv-import-input').click()">Import CSV</button>
        <input type="file" id="csv-import-input" accept=".csv" style="display:none;">
      </div>
      
      <input type="text" id="admin-inventory-search" placeholder="Search products..." 
             oninput="filterInventoryTable(this.value)">
      <select id="bulk-action-select">
        <option value="">Bulk Actions</option>
        <option value="trash">Move to Trash</option>
      </select>
      <button onclick="executeBulkAction()">Proceed</button>
      
      <table class="admin-table text-left">
        <thead>
          <tr>
            <th><input type="checkbox" id="inv-select-all" onchange="toggleAllInventoryCheckboxes(this.checked)"></th>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="admin-inventory-tbody"></tbody>
      </table>
    </div>
  </div>

  <!-- Brands Sub-Panel -->
  <div id="inv-sub-brands" class="inv-sub-panel" style="display:none;">
    <div class="admin-card">
      <h3>Brand Management</h3>
      <form onsubmit="event.preventDefault(); addNewBrand();">
        <input type="text" id="admin-new-brand-input" placeholder="Brand name...">
        <button type="submit">Add Brand</button>
      </form>
      <div id="admin-brands-list"></div>
    </div>
  </div>

  <!-- Trash Sub-Panel -->
  <div id="inv-sub-trash" class="inv-sub-panel" style="display:none;">
    <div class="admin-card">
      <h3>Recently Deleted</h3>
      <div id="admin-trash-list"></div>
      <div id="admin-trash-empty" style="display:none;">Trash is empty</div>
    </div>
  </div>
</div>
```

---

## 6. Settings Panel

```html
<div id="admin-sec-developer" class="admin-panel-sub hidden">
  <div class="admin-card">
    <h3>Admin Access Management</h3>
    <p>Grant or revoke admin panel access by email.</p>
    <div class="admin-subcard">
      <h4>Grant Admin Access</h4>
      <form onsubmit="event.preventDefault(); grantAdminAccess(...);">
        <input type="email" id="grant-admin-email" placeholder="Enter email..." required>
        <button type="submit">Grant Access</button>
      </form>
      <div id="admin-access-list"></div>
    </div>
  </div>
</div>
```

---

## 7. Clients Panel

```html
<div id="admin-sec-clients" class="admin-panel-sub hidden">
  <div class="admin-card">
    <h3 data-trans="admin_clients_title">Registered Clients</h3>
    <span id="admin-clients-count">0 clients</span>
    <table class="admin-table text-left">
      <thead>
        <tr>
          <th>#</th>
          <th data-trans="admin_th_name">Name</th>
          <th data-trans="auth_email_label">Email</th>
          <th data-trans="admin_th_registered">Registered</th>
          <th data-trans="admin_th_actions">Actions</th>
        </tr>
      </thead>
      <tbody id="admin-clients-tbody"></tbody>
    </table>
  </div>
</div>
```

---

## 8. Activity Logs Panel

```html
<div id="admin-sec-logs" class="admin-panel-sub hidden">
  <div class="admin-card">
    <h3 data-trans="admin_logs_title">Activity Logging System</h3>
    <button onclick="clearAuditLogs()" data-trans="admin_logs_clear">Clear Logs</button>
    <table class="admin-table text-left">
      <thead>
        <tr>
          <th data-trans="admin_logs_th_timestamp">Timestamp</th>
          <th data-trans="admin_logs_th_operator">Operator</th>
          <th data-trans="admin_logs_th_action">Action</th>
        </tr>
      </thead>
      <tbody id="admin-audit-logs-tbody"></tbody>
    </table>
  </div>
</div>
```

---

## 9. Blog Manager Panel

```html
<div id="admin-sec-blog" class="admin-panel-sub hidden">
  <h3>Blog Manager</h3>
  
  <div id="blog-admin-form-wrap">
    <form id="blog-admin-form" autocomplete="off">
      <input type="hidden" id="blog-edit-id" value="">
      <!-- Title (EN/AM/RU), Slug -->
      <!-- Category, Read Time, Status -->
      <!-- Featured Image URL, In-Article Image URL -->
      <!-- Excerpt (EN/AM/RU) -->
      <!-- Paragraphs 1-3 (EN/AM/RU) -->
      <!-- Pull Quote (EN/AM/RU) -->
      <!-- Author Name, Author Bio, Tags -->
      <!-- Featured checkbox -->
      <!-- Save + Clear buttons -->
    </form>
  </div>

  <table class="admin-table text-left">
    <thead>
      <tr>
        <th>Title</th>
        <th>Category</th>
        <th>Status</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="admin-blog-tbody"></tbody>
  </table>
</div>
```

---

## 10. Product Editor Page (Full-Screen WordPress-Style)

```html
<div id="product-editor-page" class="product-editor-page" style="display:none;">
  <div class="pe-topbar">
    <div class="pe-topbar-left">
      <button class="pe-back-btn" onclick="closeProductEditor()">← Back to Inventory</button>
      <span class="pe-topbar-title" id="pe-page-title">Edit Product</span>
    </div>
    <div class="pe-topbar-right">
      <button class="pe-publish-btn" onclick="saveProductFromEditor()">Publish</button>
    </div>
  </div>
  <div class="pe-content">
    <div class="pe-main">
      <input type="hidden" id="pe-product-id">
      <div class="pe-name-field">
        <input type="text" id="pe-product-name" class="pe-name-input" placeholder="Product name…">
        <div class="pe-permalink">Slug: <span id="pe-slug">—</span></div>
      </div>
      
      <div class="pe-metabox">
        <div class="pe-metabox-header"><span class="pe-metabox-title">Product Data</span></div>
        <div class="pe-tabs-nav" id="pe-tabs-nav">
          <button class="pe-tab-btn active" data-pe-tab="general">General</button>
          <button class="pe-tab-btn" data-pe-tab="inventory">Inventory</button>
          <button class="pe-tab-btn" data-pe-tab="details">Jewelry Details</button>
        </div>
        
        <!-- General Tab -->
        <div class="pe-tab-panel active" id="pe-panel-general">
          <!-- Brand (select), SKU, Description, Pricing/Sizes -->
        </div>
        
        <!-- Inventory Tab -->
        <div class="pe-tab-panel" id="pe-panel-inventory">
          <!-- Stock quantity, Stock status -->
        </div>
        
        <!-- Jewelry Details Tab -->
        <div class="pe-tab-panel" id="pe-panel-details">
          <!-- Material, Stone type, Stone origin, Weight, Dimensions -->
        </div>
      </div>
    </div>
    
    <div class="pe-sidebar">
      <!-- Product Image metabox -->
      <!-- Classification metabox -->
      <!-- Tags metabox -->
      <!-- Product Stats metabox -->
    </div>
  </div>
</div>
```

---

## 11. Confirm Dialog (Custom)

```html
<div id="nova-confirm-overlay" style="display:none;">
  <div>
    <svg><!-- warning icon --></svg>
    <p id="nova-confirm-message"></p>
    <div>
      <button id="nova-confirm-cancel">Cancel</button>
      <button id="nova-confirm-ok">Confirm</button>
    </div>
  </div>
</div>
```

### Usage Pattern
```javascript
function novaConfirm(message) {
  return new Promise(resolve => {
    document.getElementById('nova-confirm-message').textContent = message;
    document.getElementById('nova-confirm-overlay').style.display = 'flex';
    document.getElementById('nova-confirm-ok').onclick = () => {
      document.getElementById('nova-confirm-overlay').style.display = 'none';
      resolve(true);
    };
    document.getElementById('nova-confirm-cancel').onclick = () => {
      document.getElementById('nova-confirm-overlay').style.display = 'none';
      resolve(false);
    };
  });
}
```

---

## Key CSS Classes for Admin

| Class | Purpose |
|-------|---------|
| `.admin-view` | Main admin section |
| `.admin-login-wrapper` | Login form container |
| `.admin-dashboard-wrapper` | Dashboard container |
| `.admin-layout` | Flex layout (sidebar + content) |
| `.admin-sidebar` | Left navigation sidebar |
| `.admin-nav-item` | Sidebar nav button |
| `.admin-nav-item.active` | Active tab indicator |
| `.admin-content` | Main content area |
| `.admin-panel-sub` | Tab panel container |
| `.admin-card` | Content card with border |
| `.admin-card-title` | Card heading |
| `.admin-table` | Data table |
| `.admin-table-wrap` | Scrollable table wrapper |
| `.admin-input` | Form input styling |
| `.admin-stats-grid` | 4-column stats layout |
| `.stat-card` | Individual stat card |
| `.stat-val` | Large stat number |
| `.stat-label` | Stat description |
| `.admin-status-badge` | Status pill badge |
| `.badge-pending` | Yellow/amber pending |
| `.badge-processing` | Blue processing |
| `.badge-completed` | Green completed |
| `.badge-failed` | Red failed |
| `.badge-instock` | Green in stock |
| `.badge-outofstock` | Red out of stock |
| `.admin-action-btn` | Small action button |
| `.inventory-sub-tab` | Inventory sub-tab button |
| `.inventory-sub-tab.active` | Active sub-tab |
| `.inv-sub-panel` | Inventory sub-panel |
| `.product-editor-page` | Full-page product editor |
| `.pe-topbar` | Editor top bar |
| `.pe-content` | Editor content area |
| `.pe-main` | Editor main column |
| `.pe-sidebar` | Editor sidebar |
| `.pe-metabox` | WordPress-style metabox |
| `.pe-metabox-header` | Metabox header |
| `.pe-metabox-body` | Metabox content |
| `.pe-tab-btn` | Tab button in metabox |
| `.pe-tab-panel` | Tab content panel |
| `.pe-input` | Editor text input |
| `.pe-textarea` | Editor textarea |
| `.pe-select` | Editor dropdown |
| `.pe-label` | Field label |
| `.pe-publish-btn` | Blue publish button |
| `.pe-back-btn` | Back navigation button |

---
name: jewelry-ecommerce
description: Build and maintain a jewelry e-commerce website from scratch. Covers full architecture (MPA & SPA support), admin panel (orders, inventory, brands, clients, activity logs, blog), Firebase/Sanity CMS integration, product data schema, storefront pages (home, shop, product detail, contact, checkout), filtering/sorting, cart & wishlist systems, i18n translations, CSS design system, deployment on Vercel, and SEO. Use when building, modifying, or debugging the jewelry shop, admin dashboard, product management, order tracking, or any storefront feature.
---

# Jewelry E-Commerce Shop — Full Build Skill

This skill provides the complete blueprint for building and maintaining a premium jewelry e-commerce website from scratch. The architecture supports both **Multi-Page Application (MPA)** structure (e.g. `index.html`, `shop.html`, `product.html`, `journal.html`, `services.html`, `contact.html`) and **Single-Page Application (SPA)** structure (with `#view-*` section routing). Every section below is an authoritative reference the agent MUST follow when building or modifying any part of this project.

> **CRITICAL:** This is a jewelry-only shop. There are NO fragrances, NO scent families, NO perfume notes (top/heart/base), NO ingredients/INCI lists, NO bottle sizes (50ml/100ml/200ml). All fragrance-specific concepts must be replaced with jewelry equivalents (metals, stones, region/origin, ring/chain sizes).

---

## 1. Project Architecture Overview

### Tech Stack
- **Frontend**: Vanilla HTML5 + CSS3 + Modern JavaScript (ES6+, modular / script-based)
- **CMS for Products & Images**: Sanity CMS (HTTP API, no SDK dependencies)
- **Database for Orders/Users/Config**: Firebase Firestore (`NovaDB` wrapper)
- **Deployment**: Vercel (static site with header optimization & rewrite rules)
- **Fonts**: Google Fonts (Armenian serif/sans + Latin fonts like Cormorant, Noto Serif Armenian, Noto Sans Armenian, Instrument Sans)
- **Email**: EmailJS for contact forms and order receipts
- **Build**: Custom `build.js` (Terser minification for production JS/CSS)

### File Structure (MPA / SPA Supported)
```
project-root/
├── index.html              # Homepage / SPA root (hero, category grid, featured pieces slider, stone showcase, maker section, trust bar)
├── shop.html               # Dedicated Shop catalog page (filtering sidebar, price range sliders, stone/category chips, search)
├── product.html            # Standalone product detail page (SEO-friendly gallery, size picker, FAQs accordion)
├── journal.html            # Blog / Field notes listing & story pages
├── services.html           # Bespoke / Custom order services page
├── contact.html            # Contact & studio location page
├── styles.css              # Master stylesheet (CSS variables, responsive design, dark/light warm luxury theme)
├── styles.min.css          # Minified production CSS
├── script.js               # Global site interactions (nav drawer, cart drawer toggle, header scroll, animations)
├── shop.js                 # Interactive shop filtering, sorting, price filter, search, & cart grid logic
├── admin.js                # WooCommerce-style admin panel logic (WooCommerceAdmin object)
├── firebase-config.js      # Firebase init + NovaDB wrapper (Orders, users, audit logs, staff profiles)
├── sanity-config.js        # Sanity CMS HTTP API wrapper (NovaSanity)
├── products.js             # Global taxonomy definitions (categories, stones, regions, materials)
├── build.js                # Node.js minification script
├── vercel.json             # Vercel routing rewrites & cache headers
├── manifest.json           # PWA manifest
├── robots.txt              # Search engine directives
├── sitemap.xml             # XML sitemap
└── Images/                 # Static imagery, webp product pictures, logos, hero backgrounds
```

### Routing & Navigation Modes
1. **Multi-Page Application (MPA)**:
   - `/` or `/index.html` → Homepage
   - `/shop.html` or `/shop` → Shop catalog view
   - `/product.html` or `/product?id=...` → Standalone product detail page
   - `/journal.html` → Field notes / blog articles
   - `/services.html` → Custom jewelry creation & resizing services
   - `/contact.html` → Contact & studio inquiry form

2. **Single-Page Application (SPA)**:
   - Routing managed via `#view-{name}` hashes or URL rewrite paths. Each route toggles `<section class="route-view">` visibility.

---

## 2. Product Data Schema (JEWELRY)

### Product Object Structure
Every product in the system MUST have these fields:

```javascript
{
  id: "ring-obsidian-001",           // Unique ID (string)
  _sanityId: "product-ring-001",     // Sanity document ID (auto-generated)
  name: "Obsidian Silver Ring",      // Product name
  brand: "Urartoo",                  // Brand/maker name (or collection name)
  sku: "UR-RING-OBS-01",            // Stock Keeping Unit
  tagline: "Hand-cut volcanic glass in sterling silver",  // Short description for cards
  description: "Full product description...",              // Long description
  
  // JEWELRY-SPECIFIC FIELDS (replaces fragrance fields)
  material: "925 Sterling Silver",   // Primary metal/material
  stone: "Obsidian",                // Gemstone type
  stone_origin: "Gutansar, Armenia", // Where the stone was sourced
  category: "Rings",                // Category: Rings, Necklaces, Bracelets, Earrings, Pendants
  
  // Sizing (replaces bottle sizes)
  sizes: [
    { label: "6", price: 340 },     // Ring sizes, bracelet lengths, chain lengths
    { label: "7", price: 340 },
    { label: "8", price: 340 },
    { label: "Custom", price: 380 }
  ],
  
  price: 340,                       // Base price (number, USD)
  stock: 1,                         // Quantity in stock (jewelry is often 1-of-1)
  
  // Classification
  tags: ["Handmade", "One-of-a-Kind", "Gift"],   // Product tags
  collection: "Volcanic Series",                    // Collection name
  
  // Stats
  rating: 4.9,                      // Average rating (0-5)
  reviewsCount: 23,                 // Number of reviews
  featured: true,                   // Show on homepage featured section
  sold: false,                      // Whether item has been sold (for 1-of-1 pieces)
  
  // Media
  image: "https://cdn.sanity.io/...",    // Main product image URL
  images: ["url1", "url2", "url3"],       // Gallery images array
  
  // FAQs (per product)
  faqs: [
    { q: "Is this ring resizable?", a: "Yes, free resizing within the first year." },
    { q: "What stone is used?", a: "Natural Armenian obsidian from Gutansar volcano." }
  ]
}
```

### Global Taxonomy Definitions (`products.js`)
Replace all fragrance taxonomies with jewelry ones:

```javascript
const GLOBAL_ATTRIBUTES = {
  categories: {
    rings: { id: "rings", label: { en: "Rings", am: "Մատանիներ", ru: "Кольца" } },
    necklaces: { id: "necklaces", label: { en: "Necklaces", am: "Վզնոցներ", ru: "Ожерелья" } },
    bracelets: { id: "bracelets", label: { en: "Bracelets", am: "Ապարանջաններ", ru: "Браслеты" } },
    earrings: { id: "earrings", label: { en: "Earrings", am: "Ականջօղեր", ru: "Серьги" } },
    pendants: { id: "pendants", label: { en: "Pendants", am: "Կախազարդեր", ru: "Кулоны" } }
  },
  materials: {
    sterling_silver: { id: "sterling_silver", label: { en: "925 Sterling Silver", am: "925 արծաթ", ru: "Серебро 925" }, color: "#C0C0C0" },
    gold_14k: { id: "gold_14k", label: { en: "14K Gold", am: "14K Ոսկի", ru: "Золото 14К" }, color: "#FFD700" },
    rose_gold: { id: "rose_gold", label: { en: "Rose Gold", am: "Վարդագույն ոսկի", ru: "Розовое золото" }, color: "#B76E79" }
  },
  stones: {
    obsidian: { id: "obsidian", label: { en: "Obsidian", am: "Օբսիդիան", ru: "Обсидиан" }, color: "#17181A" },
    garnet: { id: "garnet", label: { en: "Garnet", am: "Նռնաքար", ru: "Гранат" }, color: "#7B1B23" },
    turquoise: { id: "turquoise", label: { en: "Turquoise", am: "Փիրուզ", ru: "Бирюза" }, color: "#2E8C8C" },
    jasper: { id: "jasper", label: { en: "Jasper", am: "Հասպիս", ru: "Яшма" }, color: "#A4442B" },
    onyx: { id: "onyx", label: { en: "Onyx", am: "Եղնգաքար", ru: "Оникс" }, color: "#1B1D1C" },
    agate: { id: "agate", label: { en: "Agate", am: "Ագաթ", ru: "Агат" }, color: "#C2A379" },
    quartz: { id: "quartz", label: { en: "Quartz", am: "Քվարց", ru: "Кварц" }, color: "#6B5B4E" }
  },
  regions: {
    vayots_dzor: { id: "vayots_dzor", label: { en: "Vayots Dzor", am: "Վայոց Ձոր", ru: "Вայոց Дзор" } },
    gutansar: { id: "gutansar", label: { en: "Gutansar", am: "Գուտանասար", ru: "Гутанасар" } },
    syunik: { id: "syunik", label: { en: "Syunik", am: "Սյունիք", ru: "Сюник" } },
    areni: { id: "areni", label: { en: "Areni", am: "Արենի", ru: "Арени" } },
    sevan: { id: "sevan", label: { en: "Sevan", am: "Սևան", ru: "Севан" } },
    ararat: { id: "ararat", label: { en: "Ararat Plain", am: "Արարատյան դաշտ", ru: "Араратская долина" } },
    aragats: { id: "aragats", label: { en: "Aragats", am: "Արագած", ru: "Арагац" } }
  },
  genders: {
    men: { id: "men", label: { en: "Men", am: "Տղամարդկանց", ru: "Мужчинам" } },
    women: { id: "women", label: { en: "Women", am: "Կանանց", ru: "Женщинам" } },
    unisex: { id: "unisex", label: { en: "Unisex", am: "Ունիսեքս", ru: "Унисекс" } }
  }
};
```

---

## 3. Sanity CMS Configuration (`sanity-config.js`)

### Purpose
Manages ALL product data and product images. Uses Sanity HTTP API directly (no SDK).

### Key Object: `NovaSanity`
```javascript
const NovaSanity = {
  _products: null,
  _translations: null,
  _ready: false,

  async init() { /* Fetches all products via GROQ query */ },
  getProducts() { /* Returns cached products array */ },
  getProductTranslations() { /* Returns {am: {}, ru: {}} */ },
  
  // GROQ query must be updated for jewelry fields:
  // Remove: scent_family, gender_id, notes, ingredients
  // Add: material, stone, stone_origin, category, collection, sold
  
  async saveProduct(product) { /* Create or update via mutations API */ },
  async saveAllProducts(productsArray) { /* Batch save (50 per batch) */ },
  async deleteProduct(productId) { /* Delete mutation */ },
  
  async uploadImage(imageData, productId, index) { /* Upload to Sanity Assets API */ },
  async deleteImage(url) { /* Delete image asset */ },
  
  async saveProductTranslation(productId, translations) { /* Patch translations */ },
  async saveAllTranslations(translationsObj) { /* Batch translation patches */ },
  
  _transformFromSanity(doc) { /* Transform Sanity doc → app format */ },
  _urlToAssetRef(url) { /* Convert CDN URL to asset reference ID */ },
  _generateKey() { /* Random key for array items */ }
};
```

### Sanity Schema (Product Document)
The Sanity `product` document type must include:
- `productId`, `name`, `brand`, `sku`, `tagline`, `description`
- `material`, `stone`, `stoneOrigin`, `category`, `collection`
- `price`, `sizes[]`, `stock`, `sold`
- `tags[]`, `rating`, `reviewsCount`, `featured`
- `mainImage` (Sanity image reference), `galleryImages[]`
- `translations` (object with `am` and `ru` sub-objects)
- `faqs[]` (array of `{q, a}` objects)

---

## 4. Firebase Configuration (`firebase-config.js`)

### Purpose
Manages everything EXCEPT products/images: orders, users, admin access, audit logs, instagram posts, brands.

### Key Object: `NovaDB`
```javascript
const NovaDB = {
  _cache: {},
  _collection: 'site_data',  // Single Firestore collection, keyed by doc ID
  
  async init() { /* Loads all docs from Firestore into cache */ },
  get(docId) { /* Sync read from cache */ },
  async set(docId, data) { /* Updates cache + writes to Firestore */ },
  
  // Data accessors:
  getOrders() / saveOrders(array),
  getUsers() / saveUsers(array),
  getAdminEmails() / saveAdminEmails(array),
  getStaffProfiles() / saveStaffProfiles(obj),
  getAuditLogs() / saveAuditLogs(array),
  getBrands() / saveBrands(array),
  getTrash() / saveTrash(array),
  getInstagramPosts() / saveInstagramPosts(array)
};
```

### Firestore Document IDs
All data lives in a single collection `site_data` with these document IDs:
- `orders` → `{ items: [...] }`
- `users` → `{ items: [...] }`
- `admin_emails` → `{ emails: [...] }`
- `staff_profiles` → `{ data: {...} }`
- `audit_logs` → `{ entries: [...] }`
- `brands` → `{ items: [...] }`
- `trash` → `{ items: [...] }`
- `instagram_posts` → `{ items: [...] }`

---

## 5. Admin Panel (`admin.js` + HTML in `index.html`)

### Architecture
The admin panel is a section within `index.html` at `#view-admin`. It has:
1. **Login Gateway** — Email/password authentication via Firebase Auth
2. **Dashboard** — Full WooCommerce-style control panel

### Admin Layout Structure
```
admin-view
├── admin-login-wrapper (login form)
└── admin-dashboard-wrapper (main dashboard)
    ├── admin-header (logo, role badge, user name, logout, "View Front End" link)
    └── admin-layout (flex)
        ├── admin-sidebar (navigation tabs)
        │   ├── Orders Manager
        │   ├── Inventory Tracker
        │   ├── Settings (admin access management)
        │   ├── Clients
        │   ├── Activity Logs
        │   └── Blog Manager
        └── admin-content (tab panels)
            ├── admin-sec-orders (A)
            ├── admin-sec-inventory (B)
            ├── admin-sec-developer (C)
            ├── admin-sec-clients (D)
            ├── admin-sec-logs (E)
            └── admin-sec-blog (F)
```

### Tab A: Orders Manager
- **Stats Grid** (4 cards): Total Revenue, Orders Placed, Avg Order Value, Total Stock Items
- **Sales Chart**: Bar chart showing sales by top 5 brands (rendered dynamically)
- **Orders Table**: Columns = Order ID, Date, Customer (name + email), Items, Total, Status, Actions
  - Status badges: `pending`, `processing`, `completed`, `failed`
  - Actions: status dropdown (change status) + delete button
  - Each row rendered via `WooCommerceAdmin.renderOrdersTable()`

### Tab B: Inventory Tracker (3 Sub-Tabs)
**Sub-tab: Products**
- Header with "Import CSV" and "Add New Product" buttons
- Search input for filtering by name/brand
- Bulk actions (Move to Trash)
- Inventory table: Checkbox, Image, Product Name (+ brand/SKU), Price, Stock Qty, Availability badge, Actions (Update, Star/Featured, Delete)
- Clicking product name/image opens the **Product Editor** (WordPress-style full-screen editor)

**Sub-tab: Brands**
- Add brand form (input + button)
- Brands displayed as a grid of cards with delete option

**Sub-tab: Trash**
- Recently deleted products with restore/permanent delete
- Bulk actions (Restore All, Delete All)

### Tab C: Settings (Admin Access Management)
- Grant admin access by email
- List of admin emails with revoke option
- Only super admin can manage

### Tab D: Clients
- Table of registered users: #, Name, Email, Registered date, Actions
- Count badge showing total clients

### Tab E: Activity Logs
- Audit log table: Timestamp, Operator (email), Recorded Action
- Clear Logs button
- Auto-logs admin logins, product edits, order changes, etc.

### Tab F: Blog Manager
- Full blog post form with multilingual fields (EN, AM, RU)
- Fields: Title, Slug, Category, Read Time, Status, Featured Image, In-Article Image, Excerpt, Paragraphs 1-3, Pull Quote, Author, Tags, Featured checkbox
- Blog posts table: Title, Category, Status, Date, Actions (Edit, Delete)

### Product Editor (WordPress-Style Full Page)
When clicking "Add New Product" or a product row, a full-page editor opens:
```
product-editor-page
├── pe-topbar (Back button, title, Publish button)
└── pe-content (flex)
    ├── pe-main
    │   ├── Product Name input + Slug
    │   └── pe-metabox "Product Data"
    │       ├── Tab: General (Brand, SKU, Description, Pricing/Sizes)
    │       ├── Tab: Inventory (Stock qty, status)
    │       └── Tab: Details (Material, Stone, Origin — replaces "Fragrance Notes")
    └── pe-sidebar
        ├── Product Image (upload/URL + gallery)
        ├── Classification (Category, Stone type, Material)
        ├── Tags (Handmade, One-of-a-Kind, Gift, etc.)
        └── Product Stats (Rating, Reviews, Featured checkbox)
```

### Key Admin Object: `WooCommerceAdmin`
```javascript
const WooCommerceAdmin = {
  orders: [],  // Loaded from Firestore on init
  
  async saveOrdersToStorage() { /* Saves to Firestore via NovaDB */ },
  getMetrics(productsList) { /* Returns {revenue, orderCount, aov, stockCount} */ },
  addOrder(customerData, cartItems, total) { /* Creates new order object */ },
  updateOrderStatus(orderId, newStatus) { /* Updates status */ },
  renderDashboard(productsList) { /* Renders stats, chart, orders table */ },
  renderOrdersTable() { /* Renders orders tbody */ },
  renderInventoryTable(productsList, onUpdateCallback) { /* Renders inventory tbody */ }
};
```

### Order Object Structure
```javascript
{
  id: "NOVA-1001",
  date: "2026-08-04 16:00",
  customer: "Anahit Sargsyan",
  email: "anahit@example.com",
  total: 340,
  status: "pending",  // pending | processing | completed | failed
  items: [
    { name: "Obsidian Ring", qty: 1, size: "7" }
  ]
}
```

---

## 6. Frontend Storefront Pages

### Home Page Sections (in order)
1. **Announcement Bar** — Promo text + links (shipping, currency)
2. **Header/Nav** — Logo, navigation links, search, cart count, user menu
3. **Hero Section** — Large heading, description, CTA buttons
4. **Shop by Category** — Grid of category cards (Rings, Necklaces, Bracelets, Earrings) with images and counts
5. **Available Now — Product Grid** — Featured products grid with "View All" link
6. **About Section** — Brand story with key figures (year founded, quarry sites, "1 of 1" unique)
7. **Trust Bar** — 4 trust badges (Free shipping, Certificate of origin, 30-day returns, Free resizing)
8. **Shop by Stone** — Horizontal stone rows with color dots, descriptions, counts
9. **The Maker** — Craftsperson profile with photo and story
10. **Field Notes + Testimonials** — Split grid with blog-like notes and customer quotes
11. **Newsletter CTA** — Email signup form
12. **Footer** — Brand info, shop links, house links, service links, legal

### Shop Page
- **Breadcrumbs** (Home / All Jewelry)
- **Shop Intro** (H1, description)
- **Mobile Filter Toggle** button
- **Shop Layout** (sidebar + main):
  - **Sidebar Filters:**
    - Search box
    - Category chips (Rings, Necklaces, Bracelets, Earrings)
    - Stone chips (with color dots: Obsidian, Garnet, Turquoise, Jasper, Onyx, Agate)
    - Material filter (Sterling Silver, Gold, Rose Gold)
    - Price range (min/max inputs)
    - Clear All button
  - **Results Area:**
    - Results count + active filter chips
    - Sort dropdown (Newest, Price Low→High, Price High→Low, Name A-Z)
    - Products grid (responsive: 2 cols mobile, 3-4 cols desktop)
    - Empty state with "clear filters" button

### Product Card Component
```html
<a href="/product?id=..." class="nv-card">
  <figure class="nv-card__figure">
    <img class="nv-card__img" src="..." alt="..." loading="lazy">
    <!-- Optional: "SOLD" overlay badge for sold-out 1-of-1 items -->
  </figure>
  <div class="nv-card__body">
    <div class="nv-card__brand">BRAND NAME</div>
    <div class="nv-card__name">Product Name<small>Stone · Material</small></div>
    <div class="nv-card__rule"></div>
    <div class="nv-card__foot">
      <span class="nv-card__price">$340</span>
      <button class="product-btn" data-add="0">Add to Cart</button>
    </div>
  </div>
</a>
```

### Product Detail Page (`product.html`)
Standalone HTML page (for SEO). Loads product by `?id=` query param.
- Product image gallery (main + thumbnails)
- Product info: brand, name, material, stone, description
- Size selector
- Add to cart button
- FAQs accordion
- Related products grid

### Contact Page
- Two-column layout
- Left: Topic selection chips, contact form (Name, Email, stone preference, budget, message)
- Right: Studio image, address card, business hours

### Checkout Flow
- Cart summary with item list
- Customer info form (first name, last name, email, phone, address)
- Order total calculation
- Submit creates order via `WooCommerceAdmin.addOrder()`

---

## 7. CSS Design System

### Design Tokens (`:root`)
```css
:root {
  --green: #0B3B30;        /* Primary dark (header backgrounds, accents) */
  --green-2: #123F35;      /* Secondary green */
  --ink: #1F1D1A;          /* Body text, dark backgrounds */
  --cream: #FFFFFF;        /* Light backgrounds */
  --cream-2: #FFFFFF;      /* Alternate light */
  --cream-3: #F7F7F7;      /* Subtle gray background */
  --gold: #C9A227;         /* Accent color (CTAs, highlights, links on hover) */
  --font: 'Noto Sans Armenian', 'Instrument Sans', sans-serif;
  --font-serif: 'Noto Serif Armenian', Georgia, serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, monospace;
  --gutter: 20px;          /* Responsive padding (20→32→44px) */
  --max: 1720px;           /* Max content width */
}
```

### Key CSS Classes
- `.btn-primary` — Gold/accent background CTA button
- `.btn-secondary` — Outlined button
- `.btn-underline` / `.btn-underline-dark` — Text-only with underline
- `.nv-card` — Product card component
- `.admin-card` — Admin panel card container
- `.admin-table` — Admin data table
- `.admin-input` — Form inputs in admin
- `.admin-status-badge` — Status pill badges (`.badge-pending`, `.badge-processing`, etc.)
- `.stat-card` — Dashboard metric card
- `.filter-chip` — Filter toggle button
- `.filter-chip.active` — Active filter state

### Responsive Breakpoints
- Mobile first: base styles
- `768px` — Tablet
- `1024px` — Small desktop
- `1200px` — Large desktop

### Animation Classes
- `.fade-in` — Scroll-reveal fade-in animation
- Smooth transitions on hover states (0.25s ease)
- Mobile menu slide animation

---

## 8. Internationalization (i18n)

### Language System
Three languages: English (`en`), Armenian (`am`), Russian (`ru`).

### Implementation
- All translatable elements use `data-trans="key_name"` attribute
- A global `TRANSLATIONS` object maps keys to translations per language
- `AppState.language` tracks current language
- Language switcher in the UI
- Product translations stored separately in Sanity per product

### Product Translations
```javascript
// In Sanity, each product has:
translations: {
  am: { name: "...", tagline: "...", description: "..." },
  ru: { name: "...", tagline: "...", description: "..." }
}
```

---

## 9. Deployment & Build

### Vercel Configuration (`vercel.json`)
```json
{
  "rewrites": [
    { "source": "/product", "destination": "/product.html" },
    { "source": "/(shop|about|contact|checkout|admin|...)", "destination": "/index.html" },
    { "source": "/(catch-all-non-assets)", "destination": "/index.html" }
  ],
  "headers": [
    { "source": "/(.*).html", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] },
    { "source": "/(.*).min.css", "headers": [{ "key": "Cache-Control", "value": "immutable, 1yr" }] },
    { "source": "/(.*).min.js", "headers": [{ "key": "Cache-Control", "value": "immutable, 1yr" }] },
    { "source": "/assets/(.*)", "headers": [{ "key": "Cache-Control", "value": "immutable, 1yr" }] }
  ]
}
```

### Build Process (`node build.js`)
- Minifies `styles.css` → `styles.min.css`
- Minifies `app.js` → `app.min.js` (uses `terser`)
- Production HTML references `.min` versions

### SEO Essentials
- Proper `<title>`, `<meta description>`, `<meta keywords>`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Card tags
- Canonical URL
- JSON-LD structured data (Organization, Product)
- `robots.txt`, `sitemap.xml`
- Semantic HTML with single `<h1>` per page
- `loading="lazy"` on images
- Preconnect hints for external resources

---

## 10. Key JavaScript Patterns

### Global App State
```javascript
window.AppState = {
  products: [],           // All products (loaded from Sanity)
  language: 'en',         // Current UI language
  cart: [],               // Cart items [{product, quantity, size}]
  wishlist: [],           // Wishlist product IDs
  user: null,             // Current logged-in user
  isAdmin: false,         // Whether current user has admin access
  currentRoute: 'home'    // Current SPA route
};
```

### Initialization Flow
```javascript
// DOMContentLoaded:
1. NovaDB.init()            // Load Firebase data (orders, users, admin emails)
2. NovaSanity.init()        // Load products from Sanity CMS
3. AppState.products = NovaSanity.getProducts()
4. WooCommerceAdmin.orders = NovaDB.getOrders() || []
5. Render current route
6. Init event listeners (cart, filters, search, etc.)
```

### Admin Authentication Flow
```javascript
1. User navigates to /admin
2. Show admin-login-wrapper (email + password form)
3. On submit: Firebase Auth signIn(email, password)
4. Check email against NovaDB.getAdminEmails()
5. If admin → show admin-dashboard-wrapper, hide login
6. Load staff profile, render dashboard
7. Log "Admin login" to audit logs
```

### Cart & Wishlist System
```javascript
// LocalStorage Persistence Keys
const CART_STORAGE_KEY = 'urartoo_cart_v1';
const WISHLIST_STORAGE_KEY = 'urartoo_wishlist_v1';

// Cart management functions
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty = 1, size = 'standard') {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId && item.size === size);
  if (existingIndex > -1) {
    cart[existingIndex].qty += qty;
  } else {
    cart.push({ id: productId, qty: qty, size: size, addedAt: new Date().toISOString() });
  }
  saveCart(cart);
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = totalItems;
  });
}

// Wishlist toggle function
function toggleWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY)) || [];
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(productId);
  }
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  return wishlist.includes(productId);
}
```

### Shop Filtering & Search System
```javascript
const filterState = {
  selectedCategory: 'all',  // 'all' | 'Մատանիներ' | 'Վզնոցներ' | etc.
  selectedStone: 'all',     // 'all' | 'Նռնաքար' | 'Օբսիդիան' | etc.
  searchQuery: '',
  priceMin: 100,
  priceMax: 600,
  sort: 'new'              // 'new' | 'low' | 'high' | 'name'
};

function filterAndSortProducts(products) {
  return products.filter(p => {
    if (filterState.selectedCategory !== 'all' && p.cat !== filterState.selectedCategory) return false;
    if (filterState.selectedStone !== 'all' && p.stone !== filterState.selectedStone) return false;
    if (p.price < filterState.priceMin || p.price > filterState.priceMax) return false;
    if (filterState.searchQuery) {
      const q = filterState.searchQuery.toLowerCase();
      const match = p.name.toLowerCase().includes(q) ||
                    p.stone.toLowerCase().includes(q) ||
                    (p.region && p.region.toLowerCase().includes(q)) ||
                    p.cat.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (filterState.sort === 'low') return a.price - b.price;
    if (filterState.sort === 'high') return b.price - a.price;
    if (filterState.sort === 'name') return a.name.localeCompare(b.name, 'hy');
    return (b.id - a.id); // 'new' default
  });
}
```

---

## 11. What NOT to Include

**DO NOT** include any of these fragrance-specific concepts:
- Scent families (woody, floral, citrus, amber, aromatic)
- Fragrance notes (top, heart, base)
- Ingredients / INCI lists
- Bottle sizes (50ml, 100ml, 200ml)
- Perfume-specific vibes (romantic evening, mysterious bold, etc.)
- Scent-specific filters or classifications
- Any reference to "fragrance", "perfume", "eau de", "cologne"

**REPLACE** with jewelry equivalents:
- Scent families → Stone types / Materials
- Notes → Stone origin / Craftsmanship details
- Bottle sizes → Ring sizes / Chain lengths / Bracelet sizes
- Ingredients → Materials composition (925 silver, 14K gold, etc.)

---

## 12. Quick Reference: Admin Panel HTML IDs

### Login
- `#admin-login-wrapper` — Login card container
- `#admin-login-form` — Login form
- `#admin-email-input` — Email input
- `#admin-pass-input` — Password input

### Dashboard
- `#admin-dashboard-wrapper` — Dashboard container
- `#admin-user-role-badge` — Role badge (Super Admin / Shop Manager)
- `#admin-user-profile-name` — Logged-in user display name

### Sidebar Navigation
- `[data-admin-tab="orders"]` — Orders tab trigger
- `[data-admin-tab="inventory"]` — Inventory tab trigger
- `[data-admin-tab="developer"]` — Settings tab trigger
- `[data-admin-tab="clients"]` — Clients tab trigger
- `[data-admin-tab="logs"]` — Logs tab trigger
- `[data-admin-tab="blog"]` — Blog tab trigger

### Orders Tab
- `#admin-revenue-val` — Revenue display
- `#admin-orders-val` — Order count display
- `#admin-aov-val` — AOV display
- `#admin-stock-val` — Stock count display
- `#admin-brand-chart` — Sales chart container
- `#admin-orders-tbody` — Orders table body

### Inventory Tab
- `#admin-inventory-tbody` — Inventory table body
- `#admin-inventory-search` — Search input
- `#bulk-action-select` — Bulk actions dropdown
- `#admin-brands-list` — Brands list container
- `#admin-trash-list` — Trash list container

### Settings Tab
- `#grant-admin-email` — Grant access email input
- `#admin-access-list` — Admin emails list

### Clients Tab
- `#admin-clients-tbody` — Clients table body
- `#admin-clients-count` — Clients count display

### Logs Tab
- `#admin-audit-logs-tbody` — Audit logs table body

### Blog Tab
- `#blog-admin-form` — Blog post form
- `#admin-blog-tbody` — Blog posts table body

### Product Editor
- `#product-editor-page` — Full-page editor container
- `#pe-product-name` — Product name input
- `#pe-brand` — Brand select
- `#pe-sku` — SKU input
- `#pe-description` — Description textarea
- `#pe-stock` — Stock quantity input
- `#pe-image-file` — Image file upload
- `#pe-image-url` — Image URL input
- `#pe-gallery` — Gallery grid container

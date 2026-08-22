/* ===================================================================
   URARTOO — Sanity CMS Integration Script (NovaSanity)
   Project ID: g1vi85kp | Dataset: production
   Language: Strictly Armenian (hy)
   =================================================================== */

(function (window) {
  'use strict';

  const SANITY_CONFIG = {
    projectId: 'g1vi85kp',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud'
  };

  const BASE_URL = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data`;

  // Default initial Armenian seed items (empty — no mock products)
  const INITIAL_SEED_PRODUCTS = [];

  const INITIAL_SEED_JOURNAL = [
    {
      id: "post-1",
      topic: "Քարահավաք",
      date: "Սեպտեմբեր 2025",
      readTime: "6 րոպե",
      title: "Երեք օր հրաբխի վրա՝ մեկ լավ ապակու կտորի համար",
      excerpt: "Գուտանասարի օբսիդիանը կոտրվում է տասից ինն անգամ սխալ։ Ահա թե ինչ տեսք ունի տասներորդը և ինչ արժեցավ այնտեղ հասնելը։",
      content: "Գուտանասարի լանջերին օբսիդիանի հսկայական շերտեր են։ Սակայն զարդի համար պիտանի է միայն այն կտորը, որը ներսում չունի ճաքեր...",
      featured: true
    },
    {
      id: "post-2",
      topic: "Գեմոլոգիա",
      date: "Հուլիս 2025",
      readTime: "4 րոպե",
      title: "Ինչու է գետի նռնաքարը հղկվում այլ կերպ, քան հանքինը",
      excerpt: "Գետի ջուրը դարերի ընթացքում արդեն իսկ հղկել է քարի թույլ կողմերը։ Մեզ մնում է գտնել երակը։",
      content: "Վայոց Ձորի գետերում հայտնաբերված նռնաքարերը բնական ճանապարհով անցել են առաջնային հղկման փուլը...",
      featured: false
    },
    {
      id: "post-3",
      topic: "Աշխատանոց",
      date: "Մայիս 2025",
      readTime: "5 րոպե",
      title: "Անհամաչափ քարի տեղադրումը արծաթում",
      excerpt: "Երբ քարը բնական ձև ունի, շրջանակը պետք է կրկնի նրա հետագիծը, ոչ թե ստիպի դառնալ երկրաչափական։",
      content: "Ամեն մի քար ունի իր անհատական ձևը...",
      featured: false
    },
    {
      id: "post-4",
      topic: "Ստուդիա",
      date: "Ապրիլ 2025",
      readTime: "3 րոպե",
      title: "925 արծաթի մշակումը և հնեցումը",
      excerpt: "Ինչպես է օքսիդացումը ընդգծում հայկական քարերի խորությունն ու բնական փայլը։",
      content: "Արծաթի օքսիդացումը թույլ է տալիս ստանալ խորը ստվերներ...",
      featured: false
    },
    {
      id: "post-5",
      topic: "Քարահավաք",
      date: "Մարտ 2025",
      readTime: "7 րոպե",
      title: "Սյունիքի հին պղնձի հանքերի փիրուզը",
      excerpt: "Գարնանը, երբ ձյունը հալվում է, Սյունիքի հին ակոսներում հայտնվում են կապույտ երակներ։",
      content: "Սյունիքի լեռնային ճանապարհներին...",
      featured: false
    },
    {
      id: "post-6",
      topic: "Գեմոլոգիա",
      date: "Փետրվար 2025",
      readTime: "5 րոպե",
      title: "Արենիի հասպիսի երկաթյա շերտերը",
      excerpt: "Կարմիր և դեղնավուն շերտերով հասպիսը Հայաստանի ամենատաք քարերից մեկն է։",
      content: "Արենիի հասպիսը հայտնի է իր տաք երանգներով...",
      featured: false
    }
  ];

  const NovaSanity = {
    _products: [],
    _stones: [],
    _journalPosts: [],
    _ready: false,

    /**
     * Executes GROQ query against Sanity HTTP API
     */
    async query(groq) {
      const encodedQuery = encodeURIComponent(groq);
      const url = `${BASE_URL}/query/${SANITY_CONFIG.dataset}?query=${encodedQuery}`;
      try {
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${SANITY_CONFIG.token}`
          }
        });
        if (!res.ok) throw new Error(`Sanity HTTP error: ${res.status}`);
        const data = await res.json();
        return data.result || [];
      } catch (err) {
        console.warn('Sanity Query Error:', err);
        return null;
      }
    },

    /**
     * Executes Mutations (Create / Delete / Update) against Sanity HTTP API
     */
    async mutate(mutations) {
      const url = `${BASE_URL}/mutate/${SANITY_CONFIG.dataset}`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SANITY_CONFIG.token}`
          },
          body: JSON.stringify({ mutations })
        });
        if (!res.ok) throw new Error(`Sanity Mutation Error: ${res.status}`);
        return await res.json();
      } catch (err) {
        console.error('Sanity Mutation Failed:', err);
        throw err;
      }
    },

    /**
     * Uploads image binary/file to Sanity Assets API
     */
    async uploadImage(fileOrBlob) {
      const url = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/assets/images/${SANITY_CONFIG.dataset}`;
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': fileOrBlob.type || 'image/jpeg',
            'Authorization': `Bearer ${SANITY_CONFIG.token}`
          },
          body: fileOrBlob
        });
        if (!res.ok) throw new Error(`Sanity Asset Upload Failed: ${res.status}`);
        const data = await res.json();
        return data.document.url;
      } catch (err) {
        console.error('Sanity Image Upload Error:', err);
        return null;
      }
    },

    /**
     * Main Initialization: Fetches products & content from Sanity.
     * STRICT SINGLE-SOURCE-OF-TRUTH: If Sanity fetch succeeds, Sanity's database
     * is the ONLY dataset used. Deletions in Sanity persist permanently.
     */
    async init() {
      // Load local storage cached products first (for instant render & local persistence)
      try {
        const stored = JSON.parse(localStorage.getItem('urartoo_local_products_v1'));
        if (Array.isArray(stored) && stored.length > 0) {
          this._products = stored;
        }
      } catch (e) {}

      // GROQ query for products
      const productsGroq = `*[_type == "product"]{
        _id,
        id,
        name,
        brand,
        sku,
        category,
        stone,
        stoneOrigin,
        material,
        price,
        stock,
        sold,
        featured,
        tagline,
        description,
        sizes,
        tags,
        "image": coalesce(image, mainImage.asset->url, imageUrl),
        images
      }`;

      // GROQ query for journal posts
      const journalGroq = `*[_type == "journalPost"]{
        _id,
        id,
        topic,
        date,
        readTime,
        title,
        excerpt,
        content,
        featured
      }`;

      // GROQ query for user accounts
      const usersGroq = `*[_type == "user"]{
        _id,
        id,
        name,
        email,
        phone,
        password,
        joined,
        isAdmin,
        role,
        address,
        orders
      }`;

      try {
        const [sanityProds, sanityJournal, sanityUsers] = await Promise.all([
          this.query(productsGroq),
          this.query(journalGroq),
          this.query(usersGroq)
        ]);

        if (sanityUsers && Array.isArray(sanityUsers)) {
          this._syncCloudUsersToLocal(sanityUsers);
        }

        if (sanityProds !== null && Array.isArray(sanityProds)) {
          const transformedCloud = this._transformSanityProducts(sanityProds);
          
          // Merge local localStorage products with cloud products so nothing is lost
          const localProds = this._products || [];
          const mergedMap = new Map();
          
          // Add local products first
          localProds.forEach(p => {
            const pKey = String(p._sanityId || p.id);
            if (pKey) mergedMap.set(pKey, p);
          });
          
          // Merge/overwrite with cloud products
          transformedCloud.forEach(p => {
            const pKey = String(p._sanityId || p.id);
            if (pKey) mergedMap.set(pKey, p);
          });

          this._products = Array.from(mergedMap.values());

          if (sanityJournal && Array.isArray(sanityJournal) && sanityJournal.length > 0) {
            this._journalPosts = sanityJournal;
          } else {
            this._journalPosts = INITIAL_SEED_JOURNAL;
          }
        }
      } catch (err) {
        console.warn('Sanity query failed:', err);
      }

      if (!this._products) this._products = [];
      this._ready = true;
      this.notifyUpdate();
      return this._products;
    },

    notifyUpdate() {
      try {
        localStorage.setItem('urartoo_local_products_v1', JSON.stringify(this._products));
      } catch (e) {}
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('urartoo:products-updated', { detail: this._products }));
      }
    },

    _transformSanityProducts(docs) {
      let maxSequential = 0;
      // First pass: find highest existing UR-XXX
      docs.forEach(doc => {
        if (doc.sku) {
          const m = String(doc.sku).match(/^UR-(\d+)$/);
          if (m) {
            const n = parseInt(m[1], 10);
            if (n > maxSequential) maxSequential = n;
          }
        }
      });

      return docs.map((doc, idx) => {
        const mainImg = doc.image || doc.img || 'Images/bracelet.webp';
        const imgList = (doc.images && doc.images.length > 0) ? doc.images : [mainImg];
        
        let resolvedSku = doc.sku;
        if (!resolvedSku || resolvedSku === 'UR-100' || !resolvedSku.startsWith('UR-')) {
          maxSequential++;
          resolvedSku = 'UR-' + String(maxSequential).padStart(3, '0');
        }

        return {
          id: doc.id ? (isNaN(doc.id) ? doc.id : Number(doc.id)) : doc._id,
          _sanityId: doc._id,
          name: doc.name || '',
          brand: doc.brand || 'Urartoo',
          sku: resolvedSku,
          cat: doc.category || 'Մատանիներ',
          category: doc.category || 'Մատանիներ',
          stone: doc.stone || 'Նռնաքար',
          region: doc.stoneOrigin || 'Վայոց Ձոր',
          stoneOrigin: doc.stoneOrigin || 'Վայոց Ձոր',
          material: doc.material || '925 արծաթ',
          price: doc.price || 0,
          img: mainImg,
          image: mainImg,
          images: imgList,
          gallery: imgList,
          sold: Boolean(doc.sold),
          stock: doc.stock !== undefined ? doc.stock : 1,
          featured: Boolean(doc.featured),
          desc: doc.description || doc.tagline || '',
          tagline: doc.tagline || '',
          description: doc.description || '',
          sizes: doc.sizes || [],
          tags: doc.tags || []
        };
      });
    },

    /**
     * Synchronous getter for products array (Single source of truth)
     */
    getProducts() {
      return this._products || [];
    },

    /**
     * Synchronous getter for journal posts array
     */
    getJournalPosts() {
      return this._journalPosts || [];
    },

    /**
     * Initial database seeder
     */
    async seedInitialData() {
      return true;
    },

    /**
     * Delete product mutation (Permanently deletes document in Sanity & local)
     */
    async deleteProduct(sanityDocId) {
      if (!Array.isArray(this._products)) this._products = [];
      this._products = this._products.filter(p => String(p._sanityId) !== String(sanityDocId) && String(p.id) !== String(sanityDocId));
      this.notifyUpdate();
      try {
        await this.mutate([{ delete: { id: String(sanityDocId) } }]);
        return true;
      } catch (err) {
        console.warn('Deleted locally. Sanity delete failed:', err);
        return false;
      }
    },

    /**
     * Create or update product in Sanity & local state
     */
    async saveProduct(productData) {
      const docId = productData._sanityId || productData.id || `product-${Date.now()}`;
      const doc = {
        _id: String(docId),
        _type: 'product',
        id: String(productData.id || docId),
        name: productData.name,
        brand: productData.brand || 'Urartoo',
        sku: productData.sku || 'UR-001',
        category: productData.cat || productData.category || 'Մատանիներ',
        stone: productData.stone || 'Նռնաքար',
        stoneOrigin: productData.region || productData.stoneOrigin || 'Վայոց Ձոր',
        material: productData.material || '925 արծաթ',
        price: Number(productData.price) || 0,
        image: productData.img || productData.image || 'Images/bracelet.webp',
        images: productData.images || [productData.img || productData.image].filter(Boolean),
        stock: Number(productData.stock) || 1,
        sold: Boolean(productData.sold),
        featured: Boolean(productData.featured),
        tagline: productData.tagline || '',
        description: productData.desc || productData.description || '',
        sizes: productData.sizes || [],
        tags: productData.tags || []
      };

      const transformed = this._transformSanityProducts([doc])[0];
      if (!Array.isArray(this._products)) this._products = [];
      const existingIdx = this._products.findIndex(p => String(p._sanityId) === String(doc._id) || String(p.id) === String(doc.id));
      if (existingIdx >= 0) {
        this._products[existingIdx] = transformed;
      } else {
        this._products.unshift(transformed);
      }
      this._ready = true;
      this.notifyUpdate();

      try {
        await this.mutate([{ createOrReplace: doc }]);
        return true;
      } catch (err) {
        console.warn('Saved locally. Sanity cloud upload failed:', err);
        return false;
      }
    },

    /**
     * GROQ Query & Sync Cloud User Accounts from Sanity
     */
    async getUsers() {
      const usersGroq = `*[_type == "user"]{
        _id,
        id,
        name,
        email,
        phone,
        password,
        joined,
        isAdmin,
        role,
        address,
        orders
      }`;
      try {
        const cloudUsers = await this.query(usersGroq);
        if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
          this._syncCloudUsersToLocal(cloudUsers);
          return cloudUsers;
        }
      } catch (err) {
        console.warn('Sanity getUsers error:', err);
      }
      return [];
    },

    /**
     * Merges Sanity Cloud user accounts into urartoo_users_db_v1 in localStorage
     */
    _syncCloudUsersToLocal(cloudUsers) {
      if (!Array.isArray(cloudUsers)) return;
      let localUsers = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('urartoo_users_db_v1')) || [];
      } catch (e) { localUsers = []; }

      let updated = false;
      cloudUsers.forEach(cu => {
        if (!cu || !cu.email) return;
        const lowerEmail = String(cu.email).trim().toLowerCase();
        const idx = localUsers.findIndex(u => u && u.email && u.email.trim().toLowerCase() === lowerEmail);

        const userObj = {
          id: cu.id || cu._id || `usr_${Date.now()}`,
          name: cu.name || lowerEmail,
          email: lowerEmail,
          phone: cu.phone || '',
          password: String(cu.password || ''),
          joined: cu.joined || String(new Date().getFullYear()),
          isAdmin: Boolean(cu.isAdmin),
          role: cu.role || (cu.isAdmin ? 'Super Admin' : 'Customer'),
          address: cu.address || { city: '', street: '', zip: '' },
          orders: cu.orders || []
        };

        if (idx >= 0) {
          if (!localUsers[idx].password && userObj.password) {
            localUsers[idx].password = userObj.password;
            updated = true;
          }
          if (userObj.isAdmin) {
            localUsers[idx].isAdmin = true;
            localUsers[idx].role = 'Super Admin';
            updated = true;
          }
        } else {
          localUsers.push(userObj);
          updated = true;
        }
      });

      if (updated) {
        try {
          localStorage.setItem('urartoo_users_db_v1', JSON.stringify(localUsers));
        } catch (e) {}
      }
    },

    /**
     * Creates or updates a user document in Sanity Cloud Database
     */
    async saveUser(userData) {
      if (!userData || !userData.email) return false;
      const lowerEmail = String(userData.email).trim().toLowerCase();
      const docId = `user-${lowerEmail.replace(/[^a-z0-9]/gi, '_')}`;

      const doc = {
        _id: docId,
        _type: 'user',
        id: userData.id || docId,
        name: userData.name || lowerEmail,
        email: lowerEmail,
        phone: userData.phone || '',
        password: String(userData.password || ''),
        joined: String(userData.joined || new Date().getFullYear()),
        isAdmin: Boolean(userData.isAdmin),
        role: userData.role || (userData.isAdmin ? 'Super Admin' : 'Customer'),
        address: userData.address || { city: '', street: '', zip: '' },
        orders: userData.orders || []
      };

      try {
        await this.mutate([{ createOrReplace: doc }]);
        return true;
      } catch (err) {
        console.warn('Could not save user to Sanity Cloud:', err);
        return false;
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.NovaSanity = NovaSanity;

    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => NovaSanity.init());
      } else {
        NovaSanity.init();
      }
    }
  }

})(typeof window !== 'undefined' ? window : global);

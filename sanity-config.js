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
      if (this._ready) return this._products;

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
        featured,
        "image": featuredImage.asset->url
      }`;

      const [sanityProds, sanityJournal] = await Promise.all([
        this.query(productsGroq),
        this.query(journalGroq)
      ]);

      // If Sanity connection works
        if (sanityProds.length === 0) {
          this._products = [];
        } else {
          this._products = this._transformSanityProducts(sanityProds);
        }

        if (sanityJournal && sanityJournal.length > 0) {
          this._journalPosts = sanityJournal;
        } else {
          this._journalPosts = INITIAL_SEED_JOURNAL;
        }

        this._ready = true;
        this.notifyUpdate();
        return this._products;
      }

      // Offline / API error fallback only
      console.warn('Unable to connect to Sanity. Using local storage catalog fallback.');
      try {
        const stored = JSON.parse(localStorage.getItem('urartoo_local_products_v1'));
        if (Array.isArray(stored)) {
          this._products = stored;
        } else {
          this._products = [];
        }
      } catch (e) {
        this._products = [];
      }
      this._journalPosts = INITIAL_SEED_JOURNAL;
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
      return docs.map(doc => {
        const mainImg = doc.image || doc.img || 'Images/bracelet.webp';
        const imgList = (doc.images && doc.images.length > 0) ? doc.images : [mainImg];
        return {
          id: doc.id ? (isNaN(doc.id) ? doc.id : Number(doc.id)) : doc._id,
          _sanityId: doc._id,
          name: doc.name || '',
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
      return this._products;
    },

    /**
     * Synchronous getter for journal posts array
     */
    getJournalPosts() {
      return this._journalPosts;
    },

    /**
     * Initial database seeder (Posts default Armenian catalog documents into Sanity)
     */
    async seedInitialData() {
      const productMutations = INITIAL_SEED_PRODUCTS.map(p => ({
        createOrReplace: {
          _id: `product-${p.id}`,
          _type: 'product',
          id: p.id,
          name: p.name,
          brand: p.brand,
          sku: p.sku,
          category: p.category,
          stone: p.stone,
          stoneOrigin: p.stoneOrigin,
          material: p.material,
          price: p.price,
          stock: p.stock,
          sold: p.sold,
          featured: p.featured,
          tagline: p.tagline,
          description: p.description,
          sizes: p.sizes,
          tags: p.tags
        }
      }));

      const journalMutations = INITIAL_SEED_JOURNAL.map(j => ({
        createOrReplace: {
          _id: `journal-${j.id}`,
          _type: 'journalPost',
          id: j.id,
          topic: j.topic,
          date: j.date,
          readTime: j.readTime,
          title: j.title,
          excerpt: j.excerpt,
          content: j.content,
          featured: j.featured
        }
      }));

      try {
        await this.mutate([...productMutations, ...journalMutations]);
        console.log('Successfully seeded initial Armenian products & journal entries to Sanity!');
      } catch (e) {
        console.error('Initial seed failed:', e);
      }
    },

    /**
     * Delete product mutation (Permanently deletes document in Sanity)
     */
    async deleteProduct(sanityDocId) {
      this._products = this._products.filter(p => p._sanityId !== sanityDocId && p.id !== sanityDocId && String(p.id) !== String(sanityDocId));
      this.notifyUpdate();
      try {
        await this.mutate([{ delete: { id: sanityDocId } }]);
        return true;
      } catch (err) {
        console.error('Failed to delete product from Sanity:', err);
        return false;
      }
    },

    /**
     * Create or update product in Sanity
     */
    async saveProduct(productData) {
      const docId = productData._sanityId || productData.id || `product-${Date.now()}`;
      const doc = {
        _id: String(docId),
        _type: 'product',
        id: String(productData.id || docId),
        name: productData.name,
        brand: productData.brand || 'Urartoo',
        sku: productData.sku || '',
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
      const existingIdx = this._products.findIndex(p => p._sanityId === doc._id || String(p.id) === String(doc.id));
      if (existingIdx >= 0) {
        this._products[existingIdx] = transformed;
      } else {
        this._products.unshift(transformed);
      }
      this.notifyUpdate();

      try {
        await this.mutate([{ createOrReplace: doc }]);
        return true;
      } catch (err) {
        console.error('Failed to save product to Sanity:', err);
        return false;
      }
    }
  };

  window.NovaSanity = NovaSanity;

  // Auto-init on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => NovaSanity.init());
  } else {
    NovaSanity.init();
  }

})(window);

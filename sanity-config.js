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

  // Default initial Armenian seed items (used strictly for first-time database seeding if Sanity is empty)
  const INITIAL_SEED_PRODUCTS = [
    {
      id: "ring-1",
      name: "Վայոց Ձորի նռնաքարով մատանի",
      brand: "Urartoo",
      sku: "UR-RING-GAR-01",
      category: "Մատանիներ",
      stone: "Նռնաքար",
      stoneOrigin: "Վայոց Ձոր",
      material: "925 արծաթ",
      price: 340,
      stock: 1,
      sold: false,
      featured: true,
      tagline: "Ձեռքով հավաքված նռնաքար 925 հարգի արծաթում",
      description: "Եզակի նռնաքարի կտոր՝ հավաքված Վայոց Ձորի գետափնյակներից։ Հղկված և տեղադրված 925 հարգի արծաթի մեջ՝ մեկ վարպետի կողմից Երևանում։",
      image: "Images/bracelet.webp",
      sizes: [{ label: "6", price: 340 }, { label: "7", price: 340 }, { label: "8", price: 340 }],
      tags: ["Ձեռագործ", "Եզակի", "Նվեր"]
    },
    {
      id: "pendant-2",
      name: "Գուտանասարի օբսիդիանով կախազարդ",
      brand: "Urartoo",
      sku: "UR-PEND-OBS-02",
      category: "Վզնոցներ",
      stone: "Օբսիդիան",
      stoneOrigin: "Գուտանասար",
      material: "925 արծաթ",
      price: 265,
      stock: 1,
      sold: false,
      featured: true,
      tagline: "Հրաբխային օբսիդիան արծաթե շղթայի վրա",
      description: "Սև օբսիդիանի կտոր՝ հավաքված Գուտանասարի հրաբխային լանջերից։ Տեղադրված արծաթե շղթայի վրա, հավերժական կախազարդ։",
      image: "Images/bracelet.webp",
      sizes: [{ label: "45 սմ", price: 265 }, { label: "50 սմ", price: 265 }],
      tags: ["Հրաբխային", "Ձեռագործ"]
    },
    {
      id: "bracelet-3",
      name: "Սյունիքի փիրուզով ապարանջան",
      brand: "Urartoo",
      sku: "UR-BRAC-TUR-03",
      category: "Ապարանջաններ",
      stone: "Փիրուզ",
      stoneOrigin: "Սյունիք",
      material: "925 արծաթ",
      price: 410,
      stock: 1,
      sold: false,
      featured: true,
      tagline: "Բնական փիրուզ Սյունիքի հանքերից",
      description: "Փիրուզի երկու կտորի կոմբինացիա՝ տեղադրված Սյունիքի քարերից 925 հարգի արծաթե ապարանջանի մեջ։",
      image: "Images/bracelet.webp",
      sizes: [{ label: "Standard", price: 410 }],
      tags: ["Փիրուզ", "Սյունիք"]
    },
    {
      id: "earring-4",
      name: "Արենիի հասպիսով ականջօղեր",
      brand: "Urartoo",
      sku: "UR-EAR-JAS-04",
      category: "Ականջօղեր",
      stone: "Հասպիս",
      stoneOrigin: "Արենի",
      material: "925 արծաթ",
      price: 190,
      stock: 0,
      sold: true,
      featured: true,
      tagline: "Տաք կարմիր հասպիսով ականջօղեր",
      description: "Հասպիսի ջերմ կարմիր երանգներով ականջօղեր՝ հավաքված Արենիի շրջակայքից։ (Վաճառված է)",
      image: "Images/bracelet.webp",
      sizes: [{ label: "Standard", price: 190 }],
      tags: ["Հասպիս", "Արենի"]
    },
    {
      id: "ring-5",
      name: "Սևանի եղնգաքարով մատանի",
      brand: "Urartoo",
      sku: "UR-RING-ONYX-05",
      category: "Մատանիներ",
      stone: "Եղնգաքար",
      stoneOrigin: "Սևան",
      material: "925 արծաթ",
      price: 380,
      stock: 1,
      sold: false,
      featured: true,
      tagline: "Սևանա լճի եղնգաքար արծաթե շրջանակում",
      description: "Սևանա լճի եղնգաքարի կտոր՝ հղկված և տեղադրված արծաթի մեջ։ Յուրաքանչյուրը ունիկալ դիզայն է։",
      image: "Images/bracelet.webp",
      sizes: [{ label: "7", price: 380 }, { label: "8", price: 380 }],
      tags: ["Եղնգաքար", "Սևան"]
    },
    {
      id: "necklace-6",
      name: "Արարատյան ագաթով վզնոց",
      brand: "Urartoo",
      sku: "UR-NECK-AGA-06",
      category: "Վզնոցներ",
      stone: "Ագաթ",
      stoneOrigin: "Արարատյան դաշտ",
      material: "925 արծաթ",
      price: 455,
      stock: 1,
      sold: false,
      featured: true,
      tagline: "Շերտավոր ագաթով նրբագեղ վզնոց",
      description: "Ագաթի կտոր՝ հավաքված Արարատյան դաշտից։ Տեղադրված արծաթե շղթայի վրա, նրբագեղ վզնոց։",
      image: "Images/bracelet.webp",
      sizes: [{ label: "50 սմ", price: 455 }],
      tags: ["Ագաթ"]
    },
    {
      id: "pendant-7",
      name: "Արագածի քվարցով կախազարդ",
      brand: "Urartoo",
      sku: "UR-PEND-QTZ-07",
      category: "Վզնոցներ",
      stone: "Քվարց",
      stoneOrigin: "Արագած",
      material: "925 արծաթ",
      price: 295,
      stock: 1,
      sold: false,
      featured: true,
      tagline: "Լեռնային թափանցիկ քվարց",
      description: "Քվարցի կտոր՝ հավաքված Արագածի լեռներից։ Թափանցիկ և կիսաթափանցիկ կախազարդ։",
      image: "Images/bracelet.webp",
      sizes: [{ label: "45 սմ", price: 295 }],
      tags: ["Քվարց", "Արագած"]
    },
    {
      id: "bracelet-8",
      name: "Գառնիի նռնաքարով ապարանջան",
      brand: "Urartoo",
      sku: "UR-BRAC-GAR-08",
      category: "Ապարանջաններ",
      stone: "Նռնաքար",
      stoneOrigin: "Վայոց Ձոր",
      material: "925 արծաթ",
      price: 520,
      stock: 1,
      sold: false,
      featured: true,
      tagline: "Խորը կարմիր նռնաքարով ապարանջան",
      description: "Նռնաքարի երկու կտորից՝ տեղադրված արծաթե ապարանջանի մեջ։ Հայաստանի ամենախորը քարը։",
      image: "Images/bracelet.webp",
      sizes: [{ label: "Standard", price: 520 }],
      tags: ["Նռնաքար"]
    }
  ];

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
        "image": mainImage.asset->url
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
      if (sanityProds !== null) {
        if (sanityProds.length === 0) {
          // Check local flag so we don't re-seed if the user intentionally deleted all products in Sanity
          const hasSeededBefore = localStorage.getItem('urartoo_sanity_seeded_v1');
          if (!hasSeededBefore) {
            console.log('Sanity database is empty on first load. Seeding default Armenian items...');
            await this.seedInitialData();
            localStorage.setItem('urartoo_sanity_seeded_v1', 'true');
            const reFetched = await this.query(productsGroq);
            this._products = (reFetched && reFetched.length > 0) ? this._transformSanityProducts(reFetched) : [];
          } else {
            // User deleted all products from Sanity — keep empty array []
            this._products = [];
          }
        } else {
          this._products = this._transformSanityProducts(sanityProds);
          localStorage.setItem('urartoo_sanity_seeded_v1', 'true');
        }

        if (sanityJournal && sanityJournal.length > 0) {
          this._journalPosts = sanityJournal;
        } else {
          this._journalPosts = INITIAL_SEED_JOURNAL;
        }

        this._ready = true;
        return this._products;
      }

      // Offline / API error fallback only
      console.warn('Unable to connect to Sanity. Using local catalog fallback.');
      this._products = INITIAL_SEED_PRODUCTS;
      this._journalPosts = INITIAL_SEED_JOURNAL;
      this._ready = true;
      return this._products;
    },

    _transformSanityProducts(docs) {
      return docs.map(doc => ({
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
        img: doc.image || 'Images/bracelet.webp',
        sold: Boolean(doc.sold),
        stock: doc.stock !== undefined ? doc.stock : 1,
        featured: Boolean(doc.featured),
        desc: doc.description || doc.tagline || '',
        tagline: doc.tagline || '',
        description: doc.description || '',
        sizes: doc.sizes || [],
        tags: doc.tags || []
      }));
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
      try {
        await this.mutate([{ delete: { id: sanityDocId } }]);
        // Remove locally from cached state
        this._products = this._products.filter(p => p._sanityId !== sanityDocId && p.id !== sanityDocId);
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
      const docId = productData._sanityId || `product-${productData.id || Date.now()}`;
      const doc = {
        _id: docId,
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
        stock: Number(productData.stock) || 1,
        sold: Boolean(productData.sold),
        featured: Boolean(productData.featured),
        tagline: productData.tagline || '',
        description: productData.desc || productData.description || '',
        sizes: productData.sizes || [],
        tags: productData.tags || []
      };

      try {
        await this.mutate([{ createOrReplace: doc }]);
        await this.init(); // Refresh products
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

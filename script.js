/* ===================================================================
   URARTOO — Redesign · Main Script (Armenian Translation)
   Handles: Two distinct headers (static hero & sticky light),
   product cards, stone cards, trust bar, categories, testimonials,
   field notes, newsletter
   =================================================================== */

(function () {
  'use strict';

  /* ─── Data ─────────────────────────────────────────────────────── */

  const STONE_DOTS = {
    'Նռնաքար': '#7B2D3B',
    'Օբսիդիան': '#17181A',
    'Փիրուզ': '#2E8C8C',
    'Հասպիս': '#A4442B',
    'Եղնգաքար': '#1B1D1C',
    'Ագաթ': '#C2A379',
    'Քվարց': '#6B5B4E'
  };

  const categories = [
    { name: 'Մատանիներ', count: 14, img: 'Images/ring.webp' },
    { name: 'Վզնոցներ', count: 9, img: 'Images/necklace.webp' },
    { name: 'Ապարանջաններ', count: 7, img: 'Images/bracelet.webp' },
    { name: 'Ականջօղեր', count: 11, img: 'Images/earring.webp' }
  ];

  const pieces = [];

  const stones = [
    { name: 'Օբսիդիան', headline: 'Հրաբխային ապակի՝ հղկված մինչև սայր։', region: 'Գուտանասար', count: 12, color: '#17181A', note: 'Վերցնում է այնպիսի սրություն, որ ուրիշ ոչ մի քար չի պահի, և տասից ինն անգամ սխալ է կոտրվում։' },
    { name: 'Նռնաքար', headline: 'Գետի հղկված, խորը նռան գույն։', region: 'Վայոց Ձոր', count: 11, color: '#7B2D3B', note: 'Հղկված է քարի ներսի երակի հետագծով, այդ պատճառով երկու նույնատիպ կտոր չկա։' },
    { name: 'Փիրուզ', headline: 'Պղնձի երկրի կապույտը։', region: 'Սյունիք', count: 9, color: '#2E8C8C', note: 'Երակավոր և հազվադեպ միատարր, հավաքված հին հանքերից մի ափով։' },
    { name: 'Հասպիս', headline: 'Երկաթի կարմիր, տաք շերտավոր։', region: 'Արենի', count: 9, color: '#A4442B', note: 'Խիտ կարմիր շերտեր՝ ամենատաքը 925 արծաթի համադրությամբ։' }
  ];

  const quotes = [
    { text: 'Օբսիդիանով մատանին եկավ բացիկով, որտեղ նշված էր լեռնալանջը, որտեղից գտնվել էր քարը։ Երբեք հասցեով զարդ չէի ունեցել։', who: 'Անահիտ Կարապետյան' },
    { text: 'Խնդրեցի նռնաքար՝ նռան հատիկի գույնի։ Վեց շաբաթ անց նա այն գտել էր գետի հունից։', who: 'Մարիամ Թորոսյան' },
    { text: 'Մեկ վարպետ, մեկ աշխատանոց, քարեր, որոնք ուրիշ ոչ ոք չի հղկում։ Ահա թե ինչպիսին պետք է լինի իսկական ձեռագործ զարդը։', who: 'Սոնա Հարությունյան' },
    { text: 'Զարդը ստացա փաթեթավորված՝ ձեռքի տակ տաք քարի ջերմությունը զգացվում էր։ Երկար տարիներ նման ջերմ բան չէի ստացել։', who: 'Ռուզանա Սարգսյան' },
    { text: 'Ամուսնության տարելիցին պատվիրեցի փիրուզով վզնոց։ Քարը ճիշտ այնպիսին էր, ինչպիսին սպասում էի։', who: 'Լիլիթ Ազարյան' },
    { text: 'Երեք տարի առաջ նույն մատանին նվիրեցի կնոջս։ Հասկացա, որ ամեն քար եզակի է։ Հիմա զարդեր պատվիրում ենք միայն այստեղից։', who: 'Արմեն Տեր-Գրիգորյան' }
  ];


  // Notes are now dynamically loaded from NovaSanity in the Field Notes section below


  /* ─── State ────────────────────────────────────────────────────── */
  let cartCount = 0;
  const added = {};
  const saved = {};

  /* ─── Header Scroll Observer ───────────────────────────────────── */
  const stickyHdr = document.getElementById('sticky-header');

  function checkScroll() {
    if (!stickyHdr) return;
    // Reveal sticky light header smoothly when user scrolls down past 80px on any page
    if (window.scrollY > 80) {
      stickyHdr.classList.add('visible');
    } else {
      stickyHdr.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  /* ─── Mobile Menus ─────────────────────────────────────────────── */
  function setupMenu(toggleSelector, menuSelector) {
    const btn = document.querySelector(toggleSelector);
    const nav = document.querySelector(menuSelector);
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
      document.body.classList.toggle('nav-open', !expanded);
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        btn.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });
  }

  setupMenu('[data-hero-menu-toggle]', '[data-hero-menu]');
  setupMenu('[data-sticky-menu-toggle]', '[data-sticky-menu]');

  /* ─── Stats Counter Animation ───────────────────────────────────── */
  function initStatsAnimation() {
    const statSection = document.getElementById('stats-section') || document.querySelector('.trust-bar');
    if (!statSection) return;

    let animated = false;

    function runCounter(el, target, suffix, prefix, duration) {
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth easeOutExpo curve
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.round(ease * target);

        el.textContent = (prefix || '') + current + (suffix || '');

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = (prefix || '') + target + (suffix || '');
        }
      }

      requestAnimationFrame(update);
    }

    function triggerCounters() {
      if (animated) return;
      animated = true;
      const counters = statSection.querySelectorAll('[data-counter]');
      counters.forEach(function (counter) {
        const target = parseInt(counter.dataset.counter, 10) || 0;
        const suffix = counter.dataset.suffix || '';
        const prefix = counter.dataset.prefix || '';
        runCounter(counter, target, suffix, prefix, 1600);
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            triggerCounters();
            observer.unobserve(statSection);
          }
        });
      }, { threshold: 0.15 });

      observer.observe(statSection);
    } else {
      triggerCounters();
    }
  }

  initStatsAnimation();

  /* ─── Categories ───────────────────────────────────────────────── */
  function renderCategories() {
    var catGrid = document.getElementById('categories-grid');
    if (!catGrid) return;

    var currentPieces = (window.NovaSanity && window.NovaSanity._ready)
      ? window.NovaSanity.getProducts()
      : pieces;

    catGrid.innerHTML = categories.map(function (c) {
      var realCount = (currentPieces || []).filter(function (p) {
        var pCat = (p.cat || p.category || '').trim().toLowerCase();
        return pCat === c.name.trim().toLowerCase();
      }).length;

      return '<a href="shop.html?cat=' + encodeURIComponent(c.name) + '" class="category-card">' +
        '<div class="category-img">' +
          '<div class="category-img-inner">' +
            '<img src="' + c.img + '" alt="' + c.name + '" loading="lazy">' +
          '</div>' +
          '<span class="category-badge">' + c.name + ' (' + realCount + ')</span>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  /* ─── Stones ───────────────────────────────────────────────────── */
  function renderStones() {
    var stonesGrid = document.getElementById('stones-grid');
    if (!stonesGrid) return;

    var currentPieces = (window.NovaSanity && window.NovaSanity._ready)
      ? window.NovaSanity.getProducts()
      : pieces;

    stonesGrid.innerHTML = stones.map(function (s) {
      var realCount = (currentPieces || []).filter(function (p) {
        var pStone = (p.stone || '').trim().toLowerCase();
        var pName = (p.name || '').trim().toLowerCase();
        var sName = s.name.trim().toLowerCase();
        return pStone === sName || pName.indexOf(sName) !== -1;
      }).length;

      return '<a href="shop.html?stone=' + encodeURIComponent(s.name) + '" class="stone-card">' +
        '<span class="stone-card-top">' +
          '<span class="stone-eyebrow">' + s.name + '</span>' +
          '<span class="stone-chevron">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" stroke-width="2.4"><path d="M9 5l7 7-7 7"/></svg>' +
          '</span>' +
        '</span>' +
        '<span class="stone-headline">' + s.headline + '</span>' +
        '<span class="stone-note">' + s.note + '</span>' +
        '<span class="stone-swatch-wrap">' +
          '<span class="stone-swatch" style="background:' + s.color + '"></span>' +
        '</span>' +
        '<span class="stone-foot">' +
          '<span class="stone-region">' + s.region + '</span>' +
          '<span class="stone-count">' + realCount + ' զարդ</span>' +
        '</span>' +
      '</a>';
    }).join('');
  }

  /* ─── Products ─────────────────────────────────────────────────── */
  function showStorefrontToast(msg) {
    if (!msg) return;
    var container = document.getElementById('storefront-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'storefront-toast-container';
      container.style.cssText = 'position:fixed; bottom:28px; right:28px; z-index:100000; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.style.cssText = 'background:#17181A; color:#FFFFFF; font-family:var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif); font-size:13px; font-weight:600; padding:14px 20px; border-left:4px solid #C2A379; border-radius:6px; box-shadow:0 12px 36px rgba(0,0,0,0.5); display:flex; align-items:center; gap:12px; opacity:0; transform:translateY(16px); transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1); pointer-events:auto; max-width:380px;';

    toast.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>' +
      '<span style="flex:1; line-height:1.4;">' + msg + '</span>' +
      '<a href="cart.html" style="color:#C2A379; text-decoration:none; font-weight:700; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid #C2A379; padding-bottom:1px; flex-shrink:0;">ԶԱՄԲՅՈՒՂ →</a>';

    container.appendChild(toast);

    requestAnimationFrame(function() {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px)';
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 4000);
  }

  function getCartArray() {
    try { return JSON.parse(localStorage.getItem('urartoo_cart_v1')) || []; }
    catch (e) { return []; }
  }

  function updateCartDisplay() {
    var cart = getCartArray();
    var totalQty = cart.reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = totalQty;
    });
  }

  /* ─── Wishlist & Cart Helpers ───────────────────────────────────── */
  const WISHLIST_KEY = 'urartoo_wishlist_v1';

  function getWishlistArray() {
    try {
      var w = JSON.parse(localStorage.getItem(WISHLIST_KEY));
      return Array.isArray(w) ? w : [];
    } catch (e) {
      return [];
    }
  }

  function isWishlisted(id) {
    if (!id) return false;
    var w = getWishlistArray();
    var idStr = String(id);
    return w.some(function (item) { return String(item) === idStr; });
  }

  function toggleWishlistItem(id) {
    if (!id) return false;
    var w = getWishlistArray();
    var idStr = String(id);
    var exists = w.some(function (item) { return String(item) === idStr; });
    if (exists) {
      w = w.filter(function (item) { return String(item) !== idStr; });
    } else {
      w.push(idStr);
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(w));
    window.dispatchEvent(new CustomEvent('urartoo:wishlist-updated', { detail: { id: idStr, saved: !exists } }));
    return !exists;
  }

  function renderProducts() {
    var grid = document.getElementById('products-grid');
    if (!grid) return;

    updateCartDisplay();

    var currentPieces = (window.NovaSanity && window.NovaSanity._ready)
      ? window.NovaSanity.getProducts()
      : pieces;

    if (!currentPieces || currentPieces.length === 0) {
      grid.innerHTML = '<div style="padding:40px;text-align:center;color:var(--tuff);">Զարդեր չեն գտնվել</div>';
      return;
    }

    var cart = getCartArray();
    var cartMap = {};
    cart.forEach(function(c) {
      if (c.id) cartMap[String(c.id)] = true;
      if (c._sanityId) cartMap[String(c._sanityId)] = true;
    });

    grid.innerHTML = currentPieces.map(function (p, i) {
      var pId = p.id || p._sanityId || i;
      var dot = STONE_DOTS[p.stone] || '#2C2F2E';
      var isSold = p.sold || p.stock === 0;
      var isAdded = !!cartMap[String(pId)] || !!cartMap[String(p._sanityId)] || !!added[pId];
      var isSaved = isWishlisted(pId) || (p._sanityId && isWishlisted(p._sanityId));
      var formattedPrice = typeof p.price === 'number' ? (p.price + '֏') : p.price;

      var heartSvg = '<svg width="15" height="15" viewBox="0 0 24 24" fill="' +
        (isSaved ? '#A4442B' : 'none') + '" stroke="' +
        (isSaved ? '#A4442B' : '#0C0E0D') + '" stroke-width="1.6">' +
        '<path d="M12 20.5l-7.1-7a4.4 4.4 0 016.2-6.2l.9.9.9-.9a4.4 4.4 0 016.2 6.2z"/></svg>';

      return '<div class="product-card' + (isSold ? ' sold' : '') + '" data-idx="' + pId + '">' +
        '<div class="media">' +
          '<a href="product.html?id=' + pId + '" class="media-inner">' +
            '<img src="' + (p.img || p.image || 'Images/bracelet.webp') + '" alt="' + p.name + '" loading="lazy">' +
          '</a>' +
          '<button class="heart' + (isSaved ? ' saved' : '') + '" data-save="' + pId + '" aria-label="Պահպանել զարդը">' + heartSvg + '</button>' +
          (isSold
            ? '<span class="sold-badge">Վաճառված</span>'
            : '<button class="add-btn' + (isAdded ? ' added' : '') + '" data-add="' + pId + '">' +
                (isAdded ? '✓ Ավելացված է' : 'Ավելացնել զամբյուղ') +
              '</button>'
          ) +
        '</div>' +
        '<div class="card-head">' +
          '<span class="card-name">' + p.name + '</span>' +
          '<span class="card-price">' + formattedPrice + '</span>' +
        '</div>' +
        '<div class="card-meta">' +
          '<span class="stone-dot" style="background:' + dot + '"></span>' +
          '<span class="card-stone">' + (p.stone || 'Նռնաքար') + ' · ' + (p.region || p.stoneOrigin || 'Վայոց Ձոր') + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    // Event delegation
    grid.onclick = function (e) {
      var addBtn = e.target.closest('[data-add]');
      var saveBtn = e.target.closest('[data-save]');

      if (addBtn) {
        var pid = addBtn.dataset.add;
        var prod = currentPieces.find(function(item) {
          return String(item.id) === String(pid) || String(item._sanityId) === String(pid);
        }) || currentPieces[pid];

        if (prod && !prod.sold && prod.stock !== 0) {
          var cart = getCartArray();
          var existingIdx = cart.findIndex(function(c) {
            return String(c.id) === String(prod.id) || String(c._sanityId) === String(prod.id) || (prod._sanityId && String(c.id) === String(prod._sanityId));
          });

          if (existingIdx > -1) {
            cart[existingIdx].qty = (cart[existingIdx].qty || 1) + 1;
          } else {
            cart.push({
              id: prod.id || prod._sanityId,
              _sanityId: prod._sanityId,
              name: prod.name,
              price: Number(prod.price) || 0,
              img: prod.img || prod.image || 'Images/bracelet.webp',
              cat: prod.cat || prod.category || 'Մատանիներ',
              qty: 1
            });
          }

          localStorage.setItem('urartoo_cart_v1', JSON.stringify(cart));
          added[pid] = true;
          updateCartDisplay();
          renderProducts();
          showStorefrontToast('«' + prod.name + '» ավելացվեց զամբյուղում։');
        }
      }

      if (saveBtn) {
        var pid2 = saveBtn.dataset.save;
        var prod2 = currentPieces.find(function(item) {
          return String(item.id) === String(pid2) || String(item._sanityId) === String(pid2);
        }) || currentPieces[pid2];
        var nowSaved = toggleWishlistItem(pid2);
        renderProducts();
        if (prod2) {
          showStorefrontToast(nowSaved ? '«' + prod2.name + '» ավելացվեց պահպանվածներում։' : '«' + prod2.name + '» հեռացվեց պահպանվածներից։');
        }
      }
    };
  }

  window.addEventListener('urartoo:wishlist-updated', function () {
    renderProducts();
  });
  window.addEventListener('storage', function (e) {
    if (e.key === WISHLIST_KEY) {
      renderProducts();
    }
  });

  function updateAllStoreData() {
    renderProducts();
    renderCategories();
    renderStones();
  }

  if (window.NovaSanity) {
    window.NovaSanity.init().then(function() { updateAllStoreData(); });
  } else {
    updateAllStoreData();
  }

  window.addEventListener('urartoo:products-updated', function () {
    updateAllStoreData();
  });
  /* ─── Product Slider Controls ──────────────────────────────────── */
  var prevBtn = document.getElementById('prod-prev');
  var nextBtn = document.getElementById('prod-next');
  var prodGrid = document.getElementById('products-grid');

  if (prodGrid && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () {
      var card = prodGrid.querySelector('.product-card');
      var cardWidth = card ? card.offsetWidth : 280;
      prodGrid.scrollBy({ left: -(cardWidth + 20), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      var card = prodGrid.querySelector('.product-card');
      var cardWidth = card ? card.offsetWidth : 280;
      prodGrid.scrollBy({ left: (cardWidth + 20), behavior: 'smooth' });
    });
  }

  /* ─── Testimonials Slider ─────────────────────────────────────── */
  var quotesGrid = document.getElementById('quotes-grid');
  if (quotesGrid) {
    // Render cards
    quotesGrid.innerHTML = quotes.map(function (q, i) {
      return '<div class="testi-card' + (i === 0 ? ' active' : '') + '" data-slide="' + i + '">' +
        '<div class="testi-card-inner">' +
          '<svg class="testi-quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" stroke-width="1.2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>' +
          '<p class="testi-text">' + q.text + '</p>' +
          '<div class="testi-who">' +
            '<div class="testi-who-dot"></div>' +
            '<span>' + q.who + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    // Slider logic
    var track = quotesGrid;
    var cards = track.querySelectorAll('.testi-card');
    var prevBtn2 = document.getElementById('testi-prev');
    var nextBtn2 = document.getElementById('testi-next');
    var pagination = document.getElementById('testi-pagination');
    var currentSlide = 0;
    var totalSlides = cards.length;
    var autoTimer = null;

    // Build pagination dots based on visible count
    function buildDots() {
      if (!pagination) return;
      var visible = getVisibleCount();
      var maxIdx = Math.max(0, totalSlides - visible);
      var dotCount = maxIdx + 1;
      pagination.innerHTML = '';
      for (var i = 0; i < dotCount; i++) {
        var btn = document.createElement('button');
        btn.className = 'testi-dot' + (i === currentSlide ? ' active' : '');
        btn.setAttribute('data-dot', i);
        pagination.appendChild(btn);
      }
    }

    function getVisibleCount() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }

    function goToSlide(idx) {
      var visible = getVisibleCount();
      var maxIdx = Math.max(0, totalSlides - visible);
      currentSlide = Math.max(0, Math.min(idx, maxIdx));

      var cardEl = cards[0];
      if (!cardEl) return;
      var gap = 24;
      var cardWidth = cardEl.offsetWidth + gap;
      track.style.transform = 'translateX(' + (-currentSlide * cardWidth) + 'px)';

      // Update dots
      var dots = pagination ? pagination.querySelectorAll('.testi-dot') : [];
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentSlide);
      });

      // Update arrow states
      if (prevBtn2) prevBtn2.classList.toggle('disabled', currentSlide === 0);
      if (nextBtn2) nextBtn2.classList.toggle('disabled', currentSlide === maxIdx);
    }

    if (prevBtn2) prevBtn2.addEventListener('click', function () {
      goToSlide(currentSlide - 1);
      resetAuto();
    });
    if (nextBtn2) nextBtn2.addEventListener('click', function () {
      goToSlide(currentSlide + 1);
      resetAuto();
    });

    // Dot clicks
    if (pagination) pagination.addEventListener('click', function (e) {
      var dot = e.target.closest('[data-dot]');
      if (dot) {
        goToSlide(Number(dot.dataset.dot));
        resetAuto();
      }
    });

    // Auto-play
    function startAuto() {
      autoTimer = setInterval(function () {
        var visible = getVisibleCount();
        var maxIdx = Math.max(0, totalSlides - visible);
        goToSlide(currentSlide >= maxIdx ? 0 : currentSlide + 1);
      }, 5000);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }
    startAuto();

    // Touch/swipe
    var startX = 0;
    var dragging = false;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      dragging = true;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (!dragging) return;
      dragging = false;
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
        resetAuto();
      }
    });

    // Recalc on resize
    window.addEventListener('resize', function () { buildDots(); goToSlide(currentSlide); });
    buildDots();
    goToSlide(0);
  }

  /* ─── Field Notes (dynamic from NovaSanity) ──────────────────── */
  var notesGrid = document.getElementById('notes-grid');
  function renderHomeNotes() {
    if (!notesGrid) return;
    var posts = [];
    if (window.NovaSanity && typeof window.NovaSanity.getJournalPosts === 'function') {
      posts = window.NovaSanity.getJournalPosts();
    }
    if (!posts || posts.length === 0) return;
    // Show latest 3 posts
    var latest = posts.slice(0, 3);
    notesGrid.innerHTML = latest.map(function (n) {
      var imgUrl = n.heroImg || n.image || n.img || '';
      var meta = (n.topic || '') + (n.date ? ' · ' + n.date : '');
      return '<a href="journal-post.html?id=' + (n.slug || n.id) + '" class="note-card">' +
        '<div class="note-img">' +
          '<div class="note-img-inner">' +
            (imgUrl
              ? '<img src="' + imgUrl + '" alt="' + (n.title || '') + '" loading="lazy">'
              : '<span class="placeholder-text" style="font-family:var(--mono);font-size:9.5px;line-height:1.8;color:rgba(12,14,13,0.26);max-width:180px;text-align:center;">' + meta + '</span>'
            ) +
          '</div>' +
        '</div>' +
        '<div class="note-meta">' + meta + '</div>' +
        '<div class="note-title">' + (n.title || '') + '</div>' +
      '</a>';
    }).join('');
  }
  // Render immediately if data is available, and also on update events
  renderHomeNotes();
  window.addEventListener('urartoo:journal-updated', renderHomeNotes);

  /* ─── Newsletter ───────────────────────────────────────────────── */
  var nlBtn = document.getElementById('newsletter-btn');
  var nlStatus = document.getElementById('newsletter-status');
  if (nlBtn) {
    nlBtn.addEventListener('click', function () {
      var email = document.getElementById('newsletter-email');
      if (email && email.value.includes('@')) {
        nlStatus.textContent = 'Շնորհակալություն, դուք ցուցակում եք։';
        nlBtn.textContent = 'Բաժանորդագրված';
        nlBtn.disabled = true;
        nlBtn.style.opacity = '0.6';
      }
    });
  }
  /* ─── Site-Wide Stone Loader & AJAX-style Page Transitions ────── */
  function initLoader() {
    var loader = document.getElementById('site-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'site-loader';
      loader.className = 'site-loader';
      loader.innerHTML =
        '<div class="loader-content">' +
          '<div class="stone-spinner">' +
            '<div class="stone-glow"></div>' +
            '<div class="stone-facet"></div>' +
          '</div>' +
        '</div>';
      document.body.prepend(loader);
    }

    // Intentionally hold loader for 1.2s on page load before hiding
    setTimeout(function () {
      loader.classList.add('hidden');
    }, 1200);

    // Intercept internal page navigation links for smooth AJAX-like transition
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;

      var href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
        var targetUrl = link.href;
        if (targetUrl && targetUrl.includes(window.location.host)) {
          e.preventDefault();
          loader.classList.remove('hidden');
          setTimeout(function () {
            window.location.href = targetUrl;
          }, 600);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initLoader();
      syncNavAccountIcons();
      initGlobalCartDrawer();
    });
  } else {
    initLoader();
    syncNavAccountIcons();
    initGlobalCartDrawer();
  }

  function syncNavAccountIcons() {
    var hasSession = false;
    try {
      hasSession = !!localStorage.getItem('urartoo_user_session_v1');
    } catch (e) {}

    document.querySelectorAll('.nav-account-icon').forEach(function (icon) {
      if (hasSession) {
        icon.classList.add('is-logged-in');
        icon.setAttribute('title', 'Իմ հաշիվը (Մուտք գործված է)');
      } else {
        icon.classList.remove('is-logged-in');
        icon.setAttribute('title', 'Իմ հաշիվը');
      }
    });
  }

  // Global Cart Drawer Toggle Logic
  function initGlobalCartDrawer() {
    var overlay = document.getElementById('cart-overlay');
    var drawer = document.getElementById('cart-drawer');
    var closeBtn = document.getElementById('cart-close');

    function openCart() {
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      renderCartDrawerItems();
    }

    function closeCart() {
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    }

    document.addEventListener('click', function (e) {
      var cartTrigger = e.target.closest('a[href="#cart"], .nav-cart-icon');
      if (cartTrigger) {
        e.preventDefault();
        openCart();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);

    syncCartBadge();
  }

  function syncCartBadge() {
    var cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('urartoo_cart_v1')) || [];
    } catch (e) { cart = []; }

    var totalQty = cart.reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (badge) {
      badge.textContent = totalQty;
    });
  }

  function renderCartDrawerItems() {
    var body = document.getElementById('cart-body');
    var totalPriceEl = document.getElementById('cart-total-price');
    if (!body) return;

    var cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('urartoo_cart_v1')) || [];
    } catch (e) { cart = []; }

    syncCartBadge();

    if (cart.length === 0) {
      body.innerHTML = '<div style="text-align:center; padding: 48px 16px; color: var(--tuff); font-size: 14.5px;">' +
        '<p>Զամբյուղը դատարկ է։</p>' +
        '<a href="shop.html" class="btn-primary" style="display:inline-block; margin-top:16px; padding:10px 20px; text-decoration:none; font-size:12px;">Ուսումնասիրել տեսականին</a>' +
      '</div>';
      if (totalPriceEl) totalPriceEl.textContent = '0֏';
      return;
    }

    var total = 0;
    body.innerHTML = cart.map(function (item, index) {
      var itemTotal = (item.price || 0) * (item.qty || 1);
      total += itemTotal;

      return '<div style="display:flex; gap:14px; align-items:center; border-bottom:1px solid var(--pumice); padding-bottom:14px;">' +
        '<div style="width:60px; height:60px; background:var(--warm-light); flex-shrink:0; overflow:hidden;">' +
          '<img src="' + (item.img || 'Images/bracelet.webp') + '" style="width:100%; height:100%; object-fit:cover;" alt="">' +
        '</div>' +
        '<div style="flex:1;">' +
          '<div style="font-size:13.5px; font-weight:600; color:var(--obsidian); margin-bottom:4px;">' + item.name + '</div>' +
          '<div style="font-size:12.5px; color:var(--amber); font-family:var(--mono);">' + (item.qty || 1) + ' × ' + item.price + '֏' + '</div>' +
        '</div>' +
        '<button onclick="removeCartItem(' + index + ')" style="background:none; border:none; color:var(--tuff); font-size:18px; cursor:pointer;">×</button>' +
      '</div>';
    }).join('');

    if (totalPriceEl) totalPriceEl.textContent = total + '֏';
  }

  window.removeCartItem = function (index) {
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('urartoo_cart_v1')) || []; } catch (e) {}
    cart.splice(index, 1);
    localStorage.setItem('urartoo_cart_v1', JSON.stringify(cart));
    renderCartDrawerItems();
  };

  window.handleCartDrawerCheckout = function () {
    var cart = [];
    try { cart = JSON.parse(localStorage.getItem('urartoo_cart_v1')) || []; } catch (e) {}
    if (cart.length === 0) {
      alert('Ձեր զամբյուղը դատարկ է։');
      return;
    }

    var session = null;
    try { session = JSON.parse(localStorage.getItem('urartoo_user_session_v1')); } catch (e) {}

    var customerName = session ? (session.name || session.email) : 'Գնորդ (Կայքից)';
    var customerEmail = session ? session.email : 'guest@urartoo.am';
    var subtotal = cart.reduce(function (s, i) { return s + (i.price * (i.qty || 1)); }, 0);

    if (window.WooCommerceAdmin && typeof window.WooCommerceAdmin.addOrder === 'function') {
      var newOrder = window.WooCommerceAdmin.addOrder(
        { name: customerName, email: customerEmail },
        cart,
        subtotal
      );
      alert('Շնորհակալություն։ Ձեր պատվերը #' + newOrder.id + ' հաջողությամբ գրանցվել է (' + subtotal + '֏)։');
    } else {
      alert('Շնորհակալություն։ Պատվերը գրանցված է։');
    }

    localStorage.setItem('urartoo_cart_v1', JSON.stringify([]));
    renderCartDrawerItems();
    var drawer = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  };

  // Custom Select Dropdowns Initialization
  document.addEventListener('DOMContentLoaded', function () {
    if (window.initCustomSelects) {
      window.initCustomSelects();
    }
  });

})();
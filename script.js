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

  const pieces = [
    { name: 'Վայոց Ձորի նռնաքարով մատանի', region: 'Վայոց Ձոր', stone: 'Նռնաքար', price: '$340', img: 'Images/bracelet.webp', sold: false },
    { name: 'Գուտանասարի օբսիդիանով կախազարդ', region: 'Գուտանասար', stone: 'Օբսիդիան', price: '$265', img: 'Images/bracelet.webp', sold: false },
    { name: 'Սյունիքի փիրուզով ապարանջան', region: 'Սյունիք', stone: 'Փիրուզ', price: '$410', img: 'Images/bracelet.webp', sold: false },
    { name: 'Արենիի հասպիսով ականջօղեր', region: 'Արենի', stone: 'Հասպիս', price: '$190', img: 'Images/bracelet.webp', sold: true },
    { name: 'Սևանի եղնգաքարով մատանի', region: 'Սևան', stone: 'Եղնգաքար', price: '$380', img: 'Images/bracelet.webp', sold: false },
    { name: 'Արարատյան ագաթով վզնոց', region: 'Արարատյան դաշտ', stone: 'Ագաթ', price: '$455', img: 'Images/bracelet.webp', sold: false },
    { name: 'Արագածի քվարցով կախազարդ', region: 'Արագած', stone: 'Քվարց', price: '$295', img: 'Images/bracelet.webp', sold: false },
    { name: 'Գառնիի նռնաքարով ապարանջան', region: 'Վայոց Ձոր', stone: 'Նռնաքար', price: '$520', img: 'Images/bracelet.webp', sold: false }
  ];

  const stones = [
    { name: 'Օբսիդիան', headline: 'Հրաբխային ապակի՝ հղկված մինչև սայր։', region: 'Գուտանասար', count: 12, color: '#17181A', note: 'Վերցնում է այնպիսի սրություն, որ ուրիշ ոչ մի քար չի պահի, և տասից ինն անգամ սխալ է կոտրվում։' },
    { name: 'Նռնաքար', headline: 'Գետի հղկված, խորը նռան գույն։', region: 'Վայոց Ձոր', count: 11, color: '#7B2D3B', note: 'Հղկված է քարի ներսի երակի հետագծով, այդ պատճառով երկու նույնատիպ կտոր չկա։' },
    { name: 'Փիրուզ', headline: 'Պղնձի երկրի կապույտը։', region: 'Սյունիք', count: 9, color: '#2E8C8C', note: 'Երակավոր և հազվադեպ միատարր, հավաքված հին հանքերից մի ափով։' },
    { name: 'Հասպիս', headline: 'Երկաթի կարմիր, տաք շերտավոր։', region: 'Արենի', count: 9, color: '#A4442B', note: 'Խիտ կարմիր շերտեր՝ ամենատաքը 925 արծաթի համադրությամբ։' }
  ];

  const quotes = [
    { text: 'Օբսիդիանով մատանին եկավ բացիկով, որտեղ նշված էր լեռնալանջը, որտեղից գտնվել էր քարը։ Երբեք հասցեով զարդ չէի ունեցել։', who: 'Անահիտ Կ․ · Երևան' },
    { text: 'Խնդրեցի նռնաքար՝ նռան հատիկի գույնի։ Վեց շաբաթ անց նա այն գտել էր գետի հունից։', who: 'Մարի Թ․ · Բեռլին' },
    { text: 'Մեկ վարպետ, մեկ աշխատանոց, քարեր, որոնք ուրիշ ոչ ոք չի հղկում։ Ահա թե ինչպիսին պետք է լինի իսկական ձեռագործ զարդը։', who: 'Caucasus Craft Review' }
  ];

  const notes = [
    { meta: 'Սեպտեմբեր 2025 · Գուտանասար', title: 'Երեք օր հրաբխի վրա՝ մեկ լավ ապակու կտորի համար', img: '' },
    { meta: 'Հուլիս 2025 · Վայոց Ձոր', title: 'Ինչու է գետի նռնաքարը հղկվում այլ կերպ, քան հանքինը', img: '' },
    { meta: 'Մայիս 2025 · Երևան', title: 'Անհամաչափ քարի տեղադրումը արծաթում', img: '' }
  ];

  const trustItems = [
    { label: 'Անվճար առաքում $300-ից սկսած', d: 'M2 8h13v8H2zM15 11h4l3 3v2h-7zM6 19a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2zM18 19a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2z' },
    { label: 'Ծագման վկայականը ներառված է', d: 'M6 3h9l4 4v14H6zM9 11h8M9 15h5M15 3v4h4' },
    { label: '30 օրյա վերադարձ', d: 'M4 10a8 8 0 0113.6-3.6L21 9M21 4v5h-5M20 14a8 8 0 01-13.6 3.6L3 15M3 20v-5h5' },
    { label: 'Անվճար չափսի փոփոխում առաջին տարում', d: 'M12 8a6 6 0 100 12 6 6 0 000-12zM9.5 6.5L12 3l2.5 3.5' }
  ];

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

  /* ─── Trust Bar ────────────────────────────────────────────────── */
  const trustGrid = document.getElementById('trust-grid');
  if (trustGrid) {
    trustGrid.innerHTML = trustItems.map(function (t) {
      var uri = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.5'%3E%3Cpath d='" + encodeURIComponent(t.d) + "'/%3E%3C/svg%3E\")";
      return '<span class="trust-item">' +
        '<span class="trust-icon" style="mask-image:' + uri + ';-webkit-mask-image:' + uri + '"></span>' +
        '<span class="trust-label">' + t.label + '</span>' +
      '</span>';
    }).join('');
  }

  /* ─── Categories ───────────────────────────────────────────────── */
  const catGrid = document.getElementById('categories-grid');
  if (catGrid) {
    catGrid.innerHTML = categories.map(function (c) {
      return '<a href="shop.html" class="category-card">' +
        '<div class="category-img">' +
          '<div class="category-img-inner">' +
            '<img src="' + c.img + '" alt="' + c.name + '" loading="lazy">' +
          '</div>' +
          '<span class="category-badge">' + c.name + '</span>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  /* ─── Products ─────────────────────────────────────────────────── */
  function updateCartDisplay() {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = cartCount;
    });
  }

  function renderProducts() {
    var grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = pieces.map(function (p, i) {
      var dot = STONE_DOTS[p.stone] || '#2C2F2E';
      var isSold = p.sold;
      var isAdded = !!added[i];
      var isSaved = !!saved[i];

      var heartSvg = '<svg width="15" height="15" viewBox="0 0 24 24" fill="' +
        (isSaved ? '#7B2D3B' : 'none') + '" stroke="' +
        (isSaved ? '#7B2D3B' : '#0C0E0D') + '" stroke-width="1.5">' +
        '<path d="M12 20.5l-7.1-7a4.4 4.4 0 016.2-6.2l.9.9.9-.9a4.4 4.4 0 016.2 6.2z"/></svg>';

      return '<div class="product-card' + (isSold ? ' sold' : '') + '" data-idx="' + i + '">' +
        '<div class="media">' +
          '<a href="#piece-' + i + '" class="media-inner">' +
            '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
          '</a>' +
          '<button class="heart' + (isSaved ? ' saved' : '') + '" data-save="' + i + '" aria-label="Պահպանել զարդը">' + heartSvg + '</button>' +
          (isSold
            ? '<span class="sold-badge">Վաճառված</span>'
            : '<button class="add-btn' + (isAdded ? ' added' : '') + '" data-add="' + i + '">' +
                (isAdded ? 'Ավելացված է' : 'Ավելացնել զամբյուղ') +
              '</button>'
          ) +
        '</div>' +
        '<div class="card-head">' +
          '<span class="card-name">' + p.name + '</span>' +
          '<span class="card-price">' + p.price + '</span>' +
        '</div>' +
        '<div class="card-meta">' +
          '<span class="stone-dot" style="background:' + dot + '"></span>' +
          '<span class="card-stone">' + p.stone + ' · ' + p.region + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    // Event delegation
    grid.addEventListener('click', function (e) {
      var addBtn = e.target.closest('[data-add]');
      var saveBtn = e.target.closest('[data-save]');

      if (addBtn) {
        var idx = Number(addBtn.dataset.add);
        if (!pieces[idx].sold && !added[idx]) {
          added[idx] = true;
          cartCount++;
          updateCartDisplay();
          renderProducts();
        }
      }

      if (saveBtn) {
        var idx2 = Number(saveBtn.dataset.save);
        saved[idx2] = !saved[idx2];
        renderProducts();
      }
    });
  }

  renderProducts();

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

  /* ─── Stones ───────────────────────────────────────────────────── */
  var stonesGrid = document.getElementById('stones-grid');
  if (stonesGrid) {
    stonesGrid.innerHTML = stones.map(function (s) {
      return '<a href="shop.html" class="stone-card">' +
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
          '<span class="stone-count">' + s.count + ' զարդ</span>' +
        '</span>' +
      '</a>';
    }).join('');
  }

  /* ─── Testimonials ─────────────────────────────────────────────── */
  var quotesGrid = document.getElementById('quotes-grid');
  if (quotesGrid) {
    quotesGrid.innerHTML = quotes.map(function (q) {
      return '<div>' +
        '<p class="quote-text">«' + q.text + '»</p>' +
        '<div class="quote-who">' + q.who + '</div>' +
      '</div>';
    }).join('');
  }

  /* ─── Field Notes ──────────────────────────────────────────────── */
  var notesGrid = document.getElementById('notes-grid');
  if (notesGrid) {
    notesGrid.innerHTML = notes.map(function (n) {
      return '<a href="#note" class="note-card">' +
        '<div class="note-img">' +
          '<div class="note-img-inner">' +
            (n.img
              ? '<img src="' + n.img + '" alt="' + n.title + '" loading="lazy">'
              : '<span class="placeholder-text" style="font-family:var(--mono);font-size:9.5px;line-height:1.8;color:rgba(12,14,13,0.26);max-width:180px;text-align:center;">' + n.meta + '</span>'
            ) +
          '</div>' +
        '</div>' +
        '<div class="note-meta">' + n.meta + '</div>' +
        '<div class="note-title">' + n.title + '</div>' +
      '</a>';
    }).join('');
  }

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
    });
  } else {
    initLoader();
    syncNavAccountIcons();
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

})();
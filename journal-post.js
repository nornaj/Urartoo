/**
 * Urartoo — Single Blog Post Dynamic Loader & Interactions
 * (Single Product FAQ design harmonized & full article dataset)
 */

(function () {
  'use strict';

  // Article Database
  const BLOG_ARTICLES = {
    'gutanasar-obsidian': {
      id: 'gutanasar-obsidian',
      slug: 'three-days-on-a-volcano-for-one-good-piece-of-glass',
      title: 'Երեք օր հրաբխի վրա՝ մեկ լավ ապակու կտորի համար',
      titleEn: 'Three days on a volcano for one good piece of glass',
      lead: 'Գուտանասարի օբսիդիանը կոտրվում է տասից ինն անգամ սխալ։ Ահա թե ինչ տեսք ունի տասներորդը և ինչ արժեցավ այնտեղ հասնելը։',
      leadEn: 'Obsidian is everywhere on Gutanasar and almost none of it is usable. What separates a piece worth carrying down from the thousand pieces left behind is a thing you learn with your hands, not your eyes.',
      date: 'Սեպտեմբեր 2025',
      dateEn: 'September 2025',
      location: 'Գուտանասար',
      locationEn: 'Gutanasar',
      readTime: '9 րոպե',
      readTimeEn: '9 min read',
      heroImg: 'Images/stone-quarry.webp',
      heroCaption: 'գլխավոր լուսանկար · օբսիդիանի լանջը Գուտանասարի վրա առավոտյան',
      
      blocks: [
        { type: 'h2', id: 's1', text: 'Լանջն է որոշում, ոչ թե դուք' },
        { type: 'p', text: 'Գուտանասարը հրաբխային գմբեթ է Երևանից մեկ ժամ հյուսիս, և նրա ողջ հյուսիսային լանջը ծածկված է սև ապակիով։ Ճանապարհից այն թվում է հսկայական հանք՝ այնպիսի վայր, որտեղ պատկերացնում ես քսան րոպեում պարկը լցնելն ու տուն վերադառնալը։ Բայց իրականում դա այդպես չէ։ Մակերևույթի գրեթե ողջ նյութը անցել է երեսուն ձմռան սառեցման ու հալեցման միջով, և լի է մազանման ճաքերով, որոնք անհնար է տեսնել, քանի դեռ քարը հղկման ակոսում չէ։' },
        { type: 'p", text: "Այնպես որ առաջին օրը քար հավաքելը չէ։ Դա քայլելն է, բարձրացնելը և գրեթե բոլորը հետ դնելը։ Ես փնտրում եմ կտորներ, որոնք վերջերս են դուրս եկել փլուզումից, որտեղ կոտրվածքի մակերեսները դեռ սուր են, և լսում եմ — առողջ կտորը թեթևակի զանգի պես հնչում է, երբ երկուսը հպում ես իրար, իսկ ճաքածը տալիս է խուլ թխկոց։ Այդ թեստը ողջ ուղևորության էությունն է։' },
        { type: 'figure', img: 'Images/stone-quarry.webp', caption: 'գլխավոր լուսանկար · փլուզման քարերը, հյուսիսային լանջ, առավոտյան ստվեր' },
        { type: 'h2', id: 's2', text: 'Ինչպիսին է պիտանի կտորը' },
        { type: 'p', text: 'Այս գմբեթի լավագույն օբսիդիանը խորը չեզոք սև է՝ առանց դարչնագույն երանգի, թափանցիկ բարակ եզրին, երբ այն պահում ես երկնքի ֆոնին։ Եթե եզրը տաք փայլում է, ապա երկաթը շատ է և այն կստանա պղտոր փայլեցում։ Եթե այն հավասարաչափ է փայլում, կտորը առողջ է իր մարմնով — ճաքը ի հայտ է գալիս որպես պայծառ ներքին գիծ այն պահին, երբ լույսն անցնում է դրա միջով։' },
        { type: 'blockquote', text: 'Առողջ կտորը զանգում է հպելիս։ Ճաքածը թխկում է։ Լանջին մեկ օր աշխատելուց հետո ձեռքերդ ավելի շուտ են իմանում, քան աչքերդ։' },
        { type: 'p', text: 'Չափսն ավելի քիչ նշանակություն ունի, քան մարդիկ սպասում են։ Կախազարդին անհրաժեշտ է եղունգի չափով պատրաստի քար, ինչը նշանակում է սկսել բռունցքի չափի կտորից, որովհետև զանգվածի երկու երրորդը հեռանում է առաջին հղկման ժամանակ, իսկ ցանկացած թաքնված թերություն նշանակում է սկսել նորից։' },
        { type: 'h2', id: 's3', text: 'Իջեցնելը լեռից' },
        { type: 'p', text: 'Ամեն ինչ փաթաթվում է առանձին կտորով և տեղափոխվում կտավե պայուսակում, ոչ թե մեջքին սեղմված ուսապարկում։ Օբսիդիանը կոտրվում է օբսիդիանին հպվելիս երկժամյա իջնելու ընթացքում, իսկ սխալ տեղում կոտրվածքը կախազարդի նախապատրաստվածքը վերածում է թափոնի։ Երեք օրվա ավարտին ես ունեի տասնմեկ կտոր, որոնք արժեր տուն տանել՝ հարյուրավոր բարձրացրածներից։' },
        { type: 'figure', img: 'Images/stone-lapidary.webp', caption: 'տասնմեկ փաթաթված նախապատրաստվածքներ աշխատանոցի սեղանին։ Երեքից չորսը ողջ մնացին հղկմանը։' },
        { type: 'h2', id: 's4', text: 'Աշխատանոցի ակոսում' },
        { type: 'p', text: 'Հղկումը կատարվում է թաց և դանդաղ, որովհետև օբսիդիանը վատ է տանում ջերմությունը, իսկ արագ հղկումը կճաքեցնի լանջին կատարյալ քարը։ Տասնմեկից չորսը հասան պատրաստի կաբոշոնի։ Այդ չորսից մեկը դարձավ այս նշման կողային սյունակի կախազարդը՝ թեթևակի ան համաչափ կաթիլ, որովհետև թերությունը անցնում էր մեկ կողմով, իսկ այն համաչափ հղկելը կկտրեր լավ ապակին։' },
        { type: 'h2', id: 's5', text: 'Ինչու արժե այնքան, ինչքան արժե' },
        { type: 'p', text: 'Երեք օր քայլք, վառելիքի բաք, տասնմեկ նախապատրաստվածք, չորս փրկված, մեկ պատրաստի զարդ վաճառքի համար։ Այդ թվաբանությունն է պատճառը, որ Urartoo-ի յուրաքանչյուր կախազարդ արտադրական ապրանք չէ և երբեք չի լինի։ Դա նաև նշանակում է, որ ձեր ստացած քարն ունի հասցե՝ այս լանջը, այս սեպտեմբերը, այս պայուսակը։' }
      ],

      featuredProduct: {
        title: 'Գուտանասարի օբսիդիանով կախազարդ',
        price: '$265',
        badge: 'Եզակի (1 of 1)',
        img: 'Images/ring.webp',
        link: 'shop.html'
      },

      faqs: [
        {
          q: 'Կարո՞ղ եմ խնդրել քար որոշակի վայրից։',
          a: 'Այո, և դա ամենահաճախ հանդիպող խնդրանքն է դաշտային նշումը հրապարակելուց հետո։ Ընտրեք տարածաշրջանը և ցանկալի ձևը, ես կփնտրեմ հաջորդ ուղևորության ընթացքում։ Սպասումը կախված է վայրից — Գուտանասարի օբսիդիանը սովորաբար գտնում եմ մեկ ամսվա ընթացքում, Սյունիքի փիրուզը երբեմն պահանջում է ամբողջ սեզոն։'
        },
        {
          q: 'Ինչպե՞ս իմանամ, որ քարը իսկապես այդ վայրից է։',
          a: 'Յուրաքանչյուր զարդ ուղարկվում է հավաստագրով, որտեղ նշված է հովիտը, գտնելու ամիսը և հանքանյութը։ Դաշտային նշումները նույն գրանցման երկար տարբերակն են — եթե զարդը պատրաստվել է ուղևորությունից, որի մասին գրել եմ, հավաստագիրը հղում է կատարում նշմանը։'
        },
        {
          q: 'Արդյո՞ք օբսիդիանը բավականաչափ ամուր է ամենօրյա կրման համար։',
          a: 'Կախազարդերի և ականջօղերի համար՝ այո։ Ամեն օր կրվող մատանիների համար դա սխալ քար է — այն ապակի է, իսկ ապակին կոտրվում է դռան շրջանակին հպվելիս։ Եթե ցանկանում եք ամենօրյա մատանի, ես ձեզ կնախապատրաստեմ նռնաքարի, հասպիսի կամ ագաթի։'
        },
        {
          q: 'Արդյո՞ք նշման մեջ ներկայացված զարդերը երկար են մնում։',
          a: 'Հազվադեպ։ Յուրաքանչյուրը եզակի օրինակ է, և նշումը սովորաբար վաճառում է ներկայացված զարդը մեկ-երկու շաբաթվա ընթացքում։ Եթե այն վաճառված է, նույն տարածաշրջանից պատվերը ամենամոտ տարբերակն է։'
        },
        {
          q: 'Կարո՞ղ եմ այցելել աշխատանոց։',
          a: 'Աշխատանոցը Երևանում է, և այցելությունները կատարվում են նախնական պայմանավորվածությամբ։ Գրեք նախապես — ես տարվա մեծ մասը ճանապարհին եմ քարեր հավաքելու համար։'
        }
      ],

      related: [
        {
          id: 'garnet-river',
          meta: 'Հուլիս 2025 · Վայոց Ձոր',
          title: 'Ինչու է գետի նռնաքարը հղկվում այլ կերպ, քան հանքինը',
          shot: 'Images/necklace.webp'
        },
        {
          id: 'turquoise-copper',
          meta: 'Հունիս 2025 · Սյունիք',
          title: 'Փիրուզ հին պղնձի հանքերից',
          shot: 'Images/bracelet.webp'
        },
        {
          id: 'symmetrical-setting',
          meta: 'Մայիս 2025 · Երևան',
          title: 'Տեղադրել քարը, որը հրաժարվում է համաչափ լինելուց',
          shot: 'Images/earring.webp'
        }
      ]
    }
  };

  // Default current article ID
  let currentArticle = BLOG_ARTICLES['gutanasar-obsidian'];

  // Initialize Page
  function initPage() {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id') || params.get('slug');

    let allPosts = [];
    if (window.NovaSanity && typeof window.NovaSanity.getJournalPosts === 'function') {
      allPosts = window.NovaSanity.getJournalPosts();
    }

    if (articleId) {
      const foundInSanity = allPosts.find(p => String(p.id) === String(articleId) || String(p.slug) === String(articleId) || String(p._sanityId) === String(articleId));
      if (foundInSanity) {
        currentArticle = foundInSanity;
      } else if (BLOG_ARTICLES[articleId]) {
        currentArticle = BLOG_ARTICLES[articleId];
      }
    } else if (allPosts.length > 0) {
      currentArticle = allPosts.find(p => p.featured) || allPosts[0];
    }

    renderArticleMeta();
    renderArticleBody();
    renderTableOfContents();
    renderFeaturedProduct();
    renderRelatedNotes(allPosts);
    renderFaqAccordion();

    setupShareEvents();
    setupTocScrollObserver();
  }

  // Render Header Meta, Title, Lead & Hero
  function renderArticleMeta() {
    const postBcTitle = document.getElementById('post-bc-title');
    const postDate = document.getElementById('post-date');
    const postLocation = document.getElementById('post-location');
    const postReadTime = document.getElementById('post-readtime');
    const postTitle = document.getElementById('post-title');
    const postLead = document.getElementById('post-lead');
    const postHeroImg = document.getElementById('post-hero-img');
    const postHeroPlaceholder = document.getElementById('post-hero-placeholder');

    if (postBcTitle) postBcTitle.textContent = currentArticle.title;
    if (postDate) postDate.textContent = currentArticle.date;
    if (postLocation) postLocation.textContent = currentArticle.location;
    if (postReadTime) postReadTime.textContent = currentArticle.readTime;
    if (postTitle) postTitle.textContent = currentArticle.title;
    if (postLead) postLead.textContent = currentArticle.lead || currentArticle.excerpt || '';

    if (currentArticle.heroImg && postHeroImg) {
      postHeroImg.src = currentArticle.heroImg;
      postHeroImg.alt = currentArticle.title;
      postHeroImg.style.display = 'block';
      if (postHeroPlaceholder) postHeroPlaceholder.style.display = 'none';
    } else if (postHeroPlaceholder) {
      postHeroPlaceholder.textContent = currentArticle.heroCaption || 'լուսանկար · դաշտային նշում';
    }
  }

  // Render Body Content Blocks / Rich HTML
  function renderArticleBody() {
    const postBody = document.getElementById('post-body');
    if (!postBody) return;

    let html = '';

    if (currentArticle.contentHtml) {
      // Direct rich HTML from ACF editor: Parse and assign IDs to H2 headings
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = currentArticle.contentHtml;
      const h2s = tempDiv.querySelectorAll('h2');
      h2s.forEach((h, idx) => {
        if (!h.id) h.id = `section-${idx + 1}`;
      });
      html = tempDiv.innerHTML;
    } else if (Array.isArray(currentArticle.blocks) && currentArticle.blocks.length > 0) {
      currentArticle.blocks.forEach(block => {
        if (block.type === 'h2') {
          html += `<div class="journal-post-block"><h2 id="${block.id}">${escapeHtml(block.text)}</h2></div>`;
        } else if (block.type === 'p') {
          html += `<div class="journal-post-block"><p>${escapeHtml(block.text)}</p></div>`;
        } else if (block.type === 'blockquote') {
          html += `<div class="journal-post-block"><blockquote><span>${escapeHtml(block.text)}</span></blockquote></div>`;
        } else if (block.type === 'figure') {
          html += `
            <div class="journal-post-block">
              <figure>
                <div class="journal-post-figure-img">
                  ${block.img ? `<img src="${block.img}" alt="${escapeHtml(block.caption || '')}" loading="lazy">` : `<span class="journal-post-hero-placeholder">${escapeHtml(block.text || '')}</span>`}
                </div>
                ${block.caption ? `<figcaption class="journal-post-figure-caption">${escapeHtml(block.caption)}</figcaption>` : ''}
              </figure>
            </div>
          `;
        }
      });
    } else if (currentArticle.content) {
      html = `<div class="journal-post-block"><p>${escapeHtml(currentArticle.content)}</p></div>`;
    }

    // Author Bench Box
    html += `
      <div class="bench-author-box">
        <div class="bench-author-avatar">U</div>
        <div>
          <div class="bench-author-title">Գրված է աշխատանոցում</div>
          <div class="bench-author-desc">Դաշտային նշումներ վարպետից, ով հավաքում, հղկում և տեղադրում է Urartoo-ի յուրաքանչյուր քար։ Երևան, Հայաստան։</div>
        </div>
      </div>
    `;

    postBody.innerHTML = html;
  }

  // Render Table of Contents Links
  function renderTableOfContents() {
    const tocNav = document.getElementById('post-toc-nav');
    if (!tocNav) return;

    const headings = document.querySelectorAll('#post-body h2');
    let html = '';
    headings.forEach((h, idx) => {
      const activeClass = idx === 0 ? 'active' : '';
      const text = h.textContent.trim();
      const hId = h.id || `section-${idx + 1}`;
      h.id = hId;

      html += `
        <a href="#${hId}" class="journal-toc-link ${activeClass}" data-toc-id="${hId}">
          <span class="journal-toc-mark"></span>
          <span>${escapeHtml(text)}</span>
        </a>
      `;
    });

    if (!html) {
      const sidebarBox = tocNav.closest('.journal-sidebar-box');
      if (sidebarBox) sidebarBox.style.display = 'none';
      return;
    } else {
      const sidebarBox = tocNav.closest('.journal-sidebar-box');
      if (sidebarBox) sidebarBox.style.display = 'block';
    }

    tocNav.innerHTML = html;
  }

  // Render Featured Product Card
  function renderFeaturedProduct() {
    const featCard = document.getElementById('post-featured-card');
    const feat = currentArticle.featuredProduct;
    if (!feat || !feat.title) {
      if (featCard) featCard.style.display = 'none';
      return;
    }

    if (featCard) featCard.style.display = 'block';

    const postFeaturedTitle = document.getElementById('post-featured-title');
    const postFeaturedPrice = document.getElementById('post-featured-price');
    const postFeaturedImg = document.getElementById('post-featured-img');
    const postFeaturedLink = document.getElementById('post-featured-link');

    if (postFeaturedTitle) postFeaturedTitle.textContent = feat.title;
    if (postFeaturedPrice) postFeaturedPrice.textContent = feat.price;
    if (postFeaturedImg && feat.img) postFeaturedImg.src = feat.img;
    if (postFeaturedLink) postFeaturedLink.href = feat.link || 'shop.html';
  }

  // Render Related Notes Grid (matches home page .note-card style)
  function renderRelatedNotes(allPosts = []) {
    const grid = document.getElementById('post-related-grid');
    if (!grid) return;

    // Build the list: prefer NovaSanity global posts, fallback to article's related array
    let relatedList = [];

    // Get all available posts from NovaSanity or passed allPosts
    let globalPosts = allPosts;
    if ((!globalPosts || globalPosts.length === 0) && window.NovaSanity) {
      globalPosts = window.NovaSanity.getJournalPosts() || [];
    }

    if (Array.isArray(globalPosts) && globalPosts.length > 0) {
      // Filter out current article, take latest 3
      relatedList = globalPosts
        .filter(p => String(p.id) !== String(currentArticle.id) && String(p.slug) !== String(currentArticle.slug))
        .slice(0, 3)
        .map(p => ({
          id: p.slug || p.id,
          meta: `${p.date || ''} · ${p.location || ''}`,
          title: p.title,
          img: p.heroImg || ''
        }));
    }

    // Fallback to article's own related array
    if (relatedList.length === 0 && Array.isArray(currentArticle.related)) {
      relatedList = currentArticle.related.slice(0, 3).map(r => ({
        id: r.id,
        meta: r.meta,
        title: r.title,
        img: r.shot || r.img || ''
      }));
    }

    // Render using exact home page .note-card markup
    let html = '';
    relatedList.forEach(rel => {
      html += '<a href="journal-post.html?id=' + (rel.id || '') + '" class="note-card">' +
        '<div class="note-img">' +
          '<div class="note-img-inner">' +
            (rel.img
              ? '<img src="' + rel.img + '" alt="' + escapeHtml(rel.title) + '" loading="lazy">'
              : '<span class="placeholder-text" style="font-family:var(--mono);font-size:9.5px;line-height:1.8;color:rgba(12,14,13,0.26);max-width:180px;text-align:center;">' + escapeHtml(rel.meta) + '</span>'
            ) +
          '</div>' +
        '</div>' +
        '<div class="note-meta">' + escapeHtml(rel.meta) + '</div>' +
        '<div class="note-title">' + escapeHtml(rel.title) + '</div>' +
      '</a>';
    });

    grid.innerHTML = html;

    // Also listen for journal updates to re-render when NovaSanity loads
    if (!grid._journalListenerBound) {
      grid._journalListenerBound = true;
      window.addEventListener('urartoo:journal-updated', function () {
        renderRelatedNotes([]);
      });
    }
  }

  // Render Single Product FAQ Accordion (Single Product Design System Harmonized)
  function renderFaqAccordion() {
    const accordion = document.getElementById('post-faq-accordion');
    if (!accordion) return;

    let html = '';
    currentArticle.faqs.forEach((faq, idx) => {
      const isOpen = idx === 0;
      html += `
        <div class="pdp-detail-block" data-faq>
          <button class="pdp-faq-summary" aria-expanded="${isOpen ? 'true' : 'false'}">
            ${escapeHtml(faq.q)}
            <span class="pdp-faq-icon"></span>
          </button>
          <div class="pdp-faq-body ${isOpen ? 'open' : ''}" style="${isOpen ? 'max-height: 300px;' : ''}">
            <div class="pdp-faq-body-inner">
              <p>${escapeHtml(faq.a)}</p>
            </div>
          </div>
        </div>
      `;
    });

    accordion.innerHTML = html;
    bindFaqEvents(accordion);
  }

  // Bind Single Product FAQ Accordion Events
  function bindFaqEvents(container) {
    const blocks = container.querySelectorAll('[data-faq]');
    blocks.forEach(block => {
      const summaryBtn = block.querySelector('.pdp-faq-summary');
      const bodyEl = block.querySelector('.pdp-faq-body');

      if (summaryBtn && bodyEl) {
        summaryBtn.addEventListener('click', () => {
          const isExpanded = summaryBtn.getAttribute('aria-expanded') === 'true';

          // Close all sibling FAQs
          blocks.forEach(b => {
            const btn = b.querySelector('.pdp-faq-summary');
            const bd = b.querySelector('.pdp-faq-body');
            if (btn && bd) {
              btn.setAttribute('aria-expanded', 'false');
              bd.classList.remove('open');
              bd.style.maxHeight = '0px';
            }
          });

          // Toggle clicked FAQ
          if (!isExpanded) {
            summaryBtn.setAttribute('aria-expanded', 'true');
            bodyEl.classList.add('open');
            bodyEl.style.maxHeight = bodyEl.scrollHeight + 40 + 'px';
          }
        });
      }
    });
  }

  // Setup Share Buttons Event Handlers
  function setupShareEvents() {
    const statusEl = document.getElementById('journal-share-status');
    const shareBtns = document.querySelectorAll('[data-share]');

    shareBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-share');
        if (type === 'copy') {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).then(() => {
              showStatus('Հղումը պատճենված է։');
            }).catch(() => {
              showStatus('Հղումը պատճենված է։');
            });
          } else {
            showStatus('Հղումը պատճենված է։');
          }
        } else if (type === 'x') {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentArticle.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
        } else if (type === 'fb') {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
        } else if (type === 'pin') {
          window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(currentArticle.title)}`, '_blank');
        }
      });
    });

    function showStatus(msg) {
      if (statusEl) {
        statusEl.textContent = msg;
        setTimeout(() => {
          statusEl.textContent = '';
        }, 2600);
      }
    }
  }

  // Setup IntersectionObserver for Table of Contents Scroll Highlight
  function setupTocScrollObserver() {
    const headings = document.querySelectorAll('.journal-post-body h2');
    const tocLinks = document.querySelectorAll('.journal-toc-link');

    if (!headings.length || !tocLinks.length || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(link => {
            if (link.getAttribute('data-toc-id') === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-100px 0px -50% 0px',
      threshold: 0.1
    });

    headings.forEach(h => observer.observe(h));
  }

  // Utility to escape HTML strings
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // DOM Content Loaded Handler
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }

})();

const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'shop.html',
  'journal.html',
  'journal-post.html',
  'product.html',
  'services.html',
  'contact.html',
  'account.html',
  'cart.html',
  'checkout.html',
  'shipping.html',
  'terms.html'
];

const mobileUtilsHtml = `      <div class="mobile-nav-utils">
        <a href="account.html" class="mobile-nav-util-btn" aria-label="Իմ հաշիվը">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Հաշիվ</span>
        </a>
        <a href="cart.html" class="mobile-nav-util-btn" aria-label="Զամբյուղ">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span>Զամբյուղ (<span data-cart-count>0</span>)</span>
        </a>
      </div>`;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace each <nav class="nav" ...> ... </nav> block that doesn't already have mobile-nav-utils
  content = content.replace(/(<nav\s+class="nav"[^>]*>)([\s\S]*?)(<\/nav>)/g, (match, openTag, inner, closeTag) => {
    if (inner.includes('mobile-nav-utils')) {
      return match;
    }
    const cleanInner = inner.trimEnd();
    return `${openTag}\n${cleanInner}\n${mobileUtilsHtml}\n    ${closeTag}`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});

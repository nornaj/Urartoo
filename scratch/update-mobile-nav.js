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

const mobileLinksHtml = `      <a href="account.html" class="nav-link mobile-only-nav-link">Հաշիվ</a>
      <a href="cart.html" class="nav-link mobile-only-nav-link">Զամբյուղ (<span data-cart-count>0</span>)</a>`;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // First remove any existing mobile-nav-utils block
  content = content.replace(/\s*<div class="mobile-nav-utils">[\s\S]*?<\/div>/g, '');
  // Remove any previously added mobile-only-nav-link to avoid duplication
  content = content.replace(/\s*<a href="account\.html" class="nav-link mobile-only-nav-link">[\s\S]*?<\/a>/g, '');
  content = content.replace(/\s*<a href="cart\.html" class="nav-link mobile-only-nav-link">[\s\S]*?<\/a>/g, '');

  // Add mobile-only-nav-link items before </nav>
  content = content.replace(/(<nav\s+class="nav"[^>]*>)([\s\S]*?)(<\/nav>)/g, (match, openTag, inner, closeTag) => {
    const cleanInner = inner.trimEnd();
    return `${openTag}\n${cleanInner}\n${mobileLinksHtml}\n    ${closeTag}`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Google Font Tag Replacement
const googleFontOldRegex = /<link\s+rel=["']preload["']\s+as=["']style["']\s+href=["']https:\/\/fonts\.googleapis\.com\/css2\?family=Cormorant[^"']+["']\s*>\s*<link\s+rel=["']stylesheet["']\s+href=["']https:\/\/fonts\.googleapis\.com\/css2\?family=Cormorant[^"']+["'][^>]*>\s*<noscript>\s*<link\s+rel=["']stylesheet["']\s+href=["']https:\/\/fonts\.googleapis\.com\/css2\?family=Cormorant[^"']+["']\s*>\s*<\/noscript>/gis;

const newGoogleFontTags = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Noto+Sans+Armenian:wght@300;400;500;600;700&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Noto+Sans+Armenian:wght@300;400;500;600;700&display=swap" media="print" onload="this.media='all'">
  <noscript>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Noto+Sans+Armenian:wght@300;400;500;600;700&display=swap">
  </noscript>`;

// HTML files list
const htmlFiles = [
  'index.html',
  'shop.html',
  'product.html',
  'services.html',
  'contact.html',
  'journal.html',
  'journal-post.html',
  'shipping.html',
  'terms.html',
  'cart.html',
  'checkout.html',
  'account.html'
];

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Replace Google fonts
    html = html.replace(/https:\/\/fonts\.googleapis\.com\/css2\?family=Cormorant[^"'\s]+/g, 'https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Noto+Sans+Armenian:wght@300;400;500;600;700&display=swap');

    // Clean any inline Cormorant / Noto Serif Armenian styles
    html = html.replace(/font-family:\s*Cormorant[^;"']*/gi, "font-family: 'Instrument Sans', 'Noto Sans Armenian', sans-serif");
    html = html.replace(/font-family:\s*['"]Cormorant['"][^;"']*/gi, "font-family: 'Instrument Sans', 'Noto Sans Armenian', sans-serif");
    html = html.replace(/font-family:\s*var\(--mono\)/gi, "font-family: 'Instrument Sans', 'Noto Sans Armenian', sans-serif");
    html = html.replace(/font-family:\s*var\(--font-serif\)/gi, "font-family: 'Instrument Sans', 'Noto Sans Armenian', sans-serif");

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated HTML font settings in ${file}`);
  }
});

// 2. Update styles.css
const cssPath = path.join(rootDir, 'styles.css');
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');

  // Update root font variables
  css = css.replace(/--font:\s*[^;]+;/g, "--font: 'Instrument Sans', 'Noto Sans Armenian', sans-serif;");
  css = css.replace(/--font-serif:\s*[^;]+;/g, "--font-serif: 'Instrument Sans', 'Noto Sans Armenian', sans-serif;");
  css = css.replace(/--mono:\s*[^;]+;/g, "--mono: 'Instrument Sans', 'Noto Sans Armenian', sans-serif;");

  // Global override ensuring all elements use Instrument Sans
  if (!css.includes('/* === GLOBAL INSTRUMENT SANS ENFORCEMENT === */')) {
    const globalEnforce = `
/* === GLOBAL INSTRUMENT SANS ENFORCEMENT === */
html, body, *, *::before, *::after,
h1, h2, h3, h4, h5, h6, p, a, span, button, input, select, textarea, label, div, td, th {
  font-family: 'Instrument Sans', 'Noto Sans Armenian', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}
`;
    css = css + '\n' + globalEnforce;
  }

  // Replace any hardcoded Cormorant or serif or monospace in CSS
  css = css.replace(/font-family:\s*Cormorant,\s*serif;/gi, "font-family: 'Instrument Sans', 'Noto Sans Armenian', sans-serif;");
  css = css.replace(/font-family:\s*['"]Cormorant['"][^;]*;/gi, "font-family: 'Instrument Sans', 'Noto Sans Armenian', sans-serif;");
  css = css.replace(/font-family:\s*var\(--font-serif,\s*Cormorant,\s*serif\);/gi, "font-family: 'Instrument Sans', 'Noto Sans Armenian', sans-serif;");

  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Updated styles.css with universal Instrument Sans');
}

// 3. Update JS files (journal-post.js, admin.js, etc.)
const jsFiles = ['journal-post.js', 'admin.js', 'script.js', 'journal.js'];
jsFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    let js = fs.readFileSync(filePath, 'utf8');
    js = js.replace(/font-family:\s*var\(--font-serif,\s*Cormorant,\s*serif\)/gi, "font-family:var(--font, 'Instrument Sans', 'Noto Sans Armenian', sans-serif)");
    js = js.replace(/font-family:\s*var\(--mono,\s*monospace\)/gi, "font-family:var(--font, 'Instrument Sans', 'Noto Sans Armenian', sans-serif)");
    js = js.replace(/font-family:\s*Cormorant,\s*serif/gi, "font-family:'Instrument Sans', 'Noto Sans Armenian', sans-serif");
    fs.writeFileSync(filePath, js, 'utf8');
    console.log(`Updated JS font references in ${file}`);
  }
});

console.log('Finished updating entire website font to Instrument Sans.');

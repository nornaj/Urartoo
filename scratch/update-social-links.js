const fs = require('fs');
const path = require('path');

const instagramUrl = 'https://www.instagram.com/minerals_arm/';
const facebookUrl = 'https://www.facebook.com/profile.php?id=61572245696433&rdid=y6CZ9Z4J7FzBr6xS&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19ePnikBFE%2F%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio#';

const files = [
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

let updatedCount = 0;

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace Instagram
    content = content.replace(/href="https:\/\/instagram\.com"/g, `href="${instagramUrl}"`);
    content = content.replace(/href="https:\/\/www\.instagram\.com(?!\/minerals_arm)"/g, `href="${instagramUrl}"`);
    
    // Replace Facebook
    content = content.replace(/href="https:\/\/facebook\.com"/g, `href="${facebookUrl}"`);
    content = content.replace(/href="https:\/\/www\.facebook\.com(?!\/profile\.php\?id=61572245696433)"/g, `href="${facebookUrl}"`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated social links in ${file}`);
    updatedCount++;
  }
}

console.log(`Successfully updated ${updatedCount} files with new social links.`);

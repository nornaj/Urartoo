const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimize() {
  const imgDir = path.join(__dirname, '..', 'Images');

  console.log('--- Optimizing Images with sharp ---');

  // 1. Urartoo Logo (Currently 2048x868, 104KB -> Resize to 480px width)
  const logoPath = path.join(imgDir, 'Urartoo-Logo.webp');
  if (fs.existsSync(logoPath)) {
    const inputBuf = fs.readFileSync(logoPath);
    const origSize = inputBuf.length;
    const buf = await sharp(inputBuf)
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 90, alphaQuality: 90 })
      .toBuffer();
    fs.writeFileSync(logoPath, buf);
    console.log(`Logo: ${(origSize/1024).toFixed(1)}KB -> ${(buf.length/1024).toFixed(1)}KB`);
  }

  // 2. Category & Product Images (Resize to 720px width, quality 82)
  const categoryImages = [
    'bracelet.webp',
    'earring.webp',
    'ring.webp',
    'necklace.webp',
    'product-card.webp'
  ];

  for (const name of categoryImages) {
    const p = path.join(imgDir, name);
    if (fs.existsSync(p)) {
      const inputBuf = fs.readFileSync(p);
      const origSize = inputBuf.length;
      const buf = await sharp(inputBuf)
        .resize({ width: 720, withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toBuffer();
      fs.writeFileSync(p, buf);
      console.log(`${name}: ${(origSize/1024).toFixed(1)}KB -> ${(buf.length/1024).toFixed(1)}KB`);
    }
  }

  // 3. Favicon (Currently 214KB -> 128x128 PNG)
  const favPath = path.join(imgDir, 'Favicon.png');
  if (fs.existsSync(favPath)) {
    const inputBuf = fs.readFileSync(favPath);
    const origSize = inputBuf.length;
    const buf = await sharp(inputBuf)
      .resize({ width: 128, height: 128, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(favPath, buf);
    console.log(`Favicon: ${(origSize/1024).toFixed(1)}KB -> ${(buf.length/1024).toFixed(1)}KB`);
  }

  console.log('--- All images optimized successfully! ---');
}

optimize().catch(console.error);

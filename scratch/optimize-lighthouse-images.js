const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const imgDir = path.join(__dirname, '..', 'Images');

  console.log('--- Resizing and optimizing images for Lighthouse Mobile ---');

  // 1. Logo (256px max width for retina 128x32)
  const logoPath = path.join(imgDir, 'Urartoo-Logo.webp');
  if (fs.existsSync(logoPath)) {
    const input = fs.readFileSync(logoPath);
    const buf = await sharp(input)
      .resize({ width: 256, withoutEnlargement: true })
      .webp({ quality: 90, effort: 6 })
      .toBuffer();
    fs.writeFileSync(logoPath, buf);
    console.log(`Logo: ${(input.length/1024).toFixed(1)}KB -> ${(buf.length/1024).toFixed(1)}KB`);
  }

  // 2. Stone images (300x300 for retina 118x118)
  const stones = ['obsidian.webp', 'nrnaqar.webp', 'piryuz.webp', 'haspis.webp'];
  for (const s of stones) {
    const p = path.join(imgDir, s);
    if (fs.existsSync(p)) {
      const input = fs.readFileSync(p);
      const buf = await sharp(input)
        .resize({ width: 300, height: 300, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 90, effort: 6 })
        .toBuffer();
      fs.writeFileSync(p, buf);
      console.log(`${s}: ${(input.length/1024).toFixed(1)}KB -> ${(buf.length/1024).toFixed(1)}KB`);
    }
  }

  // 3. Category images (500px width for retina 352x528)
  const categories = ['ring.webp', 'necklace.webp', 'earring.webp', 'bracelet.webp', 'product-card.webp'];
  for (const c of categories) {
    const p = path.join(imgDir, c);
    if (fs.existsSync(p)) {
      const input = fs.readFileSync(p);
      const buf = await sharp(input)
        .resize({ width: 500, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toBuffer();
      fs.writeFileSync(p, buf);
      console.log(`${c}: ${(input.length/1024).toFixed(1)}KB -> ${(buf.length/1024).toFixed(1)}KB`);
    }
  }

  console.log('--- Finished optimizing images! ---');
}

optimizeImages().catch(console.error);

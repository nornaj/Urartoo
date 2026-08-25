const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processAllStones() {
  const imgDir = path.join(__dirname, '..', 'Images');
  const stones = [
    { src: 'Obsidian.png', webp: 'obsidian.webp' },
    { src: 'Nrnaqar.png', webp: 'nrnaqar.webp' },
    { src: 'Piryuz.png', webp: 'piryuz.webp' },
    { src: 'Haspis.png', webp: 'haspis.webp' }
  ];

  for (const s of stones) {
    const srcPath = path.join(imgDir, s.src);
    if (fs.existsSync(srcPath)) {
      const buf = fs.readFileSync(srcPath);
      // High quality WebP (at least 90% quality, under 200kb)
      const webpBuf = await sharp(buf)
        .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 92, effort: 6, alphaQuality: 95 })
        .toBuffer();
      
      const webpPath = path.join(imgDir, s.webp);
      fs.writeFileSync(webpPath, webpBuf);
      console.log(`Saved ${s.webp}: ${(webpBuf.length / 1024).toFixed(1)} KB (Quality 92%, < 200KB)`);
    }
  }
}

processAllStones().catch(console.error);

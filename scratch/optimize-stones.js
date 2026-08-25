const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processStones() {
  const imgDir = path.join(__dirname, '..', 'Images');
  const stones = [
    { src: 'Nrnaqar.png', webp: 'nrnaqar.webp' },
    { src: 'Piryuz.png', webp: 'piryuz.webp' },
    { src: 'Obsidian.png', webp: 'obsidian.webp' }
  ];

  for (const s of stones) {
    const srcPath = path.join(imgDir, s.src);
    if (fs.existsSync(srcPath)) {
      const buf = fs.readFileSync(srcPath);
      console.log(`Processing ${s.src} (${(buf.length / 1024 / 1024).toFixed(2)} MB)...`);
      
      // 1. Create optimized WebP version (max 800px)
      const webpBuf = await sharp(buf)
        .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toBuffer();
      
      const webpPath = path.join(imgDir, s.webp);
      fs.writeFileSync(webpPath, webpBuf);
      console.log(`Saved ${s.webp}: ${(webpBuf.length / 1024).toFixed(1)} KB`);

      // 2. Compress the original PNG in place to reasonable size (< 300KB)
      const pngBuf = await sharp(buf)
        .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
        .png({ compressionLevel: 9, quality: 80 })
        .toBuffer();
      fs.writeFileSync(srcPath, pngBuf);
      console.log(`Compressed ${s.src}: ${(pngBuf.length / 1024).toFixed(1)} KB`);
    }
  }
}

processStones().catch(console.error);

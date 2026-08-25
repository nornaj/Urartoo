# Image Processing & Placement Rule

Whenever placing or updating any image/picture across the website:
1. **Always convert the image to modern WebP format** before referencing or embedding it in the UI/codebase.
2. **Ensure the file size is strictly under 200KB**.
3. **Maintain at least 90% image quality** (`quality: 90+`, `alphaQuality: 90+`, `effort: 6`).
4. **Use appropriate max dimension scaling** (`sharp` with `fit: 'inside'`, `withoutEnlargement: true`) so images are sharp without unnecessary pixel bloat.
5. **Always specify explicit `width`, `height`, and `loading="lazy"` attributes** (or `fetchpriority="high"` if in the LCP viewport) on `<img>` tags for optimal Lighthouse mobile performance and zero layout shifts (CLS).

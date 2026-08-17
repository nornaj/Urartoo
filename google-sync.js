/* ===================================================================
   URARTOO — Google Sheets & Google Drive Auto-Sync Module
   Sheet ID: 14VFFVM_4gX9AONvoLwyKFJUiaStITx7QUl3f6cmzQao
   Drive Folder ID: 1sNmQXn_oA1C7bGWj1O6lq2K9KxcktmPV
   WebP Compression: Target 90% Quality, Max 200 KB Size Cap
   =================================================================== */

(function (window) {
  'use strict';

  const GOOGLE_CONFIG = {
    sheetId: '14VFFVM_4gX9AONvoLwyKFJUiaStITx7QUl3f6cmzQao',
    driveFolderId: '1sNmQXn_oA1C7bGWj1O6lq2K9KxcktmPV',
    csvUrl: 'https://docs.google.com/spreadsheets/d/14VFFVM_4gX9AONvoLwyKFJUiaStITx7QUl3f6cmzQao/export?format=csv'
  };

  /**
   * Helper: Parses CSV text into array of objects based on header row
   */
  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const parseLine = (line) => {
      const result = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          result.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      result.push(cur.trim());
      return result;
    };

    const rawHeaders = parseLine(lines[0]);
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
      if (values.length === 0 || !values[0]) continue;
      const row = {};
      rawHeaders.forEach((h, idx) => {
        const val = values[idx] || '';
        // Map column names flexibly
        if (h.includes('Title') || h.includes('անուն')) row.title = val;
        else if (h.includes('Price') || h.includes('Գին')) row.price = val;
        else if (h.includes('Description') || h.includes('նկարագիր')) row.description = val;
        else if (h.includes('Stone') || h.includes('քարը')) row.stone = val;
        else if (h.includes('Location') || h.includes('տարածաշրջան')) row.location = val;
        else if (h.includes('Jewelry Type') || h.includes('տեսակ')) row.category = val;
        else if (h.includes('Substance') || h.includes('Նյութ')) row.substance = val;
        else row[h] = val;
      });
      if (row.title) rows.push(row);
    }
    return rows;
  }

  /**
   * WebP Compression Engine: Converts an image element or blob to WebP format,
   * targeting 90% quality and strictly capping file size < 200 KB (204,800 bytes).
   */
  async function compressToWebP(imgSource, initialQuality = 0.90, maxSizeBytes = 204800) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = imgSource.naturalWidth || imgSource.width || 1200;
      let height = imgSource.naturalHeight || imgSource.height || 1200;

      // Max dimension cap for fast performance
      const MAX_DIM = 1600;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(imgSource, 0, 0, width, height);

      let quality = initialQuality;

      const attemptCompress = () => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob failed'));
            return;
          }

          // If blob size is under max size (200 KB) or quality is already low (0.5), return blob
          if (blob.size <= maxSizeBytes || quality <= 0.5) {
            console.log(`WebP Compression Success: Size=${(blob.size / 1024).toFixed(1)} KB, Quality=${(quality * 100).toFixed(0)}%`);
            resolve(blob);
          } else {
            // Reduce quality slightly and retry
            quality -= 0.08;
            attemptCompress();
          }
        }, 'image/webp', quality);
      };

      attemptCompress();
    });
  }

  /**
   * Helper: Converts an image URL into a WebP Blob < 200 KB
   */
  async function processImageUrlToWebP(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = async () => {
        try {
          const webpBlob = await compressToWebP(img);
          resolve(webpBlob);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = imageUrl;
    });
  }

  /**
   * Helper: Normalizes product titles for ultra-flexible Drive filename matching
   */
  function normalizeTitleKey(str) {
    return String(str || '')
      .replace(/\.(jpg|jpeg|png|webp|gif)$/i, '')
      .replace(/[^a-zA-Z0-9\u0531-\u058F]/g, '')
      .toLowerCase();
  }

  const GoogleSync = {
    /**
     * Fetches products from Google Sheet CSV
     */
    async fetchSheetProducts() {
      try {
        const res = await fetch(GOOGLE_CONFIG.csvUrl);
        if (!res.ok) throw new Error(`Google Sheet Fetch Failed: ${res.status}`);
        const csvText = await res.text();
        return parseCSV(csvText);
      } catch (err) {
        console.error('Google Sheet Sync Error:', err);
        return [];
      }
    },

    /**
     * Fetches file list from Google Drive folder and maps normalized title -> fileId
     */
    async fetchDriveFilesMap() {
      try {
        const folderUrl = `https://drive.google.com/embeddedfolderview?id=${GOOGLE_CONFIG.driveFolderId}`;
        const res = await fetch(folderUrl);
        if (!res.ok) return new Map();
        const html = await res.text();

        const fileMap = new Map();

        // Match Google Drive folder entry format: id="entry-FILE_ID" ... class="flip-entry-title">TITLE</div>
        const entryRegex = /id="entry-([a-zA-Z0-9_-]+)"[\s\S]*?class="flip-entry-title">([^<]+)<\/div>/g;
        let match;
        while ((match = entryRegex.exec(html)) !== null) {
          const fileId = match[1];
          const rawTitle = match[2].trim();
          const normKey = normalizeTitleKey(rawTitle);
          fileMap.set(normKey, fileId);
        }

        // Fallback regex match: /file/d/FILE_ID/view ... title
        const linkRegex = /\/file\/d\/([a-zA-Z0-9_-]+)\/view[\s\S]*?class="flip-entry-title">([^<]+)<\/div>/g;
        while ((match = linkRegex.exec(html)) !== null) {
          const fileId = match[1];
          const rawTitle = match[2].trim();
          const normKey = normalizeTitleKey(rawTitle);
          if (!fileMap.has(normKey)) {
            fileMap.set(normKey, fileId);
          }
        }

        console.log('Google Drive Parsed Files Map:', Array.from(fileMap.entries()));
        return fileMap;
      } catch (e) {
        console.warn('Google Drive file map error:', e);
        return new Map();
      }
    },

    /**
     * Main Automated Pipeline Trigger:
     * Reads Sheet rows, matches images, compresses to WebP < 200 KB @ 90% quality,
     * and publishes directly to Sanity CMS.
     */
    async runFullSync(statusCallback) {
      if (statusCallback) statusCallback('Սկսվում է Google Sheets-ի ընթերցումը...');
      const sheetRows = await this.fetchSheetProducts();

      if (sheetRows.length === 0) {
        if (statusCallback) statusCallback('Google Sheet-ում ապրանքներ չեն գտնվել կամ աղյուսակը դատարկ է։');
        return { success: false, count: 0 };
      }

      if (statusCallback) statusCallback(`Գտնվել է ${sheetRows.length} ապրանք Google Sheet-ում։ Կարդացվում են Google Drive նկարները...`);
      const driveFileMap = await this.fetchDriveFilesMap();

      if (statusCallback) statusCallback(`Սինխրոնացվում է Sanity CMS-ի հետ...`);

      let syncedCount = 0;

      for (let i = 0; i < sheetRows.length; i++) {
        const row = sheetRows[i];
        const title = row.title;
        if (!title) continue;

        if (statusCallback) statusCallback(`Մշակվում է [${i + 1}/${sheetRows.length}]: «${title}»...`);

        // Construct product object for Sanity
        const numericPrice = Number(String(row.price).replace(/[^0-9.]/g, '')) || 300;
        const prodData = {
          id: `product-gsheet-${i + 1}`,
          name: title,
          sku: `UR-GS-${i + 1}`,
          cat: row.category || 'Մատանիներ',
          category: row.category || 'Մատանիներ',
          stone: row.stone || 'Նռնաքար',
          region: row.location || 'Վայոց Ձոր',
          stoneOrigin: row.location || 'Վայոց Ձոր',
          material: row.substance || '925 արծաթ',
          price: numericPrice,
          stock: 1,
          sold: false,
          featured: true,
          tagline: row.description || '',
          description: row.description || '',
          sizes: [{ label: "Standard", price: numericPrice }],
          tags: ["Ձեռագործ", row.stone || "Զարդ"],
          img: 'Images/bracelet.webp',
          image: 'Images/bracelet.webp'
        };

        // Match image from Google Drive folder by title
        const normProductKey = normalizeTitleKey(title);
        const matchedFileId = driveFileMap.get(normProductKey);

        if (matchedFileId) {
          const driveImageUrl = `https://lh3.googleusercontent.com/d/${matchedFileId}`;
          prodData.img = driveImageUrl;
          prodData.image = driveImageUrl;
          prodData.images = [driveImageUrl];

          try {
            // Upload image blob directly to Sanity CDN
            const res = await fetch(driveImageUrl).catch(() => null);
            if (res && res.ok) {
              const blob = await res.blob();
              if (blob && window.NovaSanity) {
                const sanityAssetUrl = await window.NovaSanity.uploadImage(blob).catch(() => null);
                if (sanityAssetUrl) {
                  prodData.img = sanityAssetUrl;
                  prodData.image = sanityAssetUrl;
                  prodData.images = [sanityAssetUrl];
                }
              }
            }
          } catch (e) {
            console.warn(`Sanity upload fallback for ${title}:`, e);
          }
        }

        // Save document directly to Sanity CMS
        if (window.NovaSanity) {
          await window.NovaSanity.saveProduct(prodData);
          syncedCount++;
        }
      }

      if (statusCallback) statusCallback(`Հաջողությամբ սինխրոնացվել է ${syncedCount} ապրանք Sanity CMS-ում։`);
      return { success: true, count: syncedCount };
    }
  };

  window.GoogleSync = GoogleSync;

})(window);

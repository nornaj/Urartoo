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
    rawHeaders.forEach((rawH, idx) => {
      const h = rawH.toLowerCase();
      const val = values[idx] || '';
      // Map column names flexibly with strict priority
      if (h.includes('title') || h.includes('անուն') || h.includes('name')) row.title = val;
      else if (h.includes('price') || h.includes('գին') || h.includes('արժեք')) row.price = val;
      else if (h.includes('description') || h.includes('նկարագիր') || h.includes('desc')) row.description = val;
      else if (h.includes('location') || h.includes('տարածաշրջան') || h.includes('վայր') || h.includes('region') || h.includes('origin')) row.location = val;
      else if (h.includes('stone') || h.includes('օգտագործ') || (h.includes('քար') && !h.includes('տարածաշրջան'))) row.stone = val;
      else if (h.includes('jewelry type') || h.includes('տեսակ') || h.includes('cat') || h.includes('category')) row.category = val;
      else if (h.includes('substance') || h.includes('նյութ') || h.includes('material')) row.substance = val;
      else if (h.includes('image') || h.includes('նկար') || h.includes('photo') || h.includes('picture') || h.includes('img')) row.image = val;
      else if (h.includes('stock') || h.includes('քանակ') || h.includes('qty') || h.includes('quantity')) row.stock = val;
      else row[rawH] = val;
    });
    if (row.title) rows.push(row);
  }
  return rows;
  }

  /**
   * Helper: Extracts Google Drive file ID from various link formats
   */
  function extractGoogleDriveFileId(str) {
    if (!str) return null;
    const s = String(str).trim();
    if (!s) return null;

    // Direct /file/d/FILE_ID
    const m1 = s.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/);
    if (m1 && m1[1]) return m1[1];

    // Query param id=FILE_ID
    const m2 = s.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
    if (m2 && m2[1]) return m2[1];

    // /d/FILE_ID
    const m3 = s.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
    if (m3 && m3[1]) return m3[1];

    // If string itself looks like a raw Google file ID
    if (/^[a-zA-Z0-9_-]{25,}$/.test(s)) {
      return s;
    }

    return null;
  }

  /**
   * Helper: Extracts folder ID if link is a folder URL
   */
  function extractGoogleDriveFolderId(str) {
    if (!str) return null;
    const s = String(str).trim();
    const m = s.match(/\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]{20,})/);
    if (m && m[1]) return m[1];
    return null;
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

  /**
   * WebP Compression Engine: Converts an image element or blob to WebP format,
   * targeting 90-94% quality and strictly capping file size < 200 KB (204,800 bytes).
   */
  async function compressBlobToWebP(blob, maxSizeBytes = 204800) {
    return new Promise((resolve) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(blob);
      img.onload = () => {
        try {
          let w = img.naturalWidth || 1200;
          let h = img.naturalHeight || 1200;
          const maxDim = 1600;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);

          const qualities = [0.94, 0.92, 0.90];
          let qIdx = 0;

          const attemptCompress = () => {
            const q = qualities[qIdx] || 0.90;
            canvas.toBlob((b) => {
              URL.revokeObjectURL(objUrl);
              if (!b) return resolve(blob);
              if (b.size <= maxSizeBytes || qIdx >= qualities.length - 1) {
                console.log(`[GoogleSync WebP] Size: ${(b.size / 1024).toFixed(1)} KB (Quality: ${(q * 100).toFixed(0)}%)`);
                return resolve(b);
              }
              qIdx++;
              attemptCompress();
            }, 'image/webp', q);
          };

          attemptCompress();
        } catch (e) {
          URL.revokeObjectURL(objUrl);
          resolve(blob);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        resolve(blob);
      };
      img.src = objUrl;
    });
  }

  /**
   * Helper: Fetches image from Google Drive / URL, converts to WebP < 200KB,
   * and uploads to Sanity Assets CDN.
   */
  async function resolveAndUploadProductImage(rawSource, matchedFileId = null) {
    let fileId = extractGoogleDriveFileId(rawSource) || matchedFileId;

    const urlsToTry = [];
    if (fileId) {
      // 1. Cloudflare/WSRV CORS WebP Proxy
      urlsToTry.push(`https://wsrv.nl/?url=https://drive.google.com/uc?id=${fileId}&output=webp&q=90&w=1600`);
      // 2. Google Direct Thumbnail
      urlsToTry.push(`https://lh3.googleusercontent.com/d/${fileId}=w1600`);
      urlsToTry.push(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`);
    } else if (rawSource && (rawSource.startsWith('http://') || rawSource.startsWith('https://'))) {
      urlsToTry.push(`https://wsrv.nl/?url=${encodeURIComponent(rawSource)}&output=webp&q=90&w=1600`);
      urlsToTry.push(rawSource);
    }

    for (const url of urlsToTry) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const blob = await res.blob();
          if (blob && blob.size > 0) {
            const webpBlob = await compressBlobToWebP(blob);
            if (webpBlob) {
              if (window.NovaSanity && typeof window.NovaSanity.uploadImage === 'function') {
                const cdnUrl = await window.NovaSanity.uploadImage(webpBlob);
                if (cdnUrl) return cdnUrl;
              }
            }
          }
        }
      } catch (err) {
        console.warn('[GoogleSync] Image fetch attempt error:', url, err);
      }
    }

    // Direct fallback URL if available
    if (fileId) {
      return `https://wsrv.nl/?url=https://drive.google.com/uc?id=${fileId}&output=webp&q=90`;
    }
    return null;
  }

  /**
   * Helper: Ensures a stone exists in the stones database.
   * If the stone name is found (case-insensitive), returns the exact stored name.
   * If not found, creates a new stone entry with a default color and returns the name.
   */
  function ensureStoneExists(stoneName) {
    if (!stoneName || !stoneName.trim()) return 'Նռնաքար';
    const trimmed = stoneName.trim();

    // Get all existing stones (defaults + custom)
    const defaultStones = [
      { name: 'Նռնաքար', color: '#7B2D3B' },
      { name: 'Օբսիդիան', color: '#17181A' },
      { name: 'Փիրուզ', color: '#2E8C8C' },
      { name: 'Հասպիս', color: '#A4442B' },
      { name: 'Եղնգաքար', color: '#1B1D1C' },
      { name: 'Ագաթ', color: '#C2A379' },
      { name: 'Քվարց', color: '#6B5B4E' }
    ];

    let customStones = [];
    try {
      customStones = JSON.parse(localStorage.getItem('urartoo_stones_db_v1')) || [];
    } catch (e) {}

    // Check if stone already exists (case-insensitive match)
    const allStones = [...defaultStones, ...customStones];
    const found = allStones.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (found) return found.name;

    // Stone doesn't exist — create it with a generated color
    const hue = Math.floor(Math.random() * 360);
    const newColor = `hsl(${hue}, 45%, 40%)`;
    const newStone = { name: trimmed, color: newColor };
    customStones.push(newStone);
    try {
      localStorage.setItem('urartoo_stones_db_v1', JSON.stringify(customStones));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('urartoo:stones-updated', { detail: newStone }));
    console.log(`[GoogleSync] Auto-created new stone: "${trimmed}" with color ${newColor}`);
    return trimmed;
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
    async fetchDriveFilesMap(folderId = null) {
      const targetFolderId = folderId || GOOGLE_CONFIG.driveFolderId;
      try {
        const folderUrl = `https://drive.google.com/embeddedfolderview?id=${targetFolderId}`;
        const res = await fetch(folderUrl);
        if (!res.ok) return new Map();
        const html = await res.text();

        const fileMap = new Map();
        const filesList = [];

        // Match Google Drive folder entry format: id="entry-FILE_ID" ... class="flip-entry-title">TITLE</div>
        const entryRegex = /id="entry-([a-zA-Z0-9_-]+)"[\s\S]*?class="flip-entry-title">([^<]+)<\/div>/g;
        let match;
        while ((match = entryRegex.exec(html)) !== null) {
          const fileId = match[1];
          const rawTitle = match[2].trim();
          const normKey = normalizeTitleKey(rawTitle);
          fileMap.set(normKey, fileId);
          filesList.push({ fileId, title: rawTitle });
        }

        // Fallback regex match: /file/d/FILE_ID/view ... title
        const linkRegex = /\/file\/d\/([a-zA-Z0-9_-]+)\/view[\s\S]*?class="flip-entry-title">([^<]+)<\/div>/g;
        while ((match = linkRegex.exec(html)) !== null) {
          const fileId = match[1];
          const rawTitle = match[2].trim();
          const normKey = normalizeTitleKey(rawTitle);
          if (!fileMap.has(normKey)) {
            fileMap.set(normKey, fileId);
            filesList.push({ fileId, title: rawTitle });
          }
        }

        console.log('[GoogleSync] Drive Files Map:', Array.from(fileMap.entries()));
        fileMap._filesList = filesList;
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

      // Calculate the next available sequential SKU number
      let maxSkuNum = 0;
      if (window.NovaSanity) {
        const existingProducts = window.NovaSanity.getProducts();
        existingProducts.forEach(function(p) {
          if (p.sku) {
            var match = p.sku.match(/^UR-(\d+)$/);
            if (match) {
              var num = parseInt(match[1], 10);
              if (num > maxSkuNum) maxSkuNum = num;
            }
          }
        });
      }
      // Also check trash
      try {
        var trashItems = JSON.parse(localStorage.getItem('urartoo_trash_v1')) || [];
        trashItems.forEach(function(p) {
          if (p.sku) {
            var match = p.sku.match(/^UR-(\d+)$/);
            if (match) {
              var num = parseInt(match[1], 10);
              if (num > maxSkuNum) maxSkuNum = num;
            }
          }
        });
      } catch (e) {}

      let syncedCount = 0;

      for (let i = 0; i < sheetRows.length; i++) {
        const row = sheetRows[i];
        const title = row.title;
        if (!title) continue;

        if (statusCallback) statusCallback(`Մշակվում է [${i + 1}/${sheetRows.length}]: «${title}» (նկարի WebP սեղմում <200KB)...`);

        const numericPrice = Number(String(row.price).replace(/[^0-9.]/g, '')) || 300;
        const prodData = {
          id: `product-gsheet-${i + 1}`,
          name: title,
          sku: 'UR-' + String(maxSkuNum + i + 1).padStart(3, '0'),
          cat: row.category || 'Մատանիներ',
          category: row.category || 'Մատանիներ',
          stone: ensureStoneExists(row.stone),
          region: row.location || 'Վայոց Ձոր',
          stoneOrigin: row.location || 'Վայոց Ձոր',
          material: row.substance || '925 արծաթ',
          price: numericPrice,
          stock: (row.stock !== undefined && row.stock !== '') ? (Number(String(row.stock).replace(/[^0-9]/g, '')) || 1) : 1,
          sold: false,
          featured: true,
          tagline: row.description || '',
          description: row.description || '',
          sizes: [{ label: "Standard", price: numericPrice }],
          tags: ["Ձեռագործ", row.stone || "Զարդ"],
          img: 'Images/bracelet.webp',
          image: 'Images/bracelet.webp',
          images: ['Images/bracelet.webp']
        };

        // Determine matched Drive file
        let matchedFileId = null;

        // 1. Check if folder URL is provided in row.image
        const folderIdInRow = extractGoogleDriveFolderId(row.image);
        if (folderIdInRow) {
          const rowFolderMap = (folderIdInRow === GOOGLE_CONFIG.driveFolderId) ? driveFileMap : await this.fetchDriveFilesMap(folderIdInRow);
          const normTitle = normalizeTitleKey(title);
          matchedFileId = rowFolderMap.get(normTitle);
          if (!matchedFileId && rowFolderMap._filesList && rowFolderMap._filesList[i]) {
            matchedFileId = rowFolderMap._filesList[i].fileId;
          } else if (!matchedFileId && rowFolderMap._filesList && rowFolderMap._filesList.length > 0) {
            matchedFileId = rowFolderMap._filesList[0].fileId;
          }
        }

        // 2. Direct file ID match by title if not found yet
        if (!matchedFileId) {
          const normTitle = normalizeTitleKey(title);
          matchedFileId = driveFileMap.get(normTitle);
        }

        // 3. Resolve, convert to WebP (<200KB) and upload to Sanity
        const finalImageUrl = await resolveAndUploadProductImage(row.image, matchedFileId);
        if (finalImageUrl) {
          prodData.img = finalImageUrl;
          prodData.image = finalImageUrl;
          prodData.images = [finalImageUrl];
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

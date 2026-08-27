const SANITY_CONFIG = {
  projectId: 'g1vi85kp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud'
};

async function inspectAndCleanProducts() {
  const query = encodeURIComponent(`*[_type == "product"]{ _id, id, name, sku, image, img }`);
  const url = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${query}`;

  const res = await fetch(url);
  const data = await res.json();
  console.log('Sanity Current Products:', data.result);

  // Find duplicates or junk gsheet products
  const goldRingUrl = 'https://cdn.sanity.io/images/g1vi85kp/production/d3e6831bbb961afbd65d58188c93895ef922fb4c-1600x1600.webp';

  const mutations = [];
  data.result.forEach(p => {
    if (p._id.startsWith('product-gsheet-')) {
      // Ensure it has the gold ring image
      mutations.push({
        patch: {
          id: p._id,
          set: {
            image: goldRingUrl,
            img: goldRingUrl,
            images: [goldRingUrl]
          }
        }
      });
    }
  });

  if (mutations.length > 0) {
    const mutateUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/mutate/${SANITY_CONFIG.dataset}`;
    const mRes = await fetch(mutateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SANITY_CONFIG.token
      },
      body: JSON.stringify({ mutations })
    });
    console.log('Patch result:', await mRes.json());
  }
}

inspectAndCleanProducts();

const SANITY_CONFIG = {
  projectId: 'g1vi85kp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud'
};

const BASE_URL = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data`;

async function testQuery() {
  const productsGroq = `*[_type == "product"]{
    _id, id, name, brand, sku, category, stone, stoneOrigin, material, price, stock, sold, featured, tagline, description, sizes, tags, image, images
  }`;
  
  const encodedQuery = encodeURIComponent(productsGroq);
  const url = `${BASE_URL}/query/${SANITY_CONFIG.dataset}?query=${encodedQuery}`;
  
  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${SANITY_CONFIG.token}` }
    });
    console.log('Query HTTP Status:', res.status);
    const data = await res.json();
    console.log('Query result count:', (data.result || []).length);
    console.log('Query items:', JSON.stringify(data.result, null, 2));
  } catch (err) {
    console.error('Query error:', err);
  }
}

testQuery();

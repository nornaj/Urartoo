const SANITY_CONFIG = {
  projectId: 'g1vi85kp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud'
};

async function fixSanityImages() {
  const cdnUrl = 'https://cdn.sanity.io/images/g1vi85kp/production/d3e6831bbb961afbd65d58188c93895ef922fb4c-1600x1600.webp';
  const mutateUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/mutate/${SANITY_CONFIG.dataset}`;

  const res = await fetch(mutateUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SANITY_CONFIG.token
    },
    body: JSON.stringify({
      mutations: [
        {
          patch: {
            id: 'product-gsheet-1',
            set: {
              image: cdnUrl,
              images: [cdnUrl],
              img: cdnUrl
            }
          }
        },
        {
          patch: {
            id: 'product-gsheet-2',
            set: {
              image: cdnUrl,
              images: [cdnUrl],
              img: cdnUrl
            }
          }
        },
        {
          patch: {
            id: 'product-gsheet-3',
            set: {
              image: cdnUrl,
              images: [cdnUrl],
              img: cdnUrl
            }
          }
        }
      ]
    })
  });

  const data = await res.json();
  console.log('Patched Sanity:', data);
}

fixSanityImages();

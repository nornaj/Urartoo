const SANITY_CONFIG = {
  projectId: 'g1vi85kp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud'
};

async function uploadRingToSanity() {
  const fileId = '1GgkU65HaKK_V-RBdRAhbYV3b8eWuu6Iw'; // The gold ring uploaded to Drive
  const imgUrl = `https://wsrv.nl/?url=https://drive.google.com/uc?id=${fileId}&output=webp&q=94&w=1600`;

  const res = await fetch(imgUrl);
  console.log('Fetched gold ring status:', res.status);
  const buf = Buffer.from(await res.arrayBuffer());

  const uploadUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/assets/images/${SANITY_CONFIG.dataset}`;
  const upRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'image/webp',
      'Authorization': 'Bearer ' + SANITY_CONFIG.token
    },
    body: buf
  });
  const upData = await upRes.json();
  const cdnUrl = upData.document.url;
  console.log('Uploaded Gold Ring to Sanity CDN:', cdnUrl);

  const mutateUrl = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/mutate/${SANITY_CONFIG.dataset}`;
  const mutRes = await fetch(mutateUrl, {
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
              stone: 'Hello World',
              stoneOrigin: 'Vanadzor',
              region: 'Vanadzor'
            }
          }
        },
        {
          patch: {
            id: 'product-gsheet-2',
            set: {
              image: cdnUrl,
              images: [cdnUrl],
              stone: 'Hello World',
              stoneOrigin: 'Vanadzor',
              region: 'Vanadzor'
            }
          }
        },
        {
          patch: {
            id: 'product-gsheet-3',
            set: {
              image: cdnUrl,
              images: [cdnUrl],
              stone: 'Hello World',
              stoneOrigin: 'Vanadzor',
              region: 'Vanadzor'
            }
          }
        }
      ]
    })
  });

  const mutData = await mutRes.json();
  console.log('Mutated products result:', JSON.stringify(mutData));
}

uploadRingToSanity();

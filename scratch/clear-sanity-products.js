const token = 'sknNBnm3TWuTaSZw1TnVkytJGAZT2dTrDMKqVypR4SeaHcq71pMhBnZulwLmjC12rmwe1xMYFIt8t78BcXkmueG1HFwVIzACwXOc4qEq3y0fEHcegdVZCUeCqo9QDZbCzfmprbB4SQQkfWV3Gx4Xdz1ZkEcq0hXpjwnYLO6TPLMuS7c2wsud';
const projectId = 'g1vi85kp';
const dataset = 'production';

async function clearSanityProducts() {
  const queryUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent('*[_type == "product"]{_id}')}`;
  const res = await fetch(queryUrl);
  const data = await res.json();
  console.log('Current Sanity products count:', data.result ? data.result.length : 0);

  if (data.result && data.result.length > 0) {
    const mutations = data.result.map(doc => ({ delete: { id: doc._id } }));
    const mutateUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;
    const mutateRes = await fetch(mutateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ mutations })
    });
    console.log('Delete result status:', mutateRes.status);
    const resultText = await mutateRes.text();
    console.log('Delete result text:', resultText);
  }
}

clearSanityProducts();

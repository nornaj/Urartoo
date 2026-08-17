const https = require('https');

const fileId = '1dS8ngi4R4JChqow9eiFAYN1m7q1T7rcc';

function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`URL: ${url}`);
      console.log('Status Code:', res.statusCode);
      console.log('Location:', res.headers.location);
      console.log('Content-Type:', res.headers['content-type']);
      console.log('Content-Length:', res.headers['content-length']);
      console.log('---');
      resolve();
    }).on('error', (err) => {
      console.error(url, err);
      resolve();
    });
  });
}

async function run() {
  await testUrl(`https://lh3.googleusercontent.com/d/${fileId}`);
  await testUrl(`https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`);
  await testUrl(`https://drive.google.com/uc?export=view&id=${fileId}`);
}

run();

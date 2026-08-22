const fs = require('fs');

const text = fs.readFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\unpacked_single_blog.html', 'utf8');

const match = text.match(/data-props="([\s\S]*?)"/);
if (match) {
  const decoded = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  fs.writeFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\props_data.json', decoded);
  console.log('Saved props_data.json length:', decoded.length);
  try {
    const parsed = JSON.parse(decoded);
    console.log('Keys in preview:', Object.keys(parsed.$preview || {}));
  } catch (e) {
    console.error('JSON parse error:', e.message);
  }
} else {
  console.log('No data-props attribute found');
}

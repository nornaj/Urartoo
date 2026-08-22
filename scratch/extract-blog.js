const fs = require('fs');
const zlib = require('zlib');

const fileContent = fs.readFileSync('C:\\Users\\najar\\Downloads\\Single Blog (standalone).html', 'utf8');

// Find manifest script content
const manifestMatch = fileContent.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
const templateMatch = fileContent.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);

if (!manifestMatch || !templateMatch) {
  console.error('Manifest or template not found');
  process.exit(1);
}

const manifest = JSON.parse(manifestMatch[1]);
let template = JSON.parse(templateMatch[1]);

console.log('Manifest keys count:', Object.keys(manifest).length);

// Unpack assets
const blobUrls = {};
const pageTexts = {};

for (const uuid of Object.keys(manifest)) {
  const entry = manifest[uuid];
  let bytes = Buffer.from(entry.data, 'base64');
  if (entry.compressed) {
    bytes = zlib.gunzipSync(bytes);
  }
  const text = bytes.toString('utf8');
  if (text.includes('<html') || text.includes('<div') || text.includes('<!DOCTYPE')) {
    pageTexts[uuid] = text;
  }
}

console.log('Extracted page texts count:', Object.keys(pageTexts).length);

// Replace uuids in template
for (const uuid of Object.keys(manifest)) {
  if (pageTexts[uuid]) {
    fs.writeFileSync(`C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\page_${uuid}.html`, pageTexts[uuid]);
    console.log(`Saved page_${uuid}.html`);
  }
  const entry = manifest[uuid];
  let bytes = Buffer.from(entry.data, 'base64');
  if (entry.compressed) {
    bytes = zlib.gunzipSync(bytes);
  }
  const dataUrl = `data:${entry.mime};base64,${bytes.toString('base64')}`;
  template = template.split(uuid).join(dataUrl);
}

fs.writeFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\unpacked_single_blog.html', template);
console.log('Saved unpacked_single_blog.html');

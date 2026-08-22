const fs = require('fs');

const html = fs.readFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\unpacked_single_blog.html', 'utf8');

// Search for <x-dc or template or body contents
const xdcMatch = html.match(/<x-dc[\s\S]*?<\/x-dc>/);
if (xdcMatch) {
  fs.writeFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\xdc_content.html', xdcMatch[0]);
  console.log('Saved xdc_content.html length:', xdcMatch[0].length);
} else {
  console.log('No <x-dc> tag found');
}

// Check for other script tags with template data
const scripts = [];
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  if (match[0].includes('data-props') || match[0].includes('sc-') || match[0].length > 500) {
    scripts.push(match[0].slice(0, 300));
  }
}
console.log('Matching scripts count:', scripts.length);
scripts.forEach((s, i) => console.log(`Script ${i}:`, s));

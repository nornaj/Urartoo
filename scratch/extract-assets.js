const fs = require('fs');

const xdc = fs.readFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\xdc_content.html', 'utf8');

// Find all script tags
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let i = 0;
while ((m = scriptRegex.exec(xdc)) !== null) {
  console.log(`Script ${i} attributes:`, m[0].match(/<script\b[^>]*>/)[0]);
  fs.writeFileSync(`C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\extracted_script_${i}.txt`, m[1]);
  i++;
}

// Extract styles
const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
let sIndex = 0;
while ((m = styleRegex.exec(xdc)) !== null) {
  fs.writeFileSync(`C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\extracted_style_${sIndex}.css`, m[1]);
  sIndex++;
}
console.log(`Extracted ${sIndex} styles`);

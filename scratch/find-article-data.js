const fs = require('fs');

const text = fs.readFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\unpacked_single_blog.html', 'utf8');

const scripts = [];
const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
while ((m = re.exec(text)) !== null) {
  if (m[1].includes('body = [') || m[1].includes('blocks =') || m[1].includes('Gutanasar')) {
    scripts.push(m[1]);
  }
}

console.log('Found scripts:', scripts.length);
if (scripts.length > 0) {
  fs.writeFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\article_data_js.js', scripts[0]);
  console.log('Saved article_data_js.js length:', scripts[0].length);
}

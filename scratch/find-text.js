const fs = require('fs');

const text = fs.readFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\unpacked_single_blog.html', 'utf8');

const idx = text.indexOf('Three days on a volcano');
console.log('Index of text:', idx);
if (idx !== -1) {
  console.log('Snippet:', text.slice(idx - 200, idx + 2000));
}

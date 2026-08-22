const fs = require('fs');

const html = fs.readFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\xdc_content.html', 'utf8');

const match = html.match(/<script type="text\/x-dc"[\s\S]*?>([\s\S]*?)<\/script>/);
if (match) {
  fs.writeFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\blog_logic.js', match[1]);
  console.log('Saved blog_logic.js length:', match[1].length);
} else {
  console.log('No x-dc script found');
}

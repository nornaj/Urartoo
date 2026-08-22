const fs = require('fs');

const xdc = fs.readFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\xdc_content.html', 'utf8');

// Parse script content inside <script type="text/x-dc"...>
const scriptMatch = xdc.match(/<script type="text\/x-dc"[\s\S]*?>([\s\S]*?)<\/script>/);

if (scriptMatch) {
  fs.writeFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\single_blog_js.js', scriptMatch[1]);
  console.log('Saved single_blog_js.js length:', scriptMatch[1].length);
}

// Clean HTML template without script tag
const cleanHtml = xdc.replace(/<script type="text\/x-dc"[\s\S]*?<\/script>/, '');
fs.writeFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\single_blog_template.html', cleanHtml);
console.log('Saved single_blog_template.html length:', cleanHtml.length);

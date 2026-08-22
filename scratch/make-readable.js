const fs = require('fs');

const html = fs.readFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\single_blog_template.html', 'utf8');

// Strip out base64 images and large inline data to get clean readable HTML template
const clean = html.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '"[BASE64_IMAGE]"')
                  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
                  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

fs.writeFileSync('C:\\Users\\najar\\Desktop\\Social\\Urartoo\\scratch\\readable_template.html', clean);
console.log('Saved readable_template.html length:', clean.length);

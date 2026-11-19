const assert = require('node:assert/strict');
const fs = require('node:fs');

const app = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

assert(!app.includes('images.unsplash.com'), 'all photography should be served locally');
for (const file of ['mother-baby.webp', 'antenatal-care.webp', 'family-nutrition.webp', 'child-clinic.webp']) {
  assert(fs.existsSync(`assets/images/${file}`), `missing local image: ${file}`);
  assert(fs.statSync(`assets/images/${file}`).size < 700_000, `${file} should be optimized for the web`);
}
assert(css.includes('--primary: #176149'), 'template forest-green token is missing');
assert(css.includes('--bg: #f7f0e4'), 'template warm-ivory token is missing');
assert(css.includes("'DM Serif Display'"), 'editorial serif display type is missing');
assert(css.includes('--accent: #e28a5b'), 'template peach accent is missing');

console.log('Lafimora design-system checks passed.');

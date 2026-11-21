const assert = require('node:assert/strict');
const fs = require('node:fs');

const app = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

assert(!app.includes('images.unsplash.com'), 'all photography should be served locally');
// Real, openly licensed photographs from northern Nigeria — every image must exist, be web-sized and be credited.
const images = fs.readdirSync('assets/images').filter((f) => f.endsWith('.webp'));
assert(images.length >= 6, 'expected the local photo library in assets/images');
for (const file of images) {
  assert(fs.statSync(`assets/images/${file}`).size < 700_000, `${file} should be optimized for the web`);
  assert(app.includes(`"file": "${file}"`), `${file} is missing from IMAGE_CREDITS (licence attribution required)`);
}
for (const [, file] of app.matchAll(/^\s+\w+: '([\w-]+\.webp)',?$/gm)) {
  assert(images.includes(file), `IMAGES references missing file: ${file}`);
}
assert(fs.existsSync('assets/images/CREDITS.md'), 'photo credits file is missing');
assert(css.includes('--primary: #176149'), 'template forest-green token is missing');
assert(css.includes('--bg: #f7f0e4'), 'template warm-ivory token is missing');
assert(css.includes("'DM Serif Display'"), 'editorial serif display type is missing');
assert(css.includes('--accent: #e28a5b'), 'template peach accent is missing');

console.log('Lafimora design-system checks passed.');

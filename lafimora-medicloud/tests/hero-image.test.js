const assert = require('node:assert/strict');
const fs = require('node:fs');

const app = fs.readFileSync('assets/js/app.js', 'utf8');
const heroPath = 'assets/images/mother-baby-lafimora-app.png';

assert(fs.existsSync(heroPath), 'the supplied mother-and-baby hero PNG must be copied into the project');
assert(fs.statSync(heroPath).size > 100_000, 'the hero PNG should contain the full supplied illustration');
assert(app.includes('src="assets/images/mother-baby-lafimora-app.png"'), 'the home hero must use the supplied PNG');
assert(!app.includes('src="assets/images/hero-mother-phone.svg"'), 'the old unclear SVG must no longer be rendered');
assert(app.includes('width="1254" height="1254"'), 'the image dimensions should prevent layout shift');

console.log('Lafimora MediCloud hero image checks passed.');

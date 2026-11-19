const assert = require('node:assert/strict');
const fs = require('node:fs');

const app = fs.readFileSync('app.js', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const pages = ['index.html', 'about.html', 'chat.html', 'facilities.html', 'facility.html', 'topic.html', 'topics.html'];

for (const asset of ['lafimora-mark.png', 'lafimora-logo.svg']) {
  assert(fs.existsSync(`assets/brand/${asset}`), `missing Lafimora brand asset: ${asset}`);
}

assert(fs.statSync('assets/brand/lafimora-mark.png').size > 10_000, 'PNG logo should contain the full-resolution Caring Path artwork');
assert(app.includes("brandMark('brand-mark')"), 'header/footer should use the reusable Lafimora mark');
assert(app.includes("assets/brand/lafimora-mark.png"), 'platform must consistently use the PNG logo');
assert(!app.includes("brand-mark\">${icon('heart')}"), 'legacy heart logo should be removed');
assert(css.includes('.brand-symbol'), 'brand symbol sizing styles are missing');
assert(css.includes('.brand-mark { width: 36px; height: 36px; }'), 'mobile PNG mark should remain large enough to read clearly');

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  assert(html.includes('rel="icon" href="assets/brand/lafimora-mark.png"'), `${page} must use the same PNG Lafimora favicon`);
}

console.log('Lafimora brand checks passed.');

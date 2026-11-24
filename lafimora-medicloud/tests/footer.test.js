const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const appPath = path.join(__dirname, '..', 'assets', 'js', 'app.js');
const app = fs.readFileSync(appPath, 'utf8');

assert.match(
  app,
  /© 2026 Lafimora · YandyTech SolutionLab/,
  'The shared footer should credit YandyTech SolutionLab.'
);
assert.doesNotMatch(
  app,
  /MediCloud by Codescandy/,
  'The rendered footer should not include the MediCloud attribution.'
);
assert.doesNotMatch(
  app,
  /ThemeWagon/,
  'The rendered footer should not include the ThemeWagon attribution.'
);
assert.doesNotMatch(
  app,
  /<p class="mb-0"><span>\$\{L\('Pilot status:',/,
  'The rendered footer should not include the pilot-status label.'
);

console.log('Footer checks passed.');

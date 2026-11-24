const assert = require('node:assert/strict');
const fs = require('node:fs');

const app = fs.readFileSync('assets/js/app.js', 'utf8');
const sources = fs.readFileSync('assets/images/partners/SOURCES.md', 'utf8');
const logoPath = 'assets/images/partners/e-caph.svg';

assert(fs.existsSync(logoPath), 'official E-Caph SVG logo is missing');
const logo = fs.readFileSync(logoPath, 'utf8');
assert(logo.includes('#86C127') && logo.includes('#E67817') && logo.includes('#0092DF'), 'E-Caph logo must retain its official green, orange and blue colours');
assert(app.includes("logo: 'e-caph.svg'"), 'E-Caph partner record must use the official logo');
assert(sources.includes('https://www.e-caph.org/favicon.svg'), 'partner source notes must identify the official logo URL');

const solutionLabPath = 'assets/images/partners/solutionlab.png';
assert(fs.existsSync(solutionLabPath), 'the supplied SolutionLab PNG logo is missing');
assert(fs.statSync(solutionLabPath).size > 10_000, 'SolutionLab logo should contain the supplied full-resolution artwork');
assert(app.includes("logo: 'solutionlab.png'"), 'SolutionLab partner record must use the supplied logo');
assert(sources.includes('solutionlab (4).png'), 'partner source notes must identify the user-supplied SolutionLab artwork');

console.log('Partner logo checks passed.');

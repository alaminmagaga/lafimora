const assert = require('node:assert/strict');
const fs = require('node:fs');

assert(fs.existsSync('data/facilities.json'), 'HEFA snapshot is missing');
const snapshot = JSON.parse(fs.readFileSync('data/facilities.json', 'utf8'));
assert.equal(snapshot.source.name, 'Kaduna State HEFA');
assert.match(snapshot.source.url, /^https:\/\/directory\.hefa\.kdbs\.ng\//);
assert(snapshot.facilities.length >= 250, 'expected at least 250 unique Kaduna PHC/clinic records');
assert.equal(new Set(snapshot.facilities.map((f) => f.id)).size, snapshot.facilities.length, 'facility IDs must be unique');

for (const facility of snapshot.facilities) {
  assert.deepEqual(Object.keys(facility).sort(), ['address', 'hours', 'id', 'lga', 'name', 'pos', 'security', 'services', 'status', 'type', 'ward'].sort());
  assert(!JSON.stringify(facility).match(/respondent|phone|mobile/i), 'snapshot must not expose survey contact fields');
  assert(Array.isArray(facility.services));
}

const app = fs.readFileSync('app.js', 'utf8');
assert(app.includes('loadFacilityData'), 'frontend must load the HEFA snapshot');
assert(!app.includes('All facilities below are fictional examples'), 'fictional directory warning must be removed');

console.log(`Validated ${snapshot.facilities.length} privacy-safe HEFA facilities.`);

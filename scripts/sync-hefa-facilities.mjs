import fs from 'node:fs/promises';

const API = 'https://hefa-server-mrq6q.ondigitalocean.app/api/facilities/page';
const PAGE_SIZE = 100;

const FIELD = {
  type: 'Facility Details: Selection of the type of facility',
  lga: 'Geographical Details: Selection of LGA',
  ward: 'Geographical Details: Selection of Ward Name',
  residence: 'Facility Detail: 5c. Residence of Facility',
  authority: 'Facility Details: Selection of the Type of Managing Authority of health facility',
  address: 'Facility Details: Physical address of the health facility',
  days: 'Facility Details: Number of days in a week facility in routinely open',
  hours: 'Facility Details: Number of  daily working hours at the health facility (outpatient)',
  latitude: 'gps:Latitude',
  longitude: 'gps:Longitude'
};

const SERVICE_FIELDS = {
  anc: 'Services: Availability of ANC services at the facility',
  pnc: 'Services: Does facility offer Postnatal care services',
  maternal: 'Services: Does facility offer Delivery services',
  child: 'Services: Does facility offerntegrated management of child illness services',
  bf: 'Services: Does facility offer Nutrition counselling services',
  growth: 'Equipment: Availability of a functional adult weighing scale',
  nutrition: 'Services: Does facility offer Nutrition counselling services'
};

const present = (value) => /^(yes|available|functional)$/i.test(String(value || '').trim());
const first = (value) => Array.isArray(value) ? value.find(Boolean) : value;
const clean = (value) => String(first(value) || '').replace(/\s+/g, ' ').trim();

function normalize(raw) {
  const lat = Number(raw[FIELD.latitude]);
  const lon = Number(raw[FIELD.longitude]);
  const id = clean(first(raw.facility_id) || first(raw.id));
  const name = clean(raw.approved_facility_name || raw['Facility Details:Name of the health facility'] || first(raw['Facility Details: fac_new']));
  const dailyHours = clean(raw[FIELD.hours]);
  const days = clean(raw[FIELD.days]);
  const services = Object.entries(SERVICE_FIELDS).filter(([, field]) => present(raw[field])).map(([service]) => service);

  return {
    id: `hefa-${id}`,
    name,
    type: clean(raw[FIELD.type]) === 'Primary Healthcare Centre' ? 'phc' : 'hc',
    lga: clean(raw[FIELD.lga]),
    ward: clean(raw[FIELD.ward]),
    address: clean(raw[FIELD.address]),
    pos: Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null,
    services,
    hours: [dailyHours && `${dailyHours} hours daily`, days].filter(Boolean).join(' · '),
    status: clean(raw.status) || 'Status Unknown',
    security: clean(raw.security_status) || 'Unknown'
  };
}

async function getPage(offset) {
  const url = new URL(API);
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.append('facility_type', 'Primary Healthcare Centre');
  url.searchParams.append('facility_type', 'Primary Healthcare Clinic');
  url.searchParams.append('managing_authority', 'Government - Public');
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`HEFA returned HTTP ${response.status}`);
  return response.json();
}

const firstPage = await getPage(0);
const total = Number(firstPage.total || 0);
const rows = [...(firstPage.data?.data || [])];
for (let offset = PAGE_SIZE; offset < total; offset += PAGE_SIZE) {
  const page = await getPage(offset);
  rows.push(...(page.data?.data || []));
  console.log(`Fetched ${Math.min(offset + PAGE_SIZE, total)} of ${total}`);
}

const facilitiesById = new Map();
for (const row of rows) {
  const facility = normalize(row);
  if (!facility.id || facility.id === 'hefa-' || !facility.name) continue;
  const existing = facilitiesById.get(facility.id);
  if (!existing || (facility.status === 'Functional' && existing.status !== 'Functional')) facilitiesById.set(facility.id, facility);
}

const facilities = [...facilitiesById.values()].sort((a, b) => a.name.localeCompare(b.name));
const snapshot = {
  source: {
    name: 'Kaduna State HEFA',
    url: 'https://directory.hefa.kdbs.ng/',
    api: API,
    dataset: 'Kaduna State Health Facility Census / HEFA directory',
    censusYear: 2018,
    rawRecordCount: total,
    syncedAt: new Date().toISOString()
  },
  facilities
};

await fs.mkdir('data', { recursive: true });
await fs.writeFile('data/facilities.json', `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Saved ${facilities.length} unique public PHC/clinic records.`);

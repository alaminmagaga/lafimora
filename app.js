'use strict';
/* Lafimora frontend prototype.
   Structure mirrors the platform document:
   - Feature 1: AI maternal & child health and nutrition assistant (chat.html, topics)
   - Feature 2: Healthcare and nutrition service discovery (facilities.html, facility.html)
   All health text is SAMPLE content pending professional review. All facilities are fictional. */

/* ---------- Storage (safe in private mode) ---------- */
const store = {
  get(key) {
    try { return localStorage.getItem(key); } catch (e) {
      try { return sessionStorage.getItem(key); } catch (e2) { return null; }
    }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {
      try { sessionStorage.setItem(key, value); } catch (e2) { /* memory only */ }
    }
  }
};

let savedLang = store.get('lafimora-language');
let lang = savedLang === 'ha' ? 'ha' : 'en';
const page = document.body.dataset.page || 'home';
const params = new URLSearchParams(location.search);
// Shareable language links, e.g. index.html?lang=ha
if (['en', 'ha'].includes(params.get('lang'))) { lang = params.get('lang'); savedLang = lang; store.set('lafimora-language', lang); }
const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

const t = (o) => (o && typeof o === 'object') ? (o[lang] ?? o.en) : o;
const L = (en, ha) => (lang === 'ha' ? ha : en);
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Icons (inline SVG, stroke style) ---------- */
const ICONS = {
  chat: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  pin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  check: 'M20 6L9 17l-5-5',
  checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
  x: 'M18 6L6 18M6 6l12 12',
  xCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM15 9l-6 6M9 9l6 6',
  alert: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  directions: 'M3 11l19-9-9 19-2-8-8-2z',
  locate: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM22 12h-4M6 12H2M12 6V2M12 22v-4',
  book: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  menu: 'M3 12h18M3 6h18M3 18h18',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  building: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M10 10h4',
  lock: 'M5 11h14v11H5zM8 11V7a4 4 0 0 1 8 0v4',
  leaf: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
  smile: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  map: 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  thumbUp: 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3',
  thumbDown: 'M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17',
  plus: 'M12 5v14M5 12h14',
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  arrowDown: 'M12 5v14M19 12l-7 7-7-7'
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${ICONS[name] || ''}"/></svg>`;
const brandMark = (cls = '') => `<img class="brand-symbol ${cls}" src="assets/brand/lafimora-mark.png" alt="" width="256" height="256">`;

/* ---------- Images: real, openly licensed photographs from Nigeria (Wikimedia Commons) ----------
   Every file is credited in IMAGE_CREDITS below and shown on the About page, as the CC BY / CC BY-SA licences require. */
const IMAGES = {
  mother: 'mother-child-health-session-northern-nigeria.webp',
  clinic: 'clinic-consultation-northern-nigeria.webp',
  nurse: 'clinic-consultation-northern-nigeria.webp',
  care: 'child-nutrition-check-katsina.webp',
  baby: 'breastfeeding-mother-zonkwa-kaduna.webp',
  family: 'breastfeeding-mother-zonkwa-kaduna.webp',
  food: 'leafy-greens-kakuri-market-kaduna.webp',
  meal: 'tuwo-miyan-kuka-fish.webp',
  child: 'mother-child-antenatal-clinic-jigawa.webp',
  midwives: 'midwifery-students-jigawa.webp',
  community: 'fulani-mother-kolere-market.webp'
};
const IMAGE_CREDITS = [
  {"file": "mother-child-health-session-northern-nigeria.webp", "alt": "A young mother and her child at a women’s health education session in northern Nigeria", "title": "A woman attends a health education session in northern Nigeria (8406369172).jpg", "author": "DFID - UK Department for International Development", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "source": "https://commons.wikimedia.org/wiki/File:A_woman_attends_a_health_education_session_in_northern_Nigeria_(8406369172).jpg"},
  {"file": "clinic-consultation-northern-nigeria.webp", "alt": "A woman speaking with a health worker at a clinic in northern Nigeria", "title": "Women for health (7139243509).jpg", "author": "DFID - UK Department for International Development", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "source": "https://commons.wikimedia.org/wiki/File:Women_for_health_(7139243509).jpg"},
  {"file": "child-nutrition-check-katsina.webp", "alt": "A health worker measures a child’s mid-upper arm at a rural health centre in Katsina State", "title": "A child is checked for signs of malnutrition in Katsina State, Nigeria, March 2011 (8406367308).jpg", "author": "DFID - UK Department for International Development", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "source": "https://commons.wikimedia.org/wiki/File:A_child_is_checked_for_signs_of_malnutrition_in_Katsina_State,_Nigeria,_March_2011_(8406367308).jpg"},
  {"file": "breastfeeding-mother-zonkwa-kaduna.webp", "alt": "A Bajju mother breastfeeding her child at Zonkwa, Kaduna State", "title": "The universal live of a Mother- A bajju woman in colorful cultural atiyer breastfeeding her child at the Awumba 2026 edition at Zonkwa.jpg", "author": "Ryok Kundyi2912", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:The_universal_live_of_a_Mother-_A_bajju_woman_in_colorful_cultural_atiyer_breastfeeding_her_child_at_the_Awumba_2026_edition_at_Zonkwa.jpg"},
  {"file": "leafy-greens-kakuri-market-kaduna.webp", "alt": "Fresh leafy vegetables on sale at the Monday Market in Kakuri, Kaduna", "title": "Vegetables on sale at the Monday Market in Kakuri, Kaduna 05.jpg", "author": "Kambai Akau", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Vegetables_on_sale_at_the_Monday_Market_in_Kakuri,_Kaduna_05.jpg"},
  {"file": "tuwo-miyan-kuka-fish.webp", "alt": "Tuwo with miyan kuka and fried fish, a northern Nigerian meal", "title": "Tuwo with miyan kuka and fried fish.jpg", "author": "Suleiman213", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Tuwo_with_miyan_kuka_and_fried_fish.jpg"},
  {"file": "mother-child-antenatal-clinic-jigawa.webp", "alt": "A mother and her daughter at an antenatal care clinic in Jigawa State", "title": "Mother and child, ante-natal care clinic, Jigawa, Nigeria, December 2011 (8379199175).jpg", "author": "Susan Elden, health advisor, DFID Nigeria", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "source": "https://commons.wikimedia.org/wiki/File:Mother_and_child,_ante-natal_care_clinic,_Jigawa,_Nigeria,_December_2011_(8379199175).jpg"},
  {"file": "midwifery-students-jigawa.webp", "alt": "Student midwives in class at the Jigawa State School of Midwifery", "title": "Female faces (7138907111).jpg", "author": "DFID - UK Department for International Development", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "source": "https://commons.wikimedia.org/wiki/File:Female_faces_(7138907111).jpg"},
  {"file": "fulani-mother-kolere-market.webp", "alt": "A Fulani woman with a baby on her back buying a calabash at the Kolere market", "title": "A Fulani Woman buying a Calabash in the Kolere market (4).jpg", "author": "Musaddam Idriss", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:A_Fulani_Woman_buying_a_Calabash_in_the_Kolere_market_(4).jpg"}
];
const photo = (id) => `assets/images/${IMAGES[id] || id}`;
const photoAlt = (id) => (IMAGE_CREDITS.find((c) => c.file === (IMAGES[id] || id)) || {}).alt || '';

/* ---------- Services taxonomy (document §7.2B) ---------- */
const SERVICES = {
  anc: { cat: 'mch', en: 'Antenatal care', ha: 'Awon ciki' },
  pnc: { cat: 'mch', en: 'Postnatal care', ha: 'Kulawa bayan haihuwa' },
  maternal: { cat: 'mch', en: 'Maternal health consultation', ha: 'Shawarwarin lafiyar uwa' },
  child: { cat: 'mch', en: 'Infant & child healthcare', ha: 'Lafiyar jarirai da yara' },
  bf: { cat: 'nutrition', en: 'Breastfeeding counselling', ha: 'Shawarwari kan shayarwa' },
  growth: { cat: 'nutrition', en: 'Child growth monitoring', ha: 'Auna girman yara' },
  nutrition: { cat: 'nutrition', en: 'Nutrition counselling', ha: 'Shawarwari kan abinci mai gina jiki' }
};
const SERVICE_CATS = {
  mch: { en: 'Maternal & child health services', ha: 'Ayyukan lafiyar uwa da yara' },
  nutrition: { en: 'Nutrition services', ha: 'Ayyukan abinci mai gina jiki' }
};
const FACILITY_TYPES = {
  phc: { en: 'Primary health centre', ha: 'Cibiyar lafiya matakin farko' },
  hc: { en: 'Primary health clinic', ha: 'Ƙaramar cibiyar lafiya matakin farko' },
  gh: { en: 'General hospital', ha: 'Babban asibiti' },
  mch: { en: 'Maternal & child health clinic', ha: 'Asibitin uwa da yara' }
};
const LGAS = ['Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba', "Jema'a", 'Kachia', 'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kaura', 'Kauru', 'Kubau', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zangon Kataf', 'Zaria'];

/* Fictional demonstration records — not real providers. Coordinates are rough LGA-level points for the proximity demo only. */
let FACILITIES = [
  { id: 'demo-a', name: 'Sample Primary Health Centre A', type: 'phc', lga: 'Kaduna North', services: ['anc', 'maternal', 'nutrition', 'growth'], pos: [10.55, 7.44] },
  { id: 'demo-b', name: 'Sample General Hospital B', type: 'gh', lga: 'Zaria', services: ['anc', 'pnc', 'maternal', 'child', 'bf'], pos: [11.08, 7.71] },
  { id: 'demo-c', name: 'Sample Health Centre C', type: 'phc', lga: 'Chikun', services: ['growth', 'nutrition', 'child'], pos: [10.42, 7.40] },
  { id: 'demo-d', name: 'Sample Mother & Child Clinic D', type: 'mch', lga: 'Kaduna South', services: ['anc', 'pnc', 'bf', 'growth', 'nutrition', 'child'], pos: [10.48, 7.42] },
  { id: 'demo-e', name: 'Sample Primary Health Centre E', type: 'phc', lga: 'Igabi', services: ['anc', 'pnc', 'bf'], pos: [10.70, 7.35] },
  { id: 'demo-f', name: 'Sample Primary Health Centre F', type: 'phc', lga: 'Sabon Gari', services: ['maternal', 'child', 'nutrition'], pos: [11.12, 7.73] }
];
let facilitySource = { live: false, name: 'Offline examples', censusYear: null, syncedAt: null };

async function loadFacilityData() {
  try {
    const response = await fetch('data/facilities.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Facility data returned HTTP ${response.status}`);
    const snapshot = await response.json();
    if (!Array.isArray(snapshot.facilities) || !snapshot.facilities.length) throw new Error('Facility data is empty');
    FACILITIES = snapshot.facilities;
    facilitySource = { ...snapshot.source, live: true };
  } catch (error) {
    console.warn('Using offline facility examples:', error);
  }
}

/* ---------- Topic groups (document §7.1 A, B, C) ---------- */
const GROUPS = {
  maternal: { icon: 'heart', img: 'clinic', en: 'Maternal health', ha: 'Lafiyar uwa', desc: { en: 'Pregnancy, antenatal and postnatal care, prevention and warning signs.', ha: 'Juna biyu, awon ciki, kulawa bayan haihuwa, rigakafi da alamun haɗari.' } },
  mnutrition: { icon: 'leaf', img: 'food', en: 'Maternal nutrition', ha: 'Abincin uwa', desc: { en: 'Eating well during pregnancy and breastfeeding, using familiar local foods.', ha: 'Cin abinci mai kyau lokacin juna biyu da shayarwa, da abincin gida da aka saba.' } },
  iycf: { icon: 'smile', img: 'family', en: 'Infant & young child nutrition', ha: 'Abincin jarirai da ƙananan yara', desc: { en: 'Breastfeeding, complementary feeding and healthy growth.', ha: 'Shayarwa, ƙarin abinci da girma cikin koshin lafiya.' } }
};

const SOURCES = {
  anc: 'WHO recommendations on antenatal care for a positive pregnancy experience (2016)',
  pnc: 'WHO recommendations on maternal and newborn care for a positive postnatal experience (2022)',
  iycf: 'WHO / UNICEF guidance on infant and young child feeding',
  mddw: 'FAO & WHO — Minimum Dietary Diversity for Women (MDD-W)',
  diet: 'WHO guidance on healthy diet and nutrition in pregnancy',
  imm: 'WHO and National Primary Health Care Development Agency immunisation guidance',
  danger: 'WHO / UNICEF maternal and newborn danger-sign guidance',
  malnutrition: 'WHO fact sheet: Malnutrition',
  fmoh: 'Federal Ministry of Health, Nigeria — national guidance (to be confirmed by reviewers)'
};

const TOPICS = [
  {
    slug: 'pregnancy', group: 'maternal', img: 'mother', service: 'anc',
    name: { en: 'Pregnancy wellbeing', ha: 'Lafiyar juna biyu' },
    desc: { en: 'Everyday questions about staying well during pregnancy.', ha: 'Tambayoyin yau da kullum kan zama lafiya lokacin juna biyu.' },
    questions: [
      { en: 'How can I stay healthy during pregnancy?', ha: 'Ta yaya zan kasance cikin koshin lafiya lokacin juna biyu?' },
      { en: 'What should I ask at my first clinic visit?', ha: 'Me zan tambaya a ziyarar asibiti ta farko?' }
    ],
    answer: {
      en: 'Staying well in pregnancy usually includes starting antenatal care early, eating a variety of foods, resting, and staying active as advised by a health worker. Regular check-ups help health workers follow your health and your baby’s growth. Useful questions for a first visit include: when your next visits are, which tests you need, and which signs mean you should come back straight away. If anything worries you, speak to a health worker — you do not need to wait for your next visit.',
      ha: 'Zama lafiya lokacin juna biyu ya haɗa da fara awon ciki da wuri, cin abinci iri-iri, hutawa, da motsa jiki yadda ma’aikacin lafiya ya shawarta. Duba lafiya akai-akai na taimaka wa ma’aikatan lafiya su lura da lafiyarki da girman jaririnki. Tambayoyi masu amfani a ziyarar farko sun haɗa da: yaushe ne ziyarorin gaba, waɗanne gwaje-gwaje ake bukata, da waɗanne alamu ne ke nufin ki dawo nan take. Idan wani abu ya dame ki, ki tuntuɓi ma’aikacin lafiya — ba sai kin jira ziyara ta gaba ba.'
    },
    simple: {
      en: 'Go to the clinic early and often, eat different kinds of food, and rest. Ask a health worker whenever something worries you.',
      ha: 'Ki je asibiti da wuri kuma akai-akai, ki ci abinci iri-iri, ki huta. Ki tambayi ma’aikacin lafiya duk lokacin da wani abu ya dame ki.'
    },
    term: { word: { en: 'Antenatal', ha: 'Awon ciki' }, def: { en: 'Antenatal means “before birth”. Antenatal care is the routine health check-ups a woman receives during pregnancy.', ha: 'Awon ciki shi ne duba lafiya da ake yi wa mace akai-akai lokacin da take da juna biyu, kafin haihuwa.' } },
    sources: ['anc', 'fmoh']
  },
  {
    slug: 'antenatal', group: 'maternal', img: 'nurse', service: 'anc',
    name: { en: 'Antenatal care', ha: 'Awon ciki' },
    desc: { en: 'What happens at routine pregnancy check-ups and why they matter.', ha: 'Abin da ake yi a awon ciki da muhimmancinsa.' },
    questions: [
      { en: 'What is antenatal care?', ha: 'Menene awon ciki?' },
      { en: 'How many antenatal visits are recommended?', ha: 'Sau nawa ake ba da shawarar zuwa awon ciki?' }
    ],
    answer: {
      en: 'Antenatal care is the routine care a woman receives from health workers during pregnancy. Visits can include checking blood pressure and weight, tests, advice on nutrition, and information on what to expect. WHO recommends at least eight antenatal contacts during pregnancy, with the first in the first 12 weeks. Your health worker will advise on the schedule that applies to you.',
      ha: 'Awon ciki shi ne kulawar da mace ke samu daga ma’aikatan lafiya lokacin juna biyu. A ziyarar ana iya auna hawan jini da nauyi, yin gwaje-gwaje, ba da shawara kan abinci, da bayani kan abin da za a sa rai. Hukumar Lafiya ta Duniya (WHO) ta ba da shawarar ganawa aƙalla sau takwas lokacin juna biyu, ta farko a cikin makonni 12 na farko. Ma’aikacin lafiya zai shawarce ki kan jadawalin da ya dace da ke.'
    },
    simple: {
      en: 'Antenatal care means visiting a health worker regularly while pregnant. Try to start early — in the first three months — and keep going to your visits.',
      ha: 'Awon ciki na nufin zuwa wurin ma’aikacin lafiya akai-akai lokacin juna biyu. Ki yi ƙoƙarin farawa da wuri — a cikin watanni uku na farko — kuma ki ci gaba da zuwa.'
    },
    term: { word: { en: 'Antenatal contact', ha: 'Ganawa' }, def: { en: 'A “contact” is any visit or meeting with a health worker during pregnancy.', ha: 'Ganawa ita ce duk wata ziyara ko haɗuwa da ma’aikacin lafiya lokacin juna biyu.' } },
    sources: ['anc', 'fmoh']
  },
  {
    slug: 'postnatal', group: 'maternal', img: 'baby', service: 'pnc',
    name: { en: 'Postnatal care & recovery', ha: 'Kulawa bayan haihuwa' },
    desc: { en: 'Care for mother and baby in the weeks after birth.', ha: 'Kulawa ga uwa da jariri a makonnin bayan haihuwa.' },
    questions: [
      { en: 'What is postnatal care?', ha: 'Menene kulawa bayan haihuwa?' },
      { en: 'When should mother and baby be checked after birth?', ha: 'Yaushe ya kamata a duba uwa da jariri bayan haihuwa?' }
    ],
    answer: {
      en: 'Postnatal care is health care for the mother and newborn after birth. It supports the mother’s recovery, breastfeeding and the baby’s health. WHO recommends at least four postnatal contacts: within the first 24 hours, around day 3, between days 7 and 14, and at six weeks after birth. Seek care straight away if you notice any warning signs.',
      ha: 'Kulawa bayan haihuwa ita ce kulawar lafiya ga uwa da jariri bayan haihuwa. Tana taimaka wa uwa ta murmure, kuma tana tallafa wa shayarwa da lafiyar jariri. WHO ta ba da shawarar ganawa aƙalla sau huɗu: cikin awanni 24 na farko, kusan rana ta 3, tsakanin rana ta 7 zuwa 14, da kuma mako na shida bayan haihuwa. A nemi kulawa nan take idan an ga wata alamar haɗari.'
    },
    simple: {
      en: 'After birth, mother and baby should both see a health worker several times — on the first day, in the first two weeks, and at six weeks.',
      ha: 'Bayan haihuwa, uwa da jariri su ga ma’aikacin lafiya sau da yawa — a ranar farko, a cikin makonni biyu na farko, da kuma mako na shida.'
    },
    term: { word: { en: 'Postnatal', ha: 'Bayan haihuwa' }, def: { en: 'Postnatal means “after birth”. The postnatal period is usually the first six weeks after a baby is born.', ha: 'Lokacin bayan haihuwa yawanci makonni shida ne na farko bayan an haifi jariri.' } },
    sources: ['pnc', 'fmoh']
  },
  {
    slug: 'prevention', group: 'maternal', img: 'child', service: 'child',
    name: { en: 'Prevention & immunisation', ha: 'Kariya da rigakafi' },
    desc: { en: 'Preventive care for mothers and children, including vaccines.', ha: 'Kulawar kariya ga uwa da yara, har da allurar rigakafi.' },
    questions: [
      { en: 'Why are childhood vaccines important?', ha: 'Me yasa allurar rigakafin yara ke da muhimmanci?' },
      { en: 'Where can my child get vaccinated?', ha: 'A ina yarona zai samu allurar rigakafi?' }
    ],
    answer: {
      en: 'Preventive care helps protect mothers and children before illness happens. For children, this includes routine immunisation following the national schedule, growth monitoring and regular check-ups. Health facilities give a vaccination card for your child — bring it to each visit so health workers can see which vaccines are due.',
      ha: 'Kulawar kariya na taimakawa wajen kare uwa da yara kafin rashin lafiya ya auku. Ga yara, wannan ya haɗa da allurar rigakafi bisa jadawalin ƙasa, auna girma, da duba lafiya akai-akai. Cibiyoyin lafiya kan ba da katin rigakafi ga yaro — a kawo shi a kowace ziyara don ma’aikatan lafiya su ga allurar da ta rage.'
    },
    simple: {
      en: 'Vaccines protect children from serious diseases. Follow the clinic’s schedule and bring the vaccination card every time.',
      ha: 'Allurar rigakafi na kare yara daga cututtuka masu tsanani. A bi jadawalin asibiti kuma a kawo katin rigakafi kowane lokaci.'
    },
    term: { word: { en: 'Immunisation', ha: 'Rigakafi' }, def: { en: 'Immunisation means giving vaccines that teach the body to protect itself against certain diseases.', ha: 'Rigakafi shi ne ba da allura ko digo da ke koya wa jiki kare kansa daga wasu cututtuka.' } },
    sources: ['imm', 'fmoh']
  },
  {
    slug: 'warning-signs', group: 'maternal', img: 'clinic', service: 'maternal', danger: true,
    name: { en: 'Warning signs', ha: 'Alamun haɗari' },
    desc: { en: 'Signs that mean a mother or baby needs care straight away.', ha: 'Alamun da ke nuna uwa ko jariri na bukatar kulawa nan take.' },
    questions: [
      { en: 'What are danger signs in pregnancy?', ha: 'Menene alamun haɗari lokacin juna biyu?' },
      { en: 'What are danger signs in a newborn?', ha: 'Menene alamun haɗari ga jariri?' }
    ],
    answer: {
      en: 'Some signs mean a mother or baby needs care immediately — do not wait. In pregnancy or after birth these include bleeding, fits, severe headache with blurred vision, fever with weakness, severe abdominal pain, or difficult breathing. In a newborn: not feeding well, fits, fast breathing, fever or feeling very cold, or being very sleepy. If you see any of these, go to the nearest health facility now or call 112.',
      ha: 'Wasu alamu na nufin uwa ko jariri na bukatar kulawa nan take — kada a jira. Lokacin juna biyu ko bayan haihuwa sun haɗa da zubar jini, farfaɗiya, ciwon kai mai tsanani tare da gani dishi-dishi, zazzaɓi tare da rauni, ciwon ciki mai tsanani, ko wahalar numfashi. Ga jariri: rashin shan nono yadda ya kamata, farfaɗiya, numfashi da sauri, zazzaɓi ko sanyi sosai a jiki, ko yawan barci. Idan an ga ɗaya daga cikinsu, a je cibiyar lafiya mafi kusa yanzu ko a kira 112.'
    },
    simple: {
      en: 'Bleeding, fits, a very bad headache, fever, bad stomach pain or hard breathing are dangerous. Go to a health facility now or call 112.',
      ha: 'Zubar jini, farfaɗiya, ciwon kai mai tsanani, zazzaɓi, ciwon ciki mai tsanani ko wahalar numfashi suna da haɗari. A je cibiyar lafiya yanzu ko a kira 112.'
    },
    term: { word: { en: 'Danger sign', ha: 'Alamar haɗari' }, def: { en: 'A sign that something may be seriously wrong and a health worker is needed urgently.', ha: 'Alamar da ke nuna wani abu na iya zama mai tsanani, kuma ana bukatar ma’aikacin lafiya cikin gaggawa.' } },
    dangerLists: [
      {
        title: { en: 'During pregnancy or after birth', ha: 'Lokacin juna biyu ko bayan haihuwa' },
        items: [
          { en: 'Vaginal bleeding', ha: 'Zubar jini ta al’aura' },
          { en: 'Fits or convulsions', ha: 'Farfaɗiya ko jijjiga' },
          { en: 'Severe headache with blurred vision', ha: 'Ciwon kai mai tsanani tare da gani dishi-dishi' },
          { en: 'Fever and too weak to get out of bed', ha: 'Zazzaɓi da rauni har ba za a iya tashi ba' },
          { en: 'Severe abdominal pain', ha: 'Ciwon ciki mai tsanani' },
          { en: 'Fast or difficult breathing', ha: 'Numfashi da sauri ko da wahala' }
        ]
      },
      {
        title: { en: 'In a newborn baby', ha: 'Ga jariri' },
        items: [
          { en: 'Not feeding well', ha: 'Rashin shan nono yadda ya kamata' },
          { en: 'Fits or convulsions', ha: 'Farfaɗiya ko jijjiga' },
          { en: 'Fast breathing or chest drawing in', ha: 'Numfashi da sauri ko ƙirji na shiga ciki' },
          { en: 'Fever, or feels very cold', ha: 'Zazzaɓi, ko sanyi sosai a jiki' },
          { en: 'Very sleepy, or moves only when touched', ha: 'Yawan barci, ko motsi sai an taɓa' },
          { en: 'Yellow palms or soles', ha: 'Rawayar tafin hannu ko ƙafa' }
        ]
      }
    ],
    sources: ['danger', 'fmoh']
  },
  {
    slug: 'pregnancy-nutrition', group: 'mnutrition', img: 'food', service: 'nutrition',
    name: { en: 'Eating well in pregnancy', ha: 'Abinci lokacin juna biyu' },
    desc: { en: 'Balanced meals, food groups and supplements during pregnancy.', ha: 'Abinci mai daidaito, rukunin abinci da ƙarin sinadarai lokacin juna biyu.' },
    questions: [
      { en: 'What foods are good during pregnancy?', ha: 'Wane abinci ne ke da kyau lokacin juna biyu?' },
      { en: 'Why are iron and folic acid important?', ha: 'Me yasa sinadarin ƙarfe (iron) da folic acid ke da muhimmanci?' }
    ],
    answer: {
      en: 'During pregnancy, eating a variety of foods each day helps meet the extra needs of mother and baby. Try to include foods from different groups — for example grains such as millet, maize or rice; beans and other legumes; vegetables such as spinach (alayyahu) and okra; fruits; and eggs, fish, meat or milk when available. Health workers usually provide iron and folic acid supplements at antenatal visits. A health worker or nutritionist can give advice for your situation.',
      ha: 'Lokacin juna biyu, cin abinci iri-iri a kowace rana na taimakawa wajen biyan ƙarin bukatun uwa da jariri. A yi ƙoƙarin haɗa abinci daga rukuni daban-daban — misali hatsi kamar gero, masara ko shinkafa; wake da makamantansu; ganye kamar alayyahu da kubewa; ’ya’yan itace; da ƙwai, kifi, nama ko madara idan akwai. Ma’aikatan lafiya kan ba da ƙarin sinadarin ƙarfe da folic acid a awon ciki. Ma’aikacin lafiya ko masanin abinci zai iya ba ki shawara da ta dace da ke.'
    },
    simple: {
      en: 'Eat many kinds of food every day — grains, beans, green vegetables, fruit, and eggs, fish or meat when you can. Take the supplements the clinic gives you.',
      ha: 'Ki ci abinci iri-iri kowace rana — hatsi, wake, ganye, ’ya’yan itace, da ƙwai, kifi ko nama idan da hali. Ki sha magungunan ƙarin sinadarai da asibiti ya ba ki.'
    },
    term: { word: { en: 'Folic acid', ha: 'Folic acid' }, def: { en: 'A B-vitamin that helps the baby’s brain and spine develop. Clinics usually provide it during pregnancy.', ha: 'Wani nau’in bitamin B da ke taimaka wa ƙwaƙwalwa da kashin bayan jariri su girma. Asibitoci kan ba da shi lokacin juna biyu.' } },
    sources: ['diet', 'fmoh']
  },
  {
    slug: 'breastfeeding-nutrition', group: 'mnutrition', img: 'family', service: 'nutrition',
    name: { en: 'Eating well while breastfeeding', ha: 'Abinci lokacin shayarwa' },
    desc: { en: 'Food and fluids for breastfeeding mothers.', ha: 'Abinci da ruwan sha ga mata masu shayarwa.' },
    questions: [
      { en: 'What should I eat while breastfeeding?', ha: 'Me zan ci lokacin da nake shayarwa?' },
      { en: 'Do I need to drink more while breastfeeding?', ha: 'Ina bukatar ƙara shan ruwa lokacin shayarwa?' }
    ],
    answer: {
      en: 'Breastfeeding mothers need enough food and fluids to stay healthy and recover after birth. Eating a variety of foods, drinking clean water regularly — especially when thirsty — and adding an extra small meal or snack each day can help. Local foods such as grains, beans, groundnuts, green leafy vegetables, fruits, and eggs or fish are good choices. Ask a health worker before taking any medicine or supplement while breastfeeding.',
      ha: 'Mata masu shayarwa na bukatar isasshen abinci da ruwa don su kasance cikin koshin lafiya kuma su murmure bayan haihuwa. Cin abinci iri-iri, shan ruwa mai tsafta akai-akai — musamman idan ƙishirwa ta kama — da ƙara ɗan abinci kaɗan kowace rana na taimakawa. Abincin gida kamar hatsi, wake, gyaɗa, ganye, ’ya’yan itace, da ƙwai ko kifi zaɓuɓɓuka ne masu kyau. Ki tambayi ma’aikacin lafiya kafin shan kowane magani lokacin shayarwa.'
    },
    simple: {
      en: 'Eat a little more than usual, eat different foods, and drink clean water when you are thirsty. Ask a health worker before taking medicine.',
      ha: 'Ki ɗan ƙara abinci fiye da yadda kika saba, ki ci abinci iri-iri, ki sha ruwa mai tsafta idan kina jin ƙishirwa. Ki tambayi ma’aikacin lafiya kafin shan magani.'
    },
    term: { word: { en: 'Fluids', ha: 'Abubuwan sha' }, def: { en: 'Drinks such as clean water, milk or soup that keep your body hydrated.', ha: 'Abubuwan sha kamar ruwa mai tsafta, madara ko miya da ke kiyaye ruwan jiki.' } },
    sources: ['iycf', 'fmoh']
  },
  {
    slug: 'dietary-diversity', group: 'mnutrition', img: 'meal', service: 'nutrition',
    name: { en: 'Dietary diversity', ha: 'Cin abinci iri-iri' },
    desc: { en: 'Why eating from different food groups matters.', ha: 'Muhimmancin cin abinci daga rukuni daban-daban.' },
    questions: [
      { en: 'What is dietary diversity?', ha: 'Menene cin abinci iri-iri?' },
      { en: 'What are the main food groups?', ha: 'Menene manyan rukunin abinci?' }
    ],
    answer: {
      en: 'Dietary diversity means eating foods from several different food groups, not just one or two. Different groups give the body different nutrients. Common groups include: grains, roots and tubers (millet, sorghum, maize, rice, yam); beans, peas and groundnuts; dairy (milk, yoghurt, fura da nono); meat, fish and eggs; dark green leafy vegetables (alayyahu, zogale); and other fruits and vegetables. Eating from at least five groups each day is a useful goal for women.',
      ha: 'Cin abinci iri-iri na nufin cin abinci daga rukuni daban-daban, ba ɗaya ko biyu kawai ba. Kowane rukuni na ba jiki sinadarai daban. Rukunin da aka saba sun haɗa da: hatsi da doya (gero, dawa, masara, shinkafa, doya); wake, gyaɗa da makamantansu; madara da kayan madara (nono, fura da nono); nama, kifi da ƙwai; ganye masu duhu (alayyahu, zogale); da sauran ’ya’yan itace da kayan lambu. Cin daga rukuni aƙalla biyar kowace rana manufa ce mai kyau ga mata.'
    },
    simple: {
      en: 'Do not eat the same food every day. Mix grains, beans, vegetables, fruit, and milk, eggs, fish or meat.',
      ha: 'Kada a ci abinci iri ɗaya kowace rana. A haɗa hatsi, wake, ganye, ’ya’yan itace, da madara, ƙwai, kifi ko nama.'
    },
    term: { word: { en: 'Food group', ha: 'Rukunin abinci' }, def: { en: 'A set of foods that give similar nutrients, such as grains or vegetables.', ha: 'Tarin abinci masu ba da sinadarai iri ɗaya, kamar hatsi ko ganye.' } },
    sources: ['mddw', 'fmoh']
  },
  {
    slug: 'breastfeeding', group: 'iycf', img: 'family', service: 'bf',
    name: { en: 'Breastfeeding', ha: 'Shayarwa' },
    desc: { en: 'Early, exclusive and continued breastfeeding.', ha: 'Fara shayarwa da wuri, shayarwa zalla da ci gaba da shayarwa.' },
    questions: [
      { en: 'When should breastfeeding start?', ha: 'Yaushe ya kamata a fara shayarwa?' },
      { en: 'What is exclusive breastfeeding?', ha: 'Menene shayarwa zalla?' }
    ],
    answer: {
      en: 'WHO and UNICEF recommend starting breastfeeding within the first hour after birth; giving only breast milk — no water, other drinks or foods — for the first six months (exclusive breastfeeding); and continuing to breastfeed up to two years or beyond while adding other foods from six months. If breastfeeding is difficult or painful, a health worker or breastfeeding counsellor can help.',
      ha: 'WHO da UNICEF sun ba da shawarar fara shayarwa cikin awa ɗaya na farko bayan haihuwa; ba da nono kaɗai — ba ruwa, ba wani abin sha ko abinci — a watanni shida na farko (shayarwa zalla); da ci gaba da shayarwa har zuwa shekara biyu ko fiye tare da ƙara wasu abinci daga wata shida. Idan shayarwa na da wahala ko zafi, ma’aikacin lafiya ko mai ba da shawara kan shayarwa zai iya taimakawa.'
    },
    simple: {
      en: 'Start breastfeeding in the first hour. Give only breast milk for six months — no water. Keep breastfeeding until at least two years.',
      ha: 'A fara shayarwa cikin awa ɗaya na farko. A ba da nono kaɗai har wata shida — ba ruwa. A ci gaba da shayarwa har aƙalla shekara biyu.'
    },
    term: { word: { en: 'Exclusive breastfeeding', ha: 'Shayarwa zalla' }, def: { en: 'Giving the baby only breast milk — no water, other liquids or food — except medicines given by a health worker.', ha: 'Ba wa jariri nono kaɗai — ba ruwa, ba wani abin sha ko abinci — sai dai maganin da ma’aikacin lafiya ya bayar.' } },
    sources: ['iycf', 'fmoh']
  },
  {
    slug: 'complementary-feeding', group: 'iycf', img: 'child', service: 'nutrition',
    name: { en: 'Complementary feeding', ha: 'Ƙarin abinci ga jarirai' },
    desc: { en: 'Introducing family foods from six months.', ha: 'Fara ba jarirai abincin gida daga wata shida.' },
    questions: [
      { en: 'When should my baby start eating food?', ha: 'Yaushe jaririna zai fara cin abinci?' },
      { en: 'What foods can I give my baby at six months?', ha: 'Wane abinci zan ba jaririna a wata shida?' }
    ],
    answer: {
      en: 'From six months, babies need other foods in addition to breast milk — this is called complementary feeding. Start with small amounts of soft, mashed foods and slowly increase the amount, thickness and variety as the baby grows. Examples include thick pap (koko) enriched with groundnut or milk, mashed beans, egg, fish, and mashed vegetables and fruit. Continue breastfeeding, and use clean hands, utensils and water when preparing food.',
      ha: 'Daga wata shida, jarirai na bukatar wasu abinci baya ga nono — ana kiran wannan ƙarin abinci. A fara da ɗan kaɗan na abinci mai laushi da aka murƙushe, sannan a ƙara yawa, kauri da nau’ikan abinci yayin da jariri ke girma. Misalai sun haɗa da koko mai kauri da aka haɗa da gyaɗa ko madara, wake da aka murƙushe, ƙwai, kifi, da ganye da ’ya’yan itace da aka murƙushe. A ci gaba da shayarwa, kuma a yi amfani da hannu, kayan aiki da ruwa masu tsafta wajen shirya abinci.'
    },
    simple: {
      en: 'At six months, start giving soft food as well as breast milk. Start with a little, then give more as the baby grows. Keep everything clean.',
      ha: 'A wata shida, a fara ba da abinci mai laushi tare da nono. A fara da kaɗan, sannan a ƙara yayin da jariri ke girma. A kiyaye tsafta.'
    },
    term: { word: { en: 'Complementary feeding', ha: 'Ƙarin abinci' }, def: { en: 'Giving other foods alongside breast milk, starting at six months.', ha: 'Ba da wasu abinci tare da nono, farawa daga wata shida.' } },
    sources: ['iycf', 'fmoh']
  },
  {
    slug: 'child-feeding', group: 'iycf', img: 'care', service: 'growth',
    name: { en: 'Healthy child feeding', ha: 'Ciyar da yara yadda ya kamata' },
    desc: { en: 'Age-appropriate meals and healthy growth for young children.', ha: 'Abincin da ya dace da shekaru da girman yara cikin koshin lafiya.' },
    questions: [
      { en: 'How often should a young child eat?', ha: 'Sau nawa ƙaramin yaro zai ci abinci?' },
      { en: 'Why is growth monitoring important?', ha: 'Me yasa auna girman yaro ke da muhimmanci?' }
    ],
    answer: {
      en: 'As children grow, they need more frequent meals and a wider variety of foods. Young children have small stomachs, so they usually need several meals plus healthy snacks each day. Offer foods from different groups and include animal foods such as eggs, fish or milk when possible. Regular growth monitoring at a health facility helps check that a child is growing well, and health workers can advise on feeding.',
      ha: 'Yayin da yara ke girma, suna bukatar abinci akai-akai da nau’ikan abinci da yawa. Ƙananan yara na da ƙaramin ciki, don haka yawanci suna bukatar abinci sau da yawa tare da ƙananan abinci masu gina jiki kowace rana. A ba da abinci daga rukuni daban-daban, a haɗa da ƙwai, kifi ko madara idan da hali. Auna girma akai-akai a cibiyar lafiya na taimakawa wajen tabbatar yaro na girma yadda ya kamata, kuma ma’aikatan lafiya za su iya ba da shawara kan ciyarwa.'
    },
    simple: {
      en: 'Young children need to eat several times a day, with different kinds of food. Take your child to the clinic to check their growth.',
      ha: 'Ƙananan yara na bukatar cin abinci sau da yawa a rana, da abinci iri-iri. A kai yaro asibiti don a auna girmansa.'
    },
    term: { word: { en: 'Growth monitoring', ha: 'Auna girma' }, def: { en: 'Regularly measuring a child’s weight and height to check that they are growing well.', ha: 'Auna nauyi da tsayin yaro akai-akai don tabbatar yana girma yadda ya kamata.' } },
    sources: ['iycf', 'fmoh']
  },
  {
    slug: 'malnutrition', group: 'iycf', img: 'care', service: 'growth',
    name: { en: 'Malnutrition awareness', ha: 'Sanin tamowa' },
    desc: { en: 'Understanding malnutrition and when to seek an assessment.', ha: 'Fahimtar tamowa da lokacin neman a duba yaro.' },
    questions: [
      { en: 'What is malnutrition?', ha: 'Menene tamowa?' },
      { en: 'When should my child be checked for malnutrition?', ha: 'Yaushe ya kamata a duba yarona don tamowa?' }
    ],
    answer: {
      en: 'Malnutrition happens when the body does not get the right amount of nutrients. In children it can show as being too thin for their height (wasting), too short for their age (stunting), or low weight for their age. Only a trained health worker can assess a child for malnutrition, usually by measuring weight, height and arm size. If you are worried about your child’s growth, appetite or energy, visit a facility that offers growth monitoring or nutrition counselling.',
      ha: 'Tamowa na faruwa ne idan jiki bai samu isassun sinadarai ba. Ga yara tana iya bayyana a matsayin rama sosai idan aka kwatanta da tsayi, gajarta idan aka kwatanta da shekaru, ko ƙarancin nauyi idan aka kwatanta da shekaru. Ƙwararren ma’aikacin lafiya ne kaɗai zai iya tantance tamowa, yawanci ta hanyar auna nauyi, tsayi da girman hannu. Idan kuna damuwa da girma, sha’awar abinci ko kuzarin yaronku, ku je cibiyar da ke auna girman yara ko ba da shawarwari kan abinci.'
    },
    simple: {
      en: 'Malnutrition means the body is not getting the food it needs. Only a health worker can check for it. If you are worried, take your child to a clinic.',
      ha: 'Tamowa na nufin jiki baya samun abincin da yake bukata. Ma’aikacin lafiya ne kaɗai zai iya duba ta. Idan kuna damuwa, ku kai yaro asibiti.'
    },
    term: { word: { en: 'Stunting', ha: 'Gajarta (stunting)' }, def: { en: 'When a child is too short for their age, often because of long-term poor nutrition or repeated illness.', ha: 'Lokacin da yaro ya yi gajarta fiye da shekarunsa, sau da yawa saboda rashin abinci mai gina jiki na dogon lokaci ko yawan rashin lafiya.' } },
    sources: ['malnutrition', 'iycf']
  }
];
const topicBySlug = (slug) => TOPICS.find((x) => x.slug === slug);

/* ---------- Shared fragments ---------- */
const dict = {
  pilot: { en: 'Prototype · Kaduna State pilot', ha: 'Samfurin gwaji · Gwajin Jihar Kaduna' },
  notice: { en: 'Information only — not a clinical or emergency service', ha: 'Bayani kawai — ba sabis na likita ko gaggawa ba' },
  emergency: { en: 'Emergency? Call 112', ha: 'Gaggawa? Kira 112' }
};

function whatsappButton(extra = '') {
  return `<span class="btn btn-whatsapp is-disabled ${extra}" aria-disabled="true" title="${esc(L('The WhatsApp channel is not live yet', 'Tashar WhatsApp ba ta fara aiki ba tukuna'))}">${icon('chat')}<span>${L('Chat on WhatsApp', 'Yi hira a WhatsApp')}</span><span class="soon">${L('Coming soon', 'Nan gaba kaɗan')}</span></span>`;
}

function servicePill(id, active = false) {
  const s = SERVICES[id];
  return `<span class="pill pill-${s.cat}${active ? ' is-active' : ''}">${esc(t(s))}</span>`;
}

function sectionHead(eyebrow, title, text = '') {
  return `<div class="section-head"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ''}</div>`;
}

function reviewNote() {
  return `<p class="review-note">${icon('info')}<span>${L('Sample content for this prototype. All health information will be reviewed by qualified health and nutrition professionals before launch.', 'Bayanan samfuri ne na gwaji. Ƙwararrun ma’aikatan lafiya da abinci za su duba duk bayanan lafiya kafin ƙaddamarwa.')}</span></p>`;
}

/* ---------- Layout ---------- */
function layout() {
  document.documentElement.lang = lang;
  // Centre of the bar: Home · About · Health topics · Find a facility.
  // "Ask Lafimora" is the call-to-action button on the right; in the mobile drawer it is added as a plain link.
  const nav = [
    ['home', 'index.html', { en: 'Home', ha: 'Gida' }],
    ['about', 'about.html', { en: 'About', ha: 'Game da mu' }],
    ['topics', 'topics.html', { en: 'Health topics', ha: 'Batutuwan lafiya' }],
    ['facilities', 'facilities.html', { en: 'Find a facility', ha: 'Nemo cibiyar lafiya' }],
    ['chat', 'chat.html', { en: 'Ask Lafimora', ha: 'Tambayi Lafimora' }, true]
  ];
  const current = page === 'topic' ? 'topics' : page === 'facility' ? 'facilities' : page;
  document.body.classList.add(`page-${page}`);
  $('#app').innerHTML = `
  <a class="skip-link" href="#main">${L('Skip to main content', 'Tsallaka zuwa babban bayani')}</a>
  <div class="topbar"><div class="wrap topbar-inner">
    <span class="topbar-note"><span class="status-dot" aria-hidden="true"></span><strong>${t(dict.pilot)}</strong><span class="hide-sm"> · ${t(dict.notice)}</span></span>
    <a class="topbar-emergency" href="tel:112">${icon('phone')}${t(dict.emergency)}</a>
  </div></div>
  <header class="site-header"><nav class="wrap nav" aria-label="${L('Main navigation', 'Babban menu')}">
    <a href="index.html" class="brand" aria-label="Lafimora — ${L('Home', 'Gida')}">${brandMark('brand-mark')}<span class="brand-name">Lafimora</span></a>
    <div class="nav-links" id="nav-links">
      ${nav.map(([id, url, label, mobileOnly]) => `<a href="${url}" class="nav-link${mobileOnly ? ' mobile-only' : ''}"${current === id ? ' aria-current="page"' : ''}>${t(label)}</a>`).join('')}
    </div>
    <div class="nav-actions">
      <div class="lang-switch" role="group" aria-label="Language / Harshe">
        <button type="button" data-lang="en" aria-pressed="${lang === 'en'}"><span class="long">English</span><span class="short">EN</span></button>
        <button type="button" data-lang="ha" aria-pressed="${lang === 'ha'}"><span class="long">Hausa</span><span class="short">HA</span></button>
      </div>
      <a class="btn btn-primary btn-sm nav-cta" href="chat.html"${page === 'chat' ? ' aria-current="page"' : ''}>${icon('chat')}${L('Ask Lafimora', 'Tambayi Lafimora')}</a>
      <button type="button" class="nav-toggle" aria-controls="nav-links" aria-expanded="false" aria-label="${L('Open menu', 'Buɗe menu')}">${icon('menu')}</button>
    </div>
  </nav></header>
  <main id="main" tabindex="-1"></main>
  <footer class="site-footer"><div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand brand-light" href="index.html">${brandMark('brand-mark')}<span class="brand-name">Lafimora</span></a>
        <p class="footer-text">${L('An AI-powered maternal and child health information and healthcare service navigation platform, developed by YandyTech Community through SolutionLab.', 'Dandalin bayanan lafiyar uwa da yara da neman cibiyoyin lafiya mai amfani da AI, wanda YandyTech Community ke haɓakawa ta SolutionLab.')}</p>
        ${whatsappButton('btn-sm')}
      </div>
      <div>
        <h3 class="footer-title">${L('Explore', 'Bincika')}</h3>
        <ul class="footer-links">
          <li><a href="topics.html">${L('Health topics', 'Batutuwan lafiya')}</a></li>
          <li><a href="facilities.html">${L('Find a facility', 'Nemo cibiyar lafiya')}</a></li>
          <li><a href="chat.html">${L('Ask Lafimora', 'Tambayi Lafimora')}</a></li>
          <li><a href="about.html">${L('About the project', 'Game da shirin')}</a></li>
        </ul>
      </div>
      <div>
        <h3 class="footer-title">${L('Safety & privacy', 'Tsaro da sirri')}</h3>
        <ul class="footer-links">
          <li><a href="about.html#limits">${L('What Lafimora does not do', 'Abin da Lafimora ba ta yi')}</a></li>
          <li><a href="about.html#privacy">${L('Privacy and your data', 'Sirri da bayananku')}</a></li>
          <li><a href="about.html#review">${L('How content is reviewed', 'Yadda ake duba bayanai')}</a></li>
          <li><a href="topic.html?name=warning-signs">${L('Warning signs', 'Alamun haɗari')}</a></li>
          <li><a href="about.html#credits">${L('Photo credits', 'Masu hotuna')}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Lafimora · YandyTech Community / SolutionLab</span>
      <span>LAFI — ${L('Health and wellbeing', 'Lafiya')} · MORA — Motherhood, Outreach, Resources and Awareness</span>
    </div>
  </div></footer>`;

  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => setLanguage(b.dataset.lang)));
  const toggle = $('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = $('#nav-links').classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = icon(open ? 'x' : 'menu');
  });
}

function setLanguage(next) {
  lang = next === 'ha' ? 'ha' : 'en';
  savedLang = lang;
  store.set('lafimora-language', lang);
  render();
}

/* First-visit language choice (document §8 Step 2) */
function languageChooser() {
  if (savedLang) return;
  const el = document.createElement('div');
  el.className = 'lang-modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'lang-modal-title');
  el.innerHTML = `<div class="lang-modal-card">
    ${brandMark('brand-mark brand-mark-lg')}
    <h2 id="lang-modal-title">Zaɓi harshe · Choose your language</h2>
    <p>Kuna iya canza shi a kowane lokaci. · You can change this at any time.</p>
    <div class="lang-options">
      <button type="button" data-choose="ha"><strong>Hausa</strong><span>Ci gaba da Hausa</span></button>
      <button type="button" data-choose="en"><strong>English</strong><span>Continue in English</span></button>
    </div></div>`;
  document.body.appendChild(el);
  document.body.classList.add('modal-open');
  const close = (choice) => { el.remove(); document.body.classList.remove('modal-open'); setLanguage(choice); };
  $$('[data-choose]', el).forEach((b) => b.addEventListener('click', () => close(b.dataset.choose)));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close(lang);
    if (e.key === 'Tab') { // keep focus inside the dialog
      const btns = $$('button', el); const first = btns[0]; const last = btns[btns.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $('button', el).focus();
}

/* ---------- Home ---------- */
function renderHome() {
  $('#main').innerHTML = `
  <section class="hero"><div class="wrap hero-grid">
    <div class="hero-copy">
      <h1>${L('Trusted health information for mothers and children.', 'Ingantattun bayanan lafiya ga uwa da yara.')}</h1>
      <p class="lead">${L('Ask questions about pregnancy, breastfeeding and child nutrition in Hausa or English — and find healthcare services in Kaduna State.', 'Yi tambayoyi kan juna biyu, shayarwa da abincin yara a Hausa ko Turanci — kuma nemo cibiyoyin lafiya a Jihar Kaduna.')}</p>
      <form class="hero-ask" action="chat.html" method="get" role="search">
        <label for="hero-ask-input" class="sr-only">${L('Ask Lafimora a question', 'Tambayi Lafimora')}</label>
        <span class="hero-ask-icon">${brandMark('hero-ask-logo')}</span>
        <input id="hero-ask-input" name="ask" maxlength="500" autocomplete="off" required placeholder="${esc(L('Ask Lafimora anything about mother & child health…', 'Tambayi Lafimora kan lafiyar uwa da yara…'))}">
        <button type="submit" class="hero-ask-send" aria-label="${esc(L('Ask', 'Tambaya'))}">${icon('arrowUp')}</button>
      </form>
      <div class="hero-try">
        <span>${L('Try:', 'Gwada:')}</span>
        ${[['antenatal', 0], ['breastfeeding', 1], ['complementary-feeding', 0]].map(([s, i]) => `<a class="chip-btn" href="chat.html?topic=${s}&amp;q=${i}">${esc(t(topicBySlug(s).questions[i]))}</a>`).join('')}
      </div>
      <a class="hero-alt" href="facilities.html"><span class="action-icon action-icon-alt">${icon('pin')}</span><span class="action-text"><strong>${L('Find a health facility', 'Nemo cibiyar lafiya')}</strong><small>${L('Search Kaduna State facilities by service or area', 'Bincika cibiyoyin Jihar Kaduna ta hidima ko yanki')}</small></span>${icon('arrowRight')}</a>
    </div>
    <div class="hero-media">
      <img src="${photo('mother')}" alt="${esc(L(photoAlt('mother'), 'Wata matashiyar uwa da ’yarta a taron ilimin lafiya na mata a arewacin Najeriya'))}" fetchpriority="high">
      <div class="hero-badge">${icon('shield')}<span><strong>${L('Information you can trust', 'Bayanan da za a amince da su')}</strong><small>${L('Content reviewed by health professionals before launch', 'Ƙwararrun lafiya za su duba bayanai kafin ƙaddamarwa')}</small></span></div>
    </div>
  </div></section>

  <section class="section home-about" id="about" aria-labelledby="home-about-title"><div class="wrap home-about-grid">
    <div class="home-about-media">
      <img loading="lazy" src="${photo('midwives')}" alt="${esc(L(photoAlt('midwives'), 'Ɗalibai masu koyon unguwar zoma a aji a Makarantar Unguwar Zoma ta Jihar Jigawa'))}">
      <span class="home-about-tag">${icon('pin')}${L('Built for northern Nigeria', 'An gina don arewacin Najeriya')}</span>
    </div>
    <div>
      <span class="eyebrow">${L('About Lafimora', 'Game da Lafimora')}</span>
      <h2 id="home-about-title">${L('Health information that speaks your language.', 'Bayanan lafiya a harshen da kuke ji.')}</h2>
      <p>${L('<strong>Lafimora</strong> joins <strong>LAFI</strong> — from the Hausa word <em>lafiya</em>, health and wellbeing — with <strong>MORA</strong>: Motherhood, Outreach, Resources and Awareness.', '<strong>Lafimora</strong> ta haɗa <strong>LAFI</strong> — daga kalmar Hausa <em>lafiya</em> — da <strong>MORA</strong>: Motherhood, Outreach, Resources and Awareness.')}</p>
      <p>${L('Many families find it hard to get clear, trusted answers about pregnancy, breastfeeding and child nutrition, or to know which facility offers the care they need. Lafimora brings reviewed health information and a directory of health facilities together, in Hausa and English.', 'Iyalai da yawa na fuskantar wahala wajen samun amsoshi bayyanannu kan juna biyu, shayarwa da abincin yara, ko sanin wace cibiya ke ba da kulawar da suke bukata. Lafimora ta haɗa bayanan lafiya da aka duba da kundin cibiyoyin lafiya, a Hausa da Turanci.')}</p>
      <ul class="about-facts">
        <li><strong>2</strong><span>${L('languages — Hausa and English', 'harsuna — Hausa da Turanci')}</span></li>
        <li><strong>${FACILITIES.length > 6 ? FACILITIES.length : '290+'}</strong><span>${L('Kaduna State facilities in the directory', 'cibiyoyin Jihar Kaduna a cikin kundin')}</span></li>
        <li><strong>12</strong><span>${L('health and nutrition topics', 'batutuwan lafiya da abinci')}</span></li>
      </ul>
      <p class="muted">${L('Developed by YandyTech Community through its SolutionLab programme, with public-health and nutrition professionals. Piloting in Kaduna State.', 'YandyTech Community ce ke haɓaka ta ta shirin SolutionLab, tare da ƙwararrun lafiya da abinci. Gwaji a Jihar Kaduna.')}</p>
      <a class="btn btn-secondary" href="about.html">${L('More about Lafimora', 'Ƙarin bayani game da Lafimora')}${icon('arrowRight')}</a>
    </div>
  </div></section>

  <section class="section section-soft"><div class="wrap">
    ${sectionHead(L('Two core services', 'Muhimman ayyuka biyu'), L('Information and navigation, in one place.', 'Bayani da jagora, a wuri ɗaya.'))}
    <div class="feature-grid">
      <article class="feature-card">
        <span class="feature-icon">${icon('chat')}</span>
        <h3>${L('Health & nutrition assistant', 'Mataimakin lafiya da abinci')}</h3>
        <p>${L('Ask in everyday words and get clear answers about pregnancy, maternal and child health and nutrition.', 'Yi tambaya da kalmomin yau da kullum, ka samu amsa bayyananniya kan juna biyu, lafiyar uwa da yara da abinci.')}</p>
        <ul class="check-list">
          <li>${icon('check')}${L('Hausa and English, on the web and WhatsApp', 'Hausa da Turanci, a yanar gizo da WhatsApp')}</li>
          <li>${icon('check')}${L('Answers based on approved sources, with citations', 'Amsoshi daga ingantattun madogara, tare da tushe')}</li>
          <li>${icon('check')}${L('Follow-up questions and simpler explanations', 'Tambayoyin ci gaba da bayani mai sauƙi')}</li>
          <li>${icon('check')}${L('Urgent symptoms directed to emergency care', 'Alamun gaggawa ana tura su zuwa kulawar gaggawa')}</li>
        </ul>
        <a class="btn btn-primary" href="chat.html">${L('Ask Lafimora', 'Tambayi Lafimora')}${icon('arrowRight')}</a>
      </article>
      <article class="feature-card">
        <span class="feature-icon feature-icon-alt">${icon('pin')}</span>
        <h3>${L('Healthcare service discovery', 'Neman cibiyoyin lafiya')}</h3>
        <p>${L('Find facilities that offer maternal, child health and nutrition services, and see how to reach them.', 'Nemo cibiyoyin da ke ba da ayyukan lafiyar uwa, yara da abinci, da yadda za a isa gare su.')}</p>
        <ul class="check-list">
          <li>${icon('check')}${L('Search by service or local government area', 'Bincika ta hidima ko ƙaramar hukuma')}</li>
          <li>${icon('check')}${L('Services, opening hours and contacts', 'Ayyuka, lokutan aiki da lambobin waya')}</li>
          <li>${icon('check')}${L('Directions and last-verified date', 'Kwatance da ranar tabbatarwa ta ƙarshe')}</li>
          <li>${icon('check')}${L('Only confirmed services are shown', 'Ayyukan da aka tabbatar kawai ake nunawa')}</li>
        </ul>
        <a class="btn btn-secondary" href="facilities.html">${L('Find a facility', 'Nemo cibiyar lafiya')}${icon('arrowRight')}</a>
      </article>
    </div>
  </div></section>

  <section class="section"><div class="wrap">
    ${sectionHead(L('Health topics', 'Batutuwan lafiya'), L('Learn about what matters to your family.', 'Koyi game da abin da ya shafi iyalinku.'))}
    <div class="group-grid">
      ${Object.entries(GROUPS).map(([key, g]) => `
        <a class="group-card" href="topics.html#${key}">
          <div class="group-card-img"><img loading="lazy" src="${photo(g.img)}" alt=""></div>
          <div class="group-card-body">
            <span class="group-icon">${icon(g.icon)}</span>
            <h3>${t(g)}</h3>
            <p>${t(g.desc)}</p>
            <span class="text-link">${L('Explore topics', 'Duba batutuwa')}${icon('arrowRight')}</span>
          </div>
        </a>`).join('')}
    </div>
  </div></section>

  <section class="section section-soft"><div class="wrap">
    ${sectionHead(L('How it works', 'Yadda yake aiki'), L('Simple steps, in your language.', 'Matakai masu sauƙi, a harshenku.'))}
    <ol class="steps">
      ${[
        [icon('globe'), L('Choose your language', 'Zaɓi harshe'), L('Use Lafimora in Hausa or English.', 'Yi amfani da Lafimora a Hausa ko Turanci.')],
        [icon('chat'), L('Ask a question', 'Yi tambaya'), L('Ask about pregnancy, breastfeeding, nutrition or child health.', 'Tambaya kan juna biyu, shayarwa, abinci ko lafiyar yara.')],
        [icon('pin'), L('Find a facility', 'Nemo cibiya'), L('Search for a facility by service or area and view its details.', 'Nemo cibiya ta hidima ko yanki ka duba bayananta.')],
        [icon('checkCircle'), L('Decide for yourself', 'Yanke shawara da kanka'), L('Use the information to choose where to go or who to contact.', 'Yi amfani da bayanin wajen zaɓar inda za a je ko wanda za a tuntuɓa.')]
      ].map((s, i) => `<li class="step"><span class="step-num">${i + 1}</span><span class="step-icon">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p></li>`).join('')}
    </ol>
  </div></section>

  <section class="section"><div class="wrap">
    ${sectionHead(L('Responsible by design', 'An tsara cikin kulawa'), L('Built with safety and privacy first.', 'An gina shi da tsaro da sirri a gaba.'))}
    <div class="trust-grid">
      ${[
        ['shield', L('Professionally reviewed', 'Ƙwararru sun duba'), L('Health and nutrition content is reviewed by qualified professionals.', 'Ƙwararrun ma’aikatan lafiya da abinci ne ke duba bayanai.')],
        ['building', L('Verified facilities', 'Cibiyoyin da aka tabbatar'), L('Facility details are checked and dated before they are published.', 'Ana tabbatar da bayanan cibiyoyi da sanya kwanan wata kafin wallafawa.')],
        ['lock', L('Privacy first', 'Sirri a gaba'), L('No account or medical profile is needed to use Lafimora.', 'Ba a bukatar asusu ko bayanan lafiya na sirri don amfani da Lafimora.')],
        ['info', L('Clear about AI', 'Bayyananne game da AI'), L('You always know you are talking to an AI, and what it cannot do.', 'Kullum za ka san kana magana da AI, da abin da ba zai iya yi ba.')]
      ].map(([ic, h, p]) => `<div class="trust-item"><span class="trust-icon">${icon(ic)}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}
    </div>
    <div class="callout callout-danger mt-lg">
      ${icon('alert')}
      <div><strong>${L('Lafimora is not an emergency service.', 'Lafimora ba sabis na gaggawa ba ce.')}</strong> ${L('If a mother or baby has bleeding, fits, difficult breathing or another warning sign, go to the nearest health facility now or call 112.', 'Idan uwa ko jariri na zubar jini, farfaɗiya, wahalar numfashi ko wata alamar haɗari, a je cibiyar lafiya mafi kusa yanzu ko a kira 112.')}
      <a href="topic.html?name=warning-signs" class="text-link">${L('See warning signs', 'Duba alamun haɗari')}${icon('arrowRight')}</a></div>
    </div>
  </div></section>`;
}

/* ---------- Topics ---------- */
function topicCard(tp) {
  return `<a class="topic-card" href="topic.html?name=${tp.slug}">
    <div class="topic-card-img"><img loading="lazy" src="${photo(tp.img)}" alt=""></div>
    <div class="topic-card-body">
      <h3>${t(tp.name)}</h3>
      <p>${t(tp.desc)}</p>
      <span class="text-link">${L('Read more', 'Ƙara karantawa')}${icon('arrowRight')}</span>
    </div></a>`;
}

function renderTopics() {
  $('#main').innerHTML = `
  <section class="page-header"><div class="wrap">
    <span class="eyebrow">${L('Health topics', 'Batutuwan lafiya')}</span>
    <h1>${L('Health and nutrition topics', 'Batutuwan lafiya da abinci')}</h1>
    <p class="lead">${L('General, educational information for pregnant women, breastfeeding mothers and caregivers of young children. It does not replace advice from a health worker.', 'Bayanan ilimi na gaba ɗaya ga mata masu juna biyu, masu shayarwa da masu kula da ƙananan yara. Ba ya maye gurbin shawarar ma’aikacin lafiya.')}</p>
    <nav class="jump-links" aria-label="${L('Topic groups', 'Rukunin batutuwa')}">${Object.entries(GROUPS).map(([k, g]) => `<a href="#${k}">${icon(g.icon)}${t(g)}</a>`).join('')}</nav>
  </div></section>
  <div class="wrap">
    ${Object.entries(GROUPS).map(([key, g]) => `
      <section class="topic-group" id="${key}" aria-labelledby="h-${key}">
        <div class="topic-group-head"><span class="group-icon">${icon(g.icon)}</span><div><h2 id="h-${key}">${t(g)}</h2><p>${t(g.desc)}</p></div></div>
        <div class="topic-grid">${TOPICS.filter((tp) => tp.group === key).map(topicCard).join('')}</div>
      </section>`).join('')}
    ${reviewNote()}
  </div>`;
}

function renderTopic() {
  const tp = topicBySlug(params.get('name')) || TOPICS[0];
  const g = GROUPS[tp.group];
  const related = TOPICS.filter((x) => x.group === tp.group && x.slug !== tp.slug);
  document.title = `${t(tp.name)} | Lafimora`;
  $('#main').innerHTML = `
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${L('Breadcrumb', 'Hanyar shafi')}"><a href="topics.html">${L('Health topics', 'Batutuwan lafiya')}</a><span aria-hidden="true">/</span><a href="topics.html#${tp.group}">${t(g)}</a><span aria-hidden="true">/</span><span aria-current="page">${t(tp.name)}</span></nav>
    <section class="topic-hero">
      <div>
        <span class="eyebrow">${icon(g.icon)}${t(g)}</span>
        <h1>${t(tp.name)}</h1>
        <p class="lead">${t(tp.desc)}</p>
        <div class="btn-row">
          <a class="btn btn-primary" href="chat.html?topic=${tp.slug}">${icon('chat')}${L('Ask about this topic', 'Tambaya game da wannan')}</a>
          <a class="btn btn-secondary" href="facilities.html?service=${tp.service}">${icon('pin')}${L('Find facilities', 'Nemo cibiyoyi')}</a>
        </div>
      </div>
      <div class="topic-hero-img"><img src="${photo(tp.img)}" alt="${esc(photoAlt(tp.img))}"></div>
    </section>

    ${tp.danger ? `
    <section class="danger-panel" aria-labelledby="danger-title">
      <div class="danger-panel-head">${icon('alert')}<div><h2 id="danger-title">${L('Go to a health facility now if you notice:', 'Ku je cibiyar lafiya yanzu idan kun ga:')}</h2><p>${L('Do not wait for an online answer.', 'Kada ku jira amsa ta yanar gizo.')}</p></div></div>
      <div class="danger-lists">${tp.dangerLists.map((dl) => `<div><h3>${t(dl.title)}</h3><ul>${dl.items.map((i) => `<li>${t(i)}</li>`).join('')}</ul></div>`).join('')}</div>
      <div class="btn-row"><a class="btn btn-danger" href="tel:112">${icon('phone')}${L('Call 112', 'Kira 112')}</a><a class="btn btn-secondary" href="facilities.html">${icon('pin')}${L('Find the nearest facility', 'Nemo cibiya mafi kusa')}</a></div>
    </section>` : ''}

    <div class="topic-layout">
      <article class="panel">
        <h2 class="h3">${L('Overview', 'Bayani a taƙaice')}</h2>
        <p>${t(tp.answer)}</p>
        <div class="glossary"><strong>${t(tp.term.word)}:</strong> ${t(tp.term.def)}</div>
        <div class="sources"><h3>${L('Sources', 'Madogara')}</h3><ul>${tp.sources.map((s) => `<li>${icon('book')}${esc(SOURCES[s])}</li>`).join('')}</ul></div>
        ${reviewNote()}
      </article>
      <aside class="topic-aside">
        <div class="panel">
          <h2 class="h3">${L('Ask Lafimora', 'Tambayi Lafimora')}</h2>
          <p class="muted">${L('Tap a question to ask the assistant.', 'Danna tambaya don tambayar mataimaki.')}</p>
          <div class="question-list">${tp.questions.map((q, i) => `<a class="question-link" href="chat.html?topic=${tp.slug}&q=${i}">${icon('chat')}<span>${t(q)}</span></a>`).join('')}</div>
        </div>
        <div class="panel panel-tint">
          <h2 class="h3">${L('Find care', 'Nemo kulawa')}</h2>
          <p class="muted">${L('See facilities in the directory that offer this service:', 'Duba cibiyoyin da ke ba da wannan hidima:')}</p>
          <p>${servicePill(tp.service)}</p>
          <a class="btn btn-secondary btn-block" href="facilities.html?service=${tp.service}">${icon('pin')}${L('Find facilities', 'Nemo cibiyoyi')}</a>
        </div>
      </aside>
    </div>

    ${related.length ? `<section class="related"><h2 class="h3">${L('Related topics', 'Batutuwa masu alaƙa')}</h2><div class="topic-grid">${related.map(topicCard).join('')}</div></section>` : ''}
  </div>`;
}

/* ---------- Facilities ---------- */
let userPos = null;

function distanceKm(a, b) {
  const R = 6371; const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]); const dLon = toRad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function facilityCard(f, opts = {}) {
  const dist = userPos && f.pos ? ` · ≈ ${Math.round(distanceKm(userPos, f.pos))} km` : '';
  const services = opts.service ? [opts.service, ...f.services.filter((s) => s !== opts.service)] : f.services;
  const statusClass = f.status === 'Functional' ? 'badge-verified' : f.status === 'Non-Functional' ? 'badge-alert' : 'badge-demo';
  return `<article class="facility-card${opts.compact ? ' is-compact' : ''}">
    <div class="fc-head">
      <div>
        <span class="fc-type">${icon('building')}${t(FACILITY_TYPES[f.type])}</span>
        <h3><a href="facility.html?id=${f.id}">${esc(f.name)}</a></h3>
        <p class="fc-meta">${icon('pin')}${esc(f.lga)} LGA, ${L('Kaduna State', 'Jihar Kaduna')}${dist}</p>
      </div>
      <span class="badge ${statusClass}">${esc(L(f.status || 'Status unknown', f.status === 'Functional' ? 'Cibiyar na aiki' : f.status === 'Non-Functional' ? 'Cibiyar ba ta aiki' : 'Ba a san halin aiki ba'))}</span>
    </div>
    <div class="pill-row">${services.map((s) => servicePill(s, s === opts.service)).join('')}</div>
    ${opts.compact ? '' : `<dl class="fc-facts">
      <div><dt>${icon('clock')}${L('Recorded schedule', 'Lokutan da aka rubuta')}</dt><dd>${esc(f.hours || L('Not listed', 'Ba a lissafa ba'))}</dd></div>
      <div><dt>${icon('checkCircle')}${L('Data source', 'Madogarar bayanai')}</dt><dd>${facilitySource.live ? 'Kaduna State HEFA · 2018 census' : L('Offline example', 'Misalin da ke na’ura')}</dd></div>
    </dl>
    <p class="fc-caution">${icon('info')}${L('Confirm services and opening status before you travel; directory information may have changed.', 'A tabbatar da ayyuka da lokacin buɗewa kafin tafiya; bayanan kundin na iya canzawa.')}</p>`}
    <div class="fc-actions">
      <a class="btn btn-secondary btn-sm" href="facility.html?id=${f.id}">${L('View details', 'Duba bayanai')}${icon('arrowRight')}</a>
      ${opts.compact ? '' : f.pos ? `<a class="btn btn-ghost btn-sm" href="https://www.google.com/maps/dir/?api=1&amp;destination=${encodeURIComponent(`${f.pos[0]},${f.pos[1]}`)}" target="_blank" rel="noopener">${icon('directions')}${L('Directions', 'Kwatance')}</a>` : `<span class="btn btn-ghost btn-sm is-disabled" aria-disabled="true">${icon('directions')}${L('No coordinates', 'Babu wurin taswira')}</span>`}
    </div>
  </article>`;
}

function serviceOptions(selected) {
  return Object.entries(SERVICE_CATS).map(([cat, label]) => `<optgroup label="${esc(t(label))}">${Object.entries(SERVICES).filter(([, s]) => s.cat === cat).map(([id, s]) => `<option value="${id}"${selected === id ? ' selected' : ''}>${esc(t(s))}</option>`).join('')}</optgroup>`).join('');
}

function renderFacilities() {
  const initService = SERVICES[params.get('service')] ? params.get('service') : '';
  const initLga = LGAS.includes(params.get('lga')) ? params.get('lga') : '';
  const initQ = params.get('q') || '';
  $('#main').innerHTML = `
  <section class="page-header"><div class="wrap">
    <span class="eyebrow">${L('Service discovery', 'Neman hidima')}</span>
    <h1>${L('Find a health facility', 'Nemo cibiyar lafiya')}</h1>
    <p class="lead">${L('Search for facilities offering maternal, child health and nutrition services by service or by area.', 'Nemo cibiyoyin da ke ba da ayyukan lafiyar uwa, yara da abinci ta hidima ko ta yanki.')}</p>
  </div></section>
  <div class="wrap">
    <div class="callout callout-info">${icon('info')}<div><strong>${facilitySource.live ? L('Kaduna State HEFA directory.', 'Kundin HEFA na Jihar Kaduna.') : L('Offline directory.', 'Kundin da ke na’ura.')}</strong> ${facilitySource.live ? L('These government primary-care listings come from the official Kaduna Health Facility Analytics directory and its 2018 facility census. Services and hours are historical records; confirm directly before travelling.', 'Waɗannan cibiyoyin gwamnati sun fito daga kundin Health Facility Analytics na Kaduna da ƙidayar cibiyoyi ta 2018. Ayyuka da lokuta bayanan tarihi ne; a tabbatar kafin tafiya.') : L('The official directory could not be loaded, so sample records are shown temporarily.', 'Ba a iya loda kundin hukuma ba, don haka ana nuna misalai na ɗan lokaci.') } ${facilitySource.live ? `<a class="text-link" href="${facilitySource.url}" target="_blank" rel="noopener">${L('View official source', 'Duba madogarar hukuma')}${icon('arrowRight')}</a>` : ''}</div></div>
    <form class="filter-panel" id="filters" role="search" aria-label="${L('Search facilities', 'Bincika cibiyoyi')}">
      <div class="field field-grow">
        <label for="f-q">${L('Facility name', 'Sunan cibiya')}</label>
        <div class="input-icon">${icon('search')}<input id="f-q" type="search" value="${esc(initQ)}" placeholder="${esc(L('e.g. Health Centre', 'misali: Cibiyar Lafiya'))}" autocomplete="off"></div>
      </div>
      <div class="field">
        <label for="f-service">${L('Service', 'Hidima')}</label>
        <select id="f-service"><option value="">${L('All services', 'Duk ayyuka')}</option>${serviceOptions(initService)}</select>
      </div>
      <div class="field">
        <label for="f-lga">${L('Area (LGA)', 'Yanki (ƙaramar hukuma)')}</label>
        <select id="f-lga"><option value="">${L('All of Kaduna State', 'Duk Jihar Kaduna')}</option>${LGAS.map((l) => `<option${l === initLga ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>
      </div>
      <div class="field field-action">
        <button type="button" class="btn btn-secondary" id="f-near">${icon('locate')}<span>${L('Near me', 'Kusa da ni')}</span></button>
      </div>
    </form>
    <p class="hint">${icon('lock')}<span id="f-loc-msg">${L('“Near me” asks for your location once to sort results. It stays in this browser and is not stored or sent anywhere.', '“Kusa da ni” na neman wurinku sau ɗaya don tsara sakamako. Yana zama a wannan burauza kawai, ba a ajiye shi ko aika shi ko’ina.')}</span></p>
    <div class="results-bar"><span id="f-count" aria-live="polite"></span><button type="button" class="link-btn" id="f-reset">${L('Clear filters', 'Share zaɓuɓɓuka')}</button></div>
    <div id="f-results" class="facility-grid"></div>
  </div>`;

  const q = $('#f-q'); const svc = $('#f-service'); const lga = $('#f-lga');
  function apply() {
    const term = q.value.trim().toLowerCase();
    let list = FACILITIES.filter((f) => (!term || [f.name, f.address, f.ward, f.lga].some((value) => String(value || '').toLowerCase().includes(term))) && (!svc.value || f.services.includes(svc.value)) && (!lga.value || f.lga === lga.value));
    if (userPos) list = [...list].sort((a, b) => (a.pos ? distanceKm(userPos, a.pos) : Infinity) - (b.pos ? distanceKm(userPos, b.pos) : Infinity));
    else list = [...list].sort((a, b) => (a.status === 'Functional' ? -1 : 0) - (b.status === 'Functional' ? -1 : 0) || a.name.localeCompare(b.name));
    $('#f-count').textContent = L(`${list.length} of ${FACILITIES.length} primary-care facilities`, `${list.length} daga cikin cibiyoyin lafiya ${FACILITIES.length}`);
    $('#f-reset').hidden = !(term || svc.value || lga.value || userPos);
    $('#f-results').innerHTML = list.length ? list.map((f) => facilityCard(f, { service: svc.value })).join('')
      : `<div class="empty-state">${icon('search')}<h3>${L('No facilities match your search', 'Babu cibiyar da ta dace da bincikenku')}</h3><p>${L('Try another service or area, or clear the filters.', 'Gwada wata hidima ko yanki, ko a share zaɓuɓɓuka.')}</p></div>`;
    const p = new URLSearchParams();
    if (svc.value) p.set('service', svc.value);
    if (lga.value) p.set('lga', lga.value);
    if (term) p.set('q', q.value.trim());
    try { history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname); } catch (e) { /* file:// in some browsers */ }
  }
  $('#filters').addEventListener('submit', (e) => { e.preventDefault(); apply(); });
  q.addEventListener('input', apply); svc.addEventListener('change', apply); lga.addEventListener('change', apply);
  $('#f-reset').addEventListener('click', () => { q.value = ''; svc.value = ''; lga.value = ''; userPos = null; $('#f-near').classList.remove('is-active'); apply(); });
  $('#f-near').addEventListener('click', () => {
    const msg = $('#f-loc-msg');
    if (!('geolocation' in navigator)) { msg.textContent = L('Location is not available in this browser. Choose an area instead.', 'Ba a samun wuri a wannan burauza. A zaɓi yanki maimakon haka.'); return; }
    msg.textContent = L('Requesting your location…', 'Ana neman wurinku…');
    navigator.geolocation.getCurrentPosition((pos) => {
      userPos = [pos.coords.latitude, pos.coords.longitude];
      $('#f-near').classList.add('is-active');
      msg.textContent = L('Sorted by approximate distance using published HEFA coordinates. Your location was not stored.', 'An tsara ta kusanci da wuraren da HEFA ta wallafa. Ba a ajiye wurinku ba.');
      apply();
    }, () => {
      msg.textContent = L('Location permission was not given. You can choose an area (LGA) instead.', 'Ba a ba da izinin wuri ba. Kuna iya zaɓar yanki (ƙaramar hukuma).');
    }, { maximumAge: 600000, timeout: 10000 });
  });
  apply();
}

function renderFacility() {
  const f = FACILITIES.find((x) => x.id === params.get('id')) || FACILITIES[0];
  document.title = `${f.name} | Lafimora`;
  const list = (cat) => {
    const items = f.services.filter((s) => SERVICES[s].cat === cat);
    return items.length ? `<ul class="service-list">${items.map((s) => `<li>${icon('checkCircle')}${esc(t(SERVICES[s]))}</li>`).join('')}</ul>`
      : `<p class="muted">${L('No confirmed services in this category.', 'Babu ayyukan da aka tabbatar a wannan rukuni.')}</p>`;
  };
  $('#main').innerHTML = `
  <div class="wrap">
    <nav class="breadcrumb" aria-label="${L('Breadcrumb', 'Hanyar shafi')}"><a href="facilities.html">${L('Find a facility', 'Nemo cibiyar lafiya')}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(f.name)}</span></nav>
    <section class="facility-header">
      <span class="fc-type">${icon('building')}${t(FACILITY_TYPES[f.type])}</span>
      <h1>${esc(f.name)} <span class="badge ${f.status === 'Functional' ? 'badge-verified' : 'badge-demo'}">HEFA</span></h1>
      <p class="fc-meta">${icon('pin')}${esc(f.ward ? `${f.ward} Ward, ` : '')}${esc(f.lga)} LGA, ${L('Kaduna State', 'Jihar Kaduna')}</p>
    </section>
    <div class="callout callout-warning">${icon('alert')}<div><strong>${L('Confirm before travelling.', 'A tabbatar kafin tafiya.')}</strong> ${L('This facility is listed by Kaduna State HEFA, but its recorded services, hours and functionality may have changed since collection.', 'HEFA ta Jihar Kaduna ta lissafa wannan cibiya, amma ayyuka, lokuta da yanayin aiki na iya canzawa tun lokacin tattara bayanai.')}</div></div>
    <div class="detail-layout">
      <div class="detail-main">
        <section class="panel">
          <h2 class="h3">${t(SERVICE_CATS.mch)}</h2>
          ${list('mch')}
          <h2 class="h3 mt">${t(SERVICE_CATS.nutrition)}</h2>
          ${list('nutrition')}
          <p class="hint">${icon('info')}<span>${L('Only services confirmed through approved facility information are listed.', 'Ayyukan da aka tabbatar ta ingantattun bayanan cibiya kawai ake lissafawa.')}</span></p>
        </section>
        <section class="panel">
          <h2 class="h3">${L('Location', 'Wuri')}</h2>
          <div class="map-placeholder">${icon('map')}<p>${f.pos ? L('Use the published HEFA coordinates to open directions. Confirm the destination locally before travelling.', 'Yi amfani da wurin da HEFA ta wallafa don buɗe kwatance. A tabbatar da wurin a gida kafin tafiya.') : L('HEFA does not provide coordinates for this record.', 'HEFA ba ta bayar da wurin taswira ga wannan bayanin ba.')}</p>${f.pos ? `<a class="btn btn-secondary btn-sm" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(`${f.pos[0]},${f.pos[1]}`)}" target="_blank" rel="noopener">${icon('map')}${L('Open map', 'Buɗe taswira')}</a>` : ''}</div>
        </section>
      </div>
      <aside class="panel detail-aside">
        <h2 class="h3">${L('Facility details', 'Bayanan cibiya')}</h2>
        <dl class="detail-list">
          <div><dt>${icon('pin')}${L('Recorded address', 'Adireshin da aka rubuta')}</dt><dd>${esc(f.address || L('Not listed', 'Ba a lissafa ba'))}</dd></div>
          <div><dt>${icon('clock')}${L('Recorded schedule', 'Lokutan da aka rubuta')}</dt><dd>${esc(f.hours || L('Not listed', 'Ba a lissafa ba'))}</dd></div>
          <div><dt>${icon('phone')}${L('Phone', 'Waya')}</dt><dd>${L('Not available', 'Babu')}</dd></div>
          <div><dt>${icon('checkCircle')}${L('HEFA status', 'Matsayin HEFA')}</dt><dd>${esc(f.status || L('Unknown', 'Ba a sani ba'))}</dd></div>
          <div><dt>${icon('shield')}${L('Security status', 'Matsayin tsaro')}</dt><dd>${esc(f.security || L('Unknown', 'Ba a sani ba'))}</dd></div>
          <div><dt>${icon('book')}${L('Source', 'Madogara')}</dt><dd><a class="text-link" href="${facilitySource.url || 'https://directory.hefa.kdbs.ng/'}" target="_blank" rel="noopener">Kaduna State HEFA · 2018</a></dd></div>
        </dl>
        <div class="btn-stack">
          ${f.pos ? `<a class="btn btn-primary" href="https://www.google.com/maps/dir/?api=1&amp;destination=${encodeURIComponent(`${f.pos[0]},${f.pos[1]}`)}" target="_blank" rel="noopener">${icon('directions')}${L('Get directions', 'Samu kwatance')}</a>` : `<span class="btn btn-primary is-disabled" aria-disabled="true">${icon('directions')}${L('Directions unavailable', 'Babu kwatance')}</span>`}
          <span class="btn btn-secondary is-disabled" aria-disabled="true">${icon('phone')}${L('Call facility', 'Kira cibiya')}</span>
        </div>
        <p class="fc-caution">${icon('info')}${L('Lafimora does not book appointments or make referrals. Contact the facility directly before visiting.', 'Lafimora ba ta ɗaukar alƙawari ko tura marasa lafiya. A tuntuɓi cibiyar kai tsaye kafin ziyara.')}</p>
        <a class="text-link" href="chat.html${f.services[0] ? `?topic=${(TOPICS.find((tp) => tp.service === f.services[0]) || TOPICS[1]).slug}` : ''}">${L('Ask Lafimora about these services', 'Tambayi Lafimora game da waɗannan ayyuka')}${icon('arrowRight')}</a>
      </aside>
    </div>
  </div>`;
}

/* ---------- Chat (document §7.1 D–G, §7.2E, §9.5, §10.3, §10.6) ----------
   Conversational layout in the style of current AI assistants:
   - Empty state: centred welcome, composer and suggestion cards.
   - First message: the composer glides to the bottom (FLIP animation) and the thread opens.
   - Replies show a "thinking" state, then stream in word by word; sources and actions fade in after. */
const chat = { msgs: [], lastTopic: null, busy: false, paramsUsed: false, stick: true };
let msgId = 0;
let streamTimer = null;

const EMERGENCY_EN = /\b(bleed(ing)?|blood|convuls\w*|seizures?|fits?|fitting|unconscious|faint(ed|ing)?|not breathing|can'?t breathe|difficulty breathing|hard to breathe|severe (headache|pain|bleeding)|blurred vision|high fever|fever|water (has )?broken?|not moving|not feeding|stopped feeding|chest pain|emergency)\b/i;
const EMERGENCY_HA = /(zubar jini|\bjini\b|farfa[ɗd]iya|jijjiga|\bsuma\b|zazza[ɓb]i|numfashi|ciwon kai mai tsanani|ciwo mai tsanani|ba ya motsi|ba ta motsi|baya motsi|gaggawa|ruwan haihuwa)/i;
const FACILITY_INTENT = /\b(where|find|nearest|near me|facility|facilities|clinic|hospital|centre|center)\b|a ina|ina zan|asibiti|cibiya|kusa da/i;
const SERVICE_WORDS = [
  ['anc', /antenatal|\banc\b|awon ciki|pregnan|juna biyu/i],
  ['pnc', /postnatal|after (birth|delivery)|bayan haihuwa/i],
  ['bf', /breast|shayar|nono/i],
  ['growth', /growth|auna girma|weigh/i],
  ['nutrition', /nutrition|diet|food|abinci/i],
  ['child', /child|baby|infant|vaccin|immuni|jariri|yaro|yara|rigakafi/i],
  ['maternal', /maternal|mother|lafiyar uwa/i]
];
const TOPIC_WORDS = [
  ['complementary-feeding', /complementar|solid food|start(ing)? (eating|food)|six months|6 months|wata shida|[ƙk]arin abinci/i],
  ['malnutrition', /malnutri|wasting|stunt|underweight|tamowa/i],
  ['prevention', /vaccin|immuni[sz]|rigakafi|allura|prevent/i],
  ['warning-signs', /danger|warning sign|alamun ha|ha[ɗd]ari/i],
  ['breastfeeding-nutrition', /breastfeed\w*.*(eat|food|diet|drink)|(eat|food|diet|drink)\w*.*breastfeed|abinci.*shayarwa|lokacin shayarwa/i],
  ['breastfeeding', /breast|exclusive|shayar|nono/i],
  ['pregnancy-nutrition', /pregnan\w*.*(eat|food|diet)|(eat|food|diet)\w*.*pregnan|abinci.*juna biyu|\biron\b|folic/i],
  ['dietary-diversity', /divers|food group|rukunin abinci|iri-iri|balanced/i],
  ['child-feeding', /child\w*.*(eat|food|feed)|toddler|growth monitoring|auna girma|ciyar da yara/i],
  ['postnatal', /postnatal|postpartum|after (birth|delivery)|bayan haihuwa|recover/i],
  ['antenatal', /antenatal|\banc\b|awon ciki|check-?up|clinic visit/i],
  ['pregnancy', /pregnan|juna biyu|mai ciki/i],
  ['dietary-diversity', /food|eat|diet|nutrition|abinci/i]
];
const match = (rules, text) => (rules.find(([, re]) => re.test(text)) || [])[0] || null;

const SUGGESTIONS = [
  { icon: 'heart', title: { en: 'Pregnancy', ha: 'Juna biyu' }, chip: { kind: 'ask', slug: 'antenatal', i: 0 } },
  { icon: 'smile', title: { en: 'Breastfeeding', ha: 'Shayarwa' }, chip: { kind: 'ask', slug: 'breastfeeding', i: 0 } },
  { icon: 'leaf', title: { en: 'Baby’s first foods', ha: 'Abincin farko na jariri' }, chip: { kind: 'ask', slug: 'complementary-feeding', i: 1 } },
  { icon: 'pin', title: { en: 'Find care', ha: 'Nemo kulawa' }, chip: { kind: 'facility', service: 'anc' } }
];

function chipAttr(c) { return `data-chip='${esc(JSON.stringify(c))}'`; }
function chipsHTML(chips) {
  return `<div class="chips">${chips.map((c) => `<button type="button" class="chip-btn" ${chipAttr(c)}>${esc(chipLabel(c))}</button>`).join('')}</div>`;
}
function chipLabel(c) {
  if (c.kind === 'ask') return t(topicBySlug(c.slug).questions[c.i || 0]);
  if (c.kind === 'simple') return L('Explain more simply', 'Bayyana a sauƙaƙe');
  if (c.kind === 'term') return L(`What does “${topicBySlug(c.slug).term.word.en}” mean?`, `Menene ma’anar “${topicBySlug(c.slug).term.word.ha}”?`);
  if (c.kind === 'facility') return c.service ? L(`Find a facility for ${t(SERVICES[c.service]).toLowerCase()}`, `Nemo cibiya don ${t(SERVICES[c.service]).toLowerCase()}`) : L('Find a health facility', 'Nemo cibiyar lafiya');
  return '';
}

function actionsHTML(m) {
  const voted = m.feedback;
  return `<div class="msg-actions">
    <button type="button" class="icon-btn" data-copy="${m.id}" aria-label="${esc(L('Copy answer', 'Kwafi amsa'))}" title="${esc(L('Copy', 'Kwafi'))}">${icon('copy')}</button>
    <button type="button" class="icon-btn${voted === 'yes' ? ' is-on' : ''}" data-feedback="${m.id}" data-value="yes" aria-pressed="${voted === 'yes'}" aria-label="${esc(L('Helpful', 'Ya taimaka'))}" title="${esc(L('Helpful', 'Ya taimaka'))}">${icon('thumbUp')}</button>
    <button type="button" class="icon-btn${voted === 'no' ? ' is-on' : ''}" data-feedback="${m.id}" data-value="no" aria-pressed="${voted === 'no'}" aria-label="${esc(L('Not helpful', 'Bai taimaka ba'))}" title="${esc(L('Not helpful', 'Bai taimaka ba'))}">${icon('thumbDown')}</button>
    ${voted ? `<span class="msg-thanks">${L('Thanks for your feedback', 'Mun gode da ra’ayinku')}</span>` : ''}
  </div>`;
}

function botHTML(m) {
  const tp = m.slug ? topicBySlug(m.slug) : null;
  switch (m.kind) {
    case 'answer':
      return `<div class="msg-text" data-stream><p>${t(tp.answer)}</p></div>
        <div class="msg-extra">
          <div class="msg-sources"><span class="msg-sources-title">${icon('book')}${L('Sources', 'Madogara')}</span><ul>${tp.sources.map((s) => `<li>${esc(SOURCES[s])}</li>`).join('')}</ul><span class="msg-sample">${L('Sample answer for demonstration · pending professional review', 'Amsar gwaji · ana jiran duba daga ƙwararru')}</span></div>
          ${chipsHTML([{ kind: 'simple', slug: tp.slug }, { kind: 'term', slug: tp.slug }, { kind: 'facility', service: tp.service }])}
          ${actionsHTML(m)}
        </div>`;
    case 'simple':
      return `<div class="msg-text" data-stream><p>${t(tp.simple)}</p></div><div class="msg-extra">${chipsHTML([{ kind: 'term', slug: tp.slug }, { kind: 'facility', service: tp.service }])}</div>`;
    case 'term':
      return `<div class="msg-text" data-stream><p><strong>${t(tp.term.word)}</strong> — ${t(tp.term.def)}</p></div>`;
    case 'facilities': {
      const list = FACILITIES.filter((f) => !m.service || f.services.includes(m.service))
        .sort((a, b) => (b.status === 'Functional') - (a.status === 'Functional'))
        .slice(0, 3);
      const intro = m.service
        ? L(`Here are facilities in the directory that list <strong>${esc(t(SERVICES[m.service]).toLowerCase())}</strong>:`, `Ga cibiyoyin da ke cikin kundin da ke ba da <strong>${esc(t(SERVICES[m.service]).toLowerCase())}</strong>:`)
        : L('Here are some facilities in the directory. You can filter by service or area:', 'Ga wasu cibiyoyi a cikin kundin. Kuna iya tacewa ta hidima ko yanki:');
      const note = facilitySource.live
        ? L('Listings come from the Kaduna State HEFA directory (2018 census). Services and opening status may have changed — contact the facility before you go. Lafimora does not book appointments.', 'Bayanan sun fito daga kundin HEFA na Jihar Kaduna (ƙidayar 2018). Ayyuka da lokacin buɗewa na iya canzawa — a tuntuɓi cibiyar kafin a je. Lafimora ba ta ɗaukar alƙawari.')
        : L('These are offline examples. Opening status is not confirmed, and Lafimora does not book appointments — contact the facility directly.', 'Waɗannan misalai ne. Ba a tabbatar da buɗewa ba, kuma Lafimora ba ta ɗaukar alƙawari — a tuntuɓi cibiyar kai tsaye.');
      return `<div class="msg-text" data-stream><p>${intro}</p></div>
        <div class="msg-extra">
          <div class="msg-facilities">${list.map((f) => facilityCard(f, { compact: true, service: m.service })).join('')}</div>
          <a class="text-link" href="facilities.html${m.service ? `?service=${m.service}` : ''}">${L('See all in the directory', 'Duba duka a cikin kundin')}${icon('arrowRight')}</a>
          <p class="msg-note">${icon('info')}<span>${note}</span></p>
        </div>`;
    }
    case 'emergency':
      return `<div class="msg-emergency">
        <div class="msg-emergency-head">${icon('alert')}<strong>${L('This may be urgent', 'Wannan na iya zama gaggawa')}</strong></div>
        <p>${L('Please seek care now. Go to the nearest health facility or call 112. Do not wait for an online answer.', 'Don Allah a nemi kulawa yanzu. A je cibiyar lafiya mafi kusa ko a kira 112. Kada a jira amsa ta yanar gizo.')}</p>
        <div class="btn-row"><a class="btn btn-danger btn-sm" href="tel:112">${icon('phone')}${L('Call 112', 'Kira 112')}</a><a class="btn btn-secondary btn-sm" href="facilities.html">${icon('pin')}${L('Find a facility', 'Nemo cibiya')}</a></div>
      </div>
      <p class="msg-note">${icon('info')}<span>${L('Lafimora cannot assess symptoms. A health worker needs to see the mother or child.', 'Lafimora ba za ta iya tantance alamun rashin lafiya ba. Dole ma’aikacin lafiya ya ga uwa ko yaro.')}</span></p>`;
    case 'fallback':
      return `<div class="msg-text" data-stream><p>${L('I could not find approved information for that question. I can help with maternal and child health and nutrition topics — for anything else, please ask a health worker. You could try:', 'Ban samu ingantaccen bayani kan wannan tambaya ba. Ina iya taimakawa kan lafiyar uwa da yara da abinci — don wani abu daban, a tambayi ma’aikacin lafiya. Kuna iya gwada:')}</p></div>
        <div class="msg-extra">${chipsHTML([{ kind: 'ask', slug: 'pregnancy-nutrition', i: 0 }, { kind: 'ask', slug: 'postnatal', i: 0 }, { kind: 'ask', slug: 'warning-signs', i: 0 }, { kind: 'facility' }])}</div>`;
    default: return '';
  }
}

function userText(m) { return m.text != null ? esc(m.text) : esc(chipLabel(m.chip)); }

function msgHTML(m) {
  return m.from === 'user'
    ? `<div class="msg msg-user" data-id="${m.id}"><div class="bubble">${userText(m)}</div></div>`
    : `<div class="msg msg-bot" data-id="${m.id}"><span class="msg-avatar" aria-hidden="true">${brandMark('msg-logo')}</span><div class="msg-body">${botHTML(m)}</div></div>`;
}

/* ----- scrolling ----- */
const scroller = () => $('#chat-scroll');
function keepBottom(force = false) {
  const s = scroller();
  if (s && (force || chat.stick)) s.scrollTop = s.scrollHeight;
}
function onThreadScroll() {
  const s = scroller();
  if (!s) return;
  chat.stick = s.scrollHeight - s.scrollTop - s.clientHeight < 80;
  $('#scroll-down')?.classList.toggle('is-visible', !chat.stick);
}

/* ----- rendering ----- */
function drawMessages() {
  clearTimeout(streamTimer);
  const box = $('#chat-messages');
  if (!box) return;
  box.innerHTML = chat.msgs.map(msgHTML).join('');
  $$('.msg-extra', box).forEach((x) => x.classList.add('is-shown'));
  chat.busy = false;
  updateSend();
  keepBottom(true);
}

function appendMessage(m, { stream = false } = {}) {
  const box = $('#chat-messages');
  if (!box) return null;
  box.insertAdjacentHTML('beforeend', msgHTML(m));
  const el = box.lastElementChild;
  if (!motionReduced.matches) el.classList.add('is-entering');
  if (stream) streamInto(el, () => { chat.busy = false; updateSend(); });
  else $$('.msg-extra', el).forEach((x) => x.classList.add('is-shown'));
  keepBottom(true);
  return el;
}

/* Word-by-word reveal of the main text, then sources/actions fade in */
function streamInto(el, done) {
  const extras = $$('.msg-extra', el);
  const finish = () => { extras.forEach((x) => x.classList.add('is-shown')); keepBottom(); done(); };
  const jobs = $$('[data-stream]', el).map((node) => ({ node, tokens: node.innerHTML.split(/(\s+)/) }));
  if (motionReduced.matches || !jobs.length) return finish();
  jobs.forEach((j) => { j.node.innerHTML = ''; });
  const total = jobs.reduce((n, j) => n + j.tokens.length, 0);
  const step = Math.max(2, Math.ceil(total / 70));
  let ji = 0; let n = 0;
  const tick = () => {
    const j = jobs[ji];
    n = Math.min(n + step, j.tokens.length);
    j.node.innerHTML = j.tokens.slice(0, n).join('') + '<span class="caret" aria-hidden="true"></span>';
    keepBottom();
    if (n >= j.tokens.length) {
      j.node.innerHTML = j.tokens.join('');
      ji += 1; n = 0;
      if (ji >= jobs.length) return finish();
    }
    streamTimer = setTimeout(tick, 28);
  };
  tick();
}

function showThinking() {
  const box = $('#chat-messages');
  if (!box) return null;
  box.insertAdjacentHTML('beforeend', `<div class="msg msg-bot thinking" id="thinking"><span class="msg-avatar" aria-hidden="true">${brandMark('msg-logo')}</span><div class="msg-body"><span class="thinking-text">${L('Lafimora is thinking', 'Lafimora na tunani')}</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></div></div>`);
  keepBottom(true);
  return box.lastElementChild;
}

function pushBot(m) {
  chat.busy = true; updateSend();
  const wait = motionReduced.matches ? 0 : (m.kind === 'emergency' ? 350 : 750);
  const thinking = wait ? showThinking() : null;
  setTimeout(() => {
    thinking?.remove();
    const msg = { from: 'bot', id: ++msgId, ...m };
    chat.msgs.push(msg);
    appendMessage(msg, { stream: m.kind !== 'emergency' });
    if (m.kind === 'emergency') { chat.busy = false; updateSend(); }
  }, wait);
}

function pushUser(m) {
  const msg = { from: 'user', id: ++msgId, ...m };
  chat.msgs.push(msg);
  setChatMode('active');
  appendMessage(msg);
}

/* ----- empty ⇄ active transition (FLIP) ----- */
function setChatMode(mode) {
  const shell = $('.chat-shell');
  if (!shell || shell.dataset.mode === mode) return;
  const form = $('#chat-compose');
  const first = form.getBoundingClientRect();
  shell.dataset.mode = mode;
  const last = form.getBoundingClientRect();
  if (motionReduced.matches || !form.animate) return;
  form.animate(
    [{ transform: `translate(${first.left - last.left}px, ${first.top - last.top}px)` }, { transform: 'none' }],
    { duration: 560, easing: 'cubic-bezier(.22, .9, .24, 1)' }
  );
}

/* ----- input handling ----- */
function handleChip(c) {
  if (chat.busy) return;
  pushUser({ chip: c });
  if (c.kind === 'ask') { chat.lastTopic = c.slug; pushBot({ kind: 'answer', slug: c.slug }); }
  else if (c.kind === 'simple') pushBot({ kind: 'simple', slug: c.slug });
  else if (c.kind === 'term') pushBot({ kind: 'term', slug: c.slug });
  else if (c.kind === 'facility') pushBot({ kind: 'facilities', service: c.service || null });
}

function respond(text) {
  if (chat.busy) return;
  pushUser({ text });
  if (EMERGENCY_EN.test(text) || EMERGENCY_HA.test(text)) return pushBot({ kind: 'emergency' });
  if (FACILITY_INTENT.test(text)) return pushBot({ kind: 'facilities', service: match(SERVICE_WORDS, text) });
  if (/simpl|sau[ƙk]a/i.test(text) && chat.lastTopic) return pushBot({ kind: 'simple', slug: chat.lastTopic });
  const slug = match(TOPIC_WORDS, text);
  if (slug) { chat.lastTopic = slug; return pushBot({ kind: 'answer', slug }); }
  pushBot({ kind: 'fallback' });
}

function updateSend() {
  const input = $('#chat-input'); const btn = $('.composer-send');
  if (!input || !btn) return;
  btn.disabled = chat.busy || !input.value.trim();
}

function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
}

function newChat() {
  clearTimeout(streamTimer);
  chat.msgs = []; chat.lastTopic = null; chat.busy = false; chat.stick = true;
  $('#chat-messages').innerHTML = '';
  setChatMode('empty');
  updateSend();
  $('#chat-input').focus();
}

async function copyAnswer(id, btn) {
  const node = $(`.msg[data-id="${id}"] .msg-text`);
  if (!node) return;
  try {
    await navigator.clipboard.writeText(node.innerText.trim());
    btn.innerHTML = icon('check');
    setTimeout(() => { btn.innerHTML = icon('copy'); }, 1500);
  } catch (e) { /* clipboard unavailable (e.g. file://) */ }
}

function renderChat() {
  const greeting = L('How can I help you today?', 'Me zan taimaka muku da shi yau?');
  $('#main').innerHTML = `
  <div class="chat-shell" data-mode="empty">
    <div class="chat-toolbar"><div class="chat-col chat-toolbar-inner">
      <span class="chat-toolbar-title">${brandMark('toolbar-logo')}<strong>Lafimora</strong><span class="badge badge-ai">AI</span><span class="hide-sm muted">· ${L('Information only, not medical advice', 'Bayani kawai, ba shawarar likita ba')}</span></span>
      <button type="button" class="btn btn-secondary btn-sm" id="new-chat">${icon('plus')}${L('New chat', 'Sabuwar hira')}</button>
    </div></div>

    <div class="chat-scroll" id="chat-scroll">
      <div class="chat-col">
        <section class="chat-welcome" aria-labelledby="chat-greeting">
          <div class="welcome-logo">${brandMark('welcome-mark')}</div>
          <h1 id="chat-greeting">${greeting}</h1>
          <p>${L('Ask in your own words, in Hausa or English. I share general, reviewed information about pregnancy, breastfeeding and child nutrition — and help you find health facilities.', 'Yi tambaya da kalmominku, a Hausa ko Turanci. Ina ba da bayanan gaba ɗaya da aka duba kan juna biyu, shayarwa da abincin yara — kuma ina taimakawa wajen nemo cibiyoyin lafiya.')}</p>
        </section>
        <div class="chat-messages" id="chat-messages" role="log" aria-live="polite" aria-label="${esc(L('Conversation with Lafimora', 'Hira da Lafimora'))}"></div>
      </div>
    </div>

    <div class="chat-dock"><div class="chat-col">
      <button type="button" class="scroll-down" id="scroll-down" aria-label="${esc(L('Scroll to latest message', 'Je zuwa saƙo na ƙarshe'))}">${icon('arrowDown')}</button>
      <form class="composer" id="chat-compose">
        <label for="chat-input" class="sr-only">${L('Your question', 'Tambayarku')}</label>
        <textarea id="chat-input" rows="1" maxlength="500" autocomplete="off" placeholder="${esc(L('Ask Lafimora a health question…', 'Tambayi Lafimora tambayar lafiya…'))}"></textarea>
        <div class="composer-bar">
          <button type="button" class="composer-lang" data-lang-toggle title="${esc(L('Switch to Hausa', 'Canza zuwa Turanci'))}">${icon('globe')}${L('English', 'Hausa')}</button>
          <span class="composer-spacer"></span>
          <span class="composer-hint">${L('Enter to send · Shift + Enter for a new line', 'Enter don aikawa · Shift + Enter don sabon layi')}</span>
          <button type="submit" class="composer-send" aria-label="${esc(L('Send', 'Aika'))}" disabled>${icon('arrowUp')}</button>
        </div>
      </form>
      <div class="chat-suggest">
        ${SUGGESTIONS.map((s, i) => `<button type="button" class="suggest-card" style="--i:${i}" ${chipAttr(s.chip)}><span class="suggest-icon">${icon(s.icon)}</span><span><strong>${t(s.title)}</strong><small>${esc(chipLabel(s.chip))}</small></span></button>`).join('')}
        <a class="suggest-more" href="topics.html">${icon('book')}${L('Browse all health topics', 'Duba duk batutuwan lafiya')}</a>
      </div>
      <p class="chat-footnote">${icon('lock')}<span>${L('Lafimora is an AI and can make mistakes. Information only — not medical advice. Do not share names, phone numbers or personal medical details.', 'Lafimora AI ce kuma tana iya yin kuskure. Bayani kawai — ba shawarar likita ba. Kada ku rubuta suna, lambar waya ko bayanan lafiya na sirri.')} <a href="tel:112">${L('Emergency? Call 112', 'Gaggawa? Kira 112')}</a></span></p>
    </div></div>
  </div>`;

  const input = $('#chat-input');
  const send = () => {
    const v = input.value.trim();
    if (!v || chat.busy) return;
    input.value = ''; autoGrow(input); updateSend();
    respond(v);
  };
  $('#chat-compose').addEventListener('submit', (e) => { e.preventDefault(); send(); });
  input.addEventListener('input', () => { autoGrow(input); updateSend(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); }
  });
  $('[data-lang-toggle]').addEventListener('click', () => setLanguage(lang === 'en' ? 'ha' : 'en'));
  $('#new-chat').addEventListener('click', newChat);
  $('#scroll-down').addEventListener('click', () => { chat.stick = true; scroller().scrollTo({ top: scroller().scrollHeight, behavior: motionReduced.matches ? 'auto' : 'smooth' }); });
  scroller().addEventListener('scroll', onThreadScroll, { passive: true });

  // Event delegation: chips, suggestions, feedback, copy
  $('#main').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-chip]');
    if (chip) { handleChip(JSON.parse(chip.dataset.chip)); return; }
    const fb = e.target.closest('[data-feedback]');
    if (fb) {
      const m = chat.msgs.find((x) => x.id === Number(fb.dataset.feedback));
      if (m) {
        m.feedback = fb.dataset.value;
        const actions = fb.closest('.msg-actions');
        actions.outerHTML = actionsHTML(m);
      }
      return;
    }
    const cp = e.target.closest('[data-copy]');
    if (cp) copyAnswer(cp.dataset.copy, cp);
  });

  if (chat.msgs.length) {
    // Language switch mid-conversation: keep the thread, re-render it in the new language
    $('.chat-shell').dataset.mode = 'active';
    drawMessages();
  } else if (!chat.paramsUsed) {
    chat.paramsUsed = true;
    const slug = params.get('topic');
    const ask = (params.get('ask') || '').trim().slice(0, 500);
    if (slug || ask) {
      try { history.replaceState(null, '', location.pathname); } catch (e) { /* ignore */ }
      // Short pause so the arrival animation is visible
      setTimeout(() => {
        if (slug && topicBySlug(slug)) {
          const i = Math.min(Number(params.get('q')) || 0, topicBySlug(slug).questions.length - 1);
          handleChip({ kind: 'ask', slug, i });
        } else if (ask) respond(ask);
      }, motionReduced.matches ? 0 : 350);
    }
  }
  if (window.matchMedia('(pointer: fine)').matches) input.focus({ preventScroll: true });
}

/* ---------- About ---------- */
function renderAbout() {
  $('#main').innerHTML = `
  <section class="page-header"><div class="wrap">
    <span class="eyebrow">${L('About Lafimora', 'Game da Lafimora')}</span>
    <h1>${L('Better information. Healthier mothers and children.', 'Ingantaccen bayani. Lafiyar uwa da yara.')}</h1>
    <p class="lead">${L('Lafimora combines <strong>LAFI</strong>, from the Hausa word <em>lafiya</em> (health and wellbeing), with <strong>MORA</strong>: Motherhood, Outreach, Resources and Awareness.', 'Lafimora ta haɗa <strong>LAFI</strong>, daga kalmar Hausa <em>lafiya</em>, da <strong>MORA</strong>: Motherhood, Outreach, Resources and Awareness (Uwa, Isar da saƙo, Albarkatu da Wayar da kai).')}</p>
  </div></section>
  <div class="wrap">
    <section class="split section-sm">
      <div class="split-img"><img loading="lazy" src="${photo('community')}" alt="${esc(photoAlt('community'))}"></div>
      <div>
        <h2>${L('Why Lafimora', 'Me yasa Lafimora')}</h2>
        <p>${L('Health services and information exist, but it is not always easy to find, understand or trust them — especially in a familiar language. Lafimora brings verified maternal and child health information and healthcare service discovery together in one simple, multilingual place.', 'Akwai ayyukan lafiya da bayanai, amma ba koyaushe ake samun su, fahimtar su ko amincewa da su cikin sauƙi ba — musamman a harshen da aka saba. Lafimora ta haɗa ingantattun bayanan lafiyar uwa da yara da neman cibiyoyin lafiya a wuri ɗaya mai sauƙi.')}</p>
        <p>${L('Lafimora is developed by <strong>YandyTech Community</strong>, a Kaduna-based youth-led organisation, through its <strong>SolutionLab</strong> programme, with support from qualified public-health and nutrition professionals. The pilot begins in Kaduna State, Nigeria.', '<strong>YandyTech Community</strong>, ƙungiyar matasa a Kaduna, ce ke haɓaka Lafimora ta shirinta na <strong>SolutionLab</strong>, tare da tallafin ƙwararrun ma’aikatan lafiya da abinci. Gwajin farko zai fara a Jihar Kaduna, Najeriya.')}</p>
        <p class="who">${icon('users')}${L('For pregnant women, breastfeeding mothers, and mothers and caregivers of young children.', 'Domin mata masu juna biyu, masu shayarwa, da iyaye da masu kula da ƙananan yara.')}</p>
      </div>
    </section>

    <section class="section-sm" id="limits">
      ${sectionHead(L('Scope', 'Iyaka'), L('What Lafimora does — and does not do', 'Abin da Lafimora ke yi — da abin da ba ta yi'))}
      <div class="does-grid">
        <div class="panel does">
          <h3>${icon('checkCircle')}${L('Lafimora does', 'Lafimora na')}</h3>
          <ul>${[
            L('Share general, professionally reviewed health and nutrition information', 'Ba da bayanan lafiya da abinci na gaba ɗaya da ƙwararru suka duba'),
            L('Explain information clearly in Hausa or English', 'Bayyana bayanai a sauƙaƙe a Hausa ko Turanci'),
            L('Help you find facilities and their confirmed services', 'Taimaka muku nemo cibiyoyi da ayyukansu da aka tabbatar'),
            L('Point you to urgent care when a question may be an emergency', 'Tura ku zuwa kulawar gaggawa idan tambaya na iya zama gaggawa'),
            L('Tell you clearly that you are using an AI system', 'Sanar da ku a fili cewa kuna amfani da tsarin AI')
          ].map((x) => `<li>${icon('check')}${x}</li>`).join('')}</ul>
        </div>
        <div class="panel does-not">
          <h3>${icon('xCircle')}${L('Lafimora does not', 'Lafimora ba ta')}</h3>
          <ul>${[
            L('Diagnose medical conditions', 'Gano cututtuka'),
            L('Predict maternal or child health risks', 'Hasashen haɗarin lafiyar uwa ko yaro'),
            L('Classify children as malnourished', 'Ayyana yaro a matsayin mai tamowa'),
            L('Prescribe medicines or treatments', 'Rubuta magani ko jinya'),
            L('Replace health workers', 'Maye gurbin ma’aikatan lafiya'),
            L('Make or follow up clinical referrals, or book appointments', 'Tura marasa lafiya, bibiyar turawa, ko ɗaukar alƙawari'),
            L('Decide who is eligible for healthcare services', 'Yanke hukunci kan wanda ya cancanci hidimar lafiya')
          ].map((x) => `<li>${icon('x')}${x}</li>`).join('')}</ul>
        </div>
      </div>
    </section>

    <section class="section-sm info-grid">
      <article class="panel" id="review">
        <span class="feature-icon">${icon('shield')}</span>
        <h3>${L('How content is reviewed', 'Yadda ake duba bayanai')}</h3>
        <ul class="plain-list">
          <li>${L('Answers are grounded in approved sources such as WHO and national health guidance, using retrieval from a verified knowledge base.', 'Amsoshi na dogara ne da ingantattun madogara kamar WHO da jagororin lafiya na ƙasa.')}</li>
          <li>${L('Qualified health and nutrition professionals review content before it is published.', 'Ƙwararrun ma’aikatan lafiya da abinci na duba bayanai kafin wallafawa.')}</li>
          <li>${L('The AI is tested with real questions in Hausa and English before launch, including safety testing.', 'Ana gwada AI da tambayoyi na gaske a Hausa da Turanci kafin ƙaddamarwa, har da gwajin tsaro.')}</li>
          <li>${L('Facility records are verified and show the date they were last checked.', 'Ana tabbatar da bayanan cibiyoyi kuma suna nuna ranar da aka duba su ta ƙarshe.')}</li>
        </ul>
      </article>
      <article class="panel" id="privacy">
        <span class="feature-icon">${icon('lock')}</span>
        <h3>${L('Privacy and your data', 'Sirri da bayananku')}</h3>
        <ul class="plain-list">
          <li>${L('No account or medical profile is needed to read information or find facilities.', 'Ba a bukatar asusu ko bayanan lafiya don karanta bayanai ko nemo cibiyoyi.')}</li>
          <li>${L('Your location is used only when you choose “Near me”, and only for that search.', 'Ana amfani da wurinku ne kawai idan kun zaɓi “Kusa da ni”, kuma don wannan bincike kawai.')}</li>
          <li>${L('Please do not share names, phone numbers or personal medical details in the chat.', 'Don Allah kada ku rubuta suna, lambar waya ko bayanan lafiya na sirri a hira.')}</li>
          <li>${L('Where personal information is processed, consent, security, retention and deletion rules apply.', 'Inda ake sarrafa bayanan sirri, ana bin ƙa’idojin izini, tsaro, ajiya da gogewa.')}</li>
        </ul>
      </article>
    </section>

    <section class="section-sm">
      ${sectionHead(L('Roadmap', 'Taswirar ci gaba'), L('Starting in Kaduna State', 'Farawa daga Jihar Kaduna'))}
      <ol class="timeline">
        <li class="is-current"><strong>${L('Now — Prototype', 'Yanzu — Samfuri')}</strong><span>${L('Interface design, content planning and partner consultations.', 'Zane, tsara bayanai da tuntuɓar abokan hulɗa.')}</span></li>
        <li><strong>${L('Pilot — Kaduna State', 'Gwaji — Jihar Kaduna')}</strong><span>${L('Verified facilities, reviewed content, Hausa and English testing on web and WhatsApp.', 'Cibiyoyin da aka tabbatar, bayanan da aka duba, gwaji a Hausa da Turanci a yanar gizo da WhatsApp.')}</span></li>
        <li><strong>${L('Evaluation', 'Kimantawa')}</strong><span>${L('Accuracy, usability and whether people find services more easily.', 'Daidaito, sauƙin amfani, da ko mutane na samun ayyuka cikin sauƙi.')}</span></li>
        <li><strong>${L('Expansion', 'Faɗaɗawa')}</strong><span>${L('Other Nigerian states, then other African contexts, with local review and partnerships.', 'Sauran jihohin Najeriya, sannan wasu ƙasashen Afirka, tare da duba na gida da haɗin gwiwa.')}</span></li>
      </ol>
    </section>

    <section class="callout callout-info section-sm-bottom">
      ${icon('users')}
      <div><strong>${L('Health facilities, authorities and community groups', 'Cibiyoyin lafiya, hukumomi da ƙungiyoyin al’umma')}</strong><br>${L('Partnerships help us verify facility information and share approved health messages. To get involved, contact YandyTech Community.', 'Haɗin gwiwa na taimaka mana tabbatar da bayanan cibiyoyi da yaɗa saƙonnin lafiya. Don shiga, a tuntuɓi YandyTech Community.')}</div>
    </section>

    <section class="section-sm-bottom photo-credits" id="credits" aria-labelledby="credits-title">
      <h2 class="h3" id="credits-title">${L('Photo credits', 'Masu hotuna')}</h2>
      <p class="muted">${L('Photographs are real images from Nigeria, used under open licences from Wikimedia Commons. They were resized for the web.', 'Hotunan na gaske ne daga Najeriya, an yi amfani da su ƙarƙashin lasisin buɗe daga Wikimedia Commons. An rage girmansu don yanar gizo.')}</p>
      <ul class="credit-list">${IMAGE_CREDITS.map((c) => `<li><img loading="lazy" src="assets/images/${c.file}" alt=""><span><strong>${esc(c.alt)}</strong><small>${L('Photo', 'Hoto')}: ${esc(c.author)} · <a href="${esc(c.source)}" target="_blank" rel="noopener">Wikimedia Commons</a> · <a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener">${esc(c.license)}</a></small></span></li>`).join('')}</ul>
    </section>
  </div>`;
}

/* ---------- Boot ---------- */
const TITLES = {
  home: { en: 'Lafimora — Maternal & child health information', ha: 'Lafimora — Bayanan lafiyar uwa da yara' },
  topics: { en: 'Health topics | Lafimora', ha: 'Batutuwan lafiya | Lafimora' },
  facilities: { en: 'Find a facility | Lafimora', ha: 'Nemo cibiyar lafiya | Lafimora' },
  chat: { en: 'Ask Lafimora | Lafimora', ha: 'Tambayi Lafimora | Lafimora' },
  about: { en: 'About | Lafimora', ha: 'Game da mu | Lafimora' }
};

function render() {
  layout();
  if (TITLES[page]) document.title = t(TITLES[page]);
  ({ home: renderHome, topics: renderTopics, topic: renderTopic, facilities: renderFacilities, facility: renderFacility, chat: renderChat, about: renderAbout }[page] || renderHome)();
  $$('img').forEach((img) => {
    img.decoding = 'async';
    img.addEventListener('error', () => { img.classList.add('image-unavailable'); img.alt = ''; }, { once: true });
  });
  if (location.hash) { const target = document.getElementById(location.hash.slice(1)); if (target) target.scrollIntoView(); }
}

async function boot() {
  if (['facilities', 'facility', 'chat'].includes(page)) await loadFacilityData();
  render();
  languageChooser();
}

boot();

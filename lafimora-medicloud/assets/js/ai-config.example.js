/* Copy this file to ai-config.js and add your key(s).
   ai-config.js is listed in .gitignore so keys are never committed.

   provider: 'groq' (default) or 'openai'. If the chosen provider fails before it starts
   answering (bad key, rate limit, outage) and the other one has a key, Lafimora tries the other.
   With no key at all, the chat uses Lafimora's built-in reviewed answers.

   This file is for running the site locally (double-click index.html). A key here is visible to
   anyone who can open the file, so it is never published: on Netlify, scripts/build.mjs replaces
   it with { proxyUrl: '/api/ai' } and the keys live in Netlify environment variables. */
window.LAFIMORA_AI = {
  provider: 'groq',
  groq: { apiKey: '', model: 'openai/gpt-oss-120b' },   // https://console.groq.com/keys
  openai: { apiKey: '', model: 'gpt-4.1-mini' },         // https://platform.openai.com/api-keys
  proxyUrl: ''                                           // set automatically on Netlify ('/api/ai')
};

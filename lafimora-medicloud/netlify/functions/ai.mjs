/* Lafimora AI proxy (Netlify Function, served at /api/ai).
   Keeps the API keys on the server. Set these in Netlify → Site configuration → Environment variables:
     GROQ_API_KEY     (default provider)
     OPENAI_API_KEY   (optional alternative / fallback)
     AI_PROVIDER      optional: 'groq' (default) or 'openai'
     GROQ_MODEL, GROQ_FALLBACK_MODEL, OPENAI_MODEL   optional model overrides
   The browser sends OpenAI-style chat messages; the reply is streamed back as server-sent events. */

const env = (name) => (globalThis.Netlify?.env?.get(name) ?? process.env[name] ?? '').trim();

function upstreams() {
  const groq = env('GROQ_API_KEY') ? [env('GROQ_MODEL') || 'openai/gpt-oss-120b', env('GROQ_FALLBACK_MODEL') || 'openai/gpt-oss-20b']
    .filter((m, i, a) => m && a.indexOf(m) === i)
    .map((model) => ({ name: 'groq', url: 'https://api.groq.com/openai/v1/chat/completions', key: env('GROQ_API_KEY'), model })) : [];
  const openai = env('OPENAI_API_KEY') ? [{ name: 'openai', url: 'https://api.openai.com/v1/chat/completions', key: env('OPENAI_API_KEY'), model: env('OPENAI_MODEL') || 'gpt-4.1-mini' }] : [];
  return env('AI_PROVIDER') === 'openai' ? [...openai, ...groq] : [...groq, ...openai];
}

function payloadFor(u, body) {
  const p = {
    model: u.model,
    messages: body.messages,
    stream: true,
    max_completion_tokens: Math.min(Number(body.max_completion_tokens) || 600, 900)
  };
  if (u.name === 'groq' && /gpt-oss/.test(u.model)) Object.assign(p, { reasoning_effort: 'low', include_reasoning: false });
  if (u.name === 'openai' && /^(gpt-5|o\d)/.test(u.model)) p.reasoning_effort = 'low';
  else p.temperature = typeof body.temperature === 'number' ? Math.min(Math.max(body.temperature, 0), 1) : 0.3;
  return p;
}

const json = (status, message) => new Response(JSON.stringify({ error: { message } }), { status, headers: { 'Content-Type': 'application/json' } });

export default async (req) => {
  if (req.method !== 'POST') return json(405, 'Method not allowed');

  // Only accept browser calls from this site itself
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return json(403, 'Forbidden');

  let body;
  try { body = await req.json(); } catch (e) { return json(400, 'Invalid JSON'); }
  const msgs = body && body.messages;
  const valid = Array.isArray(msgs) && msgs.length > 0 && msgs.length <= 30
    && msgs.every((m) => m && ['system', 'user', 'assistant'].includes(m.role) && typeof m.content === 'string')
    && JSON.stringify(msgs).length <= 40000;
  if (!valid) return json(400, 'Invalid messages');

  const list = upstreams();
  if (!list.length) return json(500, 'No AI provider key is configured on the server');

  let last = json(502, 'AI provider unavailable');
  for (const u of list) {
    let res;
    try {
      res = await fetch(u.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.key}` },
        body: JSON.stringify(payloadFor(u, body))
      });
    } catch (e) { last = json(502, `${u.name}: network error`); continue; }
    if (res.ok) {
      return new Response(res.body, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store' } });
    }
    let detail = '';
    try { detail = (await res.json()).error?.message || ''; } catch (e) { /* not JSON */ }
    console.warn(`AI upstream ${u.name} ${u.model} failed: ${res.status} ${detail}`);
    last = json(res.status === 429 ? 429 : 502, `${u.name} ${res.status}`); // never echo upstream details to the browser
  }
  return last;
};

export const config = { path: '/api/ai' };

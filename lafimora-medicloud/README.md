# Lafimora — MediCloud template edition

A redesign of the Lafimora frontend prototype using the **MediCloud** template (Bootstrap 5 + GSAP) by [Codescandy](https://codescandy.com), distributed by [ThemeWagon](https://themewagon.com) under the MIT licence. It is plain HTML, CSS and JavaScript, with no build step and no npm.

## Open

Double-click `index.html`. Every page works straight from the folder, including the chat and the facility search. You can also upload the folder as-is to any web host.

Language links work as before: add `?lang=ha` or `?lang=en` to any page.

## Files

| Path | What it is |
|---|---|
| `*.html` | One page each: `index`, `about`, `topics`, `topic`, `facilities`, `facility`, `chat` |
| `assets/css/style.css` | Compiled template stylesheet (Bootstrap 5.3 + MediCloud + Lafimora) |
| `assets/js/app.js` | Content, facility search, chat logic and the page markup |
| `assets/js/ai.js` | AI provider code (Groq/OpenAI, streaming, fallbacks) and the chatbot's system prompt |
| `assets/js/ai-config.js` | Your API keys. Local only and ignored by git; the template is `ai-config.example.js` |
| `netlify/functions/ai.mjs` | Netlify Function at `/api/ai` that holds the API keys on the server |
| `scripts/build.mjs`, `../netlify.toml` | Netlify build: copies the site to `dist/` without local keys |
| `assets/js/animations.js` | Template animations (GSAP). Skipped when the user prefers reduced motion |
| `assets/vendor/` | Local copies of `bootstrap.bundle.min.js`, `gsap.min.js` and `ScrollTrigger.min.js`, so there are no CDN calls |
| `assets/data/facilities.js` | Kaduna State HEFA facility snapshot, embedded so it works without a server. `facilities.json` holds the same data |
| `assets/images/`, `assets/brand/` | Photos (credits in `images/CREDITS.md` and on the About page), the logo, and `hero-mother-phone.svg`, an original hero illustration in the platform colours |
| `scss/` | Optional source of `style.css` |

Three things load from the internet: the IBM Plex Sans font (Google Fonts), the facility-page map (a Google Maps embed, no API key) and AI chat answers (see below; offline, the chat uses its built-in answers). Offline, the browser falls back to a system font and the map area stays empty; the Directions buttons still work once a connection is available.

## AI chat (Groq or OpenAI)

The chat sends questions to an AI model and streams the answer back. The settings are in `assets/js/ai-config.js`, which is **not committed** (it is in `.gitignore`). To set it up on a new machine, copy `assets/js/ai-config.example.js` to `ai-config.js` and add a key:

```js
window.LAFIMORA_AI = {
  provider: 'groq',                                       // or 'openai'
  groq:   { apiKey: 'gsk_…', model: 'openai/gpt-oss-120b' },
  openai: { apiKey: 'sk-…',  model: 'gpt-4.1-mini' },
  proxyUrl: ''
};
```

- **Groq** is the default and uses `openai/gpt-oss-120b`. If that model hits its rate limit, the chat switches to `openai/gpt-oss-20b`.
- **OpenAI** is the alternative. Set `provider: 'openai'` to use it first. If both keys are present, the second provider takes over when the first fails before it starts answering.
- **No key, or the AI is unreachable:** the chat uses the built-in reviewed answers.
- **Rules that never depend on the AI:**
  - Danger-sign messages always show the urgent-care card (Call 112, find a facility) first. The AI's guidance appears after it.
  - Questions like "where can I find…" show facility cards from the HEFA directory, not AI text.
- **The system prompt** is in `assets/js/ai.js` (`systemPrompt`). It sets:
  - scope;
  - safety rules that override user requests: danger-sign escalation, no diagnosis or doses, correcting harmful practices, mental-health and abuse responses, no invented facts or facilities, privacy, and resistance to prompt injection;
  - grounding in WHO, UNICEF, FMoH and NPHCDA guidance and Lafimora's reviewed topic notes;
  - plain-language Hausa or English replies, matched to the user's language;
  - a short answer format.
- **Topic notes per question:** only the one or two notes that match the question are sent, which keeps each request small. Groq's free tier allows 8,000 tokens per minute, which is roughly 4–5 questions per minute. For real traffic, use a paid tier.

A key in `ai-config.js` is only for running the site locally. On Netlify, the keys are kept on the server (see below).

## Deploy to Netlify

`netlify.toml` (in the repository root) tells Netlify to:
- build from `lafimora-medicloud/` and run `node scripts/build.mjs`;
- publish `dist/`;
- deploy the function in `netlify/functions/`.

The build never publishes your local `ai-config.js`. It writes one that sends chat requests to `/api/ai`, and it stops if it finds an API key in the output.

1. **Connect the site.** In Netlify, choose **Add new site → Import an existing project**, then pick the GitHub repository and the branch. The settings come from `netlify.toml`, so leave the build fields as they are.
2. **Add the keys.** Under **Site configuration → Environment variables**, add:
   - `GROQ_API_KEY`
   - optionally `OPENAI_API_KEY`
   - optionally `AI_PROVIDER=openai`, to use OpenAI first

   Then redeploy.

To deploy from this computer instead, run these from the repository root:
- `npx netlify-cli login`
- `npx netlify-cli init`
- `npx netlify-cli env:set GROQ_API_KEY <key>`
- `npx netlify-cli deploy --build --prod`

**About `/api/ai`:**
- It only accepts requests from the site's own pages.
- It limits the size of each request.
- It never sends the key or provider error details to the browser.

## Editing styles (optional)

Most edits only touch `assets/js/app.js` (text and markup), and you can make those directly. To change the design tokens or the SCSS, edit `scss/`, then rebuild the CSS:

```bash
npm install
npm run css
```

## Before public launch

The same notes apply as for the parent project:
- Health text is sample content that needs professional review.
- Hausa copy needs native-speaker review. This includes the AI's Hausa answers, which are understandable but sometimes use awkward or wrong words.
- Have health professionals review a sample of AI answers.
- Keep the photo credits with any reuse of the images.
- If facility data is updated, regenerate `assets/data/facilities.js` from the new `facilities.json`.

# Lafimora — Frontend prototype

Frontend-only prototype of **Lafimora**, an AI-powered maternal and child health information and healthcare service navigation platform (YandyTech Community · SolutionLab · Kaduna State pilot). It contains no backend, real AI, or verified facility database.

## Open

Open `index.html` in a modern browser, or run `python -m http.server 8080` in this folder and visit http://localhost:8080. No installation or API key needed.

Language links: add `?lang=ha` or `?lang=en` to any page URL (e.g. `index.html?lang=ha`). First-time visitors are asked to choose Hausa or English.

## How the pages map to the platform document

| Document section | Where it lives |
|---|---|
| §7.1 AI health & nutrition assistant | `chat.html` — full-height assistant UI: centred welcome + composer that glides to the bottom on first message, "thinking" state, streamed replies, source citations, "Explain more simply", glossary follow-ups, copy/feedback, New chat, AI disclosure. Home page ask box hands off via `chat.html?ask=…` (topic pages use `?topic=…&q=…`) |
| §7.1 A–C topic coverage | `topics.html` / `topic.html` — 12 topics in 3 groups: Maternal health, Maternal nutrition, Infant & young child nutrition |
| §7.1G WhatsApp channel | "Chat on WhatsApp — Coming soon" in the footer and the Home feature list |
| §7.2 Service discovery | `facilities.html` — search by name, service (full §7.2B list) and Kaduna LGA; "Near me" proximity sort |
| §7.2C Facility profiles | `facility.html` — type, MCH vs nutrition services, address, hours, phone, last-verified date, map/directions placeholder |
| §7.2E AI-assisted facility search | Ask "Where can I get antenatal care?" in chat → facility cards in the conversation |
| §8 User journey | Language choice → ask → find a facility → view details → decide independently |
| §10.1 Informational boundaries | `about.html#limits` — full "does / does not" list |
| §10.3 Emergency handling | Danger words (EN + HA) in chat show an urgent-care card; "Emergency? Call 112" in every page header; Warning signs topic |
| §10.4 Privacy | `about.html#privacy`; chat and location privacy notes |
| §10.6 Transparency | AI badge and disclosure in chat; sample-content labels |

## Files

`app.js` (all rendering, content and chat logic), `styles.css` (design system), one thin HTML shell per page.

## Before public launch

- All health text is **sample content** based on WHO/UNICEF guidance — it must be reviewed by qualified health and nutrition professionals.
- Hausa copy needs review by native speakers.
- Facilities are **fictional**; replace with verified records (with real verification dates) only.
- Replace remote Unsplash images with licensed, consented, locally relevant photos.
- Connect the chat to the real RAG backend and WhatsApp integration; keep the emergency routing server-side as well.
- Test with users and current mobile browsers.

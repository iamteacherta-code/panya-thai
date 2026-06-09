# Panyaden Thai Literacy Studio

A classroom web app for teaching Thai literacy with UFLI-style explicit, systematic
phonics, for Kindergarten–Grade 6 learners at Panyaden International School, Chiang Mai.

Built from a Claude Design handoff. Warm, natural earth-wood-leaf palette; Sarabun
font (embedded, Regular/Bold) for Thai, Sarabun for the UI. English-primary with Thai labels.

## Run

The page loads its components with Babel Standalone, which fetches the `.jsx` files —
so it must be served over HTTP (opening the file directly via `file://` will not work).

```
node serve.js
```

Then open http://localhost:8080/ — `serve.js` serves `Panyaden Thai Literacy.html` at the root.

## What's inside

| Area | Purpose |
| --- | --- |
| **Blending Board** (`board.jsx`) | The core UFLI blending drill — pick initial / vowel / final / tone, slide each slot ◀▶, Check, Word Chains, OTR counter, three teaching levels (Foundation → Blending → Advanced). |
| **Word Work Mat · Beginner** (`wordmat.jsx`) | C+V and C+V+C mats for อ.3 — 18 initials + 4 long vowels; CVC adds easy finals (ง น ม), tones locked. |
| **Word Work Mat · Intermediate** (`wordmat.jsx`) | All 44 initials + clusters, every vowel, 8 finals, tone marks (Y1–2). |
| **Lessons / Reading / Activity / Worksheets** (`pages.jsx`) | Framework pages with sample content, ready to wire to real curriculum. |

### Files

- `Panyaden Thai Literacy.html` — entry point (React + Babel pinned, loads everything below)
- `thai-data.js` — Thai language data: consonants (by class), vowels, tones, finals (8 มาตรา), clusters, levels, word chains, mat specs, and syllable builders → `window.THAI`
- `styles.css` — design system (colors, header, buttons, layout)
- `board.css` — Blending Board + Word Work Mat styles
- `pages.css` — home / framework page grids
- `ui.jsx` — stroke icons + placeholder helper
- `tweaks-panel.jsx` — the floating Tweaks panel and form controls
- `board.jsx`, `wordmat.jsx`, `pages.jsx`, `app.jsx` — components, pages, and the app shell (nav, routing, tweaks wiring)
- `images/panya-logo.png` — header logo

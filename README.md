# Panyaden Thai Literacy Studio

A classroom web app for teaching Thai literacy with UFLI-style explicit, systematic
phonics, for K2–Y6 learners at Panyaden International School, Chiang Mai.

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

### หนังสือเรียน Y4 · หน่วยที่ 1 "ชุมชนและบทบาทหน้าที่"

A six-chapter unit reader for Year 4: one continuous story (same cast all six weeks),
each chapter carrying that week's 20 vocabulary words, end-of-chapter questions, a
โยนิโสมนสิการ thinking page, and five 15-minute daily worksheets. Answer key at the back.

- `unit1-book-data.js` — all the book's content (story, questions, worksheets, answers). No layout.
  `*word*` marks a weekly vocabulary word, `~word~` marks a Heart Word.
- `unit1-book-art.js` — the hand-drawn doodle illustrations as SVG (6 chapter scenes,
  a cover, 6 character portraits), built from a small kit of primitives + a roughen filter.
- `reader-y4-unit1.html` — the reader itself: 56 A4 sheets, prints straight from the browser.
  Linked from Reading Passages → Comprehension (Y4–6).

  Export happens **entirely in the page** — no print dialog, no library, no network:
  a sheet is cloned into an SVG `<foreignObject>` (with `activity-base.css` and the two
  Sarabun `.ttf` files inlined as data URIs, since an SVG-as-image cannot fetch anything)
  and drawn to a canvas at 2×.
  - **บันทึก PNG** — the sheet currently in view, 1588×2246 px. Every sheet also has its own
    PNG button on hover.
  - **บันทึก PDF** — writes a real PDF byte-by-byte (`buildPdf`): each page becomes a
    Flate-compressed `DeviceRGB` image XObject on an A4 MediaBox, via `CompressionStream`
    (falls back to JPEG `/DCTDecode` if unavailable). Whole book ≈ 12 MB in ≈ 7 s; the menu
    also offers just the current chapter or a single page. Progress is shown and cancellable.

  Note: `body { font-family }` does not apply inside the export wrapper, so `.pngroot .sheet`
  restates the font stack — without it Latin text falls back to a serif.
- `tools/build-unit1-docx.js` — builds the printable Word version from the same two files.
  Rasterises the SVGs via headless Chrome, then writes the .docx with `tools/docx-lite.js`.

```
node tools/build-unit1-docx.js ["โฟลเดอร์ปลายทาง"]
```

Default output: `D:\2026-2027 WORK\THAI FL\U1\หนังสือเรียน-Y4-หน่วยที่1 ชุมชนและบทบาทหน้าที่.docx`
(55 A4 pages). Edit the content in `unit1-book-data.js` and both outputs follow.

### Sister apps (separate websites)

The teacher back office lives on its own domain, so it is **not** mixed into the tool-card grids —
a site on another domain gets a full-width banner instead, so nobody mistakes it for a tool that
runs here. `CURRICULUM_APP_URL` at the top of `pages.jsx` points at it: IB + UFLI framework,
weekly plan templates, marks and reports (K2–Y6). It sits under *Interactive tools*.

### Reading Club

A section of its own under *Lessons & materials · สื่อการสอน* — levelled story books pupils read
aloud on screen, **organised by year group**. The reading itself happens in a separate app (sign
in by name + 4-digit PIN, each word turns green or red as it is read, per-pupil progress), so
every book card opens that app in a new tab.

- `reading-club-data.js` — **data only**, no logic: the app's address plus the whole shelf. Each
  year carries `status: "ready"` or `"pending"`; a pending year shows a panel saying its books are
  still to come, rather than an empty page. Only **Y4** is filled today (Unit 1, six books);
  **Y1–Y3** are waiting. This is the file the back office writes, so keep it plain.
- `reading-club-store.js` — sits between that file and whatever the teacher has edited locally,
  and exposes `RC.years` / `RC.save()` / `RC.reset()` / `RC.toFileSource()`.
- `ReadingClubPage` in `pages.jsx` renders it. The year switcher reuses the same `.level-bar`
  markup as the other pages, and covers are pulled live from the Reading Club site.
- The printable reader for a unit is linked from that unit's heading, so the on-screen and paper
  versions of the same six books sit together.

#### Back office — `reading-club-admin.html`

Open it and edit; there is no sign-in, because there is nothing to sign in to. Add and remove
units and books, switch a year between *รอข้อมูล* and *มีหนังสือแล้ว*, edit every field inline.
Edits save as you type.

Panya Thai is a static site, so a back office cannot write to shared storage — and rather than
hide that, the page works in two explicit steps:

1. **Edits land in this browser** (`localStorage`) and the Reading Club page reflects them at once,
   which is enough to try a change out. The Reading Club page says plainly when it is showing
   locally-edited data, so nobody mistakes it for what everyone else sees.
2. **ดาวน์โหลดไฟล์ข้อมูล** regenerates `reading-club-data.js` from the current state. Drop that over
   the file in the project and deploy, and every device sees it. *คืนค่าตามไฟล์* throws the local
   edits away.

The generated file is plain data, so it round-trips: what the back office writes is exactly what
`reading-club-data.js` looks like by hand.

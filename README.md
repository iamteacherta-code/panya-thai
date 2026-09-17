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

### เสียงอ่านของคุณครู — `audio-studio.html`

The read-aloud prefers a **recorded teacher clip** over synthesised speech, always. Clips live in
`audio/words/<word>.<ext>` — the same folder and the same convention the interactive games already
use, so the 100-odd words recorded for those are picked up by the reader for free.

Lookup order per word, cached for the session so a missing word is asked for once:

1. `word-audio-index.js` (`window.WORD_AUDIO`) says which words have a clip and in what format.
2. Not listed → try `.mp3` anyway, which is what the older hand-recorded library is.
3. The file 404s or will not decode → fall back to the speech synthesiser.

`audio-studio.html` is where the recording happens — one word at a time, because the reader speaks
one word at a time and a word recorded once is reused in every story that contains it. Level 02's
fourteen stories are 202 distinct words, so the whole set is one sitting.

- It reads the word list straight out of `short-stories-data.js`, so the list can never drift from
  the stories. There is also a free-text box for words that are not in any story.
- `Space` records and stops, the clip plays straight back so you hear whether it was clear, and it
  moves on to the next word by itself. A level meter shows the microphone is actually picking up.
- `Space` toggles, and the handler **ignores auto-repeat** (`e.repeat`). Without that guard, holding
  the key down made the keyboard fire `keydown` over and over, flipping record on and off until the
  only thing left in the clip was the sound of the key itself — which is exactly what happened the
  first time this was used. กด Space ค้างไว้ จึงไม่ทำอะไรทั้งนั้น
- Every clip is decoded with `decodeAudioData` before it is kept, for its **real duration and peak**.
  A MediaRecorder WebM carries no duration in its header, so an `<audio>` element reports `Infinity`
  and there is no other way to tell a good take from a 0.1-second one. Under 0.35 s or quieter than
  0.02 peak is **not saved** — a bad clip must not turn the word green. **ตรวจเสียงที่อัดไว้** runs the
  same test over everything already stored and outlines the failures in orange.
  It measures length and loudness, not *what was said*, so a wrong word still needs an ear.
- Clips are held in **IndexedDB**, not `localStorage` — a `Blob` cannot go in `localStorage` and
  200 clips would blow the quota anyway. They survive a refresh, so recording can stop and resume.
- **ดาวน์โหลดเสียงทั้งหมด** writes a `.zip` byte by byte in the page (CRC32 + *stored* entries; Opus
  is already compressed, so deflating it again buys nothing). Unzip it over the project root and the
  clips and `word-audio-index.js` land where they belong. Filenames are Thai, so the zip sets bit 11
  of the general-purpose flag — without it Windows extracts mojibake.

Same two-step honesty as the Reading Club back office: a static site cannot write to shared storage,
so step one is this browser and step two is dropping the files into the project and deploying.

### 14 Short Stories · 14 เรื่องสั้น

Its own topic under *Lessons & materials · สื่อการสอน*: fourteen passages per level, graded
**02 → 05**, transcribed from the teacher's *THAI READING PASSAGE* booklets. Level 02 is in;
03–05 carry a note saying their booklets exist and are waiting to be transcribed.

- `short-stories-data.js` — data only, same shape as the Reading Club file: `status: "ready"` or
  `"pending"` per level, then the stories as arrays of lines.

  **The spacing inside each line is content, not formatting.** The Level 02 booklet separates
  every word with a space so beginners can see word boundaries, so the lines are copied exactly
  and rendered with `white-space: pre-wrap`. Tidying those spaces away would undo the point of
  the exercise.
- **Level 02 is word-spaced, 03 is not.** The booklet for 02 puts a space between every word so a
  beginner can see where words end; that level carries `spaced: true` and the reader splits on
  whitespace alone. It must keep doing so — the recorded clip filenames are keyed to exactly that
  split. From 03 the text runs on as ordinary sentences, so the reader segments each chunk further
  with `Intl.Segmenter("th")`; otherwise a whole clause would underline and be spoken as one lump.
- `tools/pdf-text.js` pulls the text out of the *THAI READING PASSAGE* PDFs (Canva exports: classic
  xref, FlateDecode, Type0/Identity-H). It reads `/Span << /ActualText >>` first, because Canva
  draws one glyph at a time and lifts tone marks onto their own baseline — sort those by position
  and `บ้าน` comes out `บาน`. ActualText carries the correct logical string.

  ```
  node tools/pdf-text.js "THAI Reading Passage 3.pdf" > out.json
  ```

  It is a **draft, not the source of truth**: a few clusters carry no ActualText span and lose their
  tone marks, and it dropped a whole line on two pages. Every page of Level 03 was read against a
  render of the PDF before the text was kept. Do the same for 04 and 05.
- `audio/words/รายการอัดเสียง-level-03.txt` — the words in Level 03 that have no clip yet (224 of
  338; the other 114 are already recorded). Paste the whole file into the studio's **เพิ่มคำเอง** box.
- `books/short-stories-level-02.pdf` — the original booklet, linked from the level heading for
  teachers who want to print it.
- `StoryReader` in `pages.jsx` — the fullscreen reader behind each story's **เปิด** button:
  - **Read-aloud with a green underline under the current word.** It speaks one word per
    utterance and underlines on `onstart`, rather than speaking whole lines and following
    `onboundary` — boundary events are unreliable for Thai, and word-by-word matches how this
    level is meant to be read anyway. Tapping any word speaks from there.
  - **Three named paces** (`PACE` in `pages.jsx`): ช้ามาก / ช้า / ปกติ. Each sets the utterance
    rate *and* a deliberate silence after the word — a longer one at the end of a line, so the
    lines do not run together. `rate` alone is not enough: a Thai voice at a low rate slurs,
    whereas the gap is what makes a beginner able to follow. Changing the pace stops the reading,
    since the current utterance cannot be re-rated mid-word.
  - **A timer**, which runs while reading and freezes when paused.
  - Real fullscreen via `requestFullscreen`, and Esc closes. Speech is always cancelled on
    unmount so nothing keeps talking after the reader closes.

  If the device has no Thai voice the reader says so and carries on — the underline still tracks.
  `.ss-lines` centres with `margin: auto` rather than `justify-content: center`, because the
  latter clips the first line of a story taller than the screen and it cannot be scrolled back.

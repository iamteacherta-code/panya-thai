/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;
const { HomePage, ActivityPage, LessonsPage, ReadingPage, WorksheetsPage } = window.Pages;
const TOOLS = window.TOOLS;
const Ico = window.Ico;
const BlendingBoard = window.BlendingBoard;
const WordWorkMat = window.WordWorkMat;
const DIGITAL_APPS = window.DIGITAL_APPS;
const RESOURCES = window.RESOURCES;
const LESSON_ITEMS = window.LESSON_ITEMS;
const MAT_ITEMS = window.MAT_ITEMS;
const { useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakRadio, TweakToggle, TweakColor } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "letterSize": 170,
  "consSet": "Standard",
  "vowelSet": "Basic",
  "toneSet": "All",
  "showRom": true,
  "showNames": false,
  "accent": ["#5b7a4b", "#c98a3b"]
}/*EDITMODE-END*/;

const CONS_MAP = { Common: "common", Standard: "noRare", "All 44": "all" };
const VOW_MAP = { Basic: "basic", All: "all" };
const TONE_MAP = { Basic: "basic", All: "all" };

/* ---------- Nav dropdown (Lessons + sub-menu) ---------- */
function NavDropdown({ label, icon, items, page, go }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const activeHere = items.some((it) => it.id === page);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const choose = (id) => { setOpen(false); go(id); };
  return (
    <div className="nav-dd" ref={ref}>
      <button className={"nav-btn" + (activeHere ? " active" : "")} onClick={() => setOpen((o) => !o)}
        aria-haspopup="true" aria-expanded={open}>
        <Ico name={icon} />
        <span>{label}</span>
        <svg className="nav-caret" viewBox="0 0 24 24" width="14" height="14" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="nav-menu" role="menu">
          {items.map((it, i) => (
            it.divider ? <div key={"d" + i} className="nav-menu-div" /> : (
              <button key={it.id} role="menuitem"
                className={"nav-menu-item" + (page === it.id ? " active" : "")}
                onClick={() => choose(it.id)}>
                <Ico name={it.icon} />
                <span className="nm-en">{it.en}</span>
                <span className="nm-th">{it.th}</span>
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Nav ---------- */
// Lessons ▾ menu: one item per grade (K2–Y3), a divider, then the other resources.
const LESSON_MENU = LESSON_ITEMS.concat([{ divider: true }], RESOURCES.filter((r) => r.id !== "lesson"));

function NavBar({ page, go }) {
  const mk = (it) => (
    <button key={it.id} className={"nav-btn" + (page === it.id ? " active" : "")} onClick={() => go(it.id)}>
      <Ico name={it.icon} />
      <span>{it.navEn || it.en}</span>
    </button>
  );
  return (
    <header className="appbar">
      <div className="appbar-inner">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>
          <span className="brand-mark"><img src="images/panya-logo.png" alt="PANYA logo" /></span>
          <span>
            <div className="brand-name">PANYA</div>
            <div className="brand-sub">Thai Foundation</div>
          </span>
        </a>
        <nav className="nav">
          {mk({ id: "home", en: "Home", th: "หน้าหลัก", icon: "home" })}
          {DIGITAL_APPS.map((app) => app.id === "mat"
            ? <NavDropdown key="mat" label={app.navEn || app.en} icon={app.icon} items={MAT_ITEMS} page={page} go={go} />
            : mk(app))}
          <NavDropdown label="Lessons" icon="lesson" items={LESSON_MENU} page={page} go={go} />
          <a className="nav-btn" href="curriculum.html" title="หลักสูตร 138 บทเรียน · Scope &amp; Sequence">
            <Ico name="reading" />
            <span>หลักสูตร</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ---------- Board page wrapper ---------- */
function BoardPage({ t }) {
  return (
    <div>
      <div className="page-head">
        <span className="eyebrow"><Ico name="board" style={{ width: 16, height: 16 }} /> Build a syllable</span>
        <h1 className="page-title">Blending Board <span className="th">· กระดานประสมคำ</span></h1>
        <p className="page-sub">
          Tap a <b>consonant</b>, a <b>vowel</b> and a <b>tone mark</b> — the blended syllable appears big in the
          centre. แตะพยัญชนะ สระ และวรรณยุกต์ แล้วดูคำที่ประสมตรงกลาง
        </p>
      </div>
      <BlendingBoard t={t} />
    </div>
  );
}

/* ---------- Word Work Mat page wrapper ---------- */
function MatPage({ t, level }) {
  return (
    <div>
      <WordWorkMat t={t} level={level} />
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  // normalise bare "mat"/"lesson" ids to their first level/grade
  const norm = (p) => {
    if (p === "mat") return "mat-" + THAI.MAT_LEVELS[0];
    if (p === "lesson") return "lesson-" + THAI.GRADE_ORDER[0];
    return p;
  };
  const [page, setPage] = useState(() => norm(localStorage.getItem("panyaden_page") || "home"));

  const go = (p) => {
    p = norm(p);
    setPage(p); localStorage.setItem("panyaden_page", p); window.scrollTo({ top: 0 });
  };

  // apply accent palette to CSS variables
  useEffect(() => {
    const a = t.accent || TWEAK_DEFAULTS.accent;
    document.documentElement.style.setProperty("--leaf", a[0]);
    document.documentElement.style.setProperty("--earth", a[1]);
  }, [t.accent]);

  // normalized tweak object for the board
  const bt = {
    letterSize: t.letterSize,
    consSet: CONS_MAP[t.consSet] || "noRare",
    vowelSet: VOW_MAP[t.vowelSet] || "basic",
    toneSet: TONE_MAP[t.toneSet] || "all",
    showRom: t.showRom,
    showNames: t.showNames,
  };

  let body;
  if (page === "home") body = <HomePage go={go} />;
  else if (page === "board") body = <BoardPage t={bt} />;
  else if (page === "mat" || page.indexOf("mat-") === 0) {
    const lvl = page === "mat" ? THAI.MAT_LEVELS[0] : page.slice(4); // "mat-beginner" → "beginner"
    body = <MatPage t={bt} level={lvl} />;
  }
  else if (page === "activity") body = <ActivityPage />;
  else if (page === "lesson" || page.indexOf("lesson-") === 0) {
    const g = page === "lesson" ? THAI.GRADE_ORDER[0] : page.slice(7); // "lesson-y1" → "y1"
    body = <LessonsPage grade={g} />;
  }
  else if (page === "reading") body = <ReadingPage />;
  else if (page === "worksheet") body = <WorksheetsPage />;
  else body = <HomePage go={go} />;

  return (
    <div className="app-bg">
      <NavBar page={page} go={go} />
      <main className="page">{body}</main>

      <TweaksPanel>
        <TweakSection label="Blending board" />
        <TweakSlider label="Word size" value={t.letterSize} min={90} max={300} step={10} unit="px"
          onChange={(v) => setTweak("letterSize", v)} />

        <TweakSection label="Character sets" />
        <TweakRadio label="Consonants" value={t.consSet} options={["Common", "Standard", "All 44"]}
          onChange={(v) => setTweak("consSet", v)} />
        <TweakRadio label="Vowels" value={t.vowelSet} options={["Basic", "All"]}
          onChange={(v) => setTweak("vowelSet", v)} />
        <TweakRadio label="Tone marks" value={t.toneSet} options={["Basic", "All"]}
          onChange={(v) => setTweak("toneSet", v)} />

        <TweakSection label="Labels" />
        <TweakToggle label="Show reading (romanisation)" value={t.showRom}
          onChange={(v) => setTweak("showRom", v)} />
        <TweakToggle label="Show consonant names (ก ไก่)" value={t.showNames}
          onChange={(v) => setTweak("showNames", v)} />

        <TweakSection label="Theme" />
        <TweakColor label="Accent palette" value={t.accent}
          options={[["#5b7a4b", "#c98a3b"], ["#3d7068", "#caa24a"], ["#2f9e8f", "#e8743b"], ["#6b7f4b", "#b05c3c"]]}
          onChange={(v) => setTweak("accent", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

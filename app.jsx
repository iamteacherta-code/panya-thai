/* global React, ReactDOM */
const { useState, useEffect } = React;
const { HomePage, ActivityPage, LessonsPage, ReadingPage, WorksheetsPage } = window.Pages;
const TOOLS = window.TOOLS;
const Ico = window.Ico;
const BlendingBoard = window.BlendingBoard;
const WordWorkMat = window.WordWorkMat;
const DIGITAL_APPS = window.DIGITAL_APPS;
const RESOURCES = window.RESOURCES;
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

/* ---------- Nav ---------- */
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
          <span className="brand-mark"><img src="images/panya-logo.png" alt="Panya logo" /></span>
          <span>
            <div className="brand-name">Panyaden International School</div>
            <div className="brand-sub">Thai Literacy Studio · ห้องเรียนภาษาไทย · Chiang Mai</div>
          </span>
        </a>
        <nav className="nav">
          {mk({ id: "home", en: "Home", th: "หน้าหลัก", icon: "home" })}
          <span className="nav-div" />
          {DIGITAL_APPS.map((it) => mk(Object.assign({}, it,
            it.id === "mat-beginner" ? { navEn: "Word Work · Beginner", navTh: "แผ่นเริ่มต้น" }
            : it.id === "mat-intermediate" ? { navEn: "Word Work · Intermediate", navTh: "แผ่นระดับกลาง" } : {})))}
          <span className="nav-div" />
          {RESOURCES.map(mk)}
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
function MatPage({ matId, t }) {
  const cfg = THAI.MATS[matId];
  return (
    <div>
      <div className="page-head">
        <span className="eyebrow"><Ico name="activity" style={{ width: 16, height: 16 }} /> Digital App · Word Work Mat</span>
        <h1 className="page-title">{cfg.en} <span className="th">· {cfg.th}</span></h1>
        <p className="page-sub">
          {matId === "beginner"
            ? "แตะตัวอักษรมาวางบนแผ่นเพื่อประสมคำ — ระดับเริ่มต้นเน้นพยัญชนะเดี่ยว + สระ (อ.3)"
            : "สร้างคำที่มีตัวสะกดและผันวรรณยุกต์ — พยัญชนะครบ 44 ตัว รวมควบกล้ำ (ป.1–ป.2)"}
        </p>
      </div>
      <WordWorkMat matId={matId} t={t} />
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = useState(() => localStorage.getItem("panyaden_page") || "home");

  const go = (p) => { setPage(p); localStorage.setItem("panyaden_page", p); window.scrollTo({ top: 0 }); };

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
  else if (page === "mat-beginner") body = <MatPage matId="beginner" t={bt} />;
  else if (page === "mat-intermediate") body = <MatPage matId="intermediate" t={bt} />;
  else if (page === "activity") body = <ActivityPage />;
  else if (page === "lesson") body = <LessonsPage />;
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

/* global React */
const Icons = window.Icons;
const Placeholder = window.Placeholder;

const DIGITAL_APPS = [
  { id: "board", en: "Blending Board", th: "กระดานประสมคำ", icon: "board", color: "var(--leaf)", desc: "Slide consonants, vowels and tones to blend syllables live — the UFLI blending drill." },
  { id: "mat", en: "Word Work Mat", th: "แผ่นฝึกคำ", icon: "activity", color: "var(--earth)", desc: "Build C+V and C+V+C words. Choose a grade (K2–Y3) — letters, vowels, finals and tones scale to the level." },
];
const RESOURCES = [
  { id: "lesson", en: "Lessons", th: "บทเรียน", icon: "lesson", color: "var(--clay)", desc: "Explicit, systematic phonics units in a UFLI-style scope & sequence." },
  { id: "reading", en: "Reading Passages", th: "บทอ่าน", icon: "reading", color: "var(--sky)", desc: "Decodable passages matched to the sounds taught in each lesson." },
  { id: "activity", en: "Activity Sheets", th: "แผ่นกิจกรรม", icon: "worksheet", color: "#8a6f3a", desc: "Hands-on practice for letter forms, sound sorts and matching." },
  { id: "worksheet", en: "Worksheets", th: "ใบงาน", icon: "worksheet", color: "#7a5fb0", desc: "Printable worksheets, dictation and quick checks for mastery." },
];
const TOOLS = DIGITAL_APPS.concat(RESOURCES);

function Ico({ name, ...p }) {
  const I = Icons[name];
  return I ? <I {...p} /> : null;
}

function FwNote() {
  return (
    <div className="fw-note">
      <Ico name="leaf" style={{ width: 18, height: 18, flex: "none" }} />
      <span>
        Framework page — structure ready, content slots to be connected.{" "}
        <span className="th">โครงหน้าพร้อมแล้ว รอเชื่อมต่อเนื้อหาจริง</span>
      </span>
    </div>
  );
}

function PageHead({ eyebrow, en, th, sub }) {
  return (
    <div className="page-head">
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="page-title">{en} <span className="th">· {th}</span></h1>
      {sub && <p className="page-sub">{sub}</p>}
    </div>
  );
}

/* ---------------- HOME ---------------- */
function HomePage({ go }) {
  return (
    <div>
      <div className="hero">
        <span className="eyebrow"><Ico name="leaf" style={{ width: 16, height: 16 }} /> Thai Literacy Studio</span>
        <h1>
          Learn to read Thai, one sound at a time
          <span className="th">เรียนรู้การอ่านภาษาไทยทีละเสียง</span>
        </h1>
        <p>
          A classroom toolkit built on explicit, systematic phonics (UFLI-style) for our
          Kindergarten–Grade 6 learners. Blend sounds on the board, then practise with matching
          lessons, decodable readings and worksheets.
        </p>
        <div className="hero-cta">
          <button className="btn btn-leaf" onClick={() => go("board")}>
            <Ico name="board" style={{ width: 18, height: 18 }} /> Open Blending Board
          </button>
          <button className="btn btn-ghost" onClick={() => go("lesson")}>View the lesson sequence</button>
        </div>
      </div>

      <div className="page-head" style={{ marginBottom: 16 }}>
        <span className="eyebrow">Digital Apps · เครื่องมือดิจิทัล</span>
        <h2 className="page-title" style={{ fontSize: 24, marginTop: 6 }}>Interactive tools <span className="th">· ฝึกประสมคำ</span></h2>
      </div>
      <div className="tool-grid">
        {DIGITAL_APPS.map((t) => (
          <button key={t.id} className="tool-card" onClick={() => go(t.id)}>
            <span className="tool-ico" style={{ background: t.color }}><Ico name={t.icon} /></span>
            <span className="t-en">{t.en}</span>
            <span className="t-th">{t.th}</span>
            <span className="t-desc">{t.desc}</span>
            <span className="t-go">Open <Ico name="arrow" /></span>
          </button>
        ))}
      </div>

      <div className="page-head" style={{ marginBottom: 16, marginTop: 34 }}>
        <span className="eyebrow">Resources · คลังบทเรียน</span>
        <h2 className="page-title" style={{ fontSize: 24, marginTop: 6 }}>Lessons &amp; materials <span className="th">· สื่อการสอน</span></h2>
      </div>
      <div className="tool-grid">
        {RESOURCES.map((t) => (
          <button key={t.id} className="tool-card" onClick={() => go(t.id)}>
            <span className="tool-ico" style={{ background: t.color }}><Ico name={t.icon} /></span>
            <span className="t-en">{t.en}</span>
            <span className="t-th">{t.th}</span>
            <span className="t-desc">{t.desc}</span>
            <span className="t-go">Open <Ico name="arrow" /></span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- ACTIVITY SHEETS ---------------- */
function ActivityPage() {
  const items = [
    { en: "Letter Formation", th: "คัดลายมือพยัญชนะ", tag: "Tracing", tagc: "earth" },
    { en: "Sound Sort", th: "แยกเสียงสระสั้น–ยาว", tag: "Phonemic", tagc: "" },
    { en: "Picture & Word Match", th: "จับคู่ภาพกับคำ", tag: "Vocabulary", tagc: "sky" },
    { en: "Tone Mark Hunt", th: "ตามหาวรรณยุกต์", tag: "Tones", tagc: "earth" },
    { en: "Build-a-Word", th: "ต่อคำจากพยางค์", tag: "Blending", tagc: "" },
    { en: "Read & Color", th: "อ่านแล้วระบายสี", tag: "Fluency", tagc: "sky" },
  ];
  return (
    <div>
      <PageHead eyebrow="Practice" en="Activity Sheets" th="แผ่นกิจกรรม"
        sub="Hands-on, printable practice that reinforces each lesson's target sounds — designed for tablets and paper alike." />
      <FwNote />
      <div className="grid-3">
        {items.map((it, i) => (
          <div className="item-card" key={i}>
            <Placeholder label="activity thumbnail" h={120} />
            <h3>{it.en}<span className="th">{it.th}</span></h3>
            <div className="item-meta">
              <span className={"tag " + it.tagc}>{it.tag}</span>
              <span className="tag sky">อ.–ป.6</span>
            </div>
            <div className="item-actions">
              <button className="btn btn-sm btn-leaf"><Ico name="play" style={{ width: 15, height: 15 }} /> Open</button>
              <button className="btn btn-sm btn-ghost"><Ico name="print" style={{ width: 15, height: 15 }} /> Print</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- LESSONS ---------------- */
// A systematic Thai phonics scope & sequence (UFLI-style), introduced in a
// deliberate order: the three consonant classes → finals (มาตราตัวสะกด) →
// tone marks → short/special vowels → clusters & leading consonants.
// Each lesson lists its new graphemes (name) and decodable example words (ex).
const LESSON_UNITS = [
  {
    n: 1, en: "Mid-class consonants & long ‑า", th: "อักษรกลาง + สระอา",
    lessons: [
      { no: "L1", name: "ก จ", ex: "กา · จา", st: "done" },
      { no: "L2", name: "ด ต", ex: "ดา · ตา", st: "done" },
      { no: "L3", name: "บ ป อ", ex: "บา · ปา · อา", st: "current" },
      { no: "L4", name: "ทบทวน", ex: "กา ตา ปา บา" },
    ],
  },
  {
    n: 2, en: "Long vowels", th: "สระเสียงยาว",
    lessons: [
      { no: "L5", name: "‑ี", ex: "กี · ดี · ปี" },
      { no: "L6", name: "‑ู", ex: "ดู · ปู · ตู" },
      { no: "L7", name: "เ‑ โ‑", ex: "เก · โต" },
      { no: "L8", name: "แ‑ ‑อ", ex: "แก · กอ · บอ" },
    ],
  },
  {
    n: 3, en: "High-class consonants", th: "อักษรสูง",
    lessons: [
      { no: "L9", name: "ข ฉ ถ", ex: "ขา · ฉา · ถา" },
      { no: "L10", name: "ผ ฝ", ex: "ผา · ฝา" },
      { no: "L11", name: "ส ห ศ ษ", ex: "สา · หา · ศาลา" },
    ],
  },
  {
    n: 4, en: "Low-class consonants", th: "อักษรต่ำ",
    lessons: [
      { no: "L12", name: "ค ง", ex: "คา · งา" },
      { no: "L13", name: "ช ซ ท น", ex: "ชา · ซา · ทา · นา" },
      { no: "L14", name: "พ ฟ ม", ex: "พา · ฟา · มา" },
      { no: "L15", name: "ย ร ล ว ฮ", ex: "ยา รา ลา วา ฮา" },
    ],
  },
  {
    n: 5, en: "Live finals", th: "มาตราตัวสะกดเสียงก้อง",
    lessons: [
      { no: "L16", name: "แม่กง ‑ง", ex: "กาง · ตาง" },
      { no: "L17", name: "แม่กน ‑น", ex: "กิน · ดิน" },
      { no: "L18", name: "แม่กม ‑ม", ex: "ลม · นม" },
      { no: "L19", name: "แม่เกย/เกอว ‑ย ‑ว", ex: "ยาย · ดาว" },
    ],
  },
  {
    n: 6, en: "Dead finals", th: "มาตราตัวสะกดเสียงตาย",
    lessons: [
      { no: "L20", name: "แม่กก ‑ก", ex: "นก · ปาก" },
      { no: "L21", name: "แม่กด ‑ด", ex: "มด · ตัด" },
      { no: "L22", name: "แม่กบ ‑บ", ex: "กบ · จับ" },
    ],
  },
  {
    n: 7, en: "Tone marks", th: "วรรณยุกต์",
    lessons: [
      { no: "L23", name: "ไม้เอก ‑่ (กลาง)", ex: "ก่า · ต่า" },
      { no: "L24", name: "ไม้โท ‑้ (กลาง)", ex: "ก้า · บ้า" },
      { no: "L25", name: "ไม้ตรี ‑๊ จัตวา ‑๋", ex: "ก๊า · ก๋า" },
      { no: "L26", name: "ผันอักษรสูง", ex: "ขา · ข่า · ข้า" },
      { no: "L27", name: "ผันอักษรต่ำ", ex: "คา · ค่า · ค้า" },
    ],
  },
  {
    n: 8, en: "Short & special vowels", th: "สระเสียงสั้น/พิเศษ",
    lessons: [
      { no: "L28", name: "‑ะ ‑ิ ‑ุ", ex: "กะ · กิ · กุ" },
      { no: "L29", name: "‑ำ ไ‑ ใ‑ เ‑า", ex: "กำ · ไก · ใจ · เรา" },
      { no: "L30", name: "สระเปลี่ยนรูป ‑ัว ‑ั", ex: "ตัว · วัน" },
    ],
  },
  {
    n: 9, en: "Clusters & leading consonants", th: "คำควบกล้ำ / อักษรนำ",
    lessons: [
      { no: "L31", name: "กร กล กว", ex: "กราบ · กลอง · กวาง" },
      { no: "L32", name: "ปร ปล ตร", ex: "ปลา · ตรง" },
      { no: "L33", name: "พร พล คร คล", ex: "พระ · คลอง" },
      { no: "L34", name: "อักษรนำ ห/อ นำ", ex: "หนู · อย่า" },
    ],
  },
];

function LessonsPage() {
  const total = LESSON_UNITS.reduce((s, u) => s + u.lessons.length, 0);
  return (
    <div>
      <PageHead eyebrow="Scope & Sequence" en="Lessons" th="บทเรียน"
        sub={"A systematic path from single sounds to full syllables — " + total +
          " lessons across " + LESSON_UNITS.length + " units. เรียงตามลำดับการสอน อักษร 3 หมู่ → ตัวสะกด → วรรณยุกต์ → สระพิเศษ → ควบกล้ำ"} />
      {LESSON_UNITS.map((u) => (
        <div className="unit" key={u.n}>
          <div className="unit-head">
            <span className="u-num">Unit {u.n}</span>
            <span className="u-title">{u.en}<span className="th">{u.th}</span></span>
          </div>
          <div className="lesson-chips">
            {u.lessons.map((l) => (
              <button key={l.no} className={"lchip " + (l.st || "")}>
                <span className="l-no">{l.no} {l.st === "done" ? "✓" : l.st === "current" ? "● กำลังเรียน" : ""}</span>
                <span className="l-name">{l.name}</span>
                <span className="l-ex">{l.ex}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- READING ---------------- */
function ReadingPage() {
  const [lvl, setLvl] = React.useState("A");
  const levels = [
    { id: "A", en: "Level A · long vowels" },
    { id: "B", en: "Level B · high-class" },
    { id: "C", en: "Level C · tone marks" },
  ];
  const passages = [
    { en: "Ka the crow", th: "กาตาดี", lines: ["กา มี ตา", "กา ดู ปู", "ปู มา หา กา"] },
    { en: "At the pond", th: "ที่สระน้ำ", lines: ["ปู อยู่ ใน น้ำ", "ปลา ว่าย มา"] },
  ];
  return (
    <div>
      <PageHead eyebrow="Decodable Texts" en="Reading Passages" th="บทอ่าน"
        sub="Short passages built only from sounds students have already learned — so they can read every word with success." />
      <FwNote />
      <div className="level-tabs">
        {levels.map((l) => (
          <button key={l.id} className={"level-tab" + (lvl === l.id ? " on" : "")} onClick={() => setLvl(l.id)}>{l.en}</button>
        ))}
      </div>
      <div className="grid-2">
        {passages.map((p, i) => (
          <div className="item-card" key={i}>
            <div className="item-meta">
              <span className="tag">{lvl === "A" ? "Long vowels" : lvl === "B" ? "High-class" : "Tones"}</span>
              <span className="tag earth">Decodable</span>
            </div>
            <h3>{p.en}<span className="th">{p.th}</span></h3>
            <div className="passage-thai">
              {p.lines.map((ln, j) => <div key={j}>{ln}</div>)}
            </div>
            <div className="item-actions">
              <button className="btn btn-sm btn-leaf"><Ico name="play" style={{ width: 15, height: 15 }} /> Read</button>
              <button className="btn btn-sm btn-ghost"><Ico name="print" style={{ width: 15, height: 15 }} /> Print</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- WORKSHEETS ---------------- */
function WorksheetsPage() {
  const [filter, setFilter] = React.useState("All");
  const filters = ["All", "Tracing", "Blending", "Dictation", "Assessment"];
  const sheets = [
    { en: "Trace & Say: ก จ ด ต", th: "คัด ก จ ด ต", type: "Tracing" },
    { en: "Blend the syllable", th: "ประสมพยางค์", type: "Blending" },
    { en: "Sound dictation #1", th: "เขียนตามคำบอก", type: "Dictation" },
    { en: "Unit 1 check", th: "ทดสอบหน่วยที่ 1", type: "Assessment" },
    { en: "Vowel match -า -ี -ู", th: "จับคู่สระ", type: "Blending" },
    { en: "Trace tone marks", th: "คัดวรรณยุกต์", type: "Tracing" },
  ];
  const shown = filter === "All" ? sheets : sheets.filter((s) => s.type === filter);
  return (
    <div>
      <PageHead eyebrow="Print & Assess" en="Worksheets" th="ใบงาน"
        sub="Ready-to-print worksheets and quick checks, organised by skill so you can pull exactly what today's lesson needs." />
      <FwNote />
      <div className="level-tabs">
        {filters.map((f) => (
          <button key={f} className={"level-tab" + (filter === f ? " on" : "")} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="grid-3">
        {shown.map((s, i) => (
          <div className="item-card" key={i}>
            <Placeholder label="worksheet preview" h={150} />
            <h3>{s.en}<span className="th">{s.th}</span></h3>
            <div className="item-meta"><span className="tag earth">{s.type}</span></div>
            <div className="item-actions">
              <button className="btn btn-sm btn-primary"><Ico name="print" style={{ width: 15, height: 15 }} /> Print PDF</button>
              <button className="btn btn-sm btn-ghost">Preview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.TOOLS = TOOLS;
window.DIGITAL_APPS = DIGITAL_APPS;
window.RESOURCES = RESOURCES;
window.Pages = { HomePage, ActivityPage, LessonsPage, ReadingPage, WorksheetsPage };
window.Ico = Ico;

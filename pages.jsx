/* global React */
const Icons = window.Icons;
const Placeholder = window.Placeholder;

const DIGITAL_APPS = [
  { id: "mat", en: "Word Work Mat", th: "แผ่นฝึกคำ", icon: "activity", color: "var(--earth)", desc: "Build C+V and C+V+C words at the Beginner level (K2–Y2) — consonants, vowels, finals and tones." },
  { id: "board", en: "Blending Board", th: "กระดานประสมคำ", icon: "board", color: "var(--leaf)", desc: "Slide consonants, vowels and tones to blend syllables live — the UFLI blending drill." },
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
/* ---- hand-drawn line-art for a warm, friendly HOME ---- */
const HERO_ART = `
<svg viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ภาพวาดลายเส้นเด็กใส่แว่นกำลังนั่งอ่านหนังสือพร้อมพยัญชนะไทย">
  <defs>
    <filter id="hpaw" x="-7%" y="-7%" width="114%" height="114%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="5" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.3"/>
    </filter>
  </defs>
  <ellipse cx="160" cy="280" rx="96" ry="12" fill="#8a7e66" opacity=".16"/>
  <g filter="url(#hpaw)" stroke="var(--ink,#2f2a20)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- hair bun -->
    <circle cx="197" cy="92" r="15" fill="#6b4f2e"/>
    <!-- sweater body -->
    <path d="M116 254 c-6 -54 18 -92 44 -92 c26 0 50 38 44 92 z" fill="var(--leaf-l,#e6eddf)"/>
    <!-- sleeves -->
    <path d="M126 202 c-10 14 -3 27 15 24" fill="var(--leaf-l,#e6eddf)"/>
    <path d="M194 202 c10 14 3 27 -15 24" fill="var(--leaf-l,#e6eddf)"/>
    <!-- neck -->
    <path d="M150 150 q10 10 20 0"/>
    <!-- head -->
    <circle cx="160" cy="112" r="40" fill="#fff"/>
    <!-- hair / bangs -->
    <path d="M121 116 c-2 -44 28 -62 39 -62 c11 0 41 18 39 62 c-13 -7 -26 -9 -39 -9 c-13 0 -26 2 -39 9 z" fill="#6b4f2e"/>
    <!-- cheeks -->
    <ellipse cx="135" cy="127" rx="7" ry="4.5" fill="var(--earth-l,#f6e8d2)" stroke="none"/>
    <ellipse cx="185" cy="127" rx="7" ry="4.5" fill="var(--earth-l,#f6e8d2)" stroke="none"/>
    <!-- glasses -->
    <circle cx="146" cy="117" r="13" fill="none"/>
    <circle cx="174" cy="117" r="13" fill="none"/>
    <path d="M159 116 h2 M133 114 l-10 -3 M187 114 l10 -3"/>
    <!-- happy eyes -->
    <path d="M141 118 q5 5 10 0"/>
    <path d="M169 118 q5 5 10 0"/>
    <!-- nose + smile -->
    <path d="M159 124 q2 3 3 0"/>
    <path d="M151 134 q9 8 18 0"/>
    <!-- open book -->
    <path d="M160 214 c-24 -12 -48 -12 -66 -5 l0 54 c18 -7 42 -7 66 5 z" fill="#fff"/>
    <path d="M160 214 c24 -12 48 -12 66 -5 l0 54 c-18 -7 -42 -7 -66 5 z" fill="#fff"/>
    <path d="M160 214 v54"/>
    <path d="M106 228 h32 M106 238 h26 M106 250 h30" stroke="#8a7e66" stroke-width="2.4"/>
    <!-- hands -->
    <circle cx="140" cy="216" r="8" fill="#fff"/>
    <circle cx="180" cy="216" r="8" fill="#fff"/>
  </g>
  <text x="188" y="247" font-family="'Sarabun',sans-serif" font-weight="800" font-size="24" fill="var(--leaf,#5b7a4b)">ก</text>
  <path d="M251 64 c-7 -11 -24 -6 -24 7 c0 11 16 20 24 26 c8 -6 24 -15 24 -26 c0 -13 -17 -18 -24 -7 z" fill="var(--earth,#c98a3b)" stroke="var(--ink,#2f2a20)" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M60 70 l4 13 l13 4 l-13 4 l-4 13 l-4 -13 l-13 -4 l13 -4 z" fill="var(--earth,#c98a3b)"/>
  <path d="M290 158 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 l9 -3 z" fill="var(--leaf,#5b7a4b)"/>
  <text x="34" y="150" font-family="'Sarabun',sans-serif" font-weight="700" font-size="22" fill="#8a7e66" opacity=".8">ข</text>
  <text x="276" y="252" font-family="'Sarabun',sans-serif" font-weight="700" font-size="22" fill="#8a7e66" opacity=".8">ค</text>
</svg>`;
const SQUIGGLE = `<svg viewBox="0 0 230 12" fill="none" preserveAspectRatio="none"><path d="M3 7 q14 -8 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`;
const SUN_DOODLE = `<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="30" cy="30" r="12"/><path d="M30 5 v8 M30 47 v8 M5 30 h8 M47 30 h8 M12 12 l6 6 M42 42 l6 6 M48 12 l-6 6 M18 42 l-6 6"/></svg>`;
const STAR_DOODLE = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"><path d="M16 3 c2 8 5 11 13 13 c-8 2 -11 5 -13 13 c-2 -8 -5 -11 -13 -13 c8 -2 11 -5 13 -13 z" fill="currentColor"/></svg>`;

function HomePage({ go }) {
  return (
    <div>
      <div className="hero hero--photo">
        <span className="hero-doodle d-star" dangerouslySetInnerHTML={{ __html: STAR_DOODLE }} />
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><Ico name="leaf" style={{ width: 16, height: 16 }} /> Thai Literacy Studio</span>
            <h1>
              Learn to read Thai, one sound at a time
              <span className="th">เรียนรู้การอ่านภาษาไทยทีละเสียง</span>
            </h1>
            <span className="squiggle" style={{ color: "var(--earth)" }} dangerouslySetInnerHTML={{ __html: SQUIGGLE }} />
            <p>
              A warm, friendly classroom toolkit built on explicit, systematic phonics (UFLI-style)
              for K–Grade 6 learners. Blend sounds on the board, then practise with lessons, readings and games.
            </p>
            <div className="hero-cta">
              <button className="btn btn-leaf" onClick={() => go("board")}>
                <Ico name="board" style={{ width: 18, height: 18 }} /> Open Blending Board
              </button>
              <button className="btn btn-ghost" onClick={() => go("lesson")}>View the lesson sequence</button>
              <a className="btn btn-ghost" href="share.html">📱 แชร์ · Share</a>
            </div>
          </div>
          <div className="hero-photo">
            <img src="images/panyaden-campus.jpg" alt="อาคารดินและไผ่อันเป็นเอกลักษณ์ของโรงเรียนปัญญาเด่น พร้อมป้ายชื่อ PANYADEN และสนามหญ้าเขียว" loading="eager" />
          </div>
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
/* shared 3-level selector — Beginner / Intermediate / Advanced (optional "All") */
function LevelBar({ value, onChange, withAll, extra }) {
  const opts = (withAll ? [{ key: "all", n: "•", en: "All", th: "" }] : []).concat([
    { key: "beginner", n: "1", en: "Beginner", th: "" },
    { key: "intermediate", n: "2", en: "Intermediate", th: "" },
    { key: "advanced", n: "3", en: "Advanced", th: "" },
  ]).concat(extra || []);
  return (
    <div className="level-bar">
      <span className="lvl-lead">ระดับ <span className="en">· Level</span></span>
      <div className="lvl-seg">
        {opts.map((L) => (
          <button key={L.key} className={value === L.key ? "on" : ""} onClick={() => onChange(L.key)}>
            <span className="lvl-step">{L.n}</span>
            <span className="lvl-txt"><b>{L.en}</b><span className="th">{L.th}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActivityPage() {
  const items = [
    { en: "Letter Formation", th: "คัดลายมือพยัญชนะ", tag: "Tracing", tagc: "earth", level: "Beginner", href: "activity-letter-formation.html" },
    { en: "Sound Sort", th: "แยกเสียงสระสั้น–ยาว", tag: "Phonemic", tagc: "", level: "Beginner" },
    { en: "Picture & Word Match", th: "จับคู่ภาพกับคำ", tag: "Vocabulary", tagc: "sky", level: "Intermediate", href: "activity-picture-word-match.html" },
    { en: "Tone Mark Hunt", th: "ตามหาวรรณยุกต์", tag: "Tones", tagc: "earth", level: "Advanced", href: "activity-tone-mark-hunt.html" },
    { en: "Build-a-Word", th: "ต่อคำจากพยางค์", tag: "Blending", tagc: "", level: "Intermediate", href: "activity-build-a-word.html" },
    { en: "Read & Color", th: "อ่านแล้วระบายสี", tag: "Fluency", tagc: "sky", level: "Advanced", href: "activity-read-and-color.html" },
  ];
  const [lvl, setLvl] = React.useState("all");
  const shown = lvl === "all" ? items : items.filter((it) => it.level.toLowerCase() === lvl);
  return (
    <div>
      <PageHead eyebrow="Practice" en="Activity Sheets" th="แผ่นกิจกรรม"
        sub="Hands-on, printable practice that reinforces each lesson's target sounds — designed for tablets and paper alike." />
      <FwNote />
      <LevelBar value={lvl} onChange={setLvl} withAll />
      <div className="grid-3">
        {shown.map((it, i) => (
          <div className="item-card" key={i}>
            <Placeholder label="activity thumbnail" h={120} />
            <h3>{it.en}<span className="th">{it.th}</span></h3>
            <div className="item-meta">
              <span className={"tag " + it.tagc}>{it.tag}</span>
              <span className="tag sky">{it.level}</span>
            </div>
            <div className="item-actions">
              <button className="btn btn-sm btn-leaf" disabled={!it.href}
                onClick={() => it.href && (window.location.href = it.href)}>
                <Ico name="play" style={{ width: 15, height: 15 }} /> Open
              </button>
              <button className="btn btn-sm btn-ghost" disabled={!it.href}
                onClick={() => it.href && window.open(it.href + "?print=1", "_blank")}>
                <Ico name="print" style={{ width: 15, height: 15 }} /> Print
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- LESSONS ---------------- */
// A systematic Thai phonics scope & sequence (UFLI-style), split by grade
// level (K2 → Y3) to match the Word Work Mat grapheme inventories in
// thai-data.js GRADES. Each grade is a small scope & sequence; every lesson
// lists its new graphemes (name) and decodable example words (ex).
const LESSONS_BY_GRADE = {
  k2: [
    {
      n: 1, en: "First mid-class consonants & ‑า", th: "อักษรกลางกลุ่มแรก + สระอา",
      lessons: [
        { no: "L1", name: "ก จ", ex: "กา · จา", st: "done" },
        { no: "L2", name: "ด ต", ex: "ดา · ตา", st: "done" },
        { no: "L3", name: "บ ป อ", ex: "บา · ปา · อา", st: "current" },
        { no: "L4", name: "ม น", ex: "มา · นา" },
      ],
    },
    {
      n: 2, en: "Long vowels", th: "สระเสียงยาว",
      lessons: [
        { no: "L5", name: "‑ี", ex: "ดี · ปี · มี" },
        { no: "L6", name: "‑ู", ex: "ดู · ปู · งู" },
        { no: "L7", name: "เ‑", ex: "เก · เต · เป" },
        { no: "L8", name: "ทบทวน", ex: "กา ดี ดู เก" },
      ],
    },
  ],
  k3: [
    {
      n: 1, en: "High-class consonants", th: "อักษรสูง",
      lessons: [
        { no: "L1", name: "ข ค", ex: "ขา · คา" },
        { no: "L2", name: "ผ พ", ex: "ผา · พา" },
        { no: "L3", name: "ส ห", ex: "สา · หา" },
      ],
    },
    {
      n: 2, en: "More low-class consonants", th: "อักษรต่ำเพิ่ม",
      lessons: [
        { no: "L4", name: "ย ร ล ว", ex: "ยา · รา · ลา · วา" },
        { no: "L5", name: "ทบทวน 18 ตัว", ex: "มา ขา รา สา" },
      ],
    },
    {
      n: 3, en: "Long vowels complete", th: "สระเสียงยาวครบ",
      lessons: [
        { no: "L6", name: "แ‑ โ‑", ex: "แก · โต" },
        { no: "L7", name: "‑อ", ex: "กอ · บอ · รอ" },
      ],
    },
    {
      n: 4, en: "Simple finals", th: "ตัวสะกดง่าย",
      lessons: [
        { no: "L8", name: "แม่กง ‑ง", ex: "กาง · ตาง" },
        { no: "L9", name: "แม่กน ‑น", ex: "กิน · ดิน" },
        { no: "L10", name: "แม่กม ‑ม", ex: "ลม · นม" },
      ],
    },
  ],
  y1: [
    {
      n: 1, en: "Frequent consonants (all 3 classes)", th: "พยัญชนะที่พบบ่อย 3 หมู่",
      lessons: [
        { no: "L1", name: "ทบทวนอักษรกลาง", ex: "กา จา ดา ตา" },
        { no: "L2", name: "ทบทวนอักษรสูง", ex: "ขา สา หา ผา" },
        { no: "L3", name: "ทบทวนอักษรต่ำ", ex: "คา มา รา ลา" },
      ],
    },
    {
      n: 2, en: "Special & short vowels", th: "สระพิเศษและสระเสียงสั้น",
      lessons: [
        { no: "L4", name: "ไ‑ ใ‑", ex: "ไก · ใจ" },
        { no: "L5", name: "‑ำ เ‑า", ex: "กำ · เรา" },
        { no: "L6", name: "‑ิ ‑ึ ‑ุ (สั้น)", ex: "กิ · กึ · กุ" },
      ],
    },
    {
      n: 3, en: "Live finals", th: "มาตราตัวสะกดเสียงก้อง",
      lessons: [
        { no: "L7", name: "แม่เกย ‑ย", ex: "ยาย · โดย" },
        { no: "L8", name: "แม่เกอว ‑ว", ex: "ดาว · แมว" },
        { no: "L9", name: "ทบทวน 5 มาตรา", ex: "กาง กิน ลม ดาว" },
      ],
    },
  ],
  y2: [
    {
      n: 1, en: "Dead finals", th: "มาตราตัวสะกดเสียงตาย",
      lessons: [
        { no: "L1", name: "แม่กก ‑ก", ex: "นก · ปาก" },
        { no: "L2", name: "แม่กด ‑ด", ex: "มด · ตัด" },
        { no: "L3", name: "แม่กบ ‑บ", ex: "กบ · จับ" },
      ],
    },
    {
      n: 2, en: "Tone marks (mid class)", th: "วรรณยุกต์ (อักษรกลาง)",
      lessons: [
        { no: "L4", name: "ไม้เอก ‑่", ex: "ก่า · ต่า" },
        { no: "L5", name: "ไม้โท ‑้", ex: "ก้า · บ้า" },
        { no: "L6", name: "ไม้ตรี ‑๊ จัตวา ‑๋", ex: "ก๊า · ก๋า" },
      ],
    },
    {
      n: 3, en: "Tone rules across classes", th: "ผันเสียงตามไตรยางศ์",
      lessons: [
        { no: "L7", name: "ผันอักษรสูง", ex: "ขา · ข่า · ข้า" },
        { no: "L8", name: "ผันอักษรต่ำ", ex: "คา · ค่า · ค้า" },
        { no: "L9", name: "ทบทวนผันเสียง", ex: "ป่า ป้า น่า น้า" },
      ],
    },
  ],
  y3: [
    {
      n: 1, en: "True clusters", th: "คำควบกล้ำแท้",
      lessons: [
        { no: "L1", name: "กร กล กว", ex: "กราบ · กลอง · กวาง" },
        { no: "L2", name: "ปร ปล ตร", ex: "ปลา · ตรง" },
        { no: "L3", name: "พร พล คร คล", ex: "พระ · คลอง" },
      ],
    },
    {
      n: 2, en: "Leading consonants", th: "อักษรนำ",
      lessons: [
        { no: "L4", name: "ห นำ", ex: "หนู · หมา · หญ้า" },
        { no: "L5", name: "อ นำ", ex: "อย่า · อยาก · อยู่" },
      ],
    },
    {
      n: 3, en: "Diphthongs & special vowels", th: "สระประสม/พิเศษ",
      lessons: [
        { no: "L6", name: "เ‑ีย เ‑ือ", ex: "เสีย · เรือ" },
        { no: "L7", name: "‑ัว", ex: "ตัว · วัว" },
        { no: "L8", name: "ฤ ฤๅ", ex: "ฤดู · ฤๅษี" },
      ],
    },
  ],
};

// Lessons grade items for the "Lessons ▾" nav dropdown (one per grade).
// K2–Y3 come from THAI.GRADES; Y4–Y6 open the Comprehension (read-to-learn) strand.
const LESSON_ITEMS = THAI.GRADE_ORDER.map((id) => ({
  id: "lesson-" + id,
  en: "Lessons · " + THAI.GRADES[id].en,
  th: "",   // English grade code only (avoid Thai grade-name confusion for int'l schools)
  icon: "lesson",
  grade: id,
})).concat(["y4", "y5", "y6"].map((id) => ({
  id: "lesson-" + id,
  en: "Lessons · " + id.toUpperCase(),
  th: "",
  icon: "lesson",
  grade: id,
})));

const LESSON_LEVELS = { beginner: ["k2", "k3", "y1"], intermediate: ["y2"], advanced: ["y3"], comprehension: ["y4", "y5", "y6"] };
const lessonGradeLevel = (gg) => Object.keys(LESSON_LEVELS).find((L) => LESSON_LEVELS[L].includes(gg)) || "beginner";
// Comprehension (Y4–6) "read-to-learn" phases — link to the Reading & Writing pack + full curriculum.
const COMP_PHASES = [
  { en: "Fluency", th: "อ่านคล่อง", range: "C1–C8", page: 1 },
  { en: "Vocabulary", th: "คลังคำและคำศัพท์", range: "C9–C18", page: 6 },
  { en: "Comprehension", th: "อ่านจับใจความ", range: "C19–C28", page: 12 },
  { en: "Writing", th: "การเขียนและนำเสนอ", range: "C29–C36", page: 18 },
  { en: "Writing Workshop", th: "การเขียนเชิงโครงสร้าง", range: "Y4–Y6", page: 1, file: "activity-writing-workshop.html" },
  { en: "Sentence Builder", th: "เรียงประโยค (เกมโต้ตอบ)", range: "🎮 Interactive", file: "interactive-sentence-scramble.html", interactive: true },
  { en: "Word Builder", th: "สร้างคำ (ประสม–ลดรูปสระ)", range: "🎮 Interactive", file: "interactive-word-builder.html", interactive: true },
  { en: "Word Map", th: "จัดกลุ่มคำตามมาตรา", range: "🎮 Interactive", file: "interactive-mindmap.html", interactive: true },
  { en: "Heart Words", th: "คำที่ต้องจำ", range: "🎮 Interactive", file: "interactive-heart-words.html", interactive: true },
  { en: "Connected Text", th: "อ่านจับใจความ + คำถาม", range: "🎮 Interactive", file: "interactive-reading.html", interactive: true },
];
// Comprehension (Y4–Y6) full per-lesson breakdown (C1–C36), grouped Y4/Y5/Y6 → unit → lessons.
const YEAR_FOCUS = {
  Y4: "อ่านคล่อง & อ่านคำยาก (C1–C12)",
  Y5: "สร้างคำ สำนวน & จับใจความ (C13–C22)",
  Y6: "คิดวิเคราะห์ & การเขียน (C23–C36)",
};
const COMP_UNITS = [
  { year: "Y4", n: "C1–C4", en: "Reading fluency & accuracy", th: "อ่านคล่องและถูกต้อง", lessons: [
    { no: "C1", name: "อ่านซ้ำเพื่อความคล่อง", ex: "อ่านนิทานสั้น ซ้ำ 3 รอบ จับเวลา" },
    { no: "C2", name: "อ่านเป็นวลี ไม่อ่านทีละคำ", ex: "“เด็ก ๆ วิ่งเล่น | ในสนาม”" },
    { no: "C3", name: "การเว้นวรรคและอ่านตามเครื่องหมาย", ex: "ประโยคยาวที่มีวรรคตอน" },
    { no: "C4", name: "อ่านทำนองเสนาะ (ร้อยกรองง่าย)", ex: "กาพย์ยานี / กลอนสี่บทสั้น" },
  ] },
  { year: "Y4", n: "C5–C8", en: "Multisyllabic words & leading consonants", th: "คำหลายพยางค์ & อักษรนำ/ควบไม่แท้", lessons: [
    { no: "C5", name: "แบ่งพยางค์คำหลายพยางค์", ex: "มะ-ละ-กอ · โรง-เรียน · สวน-สัตว์" },
    { no: "C6", name: "อักษรควบไม่แท้ (ทร → ซ)", ex: "ทราย ทรง จริง เศร้า สร้าง" },
    { no: "C7", name: "อักษรนำ อ นำ ย", ex: "อย่า อยู่ อย่าง อยาก" },
    { no: "C8", name: "อักษรนำ (อ่านสองพยางค์)", ex: "ขนม สนาม ตลาด ฉลาด" },
  ] },
  { year: "Y4", n: "C9–C12", en: "Homonyms & commonly-confused words", th: "คำพ้องและคำที่มักเขียนผิด", lessons: [
    { no: "C9", name: "คำพ้องเสียง", ex: "การ–กาล · ใต้–ไต้ · พาน–พาล" },
    { no: "C10", name: "คำพ้องรูป", ex: "เพลา · สระ · แหน" },
    { no: "C11", name: "คำที่มักเขียน/อ่านผิด", ex: "อนุญาต กะเพรา สังเกต" },
    { no: "C12", name: "คำยืม/คำทับศัพท์", ex: "ฟุตบอล คอมพิวเตอร์ เทคโนโลยี" },
  ] },
  { year: "Y5", n: "C13–C15", en: "Word formation", th: "การสร้างคำ", lessons: [
    { no: "C13", name: "คำมูล–คำประสม", ex: "แม่น้ำ พ่อครัว รถไฟ น้ำตา" },
    { no: "C14", name: "คำซ้ำ–คำซ้อน", ex: "เด็ก ๆ · บ้านเรือน เสื้อผ้า" },
    { no: "C15", name: "คำสมาส (เบื้องต้น)", ex: "วิทยาศาสตร์ ประวัติศาสตร์ ราชการ" },
  ] },
  { year: "Y5", n: "C16–C18", en: "Register, idioms & proverbs", th: "ราชาศัพท์ สำนวน สุภาษิต", lessons: [
    { no: "C16", name: "คำสุภาพและราชาศัพท์เบื้องต้น", ex: "รับประทาน · บรรทม · พระเนตร" },
    { no: "C17", name: "สำนวนไทย", ex: "น้ำขึ้นให้รีบตัก · ชักแม่น้ำทั้งห้า" },
    { no: "C18", name: "สุภาษิต–คำพังเพย", ex: "รักวัวให้ผูก รักลูกให้ตี" },
  ] },
  { year: "Y5", n: "C19–C22", en: "Main idea & summarizing", th: "ใจความสำคัญและการสรุป", lessons: [
    { no: "C19", name: "ใจความสำคัญของย่อหน้า", ex: "หาประโยคใจความหลัก" },
    { no: "C20", name: "ใจความสำคัญ vs รายละเอียด", ex: "ประโยคหลัก vs ประโยคขยาย" },
    { no: "C21", name: "ตั้งชื่อเรื่อง/หัวข้อ", ex: "อ่านเรื่องสั้นแล้วตั้งชื่อ" },
    { no: "C22", name: "สรุปความเป็นประโยคเดียว", ex: "สรุปนิทานเป็น 1 ประโยค" },
  ] },
  { year: "Y6", n: "C23–C25", en: "Sequence & cause–effect", th: "ลำดับเหตุการณ์และเหตุผล", lessons: [
    { no: "C23", name: "เรียงลำดับเหตุการณ์", ex: "ก่อน · จากนั้น · สุดท้าย" },
    { no: "C24", name: "เหตุและผล", ex: "“ฝนตก จึง ถนนเปียก”" },
    { no: "C25", name: "คาดเดาเรื่องจากเบาะแส", ex: "อ่านครึ่งเรื่องแล้วเดาตอนจบ" },
  ] },
  { year: "Y6", n: "C26–C28", en: "Critical reading & real-world texts", th: "คิดวิเคราะห์และอ่านข้อมูลจริง", lessons: [
    { no: "C26", name: "ข้อเท็จจริง vs ข้อคิดเห็น", ex: "คัดแยกประโยค 2 ประเภท" },
    { no: "C27", name: "จุดประสงค์ของผู้เขียน", ex: "ข่าว · โฆษณา · นิทาน" },
    { no: "C28", name: "อ่านข้อมูลจริง (ตาราง/ป้าย)", ex: "ตารางเวร · เมนู · ป้ายราคา" },
  ] },
  { year: "Y6", n: "C29–C32", en: "Précis & essay writing", th: "ย่อความและเรียงความ", lessons: [
    { no: "C29", name: "ย่อความ", ex: "ย่อย่อหน้าให้เหลือ 2–3 บรรทัด" },
    { no: "C30", name: "โครงเรื่องเรียงความ", ex: "ผังคำนำ–เนื้อเรื่อง–สรุป" },
    { no: "C31", name: "เขียนคำนำและสรุป", ex: "คำนำ 1 ย่อหน้า + สรุป 1 ย่อหน้า" },
    { no: "C32", name: "เขียนเรียงความสั้น", ex: "หัวข้อ: ครอบครัวของฉัน" },
  ] },
  { year: "Y6", n: "C33–C36", en: "Creative writing & presenting", th: "เขียนสร้างสรรค์และนำเสนอ", lessons: [
    { no: "C33", name: "เขียนเล่าเรื่องจากภาพ/ประสบการณ์", ex: "เล่าวันหยุดของฉัน" },
    { no: "C34", name: "เขียนจดหมาย/บันทึก", ex: "จดหมายถึงเพื่อน" },
    { no: "C35", name: "ใช้พจนานุกรม & มารยาทการอ่าน", ex: "ค้นคำ 5 คำที่ไม่รู้ความหมาย" },
    { no: "C36", name: "โครงงานรักการอ่าน (Capstone)", ex: "อ่าน 1 เล่ม + นำเสนอหน้าชั้น" },
  ] },
];
function LessonsPage({ grade }) {
  const [lvl, setLvl] = React.useState(() => lessonGradeLevel(grade));
  const [compYear, setCompYear] = React.useState(() => (["y4", "y5", "y6"].includes(grade) ? grade.toUpperCase() : "Y4"));
  const grades = (LESSON_LEVELS[lvl] || []).filter((id) => LESSONS_BY_GRADE[id]);
  return (
    <div>
      <PageHead eyebrow="Scope & Sequence" en="Lessons" th="บทเรียน"
        sub="ลำดับการสอนแบบเป็นระบบ (UFLI-style) — เลือกระดับเพื่อดูหน่วยและบทเรียน" />
      <div className="lessons-cta">
        <span className="lc-txt">
          ดูหลักสูตรเต็มทุกบท ทุกช่วงชั้น <b>K2–Y6</b> (174 บท · 4 ระดับ) พร้อมจุดประสงค์ คำตัวอย่าง และกิจกรรม
          <span className="th"> · รวมสาย “อ่านเพื่อเรียนรู้” Y4–6</span>
        </span>
        <a className="btn btn-sm btn-leaf" href="curriculum.html">📚 Full Scope &amp; Sequence →</a>
      </div>
      <LevelBar value={lvl} onChange={setLvl} extra={[{ key: "comprehension", n: "4", en: "Comprehension", th: "Y4–6" }]} />
      {lvl === "comprehension" ? (
        <div>
          <h3 className="page-title" style={{ fontSize: 18, marginTop: 20, marginBottom: 2 }}>Comprehension<span className="th"> · Read to Learn (Y4–6)</span></h3>
          <p className="lv-goal" style={{ fontSize: 14, color: "var(--ink-3)", margin: "4px 0 12px" }}>
            เมื่อถอดรหัสได้คล่องแล้ว เน้นความเข้าใจ คลังคำ และการเขียน · เลือกชั้นปีเพื่อดูบทเรียนของชั้นนั้น แล้วฝึกด้วยใบงาน/เกม
          </p>
          <div className="level-bar" style={{ marginBottom: 6 }}>
            <span className="lvl-lead">ชั้นปี <span className="en">· Year</span></span>
            <div className="lvl-seg">
              {[{ key: "all", n: "•", en: "All" }, { key: "Y4", n: "4", en: "Y4" }, { key: "Y5", n: "5", en: "Y5" }, { key: "Y6", n: "6", en: "Y6" }].map((Y) => (
                <button key={Y.key} className={compYear === Y.key ? "on" : ""} onClick={() => setCompYear(Y.key)}>
                  <span className="lvl-step">{Y.n}</span>
                  <span className="lvl-txt"><b>{Y.en}</b></span>
                </button>
              ))}
            </div>
          </div>
          {["Y4", "Y5", "Y6"].filter((yr) => compYear === "all" || compYear === yr).map((yr) => (
            <div key={yr}>
              <h3 className="page-title" style={{ fontSize: 16, marginTop: 18, marginBottom: 2, color: "var(--leaf-d)" }}>
                {yr}<span className="th"> · {YEAR_FOCUS[yr]}</span>
              </h3>
              {COMP_UNITS.filter((u) => u.year === yr).map((u) => (
                <div className="unit" key={u.n}>
                  <div className="unit-head">
                    <span className="u-num">{u.n}</span>
                    <span className="u-title">{u.en}<span className="th">{u.th}</span></span>
                  </div>
                  <div className="lesson-chips">
                    {u.lessons.map((l) => (
                      <button key={l.no} className="lchip">
                        <span className="l-no">{l.no}</span>
                        <span className="l-name">{l.name}</span>
                        <span className="l-ex">{l.ex}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <h3 className="page-title" style={{ fontSize: 16, marginTop: 24, marginBottom: 6 }}>ฝึกและใบงาน<span className="th"> · Practice, worksheets &amp; games</span></h3>
          <div className="grid-3">
            {COMP_PHASES.map((ph) => {
              const href = ph.file ? (ph.page ? ph.file + "#s" + ph.page : ph.file) : "activity-reading-comprehension.html#s" + ph.page;
              return (
                <div className="item-card" key={ph.en}>
                  <h3>{ph.en}<span className="th">{ph.th}</span></h3>
                  <div className="item-meta"><span className="tag">Y4–6</span><span className="tag earth">{ph.range}</span></div>
                  <div className="item-actions">
                    <a className="btn btn-sm btn-leaf" href={href}><Ico name={ph.interactive ? "play" : "worksheet"} style={{ width: 15, height: 15 }} /> {ph.interactive ? "เล่นเกม · Play" : "ใบงาน · Worksheet"}</a>
                    {!ph.interactive && <a className="btn btn-sm btn-ghost" href="curriculum.html">บทเรียน</a>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : grades.map((gid) => {
        const g = THAI.GRADES[gid];
        const units = LESSONS_BY_GRADE[gid] || [];
        return (
          <div key={gid}>
            <h3 className="page-title" style={{ fontSize: 18, marginTop: 20, marginBottom: 2 }}>{g.en}</h3>
      {units.map((u) => (
        <div className="unit" key={gid + "-" + u.n}>
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
      })}
    </div>
  );
}

/* ---------------- READING ---------------- */
// Full-screen reading mode: shows the passage as big word tiles, one row per
// line, and highlights one word at a time so students can read along (great on
// a projector). Tap a word, use ◀ ▶ / space to step, Esc to close.
function ReadingMode({ passage, onClose }) {
  const lineWords = React.useMemo(() => passage.lines.map((ln) => ln.split(/\s+/).filter(Boolean)), [passage]);
  const starts = []; let acc = 0;
  lineWords.forEach((ws) => { starts.push(acc); acc += ws.length; });
  const totalW = acc;
  const [wIdx, setWIdx] = React.useState(0);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); setWIdx((i) => Math.min(totalW - 1, i + 1)); }
      else if (e.key === "ArrowLeft") setWIdx((i) => Math.max(0, i - 1));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [totalW, onClose]);

  return (
    <div className="rd-overlay" onClick={onClose}>
      <div className="rd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rd-head">
          <div>
            <div className="rd-title">{passage.en}</div>
            <div className="rd-th">{passage.th}</div>
          </div>
          <button className="rd-close" onClick={onClose} aria-label="ปิด">✕</button>
        </div>
        <div className="rd-lines">
          {lineWords.map((ws, li) => (
            <div className="rd-line" key={li}>
              {ws.map((w, wi) => {
                const idx = starts[li] + wi;
                return (
                  <button key={wi} className={"rd-word" + (idx === wIdx ? " cur" : idx < wIdx ? " done" : "")}
                    onClick={() => setWIdx(idx)}>{w}</button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="rd-controls">
          <button className="btn btn-ghost" onClick={() => setWIdx((i) => Math.max(0, i - 1))} disabled={wIdx === 0}>‹ ก่อนหน้า</button>
          <span className="rd-progress">{wIdx + 1} / {totalW}</span>
          <button className="btn btn-ghost" onClick={() => setWIdx(0)}>↺ เริ่มใหม่</button>
          <button className="btn btn-leaf" onClick={() => setWIdx((i) => Math.min(totalW - 1, i + 1))} disabled={wIdx >= totalW - 1}>คำถัดไป ›</button>
        </div>
        <div className="rd-hint">แตะที่คำเพื่อไฮไลต์ · ใช้ลูกศร ◀ ▶ หรือสเปซบาร์เลื่อนทีละคำ · Esc ปิด</div>
      </div>
    </div>
  );
}

function ReadingPage() {
  const [lvl, setLvl] = React.useState("beginner");
  const [reader, setReader] = React.useState(null);
  const passages = [
    // ----- Beginner (B1–B20) · designed scope & sequence (CV only) -----
    // สระทีละตัว: –า –ี –ู (B1–B4)
    { en: "Vowel –า", th: "สระอา · กา ตา มา", level: "beginner", lines: ["กา ตา มา นา", "ปา หา ลา ดา", "บา จา อา ขา", "ทา ชา วา ผา"] },
    { en: "Vowel –ี", th: "สระอี · ดี มี ปี", level: "beginner", lines: ["ดี มี ปี ตี", "สี ที วี กี", "ผี ฝี นี ลี", "ชี บี ซี รี"] },
    { en: "Vowel –ู", th: "สระอู · ดู ปู งู", level: "beginner", lines: ["ดู ปู งู รู", "หู ตู มู คู", "กู จู ลู ภู", "ชู ทู บู ซู"] },
    { en: "Read · –า –ี –ู", th: "อ่าน · ตา มี ปู", level: "beginner", lines: ["ตา มี ปู", "ปู ดู งู", "งู มา หา ตา", "ตา ดู ปู นา"] },
    // สระ เ– แ– โ– (B5–B8)
    { en: "Vowel เ–", th: "สระเอ · เก เต เป", level: "beginner", lines: ["เก เต เป เด", "เม เน เล เว", "เซ เท เพ เจ", "เค เข เผ เถ"] },
    { en: "Vowel แ–", th: "สระแอ · แก แต แป", level: "beginner", lines: ["แก แต แป แม", "แน แล แว แห", "แด แบ แค แพ", "แข แผ แถ แช"] },
    { en: "Vowel โ–", th: "สระโอ · โต โม โพ", level: "beginner", lines: ["โต โม โพ โน", "โล โก โด โบ", "โป โร โซ โท", "โข โค โผ โถ"] },
    { en: "Read · เ แ โ", th: "อ่าน · ตา ดู โต", level: "beginner", lines: ["ตา ดู โต", "โต มี ตา", "โต มา หา ตา", "ตา พา โต มา"] },
    // สระ ไ ใ เ–า –ำ (B9–B12)
    { en: "Vowel ไ ใ", th: "สระไอ ใอ · ไป ใจ", level: "beginner", lines: ["ไป ไก ไต ไม", "ไว ไห ไถ ไข", "ใจ ใน ใส ใบ", "ใย ไร ไล ไซ"] },
    { en: "Vowel เ–า", th: "สระเอา · เรา เขา", level: "beginner", lines: ["เกา เตา เปา เมา", "เนา เลา เรา เขา", "เดา เบา เสา เอา", "เกา เดา เลา เรา"] },
    { en: "Vowel –ำ", th: "สระอำ · ดำ ทำ", level: "beginner", lines: ["กำ ตำ ดำ นำ", "จำ ลำ ขำ ทำ", "รำ คำ ยำ งำ"] },
    { en: "Read · ไ ใ เ–า –ำ", th: "อ่าน · ตา ไป นา", level: "beginner", lines: ["ตา ไป นา", "ตา เอา ปู มา", "ดำ ดี มี ตา", "ใจ ดี มา หา"] },
    // คำสองพยางค์ (B13–B14)
    { en: "Two-syllable words", th: "คำสองพยางค์ · ตาดี ปูนา", level: "beginner", lines: ["ตาดี ปูนา ดูงู", "มาหา ตามา ดูตา", "นาดี กาดี ตาโต", "มีตา มีปู มีงู"] },
    { en: "Two-syllable words", th: "คำสองพยางค์ · อีกา ปูนา", level: "beginner", lines: ["อีกา ปูนา ตาดี", "มานา หาปู ดูตา", "กามา นามา ตามา", "ดูดี มีดี ตาดี"] },
    // สระ –อ + ทบทวน (B15–B16)
    { en: "Vowel –อ", th: "สระออ · ขอ รอ พอ", level: "beginner", lines: ["กอ ตอ ขอ รอ", "พอ มอ ลอ หอ", "คอ ดอ บอ ซอ", "ตอ นอ ยอ วอ"] },
    { en: "Review · ขา ตา", th: "ทบทวน · ตา มี ขา", level: "beginner", lines: ["ตา มี ขา", "ขา โต ดี", "ตา ดู ขา", "ขา พา ตา มา"] },
    // ประโยคสั้น (B17–B20)
    { en: "Sentences · ตา & ปู", th: "ประโยค · ตา ดู ปู", level: "beginner", lines: ["ตา พา มา นา", "ตา ดู ปู", "ปู มา หา ตา", "ตา ดี ดู ปู"] },
    { en: "Sentences · Manee", th: "ประโยค · มานี มา", level: "beginner", lines: ["มานี มา หา", "มานี ดู ตา", "ตา พา มานี มา", "มานี มี ตา ดี"] },
    { en: "Sentences · กา & ปู", th: "ประโยค · กา หา ปู", level: "beginner", lines: ["กา มา หา ปู", "ปู ดู กา", "กา พา ปู มา นา", "ปู กา มา ดู ตา"] },
    { en: "Review story", th: "ทบทวน · ตา มี ปู", level: "beginner", lines: ["ตา มี ปู", "ปู มี งู", "งู มา หา ตา", "ตา พา ปู ไป นา"] },
    // ----- Y2 Guided Reading · Intermediate (I1–I20) -----
    { en: "B1 · In the field", th: "นา มี ปู งู", level: "intermediate", lines: ["อา มี นา นา มี งู", "นา มี ปู กา ดู ปู", "งู ดู ปู มานี มา นา อา"] },
    { en: "B2 · Single words", th: "ตา ปู งู หู", level: "intermediate", lines: ["ตา ปู งู หู", "ตา มา ปา พา", "นา หา อา กา", "ตี มี ปี ดี"] },
    { en: "B3 · Two-word blends", th: "ตา ดู ปู นา", level: "intermediate", lines: ["ตาปู ปูนา หูตา", "ตีตาปู ดูดีดี อาดูกา", "ตาดูงู มาหาตา ดูปูนา"] },
    { en: "B4 · Manee & Toh", th: "มานี พา โต", level: "intermediate", lines: ["นา มี รู งู นา มี รู ปู", "มานี พา โต มา หา อา", "มานี พา โต มา นา", "มานี พา โต หา ปู", "มานี พา โต ดู ปู"] },
    { en: "B5 · Long vowels โ-", th: "โต โพ โป โม โห", level: "intermediate", lines: ["โต โพ โป โม โห", "นา ตา ปา อา วา", "ดี ตี มี วี รี", "ดู รู ปู หู งู"] },
    { en: "B6 · โมโห", th: "ตาโต โมโห", level: "intermediate", lines: ["ตาโต โมโห ปูนา กากี", "นาดี อีกา อารี", "มีโมโห โตตาดี มีงูมา", "พามานา อาดูปู"] },
    { en: "B7 · Vowels ไ ใ", th: "ไป ไว ใจ ใน", level: "intermediate", lines: ["ไป ไว ไอ ไร", "ไม ไต ไห ไส", "ใจ ใน ใด ใส"] },
    { en: "B8 · ใจดี", th: "ใจดี มีใจ", level: "intermediate", lines: ["ใจดี มีใจ ไปนา มาไว", "ชาดี สีใด ในใจ ไปหา", "ปีใด พาไป กาสี ไปดี", "โตดีใจ ไปปีใด ไปไวไว"] },
    { en: "B9 · Toh the dog", th: "โต มี อะไร", level: "intermediate", lines: ["โต มี ตา โต มี ขา", "โต มี หู หู โต มี อะไร", "โต เอา ขา ถู หู"] },
    { en: "B10 · Vowels อะ เอา", th: "กะ จะ เกา เขา", level: "intermediate", lines: ["กะ จะ ปะ อะ สะ", "ชะ ทะ นะ มะ ระ", "เกา เดา เตา เอา เรา", "เงา เขา เหา เสา เถา"] },
    // ----- Y2 Guided Reading (Set 3–5 · B11–B20) -----
    { en: "B11 · Vowel grid", th: "ตา ตี โต ไต เตา", level: "intermediate", lines: ["ตา ตี โต ไต เตา", "มา มี โม ไม เมา", "นา นี โน ไน เนา", "ขา ขี โข ไข เขา"] },
    { en: "B12 · Manee & Mana", th: "มานี มานะ จะปะ", level: "intermediate", lines: ["มานี มานะ จะปะ กะทะ", "มะระ อะไร จะไป จะดู", "ชะนี ดูใจ ไถนา หาเหา", "ในเตา เอาใจ มีเงา เสาโต"] },
    { en: "B13 · The crab", th: "ปู นา มี สี ดำ", level: "intermediate", lines: ["ปู นา มี สี ดำ โต ก็ มี หู สี ดำ", "หู โต มี ปู นา มานี จะ ตี ปู นา", "ปู นา ไป ใน รู"] },
    { en: "B14 · Manee's medicine", th: "มานี ทา ยา", level: "intermediate", lines: ["มานี เท ยา", "ทา หู โต", "มานี ทา ยา เบา เบา", "โต เอา ขา เกา หู"] },
    { en: "B15 · จะดูงู", th: "จะดูงู จะดูปู", level: "intermediate", lines: ["จะดูงู จะดูปู จะดูกา", "ถูกะทะ เถามะระ เอาอะไร", "อาจะไอ เขาไถนา ไถไปไวไว", "เอาขาถู เอาใจเขา เดาดูที"] },
    { en: "B16 · In our field", th: "ในนาเรา", level: "intermediate", lines: ["หาเสามา ในนาเรา เอาใจเรา", "มาดีดี สีเทาเทา เกาไวไว", "ไปดูปู ในรูงู"] },
    { en: "B17 · Vowel grid เ–", th: "เท เอ เย เก เม", level: "intermediate", lines: ["เท เอ เย เก เม", "เส เห เข เท เจ", "ทา ไท ทำ เทา เรา", "ขา เข ไข ขำ เขา"] },
    { en: "B18 · ทำนา", th: "ตาดำ ทำนา", level: "intermediate", lines: ["ตาดำ ทำนา พาไป ไถนา", "นาที สีดำ ขำดี มีรำ", "นาดำ จำเจ เกเร"] },
    { en: "B19 · สระ –ำ", th: "ชาดำ กำยำ ตำรา", level: "intermediate", lines: ["เรไร โมเม โยเย เทยา", "ทายา ชาดำ กำยำ ตำรา", "งาดำ นำไป ลำไย ตะไบ"] },
    { en: "B20 · ทำดี", th: "หากำไร กาสีดำ", level: "intermediate", lines: ["หากำไร กาสีดำ รำดีดี", "ขากำยำ ทำจำเจ เทกะทะ", "จะทำดี ตาสีดำ ถูเบาเบา", "ดูเขาทำนา ทายาสีดำ"] },
    // ----- Advanced (A1–A20) · designed scope & sequence -----
    // มาตราตัวสะกด 8 แม่ (A1–A8)
    { en: "Final ง (แม่กง)", th: "แม่กง · ลิง ยุง", level: "advanced", lines: ["ลิง ยุง หาง นาง", "ทาง บาง ของ สอง", "วิ่ง ดัง ฟัง ร้อง"] },
    { en: "Final น (แม่กน)", th: "แม่กน · กิน ดิน", level: "advanced", lines: ["กิน ดิน บิน ปีน", "จาน บาน งาน นาน", "คน ฝน ขน ต้น"] },
    { en: "Final ม (แม่กม)", th: "แม่กม · ลม ชม", level: "advanced", lines: ["ลม ชม ดม ตม", "นาม ยาม ถาม งาม", "ริม ส้ม ยิ้ม อิ่ม"] },
    { en: "Final ย (แม่เกย)", th: "แม่เกย · ขาย ยาย", level: "advanced", lines: ["ขาย ยาย สาย ตาย", "นาย ลาย ทาย หาย", "ง่าย ร้าย ป้าย โดย"] },
    { en: "Final ว (แม่เกอว)", th: "แม่เกอว · ดาว แมว", level: "advanced", lines: ["ดาว แมว หิว เลว", "ขาว หนาว สาว ยาว", "เร็ว แล้ว กาว ทิว"] },
    { en: "Final ก (แม่กก)", th: "แม่กก · นก ปาก", level: "advanced", lines: ["นก ปาก มาก จาก", "รัก ผัก ตก ยก", "บอก ออก ดอก ลูก"] },
    { en: "Final ด (แม่กด)", th: "แม่กด · มด ปิด", level: "advanced", lines: ["มด กด จด ปิด", "ตัด ขาด หมด รด", "รถ สด พูด มืด"] },
    { en: "Final บ (แม่กบ)", th: "แม่กบ · กบ จับ", level: "advanced", lines: ["กบ จับ รับ พบ", "ตอบ ขับ ทับ ลูบ", "รูป ภาพ บาป ดาบ"] },
    // วรรณยุกต์ (A9–A12)
    { en: "Tone · ไม้เอก", th: "ไม้เอก · ป่า ไก่", level: "advanced", lines: ["ป่า ปู่ ไก่ ใส่", "พ่อ น่า ที่ ไม่", "อ่าน ก่อน ห่าง บ่าย"] },
    { en: "Tone · ไม้โท", th: "ไม้โท · แม่ น้ำ", level: "advanced", lines: ["แม่ น้ำ ใช้ ได้", "บ้าน ห้า ม้า ช้าง", "ไม้ น้อง ซ้าย ค้า"] },
    { en: "Tone · ไม้ตรี ไม้จัตวา", th: "ตรี จัตวา · โต๊ะ จ๋า", level: "advanced", lines: ["โต๊ะ จ๊ะ ตุ๊ก กิ๊ก", "จ๋า ตี๋ จิ๋ว เป๋", "เดี๋ยว เกี๊ยว เอ๋ย ปิ๊ง"] },
    { en: "Tone · ผันวรรณยุกต์", th: "ผันเสียง · ข้า ค่า", level: "advanced", lines: ["ข้า ค่า ช้า ล่า", "ป้า ย่า พ่อ แม่", "ไก่ ไข่ ข้าว เก้า"] },
    // อักษรควบกล้ำ (A13–A16)
    { en: "Cluster กร กล กว", th: "ควบกล้ำ · กลอง กวาง", level: "advanced", lines: ["กรอบ กลอง กวาง ไกล", "กลาง กล้า กรง กราบ", "กลม กลัว กว่า ใกล้"] },
    { en: "Cluster ขว คร คล คว", th: "ควบกล้ำ · ครู ควาย", level: "advanced", lines: ["ขวา ขวด ขลุ่ย ขวาน", "ครู คลอง ความ ควาย", "คราว คลาย คว้า ครัว"] },
    { en: "Cluster ปร ปล พล ผล", th: "ควบกล้ำ · ปลา พระ", level: "advanced", lines: ["ปลา ปลูก ปลอม ปลด", "ปรับ ปราบ ปรุง โปรด", "พระ พลอย ผล แปลก"] },
    { en: "Cluster ตร · review", th: "ควบกล้ำ · ตรง พริก", level: "advanced", lines: ["ตรง ตรา ตรวจ ตรี", "พริก พรม ใคร ใกล้", "ปลาย คลาย กลาย ขวาง"] },
    // สระประสม (A17–A19) + ทบทวน (A20)
    { en: "Diphthong เ–ีย", th: "สระเอีย · เขียน เรียน", level: "advanced", lines: ["เสีย เมีย เปีย เลีย", "เขียน เรียน เพียง เสียง", "เลี้ยง เกลียด เปลี่ยน เรียก"] },
    { en: "Diphthong เ–ือ", th: "สระเอือ · เสือ เรือ", level: "advanced", lines: ["เสือ เรือ เมือง เดือน", "เชื่อ เหลือ เกลือ เนื้อ", "เพื่อน เมื่อ เรื่อง เครื่อง"] },
    { en: "Diphthong –ัว", th: "สระอัว · ตัว หัว", level: "advanced", lines: ["ตัว หัว วัว รั้ว", "บัว ครัว มัว ชั่ว", "กลัว ทั่ว ผัว ด้วง"] },
    { en: "Review · short sentences", th: "ทบทวน · ประโยคสั้น", level: "advanced", lines: ["พ่อ พา ลูก ไป นา", "แม่ เลี้ยง ไก่ กับ หมา", "เสือ ตัว ใหญ่ วิ่ง เร็ว", "เพื่อน เรียน เขียน หนังสือ"] },
  ];
  const shown = passages.filter((p) => p.level === lvl);
  return (
    <div>
      <PageHead eyebrow="Decodable Texts" en="Reading Passages" th="บทอ่าน"
        sub="Short passages built only from sounds students have already learned — so they can read every word with success." />
      <FwNote />
      <div className="lessons-cta">
        <span className="lc-txt">
          ระดับ <b>Y4–6</b> เน้นอ่านจับใจความและเขียน — ดูบทอ่านยาวขึ้นและกิจกรรมในชุด “อ่านเพื่อเรียนรู้”
          <span className="th"> · Reading &amp; Writing pack</span>
        </span>
        <a className="btn btn-sm btn-leaf" href="activity-reading-comprehension.html#s12">📖 Y4–6 Reading &amp; Writing →</a>
      </div>
      <LevelBar value={lvl} onChange={setLvl} />
      <div className="grid-2">
        {shown.map((p, i) => (
          <div className="item-card" key={i}>
            <div className="item-meta">
              <span className="tag">{p.level === "beginner" ? "Beginner" : p.level === "intermediate" ? "Intermediate" : "Advanced"}</span>
              <span className="tag earth">{p.level === "beginner" ? (/Vowel/.test(p.en) ? "Phonics" : /word/i.test(p.en) ? "Words" : "Decodable") : "Decodable"}</span>
            </div>
            <h3>{(p.level === "advanced" ? "A" : p.level === "intermediate" ? "I" : "B") + (i + 1) + " · " + p.en.replace(/^[ABI]\d+\s*·\s*/, "")}<span className="th">{p.th}</span></h3>
            <div className="passage-thai">
              {p.lines.map((ln, j) => <div key={j}>{ln}</div>)}
            </div>
            <div className="item-actions">
              <button className="btn btn-sm btn-leaf" onClick={() => setReader(p)}><Ico name="play" style={{ width: 15, height: 15 }} /> Read</button>
              <button className="btn btn-sm btn-ghost"><Ico name="print" style={{ width: 15, height: 15 }} /> Print</button>
            </div>
          </div>
        ))}
      </div>
      {reader && <ReadingMode passage={reader} onClose={() => setReader(null)} />}
    </div>
  );
}

/* ---------------- WORKSHEETS ---------------- */
// Printable "Trace & Say" worksheets for Beginner — each row gives a solid model
// then light "ghost" copies for the child to trace over, and a word to say aloud.
const TRACE_SHEETS = [
  {
    en: "Trace & Say · Mid-class letters", th: "คัดอักษรกลาง + สระอา", type: "Tracing", level: "beginner",
    sub: "คัดตามรอยพยัญชนะ แล้วอ่านออกเสียงคำตัวอย่าง · Trace each letter, then say the word.",
    rows: [
      { t: "ก", w: "กา" }, { t: "จ", w: "จาน" }, { t: "ด", w: "ดี" }, { t: "ต", w: "ตา" },
      { t: "บ", w: "ใบ" }, { t: "ป", w: "ปู" }, { t: "อ", w: "อา" },
    ],
  },
  {
    en: "Trace & Say · Long-vowel words", th: "คัดคำ สระเสียงยาว", type: "Tracing", level: "beginner",
    sub: "คัดตามรอยคำ แล้วอ่านออกเสียง · Trace each word, then say it aloud.",
    rows: [
      { t: "ตา", w: "eye" }, { t: "กา", w: "crow" }, { t: "ดี", w: "good" },
      { t: "ปู", w: "crab" }, { t: "งู", w: "snake" }, { t: "มา", w: "come" },
    ],
  },
  {
    en: "Trace & Say · Vowels เ แ โ", th: "คัดสระ เ แ โ", type: "Tracing", level: "beginner",
    sub: "คัดตามรอยพยางค์ สังเกตรูปสระ แล้วอ่านออกเสียง · Trace, notice the vowel, then say it.",
    rows: [
      { t: "เก", w: "สระเอ" }, { t: "แก", w: "สระแอ" }, { t: "โก", w: "สระโอ" },
      { t: "เต", w: "" }, { t: "แต", w: "" }, { t: "โต", w: "" },
    ],
  },
];

function WorksheetSheet({ sheet, onClose }) {
  return (
    <div className="ws-overlay" onClick={onClose}>
      <div className="ws-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ws-bar no-print">
          <button className="btn btn-sm btn-leaf" onClick={() => window.print()}><Ico name="print" style={{ width: 15, height: 15 }} /> พิมพ์ · Print</button>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>✕ ปิด</button>
        </div>
        <div className="ws-sheet">
          <div className="ws-head">
            <img className="ws-logo" src="images/panya-logo.png" alt="PANYA" />
            <div className="ws-htext">
              <div className="ws-brand">PANYA · Thai Foundation</div>
              <div className="ws-title">{sheet.en}</div>
              <div className="ws-th">{sheet.th}</div>
            </div>
            <div className="ws-namebox">
              <div className="ws-field">ชื่อ Name <span className="ws-line-fill" /></div>
              <div className="ws-field">วันที่ Date <span className="ws-line-fill ws-line-sm" /></div>
            </div>
          </div>
          <div className="ws-sub">{sheet.sub}</div>
          <div className="ws-rows">
            {sheet.rows.map((r, i) => (
              <div className="ws-row" key={i}>
                <span className="ws-model">{r.t}</span>
                <div className="ws-write">
                  {[0, 1, 2, 3, 4].map((k) => <span className="ws-ghost" key={k}>{r.t}</span>)}
                </div>
                <span className="ws-word">{r.w}</span>
              </div>
            ))}
          </div>
          <div className="ws-foot">คัดตามรอย แล้วพูดออกเสียงดัง ๆ · Trace, then say it aloud 🗣️</div>
        </div>
      </div>
    </div>
  );
}

function WorksheetsPage() {
  const [filter, setFilter] = React.useState("All");
  const [lvl, setLvl] = React.useState("all");
  const [sheet, setSheet] = React.useState(null);
  const filters = ["All", "Tracing", "Blending", "Dictation", "Assessment", "Reading"];
  // The Beginner worksheets live in a single printable 20-page file; each card
  // jumps to its page (#sN) and Print opens the whole pack (?print=1).
  const WS_FILE = "activity-worksheet-beginner.html";
  const sheets = [
    { en: "Beginner Worksheet Pack", th: "ชุดใบงานพื้นฐาน 20 หน้า", type: "Tracing", level: "beginner", page: 1, preview: ["20", "หน้า"] },
    { en: "Trace & Say · Mid-class letters", th: "คัดอักษรกลาง", type: "Tracing", level: "beginner", page: 1, preview: ["ก", "จ", "ด", "ต"] },
    { en: "Trace & Say · ก จ ด ต", th: "คัด ก จ ด ต", type: "Tracing", level: "beginner", page: 2, preview: ["ก", "จ", "ด", "ต"] },
    { en: "Trace & Say · Long-vowel words", th: "คัดคำ สระเสียงยาว", type: "Tracing", level: "beginner", page: 9, preview: ["ตา", "กา", "ดี", "ปู"] },
    { en: "Trace & Say · Vowels เ แ โ", th: "คัดสระ เ แ โ", type: "Tracing", level: "beginner", page: 6, preview: ["เก", "แก", "โก"] },
    { en: "Vowel match -า -ี -ู", th: "จับคู่สระ", type: "Blending", level: "beginner", page: 8, preview: ["-า", "-ี", "-ู"] },
    { en: "Blend the syllable", th: "ประสมพยางค์", type: "Blending", level: "beginner", page: 14, preview: ["ก+า", "ม+า"] },
    { en: "Build a word (finals)", th: "ต่อคำมีตัวสะกด", type: "Blending", level: "beginner", page: 15, preview: ["จาน", "กิน"] },
    { en: "Write what you hear", th: "เขียนตามคำบอก", type: "Dictation", level: "beginner", page: 19, preview: ["1", "2", "3"] },
    { en: "Review · I can read!", th: "ทบทวน หนูอ่านได้", type: "Assessment", level: "beginner", page: 20, preview: ["กา", "ตา", "ดี"] },
    // Intermediate & Advanced worksheets — own 20-page printable files
    { en: "Blend & Build", th: "ประสมและต่อคำ", type: "Blending", level: "intermediate", file: "activity-blend-and-build.html", page: 1, preview: ["ก+า", "จาน"] },
    { en: "Sound Dictation", th: "เขียนตามคำบอก", type: "Dictation", level: "intermediate", file: "activity-sound-dictation.html", page: 1, preview: ["1", "2", "3"] },
    { en: "Tone Mark Tracing", th: "คัดวรรณยุกต์", type: "Tracing", level: "advanced", file: "activity-tone-mark-tracing.html", page: 1, preview: ["◌่", "◌้", "◌๊"] },
    { en: "Unit Check", th: "ทดสอบท้ายหน่วย", type: "Assessment", level: "advanced", file: "activity-unit-check.html", page: 1, preview: ["A", "B", "C"] },
    // Comprehension · Y4–6 (read-to-learn) — Reading & Writing pack
    { en: "Reading · Fluency", th: "อ่านคล่อง (Y4–6)", type: "Reading", level: "comprehension", file: "activity-reading-comprehension.html", page: 1, preview: ["อ่าน", "ซ้ำ"] },
    { en: "Reading · Vocabulary", th: "คลังคำ (Y4–6)", type: "Reading", level: "comprehension", file: "activity-reading-comprehension.html", page: 6, preview: ["คำ", "พ้อง"] },
    { en: "Reading · Comprehension", th: "จับใจความ (Y4–6)", type: "Reading", level: "comprehension", file: "activity-reading-comprehension.html", page: 12, preview: ["จับ", "ใจความ"] },
    { en: "Reading · Writing", th: "การเขียน (Y4–6)", type: "Reading", level: "comprehension", file: "activity-reading-comprehension.html", page: 18, preview: ["เขียน", "เรียงความ"] },
    // Writing Workshop (structured literacy) — by grade
    { en: "Writing · Y4 (Word structure)", th: "Workshop การเขียน Y4", type: "Reading", level: "comprehension", file: "activity-writing-workshop.html", page: 2, preview: ["Mind", "Map"] },
    { en: "Writing · Y5 (Morphology)", th: "Workshop การเขียน Y5", type: "Reading", level: "comprehension", file: "activity-writing-workshop.html", page: 8, preview: ["ราก", "ศัพท์"] },
    { en: "Writing · Y6 (Analysis)", th: "Workshop การเขียน Y6", type: "Reading", level: "comprehension", file: "activity-writing-workshop.html", page: 14, preview: ["เรียง", "ความ"] },
  ];
  const sheetFile = (s) => s.file || WS_FILE;
  const sheetHref = (s) => s.page ? sheetFile(s) + "#s" + s.page : null;
  const openWs = (s) => { if (s.page) window.location.href = sheetHref(s); };
  const printWs = (s) => { if (s.page) window.open(sheetFile(s) + "?print=1", "_blank"); };
  const shown = sheets.filter((s) => (lvl === "all" || s.level === lvl) && (filter === "All" || s.type === filter));
  return (
    <div>
      <PageHead eyebrow="Print & Assess" en="Worksheets" th="ใบงาน"
        sub="Ready-to-print worksheets and quick checks, organised by skill so you can pull exactly what today's lesson needs." />
      <FwNote />
      <LevelBar value={lvl} onChange={setLvl} withAll />
      <div className="level-tabs">
        {filters.map((f) => (
          <button key={f} className={"level-tab" + (filter === f ? " on" : "")} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="grid-3">
        {shown.map((s, i) => (
          <div className="item-card" key={i}>
            {s.preview
              ? <div className="ws-card-preview" onClick={() => openWs(s)}>{s.preview.map((g, k) => <span key={k}>{g}</span>)}</div>
              : <Placeholder label="worksheet preview" h={150} />}
            <h3>{s.en}<span className="th">{s.th}</span></h3>
            <div className="item-meta">
              {s.level && <span className="tag">{s.level === "beginner" ? "Beginner" : s.level === "intermediate" ? "Intermediate" : s.level === "comprehension" ? "Y4–6" : "Advanced"}</span>}
              <span className="tag earth">{s.type}</span>
            </div>
            <div className="item-actions">
              <button className="btn btn-sm btn-primary" onClick={() => printWs(s)} disabled={!s.page}><Ico name="print" style={{ width: 15, height: 15 }} /> Print PDF</button>
              <button className="btn btn-sm btn-ghost" onClick={() => openWs(s)} disabled={!s.page}>Preview</button>
            </div>
          </div>
        ))}
      </div>
      {sheet && <WorksheetSheet sheet={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
}

// Word Work Mat level items for the "Word Work Mat ▾" nav dropdown (one per level).
const MAT_ITEMS = THAI.MAT_LEVELS.map((id) => ({
  id: "mat-" + id,
  en: THAI.GRADES[id].en,
  th: "",   // English level name only
  icon: "activity",
  level: id,
}));

window.TOOLS = TOOLS;
window.DIGITAL_APPS = DIGITAL_APPS;
window.RESOURCES = RESOURCES;
window.LESSON_ITEMS = LESSON_ITEMS;
window.MAT_ITEMS = MAT_ITEMS;
window.Pages = { HomePage, ActivityPage, LessonsPage, ReadingPage, WorksheetsPage };
window.Ico = Ico;

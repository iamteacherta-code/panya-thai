/* ============================================================
   สร้างไฟล์ Word (.docx) ของหนังสือเรียน Y4 หน่วยที่ 1
   "ชุมชนและบทบาทหน้าที่" สำหรับสั่งพิมพ์

   ใช้เนื้อหาชุดเดียวกับหน้าเว็บ reader-y4-unit1.html
   ภาพประกอบเรนเดอร์จาก unit1-book-art.js เป็น PNG ด้วย Chrome headless

   วิธีใช้:
     node tools/build-unit1-docx.js  [โฟลเดอร์ปลายทาง]
   ค่าเริ่มต้นปลายทาง: D:\2026-2027 WORK\THAI FL\U1
   ============================================================ */
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { Doc } = require("./docx-lite.js");

const ROOT = path.join(__dirname, "..");
const BOOK = require(path.join(ROOT, "unit1-book-data.js")).UNIT1_BOOK;
const ART = require(path.join(ROOT, "unit1-book-art.js")).UNIT1_ART;
const M = BOOK.meta;

const OUT_DIR = process.argv[2] || "D:\\2026-2027 WORK\\THAI FL\\U1";
const OUT_FILE = path.join(OUT_DIR, "หนังสือเรียน-Y4-หน่วยที่1 ชุมชนและบทบาทหน้าที่.docx");

/* ---------- สี ---------- */
const CLR = {
  ink: "2F2A20", ink2: "5C5341", ink3: "8A7E66",
  leaf: "5B7A4B", leafD: "45603A", leafL: "E6EDDF",
  earth: "C98A3B", earthD: "A86D24", earthL: "F6E8D2",
  heart: "8C3B2C", heartL: "FDEEEA", line: "D9CFB8", paper: "FBF8F1",
};

/* ============================================================
   1) เรนเดอร์ SVG เป็น PNG ด้วย Chrome headless
   ============================================================ */
function findChrome() {
  const cands = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
  ];
  for (const c of cands) if (fs.existsSync(c)) return c;
  throw new Error("ไม่พบ Chrome หรือ Edge สำหรับเรนเดอร์ภาพประกอบ");
}

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "u1book-"));
const CHROME = findChrome();

function svgToPng(svg, w, h, tag) {
  const html = `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:#fff;width:${w}px;height:${h}px;overflow:hidden}
svg{display:block;width:${w}px;height:${h}px}</style>${svg}`;
  const hp = path.join(TMP, tag + ".html");
  const pp = path.join(TMP, tag + ".png");
  fs.writeFileSync(hp, html, "utf8");
  execFileSync(CHROME, [
    "--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    "--virtual-time-budget=3000",
    `--screenshot=${pp}`, `--window-size=${w},${h}`,
    "file:///" + hp.replace(/\\/g, "/"),
  ], { stdio: "ignore" });
  return fs.readFileSync(pp);
}

process.stdout.write("เรนเดอร์ภาพประกอบ ");
const PNG = {};
["cover"].concat(BOOK.chapters.map((c) => c.art)).forEach((name, i) => {
  PNG[name] = svgToPng(ART.scene(name, name === "cover" ? 11 : i + 2), 1280, 720, "s_" + name);
  process.stdout.write("·");
});
BOOK.cast.forEach((p, i) => {
  PNG["cast_" + p.art] = svgToPng(ART.cast(p.art, i + 2), 240, 280, "c_" + p.art);
  process.stdout.write("·");
});
process.stdout.write(" เสร็จ\n");

/* ============================================================
   2) ประกอบเอกสาร
   ============================================================ */
const doc = new Doc({
  font: "Sarabun",
  margin: { top: 1.7, right: 1.6, bottom: 1.5, left: 1.6 },
  footer: `${M.school} · ภาษาไทย ${M.grade} · หน่วยที่ ${M.unitNo} ${M.unitTitle}`,
});
const R = (t, o) => doc.run(t, o);

/* --- ข้อความที่มี *คำศัพท์* และ ~Heart Word~ --- */
function marked(str, size) {
  size = size || 13;
  const out = [];
  const re = /(\*[^*]+\*|~[^~]+~)/g;
  let last = 0, m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push(R(str.slice(last, m.index), { size }));
    const tok = m[0];
    if (tok[0] === "*") out.push(R(tok.slice(1, -1), { size, b: true, color: CLR.leafD, u: true }));
    else out.push(R(tok.slice(1, -1) + " ♥", { size, b: true, color: CLR.heart, shd: CLR.heartL }));
    last = m.index + tok.length;
  }
  if (last < str.length) out.push(R(str.slice(last), { size }));
  return out.join("");
}

/* --- หัวหน้าประจำบท --- */
function chapterHead(c, kicker, hint) {
  doc.table([[
    { text: "สัปดาห์ที่ " + c.week, b: true, size: 11, color: "FFFFFF", shd: CLR.leaf, align: "center", width: 20, valign: "center" },
    {
      width: 56, shd: CLR.paper, xml:
        doc.bp(R(kicker, { size: 8.5, b: true, color: CLR.earthD }), { after: 0 }) +
        doc.bp(R(c.title, { size: 15, b: true, color: CLR.ink }), { after: 0 }) +
        doc.bp(R(c.subtitle, { size: 10, color: CLR.ink3 }), { after: 0 }),
    },
    { text: hint || "", size: 9, color: CLR.ink3, align: "right", width: 24, valign: "center", shd: CLR.paper },
  ]], { widths: [20, 56, 24], borderColor: CLR.line, rowH: 0 });
}

/* ============================================================ ปก */
doc.p("", { after: 400 });
doc.text(M.school, { align: "center", size: 12, color: CLR.ink3, after: 40 });
doc.text(`${M.subject} · ${M.grade} · ${M.year}`, { align: "center", size: 10, b: true, color: CLR.earthD, after: 120 });
doc.text(M.unitTitle, { align: "center", size: 30, b: true, color: CLR.ink, after: 40 });
doc.text(`Unit ${M.unitNo} · ${M.unitTitleEn}`, { align: "center", size: 11, color: CLR.ink3, after: 220 });
doc.image(PNG.cover, 15.5);
doc.p("", { after: 160 });
doc.text("6 สัปดาห์ · 6 บท   |   คำถามท้ายเรื่อง   |   ถอดบทเรียนเชิงคิดวิเคราะห์   |   ใบงาน 5 วัน วันละ 15 นาที",
  { align: "center", size: 10.5, color: CLR.leafD, b: true, after: 80 });
doc.text(M.tagline, { align: "center", size: 11, color: CLR.ink2 });
doc.pageBreak();

/* ============================================================ คำนำ */
doc.heading("คำนำ และวิธีใช้หนังสือเล่มนี้", { size: 18, color: CLR.leafD, before: 0 });
doc.text("กรณีศึกษา: " + M.caseStudy, { size: 11, color: CLR.ink3, after: 160 });
BOOK.foreword.forEach((t) => doc.text(t, { size: 12.5, color: CLR.ink2, after: 140, line: 300 }));

const howto = [
  ["1 · ภาพหลักและเรื่องสั้น", "เปิดบทด้วยภาพหลัก ชวนเด็กทายว่าเกิดอะไรขึ้น แล้วจึงอ่านเรื่องทีละตอน ตอนละประมาณ 3 นาที"],
  ["2 · คำศัพท์ในเรื่อง", "คำที่ขีดเส้นใต้สีเขียวคือคำประจำสัปดาห์ คำพื้นสีชมพูที่มี ♥ คือ Heart Word ที่ต้องจำด้วยใจ"],
  ["3 · คำถามท้ายเรื่อง", "ไล่จากจับใจความ → คิดต่อจากเรื่อง → โยงถึงตัวเอง ใช้ในวง Guided Reading วันจันทร์ได้ทันที"],
  ["4 · ถอดบทเรียน", "โซ่ความคิดตามแนวโยนิโสมนสิการ แยกข้อเท็จจริงกับข้อคิดเห็น และคำถามชวนคิดลึกหนึ่งข้อ"],
  ["5 · ใบงาน 15 นาที", "วันละหนึ่งใบ จันทร์ถึงศุกร์ ทำช่วงต้นคาบหรือเป็นการบ้านเบา ๆ ไม่ควรเกิน 15 นาที"],
  ["6 · เฉลยท้ายเล่ม", "ข้อปลายเปิดเป็นแนวคำตอบ ครูรับคำตอบอื่นที่นักเรียนอ้างอิงจากเรื่องได้เสมอ"],
];
doc.table(howto.map((r) => [
  { text: r[0], b: true, size: 11, color: CLR.leafD, shd: CLR.paper, width: 30 },
  { text: r[1], size: 11, color: CLR.ink2, width: 70 },
]), { widths: [30, 70] });
doc.text(BOOK.glossaryNote, { size: 10, color: CLR.ink3, before: 100 });
doc.pageBreak();

/* ============================================================ ตัวละคร */
doc.heading("ตัวละครประจำเล่ม", { size: 18, color: CLR.leafD, before: 0 });
doc.text("หกคนนี้จะอยู่กับเราตลอดหกสัปดาห์", { size: 11, color: CLR.ink3, after: 160 });
for (let i = 0; i < BOOK.cast.length; i += 2) {
  const pair = BOOK.cast.slice(i, i + 2);
  doc.table([pair.map((p) => ({
    width: 50, shd: CLR.paper,
    xml:
      doc.bp(doc.image(PNG["cast_" + p.art], 2.4, { inline: true }), { after: 20, align: "center" }) +
      doc.bp(R(p.name, { size: 14, b: true }), { after: 0, align: "center" }) +
      doc.bp(R(p.role, { size: 10, b: true, color: CLR.earthD }), { after: 40, align: "center" }) +
      doc.bp(R(p.desc, { size: 10.5, color: CLR.ink3 }), { after: 0 }),
  }))], { widths: [50, 50] });
}
doc.text("ฉากหลังของทุกบทคือโรงเรียนปัญญาเด่น อาคารดิน ศาลาสมาคม ต้นไผ่หลังห้อง และบ่อปลาที่รับน้ำฝนจากหลังคา",
  { size: 10, color: CLR.ink3, before: 100 });
doc.pageBreak();

/* ============================================================ สารบัญ */
doc.heading("สารบัญ", { size: 18, color: CLR.leafD, before: 0 });
doc.text(M.concept, { size: 11, color: CLR.ink3, after: 160 });
doc.table([
  [
    { text: "สัปดาห์", b: true, size: 10.5, color: CLR.leafD, shd: CLR.leafL, align: "center" },
    { text: "บท", b: true, size: 10.5, color: CLR.leafD, shd: CLR.leafL },
    { text: "จุดเน้นอักขรวิธี", b: true, size: 10.5, color: CLR.leafD, shd: CLR.leafL },
    { text: "คุณธรรม", b: true, size: 10.5, color: CLR.leafD, shd: CLR.leafL },
  ],
].concat(BOOK.chapters.map((c) => [
  { text: String(c.week), b: true, size: 12, color: CLR.earthD, align: "center" },
  {
    xml: doc.bp(R(c.title, { size: 12, b: true }), { after: 0 }) +
      doc.bp(R(c.subtitle, { size: 10, color: CLR.ink3 }), { after: 0 }),
  },
  { text: c.ortho, size: 10.5, color: CLR.ink2 },
  { text: c.virtue.split("·")[0].trim(), size: 10.5, color: CLR.ink2 },
])), { widths: [11, 34, 36, 19], headerRow: true });
doc.pageBreak();

/* ============================================================ รายบท */
BOOK.chapters.forEach((c, ci) => {
  /* ---- หน้าเปิดบท ---- */
  chapterHead(c, `บทที่ ${c.week} · CHAPTER ${c.week}`);
  doc.image(PNG[c.art], 16);
  doc.text(c.artCaption, { align: "center", size: 10, color: CLR.ink3, after: 140 });

  doc.table([
    [{ text: "เป้าหมายการเรียนรู้", b: true, size: 9.5, color: CLR.earthD, shd: CLR.paper, width: 26 },
     { text: c.objective, size: 11, color: CLR.ink2, width: 74 }],
    [{ text: "จุดเน้นอักขรวิธี", b: true, size: 9.5, color: CLR.earthD, shd: CLR.paper },
     { text: c.ortho, size: 11, color: CLR.ink2 }],
    [{ text: "หลักภาษา", b: true, size: 9.5, color: CLR.earthD, shd: CLR.paper },
     { text: c.grammar, size: 11, color: CLR.ink2 }],
    [{ text: "คุณธรรมประจำสัปดาห์", b: true, size: 9.5, color: CLR.earthD, shd: CLR.paper },
     { text: c.virtue, size: 11, color: CLR.ink2 }],
  ], { widths: [26, 74] });

  doc.box(
    doc.bp(R("คลังคำประจำสัปดาห์ · 20 คำ", { size: 11.5, b: true, color: CLR.leafD }), { after: 60 }) +
    doc.bp(R(c.vocab.join("   ·   "), { size: 13 }), { after: 60 }) +
    doc.bp(R("Heart Words ♥  " + c.heart.join("   ·   "), { size: 13, b: true, color: CLR.heart }), { after: 0 }),
    { shd: CLR.leafL, borderColor: "CBD9BC" });
  doc.text(BOOK.glossaryNote, { size: 9.5, color: CLR.ink3, before: 60 });
  doc.pageBreak();

  /* ---- เนื้อเรื่อง ---- */
  BOOK.paginateStory(c, 32, 77).forEach((page, pi) => {
    const span = page.length > 1
      ? `ตอนที่ ${page[0].no}–${page[page.length - 1].no}`
      : `ตอนที่ ${page[0].no}`;
    chapterHead(c, "เรื่องอ่าน · READING" + (pi ? " (ต่อ)" : ""), span);
    page.forEach((s) => {
      doc.p(R("ตอนที่ " + s.no + "  ", { size: 9.5, b: true, color: CLR.earthD }) +
        R(s.title, { size: 13.5, b: true, color: CLR.ink }), { before: 120, after: 60, keepNext: true });
      s.paras.forEach((t) => doc.p(marked(t, 13), { after: 60, line: 320 }));
    });
    doc.text(BOOK.glossaryNote, { size: 9.5, color: CLR.ink3, before: 140 });
    doc.pageBreak();
  });

  /* ---- คำถามท้ายเรื่อง ---- */
  chapterHead(c, "คำถามท้ายเรื่อง · COMPREHENSION");
  let qn = 0;
  const qgroup = (chip, hint, arr, lines) => {
    doc.p(R(" " + chip + " ", { size: 9.5, b: true, color: CLR.earthD, shd: CLR.earthL }) +
      R("   " + hint, { size: 10, color: CLR.ink3 }), { before: 100, after: 40, keepNext: true });
    arr.forEach((q) => {
      qn++;
      doc.p(R(qn + ".  ", { size: 11, b: true, color: CLR.leafD }) + R(q, { size: 12.5 }),
        { after: 40, indent: 340, hanging: 340, keepNext: true });
      doc.writeLines(lines, { indent: 340, after: 150 });
    });
  };
  qgroup("จับใจความ", "ตอบจากเรื่องโดยตรง", c.questions.literal, 1);
  qgroup("คิดต่อจากเรื่อง", "ต้องอ้างหลักฐานจากเนื้อเรื่องประกอบ", c.questions.inferential, 2);
  qgroup("โยงถึงตัวเอง", "ไม่มีคำตอบถูกผิด แต่ต้องมีเหตุผล", c.questions.self, 2);
  doc.pageBreak();

  /* ---- ถอดบทเรียน ---- */
  const t = c.think;
  chapterHead(c, "ถอดบทเรียน · THINKING DEEPER");
  doc.box(
    doc.bp(R(t.heading, { size: 13, b: true, color: CLR.leafD }), { after: 20 }) +
    doc.bp(R(t.virtueLine, { size: 10, color: CLR.ink3 }), { after: 20 }) +
    doc.bp(R(t.chain.prompt, { size: 10.5, color: CLR.ink2 }), { after: 0 }),
    { shd: CLR.leafL, borderColor: "CBD9BC" });
  t.chain.steps.forEach((s, i) => {
    if (i) doc.text("▼", { align: "center", size: 9, color: CLR.leaf, after: 0, before: 0, line: 200 });
    doc.table([[{
      xml: doc.bp(R(s.label, { size: 10, b: true, color: CLR.earthD }), { after: 20 }) +
        doc.bp(R(s.hint + " ".repeat(40), { size: 12, color: CLR.ink3 }), { after: 0 }),
    }]], { widths: [100], gap: 20 });
  });
  doc.p(R(t.factOpinion.prompt, { size: 11, b: true, color: CLR.earthD }), { before: 120, after: 50 });
  doc.table(t.factOpinion.items.map((it) => [
    { text: "", width: 8, shd: CLR.paper },
    { text: it, size: 12, width: 92 },
  ]), { widths: [8, 92], rowH: 340 });
  doc.box(doc.bp(R(t.deep, { size: 12, color: CLR.ink2 }), { after: 0 }),
    { shd: CLR.earthL, borderColor: "E4CFA6" });
  doc.p(R("คิดแล้วจดไว้ตรงนี้", { size: 10.5, b: true, color: CLR.earthD }), { before: 110, after: 50 });
  doc.writeLines(3, { after: 170 });
  doc.pageBreak();

  /* ---- ใบงาน 5 วัน ---- */
  const wsBlock = (w) => {
    doc.table([[
      { text: "วัน" + w.day, b: true, size: 10, color: "FFFFFF", shd: CLR.leaf, align: "center", width: 16, valign: "center" },
      { text: w.title, b: true, size: 13, width: 66, valign: "center", shd: CLR.paper },
      { text: "15 นาที", b: true, size: 9.5, color: CLR.earthD, shd: CLR.earthL, align: "center", width: 18, valign: "center" },
    ]], { widths: [16, 66, 18] });
    doc.text(w.instruction, { size: 10.5, color: CLR.ink2, after: 100 });
    if (w.note) doc.text(w.note, { size: 10.5, color: CLR.earthD, shd: CLR.earthL, after: 100 });

    if (w.kind === "table") {
      const rows = [w.cols.map((h) => ({ text: h, b: true, size: 10.5, color: CLR.leafD, shd: CLR.leafL }))];
      for (let r = 0; r < (w.rows || 4); r++) {
        rows.push(w.cols.map((_, ciX) =>
          (ciX === 0 && w.seed && w.seed[r])
            ? { text: w.seed[r], size: 12, b: true, shd: CLR.paper }
            : { text: "", size: 12 }));
      }
      doc.table(rows, { headerRow: true, rowH: 400 });
    } else if (w.kind === "list") {
      w.items.forEach((it, i) => doc.p(
        R((i + 1) + ".  ", { size: 10, b: true, color: CLR.earthD }) + R(it, { size: 12.5 }),
        { after: 140, indent: 300, hanging: 300 }));
      doc.p("", { after: 60 });
    } else if (w.kind === "match") {
      doc.table(w.left.map((l, i) => [
        { text: l, size: 12, shd: CLR.paper, width: 42, valign: "center" },
        { text: "", width: 16 },
        { text: w.right[i], size: 12, width: 42, valign: "center" },
      ]), { widths: [42, 16, 42], rowH: 420, borderColor: CLR.line });
    } else if (w.kind === "frayer") {
      doc.table([
        [{ text: w.boxes[0], b: true, size: 10, color: CLR.earthD }, { text: w.boxes[1], b: true, size: 10, color: CLR.earthD }],
        [{ text: w.boxes[2], b: true, size: 10, color: CLR.earthD }, { text: w.boxes[3], b: true, size: 10, color: CLR.earthD }],
      ], { widths: [50, 50], rowH: 1500 });
    } else {
      doc.writeLines(w.lines || 3);
    }
  };
  [[0, 1], [2, 3], [4]].forEach((pair, pi) => {
    chapterHead(c, "ใบงาน 15 นาที · DAILY 15",
      "วัน" + pair.map((i) => c.worksheets[i].day).join(" · วัน"));
    pair.forEach((i, k) => { if (k) doc.p("", { after: 160 }); wsBlock(c.worksheets[i]); });
    doc.p(R("พื้นที่เขียนและวาดอิสระ", { size: 10.5, b: true, color: CLR.earthD }), { before: 140, after: 50 });
    doc.writeLines(pi === 2 ? 5 : 3, { after: 180 });
    doc.pageBreak();
  });
});

/* ============================================================ เฉลย */
const ansGroups = [];
for (let i = 0; i < BOOK.chapters.length; i += 2) ansGroups.push([i, Math.min(i + 2, BOOK.chapters.length)]);
ansGroups.forEach((rg, i) => {
  doc.heading("เฉลยและแนวคำตอบ" + (i ? " (ต่อ)" : ""), { size: 18, color: CLR.leafD, before: 0 });
  doc.text(`บทที่ ${rg[0] + 1}–${rg[1]} · ข้อปลายเปิดเป็นแนวคำตอบ ไม่ใช่คำตอบตายตัว`,
    { size: 11, color: CLR.ink3, after: 160 });
  BOOK.chapters.slice(rg[0], rg[1]).forEach((c) => {
    doc.box(
      doc.bp(R(`บทที่ ${c.week} · ${c.title}`, { size: 12, b: true, color: CLR.leafD }), { after: 60 }) +
      c.answers.map((a) => doc.bp(R("•  ", { size: 10, color: CLR.earthD }) + R(a, { size: 10.5, color: CLR.ink2 }), { after: 40 })).join(""),
      { shd: CLR.paper, borderColor: CLR.line });
  });
  if (i < ansGroups.length - 1) doc.pageBreak();
});

/* ============================================================ เขียนไฟล์ */
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, doc.build());
console.log("เขียนไฟล์แล้ว: " + OUT_FILE);
console.log("ภาพประกอบ " + doc.images.length + " รูป · ขนาดไฟล์ " +
  (fs.statSync(OUT_FILE).size / 1024 / 1024).toFixed(2) + " MB");
try { fs.rmSync(TMP, { recursive: true, force: true }); } catch (e) {}

/* ============================================================
   ภาพประกอบหนังสือเรียน หน่วยที่ 1 · ชุมชนและบทบาทหน้าที่
   สไตล์ "ลายเส้นดินสอแบบเด็ก ๆ" — เส้นหมึกดำสั่น ๆ ระบายสีแบน ๆ นิดเดียว

   ทุกภาพวาดจากชุดเครื่องมือเล็ก ๆ ด้านล่าง (หัว ตัว ต้นไผ่ ถังขยะ ...)
   แล้วผ่านฟิลเตอร์ roughen เพื่อให้เส้นดูสั่นเหมือนวาดด้วยมือ

   ใช้ร่วมกัน 2 ที่:
     reader-y4-unit1.html      → ฝังตรง ๆ ในหน้าเว็บ
     tools/build-unit1-docx.js → เรนเดอร์เป็น PNG ใส่ไฟล์ Word
   ============================================================ */
(function (root) {

const INK = "#2f2a26";
const C = {
  earth: "#e7d0b0", earthDark: "#d3b489", clay: "#e8b78c",
  leaf: "#cadfb4", leafDark: "#a8c98c", sky: "#dceaf3",
  red: "#e2796a", yellow: "#f3d071", blue: "#8fb3d4", green: "#93c274",
  paper: "#fdfaf3", grey: "#ded8cf", pink: "#f0c0b8",
};

/* ---------- helpers ---------- */
const P = (d, o) => `<path d="${d}" ${attr(o)}/>`;
const line = (x1, y1, x2, y2, o) => `<path d="M${x1} ${y1} L${x2} ${y2}" ${attr(o)}/>`;
const circ = (cx, cy, r, o) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${attr(o)}/>`;
const ell = (cx, cy, rx, ry, o) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${attr(o)}/>`;
const rect = (x, y, w, h, r, o) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r || 0}" ${attr(o)}/>`;

function attr(o) {
  o = o || {};
  const f = o.fill || "none";
  const s = "stroke" in o ? o.stroke : INK;
  const sw = o.sw == null ? 3 : o.sw;
  let a = `fill="${f}"`;
  if (s && s !== "none") a += ` stroke="${s}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
  if (o.dash) a += ` stroke-dasharray="${o.dash}"`;
  if (o.op) a += ` opacity="${o.op}"`;
  return a;
}

/* ---------- เด็กหนึ่งคน ----------
   x,y = กลางเท้า · sc = ขนาด · hair = bob | short | pony | spike | bun
   arms = up | out | down | wave | hold · shirt = สีเสื้อ                  */
function kid(x, y, opt) {
  opt = opt || {};
  const sc = opt.sc || 1;
  const hair = opt.hair || "short";
  const shirt = opt.shirt || C.leaf;
  const arms = opt.arms || "down";
  const flip = opt.flip ? -1 : 1;
  const h = 92 * sc;                    // ความสูงรวม
  const hy = -h + 18 * sc;              // จุดกลางหัว (เทียบกับเท้า)
  const r = 17 * sc;
  let g = "";

  // ขา
  g += line(-7 * sc, -26 * sc, -9 * sc, 0, { sw: 3 * sc });
  g += line(7 * sc, -26 * sc, 9 * sc, 0, { sw: 3 * sc });
  g += line(-9 * sc, 0, -15 * sc, 0, { sw: 3 * sc });
  g += line(9 * sc, 0, 15 * sc, 0, { sw: 3 * sc });

  // ตัว
  g += P(`M${-14 * sc} ${-26 * sc} L${-12 * sc} ${-57 * sc} Q0 ${-62 * sc} ${12 * sc} ${-57 * sc} L${14 * sc} ${-26 * sc} Z`,
    { fill: shirt, sw: 3 * sc });

  // แขน
  if (arms === "up") {
    g += P(`M${-12 * sc} ${-54 * sc} L${-26 * sc} ${-72 * sc}`, { sw: 3 * sc });
    g += P(`M${12 * sc} ${-54 * sc} L${26 * sc} ${-72 * sc}`, { sw: 3 * sc });
  } else if (arms === "wave") {
    g += P(`M${-12 * sc} ${-54 * sc} L${-24 * sc} ${-40 * sc}`, { sw: 3 * sc });
    g += P(`M${12 * sc} ${-54 * sc} L${26 * sc} ${-70 * sc}`, { sw: 3 * sc });
  } else if (arms === "out") {
    g += P(`M${-12 * sc} ${-52 * sc} L${-30 * sc} ${-48 * sc}`, { sw: 3 * sc });
    g += P(`M${12 * sc} ${-52 * sc} L${30 * sc} ${-48 * sc}`, { sw: 3 * sc });
  } else if (arms === "hold") {
    g += P(`M${-12 * sc} ${-52 * sc} Q${-18 * sc} ${-42 * sc} ${-6 * sc} ${-40 * sc}`, { sw: 3 * sc });
    g += P(`M${12 * sc} ${-52 * sc} Q${18 * sc} ${-42 * sc} ${6 * sc} ${-40 * sc}`, { sw: 3 * sc });
  } else {
    g += P(`M${-12 * sc} ${-53 * sc} Q${-20 * sc} ${-42 * sc} ${-17 * sc} ${-32 * sc}`, { sw: 3 * sc });
    g += P(`M${12 * sc} ${-53 * sc} Q${20 * sc} ${-42 * sc} ${17 * sc} ${-32 * sc}`, { sw: 3 * sc });
  }

  // คอ + หัว
  g += line(0, -57 * sc, 0, -63 * sc, { sw: 3 * sc });
  g += circ(0, hy, r, { fill: C.paper, sw: 3 * sc });

  // ผม
  const hc = opt.hairColor || INK;
  if (hair === "bob") {
    g += P(`M${-r - 2 * sc} ${hy + 3 * sc} Q${-r} ${hy - r - 6 * sc} 0 ${hy - r - 4 * sc} Q${r} ${hy - r - 6 * sc} ${r + 2 * sc} ${hy + 3 * sc} L${r - 1 * sc} ${hy - 2 * sc} Q0 ${hy - 12 * sc} ${-r + 1 * sc} ${hy - 2 * sc} Z`,
      { fill: hc, stroke: hc, sw: 2 * sc });
  } else if (hair === "pony") {
    g += P(`M${-r} ${hy - 3 * sc} Q${-r + 2 * sc} ${hy - r - 7 * sc} 0 ${hy - r - 5 * sc} Q${r - 2 * sc} ${hy - r - 7 * sc} ${r} ${hy - 3 * sc} Q0 ${hy - 13 * sc} ${-r} ${hy - 3 * sc} Z`,
      { fill: hc, stroke: hc, sw: 2 * sc });
    g += P(`M${r - 2 * sc} ${hy - 6 * sc} Q${r + 16 * sc} ${hy - 2 * sc} ${r + 10 * sc} ${hy + 16 * sc}`, { stroke: hc, sw: 4 * sc });
  } else if (hair === "spike") {
    g += P(`M${-r} ${hy - 4 * sc} l${5 * sc} ${-10 * sc} l${4 * sc} ${7 * sc} l${5 * sc} ${-12 * sc} l${5 * sc} ${10 * sc} l${6 * sc} ${-9 * sc} l${4 * sc} ${9 * sc} l${5 * sc} ${-5 * sc} l${2 * sc} ${10 * sc} Q0 ${hy - 13 * sc} ${-r} ${hy - 4 * sc} Z`,
      { fill: hc, stroke: hc, sw: 2 * sc });
  } else if (hair === "bun") {
    g += circ(0, hy - r - 5 * sc, 7 * sc, { fill: hc, stroke: hc, sw: 2 * sc });
    g += P(`M${-r} ${hy - 2 * sc} Q0 ${hy - r - 8 * sc} ${r} ${hy - 2 * sc} Q0 ${hy - 12 * sc} ${-r} ${hy - 2 * sc} Z`,
      { fill: hc, stroke: hc, sw: 2 * sc });
  } else { // short
    g += P(`M${-r} ${hy - 2 * sc} Q${-r + 1 * sc} ${hy - r - 8 * sc} 0 ${hy - r - 5 * sc} Q${r - 1 * sc} ${hy - r - 8 * sc} ${r} ${hy - 2 * sc} Q0 ${hy - 14 * sc} ${-r} ${hy - 2 * sc} Z`,
      { fill: hc, stroke: hc, sw: 2 * sc });
  }

  // หน้า
  const eo = opt.eyes || "open";
  if (eo === "shut") {
    g += P(`M${-8 * sc} ${hy + 1 * sc} q${3 * sc} ${3 * sc} ${6 * sc} 0`, { sw: 2.4 * sc });
    g += P(`M${2 * sc} ${hy + 1 * sc} q${3 * sc} ${3 * sc} ${6 * sc} 0`, { sw: 2.4 * sc });
  } else {
    g += circ(-5.5 * sc, hy + 1 * sc, 2.2 * sc, { fill: INK, stroke: "none" });
    g += circ(5.5 * sc, hy + 1 * sc, 2.2 * sc, { fill: INK, stroke: "none" });
  }
  const m = opt.mouth || "smile";
  if (m === "smile") g += P(`M${-5 * sc} ${hy + 8 * sc} q${5 * sc} ${5 * sc} ${10 * sc} 0`, { sw: 2.4 * sc });
  else if (m === "flat") g += line(-5 * sc, hy + 9 * sc, 5 * sc, hy + 9 * sc, { sw: 2.4 * sc });
  else if (m === "o") g += ell(0, hy + 9 * sc, 3.5 * sc, 4.5 * sc, { sw: 2.2 * sc });
  else if (m === "sad") g += P(`M${-5 * sc} ${hy + 11 * sc} q${5 * sc} ${-5 * sc} ${10 * sc} 0`, { sw: 2.4 * sc });

  return `<g transform="translate(${x} ${y}) scale(${flip} 1)">${g}</g>`;
}

/* ---------- ของประกอบฉาก ---------- */
function bamboo(x, groundY, topY, sc) {
  sc = sc || 1;
  let g = P(`M${x} ${groundY} C${x - 5 * sc} ${(groundY + topY) / 2} ${x + 6 * sc} ${(groundY + topY) / 2} ${x + 2 * sc} ${topY}`,
    { sw: 5 * sc, stroke: "#6f8f5a" });
  for (let i = 1; i <= 4; i++) {
    const t = i / 5, yy = groundY + (topY - groundY) * t;
    g += line(x - 5 * sc + t * 4, yy, x + 5 * sc + t * 4, yy, { sw: 2.4 * sc, stroke: "#4f6b40" });
  }
  for (let i = 0; i < 5; i++) {
    const yy = topY + i * 14 * sc, xx = x + 2 * sc, d = i % 2 ? 1 : -1;
    g += P(`M${xx} ${yy} q${20 * sc * d} ${-10 * sc} ${34 * sc * d} ${2 * sc} q${-18 * sc * d} ${6 * sc} ${-34 * sc * d} ${-2 * sc}`,
      { fill: C.leafDark, stroke: "#4f6b40", sw: 2 * sc });
  }
  return g;
}

function ant(x, y, sc, flip) {
  sc = sc || 1;
  const f = flip ? -1 : 1;
  let g = "";
  g += ell(-9 * sc, 0, 5 * sc, 4 * sc, { fill: INK, stroke: INK, sw: 1.6 * sc });
  g += ell(0, 0, 4 * sc, 3.4 * sc, { fill: INK, stroke: INK, sw: 1.6 * sc });
  g += circ(8 * sc, -1 * sc, 4.2 * sc, { fill: INK, stroke: INK, sw: 1.6 * sc });
  g += line(10 * sc, -4 * sc, 15 * sc, -10 * sc, { sw: 1.6 * sc });
  g += line(12 * sc, -3 * sc, 18 * sc, -6 * sc, { sw: 1.6 * sc });
  for (let i = -1; i <= 1; i++) {
    g += line(i * 6 * sc, 3 * sc, i * 6 * sc - 4 * sc, 9 * sc, { sw: 1.6 * sc });
    g += line(i * 6 * sc, 3 * sc, i * 6 * sc + 4 * sc, 9 * sc, { sw: 1.6 * sc });
  }
  return `<g transform="translate(${x} ${y}) scale(${f} 1)">${g}</g>`;
}

function leafBit(x, y, sc) {
  sc = sc || 1;
  return `<g transform="translate(${x} ${y})">` +
    P(`M0 0 q${12 * sc} ${-9 * sc} ${24 * sc} 0 q${-12 * sc} ${9 * sc} ${-24 * sc} 0 Z`, { fill: C.leaf, sw: 2 * sc }) +
    `</g>`;
}

function bin(x, y, w, h, col, label) {
  let g = P(`M${x} ${y} L${x + 4} ${y + h} L${x + w - 4} ${y + h} L${x + w} ${y} Z`, { fill: col, sw: 3 });
  g += rect(x - 4, y - 9, w + 8, 10, 4, { fill: col, sw: 3 });
  g += line(x + w / 2, y - 9, x + w / 2, y - 15, { sw: 3 });
  if (label) g += `<text x="${x + w / 2}" y="${y + h / 2 + 6}" text-anchor="middle" font-size="17" fill="${INK}" font-family="'Sarabun','Segoe UI',sans-serif">${label}</text>`;
  return g;
}

function earthWall(x, y, w, h) {
  // ผนังดินมีประตูโค้ง
  let g = P(`M${x} ${y + h} L${x} ${y + 26} Q${x + w / 2} ${y - 12} ${x + w} ${y + 26} L${x + w} ${y + h} Z`,
    { fill: C.earth, sw: 3.4 });
  // ลายดิน
  for (let i = 1; i < 4; i++) {
    const yy = y + 34 + i * (h - 40) / 4;
    g += P(`M${x + 8} ${yy} q${w * 0.25} ${-5} ${w * 0.5} 0 q${w * 0.25} ${5} ${w * 0.42} 0`,
      { stroke: C.earthDark, sw: 2.2 });
  }
  return g;
}

function archDoor(cx, baseY, w, h) {
  const x = cx - w / 2;
  return P(`M${x} ${baseY} L${x} ${baseY - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${baseY - h + w / 2} L${x + w} ${baseY} Z`,
    { fill: C.paper, sw: 3.4 });
}

function bubble(x, y, w, h, text, tailDir) {
  const t = tailDir === "left" ? `M${x + 14} ${y + h} l-10 14 l22 -14` : `M${x + w - 14} ${y + h} l10 14 l-22 -14`;
  let g = rect(x, y, w, h, 14, { fill: C.paper, sw: 3 });
  g += P(t, { fill: C.paper, sw: 3 });
  if (text) g += `<text x="${x + w / 2}" y="${y + h / 2 + 7}" text-anchor="middle" font-size="20" fill="${INK}" font-family="'Sarabun','Segoe UI',sans-serif">${text}</text>`;
  return g;
}

function ground(y, w, col) {
  return P(`M0 ${y} q${w * 0.25} ${-6} ${w * 0.5} 0 q${w * 0.25} ${6} ${w * 0.5} 0`, { sw: 3.4, stroke: col || INK });
}

function sun(x, y, r) {
  let g = circ(x, y, r, { fill: C.yellow, sw: 3 });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    g += line(x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6), x + Math.cos(a) * (r + 15), y + Math.sin(a) * (r + 15), { sw: 2.6 });
  }
  return g;
}

function label(x, y, text, size, anchor) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" font-size="${size || 20}" fill="${INK}" font-family="'Sarabun','Segoe UI',sans-serif">${text}</text>`;
}

/* ============================================================
   ภาพหลักประจำบท
   ============================================================ */
const SCENES = {};

/* บทที่ 1 · ประตูสีดินแดง */
SCENES.w1 = function () {
  let g = "";
  g += sun(596, 52, 20);
  g += earthWall(140, 70, 360, 212);
  g += archDoor(272, 282, 96, 152);
  g += rect(196, 118, 42, 38, 6, { fill: C.sky, sw: 3 });     // หน้าต่าง
  g += rect(404, 118, 42, 38, 6, { fill: C.sky, sw: 3 });
  g += line(217, 118, 217, 156, { sw: 2.4 }); g += line(425, 118, 425, 156, { sw: 2.4 });
  // ป้ายเหนือประตู
  g += rect(360, 184, 116, 32, 8, { fill: C.paper, sw: 3 });
  g += label(418, 207, "Year 4", 19);
  // ต้นไม้ใหญ่ทางซ้าย
  g += P("M78 282 L78 152 M78 198 l-26 -24 M78 174 l24 -22", { sw: 5, stroke: "#7a5c3e" });
  g += P("M40 152 q-12 -42 38 -48 q50 -13 58 32 q24 28 -15 46 q-43 21 -81 -30 Z", { fill: C.leaf, sw: 3.2 });
  // เด็กสองคนในกรอบประตู (มองเห็นลาง ๆ)
  g += kid(254, 280, { sc: 0.5, hair: "bob", shirt: C.pink, mouth: "smile", arms: "out" });
  g += kid(292, 280, { sc: 0.5, hair: "spike", shirt: C.blue, mouth: "smile" });
  // ตะวันยืนอยู่ข้างนอก หน้าประตู
  g += kid(566, 300, { sc: 0.92, hair: "short", shirt: C.yellow, mouth: "flat", arms: "hold" });
  g += rect(586, 238, 28, 38, 7, { fill: C.clay, sw: 3 });     // กระเป๋า
  g += P("M592 238 q8 -11 16 0", { sw: 2.6 });
  g += ground(302, 640);
  g += leafBit(96, 318, 0.8); g += leafBit(506, 314, 0.8);
  return g;
};

/* บทที่ 2 · รังมดใต้ต้นไผ่ */
SCENES.w2 = function () {
  let g = "";
  g += bamboo(60, 306, 34, 1.05);
  g += bamboo(104, 306, 66, 0.82);
  g += bamboo(614, 306, 44, 1.0);
  // เนินดิน + รังมด (ขวา)
  g += P("M430 300 q56 -48 116 0 Z", { fill: C.earth, sw: 3.2 });
  g += ell(488, 296, 13, 8, { fill: INK, stroke: INK, sw: 2 });
  // ขบวนมดสามสาย เดินเข้าหารัง
  for (let i = 0; i < 5; i++) g += ant(226 + i * 36, 300, 0.85);
  for (let i = 0; i < 4; i++) g += ant(248 + i * 38, 272, 0.85);
  for (let i = 0; i < 3; i++) { g += ant(272 + i * 40, 244, 0.85); g += leafBit(282 + i * 40, 232, 0.4); }
  // เด็กสี่คนนั่งดู (ซ้าย)
  g += kid(96, 316, { sc: 0.7, hair: "pony", shirt: C.pink, arms: "hold", mouth: "o" });
  g += kid(150, 316, { sc: 0.7, hair: "spike", shirt: C.blue, arms: "hold" });
  g += kid(496, 338, { sc: 0.72, hair: "bob", shirt: C.red, arms: "out", mouth: "o" });
  g += kid(552, 338, { sc: 0.72, hair: "short", shirt: C.green, arms: "hold" });
  // สมุดวาดของตะวัน
  g += rect(180, 258, 40, 30, 4, { fill: C.paper, sw: 2.6 });
  g += ant(200, 273, 0.45);
  g += bubble(212, 62, 208, 44, "ใครสั่งมดคะ", "left");
  g += ground(310, 640);
  return g;
};

/* บทที่ 3 · ลมที่เดินในผนังดิน */
SCENES.w3 = function () {
  let g = "";
  g += sun(64, 56, 20);
  // อาคารดินตัดขวาง
  g += earthWall(200, 60, 340, 220);
  g += rect(300, 150, 140, 90, 8, { fill: C.paper, sw: 3 });
  g += label(370, 202, "ห้องเรียน", 20);
  // ช่องลมล่าง–บน + ลูกศรลม
  g += rect(212, 216, 34, 22, 5, { fill: C.sky, sw: 3 });
  g += rect(494, 84, 34, 22, 5, { fill: C.sky, sw: 3 });
  g += P("M170 228 q46 -6 74 -2", { sw: 3, stroke: C.blue, dash: "1 0" });
  g += P("M232 218 l14 8 l-14 8", { sw: 3, stroke: C.blue });
  g += P("M262 214 q60 -60 224 -110", { sw: 3, stroke: C.red, dash: "9 8" });
  g += P("M478 106 l12 -6 l-2 14", { sw: 3, stroke: C.red });
  g += label(204, 208, "ลมเย็นเข้า", 16, "start");
  g += label(486, 62, "ลมร้อนออก", 16, "start");
  // ป้าอ้อยกับจักรยาน
  g += circ(58, 286, 17, { sw: 3 }); g += circ(110, 286, 17, { sw: 3 });
  g += P("M58 286 L80 258 L110 286 M80 258 L92 258 M70 272 L94 272", { sw: 2.8 });
  g += kid(150, 304, { sc: 0.8, hair: "bun", shirt: C.leafDark, arms: "wave" });
  // ถังสี่ใบ
  const cols = [C.green, C.yellow, C.blue, C.red];
  const nm = ["ทั่วไป", "รีไซเคิล", "เศษอาหาร", "อันตราย"];
  for (let i = 0; i < 4; i++) g += bin(302 + i * 66, 262, 50, 44, cols[i], "");
  for (let i = 0; i < 4; i++) g += label(327 + i * 66, 334, nm[i], 14);
  g += ground(310, 640);
  return g;
};

/* บทที่ 4 · ไฟจราจรของคำพูด */
SCENES.w4 = function () {
  let g = "";
  // เสาไฟจราจร
  g += rect(272, 44, 92, 216, 18, { fill: C.grey, sw: 3.4 });
  g += line(318, 260, 318, 306, { sw: 5 });
  g += circ(318, 88, 27, { fill: C.red, sw: 3 });
  g += circ(318, 152, 27, { fill: C.yellow, sw: 3 });
  g += circ(318, 216, 27, { fill: C.green, sw: 3 });
  g += label(376, 96, "หยุดก่อน", 18, "start");
  g += label(376, 160, "ถามให้ชัด", 18, "start");
  g += label(376, 224, "พูดด้วยดี", 18, "start");
  // เด็กสองคนหันหลังให้กัน
  g += kid(110, 306, { sc: 0.95, hair: "bob", shirt: C.red, mouth: "sad", arms: "down", flip: true });
  g += kid(530, 306, { sc: 0.95, hair: "pony", shirt: C.blue, mouth: "sad", arms: "down" });
  // ลูกโป่งคำพูดที่ชนกัน
  g += bubble(28, 148, 132, 44, "สีแดงสิ", "right");
  g += bubble(478, 148, 142, 44, "สีน้ำตาล", "left");
  g += P("M176 166 l20 12 M196 166 l-20 12", { sw: 3, stroke: C.red });
  g += P("M444 166 l20 12 M464 166 l-20 12", { sw: 3, stroke: C.red });
  // กระดาษป้ายที่ยังไม่เสร็จ
  g += rect(252, 268, 132, 40, 6, { fill: C.paper, sw: 3, dash: "10 8" });
  g += label(318, 295, "ป้ายยังว่าง", 17);
  g += ground(318, 640);
  return g;
};

/* บทที่ 5 · ที่ว่างข้าง ๆ ฉัน */
SCENES.w5 = function () {
  let g = "";
  g += bamboo(40, 300, 40, 1.0);
  g += bamboo(614, 300, 52, 0.9);
  // โต๊ะยาว
  g += rect(96, 214, 292, 18, 6, { fill: C.clay, sw: 3.2 });
  g += line(122, 232, 116, 292, { sw: 4 }); g += line(362, 232, 368, 292, { sw: 4 });
  // เด็กสามคนที่โต๊ะ
  g += kid(150, 292, { sc: 0.66, hair: "bob", shirt: C.red, arms: "hold" });
  g += kid(224, 292, { sc: 0.66, hair: "spike", shirt: C.green, arms: "hold" });
  g += kid(302, 292, { sc: 0.66, hair: "pony", shirt: C.pink, arms: "out", mouth: "o" });
  // ม้านั่งตัวที่สิบสาม (ตัวใหม่ ต่อท้าย ยังว่างอยู่)
  g += rect(408, 250, 118, 15, 5, { fill: C.earthDark, sw: 3.2 });
  g += line(424, 265, 420, 292, { sw: 3.4 }); g += line(510, 265, 514, 292, { sw: 3.4 });
  g += P("M418 240 l98 0", { sw: 2.6, dash: "8 7" });
  g += label(467, 232, "ที่ว่างของเธอ", 16);
  // ตะวันกำลังเดินเข้ามาพร้อมกล่องข้าว
  g += kid(578, 292, { sc: 0.66, hair: "short", shirt: C.yellow, arms: "hold", mouth: "smile" });
  g += rect(564, 248, 28, 18, 4, { fill: C.blue, sw: 2.6 });
  g += bubble(322, 56, 208, 44, "ตรงนี้ว่างนะ", "right");
  g += ground(300, 640);
  return g;
};

/* บทที่ 6 · วันเปิดผนัง */
SCENES.w6 = function () {
  let g = "";
  // ธงราว
  g += P("M20 44 q160 40 300 26 q160 -16 300 22", { sw: 2.6 });
  const fc = [C.red, C.yellow, C.green, C.blue, C.pink, C.clay, C.leafDark];
  for (let i = 0; i < 12; i++) {
    const x = 46 + i * 46, y = 52 + Math.sin(i / 2.4) * 9;
    g += P(`M${x} ${y} l16 0 l-8 20 Z`, { fill: fc[i % fc.length], sw: 2.4 });
  }
  // ผนังภาพ
  g += rect(96, 96, 452, 176, 10, { fill: C.earth, sw: 3.4 });
  g += rect(112, 110, 420, 148, 6, { fill: C.paper, sw: 2.8 });
  // เนื้อในภาพผนัง: มด · บ่อปลา · ถังสี่สี · เด็กสี่คน
  g += ant(160, 150, 0.8); g += ant(196, 150, 0.8); g += ant(232, 150, 0.8);
  g += ell(178, 220, 46, 22, { fill: C.sky, sw: 2.6 });
  g += P("M162 220 q10 -9 20 0 q-10 9 -20 0 Z", { fill: C.blue, sw: 2 });
  for (let i = 0; i < 4; i++) g += bin(292 + i * 34, 196, 24, 26, [C.green, C.yellow, C.blue, C.red][i], "");
  g += kid(320, 172, { sc: 0.33, hair: "bob", shirt: C.red });
  g += kid(352, 172, { sc: 0.33, hair: "spike", shirt: C.green });
  g += kid(384, 172, { sc: 0.33, hair: "pony", shirt: C.pink });
  g += kid(416, 172, { sc: 0.33, hair: "short", shirt: C.yellow });
  g += label(466, 244, "ชุมชนของเรา", 18);
  // ผู้นำเสนอกับผู้ชม
  g += kid(64, 320, { sc: 0.8, hair: "short", shirt: C.yellow, arms: "out", mouth: "smile" });
  g += kid(580, 320, { sc: 0.72, hair: "bun", shirt: C.leafDark, arms: "hold", mouth: "smile" });
  g += kid(524, 322, { sc: 0.62, hair: "bob", shirt: C.blue, arms: "up", mouth: "o" });
  g += ground(328, 640);
  return g;
};

/* ============================================================
   ภาพตัวละคร (หน้าแนะนำตัวละคร) — ครึ่งตัว
   ============================================================ */
function portrait(opt) {
  return `<g transform="translate(60 116)">${kid(0, 0, Object.assign({ sc: 1.05 }, opt))}</g>`;
}
const CAST_ART = {
  tawan:  () => portrait({ hair: "short", shirt: C.yellow, arms: "hold", mouth: "flat" }),
  panpan: () => portrait({ hair: "pony", shirt: C.pink, arms: "out", mouth: "smile" }),
  kaeo:   () => portrait({ hair: "bob", shirt: C.red, arms: "wave", mouth: "o" }),
  tonkla: () => portrait({ hair: "spike", shirt: C.green, arms: "hold", mouth: "smile" }),
  teacher:() => portrait({ hair: "bun", shirt: C.blue, arms: "out", mouth: "smile" }),
  paoi:   () => portrait({ hair: "bun", shirt: C.leafDark, arms: "wave", mouth: "smile", hairColor: "#6b6b6b" }),
};

/* ---------- ปกหนังสือ ---------- */
SCENES.cover = function () {
  let g = "";
  g += sun(556, 60, 24);
  g += earthWall(120, 92, 400, 190);
  g += archDoor(320, 282, 104, 158);
  g += rect(196, 146, 46, 40, 6, { fill: C.sky, sw: 3 });
  g += rect(414, 146, 46, 40, 6, { fill: C.sky, sw: 3 });
  g += bamboo(64, 306, 60, 1.0);
  g += bamboo(600, 306, 74, 0.85);
  g += kid(212, 320, { sc: 0.82, hair: "bob", shirt: C.red, arms: "wave" });
  g += kid(272, 320, { sc: 0.82, hair: "spike", shirt: C.green, arms: "hold" });
  g += kid(370, 320, { sc: 0.82, hair: "pony", shirt: C.pink, arms: "out" });
  g += kid(430, 320, { sc: 0.82, hair: "short", shirt: C.yellow, arms: "wave" });
  for (let i = 0; i < 4; i++) g += ant(96 + i * 30, 342, 0.75);
  g += ground(324, 640);
  return g;
};

/* ============================================================
   ห่อเป็น <svg> พร้อมฟิลเตอร์ลายเส้นสั่น
   ============================================================ */
function wrap(inner, w, h, seed) {
  const id = "rgh" + (seed == null ? 1 : seed);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
    `<defs><filter id="${id}" x="-6%" y="-6%" width="112%" height="112%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="${seed || 7}" result="n"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/>` +
    `</filter></defs>` +
    `<g filter="url(#${id})">${inner}</g></svg>`;
}

const ART = {
  colors: C,
  /** ภาพหลักประจำบท / ปก — คืนค่า <svg> เต็ม */
  scene(name, seed) {
    const f = SCENES[name];
    if (!f) return "";
    return wrap(f(), 640, 360, seed == null ? 7 : seed);
  },
  /** ภาพตัวละครครึ่งตัว 120×140 */
  cast(name, seed) {
    const f = CAST_ART[name];
    if (!f) return "";
    return wrap(f(), 120, 140, seed == null ? 3 : seed);
  },
  sceneNames: Object.keys(SCENES),
  castNames: Object.keys(CAST_ART),
};

root.UNIT1_ART = ART;

})(typeof module !== "undefined" && module.exports ? module.exports : window);

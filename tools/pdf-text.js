/* ดึงข้อความจาก PDF ของ Canva  —  ไม่ใช้ไลบรารีนอก ใช้ zlib ที่ node มีให้
   ------------------------------------------------------------------------
   สองอย่างที่ทำให้การอ่านตรง ๆ ไม่ได้เรื่อง แล้วแก้อย่างไร

   1. Canva วาดทีละตัวอักษร และยกวรรณยุกต์ไปวางคนละพิกัด เรียงตาม x แล้วสระ
      กับวรรณยุกต์จะสลับที่ บ้าน กลายเป็น บาน หรือ ฉัน กลายเป็น ฉนั
   2. แต่ Canva ก็ใส่ /Span << /ActualText <FEFF...> >> BDC ครอบข้อความจริงไว้ให้
      ซึ่งเป็นข้อความตามลำดับที่ถูกต้องอยู่แล้ว จึงอ่านจากตรงนั้นเป็นหลัก
      แล้วค่อยถอยไปถอดทีละกลิฟเมื่อไม่มี ActualText

   ใช้: node pdftext.js "ไฟล์.pdf" > out.json                                */
const fs = require("fs");
const zlib = require("zlib");

const buf = fs.readFileSync(process.env.PDF || process.argv[2]);
const raw = buf.toString("latin1");

/* ---------- อ่านพจนานุกรม << >> แบบนับวงเล็บให้ครบชั้น ---------- */
function balanced(s, from) {
  let d = 0, i = from;
  while (i < s.length) {
    if (s[i] === "<" && s[i + 1] === "<") { d++; i += 2; continue; }
    if (s[i] === ">" && s[i + 1] === ">") { d--; i += 2; if (!d) return s.slice(from, i); continue; }
    if (s[i] === "(") { i++; let p = 1; while (i < s.length && p) { if (s[i] === "\\") i++; else if (s[i] === "(") p++; else if (s[i] === ")") p--; i++; } continue; }
    i++;
  }
  return s.slice(from);
}
function entry(dict, key) {
  const m = dict.match(new RegExp("/" + key + "(?![A-Za-z0-9])\\s*"));
  if (!m) return null;
  const at = m.index + m[0].length;
  if (dict[at] === "<" && dict[at + 1] === "<") return { kind: "dict", val: balanced(dict, at) };
  if (dict[at] === "[") {
    let d = 0, i = at;
    while (i < dict.length) { if (dict[i] === "[") d++; else if (dict[i] === "]") { d--; if (!d) { i++; break; } } i++; }
    return { kind: "array", val: dict.slice(at, i) };
  }
  const r = dict.slice(at).match(/^(\d+)\s+(\d+)\s+R/);
  if (r) return { kind: "ref", val: r[1] + " " + r[2] };
  const t = dict.slice(at).match(/^[^\s/\]>]+/);
  return t ? { kind: "token", val: t[0] } : null;
}

/* ---------- เก็บวัตถุทั้งหมดในไฟล์ ---------- */
const objs = new Map();
{
  const re = /(\d+)\s+(\d+)\s+obj\b/g;
  const starts = [];
  let m;
  while ((m = re.exec(raw))) starts.push({ num: +m[1], gen: +m[2], at: m.index, bodyAt: re.lastIndex });
  for (let i = 0; i < starts.length; i++) {
    const s = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1].at : raw.length;
    const body = raw.slice(s.bodyAt, end);
    const si = body.indexOf("stream");
    let dict = body, stream = null;
    if (si >= 0) {
      dict = body.slice(0, si);
      let ds = s.bodyAt + si + 6;
      if (raw[ds] === "\r") ds++;
      if (raw[ds] === "\n") ds++;
      const lm = dict.match(/\/Length\s+(\d+)(?!\s+\d+\s+R)/);
      let de;
      if (lm) de = ds + +lm[1];
      else { const es = raw.indexOf("endstream", ds); de = es < 0 ? end : es; }
      stream = buf.slice(ds, de);
    }
    objs.set(s.num + " " + s.gen, { dict, stream });
  }
}
const get = (ref) => objs.get(ref) || objs.get(String(ref).split(" ")[0] + " 0");
function dictOf(e) {
  if (!e) return "";
  if (e.kind === "dict" || e.kind === "array") return e.val;
  if (e.kind === "ref") { const o = get(e.val); return o ? o.dict : ""; }
  return "";
}
function inflate(o) {
  if (!o || !o.stream) return null;
  if (!/\/FlateDecode/.test(o.dict)) return o.stream;
  try { return zlib.inflateSync(o.stream); } catch (e) {
    try { return zlib.inflateRawSync(o.stream.slice(2)); } catch (e2) { return null; }
  }
}

/* ---------- ToUnicode CMap (ใช้ตอนไม่มี ActualText) ---------- */
const cmapCache = new Map();
function parseCMap(ref) {
  if (cmapCache.has(ref)) return cmapCache.get(ref);
  const data = inflate(get(ref));
  const map = new Map();
  if (data) {
    const t = data.toString("latin1");
    const hexToStr = (h) => { let s = ""; for (let i = 0; i + 3 < h.length + 1; i += 4) s += String.fromCharCode(parseInt(h.substr(i, 4), 16)); return s; };
    for (const blk of t.match(/beginbfchar([\s\S]*?)endbfchar/g) || []) {
      const re = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g; let m;
      while ((m = re.exec(blk))) map.set(parseInt(m[1], 16), hexToStr(m[2]));
    }
    for (const blk of t.match(/beginbfrange([\s\S]*?)endbfrange/g) || []) {
      const re = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(?:<([0-9A-Fa-f]+)>|\[([\s\S]*?)\])/g; let m;
      while ((m = re.exec(blk))) {
        const lo = parseInt(m[1], 16), hi = parseInt(m[2], 16);
        if (m[3]) { const base = parseInt(m[3], 16); for (let c = lo; c <= hi; c++) map.set(c, String.fromCharCode(base + (c - lo))); }
        else { const items = m[4].match(/<([0-9A-Fa-f]+)>/g) || []; items.forEach((it, i) => map.set(lo + i, hexToStr(it.slice(1, -1)))); }
      }
    }
  }
  cmapCache.set(ref, map);
  return map;
}
function fontsOf(resDict) {
  const out = new Map();
  const body = dictOf(entry(resDict, "Font"));
  if (!body) return out;
  const re = /\/([A-Za-z0-9#._-]+)\s+(\d+)\s+(\d+)\s+R/g; let m;
  while ((m = re.exec(body))) {
    const fo = get(m[2] + " " + m[3]);
    if (!fo) continue;
    const tu = entry(fo.dict, "ToUnicode");
    out.set(m[1], { cmap: tu && tu.kind === "ref" ? parseCMap(tu.val) : new Map(), twoByte: /\/Identity-H|\/Type0/.test(fo.dict) });
  }
  return out;
}

/* ---------- ตัวช่วยถอดสตริง ---------- */
function unescapePdfString(t) {
  let out = "";
  for (let i = 0; i < t.length; i++) {
    if (t[i] !== "\\") { out += t[i]; continue; }
    const n = t[++i];
    if (n === "n") out += "\n"; else if (n === "r") out += "\r";
    else if (n === "t") out += "\t"; else if (n === "b") out += "\b"; else if (n === "f") out += "\f";
    else if (n >= "0" && n <= "7") { let oct = n; while (oct.length < 3 && t[i + 1] >= "0" && t[i + 1] <= "7") oct += t[++i]; out += String.fromCharCode(parseInt(oct, 8)); }
    else out += n;
  }
  return out;
}
function hexStr(h) {
  const clean = h.replace(/[^0-9A-Fa-f]/g, "");
  let s = "";
  for (let i = 0; i + 1 < clean.length; i += 2) s += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
  return s;
}
function decodeStr(s, font, all) {
  let out = "";
  if (font && font.twoByte) {
    for (let i = 0; i + 1 < s.length; i += 2) {
      const code = (s.charCodeAt(i) << 8) | s.charCodeAt(i + 1);
      if (font.cmap.has(code)) { out += font.cmap.get(code); continue; }
      if (all) for (const f2 of all.values()) if (f2 !== font && f2.cmap.has(code)) { out += f2.cmap.get(code); break; }
    }
  } else {
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      out += font && font.cmap.has(c) ? font.cmap.get(c) : String.fromCharCode(c);
    }
  }
  return out;
}
// <FEFF0E1A0E49> -> "บ้"
function actualText(hex) {
  const b = hexStr(hex);
  let s = "";
  let i = 0;
  if (b.charCodeAt(0) === 0xFE && b.charCodeAt(1) === 0xFF) i = 2;
  for (; i + 1 < b.length; i += 2) s += String.fromCharCode((b.charCodeAt(i) << 8) | b.charCodeAt(i + 1));
  return s;
}

/* ---------- เดินคำสั่งใน content stream ---------- */
const TOKEN = /\((?:\\.|[^\\()])*\)|<<|>>|<[0-9A-Fa-f\s]*>|\[|\]|\/[^\s/<>\[\]()]+|[-+]?[\d.]+|[A-Za-z'"*]+/g;

function runsOf(content, fonts, resolveXObject, depth) {
  const runs = [];
  const t = content.toString("latin1");
  let font = null;
  let tm = [1, 0, 0, 1, 0, 0], tlm = tm.slice(), leading = 12;
  const mc = [];                                   // ชั้นของ marked content
  let stack = [];
  const openSpan = () => { for (let i = mc.length - 1; i >= 0; i--) if (mc[i]) return mc[i]; return null; };
  const push = (s) => { if (s) runs.push({ x: tm[4], y: tm[5], s: s }); };
  const show = (s) => {
    const sp = openSpan();
    if (sp) { if (!sp.done) { sp.done = true; push(sp.text); } return; }   // มี ActualText ใช้อันนั้นครั้งเดียว
    push(s);
  };
  const re = new RegExp(TOKEN.source, "g");
  let m;
  while ((m = re.exec(t))) {
    const tok = m[0];
    if (/^[-+.\d]/.test(tok) || tok[0] === "/" || tok[0] === "(" || tok[0] === "<" || tok === "[" || tok === "]" || tok === "<<" || tok === ">>") { stack.push(tok); continue; }
    const op = tok;
    const arg = (i) => stack[stack.length - i];
    if (op === "BDC" || op === "BMC") {
      let txt = null;
      const k = stack.indexOf("/ActualText");
      if (k >= 0 && stack[k + 1] && stack[k + 1][0] === "<") txt = actualText(stack[k + 1]);
      mc.push(txt === null ? null : { text: txt, done: false });
    } else if (op === "EMC") { mc.pop(); }
    else if (op === "Tf") { font = fonts.get(String(arg(2) || "").slice(1)) || null; }
    else if (op === "TL") leading = parseFloat(arg(1)) || 12;
    else if (op === "Td" || op === "TD") {
      const ty = parseFloat(arg(1)) || 0, tx = parseFloat(arg(2)) || 0;
      if (op === "TD") leading = -ty;
      tlm = [tlm[0], tlm[1], tlm[2], tlm[3], tlm[4] + tx, tlm[5] + ty]; tm = tlm.slice();
    } else if (op === "Tm") {
      tlm = [parseFloat(arg(6)) || 0, parseFloat(arg(5)) || 0, parseFloat(arg(4)) || 0, parseFloat(arg(3)) || 0, parseFloat(arg(2)) || 0, parseFloat(arg(1)) || 0];
      tm = tlm.slice();
    } else if (op === "T*") { tlm = [tlm[0], tlm[1], tlm[2], tlm[3], tlm[4], tlm[5] - leading]; tm = tlm.slice(); }
    else if (op === "BT") { tm = [1, 0, 0, 1, 0, 0]; tlm = tm.slice(); }
    else if (op === "Tj" || op === "'" || op === '"') {
      const a = String(arg(1) || "");
      if (op !== "Tj") { tlm = [tlm[0], tlm[1], tlm[2], tlm[3], tlm[4], tlm[5] - leading]; tm = tlm.slice(); }
      show(decodeStr(a[0] === "(" ? unescapePdfString(a.slice(1, -1)) : hexStr(a), font, fonts));
    } else if (op === "TJ") {
      let i = stack.length - 1, d = 0; const parts = [];
      for (; i >= 0; i--) {
        if (stack[i] === "]") d++;
        else if (stack[i] === "[") { d--; if (!d) break; }
        else if (d > 0) parts.unshift(stack[i]);
      }
      let s = "";
      for (const p of parts) {
        if (p[0] === "(") s += decodeStr(unescapePdfString(p.slice(1, -1)), font, fonts);
        else if (p[0] === "<") s += decodeStr(hexStr(p), font, fonts);
        else if (/^[-+.\d]/.test(p) && parseFloat(p) <= -180) s += " ";
      }
      show(s);
    } else if (op === "Do" && depth < 6 && resolveXObject) {
      const sub = resolveXObject(String(arg(1) || "").slice(1));
      if (sub) for (const r of runsOf(sub.content, sub.fonts, sub.resolve, depth + 1)) runs.push(r);
    }
    stack = [];
  }
  return runs;
}

/* ---------- ทีละหน้า ---------- */
function resourcesOf(dict) { return dictOf(entry(dict, "Resources")); }
function makeResolver(resDict) {
  return function (nm) {
    const xd = dictOf(entry(resDict, "XObject"));
    if (!xd) return null;
    const em = xd.match(new RegExp("/" + nm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![A-Za-z0-9])\\s+(\\d+)\\s+(\\d+)\\s+R"));
    if (!em) return null;
    const xo = get(em[1] + " " + em[2]);
    if (!xo || !/\/Subtype\s*\/Form/.test(xo.dict)) return null;
    const c = inflate(xo);
    if (!c) return null;
    const xres = resourcesOf(xo.dict);
    return { content: c, fonts: fontsOf(xres), resolve: makeResolver(xres) };
  };
}

const pageOrder = [];
for (const [, o] of objs) {
  if (!/\/Type\s*\/Pages\b/.test(o.dict)) continue;
  const kids = entry(o.dict, "Kids");
  if (!kids) continue;
  for (const r of kids.val.match(/(\d+)\s+(\d+)\s+R/g) || []) pageOrder.push(r.replace(/\s+R$/, "").replace(/\s+/g, " "));
}
const seenK = new Set();
let pages = pageOrder.filter((k) => { const o = get(k); return o && /\/Type\s*\/Page(?![s])/.test(o.dict) && !seenK.has(k) && seenK.add(k); });
if (!pages.length) { pages = []; for (const [k, o] of objs) if (/\/Type\s*\/Page(?![s])/.test(o.dict)) pages.push(k); }

const out = [];
for (const key of pages) {
  const po = get(key);
  const res = resourcesOf(po.dict);
  const fonts = fontsOf(res);
  const resolve = makeResolver(res);
  const cm = entry(po.dict, "Contents");
  const contents = [];
  if (cm) {
    if (cm.kind === "array") for (const r of cm.val.match(/(\d+)\s+(\d+)\s+R/g) || []) contents.push(get(r.replace(/\s+R$/, "")));
    else if (cm.kind === "ref") contents.push(get(cm.val));
  }
  let runs = [];
  for (const c of contents) { const data = inflate(c); if (data) runs = runs.concat(runsOf(data, fonts, resolve, 0)); }
  // หน้ากระดาษถูกพลิกแกน y ในเมทริกซ์ของ Canva ค่ามากคือล่าง
  runs.sort((a, b) => (Math.abs(a.y - b.y) > 3 ? a.y - b.y : a.x - b.x));
  const lines = [];
  let curY = null, cur = [];
  for (const r of runs) {
    if (curY === null || Math.abs(r.y - curY) <= 3) { cur.push(r); if (curY === null) curY = r.y; }
    else { lines.push(cur); cur = [r]; curY = r.y; }
  }
  if (cur.length) lines.push(cur);
  out.push(lines.map((l) => l.map((r) => r.s).join("").replace(/\s+/g, " ").trim()).filter(Boolean));
}

if (process.env.LIB) module.exports = { pages, get, resourcesOf, fontsOf, makeResolver, runsOf, inflate, entry, out };
else console.log(JSON.stringify(out, null, 1));

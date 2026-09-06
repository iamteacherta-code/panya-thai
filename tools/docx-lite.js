/* ============================================================
   docx-lite — ตัวสร้างไฟล์ .docx ขนาดจิ๋ว ไม่พึ่ง dependency ภายนอก
   รองรับเท่าที่หนังสือเรียนเล่มนี้ต้องใช้:
     ย่อหน้า · หัวข้อ · ตาราง · รูปภาพ PNG · เส้นบรรทัดสำหรับเขียน
     กล่องพื้นสี (ทำจากตาราง 1 ช่อง) · ขึ้นหน้าใหม่ · ฟุตเตอร์เลขหน้า
   ============================================================ */
"use strict";
const zlib = require("zlib");

/* ---------- ZIP (store/deflate) ---------- */
const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function zip(files) {
  const chunks = [], central = [];
  let offset = 0;
  files.forEach((f) => {
    const name = Buffer.from(f.name, "utf8");
    const raw = Buffer.isBuffer(f.data) ? f.data : Buffer.from(f.data, "utf8");
    const comp = zlib.deflateRawSync(raw, { level: 9 });
    const useDeflate = comp.length < raw.length;
    const body = useDeflate ? comp : raw;
    const method = useDeflate ? 8 : 0;
    const crc = crc32(raw);

    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0x0800, 6);
    lh.writeUInt16LE(method, 8); lh.writeUInt16LE(0, 10); lh.writeUInt16LE(0x2821, 12);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(body.length, 18); lh.writeUInt32LE(raw.length, 22);
    lh.writeUInt16LE(name.length, 26); lh.writeUInt16LE(0, 28);
    chunks.push(lh, name, body);

    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0x0800, 8); ch.writeUInt16LE(method, 10); ch.writeUInt16LE(0, 12);
    ch.writeUInt16LE(0x2821, 14); ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(body.length, 20); ch.writeUInt32LE(raw.length, 24);
    ch.writeUInt16LE(name.length, 28); ch.writeUInt32LE(0, 30); ch.writeUInt16LE(0, 34);
    ch.writeUInt16LE(0, 36); ch.writeUInt32LE(0, 38); ch.writeUInt32LE(offset, 42);
    central.push(ch, name);

    offset += lh.length + name.length + body.length;
  });
  const cd = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8); eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cd.length, 12); eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([Buffer.concat(chunks), cd, eocd]);
}

/* ---------- helpers ---------- */
const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

/** อ่านขนาดจริงของไฟล์ PNG จาก IHDR */
function pngSize(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const EMU_PER_PX = 9525;   // 96 dpi
const TW_PER_CM = 567;     // twips

/* ============================================================
   Doc
   ============================================================ */
class Doc {
  constructor(opt) {
    opt = opt || {};
    this.body = [];
    this.images = [];          // {name, data}
    this.font = opt.font || "Sarabun";
    this.margin = opt.margin || { top: 1.6, right: 1.5, bottom: 1.5, left: 1.5 }; // ซม.
    this.footer = opt.footer || "";
    this.contentWidthTw = Math.round((21 - this.margin.left - this.margin.right) * TW_PER_CM);
  }

  /* --- runs --- */
  run(text, o) {
    o = o || {};
    let rpr = "";
    if (o.b) rpr += "<w:b/><w:bCs/>";
    if (o.i) rpr += "<w:i/><w:iCs/>";
    if (o.u) rpr += `<w:u w:val="${o.u === true ? "single" : o.u}"/>`;
    if (o.color) rpr += `<w:color w:val="${o.color}"/>`;
    if (o.shd) rpr += `<w:shd w:val="clear" w:color="auto" w:fill="${o.shd}"/>`;
    const sz = (o.size || 11) * 2;
    rpr += `<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>`;
    const parts = String(text).split("\n");
    return parts.map((t, i) =>
      `<w:r><w:rPr>${rpr}</w:rPr>${i ? "<w:br/>" : ""}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`
    ).join("");
  }

  /* --- paragraph --- */
  p(runsXml, o) {
    o = o || {};
    let ppr = "";
    if (o.align) ppr += `<w:jc w:val="${o.align}"/>`;
    const before = o.before == null ? 0 : o.before;
    const after = o.after == null ? 60 : o.after;
    ppr += `<w:spacing w:before="${before}" w:after="${after}"${o.line ? ` w:line="${o.line}" w:lineRule="auto"` : ""}/>`;
    if (o.indent) ppr += `<w:ind w:left="${o.indent}"${o.hanging ? ` w:hanging="${o.hanging}"` : ""}/>`;
    if (o.shd) ppr += `<w:shd w:val="clear" w:color="auto" w:fill="${o.shd}"/>`;
    if (o.bdr) {
      const b = o.bdr;
      // ลำดับตาม schema: top, left, bottom, right, between
      ppr += "<w:pBdr>" + ["top", "left", "bottom", "right", "between"].map((s) =>
        b[s] ? `<w:${s} w:val="${b[s].val || "single"}" w:sz="${b[s].sz || 6}" w:space="${b[s].space || 2}" w:color="${b[s].color || "auto"}"/>` : ""
      ).join("") + "</w:pBdr>";
    }
    if (o.keepNext) ppr += "<w:keepNext/>";
    this.body.push(`<w:p><w:pPr>${ppr}</w:pPr>${runsXml}</w:p>`);
    return this;
  }

  /** ย่อหน้าข้อความธรรมดา */
  text(t, o) { return this.p(this.run(t, o), o); }

  /** หัวข้อ */
  heading(t, o) {
    o = Object.assign({ size: 16, b: true, color: "2F2A20", before: 160, after: 80, keepNext: true }, o || {});
    return this.p(this.run(t, o), o);
  }

  /** เส้นบรรทัดสำหรับเขียน
      Word จะรวมย่อหน้าที่มีเส้นขอบเหมือนกันติดกันเป็นบล็อกเดียว จึงต้องใส่
      w:between ด้วย ไม่เช่นนั้นจะเห็นเส้นแค่เส้นเดียวที่ท้ายบล็อก              */
  writeLines(n, o) {
    o = o || {};
    const st = { val: "dotted", sz: 6, color: "BFB49C" };
    for (let i = 0; i < n; i++) {
      this.p("", {
        after: o.after == null ? 200 : o.after,
        bdr: { bottom: st, between: st },
        indent: o.indent || 0,
      });
    }
    return this;
  }

  /** ย่อหน้าว่างความสูงคงที่ (twips) — ใช้คั่นหลังตาราง/กล่องโดยไม่กินที่ */
  spacer(h) {
    const v = h == null ? 80 : h;
    this.body.push(`<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="${v}" w:lineRule="exact"/>` +
      `<w:rPr><w:sz w:val="4"/><w:szCs w:val="4"/></w:rPr></w:pPr></w:p>`);
    return this;
  }

  /** ขึ้นหน้าใหม่ */
  pageBreak() {
    this.body.push('<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:br w:type="page"/></w:r></w:p>');
    return this;
  }

  /** ตาราง — rows คือ array ของ array ของ cell
      cell = string | {text, b, shd, color, size, align, width(%)}          */
  table(rows, o) {
    o = o || {};
    const cols = rows[0].length;
    const widths = o.widths || Array.from({ length: cols }, () => Math.floor(100 / cols));
    const bw = o.borderColor || "D9CFB8";
    const bsz = o.borderSize || 6;
    const grid = widths.map((w) => `<w:gridCol w:w="${Math.round(this.contentWidthTw * w / 100)}"/>`).join("");
    const border = (s) => `<w:${s} w:val="single" w:sz="${bsz}" w:space="0" w:color="${bw}"/>`;
    const tblPr = `<w:tblPr><w:tblW w:w="${this.contentWidthTw}" w:type="dxa"/>` +
      (o.noBorder ? "" : `<w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(border).join("")}</w:tblBorders>`) +
      `<w:tblCellMar><w:top w:w="${o.padV || 70}" w:type="dxa"/><w:left w:w="${o.padH || 110}" w:type="dxa"/>` +
      `<w:bottom w:w="${o.padV || 70}" w:type="dxa"/><w:right w:w="${o.padH || 110}" w:type="dxa"/></w:tblCellMar></w:tblPr>`;

    const trs = rows.map((r, ri) => {
      const tcs = r.map((c, ci) => {
        const cell = typeof c === "string" ? { text: c } : (c || {});
        const w = Math.round(this.contentWidthTw * (cell.width || widths[ci]) / 100);
        const shd = cell.shd ? `<w:shd w:val="clear" w:color="auto" w:fill="${cell.shd}"/>` : "";
        const span = cell.span ? `<w:gridSpan w:val="${cell.span}"/>` : "";
        const inner = cell.xml != null ? cell.xml
          : `<w:p><w:pPr><w:spacing w:before="0" w:after="0"/>${cell.align ? `<w:jc w:val="${cell.align}"/>` : ""}</w:pPr>` +
            this.run(cell.text == null ? "" : cell.text, cell) + "</w:p>";
        const h = cell.minH ? `<w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${span}${shd}</w:tcPr>` : "";
        return `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${span}${shd}<w:vAlign w:val="${cell.valign || "top"}"/></w:tcPr>${inner}</w:tc>`;
      }).join("");
      const trPr = `<w:trPr>${ri === 0 && o.headerRow ? "<w:tblHeader/>" : ""}${o.rowH ? `<w:trHeight w:val="${o.rowH}"/>` : ""}</w:trPr>`;
      return `<w:tr>${trPr}${tcs}</w:tr>`;
    }).join("");

    this.body.push(`<w:tbl>${tblPr}<w:tblGrid>${grid}</w:tblGrid>${trs}</w:tbl>`);
    this.spacer(o.gap);
    return this;
  }

  /** กล่องพื้นสี = ตาราง 1 ช่อง */
  box(linesXml, o) {
    o = o || {};
    this.body.push(
      `<w:tbl><w:tblPr><w:tblW w:w="${this.contentWidthTw}" w:type="dxa"/>` +
      `<w:tblBorders>${["top", "left", "bottom", "right"].map((s) =>
        `<w:${s} w:val="single" w:sz="${o.borderSize || 8}" w:space="0" w:color="${o.borderColor || "CBD9BC"}"/>`).join("")}</w:tblBorders>` +
      `<w:tblCellMar><w:top w:w="120" w:type="dxa"/><w:left w:w="160" w:type="dxa"/>` +
      `<w:bottom w:w="120" w:type="dxa"/><w:right w:w="160" w:type="dxa"/></w:tblCellMar></w:tblPr>` +
      `<w:tblGrid><w:gridCol w:w="${this.contentWidthTw}"/></w:tblGrid>` +
      `<w:tr><w:tc><w:tcPr><w:tcW w:w="${this.contentWidthTw}" w:type="dxa"/>` +
      (o.shd ? `<w:shd w:val="clear" w:color="auto" w:fill="${o.shd}"/>` : "") +
      `</w:tcPr>${linesXml}</w:tc></w:tr></w:tbl>`
    );
    this.spacer(o.gap);
    return this;
  }

  /** ย่อหน้าที่ใช้ภายในกล่อง (คืนค่าเป็น xml ไม่ push ลง body) */
  bp(runsXml, o) {
    o = o || {};
    let ppr = `<w:spacing w:before="${o.before || 0}" w:after="${o.after == null ? 40 : o.after}"${o.line ? ` w:line="${o.line}" w:lineRule="auto"` : ""}/>`;
    if (o.align) ppr = `<w:jc w:val="${o.align}"/>` + ppr;
    if (o.bdr && o.bdr.bottom) {
      const b = o.bdr.bottom;
      ppr += `<w:pBdr><w:bottom w:val="${b.val || "dotted"}" w:sz="${b.sz || 6}" w:space="2" w:color="${b.color || "BFB49C"}"/></w:pBdr>`;
    }
    return `<w:p><w:pPr>${ppr}</w:pPr>${runsXml}</w:p>`;
  }

  /** ใส่รูป PNG — buf คือ Buffer, widthCm คือความกว้างที่ต้องการ */
  image(buf, widthCm, o) {
    o = o || {};
    const { w, h } = pngSize(buf);
    const id = this.images.length + 1;
    const name = `image${id}.png`;
    this.images.push({ name, data: buf });
    const cx = Math.round(widthCm * 360000);
    const cy = Math.round(cx * h / w);
    const rid = `rIdImg${id}`;
    const xml =
      `<w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">` +
      `<wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>` +
      `<wp:docPr id="${id}" name="${name}"/>` +
      `<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>` +
      `<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">` +
      `<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
      `<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
      `<pic:nvPicPr><pic:cNvPr id="${id}" name="${name}"/><pic:cNvPicPr/></pic:nvPicPr>` +
      `<pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
      `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>` +
      `<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>` +
      `</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing>`;
    if (o.inline) return `<w:r>${xml}</w:r>`;
    this.p(`<w:r>${xml}</w:r>`, { align: o.align || "center", after: o.after == null ? 40 : o.after });
    return this;
  }

  /* ---------- build ---------- */
  build() {
    const f = this.font;
    const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
      'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" ' +
      'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
      'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';

    const m = this.margin;
    const tw = (cm) => Math.round(cm * TW_PER_CM);
    const sect =
      `<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>` +
      `<w:pgMar w:top="${tw(m.top)}" w:right="${tw(m.right)}" w:bottom="${tw(m.bottom)}" w:left="${tw(m.left)}"` +
      ` w:header="708" w:footer="${tw(0.8)}" w:gutter="0"/>` +
      (this.footer ? `<w:footerReference w:type="default" r:id="rIdFooter"/>` : "") +
      `</w:sectPr>`;

    const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${NS}><w:body>${this.body.join("")}${sect}</w:body></w:document>`;

    const rf = `<w:rFonts w:ascii="${f}" w:hAnsi="${f}" w:cs="${f}" w:eastAsia="${f}"/>`;
    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles ${NS}>
<w:docDefaults><w:rPrDefault><w:rPr>${rf}<w:sz w:val="22"/><w:szCs w:val="22"/>
<w:lang w:val="en-US" w:eastAsia="th-TH" w:bidi="th-TH"/></w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:after="60" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/>
<w:rPr>${rf}<w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:style>
</w:styles>`;

    const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr ${NS}><w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="D9CFB8"/></w:pBdr>
<w:tabs><w:tab w:val="right" w:pos="${this.contentWidthTw}"/></w:tabs><w:spacing w:before="0" w:after="0"/></w:pPr>
<w:r><w:rPr>${rf}<w:sz w:val="15"/><w:szCs w:val="15"/><w:color w:val="8A7E66"/></w:rPr>
<w:t xml:space="preserve">${esc(this.footer)}</w:t></w:r>
<w:r><w:rPr><w:sz w:val="15"/></w:rPr><w:tab/></w:r>
<w:fldSimple w:instr=" PAGE "><w:r><w:rPr>${rf}<w:sz w:val="15"/><w:color w:val="8A7E66"/></w:rPr><w:t>1</w:t></w:r></w:fldSimple>
</w:p></w:ftr>`;

    const imgRels = this.images.map((im, i) =>
      `<Relationship Id="rIdImg${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${im.name}"/>`).join("");

    const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
${this.footer ? '<Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer.xml"/>' : ""}
${imgRels}</Relationships>`;

    const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
${this.footer ? '<Override PartName="/word/footer.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>' : ""}
</Types>`;

    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const files = [
      { name: "[Content_Types].xml", data: ct },
      { name: "_rels/.rels", data: rels },
      { name: "word/document.xml", data: document },
      { name: "word/styles.xml", data: styles },
      { name: "word/_rels/document.xml.rels", data: docRels },
    ];
    if (this.footer) files.push({ name: "word/footer.xml", data: footerXml });
    this.images.forEach((im) => files.push({ name: "word/media/" + im.name, data: im.data }));
    return zip(files);
  }
}

module.exports = { Doc, esc, pngSize, EMU_PER_PX, TW_PER_CM };

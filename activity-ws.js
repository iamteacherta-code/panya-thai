/* ============================================================
   PANYA · Activity / Worksheet shared builders
   Set window.WSMETA = { eyebrow, level, footTh } before this loads,
   then use window.WS.* to assemble sheets. Pairs with
   activity-base.css and activity-art.js.
   ============================================================ */
(function () {
  const art = window.artIcon || ((e) => e);
  const M = () => window.WSMETA || { eyebrow: "Worksheet", level: "Beginner · พื้นฐาน", footTh: "PANYA Thai Foundation" };
  const DOT = "◌";
  const mg = (m) => DOT + m;

  const LOGO = '<div class="sh-mark"><img src="images/panya-logo.png" alt="PANYA" '
    + 'onerror="this.style.display=\'none\';this.parentNode.innerHTML=\'<div class=&quot;fallback&quot;>P</div>\'"></div>';

  function head(no, kind, en, th) {
    const m = M();
    return '<header class="sh-head"><div class="sh-brand">' + LOGO
      + '<div><div class="bn">PANYA</div><div class="bs">Thai Foundation</div></div></div>'
      + '<div class="sh-meta"><div class="sh-tag-row">'
      + '<span class="eyebrow">' + m.eyebrow + '</span>'
      + '<span class="badge ' + (m.levelClass || '') + '">' + m.level + '</span>'
      + '<span class="badge earth">หน้า ' + no + ' · ' + kind + '</span></div>'
      + '<div class="sh-title">' + en + (th ? ' <span class="th">· ' + th + '</span>' : '') + '</div></div>'
      + '<div class="sh-fields">'
      + '<div class="fld">ชื่อ <span class="th">Name</span> <span class="ln"></span></div>'
      + '<div class="fld small">วันที่ <span class="th">Date</span> <span class="ln"></span>'
      + '&nbsp;ห้อง <span class="th">Class</span> <span class="ln"></span></div></div></header>';
  }
  function instruct(n, en, th) {
    return '<div class="instruct"><span class="n">' + n + '</span><span><b>' + en + '</b> '
      + '<span class="th">' + th + '</span></span></div>';
  }
  function foot() {
    return '<footer class="sh-foot"><span class="th">' + M().footTh + '</span>'
      + '<span class="star-row">ระบายดาวเมื่อทำเสร็จ <span class="star"></span><span class="star"></span><span class="star"></span></span></footer>';
  }
  function sheet(no, inner) { return '<section class="sheet" id="s' + no + '">' + inner + '</section>'; }
  function extra(th) {
    return '<div class="extra"><div class="ex-head">✏️ ฝึกต่อ · Practice more '
      + '<span class="th">— ' + (th || 'เขียนคำที่หนูชอบ 2 คำ แล้ววาดภาพประกอบ') + '</span></div>'
      + '<div class="ex-space"></div>'
      + '<div class="ex-lines"><span class="l"></span><span class="l"></span></div></div>';
  }
  const wall = (words) => '<div class="wordwall">' + words.map((w) => '<span class="w">' + w + '</span>').join('') + '</div>';
  const KEY = '<div class="keybar">'
    + '<span class="k"><span class="sw c"></span> พยัญชนะ</span>'
    + '<span class="k"><span class="sw v"></span> สระ</span>'
    + '<span class="k"><span class="sw f"></span> ตัวสะกด</span>'
    + '<span class="k"><span class="sw t"></span> วรรณยุกต์</span></div>';

  /* ---- trace row ---- */
  function trow(o) {
    const n = o.n || 5, fs = o.fs || 46;
    let cells = '';
    for (let i = 0; i < n; i++) cells += '<div class="tcell" style="--fs:' + fs + 'px"><span class="g' + (o.clay ? ' clay' : '') + '">' + o.ghost + '</span></div>';
    const tail = (o.tailPic || o.tailWord || o.tailRom)
      ? '<div class="tail">' + (o.tailPic ? '<span class="pic emoji">' + art(o.tailPic) + '</span>' : '')
        + (o.tailWord ? '<span class="tw">' + o.tailWord + '</span>' : '')
        + (o.tailRom ? '<span class="tr">' + o.tailRom + '</span>' : '') + '</div>'
      : '';
    return '<div class="trow"><div class="lead"><span class="m">' + o.lead + '</span>'
      + (o.kw ? '<span class="kw">' + o.kw + '</span>' : '') + '</div>'
      + '<div class="cells" style="grid-template-columns:repeat(' + n + ',1fr)">' + cells + '</div>' + tail + '</div>';
  }
  function traceSheet(no, kind, en, th, intrEn, intrTh, rows, opts) {
    opts = opts || {};
    return sheet(no, head(no, kind, en, th) + instruct(1, intrEn, intrTh)
      + (opts.note ? '<div class="note-th">' + opts.note + '</div>' : '')
      + rows.map((r) => trow(Object.assign({ n: opts.n, fs: opts.fs, clay: opts.clay }, r))).join('') + extra(opts.extra) + foot());
  }

  /* ---- blend / eq ---- */
  function eqRow(r) {
    const tiles = r.parts.map((p, i) => (i ? '<span class="op">+</span>' : '')
      + '<span class="tile' + (p.k === 'c' ? '' : ' ' + p.k) + '">' + p.s + '</span>').join('');
    const box = r.ex ? '<div class="eqbox"><span class="ans">' + r.ans + '</span></div>' : '<div class="eqbox"></div>';
    return '<div class="eq">' + (r.e ? '<span class="emoji">' + art(r.e) + '</span>' : '<span class="emoji"></span>')
      + tiles + '<span class="op">=</span>' + box + '<span class="gloss">' + r.g + '</span></div>';
  }
  function eqSheet(no, kind, en, th, intrEn, intrTh, rows, opts) {
    opts = opts || {};
    return sheet(no, head(no, kind, en, th) + (opts.key ? KEY : '') + instruct(1, intrEn, intrTh)
      + (opts.note ? '<div class="note-th">' + opts.note + '</div>' : '')
      + '<div class="eqlist">' + rows.map(eqRow).join('') + '</div>' + extra(opts.extra) + foot());
  }

  /* ---- choose / circle ---- */
  function chooseSheet(no, kind, en, th, intrEn, intrTh, items, opts) {
    opts = opts || {};
    const body = items.map((it) =>
      '<div class="ch-item">' + (it.e ? '<span class="emoji">' + art(it.e) + '</span>' : '')
      + (it.base ? '<span class="base">' + it.base + '</span>' : '')
      + (it.meaning ? '<span class="meaning">' + it.meaning + '</span>' : '')
      + '<div class="ch-opts">' + it.opts.map((o) => '<span class="opt' + (opts.round ? ' round' : '') + '">' + o + '</span>').join('') + '</div>'
      + (opts.wbox ? '<span class="wbox"></span>' : '') + '</div>').join('');
    return sheet(no, head(no, kind, en, th) + instruct(1, intrEn, intrTh)
      + (opts.note ? '<div class="note-th">' + opts.note + '</div>' : '')
      + '<div class="choose">' + body + '</div>' + extra(opts.extra) + foot());
  }

  /* ---- line match (left/right are arrays of inner HTML) ---- */
  function matchSheet(no, kind, en, th, intrTh, leftArr, rightArr, opts) {
    opts = opts || {};
    const left = leftArr.map((h) => '<div class="mitem"><span>' + h + '</span><span class="node nR"></span></div>').join('');
    const right = rightArr.map((h) => '<div class="mitem"><span class="node nL"></span><span>' + h + '</span></div>').join('');
    return sheet(no, head(no, kind, en, th) + instruct(1, opts.intrEn || 'Draw a line', intrTh)
      + (opts.note ? '<div class="note-th">' + opts.note + '</div>' : '')
      + '<div class="match"><div class="mcol left">' + left + '</div><div class="mcol right">' + right + '</div></div>'
      + extra(opts.extra) + foot());
  }

  /* ---- buckets / sort ---- */
  function bucketSheet(no, kind, en, th, intrTh, bank, buckets, opts) {
    opts = opts || {};
    const b = bank && bank.length
      ? '<div class="bank"><span class="bk-lbl">คำให้เลือก · word bank</span>' + bank.map((w) => '<span class="chip">' + w + '</span>').join('') + '</div>'
      : '';
    const cells = buckets.map((bk) =>
      '<div class="bucket"><div class="bhead">' + (bk.m ? '<span class="mk">' + mg(bk.m) + '</span>' : '') + bk.name + '</div><div class="bbody"></div></div>').join('');
    return sheet(no, head(no, kind, en, th) + instruct(1, opts.intrEn || 'Sort the words', intrTh)
      + (opts.note ? '<div class="note-th">' + opts.note + '</div>' : '')
      + b + '<div class="buckets" style="grid-template-columns:repeat(' + buckets.length + ',1fr)">' + cells + '</div>'
      + extra(opts.extra) + foot());
  }

  /* ---- dictation (numbered baseline boxes; optional pictures) ---- */
  function dictSheet(no, kind, en, th, intrEn, intrTh, opts) {
    opts = opts || {};
    const count = opts.count || 8;
    const teacher = opts.teacher ? '<div class="teacher"><b>สำหรับครู · teacher:</b> ' + opts.teacher + '</div>' : '';
    let cells = '';
    if (opts.pics) {
      cells = opts.pics.map((e, i) => '<div class="dict"><span class="num">' + (i + 1) + '</span><span class="pic emoji">' + art(e) + '</span><div class="wbox"></div></div>').join('');
    } else {
      for (let i = 1; i <= count; i++) cells += '<div class="dict"><span class="num">' + i + '</span><div class="wbox"></div></div>';
    }
    return sheet(no, head(no, kind, en, th) + instruct(1, intrEn, intrTh)
      + teacher + '<div class="dict-grid">' + cells + '</div>' + extra(opts.extra) + foot());
  }

  /* ---- generic custom sheet (compose your own body) ---- */
  function custom(no, kind, en, th, body) {
    return sheet(no, head(no, kind, en, th) + body + foot());
  }

  function render(sheets) { document.getElementById('sheets').innerHTML = sheets.join(''); }
  function autoprint() { if (new URLSearchParams(location.search).has('print')) window.addEventListener('load', () => window.print()); }

  window.WS = { art, mg, DOT, head, instruct, foot, sheet, extra, wall, KEY,
    trow, traceSheet, eqRow, eqSheet, chooseSheet, matchSheet, bucketSheet, dictSheet, custom, render, autoprint };
})();

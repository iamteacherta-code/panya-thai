/* เสียงคุณครูจาก Reading Club — ใช้ไฟล์เดียวกับเว็บ Thai Reading Club
   ไม่ต้องอัดซ้ำในเว็บนี้ อัดที่ห้องอัดเสียงของ Reading Club ที่เดียว แล้วทุกหน้าได้ยินเหมือนกัน

   ดัชนีเสียง: GET /api/audio  →  { "l05/1": { v, duration, voiced: [[เริ่ม, จบ], ...] } }
   ไฟล์เสียง : GET /api/audio/l05/1?v=...  (mp3 ของทั้งเรื่อง คุณครูอ่านชื่อเรื่องนำก่อน)

   จังหวะตัวหนังสือ: ใช้วิธีเดียวกับ Reading Club — "ปัก" จุดจบของแต่ละบรรทัดไว้กับช่วงที่คุณครู
   หยุดหายใจจริง ๆ แล้วไล่ตัวอักษรระหว่างจุดที่ปักไว้ตามเวลาที่พูดจริง (ไม่นับช่วงเงียบ) */
(function () {
  "use strict";

  var BASE = "https://thai-reading-club.thai-reading-club.workers.dev";
  var OUTPUT_DELAY = 0.12; // เสียงออกลำโพงช้ากว่าเวลาในไฟล์เล็กน้อย
  var SNAP = 1.5;          // ช่วงเงียบต้องอยู่ใกล้จุดที่คาดไม่เกินนี้ (วินาที) จึงนับเป็นจุดจบบรรทัด

  var index = null, pending = null;

  /* โหลดดัชนีเสียงครั้งเดียวต่อการเปิดหน้า · โหลดไม่ได้ก็คืนดัชนีว่าง หน้าเว็บยังใช้งานได้ตามปกติ */
  function load() {
    if (index) return Promise.resolve(index);
    if (pending) return pending;
    pending = fetch(BASE + "/api/audio", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (data) { index = data || {}; pending = null; return index; });
    return pending;
  }

  function clip(levelId, no) {
    return (index && index[levelId + "/" + no]) || null;
  }
  function clipUrl(levelId, no, info) {
    return BASE + "/api/audio/" + levelId + "/" + no + (info && info.v ? "?v=" + info.v : "");
  }

  /* นับตัวอักษรแบบเดียวกับ Reading Club — ไม่นับสระบน/ล่างและวรรณยุกต์ ให้ความยาวใกล้เวลาพูดจริง */
  function countChars(text) {
    return String(text).replace(/[ัิ-ฺ็-๎ำา]/g, "").replace(/[^ก-ฮเ-ไa-zA-Z0-9]/g, "").length;
  }

  function spokenUntil(t, voiced) {
    var sum = 0;
    for (var i = 0; i < voiced.length; i++) sum += Math.max(0, Math.min(voiced[i][1], t) - voiced[i][0]);
    return sum;
  }
  function timeAtSpoken(s, voiced) {
    var need = s;
    for (var i = 0; i < voiced.length; i++) {
      var a = voiced[i][0], b = voiced[i][1];
      if (need <= b - a) return a + need;
      need -= b - a;
    }
    return voiced.length ? voiced[voiced.length - 1][1] : 0;
  }

  /* สร้างตัวแปลง เวลาในไฟล์ → ตำแหน่งตัวอักษรที่อ่านถึง
     lineChars = จำนวนตัวอักษรของแต่ละบรรทัด (บรรทัดแรกคือชื่อเรื่องที่คุณครูอ่านนำ) */
  function makeSync(lineChars, voiced, duration) {
    var segments = (voiced && voiced.length) ? voiced : [[0, duration || 0]];
    var total = 0;
    for (var i = 0; i < lineChars.length; i++) total += lineChars[i];
    if (!total) total = 1;
    var spokenTotal = spokenUntil(Infinity, segments) || 1;

    var pauses = [];
    for (var k = 1; k < segments.length; k++) pauses.push({ start: segments[k - 1][1], end: segments[k][0], used: false });

    var anchors = [[0, 0]], at = 0;
    for (var li = 0; li < lineChars.length - 1; li++) {
      at += lineChars[li];
      var predicted = timeAtSpoken(at / total * spokenTotal, segments);
      var last = anchors[anchors.length - 1][0], best = null;
      for (var p = 0; p < pauses.length; p++) {
        var pause = pauses[p];
        if (pause.used || spokenUntil(pause.start, segments) <= last) continue;
        var mid = (pause.start + pause.end) / 2;
        if (Math.abs(mid - predicted) <= SNAP && (!best || Math.abs(mid - predicted) < Math.abs((best.start + best.end) / 2 - predicted))) best = pause;
      }
      if (best) { best.used = true; anchors.push([spokenUntil(best.start, segments), at]); }
    }
    anchors.push([spokenTotal, total]);

    return {
      total: total,
      // เวลา → ตำแหน่งตัวอักษร
      toPos: function (time) {
        var s = spokenUntil(time - OUTPUT_DELAY, segments);
        for (var i = 1; i < anchors.length; i++) {
          var s0 = anchors[i - 1][0], p0 = anchors[i - 1][1], s1 = anchors[i][0], p1 = anchors[i][1];
          if (s <= s1) return s1 > s0 ? p0 + (p1 - p0) * (s - s0) / (s1 - s0) : p1;
        }
        return total;
      },
      // ตำแหน่งตัวอักษร → เวลาในไฟล์ (ใช้ตอนกดเล่นต่อจากคำที่ค้างไว้)
      toTime: function (pos) {
        for (var i = 1; i < anchors.length; i++) {
          var s0 = anchors[i - 1][0], p0 = anchors[i - 1][1], s1 = anchors[i][0], p1 = anchors[i][1];
          if (pos <= p1) return timeAtSpoken(p1 > p0 ? s0 + (s1 - s0) * (pos - p0) / (p1 - p0) : s1, segments);
        }
        return timeAtSpoken(spokenTotal, segments);
      },
    };
  }

  window.CLUB_AUDIO = { load: load, clip: clip, clipUrl: clipUrl, countChars: countChars, makeSync: makeSync, base: BASE };
})();

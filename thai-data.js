/* ============================================================
   Thai language data for the Blending Board (กระดานประสมคำ)
   Exposes window.THAI = { consonants, vowels, tones, buildSyllable, ... }
   ============================================================ */
(function () {
  // ---- Consonants (พยัญชนะ) ----------------------------------
  // class: H = high (สูง), M = mid (กลาง), L = low (ต่ำ)
  // rare: obsolete letters (ฃ ฅ) — only shown in the "All" set
  const consonants = [
    { ch: "ก", name: "ไก่",     rom: "g",  cls: "M" },
    { ch: "ข", name: "ไข่",     rom: "kh", cls: "H" },
    { ch: "ฃ", name: "ขวด",    rom: "kh", cls: "H", rare: true },
    { ch: "ค", name: "ควาย",   rom: "kh", cls: "L" },
    { ch: "ฅ", name: "คน",      rom: "kh", cls: "L", rare: true },
    { ch: "ฆ", name: "ระฆัง",   rom: "kh", cls: "L" },
    { ch: "ง", name: "งู",       rom: "ng", cls: "L" },
    { ch: "จ", name: "จาน",     rom: "j",  cls: "M" },
    { ch: "ฉ", name: "ฉิ่ง",     rom: "ch", cls: "H" },
    { ch: "ช", name: "ช้าง",     rom: "ch", cls: "L" },
    { ch: "ซ", name: "โซ่",      rom: "s",  cls: "L" },
    { ch: "ฌ", name: "เฌอ",     rom: "ch", cls: "L" },
    { ch: "ญ", name: "หญิง",    rom: "y",  cls: "L" },
    { ch: "ฎ", name: "ชฎา",     rom: "d",  cls: "M" },
    { ch: "ฏ", name: "ปฏัก",    rom: "t",  cls: "M" },
    { ch: "ฐ", name: "ฐาน",     rom: "th", cls: "H" },
    { ch: "ฑ", name: "มณโฑ",    rom: "th", cls: "L" },
    { ch: "ฒ", name: "ผู้เฒ่า",   rom: "th", cls: "L" },
    { ch: "ณ", name: "เณร",     rom: "n",  cls: "L" },
    { ch: "ด", name: "เด็ก",     rom: "d",  cls: "M" },
    { ch: "ต", name: "เต่า",     rom: "t",  cls: "M" },
    { ch: "ถ", name: "ถุง",      rom: "th", cls: "H" },
    { ch: "ท", name: "ทหาร",    rom: "th", cls: "L" },
    { ch: "ธ", name: "ธง",       rom: "th", cls: "L" },
    { ch: "น", name: "หนู",      rom: "n",  cls: "L" },
    { ch: "บ", name: "ใบไม้",    rom: "b",  cls: "M" },
    { ch: "ป", name: "ปลา",     rom: "p",  cls: "M" },
    { ch: "ผ", name: "ผึ้ง",      rom: "ph", cls: "H" },
    { ch: "ฝ", name: "ฝา",       rom: "f",  cls: "H" },
    { ch: "พ", name: "พาน",     rom: "ph", cls: "L" },
    { ch: "ฟ", name: "ฟัน",      rom: "f",  cls: "L" },
    { ch: "ภ", name: "สำเภา",   rom: "ph", cls: "L" },
    { ch: "ม", name: "ม้า",      rom: "m",  cls: "L" },
    { ch: "ย", name: "ยักษ์",    rom: "y",  cls: "L" },
    { ch: "ร", name: "เรือ",     rom: "r",  cls: "L" },
    { ch: "ล", name: "ลิง",      rom: "l",  cls: "L" },
    { ch: "ว", name: "แหวน",    rom: "w",  cls: "L" },
    { ch: "ศ", name: "ศาลา",    rom: "s",  cls: "H" },
    { ch: "ษ", name: "ฤๅษี",     rom: "s",  cls: "H" },
    { ch: "ส", name: "เสือ",     rom: "s",  cls: "H" },
    { ch: "ห", name: "หีบ",      rom: "h",  cls: "H" },
    { ch: "ฬ", name: "จุฬา",     rom: "l",  cls: "L" },
    { ch: "อ", name: "อ่าง",     rom: "(อ)", cls: "M" },
    { ch: "ฮ", name: "นกฮูก",   rom: "h",  cls: "L" },
  ];

  // A common, frequently-taught starter set (good for younger learners)
  const COMMON_CONS = "ก ข ค ง จ ช ด ต ท น บ ป ผ พ ฟ ม ย ร ล ว ส ห อ".split(" ");

  // Teaching order of the three consonant classes (easy -> hard)
  const CLASS_ORDER = [
    { cls: "M", en: "Mid class", th: "อักษรกลาง", cat: "mid" },
    { cls: "H", en: "High class", th: "อักษรสูง", cat: "high" },
    { cls: "L", en: "Low class", th: "อักษรต่ำ", cat: "low" },
  ];

  // ---- Vowels (สระ) ------------------------------------------
  // Each vowel is rendered around a base consonant using parts:
  //   before : characters placed BEFORE the consonant (e.g. เ แ โ ใ ไ)
  //   above  : combining mark above/below the consonant (e.g. ◌ิ ◌ี ◌ุ ◌ู ◌ั)
  //   after  : characters placed AFTER the consonant (e.g. ะ า อ)
  // Display template uses ◌ (U+25CC dotted circle) as the consonant slot.
  const DOT = "\u25CC";
  const vowels = [
    // --- short ---
    { id: "a",   before: "", above: "", after: "\u0E30", rom: "a",  len: "short", set: "basic" },   // ะ
    { id: "i",   before: "", above: "\u0E34", after: "", rom: "i",  len: "short", set: "basic" },   // ◌ิ
    { id: "ue",  before: "", above: "\u0E36", after: "", rom: "ue", len: "short", set: "ext" },     // ◌ึ
    { id: "u",   before: "", above: "\u0E38", after: "", rom: "u",  len: "short", set: "basic" },   // ◌ุ
    { id: "e_s", before: "\u0E40", above: "", after: "\u0E30", rom: "e",  len: "short", set: "ext" }, // เ◌ะ
    { id: "ae_s",before: "\u0E41", above: "", after: "\u0E30", rom: "ae", len: "short", set: "ext" }, // แ◌ะ
    { id: "o_s", before: "\u0E42", above: "", after: "\u0E30", rom: "o",  len: "short", set: "ext" }, // โ◌ะ
    { id: "aw_s",before: "\u0E40", above: "", after: "\u0E32\u0E30", rom: "aw", len: "short", set: "ext" }, // เ◌าะ
    // --- long ---
    { id: "aa",  before: "", above: "", after: "\u0E32", rom: "aa", len: "long", set: "basic" },    // า
    { id: "ii",  before: "", above: "\u0E35", after: "", rom: "ii", len: "long", set: "basic" },    // ◌ี
    { id: "uue", before: "", above: "\u0E37", after: "\u0E2D", rom: "ue", len: "long", set: "ext" },// ◌ือ
    { id: "uu",  before: "", above: "\u0E39", after: "", rom: "uu", len: "long", set: "basic" },    // ◌ู
    { id: "e",   before: "\u0E40", above: "", after: "", rom: "e",  len: "long", set: "basic" },    // เ◌
    { id: "ae",  before: "\u0E41", above: "", after: "", rom: "ae", len: "long", set: "basic" },    // แ◌
    { id: "o",   before: "\u0E42", above: "", after: "", rom: "o",  len: "long", set: "basic" },    // โ◌
    { id: "aw",  before: "", above: "", after: "\u0E2D", rom: "aw", len: "long", set: "basic" },    // ◌อ
    { id: "oe",  before: "\u0E40", above: "", after: "\u0E2D", rom: "oe", len: "long", set: "ext" },// เ◌อ
    // --- diphthongs / special ---
    { id: "ia",  before: "\u0E40", above: "\u0E35", after: "\u0E22", rom: "ia",  len: "long", set: "ext" },  // เ◌ีย
    { id: "uea", before: "\u0E40", above: "\u0E37", after: "\u0E2D", rom: "uea", len: "long", set: "ext" },  // เ◌ือ
    { id: "ua",  before: "", above: "\u0E31", after: "\u0E27", rom: "ua", len: "long", set: "ext" },         // ◌ัว
    { id: "am",  before: "", above: "", after: "\u0E33", rom: "am", len: "short", set: "basic" },   // ◌ำ
    { id: "ai1", before: "\u0E43", above: "", after: "", rom: "ai", len: "short", set: "basic" },   // ใ◌
    { id: "ai2", before: "\u0E44", above: "", after: "", rom: "ai", len: "short", set: "basic" },   // ไ◌
    { id: "ao",  before: "\u0E40", above: "", after: "\u0E32", rom: "ao", len: "short", set: "basic" }, // เ◌า
  ];

  // category of each vowel: long / short / dip(hthong) / special
  const VOWEL_CAT = {
    aa: "long", ii: "long", uu: "long", uue: "long", e: "long", ae: "long", o: "long", aw: "long", oe: "long",
    a: "short", i: "short", ue: "short", u: "short", e_s: "short", ae_s: "short", o_s: "short", aw_s: "short",
    ia: "dip", uea: "dip", ua: "dip",
    am: "special", ai1: "special", ai2: "special", ao: "special",
  };
  vowels.forEach((v) => { v.cat = VOWEL_CAT[v.id] || "long"; });

  // ---- Final consonants / มาตราตัวสะกด (8 มาตรา) ----------------
  // Each มาตรา shows a representative final letter; live = sonorant (easier).
  const finals = [
    { id: "none", ch: "",  maatra: "ไม่มีตัวสะกด", en: "แม่ ก กา", rom: "",   live: true,  also: "" },
    { id: "kong", ch: "ง", maatra: "แม่กง",  en: "-ng", rom: "ng", live: true,  also: "ง" },
    { id: "kon",  ch: "น", maatra: "แม่กน",  en: "-n",  rom: "n",  live: true,  also: "น ณ ญ ร ล ฬ" },
    { id: "kom",  ch: "ม", maatra: "แม่กม",  en: "-m",  rom: "m",  live: true,  also: "ม" },
    { id: "koei", ch: "ย", maatra: "แม่เกย", en: "-i",  rom: "i",  live: true,  also: "ย" },
    { id: "koew", ch: "ว", maatra: "แม่เกอว", en: "-o", rom: "o",  live: true,  also: "ว" },
    { id: "kok",  ch: "ก", maatra: "แม่กก",  en: "-k",  rom: "k",  live: false, also: "ก ข ค ฆ" },
    { id: "kot",  ch: "ด", maatra: "แม่กด",  en: "-t",  rom: "t",  live: false, also: "ด จ ต ถ ท ธ ส" },
    { id: "kop",  ch: "บ", maatra: "แม่กบ",  en: "-p",  rom: "p",  live: false, also: "บ ป พ ฟ ภ" },
  ];

  // ---- Initial consonant clusters (พยัญชนะต้นควบกล้ำ) ---------
  const clusters = [
    { ch: "กร", rom: "gr" },  { ch: "กล", rom: "gl" },  { ch: "กว", rom: "gw" },
    { ch: "ขร", rom: "khr" }, { ch: "ขล", rom: "khl" }, { ch: "ขว", rom: "khw" },
    { ch: "คร", rom: "khr" }, { ch: "คล", rom: "khl" }, { ch: "คว", rom: "khw" },
    { ch: "ตร", rom: "tr" },  { ch: "ปร", rom: "pr" },  { ch: "ปล", rom: "pl" },
    { ch: "ผล", rom: "phl" }, { ch: "พร", rom: "phr" }, { ch: "พล", rom: "phl" },
  ];

  // ---- Teaching levels (การไล่ระดับความยาก / Scaffolding) ----
  // Mirrors the UFLI progression adapted for Thai syllable structure.
  const LEVELS = [
    { id: "beginner",     en: "Beginner",     th: "พื้นฐาน", note: "พยัญชนะเดี่ยว + สระเสียงยาว",
      vowelCats: ["long"],                              finals: false, tones: false, clusters: false },
    { id: "intermediate", en: "Intermediate", th: "ปานกลาง", note: "+ สระเสียงสั้น และตัวสะกด (แม่ ก กา → เกย)",
      vowelCats: ["long", "short"],                     finals: true,  tones: false, clusters: false },
    { id: "advanced",     en: "Advanced",     th: "ขั้นสูง", note: "+ วรรณยุกต์ สระประสม และคำควบกล้ำ",
      vowelCats: ["long", "short", "dip", "special"],   finals: true,  tones: true,  clusters: true },
  ];

  // ---- Word Chains (ชุดคำฝึก / Blending Drill) ---------------
  // Each step changes ONE position — the heart of the UFLI blending drill.
  // Components are specified (not raw strings) so they load cleanly onto the board.
  const WORD_CHAINS = [
    { id: "swap-init", en: "Change the initial", th: "เปลี่ยนพยัญชนะต้น", level: "beginner",
      words: [{ i: "ก", v: "aa" }, { i: "ข", v: "aa" }, { i: "ต", v: "aa" }, { i: "ม", v: "aa" }] },
    { id: "swap-vow", en: "Change the vowel", th: "เปลี่ยนสระ", level: "beginner",
      words: [{ i: "ม", v: "aa" }, { i: "ม", v: "ii" }, { i: "ม", v: "uu" }, { i: "ม", v: "e" }] },
    { id: "add-final", en: "Add a final", th: "เติมตัวสะกด", level: "intermediate",
      words: [{ i: "ก", v: "aa" }, { i: "ก", v: "aa", f: "kong" }, { i: "ก", v: "aa", f: "kon" }, { i: "ก", v: "aa", f: "kot" }] },
    { id: "add-tone", en: "Change the tone", th: "ผันวรรณยุกต์", level: "advanced",
      words: [{ i: "ต", v: "aa" }, { i: "ต", v: "aa", t: "ek" }, { i: "ต", v: "aa", t: "tho" }] },
  ];

  // ---- Word Work Mat — by grade (แผ่นฝึกคำ แยกตามระดับชั้น) ----
  // One mat whose grapheme inventory scales with the selected grade
  // (K2 → Y3). Easier grades expose fewer consonants/vowels and lock
  // finals & tones; harder grades unlock the full system + clusters.
  // Each grade has CV and CVC modes. Grapheme counts follow the
  // "Foundation of Systematic Thai Language Learning" spec.
  // Cumulative consonant sets per grade (introduced in teaching order).
  // Every grade exposes ONLY its own defined set — never the full alphabet,
  // except the top grade (Y3). Each set builds on the one before it.
  const SET_K2 = "ก จ ด ต บ ป อ ม น".split(" ");                          // 9  (mid core + ม น)
  const SET_K3 = "ก ข ค จ ด ต บ ป ผ พ ม ย ร ล ว ส ห อ".split(" ");        // 18
  const SET_Y1 = COMMON_CONS.slice();                                     // 23 (frequent letters)
  const SET_Y2 = consonants.filter((c) => !c.rare).map((c) => c.ch);      // 42 (all but obsolete ฃ ฅ)
  const SET_Y3 = consonants.map((c) => c.ch);                             // 44 (complete)

  const GRADES = {
    k2: {
      id: "k2", en: "K2", th: "อนุบาล 2", grade: "K2",
      note: "พยัญชนะกลุ่มแรก 9 ตัว + สระเสียงยาว · วาง 1 พยัญชนะ + 1 สระ",
      modes: {
        cv: {
          cons: SET_K2,
          vowels: ["aa", "e", "ii", "uu"],
          finals: null, tones: false,
        },
        cvc: {
          cons: "ก ด ต บ ม น".split(" "),
          vowels: ["aa", "ii", "uu"],
          finals: ["kong", "kon", "kom"], tones: false,
        },
      },
    },
    k3: {
      id: "k3", en: "K3", th: "อนุบาล 3", grade: "K3",
      note: "พยัญชนะ 18 ตัว + สระรูปเดียว · วาง 1 พยัญชนะ + 1 สระ",
      modes: {
        cv: {
          cons: SET_K3,
          vowels: ["aa", "e", "ii", "uu"],
          finals: null, tones: false,
        },
        cvc: {
          cons: "ก ด ต บ ป ม น".split(" "),
          vowels: ["aa", "ii", "uu", "e"],
          finals: ["kong", "kon", "kom"], tones: false,
        },
      },
    },
    y1: {
      id: "y1", en: "Y1", th: "ประถม 1", grade: "Y1",
      note: "พยัญชนะที่พบบ่อย 23 ตัว + สระหลายรูป + ตัวสะกดเสียงก้อง",
      modes: {
        cv: {
          cons: SET_Y1,
          vowels: ["aa", "e", "ae", "o", "ai2", "ai1", "i", "ii", "u", "uu"],
          finals: null, tones: false, clusters: false,
        },
        cvc: {
          cons: SET_Y1,
          vowels: ["aa", "e", "ae", "o", "i", "ii", "u", "uu", "ue", "uue", "aw"],
          finals: ["kong", "kon", "kom", "koei", "koew"], tones: false, clusters: false,
        },
      },
    },
    y2: {
      id: "y2", en: "Y2", th: "ประถม 2", grade: "Y2",
      note: "พยัญชนะ 42 ตัว + สระเปลี่ยนรูป + 8 มาตราตัวสะกด + วรรณยุกต์",
      modes: {
        cv: {
          cons: SET_Y2,
          vowels: ["aa", "e", "ae", "o", "ai2", "ai1", "i", "ii", "ue", "uue", "u", "uu", "aw", "aw_s"],
          finals: null, tones: false, clusters: false,
        },
        cvc: {
          cons: SET_Y2,
          vowels: ["aa", "e", "ae", "o", "ai2", "ai1", "i", "ii", "ue", "uue", "u", "uu", "aw", "aw_s"],
          finals: ["kok", "kot", "kop", "kong", "kom", "koei", "koew", "kon"],
          tones: true, clusters: false,
        },
      },
    },
    y3: {
      id: "y3", en: "Y3", th: "ประถม 3", grade: "Y3",
      note: "ครบ 44 ตัว + คำควบกล้ำ + สระประสม + ผันวรรณยุกต์เต็มรูปแบบ",
      modes: {
        cv: {
          cons: SET_Y3,
          vowels: "all",
          finals: null, tones: false, clusters: true,
        },
        cvc: {
          cons: SET_Y3,
          vowels: "all",
          finals: ["kok", "kot", "kop", "kong", "kom", "koei", "koew", "kon"],
          tones: true, clusters: true,
        },
      },
    },
  };
  // dropdown order (easy → hard) — drives the per-grade Lessons menu
  const GRADE_ORDER = ["k2", "k3", "y1", "y2", "y3"];

  // ---- Word Work Mat levels (decoupled from the Lessons grade list) ----
  // The mat has its own two-level scaffold, picked from the "Word Work Mat ▾"
  // nav menu. Beginner builds on the frequent letters with no tones yet;
  // Intermediate unlocks the full consonant set, more vowels, the 8 finals
  // and tone marks. Y3-level work (clusters, สระประสม, full tone drills)
  // lives on the Blending Board, so it is intentionally not offered here.
  GRADES.beginner = Object.assign({}, GRADES.y1, {
    id: "beginner", en: "Beginner", th: "เริ่มต้น", grade: "Beginner", badge: "B",
    note: "พยัญชนะที่พบบ่อย + สระหลายรูป + ตัวสะกดเสียงก้อง (ยังไม่มีวรรณยุกต์)",
  });
  GRADES.intermediate = Object.assign({}, GRADES.y2, {
    id: "intermediate", en: "Intermediate", th: "ปานกลาง", grade: "Intermediate", badge: "I",
    note: "พยัญชนะครบ + สระเปลี่ยนรูป + 8 มาตราตัวสะกด + วรรณยุกต์",
  });
  const MAT_LEVELS = ["beginner", "intermediate"];

  // ---- Tones (วรรณยุกต์) -------------------------------------
  const tones = [
    { id: "none", mark: "",        name: "สามัญ",     th: "ไม่มีรูป", rom: "" },
    { id: "ek",   mark: "\u0E48",  name: "ไม้เอก",    th: "เอก",     rom: "\u00E8" },   // ่
    { id: "tho",  mark: "\u0E49",  name: "ไม้โท",     th: "โท",      rom: "\u00EA" },   // ้
    { id: "tri",  mark: "\u0E4A",  name: "ไม้ตรี",    th: "ตรี",     rom: "\u0301" },   // ๊
    { id: "chat", mark: "\u0E4B",  name: "ไม้จัตวา",  th: "จัตวา",   rom: "\u030C" },   // ๋
  ];

  // ---- Builders ----------------------------------------------
  // Template shown on a vowel KEY (uses dotted-circle placeholder)
  function vowelTemplate(v) {
    const base = v.above ? DOT + v.above : DOT;
    return v.before + base + v.after;
  }
  // Template shown on a tone KEY
  function toneTemplate(t) {
    return t.mark ? DOT + t.mark : DOT;
  }
  // Template shown on a final-consonant KEY
  function finalTemplate(f) {
    return f.ch ? DOT + f.ch : DOT;
  }
  // Bare glyphs (no dotted-circle placeholder) for clean tile display.
  // Combining marks need *something* to sit on, so we use a non-breaking
  // space (invisible) as a neutral stand-in for the consonant slot —
  // no circle, no dash, just the mark in its natural position.
  function vowelBare(v) {
    const carrier = v.above ? "\u00A0" : "";
    return v.before + carrier + v.above + v.after;
  }
  function toneBare(t) {
    return t.mark ? "\u00A0" + t.mark : "";
  }
  // Build the full combined syllable string in correct Unicode order:
  //   before + initial + above/below + tone + after + final
  function buildSyllable(initialChar, vowel, tone, finalChar) {
    const c = initialChar || DOT;
    const v = vowel || { before: "", above: "", after: "" };
    const tmark = (tone && tone.mark) || "";
    const fin = finalChar || "";
    return v.before + c + v.above + tmark + v.after + fin;
  }
  // Consonants with a low "เชิง" (descender loop). When stacked with a below
  // vowel (◌ุ ◌ู) the glyph drops very low and looks cramped, so the big word
  // display shrinks a little for these so the whole stack sits comfortably.
  const LOW_FOOT_CONS = "ญ ฐ ฏ ฎ".split(" ");
  function displayScale(initialChar, vowel) {
    if (!initialChar || !vowel) return 1;
    const belowVowel = vowel.id === "u" || vowel.id === "uu";
    const lowFoot = LOW_FOOT_CONS.some((ch) => initialChar.indexOf(ch) >= 0);
    return (belowVowel && lowFoot) ? 0.8 : 1;
  }
  // Optical vertical centering for the big word display. The browser centres
  // the font *line-box* (which always reserves the full ascent), so syllables
  // with below vowels / descenders sink low and look off-centre. We measure the
  // glyph's real ink box and return a translateY (in em) that re-centres the
  // actual ink on the board — automatically balanced for every vowel shape.
  const _offCache = {};
  let _offCtx;
  function displayOffset(word) {
    if (!word) return 0;
    if (word in _offCache) return _offCache[word];
    try {
      if (!_offCtx) _offCtx = document.createElement("canvas").getContext("2d");
      const F = 200;
      _offCtx.font = '500 ' + F + 'px "TH Sarabun", Sarabun, sans-serif';
      _offCtx.textBaseline = "alphabetic";
      const m = _offCtx.measureText(word);
      const fA = m.fontBoundingBoxAscent, fD = m.fontBoundingBoxDescent;
      const aA = m.actualBoundingBoxAscent, aD = m.actualBoundingBoxDescent;
      if (![fA, fD, aA, aD].every((n) => typeof n === "number" && isFinite(n))) return 0;
      const off = -(((fA - fD) + (aD - aA)) / 2) / F;   // em; negative = move up
      // only cache once the real Thai font is in use (avoid caching fallback metrics)
      if (!document.fonts || document.fonts.check('500 200px "Sarabun"')) _offCache[word] = off;
      return off;
    } catch (e) { return 0; }
  }
  // Rough romanized reading (for display only — not a strict transliteration)
  function romanize(cons, vowel, tone, fin) {
    if (!cons && !vowel) return "";
    const cr = cons ? cons.rom.replace(/[()]/g, "") : "";
    const vr = vowel ? vowel.rom : "";
    const fr = fin && fin.rom ? fin.rom : "";
    let out = (cr + vr + fr).trim();
    if (tone && tone.rom) out += tone.rom;
    return out;
  }
  // Consonants grouped & ordered by class (mid -> high -> low)
  function consonantsByClass(setKey) {
    let list = consonants;
    if (setKey === "common") list = consonants.filter((c) => COMMON_CONS.includes(c.ch));
    else if (setKey === "noRare") list = consonants.filter((c) => !c.rare);
    return CLASS_ORDER.map((g) => ({
      ...g,
      items: list.filter((c) => c.cls === g.cls),
    }));
  }

  // Resolve an initial (single consonant OR cluster) to an info object
  function clusterClass(ch) {
    const first = consonants.find((c) => c.ch === ch[0]);
    return first ? first.cls : "M";
  }
  function getInitial(ch) {
    if (!ch) return null;
    const c = consonants.find((x) => x.ch === ch);
    if (c) return c;
    const cl = clusters.find((x) => x.ch === ch);
    if (cl) return { ch: cl.ch, rom: cl.rom, name: "ควบกล้ำ", cls: clusterClass(cl.ch), cluster: true };
    return null;
  }

  // ---- Decodable word dictionary (คำที่มีความหมาย) ----------------
  // Common one-syllable Thai words a learner can build on the mat. Specified
  // by component (initial · vowel · tone · final) so each key is generated by
  // buildSyllable() — it always matches exactly what the mat composes.
  // Used to reward a real word with a "ถูกต้อง! ✓" + meaning on Check.
  const WORD_SPECS = [
    // --- CV, no tone ---
    { i: "ก", v: "aa", m: "อีกา · นก" },          // กา
    { i: "ต", v: "aa", m: "ดวงตา · คุณตา" },      // ตา
    { i: "ม", v: "aa", m: "เคลื่อนเข้ามา" },       // มา
    { i: "น", v: "aa", m: "ทุ่งนา" },             // นา
    { i: "ป", v: "aa", m: "ขว้างปา" },            // ปา
    { i: "ห", v: "aa", m: "ค้นหา" },              // หา
    { i: "ช", v: "aa", m: "น้ำชา" },              // ชา
    { i: "ด", v: "uu", m: "มองดู" },              // ดู
    { i: "ป", v: "uu", m: "ปู · สัตว์ทะเล" },      // ปู
    { i: "ง", v: "uu", m: "งู · สัตว์เลื้อยคลาน" }, // งู
    { i: "ร", v: "uu", m: "รู · ช่อง" },           // รู
    { i: "ห", v: "uu", m: "หู · อวัยวะฟัง" },      // หู
    { i: "ด", v: "ii", m: "ดี · ไม่เลว" },         // ดี
    { i: "ป", v: "ii", m: "ปี · รอบของเวลา" },     // ปี
    { i: "ม", v: "ii", m: "มี · ครอบครอง" },       // มี
    { i: "ส", v: "ii", m: "สี · สีสัน" },          // สี
    { i: "ต", v: "ii", m: "ตี · ทุบ" },           // ตี
    { i: "ผ", v: "ii", m: "ผี · วิญญาณ" },         // ผี
    { i: "ท", v: "ii", m: "ที · ครั้ง" },          // ที
    { i: "ต", v: "o",  m: "โต · ใหญ่ขึ้น" },        // โต
    { i: "ท", v: "e",  m: "เท · ของเหลว" },         // เท
    { i: "ป", v: "ai2", m: "ไป · เคลื่อนออก" },     // ไป
    { i: "จ", v: "ai1", m: "หัวใจ · จิตใจ" },       // ใจ
    { i: "ฟ", v: "ai2", m: "ไฟ · เปลวไฟ" },         // ไฟ
    { i: "ว", v: "ai2", m: "ไว · รวดเร็ว" },        // ไว
    { i: "ส", v: "ai1", m: "ใส · สะอาดตา" },        // ใส
    { i: "บ", v: "ai1", m: "ใบไม้" },              // ใบ
    { i: "ต", v: "ai2", m: "ไต · อวัยวะ" },         // ไต
    { i: "ข", v: "aw", m: "ขอ · ร้องขอ" },         // ขอ
    { i: "ร", v: "aw", m: "รอ · คอย" },            // รอ
    { i: "พ", v: "aw", m: "พอ · เพียงพอ" },        // พอ
    // --- CVC, no tone ---
    { i: "ก", v: "i",  f: "kon",  m: "กิน · รับประทาน" }, // กิน
    { i: "ด", v: "i",  f: "kon",  m: "ดิน · พื้นดิน" },    // ดิน
    { i: "บ", v: "i",  f: "kon",  m: "บิน · โบยบิน" },     // บิน
    { i: "ป", v: "ii", f: "kon",  m: "ปีน · ป่ายปีน" },    // ปีน
    { i: "จ", v: "aa", f: "kon",  m: "จาน · ภาชนะ" },      // จาน
    { i: "บ", v: "aa", f: "kon",  m: "บาน · บานออก" },     // บาน
    { i: "ง", v: "aa", f: "kon",  m: "งาน · สิ่งที่ทำ" },   // งาน
    { i: "ต", v: "aa", f: "kom",  m: "ตาม · เดินตาม" },    // ตาม
    { i: "ส", v: "aa", f: "kom",  m: "สาม · เลข ๓" },      // สาม
    { i: "ก", v: "aa", f: "kong", m: "กาง · กางออก" },     // กาง
    { i: "ย", v: "aa", f: "kong", m: "ยาง · ยางไม้" },     // ยาง
    { i: "น", v: "aa", f: "kong", m: "นาง · ผู้หญิง" },    // นาง
    { i: "ค", v: "aa", f: "kong", m: "คาง · ใต้ปาก" },     // คาง
    { i: "ม", v: "aa", f: "kok",  m: "มาก · เยอะ" },       // มาก
    { i: "ป", v: "aa", f: "kok",  m: "ปาก · ส่วนปาก" },    // ปาก
    { i: "จ", v: "aa", f: "kok",  m: "จาก · ออกจาก" },     // จาก
    { i: "ล", v: "aa", f: "kok",  m: "ลาก · ดึง" },        // ลาก
    { i: "ด", v: "aa", f: "koew", m: "ดาว · ดวงดาว" },     // ดาว
    // --- with tone (intermediate) ---
    { i: "ม", v: "ae", t: "ek",  m: "แม่ · มารดา" },       // แม่
    { i: "พ", v: "aw", t: "ek",  m: "พ่อ · บิดา" },        // พ่อ
    { i: "ป", v: "aa", t: "tho", m: "ป้า · พี่ของพ่อแม่" }, // ป้า
    { i: "น", v: "aa", t: "tho", m: "น้า · น้องของแม่" },  // น้า
    { i: "ย", v: "aa", t: "ek",  m: "ย่า · แม่ของพ่อ" },   // ย่า
    { i: "พ", v: "ii", t: "ek",  m: "พี่ · พี่น้อง" },      // พี่
    { i: "ก", v: "ai2", t: "ek", m: "ไก่ · สัตว์ปีก" },    // ไก่
    { i: "ป", v: "uu", t: "ek",  m: "ปู่ · พ่อของพ่อ" },   // ปู่
    { i: "ส", v: "ii", t: "ek",  m: "สี่ · เลข ๔" },       // สี่
    { i: "ห", v: "aa", t: "tho", m: "ห้า · เลข ๕" },       // ห้า
    { i: "ฟ", v: "aa", t: "tho", m: "ฟ้า · ท้องฟ้า" },     // ฟ้า
  ];
  const WORDS = {};
  WORD_SPECS.forEach((w) => {
    const vow = vowels.find((v) => v.id === w.v) || null;
    const tone = w.t ? tones.find((t) => t.id === w.t) : null;
    const finCh = w.f ? (finals.find((f) => f.id === w.f) || {}).ch || "" : "";
    WORDS[buildSyllable(w.i, vow, tone, finCh)] = w.m;
  });

  window.THAI = {
    consonants, vowels, tones, finals, clusters, LEVELS, WORD_CHAINS, GRADES, GRADE_ORDER, MAT_LEVELS,
    COMMON_CONS, CLASS_ORDER, WORDS,
    DOT,
    vowelTemplate, toneTemplate, finalTemplate, vowelBare, toneBare,
    buildSyllable, romanize, consonantsByClass, getInitial, displayScale, displayOffset,
  };
})();

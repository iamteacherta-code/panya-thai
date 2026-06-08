/* global React, THAI */
const { useState, useMemo, useCallback, useEffect } = React;
const KeypadFilters = window.KeypadFilters;

/* ---- set filters ---- */
function consItemsBySet(setKey) {
  if (setKey === "common") return THAI.consonants.filter((c) => THAI.COMMON_CONS.includes(c.ch));
  if (setKey === "noRare") return THAI.consonants.filter((c) => !c.rare);
  return THAI.consonants;
}

const VOW_CATS = [
  { cat: "long",    en: "Long vowels",  th: "สระเสียงยาว", cls: "c-vlong" },
  { cat: "short",   en: "Short vowels", th: "สระเสียงสั้น", cls: "c-vshort" },
  { cat: "dip",     en: "Diphthongs",   th: "สระประสม",   cls: "c-dip" },
  { cat: "special", en: "Special",      th: "สระพิเศษ",    cls: "c-spec" },
];
const CLS_COLOR = { mid: "c-mid", high: "c-high", low: "c-low" };

/* finals that are NOT the direct representative of their แม่ (ตัวสะกดไม่ตรงมาตรา),
   derived from each มาตรา's `also` list (e.g. แม่กด → จ ต ถ ท ธ ส). */
const EXTRA_FINALS = THAI.finals.flatMap((f) =>
  (f.also || "").split(" ").filter((ch) => ch && ch !== f.ch)
    .map((ch) => ({ id: f.id + "_" + ch, ch, rom: f.rom, maatra: f.maatra, base: f.id, live: f.live }))
);
const ALL_FINALS = THAI.finals.concat(EXTRA_FINALS);

/* ===================== generic tile ===================== */
function Tile({ color, glyph, name, selected, onClick, title }) {
  return (
    <button className={"tile " + color + (selected ? " sel" : "")} onClick={onClick} title={title}>
      <span className="g">{glyph}</span>
      {name && <span className="nm">{name}</span>}
    </button>
  );
}

/* ===================== recipe slot (with slide arrows) ===================== */
function Slot({ label, en, glyph, sub, filled, active, onSelect, onClear, onPrev, onNext, accent }) {
  return (
    <div className={"slot" + (active ? " active" : "") + (filled ? " filled" : "")}
      style={accent ? { "--slot-accent": accent } : undefined}>
      <button className="s-x" onClick={(e) => { e.stopPropagation(); onClear(); }} title="ลบ">×</button>
      <span className="s-label">{label} <span className="en">{en}</span></span>
      <div className="s-mid">
        <button className="s-arrow" onClick={(e) => { e.stopPropagation(); onPrev(); }} title="เลื่อนซ้าย" aria-label="previous">‹</button>
        <span className="s-glyph" onClick={onSelect}>{filled ? glyph : <span className="empty">{"\u00A0"}</span>}</span>
        <button className="s-arrow" onClick={(e) => { e.stopPropagation(); onNext(); }} title="เลื่อนขวา" aria-label="next">›</button>
      </div>
      <span className="s-sub">{sub}</span>
    </div>
  );
}

/* ===================== main board ===================== */
function BlendingBoard({ t }) {
  const consItems = useMemo(() => consItemsBySet(t.consSet), [t.consSet]);
  const consBands = useMemo(() => THAI.consonantsByClass(t.consSet), [t.consSet]);

  // teaching level (scaffolding) — primary classroom control
  const [levelId, setLevelId] = useState(t.level || "intermediate");
  useEffect(() => { if (t.level) setLevelId(t.level); }, [t.level]);
  const level = useMemo(() => THAI.LEVELS.find((l) => l.id === levelId) || THAI.LEVELS[1], [levelId]);

  // vowels / tones / finals available at this level
  const vowList = useMemo(() => THAI.vowels.filter((v) => level.vowelCats.includes(v.cat)), [level]);
  const toneList = THAI.tones;
  const finals = THAI.finals;

  // word-chain drill: nothing shown until the teacher taps a chain (keeps it tidy)
  const [chainId, setChainId] = useState(null);
  const activeChain = THAI.WORD_CHAINS.find((c) => c.id === chainId) || null;

  // ordered lists each slot can "slide" through
  const initialList = useMemo(
    () => consItems.map((c) => c.ch).concat(level.clusters ? THAI.clusters.map((c) => c.ch) : []),
    [consItems, level]
  );

  // ----- selection state -----
  const [initial, setInitial] = useState("ก");
  const [vowId, setVowId] = useState("aa");
  const [finId, setFinId] = useState("none");
  const [toneId, setToneId] = useState("none");
  const [active, setActive] = useState("initial");
  const [reveal, setReveal] = useState(false);
  const [feedback, setFeedback] = useState(null); // {ok, msg}
  const [otr, setOtr] = useState(0); // Opportunities to Respond (words practised)

  // which categories the right keypad shows (teacher control)
  const [secOn, setSecOn] = useState({ cons: true, vow: true, final: true, tone: true });
  const [clsOn, setClsOn] = useState({ mid: true, high: true, low: true, clus: true });
  const toggleSec = (k) => setSecOn((s) => ({ ...s, [k]: !s[k] }));
  const toggleCls = (k) => setClsOn((s) => ({ ...s, [k]: !s[k] }));
  const sectionDefs = [{ key: "cons", label: "พยัญชนะ" }, { key: "vow", label: "สระ" }]
    .concat(level.finals ? [{ key: "final", label: "ตัวสะกด" }] : [])
    .concat(level.tones ? [{ key: "tone", label: "วรรณยุกต์" }] : []);
  const classDefs = [
    { key: "mid", label: "กลาง", color: "c-mid" },
    { key: "high", label: "สูง", color: "c-high" },
    { key: "low", label: "ต่ำ", color: "c-low" },
  ].concat(level.clusters ? [{ key: "clus", label: "ควบกล้ำ", color: "c-clus" }] : []);
  // ตัวสะกด: ตรงมาตรา (ตัวแทน) / ไม่ตรงมาตรา (ตัวอื่นในแม่เดียวกัน)
  const [finCat, setFinCat] = useState({ direct: true, extra: false });
  const toggleFin = (k) => setFinCat((s) => ({ ...s, [k]: !s[k] }));
  const finCatDefs = [{ key: "direct", label: "ตรงมาตรา" }, { key: "extra", label: "ไม่ตรงมาตรา" }];
  // finals offered (and slid through), grouped by แม่: representative then its extras
  const availFinals = useMemo(() => {
    const out = [THAI.finals[0]]; // ไม่มีตัวสะกด always first
    THAI.finals.slice(1).forEach((f) => {
      if (finCat.direct) out.push(f);
      if (finCat.extra) {
        (f.also || "").split(" ").filter((ch) => ch && ch !== f.ch)
          .forEach((ch) => out.push({ id: f.id + "_" + ch, ch, rom: f.rom, maatra: f.maatra, base: f.id, live: f.live }));
      }
    });
    return out;
  }, [finCat.direct, finCat.extra]);

  // build a display word from a chain spec
  const specWord = (w) => {
    const vo = THAI.vowels.find((v) => v.id === w.v) || null;
    const to = w.t ? THAI.tones.find((x) => x.id === w.t) : null;
    const fo = w.f ? THAI.finals.find((f) => f.id === w.f) : null;
    return THAI.buildSyllable(w.i, vo, to, fo && fo.ch ? fo.ch : "");
  };
  // load a chain word onto the board
  const loadWord = (w, chainLevel) => {
    if (chainLevel && chainLevel !== levelId) setLevelId(chainLevel);
    setInitial(w.i || "");
    setVowId(w.v || "");
    setFinId(w.f || "none");
    setToneId(w.t || "none");
    setActive("initial");
    setReveal(true);
    setFeedback(null);
    setOtr((n) => n + 1);
  };

  // when level changes, keep selections valid
  useEffect(() => {
    if (!level.vowelCats.includes((THAI.vowels.find((v) => v.id === vowId) || {}).cat)) {
      setVowId(vowList[0] ? vowList[0].id : "");
    }
    if (!level.finals) setFinId("none");
    if (!level.tones) setToneId("none");
    if (!level.clusters && initial.length > 1) setInitial(consItems[0] ? consItems[0].ch : "");
    setFeedback(null);
  }, [levelId]); // eslint-disable-line

  const initObj = useMemo(() => THAI.getInitial(initial), [initial]);
  const vowObj = useMemo(() => THAI.vowels.find((v) => v.id === vowId) || null, [vowId]);
  const finObj = useMemo(() => ALL_FINALS.find((f) => f.id === finId) || null, [finId]);
  const toneObj = useMemo(() => THAI.tones.find((x) => x.id === toneId) || null, [toneId]);

  const finChar = finObj && finObj.ch ? finObj.ch : "";
  const word = THAI.buildSyllable(initial, vowObj, toneObj, finChar);
  const rom = THAI.romanize(initObj, vowObj, toneObj, finObj);
  const hasContent = !!(initial || vowObj);
  const clsLabel = initObj ? (initObj.cls === "H" ? "อักษรสูง" : initObj.cls === "M" ? "อักษรกลาง" : "อักษรต่ำ") : "";

  // pick + auto-advance focus
  const pickInitial = (ch) => { setInitial(ch); setActive("vowel"); setFeedback(null); };
  const pickVowel = (id) => { setVowId(id); setActive(level.finals ? "final" : "initial"); setFeedback(null); };
  const pickFinal = (id) => { setFinId(id); setActive(level.tones ? "tone" : "initial"); setFeedback(null); };
  const pickTone = (id) => { setToneId(id); setFeedback(null); };

  // slide a slot through its ordered list
  const slide = useCallback((type, dir) => {
    setFeedback(null);
    const step = (list, cur, set) => {
      if (!list.length) return;
      let i = list.indexOf(cur);
      if (i === -1) i = 0; else i = (i + dir + list.length) % list.length;
      set(list[i]);
    };
    if (type === "initial") step(initialList, initial, setInitial);
    else if (type === "vowel") step(vowList.map((v) => v.id), vowId, setVowId);
    else if (type === "final") step(availFinals.map((f) => f.id), finId, setFinId);
    else if (type === "tone") step(toneList.map((x) => x.id), toneId, setToneId);
  }, [initialList, initial, vowList, vowId, availFinals, finId, toneList, toneId]);

  const clearAll = useCallback(() => {
    setInitial(""); setVowId(""); setFinId("none"); setToneId("none"); setActive("initial"); setFeedback(null);
  }, []);

  // Check / verify the syllable
  const check = useCallback(() => {
    if (!initial && !vowObj) { setFeedback({ ok: false, msg: "เริ่มจากเลือกพยัญชนะต้นก่อนนะ" }); return; }
    if (!initial) { setFeedback({ ok: false, msg: "ยังไม่มีพยัญชนะต้น — ลองเลือกดูสิ" }); return; }
    if (!vowObj) { setFeedback({ ok: false, msg: "ใส่สระให้พยางค์อ่านออกเสียงได้นะ" }); return; }
    setReveal(true);
    setFeedback({ ok: true, msg: "ประสมคำได้ถูกต้อง อ่านว่า “" + word + "” เก่งมาก!" });
    setOtr((n) => n + 1);
  }, [initial, vowObj, word]);

  const a = t.accent || ["#5b7a4b", "#c98a3b"];

  return (
    <div className="board">
      {/* level selector */}
      <div className="level-bar">
        <span className="lvl-lead">ระดับการสอน <span className="en">· Level</span></span>
        <div className="lvl-seg">
          {THAI.LEVELS.map((l, i) => (
            <button key={l.id} className={levelId === l.id ? "on" : ""} onClick={() => setLevelId(l.id)}>
              <span className="lvl-step">{i + 1}</span>
              <span className="lvl-txt"><b>{l.en}</b><span className="th">{l.th}</span></span>
            </button>
          ))}
        </div>
        <span className="lvl-note">{level.note}</span>
      </div>

      <div className="board-cols">
      <div className="board-stage">
      {/* top toolbar */}
      <div className="bb-top">
        <button className="round-btn q" onClick={() => setReveal((r) => !r)} title="เฉลย / ซ่อนคำอ่าน">
          <span className="rb-glyph">?</span>
          <span className="rb-lbl">{reveal ? "ซ่อน" : "เฉลย"}</span>
        </button>

        <div className="bb-display">
          <div className="bb-word" style={{ fontSize: Math.round(t.letterSize * THAI.displayScale(initial, vowObj)) + "px", transform: hasContent ? "translateY(" + THAI.displayOffset(word) + "em)" : undefined }}>
            {hasContent ? word : <span className="slot-dot">{"\u00A0"}</span>}
          </div>
          {reveal && (
            <div className="bb-read">
              {!hasContent ? <span className="hidden-q" style={{ fontStyle: "italic" }}>เลือกพยัญชนะต้น…</span>
                : <>{rom || "—"}{clsLabel && <span className="cls">· {clsLabel}</span>}</>}
            </div>
          )}
        </div>

        <button className="round-btn undo" onClick={clearAll} title="ล้างทั้งหมด">
          <span className="rb-glyph">↺</span>
          <span className="rb-lbl">ล้าง</span>
        </button>
      </div>

      {/* recipe slots */}
      <div className="slots">
        <Slot label="พยัญชนะต้น" en="Initial" glyph={initObj ? initObj.ch : ""} sub={initObj ? (initObj.cluster ? "ควบกล้ำ" : initObj.name) : "—"}
          filled={!!initial} active={active === "initial"} accent={a[0]}
          onSelect={() => setActive("initial")} onClear={() => { setInitial(""); setActive("initial"); }}
          onPrev={() => slide("initial", -1)} onNext={() => slide("initial", 1)} />
        <span className="slot-plus">+</span>
        <Slot label="สระ" en="Vowel" glyph={vowObj ? THAI.vowelBare(vowObj) : ""}
          sub={vowObj ? (vowObj.cat === "long" ? "เสียงยาว" : vowObj.cat === "short" ? "เสียงสั้น" : vowObj.cat === "dip" ? "สระประสม" : "สระพิเศษ") : "—"}
          filled={!!vowObj} active={active === "vowel"} accent={a[1]}
          onSelect={() => setActive("vowel")} onClear={() => { setVowId(""); setActive("vowel"); }}
          onPrev={() => slide("vowel", -1)} onNext={() => slide("vowel", 1)} />
        {level.finals && <>
          <span className="slot-plus">+</span>
          <Slot label="ตัวสะกด" en="Final" glyph={finChar} sub={finObj && finObj.id !== "none" ? finObj.maatra : "—"}
            filled={!!finChar} active={active === "final"} accent="#7a5fb0"
            onSelect={() => setActive("final")} onClear={() => { setFinId("none"); setActive("final"); }}
            onPrev={() => slide("final", -1)} onNext={() => slide("final", 1)} />
        </>}
        {level.tones && <>
          <span className="slot-plus">+</span>
          <Slot label="วรรณยุกต์" en="Tone" glyph={toneObj ? THAI.toneBare(toneObj) : ""} sub={toneObj && toneObj.id !== "none" ? toneObj.name : "—"}
            filled={!!(toneObj && toneObj.id !== "none")} active={active === "tone"} accent="#b05c3c"
            onSelect={() => setActive("tone")} onClear={() => { setToneId("none"); setActive("tone"); }}
            onPrev={() => slide("tone", -1)} onNext={() => slide("tone", 1)} />
        </>}
      </div>

      {/* check button + feedback */}
      <div className="check-row">
        <button className="btn btn-leaf check-btn" onClick={check}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17 19 7" /></svg>
          ตรวจคำ · Check
        </button>
        {feedback && (
          <div className={"feedback " + (feedback.ok ? "ok" : "no")}>
            <span className="fb-ico">{feedback.ok ? "✓" : "!"}</span>{feedback.msg}
          </div>
        )}
        <div className="otr" style={{ marginLeft: "auto" }} title="จำนวนคำที่ฝึกอ่านในคาบนี้ (Opportunities to Respond)">
          <span className="otr-n">{otr}</span>
          <span className="otr-l">ฝึกแล้ว<br /><span className="en">words read</span></span>
          {otr > 0 && <button className="otr-reset" onClick={() => setOtr(0)} title="รีเซ็ต">↺</button>}
        </div>
      </div>

      {/* word chains (blending drill) */}
      <div className="chains">
        <div className="chains-head">
          <span className="ch-en">Word Chains</span>
          <span className="ch-th">ชุดคำฝึก · เปลี่ยนทีละตำแหน่ง</span>
          <span className="ch-hint">เลือกชุดฝึก แล้วแตะคำเพื่อโหลดขึ้นกระดาน</span>
        </div>
        {/* pick a drill — its words appear below only when tapped (tap again to hide) */}
        <div className="chain-picker">
          {THAI.WORD_CHAINS.map((c) => (
            <button key={c.id} className={"chain-pick" + (chainId === c.id ? " on" : "")}
              onClick={() => setChainId((id) => (id === c.id ? null : c.id))}>
              <b>{c.th}</b><span className="en">{c.en}</span>
            </button>
          ))}
        </div>
        {activeChain && (
          <div className="chain-words chain-active">
            {activeChain.words.map((w, j) => (
              <React.Fragment key={j}>
                {j > 0 && <span className="chain-arrow">→</span>}
                <button className="chain-word" onClick={() => loadWord(w, activeChain.level)}>
                  {specWord(w)}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      </div>{/* /board-stage */}
      <div className="board-keys">
      {/* panels */}
      <div className="keypad">
        <KeypadFilters sections={sectionDefs} sec={secOn} onSec={toggleSec} classes={classDefs} cls={clsOn} onCls={toggleCls}
          finals={level.finals ? finCatDefs : null} fin={finCat} onFin={toggleFin} />
        {/* 1 — initial consonants (one grid; colour = class) */}
        {secOn.cons && (
        <div className="kp-sec">
          <div className="kp-head">
            <span className="kp-en">Initial consonants</span>
            <span className="p-th">พยัญชนะต้น</span>
            <span className="p-hint">เรียงตามหมู่อักษร · กลาง → สูง → ต่ำ</span>
          </div>
          <div className="tiles cons">
            {consBands.filter((b) => clsOn[b.cat]).flatMap((b) => b.items.map((c) => (
              <Tile key={c.ch} color={CLS_COLOR[b.cat]} glyph={c.ch} name={t.showNames ? c.name : ""}
                selected={initial === c.ch} onClick={() => pickInitial(c.ch)}
                title={c.ch + " " + c.name + " · " + b.th} />
            )))}
            {level.clusters && clsOn.clus && THAI.clusters.map((c) => (
              <Tile key={c.ch} color="c-clus" glyph={c.ch} selected={initial === c.ch}
                onClick={() => pickInitial(c.ch)} title={"ควบกล้ำ " + c.ch} />
            ))}
          </div>
        </div>
        )}

        {/* 2 — vowels (one grid; colour = category) */}
        {secOn.vow && (
        <div className="kp-sec">
          <div className="kp-head">
            <span className="kp-en">Vowels</span>
            <span className="p-th">สระ</span>
            <span className="p-hint">{level.id === "beginner" ? "ระดับเริ่มต้น · เฉพาะสระเสียงยาว" : "เสียงยาว → สั้น → ประสม → พิเศษ"}</span>
          </div>
          <div className="tiles vow">
            {VOW_CATS.flatMap((vc) => vowList.filter((v) => v.cat === vc.cat).map((v) => (
              <Tile key={v.id} color={vc.cls} glyph={THAI.vowelBare(v)}
                selected={vowId === v.id} onClick={() => pickVowel(v.id)} title={"สระ " + vc.th} />
            )))}
          </div>
        </div>
        )}

        {/* 3 — finals (intermediate+) */}
        {level.finals && secOn.final && (
          <div className="kp-sec">
            <div className="kp-head">
              <span className="kp-en">Final consonants</span>
              <span className="p-th">ตัวสะกด · มาตราตัวสะกด</span>
              <span className="p-hint">{finCat.extra ? "รวมตัวสะกดไม่ตรงมาตรา" : "8 มาตรา · ตัวแทนของแต่ละแม่"}</span>
            </div>
            <div className="band">
              <div className="tiles final">
                {availFinals.map((f) => (
                  <button key={f.id} className={"tile c-final" + (finId === f.id ? " sel" : "")}
                    onClick={() => pickFinal(f.id)} title={f.maatra + (f.base ? " · ไม่ตรงมาตรา" : "")}>
                    <span className="g">{f.ch || "\u00A0"}</span>
                    <span className="nm">{f.id === "none" ? "ไม่มีตัวสะกด" : f.maatra}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4 — tones (advanced) */}
        {level.tones && secOn.tone && (
          <div className="kp-sec">
            <div className="kp-head">
              <span className="kp-en">Tone marks</span>
              <span className="p-th">วรรณยุกต์</span>
              <span className="p-hint">วางบนพยัญชนะต้น</span>
            </div>
            <div className="band">
              <div className="tiles tone">
                {toneList.map((tn) => (
                  <button key={tn.id} className={"tile c-tone" + (toneId === tn.id ? " sel" : "")}
                    onClick={() => pickTone(tn.id)} title={tn.name}>
                    <span className="g">{THAI.toneBare(tn) || "\u00A0"}</span>
                    <span className="nm">{tn.id === "none" ? "ไม่มีรูป" : tn.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      </div>{/* /board-keys */}
      </div>{/* /board-cols */}
      {/* legend */}
      <div className="bb-legend">
        {[
          { cls: "c-mid", t: "อักษรกลาง" }, { cls: "c-high", t: "อักษรสูง" }, { cls: "c-low", t: "อักษรต่ำ" },
          level.clusters ? { cls: "c-clus", t: "ควบกล้ำ" } : null,
          { cls: "c-vlong", t: "สระยาว" }, { cls: "c-vshort", t: "สระสั้น" },
          level.id === "advanced" ? { cls: "c-dip", t: "สระประสม" } : null,
          level.finals ? { cls: "c-final", t: "ตัวสะกด" } : null,
          level.tones ? { cls: "c-tone", t: "วรรณยุกต์" } : null,
        ].filter(Boolean).map((l, i) => (
          <span className="lg-item" key={i}><span className={"lg-sw " + l.cls} /> {l.t}</span>
        ))}
      </div>
    </div>
  );
}

window.BlendingBoard = BlendingBoard;

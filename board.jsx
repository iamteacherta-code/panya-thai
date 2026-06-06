/* global React, THAI */
const { useState, useMemo, useCallback, useEffect } = React;

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
  const finObj = useMemo(() => THAI.finals.find((f) => f.id === finId) || null, [finId]);
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
    else if (type === "final") step(finals.map((f) => f.id), finId, setFinId);
    else if (type === "tone") step(toneList.map((x) => x.id), toneId, setToneId);
  }, [initialList, initial, vowList, vowId, finals, finId, toneList, toneId]);

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
          <div className="bb-word" style={{ fontSize: t.letterSize + "px" }}>
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
          <span className="ch-hint">แตะคำเพื่อโหลดขึ้นกระดาน — ฝึกอ่านไล่ทีละคำ</span>
        </div>
        <div className="chain-rows">
          {THAI.WORD_CHAINS.map((c) => (
            <div className="chain-row" key={c.id}>
              <div className="chain-label">
                <b>{c.th}</b>
                <span className="en">{c.en}</span>
              </div>
              <div className="chain-words">
                {c.words.map((w, j) => (
                  <React.Fragment key={j}>
                    {j > 0 && <span className="chain-arrow">→</span>}
                    <button className="chain-word" onClick={() => loadWord(w, c.level)}>
                      {specWord(w)}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      </div>{/* /board-stage */}
      <div className="board-keys">
      {/* panels */}
      <div className="panels">
        {/* 1 — initial consonants */}
        <div className="panel">
          <div className="panel-head">
            <span className="p-num">1</span>
            <span className="p-en">Initial consonants</span>
            <span className="p-th">พยัญชนะต้น</span>
            <span className="p-hint">เรียงตามหมู่อักษร · กลาง → สูง → ต่ำ</span>
          </div>
          {consBands.map((b) => (
            <div className="band" key={b.cls}>
              <div className={"band-label " + CLS_COLOR[b.cat]}>
                <span className="bl-en">{b.en}<span className="bl-dot" /></span>
                <span className="bl-th">{b.th} · {b.items.length}</span>
              </div>
              <div className="tiles cons">
                {b.items.map((c) => (
                  <Tile key={c.ch} color={CLS_COLOR[b.cat]} glyph={c.ch} name={t.showNames ? c.name : ""}
                    selected={initial === c.ch} onClick={() => pickInitial(c.ch)}
                    title={c.ch + " " + c.name + " · " + b.th} />
                ))}
              </div>
            </div>
          ))}
          {level.clusters && (
            <div className="band">
              <div className="band-label c-clus">
                <span className="bl-en">Clusters<span className="bl-dot" /></span>
                <span className="bl-th">ควบกล้ำ · {THAI.clusters.length}</span>
              </div>
              <div className="tiles cons">
                {THAI.clusters.map((c) => (
                  <Tile key={c.ch} color="c-clus" glyph={c.ch} selected={initial === c.ch}
                    onClick={() => pickInitial(c.ch)} title={"ควบกล้ำ " + c.ch} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2 — vowels */}
        <div className="panel">
          <div className="panel-head">
            <span className="p-num">2</span>
            <span className="p-en">Vowels</span>
            <span className="p-th">สระ</span>
            <span className="p-hint">{level.id === "beginner" ? "ระดับเริ่มต้น · เฉพาะสระเสียงยาว" : "เสียงยาว → สั้น → ประสม → พิเศษ"}</span>
          </div>
          {VOW_CATS.map((vc) => {
            const items = vowList.filter((v) => v.cat === vc.cat);
            if (!items.length) return null;
            return (
              <div className="band" key={vc.cat}>
                <div className={"band-label " + vc.cls}>
                  <span className="bl-en">{vc.en}<span className="bl-dot" /></span>
                  <span className="bl-th">{vc.th} · {items.length}</span>
                </div>
                <div className="tiles vow">
                  {items.map((v) => (
                    <Tile key={v.id} color={vc.cls} glyph={THAI.vowelBare(v)}
                      selected={vowId === v.id} onClick={() => pickVowel(v.id)} title={"สระ " + vc.th} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 — finals (intermediate+) */}
        {level.finals && (
          <div className="panel">
            <div className="panel-head">
              <span className="p-num">3</span>
              <span className="p-en">Final consonants</span>
              <span className="p-th">ตัวสะกด · มาตราตัวสะกด</span>
              <span className="p-hint">8 มาตรา · ตัวแทนของแต่ละแม่</span>
            </div>
            <div className="band">
              <div className="band-label c-final">
                <span className="bl-en">Endings<span className="bl-dot" /></span>
                <span className="bl-th">มาตรา · {finals.length}</span>
              </div>
              <div className="tiles final">
                {finals.map((f) => (
                  <button key={f.id} className={"tile c-final" + (finId === f.id ? " sel" : "")}
                    onClick={() => pickFinal(f.id)} title={f.maatra + (f.also ? " · " + f.also : "")}>
                    <span className="g">{f.ch || "\u00A0"}</span>
                    <span className="nm">{f.id === "none" ? "ไม่มีตัวสะกด" : f.maatra}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4 — tones (advanced) */}
        {level.tones && (
          <div className="panel">
            <div className="panel-head">
              <span className="p-num">4</span>
              <span className="p-en">Tone marks</span>
              <span className="p-th">วรรณยุกต์</span>
              <span className="p-hint">วางบนพยัญชนะต้น</span>
            </div>
            <div className="band">
              <div className="band-label c-tone">
                <span className="bl-en">Tones<span className="bl-dot" /></span>
                <span className="bl-th">รูปวรรณยุกต์ · {toneList.length}</span>
              </div>
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

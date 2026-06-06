/* global React, THAI */
(function () {
  const { useState, useMemo, useEffect, useCallback } = React;
  const CLS_COLOR = { mid: "c-mid", high: "c-high", low: "c-low" };

  // group an arbitrary set of consonant chars by ไตรยางศ์ (class)
  function consByClass(chars) {
    return THAI.CLASS_ORDER
      .map((g) => ({ ...g, items: chars.map((ch) => THAI.consonants.find((c) => c.ch === ch)).filter((c) => c && c.cls === g.cls) }))
      .filter((g) => g.items.length);
  }
  const resolveVowels = (v) => (v === "all" ? THAI.vowels : v.map((id) => THAI.vowels.find((x) => x.id === id)).filter(Boolean));

  function MatTile({ color, glyph, name, sel, onClick, title }) {
    return (
      <button className={"tile " + color + (sel ? " sel" : "")} onClick={onClick} title={title}>
        <span className="g">{glyph}</span>
        {name && <span className="nm">{name}</span>}
      </button>
    );
  }

  function MatSlot({ label, en, glyph, sub, filled, active, accent, onSelect, onClear }) {
    return (
      <div className={"slot" + (active ? " active" : "") + (filled ? " filled" : "")}
        style={accent ? { "--slot-accent": accent } : undefined} onClick={onSelect}>
        {filled && <button className="s-x" onClick={(e) => { e.stopPropagation(); onClear(); }} title="ลบ">×</button>}
        <span className="s-label">{label} <span className="en">{en}</span></span>
        <span className="s-glyph mat-glyph">{filled ? glyph : <span className="empty">{"\u00A0"}</span>}</span>
        <span className="s-sub">{sub}</span>
      </div>
    );
  }

  function WordWorkMat({ matId, t }) {
    const cfg = THAI.MATS[matId];
    const [mode, setMode] = useState("cv");
    const m = cfg.modes[mode];

    const consChars = m.cons === "all" ? THAI.consonants.map((c) => c.ch) : m.cons;
    const consBands = useMemo(() => consByClass(consChars), [consChars.join("")]);
    const vowList = useMemo(() => resolveVowels(m.vowels), [mode, matId]);
    const finList = m.finals ? ["none"].concat(m.finals).map((id) => THAI.finals.find((f) => f.id === id)) : null;
    const toneList = m.tones ? THAI.tones : null;
    const showClusters = !!m.clusters;

    const [initial, setInitial] = useState("");
    const [vowId, setVowId] = useState("");
    const [finId, setFinId] = useState("none");
    const [toneId, setToneId] = useState("none");
    const [active, setActive] = useState("initial");
    const [reveal, setReveal] = useState(false);
    const [feedback, setFeedback] = useState(null);

    // sensible defaults on mount / mode change
    useEffect(() => {
      setInitial(consChars[0] || "");
      setVowId(vowList[0] ? vowList[0].id : "");
      setFinId("none"); setToneId("none"); setActive("initial"); setReveal(false); setFeedback(null);
    }, [mode, matId]);

    const initObj = useMemo(() => THAI.getInitial(initial), [initial]);
    const vowObj = useMemo(() => THAI.vowels.find((v) => v.id === vowId) || null, [vowId]);
    const finObj = useMemo(() => THAI.finals.find((f) => f.id === finId) || null, [finId]);
    const toneObj = useMemo(() => THAI.tones.find((x) => x.id === toneId) || null, [toneId]);

    const finChar = finObj && finObj.ch ? finObj.ch : "";
    const word = THAI.buildSyllable(initial, vowObj, toneObj, finChar);
    const rom = THAI.romanize(initObj, vowObj, toneObj, finObj);
    const has = !!(initial || vowObj);

    const pickInitial = (ch) => { setInitial(ch); setActive("vowel"); setFeedback(null); };
    const pickVowel = (id) => { setVowId(id); setActive(finList ? "final" : "initial"); setFeedback(null); };
    const pickFinal = (id) => { setFinId(id); setActive(toneList ? "tone" : "initial"); setFeedback(null); };
    const pickTone = (id) => { setToneId(id); setFeedback(null); };

    const clearAll = useCallback(() => { setInitial(""); setVowId(""); setFinId("none"); setToneId("none"); setActive("initial"); setFeedback(null); }, []);

    const check = () => {
      if (!initial) { setFeedback({ ok: false, msg: "วางพยัญชนะต้นก่อนนะ" }); return; }
      if (!vowObj) { setFeedback({ ok: false, msg: "ใส่สระให้พยางค์อ่านออกเสียงได้" }); return; }
      setReveal(true);
      setFeedback({ ok: true, msg: "ประสมคำได้แล้ว อ่านว่า “" + word + "” เก่งมาก!" });
    };

    const clsLabel = initObj ? (initObj.cls === "H" ? "อักษรสูง" : initObj.cls === "M" ? "อักษรกลาง" : "อักษรต่ำ") : "";
    const matClass = "mat-" + matId;

    return (
      <div className={"board mat " + matClass}>
        {/* mat toolbar: mode + grade */}
        <div className="mat-bar">
          <div className="mat-id">
            <span className="mat-badge">{matId === "beginner" ? "B" : "I"}</span>
            <div>
              <div className="mat-title">{matId === "beginner" ? "Beginner" : "Intermediate"}</div>
              <div className="mat-th">{cfg.th} · {cfg.grade}</div>
            </div>
          </div>
          <div className="mode-seg" role="tablist" aria-label="mode">
            <button className={mode === "cv" ? "on" : ""} onClick={() => setMode("cv")}>
              C&nbsp;V <span className="th">พยัญชนะ + สระ</span>
            </button>
            <button className={mode === "cvc" ? "on" : ""} onClick={() => setMode("cvc")}>
              {matId === "beginner" ? "C V C" : "C V C + วรรณยุกต์"} <span className="th">{matId === "beginner" ? "+ ตัวสะกด" : "+ สะกด/ผันเสียง"}</span>
            </button>
          </div>
          <span className="mat-note">{m.finals ? cfg.note : "วาง 1 พยัญชนะ + 1 สระ"}</span>
        </div>

        <div className="board-cols">
        <div className="board-stage">
        {/* top: reveal · word · clear */}
        <div className="bb-top">
          <button className="round-btn q" onClick={() => setReveal((r) => !r)} title="เฉลย / ซ่อนคำอ่าน">
            <span className="rb-glyph">?</span><span className="rb-lbl">{reveal ? "ซ่อน" : "เฉลย"}</span>
          </button>
          <div className="bb-display">
            <div className="bb-word" style={{ fontSize: t.letterSize + "px" }}>
              {has ? word : <span className="slot-dot">{"\u00A0"}</span>}
            </div>
            {reveal && (
              <div className="bb-read">
                {!has ? <span className="hidden-q" style={{ fontStyle: "italic" }}>วางตัวอักษรลงบนแผ่น…</span>
                  : <>{rom || "—"}{clsLabel && <span className="cls">· {clsLabel}</span>}</>}
              </div>
            )}
          </div>
          <button className="round-btn undo" onClick={clearAll} title="ล้างแผ่น">
            <span className="rb-glyph">↺</span><span className="rb-lbl">ล้าง</span>
          </button>
        </div>

        {/* build slots */}
        <div className="slots">
          <MatSlot label="พยัญชนะต้น" en="Initial" glyph={initObj ? initObj.ch : ""} sub={initObj ? (initObj.cluster ? "ควบกล้ำ" : initObj.name) : "—"}
            filled={!!initial} active={active === "initial"} accent="#5b7a4b"
            onSelect={() => setActive("initial")} onClear={() => { setInitial(""); setActive("initial"); }} />
          <span className="slot-plus">+</span>
          <MatSlot label="สระ" en="Vowel" glyph={vowObj ? THAI.vowelBare(vowObj) : ""}
            sub={vowObj ? (vowObj.cat === "long" ? "เสียงยาว" : vowObj.cat === "short" ? "เสียงสั้น" : vowObj.cat === "dip" ? "สระประสม" : "สระพิเศษ") : "—"}
            filled={!!vowObj} active={active === "vowel"} accent="#c98a3b"
            onSelect={() => setActive("vowel")} onClear={() => { setVowId(""); setActive("vowel"); }} />
          {finList && <>
            <span className="slot-plus">+</span>
            <MatSlot label="ตัวสะกด" en="Final" glyph={finChar} sub={finObj && finObj.id !== "none" ? finObj.maatra : "—"}
              filled={!!finChar} active={active === "final"} accent="#7a5fb0"
              onSelect={() => setActive("final")} onClear={() => { setFinId("none"); setActive("final"); }} />
          </>}
          {toneList && <>
            <span className="slot-plus">+</span>
            <MatSlot label="วรรณยุกต์" en="Tone" glyph={toneObj ? THAI.toneBare(toneObj) : ""} sub={toneObj && toneObj.id !== "none" ? toneObj.name : "—"}
              filled={!!(toneObj && toneObj.id !== "none")} active={active === "tone"} accent="#b05c3c"
              onSelect={() => setActive("tone")} onClear={() => { setToneId("none"); setActive("tone"); }} />
          </>}
        </div>

        {/* check */}
        <div className="check-row">
          <button className="btn btn-leaf check-btn" onClick={check}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17 19 7" /></svg>
            ตรวจคำ · Check
          </button>
          {feedback && <div className={"feedback " + (feedback.ok ? "ok" : "no")}><span className="fb-ico">{feedback.ok ? "✓" : "!"}</span>{feedback.msg}</div>}
        </div>

        </div>{/* /board-stage */}
        <div className="board-keys">
        {/* tile trays */}
        <div className="panels">
          {/* consonants */}
          <div className="panel">
            <div className="panel-head">
              <span className="p-num">1</span>
              <span className="p-en">Initial consonants</span>
              <span className="p-th">พยัญชนะต้น</span>
              <span className="p-hint">{m.cons === "all" ? "ครบ 44 ตัว · ตามไตรยางศ์" : consChars.length + " ตัว · กลุ่มที่เลือก"}</span>
            </div>
            {consBands.map((b) => (
              <div className="band" key={b.cls}>
                <div className={"band-label " + CLS_COLOR[b.cat]}>
                  <span className="bl-en">{b.en}<span className="bl-dot" /></span>
                  <span className="bl-th">{b.th} · {b.items.length}</span>
                </div>
                <div className="tiles cons">
                  {b.items.map((c) => (
                    <MatTile key={c.ch} color={CLS_COLOR[b.cat]} glyph={c.ch} name={t.showNames ? c.name : ""}
                      sel={initial === c.ch} onClick={() => pickInitial(c.ch)} title={c.ch + " " + c.name} />
                  ))}
                </div>
              </div>
            ))}
            {showClusters && (
              <div className="band">
                <div className="band-label c-clus">
                  <span className="bl-en">Clusters<span className="bl-dot" /></span>
                  <span className="bl-th">ควบกล้ำ · {THAI.clusters.length}</span>
                </div>
                <div className="tiles cons">
                  {THAI.clusters.map((c) => (
                    <MatTile key={c.ch} color="c-clus" glyph={c.ch} sel={initial === c.ch} onClick={() => pickInitial(c.ch)} title={"ควบกล้ำ " + c.ch} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* vowels */}
          <div className="panel">
            <div className="panel-head">
              <span className="p-num">2</span>
              <span className="p-en">Vowels</span>
              <span className="p-th">สระ</span>
              <span className="p-hint">{vowList.length} รูป</span>
            </div>
            <div className="band">
              <div className="band-label c-vlong">
                <span className="bl-en">Vowels<span className="bl-dot" /></span>
                <span className="bl-th">สระ · {vowList.length}</span>
              </div>
              <div className="tiles vow">
                {vowList.map((v) => (
                  <MatTile key={v.id} color={v.cat === "long" ? "c-vlong" : v.cat === "short" ? "c-vshort" : v.cat === "dip" ? "c-dip" : "c-spec"}
                    glyph={THAI.vowelBare(v)} sel={vowId === v.id} onClick={() => pickVowel(v.id)} title={"สระ -" + v.rom} />
                ))}
              </div>
            </div>
          </div>

          {/* finals */}
          {finList && (
            <div className="panel">
              <div className="panel-head">
                <span className="p-num">3</span>
                <span className="p-en">Final consonants</span>
                <span className="p-th">ตัวสะกด</span>
                <span className="p-hint">{matId === "beginner" ? "แม่ที่ออกเสียงง่าย · ง น ม" : "8 มาตราตัวสะกด"}</span>
              </div>
              <div className="band">
                <div className="band-label c-final">
                  <span className="bl-en">Endings<span className="bl-dot" /></span>
                  <span className="bl-th">มาตรา · {finList.length - 1}</span>
                </div>
                <div className="tiles final">
                  {finList.map((f) => (
                    <button key={f.id} className={"tile c-final" + (finId === f.id ? " sel" : "")} onClick={() => pickFinal(f.id)} title={f.maatra}>
                      <span className="g">{f.ch || "\u00A0"}</span>
                      <span className="nm">{f.id === "none" ? "ไม่มีตัวสะกด" : f.maatra}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* tones */}
          {toneList && (
            <div className="panel">
              <div className="panel-head">
                <span className="p-num">4</span>
                <span className="p-en">Tone marks</span>
                <span className="p-th">วรรณยุกต์</span>
                <span className="p-hint">ผันเสียงในแม่สะกดต่าง ๆ</span>
              </div>
              <div className="band">
                <div className="band-label c-tone">
                  <span className="bl-en">Tones<span className="bl-dot" /></span>
                  <span className="bl-th">รูป · {toneList.length}</span>
                </div>
                <div className="tiles tone">
                  {toneList.map((tn) => (
                    <button key={tn.id} className={"tile c-tone" + (toneId === tn.id ? " sel" : "")} onClick={() => pickTone(tn.id)} title={tn.name}>
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
        {/* constraint note */}
        <div className="mat-foot">
          {matId === "beginner"
            ? "ระดับเริ่มต้น — เปิดเฉพาะพยัญชนะเดี่ยวและสระ" + (m.finals ? " พร้อมตัวสะกดง่าย (ง น ม) ยังไม่มีวรรณยุกต์" : " (ปิดช่องตัวสะกด/วรรณยุกต์)")
            : "ระดับกลาง — พยัญชนะครบ 44 ตัว รวมควบกล้ำ" + (m.tones ? " มีตัวสะกดและวรรณยุกต์ครบ" : " และสระเปลี่ยนรูป/ลดรูป")}
        </div>
      </div>
    );
  }

  window.WordWorkMat = WordWorkMat;
})();

/* global React, THAI */
(function () {
  const { useState, useMemo, useEffect, useCallback, useRef } = React;
  const CLS_COLOR = { mid: "c-mid", high: "c-high", low: "c-low" };
  const vowColor = (cat) => (cat === "long" ? "c-vlong" : cat === "short" ? "c-vshort" : cat === "dip" ? "c-dip" : "c-spec");
  const vowSub = (cat) => (cat === "long" ? "เสียงยาว" : cat === "short" ? "เสียงสั้น" : cat === "dip" ? "สระประสม" : "สระพิเศษ");

  // group an arbitrary set of consonant chars by ไตรยางศ์ (class)
  function consByClass(chars) {
    return THAI.CLASS_ORDER
      .map((g) => ({ ...g, items: chars.map((ch) => THAI.consonants.find((c) => c.ch === ch)).filter((c) => c && c.cls === g.cls) }))
      .filter((g) => g.items.length);
  }
  const resolveVowels = (v) => (v === "all" ? THAI.vowels : v.map((id) => THAI.vowels.find((x) => x.id === id)).filter(Boolean));

  // A tray tile. In "build" mode it taps to fill a slot; in "free" mode it is
  // a pointer drag-source (works on touch — HTML5 drag-and-drop does not).
  function TrayTile({ free, color, glyph, name, selected, onTap, onSpawn }) {
    const inner = (
      <>
        <span className="g">{glyph}</span>
        {name && <span className="nm">{name}</span>}
      </>
    );
    if (free) {
      return (
        <button className={"tile " + color} style={{ touchAction: "none" }} onPointerDown={(e) => onSpawn(e, glyph, color)}>
          {inner}
        </button>
      );
    }
    return (
      <button className={"tile " + color + (selected ? " sel" : "")} onClick={onTap}>
        {inner}
      </button>
    );
  }

  // A build-mode recipe slot (tap a tile to fill it).
  function MatSlot({ label, en, glyph, sub, filled, active, accent, onSelect, onClear }) {
    return (
      <div className={"slot" + (active ? " active" : "") + (filled ? " filled" : "")}
        style={accent ? { "--slot-accent": accent } : undefined} onClick={onSelect}>
        {filled && <button className="s-x" onClick={(e) => { e.stopPropagation(); onClear(); }} title="ลบ">×</button>}
        <span className="s-label">{label} <span className="en">{en}</span></span>
        <span className="s-glyph mat-glyph">{filled ? glyph : <span className="empty">{" "}</span>}</span>
        <span className="s-sub">{sub}</span>
      </div>
    );
  }

  function WordWorkMat({ t }) {
    // selected grade (K2 → Y3) — drives the whole grapheme inventory
    const [gradeId, setGradeId] = useState(() => {
      const s = localStorage.getItem("panyaden_mat_grade");
      return s && THAI.GRADES[s] ? s : "k3";
    });
    const changeGrade = (id) => { setGradeId(id); localStorage.setItem("panyaden_mat_grade", id); };
    const cfg = THAI.GRADES[gradeId];
    const cvcHasTones = !!cfg.modes.cvc.tones;

    // stage mode: "build" (tap → compose + check) | "free" (drag anywhere)
    const [stage, setStage] = useState(() => localStorage.getItem("panyaden_mat_stage") || "build");
    const free = stage === "free";
    const changeStage = (s) => { setStage(s); localStorage.setItem("panyaden_mat_stage", s); };

    const [mode, setMode] = useState("cv");
    const m = cfg.modes[mode];

    const consChars = m.cons === "all" ? THAI.consonants.map((c) => c.ch) : Array.isArray(m.cons) ? m.cons : [];
    const consFull = consChars.length >= THAI.consonants.length;
    const consBands = useMemo(() => consByClass(consChars), [consChars.join("")]);
    const vowList = useMemo(() => resolveVowels(m.vowels), [mode, gradeId]);
    // build mode includes the "none" options; free mode shows only real glyphs
    const finList = m.finals
      ? (free ? m.finals.map((id) => THAI.finals.find((f) => f.id === id)).filter((f) => f && f.ch)
              : ["none"].concat(m.finals).map((id) => THAI.finals.find((f) => f.id === id)))
      : null;
    const toneList = m.tones ? (free ? THAI.tones.filter((tn) => tn.mark) : THAI.tones) : null;
    const showClusters = !!m.clusters;
    const hasFinals = !!m.finals;
    const hasTones = !!m.tones;

    /* ===================== build mode (compose + check) ===================== */
    const [initial, setInitial] = useState("");
    const [vowId, setVowId] = useState("");
    const [finId, setFinId] = useState("none");
    const [toneId, setToneId] = useState("none");
    const [active, setActive] = useState("initial");
    const [reveal, setReveal] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
      setInitial(consChars[0] || "");
      setVowId(vowList[0] ? vowList[0].id : "");
      setFinId("none"); setToneId("none"); setActive("initial"); setReveal(false); setFeedback(null);
    }, [mode, gradeId]);

    const initObj = useMemo(() => THAI.getInitial(initial), [initial]);
    const vowObj = useMemo(() => THAI.vowels.find((v) => v.id === vowId) || null, [vowId]);
    const finObj = useMemo(() => THAI.finals.find((f) => f.id === finId) || null, [finId]);
    const toneObj = useMemo(() => THAI.tones.find((x) => x.id === toneId) || null, [toneId]);

    const finChar = finObj && finObj.ch ? finObj.ch : "";
    const word = THAI.buildSyllable(initial, vowObj, toneObj, finChar);
    const rom = THAI.romanize(initObj, vowObj, toneObj, finObj);
    const has = !!(initial || vowObj);
    const clsLabel = initObj ? (initObj.cls === "H" ? "อักษรสูง" : initObj.cls === "M" ? "อักษรกลาง" : "อักษรต่ำ") : "";

    const pickInitial = (ch) => { setInitial(ch); setActive("vowel"); setFeedback(null); };
    const pickVowel = (id) => { setVowId(id); setActive(hasFinals ? "final" : "initial"); setFeedback(null); };
    const pickFinal = (id) => { setFinId(id); setActive(hasTones ? "tone" : "initial"); setFeedback(null); };
    const pickTone = (id) => { setToneId(id); setFeedback(null); };
    const clearAll = useCallback(() => { setInitial(""); setVowId(""); setFinId("none"); setToneId("none"); setActive("initial"); setFeedback(null); }, []);
    const check = () => {
      if (!initial) { setFeedback({ ok: false, msg: "วางพยัญชนะต้นก่อนนะ" }); return; }
      if (!vowObj) { setFeedback({ ok: false, msg: "ใส่สระให้พยางค์อ่านออกเสียงได้" }); return; }
      setReveal(true);
      setFeedback({ ok: true, msg: "ประสมคำได้แล้ว อ่านว่า “" + word + "” เก่งมาก!" });
    };

    /* ===================== free mode (drag anywhere) ===================== */
    const canvasRef = useRef(null);
    const seq = useRef(0);
    const [tokens, setTokens] = useState([]);   // {id, glyph, color, x, y}
    const [ghost, setGhost] = useState(null);   // {glyph, color, x, y} (screen coords)
    const HALF = 32;

    useEffect(() => { setTokens([]); }, [gradeId, mode]);

    const clampToCanvas = (rect, cx, cy) => ({
      x: Math.max(HALF, Math.min(rect.width - HALF, cx)),
      y: Math.max(HALF, Math.min(rect.height - HALF, cy)),
    });

    const startSpawn = (e, glyph, color) => {
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY;
      let moved = false;
      setGhost({ glyph, color, x: sx, y: sy });
      const move = (ev) => {
        if (Math.abs(ev.clientX - sx) > 4 || Math.abs(ev.clientY - sy) > 4) moved = true;
        setGhost((g) => (g ? { ...g, x: ev.clientX, y: ev.clientY } : g));
      };
      const up = (ev) => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        setGhost(null);
        const rect = canvasRef.current.getBoundingClientRect();
        const inside = ev.clientX >= rect.left && ev.clientX <= rect.right && ev.clientY >= rect.top && ev.clientY <= rect.bottom;
        let cx, cy;
        if (inside) { cx = ev.clientX - rect.left; cy = ev.clientY - rect.top; }
        else if (!moved) { cx = rect.width / 2; cy = rect.height / 2; }
        else return;
        const p = clampToCanvas(rect, cx, cy);
        const id = ++seq.current;
        setTokens((ts) => ts.concat([{ id, glyph, color, x: p.x, y: p.y }]));
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };

    const startMove = (e, tk) => {
      e.preventDefault(); e.stopPropagation();
      const rect = canvasRef.current.getBoundingClientRect();
      const sx = e.clientX, sy = e.clientY, ox = tk.x, oy = tk.y;
      const move = (ev) => {
        const p = clampToCanvas(rect, ox + (ev.clientX - sx), oy + (ev.clientY - sy));
        setTokens((ts) => ts.map((t2) => (t2.id === tk.id ? { ...t2, x: p.x, y: p.y } : t2)));
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };

    const removeToken = (id) => setTokens((ts) => ts.filter((t2) => t2.id !== id));
    const clearMat = () => setTokens([]);

    /* ===================== render ===================== */
    return (
      <div className="board mat mat-intermediate">
        {/* mat toolbar: grade · stage · mode */}
        <div className="mat-bar">
          <div className="mat-id">
            <span className="mat-badge">{cfg.en}</span>
            <div className="mat-id-main">
              <div className="mat-title">Word Work Mat <span className="mat-th">· แผ่นฝึกคำ</span></div>
              <div className="mat-grade-row">
                <label htmlFor="matGradeSel" className="mat-grade-lbl">ระดับชั้น · Grade</label>
                <select id="matGradeSel" className="mat-grade-select" value={gradeId}
                  onChange={(e) => changeGrade(e.target.value)}>
                  {THAI.GRADE_ORDER.map((id) => {
                    const g = THAI.GRADES[id];
                    return <option key={id} value={id}>{g.en} · {g.th}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="mode-seg" role="tablist" aria-label="stage">
            <button className={!free ? "on" : ""} onClick={() => changeStage("build")}>
              ช่องประกอบคำ <span className="th">Build</span>
            </button>
            <button className={free ? "on" : ""} onClick={() => changeStage("free")}>
              ลากวางอิสระ <span className="th">Free</span>
            </button>
          </div>
          <div className="mode-seg" role="tablist" aria-label="mode">
            <button className={mode === "cv" ? "on" : ""} onClick={() => setMode("cv")}>
              C&nbsp;V <span className="th">พยัญชนะ + สระ</span>
            </button>
            <button className={mode === "cvc" ? "on" : ""} onClick={() => setMode("cvc")}>
              {cvcHasTones ? "C V C + วรรณยุกต์" : "C V C"} <span className="th">{cvcHasTones ? "+ สะกด/ผันเสียง" : "+ ตัวสะกด"}</span>
            </button>
          </div>
        </div>

        <div className="board-cols">
        <div className="board-stage">
          {free ? (
            /* ---- free-placement mat ---- */
            <>
              <div className="mat-canvas-bar">
                <span className="mc-hint">ลากตัวอักษรจากแผงด้านขวามาวางบนแผ่น แล้วจัดตำแหน่งได้อิสระ · Drag letters onto the mat</span>
                <span className="mc-count">{tokens.length} ตัว</span>
                <button className="btn btn-ghost btn-sm" onClick={clearMat} disabled={!tokens.length}>↺ ล้างแผ่น</button>
              </div>
              <div className="mat-canvas" ref={canvasRef}>
                {tokens.length === 0 && (
                  <div className="mat-canvas-empty">
                    วางตัวอักษรที่นี่
                    <span>Drag &amp; arrange letters freely</span>
                  </div>
                )}
                {tokens.map((tk) => (
                  <div key={tk.id} className={"mat-token " + tk.color} style={{ left: tk.x, top: tk.y, touchAction: "none" }}
                    onPointerDown={(e) => startMove(e, tk)}>
                    <span className="g">{tk.glyph}</span>
                    <button className="mt-x" title="ลบ"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); removeToken(tk.id); }}>×</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ---- build mat (compose + check) ---- */
            <>
              <div className="bb-top">
                <button className="round-btn q" onClick={() => setReveal((r) => !r)} title="เฉลย / ซ่อนคำอ่าน">
                  <span className="rb-glyph">?</span><span className="rb-lbl">{reveal ? "ซ่อน" : "เฉลย"}</span>
                </button>
                <div className="bb-display">
                  <div className="bb-word" style={{ fontSize: t.letterSize + "px" }}>
                    {has ? word : <span className="slot-dot">{" "}</span>}
                  </div>
                  {reveal && (
                    <div className="bb-read">
                      {!has ? <span className="hidden-q" style={{ fontStyle: "italic" }}>แตะตัวอักษรมาประสมคำ…</span>
                        : <>{rom || "—"}{clsLabel && <span className="cls">· {clsLabel}</span>}</>}
                    </div>
                  )}
                </div>
                <button className="round-btn undo" onClick={clearAll} title="ล้างทั้งหมด">
                  <span className="rb-glyph">↺</span><span className="rb-lbl">ล้าง</span>
                </button>
              </div>

              <div className="slots">
                <MatSlot label="พยัญชนะต้น" en="Initial" glyph={initObj ? initObj.ch : ""} sub={initObj ? (initObj.cluster ? "ควบกล้ำ" : initObj.name) : "—"}
                  filled={!!initial} active={active === "initial"} accent="#5b7a4b"
                  onSelect={() => setActive("initial")} onClear={() => { setInitial(""); setActive("initial"); }} />
                <span className="slot-plus">+</span>
                <MatSlot label="สระ" en="Vowel" glyph={vowObj ? THAI.vowelBare(vowObj) : ""}
                  sub={vowObj ? vowSub(vowObj.cat) : "—"}
                  filled={!!vowObj} active={active === "vowel"} accent="#c98a3b"
                  onSelect={() => setActive("vowel")} onClear={() => { setVowId(""); setActive("vowel"); }} />
                {hasFinals && <>
                  <span className="slot-plus">+</span>
                  <MatSlot label="ตัวสะกด" en="Final" glyph={finChar} sub={finObj && finObj.id !== "none" ? finObj.maatra : "—"}
                    filled={!!finChar} active={active === "final"} accent="#7a5fb0"
                    onSelect={() => setActive("final")} onClear={() => { setFinId("none"); setActive("final"); }} />
                </>}
                {hasTones && <>
                  <span className="slot-plus">+</span>
                  <MatSlot label="วรรณยุกต์" en="Tone" glyph={toneObj ? THAI.toneBare(toneObj) : ""} sub={toneObj && toneObj.id !== "none" ? toneObj.name : "—"}
                    filled={!!(toneObj && toneObj.id !== "none")} active={active === "tone"} accent="#b05c3c"
                    onSelect={() => setActive("tone")} onClear={() => { setToneId("none"); setActive("tone"); }} />
                </>}
              </div>

              <div className="check-row">
                <button className="btn btn-leaf check-btn" onClick={check}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17 19 7" /></svg>
                  ตรวจคำ · Check
                </button>
                {feedback && <div className={"feedback " + (feedback.ok ? "ok" : "no")}><span className="fb-ico">{feedback.ok ? "✓" : "!"}</span>{feedback.msg}</div>}
              </div>
            </>
          )}
        </div>

        <div className="board-keys">
        {/* tile trays */}
        <div className="panels">
          {/* consonants */}
          <div className="panel">
            <div className="panel-head">
              <span className="p-num">1</span>
              <span className="p-en">Initial consonants</span>
              <span className="p-th">พยัญชนะต้น</span>
              <span className="p-hint">{consFull ? "ครบ 44 ตัว · ตามไตรยางศ์" : consChars.length + " ตัว · ตามระดับชั้น"}</span>
            </div>
            {consBands.map((b) => (
              <div className="band" key={b.cls}>
                <div className={"band-label " + CLS_COLOR[b.cat]}>
                  <span className="bl-en">{b.en}<span className="bl-dot" /></span>
                  <span className="bl-th">{b.th} · {b.items.length}</span>
                </div>
                <div className="tiles cons">
                  {b.items.map((c) => (
                    <TrayTile key={c.ch} free={free} color={CLS_COLOR[b.cat]} glyph={c.ch} name={t.showNames ? c.name : ""}
                      selected={initial === c.ch} onTap={() => pickInitial(c.ch)} onSpawn={startSpawn} />
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
                    <TrayTile key={c.ch} free={free} color="c-clus" glyph={c.ch}
                      selected={initial === c.ch} onTap={() => pickInitial(c.ch)} onSpawn={startSpawn} />
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
                  <TrayTile key={v.id} free={free} color={vowColor(v.cat)} glyph={THAI.vowelBare(v)}
                    selected={vowId === v.id} onTap={() => pickVowel(v.id)} onSpawn={startSpawn} />
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
                <span className="p-hint">{m.finals.length <= 3 ? "แม่ที่ออกเสียงง่าย · ง น ม" : m.finals.length + " มาตราตัวสะกด"}</span>
              </div>
              <div className="band">
                <div className="band-label c-final">
                  <span className="bl-en">Endings<span className="bl-dot" /></span>
                  <span className="bl-th">มาตรา · {m.finals.length}</span>
                </div>
                <div className="tiles final">
                  {finList.map((f) => (
                    <TrayTile key={f.id} free={free} color="c-final" glyph={f.ch || " "}
                      name={f.id === "none" ? "ไม่มีตัวสะกด" : f.maatra}
                      selected={finId === f.id} onTap={() => pickFinal(f.id)} onSpawn={startSpawn} />
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
                <span className="p-hint">{free ? "ลากวางทับพยัญชนะต้น" : "ผันเสียงในแม่สะกดต่าง ๆ"}</span>
              </div>
              <div className="band">
                <div className="band-label c-tone">
                  <span className="bl-en">Tones<span className="bl-dot" /></span>
                  <span className="bl-th">รูป · {toneList.length}</span>
                </div>
                <div className="tiles tone">
                  {toneList.map((tn) => (
                    <TrayTile key={tn.id} free={free} color="c-tone" glyph={THAI.toneBare(tn) || " "}
                      name={tn.id === "none" ? "ไม่มีรูป" : tn.name}
                      selected={toneId === tn.id} onTap={() => pickTone(tn.id)} onSpawn={startSpawn} />
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
          {cfg.en} · {cfg.th} — {consFull ? "พยัญชนะครบ 44 ตัว" : "พยัญชนะ " + consChars.length + " ตัว"}
          {showClusters ? " รวมควบกล้ำ" : ""}
          {hasFinals ? " · มีตัวสะกด" : " · ไม่มีตัวสะกด"}
          {hasTones ? " · มีวรรณยุกต์" : " · ยังไม่มีวรรณยุกต์"}
        </div>

        {/* drag ghost */}
        {ghost && (
          <div className="mat-ghost" style={{ left: ghost.x, top: ghost.y }}>
            <div className={"mat-token ghost " + ghost.color}><span className="g">{ghost.glyph}</span></div>
          </div>
        )}
      </div>
    );
  }

  window.WordWorkMat = WordWorkMat;
})();

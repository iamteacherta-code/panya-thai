/* global React */
/* Shared UI: simple stroke icons + small helpers. Exposed on window. */
(function () {
  const S = (props, children) =>
    React.createElement(
      "svg",
      Object.assign(
        { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", className: "nav-ico" },
        props
      ),
      children
    );
  const P = (d) => React.createElement("path", { d });
  const L = (x1, y1, x2, y2) => React.createElement("line", { x1, y1, x2, y2 });
  const R = (x, y, w, h, rx) => React.createElement("rect", { x, y, width: w, height: h, rx });
  const C = (cx, cy, r) => React.createElement("circle", { cx, cy, r });

  const Icons = {
    home: (p) => S(p, [P("M3 11.5 12 4l9 7.5"), P("M5 10v9h14v-9")].map((e, i) => React.cloneElement(e, { key: i }))),
    board: (p) => S(p, [R(3, 5, 18, 14, 2.5), L(8, 9, 8, 9.01), L(12, 9, 12, 9.01), L(16, 9, 16, 9.01), L(7.5, 14, 16.5, 14)].map((e, i) => React.cloneElement(e, { key: i }))),
    activity: (p) => S(p, [R(5, 3, 14, 18, 2.5), L(9, 8, 15, 8), L(9, 12, 15, 12), L(9, 16, 13, 16)].map((e, i) => React.cloneElement(e, { key: i }))),
    lesson: (p) => S(p, [P("M4 5a2 2 0 0 1 2-2h9v16H6a2 2 0 0 0-2 2z"), P("M15 3h3a1 1 0 0 1 1 1v15a2 2 0 0 0-2-2h-2")].map((e, i) => React.cloneElement(e, { key: i }))),
    reading: (p) => S(p, [P("M12 6c-2-1.5-5-1.5-7-0.5v12c2-1 5-1 7 .5 2-1.5 5-1.5 7-.5v-12c-2-1-5-1-7 .5z"), L(12, 6, 12, 18)].map((e, i) => React.cloneElement(e, { key: i }))),
    worksheet: (p) => S(p, [P("M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"), P("M14 3v5h5"), P("M16 13l-5 5-2.5-2.5")].map((e, i) => React.cloneElement(e, { key: i }))),
    leaf: (p) => S(p, [P("M5 19C5 11 11 5 19 5c0 8-6 14-14 14z"), P("M5 19c3-3 6-6 11-9")].map((e, i) => React.cloneElement(e, { key: i }))),
    print: (p) => S(p, [P("M6 9V3h12v6"), P("M6 18H4v-7h16v7h-2"), R(8, 14, 8, 6, 1)].map((e, i) => React.cloneElement(e, { key: i }))),
    play: (p) => S(p, [P("M8 5v14l11-7z")].map((e, i) => React.cloneElement(e, { key: i }))),
    arrow: (p) => S(p, [L(5, 12, 19, 12), P("M13 6l6 6-6 6")].map((e, i) => React.cloneElement(e, { key: i }))),
    check: (p) => S(p, [P("M5 12.5 10 17 19 7")].map((e, i) => React.cloneElement(e, { key: i }))),
    sun: (p) => S(p, [C(12, 12, 4), L(12, 2, 12, 4), L(12, 20, 12, 22), L(2, 12, 4, 12), L(20, 12, 22, 12), L(5, 5, 6.5, 6.5), L(17.5, 17.5, 19, 19), L(5, 19, 6.5, 17.5), L(17.5, 6.5, 19, 5)].map((e, i) => React.cloneElement(e, { key: i }))),
  };

  // dashed placeholder block (for image/thumbnail slots)
  function Placeholder({ label, h = 120, style }) {
    return React.createElement(
      "div",
      { className: "ph", style: Object.assign({ height: h }, style) },
      React.createElement("span", { className: "mono" }, label)
    );
  }

  // Keypad category filters — checkable chips to choose which sections
  // (พยัญชนะ/สระ/ตัวสะกด/วรรณยุกต์) and which consonant classes (กลาง/สูง/ต่ำ/ควบ)
  // are shown on the right-hand tile panel. Shared by both boards.
  function KeypadFilters({ sections, sec, onSec, classes, cls, onCls, finals, fin, onFin }) {
    const Chip = ({ on, color, label, onClick }) => (
      <button type="button" className={"kf-chip" + (color ? " " + color : "") + (on ? " on" : "")}
        onClick={onClick} aria-pressed={on}>
        <span className="kf-box">{on ? "✓" : ""}</span>
        {color && <span className={"kf-sw " + color} />}
        <span className="kf-tx">{label}</span>
      </button>
    );
    return (
      <div className="kf">
        <div className="kf-group">
          <span className="kf-lbl">หมวด · Show</span>
          {sections.map((s) => (
            <Chip key={s.key} on={sec[s.key]} label={s.label} onClick={() => onSec(s.key)} />
          ))}
        </div>
        {classes && classes.length > 0 && sec.cons && (
          <div className="kf-group">
            <span className="kf-lbl">อักษร · Class</span>
            {classes.map((c) => (
              <Chip key={c.key} on={cls[c.key]} color={c.color} label={c.label} onClick={() => onCls(c.key)} />
            ))}
          </div>
        )}
        {finals && finals.length > 0 && sec.final && (
          <div className="kf-group">
            <span className="kf-lbl">ตัวสะกด · แม่</span>
            {finals.map((f) => (
              <Chip key={f.key} on={fin[f.key]} color="c-final" label={f.label} onClick={() => onFin(f.key)} />
            ))}
          </div>
        )}
      </div>
    );
  }

  window.Icons = Icons;
  window.Placeholder = Placeholder;
  window.KeypadFilters = KeypadFilters;
})();

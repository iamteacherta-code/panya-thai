/* ============================================================
   PANYA · shared sound + visual effects for the Y1 games
   Web-Audio sound effects (no files needed), Thai speech, and
   pop / confetti visuals. Exposes window.GameFX.
   ============================================================ */
(function(){
  let actx;
  function ac(){ try{ if(!actx) actx=new (window.AudioContext||window.webkitAudioContext)();
    if(actx.state==="suspended") actx.resume(); }catch(e){} return actx; }
  // unlock audio on the first user gesture (browsers block autoplay)
  function unlock(){ ac(); document.removeEventListener("pointerdown",unlock); document.removeEventListener("keydown",unlock); }
  document.addEventListener("pointerdown",unlock); document.addEventListener("keydown",unlock);

  function ping(freq,t0,dur,type,gain){ const c=ac(); if(!c)return; const o=c.createOscillator(),g=c.createGain();
    o.type=type||"sine"; const t=c.currentTime+t0; o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(gain||0.3,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+0.03); }
  function sweep(f1,f2,t0,dur,type,gain){ const c=ac(); if(!c)return; const o=c.createOscillator(),g=c.createGain();
    o.type=type||"sine"; const t=c.currentTime+t0; o.frequency.setValueAtTime(f1,t); o.frequency.exponentialRampToValueAtTime(f2,t+dur);
    g.gain.setValueAtTime(gain||0.3,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+0.03); }

  const FX={};
  // ปริ้ง! — bright rising sparkle
  FX.correct=function(){ ping(988,0,0.10,"triangle",0.40); ping(1319,0.07,0.12,"triangle",0.36); ping(1976,0.15,0.22,"sine",0.34); };
  // แป๋ววว — falling boop
  FX.wrong=function(){ sweep(440,130,0,0.5,"sawtooth",0.26); };
  // fanfare for the end screen
  FX.celebrate=function(){ [523,659,784,1047,1319].forEach((f,k)=>ping(f,k*0.10,0.3,"triangle",0.34)); ping(1568,0.55,0.6,"sine",0.30); };
  // pick a Thai female voice if the device has one (Premwadee/Kanya/Narisa/…)
  function thaiVoice(){ try{ const vs=speechSynthesis.getVoices(); if(!vs.length) return null;
    const th=vs.filter(v=>/^th\b|th-|thai/i.test(v.lang)||/thai/i.test(v.name));
    return th.find(v=>/premwadee|kanya|narisa|female|woman|หญิง|ผู้หญิง/i.test(v.name)) || th[0] || null;
  }catch(e){ return null; } }
  if("speechSynthesis" in window){ try{ speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged=function(){}; }catch(e){} }
  // read Thai text aloud — slow, clear, female-leaning (fallback when no recorded clip)
  FX.speak=function(txt){ try{ const u=new SpeechSynthesisUtterance(txt); u.lang="th-TH"; u.rate=0.72; u.pitch=1.08;
    const v=thaiVoice(); if(v) u.voice=v; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} };
  // play a recorded clip, fall back to speech
  let _aud;
  FX.play=function(url,fallbackText){ if(url){ try{ if(_aud)_aud.pause(); _aud=new Audio(url); _aud.play().catch(e=>{ if(e&&e.name==="AbortError")return; FX.speak(fallbackText||""); }); return; }catch(e){} } FX.speak(fallbackText||""); };
  // stop any playing clip + queued speech (keeps reads from overlapping)
  FX.stop=function(){ try{ if(_aud){ _aud.pause(); _aud.currentTime=0; } }catch(e){} try{ if("speechSynthesis" in window) speechSynthesis.cancel(); }catch(e){} };
  // big ✓ (green) or ✗ (red) that pops over `host`
  FX.pop=function(host,ok){ const d=document.createElement("div"); d.className="fx-pop "+(ok?"fx-ok":"fx-no"); d.textContent=ok?"✓":"✗";
    (host||document.body).appendChild(d); setTimeout(()=>d.remove(),900); };
  // confetti burst inside `host` (host should be position:relative)
  FX.confetti=function(host){ if(!host)return; const c=document.createElement("canvas"); c.className="fx-confetti";
    const r=host.getBoundingClientRect(); c.width=Math.max(40,r.width); c.height=Math.max(40,r.height); host.appendChild(c);
    const ctx=c.getContext("2d"), cols=["#e6533c","#e8b54a","#5b7a4b","#6f9bb0","#b05c3c","#c98a3b","#7a5fb0"], P=[];
    for(let k=0;k<110;k++) P.push({x:Math.random()*c.width, y:-20-Math.random()*c.height*0.6, vx:(Math.random()-0.5)*2.4, vy:2+Math.random()*3.5,
      s:5+Math.random()*7, col:cols[k%cols.length], rot:Math.random()*6, vr:(Math.random()-0.5)*0.34});
    let t=0; const step=()=>{ t++; ctx.clearRect(0,0,c.width,c.height);
      P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=0.05; p.rot+=p.vr; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillStyle=p.col; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*0.62); ctx.restore(); });
      if(t<160) requestAnimationFrame(step); else c.remove(); };
    requestAnimationFrame(step); };

  const css=`
  .fx-pop{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);z-index:30;font-weight:900;pointer-events:none;
    display:grid;place-items:center;border-radius:999px;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.18);}
  .fx-ok{width:122px;height:122px;background:#5b7a4b;font-size:80px;animation:fxok .9s ease-out forwards;}
  .fx-no{width:134px;height:134px;background:#b0402c;font-size:94px;animation:fxno .9s ease-out forwards;}
  @keyframes fxok{0%{transform:translate(-50%,-50%) scale(.2);opacity:0}22%{transform:translate(-50%,-50%) scale(1.18);opacity:1}52%{transform:translate(-50%,-50%) scale(1)}100%{transform:translate(-50%,-72%) scale(1);opacity:0}}
  @keyframes fxno{0%{transform:translate(-50%,-50%) scale(.15) rotate(-14deg);opacity:0}28%{transform:translate(-50%,-50%) scale(1.5) rotate(10deg);opacity:1}58%{transform:translate(-50%,-50%) scale(1.28) rotate(-5deg)}100%{transform:translate(-50%,-50%) scale(1.28);opacity:0}}
  .fx-confetti{position:absolute;inset:0;z-index:25;pointer-events:none;}
  .card.done{position:relative;overflow:hidden;}
  `;
  const st=document.createElement("style"); st.textContent=css; (document.head||document.documentElement).appendChild(st);
  window.GameFX=FX;
})();

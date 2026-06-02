// ── INSTRUMENTS RENDERER ──────────────────────────────

function renderPiano() {
  const root = document.getElementById('piano'); if (!root) return;
  root.innerHTML = '';
  const set    = new Set(gr());
  const whites = ['C','D','E','F','G','A','B','C','D','E','F','G','A','B','C'];
  const w      = 100 / whites.length;
  whites.forEach((n, i) => {
    const el = document.createElement('div');
    el.className = 'white' + (set.has(n) ? ' key-on' : '');
    el.style.cssText = `left:${i*w}%;width:${w}%;position:absolute;bottom:0;top:0`;
    el.textContent   = set.has(n) ? n : '';
    root.appendChild(el);
  });
  [['C#',.72],['D#',1.72],['F#',3.72],['G#',4.72],['A#',5.72],
   ['C#',7.72],['D#',8.72],['F#',10.72],['G#',11.72],['A#',12.72]].forEach(([n, pos]) => {
    const el = document.createElement('div');
    el.className = 'black' + (set.has(n) ? ' key-on' : '');
    el.style.cssText = `left:${pos*w}%;width:${w*.56}%;position:absolute;top:0;height:60%;z-index:2`;
    root.appendChild(el);
  });
}

function renderGuitar() {
  const root = document.getElementById('guitar'); if (!root) return;
  root.innerHTML = '';
  const sc       = new Set(gr());
  const rootNote = gr()[0];
  const tuning   = [['E',4],['B',11],['G',7],['D',2],['A',9],['E',4]];
  const FRETS    = 17;
  const cols     = `40px repeat(${FRETS},1fr)`;

  const mR = document.createElement('div');
  mR.style.cssText = `display:grid;grid-template-columns:${cols};padding:4px 0 2px`;
  mR.appendChild(document.createElement('div'));
  for (let f = 1; f <= FRETS; f++) {
    const c = document.createElement('div');
    c.style.cssText = 'display:flex;align-items:center;justify-content:center;height:14px';
    if ([3,5,7,9,15].includes(f)) c.innerHTML = '<div style="width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.1)"></div>';
    if (f === 12) c.innerHTML = '<div style="display:flex;gap:4px"><div style="width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.15)"></div><div style="width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.15)"></div></div>';
    mR.appendChild(c);
  }
  root.appendChild(mR);

  const nR = document.createElement('div');
  nR.style.cssText = `display:grid;grid-template-columns:${cols};padding:0 0 2px`;
  nR.appendChild(document.createElement('div'));
  for (let f = 1; f <= FRETS; f++) {
    const c = document.createElement('div');
    c.style.cssText = 'text-align:center;font-size:8px;color:rgba(255,255,255,.14);font-family:DM Mono,monospace';
    if ([3,5,7,9,12,15,17].includes(f)) c.textContent = f;
    nR.appendChild(c);
  }
  root.appendChild(nR);

  tuning.forEach(([name, start]) => {
    const row = document.createElement('div');
    row.style.cssText = `display:grid;grid-template-columns:${cols};align-items:center;border-top:1px solid rgba(255,255,255,.05);position:relative`;
    const sl = document.createElement('div');
    sl.style.cssText = 'position:absolute;left:40px;right:0;top:50%;height:1px;background:rgba(255,255,255,.13);pointer-events:none';
    row.appendChild(sl);
    const nc = document.createElement('div');
    nc.style.cssText = 'width:40px;display:flex;align-items:center;justify-content:center;height:32px;border-right:2px solid rgba(255,255,255,.2);position:relative;z-index:1';
    const on = na(start), isOn = sc.has(on), isRoot = on === rootNote;
    const od = document.createElement('div');
    od.className = 'fret-note' + (isRoot ? ' root' : isOn ? ' on' : '');
    od.textContent = isOn ? dn(on) : name;
    if (!isOn) od.style.cssText = 'background:transparent;color:rgba(255,255,255,.18);font-size:9px;width:20px;height:20px';
    nc.appendChild(od);
    row.appendChild(nc);
    for (let f = 1; f <= FRETS; f++) {
      const n = na(start + f); const isO = sc.has(n); const isR = n === rootNote;
      const cell = document.createElement('div');
      cell.className = 'fret-cell';
      if (isO) {
        const dot = document.createElement('div');
        dot.className = 'fret-note' + (isR ? ' root' : ' on');
        dot.textContent = dn(n);
        cell.appendChild(dot);
      }
      row.appendChild(cell);
    }
    root.appendChild(row);
  });
}

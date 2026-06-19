// ── GUITAR SHAPES ─────────────────────────────────────
// Box-notation chord diagrams for the guitar fretboard, shown in a scroll strip
// below the fretboard. Two views: full chord voicings (open / barre / high) and
// compact triads on the top-3 strings (root / 1st / 2nd inversion).
const GuitarShapes = (() => {
  const ENH = {Db:'C#',Eb:'D#',Gb:'F#',Ab:'G#',Bb:'A#'};
  const NI  = {C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
  // Open-string pitch classes, low→high: E A D G B e
  const TUNE = [4, 9, 2, 7, 11, 4];

  // Bilingual labels (EN/ES) for the segmented control and voicing captions.
  const LBL = {
    chords: {en:'Chords', es:'Acordes'}, triads: {en:'Triads', es:'Tríadas'}, prog: {en:'Progression', es:'Progresión'},
    open: {en:'Open', es:'Abierto'}, barreE: {en:'Barre E', es:'Cejilla Mi'}, barreA: {en:'Barre A', es:'Cejilla La'}, high: {en:'High', es:'Aguda'},
    root: {en:'Root', es:'Fund.'}, inv1: {en:'1st inv', es:'1ª inv'}, inv2: {en:'2nd inv', es:'2ª inv'},
    emptyProg: {en:'Add chords to your progression to see them here', es:'Añade acordes a tu progresión para verlos aquí'},
  };
  const T = k => { const o = LBL[k]; return o ? (o[st.lang] || o.en) : k; };

  // Barre shape generators → [e6, a5, d4, g3, b2, e1] fret positions.
  const eM = f => [f,  f+2, f+2, f+1, f,   f  ];  // E-shape major
  const aM = f => [-1, f,   f+2, f+2, f+2, f  ];  // A-shape major
  const em = f => [f,  f+2, f+2, f,   f,   f  ];  // E-shape minor
  const am = f => [-1, f,   f+2, f+2, f+1, f  ];  // A-shape minor

  const EF = r => (NI[r] - 4 + 12) % 12;   // root fret on low-E string
  const AF = r => (NI[r] - 9 + 12) % 12;   // root fret on A string

  // Idiomatic open voicings (differ from the pure barre formula).
  const SPEC = {
    'C:maj':[-1,3,2,0,1,0], 'A:maj':[-1,0,2,2,2,0], 'G:maj':[3,2,0,0,0,3],
    'E:maj':[0,2,2,1,0,0],  'D:maj':[-1,-1,0,2,3,2],
    'A:min':[-1,0,2,2,1,0], 'E:min':[0,2,2,0,0,0],  'D:min':[-1,-1,0,2,3,1],
  };

  const keyOf = fr => fr.join(',');

  // ── Full chord voicings ───────────────────────────
  function chordVoicings(root, qual) {
    const r = ENH[root] || root;
    const out = [], seen = new Set();
    const add = (fr, label) => {
      if (!fr || Math.max(...fr) > 16) return;
      const k = keyOf(fr); if (seen.has(k)) return;
      seen.add(k); out.push({ frets: fr, label });
    };
    if (SPEC[`${r}:${qual}`]) add(SPEC[`${r}:${qual}`], T('open'));
    const ef = EF(r), af = AF(r);
    const sE = qual === 'min' ? em : eM, sA = qual === 'min' ? am : aM;
    add(sE(ef === 0 ? 12 : ef), T('barreE'));
    add(sA(af === 0 ? 12 : af), T('barreA'));
    if (af + 12 <= 14) add(sA(af + 12), T('high'));
    else if (ef + 12 <= 14) add(sE(ef + 12), T('high'));
    return out.slice(0, 4);
  }

  // ── Triads on the top-3 strings (G, B, e) ─────────
  function triadVoicings(root, qual) {
    const r = ENH[root] || root, rootPC = NI[r];
    const iv = qual === 'min' ? [0, 3, 7] : qual === 'dim' ? [0, 3, 6] : [0, 4, 7];
    const triad = new Set(iv.map(x => (rootPC + x) % 12));
    const S = [3, 4, 5];                              // string indices g, b, e
    const found = [], seen = new Set();
    for (let pos = 0; pos <= 13; pos++) {
      const opts = S.map(si => {
        const o = [];
        for (let f = pos; f < pos + 4 && f <= 16; f++)
          if (triad.has((TUNE[si] + f) % 12)) o.push(f);
        return o;
      });
      if (opts.some(o => !o.length)) continue;
      for (const fg of opts[0]) for (const fb of opts[1]) for (const fe of opts[2]) {
        const pcs = new Set([(TUNE[3]+fg)%12, (TUNE[4]+fb)%12, (TUNE[5]+fe)%12]);
        if (pcs.size !== 3) continue;                 // need all three distinct tones
        if (Math.max(fg, fb, fe) - Math.min(fg, fb, fe) > 3) continue;
        const fr = [-1, -1, -1, fg, fb, fe];
        const k = keyOf(fr); if (seen.has(k)) continue;
        seen.add(k);
        // Inversion from the lowest-sounding note (G string).
        const lowPC = (TUNE[3] + fg) % 12;
        const lbl = lowPC === rootPC ? T('root')
                  : lowPC === (rootPC + iv[1]) % 12 ? T('inv1') : T('inv2');
        found.push({ frets: fr, label: lbl, _min: Math.min(fg, fb, fe) });
      }
    }
    found.sort((a, b) => a._min - b._min);
    return found.slice(0, 4);
  }

  // ── SVG box diagram (grid + dots; root marked with a hollow centre) ──
  function drawSVG(frets, rootPC) {
    const W = 62, H = 70, X0 = 9, X1 = 53, Y0 = 9, Y1 = 60, FR = 4, NS = 6;
    const sx = i => X0 + (X1 - X0) * i / (NS - 1);
    const fy = f => Y0 + (Y1 - Y0) * f / FR;
    const active = frets.filter(f => f > 0);
    const minF = active.length ? Math.min(...active) : 0;
    const base = minF <= 1 ? 0 : minF - 1;
    const nut = base === 0;
    const fg = 'var(--fg)';
    let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
    if (!nut)
      s += `<text x="2" y="${fy(0.95)}" font-size="7" fill="var(--muted)" font-family="DM Mono,monospace">${base + 1}</text>`;
    // Nut or top boundary
    s += nut
      ? `<line x1="${sx(0)}" y1="${fy(0)}" x2="${sx(NS-1)}" y2="${fy(0)}" stroke="${fg}" stroke-width="2.4" stroke-linecap="round"/>`
      : `<line x1="${sx(0)}" y1="${fy(0)}" x2="${sx(NS-1)}" y2="${fy(0)}" stroke="${fg}" stroke-opacity="0.22" stroke-width="0.7"/>`;
    for (let f = 1; f <= FR; f++)
      s += `<line x1="${sx(0)}" y1="${fy(f)}" x2="${sx(NS-1)}" y2="${fy(f)}" stroke="${fg}" stroke-opacity="0.16" stroke-width="0.6"/>`;
    for (let i = 0; i < NS; i++)
      s += `<line x1="${sx(i)}" y1="${fy(0)}" x2="${sx(i)}" y2="${fy(FR)}" stroke="${fg}" stroke-opacity="${0.16 + (NS-1-i)*0.03}" stroke-width="${0.5 + (NS-1-i)*0.13}"/>`;
    // Open / muted indicators above the nut
    frets.forEach((f, i) => {
      const x = sx(i);
      if (f === -1)
        s += `<text x="${x}" y="${fy(0)-3}" text-anchor="middle" font-size="7.5" fill="var(--muted)">×</text>`;
      else if (f === 0)
        s += `<circle cx="${x}" cy="${fy(0)-5.5}" r="2.6" fill="none" stroke="var(--accent)" stroke-width="1.2"/>`;
    });
    // Fingered dots — root gets a hollow centre to stand out.
    frets.forEach((f, i) => {
      if (f <= 0) return;
      const df = f - base;
      if (df < 1 || df > FR) return;
      const cx = sx(i), cy = fy(df - 0.5);
      const isRoot = ((TUNE[i] + f) % 12) === rootPC;
      s += `<circle cx="${cx}" cy="${cy}" r="4.4" fill="var(--accent)"/>`;
      if (isRoot) s += `<circle cx="${cx}" cy="${cy}" r="1.7" fill="#fff"/>`;
    });
    s += '</svg>';
    return s;
  }

  // ── State ─────────────────────────────────────────
  // The strip is a CONTROL bar now (no box diagrams): a row of de-duplicated
  // chord chips + a position selector. The selected chord+voicing is drawn on
  // the real fretboard above (via highlightGuitarShape) — that's the display.
  let _view = 'chords', _chords = [], _selChord = 0, _selVoicing = 0;
  const isOpen = () => !!document.getElementById('guitarShapeStrip')?.classList.contains('gss-on');
  const clampi = (v, max) => Math.max(0, Math.min(v, max));

  // De-duplicated chord list. From the progression if there is one (each unique
  // chord once, in order of first appearance); otherwise the single current chord.
  function _collectChords() {
    const h = Array.isArray(st.history) ? st.history : [];
    const list = [], seen = new Set();
    const push = (rootName, qual, name) => {
      const r = ENH[rootName] || rootName, key = r + ':' + qual;
      if (seen.has(key)) return; seen.add(key);
      list.push({ name, root: rootName, qual, rootPC: NI[r] ?? 0 });
    };
    if (h.length) {
      h.forEach(it => {
        const rootName = (typeof chordRootOf === 'function') ? chordRootOf(it) : String(it.chord || 'C').replace(/m$|°$/, '');
        const qual = it.quality === 'Min' ? 'min' : it.quality === 'Dim' ? 'dim' : 'maj';
        push(rootName, qual, it.chord);
      });
    } else {
      let root, qual;
      if (typeof ChordVariants === 'object' && ChordVariants.ctx && ChordVariants.ctx.root) {
        root = ChordVariants.ctx.root; qual = /min/i.test(ChordVariants.ctx.quality) ? 'min' : /dim/i.test(ChordVariants.ctx.quality) ? 'dim' : 'maj';
      } else {
        root = st.key; qual = (typeof modeIsMinor === 'function' && modeIsMinor(st.mode)) ? 'min' : 'maj';
      }
      push(root, qual, root + (qual === 'min' ? 'm' : qual === 'dim' ? '°' : ''));
    }
    return list;
  }

  const _voicingsFor = c => c ? (_view === 'triads' ? triadVoicings(c.root, c.qual) : chordVoicings(c.root, c.qual)) : [];

  function _render() {
    const el = document.getElementById('guitarShapeStrip'); if (!el) return;
    _chords = _collectChords();
    if (!_chords.length) { el.classList.remove('gss-on'); return; }
    _selChord = clampi(_selChord, _chords.length - 1);
    const chord = _chords[_selChord];
    const vs = _voicingsFor(chord);
    _selVoicing = clampi(_selVoicing, Math.max(0, vs.length - 1));
    const v = vs[_selVoicing];

    const seg = (vw, label) => `<button class="${_view === vw ? 'on' : ''}" role="tab" onclick="GuitarShapes.view('${vw}')">${label}</button>`;
    const chips = _chords.map((c, i) =>
      `<button class="gss-chip${i === _selChord ? ' on' : ''}" onclick="GuitarShapes.selChord(${i})">${c.name}</button>`).join('');
    const dots = vs.map((_, i) => `<span class="gss-pos-dot${i === _selVoicing ? ' on' : ''}" onclick="GuitarShapes.setVoicing(${i})"></span>`).join('');

    el.innerHTML = `
      <div class="gss-head">
        <span class="gss-title">${chord.name}${v ? ` · ${v.label}` : ''}</span>
        <div class="gss-seg" role="tablist">${seg('chords', T('chords'))}${seg('triads', T('triads'))}</div>
        <button class="gss-x" onclick="GuitarShapes.close()" aria-label="×">×</button>
      </div>
      <div class="gss-chips">${chips}</div>
      <div class="gss-pos" onpointerdown="GuitarShapes.posSwipe(event)">
        <button class="gss-pos-arrow" onclick="GuitarShapes.step(-1)" aria-label="prev">‹</button>
        <div class="gss-pos-dots">${dots || '<span class="gss-pos-none">—</span>'}</div>
        <button class="gss-pos-arrow" onclick="GuitarShapes.step(1)" aria-label="next">›</button>
      </div>`;
    el.classList.add('gss-on');
    _highlightSel();
  }

  function _highlightSel() {
    const vs = _voicingsFor(_chords[_selChord]);
    const v = vs[_selVoicing];
    if (typeof highlightGuitarShape === 'function') highlightGuitarShape(v ? v.frets : null);
  }

  // Update just the position UI + fretboard (no chip rebuild → no flicker on slide).
  function _updatePos() {
    const vs = _voicingsFor(_chords[_selChord]);
    _selVoicing = clampi(_selVoicing, Math.max(0, vs.length - 1));
    document.querySelectorAll('.gss-pos-dot').forEach((d, i) => d.classList.toggle('on', i === _selVoicing));
    const title = document.querySelector('#guitarShapeStrip .gss-title');
    if (title) title.textContent = _chords[_selChord].name + (vs[_selVoicing] ? ` · ${vs[_selVoicing].label}` : '');
    _highlightSel();
  }

  return {
    toggle() {
      if (isOpen()) { this.close(); return; }
      _view = 'chords'; _selChord = 0; _selVoicing = 0;
      _render();
      if (typeof OverlayManager === 'object') OverlayManager.opened('guitar-shapes');
    },

    // Switch voicing type (full chords vs triads). Keeps the selected chord.
    view(v) { if (v !== _view) { _view = v; _selVoicing = 0; _render(); } },

    // Select a chord chip → show it on the fretboard, reset to its first position.
    selChord(i) { _selChord = i; _selVoicing = 0; _render(); },

    // Position selector (dots / arrows / swipe) — slide through the SAME chord's
    // voicings (positions/inversions), updating the fretboard live.
    setVoicing(i) { _selVoicing = i; _updatePos(); },
    step(dir) {
      const vs = _voicingsFor(_chords[_selChord]);
      if (vs.length > 1) { _selVoicing = (_selVoicing + dir + vs.length) % vs.length; _updatePos(); }
    },
    posSwipe(e) {
      const startX = e.clientX;
      const move = () => {};
      const up = ev => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        const dx = ev.clientX - startX;
        if (Math.abs(dx) > 24) this.step(dx < 0 ? 1 : -1);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },

    // A builder bar was tapped → select that chord's chip if present.
    hint(root, qual) {
      if (!isOpen() || !root) return;
      const r = ENH[root] || root, q = /min/i.test(qual) ? 'min' : /dim/i.test(qual) ? 'dim' : 'maj';
      _chords = _collectChords();
      const idx = _chords.findIndex(c => (ENH[c.root] || c.root) === r && c.qual === q);
      if (idx >= 0) { _selChord = idx; _selVoicing = 0; }
      _render();
    },

    // Progression changed → rebuild chips (keeps selection in range).
    onProgressionChange() { if (isOpen()) _render(); },
    // Language changed → relabel.
    refresh() { if (isOpen()) _render(); },

    close() {
      document.getElementById('guitarShapeStrip')?.classList.remove('gss-on');
      if (typeof highlightGuitarShape === 'function') highlightGuitarShape(null);
    },
  };
})();

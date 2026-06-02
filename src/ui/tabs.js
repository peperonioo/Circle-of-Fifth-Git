// ── TABS & PRODUCTION RENDERER ────────────────────────

function switchTab(tab, btn) {
  const tabsEl = btn?.closest?.('.tabs');
  if (tabsEl) {
    const buttons = [...tabsEl.querySelectorAll('.tab-btn')];
    const i = Math.max(0, buttons.indexOf(btn));
    tabsEl.style.setProperty('--tab-x', `calc(${i} * 100%)`);
  }
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('panel-theory').style.display     = tab === 'theory'     ? 'block' : 'none';
  document.getElementById('panel-production').style.display = tab === 'production' ? 'block' : 'none';
  if (tab === 'production') { renderProduction(); applyI18n(); }
}

function setGenre(id, btn) {
  if (!GENRES[id]) return;
  curGenre = id;
  stopPlay();
  st.genre = id;
  saveState();
  document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProduction();
  applyI18n();
}

function _ae(e) {
  let icon = e.icon;
  if (e.anim === 'stab') icon = `<div class="stab-icon"><div class="sk"></div><div class="sk bk"></div><div class="sk"></div><div class="sk bk"></div><div class="sk"></div></div>`;
  else if (e.anim === 'bass') icon = `<div class="bass-icon"><div class="bb"></div><div class="bb"></div><div class="bb"></div><div class="bb"></div><div class="bb"></div></div>`;
  return `<div class="element-item"><div class="element-icon">${icon}</div><div><div class="el-name">${e.name}</div><div class="el-desc">${e.desc}</div></div></div>`;
}

function renderProduction() {
  const g = GENRES[curGenre]; if (!g) return;
  const ptEl = document.getElementById('prodTitle');
  if (ptEl) ptEl.textContent = g.title;
  const pmEl = document.getElementById('prodMeta');
  if (pmEl) pmEl.textContent = `${g.bpm} BPM · ${g.sub}`;
  const bbEl = document.getElementById('bpmBadge');
  if (bbEl) bbEl.textContent = `${g.bpm} BPM`;
  const pkn = document.getElementById('prodKeyNote');
  if (pkn) pkn.textContent = displayKeyLabel();
  const pkm = document.getElementById('prodKeyMode');
  if (pkm) pkm.textContent = gm().name;
  const pc = document.getElementById('prodCards');
  if (pc) pc.innerHTML = g.cards.map(c =>
    `<div class="prod-card"><h3>${c.h}</h3><div class="bigline">${c.b}</div><p>${c.p}</p></div>`
  ).join('');
  const mg = document.getElementById('midiGrid');
  if (mg) mg.innerHTML = g.pattern.map((r, ri) =>
    `<div class="midi-row" style="grid-template-columns:60px repeat(16,1fr);gap:3px">
      <div class="midi-label">${r.label}</div>
      ${r.p.map((v, i) =>
        `<div class="step${v ? ' on '+r.cl : ''} ${i % 4 === 0 ? 'beat-1' : ''}" id="s-${ri}-${i}"></div>`
      ).join('')}
    </div>`
  ).join('');
  const es = document.getElementById('elementsSection');
  if (es) es.innerHTML = `
    <div class="elements-card"><h3>${t('production.instruments')}</h3>${g.elements.slice(0,3).map(_ae).join('')}</div>
    <div class="elements-card"><h3>${t('production.more')}</h3>${g.elements.slice(3).map(_ae).join('')}</div>`;
  const pl = document.getElementById('progList');
  if (pl) pl.innerHTML = g.progressions.map(pr =>
    `<div class="prog-item">
      <div class="prog-chords">${pr.chords.map(c => `<span class="prog-chord">${c}</span>`).join('')}</div>
      <div class="prog-desc">${pr.desc}</div>
    </div>`
  ).join('');
  const gr2 = document.getElementById('grooveRules');
  if (gr2) gr2.innerHTML = g.groove.map((r, i) =>
    `<div class="groove-rule">
      <div class="rule-num">${String(i+1).padStart(2,'0')}</div>
      <div class="rule-text">${r}</div>
    </div>`
  ).join('');
}

function togglePlay() { if (playing) stopPlay(); else startPlay(); }
function startPlay() {
  playing = true; pStep = 0;
  const playBtn = document.getElementById('playBtn');
  if (playBtn) { playBtn.classList.add('playing'); playBtn.textContent = t('play.stop'); }
  const g = GENRES[curGenre];
  pInterval = setInterval(() => {
    const prev = (pStep - 1 + 16) % 16;
    g.pattern.forEach((_, ri) => { document.getElementById(`s-${ri}-${prev}`)?.classList.remove('playing'); });
    g.pattern.forEach((r, ri) => { if (r.p[pStep]) document.getElementById(`s-${ri}-${pStep}`)?.classList.add('playing'); });
    pStep = (pStep + 1) % 16;
  }, 60000 / (g.bpm * 4));
}
function stopPlay() {
  playing = false;
  clearInterval(pInterval);
  const playBtn = document.getElementById('playBtn');
  if (playBtn) { playBtn.classList.remove('playing'); playBtn.textContent = t('play.play'); }
  document.querySelectorAll('.step.playing').forEach(el => el.classList.remove('playing'));
}

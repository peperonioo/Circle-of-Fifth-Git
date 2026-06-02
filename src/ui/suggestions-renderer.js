// ── SUGGESTIONS RENDERER ──────────────────────────────
// Renders Klimper-style weighted suggestion bubbles.

function _metricBar(label, value, type, shortClass) {
  const hot = value >= 70;
  return `<div class="metric-line">
    <span class="metric-name ${shortClass}"><span>${label}</span></span>
    <span class="metric-track"><i class="metric-fill ${type || ''} ${hot ? 'hot' : ''}" style="width:${clamp(value, 0, 100)}%"></i></span>
  </div>`;
}

function renderMeter(label, value) {
  const cls = value >= 72 ? 'high' : value >= 45 ? 'medium' : 'low';
  return `<div class="meter-row ${cls}">
    <div class="meter-label">${label}</div>
    <div class="meter"><span style="width:${clamp(value)}%"></span></div>
    <div class="meter-num">${clamp(value)}</div>
  </div>`;
}

function moodButtons() {
  const root = document.getElementById('moodLens'); if (!root) return;
  root.innerHTML = Object.entries(MOOD_PROFILES).map(([id, p]) =>
    `<button class="mood-btn${(st.mood || 'balanced') === id ? ' active' : ''}" onclick="AppActions.setMood('${id}')">${p.label}</button>`
  ).join('');
}

function renderMoodStatus() {
  const el = document.getElementById('moodStatus'); if (!el) return;
  const p    = MOOD_PROFILES[st.mood || 'balanced'] || MOOD_PROFILES.balanced;
  const from = curDeg >= 0 ? gc()[curDeg] : gc()[0];
  el.innerHTML = `<div class="mood-copy"><b>${p.label}</b> lens · ${p.desc}</div>
    <div class="mood-weight">From ${from.degree} · ${from.chord}</div>`;
}

function renderGravityStatus() {
  const el = document.getElementById('gravityStatus'); if (!el) return;
  const fromIdx = curDeg >= 0 ? curDeg : 0;
  const c = gc()[fromIdx], g = harmonicGravity(fromIdx);
  el.innerHTML = `
    <div class="gravity-card">
      <div class="g-main">
        <span class="g-label">Harmonic gravity</span>
        <span class="g-value">${c.chord}</span>
        <span class="g-sub">${c.degree} · ${g.name} · ${g.role}</span>
      </div>
      <div class="gravity-pill-row">
        ${metricPill('Resolution', g.resolution)}
        ${metricPill('Tension',    g.tension)}
        ${metricPill('Motion',     g.movement)}
      </div>
    </div>`;
}

function _buildBubblesHTML() {
  const from    = curDeg >= 0 ? curDeg : 0;
  const all     = SuggestionEngine.getNextWithScores(from);
  const current = gc()[from];
  const bubbles = all.map((it, i) => {
    const normalized = Math.max(0, Math.min(1, (it.fit - 18) / 82));
    const d   = Math.round(62 + Math.pow(normalized, 1.65) * 96);
    const cat = friendlyCategory(it.transition?.category);
    return `<button class="next-bubble ${i === 0 ? 'best' : ''}"
        style="--fit:${it.fit};--d:${d}px;--rank:${i}"
        onclick="AppActions.selectDegree(${it.to},{force:true})"
        title="${it.fit}% fit · ${cat}">
      <span class="nb-fit">${it.fit}%</span>
      <span class="nb-chord">${it.chord.chord}</span>
      <span class="nb-degree">${it.chord.degree}</span>
      <span class="nb-category">${cat}</span>
      <span class="nb-metrics">
        ${_metricBar('Resolution', it.m.resolution, 'resolution', 'res')}
        ${_metricBar('Tension',    it.m.tension,    'tension',    'ten')}
        ${_metricBar('Motion',     it.m.movement,   'motion',     'mot')}
      </span>
    </button>`;
  }).join('');

  const best = all[0];
  const bestText = best
    ? `<span><b>${best.chord.chord}</b> is the strongest next move from <b>${current.chord}</b>.</span>
       <span class="mini-tag">${friendlyCategory(best.transition?.category)}</span>`
    : '<span>Choose a degree to get next moves.</span>';

  return `<div class="builder-next-top">
    <div>
      <div class="builder-next-title">Suggested next chords</div>
      <div class="builder-next-hint">The larger the circle, the stronger the next move from ${current.chord}.</div>
    </div>
    <div class="builder-next-context">R Resolution · T Tension · M Motion</div>
  </div>
  <div class="next-orbit">${bubbles}</div>`;
}

function renderProgressionStory() {
  const el = document.getElementById('progressionStory'); if (!el) return;
  el.classList.add('builder-next-moves');
  el.innerHTML = _buildBubblesHTML();
}

function renderSuggestions() {
  // The old .suggestions-section is hidden; bubbles live in the builder.
  try { moodButtons(); renderMoodStatus(); renderGravityStatus(); } catch (_) {}
  renderProgressionStory();
  const root = document.getElementById('suggestions');
  if (root) root.innerHTML = '';
}

function applyProgression(indices) {
  if (!Array.isArray(indices)) return;
  indices.forEach(i => HistoryEngine.addDegree(i));
  const last = indices[indices.length - 1];
  if (Number.isInteger(last)) AppActions.selectDegree(last, { fromHistory: true });
}

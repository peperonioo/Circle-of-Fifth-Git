// ── THEORY RENDERER ───────────────────────────────────
// Renders scale info cards, degree row, info boxes.

function renderScaleChips(containerId) {
  const root = document.getElementById(containerId); if (!root) return;
  const scale = gs();
  root.innerHTML = scale.map((n, i) =>
    `<span class="chip ${i === 0 ? 'root-chip' : ''}">${n}</span>`
  ).join('');
}

function renderTheory() {
  // Key / Root card
  const sk = document.getElementById('sideKey');
  const sm = document.getElementById('sideMode');
  if (sk) sk.textContent = displayKeyLabel();
  if (sm) sm.textContent = gm().name;

  // Relative minor card
  const rmb = document.getElementById('relMinorBig');
  if (rmb) rmb.textContent = grel();

  // Accidentals card
  const aIdx = FIFTHS.indexOf(anchorKey());
  const accEl = document.getElementById('accidentals');
  const accType = document.getElementById('accidentalType');
  if (accEl) accEl.textContent = ACC[aIdx] === '0' ? '♮ None' : ACC[aIdx];
  if (accType) {
    const a = ACC[aIdx];
    accType.textContent = a === '0' ? 'Natural' : a.includes('♯') ? 'Sharps' : 'Flats';
  }

  // Major/minor toggle buttons
  document.getElementById('viewMajorBtn')?.classList.toggle('active', st.wheelView !== 'minor');
  document.getElementById('viewMinorBtn')?.classList.toggle('active', st.wheelView === 'minor');

  // Degrees row
  const dRow = document.getElementById('degrees'); if (!dRow) return;
  const chords = gc();
  dRow.innerHTML = chords.map((c, i) => `
    <div class="degree ${i === 0 ? 'tonic' : ''} ${i === curDeg ? 'active-deg' : ''}"
      onclick="showDegreePopup(${i})"
      data-degree-index="${i}">
      <div class="roman">${c.degree}</div>
      <div class="dn">${c.chord}</div>
      <div class="dq">${c.quality}</div>
    </div>`).join('');

  // Scale notes boxes
  renderScaleChips('scaleNotes');
  renderScaleChips('scaleBox');

  // Re-render mode menu label
  renderModeMenu();
}

function setWheelView(view) { AppActions.setWheelView(view); }

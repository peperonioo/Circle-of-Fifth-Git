// ── POPOVER MANAGER ───────────────────────────────────
// One overlay system for degree popups and theory help.

function positionTheoryHelp(pop, trigger) {
  if (!pop || !trigger) return;
  pop.classList.remove('flip');
  const r = trigger.getBoundingClientRect();
  const gap = 12, pad = 14;
  const wasOpen = pop.classList.contains('open');
  if (!wasOpen) { pop.style.visibility = 'hidden'; pop.classList.add('open'); }
  const pw = pop.offsetWidth || 300, ph = pop.offsetHeight || 130;
  let left = r.right + gap;
  let top  = r.top + r.height / 2 - ph / 2;
  if (left + pw > innerWidth - pad) { left = r.left - pw - gap; pop.classList.add('flip'); }
  if (left < pad) { left = Math.min(Math.max(pad, r.left), innerWidth - pw - pad); top = r.bottom + 10; pop.classList.remove('flip'); }
  top = Math.max(pad, Math.min(top, innerHeight - ph - pad));
  pop.style.left = `${left}px`;
  pop.style.top  = `${top}px`;
  pop.style.visibility = '';
  if (!wasOpen) pop.classList.remove('open');
}

function toggleTheoryHelp(ev, id) {
  const pop = document.getElementById(id);
  const trigger = ev?.currentTarget;
  if (!pop) return;
  const isOpen = pop.classList.contains('open');
  document.querySelectorAll('.micro-popover').forEach(p => {
    if (p !== pop) p.classList.remove('open');
  });
  if (isOpen) { pop.classList.remove('open'); return; }
  positionTheoryHelp(pop, trigger);
  pop.classList.add('open');
}

function closeTheoryHelp(id) { document.getElementById(id)?.classList.remove('open'); }

function fillPopup(idx) {
  const d = degreeCopy()[idx], c = gc()[idx], w = degreeWeight(idx);
  document.getElementById('pTitle').textContent  = `${c.chord} — ${d.role}`;
  document.getElementById('pSub').textContent    = `Weight ${w.score}/100 · ${w.role} · ${c.degree}`;
  document.getElementById('pDesc').textContent   = d.feel;
  document.getElementById('pFeel').textContent   = '';
  document.getElementById('pPairs').innerHTML    = d.pairs.slice(0, 3).map(p => `<span class="ppair">${p}</span>`).join('');
  document.getElementById('degDots').innerHTML   = '';
  document.querySelectorAll('.degree').forEach((el, i) => el.classList.toggle('active-deg', i === idx));
}

function showDegreePopup(idx) {
  const wrap = document.getElementById('degWrap');
  if (!wrap) return;
  if (curDeg === idx) { AppActions.clearDegree(); return; }
  curDeg = idx;
  fillPopup(idx);
  wrap.classList.add('open');
  const popup = document.getElementById('degPopup');
  if (popup) { popup.style.opacity = '1'; popup.style.transform = 'translateX(0)'; }
  renderSuggestions();
}

function closePopup(update = true) {
  curDeg = -1;
  document.getElementById('degWrap')?.classList.remove('open');
  document.querySelectorAll('.degree').forEach(el => el.classList.remove('active-deg'));
  if (update) renderSuggestions();
}

// Degree popup swipe / scroll navigation
(function () {
  let tx = 0, sa = 0, ln = 0;
  function nav(d) {
    if (curDeg < 0) return;
    const n = (curDeg + d + 7) % 7;
    curDeg = -1;
    showDegreePopup(n);
  }
  document.addEventListener('wheel', e => {
    const w = document.getElementById('degWrap');
    if (!w || !w.classList.contains('open')) return;
    if (!w.contains(e.target) && !document.getElementById('degrees')?.contains(e.target)) return;
    e.preventDefault();
    sa += e.deltaX || e.deltaY;
    const now = Date.now();
    if (Math.abs(sa) < 50 || now - ln < 350) return;
    ln = now;
    nav(sa > 0 ? 1 : -1);
    sa = 0;
  }, { passive: false });
  document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const w = document.getElementById('degWrap');
    if (!w || !w.classList.contains('open')) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) nav(dx < 0 ? 1 : -1);
  }, { passive: true });
})();

// ── WHEEL INTERACTION ─────────────────────────────────
// Drag-roulette, snap-to-key, click handling.

let spinAnim = null;
let wheelDrag = null;
let suppressWheelClick = false;

function wheelPointerAngle(e) {
  const svg   = document.getElementById('wheelSvg');
  const rect  = svg.getBoundingClientRect();
  const cx    = rect.left + rect.width / 2;
  const cy    = rect.top  + rect.height / 2;
  const dx    = (e.clientX ?? e.touches?.[0]?.clientX) - cx;
  const dy    = (e.clientY ?? e.touches?.[0]?.clientY) - cy;
  return Math.atan2(dy, dx) * 180 / Math.PI + 90;
}

function applyWheelRotation(rot) {
  wRot = rot;
  const grp = document.getElementById('wg');
  if (grp) grp.setAttribute('transform', `rotate(${rot},300,300)`);
  syncWheelLabels(rot);
}

function updatePanelsAfterSpin() {
  const idx   = nearestFifthIndex(wRot);
  const key   = FIFTHS[idx];
  if (key !== anchorKey()) AppActions.setKey(key);
  else { renderTheory(); renderSuggestions(); }
}

function settleWheelFrom(rot, velocity) {
  const DECEL = 0.94, SNAP_SPEED = 2;
  let v = velocity;
  let r = rot;
  function step() {
    if (Math.abs(v) < SNAP_SPEED) {
      const target = -nearestFifthIndex(r) * 30;
      const delta  = shortestDelta(target, r);
      const dur    = 480, t0 = performance.now();
      const r0     = r;
      function snap(now) {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        applyWheelRotation(r0 + delta * e);
        if (p < 1) spinAnim = requestAnimationFrame(snap);
        else { applyWheelRotation(target); updatePanelsAfterSpin(); }
      }
      spinAnim = requestAnimationFrame(snap);
      return;
    }
    v *= DECEL;
    r += v;
    applyWheelRotation(r);
    spinAnim = requestAnimationFrame(step);
  }
  if (spinAnim) cancelAnimationFrame(spinAnim);
  spinAnim = requestAnimationFrame(step);
}

function selectWheelKey(majorKey) {
  AppActions.setKey(majorKey);
}

function initWheelRoulette() {
  const svg = document.getElementById('wheelSvg'); if (!svg) return;
  let startAngle = 0, startRot = 0, lastAngle = 0, lastTime = 0, angularVelocity = 0;
  const MIN_DRAG_DEG = 4;

  function onPointerDown(e) {
    if (e.target.closest('#wheelInfoBtn')) return;
    if (spinAnim) cancelAnimationFrame(spinAnim);
    const angle  = wheelPointerAngle(e);
    startAngle   = angle;
    startRot     = wRot;
    lastAngle    = angle;
    lastTime     = performance.now();
    angularVelocity = 0;
    wheelDrag    = { moved: false };
    suppressWheelClick = false;
    InteractionController.start('wheel');
  }

  function onPointerMove(e) {
    if (!wheelDrag) return;
    const angle  = wheelPointerAngle(e);
    const delta  = shortestDelta(angle, lastAngle);
    const now    = performance.now();
    const dt     = now - lastTime;
    if (dt > 0) angularVelocity = delta / dt * 16;
    lastAngle = angle;
    lastTime  = now;
    const newRot = startRot + shortestDelta(angle, startAngle);
    applyWheelRotation(newRot);
    if (Math.abs(shortestDelta(angle, startAngle)) > MIN_DRAG_DEG) {
      wheelDrag.moved    = true;
      suppressWheelClick = true;
    }
  }

  function onPointerUp() {
    if (!wheelDrag) return;
    const moved = wheelDrag.moved;
    wheelDrag   = null;
    InteractionController.end();
    if (moved) {
      settleWheelFrom(wRot, angularVelocity);
    } else {
      suppressWheelClick = false;
    }
    // Reset suppress flag after next event cycle
    if (moved) setTimeout(() => { suppressWheelClick = false; }, 80);
  }

  svg.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup',   onPointerUp,   { passive: true });
}

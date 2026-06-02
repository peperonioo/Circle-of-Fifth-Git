// ── BUILDER INTERACTION ───────────────────────────────

const DegreeDrag = {
  over(e)  { e.preventDefault(); },
  drop(e)  {
    e.preventDefault();
    const idx = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(idx)) AppActions.selectDegree(idx);
  },
};

function animateChordToBuilder(sourceEl, idx) {
  if (!sourceEl) return;
  const builderRow = document.getElementById('flowRow'); if (!builderRow) return;
  const srcRect = sourceEl.getBoundingClientRect();
  const dstRect = builderRow.getBoundingClientRect();

  const ghost = document.createElement('div');
  ghost.textContent = gc()[idx]?.chord || '';
  ghost.style.cssText = `
    position:fixed;
    left:${srcRect.left + srcRect.width/2}px;
    top:${srcRect.top  + srcRect.height/2}px;
    transform:translate(-50%,-50%) scale(1);
    font-family:'DM Serif Display',serif;
    font-size:20px;
    color:var(--ink);
    pointer-events:none;
    z-index:9999;
    opacity:1;
    transition:all 0.38s cubic-bezier(.22,1,.36,1);
    will-change:transform,opacity;
  `;
  document.body.appendChild(ghost);

  requestAnimationFrame(() => {
    ghost.style.left    = `${dstRect.left + dstRect.width/2}px`;
    ghost.style.top     = `${dstRect.top  + dstRect.height/2}px`;
    ghost.style.opacity = '0';
    ghost.style.transform = 'translate(-50%,-50%) scale(0.5)';
  });
  ghost.addEventListener('transitionend', () => ghost.remove(), { once: true });
}

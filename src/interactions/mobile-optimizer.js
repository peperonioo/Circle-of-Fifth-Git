// ── MOBILE OPTIMIZER ──────────────────────────────────

const InteractionController = {
  active: null,
  start(type) { this.active = { type, ts: Date.now() }; document.body.dataset.interaction = type; },
  end()        { this.active = null; delete document.body.dataset.interaction; },
  is(type)     { return this.active && this.active.type === type; },
};

const MobileOptimizer = {
  isMobile: matchMedia('(max-width: 860px)').matches,

  init() {
    const mq    = matchMedia('(max-width: 860px)');
    const apply = () => {
      this.isMobile = mq.matches;
      document.documentElement.classList.toggle('is-mobile-browser', this.isMobile);
    };
    apply();
    mq.addEventListener?.('change', apply);
    document.addEventListener('touchstart', () => {}, { passive: true });

    // Collapse the instrument drawers by default on mobile (§10.5): they are
    // optional support and should not push the harmony flow down the page.
    if (this.isMobile) {
      document.querySelectorAll('.drawers .drawer[open]')
        .forEach(d => d.removeAttribute('open'));
    }

    // Prevent page scroll while the wheel is being dragged
    const wheel = document.getElementById('wheelSvg');
    if (wheel) {
      ['touchmove', 'pointermove'].forEach(ev =>
        wheel.addEventListener(ev, e => {
          if (InteractionController.active) e.preventDefault();
        }, { passive: false })
      );
    }
  },
};

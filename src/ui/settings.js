// ── SETTINGS (V5.39) ──────────────────────────────────
// A gear in the top bar opens this sheet: theme, language and the plasma palette
// (moved out of the top bar / bottom bar into one place).
const Settings = (() => {
  let _open = false;
  const el = () => document.getElementById('settingsSheet');

  function syncActive() {
    const light = document.body.classList.contains('light');
    el()?.querySelectorAll('[data-theme]').forEach(b => b.classList.toggle('on', (b.dataset.theme === 'light') === light));
    el()?.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === st.lang));
  }

  function setTheme(tk) {
    const light = document.body.classList.contains('light');
    if ((tk === 'light') !== light && typeof toggleTheme === 'function') toggleTheme();
    syncActive();
  }
  function setLang(l) { if (typeof setLanguage === 'function') setLanguage(l); syncActive(); }

  function show()  { const b = el(); if (!b) return; b.hidden = false; requestAnimationFrame(() => b.classList.add('open')); _open = true; syncActive();
                     if (typeof OverlayManager === 'object') OverlayManager.opened('settings'); }
  function close() { const b = el(); if (!b) return; b.classList.remove('open'); _open = false; setTimeout(() => { if (!_open) b.hidden = true; }, 200); }
  function toggle(){ _open ? close() : show(); }

  return { show, close, toggle, setTheme, setLang, syncActive, isOpen: () => _open };
})();

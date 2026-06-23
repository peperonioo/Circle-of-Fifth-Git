// ── STATE ─────────────────────────────────────────────
// Single source of truth. Only mutated through AppActions/ActionDispatcher.

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const saved = JSON.parse(raw);
    return { ...defaultState, ...saved };
  } catch (_) {
    return { ...defaultState };
  }
}

function saveState() {
  try {
    // st.history is the working copy of the *active* section — mirror it back into
    // st.sections before persisting so the inactive section is never lost.
    if (st.sections && st.activeSection && Array.isArray(st.sections[st.activeSection])) {
      st.sections[st.activeSection] = st.history;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
  } catch (_) {}
}

let st = loadSavedState();

// ── A/B sections ──────────────────────────────────────
// The builder edits two parts, A and B. All existing code operates on st.history,
// so we keep st.history pointing at the active section's array; switchSection()
// swaps it. Older saves (flat history, no sections) migrate into section A.
(function migrateSections() {
  if (!st.sections || typeof st.sections !== 'object') {
    st.sections = { A: Array.isArray(st.history) ? st.history : [], B: [] };
  }
  if (!Array.isArray(st.sections.A)) st.sections.A = [];
  if (!Array.isArray(st.sections.B)) st.sections.B = [];
  if (st.activeSection !== 'A' && st.activeSection !== 'B') st.activeSection = 'A';
  st.history = st.sections[st.activeSection];          // alias the active section
})();

// curDeg is not in st because it is a transient UI state (which degree popup is open)
let curDeg   = -1;
let curGenre = st.genre || 'house';
let isLight  = st.theme === 'light';
let playing  = false, pInterval = null, pStep = 0;

const AppState = {
  get()    { return { ...st }; },
  set(key, value) { st[key] = value; saveState(); },
  snapshot() { return JSON.parse(JSON.stringify(st)); },
};

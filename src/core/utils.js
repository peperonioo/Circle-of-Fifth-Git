// ── UTILS ─────────────────────────────────────────────
// Pure helpers. No DOM access. No direct state mutation.

const stripMinorSuffix = (key) => String(key || 'C').replace(/m$/, '');

const ni = n => { const i = NOTES.indexOf(n); return i >= 0 ? i : (ENH[n] ?? 0); };
const na = i => NOTES[(i + 120) % 12];
const dn = n => (['Ab','Bb','Db','Eb','Gb'].includes(n) ? n : (FM[n] || n));

const gm  = ()  => MODES.find(m => m.id === st.mode);
const gs  = ()  => { const r = ni(st.key); return gm().intervals.map(i => dn(na(r + i))); };
const gr  = ()  => { const r = ni(st.key); return gm().intervals.map(i => na(r + i)); };
const gc  = ()  => { const s = gs(), m = gm(); return s.map((n, i) => ({ degree: m.degrees[i], note: n, quality: m.qualities[i], chord: n + (m.qualities[i] === 'Min' ? 'm' : m.qualities[i] === 'Dim' ? '°' : '') })); };
// The relative key shown on the side card: relative MAJOR when we're in a minor
// mode, relative MINOR when we're in a major mode — derived from the sector.
const grel = () => {
  const sector = parentMajor(st.key, st.mode);
  if (modeIsMinor(st.mode)) return sector + ' ' + t('common.major');
  const relRoot = stripMinorSuffix(relativeMinor(sector) || '');
  return (relRoot ? spellForSector(ni(relRoot), sector) : '') + ' ' + t('common.minor');
};

function clamp(v, min = 0, max = 100) { return Math.max(min, Math.min(max, Math.round(v))); }

function modeFriendly(id) {
  return (MODE_FRIENDLY[st.lang || 'en'] || MODE_FRIENDLY.en)[id] || [id, ''];
}

// ── Unified key/mode model (V4.3) ─────────────────────
// Single source of truth: st.key = the TONIC note, st.mode = the mode. The
// "sector" (parent-major key signature) is derived, and st.wheelView is just a
// mirror of whether the mode is minor — never an independent control.

const modeIsMinor   = mode => MINOR_MODES.has(mode);
const fifthsIndexOf = note => ((ni(note) * 7) % 12 + 12) % 12;

// The parent-major key (FIFTHS sector) for a given tonic + mode.
function parentMajor(tonic, mode) {
  const idx = ((fifthsIndexOf(tonic) + (MODE_FIFTHS_OFF[mode] ?? 0)) % 12 + 12) % 12;
  return FIFTHS[idx];
}

// Spell a pitch class to match the sector's signature (flats in flat keys).
function spellForSector(pitch, sectorMajor) {
  const sharp = na(((pitch % 12) + 12) % 12);
  return FLAT_KEYS.has(sectorMajor) ? (FM[sharp] || sharp) : sharp;
}

// The tonic note when the active sector is `sectorMajor` and the mode is `mode`.
// (Ionian keeps the sector's own nicely-spelled name.)
function tonicForSectorMode(sectorMajor, mode) {
  const deg = MODE_SECTOR_DEG[mode] ?? 0;
  if (deg === 0) return sectorMajor;
  return spellForSector(ni(sectorMajor) + IONIAN_STEPS[deg], sectorMajor);
}

// The ONE place key/mode are mutated together, keeping wheelView in sync.
function applyKeyMode(tonic, mode) {
  st.key = tonic;
  st.mode = mode;
  st.wheelView = modeIsMinor(mode) ? 'minor' : 'major';
}

function normalizeKeyState() {
  if (!st.key) st.key = 'C';
  // Legacy state migration: a minor-suffixed key ('Am') becomes its plain tonic
  // ('A') paired with a minor mode.
  if (typeof st.key === 'string' && /m$/.test(st.key) && MINOR_ROOTS.has(st.key)) {
    st.key = stripMinorSuffix(st.key);
    if (!modeIsMinor(st.mode)) st.mode = 'aeolian';
  }
  if (!(NOTES.includes(st.key) || (st.key in ENH))) st.key = 'C';
  if (!gm()) st.mode = 'ionian';
  st.wheelView = modeIsMinor(st.mode) ? 'minor' : 'major';
}

// The FIFTHS (major) key whose SECTOR the current selection occupies — what the
// wheel rotates/highlights by. Stable when toggling major↔relative-minor.
function wheelKey()  { return parentMajor(st.key, st.mode); }
function anchorKey() { return parentMajor(st.key, st.mode); }

// The tonic, spelled for its sector — the big centre label.
function displayKeyLabel() {
  return spellForSector(ni(st.key), parentMajor(st.key, st.mode));
}

function metricClass(value) {
  const v = clamp(value);
  return v >= 78 ? 'high' : v >= 55 ? 'medium' : 'soft';
}

function metricPill(label, value) {
  const v = clamp(value), cls = metricClass(v);
  return `<span class="gravity-pill metric ${cls}">${label} ${v}</span>`;
}

// SVG helpers — used by both wheel-renderer and direction-guide
const NS = 'http://www.w3.org/2000/svg';
function se(tag, attrs) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}
function polar(r, deg) {
  const a = (deg - 90) * Math.PI / 180;
  return [300 + r * Math.cos(a), 300 + r * Math.sin(a)];
}

// ── ONBOARDING / WELCOME TOUR ─────────────────────────
// A premium, dynamic first-run walkthrough that teaches the core flow from a
// musician/producer's angle: choose a key → build → hear → produce. Each slide
// has a live animated SVG illustration. Shown once (st.onboarded); re-openable
// from the header "?" button. Bilingual (EN/ES) so it never touches the big i18n
// tables.
const Onboarding = (() => {
  const L = o => (o && (o[st.lang] || o.en)) || '';
  const es = () => st.lang === 'es';

  // ── Live illustrations (SVG strings, animated via onboarding.css) ──
  function artWheel() {
    let dots = '';
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 - 90) * Math.PI / 180;
      const x = (180 + 66 * Math.cos(a)).toFixed(1), y = (100 + 66 * Math.sin(a)).toFixed(1);
      dots += `<circle cx="${x}" cy="${y}" r="3" fill="var(--accent2)" class="ob-c ob-pulse" style="animation-delay:${(i * 0.1).toFixed(2)}s"/>`;
    }
    return `<svg viewBox="0 0 360 200" class="ob-svg">
      <defs><radialGradient id="obGlow1"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".5"/><stop offset="70%" stop-color="var(--accent)" stop-opacity="0"/></radialGradient></defs>
      <circle cx="180" cy="100" r="94" fill="url(#obGlow1)" class="ob-glow"/>
      <circle cx="180" cy="100" r="66" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-dasharray="3 9" opacity=".75" class="ob-c ob-spin"/>
      <circle cx="180" cy="100" r="48" fill="none" stroke="var(--ink)" stroke-opacity=".16" stroke-width="1.2"/>
      <circle cx="180" cy="100" r="30" fill="none" stroke="var(--ink)" stroke-opacity=".1" stroke-width="1"/>
      ${dots}
      <circle cx="180" cy="100" r="9" fill="var(--accent)" class="ob-c ob-pulse"/>
    </svg>`;
  }

  function chip(x, y, label, bright, delay) {
    return `<g class="ob-c ob-pop" style="animation-delay:${delay}s">
      <rect x="${x - 15}" y="${y - 9}" width="30" height="18" rx="6" fill="rgba(var(--ba-rgb),${bright ? .24 : .12})" stroke="rgba(var(--ba-rgb),${bright ? .6 : .32})" stroke-width="1"/>
      <text x="${x}" y="${y + 3.5}" text-anchor="middle" font-size="9" font-family="DM Mono,monospace" fill="${bright ? 'var(--accent2)' : 'var(--muted)'}">${label}</text>
    </g>`;
  }
  function artLock() {
    const chips = [
      chip(180, 42, 'C', true, '0.05'), chip(258, 78, 'G', true, '0.13'), chip(102, 78, 'F', true, '0.21'),
      chip(224, 142, 'Em', false, '0.30'), chip(180, 156, 'Am', false, '0.38'), chip(136, 142, 'Dm', false, '0.46'),
    ].join('');
    return `<svg viewBox="0 0 360 200" class="ob-svg">
      <circle cx="180" cy="100" r="80" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-dasharray="5 7" opacity=".8" class="ob-c ob-spin-slow"/>
      <g class="ob-c ob-pulse">
        <rect x="171" y="98" width="18" height="14" rx="3" fill="var(--accent)"/>
        <path d="M173.5 98 v-3 a6.5 6.5 0 0 1 13 0 v3" fill="none" stroke="var(--accent)" stroke-width="2.2"/>
        <circle cx="180" cy="104.5" r="1.7" fill="#fff"/>
      </g>
      ${chips}
    </svg>`;
  }

  function artBuild() {
    let bars = '', degs = '';
    const labels = ['I', 'IV', 'V', 'vi'];
    for (let i = 0; i < 4; i++) {
      const x = 68 + i * 58;
      bars += `<rect x="${x}" y="118" width="50" height="48" rx="8" fill="var(--ink)" fill-opacity=".05" stroke="rgba(var(--ba-rgb),.32)" stroke-width="1.2" class="ob-c ob-rise" style="animation-delay:${(i * 0.14).toFixed(2)}s"/>`;
      degs += `<text x="${x + 25}" y="147" text-anchor="middle" font-size="14" font-family="DM Serif Display,serif" fill="var(--ink)" fill-opacity=".82" class="ob-rise" style="animation-delay:${(i * 0.14 + 0.06).toFixed(2)}s">${labels[i]}</text>`;
    }
    return `<svg viewBox="0 0 360 200" class="ob-svg">
      <circle cx="180" cy="56" r="27" fill="rgba(var(--ba-rgb),.16)" stroke="var(--accent)" stroke-width="2" class="ob-c ob-pulse"/>
      <circle cx="180" cy="56" r="27" fill="none" stroke="var(--accent2)" stroke-width="3" stroke-dasharray="120 60" stroke-linecap="round" opacity=".85" class="ob-c ob-spin"/>
      <text x="180" y="61" text-anchor="middle" font-size="15" font-family="DM Serif Display,serif" fill="var(--accent2)">V</text>
      ${bars}${degs}
    </svg>`;
  }

  function artHear() {
    let keys = '', blacks = '', dots = '';
    const lit = [0, 2, 4];
    for (let i = 0; i < 8; i++) {
      const x = 64 + i * 29, on = lit.includes(i);
      keys += `<rect x="${x}" y="36" width="27" height="86" rx="4" fill="${on ? 'rgba(var(--ba-rgb),.85)' : '#f4f1ec'}" stroke="var(--ink)" stroke-opacity=".22" stroke-width="1" class="${on ? 'ob-c ob-pop' : ''}" style="${on ? `animation-delay:${(i * 0.07).toFixed(2)}s` : ''}"/>`;
    }
    [0, 1, 3, 4, 5].forEach(i => { const x = 64 + (i + 1) * 29 - 8; blacks += `<rect x="${x}" y="36" width="16" height="54" rx="3" fill="#16161c"/>`; });
    for (let i = 0; i < 3; i++) { const x = 132 + i * 46; dots += `<circle cx="${x}" cy="152" r="8" fill="rgba(var(--ba-rgb),.85)" class="ob-c ob-pop" style="animation-delay:${(0.3 + i * 0.1).toFixed(2)}s"/>`; }
    return `<svg viewBox="0 0 360 200" class="ob-svg">
      ${keys}${blacks}
      <line x1="100" y1="152" x2="260" y2="152" stroke="var(--ink)" stroke-opacity=".18" stroke-width="1"/>
      ${dots}
    </svg>`;
  }

  function artProduce() {
    let pads = '', roll = '';
    for (let i = 0; i < 4; i++) { const x = 58 + i * 40; pads += `<rect x="${x}" y="42" width="32" height="32" rx="7" fill="rgba(var(--ba-rgb),.18)" stroke="rgba(var(--ba-rgb),.5)" stroke-width="1.4" class="ob-c ob-blink" style="animation-delay:${(i * 0.18).toFixed(2)}s"/>`; }
    [[58, 108, 34], [96, 124, 26], [126, 108, 40], [172, 126, 30], [208, 110, 30]].forEach((b, i) => {
      roll += `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="11" rx="3" fill="rgba(var(--ba-rgb),.6)" class="ob-c ob-rise" style="animation-delay:${(i * 0.1).toFixed(2)}s"/>`;
    });
    return `<svg viewBox="0 0 360 200" class="ob-svg">
      ${pads}${roll}
      <g class="ob-c ob-pulse">
        <circle cx="300" cy="148" r="20" fill="rgba(var(--ba-rgb),.16)" stroke="var(--accent)" stroke-width="1.6"/>
        <path d="M300 139 v15 M293 147 l7 7 7-7" stroke="var(--accent2)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <text x="300" y="183" text-anchor="middle" font-size="9" font-family="DM Mono,monospace" fill="var(--accent2)">MIDI</text>
    </svg>`;
  }

  const slides = [
    { art: artWheel,
      title: { en: 'Welcome to Easy Fifth Circle', es: 'Bienvenido a Easy Fifth Circle' },
      body:  { en: 'Your visual songwriting companion. Explore keys, build chord progressions and hear them on real instruments — no theory degree required.',
               es: 'Tu compañero visual de composición. Explora tonalidades, construye progresiones y escúchalas en instrumentos reales — sin necesidad de saber teoría.' } },
    { art: artLock,
      title: { en: 'Start with the wheel', es: 'Empieza por el círculo' },
      body:  { en: 'Spin the circle of fifths to choose your key, and tap any chord to hear it. Tap the centre to lock the key — the wheel lights up every chord that belongs to it, so you can explore freely.',
               es: 'Gira el círculo de quintas para elegir tu tonalidad y toca cualquier acorde para escucharlo. Toca el centro para bloquear el key — la rueda ilumina todos los acordes que le pertenecen, para explorar sin perderte.' } },
    { art: artBuild,
      title: { en: 'Build a progression', es: 'Construye una progresión' },
      body:  { en: 'Tap the degrees or the suggestion bubbles to add chords. The biggest bubble is the strongest next move — tuned to your genre and mood. Drag to reorder, and add colour with maj7, add9 or sus.',
               es: 'Toca los grados o las burbujas de sugerencia para añadir acordes. La burbuja más grande es el movimiento más fuerte, según tu género y mood. Arrastra para reordenar y añade color con maj7, add9 o sus.' } },
    { art: artHear,
      title: { en: 'Hear it on real instruments', es: 'Escúchalo en instrumentos reales' },
      body:  { en: 'Every chord lights up on the piano and the nylon guitar, so you see exactly how to play it — with chord diagrams and triad shapes right on the fretboard.',
               es: 'Cada acorde se ilumina en el piano y en la guitarra de nylon, así ves exactamente cómo tocarlo — con diagramas de acordes y tríadas en el mástil.' } },
    { art: artProduce,
      title: { en: 'Produce & take it with you', es: 'Produce y llévatelo' },
      body:  { en: 'Add 808/909 drums synced to your tempo, then export to MIDI, share a link or save it to your library — and drop it straight into your DAW.',
               es: 'Añade batería 808/909 sincronizada a tu tempo y expórtalo a MIDI, comparte un link o guárdalo en tu biblioteca — y llévatelo directo a tu DAW.' } },
  ];

  let idx = 0;

  function shouldShow() { return !st.onboarded; }
  function markSeen() { if (!st.onboarded) { st.onboarded = true; if (typeof saveState === 'function') saveState(); } }

  function open(force) {
    if (!force && !shouldShow()) return;
    const ov = document.getElementById('onboarding'); if (!ov) return;
    idx = 0;
    ov.hidden = false;
    requestAnimationFrame(() => ov.classList.add('ob-on'));
    document.addEventListener('keydown', _key, true);
    render();
  }
  function close() {
    const ov = document.getElementById('onboarding'); if (!ov) return;
    ov.classList.remove('ob-on');
    document.removeEventListener('keydown', _key, true);
    setTimeout(() => { ov.hidden = true; }, 300);
  }
  function skip()   { markSeen(); close(); }
  function finish() { markSeen(); close(); }
  function next()   { if (idx >= slides.length - 1) return finish(); idx++; render(); }
  function prev()   { if (idx > 0) { idx--; render(); } }
  function go(i)    { idx = Math.max(0, Math.min(slides.length - 1, i)); render(); }

  function _key(e) {
    if (e.key === 'Escape')          { e.stopPropagation(); skip(); }
    else if (e.key === 'ArrowRight') { e.stopPropagation(); next(); }
    else if (e.key === 'ArrowLeft')  { e.stopPropagation(); prev(); }
  }

  function $(id) { return document.getElementById(id); }
  function render() {
    const s = slides[idx], n = slides.length;
    if ($('obArt'))   $('obArt').innerHTML = s.art();
    if ($('obStep'))  $('obStep').textContent = `${String(idx + 1).padStart(2, '0')} · ${String(n).padStart(2, '0')}`;
    if ($('obTitle')) $('obTitle').textContent = L(s.title);
    if ($('obText'))  $('obText').textContent = L(s.body);
    const body = document.querySelector('#onboarding .ob-body');
    if (body) { body.classList.remove('ob-fade'); void body.offsetWidth; body.classList.add('ob-fade'); }
    if ($('obDots')) $('obDots').innerHTML = slides.map((_, i) =>
      `<button class="ob-dot${i === idx ? ' on' : ''}" aria-label="Step ${i + 1}" onclick="Onboarding.go(${i})"></button>`).join('');
    const back = $('obBack'), nextB = $('obNext'), skipB = $('obSkip');
    if (back)  { back.style.visibility = idx === 0 ? 'hidden' : 'visible'; back.textContent = es() ? 'Atrás' : 'Back'; }
    if (skipB) skipB.textContent = es() ? 'Saltar' : 'Skip';
    if (nextB) nextB.textContent = idx === n - 1 ? (es() ? 'Empezar a crear' : 'Start creating') : (es() ? 'Siguiente' : 'Next');
  }

  return { open, close, skip, next, prev, go, shouldShow };
})();

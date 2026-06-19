# Easy Fifth Circle — Design Consolidation Brief & Prompt
*(Para una pasada de diseño cohesiva antes de producto. V5.24 — Junio 2026.)*

> **Objetivo:** solidificar TODO en un único sistema visual. NO es un rediseño desde
> cero — la identidad ya existe y es fuerte. Es **bloquear + unificar**: misma
> tipografía, mismos colores, mismos componentes, mismo lenguaje de glass/elevación,
> e iconografía consistente. Mantener la personalidad (plasma + liquid-gel + naranja),
> eliminar la deriva acumulada al añadir features.

---

## 1. Qué es el producto

Herramienta interactiva de armonía/composición. Una **rueda de quintas viva**:
elegir tonalidad y modo, construir progresiones, escucharlas (sintetizador propio:
Rhodes FM, guitarra de nylon, batería 808/909), verlas en piano y guitarra, y
exportarlas a MIDI. PWA instalable, offline. Público: músicos y productores que
quieren acceder a todo un abanico de funciones sin saber teoría.

---

## 2. Identidad actual (MANTENER — es el ancla)

**Tipografía — familia DM (Google Fonts). Coexisten porque son la misma familia:**
- `DM Serif Display` → display: etiquetas de la rueda, nombres de acorde, números grandes, títulos de tarjeta.
- `DM Mono` → datos/etiquetas: BPM, métricas, captions, pills mono, números de traste.
- `DM Sans` → cuerpo y botones.
- *(Anton solo se usa en los PDFs de auditoría, no en la app.)*

**Color (dark por defecto, light variant existe):**
- Fondo `--bg #0a0a0b` · Tinta `--ink #f0ede8` · Muted `rgba(240,237,232,.52)`
- Acento `--accent #e8441a` · Acento claro `--accent2 #ff7048`
- **Acento de plasma** `--ba` / `--ba-rgb`: sigue la paleta de plasma activa (Cosmos / Aurora / Dusk / Amber). Es la clave de cohesión cromática — los componentes "vivos" deben tintarse con `--ba`, no con naranja hardcodeado.
- Glass: `--ui-surface`, `--ui-surface-strong`, `--ui-border`, `--ui-border-strong`.

**Tokens (single source of truth — `src/styles/tokens.css`):**
- Radios: `--r-sm 8 · --r-md 14 · --r-lg 18 · --r-pill 999`
- Ease: `cubic-bezier(.22,1,.36,1)` · velocidades `--ui-fast 160 / --ui-med 320 / --ui-slow 620`
- Sombras: `--shadow-soft`, `--shadow-lift`
- Tap target `--tap 44px` · safe-area insets

**Estética:** fondo de plasma WebGL animado + superficies "liquid-gel" (glass esmerilado, gloss, specular vivo). Naranja como acento de acción/selección.

---

## 3. Lo que NO encaja del todo (deriva a corregir)

Al crecer en features, se acumularon **~13 recetas de botón/control distintas** y una
**iconografía mixta**. Esto es lo que hay que unificar:

**Botones y controles (hoy, recetas distintas):**
`builder-btn`, `tab-btn`, `wheel-toggle`, `instr-dock-btn`, `ms-btn`, `gss-seg`,
`cv-chip`, `genre-btn`, `mood-btn`, `metro-step`, `gss-btn`, `gsc-arrow`,
`metro-sounds`. → Reducir a **1 sistema**: botón (primario/ghost/danger), pill,
**segmentado** (tabs, Major/Minor, Chords|Triads, sonidos metrónomo, géneros = el MISMO componente), chip.

**Iconografía mixta (emoji + SVG + texto):** hoy conviven emojis (`📚 🔗 ↓ ▶ ⏱ ◇ ☀ ♩ ⬡`)
con glifos SVG (dock de instrumentos) y texto. → **Un set de iconos line-SVG** coherente
(no emoji). Reemplazar: 📚 librería, 🔗 share, ↓ MIDI, ▶/■ play/stop, ⏱ count-in,
◇ voicing, ☀ tema, ♩ modo, ⬡ shapes.

**Glass/elevación:** las side-cards, el builder, los overlays (variantes, librería,
zoom), el onboarding y el dock usan tratamientos de glass ligeramente distintos.
→ **Una receta de superficie** (2–3 niveles de elevación) aplicada a todo.

**Acento:** mezcla de `--accent` literal, `rgba(232,68,26,...)` hardcodeado y `--ba`.
→ Regla: **acciones/selección = `--accent`; elementos "vivos" (burbujas, highlights,
pips de rueda) = `--ba` (plasma)**. Nada de naranja hardcodeado.

**Espaciado/tamaños:** componentes nuevos con valores ad-hoc. → Escala de espaciado +
escala tipográfica tokenizadas.

---

## 4. Inventario de superficies (para auditar componente a componente)

- **Header:** brand/wordmark, selector idioma, tema, ayuda (?), tabs Theory/Production.
- **Rueda:** SVG (sectores exterior/interior, centro/hub, anillo de bloqueo, pointer, guía de dirección).
- **Side-cards:** Key/Root, Mode (+dropdown), Accidentals, Relative minor, Scale notes.
- **Toggle Major/Minor** + menú de Modos.
- **Fila de grados** (I–vii°).
- **Builder:** timeline de compases, playhead arrastrable, acciones (Play, count-in, voicing, Library, Share, MIDI, Clear), meta/narrativa.
- **Sugerencias:** burbujas liquid-gel (anillo de fuerza), lente de mood, gravedad armónica.
- **Metrónomo:** isla Dynamic-Island (dial, tap, 3 sonidos).
- **Instrumentos:** piano, fretboard, **strip de shapes** (tarjetas mini-fretboard), **dock flotante** Piano|Guitar.
- **Producción:** batería 808/909, grid rítmico, groove.
- **Overlays:** isla de variantes de acorde, panel de librería, zoom de instrumento, mode-menu, hoja de modo móvil, popup de grado, guía de dirección.
- **Onboarding:** tour con spotlight (tooltip + dots).

---

## 5. Entregables de la pasada de diseño

**A) Sistema (lo ejecuto yo en código — refactor):**
1. `tokens.css` ampliado: escala tipográfica (display/title/body/label/mono sizes), escala de espaciado, niveles de elevación glass, roles de color.
2. **Component kit** con specs por estado: Button (primary/ghost/danger), Pill, **Segmented**, Chip, Card/Surface (3 niveles), Overlay/Island, Dot/Indicator.
3. **Icon set** line-SVG (1 estilo, 1 grosor) reemplazando todos los emoji.
4. Aplicar el kit a las ~13 recetas → 1.

**B) Marca y marketing (aquí aporta más una pasada de diseño/imagen):**
1. **Nombre** (candidatos: Cyrcle · Tonic · Prism — verificar dominio + App Store).
2. **App icon** (1024px) — el círculo de quintas + plasma + naranja, memorable a 48px.
3. **Wordmark** / logotipo con la familia DM.
4. **Landing page** (hero con la rueda viva, secciones de features, CTA de descarga, captura de emails).
5. **Plantillas de capturas App Store/Play** (6–8 frames con copy).

---

## 6. Reglas de oro para el diseñador (o para mí)

1. **No reinventar la identidad.** Familia DM, plasma, liquid-gel, naranja. Consolidar, no sustituir.
2. **Un componente por función.** Si dos cosas hacen lo mismo (p. ej. segmentados), son el mismo componente.
3. **`--ba` para lo vivo, `--accent` para la acción.** Cero naranja hardcodeado.
4. **Iconos line-SVG, no emoji.**
5. **Todo referencia tokens.** Ningún valor mágico nuevo.
6. **Móvil primero** (safe-area, tap 44px, una mano).
7. **Light + dark** deben verse igual de pulidos.
8. **Reduced-motion** respetado en cada animación.

---

## 7. Camino a producto (después de la consolidación)

1. **Consolidación UI** (código) + **marca** (nombre/icono/wordmark) — en paralelo.
2. **Landing page** con el sistema ya bloqueado (captar emails desde el día 1).
3. **Empaquetado** Capacitor/PWABuilder → App Store + Google Play (la PWA ya está lista).
4. **Freemium**: núcleo gratis; premium (sugeridor por emoción, modulaciones, export MIDI/Ableton, shapes avanzados) con desbloqueo único ~7,99–9,99€.
5. **Beta TestFlight** → lanzamiento.

> **Resumen para quien reciba este prompt:** toma la app tal cual (V5.24), respeta su
> identidad (DM + plasma + liquid-gel + naranja), y devuélveme **un sistema de diseño
> único y aplicado**: tokens, un kit de componentes con un solo botón/segmentado/card,
> un set de iconos line-SVG sin emoji, y la capa de marca (icono, wordmark, landing).
> El resultado debe sentirse como **un producto premium acabado**, no como una suma de
> features.

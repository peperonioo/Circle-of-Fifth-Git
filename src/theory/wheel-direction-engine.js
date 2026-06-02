// ── WHEEL DIRECTION GUIDE ─────────────────────────────
// Shows subtle Fifths / Fourths arcs around the wheel.
// Toggled by the info button near the wheel.

const WheelDirectionGuide = {
  visible: false,

  toggle() {
    this.visible = !this.visible;
    this.render();
    this._updateInfoBtn();
    if (this.visible) this._showPopover();
    else this._hidePopover();
  },

  render() {
    const svg = document.getElementById('wheelSvg');
    if (!svg) return;

    let guide = document.getElementById('wheelDirectionGuide');
    if (!guide) {
      guide = document.createElementNS(NS, 'g');
      guide.id = 'wheelDirectionGuide';
      guide.setAttribute('pointer-events', 'none');
      // Place after #ticks so it sits above the tick ring but below the pointer
      const ptr = document.getElementById('wheelPointer');
      if (ptr) svg.insertBefore(guide, ptr);
      else svg.appendChild(guide);
    }

    guide.innerHTML = '';
    if (!this.visible) { guide.style.opacity = '0'; return; }

    const isDark = !document.body.classList.contains('light');
    const arcStroke = isDark ? 'rgba(240,237,232,.30)' : 'rgba(20,20,20,.24)';
    const labelFill = isDark ? 'rgba(240,237,232,.55)' : 'rgba(20,20,20,.48)';
    const subFill   = isDark ? 'rgba(240,237,232,.32)' : 'rgba(20,20,20,.3)';

    // The wheel sectors end at r=286 and the viewBox edge is at r=300.
    // The arcs sit OUTSIDE the wheel in the SVG overflow region (overflow:visible),
    // and labels sit further out still, so nothing overlaps the chord names.
    const R   = 306;   // arc radius — clearly outside the wheel ring
    const RL  = 316;   // label radius — outside the arcs, in the empty corners

    // Right side = Fifths (clockwise) · Left side = Fourths (counterclockwise)
    const [rx1, ry1] = polar(R, 40);
    const [rx2, ry2] = polar(R, 140);
    const [lx1, ly1] = polar(R, 220);
    const [lx2, ly2] = polar(R, 320);

    // ── Fifths arc (right side, clockwise sweep) ──────
    const arcF = se('path', {
      d:              `M ${rx1.toFixed(1)},${ry1.toFixed(1)} A ${R},${R} 0 0 1 ${rx2.toFixed(1)},${ry2.toFixed(1)}`,
      fill:           'none',
      stroke:         arcStroke,
      'stroke-width': '1.4',
      'stroke-linecap':'round',
      'stroke-dasharray':'4 7',
      class:          'dir-arc dir-arc-fifths',
    });
    guide.appendChild(arcF);

    // Arrowhead at end of Fifths arc (clockwise, just past 140°)
    const [ax1, ay1] = polar(R - 7, 146);
    const [ax2, ay2] = polar(R + 7, 146);
    const [ax3, ay3] = polar(R,     136);
    const arrowF = se('polygon', {
      points:  `${ax1.toFixed(1)},${ay1.toFixed(1)} ${ax2.toFixed(1)},${ay2.toFixed(1)} ${ax3.toFixed(1)},${ay3.toFixed(1)}`,
      fill:    arcStroke,
      class:   'dir-arrow',
    });
    guide.appendChild(arrowF);

    // Labels for Fifths (upper-right corner, in the empty space outside the arc)
    const [fx, fy] = polar(RL, 54);
    const lFifths = se('text', {
      x: fx.toFixed(1), y: (fy - 3).toFixed(1),
      'text-anchor': 'middle',
      'font-family': 'DM Mono,monospace',
      'font-size':   '11',
      fill:          labelFill,
      'letter-spacing': '.12em',
      class: 'dir-label',
    });
    lFifths.textContent = t('dirguide.fifths').toUpperCase();
    guide.appendChild(lFifths);

    const lFifthsSub = se('text', {
      x: fx.toFixed(1), y: (fy + 11).toFixed(1),
      'text-anchor': 'middle',
      'font-family': 'DM Mono,monospace',
      'font-size':   '8',
      fill:          subFill,
      'letter-spacing': '.04em',
      class: 'dir-label-sub',
    });
    lFifthsSub.textContent = t('dirguide.clockwise') + ' ↻';
    guide.appendChild(lFifthsSub);

    // ── Fourths arc (left side, counterclockwise sweep) ─
    const arcFo = se('path', {
      d:              `M ${lx1.toFixed(1)},${ly1.toFixed(1)} A ${R},${R} 0 0 0 ${lx2.toFixed(1)},${ly2.toFixed(1)}`,
      fill:           'none',
      stroke:         arcStroke,
      'stroke-width': '1.4',
      'stroke-linecap':'round',
      'stroke-dasharray':'4 7',
      class:          'dir-arc dir-arc-fourths',
    });
    guide.appendChild(arcFo);

    // Arrowhead at end of Fourths arc (counterclockwise, just past 320°)
    const [bx1, by1] = polar(R - 7, 314);
    const [bx2, by2] = polar(R + 7, 314);
    const [bx3, by3] = polar(R,     324);
    const arrowFo = se('polygon', {
      points:  `${bx1.toFixed(1)},${by1.toFixed(1)} ${bx2.toFixed(1)},${by2.toFixed(1)} ${bx3.toFixed(1)},${by3.toFixed(1)}`,
      fill:    arcStroke,
      class:   'dir-arrow',
    });
    guide.appendChild(arrowFo);

    // Labels for Fourths (upper-left corner, in the empty space outside the arc)
    const [ox, oy] = polar(RL, 306);
    const lFourths = se('text', {
      x: ox.toFixed(1), y: (oy - 3).toFixed(1),
      'text-anchor': 'middle',
      'font-family': 'DM Mono,monospace',
      'font-size':   '11',
      fill:          labelFill,
      'letter-spacing': '.12em',
      class: 'dir-label',
    });
    lFourths.textContent = t('dirguide.fourths').toUpperCase();
    guide.appendChild(lFourths);

    const lFourthsSub = se('text', {
      x: ox.toFixed(1), y: (oy + 11).toFixed(1),
      'text-anchor': 'middle',
      'font-family': 'DM Mono,monospace',
      'font-size':   '8',
      fill:          subFill,
      'letter-spacing': '.04em',
      class: 'dir-label-sub',
    });
    lFourthsSub.textContent = '↺ ' + t('dirguide.ccw');
    guide.appendChild(lFourthsSub);

    // Animate in
    guide.style.opacity = '0';
    guide.style.transition = 'opacity 0.42s cubic-bezier(.22,1,.36,1)';
    requestAnimationFrame(() => { guide.style.opacity = '1'; });
  },

  // ── Info button (added to SVG once) ──────────────────
  addInfoButton() {
    const svg = document.getElementById('wheelSvg');
    if (!svg || document.getElementById('wheelInfoBtn')) return;
    const btn = document.createElementNS(NS, 'g');
    btn.id = 'wheelInfoBtn';
    btn.setAttribute('cursor', 'pointer');
    btn.setAttribute('class', 'wheel-info-btn');
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', 'Wheel direction guide');

    const circle = se('circle', { cx:'548', cy:'40', r:'14',
      fill: 'rgba(255,255,255,.06)', stroke: 'rgba(255,255,255,.14)', 'stroke-width':'1' });
    const text = se('text', { x:'548', y:'45', 'text-anchor':'middle',
      'font-size':'14', fill:'rgba(240,237,232,.55)', 'font-family':'DM Mono,monospace',
      'pointer-events':'none' });
    text.textContent = 'ⓘ';

    btn.appendChild(circle);
    btn.appendChild(text);
    btn.addEventListener('click', e => { e.stopPropagation(); WheelDirectionGuide.toggle(); });
    svg.appendChild(btn);
  },

  _updateInfoBtn() {
    const btn    = document.getElementById('wheelInfoBtn');
    const circle = btn?.querySelector('circle');
    if (!circle) return;
    if (this.visible) {
      circle.setAttribute('fill',   'rgba(232,68,26,.22)');
      circle.setAttribute('stroke', 'rgba(232,68,26,.55)');
    } else {
      circle.setAttribute('fill',   'rgba(255,255,255,.06)');
      circle.setAttribute('stroke', 'rgba(255,255,255,.14)');
    }
  },

  // ── Popover ───────────────────────────────────────────
  _showPopover() {
    let pop = document.getElementById('dirGuidePopover');
    if (!pop) {
      pop = document.createElement('div');
      pop.id = 'dirGuidePopover';
      pop.className = 'micro-popover dir-guide-popover';
      pop.innerHTML = `
        <button class="micro-close" onclick="WheelDirectionGuide._hidePopover()">✕</button>
        <h4 id="dgpTitle"></h4>
        <p id="dgpBody" style="white-space:pre-line"></p>`;
      document.body.appendChild(pop);
    }
    const title = document.getElementById('dgpTitle');
    const body  = document.getElementById('dgpBody');
    if (title) title.textContent = t('dirguide.popover.title');
    if (body)  body.textContent  = t('dirguide.popover.body');

    // Position near the info button
    const btn = document.getElementById('wheelInfoBtn');
    if (btn) {
      const svgEl = document.getElementById('wheelSvg');
      const svgRect = svgEl?.getBoundingClientRect();
      if (svgRect) {
        const scale = svgRect.width / 600;
        const px = svgRect.left + 548 * scale;
        const py = svgRect.top  + 40  * scale;
        const pw = pop.offsetWidth || 300;
        const ph = pop.offsetHeight || 120;
        let left = px + 20;
        if (left + pw > window.innerWidth - 14) {
          left = px - pw - 20;
          pop.classList.add('flip');
        } else {
          pop.classList.remove('flip');
        }
        const top = Math.min(Math.max(14, py - ph / 2), window.innerHeight - ph - 14);
        pop.style.left = left + 'px';
        pop.style.top  = top  + 'px';
      }
    }
    pop.classList.add('open');
  },

  _hidePopover() {
    document.getElementById('dirGuidePopover')?.classList.remove('open');
  },
};

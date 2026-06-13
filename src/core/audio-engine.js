// ── AUDIO ENGINE (V4.1) ───────────────────────────────
// A small, pleasant Web Audio synth: tap a chord to hear it, play the
// progression. Lazily creates the AudioContext on the first user gesture.

const AudioEngine = {
  ctx: null, master: null, wet: null, _playToken: 0,

  _ensure() {
    if (this.ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { this.ctx = new AC(); } catch (_) { return false; }
    const ctx = this.ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.32;
    // A soft reverb tail for a calmer, more "instrument" feel.
    const conv = ctx.createConvolver();
    conv.buffer = this._impulse(1.7, 2.6);
    this.wet = ctx.createGain(); this.wet.gain.value = 0.20;
    this.master.connect(ctx.destination);
    this.master.connect(conv); conv.connect(this.wet); this.wet.connect(ctx.destination);
    return true;
  },

  _impulse(dur, decay) {
    const rate = this.ctx.sampleRate, len = Math.floor(rate * dur);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  },

  // Must run inside a user gesture (we call it from click handlers).
  resume() {
    if (!this._ensure()) return false;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  },

  ready() { return !!this.ctx; },

  _freq(pitch) { return 261.63 * Math.pow(2, pitch / 12); }, // pitch 0 = middle C

  // One Rhodes-ish voice via FM: a sine carrier shaped by a 1:1 "body"
  // modulator plus a high-ratio "tine" modulator that gives the percussive
  // bell attack. Modulation-index envelopes make it bright on attack and warm
  // on sustain — the classic electric-piano character.
  _voice(freq, t0, dur, gainScale = 1) {
    const ctx = this.ctx;
    const carrier = ctx.createOscillator(); carrier.type = 'sine'; carrier.frequency.value = freq;
    const mod  = ctx.createOscillator(); mod.type  = 'sine'; mod.frequency.value  = freq;        // body (ratio 1)
    const tine = ctx.createOscillator(); tine.type = 'sine'; tine.frequency.value = freq * 13;    // bell tine (high ratio)
    const modIdx  = ctx.createGain();  mod.connect(modIdx);   modIdx.connect(carrier.frequency);
    const tineIdx = ctx.createGain();  tine.connect(tineIdx); tineIdx.connect(carrier.frequency);
    const amp = ctx.createGain();
    const lp  = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3800; lp.Q.value = 0.4;
    carrier.connect(amp); amp.connect(lp); lp.connect(this.master);

    const peak = 0.40 * gainScale;
    modIdx.gain.setValueAtTime(freq * 1.4, t0);
    modIdx.gain.exponentialRampToValueAtTime(freq * 0.35, t0 + 0.5);
    tineIdx.gain.setValueAtTime(freq * 2.2, t0);
    tineIdx.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12);     // fast bell decay
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(peak, t0 + 0.006);          // percussive attack
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.7);    // bell-like release

    const end = t0 + dur + 0.75;
    [carrier, mod, tine].forEach(o => { o.start(t0); o.stop(end); });
  },

  // pitches: array of relative semitones (0 = middle C). Tiny strum for life.
  playChord(pitches, dur = 0.95, when = 0) {
    if (!this.resume() || !Array.isArray(pitches) || !pitches.length) return;
    const t0 = this.ctx.currentTime + when;
    pitches.forEach((p, i) => this._voice(this._freq(p), t0 + i * 0.014, dur, 0.9));
  },

  playNote(pitch, dur = 0.7) {
    if (!this.resume()) return;
    this._voice(this._freq(pitch), this.ctx.currentTime, dur, 1);
  },

  // Play a list of chords (arrays of pitches) in sequence.
  playSequence(chordList, step = 0.62, dur = 0.7) {
    if (!this.resume() || !Array.isArray(chordList) || !chordList.length) return;
    const token = ++this._playToken;
    chordList.forEach((pitches, i) => {
      if (!pitches || !pitches.length) return;
      this.playChord(pitches, dur, i * step);
    });
    return token;
  },

  stop() {
    this._playToken++;
    if (this.ctx) {
      try { this.master.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.02); } catch (_) {}
      setTimeout(() => { try { this.master.gain.setTargetAtTime(0.32, this.ctx.currentTime, 0.05); } catch (_) {} }, 80);
    }
  },
};

// Unlock the AudioContext on the first real user gesture. Mobile Chrome/Safari
// keep it suspended until then, which is why audio was silent on the phone.
(function () {
  const unlock = () => { try { AudioEngine.resume(); } catch (_) {} };
  ['pointerdown', 'touchend', 'mousedown', 'keydown'].forEach(ev =>
    document.addEventListener(ev, unlock, { passive: true })
  );
})();

// ── Chord → pitches helpers ───────────────────────────
// Build a triad (relative to middle C) from a chord's root + quality.
function triadIntervals(quality) {
  return quality === 'Min' ? [0, 3, 7] : quality === 'Dim' ? [0, 3, 6] : [0, 4, 7];
}

// Pitches for the chord at degree `idx` of the current key/mode.
function chordPitchesForDegree(idx) {
  const c = (typeof gc === 'function') && gc()[idx];
  if (!c) return [];
  const root = ni(c.note);                       // 0–11
  return triadIntervals(c.quality).map(iv => root + iv);
}

// Pitches for a built progression item ({ degreeIndex, quality, note }).
function chordPitchesForItem(item) {
  if (!item) return [];
  const root = ni(item.note != null ? item.note : item.chord.replace(/m|°/g, ''));
  return triadIntervals(item.quality).map(iv => root + iv);
}

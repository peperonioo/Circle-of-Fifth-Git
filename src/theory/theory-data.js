// ── THEORY DATA ───────────────────────────────────────
// Static lookup data. No DOM access, no state mutation.

const THEORY_DATA = {
  modes:              MODES,
  fifths:             FIFTHS,
  relativeMinorByMajor: REL,
  relativeMajorByMinor: MINOR_ROOT_TO_MAJOR,
  degreeCopy:         DD,
};

const degreeCopy  = () => THEORY_DATA.degreeCopy;
const fifthsData  = () => THEORY_DATA.fifths;
const relativeMinor = (major) => THEORY_DATA.relativeMinorByMajor[major] || '';
const relativeMajorFromMinor = (minorRoot) => {
  const key = String(minorRoot || '');
  // Accept both 'A' and 'Am' — MINOR_ROOT_TO_MAJOR keys are 'Am' etc.
  const withM = key.endsWith('m') ? key : key + 'm';
  return MINOR_ROOT_TO_MAJOR[withM] || MINOR_ROOT_TO_MAJOR[key] || null;
};

// ── PRODUCTION DATA ────────────────────────────────────
// Each genre drives the Production tab AND the connected groove player. Drum
// rows carry `snd` (which synth voice to fire). `chordLane`/`bassLane` say on
// which 16th steps the progression's chord stabs and 808 sub-bass play.
const PRODUCTION_DATA = {
  house: {
    title:'House', bpm:124,
    sub:{en:'4/4 · kick on every beat · 120–128 BPM', es:'4/4 · kick en cada tiempo · 120–128 BPM'},
    cards:[
      {h:{en:'Feel',es:'Sensación'},    b:{en:'Four-on-the-floor',es:'Four-on-the-floor'}, p:{en:'Kick on every beat; the swing lives in the off-beat hats and bass.', es:'Kick en cada tiempo; el swing vive en los hats y el bajo a contratiempo.'}},
      {h:{en:'Harmony',es:'Armonía'}, b:{en:'7th & 9th chords',es:'Acordes de 7ª y 9ª'},  p:{en:'Jazzy, sampled-soul stabs. Add a ♭7 on the V for funk colour.', es:'Stabs con sabor jazz/soul de sampler. Añade una ♭7 en el V para color funk.'}},
      {h:{en:'Glue',es:'Cohesión'},    b:{en:'Sidechain pump',es:'Pump de sidechain'},    p:{en:'Duck the bass & pads to the kick — the signature “breathing” groove.', es:'Comprime el bajo y los pads contra el kick — el groove “que respira” tan característico.'}},
    ],
    elements:[
      {icon:'🥁',name:{en:'Kick',es:'Bombo'},    desc:{en:'Tight, punchy four-on-the-floor; tuned low, short tail.', es:'Seco y con pegada, a negras; afinado grave, cola corta.'}, gear:'Roland TR-909', anim:null},
      {icon:'👏',name:{en:'Clap',es:'Clap'},   desc:{en:'Backbeat on 2 & 4, layered with a short room reverb.', es:'Backbeat en 2 y 4, con una reverb de sala corta.'},     gear:'TR-909 / TR-808', anim:null},
      {icon:'🎩',name:{en:'Hats',es:'Hi-hats'},   desc:{en:'Closed 16ths for drive; the open hat on every off-beat (the “tss”).', es:'Cerrados a semicorcheas para empuje; el hat abierto en cada contratiempo (el “tss”).'}, gear:'TR-909', anim:null},
      {icon:'🎹',name:{en:'Organ stabs',es:'Stabs de órgano'}, desc:{en:'Off-beat chord stabs — bright, gated, syncopated.', es:'Stabs de acorde a contratiempo — brillantes, con gate, sincopados.'},   gear:'Korg M1 “Organ 2”', anim:'stab'},
      {icon:'🎸',name:{en:'Bass',es:'Bajo'},   desc:{en:'Round sub or plucky synth, off-beat bounce, sidechained to the kick.', es:'Sub redondo o synth plucky, rebote a contratiempo, con sidechain al kick.'}, gear:'TB-303 / Juno / 808 sub', anim:'bass'},
      {icon:'🎛️',name:{en:'Pad',es:'Pad'},   desc:{en:'Warm analog pad washing under the groove; filter-swept.', es:'Pad analógico cálido bajo el groove; con barrido de filtro.'},   gear:'Roland Juno-106', anim:null},
    ],
    progressions:[
      {chords:['Am','G','F','E'], desc:{en:'i – ♭VII – ♭VI – V: classic dark groove', es:'i – ♭VII – ♭VI – V: groove oscuro clásico'}},
      {chords:['Dm','Am','Bb','C'],desc:{en:'i – v – ♭VI – ♭VII: uplifting modal', es:'i – v – ♭VI – ♭VII: modal y luminoso'}},
      {chords:['Fm','Eb','Db','Ab'],desc:{en:'Minor with flat-side gravity', es:'Menor con gravedad hacia los bemoles'}},
    ],
    groove:[
      {en:'Lock the bass to the kick, then move it to the off-beats so they interlock.', es:'Ancla el bajo al kick y luego llévalo a los contratiempos para que encajen.'},
      {en:'Open hat on every “and” (the off-beat) is the house signature.', es:'El hat abierto en cada “y” (el contratiempo) es la firma del house.'},
      {en:'Sidechain bass + pads to the kick for the pumping feel.', es:'Haz sidechain del bajo y los pads al kick para el efecto de bombeo.'},
      {en:'Keep the main loop ≤ 4 bars so it cycles naturally.', es:'Mantén el loop principal en ≤ 4 compases para que cicle natural.'},
    ],
    tips:[
      {h:{en:'Arrangement',es:'Arreglo'}, items:[
        {en:'Build in 8/16/32-bar phrases — DJ-friendly intros and outros of pure drums.', es:'Construye en frases de 8/16/32 compases — intros y outros de solo batería, amigables para DJ.'},
        {en:'Breakdown: strip to pads + filtered chords, then drop the full kick + bass back in.', es:'Breakdown: reduce a pads + acordes filtrados y luego vuelve a meter el kick y el bajo completos.'},
        {en:'Automate a low-pass filter sweep across 8 bars to lift into each section.', es:'Automatiza un barrido de filtro paso-bajo en 8 compases para elevar hacia cada sección.'},
      ]},
      {h:{en:'Fills & transitions',es:'Fills y transiciones'}, items:[
        {en:'Drop the kick for the last bar before a section change — let the off-beats breathe.', es:'Quita el kick en el último compás antes de un cambio de sección — deja respirar a los contratiempos.'},
        {en:'A snare/clap roll (16ths → 32nds) builds tension into the drop.', es:'Un redoble de caja/clap (semicorcheas → fusas) crea tensión hacia el drop.'},
        {en:'Crash on beat 1 of a new section; reverse-cymbal riser in the bar before.', es:'Crash en el tiempo 1 de una sección nueva; riser de platillo invertido en el compás previo.'},
      ]},
      {h:{en:'Sound design',es:'Diseño de sonido'}, items:[
        {en:'Tune the kick to the track’s root note so it sits with the bass.', es:'Afina el kick a la tónica del tema para que case con el bajo.'},
        {en:'High-pass the pads so the low end stays clean for kick + sub.', es:'Aplica paso-alto a los pads para que los graves queden limpios para kick + sub.'},
        {en:'A touch of saturation on the bass adds harmonics that read on small speakers.', es:'Un toque de saturación en el bajo añade armónicos que se oyen en altavoces pequeños.'},
      ]},
    ],
    chordStyle:'stab',
    chordLane:[0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0],
    bassLane: [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
    pattern:[
      {label:{en:'Kick', es:'Bombo'}, cl:'',      snd:'kick', p:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]},
      {label:{en:'Clap', es:'Clap'},  cl:'clap',  snd:'clap', p:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      {label:{en:'Hat',  es:'H-hat'}, cl:'hat-c', snd:'hat',  p:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]},
      {label:{en:'Open', es:'Open'},  cl:'hat-o', snd:'open', p:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0]},
      {label:{en:'Bell', es:'Cowb'},  cl:'cowb',  snd:'cowbell', p:[0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0]},
    ],
  },
  neosoul: {
    title:'Neo Soul', bpm:90,
    sub:{en:'4/4 · laid-back, swung 16ths · 70–95 BPM', es:'4/4 · relajado, semicorcheas con swing · 70–95 BPM'},
    cards:[
      {h:{en:'Feel',es:'Sensación'},    b:{en:'Behind the beat',es:'Detrás del tiempo'},  p:{en:'Humanised, off-grid (Dilla-style). Snare drags slightly late.', es:'Humanizado, fuera de rejilla (estilo Dilla). La caja se arrastra un pelín tarde.'}},
      {h:{en:'Harmony',es:'Armonía'}, b:{en:'Extended chords',es:'Acordes extendidos'},  p:{en:'maj9, min11, dom13 with chromatic passing chords.', es:'maj9, min11, dom13 con acordes de paso cromáticos.'}},
      {h:{en:'Voice',es:'Voz'},   b:{en:'Rhodes is king',es:'El Rhodes manda'},   p:{en:'Warm electric piano with chorus/vibrato carries the song.', es:'Un piano eléctrico cálido con chorus/vibrato sostiene la canción.'}},
    ],
    elements:[
      {icon:'🥁',name:{en:'Kick',es:'Bombo'},   desc:{en:'Loose, slightly soft; 808-tinged low end, never quantised hard.', es:'Suelto y algo suave; graves con tinte 808, nunca cuantizado a la fuerza.'}, gear:'MPC / TR-808 hybrid', anim:null},
      {icon:'👏',name:{en:'Snare',es:'Caja'},  desc:{en:'Fat, roomy, dragged a hair behind the beat; ghost notes between.', es:'Gorda, con sala, arrastrada un pelín detrás del tiempo; notas fantasma entremedias.'}, gear:'Sampled vinyl / MPC', anim:null},
      {icon:'🎩',name:{en:'Hats',es:'Hi-hats'},   desc:{en:'Loose swung 16ths, velocity-varied for a human shuffle.', es:'Semicorcheas sueltas con swing, velocidad variada para un shuffle humano.'},         gear:'MPC swing 54–62%', anim:null},
      {icon:'🎹',name:{en:'Rhodes',es:'Rhodes'}, desc:{en:'Warm extended chords with chorus + vibrato; the signature sound.', es:'Acordes extendidos y cálidos con chorus + vibrato; el sonido característico.'}, gear:'Fender Rhodes Mk I', anim:'stab'},
      {icon:'🎸',name:{en:'Bass',es:'Bajo'},   desc:{en:'Fingered electric — syncopated 16ths, slides and ghosting.', es:'Eléctrico con dedos — semicorcheas sincopadas, slides y notas fantasma.'},       gear:'Fender P/J Bass', anim:'bass'},
      {icon:'🎻',name:{en:'Strings',es:'Cuerdas'},desc:{en:'Soft pad / counter-melody filling the spaces between phrases.', es:'Pad suave / contramelodía que rellena los espacios entre frases.'},    gear:'Wurlitzer / string ens.', anim:null},
    ],
    progressions:[
      {chords:['Dm9','G13','Cmaj7','Am9'], desc:{en:'ii9 – V13 – Imaj7 – vi9: classic', es:'ii9 – V13 – Imaj7 – vi9: clásica'}},
      {chords:['Fmaj7','Em7','Am7','Dm7'], desc:{en:'IV – iii – vi – ii: minor circles', es:'IV – iii – vi – ii: círculos menores'}},
      {chords:['Cm9','Fm9','Bb13','Ebmaj7'],desc:{en:'Neo soul in Eb Dorian', es:'Neo soul en Mib dórico'}},
    ],
    groove:[
      {en:'Drag the snare a few ms behind beats 2 and 4 for the lazy feel.', es:'Arrastra la caja unos ms detrás de los tiempos 2 y 4 para el feel perezoso.'},
      {en:'Add ghost snares and hat shuffles between the main hits.', es:'Añade cajas fantasma y shuffles de hat entre los golpes principales.'},
      {en:'Voice chords with extensions (maj9, min11, dom13); keep the top voice smooth.', es:'Haz el voicing con extensiones (maj9, min11, dom13); mantén suave la voz superior.'},
      {en:'Walk or syncopate the bass under static harmony for movement.', es:'Camina o sincopa el bajo bajo una armonía estática para dar movimiento.'},
    ],
    tips:[
      {h:{en:'Arrangement',es:'Arreglo'}, items:[
        {en:'Leave space — neo-soul breathes; not every bar needs every instrument.', es:'Deja espacio — el neo-soul respira; no todo compás necesita todos los instrumentos.'},
        {en:'Verse: Rhodes + bass + light drums. Chorus: add strings/keys and lift the dynamics.', es:'Verso: Rhodes + bajo + batería ligera. Estribillo: añade cuerdas/teclas y sube la dinámica.'},
        {en:'Use a 2-bar turnaround (e.g. ii–V) to loop sections smoothly.', es:'Usa un turnaround de 2 compases (p. ej. ii–V) para enlazar secciones con suavidad.'},
      ]},
      {h:{en:'Fills & embellishment',es:'Fills y adornos'}, items:[
        {en:'Rhodes runs and chromatic passing chords fill the gaps between vocal phrases.', es:'Runs de Rhodes y acordes de paso cromáticos rellenan los huecos entre frases vocales.'},
        {en:'Ghost-note snare rolls and hat triplets are the “fills” — keep them soft.', es:'Redobles de caja con notas fantasma y tresillos de hat son los “fills” — mantenlos suaves.'},
        {en:'Bass slides and dead notes add the human, finger-played feel.', es:'Los slides de bajo y las notas muertas aportan el feel humano de tocar con los dedos.'},
      ]},
      {h:{en:'Sound design',es:'Diseño de sonido'}, items:[
        {en:'Chorus + a touch of tape saturation on the Rhodes for warmth.', es:'Chorus + un toque de saturación de cinta en el Rhodes para calidez.'},
        {en:'Roomy, slightly compressed drums; sample noise/vinyl crackle for texture.', es:'Batería con sala y algo comprimida; ruido de sampler/crujido de vinilo para textura.'},
        {en:'Keep the low end mono and the bass rounded (roll off the highs).', es:'Mantén los graves en mono y el bajo redondeado (recorta los agudos).'},
      ]},
    ],
    chordStyle:'pad',
    chordLane:[1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
    bassLane: [1,0,0,0, 0,0,1,0, 0,1,0,0, 0,0,1,0],
    pattern:[
      {label:{en:'Kick', es:'Bombo'}, cl:'',      snd:'kick',   p:[1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0]},
      {label:{en:'Snare',es:'Caja'},  cl:'clap',  snd:'snare',  p:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1]},
      {label:{en:'Hat',  es:'H-hat'}, cl:'hat-c', snd:'hat',    p:[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1]},
      {label:{en:'Shake',es:'Shkr'},  cl:'shaker',snd:'shaker', p:[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1]},
      {label:{en:'Rim',  es:'Rim'},   cl:'rim',   snd:'rim',    p:[0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0]},
    ],
  },

  jazz: {
    title:'Jazz', bpm:140,
    sub:{en:'4/4 · swing 8ths · 120–200 BPM', es:'4/4 · corcheas con swing · 120–200 BPM'},
    cards:[
      {h:{en:'Feel',es:'Sensación'}, b:{en:'Swing 8ths',es:'Corcheas con swing'}, p:{en:'"Long-short" feel: divide the beat into a triplet, play 1st and 3rd.', es:'Feel "largo-corto": divide el tiempo en tresillo y toca el 1.º y el 3.º.'}},
      {h:{en:'Harmony',es:'Armonía'}, b:{en:'ii–V–I (the blueprint)',es:'ii–V–I (el esquema esencial)'}, p:{en:'Extended 9ths, 11ths, 13ths; alterations on the V (♭9, ♯11, ♭13).', es:'Extensiones de 9.ª, 11.ª, 13.ª; alteraciones en el V (♭9, ♯11, ♭13).'}},
      {h:{en:'Voice',es:'Voz'}, b:{en:'Comping — space is the instrument',es:'Comping — el espacio es el instrumento'}, p:{en:'Piano fills gaps; drop-2 voicings; stay out of the bass\'s way.', es:'El piano llena los huecos; voicings de drop-2; sin pisar al bajo.'}},
    ],
    elements:[
      {icon:'🥁',name:{en:'Ride',es:'Ride'},          desc:{en:'Ping ride on every 8th (swing feel); "ching" on 2 & 4 is the heartbeat.', es:'Ride con "ping" en cada corchea (feel swing); el "ching" en 2 y 4 es el corazón.'}, gear:'20″ ride cymbal', anim:null},
      {icon:'👏',name:{en:'Snare',es:'Caja'},          desc:{en:'Crisp backbeat on 2 & 4; brushes for smaller settings.', es:'Backbeat claro en 2 y 4; escobillas para formatos más íntimos.'}, gear:'14″ snare / brushes', anim:null},
      {icon:'🎹',name:{en:'Piano',es:'Piano'},          desc:{en:'Left-hand voicings on the off-beats — shell voicings, drop-2.', es:'Voicings con la mano izquierda a contratiempo — shell voicings, drop-2.'}, gear:'Acoustic / Rhodes', anim:'stab'},
      {icon:'🎸',name:{en:'Walking bass',es:'Bajo caminante'}, desc:{en:'Four-to-the-bar quarter notes guiding the harmony — the foundation.', es:'Negras hacia el acorde en cada tiempo — la fundación.'}, gear:'Upright / Fender bass', anim:'bass'},
      {icon:'🎺',name:{en:'Horns',es:'Vientos'},        desc:{en:'Lead melody, call-and-response, or long-tone pads on the changes.', es:'Melodía principal, pregunta-respuesta o notas largas sobre los cambios de acorde.'}, gear:'Trumpet / tenor sax', anim:null},
      {icon:'🥁',name:{en:'Hi-hat',es:'Hi-hat'},        desc:{en:'Foot hi-hat on 2 & 4 marks the backbeat alongside the snare.', es:'Hi-hat de pie en los tiempos 2 y 4 marca el backbeat junto a la caja.'}, gear:'Foot pedal, 14″ hats', anim:null},
    ],
    progressions:[
      {chords:['Dm7','G7','Cmaj7','Am7'],    desc:{en:'ii7–V7–Imaj7–vi7: the jazz blueprint', es:'ii7–V7–Imaj7–vi7: el esquema del jazz'}},
      {chords:['Am7','D7','Gmaj7','Cmaj7'],  desc:{en:'Cycle of 4ths — smooth voice-leading', es:'Ciclo de 4ths — conducción suave de voces'}},
      {chords:['Cm7','F7','Bbmaj7','Ebmaj7'],desc:{en:'ii–V–I in B♭ with tritone subs', es:'ii–V–I en Si♭ con sustitución de tritono'}},
    ],
    groove:[
      {en:'Swing 8ths: "1-and-a, 2-and-a…" — the "and" falls late, on the triplet third.', es:'Corcheas con swing: "1-y-a, 2-y-a…" — el "y" cae tarde, en el tercer tercio del tresillo.'},
      {en:'Ride cymbal drives the feel; snare is the backbeat; kick is sparse and supportive.', es:'El ride lleva el feel; la caja es el backbeat; el bombo es escaso y de apoyo.'},
      {en:'Walking bass moves by step or interval toward the next chord root.', es:'El bajo caminante se mueve por grados o intervalos hacia la raíz del siguiente acorde.'},
      {en:'Piano comps in the spaces — never over-fill; react to the other players.', es:'El piano hace comping en los espacios — nunca de más; reacciona a los demás instrumentos.'},
    ],
    tips:[
      {h:{en:'Arrangement',es:'Arreglo'}, items:[
        {en:'Head (melody) → solos → head out: the classic AABA jazz form.', es:'Head (melodía) → solos → head out: la forma AABA clásica del jazz.'},
        {en:'Let the rhythm section breathe during solos — less is more.', es:'Deja respirar a la sección rítmica durante los solos — menos es más.'},
        {en:'Dynamics: softer behind a vocal/horn melody, louder under a piano solo.', es:'Dinámica: más suave detrás de una melodía vocal/de viento, más fuerte bajo un solo de piano.'},
      ]},
      {h:{en:'Fills & transitions',es:'Fills y transiciones'}, items:[
        {en:'Trading 4s: drummer and soloist swap 4-bar phrases.', es:'Trading 4s: batería y solista se turnan frases de 4 compases.'},
        {en:'Kicks on the last beat of a phrase "kick" the soloist into the next section.', es:'Bombos en el último tiempo de la frase "lanzan" al solista a la siguiente sección.'},
        {en:'A short run or turn into a new section keeps the momentum.', es:'Un breve run o giro al entrar en una nueva sección mantiene el impulso.'},
      ]},
      {h:{en:'Sound design',es:'Diseño de sonido'}, items:[
        {en:'Minimal processing: mild compression, no heavy reverb on the kit.', es:'Procesado mínimo: compresión leve, sin reverb exagerada en la batería.'},
        {en:'Upright or P-bass with foam mute for the warm, articulate tone.', es:'Contrabajo o P-bass con sordina de espuma para un tono cálido y articulado.'},
        {en:'A room mic on the kit adds natural ambience without digital reverb.', es:'Un micrófono de sala añade ambiente natural sin reverb digital.'},
      ]},
    ],
    chordStyle:'stab',
    chordLane:[0,0,1,0, 1,0,1,0, 0,0,1,0, 1,0,0,0],
    bassLane: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
    pattern:[
      {label:{en:'Ride', es:'Ride'},  cl:'ride',  snd:'ride',  p:[1,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0]},  // spang-a-lang
      {label:{en:'Snare',es:'Caja'}, cl:'clap',  snd:'snare', p:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      {label:{en:'Kick', es:'Bombo'},cl:'',      snd:'kick',  p:[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0]},
      {label:{en:'H-hat',es:'H-hat'},cl:'shaker',snd:'shaker',p:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
      {label:{en:'Tom',  es:'Tom'},  cl:'tom',   snd:'tom',   p:[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1]},
    ],
  },
};
const GENRES = PRODUCTION_DATA;

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Easy Fifth Circle — Auditoría V5.36 (ES): estado, fortalezas, debilidades, roadmap."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                HRFlowable, ListFlowable, ListItem, PageBreak)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont("Inter",     "/tmp/Inter-Regular.ttf"))
pdfmetrics.registerFont(TTFont("InterBold",  "/tmp/Inter-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Anton",      "/tmp/Anton-Regular.ttf"))

OUT    = "/Users/pedroipince/Documents/CLAUDE/FIFTH CIRCLE/Circle of Fifth Git/Easy_Fifth_Circle_V5.36_Audit_ES.pdf"
INK    = HexColor("#15151A"); ORANGE = HexColor("#E8441A"); DIM = HexColor("#6A6A72")
LINE   = HexColor("#E2DCD2"); CARD = HexColor("#FAF6EF"); GREEN = HexColor("#2E9E6B"); RED = HexColor("#C0392B")

ss = getSampleStyleSheet()
def S(name, **kw):
    return ParagraphStyle(name, parent=kw.pop("parent", ss["Normal"]), **kw)
H1   = S("H1", fontName="Anton", fontSize=26, textColor=INK, leading=30, spaceAfter=2)
SUB  = S("SUB", fontName="Inter", fontSize=10.5, textColor=DIM, leading=15, spaceAfter=10)
H2   = S("H2", fontName="Anton", fontSize=15, textColor=ORANGE, leading=19, spaceBefore=15, spaceAfter=6)
H3   = S("H3", fontName="InterBold", fontSize=11.5, textColor=INK, leading=15, spaceBefore=9, spaceAfter=3)
BODY = S("BODY", fontName="Inter", fontSize=9.7, textColor=INK, leading=14.5, spaceAfter=5, alignment=TA_LEFT)
LI   = S("LI", fontName="Inter", fontSize=9.6, textColor=INK, leading=14)
CELL = S("CELL", fontName="Inter", fontSize=8.7, textColor=INK, leading=12)

def rule(c=LINE, w=0.8, sb=2, sa=8): return HRFlowable(width="100%", thickness=w, color=c, spaceBefore=sb, spaceAfter=sa)
def bullets(items, color=ORANGE):
    return ListFlowable([ListItem(Paragraph(t, LI), leftIndent=10, value="•") for t in items],
                        bulletType="bullet", bulletColor=color, bulletFontSize=7, leftIndent=12, spaceAfter=6)

story = []
story += [Spacer(1, 6*mm), Paragraph("EASY FIFTH CIRCLE", H1)]
story += [Paragraph("Auditoría <b>V5.36</b> · Estado · Fortalezas · Debilidades · Roadmap &nbsp;—&nbsp; Junio 2026", SUB)]
story += [rule(ORANGE, 1.4, 0, 10)]

meta = Table([[
    Paragraph("<b>Versión</b><br/>V5.36", CELL),
    Paragraph("<b>Stack</b><br/>Vanilla JS · CSS · WebGL · Web Audio", CELL),
    Paragraph("<b>Deploy</b><br/>GitHub Pages · PWA", CELL),
    Paragraph("<b>Tests</b><br/>68 EFC_DEV (OK)", CELL),
    Paragraph("<b>Módulos</b><br/>37 en src/", CELL),
]], colWidths=[28*mm, 50*mm, 38*mm, 30*mm, 24*mm])
meta.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),CARD),("BOX",(0,0),(-1,-1),0.8,LINE),
    ("INNERGRID",(0,0),(-1,-1),0.6,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),
    ("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
story += [meta, Spacer(1, 5*mm)]

story += [Paragraph("Resumen ejecutivo", H2)]
story += [Paragraph(
    "Easy Fifth Circle es una herramienta interactiva de armonía: una rueda de quintas viva donde "
    "exploras tonalidades y modos, construyes progresiones, las escuchas con un sintetizador propio "
    "(Rhodes FM, guitarra de nylon, batería 808/909), las coloreas con acordes fuera de escala y las "
    "exportas a MIDI. PWA instalable, offline, bilingüe (EN/ES), con identidad visual fuerte (plasma "
    "WebGL + UI liquid-glass).", BODY)]
story += [Paragraph(
    "<b>Estado:</b> producto técnicamente maduro y muy completo. El último ciclo (V5.31–V5.36) cerró "
    "dos fases de pulido —móvil y pedagogía— y arrancó el rediseño de UI hacia una <b>isla liquid-glass</b> "
    "tipo iOS-26. <b>El reto ya no es de features, es de distribución y pulido en dispositivos reales:</b> "
    "falta empaquetado a tienda, telemetría, una capa premium y rematar la convergencia de la UI.", BODY)]

story += [Paragraph("Novedades V5.31 a V5.36", H2)]
story += [Paragraph("Fase A · Pulido móvil (V5.31–V5.32)", H3)]
story += [bullets([
    "Swipe entre piano y guitarra (pager con snap + puntos de página).",
    "Transport Play/BPM accesible sin scroll; rueda que se encoge al construir.",
    "Animación de despliegue del chooser de variantes; fix de la etiqueta vii° (B° en vez de Bm).",
])]
story += [Paragraph("Fase B · Pedagogía (V5.33–V5.34)", H3)]
story += [bullets([
    "Onboarding del círculo de quintas más explicativo (qué es y por qué funciona).",
    "Pestaña Producción 100% traducida al español (resolver {en,es}).",
    "Modulation coach: saltar a una tonalidad relacionada con su acorde pivote.",
])]
story += [Paragraph("Rediseño de UI + armonía (V5.35–V5.36)", H3)]
story += [bullets([
    "Transport convertido en <b>isla liquid-glass</b> (cápsula a isla flotante) que reúne transport, instrumentos y herramientas.",
    "<b>Tira de progresión en el piano</b>: tocas un acorde y se ilumina/suena, sin cerrar la isla (paridad con la guitarra).",
    "<b>Color chords</b>: acordes fuera de escala (dominantes secundarios + prestados) con su función y resolución; se añaden a la progresión. \"Modulate\" pasa a un botón pequeño \"Key\".",
    "Tocar un shape de guitarra ahora <b>suena</b> con la voz de nylon (strum).",
    "Nuevo <b>icono de app</b> (corchea doble sobre el anillo de 12 tonos) + icono de guitarra.",
])]

story += [PageBreak()]
story += [Paragraph("Arquitectura actual", H2)]
story += [bullets([
    "<b>37 módulos</b> en src/ (core, i18n, theory, ui, interactions, styles, dev); build.js concatena a dist/Easy_Fifth_Circle.html (~444 KB) + index.html.",
    "Estado global <font face='InterBold'>st</font> en localStorage, mutado vía AppActions/ActionDispatcher; RenderEngine.full()/partial() orquesta los renders.",
    "OverlayManager como contrato único de overlays (Escape + click-fuera + cierre coordinado).",
    "Audio propio: FM Rhodes, nylon Karplus-Strong (muestra a muestra), batería sintetizada, metrónomo lookahead, MIDI tipo-0.",
    "68 tests EFC_DEV (núcleo teoría/audio) que pasan; PWA con service worker versionado.",
])]

story += [Paragraph("Fortalezas", H2)]
story += [bullets([
    "Producto feature-rich con identidad visual única (plasma + liquid-glass) difícil de copiar.",
    "Núcleo de teoría y audio sólido y propio: voice-leading, síntesis de nylon fiel, MIDI, color chords con pivotes correctos.",
    "Pedagogía real y accionable: círculo, modos, sugerencias por género/mood, acordes de color con su resolución.",
    "Arquitectura modular con contratos claros (OverlayManager, RenderEngine, dispatcher) y 68 tests del núcleo.",
    "PWA instalable, offline, bilingüe EN/ES, con base de accesibilidad (ARIA).",
], GREEN)]

story += [Paragraph("Debilidades del código", H2)]
story += [bullets([
    "<b>Build sin minificar</b>: concatenación simple, ~444 KB sin tree-shaking ni source maps. Falta terser/esbuild.",
    "<b>Tests no automatizados en CI</b>: los 68 corren en navegador (EFC_DEV); no hay pipeline ni regresión visual/UI.",
    "<b>Modelo key/mode con semántica no obvia</b> (st.key a veces tónica, a veces sector) — ya causó un bug en el coach de modulación.",
    "<b>Acoplamiento implícito</b> por estado global mutable y abundantes guards <font face='InterBold'>typeof X==='function'</font>; frágil ante renombrados.",
    "<b>CSS con deuda creciente</b>: capas de overrides e <font face='InterBold'>!important</font> (sheet móvil a isla); reubicar el pager necesitó parchear selectores.",
    "<b>Dos sistemas de \"sheet\" coexistiendo</b> (viejo instr-sheet vs. isla nueva) — conviene consolidar.",
], RED)]

story += [Paragraph("Debilidades del proyecto", H2)]
story += [bullets([
    "Sin empaquetado a tienda ni presencia nativa (solo PWA).",
    "Sin telemetría/analítica a decisiones de producto a ciegas.",
    "Sin landing page ni materiales de marketing; sin modelo de monetización definido.",
    "Selección de modo en móvil todavía en un FAB suelto (pendiente moverla a settings/isla).",
    "\"Modulate\" (ahora \"Key\") tiene valor dudoso: se solapa con cambiar tonalidad en la propia rueda.",
    "Rediseño de isla recién desplegado: falta QA en dispositivos reales (gestos, rendimiento del glass, alturas).",
], RED)]

story += [Paragraph("Sugerencias priorizadas", H2)]
story += [bullets([
    "Probar la isla en teléfonos reales y ajustar gestos/alturas; vigilar el coste del backdrop-filter sobre el plasma.",
    "Cerrar la Fase C: <b>engranaje de settings</b> (tema · idioma · paletas) y mover ahí el modo; retirar el mode-FAB.",
    "<b>Consolidar</b> el viejo instr-sheet y la isla en un único sistema; limpiar overrides CSS.",
    "Añadir <b>minify</b> (esbuild/terser) al build y un <b>smoke test headless</b> en CI.",
    "Telemetría ligera y respetuosa con la privacidad (eventos clave) para guiar el roadmap.",
    "Pulir Color chords: insertar en una posición concreta, previsualizar la resolución, marcar el grado de tensión.",
    "Playhead-follow: que el piano ilumine el acorde que suena durante la reproducción.",
    "Empaquetado con Capacitor/PWABuilder para App Store / Play y captura de pantallas de tienda.",
])]

story += [Paragraph("Qué queda — roadmap", H2)]
rd = Table([
    [Paragraph("<b>Fase</b>", CELL), Paragraph("<b>Pendiente</b>", CELL), Paragraph("<b>Estado</b>", CELL)],
    [Paragraph("C · Simplificación/UI", CELL), Paragraph("Isla (hecha), settings, retirar mode-FAB, consolidar sheets", CELL), Paragraph("~60%", CELL)],
    [Paragraph("Marca", CELL), Paragraph("Icono B (hecho), wordmark, capturas de tienda", CELL), Paragraph("~40%", CELL)],
    [Paragraph("D · Crecimiento", CELL), Paragraph("Landing, empaquetado a tienda, freemium, suggester por emoción", CELL), Paragraph("0%", CELL)],
    [Paragraph("Calidad/infra", CELL), Paragraph("Minify, CI, telemetría, QA en dispositivos", CELL), Paragraph("0%", CELL)],
], colWidths=[42*mm, 96*mm, 24*mm])
rd.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),HexColor("#2A2A31")),("TEXTCOLOR",(0,0),(-1,0),HexColor("#FFFFFF")),
    ("BOX",(0,0),(-1,-1),0.8,LINE),("INNERGRID",(0,0),(-1,-1),0.5,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[HexColor("#FFFFFF"),CARD]),
    ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),
    ("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)]))
story += [rd, Spacer(1, 4*mm)]

story += [Paragraph("Valoración de fase de producto", H2)]
story += [Paragraph(
    "<b>Fase 3 (producto) ≈ 70%.</b> El núcleo (teoría, audio, UX) y la pedagogía están maduros; el "
    "rediseño de UI hacia liquid-glass va por buen camino y la armonía de color añade valor real para "
    "productores. Lo que separa esto de un producto vendible es <b>distribución</b> (empaquetado a tienda, "
    "landing, monetización) y <b>pulido final en dispositivos reales</b> + saneamiento de deuda técnica "
    "(build, CI, consolidación de la UI). Con eso, es un candidato sólido a producto de nicho con identidad "
    "propia.", BODY)]
story += [rule(LINE, 0.8, 8, 4)]
story += [Paragraph("Generado automáticamente — Easy Fifth Circle V5.36 · Junio 2026", SUB)]

SimpleDocTemplate(OUT, pagesize=A4, leftMargin=20*mm, rightMargin=20*mm,
                  topMargin=16*mm, bottomMargin=16*mm).build(story)
print("wrote", OUT)

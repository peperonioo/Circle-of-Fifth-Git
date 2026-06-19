#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Easy Fifth Circle — Auditoría V5.27 + Roadmap + Fase de producto (ES)."""
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

OUT    = "/Users/pedroipince/Documents/CLAUDE/FIFTH CIRCLE/Circle of Fifth Git/Easy_Fifth_Circle_V5.27_Audit_ES.pdf"
INK    = HexColor("#15151A"); ORANGE = HexColor("#E8441A"); ORANGE2 = HexColor("#FF6A3D")
DIM    = HexColor("#6A6A72"); LINE = HexColor("#E2DCD2"); CARD = HexColor("#FAF6EF")
GREEN  = HexColor("#2E9E6B"); BLUE = HexColor("#2A6AD0"); BG = HexColor("#FFFFFF")

ss = getSampleStyleSheet()
def S(name, **kw):
    base = kw.pop("parent", ss["Normal"]); return ParagraphStyle(name, parent=base, **kw)
H1   = S("H1", fontName="Anton", fontSize=26, textColor=INK, leading=30, spaceAfter=2)
SUB  = S("SUB", fontName="Inter", fontSize=10.5, textColor=DIM, leading=15, spaceAfter=10)
H2   = S("H2", fontName="Anton", fontSize=15, textColor=ORANGE, leading=19, spaceBefore=15, spaceAfter=6)
H3   = S("H3", fontName="InterBold", fontSize=11.5, textColor=INK, leading=15, spaceBefore=9, spaceAfter=3)
BODY = S("BODY", fontName="Inter", fontSize=9.7, textColor=INK, leading=14.5, spaceAfter=5, alignment=TA_LEFT)
SMALL= S("SMALL", fontName="Inter", fontSize=8.6, textColor=DIM, leading=12)
LI   = S("LI", fontName="Inter", fontSize=9.6, textColor=INK, leading=14)
CELL = S("CELL", fontName="Inter", fontSize=8.7, textColor=INK, leading=12)
CELLB= S("CELLB", fontName="InterBold", fontSize=8.7, textColor=INK, leading=12)
WHITE= HexColor("#FFFFFF")

def rule(c=LINE, w=0.8, sb=2, sa=8): return HRFlowable(width="100%", thickness=w, color=c, spaceBefore=sb, spaceAfter=sa)
def bullets(items, st=LI):
    return ListFlowable([ListItem(Paragraph(t, st), leftIndent=10, value="•") for t in items],
        bulletType="bullet", bulletColor=ORANGE, bulletFontSize=7, leftIndent=12, spaceAfter=5)
def card(flows, pad=9, bg=CARD, bd=LINE):
    t = Table([[flows]], colWidths=[170*mm])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),bg),("BOX",(0,0),(-1,-1),0.8,bd),
        ("LEFTPADDING",(0,0),(-1,-1),pad),("RIGHTPADDING",(0,0),(-1,-1),pad),
        ("TOPPADDING",(0,0),(-1,-1),pad),("BOTTOMPADDING",(0,0),(-1,-1),pad)])); return t

story = []
story += [Spacer(1, 6*mm), Paragraph("EASY FIFTH CIRCLE", H1)]
story += [Paragraph("Auditoría <b>V5.27</b> · Design system · Roadmap · Fase de producto &nbsp;—&nbsp; Junio 2026", SUB)]
story += [rule(ORANGE, 1.4, 0, 10)]
meta = Table([[
    Paragraph("<b>Versión</b><br/>V5.27", CELL),
    Paragraph("<b>Stack</b><br/>Vanilla JS · CSS · WebGL · Web Audio", CELL),
    Paragraph("<b>Deploy</b><br/>GitHub Pages · PWA", CELL),
    Paragraph("<b>Backup</b><br/>tag v5.24 + zip", CELL),
]], colWidths=[30*mm, 56*mm, 44*mm, 40*mm])
meta.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),CARD),("BOX",(0,0),(-1,-1),0.8,LINE),
    ("INNERGRID",(0,0),(-1,-1),0.6,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),
    ("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
story += [meta, Spacer(1, 5*mm)]

story += [Paragraph("Resumen ejecutivo", H2)]
story += [Paragraph(
    "Easy Fifth Circle es una herramienta interactiva de armonía y composición: una rueda de quintas "
    "viva donde eliges tonalidad y modo, construyes progresiones, las escuchas con un sintetizador "
    "propio (Rhodes FM, guitarra de nylon, batería 808/909), las ves en piano y guitarra, y las "
    "exportas a MIDI. PWA instalable, offline, EN/ES.", BODY)]
story += [Paragraph(
    "<b>Estado:</b> producto técnicamente muy maduro. Se ha cerrado el onboarding, la traducción "
    "completa y una <b>consolidación de diseño</b> sobre un design system propio (Claude Design). "
    "<b>Los dos frentes abiertos son de PRODUCTO, no de motor:</b> (1) terminar de hacerlo "
    "<b>simple y mobile-first</b> de verdad, y (2) empaquetar + monetizar. Esta auditoría cubre lo "
    "hecho, el problema de densidad/móvil con soluciones propuestas, el roadmap y la fase de producto.", BODY)]

story += [Paragraph("Novedades V5.12 → V5.27", H2)]
story += [bullets([
    "<b>V5.12–13 · Bloqueo de acorde</b> — tocar el centro fija la tonalidad y enciende todos sus acordes diatónicos (I-IV-V exterior, ii-iii-vi interior, vii° tenue).",
    "<b>V5.15–16 · Onboarding</b> — tour guiado con spotlight sobre la UI real (rueda → grados → builder → sugerencias → instrumentos → producción).",
    "<b>V5.17 · Traducción completa EN/ES</b> — todas las cadenas dinámicas (razones de sugerencias, moods, métricas, builder, metrónomo) + refresco al cambiar idioma.",
    "<b>V5.18–24 · Guitarra</b> — voz de nylon reconstruida; strip de shapes con tarjetas deduplicadas y mini-fretboard horizontal grande con nombres de nota; flechas + slide para posiciones.",
    "<b>V5.19 · Dock de instrumentos</b> — pastilla flotante Piano | Guitar (glifos SVG).",
    "<b>V5.25–27 · Design system</b> — tokens, kit de componentes unificado e iconos line-SVG (ver siguiente sección).",
])]

story += [PageBreak()]
story += [Paragraph("Estado del Design System (Claude Design → app)", H2)]
story += [Paragraph(
    "Se importó el design system creado en Claude Design (mismas fonts DM, plasma, liquid-gel, naranja) "
    "y se está implementando sobre la app por fases.", BODY)]
ds = [
    [Paragraph("Pieza", CELLB), Paragraph("Estado", CELLB), Paragraph("Detalle", CELLB)],
    [Paragraph("Tokens", CELL), Paragraph("<font color='#2E9E6B'>Hecho</font>", CELL), Paragraph("surface, faint, danger, glass-1/2/3, glass-border, shadow-lifted (claro+oscuro).", CELL)],
    [Paragraph("Componentes", CELL), Paragraph("<font color='#2E9E6B'>Hecho</font>", CELL), Paragraph("1 receta: segmentado (tabs/Major-Minor/Chords-Triads/sonidos), botón (ghost/primario/danger), pill, focus.", CELL)],
    [Paragraph("Iconos", CELL), Paragraph("<font color='#2E9E6B'>Hecho</font>", CELL), Paragraph("22 line-SVG (currentColor); fuera todos los emojis; swaps play/stop y sol/luna.", CELL)],
    [Paragraph("Tipografía", CELL), Paragraph("<font color='#E8441A'>Pendiente</font>", CELL), Paragraph("Misma familia DM — falta APLICAR el tratamiento del mockup: más Serif Display en display, Mono uniforme en datos, escala bloqueada.", CELL)],
    [Paragraph("Superficies/islas", CELL), Paragraph("<font color='#E8441A'>Pendiente</font>", CELL), Paragraph("Convergencia fina de overlays/cards a E1/E2/E3.", CELL)],
    [Paragraph("Marca", CELL), Paragraph("<font color='#E8441A'>Pendiente</font>", CELL), Paragraph("App icon 'Orbit' + wordmark — sobre todo para landing y tienda.", CELL)],
]
t = Table(ds, colWidths=[30*mm, 26*mm, 114*mm])
t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),INK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[BG, CARD]),("BOX",(0,0),(-1,-1),0.8,LINE),
    ("INNERGRID",(0,0),(-1,-1),0.5,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),
    ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
story += [t]
story += [Paragraph("Nota: el export de Claude Design incluye también 4 pantallas de app (Home/Wheel, "
    "Builder, Instruments, Onboarding) que sirven de norte visual. Decisión tomada: opción <b>A</b> — "
    "consolidar lo seguro; las burbujas de sugerencia y el onboarding-spotlight se mantienen por ahora.", SMALL)]

story += [PageBreak()]
story += [Paragraph("El problema a resolver: densidad + móvil", H2)]
story += [Paragraph(
    "El feedback es claro y acertado: <b>el diseño actual lo compacta todo y aún no es realmente "
    "mobile-first.</b> La app nació desktop y crece como un único scroll vertical muy denso. En móvil "
    "eso se traduce en poco aire, controles pequeños y demasiada información a la vez.", BODY)]
story += [bullets([
    "<b>Un solo scroll largo</b>: rueda → grados → builder → sugerencias → instrumentos, todo apilado. En móvil obliga a scrollear mucho y nada respira.",
    "<b>Densidad de controles</b>: barra del builder con 7 botones, side-cards, toggles… mucho compitiendo por la atención.",
    "<b>Paneles secundarios</b> (librería, metrónomo, shapes) aparecen sobre el mismo lienzo en vez de en su sitio.",
    "<b>Falta jerarquía visual</b> que guíe el ojo (lo que el mockup logra con tipografía + espacio).",
])]

story += [Paragraph("Soluciones inteligentes propuestas (creativas, no solo \"más pequeño\")", H2)]
story += [card([bullets([
    "<b>Modelo de \"pantallas\" en móvil</b> — en vez de un scroll infinito, 3 vistas enfocadas (Rueda · Construir · Instrumentos) que se cambian con el <b>dock flotante</b> (deslizables). Cada una respira y hace una cosa. En desktop se mantiene la vista completa.",
    "<b>Bottom-sheets</b> para lo secundario — librería, metrónomo y shapes suben como hoja inferior (gesto nativo móvil) en lugar de flotar sobre el contenido.",
    "<b>Divulgación progresiva</b> — las side-cards (Key, Mode, Accidentals, Relative, Scale) se colapsan en una tira/píldora de 'info de tonalidad' que se expande al tocar. Menos ruido por defecto.",
    "<b>Barra de Play/Tempo flotante</b> (del mockup) — saca Play + BPM + opciones a una pastilla inferior fija; libera la zona del builder.",
    "<b>Sugerencias adaptativas</b> — burbujas en desktop; en pantallas estrechas, filas claras (acorde + función + fuerza) que caben y se leen mejor.",
    "<b>Escala de espacio + tipografía bloqueadas</b> — aplicar el tratamiento del design system (Serif Display display, Mono datos, espaciado 4-base) da aire y jerarquía sin tocar funciones.",
])])]
story += [Paragraph("Principio: <b>una pantalla = una tarea</b>, con gestos nativos (swipe, bottom-sheet) "
    "y aire. No es quitar features — es revelarlas cuando hacen falta.", SMALL)]

story += [PageBreak()]
story += [Paragraph("Roadmap priorizado — cosas por hacer", H2)]
rd = [
    ["#", "Tarea", "Tipo", "Esf."],
    ["1", "Pasada de tipografía (tratamiento del mockup, sin cambiar familias)", "Diseño", "S"],
    ["2", "Rework mobile-first: modelo de pantallas + dock + bottom-sheets + aire", "Diseño/UX", "L"],
    ["3", "Convergencia de superficies/islas (overlays, cards) a E1/E2/E3", "Diseño", "S-M"],
    ["4", "Marca: app icon 'Orbit' + wordmark", "Marca", "M"],
    ["5", "Sugeridor por emoción (gancho de marketing pre-lanzamiento)", "Feature", "M"],
    ["6", "Coach de modulaciones (diferenciador)", "Feature", "M-L"],
    ["7", "Landing page + captación de emails", "Producto", "M"],
    ["8", "Empaquetado a tienda (Capacitor/PWABuilder → App Store + Play)", "Producto", "M"],
    ["9", "Freemium / desbloqueo único + beta TestFlight", "Producto", "M"],
]
pr = Table([[Paragraph(c, CELLB if i==0 else (CELLB if j in (0,3) else CELL)) for j,c in enumerate(r)]
            for i,r in enumerate(rd)], colWidths=[9*mm, 110*mm, 32*mm, 12*mm])
pr.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),INK),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[BG, CARD]),("BOX",(0,0),(-1,-1),0.8,LINE),
    ("INNERGRID",(0,0),(-1,-1),0.5,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("ALIGN",(0,0),(0,-1),"CENTER"),("ALIGN",(3,0),(3,-1),"CENTER"),
    ("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),
    ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
story += [pr, Spacer(1, 2*mm), Paragraph("Esf.: S pequeño · M medio · L grande.", SMALL)]
story += [Paragraph("Pendientes menores apuntados: \"Bm\" vs \"B°\" en el círculo bloqueado (indicar disminuido); "
    "linking de instrumentos al bloquear (escala en piano/guitarra); test pre-existente \"Mixolydian "
    "favours ♭VII\" en la suite (no afecta a la app).", SMALL)]

story += [PageBreak()]
story += [Paragraph("¿En qué fase estamos del producto?", H2)]
ph = [
    [Paragraph("Fase", CELLB), Paragraph("Qué incluye", CELLB), Paragraph("Estado", CELLB)],
    [Paragraph("1 · Motor", CELL), Paragraph("Teoría, audio, builder, instrumentos, export, PWA.", CELL), Paragraph("<font color='#2E9E6B'>Completa</font>", CELL)],
    [Paragraph("2 · Retención", CELL), Paragraph("Onboarding, i18n, claridad de la experiencia.", CELL), Paragraph("<font color='#2E9E6B'>Completa</font>", CELL)],
    [Paragraph("3 · Pulido / diseño", CELL), Paragraph("Design system (tokens/componentes/iconos ✓), tipografía + mobile-first ⏳.", CELL), Paragraph("<font color='#E8441A'>En curso (~60%)</font>", CELL)],
    [Paragraph("4 · Marca", CELL), Paragraph("Nombre, app icon, wordmark, landing.", CELL), Paragraph("<font color='#6A6A72'>Pendiente</font>", CELL)],
    [Paragraph("5 · Lanzamiento", CELL), Paragraph("Tienda, freemium, beta, ASO.", CELL), Paragraph("<font color='#6A6A72'>Pendiente</font>", CELL)],
]
pt = Table(ph, colWidths=[34*mm, 96*mm, 40*mm])
pt.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),BLUE),("TEXTCOLOR",(0,0),(-1,0),WHITE),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[BG, CARD]),("BOX",(0,0),(-1,-1),0.8,LINE),
    ("INNERGRID",(0,0),(-1,-1),0.5,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),
    ("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),
    ("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5)]))
story += [pt, Spacer(1, 3*mm)]
story += [Paragraph(
    "<b>Lectura:</b> el producto está en la <b>fase 3 (pulido/diseño)</b>, a medio camino. El motor y la "
    "retención están cerrados. Lo que separa de un lanzamiento vendible es: terminar el diseño "
    "(<b>tipografía + simplificación mobile-first</b>), la <b>marca</b>, y el <b>empaquetado + "
    "monetización</b>. Ninguna es ingeniería pesada — es trabajo de producto.", BODY)]
story += [rule(ORANGE, 1.2, 4, 8)]
story += [Paragraph(
    "<b>Siguiente paso recomendado:</b> (1) pasada de tipografía rápida, (2) el rework mobile-first con "
    "las soluciones inteligentes de arriba — eso es lo que hará que \"todo tenga más sentido\" y deje la "
    "app lista para vestir de marca y empaquetar.", BODY)]
story += [Spacer(1, 3*mm), Paragraph("Easy Fifth Circle · Auditoría V5.27 · Junio 2026 · Documento interno", SMALL)]

def footer(c, doc):
    c.saveState(); c.setFont("Inter", 7.5); c.setFillColor(DIM)
    c.drawString(20*mm, 12*mm, "Easy Fifth Circle — Auditoría V5.27")
    c.drawRightString(190*mm, 12*mm, "pág. %d" % doc.page)
    c.setStrokeColor(LINE); c.setLineWidth(0.5); c.line(20*mm, 15*mm, 190*mm, 15*mm); c.restoreState()

doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=20*mm, rightMargin=20*mm, topMargin=16*mm,
                        bottomMargin=20*mm, title="Easy Fifth Circle — Auditoría V5.27")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("OK ->", OUT)

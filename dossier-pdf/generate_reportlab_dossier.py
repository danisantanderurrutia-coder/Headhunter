import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (páginas > 1)
        if self._pageNumber > 1:
            self.drawString(40, 810, "OPERATIVE CORE DOSSIER // DIRECTIVA CANÓNICA & RECETA MAESTRA")
            self.drawRightString(555, 810, "DANIEL SANTANDER URRUTIA")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.6)
            self.line(40, 804, 555, 804)

        # Footer
        self.setFont("Helvetica", 7.5)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.6)
        self.line(40, 34, 555, 34)
        self.drawString(40, 24, "CONFIDENCIAL // RECURSO DE CONTEXTO TÁCTICO PARA MODELO GEMINI / LLM")
        self.drawRightString(555, 24, f"Página {self._pageNumber} de {page_count}")
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=38,
        rightMargin=38,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=2
    )

    sub_title = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0284c7"),
        spaceAfter=10
    )

    h1 = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12.5,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    h2 = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0369a1"),
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    body = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.6,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=3
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body,
        fontName='Helvetica-Bold'
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.6,
        leading=10.4,
        textColor=colors.HexColor("#0f172a")
    )

    code_text = ParagraphStyle(
        'CodeText',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.0,
        leading=9.2,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # =========================================================================
    # PÁGINA 1: PORTADA & GROUND TRUTH EMPÍRICO
    # =========================================================================
    story.append(Paragraph("OPERATIVE CORE DOSSIER // DIRECTIVA CANÓNICA", title_style))
    story.append(Paragraph("Perfil Maestro Ground Truth, Dual-Lens Audit & Receta Universal de Cover Letter (1 Página DIN 5008)", sub_title))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))

    # Mandato Box
    mandate_html = """<b>MANDATO SUPREMO PARA GOOGLE GEMINI / LLM:</b> Este documento constituye la Única Fuente de Verdad sobre Daniel Santander Urrutia y establece la norma editorial universal para evaluar vacantes y redactar CVs o cartas. Queda terminantemente prohibido alucinar herramientas no utilizadas, inventar cargos o recurrir a fórmulas burocráticas serviles. Toda afirmación debe anclarse en hechos empíricos y metodologías reales."""
    mandate_table = Table([[Paragraph(mandate_html, callout_text)]], colWidths=[519])
    mandate_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fffbeb")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#f59e0b")),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(mandate_table)
    story.append(Spacer(1, 6))

    # Sección 1: Identidad
    story.append(Paragraph("1. Identidad, Estatus Contractual y Canales Verificados", h1))
    id_data = [
        [Paragraph("<b>Nombre Completo</b>", body), Paragraph("Daniel Sebastián Santander Urrutia", body)],
        [Paragraph("<b>Titulación Base</b>", body), Paragraph("Licenciado en Geofísica (Universidad de Chile, Distinción Máxima) • Doble M.Sc. en Manejo Ambiental (CAU Kiel, Alemania) y Protección Ambiental (AMU Poznań, Polonia)", body)],
        [Paragraph("<b>Contacto Oficial</b>", body), Paragraph("Kiel, Schleswig-Holstein, Alemania | Bilbao, Bizkaia, España | danisantander.urrutia@gmail.com", body)],
        [Paragraph("<b>Portafolio de Evidencias</b>", body), Paragraph("https://danisantanderurrutia-coder.github.io/portafolio/ (Búnker de proyectos, peritajes, modelos y código)", body)],
        [Paragraph("<b>Habilitación Legal UE</b>", body), Paragraph("<b>Alemania:</b> Título de posgrado en universidad alemana con permiso <b>§ 20 AufenthG</b> (Investigador calificado / búsqueda de empleo; contratación inmediata sin patrocinio previo de visa).<br/><b>España:</b> Régimen Profesionales Altamente Cualificados (PAC) Ley 14/2013.", body)],
    ]
    id_table = Table(id_data, colWidths=[120, 399])
    id_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(id_table)
    story.append(Spacer(1, 6))

    # Sección 2: Ground Truth
    story.append(Paragraph("2. Resumen de Impacto Real (Ground Truth) vs. Datos Descartados", h1))
    story.append(Paragraph("<b>Regla de Relevancia:</b> Queda prohibido incluir cifras de laboratorio aisladas como <i>'σp = 62.4 kPa'</i>. No comunican impacto. En su lugar, el modelo debe resaltar la capacidad de integrar sistemas, instrumentación avanzada de terreno y oratoria pública demostrada:", body))

    impact_data = [
        [Paragraph("<b>Área de Impacto</b>", body_bold), Paragraph("<b>Evidencias Verificadas del Portafolio a Destacar</b>", body_bold)],
        [
            Paragraph("<b>Flujos de GEI & Suelos</b><br/><font color='#0284c7'>CAU Kiel & AMU Poznań</font>", body),
            Paragraph("Cuantificación empírica de flujos de carbono (CO₂, CH₄) en turberas templadas (Wallener Au) mediante <b>torres micrometeorológicas de Eddy Covariance y cámaras de flujo cerrado</b>. Caracterización de <b>curvas de retención hídrica, estructura y dinámica de humedad edáfica</b>. Monitoreo limnológico de bioindicadores en lagos de Poznań bajo la Directiva Marco del Agua de la UE.", body)
        ],
        [
            Paragraph("<b>Hidrogeofísica de Cuencas</b><br/><font color='#059669'>FCFM U. de Chile</font>", body),
            Paragraph("Memoria de título aprobada <b>Con Distinción Máxima</b>. Prospección con <b>Sondeos Eléctricos Verticales (SEV), resistividad eléctrica del subsuelo y gravimetría</b> en la Cuenca del Río Maule. Modelación cuantitativa del abatimiento del nivel freático frente al avance de monocultivos forestales industriales y sequía.", body)
        ],
        [
            Paragraph("<b>Contabilidad de Carbono</b><br/><font color='#d97706'>EPN & Global Forest Coalition</font>", body),
            Paragraph("<b>Autor Técnico Principal</b> del informe internacional <i>'Spotlight on Burning Biomass'</i> (Parral, Maule). Auditoría de vacíos metodológicos en balances de carbono de centrales de bioenergía, fiscalizando subsidios europeos bajo directivas <b>RED III y ETS</b>.", body)
        ],
        [
            Paragraph("<b>Interlocución Legislativa</b><br/><font color='#7c3aed'>Congreso Nacional de Chile</font>", body),
            Paragraph("<b>Comparecencia pericial oficial</b> ante la Comisión Especial de Emergencia, Desastres y Bomberos de la Cámara de Diputadas y Diputados de Chile. Defensa de modelos biofísicos de riesgo de megaincendios e hidrogeología ante parlamentarios y la Convención Constitucional.", body)
        ],
        [
            Paragraph("<b>Dirección de Campañas</b><br/><font color='#dc2626'>Apruebo Rural & Prensa</font>", body),
            Paragraph("Coordinación de campaña nacional (14 regiones, 80 asambleas comunales, +500.000 volantes). Dirección editorial en medio socioambiental independiente con <b>más de 700.000 seguidores orgánicos</b> y capacitación de 45 corresponsales rurales.", body)
        ],
    ]
    impact_table = Table(impact_data, colWidths=[120, 399])
    impact_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(impact_table)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 2: RECETA MAESTRA DE COVER LETTER & ESQUEMA HORIZONTAL
    # =========================================================================
    story.append(Paragraph("3. La Receta Maestra de Cover Letter (1 Página DIN 5008)", h1))
    story.append(Paragraph("La carta de postulación formal debe redactarse en <b>1 sola página A4 estricta (400 – 480 palabras en 4-5 párrafos densos)</b>. Pasar de 1 página se percibe en Europa como falta de capacidad de síntesis ejecutiva. Solo se admiten 2 páginas si la convocatoria exige formalmente un <i>Research Proposal / Statement</i>.", body))

    # ESQUEMA MERMAID HORIZONTAL
    story.append(Paragraph("<b>Flujo Táctico Horizontal de la Receta Maestra (6 Pasos Consecutivos):</b>", h2))
    
    flow_step_style = ParagraphStyle(
        'FlowStep',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=6.8,
        leading=8.5,
        alignment=1, # Center
        textColor=colors.HexColor("#0f172a")
    )
    flow_sub_style = ParagraphStyle(
        'FlowSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=5.8,
        leading=7.2,
        alignment=1,
        textColor=colors.HexColor("#475569")
    )

    arrow_style = ParagraphStyle(
        'ArrowStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=10,
        alignment=1,
        textColor=colors.HexColor("#0284c7")
    )

    mermaid_table_data = [
        [
            Paragraph("<b>PASO 1</b><br/>Apertura Fuerte<br/>(Hook & Tesis)", flow_step_style),
            Paragraph("➔", arrow_style),
            Paragraph("<b>PASO 2</b><br/>Diagnóstico del<br/>Reto Central", flow_step_style),
            Paragraph("➔", arrow_style),
            Paragraph("<b>PASO 3</b><br/>Evidencia &<br/>Artifact Hook", flow_step_style),
            Paragraph("➔", arrow_style),
            Paragraph("<b>PASO 4</b><br/>Asimetría Neta<br/>(Zero Defensiveness)", flow_step_style),
            Paragraph("➔", arrow_style),
            Paragraph("<b>PASO 5</b><br/>Forward-Looking<br/>Pitch (90 días)", flow_step_style),
            Paragraph("➔", arrow_style),
            Paragraph("<b>PASO 6</b><br/>Cierre Sobrio &<br/>ToR Compliance", flow_step_style)
        ],
        [
            Paragraph("Sin rodeos burocráticos. Entrada directa al dolor.", flow_sub_style),
            "",
            Paragraph("Demostrar comprensión profunda del proyecto.", flow_sub_style),
            "",
            Paragraph("Caso empírico comprobable + enlace al visor/repo.", flow_sub_style),
            "",
            Paragraph("Enfoque 100% positivo. Cero disculpas ni peros.", flow_sub_style),
            "",
            Paragraph("Prioridad inmediata al asumir el cargo.", flow_sub_style),
            "",
            Paragraph("Disponibilidad 40h/sem, TVöD/fee y visa §20.", flow_sub_style)
        ]
    ]
    mermaid_table = Table(mermaid_table_data, colWidths=[76, 12, 76, 12, 76, 12, 79, 12, 76, 12, 76])
    mermaid_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#e0f2fe")),
        ('BACKGROUND', (2,0), (2,-1), colors.HexColor("#f1f5f9")),
        ('BACKGROUND', (4,0), (4,-1), colors.HexColor("#d1fae5")),
        ('BACKGROUND', (6,0), (6,-1), colors.HexColor("#ede9fe")),
        ('BACKGROUND', (8,0), (8,-1), colors.HexColor("#fef3c7")),
        ('BACKGROUND', (10,0), (10,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (0,-1), 0.8, colors.HexColor("#0284c7")),
        ('BOX', (2,0), (2,-1), 0.8, colors.HexColor("#64748b")),
        ('BOX', (4,0), (4,-1), 0.8, colors.HexColor("#059669")),
        ('BOX', (6,0), (6,-1), 0.8, colors.HexColor("#7c3aed")),
        ('BOX', (8,0), (8,-1), 0.8, colors.HexColor("#d97706")),
        ('BOX', (10,0), (10,-1), 0.8, colors.HexColor("#0284c7")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 2),
        ('RIGHTPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(mermaid_table)
    story.append(Spacer(1, 6))

    # Regla Zero-Defensiveness
    zero_def_html = """<b>REGLA CRÍTICA DE ORO // ZERO-DEFENSIVENESS (CERO JUSTIFICACIONES):</b><br/>
Queda estrictamente prohibido usar conectores de disculpa o contraste defensivo como <i>'a pesar de que mi formación es...'</i>, <i>'aunque no cuento con...'</i> o <i>'despite my background being...'</i>. Plantar una objeción debilita la candidatura. Toda habilidad o antecedente previo se enmarca directamente como una <b>VENTAJA NATURAL y un activo acumulativo</b> que suma una perspectiva de la que carecen los candidatos estándar."""
    zero_def_table = Table([[Paragraph(zero_def_html, callout_text)]], colWidths=[519])
    zero_def_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#3b82f6")),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(zero_def_table)
    story.append(Spacer(1, 4))

    # Desglose de los 6 Tiempos
    story.append(Paragraph("Desglose Operativo de los 6 Tiempos (Estructura DIN 5008):", h2))
    
    steps_data = [
        [Paragraph("<b>Párrafo / Tiempo</b>", body_bold), Paragraph("<b>Directiva de Redacción & Elementos Clave</b>", body_bold)],
        [
            Paragraph("<b>1. Apertura Fuerte<br/>(The Hook & Thesis)</b>", body),
            Paragraph("<b>PROHIBIDO abrir con fórmulas burocráticas</b> (<i>'Me dirijo a usted...', 'I am writing to apply...'</i>). Abre en la primera frase conectando el dolor del proyecto con tu tesis técnica de entrada de par a par.", body)
        ],
        [
            Paragraph("<b>2. Diagnóstico del Reto</b>", body),
            Paragraph("Demuestra que comprendes el cuello de botella técnico del equipo (falta de resolución temporal, fricción multiactor, integración de sensores). La carta se centra en su problema, no en tus deseos personales.", body)
        ],
        [
            Paragraph("<b>3. Evidencia & Artifact Hook</b>", body),
            Paragraph("El caso de estudio empírico que valida tu capacidad de resolverlo (Eddy Covariance, R, balances de cuenca). <b>Artifact Hook obligatorio:</b> Incluir un enlace directo a la prueba física (ej. <i>[Wetland Monitor / Visor 3D]</i> o informe EPN).", body)
        ],
        [
            Paragraph("<b>4. Asimetría Positiva<br/>(Cero Excusas)</b>", body),
            Paragraph("Explica por qué tu combinación interdisciplinaria (geofísica + biogeoquímica + oratoria legislativa) eleva al consorcio. Todo se formula como activo neto de valor sin justificaciones ni disculpas.", body)
        ],
        [
            Paragraph("<b>5. Forward-Looking Pitch</b>", body),
            Paragraph("Plan concreto para los primeros 90 días o sobre el objetivo inmediato (ej. <i>'Al asumir este rol, mi prioridad operativa será integrar...'</i>). Muestra que ya estás resolviendo mentalmente el problema.", body)
        ],
        [
            Paragraph("<b>6. Cierre Formal ToR</b>", body),
            Paragraph("Declaración explícita de disponibilidad horaria (40h/sem, disponibilidad para terreno), encuadre salarial (TVöD E13 o consultoría) y estatus legal inmediato (§ 20 AufenthG / Ley 14/2013). Cierre sobrio sin servilismo.", body)
        ],
    ]
    steps_table = Table(steps_data, colWidths=[120, 399])
    steps_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(steps_table)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 3: AUDITORÍA DUAL-LENS, ÁRBOL DE APTITUDES & PROMPT DE ACTIVACIÓN
    # =========================================================================
    story.append(Paragraph("4. Sistema de Auditoría Dual-Lens (Headhunter ATS vs. Wingman PI)", h1))
    
    dual_lens_data = [
        [Paragraph("<b>Lente 1: Headhunter / ATS (Filtro Formal 45%)</b>", body_bold), Paragraph("<b>Lente 2: Wingman / PI (Filtro Colega 55%)</b>", body_bold)],
        [
            Paragraph("• <b>Densidad de Palabras Clave:</b> Coincidencia exacta con requisitos indispensables del anuncio.<br/>• <b>Cumplimiento ToR:</b> Mención expresa de títulos homologables, horas semanales y habilitación contractual.<br/>• <b>Legibilidad Estricta:</b> 1.5 a 2.5 min de lectura, formato DIN 5008 y viñetas estructuradas.", body),
            Paragraph("• <b>Ataque a los Dolores del PI:</b> La carta ataca directamente el cuello de botella del laboratorio o proyecto.<br/>• <b>Asimetría Competitiva:</b> Deja claro por qué Daniel es irreemplazable frente a perfiles convencionales.<br/>• <b>Zero-Servility:</b> Tono científico soberano libre de adulación vacía.", body)
        ]
    ]
    dual_lens_table = Table(dual_lens_data, colWidths=[255, 264])
    dual_lens_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(dual_lens_table)

    story.append(Paragraph("5. Lista Negra de Clichés de IA y Fórmulas Burocráticas Vetadas", h1))
    cliche_box = """<b>Inglés:</b> thrilled to, delve into, testament to, beacon of, foster, seamlessly align, tapestry, spearhead, unwavering, passionate about, in conclusion, furthermore.<br/>
<b>Español:</b> jugar un papel crucial, cabe destacar que, es menester, apasionado por, amplio abanico, crisol, sinergia perfecta, en conclusión, me dirijo a ustedes para postular."""
    cliche_table = Table([[Paragraph(cliche_box, code_text)]], colWidths=[519])
    cliche_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fff1f2")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#f43f5e")),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(cliche_table)

    story.append(Spacer(1, 4))
    story.append(Paragraph("6. Árbol de Aptitudes (7 Ramas) & Longitud de CV (1 vs. 2 Págs.)", h1))
    story.append(Paragraph("<b>Criterio de Longitud de CV:</b> 1 Página para startups/tech ágil. 2 Páginas (estándar preferido en Alemania/DACH, TVöD y consorcios de la UE) para detallar proyectos de campo, instrumentación (Eddy Covariance, SEV), publicaciones y conferencias oficiales.", body))
    
    tree_data = [
        [Paragraph("<b>Rama de Aptitud</b>", body_bold), Paragraph("<b>Competencias Clave</b>", body_bold), Paragraph("<b>Arquetipos Aplicables</b>", body_bold)],
        [Paragraph("1. Geofísica & Sensores", body), Paragraph("SEV, resistividad, gravimetría, inversión física, Sentinel-2, GEE.", body), Paragraph("Investigador I+D / Climate-Tech", body)],
        [Paragraph("2. Biogeoquímica & Suelos", body), Paragraph("Eddy Covariance, cámaras GEI (CO₂/CH₄), retención hídrica, limnología.", body), Paragraph("Investigador I+D / TVöD Suelos", body)],
        [Paragraph("3. Software & AI Product", body), Paragraph("R reproducible (Tidyverse, series), Python, Three.js, React 19.", body), Paragraph("Climate-Tech / Data Scientist", body)],
        [Paragraph("4. Políticas & Cuencas", body), Paragraph("Ordenamiento de cuencas, salvaguardas, directivas UE (RED III, ETS).", body), Paragraph("Consultor Políticas / CSRD", body)],
        [Paragraph("5. Prensa & Comunicaciones", body), Paragraph("Dirección editorial, radio, fact-checking, +700k audiencia en redes.", body), Paragraph("Director de Campañas / Outreach", body)],
        [Paragraph("6. Grassroots & Territorio", body), Paragraph("Comités de agua potable rural (APR), 80 asambleas en 14 regiones.", body), Paragraph("Director de Campañas / Territorio", body)],
        [Paragraph("7. Gestión de Proyectos", body), Paragraph("Consorcios europeos CAU Kiel / AMU Poznań, cooperación multiactor.", body), Paragraph("Project Manager I+D / UE", body)],
    ]
    tree_table = Table(tree_data, colWidths=[110, 260, 149])
    tree_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(tree_table)

    story.append(Spacer(1, 4))
    story.append(Paragraph("7. Prompt Maestro de Inicialización Rápida para Gemini Web", h1))
    
    prompt_box = """Actúa como el Headhunter Táctico y Editor Senior de Daniel Santander Urrutia basándote estrictamente en el 'Operative Core Dossier' adjunto. Cualquier evaluación, CV o Carta de Postulación debe cumplir obligatoriamente la 'Receta Maestra' en 1 página DIN 5008 (Apertura fuerte con gancho y tesis, Artifact Hook, cero justificaciones/zero-defensiveness, forward-looking pitch, cero clichés de IA, tono soberano de colega científico y cumplimiento estricto de ToR). Respeta las 7 ramas de su Árbol de Aptitudes y utiliza 2 páginas de CV para puestos académicos/DACH (TVöD) o 1 página para startups. Nunca inventes herramientas ni datos que no figuren en este documento."""
    
    prompt_table = Table([[Paragraph(prompt_box, code_text)]], colWidths=[519])
    prompt_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0284c7")),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(prompt_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print("ReportLab PDF successfully compiled to:", filename)

if __name__ == '__main__':
    build_pdf('/Users/danielsantander/Documents/Empleo/Daniel_Santander_Operative_Core_Dossier.pdf')

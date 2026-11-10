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
            self.drawString(40, 810, "OPERATIVE CORE DOSSIER // EXPEDIENTE MAESTRO & RECETA DE COVER LETTER")
            self.drawRightString(555, 810, "DANIEL SANTANDER URRUTIA")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.6)
            self.line(40, 804, 555, 804)

        # Footer
        self.setFont("Helvetica", 7.5)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.6)
        self.line(40, 34, 555, 34)
        self.drawString(40, 24, "CONFIDENCIAL // RECURSO DE GROUND TRUTH TÁCTICO PARA GOOGLE GEMINI")
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
        fontSize=14,
        leading=17,
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
        spaceAfter=8
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
        leading=10.5,
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
        fontSize=7.5,
        leading=10.2,
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

    flow_step_style = ParagraphStyle(
        'FlowStep',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=6.8,
        leading=8.5,
        alignment=1,
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

    story = []

    # =========================================================================
    # PÁGINA 1: MANDATO SISTÉMICO, IDENTIDAD Y REGLAS EDITORIALES
    # =========================================================================
    story.append(Paragraph("OPERATIVE CORE DOSSIER // DIRECTIVA MAESTRA DE CONTEXTO", title_style))
    story.append(Paragraph("Expediente Exhaustivo Ground Truth, Dual-Lens Audit & Receta Universal de Cover Letter", sub_title))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))

    mandate_html = """<b>MANDATO SUPREMO PARA GOOGLE GEMINI / LLM:</b> Este documento constituye el 'Menú Completo de Antecedentes Verificados' de Daniel Sebastián Santander Urrutia. Cuando se te asigne una oferta laboral, <b>tu tarea es seleccionar ('servirte') exactamente las herramientas, proyectos, logros y publicaciones afines a la vacante</b>, combinándolos con la Receta Maestra de Cover Letter y la norma de extensión adecuada (1 página para cartas y CVs de startups; 2 páginas para CVs científicos/DACH TVöD). Queda prohibido inventar empresas, cargos o datos no incluidos en este dossier."""
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

    story.append(Paragraph("1. Identidad, Estatus Contractual Europeo y Canales Canónicos", h1))
    id_data = [
        [Paragraph("<b>Nombre Completo</b>", body), Paragraph("Daniel Sebastián Santander Urrutia", body)],
        [Paragraph("<b>Titulación Base</b>", body), Paragraph("Licenciado en Geofísica (Universidad de Chile, Distinción Máxima) • Doble M.Sc. en Manejo Ambiental (CAU Kiel, Alemania) y Protección Ambiental (AMU Poznań, Polonia)", body)],
        [Paragraph("<b>Contacto Oficial</b>", body), Paragraph("Kiel, Schleswig-Holstein, Alemania | Bilbao, Bizkaia, España | danisantander.urrutia@gmail.com", body)],
        [Paragraph("<b>Portafolio de Evidencias</b>", body), Paragraph("https://danisantanderurrutia-coder.github.io/portafolio/ (Búnker de proyectos, peritajes, modelos y código)", body)],
        [Paragraph("<b>Habilitación Legal UE</b>", body), Paragraph("<b>Alemania:</b> Título de posgrado en universidad alemana con permiso <b>§ 20 AufenthG</b> (Investigador calificado / búsqueda de empleo; contratación y formalización inmediata bajo convenio TVöD sin requerir patrocinio previo de visa).<br/><b>España:</b> Régimen Profesionales Altamente Cualificados (PAC) Ley 14/2013.", body)],
    ]
    id_table = Table(id_data, colWidths=[120, 399])
    id_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(id_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph("2. Directivas Críticas de Comportamiento para el LLM", h1))
    
    rules_data = [
        [
            Paragraph("<b>1. Postura 'Zero-Servility'</b>", body_bold),
            Paragraph("El tono en cartas y entrevistas es el de un <b>par científico / consultor técnico soberano</b>, nunca el de un solicitante subordinado que pide favores. Trata al Investigador Principal (PI), director de grupo o comité de tú a tú, diagnosticando los cuellos de botella de su proyecto y aportando soluciones empíricas.", body)
        ],
        [
            Paragraph("<b>2. Regla 'Zero-Defensiveness'<br/>(Cero Justificaciones)</b>", body_bold),
            Paragraph("<b>Queda estrictamente prohibido usar conectores de disculpa o contraste defensivo</b> (<i>'a pesar de que mi formación es...', 'aunque no cuento con...', 'despite my background...'</i>). Plantar una objeción debilita la candidatura. Toda habilidad o antecedente previo se enmarca directamente como una <b>VENTAJA NATURAL y un activo acumulativo</b> que suma una perspectiva de la que carecen los candidatos estándar.", body)
        ],
        [
            Paragraph("<b>3. Principio Anti-Alucinación</b>", body_bold),
            Paragraph("Cita exclusivamente los hechos del Portafolio y la experiencia empírica. <b>No inventar herramientas no utilizadas</b>. Si una vacante requiere un software que Daniel no domina, la estrategia es demostrar asimetría de aprendizaje rápido mediante R/Python y física de medios porosos.", body)
        ]
    ]
    rules_table = Table(rules_data, colWidths=[130, 389])
    rules_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(rules_table)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 2: LA RECETA MAESTRA DE COVER LETTER & AUDITORÍA DUAL-LENS
    # =========================================================================
    story.append(Paragraph("3. La Receta Maestra de Cover Letter (1 Página DIN 5008)", h1))
    story.append(Paragraph("La carta de postulación formal debe redactarse en <b>1 sola página A4 estricta (400 – 480 palabras en 4-5 párrafos densos)</b>. Pasar de 1 página se percibe en Europa como falta de capacidad de síntesis ejecutiva. Solo se admiten 2 páginas si la convocatoria exige formalmente un <i>Research Proposal / Statement</i>.", body))

    story.append(Paragraph("<b>Flujo Táctico Horizontal de la Receta Maestra (6 Pasos Consecutivos):</b>", h2))
    
    mermaid_table_data = [
        [
            Paragraph("<b>PASO 1</b><br/>Apertura Fuerte<br/>(Hook & Tesis)", flow_step_style),
            Paragraph("➔", arrow_style),
            Paragraph("<b>PASO 2</b><br/>Diagnóstico del<br/>Reto Central", flow_step_style),
            Paragraph("➔", arrow_style),
            Paragraph("<b>PASO 3</b><br/>Evidencia &<br/>Artifact Hook", flow_step_style),
            Paragraph("➔", arrow_style),
            Paragraph("<b>PASO 4</b><br/>Asimetría Neta<br/>(Zero-Defense)", flow_step_style),
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
    story.append(Spacer(1, 5))

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
            Paragraph("<b>4. Asimetría Positiva<br/>(Zero-Defensiveness)</b>", body),
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
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(steps_table)
    story.append(Spacer(1, 5))

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
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(dual_lens_table)

    story.append(Paragraph("5. Lista Negra de Clichés de IA y Relleno Burocrático", h1))
    cliche_box = """<b>Inglés:</b> thrilled to, delve into, testament to, beacon of, foster, seamlessly align, tapestry, spearhead, unwavering, passionate about, in conclusion, furthermore.<br/>
<b>Español:</b> jugar un papel crucial, cabe destacar que, es menester, apasionado por, amplio abanico, crisol, sinergia perfecta, en conclusión, me dirijo a ustedes para postular."""
    cliche_table = Table([[Paragraph(cliche_box, code_text)]], colWidths=[519])
    cliche_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fff1f2")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#f43f5e")),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(cliche_table)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 3: MENÚ DE ANTECEDENTES (PARTE 1: LAS 6 EXPERIENCIAS MAESTRAS)
    # =========================================================================
    story.append(Paragraph("6. Expediente Consolidado: Las 6 Experiencias Maestras", h1))
    story.append(Paragraph("Instrucción para Gemini: <i>'Sírvete' los bloques de experiencia relevantes según el rol objetivo (académico, software, políticas o campañas):</i>", body))

    experiences = [
        ("Investigador en Hidrogeofísica, Suelos y Dinámica de GEI en Turberas", "CAU Kiel & AMU Poznań (Alemania/Polonia)", "2023 – Presente",
         "Cuantificación empírica de flujos de gases de efecto invernadero (CO₂, CH₄) en la turbera templada rehumedecida Wallener Au (Schleswig-Holstein) mediante torres micrometeorológicas de covarianza de torbellinos (Eddy Covariance) y cámaras de flujo cerrado. Caracterización hidrofísica y de suelos (curvas de retención hídrica, porosidad y dinámica de humedad edáfica). Monitoreo limnológico de calidad de agua y bioindicadores en lagos de Poznań bajo la Directiva Marco del Agua de la UE. Desarrollo del gemelo digital y visor 3D 'Wetland Monitor'.",
         "R, Python, QGIS, Eddy Covariance, Cámaras de Flujo, Física de Suelos, Directiva Marco del Agua, Three.js"),
        
        ("Geofísico de Terreno & Modelación Hidrogeofísica de Cuencas", "Universidad de Chile (FCFM)", "2015 – 2021",
         "Investigación cuantitativa y trabajo de terreno en física de la Tierra e hidrogeofísica aplicada. Memoria de título aprobada Con Distinción centrada en la Cuenca del Río Maule: campañas de adquisición e inversión de resistividad eléctrica del subsuelo (Sondeos Eléctricos Verticales - SEV) y prospección gravimétrica, cuantificando la relación entre el avance de monocultivos forestales industriales, sequía por cambio climático y el abatimiento sostenido del nivel freático.",
         "Sondeos Eléctricos Verticales (SEV), Gravimetría, Python, Inversión Geofísica, Hidrología Subterránea, MATLAB"),

        ("Expositor Técnico Parlamentario & Asesor en Políticas de Cuencas", "Cámara de Diputadas y Diputados de Chile", "2021 – Presente",
         "Asesoría técnica parlamentaria y comunitaria sobre políticas públicas de prevención de megaincendios, gestión integrada del agua y transición ecológica territorial. Comparecencia oficial como perito técnico ante la Comisión Especial de Emergencia, Desastres y Bomberos de la Cámara de Diputadas y Diputados de Chile, fundamentando la relación biofísica estructural entre monocultivos forestales y riesgo de incendios. Redacción técnica de propuestas de ordenamiento por cuencas y salvaguardias en el proceso constitucional chileno.",
         "Incidencia Legislativa, Políticas Públicas, Gobernanza de Cuencas, Salvaguardias Ambientales, Ordenamiento Territorial"),

        ("Autor Técnico Principal & Investigador de Impactos de Biomasa", "Environmental Paper Network (EPN) & Global Forest Coalition", "2023",
         "Investigación internacional independiente y autoría principal del informe 'Spotlight on Burning Biomass for Energy in South America: Community Opposition to a Power Plant in Parral, Chile'. Análisis riguroso de vacíos metodológicos en la contabilidad de carbono de la biomasa forestal, desmintiendo la neutralidad climática y fiscalizando los subsidios de energía renovable otorgados bajo directivas europeas (RED III y ETS). Coordinación multiactor con redes socioambientales globales.",
         "Contabilidad de Carbono, Directiva UE RED III / ETS, Bioenergía, Salvaguardias Forestales, Facilitación Multiactor"),

        ("Coordinador General de Campaña y Director de Prensa Nacional", "Campaña Nacional 'Apruebo Rural'", "2020 – 2023",
         "Lideró la coordinación general de la campaña comunicacional y despliegue territorial de 'Apruebo Rural', articulando a pequeños agricultores familiares campesinos, comités de agua potable rural (APR) y poblados cercados por monocultivos forestales con las cadenas nacionales de TV, radios comunales y masivos actos públicos. Gira nacional por 14 regiones del centro y sur de Chile realizando más de 80 asambleas y encuentros comunales; distribución de 500.000 kits pedagógicos.",
         "Dirección de Campañas, Comunicaciones Estratégicas, Storytelling Transmedia, Coordinación Multiactor, Producción Audiovisual"),

        ("Fundador, Director Editorial & Periodista de Investigación Socioambiental", "Primera Línea Prensa & Red Maule Sur", "2019 – 2023",
         "Cofundador y director editorial de medio digital independiente enfocado en periodismo ciudadano, crisis climática, desastres forestales y derechos humanos, alcanzando más de 700.000 seguidores orgánicos en redes sociales. Panelista semanal en Radio Cristalina (96.3 FM) y MauleRed. Diseñador y relator del 'Taller de Corresponsales Populares', capacitando y certificando a 45 vecinos rurales en reportería móvil, ética y verificación de hechos.",
         "Periodismo de Investigación, Dirección Editorial, Radio & Podcasts, Gestión de Redes Sociales, Fact-Checking")
    ]

    for title, org, date, desc, tech in experiences:
        exp_box = f"<b>{title}</b> — <font color='#0284c7'>{org}</font> ({date})<br/>{desc}<br/><b>Tecnologías & Métodos:</b> <i>{tech}</i>"
        t = Table([[Paragraph(exp_box, body)]], colWidths=[519])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('LEFTPADDING', (0,0), (-1,-1), 5),
            ('RIGHTPADDING', (0,0), (-1,-1), 5),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))
        story.append(t)
        story.append(Spacer(1, 3))

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 4: BANCO DE LOGROS (8 HITOS) & LOS 5 GEMELOS DIGITALES / PROYECTOS
    # =========================================================================
    story.append(Paragraph("7. Banco de Logros e Impactos Cuantitativos (8 Hitos Clave)", h1))
    
    achievements = [
        ("ach-1", "Dictamen Pericial ante Comisión de Emergencia del Congreso", "Intervención Legislativa Oficial", "Fundamentación física y cartográfica de la correlación entre plantaciones forestales y megaincendios, incorporada formalmente a las actas legislativas del Congreso Nacional de Chile."),
        ("ach-2", "Semifinalista Global ONU Citiverse Challenge (SDG Cities)", "Distinción Internacional ONU", "Selección internacional por Naciones Unidas por el gemelo digital Smart Food Parks integrando agro-IoT, microclima urbano y teledetección espacial Sentinel-2."),
        ("ach-3", "Taller de Corresponsales Populares en Territorio", "45+ Corresponsales Capacitados", "Capacitación y certificación comunitaria de más de 45 voceros y vecinos rurales frente a la crisis hídrica en Maule Sur en reportería móvil ética y verificación de hechos."),
        ("ach-4", "Autor Principal en Informe Internacional EPN sobre Carbono y RED III", "Lead Author // Reporte EPN", "Exposición internacional de vacíos contables de carbono y fiscalización de subsidios de energía renovable en bioenergía forestal frente a directivas europeas RED III y ETS."),
        ("ach-5", "Caracterización Hidrofísica y Dinámica de Poros en Turberas", "Curvas de retención & balances", "Análisis cuantitativo de curvas de retención hídrica, volumen de poros y dinámica de humedad edáfica en turberas templadas de Wallener Au en laboratorio de la CAU Kiel."),
        ("ach-6", "Licenciatura y Título de Geofísico Con Distinción Máxima (U. de Chile)", "Aprobado Con Distinción Máxima", "Distinción máxima otorgada por la FCFM por la investigación cuantitativa de campo con Sondeos Eléctricos Verticales (SEV) y gravimetría en la Cuenca del Maule."),
        ("ach-7", "Coordinación Logística de Emergencia ante Catástrofes", "Despliegue en 4 Regiones // Caravanas 4x4", "Despliegue operativo de centros de acopio y caravanas 4x4 transportando decenas de toneladas de víveres, agua potable y herramientas a comunidades rurales damnificadas."),
        ("ach-8", "Dirección de Campaña Nacional Transmedia 'Apruebo Rural'", "14 Regiones // 80+ Asambleas // 500K+ Kits", "Liderazgo de campaña transmedia: despliegue en 14 regiones con 80+ asambleas comunales, acto de cierre masivo, 60+ columnas/coberturas en medios y 500K+ volantes distribuidos.")
    ]

    ach_table_data = [[Paragraph("<b>ID</b>", body_bold), Paragraph("<b>Hito / Logro Cuantitativo</b>", body_bold), Paragraph("<b>Métrica / Impacto</b>", body_bold), Paragraph("<b>Detalle y Respaldo</b>", body_bold)]]
    for aid, atitle, amet, adet in achievements:
        ach_table_data.append([
            Paragraph(f"<code>{aid}</code>", code_text),
            Paragraph(f"<b>{atitle}</b>", body),
            Paragraph(f"<font color='#0284c7'><b>{amet}</b></font>", body),
            Paragraph(adet, body)
        ])
    ach_table = Table(ach_table_data, colWidths=[45, 140, 110, 224])
    ach_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(ach_table)
    story.append(Spacer(1, 5))

    story.append(Paragraph("8. Los 5 Gemelos Digitales & Proyectos Tecnológicos (Artifact Hooks)", h1))
    
    projects = [
        ("Wetland Monitor (Wallener Au)", "Gemelo Digital & Software Científico (2023-2026)", "Simulación interactiva 3D de flujos de CO₂ y picos de CH₄ en turberas templadas rehumedecidas bajo forzantes de Eddy Covariance y curvas de retención hídrica edáfica.", "React, TypeScript, R, Eddy Covariance, Three.js", "https://danisantanderurrutia-coder.github.io/wetland-monitor/"),
        ("Chile Agrotech & AgriTwin", "Agrotech, IoT & Satélites (2023-Presente)", "Gemelo digital de telemetría de suelo IoT LoRaWAN combinado con pipeline automatizado de índices satelitales Copernicus Sentinel-2 (NDVI/NDRE) para prevención de estrés hídrico.", "Python, Sentinel-2 API, IoT LoRaWAN, FastAPI, QGIS, PostGIS, Next.js", "https://danisantanderurrutia-coder.github.io/agritwin-app/"),
        ("ReWild: Analítica de Incendios (Resumof)", "Soporte de Decisión Espacial (2023-Presente)", "Sistema de soporte de decisión para reemplazo de monocultivos combustibles por barreras cortafuego de bosque nativo, modelando la amortiguación del fuego y recuperación hídrica.", "Google Earth Engine, Python GIS, Sentinel-2, GeoPandas, Streamlit, Rasterio", "https://github.com/danisantanderurrutia-coder/resumof"),
        ("Smart Food Parks (UN Citiverse)", "Gemelo Digital & Agro-IoT Urbano (2024)", "Gemelo digital y plataforma ciberfísica para soberanía alimentaria urbana, control microclimático y redes de sensores IoT. Semifinalista Global ONU Citiverse Challenge.", "Unity 3D, IoT Telemetry, MQTT, Python AI, Google Earth Engine, QGIS", "https://danisantanderurrutia-coder.github.io/portafolio/"),
        ("Lauwersmeer: Simulación 2D Delft3D", "Ingeniería Costera & Modelación (2023-2024)", "Modelación hidrodinámica 2D en Delft3D para simulación de marejadas de tempestad, oleaje extremo y aumento del nivel del mar bajo escenarios IPCC en el Mar de Wadden.", "Delft3D, Python Hydro, LiDAR DEM, QGIS, Copernicus Marine, NetCDF", "https://danisantanderurrutia-coder.github.io/portafolio/")
    ]

    proj_table_data = [[Paragraph("<b>Proyecto / Gemelo Digital</b>", body_bold), Paragraph("<b>Descripción Técnica & Deliverables</b>", body_bold), Paragraph("<b>Tech Stack & Artifact URL</b>", body_bold)]]
    for ptitle, pcat, pdesc, ptech, purl in projects:
        proj_table_data.append([
            Paragraph(f"<b>{ptitle}</b><br/><font color='#64748b'>{pcat}</font>", body),
            Paragraph(pdesc, body),
            Paragraph(f"<b>Stack:</b> {ptech}<br/><b>Enlace:</b> <font color='#0284c7'>{purl}</font>", body)
        ])
    proj_table = Table(proj_table_data, colWidths=[130, 230, 159])
    proj_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(proj_table)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 5: INSTRUMENTAL, PUBLICACIONES Y CONFERENCIAS INTERNACIONALES
    # =========================================================================
    story.append(Paragraph("9. Inventario de Instrumental de Campo y Laboratorio Dominado", h1))
    
    equip_data = [
        [Paragraph("<b>Instrumental / Equipo</b>", body_bold), Paragraph("<b>Categoría</b>", body_bold), Paragraph("<b>Aplicación Técnica Específica</b>", body_bold)],
        [Paragraph("<b>Syscal Pro (Iris Instruments)</b>", body), Paragraph("Geofísica", body), Paragraph("Resistivímetro multielectrodo para tomografía de resistividad eléctrica profunda (ERT) y Sondeos Eléctricos Verticales (SEV).", body)],
        [Paragraph("<b>LI-COR LI-7500 / LI-7700</b>", body), Paragraph("Atmósfera / GEI", body), Paragraph("Analizadores de gas infrarrojo de paso abierto para torres micrometeorológicas de covarianza de torbellinos (Eddy Covariance) de CO₂ y CH₄.", body)],
        [Paragraph("<b>CTD Divers & Piezómetros</b>", body), Paragraph("Hidrología", body), Paragraph("Registradores continuos y sondas de nivel freático, conductividad eléctrica y temperatura de agua subterránea en pozos.", body)],
        [Paragraph("<b>Barrenas Edelman & Testigos</b>", body), Paragraph("Suelos", body), Paragraph("Muestreo no perturbado de cilindros de suelo para densidad aparente, curvas de retención hídrica y conductividad hidráulica.", body)],
        [Paragraph("<b>Cámaras Dinámicas de Suelo</b>", body), Paragraph("Biogeoquímica", body), Paragraph("Medición in-situ de respiración heterótrofa y autótrofa del suelo y emisiones biogénicas de gases de efecto invernadero.", body)],
        [Paragraph("<b>Drones & Multiespectral</b>", body), Paragraph("Teledetección", body), Paragraph("Fotogrametría aérea de alta resolución e índices multiespectrales de vigor vegetal (NDVI/NDRE) en cuencas y parcelas agrícolas.", body)]
    ]
    equip_table = Table(equip_data, colWidths=[140, 80, 299])
    equip_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(equip_table)
    story.append(Spacer(1, 5))

    story.append(Paragraph("10. Publicaciones Técnicas, Prensa de Investigación y Ensayos (9 Obras)", h1))
    
    pubs = [
        ("Spotlight on Burning Biomass (Parral, Maule)", "Environmental Paper Network & Global Forest Coalition (2023)", "Policy Report", "Lead Author. Vacíos contables de carbono en biomasa forestal, directivas UE RED III y ETS."),
        ("Humedales bajo fuego: ¿Qué sabemos?", "Tomate Rojo // Red Plurinacional de Humedales (2023)", "Prensa Científica", "Impacto de megaincendios en humedales y turberas."),
        ("Inversiones para la agricultura orgánica ahora", "Resumen.cl & Comestible.info (con Dirk Kock-Rohwer) (2024)", "Policy / Prensa", "Columna con el diputado alemán Los Verdes sobre fertilidad de suelos y agroecología."),
        ("¿Cómo nos preparamos para un colapso climático?", "El Regionalista & Fundación Suelo (2023)", "Prensa / Análisis", "Adaptación comunitaria profunda y regeneración de suelos."),
        ("Noruega y el debate mundial del Decrecimiento", "El Desconcierto // Periodismo Internacional (2025)", "Prensa Investigación", "Crónica desde Oslo sobre post-extractivismo y límites ecológicos planetarios."),
        ("Encuentro Latinoamericano de Líderes Climáticos", "Delfino.cr (San José, Costa Rica, 2023)", "Prensa Internacional", "Cobertura de articulación de justicia climática intergeneracional."),
        ("Ser libres al borde del abismo (Tetralogía)", "Observatorio Latinoamericano de Conflictos Ambientales - OLCA (2025)", "Ensayo Político-Ecológico", "Obra ensayística de 4 partes sobre economía ecológica y autonomía."),
        ("Monocultivos Forestales y Falsas Soluciones", "ClimateCC // Portal Internacional (2024)", "Ensayo Internacional", "Desglose crítico de créditos de carbono forestales y falsas soluciones."),
        ("Libro Científico Internacional: Dinámica de Incendios", "Editor Principal & Coordinación Internacional (2024-2026)", "Libro Científico", "Física de propagación del fuego, interacción suelo-combustible y cuencas mediterráneas.")
    ]

    pub_table_data = [[Paragraph("<b>Título de la Obra</b>", body_bold), Paragraph("<b>Editorial / Medio</b>", body_bold), Paragraph("<b>Categoría</b>", body_bold), Paragraph("<b>Resumen de Contenido</b>", body_bold)]]
    for ptitle, poutlet, pcat, psum in pubs:
        pub_table_data.append([
            Paragraph(f"<b>{ptitle}</b>", body),
            Paragraph(poutlet, body),
            Paragraph(f"<font color='#0284c7'><b>{pcat}</b></font>", body),
            Paragraph(psum, body)
        ])
    pub_table = Table(pub_table_data, colWidths=[140, 130, 80, 169])
    pub_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(pub_table)
    story.append(Spacer(1, 5))

    story.append(Paragraph("11. Conferencias Internacionales y Ponencias Oficiales (4 Hitos)", h1))
    
    confs = [
        ("Carbon Offsets e Impactos Socioecológicos", "Environmental Justice Conference (ENJUST)", "Bonn, Alemania (2025)", "Conferencista Internacional sobre vacíos contables en compensaciones de carbono y monocultivos forestales."),
        ("Límites Biofísicos y Alternativas al Crecimiento", "World Degrowth Conference", "Oslo, Noruega (2025)", "Ponente y corresponsal sobre post-extractivismo y soberanía ecológica."),
        ("Uso de Suelo y Extracción de Biomasa en Latam", "Foro Latinoamericano de Transición Justa", "Bogotá, Colombia (2023)", "Panelista sobre estrés hídrico en cuencas rurales y transición energética justa."),
        ("Gobernanza Hídrica y Justicia Climática", "Cumbre Latinoamericana de Líderes Socioambientales", "San José, Costa Rica (2023)", "Delegado oficial por Chile en mesas de articulación para salvaguardias ambientales.")
    ]

    conf_table_data = [[Paragraph("<b>Conferencia / Ponencia</b>", body_bold), Paragraph("<b>Evento & Lugar</b>", body_bold), Paragraph("<b>Rol & Aporte Principal</b>", body_bold)]]
    for ctitle, cevent, cloc, csum in confs:
        conf_table_data.append([
            Paragraph(f"<b>{ctitle}</b>", body),
            Paragraph(f"{cevent}<br/><font color='#64748b'>{cloc}</font>", body),
            Paragraph(csum, body)
        ])
    conf_table = Table(conf_table_data, colWidths=[150, 160, 209])
    conf_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(conf_table)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 6: FORMACIÓN ACADÉMICA, CURSOS DE POSGRADO & PROMPT DE ACTIVACIÓN
    # =========================================================================
    story.append(Paragraph("12. Formación Académica Universitaria y Posgrados", h1))
    
    edu_data = [
        [Paragraph("<b>Titulación / Grado</b>", body_bold), Paragraph("<b>Institución & Ubicación</b>", body_bold), Paragraph("<b>Período & Enfoque de Especialización</b>", body_bold)],
        [
            Paragraph("<b>M.Sc. en Manejo Ambiental<br/>(Environmental Management)</b>", body),
            Paragraph("Christian-Albrechts-Universität zu Kiel (CAU Kiel)<br/><font color='#64748b'>Kiel, Alemania</font>", body),
            Paragraph("<b>2023 – 2026.</b> Facultad de Ciencias Agrícolas y Nutricionales. Especialidad en hidrofísica de suelos, flujos de GEI (Eddy Covariance CO₂/CH₄) y manejo de cuencas.", body)
        ],
        [
            Paragraph("<b>M.Sc. en Protección Ambiental<br/>(Environmental Protection)</b>", body),
            Paragraph("Adam Mickiewicz University (AMU Poznań)<br/><font color='#64748b'>Poznań, Polonia</font>", body),
            Paragraph("<b>2023 – 2026.</b> Facultad de Biología y Geografía. Especialidad en limnología, bioindicadores acuáticos y Directiva Marco del Agua de la UE.", body)
        ],
        [
            Paragraph("<b>Licenciado en Geofísica<br/>& Título de Geofísico</b>", body),
            Paragraph("Universidad de Chile (FCFM)<br/><font color='#64748b'>Santiago, Chile</font>", body),
            Paragraph("<b>2014 – 2021.</b> <b>Distinción Máxima.</b> Departamento de Geofísica. Prospección de subsuelo con SEV y gravimetría en la Cuenca del Maule e hidrogeofísica.", body)
        ]
    ]
    edu_table = Table(edu_data, colWidths=[140, 160, 219])
    edu_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(edu_table)
    story.append(Spacer(1, 5))

    story.append(Paragraph("13. Cursos Internacionales, Cumbres y Formación Especializada", h1))
    
    courses = [
        "<b>BlueGreen Biodiversity Summit:</b> WSL Swiss Federal Research Institute, Davos, Suiza (2025). Biodiversidad acuática y terrestre frente al cambio global.",
        "<b>Interlinked Justice & Resilient Landscapes:</b> Leibniz Institute of Ecological Urban and Regional Development (IOER), Dresden, Alemania (2024–2025).",
        "<b>Doughnut Economics Practitioner:</b> DEAL Doughnut Economics Action Lab, Copenhague, Dinamarca (2025). Límites planetarios y pisos sociales aplicados.",
        "<b>Rewilding & Gestión Forestal:</b> Plano de Gestão Florestal & StoryMaps, Aljezur, Portugal (2024). Restauración y cortafuegos vivos nativos.",
        "<b>Curso Certificado de Diseño en Permacultura (CDP):</b> EPAC & Fundación Suelo (2023, 80 h). Diseño hidrológico Keyline y regeneración de suelos.",
        "<b>3ª Escuela de Verano 'Costas Resilientes':</b> (CR)2, Universidad de Chile (2023, 57 h, dir. René Garreaud). Eventos extremos, marejadas y cambio climático.",
        "<b>Modelado de Nicho Ecológico, Teledetección y R:</b> Instituto Ambiental GIS (2022, 20 h). Algoritmos MaxEnt, R y procesamiento satelital.",
        "<b>Economía Verde y Financiarización de la Naturaleza:</b> Censat Agua Viva & Amigos de la Tierra Internacional, Bogotá, Colombia (2022, 16 h)."
    ]
    for c in courses:
        story.append(Paragraph(f"• {c}", body))

    story.append(Spacer(1, 5))
    story.append(Paragraph("14. Árbol de Aptitudes (7 Ramas) & Guía de Longitud de CV (1 vs. 2 Págs.)", h1))
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
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(tree_table)

    story.append(Spacer(1, 5))
    story.append(Paragraph("15. Prompt Maestro de Inicialización Rápida para Gemini Web", h1))
    
    prompt_box = """Actúa como el Headhunter Táctico y Editor Senior de Daniel Santander Urrutia basándote estrictamente en el 'Operative Core Dossier' adjunto. Tienes a tu disposición su menú completo de 6 puestos de experiencia, 8 logros verificados, 5 gemelos digitales/software, instrumental de campo, 9 publicaciones y conferencias. Tu tarea es 'servirte' los elementos exactos que maximicen el encaje con la vacante objetivo. Cualquier evaluación, CV o Carta de Postulación debe cumplir obligatoriamente la 'Receta Maestra' en 1 página DIN 5008 (Apertura fuerte con gancho y tesis, Artifact Hook, zero-defensiveness, forward-looking pitch, cero clichés de IA, tono de par científico y cumplimiento de ToR). Respeta las 7 ramas de su Árbol de Aptitudes y utiliza 2 páginas de CV para puestos académicos/DACH (TVöD) o 1 página para startups. Nunca inventes herramientas ni datos que no figuren en este dossier."""
    
    prompt_table = Table([[Paragraph(prompt_box, code_text)]], colWidths=[519])
    prompt_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0284c7")),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(prompt_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print("Comprehensive Operative Core Dossier successfully compiled to:", filename)

if __name__ == '__main__':
    build_pdf('/Users/danielsantander/Documents/Empleo/Daniel_Santander_Operative_Core_Dossier.pdf')

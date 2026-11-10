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
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 810, "OPERATIVE CORE DOSSIER // DIRECTIVA CANÓNICA & RECETA MAESTRA DE COVER LETTER")
            self.drawRightString(555, 810, "DANIEL SANTANDER URRUTIA")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.6)
            self.line(40, 804, 555, 804)

        # Footer
        self.setFont("Helvetica", 7.5)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.6)
        self.line(40, 36, 555, 36)
        self.drawString(40, 26, "CONFIDENCIAL // RECURSO DE CONTEXTO TÁCTICO PARA MODELO GEMINI / LLM")
        self.drawRightString(555, 26, f"Página {self._pageNumber} de {page_count}")
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
    
    # Custom styles
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
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=11,
        spaceAfter=5,
        keepWithNext=True
    )

    h2 = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11.5,
        textColor=colors.HexColor("#0369a1"),
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )

    body = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=4
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
        fontSize=7.8,
        leading=10.8,
        textColor=colors.HexColor("#0f172a")
    )

    code_text = ParagraphStyle(
        'CodeText',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # =========================================================================
    # PORTADA / ENCABEZADO
    # =========================================================================
    story.append(Paragraph("OPERATIVE CORE DOSSIER // DIRECTIVA CANÓNICA", title_style))
    story.append(Paragraph("Perfil Maestro Ground Truth, Criterios Dual-Lens & La Receta Universal de una Gran Carta de Postulación", sub_title))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=8))

    # Mandato Box
    mandate_html = """<b>MANDATO SUPREMO PARA GOOGLE GEMINI / LLM:</b> Este documento constituye la Única Fuente de Verdad sobre Daniel Santander Urrutia y establece la norma editorial universal para evaluar vacantes y redactar CVs o cartas. Queda terminantemente prohibido alucinar herramientas no utilizadas, inventar cargos o recurrir a fórmulas burocráticas serviles. Toda afirmación debe anclarse en hechos empíricos y metodologías reales."""
    mandate_table = Table([[Paragraph(mandate_html, callout_text)]], colWidths=[519])
    mandate_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fffbeb")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#f59e0b")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(mandate_table)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECCIÓN 1: IDENTIDAD Y ESTATUS LEGAL
    # =========================================================================
    story.append(Paragraph("1. Identidad, Estatus Contractual y Canales Verificados", h1))
    
    id_data = [
        [Paragraph("<b>Nombre Completo</b>", body), Paragraph("Daniel Sebastián Santander Urrutia", body)],
        [Paragraph("<b>Titulación Base</b>", body), Paragraph("Licenciado en Geofísica (Universidad de Chile, Distinción Máxima) • Doble M.Sc. en Manejo Ambiental (CAU Kiel, Alemania) y Protección Ambiental (AMU Poznań, Polonia)", body)],
        [Paragraph("<b>Contacto Oficial</b>", body), Paragraph("Kiel, Schleswig-Holstein, Alemania | Bilbao, Bizkaia, España | danisantander.urrutia@gmail.com", body)],
        [Paragraph("<b>Portafolio de Evidencias</b>", body), Paragraph("https://danisantanderurrutia-coder.github.io/portafolio/ (Búnker de proyectos, peritajes y código)", body)],
        [Paragraph("<b>Habilitación Legal UE</b>", body), Paragraph("<b>Alemania:</b> Título de posgrado en universidad alemana con permiso <b>§ 20 AufenthG</b> (Investigador calificado / búsqueda de empleo; contratación inmediata sin patrocinio previo de visa).<br/><b>España:</b> Régimen Profesionales Altamente Cualificados (PAC) Ley 14/2013.", body)],
    ]
    id_table = Table(id_data, colWidths=[120, 399])
    id_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(id_table)
    story.append(Spacer(1, 6))

    # =========================================================================
    # SECCIÓN 2: GROUND TRUTH EMPÍRICO
    # =========================================================================
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
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(impact_table)

    story.append(PageBreak())

    # =========================================================================
    # SECCIÓN 3: LA TEORÍA UNIVERSAL DE UNA GRAN COVER LETTER
    # =========================================================================
    story.append(Paragraph("3. La Teoría Universal y Receta Maestra de una Gran Carta de Postulación", h1))
    story.append(Paragraph("Una carta de postulación excepcional <b>no es un currículum en prosa ni un ejercicio de adulación</b>. Es una <b>pieza de persuasión estratégica</b> que resuelve una única pregunta para el decisor: <i>'¿Entiende este candidato el problema real de mi organización y puede acelerar su solución mejor que nadie?'</i>", body))

    story.append(Paragraph("A. Los 4 Principios Inquebrantables de una Carta de Alto Nivel", h2))
    
    principles = [
        "<b>1. Enfoque 'Zero-Servility' (De Colega a Colega):</b> El candidato escribe como un par profesional o consultor soberano. No pide oportunidades ni expresa agradecimiento anticipado por 'ser considerado'. Diagnostica la situación técnica y plantea valor de igual a igual.",
        "<b>2. Orientación al Problema (Problem-Centric, no Me-Centric):</b> El 80% de las cartas fracasan porque hablan de lo que el postulante 'desea aprender' o lo que 'le apasiona'. Una gran carta habla de los cuellos de botella del proyecto, los riesgos del sector y cómo se destraban.",
        "<b>3. Densidad de Evidencia vs. Densidad de Adjetivos:</b> Queda prohibido afirmar que uno es 'meticuloso, apasionado o visionario'. El adjetivo se reemplaza siempre por el protocolo, la herramienta y el resultado medible (ej. en vez de 'gran analista', citar 'modelación multivariada en R acoplando balances hidrológicos').",
        "<b>4. Asimetría de Entrada (The Unfair Advantage):</b> Toda postulación ganadora articula un puente que los candidatos promedio no tienen (ej. unir geofísica dura de subsuelo con biogeoquímica de superficie y oratoria legislativa)."
    ]
    for p in principles:
        story.append(Paragraph(f"• {p}", body))

    story.append(Spacer(1, 4))
    story.append(Paragraph("B. La Arquitectura Narrativa en 4 Actos (The Golden Thread)", h2))

    acts_data = [
        [Paragraph("<b>Acto / Párrafo</b>", body_bold), Paragraph("<b>Función Táctica & Reglas Obligatorias</b>", body_bold)],
        [
            Paragraph("<b>Acto 1: Apertura Fuerte<br/>(The Hook & Thesis)</b>", body),
            Paragraph("<b>PROHIBIDO abrir con fórmulas burocráticas</b> (<i>'Me dirijo a usted para postular...', 'I am writing to express my interest in...'</i>).<br/><b>Regla:</b> Abre en la primera línea con el desafío central de la organización o proyecto y tu tesis de alineamiento técnico. Conecta directamente con la coyuntura del sector.", body)
        ],
        [
            Paragraph("<b>Acto 2: Evidencia Empírica de Resolución</b>", body),
            Paragraph("Demuestra competencia resolviendo un problema similar al que enfrenta el equipo. Cita marcos metodológicos verificables, instrumentación real y tratamiento de datos. No listes cargos; narra la fricción superada y el balance técnico obtenido.", body)
        ],
        [
            Paragraph("<b>Acto 3: Asimetría & Facilitación Multiactor</b>", body),
            Paragraph("Explica por qué tu formación transdisciplinaria neutraliza los riesgos del puesto. Conecta el rigor analítico con la capacidad de interlocución (traducción de datos a tomadores de decisión, gestión de desacuerdos o articulación de campo).", body)
        ],
        [
            Paragraph("<b>Acto 4: Propuesta Hacia Adelante (Forward-Looking Pitch)</b>", body),
            Paragraph("Proyecta tu acción en los primeros 90 días o sobre el objetivo inmediato del proyecto (ej. <i>'Al asumir este rol, mi prioridad operativa será articular...'</i>). Demuestra que comienzas a trabajar mentalmente antes de ser contratado.", body)
        ],
        [
            Paragraph("<b>Cierre Formal:<br/>Cumplimiento ToR</b>", body),
            Paragraph("Declaración explícita de disponibilidad horaria (ej. 40h/semana, trabajo en terreno), expectativas de honorarios/convenio (TVöD E13 o consultoría) y estatus legal inmediato de contratación (§ 20 AufenthG). Cierre sobrio sin servilismo.", body)
        ],
    ]
    acts_table = Table(acts_data, colWidths=[120, 399])
    acts_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(acts_table)

    story.append(Spacer(1, 4))
    story.append(Paragraph("C. Catálogo de Iniciadores de Oración de Alto Impacto", h2))
    story.append(Paragraph("Para romper la monotonía de oraciones que comienzan con 'Yo', 'I', 'I have' o 'En este rol', el modelo debe alternar con iniciadores sintácticos de contexto:", body))

    starters = [
        "<b>De Contexto & Contraste:</b> <i>'Rather than imposing top-down agendas...', 'En la intersección entre la física de medios porosos y la política de cuencas...', 'Where traditional approaches treat catchment dynamics as...'</i>",
        "<b>De Aprendizaje Empírico & Tracción:</b> <i>'Having coordinated multi-stakeholder coalitions across...', 'La experiencia articulando comités de agua potable rural y equipos científicos demostró que...', 'Through direct field instrumentation in...'</i>",
        "<b>De Propuesta Hacia Adelante:</b> <i>'Stepping into this role, my immediate priority would be to...', 'To bridge regional field realities with European reporting standards...', 'What I offer [Institución] is the verified capacity to...'</i>"
    ]
    for s in starters:
        story.append(Paragraph(f"• {s}", body))

    story.append(PageBreak())

    # =========================================================================
    # SECCIÓN 4: AUDITORÍA DUAL-LENS & CHECKLIST DE CONTROL
    # =========================================================================
    story.append(Paragraph("4. Sistema de Auditoría Dual-Lens (Headhunter ATS vs. Wingman PI)", h1))
    story.append(Paragraph("Todo documento generado debe someterse a la doble auditoría simultánea implementada en el motor de <i>Empleo</i>:", body))

    dual_lens_data = [
        [Paragraph("<b>Lente 1: Headhunter / ATS (Filtro Formal 45%)</b>", body_bold), Paragraph("<b>Lente 2: Wingman / PI (Filtro Colega 55%)</b>", body_bold)],
        [
            Paragraph("• <b>Densidad de Palabras Clave:</b> Coincidencia exacta con requisitos indispensables del anuncio.<br/>• <b>Cumplimiento ToR:</b> Mención expresa de títulos homologables, horas semanales y habilitación contractual.<br/>• <b>Legibilidad Estricta:</b> 1.5 a 2.5 min de lectura, formato DIN 5008 y viñetas estructuradas.", body),
            Paragraph("• <b>Ataque a los Dolores del PI:</b> La carta ataca directamente el cuello de botella del laboratorio o proyecto.<br/>• <b>Asimetría Competitiva:</b> Deja claro por qué Daniel es irreemplazable frente a agrónomos o geólogos estándar.<br/>• <b>Desmontaje de Objeciones (Stress Test):</b> Neutraliza dudas sobre idioma, terreno o estatus antes de la entrevista.", body)
        ]
    ]
    dual_lens_table = Table(dual_lens_data, colWidths=[255, 264])
    dual_lens_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(dual_lens_table)

    story.append(Paragraph("5. Lista Negra de Clichés de IA y Relleno Burocrático", h1))
    story.append(Paragraph("El modelo debe verificar que el texto tenga <b>cero ocurrencias</b> de las siguientes palabras vetadas:", body))

    cliche_box = """<b>Inglés:</b> thrilled to, delve into, testament to, beacon of, foster, seamlessly align, tapestry, spearhead, unwavering, passionate about, in conclusion, furthermore.<br/>
<b>Español:</b> jugar un papel crucial, cabe destacar que, es menester, apasionado por, amplio abanico, crisol, sinergia perfecta, en conclusión, me dirijo a ustedes para postular."""
    
    cliche_table = Table([[Paragraph(cliche_box, code_text)]], colWidths=[519])
    cliche_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fff1f2")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#f43f5e")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(cliche_table)

    story.append(Spacer(1, 4))
    story.append(Paragraph("6. Guía de Longitud de CV: Cuándo usar 1 Página vs. 2 Páginas", h1))
    story.append(Paragraph("<b>No imponer 1 página como dogma ciego.</b> Aplicar el siguiente criterio contextual europeo:", body))
    
    cv_rules = [
        "<b>CV de 1 Página (Ultra-Condensado):</b> Indicado para postulaciones ágiles en startups tecnológicas, consultoras privadas anglosajonas o empresas donde el primer filtro es un screener junior con menos de 30 segundos por perfil. Máximo 4 bloques de experiencia y 2 publicaciones.",
        "<b>CV de 2 Páginas (Estándar Académico y Público DACH / TVöD):</b> Indicado para institutos de investigación (Thünen, Helmholtz, CSIC, Fraunhofer), universidades, ministerios y proyectos de la UE. Permite desglosar proyectos de campo, instrumentación (Eddy Covariance, SEV), publicaciones y conferencias oficiales con el rigor requerido por los comités evaluadores."
    ]
    for r in cv_rules:
        story.append(Paragraph(f"• {r}", body))

    story.append(Spacer(1, 4))
    story.append(Paragraph("7. Árbol de Aptitudes (7 Ramas) & Arquetipos de Posicionamiento", h1))
    
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
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(tree_table)

    story.append(Spacer(1, 4))
    story.append(Paragraph("8. Prompt Maestro de Inicialización Rápida para Gemini Web", h1))
    story.append(Paragraph("Copia y pega este comando en Gemini Web junto con este PDF adjunto:", body))
    
    prompt_box = """Actúa como el Headhunter Táctico y Editor Senior de Daniel Santander Urrutia basándote estrictamente en el 'Operative Core Dossier' adjunto. Cualquier evaluación, CV o Carta de Postulación debe cumplir obligatoriamente la 'Receta Maestra' (Apertura fuerte con gancho y tesis, forward-looking pitch, cero clichés de IA, tono soberano de colega científico y cumplimiento estricto de ToR). Respeta las 7 ramas de su Árbol de Aptitudes y utiliza 2 páginas para puestos académicos/DACH (TVöD) o 1 página para startups. Nunca inventes herramientas ni datos que no figuren en este documento."""
    
    prompt_table = Table([[Paragraph(prompt_box, code_text)]], colWidths=[519])
    prompt_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0284c7")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(prompt_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print("ReportLab PDF successfully compiled to:", filename)

if __name__ == '__main__':
    build_pdf('/Users/danielsantander/Documents/Empleo/Daniel_Santander_Operative_Core_Dossier.pdf')

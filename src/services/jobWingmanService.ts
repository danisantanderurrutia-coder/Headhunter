import type { JobDossier } from '../types/intelligence';
import type { JobOffer } from '../types/offers';

const WINGMAN_STORAGE_KEY = 'empleo_job_wingman_dossiers_v1';

/**
 * DOSSIER CANÓNICO DE ORO: THÜNEN-INSTITUT / TECHWORMS
 * Prof. Dr. Axel Don - Thünen-Institut für Agrarklimaschutz, Braunschweig
 */
export const THUENEN_TECHWORMS_DOSSIER: JobDossier = {
  id: 'dossier-thuenen-techworms-axel-don',
  offerId: 'thuenen-techworms-369',
  targetCompany: 'Thünen-Institut für Agrarklimaschutz (Braunschweig)',
  projectTitle: 'TechWorms: Künstliche Makroporen zur Unterbodenerschließung, Wurzelökologie & C-Sequestrierung',
  createdAt: '2026-10-22T20:00:00.000Z',
  notes: 'Dossier de alta prioridad. Foco en física de medios porosos, cuantificación en RootBox y balance de C con isótopos estables.',
  leadProfile: {
    name: 'Axel Don',
    titleHonorific: 'Prof. Dr.',
    role: 'Stellvertretender Institutsleiter & Leiter der AG Organische Bodensubstanz',
    institution: 'Johann Heinrich von Thünen-Institut für Agrarklimaschutz, Braunschweig',
    email: 'axel.don@thuenen.de',
    researchFocus: [
      'Subsoil Organic Carbon Dynamics (SUBSOM, SOIL3, BZE-LW)',
      'Organo-mineral Carbon Stabilization (MAOM vs. POM)',
      'Root-derived Carbon Sequestration vs. Microbial Priming Effects',
      'Artificial & Biogenic Macropores (Earthworm Burrows / TechWorms)',
      'Drought Resilience through Deep Root Exploration'
    ],
    keyPublications: [
      'Don et al. (2018): Subsoil carbon storage and management in agricultural soils',
      'SUBSOM Project Reports: The forgotten part of carbon cycling in deeper horizons',
      'SOIL3 Synthesis: Deep soil loosening, root access to subsoil water & nutrients',
      'BZE-LW: Carbon stocks and stabilization across German agricultural profiles'
    ],
    styleNotes: 'Rigor científico absoluto, escéptico de promesas simplistas de "carbon farming". Valora perfiles con sólida formación matemática/física, independencia analítica en R y solvencia práctica en terreno.',
    knownProjects: ['TechWorms', 'SOIL3', 'SUBSOM', 'Eternal-C', 'BZE-LW']
  },
  projectPainPoints: [
    'Validación in-situ con RootBox: Procesamiento de imágenes UV/LED en testigos de suelo profundos con problemas de fondo mineral, artefactos de rugosidad y solapamiento radicular.',
    'Régimen hidráulico de doble permeabilidad: Cuantificar la frontera entre bypass flow rápido por macroporos durante tormentas y redistribución matricial hacia el subsuelo profundo.',
    'Trade-off C-Sequestration vs. Priming Effect: La penetración radicular y oxigenación en la pared del macroporo puede mineralizar carbono estabilizado antiguo en lugar de fijar C neto.',
    'Complejidad del balance isotópico (13C / 15N): Separar la firma de exudados y necrosis radicular fresca de la matriz del suelo circundante a escala milimétrica.'
  ],
  technicalHooks: [
    'Física de medios porosos y transporte multifásico: La formación geofísica modela el suelo como un medio continuo anisótropo con ecuaciones de Richards y dispersión advectiva, superando el empirismo agronómico descriptivo.',
    'Procesamiento de señales e imágenes para RootBox: Habilidad nativa en R/Python para filtrado, segmentación morfológica e inversión cuantitativa de densidad radicular (RLD).',
    'Resistencia probada en instrumentación de campo: Experiencia geofísica pesada en campañas con condiciones meteorológicas adversas (turberas, hidrogeofísica, sensores continuos in-situ).',
    'Proximidad y arraigo local: Residencia en Kiel (CAU Kiel), rápida movilidad hacia Braunschweig y familiaridad directa con los protocolos de investigación y normativas en Alemania.'
  ],
  candidateValueThesis: 'La ventaja decisiva de un Geofísico frente a un agrónomo tradicional es que aborda la drilósfera artificial de TechWorms como un sistema físico acoplado (flujo preferencial, gradientes de potencial hídrico y balance de masa) y procesa los datos de RootBox/isótopos con rigor computacional avanzado.',
  coverLetterAngles: [
    'Ángulo 1 (Física de Macroporos): Tratar los canales TechWorm como discontinuidades hidráulicas de alta conductividad que exigen modelado hidrofísico cuantitativo.',
    'Ángulo 2 (Automatización de RootBox): Aplicar algoritmos de visión y scripts en R desarrollados en geofísica para transformar las fotos UV en densidades radiculares milimétricas.',
    'Ángulo 3 (Rigor Isotópico y Balance de C): Encarar el debate del priming effect con honestidad de balance de masa, en perfecta sintonía con las publicaciones de Axel Don.'
  ],
  cvGuidance: [
    'Abrir con una línea de perfil cuantitativo: geofísica + física de medios porosos + R/Python (no "gestión ambiental" genérica).',
    'Priorizar: hidrogeofísica, flujos de GEI en turberas (instrumentación de campo continua), análisis de datos en R, tesis de resistividad/nivel freático (agua en el subsuelo).',
    'Nombrar explícitamente R y Python y cualquier trabajo con imágenes/series de señales; es lo que habilita el análisis de RootBox.',
    'Dejar al fondo o fuera: incidencia política y comunicación pública, salvo una línea (el PI valora rigor de balance de masa, no advocacy).',
    'Declarar solo hechos verificados del portafolio: nada de experiencia en isótopos estables, RootBox o suelos agrícolas si no está documentada.'
  ],
  coldApproachEmail: {
    subjectDe: 'Kurze fachliche Rückfrage zum Projekt TechWorms (Doktorandenstelle Ref. 369)',
    bodyDe: `Sehr geehrter Herr Prof. Dr. Don,

mit großem Interesse verfolge ich Ihre Arbeiten zur Kohlenstoffdynamik in Unterböden (insbesondere die Erkenntnisse aus SUBSOM und den Arbeiten zu Makroporen). Die ausgeschriebene Promotionsstelle im Projekt „TechWorms“ adressiert genau die Schnittstelle, die mich wissenschaftlich antreibt: die mechanische Erschließung des Unterbodens und deren physikalisch-ökologische Rückkopplung.

Vor Einreichung meiner vollständigen Unterlagen über das Thünen-Portal erlaube ich mir eine kurze methodische Frage:
Liegt der Schwerpunkt der experimentellen Auswertung mit der RootBox primär auf der bildanalytischen Wurzelquantifizierung (RLD/Fluoreszenz) und deren Skalierung im R-Umfeld, oder ist im Rahmen der Isotopenanalytik (13C/15N) auch eine gekoppelte hydro-physikalische Modellierung des präferentiellen Flusses in der künstlichen Drilosphäre vorgesehen?

Als Umweltgeophysiker (Universidad de Chile, Abschluss mit Auszeichnung; Doppel-M.Sc. in Umweltmanagement an der CAU Kiel und Umweltschutz an der AMU Poznań) bringe ich einen stark quantitativen Hintergrund in der Physik poröser Medien, R-Programmierung und instrumenteller Feldarbeit mit.

Über einen kurzen fachlichen Impuls würde ich mich sehr freuen; meine formalen Bewerbungsunterlagen bereite ich parallel für das Portal vor.

Mit besten Grüßen aus Kiel,
Daniel Santander Urrutia
Dual M.Sc. | Environmental Geophysicist
danisantander.urrutia@gmail.com | +49 152 23026367`,
    subjectEn: 'Technical inquiry regarding the TechWorms PhD position (Ref. 369)',
    bodyEn: `Dear Prof. Dr. Don,

I have been following your research on subsoil carbon turnover and stabilization with keen interest—particularly the insights emerging from SUBSOM and your work on root-accessible macropores. The doctoral opening within the "TechWorms" project targets the precise scientific interface I specialize in: coupling subsoil physical mechanics with root architecture and carbon dynamics.

Prior to submitting my formal application via the Thünen portal, I would like to ask a brief methodological question:
Is the analytical focus with the RootBox centered strictly on computer vision root quantification (RLD/UV fluorescence) and statistical scaling in R, or is there an intention to couple the 13C/15N isotopic tracing with hydro-physical modeling of preferential flow along the artificial drilosphere?

As an Environmental Geophysicist (Universidad de Chile, with distinction; dual M.Sc. in Environmental Management at CAU Kiel and Environmental Protection at AMU Poznań), I combine training in porous media physics and data processing in R with robust all-weather field experience.

Thank you very much for your time and guidance. I look forward to submitting my formal documents shortly.

Sincerely, from Kiel,
Daniel Santander Urrutia
Dual M.Sc. | Environmental Geophysicist
danisantander.urrutia@gmail.com | +49 152 23026367`
  }
};

/**
 * DOSSIER CANÓNICO: UMWELTBUNDESAMT (UBA) / KI-LAB
 * Kennziffer 8/LB/26 (Interamt ID 1499096)
 * Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner
 */
export const UBA_KILAB_DOSSIER: JobDossier = {
  id: 'dossier-uba-kilab-1499096',
  offerId: 'job-uba-ki-product-owner-1499096',
  targetCompany: 'Umweltbundesamt (UBA) – KI-Lab',
  projectTitle: 'KI-Projektmanagement & KI Product Owner (KI-Lab Leipzig / Berlin / Dessau-Roßlau) – Kennziffer 8/LB/26',
  createdAt: '2026-10-28T08:00:00.000Z',
  notes: 'Dossier prioritario para convocatoria pública del Bund (TVöD E 13). Énfasis en Product Ownership de aplicaciones ambientales, integración de datos satelitales/in-situ y articulación ágil entre ciencia ecológica y desarrollo de software.',
  leadProfile: {
    name: 'Auswahlkommission / Leitung Fachgebiet I 1.4',
    titleHonorific: 'Dr.',
    role: 'Leitung des Anwendungslabors für Künstliche Intelligenz und Big Data (KI-Lab)',
    institution: 'Umweltbundesamt (UBA), Dienstsitz Leipzig',
    email: 'bewerbung@uba.de',
    researchFocus: [
      'Umweltpolitische Digitalagenda des BMUV / UBA',
      'KI-basierte Umweltbeobachtung und Datenföderation',
      'Agile Softwareentwicklung im Verwaltungsvollzug (Scrum, Kanban)',
      'Explainable AI (XAI) & Green AI-Architekturen'
    ],
    keyPublications: [
      'UBA-Positionspapier: Künstliche Intelligenz für Umwelt, Klima und Natur',
      'Digitalagenda für eine ökologische Transformation der Bundesverwaltung',
      'KI-Lab Jahresbericht: Prototyping und MLOps im öffentlichen Sektor'
    ],
    styleNotes: 'Hohe fachliche Stringenz im TVöD-Rahmen. Schätzt nachgewiesene Product-Ownership-Erfahrung an der Schnittstelle zwischen MINT-Forschung und lauffähiger Software. Pragmatisch, lösungsorientiert und strukturiert.',
    knownProjects: ['KI-Lab Umweltbundesamt', 'Umweltpolitische Digitalagenda', 'Smart Environmental Analytics']
  },
  projectPainPoints: [
    'Kommunikationsverlust zwischen Fachwissenschaft und Software-Entwicklung: Umweltforscher*innen formulieren ökologische Herausforderungen oft als offene Forschungsfragen, während Entwicklungsteams präzise User Stories, Akzeptanzkriterien und MLOps-Pipelines benötigen.',
    'Heterogene Sensordaten und föderale Silos: Verknüpfung von In-situ-Messnetzen, Satellitendaten (Copernicus Sentinel) und Modellergebnissen unter Einhaltung offener Datenstandards.',
    'Verwaltungstaugliche Einführung agiler Methoden: Etablierung iterativer Sprintzyklen im strengen formalen Rahmen des Bundesverwaltungsvollzugs (TVöD, BSI-Grundschutz, Haushaltsrecht).',
    'Modelltransparenz & Nachvollziehbarkeit: Black-Box-Modelle sind für behördliche Entscheidungen ungeeignet; KI-Lösungen müssen transparent, validiert und auditierbar sein.'
  ],
  technicalHooks: [
    'Konkrete Product Ownership von drei funktionierenden Umweltanwendungen: Daniel konzipierte und entwickelte eigenständig Wetland Monitor (3D-Webanwendung in React/Three.js/R für Moorwiedervernässung und Eddy-Covariance-Daten), AgriTwin (landwirtschaftlicher digitaler Zwilling mit IoT-Bodenfeuchte und Sentinel-2-Daten) sowie die Rewilding Field Suite (Offline-First PWA mit IndexedDB und GIS-Schichten für Feldprotokolle und Brandrisikominimierung).',
    'Interdisziplinäres MINT-Profil: Als quantitativer Umweltgeophysiker (Universidad de Chile, Auszeichnung) und M.Sc. Umweltmanagement (CAU Kiel) übersetzt er komplexe biogeochemische Prozesse nahtlos in mathematische Anforderungen und User Stories.',
    'Praxiserprobte Feld- und Sensorkompetenz: Erfahrung mit hochfrequenten mikrometeorologischen Systemen (Eddy Covariance) und geophysikalischen Messkampagnen (ERT/SEV) schützt vor unrealistischen Annahmen bei Sensorik und Datenqualität.',
    'Kommunikation in politischen Gremien: Vortragserfahrung vor der chilenischen Abgeordnetenkammer und Verfassung von Fachberichten für internationale Netzwerke belegen Dialogfähigkeit mit Entscheidungsträgern.'
  ],
  candidateValueThesis: 'Daniel bringt die seltene Kombination aus fundiertem MINT-Umweltwissen und konkreter Product-Ownership-Praxis mit: Anstatt agile Methoden nur theoretisch zu kennen, hat er mit Wetland Monitor, AgriTwin und Rewilding Field Suite drei eigenständige Umwelt-Software-Lösungen von der Anforderungserhebung bis zum Produkt realisiert und kann diesen Entwicklungszyklus sofort in das KI-Lab des UBA übertragen.',
  coverLetterAngles: [
    'Ángulo 1 (Product Ownership mit drei Referenzprodukten): Vorstellung von Wetland Monitor, AgriTwin und Rewilding Field Suite als Belege für agiles Product Management von Umwelt-Software.',
    'Ángulo 2 (Brücke zwischen Fachwissenschaft und agiler IT): Übersetzung biogeochemischer Massenbilanzen und Satellitendaten in strukturierte Backlogs und MLOps-Anforderungen.',
    'Ángulo 3 (Verlässlichkeit im öffentlichen Dienst): Formale Passfähigkeit zum TVöD Bund E 13, B1-B2 Deutsch / verhandlungssicheres Englisch, sofortige Verfügbarkeit.'
  ],
  cvGuidance: [
    'An erster Stelle der Berufserfahrung die drei Umwelt-Software-Projekte hervorheben: Wetland Monitor (3D-Moor-Twin), AgriTwin (IoT/Copernicus-Twin) und Rewilding Field Suite (Offline-First PWA).',
    'Die Rolle als Product Owner und technischer Konzeptionist klar deklarieren.',
    'MINT-Grundausbildung in Geophysik (U. de Chile) und M.Sc. an CAU Kiel als wissenschaftliches Fundament unterstreichen.',
    'Führungs- und Koordinationskompetenzen (Apruebo Rural, Kampagnen, Sachverständigenaussagen) als Stakeholder-Management einbetten.'
  ],
  coldApproachEmail: {
    subjectDe: 'Fachliche Bewerbungsfrage: Spezialist*in KI-Projektmanagement & Product Owner (Kennziffer 8/LB/26, Interamt 1499096)',
    bodyDe: `Sehr geehrte Damen und Herren der Auswahlkommission,\n\nmit großem Interesse bereite ich meine Bewerbung für die Position als Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner im KI-Lab des Umweltbundesamtes (Kennziffer 8/LB/26) vor.\n\nAls Umweltgeophysiker (Universidad de Chile, mit Auszeichnung) und Doppel-M.Sc. in Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań) verfolge ich die Umweltpolitische Digitalagenda des UBA mit hoher Aufmerksamkeit. In meiner bisherigen Arbeit habe ich mit dem Wetland Monitor (3D-Moor-Zwilling für Treibhausgasflüsse), AgriTwin (IoT-Bodenfeuchte gekoppelt mit Sentinel-2) und der Rewilding Field Suite (Offline-First PWA für Restaurierungsprotokolle) bereits eigenständig drei funktionierende Softwarelösungen an der Schnittstelle von Umweltdaten und agiler Produktentwicklung konzipiert und umgesetzt.\n\nVor Einreichung meiner vollständigen Unterlagen im Interamt-Portal erlaube ich mir eine kurze methodische Frage: Liegt der primäre Schwerpunkt des KI-Labs in der anstehenden Projektphase auf der Konzeption von Datenföderations- und MLOps-Architekturen für den behördlichen Verwaltungsvollzug oder auf der agilen Nutzerzentrierung (User Research / UX) für behördenübergreifende Analysewerkzeuge?\n\nÜber eine kurze Orientierung würde ich mich freuen; meine formalen Unterlagen übermittle ich fristgerecht über Interamt.\n\nMit freundlichen Grüßen,\nDaniel Santander Urrutia\nDual M.Sc. | Environmental Geophysicist\ndanisantander.urrutia@gmail.com | +49 176 76497440`,
    subjectEn: 'Technical inquiry: AI Project Management & Product Owner (Ref. 8/LB/26, Interamt 1499096)',
    bodyEn: `Dear Selection Committee,\n\nI am currently preparing my application for the AI Project Management and AI Product Owner position within the UBA KI-Lab (Reference 8/LB/26, Interamt ID 1499096).\n\nAs an Environmental Geophysicist (Universidad de Chile, with distinction) and dual M.Sc. in Environmental Management (CAU Kiel) and Environmental Protection (AMU Poznań), I have independently architected and shipped three working environmental software applications: Wetland Monitor (a 3D peatland twin for GHG fluxes and Eddy Covariance data), AgriTwin (IoT soil-moisture telemetry coupled with Sentinel-2 NDVI/NDRE), and the Rewilding Field Suite (an offline-first PWA for field restoration protocols).\n\nPrior to final submission via the Interamt portal, I would like to inquire whether the immediate priority for the KI-Lab portfolio centers on MLOps and federated data pipelines for administrative enforcement, or on user research and agile backlog definition for inter-agency environmental analytics.\n\nThank you for your guidance. I look forward to submitting my formal application.\n\nSincerely,\nDaniel Santander Urrutia\ndanisantander.urrutia@gmail.com | +49 176 76497440`
  }
};

/**
 * DOSSIER CANÓNICO: ENERGY WEATHER & AI LAB (TU DELFT & BFH BIEL)
 * Prof. Dr. Angela Meyer - Geoscience and Remote Sensing / AI
 */
export const ENERGYWEATHER_AI_DOSSIER: JobDossier = {
  id: 'dossier-energyweather-angela-meyer',
  offerId: 'src-energyweather-ai',
  targetCompany: 'Energy Weather & AI Lab (TU Delft & Bern UAS)',
  projectTitle: 'Physics-Informed AI, Atmospheric Dynamics & Renewable Energy Meteorology',
  createdAt: '2026-11-10T08:00:00.000Z',
  notes: 'Dossier de alta prioridad científica. Foco en modelos neuronales informados por física (PINNs), emuladores atmosféricos, teledetección satelital (Copernicus/Meteosat) y predicción espaciotemporal solar/eólica.',
  leadProfile: {
    name: 'Angela Meyer',
    titleHonorific: 'Prof. Dr.',
    role: 'Assistant Professor (TU Delft) & Group Leader / Professor (BFH Biel)',
    institution: 'TU Delft (Dept. of Geoscience & Remote Sensing) & Bern UAS (BFH)',
    email: 'a.meyer@tudelft.nl',
    researchFocus: [
      'Physics-Informed Neural Networks (PINNs) & Climate Emulators',
      'Spatiotemporal Renewable Power Forecasting (Solar PV & Wind)',
      'Satellite Remote Sensing (Earth Observation / Copernicus / Meteosat)',
      'Atmospheric Dynamics, Boundary-Layer Physics & Extreme Weather Impact',
      'Critical Energy Infrastructure Resilience'
    ],
    keyPublications: [
      'Lanzilao & Meyer (2026): Intraday spatiotemporal PV power prediction at national scale using satellite-based solar forecast models (Energy and AI)',
      'Meyer et al.: Probabilistic intraday forecasting of PV power generation for the Swiss Plateau (SNSF / BFH / ETH Zurich)',
      'Meyer (2015): Doctoral Dissertation in Atmospheric Physics, ETH Zurich',
      'Meyer (2009): Master in Mathematics, University of Cambridge'
    ],
    styleNotes: 'Rigor matemático y físico de primer nivel mundial (Cambridge en matemáticas + ETH Zúrich en física atmosférica). Escéptica del machine learning "de juguete" sin anclaje físico. Valora enormemente perfiles con base MINT cuantitativa (geofísica, ecuaciones diferenciales) combinada con experiencia de terreno en sensores reales, calibración de datos y código reproducible en Python/R. Odia que le den cátedra de su propia especialidad.',
    knownProjects: ['Energy Weather & AI Lab', 'SNSF Swiss PV Forecasting', 'TU Delft Geoscience & Remote Sensing Initiatives']
  },
  projectPainPoints: [
    'Disparidad espaciotemporal satélite vs. superficie: Los satélites resuelven la macroescala de nubes y radiación, pero sufren con la heterogeneidad superficial, la capa límite y la turbulencia micrometeorológica.',
    'Ground-truth ruidoso y sensores heterogéneos: Dificultad para calibrar modelos frente a redes de observación de superficie continuas con ruido instrumental e intermitencias.',
    'Violación de balances físicos en modelos caja negra: Modelos de deep learning puros que predicen radiación o viento pero violan balances de masa, momento o conservación de energía en situaciones extremas fuera de distribución.',
    'Consorcio binacional (Delft / Biel): Necesidad de investigadores autónomos con movilidad entre los Países Bajos y Suiza, capaces de coordinar experimentos y datos entre instituciones.'
  ],
  technicalHooks: [
    'Formación rigurosa en Geofísica (U. de Chile, con distinción): Base sólida en mecánica de medios continuos, cálculo tensorial, EDPs y dinámica de fluidos que se comunica de par a par con el perfil matemático del PI.',
    'Operación directa de micrometeorología Eddy Covariance (CAU Kiel): Experiencia real midiendo y procesando flujos turbulentos de calor sensible, calor latente y gases con torres de alta frecuencia en R/Python.',
    'Desarrollo probado de gemelos digitales y teledetección: Creador de Wetland Monitor (visor 3D), AgriTwin (IoT + Sentinel-2 NDVI/NDRE) y Rewilding Field Suite (PWA offline-first en Portugal).',
    'Elegibilidad legal europea y disponibilidad inmediata: Permiso de residencia § 20 AufenthG para investigadores en Alemania, movilidad plena en la UE/Suiza y dedicación completa de 40h/semana.'
  ],
  candidateValueThesis: 'Daniel aporta la combinación ideal para el laboratorio de Angela Meyer: la fundamentación física/matemática de un geofísico para entender las ecuaciones de Navier-Stokes y transporte, unida a la experiencia práctica de terreno operando sensores y torres Eddy Covariance, y la capacidad de construir herramientas de software interactivo basadas en datos satelitales y de superficie.',
  coverLetterAngles: [
    'Ángulo 1 (Alineamiento con Energy and AI 2026): Citar con respeto su reciente trabajo con Luca Lanzilao en predicción espaciotemporal solar y enfocar la postulación en resolver la discrepancia entre satélites y observaciones de superficie.',
    'Ángulo 2 (Geofísica + Eddy Covariance): Posicionar el background en geofísica y medición de flujos turbulentos como la base empírica indispensable para anclar los modelos neuronales informados por la física.',
    'Ángulo 3 (Gemelos Digitales y Software Vivo): Demostrar capacidad constructiva mediante los enlaces a Wetland Monitor, AgriTwin y ReWild.'
  ],
  cvGuidance: [
    'Destacar en primera plana la base cuantitativa en geofísica (U. de Chile) y doble M.Sc. en CAU Kiel y AMU Poznań.',
    'Resaltar Eddy Covariance, procesamiento de flujos micrometeorológicos continuos, R, Python, PyTorch y teledetección Sentinel-2.',
    'Incluir los gemelos digitales como proyectos de software ambiental y reproducibilidad.',
    'Mencionar disponibilidad inmediata y permiso § 20 AufenthG.'
  ],
  coldApproachEmail: {
    subjectDe: 'Fachliche Anfrage zu Forschungs- und Promotionsmöglichkeiten im Energy Weather & AI Lab',
    bodyDe: `Sehr geehrte Frau Prof. Dr. Meyer,\n\nmit großem Interesse verfolge ich die Arbeiten Ihrer Forschungsgruppe an der Schnittstelle von Atmosphärenphysik, Fernerkundung und erneuerbarer Energiemeteorologie – insbesondere Ihre jüngste Publikation mit Luca Lanzilao in Energy and AI zur raumzeitlichen Solarprognose.\n\nAls Umweltgeophysiker (Universidad de Chile, Abschluss mit Auszeichnung) und Doppel-M.Sc. in Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań) verbinde ich kontinuierliche In-situ-Sensormessungen (Eddy Covariance, Oberflächenenergiebilanzen) mit Satellitenzeitreihen (Copernicus Sentinel-2) und physik-informierten Modellen.\n\nIch würde mich sehr über die Gelegenheit freuen, mich darüber auszutauschen, wie meine Vorerfahrung in Kontinuumsmechanik, instrumenteller Feldarbeit und reproduzierbarer wissenschaftlicher Software zu Ihren Projekten an der TU Delft und der BFH beitragen kann.\n\nMit freundlichen Grüßen,\nDaniel Santander Urrutia\ndanisantander.urrutia@gmail.com | +49 176 76497440`,
    subjectEn: 'Scientific inquiry regarding Energy Weather & AI research / PhD opportunities',
    bodyEn: `Dear Prof. Dr. Meyer,\n\nI have been following your group's research at the intersection of atmospheric physics, remote sensing, and renewable energy forecasting with deep interest—particularly your recent paper with Luca Lanzilao in Energy and AI on spatiotemporal solar forecasting.\n\nAs an Environmental Geophysicist (B.Sc. with Distinction, Universidad de Chile) and dual European M.Sc. in Environmental Management (CAU Kiel) and Environmental Protection (AMU Poznań), my work focuses on coupling continuous field sensor observations (Eddy Covariance, surface energy budgets) with satellite time series (Copernicus Sentinel-2) and physics-informed models.\n\nI would be eager to explore how my background in continuum mechanics, field instrumentation, and reproducible scientific software could contribute to your upcoming projects across TU Delft and BFH.\n\nSincerely,\nDaniel Santander Urrutia\ndanisantander.urrutia@gmail.com | +49 176 76497440`
  }
};

/**
 * Recuperar todos los dossiers guardados
 */
export const getStoredDossiers = (): JobDossier[] => {
  try {
    if (typeof localStorage === 'undefined') {
      return [THUENEN_TECHWORMS_DOSSIER, UBA_KILAB_DOSSIER, ENERGYWEATHER_AI_DOSSIER];
    }
    const raw = localStorage.getItem(WINGMAN_STORAGE_KEY);
    if (!raw) {
      return [THUENEN_TECHWORMS_DOSSIER, UBA_KILAB_DOSSIER, ENERGYWEATHER_AI_DOSSIER];
    }
    const parsed = JSON.parse(raw) as JobDossier[];
    // Asegurar que los dossiers canónicos estén presentes
    if (!parsed.some(d => d.id === THUENEN_TECHWORMS_DOSSIER.id)) {
      parsed.unshift(THUENEN_TECHWORMS_DOSSIER);
    }
    if (!parsed.some(d => d.id === UBA_KILAB_DOSSIER.id)) {
      parsed.push(UBA_KILAB_DOSSIER);
    }
    if (!parsed.some(d => d.id === ENERGYWEATHER_AI_DOSSIER.id)) {
      parsed.push(ENERGYWEATHER_AI_DOSSIER);
    }
    return parsed;
  } catch {
    return [THUENEN_TECHWORMS_DOSSIER, UBA_KILAB_DOSSIER, ENERGYWEATHER_AI_DOSSIER];
  }
};

/**
 * Guardar o actualizar un dossier
 */
export const saveDossier = (dossier: JobDossier): void => {
  try {
    if (typeof localStorage === 'undefined') return;
    const dossiers = getStoredDossiers();
    const idx = dossiers.findIndex(d => d.id === dossier.id);
    if (idx >= 0) {
      dossiers[idx] = dossier;
    } else {
      dossiers.unshift(dossier);
    }
    localStorage.setItem(WINGMAN_STORAGE_KEY, JSON.stringify(dossiers));
  } catch (error) {
    console.error('Error saving wingman dossier', error);
  }
};

/**
 * Obtener dossier por ID o por Offer ID
 */
export const getDossierForOffer = (offer: JobOffer): JobDossier => {
  const dossiers = getStoredDossiers();
  
  // 1. Chequeo directo por ID
  const direct = dossiers.find(d => d.offerId === offer.id || (offer.jobDossier && d.id === offer.jobDossier.id));
  if (direct) return direct;

  // 2. Si la oferta menciona UBA, Umweltbundesamt, KI-Lab o ID 1499096
  const text = `${offer.company} ${offer.title} ${offer.rawDescription}`.toLowerCase();
  if (
    text.includes('uba') ||
    text.includes('umweltbundesamt') ||
    text.includes('1499096') ||
    text.includes('8/lb/26') ||
    (text.includes('ki-lab') && text.includes('product owner'))
  ) {
    return UBA_KILAB_DOSSIER;
  }

  // 3. Si la oferta menciona Thünen o Axel Don o TechWorms
  if (text.includes('thünen') || text.includes('thuenen') || text.includes('techworm') || text.includes('axel don')) {
    return THUENEN_TECHWORMS_DOSSIER;
  }

  // 4. Si la oferta menciona Energy Weather, Angela Meyer, TU Delft o BFH
  if (
    text.includes('energy weather') ||
    text.includes('energyweather') ||
    text.includes('angela meyer') ||
    text.includes('meyer') ||
    (text.includes('delft') && (text.includes('weather') || text.includes('wind') || text.includes('solar') || text.includes('atmosphere')))
  ) {
    return ENERGYWEATHER_AI_DOSSIER;
  }

  // 5. Fallback inteligente: construir dossier preliminar
  return createPreliminaryDossier(offer);
};

/**
 * Generador automático de dossier preliminar a partir de una oferta
 */
export const createPreliminaryDossier = (offer: JobOffer): JobDossier => {
  const company = offer.company || 'Organización';
  const title = offer.title || 'Posición Técnica/Científica';

  return {
    id: `dossier-${offer.id || Date.now()}`,
    offerId: offer.id,
    targetCompany: company,
    projectTitle: `${title} @ ${company}`,
    createdAt: new Date().toISOString(),
    leadProfile: {
      name: 'Hiring Lead / PI',
      role: 'Responsable Técnico del Proyecto',
      institution: company,
      researchFocus: offer.requirements.slice(0, 4),
      styleNotes: 'Pragmático, orientado a resultados verificables y rigor metodológico.'
    },
    projectPainPoints: [
      `Integración y procesamiento robusto de datos en el stack requerido para ${title}.`,
      'Validación experimental y operacional en terreno o laboratorio sin fallos de calibración.',
      'Optimización de tiempos de entrega en análisis cuantitativo y automatización de pipelines.'
    ],
    technicalHooks: [
      'Capacidad cuantitativa de análisis y modelado de datos en R/Python.',
      'Experiencia de campo y laboratorio en sistemas ambientales complejos.',
      'Enfoque de resolución de problemas desde primeros principios físicos.'
    ],
    candidateValueThesis: `Aportar solidez analítica y capacidad de ejecución autónoma para que ${company} resuelva los cuellos de botella técnicos de ${title}.`,
    coverLetterAngles: [
      'Demostrar cómo la combinación de rigor cuantitativo y solvencia en campo reduce el riesgo de errores técnicos.',
      'Enfocar la propuesta de valor en resultados medibles y entrega continua de datos limpios.'
    ],
    cvGuidance: [
      'Priorizar los hechos verificados que coinciden con los requisitos de la oferta.',
      'Abrir el resumen con la competencia técnica central que pide el puesto.',
      'No afirmar nada que no esté en el portafolio verificado.'
    ],
    coldApproachEmail: {
      subjectDe: `Kurze fachliche Rückfrage zur Position: ${title}`,
      bodyDe: `Sehr geehrte Damen und Herren,\n\nmit großem Interesse verfolge ich Ihre aktuellen Projekte bei ${company}.\n\nVor Einreichung meiner Bewerbung für die Position als ${title} möchte ich mich kurz erkundigen, welcher methodische Schwerpunkt bei der Umsetzung der anstehenden Aufgaben im Vordergrund steht.\n\nMit freundlichen Grüßen,\nDaniel Santander Urrutia`,
      subjectEn: `Brief technical question regarding ${title}`,
      bodyEn: `Dear Hiring Team,\n\nI have been following your ongoing work at ${company} with great interest.\n\nBefore submitting my application for ${title}, I would like to ask a brief question regarding the primary technical focus of the incoming project cycle.\n\nSincerely,\nDaniel Santander Urrutia`
    }
  };
};

export interface WingmanFormInput {
  leadName: string;
  honorific?: string;
  role?: string;
  institution?: string;
  email?: string;
  researchFocus: string[];
  styleNotes?: string;
  projectTitle?: string;
  painPoints: string[];
  hooks: string[];
  questionDe?: string;
  questionEn?: string;
}

/**
 * Construye y guarda un dossier a partir del formulario manual de Wingman.
 * Parte del dossier actual de la oferta (para conservar guías y ángulos) y sobrescribe lo que el usuario completó.
 */
export const saveDossierFromForm = (offer: JobOffer, form: WingmanFormInput): JobDossier => {
  const base = getDossierForOffer(offer);
  const company = offer.company || base.targetCompany;
  const title = form.projectTitle?.trim() || base.projectTitle;
  const lastName = form.leadName.trim().split(' ').slice(-1)[0];
  const honorific = form.honorific?.trim();
  const qDe = form.questionDe?.trim();
  const qEn = form.questionEn?.trim();
  const sig = 'Daniel Santander Urrutia\nDual M.Sc. | Environmental Geophysicist\ndanisantander.urrutia@gmail.com';

  const email = { ...base.coldApproachEmail };
  if (qDe) {
    email.subjectDe = `Kurze fachliche Rückfrage zur Stelle: ${offer.title}`;
    email.bodyDe = `Sehr geehrter Herr ${honorific ? honorific + ' ' : ''}${lastName},\n\nich beschäftige mich mit Ihren Arbeiten bei ${company} und plane, mich auf die Stelle „${offer.title}“ zu bewerben. Vorab eine kurze fachliche Frage:\n\n${qDe}\n\nMit freundlichen Grüßen,\n${sig}`;
  }
  if (qEn) {
    email.subjectEn = `Brief technical question regarding: ${offer.title}`;
    email.bodyEn = `Dear ${honorific ? honorific + ' ' : ''}${lastName},\n\nI have been following your work at ${company} and plan to apply for the position "${offer.title}". Before doing so, a brief technical question:\n\n${qEn}\n\nSincerely,\n${sig}`;
  }

  const dossier: JobDossier = {
    ...base,
    id: `dossier-${offer.id}`,
    offerId: offer.id,
    targetCompany: company,
    projectTitle: title,
    createdAt: new Date().toISOString(),
    leadProfile: {
      ...base.leadProfile,
      name: form.leadName.trim(),
      titleHonorific: honorific || undefined,
      role: form.role?.trim() || base.leadProfile.role,
      institution: form.institution?.trim() || company,
      email: form.email?.trim() || undefined,
      researchFocus: form.researchFocus,
      styleNotes: form.styleNotes?.trim() || undefined
    },
    projectPainPoints: form.painPoints.length ? form.painPoints : base.projectPainPoints,
    technicalHooks: form.hooks.length ? form.hooks : base.technicalHooks,
    coldApproachEmail: email
  };
  saveDossier(dossier);
  return dossier;
};

import type { JobOffer } from '../types/offers';
import { CANONICAL_CONTACT } from '../data/verifiedCvFacts';

export type CoverLetterLang = 'es' | 'en' | 'de';

export interface CoverLetterConfig {
  lang: CoverLetterLang;
  offer?: Partial<JobOffer> | null;
  recipientName?: string;
  recipientRole?: string;
  recipientOrg?: string;
  recipientAddress?: string;
  date?: string;
  customBodyText?: string;
}

export type ChecklistItemStatus = 'pass' | 'warning' | 'fail';

export interface CoverLetterChecklistItem {
  id: string;
  category: 'anti_ai' | 'style_repetition' | 'golden_thread' | 'metrics_evidence' | 'tor_compliance';
  categoryLabel: string;
  label: string;
  status: ChecklistItemStatus;
  summary: string;
  details?: string[];
  suggestion?: string;
}

export interface WordRepetition {
  word: string;
  count: number;
}

export interface SentenceStarterRepetition {
  starter: string;
  count: number;
  sampleSentences: string[];
}

export interface AntiAiAuditResult {
  passed: boolean;
  clicheCount: number;
  detectedCliches: string[];
  scientificTermsFound: string[];
  hasMethodology: boolean;
  hasMassBalancePerspective: boolean;
  // Auditoría avanzada & checklist
  mechanicalRepetitions: WordRepetition[];
  sentenceStarterRepetitions: SentenceStarterRepetition[];
  bureaucraticFillers: string[];
  hasWeakOpener: boolean;
  hasForwardLookingPitch: boolean;
  hasAvailabilityMention: boolean;
  hasFeeMention: boolean;
  overallScore: number;
  checklist: CoverLetterChecklistItem[];
}

export interface BuiltCoverLetter {
  config: CoverLetterConfig;
  lang: CoverLetterLang;
  sender: {
    name: string;
    headline: string;
    email: string;
    portfolio: string;
    linkedin: string;
    location: string;
  };
  recipient: {
    org: string;
    role?: string;
    address?: string;
  };
  date: string;
  referenceSubject: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  fullMarkdown: string;
  audit: AntiAiAuditResult;
}

export interface SavedCoverLetterVersion {
  id: string;
  name: string;
  createdAt: string;
  lang: CoverLetterLang;
  offerId?: string;
  offerLabel?: string;
  customBodyText: string;
}

// ----------------------------------------------------------------------------
// Listas de clichés prohibidos (Anti-AI Clichés) y términos científicos requeridos
// ----------------------------------------------------------------------------

export const FORBIDDEN_AI_CLICHES = [
  // English
  'thrilled to',
  'excited to apply',
  'delve into',
  'delve',
  'testament to',
  'beacon of',
  'beacon',
  'aligns seamlessly',
  'seamlessly align',
  'seamlessly',
  'in conclusion',
  'passionate about',
  'foster',
  'fostering',
  'deep dive',
  'dynamic environment',
  'pleased to submit',
  'tapestry of',
  'tapestry',
  'furthermore',
  'moreover',
  'pivotal role',
  'vital role',
  'spearhead',
  'spearheaded',
  'spearheading',
  'unwavering',
  'plethora',
  'harnessing',
  'game changer',
  'realm of',
  'ever-evolving',
  'embark on',
  'resonate deeply',
  'holistic approach',
  'rich tapestry',
  // Spanish
  'testimonio de',
  'faro de',
  'se alinea a la perfección',
  'se alinea perfectamente',
  'en conclusión',
  'apasionado por',
  'apasionada por',
  'fomentar',
  'estoy emocionado',
  'estoy entusiasmado',
  'me complace postular',
  'desentrañar',
  'crucial',
  'un antes y un después',
  'sinérgico',
  'sinérgica',
  'en un mundo cada vez más',
  'tapiz de',
  'tapiz',
  'marcar la diferencia',
  'sumergirse en',
  'amplia gama de',
  'jugar un papel fundamental',
  'papel crucial',
  // German
  'ich freue mich sehr',
  'leidenschaftlich',
  'nahtlos',
  'zusammenfassend',
  'zeugnis für',
  'leuchtturm',
  'tief eintauchen',
  'entscheidende rolle',
  'herzblut'
];

export const REQUIRED_SCIENTIFIC_MARKERS = [
  'resistividad',
  'resistivity',
  'resistiv',
  'sev',
  'ves',
  'eddy covariance',
  'flujo',
  'flux',
  'flüsse',
  'geofísica',
  'geophysics',
  'geophysik',
  'balance',
  'bilanz',
  'kiel',
  'wallener au',
  'chile',
  'r',
  'ghg',
  'gei',
  'biomasse',
  'biomass',
  'biomasa'
];

const STOP_WORDS = new Set([
  // EN
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'had', 'has', 'was', 'were', 'are', 'been',
  'will', 'would', 'could', 'should', 'into', 'about', 'also', 'their', 'they', 'them', 'what', 'when',
  'where', 'which', 'who', 'your', 'our', 'its', 'not', 'can', 'than', 'more', 'other', 'some', 'such',
  'only', 'over', 'these', 'those', 'after', 'before', 'between', 'through', 'under', 'while',
  'both', 'each', 'most', 'well', 'much', 'very', 'even', 'first', 'here', 'there',
  // ES
  'que', 'del', 'los', 'las', 'por', 'para', 'con', 'una', 'uno', 'unas', 'unos', 'como', 'este', 'esta',
  'estos', 'estas', 'sobre', 'entre', 'desde', 'hasta', 'pero', 'más', 'son', 'fue', 'era', 'han', 'sido',
  'sus', 'mis', 'nos', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'todo', 'toda', 'todos', 'todas',
  'otro', 'otra', 'otros', 'otras', 'donde', 'cuando', 'quien', 'quienes', 'cual', 'cuales', 'bien',
  'tambien', 'también', 'solo', 'sólo', 'cada', 'mismo', 'misma', 'mismos', 'mismas', 'hace', 'hacia',
  // DE
  'der', 'die', 'das', 'und', 'für', 'mit', 'den', 'dem', 'des', 'auf', 'aus', 'von', 'bei', 'als',
  'nach', 'wie', 'wird', 'werden', 'sind', 'war', 'waren', 'auch', 'eine', 'einer', 'einem', 'einen',
  'eines', 'sich', 'nicht', 'oder', 'aber', 'über', 'unter', 'durch', 'kann', 'können', 'ihre', 'ihren',
  'ihrem', 'ihres', 'diese', 'dieser', 'diesem', 'diesen', 'dieses'
]);

export const detectMechanicalRepetitions = (text: string): WordRepetition[] => {
  const words = text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w));

  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  return Object.entries(freq)
    .filter(([, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));
};

export const detectSentenceStarterRepetitions = (text: string): SentenceStarterRepetition[] => {
  const rawSentences = text
    .split(/(?<=[.?!])\s+/g)
    .map((s) => s.trim().replace(/^[-*•\d.)\s]+/, ''))
    .filter((s) => s.length > 10);

  const groups: Record<string, string[]> = {};

  for (const s of rawSentences) {
    const words = s.split(/\s+/);
    if (words.length === 0) continue;
    const firstWord = words[0].toLowerCase().replace(/[^a-záéíóúüñ]/gi, '');
    const firstTwo = words.slice(0, 2).join(' ').toLowerCase().replace(/[^a-záéíóúüñ ]/gi, '');

    // Agrupar iniciadores típicos monotemáticos
    let key = '';
    if (firstWord === 'i' || firstTwo === 'i am' || firstTwo === 'i have' || firstTwo === 'i was') {
      key = 'I / I have / I am';
    } else if (firstWord === 'yo' || firstWord === 'mi' || firstWord === 'mis') {
      key = 'Yo / Mi / Mis';
    } else if (firstWord === 'en' || firstTwo === 'en este' || firstTwo === 'en mi') {
      key = 'En / En este';
    } else if (firstWord === 'además' || firstWord === 'asimismo') {
      key = 'Además / Asimismo';
    } else if (firstWord === 'ich' || firstWord === 'mein' || firstWord === 'meine') {
      key = 'Ich / Mein';
    }

    if (key) {
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    }
  }

  return Object.entries(groups)
    .filter(([, list]) => list.length >= 3)
    .map(([starter, list]) => ({
      starter,
      count: list.length,
      sampleSentences: list.slice(0, 3)
    }));
};

export const detectBureaucraticFillers = (text: string): string[] => {
  const fillers = [
    // ES
    'cabe destacar que',
    'es menester',
    'vale la pena mencionar',
    'como se mencionó anteriormente',
    'por medio de la presente',
    'a través de la presente',
    'huelga decir',
    // EN
    'it is worth mentioning',
    'it should be noted',
    'as previously mentioned',
    'as stated above',
    'needless to say',
    'due to the fact that',
    'in order to',
    // DE
    'es ist erwähnenswert',
    'wie bereits erwähnt',
    'hiermit bewerbe ich mich'
  ];

  const lower = text.toLowerCase();
  return fillers.filter((f) => lower.includes(f));
};

export const auditTextForAiCliches = (text: string): AntiAiAuditResult => {
  const lower = text.toLowerCase();
  const detectedCliches = FORBIDDEN_AI_CLICHES.filter((c) => lower.includes(c));
  const scientificTermsFound = REQUIRED_SCIENTIFIC_MARKERS.filter((m) => lower.includes(m));

  const hasMethodology = ['sev', 'ves', 'eddy covariance', 'resistiv', 'r', 'cámaras', 'chambers', 'hauben', 'three.js', 'gis', 'fpic', 'clpi', 'qgis', 'python'].some((t) => lower.includes(t));
  const hasMassBalancePerspective = ['balance', 'bilanz', 'flujo', 'flux', 'flüsse', 'subsuperficial', 'subsurface', 'tensión', 'spannung', 'stress', 'carbon', 'kohlenstoff', 'carbono', 'watershed', 'cuenca'].some((t) => lower.includes(t));

  const mechanicalRepetitions = detectMechanicalRepetitions(text);
  const sentenceStarterRepetitions = detectSentenceStarterRepetitions(text);
  const bureaucraticFillers = detectBureaucraticFillers(text);

  // Apertura débil
  const firstSentence = text.trim().split(/(?<=[.?!])\s+/)[0]?.toLowerCase() || '';
  const hasWeakOpener = [
    'i am writing to apply',
    'i would like to apply',
    'por medio de la presente',
    'me dirijo a usted para postular',
    'hiermit bewerbe ich mich auf'
  ].some((o) => firstSentence.includes(o));

  // Forward looking pitch
  const hasForwardLookingPitch = [
    'priority', 'priorities', 'envision', 'first 90 days', 'first months',
    'stepping into', 'immediate focus', 'plan of action', 'prioridad',
    'propuesta', 'primeros meses', 'aportar', 'plan de trabajo', 'visión',
    'schwerpunkt', 'meine ersten'
  ].some((w) => lower.includes(w));

  // ToR Requirements
  const hasAvailabilityMention = [
    'availability', 'available', '40 hours', '40h', 'immediate', 'full-time',
    'disponibilidad', '40 horas', 'inmediata', 'jornada completa', 'dedicación',
    'verfügbarkeit', 'vollzeit'
  ].some((w) => lower.includes(w));

  const hasFeeMention = [
    'fee', 'fees', 'salary', 'remuneration', 'rate', 'honorarios', 'salario',
    'remuneración', 'tarifa', 'gehalt', 'vergütung', 'usd', 'eur', '€', '$'
  ].some((w) => lower.includes(w));

  // Ensamblar Checklist estructurado
  const checklist: CoverLetterChecklistItem[] = [
    {
      id: 'chk-anti-ai',
      category: 'anti_ai',
      categoryLabel: 'Filtro Anti-IA y Clichés',
      label: 'Ausencia de clichés de IA detectables',
      status: detectedCliches.length === 0 ? 'pass' : 'fail',
      summary: detectedCliches.length === 0 ? '0 fórmulas de IA detectadas.' : `${detectedCliches.length} cliché(s) de IA detectado(s).`,
      details: detectedCliches,
      suggestion: detectedCliches.length > 0 ? `Reemplaza clichés como "${detectedCliches.join('", "')}" por afirmaciones empíricas directas.` : undefined
    },
    {
      id: 'chk-fillers',
      category: 'anti_ai',
      categoryLabel: 'Filtro Anti-IA y Clichés',
      label: 'Economía verbal sin rellenos burocráticos',
      status: bureaucraticFillers.length === 0 ? 'pass' : 'warning',
      summary: bureaucraticFillers.length === 0 ? 'Texto libre de muletillas de relleno.' : `${bureaucraticFillers.length} muletilla(s) burocrática(s) detectada(s).`,
      details: bureaucraticFillers,
      suggestion: bureaucraticFillers.length > 0 ? `Elimina frases como "${bureaucraticFillers.join('", "')}" para dar dinamismo a la carta.` : undefined
    },
    {
      id: 'chk-word-rep',
      category: 'style_repetition',
      categoryLabel: 'Reiteraciones Mecánicas',
      label: 'Densidad léxica y alternancia de sinónimos',
      status: mechanicalRepetitions.length === 0 ? 'pass' : mechanicalRepetitions.length <= 2 ? 'warning' : 'fail',
      summary: mechanicalRepetitions.length === 0 ? 'Vocabulario balanceado sin palabras sobreutilizadas.' : `${mechanicalRepetitions.length} palabra(s) repetida(s) 4+ veces.`,
      details: mechanicalRepetitions.map((r) => `"${r.word}" (${r.count}×)`),
      suggestion: mechanicalRepetitions.length > 0 ? 'Introduce sinónimos o reestructura párrafos para aligerar las palabras que más se repiten.' : undefined
    },
    {
      id: 'chk-starters',
      category: 'style_repetition',
      categoryLabel: 'Reiteraciones Mecánicas',
      label: 'Variedad de iniciadores de oración',
      status: sentenceStarterRepetitions.length === 0 ? 'pass' : 'warning',
      summary: sentenceStarterRepetitions.length === 0 ? 'Iniciadores variados y dinámicos.' : `${sentenceStarterRepetitions.length} patrón(es) de iniciador monótono.`,
      details: sentenceStarterRepetitions.map((s) => `${s.starter} (${s.count} oraciones)`),
      suggestion: sentenceStarterRepetitions.length > 0 ? 'Varía el inicio de oraciones usando participios (ej. "Having coordinated..."), contextos ("At the intersection of...") o contrastes ("Rather than...").' : undefined
    },
    {
      id: 'chk-opener',
      category: 'golden_thread',
      categoryLabel: 'Hilo Conductor (Golden Thread)',
      label: 'Gancho inicial con tesis de postulación',
      status: !hasWeakOpener ? 'pass' : 'warning',
      summary: !hasWeakOpener ? 'Apertura con gancho de contenido y visión.' : 'Apertura con fórmula burocrática estándar.',
      suggestion: hasWeakOpener ? 'Evita empezar con "I am writing to apply...". Abre directamente con tu tesis de alineamiento con la misión.' : undefined
    },
    {
      id: 'chk-pitch',
      category: 'golden_thread',
      categoryLabel: 'Hilo Conductor (Golden Thread)',
      label: 'Propuesta hacia adelante (Forward-Looking Pitch)',
      status: hasForwardLookingPitch ? 'pass' : 'warning',
      summary: hasForwardLookingPitch ? 'Incluye visión proactiva para los primeros meses / impacto.' : 'Falta proyectar qué harás en los primeros 90 días o cómo abordarás el rol.',
      suggestion: !hasForwardLookingPitch ? 'Agrega una oración clara indicando tu prioridad inmediata al asumir el cargo (ej. "Stepping into this role, my immediate priority will be...").' : undefined
    },
    {
      id: 'chk-methodology',
      category: 'metrics_evidence',
      categoryLabel: 'Rigor de Evidencia y Métricas',
      label: 'Respaldo metodológico y territorial concreto',
      status: hasMethodology ? 'pass' : 'fail',
      summary: hasMethodology ? 'Cita metodologías, herramientas o marcos reales comprobables.' : 'Faltan referencias a métodos, herramientas o protocolos concretos.',
      suggestion: !hasMethodology ? 'Menciona herramientas específicas (SEV, Eddy Covariance, R, QGIS, protocolos FPIC/CLPI) para dar peso tangible.' : undefined
    },
    {
      id: 'chk-tor-avail',
      category: 'tor_compliance',
      categoryLabel: 'Cumplimiento Mandatorio (ToR)',
      label: 'Declaración explícita de disponibilidad horaria',
      status: hasAvailabilityMention ? 'pass' : 'warning',
      summary: hasAvailabilityMention ? 'Disponibilidad horaria / semanas declarada.' : 'No se detecta mención explícita a disponibilidad horaria (ej. 40h/week).',
      suggestion: !hasAvailabilityMention ? 'El ToR exige indicar disponibilidad expresa (ej. "Immediate availability for full-time consultancy (40 hours/week)").' : undefined
    },
    {
      id: 'chk-tor-fees',
      category: 'tor_compliance',
      categoryLabel: 'Cumplimiento Mandatorio (ToR)',
      label: 'Expectativas de honorarios / tarifa declaradas',
      status: hasFeeMention ? 'pass' : 'warning',
      summary: hasFeeMention ? 'Mención a expectativas de honorarios / salario incluida.' : 'No se detecta indicación de honorarios esperados (fee/salary expectations).',
      suggestion: !hasFeeMention ? 'Recuerda incluir tu rango de tarifa de consultoría mensual/anual en USD o EUR para cumplir con el ToR.' : undefined
    }
  ];

  // Cálculo de score ponderado
  let score = 100;
  score -= detectedCliches.length * 15;
  score -= bureaucraticFillers.length * 6;
  score -= mechanicalRepetitions.length * 5;
  score -= sentenceStarterRepetitions.length * 8;
  if (hasWeakOpener) score -= 8;
  if (!hasForwardLookingPitch) score -= 10;
  if (!hasMethodology) score -= 15;
  if (!hasAvailabilityMention) score -= 8;
  if (!hasFeeMention) score -= 8;
  const overallScore = Math.max(10, Math.min(100, score));

  return {
    passed: detectedCliches.length === 0 && scientificTermsFound.length >= 3 && overallScore >= 70,
    clicheCount: detectedCliches.length,
    detectedCliches,
    scientificTermsFound,
    hasMethodology,
    hasMassBalancePerspective,
    mechanicalRepetitions,
    sentenceStarterRepetitions,
    bureaucraticFillers,
    hasWeakOpener,
    hasForwardLookingPitch,
    hasAvailabilityMention,
    hasFeeMention,
    overallScore,
    checklist
  };
};

// ----------------------------------------------------------------------------
// Redacción de Borrador Base Científico Riguroso (Estrictamente Anti-AI)
// ----------------------------------------------------------------------------

export const buildDefaultScientificDraft = (lang: CoverLetterLang, offer?: CoverLetterConfig['offer']): string[] => {
  const offerTitle = offer?.title || (lang === 'en' ? 'the announced position' : lang === 'de' ? 'die ausgeschriebene Stelle' : 'la posición convocada');
  const company = offer?.company || (lang === 'en' ? 'your organization' : lang === 'de' ? 'Ihre Organisation' : 'su organización');

  const isUba = Boolean(
    offer?.id?.includes('uba') ||
    offer?.company?.toLowerCase().includes('umweltbundesamt') ||
    offer?.company?.toLowerCase().includes('uba') ||
    offer?.title?.toLowerCase().includes('ki-lab') ||
    offer?.title?.toLowerCase().includes('1499096') ||
    offer?.title?.toLowerCase().includes('product owner')
  );

  if (lang === 'de') {
    if (isUba) {
      return [
        `ich bewerbe mich auf die ausgeschriebene Stelle als Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner im Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) des Umweltbundesamtes (Kennziffer 8/LB/26, Interamt-ID 1499096). Als quantitativer Umweltgeophysiker und Doppel-M.Sc. für Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań) verbinde ich ein fundiertes MINT-Fundament mit praxiserprobter Product-Ownership-Erfahrung in der Konzeption und eigenständigen Realisierung dreier ökologischer Softwareanwendungen. Mein methodischer Fokus liegt auf der präzisen Übersetzung komplexer biogeochemischer Fachanforderungen in agile Backlogs (Scrum) und auditsichere Datenpipelines für den Verwaltungsvollzug.`,

        `Mein wissenschaftlicher Ansatz basiert auf messbaren biophysikalischen Bilanzen und methodischer Transparenz: An der Universidad de Chile (Abschluss mit Auszeichnung) untersuchte ich im Maule-Becken mittels geoelektrischer Schlumberger-Tiefensondierungen (VES) die Veränderung der subsuperfiziellen Resistivität und den Grundwasserabfall unter forstlichen Monokulturen. An der CAU Kiel quantifiziere ich auf der wiedervernässten Moorfläche Wallener Au Treibhausgasflüsse (CO₂, CH₄) mittels geschlossener Hauben und hochfrequenter Eddy Covariance sowie die Vorbelastungsspannung des Bodens (σp = 62,4 kPa) mit reproduzierbaren R-Pipelines. Diese Feld- und Sensorerfahrung schützt mich vor praxisfernen Annahmen bei Datenqualität und Sensorrauschen.`,

        `Den Schritt von der reinen Umweltforschung zur agilen Software- und Produktentwicklung habe ich durch die eigenständige Konzeption und Entwicklung dreier Umwelt-Software-Lösungen vollzogen:
1. „Wetland Monitor“: Eine interaktive 3D-Webanwendung (React, Three.js, R) zur räumlich-zeitlichen Modellierung von Moorwiedervernässung und Eddy-Covariance-Flüssen.
2. „AgriTwin“: Ein landwirtschaftlicher digitaler Zwilling, der kontinuierliche IoT-Bodenfeuchte-Sensorik mit Copernicus-Satellitendaten (Sentinel-2 NDVI/NDRE) im Weinbau fusioniert.
3. „Rewilding Field Suite“: Eine modulare, offline-fähige Progressive Web App (PWA mit lokaler IndexedDB-Architektur und GIS-Schichtfusion) für standardisierte Feldprotokolle im ökologischen Gewässerschutz, Biomassemonitoring und Waldbrandrisiko-Management (Aljezur, Portugal).`,

        `In allen drei Vorhaben übernahm ich die Rolle des Product Owners: von der Bedarfsanalyse und Datenmodellierung über das Anforderungsmanagement im Backlog bis hin zur Usability-Validierung im Gelände. Ergänzt wird diese Praxis durch Verhandlungssicherheit im öffentlichen Raum: als geladener Sachverständiger vor der Kommission für Katastrophenschutz der chilenischen Abgeordnetenkammer und als Hauptautor internationaler Fachanalysen zu Kohlenstoff- und Biomasse-Bilanzen (EPN & Global Forest Coalition, 2023).`,

        `Als Absolvent einer deutschen Hochschule stehe ich dem Umweltbundesamt mit voller vertraglicher Verfügbarkeit (§20 AufenthG), verhandlungssicherem Englisch (C2), praxiserprobtem Deutsch (B1–B2) und hoher Einsatzbereitschaft für den Standort Leipzig sowie mobiles Arbeiten zur Verfügung. Für Rückfragen stehe ich Ihnen gerne zur Verfügung.`
      ];
    }

    return [
      `ich bewerbe mich hiermit auf die Position als ${offerTitle} bei ${company}. Als Umweltgeophysiker und Doppel-M.Sc. für Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań) basiert mein methodischer Ansatz auf quantitativen In-situ-Messungen und biophysikalischen Massenbilanzen im Boden- und Moorökosystem. Ich teile das wissenschaftliche Engagement für nachweisbare Kohlenstoffintegrität und die kritische Distanz zu spekulativen Modellierungsansätzen ohne empirische Feldvalidierung.`,

      `Meine wissenschaftliche Grundlage wurde an der Universidad de Chile gelegt (Abschluss mit Auszeichnung). In meiner Abschlussarbeit im Maule-Becken nutzte ich geoelektrische Schlumberger-Tiefensondierungen (VES), um subsurface Widerstandsanomalien und den durch forstliche Monokulturen beschleunigten Grundwasserabsturz unter Dürrebedingungen quantitativ zu erfassen.`,

      `Diese Feldmessungen überführte ich in wissenschaftsbasierte Politikberatung und Öffentlichkeitsarbeit: als Hauptautor des internationalen Berichts zu forstlicher Biomasse und RED-III-Richtlinien (EPN & Global Forest Coalition, 2023), durch ein Gutachten vor der Sonderkommission für Katastrophenschutz der chilenischen Abgeordnetenkammer sowie in evidenzbasierten Fachkampagnen.`,

      `Im Rahmen meiner M.Sc.-Forschung an der CAU Kiel untersuche ich das wiedervernässte Moor Wallener Au (Schleswig-Holstein). Mein Schwerpunkt liegt auf der Quantifizierung von Treibhausgasflüssen (CO₂, CH₄) mittels geschlossener Hauben und Eddy-Covariance-Daten, der Paludikultur und der Bestimmung der Vorbelastung des Bodens (σp = 62,4 kPa), verknüpft mit reproduzierbaren Auswertungen in R (Wetland Monitor).`,

      `Diese Verbindung aus geophysikalischer Feldanalytik, mikrometeorologischer Flussmessung und Datenprogrammierung bringe ich gezielt in die Vorhaben von ${company} ein. Als Absolvent einer deutschen Universität verfüge ich über volle vertragliche Verfügbarkeit nach §20 AufenthG sowie Arbeitsfähigkeit in Deutsch (B1–B2), Englisch (C2) und Spanisch (Muttersprache).`
    ];
  }

  if (lang === 'en') {
    if (isUba) {
      return [
        `I am submitting my application for the position of AI Project Management Specialist and AI Product Owner within the AI Application Laboratory (KI-Lab) at the German Environment Agency (Umweltbundesamt - UBA, Reference 8/LB/26, Interamt ID 1499096). As an Environmental Geophysicist and dual European M.Sc. in Environmental Management (CAU Kiel) and Environmental Protection (AMU Poznań), I combine rigorous quantitative STEM training with hands-on Product Ownership experience across three self-architected environmental software systems. My operational focus is bridging complex biophysical and Earth-observation data with agile sprint backlogs (Scrum) and reproducible MLOps architectures for environmental public administration.`,

        `My methodology is grounded in physical mass balances and verifiable data integrity: At Universidad de Chile (graduated with distinction), I analyzed subsurface electrical resistivity anomalies and groundwater drawdown under forestry monocultures in the Maule Basin via Schlumberger vertical electrical soundings (VES). At CAU Kiel, I quantify greenhouse gas fluxes (CO₂, CH₄) on the rewetted peatland Wallener Au using closed chambers, high-frequency Eddy Covariance towers, and soil precompression stress analysis (σp = 62.4 kPa) processed through reproducible R scripts. This continuous field sensor instrumentation prevents naive assumptions regarding sensor noise, data drift, or calibration limits.`,

        `I have bridged environmental science and agile software delivery through the end-to-end architecture and product management of three dedicated environmental applications:
1. "Wetland Monitor": An interactive 3D web application (React, Three.js, R) for temporal simulation of peatland rewetting, GHG fluxes, and Eddy Covariance data.
2. "AgriTwin": An agricultural digital twin coupling continuous IoT soil-moisture telemetry with Sentinel-2 satellite imagery (NDVI/NDRE) in vineyard catchment systems.
3. "Rewilding Field Suite": A modular, offline-first Progressive Web App (PWA with local IndexedDB persistence and GIS layer fusion) for standardized ecological restoration protocols, biomass monitoring, and wildfire risk mitigation (Aljezur, Portugal).`,

        `Across all three applications, I acted as Product Owner: translating stakeholder needs and ecological metrics into user stories, managing backlog priorities, and conducting usability validation with field teams. This technical execution is complemented by institutional communication acumen: serving as an invited expert witness before Chile's Chamber of Deputies on wildfire risk and authoring international technical reports on carbon accounting frameworks (EPN & Global Forest Coalition, 2023).`,

        `As a graduate of a German university, I offer immediate contractual readiness under Germany's §20 AufenthG framework, operational fluency in English (C2) and German (B1–B2), and full flexibility for on-site collaboration in Leipzig as well as hybrid mobile work. I remain available for any technical or formal inquiries.`
      ];
    }

    return [
      `I am submitting my application for the position of ${offerTitle} at ${company}. My background as an Environmental Geophysicist and dual European M.Sc. is grounded in quantitative empirical measurement and biophysical mass balances, with a clear focus on soil and peatland systems. I share a methodological commitment to scientific integrity in carbon accounting, moving deliberately past speculative offset schemes and high-level claims that lack ground-truth validation.`,

      `My trajectory began with rigorous physical and mathematical training at Universidad de Chile (graduated with distinction). In my thesis on the Maule Basin, I used vertical electrical soundings (Schlumberger VES array) to quantify subsurface electrical resistivity anomalies and groundwater depletion driven by forestry monoculture expansion under severe drought. Rather than treating catchment degradation as an abstract narrative, I framed it as a measurable alteration of subsurface water storage and hydrological conductivity.`,

      `I subsequently translated this empirical field reality into high-stakes science communication and public policy accountability: authoring investigative technical reports for international consortia (Environmental Paper Network & Global Forest Coalition, 2023) on bioenergy subsidy loopholes, delivering an invited expert testimony before the Special Commission on Emergencies and Disasters of Chile's Chamber of Deputies, and directing large-scale data-driven outreach reaching over 700,000 citizens.`,

      `During my dual European Master of Science in Environmental Management (CAU Kiel, Germany) and Environmental Protection (AMU Poznań, Poland), I have conducted direct quantitative field research on the rewetted peatland Wallener Au (Schleswig-Holstein). My work quantifies greenhouse gas fluxes (CO₂, CH₄) using closed chamber measurements and Eddy Covariance data, couples paludiculture implementation with soil mechanics (precompression stress σp = 62.4 kPa), and integrates reproducible spatial processing pipelines in R, including the development of Wetland Monitor.`,

      `This combination of geophysical inversion, micro-meteorological flux analysis, and scientific application development provides direct empirical ground-truth for ${company}. I bring sustained resilience in demanding field environments, bilingual operational fluency (Spanish native, English C2, German B1–B2), and immediate contractual readiness under Germany's §20 AufenthG research and job-seeking framework as a German master's graduate.`
    ];
  }

  // Español (predeterminado)
  if (isUba) {
    return [
      `Presento mi postulación a la posición de Especialista en Gestión de Proyectos de IA y Product Owner de IA en el Laboratorio de Aplicación de Inteligencia Artificial y Big Data (KI-Lab) de la Agencia Federal de Medio Ambiente de Alemania (Umweltbundesamt - UBA, Kennziffer 8/LB/26, Interamt-ID 1499096). Como Geofísico Ambiental y doble Máster en Ciencias europeo en Manejo Ambiental (CAU Kiel) y Protección Ambiental (AMU Poznań), integro una formación cuantitativa rigurosa con experiencia contrastada de Product Ownership en la concepción y desarrollo autónomo de tres aplicaciones de software ambiental. Mi enfoque radica en traducir requerimientos biogeoquímicos complejos en backlogs ágiles (Scrum) y arquitecturas de datos verificables para la administración ambiental pública.`,

      `Mi metodología parte de balances de masa biofísicos y rigor empírico: En la Universidad de Chile (con distinción) analicé, mediante sondeos eléctricos verticales (SEV, Schlumberger), las alteraciones de resistividad eléctrica del subsuelo y la depresión freática bajo monocultivos forestales en el Maule. En la CAU Kiel cuantifico los flujos de gases de efecto invernadero (CO₂, CH₄) en la turbera rehumedecida Wallener Au mediante cámaras cerradas y torres micrometeorológicas de Eddy Covariance, evaluando la tensión de preconsolidación del suelo (σp = 62,4 kPa) con pipelines reproducibles en R. Esta experiencia de instrumentación continua en terreno evita supuestos desconectados de la calidad real de los datos.`,

      `He trasladado la ciencia ambiental al desarrollo ágil de software mediante la arquitectura y entrega de tres productos tecnológicos:
1. «Wetland Monitor»: Aplicación web 3D interactiva (React, Three.js, R) para la modelación espaciotemporal de rehumedecimiento de turberas, flujos de GEI y registros de Eddy Covariance.
2. «AgriTwin»: Gemelo digital agrícola que integra telemetría continua de humedad de suelo IoT con índices satelitales Sentinel-2 (NDVI/NDRE) en cuencas vitivinícolas.
3. «Rewilding Field Suite»: Aplicación web progresiva modular y offline-first (PWA con almacenamiento local IndexedDB y fusión de capas GIS) para protocolos de campo de restauración ecológica, monitoreo de biomasa y prevención de incendios (Aljezur, Portugal).`,

      `En los tres productos ejercí el rol de Product Owner: desde el levantamiento de especificaciones y arquitectura de datos hasta la priorización de historias de usuario y la validación con equipos de terreno. Esta solvencia técnica se complementa con capacidad probada de interlocución pública: perito invitado ante la Cámara de Diputadas y Diputados de Chile para la modelación de riesgo de incendios y autor principal de informes internacionales sobre balances de carbono y biomasa (EPN y Global Forest Coalition, 2023).`,

      `Como graduado de una universidad alemana, dispongo de plena habilitación contractual (§20 AufenthG), inglés profesional (C2), alemán operativo (B1–B2) y total disposición para trabajar en Leipzig y en modalidad híbrida/remota. Quedo a su disposición para cualquier requerimiento técnico o formal.`
    ];
  }

  return [
    `Presento mi postulación a la posición de ${offerTitle} en ${company}. Mi perfil como Geofísico Ambiental y doble Máster en Ciencias europeo se fundamenta en la medición cuantitativa en terreno y en balances de masa biofísicos en sistemas de suelos y turberas. Comparto un compromiso irrestricto con la integridad metodológica en la contabilidad de carbono, rechazando las narrativas especulativas de compensación que carecen de verificación directa en el sustrato.`,

    `Mi trayectoria inició con una sólida formación física y matemática en la Universidad de Chile (con distinción). En mi investigación de título en la Cuenca del Maule cuantifiqué, mediante sondeos eléctricos verticales (SEV, arreglo Schlumberger), las anomalías de resistividad eléctrica del subsuelo y el agotamiento del nivel freático provocados por la expansión de monocultivos forestales bajo megasequía. Traduje la degradación de la cuenca no como una consigna, sino como una alteración mensurable de la capacidad de almacenamiento y conductividad hídrica subsuperficial.`,

    `Posteriormente llevé esta evidencia empírica al debate público y legislativo: autor técnico del informe internacional sobre subsidios a biomasa y contabilidad de carbono RED III (EPN y Global Forest Coalition, 2023), expositor pericial invitado ante la Comisión Especial de Emergencias y Desastres de la Cámara de Diputados de Chile, y director de campañas de divulgación basada en datos con un alcance superior a 700.000 personas.`,

    `En el marco de mi doble maestría en Manejo Ambiental (CAU Kiel, Alemania) y Protección Ambiental (AMU Poznań, Polonia), desarrollo investigación cuantitativa directa en la turbera rehumedecida Wallener Au (Schleswig-Holstein). Cuantifico flujos de gases de efecto invernadero (CO₂, CH₄) mediante cámaras cerradas y registros de Eddy Covariance, evaluando la tensión de preconsolidación del suelo orgánico (σp = 62,4 kPa), la paludicultura y gemelos digitales en R (aplicación Wetland Monitor).`,

    `Esta integración de inversión geofísica, micro-meteorología de flujos y programación científica encaja de forma directa con las demandas analíticas de ${company}. Aporto resiliencia comprobada para campañas prolongadas de terreno, dominio lingüístico (español nativo, inglés C2 técnico-ejecutivo y alemán B1–B2) y disponibilidad contractual inmediata bajo el marco legal de graduado universitario europeo (§20 AufenthG / Ley 14/2013).`
  ];
};

// ----------------------------------------------------------------------------
// Ensamblador de la Carta de Motivación
// ----------------------------------------------------------------------------

export const buildCoverLetter = (config: CoverLetterConfig): BuiltCoverLetter => {
  const { lang, offer, recipientName, recipientRole, recipientOrg, recipientAddress, customBodyText } = config;

  const isUba = Boolean(
    offer?.id?.includes('uba') ||
    offer?.company?.toLowerCase().includes('umweltbundesamt') ||
    offer?.company?.toLowerCase().includes('uba') ||
    offer?.title?.toLowerCase().includes('ki-lab') ||
    offer?.title?.toLowerCase().includes('1499096') ||
    offer?.title?.toLowerCase().includes('product owner')
  );

  const dateStr = config.date?.trim() || new Date().toLocaleDateString(
    lang === 'en' ? 'en-US' : lang === 'de' ? 'de-DE' : 'es-ES',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const org = recipientOrg || (isUba ? 'Umweltbundesamt (UBA) – KI-Lab' : (offer?.company || (lang === 'en' ? 'Selection Committee' : lang === 'de' ? 'Auswahlkommission' : 'Comité de Selección')));

  const resolvedAddress = recipientAddress || (isUba ? 'Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab), Dienstsitz Leipzig / Wörlitzer Platz 1, 06844 Dessau-Roßlau' : undefined);

  let refSubject = lang === 'en'
    ? `Application: ${offer?.title || 'Environmental Scientist / Geophysicist'}${offer?.company ? ` — ${offer.company}` : ''}`
    : lang === 'de'
    ? `Bewerbung als ${offer?.title || 'Umweltwissenschaftler / Geophysiker'}${offer?.company ? ` — ${offer.company}` : ''}`
    : `Candidatura: ${offer?.title || 'Geofísico Ambiental / Investigador'}${offer?.company ? ` — ${offer.company}` : ''}`;

  if (isUba) {
    refSubject = lang === 'de'
      ? 'Bewerbung als Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (KI-Lab) — Kennziffer 8/LB/26 (Interamt ID 1499096)'
      : lang === 'en'
      ? 'Application: AI Project Management Specialist and AI Product Owner (KI-Lab) — Ref. 8/LB/26 (Interamt ID 1499096)'
      : 'Candidatura: Especialista en Gestión de Proyectos de IA y Product Owner de IA (KI-Lab) — Kennziffer 8/LB/26 (Interamt ID 1499096)';
  }

  const salutation = recipientName?.trim()
    ? (lang === 'en' ? `Dear ${recipientName},` : lang === 'de' ? `Sehr geehrte(r) ${recipientName},` : `Estimado/a ${recipientName}:`)
    : (lang === 'en' ? `Dear Hiring Committee at ${org},` : lang === 'de' ? `Sehr geehrte Damen und Herren der ${org},` : `Estimado Comité de Selección de ${org}:`);

  const paragraphs = customBodyText?.trim()
    ? customBodyText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : buildDefaultScientificDraft(lang, offer);

  const closing = lang === 'en' ? 'Sincerely,' : lang === 'de' ? 'Mit freundlichen Grüßen,' : 'Atentamente,';

  const fullText = paragraphs.join('\n\n');
  const audit = auditTextForAiCliches(fullText);

  const fullMarkdown = [
    `**Daniel Santander Urrutia**`,
    `${CANONICAL_CONTACT.defaultLocation} | ${CANONICAL_CONTACT.email} | ${CANONICAL_CONTACT.portfolio}`,
    '',
    `**Destinatario:** ${org}${recipientRole ? ` (${recipientRole})` : ''}`,
    resolvedAddress ? `${resolvedAddress}` : '',
    `**Fecha:** ${dateStr}`,
    '',
    `### ${refSubject}`,
    '',
    salutation,
    '',
    ...paragraphs,
    '',
    closing,
    '',
    `**Daniel Santander Urrutia**`
  ].filter(Boolean).join('\n\n');

  return {
    config,
    lang,
    sender: {
      name: 'Daniel Santander Urrutia',
      headline: lang === 'en' ? 'Environmental Geophysicist • Dual European M.Sc.' : 'Geofísico Ambiental • Doble M.Sc. Europeo',
      email: CANONICAL_CONTACT.email,
      portfolio: CANONICAL_CONTACT.portfolio.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      linkedin: CANONICAL_CONTACT.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
      location: CANONICAL_CONTACT.defaultLocation
    },
    recipient: {
      org,
      role: recipientRole,
      address: resolvedAddress
    },
    date: dateStr,
    referenceSubject: refSubject,
    salutation,
    paragraphs,
    closing,
    signature: 'Daniel Santander Urrutia',
    fullMarkdown,
    audit
  };
};

// ----------------------------------------------------------------------------
// Render HTML (A4 / Formato DIN Académico e Institucional)
// ----------------------------------------------------------------------------

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const COVER_LETTER_CSS = `
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
html, body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #1e293b; background: #fff; font-size: 9.6pt; line-height: 1.5; }
.letter-page { width: 210mm; min-height: 297mm; max-height: 297mm; padding: 18mm 20mm 16mm 20mm; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; background: #fff; }
@media screen { html, body { background: #cbd5e1; } .letter-page { margin: 0 auto 14px auto; box-shadow: 0 4px 16px rgba(15,23,42,.2); } }
.sender-header { border-bottom: 2px solid #0f172a; padding-bottom: 7px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
.sender-name { font-size: 15pt; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: -.3px; line-height: 1; }
.sender-headline { font-size: 8.5pt; font-weight: 600; color: #0284c7; margin-top: 3px; }
.sender-contact { font-size: 7.8pt; color: #475569; text-align: right; line-height: 1.4; }
.meta-block { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; font-size: 8.8pt; }
.recipient-box { color: #1e293b; line-height: 1.35; }
.recipient-org { font-weight: 700; color: #0f172a; font-size: 9.2pt; }
.date-box { font-size: 8.5pt; color: #64748b; font-weight: 600; text-align: right; }
.subject-line { font-size: 10.2pt; font-weight: 800; color: #0f172a; border-left: 3px solid #0284c7; padding-left: 8px; margin-bottom: 14px; }
.salutation { font-weight: 700; margin-bottom: 10px; font-size: 9.4pt; }
.content-body p { margin: 0 0 9px 0; text-align: justify; text-justify: inter-word; font-size: 9.1pt; line-height: 1.48; color: #1e293b; }
.content-body p:last-child { margin-bottom: 0; }
.closing-block { margin-top: 14px; font-size: 9.2pt; }
.signature-name { font-weight: 800; color: #0f172a; margin-top: 14px; font-size: 10pt; text-transform: uppercase; }
.letter-footer { border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 7pt; color: #64748b; display: flex; justify-content: space-between; }
`;

export const renderCoverLetterHtml = (built: BuiltCoverLetter): string => {
  const { lang, sender, recipient, date, referenceSubject, salutation, paragraphs, closing, signature } = built;

  const recipientHtml = `
    <div class="recipient-org">${esc(recipient.org)}</div>
    ${recipient.role ? `<div>${esc(recipient.role)}</div>` : ''}
    ${recipient.address ? `<div>${esc(recipient.address)}</div>` : ''}
  `;

  const paragraphsHtml = paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${esc(referenceSubject)} — Daniel Santander Urrutia</title>
  <style>${COVER_LETTER_CSS}</style>
</head>
<body>
  <div class="letter-page">
    <div>
      <div class="sender-header">
        <div>
          <div class="sender-name">${esc(sender.name)}</div>
          <div class="sender-headline">${esc(sender.headline)}</div>
        </div>
        <div class="sender-contact">
          <div>${esc(sender.location)} • ${esc(sender.email)}</div>
          <div>${esc(sender.portfolio)} • ${esc(sender.linkedin)}</div>
        </div>
      </div>

      <div class="meta-block">
        <div class="recipient-box">${recipientHtml}</div>
        <div class="date-box">${esc(date)}</div>
      </div>

      <div class="subject-line">${esc(referenceSubject)}</div>
      <div class="salutation">${esc(salutation)}</div>

      <div class="content-body">
        ${paragraphsHtml}
      </div>

      <div class="closing-block">
        <div>${esc(closing)}</div>
        <div class="signature-name">${esc(signature)}</div>
      </div>
    </div>

    <div class="letter-footer">
      <div>Carta de postulación académica e institucional • Verificación empírica de antecedentes</div>
      <div><b>${esc(CANONICAL_CONTACT.email)}</b> • ${esc(CANONICAL_CONTACT.defaultLocation)}</div>
    </div>
  </div>
</body>
</html>`;
};

// ----------------------------------------------------------------------------
// Generador del Prompt Editorial Anti-AI & Checklist para LLMs externos (Claude, ChatGPT, Gemini)
// ----------------------------------------------------------------------------

export const generateAntiAiPrompt = (
  offer?: CoverLetterConfig['offer'],
  currentDraft?: string,
  audit?: AntiAiAuditResult,
  targetLang: CoverLetterLang = 'es'
): string => {
  const company = offer?.company || '[ORGANIZACIÓN/INSTITUCIÓN CONVOCANTE]';
  const title = offer?.title || '[PUESTO O ROL OBJETIVO]';
  const desc = offer?.rawDescription || '[PEGA AQUÍ LA DESCRIPCIÓN DE LA VACANTE O TÉRMINOS DE REFERENCIA (ToR)]';
  const draftText = currentDraft || buildDefaultScientificDraft(targetLang, offer).join('\n\n');
  const activeAudit = audit || auditTextForAiCliches(draftText);

  // Formatear diagnósticos de la auditoría en vivo
  const clichesFoundText = activeAudit.detectedCliches.length > 0
    ? `⚠️ Clichés de IA detectados a ELIMINAR:\n${activeAudit.detectedCliches.map((c) => `  - "${c}"`).join('\n')}`
    : '✓ Sin clichés detectados en el borrador base.';

  const repetitionsText = activeAudit.mechanicalRepetitions.length > 0
    ? `⚠️ Palabras con reiteración mecánica (frecuencia >= 4) a DIVERSIFICAR con sinónimos:\n${activeAudit.mechanicalRepetitions.map((r) => `  - "${r.word}": repetida ${r.count} veces`).join('\n')}`
    : '✓ Densidad léxica balanceada sin repeticiones excesivas.';

  const startersText = activeAudit.sentenceStarterRepetitions.length > 0
    ? `⚠️ Iniciadores de oración monótonos a ROMPER:\n${activeAudit.sentenceStarterRepetitions.map((s) => `  - Iniciador "${s.starter}": repetido en ${s.count} oraciones`).join('\n')}`
    : '✓ Iniciadores de oración variados.';

  const checklistReport = activeAudit.checklist
    .map((item) => `[${item.status === 'pass' ? 'PASS' : item.status === 'warning' ? 'WARN' : 'FAIL'}] ${item.categoryLabel} :: ${item.label} -> ${item.summary}${item.suggestion ? ` (Acción sugerida: ${item.suggestion})` : ''}`)
    .join('\n');

  return `Actúa como un editor senior de candidaturas internacionales y asesor de redacción ejecutiva para organizaciones globales, institutos de investigación y movimientos socioambientales.

Tu misión es REVISAR, AUDITAR y PULIR mi Carta de Postulación (Cover Letter) basándote en mi borrador adjunto, asegurando una voz humana, rigurosa, no corporativa y completamente libre de fórmulas mecánicas de IA.

================================================================================
1. CONTEXTO DE LA POSTULACIÓN
================================================================================
- Puesto objetivo: ${title}
- Organización convocante: ${company}
- Contexto de la convocatoria / ToR:
${desc}

================================================================================
2. DIAGNÓSTICO EN VIVO DE MI BORRADOR ACTUAL (SCORE: ${activeAudit.overallScore}/100)
================================================================================
${clichesFoundText}

${repetitionsText}

${startersText}

Checklist de Verificación Actual:
${checklistReport}

================================================================================
3. Reglas críticas de redacción (Anti-AI Clichés) & Rúbrica Editorial
================================================================================
A. ELIMINACIÓN TOTAL DE CLICHÉS DE IA Y FRASES DE RELLENO:
   - PROHIBIDO usar fórmulas genéricas de IA como: "thrilled to", "delve into", "testament to", "beacon of", "foster", "seamlessly align", "tapestry", "furthermore", "spearhead", "unwavering", "passionate about", "in conclusion", "cabe destacar que", "es menester", "jugar un papel crucial".
   - Sustituye cualquier abstracción por balances de masa, evidencia biofísica y metodologías empíricas verificadas (SEV, Eddy Covariance, R, QGIS, protocolos FPIC/CLPI, articulación territorial).

B. RUPTURA DE REITERACIONES MECÁNICAS Y MONOTONÍA SINTÁCTICA:
   - Rompe la sobreutilización de palabras repetidas mediante sinónimos precisos y reestructuración de oraciones.
   - Rompe el patrón repetitivo de oraciones que empiezan con "I", "I am", "I have" o "En este rol".
   - Emplea un catálogo de iniciadores de oración de alto impacto:
     * De alineamiento de fondo: "Having engaged closely with...", "At the intersection of...", "The urgent mandate to... demands..."
     * De metodología y aprendizaje: "Rather than imposing top-down agendas...", "In coordinating editorial cohorts across...", "My experience bridging... demonstrated that..."
     * De propuesta hacia adelante: "Stepping into this role, my immediate priority would be to...", "To bridge regional realities with...", "What I offer [Org] is..."

C. EL HILO CONDUCTOR ("THE GOLDEN THREAD") Y ARQUITECTURA NARRATIVA:
   - Párrafo 1 (Gancho y Tesis): No abras con la típica fórmula burocrática ("I am writing to apply..."). Abre directamente con tu tesis de alineamiento con la misión y desafío de la organización.
   - Párrafos 2 y 3 (Evidencia de Facilitación y Rigor): Articula tu trayectoria en torno a cómo resuelves problemas (gestión de asincronía, consensos multiactor, rigor biofísico, prevención de burnout), no como un currículum andante.
   - Párrafo 4 (Forward-Looking Pitch): Plantea qué harás en los primeros 90 días o cómo abordarás las prioridades operativas de la red.
   - Cierre formal (ToR Compliance): Declara explícitamente disponibilidad horaria (ej. dedicación completa 40h/semana, flexibilidad de husos horarios) y rango de expectativas de honorarios (fees/salary).

D. IDENTIDAD Y TONO:
   - Mantén la primera persona y la autenticidad humana: compromiso con la justicia socioambiental, rigor científico empírico y respeto irrestricto a los saberes comunitarios e indígenas.

================================================================================
4. MI BORRADOR BASE ACTUAL (A REVISAR O PULIR)
================================================================================
${draftText}

================================================================================
5. RESPUESTA ESPERADA
================================================================================
Entrega:
1. Una breve devolución crítica de 3 viñetas destacando qué se mejoró respecto al diagnóstico de partida.
2. La versión final pulida y lista para enviar en ${targetLang === 'de' || draftText.includes('ich bewerbe') ? 'Alemán' : targetLang === 'en' || draftText.includes('I am submitting') || draftText.includes('Having engaged') ? 'Inglés' : 'Español'} (mantener rigurosamente este idioma objetivo), respetando el formato de 4-5 párrafos fluidos y el estándar formal.
`;
};

// ----------------------------------------------------------------------------
// Almacenamiento local de versiones de carta
// ----------------------------------------------------------------------------

const LETTER_VERSIONS_KEY = 'empleo_cover_letter_versions_v1';

export const getSavedLetterVersions = (): SavedCoverLetterVersion[] => {
  try {
    return JSON.parse(localStorage.getItem(LETTER_VERSIONS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveLetterVersions = (versions: SavedCoverLetterVersion[]): void => {
  localStorage.setItem(LETTER_VERSIONS_KEY, JSON.stringify(versions));
};

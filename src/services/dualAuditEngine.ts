import type { JobOffer } from '../types/offers';
import type { JobDossier } from '../types/intelligence';
import type { BuiltCv } from './cvStudio';
import { FORBIDDEN_AI_CLICHES } from './coverLetterStudio';
import { getDossierForOffer } from './jobWingmanService';

// ----------------------------------------------------------------------------
// INTERFACES & TIPOS: DUAL-LENS AUDIT SYSTEM
// ----------------------------------------------------------------------------

export interface ComplianceCheck {
  id: string;
  category: 'degree' | 'work_auth' | 'languages' | 'metrics' | 'format' | 'contact' | 'ats';
  label: string;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
  fixRecommendation?: string;
}

export interface HeadhunterAuditResult {
  score: number; // 0-100
  passed: boolean;
  atsKeywordsFound: string[];
  missingRequiredKeywords: string[];
  complianceChecks: ComplianceCheck[];
  readabilityMetrics: {
    wordCount: number;
    bulletCount: number;
    quantifiedMetricsCount: number;
    readingTimeMinutes: number;
  };
}

export interface PortfolioWeapon {
  id: string;
  name: string;
  category: 'software' | 'soil_physics' | 'geophysics' | 'policy';
  matchedKeywords: string[];
  relevanceTriggers: string[];
  whyInclude: string;
  suggestedInjection: string;
}

export interface WingmanAuditResult {
  score: number; // 0-100
  passed: boolean;
  piPainPointMatch: {
    matchedPoints: string[];
    unaddressedPoints: string[];
    relevanceScore: number; // 0-100
  };
  competitiveAsymmetry: {
    thesis: string;
    detectedEdgeKeywords: string[];
    riskOfGenericAgronomyBio: boolean;
    asymmetryRating: 'dominant' | 'balanced' | 'underrepresented';
    advice: string;
  };
  zeroServilityAudit: {
    clicheCount: number;
    detectedCliches: string[];
    servilityScore: number; // 0-100 (100 = soberano / par científico)
    critique: string;
  };
  portfolioWeaponActivation: {
    activeWeapons: { id: string; name: string; impact: string }[];
    omittedWeapons: { id: string; name: string; reasonToInclude: string; suggestedInjection: string }[];
  };
}

export interface DualLensAuditReport {
  documentType: 'cv' | 'cover_letter';
  overallScore: number; // Promedio ponderado (Headhunter 45% + Wingman 55%)
  headhunter: HeadhunterAuditResult;
  wingman: WingmanAuditResult;
  executiveVerdict: string;
}

export interface DualAuditInput {
  documentType: 'cv' | 'cover_letter';
  text: string;
  offer?: JobOffer | Pick<JobOffer, 'id' | 'title' | 'company' | 'rawDescription' | 'requirements' | 'responsibilities' | 'location'> | null;
  dossier?: JobDossier | null;
  builtCv?: BuiltCv | null;
}

// ----------------------------------------------------------------------------
// PORTAFOLIO DE ARMAS VERIFICADAS (DANIEL SANTANDER)
// ----------------------------------------------------------------------------

export const CANONICAL_PORTFOLIO_WEAPONS: PortfolioWeapon[] = [
  {
    id: 'w-agritwin',
    name: 'AgriTwin (Gemelo Digital IoT & Sentinel-2)',
    category: 'software',
    matchedKeywords: ['agritwin', 'gemelo digital', 'digital twin', 'iot', 'humedad de suelo', 'soil moisture', 'sentinel-2', 'ndvi', 'ndre'],
    relevanceTriggers: ['soil', 'suelo', 'boden', 'moisture', 'feuchte', 'humedad', 'agri', 'rootbox', 'macropor', 'makropor', 'water', 'wasser', 'satellite', 'satellit', 'sensor'],
    whyInclude: 'Demuestra ingeniería aplicada de sensores continuos de humedad de suelo y calibración satelital, superando la teoría pura.',
    suggestedInjection: 'AgriTwin: Digital twin coupling continuous IoT soil-moisture telemetry with Sentinel-2 imagery (NDVI/NDRE).'
  },
  {
    id: 'w-wetland-monitor',
    name: 'Wetland Monitor (App 3D React / Three.js / R)',
    category: 'software',
    matchedKeywords: ['wetland monitor', 'three.js', 'react', 'turbera', 'peatland', 'moor', 'eddy covariance', 'simulación 3d', 'web 3d', 'app 3d'],
    relevanceTriggers: ['r', 'python', 'software', 'app', 'code', 'skalierung', 'visuali', 'eddy covariance', 'ghg', 'gei', 'peatland', 'turbera', 'flux'],
    whyInclude: 'Evidencia capacidad probada de desarrollo de software científico interactivo y visualización espaciotemporal reproducible en R.',
    suggestedInjection: 'Wetland Monitor: Interactive 3D web platform (React, Three.js, R) for peatland rewetting simulation and Eddy Covariance data pipelines.'
  },
  {
    id: 'w-rewilding-suite',
    name: 'Rewilding Field Suite (PWA Offline GIS en Portugal)',
    category: 'software',
    matchedKeywords: ['rewilding field suite', 'rewilding', 'pwa', 'offline', 'indexeddb', 'gis', 'aljezur', 'biomasa', 'biomass'],
    relevanceTriggers: ['gis', 'qgis', 'fieldwork', 'gelände', 'offline', 'app', 'restoration', 'restauración', 'biomass', 'biomasse', 'wildfire'],
    whyInclude: 'Prueba autonomía técnica para diseñar herramientas de campo offline y fusionar capas GIS bajo condiciones remotas exigentes.',
    suggestedInjection: 'Rewilding Field Suite: Offline-first PWA with local IndexedDB and GIS layer fusion for standardized fieldwork protocols (Aljezur, Portugal).'
  },
  {
    id: 'w-wallener-au-stress',
    name: 'Mecánica de Suelos & Preconsolidación (Wallener Au, σp = 62.4 kPa)',
    category: 'soil_physics',
    matchedKeywords: ['62.4', '62,4', 'preconsolidación', 'precompression', 'vorbelastung', 'tensión de preconsolidación', 'mecánica de suelos', 'soil mechanics'],
    relevanceTriggers: ['soil', 'suelo', 'boden', 'mechanics', 'mechanik', 'physics', 'physik', 'subsoil', 'unterboden', 'compaction', 'struktur'],
    whyInclude: 'Es la prueba reina de física de suelos cuantitativa y mecánica continua (σp = 62.4 kPa), alejándote de la agronomía meramente descriptiva.',
    suggestedInjection: 'Quantified soil precompression stress (σp = 62.4 kPa) and coupled geomechanical stability with eddy covariance gas fluxes (Wallener Au).'
  },
  {
    id: 'w-maule-ves',
    name: 'Geofísica de Aguas Subterráneas (Sondeos Schlumberger VES Maule)',
    category: 'geophysics',
    matchedKeywords: ['ves', 'sev', 'schlumberger', 'resistividad', 'resistivity', 'widerstand', 'maule', 'sondeos eléctricos', 'inversión'],
    relevanceTriggers: ['geophysi', 'geofísi', 'groundwater', 'grundwasser', 'subsurface', 'subsuelo', 'unterboden', 'resistiv', 'drought', 'dürre', 'inversion'],
    whyInclude: 'Demuestra tu capacidad de modelar el subsuelo y descensos freáticos con física inversa de resistividad eléctrica.',
    suggestedInjection: 'Graduated with distinction in Geophysics (Univ. de Chile), resolving subsurface electrical resistivity anomalies and groundwater drawdown via Schlumberger VES.'
  },
  {
    id: 'w-congress-testimony',
    name: 'Peritaje en Cámara de Diputados de Chile (Comisión de Emergencias)',
    category: 'policy',
    matchedKeywords: ['cámara de diputados', 'congreso', 'peritaje', 'expert witness', 'comisión de emergencias', 'sachverständiger', 'parlamento'],
    relevanceTriggers: ['policy', 'política', 'governance', 'stakeholder', 'uba', 'thünen', 'thuenen', 'behörde', 'ministerio', 'bmel', 'bmuv', 'public'],
    whyInclude: 'Demuestra solvencia de alto nivel para dialogar con parlamentarios y ministerios sobre riesgo biofísico y modelado territorial.',
    suggestedInjection: 'Invited expert witness before Chile\'s Chamber of Deputies Special Commission on Emergency & Disaster Management.'
  },
  {
    id: 'w-epn-carbon-report',
    name: 'Informe Internacional de Carbono & Biomasa (EPN / Global Forest Coalition)',
    category: 'policy',
    matchedKeywords: ['epn', 'global forest coalition', 'subsidios a biomasa', 'red iii', 'carbon accounting', 'contabilidad de carbono'],
    relevanceTriggers: ['carbon', 'kohlenstoff', 'carbono', 'biomass', 'biomasse', 'accounting', 'bilanzierung', 'policy', 'international', 'emissions'],
    whyInclude: 'Acredita rigor metodológico en balances de carbono y detección de brechas de contabilidad biofísica a escala europea.',
    suggestedInjection: 'Lead author of international investigative reports on biomass subsidies and carbon accounting integrity under EU RED III (EPN & GFC, 2023).'
  }
];

// Diccionario de equivalencias y sinónimos multilingües para reclutamiento científico (DE / EN / ES)
const KEYWORD_SYNONYMS: Record<string, string[]> = {
  fieldwork: ['fieldwork', 'field work', 'feldarbeit', 'feldpraxis', 'terreno', 'gelände', 'in-situ', 'in situ', 'prospección'],
  english: ['english', 'englisch', 'inglés', 'c1', 'c2', 'fluent'],
  german: ['german', 'deutsch', 'alemán', 'b1', 'b2', 'c1'],
  makroporen: ['makropor', 'macropor', 'drilosphäre', 'drilosphere', 'biopores', 'bioporen'],
  rootbox: ['rootbox', 'wurzel', 'rhizotron', 'rld', 'root'],
  doktorand: ['doktorand', 'promotion', 'promotionsstelle', 'phd', 'doctoral', 'doctorado'],
  postdoc: ['postdoc', 'postdoctoral', 'wissenschaftliche'],
  soil: ['soil', 'boden', 'suelo', 'unterboden', 'subsoil'],
  carbon: ['carbon', 'kohlenstoff', 'carbono', 'sequestrierung', 'sequestration', 'c-sequestrierung'],
  geophysics: ['geophysics', 'geofísica', 'geophysik', 'ves', 'sev', 'schlumberger', 'resistivity', 'resistividad'],
  isotopes: ['isotope', 'isotop', 'isótopo', '13c', '15n']
};

export const matchesKeywordOrSynonym = (textLower: string, keyword: string): boolean => {
  const kw = keyword.toLowerCase().trim();
  if (textLower.includes(kw)) return true;

  // Si tiene un sinónimo registrado
  for (const [canonical, synonyms] of Object.entries(KEYWORD_SYNONYMS)) {
    if (kw.includes(canonical) || synonyms.some((s) => kw.includes(s))) {
      if (synonyms.some((s) => textLower.includes(s))) return true;
    }
  }

  // Si es un término compuesto tipo "English C1"
  const tokens = kw.split(/[\s,/-]+/).filter((t) => t.length > 1);
  if (tokens.length > 1) {
    const allTokensPresent = tokens.every((t) => {
      if (textLower.includes(t)) return true;
      for (const synonyms of Object.values(KEYWORD_SYNONYMS)) {
        if (synonyms.some((s) => s.includes(t)) && synonyms.some((s) => textLower.includes(s))) {
          return true;
        }
      }
      return false;
    });
    if (allTokensPresent) return true;
  }

  return false;
};

// Palabras clave de asimetría física/cuantitativa
const PHYSICAL_ASYMMETRY_KEYWORDS = [
  'medios porosos', 'porous media', 'poröse medien',
  'richards',
  'balance de masa', 'mass balance', 'massenbilanz',
  'inversión', 'inversion',
  'resistividad', 'resistivity', 'widerstand',
  'preconsolidación', 'precompression', 'vorbelastung',
  'transporte', 'transport',
  'hidrogeofísica', 'hydrogeophysics',
  'eddy covariance',
  'flujo preferencial', 'preferential flow', 'bypass flow',
  'rauschen', 'signal-to-noise', 'ruido',
  'incertidumbre', 'uncertainty', 'unsicherheit',
  'cuantitativo', 'quantitative', 'quantitativ'
];

// Palabras que delatan enfoque puramente agronómico o biológico genérico
const GENERIC_AGRONOMY_KEYWORDS = [
  'fertilizante', 'fertilizer', 'dünger',
  'rendimiento agrícola', 'crop yield', 'ernteertrag',
  'variedades', 'cultivar',
  'manejo agronómico', 'agronomical management'
];

// ----------------------------------------------------------------------------
// LENTE 1: AUDITORÍA DE HEADHUNTER / ATS & COMPLIANCE
// ----------------------------------------------------------------------------

export const auditHeadhunterLens = (
  text: string,
  offer?: DualAuditInput['offer'],
  documentType: 'cv' | 'cover_letter' = 'cover_letter'
): HeadhunterAuditResult => {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Extracción de keywords requeridas de la oferta
  const requiredKeywords: string[] = [];
  if (offer) {
    if (offer.requirements) {
      for (const req of offer.requirements) {
        const clean = req.trim().toLowerCase();
        if (clean.length > 1 && clean.length < 35) requiredKeywords.push(clean);
      }
    }
    // Añadir palabras claves del título y descripción
    const titleWords = (offer.title || '').toLowerCase().match(/[a-z0-9äöüßñáéíóú]+/g) || [];
    for (const tw of titleWords) {
      if (['r', 'python', 'gis', 'qgis', 'rootbox', 'makroporen', 'isotopen', 'doktorand', 'postdoc', 'phd'].includes(tw)) {
        if (!requiredKeywords.includes(tw)) requiredKeywords.push(tw);
      }
    }
  }

  // Fallback si la oferta no tiene requisitos declarados
  if (requiredKeywords.length === 0) {
    requiredKeywords.push('r', 'python', 'gis', 'geophysics', 'english', 'fieldwork');
  }

  const atsKeywordsFound = requiredKeywords.filter((kw) => matchesKeywordOrSynonym(lower, kw));
  const missingRequiredKeywords = requiredKeywords.filter((kw) => !matchesKeywordOrSynonym(lower, kw));

  // 2. Checklist de Cumplimiento Burocrático y Legal
  const complianceChecks: ComplianceCheck[] = [];

  // A. Titulación Oficial y Mención "Con Distinción"
  const hasUChile = lower.includes('universidad de chile') || lower.includes('u. de chile') || lower.includes('chile');
  const hasGeophysics = lower.includes('geofísic') || lower.includes('geophysic') || lower.includes('geophysik');
  const hasDistinction = lower.includes('con distinción') || lower.includes('with distinction') || lower.includes('mit auszeichnung') || lower.includes('auszeichnung');
  const hasForbiddenMaxima = lower.includes('distinción máxima') || lower.includes('highest distinction') || lower.includes('höchster auszeichnung');

  let degreeStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let degreeDetail = 'Titulación en Geofísica por Universidad de Chile identificada correctamente con distinción.';
  let degreeFix: string | undefined;

  if (hasForbiddenMaxima) {
    degreeStatus = 'fail';
    degreeDetail = 'ALERTA: Se detectó "distinción máxima". Debe corregirse estrictamente a "con distinción" (mit Auszeichnung / with distinction).';
    degreeFix = 'Reemplazar cualquier mención a "máxima distinción" por "con distinción" para evitar discrepancias con el certificado oficial.';
  } else if (!hasUChile || !hasGeophysics) {
    degreeStatus = 'warning';
    degreeDetail = 'No se identifica con total claridad la titulación de Geofísico de la Universidad de Chile.';
    degreeFix = 'Asegúrate de incluir "Geofísico / Universidad de Chile" para cumplir con la equivalencia de posgrado/Master alemán (Anabin H+).';
  } else if (!hasDistinction) {
    degreeStatus = 'warning';
    degreeDetail = 'Se menciona el título pero falta la calificación oficial "con distinción" (mit Auszeichnung).';
    degreeFix = 'Añade "(con distinción / with distinction / mit Auszeichnung)" para destacar el rendimiento de graduación.';
  }

  complianceChecks.push({
    id: 'hh-degree',
    category: 'degree',
    label: 'Titulación Oficial y Equivalencia Académica (Anabin)',
    status: degreeStatus,
    detail: degreeDetail,
    fixRecommendation: degreeFix
  });

  // B. Autorización de Trabajo / Marco Legal (§20 AufenthG / Ley 14/2013)
  const hasVisaMention = 
    lower.includes('§20') || 
    lower.includes('aufenthg') || 
    lower.includes('ley 14/2013') || 
    lower.includes('permiso de trabajo') || 
    lower.includes('work permit') || 
    lower.includes('arbeitserlaubnis') ||
    lower.includes('aufenthaltserlaubnis') ||
    lower.includes('contractual readiness') ||
    lower.includes('vertragsbereitschaft') ||
    lower.includes('disponibilidad contractual');

  complianceChecks.push({
    id: 'hh-work-auth',
    category: 'work_auth',
    label: 'Habilitación Contractual y Visado (§20 AufenthG / UE)',
    status: hasVisaMention ? 'pass' : 'warning',
    detail: hasVisaMention 
      ? 'Habilitación contractual declarada explícitamente (egresado de maestría en Alemania §20 AufenthG / UE).' 
      : 'No se detecta mención a la disponibilidad contractual o visado. Un recruiter alemán puede dudar de tu permiso de trabajo.',
    fixRecommendation: !hasVisaMention 
      ? 'Indica en el cierre: "Habilitación contractual inmediata para investigación bajo el marco legal de graduado universitario alemán (§20 AufenthG)".' 
      : undefined
  });

  // C. Certificación de Idiomas (Inglés C1 / Alemán B1-B2)
  const hasEnglish = lower.includes('c1') || lower.includes('c2') || lower.includes('fluent english') || lower.includes('inglés profesional') || lower.includes('verhandlungssicher') || lower.includes('englisch');
  const hasGerman = lower.includes('b1') || lower.includes('b2') || lower.includes('alemán') || lower.includes('german') || lower.includes('deutsch');

  complianceChecks.push({
    id: 'hh-languages',
    category: 'languages',
    label: 'Acreditación de Idiomas de Trabajo (EN C1 / DE B1-B2)',
    status: hasEnglish && hasGerman ? 'pass' : hasEnglish ? 'warning' : 'fail',
    detail: hasEnglish && hasGerman 
      ? 'Competencias en inglés profesional (C1) y alemán operativo (B1-B2) claramente especificadas.' 
      : hasEnglish 
      ? 'Inglés detectado, pero falta declarar explícitamente el nivel de alemán para puestos en Alemania/DACH.' 
      : 'Falta declarar los niveles estandarizados del marco europeo (CEFR) para inglés y alemán.',
    fixRecommendation: !(hasEnglish && hasGerman) 
      ? 'Especifica: "Inglés C1 (técnico-ejecutivo) | Alemán B1-B2 (operativo en inmersión)".' 
      : undefined
  });

  // D. Métricas Cuantificadas (Impacto con Números)
  const metricMatches = text.match(/(\d+([.,]\d+)?\s*(%|kpa|mpa|bar|mm|cm|m|km|h|ha|usd|eur|€|\$|personas|citizens|semanas|meses|years|años))|([bc][12])|(\b(13c|15n)\b)/gi) || [];
  const quantifiedMetricsCount = metricMatches.length;

  complianceChecks.push({
    id: 'hh-metrics',
    category: 'metrics',
    label: 'Densidad de Métricas Cuantificadas',
    status: quantifiedMetricsCount >= 2 ? 'pass' : quantifiedMetricsCount >= 1 ? 'warning' : 'fail',
    detail: quantifiedMetricsCount >= 2 
      ? `Excelente densidad cuantitativa: ${quantifiedMetricsCount} métricas/escalas encontradas.` 
      : `Baja densidad cuantitativa (${quantifiedMetricsCount} métrica(s)). Los reclutadores buscan datos duros verificables.`,
    fixRecommendation: quantifiedMetricsCount < 2 
      ? 'Incorpora números concretos: tensión de preconsolidación (σp = 62,4 kPa), alcance de divulgación (700.000 ciudadanos), o número de aplicaciones de software entregadas (3 apps).' 
      : undefined
  });

  // E. Extensión y Estructura
  let formatStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let formatDetail = '';
  let formatFix: string | undefined;

  if (documentType === 'cover_letter') {
    if (wordCount >= 230 && wordCount <= 600) {
      formatDetail = `Extensión idónea para 1 página A4 (${wordCount} palabras).`;
    } else if (wordCount < 230) {
      formatStatus = 'warning';
      formatDetail = `Carta algo breve (${wordCount} palabras). Podría carecer de profundidad para convocatorias académicas.`;
      formatFix = 'Expande la carta con balances de masa y descripción del proyecto para alcanzar al menos 300-450 palabras.';
    } else {
      formatStatus = 'warning';
      formatDetail = `Carta extensa (${wordCount} palabras). Riesgo de desbordar la página A4 estándar.`;
      formatFix = 'Condensa párrafos para no superar las 550 palabras y garantizar una sola página.';
    }
  } else {
    // CV
    if (wordCount >= 200) {
      formatDetail = `Estructura de CV con volumen informativo adecuado (${wordCount} palabras).`;
    } else {
      formatStatus = 'warning';
      formatDetail = 'CV con escaso contenido descriptivo en sus secciones.';
      formatFix = 'Añade bullets con detalles metodológicos en la experiencia.';
    }
  }

  complianceChecks.push({
    id: 'hh-format',
    category: 'format',
    label: 'Estructura y Cumplimiento de Extensión A4',
    status: formatStatus,
    detail: formatDetail,
    fixRecommendation: formatFix
  });

  // F. Datos de Contacto Canónicos
  const hasEmail = lower.includes('@');
  const hasPortfolioOrGithub = lower.includes('github') || lower.includes('danielsantander') || lower.includes('portfolio') || lower.includes('.com');

  complianceChecks.push({
    id: 'hh-contact',
    category: 'contact',
    label: 'Canales de Contacto Canónicos',
    status: hasEmail && hasPortfolioOrGithub ? 'pass' : 'warning',
    detail: hasEmail && hasPortfolioOrGithub 
      ? 'Email y enlace web/GitHub verificados correctamente.' 
      : 'Falta enlace directo al portafolio o GitHub en la cabecera.',
    fixRecommendation: !(hasEmail && hasPortfolioOrGithub) 
      ? 'Asegura que tu email institucional y enlace de GitHub figuren en la primera línea.' 
      : undefined
  });

  // 3. Puntuación Ponderada del Headhunter
  let score = 100;
  // Penalizaciones por fallos
  for (const check of complianceChecks) {
    if (check.status === 'fail') score -= 20;
    else if (check.status === 'warning') score -= 8;
  }

  // Penalización por palabras clave de ATS ausentes
  const atsMatchRatio = requiredKeywords.length > 0 ? atsKeywordsFound.length / requiredKeywords.length : 1;
  score -= Math.round((1 - atsMatchRatio) * 25);

  const headhunterScore = Math.max(10, Math.min(100, score));

  return {
    score: headhunterScore,
    passed: headhunterScore >= 75 && complianceChecks.every((c) => c.status !== 'fail'),
    atsKeywordsFound,
    missingRequiredKeywords,
    complianceChecks,
    readabilityMetrics: {
      wordCount,
      bulletCount: (text.match(/^[•\-*]\s+/gm) || []).length,
      quantifiedMetricsCount,
      readingTimeMinutes: Math.round((wordCount / 200) * 10) / 10
    }
  };
};

// ----------------------------------------------------------------------------
// LENTE 2: AUDITORÍA DE WINGMAN / PI & TECHNICAL MATCH
// ----------------------------------------------------------------------------

export const auditWingmanLens = (
  text: string,
  offer?: DualAuditInput['offer'],
  dossier?: DualAuditInput['dossier']
): WingmanAuditResult => {
  const lower = text.toLowerCase();

  // Si no se pasó dossier explícito, resolver por oferta
  const activeDossier = dossier || (offer ? getDossierForOffer(offer as JobOffer) : null);

  // 1. Detección de Clichés de IA y Servilismo
  const detectedCliches = FORBIDDEN_AI_CLICHES.filter((c) => lower.includes(c));
  const subservientPhrases = [
    'me complace postular', 'pleased to apply', 'pleased to submit',
    'humbled', 'honored', 'agradecería la oportunidad',
    'ansioso por aprender', 'eager to learn', 'espero aprender',
    'humildemente', 'apasionado por', 'passionate about'
  ].filter((p) => lower.includes(p));

  const allCliches = Array.from(new Set([...detectedCliches, ...subservientPhrases]));
  const servilityScore = Math.max(0, 100 - allCliches.length * 15);

  let zeroServilityCritique = 'Excelente postura entre pares: lenguaje sobrio, honesto y directo sin servilismo burocrático.';
  if (allCliches.length > 0) {
    zeroServilityCritique = `Se detectaron ${allCliches.length} fórmula(s) cliché o sumisa(s) ("${allCliches.slice(0, 3).join('", "')}"). Reemplázalas por afirmaciones empíricas directas.`;
  }

  // 2. Coincidencia con los Dolores del Proyecto del PI (Pain Points)
  const matchedPoints: string[] = [];
  const unaddressedPoints: string[] = [];

  if (activeDossier && activeDossier.projectPainPoints.length > 0) {
    for (const pp of activeDossier.projectPainPoints) {
      // Extraer palabras clave del dolor
      const ppWords = pp.toLowerCase().match(/[a-z0-9äöüßñáéíóú]+/g) || [];
      const keywords = ppWords.filter((w) => w.length > 3 && !['sobre', 'entre', 'mediante', 'proceso', 'análisis', 'desde', 'hacia', 'este', 'para'].includes(w));
      const hasMatch = keywords.some((kw) => matchesKeywordOrSynonym(lower, kw));

      if (hasMatch) matchedPoints.push(pp);
      else unaddressedPoints.push(pp);
    }
  } else {
    // Dolores técnicos genéricos de investigación cuantitativa
    const genericPainPoints = [
      'Calibración y reducción de ruido en sensores in-situ bajo condiciones de campo',
      'Modelado reproducible y análisis estadístico en R / Python',
      'Balances de masa y transporte físico en medios porosos heterogéneos'
    ];
    for (const gpp of genericPainPoints) {
      if (gpp.toLowerCase().split(' ').some((w) => w.length > 4 && matchesKeywordOrSynonym(lower, w))) {
        matchedPoints.push(gpp);
      } else {
        unaddressedPoints.push(gpp);
      }
    }
  }

  const piRelevanceScore = activeDossier 
    ? Math.round((matchedPoints.length / Math.max(1, activeDossier.projectPainPoints.length)) * 100)
    : Math.round((matchedPoints.length / 3) * 100);

  // 3. Asimetría Competitiva: Geofísico Cuantitativo vs. Agrónomo Tradicional
  const detectedEdgeKeywords = PHYSICAL_ASYMMETRY_KEYWORDS.filter((kw) => lower.includes(kw));
  const detectedGenericKeywords = GENERIC_AGRONOMY_KEYWORDS.filter((kw) => lower.includes(kw));

  const hasPhysicalEdge = detectedEdgeKeywords.length >= 3;
  const riskOfGenericAgronomyBio = detectedGenericKeywords.length > detectedEdgeKeywords.length && detectedEdgeKeywords.length < 2;

  let asymmetryRating: 'dominant' | 'balanced' | 'underrepresented' = 'balanced';
  let advice = '';

  if (hasPhysicalEdge && !riskOfGenericAgronomyBio) {
    asymmetryRating = 'dominant';
    advice = 'Posicionamiento dominante: Tu perfil se distingue claramente de un agrónomo/biólogo estándar al enfatizar la física continua, transporte y análisis de señales.';
  } else if (riskOfGenericAgronomyBio) {
    asymmetryRating = 'underrepresented';
    advice = 'Riesgo de perfil genérico: Estás usando terminología descriptiva/agronómica sin destacar tu ventaja en física de medios porosos y balances numéricos en R.';
  } else {
    asymmetryRating = 'balanced';
    advice = 'Equilibrio adecuado, pero se beneficiaría de mayor énfasis en formulaciones físicas (ej. ecuaciones de Richards o precompresión mecánica).';
  }

  // 4. Activación de Armas del Portafolio (Active vs. Omitted Weapons)
  const activeWeapons: { id: string; name: string; impact: string }[] = [];
  const omittedWeapons: { id: string; name: string; reasonToInclude: string; suggestedInjection: string }[] = [];

  const offerText = offer 
    ? `${offer.title} ${offer.company} ${offer.rawDescription || ''} ${(offer.requirements || []).join(' ')}`.toLowerCase()
    : '';

  for (const weapon of CANONICAL_PORTFOLIO_WEAPONS) {
    const isCitedInDoc = weapon.matchedKeywords.some((kw) => lower.includes(kw));
    const isRelevantToTarget = weapon.relevanceTriggers.some((tr) => offerText.includes(tr)) || offerText.length === 0;

    if (isCitedInDoc) {
      activeWeapons.push({
        id: weapon.id,
        name: weapon.name,
        impact: `Activo citado. Refuerza tu idoneidad en ${weapon.category}.`
      });
    } else if (isRelevantToTarget) {
      omittedWeapons.push({
        id: weapon.id,
        name: weapon.name,
        reasonToInclude: weapon.whyInclude,
        suggestedInjection: weapon.suggestedInjection
      });
    }
  }

  // 5. Cálculo de Score Ponderado del Wingman
  let wingmanScore = 0;
  // Pain point alignment: 30%
  wingmanScore += (piRelevanceScore / 100) * 30;
  // Zero-servility: 25%
  wingmanScore += (servilityScore / 100) * 25;
  // Competitive asymmetry: 25% (dominant=25, balanced=18, underrepresented=8)
  wingmanScore += asymmetryRating === 'dominant' ? 25 : asymmetryRating === 'balanced' ? 18 : 8;
  // Weapon activation: 20%
  const totalRelevantWeapons = activeWeapons.length + omittedWeapons.length;
  const weaponRatio = totalRelevantWeapons > 0 ? activeWeapons.length / totalRelevantWeapons : 0.8;
  wingmanScore += weaponRatio * 20;

  const finalWingmanScore = Math.max(15, Math.min(100, Math.round(wingmanScore)));

  return {
    score: finalWingmanScore,
    passed: finalWingmanScore >= 75 && allCliches.length === 0,
    piPainPointMatch: {
      matchedPoints,
      unaddressedPoints,
      relevanceScore: piRelevanceScore
    },
    competitiveAsymmetry: {
      thesis: activeDossier?.candidateValueThesis || 'Aportar una ventaja cuantitativa de modelado físico frente a enfoques puramente descriptivos.',
      detectedEdgeKeywords,
      riskOfGenericAgronomyBio,
      asymmetryRating,
      advice
    },
    zeroServilityAudit: {
      clicheCount: allCliches.length,
      detectedCliches: allCliches,
      servilityScore,
      critique: zeroServilityCritique
    },
    portfolioWeaponActivation: {
      activeWeapons,
      omittedWeapons
    }
  };
};

// ----------------------------------------------------------------------------
// FUNCIÓN PRINCIPAL: DUAL-LENS AUDITOR
// ----------------------------------------------------------------------------

export const auditDocumentDualLens = (input: DualAuditInput): DualLensAuditReport => {
  const { documentType, text, offer, dossier } = input;

  const headhunter = auditHeadhunterLens(text, offer, documentType);
  const wingman = auditWingmanLens(text, offer, dossier);

  // Promedio ponderado: 45% Headhunter (Compliance/ATS) + 55% Wingman (Técnica & PI Match)
  const overallScore = Math.round(headhunter.score * 0.45 + wingman.score * 0.55);

  let executiveVerdict = '';
  if (overallScore >= 85 && headhunter.passed && wingman.passed) {
    executiveVerdict = 'SOBERANO & COMPETITIVO: Tu expediente supera con holgura el filtro ATS/RRHH y se posiciona como par científico indispensable ante el líder técnico.';
  } else if (overallScore >= 70) {
    executiveVerdict = 'COMPETITIVO CON AJUSTES: Supera los mínimos de evaluación, pero activar las armas omitidas elevará significativamente la tasa de conversión a entrevista.';
  } else {
    executiveVerdict = 'RIESGO DE DESCARTE: Corrige los incumplimientos burocráticos y elimina clichés para asegurar el pase de primera ronda.';
  }

  return {
    documentType,
    overallScore,
    headhunter,
    wingman,
    executiveVerdict
  };
};

import type { JobOffer } from '../types/offers';
import { getStoredSettings } from './db';

export type ApplicationArchetype =
  | 'DACH_RESEARCH'
  | 'CLIMATE_TECH_STARTUP'
  | 'MULTILATERAL_GOVERNANCE'
  | 'INDUSTRY_CONSULTING';

export interface ArchetypeProfile {
  id: ApplicationArchetype;
  label: string;
  shortLabel: string;
  icon: string;
  badgeClass: string;
  targetReader: {
    roleTitle: string;
    psychology: string;
    redFlags: string[];
  };
  wingmanGuidance: {
    formatStyle: string;
    targetWordCount: { min: number; ideal: number; max: number };
    preferredTone: 'formal_academic' | 'agile_impact' | 'diplomatic_governance' | 'applied_engineering';
    vocabularyFocus: string[];
    openingStrategy: string;
    closingStrategy: string;
  };
  headhunterGuidance: {
    outlierLever: string;
    priorityWeapons: string[];
    keyComplianceChecks: string[];
  };
}

export const ARCHETYPE_PROFILES: Record<ApplicationArchetype, ArchetypeProfile> = {
  DACH_RESEARCH: {
    id: 'DACH_RESEARCH',
    label: 'Academia & Centros de Investigación DACH',
    shortLabel: 'Academia DACH',
    icon: '🏛️',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    targetReader: {
      roleTitle: 'Principal Investigator (PI) / Abteilungsleiter',
      psychology:
        'Científico senior o catedrático que valora el método exacto, la reproductibilidad y la precisión conceptual. Desconfía de adjetivos rimbombantes y busca un colaborador que domine la instrumentación y la física subyacente.',
      redFlags: [
        'Adulación servil ("sería el mayor honor")',
        'Vaguedad metodológica (no mencionar instrumentos o ecuaciones)',
        'Formato informal o estilo marketing anglosajón',
        'Omitir la clasificación salarial TVöD o estatus de residencia'
      ]
    },
    wingmanGuidance: {
      formatStyle: 'DIN 5008 / Anschreiben Académico formal (4-5 párrafos rigurosos, longitud controlada)',
      targetWordCount: { min: 380, ideal: 460, max: 560 },
      preferredTone: 'formal_academic',
      vocabularyFocus: [
        'Bodenphysik',
        'Vorauflast',
        'Eddy Covariance',
        'Matrixfluss',
        'Makroporen',
        'Isotopenbilanzen',
        'Richards-Gleichung',
        'In-situ Messungen'
      ],
      openingStrategy:
        'Conexión inmediata con el proyecto de investigación específico del PI y la hipótesis científica que el grupo aborda.',
      closingStrategy:
        'Disponibilidad contractual bajo § 20 AufenthG e invitación sobria a una discusión técnica sobre el diseño experimental.'
    },
    headhunterGuidance: {
      outlierLever:
        'Asimetría cuantitativa insuperable: Geofísico de la Universidad de Chile con Doble M.Sc. en CAU Kiel y AMU Poznań, abordando el suelo como medio poroso físico-matemático en un mar de graduados en agronomía descriptiva.',
      priorityWeapons: ['wp-003-soil-mechanics', 'wp-001-agritwin', 'wp-004-maule-ves'],
      keyComplianceChecks: ['§ 20 AufenthG', 'con distinción', 'Acreditación Anabin H+', 'Alemán B1-B2']
    }
  },

  CLIMATE_TECH_STARTUP: {
    id: 'CLIMATE_TECH_STARTUP',
    label: 'Climate-Tech, CDR & Startups MRV',
    shortLabel: 'Climate-Tech Startup',
    icon: '🚀',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    targetReader: {
      roleTitle: 'Head of Climate Science / VP of Product / Co-Founder',
      psychology:
        'Operador o fundador de alto ritmo que necesita rigor científico traducido a métricas comerciales y de producto. Valora la autonomía, la velocidad de prototipado, el código limpio y la eliminación de riesgos de greenwashing.',
      redFlags: [
        'Cartas largas y burocráticas tipo funcionario',
        'Enfoque teórico desconectado del mercado o del cliente',
        'Falta de familiaridad con estándares corporativos (SBTi, Oxford Offsetting, permanencia duradera)',
        'Lenguaje lento o pasivo'
      ]
    },
    wingmanGuidance: {
      formatStyle: 'Executive Impact Pitch / Memo Técnico Ágil (3-4 párrafos densos, viñetas de impacto directo)',
      targetWordCount: { min: 260, ideal: 330, max: 420 },
      preferredTone: 'agile_impact',
      vocabularyFocus: [
        'Durable CDR',
        'MRV Integrity',
        'Permanence',
        'Biochar',
        'Carbon Accounting',
        'SBTi Net Zero',
        'R/Python Pipelines',
        'Scalability'
      ],
      openingStrategy:
        'Declaración directa de propuesta de valor: cómo la ciencia de suelos y el modelado cuantitativo aceleran la confianza en sus créditos o cartera.',
      closingStrategy:
        'Llamado a conversación de 15 minutos sobre pipelines de datos o auditoría de proyectos sin rodeos protocolares.'
    },
    headhunterGuidance: {
      outlierLever:
        'Científico de datos y procesos biofísicos con código en producción: no solo entiende la permanencia del carbono en el suelo, sino que escribe pipelines reproducibles en R/Python y ha auditado biomasa a escala internacional.',
      priorityWeapons: ['wp-006-epn-carbon', 'wp-002-wetland-sentinel', 'wp-001-agritwin'],
      keyComplianceChecks: ['Inglés C2 / C1 profesional', 'Habilitación contractual inmediata', 'Portafolio GitHub / Código']
    }
  },

  MULTILATERAL_GOVERNANCE: {
    id: 'MULTILATERAL_GOVERNANCE',
    label: 'Gobernanza Climática & Organismos Multilaterales',
    shortLabel: 'Gobernanza Multilateral',
    icon: '🌐',
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    targetReader: {
      roleTitle: 'Senior Programme Officer / Panel de Selección de RRHH y Convocatoria',
      psychology:
        'Oficial de programa o panel evaluador que coteja estrictamente los Términos de Referencia (ToR). Busca solvencia diplomática, rigor frente a delegaciones estatales y capacidad demostrada de interlocución institucional.',
      redFlags: [
        'No estructurar las respuestas en base a los criterios exactos del ToR',
        'Tono informal o personalista',
        'Falta de evidencia en entornos multinacionales o regulatorios',
        'Omisión de idiomas de trabajo oficiales (Inglés / Español / Francés)'
      ]
    },
    wingmanGuidance: {
      formatStyle: 'Competency-Based Cover Letter / Declaración de Motivación Institucional (Estructura STAR/CAR)',
      targetWordCount: { min: 420, ideal: 500, max: 620 },
      preferredTone: 'diplomatic_governance',
      vocabularyFocus: [
        'MARS Framework',
        'Satellite Observatories',
        'Multi-stakeholder Governance',
        'Climate Diplomacy',
        'NDCs / IPCC Guidelines',
        'Environmental Compliance',
        'Institutional Testimony'
      ],
      openingStrategy:
        'Alineación formal con el mandato de la misión (ej. reducción acelerada de metano / conservación de cuencas) y las competencias clave del aviso.',
      closingStrategy:
        'Reiteración de compromiso con el mandato multilateral y disponibilidad geográfica y contractual inmediata.'
    },
    headhunterGuidance: {
      outlierLever:
        'Legitimidad técnica demostrada al más alto nivel del Estado: testimonio pericial ante el Congreso Nacional de Chile sobre riesgo hídrico y forestal, combinado con trabajo directo en redes globales de carbono (EPN / Global Forest Coalition).',
      priorityWeapons: ['wp-005-congreso-chile', 'wp-006-epn-carbon', 'wp-002-wetland-sentinel'],
      keyComplianceChecks: ['Bilingüismo demostrable', 'Títulos convalidados internacionalmente', 'Disponibilidad de movilidad']
    }
  },

  INDUSTRY_CONSULTING: {
    id: 'INDUSTRY_CONSULTING',
    label: 'Ingeniería, Consultoría & Transición Ecológica',
    shortLabel: 'Consultoría & Industria',
    icon: '⚙️',
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    targetReader: {
      roleTitle: 'Director Técnico / Responsable de Unidad de Aguas y Medio Ambiente',
      psychology:
        'Ingeniero de proyectos o socio consultor con presión de licitaciones, plazos de entrega y clientes industriales exigentes. Necesita certidumbre operativa, solvencia en trabajo de campo y aplicabilidad directa a normativas locales.',
      redFlags: [
        'Enfoque excesivamente académico desconectado de la ejecución de obra o proyecto',
        'Desconocimiento de normativas de evaluación ambiental',
        'Falta de disponibilidad para campañas de terreno',
        'No demostrar cercanía o arraigo operativo en la región'
      ]
    },
    wingmanGuidance: {
      formatStyle: 'Propuesta Técnico-Operativa de Soluciones (enfoque en proyectos reales, terreno y entregables)',
      targetWordCount: { min: 320, ideal: 400, max: 480 },
      preferredTone: 'applied_engineering',
      vocabularyFocus: [
        'Geofísica Aplicada',
        'Sondajes Eléctricos VES',
        'Acuíferos y Cuencas',
        'Hidráulica de Suelos',
        'Informes Periciales',
        'QGIS / SIG',
        'Trabajo de Campo',
        'Transición Hídrica'
      ],
      openingStrategy:
        'Mención directa a los proyectos clave de la consultora (hidrogeología, infraestructura verde, caracterización de suelos) y la capacidad de incorporarse sin curva de aprendizaje.',
      closingStrategy:
        'Disponibilidad inmediata para campañas in-situ y reuniones técnicas de coordinación.'
    },
    headhunterGuidance: {
      outlierLever:
        'Geofísico de terreno con experiencia de campo real (campañas Schlumberger en cuenca del Maule, mecánica de suelos en laboratorio y modelado SIG) listo para operar en licitaciones exigentes sin tiempo muerto.',
      priorityWeapons: ['wp-004-maule-ves', 'wp-003-soil-mechanics', 'wp-005-congreso-chile'],
      keyComplianceChecks: ['Arraigo o disponibilidad geográfica (Bilbao/Euskadi/España)', 'Licencia de conducir / Terreno', 'Régimen Ley 14/2013']
    }
  }
};

/**
 * Clasificador determinista y ultrarrápido (0 ms) basado en señales léxicas de la oferta.
 */
export function classifyOfferArchetype(offer?: JobOffer | null): ArchetypeProfile {
  if (!offer) {
    return ARCHETYPE_PROFILES.DACH_RESEARCH;
  }

  const textToScan = [
    offer.title || '',
    offer.company || '',
    offer.location || '',
    offer.rawDescription || '',
    (offer.requirements || []).join(' ')
  ].join(' ').toLowerCase();

  let dachScore = 0;
  let startupScore = 0;
  let multilateralScore = 0;
  let consultingScore = 0;

  // 1. Señales Academia DACH
  const dachSignals = [
    'thünen', 'fraunhofer', 'helmholtz', 'universität', 'university of', 'cau kiel',
    'tu delft', 'bern uas', 'leibniz', 'max planck', 'promotionsstelle', 'phd candidate',
    'postdoc', 'wissenschaftliche', 'wissenschaftlicher mitarbeiter', 'tvöd', 'drilosphäre',
    'lehrstuhl', 'forschungsprojekt', 'dfg', 'doktorand'
  ];
  dachSignals.forEach((sig) => {
    if (textToScan.includes(sig)) dachScore += sig.length > 7 ? 3 : 2;
  });

  // 2. Señales Startup & Climate-Tech
  const startupSignals = [
    'supercritical', 'agreena', 'carbon removal', 'cdr', 'biochar', 'enhanced weathering',
    'startup', 'marketplace', 'seed', 'series a', 'series b', 'equity', 'mrv', 'venture',
    'fast-paced', '14,000x', 'remote-first', 'unlimited vacation', 'product manager',
    'head of climate science'
  ];
  startupSignals.forEach((sig) => {
    if (textToScan.includes(sig)) startupScore += sig.length > 7 ? 3 : 2;
  });

  // 3. Señales Multilateral & Gobernanza
  const multilateralSignals = [
    'unep', 'united nations', 'naciones unidas', 'imeo', 'mars', 'fao', 'undp',
    'world bank', 'intergovernmental', 'multilateral', 'terms of reference', 'tor',
    'programme officer', 'consultancy agreement', 'international organisation', 'cop28',
    'ipcc', 'policy advisor', 'gobierno', 'ministerio'
  ];
  multilateralSignals.forEach((sig) => {
    if (textToScan.includes(sig)) multilateralScore += sig.length > 6 ? 3 : 2;
  });

  // 4. Señales Consultoría & Industria
  const consultingSignals = [
    'tecnalia', 'idom', 'ayesa', 'consultora', 'consulting', 'ingeniería', 'licitación',
    'obra civil', 'estudio de impacto', 'hidrogeología aplicada', 'geotecnia',
    'bilbao', 'bizkaia', 'euskadi', 'españa', 'peritaje', 'cliente industrial'
  ];
  consultingSignals.forEach((sig) => {
    if (textToScan.includes(sig)) consultingScore += sig.length > 6 ? 3 : 2;
  });

  // Si la ubicación es Bilbao/Bizkaia o España y no es puramente académica, bono consultoría
  if (offer.isBilbaoLocation || (offer.location && offer.location.toLowerCase().includes('bilbao'))) {
    consultingScore += 4;
  }

  // Si la ubicación es Alemania/Suiza/Austria y menciona investigación, bono DACH
  if (
    offer.location &&
    (offer.location.toLowerCase().includes('alemania') ||
      offer.location.toLowerCase().includes('germany') ||
      offer.location.toLowerCase().includes('deutschland') ||
      offer.location.toLowerCase().includes('kiel') ||
      offer.location.toLowerCase().includes('braunschweig'))
  ) {
    dachScore += 3;
  }

  const scores = [
    { archetype: 'DACH_RESEARCH' as ApplicationArchetype, score: dachScore },
    { archetype: 'CLIMATE_TECH_STARTUP' as ApplicationArchetype, score: startupScore },
    { archetype: 'MULTILATERAL_GOVERNANCE' as ApplicationArchetype, score: multilateralScore },
    { archetype: 'INDUSTRY_CONSULTING' as ApplicationArchetype, score: consultingScore }
  ];

  scores.sort((a, b) => b.score - a.score);

  const bestMatch = scores[0];
  if (bestMatch.score > 0) {
    return ARCHETYPE_PROFILES[bestMatch.archetype];
  }

  return ARCHETYPE_PROFILES.DACH_RESEARCH;
}

/**
 * Consulta profunda a Gemini para clasificar semánticamente el arquetipo y extraer
 * matices del lector objetivo, su psicología y las palancas de asimetría.
 */
export async function classifyOfferArchetypeWithGemini(
  offer: JobOffer
): Promise<{
  profile: ArchetypeProfile;
  customReaderAnalysis: string;
  recommendedAngle: string;
}> {
  const fallback = classifyOfferArchetype(offer);
  const settings = getStoredSettings();
  const apiKey = (settings.apiKey || '').trim();

  if (!apiKey) {
    return {
      profile: fallback,
      customReaderAnalysis: fallback.targetReader.psychology,
      recommendedAngle: fallback.headhunterGuidance.outlierLever
    };
  }

  const systemInstruction = `
Eres el Analista Estratégico de Postulaciones de Daniel Santander Urrutia (Geofísico U. de Chile con distinción y Doble M.Sc. en CAU Kiel y AMU Poznań).
Tu misión es determinar a cuál de estos 4 arquetipos de contratación pertenece esta oferta:
1. DACH_RESEARCH (Institutos alemanes como Thünen, Fraunhofer, Helmholtz, Universidades)
2. CLIMATE_TECH_STARTUP (Startups CDR, MRV, mercados de carbono corporativo)
3. MULTILATERAL_GOVERNANCE (ONU, UNEP, UE, agencias internacionales, gobernanza)
4. INDUSTRY_CONSULTING (Consultoría ambiental, ingeniería geotécnica/hidrológica, España/Euskadi)

Responde en formato JSON válido:
{
  "archetype": "DACH_RESEARCH" | "CLIMATE_TECH_STARTUP" | "MULTILATERAL_GOVERNANCE" | "INDUSTRY_CONSULTING",
  "customReaderAnalysis": "1-2 oraciones describiendo la mentalidad y expectativas de quien leerá la postulación",
  "recommendedAngle": "1-2 oraciones explicando cómo Daniel debe posicionarse para destacar sobre el 95% de postulantes comunes"
}
`.trim();

  const userPrompt = `
OFERTA A CLASIFICAR:
- Título: ${offer.title}
- Empresa/Entidad: ${offer.company}
- Ubicación: ${offer.location}
- Descripción:
${(offer.rawDescription || '').slice(0, 1500)}
`.trim();

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1000 }
      })
    });

    if (!response.ok) {
      return {
        profile: fallback,
        customReaderAnalysis: fallback.targetReader.psychology,
        recommendedAngle: fallback.headhunterGuidance.outlierLever
      };
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/^```json/im, '').replace(/^```/im, '').replace(/```$/im, '').trim();
    const parsed = JSON.parse(cleanJson);

    const validArchetype = ARCHETYPE_PROFILES[parsed.archetype as ApplicationArchetype] ? (parsed.archetype as ApplicationArchetype) : fallback.id;

    return {
      profile: ARCHETYPE_PROFILES[validArchetype],
      customReaderAnalysis: parsed.customReaderAnalysis || ARCHETYPE_PROFILES[validArchetype].targetReader.psychology,
      recommendedAngle: parsed.recommendedAngle || ARCHETYPE_PROFILES[validArchetype].headhunterGuidance.outlierLever
    };
  } catch {
    return {
      profile: fallback,
      customReaderAnalysis: fallback.targetReader.psychology,
      recommendedAngle: fallback.headhunterGuidance.outlierLever
    };
  }
}

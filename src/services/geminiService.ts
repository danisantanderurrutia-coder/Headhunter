import { getStoredSettings, getStoredProfile } from './db';
import { VERIFIED_FACTS, CANONICAL_CONTACT } from '../data/verifiedCvFacts';
import { CANONICAL_PORTFOLIO_WEAPONS } from './dualAuditEngine';
import { classifyOfferArchetype, type ApplicationArchetype } from './archetypeClassifier';
import type { JobOffer } from '../types/offers';

export interface GeminiEvaluationResult {
  matchScore: number; // 0 a 100
  verdict: 'EXCELENTE_ENCAJE' | 'BUEN_ENCAJE' | 'ENCAJE_MODERADO' | 'NO_RECOMENDADO';
  pros: string[];
  gaps: string[];
  strategicAngle: string;
  recommendedEvidences: string[];
  interviewPrep: { question: string; suggestedAnswer: string }[];
}

export interface GeminiLetterResult {
  fullMarkdown: string;
  language: 'es' | 'en' | 'de';
  strategicNotes: string;
  archetypeId: ApplicationArchetype;
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Realiza una llamada pura a la API de Google Gemini (v1beta REST)
 */
async function callGeminiRest(
  systemInstruction: string,
  userPrompt: string,
  modelNameOverride?: string
): Promise<string> {
  const settings = getStoredSettings();
  const apiKey = (settings.apiKey || '').trim();

  if (!apiKey) {
    throw new Error(
      'No se ha configurado ninguna clave API de Gemini. Ve a Configuración > LLM y pega tu Gemini API Key.'
    );
  }

  // Model normalisation: Gemini 3.8 Flash y 3.5 Flash Lite son los modelos nativos activos
  let model = modelNameOverride || settings.modelName || 'gemini-3.8-flash';
  if (model.includes('3.8') || model.includes('flash')) {
    model = 'gemini-3.8-flash';
  } else if (model.includes('lite')) {
    model = 'gemini-3.5-flash-lite';
  } else if (model.includes('pro')) {
    model = 'gemini-3.1-pro-preview';
  } else {
    model = 'gemini-3.8-flash';
  }

  const endpoint = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 3000
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let message = `Error de API Gemini (${response.status}): ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error?.message) {
        message = `Error de Gemini: ${parsed.error.message}`;
      }
    } catch {
      // Ignorar parse error
    }
    throw new Error(message);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('La API de Gemini devolvió una respuesta vacía o fue bloqueada por filtros de seguridad.');
  }

  return text;
}

/**
 * Evalúa semánticamente una oferta de trabajo contrastada con el perfil y portafolio de Daniel
 */
export async function evaluateOfferWithGemini(offer: JobOffer): Promise<GeminiEvaluationResult> {
  const systemInstruction = `
Eres el Headhunter Táctico y Asesor de Carrera de Daniel Sebastián Santander Urrutia:
- Geofísico (Universidad de Chile, con distinción).
- Doble M.Sc. en Manejo Ambiental (CAU Kiel, Facultad de Agronomía) y Protección Ambiental (AMU Poznań).
- Experto en: Física de suelos, curvas de retención hídrica, flujos de GEI (CO2, CH4, Eddy Covariance), balances hidrológicos, R, Python, QGIS, GEE.
- Testimonio técnico formal ante el Congreso Nacional de Chile sobre riesgo forestal e hídrico.
- Estatus legal: Residencia en Alemania bajo § 20 AufenthG (Investigador calificado) y régimen español Ley 14/2013.

Tu rol: Evaluar con extremo rigor científico y honestidad cómo encaja esta oferta con el perfil.
Responde ÚNICAMENTE en formato JSON válido con la siguiente estructura:
{
  "matchScore": number,
  "verdict": "EXCELENTE_ENCAJE" | "BUEN_ENCAJE" | "ENCAJE_MODERADO" | "NO_RECOMENDADO",
  "pros": string[],
  "gaps": string[],
  "strategicAngle": string,
  "recommendedEvidences": string[],
  "interviewPrep": [
    { "question": string, "suggestedAnswer": string }
  ]
}
`.trim();

  const salaryStr = offer.salaryMin ? `${offer.salaryMin} - ${offer.salaryMax || ''} ${offer.salaryCurrency || 'EUR'}` : 'No especificado';

  const userPrompt = `
EVALÚA ESTA OFERTA DE EMPLEO:
- Título: ${offer.title}
- Entidad/Empresa: ${offer.company}
- Ubicación: ${offer.location}
- Rango salarial / Régimen: ${salaryStr}
- Requisitos: ${(offer.requirements || []).join(' | ')}
- Descripción de la vacante:
${offer.rawDescription}

DATOS DEL CANDIDATO (HECHOS VERIFICADOS DEL PORTAFOLIO):
- Titulaciones: Doble M.Sc. CAU Kiel & AMU Poznań, Geofísico U. de Chile (con distinción)
- Hechos Verificados:
${VERIFIED_FACTS.map((f) => `* [${f.id}] ${f.es.title} (${f.es.org || ''}): ${f.es.short || ''}`).join('\n')}
`.trim();

  const rawJsonText = await callGeminiRest(systemInstruction, userPrompt);
  
  const cleanJson = rawJsonText
    .replace(/^```json/im, '')
    .replace(/^```/im, '')
    .replace(/```$/im, '')
    .trim();

  try {
    return JSON.parse(cleanJson) as GeminiEvaluationResult;
  } catch {
    throw new Error(`Gemini respondió pero el JSON no fue válido. Respuesta recibida:\n${rawJsonText}`);
  }
}

/**
 * Redacta una carta de presentación táctica (Anschreiben / Cover Letter) calibrada según el Arquetipo de la Convocatoria
 */
export async function generateCoverLetterWithGemini(
  offer: JobOffer,
  language: 'es' | 'en' | 'de' = 'de',
  archetypeOverride?: ApplicationArchetype
): Promise<GeminiLetterResult> {
  const profile = getStoredProfile();
  const archetype = archetypeOverride ? (await import('./archetypeClassifier')).ARCHETYPE_PROFILES[archetypeOverride] : classifyOfferArchetype(offer);

  const langInstructions = {
    de: 'en ALEMÁN formal (Anschreiben DIN 5008 con vocabulario técnico preciso para el ecosistema DACH)',
    en: 'en INGLÉS formal y directo (High-impact executive / academic cover letter)',
    es: 'en ESPAÑOL formal (riguroso, claro y con autoridad técnica)'
  }[language];

  const systemInstruction = `
Eres el Redactor Táctico Senior para las cartas de postulación de Daniel Sebastián Santander Urrutia.
Tu misión es redactar una carta de presentación calibrada para el ARQUETIPO: "${archetype.label}" (${langInstructions}).

PERFIL DEL INTERLOCUTOR A CONVENCER (WINGMAN LENS):
- Rol del lector: ${archetype.targetReader.roleTitle}
- Psicología y expectativas: ${archetype.targetReader.psychology}
- Líneas rojas / Red flags que debes evitar a toda costa: ${archetype.targetReader.redFlags.join(' | ')}
- Formato esperado: ${archetype.wingmanGuidance.formatStyle}
- Longitud objetivo: Entre ${archetype.wingmanGuidance.targetWordCount.min} y ${archetype.wingmanGuidance.targetWordCount.max} palabras (ideal: ~${archetype.wingmanGuidance.targetWordCount.ideal} palabras).
- Apertura: ${archetype.wingmanGuidance.openingStrategy}
- Cierre: ${archetype.wingmanGuidance.closingStrategy}

PALANCAS PARA DESTACAR SOBRE LA MEDIA (HEADHUNTER LENS):
- Asimetría competitiva principal: ${archetype.headhunterGuidance.outlierLever}
- Armas prioritarias a activar si guardan relación: ${archetype.headhunterGuidance.priorityWeapons.join(', ')}
- Cumplimiento clave a declarar: ${archetype.headhunterGuidance.keyComplianceChecks.join(' | ')}

DIRECTIVAS INQUEBRANTABLES:
1. NUNCA inventes funciones, herramientas ni logros. Básate estrictamente en sus hechos verificados:
   - Titulación: Geofísico de la Universidad de Chile (con distinción) + Doble M.Sc. en CAU Kiel y AMU Poznań.
   - CAU Kiel: Física de suelos, curvas de retención hídrica, Eddy Covariance, flujos de CO2 y CH4, R.
   - U. de Chile: Geofísica de campo, sondajes eléctricos verticales (VES Maule), física matemática y modelado continuo.
   - EPN / Global Forest Coalition: Biomasa, auditoría de contabilidad de carbono.
   - Congreso Nacional: Testimonio técnico pericial formal ante la Comisión de Medio Ambiente.
   - Estatus legal: Residencia en Alemania bajo § 20 AufenthG (habilitación inmediata para contratación en investigación) y régimen español Ley 14/2013.
2. Tono "Zero-Servility": Trato horizontal de colega científico o par técnico de alto nivel. Cero sumisión ni adulación vacía.
3. Devuelve únicamente el texto markdown listo para imprimir o enviar, sin preámbulos ni comentarios meta.
`.trim();

  const userPrompt = `
VACANTE OBJETIVO:
- Puesto: ${offer.title}
- Institución: ${offer.company}
- Ubicación: ${offer.location}
- Arquetipo Detectado: ${archetype.label} (${archetype.targetReader.roleTitle})
- Descripción de la vacante:
${offer.rawDescription}

DATOS DEL CANDIDATO:
- Nombre: ${profile.fullName || 'Daniel Sebastián Santander Urrutia'}
- Contacto: ${profile.email || CANONICAL_CONTACT.email} | ${profile.phone || '+49...'} | Kiel, Alemania
- Portafolio: ${CANONICAL_CONTACT.portfolio}
- Armas de Evidencia disponibles:
${CANONICAL_PORTFOLIO_WEAPONS.map((w) => `* [${w.id}] ${w.name}: ${w.whyInclude}`).join('\n')}

Genera la carta en ${language.toUpperCase()} adaptada al formato de ${archetype.shortLabel}.
`.trim();

  const fullMarkdown = await callGeminiRest(systemInstruction, userPrompt);

  return {
    fullMarkdown,
    language,
    strategicNotes: `Generada con Gemini calibrada para el arquetipo "${archetype.label}" (${archetype.wingmanGuidance.formatStyle})`,
    archetypeId: archetype.id
  };
}

/**
 * Consulta interactiva con el Asesor Estratégico de Gemini
 */
export async function askStrategyAdvisorGemini(
  conversationHistory: { role: 'user' | 'assistant'; text: string }[],
  userQuestion: string,
  currentOfferContext?: JobOffer | null
): Promise<string> {
  const systemInstruction = `
Eres el Asesor Estratégico y Wingman de Postulaciones de Daniel Santander Urrutia (Geofísico y Doble M.Sc. en CAU Kiel y AMU Poznań).
Tu objetivo es orientar a Daniel en tácticas de carrera, preparación de entrevistas técnicas, abordaje a decisores (PIs), negociación TVöD / convenios colectivos y posicionamiento competitivo.
Sé directo, táctico, conciso y riguroso.
`.trim();

  let context = '';
  if (currentOfferContext) {
    context = `
CONTEXTO DE LA OFERTA ACTUAL:
Puesto: ${currentOfferContext.title} en ${currentOfferContext.company} (${currentOfferContext.location})
Descripción: ${currentOfferContext.rawDescription.slice(0, 1000)}...
    `.trim();
  }

  const prompt = `
${context}

HISTORIAL DE CONSULTA:
${conversationHistory.map((m) => `${m.role === 'user' ? 'Daniel' : 'Asesor'}: ${m.text}`).join('\n')}

PREGUNTA DE DANIEL:
${userQuestion}
`.trim();

  return callGeminiRest(systemInstruction, prompt);
}

export interface ParsedJobOfferResult {
  title: string;
  company: string;
  location: string;
  country?: string;
  isRemote: boolean;
  salaryText?: string;
  requirements: string[];
  cleanDescription: string;
  recipientName?: string;
  recipientRole?: string;
  recipientAddress?: string;
  archetypeId?: ApplicationArchetype;
  strategicAngleSuggestion?: string;
}

/**
 * Analiza un volcado de texto o enlace de vacante con Gemini y extrae todos los datos estructurados
 */
export async function parseRawJobWithGemini(rawTextOrUrl: string): Promise<ParsedJobOfferResult> {
  const isUrl = /^https?:\/\//i.test(rawTextOrUrl.trim());

  const systemInstruction = `
Eres un Analista Senior de Ofertas de Empleo y Headhunter Técnico de Alta Precisión.
Tu tarea es analizar el texto o la información de la convocatoria proporcionada y estructurar los datos de la vacante para el expediente del candidato Daniel Santander (Geofísico y Doble M.Sc. en CAU Kiel y AMU Poznań).

Debes responder ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "title": string,
  "company": string,
  "location": string,
  "country": string,
  "isRemote": boolean,
  "salaryText": string,
  "requirements": string[],
  "cleanDescription": string,
  "recipientName": string,
  "recipientRole": string,
  "recipientAddress": string,
  "archetypeId": "academia" | "think_tank" | "climate_tech" | "cat_risk" | "multilateral" | "agency",
  "strategicAngleSuggestion": string
}
`.trim();

  const userPrompt = isUrl
    ? `ANALIZA LA CONVOCATORIA EN ESTE ENLACE O DESCRIPCIÓN:
${rawTextOrUrl.trim()}

Extrae los datos estructurados del puesto con máxima precisión. Infiere país e institución si el enlace o contexto lo especifica.`
    : `EXTRAE Y ESTRUCTURA ESTE VOLCADO DE TEXTO DE OFERTA DE EMPLEO:
${rawTextOrUrl.trim()}`;

  const rawJsonText = await callGeminiRest(systemInstruction, userPrompt);

  const cleanJson = rawJsonText
    .replace(/^```json/im, '')
    .replace(/^```/im, '')
    .replace(/```$/im, '')
    .trim();

  try {
    return JSON.parse(cleanJson) as ParsedJobOfferResult;
  } catch {
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleanJson.substring(firstBrace, lastBrace + 1);
      return JSON.parse(extracted) as ParsedJobOfferResult;
    }
    throw new Error(`Gemini respondió pero el JSON no fue válido: ${rawJsonText.slice(0, 180)}...`);
  }
}

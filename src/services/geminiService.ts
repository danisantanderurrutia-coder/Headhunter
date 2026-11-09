import { getStoredSettings, getStoredProfile } from './db';
import { VERIFIED_FACTS, CANONICAL_CONTACT } from '../data/verifiedCvFacts';
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

  // Model fallback / normalización
  let model = modelNameOverride || settings.modelName || 'gemini-1.5-flash';
  if (model.includes('gemini-1.5-pro') || model.toLowerCase().includes('pro')) {
    model = 'gemini-1.5-pro';
  } else if (model.includes('2.0')) {
    model = 'gemini-2.0-flash';
  } else {
    model = 'gemini-1.5-flash';
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
- Experto en: Física de suelos, tensión de preconsolidación (σp = 62.4 kPa), flujos de GEI (CO2, CH4, Eddy Covariance), balances hidrológicos, R, Python, QGIS, GEE.
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
  } catch (err) {
    throw new Error(`Gemini respondió pero el JSON no fue válido. Respuesta recibida:\n${rawJsonText}`);
  }
}

/**
 * Redacta una carta de presentación táctica (Anschreiben / Cover Letter) lista para enviar
 */
export async function generateCoverLetterWithGemini(
  offer: JobOffer,
  language: 'es' | 'en' | 'de' = 'de'
): Promise<GeminiLetterResult> {
  const profile = getStoredProfile();

  const langInstructions = {
    de: 'en ALEMÁN formal (Anschreiben DIN 5008, tono académico riguroso para institutos alemanes como Thünen, Fraunhofer, Helmholtz o universidades)',
    en: 'en INGLÉS formal (Academic/Industry Cover Letter, conciso y de alto impacto)',
    es: 'en ESPAÑOL formal (con tono profesional, técnico y seguro)'
  }[language];

  const systemInstruction = `
Eres el Redactor Táctico Senior para las cartas de postulación de Daniel Sebastián Santander Urrutia.
Tu misión es redactar una carta de presentación de 4-5 párrafos ${langInstructions}.

DIRECTIVAS INQUEBRANTABLES:
1. NUNCA inventes funciones, herramientas ni logros. Básate estrictamente en sus hechos verificados:
   - CAU Kiel: Suelos, tensión de preconsolidación (62.4 kPa), Eddy Covariance, flujos de CO2 y CH4, R.
   - U. de Chile: Geofísica, resistividad de suelos, física matemática.
   - EPN / Global Forest Coalition: Biomasa, contabilidad de carbono.
   - Congreso Nacional: Testimonio técnico pericial sobre hidrología y desastres.
   - Residencia Alemania: § 20 AufenthG (permiso de trabajo como investigador calificado inmediato).
2. Tono "Zero-Servility": De colega científico a colega científico. Sin adulación vacía ni clichés genéricos.
3. Conexión explícita con los retos del proyecto de la oferta.
4. Devuelve el texto listo para imprimir o enviar.
`.trim();

  const userPrompt = `
VACANTE OBJETIVO:
- Puesto: ${offer.title}
- Institución: ${offer.company}
- Ubicación: ${offer.location}
- Descripción:
${offer.rawDescription}

DATOS DEL CANDIDATO:
- Nombre: ${profile.fullName || 'Daniel Sebastián Santander Urrutia'}
- Contacto: ${profile.email || CANONICAL_CONTACT.email} | ${profile.phone || '+49...'} | Kiel, Alemania
- Portafolio: ${CANONICAL_CONTACT.portfolio}

Genera la carta en ${language.toUpperCase()}.
`.trim();

  const fullMarkdown = await callGeminiRest(systemInstruction, userPrompt);

  return {
    fullMarkdown,
    language,
    strategicNotes: `Generada con Gemini conectando los hechos del Portafolio con ${offer.company}`
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

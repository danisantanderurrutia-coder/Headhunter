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
      'No se ha configurado ninguna clave API de Gemini. Ve a Configuración > LLM o introduce tu Gemini API Key.'
    );
  }

  if (apiKey.startsWith('sk-') || apiKey.startsWith('sk-ant-')) {
    throw new Error(
      'La clave introducida empieza por "sk-", lo que indica que es de OpenAI o Anthropic. Google Gemini requiere una API Key de Google AI Studio (comienza por "AQ." o "AIzaSy..."). Puedes obtenerla gratis en https://aistudio.google.com/app/apikey'
    );
  }

  // Model normalisation: Gemini 3.5 Flash Lite y Gemini 3.8 Flash son los modelos oficiales activos de Google
  let model = modelNameOverride || settings.modelName || 'gemini-3.5-flash-lite';
  if (model.includes('3.8') || model.includes('pro')) {
    model = 'gemini-3.8-flash';
  } else {
    model = 'gemini-3.5-flash-lite';
  }

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

  const executePost = async (targetModel: string) => {
    const endpoint = `${GEMINI_API_BASE}/${targetModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  };

  let response = await executePost(model);

  // Si 3.8 Flash tiene un pico de saturación (503) o 404, fallback inmediato y transparente a 3.5 Flash Lite
  if (!response.ok && (response.status === 503 || response.status === 404) && model !== 'gemini-3.5-flash-lite') {
    response = await executePost('gemini-3.5-flash-lite');
  }

  if (!response.ok) {
    const errorBody = await response.text();
    let message = `Error de API Gemini (${response.status}): ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.error?.message) {
        if (parsed.error.message.includes('API key not valid')) {
          message = 'Error de Gemini: API key not valid. Tu clave fue rechazada por Google AI Studio. Asegúrate de usar una clave de Google AI Studio (comienza por "AQ." o "AIzaSy...") generada en https://aistudio.google.com/app/apikey.';
        } else {
          message = `Error de Gemini: ${parsed.error.message}`;
        }
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
 * Prueba la validez de una API Key contra el endpoint v1beta de Gemini
 */
export async function testGeminiConnection(keyToTest?: string): Promise<{ ok: boolean; message: string }> {
  const settings = getStoredSettings();
  const apiKey = (keyToTest !== undefined ? keyToTest : settings.apiKey || '').trim();

  if (!apiKey) {
    return { ok: false, message: 'La clave de API está vacía. Por favor introduce tu clave de Google AI Studio.' };
  }

  if (apiKey.startsWith('sk-') || apiKey.startsWith('sk-ant-')) {
    return {
      ok: false,
      message: 'La clave empieza por "sk-", correspondiente a OpenAI/Anthropic. Google Gemini requiere una clave de Google AI Studio ("AQ." o "AIzaSy...").'
    };
  }

  const endpoint = `${GEMINI_API_BASE}/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Ping test' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let msg = `Error ${response.status}: ${response.statusText}`;
      try {
        const parsed = JSON.parse(errorBody);
        if (parsed.error?.message) msg = parsed.error.message;
      } catch {}
      return { ok: false, message: msg };
    }

    return { ok: true, message: 'Conexión exitosa con Gemini 3.5 Flash Lite' };
  } catch (err: any) {
    return { ok: false, message: err.message || 'Error de conexión de red al conectar con Google' };
  }
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
- Longitud objetivo: DIN 5008 estricta en 1 sola página A4 (entre ${archetype.wingmanGuidance.targetWordCount.min} y ${archetype.wingmanGuidance.targetWordCount.max} palabras, ideal ~${archetype.wingmanGuidance.targetWordCount.ideal} palabras en 4-5 párrafos fluidos).
- Apertura: ${archetype.wingmanGuidance.openingStrategy}
- Cierre: ${archetype.wingmanGuidance.closingStrategy}

PALANCAS PARA DESTACAR SOBRE LA MEDIA (HEADHUNTER LENS):
- Asimetría competitiva principal: ${archetype.headhunterGuidance.outlierLever}
- Armas prioritarias a activar si guardan relación: ${archetype.headhunterGuidance.priorityWeapons.join(', ')}
- Cumplimiento clave a declarar: ${archetype.headhunterGuidance.keyComplianceChecks.join(' | ')}

VOZ Y POSICIONAMIENTO DEL CANDIDATO (JOVEN LÍDER INTELECTUAL - 30 AÑOS):
- Tono: Intelectual, fresco, enérgico, riguroso, colaborativo y con mentalidad de construcción conjunta de hipótesis.
- REGLA DE POSICIONAMIENTO E IMPACTO: "DEMOSTRAR RELEVANCIA SIN DAR CLASES":
  1. CÓMO TRANSMITIR LA RELEVANCIA DEL TRABAJO (Cero Sermón Obvio vs. Cero Frialdad):
     - ESTÁ PERMITIDO Y ES OBLIGATORIO: Transmitir la gravedad e importancia del problema desde la PERSPECTIVA EN PRIMERA PERSONA ("During my career, I have seen...", "My trajectory is driven by...").
     - LA DISTINCIÓN CRÍTICA:
       * SERMÓN OBVIO (PROHIBIDO): Enseñar teoría básica al revisor en tercera persona como si fuera un manual ("Climate change causes catastrophic losses and machine learning is needed because neural networks...").
       * RELEVANCIA VIVENCIAL / METODOLÓGICA (OBLIGATORIA): Declarar el imperativo ético y físico como punto de partida personal y reto operativo ("Having witnessed the acceleration of drought and wildfire extremes across complex terrain, my commitment is to ensure data-driven models do not bypass physical conservation laws").
     - REGLA DE TRANSFORMACIÓN: Nunca borres las motivaciones personales, la gravedad del contexto climático ni las frases iniciales en primera persona. Conviértelas en el MOTOR DE TU PREGUNTA CIENTÍFICA.
  2. APERTURA (THE HOOK, THESIS & IMPACT DRIVER):
     - PROHIBIDO abrir con burocracia pasiva ("I am writing to apply...") o sentencias impersonales de libro de texto ("Bridging dynamics is essential...").
     - ESTRUCTURA OBLIGATORIA: Iniciar en primera persona activa ("During my career, I have seen...", "My research trajectory is driven by...").
     - DEMOSTRACIÓN DE RELEVANCIA: Conecta la gravedad de los extremos climáticos (pérdidas socioecológicas, sequías, incendios) no como un sermón teórico al revisor, sino como el motor empírico que justifica tu investigación y el valor del laboratorio.
  3. PRESERVACIÓN ESTRICTA DE LA VOZ Y BORRADORES:
     - Si el usuario proporciona un borrador o párrafo propio, PROHIBIDO eliminar frases vivenciales o reemplazar la primera persona por fórmulas impersonales.
     - El LLM debe actuar como pulidor gramatical y elevador de vocabulario técnico, preservando el 100% de la intención, los matices éticos y la estructura original del usuario.
- PROHIBIDO EL TONO 'PROFESOR CATEDRÁTICO DE 55 AÑOS / SACOWEA':
  1. CERO sermón teórico obvio ("Preaching to the Choir"): NUNCA des clases de física básica, termodinámica o machine learning a los revisores (ej. no les digas que "el machine learning viola la conservación de masa" a un laboratorio de IA atmosférica). Ellos ya son expertos mundiales.
  2. CERO diagnósticos arrogantes no solicitados: NUNCA digas "The core bottleneck at your lab is...". Tú no estás dentro del laboratorio. Habla en cambio de "desafíos compartidos de frontera", "dificultades metodológicas abiertas" o "preguntas estimulantes en la intersección de física y datos".
  3. CERO jerga corporativa de consultoría fuera de lugar en ciencia: NUNCA uses "immediate 90-day operational milestone", "deliverables ejecutivos" o "onboarding friction". En ciencia se habla de diseño experimental, contraste de hipótesis con datos de terreno y colaboración iterativa de pipelines.

CATÁLOGO ESTRICTO DE ENLACES (ARTIFACT HOOKS - PROHIBIDO INVENTAR OTROS):
- Portafolio Central / Evidence Bunker: https://danisantanderurrutia-coder.github.io/portafolio/
- Wetland Monitor 3D (Wallener Au): https://danisantanderurrutia-coder.github.io/wetland-monitor/
- AgriTwin (Chile Agrotech IoT & Satélites): https://danisantanderurrutia-coder.github.io/agritwin-app/
- ReWild (Rewilding Field Suite): https://danisantanderurrutia-coder.github.io/agrotech/rewild/rewilding-field-suite.html
(NOTA: NO cites la app de empleo en las cartas ni inventes URLs o subdominios que no estén en esta lista).

DIRECTIVAS INQUEBRANTABLES:
1. NUNCA inventes funciones, herramientas ni logros. Básate estrictamente en sus hechos verificados:
   - Titulación: Geofísico de la Universidad de Chile (con distinción) + Doble M.Sc. en CAU Kiel y AMU Poznań.
   - CAU Kiel: Física de suelos, curvas de retención hídrica, Eddy Covariance, flujos de CO2 y CH4, R.
   - U. de Chile: Geofísica de campo, sondajes eléctricos verticales (VES Maule), física matemática y modelado continuo.
   - EPN / Global Forest Coalition: Biomasa, auditoría de contabilidad de carbono.
   - Congreso Nacional: Testimonio técnico pericial formal ante la Comisión de Emergencias y Bomberos.
   - Estatus legal: Residencia en Alemania bajo § 20 AufenthG (habilitación inmediata para contratación en investigación) y régimen español Ley 14/2013.
2. Tono "Zero-Servility": Trato horizontal de colega científico o par técnico de alto nivel. Cero sumisión ni adulación vacía.
3. Regla "Zero-Defensiveness": Sin justificaciones ni disculpas. Todos los cambios de área se formulan como activos acumulativos positivos.
4. Devuelve únicamente el texto markdown listo para imprimir o enviar, sin preámbulos ni comentarios meta.
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

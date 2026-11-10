import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { evaluateOfferWithGemini, generateCoverLetterWithGemini, parseRawJobWithGemini, testGeminiConnection } from '../geminiService';
import type { JobOffer } from '../../types/offers';

const mockStore: Record<string, string> = {};
beforeAll(() => {
  globalThis.localStorage = {
    getItem: (k: string) => mockStore[k] || null,
    setItem: (k: string, v: string) => { mockStore[k] = v; },
    removeItem: (k: string) => { delete mockStore[k]; },
    clear: () => { Object.keys(mockStore).forEach(k => delete mockStore[k]); },
    length: 0,
    key: () => null
  } as any;
});

const mockOffer: JobOffer = {
  id: 'test-offer-1',
  title: 'Investigador en Física de Suelos y Modelación de Carbono',
  company: 'Thünen-Institut',
  location: 'Braunschweig, Alemania',
  isBilbaoLocation: false,
  isRemote: false,
  url: 'https://test.example/job/1',
  sourceId: 'src-direct',
  sourceName: 'Direct',
  publishedDate: '2026-11-09',
  extractedAt: '2026-11-09',
  status: 'Nueva',
  matchScore: {
    totalScore: 90,
    skillFitScore: 30,
    locationScore: 20,
    salaryScore: 15,
    experienceScore: 15,
    companyQualityScore: 10,
    rationale: [],
    matchingSkills: [],
    missingSkills: [],
    pendingVerificationRequirements: []
  },
  requirements: ['Suelos', 'Carbono', 'R'],
  responsibilities: ['Investigación en física de suelos'],
  rawDescription: 'Investigación en física de suelos, balances de carbono y modelos en R.'
};

describe('geminiService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('lanza un error explícito si no hay apiKey configurada', async () => {
    localStorage.setItem(
      'job_search_os_settings_v19',
      JSON.stringify({ apiKey: '', modelName: 'gemini-3.8-flash' })
    );

    await expect(evaluateOfferWithGemini(mockOffer)).rejects.toThrow(
      'No se ha configurado ninguna clave API de Gemini'
    );
  });

  it('procesa correctamente la evaluación de oferta cuando la API responde JSON válido', async () => {
    localStorage.setItem(
      'job_search_os_settings_v19',
      JSON.stringify({ apiKey: 'fake-api-key', modelName: 'gemini-1.5-flash' })
    );

    const mockResponseJson = {
      matchScore: 94,
      verdict: 'EXCELENTE_ENCAJE',
      pros: ['Dominio de física de suelos en CAU Kiel', 'Experiencia en modelos R'],
      gaps: ['Conocimiento específico de bio-macroporos'],
      strategicAngle: 'Asimetría cuantitativa por formación en geofísica combinada con edafología.',
      recommendedEvidences: ['edu-kiel'],
      interviewPrep: [
        { question: '¿Cómo evalúa la resistencia del suelo?', suggestedAnswer: 'Mediante curvas de retención hídrica y dinámica de poros...' }
      ]
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(mockResponseJson) }]
            }
          }
        ]
      })
    } as any);

    const res = await evaluateOfferWithGemini(mockOffer);
    expect(res.matchScore).toBe(94);
    expect(res.verdict).toBe('EXCELENTE_ENCAJE');
    expect(res.pros.length).toBe(2);
    expect(res.interviewPrep[0].question).toContain('resistencia');
  });

  it('genera una carta de presentación táctica', async () => {
    localStorage.setItem(
      'job_search_os_settings_v19',
      JSON.stringify({ apiKey: 'fake-api-key', modelName: 'gemini-1.5-flash' })
    );

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Sehr geehrte Damen und Herren,\n\nhiermit bewerbe ich mich...' }]
            }
          }
        ]
      })
    } as any);

    const res = await generateCoverLetterWithGemini(mockOffer, 'de');
    expect(res.language).toBe('de');
    expect(res.fullMarkdown).toContain('Sehr geehrte');
  });

  it('analiza y auto-estructura un volcado de oferta de empleo con parseRawJobWithGemini', async () => {
    localStorage.setItem(
      'job_search_os_settings_v19',
      JSON.stringify({ apiKey: 'fake-api-key', modelName: 'gemini-3.8-flash' })
    );

    const mockParsed = {
      title: 'Wissenschaftliche*r Mitarbeiter*in (m/w/d)',
      company: 'Thünen-Institut für Agrarklimaschutz',
      location: 'Braunschweig, Deutschland',
      country: 'Alemania',
      isRemote: false,
      salaryText: 'TVöD E13',
      requirements: ['Eddy Covariance', 'Flujos de GEI', 'R'],
      cleanDescription: 'Investigación en balances de carbono y flujos de gases de efecto invernadero en turberas.',
      recipientName: 'Prof. Dr. Axel Don',
      recipientRole: 'Leitung der Arbeitsgruppe',
      recipientAddress: 'Bundesallee 50, 38116 Braunschweig',
      archetypeId: 'academia',
      strategicAngleSuggestion: 'Enfoque en física cuantitativa de suelos y Eddy Covariance en CAU Kiel.'
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: `\`\`\`json\n${JSON.stringify(mockParsed)}\n\`\`\`` }]
            }
          }
        ]
      })
    } as any);

    const res = await parseRawJobWithGemini('Thünen-Institut sucht Wissenschaftliche*r Mitarbeiter*in in Braunschweig...');
    expect(res.title).toBe('Wissenschaftliche*r Mitarbeiter*in (m/w/d)');
    expect(res.company).toBe('Thünen-Institut für Agrarklimaschutz');
    expect(res.requirements).toContain('Eddy Covariance');
    expect(res.recipientName).toBe('Prof. Dr. Axel Don');
    expect(res.archetypeId).toBe('academia');
  });

  it('detecta y rechaza claves que empiezan por sk- orientadas a OpenAI', async () => {
    localStorage.setItem(
      'job_search_os_settings_v19',
      JSON.stringify({ apiKey: 'sk-proj-1234567890', modelName: 'gemini-2.0-flash' })
    );

    await expect(evaluateOfferWithGemini(mockOffer)).rejects.toThrow(
      'La clave introducida empieza por "sk-"'
    );
  });

  it('proporciona un mensaje claro cuando Google rechaza una clave con 400', async () => {
    localStorage.setItem(
      'job_search_os_settings_v19',
      JSON.stringify({ apiKey: 'AIzaSy_fake_bad_key', modelName: 'gemini-2.0-flash' })
    );

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => JSON.stringify({
        error: { message: 'API key not valid. Please pass a valid API key.' }
      })
    } as any);

    await expect(evaluateOfferWithGemini(mockOffer)).rejects.toThrow(
      'Tu clave fue rechazada por Google AI Studio'
    );
  });

  it('testGeminiConnection detecta clave vacía y prueba con éxito cuando Google responde ok', async () => {
    const emptyRes = await testGeminiConnection('');
    expect(emptyRes.ok).toBe(false);
    expect(emptyRes.message).toContain('vacía');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    } as any);

    const okRes = await testGeminiConnection('AIzaSyValidKey');
    expect(okRes.ok).toBe(true);
    expect(okRes.message).toContain('Conexión exitosa');
  });
});

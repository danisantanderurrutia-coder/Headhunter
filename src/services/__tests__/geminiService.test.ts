import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { evaluateOfferWithGemini, generateCoverLetterWithGemini } from '../geminiService';
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
        { question: '¿Cómo evalúa la resistencia del suelo?', suggestedAnswer: 'Mediante curvas de preconsolidación...' }
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
});

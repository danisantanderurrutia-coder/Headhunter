import { describe, it, expect } from 'vitest';
import {
  classifyOfferArchetype,
  ARCHETYPE_PROFILES
} from '../archetypeClassifier';
import type { JobOffer } from '../../types/offers';

const baseMockOffer: JobOffer = {
  id: 'test-1',
  title: 'Wissenschaftlicher Mitarbeiter (m/w/d) Bodenphysik',
  company: 'Johann Heinrich von Thünen-Institut',
  location: 'Braunschweig, Deutschland',
  isBilbaoLocation: false,
  isRemote: false,
  url: 'https://thuenen.de/jobs/1',
  sourceId: 'src-thuenen',
  sourceName: 'Thünen',
  publishedDate: '2026-11-09',
  extractedAt: '2026-11-09',
  status: 'Nueva',
  matchScore: {
    totalScore: 92,
    skillFitScore: 32,
    locationScore: 20,
    salaryScore: 15,
    experienceScore: 15,
    companyQualityScore: 10,
    rationale: ['Encaje en física de suelos'],
    matchingSkills: ['Bodenphysik'],
    missingSkills: [],
    pendingVerificationRequirements: []
  },
  requirements: ['Bodenphysik', 'Promotion', 'TVöD E13', 'R oder Python'],
  responsibilities: ['Messungen von Makroporen und Vorauflast'],
  rawDescription: 'Forschungsprojekt zu Drilosphäre, Wasserflüssen und CO2-Bilanzen am Thünen-Institut für Agrarklimaschutz.'
};

describe('archetypeClassifier', () => {
  it('clasifica correctamente convocatorias de investigación pública DACH (Thünen)', () => {
    const profile = classifyOfferArchetype(baseMockOffer);
    expect(profile.id).toBe('DACH_RESEARCH');
    expect(profile.targetReader.roleTitle).toContain('Principal Investigator');
    expect(profile.wingmanGuidance.targetWordCount.ideal).toBe(460);
    expect(profile.wingmanGuidance.preferredTone).toBe('formal_academic');
  });

  it('clasifica correctamente convocatorias de startups Climate-Tech (Supercritical CDR)', () => {
    const startupOffer: JobOffer = {
      ...baseMockOffer,
      id: 'test-startup',
      title: 'Lead Climate Scientist - Carbon Removal Marketplace',
      company: 'Supercritical',
      location: 'Londres / Remote Europe',
      requirements: ['Durable CDR', 'Biochar', 'Enhanced Weathering', 'Fast-paced startup'],
      rawDescription: 'Join our venture-backed marketplace scaling permanent carbon removal to gigatonne scale. 14,000x mindset.'
    };

    const profile = classifyOfferArchetype(startupOffer);
    expect(profile.id).toBe('CLIMATE_TECH_STARTUP');
    expect(profile.targetReader.roleTitle).toContain('Climate Science');
    expect(profile.wingmanGuidance.targetWordCount.max).toBeLessThanOrEqual(420);
    expect(profile.wingmanGuidance.preferredTone).toBe('agile_impact');
  });

  it('clasifica correctamente convocatorias de organismos multilaterales (UNEP IMEO)', () => {
    const unepOffer: JobOffer = {
      ...baseMockOffer,
      id: 'test-unep',
      title: 'IMEO Methane Alert and Response System Implementation Coordinator',
      company: 'United Nations Environment Programme (UNEP)',
      location: 'París, Francia / Internacional',
      requirements: ['Satellite Observatories', 'Terms of Reference', 'Multilateral diplomacy', 'MARS'],
      rawDescription: 'UNEP International Methane Emissions Observatory (IMEO) ToR for satellite monitoring coordination.'
    };

    const profile = classifyOfferArchetype(unepOffer);
    expect(profile.id).toBe('MULTILATERAL_GOVERNANCE');
    expect(profile.targetReader.roleTitle).toContain('Programme Officer');
    expect(profile.wingmanGuidance.preferredTone).toBe('diplomatic_governance');
  });

  it('clasifica correctamente consultoría e ingeniería aplicada en Euskadi / España (Tecnalia / Bilbao)', () => {
    const consultingOffer: JobOffer = {
      ...baseMockOffer,
      id: 'test-tecnalia',
      title: 'Técnico Especialista en Hidrogeología y Geofísica Aplicada',
      company: 'Tecnalia Research & Innovation',
      location: 'Bilbao, Bizkaia',
      isBilbaoLocation: true,
      requirements: ['Sondajes eléctricos', 'Geofísica aplicada', 'Licitaciones', 'Hidráulica de cuencas'],
      rawDescription: 'Consultoría e ingeniería ambiental en proyectos de transición hídrica y evaluación ambiental en Bizkaia.'
    };

    const profile = classifyOfferArchetype(consultingOffer);
    expect(profile.id).toBe('INDUSTRY_CONSULTING');
    expect(profile.targetReader.roleTitle).toContain('Director Técnico');
    expect(profile.wingmanGuidance.preferredTone).toBe('applied_engineering');
  });

  it('proporciona perfiles completos para los 4 arquetipos con directivas Wingman y Headhunter', () => {
    const allArchetypes = ['DACH_RESEARCH', 'CLIMATE_TECH_STARTUP', 'MULTILATERAL_GOVERNANCE', 'INDUSTRY_CONSULTING'] as const;
    for (const key of allArchetypes) {
      const p = ARCHETYPE_PROFILES[key];
      expect(p.label).toBeTruthy();
      expect(p.targetReader.psychology).toBeTruthy();
      expect(p.targetReader.redFlags.length).toBeGreaterThan(0);
      expect(p.wingmanGuidance.targetWordCount.min).toBeGreaterThan(200);
      expect(p.headhunterGuidance.outlierLever).toBeTruthy();
      expect(p.headhunterGuidance.priorityWeapons.length).toBeGreaterThan(0);
    }
  });
});

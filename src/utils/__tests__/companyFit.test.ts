import { describe, it, expect } from 'vitest';
import { analyzeCompanyFit } from '../companyFit';
import type { CompanyDossier } from '../../types/companies';

describe('companyFit analysis', () => {
  it('correctly scores a peatland and eddy covariance research institute', () => {
    const comp: CompanyDossier = {
      id: 'test-kit',
      name: 'KIT - IMK-IFU',
      website: 'https://imk-ifu.kit.edu',
      sector: 'Meteorology',
      size: '100',
      headquarters: 'Garmisch-Partenkirchen, Alemania',
      description: 'Eddy covariance measurements in peatland ecosystems and soil GHG fluxes',
      keyProjects: ['TERENO', 'ICOS Peatlands'],
      recentNews: [],
      workCulture: [],
      redFlags: [],
      interviewArguments: [],
      techStack: ['Eddy Covariance', 'Python'],
      lastResearched: '2026-11-17',
      quadrants: ['DACH'],
      sectorCluster: 'RD_PUBLIC'
    };

    const fit = analyzeCompanyFit(comp);
    expect(fit.score).toBeGreaterThanOrEqual(88);
    expect(fit.matchedPillars.some(p => p.badge.includes('Turberas'))).toBe(true);
    expect(fit.winningAngle).toContain('covarianza de torbellinos');
  });

  it('correctly scores a geophysics and cat risk organization in Euskadi', () => {
    const comp: CompanyDossier = {
      id: 'test-euskadi',
      name: 'BC3 Climate Resilient Basins',
      website: 'https://bc3research.org',
      sector: 'Climate research',
      size: '80',
      headquarters: 'Bilbao, Bizkaia, Euskadi',
      description: 'Geofísica de cuencas, riesgo de incendios y políticas ambientales',
      keyProjects: ['Basque Fire Risk'],
      recentNews: [],
      workCulture: [],
      redFlags: [],
      interviewArguments: [],
      techStack: ['Python', 'QGIS', 'SEV'],
      lastResearched: '2026-11-17',
      quadrants: ['EUSKADI'],
      sectorCluster: 'RD_PUBLIC'
    };

    const fit = analyzeCompanyFit(comp);
    expect(fit.score).toBeGreaterThanOrEqual(92);
    expect(fit.matchedPillars.some(p => p.badge.includes('Geofísica'))).toBe(true);
  });
});

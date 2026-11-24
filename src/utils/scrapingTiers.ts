import type { CompanyDossier } from '../types/companies';

export type ScrapingTier = 'auto_green' | 'ats_yellow' | 'manual_red';

export interface ScrapingTierMeta {
  tier: ScrapingTier;
  label: string;
  badgeText: string;
  shortLabel: string;
  borderClass: string;
  glowClass: string;
  borderColor: string;
  boxShadowColor: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  tooltipBadgeClass: string;
  dotColor: string;
  legendText: string;
}

// ---------------------------------------------------------------------------
// 1. Explicit Category ID Sets
// ---------------------------------------------------------------------------

/**
 * RED / MANUAL: Cátedras/labs de nicho sin portal unificado corporativo,
 * entidades públicas vascas dependientes de BOPV / convocatorias oficiales,
 * organismos multilaterales dependientes de EPSO / UN Careers, y corporaciones blindadas.
 */
const MANUAL_RED_IDS = new Set<string>([
  // Cátedras y labs de investigación específicos
  'comp-epfl-herus',
  'comp-kit-c4land',
  'comp-tum-edfm',
  'comp-tum-surface',
  'comp-nccr-clim',
  'comp-uni-stuttgart-enwat',
  'comp-energyweather-ai',
  'comp-greifswald',

  // Entidades públicas vascas dependientes de BOPV / convocatorias y fundaciones
  'comp-ihobe',
  'comp-neiker',
  'comp-azti',
  'comp-elankidetza',
  'comp-cristina-enea',
  'comp-alboan',
  'comp-mundubat',
  'comp-epn',
  'comp-gfc',

  // Organismos multilaterales y portales blindados (EPSO / Inspira / SSO Enterprise)
  'comp-jrc-ispra',
  'comp-unccd',
  'comp-unep-wcmc',
  'comp-wri-europe',
  'comp-iberdrola',
  'comp-siemens-gamesa',
  'comp-munich-re',
  'comp-swiss-re',
  'comp-moodys-rms',
  'comp-guy-carpenter'
]);

/**
 * GREEN / AUTOMATIC: Centros con ingesta automática activa vía scraping HTTP o RSS.
 * Universidades públicas DACH / europeas con portales tabulares o feeds RSS,
 * y centros de investigación públicos y federales (service.bund.de, Ikerbasque, etc.).
 */
const AUTO_GREEN_IDS = new Set<string>([
  // Universidades públicas DACH / Europa
  'comp-boku',
  'comp-univie',
  'comp-ethz',
  'comp-uni-freiburg',
  'comp-uni-heidelberg',
  'comp-uzh',
  'comp-ceu-vienna',
  'comp-tudelft-grs',
  'comp-vu-amsterdam',
  'comp-wur',

  // Centros de investigación públicos / federales con scraping HTTP/RSS directo
  'comp-bc3',
  'comp-ikerbasque',
  'comp-eawag',
  'comp-thuenen',
  'comp-uba',
  'comp-deltares',
  'comp-knmi',
  'comp-smhi',
  'comp-dlr-eoc',
  'comp-geosphere-austria',
  'comp-tu-wien-climers',
  'comp-eurac',
  'comp-cmcc',
  'comp-ingv',
  'comp-forth',
  'comp-noa-beyond',
  'comp-creaf',
  'comp-kit-imk-ifu',
  'comp-aarhus-university',
  'comp-geomar',
  'comp-icta-uab',
  'comp-rifs-potsdam',
  'comp-ioer-dresden'
]);

/**
 * Resolves the scraping accessibility tier of any given organization:
 * - 'auto_green': Scraped automatically via HTTP or RSS (Universities, Federal Institutes)
 * - 'ats_yellow': Monitored via ATS APIs or headless browser scripts (Climate-tech, Scale-ups)
 * - 'manual_red': Requires manual click & inspection (Labs without portal, Official Gazettes BOPV, EPSO)
 */
export const resolveScrapingTier = (
  company: Partial<CompanyDossier> | { id?: string; website?: string }
): ScrapingTier => {
  const id = company.id || '';
  if (MANUAL_RED_IDS.has(id)) {
    return 'manual_red';
  }
  if (AUTO_GREEN_IDS.has(id)) {
    return 'auto_green';
  }

  // Fallback domain heuristics for dynamically added companies
  const website = (company.website || '').toLowerCase();
  if (
    website.includes('euskadi.eus') ||
    website.includes('europa.eu') ||
    website.includes('un.org') ||
    website.includes('unep') ||
    website.includes('unccd.int')
  ) {
    return 'manual_red';
  }

  if (
    website.includes('.ac.at') ||
    website.includes('.ethz.ch') ||
    website.includes('uni-heidelberg.de') ||
    website.includes('uni-freiburg.de') ||
    website.includes('thuenen.de') ||
    website.includes('umweltbundesamt.de')
  ) {
    return 'auto_green';
  }

  // Default to Category 2 (ATS APIs / Headless monitoring for startups and corporate centers)
  return 'ats_yellow';
};

/**
 * Returns full design tokens and metadata for each scraping tier.
 */
export const getScrapingTierMeta = (tier: ScrapingTier): ScrapingTierMeta => {
  switch (tier) {
    case 'auto_green':
      return {
        tier: 'auto_green',
        label: 'Ingesta automática activa',
        shortLabel: 'Automático',
        badgeText: '🤖 Ingesta automática activa',
        borderClass: 'border-2 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
        glowClass: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]',
        borderColor: '#10b981',
        boxShadowColor: 'rgba(16,185,129,0.5)',
        pillBg: 'bg-emerald-950/80',
        pillText: 'text-emerald-300',
        pillBorder: 'border-emerald-700/70',
        tooltipBadgeClass: 'bg-emerald-950 text-emerald-300 border border-emerald-600/70',
        dotColor: 'bg-emerald-500',
        legendText: '🟢 Monitoreo automático'
      };

    case 'ats_yellow':
      return {
        tier: 'ats_yellow',
        label: 'Monitoreo vía ATS / API',
        shortLabel: 'API / ATS',
        badgeText: '⚡ Monitoreo vía ATS',
        borderClass: 'border-2 border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]',
        glowClass: 'shadow-[0_0_8px_rgba(251,191,36,0.4)]',
        borderColor: '#fbbf24',
        boxShadowColor: 'rgba(251,191,36,0.4)',
        pillBg: 'bg-amber-950/80',
        pillText: 'text-amber-300',
        pillBorder: 'border-amber-700/70',
        tooltipBadgeClass: 'bg-amber-950 text-amber-300 border border-amber-600/70',
        dotColor: 'bg-amber-400',
        legendText: '🟡 API / ATS'
      };

    case 'manual_red':
    default:
      return {
        tier: 'manual_red',
        label: 'Revisión manual requerida: Cátedra/Boletín',
        shortLabel: 'Manual',
        badgeText: '⚠️ Revisión manual requerida: Cátedra/Boletín',
        borderClass: 'border-2 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
        glowClass: 'shadow-[0_0_8px_rgba(244,63,94,0.5)]',
        borderColor: '#f43f5e',
        boxShadowColor: 'rgba(244,63,94,0.5)',
        pillBg: 'bg-rose-950/80',
        pillText: 'text-rose-300',
        pillBorder: 'border-rose-700/70',
        tooltipBadgeClass: 'bg-rose-950 text-rose-300 border border-rose-600/70',
        dotColor: 'bg-rose-500',
        legendText: '🔴 Requiere inspección manual'
      };
  }
};

/**
 * Helper to get the ScrapingTierMeta directly for a company dossier.
 */
export const resolveScrapingTierMeta = (
  company: Partial<CompanyDossier> | { id?: string; website?: string }
): ScrapingTierMeta => {
  return getScrapingTierMeta(resolveScrapingTier(company));
};

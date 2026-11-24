import { describe, it, expect } from 'vitest';
import { resolveScrapingTier, getScrapingTierMeta, resolveScrapingTierMeta } from '../scrapingTiers';

describe('Scraping Tiers Classifier', () => {
  it('correctly classifies Category 1 (auto_green) universities and research institutes', () => {
    expect(resolveScrapingTier({ id: 'comp-boku' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-univie' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-ethz' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-uni-freiburg' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-uni-heidelberg' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-bc3' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-ikerbasque' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-eawag' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-thuenen' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-uba' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-aarhus-university' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-geomar' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-icta-uab' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-rifs-potsdam' })).toBe('auto_green');
    expect(resolveScrapingTier({ id: 'comp-ioer-dresden' })).toBe('auto_green');
  });

  it('correctly classifies Category 2 (ats_yellow) ATS portals and climate scale-ups', () => {
    expect(resolveScrapingTier({ id: 'comp-pachama' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-sylvera' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-bezero' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-agreena' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-ororatech' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-planet' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-gfz' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-pik' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-wsl' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-empa' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-dtu' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-list-luxembourg' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-tno' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-niva' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-lund-university' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-ecmwf' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-wuppertal-institut' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-oeko-institut' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-ecologic-institute' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-eeb-brussels' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-can-europe' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-iddri' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-iddri-paris' })).toBe('ats_yellow');
    expect(resolveScrapingTier({ id: 'comp-boell-stiftung' })).toBe('ats_yellow');
  });

  it('correctly classifies Category 3 (manual_red) labs, BOPV gazettes and multilateral agencies', () => {
    expect(resolveScrapingTier({ id: 'comp-epfl-herus' })).toBe('manual_red');
    expect(resolveScrapingTier({ id: 'comp-kit-c4land' })).toBe('manual_red');
    expect(resolveScrapingTier({ id: 'comp-tum-edfm' })).toBe('manual_red');
    expect(resolveScrapingTier({ id: 'comp-nccr-clim' })).toBe('manual_red');
    expect(resolveScrapingTier({ id: 'comp-ihobe' })).toBe('manual_red');
    expect(resolveScrapingTier({ id: 'comp-neiker' })).toBe('manual_red');
    expect(resolveScrapingTier({ id: 'comp-azti' })).toBe('manual_red');
    expect(resolveScrapingTier({ id: 'comp-elankidetza' })).toBe('manual_red');
    expect(resolveScrapingTier({ id: 'comp-jrc-ispra' })).toBe('manual_red');
    expect(resolveScrapingTier({ id: 'comp-unccd' })).toBe('manual_red');
    expect(resolveScrapingTier({ id: 'comp-iberdrola' })).toBe('manual_red');
  });

  it('provides matching design tokens and badges for each tier', () => {
    const greenMeta = getScrapingTierMeta('auto_green');
    expect(greenMeta.borderClass).toContain('border-emerald-500');
    expect(greenMeta.badgeText).toContain('Ingesta automática');

    const yellowMeta = getScrapingTierMeta('ats_yellow');
    expect(yellowMeta.borderClass).toContain('border-amber-400');
    expect(yellowMeta.badgeText).toContain('Monitoreo vía ATS');

    const redMeta = getScrapingTierMeta('manual_red');
    expect(redMeta.borderClass).toContain('border-rose-500');
    expect(redMeta.badgeText).toContain('Revisión manual');
  });

  it('resolveScrapingTierMeta works directly with company object', () => {
    const meta = resolveScrapingTierMeta({ id: 'comp-boku', name: 'BOKU' });
    expect(meta.tier).toBe('auto_green');
    expect(meta.borderColor).toBe('#10b981');
  });
});

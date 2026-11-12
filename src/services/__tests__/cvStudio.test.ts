import { describe, expect, it } from 'vitest';
import { initialProfile } from '../sampleData';
import {
  applyLinkFixes,
  auditProfile,
  buildCv,
  renderCvHtml,
  renderCvMarkdown,
  tagMatches,
  type StudioConfig
} from '../cvStudio';
import { CANONICAL_CONTACT, VERIFIED_FACTS } from '../../data/verifiedCvFacts';

const offer = (title: string, text: string): NonNullable<StudioConfig['offer']> => ({
  title,
  company: 'Test GmbH',
  rawDescription: text,
  requirements: [],
  responsibilities: []
});

describe('cvStudio · datos verificados', () => {
  it('todos los hechos declaran fuente y texto en ES y EN', () => {
    VERIFIED_FACTS.forEach((f) => {
      expect(f.source.length).toBeGreaterThan(5);
      expect(f.es.title.length).toBeGreaterThan(0);
      expect(f.en.title.length).toBeGreaterThan(0);
    });
  });

  it('no contiene afirmaciones descartadas en la auditoría', () => {
    const blob = JSON.stringify(VERIFIED_FACTS).toLowerCase();
    ['lorawan', 'diatom', 'humic', 'fastapi pipelines', 'ingeniería de 6'].forEach((bad) => {
      expect(blob).not.toContain(bad);
    });
  });

  it('usa los enlaces canónicos del Portafolio', () => {
    expect(CANONICAL_CONTACT.linkedin).toContain('/in/santanderurrutia');
    expect(CANONICAL_CONTACT.github).toContain('danisantanderurrutia-coder');
  });

  it('contiene las 3 aplicaciones ambientales verificadas: Wetland Monitor, AgriTwin y Rewilding Suite', () => {
    const ids = VERIFIED_FACTS.map((f) => f.id);
    expect(ids).toContain('exp-wetland-monitor');
    expect(ids).toContain('exp-agritwin');
    expect(ids).toContain('exp-rewilding-suite');

    const rewild = VERIFIED_FACTS.find((f) => f.id === 'exp-rewilding-suite');
    expect(rewild?.tags).toContain('pwa');
    expect(rewild?.tags).toContain('gis');
    expect(rewild?.tags).toContain('product owner');
  });
});

describe('cvStudio · tagMatches', () => {
  it('etiquetas cortas solo coinciden como palabra completa', () => {
    expect(tagMatches('experience with r and python', 'r')).toBe(true);
    expect(tagMatches('research for the environment', 'r')).toBe(false);
  });
});

describe('cvStudio · buildCv', () => {
  it('siempre incluye los 3 títulos y los idiomas', () => {
    (['1p', '2p'] as const).forEach((length) => {
      const cv = buildCv({ lang: 'es', length });
      const ids = cv.sections.flatMap((s) => s.items.map((i) => i.fact.id));
      ['edu-kiel', 'edu-amu', 'edu-uchile', 'lng-all'].forEach((id) => expect(ids).toContain(id));
    });
  });

  it('respeta los cupos del CV de 1 página', () => {
    const cv = buildCv({ lang: 'en', length: '1p' });
    expect(cv.sections.find((s) => s.section === 'experience')!.items.length).toBeLessThanOrEqual(4);
    expect(cv.sections.find((s) => s.section === 'publications')!.items.length).toBeLessThanOrEqual(2);
  });

  it('el CV de 2 páginas incluye más contenido que el de 1', () => {
    const count = (l: '1p' | '2p') => buildCv({ lang: 'es', length: l }).sections.reduce((n, s) => n + s.items.length, 0);
    expect(count('2p')).toBeGreaterThan(count('1p'));
  });

  it('una oferta sobre humedales y GEI prioriza la experiencia afín', () => {
    const cv = buildCv({
      lang: 'en',
      length: '1p',
      offer: offer('Peatland GHG researcher', 'Eddy Covariance, wetland carbon fluxes, peatland rewetting and GIS')
    });
    const exp = cv.sections.find((s) => s.section === 'experience')!.items;
    expect(exp[0].fact.id).toBe('exp-wetland-monitor');
    expect(cv.matchedTags).toContain('eddy covariance');
    expect(cv.footer).toBeUndefined();
  });

  it('una oferta de comunicación y política cambia el orden', () => {
    const cv = buildCv({
      lang: 'es',
      length: '1p',
      offer: offer('Asesor de políticas públicas', 'incidencia legislativa, congreso, comunicación y campañas de políticas públicas')
    });
    const first = cv.sections.find((s) => s.section === 'experience')!.items[0];
    expect(['exp-congress', 'exp-apruebo-rural']).toContain(first.fact.id);
  });

  it('respeta exclusiones, pero nunca excluye los títulos centrales sin pedirlo', () => {
    const cv = buildCv({ lang: 'es', length: '2p', exclude: ['exp-cuarentena-rap', 'pub-olca-2025'] });
    const ids = cv.sections.flatMap((s) => s.items.map((i) => i.fact.id));
    expect(ids).not.toContain('exp-cuarentena-rap');
    expect(ids).not.toContain('pub-olca-2025');
  });

  it('forceInclude permite superar el cupo', () => {
    const base = buildCv({ lang: 'es', length: '1p' });
    const forced = buildCv({ lang: 'es', length: '1p', forceInclude: ['exp-cuarentena-rap'] });
    const ids = forced.sections.flatMap((s) => s.items.map((i) => i.fact.id));
    expect(ids).toContain('exp-cuarentena-rap');
    expect(forced.sections.reduce((n, s) => n + s.items.length, 0)).toBeGreaterThanOrEqual(
      base.sections.reduce((n, s) => n + s.items.length, 0)
    );
  });

  it('el teléfono solo aparece si se pide', () => {
    const without = buildCv({ lang: 'es', length: '1p', phone: '+49 000' });
    const withPhone = buildCv({ lang: 'es', length: '1p', phone: '+49 000', includePhone: true });
    expect(without.contact.some((c) => c.label === 'phone')).toBe(false);
    expect(withPhone.contact.some((c) => c.label === 'phone')).toBe(true);
  });
});

describe('cvStudio · renderCvHtml', () => {
  it('genera 1 o 2 páginas A4', () => {
    expect((renderCvHtml(buildCv({ lang: 'es', length: '1p' })).match(/class="page"/g) || []).length).toBe(1);
    expect((renderCvHtml(buildCv({ lang: 'en', length: '2p' })).match(/class="page"/g) || []).length).toBe(2);
  });

  it('escapa HTML del contenido', () => {
    const html = renderCvHtml(buildCv({ lang: 'es', length: '1p', location: '<script>x</script>' }));
    expect(html).not.toContain('<script>x</script>');
  });
});

describe('cvStudio · renderCvMarkdown', () => {
  it('genera texto markdown estructurado con datos verificados', () => {
    const md = renderCvMarkdown(buildCv({ lang: 'es', length: '1p' }));
    expect(md).toContain('# DANIEL SANTANDER URRUTIA');
    expect(md).toContain('## FORMACIÓN ACADÉMICA');
    expect(md).toContain('M.Sc. en Manejo Ambiental');
    expect(md).toContain('CAU Kiel');
  });

  it('genera texto en inglés correctamente', () => {
    const md = renderCvMarkdown(buildCv({ lang: 'en', length: '1p' }));
    expect(md).toContain('## EDUCATION');
    expect(md).toContain('M.Sc. in Environmental Management');
  });

  it('genera texto y HTML en alemán correctamente', () => {
    const cv = buildCv({ lang: 'de', length: '1p', tacticalAngle: 'biofisica' });
    expect(cv.config.lang).toBe('de');
    expect(cv.headline).toContain('Eddy-Kovarianz');
    const md = renderCvMarkdown(cv);
    expect(md).toContain('## AKADEMISCHE AUSBILDUNG');
    expect(md).toContain('BERUFSERFAHRUNG & PROJEKTE');
    const html = renderCvHtml(cv);
    expect(html).toContain('<html lang="de">');
    expect(html).toContain('Akademische Ausbildung');
  });
});

describe('cvStudio · auditProfile', () => {
  it('detecta un LinkedIn desactualizado en el perfil guardado y ofrece corrección', () => {
    const stale = { ...initialProfile, linkedin: 'https://linkedin.com/in/daniel-santander' };
    const issues = auditProfile(stale);
    const link = issues.find((i) => i.id === 'link-linkedin');
    expect(link).toBeDefined();
    const fixed = applyLinkFixes(stale, issues);
    expect(auditProfile(fixed).some((i) => i.id === 'link-linkedin')).toBe(false);
  });

  it('el perfil inicial ya trae los enlaces canónicos', () => {
    expect(auditProfile(initialProfile).some((i) => i.id.startsWith('link-'))).toBe(false);
  });
});

describe('cvStudio · ángulos tácticos de posicionamiento', () => {
  it('aplica el ángulo de biofísica y Eddy Covariance correctamente', () => {
    const cv = buildCv({ lang: 'es', length: '1p', tacticalAngle: 'biofisica' });
    expect(cv.headline).toContain('Eddy Covariance');
    expect(cv.summary).toContain('balance de GEI');
  });

  it('aplica el ángulo de MRV y Carbon-Tech correctamente', () => {
    const cv = buildCv({ lang: 'es', length: '1p', tacticalAngle: 'mrv_carbon' });
    expect(cv.headline).toContain('MRV');
    expect(cv.summary).toContain('teledetección satelital');
  });

  it('aplica el ángulo de Cat Risk e Incendios correctamente', () => {
    const cv = buildCv({ lang: 'es', length: '1p', tacticalAngle: 'cat_risk' });
    expect(cv.headline).toContain('Riesgos Físicos');
    expect(cv.summary).toContain('incendios forestales');
  });

  it('aplica el ángulo de Políticas Climáticas y Multilateral correctamente', () => {
    const cv = buildCv({ lang: 'es', length: '1p', tacticalAngle: 'politicas' });
    expect(cv.headline).toContain('Políticas Climáticas');
    expect(cv.summary).toContain('Senado y Cámara de Diputados');
  });
});

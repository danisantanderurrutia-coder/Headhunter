import type { JobOffer } from '../types/offers';
import type { MasterProfile } from '../types/profile';
import {
  CANONICAL_CONTACT,
  CV_FOOTER_GENERAL,
  CV_HEADLINE,
  CV_SUMMARY,
  TACTICAL_HEADLINES,
  TACTICAL_SUMMARIES,
  VERIFIED_FACTS,
  type CvFact,
  type CvSection,
  type TacticalAngle
} from '../data/verifiedCvFacts';

export type { TacticalAngle };
export type CvLang = 'es' | 'en' | 'de';
export type CvLength = '1p' | '2p';

export interface StudioConfig {
  lang: CvLang;
  length: CvLength;
  tacticalAngle?: TacticalAngle;
  /** Oferta objetivo (opcional): reordena y selecciona según coincidencias */
  offer?: Pick<JobOffer, 'title' | 'company' | 'rawDescription' | 'requirements' | 'responsibilities'> | null;
  /** Hechos que el usuario fuerza a incluir aunque excedan el cupo */
  forceInclude?: string[];
  /** Hechos que el usuario excluye */
  exclude?: string[];
  location?: string;
  phone?: string;
  includePhone?: boolean;
}

export interface ScoredFact {
  fact: CvFact;
  score: number;
  matchedTags: string[];
  included: boolean;
}

export interface BuiltCv {
  config: StudioConfig;
  headline: string;
  summary: string;
  contact: { label: string; value: string }[];
  sections: { section: CvSection; items: ScoredFact[] }[];
  /** Todas las evidencias con su puntaje (incluye las no seleccionadas) */
  allFacts: ScoredFact[];
  matchedTags: string[];
  footer?: string;
}

const SECTION_ORDER: CvSection[] = ['education', 'experience', 'publications', 'courses', 'skills', 'languages'];

/** Cupos por sección y largo. 2 páginas muestra todo lo que cabe en la práctica. */
export const SECTION_CAPS: Record<CvSection, Record<CvLength, number>> = {
  education: { '1p': 3, '2p': 3 },
  experience: { '1p': 4, '2p': 6 },
  publications: { '1p': 2, '2p': 6 },
  courses: { '1p': 3, '2p': 8 },
  skills: { '1p': 3, '2p': 3 },
  languages: { '1p': 1, '2p': 1 }
};

const normalize = (s: string) => s.toLowerCase();

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Coincidencia de etiqueta: palabra completa para etiquetas cortas (evita que "r" coincida con cualquier texto). */
export const tagMatches = (haystack: string, tag: string): boolean => {
  const t = normalize(tag);
  if (t.length <= 3) {
    return new RegExp(`(^|[^a-z0-9áéíóúñü])${escapeRegExp(t)}($|[^a-z0-9áéíóúñü])`, 'i').test(haystack);
  }
  return haystack.includes(t);
};

export const offerText = (offer: StudioConfig['offer']): string => {
  if (!offer) return '';
  return normalize(
    [offer.title, offer.company, offer.rawDescription, ...(offer.requirements || []), ...(offer.responsibilities || [])]
      .filter(Boolean)
      .join(' \n ')
  );
};

const TACTICAL_ANGLE_KEYWORDS: Record<Exclude<TacticalAngle, 'general'>, string[]> = {
  biofisica: ['eddy covariance', 'peatland', 'turbera', 'moor', 'ghg', 'gei', 'greenhouse', 'paludiculture', 'paludicultura', 'soil', 'suelo', 'boden', 'biogeochemistry'],
  mrv_carbon: ['remote sensing', 'teledetección', 'earth observation', 'gee', 'google earth engine', 'sentinel', 'carbon', 'wetland monitor', 'satelital', 'mrv'],
  cat_risk: ['wildfire', 'incendio', 'catchment', 'cuenca', 'hydrology', 'hidrología', 'riesgo', 'hazard', 'geophysics', 'geofísica'],
  politicas: ['congreso', 'policy', 'política', 'senado', 'water code', 'código de aguas', 'cuenca', 'watershed', 'comunicación']
};

export const scoreFacts = (offer: StudioConfig['offer'], tacticalAngle?: TacticalAngle): ScoredFact[] => {
  const text = offerText(offer);
  const angleKeywords = tacticalAngle && tacticalAngle !== 'general' ? TACTICAL_ANGLE_KEYWORDS[tacticalAngle] : [];

  return VERIFIED_FACTS.map((fact) => {
    const matchedTags = text ? fact.tags.filter((tag) => tagMatches(text, tag)) : [];
    const hasAngleMatch = angleKeywords.length > 0 && fact.tags.some((t) => angleKeywords.includes(t.toLowerCase()));
    const angleBonus = hasAngleMatch ? 2.5 : 0;

    return {
      fact,
      matchedTags,
      score: fact.priority + matchedTags.length * 1.5 + angleBonus,
      included: false
    };
  });
};

export const buildCv = (config: StudioConfig): BuiltCv => {
  const { lang, length, offer, tacticalAngle = 'general' } = config;
  const exclude = new Set(config.exclude || []);
  const force = new Set(config.forceInclude || []);
  const scored = scoreFacts(offer, tacticalAngle);
  const hasOffer = !!offer;

  const sections = SECTION_ORDER.map((section) => {
    const inSection = scored.filter((s) => s.fact.section === section);
    const base = [...inSection];
    // Sin oferta: orden por puntaje (incluye prioridad + bonus táctico) y luego orden de declaración. Con oferta: por puntaje.
    base.sort((a, b) => {
      const diff = b.score - a.score;
      return diff !== 0 ? diff : inSection.indexOf(a) - inSection.indexOf(b);
    });

    const cap = SECTION_CAPS[section][length];
    const picked: ScoredFact[] = [];
    for (const item of base) {
      if (exclude.has(item.fact.id)) continue;
      if (item.fact.core || force.has(item.fact.id) || picked.length < cap) {
        picked.push(item);
      }
    }
    picked.forEach((p) => (p.included = true));
    // Los títulos universitarios y publicaciones se muestran siempre por fecha (reciente primero) si no hay oferta.
    return { section, items: picked };
  });

  const matchedTags = Array.from(
    new Set(
      scored
        .filter((s) => s.included)
        .flatMap((s) => s.matchedTags)
    )
  );

  const contact: BuiltCv['contact'] = [
    { label: 'email', value: CANONICAL_CONTACT.email },
    { label: 'web', value: CANONICAL_CONTACT.portfolio.replace(/^https?:\/\//, '').replace(/\/$/, '') },
    { label: 'linkedin', value: CANONICAL_CONTACT.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') },
    { label: 'github', value: CANONICAL_CONTACT.github.replace(/^https?:\/\//, '') }
  ];
  const location = (config.location ?? CANONICAL_CONTACT.defaultLocation).trim();
  if (location) contact.unshift({ label: 'location', value: location });
  if (config.includePhone && config.phone?.trim()) contact.splice(1, 0, { label: 'phone', value: config.phone.trim() });

  const headline = TACTICAL_HEADLINES[tacticalAngle]?.[lang] || CV_HEADLINE[lang] || CV_HEADLINE.en;
  const summary = TACTICAL_SUMMARIES[tacticalAngle]?.[lang] || CV_SUMMARY[lang] || CV_SUMMARY.en;

  return {
    config,
    headline,
    summary,
    contact,
    sections,
    allFacts: scored,
    matchedTags,
    footer: hasOffer ? undefined : (CV_FOOTER_GENERAL[lang] || CV_FOOTER_GENERAL.en)
  };
};

// ----------------------------------------------------------------------------
// Render HTML (A4). Se usa tanto para la vista previa (iframe) como para imprimir.
// ----------------------------------------------------------------------------

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const SECTION_TITLES: Record<CvSection, Record<CvLang, string>> = {
  education: { es: 'Formación académica', en: 'Education', de: 'Akademische Ausbildung' },
  experience: { es: 'Experiencia y proyectos', en: 'Experience & Projects', de: 'Berufserfahrung & Projekte' },
  publications: { es: 'Publicaciones seleccionadas', en: 'Selected Publications', de: 'Ausgewählte Publikationen' },
  courses: { es: 'Cursos y formación complementaria', en: 'Courses & Further Training', de: 'Weiterbildung & Zertifikate' },
  skills: { es: 'Competencias técnicas', en: 'Technical Skills', de: 'Fachliche Kompetenzen' },
  languages: { es: 'Idiomas', en: 'Languages', de: 'Sprachkenntnisse' }
};

const CV_CSS = `
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
html, body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #1e293b; background: #fff; font-size: 9.2pt; line-height: 1.38; }
.page { width: 210mm; height: 297mm; padding: 10mm 12mm 9mm 12mm; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; background: #fff; }
.page:last-child { page-break-after: avoid; }
@media screen { html, body { background: #cbd5e1; } .page { margin: 0 auto 12px auto; box-shadow: 0 2px 12px rgba(15,23,42,.25); } }
.hd { border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-bottom: 7px; }
.name { font-size: 19pt; font-weight: 800; letter-spacing: -.5px; color: #0f172a; line-height: 1; margin: 0; text-transform: uppercase; }
.name.small { font-size: 14pt; }
.headline { font-size: 9pt; font-weight: 600; color: #0369a1; margin: 3px 0 4px; }
.contact { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 7.6pt; color: #475569; font-weight: 500; }
.contact b { color: #0f172a; font-weight: 600; }
.summary { font-size: 8.1pt; line-height: 1.34; background: #f8fafc; padding: 4px 7px; border-left: 3px solid #0284c7; border-radius: 2px; margin-bottom: 2px; }
.st { font-size: 8.8pt; font-weight: 800; text-transform: uppercase; letter-spacing: .6px; color: #0f172a; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 2px; margin: 7px 0 4px; }
.it { margin-bottom: 5px; }
.row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; font-size: 8.2pt; }
.t { font-weight: 700; color: #0f172a; }
.o { font-weight: 600; color: #334155; }
.m { font-size: 7.5pt; font-weight: 600; color: #64748b; white-space: nowrap; }
.d { font-size: 8.1pt; color: #334155; margin-top: 1px; line-height: 1.3; }
ul.b { margin: 1px 0 3px; padding-left: 14px; }
ul.b li { font-size: 8.1pt; color: #334155; margin-bottom: 2px; line-height: 1.3; }
.ft { border-top: 1px solid #cbd5e1; padding-top: 3px; margin-top: 4px; display: flex; justify-content: space-between; gap: 10px; font-size: 6.8pt; color: #64748b; }
.ft b { color: #0f172a; }
`;

/** Ajusta la tipografía de forma uniforme para que el contenido llene la hoja A4. */
const FIT_JS = `
(function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  function fits(z) {
    return pages.every(function (pg) {
      var content = pg.children[0], footer = pg.children[1];
      content.style.zoom = z;
      var cs = getComputedStyle(pg);
      var avail = pg.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - footer.offsetHeight - 10;
      return content.getBoundingClientRect().height <= avail;
    });
  }
  var lo = 0.8, hi = 1.4;
  if (!fits(lo)) { document.body.setAttribute('data-overflow', '1'); return; }
  for (var i = 0; i < 14; i++) { var mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
  fits(lo);
  document.body.setAttribute('data-fit-zoom', lo.toFixed(3));
})();
`;

const renderItem = (s: ScoredFact, lang: CvLang, length: CvLength): string => {
  const f = s.fact;
  const x = f[lang] || f.en || f.es;
  const head = `<div class="row"><div><span class="t">${esc(x.title)}</span>${x.org ? ` — <span class="o">${esc(x.org)}</span>` : ''}</div><div class="m">${esc([x.place, f.period].filter(Boolean).join(' | '))}</div></div>`;
  if (f.section === 'skills' || f.section === 'languages') {
    return `<div class="it"><div class="d"><b>${esc(x.title)}:</b> ${esc(x.short || '')}</div></div>`;
  }
  if (f.section === 'publications') {
    return `<div class="it"><div class="row"><div><span class="t">${esc(x.title)}</span></div><div class="m">${esc(f.period || '')}</div></div><div class="d">${esc(x.org || '')}</div></div>`;
  }
  if (f.section === 'courses') {
    return `<div class="it"><div class="row"><div><span class="t">${esc(x.title)}</span> — <span class="o">${esc(x.org || '')}</span></div><div class="m">${esc(f.period || '')}</div></div></div>`;
  }
  if (length === '2p' && x.long?.length) {
    return `<div class="it">${head}<ul class="b">${x.long.map((l) => `<li>${esc(l)}</li>`).join('')}</ul></div>`;
  }
  return `<div class="it">${head}${x.short ? `<div class="d">${esc(x.short)}</div>` : ''}</div>`;
};

const renderSectionHtml = (built: BuiltCv, sec: BuiltCv['sections'][number]): string => {
  if (!sec.items.length) return '';
  return `<div class="st">${esc(SECTION_TITLES[sec.section][built.config.lang])}</div>${sec.items
    .map((i) => renderItem(i, built.config.lang, built.config.length))
    .join('')}`;
};

const renderHeader = (built: BuiltCv, small = false): string => {
  const contact = built.contact.map((c) => `<span>${c.label === 'location' || c.label === 'phone' ? '<b>' + esc(c.value) + '</b>' : esc(c.value)}</span>`).join('');
  return `<div class="hd"><h1 class="name${small ? ' small' : ''}">Daniel Santander Urrutia</h1>${small ? '' : `<div class="headline">${esc(built.headline)}</div>`}<div class="contact">${contact}</div></div>`;
};

const renderFooter = (built: BuiltCv, page: number, pages: number): string =>
  `<div class="ft"><div>${esc(built.footer || '')}</div><div><b>${esc(CANONICAL_CONTACT.email)}</b>${pages > 1 ? ` · ${page}/${pages}` : ''}</div></div>`;

export const renderCvHtml = (built: BuiltCv): string => {
  const { lang, length } = built.config;
  const byName = (name: CvSection) => built.sections.find((s) => s.section === name)!;
  const summaryHtml = `<div class="summary">${esc(built.summary)}</div>`;

  let pagesHtml: string[];
  if (length === '1p') {
    const body = built.sections.map((s) => renderSectionHtml(built, s)).join('');
    pagesHtml = [`<div class="page"><div>${renderHeader(built)}${summaryHtml}${body}</div>${renderFooter(built, 1, 1)}</div>`];
  } else {
    const p1 = ['education', 'experience'] as CvSection[];
    const p2 = ['publications', 'courses', 'skills', 'languages'] as CvSection[];
    pagesHtml = [
      `<div class="page"><div>${renderHeader(built)}${summaryHtml}${p1.map((n) => renderSectionHtml(built, byName(n))).join('')}</div>${renderFooter(built, 1, 2)}</div>`,
      `<div class="page"><div>${renderHeader(built, true)}${p2.map((n) => renderSectionHtml(built, byName(n))).join('')}</div>${renderFooter(built, 2, 2)}</div>`
    ];
  }

  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"><title>Daniel Santander Urrutia — CV ${lang.toUpperCase()} ${length}</title><style>${CV_CSS}</style></head><body>${pagesHtml.join('')}<script>${FIT_JS}</script></body></html>`;
};

export const countPages = (length: CvLength): number => (length === '1p' ? 1 : 2);

/**
 * Renderiza el CV estructurado como texto Markdown (usado por el Pipeline de 5 pasos
 * y como exportación textual limpia con datos 100% verificados).
 */
export const renderCvMarkdown = (built: BuiltCv): string => {
  const { lang, length } = built.config;
  const lines: string[] = [];

  lines.push(`# DANIEL SANTANDER URRUTIA`);
  lines.push(`**${built.headline}**`);
  lines.push(built.contact.map((c) => c.value).join(' | '));
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(built.summary);
  lines.push('');

  built.sections.forEach((sec) => {
    if (!sec.items.length) return;
    lines.push(`## ${SECTION_TITLES[sec.section][lang].toUpperCase()}`);
    lines.push('');
    sec.items.forEach((item) => {
      const f = item.fact;
      const x = f[lang] || f.en || f.es;
      if (f.section === 'skills' || f.section === 'languages') {
        lines.push(`- **${x.title}**: ${x.short || ''}`);
      } else if (f.section === 'publications') {
        lines.push(`- **${x.title}** (${f.period || ''})`);
        if (x.org) lines.push(`  *${x.org}*`);
      } else if (f.section === 'courses') {
        lines.push(`- **${x.title}** — ${x.org || ''} (${f.period || ''})`);
      } else {
        const meta = [x.place, f.period].filter(Boolean).join(' | ');
        lines.push(`- **${x.title}**${x.org ? ` — *${x.org}*` : ''}${meta ? ` (${meta})` : ''}`);
        if (length === '2p' && x.long?.length) {
          x.long.forEach((l) => lines.push(`  * ${l}`));
        } else if (x.short) {
          lines.push(`  ${x.short}`);
        }
      }
    });
    lines.push('');
  });

  if (built.footer) {
    lines.push('---');
    lines.push(`*${built.footer}*`);
  }

  return lines.join('\n').trim();
};

// ----------------------------------------------------------------------------
// Auditoría del Master Profile contra los hechos verificados del Portafolio.
// ----------------------------------------------------------------------------

export interface AuditIssue {
  id: string;
  severity: 'error' | 'warning';
  message: string;
  current?: string;
  expected?: string;
  fix?: { field: 'linkedin' | 'github' | 'portfolio'; value: string };
}

const sameUrl = (a: string, b: string) =>
  a.trim().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toLowerCase() ===
  b.trim().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toLowerCase();

export const auditProfile = (profile: MasterProfile): AuditIssue[] => {
  const issues: AuditIssue[] = [];

  (['linkedin', 'github', 'portfolio'] as const).forEach((field) => {
    const expected = CANONICAL_CONTACT[field];
    if (!profile[field] || !sameUrl(profile[field], expected)) {
      issues.push({
        id: `link-${field}`,
        severity: 'error',
        message: `El enlace de ${field} del Perfil Maestro no coincide con el del Portafolio.`,
        current: profile[field] || '(vacío)',
        expected,
        fix: { field, value: expected }
      });
    }
  });

  const uchile = profile.education.find((e) => /chile/i.test(e.institution));
  if (uchile && uchile.startDate && uchile.startDate !== '2015') {
    issues.push({
      id: 'edu-uchile-start',
      severity: 'warning',
      message: 'Año de inicio en la Universidad de Chile distinto al del Portafolio (2015–2021).',
      current: `${uchile.startDate}–${uchile.endDate}`,
      expected: '2015–2021'
    });
  }

  const german = profile.languages.find((l) => /alem|german|deutsch/i.test(l.language));
  if (german && german.proficiency !== 'B2') {
    issues.push({
      id: 'lang-german',
      severity: 'warning',
      message: 'Nivel de alemán distinto al del Portafolio (B1–B2). Confirma cuál mostrar.',
      current: german.proficiency,
      expected: 'B1–B2'
    });
  }
  if (profile.languages.some((l) => /polaco|polish/i.test(l.language))) {
    issues.push({
      id: 'lang-polish',
      severity: 'warning',
      message: 'El Perfil Maestro lista polaco, que no figura en el Portafolio. Los CVs del Studio no lo incluyen.'
    });
  }

  const epn = profile.experiences.find((e) => /environmental paper|global forest/i.test(e.company));
  if (epn && (epn.startDate !== '2023' || epn.endDate !== '2023')) {
    issues.push({
      id: 'exp-epn-dates',
      severity: 'warning',
      message: 'Fechas del trabajo con EPN distintas a la publicación del Portafolio (2023).',
      current: `${epn.startDate}–${epn.endDate}`,
      expected: '2023'
    });
  }

  profile.achievementsBank
    .filter((a) => a.isVerified && /\d\s*\+|\d{2,}/.test(a.metrics))
    .forEach((a) => {
      issues.push({
        id: `ach-metric-${a.id}`,
        severity: 'warning',
        message: `Logro marcado como verificado con una métrica numérica que el Portafolio no respalda: "${a.metrics}".`,
        current: a.title
      });
    });

  return issues;
};

export const applyLinkFixes = (profile: MasterProfile, issues: AuditIssue[]): MasterProfile => {
  const next = { ...profile };
  issues.forEach((i) => {
    if (i.fix) next[i.fix.field] = i.fix.value;
  });
  return next;
};

// ----------------------------------------------------------------------------
// Versiones guardadas (por oferta). Solo guardan la configuración, no el texto.
// ----------------------------------------------------------------------------

export interface SavedStudioVersion {
  id: string;
  name: string;
  createdAt: string;
  lang: CvLang;
  length: CvLength;
  tacticalAngle?: TacticalAngle;
  offerId?: string;
  offerLabel?: string;
  forceInclude: string[];
  exclude: string[];
  location: string;
}

const VERSIONS_KEY = 'empleo_cv_studio_versions_v1';

export const getSavedVersions = (): SavedStudioVersion[] => {
  try {
    return JSON.parse(localStorage.getItem(VERSIONS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveVersions = (versions: SavedStudioVersion[]): void => {
  localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
};

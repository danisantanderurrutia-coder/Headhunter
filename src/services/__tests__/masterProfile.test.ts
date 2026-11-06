import { describe, it, expect } from 'vitest';
import { initialProfile } from '../sampleData';
import { generateMasterProfileMarkdown } from '../../utils/masterProfileMarkdown';
import { auditProfile } from '../cvStudio';

describe('MasterProfile & Expediente Maestro Consolidado', () => {
  it('contiene los datos canónicos verificados sin alucinaciones', () => {
    expect(initialProfile.fullName).toBe('DANIEL SEBASTIÁN SANTANDER URRUTIA');
    expect(initialProfile.email).toBe('danisantander.urrutia@gmail.com');
    expect(initialProfile.portfolio).toBe('https://danisantanderurrutia-coder.github.io/portafolio/');
    expect(initialProfile.linkedin).toBe('https://www.linkedin.com/in/santanderurrutia/');
    expect(initialProfile.github).toBe('https://github.com/danisantanderurrutia-coder');
  });

  it('integra el consolidado de las 6 experiencias profesionales sin duplicados', () => {
    expect(initialProfile.experiences.length).toBe(6);
    const expIds = initialProfile.experiences.map((e) => e.id);
    expect(expIds).toContain('exp-cau-kiel');
    expect(expIds).toContain('exp-uchile-geophysics');
    expect(expIds).toContain('exp-advocacy-policy');
    expect(expIds).toContain('exp-biomass-epn');
    expect(expIds).toContain('exp-apruebo-rural');
    expect(expIds).toContain('exp-primera-linea-prensa');
  });

  it('las titulaciones universitarias contienen exclusivamente los 3 títulos oficiales', () => {
    expect(initialProfile.education.length).toBe(3);
    const degrees = initialProfile.education.map((e) => e.institution).join(' ');
    expect(degrees).toContain('Kiel');
    expect(degrees).toContain('Poznań');
    expect(degrees).toContain('Chile');
  });

  it('los cursos y certificaciones de posgrado contienen 8 acreditaciones no repetidas', () => {
    expect(initialProfile.otherCourses?.length).toBe(8);
    const courses = initialProfile.otherCourses?.join(' ') || '';
    expect(courses).toContain('WSL');
    expect(courses).toContain('Dresden');
    expect(courses).toContain('DEAL');
    expect(courses).toContain('EPAC');
  });

  it('integra el consolidado de publicaciones sin redundancias', () => {
    expect(initialProfile.publications?.length).toBe(8);
    const pubTitles = initialProfile.publications?.map((p) => p.title).join(' ');
    expect(pubTitles).toContain('Spotlight on Burning Biomass');
    expect(pubTitles).toContain('Humedales bajo fuego');
    expect(pubTitles).toContain('agricultura orgánica');
    expect(pubTitles).toContain('Ser libres al borde del abismo');
  });

  it('las conferencias internacionales incluyen 4 cumbres multilaterales', () => {
    expect(initialProfile.conferences?.length).toBe(4);
    const events = initialProfile.conferences?.map((c) => `${c.event} ${c.location}`).join(' ');
    expect(events).toContain('ENJUST');
    expect(events).toContain('Degrowth');
    expect(events).toContain('Bogotá');
    expect(events).toContain('Costa Rica');
  });

  it('los proyectos tecnológicos agrupan exclusivamente los 4 gemelos digitales sin duplicar campañas de experiencias', () => {
    expect(initialProfile.keyProjects?.length).toBe(4);
    const projIds = initialProfile.keyProjects?.map((p) => p.id);
    expect(projIds).toContain('proj-agritwin');
    expect(projIds).toContain('proj-wetland-monitor');
    expect(projIds).toContain('proj-rewilding-suite');
    expect(projIds).toContain('proj-smart-food-parks');
    // Asegurar que campañas de comunicación (Apruebo Rural, Primera Línea) viven en experiences y no como proyectos
    expect(projIds).not.toContain('proj-apruebo-rural');
    expect(projIds).not.toContain('proj-primera-linea');
  });

  it('no existe duplicación cruzada entre educación formal y cursos de permacultura', () => {
    const eduIds = initialProfile.education.map((e) => e.id);
    expect(eduIds).not.toContain('edu-permaculture-epac');
    expect(eduIds).not.toContain('edu-msc-kiel-amu');
    expect(initialProfile.education.length).toBe(3);

    // Permacultura vive estrictamente como certificación en otherCourses
    const permacultureInCourses = initialProfile.otherCourses?.some((c) => c.includes('Permaculture Designer'));
    expect(permacultureInCourses).toBe(true);
  });

  it('el banco de logros contiene 8 hitos verificados con métricas específicas sin redundancia textual', () => {
    expect(initialProfile.achievementsBank.length).toBe(8);
    const titles = initialProfile.achievementsBank.map((a) => a.title);
    expect(new Set(titles).size).toBe(8);
    // Cada logro tiene métricas no vacías y verificadas
    initialProfile.achievementsBank.forEach((ach) => {
      expect(ach.metrics).toBeTruthy();
      expect(ach.isVerified).toBe(true);
    });
  });

  it('el generador Markdown compila un dossier completo con todas las secciones', () => {
    const md = generateMasterProfileMarkdown(initialProfile);
    expect(md).toContain('# EXPEDIENTE MAESTRO // DANIEL SEBASTIÁN SANTANDER URRUTIA');
    expect(md).toContain('## 1. CONTACTO Y ENLACES CANÓNICOS VERIFICADOS');
    expect(md).toContain('## 2. RESUMEN EJECUTIVO');
    expect(md).toContain('## 3. FORMACIÓN ACADÉMICA Y TITULACIONES UNIVERSITARIAS');
    expect(md).toContain('## 4. CERTIFICACIONES INTERNACIONALES Y ESTUDIOS DE POSGRADO');
    expect(md).toContain('## 5. EXPERIENCIA PROFESIONAL VERIFICADA');
    expect(md).toContain('## 6. PUBLICACIONES TÉCNICAS, PRENSA Y ENSAYOS');
    expect(md).toContain('## 7. CONFERENCIAS INTERNACIONALES Y TESTIMONIOS OFICIALES');
    expect(md).toContain('## 8. GEMELOS DIGITALES Y PROYECTOS DE INNOVACIÓN');
    expect(md).toContain('## 9. BANCO DE LOGROS DE ALTO IMPACTO');
    expect(md).toContain('## 10. COMPETENCIAS TÉCNICAS E IDIOMAS');
  });

  it('auditProfile no detecta discrepancias de enlaces ni fechas con el portafolio', () => {
    const issues = auditProfile(initialProfile);
    const linkIssues = issues.filter((i) => i.id.startsWith('link-'));
    expect(linkIssues.length).toBe(0);
    const uchileIssue = issues.find((i) => i.id === 'edu-uchile-start');
    expect(uchileIssue).toBeUndefined();
  });
});

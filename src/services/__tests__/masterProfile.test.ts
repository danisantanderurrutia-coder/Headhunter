import { describe, it, expect } from 'vitest';
import { initialProfile } from '../sampleData';
import { generateMasterProfileMarkdown } from '../../utils/masterProfileMarkdown';
import { auditProfile } from '../cvStudio';

describe('MasterProfile & Expediente Maestro Verification', () => {
  it('contiene los datos canónicos verificados sin alucinaciones', () => {
    expect(initialProfile.fullName).toBe('DANIEL SEBASTIÁN SANTANDER URRUTIA');
    expect(initialProfile.email).toBe('danisantander.urrutia@gmail.com');
    expect(initialProfile.portfolio).toBe('https://danisantanderurrutia-coder.github.io/portafolio/');
    expect(initialProfile.linkedin).toBe('https://www.linkedin.com/in/santanderurrutia/');
    expect(initialProfile.github).toBe('https://github.com/danisantanderurrutia-coder');
  });

  it('integra la totalidad de las 9 experiencias laborales verificadas', () => {
    expect(initialProfile.experiences.length).toBe(9);
    const expIds = initialProfile.experiences.map((e) => e.id);
    expect(expIds).toContain('exp-cau-kiel');
    expect(expIds).toContain('exp-uchile-geophysics');
    expect(expIds).toContain('exp-advocacy-policy');
    expect(expIds).toContain('exp-biomass-epn');
    expect(expIds).toContain('exp-software-digital-twins');
    expect(expIds).toContain('exp-apruebo-rural');
    expect(expIds).toContain('exp-primera-linea-prensa');
    expect(expIds).toContain('exp-crisis-response-maule');
    expect(expIds).toContain('exp-ong-raiz-ecoaccion');
  });

  it('integra las 10 publicaciones, policy briefs e investigaciones reales', () => {
    expect(initialProfile.publications?.length).toBe(10);
    const pubTitles = initialProfile.publications?.map((p) => p.title).join(' ');
    expect(pubTitles).toContain('Spotlight on Burning Biomass');
    expect(pubTitles).toContain('Humedales bajo fuego');
    expect(pubTitles).toContain('agricultura orgánica');
    expect(pubTitles).toContain('Ser libres al borde del abismo');
  });

  it('integra las 5 conferencias internacionales y comparecencia parlamentaria', () => {
    expect(initialProfile.conferences?.length).toBe(5);
    const events = initialProfile.conferences?.map((c) => c.event).join(' ');
    expect(events).toContain('ENJUST');
    expect(events).toContain('Degrowth');
    expect(events).toContain('Cámara de Diputadas/os');
  });

  it('integra los gemelos digitales y software científico verificado', () => {
    expect(initialProfile.keyProjects?.length).toBe(6);
    const projIds = initialProfile.keyProjects?.map((p) => p.id);
    expect(projIds).toContain('proj-agritwin');
    expect(projIds).toContain('proj-wetland-monitor');
    expect(projIds).toContain('proj-rewilding-suite');
    expect(projIds).toContain('proj-smart-food-parks');
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

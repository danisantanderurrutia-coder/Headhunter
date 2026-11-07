import { describe, expect, it } from 'vitest';
import {
  auditTextForAiCliches,
  buildCoverLetter,
  buildDefaultScientificDraft,
  generateAntiAiPrompt,
  renderCoverLetterHtml
} from '../coverLetterStudio';

describe('coverLetterStudio · Anti-AI Audit & Clichés', () => {
  it('detecta frases cliché de IA prohibidas', () => {
    const badSample = 'I am thrilled to apply and eager to delve into this beacon of innovation that aligns seamlessly with my profile. In conclusion, I am passionate about carbon.';
    const result = auditTextForAiCliches(badSample);
    expect(result.passed).toBe(false);
    expect(result.clicheCount).toBeGreaterThan(3);
    expect(result.detectedCliches).toContain('thrilled to');
    expect(result.detectedCliches).toContain('delve into');
    expect(result.detectedCliches).toContain('beacon of');
    expect(result.detectedCliches).toContain('aligns seamlessly');
    expect(result.detectedCliches).toContain('in conclusion');
    expect(result.detectedCliches).toContain('passionate about');
  });

  it('los borradores científicos en ES, EN y DE tienen 0 clichés de IA', () => {
    (['es', 'en', 'de'] as const).forEach((lang) => {
      const draft = buildDefaultScientificDraft(lang).join('\n\n');
      const audit = auditTextForAiCliches(draft);
      expect(audit.clicheCount).toBe(0);
      expect(audit.detectedCliches).toEqual([]);
      expect(audit.hasMethodology).toBe(true);
      expect(audit.hasMassBalancePerspective).toBe(true);
      expect(audit.passed).toBe(true);
    });
  });

  it('los borradores incluyen las metodologías verificadas (SEV, Eddy Covariance, R)', () => {
    const es = buildDefaultScientificDraft('es').join('\n\n').toLowerCase();
    expect(es).toContain('sev');
    expect(es).toContain('resistividad');
    expect(es).toContain('eddy covariance');
    expect(es).toContain('r');
    expect(es).toContain('kiel');
    expect(es).toContain('wallener au');
  });
});

describe('coverLetterStudio · buildCoverLetter & Render', () => {
  it('ensambla una carta completa con encabezado institucional y fecha', () => {
    const letter = buildCoverLetter({
      lang: 'en',
      offer: {
        id: 'off-1',
        title: 'Peatland Biogeochemist',
        company: 'Thünen Institute',
        location: 'Braunschweig, Germany',
        rawDescription: 'Field eddy covariance and GHG measurements',
        requirements: ['Eddy Covariance', 'R'],
        responsibilities: []
      }
    });

    expect(letter.recipient.org).toBe('Thünen Institute');
    expect(letter.referenceSubject).toContain('Peatland Biogeochemist');
    expect(letter.audit.passed).toBe(true);
    expect(letter.fullMarkdown).toContain('Daniel Santander Urrutia');
    expect(letter.fullMarkdown).toContain('Thünen Institute');
  });

  it('renderiza HTML con estructura A4 y escapado correcto', () => {
    const letter = buildCoverLetter({
      lang: 'es',
      recipientName: '<script>alert(1)</script>'
    });
    const html = renderCoverLetterHtml(letter);
    expect(html).toContain('class="letter-page"');
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('genera el prompt editorial anti-IA con las 4 reglas críticas del usuario', () => {
    const prompt = generateAntiAiPrompt({
      title: 'Postdoc in Soil Hydrology',
      company: 'CAU Kiel',
      rawDescription: 'Soil precompression and water dynamics'
    });

    expect(prompt).toContain('Reglas críticas de redacción (Anti-AI Clichés)');
    expect(prompt).toContain('PROHIBIDO usar fórmulas genéricas de IA');
    expect(prompt).toContain('balances de masa');
    expect(prompt).toContain('SEV');
    expect(prompt).toContain('Eddy Covariance');
  });

  it('ensambla un Anschreiben en alemán para el UBA KI-Lab con los 3 gemelos digitales y 0 clichés', () => {
    const ubaLetter = buildCoverLetter({
      lang: 'de',
      offer: {
        id: 'job-uba-ki-product-owner-1499096',
        title: 'Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (KI-Lab)',
        company: 'Umweltbundesamt (UBA)',
        location: 'Leipzig, Deutschland',
        rawDescription: 'KI-Lab Kennziffer 8/LB/26 Interamt ID 1499096'
      }
    });

    expect(ubaLetter.recipient.org).toContain('Umweltbundesamt');
    expect(ubaLetter.referenceSubject).toContain('Kennziffer 8/LB/26');
    expect(ubaLetter.referenceSubject).toContain('1499096');

    const text = ubaLetter.paragraphs.join('\n\n');
    expect(text).toContain('Wetland Monitor');
    expect(text).toContain('AgriTwin');
    expect(text).toContain('Rewilding Field Suite');
    expect(text).toContain('Eddy Covariance');

    // Anti-AI compliance
    expect(ubaLetter.audit.clicheCount).toBe(0);
    expect(ubaLetter.audit.detectedCliches).toEqual([]);
    expect(ubaLetter.audit.passed).toBe(true);
  });

  it('detecta reiteraciones mecánicas de palabras e iniciadores monótonos', () => {
    const textWithRepetitions = `
      I am applying for this role because coordination is central.
      I have led the coordination across multiple countries with high coordination impact.
      I have also managed coordination meetings and daily tasks.
      Cabe destacar que coordination is vital.
    `;
    const audit = auditTextForAiCliches(textWithRepetitions);

    expect(audit.mechanicalRepetitions.length).toBeGreaterThan(0);
    expect(audit.mechanicalRepetitions[0].word).toBe('coordination');
    expect(audit.mechanicalRepetitions[0].count).toBeGreaterThanOrEqual(4);

    expect(audit.sentenceStarterRepetitions.length).toBeGreaterThan(0);
    expect(audit.sentenceStarterRepetitions[0].starter).toContain('I');

    expect(audit.bureaucraticFillers).toContain('cabe destacar que');
    expect(audit.checklist.some((c) => c.id === 'chk-word-rep')).toBe(true);
    expect(audit.checklist.some((c) => c.id === 'chk-starters')).toBe(true);
  });

  it('el prompt exportable incluye el reporte dinámico del checklist y diagnósticos', () => {
    const prompt = generateAntiAiPrompt(
      { title: 'Hubs Coordinator', company: 'GARN' },
      'Sample letter text with Eddy Covariance and SEV.'
    );

    expect(prompt).toContain('DIAGNÓSTICO EN VIVO DE MI BORRADOR ACTUAL');
    expect(prompt).toContain('Checklist de Verificación Actual:');
    expect(prompt).toContain('RUPTURA DE REITERACIONES MECÁNICAS');
    expect(prompt).toContain('EL HILO CONDUCTOR ("THE GOLDEN THREAD")');
  });
});

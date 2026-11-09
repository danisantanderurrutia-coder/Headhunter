import { describe, it, expect } from 'vitest';
import { 
  auditDocumentDualLens, 
  auditHeadhunterLens, 
  auditWingmanLens,
  getSelectableCriteriaFromReport,
  generateGeminiReviewPrompt,
  CANONICAL_PORTFOLIO_WEAPONS 
} from '../dualAuditEngine';
import { THUENEN_TECHWORMS_DOSSIER } from '../jobWingmanService';
import type { JobOffer } from '../../types/offers';

describe('Dual-Lens Audit Engine (Headhunter & Wingman Criteria)', () => {
  const mockOffer: Partial<JobOffer> = {
    id: 'job-thuenen-techworms-369',
    company: 'Johann Heinrich von Thünen-Institut',
    title: 'Wissenschaftliche*r Mitarbeiter*in / Doktorand*in TechWorms',
    rawDescription: 'TechWorms Subsoil Carbon Sequestration RootBox Künstliche Makroporen RLD',
    requirements: ['R', 'RootBox', 'Makroporen', 'English C1', 'Fieldwork']
  };

  const highQualityLetterText = `
Daniel Santander Urrutia
Kiel, Germany | danisantander.urrutia@gmail.com | github.com/danielsantander

Sehr geehrter Herr Prof. Dr. Don,

ich bewerbe mich auf die Promotionsstelle im Projekt TechWorms am Thünen-Institut für Agrarklimaschutz. Als Umweltgeophysiker (Universidad de Chile, Abschluss mit Auszeichnung; Doppel-M.Sc. an der CAU Kiel und AMU Poznań) betrachte ich die künstliche Drilosphäre nicht als rein agronomischen Raum, sondern als gekoppeltes physikalisches System mit ausgeprägter hydraulischer Anisotropie. Mein Schwerpunkt liegt auf der quantitativen Modellierung von Transportprozessen in porösen Medien und der signaltechnischen Bildanalyse unter R und Python.

Die methodische Hauptherausforderung von TechWorms – die in-situ Validierung von Wurzelwachstum im RootBox-System unter UV-Fluoreszenz und die quantitative Trennung von Bypass-Flüssen und Matrixdiffusion – erfordert eine robuste physikalische Modellierung. Im Maule-Becken habe ich mittels geoelektrischer Schlumberger-Tiefensondierungen (VES) subsurface Widerstandsanomalien und Grundwasserabsenkungen unter forstlichen Monokulturen aufgelöst. Diese Inversionserfahrung ermöglicht es mir, Bildartefakte in der RootBox und Signalrauschen im Submillimeterbereich präzise zu filtern.

Darüber hinaus habe ich in meinem Projekt AgriTwin einen digitalen Zwilling entwickelt, der kontinuierliche IoT-Bodenfeuchte-Sensorik mit Sentinel-2 Satellitendaten (NDVI/NDRE) koppelt. Auf der wiedervernässten Moorfläche Wallener Au quantifiziere ich Treibhausgasflüsse mittels Eddy Covariance und geschlossenen Hauben, gekoppelt mit der mechanischen Vorbelastungsspannung des Bodens (σp = 62,4 kPa) über reproduzierbare R-Pipelines. Diese Feldpraxis schützt vor spekulativen Annahmen.

Als Absolvent einer deutschen Hochschule verfüge ich über volle vertragliche Verfügbarkeit unter §20 AufenthG, verhandlungssicheres Englisch (C1) und praxiserprobtes Deutsch (B1-B2). Ich freue mich auf den fachlichen Austausch mit Ihnen.

Mit besten Grüßen,
Daniel Santander Urrutia
  `;

  it('contains verified canonical portfolio weapons', () => {
    expect(CANONICAL_PORTFOLIO_WEAPONS.length).toBeGreaterThanOrEqual(6);
    const agritwin = CANONICAL_PORTFOLIO_WEAPONS.find(w => w.id === 'w-agritwin');
    const wetland = CANONICAL_PORTFOLIO_WEAPONS.find(w => w.id === 'w-wetland-monitor');
    const wallener = CANONICAL_PORTFOLIO_WEAPONS.find(w => w.id === 'w-wallener-au-stress');
    expect(agritwin).toBeDefined();
    expect(wetland).toBeDefined();
    expect(wallener).toBeDefined();
  });

  it('correctly audits Headhunter compliance on a high quality application', () => {
    const hhResult = auditHeadhunterLens(highQualityLetterText, mockOffer as JobOffer, 'cover_letter');
    
    expect(hhResult.score).toBeGreaterThanOrEqual(80);
    expect(hhResult.passed).toBe(true);
    expect(hhResult.readabilityMetrics.quantifiedMetricsCount).toBeGreaterThan(0);
    
    // Degree check
    const degreeCheck = hhResult.complianceChecks.find(c => c.id === 'hh-degree');
    expect(degreeCheck?.status).toBe('pass');

    // Visa check (§20 AufenthG)
    const visaCheck = hhResult.complianceChecks.find(c => c.id === 'hh-work-auth');
    expect(visaCheck?.status).toBe('pass');

    // Languages check (C1 English, B1-B2 German)
    const langCheck = hhResult.complianceChecks.find(c => c.id === 'hh-languages');
    expect(langCheck?.status).toBe('pass');
  });

  it('flags warning when visa/work permit mention is missing for German positions', () => {
    const textWithoutVisa = highQualityLetterText.replace('§20 AufenthG', '');
    const hhResult = auditHeadhunterLens(textWithoutVisa, mockOffer as JobOffer, 'cover_letter');
    
    const visaCheck = hhResult.complianceChecks.find(c => c.id === 'hh-work-auth');
    expect(visaCheck?.status).toBe('warning');
    expect(visaCheck?.fixRecommendation).toBeDefined();
  });

  it('fails Headhunter degree check if hallucinated "distinción máxima" is detected', () => {
    const textWithMaxima = highQualityLetterText.replace('Abschluss mit Auszeichnung', 'Abschluss mit höchster Auszeichnung (distinción máxima)');
    const hhResult = auditHeadhunterLens(textWithMaxima, mockOffer as JobOffer, 'cover_letter');
    
    const degreeCheck = hhResult.complianceChecks.find(c => c.id === 'hh-degree');
    expect(degreeCheck?.status).toBe('fail');
    expect(degreeCheck?.detail).toContain('distinción máxima');
  });

  it('correctly audits Wingman criteria (PI alignment, asymmetry, zero-servility, weapon activation)', () => {
    const wmResult = auditWingmanLens(highQualityLetterText, mockOffer as JobOffer, THUENEN_TECHWORMS_DOSSIER);
    
    expect(wmResult.score).toBeGreaterThanOrEqual(80);
    expect(wmResult.passed).toBe(true);
    expect(wmResult.zeroServilityAudit.servilityScore).toBe(100);
    expect(wmResult.competitiveAsymmetry.asymmetryRating).toBe('dominant');
    
    // Active weapons detected
    const activeNames = wmResult.portfolioWeaponActivation.activeWeapons.map(w => w.name);
    expect(activeNames.some(n => n.includes('AgriTwin'))).toBe(true);
    expect(activeNames.some(n => n.includes('Wallener Au'))).toBe(true);
    expect(activeNames.some(n => n.includes('Schlumberger'))).toBe(true);
  });

  it('detects omitted weapons when key portfolio assets are not mentioned', () => {
    // Strip out AgriTwin and Wallener Au from the text
    const textWithoutWeapons = `
Daniel Santander Urrutia
Kiel, Germany | danisantander.urrutia@gmail.com | github.com/danielsantander

Sehr geehrter Herr Prof. Dr. Don,

ich bewerbe mich auf die Promotionsstelle im Projekt TechWorms am Thünen-Institut für Agrarklimaschutz. Als Geofísico de la Universidad de Chile con distinción, cuento con experiencia en R y Python para suelos agrícolas.

Mit besten Grüßen,
Daniel Santander Urrutia
§20 AufenthG | English C1 | Deutsch B1
    `;
    const wmResult = auditWingmanLens(textWithoutWeapons, mockOffer as JobOffer, THUENEN_TECHWORMS_DOSSIER);
    
    expect(wmResult.portfolioWeaponActivation.omittedWeapons.length).toBeGreaterThan(0);
    const omittedNames = wmResult.portfolioWeaponActivation.omittedWeapons.map(w => w.name);
    expect(omittedNames.some(n => n.includes('AgriTwin'))).toBe(true);
    expect(wmResult.portfolioWeaponActivation.omittedWeapons[0].suggestedInjection).toBeDefined();
  });

  it('runs complete dual-lens audit and computes overall weighted verdict', () => {
    const report = auditDocumentDualLens({
      documentType: 'cover_letter',
      text: highQualityLetterText,
      offer: mockOffer as JobOffer,
      dossier: THUENEN_TECHWORMS_DOSSIER
    });

    expect(report.overallScore).toBeGreaterThanOrEqual(80);
    expect(report.headhunter.score).toBeGreaterThan(70);
    expect(report.wingman.score).toBeGreaterThan(70);
    expect(report.executiveVerdict).toContain('SOBERANO');
    expect(report.archetype).toBeDefined();
    expect(report.archetype.id).toBe('DACH_RESEARCH');
  });

  it('extracts selectable criteria and formats a rigorous prompt for Gemini API', () => {
    const report = auditDocumentDualLens({
      documentType: 'cover_letter',
      text: highQualityLetterText,
      offer: mockOffer as JobOffer,
      dossier: THUENEN_TECHWORMS_DOSSIER
    });

    const criteria = getSelectableCriteriaFromReport(report);
    expect(criteria.length).toBeGreaterThan(5);
    expect(criteria.some((c) => c.id === 'hh-degree')).toBe(true);
    expect(criteria.some((c) => c.id === 'wm-asymmetry')).toBe(true);
    expect(criteria.some((c) => c.id === 'wm-zero-servility')).toBe(true);

    const prompt = generateGeminiReviewPrompt({
      documentType: 'cover_letter',
      documentText: highQualityLetterText,
      offer: mockOffer as JobOffer,
      report,
      selectedCriteriaIds: ['hh-degree', 'wm-asymmetry']
    });

    expect(prompt).toContain('Actúa como un Revisor de Selección Senior y Auditor Científico de Alto Nivel');
    expect(prompt).toContain('Wissenschaftliche*r Mitarbeiter*in / Doktorand*in TechWorms');
    expect(prompt).toContain('Johann Heinrich von Thünen-Institut');
    expect(prompt).toContain('CRITERIOS ESPECÍFICOS MARCADOS PARA EVALUAR');
    expect(prompt).toContain('Titulación Oficial y Equivalencia Académica');
    expect(prompt).toContain('Asimetría Competitiva');
    expect(prompt).toContain('PROPUESTAS DE MEJORA Y REDACCIÓN CONCRETA (ANTES vs. DESPUÉS)');
    expect(prompt).toContain('Daniel Santander: Geofísico de la Universidad de Chile');
    expect(prompt).toContain('PROHIBIDO usar fórmulas clichés de IA');
  });
});

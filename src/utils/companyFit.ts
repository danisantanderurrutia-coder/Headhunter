import type { CompanyDossier } from '../types/companies';

export interface CompanyFitPillar {
  pillar: string;
  badge: string;
  evidence: string;
}

export interface CompanyFitAnalysis {
  score: number;
  grade: 'EXCEPTIONAL' | 'VERY_HIGH' | 'HIGH' | 'SOLID';
  matchedPillars: CompanyFitPillar[];
  winningAngle: string;
  keySkills: string[];
}

export const analyzeCompanyFit = (comp: CompanyDossier): CompanyFitAnalysis => {
  const corpus = `${comp.name} ${comp.sector} ${comp.description} ${(comp.keyProjects || []).join(' ')} ${(comp.techStack || []).join(' ')} ${comp.headquarters}`.toLowerCase();
  
  const matchedPillars: CompanyFitPillar[] = [];
  const keySkills: string[] = [];

  // Pillar 1: Eddy Covariance, Turberas, Física de Suelos & MRV de Carbono
  const p1Keywords = [
    'eddy covariance', 'turbera', 'turberas', 'peatland', 'peatlands', 'suelo', 'suelos', 
    'soil', 'humedal', 'humedales', 'wetland', 'flujo', 'flujos', 'flux', 'gei', 'ghg', 
    'metano', 'methane', 'co2', 'ch4', 'carbon', 'carbono', 'mrv', 'carbon farming', 
    'retención hídrica', 'porosidad', 'fluxnet', 'icos', 'hydrus', 'lisímetro'
  ];
  const p1Matched = p1Keywords.filter(k => corpus.includes(k));
  if (p1Matched.length > 0) {
    matchedPillars.push({
      pillar: 'Dinámica de GEI, Eddy Covariance & Suelos',
      badge: '🌿 Turberas & MRV',
      evidence: 'Coincide con tu investigación de 2 años en Wallener Au (CAU Kiel) midiendo balances continuos de CO2/CH4 con covarianza de torbellinos y física edáfica.'
    });
    keySkills.push('Eddy Covariance', 'Cámaras de Flujo', 'Física de Suelos');
  }

  // Pillar 2: Hidrogeofísica, SEV, Gravimetría & Cuencas / Riesgo de Incendios
  const p2Keywords = [
    'geofísica', 'geofisica', 'geophysics', 'gravimetr', 'sondeos eléctricos', 'sev', 
    'resistividad', 'ert', 'inversión', 'cuenca', 'cuencas', 'catchment', 'incendio', 
    'incendios', 'wildfire', 'fire', 'sequía', 'sequia', 'drought', 'freático', 'freatico', 
    'hidrogeolog', 'acuífero', 'salinidad'
  ];
  const p2Matched = p2Keywords.filter(k => corpus.includes(k));
  if (p2Matched.length > 0) {
    matchedPillars.push({
      pillar: 'Hidrogeofísica & Riesgo de Megaincendios',
      badge: '⚡ Geofísica & Cuencas',
      evidence: 'Encaje con tu titulación de Geofísico Con Distinción (U. de Chile), tus campañas de SEV/gravimetría y tu comparecencia parlamentaria en incendios.'
    });
    keySkills.push('Sondeos Eléctricos (SEV)', 'Gravimetría', 'Modelación de Incendios');
  }

  // Pillar 3: Teledetección, Gemelos Digitales & IA del Clima
  const p3Keywords = [
    'gemelo digital', 'gemelos digitales', 'digital twin', 'qgis', 'gis', 'remote sensing', 
    'teledetección', 'teledeteccion', 'sentinel', 'copernicus', 'radar', 'sar', 'earth observation', 
    'satélit', 'satelit', 'three.js', 'python', 'modflow', 'hydrological modeling'
  ];
  const p3Matched = p3Keywords.filter(k => corpus.includes(k));
  if (p3Matched.length > 0) {
    matchedPillars.push({
      pillar: 'Teledetección, Gemelos Digitales & Python',
      badge: '🛰️ Teledetección & IA',
      evidence: 'Alineado con tus desarrollos de software científico 3D (Wetland Monitor, AgriTwin) y procesamiento de series temporales de satélite en Python.'
    });
    keySkills.push('Python', 'QGIS', 'Gemelos Digitales (Three.js)');
  }

  // Pillar 4: Políticas Ambientales, Directivas Europeas & Gobernanza
  const p4Keywords = [
    'política', 'politica', 'policy', 'directiva', 'marco del agua', 'restoration law', 
    'gobernanza', 'governance', 'parlamento', 'unccd', 'unep', 'multilateral', 'stakeholder', 
    'regulación', 'legislativa', 'incidencia'
  ];
  const p4Matched = p4Keywords.filter(k => corpus.includes(k));
  if (p4Matched.length > 0) {
    matchedPillars.push({
      pillar: 'Gobernanza Territorial & Directivas UE',
      badge: '🌍 Políticas & Incidencia',
      evidence: 'Respaldado por tu doble MSc europeo (Kiel/Poznań), testimonio pericial ante la Cámara de Diputadas y Diputados y dirección de campañas científicas.'
    });
    keySkills.push('Directivas UE', 'Incidencia Parlamentaria', 'Gobernanza de Cuencas');
  }

  // Base score calculation
  let score = 70;
  score += Math.min(18, matchedPillars.length * 5);
  score += Math.min(8, (p1Matched.length + p2Matched.length + p3Matched.length + p4Matched.length) * 0.8);

  // Geographic convenience bonus
  const hq = comp.headquarters.toLowerCase();
  const quads = comp.quadrants || [];
  if (hq.includes('bilbao') || hq.includes('bizkaia') || hq.includes('euskadi') || quads.includes('EUSKADI')) {
    score += 8; // Top residency preference
  } else if (hq.includes('alemania') || hq.includes('germany') || hq.includes('kiel') || quads.includes('DACH')) {
    score += 6; // Prior education and language track
  } else if (hq.includes('países bajos') || hq.includes('netherlands') || hq.includes('austria') || hq.includes('suiza')) {
    score += 5; // Elite wage research zones
  }

  // Cap score between 72 and 99
  const finalScore = Math.min(99, Math.max(72, Math.round(score)));

  let grade: CompanyFitAnalysis['grade'] = 'SOLID';
  if (finalScore >= 94) grade = 'EXCEPTIONAL';
  else if (finalScore >= 88) grade = 'VERY_HIGH';
  else if (finalScore >= 80) grade = 'HIGH';

  // Generate Tailored Winning Angle narrative
  let winningAngle = '';
  if (p1Matched.length > 0 && p2Matched.length > 0) {
    winningAngle = `Presenta tu perfil bivalente único: la solidez biofísica de 2 años en Alemania midiendo balances de CO2/CH4 con Eddy Covariance en Wallener Au, combinada con tu titulación de Geofísico Con Distinción en prospección de aguas subterráneas y peritaje oficial en cuencas.`;
  } else if (p1Matched.length > 0) {
    winningAngle = `Enfócate en tu experiencia operativa directa con torres de covarianza de torbellinos (Eddy Covariance) y cámaras de flujo cerrado en turberas templadas de Schleswig-Holstein, respaldado por tu gemelo digital "Wetland Monitor" para visualización de balances de carbono.`;
  } else if (p2Matched.length > 0) {
    winningAngle = `Destaca tu memoria de título aprobada Con Distinción en Geofísica en la Universidad de Chile (SEV y gravimetría en la Cuenca del Maule) y tu peritaje técnico oficial ante comisiones parlamentarias sobre modelación de causalidad territorial de megaincendios.`;
  } else if (p3Matched.length > 0) {
    winningAngle = `Posiciónate como modelador científico cuantitativo: manejo avanzado de Python, teledetección satelital (Sentinel/Copernicus) y desarrollo de gemelos digitales interactivos en 3D que traducen datos biofísicos complejos a herramientas visuales de decisión.`;
  } else if (p4Matched.length > 0) {
    winningAngle = `Apalanca tu doble maestría europea en gestión y protección ambiental (Alemania y Polonia), tu dominio de las directivas europeas de agua/restauración y tu trayectoria articulando evidencia técnica ante parlamentos y audiencias masivas (+700k).`;
  } else {
    winningAngle = `Apalanca tu perfil cuantitativo MINT europeo (Doble Máster MSc en Alemania y Polonia, Geofísica U. de Chile) y tu versatilidad para liderar proyectos interdisciplinares de impacto ambiental y transición climática.`;
  }

  return {
    score: finalScore,
    grade,
    matchedPillars,
    winningAngle,
    keySkills: Array.from(new Set(keySkills))
  };
};

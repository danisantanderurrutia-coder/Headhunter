export interface DailyPortal {
  id: string;
  name: string;
  quadrant: 'DACH' | 'EUSKADI' | 'EUROPA' | 'GLOBAL_REMOTE';
  quadrantLabel: string;
  category: 'Científico / I+D' | 'General / Profesional' | 'Ambiental / Clima' | 'Gobernanza / Público';
  directUrl: string;
  recommendedFrequency: 'Diario' | '2-3 veces/semana' | 'Semanal';
  suggestedKeywords: string[];
  description: string;
  iconName: 'Linkedin' | 'Briefcase' | 'Compass' | 'Leaf' | 'GraduationCap' | 'Globe' | 'Search' | 'Building2' | 'CloudRain' | 'Landmark';
}

export const DAILY_PORTALS: DailyPortal[] = [
  // -------------------------------------------------------------
  // CUADRANTE DACH (Alemania, Austria, Suiza)
  // -------------------------------------------------------------
  {
    id: 'portal-xing-dach',
    name: 'XING Jobs (DACH)',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / DACH',
    category: 'General / Profesional',
    directUrl: 'https://www.xing.com/jobs/search?keywords=Klimaschutz%20Bodenkunde%20Geophysik',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Klimaschutz', 'Bodenkunde', 'Geophysik', 'Moor', 'Eddy Covariance'],
    description: 'La principal red profesional en Alemania y Suiza. Clave para conectar con institutos y consultoras alemanas.',
    iconName: 'Briefcase'
  },
  {
    id: 'portal-greenjobs-de',
    name: 'GreenJobs.de (Alemania)',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / DACH',
    category: 'Ambiental / Clima',
    directUrl: 'https://www.greenjobs.de/angebote/index.html',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Boden', 'Klimafolgen', 'Hydrologie', 'Moorrenaturierung'],
    description: 'Portal de referencia especializado en medio ambiente, energías renovables, consultoría ecológica y suelos en Alemania.',
    iconName: 'Leaf'
  },
  {
    id: 'portal-stepstone-de',
    name: 'StepStone Deutschland',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / DACH',
    category: 'General / Profesional',
    directUrl: 'https://www.stepstone.de/work/geophysik-environmental-science',
    recommendedFrequency: '2-3 veces/semana',
    suggestedKeywords: ['Geophysik', 'Environmental Scientist', 'GIS Analyst', 'Klimaforschung'],
    description: 'Bolsa de empleo líder para posiciones técnicas en la industria, ingenierías ambientales y grandes entidades en Alemania.',
    iconName: 'Compass'
  },
  {
    id: 'portal-bund-de',
    name: 'Bund.de (Empleo Público Federal)',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / DACH',
    category: 'Gobernanza / Público',
    directUrl: 'https://service.bund.de/Content/DE/Stellen/Suche/Formular.html?nn=4642&cl2Categories_Bereich=umwelt-klima',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['Thünen', 'Umweltbundesamt', 'BfN', 'DWD', 'Wissenschaftliche Mitarbeiter'],
    description: 'Convocatorias oficiales de institutos federales alemanes (Thünen-Institut, UBA, Bundesamt für Naturschutz, DWD).',
    iconName: 'Landmark'
  },
  {
    id: 'portal-dfg-gepris',
    name: 'DFG GEPRIS & Research Explorer (Alemania)',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://gepris.dfg.de/gepris/OCTOPUS?context=projekt&task=findKompakt&keywords=peatland+OR+carbon+OR+geophysics',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['Peatlands', 'Eddy Covariance', 'Soil Carbon', 'Moor', 'Biogeochemistry', 'SFB', 'Graduiertenkolleg'],
    description: 'Sistema oficial de información de proyectos y PIs financiados por la DFG en universidades alemanas. Detecta cátedras con presupuesto activo para contratos TV-L E13.',
    iconName: 'GraduationCap'
  },

  // -------------------------------------------------------------
  // CUADRANTE EUSKADI / ESPAÑA
  // -------------------------------------------------------------
  {
    id: 'portal-infojobs-es',
    name: 'InfoJobs (Euskadi & España)',
    quadrant: 'EUSKADI',
    quadrantLabel: 'Euskadi / España',
    category: 'General / Profesional',
    directUrl: 'https://www.infojobs.net/jobsearch/search-results/list.xhtml?keyword=medio%20ambiente%20gis',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Medio Ambiente', 'GIS', 'Hidrología', 'Suelos Contaminados', 'Consultoría Ambiental'],
    description: 'Portal líder para vacantes en empresas de consultoría e ingeniería ambiental en Bizkaia, Gipuzkoa y España.',
    iconName: 'Building2'
  },
  {
    id: 'portal-tecnoempleo',
    name: 'Tecnoempleo (Tech & Datos)',
    quadrant: 'EUSKADI',
    quadrantLabel: 'Euskadi / España',
    category: 'General / Profesional',
    directUrl: 'https://www.tecnoempleo.com/ofertas-trabajo/?te=python+gis+data',
    recommendedFrequency: '2-3 veces/semana',
    suggestedKeywords: ['Python', 'GIS Data', 'Remote Sensing', 'Data Analyst'],
    description: 'Ofertas especializadas en desarrollo técnico, análisis de datos, Python y sistemas de información geográfica.',
    iconName: 'Search'
  },
  {
    id: 'portal-eit-food',
    name: 'EIT Food Careers (Bilbao Hub & Europa)',
    quadrant: 'EUSKADI',
    quadrantLabel: 'Euskadi / Innovación UE',
    category: 'Ambiental / Clima',
    directUrl: 'https://www.eitfood.eu/careers',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['Soil Health', 'Carbon Farming', 'Regenerative Agriculture', 'Innovation Manager', 'Bilbao'],
    description: 'Bolsa de vacantes de la sede para el Sur de Europa de EIT Food en el Parque Tecnológico de Bizkaia (Zamudio). Puestos en agricultura regenerativa, suelos y consorcios UE.',
    iconName: 'Leaf'
  },

  // -------------------------------------------------------------
  // CUADRANTE EUROPA & CIENCIA / I+D
  // -------------------------------------------------------------
  {
    id: 'portal-euraxess',
    name: 'EURAXESS (Comisión Europea)',
    quadrant: 'EUROPA',
    quadrantLabel: 'Europa / I+D',
    category: 'Científico / I+D',
    directUrl: 'https://euraxess.ec.europa.eu/jobs/search?keywords=geophysics%20climate%20peatland',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Geophysics', 'Peatlands', 'Eddy Covariance', 'Soil Carbon', 'MSCA'],
    description: 'Portal oficial de la Comisión Europea para investigadores. Publica plazas post-máster, doctorales, postdocs y consorcios.',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-academic-positions',
    name: 'Academic Positions (Europa & DACH)',
    quadrant: 'EUROPA',
    quadrantLabel: 'Europa / I+D',
    category: 'Científico / I+D',
    directUrl: 'https://academicpositions.com/find-jobs?keyword=environmental%20science%20geophysics',
    recommendedFrequency: '2-3 veces/semana',
    suggestedKeywords: ['Environmental Sciences', 'Earth Observation', 'Biogeochemistry', 'Helmholtz'],
    description: 'Bolsa académica referente para universidades del norte y centro de Europa (Alemania, Escandinavia, Países Bajos).',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-climate-kic',
    name: 'EIT Climate-KIC Careers & Opportunities',
    quadrant: 'EUROPA',
    quadrantLabel: 'Europa / Innovación Climática',
    category: 'Ambiental / Clima',
    directUrl: 'https://www.climate-kic.org/careers/',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['Climate Innovation', 'Systems Transformation', 'Nature-based Solutions', 'Carbon', 'Horizon Europe'],
    description: 'Portal oficial de vacantes y convocatorias de la mayor agencia de innovación climática de la UE (EIT). Ofertas en Ámsterdam, Berlín, Bruselas y España.',
    iconName: 'Leaf'
  },
  // -------------------------------------------------------------
  // CUADRANTE GLOBAL & REMOTO / CLIMA
  // -------------------------------------------------------------
  {
    id: 'portal-linkedin-global',
    name: 'LinkedIn Jobs (Radar Especializado)',
    quadrant: 'GLOBAL_REMOTE',
    quadrantLabel: 'Global & Remoto',
    category: 'General / Profesional',
    directUrl: 'https://www.linkedin.com/jobs/search/?keywords=Geophysicist%20OR%20%22Peatland%22%20OR%20%22Eddy%20Covariance%22%20OR%20%22Remote%20Sensing%22',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Geophysicist', 'Peatland', 'Eddy Covariance', 'Remote Sensing', 'Environmental Data'],
    description: 'Búsqueda directa con operadores booleanos adaptados a tu perfil transdisciplinario.',
    iconName: 'Linkedin'
  },
  {
    id: 'portal-climatebase',
    name: 'Climatebase (Impacto & Remoto)',
    quadrant: 'GLOBAL_REMOTE',
    quadrantLabel: 'Global & Remoto',
    category: 'Ambiental / Clima',
    directUrl: 'https://climatebase.org/jobs?q=geospatial%20carbon',
    recommendedFrequency: '2-3 veces/semana',
    suggestedKeywords: ['Geospatial', 'Carbon Accounting', 'Remote Sensing', 'Ecosystem Restoration'],
    description: 'Plataforma internacional de empresas y startups dedicadas a soluciones climáticas, teledetección y créditos de carbono.',
    iconName: 'CloudRain'
  },
  {
    id: 'portal-eurobrussels',
    name: 'EuroBrussels & UNjobs',
    quadrant: 'GLOBAL_REMOTE',
    quadrantLabel: 'Europa & Global',
    category: 'Gobernanza / Público',
    directUrl: 'https://www.eurobrussels.com/jobs/environment',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['Environmental Policy', 'Climate Governance', 'Just Transition', 'Water Framework Directive'],
    description: 'Puestos de gobernanza ambiental, asuntos europeos, ONGs internacionales y agencias de Naciones Unidas.',
    iconName: 'Globe'
  },
  {
    id: 'portal-icos-hub',
    name: 'ICOS ERIC Career Hub (Nórdicos & Europa)',
    quadrant: 'EUROPA',
    quadrantLabel: 'Nórdicos & Europa / ICOS',
    category: 'Científico / I+D',
    directUrl: 'https://www.icos-cp.eu/about/vacancies',
    recommendedFrequency: '2-3 veces/semana',
    suggestedKeywords: ['Eddy Covariance', 'GHG Flux', 'Peatlands', 'Atmospheric Station', 'Data Scientist'],
    description: 'Red paneuropea de observación de carbono. Estaciones de flujo de GEI y turberas en Finlandia, Suecia, Alemania y Países Bajos.',
    iconName: 'Leaf'
  },
  {
    id: 'portal-wur-wageningen',
    name: 'Wageningen UR (Países Bajos)',
    quadrant: 'EUROPA',
    quadrantLabel: 'Países Bajos & UK',
    category: 'Científico / I+D',
    directUrl: 'https://www.wur.nl/en/jobs-wur.htm',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['Soil Carbon', 'Peatlands', 'Biogeochemistry', 'Remote Sensing', 'MRV'],
    description: 'Referente mundial en suelos, humedales, dinámica de carbono edáfico y teledetección agroambiental.',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-reliefweb',
    name: 'ReliefWeb (ONU / Multilateral / GIZ)',
    quadrant: 'GLOBAL_REMOTE',
    quadrantLabel: 'Multilateral & Global',
    category: 'Gobernanza / Público',
    directUrl: 'https://reliefweb.int/jobs?search=climate%20disaster%20risk%20geospatial',
    recommendedFrequency: '2-3 veces/semana',
    suggestedKeywords: ['Disaster Risk', 'Watershed Management', 'Geospatial', 'Wildfire Prevention', 'GIZ'],
    description: 'Plataforma oficial de la ONU para mitigación del riesgo de desastres, cuencas, gobernanza hídrica y proyectos UE-LATAM.',
    iconName: 'Globe'
  },
  {
    id: 'portal-eo-gislounge',
    name: 'Earth Observation Jobs & GIS Lounge',
    quadrant: 'GLOBAL_REMOTE',
    quadrantLabel: 'Global & Remoto',
    category: 'Ambiental / Clima',
    directUrl: 'https://www.gislounge.com/jobs/',
    recommendedFrequency: '2-3 veces/semana',
    suggestedKeywords: ['Copernicus', 'Sentinel', 'Google Earth Engine', 'SAR', 'Thermal Infrared', 'Cat Modeling'],
    description: 'Portal de empleo técnico en teledetección satelital, Earth Observation (Copernicus/ESA/NASA) y geoinformática.',
    iconName: 'Compass'
  },
  {
    id: 'portal-energyweather-ai',
    name: 'Energy Weather & AI Lab (TU Delft / BFH)',
    quadrant: 'EUROPA',
    quadrantLabel: 'Europa & DACH / TU Delft - BFH',
    category: 'Científico / I+D',
    directUrl: 'https://www.energyweather.ai/vacancies',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['Physics-informed AI', 'Weather Forecasting', 'Remote Sensing', 'Earth Observation', 'Machine Learning', 'Energy Systems'],
    description: 'Vacantes predoctorales (PhD) y postdoctorales en el grupo de la Prof. Dr. Angela Meyer (TU Delft / Bern UAS). Fusión de IA y física atmosférica para dinámicas climáticas y energía renovable.',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-supercritical',
    name: 'Supercritical Careers (Durable CDR Marketplace)',
    quadrant: 'GLOBAL_REMOTE',
    quadrantLabel: 'Reino Unido & Remoto Europa',
    category: 'Ambiental / Clima',
    directUrl: 'https://gosupercritical.com/jobs',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['Carbon Removal', 'CDR', 'Climate Scientist', 'Biochar', 'Enhanced Weathering', 'SBTi', 'Advisory', 'Permanence'],
    description: 'Bolsa de empleo del marketplace líder en CDR duradero. Puestos remotos en asesoría y ciencia climática, modelado de carteras net-zero y validación de proveedores.',
    iconName: 'Leaf'
  }
];

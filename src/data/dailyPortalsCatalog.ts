export interface DailyPortal {
  id: string;
  name: string;
  quadrant: 'DACH' | 'EUSKADI' | 'EUROPA' | 'GLOBAL_REMOTE';
  quadrantLabel: string;
  category: 'Científico / I+D' | 'General / Profesional' | 'Ambiental / Clima' | 'Gobernanza / Público' | 'Institucional / Multilateral';
  directUrl: string;
  recommendedFrequency: 'Diario' | '2-3 veces/semana' | 'Semanal';
  suggestedKeywords: string[];
  description: string;
  iconName: 'Linkedin' | 'Briefcase' | 'Compass' | 'Leaf' | 'GraduationCap' | 'Globe' | 'Search' | 'Building2' | 'CloudRain' | 'Landmark' | 'MapPin' | 'Cpu' | 'FileText' | 'Users';
}

export const DAILY_PORTALS: DailyPortal[] = [
  // -------------------------------------------------------------
  // CUADRANTE DACH (Alemania, Austria, Suiza)
  // -------------------------------------------------------------
  {
    id: 'portal-ethz',
    name: 'ETH Zürich - Job Board Oficial',
    quadrant: 'DACH',
    quadrantLabel: 'Suiza / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://jobs.ethz.ch/site/index',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Geophysics', 'Hydrology', 'Earth Sciences', 'Climate', 'Postdoc'],
    description: 'Portal oficial de vacantes de la ETH Zürich, universidad líder de Europa continental. Máxima escala salarial para investigadores en geofísica, hidrología y ciencias de la tierra (85.000 - 115.000 CHF).',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-eawag',
    name: 'Eawag - Swiss Federal Institute of Aquatic Science and Technology',
    quadrant: 'DACH',
    quadrantLabel: 'Suiza / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://www.eawag.ch/en/about-us/working/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Water Resources', 'Hydrology', 'Catchment', 'Biogeochemistry', 'Rivers'],
    description: 'Instituto federal suizo en Dübendorf/Zürich (Dominio ETH). Referencia mundial en modelado de cuencas hidrológicas, calidad del agua, hidrología superficial y biogeoquímica acuática.',
    iconName: 'CloudRain'
  },
  {
    id: 'portal-epfl-herus',
    name: 'EPFL - HERUS Lab (Openings & Careers)',
    quadrant: 'DACH',
    quadrantLabel: 'Suiza / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://www.epfl.ch/labs/herus/index-html/openings/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Urban Systems', 'Spatial Analysis', 'Environmental Dynamics', 'Modeling'],
    description: 'Laboratorio HERUS de la EPFL en Lausanne. Puestos de investigación en modelado sistémico espacial, transiciones socio-ecológicas y resiliencia territorial con remuneración de nivel federal suizo.',
    iconName: 'Compass'
  },
  {
    id: 'portal-univie',
    name: 'Universität Wien - Job Portal (Praedoc & Research)',
    quadrant: 'DACH',
    quadrantLabel: 'Austria / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://jobs.univie.ac.at/go/Praedoc/8877001/25/?q=&sortColumn=referencedate&sortDirection=desc',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['TiCCA4Danu', 'PEGIS', 'VISESS', 'ENGAGE', 'Praedoc', 'Geophysics', 'Climate'],
    description: 'Portal oficial de vacantes de la Universidad de Viena. Convocatorias predoctorales y científicas en Geografía Económica (TiCCA4Danu, PEGIS/GEIST), VISESS Earth & Space Sciences, ENGAGE y STRENGTH (TV-UG / FWF).',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-boku',
    name: 'BOKU University - Jobbörse / Vacancies (Viena)',
    quadrant: 'DACH',
    quadrantLabel: 'Austria / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://boku.ac.at/en/pers/interne-jobboerse',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Jobbörse', 'Soil Physics', 'Forest Sciences', 'Hydrology', 'Carbon', 'Stellenangebote', 'Postdoc'],
    description: 'Bolsa de trabajo oficial (Jobbörse) de la Universidad de Recursos Naturales y Ciencias de la Vida de Viena (BOKU). Plazas científicas y de investigación en física de suelos, balances de carbono y ciencias ambientales.',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-uni-freiburg',
    name: 'University of Freiburg - Future Forests & Environmental Governance',
    quadrant: 'DACH',
    quadrantLabel: 'Baden-Württemberg / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://uni-freiburg.de/universitaet/stellenangebote/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Future Forests', 'Forest Policy', 'Socio-Ecological Systems', 'Climate Adaptation', 'Schwarzwald'],
    description: 'Portal oficial de la Universidad de Friburgo. Clúster de Excelencia Future Forests y Chair of Forest and Environmental Policy en adaptación climática de bosques y gobernanza de transiciones socio-ecológicas (TV-L E13).',
    iconName: 'Leaf'
  },
  {
    id: 'portal-kit-c4land',
    name: 'KIT Karlsruhe - C4LaNd IRTG & IMK-IFU Campus Alpin',
    quadrant: 'DACH',
    quadrantLabel: 'Baden-Württemberg / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://c4land.earth/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['C4LaNd', 'Land Competition', 'Eddy Covariance', 'Blue-Green Infrastructure', 'GRUSS', 'Nexus'],
    description: 'International Research Training Group C4LaNd (Competition for Land) del KIT con Hohenheim y Melbourne. Incluye IMK-IFU Campus Alpin y grupos GRUSS/IIP en nexo food-energy-materials, biodiversidad y flujos de GEI.',
    iconName: 'Compass'
  },
  {
    id: 'portal-tum-edfm',
    name: 'TUM Freising - Ecosystem Dynamics & Forest Management (BETA-FOR)',
    quadrant: 'DACH',
    quadrantLabel: 'Baviera / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://www.edfm.wzw.tum.de/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['BETA-FOR', 'Forest Dynamics', 'Rupert Seidl', 'Mountain Forests', 'Simulation', 'Weihenstephan'],
    description: 'Cátedra de Dinámica de Ecosistemas y Manejo Forestal en Regiones Montañosas (Prof. Rupert Seidl) en TUM Weihenstephan. Modelación de resiliencia forestal, biodiversidad, microclima y proyecto BETA-FOR.',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-nccr-clim',
    name: 'NCCR CLIM+ Swiss National Consortium (ETH Zürich / Bern / Eawag)',
    quadrant: 'DACH',
    quadrantLabel: 'Suiza / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://www.nccr-climplus.ch/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['NCCR CLIM+', 'Climate Extremes', 'Policy', 'Eawag Wetlands', 'Energy Policy Group', 'KOF'],
    description: 'Consorcio nacional suizo financiado por SNSF que agrupa a ETH Zürich (EPG, KOF, ACHIEVE), Universidad de Berna y Eawag en investigación de extremos climáticos, sociedad, gobernanza y restauración de cuencas/humedales.',
    iconName: 'Landmark'
  },
  {
    id: 'portal-uni-stuttgart-enwat',
    name: 'Universität Stuttgart - ENWAT Graduate School & IWS',
    quadrant: 'DACH',
    quadrantLabel: 'Baden-Württemberg / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://www.enwat.uni-stuttgart.de/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['ENWAT', 'Water Resources', 'Hydraulic Modeling', 'Blue-Green', 'Groundwater', 'IWS'],
    description: 'Escuela de doctorado internacional Environment Water (ENWAT) e Instituto de Modelado de Sistemas Hidráulicos y Ambientales (IWS). Modelación hidrológica de cuencas e infraestructura azul-verde.',
    iconName: 'CloudRain'
  },
  {
    id: 'portal-uzh-rsl',
    name: 'University of Zurich (UZH) - Remote Sensing & EcoVision Lab',
    quadrant: 'DACH',
    quadrantLabel: 'Suiza / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://www.geo.uzh.ch/en/units/rsl.html',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['EcoVision', 'Remote Sensing', 'Earth Observation', 'Landscape Ecology', 'Machine Learning'],
    description: 'Laboratorios de Teledetección (RSL) y EcoVision Lab del Departamento de Geografía de la UZH. Monitoreo satelital y modelado geoespacial de cambios ambientales en ecosistemas terrestres.',
    iconName: 'Compass'
  },
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
    id: 'portal-bc3',
    name: 'BC3 Basque Centre for Climate Change - Job Offers',
    quadrant: 'EUSKADI',
    quadrantLabel: 'Euskadi / Bilbao',
    category: 'Científico / I+D',
    directUrl: 'https://www.bc3research.org/en/careers/job-offers/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Climate Change', 'Basin Modeling', 'Ecosystem Services', 'ARIES', 'Carbon MRV'],
    description: 'Portal oficial de vacantes del Basque Centre for Climate Change (BC3) en el Parque Tecnológico de Leioa (Bizkaia). Puestos en modelación climática, balance hídrico de cuencas, flujos de carbono y servicios ecosistémicos.',
    iconName: 'Leaf'
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
  },
  {
    id: 'portal-wsl',
    name: 'WSL - Swiss Federal Research Institute (Forest, Snow & Landscape)',
    quadrant: 'DACH',
    quadrantLabel: 'Suiza / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://www.wsl.ch/en/about-wsl/working-at-wsl/jobs-and-careers/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Forest Dynamics', 'Soil Science', 'Mountain Ecosystems', 'Hydrology', 'Microclimate', 'ETH Domain'],
    description: 'Instituto federal de investigación forestal, de nieve y del paisaje en Birmensdorf (Dominio ETH). Líder en suelos de montaña, microclima y dinámicas de carbono con la máxima escala salarial suiza (85.000 - 120.000 CHF).',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-empa',
    name: 'Empa - Materials & Atmospheric Modeling (ETH Domain)',
    quadrant: 'DACH',
    quadrantLabel: 'Suiza / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://www.empa.ch/web/s604/jobs',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Atmospheric Modeling', 'Greenhouse Gases', 'Sensors', 'CarboSense', 'ICOS', 'Emissions'],
    description: 'Laboratorio federal suizo de modelado atmosférico y contaminantes en Dübendorf (Dominio ETH). Puestos de alta remuneración en balance de gases de efecto invernadero y redes de sensores.',
    iconName: 'CloudRain'
  },
  {
    id: 'portal-aarhus-agroecology',
    name: 'Aarhus University - Agroecology & Peatland Rewetting',
    quadrant: 'EUROPA',
    quadrantLabel: 'Dinamarca / Nórdicos',
    category: 'Científico / I+D',
    directUrl: 'https://international.au.dk/about/vacant-positions',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Lavbundsjord', 'Peatland Rewetting', 'Eddy Covariance', 'GHG Fluxes', 'Agroecology', 'Soil Physics'],
    description: 'Referente danés en mitigación de GEI en turberas agrícolas rehumidificadas (*lavbundsjorde*). Escala salarial pública danesa de primer nivel con 17.1% de pensión adicional.',
    iconName: 'Leaf'
  },
  {
    id: 'portal-dtu-sustain',
    name: 'DTU - Technical University of Denmark (Sustain & Space)',
    quadrant: 'EUROPA',
    quadrantLabel: 'Dinamarca / Nórdicos',
    category: 'Científico / I+D',
    directUrl: 'https://www.dtu.dk/english/about/job-and-career/vacant-positions',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Geophysics', 'Hydrology', 'Earth Observation', 'Satellite Geodesy', 'Subsurface', 'Remote Sensing'],
    description: 'Universidad técnica líder de Escandinavia en Lyngby/Copenhague. Departamentos DTU Sustain y DTU Space con proyectos de excelencia en física del agua y teledetección.',
    iconName: 'Compass'
  },
  {
    id: 'portal-list-erin',
    name: 'LIST - Luxembourg Institute of Science and Technology (ERIN)',
    quadrant: 'EUROPA',
    quadrantLabel: 'Luxemburgo / Europa Central',
    category: 'Científico / I+D',
    directUrl: 'https://www.list.lu/en/jobs/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Catchment Hydrology', 'Remote Sensing', 'Environmental Sensing', 'Soil-Plant-Atmosphere', 'Ecohydrology'],
    description: 'Instituto nacional de Luxemburgo con las escalas salariales más altas de la Unión Europea (postdocs 75k-95k €). Departamento ERIN especializado en ecohidrología de cuencas y teledetección.',
    iconName: 'Landmark'
  },
  {
    id: 'portal-tno-environment',
    name: 'TNO - Netherlands Organisation for Applied Scientific Research',
    quadrant: 'EUROPA',
    quadrantLabel: 'Países Bajos / Benelux',
    category: 'Científico / I+D',
    directUrl: 'https://www.tno.nl/en/careers/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Subsurface', 'Groundwater', 'Geosciences', 'Circular Economy', 'Climate Transition', 'Data Science'],
    description: 'Mayor instituto de I+D aplicada de los Países Bajos en Utrecht y La Haya. Escala salarial neerlandesa de alta competitividad con 13ª paga y régimen fiscal favorable.',
    iconName: 'Building2'
  },
  {
    id: 'portal-niva-norway',
    name: 'NIVA - Norwegian Institute for Water Research (Norsk institutt for vannforskning)',
    quadrant: 'EUROPA',
    quadrantLabel: 'Noruega / Nórdicos',
    category: 'Científico / I+D',
    directUrl: 'https://www.niva.no/en/vacancies',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Catchment', 'Wetlands', 'Hydrology', 'Climate Adaptation', 'Water Resources', 'Biogeochemistry'],
    description: 'Instituto noruego líder en investigación acuática, humedales y mitigación climática en Oslo. Baremos salariales nórdicos estatales (>650.000 NOK) y estabilidad investigadora.',
    iconName: 'CloudRain'
  },
  {
    id: 'portal-lund-ines',
    name: 'Lund University - INES & ICOS Sweden (Carbon & Peatlands)',
    quadrant: 'EUROPA',
    quadrantLabel: 'Suecia / Nórdicos',
    category: 'Científico / I+D',
    directUrl: 'https://www.lunduniversity.lu.se/vacancies',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['ICOS', 'Eddy Covariance', 'Carbon Fluxes', 'LPJ-GUESS', 'Boreal Peatlands', 'Physical Geography'],
    description: 'Departamento de Geografía Física y Ciencia de Ecosistemas de Lund. Centro neurálgico de ICOS Suecia, torres de flujo de carbono y modelado de vegetación continental.',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-geomar-kiel',
    name: 'GEOMAR - Helmholtz Centre for Ocean Research Kiel',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / DACH (Kiel)',
    category: 'Científico / I+D',
    directUrl: 'https://www.geomar.de/en/career-campus',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Biogeochemistry', 'Gas Fluxes', 'Ocean-Atmosphere', 'Numerical Modeling', 'Marine Geosciences', 'TVöD E13'],
    description: 'Centro Helmholtz en Kiel (Alemania). Investigación de vanguardia en biogeoquímica, flujos de gases y dinámica de fluidos con contratos públicos de investigación TVöD Bund E13.',
    iconName: 'Compass'
  },
  {
    id: 'portal-ecmwf-copernicus',
    name: 'ECMWF - European Centre for Medium-Range Weather Forecasts (C3S / CAMS)',
    quadrant: 'GLOBAL_REMOTE',
    quadrantLabel: 'Internacional / Alemania (Bonn) & Italia (Bolonia)',
    category: 'Científico / I+D',
    directUrl: 'https://www.ecmwf.int/en/about/jobs',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Copernicus C3S', 'CAMS', 'Numerical Weather Prediction', 'Greenhouse Gases', 'Data Assimilation', 'Climate Reanalysis'],
    description: 'Organismo intergubernamental europeo en Bonn, Bolonia y Reading. Operador oficial de Copernicus Climate Change (C3S) con salarios internacionales libres de impuestos (6.000 - 9.500 € netos/mes).',
    iconName: 'Globe'
  },
  {
    id: 'portal-helmholtz-ai',
    name: 'Helmholtz AI & HIDA (Data Science & Earth System AI)',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / DACH',
    category: 'Científico / I+D',
    directUrl: 'https://www.helmholtz.ai/jobs-opportunities/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Earth System AI', 'Physics-Informed ML', 'Digital Twin', 'Data Assimilation', 'Geosciences', 'TVöD E13'],
    description: 'Plataforma de inteligencia artificial de los 18 centros Helmholtz de Alemania (UFZ, DLR, GEOMAR, KIT, Jülich). Financian vacantes de gemelos digitales y asimilación de datos con TVöD E13.',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-destine-esa',
    name: 'Destination Earth (DestinE) & ESA Φ-lab (Earth Digital Twins)',
    quadrant: 'EUROPA',
    quadrantLabel: 'Europa / ESA & ECMWF',
    category: 'Científico / I+D',
    directUrl: 'https://destination-earth.eu/opportunities/',
    recommendedFrequency: '2-3 veces/semana',
    suggestedKeywords: ['Digital Twin Earth', 'DestinE', 'Climate Adaptation', 'PINNs', 'Copernicus Sentinel', 'Extreme Weather'],
    description: 'Iniciativa insignia de la Comisión Europea (ESA, ECMWF, EUMETSAT) para crear gemelos digitales de alta resolución del sistema Tierra.',
    iconName: 'Globe'
  },
  {
    id: 'portal-icta-uab',
    name: 'ICTA-UAB - Institut de Ciència i Tecnologia Ambientals',
    quadrant: 'EUROPA',
    quadrantLabel: 'España / Barcelona (Bellaterra)',
    category: 'Científico / I+D',
    directUrl: 'https://www.uab.cat/icta/',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['Political Ecology', 'Degrowth', 'Ecología Política', 'Decrecimiento', 'Environmental Justice', 'EJAtlas', 'Post-extractivism'],
    description: 'Epicentro europeo de investigación en Ecología Política, Decrecimiento y Justicia Ambiental Global. Proyectos ERC avanzados y análisis de conflictos ecológicos.',
    iconName: 'GraduationCap'
  },
  {
    id: 'portal-wuppertal-institut',
    name: 'Wuppertal Institut für Klima, Umwelt, Energie',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / Renania del Norte-Westfalia',
    category: 'Científico / I+D',
    directUrl: 'https://wupperinst.org/das-institut/karriere/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Just Transition', 'Gerechter Übergang', 'Klimapolitik', 'Kreislaufwirtschaft', 'Transformationsforschung', 'TVöD'],
    description: 'Instituto líder alemán en investigación de políticas de transición justa, descarbonización industrial estructural y gobernanza socioecológica en Wuppertal y Berlín.',
    iconName: 'Building2'
  },
  {
    id: 'portal-oeko-institut',
    name: 'Öko-Institut e.V. - Institut für angewandte Ökologie',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / Friburgo, Darmstadt & Berlín',
    category: 'Científico / I+D',
    directUrl: 'https://www.oeko.de/das-institut/stellenangebote/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Umweltpolitik', 'Klima und Energie', 'Ressourcenschutz', 'Socio-ecological Transformation', 'Politikberatung', 'BMUV'],
    description: 'Uno de los centros independientes de investigación y asesoría de políticas ambientales más prestigiosos de Europa. Informes directos para el gobierno alemán y la UE.',
    iconName: 'Landmark'
  },
  {
    id: 'portal-ecologic-institute',
    name: 'Ecologic Institute - Science and Policy for a Sustainable World',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / Berlín & Bélgica (Bruselas)',
    category: 'Científico / I+D',
    directUrl: 'https://www.ecologic.eu/jobs',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['EU Environmental Policy', 'Water Governance', 'Biodiversity Policy', 'Climate Law', 'Think Tank', 'Policy Analyst'],
    description: 'Think tank internacional líder en evaluación de políticas ambientales de la UE, gobernanza del agua, directivas de restauración de la naturaleza y derecho ambiental.',
    iconName: 'Landmark'
  },
  {
    id: 'portal-eeb-brussels',
    name: 'EEB - European Environmental Bureau',
    quadrant: 'EUROPA',
    quadrantLabel: 'Bélgica / Bruselas (UE)',
    category: 'Gobernanza / Público',
    directUrl: 'https://eeb.org/en/about/opportunities/',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Policy Officer', 'Advocacy', 'EU Green Deal', 'Nature Restoration', 'Soil Health', 'Water Directive', 'NGO Campaigner'],
    description: 'La mayor federación de ONGs ciudadanas ambientales de Europa (+180 miembros en Bruselas). Incidencia directa sobre el Parlamento y la Comisión Europea.',
    iconName: 'Globe'
  },
  {
    id: 'portal-can-europe',
    name: 'CAN Europe - Climate Action Network Europe',
    quadrant: 'EUROPA',
    quadrantLabel: 'Bélgica / Bruselas (UE)',
    category: 'Gobernanza / Público',
    directUrl: 'https://caneurope.org/work-with-us/',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['Climate Policy', 'Just Transition', 'EU Energy Policy', 'Climate Finance', 'Campaign Coordinator', 'Advocacy'],
    description: 'Principal coalición de ONGs climáticas en Europa. Coordinación de incidencia sobre los marcos de reporte de la UE, NDCs y justicia climática.',
    iconName: 'Globe'
  },
  {
    id: 'portal-iddri-paris',
    name: 'IDDRI - Institut du Développement Durable et des Relations Internationales',
    quadrant: 'EUROPA',
    quadrantLabel: 'Francia / París (Sciences Po)',
    category: 'Científico / I+D',
    directUrl: 'https://www.iddri.org/en/about-iddri/careers',
    recommendedFrequency: 'Semanal',
    suggestedKeywords: ['International Climate Governance', 'Biodiversity', 'EU Agriculture Policy', 'Watershed Transitions', 'Policy Fellow'],
    description: 'Think tank de investigación de políticas públicas vinculado a Sciences Po París. Referente en gobernanza internacional de biodiversidad, agua y clima.',
    iconName: 'Landmark'
  },
  {
    id: 'portal-rifs-potsdam',
    name: 'RIFS Potsdam - Research Institute for Sustainability (Helmholtz)',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / Brandeburgo (Potsdam)',
    category: 'Científico / I+D',
    directUrl: 'https://www.rifs-potsdam.de/de/institut/jobs',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Transformative Governance', 'Transición Justa', 'Partizipative Prozesse', 'Democracy & Sustainability', 'Helmholtz', 'TVöD E13'],
    description: 'Instituto de la Asociación Helmholtz dedicado a la gobernanza democrática y social de las transformaciones hacia la sostenibilidad en Potsdam.',
    iconName: 'Building2'
  },
  {
    id: 'portal-ioer-dresden',
    name: 'IOER Dresden - Leibniz Institute of Ecological Urban and Regional Development',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / Sajonia (Dresde)',
    category: 'Científico / I+D',
    directUrl: 'https://www.ioer.de/karriere/stellenangebote',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Spatial Justice', 'Interlinked Justice', 'Resilient Landscapes', 'Landscape Ecology', 'Territorial Planning', 'Leibniz TV-L'],
    description: 'Instituto de la Asociación Leibniz en Dresde. Investigación pionera en justicia espacial, ordenamiento ecológico de paisajes y resiliencia territorial.',
    iconName: 'MapPin'
  },
  {
    id: 'portal-boell-stiftung',
    name: 'Heinrich-Böll-Stiftung - Ecología Política & Justicia Global',
    quadrant: 'DACH',
    quadrantLabel: 'Alemania / Berlín & Bélgica (Bruselas)',
    category: 'Gobernanza / Público',
    directUrl: 'https://www.boell.de/de/jobs-der-heinrich-boell-stiftung',
    recommendedFrequency: 'Diario',
    suggestedKeywords: ['Politische Ökologie', 'Klimagerechtigkeit', 'Ressourcenpolitik', 'Global Dialogue', 'TVöD Bund E13', 'Think Tank'],
    description: 'Fundación política alemana para la ecología política, la sostenibilidad democrática y la justicia territorial internacional con sedes en Berlín y Bruselas.',
    iconName: 'Landmark'
  }
];

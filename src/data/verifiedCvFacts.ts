// ============================================================================
// VERIFIED CV FACTS // Fuente única de datos para el CV Studio
// ----------------------------------------------------------------------------
// Regla: aquí SOLO entra lo que está respaldado por el Portafolio
// (https://danisantanderurrutia-coder.github.io/portafolio/) o confirmado
// directamente por Daniel. Cada hecho declara su `source`. Lo que no tenga
// respaldo NO se incluye (el CV Studio nunca inventa cargos, fechas o métricas).
// ============================================================================

export type CvSection =
  | 'education'
  | 'experience'
  | 'publications'
  | 'courses'
  | 'skills'
  | 'languages';

export interface LocalizedText {
  title: string;
  org?: string;
  place?: string;
  /** Una línea: se usa en CVs de 1 página */
  short?: string;
  /** Viñetas: se usan en CVs de 2 páginas */
  long?: string[];
}

export interface CvFact {
  id: string;
  section: CvSection;
  /** 1 (bajo) a 5 (esencial): orden base cuando no hay oferta */
  priority: number;
  /** Siempre incluido en el CV (p. ej. los 3 títulos universitarios) */
  core?: boolean;
  period?: string;
  /** Palabras clave (minúsculas, ES/EN/DE) para cruzar contra una oferta */
  tags: string[];
  /** Dónde está respaldado este dato */
  source: string;
  es: LocalizedText;
  en: LocalizedText;
}

export const CANONICAL_CONTACT = {
  email: 'danisantander.urrutia@gmail.com',
  portfolio: 'https://danisantanderurrutia-coder.github.io/portafolio/',
  linkedin: 'https://www.linkedin.com/in/santanderurrutia/',
  github: 'https://github.com/danisantanderurrutia-coder',
  defaultLocation: 'Kiel, Alemania'
} as const;

export const CV_HEADLINE = {
  es: 'Geofísico Ambiental • Candidato a Doble M.Sc. Europeo',
  en: 'Environmental Geophysicist • Dual European M.Sc. Candidate'
} as const;

export const CV_SUMMARY = {
  es: 'Geofísico (Universidad de Chile, con distinción) y candidato a doble Máster en Ciencias en Manejo Ambiental (CAU Kiel, Alemania) y Protección Ambiental (AMU Poznań, Polonia). Combina trabajo cuantitativo de terreno en hidrogeofísica y flujos de gases de efecto invernadero en turberas con análisis de datos, desarrollo de aplicaciones científicas, testimonio ante el Congreso Nacional de Chile y comunicación pública de gran alcance.',
  en: "Geophysicist (Universidad de Chile, with distinction) and dual M.Sc. candidate in Environmental Management (CAU Kiel, Germany) and Environmental Protection (AMU Poznań, Poland). Combines quantitative fieldwork in hydrogeophysics and peatland greenhouse-gas fluxes with data analysis, scientific application development, testimony before Chile's National Congress, and large-scale public communication."
} as const;

export type TacticalAngle = 'general' | 'biofisica' | 'mrv_carbon' | 'cat_risk' | 'politicas';

export const TACTICAL_HEADLINES: Record<TacticalAngle, { es: string; en: string }> = {
  general: {
    es: 'Geofísico Ambiental • Candidato a Doble M.Sc. Europeo',
    en: 'Environmental Geophysicist • Dual European M.Sc. Candidate'
  },
  biofisica: {
    es: 'Geofísico Ambiental • Especialista en Flujos de GEI & Eddy Covariance',
    en: 'Environmental Geophysicist • GHG Fluxes & Eddy Covariance Specialist'
  },
  mrv_carbon: {
    es: 'Geofísico Cuantitativo • Especialista en Teledetección, MRV & Carbon-Tech',
    en: 'Quantitative Geophysicist • Remote Sensing, MRV & Carbon-Tech Specialist'
  },
  cat_risk: {
    es: 'Geofísico Computacional • Modelación de Riesgos Físicos, Incendios & Cuencas',
    en: 'Computational Geophysicist • Physical Risk Modeling, Wildfires & Watersheds'
  },
  politicas: {
    es: 'Geofísico Ambiental • Asesor en Políticas Climáticas, Cuencas & Salvaguardias',
    en: 'Environmental Geophysicist • Climate Policy Advisor, Watersheds & Safeguards'
  }
};

export const TACTICAL_SUMMARIES: Record<TacticalAngle, { es: string; en: string }> = {
  general: {
    es: 'Geofísico (Universidad de Chile, con distinción) y candidato a doble Máster en Ciencias en Manejo Ambiental (CAU Kiel, Alemania) y Protección Ambiental (AMU Poznań, Polonia). Combina trabajo cuantitativo de terreno en hidrogeofísica y flujos de gases de efecto invernadero en turberas con análisis de datos, desarrollo de aplicaciones científicas, testimonio ante el Congreso Nacional de Chile y comunicación pública de gran alcance.',
    en: "Geophysicist (Universidad de Chile, with distinction) and dual M.Sc. candidate in Environmental Management (CAU Kiel, Germany) and Environmental Protection (AMU Poznań, Poland). Combines quantitative fieldwork in hydrogeophysics and peatland greenhouse-gas fluxes with data analysis, scientific application development, testimony before Chile's National Congress, and large-scale public communication."
  },
  biofisica: {
    es: 'Geofísico (U. de Chile) y candidato a doble M.Sc. europeo (CAU Kiel / AMU Poznań) especializado en balance de GEI (CO₂, CH₄) mediante Eddy Covariance y cámaras cerradas en turberas templadas. Experiencia directa en instrumentación micrometeorológica, cálculo de tensión de preconsolidación edáfica (σp = 62,4 kPa) y análisis de series temporales continuas en R y Python para centros de investigación y redes de monitoreo de flujos.',
    en: 'Geophysicist (U. de Chile) and dual European M.Sc. candidate (CAU Kiel / AMU Poznań) specializing in GHG balances (CO₂, CH₄) using Eddy Covariance and closed chambers in temperate peatlands. Hands-on experience with micrometeorological instrumentation, soil precompression stress analysis (σp = 62.4 kPa), and continuous flux time series in R/Python for research centers and flux networks.'
  },
  mrv_carbon: {
    es: 'Geofísico cuantitativo (U. de Chile, CAU Kiel) especializado en teledetección satelital (Google Earth Engine, Sentinel-2, Landsat), validación empírica en terreno y calificación de integridad en proyectos de carbono edáfico y humedales. Combina modelación de flujos de carbono, programación geoespacial en Python/R y rigor metodológico para plataformas de calificación MRV y rating de créditos climáticos.',
    en: 'Quantitative geophysicist (U. de Chile, CAU Kiel) specialized in satellite remote sensing (Google Earth Engine, Sentinel-2, Landsat), ground-truthing, and integrity rating for soil carbon and wetland offset projects. Combines carbon flux modeling, geospatial Python/R programming, and methodological rigor for MRV verification platforms and climate credit rating agencies.'
  },
  cat_risk: {
    es: 'Geofísico (U. de Chile) enfocado en modelación física de amenazas catastróficas, dinámica de incendios forestales y balance hidrológico en cuencas degradadas. Combina física de propagación, series temporales hidrológicas, teledetección multiespectral y programación científica para el análisis de riesgo físico agudo/crónico orientado a reaseguros, seguros paramétricos y resiliencia territorial.',
    en: 'Geophysicist (U. de Chile) focused on physical hazard modeling, wildfire dynamics, and watershed hydrological balance in degraded landscapes. Integrates propagation physics, hydrological time series, multispectral remote sensing, and scientific programming for acute/chronic physical risk analysis targeting reinsurance, parametric insurance, and territorial resilience.'
  },
  politicas: {
    es: 'Geofísico ambiental y candidato a doble M.Sc. europeo con trayectoria contrastada en la interfaz ciencia-política: autor de informes técnicos y compareciente ante el Senado y Cámara de Diputados de Chile en legislación de aguas, incendios y cuencas. Aporta visión técnica rigurosa para organismos multilaterales (GIZ, UE), salvaguardias ambientales y diseño de marcos regulatorios climáticos.',
    en: 'Environmental geophysicist and dual European M.Sc. candidate with a proven track record at the science-policy interface: author of technical reports and parliamentary expert witness before the Chilean Senate and Chamber of Deputies on water, wildfire, and watershed legislation. Provides rigorous technical insight for multilateral bodies (GIZ, EU), environmental safeguards, and climate policy design.'
  }
};

export const CV_FOOTER_GENERAL = {
  es: 'CV de referencia general: cada postulación se ajusta con antecedentes específicos según el rol.',
  en: 'General reference CV: every application is tailored with role-specific background.'
} as const;

export const VERIFIED_FACTS: CvFact[] = [
  // ------------------------------------------------------------------ EDUCATION
  {
    id: 'edu-kiel',
    section: 'education',
    priority: 5,
    core: true,
    period: '2023 – 2026',
    tags: ['peatland', 'turbera', 'moor', 'ghg', 'gei', 'greenhouse', 'eddy covariance', 'paludiculture', 'paludicultura', 'carbon', 'kohlenstoff', 'soil', 'suelo', 'boden', 'wetland', 'humedal', 'environmental management', 'umweltmanagement', 'hydrology', 'catchment', 'cuenca', 'climate', 'klima'],
    source: 'Portafolio · Títulos académicos (CAU Kiel)',
    es: {
      title: 'M.Sc. en Manejo Ambiental',
      org: 'Christian-Albrechts-Universität zu Kiel (CAU Kiel)',
      place: 'Kiel, Alemania',
      short: 'Rehumedecimiento de turberas (Wallener Au), flujos de GEI (CO₂, CH₄), Eddy Covariance, paludicultura y tensión de preconsolidación del suelo (σp = 62,4 kPa).',
      long: [
        'Facultad de Ciencias Agrícolas y Nutricionales. Tesis sobre la turbera rehumedecida Wallener Au (Schleswig-Holstein).',
        'Flujos de GEI (CO₂, CH₄) con Eddy Covariance y cámaras cerradas; paludicultura; tensión de preconsolidación del suelo (σp = 62,4 kPa).',
        'Desarrollo de Wetland Monitor, aplicación web 3D para presentar los resultados.'
      ]
    },
    en: {
      title: 'M.Sc. in Environmental Management',
      org: 'Christian-Albrechts-Universität zu Kiel (CAU Kiel)',
      place: 'Kiel, Germany',
      short: 'Peatland rewetting (Wallener Au), GHG fluxes (CO₂, CH₄), Eddy Covariance, paludiculture and soil precompression stress (σp = 62.4 kPa).',
      long: [
        'Faculty of Agricultural & Nutritional Sciences. Thesis on the rewetted Wallener Au peatland (Schleswig-Holstein).',
        'GHG fluxes (CO₂, CH₄) with Eddy Covariance and closed chambers; paludiculture; soil precompression stress (σp = 62.4 kPa).',
        'Developed Wetland Monitor, a 3D web application presenting the results.'
      ]
    }
  },
  {
    id: 'edu-amu',
    section: 'education',
    priority: 5,
    core: true,
    period: '2023 – 2026',
    tags: ['limnology', 'limnología', 'lake', 'lago', 'pond', 'bioindicator', 'bioindicador', 'water framework', 'wfd', 'directiva marco', 'wasserrahmenrichtlinie', 'freshwater', 'aquatic', 'environmental protection', 'umweltschutz', 'water quality', 'calidad del agua'],
    source: 'Portafolio · Títulos académicos (AMU Poznań)',
    es: {
      title: 'M.Sc. en Protección Ambiental',
      org: 'Adam Mickiewicz University (AMU Poznań)',
      place: 'Poznań, Polonia',
      short: 'Limnología, bioindicadores de laboratorio e in situ en lagos y estanques, Directiva Marco del Agua de la UE.',
      long: [
        'Facultad de Ciencias Geográficas y Geológicas.',
        'Limnología; bioindicadores de laboratorio e in situ en lagos y estanques.',
        'Marco normativo: Directiva Marco del Agua de la Unión Europea.'
      ]
    },
    en: {
      title: 'M.Sc. in Environmental Protection',
      org: 'Adam Mickiewicz University (AMU Poznań)',
      place: 'Poznań, Poland',
      short: 'Limnology, laboratory and in-situ bioindicators in lakes and ponds, EU Water Framework Directive.',
      long: [
        'Faculty of Geographical & Geological Sciences.',
        'Limnology; laboratory and in-situ bioindicators in lakes and ponds.',
        'Regulatory framework: EU Water Framework Directive.'
      ]
    }
  },
  {
    id: 'edu-uchile',
    section: 'education',
    priority: 5,
    core: true,
    period: '2015 – 2021',
    tags: ['geophysics', 'geofísica', 'geophysik', 'resistivity', 'resistividad', 'ves', 'sev', 'ert', 'hydrogeophysics', 'hidrogeofísica', 'groundwater', 'agua subterránea', 'water table', 'nivel freático', 'maule', 'agroforestry', 'agroforestería', 'climate change', 'cambio climático'],
    source: 'Portafolio · Títulos académicos (U. de Chile)',
    es: {
      title: 'Geofísico y Licenciado en Ciencias, mención Geofísica',
      org: 'Universidad de Chile (FCFM)',
      place: 'Santiago, Chile',
      short: 'Con distinción. Memoria de título: resistividad eléctrica de suelos (SEV) y descenso del nivel freático en la Cuenca del Maule bajo agroforestería y cambio climático.',
      long: [
        'Facultad de Ciencias Físicas y Matemáticas. Aprobado con distinción.',
        'Memoria de título: resistividad eléctrica de suelos (Sondeo Eléctrico Vertical, SEV) y descenso del nivel freático en la Cuenca del Maule bajo sistemas agroforestales y cambio climático.'
      ]
    },
    en: {
      title: 'Geophysicist & B.Sc. in Geophysics',
      org: 'Universidad de Chile (FCFM)',
      place: 'Santiago, Chile',
      short: 'With distinction. Thesis: soil electrical resistivity (VES) and water table drawdown in the Maule Basin under agroforestry and climate change.',
      long: [
        'Faculty of Physical & Mathematical Sciences. Awarded with distinction.',
        'Degree thesis: soil electrical resistivity (Vertical Electrical Sounding, VES) and water table drawdown in the Maule Basin under agroforestry systems and climate change.'
      ]
    }
  },

  // ----------------------------------------------------------------- EXPERIENCE
  {
    id: 'exp-wetland-monitor',
    section: 'experience',
    priority: 5,
    period: '2026',
    tags: ['web', 'react', 'typescript', 'three.js', '3d', 'digital twin', 'gemelo digital', 'developer', 'desarrollador', 'software', 'visualization', 'visualización', 'peatland', 'turbera', 'wetland', 'humedal', 'ghg', 'gei', 'data'],
    source: 'Portafolio · Proyectos (Wetland Monitor) + fecha confirmada por Daniel',
    es: {
      title: 'Desarrollador y Autor',
      org: 'Wetland Monitor (aplicación web 3D)',
      short: 'Aplicación web 3D con los resultados del estudio de rehumedecimiento de Wallener Au (transición sumidero-fuente de CH₄, Eddy Covariance, paludicultura, compactación) y simulador diurno/estacional.',
      long: [
        'Diseño y desarrollo de una aplicación web 3D interactiva que presenta los resultados cuantitativos del estudio de Wallener Au.',
        'Contenido: transición sumidero-fuente de CH₄, Eddy Covariance, paludicultura y compactación del suelo; simulador diurno/estacional.'
      ]
    },
    en: {
      title: 'Developer & Author',
      org: 'Wetland Monitor (3D web application)',
      short: 'Interactive 3D web app presenting the Wallener Au rewetting results (CH₄ sink-to-source transition, Eddy Covariance, paludiculture, compaction) with a day/seasonal simulator.',
      long: [
        'Designed and built an interactive 3D web application presenting the quantitative results of the Wallener Au study.',
        'Content: CH₄ sink-to-source transition, Eddy Covariance, paludiculture and soil compaction; day/seasonal simulator.'
      ]
    }
  },
  {
    id: 'exp-agritwin',
    section: 'experience',
    priority: 3,
    period: '2026',
    tags: ['agritech', 'agrotech', 'digital twin', 'gemelo digital', 'iot', 'ndvi', 'ndre', 'sentinel', 'remote sensing', 'teledetección', 'fernerkundung', 'vineyard', 'viñedo', 'agriculture', 'agricultura', 'maule', 'soil moisture', 'humedad'],
    source: 'Portafolio · Capacidades (AgriTwin) + fecha confirmada por Daniel',
    es: {
      title: 'Desarrollo de AgriTwin',
      org: 'Gemelo digital agrícola',
      place: 'Maule, Chile',
      short: 'Integración de telemetría de humedad de suelo en tiempo real con índices satelitales Sentinel (NDVI/NDRE) en viñedos del Maule.',
      long: ['Integración de telemetría de humedad de suelo en tiempo real con índices satelitales Sentinel (NDVI/NDRE) en viñedos del Maule, Chile.']
    },
    en: {
      title: 'AgriTwin Development',
      org: 'Agricultural digital twin',
      place: 'Maule, Chile',
      short: 'Integration of real-time soil-moisture telemetry with Sentinel NDVI/NDRE indices in Maule vineyards.',
      long: ['Integration of real-time soil-moisture telemetry with Sentinel NDVI/NDRE satellite indices in Maule vineyards, Chile.']
    }
  },
  {
    id: 'exp-rewilding-suite',
    section: 'experience',
    priority: 4,
    period: '2026',
    tags: ['rewilding', 'restoration', 'restauración', 'gis', 'sig', 'pwa', 'offline-first', 'indexeddb', 'product owner', 'software', 'digital twin', 'gemelo digital', 'aljezur', 'portugal', 'biomass', 'biomasa', 'fire risk', 'incendios', 'protocols', 'survey', 'fieldwork'],
    source: 'Portafolio · Software ambiental (Rewilding Field Suite, Aljezur, Portugal)',
    es: {
      title: 'Arquitectura y Desarrollo',
      org: 'Rewilding Field Suite (PWA offline-first)',
      place: 'Aljezur, Portugal',
      short: 'PWA modular con almacenamiento local IndexedDB para protocolos de campo de rewilding, fusión de capas GIS, monitoreo de biomasa y mitigación de riesgo de incendios.',
      long: [
        'Concepción de producto y desarrollo de una Progressive Web App (PWA) de campo con motor de persistencia offline (IndexedDB) para protocolos GoWild de rewilding.',
        'Mapeo territorial y fusión de capas GIS para monitoreo de biomasa, regeneración de suelo y prevención de incendios forestales en la costa suroeste de Portugal.'
      ]
    },
    en: {
      title: 'Architecture & Lead Developer',
      org: 'Rewilding Field Suite (Offline-First PWA)',
      place: 'Aljezur, Portugal',
      short: 'Modular offline-first PWA with IndexedDB persistence for rewilding field survey protocols, GIS layer fusion, biomass monitoring, and wildfire risk mitigation.',
      long: [
        'Product conception and development of an offline-first Progressive Web App (PWA) with IndexedDB local storage engine for GoWild ecological restoration protocols.',
        'Territorial mapping and GIS layer fusion for biomass monitoring, soil regeneration, and wildfire risk mitigation on the southwest coast of Portugal.'
      ]
    }
  },
  {
    id: 'exp-congress',
    section: 'experience',
    priority: 4,
    tags: ['policy', 'política', 'politik', 'advocacy', 'incidencia', 'legislative', 'legislativo', 'congress', 'congreso', 'wildfire', 'incendio', 'waldbrand', 'forestry', 'forestal', 'governance', 'gobernanza', 'expert', 'testimony', 'public policy', 'políticas públicas'],
    source: 'Portafolio · Incidencia (Cámara de Diputadas y Diputados)',
    es: {
      title: 'Expositor técnico ante el Congreso Nacional',
      org: 'Cámara de Diputadas y Diputados de Chile',
      place: 'Valparaíso, Chile',
      short: 'Comisión Especial de Emergencias, Desastres y Bomberos: evidencia empírica sobre monocultivo forestal, megaincendios y sequía en cuencas rurales.',
      long: [
        'Invitado ante la Comisión Especial de Emergencias, Desastres y Bomberos.',
        'Evidencia empírica que vincula el avance del monocultivo forestal con megaincendios y sequía en cuencas rurales.'
      ]
    },
    en: {
      title: "Technical Expert Testimony, Chile's National Congress",
      org: 'Chamber of Deputies of Chile',
      place: 'Valparaíso, Chile',
      short: 'Special Commission on Emergencies, Disasters and Firefighters: empirical evidence on forestry monoculture, megafires and drought in rural catchments.',
      long: [
        'Invited before the Special Commission on Emergencies, Disasters and Firefighters.',
        'Empirical evidence linking forestry monoculture expansion to megafires and drought in rural catchments.'
      ]
    }
  },
  {
    id: 'exp-epn',
    section: 'experience',
    priority: 4,
    period: '2023',
    tags: ['biomass', 'biomasa', 'biomasse', 'carbon accounting', 'contabilidad de carbono', 'red iii', 'renewable', 'energy', 'energía', 'policy', 'research', 'investigación', 'report', 'informe', 'forest', 'bosque', 'wald', 'ngo', 'ong'],
    source: 'Portafolio · Publicaciones (EPN & Global Forest Coalition, 2023)',
    es: {
      title: 'Autor técnico principal',
      org: 'Environmental Paper Network & Global Forest Coalition',
      short: '"Spotlight on Burning Biomass" (Parral, Chile): oposición comunitaria a una central de biomasa, subsidios europeos y contabilidad de carbono (RED III).',
      long: ['Informe internacional "Spotlight on Burning Biomass" (Parral, Chile): oposición comunitaria a una central de biomasa, subsidios europeos de energía renovable y vacíos en la contabilidad de carbono (RED III).']
    },
    en: {
      title: 'Lead Technical Author',
      org: 'Environmental Paper Network & Global Forest Coalition',
      short: '"Spotlight on Burning Biomass" (Parral, Chile): community opposition to a biomass plant, European renewable-energy subsidies and carbon accounting (RED III).',
      long: ['International report "Spotlight on Burning Biomass" (Parral, Chile): community opposition to a biomass power plant, European renewable-energy subsidies and carbon-accounting loopholes (RED III).']
    }
  },
  {
    id: 'exp-apruebo-rural',
    section: 'experience',
    priority: 3,
    period: '2020 – 2023',
    tags: ['communication', 'comunicación', 'kommunikation', 'campaign', 'campaña', 'kampagne', 'outreach', 'storytelling', 'media', 'medios', 'community', 'comunidad', 'stakeholder', 'public engagement'],
    source: 'Portafolio · Comunicaciones (Apruebo Rural, 2020-2023)',
    es: {
      title: 'Coordinador General de Campaña y Director de Prensa Nacional',
      org: 'Apruebo Rural',
      place: 'Chile (14 Regiones)',
      short: 'Campaña nacional transmedia (14 regiones, 80+ asambleas, 500K+ kits); 60+ columnas y acto de cierre.',
      long: ['Coordinación general de campaña nacional transmedia y despliegue territorial en 14 regiones con 80+ asambleas comunales, organización del acto de cierre nacional, 60+ columnas y notas de prensa, y más de 500.000 volantes y kits pedagógicos distribuidos.']
    },
    en: {
      title: 'Lead Campaign Coordinator & National Press Director',
      org: 'Apruebo Rural',
      place: 'Chile (14 Regions)',
      short: 'Nationwide transmedia campaign (14 regions, 80+ assemblies, 500K+ kits); 60+ op-eds and historic closing rally.',
      long: ['Led nationwide transmedia communication and field campaign across 14 regions with 80+ town hall assemblies, organized the historic closing rally, placed 60+ op-eds/media interviews, and distributed 500K+ educational kits.']
    }
  },
  {
    id: 'exp-cuarentena-rap',
    section: 'experience',
    priority: 1,
    period: '2020',
    tags: ['community', 'comunidad', 'discord', 'streaming', 'culture', 'cultura', 'production', 'producción', 'event', 'evento'],
    source: 'Portafolio · Cuarentena Rap (2020) + Capacidades (+12.000 miembros, 8 países)',
    es: {
      title: 'Creación y dirección',
      org: 'Cuarentena Rap',
      short: 'Liga digital de freestyle y batallas escritas en Discord, YouTube y Twitch; comunidad de +12.000 miembros en 8 países.',
      long: ['Creación y dirección de una liga digital de freestyle y batallas escritas en Discord, YouTube y Twitch durante la pandemia; comunidad de +12.000 miembros en 8 países.']
    },
    en: {
      title: 'Founder & Director',
      org: 'Cuarentena Rap',
      short: 'Digital freestyle and written-battle league on Discord, YouTube and Twitch; 12,000+ members across 8 countries.',
      long: ['Created and directed a digital freestyle and written-battle league on Discord, YouTube and Twitch during the pandemic; 12,000+ members across 8 countries.']
    }
  },

  // --------------------------------------------------------------- PUBLICATIONS
  {
    id: 'pub-epn-2023',
    section: 'publications',
    priority: 5,
    period: '2023',
    tags: ['biomass', 'biomasa', 'carbon accounting', 'red iii', 'policy', 'report', 'forest', 'bosque'],
    source: 'Portafolio · Publicaciones',
    es: { title: '"Spotlight on Burning Biomass for Energy in South America: Community Opposition to a Power Plant in Parral, Chile"', org: 'Environmental Paper Network & Global Forest Coalition' },
    en: { title: '"Spotlight on Burning Biomass for Energy in South America: Community Opposition to a Power Plant in Parral, Chile"', org: 'Environmental Paper Network & Global Forest Coalition' }
  },
  {
    id: 'pub-tomaterojo-2023',
    section: 'publications',
    priority: 4,
    period: '2023',
    tags: ['wetland', 'humedal', 'wildfire', 'incendio', 'water', 'agua', 'peatland', 'turbera', 'journalism', 'periodismo'],
    source: 'Portafolio · Publicaciones',
    es: { title: '"¡Aguas, aguas! Humedales bajo fuego: ¿Qué sabemos y qué está haciendo Chile?" (D. Santander, L. Muñoz, C. Bonifetti)', org: 'Tomate Rojo · Red Plurinacional de Humedales' },
    en: { title: '"Waters Under Fire: What Do We Know and What Is Chile Doing?" (D. Santander, L. Muñoz, C. Bonifetti)', org: 'Tomate Rojo · Plurinational Wetland Network' }
  },
  {
    id: 'pub-regionalista-2023',
    section: 'publications',
    priority: 2,
    period: '2023',
    tags: ['soil', 'suelo', 'adaptation', 'adaptación', 'climate', 'resilience', 'resiliencia', 'food', 'alimentaria'],
    source: 'Portafolio · Publicaciones',
    es: { title: '"¿Cómo nos preparamos para un colapso climático?" (C. Miranda y D. Santander)', org: 'El Regionalista · Fundación Suelo' },
    en: { title: '"How Do We Prepare for a Climate Collapse?" (C. Miranda & D. Santander)', org: 'El Regionalista · Fundación Suelo' }
  },
  {
    id: 'pub-kockrohwer-2024',
    section: 'publications',
    priority: 3,
    period: '2024',
    tags: ['soil', 'suelo', 'boden', 'agroecology', 'agroecología', 'agroökologie', 'organic', 'orgánica', 'agriculture', 'agricultura', 'landwirtschaft', 'policy', 'germany', 'alemania'],
    source: 'Portafolio · Publicaciones',
    es: { title: '"La tierra está en riesgo: ¡Inversiones para la agricultura orgánica ahora!" (con el diputado Dirk Kock-Rohwer)', org: 'Resumen.cl · Comestible.info' },
    en: { title: '"The Earth is at Risk: Investments for Organic Agriculture Now!" (with MP Dirk Kock-Rohwer)', org: 'Resumen.cl · Comestible.info' }
  },
  {
    id: 'pub-desconcierto-2025',
    section: 'publications',
    priority: 2,
    period: '2025',
    tags: ['degrowth', 'decrecimiento', 'economy', 'economía', 'journalism', 'periodismo', 'norway', 'noruega'],
    source: 'Portafolio · Publicaciones',
    es: { title: '"¿Países tan ricos que no quieren crecer más? Noruega y Decrecimiento"', org: 'El Desconcierto' },
    en: { title: '"Countries Too Rich to Grow? Norway & World Degrowth Summit"', org: 'El Desconcierto' }
  },
  {
    id: 'pub-olca-2025',
    section: 'publications',
    priority: 1,
    period: '2025',
    tags: ['essay', 'ensayo', 'ecology', 'ecología', 'philosophy', 'filosofía'],
    source: 'Portafolio · Publicaciones',
    es: { title: '"Ser libres al borde del abismo" (tetralogía de ensayos político-ecológicos)', org: 'OLCA' },
    en: { title: '"Being Free on the Brink of the Abyss" (four-part political-ecology essays)', org: 'OLCA' }
  },

  // -------------------------------------------------------------------- COURSES
  {
    id: 'crs-wsl-davos',
    section: 'courses',
    priority: 4,
    period: '2025',
    tags: ['biodiversity', 'biodiversidad', 'alpine', 'riparian', 'switzerland', 'suiza', 'schweiz', 'wetland', 'humedal'],
    source: 'Portafolio · Títulos (WSL Davos)',
    es: { title: 'BlueGreen Biodiversity Summit', org: 'WSL, Davos (Suiza)' },
    en: { title: 'BlueGreen Biodiversity Summit', org: 'WSL, Davos (Switzerland)' }
  },
  {
    id: 'crs-deal',
    section: 'courses',
    priority: 3,
    period: '2025',
    tags: ['doughnut', 'economy', 'economía', 'planetary boundaries', 'límites planetarios', 'planning', 'planificación', 'sustainability', 'sostenibilidad'],
    source: 'Portafolio · Títulos (DEAL Copenhague)',
    es: { title: 'Doughnut Economics Practitioner', org: 'DEAL, Copenhague (Dinamarca)' },
    en: { title: 'Doughnut Economics Practitioner', org: 'DEAL, Copenhagen (Denmark)' }
  },
  {
    id: 'crs-dresden',
    section: 'courses',
    priority: 2,
    period: '2024 – 2025',
    tags: ['justice', 'justicia', 'gerechtigkeit', 'governance', 'gobernanza', 'spatial planning', 'ordenamiento territorial', 'landscape', 'paisaje'],
    source: 'Portafolio · Títulos (Dresden)',
    es: { title: 'Interlinked Justice & Resilient Landscapes', org: 'Leibniz IOER, Dresden (Alemania)' },
    en: { title: 'Interlinked Justice & Resilient Landscapes', org: 'Leibniz IOER, Dresden (Germany)' }
  },
  {
    id: 'crs-permaculture',
    section: 'courses',
    priority: 3,
    period: '2023',
    tags: ['permaculture', 'permacultura', 'agroecology', 'agroecología', 'regenerative', 'regenerativa', 'design', 'diseño'],
    source: 'Portafolio · Títulos (EPAC, 80 h)',
    es: { title: 'Curso Certificado de Diseño en Permacultura (80 h)', org: 'EPAC Chile' },
    en: { title: 'Certified Permaculture Design Course (80 h)', org: 'EPAC Chile' }
  },
  {
    id: 'crs-cr2',
    section: 'courses',
    priority: 3,
    period: '2023',
    tags: ['coast', 'costa', 'küste', 'climate risk', 'riesgo climático', 'sea level', 'nivel del mar', 'hazard', 'resilience', 'resiliencia'],
    source: 'Portafolio · Títulos ((CR)2, 57 h)',
    es: { title: '3ª Escuela de Verano: Costas Resilientes (57 h)', org: '(CR)2, Universidad de Chile' },
    en: { title: '3rd Summer School: Resilient Coasts (57 h)', org: '(CR)2, Universidad de Chile' }
  },
  {
    id: 'crs-gis-r',
    section: 'courses',
    priority: 3,
    period: '2022',
    tags: ['gis', 'sig', 'r', 'remote sensing', 'teledetección', 'fernerkundung', 'qgis', 'arcgis', 'google earth engine', 'niche', 'nicho'],
    source: 'Portafolio · Títulos (Instituto Ambiental GIS, 20 h)',
    es: { title: 'Modelado de Nicho Ecológico, Teledetección y R (20 h)', org: 'Escuela Ambiental GIS' },
    en: { title: 'Ecological Niche Modeling, Remote Sensing & R (20 h)', org: 'Environmental GIS Institute' }
  },
  {
    id: 'crs-censat',
    section: 'courses',
    priority: 2,
    period: '2022',
    tags: ['green economy', 'economía verde', 'carbon markets', 'mercados de carbono', 'nature', 'naturaleza', 'finance', 'financiarización'],
    source: 'Portafolio · Títulos (CENSAT Agua Viva, 16 h)',
    es: { title: 'Economía Verde y Financiarización de la Naturaleza (16 h)', org: 'CENSAT Agua Viva' },
    en: { title: 'Green Economy & Financialization of Nature (16 h)', org: 'CENSAT Agua Viva' }
  },
  {
    id: 'crs-rewilding-aljezur',
    section: 'courses',
    priority: 3,
    period: '2024',
    tags: ['rewilding', 'gestión forestal', 'storymaps', 'portugal', 'aljezur', 'fire resilience'],
    source: 'Portafolio · Títulos (Plano de Gestão Florestal & StoryMaps, Aljezur, Portugal, 2024)',
    es: { title: 'Rewilding & Gestión Forestal (Plano de Gestão Florestal & StoryMaps)', org: 'Município de Aljezur, Portugal' },
    en: { title: 'Rewilding & Forest Management (Plano de Gestão Florestal & StoryMaps)', org: 'Municipality of Aljezur, Portugal' }
  },

  // --------------------------------------------------------------------- SKILLS
  {
    id: 'skl-data-gis',
    section: 'skills',
    priority: 5,
    tags: ['python', 'r', 'qgis', 'arcgis', 'google earth engine', 'gee', 'postgis', 'postgresql', 'sql', 'docker', 'git', 'delft3d', 'latex', 'typst', 'gis', 'sig', 'geospatial', 'geoespacial', 'data', 'datos'],
    source: 'Portafolio · Capacidades técnicas',
    es: { title: 'Datos y SIG', short: 'Python (GeoPandas, NumPy, SciPy, Rasterio, GDAL), R, QGIS, ArcGIS Pro, Google Earth Engine, PostgreSQL/PostGIS, Docker, Git/GitHub, Delft3D, LaTeX/Typst.' },
    en: { title: 'Data & GIS', short: 'Python (GeoPandas, NumPy, SciPy, Rasterio, GDAL), R, QGIS, ArcGIS Pro, Google Earth Engine, PostgreSQL/PostGIS, Docker, Git/GitHub, Delft3D, LaTeX/Typst.' }
  },
  {
    id: 'skl-field',
    section: 'skills',
    priority: 5,
    tags: ['ert', 'resistivity', 'resistividad', 'syscal', 'li-cor', 'eddy covariance', 'flux', 'flujo', 'chamber', 'cámara', 'piezometer', 'piezómetro', 'drone', 'dron', 'fieldwork', 'terreno', 'gelände', 'soil', 'suelo', 'boden'],
    source: 'Portafolio · Instrumental de campo',
    es: { title: 'Instrumental de campo', short: 'Syscal Pro (ERT), LI-COR LI-7500/LI-7700 (Eddy Covariance), cámaras de flujo de suelo, CTD Divers y piezómetros, barrenos Edelman, drones con sensores multiespectrales.' },
    en: { title: 'Field instrumentation', short: 'Syscal Pro (ERT), LI-COR LI-7500/LI-7700 (Eddy Covariance), soil flux chambers, CTD Divers & piezometers, Edelman augers, drones with multispectral sensors.' }
  },
  {
    id: 'skl-web',
    section: 'skills',
    priority: 3,
    tags: ['typescript', 'react', 'next.js', 'fastapi', 'unity', 'three.js', 'web', 'api', 'frontend', 'full-stack', 'developer', 'desarrollador', 'software'],
    source: 'Portafolio · Capacidades técnicas',
    es: { title: 'Desarrollo web', short: 'TypeScript, React, Next.js, FastAPI, Unity 3D.' },
    en: { title: 'Web development', short: 'TypeScript, React, Next.js, FastAPI, Unity 3D.' }
  },

  // ------------------------------------------------------------------ LANGUAGES
  {
    id: 'lng-all',
    section: 'languages',
    priority: 5,
    core: true,
    tags: ['spanish', 'español', 'spanisch', 'english', 'inglés', 'englisch', 'german', 'alemán', 'deutsch'],
    source: 'Portafolio · Capacidades (idiomas)',
    es: { title: 'Idiomas', short: 'Español (nativo) · Inglés (C2) · Alemán (B1–B2)' },
    en: { title: 'Languages', short: 'Spanish (native) · English (C2) · German (B1–B2)' }
  }
];

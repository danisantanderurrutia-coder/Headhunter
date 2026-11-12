import type { MasterProfile } from '../types/profile';
import type { JobOffer } from '../types/offers';
import type { CompanyDossier } from '../types/companies';
import type { ApplicationItem } from '../types/applications';
import type { JobSource } from '../types/sources';
import type { CVTemplateInfo, CVVersion } from '../types/cv';
import { calculateMatchScore } from './matchEngine';
import { THUENEN_TECHWORMS_DOSSIER, UBA_KILAB_DOSSIER } from './jobWingmanService';

export const cvTemplatesList: CVTemplateInfo[] = [
  {
    id: 'es_standard',
    name: 'Español Estándar (1-2 pág.)',
    language: 'es',
    pages: '1-2 pág.',
    description: 'Formato profesional ideal para empresas en España y Bizkaia.',
    targetAudience: 'Empresas locales y multinacionales en España',
    accentColor: '#10b981'
  },
  {
    id: 'en_tech',
    name: 'English Tech (Modern 1 pág.)',
    language: 'en',
    pages: '1 pág.',
    description: 'Impactful 1-page modern layout for international research & tech.',
    targetAudience: 'International research centers & NGOs',
    accentColor: '#0ea5e9'
  },
  {
    id: 'de_two_page',
    name: 'German Business Lebenslauf (2 pág.)',
    language: 'de',
    pages: '2 pág.',
    description: 'Ausführlicher Lebenslauf im deutschen Standardformat.',
    targetAudience: 'Unternehmen in Deutschland, Österreich & Schweiz',
    accentColor: '#8b5cf6'
  },
  {
    id: 'de_short',
    name: 'German Kurzlebenslauf (1 pág.)',
    language: 'de',
    pages: '1 pág.',
    description: 'Kompakter Kurzlebenslauf für Initiativbewerbungen.',
    targetAudience: 'Kurzbewerbungen & Netzwerkkontakte',
    accentColor: '#f59e0b'
  },
  {
    id: 'europass',
    name: 'Europass Oficial UE (2-3 pág.)',
    language: 'en',
    pages: '2-3 pág.',
    description: 'European standard format for public calls, EU institutions and R&D.',
    targetAudience: 'EU public calls, European institutions & Horizon projects',
    accentColor: '#06b6d4'
  },
  {
    id: 'ats_clean',
    name: 'ATS Friendly Clean Text',
    language: 'es',
    pages: '1-2 pág.',
    description: 'Texto estructurado optimizado para escáneres ATS sin tablas complejas.',
    targetAudience: 'Portales automatizados (Workday, Greenhouse, Lever)',
    accentColor: '#64748b'
  },
  {
    id: 'academic_ngo',
    name: 'Académico / ONG / I+D',
    language: 'es',
    pages: '2-3 pág.',
    description: 'Énfasis en publicaciones, conferencias e impacto social.',
    targetAudience: 'Universidades, centros de investigación y ONGs',
    accentColor: '#ec4899'
  }
];

export const initialProfile: MasterProfile = {
  fullName: 'DANIEL SEBASTIÁN SANTANDER URRUTIA',
  email: 'danisantander.urrutia@gmail.com',
  phone: '+4917676497440',
  location: 'Kiel, Alemania / Bilbao, Bizkaia / Chile',
  linkedin: 'https://www.linkedin.com/in/santanderurrutia/',
  github: 'https://github.com/danisantanderurrutia-coder',
  portfolio: 'https://danisantanderurrutia-coder.github.io/portafolio/',
  preferredCity: 'Bilbao',
  locationPreferences: [
    { city: 'Bilbao / Bizkaia (Preferencia Residencia)', country: 'España', isPreferredHome: true, scoreMultiplier: 1.0, openToRemote: true, openToRelocation: false },
    { city: 'Euskadi / Donostia / Vitoria', country: 'España', isPreferredHome: true, scoreMultiplier: 1.0, openToRemote: true, openToRelocation: true },
    { city: 'Kiel / Hannover / Alemania', country: 'Alemania', isPreferredHome: false, scoreMultiplier: 0.95, openToRemote: true, openToRelocation: true },
    { city: 'Europa (Remoto / Institutos de Investigación)', country: 'Europa / UE', isPreferredHome: false, scoreMultiplier: 0.95, openToRemote: true, openToRelocation: false }
  ],
  targetRoles: [
    { id: 'tr-1', title: 'Científico Ambiental / Investigador Biofísico (Suelos & GEI)', minSalaryExpected: 42000, desiredSalary: 55000, seniorityLevel: 'Senior', keywords: ['Suelos', 'GEI', 'Eddy Covariance', 'R', 'GIS'] },
    { id: 'tr-2', title: 'Asesor en Políticas Ambientales y Gobernanza del Territorio', minSalaryExpected: 42000, desiredSalary: 52000, seniorityLevel: 'Senior', keywords: ['Gobernanza', 'Incidencia', 'Políticas Clima', 'Cuencas'] },
    { id: 'tr-3', title: 'Especialista en Teledetección y Modelación Espacial', minSalaryExpected: 40000, desiredSalary: 50000, seniorityLevel: 'Mid-Senior', keywords: ['QGIS', 'Python', 'Google Earth Engine', 'SWAT'] },
    { id: 'tr-4', title: 'Director de Campañas & Estratega de Comunicación Científica', minSalaryExpected: 40000, desiredSalary: 52000, seniorityLevel: 'Lead / Director', keywords: ['Comunicaciones', 'Campañas', 'Incidencia', 'Territorio'] }
  ],
  minSalary: 40000,
  desiredSalary: 52000,
  summary: 'Geofísico (Universidad de Chile, Licenciatura aprobada Con Distinción) y doble Máster en Ciencias en Manejo Ambiental (CAU Kiel, Alemania) y Protección Ambiental (AMU Poznań, Polonia). Integra investigación cuantitativa y mediciones de terreno en hidrogeofísica y flujos de gases de efecto invernadero (Eddy Covariance y cámaras cerradas en turberas templadas de Wallener Au) con modelación computacional, desarrollo de gemelos digitales (Wetland Monitor, AgriTwin, Rewilding Field Suite), testimonio pericial ante la Cámara de Diputadas y Diputados de Chile en prevención de megaincendios y ordenamiento de cuencas, y dirección de campañas de comunicación masiva y periodismo de investigación (+700k audiencia).',
  experiences: [
    {
      id: 'exp-cau-kiel',
      company: 'Christian-Albrechts-Universität zu Kiel & Adam Mickiewicz University',
      role: 'Investigador en Hidrogeofísica, Suelos y Dinámica de GEI en Turberas',
      location: 'Kiel (Alemania) / Poznań (Polonia)',
      startDate: '2023',
      endDate: 'Presente',
      isCurrent: true,
      summary: 'Cuantificación empírica de flujos de gases de efecto invernadero (CO2, CH4) en la turbera templada rehumedecida Wallener Au (Schleswig-Holstein) mediante torres micrometeorológicas de covarianza de torbellinos (Eddy Covariance) y cámaras de flujo cerrado. Caracterización hidrofísica y de suelos (curvas de retención hídrica, porosidad y dinámica de humedad edáfica) bajo legado de drenaje y manejo agrícola. Monitoreo limnológico de calidad de agua y bioindicadores en lagos y estanques de Poznań bajo la Directiva Marco del Agua de la UE. Desarrollo del gemelo digital y visor 3D "Wetland Monitor".',
      achievements: [
        'Cuantificación continua de balances de carbono y detección de picos de emisión de CH4 en turberas rehumedecidas bajo forzantes micrometeorológicos.',
        'Caracterización de curvas de retención hídrica y estructura edáfica para evaluar la dinámica hidrológica del suelo bajo rehumedecimiento.',
        'Desarrollo y publicación del gemelo digital 3D "Wetland Monitor" con simulador diurno/estacional de balances de carbono.',
        'Evaluación limnológica y de bioindicadores in situ y en laboratorio en lagos y estanques de Polonia (AMU Poznań) según la Directiva Marco del Agua.'
      ],
      technologies: ['R', 'Python', 'QGIS', 'Eddy Covariance', 'Cámaras de Flujo', 'Física de Suelos', 'Directiva Marco del Agua', 'Three.js'],
      isVerified: true
    },
    {
      id: 'exp-uchile-geophysics',
      company: 'Universidad de Chile (Facultad de Ciencias Físicas y Matemáticas - FCFM)',
      role: 'Geofísico de Terreno & Modelación Hidrogeofísica de Cuencas',
      location: 'Santiago & Cuenca del Maule, Chile',
      startDate: '2015',
      endDate: '2021',
      isCurrent: false,
      summary: 'Investigación cuantitativa y trabajo de terreno en física de la Tierra e hidrogeofísica aplicada. Memoria de título aprobada Con Distinción centrada en la Cuenca del Río Maule: campañas de adquisición e inversión de resistividad eléctrica del subsuelo (Sondeos Eléctricos Verticales - SEV) y prospección gravimétrica, cuantificando la relación entre el avance de monocultivos forestales industriales, sequía por cambio climático y el abatimiento sostenido del nivel freático.',
      achievements: [
        'Aprobación de la memoria y título de Geofísico Con Distinción por la Universidad de Chile.',
        'Diseño y ejecución de campañas de prospección con Sondeos Eléctricos Verticales (SEV) y gravimetría en la Cuenca del Maule.',
        'Modelación de la dinámica de recarga y abatimiento del nivel freático frente a plantaciones forestales y déficit de precipitaciones.'
      ],
      technologies: ['Sondeos Eléctricos Verticales (SEV)', 'Gravimetría', 'Python', 'Inversión Geofísica', 'Hidrología Subterránea', 'MATLAB'],
      isVerified: true
    },
    {
      id: 'exp-advocacy-policy',
      company: 'Cámara de Diputadas y Diputados de Chile & Asesoría Legislativa en Cuencas',
      role: 'Expositor Técnico Parlamentario & Asesor en Políticas de Cuencas y Desastres',
      location: 'Valparaíso / Santiago, Chile & Europa',
      startDate: '2021',
      endDate: 'Presente',
      isCurrent: true,
      summary: 'Asesoría técnica parlamentaria y comunitaria sobre políticas públicas de prevención de megaincendios, gestión integrada del agua y transición ecológica territorial. Comparecencia oficial como perito técnico ante la Comisión Especial de Emergencia, Desastres y Bomberos de la Cámara de Diputadas y Diputados de Chile, fundamentando la relación biofísica estructural entre monocultivos forestales y riesgo de incendios. Redacción técnica de propuestas de ordenamiento por cuencas y salvaguardias en el proceso constitucional chileno.',
      achievements: [
        'Testimonio oficial ante la Cámara de Diputadas y Diputados de Chile sobre causalidad territorial del riesgo de incendios forestales.',
        'Redacción de propuestas normativas sobre ordenamiento de cuencas hidrográficas y protección ecosistémica ante la Convención Constitucional.',
        'Asesoría técnica y legal a Comités de Agua Potable Rural (APR) y asambleas territoriales en derechos hídricos.'
      ],
      technologies: ['Incidencia Legislativa', 'Políticas Públicas', 'Gobernanza de Cuencas', 'Salvaguardias Ambientales', 'Ordenamiento Territorial'],
      isVerified: true
    },
    {
      id: 'exp-biomass-epn',
      company: 'Environmental Paper Network (EPN) & Global Forest Coalition',
      role: 'Autor Técnico Principal & Investigador de Impactos de Biomasa Forestal',
      location: 'Internacional / Chile & Europa',
      startDate: '2023',
      endDate: '2023',
      isCurrent: false,
      summary: 'Investigación internacional independiente y autoría principal del informe "Spotlight on Burning Biomass for Energy in South America: Community Opposition to a Power Plant in Parral, Chile". Análisis riguroso de vacíos metodológicos en la contabilidad de carbono de la biomasa forestal, desmintiendo la neutralidad climática y fiscalizando los subsidios de energía renovable otorgados bajo directivas europeas (RED III y ETS). Coordinación multiactor con redes socioambientales globales.',
      achievements: [
        'Publicación internacional como Autor Principal del informe técnico de caso EPN (Parral, Maule).',
        'Demostración de los vacíos en los balances de carbono de centrales de bioenergía y su impacto en la salud comunitaria.',
        'Presentación y difusión internacional del informe en redes de monitoreo de biomasa y políticas forestales en Europa y Latinoamérica.'
      ],
      technologies: ['Contabilidad de Carbono', 'Directiva UE RED III / ETS', 'Bioenergía', 'Salvaguardias Forestales', 'Facilitación Multiactor'],
      isVerified: true
    },
    {
      id: 'exp-apruebo-rural',
      company: 'Campaña Nacional "Apruebo Rural"',
      role: 'Coordinador General de Campaña y Director de Prensa Nacional',
      location: 'Chile (14 Regiones)',
      startDate: '2020',
      endDate: '2023',
      isCurrent: false,
      summary: 'Lideró la coordinación general de la campaña comunicacional y despliegue territorial de "Apruebo Rural" (2020-2023), articulando a pequeños agricultores familiares campesinos, comités de agua potable rural (APR) y poblados cercados por monocultivos forestales con las cadenas nacionales de TV, radios comunales y masivos actos públicos, coordinando el histórico acto de cierre de campaña con miles de familias rurales.',
      achievements: [
        'Gira nacional por 14 regiones del centro y sur de Chile realizando más de 80 asambleas y encuentros comunales.',
        'Creación de escuelas de formación digital y webinars de verificación de datos (fact-checking) para informar a comunidades rurales.',
        'Publicación de más de 60 columnas de opinión, notas en televisión y especiales radiales sobre soberanía del agua y agroecología.',
        'Distribución de más de 500.000 volantes y kits pedagógicos en terreno y organización del acto de cierre de campaña.'
      ],
      technologies: ['Dirección de Campañas', 'Comunicaciones Estratégicas', 'Storytelling Transmedia', 'Coordinación Multiactor', 'Producción Audiovisual'],
      isVerified: true
    },
    {
      id: 'exp-primera-linea-prensa',
      company: 'Primera Línea Prensa & Red Maule Sur',
      role: 'Fundador, Director Editorial & Periodista de Investigación Socioambiental',
      location: 'Chile',
      startDate: '2019',
      endDate: '2023',
      isCurrent: false,
      summary: 'Cofundador y director editorial de medio digital independiente enfocado en periodismo ciudadano, crisis climática, desastres forestales y derechos humanos, alcanzando más de 700.000 seguidores orgánicos en redes sociales. Panelista semanal en Radio Cristalina (96.3 FM) y MauleRed. Diseñador y relator del "Taller de Corresponsales Populares", capacitando y certificando a 45 vecinos rurales en reportería móvil, ética y verificación de hechos.',
      achievements: [
        'Crecimiento de audiencia digital de 0 a +700.000 seguidores en redes sociales con millones de impresiones mensuales.',
        'Capacitación y graduación de 45 corresponsales ciudadanos rurales a través del Taller de Comunicación Popular.',
        'Publicación de investigaciones y columnas en Tomate Rojo, El Desconcierto, Resumen.cl, El Regionalista y OLCA.'
      ],
      technologies: ['Periodismo de Investigación', 'Dirección Editorial', 'Radio & Podcasts', 'Gestión de Redes Sociales', 'Fact-Checking', 'Capacitación'],
      isVerified: true
    }
  ],
  education: [
    {
      id: 'edu-msc-kiel',
      institution: 'Christian-Albrechts-Universität zu Kiel (CAU Kiel, Alemania)',
      degree: 'M.Sc. en Manejo Ambiental (Environmental Management)',
      fieldOfStudy: 'Ciencias Ambientales, Hidrofísica de Suelos, Flujos de GEI y Manejo de Cuencas',
      startDate: '2023',
      endDate: '2026',
      location: 'Kiel, Alemania',
      isVerified: true
    },
    {
      id: 'edu-msc-amu',
      institution: 'Adam Mickiewicz University (AMU Poznań, Polonia)',
      degree: 'M.Sc. en Protección Ambiental (Environmental Protection)',
      fieldOfStudy: 'Limnología, Bioindicadores Acuáticos y Directiva Marco del Agua de la UE',
      startDate: '2023',
      endDate: '2026',
      location: 'Poznań, Polonia',
      isVerified: true
    },
    {
      id: 'edu-geophysics-uchile',
      institution: 'Universidad de Chile (Facultad de Ciencias Físicas y Matemáticas - FCFM)',
      degree: 'Geofísico y Licenciado en Ciencias, mención Geofísica (Con Distinción)',
      fieldOfStudy: 'Geofísica de la Tierra Sólida, Hidrogeofísica, Sondeos Eléctricos (SEV) y Fluidodinámica',
      startDate: '2015',
      endDate: '2021',
      location: 'Santiago, Chile',
      grade: 'Aprobado Con Distinción',
      isVerified: true
    }
  ],
  skills: [
    { id: 'sk-1', name: 'Python (GeoPandas, NumPy, SciPy, Rasterio, GDAL)', category: 'Tech', level: 'Experto', yearsOfExperience: 6 },
    { id: 'sk-2', name: 'QGIS & ArcGIS Pro (LiDAR, DEMs, Hidrogeología)', category: 'Tools', level: 'Experto', yearsOfExperience: 6 },
    { id: 'sk-3', name: 'R (sf, ggplot2, Series Temporales, Modelado Ecológico)', category: 'Tech', level: 'Avanzado', yearsOfExperience: 5 },
    { id: 'sk-4', name: 'Google Earth Engine (GEE, Sentinel-2, Landsat)', category: 'Tech', level: 'Avanzado', yearsOfExperience: 4 },
    { id: 'sk-5', name: 'Delft3D / Modelación Hidrodinámica 2D Costera', category: 'Domain', level: 'Avanzado', yearsOfExperience: 3 },
    { id: 'sk-6', name: 'Torres Eddy Covariance & Flujos GEI (LI-COR)', category: 'Domain', level: 'Avanzado', yearsOfExperience: 3 },
    { id: 'sk-7', name: 'Tomografía Eléctrica ERT & Sondeos SEV (Syscal Pro)', category: 'Domain', level: 'Experto', yearsOfExperience: 6 },
    { id: 'sk-8', name: 'Física y Mecánica de Suelos (Curvas de Retención & Hidrofísica)', category: 'Domain', level: 'Avanzado', yearsOfExperience: 3 },
    { id: 'sk-9', name: 'Limnología, Bioindicadores & Directiva Marco del Agua', category: 'Domain', level: 'Avanzado', yearsOfExperience: 3 },
    { id: 'sk-10', name: 'TypeScript, React & Gemelos Digitales 3D', category: 'Tech', level: 'Avanzado', yearsOfExperience: 4 },
    { id: 'sk-11', name: 'FastAPI, Docker & PostgreSQL / PostGIS', category: 'Tech', level: 'Avanzado', yearsOfExperience: 3 },
    { id: 'sk-12', name: 'Unity 3D (Simulación Ciberfísica & UN Citiverse)', category: 'Tech', level: 'Avanzado', yearsOfExperience: 3 },
    { id: 'sk-13', name: 'LaTeX / Typst (Tipografía Científica y Tesis)', category: 'Tools', level: 'Experto', yearsOfExperience: 5 },
    { id: 'sk-14', name: 'Incidencia Legislativa & Políticas de Cuencas', category: 'Soft', level: 'Experto', yearsOfExperience: 6 },
    { id: 'sk-15', name: 'Dirección de Campañas Masivas & Medios (+700k)', category: 'Soft', level: 'Experto', yearsOfExperience: 5 }
  ],
  languages: [
    { id: 'lang-1', language: 'Español', proficiency: 'Nativo', certificate: 'Nativo — Oratoria pública, vocería parlamentaria, redacción editorial y legislativa' },
    { id: 'lang-2', language: 'Inglés', proficiency: 'C2', certificate: 'C2 — Competencia Bilingüe y Profesional Completa (Nivel C2 Operativo y Académico)' },
    { id: 'lang-3', language: 'Alemán', proficiency: 'B1', certificate: 'B1 / B2 — M.Sc. en CAU Kiel, comunicación técnica y trabajo en Alemania' }
  ],
  achievementsBank: [
    {
      id: 'ach-1',
      title: 'Dictamen Pericial ante Comisión de Emergencia y Bomberos de la Cámara',
      description: 'Fundamentación física y cartográfica de la correlación estructural entre plantaciones forestales y megaincendios, incorporada formalmente a las actas legislativas del Congreso Nacional de Chile.',
      metrics: 'Intervención Legislativa Oficial',
      tags: ['Congreso', 'Incendios', 'Modelo Forestal', 'Cuencas'],
      date: '2024-03-01',
      isVerified: true
    },
    {
      id: 'ach-2',
      title: 'Distinción Semifinalista Global ONU Citiverse Challenge (SDG Cities)',
      description: 'Selección internacional por Naciones Unidas por el gemelo digital Smart Food Parks integrando agro-IoT, microclima urbano y teledetección espacial Sentinel-2.',
      metrics: 'Semifinalista Internacional ONU',
      tags: ['UN', 'Gemelo Digital', 'IoT', 'Resiliencia', 'SDG Cities'],
      date: '2024-11-01',
      isVerified: true
    },
    {
      id: 'ach-3',
      title: 'Taller de Corresponsales Populares en Territorio',
      description: 'Creación y relatoría del taller de reportería comunitaria móvil y ética, capacitando y certificando a más de 45 voceros y vecinos rurales frente a la crisis hídrica en Maule Sur.',
      metrics: '45+ Corresponsales Capacitados',
      tags: ['Educación Popular', 'Maule Sur', 'Reportería Móvil', 'Medios'],
      date: '2021-12-01',
      isVerified: true
    },
    {
      id: 'ach-4',
      title: 'Autor Principal en Investigación Internacional EPN sobre Carbono y RED III',
      description: 'Autoría principal del informe internacional de EPN que expuso los vacíos contables de carbono y las falsas declaraciones de energía renovable en bioenergía forestal (Parral) frente a las directivas europeas RED III y ETS.',
      metrics: 'Lead Author // Informe Internacional EPN',
      tags: ['Biomasa', 'Carbono', 'RED III', 'EPN'],
      date: '2023-06-01',
      isVerified: true
    },
    {
      id: 'ach-5',
      title: 'Caracterización Hidrofísica y Dinámica de Poros en Turberas Templadas',
      description: 'Análisis cuantitativo de curvas de retención hídrica, volumen de poros y dinámica de humedad edáfica en turberas templadas de Wallener Au en laboratorio de la CAU Kiel.',
      metrics: 'Curvas de retención & balance hídrico',
      tags: ['Física de Suelos', 'Turberas', 'Wallener Au', 'CAU Kiel', 'Hidrología'],
      date: '2024-05-01',
      isVerified: true
    },
    {
      id: 'ach-6',
      title: 'Licenciatura y Título de Geofísico Aprobados Con Distinción (U. de Chile)',
      description: 'Distinción máxima otorgada por la FCFM por la investigación cuantitativa de campo con Sondeos Eléctricos Verticales (SEV) y gravimetría en la Cuenca del Maule.',
      metrics: 'Aprobado Con Distinción',
      tags: ['Geofísica', 'UChile', 'SEV', 'Hidrogeofísica', 'Maule'],
      date: '2021-04-01',
      isVerified: true
    },
    {
      id: 'ach-7',
      title: 'Coordinación Logística de Emergencia "Solo el pueblo ayuda al pueblo"',
      description: 'Despliegue operativo de centros de acopio y caravanas 4x4 transportando decenas de toneladas de víveres, agua potable y herramientas a comunidades rurales damnificadas en 4 regiones.',
      metrics: 'Despliegue en 4 Regiones // Caravanas 4x4',
      tags: ['Emergencias', 'Solidaridad Popular', 'Catástrofes', 'Maule Sur'],
      date: '2023-03-01',
      isVerified: true
    },
    {
      id: 'ach-8',
      title: 'Dirección de Campaña Nacional Transmedia "Apruebo Rural"',
      description: 'Liderazgo de campaña transmedia y articulación político-territorial: despliegue en 14 regiones con 80+ asambleas comunales, organización del histórico acto de cierre nacional, colocación de 60+ columnas y coberturas en medios, y distribución de 500K+ kits y volantes pedagógicos.',
      metrics: '14 Regiones // 80+ Asambleas // 500K+ Kits',
      tags: ['Apruebo Rural', 'Gobernanza del Agua', 'Movilización'],
      date: '2022-09-01',
      isVerified: true
    }
  ],
  otherCourses: [
    'BlueGreen Biodiversity Summit (WSL Swiss Federal Research Institute, Davos, Suiza, 2025)',
    'Interlinked Justice & Resilient Landscapes (Leibniz Institute IOER, Dresden, Alemania, 2024–2025)',
    'Doughnut Economics Practitioner (DEAL Doughnut Economics Action Lab, Copenhague, Dinamarca, 2025)',
    'Rewilding & Gestión Forestal (Plano de Gestão Florestal & StoryMaps, Aljezur, Portugal, 2024)',
    'Curso Certificado de Diseño en Permacultura - CDP (Escuela de Permacultura Aplicada Chile - EPAC & Fundación Suelo, 2023, 80 h)',
    '3ª Escuela de Verano: Costas Resilientes ((CR)2, Universidad de Chile, 2023, 57 h, dir. René Garreaud)',
    'Modelado de Nicho Ecológico, Teledetección y R (Instituto Ambiental GIS, 2022, 20 h)',
    'Economía Verde y Financiarización de la Naturaleza (Censat Agua Viva & Amigos de la Tierra Internacional, Bogotá, Colombia, 2022, 16 h)'
  ],
  publications: [
    {
      id: 'pub-epn-parral-biomass',
      title: 'Spotlight on Burning Biomass: Community Opposition to Power Plant in Parral, Chile',
      outlet: 'Environmental Paper Network (EPN) & Global Forest Coalition',
      date: '2023',
      url: 'https://environmentalpaper.org/2023/06/spotlight-on-burning-biomass-for-energy-in-south-america-community-opposition-to-a-power-plant-in-parral-chile/',
      category: 'policy',
      summary: 'Investigación internacional como Autor Principal sobre la oposición comunitaria a la incineración de biomasa forestal en Parral (Maule), desmintiendo la neutralidad de carbono y fiscalizando subsidios europeos (RED III).',
      tags: ['EPN', 'Parral', 'Maule', 'Biomasa', 'RED III', 'Carbon Accounting']
    },
    {
      id: 'pub-tomaterojo-humedales',
      title: '¡Aguas, aguas! Humedales bajo fuego: ¿Qué sabemos y qué está haciendo Chile?',
      outlet: 'Tomate Rojo // Red Plurinacional de Humedales (D. Santander, L. Muñoz, C. Bonifetti)',
      date: '2023',
      url: 'https://tomaterojo.cl/aguas-aguas-humedales-bajo-fuego-que-sabemos-y-que-esta-haciendo-chile/',
      category: 'press',
      summary: 'Investigación colaborativa con la Red Plurinacional de Humedales sobre el impacto devastador de los megaincendios forestales en ecosistemas de humedales y turberas en Chile.',
      tags: ['Humedales', 'Incendios', 'Agua', 'Tomate Rojo', 'Turberas']
    },
    {
      id: 'pub-kock-rohwer-soils',
      title: 'La tierra está en riesgo: ¡Inversiones para la agricultura orgánica ahora!',
      outlet: 'Resumen.cl & Comestible.info (con el diputado Dirk Kock-Rohwer)',
      date: '2024',
      url: 'https://comestible.info/inversiones-para-la-agroecologia-ahora/',
      category: 'policy',
      summary: 'Columna parlamentaria conjunta con el diputado de Los Verdes Dirk Kock-Rohwer (Schleswig-Holstein) sobre fertilidad orgánica de suelos, agroecología y subsidios a la transición sin pesticidas.',
      tags: ['Dirk Kock-Rohwer', 'Alemania', 'Suelos', 'Agroecología', 'Políticas Públicas']
    },
    {
      id: 'pub-el-regionalista-colapso',
      title: '¿Cómo nos preparamos para un colapso climático?',
      outlet: 'El Regionalista & Fundación Suelo (Carolina Miranda y Daniel Santander)',
      date: '2023',
      url: 'https://elregionalista.cl/como-nos-preparamos-para-un-colapso-climatico/',
      category: 'press',
      summary: 'Columna de análisis prospectivo sobre adaptación comunitaria profunda, regeneración de suelos y soberanía territorial frente al colapso ecológico.',
      tags: ['El Regionalista', 'Fundación Suelo', 'Adaptación', 'Suelos']
    },
    {
      id: 'pub-desconcierto-noruega',
      title: '¿Países tan ricos que no quieren crecer más? Noruega y Decrecimiento',
      outlet: 'El Desconcierto // Periodismo de Investigación Internacional',
      date: '2025',
      url: 'https://eldesconcierto.cl/2025/07/06/paises-tan-ricos-que-no-quieren-crecer-mas-noruega-acoge-mayor-debate-mundial-sobre-alternativas-al-crecimiento-economico-infinito',
      category: 'press',
      summary: 'Crónica especial de investigación desde Oslo sobre la conferencia mundial de decrecimiento, post-extractivismo y los límites ecológicos del crecimiento infinito.',
      tags: ['El Desconcierto', 'Noruega', 'Decrecimiento', 'Oslo', 'Economía Ecológica']
    },
    {
      id: 'pub-delfino-costa-rica',
      title: 'Jóvenes activistas climáticos de Latinoamérica tuvieron encuentro en Costa Rica',
      outlet: 'Delfino.cr // Cobertura de Justicia Climática Internacional',
      date: '2023',
      url: 'https://delfino.cr/2023/04/jovenes-activistas-climaticos-de-latinoamerica-tuvieron-encuentro-de-trabajo-en-costa-rica',
      category: 'press',
      summary: 'Cobertura de prensa internacional sobre el encuentro de trabajo de líderes socioambientales de América Latina en San José de Costa Rica por justicia climática intergeneracional.',
      tags: ['Costa Rica', 'Delfino', 'Justicia Climática', 'San José']
    },
    {
      id: 'pub-olca-ser-libres',
      title: 'Ser libres al borde del abismo (Tetralogía de Ensayos Político-Ecológicos)',
      outlet: 'Observatorio Latinoamericano de Conflictos Ambientales (OLCA)',
      date: '2025',
      url: 'https://olca.cl/articulo/nota.php?id=111288',
      category: 'essays',
      summary: 'Obra ensayística de cuatro partes sobre crisis civilizatoria: 1. El colapso económico; 2. Se hunde el Titanic (agonía de los Estados); 3. Cariño, ¿qué nos pasó?; 4. La llamada de la selva (autonomía y ecología regenerativa).',
      tags: ['OLCA', 'Autonomía', 'Decrecimiento', 'Ecología Política']
    },
    {
      id: 'pub-climatecc-monocultures',
      title: 'Monocultivos Forestales y Falsas Soluciones Climáticas',
      outlet: 'ClimateCC // Portal Climático Internacional',
      date: '2024',
      url: 'https://www.climatecc.org/forests/tree-monocultures',
      category: 'essays',
      summary: 'Serie analítica internacional que disecciona los monocultivos forestales industriales, los créditos de carbono y las falsas soluciones climáticas.',
      tags: ['ClimateCC', 'Falsas Soluciones', 'Carbon Credits', 'Bosques']
    },
    {
      id: 'pub-libro-incendios',
      title: 'Libro Científico Internacional: Dinámica de Incendios y Monocultivos Forestales',
      outlet: 'Editor Principal & Coordinación Internacional Multiautor',
      date: '2024-2026',
      url: 'https://danisantanderurrutia-coder.github.io/portafolio/dossier',
      category: 'scientific',
      summary: 'Libro científico internacional multiautor que investiga la física de propagación de megaincendios, interacción suelo-combustible y vulnerabilidad de cuencas frente a monocultivos forestales industriales en Sudamérica y ecosistemas mediterráneos.',
      tags: ['Libro Científico', 'Megaincendios', 'Monocultivo Forestal', 'Hidrología de Cuencas']
    }
  ],
  conferences: [
    {
      id: 'conf-bonn-2025',
      title: 'Carbon Offsets e Impactos Socioecológicos de Monocultivos Forestales',
      event: 'Environmental Justice Conference (ENJUST)',
      location: 'Bonn, Alemania',
      date: '2025',
      role: 'Conferencista Internacional',
      summary: 'Presentación sobre los vacíos contables en proyectos de compensación de carbono y las consecuencias biofísicas de las plantaciones forestales a gran escala en el Sur Global.',
      tags: ['Bonn', 'Alemania', 'ENJUST', 'Carbon Offsets', 'Monocultivos']
    },
    {
      id: 'conf-oslo-2025',
      title: 'Alternativas al Crecimiento Infinito y Límites Biofísicos Planetarios',
      event: 'World Degrowth Conference',
      location: 'Oslo, Noruega',
      date: '2025',
      role: 'Ponente y Corresponsal Internacional',
      summary: 'Ponencia y despacho de investigación periodística sobre post-extractivismo, soberanía ecológica y decrecimiento planificado en economías nórdicas y del sur.',
      tags: ['Oslo', 'Noruega', 'Decrecimiento', 'Límites Planetarios']
    },
    {
      id: 'conf-bogota-2023',
      title: 'Conflictos de Uso de Suelo y Extracción de Biomasa en América Latina',
      event: 'Foro Latinoamericano y del Caribe de Transición Justa',
      location: 'Bogotá, Colombia',
      date: '2023',
      role: 'Panelista Invitado',
      summary: 'Mesa de discusión multilateral sobre impactos del modelo agroforestal, estrés hídrico en cuencas rurales y transición energética justa.',
      tags: ['Bogotá', 'Colombia', 'Biomasa', 'Uso de Suelo', 'Transición Justa']
    },
    {
      id: 'conf-sanjose-2023',
      title: 'Gobernanza Hídrica Intergeneracional y Justicia Climática',
      event: 'Cumbre Latinoamericana de Líderes Socioambientales',
      location: 'San José, Costa Rica',
      date: '2023',
      role: 'Delegado por Chile',
      summary: 'Mesas de articulación internacional de jóvenes líderes socioambientales para la defensa de cuencas hidrográficas y salvaguardias ambientales vinculantes.',
      tags: ['Costa Rica', 'San José', 'Justicia Climática', 'Gobernanza Hídrica']
    }
  ],
  keyProjects: [
    {
      id: 'proj-agritwin',
      title: 'Chile Agrotech & Plataforma AgriTwin',
      role: 'Lead Architect & Systems Modeler',
      period: '2023 – Presente',
      category: 'Agrotech, IoT & Satélites',
      description: 'Gemelo digital de telemetría de suelo IoT LoRaWAN combinado con pipeline automatizado de índices satelitales Copernicus Sentinel-2 (NDVI/NDRE) para prevención de estrés hídrico en viticultura del Maule.',
      deliverables: [
        'Dashboard de telemetría de humedad y potencial mátrico de suelo en tiempo real',
        'Pipeline automatizado de índices multiespectrales Sentinel-2 (Copernicus)',
        'Diseño hidrológico Keyline para retención de agua en laderas agrícolas'
      ],
      techStack: ['Python', 'Sentinel-2 API', 'IoT LoRaWAN', 'FastAPI', 'QGIS', 'PostGIS', 'Next.js'],
      githubUrl: 'https://github.com/danisantanderurrutia-coder/agritwin-app',
      url: 'https://danisantanderurrutia-coder.github.io/agritwin-app/'
    },
    {
      id: 'proj-wetland-monitor',
      title: 'Wetland Monitor (Gemelo Digital Wallener Au)',
      role: 'Full-Stack Developer & Modeler',
      period: '2023 – 2026',
      category: 'Gemelo Digital & Software Científico',
      description: 'Aplicación web interactiva que simula la transición entre sumidero y fuente de carbono en turberas templadas rehumedecidas con forzantes micrometeorológicos (Eddy Covariance) y dinámica hidrofísica edáfica.',
      deliverables: [
        'Simulador diurno y estacional de emisiones de CO2 y picos de CH4',
        'Visualizador interactivo del ecosistema de turbera y curvas de retención hídrica',
        'Integración de series temporales micrometeorológicas de torres de flujo'
      ],
      techStack: ['React', 'TypeScript', 'R', 'Eddy Covariance', 'Tailwind CSS'],
      githubUrl: 'https://github.com/danisantanderurrutia-coder/wetland-monitor',
      url: 'https://danisantanderurrutia-coder.github.io/wetland-monitor/'
    },
    {
      id: 'proj-rewild-resumof',
      title: 'ReWild: Analítica de Incendios & Mosaicos Nativos (Resumof)',
      role: 'Lead Spatial Developer & Modeler',
      period: '2023 – Presente',
      category: 'Analítica Forestal & Riesgo de Incendios',
      description: 'Sistema de soporte de decisión espacial para reemplazar monocultivos combustibles de pino/eucalipto por barreras cortafuego vivas de bosque esclerófilo nativo, modelando la amortiguación del fuego y la recuperación hídrica.',
      deliverables: [
        'Cartografía de carga de combustible en interfaz urbano-forestal (IUF)',
        'Algoritmos de optimización espacial para restauración de mosaicos nativos',
        'Aplicación web y móvil para monitoreo comunitario y soporte de decisión'
      ],
      techStack: ['Google Earth Engine', 'Python GIS', 'Sentinel-2', 'GeoPandas', 'Streamlit', 'Rasterio'],
      githubUrl: 'https://github.com/danisantanderurrutia-coder/resumof',
      url: 'https://danisantanderurrutia-coder.github.io/agrotech/rewild/rewilding-field-suite.html'
    },
    {
      id: 'proj-smart-food-parks',
      title: 'Smart Food Parks: Gemelo Digital & Agro-IoT Urbano',
      role: 'Co-Diseñador & Modelador Ciberfísico',
      period: '2024',
      category: 'Gemelo Digital & Sistemas Agroalimentarios',
      description: 'Gemelo digital y plataforma ciberfísica para soberanía alimentaria urbana, control microclimático y redes de sensores IoT, distinguida como Semifinalista Global en el UN Citiverse Challenge (SDG Cities) de Naciones Unidas.',
      deliverables: [
        'Gemelo digital en Unity 3D con visualización en tiempo real de torres hidropónicas verticales',
        'Arquitectura de telemetría micrometeorológica y radicular (LoRaWAN / MQTT)',
        'Algoritmos neuronales predictivos de rendimiento y microclima'
      ],
      techStack: ['Unity 3D', 'IoT Telemetry', 'MQTT', 'Python AI', 'Google Earth Engine', 'QGIS'],
      url: 'https://danisantanderurrutia-coder.github.io/portafolio/'
    },
    {
      id: 'proj-lauwersmeer-hydro',
      title: 'Lauwersmeer: Simulación Hidrodinámica 2D & Riesgo Costero',
      role: 'Investigador & Modelador Hidrodinámico (CAU Kiel)',
      period: '2023 – 2024',
      category: 'Ingeniería Costera & Modelación Numérica',
      description: 'Plataforma de modelación hidrodinámica 2D en Delft3D para simular marejadas de tempestad, propagación de oleaje extremo y aumento del nivel del mar bajo escenarios climáticos IPCC en la cuenca del Mar de Wadden (Lauwersmeer, Países Bajos).',
      deliverables: [
        'Simulación hidrodinámica 2D de batimetría y oleaje extremo en Delft3D',
        'Cartografía de riesgo de inundación para periodos de retorno de 100 y 500 años',
        'Auditoría de vulnerabilidad de infraestructura crítica y diagnóstico de diques costeros'
      ],
      techStack: ['Delft3D', 'Python Hydro', 'LiDAR DEM', 'QGIS', 'Copernicus Marine', 'NetCDF'],
      url: 'https://danisantanderurrutia-coder.github.io/portafolio/'
    }
  ],
  fieldEquipment: [
    {
      id: 'eq-syscal-pro',
      name: 'Syscal Pro (Iris Instruments)',
      category: 'Geophysics',
      description: 'Resistivímetro multielectrodo para tomografía de resistividad eléctrica profunda (ERT) y Sondeos Eléctricos Verticales (SEV).'
    },
    {
      id: 'eq-licor-ghg',
      name: 'LI-COR LI-7500 / LI-7700',
      category: 'Atmosphere',
      description: 'Analizadores de gas infrarrojo de paso abierto para torres micrometeorológicas de flujos turbulentos de CO2 y CH4 (Eddy Covariance).'
    },
    {
      id: 'eq-ctd-divers',
      name: 'CTD Divers & Piezómetros',
      category: 'Hydrology',
      description: 'Registradores continuos de nivel freático, conductividad eléctrica y temperatura del agua subterránea en pozos.'
    },
    {
      id: 'eq-edelman-coring',
      name: 'Barrenas Edelman & Testigos de Suelo',
      category: 'Soils',
      description: 'Extracción de cilindros de suelo no perturbados para densidad aparente, curvas de retención hídrica y conductividad hidráulica.'
    },
    {
      id: 'eq-flux-chambers',
      name: 'Cámaras Dinámicas de Flujo de Suelo',
      category: 'Soils',
      description: 'Medición in-situ de respiración heterótrofa y autótrofa del suelo y emisiones biogénicas de gases de efecto invernadero.'
    },
    {
      id: 'eq-drones-multispectral',
      name: 'Drones & Sensores Multiespectrales',
      category: 'Remote Sensing',
      description: 'Fotogrametría aérea de alta resolución y cálculo de índices multiespectrales de vigor vegetal (NDVI/NDRE).'
    }
  ],
  operationalTrackB: [
    {
      id: 'op-el-huerto',
      establishment: 'Restaurante El Huerto',
      role: 'Camarero / Servicio de Sala (à-la-carte)',
      location: 'Providencia, Santiago, Chile',
      startDate: '2021',
      endDate: '2022',
      category: 'gastronomy',
      summary: 'Servicio de mesa à-la-carte en restaurante gastronómico emblemático de cocina vegetariana y saludable. Atención personalizada a comensales nacionales e internacionales, toma de comandas, conocimiento estricto de alérgenos y asesoramiento de vinos y platos.',
      achievements: [
        'Atención de alto ritmo en turnos de almuerzo y cena con máxima valoración en encuestas de servicio.',
        'Mise-en-place impecable de salón y aplicación rigurosa de protocolos de higiene alimentaria.'
      ],
      skills: ['Servicio de Mesa', 'Mise-en-place', 'Protocolo Gastronómico', 'Atención al Cliente', 'Alérgenos & Dietas'],
      isVerified: true
    },
    {
      id: 'op-subterraneo',
      establishment: 'Club & Bar Subterráneo',
      role: 'Bartender / Tresenkraft (Barra de Alto Volumen)',
      location: 'Paseo Orrego Luco, Providencia, Chile',
      startDate: '2020',
      endDate: '2021',
      category: 'bar',
      summary: 'Servicio rápido de barra y coctelería en local icónico de música en vivo y alta afluencia nocturna. Preparación acelerada de combinados, cerveza de barril, control y arqueo de caja con TPV, y reposición de inventario en horas punta.',
      achievements: [
        'Gestión de barra con flujo continuo de cientos de clientes por turno sin incidencias en caja ni roturas.',
        'Dominio del trabajo bajo presión acústica y temporal con trato enérgico y amable.'
      ],
      skills: ['Coctelería Rápida', 'Caja & TPV', 'Resistencia Nocturna', 'Gestión de Barriles & Stock', 'Control de Estrés'],
      isVerified: true
    },
    {
      id: 'op-thai-pals',
      establishment: 'Restaurante Thai Pals',
      role: 'Camarero / Asistente de Sala & Barra',
      location: 'Providencia, Santiago, Chile',
      startDate: '2019',
      endDate: '2020',
      category: 'gastronomy',
      summary: 'Atención al público en restaurante de gastronomía tailandesa. Explicación de carta, gestión de pedidos para sala y take-away, asistencia en barra y preparación de bebidas.',
      achievements: [
        'Agilidad en rotación de mesas durante horas pico de oficina en Providencia.',
        'Coordinación fluida entre cocina y sala para reducir tiempos de espera.'
      ],
      skills: ['Servicio de Sala', 'Take-away', 'Coordinación Cocina-Sala', 'Atención Bilingüe', 'Rapidez'],
      isVerified: true
    },
    {
      id: 'op-nuria',
      establishment: 'Bar & Restaurante Nuria',
      role: 'Bartender / Servicio de Barra Tradicional',
      location: 'Santiago Centro, Chile',
      startDate: '2018',
      endDate: '2019',
      category: 'bar',
      summary: 'Servicio en barra tradicional del centro histórico de Santiago. Despacho rápido de cafetería matutina, aperitivos, cañas y copas, con trato cercano a clientela habitual y ejecutivos.',
      achievements: [
        'Manejo de caja con arqueos diarios exactos y reposición continua de botellería.',
        'Servicio rápido simultáneo de barra y apoyo a salón.'
      ],
      skills: ['Barra Tradicional', 'Cafetería', 'Arqueo de Caja', 'Fidelización de Clientes', 'Limpieza de Estación'],
      isVerified: true
    },
    {
      id: 'op-ferias',
      establishment: 'Venta Directa en Plazas & Ferias',
      role: 'Vendedor & Gestor de Puesto (Libros & Ropa Usada)',
      location: 'Santiago, Concepción y Parral, Chile',
      startDate: '2016',
      endDate: '2020',
      category: 'retail',
      summary: 'Venta comercial directa y trato con el público en ferias de libros, cultura y ropa vintage. Montaje de puesto, selección de catálogo, negociación de precios, atención personalizada y control de cuentas.',
      achievements: [
        'Desarrollo de excelente empatía comercial, persuasión y comunicación cara a cara.',
        'Logística completa de transporte, exhibición atractiva y cierre de ventas.'
      ],
      skills: ['Venta Directa', 'Negociación', 'Montaje & Logística', 'Cierre de Ventas', 'Comunicación Interpersonal'],
      isVerified: true
    },
    {
      id: 'op-supermercado',
      establishment: 'Supermercado de Parral',
      role: 'Asistente de Empaque, Atención & Soporte en Cajas',
      location: 'Parral, Maule, Chile',
      startDate: '2015',
      endDate: '2016',
      category: 'retail',
      summary: 'Atención directa en línea de cajas de gran afluencia. Empaque ágil y seguro de productos, asistencia a personas mayores o con movilidad reducida y resolución de dudas con actitud servicial.',
      achievements: [
        'Reconocimiento por rapidez y cortesía constante durante jornadas completas de pie.',
        'Colaboración con personal de reposición para mantener la zona de cajas despejada.'
      ],
      skills: ['Atención Rápida', 'Servicio al Cliente', 'Trabajo Físico Continuo', 'Puntualidad', 'Cortesía'],
      isVerified: true
    },
    {
      id: 'op-carpinteria',
      establishment: 'Taller de Carpintería & Reparaciones',
      role: 'Ayudante de Carpintería & Operaciones Manuales',
      location: 'Parral y Chillán, Chile',
      startDate: '2017',
      endDate: '2021',
      category: 'trades',
      summary: 'Trabajos manuales de corte, cepillado, lijado y ensamblaje de madera. Fabricación de muebles sencillos, estructuras rústicas, reparaciones domésticas y manejo seguro de herramientas eléctricas y manuales.',
      achievements: [
        'Habilidad práctica resolutiva en mantenimiento, uso de herramientas y prevención de riesgos laborales.',
        'Capacidad de resolver problemas físicos de infraestructura con autonomía.'
      ],
      skills: ['Herramientas Manuales & Eléctricas', 'Holzbearbeitung / Madera', 'Mantenimiento Preventivo', 'Seguridad Laboral', 'Resolución Práctica'],
      isVerified: true
    },
    {
      id: 'op-compostaje',
      establishment: 'Iniciativas de Compostaje Comunitario & Huerta',
      role: 'Operador de Compostaje & Mantenimiento de Áreas Verdes',
      location: 'Parral, Maule, Chile',
      startDate: '2018',
      endDate: '2022',
      category: 'trades',
      summary: 'Recolección, trituración y volteo manual de pilas de residuos orgánicos. Cuidado de suelo, poda básica, riego y mantenimiento de espacios verdes comunitarios.',
      achievements: [
        'Gestión de biomasa orgánica a escala local con esfuerzo físico sostenido.',
        'Mantenimiento ordenado y limpio de parcelas y herramientas de campo.'
      ],
      skills: ['Trabajo Físico en Exteriores', 'Mantenimiento de Jardines', 'Gestión de Residuos', 'Autonomía', 'Esfuerzo Sostenido'],
      isVerified: true
    },
    {
      id: 'op-clases',
      establishment: 'Clases Particulares & Tutorías',
      role: 'Profesor Particular (Matemáticas, Física & Ciencias)',
      location: 'Santiago, Chile',
      startDate: '2017',
      endDate: '2022',
      category: 'teaching',
      summary: 'Refuerzo escolar y preuniversitario individualizado. Diagnóstico de dificultades de aprendizaje, diseño de explicaciones didácticas y preparación para exámenes.',
      achievements: [
        '100% de estudiantes aprobados con mejora visible de notas y confianza.',
        'Desarrollo de paciencia pedagógica, escucha activa y adaptación al ritmo de cada persona.'
      ],
      skills: ['Pedagogía', 'Comunicación Clara', 'Paciencia', 'Escucha Activa', 'Organización de Tiempo'],
      isVerified: true
    }
  ],
  pendingFields: [],
  lastUpdated: '2026-11-06'
};

export const initialSources: JobSource[] = [
  {
    id: 'src-thuenen',
    name: 'Thünen-Institut Karriereportal (Braunschweig & Bundesweit)',
    type: 'research_center',
    url: 'https://www.karriere-thuenen.de/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '2026-10-21 03:00',
    offersExtracted: 1,
    notes: 'Instituto Federal de Investigación para Áreas Rurales, Bosques y Pesca (BMEL). Puestos de investigación en clima, suelos y agroecología.'
  },
  {
    id: 'src-interamt',
    name: 'Interamt (Karriereportal des Öffentlichen Dienstes)',
    type: 'public_admin',
    url: 'https://interamt.de/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '2026-10-21 03:00',
    offersExtracted: 1,
    notes: 'Portal unificado de convocatorias públicas de Alemania (Bund, Länder, Kommunen), incluyendo Umweltbundesamt (UBA).'
  },
  {
    id: 'src-bund',
    name: 'Service.bund.de (Stellenangebote des Bundes)',
    type: 'public_admin',
    url: 'https://www.service.bund.de/Content/DE/Stellen/Suche/Formular.html',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '2026-10-21 03:00',
    offersExtracted: 1,
    notes: 'Canal oficial con agregación RSS de ofertas del Estado Federal en ciencia, digitalización y administración ambiental.'
  },
  {
    id: 'src-dfg-gepris',
    name: 'DFG GEPRIS & Research Explorer (Alemania)',
    type: 'research_center',
    url: 'https://gepris.dfg.de/gepris/OCTOPUS?context=projekt&task=findKompakt&keywords=peatland+OR+carbon+OR+geophysics',
    priority: 'Alta',
    frequency: 'Semanal',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    region: 'Alemania / DACH',
    notes: 'Base de datos oficial de proyectos financiados por la DFG en universidades e institutos alemanes. Detecta cátedras con presupuesto activo para contratos TV-L E13.',
    countryFocus: 'Alemania (DACH)'
  },
  {
    id: 'src-bc3',
    name: 'BC3 Basque Centre for Climate Change (Bilbao / Leioa)',
    type: 'research_center',
    url: 'https://www.bc3research.org/careers.html',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Centro de investigación en cambio climático de excelencia mundial en Bizkaia.'
  },
  {
    id: 'src-tecnalia',
    name: 'Tecnalia Research & Innovation (Bilbao Hub)',
    type: 'research_center',
    url: 'https://www.tecnalia.com/empleo',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Centro de I+D de referencia en el País Vasco.'
  },
  {
    id: 'src-azti',
    name: 'AZTI - Ciencia y Tecnología Marina y Alimentaria (Pasaia / Sukunza)',
    type: 'research_center',
    url: 'https://www.azti.es/empleo',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Investigación marina, servicios ecosistémicos y clima en Euskadi.'
  },
  {
    id: 'src-neiker',
    name: 'Neiker - Instituto Vasco de Investigación Agraria & Suelos (Arkaute)',
    type: 'research_center',
    url: 'https://neiker.eus/es/empleo/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Ciencias del suelo, agricultura sostenible y agrotecnología en Euskadi.'
  },
  {
    id: 'src-eit-food',
    name: 'EIT Food Careers & Opportunities (Bilbao Hub)',
    type: 'research_center',
    url: 'https://www.eitfood.eu/careers',
    priority: 'Alta',
    frequency: 'Semanal',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    region: 'Euskadi / España',
    notes: 'Sede para el Sur de Europa de la comunidad de innovación agroalimentaria del EIT en Zamudio (Bilbao). Puestos de gestión de proyectos, agronomía regenerativa y suelos.',
    countryFocus: 'Euskadi / España (Sede Bilbao Hub)'
  },
  {
    id: 'src-aclima',
    name: 'Aclima - Clúster de Industrias del Medio Ambiente de Euskadi',
    type: 'job_board',
    url: 'https://aclima.eus/empleo/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Bolsa de empleo del sector ambiental vasco.'
  },
  {
    id: 'src-idom',
    name: 'IDOM Consulting & Engineering (Sede Central Bilbao)',
    type: 'research_center',
    url: 'https://www.idom.com/unete-a-idom/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Sede en Zorrotzaurre (Bilbao). Proyectos ambientales y ordenamiento territorial.'
  },
  {
    id: 'src-ihobe',
    name: 'IHOBE - Sociedad Pública de Gestión Ambiental del Gobierno Vasco',
    type: 'public_admin',
    url: 'https://www.ihobe.eus/empleo',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Sociedad pública de medio ambiente de Euskadi en Bilbao.'
  },
  {
    id: 'src-cristinaenea',
    name: 'Fundación Cristina Enea (Donostia / San Sebastián)',
    type: 'research_center',
    url: 'https://www.cristinaenea.eus/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Educación ambiental, sostenibilidad urbana e intercambio de conocimiento en Gipuzkoa.'
  },
  {
    id: 'src-avcd',
    name: 'AVCD - Agencia Vasca de Cooperación para el Desarrollo',
    type: 'public_admin',
    url: 'https://www.euskadi.eus/agencia-vasca-de-cooperacion-para-el-desarrollo/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Agencia pública vasca para cooperación y trabajo con comunidades.'
  },
  {
    id: 'src-ongdeuskadi',
    name: 'Coordinadora de ONGD de Euskadi (Bolsa de Empleo Sectorial)',
    type: 'job_board',
    url: 'https://www.ongdeuskadi.org/es/empleo.asp',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Bolsa unificada de empleo en cooperación internacional en Euskadi.'
  },
  {
    id: 'src-alboan',
    name: 'Alboan ONG Euskadi (Bilbao & Donostia)',
    type: 'job_board',
    url: 'https://www.alboan.org/es/trabaja-con-nosotros',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Justicia socio-ambiental y defensa comunitaria del territorio.'
  },
  {
    id: 'src-mundubat',
    name: 'Mundubat Euskadi (Derechos a la Tierra & Comunidades)',
    type: 'job_board',
    url: 'https://www.mundubat.org/empleo/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Derechos campesinos y gobernanza de recursos naturales.'
  },
  {
    id: 'src-bopv',
    name: 'BOPV - Boletín Oficial del País Vasco (Gobierno Vasco)',
    type: 'public_admin',
    url: 'https://www.euskadi.eus/bopv/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Convocatorias públicas oficiales de técnicos ambientales en Euskadi.'
  },
  {
    id: 'src-lanbide',
    name: 'Lanbide - Servicio Vasco de Empleo',
    type: 'public_admin',
    url: 'https://www.lanbide.euskadi.eus/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Portal oficial de empleo del País Vasco.'
  },
  {
    id: 'src-ecodes',
    name: 'ECODES - Fundación Ecología y Desarrollo (España)',
    type: 'job_board',
    url: 'https://ecodes.org/empleo',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Transición justa, política ambiental y acción comunitaria.'
  },
  {
    id: 'src-boe',
    name: 'BOE - Convocatorias de Empleo Público en España',
    type: 'public_admin',
    url: 'https://www.boe.es/diarios_doc/boe/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Convocatorias oficiales del Ministerio de Transición Ecológica MITECO.'
  },
  {
    id: 'src-climate-kic',
    name: 'EIT Climate-KIC (Careers & Open Opportunities)',
    type: 'research_center',
    url: 'https://www.climate-kic.org/careers/',
    priority: 'Alta',
    frequency: 'Semanal',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    region: 'Europa / Global',
    notes: 'Agencia de innovación climática de la Unión Europea (EIT). Vacantes en transformación sistémica, NbS, carbono y políticas climáticas.',
    countryFocus: 'Paneuropeo (Ámsterdam, Berlín, Bruselas, España)'
  },
  {
    id: 'src-energyweather-ai',
    name: 'Energy Weather & AI Lab (TU Delft / BFH)',
    type: 'research_center',
    url: 'https://www.energyweather.ai/vacancies',
    priority: 'Alta',
    frequency: 'Semanal',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    region: 'Europa / Global',
    notes: 'Laboratorio de investigación conjunto entre TU Delft (Dept. of Geoscience and Remote Sensing) y la Universidad de Ciencias Aplicadas de Berna (BFH), liderado por la Prof. Dr. Angela Meyer. Especializado en IA informada por la física (PINNs), aprendizaje automático para dinámicas climáticas y meteorología extrema, teledetección (Earth Observation) e integración de energías renovables (solar y eólica).',
    countryFocus: 'Países Bajos & Suiza (TU Delft / BFH) / Híbrido'
  },
  {
    id: 'src-supercritical',
    name: 'Supercritical (Durable Carbon Removal Marketplace)',
    type: 'company_portal',
    url: 'https://gosupercritical.com/jobs',
    priority: 'Alta',
    frequency: 'Semanal',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    region: 'Europa / Global',
    notes: 'Plataforma y mercado de referencia de créditos de eliminación permanente de carbono (durable CDR: biochar, intemperización de rocas, DAC). Protocolo de vetting científico en 118 puntos de control y vacantes remotas en ciencia climática y asesoría.',
    countryFocus: 'Reino Unido / Remoto Europa (GMT±3)'
  }
];


export const initialCompanies: CompanyDossier[] = [
  {
    id: 'comp-thuenen',
    name: 'Johann Heinrich von Thünen-Institut',
    website: 'https://www.thuenen.de/',
    sector: 'Investigación Federal en Suelos, Clima, Bosques y Agricultura (BMEL)',
    size: '1.000+ investigadores y personal científico',
    headquarters: 'Braunschweig, Niedersachsen, Alemania',
    description: 'Bundesforschungsinstitut für Ländliche Räume, Wald und Fischerei. Su Institut für Agrarklimaschutz (AK) lidera la investigación científica en mitigación del cambio climático en el sector agrario, secuestro de carbono orgánico en suelos agrícolas y balances de GEI para el Gobierno Federal alemán.',
    keyProjects: [
      'Proyecto "TechWorms": Secuestro de carbono en subsuelo mediante bioporos verticales y estimulación radicular profunda',
      'Inventario Nacional de Suelos Agrícolas de Alemania (Bodenzustandserhebung Landwirtschaft - BZE-LW)',
      'Red nacional de monitoreo de flujos de carbono y GEI en ecosistemas agrícolas y turberas'
    ],
    recentNews: [
      {
        title: 'Lanzamiento de ensayos de campo del proyecto TechWorms para captura de carbono en subsuelos',
        date: '2026-10-01',
        snippet: 'Evaluación del potencial de macroporos artificiales para transportar carbono a horizontes edáficos profundos.'
      }
    ],
    workCulture: [
      'Investigación científica de alto impacto para políticas públicas federales',
      'Convenio colectivo del sector público federal (TVöD Bund E13)',
      'Excelente conciliación familiar, horarios flexibles por Gleitzeit y fomento del doctorado con universidades socias (TU Braunschweig)'
    ],
    redFlags: ['Contrato vinculado a duración del proyecto de investigación (noviembre 2030) y plazos de postulación estrictos'],
    interviewArguments: [
      'Máster europeo en Gestión y Protección Ambiental completado en Alemania (CAU Kiel) con conocimiento directo del sistema científico alemán.',
      'Sólida formación en física y edafología con experiencia empírica en dinámica de suelos y flujos de gases.',
      'Dominio demostrado de R para análisis estadístico y modelado de datos de campo.'
    ],
    techStack: ['R', 'RootBox', 'Isotopenanalytik', 'TVöD Bund', 'GIS', 'Python'],
    lastResearched: '2026-10-21',
    quadrants: ['DACH'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-uba',
    name: 'Umweltbundesamt (UBA)',
    website: 'https://www.umweltbundesamt.de/',
    sector: 'Agencia Federal de Medio Ambiente de Alemania (BMUV)',
    size: '1.800+ empleados',
    headquarters: 'Dessau-Roßlau / Sedes en Berlín y Leipzig',
    description: 'La máxima autoridad técnica y científica de Alemania para la protección del medio ambiente. Su Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) lidera la Agenda Digital de Política Ambiental, creando herramientas de IA para optimizar la toma de decisiones ecológicas y la administración ambiental.',
    keyProjects: [
      'Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) con hasta 30 especialistas en Leipzig/Berlín',
      'Desarrollo de modelos predictivos y gemelos de IA para supervisión de calidad del aire, agua y suelos',
      'Plataforma de datos federados e inteligencia ambiental para el Verwaltungsvollzug'
    ],
    recentNews: [
      {
        title: 'Despliegue de nuevas iniciativas del KI-Lab para la Agenda Digital de Política Ambiental',
        date: '2026-10-05',
        snippet: 'Proyectos piloto de IA aplicados a la evaluación de impacto y monitorización satelital.'
      }
    ],
    workCulture: [
      'Organismo federal con alta seguridad laboral y teletrabajo regulado',
      'Metodologías ágiles (Scrum, Kanban) aplicadas al sector público',
      'Compromiso social y ambiental con impacto directo en legislación y ciudadanía'
    ],
    redFlags: ['Puesto inicial como Mutterschutzvertretung, requiriendo validación de prórroga para la fase de Elternzeit'],
    interviewArguments: [
      'Capacidad probada de tender puentes entre la ciencia biofísica de datos y la gobernanza / gestión de proyectos.',
      'Experiencia en proyectos de impacto internacional y comunicación efectiva con equipos multidisciplinares.',
      'Perfil MINT riguroso con base analítica en geofísica y máster europeo en protección ambiental.'
    ],
    techStack: ['Scrum / Kanban', 'AI / Machine Learning', 'OpenProject', 'MS Project', 'Python', 'GIS'],
    lastResearched: '2026-10-21',
    quadrants: ['DACH'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-bc3',
    name: 'BC3 - Basque Centre for Climate Change',
    website: 'https://www.bc3research.org/',
    sector: 'Investigación Climática & Modelación Biofísica (BRTA / Ikerbasque)',
    size: '50-150 investigadores',
    headquarters: 'Leioa / Bilbao (Parque Científico UPV/EHU, Bizkaia)',
    description: 'Centro de investigación de excelencia María de Maeztu enfocado en las causas y consecuencias del cambio climático, modelación de servicios ecosistémicos (plataforma k.LAB / ARIES) y gobernanza de la transición justa.',
    keyProjects: [
      'Plataforma k.LAB / ARIES para modelado biofísico interoperable de servicios ecosistémicos',
      'Políticas de descarbonización e inventarios de emisiones de GEI en cuencas europeas',
      'Evaluación de resiliencia climática territorial e impactos socioeconómicos'
    ],
    recentNews: [
      {
        title: 'Convocatorias abiertas de proyectos de investigación en modelación climática y ecosistemas',
        date: '2026-09-15',
        snippet: 'Líneas prioritarias en contabilidad de carbono e interoperabilidad de datos geoespaciales.'
      }
    ],
    workCulture: [
      'Investigación puntera interdisciplinar',
      'Entorno multinacional y bilingüe (EN/ES/EU)',
      'Alto rigor metodológico y publicaciones internacionales'
    ],
    redFlags: ['Procesos de selección muy rigurosos basados en méritos y alineamiento metodológico'],
    interviewArguments: [
      'Experiencia directa en cuantificación empírica de flujos de GEI (torres eddy covariance en CAU Kiel) y modelación biofísica con R/Python.',
      'Manejo avanzado de balance de cuencas hidrológicas y análisis espacial (QGIS, GEE).',
      'Base sólida en geofísica matemática (U. de Chile) complementada con visión de políticas europeas de sostenibilidad.'
    ],
    techStack: ['R', 'Python', 'QGIS', 'Google Earth Engine', 'k.LAB / ARIES', 'EddyPro'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-tecnalia',
    name: 'Tecnalia Research & Innovation',
    website: 'https://www.tecnalia.com/',
    sector: 'I+D+i Aplicada & Transición Ecológica',
    size: '1.400+ investigadores',
    headquarters: 'Derio / Bilbao (Bizkaia)',
    description: 'El mayor centro de investigación aplicada y desarrollo tecnológico de España y uno de los principales de Europa, con divisiones líderes en Transición Energética, Clima, Ecosistemas Urbanos y Soluciones Basadas en la Naturaleza.',
    keyProjects: [
      'Gemelos digitales para resiliencia climática urbana y ordenamiento territorial',
      'Modelos predictivos de inundabilidad y balance hídrico en cuencas fluviales',
      'Valorización de biomasa y ecodiseño industrial'
    ],
    recentNews: [
      {
        title: 'Expansión de programas de adaptación climática y gemelos digitales en Euskadi',
        date: '2026-10-01',
        snippet: 'Licitaciones europeas Horizonte Europa en soluciones basadas en la naturaleza.'
      }
    ],
    workCulture: [
      'Orientación a proyectos industriales y europeos',
      'Transferencia tecnológica directa',
      'Equipos multidisciplinares de ingeniería y ciencias ambientales'
    ],
    redFlags: ['Ritmo ágil de entrega y plazos ajustados en licitaciones europeas'],
    interviewArguments: [
      'Doble perfil científico-técnico capaz de integrar sensorización de campo con modelos numéricos y geoespaciales.',
      'Semifinalista en el UN Citiverse Challenge con gemelo digital territorial para resiliencia.',
      'Experiencia de trabajo trilingüe y adaptación inmediata a consorcios europeos.'
    ],
    techStack: ['Python', 'QGIS', 'IoT Sensor Networks', 'ArcGIS', 'R'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI', 'GLOBAL'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-neiker',
    name: 'Neiker - Instituto Vasco de Investigación y Desarrollo Agrario',
    website: 'https://neiker.eus/',
    sector: 'Agroecología, Suelos & Servicios Ecosistémicos (BRTA)',
    size: '150-250 empleados',
    headquarters: 'Arkaute (Vitoria-Gasteiz) / Derio (Bizkaia)',
    description: 'Entidad pública dedicada a la I+D+i agroganadera y ambiental de Euskadi. Referente en calidad biológica de suelos, salud edáfica, mitigación de GEI y agroecología.',
    keyProjects: [
      'Monitoreo continuo de salud del suelo y secuestro edáfico de carbono (Directiva Suelos UE)',
      'Impacto de prácticas agroecológicas en la retención de agua y biodiversidad',
      'Vigilancia de plagas y balance hídrico ante eventos climáticos extremos'
    ],
    recentNews: [
      {
        title: 'Liderazgo en proyectos europeos de protección y salud del suelo edáfico',
        date: '2026-09-20',
        snippet: 'Implementación de metodologías pioneras de análisis biológico y físico de suelos.'
      }
    ],
    workCulture: [
      'Cercanía con el sector primario vasco y la administración pública',
      'Investigación aplicada sobre el terreno',
      'Científicos edafólogos y ecólogos de primer nivel'
    ],
    redFlags: ['Requiere disponibilidad para trabajo de campo regular en fincas experimentales y cuencas'],
    interviewArguments: [
      'Formación especializada en conservación y protección del suelo en Kiel y Poznań.',
      'Diseñador en permacultura certificado (EPAC Chile) con conocimiento de diseño keyline y regeneración de suelos.',
      'Capacidad de muestreo riguroso y análisis estadístico robusto de variables edáficas.'
    ],
    techStack: ['R', 'QGIS', 'Muestreo Edáfico', 'Sensores de Humedad TDR', 'Cámaras de Flujo'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-idom',
    name: 'IDOM Consulting, Engineering & Architecture',
    website: 'https://www.idom.com/',
    sector: 'Consultoría Ambiental Internacional, Hidrología e Infraestructuras',
    size: '4.500+ empleados',
    headquarters: 'Bilbao (Sede Central Zorrotzaurre, Bizkaia)',
    description: 'Multinacional independiente de consultoría e ingeniería con sede central en Bilbao. Lidera grandes estudios de impacto ambiental, modelación hidrológica, salvaguardias socioambientales y resiliencia climática para el Banco Mundial, BID y la Comisión Europea.',
    keyProjects: [
      'Estudios de modelación hidrológica de cuencas y mapas de inundabilidad',
      'Auditorías de salvaguardias socioambientales en proyectos de infraestructura en LatAm y África',
      'Estrategias de transición energética y planes de adaptación al cambio climático'
    ],
    recentNews: [
      {
        title: 'Apertura de nuevos contratos marco de consultoría ambiental internacional',
        date: '2026-10-05',
        snippet: 'Creciente demanda de perfiles en modelación de cuencas y gestión de recursos hídricos.'
      }
    ],
    workCulture: [
      'Propiedad 100% de los empleados (asociados)',
      'Proyección internacional en más de 120 países',
      'Alta exigencia técnica y rigor en documentación'
    ],
    redFlags: ['Picos de trabajo elevados durante entrega de licitaciones internacionales'],
    interviewArguments: [
      'Geofísico con dominio numérico de mecánica de fluidos e hidrología de cuencas.',
      'Experiencia en asesoría técnica ante comisiones parlamentarias y diálogo multiactor.',
      'Bilingüe español/inglés con soltura para interactuar con clientes multilaterales.'
    ],
    techStack: ['HEC-RAS', 'Iber', 'QGIS', 'Python', 'AutoCAD Civil 3D'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI', 'GLOBAL'],
    sectorCluster: 'GEOTHERMAL_ENERGY'
  },
  {
    id: 'comp-azti',
    name: 'AZTI - Marine & Food Technology',
    website: 'https://www.azti.es/',
    sector: 'Investigación Marina, Oceanografía y Costas (BRTA)',
    size: '250-350 investigadores',
    headquarters: 'Pasaia (Gipuzkoa) / Sukarrieta (Bizkaia)',
    description: 'Centro científico y tecnológico especializado en el medio marino y la cadena de valor alimentaria. Líder en monitoreo oceanográfico, dinámica de sedimentos costeros y gestión de pesquerías sostenibles.',
    keyProjects: [
      'Red de radares costeros de alta frecuencia HF y boyas oceanográficas',
      'Modelado hidrodinámico de estuarios y dinámica sedimentaria en el Golfo de Bizkaia',
      'Evaluación de impacto del calentamiento y acidificación oceánica'
    ],
    recentNews: [
      {
        title: 'Convocatorias de monitorización satelital y oceanografía operativa en el Cantábrico',
        date: '2026-08-30',
        snippet: 'Nuevos sensores autónomos para seguimiento ambiental costero.'
      }
    ],
    workCulture: [
      'Fuerte vinculación al litoral y a los ecosistemas marinos',
      'Alta productividad en proyectos científicos europeos',
      'Colaboración estrecha con administraciones marítimas'
    ],
    redFlags: ['Campañas oceanográficas y embarques periódicos requeridos para ciertos puestos'],
    interviewArguments: [
      'Formación de origen en geofísica con base en física de la Tierra, dinámica de fluidos y oleaje.',
      'Procesamiento avanzado de series temporales y datos geoespaciales con Python y R.',
      'Compromiso demostrado con la conservación de humedales costeros y zonas de transición.'
    ],
    techStack: ['Python', 'Matlab / Octave', 'QGIS', 'Copernicus Marine Data', 'Series Temporales'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-ihobe',
    name: 'IHOBE - Sociedad Pública de Gestión Ambiental',
    website: 'https://www.ihobe.eus/',
    sector: 'Gestión Ambiental Pública & Políticas de Sostenibilidad',
    size: '50-100 empleados',
    headquarters: 'Bilbao (Bizkaia)',
    description: 'Sociedad pública adscrita al Departamento de Desarrollo Económico, Sostenibilidad y Medio Ambiente del Gobierno Vasco. Diseña e implementa la Estrategia Vasca de Cambio Climático (Klima 2050), el Plan de Suelos Contaminados y la economía circular en Euskadi.',
    keyProjects: [
      'Observatorio de Cambio Climático de Euskadi y Red KLIMATEK',
      'Inventario y remediación de suelos históricamente alterados de la CAV',
      'Guías de compra pública verde y ecodiseño industrial'
    ],
    recentNews: [
      {
        title: 'Actualización del catálogo de herramientas de adaptación climática para municipios vascos',
        date: '2026-09-10',
        snippet: 'Impulso a la renaturalización y resiliencia territorial en Euskadi.'
      }
    ],
    workCulture: [
      'Servicio público, vocación territorial y rigor técnico',
      'Articulación entre administración, empresas y centros de investigación',
      'Enfoque en políticas y resultados medibles'
    ],
    redFlags: ['Procesos de contratación pública sujetos a baremación oficial'],
    interviewArguments: [
      'Doble máster europeo en gestión y protección ambiental (Kiel/Poznań) centrado en políticas territoriales.',
      'Comprensión integral del marco normativo ambiental europeo (Directiva Suelos, Pacto Verde, Taxonomía).',
      'Residencia e implicación directa en Bilbao/Bizkaia con interés a largo plazo en el territorio.'
    ],
    techStack: ['GIS', 'Inventarios GEI', 'Métricas ESG', 'Evaluación de Impacto'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-aclima',
    name: 'Aclima - Basque Environment Cluster',
    website: 'https://aclima.eus/',
    sector: 'Clúster Empresarial & Ecosistema Ambiental de Euskadi',
    size: '10-25 equipo de gestión (representa a 120+ entidades)',
    headquarters: 'Bilbao (Bizkaia)',
    description: 'Asociación Clúster de Industrias de Medio Ambiente de Euskadi. Aglutina a la cadena de valor de la ecoindustria vasca: residuos, suelos, agua, aire, cambio climático y ecodiseño.',
    keyProjects: [
      'Iniciativas de simbiosis industrial y valorización de subproductos en Bizkaia',
      'Fomento de licitaciones multilaterales consorciadas para empresas vascas en el exterior',
      'Mapeo de talento y competencias clave para la transición ecológica'
    ],
    recentNews: [
      {
        title: 'Publicación del informe de coyuntura y oportunidades de empleo en el sector verde vasco',
        date: '2026-09-28',
        snippet: 'Demanda creciente de especialistas en análisis de datos ambientales y gestión hídrica.'
      }
    ],
    workCulture: [
      'Networking institucional de alto nivel',
      'Dinamismo en gestión de proyectos de innovación colaborativa',
      'Visión panorámica de todo el tejido industrial y consultor vasco'
    ],
    redFlags: ['Puestos de gestión en el clúster suelen tener alta polivalencia organizativa'],
    interviewArguments: [
      'Capacidad de interlocución entre el mundo científico-técnico y las necesidades empresariales reales.',
      'Visión internacional de mejores prácticas en Europa del Norte (Alemania/Polonia).',
      'Habilidad demostrada para dinamizar mesas de trabajo multiactor y sintetizar datos complejos.'
    ],
    techStack: ['Gestión de Proyectos', 'Inteligencia de Mercado', 'Análisis de Redes de Clúster'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-cic-energigune',
    name: 'CIC energiGUNE',
    website: 'https://cicenergigune.com/',
    sector: 'I+D en Almacenamiento de Energía & Baterías (BRTA)',
    size: '180-250 investigadores',
    headquarters: 'Parque Tecnológico de Álava (Miñano, Vitoria-Gasteiz)',
    description: 'Centro de investigación referente en Europa en almacenamiento electroquímico (baterías de estado sólido, sodio) y térmico para energías renovables y movilidad sostenible.',
    keyProjects: [
      'Iniciativa europea Battery 2030+ y desarrollo de celdas libres de cobalto',
      'Sistemas de almacenamiento térmico para calor industrial descarbonizado',
      'Análisis de ciclo de vida (LCA) y huella de carbono de nuevos materiales de almacenamiento'
    ],
    recentNews: [
      {
        title: 'Nuevos laboratorios de prototipado y validación de tecnologías de almacenamiento',
        date: '2026-08-15',
        snippet: 'Convocatorias continuas de personal investigador e ingenieros de sostenibilidad.'
      }
    ],
    workCulture: [
      'Investigación de vanguardia mundial',
      'Entorno multicultural con más de 20 nacionalidades',
      'Equipamiento de última generación (difracción de rayos X, salas secas)'
    ],
    redFlags: ['Fuerte focalización en ciencia de materiales y electroquímica'],
    interviewArguments: [
      'Base sólida en física y matemáticas que permite abordar modelación termodinámica y análisis de balance de masas.',
      'Especialización en análisis de ciclo de vida (LCA) y evaluación de huella ambiental de tecnologías de transición.',
      'Experiencia en redacción y justificación de proyectos europeos.'
    ],
    techStack: ['Python', 'LCA OpenLCA / SimaPro', 'Modelación Térmica', 'Análisis de Datos'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-cristina-enea',
    name: 'Fundación Cristina Enea',
    website: 'https://www.cristinaenea.eus/',
    sector: 'Educación Ambiental, Transición Ecosocial & Cultura de Sostenibilidad',
    size: '15-30 empleados',
    headquarters: 'Donostia-San Sebastián (Gipuzkoa)',
    description: 'Fundación municipal y centro de recursos medioambientales de referencia en Gipuzkoa. Genera conocimiento, debate ciudadano y estrategias participativas para la transición ecológica urbana y la defensa de la biodiversidad.',
    keyProjects: [
      'Observatorio de Sostenibilidad de San Sebastián',
      'Programas de renaturalización urbana y ciencia ciudadana en cuencas del Urumea',
      'Exposiciones y debates sobre justicia climática y decrecimiento'
    ],
    recentNews: [
      {
        title: 'Lanzamiento de las jornadas anuales sobre biodiversidad urbana y adaptación local',
        date: '2026-09-05',
        snippet: 'Enfoque en la integración de conocimiento científico en la toma de decisiones ciudadana.'
      }
    ],
    workCulture: [
      'Sensibilidad ecológica profunda y compromiso social',
      'Trabajo cercano a la comunidad local y centros educativos',
      'Foco en la divulgación científica rigurosa y accesible'
    ],
    redFlags: ['Presupuestos de proyectos medianos dependientes de convenios institucionales'],
    interviewArguments: [
      'Trayectoria probada en educación y divulgación ambiental, incluyendo exposiciones internacionales (Oslo, Bonn).',
      'Diseño agroecológico y permacultura aplicable a renaturalización urbana y huertos comunitarios.',
      'Habilidad pedagógica para traducir datos biofísicos complejos a narrativas transformadoras.'
    ],
    techStack: ['Divulgación Científica', 'Ciencia Ciudadana', 'Facilitación Participativa', 'QGIS'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-ecodes',
    name: 'ECODES - Ecología y Desarrollo',
    website: 'https://ecodes.org/',
    sector: 'Think Tank Ambiental, Gobernanza del Agua y Descarbonización',
    size: '40-70 profesionales',
    headquarters: 'Zaragoza / Madrid / Bilbao',
    description: 'Organización referente en España que actúa como puente entre la sociedad civil, las administraciones públicas y el sector privado para acelerar la transición hacia una economía neutra en carbono y socialmente justa.',
    keyProjects: [
      'Iniciativa CeroCO2 para huella de carbono y compensación de emisiones con impacto social',
      'Gobernanza participativa del agua y adaptación a la sequía en cuencas ibéricas',
      'Observatorio de la Transición Justa y pobreza energética'
    ],
    recentNews: [
      {
        title: 'Presentación del informe sobre políticas de resiliencia hídrica ante el cambio climático',
        date: '2026-09-18',
        snippet: 'Propuestas concretas de gestión de la demanda y protección de caudales ecológicos.'
      }
    ],
    workCulture: [
      'Incidencia política constructiva basada en evidencias científicas',
      'Cultura de trabajo en red y alianzas amplias',
      'Enfoque propositivo y de soluciones viables'
    ],
    redFlags: ['Dependencia de convocatorias competitivas y donaciones institucionales'],
    interviewArguments: [
      'Autor de presentaciones técnicas ante el Congreso de Chile sobre gestión de cuencas y riesgo de incendios.',
      'MSc en Environmental Management con comprensión de instrumentos de gobernanza ambiental.',
      'Alineamiento ético total con los principios de transición justa y equidad territorial.'
    ],
    techStack: ['Gobernanza Ambiental', 'Inventarios de Emisiones', 'Gestión de Cuencas', 'Incidencia Política'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI', 'GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-alboan',
    name: 'Alboan ONGD',
    website: 'https://www.alboan.org/',
    sector: 'Cooperación Internacional, Justicia Ambiental y Defensores del Territorio',
    size: '40-60 personas',
    headquarters: 'Bilbao (Bizkaia) / Donostia / Pamplona',
    description: 'ONGD jesuita en Euskadi y Navarra. Trabaja en la defensa de los derechos humanos y la justicia socioambiental en comunidades del Sur Global (América Latina, África, India) y la movilización ciudadana en Euskadi.',
    keyProjects: [
      'Defensa de defensores y defensoras de la tierra y los bienes comunes en la Amazonía',
      'Campaña Tecnología Libre de Conflicto sobre cadenas globales de suministro y minerales',
      'Proyectos de soberanía alimentaria y adaptación al cambio climático en comunidades indígenas'
    ],
    recentNews: [
      {
        title: 'Convocatorias de cooperación descentralizada y educación transformadora en Euskadi',
        date: '2026-09-12',
        snippet: 'Énfasis en los vínculos entre crisis climática y derechos de los pueblos indígenas.'
      }
    ],
    workCulture: [
      'Fuerte compromiso ético y humano',
      'Respeto mutuo y horizontalidad en las relaciones con contrapartes del Sur',
      'Enfoque de género y decolonial'
    ],
    redFlags: ['Salarios del tercer sector regulados por convenio de acción social'],
    interviewArguments: [
      'Experiencia en investigación sobre impactos de monocultivos forestales con comunidades locales en América Latina.',
      'Colaboración con redes globales como Global Forest Coalition y Environmental Paper Network.',
      'Competencias en diseño permacultural, agroecología y mediación comunitaria.'
    ],
    techStack: ['Formulación de Proyectos UE/AECID', 'Enfoque de Marco Lógico', 'Salvaguardias Socioambientales'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI', 'GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-mundubat',
    name: 'Mundubat',
    website: 'https://www.mundubat.org/',
    sector: 'Soberanía Alimentaria, Derechos Territoriales y Solidaridad Internacional',
    size: '30-45 personas',
    headquarters: 'Bilbao (Bizkaia)',
    description: 'Organización vasca de cooperación internacional y transformación social. Centrada en la soberanía alimentaria, la agroecología, la defensa de los derechos colectivos territoriales y los derechos del campesinado.',
    keyProjects: [
      'Apoyo a sistemas agroalimentarios locales y redes campesinas agroecológicas',
      'Incidencia en políticas públicas de comercio justo y debida diligencia empresarial',
      'Defensa de las comunidades rurales frente al extractivismo en América Latina'
    ],
    recentNews: [
      {
        title: 'Nuevos proyectos de agroecología y transición alimentaria en Euskadi y América Latina',
        date: '2026-08-25',
        snippet: 'Articulación con movimientos sociales y administraciones locales.'
      }
    ],
    workCulture: [
      'Militancia activa, horizontalidad y asamblearismo',
      'Solidaridad internacionalista y respeto a la autonomía comunitaria',
      'Espacio de debate político profundo'
    ],
    redFlags: ['Estructura muy arraigada al tejido asociativo local que valora trayectoria previa en movimientos sociales'],
    interviewArguments: [
      'Compromiso práctico en agroecología (PDC certificado) y defensa de sistemas hídricos comunitarios.',
      'Testimonio oficial en el Congreso de Chile sobre los impactos territoriales del modelo forestal.',
      'Conexión vivencial y política con las luchas socioambientales latinoamericanas.'
    ],
    techStack: ['Agroecología', 'Facilitación Comunitaria', 'Gestión de Subvenciones AVCD/Gobierno Vasco'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI', 'GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-elankidetza',
    name: 'eLankidetza - Agencia Vasca de Cooperación y Solidaridad',
    website: 'https://www.elankidetza.euskadi.eus/',
    sector: 'Administración Pública / Cooperación al Desarrollo de Euskadi',
    size: '30-50 personas',
    headquarters: 'Vitoria-Gasteiz / Bilbao',
    description: 'Entidad pública dependiente del Gobierno Vasco encargada de planificar, gestionar y evaluar las políticas públicas vascas de cooperación internacional para el desarrollo y solidaridad transformadora.',
    keyProjects: [
      'Convocatorias anuales de proyectos de cooperación y ayuda humanitaria internacional',
      'Estrategia vasca de transición ecológica justa en cooperación internacional',
      'Seguimiento y evaluación técnica de programas plurianuales en cuencas prioritarias'
    ],
    recentNews: [
      {
        title: 'Resolución de convocatorias estratégicas de cooperación con enfoque ecológico y de género',
        date: '2026-09-30',
        snippet: 'Priorización de iniciativas de mitigación y soberanía alimentaria.'
      }
    ],
    workCulture: [
      'Gestión pública con altos estándares de transparencia y control de gasto',
      'Compromiso social de país respaldado por la sociedad vasca',
      'Rigor administrativo y normativo'
    ],
    redFlags: ['Puestos fijos sujetos a procesos de selección pública de la administración vasca'],
    interviewArguments: [
      'Capacidad de evaluación técnica y metodológica de proyectos con criterios de impacto ambiental medibles.',
      'Doble formación en ciencias duras (geofísica) y políticas ambientales europeas.',
      'Conocimiento exhaustivo del contexto latinoamericano y de la cooperación descentralizada.'
    ],
    techStack: ['Evaluación de Impacto', 'Marco Lógico', 'Directrices de Cooperación Vasca', 'Auditoría Técnica'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI', 'GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-epn',
    name: 'Environmental Paper Network (EPN)',
    website: 'https://environmentalpaper.org/',
    sector: 'Coalición Científica y de Incidencia Internacional en Bosques y Carbono',
    size: 'Red internacional de más de 150 organizaciones',
    headquarters: 'Alemania / Internacional',
    description: 'Red global de organizaciones de la sociedad civil que monitorea y combate la expansión de monocultivos de árboles industriales, la deforestación y la falsa neutralidad de la bioenergía de biomasa.',
    keyProjects: [
      'Auditoría de integridad de créditos de carbono en el sector forestal y de plantaciones',
      'Campaña global contra los subsidios a la biomasa leñosa a gran escala en la UE (RED III)',
      'Monitoreo de derechos humanos y tenencia de tierras en zonas de monocultivos'
    ],
    recentNews: [
      {
        title: 'Publicación del informe sobre los impactos climáticos ocultos de la bioenergía industrial',
        date: '2026-07-20',
        snippet: 'Análisis cuantitativo de la deuda de carbono y el impacto en sumideros forestales.'
      }
    ],
    workCulture: [
      'Trabajo remoto global altamente coordinado',
      'Investigación técnica independiente para desmantelar greenwashing',
      'Colaboración solidaria entre científicos y activistas de campo'
    ],
    redFlags: ['Financiación dependiente de fundaciones filantrópicas internacionales'],
    interviewArguments: [
      'Investigador con experiencia directa como autor de informes técnicos para EPN y GFC sobre plantaciones de biomasa.',
      'Dominio de contabilidad de carbono e inconsistencias en salvaguardias ambientales de la cadena de suministro.',
      'Red de contactos activa en Alemania, Europa y América Latina.'
    ],
    techStack: ['Contabilidad de Carbono', 'Análisis Satelital GIS', 'Redacción de Informes Técnicos', 'Incidencia Política'],
    lastResearched: '2026-10-14',
    quadrants: ['DACH', 'GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-gfc',
    name: 'Global Forest Coalition',
    website: 'https://globalforestcoalition.org/',
    sector: 'Políticas Globales de Biodiversidad, Bosques y Derechos Colectivos',
    size: 'Red internacional con 125+ organizaciones en 70 países',
    headquarters: 'Alemania / Países Bajos / Internacional',
    description: 'Coalición internacional de ONG y organizaciones de Pueblos Indígenas que defiende políticas de conservación forestal basadas en los derechos humanos y combate soluciones basadas en el mercado que destruyen ecosistemas.',
    keyProjects: [
      'Observatorio de Falsas Soluciones Climáticas y Mercados Voluntarios de Carbono',
      'Campaña por la Conservación Comunitaria de Bosques e iniciativa ICCAs',
      'Monitoreo de las negociaciones de la COP del Convenio sobre la Diversidad Biológica (CDB)'
    ],
    recentNews: [
      {
        title: 'Participación en las negociaciones del CDB sobre financiamiento de la biodiversidad',
        date: '2026-09-02',
        snippet: 'Demanda de apoyo directo a las comunidades locales frente a los esquemas de compensación.'
      }
    ],
    workCulture: [
      'Perspectiva global anticolonial y de justicia de género',
      'Facilitación multicultural en inglés, español y francés',
      'Incidencia directa en cumbres de la ONU (CMNUCC, CDB)'
    ],
    redFlags: ['Organización con horarios flexibles adaptados a husos horarios globales'],
    interviewArguments: [
      'Trayectoria demostrada como investigador colaborador en informes de impacto del sector de celulosa y biomasa.',
      'Manejo riguroso del marco científico de sumideros de carbono y dinámicas de suelos edáficos.',
      'Compromiso genuino con los derechos colectivos de las comunidades guardianas de ecosistemas.'
    ],
    techStack: ['Gobernanza de la Biodiversidad', 'Políticas ONU', 'Análisis Socioambiental', 'Comunicaciones Estratégicas'],
    lastResearched: '2026-10-14',
    quadrants: ['UK_NL', 'GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-pik',
    name: 'PIK - Potsdam-Institut für Klimafolgenforschung',
    website: 'https://www.pik-potsdam.de/',
    sector: 'Investigación de Excelencia en Impacto Climático y Resiliencia Planetaria',
    size: '400+ investigadores científicos',
    headquarters: 'Potsdam (Brandeburgo / Berlín, Alemania)',
    description: 'Instituto de investigación de referencia global miembro de la Asociación Leibniz, especializado en límites planetarios, modelación biofísica de puntos de inflexión (tipping points), dinámicas de sumideros de carbono y trayectorias de descarbonización para la formulación de políticas públicas en Alemania y la UE.',
    keyProjects: [
      'Modelación numérica de puntos de inflexión biofísicos y estabilidad de sumideros de carbono',
      'Integración de teledetección satelital y flujos micrometeorológicos en balances globales',
      'Asesoría técnica directa al gobierno federal alemán (BMUV/BMWK) y al IPCC'
    ],
    recentNews: [
      {
        title: 'Evaluación del estado de los sumideros de carbono forestales y edáficos en Europa',
        date: '2026-10-18',
        snippet: 'Nuevo marco cuantitativo para modelar la degradación de sumideros naturales bajo estrés térmico e hidrológico.'
      }
    ],
    workCulture: [
      'Máximo rigor científico interdisciplinar en frontera del conocimiento',
      'Convenio colectivo del sector público alemán (TV-L / TVöD Bund E13/E14)',
      'Ambiente bilingüe de alta proyección internacional con vínculos directos con el IPCC y la Comisión Europea'
    ],
    redFlags: ['Procesos de selección altamente competitivos que exigen fundamentación física cuantitativa rigurosa y código reproducible'],
    interviewArguments: [
      'Formación físico-matemática en Geofísica (U. de Chile) combinada con Doble M.Sc. europeo en modelación de balances biofísicos.',
      'Experiencia directa en flujos micrometeorológicos de GEI (torres eddy covariance y cámaras) y programación en R/Python.',
      'Capacidad probada de transferencia entre rigor empírico y gobernanza de políticas públicas ambientales.'
    ],
    techStack: ['R', 'Python', 'Modelado Numérico Terrestre', 'QGIS', 'Copernicus Earth Observation', 'Linux HPC'],
    lastResearched: '2026-10-24',
    quadrants: ['DACH'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-iberdrola',
    name: 'Iberdrola Renovable & Innovación',
    website: 'https://www.iberdrola.com/',
    sector: 'Energías Renovables, Redes Eléctricas y Descarbonización',
    size: '40.000+ empleados',
    headquarters: 'Bilbao (Torre Iberdrola, Bizkaia)',
    description: 'Líder energético global con sede mundial en Bilbao. Mayor productor de energía eólica del mundo y pionero en la transición energética hacia un modelo 100% renovable, redes inteligentes e hidrógeno verde.',
    keyProjects: [
      'Parques eólicos marinos (offshore) en el Mar del Norte y Báltico (Wikinger, Baltic Eagle)',
      'Integración de biodiversidad y restauración ambiental en plantas fotovoltaicas y eólicas',
      'Estudios de impacto ambiental y licencias de conexión para proyectos internacionales'
    ],
    recentNews: [
      {
        title: 'Inversiones récord en redes inteligentes e innovación renovable internacional',
        date: '2026-10-08',
        snippet: 'Compromiso de cero emisiones netas en Alcances 1, 2 y 3 para 2040.'
      }
    ],
    workCulture: [
      'Gran multinacional del IBEX 35 con recursos técnicos avanzados',
      'Oportunidades de movilidad internacional en Europa y América',
      'Enfoque en excelencia operativa y cumplimiento de plazos'
    ],
    redFlags: ['Estructura corporativa jerárquica con procesos de decisión más lentos que en pymes'],
    interviewArguments: [
      'Perfil geofísico idóneo para prospección de recursos eólicos/solares y geotecnia ambiental marina.',
      'Familiaridad con los mercados energéticos de Alemania y España.',
      'Dominio de herramientas SIG para optimización del emplazamiento de activos renovables.'
    ],
    techStack: ['GIS', 'Python', 'Modelos Meteorológicos', 'ESG Reporting', 'Estudios de Impacto'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI', 'GLOBAL'],
    sectorCluster: 'GEOTHERMAL_ENERGY'
  },
  {
    id: 'comp-siemens-gamesa',
    name: 'Siemens Gamesa Renewable Energy',
    website: 'https://www.siemensgamesa.com/',
    sector: 'Tecnología Eólica Terrestre y Marina',
    size: '25.000+ empleados',
    headquarters: 'Zamudio (Parque Científico y Tecnológico de Bizkaia)',
    description: 'Líder mundial en fabricación, instalación y mantenimiento de aerogeneradores para energía eólica onshore y offshore, con centros de ingeniería clave en Zamudio (Bizkaia).',
    keyProjects: [
      'Desarrollo de palas de aerogenerador 100% reciclables (RecyclableBlade)',
      'Modelado de recurso eólico y micrometeorología en terrenos complejos',
      'Evaluación de impacto ambiental y acústico en proyectos eólicos internacionales'
    ],
    recentNews: [
      {
        title: 'Lanzamiento de nuevas turbinas marinas de alta potencia para el mercado europeo',
        date: '2026-09-14',
        snippet: 'Desarrollo de proyectos estratégicos de I+D en el Parque Tecnológico de Zamudio.'
      }
    ],
    workCulture: [
      'Cultura de ingeniería eólica alemana-española',
      'Enfoque en seguridad, calidad y sostenibilidad de materiales',
      'Inglés como lengua principal de trabajo técnico'
    ],
    redFlags: ['Reestructuraciones corporativas periódicas vinculadas a la integración en Siemens Energy'],
    interviewArguments: [
      'Formación sólida en geofísica y mecánica de fluidos aplicable a la física del viento y capas límite atmosféricas.',
      'Capacidad de modelación estadística y geoespacial en R y Python.',
      'Doble formación germano-iberoamericana ideal para la cultura binacional de la compañía.'
    ],
    techStack: ['Python', 'WAsP / WindPRO', 'QGIS', 'Análisis Micrometeorológico', 'LCA'],
    lastResearched: '2026-10-14',
    quadrants: ['EUSKADI', 'DACH', 'GLOBAL'],
    sectorCluster: 'GEOTHERMAL_ENERGY'
  },
  {
    id: 'comp-gfz',
    name: 'GFZ Helmholtz-Zentrum Potsdam (Deutsches GeoForschungsZentrum)',
    website: 'https://www.gfz-potsdam.de/',
    sector: 'Geociencias, Geofísica, Teledetección & Modelación Terrestre',
    size: '1.200+ científicos y personal técnico',
    headquarters: 'Telegrafenberg, Potsdam (Brandenburg, Alemania)',
    description: 'Centro nacional de investigación en geociencias de Alemania y miembro de la Helmholtz-Gemeinschaft. Lidera la investigación mundial en física de la Tierra sólida, gravimetría por satélite (GRACE-FO), sensoramiento remoto hiperespectral (EnMAP) y dinámica de cuencas.',
    keyProjects: [
      'Procesamiento y modelado de datos hiperespectrales del satélite EnMAP',
      'Monitoreo hidrogeofísico de humedad de suelo y acuíferos profundos',
      'Modelos de deformación cortical y monitoreo de riesgos geodinámicos'
    ],
    recentNews: [
      {
        title: 'Nuevos proyectos de observación de la Tierra y monitoreo hidrogeológico',
        date: '2026-10-12',
        snippet: 'Líneas de investigación abiertas en asimilación de datos satelitales y series temporales.'
      }
    ],
    workCulture: [
      'Centro de excelencia mundial con investigadores de más de 40 países',
      'Campus histórico de Telegrafenberg con infraestructura de supercomputación',
      'Convenio colectivo del sector público federal (TVöD Bund)'
    ],
    redFlags: ['Procesos de selección altamente competitivos que valoran experiencia de publicación'],
    interviewArguments: [
      'Geofísico de base cuantitativa con comprensión matemática de inversión de datos físicos y series temporales.',
      'Doble maestría en Alemania y Polonia con conocimiento del ecosistema Helmholtz.',
      'Experiencia en programación científica en Python, R y manejo de datos espaciales (GIS, Sentinel).'
    ],
    techStack: ['Python', 'QGIS', 'Copernicus / Sentinel', 'GRACE', 'R', 'Linux HPC'],
    lastResearched: '2026-10-25',
    quadrants: ['DACH'],
    sectorCluster: 'RD_PUBLIC',
    fundingTies: ['f-dfg-walter-benjamin', 'f-dfg-sachbeihilfe-eigene-stelle', 'f-helmholtz-postdoc']
  },
  {
    id: 'comp-greifswald',
    name: 'Greifswald Mire Centre (GMC)',
    website: 'https://www.greifswaldmoor.de/',
    sector: 'Restauración de Turberas, Paludicultura y Flujos de Carbono',
    size: '80-120 científicos y consultores de turberas',
    headquarters: 'Greifswald (Mecklenburg-Vorpommern, Alemania)',
    description: 'El mayor centro de conocimiento y referencia mundial en ecología de turberas (Moorforschung), paludicultura y contabilidad de gases de efecto invernadero en suelos orgánicos húmedos. Colaboración estrecha con Universität Greifswald y Michael Succow Stiftung.',
    keyProjects: [
      'Paludicultura y agricultura sobre turberas restauradas con monitoreo de GEI',
      'MoorFutures y certificación de créditos de carbono basados en rehumedecimiento de turberas',
      'Global Peatland Database e inventarios paneuropeos de carbono orgánico'
    ],
    recentNews: [
      {
        title: 'Presentación del manual técnico de monitoreo de flujos de carbono en turberas restauradas',
        date: '2026-10-02',
        snippet: 'Guías de medición con torres micrometeorológicas y cámaras para la UE.'
      }
    ],
    workCulture: [
      'Liderazgo mundial y compromiso absoluto con la restauración de ecosistemas de turbera',
      'Ambiente interdisciplinar entre biólogos, climatólogos, geógrafos y economistas',
      'Incidencia directa en políticas agrarias de la Unión Europea (PAC) y de Alemania'
    ],
    redFlags: ['Gran parte de los fondos provienen de proyectos competitivos del BMUV y programas LIFE'],
    interviewArguments: [
      'Experiencia directa en terreno en monitoreo de flujos de gases de efecto invernadero (torres eddy covariance en turberas) durante el máster en CAU Kiel.',
      'Comprensión integral de la física del suelo, hidrogeología de turberas y balance de masas de carbono.',
      'Capacidad para comunicar resultados cuantitativos a tomadores de decisiones y autoridades políticas.'
    ],
    techStack: ['EddyPro', 'R', 'QGIS', 'Licor Eddy Covariance', 'Python'],
    lastResearched: '2026-10-25',
    quadrants: ['DACH'],
    sectorCluster: 'RD_PUBLIC',
    fundingTies: ['f-dfg-walter-benjamin', 'f-dfg-sachbeihilfe-eigene-stelle', 'f-dfg-graduiertenkolleg', 'f-daad-research']
  },
  {
    id: 'comp-ikerbasque',
    name: 'Ikerbasque - Basque Foundation for Science',
    website: 'https://www.ikerbasque.net/',
    sector: 'Atracción y Consolidación de Talento Investigador en Euskadi',
    size: '300+ investigadores de excelencia adscritos',
    headquarters: 'Bilbao (Bizkaia)',
    description: 'Fundación creada por el Gobierno Vasco para reforzar la investigación científica en Euskadi mediante la atracción y consolidación de investigadoras e investigadores de todo el mundo en centros de la RVCTI y universidades vascas (UPV/EHU, Deusto, Mondragon).',
    keyProjects: [
      'Convocatoria Research Fellows (contratos de 5 años para investigadores prometedores)',
      'Convocatoria Research Associates y Research Professors',
      'Proyectos de investigación avanzada en clima, sostenibilidad, energía y materiales'
    ],
    recentNews: [
      {
        title: 'Publicación de la convocatoria anual Research Fellows para jóvenes investigadores',
        date: '2026-09-15',
        snippet: 'Contratos de 5 años con opción a consolidación permanente en centros de investigación vascos.'
      }
    ],
    workCulture: [
      'Excelencia científica evaluada por comités internacionales independientes',
      'Adscripción directa a centros líderes (BC3, Tecnalia, AZTI, CIC energiGUNE)',
      'Estabilidad investigadora y respaldo institucional del Gobierno Vasco'
    ],
    redFlags: ['Exige un historial científico sólido con publicaciones y clara vocación de permanencia en Euskadi'],
    interviewArguments: [
      'Doble máster europeo con experiencia internacional demostrada en Alemania, Polonia y Chile.',
      'Perfil de alto valor estratégico para la transición ecológica y la resiliencia territorial de Euskadi.',
      'Voluntad explícita de arraigo e investigación aplicada a largo plazo en Bizkaia/Euskadi.'
    ],
    techStack: ['Research Fellowships', 'Horizon Europe', 'Gestión de Proyectos I+D'],
    lastResearched: '2026-10-25',
    quadrants: ['EUSKADI'],
    sectorCluster: 'RD_PUBLIC',
    fundingTies: ['f-ikerbasque-fellowship']
  },
  {
    id: 'comp-sylvera',
    name: 'Sylvera',
    website: 'https://www.sylvera.com/',
    sector: 'Carbon-Tech & Calificación Independiente de Créditos de Carbono (MRV)',
    size: '180+ especialistas en machine learning, teledetección y ciencias de la tierra',
    headquarters: 'Londres (Reino Unido) / Hub Remoto Europa',
    description: 'La calificadora líder mundial de integridad de créditos de carbono. Diseña frameworks rigurosos de calificación cruzando observaciones satelitales (LiDAR, radar SAR, óptico) con balances biofísicos de carbono edáfico y forestal para erradicar el greenwashing corporativo.',
    keyProjects: [
      'Sylvera Carbon Ratings Framework para proyectos de carbono en suelos agrícolas y rehumidificación de turberas',
      'Plataforma de monitoreo de riesgo de reversión y adicionalidad basada en teledetección de alta resolución',
      'Modelado de biomasa supraterránea y carbono orgánico del suelo con calibración in-situ'
    ],
    recentNews: [
      {
        title: 'Expansión de la cobertura de calificación a proyectos de carbono edáfico y humedales en Europa',
        date: '2026-10-10',
        snippet: 'Despliegue de nuevos algoritmos para cuantificar incertidumbre en flujos de carbono edáfico.'
      }
    ],
    workCulture: [
      'Cultura técnica de alto ritmo orientada a la misión climática',
      'Entorno multinacional 100% en inglés con política de teletrabajo flexible en Europa',
      'Remuneración competitiva de mercado tecnológico con equity options'
    ],
    redFlags: ['Ritmo exigente de startup y necesidad de comunicar conceptos biofísicos complejos a clientes financieros'],
    interviewArguments: [
      'Comprensión empírica directa de la física de flujos de carbono (Eddy Covariance) para validar modelos satelitales.',
      'Manejo avanzado de R, Python y Google Earth Engine para procesamiento a escala de datos geoespaciales.',
      'Experiencia previa en auditoría de integridad de carbono forestal con redes internacionales (EPN).'
    ],
    techStack: ['Python', 'R', 'Google Earth Engine', 'QGIS', 'LiDAR', 'Sentinel-1/2', 'Carbon MRV'],
    lastResearched: '2026-10-28',
    quadrants: ['UK_NL', 'GLOBAL'],
    sectorCluster: 'CARBON_TECH_MRV',
    contacts: [
      {
        id: 'cnt-sylvera-team',
        name: 'Sylvera Applied Science Team',
        role: 'Head of Applied Science / Remote Sensing Lead',
        email: 'careers@sylvera.com',
        linkedinUrl: 'https://www.linkedin.com/company/sylvera/'
      }
    ]
  },
  {
    id: 'comp-bezero',
    name: 'BeZero Carbon',
    website: 'https://bezerocarbon.com/',
    sector: 'Agencia Global de Calificación de Riesgo de Carbono & Mercados Voluntarios',
    size: '150+ analistas de riesgo y científicos de la tierra',
    headquarters: 'Londres (Reino Unido)',
    description: 'Agencia global de calificación crediticia de carbono que provee análisis de riesgo independiente y transparente a fondos de inversión, bancos y corporaciones para evaluar la probabilidad de que un crédito logre 1 tonelada de CO2e evitada o eliminada.',
    keyProjects: [
      'BeZero Carbon Rating (BCR) escala de 8 niveles (AAA a C) para proyectos de soluciones basadas en la naturaleza',
      'Desarrollo de metodologías de evaluación de fuga (leakage) y permanencia de carbono en turberas y manglares',
      'Integración de modelos bioclimáticos globales con series temporales satelitales'
    ],
    recentNews: [
      {
        title: 'Publicación de nuevas directivas de rating para proyectos de biochar y carbono en suelos',
        date: '2026-09-28',
        snippet: 'Evaluación de permanencia y estabilidad mineral del carbono en horizontes agrícolas.'
      }
    ],
    workCulture: [
      'Rigurosidad analítica inspirada en agencias financieras (S&P, Moody\'s) aplicada a la ciencia del clima',
      'Ambiente interdisciplinario combinando economistas, climatólogos y geocientíficos',
      'Sede en Londres con opción híbrida'
    ],
    redFlags: ['Enfoque muy analítico y de escrutinio metodológico minucioso'],
    interviewArguments: [
      'Base matemática de Geofísica para modelar distribuciones de probabilidad e incertidumbre en balances de carbono.',
      'Dominio de dinámicas de degradación y saturación de carbono edáfico adquirido en Kiel y Poznań.'
    ],
    techStack: ['Python', 'R', 'GIS', 'Series Temporales', 'Estadística Bayesiana'],
    lastResearched: '2026-10-28',
    quadrants: ['UK_NL', 'GLOBAL'],
    sectorCluster: 'CARBON_TECH_MRV'
  },
  {
    id: 'comp-supercritical',
    name: 'Supercritical',
    website: 'https://gosupercritical.com/',
    sector: 'Mercado de Eliminación Permanente de Carbono (CDR) & Infraestructura de Integridad Científica',
    size: '40-70 especialistas en ciencia climática, software y asesoría corporativa',
    headquarters: 'Londres (Reino Unido) / Remoto Europa (GMT±3)',
    description: 'Plataforma líder y mercado de infraestructura para la adquisición corporativa de eliminación permanente y duradera de carbono (durable CDR: biochar, intemperización mejorada de rocas, captura directa de aire - DAC, biomasa leñosa profunda). Su equipo científico independiente evalúa exhaustivamente cada proyecto bajo 118 puntos de control científico con una tasa de rechazo del 88% para erradicar riesgos de no permanencia y greenwashing.',
    keyProjects: [
      'Infraestructura de mercado para adquisición corporativa plurianual de créditos duraderos (>100 a 1000 años de permanencia)',
      'Proyecto "Liferaft": Mayor acuerdo de compra de biochar de la historia de EE. UU. (1 millón de toneladas) co-diseñado para Microsoft',
      'Protocolo de vetting científico en 118 puntos de datos y participación en el grupo de expertos de SBTi para estándares Net Zero v2',
      'Servicios de asesoría estratégica y diseño de carteras CDR a medida para juntas directivas y auditorías de sostenibilidad'
    ],
    recentNews: [
      {
        title: 'Cierre del mayor acuerdo de compra de biochar en la historia de EE.UU. (1 millón de toneladas)',
        date: '2026-08-15',
        snippet: 'Supercritical co-diseñó la iniciativa Liferaft para abastecer la demanda de eliminación permanente de carbono de Microsoft.',
        url: 'https://gosupercritical.com/jobs'
      },
      {
        title: 'Convocatoria abierta para Lead Climate Scientist (Sales and Advisory)',
        date: '2026-08-26',
        snippet: 'Posición remota en Europa (£70k-£80k) para liderar el asesoramiento científico y la estructuración de carteras CDR ante directores de sostenibilidad.',
        url: 'https://apply.workable.com/supercritical/j/7CE0D0B88F'
      }
    ],
    workCulture: [
      'Filosofía "14,000x mindset": ambición climática a escala de gigatoneladas con velocidad de ejecución y autonomía',
      'Cultura remote-first con flexibilidad horaria total en zonas horarias europeas (GMT±3) y co-working en Old Street (Londres)',
      'Día libre mensual para toda la empresa (primer viernes de cada mes) y vacaciones ilimitadas',
      'Remuneración muy competitiva (£70.000–£80.000) más asignaciones de bienestar (£1.000/año) y setup de oficina en casa'
    ],
    redFlags: ['Entorno comercial de alto ritmo donde se exige traducir ciencia biofísica rigurosa a lenguaje corporativo y decisiones de compra'],
    interviewArguments: [
      'Formación rigurosa en Geofísica y ciencias ambientales con comprensión directa de ciclos biofísicos de carbono, suelos y permanencia edáfica.',
      'Experiencia demostrada en auditoría de integridad científica de biomasa y proyectos de carbono con redes internacionales (EPN).',
      'Habilidad excepcional de comunicación científica y redacción ejecutiva para interactuar con compradores corporativos exigentes y reguladores.'
    ],
    techStack: ['Carbon Accounting', 'SBTi Net Zero v2', 'Biochar MRV', 'Enhanced Weathering', 'GIS / Remote Sensing', 'Excel / Python'],
    lastResearched: '2026-11-09',
    quadrants: ['UK_NL', 'GLOBAL', 'REMOTE'],
    sectorCluster: 'CARBON_TECH_MRV',
    contacts: [
      {
        id: 'cnt-supercritical-careers',
        name: 'Supercritical Talent & Science Team',
        role: 'Director of Climate Science and Policy / Talent Acquisition',
        email: 'careers@gosupercritical.com',
        linkedinUrl: 'https://www.linkedin.com/company/gosupercritical/'
      }
    ]
  },
  {
    id: 'comp-agreena',
    name: 'Agreena',
    website: 'https://agreena.com/',
    sector: 'Certificación de Carbono en Suelos Agrícolas & Agricultura Regenerativa',
    size: '200+ ingenieros agrónomos, desarrolladores y especialistas en suelos',
    headquarters: 'Copenhague (Dinamarca) / Hubs en Berlín y Londres',
    description: 'La mayor plataforma europea de certificación de carbono edáfico (Soil Carbon Farming). Ayuda a miles de agricultores en más de 16 países europeos a monetizar la transición a prácticas regenerativas mediante créditos de carbono de alta integridad verificados con satélite.',
    keyProjects: [
      'Programa AgreenaCarbon con más de 2 millones de hectáreas bajo monitoreo regenerativo en Europa',
      'Modelado biofísico de secuestro de carbono edáfico con el modelo biogeoquímico DNDC y calibración satelital',
      'Despliegue de gemelos edáficos para predecir mineralización de materia orgánica en suelos del norte de Europa'
    ],
    recentNews: [
      {
        title: 'Certificación de créditos de carbono edáfico bajo el estándar Verra en el norte y este de Europa',
        date: '2026-10-15',
        snippet: 'Pioneros en auditar reducción de N2O y secuestro de carbono en cereales.'
      }
    ],
    workCulture: [
      'Startup climate-tech europea en hipercrecimiento',
      'Contacto directo con la realidad del campo agrícola combinado con satélites',
      'Equipos en Copenhague, Alemania y Reino Unido'
    ],
    redFlags: ['Crecimiento acelerado con cambios frecuentes de prioridades de producto'],
    interviewArguments: [
      'Especialización en modelación biogeoquímica de suelos y dinámica de gases de efecto invernadero.',
      'Alemán funcional B1 y formación en Alemania (CAU Kiel) ideal para interactuar con agricultores e institutos del norte de Europa.',
      'Certificación en Diseño de Permacultura (Keyline / regeneración edáfica).'
    ],
    techStack: ['Python', 'R', 'DNDC', 'Sentinel Satelital', 'GIS'],
    lastResearched: '2026-10-28',
    quadrants: ['NORDICS', 'DACH', 'UK_NL'],
    sectorCluster: 'CARBON_TECH_MRV'
  },
  {
    id: 'comp-mitiga',
    name: 'Mitiga Solutions',
    website: 'https://www.mitigasolutions.com/',
    sector: 'Modelación de Catástrofes (Cat Risk) & Riesgo Físico Climático',
    size: '60+ modeladores geofísicos, climatólogos e ingenieros de software',
    headquarters: 'Barcelona (España) / Oficinas en Londres y Remoto',
    description: 'Spin-off nacida del Barcelona Supercomputing Center (BSC). Desarrolla tecnología de vanguardia para predecir el impacto físico y financiero de riesgos climáticos (megaincendios forestales, inundaciones, vulcanismo, sequías) para aseguradoras, gestores de activos y corporaciones globales bajo el marco CSRD.',
    keyProjects: [
      'Plataforma Climate Risk Engine para análisis de riesgo físico regulatorio europeo (CSRD / EU Taxonomy)',
      'Simulación física de dinámica de propagación de megaincendios forestales integrando combustible, viento y humedad del suelo',
      'Evaluación de resiliencia de infraestructuras críticas ante eventos extremos'
    ],
    recentNews: [
      {
        title: 'Ronda de inversión Serie A y despliegue del simulador de incendios para el mercado de reaseguros de Londres',
        date: '2026-09-20',
        snippet: 'Integración de datos de supercomputación con modelos predictivos de riesgo forestal.'
      }
    ],
    workCulture: [
      'Espíritu científico de alta investigación trasladado a producto comercial B2B',
      'Sede principal en España con posibilidad de contratación bajo la Ley 14/2013',
      'Colaboración continua con universidades y centros de supercomputación'
    ],
    redFlags: ['Alta exigencia en algoritmos de computación científica y física computacional'],
    interviewArguments: [
      'Formación fundacional en Geofísica (física de fluidos, medios continuos y modelado numérico).',
      'Experiencia empírica demostrada en correlación estructural entre monocultivos forestales y riesgo de megaincendios (presentada en el Congreso de Chile).',
      'Posibilidad de contratación inmediata en España con residencia de 2 años para nacionalidad.'
    ],
    techStack: ['Python', 'HPC / Supercomputación', 'QGIS', 'Física de Incendios', 'Modelado Cat Risk'],
    lastResearched: '2026-10-28',
    quadrants: ['EUSKADI', 'GLOBAL'],
    sectorCluster: 'CAT_RISK_INSURANCE'
  },
  {
    id: 'comp-descartes',
    name: 'Descartes Underwriting',
    website: 'https://descartesunderwriting.com/',
    sector: 'Seguros Climáticos Paramétricos & Resiliencia ante Desastres',
    size: '160+ científicos de datos, meteorólogos y suscriptores de seguros',
    headquarters: 'París (Francia) / Hubs en Madrid, Londres y Zúrich',
    description: 'Insurtech líder que revoluciona el mercado de seguros contra catástrofes climáticas mediante pólizas paramétricas. Utiliza datos satelitales en tiempo real, radares meteorológicos y modelos biofísicos para indemnizar automáticamente ante sequías, tormentas extremas o incendios.',
    keyProjects: [
      'Seguros paramétricos para sequía en cuencas agrícolas basados en índices de déficit de humedad del suelo',
      'Coberturas contra incendios forestales para activos forestales sostenibles',
      'Modelado de impacto del fenómeno El Niño/La Niña en infraestructuras y cosechas'
    ],
    recentNews: [
      {
        title: 'Expansión de coberturas paramétricas para energías renovables y agricultura en el sur de Europa y LATAM',
        date: '2026-10-02',
        snippet: 'Indemnización instantánea mediante disparadores satelitales de humedad edáfica.'
      }
    ],
    workCulture: [
      'Entorno ágil, multicultural e impulsado por datos cuantitativos',
      'Fuerte presencia de doctores y másteres en física y ciencias del clima',
      'Hub en Madrid con conexión directa a proyectos globales y latinoamericanos'
    ],
    redFlags: ['Negocio estrictamente corporativo y financiero; requiere foco en valor de mercado'],
    interviewArguments: [
      'Capacidad para vincular mediciones edáficas in-situ con índices satelitales de humedad y sequía.',
      'Bilingüe español/inglés con conocimiento del riesgo hídrico en cuencas de América Latina y Europa.'
    ],
    techStack: ['Python', 'Machine Learning', 'Earth Observation', 'Índices Paramétricos', 'R'],
    lastResearched: '2026-10-28',
    quadrants: ['EUSKADI', 'GLOBAL'],
    sectorCluster: 'CAT_RISK_INSURANCE'
  },
  {
    id: 'comp-giz',
    name: 'GIZ (Deutsche Gesellschaft für Internationale Zusammenarbeit)',
    website: 'https://www.giz.de/',
    sector: 'Cooperación Internacional y Políticas de Transición Climática UE-LATAM',
    size: '25.000+ empleados y expertos en más de 120 países',
    headquarters: 'Bonn y Eschborn (Alemania)',
    description: 'La agencia federal del Gobierno de Alemania para la cooperación internacional para el desarrollo sostenible. Su división de Clima, Energía y Medio Ambiente asesora a ministerios y gobiernos de todo el mundo en gobernanza de cuencas, transición energética justa, restauración de turberas y mercados de carbono.',
    keyProjects: [
      'Programa de Transición Ecológica Justa y Gobernanza de Cuencas en el Cono Sur (Chile / Argentina)',
      'Proyecto Global de Protección de Turberas y Humedales para el Balance de GEI (IKI - BMUV)',
      'Fortalecimiento de capacidades ministeriales para la implementación de las NDCs del Acuerdo de París'
    ],
    recentNews: [
      {
        title: 'Nuevos fondos de la Iniciativa Climática Internacional (IKI) para conservación de humedales en América Latina',
        date: '2026-09-18',
        snippet: 'Proyectos de cooperación técnica coordinados desde la sede de Bonn.'
      }
    ],
    workCulture: [
      'Estándar federal alemán con alta estabilidad y excelentes condiciones laborales',
      'Impacto político y social directo en políticas públicas internacionales',
      'Sede principal en Bonn con viajes a países socios'
    ],
    redFlags: ['Procesos de selección burocráticos y necesidad de cumplir baremos específicos de titulación'],
    interviewArguments: [
      'Puente perfecto entre el rigor técnico alemán (CAU Kiel) y la experiencia política sobre el terreno en Chile.',
      'Experiencia verificada en incidencia técnica parlamentaria sobre gestión hídrica y transición justa.',
      'Alemán funcional B1 e inglés C2 bilingüe/profesional.'
    ],
    techStack: ['Políticas Públicas', 'Gobernanza de Cuencas', 'Salvaguardias Ambientales', 'Gestión Multiactor'],
    lastResearched: '2026-10-28',
    quadrants: ['DACH', 'GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-clientearth',
    name: 'ClientEarth',
    website: 'https://www.clientearth.org/',
    sector: 'Litigio Climático Estratégico & Evidencia Científica Ambiental',
    size: '300+ abogados, científicos y analistas de políticas',
    headquarters: 'Londres (Reino Unido) / Oficinas en Berlín, Bruselas y Madrid',
    description: 'La principal organización no gubernamental de derecho y litigio ambiental de Europa. Utiliza el poder de la ley y la evidencia científica cuantitativa para exigir el cumplimiento de metas climáticas a gobiernos y grandes corporaciones, proteger bosques y restaurar ecosistemas degradados.',
    keyProjects: [
      'Litigios contra el greenwashing corporativo en cadenas de suministro de biomasa y créditos de carbono',
      'Monitoreo legal del cumplimiento de la Ley de Restauración de la Naturaleza de la UE (Nature Restoration Law)',
      'Demandas de rendición de cuentas contra subsidios a monocultivos destructivos'
    ],
    recentNews: [
      {
        title: 'Acciones legales europeas por falta de integridad en proyectos de compensación de emisiones',
        date: '2026-10-08',
        snippet: 'Demanda de transparencia metodológica en la contabilidad de carbono forestal.'
      }
    ],
    workCulture: [
      'Ambiente activista de alto nivel profesional y rigor jurídico',
      'Equipos en Berlín, Bruselas y Madrid con gran autonomía',
      'Defensa directa del interés público y los derechos ecológicos'
    ],
    redFlags: ['ONG financiada por donaciones y filantropía estratégica; contratos sujetos a fondos de proyecto'],
    interviewArguments: [
      'Historial demostrado con la Environmental Paper Network (EPN) en auditoría de biomasa forestal.',
      'Capacidad para traducir datos físicos y satelitales en pruebas concluyentes para informes periciales y litigios.',
      'Compromiso personal probado ante el Congreso Nacional en defensa del territorio y el agua.'
    ],
    techStack: ['Evidencia Científica', 'Litigio Climático', 'Contabilidad de Carbono', 'Derecho Ambiental'],
    lastResearched: '2026-10-28',
    quadrants: ['DACH', 'UK_NL', 'EUSKADI'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-wur',
    name: 'Wageningen University & Research (WUR)',
    website: 'https://www.wur.nl/',
    sector: 'Centro Global de Investigación Edáfica, Biosfera y Modelado Biofísico',
    size: '6.800+ científicos y docentes',
    headquarters: 'Wageningen (Países Bajos)',
    description: 'Clasificada recurrentemente como la universidad número 1 del mundo en Agricultura y Silvicultura, y en Ciencias Ambientales. Sus grupos de Soil Physics and Land Management y Environmental Sciences coordinan los mayores consorcios europeos de modelado de suelos, balances de GEI y resiliencia climática.',
    keyProjects: [
      'Coordinación de la Misión de Suelos de la Unión Europea (Soil Mission Horizon Europe)',
      'Red de medición de flujos de carbono y metano en suelos agrícolas y turberas rehumidificadas de Holanda',
      'Modelado biofísico de transporte de agua, solutos y gases en medios porosos edáficos'
    ],
    recentNews: [
      {
        title: 'Liderazgo en la implementación de la nueva Directiva Europea de Monitoreo de Suelos',
        date: '2026-10-12',
        snippet: 'Estandarización de metodologías de muestreo y balance de carbono para toda la UE.'
      }
    ],
    workCulture: [
      'Epicentro internacional de la ciencia ambiental europea; 100% en inglés',
      'Acceso a infraestructuras de laboratorio y campo de primer orden mundial',
      'Convenio colectivo de universidades holandesas (CAO-NU) con excelentes condiciones y pensiones'
    ],
    redFlags: ['Mercado de vivienda muy tensionado en la región de Wageningen'],
    interviewArguments: [
      'Doble máster europeo en gestión ambiental con experiencia empírica directa en turberas en Alemania y Polonia.',
      'Base matemática de Geofísica (física de fluidos y medios continuos) para integrarse de inmediato en grupos de física del suelo.'
    ],
    techStack: ['R', 'Python', 'Eddy Covariance', 'Física del Suelo', 'Modelos Biogeoquímicos'],
    lastResearched: '2026-10-28',
    quadrants: ['UK_NL', 'GLOBAL'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-energyweather-ai',
    name: 'Energy Weather & AI Lab (TU Delft & BFH)',
    website: 'https://www.energyweather.ai/',
    sector: 'I+D en IA Informada por la Física, Clima, Meteorología y Energías Renovables',
    size: '15-30 investigadores y doctorandos',
    headquarters: 'Delft (Países Bajos) & Berna (Suiza)',
    description: 'Grupo de investigación interinstitucional liderado por la Prof. Dr. Angela Meyer, ubicado entre el Departamento de Geociencias y Teledetección (Geoscience and Remote Sensing) de TU Delft y la Universidad de Ciencias Aplicadas de Berna (BFH). Desarrolla modelos de machine learning híbridos y físicos para la interacción entre dinámicas climáticas, eventos meteorológicos extremos y sistemas de energía renovable.',
    keyProjects: [
      'Emuladores de Machine Learning e IA generativa / modelos fundacionales para dinámica atmosférica y clima',
      'Predicción y teledetección (Earth Observation) de eventos meteorológicos extremos y su impacto en infraestructuras energéticas',
      'Modelado de predicción de generación renovable eólica y solar asistido por física y redes neuronales',
      'Desarrollo de gemelos digitales para la transición energética y resiliencia de redes eléctricas'
    ],
    recentNews: [
      {
        title: 'Convocatorias abiertas de doctorado (PhD) y postdoctorado en IA para clima y teledetección',
        date: '2026-10-25',
        snippet: 'Proyectos de investigación de 4 años en TU Delft y BFH sobre emuladores climáticos con física informada y visión por computadora aplicada a observación de la Tierra.',
        url: 'https://www.energyweather.ai/vacancies'
      }
    ],
    workCulture: [
      'Investigación de frontera en la intersección de física teórica, geociencias e inteligencia artificial',
      'Ambiente internacional multidisciplinar con modelo de trabajo híbrido (Países Bajos / Suiza)',
      'Contratos de investigación competitivos bajo convenio CAO-NU (Países Bajos) y sistema suizo BFH'
    ],
    redFlags: ['Procesos de selección altamente competitivos con fuerte exigencia en matemáticas aplicadas, Python y física de sistemas'],
    interviewArguments: [
      'Licenciatura en Geofísica con sólida base matemática y física de medios continuos y dinámica de fluidos.',
      'Doble Máster en Ciencias Ambientales con experiencia cuantitativa en modelación, Python, teledetección y R.',
      'Experiencia directa en desarrollo de gemelos digitales (Wetland Monitor, AgriTwin) y procesamiento de datos biofísicos y micrometeorológicos.'
    ],
    techStack: ['Python', 'PyTorch', 'Physics-Informed Neural Networks (PINNs)', 'Remote Sensing', 'Earth Observation', 'Climate Emulators', 'QGIS / GEE'],
    lastResearched: '2026-11-09',
    quadrants: ['DACH', 'UK_NL', 'GLOBAL'],
    sectorCluster: 'RD_PUBLIC',
    contacts: [
      {
        id: 'contact-angela-meyer',
        name: 'Prof. Dr. Angela Meyer',
        role: 'Investigadora Principal (PI) / Directora del Lab',
        linkedinUrl: 'https://www.linkedin.com/in/angela-meyer-ai/',
        notes: 'Catedrática y líder del Energy Weather & AI Lab en TU Delft y BFH.'
      }
    ]
  },
  {
    id: 'comp-icos',
    name: 'ICOS Head Office & FMI (Integrated Carbon Observation System)',
    website: 'https://www.icos-cp.eu/',
    sector: 'Infraestructura Europea de Observación de Carbono y Torres Eddy Covariance',
    size: '500+ científicos en 16 países miembros',
    headquarters: 'Helsinki (Finlandia)',
    description: 'La Infraestructura Europea de Investigación (ERIC) que estandariza, recopila y publica mediciones continuas de flujos de gases de efecto invernadero a través de más de 170 estaciones micrometeorológicas (torres Eddy Covariance) en ecosistemas terrestres, atmósfera y océanos de Europa.',
    keyProjects: [
      'Estandarización europea de procesamiento de flujos de alta frecuencia (10-20 Hz) de CO2, CH4 y H2O',
      'Monitoreo a largo plazo del balance de carbono en turberas boreales y templadas de Europa',
      'Portal de datos abiertos ICOS Carbon Portal integrado con Copernicus y modelos climáticos globales'
    ],
    recentNews: [
      {
        title: 'Integración de nuevas estaciones micrometeorológicas en ecosistemas de humedales en transición',
        date: '2026-09-30',
        snippet: 'Protocolos unificados para medición de picos de metano tras rehumidificación.'
      }
    ],
    workCulture: [
      'Referencia científica continental absoluta en micrometeorología y flujos de GEI',
      'Comunidad científica paneuropea con sede central en Helsinki',
      'Entorno de trabajo 100% en inglés'
    ],
    redFlags: ['Clima nórdico exigente en invierno para trabajo de campo prolongado'],
    interviewArguments: [
      'Experiencia directa en operación y procesamiento de datos de torres Eddy Covariance en turberas durante la investigación en CAU Kiel y AMU Poznań.',
      'Capacidad para procesar datos de turbulencia en R y Python conforme a los estándares de ICOS.'
    ],
    techStack: ['EddyPro', 'R', 'Python', 'Micrometeorología', 'Sensores Licor / Campbell Scientific'],
    lastResearched: '2026-10-28',
    quadrants: ['NORDICS', 'GLOBAL'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-ghgsat',
    name: 'GHGSat',
    website: 'https://www.ghgsat.com/',
    sector: 'Teledetección Espacial de Alta Resolución para Emisiones de Metano y GEI',
    size: '120+ ingenieros aeroespaciales, físicos de la atmósfera y científicos de datos',
    headquarters: 'Montreal (Canadá) / Oficinas en Londres y Calgary',
    description: 'Líder mundial indiscutido en teledetección espacial de alta resolución para emisiones de gases de efecto invernadero. Opera una constelación propia de nanosatélites en órbita baja con espectrómetros infrarrojos capaces de detectar penachos individuales de metano y CO2 a nivel de metro cuadrado.',
    keyProjects: [
      'Constelación de nanosatélites de monitoreo global de metano (resolución espacial < 25 metros)',
      'Detección de emisiones fugitivas en humedales, vertederos y plantas de gas natural',
      'Fusión de datos satelitales propios con Sentinel-5P y mediciones de superficie para auditoría global'
    ],
    recentNews: [
      {
        title: 'Lanzamiento de tres nuevos satélites y contrato con agencias espaciales para monitoreo de metano',
        date: '2026-10-04',
        snippet: 'Capacidad de revisar sitios de emisión cada pocos días a escala planetaria.'
      }
    ],
    workCulture: [
      'Pioneros de la industria NewSpace y climate-tech canadiense',
      'Sede en Montreal (polo aeroespacial y de inteligencia artificial de Norteamérica)',
      'Posibilidad de visado Working Holiday IEC de 1 año para ciudadanos chilenos'
    ],
    redFlags: ['Diferencia horaria respecto a Europa y necesidad de adaptarse al ecosistema NewSpace'],
    interviewArguments: [
      'Geofísica con física de transferencia radiativa y espectrometría de gases (CO2/CH4).',
      'Especialista en emisiones de metano en humedales y turberas.',
      'Acceso al tratado de movilidad laboral bilateral Chile-Canadá (IEC hasta los 35 años).'
    ],
    techStack: ['Python', 'Espectrometría Infrarroja', 'Earth Observation', 'Sentinel-5P', 'GIS'],
    lastResearched: '2026-10-28',
    quadrants: ['CANADA_GLOBAL', 'GLOBAL'],
    sectorCluster: 'CARBON_TECH_MRV'
  },
  {
    id: 'comp-pachama',
    name: "Pachama",
    website: 'https://pachama.com/',
    sector: "Verificación Satelital & AI para Proyectos Forestales de Carbono (MRV)",
    size: "90+ ingenieros de teledetección, científicos forestales y de machine learning",
    headquarters: "San Francisco (EE.UU.) / Equipo Remoto Global y Europa",
    description: "Pionero mundial en teledetección satelital, LiDAR y visión computacional para la verificación de integridad y monitoreo continuo de proyectos de secuestro de carbono en biomasa forestal.",
    keyProjects: [
          "Plataforma Pachama Originals de monitoreo dinámico de biomasa mediante satélite",
          "Modelos de estimación de adición y deforestación evitada con series temporales Landsat y Sentinel",
          "Integración de LiDAR aerotransportado con modelos de Machine Learning para alometría forestal"
    ],
    recentNews: [
      {
        title: "Despliegue de modelos de reforestación digital y alianzas con fondos climáticos globales",
        date: "2026-09-18",
        snippet: "Consolidación de estándares digitales para verificación y venta de créditos con base biológica."
      }
    ],
    workCulture: [
          "Cultura 100% remota y global orientada a producto científico",
          "Enfoque de headmaster en rigor metodológico y revisión por pares",
          "Compensación competitiva en equity y salarios tecnológicos internacionales"
    ],
    redFlags: [
          "Ritmo exigente de scale-up y alta dependencia del ciclo de volatilidad de los mercados voluntarios de carbono"
    ],
    interviewArguments: [
          "Geofísico computacional con base en teledetección satelital (Google Earth Engine, Sentinel) y validación empírica.",
          "Experiencia directa en desarrollo de aplicaciones científicas geoespaciales (Wetland Monitor).",
          "Criterio cuantitativo estricto frente al greenwashing en métricas de adición."
    ],
    techStack: ["Python","Google Earth Engine","Sentinel-2","LiDAR","PyTorch","GIS"],
    lastResearched: '2026-10-29',
    quadrants: ['GLOBAL','CANADA_GLOBAL'],
    sectorCluster: 'CARBON_TECH_MRV'
  },
  {
    id: 'comp-space-intelligence',
    name: "Space Intelligence",
    website: 'https://www.space-intelligence.com/',
    sector: "Cartografía Satelital Auditada de Carbono Forestal y Turberas",
    size: "60+ científicos de teledetección, ecólogos espaciales y analistas GIS",
    headquarters: "Edimburgo (Escocia, Reino Unido)",
    description: "Empresa escocesa de inteligencia geoespacial fundada por profesores universitarios de Edimburgo. Especializada en mapas auditados de cobertura del suelo, biomasa y dinámica de turberas para desarrolladores de créditos de carbono de alta integridad.",
    keyProjects: [
          "Mapeo de alta resolución de turberas templadas y tropicales para proyectos de conservación",
          "Auditoría satelital de cambios de biomasa y degradación forestal para estándares Verra y Gold Standard",
          "Modelos de predicción de pérdida de carbono edáfico ante drenaje de humedales"
    ],
    recentNews: [
      {
        title: "Alianza estratégica con corporaciones globales para auditoría satelital de turberas en Europa y Sudeste Asiático",
        date: "2026-10-10",
        snippet: "Despliegue de cartografía de estratos de vegetación y humedad edáfica a 10 metros de resolución."
      }
    ],
    workCulture: [
          "ADN académico derivado de la Universidad de Edimburgo con rigurosidad científica británica",
          "Trabajo híbrido en Edimburgo con apertura a perfiles europeos transdisciplinarios",
          "Fuerte énfasis en publicaciones científicas y validación de incertidumbre estadística"
    ],
    redFlags: [
          "Crecimiento selectivo que exige demostración exhaustiva de solvencia técnica en teledetección"
    ],
    interviewArguments: [
          "Tesis en dinámica de turberas y balance de gases de efecto invernadero (CAU Kiel / Wallener Au).",
          "Formación europea M.Sc. con dominio de teledetección satelital e hidrogeofísica.",
          "Capacidad de interlocución técnica en inglés C2 en el ecosistema británico de Edinburgh Climate Tech."
    ],
    techStack: ["Python","SAR","Sentinel-1/2","R","QGIS","Earth Engine"],
    lastResearched: '2026-10-29',
    quadrants: ['UK_NL','GLOBAL'],
    sectorCluster: 'CARBON_TECH_MRV'
  },
  {
    id: 'comp-soil-capital',
    name: "Soil Capital",
    website: 'https://www.soilcapital.com/',
    sector: "MRV de Carbono Edáfico en Agricultura Regenerativa & Certificación Agraria",
    size: "70+ agrónomos, edafólogos y desarrolladores de software",
    headquarters: "Bruselas (Bélgica) / París / Londres",
    description: "Primera plataforma europea certificada por terceros (Norma ISO 14064-3) que remunera a los agricultores por el secuestro de carbono en el suelo y la reducción de emisiones de GEI mediante prácticas agroecológicas regenerativas.",
    keyProjects: [
          "Programa de certificación y auditoría de carbono edáfico en más de 350.000 hectáreas europeas",
          "Cálculo de balances de carbono en finca combinando modelos empíricos (Cool Farm Tool) y mediciones analíticas",
          "Monitoreo de almacenamiento de materia orgánica y compactación del suelo"
    ],
    recentNews: [
      {
        title: "Expansión de programas de carbono edáfico en Francia, Bélgica y Reino Unido superando 1.000 explotaciones asociadas",
        date: "2026-09-25",
        snippet: "Pago de primas récord a agricultores por secuestro medido de carbono en horizontes superficiales."
      }
    ],
    workCulture: [
          "Empresa con certificación B-Corp orientada al impacto territorial tangible en el campo europeo",
          "Equipo multicultural francófono, anglófono y europeo con sedes en Bruselas y París",
          "Fusión de rigor agronómico con plataformas digitales ágiles"
    ],
    redFlags: [
          "Sensibilidad a los cambios de la Política Agrícola Común (PAC) de la Unión Europea"
    ],
    interviewArguments: [
          "Especialista en física de suelos, propiedades hidrofísicas y dinámica de materia orgánica.",
          "Conocimiento del marco regulatorio de suelos de la Unión Europea y directivas de descarbonización.",
          "Perfil transdisciplinario capaz de conectar datos edáficos cuantitativos con interfaces para decisores."
    ],
    techStack: ["Python","Modelos Cool Farm Tool","Edafológicos","GIS","PostgreSQL"],
    lastResearched: '2026-10-29',
    quadrants: ['UK_NL','GLOBAL'],
    sectorCluster: 'CARBON_TECH_MRV'
  },
  {
    id: 'comp-carboculture',
    name: "Carboculture",
    website: 'https://www.carboculture.com/',
    sector: "Biochar de Alta Temperatura & Remoción de Carbono Certificada (CDR)",
    size: "35+ ingenieros químicos, científicos de materiales y especialistas en MRV",
    headquarters: "Helsinki (Finlandia)",
    description: "Scale-up climática nórdica que convierte residuos de biomasa leñosa en biocarbón funcional de alta estabilidad mediante pirólisis flash a alta temperatura, logrando remoción de carbono permanente certificada en registros europeos (Puro.earth).",
    keyProjects: [
          "Instalación industrial R-1000 en Helsinki para producción de biochar y captura permanente de carbono",
          "Metodología MRV de durabilidad de carbono en suelos agrícolas y sustratos urbanos (> 1.000 años de estabilidad)",
          "Aprovechamiento del calor residual de pirólisis para inyección en redes de calefacción urbana nórdicas"
    ],
    recentNews: [
      {
        title: "Operación continua de su planta piloto industrial en Helsinki y venta anticipada de créditos CDR de alta calidad",
        date: "2026-10-02",
        snippet: "Validación por laboratorios independientes de la tasa de mineralización del carbono fijo."
      }
    ],
    workCulture: [
          "Ecosistema tecnológico nórdico de innovación profunda (Deep Tech) en Helsinki",
          "Enfoque de ingeniería pragmática, cultura abierta y horizontal finlandesa con inglés como idioma oficial",
          "Proyectos piloto respaldados por fondos de innovación de la Unión Europea (Horizon Europe / EIC)"
    ],
    redFlags: [
          "Retos de escalabilidad industrial en la construcción de reactores de gran tonelaje"
    ],
    interviewArguments: [
          "Conocimiento de la interacción entre enmiendas orgánicas pirogénicas, humedad y microestructura del suelo.",
          "Máster europeo en Gestión y Protección Ambiental en el eje báltico (Kiel - Poznań).",
          "Capacidad de evaluar la durabilidad del carbono y protocolos MRV para créditos CDR en Finlandia."
    ],
    techStack: ["Python","MRV Puro.earth","Análisis Termoquímico","LCA","Sensor Networks"],
    lastResearched: '2026-10-29',
    quadrants: ['NORDICS'],
    sectorCluster: 'CARBON_TECH_MRV'
  },
  {
    id: 'comp-carbonspace',
    name: "CarbonSpace",
    website: 'https://carbonspace.tech/',
    sector: "Monitoreo Satelital de Huella de Carbono y Flujos de GEI a Nivel Parcela",
    size: "25+ físicos de la atmósfera, analistas satelitales y modeladores",
    headquarters: "Dublín (Irlanda) / Hub Remoto Europa",
    description: "Plataforma SaaS que calcula la huella de carbono y los flujos netos de CO2 en agricultura, silvicultura y proyectos de uso del suelo combinando datos satelitales ópticos y térmicos con mediciones de estaciones Eddy Covariance a escala global.",
    keyProjects: [
          "Algoritmo de estimación de absorción neta de CO2 (NEE) a nivel de píxel sin necesidad de sensores locales",
          "Monitoreo de carbono para cadenas de suministro agroalimentarias de grandes corporaciones europeas",
          "Calibración de modelos espaciales utilizando torres de flujo ICOS y Ameriflux"
    ],
    recentNews: [
      {
        title: "Cierre de ronda de financiación semilla y expansión de clientes corporativos en la Unión Europea",
        date: "2026-08-29",
        snippet: "Validación cruzada de su algoritmo satelital contra 80 torres de Eddy Covariance en todo el mundo."
      }
    ],
    workCulture: [
          "Startup ágil de analítica geoespacial con equipo distribuido en Europa",
          "Fuerte foco en modelado biofísico y procesamiento masivo de imágenes satelitales",
          "Ritmo de desarrollo rápido y cultura orientada a resultados técnicos medibles"
    ],
    redFlags: [
          "Tamaño reducido del equipo que exige versatilidad en roles técnicos y científicos"
    ],
    interviewArguments: [
          "Experiencia directa en estaciones micrometeorológicas de Eddy Covariance y balance de GEI (CO2/CH4).",
          "Manejo de programación científica para correlacionar torres de flujo terrestres con series temporales satelitales.",
          "Comprensión rigurosa de las incertidumbres en la estimación de NEE y respiración ecosistémica."
    ],
    techStack: ["Python","Google Earth Engine","Eddy Covariance Calibration","Sentinel-2","MODIS"],
    lastResearched: '2026-10-29',
    quadrants: ['UK_NL','GLOBAL'],
    sectorCluster: 'CARBON_TECH_MRV'
  },
  {
    id: 'comp-ctrees',
    name: "CTrees",
    website: 'https://ctrees.org/',
    sector: "Plataforma Global Satelital de Contabilidad de Carbono en Bosques y Turberas",
    size: "45+ investigadores de teledetección y modelado de biomasa",
    headquarters: "Pasadena (California) / Remoto Internacional",
    description: "Organización científica sin ánimo de lucro fundada por científicos de la NASA JPL, UCLA y universidades internacionales. Ofrece datos abiertos y de alta precisión sobre almacenamiento de carbono en todos los bosques y ecosistemas leñosos del planeta.",
    keyProjects: [
          "Herramienta Land Use Change Carbon Accounting para gobiernos y tratados internacionales",
          "Monitoreo operacional de pérdidas de carbono por incendios forestales y degradación selectiva",
          "Integración de misiones espaciales GEDI (LiDAR), NISAR (radar) y Sentinel para biomasa aérea"
    ],
    recentNews: [
      {
        title: "Publicación de datasets globales de carbono forestal actualizados cada 15 días en la COP",
        date: "2026-09-14",
        snippet: "Provisión de métricas independientes a delegaciones gubernamentales para sus inventarios nacionales NDC."
      }
    ],
    workCulture: [
          "Ambiente de investigación científica rigurosa heredado del JPL y la academia de élite",
          "Transparencia metodológica absoluta con algoritmos abiertos y auditables",
          "Colaboración estrecha con organismos de Naciones Unidas y ministerios de medio ambiente"
    ],
    redFlags: [
          "Financiación dependiente de donaciones filantrópicas y subvenciones de investigación internacional"
    ],
    interviewArguments: [
          "Base sólida en geofísica matemática y física de la teledetección (radar, óptico e infrarrojo).",
          "Experiencia en comunicación técnica ante organismos legislativos y gubernamentales.",
          "Compromiso demostrado con la integridad de los datos climáticos sin servidumbre comercial."
    ],
    techStack: ["Python","GEDI LiDAR","NISAR","Earth Engine","Machine Learning","Docker"],
    lastResearched: '2026-10-29',
    quadrants: ['GLOBAL'],
    sectorCluster: 'CARBON_TECH_MRV'
  },
  {
    id: 'comp-munich-re',
    name: "Munich Re (Geo Risks Research & Climate Solutions)",
    website: 'https://www.munichre.com/',
    sector: "Reaseguro Global, Modelación de Riesgos Geofísicos y Soluciones Climáticas",
    size: "40.000+ empleados globales (división Geo Risks: 120+ geofísicos, climatólogos e hidrólogos)",
    headquarters: "Múnich (Baviera, Alemania)",
    description: "El mayor reasegurador del mundo y la entidad pionera global en investigación de catástrofes naturales y cambio climático desde 1974. Su unidad de Geo Risks Research modela amenazas geofísicas, hidrológicas y climáticas extremas para la suscripción de carteras de billones de euros.",
    keyProjects: [
          "Base de datos mundial NatCatSERVICE para el análisis cuantitativo de siniestros por desastres naturales",
          "Modelación física de sequías extremas, olas de calor y estrés hídrico en activos agrícolas e industriales",
          "Desarrollo de seguros paramétricos de resiliencia frente a incendios forestales e inundaciones"
    ],
    recentNews: [
      {
        title: "Informe semestral de catástrofes naturales mundiales y alerta por pérdidas récord debidas a eventos convectivos severos",
        date: "2026-07-28",
        snippet: "La entidad destaca la necesidad de modelos probabilísticos avanzados que integren la dinámica de cambio de uso de suelo."
      }
    ],
    workCulture: [
          "Estándar de oro corporativo global con sede central histórica en Múnich",
          "Alta concentración de doctores y científicos de la tierra trabajando codo a codo con actuarios",
          "Paquetes salariales de primer nivel europeo, beneficios sociales completos y estabilidad a largo plazo"
    ],
    redFlags: [
          "Procesos de selección muy rigurosos y estructuras jerárquicas corporativas de gran escala"
    ],
    interviewArguments: [
          "Geofísico cuantitativo con formación en Alemania (CAU Kiel) y comprensión del ecosistema DACH.",
          "Especialista en modelación física de incendios forestales, balance hídrico y series hidrológicas extremas.",
          "Capacidad analítica bilingüe en alemán e inglés para interactuar con sus equipos técnicos en Múnich."
    ],
    techStack: ["Python","R","Cat Modeling (RMS/AIR)","GIS","SQL","Análisis Probabilístico"],
    lastResearched: '2026-10-29',
    quadrants: ['DACH','GLOBAL'],
    sectorCluster: 'CAT_RISK_INSURANCE'
  },
  {
    id: 'comp-swiss-re',
    name: "Swiss Re (Cat Perils & Climate Resilience)",
    website: 'https://www.swissre.com/',
    sector: "Modelación de Peligros Naturales (Cat Perils) y Reaseguros Paramétricos",
    size: "14.000+ empleados globales (división Cat Perils: 150+ modeladores de riesgo)",
    headquarters: "Zúrich (Suiza) / Hubs en Múnich, Londres y Madrid",
    description: "Líder global en reaseguro y gestión de riesgos. Su equipo interno Cat Perils desarrolla modelos propietarios de catástrofes naturales basados en la física del clima para estimar pérdidas potenciales y diseñar coberturas paramétricas gubernamentales y corporativas.",
    keyProjects: [
          "Plataforma propietaria CatNet® para evaluación global de exposición a peligros naturales hiperlocales",
          "Modelos de riesgo físico de incendios forestales en Europa meridional y cuencas mediterráneas",
          "Estructuración de bonos de catástrofe (Cat Bonds) vinculados a índices climáticos empíricos"
    ],
    recentNews: [
      {
        title: "Lanzamiento de nuevas soluciones paramétricas de sequía y déficit hídrico para agricultura europea",
        date: "2026-09-08",
        snippet: "Pagos automáticos gatillados por índices satelitales de humedad de suelo sin peritaje presencial."
      }
    ],
    workCulture: [
          "Cultura suiza multilingüe, altamente técnica, analítica y orientada a la excelencia cuantitativa",
          "Ambiente de trabajo flexible con políticas híbridas consolidadas (Own The Way You Work)",
          "Excelente compensación en francos suizos / euros y movilidad interna internacional"
    ],
    redFlags: [
          "Alto nivel de exigencia cuantitativa y requisitos matemáticos y estadísticos estrictos"
    ],
    interviewArguments: [
          "Formación geofísica con física de medios continuos y estadística espacial.",
          "Conocimiento directo de dinámicas de degradación de cuencas e incendios forestales.",
          "Alineación perfecta con su modelo de reaseguros paramétricos basados en satélites y sensores de superficie."
    ],
    techStack: ["Python","CatNet","Modelos Climáticos Propietarios","R","GIS","Cloud Computing"],
    lastResearched: '2026-10-29',
    quadrants: ['DACH','GLOBAL'],
    sectorCluster: 'CAT_RISK_INSURANCE'
  },
  {
    id: 'comp-moodys-rms',
    name: "Moody's RMS (Risk Management Solutions)",
    website: 'https://www.rms.com/',
    sector: "Software y Modelos Cuantitativos de Catástrofes Naturales (Cat Modeling)",
    size: "1.200+ ingenieros de software, físicos y meteorólogos",
    headquarters: "Londres (Reino Unido) / Oficinas en Zúrich y EE.UU.",
    description: "El proveedor de modelos de riesgo de catástrofe más utilizado del planeta. Sus modelos hidrológicos, sísmicos, de tormentas e incendios forestales son el estándar que emplean reaseguradores, bancos y agencias gubernamentales para calcular capital de solvencia (Solvencia II).",
    keyProjects: [
          "Modelo RMS Europe Wildfire HD para simulación probabilística de propagación del fuego e ignición",
          "Plataforma Moody's Intelligent Risk Platform para cálculo de pérdidas máximas probables (PML)",
          "Módulos de riesgo climático físico bajo escenarios del IPCC (SSP1-2.6 a SSP5-8.5)"
    ],
    recentNews: [
      {
        title: "Actualización del modelo de riesgo de inundación fluvial y pluvial en Europa con datos climáticos de alta resolución",
        date: "2026-10-12",
        snippet: "Simulación de escenarios de precipitación extrema y capacidad de infiltración edáfica en cuencas urbanizadas."
      }
    ],
    workCulture: [
          "Ambiente tecnológico corporativo centrado en la modelación matemática y la ingeniería de software",
          "Grandes oficinas en el centro financiero de Londres con centros técnicos en Zúrich",
          "Oportunidades constantes de capacitación en metodologías avanzadas de Cat Modeling"
    ],
    redFlags: [
          "Enfoque muy corporativo y dependiente de los ciclos de entrega de software de gran escala"
    ],
    interviewArguments: [
          "Geofísico con sólidos fundamentos de física matemática, propagación de ondas y balance hídrico.",
          "Experiencia en investigación de incendios forestales en Chile y dinámicas edáficas en Alemania.",
          "Perfil ideal para trabajar como Cat Model Developer o Exposure Risk Analyst en el polo de Londres."
    ],
    techStack: ["Python","C++","SQL Server","ArcGIS Pro","HPC Clusters","RMS RiskLink"],
    lastResearched: '2026-10-29',
    quadrants: ['UK_NL','DACH','GLOBAL'],
    sectorCluster: 'CAT_RISK_INSURANCE'
  },
  {
    id: 'comp-guy-carpenter',
    name: "Guy Carpenter (División Analítica de Marsh McLennan)",
    website: 'https://www.guycarp.com/',
    sector: "Intermediación de Reaseguro y Análisis Cuantitativo de Catástrofes Naturales",
    size: "3.500+ actuarios, modeladores geofísicos y especialistas de riesgo",
    headquarters: "Londres (Reino Unido) / Presencia en Madrid y Bilbao",
    description: "Líder mundial en intermediación de reaseguro y consultoría de riesgos catastróficos. Su equipo GC Analytics asesora a aseguradoras de toda Europa en la optimización de carteras frente a eventos extremos climáticos mediante modelos catastróficos avanzados.",
    keyProjects: [
          "Modelación probabilística y pruebas de estrés ante incendios e inundaciones en la Península Ibérica y Europa central",
          "Herramientas analíticas GC AdvantagePoint para geolocalización de activos y acumulación de riesgos",
          "Diseño de estructuras de transferencia de riesgo para consorcios públicos y aseguradoras privadas"
    ],
    recentNews: [
      {
        title: "Publicación de análisis estratégico sobre el impacto del cambio climático en las renovaciones de reaseguro europeas",
        date: "2026-09-20",
        snippet: "Crecimiento de la demanda de científicos de la tierra para parametrizar riesgos climáticos secundarios."
      }
    ],
    workCulture: [
          "Cultura financiera de alto rendimiento en el corazón de la City de Londres y redes en Madrid",
          "Trabajo multidisciplinar entre científicos de datos, geocientíficos e intermediarios de reaseguro",
          "Acceso al ecosistema global del grupo Marsh McLennan con recursos formativos punteros"
    ],
    redFlags: [
          "Picos intensos de trabajo en las épocas de renovación de contratos de reaseguro (otoño/invierno)"
    ],
    interviewArguments: [
          "Formación cuantitativa sólida en geofísica con capacidad de traducción analítica de riesgos naturales.",
          "Conexión entre el mercado asegurador español (vía de nacionalidad 2 años) y el mercado británico (Londres).",
          "Dominio bilingüe inglés-español con soltura en Python y análisis estadístico."
    ],
    techStack: ["Python","R","RMS","AIR Touchstone","GIS","Excel/VBA Avanzado"],
    lastResearched: '2026-10-29',
    quadrants: ['UK_NL','EUSKADI','GLOBAL'],
    sectorCluster: 'CAT_RISK_INSURANCE'
  },
  {
    id: 'comp-kettle',
    name: "Kettle",
    website: 'https://ourkettle.com/',
    sector: "Reaseguro Paramétrico de Incendios Forestales basado en Física y Machine Learning",
    size: "40+ modeladores de fuego, geocientíficos computacionales y analistas",
    headquarters: "San Francisco (EE.UU.) / Remoto Global",
    description: "Agencia de suscripción de reaseguro insurtech que reinventa la modelación del riesgo de incendios forestales. Utiliza redes neuronales de aprendizaje profundo combinadas con física de transferencia de calor y datos satelitales hiperlocales para predecir siniestros con precisión inédita.",
    keyProjects: [
          "Modelo predictivo de propagación de incendios entrenado con más de 14 años de datos satelitales",
          "Pólizas paramétricas de reaseguro para compañías de servicios públicos y propietarios forestales",
          "Evaluación de humedad de combustible y riesgo de ignición con series de tiempo climáticas"
    ],
    recentNews: [
      {
        title: "Ampliación de su capacidad de suscripción de reaseguro respaldada por sindicatos de Lloyd's de Londres",
        date: "2026-08-15",
        snippet: "Validación empírica de su ratio de precisión en la predicción de pérdidas por incendios catastróficos."
      }
    ],
    workCulture: [
          "Insurtech de Silicon Valley con cultura remota, ágil y centrada en la ciencia de datos aplicada",
          "Mentalidad de disrupción frente a los modelos actuariales tradicionales obsoletos",
          "Compensación atractiva con stock options y proyectos de alto impacto tecnológico"
    ],
    redFlags: [
          "Exposición a temporadas de incendios de gravedad extrema que ponen a prueba los modelos"
    ],
    interviewArguments: [
          "Investigador en modelación física de incendios forestales en cuencas de Chile y dinámica de combustible vegetal.",
          "Programación científica en Python con experiencia en datos geoespaciales y teledetección.",
          "Perfil idóneo para calibrar modelos de propagación de fuego en ecosistemas de interfaz urbano-forestal."
    ],
    techStack: ["Python","PyTorch","Simuladores de Fuego (FARSITE/Behave)","AWS","Earth Observation"],
    lastResearched: '2026-10-29',
    quadrants: ['GLOBAL'],
    sectorCluster: 'CAT_RISK_INSURANCE'
  },
  {
    id: 'comp-fathom',
    name: "Fathom Global",
    website: 'https://www.fathom.global/',
    sector: "Modelación Hidrológica de Inundaciones y Mapas Satelitales de Riesgo Físico",
    size: "80+ hidrólogos, geógrafos cuantitativos y científicos de datos",
    headquarters: "Bristol (Reino Unido)",
    description: "Spinoff de investigación de la Universidad de Bristol especializada en la modelación hidrodinámica global de inundaciones fluviales, pluviales y costeras a nivel submétrico para el sector asegurador, financiero y humanitario.",
    keyProjects: [
          "Fathom Global Flood Map: Mapa hidrográfico mundial de inundaciones bajo escenarios de cambio climático",
          "Modelación de eventos de precipitaciones torrenciales y capacidad de drenaje en cuencas hidrográficas",
          "Integración con el Banco Mundial y reaseguradores para cálculo de exposición ante desastres"
    ],
    recentNews: [
      {
        title: "Integración de sus modelos de inundación en las principales plataformas de software asegurador internacional",
        date: "2026-09-30",
        snippet: "Publicación de nuevos mapas que cubren el 100% de la masa terrestre con datos climáticos actualizados."
      }
    ],
    workCulture: [
          "Origen universitario con vocación de excelencia científica en Bristol (hub ambiental de UK)",
          "Equipos de desarrollo hidrológico rigurosos con publicaciones constantes en Nature Climate Change",
          "Ambiente de trabajo colaborativo, flexible y orientado a la precisión cuantitativa"
    ],
    redFlags: [
          "Competencia creciente en modelos de inundación satelital abierta"
    ],
    interviewArguments: [
          "Geofísico con dominio de hidrología de cuencas, escorrentía superficial y balance hídrico.",
          "Experiencia en modelación hidrogeofísica y desarrollo de herramientas web interactivas.",
          "Excelente nivel de inglés técnico para incorporarse al polo de hidrología cuantitativa de Bristol."
    ],
    techStack: ["Python","Modelos Hidrodinámicos 2D","GIS","C++","HPC","Datos Satelitales"],
    lastResearched: '2026-10-29',
    quadrants: ['UK_NL','GLOBAL'],
    sectorCluster: 'CAT_RISK_INSURANCE'
  },
  {
    id: 'comp-luke',
    name: "LUKE - Natural Resources Institute Finland (Luonnonvarakeskus)",
    website: 'https://www.luke.fi/en',
    sector: "Investigación Federal en Bosques Boreales, Turberas y Balances de Carbono",
    size: "1.300+ investigadores y personal técnico",
    headquarters: "Helsinki / Joensuu / Oulu (Finlandia)",
    description: "Organismo público de investigación federal de Finlandia bajo el Ministerio de Agricultura y Silvicultura. Líder mundial indiscutido en investigación de turberas boreales drenadas y rehumedecidas, balances de carbono forestal y edáfico, y contabilidad nacional de GEI para la CMNUCC.",
    keyProjects: [
          "Red nacional finlandesa de monitoreo de emisiones de CO2 y CH4 en turberas y suelos forestales",
          "Ensayos de campo sobre silvicultura de cobertura continua en suelos turbosos para mitigar emisiones",
          "Desarrollo de modelos biogeoquímicos de transporte de carbono en cuencas boreales"
    ],
    recentNews: [
      {
        title: "Lanzamiento del programa de investigación nacional sobre rehumedecimiento de turberas de extracción y silvícolas",
        date: "2026-10-14",
        snippet: "Evaluación del impacto del restablecimiento de la tabla de agua en la reducción neta de GEI y biodiversidad."
      }
    ],
    workCulture: [
          "Institución pública finlandesa con condiciones laborales excelentes y alta conciliación",
          "Convenio colectivo del sector público finlandés con financiación de investigación sólida y estable",
          "Instalaciones de campo e instrumentación analítica de vanguardia mundial en Joensuu y Oulu"
    ],
    redFlags: [
          "El finlandés es útil para trámites administrativos internos, aunque el inglés es el idioma de investigación"
    ],
    interviewArguments: [
          "Tesis de maestría centrada específicamente en la restauración y rehumedecimiento de turberas y flujos de GEI.",
          "Experiencia directa con instrumentación micrometeorológica, cámaras de gases y parámetros mecánicos del suelo.",
          "Doble M.Sc. en CAU Kiel y AMU Poznań con experiencia en el contexto ecológico del norte de Europa."
    ],
    techStack: ["R","Eddy Covariance","Cámaras Cerradas","Modelos Biogeoquímicos","GIS","Python"],
    lastResearched: '2026-10-29',
    quadrants: ['NORDICS'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-vtt',
    name: "VTT Technical Research Centre of Finland",
    website: 'https://www.vttresearch.com/en',
    sector: "Investigación Tecnológica Aplicada, Sensórica y Transición Ecológica",
    size: "2.100+ científicos e ingenieros",
    headquarters: "Espoo (Finlandia) / Nodos en Oulu y Tampere",
    description: "La mayor organización de investigación y tecnología aplicada del norte de Europa, propiedad del Estado finlandés. Desarrolla soluciones tecnológicas avanzadas en sensores ambientales, bioeconomía circular, gemelos digitales y teledetección para la descarbonización industrial.",
    keyProjects: [
          "Desarrollo de sensores miniaturizados para monitoreo de humedad de suelo y emisiones gaseosas en campo",
          "Gemelos digitales de cuencas hidrográficas y uso del suelo para simulación de escenarios climáticos",
          "Materiales avanzados y biorrefinerías a partir de biomasa sostenible"
    ],
    recentNews: [
      {
        title: "Despliegue del programa de investigación en gemelos digitales y sistemas ciberfísicos para el clima nórdico",
        date: "2026-09-19",
        snippet: "Integración de computación cuántica y sensórica satelital para predicción de resiliencia ecológica."
      }
    ],
    workCulture: [
          "Uno de los centros de I+D más prestigiosos de Europa con mentalidad orientada a la transferencia tecnológica",
          "Inglés como idioma corporativo diario en su campus central de Otaniemi (Espoo)",
          "Cultura nórdica basada en la confianza, autonomía profesional y balance de vida personal"
    ],
    redFlags: [
          "Orientación más tecnológica/ingenieril que puramente de ciencia básica de campo"
    ],
    interviewArguments: [
          "Creador de soluciones de software científico y gemelos digitales (AgriTwin, Wetland Monitor).",
          "Geofísico con sólida base matemática, desarrollo en Python y manejo de sensores de campo.",
          "Encaje directo en sus consorcios europeos Horizon Europe en gestión ambiental y sensórica."
    ],
    techStack: ["Python","Digital Twins","IoT / Sensórica","Machine Learning","GIS","C++"],
    lastResearched: '2026-10-29',
    quadrants: ['NORDICS'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-ufz',
    name: "Helmholtz-Zentrum für Umweltforschung (UFZ)",
    website: 'https://www.ufz.de/',
    sector: "Investigación Ambiental de la Asociación Helmholtz: Sequías, Suelos y Cuencas",
    size: "1.100+ científicos",
    headquarters: "Leipzig (Sajonia, Alemania) / Sedes en Halle y Magdeburg",
    description: "Centro de investigación ambiental de la Asociación Helmholtz dedicado a la sostenibilidad de los recursos naturales. Creadores y operadores del Dürremonitor Deutschland (Monitor de Sequía de Alemania) y referentes mundiales en modelación hidrológica de mesoescala (mHM) y física de suelos.",
    keyProjects: [
          "Dürremonitor Deutschland: Simulación diaria del estado de humedad del suelo en toda Alemania a 4 km de resolución",
          "Observatorio de cuencas hidrológicas y ecosistemas terrestres TERENO (Harz / Central German Lowland)",
          "Investigación sobre la física de transporte de agua en la zona vadosa y recarga de acuíferos"
    ],
    recentNews: [
      {
        title: "Actualización del modelo mHM integrando datos de satélites gravimétricos y penetrómetros de campo",
        date: "2026-08-11",
        snippet: "Alerta sobre el déficit persistente de humedad en horizontes edáficos profundos en el este de Alemania."
      }
    ],
    workCulture: [
          "Investigación de élite de la Asociación Helmholtz (condiciones TVöD Bund E13 / E14)",
          "Excelente infraestructura de computación científica (HPC) y observatorios de campo permanentes",
          "Sede principal en Leipzig, una de las ciudades con mayor calidad de vida y vitalidad cultural de Alemania"
    ],
    redFlags: [
          "Contratos postdoctorales mayoritariamente sujetos a proyectos con plazos temporales delimitados"
    ],
    interviewArguments: [
          "Geofísico con sólida formación en física de suelos, relaciones hídricas e hidrogeología.",
          "Experiencia académica previa en el sistema universitario alemán (CAU Kiel) con dominio de R y Python.",
          "Alineación exacta con sus líneas de monitoreo de sequías y física de horizontes de suelo."
    ],
    techStack: ["mHM","Python","R","Fortran","GIS","Simulación Numérica de Suelos"],
    lastResearched: '2026-10-29',
    quadrants: ['DACH'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-juelich',
    name: "Forschungszentrum Jülich (IBG-3 Agrosphere)",
    website: 'https://www.fz-juelich.de/en/ibg/ibg-3',
    sector: "Hidrogeofísica, Modelación de Sistemas Suelo-Vegetación y Red TERENO",
    size: "800+ científicos (IBG-3: 110+ investigadores)",
    headquarters: "Jülich (Renania del Norte-Westfalia, Alemania)",
    description: "Uno de los mayores centros de investigación interdisciplinar de Europa. Su instituto IBG-3 (Agrosphere) es el referente europeo absoluto en hidrogeofísica aplicada (georradar, tomografía eléctrica, inducción electromagnética) y modelación de procesos en el continuum suelo-planta-atmósfera.",
    keyProjects: [
          "Observatorio del Terreno Terrestre (TERENO) Eifel/Lower Rhine Valley para flujos de agua y carbono",
          "Modelado integrado ParFlow-CLM para simulación acoplada de agua subterránea, suelo y atmósfera",
          "Uso de geofísica de superficie para cartografiar la heterogeneidad de la conductividad hidráulica del suelo"
    ],
    recentNews: [
      {
        title: "Publicación de avances en caracterización geofísica 3D de raíces y humedad edáfica mediante resonancia magnética y georradar",
        date: "2026-09-05",
        snippet: "Nuevos métodos no invasivos para monitorizar la absorción hídrica de cultivos bajo estrés."
      }
    ],
    workCulture: [
          "Instalaciones científicas monumentales en un campus de investigación cerrado de nivel mundial en Jülich",
          "Condiciones laborales reguladas por el convenio federal TVöD Bund con acceso a supercomputadores",
          "Cultura científica altamente internacional y colaborativa con universidades de Bonn y Colonia"
    ],
    redFlags: [
          "Ubicación en un campus aislado en Jülich que suele requerir vivir en Aquisgrán, Colonia o Düren"
    ],
    interviewArguments: [
          "Título de Geofísico de la Universidad de Chile con formación matemática y física de métodos electromagnéticos.",
          "Máster europeo en Gestión Ambiental con trabajo en suelos, tensión edáfica y aplicaciones biofísicas.",
          "Capacidad demostrada para integrar instrumentación de campo con modelado numérico avanzado."
    ],
    techStack: ["ParFlow","Hydrogeophysics","GPR","ERT","Python","R","Supercomputación JURECA"],
    lastResearched: '2026-10-29',
    quadrants: ['DACH'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-nilu',
    name: "NILU - Norwegian Institute for Air Research",
    website: 'https://nilu.com/',
    sector: "Monitoreo de Gases Atmosféricos, Balance de GEI y Quimiometría",
    size: "175+ científicos e ingenieros ambientales",
    headquarters: "Kjeller (Oslo, Noruega) / Observatorio en Tromsø y Svalbard",
    description: "Fundación de investigación independiente noruega especializada en química de la atmósfera, transporte de contaminantes y monitoreo de gases de efecto invernadero. Opera los observatorios de referencia de Zeppelin en Svalbard y Birkenes en el sur de Noruega.",
    keyProjects: [
          "Monitoreo continuo de concentraciones de fondo de CO2, metano y halocarbonos en el Ártico y Europa",
          "Modelos de dispersión atmosférica y transporte inverso (FLEXPART) para localizar fuentes de emisión de GEI",
          "Estudios de deposición de microplásticos y contaminantes orgánicos persistentes en suelos y turberas nórdicas"
    ],
    recentNews: [
      {
        title: "Publicación del informe anual de gases de efecto invernadero para la Agencia Noruega de Medio Ambiente",
        date: "2026-06-25",
        snippet: "Aceleración del incremento de metano en el Ártico y correlación con el deshielo del permafrost y turberas."
      }
    ],
    workCulture: [
          "Ambiente de investigación noruego con excelentes estándares de conciliación y respeto al tiempo personal",
          "Financiación pública estable y participación en proyectos espaciales de la ESA y Copernicus",
          "Sede moderna a las afueras de Oslo con laboratorios analíticos certificados"
    ],
    redFlags: [
          "Costo de vida elevado en la región metropolitana de Oslo"
    ],
    interviewArguments: [
          "Formación geofísica con física de la atmósfera y experiencia práctica en balances de CO2 y CH4.",
          "Manejo de modelos de transporte de masas y series temporales continuas de datos micrometeorológicos.",
          "Perfil idóneo para operar con el modelo FLEXPART y colaborar en la red europea de monitoreo de GEI."
    ],
    techStack: ["Python","FLEXPART","Eddy Covariance Data","R","Espectrometría Picarro","NetCDF"],
    lastResearched: '2026-10-29',
    quadrants: ['NORDICS'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-creaf',
    name: "CREAF - Centro de Investigación Ecológica y Aplicaciones Forestales",
    website: 'https://www.creaf.cat/es',
    sector: "Dinámica de Incendios Forestales, Teledetección y Carbono Edáfico",
    size: "200+ investigadores y técnicos",
    headquarters: "Cerdanyola del Vallès (Barcelona, España)",
    description: "Consorcio público de investigación de excelencia acreditado con el sello Severo Ochoa. Referente del sur de Europa en dinámica de incendios forestales, balance hídrico de cuencas mediterráneas, teledetección satelital ecológica y secuestro de carbono en suelos y bosques.",
    keyProjects: [
          "Laboratorio de Incendios Forestales y Modelado de Comportamiento del Fuego en paisajes mediterráneos",
          "Plataforma de monitoreo de sequías y estrés hídrico de la vegetación con imágenes Sentinel y drones",
          "Inventarios de carbono orgánico en suelos forestales y agrícolas de la Península Ibérica"
    ],
    recentNews: [
      {
        title: "Liderazgo de consorcios europeos en gestión adaptativa del territorio para prevenir megaincendios forestales",
        date: "2026-09-22",
        snippet: "Propuesta de directrices silvícolas basadas en la física de la biomasa para reducir la continuidad de combustible."
      }
    ],
    workCulture: [
          "Centro de excelencia científica de vanguardia en el campus de la UAB (Barcelona)",
          "Ambiente interdisciplinar de ecólogos, físicos, ingenieros de montes y geógrafos de todo el mundo",
          "Condiciones salariales del sistema científico español con acceso a proyectos europeos Horizon"
    ],
    redFlags: [
          "Retos habituales de estabilización laboral a largo plazo en la investigación española"
    ],
    interviewArguments: [
          "Investigador con tesis geofísica en dinámica de incendios forestales y afección a cuencas hidrográficas.",
          "Nacionalidad chilena con acceso directo a la nacionalidad española por residencia de 2 años.",
          "Doble máster europeo en gestión ambiental con dominio de teledetección satelital y GIS."
    ],
    techStack: ["R","Python","Sentinel-2","Google Earth Engine","Modelos de Fuego","GIS"],
    lastResearched: '2026-10-29',
    quadrants: ['EUSKADI','GLOBAL'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-smhi',
    name: "SMHI (Swedish Meteorological and Hydrological Institute)",
    website: 'https://www.smhi.se/en',
    sector: "Hidrología de Cuencas, Climatología Nórdica y Modelado de Ecosistemas",
    size: "650+ meteorólogos, hidrólogos y climatólogos",
    headquarters: "Norrköping (Suecia)",
    description: "Agencia gubernamental sueca de meteorología e hidrología bajo el Ministerio de Clima y Empresa. Creadores del célebre modelo hidrológico HYPE (utilizado en toda Europa para pronóstico de caudales) y centro de investigación pionero en modelado regional del clima (Rossby Centre).",
    keyProjects: [
          "E-HYPE: Modelo hidrológico pan-europeo para predicción de crecidas, sequías y transporte de nutrientes",
          "Rossby Centre Regional Climate Models: Simulaciones de alta resolución de eventos climáticos nórdicos",
          "Evaluación del impacto del cambio climático en el almacenamiento de agua en turberas y lagos escandinavos"
    ],
    recentNews: [
      {
        title: "Despliegue operacional del sistema Copernicus Climate Change Service para hidrología europea",
        date: "2026-10-05",
        snippet: "Provisión de alertas tempranas de sequía y caudales fluviales a organismos de cuenca de toda Europa."
      }
    ],
    workCulture: [
          "Institución pública sueca ejemplar con horario laboral de 38,5 horas y fuerte cultura de conciliación",
          "Sede moderna en la ciudad fluvial de Norrköping con fácil acceso en tren a Estocolmo",
          "Inglés como idioma de trabajo habitual en las divisiones de I+D hidrológico y climatológico"
    ],
    redFlags: [
          "Inviernos con poca luz solar característicos del sur de Escandinavia"
    ],
    interviewArguments: [
          "Formación geofísica con sólida base en ecuaciones de conservación de masa, balance hidrológico y cuencas.",
          "Experiencia en programación científica y manejo de grandes volúmenes de datos espaciales y climáticos.",
          "Alineación con el modelado hidrológico HYPE y las directivas de cuenca europeas."
    ],
    techStack: ["HYPE Model","Python","Fortran","NetCDF","GIS","Linux HPC"],
    lastResearched: '2026-10-29',
    quadrants: ['NORDICS'],
    sectorCluster: 'RD_PUBLIC'
  },
  {
    id: 'comp-unccd',
    name: "UNCCD - Convención de la ONU para la Lucha contra la Desertificación",
    website: 'https://www.unccd.int/',
    sector: "Órgano Multilateral de la ONU para la Neutralidad de la Degradación de Tierras y Sequías",
    size: "120+ oficiales de políticas, científicos y analistas de tierras",
    headquarters: "Bonn (Campus de la ONU, Alemania)",
    description: "Uno de los tres tratados de la Cumbre de la Tierra de Río (junto con la CMNUCC y el CDB). Su secretaría mundial en el Campus de la ONU en Bonn lidera la iniciativa global de Neutralidad en la Degradación de las Tierras (LDN), resiliencia a la sequía y salud edáfica en 197 países.",
    keyProjects: [
          "Marco Global de Políticas de Neutralidad de Degradación de Tierras (Land Degradation Neutrality - LDN)",
          "Iniciativa Global de Resiliencia ante la Sequía y Observatorio Mundial de Suelos",
          "Mapeo de sinergias entre restauración de turberas, cuencas hídricas y mitigación climática en países en desarrollo"
    ],
    recentNews: [
      {
        title: "Preparación de la COP16 de la UNCCD con foco en la movilización de financiación para restauración de cuencas degradadas",
        date: "2026-09-28",
        snippet: "Llamamiento a expertos científicos para traducir datos biofísicos de suelos a marcos normativos vinculantes."
      }
    ],
    workCulture: [
          "Ecosistema diplomático y técnico de Naciones Unidas en el Campus de la ONU en Bonn (Alemania)",
          "Ambiente multicultural con diplomáticos, científicos y negociadores de los cinco continentes",
          "Condiciones laborales del baremo de Naciones Unidas (salarios exentos de impuestos P2/P3/P4)"
    ],
    redFlags: [
          "Procesos de selección diplomática competitivos regulados por cuotas geográficas internacionales"
    ],
    interviewArguments: [
          "Experiencia real testificando como experto científico ante el Senado y la Cámara de Diputados de Chile en leyes de aguas e incendios.",
          "Especialista en ciencias del suelo, hidrogeofísica y degradación de cuencas formado en Chile y Alemania (CAU Kiel).",
          "Dominio bilingüe inglés-español y capacidad de residencia inmediata en Alemania con visa de post-estudio."
    ],
    techStack: ["Políticas Públicas ONU","GIS","Indicadores LDN","Análisis de Datos Ambientales","Redacción Diplomática"],
    lastResearched: '2026-10-29',
    quadrants: ['DACH','GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-unep-wcmc',
    name: "UNEP-WCMC (World Conservation Monitoring Centre)",
    website: 'https://www.unep-wcmc.org/',
    sector: "Evaluación Global de Biodiversidad, Ecosistemas y Políticas de Carbono Natural",
    size: "180+ especialistas en gobernanza, SIG y políticas ambientales",
    headquarters: "Cambridge (Reino Unido)",
    description: "Centro de colaboración estratégica entre el Programa de las Naciones Unidas para el Medio Ambiente (PNUMA) y WCMC. Ofrece asesoramiento científico y de políticas ambientales de vanguardia para la toma de decisiones sobre biodiversidad, carbono en humedales y capital natural.",
    keyProjects: [
          "Mapeo mundial de reservas irreemplazables de carbono en turberas y ecosistemas de alta integridad",
          "Desarrollo de herramientas de soporte a la decisión para salvaguardias en planes nacionales de transición",
          "Asesoramiento a delegaciones gubernamentales para la implementación del Marco Global de Biodiversidad"
    ],
    recentNews: [
      {
        title: "Publicación del mapa mundial de densidades de carbono en humedales para orientar la financiación climática global",
        date: "2026-10-08",
        snippet: "Identificación de áreas prioritarias donde la degradación provocaría emisiones de carbono masivas e irreversibles."
      }
    ],
    workCulture: [
          "Sinergia única entre el ecosistema académico de la Universidad de Cambridge y el mandato de la ONU",
          "Ambiente intelectualmente estimulante con investigadores y analistas de políticas de primer nivel",
          "Trabajo híbrido con sede en la ciudad universitaria de Cambridge"
    ],
    redFlags: [
          "Requisitos burocráticos de visado en Reino Unido para perfiles extracomunitarios (salvo sponsorship)"
    ],
    interviewArguments: [
          "Geofísico con investigación empírica en flujos de carbono en turberas y humedales de Europa y Chile.",
          "Autor de informes técnicos y publicaciones sobre cuencas hídricas y conservación ecosistémica.",
          "Inglés C2 fluido y capacidad demostrada para sintetizar datos científicos complejos en recomendaciones de política pública."
    ],
    techStack: ["GIS Espacial","Python","Indicadores de Biodiversidad","R","Policy Briefs ONU"],
    lastResearched: '2026-10-29',
    quadrants: ['UK_NL','GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-wri-europe',
    name: "WRI Europe (World Resources Institute)",
    website: 'https://www.wri.org/wri-europe',
    sector: "Think Tank Global de Políticas de Agua, Clima, Suelos y Bosques",
    size: "1.400+ investigadores globales (sede europea: 120+ analistas)",
    headquarters: "La Haya (Países Bajos) / Oficina en Londres",
    description: "Think tank global de investigación de referencia en sostenibilidad. Su oficina europea en La Haya traduce datos biofísicos rigurosos en acciones de política pública para instituciones de la Unión Europea, gobiernos nacionales y corporaciones multinacionales.",
    keyProjects: [
          "Plataforma Aqueduct Water Risk Atlas para evaluación global de estrés hídrico y sequías",
          "Global Forest Watch y Land & Carbon Lab para monitoreo transparente de cadenas de suministro",
          "Iniciativa de Transición Justa y descarbonización del uso de la tierra en la Unión Europea"
    ],
    recentNews: [
      {
        title: "Presentación de recomendaciones técnicas para la Directiva de Monitoreo del Suelo de la Unión Europea",
        date: "2026-09-17",
        snippet: "Propuesta de indicadores de salud edáfica armonizados para todos los Estados miembros de la UE."
      }
    ],
    workCulture: [
          "Organización no gubernamental global de gran prestigio y rigor metodológico \"Science-to-Action\"",
          "Ambiente cosmopolita en La Haya (ciudad de la paz y la justicia internacional)",
          "Equipos multiculturales con inglés como idioma principal de trabajo y políticas de teletrabajo flexibles"
    ],
    redFlags: [
          "Alta exigencia en comunicación escrita ejecutiva y síntesis para líderes políticos"
    ],
    interviewArguments: [
          "Trayectoria demostrada en la interfaz ciencia-política (comparecencia ante comisiones del Congreso Nacional de Chile).",
          "Formación europea en Ciencias del Suelo y Manejo Ambiental en CAU Kiel (Alemania).",
          "Dominio de herramientas de análisis geoespacial y visión integral de los ciclos del agua y del carbono."
    ],
    techStack: ["Python","GIS","Policy Analysis","Earth Engine","Visualización de Datos"],
    lastResearched: '2026-10-29',
    quadrants: ['UK_NL','GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-e3g',
    name: "E3G (Third Generation Environmentalism)",
    website: 'https://www.e3g.org/',
    sector: "Think Tank de Geopolítica Climática, Transición Justa y Diplomacia",
    size: "110+ estrategas de política pública, economistas y científicos",
    headquarters: "Berlín (Alemania) / Oficinas en Bruselas y Londres",
    description: "Think tank europeo independiente líder en diplomacia climática y geopolítica de la transición ecológica. Asesora a cancillerías europeas, ministerios de economía y organismos multilaterales sobre cómo acelerar la descarbonización con salvaguardias sociales.",
    keyProjects: [
          "Observatorio de Diplomacia Climática del G7 y G20 para financiamiento de pérdidas y daños",
          "Estrategias de transición justa en cuencas carboníferas e industriales de Europa central y oriental",
          "Arquitectura de reforma de los bancos multilaterales de desarrollo (Banco Mundial, BEI) para clima"
    ],
    recentNews: [
      {
        title: "Informe sobre la reconfiguración de la diplomacia climática europea ante las tensiones comerciales globales",
        date: "2026-10-01",
        snippet: "Propuesta de mecanismos de ajuste fronterizo de carbono y cooperación tecnológica con América Latina."
      }
    ],
    workCulture: [
          "Think tank de alto impacto político con acceso directo a ministerios en Berlín, Bruselas y Londres",
          "Cultura analítica, rápida y orientada a la influencia estratégica en políticas públicas en tiempo real",
          "Oficinas en el centro de Berlín (Friedrichstraße) con excelentes conexiones europeas"
    ],
    redFlags: [
          "Ritmo intenso condicionado por la agenda política y los calendarios legislativos comunitarios"
    ],
    interviewArguments: [
          "Conocimiento del marco político e institucional tanto europeo (Kiel/Poznań) como latinoamericano (Chile/cuencas).",
          "Experiencia en asesoramiento técnico parlamentario y comunicación pública estratégica.",
          "Capacidad de interlocución técnica en alemán, inglés y español."
    ],
    techStack: ["Policy Briefs","Análisis Geopolítico","Economía Climática","Modelado de Escenarios"],
    lastResearched: '2026-10-29',
    quadrants: ['DACH','UK_NL','GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-iddri',
    name: "IDDRI - Institut du Développement Durable et des Relations Internationales",
    website: 'https://www.iddri.org/',
    sector: "Instituto de Investigación y Diálogo de Políticas Internacionales sobre Clima y Biodiversidad",
    size: "60+ investigadores de políticas públicas y gobernanza",
    headquarters: "París (Francia) / Enlaces con Bruselas",
    description: "Instituto independiente de investigación de políticas públicas con sede en Sciences Po París. Clave en la gestación del Acuerdo de París, analiza los mecanismos multilaterales de descarbonización, gobernanza de los océanos y salvaguardias en el uso de la tierra.",
    keyProjects: [
          "Mecanismos de ambición y balance global (Global Stocktake) en el marco de la CMNUCC",
          "Transición agroecológica y política alimentaria en la Unión Europea",
          "Diálogo de políticas UE-América Latina en conservación de bosques y minerales críticos para la transición"
    ],
    recentNews: [
      {
        title: "Publicación de análisis sobre la integración de salvaguardias ambientales en acuerdos de comercio de materias primas",
        date: "2026-09-12",
        snippet: "Recomendaciones para armonizar estándares de huella ambiental entre la Unión Europea y el Cono Sur."
      }
    ],
    workCulture: [
          "Ambiente intelectual de ciencias políticas y economía ecológica en París",
          "Fuerte proyección internacional con misiones en cumbres de la ONU y foros de la OCDE",
          "Enfoque de deliberación rigurosa y publicación en revistas de políticas públicas"
    ],
    redFlags: [
          "El francés suele ser idioma de trabajo interno predominante junto con el inglés"
    ],
    interviewArguments: [
          "Perspectiva dual América Latina - Europa con formación científica de base en geofísica y gestión ambiental.",
          "Experiencia contrastada en comisiones legislativas y elaboración de informes para tomadores de decisiones.",
          "Perfil idóneo para proyectos de gobernanza hídrica, cuencas y mitigación climática internacional."
    ],
    techStack: ["Policy Design","Gobernanza Ambiental","Análisis Multilateral","Redacción Estratégica"],
    lastResearched: '2026-10-29',
    quadrants: ['GLOBAL'],
    sectorCluster: 'MULTILATERAL_POLICY'
  },
  {
    id: 'comp-telur',
    name: "Telur Geotermia y Agua S.A.",
    website: 'https://www.telur.es/',
    sector: "Consultoría Especializada en Geotermia, Hidrogeología y Geofísica del Subsuelo",
    size: "30-50 hidrogeólogos, geofísicos y perforadores técnicos",
    headquarters: "Elorrio / Bilbao (Bizkaia, Euskadi)",
    description: "Empresa consultora pionera y referente absoluto en Euskadi y el norte de España en el diseño, prospección geofísica, simulación térmica y ejecución de instalaciones geotérmicas de baja y media entalpía para climatización urbana e industrial.",
    keyProjects: [
          "Prospección hidrogeofísica y sondeos geotérmicos en el País Vasco y norte de España",
          "Modelos de respuesta térmica del terreno (TRT) y simulación por elementos finitos de campos de captación",
          "Aprovechamiento hidrogeotérmico en minas inundadas y acuíferos profundos de Bizkaia y Gipuzkoa"
    ],
    recentNews: [
      {
        title: "Desarrollo de proyectos de redes de calor geotérmico para distritos urbanos en consorcio con el EVE (Ente Vasco de la Energía)",
        date: "2026-10-09",
        snippet: "Ejecución de sondeos profundos y ensayos de respuesta térmica con monitorización geofísica continua."
      }
    ],
    workCulture: [
          "Empresa arraigada en Bizkaia con un ambiente cercano, técnico y de alta solvencia en ingeniería del subsuelo",
          "Combinación directa de trabajo de gabinete con instrumentación y supervisión en terreno",
          "Excelente integración en el clúster energético y ambiental vasco (Aclima / Clúster de Energía)"
    ],
    redFlags: [
          "Estructura de tamaño mediano que requiere autonomía técnica polivalente"
    ],
    interviewArguments: [
          "Geofísico de la Universidad de Chile con base rigurosa en métodos potenciales, resistividad eléctrica y termodinámica.",
          "Residencia en Bilbao con total disponibilidad y alineación con la vía de regularización vasca.",
          "Capacidad para realizar ensayos de respuesta térmica, modelado hidrogeológico y supervisión de sondeos."
    ],
    techStack: ["TRT (Thermal Response Test)","EED (Earth Energy Designer)","Hydrogeophysics","FEFLOW","GIS"],
    lastResearched: '2026-10-29',
    quadrants: ['EUSKADI'],
    sectorCluster: 'GEOTHERMAL_ENERGY'
  },
  {
    id: 'comp-dmt',
    name: "DMT GmbH & Co. KG",
    website: 'https://www.dmt-group.com/',
    sector: "Servicios Geofísicos Globales, Sismología de Exploración y Reservorios Geotérmicos",
    size: "1.100+ geofísicos, geólogos e ingenieros de minas y subsuelo",
    headquarters: "Essen (Renania del Norte-Westfalia, Alemania)",
    description: "Grupo global de servicios de ingeniería y geofísica perteneciente al TÜV NORD GROUP. Líder europeo en campañas sísmicas 2D/3D, caracterización geofísica de reservorios geotérmicos profundos, gravimetría, magnetotelúrica y monitoreo micro-sísmico inducido.",
    keyProjects: [
          "Campañas de sísmica de reflexión urbana para exploración de proyectos de geotermia profunda en Alemania",
          "Monitoreo micro-sísmico en tiempo real de operaciones de inyección hidráulica y geotermia en Europa",
          "Caracterización estructural del subsuelo para almacenamiento geológico de energía y CO2"
    ],
    recentNews: [
      {
        title: "Finalización de la mayor campaña sísmica 3D de exploración geotérmica urbana en el área metropolitana de Múnich",
        date: "2026-08-30",
        snippet: "Mapeo de fallas profundas en la formación Malm con resolución milimétrica para evitar sismicidad inducida."
      }
    ],
    workCulture: [
          "Tradición técnica alemana de ingeniería del subsuelo con sede en el histórico polo minero y energético de Essen",
          "Cultura corporativa sólida con estándares de seguridad industrial alemanes (TÜV NORD)",
          "Equipos de campo e interpretación geofísica que trabajan en proyectos de toda Europa y América"
    ],
    redFlags: [
          "Campañas de campo que pueden requerir desplazamientos temporales para supervisión de adquisiciones sísmicas"
    ],
    interviewArguments: [
          "Título universitario superior de Geofísico (Universidad de Chile, 5 años) con base en sismología y prospección geofísica.",
          "Doble maestría en Alemania (CAU Kiel) con conocimiento de normativas y cultura técnica alemana.",
          "Bilingüe español-inglés con capacidad operativa en alemán B1-B2 para proyectos del grupo en el DACH."
    ],
    techStack: ["Seismic Processing (ProMAX/Omega)","Python","Gravity/Magnetics","SeisSpace","GIS","Microseismic Monitoring"],
    lastResearched: '2026-10-29',
    quadrants: ['DACH','GLOBAL'],
    sectorCluster: 'GEOTHERMAL_ENERGY'
  },
  {
    id: 'comp-eavor',
    name: "Eavor Technologies Inc.",
    website: 'https://eavor.com/',
    sector: "Geotermia Profunda de Circuito Cerrado (Advanced Geothermal Systems - Eavor-Loop™)",
    size: "140+ geofísicos de reservorios, ingenieros de perforación y modeladores térmicos",
    headquarters: "Calgary (Alberta, Canadá) / Subsidiaria europea en Düsseldorf (Alemania)",
    description: "Scale-up canadiense pionera mundial en sistemas geotérmicos avanzados (AGS). Su tecnología patentada Eavor-Loop™ crea un radiador subterráneo de circuito cerrado de varios kilómetros de profundidad que extrae calor por conducción pura sin necesidad de fracturación ni agua del subsuelo.",
    keyProjects: [
          "Proyecto Eavor-Loop™ Geretsried (Baviera, Alemania): El mayor proyecto de geotermia profunda de circuito cerrado del mundo",
          "Modelación termohidráulica de transporte de calor en formaciones cristalinas y sedimentarias profundas",
          "Expansión de proyectos de calefacción urbana limpia en Alemania, Austria y Norteamérica"
    ],
    recentNews: [
      {
        title: "Completado con éxito el primer circuito lateral profundo a más de 4.500 metros en su planta de Geretsried en Baviera",
        date: "2026-09-15",
        snippet: "Inyección de fondos de innovación de la Unión Europea para acelerar el despliegue del sistema Eavor-Loop."
      }
    ],
    workCulture: [
          "Cultura innovadora canadiense de Calgary que combina la destreza de perforación del petróleo con la transición limpia",
          "Operaciones activas en Alemania (Düsseldorf y Baviera) con ambiente de trabajo anglófono y germano",
          "Acceso a visados de trabajo Canadá-Chile (IEC) y permisos de investigación europeos"
    ],
    redFlags: [
          "Alto nivel de escrutinio técnico e inversión de capital intensivo en sus primeros proyectos comerciales"
    ],
    interviewArguments: [
          "Geofísico cuantitativo chileno con acceso al tratado bilateral IEC Canadá-Chile (hasta 35 años).",
          "Formación europea en Alemania (CAU Kiel) y comprensión directa del contexto energético y geológico bávaro.",
          "Conocimiento de modelado geofísico de transferencia térmica y física de medios porosos."
    ],
    techStack: ["Thermal Modeling","Python","Reservoir Simulation","Well Logging","Subsurface Mapping"],
    lastResearched: '2026-10-29',
    quadrants: ['CANADA_GLOBAL','DACH'],
    sectorCluster: 'GEOTHERMAL_ENERGY'
  },
  {
    id: 'comp-storengy',
    name: "Storengy (Grupo ENGIE)",
    website: 'https://www.storengy.de/',
    sector: "Almacenamiento Térmico Subterráneo (ATES) y Geotermia Profunda para Calefacción",
    size: "900+ especialistas en subsuelo y transición térmica",
    headquarters: "Berlín (Alemania) / Oficinas en París",
    description: "Filial del gigante energético ENGIE especializada en el desarrollo del subsuelo: almacenamiento subterráneo de energía térmica (Aquifer Thermal Energy Storage - ATES), geotermia hidrotermal y almacenamiento geológico de hidrógeno en Alemania y Francia.",
    keyProjects: [
          "Desarrollo de proyectos de geotermia profunda para inyección en redes de calefacción urbana de Berlín y Brandeburgo",
          "Sistemas ATES para almacenamiento estacional de calor y frío en acuíferos someros y medios",
          "Estudios geológicos y geofísicos de viabilidad de cavernas salinas para almacenamiento de gases renovables"
    ],
    recentNews: [
      {
        title: "Inicio de la perforación de pozos de exploración geotérmica en la cuenca de Berlín para descarbonización urbana",
        date: "2026-10-18",
        snippet: "Acuerdo con el Senado de Berlín para suministrar energía térmica renovable a más de 20.000 hogares."
      }
    ],
    workCulture: [
          "Gran corporación energética europea con sólidos convenios colectivos y estabilidad laboral en Alemania",
          "Oficinas en Berlín y proyectos en todo el territorio alemán con fuerte compromiso de descarbonización",
          "Excelente integración entre geólogos de exploración, ingenieros de reservorios y analistas regulatorios"
    ],
    redFlags: [
          "Procesos de toma de decisiones corporativos que requieren aprobaciones multicapa"
    ],
    interviewArguments: [
          "Geofísico con sólida formación en termodinámica del subsuelo, hidrogeología y caracterización física.",
          "Máster europeo en Gestión Ambiental (CAU Kiel) con conocimiento de la transición térmica alemana (Wärmewende).",
          "Competencia en análisis de datos espaciales y modelación de transporte de calor en acuíferos."
    ],
    techStack: ["Python","Subsurface Modeling","GIS","Hydrogeology Software","Eclipse/Petrel"],
    lastResearched: '2026-10-29',
    quadrants: ['DACH','GLOBAL'],
    sectorCluster: 'GEOTHERMAL_ENERGY'
  },
  {
    id: 'comp-deep-earth',
    name: "DEEP Earth Energy Production",
    website: 'https://deepcorp.ca/',
    sector: "Desarrollo de Energía Geotérmica Profunda en Cuencas Sedimentarias",
    size: "35+ ingenieros de yacimientos, geólogos y geofísicos",
    headquarters: "Calgary / Saskatoon (Saskatchewan, Canadá)",
    description: "Empresa canadiense pionera en el desarrollo de la primera instalación de energía geotérmica a escala comercial de Canadá, aprovechando los acuíferos de salmuera caliente de la cuenca sedimentaria de Williston a más de 3.000 metros de profundidad.",
    keyProjects: [
          "Proyecto Geotérmico Williston Basin: Perforación de pozos horizontales profundos para producción de 25 MW de potencia base limpia",
          "Modelado de dinámica de fluidos y respuesta de permeabilidad en acuíferos sedimentarios profundos",
          "Aprovechamiento del calor residual para complejos agrícolas de invernaderos de alta eficiencia"
    ],
    recentNews: [
      {
        title: "Completado con éxito el primer tramo de pozos horizontales geotérmicos en Saskatchewan con temperaturas de fondo superiores a 120°C",
        date: "2026-07-19",
        snippet: "Validación del flujo continuo de salmuera para generación de electricidad de carga base continua."
      }
    ],
    workCulture: [
          "Pioneros de la transición geotérmica canadiense en las provincias de las praderas (Alberta y Saskatchewan)",
          "Equipo compacto y altamente especializado donde cada geocientífico tiene un impacto directo y visible",
          "Cultura de innovación técnica, flexibilidad laboral y espíritu emprendedor de los recursos del subsuelo"
    ],
    redFlags: [
          "Foco geográfico centrado en el oeste de Canadá"
    ],
    interviewArguments: [
          "Geofísico chileno elegible para el programa de movilidad juvenil Working Holiday / Young Professionals de Canadá (IEC).",
          "Formación analítica rigurosa en estratigrafía, métodos potenciales e hidrogeología profunda.",
          "Interés probado en descarbonización de carga base mediante energía geotérmica de ciclo binario."
    ],
    techStack: ["Geothermal Reservoir Modeling","Well Logs","Python","Petrel","GIS"],
    lastResearched: '2026-10-29',
    quadrants: ['CANADA_GLOBAL'],
    sectorCluster: 'GEOTHERMAL_ENERGY'
  },
  {
    id: 'comp-fervo',
    name: "Fervo Energy",
    website: 'https://fervoenergy.com/',
    sector: "Geotermia Avanzada de Próxima Generación (EGS) y Monitoreo Sísmico de Yacimientos",
    size: "100+ ingenieros de subsuelo, sismólogos y geocientíficos",
    headquarters: "Houston (Texas, EE.UU.) / Proyectos en Nevada y Utah",
    description: "La empresa líder mundial en sistemas geotérmicos mejorados de nueva generación (Next-Gen EGS). Aplica técnicas de perforación horizontal multietapa y estimulación de yacimientos del sector energético para desbloquear calor geotérmico continuo en formaciones de roca impermeable.",
    keyProjects: [
          "Proyecto Cape Station (Utah): Desarrollo de una planta geotérmica de 400 MW de potencia base limpia",
          "Monitoreo micro-sísmico en tiempo real con sensores de fibra óptica y geófonos distribuidos",
          "Alianza con empresas tecnológicas globales (Google) para alimentar centros de datos con energía geotérmica 24/7"
    ],
    recentNews: [
      {
        title: "Firma de contratos históricos de compra de energía limpia (PPA) con utilities y empresas de tecnología en EE.UU.",
        date: "2026-09-10",
        snippet: "Demostración de una reducción del 70% en los tiempos de perforación geotérmica profunda."
      }
    ],
    workCulture: [
          "Líder indiscutible de la nueva ola de climate-tech geotérmica con respaldo de los principales fondos mundiales (Breakthrough Energy)",
          "Fuerte cultura científica, computacional y de modelado cuantitativo de fracturas y sismicidad inducida",
          "Ritmo ágil y posibilidades de colaboración remota en análisis geofísico y de datos de reservorio"
    ],
    redFlags: [
          "Exigencia técnica de élite y competencia con las mejores empresas de NewSpace y energía limpia"
    ],
    interviewArguments: [
          "Geofísico con rigurosa base físico-matemática en mecánica de medios continuos, sismología y métodos potenciales.",
          "Capacidad para procesar datos sísmicos continuos, correlación de eventos y monitoreo de micro-sismicidad inducida.",
          "Perfil ideal para los equipos de caracterización de reservorios y analítica de datos geofísicos."
    ],
    techStack: ["Distributed Acoustic Sensing (DAS)","Microseismic Monitoring","Python","Reservoir Geomechanics","Cloud HPC"],
    lastResearched: '2026-10-29',
    quadrants: ['GLOBAL'],
    sectorCluster: 'GEOTHERMAL_ENERGY'
  },
  {
    id: 'comp-climate-kic',
    name: 'EIT Climate-KIC',
    website: 'https://www.climate-kic.org/',
    sector: 'Agencia de Innovación Climática de la UE, Transición Sistémica & Soluciones Basadas en la Naturaleza',
    size: '250+ especialistas (Red paneuropea de 400+ socios)',
    headquarters: 'Ámsterdam, Países Bajos (Hubs en Berlín, Bruselas, Londres y Valencia/Madrid)',
    description: 'La mayor iniciativa de innovación climática y colaboración público-privada de la Unión Europea, respaldada por el Instituto Europeo de Innovación y Tecnología (EIT). Lidera transformaciones sistémicas en ciudades neutras en carbono, uso sostenible del suelo, restauración ecológica basada en la naturaleza (NbS) y descarbonización industrial, facilitando la colaboración entre el mundo académico, gobiernos y startups.',
    keyProjects: [
      'NetZeroCities (Misión de la UE para 112 Ciudades Inteligentes y Climáticamente Neutras en 2030)',
      'Deep Demonstrations: Demostraciones a escala de paisaje de transición agroforestal, regeneración de suelos y humedales',
      'Plataformas de aceleración e innovación climática de la Comisión Europea bajo Horizon Europe',
      'Desarrollo de metodologías de evaluación de impacto sistémico, finanzas sostenibles y monitoreo MRV de carbono'
    ],
    recentNews: [
      {
        title: 'EIT Climate-KIC expande programas de demostración sistémica y soluciones basadas en la naturaleza',
        date: '2026-10-15',
        snippet: 'Consolidación de alianzas estratégicas con ciudades y regiones europeas para acelerar la resiliencia climática y la neutralidad de emisiones.',
        url: 'https://www.climate-kic.org/news/'
      }
    ],
    workCulture: [
      'Ambiente paneuropeo multidisciplinar con mentalidad de misión y pensamiento sistémico (Systems Thinking)',
      'Organización distribuida con gran flexibilidad de trabajo híbrido y sedes en los principales nodos de innovación europeos',
      'Impacto tangible en la formulación e implementación de políticas del Pacto Verde Europeo (European Green Deal)'
    ],
    redFlags: [
      'Proyectos estructurados en torno a marcos de subvención europeos y consorcios con múltiples contrapartes'
    ],
    interviewArguments: [
      'Máster europeo en Gestión y Protección Ambiental completado en Alemania (CAU Kiel) con conocimiento operativo de los marcos y directivas climáticas de la UE.',
      'Sólida base biofísica cuantitativa en ciencias de la Tierra, suelos, turberas y balance de gases de efecto invernadero (Eddy Covariance y modelado espacial).',
      'Experiencia demostrada en gobernanza ambiental, diálogo con comunidades y presentación ante órganos legislativos e internacionales (comisión legislativa, foros globales).',
      'Alineamiento directo con el enfoque de Soluciones Basadas en la Naturaleza (NbS) y diseño de paisajes regenerativos.'
    ],
    techStack: [
      'Systems Innovation',
      'Horizon Europe',
      'Nature-based Solutions (NbS)',
      'Carbon MRV',
      'GIS / Remote Sensing',
      'Stakeholder Management'
    ],
    lastResearched: '2026-10-29',
    quadrants: ['UK_NL', 'DACH', 'EUSKADI', 'GLOBAL'],
    sectorCluster: 'CARBON_TECH_MRV',
    fundingTies: ['f-climate-kic-awards', 'f-horizon-cluster6']
  },
  {
    id: 'comp-eit-food',
    name: 'EIT Food (South Hub - Bilbao / Zamudio)',
    website: 'https://www.eitfood.eu/',
    sector: 'Innovación Agroalimentaria, Salud del Suelo & Transición Regenerativa de la UE',
    size: '200+ especialistas (Red europea de 250+ universidades y corporaciones)',
    headquarters: 'Parque Tecnológico de Bizkaia (Zamudio, Bilbao) / Sede Europea en Lovaina (Bélgica)',
    description: 'Sede para el Sur de Europa de la comunidad de innovación agroalimentaria del Instituto Europeo de Innovación y Tecnología (EIT), ubicada en el Parque Tecnológico de Bizkaia (Zamudio, Bilbao). Lidera programas europeos de descarbonización agraria, regeneración de suelos edáficos, bioeconomía circular, retención hídrica y aceleración de startups agrotech en España, Italia, Portugal y Grecia bajo Horizon Europe.',
    keyProjects: [
      'Regenerative Agriculture Revolution: Formación y transición de agricultores hacia prácticas de salud de suelo y retención de carbono edáfico',
      'Misión de la UE "A Soil Deal for Europe": Desarrollo de living labs y faros de monitoreo de calidad del suelo en cuencas del sur de Europa',
      'EIT Food Accelerator Network (FAN) Bilbao Hub: Aceleración de startups agrotech, biotecnología del suelo y teledetección de cultivos',
      'Plataformas de métricas de sostenibilidad y reducción de huella de carbono y agua en cadenas de valor agroalimentarias'
    ],
    recentNews: [
      {
        title: 'EIT Food Bilbao expande sus programas de agricultura regenerativa y monitorización de suelos en Euskadi',
        date: '2026-10-18',
        snippet: 'Nuevos consorcios colaborativos con centros tecnológicos y universidades para validar métricas de carbono en suelos del País Vasco y Sur de Europa.',
        url: 'https://www.eitfood.eu/news'
      }
    ],
    workCulture: [
      'Entorno multicultural y paneuropeo enfocado en impacto de campo, bioeconomía y transferencia tecnológica',
      'Fuerte sinergia con el ecosistema de I+D vasco (Parque Tecnológico de Zamudio, Neiker, AZTI, Tecnalia, UPV/EHU)',
      'Flexibilidad de trabajo híbrido con participación en consorcios internacionales de la Comisión Europea (Horizon Europe)'
    ],
    redFlags: [
      'Exigencia rigurosa de justificación técnica y financiera vinculada a los hitos y auditorías de la Comisión Europea'
    ],
    interviewArguments: [
      'Doble maestría europea en Gestión y Protección Ambiental completada en Alemania (CAU Kiel) con conocimiento operativo de los marcos y directivas de la UE.',
      'Sólida formación científica en ciencias de la Tierra, física del suelo, retención hídrica en medios porosos y balances de carbono orgánico edáfico.',
      'Radicación directa en Bilbao y conocimiento del tejido científico y tecnológico vasco (RVCTI, Neiker, AZTI, Tecnalia).',
      'Capacidad probada de comunicación y articulación multiactor ante autoridades públicas, comisiones parlamentarias e instituciones internacionales.'
    ],
    techStack: [
      'Carbon Farming',
      'Soil Health Frameworks',
      'Horizon Europe (Cluster 6)',
      'Living Labs',
      'GIS / Remote Sensing',
      'Stakeholder Orchestration'
    ],
    lastResearched: '2026-10-29',
    quadrants: ['EUSKADI', 'UK_NL', 'GLOBAL'],
    sectorCluster: 'CARBON_TECH_MRV',
    fundingTies: ['f-hazitek-elkartek', 'f-horizon-cluster6']
  }
];

const thuenenRaw: Partial<JobOffer> = {
  id: 'job-thuenen-techworms-369',
  title: 'Wissenschaftliche*r Mitarbeiter*in / Doktorand*in Agrar-/Bodenwissenschaften (w/m/d)',
  company: 'Johann Heinrich von Thünen-Institut',
  companyId: 'comp-thuenen',
  location: 'Braunschweig, Niedersachsen, Alemania',
  country: 'Alemania',
  isBilbaoLocation: false,
  isRemote: false,
  url: 'https://www.karriere-thuenen.de/index.php?ac=jobad&id=369&language=2',
  sourceId: 'src-thuenen',
  sourceName: 'Thünen-Institut Karriereportal',
  publishedDate: '2026-10-01',
  deadline: '2026-10-22',
  salaryMin: 43742,
  salaryMax: 62705,
  salaryCurrency: 'EUR',
  rawDescription: 'Das Institut für Agrarklimaschutz des Johann Heinrich von Thünen-Instituts am Standort Braunschweig sucht zum 01.12.2026 befristet bis zum 31.10.2030 eine*n wissenschaftliche*n Mitarbeiter*in / Doktorand*in im Bereich Agrar- oder Bodenwissenschaften (w/m/d) in Teilzeit mit 70 v. H. (27,3 h/Woche) zur Mitarbeit im Verbundprojekt "TechWorms". Das Projekt erforscht die Kohlenstoffsequestrierung im Unterboden durch künstliche vertikale Makroporen (Regenwurmtechnik), um Bodenkohlenstoff in tiefere Horizonte zu transportieren und landwirtschaftliche Erträge sowie Klimaschutz zu optimieren. Vergütung nach TVöD Bund E 13.',
  requirements: [
    'Estudios universitarios superiores (M.Sc. o Diplom) en Agronomía, Ciencias del Suelo (Bodenkunde), Geoecología o afines',
    'Conocimientos sólidos y fundamentados en edafología y física/química del suelo',
    'Conocimientos en interacción suelo-planta y dinámica radicular',
    'Experiencia práctica en evaluación y análisis estadístico de datos en R',
    'Experiencia en redacción científica y elaboración de reportes de proyectos',
    'Disponibilidad para trabajo de campo independiente de la meteorología y viajes de muestreo',
    'Excelente nivel de inglés y alemán (hablado y escrito)'
  ],
  responsibilities: [
    'Montaje e instrumentación de ensayos de campo con la tecnología Tech-Worm',
    'Mediciones de penetración radicular con RootBox y evaluación de rendimientos agrícolas',
    'Análisis isotópicos en biomasa y raíces para evaluar la absorción hídrica y de nutrientes',
    'Evaluación y modelado estadístico de series de datos en R',
    'Redacción de publicaciones científicas y tesis doctoral en cooperación con universidades (TU Braunschweig)',
    'Divulgación científica y comunicación con stakeholders agrícolas y del sector público'
  ],
  status: 'Nueva',
  isFavorite: true,
  extractedAt: '2026-10-21 03:00',
  isVerified: true,
  verificationStatus: 'Vigente y Verificada',
  verifiedAt: '2026-10-21 03:00',
  verificationReason: 'Convocatoria oficial activa del Instituto Thünen con plazo de recepción hasta el 22.10.2026.',
  companyEnrichment: {
    sector: 'Investigación Federal en Suelos, Clima, Bosques y Agricultura (BMEL)',
    description: 'Bundesforschungsinstitut für Ländliche Räume, Wald und Fischerei.',
    hqLocation: 'Braunschweig, Niedersachsen, Alemania',
    websiteUrl: 'https://www.thuenen.de/',
    strategicProjects: ['TechWorms', 'BZE-LW Bodenzustandserhebung', 'MoorNetz']
  },
  personalFitDetails: {
    matchingSkills: ['R', 'Sistemas Biofísicos & Suelos', 'Gobernanza Ambiental', 'Python'],
    skillGaps: [],
    fitSummary: 'Encaje sobresaliente con el perfil de máster en CAU Kiel, experiencia en dinámica de suelos, carbono y análisis estadístico en R.'
  },
  leadProfile: THUENEN_TECHWORMS_DOSSIER.leadProfile,
  jobDossier: THUENEN_TECHWORMS_DOSSIER
};

const ubaRaw: Partial<JobOffer> = {
  id: 'job-uba-ki-product-owner-1499096',
  title: 'Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (KI-Lab)',
  company: 'Umweltbundesamt (UBA)',
  companyId: 'comp-uba',
  location: 'Leipzig, Berlin oder Dessau-Roßlau, Alemania',
  country: 'Alemania',
  isBilbaoLocation: false,
  isRemote: true,
  url: 'https://interamt.de/koop/app/stelle?0&id=1499096',
  sourceId: 'src-interamt',
  sourceName: 'Interamt (Öffentlicher Dienst)',
  publishedDate: '2026-10-05',
  deadline: '2026-10-28',
  salaryMin: 62489,
  salaryMax: 89579,
  salaryCurrency: 'EUR',
  rawDescription: 'Das Umweltbundesamt (UBA) sucht für sein Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) mit bis zu 30 Mitarbeitenden an den Standorten Leipzig, Berlin oder Dessau-Roßlau eine*n Spezialistin*Spezialisten im Bereich KI-Projektmanagement und KI Product Owner (w/m/d). Es handelt sich um eine Mutterschutzvertretung mit 100% der regelmäßigen Arbeitszeit (39 h/Woche) vom 13.12.2026 bis 31.03.2027 mit angestrebter Verlängerung während der Elternzeit. Vergütung nach TVöD Bund E 13.',
  requirements: [
    'Título universitario superior (Máster o Diplom) preferentemente en área MINT (informática, ingeniería ambiental, diseño técnico, economía o gestión)',
    'Conocimientos profundos y experiencia contrastada en gestión híbrida y ágil de proyectos (Scrum, Product Ownership)',
    'Conocimientos metodológicos de procesos de desarrollo de software y aplicaciones de IA',
    'Manejo solvente de herramientas de gestión de proyectos (MS Project, OpenProject, tableros Kanban)',
    'Alta capacidad de comunicación, trabajo en equipo y resolución creativa de problemas',
    'Sensibilidad de género y competencias relacionales en la administración pública',
    'Excelente nivel de inglés y alemán (hablado y escrito)'
  ],
  responsibilities: [
    'Product Ownership en proyectos de desarrollo de soluciones de Inteligencia Artificial para el Verwaltungsvollzug ambiental',
    'Levantamiento de necesidades, conceptualización funcional y elaboración de business cases',
    'Dirección y coordinación de proyectos ágiles/híbridos en el KI-Lab del UBA',
    'Planificación, seguimiento y control de presupuestos y recursos del portfolio de IA',
    'Asesoramiento y formación a coordinadores de proyectos en gestión ágil y contingencias',
    'Interlocución con usuarios finales, personal científico y equipos de diseño UX/UI'
  ],
  status: 'Nueva',
  isFavorite: true,
  extractedAt: '2026-10-21 03:00',
  isVerified: true,
  verificationStatus: 'Vigente y Verificada',
  verifiedAt: '2026-10-21 03:00',
  verificationReason: 'Convocatoria oficial activa del Umweltbundesamt en Interamt con plazo hasta el 28.10.2026.',
  companyEnrichment: {
    sector: 'Agencia Federal de Medio Ambiente de Alemania (BMUV)',
    description: 'La máxima autoridad técnica y científica de Alemania para la protección del medio ambiente.',
    hqLocation: 'Dessau-Roßlau / Leipzig / Berlín',
    websiteUrl: 'https://www.umweltbundesamt.de/',
    strategicProjects: ['KI-Lab Umweltbundesamt', 'Umweltpolitische Digitalagenda', 'Smart Environmental Analytics']
  },
  personalFitDetails: {
    matchingSkills: ['Product Owner', 'Scrum / Agile', 'Digital Twins (AgriTwin, Wetland Monitor, Rewilding Suite)', 'Python', 'GIS', 'Gobernanza Ambiental'],
    skillGaps: [],
    fitSummary: 'Encaje sobresaliente: Product Ownership probado en 3 soluciones de software ambiental (Wetland Monitor, AgriTwin, Rewilding Field Suite), base MINT cuantitativa y doble máster europeo.'
  },
  leadProfile: UBA_KILAB_DOSSIER.leadProfile,
  jobDossier: UBA_KILAB_DOSSIER
};

export const initialOffers: JobOffer[] = [
  {
    ...thuenenRaw,
    matchScore: calculateMatchScore(thuenenRaw, initialProfile)
  } as JobOffer,
  {
    ...ubaRaw,
    matchScore: calculateMatchScore(ubaRaw, initialProfile)
  } as JobOffer
];

export const initialApplications: ApplicationItem[] = [];

export const initialCVs: CVVersion[] = [
  {
    id: 'cv-daniel-santander-es',
    name: 'CV Daniel Santander — Científico & Gobernanza Ambiental (ES)',
    templateId: 'academic_ngo',
    language: 'es',
    createdAt: '2026-10-14',
    updatedAt: '2026-10-14',
    selectedExperiences: ['exp-cau-kiel', 'exp-advocacy-policy', 'exp-biomass-epn'],
    selectedEducation: ['edu-msc-kiel-amu', 'edu-geophysics-uchile', 'edu-permaculture-epac'],
    selectedSkills: ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6', 'sk-7', 'sk-8', 'sk-9', 'sk-10'],
    selectedAchievements: ['ach-1', 'ach-2', 'ach-3', 'ach-4'],
    customSummary: initialProfile.summary,
    compiledData: {
      fullName: initialProfile.fullName,
      contactInfo: {
        email: initialProfile.email,
        phone: initialProfile.phone,
        location: `${initialProfile.preferredCity}, España`,
        linkedin: initialProfile.linkedin,
        github: initialProfile.github
      },
      summary: initialProfile.summary,
      experiences: initialProfile.experiences,
      education: initialProfile.education,
      skills: initialProfile.skills,
      languages: initialProfile.languages,
      achievements: initialProfile.achievementsBank,
      otherCourses: initialProfile.otherCourses
    }
  },
  {
    id: 'cv-daniel-santander-en',
    name: 'CV Daniel Santander — Biophysical Systems & Environmental Science (EN)',
    templateId: 'en_tech',
    language: 'en',
    createdAt: '2026-10-14',
    updatedAt: '2026-10-14',
    selectedExperiences: ['exp-cau-kiel', 'exp-advocacy-policy', 'exp-biomass-epn'],
    selectedEducation: ['edu-msc-kiel-amu', 'edu-geophysics-uchile', 'edu-permaculture-epac'],
    selectedSkills: ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6', 'sk-7', 'sk-8', 'sk-9', 'sk-10'],
    selectedAchievements: ['ach-1', 'ach-2', 'ach-3', 'ach-4'],
    customSummary: 'Interdisciplinary Environmental Scientist with a foundational background in Geophysics (FCFM, University of Chile) and a European Double M.Sc. in Environmental Management & Environmental Protection (CAU Kiel, Germany / AMU Poznań, Poland). Specialized in biophysical quantification, greenhouse gas flux dynamics (eddy covariance towers in peatlands), hydrological watershed balance, spatial data modeling (R, Python, QGIS, GEE), and multi-stakeholder environmental policy governance.',
    compiledData: {
      fullName: initialProfile.fullName,
      contactInfo: {
        email: initialProfile.email,
        phone: initialProfile.phone,
        location: 'Bilbao, Spain / EU Remote',
        linkedin: initialProfile.linkedin,
        github: initialProfile.github
      },
      summary: 'Interdisciplinary Environmental Scientist with a foundational background in Geophysics (FCFM, University of Chile) and a European Double M.Sc. in Environmental Management & Environmental Protection (CAU Kiel, Germany / AMU Poznań, Poland). Specialized in biophysical quantification, greenhouse gas flux dynamics (eddy covariance towers in peatlands), hydrological watershed balance, spatial data modeling (R, Python, QGIS, GEE), and multi-stakeholder environmental policy governance.',
      experiences: [
        {
          id: 'exp-cau-kiel',
          company: 'Christian-Albrechts-Universität zu Kiel & Adam Mickiewicz University',
          role: 'Researcher in Biophysical Systems & Peatland GHG Flux Dynamics',
          location: 'Kiel (Germany) / Poznań (Poland)',
          startDate: '2023',
          endDate: 'Present',
          isCurrent: true,
          summary: 'Empirical quantification of greenhouse gas fluxes (CO2/CH4) in rewetted peatlands using micrometeorological eddy covariance towers and static chambers. Soil and vegetation sampling, statistical and geospatial modeling (R, GIS).',
          achievements: [
            'Continuous monitoring and analysis of carbon balance and methane dynamics in ecological transition wetlands.',
            'Integration of high-frequency micrometeorological measurements with satellite remote sensing data.'
          ],
          technologies: ['R', 'Python', 'QGIS', 'ArcGIS', 'Google Earth Engine', 'Eddy Covariance'],
          isVerified: true
        },
        {
          id: 'exp-advocacy-policy',
          company: 'Environmental Policy Advisory & Legislative Advocacy',
          role: 'Technical Advisor on Environmental Policies and Watershed Management',
          location: 'Chile & Germany',
          startDate: '2021',
          endDate: 'Present',
          isCurrent: true,
          summary: 'Parliamentary and community technical advisory on wildfire prevention policy, integrated watershed management, and agroecological transition. Official testimony before the Emergency, Disasters and Firefighter Commission of the Chilean Chamber of Deputies on the structural link between forest monocultures and wildfire risk.',
          achievements: [
            'Official testimony and presentation at the National Congress of Chile on territorial planning and forest monoculture risk.',
            'Technical assistance to rural drinking water committees and community water governance networks.'
          ],
          technologies: ['Environmental Governance', 'Public Policy', 'Legislative Advocacy', 'Watershed Management'],
          isVerified: true
        },
        {
          id: 'exp-biomass-epn',
          company: 'Environmental Paper Network & Global Forest Coalition',
          role: 'Researcher on Biomass and Pulp Industry Impacts',
          location: 'Latin America & Europe',
          startDate: '2022',
          endDate: '2024',
          isCurrent: false,
          summary: 'Independent technical investigation into the biophysical and socio-ecological impacts of large-scale timber plantations, bioenergy, and carbon accounting methodologies. Coordination with civil society coalitions and international institutions.',
          achievements: [
            'Publication of technical reports on carbon accounting integrity and environmental safeguards in forestry supply chains.',
            'Co-organizer of international policy dialogues on community-led forest protection and governance.'
          ],
          technologies: ['Carbon Accounting', 'Environmental Safeguards', 'Multi-stakeholder Facilitation'],
          isVerified: true
        }
      ],
      education: [
        {
          id: 'edu-msc-kiel-amu',
          institution: 'Christian-Albrechts-Universität zu Kiel (Germany) & Adam Mickiewicz University in Poznań (Poland)',
          degree: 'Double M.Sc. in Environmental Management & Environmental Protection',
          fieldOfStudy: 'Environmental Sciences, Integrated Watershed Management & Ecosystem Protection',
          startDate: '2023',
          endDate: '2026',
          location: 'Kiel (Germany) & Poznań (Poland)',
          isVerified: true
        },
        {
          id: 'edu-geophysics-uchile',
          institution: 'University of Chile (FCFM)',
          degree: 'B.Sc. in Geophysics (Graduated with Distinction)',
          fieldOfStudy: 'Solid Earth Geophysics, Hydrogeophysics & Fluid Mechanics',
          startDate: '2016',
          endDate: '2021',
          location: 'Santiago, Chile',
          isVerified: true
        },
        {
          id: 'edu-permaculture-epac',
          institution: 'Permaculture and Agroecology School of Chile (EPAC)',
          degree: 'Certified Permaculture Designer (PDC)',
          fieldOfStudy: 'Keyline Hydrological Design, Soil Regeneration & Ecosystem Restoration',
          startDate: '2023',
          endDate: '2023',
          location: 'Chile',
          isVerified: true
        }
      ],
      skills: initialProfile.skills,
      languages: initialProfile.languages,
      achievements: [
        {
          id: 'ach-1',
          title: 'Official Testimony before the Chamber of Deputies of Chile',
          description: 'Technical demonstration of the structural correlation between industrial forest plantations and wildfire disaster risk before the Congressional Emergency Commission.',
          metrics: 'Official Legislative Testimony',
          tags: ['Congress', 'Advocacy', 'Forestry Model', 'Wildfires'],
          date: '2024-03-01',
          isVerified: true
        },
        {
          id: 'ach-2',
          title: 'International Investigation on Biomass Industry & Carbon Accounting',
          description: 'Comprehensive study of carbon integrity and socio-environmental safeguards with Global Forest Coalition and Environmental Paper Network.',
          metrics: 'International Report & Publication',
          tags: ['Biomass', 'Carbon Accounting', 'Forests', 'EPN'],
          date: '2024-06-01',
          isVerified: true
        },
        {
          id: 'ach-3',
          title: 'Semifinalist UN Citiverse Challenge for Sustainable Cities (SDG Cities)',
          description: 'Co-development of the Smart Food Parks concept integrating digital twins, IoT, and satellite remote sensing for urban territorial planning and climate resilience.',
          metrics: 'UN International Semifinalist',
          tags: ['UN', 'Digital Twin', 'IoT', 'Resilience'],
          date: '2024-11-01',
          isVerified: true
        },
        {
          id: 'ach-4',
          title: 'International Climate & Ecological Economics Presentations',
          description: 'Key presentations at Degrowth Conference Oslo 2025, Environmental Justice Conference Bonn 2025, and Latin American Forum in Bogotá.',
          metrics: '5+ International Presentations',
          tags: ['Conferences', 'International', 'Just Transition'],
          date: '2025-01-01',
          isVerified: true
        }
      ],
      otherCourses: initialProfile.otherCourses
    }
  },
  {
    id: 'cv-daniel-santander-de',
    name: 'Lebenslauf Daniel Santander — Umweltforschung & Biophysikalische Systeme (Track A - DE)',
    templateId: 'de_two_page',
    language: 'de',
    createdAt: '2026-11-12',
    updatedAt: '2026-11-12',
    selectedExperiences: ['exp-cau-kiel', 'exp-advocacy-policy', 'exp-biomass-epn'],
    selectedEducation: ['edu-msc-kiel-amu', 'edu-geophysics-uchile', 'edu-permaculture-epac'],
    selectedSkills: ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6', 'sk-7', 'sk-8', 'sk-9', 'sk-10'],
    selectedAchievements: ['ach-1', 'ach-2', 'ach-3', 'ach-4'],
    customSummary: 'Interdisziplinärer Umweltwissenschaftler mit solidem Hintergrund in Geophysik (FCFM, Universidad de Chile, mit Auszeichnung) und europäischem Doppel-M.Sc. in Umweltmanagement & Umweltschutz (CAU Kiel, Deutschland / AMU Poznań, Polen). Spezialisiert auf biophysikalische Quantifizierung, Treibhausgasflussdynamik (Eddy-Kovarianz-Türme in wiedervernässten Mooren), hydrologische Einzugsgebietsbilanzen, Geodatenmodellierung (R, Python, QGIS, GEE) und umweltpolitische Beratung.',
    compiledData: {
      fullName: initialProfile.fullName,
      contactInfo: {
        email: initialProfile.email,
        phone: initialProfile.phone,
        location: 'Kiel, Deutschland / Europaweit mobil',
        linkedin: initialProfile.linkedin,
        github: initialProfile.github
      },
      summary: 'Interdisziplinärer Umweltwissenschaftler mit solidem Hintergrund in Geophysik (FCFM, Universidad de Chile, mit Auszeichnung) und europäischem Doppel-M.Sc. in Umweltmanagement & Umweltschutz (CAU Kiel, Deutschland / AMU Poznań, Polen). Spezialisiert auf biophysikalische Quantifizierung, Treibhausgasflussdynamik (Eddy-Kovarianz-Türme in wiedervernässten Mooren), hydrologische Einzugsgebietsbilanzen, Geodatenmodellierung (R, Python, QGIS, GEE) und umweltpolitische Beratung.',
      experiences: [
        {
          id: 'exp-cau-kiel-de',
          company: 'Christian-Albrechts-Universität zu Kiel & Adam-Mickiewicz-Universität Posen',
          role: 'Wissenschaftlicher Mitarbeiter / Forscher in Biophysikalischen Systemen & Moordynamik',
          location: 'Kiel (Deutschland) / Posen (Polen)',
          startDate: '2023',
          endDate: 'Present',
          isCurrent: true,
          summary: 'Empirische Quantifizierung von Treibhausgasflüssen (CO2/CH4) in wiedervernässten Niedermooren mittels mikrometeorologischer Eddy-Kovarianz-Messtürme und geschlossener Hauben. Boden- und Vegetationsbeprobung sowie hydrophysikalische Modellierung (R, GIS).',
          achievements: [
            'Kontinuierliche Kohlenstoffbilanzierung und Analyse der Methan-Emissionsdynamik unter meteorologischen Forcierenden.',
            'Entwicklung und Veröffentlichung des digitalen 3D-Zwillings "Wetland Monitor" zur saisonalen Simulation von Kohlenstoffflüssen.'
          ],
          technologies: ['R', 'Python', 'QGIS', 'ArcGIS', 'Google Earth Engine', 'Eddy Covariance'],
          isVerified: true
        },
        {
          id: 'exp-advocacy-policy-de',
          company: 'Umweltpolitische Fachberatung & Gesetzgebungsbegleitung',
          role: 'Wissenschaftlicher Berater für Umweltpolitik & Einzugsgebietsmanagement',
          location: 'Chile & Deutschland',
          startDate: '2021',
          endDate: 'Present',
          isCurrent: true,
          summary: 'Parlamentarische und kommunale Fachberatung zu Waldbrandprävention, integrierter Einzugsgebietsbewirtschaftung und agroökologischem Übergang. Offizielles Sachverständigengutachten vor der Notstandskommission der chilenischen Abgeordnetenkammer zum strukturellen Zusammenhang zwischen industriellen Forstmonokulturen und Katastrophenrisiken.',
          achievements: [
            'Offizielle Anhörung und Gutachtenpräsentation vor dem Nationalkongress von Chile.',
            'Fachliche Unterstützung ländlicher Trinkwasserkomitees und kommunaler Wassernetzwerke.'
          ],
          technologies: ['Umweltpolitik', 'Einzugsgebietsmanagement', 'Waldbrandprävention', 'Ressourcengovernance'],
          isVerified: true
        },
        {
          id: 'exp-biomass-epn-de',
          company: 'Environmental Paper Network & Global Forest Coalition',
          role: 'Wissenschaftlicher Gutachter für Biomasse & forstwirtschaftliche Nachhaltigkeit',
          location: 'Lateinamerika & Europa',
          startDate: '2022',
          endDate: '2024',
          isCurrent: false,
          summary: 'Unabhängige wissenschaftliche Untersuchung zu biophysikalischen und sozioökologischen Auswirkungen industrieller Holzplantagen, Bioenergie und Kohlenstoffbilanzierungsmethoden. Internationale Koordination mit zivilgesellschaftlichen Koalitionen und Institutionen.',
          achievements: [
            'Veröffentlichung von Fachberichten zur Integrität der Kohlenstoffbuchhaltung in forstwirtschaftlichen Lieferketten.',
            'Mitorganisation internationaler Fachdialoge zu gemeindebasiertem Waldschutz.'
          ],
          technologies: ['Kohlenstoffbuchhaltung', 'Umweltschutzstandards', 'Internationale Kooperation'],
          isVerified: true
        }
      ],
      education: [
        {
          id: 'edu-msc-kiel-amu-de',
          institution: 'Christian-Albrechts-Universität zu Kiel (Deutschland) & Adam-Mickiewicz-Universität Posen (Polen)',
          degree: 'Doppel-M.Sc. in Umweltmanagement & Umweltschutz',
          fieldOfStudy: 'Umweltwissenschaften, Einzugsgebietsmanagement & Ökosystemschutz',
          startDate: '2023',
          endDate: '2026',
          location: 'Kiel & Posen',
          isVerified: true
        },
        {
          id: 'edu-geophysics-uchile-de',
          institution: 'Universidad de Chile (FCFM)',
          degree: 'B.Sc. in Geophysik (Abschluss mit höchster Auszeichnung)',
          fieldOfStudy: 'Feste Erde, Hydrogeophysik & Fluidmechanik',
          startDate: '2016',
          endDate: '2021',
          location: 'Santiago, Chile',
          isVerified: true
        },
        {
          id: 'edu-permaculture-epac-de',
          institution: 'Permakultur- und Agroökologieschule Chile (EPAC)',
          degree: 'Zertifizierter Permakultur-Designer (PDC)',
          fieldOfStudy: 'Keyline-Wassereinzugsdesign, Bodenregeneration & Renaturierung',
          startDate: '2023',
          endDate: '2023',
          location: 'Chile',
          isVerified: true
        }
      ],
      skills: initialProfile.skills,
      languages: [
        { id: 'lang-es', language: 'Spanisch', proficiency: 'Nativo' },
        { id: 'lang-en', language: 'Englisch', proficiency: 'C2' },
        { id: 'lang-de', language: 'Deutsch', proficiency: 'B1' }
      ],
      achievements: [
        {
          id: 'ach-1-de',
          title: 'Offizielles Gutachten vor dem Nationalkongress von Chile',
          description: 'Wissenschaftlicher Nachweis des strukturellen Zusammenhangs zwischen Forstplantagen und Waldbrandkatastrophen.',
          metrics: 'Offizielles Parlamentsgutachten',
          tags: ['Parlament', 'Gesetzgebung', 'Klimafolgen'],
          date: '2024-03-01',
          isVerified: true
        },
        {
          id: 'ach-2-de',
          title: 'Internationale Untersuchung zur Biomasseindustrie & Kohlenstoffintegrität',
          description: 'Umfassende Studie zu Kohlenstoffstandards mit Global Forest Coalition und Environmental Paper Network.',
          metrics: 'Internationale Publikation',
          tags: ['Biomasse', 'Kohlenstoffbilanz', 'Forstwirtschaft'],
          date: '2024-06-01',
          isVerified: true
        }
      ],
      otherCourses: initialProfile.otherCourses
    }
  },
  {
    id: 'cv-daniel-santander-gastro-es',
    name: 'CV Daniel Santander — Hostelería, Barra & Servicio al Cliente (Track B - ES)',
    templateId: 'es_standard',
    language: 'es',
    createdAt: '2026-11-12',
    updatedAt: '2026-11-12',
    selectedExperiences: ['op-el-huerto', 'op-subterraneo', 'op-thai-pals', 'op-nuria', 'op-ferias'],
    selectedEducation: ['edu-geophysics-uchile', 'edu-msc-kiel-amu'],
    selectedSkills: ['sk-serv-1', 'sk-serv-2', 'sk-serv-3', 'sk-serv-4', 'sk-serv-5'],
    selectedAchievements: ['ach-gastro-1', 'ach-gastro-2'],
    customSummary: 'Profesional dinámico, metódico y polivalente con amplia experiencia práctica en hostelería (servicio de sala à-la-carte y barra de alta afluencia), atención directa al público y venta comercial. Destacada capacidad para trabajar bajo presión en horas punta, rapidez en el servicio, disciplina operativa y flexibilidad horaria total para turnos rotativos y fines de semana.',
    compiledData: {
      fullName: initialProfile.fullName,
      contactInfo: {
        email: initialProfile.email,
        phone: initialProfile.phone,
        location: 'Bilbao, España / Alemania / Remoto',
        linkedin: initialProfile.linkedin,
        github: initialProfile.github
      },
      summary: 'Profesional dinámico, metódico y polivalente con amplia experiencia práctica en hostelería (servicio de sala à-la-carte y barra de alta afluencia), atención directa al público y venta comercial. Destacada capacidad para trabajar bajo presión en horas punta, rapidez en el servicio, disciplina operativa y flexibilidad horaria total para turnos rotativos y fines de semana.',
      experiences: [
        {
          id: 'op-el-huerto',
          company: 'Restaurante El Huerto (Providencia, Santiago)',
          role: 'Camarero / Servicio de Sala (à-la-carte)',
          location: 'Santiago, Chile',
          startDate: '2021',
          endDate: '2022',
          isCurrent: false,
          summary: 'Servicio de mesa à-la-carte en restaurante gastronómico vegetariano de alta rotación. Atención de mesas, toma de comandas, conocimiento exhaustivo de la carta, asesoramiento sobre alérgenos e intolerancias, y protocolo impecable de sala.',
          achievements: [
            'Atención ágil en turnos intensos de almuerzo y cena con excelentes valoraciones de clientes.',
            'Mise-en-place sistemática de comedor y aplicación rigurosa de normas higiénico-sanitarias.'
          ],
          technologies: ['Servicio de Sala', 'Mise-en-place', 'Protocolo Gastronómico', 'Atención al Cliente', 'Alérgenos'],
          isVerified: true
        },
        {
          id: 'op-subterraneo',
          company: 'Club & Bar Subterráneo (Paseo Orrego Luco)',
          role: 'Bartender / Servicio de Barra de Alto Volumen',
          location: 'Santiago, Chile',
          startDate: '2020',
          endDate: '2021',
          isCurrent: false,
          summary: 'Servicio acelerado de barra y bebidas en sala de conciertos y ocio nocturno con gran afluencia. Despacho rápido de cerveza de barril, combinados y refrescos, cobro con TPV, cuadre de caja y reposición continua de botellería bajo alta presión acústica y temporal.',
          achievements: [
            'Gestión fluida de barra sirviendo a cientos de comensales por noche con cero descuadres en caja.',
            'Excelente resistencia física nocturna y control de la calma en momentos de máxima aglomeración.'
          ],
          technologies: ['Coctelería Rápida', 'Caja & TPV', 'Resistencia Nocturna', 'Gestión de Barriles & Stock', 'Control de Estrés'],
          isVerified: true
        },
        {
          id: 'op-thai-pals',
          company: 'Restaurante Thai Pals (Providencia)',
          role: 'Camarero / Asistente de Sala & Take-away',
          location: 'Santiago, Chile',
          startDate: '2019',
          endDate: '2020',
          isCurrent: false,
          summary: 'Atención al cliente en restaurante de cocina tailandesa. Gestión integral de comandas en sala y pedidos de comida para llevar, apoyo en barra y reposición de estación de servicio.',
          achievements: [
            'Optimización del ritmo de servicio en franja punta de almuerzos ejecutivos.',
            'Coordinación directa y eficaz entre cocina y sala para acortar tiempos de espera.'
          ],
          technologies: ['Servicio de Comedor', 'Take-away', 'Coordinación Cocina-Sala', 'Atención Bilingüe'],
          isVerified: true
        },
        {
          id: 'op-nuria',
          company: 'Bar & Restaurante Nuria (Santiago Centro)',
          role: 'Bartender / Servicio de Barra Tradicional',
          location: 'Santiago, Chile',
          startDate: '2018',
          endDate: '2019',
          isCurrent: false,
          summary: 'Servicio en barra tradicional histórica con alto flujo continuo de clientes. Preparación de cafetería, cañas, aperitivos y combinados clásicos, con arqueo diario de caja y mantenimiento higiénico.',
          achievements: [
            'Arqueos de caja diarios sin incidencias y fidelización de clientela habitual.',
            'Atención rápida y simultánea de barra y despacho a mesas.'
          ],
          technologies: ['Barra Tradicional', 'Cafetería', 'Arqueo de Caja', 'Fidelización', 'Limpieza de Estación'],
          isVerified: true
        },
        {
          id: 'op-ferias',
          company: 'Venta Directa en Ferias Culturales & Plazas',
          role: 'Vendedor & Gestor de Puesto (Libros & Textil)',
          location: 'Santiago, Concepción y Parral, Chile',
          startDate: '2016',
          endDate: '2020',
          isCurrent: false,
          summary: 'Venta cara a cara con el público, negociación de precios, asesoramiento personalizado, gestión de cobros en efectivo y medios electrónicos, y montaje y desmontaje logístico de puestos.',
          achievements: [
            'Habilidad comprobada de empatía comercial, trato cercano y persuasión honesta.',
            'Autonomía en transporte de mercancías y gestión de inventario.'
          ],
          technologies: ['Venta Directa', 'Negociación', 'Gestión de Efectivo', 'Atención al Público', 'Logística'],
          isVerified: true
        }
      ],
      education: [
        {
          id: 'edu-univ-dan',
          institution: 'Universidad de Chile & Universidades Europeas (CAU Kiel / AMU Poznań)',
          degree: 'Formación Universitaria en Geofísica & Ciencias Ambientales',
          fieldOfStudy: 'Ciencias Exactas & Gestión de Proyectos',
          startDate: '2016',
          endDate: '2026',
          location: 'Chile & Alemania',
          isVerified: true
        }
      ],
      skills: [
        { id: 'sk-g-1', name: 'Servicio de Sala y Comedor', category: 'Domain', level: 'Avanzado', yearsOfExperience: 3 },
        { id: 'sk-g-2', name: 'Barra, Coctelería & Cafetería', category: 'Tech', level: 'Avanzado', yearsOfExperience: 3 },
        { id: 'sk-g-3', name: 'Mise-en-place & Estándares Sanitarios', category: 'Domain', level: 'Avanzado', yearsOfExperience: 3 },
        { id: 'sk-g-4', name: 'Control de Caja & TPV', category: 'Tools', level: 'Avanzado', yearsOfExperience: 4 },
        { id: 'sk-g-5', name: 'Atención al Cliente & Trato Amable', category: 'Soft', level: 'Experto', yearsOfExperience: 6 },
        { id: 'sk-g-6', name: 'Resistencia Física en Turnos Rotativos', category: 'Soft', level: 'Experto', yearsOfExperience: 5 }
      ],
      languages: [
        { id: 'lang-es', language: 'Español', proficiency: 'Nativo' },
        { id: 'lang-en', language: 'Inglés', proficiency: 'C2' },
        { id: 'lang-de', language: 'Alemán', proficiency: 'B1' }
      ],
      achievements: [
        {
          id: 'ach-gastro-1',
          title: 'Servicio Impecable en Horas Pico',
          description: 'Experiencia contrastada en sala y barra de alta afluencia (El Huerto, Club Subterráneo) manteniendo la calma y el trato cortés.',
          metrics: '+3 años de experiencia en gastronomía',
          tags: ['Gastronomía', 'Barra', 'Sala', 'Resistencia'],
          date: '2022-01-01',
          isVerified: true
        },
        {
          id: 'ach-gastro-2',
          title: 'Polivalencia y Habilidades Manuales',
          description: 'Capacidad para realizar tareas auxiliares de mantenimiento, carpintería, logística de compras y apoyo integral al negocio.',
          metrics: 'Allrounder con autonomía práctica',
          tags: ['Allrounder', 'Mantenimiento', 'Autonomía'],
          date: '2021-01-01',
          isVerified: true
        }
      ],
      otherCourses: [
        'Manipulación de Alimentos y Protocolos de Higiene',
        'Primeros Auxilios Básicos y Seguridad Laboral',
        'Atención y Resolución de Conflictos con Clientes'
      ]
    }
  },
  {
    id: 'cv-daniel-santander-gastro-de',
    name: 'Lebenslauf Daniel Santander — Gastronomie, Bar & Service (Track B - DE)',
    templateId: 'europass',
    language: 'de',
    createdAt: '2026-11-12',
    updatedAt: '2026-11-12',
    selectedExperiences: ['op-el-huerto', 'op-subterraneo', 'op-thai-pals', 'op-nuria', 'op-ferias'],
    selectedEducation: ['edu-geophysics-uchile', 'edu-msc-kiel-amu'],
    selectedSkills: ['sk-serv-1', 'sk-serv-2', 'sk-serv-3', 'sk-serv-4', 'sk-serv-5'],
    selectedAchievements: ['ach-gastro-1', 'ach-gastro-2'],
    customSummary: 'Zuverlässige, dynamische und mehrsprachige Persönlichkeit (Spanisch Muttersprache, Englisch verhandlungssicher C2, Deutsch B1/B2) mit mehrjähriger praktischer Erfahrung in Gastronomie (à-la-carte Service & Barbetrieb), Kundenbetreuung und Allround-Tätigkeiten. Hohe Belastbarkeit in Stoßzeiten, teamorientiert und sofort einsatzbereit für Schicht- und Wochenendarbeit. Belehrung nach § 43 IfSG kurzfristig abrufbar.',
    compiledData: {
      fullName: initialProfile.fullName,
      contactInfo: {
        email: initialProfile.email,
        phone: initialProfile.phone,
        location: 'Deutschland / Sofort mobil & einsatzbereit',
        linkedin: initialProfile.linkedin,
        github: initialProfile.github
      },
      summary: 'Zuverlässige, dynamische und mehrsprachige Persönlichkeit (Spanisch Muttersprache, Englisch verhandlungssicher C2, Deutsch B1/B2) mit mehrjähriger praktischer Erfahrung in Gastronomie (à-la-carte Service & Barbetrieb), Kundenbetreuung und Allround-Tätigkeiten. Hohe Belastbarkeit in Stoßzeiten, teamorientiert und sofort einsatzbereit für Schicht- und Wochenendarbeit. Belehrung nach § 43 IfSG kurzfristig abrufbar.',
      experiences: [
        {
          id: 'op-el-huerto-de',
          company: 'Restaurant El Huerto (Santiago de Chile)',
          role: 'Servicekraft im à-la-carte-Service',
          location: 'Santiago, Chile',
          startDate: '2021',
          endDate: '2022',
          isCurrent: false,
          summary: 'Professionelle Gästebetreuung und à-la-carte-Servicetätigkeit in renommiertem vegetarischem Gastronomiebetrieb. Aufnahme von Bestellungen, Beratung zu Speisen und Allergenen, Servieren von Speisen und Getränken sowie Einhaltung strenger Hygienevorschriften.',
          achievements: [
            'Erfolgreiche Bewältigung starker Gästeaufkommen in Mittags- und Abendschichten mit hervorragendem Feedback.',
            'Sorgfältiges Mise-en-place des Gastraums und vorbildliche Einhaltung aller Hygiene- und Servicestandards.'
          ],
          technologies: ['Gästebetreuung', 'à-la-carte Service', 'Mise-en-place', 'Allergene & Ernährung', 'Hygienestandards'],
          isVerified: true
        },
        {
          id: 'op-subterraneo-de',
          company: 'Club & Bar Subterráneo (Paseo Orrego Luco)',
          role: 'Barkeeper & Tresenkraft (Nacht- & Hochfrequenzbetrieb)',
          location: 'Santiago, Chile',
          startDate: '2020',
          endDate: '2021',
          isCurrent: false,
          summary: 'Schneller und präziser Ausschank im stark besuchten Bar- und Live-Musik-Betrieb. Zubereitung von Drinks, Fassbier-Zapfen, Bedienung von Kassensystemen (Kassieren & Abrechnung), Auffüllen von Beständen und Arbeitsplatzreinigung unter hohem Zeiteinfluss.',
          achievements: [
            'Souveräne Betreuung hunderter Gäste pro Nacht ohne Abrechnungsdifferenzen.',
            'Hohe körperliche Belastbarkeit und ruhiges, freundliches Auftreten bei Spitzenbetrieb.'
          ],
          technologies: ['Schneller Tresenausschank', 'Kassensysteme & Abrechnung', 'Belastbarkeit', 'Warenbestand', 'Teamwork'],
          isVerified: true
        },
        {
          id: 'op-thai-pals-de',
          company: 'Restaurant Thai Pals (Providencia)',
          role: 'Servicekraft & Gastbetreuung',
          location: 'Santiago, Chile',
          startDate: '2019',
          endDate: '2020',
          isCurrent: false,
          summary: 'Gästeservice in thailändischem Spezialitätenrestaurant. Bestellungsannahme für Tischgäste und Take-away, Thekenunterstützung und reibungslose Schnittstelle zur Küche.',
          achievements: [
            'Schnelle Tischwechsel und zügiger Service während geschäftiger Mittagszeiten.',
            'Effiziente Koordination zwischen Küche und Service zur Minimierung von Wartezeiten.'
          ],
          technologies: ['Tischservice', 'Take-away', 'Küchen-Service-Koordination', 'Mehrsprachige Gäste', 'Schnelligkeit'],
          isVerified: true
        },
        {
          id: 'op-nuria-de',
          company: 'Bar & Restaurant Nuria (Santiago Centro)',
          role: 'Tresenkraft & Traditioneller Barservice',
          location: 'Santiago, Chile',
          startDate: '2018',
          endDate: '2019',
          isCurrent: false,
          summary: 'Traditioneller Tresen- und Kaffeeausschank in stark frequentierter Gaststätte im Stadtzentrum. Ausgabe von Kaffeespezialitäten, Fassbier und Snacks sowie täglicher Kassenabschluss.',
          achievements: [
            'Zuverlässige Kassenführung ohne Differenzen und Zuvorkommenheit gegenüber Stammgästen.',
            'Paralleles Bedienen von Thekengästen und Bereitstellung für den Saal.'
          ],
          technologies: ['Traditionelle Theke', 'Kaffeespezialitäten', 'Kassieren', 'Stammkundenpflege', 'Station-Hygiene'],
          isVerified: true
        },
        {
          id: 'op-ferias-de',
          company: 'Direktvertrieb auf Kultur- & Textilmärkten',
          role: 'Kundenberater & Standverkauf',
          location: 'Santiago, Concepción und Parral, Chile',
          startDate: '2016',
          endDate: '2020',
          isCurrent: false,
          summary: 'Direkter Kundenkontakt, persönliche Beratung und aktiver Verkauf von Büchern und Textilien. Standauf- und -abbau, Preiskalkulation, Bargeld- und Kartenzahlungsabwicklung.',
          achievements: [
            'Ausgeprägte kommunikative Stärke, Überzeugungskraft und Freude am Kontakt mit Menschen.',
            'Eigenverantwortliche Organisation von Logistik, Standgestaltung und Kassenabschluss.'
          ],
          technologies: ['Direktverkauf', 'Verhandlungsgeschick', 'Kundenorientierung', 'Kassenführung', 'Logistik'],
          isVerified: true
        }
      ],
      education: [
        {
          id: 'edu-univ-dan-de',
          institution: 'Universidad de Chile & Universitäten Kiel / Poznań (Deutschland / Polen)',
          degree: 'Akademische Ausbildung in Natur- & Umweltwissenschaften',
          fieldOfStudy: 'Exakte Wissenschaften & Projektorganisation',
          startDate: '2016',
          endDate: '2026',
          location: 'Chile & Deutschland',
          isVerified: true
        }
      ],
      skills: [
        { id: 'sk-g-de-1', name: 'à-la-carte Service & Gästebetreuung', category: 'Domain', level: 'Avanzado', yearsOfExperience: 3 },
        { id: 'sk-g-de-2', name: 'Tresen- & Barbereich (Ausschank)', category: 'Tech', level: 'Avanzado', yearsOfExperience: 3 },
        { id: 'sk-g-de-3', name: 'Mise-en-place & Hygiene-Standards', category: 'Domain', level: 'Avanzado', yearsOfExperience: 3 },
        { id: 'sk-g-de-4', name: 'Kassensysteme & Abrechnung', category: 'Tools', level: 'Avanzado', yearsOfExperience: 4 },
        { id: 'sk-g-de-5', name: 'Freundlichkeit & Kundenorientierung', category: 'Soft', level: 'Experto', yearsOfExperience: 6 },
        { id: 'sk-g-de-6', name: 'Körperliche Belastbarkeit in Schichten', category: 'Soft', level: 'Experto', yearsOfExperience: 5 }
      ],
      languages: [
        { id: 'lang-es-de', language: 'Spanisch', proficiency: 'Nativo' },
        { id: 'lang-en-de', language: 'Englisch', proficiency: 'C2' },
        { id: 'lang-de-de', language: 'Deutsch', proficiency: 'B1' }
      ],
      achievements: [
        {
          id: 'ach-gastro-de-1',
          title: 'Praxiserprobte Belastbarkeit in Spitzenzeiten',
          description: 'Nachgewiesene Gastronomie-Erfahrung in hochfrequentierten Betrieben (El Huerto, Subterráneo) mit ruhigem und gastorientiertem Auftreten.',
          metrics: '+3 Jahre Gastronomie-Praxis',
          tags: ['Gastronomie', 'Theke', 'Service', 'Belastbarkeit'],
          date: '2022-01-01',
          isVerified: true
        },
        {
          id: 'ach-gastro-de-2',
          title: 'Allround-Fähigkeiten & Handwerkliches Geschick',
          description: 'Zusatzqualifikation für Instandhaltung, Holzbearbeitung und praktische Betriebsassistenz.',
          metrics: 'Handwerklich geschickter Allrounder',
          tags: ['Allrounder', 'Handwerk', 'Selbstständigkeit'],
          date: '2021-01-01',
          isVerified: true
        }
      ],
      otherCourses: [
        'Lebensmittelhygiene & HACCP-Grundlagen',
        'Belehrung nach § 43 Infektionsschutzgesetz (IfSG) kurzfristig abrufbar',
        'Erste Hilfe im Betrieb'
      ]
    }
  },
  {
    id: 'cv-daniel-santander-gastro-en',
    name: 'Resume Daniel Santander — Hospitality, Bartending & Customer Service (Track B - EN)',
    templateId: 'en_tech',
    language: 'en',
    createdAt: '2026-11-12',
    updatedAt: '2026-11-12',
    selectedExperiences: ['op-el-huerto-en', 'op-subterraneo-en', 'op-thai-pals-en', 'op-nuria-en', 'op-ferias-en'],
    selectedEducation: ['edu-univ-dan-en'],
    selectedSkills: ['sk-serv-1', 'sk-serv-2', 'sk-serv-3', 'sk-serv-4', 'sk-serv-5'],
    selectedAchievements: ['ach-gastro-en-1', 'ach-gastro-en-2'],
    customSummary: 'Energetic, versatile, and multilingual hospitality professional (Native Spanish, Fluent English C2, German B1/B2) with proven hands-on experience in à-la-carte dining service, high-volume cocktail/bar operations, and retail customer care. Exceptional stamina during peak service rushes, calm under pressure, meticulous with hygiene and cash handling, and fully flexible for rotating, evening, and weekend shifts.',
    compiledData: {
      fullName: initialProfile.fullName,
      contactInfo: {
        email: initialProfile.email,
        phone: initialProfile.phone,
        location: 'Germany / Spain / Open to Relocation & Flexible Shifts',
        linkedin: initialProfile.linkedin,
        github: initialProfile.github
      },
      summary: 'Energetic, versatile, and multilingual hospitality professional (Native Spanish, Fluent English C2, German B1/B2) with proven hands-on experience in à-la-carte dining service, high-volume cocktail/bar operations, and retail customer care. Exceptional stamina during peak service rushes, calm under pressure, meticulous with hygiene and cash handling, and fully flexible for rotating, evening, and weekend shifts.',
      experiences: [
        {
          id: 'op-el-huerto-en',
          company: 'Restaurant El Huerto (Providencia, Santiago)',
          role: 'Food & Beverage Server (à-la-carte Dining)',
          location: 'Santiago, Chile',
          startDate: '2021',
          endDate: '2022',
          isCurrent: false,
          summary: 'High-standard table service in renowned organic dining restaurant. Managed multi-table sections, order taking, wine recommendations, detailed dietary/allergen guidance, and courteous guest hospitality.',
          achievements: [
            'Delivered seamless service during peak lunch and dinner rushes with top guest satisfaction ratings.',
            'Maintained flawless dining room mise-en-place and strict food hygiene standards.'
          ],
          technologies: ['Table Service', 'Mise-en-place', 'Fine Casual Dining', 'Allergen Guidance', 'Guest Relations'],
          isVerified: true
        },
        {
          id: 'op-subterraneo-en',
          company: 'Club & Bar Subterráneo (Paseo Orrego Luco)',
          role: 'High-Volume Bartender & Nightshift Counter Staff',
          location: 'Santiago, Chile',
          startDate: '2020',
          endDate: '2021',
          isCurrent: false,
          summary: 'Fast-paced bartending and drink service in high-capacity live music venue and nightclub. Rapid cocktail preparation, draft beer pouring, POS register operation, cash balancing, and bottle inventory restock under high auditory and time pressure.',
          achievements: [
            'Efficiently served hundreds of patrons per shift with zero cash discrepancies or glass breakages.',
            'Demonstrated top physical resilience during long nocturnal shifts while maintaining an upbeat demeanor.'
          ],
          technologies: ['Speed Bartending', 'POS & Cash Handling', 'Nocturnal Shifts', 'Keg & Inventory Management', 'Stress Resilience'],
          isVerified: true
        },
        {
          id: 'op-thai-pals-en',
          company: 'Restaurant Thai Pals (Providencia)',
          role: 'Dining Room Server & Take-away Coordinator',
          location: 'Santiago, Chile',
          startDate: '2019',
          endDate: '2020',
          isCurrent: false,
          summary: 'Front-of-house customer service in authentic Thai cuisine venue. Coordinated table turnarounds, take-away orders, bar support, and kitchen communication.',
          achievements: [
            'Streamlined table turnaround times during peak executive lunch rush hours.',
            'Ensured clear communication between kitchen staff and front-of-house to reduce guest wait times.'
          ],
          technologies: ['Dining Room Service', 'Take-away Logistics', 'Kitchen-Floor Coordination', 'Multilingual Care'],
          isVerified: true
        },
        {
          id: 'op-nuria-en',
          company: 'Bar & Restaurant Nuria (Downtown Santiago)',
          role: 'Traditional Bartender & Counter Service',
          location: 'Santiago, Chile',
          startDate: '2018',
          endDate: '2019',
          isCurrent: false,
          summary: 'Counter service in classic historic downtown bar with steady patron footfall. Prepared morning espresso drinks, draft beers, and classic aperitifs with daily cash register balancing.',
          achievements: [
            'Consistently achieved 100% accurate daily register closures and built strong rapport with regular patrons.',
            'Simultaneously managed direct bar counter orders and floor drink service.'
          ],
          technologies: ['Bar Counter Service', 'Espresso Brewing', 'Cash Handling', 'Customer Retention', 'Station Sanitization'],
          isVerified: true
        },
        {
          id: 'op-ferias-en',
          company: 'Direct Retail at Book, Cultural & Vintage Fairs',
          role: 'Customer Sales & Stand Coordinator',
          location: 'Santiago, Concepción & Parral, Chile',
          startDate: '2016',
          endDate: '2020',
          isCurrent: false,
          summary: 'Face-to-face customer engagement, price negotiation, inventory curation, and direct sales at outdoor cultural book and vintage markets. Managed stand setup, cash transactions, and logistics.',
          achievements: [
            'Developed natural rapport, active listening, and strong commercial communication skills.',
            'Independently coordinated transportation, merchandise display, and end-of-day accounting.'
          ],
          technologies: ['Direct Sales', 'Customer Engagement', 'Cash Management', 'Logistics', 'Product Display'],
          isVerified: true
        }
      ],
      education: [
        {
          id: 'edu-univ-dan-en',
          institution: 'University of Chile & European Universities (CAU Kiel / AMU Poznań)',
          degree: 'University Background in Exact & Environmental Sciences',
          fieldOfStudy: 'Quantitative Sciences & Project Coordination',
          startDate: '2016',
          endDate: '2026',
          location: 'Chile & Germany',
          isVerified: true
        }
      ],
      skills: [
        { id: 'sk-g-en-1', name: 'Dining Room & Table Service', category: 'Domain', level: 'Avanzado', yearsOfExperience: 3 },
        { id: 'sk-g-en-2', name: 'High-Volume Bartending & Counter Care', category: 'Tech', level: 'Avanzado', yearsOfExperience: 3 },
        { id: 'sk-g-en-3', name: 'Mise-en-place & Food Safety Hygiene', category: 'Domain', level: 'Avanzado', yearsOfExperience: 3 },
        { id: 'sk-g-en-4', name: 'POS & Cash Register Balancing', category: 'Tools', level: 'Avanzado', yearsOfExperience: 4 },
        { id: 'sk-g-en-5', name: 'Guest Hospitality & Active Care', category: 'Soft', level: 'Experto', yearsOfExperience: 6 },
        { id: 'sk-g-en-6', name: 'Physical Stamina & Shift Flexibility', category: 'Soft', level: 'Experto', yearsOfExperience: 5 }
      ],
      languages: [
        { id: 'lang-es-en', language: 'Spanish', proficiency: 'Nativo' },
        { id: 'lang-en-en', language: 'English', proficiency: 'C2' },
        { id: 'lang-de-en', language: 'German', proficiency: 'B1' }
      ],
      achievements: [
        {
          id: 'ach-gastro-en-1',
          title: 'Battle-Tested High-Volume Service Stamina',
          description: 'Hands-on hospitality experience across high-traffic Santiago venues (El Huerto, Club Subterráneo) with calm, courteous customer focus.',
          metrics: '+3 Years Hospitality Experience',
          tags: ['Hospitality', 'Bartending', 'Service', 'Resilience'],
          date: '2022-01-01',
          isVerified: true
        },
        {
          id: 'ach-gastro-en-2',
          title: 'Practical Allrounder & Facility Skills',
          description: 'Demonstrated capability in operational support, basic woodwork/carpentry, and equipment handling.',
          metrics: 'Handy Allrounder & Quick Learner',
          tags: ['Allrounder', 'Maintenance', 'Self-Reliance'],
          date: '2021-01-01',
          isVerified: true
        }
      ],
      otherCourses: [
        'Food Hygiene & HACCP Principles',
        'German Health Infection Certificate (§ 43 IfSG) available on short notice',
        'Workplace Safety & First Aid'
      ]
    }
  }
];


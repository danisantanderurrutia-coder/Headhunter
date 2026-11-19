import type { CompanySectorCluster, QuadrantType } from '../types/companies';

export interface BenchmarkClusterRow {
  id: string;
  cluster: CompanySectorCluster;
  clusterName: string;
  quadrant: QuadrantType;
  quadrantName: string;
  prob3m: number;
  prob6m: number;
  visaFriction: 'Nula' | 'Baja' | 'Media' | 'Alta' | 'Extrema';
  hiringSpeed: 'Muy Rápida (2-4 sem)' | 'Rápida (4-6 sem)' | 'Media (6-10 sem)' | 'Lenta (3-6 meses)';
  languageFit: 'Nativo' | 'C2 Inglés' | 'B1 Alemán (OK)' | 'Barrera Alta';
  tier: 'TIER 1 · Máxima Prioridad' | 'TIER 2 · Paralelo Activo' | 'TIER 3 · Outbound de Nicho' | 'TIER 4 · Desaconsejado';
  strategicReturn: 'Pasaporte UE 2a' | 'Graduado DE § 20' | 'IEC Canadá' | 'Sueldo Alto / Sin Pasaporte' | 'Riesgo / Descarte';
  whyScore: string;
  keyTargets: string[];
}

export const BENCHMARK_DATA: BenchmarkClusterRow[] = [
  {
    id: 'bench-dach-rd',
    cluster: 'RD_PUBLIC',
    clusterName: 'I+D Público Suelos & Turberas',
    quadrant: 'DACH',
    quadrantName: 'Alemania (Bonn/Leipzig/Potsdam)',
    prob3m: 74,
    prob6m: 95,
    visaFriction: 'Baja',
    hiringSpeed: 'Media (6-10 sem)',
    languageFit: 'B1 Alemán (OK)',
    tier: 'TIER 1 · Máxima Prioridad',
    strategicReturn: 'Graduado DE § 20',
    whyScore: 'Encaje directo con tu maestría europea, Eddy Covariance, cámaras cerradas y mecánica de suelos. Tienes visa en Alemania con acceso al visado de 18 meses para graduados (§ 20 AufenthG). Centros federales en polos científicos como Braunschweig, Leipzig, Potsdam y Bonn con sueldos TVöD E13.',
    keyTargets: ['Thünen-Institut', 'UBA', 'GFZ Potsdam', 'UFZ Leipzig', 'Greifswald Mire Centre', 'Jülich IBG-3']
  },
  {
    id: 'bench-carbon-tech-remote',
    cluster: 'CARBON_TECH_MRV',
    clusterName: 'Carbon-Tech & Calificación MRV',
    quadrant: 'UK_NL',
    quadrantName: 'UK & Remoto Europa',
    prob3m: 68,
    prob6m: 89,
    visaFriction: 'Baja',
    hiringSpeed: 'Muy Rápida (2-4 sem)',
    languageFit: 'C2 Inglés',
    tier: 'TIER 1 · Máxima Prioridad',
    strategicReturn: 'Sueldo Alto / Sin Pasaporte',
    whyScore: 'La industria de ratings de carbono y satélites busca desesperadamente científicos que entiendan la física real detrás de los píxeles (GEE, Sentinel, flujos de GEI sin greenwashing). Procesos de contratación ágiles de 2 a 4 semanas con sueldos tecnológicos e inglés C2 bilingüe.',
    keyTargets: ['Sylvera', 'BeZero Carbon', 'Space Intelligence', 'Soil Capital', 'CarbonSpace', 'Pachama']
  },
  {
    id: 'bench-euskadi-rd',
    cluster: 'RD_PUBLIC',
    clusterName: 'I+D Ambiental & Suelos',
    quadrant: 'EUSKADI',
    quadrantName: 'Euskadi / España',
    prob3m: 62,
    prob6m: 86,
    visaFriction: 'Media',
    hiringSpeed: 'Rápida (4-6 sem)',
    languageFit: 'Nativo',
    tier: 'TIER 1 · Máxima Prioridad',
    strategicReturn: 'Pasaporte UE 2a',
    whyScore: 'Cero fricción de idioma (español nativo) y el retorno geopolítico más valioso de todos: la vía de nacionalidad española en 2 años para ciudadanos chilenos. Centros vascos de élite buscan analistas climáticos y de suelos.',
    keyTargets: ['BC3', 'Tecnalia', 'Neiker', 'AZTI', 'Ikerbasque', 'CREAF']
  },
  {
    id: 'bench-nordics-peatlands',
    cluster: 'RD_PUBLIC',
    clusterName: 'Turberas Boreales & Monitoreo ICOS',
    quadrant: 'NORDICS',
    quadrantName: 'Nórdicos (Finlandia / Suecia)',
    prob3m: 58,
    prob6m: 83,
    visaFriction: 'Baja',
    hiringSpeed: 'Media (6-10 sem)',
    languageFit: 'C2 Inglés',
    tier: 'TIER 2 · Paralelo Activo',
    strategicReturn: 'Graduado DE § 20',
    whyScore: 'Finlandia y Suecia son la capital mundial de turberas boreales y flujos de carbono. Toda la investigación científica en ICOS, LUKE y VTT opera 100% en inglés C2. Visados de investigación rápidos en el espacio Schengen.',
    keyTargets: ['ICOS Head Office', 'LUKE', 'VTT', 'NILU', 'SMHI', 'Carboculture']
  },
  {
    id: 'bench-cat-risk',
    cluster: 'CAT_RISK_INSURANCE',
    clusterName: 'Cat Risk & Seguros Climáticos',
    quadrant: 'GLOBAL',
    quadrantName: 'Múnich / Zúrich / Londres / Madrid',
    prob3m: 46,
    prob6m: 72,
    visaFriction: 'Media',
    hiringSpeed: 'Rápida (4-6 sem)',
    languageFit: 'C2 Inglés',
    tier: 'TIER 2 · Paralelo Activo',
    strategicReturn: 'Sueldo Alto / Sin Pasaporte',
    whyScore: 'Tu tesis de geofísica en modelación física de incendios forestales y balance hidrológico en cuencas degradadas tiene aplicación directa en reaseguros paramétricos. Puestos muy bien remunerados aunque selectivos.',
    keyTargets: ['Munich Re', 'Swiss Re', 'Moody\'s RMS', 'Descartes Underwriting', 'Mitiga Solutions', 'Guy Carpenter']
  },
  {
    id: 'bench-earth-observation',
    cluster: 'EARTH_OBSERVATION_AGROTECH',
    clusterName: 'Observación de la Tierra, Gemelos Digitales & Agrotech',
    quadrant: 'DACH',
    quadrantName: 'Alemania (Múnich/Friburgo) / Remoto Europa',
    prob3m: 65,
    prob6m: 88,
    visaFriction: 'Baja',
    hiringSpeed: 'Rápida (4-6 sem)',
    languageFit: 'C2 Inglés',
    tier: 'TIER 1 · Máxima Prioridad',
    strategicReturn: 'Graduado DE § 20',
    whyScore: 'Encaje directo con tu desarrollo de gemelos digitales 3D (Wetland Monitor, AgriTwin, ReWild) y el procesamiento de series temporales de satélites Copernicus Sentinel-2 e IoT de suelo. La industria europea busca con urgencia científicos con base físico-matemática que conecten datos de teledetección con terreno sin abstracciones vacías.',
    keyTargets: ['ConstellR', 'OroraTech', 'Planet Labs', 'Agreena', 'Amphos 21']
  },
  {
    id: 'bench-multilateral',
    cluster: 'MULTILATERAL_POLICY',
    clusterName: 'Multilateral & Gobernanza Climática',
    quadrant: 'GLOBAL',
    quadrantName: 'Bonn / La Haya / Bruselas',
    prob3m: 32,
    prob6m: 62,
    visaFriction: 'Baja',
    hiringSpeed: 'Lenta (3-6 meses)',
    languageFit: 'C2 Inglés',
    tier: 'TIER 3 · Outbound de Nicho',
    strategicReturn: 'Graduado DE § 20',
    whyScore: 'Cuentas con la credencial verificada de haber testificado ante el Senado y Cámara de Diputados de Chile en leyes de aguas e incendios. Sin embargo, las convocatorias de la ONU y GIZ tardan de 3 a 6 meses en resolverse, por lo que no sirven como ancla a corto plazo.',
    keyTargets: ['GIZ', 'UNCCD Bonn', 'WRI Europe', 'UNEP-WCMC', 'ClientEarth', 'E3G']
  },
  {
    id: 'bench-us-market',
    cluster: 'CARBON_TECH_MRV',
    clusterName: 'Mercado Estados Unidos (US)',
    quadrant: 'CANADA_GLOBAL',
    quadrantName: 'Estados Unidos (Vía H-1B1)',
    prob3m: 14,
    prob6m: 34,
    visaFriction: 'Alta',
    hiringSpeed: 'Lenta (3-6 meses)',
    languageFit: 'C2 Inglés',
    tier: 'TIER 4 · Desaconsejado',
    strategicReturn: 'Riesgo / Descarte',
    whyScore: 'Aunque Chile tiene el tratado exclusivo H-1B1 (1.400 visas sin lotería), el 95% de los filtros de RRHH (ATS) descartan automáticamente a extranjeros que requieren patrocinio. Agencias federales (USGS/NOAA) exigen ciudadanía estadounidense. Contracción de VC en climate-tech.',
    keyTargets: ['Pachama (remoto)', 'Kettle', 'Fervo Energy', 'CTrees']
  },
  {
    id: 'bench-asia-market',
    cluster: 'RD_PUBLIC',
    clusterName: 'Mercado Asia (Singapur, Japón, Sudeste)',
    quadrant: 'GLOBAL',
    quadrantName: 'Asia-Pacífico',
    prob3m: 8,
    prob6m: 19,
    visaFriction: 'Extrema',
    hiringSpeed: 'Lenta (3-6 meses)',
    languageFit: 'Barrera Alta',
    tier: 'TIER 4 · Desaconsejado',
    strategicReturn: 'Riesgo / Descarte',
    whyScore: 'Barrera idiomática severa (japonés N1/N2 indispensable fuera de postdocs precarios aislados). Singapur tiene hubs de carbono pero cuotas locales y coste de vida prohibitivo. Irte a Asia destruye por completo tu acumulación de años de residencia hacia un pasaporte europeo.',
    keyTargets: ['CIFOR-ICRAF (Indonesia - consorcios UE)', 'NUS Singapur', 'NIES Japón']
  }
];

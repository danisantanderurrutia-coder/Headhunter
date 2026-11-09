import React, { useState, useEffect } from 'react';
import { 
  ExternalLink,
  Award,
  TrendingUp,
  Sparkles,
  Target,
  Compass,
  Layers,
  CheckCircle2,
  GraduationCap,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { getStoredOffers, getStoredCourseProgress, setCourseStatus } from '../../services/db';
import { ACADEMY_COURSES } from '../../data/academyCourses';
import type { CourseStatus } from '../../types/academy';
import { resolveAsset } from '../../utils/assets';

export type SkillBranch = 
  | 'geophysics'   // 1. Geofísica & Sensores Remotos (GFP Emerald)
  | 'biogeo'       // 2. Biogeoquímica, Suelos & Agua (CFP Cyan)
  | 'comms'        // 3. Comunicaciones, Prensa & Campañas (Texas Red / mCherry)
  | 'culture'      // 4. Cultura, Comunidades & Políticas (Cy5 Violet)
  | 'grassroots'   // 5. Grassroots, Territorio & Regeneración (Phyto-Lime YFP)
  | 'pm'           // 6. Gestión de Proyectos, I+D & Cooperación (Lucifer Amber)
  | 'software';    // 7. Product Owner, Software & IA (Laser Electric Blue)

export type ProfileArchetype = 
  | 'all'
  | 'rd-scientist'   // Investigador Científico I+D (Helmholtz, UFZ, PIK, BC3, AZTI)
  | 'ai-product'     // AI Product Owner & Climate-Tech Architect
  | 'campaign-lead'  // Director de Campañas & Grassroots
  | 'policy-advisor'; // Consultor en Políticas Ambientales & CSRD

export interface SynergyBridge {
  from: string;
  to: string;
  label: string;
}

export interface CapabilityNode {
  id: string;
  name: string;
  shortName: string;
  level: number; // 1 to 5
  maxLevel: 5;
  status: 'MASTERED' | 'ACTIVE' | 'IN_TRAINING' | 'MARKET_GAP';
  branch: SkillBranch;
  xp: number;
  cx: number;
  cy: number;
  spineOrigin: { x: number; y: number }; // Punto de inserción en la dendrita nodriza
  description: string;
  evidenceTitle: string;
  evidenceAnchor: string;
  archetypes: ProfileArchetype[];
  synergies?: string[];
  isMarketGap?: boolean;
  gapDemand?: string;
  gapImpact?: string;
  gapRoadmap?: string[];
}

export interface SkillTreeTabProps {
  onNavigateToAcademy?: (gapId?: string) => void;
}

export const SkillTreeTab: React.FC<SkillTreeTabProps> = ({ onNavigateToAcademy }) => {
  const offers = getStoredOffers();
  const [courseProgress, setCourseProgressState] = useState(getStoredCourseProgress());

  const handleToggleCourseStatus = (courseId: string, currentStatus: CourseStatus) => {
    const nextStatus: CourseStatus = currentStatus === 'COMPLETED' ? 'AVAILABLE' : currentStatus === 'IN_PROGRESS' ? 'COMPLETED' : 'IN_PROGRESS';
    const nextPercent = nextStatus === 'COMPLETED' ? 100 : nextStatus === 'IN_PROGRESS' ? 50 : 0;
    setCourseStatus(courseId, nextStatus, nextPercent);
    setCourseProgressState({ ...getStoredCourseProgress() });
  };

  // Selected filter mode
  const [filterMode, setFilterMode] = useState<'all' | 'mastered' | 'training' | 'gaps'>('all');

  // Selected Archetype Simulator
  const [selectedArchetype, setSelectedArchetype] = useState<ProfileArchetype>('all');

  // Hovered node for action potential lighting
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Selected node for technical inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string>('n7-wetland');

  // Fullscreen view toggle
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ESC key listener & body scroll lock for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // --------------------------------------------------------------------------
  // LAS 7 ÁREAS PROFESIONALES DE DANIEL SANTANDER
  // --------------------------------------------------------------------------
  const branchStyles: Record<SkillBranch, { 
    color: string; 
    glow: string; 
    label: string; 
    shortLabel: string;
    icon: string;
    bg: string; 
    border: string;
  }> = {
    geophysics: { 
      color: '#10b981', 
      glow: 'rgba(16,185,129,0.5)', 
      label: 'GEOFÍSICA & SENSORES REMOTOS', 
      shortLabel: 'Geofísica',
      icon: '🛰️',
      bg: 'bg-emerald-950/30', 
      border: 'border-emerald-500/40' 
    },
    biogeo: { 
      color: '#06b6d4', 
      glow: 'rgba(6,182,212,0.5)', 
      label: 'BIOGEOQUÍMICA, SUELOS & AGUA', 
      shortLabel: 'Biogeoquímica & Agua',
      icon: '💧',
      bg: 'bg-cyan-950/30', 
      border: 'border-cyan-500/40' 
    },
    comms: { 
      color: '#f97316', 
      glow: 'rgba(249,115,22,0.5)', 
      label: 'COMUNICACIONES, PRENSA & CAMPAÑAS', 
      shortLabel: 'Comunicaciones & Prensa',
      icon: '📢',
      bg: 'bg-orange-950/30', 
      border: 'border-orange-500/40' 
    },
    culture: { 
      color: '#c084fc', 
      glow: 'rgba(192,132,252,0.5)', 
      label: 'CULTURA, COMUNIDADES & POLÍTICAS', 
      shortLabel: 'Cultura & Políticas',
      icon: '🏛️',
      bg: 'bg-purple-950/30', 
      border: 'border-purple-500/40' 
    },
    grassroots: { 
      color: '#a3e635', 
      glow: 'rgba(163,230,53,0.5)', 
      label: 'GRASSROOTS, TERRITORIO & REGENERACIÓN', 
      shortLabel: 'Grassroots & Territorio',
      icon: '🌱',
      bg: 'bg-lime-950/30', 
      border: 'border-lime-500/40' 
    },
    pm: { 
      color: '#fbbf24', 
      glow: 'rgba(251,191,36,0.5)', 
      label: 'GESTIÓN DE PROYECTOS, I+D & COOPERACIÓN', 
      shortLabel: 'Gestión I+D',
      icon: '🧭',
      bg: 'bg-amber-950/30', 
      border: 'border-amber-500/40' 
    },
    software: { 
      color: '#60a5fa', 
      glow: 'rgba(96,165,250,0.5)', 
      label: 'PRODUCT OWNER, SOFTWARE & IA', 
      shortLabel: 'Product Owner & IA',
      icon: '⚡',
      bg: 'bg-blue-950/30', 
      border: 'border-blue-500/40' 
    }
  };

  // --------------------------------------------------------------------------
  // PUENTES DE SINERGIA TRANSDISCIPLINARIOS (AXONES COLATERALES)
  // --------------------------------------------------------------------------
  const synergyBridges: SynergyBridge[] = [
    { from: 'n7-agritwin', to: 'n1-sentinel', label: 'Telemetría de suelo + NDVI Sentinel-2' },
    { from: 'n7-agritwin', to: 'n2-soil-lab', label: 'Sensores de humedad & física de suelo' },
    { from: 'n7-agritwin', to: 'n5-keyline', label: 'Riego y drenaje con hidrología Keyline' },
    { from: 'n7-wetland', to: 'n2-peatlands', label: 'Gemelo digital de turbera Wallener Au' },
    { from: 'n7-wetland', to: 'n2-ghg', label: 'Visualización 3D de flujos Eddy Covariance' },
    { from: 'n7-docker', to: 'n1-gee', label: 'Contenedorización de pipelines GEE' },
    { from: 'n7-rewilding-suite', to: 'n5-rewilding', label: 'PWA de campo en Aljezur (Portugal)' },
    { from: 'n4-congreso', to: 'n5-incendios', label: 'Alegato pericial sobre megaincendios' },
    { from: 'n4-congreso', to: 'n3-plp', label: 'Fiscalización legislativa en medios independientes' },
    { from: 'n4-congreso', to: 'n3-epn-report', label: 'Evidencia técnica de monocultivo & RED III' },
    { from: 'n3-apruebo-rural', to: 'n5-apr', label: 'Articulación con comités de agua potable APR' },
    { from: 'n4-cuarentena-rap', to: 'n7-ai-agents', label: 'Comunidades +12k, Discord bots & agentes' },
    { from: 'n6-consorcios', to: 'n2-peatlands', label: 'Investigación bilateral CAU Kiel & AMU Poznań' },
    { from: 'n6-epn-lead', to: 'n3-epn-report', label: 'Liderazgo de informe internacional EPN' },
    { from: 'n5-permaculture', to: 'n2-hydro', label: 'Líneas clave de infiltración de cuencas' }
  ];

  // --------------------------------------------------------------------------
  // BOTONES SINÁPTICOS & ESPINAS DENDRÍTICAS (40+ NODOS VIVOS)
  // Centro Soma: (440, 270)
  // --------------------------------------------------------------------------
  const rawNodes: CapabilityNode[] = [
    // ========================================================================
    // DENDRITA 1: GEOFÍSICA & SENSORES REMOTOS (GFP Emerald, Top)
    // ========================================================================
    {
      id: 'n1-geo-math',
      name: 'Modelación Geoespacial (R & Python)',
      shortName: 'R & Python',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'geophysics',
      xp: 1000,
      cx: 385,
      cy: 130,
      spineOrigin: { x: 425, y: 165 },
      archetypes: ['rd-scientist', 'ai-product'],
      description: 'Automatización de pipelines espaciales (GeoPandas, Rasterio, GDAL), análisis estadístico multivariable y series temporales biofísicas.',
      evidenceTitle: 'Lámina 002: Smart Food Parks & Teledetección',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n1-sismica',
      name: 'Resistividad Eléctrica de Suelos (SEV)',
      shortName: 'Resistividad SEV',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'geophysics',
      xp: 1000,
      cx: 440,
      cy: 90,
      spineOrigin: { x: 440, y: 135 },
      archetypes: ['rd-scientist'],
      description: 'Sondeos Eléctricos Verticales (SEV) para caracterización de resistividad de suelos y monitoreo del descenso freático en la Cuenca del Maule (U. de Chile).',
      evidenceTitle: 'Lámina 007: Licenciatura en Geofísica (Distinción)',
      evidenceAnchor: '#titulaciones-academicas'
    },
    {
      id: 'n1-qgis',
      name: 'QGIS Avanzado & Cartografía Técnica',
      shortName: 'QGIS Vector',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'geophysics',
      xp: 980,
      cx: 495,
      cy: 130,
      spineOrigin: { x: 455, y: 165 },
      archetypes: ['rd-scientist', 'policy-advisor'],
      description: 'Integración multicriterio de coberturas de suelo, DEMs LiDAR, pendientes topográficas, delimitación de cuencas y riesgo de incendios.',
      evidenceTitle: 'Lámina 003: Modelos Hidrológicos ante Congreso',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'n1-sentinel',
      name: 'Observación Satelital Sentinel-2 & Landsat',
      shortName: 'Sentinel-2',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'geophysics',
      xp: 880,
      cx: 405,
      cy: 48,
      spineOrigin: { x: 428, y: 88 },
      archetypes: ['rd-scientist', 'ai-product'],
      synergies: ['n7-agritwin'],
      description: 'Monitoreo multiespectral de reflectancia de dosel, índices NDVI/NDRE, cálculo de estrés hídrico de vegetación y cicatrices de quema.',
      evidenceTitle: 'Lámina 002: Teledetección & Sensores Satelitales',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n1-gee',
      name: 'Google Earth Engine (Cloud Big Data)',
      shortName: 'GEE Cloud',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'geophysics',
      xp: 850,
      cx: 475,
      cy: 45,
      spineOrigin: { x: 452, y: 88 },
      archetypes: ['rd-scientist', 'ai-product'],
      synergies: ['n7-docker'],
      description: 'Procesamiento masivo de petabytes de datos planetarios en la nube para detección de cambios ambientales y balances hídricos territoriales.',
      evidenceTitle: 'Lámina 006: Modelado Geoespacial & Gemelos Digitales',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'gap-swat',
      name: 'Modelación Hidrológica SWAT+ / Iber',
      shortName: 'SWAT+ Fluvial',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'geophysics',
      xp: 400,
      cx: 545,
      cy: 65,
      spineOrigin: { x: 480, y: 92 },
      archetypes: ['rd-scientist'],
      isMarketGap: true,
      gapDemand: '42% vacantes de modelación de cuencas en DACH (LUBW, BfG) y Euskadi (URA)',
      gapImpact: '+18% coincidencia en vacantes de consultoría hidrológica e institutos',
      description: 'Simulación de transporte de sedimentos, caudales extremos y dinámica fluvial acoplada a SIG.',
      evidenceTitle: 'Extensión Metodológica a Modelos de Transporte Fluvial',
      evidenceAnchor: '#investigacion-cuantitativa',
      gapRoadmap: [
        'Calibrar cuenca piloto en QSWAT+ con datos Sentinel-2 y ERA5',
        'Validar balances hídricos frente a estaciones de aforo oficiales',
        'Publicar mini-estudio reproducible en repositorio abierto'
      ]
    },

    // ========================================================================
    // DENDRITA 2: BIOGEOQUÍMICA, SUELOS & AGUA (CFP Cyan, Top-Right)
    // ========================================================================
    {
      id: 'n2-peatlands',
      name: 'Dinámica de Carbono & Turberas (Wallener Au)',
      shortName: 'Turberas GEI',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'biogeo',
      xp: 1000,
      cx: 565,
      cy: 165,
      spineOrigin: { x: 505, y: 215 },
      archetypes: ['rd-scientist', 'policy-advisor'],
      synergies: ['n7-wetland', 'n6-consorcios'],
      description: 'Tesis de M.Sc. en CAU Kiel: sumideros de carbono, transición sumidero-fuente de CH4, paludicultura y caracterización hidrofísica edáfica.',
      evidenceTitle: 'Lámina 001: Dinámica de GEI en Turberas (Polonia/Alemania)',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-ghg',
      name: 'Flujos de GEI & Eddy Covariance',
      shortName: 'Flujos GEI',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'biogeo',
      xp: 970,
      cx: 640,
      cy: 135,
      spineOrigin: { x: 575, y: 175 },
      archetypes: ['rd-scientist'],
      synergies: ['n7-wetland'],
      description: 'Medición y balance de flujos de CO₂ y CH₄ en turberas rehumedecidas mediante torres de Eddy Covariance y cámaras cerradas (CAU Kiel).',
      evidenceTitle: 'Lámina 001: Modelación Cuantitativa CAU Kiel',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-hydro',
      name: 'Balances Hidrológicos & Limnología (Poznań)',
      shortName: 'Hidrología Poznań',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 890,
      cx: 615,
      cy: 195,
      spineOrigin: { x: 550, y: 210 },
      archetypes: ['rd-scientist'],
      synergies: ['n5-permaculture'],
      description: 'Modelación cuantitativa de escorrentía, balance de fósforo/nitrógeno y dinámica trófica en los lagos Góreckie y Durowskie (Polonia).',
      evidenceTitle: 'Lámina 001: Balances en Lagos Góreckie y Durowskie',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-soil-lab',
      name: 'Física de Suelos & Dinámica Hidrofísica',
      shortName: 'Física de Suelos',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 850,
      cx: 695,
      cy: 155,
      spineOrigin: { x: 635, y: 170 },
      archetypes: ['rd-scientist', 'ai-product'],
      synergies: ['n7-agritwin'],
      description: 'Curvas de retención hídrica, porosidad edáfica y análisis de dinámica hídrica en turberas (CAU Kiel).',
      evidenceTitle: 'Lámina 002: Laboratorio de Suelos CAU Kiel',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n2-water-quality',
      name: 'Directiva Marco del Agua & Bioindicadores UE',
      shortName: 'Directiva Agua',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 860,
      cx: 715,
      cy: 105,
      spineOrigin: { x: 655, y: 135 },
      archetypes: ['rd-scientist', 'policy-advisor'],
      description: 'Evaluación del estado ecológico de masas de agua continentales bajo estándares WFD de la Unión Europea y macroinvertebrados.',
      evidenceTitle: 'Lámina 001: Ecosistemas Acuáticos Poznań',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'gap-soil-directive',
      name: 'EU Soil Monitoring Law (Protocolos 2024)',
      shortName: 'Directiva Suelo UE',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'biogeo',
      xp: 450,
      cx: 775,
      cy: 145,
      spineOrigin: { x: 705, y: 160 },
      archetypes: ['policy-advisor', 'rd-scientist'],
      isMarketGap: true,
      gapDemand: '48% centros de investigación ambiental y consultorías del Green Deal',
      gapImpact: '+24% afinidad en proyectos europeos de resiliencia de suelos',
      description: 'Estandarización de métricas de salud del suelo, compactación y contaminación bajo el nuevo marco regulatorio vinculante de la UE.',
      evidenceTitle: 'Marco Regulatorio Europeo de Salud del Suelo',
      evidenceAnchor: '#investigacion-cuantitativa',
      gapRoadmap: [
        'Completar el módulo oficial de la Comisión Europea sobre Soil Health',
        'Alinear los datos hidrofísicos y de salud del suelo de Wallener Au con los descriptores de la Directiva',
        'Publicar documento de síntesis sobre monitoreo edáfico estandarizado'
      ]
    },

    // ========================================================================
    // DENDRITA 3: COMUNICACIONES & PRENSA (Texas Red / mCherry, Mid-Right)
    // ========================================================================
    {
      id: 'n3-plp',
      name: 'Dirección Editorial: Primera Línea Prensa (+700k)',
      shortName: 'PLP Prensa (+700k)',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'comms',
      xp: 1000,
      cx: 635,
      cy: 265,
      spineOrigin: { x: 550, y: 275 },
      archetypes: ['campaign-lead'],
      synergies: ['n4-congreso'],
      description: 'Fundador y director de medio digital independiente con más de 700.000 seguidores orgánicos. Reportajes de investigación y coberturas en tiempo real.',
      evidenceTitle: 'Prensa Ciudadana: Primera Línea Prensa (+700k)',
      evidenceAnchor: '#primera-linea-prensa'
    },
    {
      id: 'n3-apruebo-rural',
      name: 'Dirección de Campaña Nacional "Apruebo Rural"',
      shortName: 'Apruebo Rural',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'comms',
      xp: 990,
      cx: 705,
      cy: 245,
      spineOrigin: { x: 625, y: 268 },
      archetypes: ['campaign-lead'],
      synergies: ['n5-apr'],
      description: 'Dirección general de campaña transmedia de alcance nacional: movilización campesina, webinars cívicos masivos y combate a la desinformación en el agro.',
      evidenceTitle: 'Campaña Nacional: Apruebo Rural Transmedia',
      evidenceAnchor: '#apruebo-rural'
    },
    {
      id: 'n3-epn-report',
      name: 'Periodismo de Datos & Biomasa Forestal (EPN)',
      shortName: 'Informe EPN RED III',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'comms',
      xp: 940,
      cx: 685,
      cy: 315,
      spineOrigin: { x: 620, y: 288 },
      archetypes: ['campaign-lead', 'policy-advisor'],
      synergies: ['n4-congreso', 'n6-epn-lead'],
      description: 'Autor técnico principal del informe "Spotlight on Burning Biomass" para Environmental Paper Network y Global Forest Coalition sobre vacíos en RED III.',
      evidenceTitle: 'Lámina 004: Informe EPN Biomasa & Taxonomía UE',
      evidenceAnchor: '#publicaciones-tecnicas'
    },
    {
      id: 'n3-maule-radio',
      name: 'Red Comunitaria Maule Sur & Radio Cristalina',
      shortName: 'Radio Comunitaria',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'comms',
      xp: 880,
      cx: 765,
      cy: 280,
      spineOrigin: { x: 690, y: 282 },
      archetypes: ['campaign-lead'],
      description: 'Locución en vivo, vocería técnica y diseño de la plataforma digital para alertas tempranas de emergencia rural y noticias locales.',
      evidenceTitle: 'Red de Medios Comunitaria Maule Sur',
      evidenceAnchor: '#primera-linea-prensa'
    },
    {
      id: 'gap-media-b2b',
      name: 'Media Relations B2B & Lobbying Científico en Europa',
      shortName: 'B2B Media UE',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'comms',
      xp: 420,
      cx: 810,
      cy: 335,
      spineOrigin: { x: 745, y: 315 },
      archetypes: ['campaign-lead', 'policy-advisor'],
      isMarketGap: true,
      gapDemand: '35% ONGs internacionales y consorcios de incidencia en Bruselas y Berlín',
      gapImpact: '+20% proyección en roles de relaciones públicas científicas',
      description: 'Articulación de notas de prensa institucionales para agencias alemanas y redes de periodismo ambiental europeo.',
      evidenceTitle: 'Consolidación de Relaciones con Medios en DACH',
      evidenceAnchor: '#publicaciones-tecnicas',
      gapRoadmap: [
        'Mapear bases de datos de periodistas ambientales en Alemania y Bruselas',
        'Redactar un policy brief bilingüe (EN/DE) sobre contabilidad de carbono',
        'Establecer contacto con redes como Clean Energy Wire (CLEW)'
      ]
    },

    // ========================================================================
    // DENDRITA 4: CULTURA, COMUNIDADES & POLÍTICAS (Cy5 Violet, Bottom-Right)
    // ========================================================================
    {
      id: 'n4-congreso',
      name: 'Comparecencia Pericial ante el Congreso Nacional',
      shortName: 'Congreso Nacional',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'culture',
      xp: 1000,
      cx: 575,
      cy: 385,
      spineOrigin: { x: 505, y: 325 },
      archetypes: ['policy-advisor', 'campaign-lead'],
      synergies: ['n5-incendios', 'n3-plp', 'n3-epn-report'],
      description: 'Exposición como perito técnico ante la Comisión de Emergencia, Desastres y Bomberos de la Cámara de Diputadas y Diputados de Chile.',
      evidenceTitle: 'Lámina 003: Comparecencia en Cámara de Diputados',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'n4-cuarentena-rap',
      name: 'Comunidades Digitales: Cuarentena Rap (+12k)',
      shortName: 'Discord (+12k)',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'culture',
      xp: 970,
      cx: 645,
      cy: 405,
      spineOrigin: { x: 565, y: 360 },
      archetypes: ['campaign-lead', 'ai-product'],
      synergies: ['n7-ai-agents'],
      description: 'Arquitectura de comunidad digital en Discord y Twitch durante la pandemia: +12.000 miembros activos en 8 países, bots de matchmaking y baja latencia de audio.',
      evidenceTitle: 'Cultura & Comunidad: Cuarentena Rap (+12k)',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'n4-rap-beauchef',
      name: 'Producción Ejecutiva: Rap Beauchef',
      shortName: 'Rap Beauchef',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'culture',
      xp: 950,
      cx: 600,
      cy: 455,
      spineOrigin: { x: 535, y: 395 },
      archetypes: ['campaign-lead'],
      description: 'Producción de eventos en vivo, ingeniería de sonido en anfiteatros de la Universidad de Chile, gestión de auspicios y ligas universitarias de hip-hop.',
      evidenceTitle: 'Producción Cultural: Rap Beauchef U. de Chile',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'n4-languages',
      name: 'Dominio Lingüístico: ES (Nativo), EN (C2 Bilingüe), DE (B1/B2)',
      shortName: 'Idiomas Nativo/C2/B2',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'culture',
      xp: 980,
      cx: 675,
      cy: 465,
      spineOrigin: { x: 595, y: 415 },
      archetypes: ['rd-scientist', 'policy-advisor', 'campaign-lead'],
      description: 'Español nativo (oratoria parlamentaria), Inglés bilingüe profesional C2 (CEMS, ponencias y publicaciones internacionales) y Alemán académico B1-B2 (§20 AufenthG).',
      evidenceTitle: 'Lámina 005: Conferencias Bonn, Oslo y Bogotá',
      evidenceAnchor: '#conferencias-internacionales'
    },
    {
      id: 'n4-artivismo',
      name: 'Agitación Gráfica & Xilografía Popular',
      shortName: 'Xilografía & Murales',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'culture',
      xp: 880,
      cx: 535,
      cy: 470,
      spineOrigin: { x: 485, y: 405 },
      archetypes: ['campaign-lead'],
      description: 'Grabado en linóleo, cartelería de memoria histórica y muralismo con la Brigada Paulina Aguirre por la defensa de los derechos del agua y la tierra.',
      evidenceTitle: 'Artivismo & Memoria Popular',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'gap-de-c1',
      name: 'Alemán Profesional C1 (Fachsprache Geodaten)',
      shortName: 'Deutsch C1 Beruf',
      level: 3,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'culture',
      xp: 620,
      cx: 735,
      cy: 490,
      spineOrigin: { x: 655, y: 445 },
      archetypes: ['rd-scientist', 'policy-advisor'],
      isMarketGap: true,
      gapDemand: '60% plazas públicas permanentes en DACH (BfG, UBA, LfU)',
      gapImpact: '+35% probabilidad de contratación directa como funcionario/científico permanente',
      description: 'Vocabulario jurídico-ambiental de licitaciones públicas (VOL/VOB) y redacción técnica formal en instituciones federales alemanas.',
      evidenceTitle: 'Consolidación Lingüística para Plazas Permanentes (§20 AufenthG)',
      evidenceAnchor: '#titulaciones-academicas',
      gapRoadmap: [
        'Estudio sistemático de pliegos técnicos VOL/VOB en portales Bund.de',
        'Simulación de entrevistas técnicas en alemán para institutos públicos',
        'Certificación Telc C1 Hochschule / Goethe C1'
      ]
    },
    {
      id: 'gap-csrd',
      name: 'Auditoría de Carbono Corporativo & CSRD',
      shortName: 'CSRD Scope 1-3',
      level: 3,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'culture',
      xp: 550,
      cx: 630,
      cy: 505,
      spineOrigin: { x: 575, y: 440 },
      archetypes: ['policy-advisor'],
      isMarketGap: true,
      gapDemand: '50% ofertas de consultoría ambiental en Euskadi y DACH',
      gapImpact: '+25% rango salarial en consultoría de transición ecológica',
      description: 'Cálculo y auditoría de huella de carbono bajo estándares GHG Protocol y directiva europea CSRD (normas ESRS E1).',
      evidenceTitle: 'Transición de Huella Científica a Auditoría Corporativa',
      evidenceAnchor: '#publicaciones-tecnicas',
      gapRoadmap: [
        'Completar capacitación en estándares ESRS E1 del GHG Protocol',
        'Crear plantilla automatizada en Python para reporte de Alcance 1, 2 y 3',
        'Elaborar estudio de caso de descarbonización para pymes industriales'
      ]
    },

    // ========================================================================
    // DENDRITA 5: GRASSROOTS, TERRITORIO & REGENERACIÓN (Phyto-Lime, Bottom-Left)
    // ========================================================================
    {
      id: 'n5-incendios',
      name: 'Respuesta Operativa ante Megaincendios',
      shortName: 'Respuesta Incendios',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'grassroots',
      xp: 1000,
      cx: 315,
      cy: 385,
      spineOrigin: { x: 375, y: 325 },
      archetypes: ['campaign-lead'],
      synergies: ['n4-congreso'],
      description: 'Despliegue territorial directo en la zona centro-sur (Maule y Biobío): articulación de brigadas comunitarias, centros de acopio y ayuda mutua.',
      evidenceTitle: 'Catástrofes & Solidaridad: Respuesta ante Megaincendios',
      evidenceAnchor: '#catastrofes-solidaridad'
    },
    {
      id: 'n5-apr',
      name: 'Articulación con Comités de Agua Potable Rural (APR)',
      shortName: 'Comités APR Agua',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'grassroots',
      xp: 970,
      cx: 245,
      cy: 405,
      spineOrigin: { x: 325, y: 350 },
      archetypes: ['campaign-lead', 'policy-advisor'],
      synergies: ['n3-apruebo-rural'],
      description: 'Acompañamiento técnico a asambleas hídricas campesinas frente a la sequía, el desvío de cauces y el impacto de las plantaciones forestales.',
      evidenceTitle: 'Lámina 003: Salvaguardas & Comités de Agua Potable',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'n5-permaculture',
      name: 'Diseño en Permacultura Certificado (EPAC, 80 h)',
      shortName: 'Permacultura EPAC',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'grassroots',
      xp: 920,
      cx: 290,
      cy: 455,
      spineOrigin: { x: 345, y: 395 },
      archetypes: ['rd-scientist', 'campaign-lead'],
      synergies: ['n2-hydro'],
      description: 'Certificación oficial de diseño regenerativo: zonificación biofísica, captura hídrica pasiva, agroforestería sintrópica y suelos vivos.',
      evidenceTitle: 'Curso Certificado de Diseño en Permacultura (EPAC Chile)',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n5-keyline',
      name: 'Diseño Hidrológico Keyline & Zanjas de Infiltración',
      shortName: 'Keyline Cuencas',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'grassroots',
      xp: 890,
      cx: 215,
      cy: 465,
      spineOrigin: { x: 285, y: 415 },
      archetypes: ['rd-scientist', 'ai-product'],
      synergies: ['n7-agritwin'],
      description: 'Ingeniería de líneas clave topográficas para redistribución de agua de escorrentía hacia laderas secas y recarga natural de acuíferos.',
      evidenceTitle: 'Diseño Hidrológico Keyline y Restauración de Cuencas',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n5-rewilding',
      name: 'Restauración Ecológica & Rewilding (Aljezur, Portugal)',
      shortName: 'Rewilding Aljezur',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'grassroots',
      xp: 870,
      cx: 355,
      cy: 470,
      spineOrigin: { x: 395, y: 405 },
      archetypes: ['rd-scientist', 'policy-advisor'],
      synergies: ['n7-rewilding-suite'],
      description: 'Estrategias de regeneración biofísica en cuencas mediterráneas portuguesas: mosaicos nativos cortafuegos y reducción de combustible forestal.',
      evidenceTitle: 'Lámina 004: Rewilding Aljezur (Portugal)',
      evidenceAnchor: '#publicaciones-tecnicas'
    },
    {
      id: 'gap-grassroots-funds',
      name: 'Gestión de Fondos Filantrópicos & Cooperación Internacional',
      shortName: 'Fondos Grassroots',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'grassroots',
      xp: 440,
      cx: 155,
      cy: 490,
      spineOrigin: { x: 235, y: 445 },
      archetypes: ['campaign-lead'],
      isMarketGap: true,
      gapDemand: '40% redes de solidaridad climática y fondos de justicia ambiental',
      gapImpact: '+22% autonomía en financiamiento de iniciativas comunitarias',
      description: 'Postulación a subvenciones internacionales de fundaciones filantrópicas (Patagonia Action Works, Global Greengrants Fund, Rainforest Action).',
      evidenceTitle: 'Financiamiento y Sostenibilidad de Redes Comunitarias',
      evidenceAnchor: '#gobernanza-politicas',
      gapRoadmap: [
        'Estructurar banco de proyectos comunitarios con métricas de impacto territorial',
        'Mapear convocatorias activas de fondos filantrópicos globales para el Sur Global',
        'Enviar propuesta piloto para fondos de restauración de cuencas comunitarias'
      ]
    },

    // ========================================================================
    // DENDRITA 6: GESTIÓN DE PROYECTOS, I+D & COOPERACIÓN (Lucifer Amber, Mid-Left)
    // ========================================================================
    {
      id: 'n6-consorcios',
      name: 'Coordinación de Consorcios I+D Internacionales',
      shortName: 'Consorcios I+D',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'pm',
      xp: 1000,
      cx: 245,
      cy: 265,
      spineOrigin: { x: 335, y: 275 },
      archetypes: ['rd-scientist', 'ai-product'],
      synergies: ['n2-peatlands'],
      description: 'Liderazgo y articulación de proyectos de investigación entre instituciones de Alemania (CAU Kiel), Polonia (AMU Poznań) y Chile (U. de Chile).',
      evidenceTitle: 'Lámina 007: Doble M.Sc. Internacional en Gestión Ambiental',
      evidenceAnchor: '#titulaciones-academicas'
    },
    {
      id: 'n6-epn-lead',
      name: 'Liderazgo de Proyecto Internacional EPN',
      shortName: 'Liderazgo EPN',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'pm',
      xp: 960,
      cx: 175,
      cy: 245,
      spineOrigin: { x: 265, y: 268 },
      archetypes: ['rd-scientist', 'policy-advisor', 'campaign-lead'],
      synergies: ['n3-epn-report'],
      description: 'Gestión de investigación transnacional con la coalición global Environmental Paper Network: coordinación de autores, revisión por pares y publicación.',
      evidenceTitle: 'Lámina 004: Informe EPN Biomasa & Taxonomía UE',
      evidenceAnchor: '#publicaciones-tecnicas'
    },
    {
      id: 'n6-supervision',
      name: 'Planificación de Hitos Científicos & Entregables',
      shortName: 'Hitos & Entregables',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'pm',
      xp: 880,
      cx: 195,
      cy: 315,
      spineOrigin: { x: 260, y: 288 },
      archetypes: ['rd-scientist', 'ai-product'],
      description: 'Control riguroso de cronogramas, aseguramiento de calidad de datos experimentales de campo y presentación ante comités evaluadores.',
      evidenceTitle: 'Lámina 006: Liderazgo e Innovación Científica',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'gap-pm2',
      name: 'Metodología PM² de la Comisión Europea / PRINCE2',
      shortName: 'Metodología PM²',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'pm',
      xp: 430,
      cx: 115,
      cy: 285,
      spineOrigin: { x: 190, y: 282 },
      archetypes: ['rd-scientist', 'ai-product'],
      isMarketGap: true,
      gapDemand: '55% puestos de Project Manager en consorcios europeos y centros tecnológicos',
      gapImpact: '+28% elegibilidad para liderar paquetes de trabajo en Horizonte Europa',
      description: 'Estándar metodológico oficial de gestión de proyectos de la UE: gobernanza, gestión de riesgos, artefactos y fases del ciclo de vida.',
      evidenceTitle: 'Certificación en Gestión de Proyectos Europeos',
      evidenceAnchor: '#liderazgo-innovacion',
      gapRoadmap: [
        'Completar el curso oficial gratuito de PM² Essentials en EU Academy',
        'Estudiar la Guía Metodológica Abierta PM² de la Comisión Europea',
        'Obtener la certificación abierta PM² Foundation'
      ]
    },
    {
      id: 'gap-horizon',
      name: 'Redacción de Propuestas Horizon Europe (Grant Writing)',
      shortName: 'Horizonte Europa',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'pm',
      xp: 460,
      cx: 70,
      cy: 335,
      spineOrigin: { x: 135, y: 315 },
      archetypes: ['rd-scientist'],
      isMarketGap: true,
      gapDemand: '62% institutos de investigación (Helmholtz, Max Planck, Tecnalia, BC3)',
      gapImpact: '+32% valor estratégico para instituciones al atraer financiación pública',
      description: 'Estructuración de propuestas competitivas: excelencia científica, impacto de mercado, plan de difusión y paquetes de trabajo (Work Packages).',
      evidenceTitle: 'Especialización en Formulación de Proyectos Europeos',
      evidenceAnchor: '#liderazgo-innovacion',
      gapRoadmap: [
        'Analizar plantillas estándar de Horizonte Europa para consorcios RIA e IA',
        'Diseñar propuesta simulada de consorcio para monitoreo de humedales con IA',
        'Revisar convocatorias activas en el Funding & Tenders Portal de la UE'
      ]
    },

    // ========================================================================
    // DENDRITA 7: PRODUCT OWNER, SOFTWARE & IA (Laser Electric Blue, Top-Left)
    // ========================================================================
    {
      id: 'n7-wetland',
      name: 'Wetland Monitor: Gemelo Digital 3D (WebGL / Three.js)',
      shortName: 'Wetland Monitor',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'software',
      xp: 1000,
      cx: 315,
      cy: 165,
      spineOrigin: { x: 375, y: 215 },
      archetypes: ['ai-product', 'rd-scientist'],
      synergies: ['n2-peatlands', 'n2-ghg'],
      description: 'Arquitectura y desarrollo de aplicación web 3D interactiva que simula la hidrología y los flujos de GEI de Wallener Au en tiempo real.',
      evidenceTitle: 'Lámina 006: Gemelo Digital Wetland Monitor 3D',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'n7-agritwin',
      name: 'AgriTwin: Gemelo Digital Agrícola',
      shortName: 'AgriTwin Maule',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'software',
      xp: 990,
      cx: 240,
      cy: 135,
      spineOrigin: { x: 305, y: 175 },
      archetypes: ['ai-product'],
      synergies: ['n1-sentinel', 'n2-soil-lab', 'n5-keyline'],
      description: 'Integración de telemetría de humedad de suelo en tiempo real con índices satelitales Sentinel-2 (NDVI/NDRE) en viñedos del Maule.',
      evidenceTitle: 'Lámina 006: Chile Agrotech & Plataforma AgriTwin',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'n7-rewilding-suite',
      name: 'Rewilding Field Suite: PWA Offline-First (IndexedDB)',
      shortName: 'Field Suite PWA',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'software',
      xp: 960,
      cx: 265,
      cy: 195,
      spineOrigin: { x: 330, y: 210 },
      archetypes: ['ai-product', 'rd-scientist'],
      synergies: ['n5-rewilding'],
      description: 'PWA de campo con almacenamiento local sin conexión (IndexedDB), capas GIS integradas y cálculo de biomasa para rewilding en Aljezur (Portugal).',
      evidenceTitle: 'Software Ambiental: Rewilding Field Suite (Portugal)',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'n7-fastapi-postgis',
      name: 'FastAPI, PostgreSQL & PostGIS Geo-Bases',
      shortName: 'FastAPI & PostGIS',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'software',
      xp: 880,
      cx: 185,
      cy: 155,
      spineOrigin: { x: 245, y: 170 },
      archetypes: ['ai-product'],
      description: 'Desarrollo de microservicios asíncronos REST para consulta espacial indexada, filtrado poligonal y servicio de capas GeoTIFF y GeoJSON.',
      evidenceTitle: 'Stack de Programación & Software Espacial (Portafolio)',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n7-docker',
      name: 'Docker & CI/CD para Modelación Geoespacial',
      shortName: 'Docker 90%',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'software',
      xp: 940,
      cx: 165,
      cy: 105,
      spineOrigin: { x: 225, y: 135 },
      archetypes: ['ai-product', 'rd-scientist'],
      synergies: ['n1-gee'],
      description: 'Microservicios reproducibles, imágenes CI/CD automatizadas en GitHub Actions y contenedorización de modelos numéricos y teledetección.',
      evidenceTitle: 'Stack Tecnológico: Docker (90% en Portafolio)',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n7-ai-agents',
      name: 'Ingeniería de Sistemas de IA & Headhunter OS',
      shortName: 'Agentes IA / OS',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'software',
      xp: 900,
      cx: 215,
      cy: 60,
      spineOrigin: { x: 275, y: 115 },
      archetypes: ['ai-product'],
      synergies: ['n4-cuarentena-rap'],
      description: 'Diseño de agentes de inteligencia corporativa, parsers locales de expedientes y algoritmos de cruce curricular con privacidad total (localStorage).',
      evidenceTitle: 'Headhunter OS: Inteligencia de Postulación & IA',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'gap-pspo-ai',
      name: 'Certificación PSPO I Scrum & AI Systems Evaluation',
      shortName: 'Product Owner IA',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'software',
      xp: 450,
      cx: 105,
      cy: 145,
      spineOrigin: { x: 175, y: 160 },
      archetypes: ['ai-product'],
      isMarketGap: true,
      gapDemand: '58% startups de Climate-Tech y agencias de software de IA en DACH y Euskadi',
      gapImpact: '+25% credibilidad formal como Technical Product Owner',
      description: 'Gestión ágil de backlog de producto, métricas de valor de usuario y protocolos de evaluación y observabilidad de agentes de IA.',
      evidenceTitle: 'Especialización en Gestión de Producto de IA',
      evidenceAnchor: '#liderazgo-innovacion',
      gapRoadmap: [
        'Aprobar el Open Assessment de Scrum.org para Product Owner',
        'Obtener la credencial oficial PSPO I (Professional Scrum Product Owner)',
        'Implementar marco de evaluación de agentes en un repositorio público'
      ]
    }
  ];

  // Dynamically augment market gap nodes based on user progress in Academy courses
  const nodes: CapabilityNode[] = rawNodes.map(node => {
    if (!node.isMarketGap) return node;
    const linkedCourses = ACADEMY_COURSES.filter(c => c.gapId === node.id);
    if (linkedCourses.length === 0) return node;

    const completed = linkedCourses.filter(c => courseProgress[c.id]?.status === 'COMPLETED');
    const inProgress = linkedCourses.filter(c => courseProgress[c.id]?.status === 'IN_PROGRESS');

    const bonusXP = linkedCourses.reduce((sum, c) => {
      const p = courseProgress[c.id];
      if (p?.status === 'COMPLETED') return sum + c.xpValue;
      if (p?.status === 'IN_PROGRESS') return sum + Math.round((c.xpValue * (p.progressPercent || 25)) / 100);
      return sum;
    }, 0);

    if (completed.length === linkedCourses.length && linkedCourses.length > 0) {
      return {
        ...node,
        xp: Math.min(1000, node.xp + bonusXP),
        level: 5 as const,
        status: 'MASTERED' as const
      };
    } else if (completed.length > 0 || inProgress.length > 0) {
      return {
        ...node,
        xp: Math.min(950, node.xp + bonusXP),
        level: (completed.length > 0 ? 4 : 3) as any,
        status: 'IN_TRAINING' as const
      };
    }
    return node;
  });

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const currentBranchStyle = branchStyles[selectedNode.branch];

  // Active synergy links when hovering or selecting a node (for SVG visualization only)
  const activeFocusId = hoveredNodeId || selectedNodeId;
  const activeSynergies = synergyBridges.filter(
    b => b.from === activeFocusId || b.to === activeFocusId
  );
  const activeSynergyNodeIds = new Set([
    ...activeSynergies.map(s => s.from),
    ...activeSynergies.map(s => s.to)
  ]);

  // Stable synergies for the selected node (used in inspector to prevent layout reflow on hover)
  const selectedSynergies = synergyBridges.filter(
    b => b.from === selectedNode.id || b.to === selectedNode.id
  );

  // Counts for filter pills
  const totalCount = nodes.length;
  const masteredCount = nodes.filter(n => n.status === 'MASTERED').length;
  const trainingCount = nodes.filter(n => n.status === 'ACTIVE' || n.status === 'IN_TRAINING').length;
  const rawGapsCount = rawNodes.filter(n => n.isMarketGap).length;
  const remainingGapsCount = nodes.filter(n => n.isMarketGap && n.status === 'MARKET_GAP').length;
  const closedGapsCount = rawGapsCount - remainingGapsCount;
  const gapsCount = rawGapsCount;

  // Archetype Data for Dynamic Fit
  const archetypeDefinitions = {
    all: {
      name: 'Todos los Dominios',
      match: '100% Cobertura',
      description: 'Vista holística transdisciplinaria de las 7 áreas estratégicas y sus sinergias operativas.',
      targets: 'Institutos de I+D, Centros Tecnológicos, Startups de Impacto, Agencias Públicas'
    },
    'rd-scientist': {
      name: 'Investigador Científico I+D',
      match: '92% Afinidad',
      description: 'Modelación biofísica, balance de GEI en turberas, resistividad ERT, limnología y publicaciones.',
      targets: 'Helmholtz GFZ, UFZ Leipzig, BC3 Basque Centre, AZTI, Thünen Institut'
    },
    'ai-product': {
      name: 'AI Product Owner & Climate-Tech',
      match: '88% Afinidad',
      description: 'Gemelos digitales 3D, telemetría IoT de suelos, APIs geoespaciales, Docker y agentes de IA.',
      targets: 'Startups de Clima en Berlín/Munich, Tecnalia, Euskadi Digital, Agrotech Europa'
    },
    'campaign-lead': {
      name: 'Director de Campañas & Grassroots',
      match: '95% Afinidad',
      description: 'Dirección de medios masivos (+700k), movilización campesina, comités de agua APR y territorio.',
      targets: 'Coaliciones Europeas (EPN), Fondos de Justicia Climática, Redes Territoriales'
    },
    'policy-advisor': {
      name: 'Consultor en Políticas & CSRD',
      match: '86% Afinidad',
      description: 'Directivas europeas (RED III, Suelo), auditoría corporativa, salvaguardias y comparecencia legislativa.',
      targets: 'Consultoras de Transición Energética, Agencias Ambientales Estatales, Think Tanks'
    }
  };

  const currentArchetypeInfo = archetypeDefinitions[selectedArchetype];

  return (
    <div className="space-y-5 text-[var(--text-primary)] font-sans animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. TOP BANNER: 7 DOMINIOS TRANSDISCIPLINARIOS DE DANIEL SANTANDER
       * ========================================================================= */}
      <div 
        className="p-5 rounded-2xl border shadow-2xl relative overflow-hidden transition-colors"
        style={{ 
          backgroundColor: '#03050c', 
          borderColor: 'rgba(255, 255, 255, 0.12)' 
        }}
      >
        {/* Soft bioluminescent optical background fog */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>MAPA DE COMPETENCIAS // 7 ÁREAS PROFESIONALES</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {nodes.length} COMPETENCIAS AUDITADAS • NÚCLEO TRANSDISCIPLINARIO
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span>Árbol de Aptitudes & Red Sináptica Viva</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Mapeo integral de tus 7 áreas profesionales: <strong>Geofísica & Sensores</strong>, <strong>Biogeoquímica & Suelos</strong>, <strong>Product Owner & Software</strong>, <strong>Gestión de Consorcios I+D</strong>, <strong>Grassroots & Territorio</strong>, <strong>Cultura & Políticas</strong>, y <strong>Comunicaciones & Prensa</strong>.
            </p>
          </div>

          {/* Incandescent Core Telemetry Badge & Academy Shortcut */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {onNavigateToAcademy && (
              <button
                onClick={() => onNavigateToAcademy()}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg border border-cyan-400/40 cursor-pointer"
                title="Abrir el Radar de Cursos & Certificaciones para cerrar brechas"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Radar Academy</span>
                <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[9.5px] border border-cyan-300/40">
                  {closedGapsCount}/{gapsCount} cerradas
                </span>
              </button>
            )}

            <div 
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl border shrink-0 backdrop-blur-md shadow-2xl"
              style={{ 
                backgroundColor: '#060a17', 
                borderColor: 'rgba(251, 191, 36, 0.4)' 
              }}
            >
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-400/30 to-red-500/30 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                <Compass className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <div className="text-[9px] text-amber-400 font-mono font-bold uppercase tracking-wider">NÚCLEO PROFESIONAL</div>
                <div className="text-xs font-black text-white">DANIEL SANTANDER URRUTIA</div>
                <div className="text-[9.5px] text-slate-400 font-mono">Doble M.Sc. Kiel/Poznań • Geofísica U. de Chile</div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Readiness Status */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>ESTADO DE COMPETENCIAS: <strong className="text-white font-bold">{masteredCount + trainingCount} de {totalCount} Acreditadas</strong> ({Math.round(((masteredCount + trainingCount) / totalCount) * 100)}% de Cobertura Profesional)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-bold">{masteredCount} Consolidadas (Senior)</span>
            <span>•</span>
            <span className="text-sky-400 font-bold">{trainingCount} En Ejercicio Directo</span>
            <span>•</span>
            <span className="text-rose-400 font-bold">{remainingGapsCount} Brechas Prioritarias</span>
          </div>
        </div>

        {/* =====================================================================
         * 2. ARCHETYPE MATRIX SIMULATOR (CALIBRACIÓN POR ROL PROFESIONAL)
         * ===================================================================== */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1 flex items-center gap-1">
              <Target className="h-3 w-3 text-cyan-400" />
              <span>SIMULADOR DE ROL PROFESIONAL:</span>
            </span>

            {[
              { id: 'all', label: 'Todas las Áreas', icon: '🌐' },
              { id: 'rd-scientist', label: 'Investigador I+D (Helmholtz/BC3)', icon: '🔬' },
              { id: 'ai-product', label: 'AI Product Owner & Climate-Tech', icon: '⚡' },
              { id: 'campaign-lead', label: 'Dirección de Campañas & Grassroots', icon: '📢' },
              { id: 'policy-advisor', label: 'Consultor Políticas & CSRD', icon: '🏛️' }
            ].map(arch => (
              <button
                key={arch.id}
                onClick={() => setSelectedArchetype(arch.id as ProfileArchetype)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedArchetype === arch.id
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-black shadow-lg shadow-amber-500/30 border border-amber-300 font-black'
                    : 'bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                <span>{arch.icon}</span>
                <span>{arch.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Match readout badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[11px] px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 shrink-0">
            <span className="text-slate-400">Afinidad con Perfil:</span>
            <span className="text-amber-400 font-bold">{currentArchetypeInfo.match}</span>
          </div>
        </div>

        {/* Filter Pills Bar (Mastered / Training / Gaps) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/10 text-[11px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mr-1">
              FILTRAR ESTADO:
            </span>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'all'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <span>Todas</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30">{totalCount}</span>
            </button>

            <button
              onClick={() => setFilterMode('mastered')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'mastered'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <span>Consolidadas (Senior)</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30">{masteredCount}</span>
            </button>

            <button
              onClick={() => setFilterMode('training')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'training'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <span>En Ejercicio Directo</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/30">{trainingCount}</span>
            </button>

            <button
              onClick={() => {
                setFilterMode('gaps');
                setSelectedNodeId('gap-swat');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'gaps'
                  ? 'bg-rose-600 text-white shadow ring-2 ring-rose-500/50'
                  : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
              }`}
            >
              <span>Brechas de Mercado</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-600 text-white font-extrabold">{gapsCount}</span>
            </button>
          </div>

          <div className="text-[10px] font-mono text-amber-400 italic hidden md:inline-block">
            * Pasa el cursor por cualquier nodo para ver los puentes de sinergia entre disciplinas
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 3. MAIN MICROSCOPY CANVAS: THE LIVING CONFOCAL NEURON
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT CANVAS: CONFOCAL FLUORESCENCE STAGE (8 COLS) */}
        <div 
          className={
            isFullscreen 
              ? "fixed inset-0 z-50 p-4 sm:p-6 bg-[#020409] flex flex-col justify-between overflow-hidden shadow-2xl"
              : "lg:col-span-8 p-3 rounded-2xl border shadow-2xl relative overflow-hidden transition-colors"
          }
          style={{ 
            backgroundColor: '#020409', 
            borderColor: 'rgba(255, 255, 255, 0.15)' 
          }}
        >
          {/* Cosmic-Neural Deep Space Wallpaper (Universe meets Neurons - High-Def Art) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src={resolveAsset('backgrounds/cosmic-neural-bg.jpg')}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center select-none filter contrast-125 brightness-105 opacity-80"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('.png')) {
                  target.src = resolveAsset('backgrounds/cosmic-neural-bg.png');
                }
              }}
            />
            {/* Cinematic dark vignette over the edges of the microscope stage */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(3, 7, 18, 0.25) 0%, rgba(2, 4, 9, 0.85) 90%)',
              }}
            />
          </div>

          {/* Areas Legend Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 border-b border-white/10 pb-2 mb-2 text-[9.5px] font-mono backdrop-blur-sm bg-black/40 px-2 py-1.5 rounded-lg">
            <span className="text-slate-300 font-bold uppercase tracking-wider">7 ÁREAS PROFESIONALES:</span>
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(branchStyles) as SkillBranch[]).map(b => (
                <span 
                  key={b} 
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/50 border border-white/10 font-bold"
                  style={{ color: branchStyles[b].color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_6px_currentColor]" style={{ backgroundColor: branchStyles[b].color }} />
                  <span>{branchStyles[b].icon} {branchStyles[b].shortLabel}</span>
                </span>
              ))}
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>⚡ Brecha (Gap)</span>
              </span>

              {/* Botón Pantalla Completa */}
              <button
                type="button"
                onClick={() => setIsFullscreen(prev => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-bold transition shadow cursor-pointer text-xs ml-auto sm:ml-2 ${
                  isFullscreen 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-1 ring-white/30' 
                    : 'bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-400/40 hover:text-white'
                }`}
                title={isFullscreen ? 'Salir de pantalla completa (ESC)' : 'Expandir mapa a pantalla completa'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>Salir (ESC)</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Pantalla Completa</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SVG Biological Confocal Microscope Stage */}
          <div className={`relative z-10 w-full ${isFullscreen ? 'flex-1 flex items-center justify-center min-h-0 overflow-hidden my-auto' : 'overflow-x-auto'}`}>
            <svg 
              viewBox="0 0 880 540" 
              className={isFullscreen ? "w-full max-h-[calc(100vh-140px)] h-auto select-none rounded-xl" : "w-full min-w-[780px] h-auto select-none rounded-xl"}
              style={{ backgroundColor: 'transparent' }}
            >
              <defs>
                {/* Embedded Confocal Vignette Gradient */}
                <radialGradient id="confocalVignette" cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="65%" stopColor="#020408" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#020408" stopOpacity="0.82" />
                </radialGradient>

                {/* Incandescent Soma Thermal Bloom (White-Hot Center -> Orange Corona -> Outer Fog) */}
                <radialGradient id="somaThermalCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="25%" stopColor="#fffbeb" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.85" />
                  <stop offset="75%" stopColor="#dc2626" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="somaAtmosphereGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                  <stop offset="40%" stopColor="#f97316" stopOpacity="0.15" />
                  <stop offset="70%" stopColor="#6366f1" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>

                {/* Confocal Optical Bloom Filter */}
                <filter id="confocalGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur1" />
                  <feGaussianBlur stdDeviation="7" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Neuropil Micro-Spine Pattern for Depth of Field */}
                <pattern id="neuropilMesh" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 20 Q 20 0 40 20 T 80 20" fill="none" stroke="#6366f1" strokeWidth="0.3" strokeOpacity="0.08" />
                  <path d="M 20 0 Q 0 20 20 40 T 20 80" fill="none" stroke="#06b6d4" strokeWidth="0.3" strokeOpacity="0.06" />
                </pattern>
              </defs>

              {/* High-Definition SVG Cosmic Neural Web (locked 1:1 to coordinate viewBox) */}
              <image 
                href={resolveAsset('backgrounds/cosmic-neural-bg.jpg')} 
                x="0" 
                y="0" 
                width="880" 
                height="540" 
                preserveAspectRatio="xMidYMid slice" 
                opacity="0.6" 
              />
              <rect 
                x="0" 
                y="0" 
                width="880" 
                height="540" 
                fill="url(#confocalVignette)" 
              />

              {/* Background Neuropil Mesh Layer */}
              <rect x="0" y="0" width="880" height="540" fill="url(#neuropilMesh)" />

              {/* Deep Field Ambient Bloom around Soma */}
              <circle cx="440" cy="270" r="180" fill="url(#somaAtmosphereGlow)" />

              {/* =============================================================
               * NEUROPIL BACKGROUND FIBERS (CONFOCAL DEPTH OF FIELD MESH)
               * ============================================================= */}
              <g opacity="0.22" filter="url(#confocalGlow)">
                {/* Out of focus background axons and micro-filaments (like Ref 3 & 4) */}
                <path d="M 120 80 Q 260 220 440 270 Q 620 320 780 440" fill="none" stroke="#6366f1" strokeWidth="1.2" strokeDasharray="6 8" />
                <path d="M 760 110 Q 560 230 440 270 Q 320 310 160 460" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 6" />
                <path d="M 440 30 Q 420 180 440 270 Q 460 360 430 510" fill="none" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 7" />
                <path d="M 90 280 Q 270 290 440 270 Q 610 250 810 260" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 5" />
                <path d="M 220 500 Q 330 380 440 270 Q 550 160 680 50" fill="none" stroke="#a3e635" strokeWidth="0.8" strokeDasharray="5 5" />
              </g>

              {/* =============================================================
               * CROSS-DOMAIN SYNERGY AXONS (ACTION POTENTIAL HIGHLIGHTS)
               * ============================================================= */}
              {synergyBridges.map((bridge, bIdx) => {
                const nodeFrom = nodes.find(n => n.id === bridge.from);
                const nodeTo = nodes.find(n => n.id === bridge.to);
                if (!nodeFrom || !nodeTo) return null;

                const isConnected = 
                  activeFocusId === bridge.from || activeFocusId === bridge.to;

                return (
                  <path
                    key={`bridge-${bIdx}`}
                    d={`M ${nodeFrom.cx} ${nodeFrom.cy} C 440 270, 440 270, ${nodeTo.cx} ${nodeTo.cy}`}
                    fill="none"
                    stroke={isConnected ? '#fbbf24' : '#334155'}
                    strokeWidth={isConnected ? 2.5 : 0.8}
                    strokeDasharray={isConnected ? 'none' : '3 5'}
                    opacity={isConnected ? 0.95 : 0.25}
                    filter={isConnected ? 'url(#confocalGlow)' : undefined}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* =============================================================
               * PRIMARY DENDRITIC TRUNKS (TAPERING ORGANIC NEURAL PROCESSES)
               * 7 distinct trunks emerging from soma membrane and branching outward
               * ============================================================= */}
              
              {/* Trunk 0: GFP Emerald (Top - Geofísica) */}
              <g filter="url(#confocalGlow)">
                {/* Base trunk: thick tapering process */}
                <path d="M 436 248 C 438 210, 435 160, 440 90" fill="none" stroke="#10b981" strokeWidth="5.5" strokeLinecap="round" opacity="0.85" />
                <path d="M 440 90 C 442 70, 420 55, 405 48" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
                <path d="M 440 90 C 445 70, 465 55, 475 45" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
                <path d="M 440 135 C 410 145, 395 138, 385 130" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
                <path d="M 440 135 C 470 145, 485 138, 495 130" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
                <path d="M 475 45 C 510 50, 530 58, 545 65" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              </g>

              {/* Trunk 1: CFP Cyan (Top-Right - Biogeoquímica) */}
              <g filter="url(#confocalGlow)">
                <path d="M 452 255 C 490 235, 540 205, 640 135" fill="none" stroke="#06b6d4" strokeWidth="5.5" strokeLinecap="round" opacity="0.85" />
                <path d="M 525 215 C 545 190, 555 175, 565 165" fill="none" stroke="#06b6d4" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
                <path d="M 550 210 C 585 205, 605 200, 615 195" fill="none" stroke="#06b6d4" strokeWidth="2.4" strokeLinecap="round" opacity="0.75" />
                <path d="M 640 135 C 670 145, 685 150, 695 155" fill="none" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 640 135 C 680 120, 700 110, 715 105" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <path d="M 695 155 C 735 150, 755 148, 775 145" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              </g>

              {/* Trunk 2: Texas Red / mCherry (Mid-Right - Comunicaciones) */}
              <g filter="url(#confocalGlow)">
                <path d="M 458 270 C 510 272, 570 275, 685 315" fill="none" stroke="#f97316" strokeWidth="5.5" strokeLinecap="round" opacity="0.85" />
                <path d="M 550 275 C 590 270, 615 268, 635 265" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                <path d="M 635 265 C 670 255, 690 250, 705 245" fill="none" stroke="#f97316" strokeWidth="2.4" strokeLinecap="round" opacity="0.75" />
                <path d="M 685 315 C 725 300, 745 290, 765 280" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 685 315 C 750 325, 780 330, 810 335" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              </g>

              {/* Trunk 3: Cy5 Violet (Bottom-Right - Cultura & Políticas) */}
              <g filter="url(#confocalGlow)">
                <path d="M 450 285 C 485 325, 530 380, 600 455" fill="none" stroke="#c084fc" strokeWidth="5.5" strokeLinecap="round" opacity="0.85" />
                <path d="M 505 325 C 540 355, 560 370, 575 385" fill="none" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                <path d="M 575 385 C 610 395, 630 400, 645 405" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
                <path d="M 600 455 C 640 460, 660 462, 675 465" fill="none" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 535 395 C 535 435, 535 450, 535 470" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <path d="M 675 465 C 705 478, 720 484, 735 490" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <path d="M 600 455 C 615 480, 625 495, 630 505" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              </g>

              {/* Trunk 4: Phyto-Lime YFP (Bottom-Left - Grassroots & Territorio) */}
              <g filter="url(#confocalGlow)">
                <path d="M 430 285 C 395 325, 350 380, 290 455" fill="none" stroke="#a3e635" strokeWidth="5.5" strokeLinecap="round" opacity="0.85" />
                <path d="M 375 325 C 345 355, 325 370, 315 385" fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                <path d="M 315 385 C 280 395, 260 400, 245 405" fill="none" stroke="#a3e635" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
                <path d="M 290 455 C 250 460, 230 462, 215 465" fill="none" stroke="#a3e635" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 345 395 C 350 435, 355 450, 355 470" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <path d="M 215 465 C 185 478, 170 484, 155 490" fill="none" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              </g>

              {/* Trunk 5: Lucifer Amber (Mid-Left - Gestión de Proyectos) */}
              <g filter="url(#confocalGlow)">
                <path d="M 422 270 C 370 272, 310 275, 195 315" fill="none" stroke="#fbbf24" strokeWidth="5.5" strokeLinecap="round" opacity="0.85" />
                <path d="M 335 275 C 290 270, 265 268, 245 265" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
                <path d="M 245 265 C 210 255, 190 250, 175 245" fill="none" stroke="#fbbf24" strokeWidth="2.4" strokeLinecap="round" opacity="0.75" />
                <path d="M 195 315 C 155 300, 135 290, 115 285" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 195 315 C 130 325, 100 330, 70 335" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              </g>

              {/* Trunk 6: Laser Electric Blue (Top-Left - Product Owner & Software) */}
              <g filter="url(#confocalGlow)">
                <path d="M 428 255 C 390 235, 340 205, 240 135" fill="none" stroke="#60a5fa" strokeWidth="5.5" strokeLinecap="round" opacity="0.85" />
                <path d="M 355 215 C 335 190, 325 175, 315 165" fill="none" stroke="#60a5fa" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
                <path d="M 330 210 C 295 205, 275 200, 265 195" fill="none" stroke="#60a5fa" strokeWidth="2.4" strokeLinecap="round" opacity="0.75" />
                <path d="M 240 135 C 210 145, 195 150, 185 155" fill="none" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
                <path d="M 240 135 C 200 120, 180 110, 165 105" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <path d="M 240 135 C 230 95, 225 75, 215 60" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <path d="M 185 155 C 145 150, 125 148, 105 145" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              </g>

              {/* =============================================================
               * DENDRITIC SPINES (FINE CONNECTING NECKS TO BOUTONS)
               * ============================================================= */}
              {nodes.map(node => {
                const nodeColor = node.isMarketGap ? '#ef4444' : branchStyles[node.branch].color;
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;

                return (
                  <line 
                    key={`spine-${node.id}`}
                    x1={node.spineOrigin.x} 
                    y1={node.spineOrigin.y} 
                    x2={node.cx} 
                    y2={node.cy} 
                    stroke={nodeColor} 
                    strokeWidth={isSelected || isHovered ? "1.8" : "1"} 
                    strokeOpacity={isSelected || isHovered ? 0.95 : 0.65}
                    strokeDasharray={node.isMarketGap ? "2 2" : undefined}
                    filter={isSelected || isHovered ? "url(#confocalGlow)" : undefined}
                    className="transition-all duration-200"
                  />
                );
              })}

              {/* =============================================================
               * THE SOMA: ORGANIC WHITE-HOT MULTIPOLAR CELL BODY
               * Inspired directly by confocal images 1, 2, 4, 5
               * ============================================================= */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedNodeId('n7-wetland')}
              >
                {/* Outermost membrane radiation aura */}
                <ellipse cx="440" cy="270" rx="38" ry="32" fill="url(#somaThermalCore)" filter="url(#confocalGlow)" opacity="0.9" />

                {/* Multipolar biological cell body with organic lobes emerging into dendrites */}
                <path 
                  d="M 436 242 
                     C 445 242, 456 250, 460 262 
                     C 466 270, 462 284, 452 292 
                     C 442 298, 430 296, 422 288 
                     C 414 280, 416 265, 424 252 
                     C 428 244, 432 242, 436 242 Z" 
                  fill="#ffffff" 
                  filter="url(#confocalGlow)"
                />

                {/* Blazing incandescent core (white-hot nucleus) */}
                <ellipse cx="439" cy="269" rx="16" ry="12" fill="#ffffff" />
                <circle cx="439" cy="269" r="6" fill="#fffbeb" />

                {/* Organic Membrane Texture / Cytoplasm flecks */}
                <circle cx="433" cy="264" r="2" fill="#fde047" opacity="0.8" />
                <circle cx="445" cy="273" r="2.5" fill="#f97316" opacity="0.8" />
                <circle cx="441" cy="260" r="1.5" fill="#fbbf24" opacity="0.9" />

                {/* Core Labeling */}
                <text x="439" y="267" fill="#000000" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.4">
                  DANIEL SANTANDER
                </text>
                <text x="439" y="276" fill="#78350f" fontSize="5.5" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                  CIENCIA & COMUNICACIÓN
                </text>
              </g>

              {/* =============================================================
               * SYNAPTIC BOUTONS (THE SKILL NODES - LUMINESCENT MEMBRANE PUNCTA)
               * ============================================================= */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isSynergyActive = activeSynergyNodeIds.has(node.id);

                // Filter check: Mastered, Training, Gaps
                const matchesStatusFilter = 
                  filterMode === 'all' ||
                  (filterMode === 'mastered' && node.status === 'MASTERED') ||
                  (filterMode === 'training' && (node.status === 'ACTIVE' || node.status === 'IN_TRAINING')) ||
                  (filterMode === 'gaps' && node.isMarketGap);

                // Archetype check
                const matchesArchetype = 
                  selectedArchetype === 'all' || 
                  node.archetypes.includes(selectedArchetype) ||
                  (node.isMarketGap && node.archetypes.includes(selectedArchetype));

                const isVisible = matchesStatusFilter && matchesArchetype;
                const nodeColor = node.isMarketGap 
                  ? '#ef4444' 
                  : branchStyles[node.branch].color;

                const opacity = isVisible ? (isHovered || isSelected || isSynergyActive ? 1 : 0.88) : 0.12;

                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group transition-all duration-300"
                    style={{ opacity }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Invisible fixed hitbox that permanently captures mouse events without reflow jitter */}
                    <circle cx={node.cx} cy={node.cy} r="18" fill="transparent" />

                    {/* Market Gap: Scarlet Red Pulsing Receptor Ring */}
                    {node.isMarketGap && (
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r="14" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="1.2"
                        strokeDasharray="2 3"
                        className="animate-spin pointer-events-none"
                        style={{ animationDuration: '5s' }}
                      />
                    )}

                    {/* Active Synapse Photonic Bloom Halo */}
                    {(isSelected || isHovered || isSynergyActive) && (
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r={isSelected ? "16" : "13"} 
                        fill={nodeColor} 
                        fillOpacity="0.35" 
                        stroke={nodeColor}
                        strokeWidth={isSelected ? "2" : "1"}
                        filter="url(#confocalGlow)"
                        className="pointer-events-none"
                      />
                    )}

                    {/* Synaptic Bouton Head (Solid Lipid Membrane Body) */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={isSelected ? "9.5" : "7.5"} 
                      fill="#020617" 
                      stroke={nodeColor} 
                      strokeWidth={isSelected ? "2.4" : "1.8"} 
                      strokeDasharray={node.isMarketGap ? "2 2" : undefined}
                      filter="url(#confocalGlow)"
                      className="pointer-events-none"
                    />

                    {/* Concentrated Vesicle Core (Dense Photonic Pip) */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={node.isMarketGap ? "2.8" : node.status === 'MASTERED' ? "3.2" : "2.2"} 
                      fill={node.isMarketGap ? "#ffffff" : node.status === 'MASTERED' ? "#ffffff" : nodeColor} 
                      className="pointer-events-none"
                    />

                    {/* Micro Floating Label */}
                    <text 
                      x={node.cx} 
                      y={node.cy + (node.cy > 270 ? 17 : -12)} 
                      fontSize="6.8" 
                      fontWeight="bold" 
                      fontFamily="sans-serif" 
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : isHovered ? nodeColor : '#cbd5e1'}
                      className="transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] pointer-events-none"
                    >
                      {node.shortName}
                    </text>
                    <text 
                      x={node.cx} 
                      y={node.cy + (node.cy > 270 ? 24 : -5)} 
                      fill={nodeColor} 
                      fontSize="5.2" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {node.isMarketGap ? 'BRECHA' : (node.level === 5 ? 'SENIOR' : 'ACTIVO')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Fullscreen Floating Inspector HUD */}
          {isFullscreen && (
            <div className="relative z-20 mt-2 px-4 py-2.5 rounded-xl bg-black/85 border border-white/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl animate-fade-in">
              <div className="flex items-center gap-3 min-w-0">
                <span className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-base">
                  {currentBranchStyle.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm truncate">{selectedNode.name}</span>
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0"
                      style={{ 
                        backgroundColor: selectedNode.isMarketGap ? '#e11d48' : currentBranchStyle.color,
                        color: '#ffffff'
                      }}
                    >
                      {selectedNode.isMarketGap ? 'Brecha de Mercado' : 'Verificado'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-1">{selectedNode.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] shrink-0">
                <span className="hidden md:inline">{selectedNode.evidenceTitle}</span>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition font-bold cursor-pointer"
                >
                  Cerrar (ESC)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CONFOCAL TECHNICAL DOSSIER (4 COLS) */}
        <div className="lg:col-span-4 space-y-3.5 min-h-[580px]">
          
          {/* Main Selected Capability Inspector Card */}
          <div 
            className={`p-4 rounded-2xl border shadow-2xl relative transition-all duration-300 backdrop-blur-md ${
              selectedNode.isMarketGap 
                ? 'bg-rose-950/20 border-rose-500/50 shadow-rose-950/40' 
                : `${currentBranchStyle.bg} ${currentBranchStyle.border}`
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                {selectedNode.isMarketGap ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-400 font-extrabold">BRECHA DE MERCADO DETECTADA</span>
                  </>
                ) : (
                  <>
                    <span>{currentBranchStyle.icon}</span>
                    <span>COMPETENCIA PROFESIONAL VERIFICADA</span>
                  </>
                )}
              </span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${
                selectedNode.isMarketGap 
                  ? 'bg-rose-600 text-white border-rose-400' 
                  : 'bg-black/60 text-white border-white/20'
              }`}>
                {selectedNode.isMarketGap ? 'BRECHA DE MERCADO A CERRAR' : `ID: ${selectedNode.id}`}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div 
                  className="text-[9px] font-mono font-bold uppercase tracking-wider flex items-center justify-between"
                  style={{ color: currentBranchStyle.color }}
                >
                  <span>{currentBranchStyle.label}</span>
                  <span className="text-[9px] opacity-90 font-mono font-bold">{currentBranchStyle.shortLabel}</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight mt-0.5">
                  {selectedNode.name}
                </h3>
              </div>

              {/* If it's a Market Gap: Show Market Demand, Impact & Actionable Roadmap */}
              {selectedNode.isMarketGap ? (
                <div className="space-y-2.5">
                  <div 
                    className="p-3 rounded-xl border space-y-1.5 backdrop-blur-sm"
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                      borderColor: 'rgba(244, 63, 94, 0.3)' 
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">Demanda en Ofertas:</span>
                      <span className="text-rose-400 font-mono font-bold text-[10px]">
                        {selectedNode.gapDemand}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
                      <span className="text-slate-400 font-mono">Impacto Salarial/Match:</span>
                      <span className="text-emerald-400 font-mono font-bold text-[10px]">
                        {selectedNode.gapImpact}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
                      <span className="text-slate-400 font-mono">Estado de Cobertura Formativa:</span>
                      <span className="text-cyan-400 font-mono font-bold text-[10px] flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        <span>{selectedNode.status === 'MASTERED' ? 'CERRADA / CERTIFICADA' : selectedNode.status === 'IN_TRAINING' ? 'CURSO EN FORMACIÓN' : 'PLAN DE FORMACIÓN PENDIENTE'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                    {selectedNode.description}
                  </div>

                  {/* Immediate 3-step Action Roadmap */}
                  {selectedNode.gapRoadmap && (
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="text-[9.5px] font-mono font-bold text-white uppercase flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-rose-500" />
                        <span>HOJA DE RUTA PARA CERRAR LA BRECHA</span>
                      </div>
                      <div className="space-y-1.5">
                        {selectedNode.gapRoadmap.map((step, idx) => (
                          <div 
                            key={idx} 
                            className="p-2 rounded-xl border text-[10.5px] flex items-start gap-2 bg-black/40 border-white/10"
                          >
                            <span className="h-4 w-4 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-slate-300 leading-snug">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Official Academy Courses */}
                  {(() => {
                    const linkedCourses = ACADEMY_COURSES.filter(c => c.gapId === selectedNode.id);
                    if (linkedCourses.length === 0) return null;

                    return (
                      <div className="pt-2.5 border-t border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-[9.5px] font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5" />
                            <span>PROGRAMAS OFICIALES ({linkedCourses.length})</span>
                          </div>
                          {onNavigateToAcademy && (
                            <button
                              onClick={() => onNavigateToAcademy(selectedNode.id)}
                              className="text-[9.5px] font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                            >
                              <span>Ver en Academy</span>
                              <span>→</span>
                            </button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {linkedCourses.map(course => {
                            const prog = courseProgress[course.id] || { status: 'AVAILABLE', progressPercent: 0 };
                            return (
                              <div 
                                key={course.id}
                                className={`p-2.5 rounded-xl border text-[10.5px] transition-all bg-black/50 ${
                                  prog.status === 'COMPLETED' 
                                    ? 'border-emerald-500/40' 
                                    : prog.status === 'IN_PROGRESS'
                                    ? 'border-amber-500/40'
                                    : 'border-white/10'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/40 text-cyan-400 border border-white/10 truncate max-w-[170px]">
                                    {course.provider}
                                  </span>
                                  <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                    prog.status === 'COMPLETED'
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                      : prog.status === 'IN_PROGRESS'
                                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                      : 'bg-slate-800 text-slate-300 border-white/10'
                                  }`}>
                                    {prog.status === 'COMPLETED' ? 'CERTIFICADO' : prog.status === 'IN_PROGRESS' ? `${prog.progressPercent || 25}% EN CURSO` : 'DISPONIBLE'}
                                  </span>
                                </div>

                                <div className="font-bold text-white leading-tight mb-1">
                                  {course.title}
                                </div>

                                <div className="text-[9.5px] text-slate-400 line-clamp-2 mb-2 font-sans">
                                  {course.syllabusSummary}
                                </div>

                                <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                                  <button
                                    onClick={() => handleToggleCourseStatus(course.id, prog.status)}
                                    className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer transition"
                                    title="Alternar estado: Disponible ➜ En Curso ➜ Certificado"
                                  >
                                    {prog.status === 'COMPLETED' ? '↺ Reiniciar' : prog.status === 'IN_PROGRESS' ? '✓ Marcar Certificado' : '▶ Iniciar Estudio'}
                                  </button>

                                  <a
                                    href={course.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[9px] font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Acceder</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* Regular Mastered/Active Node Inspector */
                <div className="space-y-3">
                  <div 
                    className="p-3 rounded-xl border space-y-2 bg-black/60 border-white/10"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">Madurez Técnica:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {selectedNode.level === 5 ? 'Senior / Especialista Consolidado' : 'Avanzado / En Ejercicio Directo'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono pt-1.5 border-t border-white/10">
                      <span className="text-slate-400">Estado de Acreditación:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Acreditado con Evidencia en Portafolio</span>
                      </span>
                    </div>
                  </div>

                  {/* Technical Description */}
                  <div className="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                    {selectedNode.description}
                  </div>

                  {/* Connected Synergy Bridges for this Node */}
                  {selectedSynergies.length > 0 && (
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <div className="text-[9.5px] font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" />
                        <span>SINERGIAS TRANSDISCIPLINARIAS ACTIVAS</span>
                      </div>
                      <div className="space-y-1">
                        {selectedSynergies.map((s, idx) => (
                          <div 
                            key={idx}
                            className="p-1.5 rounded-lg border text-[10px] font-mono flex items-center justify-between text-amber-300 bg-amber-950/20 border-amber-500/25"
                          >
                            <span>⚡ {s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Evidence Anchor to Portafolio App */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <div className="text-[9.5px] font-mono font-bold text-white uppercase flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-cyan-400" />
                      <span>RESPALDO AUDITADO EN PORTAFOLIO</span>
                    </div>
                    <div 
                      className="p-2.5 rounded-xl border flex items-center justify-between group shadow bg-black/50 border-white/15"
                    >
                      <div className="overflow-hidden pr-2">
                        <div className="text-[11.5px] font-bold text-white truncate">
                          {selectedNode.evidenceTitle}
                        </div>
                        <div className="text-[9.5px] text-emerald-400 font-mono flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Evidencia documental verificable</span>
                        </div>
                      </div>
                      <a
                        href={`https://danisantanderurrutia-coder.github.io/portafolio/${selectedNode.evidenceAnchor}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition shrink-0 shadow-lg shadow-cyan-600/30 flex items-center gap-1"
                        title="Abrir evidencia directa en el Portafolio"
                      >
                        <span className="text-[10px] font-mono font-bold hidden sm:inline">VER</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Archetype Target Context Card */}
          <div 
            className="p-3.5 rounded-2xl border shadow-xl space-y-2 transition-colors bg-black/60 border-white/10"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-[11px] font-bold uppercase text-white flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-amber-400" />
                <span>MERCADO OBJETIVO: {currentArchetypeInfo.name.toUpperCase()}</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">
                {offers.length} OFERTAS ACTIVAS
              </span>
            </div>

            <p className="text-[10.5px] text-slate-300 leading-relaxed">
              {currentArchetypeInfo.description}
            </p>

            <div 
              className="p-2.5 rounded-xl border text-[10px] font-mono space-y-1 bg-black/40 border-white/10"
            >
              <div className="text-slate-400 font-bold">ENTIDADES Y CENTROS OBJETIVO:</div>
              <div className="text-amber-400 leading-snug">{currentArchetypeInfo.targets}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

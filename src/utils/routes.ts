/**
 * Slugs y Arquitectura de Rutas para la Web de Empleo
 * Permite routing limpio, deep-linking y sincronización de URL en el navegador.
 */

export const APP_SLUGS = {
  // 1. Estaciones principales
  DASHBOARD: '/consola',
  MARKET: '/mercado',
  CRAFTING: '/crafting',
  CRAFTING_CV: '/crafting/cv',
  CRAFTING_LETTER: '/crafting/carta',
  DOSSIER: '/perfil',
  ACADEMY: '/academia',
  APPLICATIONS: '/candidaturas',
  FUNDING: '/convocatorias',
  SETTINGS: '/ajustes',
  PROTOCOL: '/protocolo',

  // 2. Submódulos de Mercado
  MARKET_ORGANIZATIONS: '/mercado/organizaciones',
  MARKET_BENCHMARK: '/mercado/benchmark',
  MARKET_PORTALS: '/mercado/portales',
  MARKET_OFFERS: '/mercado/ofertas',
  MARKET_SOURCES: '/mercado/fuentes',
  MARKET_COMPANIES: '/mercado/empresas',
  MARKET_DIRECTORIO: '/mercado/directorio',

  // 3. Submódulos de Perfil / Operador (Expediente, Competencias & CV Studio)
  DOSSIER_EXPEDIENTE: '/perfil/expediente',
  DOSSIER_PROFILE: '/perfil/expediente',
  DOSSIER_EXPEDIENTE_MAESTRO: '/perfil/expediente-maestro',
  DOSSIER_SHOWCASE: '/perfil/resumen',
  DOSSIER_COMPETENCIAS: '/perfil/competencias',
  DOSSIER_HABILIDADES: '/perfil/habilidades',
  DOSSIER_ARBOL: '/perfil/arbol',
  DOSSIER_SKILLS: '/perfil/skills',
  DOSSIER_CV_STUDIO: '/perfil/cv-studio',
  DOSSIER_CV: '/perfil/cv',
  DOSSIER_PLANTILLAS: '/perfil/plantillas',
  DOSSIER_COVER_LETTER: '/perfil/cover-letter',
  DOSSIER_CARTAS: '/perfil/cartas',
  DOSSIER_CARTA: '/perfil/carta',

  // 4. Submódulos de Candidaturas
  APPLICATIONS_ACTIVE: '/candidaturas/activas',
  APPLICATIONS_PIPELINE: '/candidaturas/pipeline',
  APPLICATIONS_BATCH: '/candidaturas/lote',
  APPLICATIONS_INTELLIGENCE: '/candidaturas/inteligencia',
  APPLICATIONS_WINGMAN: '/candidaturas/wingman',
  APPLICATIONS_ESTRATEGIA: '/candidaturas/estrategia',

  // 5. Convocatorias I+D & Fondos
  FUNDING_ACTIVE: '/convocatorias/activas',
  FUNDING_EU: '/convocatorias/horizon-ue',
  FUNDING_DACH: '/convocatorias/alemania-dach',
  FUNDING_EUSKADI: '/convocatorias/euskadi',
  FUNDING_FONDOS: '/convocatorias/fondos',

  // 6. Academia Formativa & Radar
  ACADEMY_RADAR: '/academia/radar',
  ACADEMY_BRECHAS: '/academia/brechas',
  ACADEMY_CURSOS: '/academia/cursos',
  ACADEMY_GAPS: '/academia/gaps',

  // 7. Ajustes
  SETTINGS_GENERAL: '/ajustes/general',
  SETTINGS_PIPELINE: '/ajustes/pipeline',
  SETTINGS_EMAIL: '/ajustes/correo'
} as const;

export interface ParsedRouteState {
  station: string;
  subTab?: string;
  docType?: 'cv' | 'cover_letter';
  offerId?: string;
}

/**
 * Traduce el estado actual de la aplicación a su slug canónico
 */
export const getSlugForState = (
  stationId: string,
  subTab?: string,
  docType: 'cv' | 'cover_letter' = 'cv'
): string => {
  if (stationId === 'crafting') {
    return docType === 'cover_letter' ? APP_SLUGS.CRAFTING_LETTER : APP_SLUGS.CRAFTING_CV;
  }

  if (stationId === 'market_radar') {
    if (subTab === 'benchmark') return APP_SLUGS.MARKET_BENCHMARK;
    if (subTab === 'portals') return APP_SLUGS.MARKET_PORTALS;
    if (subTab === 'sources') return APP_SLUGS.MARKET_SOURCES;
    if (subTab === 'companies' || subTab === 'organizations') return APP_SLUGS.MARKET_ORGANIZATIONS;
    if (subTab === 'offers') return APP_SLUGS.MARKET_OFFERS;
    return APP_SLUGS.MARKET_ORGANIZATIONS;
  }

  if (stationId === 'agent_dossier') {
    if (subTab === 'studio') {
      return docType === 'cover_letter' ? APP_SLUGS.DOSSIER_COVER_LETTER : APP_SLUGS.DOSSIER_CV_STUDIO;
    }
    if (subTab === 'profile' || subTab === 'expediente') return APP_SLUGS.DOSSIER_EXPEDIENTE;
    if (subTab === 'skills' || subTab === 'competencias') return APP_SLUGS.DOSSIER_COMPETENCIAS;
    return APP_SLUGS.DOSSIER_SHOWCASE;
  }

  if (stationId === 'mission_control') {
    if (subTab === 'batch') return APP_SLUGS.APPLICATIONS_BATCH;
    if (subTab === 'intelligence') return APP_SLUGS.APPLICATIONS_INTELLIGENCE;
    return APP_SLUGS.APPLICATIONS_PIPELINE;
  }

  if (stationId === 'funding') return APP_SLUGS.FUNDING;
  if (stationId === 'academy') return APP_SLUGS.ACADEMY;
  if (stationId === 'settings') return APP_SLUGS.SETTINGS;
  if (stationId === 'protocol') return APP_SLUGS.PROTOCOL;

  return APP_SLUGS.DASHBOARD;
};

/**
 * Traduce una URL, pathname o hash a los estados de Empleo (estación, subTab, docType)
 */
export const parseSlugToState = (rawPath: string): ParsedRouteState => {
  // Soporta tanto pathnames directos (/mercado/ofertas) como hash routing (/#/mercado/ofertas)
  let path = rawPath;
  if (path.includes('#')) {
    path = path.split('#')[1] || '/';
  }

  // Quitar el BASE_URL si existe (ej. /empleo/)
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL)
    ? import.meta.env.BASE_URL.replace(/\/+$/, '')
    : '';
  if (baseUrl && path.startsWith(baseUrl)) {
    path = path.slice(baseUrl.length);
  }

  const clean = path.toLowerCase().replace(/\/+$/, '') || '/';

  // 1. Consola / Dashboard
  if (clean === '/consola' || clean === '/dashboard' || clean === '/inicio' || clean === '/resumen-general') {
    return { station: 'dashboard' };
  }

  // 2. Crafting (CV & Cover Letter Studio)
  if (
    clean === '/crafting/carta' ||
    clean === '/crafting/cartas' ||
    clean === '/crafting/cover-letter' ||
    clean === '/cover-letter' ||
    clean === '/cartas' ||
    clean === '/carta' ||
    clean === '/carta-studio' ||
    clean === '/perfil/cover-letter' ||
    clean === '/perfil/carta' ||
    clean === '/perfil/cartas' ||
    clean === '/perfil/cartas-presentacion' ||
    clean === '/perfil/motivacion' ||
    clean.startsWith('/crafting/carta') ||
    clean.startsWith('/cover-letter') ||
    clean.startsWith('/perfil/cover-letter')
  ) {
    return { station: 'crafting', docType: 'cover_letter' };
  }
  if (
    clean === '/crafting' ||
    clean === '/crafting/cv' ||
    clean === '/cv-studio' ||
    clean === '/cv' ||
    clean === '/curriculum' ||
    clean === '/perfil/cv-studio' ||
    clean === '/perfil/cv' ||
    clean === '/perfil/curriculum' ||
    clean === '/perfil/plantillas' ||
    clean === '/perfil/a4' ||
    clean.startsWith('/crafting') ||
    clean.startsWith('/cv-studio') ||
    clean.startsWith('/perfil/cv-studio')
  ) {
    return { station: 'crafting', docType: 'cv' };
  }

  // 3. Mercado
  if (
    clean === '/mercado/benchmark' || 
    clean === '/mercado/matriz' || 
    clean === '/mercado/probabilidad' || 
    clean === '/mercado/ranking' ||
    clean.startsWith('/mercado/benchmark/')
  ) {
    return { station: 'market_radar', subTab: 'benchmark' };
  }
  if (
    clean === '/mercado/portales' || 
    clean === '/mercado/radares' || 
    clean === '/mercado/buscadores' || 
    clean.startsWith('/mercado/portales/')
  ) {
    return { station: 'market_radar', subTab: 'portals' };
  }
  if (
    clean === '/mercado/organizaciones' || 
    clean === '/mercado/empresas' || 
    clean === '/mercado/directorio' || 
    clean === '/mercado/instituciones' ||
    clean.startsWith('/mercado/organizaciones/') || 
    clean.startsWith('/mercado/empresas/')
  ) {
    return { station: 'market_radar', subTab: 'organizations' };
  }
  if (clean === '/mercado/fuentes') {
    return { station: 'market_radar', subTab: 'portals' };
  }
  if (clean === '/mercado' || clean === '/mercado/ofertas' || clean === '/mercado/vacantes' || clean.startsWith('/mercado/ofertas/')) {
    return { station: 'market_radar', subTab: 'organizations' };
  }

  // 3. Academia Formativa
  if (
    clean === '/academia' || 
    clean === '/academy' || 
    clean === '/academia/radar' ||
    clean === '/academia/brechas' ||
    clean === '/academia/cursos' ||
    clean === '/academia/gaps' ||
    clean.startsWith('/academia') || 
    clean.startsWith('/academy')
  ) {
    return { station: 'academy' };
  }

  // 4. Perfil & Expediente
  if (clean === '/perfil/academia' || clean === '/perfil/academy' || clean.startsWith('/perfil/academia') || clean.startsWith('/perfil/academy')) {
    return { station: 'academy' };
  }
  if (
    clean === '/perfil/expediente' || 
    clean === '/perfil/expediente-maestro' || 
    clean === '/perfil/maestro' || 
    clean === '/perfil/datos' ||
    clean === '/perfil/dossier' ||
    clean === '/perfil/trayectoria' ||
    clean.startsWith('/perfil/expediente')
  ) {
    return { station: 'agent_dossier', subTab: 'profile' };
  }
  if (
    clean === '/perfil/cv-studio' || 
    clean === '/perfil/cv' || 
    clean === '/perfil/curriculum' || 
    clean === '/perfil/plantillas' || 
    clean === '/perfil/a4' ||
    clean.startsWith('/perfil/cv-studio')
  ) {
    return { station: 'agent_dossier', subTab: 'studio', docType: 'cv' };
  }
  if (
    clean === '/perfil/cover-letter' || 
    clean === '/perfil/carta' || 
    clean === '/perfil/cartas' || 
    clean === '/perfil/cartas-presentacion' ||
    clean === '/perfil/motivacion' ||
    clean.startsWith('/perfil/cover-letter')
  ) {
    return { station: 'agent_dossier', subTab: 'studio', docType: 'cover_letter' };
  }
  if (
    clean === '/perfil/resumen' || 
    clean === '/perfil/competencias' || 
    clean === '/perfil/habilidades' || 
    clean === '/perfil/skills' || 
    clean === '/perfil/arbol' ||
    clean === '/perfil/showcase'
  ) {
    return { station: 'agent_dossier', subTab: 'showcase' };
  }
  if (clean === '/perfil') {
    return { station: 'agent_dossier', subTab: 'showcase' };
  }

  // 5. Candidaturas
  if (clean === '/candidaturas/lote' || clean === '/candidaturas/batch' || clean === '/candidaturas/masivas' || clean === '/candidaturas/cola') {
    return { station: 'mission_control', subTab: 'batch' };
  }
  if (
    clean === '/candidaturas/inteligencia' || 
    clean === '/candidaturas/wingman' || 
    clean === '/candidaturas/radar-ia' ||
    clean === '/candidaturas/estrategia'
  ) {
    return { station: 'mission_control', subTab: 'intelligence' };
  }
  if (
    clean === '/candidaturas' || 
    clean === '/candidaturas/activas' || 
    clean === '/candidaturas/pipeline' || 
    clean === '/candidaturas/flujo' || 
    clean === '/candidaturas/seguimiento' ||
    clean === '/candidaturas/kanban' ||
    clean.startsWith('/candidaturas/')
  ) {
    return { station: 'mission_control', subTab: 'applications' };
  }

  // 6. Convocatorias I+D
  if (clean.startsWith('/convocatorias') || clean.startsWith('/funding')) {
    return { station: 'funding' };
  }

  // 7. Ajustes
  if (clean.startsWith('/ajustes') || clean === '/configuracion' || clean.startsWith('/settings')) {
    return { station: 'settings' };
  }

  // 8. Protocolo
  if (clean === '/protocolo' || clean === '/protocol' || clean === '/ayuda') {
    return { station: 'protocol' };
  }

  // Dashboard / Consola por defecto
  return { station: 'dashboard' };
};

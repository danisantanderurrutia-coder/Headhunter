import type { MasterProfile } from '../types/profile';
import type { JobOffer } from '../types/offers';
import type { CompanyDossier } from '../types/companies';
import type { ApplicationItem } from '../types/applications';
import type { JobSource } from '../types/sources';
import type { CVVersion } from '../types/cv';
import type { UserCourseProgress, CourseStatus } from '../types/academy';
import { initialProfile, initialOffers, initialCompanies, initialApplications, initialSources, initialCVs } from './sampleData';
import { INITIAL_COURSE_PROGRESS } from '../data/academyCourses';

export interface AppSettings {
  llmProvider: string;
  apiKey: string;
  modelName: string;
  enableBrowserAgent: boolean;
  enableAntigravityApply: boolean;
  autoScoutInterval: string;
  bilbaoPriorityBonus: number;
  emailAlertRecipient?: string;
  emailAlertKeywords?: string[];
  emailAlertProvider?: 'resend' | 'smtp' | 'local';
  emailAlertTime?: string;
  emailAlertEnabled?: boolean;
}

const defaultSettings: AppSettings = {
  llmProvider: 'Google Gemini Pro',
  apiKey: '',
  modelName: 'gemini-1.5-pro',
  enableBrowserAgent: true,
  enableAntigravityApply: true,
  autoScoutInterval: '24h',
  bilbaoPriorityBonus: 25,
  emailAlertRecipient: 'danisantander.urrutia@gmail.com',
  emailAlertKeywords: ['Boden', 'Bodenkunde', 'Klimaschutz', 'KI', 'Künstliche Intelligenz', 'Umweltbundesamt', 'Thünen', 'Geophysik', 'Eddy Covariance'],
  emailAlertProvider: 'resend',
  emailAlertTime: '09:00',
  emailAlertEnabled: false
};

const KEYS = {
  PROFILE: 'job_search_os_profile_v20',
  OFFERS: 'job_search_os_offers_v19',
  COMPANIES: 'job_search_os_companies_v19',
  APPLICATIONS: 'job_search_os_applications_v19',
  SOURCES: 'job_search_os_sources_v19',
  CVS: 'job_search_os_cvs_v19',
  DOCS: 'job_search_os_docs_v19',
  SETTINGS: 'job_search_os_settings_v19',
  ACADEMY_PROGRESS: 'job_search_os_academy_progress_v1'
};

/**
 * Request permanent browser storage protection (Opera / Chromium / Safari / Firefox).
 * Prevents the browser from evicting data when closing Opera or running cache cleanup.
 */
export const enablePersistentBrowserStorage = async (): Promise<boolean> => {
  try {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      console.log(`[Job Search OS] Storage Persistence status: ${isPersisted ? 'PERMANENT' : 'STANDARD'}`);
      return isPersisted;
    }
  } catch (err) {
    console.warn('[Job Search OS] Storage persistence error:', err);
  }
  return false;
};

// Automatically request storage persistence on script load
enablePersistentBrowserStorage();

export const getStoredProfile = (): MasterProfile => {
  let data = localStorage.getItem(KEYS.PROFILE);

  // Migration from previous v19 cache: import user salary/target preferences while adopting the consolidated canonical dossier
  if (!data) {
    const legacyData = localStorage.getItem('job_search_os_profile_v19') || localStorage.getItem('job_search_os_profile_v18');
    if (legacyData) {
      try {
        const legacyParsed = JSON.parse(legacyData);
        const migrated: MasterProfile = {
          ...initialProfile,
          targetRoles: legacyParsed.targetRoles && legacyParsed.targetRoles.length > 0 ? legacyParsed.targetRoles : initialProfile.targetRoles,
          locationPreferences: legacyParsed.locationPreferences && legacyParsed.locationPreferences.length > 0 ? legacyParsed.locationPreferences : initialProfile.locationPreferences,
          preferredCity: legacyParsed.preferredCity || initialProfile.preferredCity,
          minSalary: legacyParsed.minSalary || initialProfile.minSalary,
          desiredSalary: legacyParsed.desiredSalary || initialProfile.desiredSalary
        };
        saveStoredProfile(migrated);
        try {
          localStorage.removeItem('job_search_os_profile_v19');
        } catch {
          // Ignore removal errors
        }
        return migrated;
      } catch {
        // Fallback to initialProfile
      }
    }
    saveStoredProfile(initialProfile);
    return initialProfile;
  }

  try {
    const parsed = JSON.parse(data);

    // Filter education: keep only legitimate university degrees, removing permaculture certificates or legacy combined IDs
    const validEducation = (parsed.education || initialProfile.education).filter((ed: any) =>
      ed && ed.id !== 'edu-permaculture-epac' && ed.id !== 'edu-msc-kiel-amu' && !ed.degree?.toLowerCase().includes('permaculture')
    );

    // Filter keyProjects: keep only software & digital twin platforms, never organizational campaigns
    const validKeyProjects = (parsed.keyProjects || initialProfile.keyProjects).filter((p: any) =>
      p && p.id !== 'proj-apruebo-rural' && p.id !== 'proj-primera-linea'
    );

    // Filter otherCourses: purge obsolete English duplicates
    const obsoleteCourseSnippets = [
      'green economy and financialization',
      'r modeling and gis satellite',
      'climate action plan design (climattereality',
      'curso de diseño en permacultura (epac chile, 2023)',
      'doughnut economics (deal copenhagen'
    ];
    const candidateCourses: string[] = (parsed.otherCourses && parsed.otherCourses.length > 0)
      ? parsed.otherCourses
      : initialProfile.otherCourses || [];

    const cleanedCourses = Array.from(new Set(candidateCourses)).filter((c: string) => {
      const lower = c.toLowerCase();
      return !obsoleteCourseSnippets.some(snippet => lower.includes(snippet));
    });

    const finalCourses = cleanedCourses.length >= 8 ? cleanedCourses : (initialProfile.otherCourses || []);

    const consolidated: MasterProfile = {
      ...initialProfile,
      ...parsed,
      education: validEducation.length >= 3 ? validEducation : initialProfile.education,
      experiences: (parsed.experiences && parsed.experiences.length >= 6) ? parsed.experiences : initialProfile.experiences,
      keyProjects: validKeyProjects.length >= 4 ? validKeyProjects : initialProfile.keyProjects,
      publications: (parsed.publications && parsed.publications.length >= 8) ? parsed.publications : initialProfile.publications,
      conferences: (parsed.conferences && parsed.conferences.length >= 4) ? parsed.conferences : initialProfile.conferences,
      achievementsBank: (parsed.achievementsBank && parsed.achievementsBank.length >= 8) ? parsed.achievementsBank : initialProfile.achievementsBank,
      skills: (parsed.skills && parsed.skills.length > 0) ? parsed.skills : initialProfile.skills,
      languages: initialProfile.languages,
      otherCourses: finalCourses,
      fieldEquipment: (parsed.fieldEquipment && parsed.fieldEquipment.length > 0) ? parsed.fieldEquipment : initialProfile.fieldEquipment,
      lastUpdated: initialProfile.lastUpdated
    };

    return consolidated;
  } catch {
    return initialProfile;
  }
};

export const saveStoredProfile = (profile: MasterProfile): void => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getStoredOffers = (): JobOffer[] => {
  const data = localStorage.getItem(KEYS.OFFERS);
  if (!data) {
    saveStoredOffers(initialOffers);
    return initialOffers;
  }
  try {
    const list: JobOffer[] = JSON.parse(data);
    const seen = new Set<string>();
    let modified = false;

    const deduplicated = list.filter(off => {
      // Purge stale remnant URLs or expired deadline calls
      if (off.url.includes('172409851294') || off.url.includes('172409851295') || off.url.includes('172409851296') || off.url.includes('fihac-14') || off.verificationStatus === 'Expirada' || off.title.includes('Associate Expert')) {
        modified = true;
        return false;
      }
      const key = `${(off.title || '').trim().toLowerCase()}||${(off.company || '').trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(off => {
      if (off.url === 'https://unjobs.org/vacancies/1786913775321' || off.title.includes('Programme Officer')) {
        modified = true;
        return {
          ...off,
          title: 'IMEO Methane Alert and Response System’s Implementation Coordinator',
          company: 'United Nations Environment Programme (UNEP)',
          location: 'París, Francia / Remoto Europa',
          url: 'https://unjobs.org/vacancies/1786913775321',
          rawDescription: 'UNEP IMEO (International Methane Emissions Observatory) busca Coordinador de Implementación del Sistema MARS (Methane Alert and Response System) para monitoreo satelital de emisiones, mitigación climática y gobernanza ambiental.',
          requirements: ['Monitoreo Satelital & Emisiones', 'Gobernanza Climática', 'Inglés C2 / Francés / Español', 'Ciencias Ambientales / Geofísica']
        };
      }
      return off;
    });

    // Ensure curated government offers from initialOffers exist
    initialOffers.forEach(initOff => {
      const exists = deduplicated.some(d => d.id === initOff.id || d.url === initOff.url);
      if (!exists) {
        deduplicated.unshift(initOff);
        modified = true;
      }
    });

    if (deduplicated.length !== list.length || modified) {
      saveStoredOffers(deduplicated);
    }
    return deduplicated;
  } catch {
    return initialOffers;
  }
};

export const saveStoredOffers = (offers: JobOffer[]): void => {
  // Only save valid, non-empty offers
  const validOffers = offers.filter(o => o.title && o.company);
  localStorage.setItem(KEYS.OFFERS, JSON.stringify(validOffers));
};

export const getStoredCompanies = (): CompanyDossier[] => {
  const data = localStorage.getItem(KEYS.COMPANIES);
  let list: CompanyDossier[] = [];
  
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) list = parsed;
    } catch {
      list = [];
    }
  }

  // Fallback to older keys if empty
  if (list.length === 0) {
    const historicalKeys = [
      'job_search_os_companies_v18',
      'job_search_os_companies_v17',
      'job_search_os_companies_v16',
      'job_search_os_companies_v15',
      'job_search_os_companies',
      'companies'
    ];
    for (const k of historicalKeys) {
      const oldData = localStorage.getItem(k);
      if (oldData) {
        try {
          const parsed = JSON.parse(oldData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            list = parsed;
            break;
          }
        } catch {
          // continue checking
        }
      }
    }
  }

  // Migración: eliminar contactos sembrados que no estaban verificados y corregir un id de convocatoria
  const UNVERIFIED_CONTACT_IDS = new Set(['cnt-gfz-1', 'cnt-gmc-1', 'cnt-iker-1']);
  let migrated = false;
  list = list.map(c => {
    const hasBad = (c.contacts || []).some(ct => UNVERIFIED_CONTACT_IDS.has(ct.id));
    const hasOldFundingId = (c.fundingTies || []).includes('f-ikerbasque-fellow');
    if (!hasBad && !hasOldFundingId) return c;
    migrated = true;
    return {
      ...c,
      contacts: (c.contacts || []).filter(ct => !UNVERIFIED_CONTACT_IDS.has(ct.id)),
      fundingTies: (c.fundingTies || []).map(id => id === 'f-ikerbasque-fellow' ? 'f-ikerbasque-fellowship' : id)
    };
  });
  if (migrated) saveStoredCompanies(list);

  // Sincronizar cuadrantes canónicos y clúster sectorial de initialCompanies si faltan o cambiaron
  const canonicalMap = new Map(initialCompanies.map(c => [c.id, c]));
  let enriched = false;
  list = list.map(c => {
    const canonical = canonicalMap.get(c.id);
    if (!canonical) return c;
    const quadsChanged = JSON.stringify(c.quadrants || []) !== JSON.stringify(canonical.quadrants || []);
    const clusterChanged = c.sectorCluster !== canonical.sectorCluster;
    if (quadsChanged || clusterChanged || !c.website) {
      enriched = true;
      return {
        ...c,
        quadrants: canonical.quadrants,
        sectorCluster: canonical.sectorCluster,
        website: c.website || canonical.website,
        headquarters: c.headquarters || canonical.headquarters
      };
    }
    return c;
  });
  if (enriched) saveStoredCompanies(list);

  // Ensure all authentic institutions & enterprises are populated without overwriting user customizations
  const existingIds = new Set(list.map(c => c.id));
  const existingNames = new Set(list.map(c => c.name.trim().toLowerCase()));
  const missing = initialCompanies.filter(c => !existingIds.has(c.id) && !existingNames.has(c.name.trim().toLowerCase()));

  if (missing.length > 0) {
    const merged = [...list, ...missing];
    saveStoredCompanies(merged);
    return merged;
  }

  if (list.length === 0) {
    saveStoredCompanies(initialCompanies);
    return initialCompanies;
  }

  return list;
};

export const saveStoredCompanies = (companies: CompanyDossier[]): void => {
  localStorage.setItem(KEYS.COMPANIES, JSON.stringify(companies));
};

export const getStoredApplications = (): ApplicationItem[] => {
  const data = localStorage.getItem(KEYS.APPLICATIONS);
  if (!data) {
    saveStoredApplications(initialApplications);
    return initialApplications;
  }
  try {
    const list: ApplicationItem[] = JSON.parse(data);
    return list;
  } catch {
    return initialApplications;
  }
};

export const saveStoredApplications = (apps: ApplicationItem[]): void => {
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
};

export const getStoredSources = (): JobSource[] => {
  const data = localStorage.getItem(KEYS.SOURCES);
  if (!data) {
    saveStoredSources(initialSources);
    return initialSources;
  }
  try {
    const list: JobSource[] = JSON.parse(data);
    let modified = false;
    const updated = list.map(src => {
      if (src.id === 'src-hacesfalta' && src.url !== 'https://www.hacesfalta.org/oportunidades/remuneradas/') {
        modified = true;
        return { ...src, url: 'https://www.hacesfalta.org/oportunidades/remuneradas/' };
      }
      if (src.id === 'src-ongdeuskadi' && src.url !== 'https://www.ongdeuskadi.org/empleo-ongd/') {
        modified = true;
        return { ...src, url: 'https://www.ongdeuskadi.org/empleo-ongd/' };
      }
      return src;
    });

    const existingIds = new Set(updated.map(s => s.id));
    const missing = initialSources.filter(s => !existingIds.has(s.id));
    if (missing.length > 0 || modified) {
      const merged = [...updated, ...missing];
      saveStoredSources(merged);
      return merged;
    }
    return updated.length > 0 ? updated : initialSources;
  } catch {
    return initialSources;
  }
};

export const saveStoredSources = (sources: JobSource[]): void => {
  localStorage.setItem(KEYS.SOURCES, JSON.stringify(sources));
};

export const updateSourceManualCheck = (sourceId: string): JobSource[] => {
  const sources = getStoredSources();
  const now = new Date().toISOString();
  const updated = sources.map(s => s.id === sourceId ? { ...s, lastManualCheck: now } : s);
  saveStoredSources(updated);
  return updated;
};

export const getStoredCVs = (): CVVersion[] => {
  const data = localStorage.getItem(KEYS.CVS);
  if (!data) {
    saveStoredCVs(initialCVs);
    return initialCVs;
  }
  try {
    const list: CVVersion[] = JSON.parse(data);
    return list.length > 0 ? list : initialCVs;
  } catch {
    return initialCVs;
  }
};

export const saveStoredCVs = (cvs: CVVersion[]): void => {
  localStorage.setItem(KEYS.CVS, JSON.stringify(cvs));
};

export const getStoredSettings = (): AppSettings => {
  const data = localStorage.getItem(KEYS.SETTINGS);
  if (!data) return defaultSettings;
  try {
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch {
    return defaultSettings;
  }
};

export const saveStoredSettings = (settings: AppSettings): void => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

const defaultDocs: any[] = [
  {
    pageId: 'dashboard',
    title: 'Centro de Mando & Panel Principal',
    summary: 'Vista ejecutiva del pipeline de empleo, estado de convocatorias, Match Scores y acceso a escaneos en tiempo real.',
    version: 'v4.5.0',
    lastUpdated: '2026-08-27',
    userSteps: [
      'Visualiza el resumen de ofertas activas, puntuaciones medias y candidaturas en progreso.',
      'Accede directamente al Protocolo SOLID mediante el botón "🛡️ Protocolo SOLID" en la barra superior.',
      'Lanza rastreos globales usando "⚡ Rastrear Todos los Portales en Vivo" o la barra de búsqueda.'
    ],
    agentDetails: 'Rastrea e indexa de forma autónoma portales registrados y subdominios ATS mediante Google Dorking.',
    keyFeatures: ['Resumen ejecutivo', 'Filtro por sedes', 'Acceso directo a escaneos']
  },
  {
    pageId: 'offers',
    title: 'Buscador & Procesamiento por Capas SOLID (5-Layer Pipeline)',
    summary: 'Filtro determinista anti-alucinaciones, detección de plazos de caducidad (Deadlines) y verificación de dominios oficiales.',
    version: 'v4.5.0',
    lastUpdated: '2026-08-27',
    userSteps: [
      'Navega por las convocatorias ordenadas por Match Score (0–100) con bonificación de residencia en Bilbao/Bizkaia.',
      'Pulsa "🛡️ Depurar Enlaces Caducados" para purgar enlaces 404 o convocatorias con plazo vencido.',
      'Filtra por modalidades (Remoto 100%, Euskadi/Bilbao, España, DACH/Alemania y sedes ONU).'
    ],
    agentDetails: 'Aplica el motor de 5 capas: 1) Ingesta Multi-Fuente, 2) Razonamiento Temporal (Deadline < hoy), 3) Integridad de Entidad y Sueldo Mínimo, 4) Encaje Semántico e Idiomas, 5) Seguridad de Despacho HTTP 200.',
    keyFeatures: ['5-Layer Reasoning Engine', 'Google ATS Dorking (Personio/Greenhouse/Workday)', 'Dead-link purge']
  },
  {
    pageId: 'companies',
    title: 'Fichas de Empresa & Inteligencia Corporativa I+D',
    summary: 'Investigación estratégica de centros de excelencia (ICTA-UAB, IMDEA Energía, BSC-CNS, IHCantabria/FIHAC, CREAF, EBD-CSIC, CEAB-CSIC, MNCN-CSIC) y think tanks europeos (Agora Think Tanks / Personio).',
    version: 'v4.5.0',
    lastUpdated: '2026-08-27',
    userSteps: [
      'Inspecciona las fichas técnicas de empresas, sectores, cultura de trabajo y proyectos clave.',
      'Haz clic en "Generar Reporte IA" para compilar un informe ejecutivo imprimible con argumentos de entrevista.',
      'Consulta las banderas rojas y la compatibilidad con tu perfil de Geofísico y Doble Máster.'
    ],
    agentDetails: 'El Researcher Agent compila argumentos para entrevista y verifica la autenticidad de los portales de carreras.',
    keyFeatures: ['Dossiers I+D', 'Generador de informes IA', 'Argumentos para entrevista']
  },
  {
    pageId: 'applications',
    title: 'Gestor de Candidaturas & Postulación en 9 Pasos',
    summary: 'Workflow estructurado de 9 etapas con control irreversible de Aprobación Humana Obligatoria en la Fase 7.',
    version: 'v4.5.0',
    lastUpdated: '2026-08-27',
    userSteps: [
      'Revisa las postulaciones creadas desde ofertas scouted o manuales.',
      'Modifica borradores de cartas de presentación y CVs adaptados en español, inglés o alemán.',
      'Revisa y confirma manualmente en el Paso 7 antes de cualquier envío o redirección.'
    ],
    agentDetails: 'Mantiene privada toda la información en localStorage y no realiza ningún envío automatizado a terceros sin tu clic explícito.',
    keyFeatures: ['Pipeline de 9 Pasos', 'CV Copilot Multilingüe', 'Gate de Aprobación Humana']
  },
  {
    pageId: 'sources',
    title: 'Directorio Maestro de Fuentes & Conectores ATS',
    summary: 'Catálogo de portales oficiales (Hacesfalta, ONGD Euskadi, LinkedIn, UNjobs, GreenJobs) y adaptadores de software ATS (Personio, Taleo, Workday).',
    version: 'v4.5.0',
    lastUpdated: '2026-08-27',
    userSteps: [
      'Agrega nuevos portales de empleo o subdominios ATS con su enlace directo.',
      'Activa o desactiva fuentes en función de tu estrategia de búsqueda.',
      'Verifica el estado de respuesta y última fecha de escaneo de cada portal.'
    ],
    agentDetails: 'Sincroniza dinámicamente con PortalAdapterRegistry para extraer vacantes en subdominios de selección corporativa.',
    keyFeatures: ['Portal Adapter Registry', 'Sincronización ATS', 'Gestión de fuentes']
  }
];

export const getStoredDocs = (): any[] => {
  const data = localStorage.getItem(KEYS.DOCS);
  if (!data) return defaultDocs;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultDocs;
  } catch {
    return defaultDocs;
  }
};

export const saveStoredDocs = (docs: any[]): void => {
  localStorage.setItem(KEYS.DOCS, JSON.stringify(docs));
};

export const getStoredCourseProgress = (): Record<string, UserCourseProgress> => {
  const data = localStorage.getItem(KEYS.ACADEMY_PROGRESS);
  if (!data) {
    saveStoredCourseProgress(INITIAL_COURSE_PROGRESS as Record<string, UserCourseProgress>);
    return INITIAL_COURSE_PROGRESS as Record<string, UserCourseProgress>;
  }
  try {
    const parsed = JSON.parse(data);
    return {
      ...(INITIAL_COURSE_PROGRESS as Record<string, UserCourseProgress>),
      ...parsed
    };
  } catch {
    return INITIAL_COURSE_PROGRESS as Record<string, UserCourseProgress>;
  }
};

export const saveStoredCourseProgress = (progress: Record<string, UserCourseProgress>): void => {
  localStorage.setItem(KEYS.ACADEMY_PROGRESS, JSON.stringify(progress));
};

export const setCourseStatus = (
  courseId: string, 
  status: CourseStatus, 
  progressPercent?: number, 
  notes?: string
): void => {
  const current = getStoredCourseProgress();
  const existing = current[courseId] || {
    courseId,
    status: 'AVAILABLE',
    progressPercent: 0
  };

  const updatedProgress: UserCourseProgress = {
    ...existing,
    courseId,
    status,
    progressPercent: progressPercent !== undefined 
      ? progressPercent 
      : status === 'COMPLETED' ? 100 : status === 'AVAILABLE' ? 0 : existing.progressPercent || 25,
    startedAt: status !== 'AVAILABLE' ? (existing.startedAt || new Date().toISOString().slice(0, 10)) : undefined,
    completedAt: status === 'COMPLETED' ? (existing.completedAt || new Date().toISOString().slice(0, 10)) : undefined,
    notes: notes !== undefined ? notes : existing.notes
  };

  current[courseId] = updatedProgress;
  saveStoredCourseProgress(current);
};

/**
 * Export complete verified database as JSON file for manual backup.
 */
export const exportCompleteUserDataBackup = (): string => {
  const backup = {
    exportedAt: new Date().toISOString(),
    version: '4.0',
    profile: getStoredProfile(),
    offers: getStoredOffers(),
    companies: getStoredCompanies(),
    applications: getStoredApplications(),
    sources: getStoredSources(),
    cvs: getStoredCVs(),
    docs: getStoredDocs(),
    settings: getStoredSettings(),
    academyProgress: getStoredCourseProgress()
  };
  return JSON.stringify(backup, null, 2);
};

export const exportFullBackup = exportCompleteUserDataBackup;

/**
 * Import and restore verified database from JSON backup file.
 */
export const restoreCompleteUserDataBackup = (jsonText: string): boolean => {
  try {
    const parsed = JSON.parse(jsonText);
    if (parsed.profile) saveStoredProfile(parsed.profile);
    if (parsed.offers) saveStoredOffers(parsed.offers);
    if (parsed.companies) saveStoredCompanies(parsed.companies);
    if (parsed.applications) saveStoredApplications(parsed.applications);
    if (parsed.sources) saveStoredSources(parsed.sources);
    if (parsed.cvs) saveStoredCVs(parsed.cvs);
    if (parsed.docs) saveStoredDocs(parsed.docs);
    if (parsed.settings) saveStoredSettings(parsed.settings);
    if (parsed.academyProgress) saveStoredCourseProgress(parsed.academyProgress);
    return true;
  } catch (err) {
    console.error('Failed to restore backup:', err);
    return false;
  }
};

export const importFullBackup = restoreCompleteUserDataBackup;

export const resetDatabase = (): void => {
  localStorage.clear();
  saveStoredProfile(initialProfile);
  saveStoredOffers(initialOffers);
  saveStoredCompanies(initialCompanies);
  saveStoredApplications(initialApplications);
  saveStoredSources(initialSources);
  saveStoredCourseProgress(INITIAL_COURSE_PROGRESS as Record<string, UserCourseProgress>);
};

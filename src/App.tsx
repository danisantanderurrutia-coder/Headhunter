import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { TacticalHelpAndProtocolModal } from './components/common/TacticalHelpAndProtocolModal';

import { WarRoomTab } from './components/warroom/WarRoomTab';
import { MarketRadarTab } from './components/radar/MarketRadarTab';
import { AgentDossierTab } from './components/dossier/AgentDossierTab';
import { GapCloserAcademyTab } from './components/academy/GapCloserAcademyTab';
import { MissionControlTab } from './components/control/MissionControlTab';
import { FundingTab } from './components/funding/FundingTab';
import { SettingsTab } from './components/settings/SettingsTab';

import { getStoredOffers, saveStoredOffers, getStoredProfile, getStoredApplications, saveStoredApplications, getStoredCompanies } from './services/db';
import { calculateMatchScore } from './services/matchEngine';
import { getStoredTheme, saveStoredTheme, applyThemeToDOM, type AppTheme } from './services/themeManager';
import { getDossierForOffer } from './services/jobWingmanService';
import { getSlugForState, parseSlugToState } from './utils/routes';
import type { JobOffer } from './types/offers';
import type { ApplicationItem } from './types/applications';

export function App() {
  const [theme, setTheme] = useState<AppTheme>(getStoredTheme());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [radarSubTab, setRadarSubTab] = useState<'organizations' | 'benchmark' | 'portals' | string>('organizations');
  const [radarLocationFilter, setRadarLocationFilter] = useState<string>('ALL');
  const [dossierSubTab, setDossierSubTab] = useState<'showcase' | 'skills' | 'profile' | 'cvs' | 'studio' | string>('showcase');
  const [studioOfferId, setStudioOfferId] = useState<string | undefined>();
  const [studioDocType, setStudioDocType] = useState<'cv' | 'cover_letter'>('cv');
  const [missionSubTab, setMissionSubTab] = useState<'applications' | 'batch' | 'intelligence'>('applications');
  const [academyTargetGap, setAcademyTargetGap] = useState<string | undefined>();

  const [isUnifiedHelpOpen, setIsUnifiedHelpOpen] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme: AppTheme = theme === 'arctic' ? 'cyber' : 'arctic';
    setTheme(nextTheme);
    saveStoredTheme(nextTheme);
  };

  const handleNavigate = (
    stationId: string,
    subTab?: string,
    filterParam?: string,
    targetOfferId?: string,
    targetDocType: 'cv' | 'cover_letter' = 'cv'
  ) => {
    if (targetOfferId) {
      setStudioOfferId(targetOfferId);
    }
    setStudioDocType(targetDocType);

    if (filterParam) {
      setRadarLocationFilter(filterParam);
    }

    let resolvedStation = stationId;
    let resolvedSubTab = subTab;

    if (stationId === 'market_radar' || ['offers', 'sources', 'companies', 'organizations', 'benchmark', 'portals'].includes(stationId)) {
      resolvedStation = 'market_radar';
      if (subTab === 'benchmark' || stationId === 'benchmark') resolvedSubTab = 'benchmark';
      else if (subTab === 'portals' || stationId === 'portals') resolvedSubTab = 'portals';
      else if (subTab === 'sources' || stationId === 'sources') resolvedSubTab = 'portals';
      else if (subTab === 'companies' || subTab === 'organizations' || stationId === 'companies' || stationId === 'organizations') resolvedSubTab = 'organizations';
      else if (subTab === 'offers' || stationId === 'offers') resolvedSubTab = 'organizations';
      else resolvedSubTab = 'organizations';
      setRadarSubTab(resolvedSubTab as 'organizations' | 'benchmark' | 'portals');
      setActiveTab('market_radar');
    } else if (stationId === 'agent_dossier' || ['showcase', 'gunsmith', 'skills', 'profile', 'expediente', 'cvs', 'studio', 'plantillas', 'cartas'].includes(stationId)) {
      resolvedStation = 'agent_dossier';
      if (subTab === 'gunsmith' || stationId === 'gunsmith' || subTab === 'cvs' || stationId === 'cvs' || subTab === 'plantillas' || stationId === 'plantillas' || subTab === 'cartas' || stationId === 'cartas') {
        resolvedSubTab = 'studio';
        if (filterParam && !targetOfferId) setStudioOfferId(filterParam);
      }
      else if (subTab === 'studio' || stationId === 'studio') {
        resolvedSubTab = 'studio';
        if (filterParam && !targetOfferId) setStudioOfferId(filterParam);
      }
      else if (subTab === 'skills' || stationId === 'skills') resolvedSubTab = 'showcase';
      else if (subTab === 'profile' || subTab === 'expediente' || stationId === 'profile' || stationId === 'expediente') resolvedSubTab = 'profile';
      else resolvedSubTab = 'showcase';
      setDossierSubTab(resolvedSubTab as 'showcase' | 'skills' | 'profile' | 'cvs' | 'studio');
      if (targetDocType) setStudioDocType(targetDocType);
      setActiveTab('agent_dossier');
    } else if (stationId === 'academy') {
      resolvedStation = 'academy';
      if (filterParam) setAcademyTargetGap(filterParam);
      setActiveTab('academy');
    } else if (stationId === 'mission_control' || ['applications', 'batch_applications', 'intelligence', 'pipeline', 'wingman'].includes(stationId)) {
      resolvedStation = 'mission_control';
      if (subTab === 'batch' || stationId === 'batch_applications') resolvedSubTab = 'batch';
      else if (subTab === 'intelligence' || stationId === 'intelligence' || stationId === 'wingman') resolvedSubTab = 'intelligence';
      else resolvedSubTab = 'applications';
      setMissionSubTab(resolvedSubTab as 'applications' | 'batch' | 'intelligence');
      setActiveTab('mission_control');
    } else {
      setActiveTab(stationId);
    }

    // Sincronizar slug en la URL del navegador sin recargar
    try {
      if (typeof window !== 'undefined' && window.history) {
        const slug = getSlugForState(resolvedStation, resolvedSubTab, targetDocType);
        const targetHash = `#${slug}`;
        if (window.location.hash !== targetHash) {
          window.history.replaceState(null, '', targetHash);
        }
      }
    } catch {
      // Ignorar en entornos sin DOM completo
    }
  };

  const handleRefreshData = () => {
    setDataRefreshKey(prev => prev + 1);
  };

  // Deep-linking inicial por URL hash o pathname
  useEffect(() => {
    try {
      const raw = window.location.hash || window.location.pathname;
      if (raw && raw !== '/' && raw !== '#/' && raw !== '') {
        const parsed = parseSlugToState(raw);
        if (parsed.station && parsed.station !== 'dashboard') {
          handleNavigate(parsed.station, parsed.subTab, undefined, undefined, parsed.docType || 'cv');
        }
      }
    } catch (e) {
      console.warn('Error resolviendo slug inicial:', e);
    }
  }, []);

  // Escuchar navegación con botones Atrás / Adelante del navegador
  useEffect(() => {
    const onHashChange = () => {
      const raw = window.location.hash;
      if (raw) {
        const parsed = parseSlugToState(raw);
        handleNavigate(parsed.station, parsed.subTab, undefined, undefined, parsed.docType || 'cv');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const importJob = params.get('importJob');
      if (importJob) {
        const parsed = JSON.parse(decodeURIComponent(importJob));
        const profile = getStoredProfile();
        const currentOffers = getStoredOffers();
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const partialOffer: Partial<JobOffer> = {
          id: `ext-${Date.now()}`,
          title: parsed.title || 'Oferta Importada',
          company: parsed.company || 'Empresa Detectada',
          location: parsed.location || 'Bilbao / Remoto',
          isBilbaoLocation: (parsed.location || '').toLowerCase().includes('bilbao') || (parsed.location || '').toLowerCase().includes('bizkaia'),
          isRemote: (parsed.location || '').toLowerCase().includes('remoto') || (parsed.location || '').toLowerCase().includes('remote'),
          url: parsed.url || window.location.href,
          sourceId: 'src-extension-import',
          sourceName: 'Extensión Empleo (Navegador)',
          publishedDate: timestamp.split(' ')[0],
          rawDescription: parsed.rawDescription || parsed.description || '',
          requirements: [],
          responsibilities: [],
          status: 'Nueva',
          extractedAt: timestamp,
          isVerified: true,
          verificationStatus: 'Vigente y Verificada'
        };
        const matchScore = calculateMatchScore(partialOffer, profile);
        const newOffer: JobOffer = {
          ...partialOffer,
          matchScore
        } as JobOffer;
        saveStoredOffers([newOffer, ...currentOffers]);
        handleNavigate('market_radar', 'offers');
        // Clean URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn('Error importing job from query parameter:', e);
    }
  }, []);

  const handleStartApplicationFromOffer = (offerId: string) => {
    const currentOffers = getStoredOffers();
    const targetOffer = currentOffers.find(o => o.id === offerId);
    if (targetOffer) {
      const currentApps = getStoredApplications();
      const existing = currentApps.find(a => a.offerId === offerId);
      if (!existing) {
        const dossier = getDossierForOffer(targetOffer);
        const lead = dossier.leadProfile;
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const newApp: ApplicationItem = {
          id: `CAND-${Date.now().toString().slice(-6)}`,
          offerId: targetOffer.id,
          offerTitle: targetOffer.title,
          companyName: targetOffer.company,
          location: targetOffer.location,
          currentStage: 1,
          status: 'En Progreso',
          createdDate: timestamp.split(' ')[0],
          updatedDate: timestamp.split(' ')[0],
          offerUrl: targetOffer.url,
          decisionMakerName: lead.name ? `${lead.titleHonorific ? lead.titleHonorific + ' ' : ''}${lead.name}`.trim() : undefined,
          decisionMakerRole: lead.role || undefined,
          decisionMakerEmail: lead.email || undefined,
          decisionMakerChannel: lead.email ? 'Email' : 'LinkedIn',
          directPitchHook: dossier.candidateValueThesis || dossier.technicalHooks?.[0] || undefined,
          selectedCapabilities: targetOffer.requirements || [],
          humanApprovalGranted: false,
          adaptedCvSummary: targetOffer.requirements || [],
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp,
              stage: 1,
              title: `Oferta registrada desde el Radar`,
              actor: 'Usuario'
            }
          ]
        };
        saveStoredApplications([newApp, ...currentApps]);
      }
    }
    handleNavigate('mission_control', 'applications');
  };

  const handleStartPipelineFromCompany = (companyId: string) => {
    const currentCompanies = getStoredCompanies();
    const targetCompany = currentCompanies.find(c => c.id === companyId);
    if (targetCompany) {
      const currentApps = getStoredApplications();
      const existing = currentApps.find(a => a.companyName.toLowerCase() === targetCompany.name.toLowerCase());
      if (!existing) {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const primaryContact = targetCompany.contacts?.[0];
        const newApp: ApplicationItem = {
          id: `CAND-CO-${Date.now().toString().slice(-6)}`,
          offerId: `co-${targetCompany.id}`,
          offerTitle: `Prospección Táctica // ${targetCompany.name}`,
          companyName: targetCompany.name,
          location: targetCompany.headquarters || 'DACH / Euskadi',
          currentStage: 1,
          status: 'En Progreso',
          createdDate: timestamp.split(' ')[0],
          updatedDate: timestamp.split(' ')[0],
          offerUrl: targetCompany.website,
          decisionMakerName: primaryContact?.name || undefined,
          decisionMakerRole: primaryContact?.role || undefined,
          decisionMakerEmail: primaryContact?.email || undefined,
          decisionMakerLinkedin: primaryContact?.linkedinUrl || undefined,
          decisionMakerChannel: primaryContact?.email ? 'Email' : 'LinkedIn',
          directPitchHook: targetCompany.keyProjects?.length 
            ? `Prospección en ${targetCompany.keyProjects.slice(0, 2).join(' y ')} con background cuantitativo en geofísica ambiental.` 
            : `Prospección directa y análisis de dolor técnico en ${targetCompany.name}.`,
          selectedCapabilities: targetCompany.techStack || ['Geofísica Ambiental', 'Sensorica In-Situ', 'Modelado R/Python'],
          humanApprovalGranted: false,
          adaptedCvSummary: [
            `Identificación de decisores en ${targetCompany.name}`,
            `Sede: ${targetCompany.headquarters}`
          ],
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp,
              stage: 1,
              title: `Prospección de Cuenta Diana iniciada desde Mercado (${targetCompany.name})`,
              actor: 'Usuario'
            }
          ]
        };
        saveStoredApplications([newApp, ...currentApps]);
      }
    }
    handleNavigate('mission_control', 'applications');
  };

  const handleStartApplicationFromFunding = (fundingTitle: string, org: string) => {
    const currentApps = getStoredApplications();
    const existing = currentApps.find(a => a.offerTitle === fundingTitle && a.companyName === org);
    if (!existing) {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const newApp = {
        id: `CAND-FUND-${Date.now().toString().slice(-6)}`,
        offerId: `fund-${Date.now()}`,
        offerTitle: fundingTitle,
        companyName: org,
        location: 'Convocatoria I+D (UE / DACH / Euskadi)',
        currentStage: 1 as const,
        status: 'En Progreso' as const,
        createdDate: timestamp.split(' ')[0],
        updatedDate: timestamp.split(' ')[0],
        humanApprovalGranted: false,
        adaptedCvSummary: ['Convocatoria I+D / Beca de Excelencia'],
        history: [
          {
            id: `h-${Date.now()}`,
            timestamp,
            stage: 1 as const,
            title: `Convocatoria registrada para postulación (${fundingTitle})`,
            actor: 'Usuario' as const
          }
        ]
      };
      saveStoredApplications([newApp, ...currentApps]);
    }
    handleNavigate('mission_control', 'applications');
  };

  return (
    <div 
      className={`min-h-screen w-full bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-sky-500 selection:text-white theme-${theme} transition-colors duration-300 relative overflow-x-hidden`} 
      data-theme={theme}
    >
      {/* Tactical Snow Atmosphere Layer (Rainbow Six Operation Black Ice / Chalet) */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${
          theme === 'arctic' ? 'tactical-snow-atmosphere opacity-90' : 'tactical-dark-snow-atmosphere opacity-95'
        }`}
      />

      {/* High-tech Technical Coordinate & Compass Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 tactical-grid-overlay opacity-40" />

      {/* Main Content with Relative Stacking */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar
          currentTab={activeTab}
          currentTheme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenUnifiedHelp={() => setIsUnifiedHelpOpen(true)}
          onSelectStation={(id, subTab) => handleNavigate(id, subTab)}
        />

        <div className="flex-1 flex overflow-hidden w-full">
          <main key={dataRefreshKey} className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-w-none">
            {activeTab === 'dashboard' && (
              <WarRoomTab
                onSelectStation={(station, subTab, filter) => handleNavigate(station, subTab, filter)}
                onLaunchRadar={() => handleNavigate('market_radar', 'offers', 'ALL')}
              />
            )}

            {activeTab === 'market_radar' && (
              <MarketRadarTab
                initialSubTab={radarSubTab}
                initialFilter={radarLocationFilter}
                onSubTabChange={(sub) => handleNavigate('market_radar', sub)}
                onStartApplication={handleStartApplicationFromOffer}
                onStartPipelineFromCompany={handleStartPipelineFromCompany}
                onOpenStudio={(offerId, docType) => handleNavigate('agent_dossier', 'studio', undefined, offerId, docType)}
              />
            )}

            {(activeTab === 'funding' || activeTab === 'convocatorias') && (
              <FundingTab
                onStartApplication={handleStartApplicationFromFunding}
              />
            )}

            {activeTab === 'agent_dossier' && (
              <AgentDossierTab
                initialSubTab={dossierSubTab}
                initialStudioOfferId={studioOfferId}
                initialStudioDocType={studioDocType}
                onSubTabChange={(sub) => handleNavigate('agent_dossier', sub)}
                onDocTypeChange={(docType) => handleNavigate('agent_dossier', 'studio', undefined, undefined, docType)}
                onOpenSettings={() => handleNavigate('settings')}
                onNavigateToAcademy={(gapId) => handleNavigate('academy', undefined, gapId)}
              />
            )}

            {activeTab === 'academy' && (
              <GapCloserAcademyTab
                initialGapId={academyTargetGap}
                onNavigateToSkillTree={() => handleNavigate('agent_dossier', 'showcase')}
              />
            )}

            {activeTab === 'mission_control' && (
              <MissionControlTab
                initialSubTab={missionSubTab}
                onSubTabChange={(sub) => handleNavigate('mission_control', sub)}
                onOpenStudio={(offerId, docType) => handleNavigate('agent_dossier', 'studio', undefined, offerId, docType)}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                onRefreshData={handleRefreshData}
                onReturnToHub={() => handleNavigate('agent_dossier')}
              />
            )}
          </main>
        </div>

        <TacticalHelpAndProtocolModal
          isOpen={isUnifiedHelpOpen}
          onClose={() => setIsUnifiedHelpOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;

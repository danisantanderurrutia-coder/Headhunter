import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Compass, 
  Globe2,
  TrendingUp
} from 'lucide-react';
import { CompaniesTab } from '../companies/CompaniesTab';
import { DailyPortalsRadar } from './DailyPortalsRadar';
import { ClusterBenchmarkTable } from './ClusterBenchmarkTable';
import { getStoredCompanies } from '../../services/db';
import { DAILY_PORTALS } from '../../data/dailyPortalsCatalog';
import type { CompanySectorCluster, QuadrantType } from '../../types/companies';

interface MarketRadarTabProps {
  initialSubTab?: 'organizations' | 'benchmark' | 'portals' | string;
  initialFilter?: string;
  onSubTabChange?: (subTab: 'organizations' | 'benchmark' | 'portals') => void;
  onStartApplication?: (offerId: string) => void;
  onStartPipelineFromCompany?: (companyId: string) => void;
  onOpenStudio?: (offerId?: string, docType?: 'cv' | 'cover_letter') => void;
  onReturnToHub?: () => void;
}

export const MarketRadarTab: React.FC<MarketRadarTabProps> = ({ 
  initialSubTab = 'organizations', 
  initialFilter = 'ALL',
  onSubTabChange,
  onStartApplication,
  onStartPipelineFromCompany,
  onReturnToHub: _onReturnToHub
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'organizations' | 'benchmark' | 'portals'>(
    initialSubTab === 'portals' ? 'portals' :
    initialSubTab === 'benchmark' ? 'benchmark' : 'organizations'
  );
  const [drilldownQuadrant, setDrilldownQuadrant] = useState<string>(initialFilter);
  const [drilldownSectorCluster, setDrilldownSectorCluster] = useState<CompanySectorCluster>('ALL');

  useEffect(() => {
    if (initialSubTab === 'portals') setActiveSubTab('portals');
    else if (initialSubTab === 'benchmark') setActiveSubTab('benchmark');
    else if (initialSubTab === 'organizations') setActiveSubTab('organizations');
  }, [initialSubTab]);

  const handleSubTabChange = (tab: 'organizations' | 'benchmark' | 'portals') => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
  };

  const companies = getStoredCompanies();
  const portalsCount = DAILY_PORTALS.length;

  const handleBenchmarkDrilldown = (cluster: CompanySectorCluster, quadrant: QuadrantType) => {
    setDrilldownQuadrant(quadrant);
    setDrilldownSectorCluster(cluster);
    handleSubTabChange('organizations');
  };

  return (
    <div className="space-y-4 text-[var(--text-primary)] animate-fadeIn">
      {/* Top Bar with Title and SubTab Switcher */}
      <div 
        className="flex flex-col md:flex-row md:items-center justify-between p-3.5 sm:p-4 rounded-2xl border shadow-xl backdrop-blur-md gap-3 transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/30 shrink-0">
            <Compass className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-black text-[var(--text-primary)] flex items-center gap-2 font-mono uppercase tracking-tight">
                MERCADO // PROSPECCIÓN & CUADRANTES
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-bold hidden sm:inline-block">
                DIRECTA
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {activeSubTab === 'organizations' && `Directorio de ${companies.length} centros de I+D, institutos públicos e ingenierías (Euskadi • DACH • Europa)`}
              {activeSubTab === 'portals' && `${portalsCount} radares oficiales de rastreo matutino directo y sin ofertas fantasma`}
              {activeSubTab === 'benchmark' && 'Matriz algorítmica de probabilidad y viabilidad regulatoria (3 a 6 meses)'}
            </p>
          </div>
        </div>

        {/* SubTab Switcher: Ordered & Non-Wrapping Segmented Control */}
        <div 
          className="flex items-center p-1 rounded-xl border gap-1 self-start md:self-auto shrink-0 shadow-inner overflow-x-auto max-w-full"
          style={{ 
            backgroundColor: 'var(--panel-bg)', 
            borderColor: 'var(--panel-border)' 
          }}
        >
          <button
            onClick={() => handleSubTabChange('organizations')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'organizations'
                ? 'bg-sky-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>ORGANIZACIONES ({companies.length})</span>
          </button>

          <button
            onClick={() => handleSubTabChange('portals')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'portals'
                ? 'bg-sky-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Globe2 className="h-4 w-4" />
            <span>PORTALES DIARIOS ({portalsCount})</span>
          </button>

          <button
            onClick={() => handleSubTabChange('benchmark')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'benchmark'
                ? 'bg-sky-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>BENCHMARK (3-6M)</span>
          </button>
        </div>
      </div>

      {/* Main SubTab Content */}
      {activeSubTab === 'organizations' && (
        <CompaniesTab
          onStartPipeline={onStartPipelineFromCompany || ((companyId) => {
            if (onStartApplication) onStartApplication(companyId);
          })}
          initialQuadrant={drilldownQuadrant}
          initialSectorCluster={drilldownSectorCluster}
        />
      )}

      {activeSubTab === 'benchmark' && (
        <ClusterBenchmarkTable onSelectClusterFilter={handleBenchmarkDrilldown} />
      )}

      {activeSubTab === 'portals' && (
        <DailyPortalsRadar />
      )}
    </div>
  );
};

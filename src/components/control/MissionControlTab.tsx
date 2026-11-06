import React, { useState, useEffect } from 'react';
import { 
  Send, 
  KanbanSquare, 
  LineChart
} from 'lucide-react';
import { ApplicationsTab } from '../applications/ApplicationsTab';
import { IntelligenceTab } from '../intelligence/IntelligenceTab';

interface MissionControlTabProps {
  initialSubTab?: 'applications' | 'intelligence' | string;
  onSubTabChange?: (subTab: 'applications' | 'intelligence') => void;
  onReturnToHub?: () => void;
  onOpenStudio?: (offerId: string, docType?: 'cv' | 'cover_letter') => void;
}

export const MissionControlTab: React.FC<MissionControlTabProps> = ({ 
  initialSubTab = 'applications',
  onSubTabChange,
  onReturnToHub: _onReturnToHub,
  onOpenStudio
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'intelligence'>(
    initialSubTab === 'intelligence' ? 'intelligence' : 'applications'
  );

  useEffect(() => {
    if (initialSubTab === 'intelligence') setActiveSubTab('intelligence');
    else if (initialSubTab === 'applications') setActiveSubTab('applications');
  }, [initialSubTab]);

  const handleSubTabChange = (tab: 'applications' | 'intelligence') => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
  };

  return (
    <div className="space-y-5 text-[var(--text-primary)] animate-fadeIn">
      {/* Tactical Top Bar & Pipeline Indicator */}
      <div 
        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border shadow-xl backdrop-blur-md gap-4 transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
            <Send className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2 font-mono uppercase tracking-tight">
              CANDIDATURAS // PIPELINE DEFINITIVO & PROSPECCIÓN
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Flujo híbrido de 8 etapas: Cuenta Diana ➔ Oferta ➔ Decisor ➔ CV Transdisciplinar ➔ Gancho & Carta ➔ Despacho ➔ Seguimiento.
            </p>
          </div>
        </div>

        {/* SubTab switcher */}
        <div 
          className="flex items-center p-1 rounded-xl border self-start md:self-auto shrink-0 shadow-inner"
          style={{ 
            backgroundColor: 'var(--panel-bg)', 
            borderColor: 'var(--panel-border)' 
          }}
        >
          <button
            onClick={() => handleSubTabChange('applications')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeSubTab === 'applications'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <KanbanSquare className="h-4 w-4" />
            <span>PIPELINE DEFINITIVO</span>
          </button>

          <button
            onClick={() => handleSubTabChange('intelligence')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeSubTab === 'intelligence'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LineChart className="h-4 w-4" />
            <span>ASESOR ESTRATÉGICO</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'applications' && (
        <ApplicationsTab onOpenStudio={onOpenStudio} />
      )}

      {activeSubTab === 'intelligence' && (
        <IntelligenceTab />
      )}
    </div>
  );
};

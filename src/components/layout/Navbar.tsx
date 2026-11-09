import React, { useEffect, useState } from 'react';
import { 
  Crosshair,
  ShieldCheck, 
  Sun, 
  Moon
} from 'lucide-react';
import type { AppTheme } from '../../services/themeManager';
import { resolveAsset } from '../../utils/assets';

interface NavTabItem {
  id: string;
  label: string;
  matches: string[];
}

const NAV_TABS: NavTabItem[] = [
  { id: 'market_radar', label: 'MERCADO', matches: ['market_radar', 'offers', 'sources', 'companies'] },
  { id: 'agent_dossier', label: 'PERFIL', matches: ['agent_dossier', 'profile', 'cvs', 'studio', 'showcase', 'gunsmith', 'skills', 'settings'] },
  { id: 'funding', label: 'CONVOCATORIAS', matches: ['funding', 'convocatorias'] },
  { id: 'academy', label: 'ACADEMIA', matches: ['academy', 'courses', 'cursos'] }
];

interface NavbarProps {
  currentTab: string;
  currentTheme?: AppTheme;
  onToggleTheme?: () => void;
  onOpenUnifiedHelp: () => void;
  onSelectStation?: (stationId: string, subTab?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  currentTheme = 'arctic',
  onToggleTheme,
  onOpenUnifiedHelp,
  onSelectStation
}) => {
  const [logoError, setLogoError] = useState(false);

  // F1 Help shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'F1') {
        e.preventDefault();
        onOpenUnifiedHelp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenUnifiedHelp]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-md text-[var(--text-primary)] font-mono transition-colors">
      
      {/* 1. Left: Brand Header returning to Career Home */}
      <button
        onClick={() => onSelectStation && onSelectStation('dashboard')}
        className={`flex items-center space-x-3 cursor-pointer group text-left focus:outline-none shrink-0 px-2 py-1 -ml-2 rounded-xl transition ${
          currentTab === 'dashboard'
            ? 'bg-sky-500/10 border border-sky-500/40 shadow-xs'
            : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
        }`}
        title="Consola Central de Operaciones (Click para volver al inicio)"
      >
        <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl overflow-hidden flex items-center justify-center shadow-inner shrink-0 transition bg-[#060910] p-0.5 ${
          currentTab === 'dashboard'
            ? 'ring-2 ring-cyan-500/50 border border-cyan-400'
            : 'border border-cyan-500/30 group-hover:border-cyan-400'
        }`}>
          {!logoError ? (
            <img 
              src={resolveAsset('/headhunter_os_logo.jpg')} 
              alt="Headhunter OS Logo" 
              onError={() => setLogoError(true)}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <Crosshair className="h-6 w-6 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
          )}
        </div>
        <div>
          <h1 className="font-black text-base sm:text-lg tracking-tight text-[var(--text-primary)] font-sans group-hover:text-cyan-500 transition">
            HEADHUNTER OS
          </h1>
          <p className="text-[10px] text-[var(--text-muted)] font-mono hidden sm:block">
            Consola de Prospección Directa & Executive Search
          </p>
        </div>
      </button>

      {/* 2. Center: Authentic Tactical Menu Bar */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 text-xs uppercase tracking-wider font-mono">
        {/* Tab Buttons */}
        <nav className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
          {NAV_TABS.map((tab) => {
            const isActive = tab.matches.includes(currentTab);
            return (
              <button
                key={tab.id}
                onClick={() => onSelectStation && onSelectStation(tab.id)}
                className={`relative py-1.5 px-2.5 sm:px-3 md:px-3.5 transition-all duration-150 flex items-center justify-center cursor-pointer group focus:outline-none ${
                  isActive
                    ? 'text-[var(--text-primary)] font-black'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold'
                }`}
                title={tab.label}
              >
                <span className="font-mono text-xs sm:text-[13px] tracking-[0.14em] uppercase font-black transition-colors">
                  {tab.label}
                </span>

                {/* Rainbow Six Siege Iconic Red Tactical Underline & Notch */}
                {isActive && (
                  <>
                    <div className="absolute -bottom-2.5 left-0 right-0 h-[3px] bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rotate-45" />
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Right: Operator Clearance & Tactical HUD Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        
        {/* Tactical Theme Toggle (Nieve / Noche) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-xl border border-[var(--panel-border)] bg-[var(--card-bg)] hover:border-sky-500 transition cursor-pointer font-mono font-bold shadow-sm text-[var(--text-primary)]"
            title={currentTheme === 'arctic' ? 'Cambiar a Noche Táctica (Operaciones Nocturnas)' : 'Cambiar a Nieve Táctica (Operaciones de Invierno / Alto Contraste)'}
          >
            {currentTheme === 'arctic' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-sky-600" />
                <span className="hidden md:inline text-[11px]">❄️ Nieve</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-purple-400" />
                <span className="hidden md:inline text-[11px]">🌙 Noche</span>
              </>
            )}
          </button>
        )}

        {/* Protocol Button ([F1]) */}
        <button
          onClick={onOpenUnifiedHelp}
          className="flex items-center space-x-1.5 text-xs text-[var(--text-primary)] bg-[var(--card-bg)] hover:bg-[var(--panel-bg)] px-3 py-1.5 rounded-xl border border-[var(--panel-border)] hover:border-emerald-500 transition cursor-pointer font-mono font-bold shadow-sm"
          title="Ver el Protocolo Táctico Anti-Alucinaciones & Visados [Tecla F1]"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline text-[11px]">Protocolo</span>
        </button>
      </div>

    </header>
  );
};

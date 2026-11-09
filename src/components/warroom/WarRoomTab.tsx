import React from 'react';
import { 
  Sparkles, 
  Award, 
  Target, 
  ArrowRight,
  Compass,
  Building2,
  Globe2,
  GraduationCap,
  FileText
} from 'lucide-react';
import { getStoredProfile, getStoredCompanies } from '../../services/db';
import { FUNDING_CATALOG } from '../../data/fundingCatalog';
import { DAILY_PORTALS } from '../../data/dailyPortalsCatalog';
import { inferCompanyQuadrants } from '../../utils/quadrants';
import { TacticalGlobeHUD } from './TacticalGlobeHUD';
import { resolveAsset } from '../../utils/assets';

interface WarRoomTabProps {
  onSelectStation: (stationId: string, subTab?: string, filter?: string) => void;
  onLaunchRadar: () => void;
}

export const WarRoomTab: React.FC<WarRoomTabProps> = ({ onSelectStation, onLaunchRadar }) => {
  const profile = getStoredProfile();
  const companies = getStoredCompanies();

  // Compute live data metrics for organizations
  const dachCompanies = companies.filter(c => inferCompanyQuadrants(c).includes('DACH'));
  const euskadiCompanies = companies.filter(c => inferCompanyQuadrants(c).includes('EUSKADI'));
  const globalCompanies = companies.filter(c => inferCompanyQuadrants(c).includes('GLOBAL'));

  // Funding metrics
  const totalFundingCount = FUNDING_CATALOG.length;
  const germanyFunding = FUNDING_CATALOG.filter(f => f.region === 'germany').length;
  const europeFunding = FUNDING_CATALOG.filter(f => f.region === 'europe').length;
  const euskadiFunding = FUNDING_CATALOG.filter(f => f.region === 'euskadi').length;

  // High-fidelity photographic assets
  const backgroundWall = 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80';
  const professionalResearcher = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
  const droneScreen = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';
  const earthObservation = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80';
  const biogeoLab = 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80';
  const germanyTech = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
  const euskadiTech = 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* =========================================================================
       * 1. TITULO PRINCIPAL DE PÁGINA (CAREER)
       * ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/90 dark:border-slate-800 pb-4 gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden shadow-lg border border-cyan-500/40 shrink-0 bg-[#090b0e] flex items-center justify-center p-0.5 group">
            <img 
              src={resolveAsset('/headhunter_os_logo.jpg')} 
              alt="Headhunter OS Logo" 
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = resolveAsset('/app_icon.svg');
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider uppercase text-red-500 font-bold mb-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>EXPEDIENTE PROFESIONAL // {profile.fullName || 'DANIEL SANTANDER'}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-sans drop-shadow-xs">
              CAREER
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">RADAR ACTIVO:</span>
            <span>DACH • EUSKADI • GLOBAL</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. TELEMETRÍA OPERATIVA DE ALTO NIVEL (KPIs EJECUTIVOS)
       * ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Organizaciones Diana */}
        <div 
          onClick={() => onSelectStation('market_radar', 'organizations')}
          className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-cyan-500 transition cursor-pointer group"
          title="Ver Organizaciones y Centros I+D por Cuadrante"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Organizaciones Diana</span>
            <Building2 className="h-4 w-4 text-cyan-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
            {companies.length} Entidades
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{dachCompanies.length} DACH • {euskadiCompanies.length} Euskadi</span>
          </div>
        </div>

        {/* Card 2: Fondos I+D */}
        <div 
          onClick={() => onSelectStation('funding', 'convocatorias')}
          className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500 transition cursor-pointer group"
          title="Explorar Fondos I+D y convocatorias de investigación"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Fondos I+D</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
            {totalFundingCount} Convocatorias
          </div>
          <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold mt-1 flex items-center gap-1">
            <span>{europeFunding} Horizon • {germanyFunding} DFG/DAAD • {euskadiFunding} Hazitek</span>
          </div>
        </div>

        {/* Card 3: Portales Diarios */}
        <div 
          onClick={() => onSelectStation('market_radar', 'portals')}
          className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-500 transition cursor-pointer group"
          title="Abrir tarjetas de portales diarios"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Portales Diarios</span>
            <Compass className="h-4 w-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
            {DAILY_PORTALS.length} Portales
          </div>
          <div className="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-bold mt-1 flex items-center gap-1">
            <span>LinkedIn • XING • EURAXESS • DFG</span>
          </div>
        </div>

        {/* Card 4: CV Studio & Cartas */}
        <div 
          onClick={() => onSelectStation('agent_dossier', 'studio')}
          className="p-4 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-500 transition cursor-pointer group"
          title="Abrir Taller de CV y Cartas de Presentación (ES • EN • DE)"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Taller CV & Cartas</span>
            <FileText className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
            CV Studio
          </div>
          <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold mt-1 flex items-center gap-1">
            <span>ES • EN • DE (Auditoría Anti-IA)</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 3. THE AUTHENTIC CAREER DASHBOARD (EXPEDIENTE PROFESIONAL)
       * ========================================================================= */}
      <div 
        className="relative rounded-3xl overflow-hidden p-6 md:p-8 text-white font-sans border border-slate-700/80 shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11, 18, 32, 0.92), rgba(7, 11, 20, 0.96)), url('${backgroundWall}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40 mix-blend-overlay" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* =========================================================
           * COLUMN 1 (LEFT, 3 COLS): FONDOS I+D + RADAR DE CUADRANTES
           * ========================================================= */}
          <div className="md:col-span-3 flex flex-col justify-between gap-4">
            
            {/* Tile 1.1: FONDOS I+D */}
            <div 
              onClick={() => onSelectStation('funding')}
              className="bg-[#121a2a]/95 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-xl flex flex-col justify-between min-h-[195px] relative overflow-hidden group hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition cursor-pointer"
              title="Click para explorar Convocatorias y Subvenciones I+D"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-100 group-hover:text-amber-300 transition flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>FONDOS I+D</span>
                </span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600">
                  {totalFundingCount} PROGRAMAS
                </span>
              </div>

              <div className="flex flex-col items-center justify-center my-1.5 text-center">
                <div className="text-3xl font-black text-amber-400 font-sans tracking-tight drop-shadow-md">
                  {totalFundingCount} Programas
                </div>
                <div className="text-[11px] font-mono font-black text-white uppercase tracking-wider mt-0.5">
                  BOLSA DE FONDOS DISPONIBLES
                </div>
                <div className="text-[10px] font-mono text-slate-300 mt-1">
                  {germanyFunding} DACH • {europeFunding} Horizon UE • {euskadiFunding} Euskadi
                </div>
              </div>

              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 flex">
                  <div className="h-full bg-amber-400" style={{ width: `${Math.round((germanyFunding / (totalFundingCount || 1)) * 100)}%` }} title="DACH / DFG / DAAD" />
                  <div className="h-full bg-sky-400" style={{ width: `${Math.round((europeFunding / (totalFundingCount || 1)) * 100)}%` }} title="Horizon Europe" />
                  <div className="h-full bg-emerald-400" style={{ width: `${Math.round((euskadiFunding / (totalFundingCount || 1)) * 100)}%` }} title="Euskadi Hazitek" />
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-300 flex items-center justify-between">
                  <span>HORIZON • DFG • HAZITEK</span>
                  <span className="text-amber-400 font-mono group-hover:translate-x-0.5 transition-transform">VER CONVOCATORIAS »</span>
                </div>
              </div>
            </div>

            {/* Tile 1.2: ECOSISTEMA DE CUADRANTES */}
            <div 
              onClick={onLaunchRadar}
              className="rounded-2xl p-5 border border-slate-700 shadow-xl min-h-[195px] flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-cyan-400 transition"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(10, 16, 26, 0.95), rgba(10, 16, 26, 0.55)), url('${droneScreen}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex items-center space-x-1.5 z-10">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-white drop-shadow">
                  CUADRANTES DIANA
                </span>
                <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-cyan-600 text-white shadow">
                  PROSPECCIÓN
                </span>
              </div>

              <div className="flex flex-col items-center justify-center my-2 z-10 text-center">
                <Building2 className="h-9 w-9 text-slate-200 group-hover:text-cyan-300 transition mb-1 drop-shadow" />
                <span className="text-sm font-mono font-black text-white uppercase tracking-wider drop-shadow">
                  {companies.length} ORGANIZACIONES
                </span>
                <span className="text-[11px] text-slate-200 font-mono font-medium drop-shadow mt-0.5">
                  {dachCompanies.length} DACH • {euskadiCompanies.length} Euskadi • {globalCompanies.length} Global
                </span>
              </div>

              <div className="text-[11px] font-mono font-bold text-cyan-300 flex items-center justify-between z-10 border-t border-slate-700/80 pt-2">
                <span>DIRECTORIO ESTRATÉGICO</span>
                <span>EXPLORAR »</span>
              </div>
            </div>
          </div>

          {/* =========================================================
           * COLUMN 2 (CENTER, 4 COLS): EXPEDIENTE CIENTÍFICO + TRACK RECORD
           * ========================================================= */}
          <div className="md:col-span-4 flex flex-col justify-between gap-4">
            
            {/* Tile 2.1: EXPEDIENTE CIENTÍFICO */}
            <div 
              onClick={() => onSelectStation('agent_dossier', 'showcase')}
              className="rounded-2xl p-5 border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] min-h-[195px] flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-white hover:scale-[1.01] transition"
              title="Click para ver Atributos y Titulaciones"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(220, 38, 38, 0.95) 0%, rgba(185, 28, 28, 0.55) 35%, rgba(10, 14, 22, 0.65) 100%), url('${professionalResearcher}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white drop-shadow">
                  EXPEDIENTE CIENTÍFICO
                </span>
              </div>

              <div className="flex flex-col items-center justify-center my-1 z-10">
                <div className="w-12 h-12 rounded-xl bg-black/60 border-2 border-white flex items-center justify-center shadow-xl mb-1 group-hover:scale-105 transition">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow">
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M8 11l4 3 4-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M8 8l4 3 4-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                <h3 className="text-base font-black text-white uppercase tracking-wider font-sans drop-shadow text-center">
                  GEOFÍSICO & GESTIÓN AMBIENTAL
                </h3>
                <span className="text-[10.5px] font-mono text-white font-extrabold uppercase tracking-widest drop-shadow bg-black/40 px-2 py-0.5 rounded mt-0.5">
                  DOBLE M.SC. KIEL • POZNAŃ • U. CHILE
                </span>
              </div>

              <div className="text-[11px] font-mono font-black text-white text-center z-10 border-t border-red-300/40 pt-1.5 drop-shadow flex items-center justify-between">
                <span>HABILITADO PARA MOVILIDAD UE</span>
                <span>EXPEDIENTE »</span>
              </div>
            </div>

            {/* Tile 2.2: TALLER CV & CARTAS */}
            <div 
              onClick={() => onSelectStation('agent_dossier', 'studio')}
              className="rounded-2xl p-5 border border-slate-700 shadow-xl min-h-[195px] flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(15, 12, 28, 0.95), rgba(15, 12, 28, 0.65)), url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              title="Click para abrir CV Studio y Cartas de Presentación"
            >
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-white drop-shadow">
                    CV STUDIO & CARTAS
                  </span>
                  <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-purple-600 text-white shadow">
                    ES • EN • DE
                  </span>
                </div>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40">
                  ANTI-IA
                </span>
              </div>

              <div className="flex flex-col items-center justify-center my-2 z-10 text-center">
                <FileText className="h-9 w-9 text-purple-400 group-hover:scale-110 transition mb-1 drop-shadow" />
                <span className="text-sm font-mono font-black text-white uppercase tracking-wider drop-shadow">
                  TALLER DE REDACCIÓN TÁCTICA
                </span>
                <span className="text-[11px] text-slate-200 font-mono font-medium drop-shadow mt-0.5">
                  Hechos Verificados • Auditoría de Tono • Exportación PDF
                </span>
              </div>

              <div className="text-[11px] font-mono font-bold text-purple-400 flex items-center justify-between z-10 border-t border-slate-700/80 pt-2">
                <span>ESTUDIO DE CANDIDATURAS</span>
                <span>REDACTAR »</span>
              </div>
            </div>
          </div>

          {/* =========================================================
           * COLUMN 3 (RIGHT, 5 COLS): ESTADÍSTICAS DEL ECOSISTEMA
           * ========================================================= */}
          <div className="md:col-span-5 bg-[#121a2a]/95 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-xl flex flex-col justify-between gap-3.5">
            
            <div className="border-b border-slate-700/80 pb-2.5 flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider">
                    ESTADÍSTICAS DEL ECOSISTEMA
                  </h3>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800">
                    REAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5 leading-tight">
                  Organizaciones y centros I+D verificados en tus clústeres clave.
                </p>
              </div>
            </div>

            {/* Block 1: 3 Quadrant Cards */}
            <div className="space-y-1.5 border-b border-slate-700/80 pb-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                <span>ORGANIZACIONES POR CUADRANTE</span>
                <span className="text-emerald-400">{companies.length} TOTAL</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => onSelectStation('market_radar', 'organizations', 'DACH')}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-teal-500 transition text-left cursor-pointer group"
                >
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-teal-400 transition">DACH</div>
                  <div className="text-2xl font-black text-teal-400 font-sans">{dachCompanies.length}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">GFZ • UFZ Leipzig • Thünen</div>
                </button>

                <button 
                  onClick={() => onSelectStation('market_radar', 'organizations', 'EUSKADI')}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 transition text-left cursor-pointer group"
                >
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-emerald-400 transition">Euskadi</div>
                  <div className="text-2xl font-black text-emerald-400 font-sans">{euskadiCompanies.length}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">BC3 • Tecnalia • Neiker</div>
                </button>

                <button 
                  onClick={() => onSelectStation('market_radar', 'portals')}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-sky-400 transition text-left cursor-pointer group"
                >
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-sky-300 transition">Portales</div>
                  <div className="text-2xl font-black text-sky-400 font-sans">{DAILY_PORTALS.length}</div>
                  <div className="text-[9px] text-sky-400/80 font-mono mt-0.5 truncate">Rastreo diario</div>
                </button>
              </div>
            </div>

            {/* Block 2: Geographical Clustered Buttons */}
            <div className="space-y-1.5 border-b border-slate-700/80 pb-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                <span>TEATROS DE OPERACIONES & MARCO LEGAL</span>
                <span className="text-sky-300">MOVILIDAD UE</span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button 
                  onClick={() => onSelectStation('market_radar', 'organizations', 'EUSKADI')}
                  className="p-2 rounded-xl border border-slate-700 hover:border-emerald-500 transition text-left cursor-pointer relative overflow-hidden shadow group"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.75) 100%), url('${euskadiTech}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title="Explorar Euskadi"
                >
                  <div className="text-[10px] text-slate-300 font-bold truncate">📍 Euskadi</div>
                  <div className="font-bold text-white text-sm">{euskadiCompanies.length} centros</div>
                  <div className="text-[8.5px] text-emerald-400 font-mono truncate mt-0.5">Ley 14/2013 • BRTA</div>
                </button>

                <button 
                  onClick={() => onSelectStation('market_radar', 'organizations', 'DACH')}
                  className="p-2 rounded-xl border border-slate-700 hover:border-teal-500 transition text-left cursor-pointer relative overflow-hidden shadow group"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.75) 100%), url('${germanyTech}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title="Explorar Alemania / DACH"
                >
                  <div className="text-[10px] text-slate-300 font-bold truncate">🇩🇪 DACH §20</div>
                  <div className="font-bold text-white text-sm">{dachCompanies.length} centros</div>
                  <div className="text-[8.5px] text-teal-400 font-mono truncate mt-0.5">Blue Card • TVöD</div>
                </button>

                <button 
                  onClick={() => onSelectStation('market_radar', 'organizations', 'REMOTE')}
                  className="p-2 rounded-xl border border-slate-700 hover:border-sky-500 transition text-left cursor-pointer relative overflow-hidden shadow group"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.75) 100%), url('${earthObservation}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title="Explorar Global & Remoto"
                >
                  <div className="text-[10px] text-slate-300 font-bold truncate">🌐 Global / UE</div>
                  <div className="font-bold text-white text-sm">{globalCompanies.length} entidades</div>
                  <div className="text-[8.5px] text-sky-400 font-mono truncate mt-0.5">Consorcios clima</div>
                </button>
              </div>
            </div>

            {/* Block 3: Operator Specialization Cards */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                <span>CAPACIDADES TRANSDISCIPLINARES</span>
                <span className="text-slate-400">PORTAFOLIO ACTIVO</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => onSelectStation('agent_dossier', 'showcase')}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 transition flex items-center space-x-2.5 text-left cursor-pointer group shadow"
                  title="Geofísica & Teledetección"
                >
                  <img 
                    src={earthObservation} 
                    alt="Geofísica Spec" 
                    className="w-10 h-10 rounded-lg object-cover border border-slate-600 group-hover:border-sky-400 shrink-0" 
                  />
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-white truncate group-hover:text-sky-300">GEOFÍSICA & GIS</div>
                    <div className="text-[9.5px] font-mono text-slate-400 truncate">U. de Chile • 2018</div>
                    <div className="text-[9.5px] font-mono text-emerald-400 font-bold truncate">R • Python • QGIS • GEE</div>
                  </div>
                </button>

                <button 
                  onClick={() => onSelectStation('agent_dossier', 'showcase')}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 transition flex items-center space-x-2.5 text-left cursor-pointer group shadow"
                  title="Gestión Ambiental & Turberas"
                >
                  <img 
                    src={biogeoLab} 
                    alt="Gestión Ambiental Spec" 
                    className="w-10 h-10 rounded-lg object-cover border border-slate-600 group-hover:border-emerald-400 shrink-0" 
                  />
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-white truncate group-hover:text-emerald-300">TURBERAS & CLIMA</div>
                    <div className="text-[9.5px] font-mono text-slate-400 truncate">M.Sc. CAU Kiel • Poznań</div>
                    <div className="text-[9.5px] font-mono text-teal-400 font-bold truncate">Eddy Covariance • GEI</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 4. DIRECTIVAS TÁCTICAS & ACCESOS DIRECTOS DE ACCIÓN RÁPIDA
       * ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 w-full md:w-auto">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white font-sans uppercase tracking-tight">
              Directivas de Operación Rápida
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Acceso directo a las estaciones centrales de trabajo
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => onSelectStation('market_radar', 'organizations')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200"
          >
            <Building2 className="h-3.5 w-3.5 text-cyan-400" />
            <span>[1] Organizaciones Diana</span>
          </button>

          <button
            onClick={() => onSelectStation('market_radar', 'portals')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200"
          >
            <Globe2 className="h-3.5 w-3.5 text-sky-400" />
            <span>[2] Portales Diarios</span>
          </button>

          <button
            onClick={() => onSelectStation('funding', 'convocatorias')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200"
          >
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span>[3] Fondos I+D</span>
          </button>

          <button
            onClick={() => onSelectStation('agent_dossier', 'academy')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200"
          >
            <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
            <span>[4] Radar Academy</span>
          </button>

          <button
            onClick={() => onSelectStation('agent_dossier', 'studio')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>[5] Taller CV & Cartas</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
       * 5. VISOR PLANETARIO (MAPA MUNDI REALISTA THREE.JS NASA 4K)
       * ========================================================================= */}
      <div>
        <TacticalGlobeHUD 
          onDeploySector={(sector) => {
            if (sector === 'kiel') onSelectStation('market_radar', 'organizations', 'GERMANY');
            else if (sector === 'bilbao') onSelectStation('market_radar', 'organizations', 'EUSKADI');
            else onSelectStation('market_radar', 'organizations');
          }}
        />
      </div>

      {/* =========================================================================
       * 6. RADAR LIVE DISPATCH // TERMINAL DE ALERTAS OPERATIVAS
       * ========================================================================= */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-slate-300 shadow-md">
        <div className="flex items-center gap-2 text-cyan-400 font-bold shrink-0">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span>SISTEMA OPERATIVO // PROSPECCIÓN DIRECTA:</span>
        </div>
        <div className="overflow-hidden truncate text-[11px] text-slate-400">
          <span className="text-teal-400 font-bold">[DACH]</span> GFZ Potsdam, UFZ Leipzig y PIK Potsdam mapeados • <span className="text-emerald-400 font-bold">[EUSKADI]</span> Centros BRTA (BC3, Tecnalia, Neiker) e Ikerbasque • <span className="text-sky-400 font-bold">[GLOBAL]</span> Consorcios y fondos Horizon Europe listos para co-diseño.
        </div>
        <div className="text-[10px] text-slate-500 shrink-0 font-bold uppercase">
          100% DATOS LOCALES
        </div>
      </div>

    </div>
  );
};

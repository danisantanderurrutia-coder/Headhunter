import React, { useEffect, useState } from 'react';
import { 
  UserCheck, 
  FileCheck2, 
  GraduationCap, 
  Eye,
  Printer,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Nut
} from 'lucide-react';
import { MasterProfileTab } from '../profile/MasterProfileTab';
import { CVStudioTab } from '../cvs/CVStudioTab';
import { CVPreviewModal } from '../cvs/CVPreviewModal';
import { SkillTreeTab } from './SkillTreeTab';
import { getStoredProfile, getStoredCVs } from '../../services/db';
import type { CVVersion } from '../../types/cv';
import danielProfileImg from '../../assets/daniel_santander_profile.jpg';

interface AgentDossierTabProps {
  initialSubTab?: 'showcase' | 'skills' | 'profile' | 'cvs' | 'studio' | string;
  initialStudioOfferId?: string;
  initialStudioDocType?: 'cv' | 'cover_letter';
  onSubTabChange?: (subTab: 'showcase' | 'profile' | 'studio') => void;
  onDocTypeChange?: (docType: 'cv' | 'cover_letter') => void;
  onReturnToHub?: () => void;
  onOpenSettings?: () => void;
  onNavigateToAcademy?: (gapId?: string) => void;
}

export const AgentDossierTab: React.FC<AgentDossierTabProps> = ({ 
  initialSubTab = 'showcase',
  initialStudioOfferId,
  initialStudioDocType,
  onSubTabChange,
  onDocTypeChange,
  onReturnToHub: _onReturnToHub,
  onOpenSettings,
  onNavigateToAcademy
}) => {
  const normalizedInitial = (
    initialSubTab === 'skills' ? 'showcase' : 
    initialSubTab === 'cvs' ? 'studio' : 
    initialSubTab === 'expediente' ? 'profile' :
    initialSubTab
  ) as 'showcase' | 'profile' | 'studio';

  const [activeSubTab, setActiveSubTab] = useState<'showcase' | 'profile' | 'studio'>(normalizedInitial);
  const [previewingCv, setPreviewingCv] = useState<CVVersion | null>(null);

  useEffect(() => {
    if (initialSubTab === 'skills') setActiveSubTab('showcase');
    else if (initialSubTab === 'cvs') setActiveSubTab('studio');
    else if (initialSubTab === 'profile' || initialSubTab === 'expediente') setActiveSubTab('profile');
    else if (initialSubTab === 'studio') setActiveSubTab('studio');
    else if (initialSubTab === 'showcase') setActiveSubTab('showcase');
  }, [initialSubTab]);

  const handleSubTabChange = (tab: 'showcase' | 'profile' | 'studio') => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
  };

  const profile = getStoredProfile();
  const cvList = getStoredCVs();

  // Loadout selections
  const cvEs = cvList.find(c => c.language === 'es') || cvList[0];
  const cvEn = cvList.find(c => c.language === 'en') || cvList[1] || cvList[0];
  const cvDe = cvList.find(c => c.language === 'de') || cvList[2] || cvList[0];

  // Official portrait of Daniel Santander Urrutia
  const tacticalOperative = danielProfileImg;

  return (
    <div className="space-y-5 text-[var(--text-primary)] animate-fadeIn">
      {/* Top Header Bar */}
      <div 
        className="flex flex-col lg:flex-row lg:items-center justify-between p-3.5 sm:p-4 rounded-2xl border shadow-xl backdrop-blur-md gap-3 transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/30 shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black text-[var(--text-primary)] flex items-center gap-2 font-sans uppercase tracking-tight truncate">
              Expediente y Perfil Profesional
            </h1>
            <p className="text-[11px] text-[var(--text-secondary)] font-sans truncate">
              Daniel Santander: Doble M.Sc. CAU Kiel • Geofísica U. de Chile • Calibración Curricular Modular.
            </p>
          </div>
        </div>

        {/* Right side: Sub-Tabs Switcher & Perno / Settings Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sub-Tabs Switcher (Unified 3 core views) */}
          <div 
            className="flex items-center p-1 rounded-xl border gap-1 shrink-0 overflow-x-auto max-w-full"
            style={{ 
              backgroundColor: 'var(--panel-bg)', 
              borderColor: 'var(--panel-border)' 
            }}
          >
            <button
              onClick={() => handleSubTabChange('showcase')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'showcase'
                  ? 'bg-sky-600 text-white shadow font-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Resumen & Competencias</span>
            </button>

            <button
              onClick={() => handleSubTabChange('profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'profile'
                  ? 'bg-sky-600 text-white shadow font-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Expediente Maestro</span>
            </button>

            <button
              onClick={() => handleSubTabChange('studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'studio'
                  ? 'bg-sky-600 text-white shadow font-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>CV & Cartas Studio</span>
            </button>
          </div>

          {/* Botón de Perno: Ajustes */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group hover:border-sky-500 focus:outline-none shrink-0"
              style={{
                backgroundColor: 'var(--panel-bg)',
                borderColor: 'var(--panel-border)',
                color: 'var(--text-primary)'
              }}
              title="Ajustes del Sistema (IA, Alertas, Pipeline y Copias de Seguridad)"
              aria-label="Ajustes del Sistema"
            >
              <Nut className="h-4 w-4 text-sky-500 group-hover:rotate-90 transition-transform duration-300 shrink-0" />
              <span className="hidden sm:inline font-mono text-xs font-bold">Ajustes</span>
            </button>
          )}
        </div>
      </div>

      {/* ==============================================================
       * VISTA PRINCIPAL: RESUMEN DE EXPEDIENTE PROFESIONAL
       * ============================================================== */}
      {activeSubTab === 'showcase' && (
        <div className="space-y-6">
          <div 
            className="relative rounded-3xl overflow-hidden p-6 border shadow-2xl select-none transition-colors"
          style={{
            backgroundColor: 'var(--panel-bg)',
            borderColor: 'var(--panel-border)'
          }}
        >
          {/* Subtle Scanlines & Tactical Grid */}
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-20 mix-blend-overlay" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* --------------------------------------------------------
             * COL 1 (LEFT, 4 COLS): ATTRIBUTES, SPECIALIZATIONS & VISA
             * -------------------------------------------------------- */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              {/* Identity Header */}
              <div 
                className="rounded-2xl p-5 border shadow-xl space-y-3 transition-colors"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--card-border)' 
                }}
              >
                <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2.5">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                      CIENTÍFICO AMBIENTAL & GEOFÍSICO
                    </span>
                    <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight font-sans">
                      {profile.fullName || 'DANIEL SANTANDER'}
                    </h2>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                  Científico Ambiental y Geofísico con Doble M.Sc. en Alemania (CAU Kiel) y Polonia (AMU Poznań). Especialista en modelación cuantitativa de carbono, balances hidrológicos y gobernanza socio-ecológica.
                </div>

                {/* Mobility & Legal Status */}
                <div className="pt-2 border-t border-[var(--panel-border)] space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Estatus Migratorio & Movilidad UE
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div 
                      className="p-2 rounded-lg border"
                      style={{ 
                        backgroundColor: 'var(--panel-bg)', 
                        borderColor: 'var(--panel-border)' 
                      }}
                    >
                      <div className="text-[9px] text-[var(--text-muted)] uppercase">Alemania</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">§20 AufenthG</div>
                    </div>
                    <div 
                      className="p-2 rounded-lg border"
                      style={{ 
                        backgroundColor: 'var(--panel-bg)', 
                        borderColor: 'var(--panel-border)' 
                      }}
                    >
                      <div className="text-[9px] text-[var(--text-muted)] uppercase">España</div>
                      <div className="font-bold text-sky-600 dark:text-sky-400">Ley 14 / PAC</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attributes Radar & Competencies Matrix */}
              <div 
                className="rounded-2xl p-5 border shadow-xl space-y-3 flex-1 flex flex-col justify-between transition-colors"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--card-border)' 
                }}
              >
                <div className="border-b border-[var(--panel-border)] pb-2">
                  <h3 className="text-xs font-mono font-black text-[var(--text-primary)] uppercase tracking-wider">
                    MATRIZ DE ATRIBUTOS TÉCNICOS
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    CALIBRACIÓN BASADA EN PROYECTOS VERIFICADOS
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[var(--text-secondary)] font-bold">Modelación Espacial (R, Python, GIS, GEE)</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">98%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/10 dark:bg-slate-900 rounded-full overflow-hidden border border-[var(--card-border)]">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[var(--text-secondary)] font-bold">Biogeoquímica & Dinámica de Carbono</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">94%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/10 dark:bg-slate-900 rounded-full overflow-hidden border border-[var(--card-border)]">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[var(--text-secondary)] font-bold">Gobernanza Socio-Ecológica & Políticas</span>
                      <span className="text-sky-600 dark:text-sky-400 font-extrabold">90%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/10 dark:bg-slate-900 rounded-full overflow-hidden border border-[var(--card-border)]">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[var(--text-secondary)] font-bold">Rigor Académico Europeo (Kiel / Poznań)</span>
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold">96%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/10 dark:bg-slate-900 rounded-full overflow-hidden border border-[var(--card-border)]">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                </div>

                {/* Languages Matrix */}
                <div className="pt-2 border-t border-[var(--panel-border)] flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                  <span>Español: <strong>C2 Nativo</strong></span>
                  <span>•</span>
                  <span>English: <strong>C2 Bilingüe / CEMS</strong></span>
                  <span>•</span>
                  <span>Deutsch: <strong>B1</strong></span>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------
             * COL 2 (CENTER, 4 COLS): PERFIL ACTIVO DEL ESPECIALISTA
             * -------------------------------------------------------- */}
            <div className="lg:col-span-4 rounded-2xl border-2 border-amber-500/70 shadow-[0_0_35px_rgba(245,158,11,0.25)] relative overflow-hidden flex flex-col justify-between min-h-[460px] group">
              {/* Operative Background Image */}
              <div 
                className="absolute inset-0 z-0 bg-cover transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(10, 15, 25, 0.95) 0%, rgba(10, 15, 25, 0.25) 50%, rgba(10, 15, 25, 0.75) 100%), url('${tacticalOperative}')`,
                  backgroundPosition: 'center 20%'
                }}
              />

              {/* Holographic Tactical Reticle & Crosshair */}
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-amber-500/20 border-dashed animate-[spin_20s_linear_infinite]" />
                <div className="w-64 h-64 rounded-full border border-amber-500/10 border-dashed animate-[spin_35s_linear_infinite_reverse]" />
              </div>

              {/* Top Banner inside Hero */}
              <div className="relative z-20 p-4 flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-400">
                  OPERATOR // PERFIL ACTIVO
                </span>
                <span className="text-[10px] font-mono font-extrabold text-white drop-shadow">
                  CLEARANCE 50
                </span>
              </div>

              {/* Center Nameplate */}
              <div className="relative z-20 text-center px-4 mt-auto mb-2">
                <h3 className="text-xl font-black text-white uppercase tracking-wider font-sans drop-shadow-lg">
                  {profile.fullName || 'Daniel Santander Urrutia'}
                </h3>
                <span className="text-xs font-mono text-amber-300 font-extrabold uppercase tracking-widest drop-shadow bg-black/60 px-3 py-1 rounded mt-1 inline-block">
                  DOBLE M.SC. KIEL • POZNAŃ • U. DE CHILE
                </span>
                <div className="text-[10px] font-mono text-amber-400/90 font-bold tracking-widest uppercase mt-1 drop-shadow">
                  ELITE SCIENTIFIC OPERATIVE • CLEARANCE 50
                </div>
              </div>

              {/* Bottom Hero Control Bar */}
              <div className="relative z-20 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-2">
                <button
                  onClick={() => setActiveSubTab('profile')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>ABRIR EXPEDIENTE DETALLADO</span>
                </button>
              </div>
            </div>

            {/* --------------------------------------------------------
             * COL 3 (RIGHT, 4 COLS): WEAPONRY & LOADOUT SELECTION (CVS)
             * -------------------------------------------------------- */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              {/* Tactical Weaponry / Loadout Card */}
              <div 
                className="rounded-2xl p-5 border shadow-xl space-y-3 flex-1 flex flex-col justify-between transition-colors"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--card-border)' 
                }}
              >
                <div className="border-b border-[var(--panel-border)] pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-black text-[var(--text-primary)] uppercase tracking-wider">
                      VERSIONES DE CV // FORMATOS POR REGIÓN
                    </h3>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      DOCUMENTACIÓN COMPILADA & VERIFICADA
                    </span>
                  </div>
                  <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>

                <div className="space-y-3">
                  {/* Loadout 1: ES */}
                  <div 
                    className="p-3.5 rounded-xl border hover:border-amber-500 transition group"
                    style={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      borderColor: 'var(--panel-border)' 
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                        🇪🇸 VERSIÓN 1: ESPAÑOL (EUSKADI & ESPAÑA)
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        LISTO
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] font-sans mb-2">
                      Optimizado para I+D vasco (BC3, Tecnalia, IDOM, Neiker) y convocatorias de Ley 14.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewingCv(cvEs)}
                        className="flex-1 py-1 px-2.5 rounded-lg text-[11px] font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer border"
                        style={{ 
                          backgroundColor: 'var(--card-bg)', 
                          borderColor: 'var(--panel-border)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Ver CV</span>
                      </button>
                      <button
                        onClick={() => {
                          setPreviewingCv(cvEs);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-mono font-black transition flex items-center justify-center gap-1 cursor-pointer shadow"
                        title="Imprimir / Exportar a PDF"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Loadout 2: EN */}
                  <div 
                    className="p-3.5 rounded-xl border hover:border-amber-500 transition group"
                    style={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      borderColor: 'var(--panel-border)' 
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                        🇬🇧 VERSIÓN 2: INGLÉS (POLÍTICA INTERNACIONAL & I+D)
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        LISTO
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] font-sans mb-2">
                      Formato internacional para think-tanks, consultorías climáticas y teletrabajo europeo.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewingCv(cvEn)}
                        className="flex-1 py-1 px-2.5 rounded-lg text-[11px] font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer border"
                        style={{ 
                          backgroundColor: 'var(--card-bg)', 
                          borderColor: 'var(--panel-border)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Ver CV</span>
                      </button>
                      <button
                        onClick={() => {
                          setPreviewingCv(cvEn);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-mono font-black transition flex items-center justify-center gap-1 cursor-pointer shadow"
                        title="Imprimir / Exportar a PDF"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Loadout 3: DE */}
                  <div 
                    className="p-3.5 rounded-xl border hover:border-amber-500 transition group"
                    style={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      borderColor: 'var(--panel-border)' 
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                        🇩🇪 VERSIÓN 3: ALEMÁN (§20 AUFENTHG / DACH)
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        LISTO
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] font-sans mb-2">
                      Lebenslauf estructurado con foco en instituciones alemanas y centros de investigación.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewingCv(cvDe)}
                        className="flex-1 py-1 px-2.5 rounded-lg text-[11px] font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer border"
                        style={{ 
                          backgroundColor: 'var(--card-bg)', 
                          borderColor: 'var(--panel-border)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Ver CV</span>
                      </button>
                      <button
                        onClick={() => {
                          setPreviewingCv(cvDe);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-mono font-black transition flex items-center justify-center gap-1 cursor-pointer shadow"
                        title="Imprimir / Exportar a PDF"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Switch to Full CV Armory */}
                <div className="pt-2 border-t border-[var(--panel-border)]">
                  <button
                    onClick={() => setActiveSubTab('studio')}
                    className="w-full py-2 rounded-xl font-mono font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border"
                    style={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      borderColor: 'var(--panel-border)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <FileCheck2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>ACCEDER A CV & CARTAS STUDIO</span>
                  </button>
                </div>
              </div>

              {/* Verified Deployments Badge Box */}
              <div 
                className="rounded-2xl p-4 border shadow-xl space-y-2 transition-colors"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--card-border)' 
                }}
              >
                <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>HITOS ACADÉMICOS Y CIENTÍFICOS VERIFICADOS</span>
                </div>
                <div className="text-xs text-[var(--text-secondary)] space-y-1 font-sans">
                  <div>🎓 <strong>CAU Kiel / AMU Poznań</strong>: Doble M.Sc. Gestión & Protección Ambiental</div>
                  <div>🔬 <strong>Universidad de Chile</strong>: Licenciatura en Geofísica (Con Distinción)</div>
                  <div>🛰️ <strong>5+ Años de Experiencia</strong>: Proyectos en Euskadi, Alemania y Latinoamérica</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTOR COMPETENCIAS DIRECTAMENTE DEBAJO DEL RESUMEN */}
        <SkillTreeTab onNavigateToAcademy={onNavigateToAcademy} />
      </div>
      )}

      {/* SUB-PANEL 2: MASTER PROFILE DETAILED FORM */}
      {activeSubTab === 'profile' && (
        <div className="space-y-4">
          <MasterProfileTab />
        </div>
      )}

      {/* SUB-PANEL 3: CV STUDIO (A4, datos verificados, adaptación por oferta y plantillas) */}
      {activeSubTab === 'studio' && (
        <div className="space-y-4">
          <CVStudioTab 
            initialOfferId={initialStudioOfferId} 
            initialDocType={initialStudioDocType} 
            onDocTypeChange={onDocTypeChange}
          />
        </div>
      )}

      {/* CV Preview & Print Modal */}
      <CVPreviewModal
        cv={previewingCv}
        isOpen={!!previewingCv}
        onClose={() => setPreviewingCv(null)}
      />
    </div>
  );
};

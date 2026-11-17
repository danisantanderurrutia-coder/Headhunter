import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Zap, 
  X,
  BookOpen,
  Filter
} from 'lucide-react';
import { ACADEMY_COURSES } from '../../data/academyCourses';
import { getStoredCourseProgress, setCourseStatus } from '../../services/db';
import type { AcademyBranch, CourseCostType, CourseStatus } from '../../types/academy';

interface GapCloserAcademyTabProps {
  initialGapId?: string;
  onNavigateToSkillTree?: () => void;
}

// 7 Disciplinas auténticas + Alemán C1 con diseño de alto contraste diurno y nocturno
const BRANCH_CONFIG: Record<AcademyBranch, { 
  label: string; 
  shortLabel: string; 
  icon: string; 
  color: string; 
  badgeClass: string;
  activePillClass: string;
}> = {
  geophysics: {
    label: 'Geofísica & Sensores Remotos',
    shortLabel: 'Geofísica',
    icon: '🛰️',
    color: '#059669',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500/30',
    activePillClass: 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
  },
  biogeo: {
    label: 'Biogeoquímica, Suelos & Agua',
    shortLabel: 'Suelos & Agua',
    icon: '💧',
    color: '#0891b2',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-500/30',
    activePillClass: 'bg-cyan-700 dark:bg-cyan-600 text-white border-cyan-700 dark:border-cyan-600 shadow-sm'
  },
  software: {
    label: 'Product Owner, Software & IA',
    shortLabel: 'Software & IA',
    icon: '⚡',
    color: '#2563eb',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-500/30',
    activePillClass: 'bg-blue-600 text-white border-blue-600 shadow-sm'
  },
  pm: {
    label: 'Gestión de Proyectos, I+D & Consorcios',
    shortLabel: 'Gestión I+D',
    icon: '🧭',
    color: '#d97706',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-500/30',
    activePillClass: 'bg-amber-600 text-white border-amber-600 shadow-sm'
  },
  grassroots: {
    label: 'Grassroots, Territorio & Regeneración',
    shortLabel: 'Grassroots',
    icon: '🌱',
    color: '#65a30d',
    badgeClass: 'bg-lime-50 text-lime-900 border-lime-300 dark:bg-lime-950/40 dark:text-lime-300 dark:border-lime-500/30',
    activePillClass: 'bg-lime-700 dark:bg-lime-600 text-white border-lime-700 dark:border-lime-600 shadow-sm'
  },
  culture: {
    label: 'Cultura, Políticas & CSRD',
    shortLabel: 'Políticas & CSRD',
    icon: '🏛️',
    color: '#9333ea',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-500/30',
    activePillClass: 'bg-purple-600 text-white border-purple-600 shadow-sm'
  },
  comms: {
    label: 'Comunicaciones, Prensa & Campañas',
    shortLabel: 'Prensa & Campañas',
    icon: '📢',
    color: '#ea580c',
    badgeClass: 'bg-orange-50 text-orange-900 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-500/30',
    activePillClass: 'bg-orange-600 text-white border-orange-600 shadow-sm'
  },
  languages: {
    label: 'Alemán C1 & Cooperación DACH',
    shortLabel: 'Alemán C1',
    icon: '🇩🇪',
    color: '#0284c7',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-500/30',
    activePillClass: 'bg-sky-600 text-white border-sky-600 shadow-sm'
  }
};

export const GapCloserAcademyTab: React.FC<GapCloserAcademyTabProps> = ({
  initialGapId,
  onNavigateToSkillTree: _onNavigateToSkillTree
}) => {
  const [courseProgress, setCourseProgressState] = useState(getStoredCourseProgress());
  
  // Selected Branch Filter: 'ALL' | 'ONLY_GAPS' | AcademyBranch
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>(initialGapId ? 'ONLY_GAPS' : 'ALL');
  const [selectedCostFilter, setSelectedCostFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGapFilter, setActiveGapFilter] = useState<string | undefined>(initialGapId);

  // Synchronize state and storage
  const handleUpdateStatus = (
    courseId: string, 
    newStatus: CourseStatus, 
    newPercent?: number, 
    notes?: string
  ) => {
    setCourseStatus(courseId, newStatus, newPercent, notes);
    setCourseProgressState({ ...getStoredCourseProgress() });
  };

  // Helper predicates for multilateral platforms
  const isEsaCourse = (c: { url: string; provider: string }) =>
    c.url.includes('eo-college.org') || c.provider.includes('EO College') || c.provider.includes('ESA');

  const isEuCourse = (c: { url: string; provider: string }) =>
    c.url.includes('academy.europa.eu') || c.provider.includes('EU Academy') || c.provider.includes('Comisión Europea');

  const isFaoCourse = (c: { url: string }) =>
    c.url.includes('elearning.fao.org');

  // Branch statistics counts
  const branchCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: ACADEMY_COURSES.length, ONLY_GAPS: 0, ESA: 0, EU: 0, FAO: 0 };
    Object.keys(BRANCH_CONFIG).forEach(b => {
      counts[b] = 0;
    });

    ACADEMY_COURSES.forEach(c => {
      if (counts[c.branch] !== undefined) {
        counts[c.branch]++;
      }
      if (c.isMarketGap) {
        counts.ONLY_GAPS++;
      }
      if (isEsaCourse(c)) {
        counts.ESA++;
      }
      if (isEuCourse(c)) {
        counts.EU++;
      }
      if (isFaoCourse(c)) {
        counts.FAO++;
      }
    });

    return counts;
  }, []);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return ACADEMY_COURSES.filter(course => {
      // 1. Branch / Gap mode / Multilateral Hub filter
      if (selectedBranchFilter === 'ESA') {
        if (!isEsaCourse(course)) return false;
      } else if (selectedBranchFilter === 'EU') {
        if (!isEuCourse(course)) return false;
      } else if (selectedBranchFilter === 'FAO') {
        if (!isFaoCourse(course)) return false;
      } else if (selectedBranchFilter === 'ONLY_GAPS' && !course.isMarketGap) {
        return false;
      } else if (selectedBranchFilter !== 'ALL' && selectedBranchFilter !== 'ONLY_GAPS' && course.branch !== selectedBranchFilter) {
        return false;
      }

      // If active specific gap filter
      if (activeGapFilter && course.gapId !== activeGapFilter) {
        return false;
      }

      // 2. Cost filter
      if (selectedCostFilter !== 'ALL' && course.costType !== selectedCostFilter) {
        return false;
      }

      // 3. Status filter
      const userProg = courseProgress[course.id];
      const currentStatus: CourseStatus = userProg ? userProg.status : 'AVAILABLE';
      if (selectedStatusFilter !== 'ALL' && currentStatus !== selectedStatusFilter) {
        return false;
      }

      // 4. Search text filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchProvider = course.provider.toLowerCase().includes(q);
        const matchSkills = course.skillsLearned.some(s => s.toLowerCase().includes(q));
        const matchSummary = course.syllabusSummary.toLowerCase().includes(q);
        const matchBranch = course.branchName.toLowerCase().includes(q);
        if (!matchTitle && !matchProvider && !matchSkills && !matchSummary && !matchBranch) {
          return false;
        }
      }

      return true;
    });
  }, [selectedBranchFilter, activeGapFilter, selectedCostFilter, selectedStatusFilter, searchQuery, courseProgress]);

  // Global KPIs
  const totalCourses = ACADEMY_COURSES.length;
  const inProgressCount = Object.values(courseProgress).filter(p => p.status === 'IN_PROGRESS').length;
  const completedCount = Object.values(courseProgress).filter(p => p.status === 'COMPLETED').length;
  const totalHours = ACADEMY_COURSES.reduce((acc, c) => acc + c.durationHours, 0);

  const totalEarnedXP = ACADEMY_COURSES.reduce((acc, c) => {
    const prog = courseProgress[c.id];
    if (prog?.status === 'COMPLETED') return acc + c.xpValue;
    if (prog?.status === 'IN_PROGRESS') return acc + Math.round((c.xpValue * (prog.progressPercent || 30)) / 100);
    return acc;
  }, 0);

  const getCostBadge = (costType: CourseCostType, label: string) => {
    switch (costType) {
      case 'FREE':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500/30',
          label: label || 'Gratuito'
        };
      case 'EU_SUBSIDIZED':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-500/30',
          label: label || 'Subvencionado UE'
        };
      case 'FREE_AUDIT':
        return {
          bg: 'bg-cyan-50 text-cyan-800 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-500/30',
          label: label || 'Auditoría Libre'
        };
      case 'OFFICIAL_EXAM':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-500/30',
          label: label || 'Examen Oficial'
        };
    }
  };

  return (
    <div className="space-y-4 text-[var(--text-primary)] font-sans animate-fadeIn">
      
      {/* =========================================================================
       * UNIFIED ACADEMY CONSOLE (HUD HEADER + METRICS + RADAR FILTER BAR)
       * ========================================================================= */}
      <div 
        className="p-4 sm:p-5 rounded-2xl border shadow-sm relative overflow-hidden transition-colors space-y-4 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800"
      >
        {/* Top Header Row with Title & Quick Metrics Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 flex items-center justify-center border border-sky-200 dark:border-sky-500/30 shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  Academia Estratégica & Radar Formativo
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 font-bold hidden sm:inline-block">
                  7 ÁREAS TRANSDISCIPLINARIAS
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Catálogo curado de programas oficiales y abiertos para ampliar tu campo de especialización (Geofísica, Suelos & Carbono, Software IA, I+D, Grassroots, CSRD y Alemán).
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1 lg:pb-0 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700/60 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Programas</span>
              <span className="text-sm font-black text-sky-700 dark:text-sky-400">{totalCourses}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700/60 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">En Estudio</span>
              <span className="text-sm font-black text-amber-700 dark:text-amber-400">{inProgressCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700/60 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Certificados</span>
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">{completedCount}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700/60 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Horas Respaldadas</span>
              <span className="text-sm font-black text-indigo-700 dark:text-indigo-400">{totalHours}h</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200/90 dark:border-slate-700/60 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Carga Técnica</span>
              <span className="text-sm font-black text-cyan-700 dark:text-cyan-400 font-mono">+{totalEarnedXP} XP</span>
            </div>
          </div>
        </div>

        {/* Global Progress Track */}
        <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-sky-500" />
            <span>Capacitación en Curso: <strong className="text-slate-900 dark:text-white">{inProgressCount} activas</strong> • <strong className="text-emerald-600 dark:text-emerald-400">{completedCount} certificadas</strong></span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {Math.round(((completedCount * 1.0 + inProgressCount * 0.4) / totalCourses) * 100)}% de avance formativo global
          </div>
        </div>

        {/* Discipline Pill Filter & Search (Integrated Section) */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Branch Pills Row */}
          <div>
            <div className="text-[10.5px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-sky-500" />
                <span>SELECCIONA TU ÁREA DE ESPECIALIZACIÓN O ENFOQUE:</span>
              </span>
              {(selectedBranchFilter !== 'ALL' || selectedCostFilter !== 'ALL' || selectedStatusFilter !== 'ALL' || searchQuery || activeGapFilter) && (
                <button
                  onClick={() => {
                    setSelectedBranchFilter('ALL');
                    setSelectedCostFilter('ALL');
                    setSelectedStatusFilter('ALL');
                    setSearchQuery('');
                    setActiveGapFilter(undefined);
                  }}
                  className="text-[10px] text-rose-600 hover:text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  <span>Restablecer Filtros</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* 1. All Button */}
              <button
                onClick={() => { setSelectedBranchFilter('ALL'); setActiveGapFilter(undefined); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                  selectedBranchFilter === 'ALL' && !activeGapFilter
                    ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-black border-slate-800 dark:border-white'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                <span>🌐 Todas las Áreas</span>
                <span className="text-[10px] opacity-75 font-normal">({branchCounts.ALL})</span>
              </button>

              {/* 2. Only Gaps Button */}
              <button
                onClick={() => { setSelectedBranchFilter('ONLY_GAPS'); setActiveGapFilter(undefined); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                  selectedBranchFilter === 'ONLY_GAPS'
                    ? 'bg-rose-600 text-white font-black border-rose-600 shadow-sm'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50'
                }`}
              >
                <span>⚡ Brechas Prioritarias</span>
                <span className="text-[10px] opacity-75 font-normal">({branchCounts.ONLY_GAPS})</span>
              </button>

              {/* 3. EO College / ESA Filter Button */}
              <button
                onClick={() => { setSelectedBranchFilter('ESA'); setActiveGapFilter(undefined); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                  selectedBranchFilter === 'ESA'
                    ? 'bg-emerald-600 text-white font-black border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50'
                }`}
              >
                <span>🛰️ EO College (ESA)</span>
                <span className="text-[10px] opacity-80 font-normal">({branchCounts.ESA})</span>
              </button>

              {/* 4. EU Academy (Comisión Europea) Filter Button */}
              <button
                onClick={() => { setSelectedBranchFilter('EU'); setActiveGapFilter(undefined); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                  selectedBranchFilter === 'EU'
                    ? 'bg-blue-600 text-white font-black border-blue-600 shadow-sm'
                    : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50'
                }`}
              >
                <span>🇪🇺 EU Academy (UE)</span>
                <span className="text-[10px] opacity-80 font-normal">({branchCounts.EU})</span>
              </button>

              {/* 5. FAO E-learning Academy Filter Button */}
              <button
                onClick={() => { setSelectedBranchFilter('FAO'); setActiveGapFilter(undefined); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                  selectedBranchFilter === 'FAO'
                    ? 'bg-sky-600 text-white font-black border-sky-600 shadow-sm'
                    : 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-500/30 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-950/50'
                }`}
              >
                <span>🇺🇳 FAO Naciones Unidas</span>
                <span className="text-[10px] opacity-80 font-normal">({branchCounts.FAO})</span>
              </button>

              {/* 6. The 7 Authentic Disciplines + Languages */}
              {(Object.keys(BRANCH_CONFIG) as AcademyBranch[]).map(branchKey => {
                const conf = BRANCH_CONFIG[branchKey];
                const isSelected = selectedBranchFilter === branchKey;
                const count = branchCounts[branchKey] || 0;

                return (
                  <button
                    key={branchKey}
                    onClick={() => { setSelectedBranchFilter(branchKey); setActiveGapFilter(undefined); }}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs border ${
                      isSelected
                        ? conf.activePillClass
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span>{conf.icon}</span>
                    <span className="hidden sm:inline">{conf.shortLabel}</span>
                    <span className="sm:hidden">{conf.shortLabel.slice(0, 10)}</span>
                    <span className="text-[10px] opacity-75 font-normal">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Sub-dropdowns row */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 items-center justify-between text-xs">
            
            {/* Search box */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar curso, temario, software o institución..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono focus:outline-none focus:border-sky-500 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white transition-colors shadow-2xs"
              />
            </div>

            {/* Quick Filters: Cost & Status */}
            <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs">
              <select
                value={selectedCostFilter}
                onChange={(e) => setSelectedCostFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs cursor-pointer focus:outline-none focus:border-sky-500 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 shadow-2xs"
              >
                <option value="ALL">Coste: Todos</option>
                <option value="FREE">100% Gratuito</option>
                <option value="FREE_AUDIT">Auditoría Libre / Financial Aid</option>
                <option value="OFFICIAL_EXAM">Examen Oficial</option>
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs cursor-pointer focus:outline-none focus:border-sky-500 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 shadow-2xs"
              >
                <option value="ALL">Estado: Todos</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="IN_PROGRESS">En Curso</option>
                <option value="COMPLETED">Certificado</option>
              </select>

              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:inline ml-1 font-semibold">
                <strong>{filteredCourses.length}</strong> cursos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * TRI-HUB MULTILATERAL & SPACE AGENCIES: ESA EO-COLLEGE, EU ACADEMY & FAO
       * ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        
        {/* Hub 1: EO College (European Space Agency / ESA) */}
        <div 
          className="p-4 sm:p-5 rounded-2xl border relative overflow-hidden transition-all bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border-emerald-200 dark:border-emerald-500/30 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛰️</span>
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 uppercase tracking-wider block sm:inline">
                    Agencia Espacial Europea (ESA)
                  </span>
                </div>
              </div>
              <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">
                eo-college.org
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              EO College · European Space Agency (ESA)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Plataforma abierta oficial de la ESA para observación de la Tierra y geofísica radar. Clave para tu perfil en: <strong className="text-emerald-700 dark:text-emerald-400">Radar SAR (Sentinel-1)</strong>, <strong className="text-teal-700 dark:text-teal-400">Interferometría DInSAR</strong> (subsidencia y deformación), <strong className="text-lime-700 dark:text-lime-400">Humedad del Suelo</strong>, polarimetría y biomasa forestal con SNAP y Python.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 font-mono text-xs">
            <button
              onClick={() => {
                setSelectedBranchFilter('ESA');
                setActiveGapFilter(undefined);
              }}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border ${
                selectedBranchFilter === 'ESA'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
              }`}
            >
              <span>Ver Cursos ESA</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                {branchCounts.ESA}
              </span>
            </button>

            <a
              href="https://eo-college.org/courses/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
            >
              <span>Catálogo SAR</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href="https://eo-college.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <span>eo-college.org</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Hub 2: EU Academy (Comisión Europea) */}
        <div 
          className="p-4 rounded-2xl border relative overflow-hidden transition-all bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/40 dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-900 border-blue-200 dark:border-blue-500/30 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇪🇺</span>
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 uppercase tracking-wider block sm:inline">
                    Comisión Europea · Portal Oficial
                  </span>
                </div>
              </div>
              <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">
                academy.europa.eu
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              EU Academy · Unión Europea (Comisión Europea)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Formación oficial y libre de la UE: <strong className="text-blue-700 dark:text-blue-400">Directiva de Suelos</strong>, <strong className="text-amber-700 dark:text-amber-400">Metodología PM²</strong>, <strong className="text-purple-700 dark:text-purple-400">Normas CSRD/ESRS</strong> y track <strong className="text-cyan-700 dark:text-cyan-400">Data & Digital Technology</strong> (<a href="https://academy.europa.eu/topics/data-digital-technology/" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-600">EU AI Act</a>, Espacios de Datos Green Deal, INSPIRE y Destination Earth).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 font-mono text-xs">
            <button
              onClick={() => {
                setSelectedBranchFilter('EU');
                setActiveGapFilter(undefined);
              }}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border ${
                selectedBranchFilter === 'EU'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-slate-800/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>Ver Cursos UE</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-white/10 font-bold">
                {branchCounts.EU}
              </span>
            </button>

            <a
              href="https://academy.europa.eu/topics/data-digital-technology/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
            >
              <span>Data & Digital Tech</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href="https://academy.europa.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <span>academy.europa.eu</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Hub 3: FAO E-learning Academy (Naciones Unidas) */}
        <div 
          className="p-4 rounded-2xl border relative overflow-hidden transition-all bg-gradient-to-br from-sky-50/90 via-white to-cyan-50/40 dark:from-sky-950/40 dark:via-slate-900 dark:to-slate-900 border-sky-200 dark:border-sky-500/30 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇺🇳</span>
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 uppercase tracking-wider block sm:inline">
                    Naciones Unidas · Portal Multilateral
                  </span>
                </div>
              </div>
              <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">
                elearning.fao.org
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              FAO E-learning Academy · FAO (ONU)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Formación oficial abierta y certificada de la ONU en: <strong className="text-sky-700 dark:text-sky-400">FAO WaPOR</strong> (balances hídricos y teledetección de cuencas), <strong className="text-cyan-700 dark:text-cyan-400">GSOCmrV & RothC</strong> (carbono del suelo), <strong className="text-emerald-700 dark:text-emerald-400">Cartografía de Turberas</strong> (IPCC) y <strong className="text-amber-700 dark:text-amber-400">Degradación de Tierras</strong> (ODS 15.3.1).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 font-mono text-xs">
            <button
              onClick={() => {
                setSelectedBranchFilter('FAO');
                setActiveGapFilter(undefined);
              }}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border ${
                selectedBranchFilter === 'FAO'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md'
                  : 'bg-white dark:bg-slate-800/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/30 hover:bg-sky-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>Ver Cursos FAO</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-100 dark:bg-white/10 font-bold">
                {branchCounts.FAO}
              </span>
            </button>

            <a
              href="https://elearning.fao.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <span>elearning.fao.org</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

      </div>

      {/* =========================================================================
       * 3. 4-COLUMN HARMONIC & COMPACT CARDS GRID
       * ========================================================================= */}
      {filteredCourses.length === 0 ? (
        <div 
          className="p-10 rounded-2xl border text-center space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)' 
          }}
        >
          <BookOpen className="h-10 w-10 text-slate-400 dark:text-slate-500 mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No hay formaciones con los filtros seleccionados
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            Prueba a seleccionar «Todas las Áreas» o restablecer los filtros de búsqueda para explorar todo el catálogo formativo.
          </p>
          <button
            onClick={() => {
              setSelectedBranchFilter('ALL');
              setSelectedCostFilter('ALL');
              setSelectedStatusFilter('ALL');
              setSearchQuery('');
              setActiveGapFilter(undefined);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition cursor-pointer shadow-xs"
          >
            Ver Todos los Cursos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredCourses.map(course => {
            const userProg = courseProgress[course.id] || {
              courseId: course.id,
              status: 'AVAILABLE',
              progressPercent: 0
            };
            const currentStatus = userProg.status;
            const branchStyle = BRANCH_CONFIG[course.branch];
            const costBadge = getCostBadge(course.costType, course.costLabel);
            const isEsa = isEsaCourse(course);
            const isEu = isEuCourse(course);
            const isFao = isFaoCourse(course);

            return (
              <div
                key={course.id}
                className={`rounded-2xl p-4 border flex flex-col justify-between transition-all duration-200 hover:shadow-lg relative overflow-hidden group bg-white dark:bg-slate-900 ${
                  currentStatus === 'COMPLETED'
                    ? 'border-emerald-500/80 ring-1 ring-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : currentStatus === 'IN_PROGRESS'
                    ? 'border-amber-500/80 ring-1 ring-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20'
                    : isEsa
                    ? 'border-emerald-300 dark:border-emerald-500/40 hover:border-emerald-500'
                    : isEu
                    ? 'border-blue-300 dark:border-blue-500/40 hover:border-blue-500'
                    : isFao
                    ? 'border-sky-300 dark:border-sky-500/40 hover:border-sky-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-cyan-500/50'
                }`}
                style={{
                  backgroundColor: currentStatus === 'AVAILABLE' ? 'var(--card-bg)' : undefined
                }}
              >
                {/* Accent top edge pill */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span 
                      className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 truncate max-w-[55%] ${branchStyle.badgeClass}`}
                      title={course.branchName}
                    >
                      <span>{branchStyle.icon}</span>
                      <span className="truncate">{branchStyle.shortLabel}</span>
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      {isEsa && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500/30 flex items-center gap-0.5">
                          <span>🛰️</span>
                          <span>ESA</span>
                        </span>
                      )}
                      {isEu && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-500/30 flex items-center gap-0.5">
                          <span>🇪🇺</span>
                          <span>EU</span>
                        </span>
                      )}
                      {isFao && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-500/30 flex items-center gap-0.5">
                          <span>🇺🇳</span>
                          <span>FAO</span>
                        </span>
                      )}
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${costBadge.bg}`}>
                        {costBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Institution / Provider */}
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate mb-1">
                    {course.provider}
                  </div>

                  {/* Course Title */}
                  <h3 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-[36px] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {course.title}
                  </h3>

                  {/* Market Gap Flag (if applicable) */}
                  {course.isMarketGap && (
                    <div className="mt-1.5 mb-1.5">
                      <span className="text-[9px] font-mono font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 px-1.5 py-0.5 rounded flex items-center gap-1 truncate">
                        <span>⚡</span>
                        <span className="truncate">Brecha: {course.gapName || 'Detectada en Mercado'}</span>
                      </span>
                    </div>
                  )}

                  {/* Duration & Difficulty */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1.5 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                      <span>{course.durationHours}h</span>
                    </span>
                    <span>•</span>
                    <span className="uppercase">
                      {course.difficulty === 'BEGINNER' ? 'Inicial' : course.difficulty === 'INTERMEDIATE' ? 'Intermedio' : 'Avanzado'}
                    </span>
                    <span>•</span>
                    <span>{course.languages.join('/')}</span>
                  </div>

                  {/* Syllabus concise description */}
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 min-h-[48px] mb-2.5">
                    {course.syllabusSummary}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.skillsLearned.slice(0, 3).map((s, i) => (
                      <span 
                        key={i} 
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        #{s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Strip: Segmented Status Buttons + Direct Link */}
                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  
                  {/* Status Toggle Segmented Bar */}
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-[9.5px] font-mono">
                    <button
                      onClick={() => handleUpdateStatus(course.id, 'AVAILABLE', 0)}
                      className={`flex-1 py-1 px-1 rounded text-center transition cursor-pointer font-bold ${
                        currentStatus === 'AVAILABLE'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      title="Marcar como pendiente/disponible"
                    >
                      Por Hacer
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(course.id, 'IN_PROGRESS', userProg.progressPercent || 35)}
                      className={`flex-1 py-1 px-1 rounded text-center transition cursor-pointer font-bold ${
                        currentStatus === 'IN_PROGRESS'
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      title="Marcar como en curso"
                    >
                      En Curso
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(course.id, 'COMPLETED', 100)}
                      className={`flex-1 py-1 px-1 rounded text-center transition cursor-pointer font-bold flex items-center justify-center gap-0.5 ${
                        currentStatus === 'COMPLETED'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      title="Marcar como completado/certificado"
                    >
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      <span>Hecho</span>
                    </button>
                  </div>

                  {/* Progress slider if IN_PROGRESS */}
                  {currentStatus === 'IN_PROGRESS' && (
                    <div className="px-1 py-0.5">
                      <div className="flex items-center justify-between text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold mb-1">
                        <span>Avance:</span>
                        <span>{userProg.progressPercent || 35}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={userProg.progressPercent || 35}
                        onChange={(e) => handleUpdateStatus(course.id, 'IN_PROGRESS', parseInt(e.target.value, 10))}
                        className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-200 dark:bg-slate-700 rounded-lg"
                      />
                    </div>
                  )}

                  {/* Direct Link button */}
                  <div className="flex items-center justify-between gap-1 pt-0.5">
                    <span className="text-[9.5px] font-mono text-cyan-700 dark:text-cyan-400 font-bold flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span>+{course.xpValue} XP</span>
                    </span>

                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-2.5 py-1 rounded-lg text-white font-mono text-[10.5px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer group ${
                        isEsa
                          ? 'bg-emerald-600 hover:bg-emerald-500'
                          : isEu
                          ? 'bg-blue-600 hover:bg-blue-500'
                          : isFao 
                          ? 'bg-sky-600 hover:bg-sky-500' 
                          : 'bg-cyan-600 hover:bg-cyan-500'
                      }`}
                      title={`Abrir página oficial de ${course.provider}`}
                    >
                      <span>{isEsa ? 'EO College' : isEu ? 'EU Portal' : isFao ? 'FAO Portal' : 'Acceder'}</span>
                      <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

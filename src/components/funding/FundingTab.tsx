import React, { useState, useMemo, useEffect } from 'react';
import { 
  Award, 
  ExternalLink, 
  Search, 
  Star, 
  CheckCircle2, 
  Clock, 
  Euro, 
  Globe2, 
  Compass,
  ArrowUpDown,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { FUNDING_CATALOG } from '../../data/fundingCatalog';
import type { FundingRegion, FundingCategory, FundingOpportunity } from '../../types/funding';

interface FundingTabProps {
  onStartApplication?: (fundingTitle: string, org: string) => void;
  onReturnToHub?: () => void;
}

const STORAGE_KEY_BOOKMARKS = 'empleo_funding_bookmarks';

interface FundingCategoryCluster {
  id: string;
  label: string;
  icon: string;
  subtitle: string;
  accent: {
    border: string;
    bg: string;
    glow: string;
    badge: string;
  };
  matcher: (item: FundingOpportunity) => boolean;
}

const FUNDING_SPECIALIZATION_CAROUSEL: FundingCategoryCluster[] = [
  {
    id: 'ALL',
    label: 'Todos los Fondos',
    icon: '🌐',
    subtitle: 'Catálogo global de fondos, becas y premios',
    accent: {
      border: 'border-cyan-500/80',
      bg: 'from-cyan-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
      badge: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40'
    },
    matcher: () => true
  },
  {
    id: 'POSTDOC_FELLOWSHIPS',
    label: 'Postdoc & Fellowships',
    icon: '🏛️',
    subtitle: 'DAAD, DFG Walter Benjamin, Humboldt, MSCA & Ikerbasque',
    accent: {
      border: 'border-amber-500/80',
      bg: 'from-amber-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
      badge: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40'
    },
    matcher: (item) => item.category === 'fellowship' || item.category === 'grant'
  },
  {
    id: 'EU_HORIZON_PROJECTS',
    label: 'Proyectos UE & Consorcios',
    icon: '🇪🇺',
    subtitle: 'Horizonte Europa Cluster 6, LIFE & Hazitek Elkartek',
    accent: {
      border: 'border-sky-500/80',
      bg: 'from-sky-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(2,132,199,0.25)]',
      badge: 'bg-sky-500/20 text-sky-800 dark:text-sky-300 border-sky-500/40'
    },
    matcher: (item) => item.category === 'project' || item.region === 'europe'
  },
  {
    id: 'CLIMATE_SOIL_WATER',
    label: 'Suelos, Cuencas & Carbono',
    icon: '🌿',
    subtitle: 'EU Soil Mission, Turberas, Transición Ecológica & Rewilding',
    accent: {
      border: 'border-emerald-500/80',
      bg: 'from-emerald-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      badge: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
    },
    matcher: (item) => item.targetDisciplines.some(d => {
      const dl = d.toLowerCase();
      return dl.includes('suelo') || dl.includes('cuenca') || dl.includes('carbono') || dl.includes('turbera') || dl.includes('agua') || dl.includes('biogeoquímica') || dl.includes('humedal');
    })
  },
  {
    id: 'SPACE_RADAR_GEO',
    label: 'Geofísica, Satélites & IA',
    icon: '🛰️',
    subtitle: 'Copernicus Masters, Helmhotz Radar, GEE & Gemelos Digitales',
    accent: {
      border: 'border-blue-500/80',
      bg: 'from-blue-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(37,99,235,0.25)]',
      badge: 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/40'
    },
    matcher: (item) => item.targetDisciplines.some(d => {
      const dl = d.toLowerCase();
      return dl.includes('geofísica') || dl.includes('satelital') || dl.includes('teledetección') || dl.includes('observación') || dl.includes('radar') || dl.includes('sensoramiento') || dl.includes('machine learning');
    })
  },
  {
    id: 'AWARDS_PRIZES',
    label: 'Premios & Reconocimientos',
    icon: '🏆',
    subtitle: 'Copernicus Masters, Climate-KIC Awards & EGU Early Career',
    accent: {
      border: 'border-purple-500/80',
      bg: 'from-purple-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.25)]',
      badge: 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/40'
    },
    matcher: (item) => item.category === 'prize'
  }
];

export const FundingTab: React.FC<FundingTabProps> = ({
  onStartApplication,
  onReturnToHub: _onReturnToHub
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<FundingRegion | 'all' | 'bookmarks'>('all');
  const [selectedCategory, setSelectedCategory] = useState<FundingCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'name' | 'strategic'>('deadline');
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Bookmarks persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : ['f-daad-research', 'f-ikerbasque-fellowship', 'f-copernicus-masters'];
    } catch {
      return ['f-daad-research', 'f-ikerbasque-fellowship', 'f-copernicus-masters'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedIds));
    } catch {
      // Ignore storage errors
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  // Cluster counts memo
  const clusterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    FUNDING_SPECIALIZATION_CAROUSEL.forEach(cluster => {
      counts[cluster.id] = FUNDING_CATALOG.filter(cluster.matcher).length;
    });
    return counts;
  }, []);

  // Filtered & Sorted Opportunities
  const filteredOpportunities = useMemo(() => {
    return FUNDING_CATALOG.filter(item => {
      // Cluster specialization filter
      if (selectedCluster !== 'ALL') {
        const clusterObj = FUNDING_SPECIALIZATION_CAROUSEL.find(c => c.id === selectedCluster);
        if (clusterObj && !clusterObj.matcher(item)) {
          return false;
        }
      }

      // Region / Bookmark filter
      if (selectedRegion === 'bookmarks') {
        if (!bookmarkedIds.includes(item.id)) return false;
      } else if (selectedRegion !== 'all' && item.region !== selectedRegion) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesOrg = item.organization.toLowerCase().includes(query);
        const matchesDisciplines = item.targetDisciplines.some(d => d.toLowerCase().includes(query));
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesOrg && !matchesDisciplines && !matchesDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        // Rolling (-1) at the end
        if (a.deadlineDays === -1) return 1;
        if (b.deadlineDays === -1) return -1;
        return a.deadlineDays - b.deadlineDays;
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [selectedCluster, selectedRegion, selectedCategory, searchTerm, sortBy, bookmarkedIds]);

  // KPIs
  const totalPrograms = FUNDING_CATALOG.length;
  const germanyCount = FUNDING_CATALOG.filter(f => f.region === 'germany').length;
  const europeCount = FUNDING_CATALOG.filter(f => f.region === 'europe').length;
  const euskadiCount = FUNDING_CATALOG.filter(f => f.region === 'euskadi').length;
  const prizeCount = FUNDING_CATALOG.filter(f => f.category === 'prize').length;
  const bookmarkCount = bookmarkedIds.length;

  const getRegionBadge = (region: FundingRegion) => {
    switch (region) {
      case 'germany':
        return { label: '🇩🇪 Alemania (DACH)', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' };
      case 'europe':
        return { label: '🇪🇺 Unión Europea', bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30' };
      case 'euskadi':
        return { label: '📍 Euskadi & España', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
      case 'international':
        return { label: '🌐 Internacional', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' };
    }
  };

  const getCategoryBadge = (category: FundingCategory) => {
    switch (category) {
      case 'fellowship':
        return { label: 'Estancia / Fellowship', icon: Compass };
      case 'grant':
        return { label: 'Beca de Investigación', icon: Award };
      case 'project':
        return { label: 'Fondo I+D / Proyecto', icon: Globe2 };
      case 'prize':
        return { label: 'Premio / Concurso', icon: Award };
    }
  };

  return (
    <div className="space-y-6 text-[var(--text-primary)] font-sans animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. HEADER: FONDOS I+D & BECAS (OPERATIONAL STAGING)
       * ========================================================================= */}
      <div 
        className="p-5 rounded-2xl border shadow-xl relative overflow-hidden transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                <span>RADAR DE FONDOS // BECAS, PROYECTOS I+D & PREMIOS</span>
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                {totalPrograms} FONDOS Y PROGRAMAS REGISTRADOS
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Fondos I+D, Becas Postdoctorales & Subvenciones
            </h1>
            <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Monitoreo activo de programas de financiamiento en Alemania (DAAD, DFG, Humboldt), la Unión Europea (Horizonte Europa, LIFE) y Euskadi (Ikerbasque, Hazitek). Mantente postulando a fondos de investigación y premios que potencian tu trayectoria.
            </p>
          </div>

          {/* Quick Stats Strip */}
          <div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl border shrink-0"
            style={{ 
              backgroundColor: 'var(--panel-bg)', 
              borderColor: 'var(--panel-border)' 
            }}
          >
            <div className="min-w-[85px]">
              <div className="text-[9px] text-[var(--text-muted)] font-mono uppercase font-bold">ALEMANIA</div>
              <div className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">{germanyCount}</div>
              <div className="text-[9px] text-[var(--text-muted)] font-mono">DAAD / DFG / HGF</div>
            </div>

            <div className="min-w-[85px]">
              <div className="text-[9px] text-[var(--text-muted)] font-mono uppercase font-bold">EUROPA UE</div>
              <div className="text-base font-black text-sky-600 dark:text-sky-400 font-mono">{europeCount}</div>
              <div className="text-[9px] text-[var(--text-muted)] font-mono">Horizon / MSCA</div>
            </div>

            <div className="min-w-[85px]">
              <div className="text-[9px] text-[var(--text-muted)] font-mono uppercase font-bold">EUSKADI</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">{euskadiCount}</div>
              <div className="text-[9px] text-[var(--text-muted)] font-mono">Ikerbasque / RVCTI</div>
            </div>

            <div className="min-w-[85px]">
              <div className="text-[9px] text-[var(--text-muted)] font-mono uppercase font-bold">EN RADAR</div>
              <div className="text-base font-black text-purple-600 dark:text-purple-400 font-mono flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-purple-500 text-purple-500" />
                <span>{bookmarkCount}</span>
              </div>
              <div className="text-[9px] text-[var(--text-muted)] font-mono">Prioritarias</div>
            </div>
          </div>
        </div>

        {/* =========================================================================
         * SPECIALIZATION CAROUSEL / GRID & SEARCH CONTROLS
         * ========================================================================= */}
        <div className="mt-4 pt-3.5 border-t border-[var(--panel-border)] space-y-3">
          
          {/* Header of Filter Carousel with Reset, Refresh, and Collapse Controls */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-black font-mono uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <span>LÍNEAS DE FINANCIAMIENTO & PREMIOS</span>
                  <span className="text-[9.5px] px-2 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold font-mono">
                    {filteredOpportunities.length} de {totalPrograms}
                  </span>
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Filtra fondos y convocatorias por categoría temática, becas individuales o programas de consorcio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Botón de Recargar / Actualizar */}
              <button
                onClick={handleRefresh}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
                title="Recargar fondos guardados y estado"
              >
                <RefreshCw className={`h-3 w-3 text-amber-600 dark:text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Recargar</span>
              </button>

              {(selectedCluster !== 'ALL' || selectedRegion !== 'all' || selectedCategory !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCluster('ALL');
                    setSelectedRegion('all');
                    setSelectedCategory('all');
                    setSearchTerm('');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold transition cursor-pointer border border-rose-200 dark:border-rose-800 shadow-2xs flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  <span>Resetear</span>
                </button>
              )}

              {/* Botón para Alternar Modo Colapsado / Expandido */}
              <button
                onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
                title={isFiltersCollapsed ? 'Expandir carrusel de áreas' : 'Colapsar para mayor espacio'}
              >
                <span>{isFiltersCollapsed ? 'Ver Categorías' : 'Colapsar'}</span>
                {isFiltersCollapsed ? (
                  <ChevronDown className="h-3 w-3 text-amber-500" />
                ) : (
                  <ChevronUp className="h-3 w-3 text-amber-500" />
                )}
              </button>
            </div>
          </div>

          {/* Carrusel Visual de Tarjetas de Líneas de Financiamiento */}
          {!isFiltersCollapsed && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 animate-fadeIn">
              {FUNDING_SPECIALIZATION_CAROUSEL.map(item => {
                const isSelected = selectedCluster === item.id;
                const count = clusterCounts[item.id] !== undefined ? clusterCounts[item.id] : 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedCluster(item.id);
                    }}
                    className={`group relative p-2.5 rounded-xl flex flex-col justify-between items-start text-left transition-all duration-200 cursor-pointer min-h-[92px] border shadow-2xs ${
                      isSelected
                        ? `${item.accent.border} ${item.accent.glow} bg-gradient-to-br ${item.accent.bg} ring-2 ring-amber-500/30 text-white`
                        : 'bg-slate-50/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-[1.01]'
                    }`}
                  >
                    {/* Top Row: Emoji Icon + Badge Count */}
                    <div className="w-full flex items-center justify-between gap-1">
                      <span className="text-xl sm:text-2xl filter drop-shadow group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                        isSelected 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}>
                        {count}
                      </span>
                    </div>

                    {/* Bottom Row: Label & Subtitle */}
                    <div className="mt-1 w-full">
                      <h4 className={`text-[11.5px] font-black leading-tight line-clamp-1 ${
                        isSelected ? 'text-white' : 'text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400'
                      }`}>
                        {item.label}
                      </h4>
                      <p className={`text-[9.5px] font-mono mt-0.5 line-clamp-1 truncate ${
                        isSelected ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sub-Filtros Territoriales & Buscador */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--panel-border)]">
            {/* Region Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mr-1">
                ÁMBITO:
              </span>
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  selectedRegion === 'all'
                    ? 'bg-sky-600 text-white shadow'
                    : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                }`}
              >
                Todas ({totalPrograms})
              </button>

              <button
                onClick={() => setSelectedRegion('bookmarks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                  selectedRegion === 'bookmarks'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                }`}
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>Guardadas ({bookmarkCount})</span>
              </button>

              <button
                onClick={() => setSelectedRegion('germany')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  selectedRegion === 'germany'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                }`}
              >
                🇩🇪 Alemania ({germanyCount})
              </button>

              <button
                onClick={() => setSelectedRegion('europe')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  selectedRegion === 'europe'
                    ? 'bg-sky-600 text-white shadow'
                    : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                }`}
              >
                🇪🇺 Europa ({europeCount})
              </button>

              <button
                onClick={() => setSelectedRegion('euskadi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  selectedRegion === 'euskadi'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                }`}
              >
                📍 Euskadi & Esp ({euskadiCount})
              </button>

              <button
                onClick={() => {
                  setSelectedRegion('all');
                  setSelectedCategory(selectedCategory === 'prize' ? 'all' : 'prize');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'prize'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                }`}
              >
                <Award className="h-3 w-3 text-purple-400" />
                <span>🏆 Premios ({prizeCount})</span>
              </button>
            </div>

            {/* Search Box & Sort */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar programa o disciplina..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                  style={{ 
                    backgroundColor: 'var(--panel-bg)', 
                    borderColor: 'var(--card-border)',
                    color: 'var(--text-primary)'
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div 
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono"
                style={{ 
                  backgroundColor: 'var(--panel-bg)', 
                  borderColor: 'var(--panel-border)' 
                }}
              >
                <ArrowUpDown className="h-3 w-3 text-[var(--text-muted)]" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  aria-label="Criterio de ordenación de fondos"
                  className="bg-transparent border-none text-[var(--text-primary)] font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="deadline">Próximo Cierre</option>
                  <option value="name">Alfabético</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. MAIN GRID: FUNDING OPPORTUNITIES CARDS
       * ========================================================================= */}
      {filteredOpportunities.length === 0 ? (
        <div 
          className="p-10 rounded-2xl border text-center space-y-3"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)' 
          }}
        >
          <div className="h-12 w-12 rounded-full bg-slate-500/10 text-[var(--text-muted)] flex items-center justify-center mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            No se encontraron fondos con los filtros actuales
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
            Prueba a cambiar el ámbito territorial o borra el término de búsqueda para ver el catálogo de fondos completo.
          </p>
          <button
            onClick={() => {
              setSelectedCluster('ALL');
              setSelectedRegion('all');
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {filteredOpportunities.map(item => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            const regionBadge = getRegionBadge(item.region);
            const catBadge = getCategoryBadge(item.category);
            const CatIcon = catBadge.icon;

            // Deadline status color
            const isUrgent = item.deadlineDays > 0 && item.deadlineDays <= 30;
            const isRolling = item.deadlineDays === -1;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border shadow-md flex flex-col justify-between space-y-3.5 transition-all hover:shadow-lg relative overflow-hidden group"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: isBookmarked ? 'var(--accent-glow)' : 'var(--card-border)' 
                }}
              >
                {/* Top Strip: Badges & Bookmark */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${regionBadge.bg}`}>
                      {regionBadge.label}
                    </span>

                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
                          : 'bg-[var(--panel-bg)] border-[var(--panel-border)] text-[var(--text-muted)] hover:text-amber-500'
                      }`}
                      title={isBookmarked ? 'Quitar del radar' : 'Guardar en radar de fondos'}
                    >
                      <Star className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Organization & Category */}
                  <div>
                    <div className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-tight flex items-center gap-1 truncate">
                      <CatIcon className="h-3 w-3 shrink-0" />
                      <span className="truncate">{item.organization}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight leading-snug mt-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Financial & Deadline Grid */}
                  <div 
                    className="p-2.5 rounded-xl border grid grid-cols-2 gap-2 text-[10px] font-mono"
                    style={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      borderColor: 'var(--panel-border)' 
                    }}
                  >
                    <div>
                      <div className="text-[8.5px] text-[var(--text-muted)] uppercase font-bold flex items-center gap-1">
                        <Euro className="h-2.5 w-2.5 text-emerald-500" />
                        <span>DOTACIÓN</span>
                      </div>
                      <div className="font-bold text-[var(--text-primary)] truncate mt-0.5" title={item.amount}>
                        {item.amount.split('+')[0]}
                      </div>
                    </div>

                    <div>
                      <div className="text-[8.5px] text-[var(--text-muted)] uppercase font-bold flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5 text-amber-500" />
                        <span>CIERRE</span>
                      </div>
                      <div className="font-bold mt-0.5">
                        {isRolling ? (
                          <span className="text-sky-600 dark:text-sky-400">Abierta Continua</span>
                        ) : (
                          <span className={isUrgent ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                            {item.deadlineDays} días ({item.deadline})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-[var(--text-secondary)] font-sans leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Strategic Fit Chip */}
                  <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[10px] font-sans text-sky-700 dark:text-sky-300 flex items-start gap-1.5">
                    <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5 text-sky-500" />
                    <span className="leading-tight">
                      <strong>Encaje:</strong> {item.strategicFit}
                    </span>
                  </div>

                  {/* Target Disciplines */}
                  <div className="flex flex-wrap items-center gap-1 pt-0.5 text-[9px] font-mono">
                    {item.targetDisciplines.map(d => (
                      <span 
                        key={d}
                        className="px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800/80 text-[var(--text-muted)] border border-slate-300 dark:border-slate-700/60"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-2 border-t border-[var(--panel-border)] flex items-center justify-between gap-2">
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-xl border font-mono font-bold text-[11px] flex items-center justify-center gap-1.5 transition hover:border-sky-500"
                    style={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      borderColor: 'var(--card-border)',
                      color: 'var(--text-primary)'
                    }}
                    title="Abrir convocatoria oficial en nueva pestaña"
                  >
                    <span>Portal Oficial</span>
                    <ExternalLink className="h-3 w-3 text-sky-500" />
                  </a>

                  {onStartApplication && (
                    <button
                      onClick={() => onStartApplication(item.title, item.organization)}
                      className="py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow"
                      title="Registrar candidatura para seguimiento"
                    >
                      <span>⚡ Postular</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Newspaper, 
  ShieldAlert, 
  MessageSquare, 
  ExternalLink, 
  Briefcase, 
  PlusCircle, 
  Eye, 
  Edit3, 
  Users, 
  Link as LinkIcon, 
  Mail, 
  Coins, 
  Send, 
  Search, 
  TrendingUp, 
  Building2, 
  SlidersHorizontal,
  Star,
  Sparkles,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Globe
} from 'lucide-react';
import { getStoredCompanies, saveStoredCompanies } from '../../services/db';
import type { CompanyDossier, QuadrantType, CompanyContact, CompanySectorCluster } from '../../types/companies';
import { AddCompanyModal } from './AddCompanyModal';
import { EditCompanyModal } from './EditCompanyModal';
import { WebsitePreviewModal } from '../common/WebsitePreviewModal';
import { ClusterBenchmarkTable } from '../radar/ClusterBenchmarkTable';
import { CompaniesWorldMap } from './CompaniesWorldMap';
import { FUNDING_CATALOG } from '../../data/fundingCatalog';
import { inferCompanyQuadrants, inferCompanySectorCluster } from '../../utils/quadrants';
import { analyzeCompanyFit } from '../../utils/companyFit';

interface CompaniesTabProps {
  onStartPipeline?: (companyId: string) => void;
  initialQuadrant?: string;
  initialSectorCluster?: CompanySectorCluster;
}

type QuickFilterType = 'ALL' | 'FAVORITES' | 'HIGH_MATCH' | 'WITH_CONTACTS';
type SortByType = 'MATCH' | 'NAME' | 'CONTACTS' | 'QUADRANT';

/**
 * Helper component to display high-resolution entity logo extracted from domain
 * with Google Favicons service, DuckDuckGo fallback, and stylized monogram backup.
 */
const CompanyLogo: React.FC<{ website?: string; name: string }> = ({ website, name }) => {
  const [imgError, setImgError] = useState(false);
  const [ddgError, setDdgError] = useState(false);

  const domain = useMemo(() => {
    if (!website) return '';
    try {
      const url = website.startsWith('http') ? website : `https://${website}`;
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }, [website]);

  const initials = useMemo(() => {
    return name
      .replace(/^(the|el|la|los|las|de|von|der)\s+/i, '')
      .split(/[\s-]+/)
      .filter(w => w.length > 0)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }, [name]);

  if (!domain || (imgError && ddgError)) {
    return (
      <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-900/70 via-slate-900 to-emerald-900/70 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-mono font-black text-sm tracking-wider shadow-inner select-none">
        {initials}
      </div>
    );
  }

  const logoSrc = !imgError 
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : `https://icons.duckduckgo.com/ip3/${domain}.ico`;

  return (
    <img
      src={logoSrc}
      alt={`${name} logo`}
      loading="lazy"
      onError={() => {
        if (!imgError) {
          setImgError(true);
        } else {
          setDdgError(true);
        }
      }}
      className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-200"
    />
  );
};

const SECTOR_CATEGORIES: { 
  id: CompanySectorCluster; 
  label: string; 
  icon: string; 
  subtitle: string;
  accent: {
    border: string;
    bg: string;
    glow: string;
    badge: string;
  };
}[] = [
  { 
    id: 'ALL', 
    label: 'Todas las Entidades', 
    icon: '🌐',
    subtitle: 'Red completa de prospección',
    accent: {
      border: 'border-cyan-500/80',
      bg: 'from-cyan-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    }
  },
  { 
    id: 'RD_PUBLIC', 
    label: 'I+D Público & Universidades', 
    icon: '🏛️',
    subtitle: 'Helmholtz, Max Planck, TU Delft, BOKU',
    accent: {
      border: 'border-teal-500/80',
      bg: 'from-teal-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(20,184,166,0.25)]',
      badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
    }
  },
  { 
    id: 'CARBON_TECH_MRV', 
    label: 'Carbon-Tech & MRV', 
    icon: '🌿',
    subtitle: 'Sylvera, Supercritical, Turberas & Suelos',
    accent: {
      border: 'border-emerald-500/80',
      bg: 'from-emerald-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    }
  },
  { 
    id: 'CAT_RISK_INSURANCE', 
    label: 'Cat Risk & Seguros', 
    icon: '⚡',
    subtitle: 'Munich Re, Descartes, Mitiga, Incendios',
    accent: {
      border: 'border-amber-500/80',
      bg: 'from-amber-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    }
  },
  { 
    id: 'MULTILATERAL_POLICY', 
    label: 'Multilateral & Políticas', 
    icon: '🌍',
    subtitle: 'IIASA, JRC Ispra, Directivas UE, Cuencas',
    accent: {
      border: 'border-purple-500/80',
      bg: 'from-purple-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.25)]',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    }
  },
  { 
    id: 'GEOTHERMAL_ENERGY', 
    label: 'Geotermia & Subsuelo', 
    icon: '🌋',
    subtitle: 'Fervo, Eavor, INGV, Hidrogeofísica',
    accent: {
      border: 'border-orange-500/80',
      bg: 'from-orange-950/70 via-slate-900 to-slate-900',
      glow: 'shadow-[0_0_25px_rgba(249,115,22,0.25)]',
      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
    }
  }
];

const QUADRANT_POLES: { id: string; label: string }[] = [
  { id: 'ALL', label: 'Todos los Polos' },
  { id: 'EUSKADI', label: 'Euskadi / España' },
  { id: 'DACH', label: 'DACH (Alemania/Austria/Suiza)' },
  { id: 'UK_NL', label: 'UK & Países Bajos' },
  { id: 'GLOBAL', label: 'Italia / Grecia / UE / Global' },
  { id: 'NORDICS', label: 'Nórdicos' }
];

export const CompaniesTab: React.FC<CompaniesTabProps> = ({ 
  onStartPipeline,
  initialQuadrant = 'ALL',
  initialSectorCluster = 'ALL'
}) => {
  const [companies, setCompanies] = useState<CompanyDossier[]>(() => getStoredCompanies());
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>(
    initialQuadrant === 'GERMANY' ? 'DACH' :
    initialQuadrant === 'BILBAO' || initialQuadrant === 'EUSKADI' ? 'EUSKADI' :
    initialQuadrant === 'REMOTE' ? 'GLOBAL' : 'ALL'
  );
  const [selectedSectorCluster, setSelectedSectorCluster] = useState<CompanySectorCluster>(initialSectorCluster);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  
  // Quick filters & Sorting
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortByType>('MATCH');

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('job_search_os_fav_companies');
      if (raw) return new Set(JSON.parse(raw));
    } catch {
      // ignore
    }
    return new Set();
  });

  const toggleFavorite = (companyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(companyId)) {
        next.delete(companyId);
      } else {
        next.add(companyId);
      }
      try {
        localStorage.setItem('job_search_os_fav_companies', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Selected company for detailed dossier modal ("Más información")
  const [dossierCompany, setDossierCompany] = useState<CompanyDossier | null>(null);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<CompanyDossier | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);

  // Add Contact Form inline state
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactLinkedin, setContactLinkedin] = useState('');
  const [contactNotes, setContactNotes] = useState('');

  const handleCompanyAdded = (newComp: CompanyDossier) => {
    const updated = [newComp, ...companies];
    setCompanies(updated);
    saveStoredCompanies(updated);
    setDossierCompany(newComp);
    setIsDossierModalOpen(true);
  };

  const handleCompanyUpdated = (updatedComp: CompanyDossier) => {
    const updated = companies.map(c => c.id === updatedComp.id ? updatedComp : c);
    setCompanies(updated);
    saveStoredCompanies(updated);
    if (dossierCompany?.id === updatedComp.id) {
      setDossierCompany(updatedComp);
    }
  };

  const handleOpenDossier = (comp: CompanyDossier) => {
    setDossierCompany(comp);
    setIsAddingContact(false);
    setIsDossierModalOpen(true);
  };

  const handleOpenPreview = (comp: CompanyDossier) => {
    setPreviewUrl(comp.website);
    setPreviewTitle(comp.name);
    setIsPreviewModalOpen(true);
  };

  const handleOpenEdit = (comp: CompanyDossier) => {
    setCompanyToEdit(comp);
    setIsEditModalOpen(true);
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !dossierCompany) return;

    const newContact: CompanyContact = {
      id: `cnt-${Date.now()}`,
      name: contactName.trim(),
      role: contactRole.trim() || 'Hiring Manager / Investigador Principal',
      email: contactEmail.trim(),
      linkedinUrl: contactLinkedin.trim(),
      notes: contactNotes.trim()
    };

    const existingContacts = dossierCompany.contacts || [];
    const updatedCompany: CompanyDossier = {
      ...dossierCompany,
      contacts: [...existingContacts, newContact]
    };

    handleCompanyUpdated(updatedCompany);
    setIsAddingContact(false);
    setContactName('');
    setContactRole('');
    setContactEmail('');
    setContactLinkedin('');
    setContactNotes('');
  };

  const handleDeleteContact = (contactId: string) => {
    if (!dossierCompany) return;
    const updatedContacts = (dossierCompany.contacts || []).filter(c => c.id !== contactId);
    handleCompanyUpdated({
      ...dossierCompany,
      contacts: updatedContacts
    });
  };

  // Pre-calculate profile fit for all companies for instant filtering & sorting
  const scoredCompaniesMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof analyzeCompanyFit>>();
    companies.forEach(comp => {
      map.set(comp.id, analyzeCompanyFit(comp));
    });
    return map;
  }, [companies]);

  // Filter and sort companies by quadrant, sector cluster, search, quick filter and sort
  const filteredCompanies = useMemo(() => {
    const list = companies.filter(comp => {
      const fit = scoredCompaniesMap.get(comp.id);
      const quads = inferCompanyQuadrants(comp);
      
      // Quadrant pole filter
      if (selectedQuadrant !== 'ALL' && !quads.includes(selectedQuadrant as QuadrantType)) {
        return false;
      }
      
      // Sector cluster filter
      const cluster = inferCompanySectorCluster(comp);
      if (selectedSectorCluster !== 'ALL' && cluster !== selectedSectorCluster) {
        return false;
      }

      // Quick filter
      if (quickFilter === 'FAVORITES' && !favorites.has(comp.id)) {
        return false;
      }
      if (quickFilter === 'HIGH_MATCH' && (!fit || fit.score < 85)) {
        return false;
      }
      if (quickFilter === 'WITH_CONTACTS' && (!comp.contacts || comp.contacts.length === 0)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = comp.name.toLowerCase().includes(q);
        const inSector = comp.sector.toLowerCase().includes(q);
        const inHQ = comp.headquarters.toLowerCase().includes(q);
        const inProjects = (comp.keyProjects || []).some(p => p.toLowerCase().includes(q));
        const inTech = (comp.techStack || []).some(t => t.toLowerCase().includes(q));
        const inPillars = fit ? fit.matchedPillars.some(p => p.pillar.toLowerCase().includes(q) || p.badge.toLowerCase().includes(q)) : false;
        return inName || inSector || inHQ || inProjects || inTech || inPillars;
      }
      return true;
    });

    // Sort order
    return list.sort((a, b) => {
      const fitA = scoredCompaniesMap.get(a.id)?.score || 70;
      const fitB = scoredCompaniesMap.get(b.id)?.score || 70;

      if (sortBy === 'MATCH') {
        return fitB - fitA;
      }
      if (sortBy === 'NAME') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'CONTACTS') {
        return (b.contacts?.length || 0) - (a.contacts?.length || 0);
      }
      if (sortBy === 'QUADRANT') {
        const qA = (a.quadrants?.[0] || 'GLOBAL');
        const qB = (b.quadrants?.[0] || 'GLOBAL');
        return qA.localeCompare(qB);
      }
      return 0;
    });
  }, [companies, selectedQuadrant, selectedSectorCluster, searchQuery, quickFilter, sortBy, favorites, scoredCompaniesMap]);

  // Associated funding opportunities for the selected modal company
  const relatedFunding = useMemo(() => {
    if (!dossierCompany) return [];
    return FUNDING_CATALOG.filter(f => {
      if (dossierCompany.fundingTies && dossierCompany.fundingTies.includes(f.id)) return true;
      const quads = inferCompanyQuadrants(dossierCompany);
      if (quads.includes('DACH') && f.region === 'germany') return true;
      if (quads.includes('EUSKADI') && f.region === 'euskadi') return true;
      return false;
    }).slice(0, 3);
  }, [dossierCompany]);

  // Fit analysis for the currently viewed dossier company
  const dossierFit = useMemo(() => {
    if (!dossierCompany) return null;
    return scoredCompaniesMap.get(dossierCompany.id) || analyzeCompanyFit(dossierCompany);
  }, [dossierCompany, scoredCompaniesMap]);

  const getQuadrantColor = (quad: QuadrantType) => {
    switch (quad) {
      case 'DACH': return 'bg-teal-900/60 text-teal-300 border-teal-700/60';
      case 'EUSKADI': return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
      case 'UK_NL': return 'bg-blue-900/60 text-blue-300 border-blue-700/60';
      case 'NORDICS': return 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60';
      case 'CANADA_GLOBAL': return 'bg-rose-900/60 text-rose-300 border-rose-700/60';
      case 'GLOBAL': return 'bg-sky-900/60 text-sky-300 border-sky-700/60';
      case 'REMOTE': return 'bg-violet-900/60 text-violet-300 border-violet-700/60';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getClusterBadge = (cluster: CompanySectorCluster) => {
    switch (cluster) {
      case 'CARBON_TECH_MRV':
        return { label: 'Carbon-Tech & MRV', color: 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60' };
      case 'CAT_RISK_INSURANCE':
        return { label: 'Cat Risk & Seguros', color: 'bg-amber-950/80 text-amber-300 border-amber-700/60' };
      case 'RD_PUBLIC':
        return { label: 'I+D Público & Centros', color: 'bg-teal-950/80 text-teal-300 border-teal-700/60' };
      case 'MULTILATERAL_POLICY':
        return { label: 'Multilateral & Políticas', color: 'bg-purple-950/80 text-purple-300 border-purple-700/60' };
      case 'GEOTHERMAL_ENERGY':
        return { label: 'Geotermia & Subsuelo', color: 'bg-orange-950/80 text-orange-300 border-orange-700/60' };
      default:
        return { label: 'Sector Estratégico', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const activeCategoryObj = useMemo(() => {
    return SECTOR_CATEGORIES.find(c => c.id === selectedSectorCluster) || SECTOR_CATEGORIES[0];
  }, [selectedSectorCluster]);

  const highMatchCount = useMemo(() => {
    return companies.filter(c => (scoredCompaniesMap.get(c.id)?.score || 70) >= 85).length;
  }, [companies, scoredCompaniesMap]);

  const withContactsCount = useMemo(() => {
    return companies.filter(c => (c.contacts || []).length > 0).length;
  }, [companies]);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* =========================================================================
       * 1. TOP HEADER & ACTION CONTROLS
       * ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-black text-white font-mono uppercase tracking-tight flex items-center gap-2">
              <Building2 className="h-5 w-5 text-cyan-400" />
              DIRECTORIO DE ENTIDADES // RED DE PROSPECCIÓN & INVESTIGACIÓN
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold">
              {companies.length} Entidades Guardadas
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {highMatchCount} Alta Afinidad (+85%)
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Exploración visual interactiva personalizada con tu perfil de Geofísico, Máster en Gestión Ambiental y especialista en GEI/Cuencas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setIsBenchmarkModalOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <span>Benchmark Probabilidad</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Agregar Organización</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
       * 2. BARRAS DE EXPLORACIÓN POR CATEGORÍAS & BÚSQUEDA (MODO COLAPSADO / EXPANDIDO)
       * ========================================================================= */}
      {isFiltersCollapsed ? (
        /* ==================== MODO COLAPSADO: BARRA SLIM CON CHIPS ==================== */
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/95 via-[#0b1120] to-slate-900/95 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Chip de Categoría Activa */}
            <button
              onClick={() => setIsFiltersCollapsed(false)}
              className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-cyan-950/90 text-cyan-300 border border-cyan-700/80 hover:bg-cyan-900 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Click para cambiar de categoría"
            >
              <span className="text-sm">{activeCategoryObj.icon}</span>
              <span className="font-sans font-bold">{activeCategoryObj.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-900/80 text-cyan-200 font-bold font-mono">
                {filteredCompanies.length}
              </span>
            </button>

            {/* Chip de Polo (si no es ALL) */}
            {selectedQuadrant !== 'ALL' && (
              <span className="text-xs font-mono font-semibold px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
                <span>📍 {QUADRANT_POLES.find(p => p.id === selectedQuadrant)?.label}</span>
                <button 
                  onClick={() => setSelectedQuadrant('ALL')} 
                  className="ml-1 text-slate-400 hover:text-white text-[10px]"
                  title="Quitar filtro de polo"
                >
                  ✕
                </button>
              </span>
            )}

            {/* Chip de Filtro Rápido (si no es ALL) */}
            {quickFilter !== 'ALL' && (
              <span className="text-xs font-mono font-semibold px-2.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/80 flex items-center gap-1">
                <span>⚡ {quickFilter === 'HIGH_MATCH' ? 'Alta Afinidad (+85%)' : quickFilter === 'FAVORITES' ? 'Guardados' : 'Con Decisores'}</span>
                <button 
                  onClick={() => setQuickFilter('ALL')} 
                  className="ml-1 text-emerald-400 hover:text-white text-[10px]"
                  title="Quitar filtro rápido"
                >
                  ✕
                </button>
              </span>
            )}

            {/* Chip de Búsqueda de Texto (si existe) */}
            {searchQuery && (
              <span className="text-xs font-mono px-2.5 py-1.5 rounded-xl bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1.5">
                <span>🔍 "{searchQuery}"</span>
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="text-slate-400 hover:text-white text-xs"
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-end">
            {/* Buscador Rápido Slim */}
            <div className="relative min-w-[200px] sm:min-w-[240px] flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar entidad..."
                className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Botón para Desplegar Categorías */}
            <button
              onClick={() => setIsFiltersCollapsed(false)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-emerald-600/30 hover:from-cyan-600/50 hover:to-emerald-600/50 text-cyan-200 border border-cyan-500/50 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
              title="Expandir el menú visual de categorías y filtros"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
              <span>Expandir Categorías</span>
              <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      ) : (
        /* ==================== MODO EXPANDIDO: TARJETAS GRANDES & SLEEK ==================== */
        <div className="p-4 sm:p-5 rounded-3xl bg-[#090e1a]/95 border border-slate-800 shadow-2xl space-y-4 animate-fadeIn">
          
          {/* Header del Menú con Título y Botón de Colapsar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black font-mono uppercase tracking-wider text-white flex items-center gap-2">
                  <span>CATEGORÍAS DE EXPLORACIÓN ESTRATÉGICA</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold font-mono">
                    {companies.length} Entidades
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Selecciona una categoría para revelar los centros de I+D, universidades, startups o aseguradoras de ese ámbito
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(selectedSectorCluster !== 'ALL' || selectedQuadrant !== 'ALL' || searchQuery || quickFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSelectedSectorCluster('ALL');
                    setSelectedQuadrant('ALL');
                    setSearchQuery('');
                    setQuickFilter('ALL');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold transition cursor-pointer border border-slate-700"
                >
                  Resetear Filtros
                </button>
              )}

              <button
                onClick={() => setIsFiltersCollapsed(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700/80 shadow-sm"
                title="Colapsar panel para ver más entidades en pantalla"
              >
                <span>Colapsar Menú</span>
                <ChevronUp className="h-3.5 w-3.5 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* CUADRÍCULA DE BOTONES GRANDES DE CATEGORÍAS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {SECTOR_CATEGORIES.map(cat => {
              const isActive = selectedSectorCluster === cat.id;
              const count = cat.id === 'ALL' 
                ? companies.length 
                : companies.filter(c => inferCompanySectorCluster(c) === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSectorCluster(cat.id)}
                  className={`group relative p-3 sm:p-3.5 rounded-2xl flex flex-col justify-between items-start text-left transition-all duration-200 cursor-pointer min-h-[102px] sm:min-h-[110px] border ${
                    isActive
                      ? `${cat.accent.border} ${cat.accent.glow} bg-gradient-to-br ${cat.accent.bg} ring-2 ring-cyan-500/25`
                      : 'bg-slate-900/70 hover:bg-[#101828] border-slate-800/90 hover:border-slate-700 hover:scale-[1.02] shadow-sm'
                  }`}
                >
                  {/* Fila superior: Emoji Grande + Contador */}
                  <div className="w-full flex items-center justify-between gap-1">
                    <span className="text-2xl sm:text-3xl filter drop-shadow group-hover:scale-110 transition-transform duration-200">
                      {cat.icon}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isActive ? cat.accent.badge : 'bg-slate-800/80 text-slate-400 border-slate-700'
                    }`}>
                      {count}
                    </span>
                  </div>

                  {/* Fila inferior: Título destacado + Subtítulo descriptivo */}
                  <div className="mt-2 w-full">
                    <h4 className={`text-xs sm:text-sm font-black font-sans leading-tight line-clamp-1 ${
                      isActive ? 'text-white' : 'text-slate-200 group-hover:text-cyan-300'
                    }`}>
                      {cat.label}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5 line-clamp-1 truncate opacity-85">
                      {cat.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Fila: Polos Geográficos & Buscador */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-800/70">
            
            {/* Polos geográficos estilizados */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0 mr-1 font-bold">
                Polo Geográfico:
              </span>
              {QUADRANT_POLES.map(pole => {
                const isActive = selectedQuadrant === pole.id;
                const count = pole.id === 'ALL'
                  ? companies.length
                  : companies.filter(c => inferCompanyQuadrants(c).includes(pole.id as QuadrantType)).length;
                return (
                  <button
                    key={pole.id}
                    onClick={() => setSelectedQuadrant(pole.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer shrink-0 border ${
                      isActive
                        ? 'bg-slate-700 text-white border-slate-500 shadow-md ring-1 ring-slate-400/20'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {pole.label} <span className="text-[10px] opacity-75 font-normal">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Buscador Rápido con diseño moderno */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, tecnología, ciudad o skill..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Fila: Filtros Rápidos & Ordenamiento Dinámico */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-800/70">
            
            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0 mr-1 font-bold">
                Filtro Rápido:
              </span>
              
              <button
                onClick={() => setQuickFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer shrink-0 border ${
                  quickFilter === 'ALL'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                Todos ({companies.length})
              </button>

              <button
                onClick={() => setQuickFilter('HIGH_MATCH')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                  quickFilter === 'HIGH_MATCH'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-emerald-300 border-slate-800'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Alta Afinidad ({highMatchCount})</span>
              </button>

              <button
                onClick={() => setQuickFilter('FAVORITES')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                  quickFilter === 'FAVORITES'
                    ? 'bg-amber-950 text-amber-300 border-amber-700 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-amber-300 border-slate-800'
                }`}
              >
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span>Guardados ({favorites.size})</span>
              </button>

              <button
                onClick={() => setQuickFilter('WITH_CONTACTS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer shrink-0 border flex items-center gap-1.5 ${
                  quickFilter === 'WITH_CONTACTS'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-cyan-300 border-slate-800'
                }`}
              >
                <Users className="h-3.5 w-3.5 text-cyan-400" />
                <span>Con Decisores ({withContactsCount})</span>
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                Ordenar por:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortByType)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer shadow-sm"
              >
                <option value="MATCH">🎯 Mayor Afinidad con Daniel</option>
                <option value="NAME">🔤 Nombre (A-Z)</option>
                <option value="CONTACTS">👥 Nº de Contactos / Decisores</option>
                <option value="QUADRANT">📍 Polo Geográfico</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * 3. ESPACIO DE EXPLORACIÓN INTEGRADO: CUADRÍCULA (IZQ) Y MAPA MUNDIAL (DER)
       * Ambos componentes están siempre activos y se sincronizan en tiempo real
       * con las Categorías de Exploración Estratégica, polos y buscador.
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* COLUMNA IZQUIERDA: Cuadrícula de Organizaciones (lg:col-span-6 xl:col-span-7) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span>Mostrando <strong className="text-cyan-400">{filteredCompanies.length}</strong> entidades</span>
              {(selectedSectorCluster !== 'ALL' || selectedQuadrant !== 'ALL' || searchQuery || quickFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSelectedSectorCluster('ALL');
                    setSelectedQuadrant('ALL');
                    setSearchQuery('');
                    setQuickFilter('ALL');
                  }}
                  className="text-cyan-400 hover:underline cursor-pointer text-[11px] ml-2 font-bold"
                >
                  Resetear filtros
                </button>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Haz click sobre una tarjeta o usa los botones directos
            </span>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <Building2 className="h-10 w-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-mono font-bold text-slate-300">
                No se encontraron organizaciones con los filtros seleccionados
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Prueba cambiando la categoría de sector, el polo geográfico o limpiando el texto del buscador.
              </p>
              <button
                onClick={() => {
                  setSelectedSectorCluster('ALL');
                  setSelectedQuadrant('ALL');
                  setSearchQuery('');
                  setQuickFilter('ALL');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold hover:bg-cyan-900 transition cursor-pointer"
              >
                Mostrar todas las entidades ({companies.length})
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {filteredCompanies.map((comp) => {
                const quads = inferCompanyQuadrants(comp);
                const clusterBadge = getClusterBadge(inferCompanySectorCluster(comp));
                const contactCount = (comp.contacts || []).length;
                const fit = scoredCompaniesMap.get(comp.id) || analyzeCompanyFit(comp);
                const isFav = favorites.has(comp.id);

                return (
                  <div
                    key={comp.id}
                    onClick={() => handleOpenDossier(comp)}
                    className="group relative rounded-2xl p-3 sm:p-3.5 bg-[#0c1220]/95 hover:bg-[#11192e] border border-slate-800/80 hover:border-cyan-500/80 shadow-md hover:shadow-[0_8px_30px_rgba(6,182,212,0.18)] transition-all duration-200 flex flex-col justify-between items-center text-center overflow-hidden min-h-[235px] cursor-pointer"
                  >
                    {/* Top Header inside card: Quadrant + Fit Badge + Star Bookmark */}
                    <div className="w-full flex items-center justify-between gap-1 mb-1.5" onClick={(e) => e.stopPropagation()}>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${getQuadrantColor(quads[0] || 'GLOBAL')}`}>
                        {quads[0] || 'GLOBAL'}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Match Score Badge */}
                        <span 
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-black border flex items-center gap-0.5 shadow-sm ${
                            fit.score >= 90
                              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600/70'
                              : fit.score >= 80
                              ? 'bg-cyan-950/90 text-cyan-300 border-cyan-600/70'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                          title={`${fit.score}% de afinidad con tu formación y áreas de dominio`}
                        >
                          <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
                          <span>{fit.score}%</span>
                        </span>

                        {/* Favorite Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(comp.id, e)}
                          className="p-1 rounded-md hover:bg-slate-800 transition cursor-pointer text-slate-400 hover:text-amber-400"
                          title={isFav ? 'Quitar de guardados' : 'Guardar en favoritos'}
                        >
                          <Star className={`h-3.5 w-3.5 ${isFav ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Center Logo & Name */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full my-1">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-700/80 p-2.5 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:border-cyan-400 transition-all duration-200 shrink-0">
                        <CompanyLogo website={comp.website} name={comp.name} />
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-white font-sans line-clamp-2 mt-2 leading-snug group-hover:text-cyan-300 transition-colors">
                        {comp.name}
                      </h4>

                      <p className="text-[10px] text-slate-400 font-mono line-clamp-1 mt-1 truncate max-w-full">
                        📍 {comp.headquarters}
                      </p>

                      <div className="mt-1 flex items-center gap-1 flex-wrap justify-center">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold border ${clusterBadge.color} inline-block truncate max-w-[120px]`}>
                          {clusterBadge.label}
                        </span>
                        {contactCount > 0 && (
                          <span 
                            className="text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 flex items-center gap-0.5" 
                            title={`${contactCount} decisor(es) mapeados`}
                          >
                            <Users className="h-2.5 w-2.5" />
                            {contactCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* =========================================================
                     * 4. LOS DOS BOTONES INFERIORES:
                     * IZQUIERDA: "Ir a la página" | DERECHA: "Más información"
                     * ========================================================= */}
                    <div className="w-full grid grid-cols-2 gap-1.5 pt-2.5 mt-2 border-t border-slate-800/80" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={comp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white border border-slate-700 hover:border-sky-500 text-[10px] sm:text-[11px] font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer truncate"
                        title={`Visitar web oficial de ${comp.name}`}
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">Ir a la página</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleOpenDossier(comp)}
                        className="px-2 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono font-bold text-[10px] sm:text-[11px] shadow-sm transition flex items-center justify-center gap-1 cursor-pointer truncate"
                        title={`Ver expediente completo de ${comp.name}`}
                      >
                        <Eye className="h-3 w-3 shrink-0" />
                        <span className="truncate">Más información</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Mapa Mundial Interactivo (lg:col-span-6 xl:col-span-5 lg:sticky lg:top-4) */}
        <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-4 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 font-bold">
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>Mapa Mundial Geoestratégico</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400/80">
              {filteredCompanies.length} nodos activos
            </span>
          </div>

          <CompaniesWorldMap
            companies={filteredCompanies}
            onOpenDossier={handleOpenDossier}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>

      </div>

      {/* =========================================================================
       * 5. MODAL DETALLADO DE "MÁS INFORMACIÓN" (EXPEDIENTE COMPLETO)
       * ========================================================================= */}
      {isDossierModalOpen && dossierCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b101e] border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-5 my-auto">
            
            {/* Modal Top Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-700 p-2.5 flex items-center justify-center shrink-0 shadow-md">
                  <CompanyLogo website={dossierCompany.website} name={dossierCompany.name} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {dossierCompany.name}
                    </h3>
                    {dossierCompany.website && (
                      <a
                        href={dossierCompany.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 transition"
                        title="Abrir página oficial en nueva pestaña"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 font-mono">
                    <span>📍 {dossierCompany.headquarters}</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-semibold">{dossierCompany.sector}</span>
                    <span>•</span>
                    <span>👥 {dossierCompany.size}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${getQuadrantColor(inferCompanyQuadrants(dossierCompany)[0] || 'GLOBAL')}`}>
                      Polo: {inferCompanyQuadrants(dossierCompany).join(', ')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${getClusterBadge(inferCompanySectorCluster(dossierCompany)).color}`}>
                      {getClusterBadge(inferCompanySectorCluster(dossierCompany)).label}
                    </span>
                    {dossierFit && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-600 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-emerald-400" />
                        {dossierFit.score}% Afinidad con Daniel
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal Header */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-start flex-wrap">
                {onStartPipeline && (
                  <button
                    onClick={() => {
                      onStartPipeline(dossierCompany.id);
                      setIsDossierModalOpen(false);
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                    title="Iniciar prospección directa y preparar CV/Carta"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Iniciar Prospección / Carta</span>
                  </button>
                )}

                <button
                  onClick={() => handleOpenPreview(dossierCompany)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold rounded-xl border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                  title="Previsualizar sitio web dentro de la app"
                >
                  <Eye className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Vista Previa</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(dossierCompany)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold rounded-xl border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                  title="Editar datos de la ficha"
                >
                  <Edit3 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => setIsDossierModalOpen(false)}
                  className="p-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 hover:border-rose-700 border border-slate-700 transition cursor-pointer font-mono text-xs font-bold"
                  title="Cerrar ventana"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* =========================================================================
             * SECCIÓN ESPECIAL PERSONALIZADA: TU ÁNGULO DE ENTRADA RECOMENDADO
             * ========================================================================= */}
            {dossierFit && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-emerald-950/60 border border-cyan-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-300 font-mono">
                        🎯 TU PROPUESTA DE VALOR & ÁNGULO DE ENTRADA RECOMENDADO
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Estrategia a medida basada en tu perfil de Geofísico, investigación en turberas (CAU Kiel) y peritaje en cuencas.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {dossierFit.score}% Afinidad
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {dossierFit.winningAngle}
                </div>

                {dossierFit.matchedPillars.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                      Pilares de afinidad demostrada:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dossierFit.matchedPillars.map((p, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-1">
                          <span className="font-bold text-cyan-300 font-mono">{p.badge}</span>
                          <p className="text-slate-400 leading-normal">{p.evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {dossierCompany.description}
            </div>

            {/* SECCIÓN 1: DECISORES & CONTACTOS CLAVE (HIRING MANAGERS & PIs) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1a] border border-cyan-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-300 font-mono">
                      DECISORES & CONTACTOS CLAVE // HIRING MANAGERS & PIs
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Investigadores principales y líderes de área identificados para contacto directo.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddingContact(!isAddingContact)}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>{isAddingContact ? 'Cancelar' : 'Agregar Decisor'}</span>
                </button>
              </div>

              {/* Form inline to add a contact */}
              {isAddingContact && (
                <form onSubmit={handleAddContactSubmit} className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Nombre y Apellido *</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Ej: Dr. Markus Reichstein"
                        required
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Rol / Cargo *</label>
                      <input
                        type="text"
                        value={contactRole}
                        onChange={(e) => setContactRole(e.target.value)}
                        placeholder="Ej: Director Biogeochemical Integration / PI"
                        required
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Email de contacto</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="contacto@instituto.org"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">LinkedIn URL</label>
                      <input
                        type="url"
                        value={contactLinkedin}
                        onChange={(e) => setContactLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Notas / Publicaciones relevantes</label>
                    <input
                      type="text"
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                      placeholder="Coordinador de la red Eddy Covariance ICOS..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingContact(false)}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold cursor-pointer"
                    >
                      Guardar Decisor
                    </button>
                  </div>
                </form>
              )}

              {/* Contact list */}
              {(!dossierCompany.contacts || dossierCompany.contacts.length === 0) ? (
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-center">
                  <p className="text-xs text-slate-500 font-mono">
                    Aún no has mapeado decisores específicos para esta organización. Haz click en "Agregar Decisor" para guardar el PI, líder de laboratorio o recruiter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dossierCompany.contacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition space-y-1.5 relative group/contact"
                    >
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover/contact:opacity-100 transition cursor-pointer"
                        title="Eliminar contacto"
                      >
                        ✕
                      </button>

                      <div className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span>{contact.name}</span>
                      </div>

                      <div className="text-[11px] text-cyan-400 font-mono">
                        {contact.role}
                      </div>

                      {contact.notes && (
                        <div className="text-[10px] text-slate-400 italic">
                          "{contact.notes}"
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-[10px] font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
                          >
                            <Mail className="h-3 w-3 text-cyan-400" />
                            <span>{contact.email}</span>
                          </a>
                        )}
                        {contact.linkedinUrl && (
                          <a
                            href={contact.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
                          >
                            <LinkIcon className="h-3 w-3 text-blue-400" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECCIÓN 2: CONVOCATORIAS & VÍNCULOS DE FINANCIACIÓN */}
            {relatedFunding.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1a] border border-emerald-500/30 shadow-xl space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Coins className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300 font-mono">
                      VÍNCULOS DE FINANCIACIÓN & CONVOCATORIAS ASOCIADAS
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Instrumentos públicos y programas de I+D (Horizon Europe, DFG, Hazitek, Marie Curie) con los que esta entidad contrata.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedFunding.map((fund) => (
                    <div key={fund.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <div className="font-bold text-xs text-white font-mono flex items-center gap-1">
                        <span>💰</span>
                        <span className="truncate">{fund.title}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono font-bold">
                        {fund.amount} • {fund.category}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2">
                        {fund.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN 3: ARGUMENTOS DE ENTREVISTA TÉCNICA */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-teal-300 font-mono">
                    ARGUMENTOS DE ENTREVISTA & FIT TÉCNICO
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Puntos fuertes preparados para fundamentar tu postulación o conversación con decisores.
                  </p>
                </div>
              </div>

              <ul className="space-y-2">
                {dossierCompany.interviewArguments.map((arg, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-teal-400 shrink-0 font-mono font-bold">✓</span>
                    <span>{arg}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SECCIÓN 4: PROYECTOS CLAVE & TECH STACK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Proyectos clave */}
              <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold text-xs text-white">
                  <Briefcase className="h-4 w-4 text-cyan-400" />
                  <span>PROYECTOS ESTRATÉGICOS & LÍNEAS DE I+D</span>
                </div>
                <ul className="space-y-1.5">
                  {dossierCompany.keyProjects.map((proj, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-cyan-500 font-mono">•</span>
                      <span>{proj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold text-xs text-white">
                  <span>⚙️</span>
                  <span>TECNOLOGÍAS & METODOLOGÍAS DEL CENTRO</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(dossierCompany.techStack || []).map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN 5: NOTICIAS RECIENTES */}
            {dossierCompany.recentNews.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-mono font-bold text-xs text-white">
                  <Newspaper className="h-4 w-4 text-cyan-400" />
                  <span>NOTICIAS RECIENTES & PUBLICACIONES</span>
                </div>
                <div className="space-y-2">
                  {dossierCompany.recentNews.map((news, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span className="font-bold text-white">{news.title}</span>
                        <span>{news.date}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{news.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN 6: ALERTAS / RED FLAGS */}
            {dossierCompany.redFlags.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold text-xs text-rose-300">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  <span>ALERTAS / CONDICIONES A TENER EN CUENTA</span>
                </div>
                <ul className="space-y-1">
                  {dossierCompany.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-xs text-rose-200/80 flex items-start gap-1.5">
                      <span className="text-rose-400 font-mono">⚠</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer close button & Direct action */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800 flex-wrap gap-2">
              <span className="text-[11px] font-mono text-slate-500">
                Última actualización de inteligencia: {dossierCompany.lastResearched}
              </span>

              <div className="flex items-center gap-2">
                {onStartPipeline && (
                  <button
                    type="button"
                    onClick={() => {
                      onStartPipeline(dossierCompany.id);
                      setIsDossierModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Redactar Carta para esta Organización</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsDossierModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs transition cursor-pointer"
                >
                  Cerrar Expediente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       * 6. MODALS ADICIONALES (AGREGAR, EDITAR, PREVIEW WEB, BENCHMARK)
       * ========================================================================= */}
      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCompanyAdded={handleCompanyAdded}
      />

      {companyToEdit && (
        <EditCompanyModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCompanyToEdit(null);
          }}
          company={companyToEdit}
          onCompanyUpdated={handleCompanyUpdated}
        />
      )}

      {previewUrl && (
        <WebsitePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setPreviewUrl('');
          }}
          url={previewUrl}
          title={previewTitle}
          company={previewTitle}
          location={dossierCompany?.headquarters || 'Oficial'}
        />
      )}

      {/* Benchmark Probabilidad Modal */}
      {isBenchmarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b101e] border border-slate-700 rounded-3xl p-6 max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <span>BENCHMARK DE PROBABILIDAD DE EMPLEO // DANIEL SANTANDER (3-6M)</span>
              </h3>
              <button
                onClick={() => setIsBenchmarkModalOpen(false)}
                className="p-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer font-mono text-xs font-bold"
              >
                ✕ CERRAR
              </button>
            </div>
            <ClusterBenchmarkTable 
              onSelectClusterFilter={(cl, q) => {
                setSelectedSectorCluster(cl);
                setSelectedQuadrant(q);
                setIsBenchmarkModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

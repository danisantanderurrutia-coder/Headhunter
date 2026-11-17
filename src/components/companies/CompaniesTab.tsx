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
  SlidersHorizontal
} from 'lucide-react';
import { getStoredCompanies, saveStoredCompanies } from '../../services/db';
import type { CompanyDossier, QuadrantType, CompanyContact, CompanySectorCluster } from '../../types/companies';
import { AddCompanyModal } from './AddCompanyModal';
import { EditCompanyModal } from './EditCompanyModal';
import { WebsitePreviewModal } from '../common/WebsitePreviewModal';
import { ClusterBenchmarkTable } from '../radar/ClusterBenchmarkTable';
import { FUNDING_CATALOG } from '../../data/fundingCatalog';
import { inferCompanyQuadrants, inferCompanySectorCluster } from '../../utils/quadrants';

interface CompaniesTabProps {
  onStartPipeline?: (companyId: string) => void;
  initialQuadrant?: string;
  initialSectorCluster?: CompanySectorCluster;
}

interface CompanyLogoProps {
  website?: string;
  name: string;
}

/**
 * Componente resiliente para extraer y mostrar el logo real de internet
 * utilizando Google Favicon Service (128px), con respaldo en DuckDuckGo
 * y monograma tipográfico personalizado si no hay conexión o logo disponible.
 */
export const CompanyLogo: React.FC<CompanyLogoProps> = ({ website, name }) => {
  const [imgError, setImgError] = useState(false);
  const [ddgError, setDdgError] = useState(false);

  const domain = useMemo(() => {
    if (!website) return '';
    try {
      const u = new URL(website.startsWith('http') ? website : `https://${website}`);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }, [website]);

  const initials = useMemo(() => {
    const clean = name.replace(/\([^)]*\)/g, '').trim();
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
    return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase();
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

  // Add Contact Form inline state (dentro del modal de Más Información)
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

  // Filter companies by quadrant, sector cluster, and search
  const filteredCompanies = useMemo(() => {
    return companies.filter(comp => {
      const quads = inferCompanyQuadrants(comp);
      if (selectedQuadrant !== 'ALL' && !quads.includes(selectedQuadrant as QuadrantType)) {
        return false;
      }
      const cluster = inferCompanySectorCluster(comp);
      if (selectedSectorCluster !== 'ALL' && cluster !== selectedSectorCluster) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = comp.name.toLowerCase().includes(q);
        const inSector = comp.sector.toLowerCase().includes(q);
        const inHQ = comp.headquarters.toLowerCase().includes(q);
        const inProjects = (comp.keyProjects || []).some(p => p.toLowerCase().includes(q));
        const inTech = (comp.techStack || []).some(t => t.toLowerCase().includes(q));
        return inName || inSector || inHQ || inProjects || inTech;
      }
      return true;
    });
  }, [companies, selectedQuadrant, selectedSectorCluster, searchQuery]);

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

  const SECTOR_CATEGORIES: { id: CompanySectorCluster; label: string; icon: string }[] = [
    { id: 'ALL', label: 'Todos los Sectores', icon: '🌐' },
    { id: 'RD_PUBLIC', label: 'I+D Público & Centros', icon: '🏛️' },
    { id: 'CARBON_TECH_MRV', label: 'Carbon-Tech & MRV', icon: '🌿' },
    { id: 'CAT_RISK_INSURANCE', label: 'Cat Risk & Seguros', icon: '⚡' },
    { id: 'MULTILATERAL_POLICY', label: 'Multilateral & Políticas', icon: '🌍' },
    { id: 'GEOTHERMAL_ENERGY', label: 'Geotermia & Subsuelo', icon: '🌋' }
  ];

  const QUADRANT_POLES: { id: string; label: string }[] = [
    { id: 'ALL', label: 'Todos los Polos' },
    { id: 'EUSKADI', label: 'Euskadi / España' },
    { id: 'DACH', label: 'DACH (Alemania/Suiza)' },
    { id: 'UK_NL', label: 'UK & Países Bajos' },
    { id: 'NORDICS', label: 'Nórdicos' },
    { id: 'GLOBAL', label: 'Global / Remoto' }
  ];

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
              {companies.length} Sitios Guardados
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Exploración visual por categorías de centros de investigación, empresas de impacto y universidades verificadas.
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
       * 2. BARRAS DE EXPLORACIÓN POR CATEGORÍAS & BÚSQUEDA
       * ========================================================================= */}
      <div className="p-4 rounded-2xl bg-[#090e1a]/95 border border-slate-800 shadow-xl space-y-3.5">
        
        {/* Row 1: Categorías de Sector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold px-0.5">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-cyan-300">
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
              1. Selecciona Categoría de Entidad:
            </span>
            <span className="text-slate-500">
              {selectedSectorCluster === 'ALL' ? 'Todos los sectores' : getClusterBadge(selectedSectorCluster).label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800/90 overflow-x-auto max-w-full">
            {SECTOR_CATEGORIES.map(cat => {
              const isActive = selectedSectorCluster === cat.id;
              const count = cat.id === 'ALL' 
                ? companies.length 
                : companies.filter(c => inferCompanySectorCluster(c) === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSectorCluster(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-cyan-950 text-cyan-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Polos Geográficos & Buscador */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
          
          {/* Polos geográficos */}
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
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition cursor-pointer shrink-0 border ${
                    isActive
                      ? 'bg-slate-700 text-white border-slate-600 shadow'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  {pole.label} <span className="text-[9px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Buscador Rápido */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, tecnología, ciudad..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 3. ESPACIO DE EXPLORACIÓN // CUADRÍCULA DE ICONOS DE ORGANIZACIONES
       * ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span>Mostrando <strong className="text-cyan-400">{filteredCompanies.length}</strong> sitios</span>
            {(selectedSectorCluster !== 'ALL' || selectedQuadrant !== 'ALL' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedSectorCluster('ALL');
                  setSelectedQuadrant('ALL');
                  setSearchQuery('');
                }}
                className="text-cyan-400 hover:underline cursor-pointer text-[11px] ml-2"
              >
                Resetear filtros
              </button>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Pasa el cursor sobre un sitio para ir a su web o ver su dossier
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
              }}
              className="px-4 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold hover:bg-cyan-900 transition"
            >
              Mostrar todas las organizaciones ({companies.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
            {filteredCompanies.map((comp) => {
              const quads = inferCompanyQuadrants(comp);
              const clusterBadge = getClusterBadge(inferCompanySectorCluster(comp));
              const contactCount = (comp.contacts || []).length;

              return (
                <div
                  key={comp.id}
                  className="group relative rounded-2xl p-3.5 sm:p-4 bg-[#0c1220]/95 hover:bg-[#11192e] border border-slate-800/80 hover:border-cyan-500/80 shadow-md hover:shadow-[0_8px_30px_rgba(6,182,212,0.18)] transition-all duration-200 flex flex-col justify-between items-center text-center overflow-hidden min-h-[225px]"
                >
                  {/* Top mini badges */}
                  <div className="w-full flex items-center justify-between gap-1 mb-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${getQuadrantColor(quads[0] || 'GLOBAL')}`}>
                      {quads[0] || 'GLOBAL'}
                    </span>
                    {contactCount > 0 && (
                      <span 
                        className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 flex items-center gap-0.5" 
                        title={`${contactCount} decisor(es) mapeados`}
                      >
                        <Users className="h-2.5 w-2.5" />
                        {contactCount}
                      </span>
                    )}
                  </div>

                  {/* Center Logo & Name */}
                  <div className="flex-1 flex flex-col items-center justify-center w-full my-1">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-700/80 p-2.5 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:border-cyan-400 transition-all duration-200 shrink-0">
                      <CompanyLogo website={comp.website} name={comp.name} />
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-white font-sans line-clamp-2 mt-2.5 leading-snug group-hover:text-cyan-300 transition-colors">
                      {comp.name}
                    </h4>

                    <p className="text-[10px] text-slate-400 font-mono line-clamp-1 mt-1 truncate max-w-full">
                      📍 {comp.headquarters}
                    </p>

                    <div className="mt-1.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${clusterBadge.color} inline-block truncate max-w-[130px]`}>
                        {clusterBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* =========================================================
                   * 4. LOS DOS BOTONES INFERIORES:
                   * IZQUIERDA: "Ir a la página" | DERECHA: "Más información"
                   * ========================================================= */}
                  <div className="w-full grid grid-cols-2 gap-1.5 pt-2.5 mt-2 border-t border-slate-800/80">
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
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
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-cyan-400 font-medium">{dossierCompany.sector}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300">📍 {dossierCompany.headquarters}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{dossierCompany.size}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {inferCompanyQuadrants(dossierCompany).map(q => (
                      <span key={q} className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border ${getQuadrantColor(q)}`}>
                        {q}
                      </span>
                    ))}
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${getClusterBadge(inferCompanySectorCluster(dossierCompany)).color}`}>
                      {getClusterBadge(inferCompanySectorCluster(dossierCompany)).label}
                    </span>
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
                    <span>Iniciar Prospección</span>
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
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Ej: Dr. Markus Weiler / Prof. Angela Meyer"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Cargo / Rol *</label>
                      <input
                        type="text"
                        required
                        value={contactRole}
                        onChange={(e) => setContactRole(e.target.value)}
                        placeholder="Ej: Head of Research / Director Técnico"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Perfil LinkedIn</label>
                      <input
                        type="url"
                        value={contactLinkedin}
                        onChange={(e) => setContactLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Correo Institucional</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="nombre@instituto.de"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Notas / Publicaciones de interés</label>
                    <input
                      type="text"
                      value={contactNotes}
                      onChange={(e) => setContactNotes(e.target.value)}
                      placeholder="Ej: Lidera el proyecto de torres eddy covariance o modelos climáticos."
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingContact(false)}
                      className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition"
                    >
                      Guardar Decisor
                    </button>
                  </div>
                </form>
              )}

              {/* List of contacts */}
              {dossierCompany.contacts && dossierCompany.contacts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dossierCompany.contacts.map((cnt) => (
                    <div key={cnt.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 relative group">
                      <div className="flex items-start justify-between">
                        <h5 className="font-bold text-sm text-white">{cnt.name}</h5>
                        <button
                          onClick={() => handleDeleteContact(cnt.id)}
                          className="text-slate-500 hover:text-rose-400 text-xs opacity-0 group-hover:opacity-100 transition"
                          title="Eliminar contacto"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-xs text-cyan-400 font-medium">{cnt.role}</p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                        {cnt.linkedinUrl && (
                          <a
                            href={cnt.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <LinkIcon className="h-3 w-3" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                        {cnt.email && (
                          <a
                            href={`mailto:${cnt.email}`}
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <Mail className="h-3 w-3" />
                            <span>{cnt.email}</span>
                          </a>
                        )}
                      </div>

                      {cnt.notes && (
                        <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 italic">
                          "{cnt.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-400">
                  No hay decisores registrados para esta organización. Haz clic en <strong className="text-cyan-400">"Agregar Decisor"</strong> para mapear al investigador principal o responsable de contratación.
                </div>
              )}
            </div>

            {/* SECCIÓN 2: CONVOCATORIAS ASOCIADAS / PALANCA DE FINANCIACIÓN */}
            {relatedFunding.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 font-mono flex items-center gap-2">
                    <Coins className="h-4 w-4 text-amber-400" />
                    <span>CONVOCATORIAS & FONDOS PUENTE ASOCIADOS</span>
                  </h4>
                  <span className="text-[10px] text-amber-400/80 font-mono">
                    Argumento de co-financiación
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {relatedFunding.map((fund) => (
                    <div key={fund.id} className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-900/40 text-xs space-y-1">
                      <div className="font-bold text-white leading-snug">{fund.title}</div>
                      <div className="text-[11px] text-amber-400 font-mono">{fund.organization} • {fund.amount}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{fund.strategicFit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN 3: ARGUMENTOS RETÓRICOS PARA ENTREVISTAS & PITCH */}
            <div className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300 flex items-center space-x-2 font-mono">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>ARGUMENTOS ESTRATÉGICOS // PRUEBA DE SOLVENCIA PARA ESTA ORGANIZACIÓN</span>
              </h4>
              <div className="space-y-2">
                {dossierCompany.interviewArguments.map((arg, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-emerald-800/40 text-xs text-slate-200 flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{arg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 4: PROYECTOS Y NOTICIAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Proyectos Clave */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5 font-mono">
                  <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
                  <span>LÍNEAS DE INVESTIGACIÓN & PROYECTOS</span>
                </h4>
                <div className="space-y-1.5">
                  {dossierCompany.keyProjects.map((proj, i) => (
                    <div key={i} className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      {proj}
                    </div>
                  ))}
                </div>
              </div>

              {/* Noticias Recientes */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5 font-mono">
                  <Newspaper className="h-3.5 w-3.5 text-lime-400" />
                  <span>SEÑALES RECIENTES // NOTICIAS</span>
                </h4>
                <div className="space-y-2">
                  {dossierCompany.recentNews.map((news, i) => (
                    <div key={i} className="text-xs space-y-0.5 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      <div className="font-semibold text-slate-200 flex items-center justify-between">
                        <span>{news.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{news.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{news.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Red Flags / Risk Alert */}
            {dossierCompany.redFlags.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-2 text-xs">
                <h4 className="font-bold flex items-center space-x-1.5 text-rose-200 font-mono">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  <span>CONSIDERACIONES & ALERTAS DE PROCESO</span>
                </h4>
                <div className="space-y-1">
                  {dossierCompany.redFlags.map((flag, i) => (
                    <div key={i} className="flex items-start space-x-1.5">
                      <span>•</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer close button */}
            <div className="pt-2 flex justify-end border-t border-slate-800">
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

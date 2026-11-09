import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Globe, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Code2, 
  Edit3, 
  GraduationCap, 
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Cpu,
  Activity,
  Compass
} from 'lucide-react';
import { getStoredProfile, saveStoredProfile } from '../../services/db';
import { initialProfile } from '../../services/sampleData';
import type { 
  MasterProfile, 
  Achievement, 
  WorkExperience, 
  Education, 
  SkillItem, 
  LanguageItem,
  PublicationProfileItem,
  ConferenceProfileItem
} from '../../types/profile';
import { AchievementBank } from './AchievementBank';
import { CVParserModal } from './CVParserModal';
import { AddExperienceModal } from './AddExperienceModal';
import { EditExperienceModal } from './EditExperienceModal';
import type { ParsedCVResult } from '../../services/cvParser';
import { generateMasterProfileMarkdown } from '../../utils/masterProfileMarkdown';
import danielProfileImg from '../../assets/daniel_santander_profile.jpg';

type TacticalFilter = 'all' | 'biofisica' | 'mrv' | 'cat_risk' | 'policy' | 'comms';

export const MasterProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<MasterProfile>(getStoredProfile());
  const [isSaved, setIsSaved] = useState(false);
  const [isCopiedMd, setIsCopiedMd] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<TacticalFilter>('all');
  const [isParserOpen, setIsParserOpen] = useState(false);
  const [isAddExpOpen, setIsAddExpOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);

  // Inline additions
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'Tech' | 'Soft' | 'Domain' | 'Tools'>('Tech');
  const [newLangName, setNewLangName] = useState('');
  const [newLangProf, setNewLangProf] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Nativo'>('B2');

  // Education state
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduYears, setEduYears] = useState('');

  // Publications state
  const [isAddingPub, setIsAddingPub] = useState(false);
  const [pubTitle, setPubTitle] = useState('');
  const [pubOutlet, setPubOutlet] = useState('');
  const [pubDate, setPubDate] = useState('');
  const [pubUrl, setPubUrl] = useState('');
  const [pubCategory, setPubCategory] = useState<'policy' | 'press' | 'essays' | 'scientific'>('policy');
  const [pubSummary, setPubSummary] = useState('');

  // Conferences state
  const [isAddingConf, setIsAddingConf] = useState(false);
  const [confTitle, setConfTitle] = useState('');
  const [confEvent, setConfEvent] = useState('');
  const [confLocation, setConfLocation] = useState('');
  const [confDate, setConfDate] = useState('');
  const [confRole, setConfRole] = useState('Conferencista Internacional');
  const [confSummary, setConfSummary] = useState('');

  const handleSaveProfile = () => {
    saveStoredProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSyncWithPortfolio = () => {
    if (window.confirm('¿Sincronizar el expediente maestro con los datos verificados del portafolio oficial? Esto integrará todas las experiencias, publicaciones, conferencias y certificaciones contrastadas.')) {
      saveStoredProfile(initialProfile);
      setProfile(initialProfile);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleCopyMarkdown = () => {
    const md = generateMasterProfileMarkdown(profile);
    navigator.clipboard.writeText(md);
    setIsCopiedMd(true);
    setTimeout(() => setIsCopiedMd(false), 2200);
  };

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItemId(id);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  const handleApplyParsedProfile = (parsed: ParsedCVResult, mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      const updated: MasterProfile = {
        ...profile,
        fullName: parsed.fullName || profile.fullName,
        email: parsed.email || profile.email,
        phone: parsed.phone || profile.phone,
        summary: parsed.summary || profile.summary,
        experiences: parsed.experiences,
        education: parsed.education.length > 0 ? parsed.education : profile.education,
        skills: parsed.skills.length > 0 ? parsed.skills : profile.skills,
        languages: parsed.languages.length > 0 ? parsed.languages : profile.languages,
        achievementsBank: parsed.achievements.length > 0 ? parsed.achievements : profile.achievementsBank,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setProfile(updated);
      saveStoredProfile(updated);
    } else {
      const updated: MasterProfile = {
        ...profile,
        fullName: parsed.fullName || profile.fullName,
        email: parsed.email || profile.email,
        phone: parsed.phone || profile.phone,
        summary: parsed.summary ? `${profile.summary}\n\n${parsed.summary}` : profile.summary,
        experiences: [...parsed.experiences, ...profile.experiences],
        education: [...parsed.education, ...profile.education],
        skills: [...parsed.skills, ...profile.skills],
        languages: [...parsed.languages, ...profile.languages],
        achievementsBank: [...parsed.achievements, ...profile.achievementsBank],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setProfile(updated);
      saveStoredProfile(updated);
    }
  };

  const handleAddExperience = (newExp: WorkExperience) => {
    const updated = {
      ...profile,
      experiences: [newExp, ...profile.experiences]
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleSaveExperienceEdit = (updatedExp: WorkExperience) => {
    const updated = {
      ...profile,
      experiences: profile.experiences.map(e => e.id === updatedExp.id ? updatedExp : e)
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setEditingExperience(null);
  };

  const handleDeleteExperience = (id: string) => {
    const updated = {
      ...profile,
      experiences: profile.experiences.filter(e => e.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduDegree || !eduInstitution) return;
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: eduDegree,
      institution: eduInstitution,
      fieldOfStudy: eduDegree,
      startDate: eduYears ? eduYears.split('-')[0].trim() : '2023',
      endDate: eduYears && eduYears.includes('-') ? eduYears.split('-')[1].trim() : 'Presente',
      location: 'Europa / Chile',
      isVerified: true
    };
    const updated = {
      ...profile,
      education: [...profile.education, newEdu]
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setEduDegree('');
    setEduInstitution('');
    setEduYears('');
    setIsAddingEdu(false);
  };

  const handleDeleteEducation = (id: string) => {
    const updated = {
      ...profile,
      education: profile.education.filter(e => e.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const newSk: SkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: 'Avanzado',
      yearsOfExperience: 4
    };
    const updated = {
      ...profile,
      skills: [...profile.skills, newSk]
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setNewSkillName('');
  };

  const handleDeleteSkill = (id: string) => {
    const updated = {
      ...profile,
      skills: profile.skills.filter(s => s.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    const newL: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: newLangName.trim(),
      proficiency: newLangProf
    };
    const updated = {
      ...profile,
      languages: [...profile.languages, newL]
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setNewLangName('');
  };

  const handleDeleteLanguage = (id: string) => {
    const updated = {
      ...profile,
      languages: profile.languages.filter(l => l.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddAchievement = (newAch: Achievement) => {
    const updated = {
      ...profile,
      achievementsBank: [newAch, ...profile.achievementsBank]
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleUpdateAchievement = (updatedAch: Achievement) => {
    const updated = {
      ...profile,
      achievementsBank: profile.achievementsBank.map(a => a.id === updatedAch.id ? updatedAch : a)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleDeleteAchievement = (id: string) => {
    const updated = {
      ...profile,
      achievementsBank: profile.achievementsBank.filter(a => a.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim() || !pubOutlet.trim()) return;
    const newPub: PublicationProfileItem = {
      id: `pub-${Date.now()}`,
      title: pubTitle.trim(),
      outlet: pubOutlet.trim(),
      date: pubDate || '2024',
      url: pubUrl.trim() || undefined,
      category: pubCategory,
      summary: pubSummary.trim() || pubTitle.trim(),
      tags: [pubCategory.toUpperCase()]
    };
    const updated = {
      ...profile,
      publications: [...(profile.publications || []), newPub]
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setPubTitle('');
    setPubOutlet('');
    setPubDate('');
    setPubUrl('');
    setPubSummary('');
    setIsAddingPub(false);
  };

  const handleDeletePublication = (id: string) => {
    const updated = {
      ...profile,
      publications: (profile.publications || []).filter(p => p.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  const handleAddConference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confTitle.trim() || !confEvent.trim()) return;
    const newConf: ConferenceProfileItem = {
      id: `conf-${Date.now()}`,
      title: confTitle.trim(),
      event: confEvent.trim(),
      location: confLocation.trim() || 'Internacional',
      date: confDate || '2025',
      role: confRole.trim() || 'Conferencista Internacional',
      summary: confSummary.trim() || confTitle.trim(),
      tags: ['Internacional', 'Justicia Climática']
    };
    const updated = {
      ...profile,
      conferences: [...(profile.conferences || []), newConf]
    };
    setProfile(updated);
    saveStoredProfile(updated);
    setConfTitle('');
    setConfEvent('');
    setConfLocation('');
    setConfDate('');
    setConfSummary('');
    setIsAddingConf(false);
  };

  const handleDeleteConference = (id: string) => {
    const updated = {
      ...profile,
      conferences: (profile.conferences || []).filter(c => c.id !== id)
    };
    setProfile(updated);
    saveStoredProfile(updated);
  };

  // Tactical Filtering for Experiences
  const matchesTactical = (exp: WorkExperience): boolean => {
    if (activeFilter === 'all') return true;
    const text = `${exp.role} ${exp.company} ${exp.summary} ${(exp.technologies || []).join(' ')}`.toLowerCase();
    if (activeFilter === 'biofisica') {
      return text.includes('kiel') || text.includes('eddy covariance') || text.includes('turbera') || text.includes('gei') || text.includes('suelos') || text.includes('limnolog');
    }
    if (activeFilter === 'mrv') {
      return text.includes('agritwin') || text.includes('sentinel') || text.includes('biomasa') || text.includes('carbono') || text.includes('geopandas') || text.includes('iot');
    }
    if (activeFilter === 'cat_risk') {
      return text.includes('geofísic') || text.includes('incendio') || text.includes('sev') || text.includes('catástrofe') || text.includes('desastre') || text.includes('freático');
    }
    if (activeFilter === 'policy') {
      return text.includes('congreso') || text.includes('diputad') || text.includes('legislat') || text.includes('política') || text.includes('epn') || text.includes('salvaguardia') || text.includes('cuenca');
    }
    if (activeFilter === 'comms') {
      return text.includes('apruebo rural') || text.includes('primera línea') || text.includes('campaña') || text.includes('prensa') || text.includes('700') || text.includes('medio');
    }
    return true;
  };

  const filteredExperiences = profile.experiences.filter(matchesTactical);

  return (
    <div className="space-y-6">
      {/* =========================================================================
       * 1. TOP COMMAND HEADER & AUDIT BADGE
       * ========================================================================= */}
      <div 
        className="p-5 sm:p-6 rounded-2xl border shadow-md space-y-4 transition-colors"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span>EXPEDIENTE MAESTRO INTEGRAL • 100% VERIFICADO</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                Portafolio Oficial: CAU Kiel • AMU Poznań • U. de Chile
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <User className="h-6 w-6 text-emerald-500 shrink-0" />
              <span>Expediente Profesional Maestro (Dossier Base)</span>
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-3xl leading-relaxed">
              Repositorio maestro con el registro exhaustivo de tu trayectoria científica, territorial y comunicacional. 
              Fuente fidedigna para alimentar y auditar CVs, cartas de motivación y postulaciones de alto nivel sin datos inventados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleSyncWithPortfolio}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-600 transition flex items-center space-x-1.5 cursor-pointer"
              title="Restaurar o sincronizar el expediente con todos los datos verificados del portafolio"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              <span>Sincronizar Portafolio</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-2 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/40 transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
              title="Copiar todo el expediente en formato Markdown para preparar CVs"
            >
              {isCopiedMd ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>¡Expediente Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar Expediente (MD)</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsParserOpen(true)}
              className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Analizar CV</span>
            </button>

            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Guardar Perfil</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Asset Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-[var(--panel-border)] text-[11px] font-mono">
          <div className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] flex flex-col">
            <span className="text-[var(--text-muted)] text-[10px]">TÍTULOS UNIV.</span>
            <span className="text-emerald-500 font-bold text-sm">{profile.education.length} Títulos</span>
          </div>
          <div className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] flex flex-col">
            <span className="text-[var(--text-muted)] text-[10px]">CERTIFICACIONES</span>
            <span className="text-cyan-500 font-bold text-sm">{profile.otherCourses?.length || 0} Acreditadas</span>
          </div>
          <div className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] flex flex-col">
            <span className="text-[var(--text-muted)] text-[10px]">EXPERIENCIAS</span>
            <span className="text-emerald-500 font-bold text-sm">{profile.experiences.length} Verificadas</span>
          </div>
          <div className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] flex flex-col">
            <span className="text-[var(--text-muted)] text-[10px]">PUBLICACIONES</span>
            <span className="text-amber-500 font-bold text-sm">{profile.publications?.length || 0} Artículos/Docs</span>
          </div>
          <div className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] flex flex-col">
            <span className="text-[var(--text-muted)] text-[10px]">CONFERENCIAS</span>
            <span className="text-rose-400 font-bold text-sm">{profile.conferences?.length || 0} Cumbres/Foros</span>
          </div>
          <div className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] flex flex-col">
            <span className="text-[var(--text-muted)] text-[10px]">GEMELOS & SOFTWARE</span>
            <span className="text-blue-400 font-bold text-sm">{profile.keyProjects?.length || 0} Proyectos</span>
          </div>
          <div className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] flex flex-col">
            <span className="text-[var(--text-muted)] text-[10px]">LOGROS AUDITADOS</span>
            <span className="text-purple-400 font-bold text-sm">{profile.achievementsBank.length} Hitos</span>
          </div>
        </div>

        {/* Tactical Angle Filters Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] mr-1">
            ENFOQUE TÁCTICO PARA CV:
          </span>
          {[
            { id: 'all', label: 'Ver Todo (Completo)', icon: '🌐' },
            { id: 'biofisica', label: 'Ciencia Biofísica & GEI', icon: '🔬' },
            { id: 'mrv', label: 'MRV, Carbono & Satélites', icon: '🛰️' },
            { id: 'cat_risk', label: 'Riesgo Físico & Incendios', icon: '🔥' },
            { id: 'policy', label: 'Políticas Públicas & Cuencas', icon: '⚖️' },
            { id: 'comms', label: 'Comunicaciones & Campañas', icon: '📢' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id as TacticalFilter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === btn.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-[var(--panel-bg)] hover:bg-[var(--panel-border)] text-[var(--text-secondary)] border border-[var(--panel-border)]'
              }`}
            >
              <span>{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
       * 2. MAIN 3-COLUMN RESPONSIVE LAYOUT
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: IDENTITY, EDUCATION & CERTIFICATIONS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Box 1: Verified Personal Identity & Contact */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-3.5"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2.5">
              <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                <User className="h-4 w-4 text-emerald-500" />
                <span>Identidad & Contacto Canónico</span>
              </h2>
              <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                Canónico
              </span>
            </div>

            {/* Fotografía oficial de perfil del operador */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[var(--panel-bg)] border border-[var(--panel-border)]">
              <img 
                src={danielProfileImg} 
                alt={profile.fullName} 
                className="w-16 h-16 rounded-xl object-cover object-top border-2 border-emerald-500/50 shadow-md shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-[var(--text-primary)] truncate">
                  {profile.fullName}
                </div>
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate">
                  Doble M.Sc. • Geofísico Ambiental
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate font-mono">
                  CAU Kiel • AMU Poznań • U. de Chile
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-[var(--text-secondary)]">Nombre Completo</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl font-bold transition focus:outline-none focus:border-emerald-500"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-[var(--text-secondary)]">Correo Electrónico Canónico</label>
                <div className="flex gap-1.5 mt-1">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-xl font-mono text-[11px] transition focus:outline-none focus:border-emerald-500"
                    style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
                  />
                  <button
                    onClick={() => handleCopySnippet('email', profile.email)}
                    className="px-2.5 py-2 bg-[var(--panel-bg)] hover:bg-[var(--panel-border)] border border-[var(--panel-border)] rounded-xl text-[var(--text-secondary)] transition cursor-pointer"
                    title="Copiar correo"
                  >
                    {copiedItemId === 'email' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)]">Teléfono</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full mt-1 px-2.5 py-1.5 border rounded-xl font-mono text-[11px] transition focus:outline-none focus:border-emerald-500"
                    style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[var(--text-secondary)]">Ciudad Preferente</label>
                  <input
                    type="text"
                    value={profile.preferredCity}
                    onChange={e => setProfile({ ...profile, preferredCity: e.target.value })}
                    className="w-full mt-1 px-2.5 py-1.5 border rounded-xl font-medium transition focus:outline-none focus:border-emerald-500"
                    style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-[var(--text-secondary)]">Ubicación de Residencia / Movilidad</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={e => setProfile({ ...profile, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-xl transition focus:outline-none focus:border-emerald-500"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* Direct links */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-medium text-[var(--text-secondary)]">Enlaces de Respaldo Canónicos</label>
                <div className="space-y-1 text-[11px] font-mono">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--panel-bg)] border border-[var(--panel-border)]">
                    <span className="text-[var(--text-muted)] truncate mr-2">Portafolio: {profile.portfolio}</span>
                    <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 shrink-0">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--panel-bg)] border border-[var(--panel-border)]">
                    <span className="text-[var(--text-muted)] truncate mr-2">LinkedIn: {profile.linkedin}</span>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-cyan-400 shrink-0">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--panel-bg)] border border-[var(--panel-border)]">
                    <span className="text-[var(--text-muted)] truncate mr-2">GitHub: {profile.github}</span>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 shrink-0">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Higher Education & Academic Degrees (3) */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-3"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2.5">
              <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                <GraduationCap className="h-4 w-4 text-emerald-500" />
                <span>Titulaciones Universitarias ({profile.education.length})</span>
              </h2>
              <button
                onClick={() => setIsAddingEdu(!isAddingEdu)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                + Añadir
              </button>
            </div>

            {isAddingEdu && (
              <form 
                onSubmit={handleAddEducation} 
                className="p-3 rounded-xl border space-y-2 text-xs"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
              >
                <input
                  type="text"
                  value={eduDegree}
                  onChange={e => setEduDegree(e.target.value)}
                  placeholder="Título (ej. M.Sc. en Manejo Ambiental)"
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-emerald-500"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                  required
                />
                <input
                  type="text"
                  value={eduInstitution}
                  onChange={e => setEduInstitution(e.target.value)}
                  placeholder="Institución (ej. CAU Kiel, Alemania)"
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-emerald-500"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                  required
                />
                <input
                  type="text"
                  value={eduYears}
                  onChange={e => setEduYears(e.target.value)}
                  placeholder="Período (ej. 2023 - 2026)"
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-emerald-500"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                />
                <div className="flex justify-end space-x-2 pt-1">
                  <button type="button" onClick={() => setIsAddingEdu(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancelar</button>
                  <button type="submit" className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition">Guardar</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {profile.education.map((edu) => (
                <div 
                  key={edu.id} 
                  className="p-3.5 rounded-xl border text-xs space-y-1.5 relative group hover:border-emerald-500/40 transition"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-[var(--text-primary)] leading-snug">{edu.degree}</div>
                      <div className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">{edu.institution}</div>
                    </div>
                    <button 
                      onClick={() => handleDeleteEducation(edu.id)} 
                      className="text-[var(--text-muted)] hover:text-rose-500 transition opacity-0 group-hover:opacity-100 p-1"
                      title="Eliminar titulación"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {edu.fieldOfStudy}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-[var(--text-muted)] font-mono pt-1 border-t border-[var(--panel-border)]/50">
                    <span>{edu.startDate} – {edu.endDate} • {edu.location}</span>
                    {edu.grade && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
                        {edu.grade}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Box 3: Certified Postgraduate Courses & Summits (9) */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-3"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2.5">
              <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-cyan-500" />
                <span>Certificaciones & Cursos ({profile.otherCourses?.length || 0})</span>
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('newCourseInput') as HTMLInputElement;
                if (!input || !input.value.trim()) return;
                const updated = {
                  ...profile,
                  otherCourses: [...(profile.otherCourses || []), input.value.trim()]
                };
                setProfile(updated);
                saveStoredProfile(updated);
                input.value = '';
              }}
              className="flex gap-2 text-xs"
            >
              <input
                type="text"
                name="newCourseInput"
                placeholder="Añadir curso o diplomado acreditado..."
                className="flex-1 px-3 py-1.5 border rounded-xl focus:outline-none focus:border-cyan-500"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            <div className="space-y-1.5 pt-1">
              {(profile.otherCourses || []).map((course, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 rounded-xl border text-[11.5px] flex items-center justify-between group hover:border-cyan-500/40 transition"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
                >
                  <span className="text-[var(--text-primary)] leading-snug flex-1 mr-2">• {course}</span>
                  <button
                    onClick={() => {
                      const updated = {
                        ...profile,
                        otherCourses: (profile.otherCourses || []).filter((_, i) => i !== idx)
                      };
                      setProfile(updated);
                      saveStoredProfile(updated);
                    }}
                    className="text-[var(--text-muted)] hover:text-rose-500 shrink-0 transition opacity-0 group-hover:opacity-100 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Box 4: Languages */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-3"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2.5">
              <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                <Globe className="h-4 w-4 text-emerald-500" />
                <span>Idiomas Acreditados ({profile.languages.length})</span>
              </h2>
            </div>

            <form onSubmit={handleAddLanguage} className="flex gap-2 text-xs">
              <input
                type="text"
                value={newLangName}
                onChange={e => setNewLangName(e.target.value)}
                placeholder="Idioma..."
                className="flex-1 px-3 py-1.5 border rounded-xl focus:outline-none focus:border-emerald-500"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
              />
              <select
                value={newLangProf}
                onChange={e => setNewLangProf(e.target.value as any)}
                className="px-2 py-1.5 border rounded-xl font-medium"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
                <option value="Nativo">Nativo</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            <div className="space-y-2 pt-1">
              {profile.languages.map((lang) => (
                <div 
                  key={lang.id} 
                  className="flex items-center justify-between p-2.5 rounded-xl border text-xs"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
                >
                  <div>
                    <span className="font-bold text-[var(--text-primary)]">{lang.language}</span>
                    {lang.certificate && (
                      <span className="text-[10px] text-[var(--text-muted)] ml-2 hidden sm:inline">
                        ({lang.certificate})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/20">
                      {lang.proficiency}
                    </span>
                    <button 
                      onClick={() => handleDeleteLanguage(lang.id)} 
                      className="text-[var(--text-muted)] hover:text-rose-500 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EXECUTIVE SUMMARY, EXPERIENCES, PUBLICATIONS, CONFERENCES, PROJECTS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Executive Professional Summary */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-3"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2">
              <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                <FileText className="h-4 w-4 text-emerald-500" />
                <span>Resumen Profesional Ejecutivo (Editable allí mismo)</span>
              </h2>
              <button
                onClick={() => handleCopySnippet('summary', profile.summary)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedItemId === 'summary' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedItemId === 'summary' ? 'Copiado' : 'Copiar Resumen'}</span>
              </button>
            </div>
            <textarea
              value={profile.summary}
              onChange={e => setProfile({ ...profile, summary: e.target.value })}
              rows={4}
              className="w-full p-3.5 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
              style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Section: Perfiles de Incidencia y Enfoques de Carrera del Portafolio */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-3"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2">
              <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                <Compass className="h-4 w-4 text-cyan-500" />
                <span>Enfoques Estratégicos de Carrera (Deep Links del Portafolio 3D)</span>
              </h2>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">5 Lentes Profesionales</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {[
                {
                  badge: '🇩🇪 ALEMANIA / UE • CIENCIA & TURBERAS',
                  title: 'Hidrogeofísica, Turberas & Gases GEI',
                  focus: 'Wallener Au, Eddy Covariance, cámaras cerradas, compactación edáfica (σp = 62.4 kPa) y visor 3D Wetland Monitor.',
                  url: 'https://danisantanderurrutia-coder.github.io/portafolio/science?mission=kiel-cau'
                },
                {
                  badge: '🇵🇱 POLONIA / UE • AGUA & BIODIVERSIDAD',
                  title: 'Limnología & Directiva Marco del Agua',
                  focus: 'Análisis de calidad de agua in situ y en laboratorio en lagos y estanques de Poznań bajo la DMA de la UE.',
                  url: 'https://danisantanderurrutia-coder.github.io/portafolio/science?mission=poznan-amu'
                },
                {
                  badge: '🇨🇱 CHILE / LATAM • CUENCAS & SEV',
                  title: 'Hidrogeofísica de Cuencas & Nivel Freático',
                  focus: 'Sondeos Eléctricos Verticales (SEV/VES) y gravimetría cuantificando el impacto de plantaciones forestales en el acuífero del Maule.',
                  url: 'https://danisantanderurrutia-coder.github.io/portafolio/science?mission=science-geophysics-soils'
                },
                {
                  badge: '⚖️ POLÍTICAS PÚBLICAS & GOBERNANZA',
                  title: 'Asesoría Parlamentaria & Desastres',
                  focus: 'Testimonio oficial ante la Comisión Especial de Emergencia y Bomberos de la Cámara de Diputadas/os y normas de cuencas.',
                  url: 'https://danisantanderurrutia-coder.github.io/portafolio/policy'
                },
                {
                  badge: '📢 COMUNICACIONES & PRENSA MASIVA',
                  title: 'Dirección de Medios & Campañas (+700k)',
                  focus: 'Campaña Apruebo Rural, Primera Línea Prensa (700k seguidores), Radio Cristalina y Taller de 45 Corresponsales.',
                  url: 'https://danisantanderurrutia-coder.github.io/portafolio/'
                }
              ].map((lens, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-xl border text-xs flex flex-col justify-between group hover:border-cyan-500/40 transition"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
                >
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] font-bold text-cyan-600 dark:text-cyan-400 block">{lens.badge}</span>
                    <h4 className="font-bold text-[var(--text-primary)] leading-tight">{lens.title}</h4>
                    <p className="text-[10.5px] text-[var(--text-secondary)] leading-relaxed">{lens.focus}</p>
                  </div>
                  <a
                    href={lens.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 pt-2 border-t border-[var(--panel-border)]/50 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center justify-between"
                  >
                    <span>Ver en Portafolio 3D</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Verified Work Experiences (9 Items) */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-4"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--panel-border)] pb-3">
              <div>
                <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-emerald-500" />
                  <span>Experiencia Profesional Integral ({filteredExperiences.length} de {profile.experiences.length})</span>
                </h2>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Trayectoria empírica en terreno, investigación, modelación, incidencia legislativa y dirección de medios.
                </p>
              </div>

              <button
                onClick={() => setIsAddExpOpen(true)}
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/30 transition flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-500" />
                <span>Ingresar Experiencia</span>
              </button>
            </div>

            <div className="space-y-4">
              {filteredExperiences.map((exp) => (
                <div 
                  key={exp.id} 
                  className="p-4 sm:p-5 rounded-xl border space-y-3 relative group hover:border-emerald-500/50 transition-all shadow-sm"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-[var(--text-primary)]">{exp.role}</h3>
                        {exp.isVerified && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                            Verificado
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        {exp.company} • <span className="text-[var(--text-muted)] font-normal">{exp.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span 
                        className="text-[11px] text-[var(--text-muted)] font-mono px-2 py-0.5 rounded border"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                      >
                        {exp.startDate} — {exp.endDate}
                      </span>
                      <button
                        onClick={() => handleCopySnippet(exp.id, `${exp.role} — ${exp.company} (${exp.startDate} - ${exp.endDate}):\n${exp.summary}`)}
                        className="text-[var(--text-muted)] hover:text-emerald-500 transition p-1 cursor-pointer"
                        title="Copiar viñeta para CV"
                      >
                        {copiedItemId === exp.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setEditingExperience(exp)}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-200 transition p-1 cursor-pointer"
                        title="Editar experiencia"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-[var(--text-muted)] hover:text-rose-500 transition p-1 cursor-pointer"
                        title="Eliminar experiencia"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {exp.summary}
                  </p>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-[var(--panel-border)]/50">
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
                        Hitos & Evidencia Territorial:
                      </span>
                      <ul className="list-disc list-inside text-[11px] text-[var(--text-secondary)] space-y-0.5 leading-relaxed">
                        {exp.achievements.map((ach, idx) => (
                          <li key={idx}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Publications, Technical Reports & Policy Briefs (10 Items) */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-4"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--panel-border)] pb-3">
              <div>
                <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-amber-500" />
                  <span>Publicaciones Técnicas, Prensa & Ensayos ({profile.publications?.length || 0})</span>
                </h2>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Investigaciones internacionales, reportajes investigativos, columnas parlamentarias y tratados socioecológicos.
                </p>
              </div>

              <button
                onClick={() => setIsAddingPub(!isAddingPub)}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/30 transition flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5 text-amber-500" />
                <span>Añadir Publicación</span>
              </button>
            </div>

            {isAddingPub && (
              <form 
                onSubmit={handleAddPublication}
                className="p-3.5 rounded-xl border space-y-2 text-xs"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={pubTitle}
                    onChange={e => setPubTitle(e.target.value)}
                    placeholder="Título del informe o artículo..."
                    className="px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-amber-500"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                    required
                  />
                  <input
                    type="text"
                    value={pubOutlet}
                    onChange={e => setPubOutlet(e.target.value)}
                    placeholder="Editorial / Medio / Organización..."
                    className="px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-amber-500"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={pubDate}
                    onChange={e => setPubDate(e.target.value)}
                    placeholder="Año (ej. 2024)"
                    className="px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-amber-500"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                  />
                  <input
                    type="url"
                    value={pubUrl}
                    onChange={e => setPubUrl(e.target.value)}
                    placeholder="URL del artículo (opcional)"
                    className="px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-amber-500"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                  />
                  <select
                    value={pubCategory}
                    onChange={e => setPubCategory(e.target.value as any)}
                    className="px-2.5 py-1.5 border rounded-lg focus:outline-none"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                  >
                    <option value="policy">Informe Técnico / Policy</option>
                    <option value="press">Prensa & Medios</option>
                    <option value="essays">Ensayos Político-Ecológicos</option>
                    <option value="scientific">Libro Científico</option>
                  </select>
                </div>
                <textarea
                  value={pubSummary}
                  onChange={e => setPubSummary(e.target.value)}
                  placeholder="Resumen del aporte y hallazgos clave..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-amber-500"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setIsAddingPub(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancelar</button>
                  <button type="submit" className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-500 transition">Guardar</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {(profile.publications || []).map((pub) => (
                <div 
                  key={pub.id} 
                  className="p-3.5 sm:p-4 rounded-xl border text-xs space-y-2 relative group hover:border-amber-500/40 transition"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-[var(--text-primary)] leading-snug">{pub.title}</h3>
                        <span className={`px-2 py-0.2 rounded text-[9.5px] font-mono font-bold uppercase ${
                          pub.category === 'policy' 
                            ? 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30' 
                            : pub.category === 'essays'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                        }`}>
                          {pub.category === 'policy' ? 'Policy Brief' : pub.category === 'essays' ? 'Ensayos' : pub.category === 'scientific' ? 'Libro' : 'Prensa'}
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                        {pub.outlet} • <span className="font-mono text-[var(--text-muted)]">{pub.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--text-muted)] hover:text-amber-500 transition p-1"
                          title="Abrir enlace de publicación"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleCopySnippet(pub.id, `"${pub.title}" (${pub.outlet}, ${pub.date}). ${pub.summary}`)}
                        className="text-[var(--text-muted)] hover:text-amber-500 transition p-1 cursor-pointer"
                        title="Copiar cita bibliográfica"
                      >
                        {copiedItemId === pub.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button 
                        onClick={() => handleDeletePublication(pub.id)} 
                        className="text-[var(--text-muted)] hover:text-rose-500 transition opacity-0 group-hover:opacity-100 p-1"
                        title="Eliminar publicación"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-[var(--text-secondary)] leading-relaxed">
                    {pub.summary}
                  </p>

                  {pub.tags && pub.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {pub.tags.map((t, idx) => (
                        <span key={idx} className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--panel-border)]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: International Conferences & Parliamentary Testimonies (5 Items) */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-4"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--panel-border)] pb-3">
              <div>
                <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-rose-500" />
                  <span>Conferencias Internacionales & Incidencia en el Congreso ({profile.conferences?.length || 0})</span>
                </h2>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Comparecencias parlamentarias oficiales y foros multilaterales de límites planetarios y justicia climática.
                </p>
              </div>

              <button
                onClick={() => setIsAddingConf(!isAddingConf)}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold text-xs rounded-xl border border-rose-500/30 transition flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5 text-rose-500" />
                <span>Añadir Conferencia</span>
              </button>
            </div>

            {isAddingConf && (
              <form 
                onSubmit={handleAddConference}
                className="p-3.5 rounded-xl border space-y-2 text-xs"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={confTitle}
                    onChange={e => setConfTitle(e.target.value)}
                    placeholder="Título de la ponencia..."
                    className="px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-rose-500"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                    required
                  />
                  <input
                    type="text"
                    value={confEvent}
                    onChange={e => setConfEvent(e.target.value)}
                    placeholder="Cumbre / Conferencia..."
                    className="px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-rose-500"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={confLocation}
                    onChange={e => setConfLocation(e.target.value)}
                    placeholder="Ciudad, País"
                    className="px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-rose-500"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                  />
                  <input
                    type="text"
                    value={confDate}
                    onChange={e => setConfDate(e.target.value)}
                    placeholder="Año (ej. 2025)"
                    className="px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-rose-500"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                  />
                  <input
                    type="text"
                    value={confRole}
                    onChange={e => setConfRole(e.target.value)}
                    placeholder="Rol (ej. Expositor Oficial)"
                    className="px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-rose-500"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <textarea
                  value={confSummary}
                  onChange={e => setConfSummary(e.target.value)}
                  placeholder="Síntesis de la intervención y temática abordada..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 border rounded-lg focus:outline-none focus:border-rose-500"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setIsAddingConf(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancelar</button>
                  <button type="submit" className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-500 transition">Guardar</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(profile.conferences || []).map((conf) => (
                <div 
                  key={conf.id} 
                  className="p-3.5 rounded-xl border text-xs space-y-1.5 relative group hover:border-rose-500/40 transition flex flex-col justify-between"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1.5">
                      <h3 className="font-bold text-[var(--text-primary)] leading-snug">{conf.title}</h3>
                      <button 
                        onClick={() => handleDeleteConference(conf.id)} 
                        className="text-[var(--text-muted)] hover:text-rose-500 transition opacity-0 group-hover:opacity-100 p-0.5 shrink-0"
                        title="Eliminar conferencia"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                      {conf.event} • <span className="text-[var(--text-muted)] font-normal">{conf.location} ({conf.date})</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed pt-1">
                      {conf.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--panel-border)]/50 text-[10px] text-[var(--text-muted)] font-mono">
                    <span className="font-bold text-rose-500">{conf.role}</span>
                    <button
                      onClick={() => handleCopySnippet(conf.id, `${conf.title} — ${conf.event} (${conf.location}, ${conf.date})`)}
                      className="hover:text-[var(--text-primary)] transition cursor-pointer flex items-center gap-1"
                    >
                      {copiedItemId === conf.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Key Innovation Projects & Digital Twins (6 Items) */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-4"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="border-b border-[var(--panel-border)] pb-2.5">
              <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span>Gemelos Digitales, Plataformas IoT & Software Científico ({profile.keyProjects?.length || 0})</span>
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                Desarrollo full-stack de herramientas científicas interactivas y gemelos territoriales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(profile.keyProjects || []).map((proj) => (
                <div 
                  key={proj.id} 
                  className="p-4 rounded-xl border text-xs space-y-2 relative group hover:border-blue-500/40 transition flex flex-col justify-between"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-1.5">
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)] text-sm leading-snug">{proj.title}</h3>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{proj.role} • <span className="font-mono text-[var(--text-muted)]">{proj.period}</span></div>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0">
                        {proj.githubUrl && (
                          <a 
                            href={proj.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-2 py-1 rounded bg-[var(--card-bg)] hover:bg-neutral-800 text-[var(--text-secondary)] hover:text-white border border-[var(--panel-border)] transition flex items-center space-x-1 text-[10px] font-mono"
                            title="Ver código fuente en GitHub"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                        {proj.url && (
                          <a 
                            href={proj.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 transition flex items-center space-x-1 text-[10px] font-mono font-bold"
                            title="Abrir aplicación / demo"
                          >
                            <span>Live</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      {proj.description}
                    </p>

                    {proj.deliverables && proj.deliverables.length > 0 && (
                      <div className="space-y-0.5 pt-1">
                        <span className="text-[9.5px] font-mono uppercase font-bold text-[var(--text-muted)]">Entregables:</span>
                        <ul className="list-disc list-inside text-[10.5px] text-[var(--text-secondary)] space-y-0.5">
                          {proj.deliverables.map((d, i) => (
                            <li key={i} className="line-clamp-1">{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-[var(--panel-border)]/50">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="text-[9.5px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-mono font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Achievement Bank Integration (12 Items) */}
          <AchievementBank
            achievements={profile.achievementsBank}
            onAddAchievement={handleAddAchievement}
            onUpdateAchievement={handleUpdateAchievement}
            onDeleteAchievement={handleDeleteAchievement}
          />

          {/* Section 7: Skills by Domain */}
          <div 
            className="p-5 rounded-2xl border shadow-sm space-y-4"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2.5">
              <div>
                <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                  <Code2 className="h-4 w-4 text-emerald-500" />
                  <span>Competencias Técnicas, Métodos de Terreno & Herramientas ({profile.skills.length})</span>
                </h2>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Lenguajes de programación, instrumentación física y capacidades metodológicas contrastadas.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddSkill} className="flex flex-wrap gap-2 text-xs">
              <input
                type="text"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                placeholder="Añadir competencia o método..."
                className="flex-1 min-w-[200px] px-3 py-1.5 border rounded-xl focus:outline-none focus:border-emerald-500"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
              />
              <select
                value={newSkillCategory}
                onChange={e => setNewSkillCategory(e.target.value as any)}
                className="px-2.5 py-1.5 border rounded-xl font-medium"
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
              >
                <option value="Tech">Tecnología / Datos</option>
                <option value="Domain">Ciencia / Terreno</option>
                <option value="Tools">Herramientas / SIG</option>
                <option value="Soft">Gobernanza / Incidencia</option>
              </select>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-1">
              {profile.skills.map((sk) => (
                <span 
                  key={sk.id} 
                  className="text-xs px-3 py-1.5 rounded-xl border flex items-center space-x-2 group hover:border-emerald-500/50 transition"
                  style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', color: 'var(--text-primary)' }}
                >
                  <span className="font-semibold">{sk.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--panel-border)]">
                    {sk.level}
                  </span>
                  <button 
                    onClick={() => handleDeleteSkill(sk.id)} 
                    className="text-[var(--text-muted)] hover:text-rose-500 font-bold ml-1 cursor-pointer transition"
                    title="Eliminar habilidad"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 8: Instrumental de Campo & Laboratorio Operado (6 Equipos Verificados) */}
          {profile.fieldEquipment && profile.fieldEquipment.length > 0 && (
            <div 
              className="p-5 rounded-2xl border shadow-sm space-y-4"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
            >
              <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2.5">
                <div>
                  <h2 className="font-bold text-[var(--text-primary)] text-sm flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    <span>Instrumental de Campo & Laboratorio Operado ({profile.fieldEquipment.length})</span>
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Equipamiento geofísico, micrometeorológico, edafológico y de teledetección contrastado en terreno.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  OPERATIVO IN-SITU
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {profile.fieldEquipment.map((eq) => (
                  <div 
                    key={eq.id}
                    className="p-3.5 rounded-xl border text-xs space-y-1.5 hover:border-emerald-500/40 transition flex flex-col justify-between"
                    style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-[var(--text-primary)]">{eq.name}</span>
                      </div>
                      <span className="inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold uppercase">
                        {eq.category}
                      </span>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed pt-1">
                        {eq.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CV Parser Modal */}
      <CVParserModal
        isOpen={isParserOpen}
        onClose={() => setIsParserOpen(false)}
        onApplyParsedProfile={handleApplyParsedProfile}
      />

      {/* Add Experience Modal */}
      <AddExperienceModal
        isOpen={isAddExpOpen}
        onClose={() => setIsAddExpOpen(false)}
        onAddExperience={handleAddExperience}
      />

      {/* Edit Experience Modal */}
      <EditExperienceModal
        experience={editingExperience}
        isOpen={!!editingExperience}
        onClose={() => setEditingExperience(null)}
        onSaveExperience={handleSaveExperienceEdit}
      />
    </div>
  );
};

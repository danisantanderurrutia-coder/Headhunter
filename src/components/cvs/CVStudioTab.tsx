import React, { useEffect, useMemo, useRef, useState } from 'react';
import craftingHeroImg from '../../assets/crafting_nanobanana_hero.jpg';
import {
  AlertTriangle,
  BadgeCheck,
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  FileDown,
  Layers,
  Lightbulb,
  ListChecks,
  Loader2,
  Mail,
  Plus,
  PlusCircle,
  Printer,
  RefreshCw,
  Repeat,
  Save,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  X
} from 'lucide-react';
import { getStoredOffers, saveStoredOffers, getStoredProfile, saveStoredProfile, getStoredCVs } from '../../services/db';
import { calculateMatchScore } from '../../services/matchEngine';
import type { JobOffer } from '../../types/offers';
import { cvTemplatesList } from '../../services/sampleData';
import type { CVVersion } from '../../types/cv';
import { CVPreviewModal } from './CVPreviewModal';
import {
  applyLinkFixes,
  auditProfile,
  buildCv,
  getSavedVersions,
  renderCvHtml,
  renderCvMarkdown,
  saveVersions,
  type CvLang,
  type CvLength,
  type SavedStudioVersion,
  type TacticalAngle
} from '../../services/cvStudio';
import {
  buildCoverLetter,
  buildDefaultScientificDraft,
  generateAntiAiPrompt,
  getSavedLetterVersions,
  renderCoverLetterHtml,
  saveLetterVersions,
  type CoverLetterLang,
  type SavedCoverLetterVersion
} from '../../services/coverLetterStudio';
import { auditDocumentDualLens } from '../../services/dualAuditEngine';
import { generateCoverLetterWithGemini, evaluateOfferWithGemini, type GeminiEvaluationResult } from '../../services/geminiService';
import { DualLensAuditHub } from './DualLensAuditHub';
import { CANONICAL_CONTACT, type CvSection } from '../../data/verifiedCvFacts';

const A4_W = 794; // px a 96 dpi
const A4_H = 1123;
const GAP = 12;

const SECTION_LABEL: Record<CvSection, string> = {
  education: 'Formación',
  experience: 'Experiencia y proyectos',
  publications: 'Publicaciones',
  courses: 'Cursos',
  skills: 'Competencias',
  languages: 'Idiomas'
};

const panel = 'rounded-2xl border p-4 space-y-3';
const panelStyle: React.CSSProperties = { backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' };

const segBtn = (active: boolean) =>
  `px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
    active ? 'bg-sky-600 text-white shadow' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
  }`;

interface AccordionCardProps {
  id: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  title: string;
  icon?: React.ReactNode;
  summary?: string;
  badge?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

const AccordionCard: React.FC<AccordionCardProps> = ({
  id,
  isOpen,
  onToggle,
  title,
  icon,
  summary,
  badge,
  headerAction,
  children
}) => {
  return (
    <div
      className="rounded-2xl border transition-all"
      style={{
        backgroundColor: 'var(--panel-bg)',
        borderColor: 'var(--panel-border)'
      }}
    >
      <div
        onClick={() => onToggle(id)}
        className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-2xl"
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {icon && <span className="shrink-0">{icon}</span>}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black font-mono uppercase tracking-tight text-[var(--text-primary)] truncate">
                {title}
              </h3>
              {badge}
            </div>
            {!isOpen && summary && (
              <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5 font-sans">
                {summary}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {headerAction && (
            <div onClick={(e) => e.stopPropagation()}>
              {headerAction}
            </div>
          )}
          <button
            type="button"
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
            aria-label={isOpen ? 'Colapsar sección' : 'Expandir sección'}
          >
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-1 border-t border-[var(--panel-border)] space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

interface CVStudioTabProps {
  initialOfferId?: string;
  initialDocType?: 'cv' | 'cover_letter';
  onDocTypeChange?: (docType: 'cv' | 'cover_letter') => void;
}

export const CVStudioTab: React.FC<CVStudioTabProps> = ({ 
  initialOfferId = '', 
  initialDocType = 'cv',
  onDocTypeChange
}) => {
  const [profile, setProfile] = useState(getStoredProfile());
  const [offers, setOffers] = useState<JobOffer[]>(() => getStoredOffers());

  const [docMode, setDocMode] = useState<'cv' | 'cover_letter'>(initialDocType);
  const [offerId, setOfferId] = useState<string>(initialOfferId);

  // Estados de acordeón para menú izquierdo ordenado y banner colapsable
  const [showHeroGuide, setShowHeroGuide] = useState(false);
  const [openCvSections, setOpenCvSections] = useState<Record<string, boolean>>({
    format: true,
    offer: true,
    facts: false,
    audit: false,
    saved: false
  });

  const [openLetterSections, setOpenLetterSections] = useState<Record<string, boolean>>({
    draft: true,
    offer: true,
    header: false,
    audit: false,
    antiai: false,
    saved: false
  });

  const toggleCvSection = (key: string) => {
    setOpenCvSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleLetterSection = (key: string) => {
    setOpenLetterSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Modal / Formulario para añadir nueva oferta laboral manual
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferCompany, setNewOfferCompany] = useState('');
  const [newOfferLocation, setNewOfferLocation] = useState('Alemania / Remoto');
  const [newOfferRequirements, setNewOfferRequirements] = useState('');
  const [newOfferDesc, setNewOfferDesc] = useState('');
  const [newOfferRecipientName, setNewOfferRecipientName] = useState('');
  const [newOfferRecipientRole, setNewOfferRecipientRole] = useState('');
  const [newOfferRecipientAddress, setNewOfferRecipientAddress] = useState('');

  // ------------------------------------------------------------- Estado CV
  const [lang, setLang] = useState<CvLang>('es');
  const [length, setLength] = useState<CvLength>('1p');
  const [tacticalAngle, setTacticalAngle] = useState<TacticalAngle>('general');
  const [forceInclude, setForceInclude] = useState<string[]>([]);
  const [exclude, setExclude] = useState<string[]>([]);
  const [location, setLocation] = useState<string>(CANONICAL_CONTACT.defaultLocation);
  const [includePhone, setIncludePhone] = useState(false);
  const [versions, setVersions] = useState<SavedStudioVersion[]>(getSavedVersions());
  const [versionName, setVersionName] = useState('');
  const [fitInfo, setFitInfo] = useState<{ zoom?: string; overflow: boolean }>({ overflow: false });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('es_standard');
  const [selectedCvForModal, setSelectedCvForModal] = useState<CVVersion | null>(null);
  const storedCompiledCVs = getStoredCVs();

  // ------------------------------------------------------------- Estado Carta
  const [letterLang, setLetterLang] = useState<CoverLetterLang>('es');
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [recipientOrg, setRecipientOrg] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [letterDrafts, setLetterDrafts] = useState<Record<CoverLetterLang, string>>({
    es: '',
    en: '',
    de: ''
  });
  const [letterVersions, setLetterVersions] = useState<SavedCoverLetterVersion[]>(getSavedLetterVersions());
  const [letterVersionName, setLetterVersionName] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedAudit, setCopiedAudit] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [checklistFilter, setChecklistFilter] = useState<'all' | 'anti_ai' | 'style_repetition' | 'golden_thread' | 'metrics_evidence' | 'tor_compliance'>('all');

  useEffect(() => {
    if (initialOfferId) {
      setOfferId(initialOfferId);
    }
  }, [initialOfferId]);

  useEffect(() => {
    if (initialDocType) {
      setDocMode(initialDocType);
    }
  }, [initialDocType]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);

  const offer = offers.find((o) => o.id === offerId) || null;

  // Ensamble de CV
  const built = useMemo(
    () => buildCv({ lang, length, offer, tacticalAngle, forceInclude, exclude, location, includePhone, phone: profile.phone }),
    [lang, length, offer, tacticalAngle, forceInclude, exclude, location, includePhone, profile.phone]
  );
  const html = useMemo(() => renderCvHtml(built), [built]);
  const audit = useMemo(() => auditProfile(profile), [profile]);
  const fixable = audit.filter((a) => a.fix);

  // Ensamble de Carta
  const effectiveLetterBody = (letterDrafts[letterLang] && letterDrafts[letterLang].trim())
    ? letterDrafts[letterLang]
    : buildDefaultScientificDraft(letterLang, offer).join('\n\n');

  const setLetterBodyText = (text: string) => {
    setLetterDrafts((prev) => ({
      ...prev,
      [letterLang]: text
    }));
  };

  const handleSelectLetterLang = (newLang: CoverLetterLang) => {
    setLetterLang(newLang);
  };

  const loadPresetTemplate = (targetLang: CoverLetterLang) => {
    setLetterLang(targetLang);
    setLetterDrafts((prev) => ({
      ...prev,
      [targetLang]: buildDefaultScientificDraft(targetLang, offer).join('\n\n')
    }));
  };

  const resetLetterDraft = () => {
    setLetterDrafts((prev) => ({
      ...prev,
      [letterLang]: buildDefaultScientificDraft(letterLang, offer).join('\n\n')
    }));
  };

  const builtLetter = useMemo(
    () =>
      buildCoverLetter({
        lang: letterLang,
        offer,
        recipientName: recipientName.trim() || undefined,
        recipientRole: recipientRole.trim() || undefined,
        recipientOrg: recipientOrg.trim() || offer?.company || undefined,
        recipientAddress: recipientAddress.trim() || undefined,
        customBodyText: effectiveLetterBody
      }),
    [letterLang, offer, recipientName, recipientRole, recipientOrg, recipientAddress, effectiveLetterBody]
  );
  const letterHtml = useMemo(() => renderCoverLetterHtml(builtLetter), [builtLetter]);

  // Auditoría Dual-Lens: Criterios Headhunter (ATS) vs Wingman (PI & Técnica)
  const dualReport = useMemo(() => {
    const textToAudit = docMode === 'cv' 
      ? renderCvMarkdown(built) 
      : builtLetter.fullMarkdown;

    return auditDocumentDualLens({
      documentType: docMode,
      text: textToAudit,
      offer,
      builtCv: docMode === 'cv' ? built : null
    });
  }, [docMode, built, builtLetter.fullMarkdown, offer]);

  const handleInjectWeapon = (snippet: string) => {
    if (docMode === 'cover_letter') {
      setLetterDrafts((prev) => {
        const current = (prev[letterLang] && prev[letterLang].trim()) || effectiveLetterBody;
        return {
          ...prev,
          [letterLang]: `${current}\n\n${snippet}`
        };
      });
    }
  };

  const pages = docMode === 'cv' ? (length === '1p' ? 1 : 2) : 1;
  const activeHtml = docMode === 'cv' ? html : letterHtml;

  // Escala la vista previa A4 al ancho disponible
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, (el.clientWidth - 8) / A4_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onFrameLoad = () => {
    const body = iframeRef.current?.contentDocument?.body;
    if (!body) return;
    setFitInfo({ zoom: body.getAttribute('data-fit-zoom') || undefined, overflow: body.getAttribute('data-overflow') === '1' });
  };

  const print = () => {
    const w = iframeRef.current?.contentWindow;
    if (!w) return;
    w.focus();
    w.print();
  };

  const fileBase =
    docMode === 'cv'
      ? `Daniel_Santander_CV_${lang.toUpperCase()}_${length}${offer ? `_${offer.company.replace(/[^a-zA-Z0-9]/g, '_')}` : ''}`
      : `Daniel_Santander_Cover_Letter_${letterLang.toUpperCase()}${offer ? `_${offer.company.replace(/[^a-zA-Z0-9]/g, '_')}` : ''}`;

  const downloadHtml = () => {
    const blob = new Blob([activeHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileBase}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLetterMarkdown = () => {
    navigator.clipboard.writeText(builtLetter.fullMarkdown);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const copyAntiAiPrompt = () => {
    const prompt = generateAntiAiPrompt(offer, effectiveLetterBody, builtLetter.audit, letterLang);
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const copyAuditSummary = () => {
    const audit = builtLetter.audit;
    const lines = [
      `================================================================================`,
      `DIAGNÓSTICO EDITORIAL Y CHECKLIST DE POSTULACIÓN (SCORE: ${audit.overallScore}/100)`,
      `Oferta: ${offer?.title || 'General'} — ${offer?.company || 'Organización'}`,
      `================================================================================`,
      `• Clichés de IA detectados: ${audit.clicheCount === 0 ? 'Ninguno (0)' : audit.detectedCliches.join(', ')}`,
      `• Rellenos burocráticos: ${audit.bureaucraticFillers.length === 0 ? 'Ninguno (0)' : audit.bureaucraticFillers.join(', ')}`,
      `• Palabras mecánicas repetidas: ${audit.mechanicalRepetitions.length === 0 ? 'Ninguna' : audit.mechanicalRepetitions.map((r) => `${r.word} (${r.count}×)`).join(', ')}`,
      `• Iniciadores monótonos: ${audit.sentenceStarterRepetitions.length === 0 ? 'Ninguno' : audit.sentenceStarterRepetitions.map((s) => `${s.starter} (${s.count}×)`).join(', ')}`,
      `• ToR Disponibilidad Horaria: ${audit.hasAvailabilityMention ? 'Declarada' : 'Pendiente'}`,
      `• ToR Expectativas Honorarios: ${audit.hasFeeMention ? 'Declaradas' : 'Pendiente'}`,
      '',
      'CHECKLIST DE AUDITORÍA DETALLADO:',
      ...audit.checklist.map((c) => `[${c.status.toUpperCase()}] ${c.categoryLabel} :: ${c.label} -> ${c.summary}`)
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2200);
  };

  // Versiones CV
  const toggleFact = (id: string, currentlyIncluded: boolean) => {
    if (currentlyIncluded) {
      setForceInclude((f) => f.filter((x) => x !== id));
      setExclude((e) => (e.includes(id) ? e : [...e, id]));
    } else {
      setExclude((e) => e.filter((x) => x !== id));
      setForceInclude((f) => (f.includes(id) ? f : [...f, id]));
    }
  };

  const resetSelection = () => {
    setForceInclude([]);
    setExclude([]);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitle.trim() || !newOfferCompany.trim()) return;

    const id = `offer-manual-${Date.now()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const reqs = newOfferRequirements
      .split(/[,;\n]/)
      .map((r) => r.trim())
      .filter(Boolean);

    const partialOffer: Partial<JobOffer> = {
      id,
      title: newOfferTitle.trim(),
      company: newOfferCompany.trim(),
      location: newOfferLocation.trim() || 'Alemania / Remoto',
      isBilbaoLocation: newOfferLocation.toLowerCase().includes('bilbao') || newOfferLocation.toLowerCase().includes('bizkaia'),
      isRemote: newOfferLocation.toLowerCase().includes('remot'),
      url: '',
      sourceId: 'src-manual-studio',
      sourceName: 'Añadida manualmente en Studio',
      publishedDate: timestamp.split(' ')[0],
      rawDescription: newOfferDesc.trim() || `${newOfferTitle.trim()} en ${newOfferCompany.trim()}`,
      requirements: reqs.length > 0 ? reqs : ['Ciencias Ambientales / Geofísica', 'Análisis de Datos', 'Modelación'],
      responsibilities: [],
      status: 'Nueva',
      extractedAt: timestamp,
      isVerified: true,
      verificationStatus: 'Vigente y Verificada'
    };

    const matchScore = calculateMatchScore(partialOffer, profile);
    const newOffer: JobOffer = {
      ...partialOffer,
      matchScore
    } as JobOffer;

    const updatedOffers = [newOffer, ...offers];
    setOffers(updatedOffers);
    saveStoredOffers(updatedOffers);

    // Si se especificaron datos del destinatario para la carta, precargarlos
    if (newOfferCompany.trim()) setRecipientOrg(newOfferCompany.trim());
    if (newOfferRecipientName.trim()) setRecipientName(newOfferRecipientName.trim());
    if (newOfferRecipientRole.trim()) setRecipientRole(newOfferRecipientRole.trim());
    if (newOfferRecipientAddress.trim()) setRecipientAddress(newOfferRecipientAddress.trim());

    // Seleccionar automáticamente la nueva oferta
    setOfferId(id);
    resetSelection();

    // Limpiar formulario y cerrar
    setNewOfferTitle('');
    setNewOfferCompany('');
    setNewOfferLocation('Alemania / Remoto');
    setNewOfferRequirements('');
    setNewOfferDesc('');
    setNewOfferRecipientName('');
    setNewOfferRecipientRole('');
    setNewOfferRecipientAddress('');
    setIsAddingOffer(false);
  };

  const handleDeleteOffer = (targetId: string) => {
    const updated = offers.filter((o) => o.id !== targetId);
    setOffers(updated);
    saveStoredOffers(updated);
    if (offerId === targetId) {
      setOfferId('');
      resetSelection();
    }
  };

  const saveCvVersion = () => {
    const label = offer ? `${offer.title} — ${offer.company}` : 'General';
    const v: SavedStudioVersion = {
      id: `v-${Date.now()}`,
      name: versionName.trim() || label,
      createdAt: new Date().toLocaleDateString(),
      lang,
      length,
      tacticalAngle,
      offerId: offer?.id,
      offerLabel: label,
      forceInclude,
      exclude,
      location
    };
    const next = [v, ...versions];
    setVersions(next);
    saveVersions(next);
    setVersionName('');
  };

  const loadCvVersion = (v: SavedStudioVersion) => {
    setLang(v.lang);
    setLength(v.length);
    if (v.tacticalAngle) setTacticalAngle(v.tacticalAngle);
    setOfferId(v.offerId || '');
    setForceInclude(v.forceInclude);
    setExclude(v.exclude);
    setLocation(v.location);
  };

  const removeCvVersion = (id: string) => {
    const next = versions.filter((v) => v.id !== id);
    setVersions(next);
    saveVersions(next);
  };

  // Versiones Carta
  const saveLetterVer = () => {
    const label = offer ? `${offer.title} — ${offer.company}` : 'General';
    const v: SavedCoverLetterVersion = {
      id: `lv-${Date.now()}`,
      name: letterVersionName.trim() || `${label} (${letterLang.toUpperCase()})`,
      createdAt: new Date().toLocaleDateString(),
      lang: letterLang,
      offerId: offer?.id,
      offerLabel: label,
      customBodyText: effectiveLetterBody
    };
    const next = [v, ...letterVersions];
    setLetterVersions(next);
    saveLetterVersions(next);
    setLetterVersionName('');
  };

  const loadLetterVer = (v: SavedCoverLetterVersion) => {
    setLetterLang(v.lang);
    if (v.offerId) setOfferId(v.offerId);
    setLetterDrafts((prev) => ({
      ...prev,
      [v.lang]: v.customBodyText
    }));
  };

  const removeLetterVer = (id: string) => {
    const next = letterVersions.filter((v) => v.id !== id);
    setLetterVersions(next);
    saveLetterVersions(next);
  };

  const applyFixes = () => {
    const fixed = applyLinkFixes(profile, audit);
    saveStoredProfile(fixed);
    setProfile(fixed);
  };

  return (
    <div className="space-y-5 text-[var(--text-primary)]">
      {/* ==============================================================
       * CRAFTING HUB HERO BANNER (COMPACTABLE / ACCORDION)
       * ============================================================== */}
      <div 
        className="rounded-2xl border relative overflow-hidden transition-all shadow-sm"
        style={{
          backgroundColor: 'var(--panel-bg)',
          borderColor: 'var(--panel-border)'
        }}
      >
        <div className="flex items-center justify-between p-3 sm:px-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-mono font-black uppercase text-[var(--text-primary)] truncate">
                Crafting Studio · Wingman & Headhunter
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] truncate hidden sm:block">
                Compilador y auditoría simultánea para CVs de alto impacto y Cartas DIN 5008
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowHeroGuide((prev) => !prev)}
            className="px-2.5 py-1 rounded-lg border border-[var(--panel-border)] bg-[var(--card-bg)] hover:bg-black/5 dark:hover:bg-white/5 text-[11px] font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer shrink-0 transition"
          >
            <span>{showHeroGuide ? 'Ocultar Guía' : 'Ver Guía Visual'}</span>
            {showHeroGuide ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {showHeroGuide && (
          <div className="border-t border-[var(--panel-border)]">
            <div className="relative w-full aspect-[16/9] max-h-[460px] overflow-hidden bg-[#1a2330] flex items-center justify-center">
              <img 
                src={craftingHeroImg || '/crafting_nanobanana_hero.jpg'} 
                alt="Wingman & Headhunter Crafting Review Architecture" 
                className="w-full h-full object-contain sm:object-cover object-[center_12%] select-none"
                loading="eager"
              />
            </div>
            <div className="p-4 sm:p-5 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border bg-[var(--card-bg)] border-purple-500/25 space-y-1">
                  <div className="flex items-center space-x-2 text-purple-500 dark:text-purple-300 font-bold font-mono text-xs">
                    <Bot className="h-4 w-4" />
                    <span>WINGMAN — Empatía & Match Técnico</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Comprende las expectativas y el lenguaje del líder del equipo o PI. Asegura que el formato y la cadencia de la carta o CV resuelvan sus puntos de dolor con tono soberano Zero-Servility.
                  </p>
                </div>
                <div className="p-3 rounded-xl border bg-[var(--card-bg)] border-sky-500/25 space-y-1">
                  <div className="flex items-center space-x-2 text-sky-500 dark:text-sky-300 font-bold font-mono text-xs">
                    <Scale className="h-4 w-4" />
                    <span>HEADHUNTER — Asimetría & Filtro de Élite</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Destaca por encima de la media con evidencia asimétrica incontrastable. Neutraliza filtros de selección inicial y blinda cada término legal y credencial académica.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------ Barra Superior Studio */}
      <div className={panel} style={panelStyle}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex p-1 rounded-xl border gap-1" style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    docMode === 'cv' ? 'bg-sky-600 text-white shadow font-black' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                  onClick={() => {
                    setDocMode('cv');
                    onDocTypeChange?.('cv');
                  }}
                >
                  <BadgeCheck className="h-4 w-4" />
                  <span>1. CV Studio (A4)</span>
                </button>
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    docMode === 'cover_letter' ? 'bg-purple-600 text-white shadow font-black' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                  onClick={() => {
                    setDocMode('cover_letter');
                    onDocTypeChange?.('cover_letter');
                  }}
                >
                  <Mail className="h-4 w-4" />
                  <span>2. Cover Letter Studio (DIN/A4)</span>
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1.5">
              {docMode === 'cv'
                ? 'Curriculum Vitae profesional (A4) generado exclusivamente a partir de los datos verificados del Portafolio.'
                : 'Cartas de postulación institucional DIN 5008 con redacción científica rigurosa y filtro estricto anti-clichés de IA.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {docMode === 'cv' ? (
              <>
                <div className="flex p-1 rounded-xl border gap-1" style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}>
                  <button className={segBtn(lang === 'es')} onClick={() => setLang('es')}>ES</button>
                  <button className={segBtn(lang === 'en')} onClick={() => setLang('en')}>EN</button>
                </div>
                <div className="flex p-1 rounded-xl border gap-1" style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}>
                  <button className={segBtn(length === '1p')} onClick={() => setLength('1p')}>1 pág.</button>
                  <button className={segBtn(length === '2p')} onClick={() => setLength('2p')}>2 pág.</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex p-1 rounded-xl border gap-1 items-center" style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}>
                  <span className="text-[10px] font-mono font-bold px-1.5 text-[var(--text-muted)] uppercase hidden sm:inline">Idioma:</span>
                  <button className={segBtn(letterLang === 'es')} onClick={() => handleSelectLetterLang('es')} title="Borrador en Español">🇪🇸 ES</button>
                  <button className={segBtn(letterLang === 'en')} onClick={() => handleSelectLetterLang('en')} title="Borrador en Inglés">🇬🇧 EN</button>
                  <button className={segBtn(letterLang === 'de')} onClick={() => handleSelectLetterLang('de')} title="Borrador en Alemán">🇩🇪 DE</button>
                </div>
                <button
                  onClick={copyLetterMarkdown}
                  className="px-3 py-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] hover:bg-[var(--card-bg)] text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[var(--text-primary)] transition"
                  title="Copiar contenido de la carta en formato Markdown"
                >
                  <Copy className="h-4 w-4 text-sky-500" />
                  <span>{copiedMarkdown ? '¡Copiado!' : 'Copiar MD'}</span>
                </button>
              </>
            )}

            <button
              onClick={downloadHtml}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] hover:bg-[var(--card-bg)] text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[var(--text-primary)] transition shrink-0"
              title={`Descargar archivo HTML autónomo (${fileBase}.html)`}
            >
              <FileDown className="h-4 w-4 text-emerald-500 shrink-0" />
              <span><span className="hidden sm:inline">Descargar </span>HTML</span>
            </button>
            <button
              onClick={print}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow shrink-0"
              title={`Imprimir → Guardar como PDF (${fileBase}.pdf)`}
            >
              <Printer className="h-4 w-4 shrink-0" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* ======================================================== CONTROLES IZQUIERDA (5 COLUMNAS) */}
        <div className="xl:col-span-5 2xl:col-span-5 space-y-3.5 min-w-0">

          {/* ============================================ CV MODE ACCORDIONS ============================================ */}
          {docMode === 'cv' && (
            <>
              {/* 1. Plantilla Base & Posicionamiento */}
              <AccordionCard
                id="format"
                isOpen={!!openCvSections.format}
                onToggle={toggleCvSection}
                title="Plantilla Base & Posicionamiento"
                icon={<Layers className="h-4 w-4 text-sky-500" />}
                summary={`${cvTemplatesList.find(t => t.id === selectedTemplateId)?.name || 'Académico'} · ${tacticalAngle}`}
              >
                {/* Formatos de Plantilla */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] uppercase">
                      Formato Oficial
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {cvTemplatesList.length} opciones
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {cvTemplatesList.map((tpl) => {
                      const isSelected = selectedTemplateId === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            setSelectedTemplateId(tpl.id);
                            if (tpl.language === 'en') setLang('en');
                            else if (tpl.language === 'es') setLang('es');
                            if (tpl.pages === '1 pág.') setLength('1p');
                            else if (tpl.pages === '2 pág.' || tpl.pages === '2-3 pág.') setLength('2p');
                          }}
                          className={`p-2 rounded-xl text-left border transition text-xs cursor-pointer ${
                            isSelected
                              ? 'border-sky-500 bg-sky-500/10 shadow-xs ring-1 ring-sky-500/30'
                              : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-sky-500/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] truncate text-[var(--text-primary)]">
                              {tpl.name.split(' ')[0]} {tpl.name.split(' ')[1] || ''}
                            </span>
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/10 dark:bg-white/10 uppercase font-bold text-[var(--text-muted)]">
                              {tpl.language.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                            {tpl.pages} • {tpl.targetAudience}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ángulo Táctico */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--panel-border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] uppercase">
                      Ángulo Táctico de Posicionamiento
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      5 enfoques
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      {
                        id: 'general' as TacticalAngle,
                        name: 'Generalista Dual',
                        desc: 'Geofísica ambiental + Doble M.Sc. europeo (Kiel / Poznań).',
                        badge: 'Referencia'
                      },
                      {
                        id: 'biofisica' as TacticalAngle,
                        name: 'Biofísica & Eddy Covariance',
                        desc: 'Flujos GEI (CO₂, CH₄), turberas, cámaras cerradas e hidrofísica de suelos.',
                        badge: 'I+D & Suelos'
                      },
                      {
                        id: 'mrv_carbon' as TacticalAngle,
                        name: 'Carbon-Tech & Calificación MRV',
                        desc: 'Teledetección (GEE/Sentinel), rating de créditos y contabilidad.',
                        badge: 'Climate-Tech'
                      },
                      {
                        id: 'cat_risk' as TacticalAngle,
                        name: 'Cat Risk & Modelación Física',
                        desc: 'Incendios forestales, balance hídrico y riesgo físico paramétrico.',
                        badge: 'Seguros / Clima'
                      },
                      {
                        id: 'politicas' as TacticalAngle,
                        name: 'Políticas & Interfaz Científica',
                        desc: 'Testimonio en Congreso Nacional, salvaguardias y cuencas.',
                        badge: 'Multilateral'
                      }
                    ].map((angle) => {
                      const isSelected = tacticalAngle === angle.id;
                      return (
                        <button
                          key={angle.id}
                          type="button"
                          onClick={() => setTacticalAngle(angle.id)}
                          className={`w-full p-2 rounded-xl text-left border transition text-xs cursor-pointer flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-500/10 shadow-xs ring-1 ring-emerald-500/30'
                              : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-emerald-500/40'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-[11px] text-[var(--text-primary)]">
                              {angle.name}
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)] line-clamp-1">
                              {angle.desc}
                            </div>
                          </div>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                            isSelected
                              ? 'bg-emerald-500 text-white'
                              : 'bg-black/10 dark:bg-white/10 text-[var(--text-muted)]'
                          }`}>
                            {angle.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contacto en Cabecera */}
                <div className="space-y-2 pt-2 border-t border-[var(--panel-border)] text-xs">
                  <span className="text-[11px] font-mono font-bold text-[var(--text-muted)] uppercase block">
                    Contacto en Cabecera
                  </span>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Ubicación en el CV:</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] font-medium text-xs focus:outline-none focus:border-sky-500"
                        style={{ borderColor: 'var(--panel-border)' }}
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer pt-0.5">
                      <input
                        type="checkbox"
                        checked={includePhone}
                        onChange={(e) => setIncludePhone(e.target.checked)}
                      />
                      <span className="text-[11px]">Incluir teléfono ({profile.phone || 'No registrado'})</span>
                    </label>
                  </div>
                </div>
              </AccordionCard>

              {/* 2. Vincular a Oferta Laboral */}
              <AccordionCard
                id="offer"
                isOpen={!!openCvSections.offer}
                onToggle={toggleCvSection}
                title="Vincular a Oferta Laboral"
                icon={<Target className="h-4 w-4 text-sky-500" />}
                summary={offer ? `${offer.title} (${offer.company})` : 'General (sin oferta vinculada)'}
                headerAction={
                  <button
                    type="button"
                    onClick={() => setIsAddingOffer((v) => !v)}
                    className="px-2 py-1 rounded-lg bg-sky-600/15 hover:bg-sky-600/25 text-sky-600 dark:text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition"
                    title="Añadir una oferta real específica con su título e información relevante"
                  >
                    {isAddingOffer ? (
                      <>
                        <X className="h-3 w-3" /> Cancelar
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" /> + Añadir Oferta
                      </>
                    )}
                  </button>
                }
              >
                {/* Formulario desplegable para agregar oferta real paso a paso */}
                {isAddingOffer && (
                  <form onSubmit={handleCreateOffer} className="p-3 rounded-xl border border-sky-500/30 bg-[var(--panel-bg)] space-y-2.5 text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-[var(--panel-border)]">
                      <span className="font-mono font-bold text-[11px] text-sky-600 dark:text-sky-400 flex items-center gap-1">
                        <PlusCircle className="h-3.5 w-3.5" /> Registrar Oferta Verificada
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">Sin alucinaciones</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Título del Puesto / Rol *:</label>
                        <input
                          type="text"
                          required
                          value={newOfferTitle}
                          onChange={(e) => setNewOfferTitle(e.target.value)}
                          placeholder="Ej: Wissenschaftliche*r Mitarbeiter*in"
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Institución / Empresa *:</label>
                        <input
                          type="text"
                          required
                          value={newOfferCompany}
                          onChange={(e) => setNewOfferCompany(e.target.value)}
                          placeholder="Ej: Thünen-Institut für Agrarklimaschutz"
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Ubicación / Modalidad:</label>
                        <input
                          type="text"
                          value={newOfferLocation}
                          onChange={(e) => setNewOfferLocation(e.target.value)}
                          placeholder="Ej: Braunschweig / Kiel / Remoto"
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Requisitos clave (separados por coma):</label>
                        <input
                          type="text"
                          value={newOfferRequirements}
                          onChange={(e) => setNewOfferRequirements(e.target.value)}
                          placeholder="Ej: Eddy Covariance, R, Suelos, GEI"
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Descripción / Objetivos relevantes:</label>
                      <textarea
                        rows={2}
                        value={newOfferDesc}
                        onChange={(e) => setNewOfferDesc(e.target.value)}
                        placeholder="Pega aquí los objetivos de investigación, responsabilidades o contexto relevante de la vacante..."
                        className="w-full p-2 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-500"
                        style={{ borderColor: 'var(--panel-border)' }}
                      />
                    </div>

                    <div className="pt-1 border-t border-[var(--panel-border)] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] block">
                        Datos para Encabezado DIN 5008 (Opcional para Cover Letter):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={newOfferRecipientName}
                          onChange={(e) => setNewOfferRecipientName(e.target.value)}
                          placeholder="Contacto: Prof. Dr. X"
                          className="w-full px-2 py-1 rounded-lg border bg-[var(--card-bg)] text-[11px] focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                        <input
                          type="text"
                          value={newOfferRecipientRole}
                          onChange={(e) => setNewOfferRecipientRole(e.target.value)}
                          placeholder="Cargo: Selección / AG"
                          className="w-full px-2 py-1 rounded-lg border bg-[var(--card-bg)] text-[11px] focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                        <input
                          type="text"
                          value={newOfferRecipientAddress}
                          onChange={(e) => setNewOfferRecipientAddress(e.target.value)}
                          placeholder="Dirección postal / Ciudad"
                          className="w-full px-2 py-1 rounded-lg border bg-[var(--card-bg)] text-[11px] focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingOffer(false)}
                        className="px-3 py-1 rounded-lg text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Guardar y Vincular
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex items-center gap-1.5">
                  <select
                    value={offerId}
                    onChange={(e) => {
                      setOfferId(e.target.value);
                      resetSelection();
                    }}
                    className="flex-1 px-3 py-2 rounded-xl text-xs border bg-transparent font-medium"
                    style={{ borderColor: 'var(--panel-border)' }}
                  >
                    <option value="">General (sin oferta específica)</option>
                    {offers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.title} — {o.company}
                      </option>
                    ))}
                  </select>

                  {offer && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-2 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 cursor-pointer transition shrink-0"
                      title="Eliminar esta oferta de la lista"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {offer ? (
                  <div className="text-[11px] space-y-1 pt-1 border-t border-[var(--panel-border)]">
                    <div className="flex items-center justify-between text-[var(--text-secondary)] font-medium">
                      <span>Coincidencias técnicas con la trayectoria verificada:</span>
                      {offer.location && <span className="text-[10px] font-mono text-[var(--text-muted)]">{offer.location}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {built.matchedTags.length ? (
                        built.matchedTags.slice(0, 16).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 font-mono text-[10px]">
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-amber-700 dark:text-amber-400 font-medium">Sin coincidencias textuales directas en tags.</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Sin oferta: orden por prioridad general y pie de referencia general.
                  </p>
                )}
              </AccordionCard>

              {/* 3. Contenido del CV (Antecedentes) */}
              <AccordionCard
                id="facts"
                isOpen={!!openCvSections.facts}
                onToggle={toggleCvSection}
                title="Contenido del CV"
                icon={<Briefcase className="h-4 w-4 text-sky-500" />}
                summary={`${built.allFacts.filter((f) => f.included).length} de ${built.allFacts.length} antecedentes incluidos`}
                headerAction={
                  (forceInclude.length > 0 || exclude.length > 0) ? (
                    <button
                      type="button"
                      onClick={resetSelection}
                      className="text-[10px] font-mono text-sky-500 hover:underline cursor-pointer"
                    >
                      Restablecer
                    </button>
                  ) : undefined
                }
              >
                <div className="max-h-[360px] overflow-y-auto pr-1 space-y-3">
                  {(['education', 'experience', 'publications', 'courses', 'skills', 'languages'] as CvSection[]).map((sec) => {
                    const items = built.allFacts.filter((f) => f.fact.section === sec);
                    return (
                      <div key={sec}>
                        <div className="text-[10px] font-mono font-black uppercase text-[var(--text-muted)] mb-1">{SECTION_LABEL[sec]}</div>
                        <div className="space-y-1">
                          {items
                            .slice()
                            .sort((a, b) => b.score - a.score)
                            .map((s) => (
                              <label key={s.fact.id} className="flex items-start gap-2 text-[11px] cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="mt-0.5"
                                  checked={s.included}
                                  disabled={!!s.fact.core}
                                  onChange={() => toggleFact(s.fact.id, s.included)}
                                />
                                <span className="min-w-0 flex-1">
                                  <span className={s.included ? '' : 'text-[var(--text-muted)]'}>
                                    {s.fact[lang].title}
                                    {s.fact[lang].org ? ` · ${s.fact[lang].org}` : ''}
                                  </span>
                                  {s.matchedTags.length > 0 && (
                                    <span className="ml-1 text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                                      +{s.matchedTags.length} match
                                    </span>
                                  )}
                                </span>
                              </label>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionCard>

              {/* 4. Auditoría Dual-Lens & Gemini API */}
              <AccordionCard
                id="audit"
                isOpen={!!openCvSections.audit}
                onToggle={toggleCvSection}
                title="Auditoría Dual-Lens & Gemini API"
                icon={<Sparkles className="h-4 w-4 text-purple-400" />}
                summary={`ATS ${dualReport.headhunter.score}% · Wingman ${dualReport.wingman.score}%`}
              >
                {/* Alerta de Auditoría Perfil Maestro si existen fallos */}
                {audit.length > 0 && (
                  <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Auditoría del Perfil Maestro ({audit.length} alertas)</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px]">
                      {audit.map((a) => (
                        <li key={a.id} className="flex gap-2">
                          <AlertTriangle className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${a.severity === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`} />
                          <div>
                            <div>{a.message}</div>
                            {a.current && <div className="text-[var(--text-muted)] font-mono break-all text-[10px]">Actual: {a.current}</div>}
                            {a.expected && <div className="text-emerald-700 dark:text-emerald-400 font-mono break-all text-[10px]">Esperado: {a.expected}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                    {fixable.length > 0 && (
                      <button
                        type="button"
                        onClick={applyFixes}
                        className="w-full px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
                      >
                        Corregir {fixable.length} enlace(s) en el Perfil Maestro
                      </button>
                    )}
                  </div>
                )}

                <DualLensAuditHub
                  report={dualReport}
                  offer={offer}
                  documentText={renderCvMarkdown(built)}
                  onInjectSnippet={handleInjectWeapon}
                />
              </AccordionCard>

              {/* 5. Versiones y Compilaciones Guardadas */}
              <AccordionCard
                id="saved"
                isOpen={!!openCvSections.saved}
                onToggle={toggleCvSection}
                title="Versiones y Compilaciones"
                icon={<Save className="h-4 w-4 text-sky-500" />}
                summary={`${versions.length} versiones · ${storedCompiledCVs.length} compilaciones`}
              >
                <div className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={versionName}
                      onChange={(e) => setVersionName(e.target.value)}
                      placeholder={offer ? `${offer.title} (${offer.company})` : 'Nombre de versión'}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs border bg-transparent"
                      style={{ borderColor: 'var(--panel-border)' }}
                    />
                    <button
                      type="button"
                      onClick={saveCvVersion}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Guardar
                    </button>
                  </div>

                  {versions.length > 0 && (
                    <ul className="space-y-1 pt-2 border-t border-[var(--panel-border)] max-h-40 overflow-y-auto">
                      {versions.map((v) => (
                        <li key={v.id} className="flex items-center justify-between gap-2 text-[11px] p-2 rounded-lg border" style={{ borderColor: 'var(--panel-border)' }}>
                          <button
                            type="button"
                            onClick={() => loadCvVersion(v)}
                            className="text-left min-w-0 flex-1 cursor-pointer hover:text-sky-500"
                          >
                            <div className="font-bold truncate">{v.name}</div>
                            <div className="text-[var(--text-muted)] font-mono">{v.createdAt} · {v.lang.toUpperCase()} · {v.length}</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeCvVersion(v.id)}
                            className="text-[var(--text-muted)] hover:text-red-500 cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Versiones pre-compiladas del Expediente */}
                  {storedCompiledCVs.length > 0 && (
                    <div className="pt-2 border-t border-[var(--panel-border)] space-y-1">
                      <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
                        Compilaciones Rápidas ({storedCompiledCVs.length})
                      </div>
                      <ul className="space-y-1 max-h-36 overflow-y-auto">
                        {storedCompiledCVs.map((cv) => (
                          <li key={cv.id} className="flex items-center justify-between gap-2 text-[11px] p-2 rounded-lg border" style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold truncate text-[var(--text-primary)]">{cv.name}</div>
                              <div className="text-[9px] text-[var(--text-muted)] font-mono">{cv.updatedAt} · {cv.templateId}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedCvForModal(cv)}
                              className="px-2 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold cursor-pointer transition shrink-0"
                            >
                              Ver / Imprimir
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionCard>
            </>
          )}

          {/* ============================================ COVER LETTER MODE ACCORDIONS ============================================ */}
          {docMode === 'cover_letter' && (
            <>
              {/* 1. Borrador y Redacción Base */}
              <AccordionCard
                id="draft"
                isOpen={!!openLetterSections.draft}
                onToggle={toggleLetterSection}
                title="Borrador y Redacción"
                icon={<Sparkles className="h-4 w-4 text-purple-400" />}
                badge={
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 uppercase">
                    {letterLang === 'es' ? '🇪🇸 Español' : letterLang === 'en' ? '🇬🇧 English' : '🇩🇪 Deutsch'}
                  </span>
                }
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[var(--panel-border)]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-bold">Plantilla:</span>
                    <button
                      type="button"
                      onClick={() => loadPresetTemplate('es')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition cursor-pointer ${
                        letterLang === 'es'
                          ? 'bg-purple-600 text-white border-purple-500 font-bold'
                          : 'border-[var(--panel-border)] hover:bg-[var(--card-bg)] text-[var(--text-secondary)]'
                      }`}
                      title="Cargar plantilla científica en Español"
                    >
                      🇪🇸 ES
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPresetTemplate('en')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition cursor-pointer ${
                        letterLang === 'en'
                          ? 'bg-purple-600 text-white border-purple-500 font-bold'
                          : 'border-[var(--panel-border)] hover:bg-[var(--card-bg)] text-[var(--text-secondary)]'
                      }`}
                      title="Cargar plantilla científica en Inglés"
                    >
                      🇬🇧 EN
                    </button>
                    <button
                      type="button"
                      onClick={() => loadPresetTemplate('de')}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition cursor-pointer ${
                        letterLang === 'de'
                          ? 'bg-purple-600 text-white border-purple-500 font-bold'
                          : 'border-[var(--panel-border)] hover:bg-[var(--card-bg)] text-[var(--text-secondary)]'
                      }`}
                      title="Cargar plantilla científica en Alemán"
                    >
                      🇩🇪 DE
                    </button>
                    <button
                      type="button"
                      onClick={() => resetLetterDraft()}
                      className="ml-1 text-[11px] text-sky-500 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Restablecer el borrador actual a la plantilla científica oficial"
                    >
                      <RefreshCw className="h-3 w-3" /> Restablecer
                    </button>
                  </div>
                </div>

                <textarea
                  value={effectiveLetterBody}
                  onChange={(e) => setLetterBodyText(e.target.value)}
                  rows={12}
                  className="w-full p-3 rounded-xl text-xs font-sans leading-relaxed border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-500 transition shadow-inner"
                  style={{ borderColor: 'var(--panel-border)' }}
                  placeholder={
                    letterLang === 'es'
                      ? 'Escribe o edita aquí el cuerpo de tu carta en español...'
                      : letterLang === 'en'
                      ? 'Write or edit your cover letter body here in English...'
                      : 'Schreiben oder bearbeiten Sie hier Ihr Anschreiben auf Deutsch...'
                  }
                />

                <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={copyAntiAiPrompt}
                    className="w-full sm:w-auto flex-1 px-3 py-2 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-600 dark:text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title="Copia el prompt editorial completo con el diagnóstico en vivo y los 9 criterios del checklist para usar en Claude, ChatGPT o Gemini"
                  >
                    <Copy className="h-3.5 w-3.5 text-purple-400" />
                    <span>
                      {copiedPrompt
                        ? '¡Prompt Editorial Copiado!'
                        : `Exportar Prompt Anti-IA (${letterLang.toUpperCase()}) para LLM`}
                    </span>
                  </button>
                </div>
              </AccordionCard>

              {/* 2. Vincular a Oferta Laboral */}
              <AccordionCard
                id="offer"
                isOpen={!!openLetterSections.offer}
                onToggle={toggleLetterSection}
                title="Vincular a Oferta Laboral"
                icon={<Target className="h-4 w-4 text-sky-500" />}
                summary={offer ? `${offer.title} (${offer.company})` : 'General (sin oferta vinculada)'}
                headerAction={
                  <button
                    type="button"
                    onClick={() => setIsAddingOffer((v) => !v)}
                    className="px-2 py-1 rounded-lg bg-sky-600/15 hover:bg-sky-600/25 text-sky-600 dark:text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition"
                    title="Añadir una oferta real específica con su título e información relevante"
                  >
                    {isAddingOffer ? (
                      <>
                        <X className="h-3 w-3" /> Cancelar
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" /> + Añadir Oferta
                      </>
                    )}
                  </button>
                }
              >
                {/* Formulario desplegable para agregar oferta real paso a paso */}
                {isAddingOffer && (
                  <form onSubmit={handleCreateOffer} className="p-3 rounded-xl border border-sky-500/30 bg-[var(--panel-bg)] space-y-2.5 text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-[var(--panel-border)]">
                      <span className="font-mono font-bold text-[11px] text-sky-600 dark:text-sky-400 flex items-center gap-1">
                        <PlusCircle className="h-3.5 w-3.5" /> Registrar Oferta Verificada
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">Sin alucinaciones</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Título del Puesto / Rol *:</label>
                        <input
                          type="text"
                          required
                          value={newOfferTitle}
                          onChange={(e) => setNewOfferTitle(e.target.value)}
                          placeholder="Ej: Wissenschaftliche*r Mitarbeiter*in"
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Institución / Empresa *:</label>
                        <input
                          type="text"
                          required
                          value={newOfferCompany}
                          onChange={(e) => setNewOfferCompany(e.target.value)}
                          placeholder="Ej: Thünen-Institut für Agrarklimaschutz"
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Ubicación / Modalidad:</label>
                        <input
                          type="text"
                          value={newOfferLocation}
                          onChange={(e) => setNewOfferLocation(e.target.value)}
                          placeholder="Ej: Braunschweig / Kiel / Remoto"
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Requisitos clave (separados por coma):</label>
                        <input
                          type="text"
                          value={newOfferRequirements}
                          onChange={(e) => setNewOfferRequirements(e.target.value)}
                          placeholder="Ej: Eddy Covariance, R, Suelos, GEI"
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Descripción / Objetivos relevantes:</label>
                      <textarea
                        rows={2}
                        value={newOfferDesc}
                        onChange={(e) => setNewOfferDesc(e.target.value)}
                        placeholder="Pega aquí los objetivos de investigación, responsabilidades o contexto relevante de la vacante..."
                        className="w-full p-2 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-sky-500"
                        style={{ borderColor: 'var(--panel-border)' }}
                      />
                    </div>

                    <div className="pt-1 border-t border-[var(--panel-border)] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] block">
                        Datos para Encabezado DIN 5008 (Opcional para Cover Letter):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={newOfferRecipientName}
                          onChange={(e) => setNewOfferRecipientName(e.target.value)}
                          placeholder="Contacto: Prof. Dr. X"
                          className="w-full px-2 py-1 rounded-lg border bg-[var(--card-bg)] text-[11px] focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                        <input
                          type="text"
                          value={newOfferRecipientRole}
                          onChange={(e) => setNewOfferRecipientRole(e.target.value)}
                          placeholder="Cargo: Selección / AG"
                          className="w-full px-2 py-1 rounded-lg border bg-[var(--card-bg)] text-[11px] focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                        <input
                          type="text"
                          value={newOfferRecipientAddress}
                          onChange={(e) => setNewOfferRecipientAddress(e.target.value)}
                          placeholder="Dirección postal / Ciudad"
                          className="w-full px-2 py-1 rounded-lg border bg-[var(--card-bg)] text-[11px] focus:outline-none focus:border-sky-500"
                          style={{ borderColor: 'var(--panel-border)' }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingOffer(false)}
                        className="px-3 py-1 rounded-lg text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Guardar y Vincular
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex items-center gap-1.5">
                  <select
                    value={offerId}
                    onChange={(e) => {
                      setOfferId(e.target.value);
                      resetSelection();
                    }}
                    className="flex-1 px-3 py-2 rounded-xl text-xs border bg-transparent font-medium"
                    style={{ borderColor: 'var(--panel-border)' }}
                  >
                    <option value="">General (sin oferta específica)</option>
                    {offers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.title} — {o.company}
                      </option>
                    ))}
                  </select>

                  {offer && (
                    <button
                      type="button"
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-2 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 cursor-pointer transition shrink-0"
                      title="Eliminar esta oferta de la lista"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {offer ? (
                  <div className="text-[11px] space-y-1 pt-1 border-t border-[var(--panel-border)]">
                    <div className="flex items-center justify-between text-[var(--text-secondary)] font-medium">
                      <span>Coincidencias técnicas con la trayectoria verificada:</span>
                      {offer.location && <span className="text-[10px] font-mono text-[var(--text-muted)]">{offer.location}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {built.matchedTags.length ? (
                        built.matchedTags.slice(0, 16).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 font-mono text-[10px]">
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-amber-700 dark:text-amber-400 font-medium">Sin coincidencias textuales directas en tags.</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Sin oferta: encabezado formal genérico y estructura base institucional.
                  </p>
                )}
              </AccordionCard>

              {/* 3. Encabezado Institucional (DIN 5008) */}
              <AccordionCard
                id="header"
                isOpen={!!openLetterSections.header}
                onToggle={toggleLetterSection}
                title="Encabezado Institucional (DIN 5008)"
                icon={<Mail className="h-4 w-4 text-sky-500" />}
                summary={recipientOrg || offer?.company || 'Sin institución definida'}
              >
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">
                      {letterLang === 'en' ? 'Recipient Organisation / Company:' : letterLang === 'de' ? 'Empfangende Institution / Unternehmen:' : 'Institución / Empresa Destinataria:'}
                    </label>
                    <input
                      type="text"
                      value={recipientOrg}
                      onChange={(e) => setRecipientOrg(e.target.value)}
                      placeholder={offer?.company || (letterLang === 'en' ? 'e.g. German Environment Agency (UBA)' : letterLang === 'de' ? 'z.B. Umweltbundesamt (UBA)' : 'Ej: Thünen-Institut für Agrarklimaschutz')}
                      className="w-full px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500 transition"
                      style={{ borderColor: 'var(--panel-border)' }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">
                        {letterLang === 'en' ? 'Contact Person (Optional):' : letterLang === 'de' ? 'Ansprechperson (Optional):' : 'Contacto / Persona (Opcional):'}
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder={letterLang === 'en' ? 'e.g. Dr. Axel Don' : letterLang === 'de' ? 'z.B. Prof. Dr. Axel Don' : 'Ej: Prof. Dr. Axel Don'}
                        className="w-full px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500 transition"
                        style={{ borderColor: 'var(--panel-border)' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">
                        {letterLang === 'en' ? 'Role / Department:' : letterLang === 'de' ? 'Rolle / Abteilung:' : 'Cargo / Departamento:'}
                      </label>
                      <input
                        type="text"
                        value={recipientRole}
                        onChange={(e) => setRecipientRole(e.target.value)}
                        placeholder={letterLang === 'en' ? 'e.g. Head of Search Committee' : letterLang === 'de' ? 'z.B. Leitung der Arbeitsgruppe' : 'Ej: Leitung der Arbeitsgruppe'}
                        className="w-full px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500 transition"
                        style={{ borderColor: 'var(--panel-border)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">
                      {letterLang === 'en' ? 'Postal Address:' : letterLang === 'de' ? 'Postanschrift:' : 'Dirección Física / Postal:'}
                    </label>
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder={letterLang === 'en' ? 'e.g. Bundesallee 50, 38116 Braunschweig, Germany' : 'Ej: Bundesallee 50, 38116 Braunschweig, Deutschland'}
                      className="w-full px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500 transition"
                      style={{ borderColor: 'var(--panel-border)' }}
                    />
                  </div>
                </div>
              </AccordionCard>


              {/* 4. Versiones Guardadas de Carta */}
              <AccordionCard
                id="saved"
                isOpen={!!openLetterSections.saved}
                onToggle={toggleLetterSection}
                title="Versiones Guardadas"
                icon={<Save className="h-4 w-4 text-purple-400" />}
                summary={`${letterVersions.length} versiones`}
              >
                <div className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={letterVersionName}
                      onChange={(e) => setLetterVersionName(e.target.value)}
                      placeholder={offer ? `${offer.title} (${letterLang.toUpperCase()})` : 'Nombre de versión'}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-500 transition"
                      style={{ borderColor: 'var(--panel-border)' }}
                    />
                    <button
                      type="button"
                      onClick={saveLetterVer}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Guardar
                    </button>
                  </div>

                  {letterVersions.length > 0 && (
                    <ul className="space-y-1 pt-2 border-t border-[var(--panel-border)] max-h-40 overflow-y-auto">
                      {letterVersions.map((v) => (
                        <li key={v.id} className="flex items-center justify-between gap-2 text-[11px] p-2 rounded-lg border" style={{ borderColor: 'var(--panel-border)' }}>
                          <button
                            type="button"
                            onClick={() => loadLetterVer(v)}
                            className="text-left min-w-0 flex-1 cursor-pointer hover:text-purple-400"
                          >
                            <div className="font-bold truncate">{v.name}</div>
                            <div className="text-[var(--text-muted)] font-mono">{v.createdAt} · {v.lang.toUpperCase()}</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeLetterVer(v.id)}
                            className="text-[var(--text-muted)] hover:text-red-500 cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </AccordionCard>
            </>
          )}

        </div>

        {/* ======================================================== VISTA PREVIA A4 DERECHA (7 COLUMNAS) */}
        <div className="xl:col-span-7 2xl:col-span-7 space-y-2 sticky top-4">
          <div className={panel} style={panelStyle}>
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[var(--panel-border)]">
              <span className="font-mono font-black uppercase flex items-center gap-1.5 text-[var(--text-primary)]">
                <FileDown className="h-4 w-4 text-sky-500" />
                <span>
                  {docMode === 'cv'
                    ? `Vista previa A4 · ${pages} ${pages === 1 ? 'página' : 'páginas'}`
                    : `Vista previa Carta A4 (DIN 5008)`}
                </span>
              </span>
              {docMode === 'cv' && (
                fitInfo.overflow ? (
                  <span className="text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> No cabe: quita contenido
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono font-medium">Ajuste tipográfico ×{fitInfo.zoom || '1.00'}</span>
                )
              )}
            </div>

            <div ref={wrapRef} className="w-full overflow-hidden rounded-xl mt-2" style={{ backgroundColor: '#cbd5e1' }}>
              <div style={{ width: A4_W * scale, height: (A4_H * pages + GAP * pages) * scale }}>
                <iframe
                  ref={iframeRef}
                  title={docMode === 'cv' ? 'Vista previa del CV' : 'Vista previa de la Carta'}
                  srcDoc={activeHtml}
                  onLoad={onFrameLoad}
                  style={{
                    width: A4_W,
                    height: A4_H * pages + GAP * pages,
                    border: 0,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    background: '#cbd5e1'
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--panel-border)]">
              <span>
                Imprimir → “Guardar como PDF”, tamaño A4, márgenes “Ninguno”.
              </span>
              <span className="font-mono font-semibold">
                {fileBase}.pdf
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== SECCIÓN HORIZONTAL INFERIOR (COVER LETTER): AUDITORÍA DUAL-LENS & LINTER ANTI-IA */}
      {docMode === 'cover_letter' && (
        <div className="space-y-6 pt-4 border-t border-[var(--panel-border)]">
          {/* Bloque 1: Auditoría Dual-Lens & Gemini API (Horizontal, sin colapsar) */}
          <div className="space-y-2">
            <DualLensAuditHub
              report={dualReport}
              offer={offer}
              documentText={builtLetter.fullMarkdown}
              onInjectSnippet={handleInjectWeapon}
            />
          </div>

          {/* Bloque 2: Linter Anti-IA & Checklist Editorial (Horizontal, sin colapsar) */}
          <div className={panel} style={panelStyle}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--panel-border)]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-mono font-black text-sm uppercase text-[var(--text-primary)]">
                    Linter Anti-IA & Rigor Editorial DIN 5008
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-sans">
                    Fiscalización continua de clichés de modelos de lenguaje, muletillas burocráticas y reiteraciones léxicas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-mono px-3 py-1 rounded-full font-black border ${
                  builtLetter.audit.overallScore >= 80
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : builtLetter.audit.overallScore >= 60
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-rose-600 text-white border-rose-500'
                }`}>
                  Scorecard: {builtLetter.audit.overallScore}/100
                </span>
                <button
                  type="button"
                  onClick={copyAuditSummary}
                  className="px-2.5 py-1 rounded-lg border border-[var(--panel-border)] hover:bg-[var(--card-bg)] text-xs font-mono text-sky-600 dark:text-sky-400 flex items-center gap-1.5 cursor-pointer transition"
                  title="Copiar el diagnóstico y los 9 criterios al portapapeles"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedAudit ? '¡Copiado!' : 'Copiar Diagnóstico'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-3 text-xs">
              {/* Alerta de Veredicto Editorial */}
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-1 transition-colors ${
                  builtLetter.audit.overallScore >= 80
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                    : builtLetter.audit.overallScore >= 60
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-200'
                    : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/40 text-rose-950 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold uppercase font-mono">
                  {builtLetter.audit.overallScore >= 80 ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : builtLetter.audit.overallScore >= 60 ? (
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                  <span>
                    {builtLetter.audit.overallScore >= 80
                      ? 'Auditoría Editorial: Voz Humana y Rigor Acreditados'
                      : builtLetter.audit.overallScore >= 60
                      ? 'Auditoría Editorial: Alertas y Mejoras Sugeridas'
                      : 'Auditoría Editorial: Nivel Crítico de Fórmulas IA'}
                  </span>
                </div>
                <p className="text-[11.5px] font-sans leading-relaxed">
                  {builtLetter.audit.overallScore >= 80
                    ? 'La carta presenta estructura soberana libre de fórmulas manidas de IA, con lenguaje científico técnico y evidencia empírica directa.'
                    : 'Se detectaron expresiones genéricas o reiteraciones que debilitan la asimetría competitiva. Revisa los puntos señalados abajo.'}
                </p>
              </div>

              {/* Grid 4 Métricas Clave */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 flex flex-col justify-between">
                  <span className="text-[var(--text-muted)] uppercase text-[10px]">Clichés IA</span>
                  <span className={`font-bold text-sm mt-1 ${builtLetter.audit.clicheCount === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {builtLetter.audit.clicheCount} detectados
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 flex flex-col justify-between">
                  <span className="text-[var(--text-muted)] uppercase text-[10px]">Muletillas Burocráticas</span>
                  <span className={`font-bold text-sm mt-1 ${builtLetter.audit.bureaucraticFillers.length === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {builtLetter.audit.bureaucraticFillers.length} rellenos
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 flex flex-col justify-between">
                  <span className="text-[var(--text-muted)] uppercase text-[10px]">Palabras Repetidas 4+</span>
                  <span className={`font-bold text-sm mt-1 ${builtLetter.audit.mechanicalRepetitions.length === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {builtLetter.audit.mechanicalRepetitions.length} palabras
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 flex flex-col justify-between">
                  <span className="text-[var(--text-muted)] uppercase text-[10px]">ToR Mandatorios</span>
                  <span className={`font-bold text-sm mt-1 ${builtLetter.audit.hasAvailabilityMention && builtLetter.audit.hasFeeMention ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {builtLetter.audit.hasAvailabilityMention && builtLetter.audit.hasFeeMention ? '✓ Completos' : '⚠️ Pendientes'}
                  </span>
                </div>
              </div>

              {/* Caja de Alerta de Reiteraciones Mecánicas si existen */}
              {(builtLetter.audit.mechanicalRepetitions.length > 0 || builtLetter.audit.sentenceStarterRepetitions.length > 0) && (
                <div className="p-3.5 rounded-xl bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 space-y-2 text-xs">
                  <div className="font-mono font-bold flex items-center gap-1.5 text-purple-600 dark:text-purple-300 uppercase text-[11px]">
                    <Repeat className="h-4 w-4" />
                    <span>Reiteraciones Mecánicas Detectadas en el Texto</span>
                  </div>

                  {builtLetter.audit.mechanicalRepetitions.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10.5px] text-[var(--text-muted)] block font-mono">Palabras con alta frecuencia no intencional:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {builtLetter.audit.mechanicalRepetitions.map((r, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-mono text-[10.5px] border border-amber-300 dark:border-amber-500/30">
                            «{r.word}» ({r.count}×)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {builtLetter.audit.sentenceStarterRepetitions.length > 0 && (
                    <div className="space-y-1 pt-1.5 border-t border-black/10 dark:border-white/10">
                      <span className="text-[10.5px] text-[var(--text-muted)] block font-mono">Iniciadores monótonos recurrentes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {builtLetter.audit.sentenceStarterRepetitions.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-500/20 text-rose-900 dark:text-rose-300 font-mono text-[10.5px] border border-rose-300 dark:border-rose-500/30">
                            Iniciador {s.starter} ({s.count} oraciones)
                          </span>
                        ))}
                      </div>
                      <p className="text-[10.5px] text-[var(--text-secondary)] italic">
                        💡 Sugerencia: Varía usando participios (ej. «Having coordinated...»), marcos de contexto («At the intersection of...») o contrastes de enfoque («Rather than...»).
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Checklist Completo de 9 Criterios (Horizontal, Sin Colapsar) */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--panel-border)] pb-2">
                  <span className="font-mono text-xs font-bold flex items-center gap-1.5 text-[var(--text-primary)] uppercase">
                    <ListChecks className="h-4 w-4 text-sky-500" />
                    <span>Checklist de Verificación ({builtLetter.audit.checklist.length} Criterios Editoriales)</span>
                  </span>

                  {/* Filtros de Categoría */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'anti_ai', label: 'Anti-IA' },
                      { id: 'style_repetition', label: 'Reiteraciones' },
                      { id: 'golden_thread', label: 'Hilo Conductor' },
                      { id: 'metrics_evidence', label: 'Rigor' },
                      { id: 'tor_compliance', label: 'ToR Mandatorio' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setChecklistFilter(cat.id as any)}
                        className={`px-2 py-0.5 rounded text-[10.5px] font-mono transition cursor-pointer ${
                          checklistFilter === cat.id
                            ? 'bg-purple-600 text-white font-bold'
                            : 'bg-black/5 dark:bg-black/20 text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid de 2 columnas en pantallas medianas/grandes para los criterios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {builtLetter.audit.checklist
                    .filter((c) => checklistFilter === 'all' || c.category === checklistFilter)
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border text-[11px] space-y-1.5 transition ${
                          item.status === 'pass'
                            ? 'bg-emerald-100/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30'
                            : item.status === 'warning'
                            ? 'bg-amber-100/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/30'
                            : 'bg-rose-100/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold">
                            {item.status === 'pass' ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : item.status === 'warning' ? (
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                            ) : (
                              <ShieldAlert className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                            )}
                            <span className="text-[var(--text-primary)]">{item.label}</span>
                          </div>
                          <span className={`text-[9.5px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            item.status === 'pass'
                              ? 'bg-emerald-600 text-white'
                              : item.status === 'warning'
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-rose-600 text-white'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-sans">
                          {item.summary}
                        </p>

                        {item.details && item.details.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {item.details.map((d, di) => (
                              <span key={di} className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-mono">
                                {d}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.suggestion && (
                          <div className="p-2 rounded-lg bg-black/5 dark:bg-black/30 text-[10.5px] text-sky-700 dark:text-sky-300 flex items-start gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                            <span>{item.suggestion}</span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Previsualización para CVs del Expediente */}
      <CVPreviewModal
        cv={selectedCvForModal}
        isOpen={!!selectedCvForModal}
        onClose={() => setSelectedCvForModal(null)}
      />
    </div>
  );
};

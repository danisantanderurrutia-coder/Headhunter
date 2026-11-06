import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Copy,
  FileDown,
  Mail,
  Printer,
  RefreshCw,
  Save,
  Sparkles,
  Target,
  Trash2,
  Wrench,
  Layers
} from 'lucide-react';
import { getStoredOffers, getStoredProfile, saveStoredProfile, getStoredCVs } from '../../services/db';
import { cvTemplatesList } from '../../services/sampleData';
import type { CVVersion } from '../../types/cv';
import { CVPreviewModal } from './CVPreviewModal';
import {
  applyLinkFixes,
  auditProfile,
  buildCv,
  getSavedVersions,
  renderCvHtml,
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
  const offers = useMemo(() => getStoredOffers(), []);

  const [docMode, setDocMode] = useState<'cv' | 'cover_letter'>(initialDocType);
  const [offerId, setOfferId] = useState<string>(initialOfferId);

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
  const [letterBodyText, setLetterBodyText] = useState('');
  const [letterVersions, setLetterVersions] = useState<SavedCoverLetterVersion[]>(getSavedLetterVersions());
  const [letterVersionName, setLetterVersionName] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

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
  const effectiveLetterBody = letterBodyText.trim()
    ? letterBodyText
    : buildDefaultScientificDraft(letterLang, offer).join('\n\n');

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
    const prompt = generateAntiAiPrompt(offer, effectiveLetterBody);
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const resetLetterDraft = () => {
    setLetterBodyText(buildDefaultScientificDraft(letterLang, offer).join('\n\n'));
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
    setLetterBodyText(v.customBodyText);
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
    <div className="space-y-4 text-[var(--text-primary)]">
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
                <div className="flex p-1 rounded-xl border gap-1" style={{ borderColor: 'var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}>
                  <button className={segBtn(letterLang === 'es')} onClick={() => setLetterLang('es')}>ES</button>
                  <button className={segBtn(letterLang === 'en')} onClick={() => setLetterLang('en')}>EN</button>
                  <button className={segBtn(letterLang === 'de')} onClick={() => setLetterLang('de')}>DE</button>
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
              className="px-3 py-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] hover:bg-[var(--card-bg)] text-xs font-bold flex items-center gap-1.5 cursor-pointer text-[var(--text-primary)] transition"
              title={`Descargar archivo HTML autónomo (${fileBase}.html)`}
            >
              <FileDown className="h-4 w-4 text-emerald-500" />
              <span>Descargar HTML</span>
            </button>
            <button
              onClick={print}
              className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              title={`Imprimir → Guardar como PDF (${fileBase}.pdf)`}
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(340px,460px)_1fr] gap-4 items-start">
        {/* ======================================================== CONTROLES IZQUIERDA */}
        <div className="space-y-4">
          {/* Selector de Plantillas y Formatos Oficiales (Unificación con Gestor de Plantillas) */}
          {docMode === 'cv' && (
            <div className={panel} style={panelStyle}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-sky-500" /> Plantilla Base del CV
                </h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {cvTemplatesList.length} Formatos
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
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
                          : 'border-[var(--card-border)] bg-[var(--panel-bg)] hover:border-sky-500/40'
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
          )}

          {/* Selector de Ángulo Táctico de Posicionamiento */}
          {docMode === 'cv' && (
            <div className={panel} style={panelStyle}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-400" /> Ángulo Táctico de Posicionamiento
                </h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  5 Enfoques
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Adapta automáticamente el titular, síntesis ejecutiva y priorización de evidencia técnica según la vertical de la organización.
              </p>
              <div className="space-y-1.5 pt-1">
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
                    desc: 'Flujos GEI (CO₂, CH₄), turberas, cámaras cerradas y σp edáfico.',
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
                          : 'border-[var(--card-border)] bg-[var(--panel-bg)] hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-[11px] text-[var(--text-primary)] flex items-center gap-1.5">
                          <span>{angle.name}</span>
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
          )}

          {/* Selector de Oferta (Común a CV y Carta) */}
          <div className={panel} style={panelStyle}>
            <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
              <Target className="h-4 w-4 text-sky-500" /> Vincular a Oferta Laboral / Convocatoria
            </h3>
            <select
              value={offerId}
              onChange={(e) => {
                setOfferId(e.target.value);
                resetSelection();
              }}
              className="w-full px-3 py-2 rounded-xl text-xs border bg-transparent font-medium"
              style={{ borderColor: 'var(--panel-border)' }}
            >
              <option value="">General (sin oferta específica)</option>
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title} — {o.company}
                </option>
              ))}
            </select>

            {offer ? (
              <div className="text-[11px] space-y-1 pt-1 border-t border-[var(--panel-border)]">
                <div className="text-[var(--text-secondary)] font-medium">
                  Coincidencias técnicas con la trayectoria verificada:
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
                {docMode === 'cv'
                  ? 'Sin oferta: orden por prioridad general y pie de referencia general.'
                  : 'Sin oferta: encabezado formal genérico y estructura base institucional.'}
              </p>
            )}
          </div>

          {/* CONTROLES ESPECÍFICOS: CV STUDIO */}
          {docMode === 'cv' && (
            <>
              <div className={panel} style={panelStyle}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-sky-500" /> Contenido incluido
                  </h3>
                  {(forceInclude.length > 0 || exclude.length > 0) && (
                    <button onClick={resetSelection} className="text-[11px] text-sky-500 hover:underline cursor-pointer">
                      Restablecer selección
                    </button>
                  )}
                </div>
                <div className="max-h-[340px] overflow-y-auto pr-1 space-y-3">
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
              </div>

              {/* Contacto & Ubicación CV */}
              <div className={panel} style={panelStyle}>
                <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-sky-500" /> Contacto en Cabecera
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Ubicación en el CV:</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border bg-transparent font-medium"
                      style={{ borderColor: 'var(--panel-border)' }}
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={includePhone}
                      onChange={(e) => setIncludePhone(e.target.checked)}
                    />
                    <span className="text-[11px]">Incluir teléfono ({profile.phone || 'No registrado'})</span>
                  </label>
                </div>
              </div>

              {/* Versiones de CV */}
              <div className={panel} style={panelStyle}>
                <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
                  <Save className="h-4 w-4 text-sky-500" /> Guardar configuración de CV
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    placeholder={offer ? `${offer.title} (${offer.company})` : 'Nombre de versión'}
                    className="flex-1 px-3 py-1.5 rounded-xl text-xs border bg-transparent"
                    style={{ borderColor: 'var(--panel-border)' }}
                  />
                  <button onClick={saveCvVersion} className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer">
                    Guardar
                  </button>
                </div>
                {versions.length > 0 && (
                  <ul className="space-y-1 pt-2 border-t border-[var(--panel-border)] max-h-40 overflow-y-auto">
                    {versions.map((v) => (
                      <li key={v.id} className="flex items-center justify-between gap-2 text-[11px] p-2 rounded-lg border" style={{ borderColor: 'var(--panel-border)' }}>
                        <button onClick={() => loadCvVersion(v)} className="text-left min-w-0 flex-1 cursor-pointer hover:text-sky-500">
                          <div className="font-bold truncate">{v.name}</div>
                          <div className="text-[var(--text-muted)] font-mono">{v.createdAt} · {v.lang.toUpperCase()} · {v.length}</div>
                        </button>
                        <button onClick={() => removeCvVersion(v.id)} className="text-[var(--text-muted)] hover:text-red-500 cursor-pointer" title="Eliminar">
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

              {/* Auditoría Perfil Maestro */}
              <div className={panel} style={panelStyle}>
                <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
                  <Wrench className="h-4 w-4 text-sky-500" /> Auditoría del Perfil Maestro
                </h3>
                {audit.length === 0 ? (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> El Perfil Maestro coincide con los datos verificados.
                  </p>
                ) : (
                  <>
                    <ul className="space-y-2">
                      {audit.map((a) => (
                        <li key={a.id} className="text-[11px] flex gap-2">
                          <AlertTriangle className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${a.severity === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`} />
                          <div>
                            <div>{a.message}</div>
                            {a.current && <div className="text-[var(--text-muted)] font-mono break-all">Actual: {a.current}</div>}
                            {a.expected && <div className="text-emerald-700 dark:text-emerald-400 font-mono break-all">Esperado: {a.expected}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                    {fixable.length > 0 && (
                      <button onClick={applyFixes} className="w-full px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer">
                        Corregir {fixable.length} enlace(s) en el Perfil Maestro
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* CONTROLES ESPECÍFICOS: COVER LETTER STUDIO */}
          {docMode === 'cover_letter' && (
            <>
              {/* Linter Anti-AI */}
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-2 transition-colors ${
                  builtLetter.audit.passed
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono font-bold">
                  <span className="flex items-center gap-1.5 text-xs uppercase">
                    {builtLetter.audit.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                    <span>
                      {builtLetter.audit.passed
                        ? 'Filtro Anti-IA: Rigor Científico Acreditado'
                        : `Alerta Anti-IA: ${builtLetter.audit.clicheCount} Cliché(s) Detectado(s)`}
                    </span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-black/10 dark:bg-black/30 border border-slate-300 dark:border-white/10 uppercase text-[var(--text-secondary)]">
                    Reglas Críticas
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]">
                  {builtLetter.audit.passed
                    ? 'La carta respeta tu narrativa analítica en primera persona, sustentada en balances de masa, resistividad eléctrica (SEV), Eddy Covariance y modelación en R sin fórmulas infladas.'
                    : `Se han detectado fórmulas genéricas de IA no deseadas: "${builtLetter.audit.detectedCliches.join(
                        '", "'
                      )}". Reemplázalas por descripciones biofísicas concretas.`}
                </p>
                <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                  <span className={`px-2 py-0.5 rounded border ${builtLetter.audit.hasMethodology ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'}`}>
                    Metodología (SEV/Eddy): {builtLetter.audit.hasMethodology ? 'OK' : 'Falta'}
                  </span>
                  <span className={`px-2 py-0.5 rounded border ${builtLetter.audit.hasMassBalancePerspective ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'}`}>
                    Balance de masa: {builtLetter.audit.hasMassBalancePerspective ? 'OK' : 'Falta'}
                  </span>
                </div>
              </div>

              {/* Editor del Borrador Base */}
              <div className={panel} style={panelStyle}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-400" /> Mi Borrador Base (Editable)
                  </h3>
                  <button
                    onClick={resetLetterDraft}
                    className="text-[11px] text-sky-500 hover:underline flex items-center gap-1 cursor-pointer"
                    title="Restablecer el borrador a la plantilla científica de alta fidelidad"
                  >
                    <RefreshCw className="h-3 w-3" /> Restablecer
                  </button>
                </div>

                <textarea
                  value={effectiveLetterBody}
                  onChange={(e) => setLetterBodyText(e.target.value)}
                  rows={13}
                  className="w-full p-3 rounded-xl text-xs font-sans leading-relaxed border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-500 transition shadow-inner"
                  style={{ borderColor: 'var(--panel-border)' }}
                  placeholder="Escribe o pega aquí el cuerpo de tu carta..."
                />

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={copyAntiAiPrompt}
                    className="w-full sm:w-auto flex-1 px-3 py-2 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-600 dark:text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Copia el prompt editorial completo con tus 4 reglas críticas para usar en Claude, ChatGPT o Gemini"
                  >
                    <Copy className="h-3.5 w-3.5 text-purple-400" />
                    <span>{copiedPrompt ? '¡Prompt Copiado!' : 'Copiar Prompt Anti-AI para LLM'}</span>
                  </button>
                </div>
              </div>

              {/* Metadatos DIN 5008 del Destinatario */}
              <div className={panel} style={panelStyle}>
                <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-sky-500" /> Encabezado Institucional (DIN 5008)
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Institución / Empresa Destinataria:</label>
                    <input
                      type="text"
                      value={recipientOrg}
                      onChange={(e) => setRecipientOrg(e.target.value)}
                      placeholder={offer?.company || 'Ej: Thünen-Institut für Agrarklimaschutz'}
                      className="w-full px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500 transition"
                      style={{ borderColor: 'var(--panel-border)' }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Contacto / Persona (Opcional):</label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Ej: Prof. Dr. Axel Don"
                        className="w-full px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500 transition"
                        style={{ borderColor: 'var(--panel-border)' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Cargo / Departamento:</label>
                      <input
                        type="text"
                        value={recipientRole}
                        onChange={(e) => setRecipientRole(e.target.value)}
                        placeholder="Ej: Leitung der Arbeitsgruppe"
                        className="w-full px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500 transition"
                        style={{ borderColor: 'var(--panel-border)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-[var(--text-muted)] block mb-0.5">Dirección Física / Postal:</label>
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="Ej: Bundesallee 50, 38116 Braunschweig, Deutschland"
                      className="w-full px-3 py-1.5 rounded-xl border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500 transition"
                      style={{ borderColor: 'var(--panel-border)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Versiones de Cartas */}
              <div className={panel} style={panelStyle}>
                <h3 className="text-xs font-black font-mono uppercase flex items-center gap-1.5">
                  <Save className="h-4 w-4 text-purple-400" /> Guardar Versión de Carta
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={letterVersionName}
                    onChange={(e) => setLetterVersionName(e.target.value)}
                    placeholder={offer ? `${offer.title} (${letterLang.toUpperCase()})` : 'Nombre de versión'}
                    className="flex-1 px-3 py-1.5 rounded-xl text-xs border bg-[var(--card-bg)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-500 transition"
                    style={{ borderColor: 'var(--panel-border)' }}
                  />
                  <button onClick={saveLetterVer} className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer">
                    Guardar
                  </button>
                </div>
                {letterVersions.length > 0 && (
                  <ul className="space-y-1 pt-2 border-t border-[var(--panel-border)] max-h-40 overflow-y-auto">
                    {letterVersions.map((v) => (
                      <li key={v.id} className="flex items-center justify-between gap-2 text-[11px] p-2 rounded-lg border" style={{ borderColor: 'var(--panel-border)' }}>
                        <button onClick={() => loadLetterVer(v)} className="text-left min-w-0 flex-1 cursor-pointer hover:text-purple-400">
                          <div className="font-bold truncate">{v.name}</div>
                          <div className="text-[var(--text-muted)] font-mono">{v.createdAt} · {v.lang.toUpperCase()}</div>
                        </button>
                        <button onClick={() => removeLetterVer(v.id)} className="text-[var(--text-muted)] hover:text-red-500 cursor-pointer" title="Eliminar">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {/* ======================================================== VISTA PREVIA A4 DERECHA */}
        <div className={panel} style={panelStyle}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono font-black uppercase flex items-center gap-1.5">
              <FileDown className="h-4 w-4 text-sky-500" />
              <span>
                {docMode === 'cv'
                  ? `Vista previa A4 · ${pages} ${pages === 1 ? 'página' : 'páginas'}`
                  : `Vista previa Carta A4 (DIN 5008) · 1 página`}
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
            {docMode === 'cover_letter' && (
              <span className="text-purple-400 font-mono text-[10px] font-bold">
                FORMATO ACADÉMICO DIN
              </span>
            )}
          </div>

          <div ref={wrapRef} className="w-full overflow-hidden rounded-xl" style={{ backgroundColor: '#cbd5e1' }}>
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

          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1">
            <span>
              En el diálogo de impresión: elige “Guardar como PDF”, tamaño A4, márgenes “Ninguno”.
            </span>
            <span className="font-mono font-semibold">
              Archivo: {fileBase}.pdf
            </span>
          </div>
        </div>
      </div>

      {/* Modal de Previsualización para CVs del Expediente */}
      <CVPreviewModal
        cv={selectedCvForModal}
        isOpen={!!selectedCvForModal}
        onClose={() => setSelectedCvForModal(null)}
      />
    </div>
  );
};

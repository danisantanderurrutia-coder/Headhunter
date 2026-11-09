import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  FileText,
  MessageSquare,
  Target,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Cpu,
  ShieldCheck,
  Lightbulb,
  AlertCircle,
  UserCheck,
  FolderCheck,
  FileCheck,
  Bot,
  Sparkles,
  Loader2
} from 'lucide-react';
import type { JobOffer } from '../../types/offers';
import { generateTailoredCoverLetter, generateApplicationQA } from '../../services/coverLetterCopilot';
import { getDossierForOffer } from '../../services/jobWingmanService';
import { WingmanEditor } from './WingmanEditor';
import { buildCv, renderCvMarkdown } from '../../services/cvStudio';
import { auditDocumentDualLens } from '../../services/dualAuditEngine';
import { generateCoverLetterWithGemini } from '../../services/geminiService';

interface FiveStepPipelineModalProps {
  offer: JobOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onStartApplication: (offerId: string) => void;
  onOpenStudio?: (offerId: string, docType?: 'cv' | 'cover_letter') => void;
}

const STEPS = [
  { num: 1, label: 'Análisis empleo', icon: Search },
  { num: 2, label: 'Decisor & Foco', icon: Target },
  { num: 3, label: 'Docs requeridos', icon: FolderCheck },
  { num: 4, label: 'Preparar CV', icon: FileText },
  { num: 5, label: 'Carta', icon: MessageSquare },
  { num: 6, label: 'Contacto & Formulario', icon: Mail },
  { num: 7, label: 'Entrevista', icon: Cpu }
];

interface RequiredDocItem {
  id: string;
  name: string;
  category: 'core' | 'academic' | 'legal' | 'evidence';
  description: string;
  status: 'ready' | 'in_progress' | 'pending';
  tip: string;
}

const INITIAL_REQUIRED_DOCS: RequiredDocItem[] = [
  {
    id: 'doc-cv',
    name: 'Currículum Vitae (A4 / Formato DIN 5008 / Europass)',
    category: 'core',
    description: 'CV adaptado a la vacante con foco cuantitativo y datos verificados.',
    status: 'ready',
    tip: 'Utiliza CV Studio para generar el PDF A4 con espaciado calibrado.'
  },
  {
    id: 'doc-letter',
    name: 'Carta de Motivación / Anschreiben personalizada',
    category: 'core',
    description: 'Carta nominal orientada al supervisor o equipo técnico (sin clichés).',
    status: 'in_progress',
    tip: 'Personalizada con los ganchos técnicos y el foco del proyecto en el Paso 5.'
  },
  {
    id: 'doc-degrees',
    name: 'Títulos Universitarios Oficiales (Diplomas)',
    category: 'academic',
    description: 'Licenciatura en Geofísica (U. de Chile) + Másteres (CAU Kiel / AMU Poznań).',
    status: 'ready',
    tip: 'Para convocatorias públicas alemanas (TVöD), anexar copia legalizada o apostillada si procede.'
  },
  {
    id: 'doc-transcript',
    name: 'Certificado de Calificaciones (Transcript of Records)',
    category: 'academic',
    description: 'Concentración de notas oficial con equivalencia en créditos ECTS.',
    status: 'ready',
    tip: 'Descargar el PDF oficial firmado del portal universitario de CAU Kiel / Poznań.'
  },
  {
    id: 'doc-references',
    name: 'Cartas de Recomendación / Referencias Académicas',
    category: 'academic',
    description: 'Contactos y cartas de PIs o supervisores de proyectos previos.',
    status: 'in_progress',
    tip: 'Indicar afiliación institucional, email institucional y relación científica.'
  },
  {
    id: 'doc-language',
    name: 'Certificados de Competencia Lingüística',
    category: 'academic',
    description: 'Acreditación de Inglés C2 y Alemán funcional (B1-B2).',
    status: 'ready',
    tip: 'Certificados oficiales o acreditación de máster impartido íntegramente en inglés.'
  },
  {
    id: 'doc-visa',
    name: 'Habilitación de Residencia / Permiso Contractual',
    category: 'legal',
    description: 'Marco para graduados de universidades alemanas (§20 AufenthG).',
    status: 'ready',
    tip: 'Mencionar en la postulación disponibilidad contractual inmediata sin patrocinio extraordinario.'
  },
  {
    id: 'doc-samples',
    name: 'Muestras de Trabajo / Tesis / Reportes Técnicos',
    category: 'evidence',
    description: 'Memoria de título en geofísica de suelos, reportes EPN o enlaces a repositorios R/Python.',
    status: 'ready',
    tip: 'Incluir enlace con hipervínculo clickeable al portafolio y a repositorios en GitHub.'
  }
];

const card = 'p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3';
const btnPrimary = 'px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition cursor-pointer';
const btnGhost = 'px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 cursor-pointer';
const textareaCls = 'w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-[11px] leading-relaxed focus:outline-none';

interface CopyBtnProps {
  k: string;
  text: string;
  label: string;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
}

const CopyBtn: React.FC<CopyBtnProps> = ({ k, text, label, copiedKey, onCopy }) => (
  <button
    onClick={() => onCopy(k, text)}
    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1 border border-slate-700 cursor-pointer"
  >
    {copiedKey === k ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    <span>{copiedKey === k ? '¡Copiado!' : label}</span>
  </button>
);

interface LangToggleProps<T extends string> {
  value: T;
  options: { v: T; l: string }[];
  onChange: (v: T) => void;
}

const LangToggle = <T extends string>({ value, options, onChange }: LangToggleProps<T>) => (
  <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800">
    {options.map(o => (
      <button
        key={o.v}
        onClick={() => onChange(o.v)}
        className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${value === o.v ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
      >
        {o.l}
      </button>
    ))}
  </div>
);

interface NavProps {
  prev?: number;
  next?: number;
  nextLabel?: string;
  onStep: (step: number) => void;
}

const Nav: React.FC<NavProps> = ({ prev, next, nextLabel, onStep }) => (
  <div className="flex justify-end pt-2 space-x-2">
    {prev && <button onClick={() => onStep(prev)} className={btnGhost}>← Atrás</button>}
    {next && <button onClick={() => onStep(next)} className={btnPrimary}>{nextLabel} →</button>}
  </div>
);

export const FiveStepPipelineModal: React.FC<FiveStepPipelineModalProps> = ({
  offer,
  isOpen,
  onClose,
  onStartApplication,
  onOpenStudio
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [cvLang, setCvLang] = useState<'es' | 'en'>('es');
  const [letterLang, setLetterLang] = useState<'de' | 'en' | 'es'>('de');
  const [emailLang, setEmailLang] = useState<'de' | 'en'>('de');
  const [copied, setCopied] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState(false);
  const [, setDossierVersion] = useState(0);
  const [docItems, setDocItems] = useState<RequiredDocItem[]>(INITIAL_REQUIRED_DOCS);
  const [customGeminiLetter, setCustomGeminiLetter] = useState<string | null>(null);
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);

  if (!isOpen || !offer) return null;

  const dossier = getDossierForOffer(offer);
  const lead = dossier.leadProfile;
  const leadFull = `${lead.titleHonorific ? lead.titleHonorific + ' ' : ''}${lead.name}`;
  const coverLetter = generateTailoredCoverLetter(offer, letterLang, lead, dossier);
  const activeCoverLetterMarkdown = customGeminiLetter || coverLetter.fullMarkdown;
  const qaPairs = generateApplicationQA(offer);
  const builtCv = buildCv({ lang: cvLang, length: '1p', offer });
  const cvText = renderCvMarkdown(builtCv);
  const emailSubject = emailLang === 'de' ? dossier.coldApproachEmail.subjectDe : dossier.coldApproachEmail.subjectEn;
  const emailBody = emailLang === 'de' ? dossier.coldApproachEmail.bodyDe : dossier.coldApproachEmail.bodyEn;
  const match = offer.matchScore;

  // Auditoría Dual-Lens en vivo para CV y Carta
  const cvDualReport = useMemo(() => {
    return auditDocumentDualLens({
      documentType: 'cv',
      text: cvText,
      offer,
      dossier
    });
  }, [cvText, offer, dossier]);

  const letterDualReport = useMemo(() => {
    return auditDocumentDualLens({
      documentType: 'cover_letter',
      text: activeCoverLetterMarkdown,
      offer,
      dossier
    });
  }, [activeCoverLetterMarkdown, offer, dossier]);

  const handleGenerateGeminiLetter = async () => {
    setGeminiError(null);
    setIsGeneratingGemini(true);
    try {
      const res = await generateCoverLetterWithGemini(offer, letterLang);
      setCustomGeminiLetter(res.fullMarkdown);
    } catch (err: any) {
      setGeminiError(err.message || 'Error al conectar con la API de Gemini');
    } finally {
      setIsGeneratingGemini(false);
    }
  };

  const toggleDocStatus = (id: string) => {
    setDocItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nextStatus: Record<RequiredDocItem['status'], RequiredDocItem['status']> = {
        ready: 'in_progress',
        in_progress: 'pending',
        pending: 'ready'
      };
      return { ...item, status: nextStatus[item.status] };
    }));
  };

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const interviewQuestions = [
    {
      q: `¿Cómo aplica su formación cuantitativa en Geofísica y R/Python a las exigencias concretas de ${offer.title} en ${offer.company}?`,
      a: dossier.candidateValueThesis
    },
    ...dossier.projectPainPoints.slice(0, 3).map(p => ({
      q: `Reto del proyecto: ${p}`,
      a: `Prepara una respuesta técnica propia (con un ejemplo verificable de tu CV) sobre cómo abordarías este punto. Ganchos disponibles: ${dossier.technicalHooks.slice(0, 2).join(' | ')}`
    }))
  ];

  const readyDocsCount = docItems.filter(d => d.status === 'ready').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131c2e] max-w-4xl w-full rounded-2xl border border-slate-700 shadow-2xl space-y-4 my-8 flex flex-col max-h-[90vh] text-slate-100">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Pipeline Táctico de 7 Pasos // Job Search OS
            </span>
            <h3 className="font-bold text-white text-base mt-1">{offer.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              <strong className="text-white">{offer.company}</strong> • {offer.location}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper (7 Pasos) */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-7 gap-1.5">
            {STEPS.map(step => {
              const Icon = step.icon;
              const isActive = activeStep === step.num;
              const isPast = activeStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`flex flex-col items-center p-2 rounded-xl text-[10.5px] font-semibold transition border cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : isPast
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Icon className="h-3 w-3" />
                    <span>Paso {step.num}</span>
                  </div>
                  <span className="truncate max-w-full text-[9.5px] mt-0.5 font-normal">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">

          {/* PASO 1: ANÁLISIS DEL EMPLEO */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className={card}>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Search className="h-4 w-4 text-emerald-400" />
                  <span>Paso 1: Análisis del empleo</span>
                </h4>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Afinidad: <strong className="text-emerald-400">{match?.totalScore ?? '–'}/100</strong></span>
                  {offer.deadline && <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Plazo: <strong className="text-amber-300">{offer.deadline}</strong></span>}
                  {offer.verificationStatus && <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">{offer.verificationStatus}</span>}
                </div>
                <p className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">{offer.rawDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={card}>
                  <span className="font-bold text-emerald-400">Requisitos</span>
                  <ul className="space-y-1 text-slate-300">
                    {offer.requirements.map((r, i) => <li key={i}>▸ {r}</li>)}
                  </ul>
                </div>
                <div className={card}>
                  <span className="font-bold text-sky-400">Responsabilidades</span>
                  <ul className="space-y-1 text-slate-300">
                    {offer.responsibilities.map((r, i) => <li key={i}>▸ {r}</li>)}
                  </ul>
                </div>
              </div>

              {match && (
                <div className={card}>
                  <span className="font-bold text-white">Encaje con tu perfil</span>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchingSkills.map((k, i) => <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">✓ {k}</span>)}
                    {match.missingSkills.map((k, i) => <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">△ {k}</span>)}
                  </div>
                  {match.pendingVerificationRequirements.length > 0 && (
                    <p className="text-amber-300/90">Requisitos por verificar manualmente: {match.pendingVerificationRequirements.join('; ')}</p>
                  )}
                </div>
              )}

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-300 truncate mr-3">{offer.url}</span>
                <a href={offer.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center space-x-1.5 shrink-0">
                  <span>Abrir vacante</span><ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <Nav next={2} nextLabel="Paso 2: Decisor & Foco Táctico" onStep={setActiveStep} />
            </div>
          )}

          {/* PASO 2: CONSEJO WINGMAN */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setEditingLead(v => !v)}
                  className="px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-semibold rounded-lg border border-sky-500/40 cursor-pointer"
                >
                  {editingLead ? 'Cerrar formulario' : '✎ Cargar / editar supervisor y proyecto'}
                </button>
              </div>
              {editingLead && (
                <WingmanEditor
                  offer={offer}
                  dossier={dossier}
                  onSaved={() => { setEditingLead(false); setDossierVersion(v => v + 1); }}
                  onCancel={() => setEditingLead(false)}
                />
              )}
              <div className={card}>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-sky-400" />
                  <span>Paso 2: Decisor & Foco Táctico — supervisor e instituto</span>
                </h4>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <UserCheck className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-white text-sm">{leadFull}</div>
                    <div className="text-sky-300">{lead.role}</div>
                    <div className="text-slate-400">{lead.institution}</div>
                    {lead.email && <a href={`mailto:${lead.email}`} className="text-sky-400 hover:underline font-mono">{lead.email}</a>}
                  </div>
                </div>
                {lead.researchFocus && lead.researchFocus.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-300">Líneas científicas:</span>
                    <ul className="mt-1 space-y-0.5 text-slate-300">{lead.researchFocus.map((r, i) => <li key={i}>▸ {r}</li>)}</ul>
                  </div>
                )}
                {lead.styleNotes && <p className="text-slate-400"><strong className="text-slate-300">Estilo / qué valora:</strong> {lead.styleNotes}</p>}
              </div>

              <div className={card}>
                <span className="font-bold text-amber-400 flex items-center gap-1.5"><AlertCircle className="h-4 w-4" />Dolores y retos del proyecto</span>
                <ul className="space-y-1.5">
                  {dossier.projectPainPoints.map((p, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-amber-200/90">{p}</li>
                  ))}
                </ul>
              </div>

              <div className={card}>
                <span className="font-bold text-emerald-400 flex items-center gap-1.5"><Lightbulb className="h-4 w-4" />Tu ángulo (hooks)</span>
                <p className="italic text-slate-300 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40">"{dossier.candidateValueThesis}"</p>
                <ul className="space-y-1.5">
                  {dossier.technicalHooks.map((h, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"><strong className="text-emerald-400">#{i + 1}</strong> {h}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={card}>
                  <span className="font-bold text-sky-400">→ Para el CV (paso 4)</span>
                  <ul className="space-y-1 text-slate-300">{dossier.cvGuidance.map((g, i) => <li key={i}>▸ {g}</li>)}</ul>
                </div>
                <div className={card}>
                  <span className="font-bold text-sky-400">→ Para la carta (paso 5)</span>
                  <ul className="space-y-1 text-slate-300">{dossier.coverLetterAngles.map((g, i) => <li key={i}>▸ {g}</li>)}</ul>
                </div>
              </div>
              <Nav prev={1} next={3} nextLabel="Paso 3: Documentos Requeridos" onStep={setActiveStep} />
            </div>
          )}

          {/* PASO 3: NUEVO NIVEL - DOCUMENTOS REQUERIDOS & ANEXOS */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <FolderCheck className="h-4 w-4 text-emerald-400" />
                      <span>Paso 3: Auditoría y Checklist de Documentos Requeridos</span>
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Verificación de anexos exigidos para la postulación ante <strong className="text-white">{offer.company}</strong>. Haz clic en el estado para actualizar.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-emerald-400">
                      {readyDocsCount} de {docItems.length} Listos
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {docItems.map(doc => {
                    const statusConfig = {
                      ready: { label: '✓ Listo', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' },
                      in_progress: { label: '⏳ En preparación', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
                      pending: { label: '⚠️ Pendiente', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/40' }
                    }[doc.status];

                    return (
                      <div
                        key={doc.id}
                        className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <FileCheck className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                            <span className="font-bold text-white text-xs">{doc.name}</span>
                          </div>
                          <p className="text-slate-400 text-[11px] pl-5">{doc.description}</p>
                          <p className="text-sky-300/80 text-[10px] pl-5 italic font-mono">Tip: {doc.tip}</p>
                        </div>

                        <button
                          onClick={() => toggleDocStatus(doc.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition cursor-pointer shrink-0 self-start sm:self-center ${statusConfig.bg}`}
                          title="Haz clic para alternar: Listo -> En preparación -> Pendiente"
                        >
                          {statusConfig.label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-900/40 text-slate-300 text-xs flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-sky-200">Protocolo de Envío Consolidado (DACH / Europa):</strong>
                  <p className="text-[11px] leading-relaxed">
                    La mayoría de institutos públicos alemanes (como Thünen o UBA) y portales de contratación exigen un <strong>único archivo PDF continuo</strong> (&lt; 10 MB) ordenado estratégicamente: 
                    1) Carta de motivación, 2) CV cronológico A4, 3) Diplomas universitarios, 4) Transcript of Records, 5) Cartas de recomendación y certificados complementarios.
                  </p>
                </div>
              </div>

              <Nav prev={2} next={4} nextLabel="Paso 4: Preparar CV" onStep={setActiveStep} />
            </div>
          )}

          {/* PASO 4: CV */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 space-y-1">
                <span className="font-bold text-sky-300 flex items-center gap-1.5"><Target className="h-4 w-4" />Guía de Calibración para el CV de {leadFull}</span>
                <ul className="text-slate-300 space-y-0.5">{dossier.cvGuidance.map((g, i) => <li key={i}>▸ {g}</li>)}</ul>
              </div>
              <div className={card}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span>Paso 4: Preparación del CV (datos verificados del Portafolio)</span>
                  </h4>
                  <LangToggle value={cvLang} onChange={setCvLang} options={[{ v: 'es', l: '🇪🇸 ES' }, { v: 'en', l: '🇬🇧 EN' }]} />
                </div>
                <div className="flex items-center justify-end gap-2">
                  {onOpenStudio && (
                    <button
                      onClick={() => { onOpenStudio(offer.id, 'cv'); onClose(); }}
                      className="px-3 py-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-semibold rounded-lg flex items-center space-x-1.5 border border-sky-500/40 cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /><span>Afinar en CV Studio A4</span>
                    </button>
                  )}
                  <CopyBtn k="cv" text={cvText} label="Copiar CV" copiedKey={copied} onCopy={copy} />
                </div>

                {/* Dual-Lens Scorecard Indicator para CV */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-1.5 text-sky-400">
                      <FileCheck className="h-4 w-4" />
                      <span>Filtro Headhunter: <strong className="text-white">{cvDualReport.headhunter.score}%</strong></span>
                    </div>
                    <span className="text-slate-600 hidden sm:inline">|</span>
                    <div className="flex items-center space-x-1.5 text-purple-400">
                      <Bot className="h-4 w-4" />
                      <span>Wingman PI: <strong className="text-white">{cvDualReport.wingman.score}%</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      {cvDualReport.wingman.competitiveAsymmetry.asymmetryRating === 'dominant' 
                        ? '⚡ Asimetría Cuantitativa Dominante' 
                        : '⚖️ Perfil Equilibrado'}
                    </span>
                    {onOpenStudio && (
                      <button
                        onClick={() => { onOpenStudio(offer.id, 'cv'); onClose(); }}
                        className="text-[10px] text-sky-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Auditoría Completa</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <textarea value={cvText} readOnly rows={10} className={textareaCls} />
              </div>
              <Nav prev={3} next={5} nextLabel="Paso 5: Carta" onStep={setActiveStep} />
            </div>
          )}

          {/* PASO 5: CARTA */}
          {activeStep === 5 && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 space-y-1">
                <span className="font-bold text-sky-300 flex items-center gap-1.5"><Target className="h-4 w-4" />Ángulos Tácticos para la carta</span>
                <ul className="text-slate-300 space-y-0.5">{dossier.coverLetterAngles.map((g, i) => <li key={i}>▸ {g}</li>)}</ul>
              </div>
              <div className={card}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-400" />
                    <span>Paso 5: Carta de presentación (Versión Académica Completa)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <LangToggle value={letterLang} onChange={setLetterLang} options={[{ v: 'de', l: '🇩🇪 DE' }, { v: 'en', l: '🇬🇧 EN' }, { v: 'es', l: '🇪🇸 ES' }]} />
                    {onOpenStudio && (
                      <button
                        onClick={() => { onOpenStudio(offer.id, 'cover_letter'); onClose(); }}
                        className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold rounded-lg flex items-center space-x-1.5 border border-purple-500/40 cursor-pointer"
                        title="Abrir en Cover Letter Studio (A4 / DIN 5008)"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /><span>Afinar en Carta Studio</span>
                      </button>
                    )}
                    <CopyBtn k="letter" text={activeCoverLetterMarkdown} label="Copiar carta" copiedKey={copied} onCopy={copy} />
                  </div>
                </div>

                {/* Barra de Generación con Gemini */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-white">Redactor IA Táctico (Google Gemini)</span>
                      <p className="text-[10px] text-slate-400">
                        Genera una versión final libre de clichés, anclada 100% en tus hechos de CAU Kiel y FCFM.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {customGeminiLetter && (
                      <button
                        onClick={() => setCustomGeminiLetter(null)}
                        className="text-[10px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                      >
                        Restablecer borrador base
                      </button>
                    )}
                    <button
                      onClick={handleGenerateGeminiLetter}
                      disabled={isGeneratingGemini}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingGemini ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Consultando Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{customGeminiLetter ? 'Regenerar con Gemini' : 'Redactar con Gemini'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {geminiError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
                    <span>⚠️ {geminiError}</span>
                  </div>
                )}

                {/* Dual-Lens Scorecard Indicator para Carta */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-1.5 text-sky-400">
                      <FileCheck className="h-4 w-4" />
                      <span>Filtro Headhunter: <strong className="text-white">{letterDualReport.headhunter.score}%</strong></span>
                    </div>
                    <span className="text-slate-600 hidden sm:inline">|</span>
                    <div className="flex items-center space-x-1.5 text-purple-400">
                      <Bot className="h-4 w-4" />
                      <span>Wingman PI: <strong className="text-white">{letterDualReport.wingman.score}%</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      {letterDualReport.wingman.portfolioWeaponActivation.omittedWeapons.length === 0
                        ? '✓ Armas Portafolio 100% Activas'
                        : `⚠️ ${letterDualReport.wingman.portfolioWeaponActivation.omittedWeapons.length} Armas Omitidas`}
                    </span>
                    {onOpenStudio && (
                      <button
                        onClick={() => { onOpenStudio(offer.id, 'cover_letter'); onClose(); }}
                        className="text-[10px] text-purple-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Auditoría Completa</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <textarea value={activeCoverLetterMarkdown} readOnly rows={15} className={textareaCls} />
              </div>
              <Nav prev={4} next={6} nextLabel="Paso 6: Contacto & Formularios" onStep={setActiveStep} />
            </div>
          )}

          {/* PASO 6: CONTACTO + FORMULARIOS */}
          {activeStep === 6 && (
            <div className="space-y-4">
              <div className={card}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-400" />
                    <span>Consulta previa a {leadFull} (opcional)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <LangToggle value={emailLang} onChange={setEmailLang} options={[{ v: 'de', l: '🇩🇪 DE' }, { v: 'en', l: '🇬🇧 EN' }]} />
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold rounded-lg border border-slate-700"
                      >
                        Abrir en correo
                      </a>
                    )}
                    <CopyBtn k="email" text={emailBody} label="Copiar cuerpo" copiedKey={copied} onCopy={copy} />
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono"><strong className="text-slate-400">Asunto:</strong> {emailSubject}</div>
                <textarea value={emailBody} readOnly rows={12} className={textareaCls} />
                <p className="text-slate-400">Una pregunta técnica real, sin pedir nada. Enviar antes del plazo; no se envía nada automáticamente.</p>
              </div>

              <div className={card}>
                <span className="font-bold text-white block">📋 Preguntas de formulario del portal</span>
                {qaPairs.map((qa, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <span>{qa.question}</span>
                      <CopyBtn k={`qa${idx}`} text={qa.recommendedAnswer} label="Copiar" copiedKey={copied} onCopy={copy} />
                    </div>
                    <p className="text-slate-300 text-[11px] font-mono">{qa.recommendedAnswer}</p>
                  </div>
                ))}
              </div>
              <Nav prev={5} next={7} nextLabel="Paso 7: Entrevista" onStep={setActiveStep} />
            </div>
          )}

          {/* PASO 7: ENTREVISTA */}
          {activeStep === 7 && (
            <div className="space-y-4">
              <div className={card}>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                  <span>Paso 7: Preparación de entrevista con {leadFull}</span>
                </h4>
                <div className="space-y-3">
                  {interviewQuestions.map((iq, i) => (
                    <div key={i} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="font-bold text-emerald-400 block">❓ #{i + 1}: {iq.q}</span>
                      <div className="p-2.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px]">💡 {iq.a}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-300">Pipeline completado con éxito</span>
                  </div>
                  <button
                    onClick={() => { onClose(); onStartApplication(offer.id); }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
                  >
                    📋 Registrar en Mis Candidaturas
                  </button>
                </div>
                <p className="text-[11px] text-slate-300">
                  Nada se envía automáticamente a {offer.company}. Los borradores quedan solo en tu ordenador; el envío oficial lo haces tú en el portal.
                </p>
              </div>
              <Nav prev={6} onStep={setActiveStep} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bot,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Scale,
  Zap,
  FileCheck
} from 'lucide-react';
import type { DualLensAuditReport } from '../../services/dualAuditEngine';
import { getSelectableCriteriaFromReport, generateGeminiReviewPrompt } from '../../services/dualAuditEngine';
import type { JobOffer } from '../../types/offers';

interface DualLensAuditHubProps {
  report: DualLensAuditReport;
  offer?: Partial<JobOffer> | null;
  documentText?: string;
  onInjectSnippet?: (snippet: string) => void;
  className?: string;
}

export const DualLensAuditHub: React.FC<DualLensAuditHubProps> = ({
  report,
  offer,
  documentText = '',
  onInjectSnippet,
  className = ''
}) => {
  const [activeLens, setActiveLens] = useState<'both' | 'headhunter' | 'wingman'>('both');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [copiedGeminiPrompt, setCopiedGeminiPrompt] = useState(false);
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [isComplianceExpanded, setIsComplianceExpanded] = useState(true);
  const [isWeaponsExpanded, setIsWeaponsExpanded] = useState(true);

  // Criterios seleccionables para Gemini
  const allCriteria = useMemo(() => getSelectableCriteriaFromReport(report), [report]);

  const [selectedCriteriaIds, setSelectedCriteriaIds] = useState<Set<string>>(() => {
    const alerts = allCriteria.filter((c) => c.status !== 'pass');
    const initial = alerts.length > 0 ? alerts : allCriteria;
    return new Set(initial.map((c) => c.id));
  });

  const toggleCriterion = (id: string) => {
    setSelectedCriteriaIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedCriteriaIds(new Set(allCriteria.map((c) => c.id)));
  };

  const handleSelectAlertsOnly = () => {
    setSelectedCriteriaIds(new Set(allCriteria.filter((c) => c.status !== 'pass').map((c) => c.id)));
  };

  const handleDeselectAll = () => {
    setSelectedCriteriaIds(new Set());
  };

  const previewPrompt = useMemo(() => {
    return generateGeminiReviewPrompt({
      documentType: report.documentType,
      documentText: documentText || (report.documentType === 'cv' ? 'Curriculum Vitae de Daniel Santander' : 'Carta de Motivación de Daniel Santander'),
      offer,
      report,
      selectedCriteriaIds: Array.from(selectedCriteriaIds)
    });
  }, [report, documentText, offer, selectedCriteriaIds]);

  const handleCopyGeminiPrompt = () => {
    navigator.clipboard.writeText(previewPrompt);
    setCopiedGeminiPrompt(true);
    setTimeout(() => setCopiedGeminiPrompt(false), 2200);
  };

  const handleCopySnippet = (id: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
    if (onInjectSnippet) {
      onInjectSnippet(snippet);
    }
  };

  const { headhunter, wingman, overallScore, executiveVerdict, documentType } = report;

  const docTitle = documentType === 'cv' ? 'Curriculum Vitae' : 'Carta de Presentación';

  return (
    <div 
      className={`rounded-2xl border p-4 sm:p-5 space-y-4 shadow-sm backdrop-blur-md transition-colors ${className}`}
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)'
      }}
    >
      {/* Top Banner: Dual Lens Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[var(--panel-border)] pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[var(--text-primary)]">
            <Sparkles className="h-4 w-4 text-sky-500" />
            <span className="uppercase">Auditoría Dual-Lens · {docTitle}</span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-sans">
            Filtro ATS/Headhunter + Empatía técnica Wingman (PI)
          </p>
        </div>

        {/* Global Verdict Score */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <div className="text-right flex items-center gap-2">
            <span className="text-[11px] font-mono text-[var(--text-muted)] uppercase">Score Global:</span>
            <span className={`text-base font-mono font-black ${
              overallScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : overallScore >= 65 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {overallScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Archetype Context Banner (Wingman Reader Psychology & Headhunter Lever) */}
      {report.archetype && (
        <div
          className="p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
          style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
        >
          <div className="flex items-start sm:items-center space-x-3">
            <span className="text-lg shrink-0 p-1.5 rounded-lg bg-[var(--card-bg)] border border-[var(--panel-border)]">
              {report.archetype.icon}
            </span>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="font-mono font-bold text-[var(--text-primary)]">{report.archetype.label}</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  · Lector objetivo: <strong className="text-[var(--text-primary)]">{report.archetype.targetReader.roleTitle}</strong>
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                <strong>Wingman:</strong> {report.archetype.targetReader.psychology}
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                <strong>Headhunter:</strong> {report.archetype.headhunterGuidance.outlierLever}
              </p>
            </div>
          </div>

          <div className="md:text-right shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--panel-border)] font-mono text-[11px]">
            <span className="text-[10px] text-[var(--text-muted)] block uppercase">Extensión recomendada:</span>
            <span className="font-bold text-[var(--text-primary)]">
              {report.archetype.wingmanGuidance.targetWordCount.min} - {report.archetype.wingmanGuidance.targetWordCount.max} palabras
            </span>
            <span className="text-[10px] text-[var(--text-muted)] block">
              (~{report.archetype.wingmanGuidance.targetWordCount.ideal} ideal)
            </span>
          </div>
        </div>
      )}

      {/* Dual Scorecards: Side-by-Side Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
        
        {/* Card 1: Headhunter Lens */}
        <div 
          className="p-3.5 rounded-xl border relative"
          style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[var(--panel-border)]">
            <div className="flex items-center space-x-2 font-bold text-[var(--text-primary)]">
              <FileCheck className="h-4 w-4 text-sky-500" />
              <span>LENTE HEADHUNTER</span>
            </div>
            <span className={`text-[11px] font-mono font-bold ${
              headhunter.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {headhunter.score}/100
            </span>
          </div>

          <div className="pt-2 space-y-1.5 text-[11px] font-sans">
            <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)]">
              <span>Filtro ATS & Burocracia:</span>
              <span className={headhunter.passed ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
                {headhunter.passed ? '✓ Cumplido' : '⚠️ Ajustes Requeridos'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
              <span>Keywords ATS:</span>
              <span>{headhunter.atsKeywordsFound.length} cubiertas / {headhunter.missingRequiredKeywords.length} faltantes</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
              <span>Métricas con impacto:</span>
              <span>{headhunter.readabilityMetrics.quantifiedMetricsCount} detectadas</span>
            </div>
          </div>
        </div>

        {/* Card 2: Wingman Lens */}
        <div 
          className="p-3.5 rounded-xl border relative"
          style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[var(--panel-border)]">
            <div className="flex items-center space-x-2 font-bold text-[var(--text-primary)]">
              <Bot className="h-4 w-4 text-sky-500" />
              <span>LENTE WINGMAN (PI)</span>
            </div>
            <span className={`text-[11px] font-mono font-bold ${
              wingman.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {wingman.score}/100
            </span>
          </div>

          <div className="pt-2 space-y-1.5 text-[11px] font-sans">
            <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)]">
              <span>Asimetría Competitiva:</span>
              <span className={
                wingman.competitiveAsymmetry.asymmetryRating === 'dominant' 
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                  : wingman.competitiveAsymmetry.asymmetryRating === 'balanced' 
                  ? 'text-[var(--text-primary)] font-bold' 
                  : 'text-amber-600 dark:text-amber-400 font-bold'
              }>
                {wingman.competitiveAsymmetry.asymmetryRating === 'dominant' 
                  ? '⚡ Dominante' 
                  : wingman.competitiveAsymmetry.asymmetryRating === 'balanced' 
                  ? '⚖️ Equilibrado' 
                  : '⚠️ Riesgo Genérico'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
              <span>Cero-Servilismo:</span>
              <span>{wingman.zeroServilityAudit.servilityScore}/100 ({wingman.zeroServilityAudit.clicheCount} clichés)</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
              <span>Armas del Portafolio:</span>
              <span>{wingman.portfolioWeaponActivation.activeWeapons.length} activas / {wingman.portfolioWeaponActivation.omittedWeapons.length} omitidas</span>
            </div>
          </div>
        </div>

      </div>

      {/* Executive Verdict Box */}
      <div 
        className="p-3 rounded-xl border text-xs font-mono leading-relaxed flex items-start gap-2.5"
        style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
      >
        <Scale className="h-4 w-4 shrink-0 mt-0.5 text-sky-500" />
        <div>
          <strong className="block uppercase text-[10px] tracking-wider mb-0.5 text-[var(--text-muted)]">Veredicto Estratégico Ejecutivo:</strong>
          <span className="font-sans text-[11.5px] leading-snug text-[var(--text-primary)]">{executiveVerdict}</span>
        </div>
      </div>

      {/* Exportador de Auditoría para Gemini API con Criterios Marcados */}
      <div 
        className="p-3.5 rounded-xl border space-y-2.5"
        style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-[var(--text-secondary)]">
              <Sparkles className="h-4 w-4 text-sky-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase text-[var(--text-primary)]">
                  Auditoría con Gemini API
                </span>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  ({selectedCriteriaIds.size} de {allCriteria.length} marcados)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                Marca abajo los criterios que deseas fiscalizar y genera el prompt optimizado para que Gemini dictamine mejoras.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2 py-1 rounded text-[10px] font-mono border border-[var(--panel-border)] hover:bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              title="Marcar todos los criterios para Gemini"
            >
              Todos
            </button>
            <button
              type="button"
              onClick={handleSelectAlertsOnly}
              className="px-2 py-1 rounded text-[10px] font-mono border border-[var(--panel-border)] hover:bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              title="Marcar solo las alertas y pendientes"
            >
              Solo alertas
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="px-2 py-1 rounded text-[10px] font-mono border border-[var(--panel-border)] hover:bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              title="Desmarcar todos"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={handleCopyGeminiPrompt}
              disabled={selectedCriteriaIds.size === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 font-mono text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer transition disabled:opacity-50"
              title="Copiar prompt para Gemini con los criterios marcados"
            >
              {copiedGeminiPrompt ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedGeminiPrompt ? '¡Prompt Copiado!' : 'Copiar Prompt para Gemini'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPromptPreview((prev) => !prev)}
              className="px-2 py-1.5 rounded-lg border border-[var(--panel-border)] hover:bg-[var(--card-bg)] text-[10px] font-mono text-[var(--text-secondary)] cursor-pointer"
              title="Previsualizar el prompt que recibirá Gemini"
            >
              {showPromptPreview ? 'Ocultar' : 'Previsualizar'}
            </button>
          </div>
        </div>

        {showPromptPreview && (
          <div className="space-y-1.5 pt-2 border-t border-[var(--panel-border)]">
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
              <span>Vista previa del prompt generado para Gemini API:</span>
              <span>{previewPrompt.length} caracteres</span>
            </div>
            <textarea
              readOnly
              rows={7}
              value={previewPrompt}
              className="w-full p-2.5 rounded-lg text-[10.5px] font-mono bg-black/20 border border-[var(--panel-border)] text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center space-x-1 border-b border-[var(--panel-border)] pb-2 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => setActiveLens('both')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 ${
            activeLens === 'both'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Visión Dual
        </button>
        <button
          onClick={() => setActiveLens('headhunter')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 flex items-center space-x-1 ${
            activeLens === 'headhunter'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FileCheck className="h-3.5 w-3.5" />
          <span>Filtro Headhunter ({headhunter.score}%)</span>
        </button>
        <button
          onClick={() => setActiveLens('wingman')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 flex items-center space-x-1 ${
            activeLens === 'wingman'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Bot className="h-3.5 w-3.5" />
          <span>Auditor Wingman ({wingman.score}%)</span>
        </button>
      </div>

      {/* LENS CONTENT SECTION */}
      <div className="space-y-4">
        
        {/* SECTION 1: HEADHUNTER CRITERIA DETAIL */}
        {(activeLens === 'both' || activeLens === 'headhunter') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-1.5">
              <span className="font-mono font-bold text-xs uppercase flex items-center gap-1.5 text-[var(--text-primary)]">
                <FileCheck className="h-4 w-4 text-sky-500" />
                <span>Auditoría de Headhunter / ATS & Requisitos Mandatorios</span>
              </span>
              <button
                type="button"
                onClick={() => setIsComplianceExpanded(prev => !prev)}
                className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
              >
                <span>{isComplianceExpanded ? 'Ocultar' : 'Ver'} Checklist ({headhunter.complianceChecks.length})</span>
                {isComplianceExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            {/* ATS Keywords Chips */}
            <div className="p-3 rounded-xl border space-y-2 text-xs" style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[var(--text-muted)] uppercase">Rastreo de Palabras Clave ATS:</span>
                <span className="text-[var(--text-secondary)] font-bold">
                  {headhunter.atsKeywordsFound.length} de {headhunter.atsKeywordsFound.length + headhunter.missingRequiredKeywords.length} cubiertas
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {headhunter.atsKeywordsFound.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] font-mono text-[10px] border border-[var(--panel-border)] flex items-center gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                    <span>{kw}</span>
                  </span>
                ))}
                {headhunter.missingRequiredKeywords.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-300 font-mono text-[10px] border border-amber-500/30 flex items-center gap-1">
                    <AlertTriangle className="h-2.5 w-2.5 text-amber-500" />
                    <span>Falta: {kw}</span>
                  </span>
                ))}
              </div>

              {headhunter.missingRequiredKeywords.length > 0 && (
                <div className="pt-2 border-t border-[var(--panel-border)]">
                  <label className="flex items-center gap-2 cursor-pointer text-[10.5px] font-mono text-amber-600 dark:text-amber-300">
                    <input
                      type="checkbox"
                      checked={selectedCriteriaIds.has('hh-missing-keywords')}
                      onChange={() => toggleCriterion('hh-missing-keywords')}
                      className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <span>Marcar palabras clave ausentes ({headhunter.missingRequiredKeywords.length}) para que Gemini las integre</span>
                  </label>
                </div>
              )}
            </div>

            {/* Compliance Checks List */}
            {isComplianceExpanded && (
              <div className="space-y-2">
                {headhunter.complianceChecks.map((check) => (
                  <div
                    key={check.id}
                    className="p-3 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] text-xs space-y-1.5 transition hover:border-[var(--card-border)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedCriteriaIds.has(check.id)}
                          onChange={() => toggleCriterion(check.id)}
                          className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer shrink-0"
                          title="Marcar este criterio para fiscalizar con Gemini"
                        />
                        <span className="font-bold flex items-center gap-1.5 font-sans text-[var(--text-primary)] truncate">
                          {check.status === 'pass' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                          {check.status === 'warning' && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                          {check.status === 'fail' && <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />}
                          <span className="truncate">{check.label}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-mono font-bold uppercase ${
                          check.status === 'pass'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : check.status === 'warning'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {check.status === 'pass' ? '✓ Cumplido' : check.status === 'warning' ? 'Revisar' : 'Fallo'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)] pl-5 font-sans leading-relaxed">
                      {check.detail}
                    </p>

                    {check.fixRecommendation && (
                      <div className="ml-5 mt-1 p-2 rounded-lg bg-black/5 dark:bg-black/20 border border-[var(--panel-border)] text-[10.5px] font-mono text-[var(--text-muted)] space-y-0.5">
                        <strong className="text-amber-600 dark:text-amber-400 block">💡 Sugerencia de corrección:</strong>
                        <span>{check.fixRecommendation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: WINGMAN CRITERIA DETAIL */}
        {(activeLens === 'both' || activeLens === 'wingman') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-1.5">
              <span className="font-mono font-bold text-xs uppercase flex items-center gap-1.5 text-[var(--text-primary)]">
                <Bot className="h-4 w-4 text-sky-500" />
                <span>Auditoría de Wingman: PI Match, Asimetría & Armas Omitidas</span>
              </span>
              <button
                type="button"
                onClick={() => setIsWeaponsExpanded(prev => !prev)}
                className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 cursor-pointer"
              >
                <span>{isWeaponsExpanded ? 'Ocultar' : 'Ver'} Armas ({wingman.portfolioWeaponActivation.omittedWeapons.length} omitidas)</span>
                {isWeaponsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>

            {/* Asymmetry Box */}
            <div className={`p-3.5 rounded-xl border space-y-2 text-xs transition ${
              selectedCriteriaIds.has('wm-asymmetry') ? 'ring-1 ring-sky-500/30' : ''
            }`} style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCriteriaIds.has('wm-asymmetry')}
                    onChange={() => toggleCriterion('wm-asymmetry')}
                    className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                    title="Marcar asimetría física para evaluar con Gemini"
                  />
                  <div className="flex items-center space-x-1.5 font-bold font-mono text-[var(--text-primary)]">
                    <Zap className="h-3.5 w-3.5 text-sky-500" />
                    <span>ASIMETRÍA COMPETITIVA (GEOFÍSICO VS. AGRÓNOMO GENÉRICO)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className={`text-[10px] font-mono font-bold uppercase ${
                    wingman.competitiveAsymmetry.asymmetryRating === 'dominant'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {wingman.competitiveAsymmetry.asymmetryRating}
                  </span>
                </div>
              </div>
              <p className="text-[11.5px] text-[var(--text-secondary)] font-sans leading-relaxed">
                {wingman.competitiveAsymmetry.advice}
              </p>
              {wingman.competitiveAsymmetry.detectedEdgeKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] mr-1">Términos de rigor físico detectados:</span>
                  {wingman.competitiveAsymmetry.detectedEdgeKeywords.map((kw, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] font-mono text-[9.5px] border border-[var(--panel-border)]">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Zero-Servility Box */}
            <div className={`p-3 rounded-xl border text-xs space-y-1.5 transition ${
              selectedCriteriaIds.has('wm-zero-servility') ? 'ring-1 ring-sky-500/30' : ''
            }`} style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--card-border)' }}>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCriteriaIds.has('wm-zero-servility')}
                    onChange={() => toggleCriterion('wm-zero-servility')}
                    className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                    title="Marcar tono paritario y cero clichés para auditar con Gemini"
                  />
                  <span className="font-bold text-[var(--text-primary)]">ESTÁNDAR CERO-SERVILISMO (PEER-LEVEL TONE)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className={`font-bold ${wingman.zeroServilityAudit.servilityScore === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {wingman.zeroServilityAudit.servilityScore}/100
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                {wingman.zeroServilityAudit.critique}
              </p>
            </div>

            {/* STRESS-TEST: DESARME DE OBJECIÓN OCULTA */}
            {wingman.stressTest && (
              <div 
                className={`p-3.5 rounded-xl border space-y-2 text-xs transition ${
                  selectedCriteriaIds.has('wm-stress-test') ? 'ring-1 ring-sky-500/30' : ''
                }`}
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--card-border)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCriteriaIds.has('wm-stress-test')}
                      onChange={() => toggleCriterion('wm-stress-test')}
                      className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                      title="Fiscalizar desarme de objeción con Gemini"
                    />
                    <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <span>STRESS-TEST: OBJECIÓN OCULTA DEL EVALUADOR</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] font-mono font-bold uppercase ${
                      wingman.stressTest.isDisarmedInText
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {wingman.stressTest.isDisarmedInText ? '✓ Neutralizada' : '⚠️ Pendiente'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/5 dark:bg-black/20 border border-[var(--panel-border)] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase block">
                    Duda escéptica de {report.archetype?.targetReader.roleTitle || 'el evaluador'}:
                  </span>
                  <p className="text-[11px] text-[var(--text-secondary)] font-sans italic">
                    «{wingman.stressTest.hiddenObjection}»
                  </p>
                </div>

                <div className="space-y-1 pt-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold">
                      💡 Frase de desarme recomendada:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleCopySnippet('stress-disarm', wingman.stressTest.suggestedDisarm);
                        onInjectSnippet?.(wingman.stressTest.suggestedDisarm);
                      }}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 rounded text-[10px] font-mono font-medium flex items-center space-x-1 cursor-pointer transition shadow-xs"
                    >
                      {copiedSnippetId === 'stress-disarm' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedSnippetId === 'stress-disarm' ? '¡Inyectado!' : 'Inyectar Frase'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-primary)] font-mono bg-black/5 dark:bg-white/5 p-2 rounded-lg border border-[var(--panel-border)] leading-relaxed">
                    «{wingman.stressTest.suggestedDisarm}»
                  </p>
                </div>
              </div>
            )}

            {/* HOOK DE CONVERSIÓN: CIERRE TÁCTICO A ENTREVISTA */}
            {wingman.tacticalClosing && (
              <div 
                className={`p-3.5 rounded-xl border space-y-2 text-xs transition ${
                  selectedCriteriaIds.has('wm-tactical-closing') ? 'ring-1 ring-sky-500/30' : ''
                }`}
                style={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--card-border)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCriteriaIds.has('wm-tactical-closing')}
                      onChange={() => toggleCriterion('wm-tactical-closing')}
                      className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                      title="Fiscalizar cierre táctico con Gemini"
                    />
                    <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-sky-500" />
                      <span>GANCHO DE CONVERSIÓN: CIERRE TÁCTICO A ENTREVISTA</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] font-mono font-bold uppercase ${
                      wingman.tacticalClosing.hasTacticalClosing
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {wingman.tacticalClosing.hasTacticalClosing ? '✓ Activo' : '⚠️ Pendiente'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                  Sustituye despedidas pasivas ("quedo a su disposición") por una propuesta técnica concreta para abrir diálogo:
                </p>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] font-medium">
                      Tema propuesto: {wingman.tacticalClosing.proposedDiscussion}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleCopySnippet('tactical-closing', wingman.tacticalClosing.snippetTemplate);
                        onInjectSnippet?.(wingman.tacticalClosing.snippetTemplate);
                      }}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 rounded text-[10px] font-mono font-medium flex items-center space-x-1 cursor-pointer transition shadow-xs"
                    >
                      {copiedSnippetId === 'tactical-closing' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedSnippetId === 'tactical-closing' ? '¡Inyectado!' : 'Inyectar Cierre'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-primary)] font-mono bg-black/5 dark:bg-white/5 p-2 rounded-lg border border-[var(--panel-border)] leading-relaxed italic">
                    «{wingman.tacticalClosing.snippetTemplate}»
                  </p>
                </div>
              </div>
            )}

            {/* Portfolio Weapons: Active vs. Omitted */}
            {isWeaponsExpanded && (
              <div className="space-y-2.5">
                <span className="text-[10.5px] font-mono text-[var(--text-muted)] uppercase block">
                  Activos del Portafolio para esta Convocatoria:
                </span>

                {/* Active Weapons */}
                {wingman.portfolioWeaponActivation.activeWeapons.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                      ✓ Armas activadas ({wingman.portfolioWeaponActivation.activeWeapons.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {wingman.portfolioWeaponActivation.activeWeapons.map((w) => (
                        <span key={w.id} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] border border-[var(--panel-border)] text-[10px] font-mono flex items-center gap-1">
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span>{w.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Omitted Weapons Alert */}
                {wingman.portfolioWeaponActivation.omittedWeapons.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10.5px] font-mono text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Armas recomendadas omitidas ({wingman.portfolioWeaponActivation.omittedWeapons.length}):</span>
                    </span>

                    <div className="space-y-2">
                      {wingman.portfolioWeaponActivation.omittedWeapons.map((w) => (
                        <div
                          key={w.id}
                          className={`p-3 rounded-xl border transition space-y-2 text-xs border-[var(--panel-border)] bg-[var(--panel-bg)] ${
                            selectedCriteriaIds.has(`wm-omitted-${w.id}`)
                              ? 'ring-1 ring-sky-500/30'
                              : ''
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedCriteriaIds.has(`wm-omitted-${w.id}`)}
                                onChange={() => toggleCriterion(`wm-omitted-${w.id}`)}
                                className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                                title="Marcar esta arma para que Gemini la integre en la redacción"
                              />
                              <span className="font-bold text-[var(--text-primary)] font-sans text-xs">
                                {w.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopySnippet(w.id, w.suggestedInjection)}
                                className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 rounded-lg text-[10px] font-mono font-medium flex items-center space-x-1 cursor-pointer transition shrink-0 self-start sm:self-center shadow-xs"
                              >
                                {copiedSnippetId === w.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                <span>{copiedSnippetId === w.id ? '¡Copiado!' : 'Copiar'}</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-[11px] text-[var(--text-secondary)] font-sans">
                            <strong className="text-[var(--text-primary)]">Por qué incluirlo: </strong>
                            {w.reasonToInclude}
                          </p>

                          <div className="p-2 rounded-lg bg-black/5 dark:bg-black/20 border border-[var(--panel-border)] font-mono text-[10.5px] text-[var(--text-muted)] italic">
                            «{w.suggestedInjection}»
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] text-xs text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Todas las armas relevantes del portafolio están activadas.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

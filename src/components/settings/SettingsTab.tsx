import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Cpu, 
  CheckCircle2, 
  ChevronLeft,
  Mail,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { EmailAlertsPipelineSection } from './EmailAlertsPipelineSection';
import { 
  getStoredSettings, 
  saveStoredSettings, 
  exportFullBackup, 
  importFullBackup, 
  resetDatabase
} from '../../services/db';
import type { AppSettings } from '../../services/db';

interface SettingsTabProps {
  onRefreshData: () => void;
  onReturnToHub?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onRefreshData, onReturnToHub }) => {
  const [activeHQSection, setActiveHQSection] = useState<'general' | 'email_pipeline'>('general');
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveSettings = () => {
    saveStoredSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportJson = () => {
    const jsonStr = exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `headhunter_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const success = importFullBackup(text);
      if (success) {
        setImportStatus('¡Copia de seguridad importada con éxito!');
        onRefreshData();
      } else {
        setImportStatus('Error al importar la copia de seguridad. Comprueba el formato JSON.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('¿Seguro que deseas restaurar la base de datos a los valores base?')) {
      resetDatabase();
      onRefreshData();
      setImportStatus('Base de datos restaurada correctamente.');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn text-slate-100">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-2xl bg-[#0a0f1d]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          {onReturnToHub && (
            <button
              onClick={onReturnToHub}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500 transition flex items-center gap-1.5 cursor-pointer shadow"
              title="Volver al Expediente y Perfil"
            >
              <ChevronLeft className="h-4 w-4 text-cyan-400" />
              <span>« VOLVER AL PERFIL</span>
            </button>
          )}

          <div className="h-9 w-9 rounded-xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <Sliders className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-white flex items-center gap-2 font-mono uppercase tracking-tight">
                HQ // AJUSTES & PREFERENCIAS DEL SISTEMA
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-600 font-extrabold hidden sm:inline-block">
                ALMACENAMIENTO LOCAL
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">
              Configuración de privacidad, proveedor de modelo local y alertas.
            </p>
          </div>
        </div>

        {/* Section Switcher & Save Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveHQSection('general')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeHQSection === 'general'
                  ? 'bg-cyan-600 text-white shadow font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>GENERAL & PREFERENCIAS</span>
            </button>

            <button
              onClick={() => setActiveHQSection('email_pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeHQSection === 'email_pipeline'
                  ? 'bg-cyan-600 text-white shadow font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              <span>ALERTAS EMAIL</span>
            </button>
          </div>

          <button
            onClick={handleSaveSettings}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs rounded-xl border border-slate-600 shadow transition flex items-center space-x-1.5 cursor-pointer shrink-0"
            title="Guardar cambios de configuración"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>GUARDADO</span>
              </>
            ) : (
              <span>GUARDAR AJUSTES</span>
            )}
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {importStatus && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Section 1: General Preferences & Local Storage */}
      {activeHQSection === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Assistant Provider */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-bold text-sm text-white font-mono uppercase">
                    Proveedor de Asistencia de Redacción
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Modo Local / Determinista
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-cyan-300">Garantía de Privacidad & Operación Sin Dependencias:</p>
                <p className="text-slate-400 leading-relaxed">
                  Headhunter OS ensambla CVs cuantitativos (A4) y cartas de motivación directamente en tu navegador a partir de hechos y datos de tu portafolio, sin requerir llamadas obligatorias a servicios externos de pago. Los siguientes campos permiten conectar opcionalmente modelos externos en próximas actualizaciones.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Proveedor LLM</label>
                  <select
                    value={settings.llmProvider}
                    onChange={(e) => setSettings({ ...settings, llmProvider: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="Google Gemini">Google Gemini (Recomendado)</option>
                    <option value="OpenAI GPT-4o">OpenAI GPT-4o</option>
                    <option value="Anthropic Claude 3.5">Anthropic Claude 3.5 Sonnet</option>
                    <option value="Local / Ollama">Ollama Local (Offline / Privado)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Modelo Específico</label>
                  <select
                    value={settings.modelName}
                    onChange={(e) => setSettings({ ...settings, modelName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="gemini-3.8-flash">Gemini 3.8 Flash (Recomendado - Razonamiento Rápido & Thinking)</option>
                    <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite (Ultra Rápido)</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview (Análisis Profundo)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Clave API (Opcional, guardada localmente)</label>
                  <input
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    placeholder="••••••••••••••••••••••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    La clave se almacena exclusivamente en tu navegador (localStorage) y nunca sale a servidores intermedios.
                  </p>
                </div>
              </div>
            </div>

            {/* Geographical Preferences */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white font-mono uppercase">
                  Ponderación Geográfica & Cuadrantes
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-mono">Bonus de Prioridad para Euskadi / Bilbao</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={settings.bilbaoPriorityBonus}
                      onChange={(e) => setSettings({ ...settings, bilbaoPriorityBonus: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <span className="font-mono text-emerald-400 font-bold w-12 text-right">
                      +{settings.bilbaoPriorityBonus}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Incrementa la ponderación visual de organizaciones en Bilbao, Bizkaia y el País Vasco.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-[11px] text-slate-300 space-y-1">
                    <div className="font-bold text-white font-mono">Cuadrantes Activos:</div>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                      <li><strong className="text-teal-400">DACH:</strong> Alemania (Bonn, Leipzig, Potsdam, Braunschweig, Berlín, Múnich)</li>
                      <li><strong className="text-emerald-400">Euskadi:</strong> Bilbao, Donostia, Vitoria, Zamudio, Arkaute</li>
                      <li><strong className="text-sky-400">Global & Remoto:</strong> Consorcios europeos y organizaciones internacionales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Data Management (Export / Import JSON) */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white font-mono uppercase">
                  Gestión de Datos Locales & Copias de Seguridad
                </h3>
                <p className="text-xs text-slate-400">
                  Exporta o restaura todos tus datos personales, organizaciones y candidaturas en formato JSON limpio.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleExportJson}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer shadow"
              >
                <Download className="h-4 w-4 text-cyan-400" />
                <span>Exportar Copia JSON</span>
              </button>

              <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer shadow">
                <Upload className="h-4 w-4 text-emerald-400" />
                <span>Importar Copia JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleResetData}
                className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-mono font-bold rounded-xl border border-rose-800/80 transition flex items-center gap-2 cursor-pointer ml-auto"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Restaurar Datos Iniciales</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Email Pipeline Section */}
      {activeHQSection === 'email_pipeline' && (
        <EmailAlertsPipelineSection />
      )}
    </div>
  );
};

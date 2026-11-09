import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Compass, 
  HelpCircle, 
  CheckCircle2, 
  FileText, 
  Radio, 
  UserCheck, 
  Send, 
  Building2 
} from 'lucide-react';

interface TacticalHelpAndProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'protocol' | 'guide' | 'faq';
}

export const TacticalHelpAndProtocolModal: React.FC<TacticalHelpAndProtocolModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'protocol'
}) => {
  const [activeTab, setActiveTab] = useState<'protocol' | 'guide' | 'faq'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans animate-fadeIn">
      <div className="bg-[#0b1220] max-w-3xl w-full rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[90vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0 bg-[#080d19]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-mono font-black text-white text-base tracking-tight uppercase">
                  CENTRO DE MANDO // AYUDA, GUÍA & PROTOCOLO
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">
                  VERIFICADO
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Transparencia anti-alucinaciones, telemetría de visados y manual operativo de las 5 estaciones.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-5 pt-3 border-b border-slate-800 bg-[#0a0f1d] gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('protocol')}
            className={`pb-2.5 px-3 font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'protocol'
                ? 'border-red-500 text-white font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-red-400" />
            <span>1. PROTOCOLO TÁCTICO & VISADO</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'guide'
                ? 'border-red-500 text-white font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-sky-400" />
            <span>2. GUÍA DE LAS 5 ESTACIONES</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-2.5 px-3 font-bold transition flex items-center gap-1.5 cursor-pointer border-b-2 ${
              activeTab === 'faq'
                ? 'border-red-500 text-white font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>3. PREGUNTAS & PRIVACIDAD</span>
          </button>
        </div>

        {/* Body Scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs flex-1 text-slate-200 leading-relaxed">
          
          {/* TAB 1: PROTOCOLO TÁCTICO & VISADOS */}
          {activeTab === 'protocol' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
                <h4 className="font-mono font-bold text-white text-xs uppercase flex items-center gap-1.5 text-red-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Marco Legal de Inmigración & Movilidad Táctica</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-sky-500/30">
                    <div className="text-sky-400 font-bold uppercase">🇩🇪 Alemania: §20 AufenthG</div>
                    <p className="text-slate-300 mt-1">
                      Visado de búsqueda de empleo de 18 meses para graduados de máster en universidades alemanas (CAU Kiel). Permite trabajo sin restricciones y transición inmediata a EU Blue Card.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30">
                    <div className="text-emerald-400 font-bold uppercase">🇪🇸 España: Ley 14/2013 UGE</div>
                    <p className="text-slate-300 mt-1">
                      Autorización de residencia para profesionales altamente cualificados e investigadores en centros I+D vascos (BC3, Tecnalia, Neiker, IDOM). Meta de nacionalidad en 2 años para ciudadanos iberoamericanos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-3">
                <h4 className="font-mono font-bold text-white text-xs uppercase flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Garantías de Transparencia, Cero Alucinaciones & Filtro Anti-IA</span>
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">1.</span>
                    <span><strong>100% Fuentes Reales Verificadas:</strong> Todos los 350+ enlaces provienen de convocatorias reales (Euraxess, StepStone, DAAD, BC3, Tecnalia, IDOM, EPN). Cero ofertas inventadas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">2.</span>
                    <span><strong>Single Source of Truth (CV Studio & Portafolio):</strong> Cada hecho, título universitario (CAU Kiel, AMU Poznań, U. de Chile), proyecto empírico (Wallener Au, informe EPN, testimonio en el Congreso Nacional) y competencia proviene exclusivamente del Portafolio verificado (<code>verifiedCvFacts.ts</code>). Se prohíben datos inventados o no respaldados (cero menciones falsas a LoRaWAN o diatomeas).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">3.</span>
                    <span><strong>Filtro Editorial Anti-IA en Cover Letter Studio:</strong> Las cartas de postulación prohíben clichés genéricos de IA ("thrilled", "delve into", "testament to", "foster", "beacon of", "aligns seamlessly"). Exigen primera persona analítica y traducen la degradación ambiental a balances de masa y metodologías duras (resistividad eléctrica SEV, flujos de GEI por Eddy Covariance, curvas de retención hídrica y modelación en R).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">4.</span>
                    <span><strong>Auto-Ajuste Tipográfico A4 & DIN 5008:</strong> Algoritmo de bisección matemática para CVs de 1 o 2 páginas y maquetación formal DIN 5008 para cartas institucionales de 1 página.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">5.</span>
                    <span><strong>Control Humano 100% & Borradores Asistidos:</strong> Las cartas y adaptaciones son borradores de alta fidelidad que requieren la revisión, personalización y confirmación de Daniel antes de cualquier envío.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: GUÍA DE LAS 5 ESTACIONES */}
          {activeTab === 'guide' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-600/20 text-red-400 shrink-0">
                  <Radio className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-white text-xs uppercase">RADAR // Mercado & Vacantes</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Barrido holográfico con sonar 360° para escanear 350+ vacantes indexadas, clasificar por sector (Alemania, Euskadi, Remoto), filtrar por afinidad técnica y abrir directamente la adaptación en CV Studio o Cover Letter Studio.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 shrink-0">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-white text-xs uppercase">PERFIL // Expediente, Competencias & CV Studio</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Showcase del especialista Daniel Santander, <strong>CV Studio</strong> (A4, 1p/2p, ES/EN) y <strong>Cover Letter Studio</strong> (formato DIN 5008, ES/EN/DE, filtro estricto anti-clichés de IA, editor editable y generador de prompts para LLMs externos).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-600/20 text-red-400 shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-white text-xs uppercase">CONSOLA CENTRAL // Logo EMPLEO MASTER</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Hub central que enlaza estadísticas de carrera, nivel de autorización 50, reputación y acceso directo a cada teatro de operaciones.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-600/20 text-sky-400 shrink-0">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-white text-xs uppercase">CANDIDATURAS // Tablero Kanban & Pipeline Asistido</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Bandeja táctica para gestionar postulaciones activas, generar cartas de motivación sincronizadas con las evidencias del CV, ensayar preguntas de entrevista y dar seguimiento riguroso a cada fase de contratación.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-white text-xs uppercase">HQ // Cuartel General de Fuentes</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Matriz de más de 25 portales oficiales categorizados por país y temática con enlaces directos, vinculación de cuentas reales y copias de seguridad JSON.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAQ & PRIVACIDAD */}
          {activeTab === 'faq' && (
            <div className="space-y-3 font-sans">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-1.5">
                <h4 className="font-bold text-white text-xs">¿Cómo funciona la adaptación del CV en CV Studio?</h4>
                <p className="text-[11px] text-slate-300">
                  CV Studio cruza el texto de la vacante seleccionada contra las etiquetas verificadas de tu Portafolio. Reordena y prioriza las evidencias más relevantes respetando estrictamente los cupos de 1 o 2 páginas y asegurando que tus 3 títulos universitarios (Kiel, Poznań, U. de Chile) e idiomas siempre se incluyan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-1.5">
                <h4 className="font-bold text-white text-xs">¿Por qué las cartas de presentación se generan como borradores?</h4>
                <p className="text-[11px] text-slate-300">
                  Para garantizar autenticidad y cero alucinaciones. La herramienta redacta un borrador sólido anclado en tus evidencias empíricas reales que coinciden con la vacante, dejando secciones claras para que añadas tus motivaciones personales genuinas hacia la organización.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-1.5">
                <h4 className="font-bold text-white text-xs">¿Dónde se guardan mis datos y candidaturas?</h4>
                <p className="text-[11px] text-slate-300">
                  Todos tus datos (perfil, versiones de CV Studio, cartas generadas, candidaturas guardadas y notas) se almacenan 100% de manera local en tu navegador (localStorage). Nada se sube a servidores remotos sin tu consentimiento explícito.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-1.5">
                <h4 className="font-bold text-white text-xs">¿Cómo hago una copia de seguridad?</h4>
                <p className="text-[11px] text-slate-300">
                  En la estación <strong>HQ</strong>, pestaña <em>Backup & Auditoría</em>, puedes descargar en 1 clic un archivo JSON con toda tu base de datos y restaurarlo en cualquier momento o equipo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-1.5">
                <h4 className="font-bold text-white text-xs">¿Cómo se calcula el Match Score?</h4>
                <p className="text-[11px] text-slate-300">
                  Cruza automáticamente las palabras clave de tu expediente (suelos, biogeoquímica, R, Python, GIS, gobernanza, convenios internacionales) con la descripción de la vacante, otorgando bonificación estratégica a Bilbao, Euskadi y Alemania (§20).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#080d19] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-xl shadow transition cursor-pointer"
          >
            Entendido // Cerrar Consola
          </button>
        </div>
      </div>
    </div>
  );
};

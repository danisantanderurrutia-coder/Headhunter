import React, { useState } from 'react';
import { Send, Compass, User, ShieldCheck, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import type { StrategyChatMessage } from '../../types/intelligence';
import { getStoredSettings } from '../../services/db';
import { askStrategyAdvisorGemini } from '../../services/geminiService';

interface TacticalDirective {
  id: string;
  topic: string;
  keywords: string[];
  response: string;
  suggestedFollowUps: string[];
}

const TACTICAL_KNOWLEDGE_BASE: TacticalDirective[] = [
  {
    id: 'outreach',
    topic: 'Abordaje Directo a PIs y Hiring Managers',
    keywords: ['pi', 'supervisor', 'decisor', 'contacto', 'hiring manager', 'correo', 'email', 'abordaje'],
    response: 'Protocolo de Abordaje Directo (Zero-Servility): Contacta al PI o líder técnico con una pregunta científica/técnica legítima antes del cierre oficial de la convocatoria. No pidas empleo directamente; plantea un ángulo técnico relevante (ej. modelado de gases de efecto invernadero, inversión geofísica o calibración de sensores). El objetivo es abrir un diálogo de par a par antes de que el CV caiga en el embudo administrativo.',
    suggestedFollowUps: [
      '¿Cómo estructurar el correo en alemán (Anschreiben corto)?',
      '¿Qué hacer si el PI no responde en 5 días?',
      '¿Cómo evitar clichés serviles en el contacto inicial?'
    ]
  },
  {
    id: 'cv_quantitative',
    topic: 'Optimización de CV Cuantitativo (DACH / Euskadi)',
    keywords: ['cv', 'curriculum', 'ats', 'formato', 'estructura', 'plantilla', 'longitud'],
    response: 'Estándar para Alemania y Centros de I+D: Estructura A4 en una sola columna con espaciado DIN 5008. Todo logro debe incluir métrica verificable (ej. "procesamiento de 12 meses de datos eddy covariance a 10 Hz", "reducción de error RMSE en 18%"). Cita tus herramientas base (R, Python, QGIS, BERT) y tus publicaciones o tesis en CAU Kiel y Universidad de Chile.',
    suggestedFollowUps: [
      '¿Cómo destacar la transdisciplinariedad sin parecer generalista?',
      '¿Qué nivel de alemán incluir en el encabezado?',
      '¿Cómo alinear mi formación dual europea en el CV?'
    ]
  },
  {
    id: 'letter_structure',
    topic: 'Carta Formal (Anschreiben) en 5 Párrafos',
    keywords: ['carta', 'anschreiben', 'motivación', 'presentacion', 'cover letter'],
    response: 'Estructura en 5 Párrafos Rigurosos: 1) Tesis de valor nominal dirigida al PI/equipo. 2) Encaje con el proyecto y diagnóstico de sus cuellos de botella técnicos. 3) Pruebas de competencia técnica verificable (datos, sensores, software). 4) Ventaja transdisciplinaria (física de medios porosos + análisis cuantitativo). 5) Disponibilidad inmediata para discusión técnica y anexos consolidados en un único PDF.',
    suggestedFollowUps: [
      '¿En qué idioma enviar la carta a centros alemanes?',
      '¿Cómo redactar el párrafo de encaje con Thünen o GFZ?',
      '¿Cómo referenciar becas como Walter Benjamin o MSCA?'
    ]
  },
  {
    id: 'followup_cadence',
    topic: 'Cadencia de Seguimiento y Tiempos de Respuesta',
    keywords: ['seguimiento', 'plazo', 'tiempo', 'respuesta', 'cadencia', 'dias', 'follow up'],
    response: 'Regla de los 5 Días Hábiles: Si tras 5-7 días laborables de enviar un contacto directo o postulación formal no hay respuesta, envía un mensaje breve de cortesía aportando un nuevo dato técnico o paper relevante. Nunca preguntes "¿vieron mi CV?", sino "¿tuvieron oportunidad de revisar la consulta metodológica sobre el sensor de humedad/flujo?". Registra la fecha en el Pipeline.',
    suggestedFollowUps: [
      '¿Qué canales alternativos usar si no hay respuesta por email?',
      '¿Cómo registrar el seguimiento en la ficha de candidatura?'
    ]
  },
  {
    id: 'salaries_framework',
    topic: 'Tablas Salariales y Marco Jurídico (TVöD vs Euskadi)',
    keywords: ['salario', 'sueldo', 'tvod', 'convenio', 'contrato', 'retribucion', 'e13', 'e14'],
    response: 'Marco de Referencia Salarial: En Alemania para centros federales (Thünen, UBA, GFZ) rige TVöD Bund / TV-L E13 (aprox. 50.000 € – 54.000 € brutos/año para postdocs/científicos). En Euskadi (Tecnalia, BC3, AZTI), la banda para investigador oscila entre 32.000 € y 45.000 € según convenio I+D. Los ciudadanos chilenos gozan de vía acelerada de nacionalidad española en 2 años bajo el Código Civil y la Ley 14/2013 de Movilidad Internacional.',
    suggestedFollowUps: [
      '¿Cómo negociar el nivel de escalafón (Stufe) en TVöD?',
      '¿Qué ventajas otorga la Ley 14/2013 a profesionales chilenos en España?'
    ]
  },
  {
    id: 'transdisciplinary',
    topic: 'Transdisciplinariedad como Ventaja Diferencial',
    keywords: ['transdisciplinar', 'perfil', 'geofísica', 'agronomia', 'suelos', 'diferencial'],
    response: 'Posicionamiento Competitivo: Frente a perfiles agronómicos tradicionales, tu formación en Geofísica Ambiental (física de transporte en macroporos, ondas, georadar, sensores electromagnéticos) y modelado computacional en R/Python te posiciona como un perfil cuantitativo escaso. No compitas en botánica o química agronómica básica; compite en la modelización biofísica y automatización de flujos de datos.',
    suggestedFollowUps: [
      '¿Cómo proyectar esto en una entrevista técnica?',
      '¿Qué proyectos citar como evidencia principal?'
    ]
  }
];

const initialChatMessages: StrategyChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: '¡Hola Daniel! Bienvenido a la Guía Táctica y Asesor de Conversión de Headhunter OS. Consulta criterios de outbound, abordaje directo a PIs, calibración cuantitativa de CV o cadencias de seguimiento en Alemania (DACH) y Euskadi.',
    timestamp: '09:00',
    suggestedActions: [
      '¿Cómo abordar directamente a un PI sin sonar servil?',
      '¿Cuál es el estándar de CV para institutos en Alemania (TVöD)?',
      '¿Cómo estructurar una carta de motivación (Anschreiben)?',
      '¿Cuál es la cadencia de seguimiento recomendada?'
    ]
  }
];

let chatCounter = 100;
const nextChatId = (prefix: string) => `${prefix}-${++chatCounter}`;

export const StrategyAdvisorChat: React.FC = () => {
  const [messages, setMessages] = useState<StrategyChatMessage[]>(initialChatMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const settings = getStoredSettings();
  const hasGemini = Boolean((settings.apiKey || '').trim());

  const findTacticalResponse = (query: string): TacticalDirective => {
    const qLower = query.toLowerCase();
    for (const directive of TACTICAL_KNOWLEDGE_BASE) {
      if (directive.keywords.some(k => qLower.includes(k))) {
        return directive;
      }
    }
    // Default fallback
    return {
      id: 'general',
      topic: 'Estrategia General de Outbound',
      keywords: [],
      response: 'Criterio Táctico General: Prioriza calidad sobre volumen. Identifica al decisor técnico (PI o director de grupo) en tu cuenta diana, formula un gancho técnico verificable basado en sus proyectos prioritarios y envía el expediente consolidado en un único PDF con control humano estricto.',
      suggestedFollowUps: [
        '¿Cómo abordar directamente a un PI sin sonar servil?',
        '¿Cómo estructurar una carta de motivación (Anschreiben)?',
        '¿Cuál es el estándar de CV para institutos en Alemania (TVöD)?'
      ]
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: StrategyChatMessage = {
      id: nextChatId('msg-u'),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Si tiene configurada la API Key de Gemini, consultamos directamente el modelo inteligente
    if (hasGemini) {
      setIsLoading(true);
      try {
        const historyForGemini = messages.map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          text: m.text
        }));

        const answer = await askStrategyAdvisorGemini(historyForGemini, query);

        const aiMsg: StrategyChatMessage = {
          id: nextChatId('msg-gemini'),
          sender: 'ai',
          text: answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: [
            '¿Cómo redactar el correo inicial al PI con estos puntos?',
            '¿Qué preguntas técnicas me pueden hacer en la entrevista?',
            '¿Cómo estructurar mi experiencia en R y física de suelos?'
          ]
        };

        setMessages(prev => [...prev, aiMsg]);
      } catch (err: any) {
        const errorMsg: StrategyChatMessage = {
          id: nextChatId('msg-err'),
          sender: 'ai',
          text: `⚠️ Error al consultar Gemini API: ${err.message || 'Error de red'}. Se activó la directiva local de respaldo:\n\n${findTacticalResponse(query).response}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Modo local / determinista sin API Key
    const directive = findTacticalResponse(query);
    const aiMsg: StrategyChatMessage = {
      id: nextChatId('msg-tactical'),
      sender: 'ai',
      text: directive.response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: directive.suggestedFollowUps
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 flex flex-col h-[520px] shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm font-mono uppercase">
              Guía Táctica de Conversión // Outbound Advisor
            </h3>
            <p className="text-[11px] text-slate-400">
              Protocolos de abordaje, estándares de CV y retribución en DACH y Euskadi {hasGemini ? '(Motor Gemini IA Activo)' : '(100% Determinista)'}.
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border flex items-center gap-1 ${
          hasGemini
            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        }`}>
          {hasGemini ? <Sparkles className="h-3 w-3" /> : null}
          {hasGemini ? 'Gemini IA' : '✓ Modo Local'}
        </span>
      </div>

      {/* Quick Directives Bar */}
      <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto text-[10.5px] font-mono">
        <span className="text-slate-400 shrink-0 font-bold">Temas Tácticos:</span>
        {TACTICAL_KNOWLEDGE_BASE.map(d => (
          <button
            key={d.id}
            onClick={() => handleSendMessage(d.topic)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 shrink-0 transition cursor-pointer"
          >
            {d.topic}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-sky-400 border border-slate-700'
            }`}>
              {msg.sender === 'user' ? <User className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            </div>

            <div className={`space-y-2 max-w-xl p-3.5 rounded-2xl ${
              msg.sender === 'user'
                ? 'bg-sky-600 text-white rounded-tr-none'
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
            }`}>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                <span>{msg.sender === 'user' ? 'Tú' : 'Protocolo Táctico'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="leading-relaxed text-[12px] whitespace-pre-wrap">{msg.text}</p>

              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-sky-400" />
                    <span>Profundizar en este punto:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="text-[10.5px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-sky-300 border border-sky-500/30 transition cursor-pointer font-sans"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs italic font-mono pl-10">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            <span>Consultando a Gemini con contexto de tu perfil...</span>
          </div>
        )}
      </div>

      {/* Input query form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          placeholder={hasGemini ? "Pregunta a Gemini sobre la oferta, abordaje, TVöD o entrevista..." : "Escribe una pregunta sobre abordaje, CV, carta o salarios..."}
          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl shadow transition cursor-pointer flex items-center space-x-1"
        >
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          <span>{isLoading ? 'Pensando...' : 'Consultar'}</span>
        </button>
      </form>
    </div>
  );
};

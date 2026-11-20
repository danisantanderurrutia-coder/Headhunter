/**
 * PSICOLOGÍA DE LA BÚSQUEDA DE TRABAJO // 7 PILARES WINGMAN + HEADHUNTER
 * Metodología de Alto Nivel: De la súplica al control de marco, coinversión técnica y paridad de estatus.
 */

export interface JobHuntPsychologyPillar {
  id: string;
  num: string;
  name: string;
  role: 'wingman' | 'headhunter' | 'both';
  roleLabel: string;
  tagline: string;
  psychologyInsight: string;
  goldenRule: string;
  riskIfOmitted: string;
  snippets: {
    es: string;
    en: string;
    de: string;
  };
}

export const JOB_HUNT_PSYCHOLOGY_PILLARS: JobHuntPsychologyPillar[] = [
  {
    id: 'mutual_qualification',
    num: '01',
    name: 'Cualificación Mutua & Frame Control',
    role: 'wingman',
    roleLabel: 'Wingman Lens (PI Match)',
    tagline: 'De la súplica a la coinversión: evaluar si el entorno ofrece las condiciones para el alto rendimiento.',
    psychologyInsight:
      'Cuando un candidato postula suplicando, el evaluador siente superioridad y busca motivos de descarte. Cuando el candidato explicita los estándares de autonomía y rigor que necesita para rendir al máximo, el evaluador siente intriga y desea demostrar que su equipo está a la altura.',
    goldenRule: 'Nunca pedir como beneficio personal ("quiero flexibilidad"), sino como condición operativa de alto impacto ("para modelar con rigor, priorizo entornos con X").',
    riskIfOmitted: 'Proyectar desesperación o complacencia indiscriminada (suena a postulante en masa).',
    snippets: {
      es: 'Para desplegar modelos de balance hídrico fiables y reproducibles, priorizo activamente equipos con autonomía analítica, acceso directo a datos de terreno y debate metodológico sin dogmas.',
      en: 'To ensure hydrological and carbon balance models remain strictly grounded in physics, I actively prioritize environments characterized by analytical autonomy, direct access to raw field data, and open methodological debate.',
      de: 'Um physikalisch fundierte und reproduzierbare Wasser- und Kohlenstoffbilanzmodelle zu gewährleisten, bevorzuge ich Arbeitsgruppen mit analytischer Autonomie, direktem Zugang zu Primärdaten und einer offenen wissenschaftlichen Diskussionskultur.'
    }
  },
  {
    id: 'de_risking',
    num: '02',
    name: 'Desarme Preventivo de Riesgo (De-risking / C.Y.A.)',
    role: 'headhunter',
    roleLabel: 'Headhunter Lens (ATS & Legal)',
    tagline: 'Los comités temen equivocarse más de lo que buscan genialidad. Neutralizar miedos ocultos preventivamente.',
    psychologyInsight:
      'Un evaluador piensa: "¿Tendrá permiso de trabajo? ¿Serán válidos sus títulos? ¿Se adaptará?". Si no despejas estas dudas de antemano, descartan la postulación para protegerse de complicaciones administrativas.',
    goldenRule: 'Declarar solvencia legal y académica con naturalidad en la primera página: § 20 AufenthG, "con distinción", homologación Anabin H+ y código reproducible.',
    riskIfOmitted: 'Quedar atrapado en el filtro de sospecha burocrática o descarte por visado.',
    snippets: {
      es: 'Cuento con residencia y habilitación legal inmediata en Alemania (§ 20 AufenthG para investigación) y homologación académica plena (Anabin H+, doble titulación CAU Kiel y AMU Poznań).',
      en: 'Holding legal residency and direct research clearance in Germany (§ 20 AufenthG) alongside full European academic recognition (Anabin H+, double M.Sc. CAU Kiel & AMU Poznań), my onboarding involves zero institutional friction.',
      de: 'Mit einem gültigen Aufenthaltstitel nach § 20 AufenthG (Wissenschaftliche Forschung) sowie voller Anabin H+ Anerkennung (Doppel-M.Sc. CAU Kiel / AMU Poznań) ist eine nahtlose, verwaltungsfreie Einstellung sofort möglich.'
    }
  },
  {
    id: 'pratfall_effect',
    num: '03',
    name: 'Efecto Pratfall (Confesión Estratégica Anti-Vendehumo)',
    role: 'wingman',
    roleLabel: 'Wingman Lens (Honestidad Técnica)',
    tagline: 'Admitir un límite deliberado para hiper-validar el 100% de la fortaleza central.',
    psychologyInsight:
      'Quien dice dominarlo todo despierta el detector de humo del evaluador ("nadie es experto en 20 cosas"). Reconocer con seguridad lo que no haces genera confianza instantánea en todo lo que sí afirmas dominar.',
    goldenRule: 'Descartar voluntariamente tareas genéricas o fuera de tu núcleo para concentrar la autoridad en física cuantitativa de suelos y datos de terreno.',
    riskIfOmitted: 'Parecer un perfil difuso o un "sabelotodo" sin especialización real.',
    snippets: {
      es: 'Mi propuesta de valor no radica en agronomía tradicional de escritorio ni en gestión comercial generalista; mi núcleo y ventaja competitiva se concentran exclusivamente en la física cuantitativa del suelo, curvas de retención hídrica e instrumentación de terreno.',
      en: 'My core technical advantage does not lie in generic desk agronomy or commercial management; rather, it is strictly concentrated in quantitative soil physics, unsaturated flow modeling, and empirical field instrumentation.',
      de: 'Mein technischer Mehrwert liegt nicht in klassischer Schreibtisch-Agronomie, sondern gezielt in der quantitativen Bodenphysik, der Modellierung ungesättigter Flüsse und präziser Feldinstrumentierung.'
    }
  },
  {
    id: 'cognitive_spike',
    num: '04',
    name: 'Ancla Cognitiva Spike (T-Shaped Dominante)',
    role: 'headhunter',
    roleLabel: 'Headhunter Lens (Posicionamiento)',
    tagline: 'Fijar una sola etiqueta memorable en la memoria de trabajo del comité.',
    psychologyInsight:
      'Cuando el comité discute candidatos en el pasillo, solo recordarán una frase corta. Si no defines tú esa frase, ellos te etiquetarán con algo genérico o irrelevante.',
    goldenRule: 'Resumir tu identidad en una fórmula asimétrica: Geofísico cuantitativo especializado en física de suelos, balances hídricos y transporte no saturado para MRV.',
    riskIfOmitted: 'Ser archivado como "uno más de ciencias ambientales" y perder el filtro final.',
    snippets: {
      es: 'Geofísico especializado en física de suelos, balances hídricos y modelación numérica de flujo no saturado para sistemas MRV.',
      en: 'Applied geophysicist specialized in soil physics, water balance, and numerical unsaturated transport modeling for MRV systems.',
      de: 'Angewandter Geophysiker mit Spezialisierung auf Bodenphysik, Wasserhaushaltsbilanzierung und numerische Transportmodellierung für MRV-Systeme.'
    }
  },
  {
    id: 'intellectual_friction',
    num: '05',
    name: 'Fricción Intelectual Constructiva (Curiosity Hook)',
    role: 'wingman',
    roleLabel: 'Wingman Lens (PI Engagement)',
    tagline: 'Sustituir elogios vacíos por el planteamiento de un dilema técnico de frontera compartido.',
    psychologyInsight:
      'Los líderes técnicos están aburridos de leer cartas que elogian la misión de la empresa. Quieren conversar con alguien que entienda sus verdaderos dolores de cabeza metodológicos.',
    goldenRule: 'Plantear un dilema técnico real de frontera (histéresis en biocarbón, escala parcela-cuenca, calibración de sensores FDR) sin sonar arrogante ni dar sermones obvios.',
    riskIfOmitted: 'Sonar como un observador externo que solo repite los eslóganes del sitio web.',
    snippets: {
      es: 'Uno de los mayores desafíos al escalar modelos de retención hídrica en suelos con enmiendas es la histéresis capilar bajo ciclos de secado rápido. Me interesa contrastar cómo calibran esa dispersión en sus sensores actuales.',
      en: 'A primary challenge when scaling hydrological retention models across amended soils is capillary hysteresis during rapid drying cycles. I am keenly interested in contrasting how your team currently calibrates this variance in field sensors.',
      de: 'Eine der größten Herausforderungen bei der Skalierung von Bodenfeuchtemodellen ist die kapillare Hysteresis unter schnellen Austrocknungszyklen. Mich interessiert besonders, wie Ihre Arbeitsgruppe diese Streuung in aktuellen Feldmessungen kalibriert.'
    }
  },
  {
    id: 'status_parity',
    num: '06',
    name: 'Paridad de Estatus (Zero-Servility)',
    role: 'both',
    roleLabel: 'Dual-Lens (Colegialidad Soberana)',
    tagline: 'La sumisión delata bajo valor percibido. Hablar como colegas científicos en distintas etapas de una misión.',
    psychologyInsight:
      'En dinámica social, el subordinado suplica y el igual colabora. Un tono sobrio y respetuoso entre pares genera respeto profesional instantáneo y proyecta madurez de liderazgo.',
    goldenRule: 'Cero frases de sumisión ("agradezco infinitamente que consideren mi humilde candidatura"). Cierre con gancho táctico de 15 minutos para contrastar hipótesis.',
    riskIfOmitted: 'Posicionarse psicológicamente por debajo del evaluador antes de la entrevista.',
    snippets: {
      es: 'Quedo a su disposición para una breve conversación técnica de 15 minutos donde contrastar hipótesis operativas y evaluar si nuestras soluciones convergen.',
      en: 'I welcome a focused 15-minute technical discussion to compare methodological assumptions and explore where our operational approaches align.',
      de: 'Für ein fokussiertes 15-minütiges Fachgespräch zum Abgleich methodischer Annahmen stehe ich Ihnen gerne zur Verfügung.'
    }
  },
  {
    id: 'costly_signaling',
    num: '07',
    name: 'Teoría de Señales Costosas (Show, Don\'t Claim)',
    role: 'headhunter',
    roleLabel: 'Headhunter Lens (Prueba Irrefutable)',
    tagline: 'Las palabras son cheap talk en teoría de juegos. Solo convencen artefactos que demandaron destreza real.',
    psychologyInsight:
      'Cualquiera puede escribir "soy analítico y proactivo". Un evaluador de élite solo cree lo que puede verificar con sus propios ojos: código abierto, gemelos digitales, números experimentales.',
    goldenRule: 'Reemplazar adjetivos por artefactos verificables: enlaces a Wetland Monitor, AgriTwin, ReWild y métricas exactas (62.4 kPa, balance de masa).',
    riskIfOmitted: 'Confiar en afirmaciones verbales que los filtros descartan como ruido de relleno.',
    snippets: {
      es: 'Para verificar la reproducibilidad de mis gemelos digitales y modelos numéricos, pueden acceder a la suite interactiva en https://danisantanderurrutia-coder.github.io/wetland-monitor/.',
      en: 'To inspect the reproducibility of my numerical twins and spatial data pipelines, the interactive suite is accessible at https://danisantanderurrutia-coder.github.io/wetland-monitor/.',
      de: 'Zur Überprüfung der Reproduzierbarkeit meiner numerischen Zwillinge und Datenpipelines steht die interaktive Suite unter https://danisantanderurrutia-coder.github.io/wetland-monitor/ bereit.'
    }
  }
];

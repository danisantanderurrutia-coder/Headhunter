import { getStoredProfile } from './db';
import type { JobOffer } from '../types/offers';
import type { TargetLeadProfile, JobDossier } from '../types/intelligence';
import { scoreFacts } from './cvStudio';
import { CANONICAL_CONTACT } from '../data/verifiedCvFacts';

export interface GeneratedCoverLetter {
  language: 'es' | 'en' | 'de';
  title: string;
  salutation: string;
  bodyParagraphs: string[];
  closing: string;
  fullMarkdown: string;
}

export interface ApplicationQAPair {
  question: string;
  recommendedAnswer: string;
  tips: string;
}

/**
 * Generador de BORRADOR de carta de presentación anclado en la Fuente Única de Verdad (Portafolio)
 * y enriquecido por el subsistema "Job Wingman" (Target Intelligence & PI Dossier).
 */
export const generateTailoredCoverLetter = (
  offer: JobOffer,
  language: 'es' | 'en' | 'de' = 'es',
  targetLead?: TargetLeadProfile,
  dossier?: JobDossier
): GeneratedCoverLetter => {
  const profile = getStoredProfile();
  const companyName = offer.company || (language === 'en' ? 'the organisation' : language === 'de' ? 'die Organisation' : 'la organización');
  const jobTitle = offer.title || (language === 'en' ? 'the position' : language === 'de' ? 'die Stelle' : 'el puesto');
  const location = offer.location || '';
  const contact = [profile.email || CANONICAL_CONTACT.email, profile.phone, profile.location || CANONICAL_CONTACT.defaultLocation].filter(Boolean).join(' | ');

  const activeLead = targetLead || offer.leadProfile || dossier?.leadProfile;
  const activeDossier = dossier || offer.jobDossier;

  // Detección de contexto Thünen / Axel Don / TechWorms
  const isThuenenContext = 
    activeDossier?.id === 'dossier-thuenen-techworms-axel-don' ||
    companyName.toLowerCase().includes('thünen') ||
    companyName.toLowerCase().includes('thuenen') ||
    jobTitle.toLowerCase().includes('techworm') ||
    (activeLead?.name && activeLead.name.toLowerCase().includes('axel don'));

  // Detección de contexto Umweltbundesamt / UBA KI-Lab
  const isUbaContext =
    activeDossier?.id === 'dossier-uba-kilab-1499096' ||
    companyName.toLowerCase().includes('umweltbundesamt') ||
    companyName.toLowerCase().includes('uba') ||
    jobTitle.toLowerCase().includes('ki-lab') ||
    jobTitle.toLowerCase().includes('product owner') ||
    offer.rawDescription?.toLowerCase().includes('1499096') ||
    offer.rawDescription?.toLowerCase().includes('8/lb/26');

  const scored = scoreFacts(offer);
  const matchedExperiences = scored
    .filter((s) => s.fact.section === 'experience' && s.matchedTags.length > 0)
    .sort((a, b) => b.score - a.score);
  const topExp = matchedExperiences[0]?.fact || scored.find((s) => s.fact.section === 'experience')?.fact;
  const matchedKeywords = Array.from(new Set(scored.flatMap((s) => s.matchedTags))).slice(0, 5);

  // ==========================================================================
  // INGLÉS (EN)
  // ==========================================================================
  if (language === 'en') {
    let salutation = `Dear Hiring Team at ${companyName},`;
    if (activeLead?.name) {
      salutation = `Dear ${activeLead.titleHonorific ? activeLead.titleHonorific + ' ' : ''}${activeLead.name},`;
    }

    let bodyParagraphs: string[] = [];

    if (isThuenenContext) {
      bodyParagraphs = [
        `I am writing to submit my application for the doctoral / research position within the "TechWorms" project at the Thünen Institute of Climate-Smart Agriculture. Having closely followed your research on subsoil organic carbon dynamics and root-accessible macropores (including insights from SUBSOM and SOIL3), I am eager to contribute my quantitative geophysical background to this investigation.`,
        `Rather than approaching subsoil compaction and root penetration from a purely descriptive agronomic viewpoint, my training as an Environmental Geophysicist (Universidad de Chile, with distinction) frames soil as an anisotropic, heterogeneous porous medium. This perspective allows me to model preferential bypass flow, unsaturated matrix potential gradients, and mechanical impedance along artificial earthworm burrows using formal continuum physics and numerical transport equations.`,
        `On the methodological front, my experience in scientific computing (R and Python) and spatial signal processing enables the automated, unbiased analysis of root images captured by the RootBox under UV fluorescence. Furthermore, my understanding of mass-balance dynamics allows me to critically tackle the isotopic tracing (13C/15N) of root-derived carbon—rigorously assessing the balance between organo-mineral stabilization in the drilosphere versus potential priming effects on indigenous subsoil carbon.`,
        `Having conducted extensive all-weather hydrogeophysical and peatland greenhouse-gas fieldwork, I am accustomed to physically demanding core sampling and long-term in-situ instrumentation. Currently completing my M.Sc. in Environmental Management at CAU Kiel, I am based in northern Germany and prepared for immediate deployment in Braunschweig.`,
        `Thank you for considering my application. I would welcome the opportunity to discuss how my quantitative skillset can advance the experimental and analytical goals of the TechWorms team.`
      ];
    } else if (isUbaContext) {
      bodyParagraphs = [
        `I am submitting my application for the position of AI Project Management Specialist and AI Product Owner within the AI Application Laboratory (KI-Lab) at the German Environment Agency (Umweltbundesamt - UBA, Reference 8/LB/26, Interamt ID 1499096). As an Environmental Geophysicist and dual European M.Sc. in Environmental Management (CAU Kiel) and Environmental Protection (AMU Poznań), I combine rigorous quantitative STEM training with hands-on Product Ownership experience across three self-architected environmental software systems. My operational focus is bridging complex biophysical and Earth-observation data with agile sprint backlogs (Scrum) and reproducible MLOps architectures for environmental public administration.`,
        `My methodology is grounded in physical mass balances and verifiable data integrity: At Universidad de Chile (graduated with distinction), I analyzed subsurface electrical resistivity anomalies and groundwater drawdown under forestry monocultures in the Maule Basin via Schlumberger vertical electrical soundings (VES). At CAU Kiel, I quantify greenhouse gas fluxes (CO₂, CH₄) on the rewetted peatland Wallener Au using closed chambers, high-frequency Eddy Covariance towers, and soil hydro-physical characterization processed through reproducible R scripts. This continuous field sensor instrumentation prevents naive assumptions regarding sensor noise, data drift, or calibration limits.`,
        `I have bridged environmental science and agile software delivery through the end-to-end architecture and product management of three dedicated environmental applications:
1. "Wetland Monitor": An interactive 3D web application (React, Three.js, R) for temporal simulation of peatland rewetting, GHG fluxes, and Eddy Covariance data.
2. "AgriTwin": An agricultural digital twin coupling continuous IoT soil-moisture telemetry with Sentinel-2 satellite imagery (NDVI/NDRE) in vineyard catchment systems.
3. "Rewilding Field Suite": A modular, offline-first Progressive Web App (PWA with local IndexedDB persistence and GIS layer fusion) for standardized ecological restoration protocols, biomass monitoring, and wildfire risk mitigation (Aljezur, Portugal).`,
        `Across all three applications, I acted as Product Owner: translating stakeholder needs and ecological metrics into user stories, managing backlog priorities, and conducting usability validation with field teams. This technical execution is complemented by institutional communication acumen: serving as an invited expert witness before Chile's Chamber of Deputies on wildfire risk and authoring international technical reports on carbon accounting frameworks (EPN & Global Forest Coalition, 2023).`,
        `As a graduate of a German university, I offer immediate contractual readiness under Germany's §20 AufenthG framework, operational fluency in English (C2) and German (B1–B2), and full flexibility for on-site collaboration in Leipzig as well as hybrid mobile work. I remain available for any technical or formal inquiries.`
      ];
    } else {
      const expSnippet = topExp
        ? `In particular, my work on ${topExp.en.title} (${topExp.en.short || ''}) provides direct, verified empirical evidence supporting the operational requirements of this role.`
        : 'Throughout my research trajectory, I have focused on translating physical data and environmental metrics into robust, reproducible analytical pipelines.';
      const kwSnippet = matchedKeywords.length > 0
        ? `My core technical competencies align directly with your priorities in ${matchedKeywords.join(', ')}.`
        : 'My quantitative framework directly bridges physical system modeling with data analytics.';
      const hooksSnippet = activeDossier?.technicalHooks?.length
        ? `In particular: ${activeDossier.technicalHooks.slice(0, 2).join(' ')}`
        : '';
      const painPointsContext = activeDossier?.projectPainPoints?.length
        ? `I have structured my approach to address key project challenges, specifically: ${activeDossier.projectPainPoints[0]}`
        : '';

      bodyParagraphs = [
        `I am writing to submit my application for the position of ${jobTitle} at ${companyName}${location ? ` (${location})` : ''}. Having reviewed the objectives and technical scope of this appointment, I am confident that my quantitative background in environmental physics, data engineering, and multi-scale environmental monitoring provides a decisive asset for your team.`,
        `As an Environmental Geophysicist (Universidad de Chile, with distinction) and dual European M.Sc. in Environmental Management (CAU Kiel, Germany) and Environmental Protection (AMU Poznań, Poland), I do not approach environmental systems from a purely descriptive standpoint. Instead, I frame complex environmental dynamics as anisotropic physical media governed by transport equations, boundary conditions, and rigorous conservation principles. ${kwSnippet}`,
        `On the methodological and computational front, I specialize in scientific computing using R and Python for spatial data analysis, time-series processing, and sensor data integration. ${expSnippet} ${hooksSnippet} This quantitative foundation allows me to build reproducible workflows, automate quality control, and extract statistically defensible insights from noisy field observations.`,
        `${painPointsContext ? painPointsContext + ' ' : ''}${activeDossier?.candidateValueThesis || 'My dual technical and operational profile allows me to take end-to-end ownership of data processing workflows, field calibration, and technical reporting.'} Having conducted demanding all-weather instrumentation campaigns across diverse environments, I combine computational rigor with complete autonomy in physical setup, sensor maintenance, and analytical troubleshooting.`,
        `Based in northern Germany with immediate contractual readiness under Germany's §20 AufenthG framework and full working proficiency in English (C2) and German, I am prepared for immediate deployment. Thank you for your time and consideration; I welcome the opportunity to discuss my qualifications and technical approach in an interview.`
      ];
    }

    const closing = `Sincerely,\n${profile.fullName || 'Daniel Santander Urrutia'}\n${CANONICAL_CONTACT.email} | ${CANONICAL_CONTACT.portfolio}`;
    const fullMarkdown = `**${profile.fullName || 'Daniel Santander Urrutia'}**  \n${contact}\n\n**${companyName}**  \n**Position:** ${jobTitle}\n\n${salutation}\n\n${bodyParagraphs.join('\n\n')}\n\n${closing}`.trim();
    return {
      language: 'en',
      title: `Cover Letter - ${jobTitle} (${companyName})`,
      salutation,
      bodyParagraphs,
      closing,
      fullMarkdown
    };
  }

  // ==========================================================================
  // ALEMÁN (DE)
  // ==========================================================================
  if (language === 'de') {
    let salutation = `Sehr geehrte Damen und Herren,`;
    if (activeLead?.name) {
      const title = activeLead.titleHonorific ? activeLead.titleHonorific + ' ' : '';
      const lastName = activeLead.name.split(' ').slice(-1)[0];
      salutation = `Sehr geehrter Herr ${title}${lastName},`;
    }

    let bodyParagraphs: string[] = [];

    if (isThuenenContext) {
      bodyParagraphs = [
        `hiermit bewerbe ich mich mit großem wissenschaftlichem Interesse um die Promotionsstelle im Projekt „TechWorms“ (Künstliche Makroporen zur Unterbodenerschließung) am Thünen-Institut für Agrarklimaschutz. Ihre Pionierarbeiten zur Kohlenstoffdynamik in Unterböden (insbesondere die Erkenntnisse aus SUBSOM und SOIL3) verfolge ich seit Langem; die Erforschung von Makroporen als Schnittstelle zwischen Trockenheitsresilienz und C-Sequestrierung trifft exakt meine wissenschaftliche Ausrichtung.`,
        `Als Umweltgeophysiker (Universidad de Chile, mit Auszeichnung) und M.Sc. für Umweltmanagement an der CAU Kiel betrachte ich den Unterboden nicht als rein deskriptives Substrat, sondern als anisotropes poröses Medium. Dies ermöglicht es mir, präferentiellen Fluss, hydraulische Gradienten im ungesättigten Bereich und mechanische Penetrationswiderstände entlang künstlicher Regenwurmgänge mit den mathematisch-physikalischen Werkzeugen der Kontinuumsmechanik und Transportgleichungen quantitativ zu analysieren.`,
        `Methodisch bringe ich fundierte Praxis in der wissenschaftlichen Datenanalyse und Modellierung mit R und Python sowie in der räumlichen Signalverarbeitung mit. Damit kann ich die automatisierte Bildanalyse der RootBox (UV-Fluoreszenz zur quantitativen Bestimmung der Wurzellängendichte RLD) robust weiterentwickeln. Zudem erlaubt mir mein quantitativer Hintergrund, die geplante Isotopenanalytik (13C/15N) mit der gebotenen thermodynamischen und massenbilanziellen Schärfe zu bearbeiten – insbesondere im Hinblick auf das kritische Spannungsfeld zwischen mineralischer Stabilisierung in der Drilosphäre und potentiellem Priming-Effekt auf Alt-Humus.`,
        `Aus meiner feldgeophysikalischen Praxis (unter anderem bei hydrogeophysikalischen Messungen und Treibhausgasmessungen in Mooren) bin ich an anspruchsvolle, wetterunabhängige Beprobungskampagnen und kontinuierliche in-situ-Sensorik gewöhnt. Durch meinen Wohnsitz in Kiel bin ich regional unmittelbar angebunden und kurzfristig einsatzbereit.`,
        `Über die Gelegenheit, mich und meinen Beitrag zum Projekt TechWorms in einem persönlichen Gespräch vorzustellen, freue ich mich sehr.`
      ];
    } else if (isUbaContext) {
      bodyParagraphs = [
        `ich bewerbe mich auf die ausgeschriebene Stelle als Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner im Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) des Umweltbundesamtes (Kennziffer 8/LB/26, Interamt-ID 1499096). Als quantitativer Umweltgeophysiker und Doppel-M.Sc. für Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań) verbinde ich ein fundiertes MINT-Fundament mit praxiserprobter Product-Ownership-Erfahrung in der Konzeption und eigenständigen Realisierung dreier ökologischer Softwareanwendungen. Mein methodischer Fokus liegt auf der präzisen Übersetzung komplexer biogeochemischer Fachanforderungen in agile Backlogs (Scrum) und auditsichere Datenpipelines für den Verwaltungsvollzug.`,
        `Mein wissenschaftlicher Ansatz basiert auf messbaren biophysikalischen Bilanzen und methodischer Transparenz: An der Universidad de Chile (Abschluss mit Auszeichnung) untersuchte ich im Maule-Becken mittels geoelektrischer Schlumberger-Tiefensondierungen (VES) die Veränderung der subsuperfiziellen Resistivität und den Grundwasserabfall unter forstlichen Monokulturen. An der CAU Kiel quantifiziere ich auf der wiedervernässten Moorfläche Wallener Au Treibhausgasflüsse (CO₂, CH₄) mittels geschlossener Hauben und hochfrequenter Eddy Covariance sowie bodenphysikalische Retentionskurven mit reproduzierbaren R-Pipelines. Diese Feld- und Sensorerfahrung schützt mich vor praxisfernen Annahmen bei Datenqualität und Sensorrauschen.`,
        `Den Schritt von der reinen Umweltforschung zur agilen Software- und Produktentwicklung habe ich durch die eigenständige Konzeption und Entwicklung dreier Umwelt-Software-Lösungen vollzogen:
1. „Wetland Monitor“: Eine interaktive 3D-Webanwendung (React, Three.js, R) zur räumlich-zeitlichen Modellierung von Moorwiedervernässung und Eddy-Covariance-Flüssen.
2. „AgriTwin“: Ein landwirtschaftlicher digitaler Zwilling, der kontinuierliche IoT-Bodenfeuchte-Sensorik mit Copernicus-Satellitendaten (Sentinel-2 NDVI/NDRE) im Weinbau fusioniert.
3. „Rewilding Field Suite“: Eine modulare, offline-fähige Progressive Web App (PWA mit lokaler IndexedDB-Architektur und GIS-Schichtfusion) für standardisierte Feldprotokolle im ökologischen Gewässerschutz, Biomassemonitoring und Waldbrandrisiko-Management (Aljezur, Portugal).`,
        `In allen drei Vorhaben übernahm ich die Rolle des Product Owners: von der Bedarfsanalyse und Datenmodellierung über das Anforderungsmanagement im Backlog bis hin zur Usability-Validierung im Gelände. Ergänzt wird diese Praxis durch Verhandlungssicherheit im öffentlichen Raum: als geladener Sachverständiger vor der Kommission für Katastrophenschutz der chilenischen Abgeordnetenkammer und als Hauptautor internationaler Fachanalysen zu Kohlenstoff- und Biomasse-Bilanzen (EPN & Global Forest Coalition, 2023).`,
        `Als Absolvent einer deutschen Hochschule stehe ich dem Umweltbundesamt mit voller vertraglicher Verfügbarkeit (§20 AufenthG), verhandlungssicherem Englisch (C2), praxiserprobtem Deutsch (B1–B2) und hoher Einsatzbereitschaft für den Standort Leipzig sowie mobiles Arbeiten zur Verfügung. Für Rückfragen stehe ich Ihnen gerne zur Verfügung.`
      ];
    } else {
      const hooksSnippetDe = activeDossier?.technicalHooks?.length
        ? `Konkret: ${activeDossier.technicalHooks.slice(0, 2).join(' ')}`
        : '';
      const expSnippetDe = topExp
        ? `Praktische Evidenz hierfür liefert insbesondere meine Arbeit im Bereich ${topExp.es.title} (${topExp.es.short || ''}).`
        : 'Meine methodische Arbeitsweise gründet auf reproduzierbaren Datenpipelines und physikalischer Modellierung.';
      const painPointsDe = activeDossier?.projectPainPoints?.length
        ? `Für die anstehenden Projektherausforderungen – insbesondere ${activeDossier.projectPainPoints[0]} – bringe ich zielgerichtete Lösungsansätze mit.`
        : '';

      bodyParagraphs = [
        `hiermit bewerbe ich mich mit großem fachlichem Interesse auf die Stelle als ${jobTitle} bei ${companyName}${location ? ` (${location})` : ''}. Angesichts des wissenschaftlich-technischen Profils dieser Position bin ich überzeugt, Ihr Team mit meiner quantitativen Ausbildung in Umweltphysik, methodischer Datenanalyse und Feldpraxis wirkungsvoll zu verstärken.`,
        `Als Umweltgeophysiker (Universidad de Chile, mit Auszeichnung) und Doppel-M.Sc. für Umweltmanagement an der CAU Kiel sowie Umweltschutz an der AMU Poznań nähere ich mich komplexen Umweltsystemen nicht rein deskriptiv. Ich begreife biogeochemische und ökologische Prozesse als kontinuierliche physikalische Medien, die über Transportgleichungen, Randbedingungen und Erhaltungssätze exakt modelliert und quantifiziert werden können.`,
        `Methodisch liegt mein Schwerpunkt in der wissenschaftlichen Datenverarbeitung mit R und Python, der raum-zeitlichen Modellierung und der Einbindung kontinuierlicher Feld- und Sensordaten. ${expSnippetDe} ${hooksSnippetDe} Dieser Ansatz erlaubt es mir, automatisierte Workflows aufzubauen und auch aus heterogenen Messdaten belastbare statistische Aussagen abzuleiten.`,
        `${painPointsDe ? painPointsDe + ' ' : ''}${activeDossier?.candidateValueThesis || 'Mein Profil verbindet analytische Selbstständigkeit im Code mit praktischer Eigenverantwortung bei Messkampagnen.'} Durch umfangreiche Kampagnen unter realen Witterungsbedingungen bin ich an anspruchsvolle Feldarbeiten, Sensorwartung und selbstständige Fehlerdiagnose gewöhnt.`,
        `Durch meinen Wohnsitz in Norddeutschland, vertragliche Verfügbarkeit über den §20 AufenthG-Rahmen und verhandlungssichere Deutsch- sowie Englischkenntnisse (C2) stehe ich kurzfristig zur Verfügung. Über die Einladung zu einem persönlichen Gespräch freue ich mich sehr.`
      ];
    }

    const closing = `Mit freundlichen Grüßen,\n${profile.fullName || 'Daniel Santander Urrutia'}\n${CANONICAL_CONTACT.email} | ${CANONICAL_CONTACT.portfolio}`;
    const fullMarkdown = `**${profile.fullName || 'Daniel Santander Urrutia'}**  \n${contact}\n\n**${companyName}**  \n**Position:** ${jobTitle}\n\n${salutation}\n\n${bodyParagraphs.join('\n\n')}\n\n${closing}`.trim();
    return {
      language: 'de',
      title: `Anschreiben - ${jobTitle} (${companyName})`,
      salutation,
      bodyParagraphs,
      closing,
      fullMarkdown
    };
  }

  // ==========================================================================
  // ESPAÑOL (ES)
  // ==========================================================================
  let salutation = `Estimado equipo de selección de ${companyName}:`;
  if (activeLead?.name) {
    salutation = `Estimado ${activeLead.titleHonorific ? activeLead.titleHonorific + ' ' : ''}${activeLead.name}:`;
  }

  let bodyParagraphs: string[] = [];

  if (isThuenenContext) {
    bodyParagraphs = [
      `Me dirijo a usted con alto interés científico para presentar mi postulación a la posición doctoral en el proyecto "TechWorms" (macroporos artificiales para la colonización del subsuelo, dinámica radicular y secuestro de carbono) en el Thünen-Institut für Agrarklimaschutz. Sigo de cerca sus contribuciones sobre la dinámica del carbono en horizontes profundos (en particular las investigaciones de SUBSOM y SOIL3); el estudio de los macroporos como interfaz entre resiliencia ante sequías y almacenamiento de C coincide plenamente con mi vocación investigadora.`,
      `En lugar de abordar la compactación del subsuelo y la penetración radicular desde una perspectiva agronómica meramente descriptiva, mi formación como Geofísico Ambiental (Universidad de Chile, con distinción) y M.Sc. en Manejo Ambiental (CAU Kiel) concibe el suelo como un medio poroso anisótropo y heterogéneo. Este enfoque permite modelar el flujo preferencial por derivación (bypass), los gradientes de potencial hídrico en la matriz no saturada y la impedancia mecánica a lo largo de las galerías artificiales aplicando herramientas cuantitativas de mecánica de fluidos y ecuaciones de transporte.`,
      `En el plano metodológico, aporto experiencia práctica en análisis numérico y modelado en R y Python, así como en procesamiento de señales espaciales. Esto me capacita para optimizar y automatizar el pipeline de visión por computadora de la RootBox (cuantificación de densidad de longitud radicular bajo fluorescencia UV). Asimismo, mi base cuantitativa me permite abordar los balances isotópicos (13C/15N) con rigor termodinámico y de balance de masa, profundizando en el balance crítico entre la estabilización organomineral en la drilósfera artificial y el potencial efecto priming sobre el carbono nativo del subsuelo.`,
      `Mi experiencia de campo en geofísica ambiental e hidrología (campañas pesadas de prospección y medición in-situ de flujos de gases de efecto invernadero en turberas bajo condiciones meteorológicas rigurosas) me confiere total autonomía operativa en muestreos profundos de suelo y mantenimiento de sensores continuos. Con base en el norte de Alemania, cuento con disponibilidad y vinculación inmediata para integrarme al equipo en Braunschweig.`,
      `Agradezco su atención y consideración. Quedo a su entera disposición para dialogar en detalle sobre mi propuesta y encaje técnico en el proyecto TechWorms.`
    ];
  } else if (isUbaContext) {
    bodyParagraphs = [
      `Presento mi postulación a la posición de Especialista en Gestión de Proyectos de IA y Product Owner de IA en el Laboratorio de Aplicación de Inteligencia Artificial y Big Data (KI-Lab) de la Agencia Federal de Medio Ambiente de Alemania (Umweltbundesamt - UBA, Kennziffer 8/LB/26, Interamt-ID 1499096). Como Geofísico Ambiental y doble Máster en Ciencias europeo en Manejo Ambiental (CAU Kiel) y Protección Ambiental (AMU Poznań), integro una formación cuantitativa rigurosa con experiencia contrastada de Product Ownership en la concepción y desarrollo autónomo de tres aplicaciones de software ambiental. Mi enfoque radica en traducir requerimientos biogeoquímicos complejos en backlogs ágiles (Scrum) y arquitecturas de datos verificables para la administración ambiental pública.`,
      `Mi metodología parte de balances de masa biofísicos y rigor empírico: En la Universidad de Chile (con distinción) analicé, mediante sondeos eléctricos verticales (SEV, Schlumberger), las alteraciones de resistividad eléctrica del subsuelo y la depresión freática bajo monocultivos forestales en el Maule. En la CAU Kiel cuantifico los flujos de gases de efecto invernadero (CO₂, CH₄) en la turbera rehumedecida Wallener Au mediante cámaras cerradas y torres micrometeorológicas de Eddy Covariance, evaluando curvas de retención hídrica y dinámica edáfica con pipelines reproducibles en R. Esta experiencia de instrumentación continua en terreno evita supuestos desconectados de la calidad real de los datos.`,
      `He trasladado la ciencia ambiental al desarrollo ágil de software mediante la arquitectura y entrega de tres productos tecnológicos:
1. «Wetland Monitor»: Aplicación web 3D interactiva (React, Three.js, R) para la modelación espaciotemporal de rehumedecimiento de turberas, flujos de GEI y registros de Eddy Covariance.
2. «AgriTwin»: Gemelo digital agrícola que integra telemetría continua de humedad de suelo IoT con índices satelitales Sentinel-2 (NDVI/NDRE) en cuencas vitivinícolas.
3. «Rewilding Field Suite»: Aplicación web progresiva modular y offline-first (PWA con almacenamiento local IndexedDB y fusión de capas GIS) para protocolos de campo de restauración ecológica, monitoreo de biomasa y prevención de incendios (Aljezur, Portugal).`,
      `En los tres productos ejercí el rol de Product Owner: desde el levantamiento de especificaciones y arquitectura de datos hasta la priorización de historias de usuario y la validación con equipos de terreno. Esta solvencia técnica se complementa con capacidad probada de interlocución pública: perito invitado ante la Cámara de Diputadas y Diputados de Chile para la modelación de riesgo de incendios y autor principal de informes internacionales sobre balances de carbono y biomasa (EPN y Global Forest Coalition, 2023).`,
      `Como graduado de una universidad alemana, dispongo de plena habilitación contractual (§20 AufenthG), inglés profesional (C2), alemán operativo (B1–B2) y total disposición para trabajar en Leipzig y en modalidad híbrida/remota. Quedo a su disposición para cualquier requerimiento técnico o formal.`
    ];
  } else {
    const expSnippetEs = topExp
      ? `En particular, mi labor en ${topExp.es.title} (${topExp.es.short || ''}) aporta respaldo empírico directo y verificable a estas competencias.`
      : 'Mi trayectoria investigadora se fundamenta en la construcción de modelos cuantitativos rigurosos a partir de datos empíricos de campo.';
    const kwSnippetEs = matchedKeywords.length > 0
      ? `He contrastado los requisitos de la vacante con mi trayectoria acreditada en ${matchedKeywords.join(', ')}.`
      : 'Aporto una sólida base físico-matemática aplicada a sistemas ambientales complejos.';
    const hooksSnippetEs = activeDossier?.technicalHooks?.length
      ? `Específicamente: ${activeDossier.technicalHooks.slice(0, 2).join(' ')}`
      : '';
    const painPointsEs = activeDossier?.projectPainPoints?.length
      ? `Mi enfoque metodológico está orientado a resolver los desafíos clave del proyecto, entre ellos: ${activeDossier.projectPainPoints[0]}`
      : '';

    bodyParagraphs = [
      `Me dirijo a ustedes para presentar mi candidatura al puesto de ${jobTitle} en ${companyName}${location ? ` (${location})` : ''}. Tras examinar el perfil y los objetivos técnicos del equipo, estoy convencido de que mi formación físico-matemática en ciencias de la Tierra y mi experiencia en modelado y análisis de datos aportan una ventaja diferencial a sus proyectos.`,
      `Mi perfil como Geofísico Ambiental (Universidad de Chile, con distinción) y doble Máster en Ciencias en Manejo Ambiental (CAU Kiel, Alemania) y Protección Ambiental (AMU Poznań, Polonia) concibe los sistemas ambientales no desde una perspectiva descriptiva genérica, sino como medios físicos complejos gobernados por leyes de conservación, gradientes de transporte y balances de masa. ${kwSnippetEs}`,
      `En el ámbito computacional y metodológico, me especializo en programación científica y análisis espacial en R y Python, integrando series temporales complejas con telemetría de sensores continuos. ${expSnippetEs} ${hooksSnippetEs} Esta metodología me permite automatizar flujos de procesamiento, asegurar la reproducibilidad analítica y extraer conclusiones estadísticas fiables a partir de mediciones heterogéneas.`,
      `${painPointsEs ? painPointsEs + ' ' : ''}${activeDossier?.candidateValueThesis || 'Mi perfil combina rigor analítico en gabinete con autonomía operativa completa en campañas de terreno exigentes.'} Habiendo liderado mediciones bajo condiciones meteorológicas rigurosas, garantizo solvencia en calibración de instrumental, mantenimiento preventivo y resolución de incidencias en campo.`,
      `Radicado en el norte de Alemania, con disponibilidad contractual inmediata bajo el marco de posgraduados (§20 AufenthG) y dominio fluido de inglés (C2) y alemán, quedo a su entera disposición para profundizar en mi propuesta técnica en una entrevista.`
    ];
  }

  const closing = `Atentamente,\n${profile.fullName || 'Daniel Santander Urrutia'}\n${CANONICAL_CONTACT.email} | ${CANONICAL_CONTACT.portfolio}`;
  const fullMarkdown = `**${profile.fullName || 'Daniel Santander Urrutia'}**  \n${contact}\n\n**${companyName}**  \n**Puesto:** ${jobTitle}\n\n${salutation}\n\n${bodyParagraphs.join('\n\n')}\n\n${closing}`.trim();

  return {
    language: 'es',
    title: `Carta de Presentación - ${jobTitle} (${companyName})`,
    salutation,
    bodyParagraphs,
    closing,
    fullMarkdown
  };
};

/**
 * Application Q&A TEMPLATE: question prompts with fill-in placeholders. Only the salary
 * answer uses real data (profile expectations and the offer's salary, if any).
 */
export const generateApplicationQA = (offer: JobOffer): ApplicationQAPair[] => {
  const profile = getStoredProfile();
  const company = offer.company || 'la organización';
  const title = offer.title || 'el puesto';
  const salaryInfo = offer.salaryMin
    ? `Rango de la oferta: ${offer.salaryMin.toLocaleString()}${offer.salaryMax ? '–' + offer.salaryMax.toLocaleString() : ''} ${offer.salaryCurrency || ''}.`.trim()
    : 'La oferta no indica salario.';
  const expectation = profile.desiredSalary ? `Tu expectativa guardada: ${profile.desiredSalary.toLocaleString()}.` : 'No tienes expectativa salarial guardada en el perfil.';

  return [
    {
      question: `1. ¿Por qué es su perfil adecuado para ${title} en ${company}?`,
      recommendedAnswer: '[COMPLETAR con tu experiencia real relacionada con los requisitos de la oferta.]',
      tips: 'Usa ejemplos concretos y verificables de tu CV.'
    },
    {
      question: '2. Describa un logro profesional relevante para este puesto.',
      recommendedAnswer: '[COMPLETAR: elige un logro de tu banco de logros.]',
      tips: 'Incluye contexto, tu papel y el resultado medible si lo hay.'
    },
    {
      question: '3. ¿Cuáles son sus pretensiones salariales y disponibilidad?',
      recommendedAnswer: `[COMPLETAR] ${salaryInfo} ${expectation}`,
      tips: 'Confirma tu disponibilidad real de incorporación.'
    }
  ];
};

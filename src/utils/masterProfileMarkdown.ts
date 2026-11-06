import type { MasterProfile } from '../types/profile';

/**
 * Genera el documento Markdown exhaustivo del Expediente Maestro
 * para lectura rápida, exportación o generación personalizada de CVs.
 */
export const generateMasterProfileMarkdown = (profile: MasterProfile): string => {
  const lines: string[] = [];

  lines.push(`# EXPEDIENTE MAESTRO // DANIEL SEBASTIÁN SANTANDER URRUTIA`);
  lines.push(`**Perfil Profesional Integrado • Geofísica Ambiental, Políticas de Cuencas & Comunicaciones Estratégicas**\n`);

  lines.push(`## 1. CONTACTO Y ENLACES CANÓNICOS VERIFICADOS`);
  lines.push(`- **Correo Electrónico**: ${profile.email}`);
  lines.push(`- **Teléfono**: ${profile.phone}`);
  lines.push(`- **Ubicación Principal**: ${profile.location}`);
  lines.push(`- **Portafolio Oficial**: ${profile.portfolio}`);
  lines.push(`- **LinkedIn**: ${profile.linkedin}`);
  lines.push(`- **GitHub**: ${profile.github}\n`);

  lines.push(`## 2. RESUMEN EJECUTIVO`);
  lines.push(`${profile.summary}\n`);

  lines.push(`## 3. FORMACIÓN ACADÉMICA Y TITULACIONES UNIVERSITARIAS`);
  (profile.education || []).forEach((edu) => {
    lines.push(`### ${edu.degree}`);
    lines.push(`- **Institución**: ${edu.institution}`);
    lines.push(`- **Período**: ${edu.startDate} – ${edu.endDate} | **Ubicación**: ${edu.location}`);
    lines.push(`- **Especialización**: ${edu.fieldOfStudy}`);
    if (edu.grade) lines.push(`- **Distinción / Calificación**: ${edu.grade}`);
    lines.push(``);
  });

  lines.push(`## 4. CERTIFICACIONES INTERNACIONALES Y ESTUDIOS DE POSGRADO`);
  (profile.otherCourses || []).forEach((course) => {
    lines.push(`- ${course}`);
  });
  lines.push(``);

  lines.push(`## 5. EXPERIENCIA PROFESIONAL VERIFICADA`);
  (profile.experiences || []).forEach((exp) => {
    lines.push(`### ${exp.role} — ${exp.company}`);
    lines.push(`*${exp.startDate} – ${exp.endDate} | ${exp.location}*`);
    lines.push(`\n${exp.summary}\n`);
    if (exp.achievements && exp.achievements.length > 0) {
      lines.push(`**Logros y Resultados Clave:**`);
      exp.achievements.forEach((ach) => lines.push(`- ${ach}`));
      lines.push(``);
    }
    if (exp.technologies && exp.technologies.length > 0) {
      lines.push(`**Metodologías y Tecnologías:** ${exp.technologies.join(', ')}`);
      lines.push(``);
    }
  });

  if (profile.publications && profile.publications.length > 0) {
    lines.push(`## 6. PUBLICACIONES TÉCNICAS, PRENSA Y ENSAYOS`);
    profile.publications.forEach((pub) => {
      lines.push(`### ${pub.title} (${pub.date})`);
      lines.push(`- **Medio / Editorial**: ${pub.outlet}`);
      lines.push(`- **Categoría**: ${pub.category.toUpperCase()}`);
      if (pub.url) lines.push(`- **Enlace**: ${pub.url}`);
      lines.push(`- **Síntesis**: ${pub.summary}`);
      if (pub.tags && pub.tags.length > 0) lines.push(`- **Descriptores**: ${pub.tags.join(', ')}`);
      lines.push(``);
    });
  }

  if (profile.conferences && profile.conferences.length > 0) {
    lines.push(`## 7. CONFERENCIAS INTERNACIONALES Y TESTIMONIOS OFICIALES`);
    profile.conferences.forEach((conf) => {
      lines.push(`### ${conf.title}`);
      lines.push(`- **Evento**: ${conf.event} | **Lugar**: ${conf.location} (${conf.date})`);
      lines.push(`- **Rol**: ${conf.role}`);
      lines.push(`- **Aporte**: ${conf.summary}`);
      if (conf.tags && conf.tags.length > 0) lines.push(`- **Tópicos**: ${conf.tags.join(', ')}`);
      lines.push(``);
    });
  }

  if (profile.keyProjects && profile.keyProjects.length > 0) {
    lines.push(`## 8. GEMELOS DIGITALES Y PROYECTOS DE INNOVACIÓN`);
    profile.keyProjects.forEach((proj) => {
      lines.push(`### ${proj.title} (${proj.period})`);
      lines.push(`- **Rol**: ${proj.role} | **Categoría**: ${proj.category}`);
      lines.push(`- **Descripción**: ${proj.description}`);
      if (proj.deliverables && proj.deliverables.length > 0) {
        lines.push(`- **Entregables:**`);
        proj.deliverables.forEach((d) => lines.push(`  * ${d}`));
      }
      lines.push(`- **Stack Tecnológico**: ${proj.techStack.join(', ')}`);
      if (proj.url) lines.push(`- **URL**: ${proj.url}`);
      if (proj.githubUrl) lines.push(`- **Repositorio**: ${proj.githubUrl}`);
      lines.push(``);
    });
  }

  lines.push(`## 9. BANCO DE LOGROS DE ALTO IMPACTO`);
  (profile.achievementsBank || []).forEach((ach) => {
    lines.push(`- **${ach.title}** (${ach.date}): ${ach.description} [${ach.metrics}]`);
  });
  lines.push(``);

  if (profile.fieldEquipment && profile.fieldEquipment.length > 0) {
    lines.push(`## 10. INSTRUMENTAL DE CAMPO Y LABORATORIO OPERADO`);
    profile.fieldEquipment.forEach((eq) => {
      lines.push(`- **${eq.name}** [${eq.category}]: ${eq.description}`);
    });
    lines.push(``);
  }

  lines.push(`## 11. COMPETENCIAS TÉCNICAS E IDIOMAS`);
  lines.push(`### Habilidades Principales:`);
  lines.push(profile.skills.map((s) => `${s.name} (${s.level})`).join(' • '));
  lines.push(``);
  lines.push(`### Idiomas Acreditados:`);
  profile.languages.forEach((l) => {
    lines.push(`- **${l.language}**: ${l.proficiency}${l.certificate ? ` — ${l.certificate}` : ''}`);
  });
  lines.push(``);

  lines.push(`---`);
  lines.push(`*Expediente Maestro consolidado y sincronizado con el Portafolio Oficial de Daniel Santander Urrutia.*`);

  return lines.join('\n');
};

import React from 'react';
import { Printer, X } from 'lucide-react';
import type { CVVersion } from '../../types/cv';

interface CVPreviewModalProps {
  cv: CVVersion | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectCv?: (cv: CVVersion) => void;
  availableCvs?: CVVersion[];
}

type UiLang = 'es' | 'de' | 'en';

const MODAL_I18N: Record<UiLang, {
  langLabel: string;
  summaryTitle: string;
  achievementsTitle: string;
  experienceTitle: string;
  technologiesLabel: string;
  educationTitle: string;
  otherCoursesTitle: string;
  skillsTitle: string;
  languagesTitle: string;
  footerNotice: string;
  printBtn: string;
  badgeTrackA: string;
  badgeTrackB: string;
  languagesNameMap: Record<string, string>;
  proficienciesMap: Record<string, string>;
}> = {
  de: {
    langLabel: 'Sprache:',
    summaryTitle: 'Berufliches Profil & Qualifikationsprofil',
    achievementsTitle: 'Besondere Praxiserfolge (Verifiziert)',
    experienceTitle: 'Berufserfahrung & Praxiseinsätze',
    technologiesLabel: 'Schwerpunkte & Fachpraxis:',
    educationTitle: 'Ausbildung & Studium',
    otherCoursesTitle: 'Zertifikate, Belehrungen & Weiterbildung',
    skillsTitle: 'Fachliche Kompetenzen',
    languagesTitle: 'Sprachkenntnisse',
    footerNotice: 'Job Search OS — Offizieller Lebenslauf auf Basis 100 % verifizierter Angaben.',
    printBtn: 'Drucken / PDF',
    badgeTrackA: 'Bereich A · Wissenschaft & Umwelt',
    badgeTrackB: 'Bereich B · Gastronomie & Service',
    languagesNameMap: {
      Español: 'Spanisch',
      Spanish: 'Spanisch',
      Spanisch: 'Spanisch',
      Inglés: 'Englisch',
      English: 'Englisch',
      Englisch: 'Englisch',
      Alemán: 'Deutsch',
      German: 'Deutsch',
      Deutsch: 'Deutsch'
    },
    proficienciesMap: {
      Nativo: 'Muttersprache',
      Native: 'Muttersprache',
      Muttersprache: 'Muttersprache',
      C2: 'C2 (Verhandlungssicher / Bilinguale Kompetenz)',
      C1: 'C1 (Verhandlungssicher)',
      B2: 'B2 (Berufliche Praxis)',
      B1: 'B1 (Gute Grundkenntnisse / Konversation)',
      A2: 'A2 (Grundkenntnisse)',
      A1: 'A1 (Grundlagen)'
    }
  },
  en: {
    langLabel: 'Language:',
    summaryTitle: 'Professional Summary',
    achievementsTitle: 'Key Achievements & Qualifications (Verified)',
    experienceTitle: 'Work & Operational Experience',
    technologiesLabel: 'Core Competencies & Responsibilities:',
    educationTitle: 'Education & Academic Background',
    otherCoursesTitle: 'Certifications & Relevant Training',
    skillsTitle: 'Key Skills',
    languagesTitle: 'Languages',
    footerNotice: 'Job Search OS — Official resume compiled from 100% verified credentials.',
    printBtn: 'Print / PDF',
    badgeTrackA: 'Track A · Science & Environment',
    badgeTrackB: 'Track B · Hospitality & Operations',
    languagesNameMap: {
      Español: 'Spanish',
      Spanish: 'Spanish',
      Spanisch: 'Spanish',
      Inglés: 'English',
      English: 'English',
      Englisch: 'English',
      Alemán: 'German',
      German: 'German',
      Deutsch: 'German'
    },
    proficienciesMap: {
      Nativo: 'Native',
      Native: 'Native',
      Muttersprache: 'Native',
      C2: 'C2 (Full Professional Proficiency / Bilingual)',
      C1: 'C1 (Professional Working)',
      B2: 'B2 (Operational Working)',
      B1: 'B1 (Intermediate)',
      A2: 'A2 (Elementary)',
      A1: 'A1 (Beginner)'
    }
  },
  es: {
    langLabel: 'Idioma:',
    summaryTitle: 'Resumen Profesional',
    achievementsTitle: 'Logros Destacados (Verificados)',
    experienceTitle: 'Experiencia Laboral',
    technologiesLabel: 'Competencias & Funciones:',
    educationTitle: 'Educación & Formación Principal',
    otherCoursesTitle: 'Otros Cursos & Estudios Complementarios',
    skillsTitle: 'Competencias Técnicas',
    languagesTitle: 'Idiomas',
    footerNotice: 'Job Search OS — Documento generado automáticamente con datos 100 % verificados.',
    printBtn: 'Imprimir / PDF',
    badgeTrackA: 'Sector A · Científico & Ambiental',
    badgeTrackB: 'Sector B · Hostelería & Servicios',
    languagesNameMap: {
      Español: 'Español',
      Spanish: 'Español',
      Spanisch: 'Español',
      Inglés: 'Inglés',
      English: 'Inglés',
      Englisch: 'Inglés',
      Alemán: 'Alemán',
      German: 'Alemán',
      Deutsch: 'Alemán'
    },
    proficienciesMap: {
      Nativo: 'Nativo',
      Native: 'Nativo',
      Muttersprache: 'Nativo',
      C2: 'C2 (Bilingüe / Fluido)',
      C1: 'C1 (Avanzado)',
      B2: 'B2 (Operativo)',
      B1: 'B1 (Intermedio)',
      A2: 'A2 (Básico)',
      A1: 'A1 (Inicial)'
    }
  }
};

export const CVPreviewModal: React.FC<CVPreviewModalProps> = ({
  cv,
  isOpen,
  onClose,
  onSelectCv,
  availableCvs = []
}) => {
  if (!isOpen || !cv) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSectorB = cv.id.includes('gastro');
  const relatedCvs = availableCvs.filter((c) =>
    isSectorB ? c.id.includes('gastro') : !c.id.includes('gastro')
  );

  const uiLang: UiLang = (cv.language === 'de' || cv.language === 'en') ? cv.language : 'es';
  const t = MODAL_I18N[uiLang];

  const data = cv.compiledData;

  const translateLang = (name: string) => t.languagesNameMap[name] || name;
  const translateProf = (prof: string) => t.proficienciesMap[prof] || prof;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="max-w-4xl w-full rounded-2xl border shadow-2xl space-y-4 my-8 flex flex-col max-h-[90vh]"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-[var(--panel-border)] shrink-0">
          <div className="min-w-0">
            <h3 className="font-bold text-[var(--text-primary)] text-base flex items-center gap-2">
              <span className="truncate">{cv.name}</span>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                isSectorB
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20'
              }`}>
                {isSectorB ? t.badgeTrackB : t.badgeTrackA}
              </span>
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {cv.templateId} · {cv.updatedAt}
            </p>
          </div>

          {/* Selector de idioma interactivo */}
          {relatedCvs.length > 1 && (
            <div className="flex items-center gap-1 bg-[var(--panel-bg)] p-1 rounded-xl border border-[var(--panel-border)]">
              <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase px-1.5">
                {t.langLabel}
              </span>
              {relatedCvs.map((rcv) => {
                const isActive = rcv.id === cv.id;
                return (
                  <button
                    key={rcv.id}
                    type="button"
                    onClick={() => onSelectCv?.(rcv)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      isActive
                        ? isSectorB
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-sky-600 text-white shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-bg)]'
                    }`}
                  >
                    {rcv.language.toUpperCase()}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold shadow transition cursor-pointer ${
                isSectorB ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              <Printer className="h-4 w-4" />
              <span>{t.printBtn}</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-24 bg-slate-900/10 dark:bg-slate-950/80 rounded-b-2xl">
          <div 
            id="printable-cv"
            className="max-w-2xl mx-auto bg-white text-slate-900 p-8 rounded-xl shadow-2xl space-y-6 font-sans border border-slate-200"
          >
            <div className="border-b border-slate-200 pb-4 space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{data.fullName}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                <span>📍 {data.contactInfo.location}</span>
                <span>✉️ {data.contactInfo.email}</span>
                <span>📞 {data.contactInfo.phone}</span>
                {data.contactInfo.linkedin && <span>🔗 {data.contactInfo.linkedin}</span>}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700">{t.summaryTitle}</h2>
              <p className="text-xs text-slate-700 leading-relaxed">{data.summary}</p>
            </div>

            {data.achievements && data.achievements.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700">{t.achievementsTitle}</h2>
                <div className="space-y-1.5">
                  {data.achievements.map((ach) => (
                    <div key={ach.id} className="text-xs text-slate-800">
                      <strong className="text-slate-900">• {ach.title}: </strong>
                      <span className="text-indigo-800 font-semibold">{ach.metrics} — </span>
                      <span className="text-slate-600">{ach.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700">{t.experienceTitle}</h2>
              <div className="space-y-3">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-slate-900">{exp.role} — <span className="text-indigo-700 font-semibold">{exp.company}</span></span>
                      <span className="text-slate-500 font-mono text-[11px]">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">📍 {exp.location}</div>
                    <p className="text-xs text-slate-700">{exp.summary}</p>
                    <div className="text-[11px] text-slate-600 font-mono">
                      {t.technologiesLabel} {exp.technologies.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700">{t.educationTitle}</h2>
              <div className="space-y-1">
                {data.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between text-xs text-slate-800">
                    <div>
                      <strong className="text-slate-900">{edu.degree}</strong> — {edu.institution}
                    </div>
                    <span className="text-slate-500 text-[11px]">{edu.startDate} - {edu.endDate}</span>
                  </div>
                ))}
              </div>
            </div>

            {data.otherCourses && data.otherCourses.length > 0 && (
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700">{t.otherCoursesTitle}</h2>
                <div className="space-y-0.5 text-xs text-slate-700">
                  {data.otherCourses.map((course, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{course}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-xs">
              <div>
                <h3 className="font-bold text-indigo-700 uppercase tracking-wider text-[11px] mb-1">{t.skillsTitle}</h3>
                <div className="text-slate-700">
                  {data.skills.map(s => s.name).join(' • ')}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-indigo-700 uppercase tracking-wider text-[11px] mb-1">{t.languagesTitle}</h3>
                <div className="text-slate-700">
                  {data.languages.map(l => `${translateLang(l.language)} (${translateProf(l.proficiency)})`).join(' • ')}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span>{t.footerNotice}</span>
              <span className="font-mono">ID: {cv.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

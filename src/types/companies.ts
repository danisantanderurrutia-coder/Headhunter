export type QuadrantType = 
  | 'DACH' 
  | 'EUSKADI' 
  | 'UK_NL' 
  | 'NORDICS' 
  | 'CANADA_GLOBAL' 
  | 'REMOTE' 
  | 'GLOBAL';

export type CompanySectorCluster = 
  | 'ALL'
  | 'RD_PUBLIC'                 // I+D Público & Centros
  | 'CARBON_TECH_MRV'           // Carbon-Tech & Calificación MRV
  | 'CAT_RISK_INSURANCE'        // Cat Risk & Seguros Climáticos
  | 'MULTILATERAL_POLICY'       // Organismos Multilaterales & Políticas
  | 'EARTH_OBSERVATION_AGROTECH'; // Observación de la Tierra, Gemelos Digitales & Agrotech

export interface CompanyContact {
  id: string;
  name: string;
  role: string; // e.g. "Investigador Principal (PI)", "Director Técnico", "Hiring Manager", "Reclutador"
  email?: string;
  linkedinUrl?: string;
  notes?: string;
}

export interface CompanyDossier {
  id: string;
  name: string;
  website: string;
  sector: string;
  size: string; // e.g. "50-200 empleados"
  headquarters: string;
  description: string;
  keyProjects: string[];
  recentNews: { title: string; date: string; snippet: string; url?: string }[];
  workCulture: string[];
  redFlags: string[];
  interviewArguments: string[]; // Key selling points to use in interviews
  techStack?: string[];
  lastResearched: string;
  quadrants?: QuadrantType[];
  sectorCluster?: CompanySectorCluster;
  contacts?: CompanyContact[];
  fundingTies?: string[];
}

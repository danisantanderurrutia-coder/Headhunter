export interface Achievement {
  id: string;
  title: string;
  description: string;
  metrics: string; // e.g., "+35% ROI", "Reducción de 20h/semana"
  tags: string[]; // e.g., ["React", "Liderazgo", "Optimización"]
  roleId?: string; // Associated work experience ID if any
  date: string;
  isVerified: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string; // "Presente" or YYYY-MM
  isCurrent: boolean;
  summary: string;
  achievements: string[]; // List of achievement IDs or text bullets
  technologies: string[];
  isVerified: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  location: string;
  grade?: string;
  isVerified: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Tech' | 'Soft' | 'Domain' | 'Tools';
  level: 'Junior' | 'Intermedio' | 'Avanzado' | 'Experto';
  yearsOfExperience: number;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Nativo';
  certificate?: string;
}

export interface LocationPreference {
  city: string;
  country: string;
  isPreferredHome: boolean; // Bilbao = true
  scoreMultiplier: number; // e.g. Bilbao = 1.0, Madrid = 0.85, Remote = 0.95
  openToRemote: boolean;
  openToRelocation: boolean;
}

export interface TargetRole {
  id: string;
  title: string;
  minSalaryExpected: number;
  desiredSalary: number;
  seniorityLevel: 'Junior' | 'Mid-Senior' | 'Senior' | 'Lead / Director';
  keywords: string[];
}

export interface PublicationProfileItem {
  id: string;
  title: string;
  outlet: string;
  date: string;
  url?: string;
  category: 'policy' | 'press' | 'essays' | 'scientific';
  summary: string;
  tags: string[];
}

export interface KeyProjectProfileItem {
  id: string;
  title: string;
  role: string;
  period: string;
  category: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  url?: string;
  githubUrl?: string;
}

export interface ConferenceProfileItem {
  id: string;
  title: string;
  event: string;
  location: string;
  date: string;
  role: string;
  summary: string;
  tags: string[];
}

export interface FieldEquipmentItem {
  id: string;
  name: string;
  category: 'Geophysics' | 'Atmosphere' | 'Hydrology' | 'Soils' | 'Remote Sensing';
  description: string;
}

export interface MasterProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string; // Default: Bilbao, España
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  preferredCity: string; // Bilbao
  locationPreferences: LocationPreference[];
  targetRoles: TargetRole[];
  minSalary: number;
  desiredSalary: number;
  experiences: WorkExperience[];
  education: Education[];
  skills: SkillItem[];
  languages: LanguageItem[];
  achievementsBank: Achievement[];
  otherCourses?: string[];
  publications?: PublicationProfileItem[];
  keyProjects?: KeyProjectProfileItem[];
  conferences?: ConferenceProfileItem[];
  fieldEquipment?: FieldEquipmentItem[];
  pendingFields: string[]; // List of unverified or missing profile items
  lastUpdated: string;
}

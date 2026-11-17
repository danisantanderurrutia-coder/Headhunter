export type AppTheme = 'arctic' | 'cyber' | 'dark' | 'luminous';

const THEME_KEY = 'job_search_os_theme_v4';

export const getStoredTheme = (): AppTheme => {
  try {
    const saved = localStorage.getItem(THEME_KEY) as AppTheme | null;
    if (saved && ['arctic', 'cyber', 'dark', 'luminous'].includes(saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'arctic'; // Default to the Tactical Arctic / Nieve Táctica high-visibility theme
};

export const saveStoredTheme = (theme: AppTheme): void => {
  localStorage.setItem(THEME_KEY, theme);
  applyThemeToDOM(theme);
};

export const applyThemeToDOM = (theme: AppTheme): void => {
  const root = document.documentElement;
  root.classList.remove('theme-luminous', 'theme-cyber', 'theme-dark', 'theme-arctic');
  root.classList.add(`theme-${theme}`);
  root.setAttribute('data-theme', theme);

  if (theme === 'cyber' || theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

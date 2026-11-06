import { describe, it, expect } from 'vitest';
import { APP_SLUGS, getSlugForState, parseSlugToState } from '../routes';

describe('routes · slugs de navegación', () => {
  it('contiene los slugs canónicos definidos para toda la plataforma', () => {
    expect(APP_SLUGS.DASHBOARD).toBe('/consola');
    expect(APP_SLUGS.MARKET_OFFERS).toBe('/mercado/ofertas');
    expect(APP_SLUGS.MARKET_BENCHMARK).toBe('/mercado/benchmark');
    expect(APP_SLUGS.DOSSIER_SHOWCASE).toBe('/perfil/resumen');
    expect(APP_SLUGS.DOSSIER_EXPEDIENTE).toBe('/perfil/expediente');
    expect(APP_SLUGS.ACADEMY).toBe('/academia');
    expect(APP_SLUGS.DOSSIER_CV_STUDIO).toBe('/perfil/cv-studio');
    expect(APP_SLUGS.DOSSIER_COVER_LETTER).toBe('/perfil/cover-letter');
    expect(APP_SLUGS.APPLICATIONS_ACTIVE).toBe('/candidaturas/activas');
    expect(APP_SLUGS.APPLICATIONS_PIPELINE).toBe('/candidaturas/pipeline');
    expect(APP_SLUGS.APPLICATIONS_INTELLIGENCE).toBe('/candidaturas/inteligencia');
    expect(APP_SLUGS.FUNDING).toBe('/convocatorias');
  });

  it('genera el slug correcto a partir de la estación y subpestaña', () => {
    expect(getSlugForState('dashboard')).toBe('/consola');
    expect(getSlugForState('market_radar', 'offers')).toBe('/mercado/ofertas');
    expect(getSlugForState('market_radar', 'benchmark')).toBe('/mercado/benchmark');
    expect(getSlugForState('market_radar', 'sources')).toBe('/mercado/fuentes');
    expect(getSlugForState('academy')).toBe('/academia');
    expect(getSlugForState('agent_dossier', 'profile')).toBe('/perfil/expediente');
    expect(getSlugForState('agent_dossier', 'expediente')).toBe('/perfil/expediente');
    expect(getSlugForState('agent_dossier', 'studio', 'cv')).toBe('/perfil/cv-studio');
    expect(getSlugForState('agent_dossier', 'studio', 'cover_letter')).toBe('/perfil/cover-letter');
    expect(getSlugForState('mission_control', 'intelligence')).toBe('/candidaturas/inteligencia');
  });

  it('parsea un slug de URL hacia el estado interno correcto de Empleo', () => {
    expect(parseSlugToState('/perfil/expediente')).toEqual({ station: 'agent_dossier', subTab: 'profile' });
    expect(parseSlugToState('/perfil/expediente-maestro')).toEqual({ station: 'agent_dossier', subTab: 'profile' });
    expect(parseSlugToState('/perfil/maestro')).toEqual({ station: 'agent_dossier', subTab: 'profile' });
    expect(parseSlugToState('/perfil/resumen')).toEqual({ station: 'agent_dossier', subTab: 'showcase' });
    expect(parseSlugToState('/perfil/competencias')).toEqual({ station: 'agent_dossier', subTab: 'showcase' });
    expect(parseSlugToState('/mercado/organizaciones')).toEqual({ station: 'market_radar', subTab: 'organizations' });
    expect(parseSlugToState('/mercado/benchmark')).toEqual({ station: 'market_radar', subTab: 'benchmark' });
    expect(parseSlugToState('/mercado/matriz')).toEqual({ station: 'market_radar', subTab: 'benchmark' });
    expect(parseSlugToState('/mercado/portales')).toEqual({ station: 'market_radar', subTab: 'portals' });
    expect(parseSlugToState('/candidaturas/pipeline')).toEqual({ station: 'mission_control', subTab: 'applications' });
    expect(parseSlugToState('/academia')).toEqual({ station: 'academy' });
    expect(parseSlugToState('/perfil/academia')).toEqual({ station: 'academy' });
    expect(parseSlugToState('/perfil/academy')).toEqual({ station: 'academy' });
    expect(parseSlugToState('/perfil/cv-studio')).toEqual({ station: 'agent_dossier', subTab: 'studio', docType: 'cv' });
    expect(parseSlugToState('/perfil/cover-letter')).toEqual({ station: 'agent_dossier', subTab: 'studio', docType: 'cover_letter' });
    expect(parseSlugToState('/candidaturas/inteligencia')).toEqual({ station: 'mission_control', subTab: 'intelligence' });
    expect(parseSlugToState('/convocatorias')).toEqual({ station: 'funding' });
    expect(parseSlugToState('/ajustes')).toEqual({ station: 'settings' });
    expect(parseSlugToState('/')).toEqual({ station: 'dashboard' });
  });
});

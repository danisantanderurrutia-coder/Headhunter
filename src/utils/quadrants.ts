import type { CompanyDossier, QuadrantType, CompanySectorCluster } from '../types/companies';

export const inferCompanyQuadrants = (comp: CompanyDossier): QuadrantType[] => {
  if (comp.quadrants && comp.quadrants.length > 0) return comp.quadrants;
  const text = `${comp.name} ${comp.headquarters} ${comp.sector} ${comp.description}`.toLowerCase();
  const quads: QuadrantType[] = [];
  
  if (
    text.includes('alemania') || 
    text.includes('germany') || 
    text.includes('berlin') || 
    text.includes('berlín') || 
    text.includes('münchen') || 
    text.includes('munich') || 
    text.includes('potsdam') || 
    text.includes('braunschweig') || 
    text.includes('leipzig') || 
    text.includes('bonn') || 
    text.includes('colonia') || 
    text.includes('köln') || 
    text.includes('essen') || 
    text.includes('jülich') || 
    text.includes('dessau') || 
    text.includes('greifswald') || 
    text.includes('bremerhaven') || 
    text.includes('suiza') || 
    text.includes('switzerland') || 
    text.includes('austria') || 
    text.includes('dach')
  ) {
    quads.push('DACH');
  }
  
  if (
    text.includes('bilbao') || 
    text.includes('bizkaia') || 
    text.includes('gipuzkoa') || 
    text.includes('donostia') || 
    text.includes('vitoria') || 
    text.includes('álava') || 
    text.includes('alava') || 
    text.includes('euskadi') || 
    text.includes('vasc') || 
    text.includes('derio') || 
    text.includes('zamudio') || 
    text.includes('arkaute') || 
    text.includes('leioa') || 
    text.includes('pasaia')
  ) {
    quads.push('EUSKADI');
  }

  if (
    text.includes('londres') || 
    text.includes('london') || 
    text.includes('bristol') || 
    text.includes('oxford') || 
    text.includes('edimburgo') || 
    text.includes('edinburgh') || 
    text.includes('reino unido') || 
    text.includes('united kingdom') || 
    text.includes('uk') || 
    text.includes('wageningen') || 
    text.includes('amsterdam') || 
    text.includes('la haya') || 
    text.includes('the hague') || 
    text.includes('utrecht') || 
    text.includes('países bajos') || 
    text.includes('netherlands') || 
    text.includes('holanda')
  ) {
    quads.push('UK_NL');
  }

  if (
    text.includes('finlandia') || 
    text.includes('finland') || 
    text.includes('helsinki') || 
    text.includes('joensuu') || 
    text.includes('oulu') || 
    text.includes('suecia') || 
    text.includes('sweden') || 
    text.includes('estocolmo') || 
    text.includes('stockholm') || 
    text.includes('uppsala') || 
    text.includes('noruega') || 
    text.includes('norway') || 
    text.includes('oslo') || 
    text.includes('dinamarca') || 
    text.includes('denmark') || 
    text.includes('copenhague') || 
    text.includes('copenhagen')
  ) {
    quads.push('NORDICS');
  }

  if (
    text.includes('canadá') || 
    text.includes('canada') || 
    text.includes('montreal') || 
    text.includes('vancouver') || 
    text.includes('calgary') || 
    text.includes('ottawa') || 
    text.includes('quebec')
  ) {
    quads.push('CANADA_GLOBAL');
  }

  if (
    text.includes('remoto') || 
    text.includes('remote') || 
    text.includes('internacional') || 
    text.includes('global') || 
    text.includes('mundial') || 
    text.includes('ue') || 
    text.includes('europa')
  ) {
    quads.push('GLOBAL');
  }
  
  return quads.length > 0 ? quads : ['GLOBAL'];
};

export const inferCompanySectorCluster = (comp: CompanyDossier): CompanySectorCluster => {
  if (comp.sectorCluster && comp.sectorCluster !== 'ALL') return comp.sectorCluster;
  const text = `${comp.name} ${comp.sector} ${comp.description} ${(comp.keyProjects || []).join(' ')}`.toLowerCase();

  // 1. Observación de la Tierra, Gemelos Digitales & Agrotech
  if (
    text.includes('teledetección') || 
    text.includes('teledeteccion') || 
    text.includes('remote sensing') || 
    text.includes('earth observation') || 
    text.includes('sentinel') || 
    text.includes('copernicus') || 
    text.includes('constellr') || 
    text.includes('ororatech') || 
    text.includes('planet labs') || 
    text.includes('agreena') || 
    text.includes('gemelo digital') || 
    text.includes('digital twin') || 
    text.includes('agrotech') || 
    text.includes('three.js')
  ) {
    return 'EARTH_OBSERVATION_AGROTECH';
  }

  // 2. Carbon-Tech & Calificación MRV
  if (
    text.includes('carbon-tech') || 
    text.includes('calificación de carbono') || 
    text.includes('rating de carbono') || 
    text.includes('créditos de carbono') || 
    text.includes('carbon accounting') || 
    text.includes('carbon removal') || 
    text.includes('sylvera') || 
    text.includes('bezero') || 
    text.includes('agreena') || 
    text.includes('pachama') || 
    text.includes('ghgsat') || 
    text.includes('carboculture') || 
    text.includes('space intelligence') || 
    (text.includes('mrv') && !text.includes('universidad'))
  ) {
    return 'CARBON_TECH_MRV';
  }

  // 3. Cat Risk & Seguros Climáticos / Reaseguro
  if (
    text.includes('cat risk') || 
    text.includes('cat modeling') || 
    text.includes('reaseguro') || 
    text.includes('reinsurance') || 
    text.includes('seguro paramétrico') || 
    text.includes('parametric') || 
    text.includes('mitiga') || 
    text.includes('descartes underwriting') || 
    text.includes('munich re') || 
    text.includes('swiss re') || 
    text.includes('kettle') || 
    text.includes('guy carpenter') || 
    text.includes('fathom')
  ) {
    return 'CAT_RISK_INSURANCE';
  }

  // 4. Organismos Multilaterales & Políticas
  if (
    text.includes('multilateral') || 
    text.includes('giz') || 
    text.includes('unfccc') || 
    text.includes('unccd') || 
    text.includes('naciones unidas') || 
    text.includes('united nations') || 
    text.includes('política climática') || 
    text.includes('salvaguardias') || 
    text.includes('litigio climático') || 
    text.includes('clientearth') || 
    text.includes('think tank') || 
    text.includes('banco de desarrollo') || 
    text.includes('ongd') || 
    text.includes('cooperación internacional') || 
    text.includes('sociedad pública de gestión') || 
    text.includes('ihobe') || 
    text.includes('aclima') || 
    text.includes('e3g') || 
    text.includes('iddri')
  ) {
    return 'MULTILATERAL_POLICY';
  }

  // 5. I+D Público & Centros Científicos (Default natural)
  return 'RD_PUBLIC';
};

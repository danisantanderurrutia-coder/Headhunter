import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Star
} from 'lucide-react';
import type { CompanyDossier, CompanySectorCluster } from '../../types/companies';
import { analyzeCompanyFit } from '../../utils/companyFit';
import { inferCompanySectorCluster } from '../../utils/quadrants';

interface CompaniesWorldMapProps {
  companies: CompanyDossier[];
  onOpenDossier: (company: CompanyDossier) => void;
  favorites: Set<string>;
  onToggleFavorite: (companyId: string, e?: React.MouseEvent) => void;
}

// Basemap Tile Providers (from Hombros project: Satellite HD, Bio-Digital Dark, and Topo Relief)
const TILE_LAYERS = {
  dark: {
    id: 'dark',
    name: '🌌 Bio-Digital Nocturno',
    tag: 'Carto Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap'
  },
  satellite: {
    id: 'satellite',
    name: '🛰️ Satélite HD Fotográfico',
    tag: 'Esri World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics'
  },
  relief: {
    id: 'relief',
    name: '🏔️ Relieve & Cuencas',
    tag: 'Esri World Shaded Relief',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; USGS, NOAA'
  }
};

type TileKey = keyof typeof TILE_LAYERS;

// Strategic Geographic Regions for quick map jumps
const MAP_REGIONS = [
  { id: 'world', name: '🌍 Red Global', center: [48.0, 10.0] as [number, number], zoom: 4 },
  { id: 'euskadi', name: '🇪🇸 Euskadi / Bilbao', center: [43.2630, -2.9350] as [number, number], zoom: 8 },
  { id: 'dach', name: '🇩🇪 Alemania / DACH', center: [50.5, 10.5] as [number, number], zoom: 6 },
  { id: 'netherlands', name: '🇳🇱 Países Bajos & UK', center: [52.2, 3.5] as [number, number], zoom: 6.5 },
  { id: 'mediterranean', name: '🇮🇹 Italia & Grecia', center: [42.0, 16.0] as [number, number], zoom: 5.5 },
  { id: 'nordics', name: '🇸🇪 Nórdicos', center: [60.5, 18.0] as [number, number], zoom: 5 }
];

/**
 * Resolves city coordinates with deterministic jitter so overlapping pins in the same city
 * don't overlap directly on top of each other.
 */
const resolveCoordinates = (hq: string, id: string): [number, number] => {
  const text = hq.toLowerCase();

  // Pseudo-random offset based on company ID hash to spread pins in the same metro area
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
  const radius = 0.035 + (Math.abs(hash) % 30) * 0.001; // ~3-5 km spread
  const dLat = Math.sin(angle) * radius;
  const dLng = Math.cos(angle) * radius;

  // 1. Euskadi / España
  if (text.includes('bilbao') || text.includes('zamudio') || text.includes('derio') || text.includes('leioa') || text.includes('zorrotzaurre') || text.includes('elorrio') || text.includes('bizkaia')) {
    return [43.2630 + dLat, -2.9350 + dLng];
  }
  if (text.includes('donostia') || text.includes('san sebastián') || text.includes('pasaia') || text.includes('gipuzkoa') || text.includes('sukarrieta')) {
    return [43.3183 + dLat, -1.9812 + dLng];
  }
  if (text.includes('vitoria') || text.includes('gasteiz') || text.includes('arkaute') || text.includes('miñano') || text.includes('álava')) {
    return [42.8467 + dLat, -2.6716 + dLng];
  }
  if (text.includes('madrid')) {
    return [40.4168 + dLat, -3.7038 + dLng];
  }
  if (text.includes('barcelona') || text.includes('cerdanyola')) {
    return [41.3879 + dLat, 2.1699 + dLng];
  }
  if (text.includes('zaragoza')) {
    return [41.6488 + dLat, -0.8891 + dLng];
  }

  // 2. Alemania (DACH)
  if (text.includes('garmisch')) {
    return [47.4921 + dLat, 11.0955 + dLng];
  }
  if (text.includes('münchen') || text.includes('munich') || text.includes('freising') || text.includes('oberpfaffenhofen')) {
    return [48.1351 + dLat, 11.5820 + dLng];
  }
  if (text.includes('karlsruhe')) {
    return [49.0069 + dLat, 8.4037 + dLng];
  }
  if (text.includes('jena')) {
    return [50.9271 + dLat, 11.5892 + dLng];
  }
  if (text.includes('potsdam') || text.includes('telegrafenberg')) {
    return [52.3906 + dLat, 13.0645 + dLng];
  }
  if (text.includes('berlin') || text.includes('berlín')) {
    return [52.5200 + dLat, 13.4050 + dLng];
  }
  if (text.includes('leipzig')) {
    return [51.3397 + dLat, 12.3731 + dLng];
  }
  if (text.includes('dessau')) {
    return [51.8386 + dLat, 12.2456 + dLng];
  }
  if (text.includes('braunschweig')) {
    return [52.2689 + dLat, 10.5268 + dLng];
  }
  if (text.includes('greifswald')) {
    return [54.0931 + dLat, 13.3879 + dLng];
  }
  if (text.includes('bonn')) {
    return [50.7374 + dLat, 7.0982 + dLng];
  }
  if (text.includes('jülich')) {
    return [50.9224 + dLat, 6.3609 + dLng];
  }
  if (text.includes('essen')) {
    return [51.4556 + dLat, 7.0116 + dLng];
  }
  if (text.includes('kiel')) {
    return [54.3233 + dLat, 10.1228 + dLng];
  }

  // 3. Austria & Suiza
  if (text.includes('laxenburg') || text.includes('viena') || text.includes('austria')) {
    return [48.2082 + dLat, 16.3738 + dLng];
  }
  if (text.includes('zúrich') || text.includes('zurich') || text.includes('suiza') || text.includes('berna')) {
    return [47.3769 + dLat, 8.5417 + dLng];
  }

  // 4. Países Bajos & Bélgica
  if (text.includes('delft')) {
    return [52.0116 + dLat, 4.3571 + dLng];
  }
  if (text.includes('utrecht') || text.includes('de bilt')) {
    return [52.0907 + dLat, 5.1214 + dLng];
  }
  if (text.includes('amsterdam') || text.includes('ámsterdam')) {
    return [52.3676 + dLat, 4.9041 + dLng];
  }
  if (text.includes('wageningen')) {
    return [51.9692 + dLat, 5.6654 + dLng];
  }
  if (text.includes('la haya') || text.includes('the hague')) {
    return [52.0705 + dLat, 4.3007 + dLng];
  }
  if (text.includes('bruselas') || text.includes('lovaina') || text.includes('bélgica')) {
    return [50.8503 + dLat, 4.3517 + dLng];
  }

  // 5. Reino Unido & Irlanda
  if (text.includes('londres') || text.includes('london')) {
    return [51.5074 + dLat, -0.1278 + dLng];
  }
  if (text.includes('cambridge')) {
    return [52.2053 + dLat, 0.1218 + dLng];
  }
  if (text.includes('bristol')) {
    return [51.4545 + dLat, -2.5879 + dLng];
  }
  if (text.includes('oxford')) {
    return [51.7520 + dLat, -1.2577 + dLng];
  }
  if (text.includes('edimburgo') || text.includes('edinburgh')) {
    return [55.9533 + dLat, -3.1883 + dLng];
  }
  if (text.includes('dublín') || text.includes('dublin') || text.includes('irlanda')) {
    return [53.3498 + dLat, -6.2603 + dLng];
  }

  // 6. Francia
  if (text.includes('parís') || text.includes('paris') || text.includes('francia')) {
    return [48.8566 + dLat, 2.3522 + dLng];
  }

  // 7. Italia
  if (text.includes('ispra') || text.includes('varese') || text.includes('lago maggiore')) {
    return [45.8131 + dLat, 8.6128 + dLng];
  }
  if (text.includes('bolzano') || text.includes('bozen')) {
    return [46.4983 + dLat, 11.3548 + dLng];
  }
  if (text.includes('bologna') || text.includes('lecce')) {
    return [44.4949 + dLat, 11.3426 + dLng];
  }
  if (text.includes('milán') || text.includes('milan')) {
    return [45.4642 + dLat, 9.1900 + dLng];
  }
  if (text.includes('roma') || text.includes('pisa') || text.includes('italia')) {
    return [41.9028 + dLat, 12.4964 + dLng];
  }

  // 8. Grecia
  if (text.includes('atenas') || text.includes('athens')) {
    return [37.9838 + dLat, 23.7275 + dLng];
  }
  if (text.includes('heraclión') || text.includes('patras') || text.includes('creta') || text.includes('grecia')) {
    return [35.3387 + dLat, 25.1442 + dLng];
  }

  // 9. Nórdicos
  if (text.includes('copenhague') || text.includes('dinamarca')) {
    return [55.6761 + dLat, 12.5683 + dLng];
  }
  if (text.includes('estocolmo') || text.includes('stockholm') || text.includes('uppsala')) {
    return [59.3293 + dLat, 18.0686 + dLng];
  }
  if (text.includes('norrk')) {
    return [58.5877 + dLat, 16.1924 + dLng];
  }
  if (text.includes('helsinki') || text.includes('espoo') || text.includes('joensuu') || text.includes('oulu') || text.includes('finlandia')) {
    return [60.1699 + dLat, 24.9384 + dLng];
  }
  if (text.includes('oslo') || text.includes('kjeller') || text.includes('tromsø') || text.includes('noruega')) {
    return [59.9139 + dLat, 10.7522 + dLng];
  }

  // 10. Norteamérica
  if (text.includes('calgary') || text.includes('saskatoon') || text.includes('alberta')) {
    return [51.0447 + dLat, -114.0719 + dLng];
  }
  if (text.includes('montreal') || text.includes('quebec') || text.includes('canadá')) {
    return [45.5017 + dLat, -73.5673 + dLng];
  }
  if (text.includes('houston') || text.includes('texas')) {
    return [29.7604 + dLat, -95.3698 + dLng];
  }
  if (text.includes('san francisco') || text.includes('pasadena') || text.includes('california')) {
    return [37.7749 + dLat, -122.4194 + dLng];
  }

  // 11. Chile / Sudamérica
  if (text.includes('chile') || text.includes('santiago') || text.includes('maule') || text.includes('valparaíso')) {
    return [-33.4489 + dLat, -70.6693 + dLng];
  }

  // Default Central Europe Hub
  return [50.0 + dLat, 8.5 + dLng];
};

const getHaloColorForCluster = (cluster: CompanySectorCluster): string => {
  switch (cluster) {
    case 'CARBON_TECH_MRV': return '#10b981'; // Emerald
    case 'RD_PUBLIC': return '#14b8a6';       // Teal
    case 'CAT_RISK_INSURANCE': return '#f59e0b'; // Amber
    case 'MULTILATERAL_POLICY': return '#a855f7'; // Purple
    case 'GEOTHERMAL_ENERGY': return '#f97316';   // Orange
    default: return '#06b6d4';                 // Cyan
  }
};

export const CompaniesWorldMap: React.FC<CompaniesWorldMapProps> = ({
  companies,
  onOpenDossier,
  favorites,
  onToggleFavorite
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeTileKey, setActiveTileKey] = useState<TileKey>('dark');
  const [selectedCompany, setSelectedCompany] = useState<CompanyDossier | null>(null);
  const [isLayerSelectorOpen, setIsLayerSelectorOpen] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch {
        // ignore cleanup error
      }
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [50.0, 10.0],
      zoom: 4.5,
      minZoom: 2.2,
      maxZoom: 16,
      worldCopyJump: true,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add base tile layer
    const baseLayer = L.tileLayer(TILE_LAYERS.dark.url, {
      maxZoom: 18,
      subdomains: 'abcd',
      noWrap: false
    }).addTo(map);
    tileLayerRef.current = baseLayer;

    // Markers layer group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Fix possible layout sizing lag
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore cleanup
        }
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when user toggles
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const newLayer = L.tileLayer(TILE_LAYERS[activeTileKey].url, {
      maxZoom: 18,
      subdomains: 'abcd',
      noWrap: false
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [activeTileKey]);

  // Update Markers when companies change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    companies.forEach(comp => {
      const coords = resolveCoordinates(comp.headquarters, comp.id);
      const cluster = inferCompanySectorCluster(comp);
      const haloColor = getHaloColorForCluster(cluster);
      const fit = analyzeCompanyFit(comp);
      const isSelected = selectedCompany?.id === comp.id;

      // Extract initials or domain
      const initials = comp.name
        .replace(/^(the|el|la|los|las|de|von|der)\s+/i, '')
        .split(/[\s-]+/)
        .filter(w => w.length > 0)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('');

      const domain = comp.website 
        ? (() => {
            try {
              const url = comp.website.startsWith('http') ? comp.website : `https://${comp.website}`;
              return new URL(url).hostname.replace(/^www\./, '');
            } catch {
              return '';
            }
          })()
        : '';

      const faviconUrl = domain 
        ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
        : '';

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 38px; height: 38px;">
          <!-- Outer Pulsing Glow Ring -->
          <div class="absolute -inset-2.5 rounded-full ${isSelected ? 'animate-pulse' : 'group-hover:scale-125'} transition-all duration-300" 
               style="background-color: ${haloColor}; opacity: ${isSelected ? 0.7 : 0.25}; filter: blur(4px);"></div>
          
          <!-- Mid Cybernetic Selection Border Ring -->
          <div class="w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-2xl border-2 overflow-hidden bg-slate-900" 
               style="border-color: ${haloColor}; box-shadow: 0 0 14px ${haloColor}60;">
            ${faviconUrl 
              ? `<img src="${faviconUrl}" alt="${comp.name}" class="w-5 h-5 object-contain rounded-md" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                 <span style="display:none; color:${haloColor}; font-family:monospace; font-weight:900; font-size:10px;">${initials}</span>`
              : `<span style="color:${haloColor}; font-family:monospace; font-weight:900; font-size:10px;">${initials}</span>`
            }
          </div>

          <!-- Pinned HUD Match Badge -->
          <div class="absolute -top-3.5 right-[-8px] px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono shadow-lg border border-slate-700 bg-slate-950 text-emerald-300">
            ${fit.score}%
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-hombros-company-pin',
        html: iconHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -22]
      });

      const marker = L.marker(coords, { icon: customIcon });

      // Click: fly to center and select company
      marker.on('click', () => {
        setSelectedCompany(comp);
        mapInstanceRef.current?.flyTo(coords, Math.max(mapInstanceRef.current.getZoom(), 7.5), {
          duration: 1.1,
          easeLinearity: 0.25
        });
      });

      // Hover Tooltip
      marker.bindTooltip(`
        <div class="p-2.5 font-mono text-xs space-y-1.5 max-w-[240px] bg-slate-950/95 text-white border border-slate-700 rounded-xl shadow-2xl">
          <div class="font-bold text-sm text-cyan-300 font-sans leading-tight line-clamp-2">${comp.name}</div>
          <div class="text-[10px] text-slate-400">📍 ${comp.headquarters}</div>
          <div class="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
            <span class="text-slate-400">${comp.sector.slice(0, 24)}...</span>
            <span class="font-bold font-mono text-emerald-400">${fit.score}% Fit</span>
          </div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -18],
        className: 'custom-leaflet-tooltip'
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [companies, selectedCompany]);

  // Jump to region helper
  const handleJumpRegion = (reg: typeof MAP_REGIONS[0]) => {
    mapInstanceRef.current?.flyTo(reg.center, reg.zoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  };

  const selectedFit = selectedCompany ? analyzeCompanyFit(selectedCompany) : null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 animate-fadeIn">
      {/* =========================================================================
       * 1. TOP OVERLAY CONTROLS (JUMP REGIONS & TILE SELECTOR)
       * ========================================================================= */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Quick Region Jump Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 backdrop-blur-md rounded-2xl border border-slate-800/90 shadow-xl overflow-x-auto max-w-full pointer-events-auto">
          {MAP_REGIONS.map(reg => (
            <button
              key={reg.id}
              onClick={() => handleJumpRegion(reg)}
              className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0 border border-transparent hover:border-slate-700"
            >
              {reg.name}
            </button>
          ))}
        </div>

        {/* Top Right Controls: Tile selector & Zoom */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Tile Layer Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLayerSelectorOpen(!isLayerSelectorOpen)}
              className="px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-slate-200 border border-slate-800 text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md shadow-xl transition cursor-pointer"
            >
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{TILE_LAYERS[activeTileKey].name}</span>
            </button>

            {isLayerSelectorOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-slate-950/95 border border-slate-800 p-2 shadow-2xl backdrop-blur-xl space-y-1 z-50">
                {(Object.keys(TILE_LAYERS) as TileKey[]).map(key => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTileKey(key);
                      setIsLayerSelectorOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center justify-between cursor-pointer ${
                      activeTileKey === key 
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' 
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span>{TILE_LAYERS[key].name}</span>
                    <span className="text-[10px] opacity-70">{TILE_LAYERS[key].tag.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-950/90 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md shadow-xl">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-1.5 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Acercar mapa"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-800"></div>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-1.5 hover:bg-slate-800 text-slate-300 transition cursor-pointer"
              title="Alejar mapa"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. MAP CANVAS (LEAFLET CONTAINER)
       * ========================================================================= */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[580px] sm:h-[650px] z-10 select-none bg-slate-950"
      />

      {/* =========================================================================
       * 3. BOTTOM FLOATING DOSSIER CARD (WHEN A PIN IS CLICKED)
       * ========================================================================= */}
      {selectedCompany && (
        <div className="absolute bottom-4 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md z-[1000] p-4 rounded-3xl bg-[#0b101e]/95 border border-cyan-500/50 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-fadeIn space-y-3">
          
          {/* Card Top: Logo + Name + Close */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center shrink-0 shadow-inner">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${new URL(selectedCompany.website.startsWith('http') ? selectedCompany.website : `https://${selectedCompany.website}`).hostname}&sz=128`}
                  alt={selectedCompany.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div>
                <h4 className="font-bold text-sm text-white font-sans line-clamp-1">
                  {selectedCompany.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  📍 {selectedCompany.headquarters}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] px-2 py-0.2 rounded-full font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {selectedCompany.sector.slice(0, 26)}
                  </span>
                  {selectedFit && (
                    <span className="text-[10px] px-2 py-0.2 rounded-full font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-0.5">
                      <Sparkles className="h-2.5 w-2.5 text-emerald-400" />
                      {selectedFit.score}% Fit
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => onToggleFavorite(selectedCompany.id, e)}
                className="p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer text-slate-400 hover:text-amber-400"
                title={favorites.has(selectedCompany.id) ? 'Quitar de guardados' : 'Guardar en favoritos'}
              >
                <Star className={`h-4 w-4 ${favorites.has(selectedCompany.id) ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
              </button>

              <button
                onClick={() => setSelectedCompany(null)}
                className="p-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {selectedCompany.description}
          </p>

          {/* Winning Angle Snippet */}
          {selectedFit && (
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-[11px] text-cyan-200/90 font-mono line-clamp-2">
              💡 {selectedFit.winningAngle}
            </div>
          )}

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <a
              href={selectedCompany.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer truncate"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span>Ir a la página</span>
            </a>

            <button
              onClick={() => onOpenDossier(selectedCompany)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer truncate"
            >
              <Eye className="h-3.5 w-3.5 shrink-0" />
              <span>Más información</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Legend Overlay (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-[1000] p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 backdrop-blur-md shadow-xl text-[10px] font-mono text-slate-400 hidden sm:flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Carbon-Tech / MRV</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
          <span>I+D Público</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Cat Risk</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>Políticas</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span>Geotermia</span>
        </span>
      </div>
    </div>
  );
};

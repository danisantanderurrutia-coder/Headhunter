import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ExternalLink, 
  Eye, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Star
} from 'lucide-react';
import type { CompanyDossier } from '../../types/companies';
import { analyzeCompanyFit } from '../../utils/companyFit';
import { resolveCompanyLogoDetails } from '../../utils/companyLogos';
import { resolveScrapingTierMeta } from '../../utils/scrapingTiers';

interface CompaniesWorldMapProps {
  companies: CompanyDossier[];
  onOpenDossier: (company: CompanyDossier) => void;
  favorites: Set<string>;
  onToggleFavorite: (companyId: string, e?: React.MouseEvent) => void;
}

// OpenStreetMap standard tile layer (100% free, reliable, no API key required)
const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';

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

  const matchLocation = (target: string): [number, number] | null => {
    // 1. Euskadi / España
    if (target.includes('bilbao') || target.includes('zamudio') || target.includes('derio') || target.includes('leioa') || target.includes('zorrotzaurre') || target.includes('elorrio') || target.includes('bizkaia')) {
      return [43.2630 + dLat, -2.9350 + dLng];
    }
    if (target.includes('donostia') || target.includes('san sebastián') || target.includes('pasaia') || target.includes('gipuzkoa') || target.includes('sukarrieta')) {
      return [43.3183 + dLat, -1.9812 + dLng];
    }
    if (target.includes('vitoria') || target.includes('gasteiz') || target.includes('arkaute') || target.includes('miñano') || target.includes('álava')) {
      return [42.8467 + dLat, -2.6716 + dLng];
    }
    if (target.includes('madrid')) {
      return [40.4168 + dLat, -3.7038 + dLng];
    }
    if (target.includes('barcelona') || target.includes('cerdanyola') || target.includes('bellaterra') || target.includes('icta')) {
      return [41.3879 + dLat, 2.1699 + dLng];
    }
    if (target.includes('zaragoza')) {
      return [41.6488 + dLat, -0.8891 + dLng];
    }
    if (target.includes('vícar') || target.includes('vicar') || target.includes('almería') || target.includes('almeria')) {
      return [36.8381 + dLat, -2.4597 + dLng];
    }

    // 2. Alemania (DACH)
    if (target.includes('garmisch')) {
      return [47.4921 + dLat, 11.0955 + dLng];
    }
    if (target.includes('münchen') || target.includes('munich') || target.includes('freising') || target.includes('oberpfaffenhofen')) {
      return [48.1351 + dLat, 11.5820 + dLng];
    }
    if (target.includes('karlsruhe')) {
      return [49.0069 + dLat, 8.4037 + dLng];
    }
    if (target.includes('freiburg')) {
      return [47.9990 + dLat, 7.8421 + dLng];
    }
    if (target.includes('heidelberg')) {
      return [49.3988 + dLat, 8.6724 + dLng];
    }
    if (target.includes('stuttgart') || target.includes('hohenheim')) {
      return [48.7758 + dLat, 9.1829 + dLng];
    }
    if (target.includes('jena')) {
      return [50.9271 + dLat, 11.5892 + dLng];
    }
    if (target.includes('potsdam') || target.includes('telegrafenberg')) {
      return [52.3906 + dLat, 13.0645 + dLng];
    }
    if (target.includes('berlin') || target.includes('berlín')) {
      return [52.5200 + dLat, 13.4050 + dLng];
    }
    if (target.includes('leipzig')) {
      return [51.3397 + dLat, 12.3731 + dLng];
    }
    if (target.includes('dessau')) {
      return [51.8386 + dLat, 12.2456 + dLng];
    }
    if (target.includes('braunschweig')) {
      return [52.2689 + dLat, 10.5268 + dLng];
    }
    if (target.includes('greifswald')) {
      return [54.0931 + dLat, 13.3879 + dLng];
    }
    if (target.includes('bonn')) {
      return [50.7374 + dLat, 7.0982 + dLng];
    }
    if (target.includes('jülich')) {
      return [50.9224 + dLat, 6.3609 + dLng];
    }
    if (target.includes('essen')) {
      return [51.4556 + dLat, 7.0116 + dLng];
    }
    if (target.includes('kiel')) {
      return [54.3233 + dLat, 10.1228 + dLng];
    }
    if (target.includes('wuppertal')) {
      return [51.2562 + dLat, 7.1508 + dLng];
    }
    if (target.includes('dresden') || target.includes('dresde')) {
      return [51.0504 + dLat, 13.7373 + dLng];
    }

    // 3. Austria & Suiza
    if (target.includes('laxenburg') || target.includes('viena') || target.includes('wien') || target.includes('austria')) {
      return [48.2082 + dLat, 16.3738 + dLng];
    }
    if (target.includes('lausanne') || target.includes('lausana') || target.includes('epfl')) {
      return [46.5191 + dLat, 6.5668 + dLng];
    }
    if (target.includes('dübendorf') || target.includes('duebendorf') || target.includes('eawag')) {
      return [47.4032 + dLat, 8.6105 + dLng];
    }
    if (target.includes('birmensdorf') || target.includes('wsl')) {
      return [47.3553 + dLat, 8.4377 + dLng];
    }
    if (target.includes('bern') || target.includes('berna')) {
      return [46.9480 + dLat, 7.4474 + dLng];
    }
    if (target.includes('geneva') || target.includes('ginebra') || target.includes('genf')) {
      return [46.2044 + dLat, 6.1432 + dLng];
    }
    if (target.includes('zúrich') || target.includes('zurich') || target.includes('suiza') || target.includes('ethz') || target.includes('uzh')) {
      return [47.3769 + dLat, 8.5417 + dLng];
    }

    // 4. Países Bajos & Bélgica
    if (target.includes('delft')) {
      return [52.0116 + dLat, 4.3571 + dLng];
    }
    if (target.includes('utrecht') || target.includes('de bilt')) {
      return [52.0907 + dLat, 5.1214 + dLng];
    }
    if (target.includes('amsterdam') || target.includes('ámsterdam')) {
      return [52.3676 + dLat, 4.9041 + dLng];
    }
    if (target.includes('wageningen')) {
      return [51.9692 + dLat, 5.6654 + dLng];
    }
    if (target.includes('la haya') || target.includes('the hague')) {
      return [52.0705 + dLat, 4.3007 + dLng];
    }
    if (target.includes('bruselas') || target.includes('lovaina') || target.includes('bélgica')) {
      return [50.8503 + dLat, 4.3517 + dLng];
    }
    if (target.includes('luxemburgo') || target.includes('luxembourg') || target.includes('belvaux')) {
      return [49.5042 + dLat, 5.9264 + dLng];
    }

    // 5. Reino Unido & Irlanda
    if (target.includes('londres') || target.includes('london')) {
      return [51.5074 + dLat, -0.1278 + dLng];
    }
    if (target.includes('cambridge')) {
      return [52.2053 + dLat, 0.1218 + dLng];
    }
    if (target.includes('bristol')) {
      return [51.4545 + dLat, -2.5879 + dLng];
    }
    if (target.includes('oxford')) {
      return [51.7520 + dLat, -1.2577 + dLng];
    }
    if (target.includes('edimburgo') || target.includes('edinburgh')) {
      return [55.9533 + dLat, -3.1883 + dLng];
    }
    if (target.includes('dublín') || target.includes('dublin') || target.includes('irlanda')) {
      return [53.3498 + dLat, -6.2603 + dLng];
    }

    // 6. Francia
    if (target.includes('parís') || target.includes('paris') || target.includes('francia')) {
      return [48.8566 + dLat, 2.3522 + dLng];
    }

    // 7. Italia
    if (target.includes('ispra') || target.includes('varese') || target.includes('lago maggiore')) {
      return [45.8131 + dLat, 8.6128 + dLng];
    }
    if (target.includes('bolzano') || target.includes('bozen')) {
      return [46.4983 + dLat, 11.3548 + dLng];
    }
    if (target.includes('bologna') || target.includes('lecce')) {
      return [44.4949 + dLat, 11.3426 + dLng];
    }
    if (target.includes('milán') || target.includes('milan')) {
      return [45.4642 + dLat, 9.1900 + dLng];
    }
    if (target.includes('roma') || target.includes('pisa') || target.includes('italia')) {
      return [41.9028 + dLat, 12.4964 + dLng];
    }

    // 8. Grecia
    if (target.includes('atenas') || target.includes('athens')) {
      return [37.9838 + dLat, 23.7275 + dLng];
    }
    if (target.includes('heraclión') || target.includes('patras') || target.includes('creta') || target.includes('grecia')) {
      return [35.3387 + dLat, 25.1442 + dLng];
    }

    // 9. Nórdicos
    if (target.includes('aarhus')) {
      return [56.1629 + dLat, 10.2039 + dLng];
    }
    if (target.includes('lyngby')) {
      return [55.7704 + dLat, 12.5038 + dLng];
    }
    if (target.includes('lund')) {
      return [55.7047 + dLat, 13.1910 + dLng];
    }
    if (target.includes('copenhague') || target.includes('dinamarca')) {
      return [55.6761 + dLat, 12.5683 + dLng];
    }
    if (target.includes('estocolmo') || target.includes('stockholm') || target.includes('uppsala')) {
      return [59.3293 + dLat, 18.0686 + dLng];
    }
    if (target.includes('norrk')) {
      return [58.5877 + dLat, 16.1924 + dLng];
    }
    if (target.includes('helsinki') || target.includes('espoo') || target.includes('joensuu') || target.includes('oulu') || target.includes('finlandia')) {
      return [60.1699 + dLat, 24.9384 + dLng];
    }
    if (target.includes('oslo') || target.includes('kjeller') || target.includes('tromsø') || target.includes('noruega')) {
      return [59.9139 + dLat, 10.7522 + dLng];
    }

    // 10. Norteamérica
    if (target.includes('calgary') || target.includes('saskatoon') || target.includes('alberta')) {
      return [51.0447 + dLat, -114.0719 + dLng];
    }
    if (target.includes('montreal') || target.includes('quebec') || target.includes('canadá')) {
      return [45.5017 + dLat, -73.5673 + dLng];
    }
    if (target.includes('houston') || target.includes('texas')) {
      return [29.7604 + dLat, -95.3698 + dLng];
    }
    if (target.includes('san francisco') || target.includes('pasadena') || target.includes('california')) {
      return [37.7749 + dLat, -122.4194 + dLng];
    }

    // 11. Chile / Sudamérica
    if (target.includes('chile') || target.includes('santiago') || target.includes('maule') || target.includes('valparaíso')) {
      return [-33.4489 + dLat, -70.6693 + dLng];
    }

    return null;
  };

  // Prioritize primary headquarters city (strip parentheticals and secondary offices after slash)
  const primaryText = hq.replace(/\([^)]*\)/g, '').split('/')[0].trim().toLowerCase();
  const primaryCoord = matchLocation(primaryText);
  if (primaryCoord) return primaryCoord;

  // Fallback to searching the full headquarters text
  const fullCoord = matchLocation(text);
  if (fullCoord) return fullCoord;

  // Default Central Europe Hub
  return [50.0 + dLat, 8.5 + dLng];
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
  const bordersLayerRef = useRef<L.GeoJSON | null>(null);

  const [selectedCompany, setSelectedCompany] = useState<CompanyDossier | null>(null);
  const [showRedBorders, setShowRedBorders] = useState(true);

  // Initialize Leaflet Map with OpenStreetMap
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
      maxZoom: 19,
      worldCopyJump: true,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add pure OpenStreetMap tile layer (100% free, reliable, no API key required)
    const baseLayer = L.tileLayer(OSM_TILE_URL, {
      maxZoom: 19,
      attribution: OSM_ATTRIBUTION
    }).addTo(map);
    tileLayerRef.current = baseLayer;

    // Markers layer group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Auto-adjust size on container resize (critical for split-screen 50/50)
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Fix possible layout sizing lag
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore cleanup
        }
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        tileLayerRef.current = null;
        bordersLayerRef.current = null;
      }
    };
  }, []);

  // Dynamically load & toggle Red Country Borders GeoJSON layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (showRedBorders) {
      if (!bordersLayerRef.current) {
        import('../../data/worldBorders.json').then((module) => {
          if (!mapInstanceRef.current) return;
          const bordersGeoJson = module.default as unknown as Parameters<typeof L.geoJSON>[0];
          const geoLayer = L.geoJSON(bordersGeoJson, {
            style: {
              color: '#ef4444', // Red border line
              weight: 1.8,
              opacity: 0.85,
              fillColor: '#ef4444',
              fillOpacity: 0.02
            },
            onEachFeature: (feature, layer) => {
              if (feature.properties?.name) {
                layer.bindTooltip(feature.properties.name, {
                  sticky: true,
                  direction: 'top',
                  className: 'custom-country-tooltip'
                });
              }
            }
          });
          bordersLayerRef.current = geoLayer;
          geoLayer.addTo(mapInstanceRef.current);
        });
      } else {
        bordersLayerRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      if (bordersLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(bordersLayerRef.current);
      }
    }
  }, [showRedBorders]);

  // Update Markers when companies change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    companies.forEach(comp => {
      const coords = resolveCoordinates(comp.headquarters, comp.id);
      const fit = analyzeCompanyFit(comp);
      const isSelected = selectedCompany?.id === comp.id;
      const tierMeta = resolveScrapingTierMeta(comp);

      // Resolve official curated logo or domain favicons
      const { primaryUrl, fallbackFaviconUrl, fallbackDdgUrl, firstLetter } = resolveCompanyLogoDetails(comp);
      const initialLogoUrl = primaryUrl || fallbackFaviconUrl || fallbackDdgUrl;
      const safeName = comp.name.replace(/["'\\]/g, '');

      // Combine category color border/glow with active selection ring
      const boxBorderClass = `${tierMeta.borderClass} ${isSelected ? 'ring-2 ring-cyan-400 scale-110' : ''}`;
      const boxStyle = `border: 2px solid ${tierMeta.borderColor}; box-shadow: 0 0 8px ${tierMeta.boxShadowColor};`;

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer" style="width: 38px; height: 38px;">
          <!-- High-Contrast Clean White Box with Category-Specific Scraping Glow & Border -->
          <div class="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-md p-0.5 transition-all duration-150 ${boxBorderClass}" style="${boxStyle}">
            ${initialLogoUrl 
              ? `<img 
                  src="${initialLogoUrl}" 
                  alt="${safeName}" 
                  class="w-6 h-6 object-contain" 
                  onerror="if (this.src !== '${fallbackFaviconUrl}' && '${fallbackFaviconUrl}') { this.src = '${fallbackFaviconUrl}'; } else if (this.src !== '${fallbackDdgUrl}' && '${fallbackDdgUrl}') { this.src = '${fallbackDdgUrl}'; } else { this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='flex'; }" 
                 />
                 <span style="display:none; width:100%; height:100%; align-items:center; justify-content:center; background-color:#ffffff; color:#000000; font-family:sans-serif; font-weight:900; font-size:13px; text-transform:uppercase;">${firstLetter}</span>`
              : `<span style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background-color:#ffffff; color:#000000; font-family:sans-serif; font-weight:900; font-size:13px; text-transform:uppercase;">${firstLetter}</span>`
            }
          </div>

          <!-- Discrete HUD Match Badge -->
          <div class="absolute -top-2.5 -right-2 px-1.5 py-0.2 rounded-full text-[8.5px] font-black font-mono border border-slate-700 bg-black text-cyan-300">
            ${fit.score}%
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-company-pin',
        html: iconHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -22]
      });

      const marker = L.marker(coords, { icon: customIcon });

      // Click: fly to center, select company and open external link in new tab
      marker.on('click', () => {
        setSelectedCompany(comp);
        if (comp.website) {
          window.open(comp.website, '_blank', 'noopener,noreferrer');
        }
        mapInstanceRef.current?.flyTo(coords, Math.max(mapInstanceRef.current.getZoom(), 7.5), {
          duration: 1.1,
          easeLinearity: 0.25
        });
      });

      // Hover Tooltip with Scraping Status Indicator Badge
      marker.bindTooltip(`
        <div class="p-2.5 font-mono text-xs space-y-1.5 max-w-[260px] bg-slate-950/95 text-white border border-slate-700 rounded-xl shadow-2xl">
          <div class="flex items-center justify-between gap-1 pb-1 border-b border-slate-800">
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${tierMeta.tooltipBadgeClass}">
              ${tierMeta.badgeText}
            </span>
            <span class="font-bold font-mono text-emerald-400 text-[10px] shrink-0">${fit.score}% Fit</span>
          </div>
          <div class="font-bold text-sm text-cyan-300 font-sans leading-tight line-clamp-2">${comp.name}</div>
          <div class="text-[10px] text-slate-400">📍 ${comp.headquarters}</div>
          <div class="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
            <span class="text-slate-400 truncate max-w-[150px]">${comp.sector.slice(0, 24)}...</span>
            <span class="text-[10px] font-semibold text-slate-300 shrink-0">${tierMeta.shortLabel}</span>
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

        {/* Top Right Controls: Red Borders Toggle & Zoom */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowRedBorders(!showRedBorders)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md shadow-xl transition cursor-pointer ${
              showRedBorders 
                ? 'bg-red-950/90 text-red-300 border-red-700/80 shadow-red-950/40' 
                : 'bg-slate-950/90 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Alternar resaltado de fronteras internacionales en color rojo"
          >
            <span className={`w-2 h-2 rounded-full ${showRedBorders ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
            <span>Fronteras Rojas</span>
          </button>

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
        className="w-full h-[940px] sm:h-[1040px] lg:h-[1150px] min-h-[900px] z-10 select-none bg-slate-950"
      />

      {/* =========================================================================
       * 3. BOTTOM FLOATING DOSSIER CARD (WHEN A PIN IS CLICKED)
       * ========================================================================= */}
      {selectedCompany && (() => {
        const selectedTierMeta = resolveScrapingTierMeta(selectedCompany);
        return (
          <div className="absolute bottom-4 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md z-[1000] p-4 rounded-3xl bg-[#0b101e]/95 border border-cyan-500/50 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-fadeIn space-y-3">
            
            {/* Card Top: Logo + Name + Close */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div 
                  className={`w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm ${selectedTierMeta.borderClass}`}
                  style={{ border: `2px solid ${selectedTierMeta.borderColor}`, boxShadow: `0 0 10px ${selectedTierMeta.boxShadowColor}` }}
                >
                  {(() => {
                    const cardLogo = resolveCompanyLogoDetails(selectedCompany);
                    const cardSrc = cardLogo.primaryUrl || cardLogo.fallbackFaviconUrl || cardLogo.fallbackDdgUrl;
                    if (!cardSrc) {
                      return (
                        <span className="text-black font-sans font-black text-xl uppercase select-none">
                          {cardLogo.firstLetter}
                        </span>
                      );
                    }
                    return (
                      <>
                        <img
                          src={cardSrc}
                          alt={selectedCompany.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (img.src !== cardLogo.fallbackFaviconUrl && cardLogo.fallbackFaviconUrl) {
                              img.src = cardLogo.fallbackFaviconUrl;
                            } else if (img.src !== cardLogo.fallbackDdgUrl && cardLogo.fallbackDdgUrl) {
                              img.src = cardLogo.fallbackDdgUrl;
                            } else {
                              img.style.display = 'none';
                              if (img.nextElementSibling) {
                                (img.nextElementSibling as HTMLElement).style.display = 'flex';
                              }
                            }
                          }}
                        />
                        <span style={{ display: 'none' }} className="w-full h-full items-center justify-center text-black font-sans font-black text-xl uppercase select-none">
                          {cardLogo.firstLetter}
                        </span>
                      </>
                    );
                  })()}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white font-sans line-clamp-1">
                    {selectedCompany.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    📍 {selectedCompany.headquarters}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {selectedCompany.sector.slice(0, 24)}
                    </span>
                    {selectedFit && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5 text-emerald-400" />
                        {selectedFit.score}% Fit
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 border ${selectedTierMeta.pillBg} ${selectedTierMeta.pillText} ${selectedTierMeta.pillBorder}`}>
                      {selectedTierMeta.badgeText}
                    </span>
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
        );
      })()}

      {/* Map Legend Overlay (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-[1000] p-3 rounded-2xl bg-slate-950/95 border border-slate-800 backdrop-blur-md shadow-2xl text-[10px] font-mono text-slate-300 hidden sm:flex flex-col gap-2">
        <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between gap-3">
          <span>Accesibilidad de Scraping</span>
          <span className="text-[8.5px] text-cyan-400 font-semibold">{companies.length} Entidades</span>
        </div>
        <div className="flex items-center gap-3.5 pt-0.5 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.7)] shrink-0"></span>
            <span className="font-semibold text-slate-200">🟢 Monitoreo automático</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.7)] shrink-0"></span>
            <span className="font-semibold text-slate-200">🟡 API / ATS</span>
          </span>
          <span className="flex items-center gap-1.5 text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.7)] shrink-0"></span>
            <span className="font-semibold text-slate-200">🔴 Requiere inspección manual</span>
          </span>
        </div>
      </div>
    </div>
  );
};

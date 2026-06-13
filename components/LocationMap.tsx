'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { LOCATIONS, HEAT_STATIONS, type Zona } from '@/lib/locations';
import { fetchCurrentTemperatures } from '@/lib/openmeteo';

// Scala colore della temperatura: stop normalizzati 0..1 (freddo → caldo).
const HEAT_STOPS: { at: number; rgb: [number, number, number] }[] = [
  { at: 0.0,  rgb: [37, 99, 235] },   // #2563eb blu
  { at: 0.4,  rgb: [34, 197, 94] },   // #22c55e verde
  { at: 0.65, rgb: [234, 179, 8] },   // #eab308 giallo
  { at: 0.85, rgb: [249, 115, 22] },  // #f97316 arancione
  { at: 1.0,  rgb: [239, 68, 68] },   // #ef4444 rosso
];

const HEAT_CSS_GRADIENT =
  'linear-gradient(to right, #2563eb, #22c55e, #eab308, #f97316, #ef4444)';

function heatColor(norm: number): [number, number, number] {
  const n = Math.max(0, Math.min(1, norm));
  for (let i = 1; i < HEAT_STOPS.length; i++) {
    const a = HEAT_STOPS[i - 1];
    const b = HEAT_STOPS[i];
    if (n <= b.at) {
      const t = (n - a.at) / (b.at - a.at);
      return [
        Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * t),
        Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * t),
        Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * t),
      ];
    }
  }
  return HEAT_STOPS[HEAT_STOPS.length - 1].rgb;
}

// Italia (con un po' di margine).
const ITALY_CENTER: [number, number] = [42.0, 12.5];
const ITALY_BOUNDS: [[number, number], [number, number]] = [
  [35.2, 6.4],
  [47.3, 19.0],
];

const ZONE_COLOR: Record<Zona, string> = {
  pianura:  '#16a34a',
  collina:  '#f59e0b',
  montagna: '#78716c',
};

const ZONE_LABEL: { zone: Zona; label: string }[] = [
  { zone: 'pianura',  label: 'Pianura' },
  { zone: 'collina',  label: 'Collina' },
  { zone: 'montagna', label: 'Montagna' },
];

// Icone condivise per zona (riutilizzate da tutti i marker → niente 7.800 oggetti).
const iconCache: Record<string, L.DivIcon> = {};
function zoneIcon(zone: Zona, active: boolean): L.DivIcon {
  const key = `${zone}-${active}`;
  if (!iconCache[key]) {
    const s = active ? 16 : 9;
    const color = ZONE_COLOR[zone];
    iconCache[key] = L.divIcon({
      className: '',
      html: `<div style="width:${s}px;height:${s}px;border-radius:50%;background:${color};border:${active ? '2.5px solid #fff' : '1.5px solid rgba(255,255,255,0.45)'};box-shadow:0 1px 4px rgba(0,0,0,0.55)"></div>`,
      iconSize: [s, s],
      iconAnchor: [s / 2, s / 2],
      tooltipAnchor: [s / 2 + 2, 0],
    });
  }
  return iconCache[key];
}

function customDot() {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:#ef4444;border:2.5px solid #fff;box-shadow:0 2px 7px rgba(0,0,0,0.6)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    tooltipAnchor: [9, 0],
  });
}

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
  useMapEvents({ click: e => onMapClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

/**
 * Tutti i comuni come marker raggruppati in cluster (leaflet.markercluster),
 * così ~7.800 marker restano performanti. Il colore indica la zona altimetrica;
 * al massimo zoom i cluster si aprono nei singoli comuni.
 */
function ClusterLayer({
  currentSlug,
  onSelect,
}: {
  currentSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const group = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 55,
      disableClusteringAtZoom: 11,
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
    });

    const markers = LOCATIONS.map(loc => {
      const m = L.marker([loc.lat, loc.lon], {
        icon: zoneIcon(loc.zone, loc.slug === currentSlug),
      });
      (m.options as L.MarkerOptions & { slug?: string }).slug = loc.slug;
      m.bindTooltip(
        `<span style="font-weight:500">${loc.name}</span> <span style="font-size:10px;color:#64748b">${loc.sigla} · ${loc.elevation} m</span>`,
        { direction: 'top', offset: [0, -4], opacity: 1 }
      );
      return m;
    });
    group.addLayers(markers);
    group.on('click', e => {
      const slug = (e.layer.options as L.MarkerOptions & { slug?: string }).slug;
      if (slug) onSelect(slug);
    });

    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [map, currentSlug, onSelect]);
  return null;
}

interface Station {
  lat: number;
  lon: number;
  temp: number;
}

/**
 * Superficie di temperatura interpolata con IDW (Inverse Distance Weighting)
 * a partire dai ~107 capoluoghi di provincia. Il colore di ogni punto dipende
 * solo dalle temperature delle città vicine, non da quante ce ne sono: niente
 * artefatti di densità.
 */
function InterpolatedHeat({
  stations,
  min,
  max,
}: {
  stations: Station[];
  min: number;
  max: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (stations.length === 0) return;

    const margin = 0.25;
    const south = Math.min(...stations.map(s => s.lat)) - margin;
    const north = Math.max(...stations.map(s => s.lat)) + margin;
    const west = Math.min(...stations.map(s => s.lon)) - margin;
    const east = Math.max(...stations.map(s => s.lon)) + margin;

    const W = 360;
    const H = Math.max(1, Math.round((W * (north - south)) / (east - west)));
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(W, H);

    const range = max - min || 1;
    const latScale = 111; // km per grado di latitudine
    const POWER = 2;
    const FULL_KM = 45;   // alpha piena entro questa distanza dalla città più vicina
    const ZERO_KM = 95;   // oltre questa distanza, trasparente (mare aperto)

    for (let y = 0; y < H; y++) {
      const lat = north - ((y + 0.5) / H) * (north - south);
      const lonScale = 111 * Math.cos((lat * Math.PI) / 180);
      for (let x = 0; x < W; x++) {
        const lon = west + ((x + 0.5) / W) * (east - west);

        let num = 0;
        let den = 0;
        let nearestKm2 = Infinity;
        for (const s of stations) {
          const dy = (lat - s.lat) * latScale;
          const dx = (lon - s.lon) * lonScale;
          const d2 = dx * dx + dy * dy;
          if (d2 < nearestKm2) nearestKm2 = d2;
          if (d2 < 1e-4) {
            num = s.temp;
            den = 1;
            nearestKm2 = 0;
            break;
          }
          const w = 1 / Math.pow(d2, POWER / 2);
          num += w * s.temp;
          den += w;
        }

        const t = den > 0 ? num / den : min;
        const [r, g, b] = heatColor((t - min) / range);

        const distKm = Math.sqrt(nearestKm2);
        let a = 0.6;
        if (distKm > ZERO_KM) a = 0;
        else if (distKm > FULL_KM) a *= (ZERO_KM - distKm) / (ZERO_KM - FULL_KM);

        const idx = (y * W + x) * 4;
        img.data[idx] = r;
        img.data[idx + 1] = g;
        img.data[idx + 2] = b;
        img.data[idx + 3] = Math.round(a * 255);
      }
    }
    ctx.putImageData(img, 0, 0);

    const overlay = L.imageOverlay(canvas.toDataURL(), [
      [south, west],
      [north, east],
    ], { opacity: 1, interactive: false });
    overlay.addTo(map);
    return () => {
      map.removeLayer(overlay);
    };
  }, [map, stations, min, max]);
  return null;
}

interface Props {
  currentSlug: string | null;
  customLat?: number | null;
  customLon?: number | null;
}

export default function LocationMap({ currentSlug, customLat, customLon }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [heatOn, setHeatOn] = useState(false);
  const [temps, setTemps] = useState<number[] | null>(null);
  const [loadingHeat, setLoadingHeat] = useState(false);
  const [heatError, setHeatError] = useState(false);

  const goToComune = useCallback(
    (slug: string) => router.push(slug === 'teramo' ? '/' : `/?loc=${slug}`),
    [router]
  );

  // Carica le temperature dei ~107 capoluoghi solo quando serve.
  useEffect(() => {
    if (!heatOn || temps !== null || loadingHeat || heatError) return;
    setLoadingHeat(true);
    fetchCurrentTemperatures(HEAT_STATIONS.map(l => ({ lat: l.lat, lon: l.lon })))
      .then(setTemps)
      .catch(() => setHeatError(true))
      .finally(() => setLoadingHeat(false));
  }, [heatOn, temps, loadingHeat, heatError]);

  const heatData = useMemo(() => {
    if (!temps) return { stations: [] as Station[], min: 0, max: 0 };
    const stations = HEAT_STATIONS.reduce<Station[]>((acc, l, i) => {
      const t = temps[i];
      if (typeof t === 'number' && !isNaN(t)) {
        acc.push({ lat: l.lat, lon: l.lon, temp: t });
      }
      return acc;
    }, []);
    if (stations.length === 0) return { stations, min: 0, max: 0 };
    const values = stations.map(s => s.temp);
    return { stations, min: Math.min(...values), max: Math.max(...values) };
  }, [temps]);

  const heatActive = heatOn && heatData.stations.length > 0;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <span>Mappa d&apos;Italia</span>
        <span className="text-slate-600 text-xs">{isOpen ? '▲ Chiudi' : '▼ Espandi'}</span>
      </button>

      {isOpen && (
        <>
          <div style={{ height: 380 }} className="relative border-t border-white/5">
            <div
              className="absolute bottom-2 left-2 z-[1000] flex flex-col gap-1 rounded-lg bg-slate-900/80 backdrop-blur-sm px-2.5 py-2 border border-white/10"
              style={{ pointerEvents: 'none' }}
            >
              {ZONE_LABEL.map(({ zone, label }) => (
                <div key={zone} className="flex items-center gap-1.5">
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: ZONE_COLOR[zone],
                      border: '1.5px solid rgba(255,255,255,0.5)',
                      flexShrink: 0,
                    }}
                  />
                  <span className="text-[11px] leading-none text-slate-200">{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setHeatOn(o => !o)}
              className={`absolute top-2 right-2 z-[1000] flex items-center gap-1.5 rounded-lg backdrop-blur-sm px-2.5 py-1.5 border text-[11px] transition-colors ${
                heatOn
                  ? 'bg-orange-500/80 border-orange-300/40 text-white'
                  : 'bg-slate-900/80 border-white/10 text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <span>🌡️</span>
              <span>{loadingHeat ? 'Calore…' : heatOn ? 'Calore attivo' : 'Mappa calore'}</span>
            </button>

            {heatActive && (
              <div
                className="absolute top-12 right-2 z-[1000] rounded-lg bg-slate-900/80 backdrop-blur-sm px-2.5 py-2 border border-white/10"
                style={{ pointerEvents: 'none' }}
              >
                <div
                  style={{
                    width: 96,
                    height: 8,
                    borderRadius: 4,
                    background: HEAT_CSS_GRADIENT,
                  }}
                />
                <div className="mt-1 flex justify-between text-[10px] leading-none text-slate-300">
                  <span>{Math.round(heatData.min)}°</span>
                  <span>Temp. attuale</span>
                  <span>{Math.round(heatData.max)}°</span>
                </div>
              </div>
            )}

            {heatError && heatOn && (
              <div className="absolute top-12 right-2 z-[1000] rounded-lg bg-slate-900/80 backdrop-blur-sm px-2.5 py-1.5 border border-white/10 text-[10px] text-slate-300">
                Temperature non disponibili
              </div>
            )}

            <MapContainer
              center={ITALY_CENTER}
              zoom={6}
              minZoom={5}
              maxBounds={ITALY_BOUNDS}
              maxBoundsViscosity={1.0}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
              />

              {heatActive && (
                <InterpolatedHeat
                  stations={heatData.stations}
                  min={heatData.min}
                  max={heatData.max}
                />
              )}

              <ClusterLayer currentSlug={currentSlug} onSelect={goToComune} />

              <ClickHandler
                onMapClick={(lat, lon) =>
                  router.push(`/?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`)
                }
              />

              {customLat != null && customLon != null && (
                <Marker position={[customLat, customLon]} icon={customDot()}>
                  <Tooltip direction="top" offset={[0, -5]} opacity={1}>
                    <span style={{ fontSize: 11 }}>
                      {customLat.toFixed(4)}°N, {customLon.toFixed(4)}°E
                    </span>
                  </Tooltip>
                </Marker>
              )}
            </MapContainer>
          </div>
          <p className="text-slate-600 text-xs text-center py-1.5 border-t border-white/5">
            Clicca un comune per le previsioni · Clicca un punto qualsiasi per previsioni personalizzate
          </p>
        </>
      )}
    </div>
  );
}

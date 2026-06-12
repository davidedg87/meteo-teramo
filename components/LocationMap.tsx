'use client';

import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { LOCATIONS } from '@/lib/locations';

const ZONE_COLOR: Record<string, string> = {
  costa:    '#3b82f6',
  collina:  '#22c55e',
  montagna: '#f97316',
};

function dot(color: string, active: boolean) {
  const s = active ? 14 : 10;
  return L.divIcon({
    className: '',
    html: `<div style="width:${s}px;height:${s}px;border-radius:50%;background:${color};border:${active ? '2.5px solid #fff' : '1.5px solid rgba(255,255,255,0.4)'};box-shadow:0 1px 5px rgba(0,0,0,0.55)"></div>`,
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
    tooltipAnchor: [s / 2 + 2, 0],
  });
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

interface Props {
  currentSlug: string | null;
  customLat?: number | null;
  customLon?: number | null;
}

export default function LocationMap({ currentSlug, customLat, customLon }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      <div style={{ height: 300 }}>
        <MapContainer
          center={[42.66, 13.70]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
          />

          <ClickHandler
            onMapClick={(lat, lon) =>
              router.push(`/?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`)
            }
          />

          {LOCATIONS.map(loc => (
            <Marker
              key={loc.slug}
              position={[loc.lat, loc.lon]}
              icon={dot(ZONE_COLOR[loc.zone], loc.slug === currentSlug)}
              eventHandlers={{
                click: () => router.push(loc.slug === 'teramo' ? '/' : `/?loc=${loc.slug}`),
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={1}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{loc.name}</span>
                <span style={{ fontSize: 10, color: '#64748b', marginLeft: 4 }}>{loc.elevation} m</span>
              </Tooltip>
            </Marker>
          ))}

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
        Clicca su un marker per i comuni · Clicca su un punto qualsiasi per previsioni personalizzate
      </p>
    </div>
  );
}

export const WMO_CODES: Record<number, { label: string; icon: string; night?: string }> = {
  0:  { label: 'Sereno',                    icon: '☀️',  night: '🌙' },
  1:  { label: 'Prevalentemente sereno',    icon: '🌤️', night: '🌙' },
  2:  { label: 'Parzialmente nuvoloso',     icon: '⛅' },
  3:  { label: 'Coperto',                   icon: '☁️' },
  45: { label: 'Nebbia',                    icon: '🌫️' },
  48: { label: 'Nebbia con brina',          icon: '🌫️' },
  51: { label: 'Pioggerella leggera',       icon: '🌦️' },
  53: { label: 'Pioggerella',               icon: '🌦️' },
  55: { label: 'Pioggerella intensa',       icon: '🌧️' },
  61: { label: 'Pioggia leggera',           icon: '🌧️' },
  63: { label: 'Pioggia',                   icon: '🌧️' },
  65: { label: 'Pioggia intensa',           icon: '🌧️' },
  71: { label: 'Neve leggera',              icon: '🌨️' },
  73: { label: 'Neve',                      icon: '❄️' },
  75: { label: 'Neve intensa',              icon: '❄️' },
  77: { label: 'Granelli di neve',          icon: '🌨️' },
  80: { label: 'Rovesci',                   icon: '🌦️' },
  81: { label: 'Rovesci moderati',          icon: '🌧️' },
  82: { label: 'Rovesci intensi',           icon: '⛈️' },
  85: { label: 'Rovesci di neve',           icon: '🌨️' },
  86: { label: 'Rovesci di neve intensi',   icon: '❄️' },
  95: { label: 'Temporale',                 icon: '⛈️' },
  96: { label: 'Temporale con grandine',    icon: '⛈️' },
  99: { label: 'Temporale con grandine intensa', icon: '⛈️' },
};

export function getWeatherInfo(code: number, isDay = true) {
  const entry = WMO_CODES[code] ?? { label: 'Sconosciuto', icon: '🌡️' };
  return {
    label: entry.label,
    icon: (!isDay && entry.night) ? entry.night : entry.icon,
  };
}

export function windDir(deg: number): string {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSO','SO','OSO','O','ONO','NO','NNO'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function uvLabel(uv: number): string {
  if (uv < 3)  return 'Basso';
  if (uv < 6)  return 'Moderato';
  if (uv < 8)  return 'Alto';
  if (uv < 11) return 'Molto alto';
  return 'Estremo';
}

export function uvColor(uv: number): string {
  if (uv < 3)  return 'text-green-400';
  if (uv < 6)  return 'text-yellow-400';
  if (uv < 8)  return 'text-orange-400';
  if (uv < 11) return 'text-red-400';
  return 'text-purple-400';
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

export function fmtDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Oggi';
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) return 'Domani';
  return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' });
}

export function fmtHour(iso: string): string {
  return new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

export function tempColor(temp: number): string {
  if (temp < 0)  return '#60a5fa';
  if (temp < 10) return '#93c5fd';
  if (temp < 20) return '#6ee7b7';
  if (temp < 30) return '#fbbf24';
  return '#f97316';
}

import { windDir, uvLabel, uvColor } from '@/lib/weatherUtils';
import type { WeatherData } from '@/lib/openmeteo';

interface Props {
  current: WeatherData['current'];
}

function Card({
  icon, label, value, sub, valueClass,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 flex flex-col gap-1">
      <span className="text-xl">{icon}</span>
      <span className="text-slate-400 text-xs uppercase tracking-widest">{label}</span>
      <span className={`text-white text-lg font-semibold leading-tight ${valueClass ?? ''}`}>{value}</span>
      {sub && <span className="text-slate-400 text-xs">{sub}</span>}
    </div>
  );
}

export default function MetricsGrid({ current }: Props) {
  const dir = windDir(current.wind_direction_10m);
  const uv  = current.uv_index;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <Card
        icon="💧"
        label="Umidità"
        value={`${current.relative_humidity_2m}%`}
      />
      <Card
        icon="💨"
        label="Vento"
        value={`${Math.round(current.wind_speed_10m)} km/h`}
        sub={`${dir} · Raffiche ${Math.round(current.wind_gusts_10m)} km/h`}
      />
      <Card
        icon="🌡️"
        label="Pressione"
        value={`${Math.round(current.surface_pressure)} hPa`}
      />
      <Card
        icon="☀️"
        label="Indice UV"
        value={uv.toFixed(1)}
        sub={uvLabel(uv)}
        valueClass={uvColor(uv)}
      />
      <Card
        icon="🌧️"
        label="Precipitazioni"
        value={`${current.precipitation.toFixed(1)} mm`}
        sub="ultima ora"
      />
      <Card
        icon="🌬️"
        label="Direzione"
        value={dir}
        sub={`${Math.round(current.wind_direction_10m)}°`}
      />
    </div>
  );
}

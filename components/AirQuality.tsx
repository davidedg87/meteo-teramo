import type { AirQualityData } from '@/lib/airquality';

const AQI_LEVELS = [
  { max: 20,       label: 'Buona',        color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/20'  },
  { max: 40,       label: 'Discreta',     color: 'text-lime-400',   bg: 'bg-lime-400/10',   border: 'border-lime-400/20'   },
  { max: 60,       label: 'Moderata',     color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  { max: 80,       label: 'Scarsa',       color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  { max: 100,      label: 'Molto scarsa', color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/20'    },
  { max: Infinity, label: 'Pessima',      color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
];

function getLevel(aqi: number) {
  return AQI_LEVELS.find(l => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1];
}

interface Props {
  data: AirQualityData;
}

export default function AirQuality({ data }: Props) {
  const c = data.current;
  const level = getLevel(c.european_aqi);

  const pollutants = [
    { label: 'PM2.5', value: c.pm2_5?.toFixed(1),           unit: 'μg/m³', limit: 25  },
    { label: 'PM10',  value: c.pm10?.toFixed(1),             unit: 'μg/m³', limit: 50  },
    { label: 'NO₂',   value: c.nitrogen_dioxide?.toFixed(1), unit: 'μg/m³', limit: 200 },
    { label: 'O₃',    value: c.ozone?.toFixed(1),            unit: 'μg/m³', limit: 180 },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <h2 className="text-slate-300 text-sm uppercase tracking-widest mb-4">Qualità dell&apos;aria</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* AQI badge */}
        <div className={`rounded-xl p-5 border ${level.bg} ${level.border} flex flex-col items-center justify-center min-w-[110px]`}>
          <span className={`text-5xl font-bold leading-none ${level.color}`}>{c.european_aqi}</span>
          <span className={`text-sm mt-2 font-medium ${level.color}`}>{level.label}</span>
          <span className="text-slate-500 text-xs mt-0.5">Indice AQI EU</span>
        </div>

        {/* Pollutants */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          {pollutants.map(p => {
            const val = parseFloat(p.value ?? '0');
            const pct = Math.min((val / p.limit) * 100, 100);
            return (
              <div key={p.label} className="bg-white/5 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-slate-400 text-xs">{p.label}</span>
                <span className="text-white font-semibold text-lg leading-none">
                  {p.value ?? '—'}
                </span>
                <span className="text-slate-500 text-xs">{p.unit}</span>
                <div className="h-1 rounded-full bg-white/10 mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-current transition-all"
                    style={{ width: `${pct}%`, color: pct > 80 ? '#f97316' : pct > 50 ? '#eab308' : '#22c55e' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

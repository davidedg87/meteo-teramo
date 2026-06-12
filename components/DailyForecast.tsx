import { getWeatherInfo, fmtDay } from '@/lib/weatherUtils';
import type { WeatherData } from '@/lib/openmeteo';

interface Props {
  daily: WeatherData['daily'];
}

export default function DailyForecast({ daily }: Props) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <h2 className="text-slate-300 text-sm uppercase tracking-widest mb-4">Prossimi 7 giorni</h2>
      <div className="space-y-1">
        {daily.time.map((date, i) => {
          const { icon } = getWeatherInfo(daily.weather_code[i]);
          const max   = Math.round(daily.temperature_2m_max[i]);
          const min   = Math.round(daily.temperature_2m_min[i]);
          const rain  = daily.precipitation_probability_max[i];
          const prec  = daily.precipitation_sum[i];
          const snow  = daily.snowfall_sum[i] ?? 0;
          const sunH  = Math.round((daily.sunshine_duration[i] ?? 0) / 3600);

          return (
            <div
              key={date}
              className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0"
            >
              {/* Giorno */}
              <div className="w-20 text-slate-300 text-sm font-medium capitalize">
                {fmtDay(date)}
              </div>

              {/* Icona */}
              <div className="text-xl w-8 text-center">{icon}</div>

              {/* Probabilità pioggia */}
              <div className="flex items-center gap-1 text-blue-400 text-xs w-12">
                {rain > 0 ? (
                  <>
                    <span>🌧️</span>
                    <span>{rain}%</span>
                  </>
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </div>

              {/* Precipitazione o neve */}
              <div className="text-xs w-16">
                {snow > 0
                  ? <span className="text-sky-300">❄️ {snow.toFixed(0)} cm</span>
                  : prec > 0
                    ? <span className="text-slate-500">{prec.toFixed(1)} mm</span>
                    : null}
              </div>

              {/* Barra min/max + sole */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-blue-300 text-sm w-8 text-right">{min}°</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <TempBar min={min} max={max} globalMin={-5} globalMax={40} />
                </div>
                <span className="text-orange-300 text-sm w-8">{max}°</span>
                <span className="text-yellow-400/60 text-xs w-8 text-right hidden sm:inline">
                  {sunH > 0 ? `☀️${sunH}h` : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TempBar({
  min, max, globalMin, globalMax,
}: {
  min: number; max: number; globalMin: number; globalMax: number;
}) {
  const range = globalMax - globalMin;
  const left  = ((min - globalMin) / range) * 100;
  const width = ((max - min) / range) * 100;

  return (
    <div
      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
      style={{ marginLeft: `${left}%`, width: `${width}%` }}
    />
  );
}

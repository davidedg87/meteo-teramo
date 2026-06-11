import { getWeatherInfo } from '@/lib/weatherUtils';
import type { WeatherData } from '@/lib/openmeteo';

interface Props {
  current: WeatherData['current'];
  daily: WeatherData['daily'];
}

export default function CurrentWeather({ current, daily }: Props) {
  const { label, icon } = getWeatherInfo(current.weather_code, current.is_day === 1);
  const sunrise = new Date(daily.sunrise[0]).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  const sunset  = new Date(daily.sunset[0]).toLocaleTimeString('it-IT',  { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
      <div className="flex items-start justify-between gap-4">
        {/* Temperatura principale */}
        <div>
          <div className="text-[6rem] leading-none font-thin text-white tracking-tighter">
            {Math.round(current.temperature_2m)}°
          </div>
          <div className="text-xl text-slate-300 mt-2">{label}</div>
          <div className="text-slate-400 text-sm mt-1">
            Percepita <span className="text-slate-300">{Math.round(current.apparent_temperature)}°</span>
          </div>
          <div className="text-slate-400 text-sm mt-1">
            Min <span className="text-blue-300">{Math.round(daily.temperature_2m_min[0])}°</span>
            {' · '}
            Max <span className="text-orange-300">{Math.round(daily.temperature_2m_max[0])}°</span>
          </div>
        </div>

        {/* Icona meteo + alba/tramonto */}
        <div className="text-right flex flex-col items-end gap-4">
          <div className="text-7xl select-none">{icon}</div>
          <div className="text-slate-400 text-sm space-y-0.5">
            <div>🌅 <span className="text-slate-300">{sunrise}</span></div>
            <div>🌇 <span className="text-slate-300">{sunset}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

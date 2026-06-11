import { fetchWeather } from '@/lib/openmeteo';
import { fmtTime } from '@/lib/weatherUtils';
import CurrentWeather from '@/components/CurrentWeather';
import MetricsGrid from '@/components/MetricsGrid';
import TemperatureChart from '@/components/TemperatureChart';
import DailyForecast from '@/components/DailyForecast';
import AutoRefresh from '@/components/AutoRefresh';

export const revalidate = 600;

export default async function Home() {
  const weather = await fetchWeather();

  // Prendo solo le prossime 48h a partire dall'ora corrente
  const now = new Date();
  const hourlySlice = weather.hourly.time
    .map((t, i) => ({
      time: t,
      temperature_2m: weather.hourly.temperature_2m[i],
      relative_humidity_2m: weather.hourly.relative_humidity_2m[i],
      precipitation_probability: weather.hourly.precipitation_probability[i],
      precipitation: weather.hourly.precipitation[i],
      wind_speed_10m: weather.hourly.wind_speed_10m[i],
    }))
    .filter(d => new Date(d.time) >= now)
    .slice(0, 48);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meteo Teramo</h1>
            <p className="text-slate-400 text-sm">Centro storico · 274 m s.l.m.</p>
          </div>
          <AutoRefresh updatedAt={fmtTime(weather.current.time)} />
        </header>

        {/* Condizioni attuali */}
        <CurrentWeather current={weather.current} daily={weather.daily} />

        {/* Metriche */}
        <MetricsGrid current={weather.current} />

        {/* Grafico 48h */}
        <TemperatureChart data={hourlySlice} />

        {/* Previsioni 7 giorni */}
        <DailyForecast daily={weather.daily} />

        {/* Footer */}
        <footer className="text-center text-slate-600 text-xs pt-4 pb-2">
          Dati forniti da{' '}
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-300 underline"
          >
            Open-Meteo
          </a>
          {' '}· Aggiornamento automatico ogni 15 minuti
        </footer>
      </div>
    </main>
  );
}

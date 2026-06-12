import { fetchWeather } from '@/lib/openmeteo';
import { fetchAirQuality } from '@/lib/airquality';
import { fetchHistorical } from '@/lib/historical';
import { getLocation } from '@/lib/locations';
import { fmtTime } from '@/lib/weatherUtils';
import CurrentWeather from '@/components/CurrentWeather';
import MetricsGrid from '@/components/MetricsGrid';
import AirQuality from '@/components/AirQuality';
import TemperatureChart from '@/components/TemperatureChart';
import DailyForecast from '@/components/DailyForecast';
import HourlyTable from '@/components/HourlyTable';
import PressureChart from '@/components/PressureChart';
import HistoricalChart from '@/components/HistoricalChart';
import AutoRefresh from '@/components/AutoRefresh';
import LocationSelector from '@/components/LocationSelector';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { loc?: string };
}

export default async function Home({ searchParams }: PageProps) {
  const loc = getLocation(searchParams.loc);

  const [weather, airQualityResult, historicalResult] = await Promise.allSettled([
    fetchWeather(loc.lat, loc.lon),
    fetchAirQuality(loc.lat, loc.lon),
    fetchHistorical(loc.lat, loc.lon),
  ]);

  if (weather.status === 'rejected') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-2xl">⛅</p>
          <p className="text-slate-300 font-medium">Dati meteo temporaneamente non disponibili</p>
          <p className="text-slate-500 text-sm">Riprova tra qualche minuto</p>
        </div>
      </main>
    );
  }

  const w = weather.value;
  const airQuality = airQualityResult.status === 'fulfilled' ? airQualityResult.value : null;
  const historical = historicalResult.status === 'fulfilled' ? historicalResult.value : null;

  const now = new Date();

  const hourlyData = w.hourly.time
    .map((t, i) => ({
      time: t,
      temperature_2m: w.hourly.temperature_2m[i],
      apparent_temperature: w.hourly.apparent_temperature[i],
      dew_point_2m: w.hourly.dew_point_2m[i],
      relative_humidity_2m: w.hourly.relative_humidity_2m[i],
      precipitation_probability: w.hourly.precipitation_probability[i],
      precipitation: w.hourly.precipitation[i],
      wind_speed_10m: w.hourly.wind_speed_10m[i],
      surface_pressure: w.hourly.surface_pressure[i],
      cloud_cover: w.hourly.cloud_cover[i],
      visibility: w.hourly.visibility[i],
      uv_index: w.hourly.uv_index[i],
    }))
    .filter(d => new Date(d.time) >= now);

  const elevation = Math.round(w.elevation);
  const subtitle = loc.description
    ? `${loc.description} · ${elevation} m s.l.m.`
    : `${elevation} m s.l.m.`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">

        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meteo {loc.name}</h1>
            <p className="text-slate-400 text-sm">{subtitle}</p>
          </div>
          <AutoRefresh updatedAt={fmtTime(w.current.time)} />
        </header>

        <LocationSelector currentSlug={loc.slug} />

        <CurrentWeather current={w.current} daily={w.daily} />
        <MetricsGrid current={w.current} />

        {airQuality && <AirQuality data={airQuality} />}

        <TemperatureChart data={hourlyData.slice(0, 48)} />
        <PressureChart data={hourlyData.slice(0, 48)} />
        <DailyForecast daily={w.daily} />
        <HourlyTable data={hourlyData} />

        {historical && <HistoricalChart data={historical} />}

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

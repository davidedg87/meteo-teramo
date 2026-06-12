export interface HistoricalData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export async function fetchHistorical(lat: number, lon: number): Promise<HistoricalData> {
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date();
  start.setDate(start.getDate() - 7);

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'Europe/Rome',
    start_date: fmt(start),
    end_date: fmt(end),
  });

  const res = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error(`Historical error: ${res.status}`);
  return res.json();
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  elevation: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    surface_pressure: number;
    uv_index: number;
    weather_code: number;
    is_day: number;
    cloud_cover: number;
    visibility: number;
    snow_depth: number;
    freezing_level_height: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    dew_point_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    wind_speed_10m: number[];
    surface_pressure: number[];
    cloud_cover: number[];
    visibility: number[];
    uv_index: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    rain_sum: number[];
    snowfall_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
    sunshine_duration: number[];
    daylight_duration: number[];
  };
}

/**
 * Recupera la temperatura corrente per più coordinate in un'unica chiamata.
 * Open-Meteo accetta liste di lat/lon e risponde con un array (un oggetto se è
 * una sola coordinata). L'ordine dei risultati rispecchia quello dei punti.
 */
export async function fetchCurrentTemperatures(
  points: { lat: number; lon: number }[]
): Promise<number[]> {
  if (points.length === 0) return [];

  const params = new URLSearchParams({
    latitude: points.map(p => p.lat).join(','),
    longitude: points.map(p => p.lon).join(','),
    current: 'temperature_2m',
    timezone: 'Europe/Rome',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);

  const data = await res.json();
  const arr = Array.isArray(data) ? data : [data];
  return arr.map((d: { current: { temperature_2m: number } }) => d.current.temperature_2m);
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'surface_pressure',
      'uv_index',
      'weather_code',
      'is_day',
      'cloud_cover',
      'visibility',
      'snow_depth',
      'freezing_level_height',
    ].join(','),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'dew_point_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'precipitation',
      'wind_speed_10m',
      'surface_pressure',
      'cloud_cover',
      'visibility',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'rain_sum',
      'snowfall_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
      'uv_index_max',
      'sunrise',
      'sunset',
      'sunshine_duration',
      'daylight_duration',
    ].join(','),
    timezone: 'Europe/Rome',
    forecast_days: '7',
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    { next: { revalidate: 600 } }
  );

  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
}

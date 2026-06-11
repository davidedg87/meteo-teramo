export interface AirQualityData {
  current: {
    time: string;
    european_aqi: number;
    pm2_5: number;
    pm10: number;
    nitrogen_dioxide: number;
    ozone: number;
  };
}

export async function fetchAirQuality(): Promise<AirQualityData> {
  const params = new URLSearchParams({
    latitude: '42.6589',
    longitude: '13.7036',
    current: 'european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone',
    timezone: 'Europe/Rome',
  });

  const res = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${params}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error(`Air quality error: ${res.status}`);
  return res.json();
}

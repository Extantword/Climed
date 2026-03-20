const BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function fetchAirQuality(lat = 6.2518, lng = -75.5636) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    hourly: 'pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide,us_aqi,european_aqi',
    timezone: 'America/Bogota',
  });
  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Error al obtener datos de calidad del aire');
  return res.json();
}

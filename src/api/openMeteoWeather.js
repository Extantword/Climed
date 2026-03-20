const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(lat = 6.2518, lng = -75.5636) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    hourly: 'temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,weathercode,windspeed_10m',
    daily: 'precipitation_sum,precipitation_probability_max,weathercode',
    timezone: 'America/Bogota',
    forecast_days: '7',
    current_weather: 'true',
  });
  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Error al obtener datos meteorológicos');
  return res.json();
}

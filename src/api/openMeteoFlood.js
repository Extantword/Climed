const BASE_URL = 'https://flood-api.open-meteo.com/v1/flood';

export async function fetchFloodData(lat = 6.2518, lng = -75.5636) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    daily: 'river_discharge,river_discharge_mean,river_discharge_max',
    forecast_days: '30',
  });
  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Error al obtener datos de inundación');
  return res.json();
}

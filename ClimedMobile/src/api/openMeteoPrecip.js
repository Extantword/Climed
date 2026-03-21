/**
 * Open-Meteo — Precipitation-focused endpoint
 * Fetches hourly precipitation data for multiple points across Medellín.
 */

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export const STATION_POINTS = [
  { name: 'Centro (La Candelaria)', lat: 6.2518, lng: -75.5636 },
  { name: 'El Poblado', lat: 6.2100, lng: -75.5700 },
  { name: 'Robledo', lat: 6.2750, lng: -75.5900 },
  { name: 'Manrique', lat: 6.2800, lng: -75.5450 },
  { name: 'Belén', lat: 6.2300, lng: -75.5900 },
  { name: 'Buenos Aires', lat: 6.2400, lng: -75.5450 },
  { name: 'Castilla', lat: 6.2850, lng: -75.5750 },
  { name: 'San Javier', lat: 6.2600, lng: -75.6100 },
];

async function fetchPointPrecipitation(lat, lng) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    hourly: 'precipitation,rain,showers,weathercode',
    past_hours: '24',
    forecast_hours: '48',
    timezone: 'America/Bogota',
  });

  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error for (${lat}, ${lng})`);
  return res.json();
}

async function fetchPointHistorical(lat, lng) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    hourly: 'precipitation,rain,showers,weathercode',
    past_days: '7',
    forecast_days: '2',
    timezone: 'America/Bogota',
  });

  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo historical error for (${lat}, ${lng})`);
  return res.json();
}

export async function fetchOpenMeteoPrecipitation() {
  const results = await Promise.allSettled(
    STATION_POINTS.map(async (point) => {
      const data = await fetchPointPrecipitation(point.lat, point.lng);
      return {
        name: point.name,
        lat: point.lat,
        lng: point.lng,
        hourly: data.hourly || {},
        source: 'Open-Meteo',
      };
    })
  );

  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
}

export async function fetchHistoricalPrecipitation() {
  const results = await Promise.allSettled(
    STATION_POINTS.map(async (point) => {
      const data = await fetchPointHistorical(point.lat, point.lng);
      return {
        name: point.name,
        lat: point.lat,
        lng: point.lng,
        hourly: data.hourly || {},
        source: 'Open-Meteo (Histórico)',
      };
    })
  );

  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
}

export function summarizePrecipitation(stationsData) {
  const now = new Date();

  return stationsData.map((station) => {
    const times = (station.hourly.time || []).map((t) => new Date(t));
    const precip = station.hourly.precipitation || [];
    const rain = station.hourly.rain || [];

    let nowIdx = 0;
    let minDiff = Infinity;
    times.forEach((t, i) => {
      const diff = Math.abs(t - now);
      if (diff < minDiff) {
        minDiff = diff;
        nowIdx = i;
      }
    });

    const past24Indices = times
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t <= now && now - t <= 24 * 60 * 60 * 1000)
      .map(({ i }) => i);

    const total24h = past24Indices.reduce((sum, i) => sum + (precip[i] || 0), 0);

    const next6hIndices = times
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t > now && t - now <= 6 * 60 * 60 * 1000)
      .map(({ i }) => i);

    const forecast6h = next6hIndices.reduce((sum, i) => sum + (precip[i] || 0), 0);

    return {
      name: station.name,
      lat: station.lat,
      lng: station.lng,
      currentPrecip: precip[nowIdx] || 0,
      currentRain: rain[nowIdx] || 0,
      total24h: Math.round(total24h * 10) / 10,
      forecast6h: Math.round(forecast6h * 10) / 10,
      source: station.source,
    };
  });
}

/**
 * Open-Meteo — Precipitation-focused endpoint
 *
 * Fetches hourly precipitation data for multiple points across Medellín.
 * - Current mode: past 24h + forecast 48h  (forecast API)
 * - Historical mode: past 7 days + forecast 48h (forecast API with past_days)
 */

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// Precipitation measurement points across Antioquia
export const STATION_POINTS = [
  // ── Valle de Aburrá (Medellín metro) ──
  { name: 'Centro (La Candelaria)', lat: 6.2518, lng: -75.5636 },
  { name: 'El Poblado', lat: 6.2100, lng: -75.5700 },
  { name: 'Robledo', lat: 6.2750, lng: -75.5900 },
  { name: 'Manrique', lat: 6.2800, lng: -75.5450 },
  { name: 'Belén', lat: 6.2300, lng: -75.5900 },
  { name: 'Buenos Aires', lat: 6.2400, lng: -75.5450 },
  { name: 'Castilla', lat: 6.2850, lng: -75.5750 },
  { name: 'San Javier', lat: 6.2600, lng: -75.6100 },
  { name: 'Envigado', lat: 6.1714, lng: -75.5911 },
  { name: 'Itagüí', lat: 6.1847, lng: -75.6063 },
  { name: 'Bello', lat: 6.3383, lng: -75.5511 },
  { name: 'Copacabana', lat: 6.3500, lng: -75.5083 },
  { name: 'Sabaneta', lat: 6.1517, lng: -75.6167 },
  { name: 'La Estrella', lat: 6.1583, lng: -75.6417 },
  { name: 'Caldas', lat: 6.0900, lng: -75.6367 },
  { name: 'Girardota', lat: 6.3783, lng: -75.4550 },
  { name: 'Barbosa', lat: 6.4389, lng: -75.3317 },

  // ── Oriente antioqueño ──
  { name: 'Rionegro', lat: 6.1553, lng: -75.3743 },
  { name: 'Marinilla', lat: 6.1767, lng: -75.3367 },
  { name: 'La Ceja', lat: 6.0325, lng: -75.4267 },
  { name: 'El Retiro', lat: 6.0600, lng: -75.5067 },
  { name: 'Guarne', lat: 6.2800, lng: -75.4450 },
  { name: 'El Carmen de Viboral', lat: 6.0833, lng: -75.3333 },
  { name: 'San Vicente Ferrer', lat: 6.2833, lng: -75.3333 },
  { name: 'El Peñol', lat: 6.2217, lng: -75.2450 },
  { name: 'Guatapé', lat: 6.2328, lng: -75.1567 },
  { name: 'La Unión', lat: 5.9700, lng: -75.3617 },
  { name: 'Sonsón', lat: 5.7133, lng: -75.3117 },

  // ── Norte antioqueño ──
  { name: 'Santa Rosa de Osos', lat: 6.6481, lng: -75.4594 },
  { name: 'Yarumal', lat: 6.9644, lng: -75.4211 },
  { name: 'San Pedro de los Milagros', lat: 6.4611, lng: -75.5578 },
  { name: 'Donmatías', lat: 6.4856, lng: -75.3983 },
  { name: 'Entrerríos', lat: 6.5650, lng: -75.5283 },

  // ── Occidente antioqueño ──
  { name: 'Santa Fe de Antioquia', lat: 6.5567, lng: -75.8283 },
  { name: 'San Jerónimo', lat: 6.4433, lng: -75.7267 },
  { name: 'Sopetrán', lat: 6.5017, lng: -75.7450 },
  { name: 'Frontino', lat: 6.7767, lng: -76.1350 },

  // ── Suroeste antioqueño ──
  { name: 'Andes', lat: 5.6583, lng: -75.8800 },
  { name: 'Jardín', lat: 5.5983, lng: -75.8200 },
  { name: 'Ciudad Bolívar', lat: 5.8517, lng: -76.0233 },
  { name: 'Jericó', lat: 5.7917, lng: -75.7833 },
  { name: 'Amagá', lat: 6.0417, lng: -75.7033 },
  { name: 'Fredonia', lat: 5.9267, lng: -75.6717 },
  { name: 'Támesis', lat: 5.6617, lng: -75.7133 },

  // ── Nordeste antioqueño ──
  { name: 'Segovia', lat: 7.0783, lng: -74.7000 },
  { name: 'Remedios', lat: 7.0283, lng: -74.6933 },
  { name: 'Cisneros', lat: 6.5367, lng: -75.0883 },
  { name: 'Yolombó', lat: 6.5983, lng: -75.0133 },

  // ── Bajo Cauca ──
  { name: 'Caucasia', lat: 7.9847, lng: -75.1983 },
  { name: 'El Bagre', lat: 7.5933, lng: -74.8083 },
  { name: 'Nechí', lat: 8.0917, lng: -74.7750 },

  // ── Urabá ──
  { name: 'Apartadó', lat: 7.8833, lng: -76.6333 },
  { name: 'Turbo', lat: 8.0933, lng: -76.7267 },
  { name: 'Chigorodó', lat: 7.6667, lng: -76.6833 },
  { name: 'Necoclí', lat: 8.4250, lng: -76.7850 },
  { name: 'Carepa', lat: 7.7567, lng: -76.6533 },

  // ── Magdalena Medio ──
  { name: 'Puerto Berrío', lat: 6.4900, lng: -74.4050 },
  { name: 'Puerto Nare', lat: 6.1933, lng: -74.5867 },
  { name: 'Puerto Triunfo', lat: 5.8700, lng: -74.6350 },
];

/**
 * Open-Meteo supports multi-location requests via comma-separated lat/lng.
 * We batch in groups to avoid URL-length limits (~30 points per batch).
 */
const BATCH_SIZE = 30;

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Fetch a batch of points from Open-Meteo in a single request.
 * Returns an array of responses (one per coordinate).
 */
async function fetchBatch(points, extraParams = {}) {
  const params = new URLSearchParams({
    latitude: points.map((p) => p.lat).join(','),
    longitude: points.map((p) => p.lng).join(','),
    hourly: 'precipitation,rain,showers,weathercode',
    timezone: 'America/Bogota',
    ...extraParams,
  });

  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error('Open-Meteo batch error');
  const data = await res.json();

  // Single point returns an object; multiple points returns an array
  return Array.isArray(data) ? data : [data];
}

/**
 * Fetch precipitation for all station points across Antioquia (current mode).
 * Uses batched multi-location requests for efficiency.
 */
export async function fetchOpenMeteoPrecipitation() {
  const batches = chunkArray(STATION_POINTS, BATCH_SIZE);
  const allResults = [];

  const batchResults = await Promise.allSettled(
    batches.map((batch) => fetchBatch(batch, { past_hours: '24', forecast_hours: '48' }))
  );

  let pointIndex = 0;
  for (let b = 0; b < batchResults.length; b++) {
    const batch = batches[b];
    if (batchResults[b].status === 'fulfilled') {
      const dataArr = batchResults[b].value;
      for (let i = 0; i < batch.length; i++) {
        allResults.push({
          name: batch[i].name,
          lat: batch[i].lat,
          lng: batch[i].lng,
          hourly: dataArr[i]?.hourly || {},
          source: 'Open-Meteo',
        });
      }
    } else {
      console.warn(`Open-Meteo batch ${b} failed:`, batchResults[b].reason?.message);
    }
    pointIndex += batch.length;
  }

  return allResults;
}

/**
 * Fetch 7-day historical precipitation for all station points.
 * Uses batched multi-location requests for efficiency.
 */
export async function fetchHistoricalPrecipitation() {
  const batches = chunkArray(STATION_POINTS, BATCH_SIZE);
  const allResults = [];

  const batchResults = await Promise.allSettled(
    batches.map((batch) => fetchBatch(batch, { past_days: '7', forecast_days: '2' }))
  );

  for (let b = 0; b < batchResults.length; b++) {
    const batch = batches[b];
    if (batchResults[b].status === 'fulfilled') {
      const dataArr = batchResults[b].value;
      for (let i = 0; i < batch.length; i++) {
        allResults.push({
          name: batch[i].name,
          lat: batch[i].lat,
          lng: batch[i].lng,
          hourly: dataArr[i]?.hourly || {},
          source: 'Open-Meteo (Histórico)',
        });
      }
    } else {
      console.warn(`Open-Meteo historical batch ${b} failed:`, batchResults[b].reason?.message);
    }
  }

  return allResults;
}

/**
 * Get a summary: current precipitation and 24h total for each point.
 */
export function summarizePrecipitation(stationsData) {
  const now = new Date();

  return stationsData.map((station) => {
    const times = (station.hourly.time || []).map((t) => new Date(t));
    const precip = station.hourly.precipitation || [];
    const rain = station.hourly.rain || [];

    // Find the index closest to "now"
    let nowIdx = 0;
    let minDiff = Infinity;
    times.forEach((t, i) => {
      const diff = Math.abs(t - now);
      if (diff < minDiff) {
        minDiff = diff;
        nowIdx = i;
      }
    });

    // Sum last 24 hours of precipitation
    const past24Indices = times
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t <= now && now - t <= 24 * 60 * 60 * 1000)
      .map(({ i }) => i);

    const total24h = past24Indices.reduce((sum, i) => sum + (precip[i] || 0), 0);

    // Sum next 6 hours forecast
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

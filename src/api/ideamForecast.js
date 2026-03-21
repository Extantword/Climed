/**
 * IDEAM — Pronósticos y Alertas Nacionales
 * Open CSV/JSON endpoint for weather forecasts by municipality.
 *
 * The IDEAM open-data service exposes forecast data (temperature,
 * precipitation, humidity, etc.) for Colombian municipalities.
 * We fetch the JSON version filtered for Medellín.
 */

const BASE_URL = 'https://www.datos.gov.co/resource/s54a-sgyg.json';

/**
 * Fetch IDEAM precipitation observations for Medellín / Antioquia.
 */
export async function fetchIdeamPrecipitation({ limit = 50 } = {}) {
  const params = new URLSearchParams({
    $where: "upper(departamento) like '%ANTIOQUIA%'",
    $order: 'fechaobservacion DESC',
    $limit: String(limit),
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Error al obtener datos de IDEAM');
  const raw = await res.json();

  return raw.map((r) => ({
    station: r.nombreestacion || r.codigoestacion || 'Desconocida',
    stationCode: r.codigoestacion || '',
    department: r.departamento || '',
    municipality: r.municipio || '',
    lat: parseFloat(r.latitud) || null,
    lng: parseFloat(r.longitud) || null,
    date: r.fechaobservacion || null,
    value: parseFloat(r.valorobservado) || 0,
    unit: r.unidadmedida || 'mm',
    source: 'IDEAM (Precipitación)',
  }));
}

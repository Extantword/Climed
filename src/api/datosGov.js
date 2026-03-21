/**
 * datos.gov.co — Socrata SODA API
 * Dataset: Precipitaciones (IDEAM automatic stations)
 * ID: ksew-j3zj
 *
 * Returns recent precipitation readings from IDEAM stations
 * near Medellín / Antioquia.
 */

const BASE_URL = 'https://www.datos.gov.co/resource/ksew-j3zj.json';

/**
 * Fetch recent precipitation readings for Antioquia department.
 * The SODA API supports SoQL queries:
 *   $where  — filter rows
 *   $order  — sort
 *   $limit  — max rows
 */
export async function fetchDatosGovPrecipitation({ limit = 50 } = {}) {
  const params = new URLSearchParams({
    $where: "upper(departamento) like '%ANTIOQUIA%'",
    $order: 'fechaobservacion DESC',
    $limit: String(limit),
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Error al obtener datos de datos.gov.co');
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
    source: 'datos.gov.co (IDEAM)',
  }));
}

const BASE_URL = 'https://api.waqi.info';

export async function fetchWaqiStation(stationId, token) {
  if (!token) return null;
  try {
    const res = await fetch(`${BASE_URL}/feed/@${stationId}/?token=${encodeURIComponent(token)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.status === 'ok' ? data.data : null;
  } catch {
    return null;
  }
}

export async function searchWaqiStations(keyword = 'medellin', token) {
  if (!token) return [];
  try {
    const res = await fetch(`${BASE_URL}/search/?keyword=${encodeURIComponent(keyword)}&token=${encodeURIComponent(token)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.status === 'ok' ? data.data : [];
  } catch {
    return [];
  }
}

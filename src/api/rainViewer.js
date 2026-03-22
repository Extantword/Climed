const RAINVIEWER_API = 'https://api.rainviewer.com/public/weather-maps.json';

export async function fetchRadarFrames() {
  const res = await fetch(RAINVIEWER_API);
  if (!res.ok) throw new Error('RainViewer API error');
  const data = await res.json();
  return {
    host: data.host,
    past: data.radar?.past || [],
    nowcast: data.radar?.nowcast || [],
  };
}

// Build tile URL for a given frame path
export function radarTileUrl(host, path) {
  // Color scheme 6 = classic radar (green→yellow→red)
  // smooth=1, snow=1
  return `${host}${path}/256/{z}/{x}/{y}/6/1_1.png`;
}

// Build data tile URL (color scheme 0 = raw dBZ in Red channel)
export function radarDataTileUrl(host, path, zoom, tileX, tileY) {
  return `${host}${path}/256/${zoom}/${tileX}/${tileY}/0/0_0.png`;
}

/**
 * Radar pixel extraction — reads RainViewer visual tiles (color scheme 6)
 * and reverse-maps the pixel color to approximate precipitation (mm/h).
 *
 * Uses the same tile format displayed on the map overlay (scheme 6, smooth=1,
 * snow=1) so detected precipitation visually matches the radar overlay.
 *
 * Tile URL: ${host}${path}/256/6/${tileX}/${tileY}/6/1_1.png
 * Zoom 6 is the highest level RainViewer supports for radar tiles.
 * Each pixel ≈ 2.4 km; we scan a 11×11 neighborhood (~26 km²) per station.
 */

import { STATION_POINTS } from './openMeteoPrecip';

const TILE_SIZE = 256;
const ZOOM = 6;
const SCAN_RADIUS = 5; // 11×11 pixels ≈ 26 km² at zoom 6

/**
 * Convert lat/lng to slippy-map tile coordinates + pixel offset within that tile.
 */
export function latLngToTilePixel(lat, lng, zoom) {
  const n = 2 ** zoom;
  const latRad = (lat * Math.PI) / 180;

  const tileXFloat = ((lng + 180) / 360) * n;
  const tileYFloat = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;

  const tileX = Math.floor(tileXFloat);
  const tileY = Math.floor(tileYFloat);
  const pixelX = Math.floor((tileXFloat - tileX) * TILE_SIZE);
  const pixelY = Math.floor((tileYFloat - tileY) * TILE_SIZE);

  return { tileX, tileY, pixelX, pixelY };
}

/**
 * Fetch a tile PNG and return its ImageData via an offscreen canvas.
 * Uses fetch → blob → createImageBitmap to avoid CORS canvas-taint issues.
 */
async function fetchTilePixels(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    return ctx.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
  } catch {
    return null;
  }
}

/**
 * Color-to-precipitation lookup for RainViewer scheme 6.
 * Reference colors from the green→yellow→orange→red→purple progression.
 */
const COLOR_TABLE = [
  { r: 200, g: 255, b: 200, mmh: 0.2 },   // pale green — drizzle
  { r: 150, g: 255, b: 150, mmh: 0.5 },   // light green
  { r: 0,   g: 208, b: 0,   mmh: 1.0 },   // green — light rain
  { r: 0,   g: 144, b: 0,   mmh: 2.0 },   // dark green
  { r: 255, g: 255, b: 0,   mmh: 4.0 },   // yellow — moderate
  { r: 231, g: 192, b: 0,   mmh: 6.0 },   // gold
  { r: 255, g: 144, b: 0,   mmh: 10.0 },  // orange — heavy
  { r: 255, g: 0,   b: 0,   mmh: 20.0 },  // red
  { r: 214, g: 0,   b: 0,   mmh: 30.0 },  // dark red — very heavy
  { r: 192, g: 0,   b: 0,   mmh: 40.0 },  // maroon
  { r: 255, g: 0,   b: 255, mmh: 60.0 },  // magenta — extreme
  { r: 150, g: 0,   b: 200, mmh: 80.0 },  // purple
];

/** Closest-color match in RGB space → mm/h */
function rgbToMmH(r, g, b) {
  let bestDist = Infinity;
  let bestMmH = 0;
  for (const ref of COLOR_TABLE) {
    const dist = (r - ref.r) ** 2 + (g - ref.g) ** 2 + (b - ref.b) ** 2;
    if (dist < bestDist) { bestDist = dist; bestMmH = ref.mmh; }
  }
  return bestMmH;
}

/**
 * Read a single pixel. Returns mm/h or null if transparent or achromatic.
 */
function readSinglePixel(imageData, px, py) {
  if (px < 0 || py < 0 || px >= TILE_SIZE || py >= TILE_SIZE) return null;
  const idx = (py * TILE_SIZE + px) * 4;
  const r = imageData.data[idx];
  const g = imageData.data[idx + 1];
  const b = imageData.data[idx + 2];
  const a = imageData.data[idx + 3];
  if (a < 10) return null;
  // Reject grayscale artifacts (labels, borders, "no data" fills)
  if (Math.max(r, g, b) - Math.min(r, g, b) < 30) return null;
  return rgbToMmH(r, g, b);
}

/**
 * Scan a neighborhood and return max precipitation found.
 */
function readPixelValue(imageData, px, py) {
  let maxPrecip = null;
  for (let dy = -SCAN_RADIUS; dy <= SCAN_RADIUS; dy++) {
    for (let dx = -SCAN_RADIUS; dx <= SCAN_RADIUS; dx++) {
      const val = readSinglePixel(imageData, px + dx, py + dy);
      if (val !== null && (maxPrecip === null || val > maxPrecip)) {
        maxPrecip = val;
      }
    }
  }
  return maxPrecip;
}

/**
 * Main export: extract precipitation at all station points from a radar frame.
 */
export async function extractPrecipFromRadar(host, framePath, points = STATION_POINTS) {
  // 1. Compute tile+pixel for each point
  const pointInfos = points.map((pt) => {
    const { tileX, tileY, pixelX, pixelY } = latLngToTilePixel(pt.lat, pt.lng, ZOOM);
    return { ...pt, tileX, tileY, pixelX, pixelY, tileKey: `${tileX}_${tileY}` };
  });

  // 2. Deduplicate tiles
  const uniqueTiles = new Map();
  for (const pi of pointInfos) {
    if (!uniqueTiles.has(pi.tileKey)) {
      uniqueTiles.set(pi.tileKey, { tileX: pi.tileX, tileY: pi.tileY });
    }
  }

  // 3. Fetch all tiles in parallel (scheme 6, smooth=1, snow=1)
  const tileResults = new Map();
  const entries = [...uniqueTiles.entries()];
  const settled = await Promise.allSettled(
    entries.map(([key, { tileX, tileY }]) => {
      const url = `${host}${framePath}/256/${ZOOM}/${tileX}/${tileY}/6/1_1.png`;
      return fetchTilePixels(url).then((data) => ({ key, data }));
    })
  );
  for (const result of settled) {
    if (result.status === 'fulfilled' && result.value.data) {
      tileResults.set(result.value.key, result.value.data);
    }
  }

  // 4. Read pixel values
  return pointInfos.map((pi) => {
    const imageData = tileResults.get(pi.tileKey);
    let precip = 0;
    if (imageData) {
      const val = readPixelValue(imageData, pi.pixelX, pi.pixelY);
      if (val !== null) precip = Math.round(val * 100) / 100;
    }
    return { name: pi.name, lat: pi.lat, lng: pi.lng, precip };
  });
}

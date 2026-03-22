/**
 * Radar pixel extraction — reads RainViewer tiles (color scheme 0)
 * to get real dBZ values at specific lat/lng points, then converts to mm/h.
 *
 * Color scheme 0: Red channel encodes raw dBZ as R-32.
 * Tile URL: ${host}${path}/256/${z}/${tileX}/${tileY}/0/0_0.png
 */

import { STATION_POINTS } from './openMeteoPrecip';

const TILE_SIZE = 256;
const DEFAULT_ZOOM = 6;

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
 * Returns null on any error (CORS, network, etc.).
 */
function fetchTilePixels(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = TILE_SIZE;
        canvas.height = TILE_SIZE;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, TILE_SIZE, TILE_SIZE));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Marshall-Palmer: convert dBZ to mm/h.
 * Z = 200 * R^1.6  →  R = (Z/200)^(1/1.6)
 * where Z = 10^(dBZ/10)
 */
function dBZToMmH(dBZ) {
  if (dBZ <= 0) return 0;
  const Z = 10 ** (dBZ / 10);
  return (Z / 200) ** (1 / 1.6);
}

/**
 * Read pixel at (px, py) from ImageData and convert to mm/h.
 * Returns null if alpha is 0 (no radar coverage).
 */
function readPixelValue(imageData, px, py) {
  const idx = (py * TILE_SIZE + px) * 4;
  const a = imageData.data[idx + 3];
  if (a === 0) return null; // no coverage
  const r = imageData.data[idx];
  const dBZ = r - 32;
  return dBZToMmH(dBZ);
}

/**
 * Main export: extract precipitation values at all STATION_POINTS from a radar frame.
 *
 * @param {string} host - RainViewer host (e.g. "https://tilecache.rainviewer.com")
 * @param {string} framePath - Frame path (e.g. "/v2/radar/1616...")
 * @param {Array} points - Array of {name, lat, lng}
 * @param {number} zoom - Tile zoom level (default 6)
 * @returns {Promise<Array<{name, lat, lng, precip}>>}
 */
export async function extractPrecipFromRadar(host, framePath, points = STATION_POINTS, zoom = DEFAULT_ZOOM) {
  // 1. Compute tile+pixel for each point
  const pointInfos = points.map((pt) => {
    const { tileX, tileY, pixelX, pixelY } = latLngToTilePixel(pt.lat, pt.lng, zoom);
    return { ...pt, tileX, tileY, pixelX, pixelY, tileKey: `${tileX}_${tileY}` };
  });

  // 2. Deduplicate tiles
  const uniqueTiles = new Map();
  for (const pi of pointInfos) {
    if (!uniqueTiles.has(pi.tileKey)) {
      uniqueTiles.set(pi.tileKey, { tileX: pi.tileX, tileY: pi.tileY });
    }
  }

  // 3. Fetch all tiles in parallel
  const tileResults = new Map();
  const entries = [...uniqueTiles.entries()];
  const settled = await Promise.allSettled(
    entries.map(([key, { tileX, tileY }]) => {
      const url = `${host}${framePath}/256/${zoom}/${tileX}/${tileY}/0/0_0.png`;
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

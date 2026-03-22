import { useState, useEffect, useRef } from 'react';
import { extractPrecipFromRadar } from '../api/radarExtract';

/**
 * Hook that extracts real precipitation values from RainViewer radar tiles
 * at each station point. Skips extraction while animation is playing.
 */
export function useRadarPrecip(host, currentFrame, playing) {
  const [radarPoints, setRadarPoints] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    // Skip if no data or animation is playing
    if (!host || !currentFrame?.path || playing) return;

    const id = ++requestId.current;
    setExtracting(true);

    extractPrecipFromRadar(host, currentFrame.path)
      .then((points) => {
        // Discard stale results
        if (id === requestId.current) {
          setRadarPoints(points);
        }
      })
      .catch((err) => {
        console.error('Radar extraction failed:', err);
      })
      .finally(() => {
        if (id === requestId.current) {
          setExtracting(false);
        }
      });
  }, [host, currentFrame?.path, playing]);

  return { radarPoints, extracting };
}

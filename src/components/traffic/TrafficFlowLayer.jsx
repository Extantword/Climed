import { TileLayer } from 'react-leaflet';

const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_KEY;

/**
 * Live TomTom traffic flow tile overlay.
 * Requires VITE_TOMTOM_KEY env variable.
 * Shows colored road segments: green=free, yellow=slow, red=gridlock.
 */
export default function TrafficFlowLayer({ opacity = 0.7 }) {
  if (!TOMTOM_KEY) return null;

  return (
    <TileLayer
      key="tomtom-flow"
      url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${TOMTOM_KEY}`}
      opacity={opacity}
      zIndex={12}
      attribution='&copy; <a href="https://developer.tomtom.com">TomTom</a>'
      tileSize={256}
    />
  );
}

export { TOMTOM_KEY };

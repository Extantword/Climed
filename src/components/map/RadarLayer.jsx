import { TileLayer } from 'react-leaflet';
import { radarTileUrl } from '../../api/rainViewer';

const RADAR_MAX_ZOOM = 7;

export default function RadarLayer({ host, frame, opacity = 0.65 }) {
  if (!host || !frame) return null;
  return (
    <TileLayer
      key={frame.path}
      url={radarTileUrl(host, frame.path)}
      opacity={opacity}
      zIndex={10}
      maxNativeZoom={RADAR_MAX_ZOOM}
      maxZoom={19}
      tileSize={256}
      attribution=""
    />
  );
}

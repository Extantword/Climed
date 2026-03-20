import { TileLayer } from 'react-leaflet';
import { radarTileUrl } from '../../api/rainViewer';

export default function RadarLayer({ host, frame, opacity = 0.65 }) {
  if (!host || !frame) return null;
  return (
    <TileLayer
      key={frame.path}
      url={radarTileUrl(host, frame.path)}
      opacity={opacity}
      zIndex={10}
      attribution=""
    />
  );
}

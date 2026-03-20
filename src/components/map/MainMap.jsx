import { MapContainer, TileLayer } from 'react-leaflet';
import { MEDELLIN_CENTER, MEDELLIN_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../utils/constants';
import RadarLayer from './RadarLayer';

export default function MainMap({ host, currentFrame }) {
  return (
    <MapContainer center={MEDELLIN_CENTER} zoom={MEDELLIN_ZOOM} className="w-full h-full" zoomControl={true}>
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <RadarLayer host={host} frame={currentFrame} />
    </MapContainer>
  );
}

import { MapContainer, TileLayer } from 'react-leaflet';
import { MEDELLIN_CENTER, MEDELLIN_ZOOM, TILE_URL, TILE_ATTRIBUTION, TILE_MAX_ZOOM, ANTIOQUIA_BOUNDS } from '../../utils/constants';
import RadarLayer from './RadarLayer';
import HistoricalRainLayer from './HistoricalRainLayer';

export default function MainMap({ host, currentFrame, replayActive, replayPoints }) {
  return (
    <MapContainer center={MEDELLIN_CENTER} zoom={MEDELLIN_ZOOM} maxZoom={TILE_MAX_ZOOM} minZoom={7} maxBounds={ANTIOQUIA_BOUNDS} maxBoundsViscosity={1.0} className="w-full h-full" zoomControl={true}>
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />
      <RadarLayer host={host} frame={currentFrame} />
      <HistoricalRainLayer active={replayActive} points={replayPoints} />
    </MapContainer>
  );
}

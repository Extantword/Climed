import { MapContainer, TileLayer } from 'react-leaflet';
import { MEDELLIN_CENTER, MEDELLIN_ZOOM, TILE_ATTRIBUTION } from '../../utils/constants';
import CongestionLayer from './CongestionLayer';
import TrafficFlowLayer, { TOMTOM_KEY } from './TrafficFlowLayer';

// Dark-ish base map that makes traffic colors pop
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

export default function TrafficMap({ isLive, corridorScores }) {
  return (
    <MapContainer
      center={MEDELLIN_CENTER}
      zoom={MEDELLIN_ZOOM}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer url={DARK_TILE_URL} attribution={DARK_ATTRIBUTION} />

      {/* Live mode: TomTom real-time tiles (if API key is available) */}
      {isLive && TOMTOM_KEY && <TrafficFlowLayer />}

      {/* Historical replay (or live fallback without API key): simulated corridor lines */}
      {(!isLive || !TOMTOM_KEY) && (
        <CongestionLayer corridorScores={corridorScores} />
      )}
    </MapContainer>
  );
}

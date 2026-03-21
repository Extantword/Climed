import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MEDELLIN_CENTER, MEDELLIN_ZOOM, TILE_URL, TILE_ATTRIBUTION, TILE_MAX_ZOOM, ANTIOQUIA_BOUNDS } from '../../utils/constants';
import RadarLayer from './RadarLayer';
import HistoricalRainLayer from './HistoricalRainLayer';

function RecenterControl() {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: 'bottomleft' });
    control.onAdd = () => {
      const btn = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const a = L.DomUtil.create('a', '', btn);
      a.href = '#';
      a.title = 'Recentrar en Medellín';
      a.innerHTML = '🎯';
      a.style.cssText = 'display:flex;align-items:center;justify-content:center;width:34px;height:34px;font-size:18px;cursor:pointer;text-decoration:none;';
      L.DomEvent.disableClickPropagation(btn);
      L.DomEvent.on(a, 'click', (e) => {
        L.DomEvent.preventDefault(e);
        map.setView(MEDELLIN_CENTER, MEDELLIN_ZOOM);
      });
      return btn;
    };
    control.addTo(map);
    return () => control.remove();
  }, [map]);

  return null;
}

export default function MainMap({ host, currentFrame, replayActive, replayPoints }) {
  return (
    <MapContainer center={MEDELLIN_CENTER} zoom={MEDELLIN_ZOOM} maxZoom={TILE_MAX_ZOOM} minZoom={7} maxBounds={ANTIOQUIA_BOUNDS} maxBoundsViscosity={1.0} className="w-full h-full" zoomControl={true}>
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} />
      <RadarLayer host={host} frame={currentFrame} />
      <HistoricalRainLayer active={replayActive} points={replayPoints} />
      <RecenterControl />
    </MapContainer>
  );
}

import { MapContainer, TileLayer, Polyline, Tooltip } from 'react-leaflet';
import { MEDELLIN_CENTER, MEDELLIN_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../utils/constants';
import ComunaLayer from './ComunaLayer';
import QuebradaLayer from './QuebradaLayer';
import SiniestroHeatmap from './SiniestroHeatmap';
import PuntosCriticos from './PuntosCriticos';

export default function MainMap({ comunasData, quebradasData, siniestrosData, puntosCriticos, corredores, activeModule, selectedComuna }) {
  return (
    <MapContainer center={MEDELLIN_CENTER} zoom={MEDELLIN_ZOOM} className="w-full h-full" zoomControl={true}>
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      {comunasData && (activeModule === 'inundaciones' || activeModule === 'aire') && (
        <ComunaLayer data={comunasData} activeModule={activeModule} selectedComuna={selectedComuna} />
      )}
      {quebradasData && activeModule === 'inundaciones' && (
        <QuebradaLayer data={quebradasData} />
      )}
      {siniestrosData && activeModule === 'siniestros' && (
        <SiniestroHeatmap data={siniestrosData} />
      )}
      {puntosCriticos && activeModule === 'inundaciones' && (
        <PuntosCriticos data={puntosCriticos} />
      )}
      {corredores && activeModule === 'siniestros' && corredores.map((c, i) => (
        <Polyline
          key={i}
          positions={[[c.latInicio, c.lngInicio], [c.latFin, c.lngFin]]}
          pathOptions={{ color: '#EF4444', weight: 4, opacity: 0.8 }}
        >
          <Tooltip sticky>
            <div className="text-sm">
              <strong>{c.nombre}</strong><br />
              {c.siniestros.toLocaleString()} siniestros · {c.muertos} muertos
            </div>
          </Tooltip>
        </Polyline>
      ))}
    </MapContainer>
  );
}

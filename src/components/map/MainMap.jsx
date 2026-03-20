import { MapContainer, TileLayer } from 'react-leaflet';
import { MEDELLIN_CENTER, MEDELLIN_ZOOM, TILE_URL, TILE_ATTRIBUTION } from '../../utils/constants';
import ComunaLayer from './ComunaLayer';
import QuebradaLayer from './QuebradaLayer';
import PuntosCriticos from './PuntosCriticos';

export default function MainMap({ comunasData, quebradasData, puntosCriticos, selectedComuna }) {
  return (
    <MapContainer center={MEDELLIN_CENTER} zoom={MEDELLIN_ZOOM} className="w-full h-full" zoomControl={true}>
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      {comunasData && (
        <ComunaLayer data={comunasData} activeModule="inundaciones" selectedComuna={selectedComuna} />
      )}
      {quebradasData && (
        <QuebradaLayer data={quebradasData} />
      )}
      {puntosCriticos && (
        <PuntosCriticos data={puntosCriticos} />
      )}
    </MapContainer>
  );
}

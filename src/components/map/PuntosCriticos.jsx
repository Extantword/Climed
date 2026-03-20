import { CircleMarker, Tooltip } from 'react-leaflet';

export default function PuntosCriticos({ data }) {
  if (!data || !Array.isArray(data)) return null;
  return (
    <>
      {data.map((p, i) => (
        <CircleMarker
          key={i}
          center={[p.lat, p.lng]}
          radius={8}
          pathOptions={{
            color: p.nivelRiesgo === 'alto' ? '#EF4444' : '#F59E0B',
            fillColor: p.nivelRiesgo === 'alto' ? '#EF4444' : '#F59E0B',
            fillOpacity: 0.4,
            weight: 2,
          }}
        >
          <Tooltip>
            <div className="text-xs">
              <strong>{p.nombre}</strong><br />
              {p.descripcion}<br />
              Riesgo: {p.nivelRiesgo}
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}

import { CircleMarker, Tooltip } from 'react-leaflet';

export default function SiniestroHeatmap({ data }) {
  if (!data || !Array.isArray(data)) return null;
  return (
    <>
      {data.map((s, i) => (
        <CircleMarker
          key={i}
          center={[s.lat, s.lng]}
          radius={4}
          pathOptions={{
            color: 'transparent',
            fillColor: s.tipo === 'atropello' ? '#EF4444' : s.tipo === 'choque' ? '#F97316' : '#F59E0B',
            fillOpacity: 0.6,
          }}
        >
          <Tooltip>
            <div className="text-xs">
              <strong>{s.tipo}</strong> — {s.actor}<br />
              Comuna {s.comuna} · {s.fecha}
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}

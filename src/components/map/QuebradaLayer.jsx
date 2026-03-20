import { GeoJSON } from 'react-leaflet';
import { useMemo } from 'react';

export default function QuebradaLayer({ data }) {
  const style = useMemo(() => ({
    color: '#3B82F6',
    weight: 2,
    opacity: 0.7,
    dashArray: '5,5',
  }), []);

  const onEachFeature = useMemo(() => {
    return (feature, layer) => {
      layer.bindTooltip(feature.properties.nombre, { sticky: true });
    };
  }, []);

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />;
}

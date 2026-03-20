import { GeoJSON } from 'react-leaflet';
import { useMemo } from 'react';
import { getComunaColor, getAqiColor } from '../../utils/colorScales';

export default function ComunaLayer({ data, activeModule, selectedComuna }) {
  const style = useMemo(() => {
    return (feature) => {
      const props = feature.properties;
      const isSelected = selectedComuna && props.numero === selectedComuna;
      let fillColor = getComunaColor(props.nivelRiesgo);
      if (activeModule === 'aire' && props.aqi) {
        fillColor = getAqiColor(props.aqi);
      }
      return {
        fillColor,
        fillOpacity: isSelected ? 0.55 : 0.35,
        color: isSelected ? '#1D4ED8' : '#334155',
        weight: isSelected ? 3 : 1.5,
      };
    };
  }, [activeModule, selectedComuna]);

  const onEachFeature = useMemo(() => {
    return (feature, layer) => {
      const p = feature.properties;
      layer.bindTooltip(
        `<strong>${p.numero}-${p.nombre}</strong><br/>Riesgo: ${p.nivelRiesgo}`,
        { sticky: true }
      );
    };
  }, []);

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />;
}

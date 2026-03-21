import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * Maps precipitation (mm/h) to a color + radius matching the radar legend.
 */
function precipStyle(mm) {
  if (mm <= 0) return null; // No rain — don't draw anything
  if (mm < 1) return { color: '#C8F0C8', radius: 1200, opacity: 0.40 };
  if (mm < 2.5) return { color: '#00D000', radius: 1400, opacity: 0.45 };
  if (mm < 5) return { color: '#009000', radius: 1600, opacity: 0.45 };
  if (mm < 10) return { color: '#FFFF00', radius: 1800, opacity: 0.45 };
  if (mm < 20) return { color: '#FF6600', radius: 2000, opacity: 0.50 };
  if (mm < 40) return { color: '#FF0000', radius: 2200, opacity: 0.50 };
  return { color: '#CC00CC', radius: 2500, opacity: 0.55 };
}

/**
 * HistoricalRainLayer
 *
 * Renders circles on the map for each station point based on
 * actual precipitation data at the current time slot.
 *
 * Props:
 *   active   — boolean, whether the layer is visible
 *   points   — array of { name, lat, lng, precip, rain, showers }
 */
export default function HistoricalRainLayer({ active, points }) {
  const map = useMap();
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Clean up previous layer
    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
      layerGroupRef.current = null;
    }

    if (!active || !points || points.length === 0) return;

    const group = L.layerGroup();

    points.forEach((pt) => {
      const style = precipStyle(pt.precip);
      if (!style) return; // Skip dry stations

      // Main circle
      L.circle([pt.lat, pt.lng], {
        radius: style.radius,
        color: 'transparent',
        fillColor: style.color,
        fillOpacity: style.opacity,
        stroke: false,
        interactive: false,
      }).addTo(group);

      // Softer outer glow for visual continuity
      L.circle([pt.lat, pt.lng], {
        radius: style.radius * 1.8,
        color: 'transparent',
        fillColor: style.color,
        fillOpacity: style.opacity * 0.3,
        stroke: false,
        interactive: false,
      }).addTo(group);

      // Tooltip with station name + value
      L.circleMarker([pt.lat, pt.lng], {
        radius: 4,
        color: '#fff',
        fillColor: style.color,
        fillOpacity: 1,
        weight: 2,
        interactive: true,
      })
        .bindTooltip(
          `<strong>${pt.name}</strong><br/>${pt.precip.toFixed(1)} mm/h`,
          { direction: 'top', offset: [0, -6] }
        )
        .addTo(group);
    });

    group.addTo(map);
    layerGroupRef.current = group;

    return () => {
      if (layerGroupRef.current) {
        map.removeLayer(layerGroupRef.current);
        layerGroupRef.current = null;
      }
    };
  }, [map, active, points]);

  return null;
}

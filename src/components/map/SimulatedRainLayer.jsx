import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * Simulated rain zones around Medellín.
 * Each zone has: center, radiusMeters, intensity color, and opacity.
 * We create multiple overlapping circles to mimic a realistic radar look.
 */
const RAIN_ZONES = [
  // Heavy rain cluster — Centro / La Candelaria
  { center: [6.251, -75.564], radius: 1800, color: '#FF0000', opacity: 0.45 },
  { center: [6.248, -75.570], radius: 1200, color: '#FF6600', opacity: 0.40 },
  { center: [6.255, -75.558], radius: 900, color: '#CC00CC', opacity: 0.35 },

  // Moderate rain — Robledo / Castilla
  { center: [6.275, -75.590], radius: 2500, color: '#FFFF00', opacity: 0.35 },
  { center: [6.282, -75.585], radius: 1600, color: '#FF6600', opacity: 0.30 },
  { center: [6.268, -75.598], radius: 1000, color: '#009000', opacity: 0.35 },

  // Light rain — El Poblado
  { center: [6.210, -75.570], radius: 2200, color: '#00D000', opacity: 0.30 },
  { center: [6.205, -75.562], radius: 1400, color: '#C8F0C8', opacity: 0.35 },

  // Moderate — Manrique / Aranjuez
  { center: [6.280, -75.545], radius: 2000, color: '#009000', opacity: 0.35 },
  { center: [6.285, -75.540], radius: 1300, color: '#FFFF00', opacity: 0.30 },
  { center: [6.290, -75.548], radius: 800, color: '#FF6600', opacity: 0.35 },

  // Light drizzle — Belén / Guayabal
  { center: [6.230, -75.590], radius: 2800, color: '#C8F0C8', opacity: 0.30 },
  { center: [6.225, -75.585], radius: 1500, color: '#00D000', opacity: 0.30 },

  // Scattered — San Javier
  { center: [6.260, -75.610], radius: 1800, color: '#00D000', opacity: 0.30 },
  { center: [6.255, -75.615], radius: 1000, color: '#FFFF00', opacity: 0.25 },

  // Heavy cell — Buenos Aires / Villa Hermosa
  { center: [6.240, -75.545], radius: 2000, color: '#FF6600', opacity: 0.35 },
  { center: [6.237, -75.540], radius: 1100, color: '#FF0000', opacity: 0.40 },
  { center: [6.242, -75.538], radius: 600, color: '#CC00CC', opacity: 0.35 },

  // Wide light coverage — northern hills
  { center: [6.300, -75.570], radius: 3500, color: '#C8F0C8', opacity: 0.25 },
  { center: [6.310, -75.560], radius: 2000, color: '#00D000', opacity: 0.25 },
];

export default function SimulatedRainLayer({ active }) {
  const map = useMap();
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Clean up previous layer
    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
      layerGroupRef.current = null;
    }

    if (!active) return;

    const group = L.layerGroup();

    RAIN_ZONES.forEach((zone) => {
      L.circle(zone.center, {
        radius: zone.radius,
        color: 'transparent',
        fillColor: zone.color,
        fillOpacity: zone.opacity,
        stroke: false,
        interactive: false,
      }).addTo(group);
    });

    group.addTo(map);
    layerGroupRef.current = group;

    return () => {
      if (layerGroupRef.current) {
        map.removeLayer(layerGroupRef.current);
        layerGroupRef.current = null;
      }
    };
  }, [map, active]);

  return null;
}

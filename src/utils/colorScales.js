import { RISK_COLORS, AQI_SCALE } from './constants';

export function getRiskColor(level) {
  return RISK_COLORS[level] || RISK_COLORS.verde;
}

export function getComunaColor(nivelRiesgo) {
  const map = { alto: '#EF4444', medio: '#F59E0B', bajo: '#10B981' };
  return map[nivelRiesgo] || '#64748B';
}

export function getAqiColor(aqi) {
  const entry = AQI_SCALE.find((s) => aqi >= s.min && aqi <= s.max);
  return entry ? entry.color : '#64748B';
}

export function getAqiInfo(aqi) {
  return AQI_SCALE.find((s) => aqi >= s.min && aqi <= s.max) || AQI_SCALE[0];
}

export function getRiverColor(discharge, mean) {
  const ratio = discharge / (mean || 1);
  if (ratio > 3) return '#EF4444';
  if (ratio > 2) return '#F97316';
  if (ratio > 1.5) return '#F59E0B';
  return '#10B981';
}

export function formatTemp(temp) {
  return `${Math.round(temp)}°C`;
}

export function formatPrecip(mm) {
  return `${mm.toFixed(1)} mm`;
}

export function formatWind(kmh) {
  return `${Math.round(kmh)} km/h`;
}

export function formatDischarge(m3s) {
  return `${m3s.toFixed(1)} m³/s`;
}

export function formatAqi(aqi) {
  return Math.round(aqi);
}

export function formatTime(date) {
  if (!date) return '--:--';
  return new Date(date).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  });
}

export function formatDate(date) {
  if (!date) return '--';
  return new Date(date).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    timeZone: 'America/Bogota',
  });
}

export function formatDateTime(date) {
  if (!date) return '--';
  return new Date(date).toLocaleString('es-CO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  });
}

export function formatNumber(n) {
  return new Intl.NumberFormat('es-CO').format(n);
}

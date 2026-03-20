import { WEATHER_CODES } from '../../utils/constants';
import { formatTemp, formatPrecip, formatWind } from '../../utils/formatters';

export default function WeatherNow({ data, loading }) {
  if (loading || !data?.current_weather) {
    return (
      <div className="widget-card animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
        <div className="h-8 bg-slate-700 rounded w-16"></div>
      </div>
    );
  }

  const cw = data.current_weather;
  const wc = WEATHER_CODES[cw.weathercode] || { label: 'Desconocido', icon: '❓' };

  return (
    <div className="widget-card">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400 uppercase tracking-wide">Clima Actual</span>
        <span className="text-2xl">{wc.icon}</span>
      </div>
      <div className="text-2xl font-bold text-white font-mono">{formatTemp(cw.temperature)}</div>
      <p className="text-sm text-slate-300">{wc.label}</p>
      <div className="flex gap-3 mt-2 text-xs text-slate-400">
        <span>Viento: {formatWind(cw.windspeed)}</span>
      </div>
    </div>
  );
}

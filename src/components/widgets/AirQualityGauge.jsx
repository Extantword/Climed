import { getAqiInfo } from '../../utils/colorScales';

export default function AirQualityGauge({ data, loading }) {
  if (loading || !data?.hourly) {
    return (
      <div className="widget-card animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-28 mb-2"></div>
        <div className="h-20 bg-slate-700 rounded"></div>
      </div>
    );
  }

  const hourly = data.hourly;
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex((t) => new Date(t) >= now) - 1;
  const idx = Math.max(0, currentHourIndex);
  const aqi = hourly.us_aqi?.[idx] ?? 0;
  const pm25 = hourly.pm2_5?.[idx] ?? 0;
  const pm10 = hourly.pm10?.[idx] ?? 0;
  const info = getAqiInfo(aqi);

  const angle = Math.min((aqi / 300) * 180, 180);
  const radius = 40;
  const cx = 50;
  const cy = 50;
  const startAngle = Math.PI;
  const endAngle = startAngle - (angle * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(startAngle);
  const y1 = cy - radius * Math.sin(startAngle);
  const x2 = cx + radius * Math.cos(endAngle);
  const y2 = cy - radius * Math.sin(endAngle);
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <div className="widget-card">
      <span className="text-xs text-slate-400 uppercase tracking-wide">Calidad del Aire (AQI)</span>
      <div className="flex items-center gap-3 mt-1">
        <svg viewBox="0 0 100 60" className="w-20 h-12">
          <path d={`M 10 50 A 40 40 0 0 1 90 50`} fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          {aqi > 0 && (
            <path d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`} fill="none" stroke={info.color} strokeWidth="6" strokeLinecap="round" className="gauge-ring" />
          )}
          <text x="50" y="48" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="JetBrains Mono">{Math.round(aqi)}</text>
        </svg>
        <div>
          <p className="text-sm font-semibold" style={{ color: info.color }}>{info.label}</p>
          <p className="text-xs text-slate-400">{info.advice}</p>
        </div>
      </div>
      <div className="flex gap-4 mt-2 text-xs text-slate-400">
        <span>PM2.5: <strong className="text-slate-200 font-mono">{pm25.toFixed(1)}</strong> µg/m³</span>
        <span>PM10: <strong className="text-slate-200 font-mono">{pm10.toFixed(1)}</strong> µg/m³</span>
      </div>
    </div>
  );
}

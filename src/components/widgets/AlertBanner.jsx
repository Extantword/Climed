import { shouldShowAlert } from '../../utils/riskCalculator';

export default function AlertBanner({ weatherData, floodData }) {
  if (!weatherData?.hourly || !floodData?.daily) return null;

  const hourly = weatherData.hourly;
  const now = new Date();
  const startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
  const next6h = hourly.precipitation?.slice(startIdx, startIdx + 6) || [];
  const precip6h = next6h.reduce((a, b) => a + b, 0);

  const daily = floodData.daily;
  const todayIdx = daily.time.findIndex((t) => new Date(t).toDateString() === now.toDateString());
  const currentDischarge = daily.river_discharge?.[Math.max(0, todayIdx)] ?? 0;
  const meanDischarge = daily.river_discharge_mean?.[Math.max(0, todayIdx)] ?? 1;

  const show = shouldShowAlert({
    precipitation6h: precip6h,
    riverDischarge: { current: currentDischarge, alertThreshold: 300 },
  });

  if (!show) return null;

  const messages = [];
  if (precip6h > 20) messages.push(`Lluvia acumulada próximas 6h: ${precip6h.toFixed(1)} mm`);
  if (currentDischarge > 300) messages.push(`Descarga del río: ${currentDischarge.toFixed(0)} m³/s (${(currentDischarge / meanDischarge).toFixed(1)}x promedio)`);

  return (
    <div className="bg-red-900/80 border border-red-700 px-4 py-2 flex items-center gap-2 alert-pulse flex-shrink-0">
      <span className="text-red-400 font-bold text-lg">⚠</span>
      <div>
        <p className="text-red-200 text-sm font-semibold">ALERTA ACTIVA</p>
        {messages.map((m, i) => (
          <p key={i} className="text-red-300 text-xs">{m}</p>
        ))}
      </div>
    </div>
  );
}

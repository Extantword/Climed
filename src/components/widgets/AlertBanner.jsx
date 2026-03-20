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

  const show = shouldShowAlert({
    precipitation6h: precip6h,
    riverDischarge: { current: currentDischarge, alertThreshold: 300 },
  });

  if (!show) return null;

  const messages = [];
  if (precip6h > 20) messages.push(`Lluvia acumulada próximas 6h: ${precip6h.toFixed(1)} mm`);
  if (currentDischarge > 300) messages.push(`Caudal del río: ${currentDischarge.toFixed(0)} m³/s`);

  return (
    <div className="bg-red-600 px-4 py-2 flex items-center gap-2 alert-pulse shadow-md">
      <span className="text-white font-bold text-lg">⚠</span>
      <div>
        <p className="text-white text-sm font-bold">ALERTA ACTIVA</p>
        {messages.map((m, i) => (
          <p key={i} className="text-red-100 text-xs">{m}</p>
        ))}
      </div>
    </div>
  );
}

import { calculateRiskScore } from '../../utils/riskCalculator';
import { getRiskColor } from '../../utils/colorScales';
import { RISK_LABELS } from '../../utils/constants';

export default function RiskScore({ weatherData, floodData, airData, comunaRiskLevel }) {
  const precipitation = weatherData?.current_weather?.precipitation ??
    (weatherData?.hourly?.precipitation?.[0] ?? 0);

  const daily = floodData?.daily;
  let riverDischarge = { current: 0, mean: 1 };
  if (daily?.river_discharge) {
    const now = new Date();
    const todayIdx = daily.time.findIndex((t) => new Date(t).toDateString() === now.toDateString());
    const idx = Math.max(0, todayIdx);
    riverDischarge = {
      current: daily.river_discharge[idx] ?? 0,
      mean: daily.river_discharge_mean?.[idx] ?? 1,
    };
  }

  let aqi = 0;
  if (airData?.hourly?.us_aqi) {
    const now = new Date();
    const idx = Math.max(0, airData.hourly.time.findIndex((t) => new Date(t) >= now) - 1);
    aqi = airData.hourly.us_aqi[idx] ?? 0;
  }

  const { score, level } = calculateRiskScore({
    precipitation,
    riverDischarge,
    aqi,
    comunaRiskLevel: comunaRiskLevel || 'bajo',
  });

  const color = getRiskColor(level);
  const label = RISK_LABELS[level];

  return (
    <div className="widget-card">
      <span className="text-xs text-slate-400 uppercase tracking-wide">Riesgo Consolidado</span>
      <div className="flex items-center gap-3 mt-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold font-mono text-lg border-2"
          style={{ borderColor: color, backgroundColor: color + '33' }}
        >
          {score}
        </div>
        <div>
          <p className="font-semibold" style={{ color }}>{label}</p>
          <p className="text-xs text-slate-400">Score: {score}/100</p>
        </div>
      </div>
    </div>
  );
}

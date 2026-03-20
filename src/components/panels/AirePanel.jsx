import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getAqiInfo } from '../../utils/colorScales';

const OMS_LIMITS = {
  pm2_5: 15,
  pm10: 45,
  nitrogen_dioxide: 25,
  ozone: 100,
  sulphur_dioxide: 40,
};

const POLLUTANT_LABELS = {
  pm2_5: 'PM2.5',
  pm10: 'PM10',
  nitrogen_dioxide: 'NO₂',
  ozone: 'O₃',
  sulphur_dioxide: 'SO₂',
};

export default function AirePanel({ airData }) {
  if (!airData?.hourly) {
    return <div className="p-4 text-slate-400 text-sm">Cargando datos de calidad del aire...</div>;
  }

  const hourly = airData.hourly;
  const now = new Date();
  const currentIdx = Math.max(0, hourly.time.findIndex((t) => new Date(t) >= now) - 1);

  const last48Start = Math.max(0, currentIdx - 48);
  const historyData = hourly.time.slice(last48Start, currentIdx + 1).map((t, i) => ({
    hora: new Date(t).getHours() + 'h',
    aqi: hourly.us_aqi?.[last48Start + i] ?? 0,
  }));

  const currentValues = {};
  for (const key of Object.keys(POLLUTANT_LABELS)) {
    currentValues[key] = hourly[key]?.[currentIdx] ?? 0;
  }

  const currentAqi = hourly.us_aqi?.[currentIdx] ?? 0;
  const aqiInfo = getAqiInfo(currentAqi);

  return (
    <div className="p-4 overflow-y-auto scrollbar-thin h-full">
      <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Módulo Calidad del Aire</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="widget-card">
          <h4 className="text-xs text-slate-400 mb-2 uppercase">Contaminantes vs Límite OMS</h4>
          <div className="space-y-2">
            {Object.entries(POLLUTANT_LABELS).map(([key, label]) => {
              const val = currentValues[key];
              const limit = OMS_LIMITS[key];
              const pct = Math.min((val / limit) * 100, 150);
              const isOver = val > limit;
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-slate-300">{label}</span>
                    <span className={`font-mono ${isOver ? 'text-red-400' : 'text-slate-400'}`}>
                      {val.toFixed(1)} / {limit} µg/m³
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        backgroundColor: isOver ? '#EF4444' : pct > 70 ? '#F59E0B' : '#10B981',
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="widget-card">
          <h4 className="text-xs text-slate-400 mb-2 uppercase">AQI Últimas 48 Horas</h4>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <XAxis dataKey="hora" tick={{ fontSize: 9, fill: '#94a3b8' }} interval={7} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} width={30} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, fontSize: 12 }} />
                <Line type="monotone" dataKey="aqi" stroke={aqiInfo.color} strokeWidth={2} dot={false} name="AQI (US)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {currentAqi > 100 && (
        <div className="mt-4 p-3 rounded bg-orange-900/30 border border-orange-700 text-sm text-orange-200">
          ⚠ <strong>Recomendación:</strong> {aqiInfo.advice}
        </div>
      )}

      <div className="mt-4 widget-card text-xs text-slate-400">
        <p><strong className="text-slate-300">Contexto:</strong> Los episodios críticos de calidad del aire en Medellín ocurren típicamente entre febrero-abril y octubre-noviembre, relacionados con inversiones térmicas en el Valle de Aburrá.</p>
      </div>
    </div>
  );
}

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';
import { formatDate, formatPrecip, formatDischarge, formatNumber } from '../../utils/formatters';
import { RIVER_THRESHOLDS } from '../../utils/constants';

export default function InundacionPanel({ weatherData, floodData, puntosCriticos, selectedComuna }) {
  const hasPrecipData = weatherData?.daily;
  const hasFloodData = floodData?.daily;

  const precipData = hasPrecipData
    ? weatherData.daily.time.map((t, i) => ({
        fecha: formatDate(t),
        lluvia: weatherData.daily.precipitation_sum?.[i] ?? 0,
        probMax: weatherData.daily.precipitation_probability_max?.[i] ?? 0,
      }))
    : [];

  const floodChartData = hasFloodData
    ? floodData.daily.time.slice(0, 14).map((t, i) => ({
        fecha: formatDate(t),
        descarga: floodData.daily.river_discharge?.[i] ?? 0,
        media: floodData.daily.river_discharge_mean?.[i] ?? 0,
        max: floodData.daily.river_discharge_max?.[i] ?? 0,
      }))
    : [];

  const filteredPuntos = puntosCriticos || [];

  return (
    <div className="p-4 overflow-y-auto scrollbar-thin h-full">
      <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Módulo Inundaciones</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="widget-card">
          <h4 className="text-xs text-slate-400 mb-2 uppercase">Precipitación Diaria (7 días)</h4>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={precipData}>
                <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} width={30} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, fontSize: 12 }} />
                <Bar dataKey="lluvia" fill="#3B82F6" name="Lluvia (mm)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="widget-card">
          <h4 className="text-xs text-slate-400 mb-2 uppercase">Descarga del Río (14 días)</h4>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={floodChartData}>
                <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} width={35} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, fontSize: 12 }} />
                <ReferenceLine y={RIVER_THRESHOLDS.precaucion} stroke="#F59E0B" strokeDasharray="3 3" />
                <ReferenceLine y={RIVER_THRESHOLDS.alerta} stroke="#EF4444" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="descarga" stroke="#3B82F6" strokeWidth={2} dot={false} name="Descarga (m³/s)" />
                <Line type="monotone" dataKey="media" stroke="#64748B" strokeWidth={1} dot={false} strokeDasharray="4 4" name="Media" />
                <Line type="monotone" dataKey="max" stroke="#EF4444" strokeWidth={1} dot={false} strokeDasharray="2 2" name="Máxima" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 widget-card">
        <h4 className="text-xs text-slate-400 mb-2 uppercase">Puntos Críticos de Deslizamiento (DAGRD)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto scrollbar-thin">
          {filteredPuntos.map((p, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-slate-800 rounded text-xs">
              <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${p.nivelRiesgo === 'alto' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
              <div>
                <p className="text-slate-200 font-medium">{p.nombre}</p>
                <p className="text-slate-400">{p.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

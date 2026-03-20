import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { RIVER_THRESHOLDS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export default function RiverDischarge({ data, loading }) {
  if (loading || !data?.daily) {
    return (
      <div className="widget-card animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
        <div className="h-24 bg-slate-700 rounded"></div>
      </div>
    );
  }

  const daily = data.daily;
  const chartData = daily.time.slice(0, 14).map((t, i) => ({
    date: formatDate(t),
    descarga: daily.river_discharge?.[i] ?? 0,
    media: daily.river_discharge_mean?.[i] ?? 0,
  }));

  return (
    <div className="widget-card">
      <span className="text-xs text-slate-400 uppercase tracking-wide">Río Medellín — Descarga</span>
      <div className="h-28 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} width={35} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <ReferenceLine y={RIVER_THRESHOLDS.precaucion} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Precaución', fill: '#F59E0B', fontSize: 9 }} />
            <ReferenceLine y={RIVER_THRESHOLDS.alerta} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Alerta', fill: '#EF4444', fontSize: 9 }} />
            <Line type="monotone" dataKey="descarga" stroke="#3B82F6" strokeWidth={2} dot={false} name="Descarga (m³/s)" />
            <Line type="monotone" dataKey="media" stroke="#64748B" strokeWidth={1} dot={false} strokeDasharray="4 4" name="Media" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

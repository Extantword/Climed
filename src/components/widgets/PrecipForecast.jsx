import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PrecipForecast({ data, loading }) {
  if (loading || !data?.hourly) {
    return (
      <div className="widget-card animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-32 mb-2"></div>
        <div className="h-20 bg-slate-700 rounded"></div>
      </div>
    );
  }

  const hourly = data.hourly;
  const now = new Date();
  const startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
  const slice = hourly.time.slice(startIdx, startIdx + 48);

  const chartData = slice.map((t, i) => ({
    hora: new Date(t).getHours() + 'h',
    lluvia: hourly.precipitation?.[startIdx + i] ?? 0,
    prob: hourly.precipitation_probability?.[startIdx + i] ?? 0,
  }));

  return (
    <div className="widget-card">
      <span className="text-xs text-slate-400 uppercase tracking-wide">Pronóstico de Lluvia 48h</span>
      <div className="h-24 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="hora" tick={{ fontSize: 8, fill: '#94a3b8' }} interval={5} />
            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} width={25} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, fontSize: 12 }}
              formatter={(v, name) => [name === 'lluvia' ? `${v} mm` : `${v}%`, name === 'lluvia' ? 'Lluvia' : 'Probabilidad']}
            />
            <Bar dataKey="lluvia" fill="#3B82F6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

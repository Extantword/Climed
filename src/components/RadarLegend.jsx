const LEVELS = [
  { color: '#C8F0C8', label: 'Ligera' },
  { color: '#00D000', label: 'Moderada' },
  { color: '#009000', label: 'Algo fuerte' },
  { color: '#FFFF00', label: 'Fuerte' },
  { color: '#FF6600', label: 'Muy fuerte' },
  { color: '#FF0000', label: 'Intensa' },
  { color: '#CC00CC', label: 'Extrema' },
];

export default function RadarLegend() {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[1000] bg-white/90 backdrop-blur rounded-xl shadow-lg px-3 py-3">
      <p className="text-[10px] font-semibold text-slate-600 mb-2 text-center">Intensidad</p>
      <div className="flex flex-col gap-1.5">
        {LEVELS.map((l, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-4 h-3 rounded-sm flex-shrink-0"
              style={{ background: l.color, border: '1px solid rgba(0,0,0,0.1)' }}
            />
            <span className="text-[9px] text-slate-500 leading-tight whitespace-nowrap">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

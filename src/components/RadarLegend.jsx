const LEVELS = [
  { color: '#C8F0C8', label: 'Ligera' },
  { color: '#00D000', label: 'Moderada' },
  { color: '#009000', label: '' },
  { color: '#FFFF00', label: 'Fuerte' },
  { color: '#FF6600', label: '' },
  { color: '#FF0000', label: 'Intensa' },
  { color: '#CC00CC', label: 'Extrema' },
];

export default function RadarLegend() {
  return (
    <div className="absolute bottom-6 right-4 z-[1000] bg-white/90 backdrop-blur rounded-xl shadow-lg px-3 py-2">
      <p className="text-xs font-semibold text-slate-600 mb-1.5">Intensidad</p>
      <div className="flex items-center gap-1">
        {LEVELS.map((l, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div
              className="w-5 h-3 rounded-sm"
              style={{ background: l.color, border: '1px solid rgba(0,0,0,0.1)' }}
            />
            {l.label && (
              <span className="text-[9px] text-slate-500 leading-tight">{l.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

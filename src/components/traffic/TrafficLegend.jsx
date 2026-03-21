const LEGEND = [
  { color: '#22C55E', label: 'Fluido', sublabel: '>50 km/h' },
  { color: '#EAB308', label: 'Lento', sublabel: '25–50 km/h' },
  { color: '#F97316', label: 'Congestionado', sublabel: '10–25 km/h' },
  { color: '#EF4444', label: 'Muy congestionado', sublabel: '<10 km/h' },
];

export default function TrafficLegend() {
  return (
    <div className="absolute bottom-24 right-4 z-[1000] bg-slate-900/95 backdrop-blur rounded-xl shadow-lg px-3 py-2.5 border border-slate-700">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Velocidad</p>
      <div className="flex flex-col gap-1.5">
        {LEGEND.map(({ color, label, sublabel }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-6 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <div>
              <p className="text-xs text-slate-200 leading-none">{label}</p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">{sublabel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

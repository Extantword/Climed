const MODULES = [
  { id: 'inundaciones', label: 'Inundaciones', icon: '🌊' },
  { id: 'aire', label: 'Calidad del Aire', icon: '💨' },
  { id: 'siniestros', label: 'Siniestralidad Vial', icon: '🚗' },
];

export default function Sidebar({ activeModule, onModuleChange }) {
  return (
    <aside className="bg-slate-900 border-r border-slate-700 flex flex-col py-2 w-12 md:w-44 flex-shrink-0">
      {MODULES.map((m) => (
        <button
          key={m.id}
          onClick={() => onModuleChange(m.id)}
          className={`flex items-center gap-2 px-3 py-3 text-left transition-colors ${
            activeModule === m.id
              ? 'bg-slate-800 text-white border-l-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-2 border-transparent'
          }`}
        >
          <span className="text-lg">{m.icon}</span>
          <span className="text-sm hidden md:inline">{m.label}</span>
        </button>
      ))}
    </aside>
  );
}

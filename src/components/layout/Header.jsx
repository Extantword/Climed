function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function Header({ frameTime, isNowcast, loading, onRefresh, onHelp, onFeedback }) {
  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌧️</span>
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Radar de Lluvia — Medellín</h1>
          <p className="text-xs text-slate-500">Precipitación en tiempo real</p>
        </div>
        <button
          onClick={onHelp}
          className="ml-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
          title="¿Cómo funciona?"
        >
          ¿Cómo funciona?
        </button>
        <button
          onClick={onFeedback}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
          title="Evalúa el proyecto"
        >
          Evalúa el proyecto!
        </button>
      </div>

      <div className="flex items-center gap-3">
        {loading ? (
          <span className="text-xs text-slate-400 animate-pulse">Cargando radar…</span>
        ) : frameTime ? (
          <div className="text-right">
            <p className="text-sm font-mono font-semibold text-slate-800">{formatTime(frameTime)}</p>
            <p className={`text-xs ${isNowcast ? 'text-blue-500 font-semibold' : 'text-slate-400'}`}>
              {isNowcast ? 'pronóstico' : 'radar observado'}
            </p>
          </div>
        ) : null}
        <button
          onClick={onRefresh}
          className="text-slate-400 hover:text-slate-800 text-base px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          title="Actualizar"
        >
          ↻
        </button>
      </div>
    </header>
  );
}

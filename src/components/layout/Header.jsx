import { formatTime } from '../../utils/formatters';

export default function Header({ comunas, selectedComuna, onComunaChange, lastUpdate, onRefresh }) {
  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌧️</span>
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">Alerta Lluvia Medellín</h1>
          <p className="text-xs text-slate-500">Riesgo de inundación en tiempo real</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={selectedComuna}
          onChange={(e) => onComunaChange(Number(e.target.value))}
          className="bg-white text-slate-800 text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
        >
          <option value={0}>Toda la ciudad</option>
          {comunas.map((c) => (
            <option key={c.numero} value={c.numero}>{c.numero}-{c.nombre}</option>
          ))}
        </select>
        <span className="text-xs text-slate-400 hidden sm:inline">
          {formatTime(lastUpdate)}
        </span>
        <button
          onClick={onRefresh}
          className="text-slate-500 hover:text-slate-900 text-sm px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          title="Actualizar datos"
        >
          ↻
        </button>
      </div>
    </header>
  );
}

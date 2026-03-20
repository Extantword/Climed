import { formatTime } from '../../utils/formatters';

export default function Header({ comunas, selectedComuna, onComunaChange, lastUpdate, onRefresh }) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-4 py-2 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">MedCity Dashboard</h1>
          <p className="text-xs text-slate-400">Medellín — Datos en Tiempo Real</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={selectedComuna}
          onChange={(e) => onComunaChange(Number(e.target.value))}
          className="bg-slate-800 text-slate-200 text-sm border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
        >
          <option value={0}>Toda la ciudad</option>
          {comunas.map((c) => (
            <option key={c.numero} value={c.numero}>{c.numero}-{c.nombre}</option>
          ))}
        </select>
        <span className="text-xs text-slate-500">
          Actualizado: {formatTime(lastUpdate)}
        </span>
        <button
          onClick={onRefresh}
          className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-slate-700 transition-colors"
          title="Actualizar datos"
        >
          ↻
        </button>
      </div>
    </header>
  );
}

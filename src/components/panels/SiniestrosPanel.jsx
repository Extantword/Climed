import { useState, useMemo } from 'react';
import { formatNumber } from '../../utils/formatters';

const ACTOR_FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'motociclista', label: 'Motociclistas' },
  { id: 'peaton', label: 'Peatones' },
  { id: 'ciclista', label: 'Ciclistas' },
  { id: 'conductor', label: 'Conductores' },
];

const YEAR_FILTERS = [
  { id: 'all', label: 'Todo el histórico' },
  { id: '1', label: 'Último año' },
  { id: '3', label: 'Últimos 3 años' },
];

export default function SiniestrosPanel({ siniestrosData, corredores, siniestrosPorComuna }) {
  const [actorFilter, setActorFilter] = useState('todos');
  const [yearFilter, setYearFilter] = useState('all');

  const filteredData = useMemo(() => {
    if (!siniestrosData) return [];
    let filtered = siniestrosData;
    if (actorFilter !== 'todos') {
      filtered = filtered.filter((s) => s.actor === actorFilter);
    }
    if (yearFilter !== 'all') {
      const years = parseInt(yearFilter);
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - years);
      filtered = filtered.filter((s) => new Date(s.fecha) >= cutoff);
    }
    return filtered;
  }, [siniestrosData, actorFilter, yearFilter]);

  const topCorredores = corredores ? [...corredores].sort((a, b) => b.siniestros - a.siniestros).slice(0, 5) : [];

  return (
    <div className="p-4 overflow-y-auto scrollbar-thin h-full">
      <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Módulo Siniestralidad Vial</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {ACTOR_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActorFilter(f.id)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              actorFilter === f.id
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-400'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="border-l border-slate-600 mx-1"></span>
        {YEAR_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setYearFilter(f.id)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              yearFilter === f.id
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="widget-card text-center">
          <p className="text-3xl font-bold text-red-400 font-mono">{formatNumber(filteredData.length)}</p>
          <p className="text-xs text-slate-400 mt-1">Siniestros filtrados</p>
        </div>

        <div className="widget-card col-span-1 md:col-span-2">
          <h4 className="text-xs text-slate-400 mb-2 uppercase">Top 5 Corredores Más Peligrosos</h4>
          <div className="space-y-1.5">
            {topCorredores.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-mono w-4">{i + 1}.</span>
                <span className="text-slate-200 flex-1">{c.nombre}</span>
                <span className="text-red-400 font-mono">{formatNumber(c.siniestros)}</span>
                <span className="text-slate-500">siniestros</span>
                <span className="text-red-300 font-mono">{c.muertos}</span>
                <span className="text-slate-500">muertos</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {actorFilter !== 'todos' && (
        <div className="mt-4 widget-card">
          <h4 className="text-xs text-slate-400 mb-2 uppercase">Perfil de Riesgo: {ACTOR_FILTERS.find((f) => f.id === actorFilter)?.label}</h4>
          <div className="text-xs text-slate-300 space-y-1">
            {actorFilter === 'motociclista' && (
              <>
                <p>• Principal causa: exceso de velocidad y no respetar semáforos</p>
                <p>• Horarios peligrosos: 6-8 AM y 5-7 PM (horas pico)</p>
                <p>• Zonas a evitar: Autopista Norte, Avenida Regional, Autopista Sur</p>
              </>
            )}
            {actorFilter === 'peaton' && (
              <>
                <p>• Principal causa: cruce indebido de vías y falta de señalización</p>
                <p>• Horarios peligrosos: 6-8 PM (baja visibilidad)</p>
                <p>• Zonas a evitar: Avenida 33, San Juan, Avenida El Poblado</p>
              </>
            )}
            {actorFilter === 'ciclista' && (
              <>
                <p>• Principal causa: falta de ciclorrutas y puntos ciegos de vehículos</p>
                <p>• Horarios peligrosos: 5-7 AM (baja visibilidad)</p>
                <p>• Zonas a evitar: Avenida Regional, Carrera 65, Las Palmas</p>
              </>
            )}
            {actorFilter === 'conductor' && (
              <>
                <p>• Principal causa: exceso de velocidad y conducción distraída</p>
                <p>• Horarios peligrosos: 10 PM - 2 AM (consumo de alcohol)</p>
                <p>• Zonas a evitar: Las Palmas, Vía Túnel de Occidente, Autopista Norte</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

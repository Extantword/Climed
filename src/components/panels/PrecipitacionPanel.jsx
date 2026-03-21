import { useState } from 'react';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleString('es-CO', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function precipLevel(mm) {
  if (mm <= 0) return { label: 'Sin lluvia', color: '#94a3b8' };
  if (mm < 2.5) return { label: 'Ligera', color: '#10B981' };
  if (mm < 7.5) return { label: 'Moderada', color: '#F59E0B' };
  if (mm < 15) return { label: 'Fuerte', color: '#F97316' };
  return { label: 'Intensa', color: '#EF4444' };
}

function SourceBadge({ name, error }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
        error
          ? 'bg-red-100 text-red-600'
          : 'bg-green-100 text-green-700'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-400' : 'bg-green-500'}`} />
      {name}
    </span>
  );
}

function StationRow({ station }) {
  const level = precipLevel(station.value || station.currentPrecip || 0);
  const value = station.value ?? station.currentPrecip ?? 0;

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-800 truncate">
          {station.name || station.station}
        </p>
        <p className="text-[10px] text-slate-400 truncate">
          {station.municipality || station.source}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="text-xs font-bold"
          style={{ color: level.color }}
        >
          {value.toFixed(1)} mm
        </span>
        <span
          className="text-[9px] px-1.5 py-0.5 rounded font-medium"
          style={{ background: level.color + '20', color: level.color }}
        >
          {level.label}
        </span>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'openmeteo', label: 'Open-Meteo' },
  { id: 'datosgov', label: 'datos.gov.co' },
  { id: 'ideam', label: 'IDEAM' },
];

export default function PrecipitacionPanel({ datosGov, ideam, openMeteo, loading, lastUpdate, onRefresh }) {
  const [activeTab, setActiveTab] = useState('openmeteo');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Precipitación</h2>
          <p className="text-[10px] text-slate-400">
            {lastUpdate
              ? `Actualizado ${lastUpdate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`
              : 'Cargando…'}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="text-slate-400 hover:text-slate-700 text-sm px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
          title="Actualizar datos"
        >
          ↻
        </button>
      </div>

      {/* Source status badges */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-slate-100">
        <SourceBadge name="Open-Meteo" error={openMeteo.error} />
        <SourceBadge name="datos.gov.co" error={datosGov.error} />
        <SourceBadge name="IDEAM" error={ideam.error} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-xs py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {loading ? (
          <p className="text-xs text-slate-400 animate-pulse text-center py-4">
            Cargando datos de precipitación…
          </p>
        ) : (
          <>
            {/* Open-Meteo tab */}
            {activeTab === 'openmeteo' && (
              <div>
                {openMeteo.error ? (
                  <p className="text-xs text-red-500 py-2">{openMeteo.error}</p>
                ) : openMeteo.summary.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">Sin datos disponibles</p>
                ) : (
                  <>
                    <p className="text-[10px] text-slate-400 mb-2">
                      Precipitación actual y acumulada (8 puntos en Medellín)
                    </p>
                    {openMeteo.summary.map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800 truncate">{s.name}</p>
                          <p className="text-[10px] text-slate-400">
                            24h: {s.total24h} mm · Próx 6h: {s.forecast6h} mm
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className="text-xs font-bold"
                            style={{ color: precipLevel(s.currentPrecip).color }}
                          >
                            {s.currentPrecip.toFixed(1)} mm/h
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* datos.gov.co tab */}
            {activeTab === 'datosgov' && (
              <div>
                {datosGov.error ? (
                  <p className="text-xs text-red-500 py-2">{datosGov.error}</p>
                ) : datosGov.data.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">Sin datos disponibles</p>
                ) : (
                  <>
                    <p className="text-[10px] text-slate-400 mb-2">
                      Estaciones automáticas IDEAM — Antioquia
                    </p>
                    {datosGov.data.slice(0, 15).map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800 truncate">{s.station}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {s.municipality} · {formatDate(s.date)}
                          </p>
                        </div>
                        <span
                          className="text-xs font-bold flex-shrink-0"
                          style={{ color: precipLevel(s.value).color }}
                        >
                          {s.value.toFixed(1)} {s.unit}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* IDEAM tab */}
            {activeTab === 'ideam' && (
              <div>
                {ideam.error ? (
                  <p className="text-xs text-red-500 py-2">{ideam.error}</p>
                ) : ideam.data.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">Sin datos disponibles</p>
                ) : (
                  <>
                    <p className="text-[10px] text-slate-400 mb-2">
                      Datos de precipitación IDEAM — Antioquia
                    </p>
                    {ideam.data.slice(0, 15).map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800 truncate">{s.station}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {s.municipality} · {formatDate(s.date)}
                          </p>
                        </div>
                        <span
                          className="text-xs font-bold flex-shrink-0"
                          style={{ color: precipLevel(s.value).color }}
                        >
                          {s.value.toFixed(1)} {s.unit}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/50">
        <p className="text-[9px] text-slate-400 text-center">
          Fuentes: Open-Meteo · datos.gov.co · IDEAM
        </p>
      </div>
    </div>
  );
}

import { TOMTOM_KEY } from './TrafficFlowLayer';

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDateTime(date) {
  if (!date) return '';
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const day = days[date.getDay()];
  return `${day} ${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function TrafficHeader({ currentFrame, isLive, cityScore, onGoLive, onExitLive }) {
  const pct = Math.round((cityScore?.() ?? 0) * 100);
  const congColor = pct < 32 ? '#22C55E' : pct < 55 ? '#EAB308' : pct < 75 ? '#F97316' : '#EF4444';
  const congLabel = pct < 32 ? 'Fluido' : pct < 55 ? 'Lento' : pct < 75 ? 'Congestionado' : 'Muy congestionado';

  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-700 px-4 py-2 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🚦</span>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">Tráfico — Medellín</h1>
          <p className="text-xs text-slate-400">Congestión vehicular en tiempo real</p>
        </div>

        {/* City congestion indicator */}
        <div className="hidden sm:flex items-center gap-2 ml-4 bg-slate-800 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: congColor }} />
          <span className="text-xs font-semibold" style={{ color: congColor }}>{congLabel}</span>
          <span className="text-xs text-slate-500">{pct}%</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Frame timestamp */}
        {!isLive && currentFrame && (
          <div className="text-right hidden sm:block">
            <p className="text-sm font-mono font-semibold text-slate-200">{formatDateTime(currentFrame)}</p>
            <p className="text-xs text-slate-500">reproducción histórica</p>
          </div>
        )}

        {/* Live badge */}
        {isLive && (
          <div className="flex items-center gap-1.5 bg-red-600/20 border border-red-500/40 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400">EN VIVO</span>
            {!TOMTOM_KEY && (
              <span className="text-xs text-red-300/70 ml-1">(simulado)</span>
            )}
          </div>
        )}

        {/* Live / Replay toggle */}
        {isLive ? (
          <button
            onClick={onExitLive}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors border border-slate-600"
          >
            Ver historial
          </button>
        ) : (
          <button
            onClick={onGoLive}
            className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            EN VIVO
          </button>
        )}

        {/* Nav back to rain radar */}
        <a
          href="/Climed/"
          className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-700 transition-colors"
          title="Ver radar de lluvia"
        >
          🌧️
        </a>
      </div>
    </header>
  );
}

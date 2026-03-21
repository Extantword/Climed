import { useState } from 'react';
import { scoreToColor, scoreToLabel, scoreToSpeed } from '../../hooks/useTrafficReplay';

function pad(n) {
  return String(n).padStart(2, '0');
}

/** Minimal SVG area chart for the day profile */
function DayChart({ profile, currentHour }) {
  const W = 220, H = 60, PAD = 4;
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;
  const pts = profile.map((d, i) => [
    PAD + (i / (profile.length - 1)) * innerW,
    PAD + innerH - d.score * innerH,
  ]);
  const polyline = pts.map(p => p.join(',')).join(' ');
  const area = `M${pts[0][0]},${pts[0][1]} ` +
    pts.slice(1).map(p => `L${p[0]},${p[1]}`).join(' ') +
    ` L${pts[pts.length - 1][0]},${H - PAD} L${pts[0][0]},${H - PAD} Z`;

  const curX = pts[currentHour]?.[0];
  const curY = pts[currentHour]?.[1];

  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F97316" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#tg)" />
      <polyline points={polyline} fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Hour ticks */}
      {[0, 6, 12, 18, 23].map(h => {
        const x = PAD + (h / (profile.length - 1)) * innerW;
        return (
          <text key={h} x={x} y={H + 2} fontSize="8" fill="#475569" textAnchor="middle" dominantBaseline="hanging">
            {pad(h)}h
          </text>
        );
      })}
      {/* Current hour marker */}
      {curX != null && (
        <circle cx={curX} cy={curY} r={4} fill="#F97316" stroke="#fff" strokeWidth={1.5} />
      )}
    </svg>
  );
}

export default function StatsPanel({ corridorScores, cityScore, dayProfile, currentFrame, isLive }) {
  const [open, setOpen] = useState(true);

  const scores = corridorScores();
  const city = cityScore();
  const profile = dayProfile();
  const currentHour = currentFrame?.getHours() ?? 0;

  // Top 3 most congested
  const sorted = [...scores].sort((a, b) => b.score - a.score).slice(0, 5);

  const cityColor = scoreToColor(city);
  const cityLabel = scoreToLabel(city);
  const citySpeed = scoreToSpeed(city);

  return (
    <div className="absolute top-16 right-4 z-[1000] flex flex-col items-end gap-2">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="bg-slate-900/95 backdrop-blur border border-slate-700 text-slate-300 hover:text-white rounded-xl px-3 py-2 text-xs font-semibold shadow-lg transition-colors"
      >
        {open ? 'Ocultar estadísticas ›' : '‹ Estadísticas'}
      </button>

      {open && (
        <div className="bg-slate-900/95 backdrop-blur border border-slate-700 rounded-xl shadow-xl p-4 w-64 flex flex-col gap-4">

          {/* City overview */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Estado general</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                style={{ backgroundColor: cityColor + '33', border: `2px solid ${cityColor}` }}
              >
                <span style={{ color: cityColor }}>{Math.round(city * 100)}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{cityLabel}</p>
                <p className="text-xs text-slate-400">~{citySpeed} km/h promedio</p>
                {isLive ? (
                  <p className="text-xs text-red-400 font-semibold mt-0.5">EN VIVO</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentFrame ? `${pad(currentFrame.getHours())}:00 hs` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Day congestion chart */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Perfil del día</p>
            <DayChart profile={profile} currentHour={currentHour} />
          </div>

          {/* Most congested corridors */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Corredores críticos</p>
            <div className="flex flex-col gap-1.5">
              {sorted.map(({ id, name, score }) => (
                <div key={id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 truncate">{name}</p>
                    <div className="w-full bg-slate-700 rounded-full h-1 mt-0.5">
                      <div
                        className="h-1 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(score * 100)}%`, backgroundColor: scoreToColor(score) }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-mono flex-shrink-0" style={{ color: scoreToColor(score) }}>
                    {scoreToSpeed(score)} km/h
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Attribution */}
          <p className="text-xs text-slate-600 text-center">
            Patrones basados en datos históricos de movilidad
          </p>
        </div>
      )}
    </div>
  );
}

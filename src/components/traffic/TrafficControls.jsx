function pad(n) {
  return String(n).padStart(2, '0');
}

function formatShort(date) {
  if (!date) return '--';
  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  return `${days[date.getDay()]} ${pad(date.getHours())}h`;
}

function formatFull(date) {
  if (!date) return '--';
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return `${days[date.getDay()]} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}  ${pad(date.getHours())}:00`;
}

// Show tick labels at day boundaries in the slider
function DayTicks({ frames }) {
  if (frames.length === 0) return null;
  const ticks = [];
  const days = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  for (let i = 0; i < frames.length; i++) {
    if (frames[i].getHours() === 0) {
      const pct = (i / (frames.length - 1)) * 100;
      ticks.push({ pct, label: days[frames[i].getDay()] });
    }
  }
  return (
    <div className="relative w-full h-4 mt-0.5">
      {ticks.map(({ pct, label }) => (
        <span
          key={pct}
          className="absolute text-xs text-slate-500 -translate-x-1/2 select-none"
          style={{ left: `${pct}%` }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export default function TrafficControls({
  frames,
  currentIndex,
  setCurrentIndex,
  currentFrame,
  playing,
  setPlaying,
  isLive,
  goLive,
}) {
  if (frames.length === 0) return null;

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/95 backdrop-blur rounded-2xl shadow-xl px-5 py-3 flex items-center gap-4 border border-slate-700"
      style={{ minWidth: '340px', maxWidth: '90vw' }}
    >
      {/* Play / Pause */}
      <button
        onClick={() => {
          if (isLive) return;
          setPlaying(p => !p);
        }}
        disabled={isLive}
        className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white flex items-center justify-center text-base flex-shrink-0 transition-colors"
        title={playing ? 'Pausar' : 'Reproducir semana'}
      >
        {playing ? '⏸' : '▶'}
      </button>

      {/* Timeline */}
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={currentIndex}
          disabled={isLive}
          onChange={e => setCurrentIndex(Number(e.target.value))}
          className="w-full cursor-pointer h-2 disabled:opacity-40"
          style={{ accentColor: '#F97316' }}
        />
        <DayTicks frames={frames} />
      </div>

      {/* Current time display */}
      <div className="text-right flex-shrink-0">
        <p className="text-slate-100 font-mono font-bold text-sm leading-tight">
          {isLive ? 'AHORA' : formatShort(currentFrame)}
        </p>
        <p className="text-slate-500 text-xs">
          {isLive ? 'en vivo' : formatFull(currentFrame)}
        </p>
      </div>

      {/* Live jump button */}
      {!isLive && (
        <button
          onClick={goLive}
          className="text-xs font-bold text-red-400 hover:text-red-300 flex-shrink-0 border border-red-700 hover:border-red-500 rounded-lg px-2 py-1 transition-colors"
        >
          ⬛ LIVE
        </button>
      )}
    </div>
  );
}

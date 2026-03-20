function pad(n) {
  return String(n).padStart(2, '0');
}

function formatFrameTime(date) {
  if (!date) return '--:--';
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function RadarControls({
  frames,
  pastCount,
  currentIndex,
  setCurrentIndex,
  frameTime,
  isNowcast,
  playing,
  setPlaying,
}) {
  if (frames.length === 0) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 min-w-72">
      {/* Play/Pause */}
      <button
        onClick={() => setPlaying((p) => !p)}
        className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-base flex-shrink-0 transition-colors"
        title={playing ? 'Pausar' : 'Reproducir'}
      >
        {playing ? '⏸' : '▶'}
      </button>

      {/* Timeline */}
      <div className="flex-1 flex flex-col gap-1">
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={currentIndex}
          onChange={(e) => {
            setPlaying(false);
            setCurrentIndex(Number(e.target.value));
          }}
          className="w-full accent-blue-600 cursor-pointer h-2"
        />
        {/* Tick labels */}
        <div className="flex justify-between text-xs text-slate-400 px-0.5 select-none">
          <span>–90min</span>
          <span className="text-slate-500">ahora</span>
          <span className="text-blue-500">+1h</span>
        </div>
      </div>

      {/* Current time + label */}
      <div className="text-right flex-shrink-0">
        <p className="text-slate-900 font-mono font-bold text-sm leading-tight">
          {formatFrameTime(frameTime)}
        </p>
        {isNowcast ? (
          <p className="text-blue-500 text-xs font-semibold">pronóstico</p>
        ) : (
          <p className="text-slate-400 text-xs">radar</p>
        )}
      </div>
    </div>
  );
}

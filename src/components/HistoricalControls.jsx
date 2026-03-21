import { VELOCITY_PRESETS } from '../hooks/useHistoricalReplay';

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(date) {
  if (!date) return '--:--';
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('es-CO', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function HistoricalControls({
  timeSlots,
  pastCount,
  currentIndex,
  setCurrentIndex,
  currentTime,
  isForecasting,
  playing,
  setPlaying,
  velocityIdx,
  setVelocityIdx,
  velocity,
  onClose,
}) {
  if (timeSlots.length === 0) return null;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 backdrop-blur rounded-2xl shadow-lg px-4 py-3 flex flex-col gap-2 min-w-[22rem] max-w-lg">
      {/* Top row: close, play, timeline, time display */}
      <div className="flex items-center gap-3">
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center text-xs flex-shrink-0 transition-colors"
          title="Cerrar replay"
        >
          ✕
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-base flex-shrink-0 transition-colors"
          title={playing ? 'Pausar' : 'Reproducir'}
        >
          {playing ? '⏸' : '▶'}
        </button>

        {/* Timeline */}
        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={timeSlots.length - 1}
            value={currentIndex}
            onChange={(e) => {
              setPlaying(false);
              setCurrentIndex(Number(e.target.value));
            }}
            className="w-full accent-emerald-500 cursor-pointer h-2"
          />
          <div className="flex justify-between text-[10px] text-slate-400 px-0.5 select-none">
            <span>–7 días</span>
            <span className="text-slate-300">ahora</span>
            <span className="text-emerald-400">+48h</span>
          </div>
        </div>

        {/* Current time + label */}
        <div className="text-right flex-shrink-0">
          <p className="text-white font-mono font-bold text-sm leading-tight">
            {formatTime(currentTime)}
          </p>
          <p className="text-slate-400 text-[10px]">{formatDate(currentTime)}</p>
          {isForecasting ? (
            <p className="text-emerald-400 text-[10px] font-semibold">pronóstico</p>
          ) : (
            <p className="text-slate-400 text-[10px]">datos reales</p>
          )}
        </div>
      </div>

      {/* Bottom row: velocity controls */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-medium">Velocidad:</span>
        <div className="flex items-center gap-1">
          {VELOCITY_PRESETS.map((preset, i) => (
            <button
              key={preset.label}
              onClick={() => setVelocityIdx(i)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                velocityIdx === i
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {currentIndex + 1}/{timeSlots.length}
        </span>
      </div>
    </div>
  );
}

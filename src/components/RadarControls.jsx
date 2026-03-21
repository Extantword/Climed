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

export default function RadarControls({
  // Radar props (simple mode)
  frames,
  pastCount,
  currentIndex,
  setCurrentIndex,
  frameTime,
  isNowcast,
  playing,
  setPlaying,
  // Expanded (replay) props
  expanded,
  replay,
}) {
  if (!expanded && frames.length === 0) return null;

  // When expanded, use replay data; otherwise use radar data
  const sliderMax = expanded ? replay.timeSlots.length - 1 : frames.length - 1;
  const sliderValue = expanded ? replay.currentIndex : currentIndex;
  const onSliderChange = (val) => {
    if (expanded) {
      replay.setPlaying(false);
      replay.setCurrentIndex(val);
    } else {
      setPlaying(false);
      setCurrentIndex(val);
    }
  };
  const isPlaying = expanded ? replay.playing : playing;
  const togglePlay = () => {
    if (expanded) replay.setPlaying((p) => !p);
    else setPlaying((p) => !p);
  };
  const displayTime = expanded ? replay.currentTime : frameTime;
  const showForecast = expanded ? replay.isForecasting : isNowcast;

  return (
    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] backdrop-blur rounded-2xl shadow-lg px-4 py-3 flex flex-col gap-2 transition-all ${
      expanded
        ? 'bg-slate-900/90 min-w-[24rem] max-w-lg'
        : 'bg-white/90 min-w-72'
    }`}>
      {/* Main row: play + slider + time */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-colors text-white ${
            expanded
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Timeline */}
        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={sliderMax}
            value={sliderValue}
            onChange={(e) => onSliderChange(Number(e.target.value))}
            className={`w-full cursor-pointer h-2 ${expanded ? 'accent-emerald-500' : 'accent-blue-600'}`}
          />
          <div className={`flex justify-between text-xs px-0.5 select-none ${expanded ? 'text-[10px] text-slate-400' : 'text-slate-400'}`}>
            {expanded ? (
              <>
                <span>–7 días</span>
                <span className="text-slate-300">ahora</span>
                <span className="text-emerald-400">+48h</span>
              </>
            ) : (
              <>
                <span>–90min</span>
                <span className="text-slate-500">ahora</span>
                <span className="text-blue-500">+1h</span>
              </>
            )}
          </div>
        </div>

        {/* Time display */}
        <div className="text-right flex-shrink-0">
          <p className={`font-mono font-bold text-sm leading-tight ${expanded ? 'text-white' : 'text-slate-900'}`}>
            {formatTime(displayTime)}
          </p>
          {expanded && (
            <p className="text-slate-400 text-[10px]">{formatDate(displayTime)}</p>
          )}
          {showForecast ? (
            <p className={`text-xs font-semibold ${expanded ? 'text-emerald-400 text-[10px]' : 'text-blue-500'}`}>pronóstico</p>
          ) : (
            <p className={`text-xs ${expanded ? 'text-slate-400 text-[10px]' : 'text-slate-400'}`}>
              {expanded ? 'datos reales' : 'radar'}
            </p>
          )}
        </div>
      </div>

      {/* Velocity row — only when expanded */}
      {expanded && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-medium">Velocidad:</span>
          <div className="flex items-center gap-1">
            {VELOCITY_PRESETS.map((preset, i) => (
              <button
                key={preset.label}
                onClick={() => replay.setVelocityIdx(i)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  replay.velocityIdx === i
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {replay.currentIndex + 1}/{replay.timeSlots.length}
          </span>
        </div>
      )}
    </div>
  );
}

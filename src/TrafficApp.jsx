import TrafficMap from './components/traffic/TrafficMap';
import TrafficHeader from './components/traffic/TrafficHeader';
import TrafficControls from './components/traffic/TrafficControls';
import TrafficLegend from './components/traffic/TrafficLegend';
import StatsPanel from './components/traffic/StatsPanel';
import { useTrafficReplay } from './hooks/useTrafficReplay';
import { TOMTOM_KEY } from './components/traffic/TrafficFlowLayer';

export default function TrafficApp() {
  const traffic = useTrafficReplay();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Full-screen map */}
      <TrafficMap
        isLive={traffic.isLive}
        corridorScores={traffic.corridorScores}
      />

      {/* Top overlay: header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="pointer-events-auto">
          <TrafficHeader
            currentFrame={traffic.currentFrame}
            isLive={traffic.isLive}
            cityScore={traffic.cityScore}
            onGoLive={traffic.goLive}
            onExitLive={traffic.exitLive}
          />
        </div>
      </div>

      {/* Right overlay: stats panel */}
      <div className="pointer-events-auto">
        <StatsPanel
          corridorScores={traffic.corridorScores}
          cityScore={traffic.cityScore}
          dayProfile={traffic.dayProfile}
          currentFrame={traffic.currentFrame}
          isLive={traffic.isLive}
        />
      </div>

      {/* Bottom overlay: replay timeline */}
      <TrafficControls
        frames={traffic.frames}
        currentIndex={traffic.currentIndex}
        setCurrentIndex={traffic.setCurrentIndex}
        currentFrame={traffic.currentFrame}
        playing={traffic.playing}
        setPlaying={traffic.setPlaying}
        isLive={traffic.isLive}
        goLive={traffic.goLive}
      />

      {/* Legend */}
      <TrafficLegend />

      {/* No-API-key notice in live mode */}
      {traffic.isLive && !TOMTOM_KEY && (
        <div className="absolute bottom-24 left-4 z-[1000] bg-slate-900/95 backdrop-blur border border-amber-700/50 rounded-xl px-3 py-2 max-w-xs">
          <p className="text-xs text-amber-400 font-semibold">Modo simulado</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Para tráfico en tiempo real real, agrega{' '}
            <code className="text-amber-300">VITE_TOMTOM_KEY</code> en tu .env
          </p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import Header from './components/layout/Header';
import MainMap from './components/map/MainMap';
import RadarControls from './components/RadarControls';
import RadarLegend from './components/RadarLegend';
import HelpModal from './components/HelpModal';
import FeedbackModal from './components/FeedbackModal';
import { useRainRadar } from './hooks/useRainRadar';
import { useHistoricalReplay } from './hooks/useHistoricalReplay';
export default function App() {
  const radar = useRainRadar();
  const replay = useHistoricalReplay();
  const [replayActive, setReplayActive] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen map */}
      <MainMap
        host={radar.host}
        currentFrame={radar.currentFrame}
        replayActive={true}
        replayPoints={replayActive ? replay.currentPoints : replay.nowPoints}
      />

      {/* Top overlay: header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="pointer-events-auto">
          <Header
            frameTime={radar.frameTime}
            isNowcast={radar.isNowcast}
            loading={radar.loading}
            onRefresh={radar.refetch}
            onHelp={() => setHelpOpen(true)}
            onFeedback={() => setFeedbackOpen(true)}
          />
        </div>
      </div>

      {/* Right-side button */}
      <div className="absolute top-16 right-4 z-[1000]">
        <button
          onClick={() => {
            setReplayActive((r) => {
              if (!r) replay.setPlaying(true);
              else replay.setPlaying(false);
              return !r;
            });
          }}
          className={`px-3 py-2 rounded-lg shadow-lg text-sm font-semibold transition-all ${
            replayActive
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-white/90 hover:bg-white backdrop-blur text-slate-700 border border-slate-200'
          }`}
          title={replayActive ? 'Desactivar replay' : 'Ver precipitación histórica'}
        >
          {replayActive ? '⏱️ Replay ON' : '⏱️ Replay histórico'}
        </button>
      </div>

      {/* Bottom controls — only shown when replay is active */}
      {replayActive && (
        <RadarControls
          frames={radar.frames}
          pastCount={radar.pastCount}
          currentIndex={radar.currentIndex}
          setCurrentIndex={radar.setCurrentIndex}
          frameTime={radar.frameTime}
          isNowcast={radar.isNowcast}
          playing={radar.playing}
          setPlaying={radar.setPlaying}
          expanded={true}
          replay={replay}
        />
      )}

      {/* Legend */}
      <RadarLegend />

      {/* Help modal */}
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}

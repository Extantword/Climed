import { useState } from 'react';
import Header from './components/layout/Header';
import MainMap from './components/map/MainMap';
import RadarControls from './components/RadarControls';
import RadarLegend from './components/RadarLegend';
import HistoricalControls from './components/HistoricalControls';
import PrecipitacionPanel from './components/panels/PrecipitacionPanel';
import HelpModal from './components/HelpModal';
import { useRainRadar } from './hooks/useRainRadar';
import { usePrecipitationData } from './hooks/usePrecipitationData';
import { useHistoricalReplay } from './hooks/useHistoricalReplay';

export default function App() {
  const radar = useRainRadar();
  const precip = usePrecipitationData();
  const replay = useHistoricalReplay();
  const [replayActive, setReplayActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen map */}
      <MainMap
        host={radar.host}
        currentFrame={radar.currentFrame}
        replayActive={replayActive}
        replayPoints={replayActive ? replay.currentPoints : []}
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
          />
        </div>
      </div>

      {/* Right-side buttons */}
      <div className="absolute top-16 right-4 z-[1000] flex flex-col gap-2">
        {/* Precipitation panel toggle */}
        <button
          onClick={() => setPanelOpen((p) => !p)}
          className={`px-3 py-2 rounded-lg shadow-lg text-sm font-semibold transition-all ${
            panelOpen
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-white/90 hover:bg-white backdrop-blur text-slate-700 border border-slate-200'
          }`}
          title={panelOpen ? 'Cerrar panel' : 'Ver datos de precipitación'}
        >
          {panelOpen ? '💧 Precipitación ✕' : '💧 Precipitación'}
        </button>

        {/* Historical replay toggle */}
        <button
          onClick={() => {
            setReplayActive((r) => !r);
            if (!replayActive) replay.setPlaying(true);
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

      {/* Replay info banner */}
      {replayActive && (
        <div className="absolute top-36 right-4 z-[1000] bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 shadow-sm max-w-52">
          <p className="text-xs text-emerald-700">
            Datos reales de Open-Meteo — últimos 7 días + pronóstico 48h
          </p>
        </div>
      )}

      {/* Precipitation side panel */}
      {panelOpen && (
        <div className="absolute top-32 right-4 z-[1000] w-80 max-h-[calc(100vh-10rem)] bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
          <PrecipitacionPanel
            datosGov={precip.datosGov}
            ideam={precip.ideam}
            openMeteo={precip.openMeteo}
            loading={precip.loading}
            lastUpdate={precip.lastUpdate}
            onRefresh={precip.refetch}
          />
        </div>
      )}

      {/* Historical replay controls — shown when replay is active */}
      {replayActive && (
        <HistoricalControls
          timeSlots={replay.timeSlots}
          pastCount={replay.pastCount}
          currentIndex={replay.currentIndex}
          setCurrentIndex={replay.setCurrentIndex}
          currentTime={replay.currentTime}
          isForecasting={replay.isForecasting}
          playing={replay.playing}
          setPlaying={replay.setPlaying}
          velocityIdx={replay.velocityIdx}
          setVelocityIdx={replay.setVelocityIdx}
          velocity={replay.velocity}
          onClose={() => {
            setReplayActive(false);
            replay.setPlaying(false);
          }}
        />
      )}

      {/* Bottom overlay: radar animation controls */}
      <RadarControls
        frames={radar.frames}
        pastCount={radar.pastCount}
        currentIndex={radar.currentIndex}
        setCurrentIndex={radar.setCurrentIndex}
        frameTime={radar.frameTime}
        isNowcast={radar.isNowcast}
        playing={radar.playing}
        setPlaying={radar.setPlaying}
      />

      {/* Legend */}
      <RadarLegend />

      {/* Help modal */}
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}

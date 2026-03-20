import Header from './components/layout/Header';
import MainMap from './components/map/MainMap';
import RadarControls from './components/RadarControls';
import RadarLegend from './components/RadarLegend';
import { useRainRadar } from './hooks/useRainRadar';

export default function App() {
  const radar = useRainRadar();

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen map */}
      <MainMap host={radar.host} currentFrame={radar.currentFrame} />

      {/* Top overlay: header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="pointer-events-auto">
          <Header
            frameTime={radar.frameTime}
            isNowcast={radar.isNowcast}
            loading={radar.loading}
            onRefresh={radar.refetch}
          />
        </div>
      </div>

      {/* Bottom overlay: animation controls */}
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
    </div>
  );
}

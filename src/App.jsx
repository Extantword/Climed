import { useState, useCallback } from 'react';
import Header from './components/layout/Header';
import MainMap from './components/map/MainMap';
import AlertBanner from './components/widgets/AlertBanner';
import { useWeatherData } from './hooks/useWeatherData';
import { useFloodData } from './hooks/useFloodData';
import { useStaticData } from './hooks/useStaticData';
import { COMUNAS } from './utils/constants';

export default function App() {
  const [selectedComuna, setSelectedComuna] = useState(0);

  const weather = useWeatherData();
  const flood = useFloodData();

  const comunasGeo = useStaticData('comunas-riesgo.geojson');
  const quebradas = useStaticData('quebradas.geojson');
  const puntosCriticos = useStaticData('puntos-criticos-deslizamiento.json');

  const lastUpdate = weather.lastUpdate || flood.lastUpdate;

  const handleRefresh = useCallback(() => {
    weather.refetch();
    flood.refetch();
  }, [weather, flood]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen map */}
      <MainMap
        comunasData={comunasGeo.data}
        quebradasData={quebradas.data}
        puntosCriticos={puntosCriticos.data}
        selectedComuna={selectedComuna}
      />

      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="pointer-events-auto">
          <Header
            comunas={COMUNAS}
            selectedComuna={selectedComuna}
            onComunaChange={setSelectedComuna}
            lastUpdate={lastUpdate}
            onRefresh={handleRefresh}
          />
          <AlertBanner weatherData={weather.data} floodData={flood.data} />
        </div>
      </div>
    </div>
  );
}

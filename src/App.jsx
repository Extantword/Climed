import { useState, useCallback } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import MainMap from './components/map/MainMap';
import WeatherNow from './components/widgets/WeatherNow';
import RiverDischarge from './components/widgets/RiverDischarge';
import AirQualityGauge from './components/widgets/AirQualityGauge';
import PrecipForecast from './components/widgets/PrecipForecast';
import AlertBanner from './components/widgets/AlertBanner';
import RiskScore from './components/widgets/RiskScore';
import InundacionPanel from './components/panels/InundacionPanel';
import AirePanel from './components/panels/AirePanel';
import SiniestrosPanel from './components/panels/SiniestrosPanel';
import { useWeatherData } from './hooks/useWeatherData';
import { useFloodData } from './hooks/useFloodData';
import { useAirQuality } from './hooks/useAirQuality';
import { useStaticData } from './hooks/useStaticData';
import { COMUNAS } from './utils/constants';

export default function App() {
  const [activeModule, setActiveModule] = useState('inundaciones');
  const [selectedComuna, setSelectedComuna] = useState(0);

  const weather = useWeatherData();
  const flood = useFloodData();
  const air = useAirQuality();

  const comunasGeo = useStaticData('comunas-riesgo.geojson');
  const quebradas = useStaticData('quebradas.geojson');
  const siniestros = useStaticData('siniestros-viales.json');
  const siniestrosPorComuna = useStaticData('siniestros-por-comuna.json');
  const puntosCriticos = useStaticData('puntos-criticos-deslizamiento.json');
  const corredores = useStaticData('corredores-criticos.json');

  const lastUpdate = weather.lastUpdate || flood.lastUpdate || air.lastUpdate;

  const handleRefresh = useCallback(() => {
    weather.refetch();
    flood.refetch();
    air.refetch();
  }, [weather, flood, air]);

  const selectedComunaData = COMUNAS.find((c) => c.numero === selectedComuna);
  const comunaRiskLevel = selectedComuna && comunasGeo.data
    ? comunasGeo.data.features?.find((f) => f.properties.numero === selectedComuna)?.properties.nivelRiesgo
    : 'bajo';

  return (
    <>
      <Header
        comunas={COMUNAS}
        selectedComuna={selectedComuna}
        onComunaChange={setSelectedComuna}
        lastUpdate={lastUpdate}
        onRefresh={handleRefresh}
      />
      <AlertBanner weatherData={weather.data} floodData={flood.data} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            {/* Map area */}
            <div className="flex-1 relative">
              <MainMap
                comunasData={comunasGeo.data}
                quebradasData={quebradas.data}
                siniestrosData={siniestros.data}
                puntosCriticos={puntosCriticos.data}
                corredores={corredores.data}
                activeModule={activeModule}
                selectedComuna={selectedComuna}
              />
            </div>

            {/* Widgets sidebar */}
            <div className="w-72 bg-slate-900/50 border-l border-slate-700 p-3 space-y-3 overflow-y-auto scrollbar-thin hidden lg:block">
              <WeatherNow data={weather.data} loading={weather.loading} />
              <AirQualityGauge data={air.data} loading={air.loading} />
              <RiverDischarge data={flood.data} loading={flood.loading} />
              <RiskScore
                weatherData={weather.data}
                floodData={flood.data}
                airData={air.data}
                comunaRiskLevel={comunaRiskLevel}
              />
              <PrecipForecast data={weather.data} loading={weather.loading} />
            </div>
          </div>

          {/* Bottom panel */}
          <div className="h-64 md:h-72 border-t border-slate-700 bg-slate-900/50 flex-shrink-0 overflow-hidden">
            {activeModule === 'inundaciones' && (
              <InundacionPanel
                weatherData={weather.data}
                floodData={flood.data}
                puntosCriticos={puntosCriticos.data}
                selectedComuna={selectedComuna}
              />
            )}
            {activeModule === 'aire' && (
              <AirePanel airData={air.data} />
            )}
            {activeModule === 'siniestros' && (
              <SiniestrosPanel
                siniestrosData={siniestros.data}
                corredores={corredores.data}
                siniestrosPorComuna={siniestrosPorComuna.data}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

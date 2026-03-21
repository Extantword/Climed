import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';

import Header from './src/components/Header';
import RadarMap from './src/components/RadarMap';
import RadarControls from './src/components/RadarControls';
import RadarLegend from './src/components/RadarLegend';
import HistoricalControls from './src/components/HistoricalControls';
import PrecipitacionPanel from './src/components/PrecipitacionPanel';
import HelpModal from './src/components/HelpModal';

import { useRainRadar } from './src/hooks/useRainRadar';
import { usePrecipitationData } from './src/hooks/usePrecipitationData';
import { useHistoricalReplay } from './src/hooks/useHistoricalReplay';

export default function App() {
  const radar = useRainRadar();
  const precip = usePrecipitationData();
  const replay = useHistoricalReplay();
  const [replayActive, setReplayActive] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />

      {/* Header */}
      <Header
        frameTime={radar.frameTime}
        isNowcast={radar.isNowcast}
        loading={radar.loading}
        onRefresh={radar.refetch}
        onHelp={() => setHelpOpen(true)}
      />

      {/* Map */}
      <View style={styles.mapContainer}>
        <RadarMap
          host={radar.host}
          currentFrame={radar.currentFrame}
          replayActive={replayActive}
          replayPoints={replayActive ? replay.currentPoints : []}
        />

        {/* Floating action buttons */}
        <View style={styles.fabContainer}>
          <TouchableOpacity
            onPress={() => setPanelOpen((p) => !p)}
            style={[styles.fab, panelOpen && styles.fabActive]}
          >
            <Text style={[styles.fabText, panelOpen && styles.fabTextActive]}>
              💧 {panelOpen ? 'Cerrar' : 'Precipitación'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setReplayActive((r) => !r);
              if (!replayActive) replay.setPlaying(true);
            }}
            style={[styles.fab, replayActive && styles.fabReplayActive]}
          >
            <Text style={[styles.fabText, replayActive && styles.fabTextActive]}>
              ⏱️ {replayActive ? 'Replay ON' : 'Replay'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Replay info banner */}
        {replayActive && (
          <View style={styles.replayBanner}>
            <Text style={styles.replayBannerText}>
              Datos reales Open-Meteo — últimos 7 días + pronóstico 48h
            </Text>
          </View>
        )}

        {/* Legend */}
        <View style={styles.legendContainer}>
          <RadarLegend />
        </View>

        {/* Bottom controls — overlaid on map */}
        <View style={styles.bottomArea}>
        {/* Historical replay controls */}
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

        {/* Radar animation controls */}
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
      </View>
      </View>

      {/* Precipitation panel — full-screen modal for mobile */}
      <Modal
        visible={panelOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPanelOpen(false)}
      >
        <View style={styles.panelModal}>
          <PrecipitacionPanel
            datosGov={precip.datosGov}
            ideam={precip.ideam}
            openMeteo={precip.openMeteo}
            loading={precip.loading}
            lastUpdate={precip.lastUpdate}
            onRefresh={precip.refetch}
            onClose={() => setPanelOpen(false)}
          />
        </View>
      </Modal>

      {/* Help modal */}
      <HelpModal visible={helpOpen} onClose={() => setHelpOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  fabContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    gap: 8,
  },
  fab: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fabActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  fabReplayActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  fabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  fabTextActive: {
    color: '#fff',
  },
  replayBanner: {
    position: 'absolute',
    top: 90,
    right: 10,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: 200,
  },
  replayBannerText: {
    fontSize: 10,
    color: '#047857',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 4,
    right: 0,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingBottom: 8,
  },
  panelModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

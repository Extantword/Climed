import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

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
    <View style={styles.container}>
      {/* Play/Pause */}
      <TouchableOpacity
        onPress={() => setPlaying((p) => !p)}
        style={styles.playBtn}
      >
        <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
      </TouchableOpacity>

      {/* Timeline */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={frames.length - 1}
          step={1}
          value={currentIndex}
          onSlidingStart={() => setPlaying(false)}
          onValueChange={(v) => setCurrentIndex(Math.round(v))}
          minimumTrackTintColor="#2563eb"
          maximumTrackTintColor="#cbd5e1"
          thumbTintColor="#2563eb"
        />
        <View style={styles.tickLabels}>
          <Text style={styles.tickText}>–90min</Text>
          <Text style={[styles.tickText, styles.tickNow]}>ahora</Text>
          <Text style={[styles.tickText, styles.tickForecast]}>+1h</Text>
        </View>
      </View>

      {/* Current time + label */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatFrameTime(frameTime)}</Text>
        {isNowcast ? (
          <Text style={styles.labelNowcast}>pronóstico</Text>
        ) : (
          <Text style={styles.labelRadar}>radar</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 14,
    color: '#fff',
  },
  sliderContainer: {
    flex: 1,
  },
  slider: {
    width: '100%',
    height: 24,
  },
  tickLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  tickText: {
    fontSize: 9,
    color: '#94a3b8',
  },
  tickNow: {
    color: '#475569',
    fontWeight: '500',
  },
  tickForecast: {
    color: '#3b82f6',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: '#0f172a',
  },
  labelNowcast: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: '600',
  },
  labelRadar: {
    fontSize: 10,
    color: '#94a3b8',
  },
});

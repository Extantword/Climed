import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
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
  return date.toLocaleDateString('es-CO', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
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
    <View style={styles.container}>
      {/* Top row: close, play, timeline, time */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPlaying((p) => !p)}
          style={styles.playBtn}
        >
          <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={timeSlots.length - 1}
            step={1}
            value={currentIndex}
            onSlidingStart={() => setPlaying(false)}
            onValueChange={(v) => setCurrentIndex(Math.round(v))}
            minimumTrackTintColor="#10b981"
            maximumTrackTintColor="#475569"
            thumbTintColor="#10b981"
          />
          <View style={styles.tickLabels}>
            <Text style={styles.tickText}>–7 días</Text>
            <Text style={[styles.tickText, styles.tickNow]}>ahora</Text>
            <Text style={[styles.tickText, styles.tickForecast]}>+48h</Text>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Text style={styles.date}>{formatDate(currentTime)}</Text>
          {isForecasting ? (
            <Text style={styles.forecastLabel}>pronóstico</Text>
          ) : (
            <Text style={styles.dataLabel}>datos reales</Text>
          )}
        </View>
      </View>

      {/* Bottom row: velocity controls */}
      <View style={styles.bottomRow}>
        <Text style={styles.velocityLabel}>Velocidad:</Text>
        <View style={styles.velocityBtns}>
          {VELOCITY_PRESETS.map((preset, i) => (
            <TouchableOpacity
              key={preset.label}
              onPress={() => setVelocityIdx(i)}
              style={[
                styles.velocityBtn,
                velocityIdx === i && styles.velocityBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.velocityBtnText,
                  velocityIdx === i && styles.velocityBtnTextActive,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.frameCount}>
          {currentIndex + 1}/{timeSlots.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15,23,42,0.92)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 6,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#059669',
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
    color: '#cbd5e1',
  },
  tickForecast: {
    color: '#34d399',
  },
  timeContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: '#fff',
  },
  date: {
    fontSize: 9,
    color: '#94a3b8',
  },
  forecastLabel: {
    fontSize: 9,
    color: '#34d399',
    fontWeight: '600',
  },
  dataLabel: {
    fontSize: 9,
    color: '#94a3b8',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  velocityLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  velocityBtns: {
    flexDirection: 'row',
    gap: 4,
  },
  velocityBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#334155',
  },
  velocityBtnActive: {
    backgroundColor: '#059669',
  },
  velocityBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  velocityBtnTextActive: {
    color: '#fff',
  },
  frameCount: {
    fontSize: 10,
    fontVariant: ['tabular-nums'],
    color: '#64748b',
  },
});

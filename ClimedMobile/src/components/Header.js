import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(date) {
  if (!date) return '';
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function Header({ frameTime, isNowcast, loading, onRefresh, onHelp }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.icon}>🌧️</Text>
        <View>
          <Text style={styles.title}>Radar de Lluvia — Medellín</Text>
          <Text style={styles.subtitle}>Precipitación en tiempo real</Text>
        </View>
      </View>

      <View style={styles.right}>
        {loading ? (
          <ActivityIndicator size="small" color="#94a3b8" />
        ) : frameTime ? (
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(frameTime)}</Text>
            <Text style={[styles.label, isNowcast && styles.labelNowcast]}>
              {isNowcast ? 'pronóstico' : 'radar'}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
          <Text style={styles.refreshText}>↻</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onHelp} style={styles.helpBtn}>
          <Text style={styles.helpText}>?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748b',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: '#1e293b',
  },
  label: {
    fontSize: 10,
    color: '#94a3b8',
  },
  labelNowcast: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  refreshBtn: {
    padding: 6,
    borderRadius: 6,
  },
  refreshText: {
    fontSize: 18,
    color: '#94a3b8',
  },
  helpBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
});

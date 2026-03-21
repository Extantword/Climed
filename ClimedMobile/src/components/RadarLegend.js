import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RADAR_LEVELS } from '../utils/constants';

export default function RadarLegend() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intensidad</Text>
      <View style={styles.levels}>
        {RADAR_LEVELS.map((l, i) => (
          <View key={i} style={styles.levelItem}>
            <View style={[styles.swatch, { backgroundColor: l.color }]} />
            {l.label ? (
              <Text style={styles.label}>{l.label}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 12,
    marginBottom: 10,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  levels: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  levelItem: {
    alignItems: 'center',
    gap: 2,
  },
  swatch: {
    width: 18,
    height: 10,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  label: {
    fontSize: 8,
    color: '#64748b',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleString('es-CO', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function precipLevel(mm) {
  if (mm <= 0) return { label: 'Sin lluvia', color: '#94a3b8' };
  if (mm < 2.5) return { label: 'Ligera', color: '#10B981' };
  if (mm < 7.5) return { label: 'Moderada', color: '#F59E0B' };
  if (mm < 15) return { label: 'Fuerte', color: '#F97316' };
  return { label: 'Intensa', color: '#EF4444' };
}

function SourceBadge({ name, error }) {
  return (
    <View style={[styles.badge, error ? styles.badgeError : styles.badgeOk]}>
      <View style={[styles.badgeDot, error ? styles.dotError : styles.dotOk]} />
      <Text style={[styles.badgeText, error ? styles.badgeTextError : styles.badgeTextOk]}>
        {name}
      </Text>
    </View>
  );
}

function StationRow({ station, showMeta }) {
  const value = station.value ?? station.currentPrecip ?? 0;
  const level = precipLevel(value);

  return (
    <View style={styles.stationRow}>
      <View style={styles.stationInfo}>
        <Text style={styles.stationName} numberOfLines={1}>
          {station.name || station.station}
        </Text>
        {showMeta && (
          <Text style={styles.stationMeta} numberOfLines={1}>
            {station.municipality || station.source}
            {station.date ? ` · ${formatDate(station.date)}` : ''}
          </Text>
        )}
      </View>
      <View style={styles.stationValues}>
        <Text style={[styles.stationValue, { color: level.color }]}>
          {value.toFixed(1)} {station.unit || 'mm'}
        </Text>
        <View style={[styles.levelBadge, { backgroundColor: level.color + '20' }]}>
          <Text style={[styles.levelText, { color: level.color }]}>{level.label}</Text>
        </View>
      </View>
    </View>
  );
}

const TABS = [
  { id: 'openmeteo', label: 'Open-Meteo' },
  { id: 'datosgov', label: 'datos.gov.co' },
  { id: 'ideam', label: 'IDEAM' },
];

export default function PrecipitacionPanel({
  datosGov,
  ideam,
  openMeteo,
  loading,
  lastUpdate,
  onRefresh,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('openmeteo');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>💧 Precipitación</Text>
          <Text style={styles.headerSubtitle}>
            {lastUpdate
              ? `Actualizado ${lastUpdate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`
              : 'Cargando…'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onRefresh} style={styles.actionBtn}>
            <Text style={styles.actionText}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.actionBtn}>
            <Text style={styles.actionText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Source badges */}
      <View style={styles.badges}>
        <SourceBadge name="Open-Meteo" error={openMeteo.error} />
        <SourceBadge name="datos.gov.co" error={datosGov.error} />
        <SourceBadge name="IDEAM" error={ideam.error} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="small" color="#94a3b8" style={{ marginTop: 20 }} />
        ) : (
          <>
            {activeTab === 'openmeteo' && (
              <View>
                {openMeteo.error ? (
                  <Text style={styles.errorText}>{openMeteo.error}</Text>
                ) : openMeteo.summary.length === 0 ? (
                  <Text style={styles.emptyText}>Sin datos disponibles</Text>
                ) : (
                  <>
                    <Text style={styles.sectionNote}>
                      Precipitación actual y acumulada (8 puntos en Medellín)
                    </Text>
                    {openMeteo.summary.map((s, i) => (
                      <View key={i} style={styles.stationRow}>
                        <View style={styles.stationInfo}>
                          <Text style={styles.stationName} numberOfLines={1}>{s.name}</Text>
                          <Text style={styles.stationMeta}>
                            24h: {s.total24h} mm · Próx 6h: {s.forecast6h} mm
                          </Text>
                        </View>
                        <Text style={[styles.stationValue, { color: precipLevel(s.currentPrecip).color }]}>
                          {s.currentPrecip.toFixed(1)} mm/h
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            )}

            {activeTab === 'datosgov' && (
              <View>
                {datosGov.error ? (
                  <Text style={styles.errorText}>{datosGov.error}</Text>
                ) : datosGov.data.length === 0 ? (
                  <Text style={styles.emptyText}>Sin datos disponibles</Text>
                ) : (
                  <>
                    <Text style={styles.sectionNote}>
                      Estaciones automáticas IDEAM — Antioquia
                    </Text>
                    {datosGov.data.slice(0, 15).map((s, i) => (
                      <StationRow key={i} station={s} showMeta />
                    ))}
                  </>
                )}
              </View>
            )}

            {activeTab === 'ideam' && (
              <View>
                {ideam.error ? (
                  <Text style={styles.errorText}>{ideam.error}</Text>
                ) : ideam.data.length === 0 ? (
                  <Text style={styles.emptyText}>Sin datos disponibles</Text>
                ) : (
                  <>
                    <Text style={styles.sectionNote}>
                      Datos de precipitación IDEAM — Antioquia
                    </Text>
                    {ideam.data.slice(0, 15).map((s, i) => (
                      <StationRow key={i} station={s} showMeta />
                    ))}
                  </>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Fuentes: Open-Meteo · datos.gov.co · IDEAM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 6,
  },
  actionText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  badgeOk: { backgroundColor: '#dcfce7' },
  badgeError: { backgroundColor: '#fef2f2' },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  dotOk: { backgroundColor: '#22c55e' },
  dotError: { backgroundColor: '#f87171' },
  badgeText: { fontSize: 10, fontWeight: '600' },
  badgeTextOk: { color: '#15803d' },
  badgeTextError: { color: '#dc2626' },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
  tabTextActive: {
    color: '#2563eb',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionNote: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 8,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  stationInfo: {
    flex: 1,
    marginRight: 8,
  },
  stationName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e293b',
  },
  stationMeta: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },
  stationValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stationValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 9,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8',
    paddingVertical: 12,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 9,
    color: '#94a3b8',
  },
});

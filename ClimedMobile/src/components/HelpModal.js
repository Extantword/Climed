import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function HelpModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>¿Cómo funciona?</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.paragraph}>
              Esta aplicación monitorea la precipitación en tiempo real sobre
              Medellín y el Área Metropolitana del Valle de Aburrá, combinando
              múltiples fuentes de datos abiertos.
            </Text>

            <Text style={styles.sectionTitle}>🌧️ Radar de lluvia</Text>
            <Text style={styles.paragraph}>
              El mapa muestra una capa de radar de RainViewer que se actualiza
              cada 10 minutos. Los colores siguen la leyenda de intensidad
              (verde = ligera, rojo = intensa, morado = extrema). Usa la barra
              inferior para retroceder hasta 90 min o ver el pronóstico de la
              próxima hora.
            </Text>

            <Text style={styles.sectionTitle}>⏱️ Replay histórico</Text>
            <Text style={styles.paragraph}>
              Al activar el Replay se cargan datos reales de los últimos 7 días
              para 8 puntos en Medellín. Aparecen círculos de colores que
              reflejan la intensidad registrada. Puedes controlar la velocidad
              de 0.5× a 8×.
            </Text>

            <Text style={styles.sectionTitle}>💧 Panel de precipitación</Text>
            <Text style={styles.paragraph}>
              El panel lateral muestra datos de 3 fuentes: Open-Meteo
              (precipitación actual, acumulado 24h, pronóstico 6h),
              datos.gov.co (estaciones IDEAM en Antioquia), e IDEAM
              (observaciones de precipitación).
            </Text>

            <View style={styles.sourcesBox}>
              <Text style={styles.sourcesTitle}>📡 Fuentes de datos</Text>
              <Text style={styles.sourceItem}>• RainViewer — radar global</Text>
              <Text style={styles.sourceItem}>• Open-Meteo — pronóstico e historial</Text>
              <Text style={styles.sourceItem}>• datos.gov.co — datos abiertos Colombia</Text>
              <Text style={styles.sourceItem}>• IDEAM — hidrología y meteorología</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  paragraph: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  sourcesBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  sourcesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  sourceItem: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 18,
  },
});

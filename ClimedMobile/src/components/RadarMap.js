import React, { useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { UrlTile, Circle } from 'react-native-maps';
import { MEDELLIN_CENTER, MEDELLIN_ZOOM_DELTA } from '../utils/constants';

/**
 * Maps precipitation (mm/h) to a visual style for circles on the map.
 */
function precipStyle(mm) {
  if (mm <= 0) return null;
  if (mm < 1) return { color: 'rgba(200,240,200,0.40)', radius: 1200 };
  if (mm < 2.5) return { color: 'rgba(0,208,0,0.45)', radius: 1400 };
  if (mm < 5) return { color: 'rgba(0,144,0,0.45)', radius: 1600 };
  if (mm < 10) return { color: 'rgba(255,255,0,0.45)', radius: 1800 };
  if (mm < 20) return { color: 'rgba(255,102,0,0.50)', radius: 2000 };
  if (mm < 40) return { color: 'rgba(255,0,0,0.50)', radius: 2200 };
  return { color: 'rgba(204,0,204,0.55)', radius: 2500 };
}

export default function RadarMap({ host, currentFrame, replayActive, replayPoints }) {
  // Build radar tile URL template
  const radarUrlTemplate = useMemo(() => {
    if (!host || !currentFrame) return null;
    return `${host}${currentFrame.path}/256/{z}/{x}/{y}/6/1_1.png`;
  }, [host, currentFrame]);

  // Build replay circles
  const replayCircles = useMemo(() => {
    if (!replayActive || !replayPoints || replayPoints.length === 0) return [];
    return replayPoints
      .map((pt, idx) => {
        const style = precipStyle(pt.precip);
        if (!style) return null;
        return {
          key: `${pt.name}-${idx}`,
          center: { latitude: pt.lat, longitude: pt.lng },
          radius: style.radius,
          fillColor: style.color,
          name: pt.name,
          precip: pt.precip,
        };
      })
      .filter(Boolean);
  }, [replayActive, replayPoints]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...MEDELLIN_CENTER,
          ...MEDELLIN_ZOOM_DELTA,
        }}
        mapType="standard"
        showsUserLocation={false}
        showsCompass={true}
        showsScale={true}
        minZoomLevel={7}
        maxZoomLevel={15}
      >
        {/* Radar tile overlay */}
        {radarUrlTemplate && (
          <UrlTile
            urlTemplate={radarUrlTemplate}
            maximumZ={7}
            opacity={0.65}
            zIndex={10}
            tileSize={256}
          />
        )}

        {/* Historical replay circles */}
        {replayCircles.map((circle) => (
          <React.Fragment key={circle.key}>
            {/* Outer glow */}
            <Circle
              center={circle.center}
              radius={circle.radius * 1.8}
              fillColor={circle.fillColor.replace(/[\d.]+\)$/, '0.15)')}
              strokeColor="transparent"
              zIndex={5}
            />
            {/* Main circle */}
            <Circle
              center={circle.center}
              radius={circle.radius}
              fillColor={circle.fillColor}
              strokeColor="transparent"
              zIndex={6}
            />
          </React.Fragment>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

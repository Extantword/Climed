# MedCity Dashboard — Plan de Implementación para Claude Code

## Resumen Ejecutivo
Dashboard interactivo de datos abiertos de Medellín para que comunidades barriales visualicen indicadores de **riesgo de inundaciones, calidad del aire y siniestralidad vial** en su territorio. Combina 4 APIs en tiempo real + 4 fuentes de datos abiertos locales. Se desplegará como GitHub Pages (sitio estático).

---

## 1. STACK TECNOLÓGICO

```
Framework:    React 18 + Vite (build estático para GitHub Pages)
Estilos:      Tailwind CSS 3
Mapas:        Leaflet + react-leaflet (gratis, sin API key)
Gráficas:     Recharts (ya familiar en el ecosistema React)
Idioma:       Español (toda la UI)
Deploy:       GitHub Pages via `gh-pages` npm package
```

### ¿Por qué este stack?
- Vite genera un build estático (`dist/`) perfecto para GitHub Pages
- Leaflet es gratis sin API key (a diferencia de Mapbox/Google Maps)
- No necesita backend: todas las APIs se consumen desde el cliente
- Tailwind permite iterar rápido en un hackathon

---

## 2. APIS EN TIEMPO REAL (todas gratis, todas verificadas para Medellín)

### 2.1 Open-Meteo Weather API
- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Auth**: Ninguna (sin API key)
- **Datos**: Temperatura, humedad, precipitación hora por hora, viento, probabilidad de precipitación
- **Params para Medellín**:
```
?latitude=6.2518&longitude=-75.5636
&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,weathercode,windspeed_10m
&daily=precipitation_sum,precipitation_probability_max,weathercode
&timezone=America/Bogota
&forecast_days=7
```

### 2.2 Open-Meteo Flood API (descarga del río Medellín)
- **URL**: `https://flood-api.open-meteo.com/v1/flood`
- **Auth**: Ninguna
- **Datos**: Descarga del río en m³/s, pronóstico hasta 210 días
- **Params**:
```
?latitude=6.2518&longitude=-75.5636
&daily=river_discharge,river_discharge_mean,river_discharge_max
&forecast_days=30
```
- **NOTA**: La resolución es ~5km. Probar coordenadas variando ±0.1° si el río no se detecta bien. El río Medellín/Aburrá debería aparecer.

### 2.3 Open-Meteo Air Quality API
- **URL**: `https://air-quality-api.open-meteo.com/v1/air-quality`
- **Auth**: Ninguna
- **Datos**: PM2.5, PM10, ozono, NO2, SO2, índice AQI europeo y US
- **Params**:
```
?latitude=6.2518&longitude=-75.5636
&hourly=pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide,us_aqi,european_aqi
&timezone=America/Bogota
```

### 2.4 WAQI / AQICN (datos reales de estaciones SIATA)
- **URL**: `https://api.waqi.info/feed/@STATION_ID/?token=TOKEN`
- **Auth**: API key gratis (registrarse en https://aqicn.org/data-platform/token/)
- **Datos**: AQI real de estaciones en Medellín (El Poblado, etc.)
- **Estaciones conocidas**: Buscar IDs con `https://api.waqi.info/search/?keyword=medellin&token=TOKEN`
- **IMPORTANTE**: Para el hackathon, hardcodear el token como variable de entorno. En producción, usar proxy.
- **FALLBACK**: Si no se consigue token a tiempo, usar solo Open-Meteo Air Quality como fuente de aire.

---

## 3. DATOS ESTÁTICOS PRE-CARGADOS (archivos JSON en /public/data/)

Estos datos se descargan antes del hackathon y se incluyen como archivos estáticos en el proyecto.

### 3.1 Zonas de riesgo por comuna
- **Fuente**: GeoMedellín (geomedellin-m-medellin.opendata.arcgis.com)
- **Formato**: GeoJSON con polígonos de comunas + nivel de riesgo
- **Archivo**: `/public/data/comunas-riesgo.geojson`
- **Cómo obtener**: Descargar del portal ArcGIS, simplificar geometrías con mapshaper.org para reducir tamaño

### 3.2 Quebradas principales
- **Fuente**: GeoMedellín
- **Formato**: GeoJSON con líneas de quebradas
- **Archivo**: `/public/data/quebradas.geojson`

### 3.3 Siniestralidad vial (2014-2024)
- **Fuente**: MEData (medata.gov.co/node/16692 y medata.gov.co/node/16609)
- **Formato**: JSON procesado con lat/lng de cada incidente
- **Archivos**: 
  - `/public/data/siniestros-viales.json` (puntos georreferenciados)
  - `/public/data/siniestros-por-comuna.json` (agregado por comuna y año)

### 3.4 Puntos críticos de deslizamiento
- **Fuente**: DAGRD (20 puntos críticos documentados)
- **Formato**: JSON con coordenadas y descripción
- **Archivo**: `/public/data/puntos-criticos-deslizamiento.json`

### 3.5 Corredores viales peligrosos
- **Fuente**: Observatorio de Movilidad (estudio 2008-2024)
- **Formato**: JSON con los 10 corredores + estadísticas
- **Archivo**: `/public/data/corredores-criticos.json`

**NOTA PARA CLAUDE CODE**: Si al momento de implementar no se tienen los GeoJSON reales descargados, generar datos de ejemplo realistas basados en las coordenadas reales de Medellín para que el demo funcione. Los nombres de comunas, quebradas y corredores deben ser REALES. El equipo reemplazará después con datos oficiales.

---

## 4. ESTRUCTURA DEL PROYECTO

```
medcity-dashboard/
├── public/
│   ├── data/                    # JSONs estáticos pre-cargados
│   │   ├── comunas-riesgo.geojson
│   │   ├── quebradas.geojson
│   │   ├── siniestros-viales.json
│   │   ├── siniestros-por-comuna.json
│   │   ├── puntos-criticos-deslizamiento.json
│   │   └── corredores-criticos.json
│   └── favicon.svg
├── src/
│   ├── api/                     # Clientes de API
│   │   ├── openMeteoWeather.js  # Clima actual y pronóstico
│   │   ├── openMeteoFlood.js    # Descarga río Medellín
│   │   ├── openMeteoAir.js      # Calidad del aire
│   │   └── waqi.js              # WAQI/AQICN (datos SIATA)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx       # Logo + selector de barrio + hora actualización
│   │   │   ├── Sidebar.jsx      # Navegación entre módulos
│   │   │   └── Footer.jsx       # Créditos de datos abiertos
│   │   ├── map/
│   │   │   ├── MainMap.jsx      # Mapa Leaflet central
│   │   │   ├── ComunaLayer.jsx  # Polígonos de comunas coloreados por riesgo
│   │   │   ├── QuebradaLayer.jsx# Líneas de quebradas
│   │   │   ├── SiniestroHeatmap.jsx # Mapa de calor de siniestros
│   │   │   └── PuntosCriticos.jsx   # Marcadores de puntos críticos
│   │   ├── widgets/
│   │   │   ├── WeatherNow.jsx       # Widget clima actual
│   │   │   ├── RiverDischarge.jsx   # Gráfica nivel del río
│   │   │   ├── AirQualityGauge.jsx  # Medidor de AQI
│   │   │   ├── PrecipForecast.jsx   # Pronóstico de lluvia 48h
│   │   │   ├── AlertBanner.jsx      # Banner de alertas activas
│   │   │   └── RiskScore.jsx        # Indicador de riesgo consolidado
│   │   └── panels/
│   │       ├── InundacionPanel.jsx   # Panel detalle inundaciones
│   │       ├── AirePanel.jsx         # Panel detalle calidad del aire
│   │       └── SiniestrosPanel.jsx   # Panel detalle siniestralidad vial
│   ├── hooks/
│   │   ├── useWeatherData.js    # Hook para datos de clima (auto-refresh)
│   │   ├── useFloodData.js      # Hook para datos de inundación
│   │   ├── useAirQuality.js     # Hook para calidad del aire
│   │   └── useStaticData.js     # Hook para cargar JSONs estáticos
│   ├── utils/
│   │   ├── riskCalculator.js    # Calcula nivel de riesgo combinado
│   │   ├── colorScales.js       # Escalas de color para mapas y gauges
│   │   ├── formatters.js        # Formateo de fechas, números, unidades
│   │   └── constants.js         # Coordenadas, umbrales, colores
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                # Tailwind + fuentes + custom styles
├── index.html
├── vite.config.js               # Con base para GitHub Pages
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 5. DISEÑO DE LA UI

### 5.1 Estética
- **Tono**: Dashboard operativo de emergencias — serio, claro, funcional
- **Inspiración**: Salas de situación del DAGRD / centros de control de emergencias
- **Colores**:
  - Fondo: gris oscuro (slate-900) — no negro puro
  - Paneles: slate-800 con bordes slate-700
  - Acentos: 
    - Verde (#10B981) = seguro/bueno
    - Amarillo (#F59E0B) = precaución
    - Naranja (#F97316) = alerta
    - Rojo (#EF4444) = peligro/emergencia
    - Azul (#3B82F6) = información/agua
  - Texto primario: blanco (white/slate-100)
  - Texto secundario: slate-400
- **Tipografía**: 
  - Headlines: "DM Sans" (Google Fonts) — bold, moderna, legible
  - Body: "DM Sans" regular
  - Datos/números: "JetBrains Mono" (monoespaciada para métricas)
- **NO usar**: Gradientes excesivos, sombras difusas, bordes redondeados exagerados. Esto es un dashboard de emergencias, no una app de wellness.

### 5.2 Layout Principal (Desktop)
```
┌─────────────────────────────────────────────────────────┐
│  HEADER: Logo MedCity + "Actualizado: 3:45 PM" + Barrio │
├──────┬──────────────────────────────┬───────────────────┤
│      │                              │  WeatherNow       │
│  S   │                              │  AirQualityGauge  │
│  I   │      MAPA PRINCIPAL          │  RiverDischarge   │
│  D   │      (Leaflet, 60% ancho)    │  RiskScore        │
│  E   │                              │  PrecipForecast   │
│  B   │                              │                   │
│  A   │                              │                   │
│  R   ├──────────────────────────────┴───────────────────┤
│      │  PANEL INFERIOR: detalle según módulo activo      │
│      │  (Inundaciones | Aire | Siniestros)               │
├──────┴──────────────────────────────────────────────────┤
│  FOOTER: Fuentes de datos + logos                        │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Layout Mobile (responsive)
```
┌──────────────────────┐
│ HEADER (compacto)    │
├──────────────────────┤
│ AlertBanner (si hay) │
├──────────────────────┤
│ Tabs: 🌊 💨 🚗     │
├──────────────────────┤
│ Widgets (scroll H)   │
├──────────────────────┤
│ MAPA (50vh)          │
├──────────────────────┤
│ Panel detalle        │
└──────────────────────┘
```

---

## 6. FUNCIONALIDAD POR MÓDULO

### 6.1 Módulo Inundaciones (🌊)
**Mapa muestra**: Polígonos de comunas coloreados por nivel de riesgo + líneas de quebradas + puntos críticos de deslizamiento
**Widgets**:
- `WeatherNow`: Precipitación actual en mm + icono de clima
- `RiverDischarge`: Gráfica de línea con descarga del río Medellín en m³/s (últimos 7 días + pronóstico 7 días). Líneas horizontales de umbral (normal / precaución / alerta)
- `PrecipForecast`: Barras verticales con lluvia pronosticada próximas 48h
- `RiskScore`: Indicador semáforo (🟢🟡🟠🔴) calculado combinando: precipitación actual + pronóstico + descarga río + zona de riesgo del barrio seleccionado
- `AlertBanner`: Si la precipitación pronosticada > 20mm en las próximas 6h O la descarga del río supera el umbral, mostrar banner rojo fijo arriba

**Panel inferior**: Lista de los 20 puntos críticos de deslizamiento del DAGRD, con distancia al barrio seleccionado

### 6.2 Módulo Calidad del Aire (💨)
**Mapa muestra**: Polígonos de comunas coloreados por AQI + marcadores de estaciones de monitoreo
**Widgets**:
- `AirQualityGauge`: Medidor circular tipo velocímetro con el AQI actual (0-500), coloreado según escala EPA
- `WeatherNow`: Viento actual (afecta dispersión de contaminantes)
- Panel con PM2.5, PM10, NO2, O3 individuales con barras de progreso vs límite OMS
- Recomendación textual automática: "Evite ejercicio al aire libre" si AQI > 100

**Panel inferior**: Gráfica histórica de AQI últimas 24-48 horas + contexto de los episodios críticos (feb-abr, oct-nov)

### 6.3 Módulo Siniestralidad Vial (🚗)
**Mapa muestra**: Heatmap de siniestros viales (histórico) + marcadores de los 10 corredores más peligrosos
**Widgets**:
- Cifra de impacto: "276 muertos en 2025" con desglose moto/peatón/ciclista
- Top 5 corredores más peligrosos con siniestros acumulados
- Filtros: por tipo de actor vial (motociclista / peatón / ciclista / todos)
- Filtro temporal: últimos 3 años / último año / todo el histórico

**Panel inferior**: Perfil de riesgo — si seleccionas "soy motociclista", muestra las causas principales + zonas a evitar + horarios peligrosos

---

## 7. LÓGICA DE RIESGO COMBINADO (riskCalculator.js)

```javascript
// Calcula un score de 0-100 y un nivel semáforo
function calculateRiskScore({ precipitation, riverDischarge, aqi, comunaRiskLevel }) {
  let score = 0;
  
  // Precipitación actual (0-30 puntos)
  if (precipitation > 30) score += 30;
  else if (precipitation > 15) score += 20;
  else if (precipitation > 5) score += 10;
  
  // Descarga del río vs promedio (0-30 puntos)
  // riverDischarge.current vs riverDischarge.mean
  const ratio = riverDischarge.current / riverDischarge.mean;
  if (ratio > 3) score += 30;
  else if (ratio > 2) score += 20;
  else if (ratio > 1.5) score += 10;
  
  // Zona de riesgo de la comuna (0-20 puntos)
  if (comunaRiskLevel === 'alto') score += 20;
  else if (comunaRiskLevel === 'medio') score += 10;
  
  // Calidad del aire (0-20 puntos)
  if (aqi > 150) score += 20;
  else if (aqi > 100) score += 10;
  else if (aqi > 50) score += 5;
  
  // Determinar semáforo
  let level;
  if (score >= 70) level = 'rojo';
  else if (score >= 45) level = 'naranja';
  else if (score >= 25) level = 'amarillo';
  else level = 'verde';
  
  return { score, level };
}
```

---

## 8. HOOKS DE DATOS (auto-refresh)

```javascript
// useWeatherData.js — ejemplo de patrón
import { useState, useEffect } from 'react';
import { fetchWeather } from '../api/openMeteoWeather';

export function useWeatherData(lat, lng) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const fetchData = async () => {
    try {
      const result = await fetchWeather(lat, lng);
      setData(result);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
    // Auto-refresh cada 15 minutos
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lng]);
  
  return { data, loading, error, lastUpdate, refetch: fetchData };
}
```

Aplicar el mismo patrón para `useFloodData` (refresh cada 1h), `useAirQuality` (refresh cada 30min).

---

## 9. CONFIGURACIÓN DE VITE PARA GITHUB PAGES

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/medcity-dashboard/', // nombre del repo en GitHub
  build: {
    outDir: 'dist',
  },
});
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

### Deploy con gh-pages
```bash
npm install gh-pages --save-dev
npm run build
npm run deploy
```
Esto publica `dist/` en la rama `gh-pages`. El sitio estará en:
`https://USUARIO.github.io/medcity-dashboard/`

---

## 10. DATOS DE EJEMPLO (para que el demo funcione sin datos reales)

Si al momento de construir no se tienen los GeoJSON oficiales descargados, generar datos realistas de ejemplo. Las comunas de Medellín son:

```
1-Popular, 2-Santa Cruz, 3-Manrique, 4-Aranjuez, 5-Castilla,
6-Doce de Octubre, 7-Robledo, 8-Villa Hermosa, 9-Buenos Aires,
10-La Candelaria, 11-Laureles-Estadio, 12-La América,
13-San Javier, 14-El Poblado, 15-Guayabal, 16-Belén
Corregimientos: 50-San Sebastián de Palmitas, 60-San Cristóbal,
70-Altavista, 80-San Antonio de Prado, 90-Santa Elena
```

Coordenadas aproximadas del centro de Medellín: 6.2518, -75.5636
Coordenadas del Valle de Aburrá: ~6.1 a ~6.4 lat, ~-75.5 a ~-75.65 lng

Los 10 corredores viales más peligrosos (REALES):
1. Autopista Norte (Cra 64) — 13,810 siniestros, 80 muertos (2008-2024)
2. Avenida Regional
3. Autopista Sur
4. Avenida 33 (Calle 33) — 4,652 siniestros, 66 muertos
5. Las Palmas
6. Vía Túnel de Occidente
7. San Juan
8. Carrera 65
9. Avenida El Poblado
10. Avenida Guayabal

Quebradas principales que generan emergencias: La Iguaná, La Presidenta, Doña María, La Jabalcona, Altavista, La Picacha, Santa Elena, La Ayurá, La Doctora.

---

## 11. PRIORIDADES DE IMPLEMENTACIÓN (orden de desarrollo)

### Fase 1 — Esqueleto funcional (primera hora)
1. Inicializar proyecto Vite + React + Tailwind
2. Crear layout principal con Header, Sidebar, área de mapa, área de widgets
3. Montar mapa Leaflet centrado en Medellín con tiles de OpenStreetMap
4. Verificar que el build funciona y se puede servir estáticamente

### Fase 2 — APIs en tiempo real (segunda hora)
5. Implementar `openMeteoWeather.js` + hook + widget `WeatherNow`
6. Implementar `openMeteoFlood.js` + hook + widget `RiverDischarge` con Recharts
7. Implementar `openMeteoAir.js` + hook + widget `AirQualityGauge`
8. Mostrar timestamp de última actualización en el header

### Fase 3 — Capas del mapa (tercera hora)
9. Crear GeoJSON de ejemplo de comunas con niveles de riesgo
10. Renderizar polígonos coloreados en el mapa (ComunaLayer)
11. Agregar marcadores de puntos críticos de deslizamiento
12. Agregar líneas de quebradas principales

### Fase 4 — Módulos y paneles (cuarta hora)
13. Implementar sistema de tabs/módulos (Inundaciones, Aire, Siniestros)
14. Panel de inundaciones con pronóstico de lluvia + gráfica de río
15. Panel de calidad del aire con medidor AQI
16. Panel de siniestralidad con heatmap y filtros

### Fase 5 — Inteligencia y alertas (quinta hora)
17. Implementar `riskCalculator.js` + widget `RiskScore`
18. Implementar `AlertBanner` basado en umbrales
19. Auto-refresh de datos con indicador visual
20. Responsive design para mobile

### Fase 6 — Polish y deploy (hora final)
21. Animaciones de entrada en widgets
22. Loading states y error handling
23. Footer con créditos a todas las fuentes de datos
24. Build final + deploy a GitHub Pages
25. Probar en mobile

---

## 12. NOTAS IMPORTANTES PARA CLAUDE CODE

1. **Todo en español**: Labels, tooltips, alertas, todo. El público es colombiano.
2. **Unidades métricas**: Celsius, km/h, mm de lluvia, µg/m³ para contaminantes.
3. **Timezone**: America/Bogota (UTC-5). Todas las fechas/horas en hora local.
4. **Créditos obligatorios**: Mostrar en el footer: "Datos: Open-Meteo (CC BY 4.0), WAQI/AQICN, MEData Alcaldía de Medellín, GeoMedellín, SIATA, DAGRD, Observatorio de Movilidad"
5. **No hardcodear tokens en el código**: Si se usa WAQI, ponerlo como variable de entorno o como fallback graceful (si falla, usar solo Open-Meteo Air Quality).
6. **Performance**: Los GeoJSON de comunas pueden ser pesados. Simplificar geometrías. Usar `useMemo` para capas del mapa.
7. **Accesibilidad**: Labels en los gauges, alt text en iconos, contraste suficiente (fondo oscuro + texto claro = OK).
8. **Leaflet tiles**: Usar CartoDB Dark Matter tiles para que combinen con el tema oscuro:
   `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
9. **Sin backend**: Todo se ejecuta en el browser. Las APIs de Open-Meteo permiten CORS.
10. **El barrio seleccionado**: Usar un dropdown simple con las 16 comunas + 5 corregimientos. Al seleccionar, centrar el mapa y filtrar datos relevantes.

---

## 13. CONTEXTO DEL HACKATHON

- **Reto**: "MedCity Dashboard: Datos Abiertos para Decisiones que Transforman"
- **Foco**: Colombia 5.0 / Smart Cities / Datos Abiertos
- **Lo que piden**: Dashboard interactivo usando datos abiertos de Medellín para que una comunidad barrial o PyME visualice indicadores de calidad de vida o de oportunidades de negocio
- **Diferenciador del proyecto**: No es solo visualización de datos históricos — combina datos en tiempo real con contexto local para generar ALERTAS ACCIONABLES que pueden salvar vidas
- **Pitch en una línea**: "Convertimos los datos que Medellín ya genera en alertas que la comunidad puede entender y actuar"

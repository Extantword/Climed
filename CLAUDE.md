# Climed — Medellín Precipitation Radar

## What this is

A React + Vite single-page app that shows a live, animated precipitation radar over Medellín, Colombia. It uses the [RainViewer](https://www.rainviewer.com/api.html) public API to display past radar frames (~90 min of history) and short-range nowcast frames (~1 h forecast), animated on a Leaflet map.

## Tech stack

| Layer | Library/Tool |
|---|---|
| UI framework | React 19 + Vite 8 |
| Map | Leaflet 1.9 + react-leaflet 5 |
| Basemap | CARTO Light (`light_all`) |
| Radar tiles | RainViewer public API |
| Styling | Tailwind CSS v4 |
| Charts (unused) | Recharts 3 |

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # serve built output
```

## Project structure (active)

```
src/
  App.jsx                         # Root: wires radar state to map + controls
  main.jsx                        # React entry point
  index.css                       # Tailwind base import

  api/
    rainViewer.js                 # Fetches RainViewer weather-maps.json; builds tile URLs

  hooks/
    useRainRadar.js               # Radar state: frames, animation playback, auto-refresh

  components/
    RadarControls.jsx             # Bottom bar: play/pause + timeline scrubber
    RadarLegend.jsx               # Bottom-right legend: precipitation intensity swatches
    layout/
      Header.jsx                  # Top bar: title, current frame time, refresh button
    map/
      MainMap.jsx                 # MapContainer centered on Medellín
      RadarLayer.jsx              # TileLayer that renders one radar frame

  utils/
    constants.js                  # MEDELLIN_CENTER, MEDELLIN_ZOOM, TILE_URL, COMUNAS list,
                                  # RISK_COLORS, AQI_SCALE, WEATHER_CODES, RIVER_THRESHOLDS
```

## Key details

- **Map center**: `[6.2518, -75.5636]`, zoom 12
- **Radar tile URL pattern**: `{host}{path}/256/{z}/{x}/{y}/6/1_1.png`
  - Color scheme 6 = classic green→yellow→red; `smooth=1`, `snow=1`
- **Animation**: 500 ms per frame, loops; starts at the most-recent past frame
- **Auto-refresh**: radar data re-fetched every 10 minutes
- **Past vs nowcast**: `isNowcast = currentIndex >= pastCount`; nowcast frames are labeled "pronóstico" in blue

## Unused / dormant files

The following files exist from a prior multi-panel dashboard concept and are **not imported anywhere in the current app**. They can be revived or deleted as needed:

```
src/api/         openMeteoAir.js, openMeteoFlood.js, openMeteoWeather.js, waqi.js
src/hooks/       useAirQuality.js, useFloodData.js, useStaticData.js, useWeatherData.js
src/components/
  layout/        Footer.jsx, Sidebar.jsx
  map/           ComunaLayer.jsx, PuntosCriticos.jsx, QuebradaLayer.jsx, SiniestroHeatmap.jsx
  panels/        AirePanel.jsx, InundacionPanel.jsx, SiniestrosPanel.jsx
  widgets/       AirQualityGauge.jsx, AlertBanner.jsx, PrecipForecast.jsx,
                 RiskScore.jsx, RiverDischarge.jsx, WeatherNow.jsx
  utils/         colorScales.js, formatters.js, riskCalculator.js
public/data/     comunas-riesgo.geojson, corredores-criticos.json,
                 puntos-criticos-deslizamiento.json, quebradas.geojson,
                 siniestros-por-comuna.json, siniestros-viales.json
```

`PLAN_MEDCITY_DASHBOARD.md` in the repo root also describes the original multi-layer dashboard vision and is no longer current.

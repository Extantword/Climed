import { useState, useEffect, useRef, useCallback } from 'react';

// Medellín's main traffic corridors with GeoJSON-ready coordinates [lat, lng]
export const CORRIDORS = [
  {
    id: 'autopista_norte',
    name: 'Autopista Norte',
    positions: [
      [6.3490, -75.5530],
      [6.3200, -75.5570],
      [6.3000, -75.5585],
      [6.2870, -75.5600],
      [6.2700, -75.5620],
      [6.2610, -75.5680],
    ],
    weight: 6,
  },
  {
    id: 'ferrocarril',
    name: 'Av. El Ferrocarril',
    positions: [
      [6.2700, -75.5720],
      [6.2600, -75.5735],
      [6.2500, -75.5755],
      [6.2380, -75.5790],
      [6.2250, -75.5820],
    ],
    weight: 5,
  },
  {
    id: 'regional',
    name: 'Autopista Sur / Av. Regional',
    positions: [
      [6.2600, -75.5680],
      [6.2450, -75.5770],
      [6.2300, -75.5870],
      [6.2150, -75.5960],
      [6.1980, -75.6030],
    ],
    weight: 6,
  },
  {
    id: 'calle80',
    name: 'Calle 80 / Metroplús',
    positions: [
      [6.2790, -75.5600],
      [6.2780, -75.5700],
      [6.2768, -75.5830],
      [6.2755, -75.5980],
      [6.2745, -75.6070],
    ],
    weight: 5,
  },
  {
    id: 'poblado',
    name: 'Av. El Poblado',
    positions: [
      [6.2230, -75.5660],
      [6.2100, -75.5680],
      [6.1980, -75.5700],
      [6.1870, -75.5730],
      [6.1750, -75.5760],
    ],
    weight: 5,
  },
  {
    id: 'lasvegass',
    name: 'Av. Las Vegas / Calle 33',
    positions: [
      [6.2460, -75.5665],
      [6.2455, -75.5780],
      [6.2448, -75.5900],
      [6.2440, -75.6020],
      [6.2430, -75.6120],
    ],
    weight: 4,
  },
  {
    id: 'colombia',
    name: 'Av. Colombia',
    positions: [
      [6.2555, -75.5660],
      [6.2550, -75.5770],
      [6.2545, -75.5890],
      [6.2540, -75.6010],
    ],
    weight: 4,
  },
  {
    id: 'oriental',
    name: 'Av. Oriental',
    positions: [
      [6.2800, -75.5640],
      [6.2680, -75.5645],
      [6.2550, -75.5650],
      [6.2420, -75.5660],
      [6.2300, -75.5670],
    ],
    weight: 5,
  },
  {
    id: 'guayabal',
    name: 'Av. Guayabal',
    positions: [
      [6.2300, -75.5870],
      [6.2180, -75.5920],
      [6.2060, -75.5975],
      [6.1940, -75.6030],
    ],
    weight: 4,
  },
  {
    id: 'calle30',
    name: 'Calle 30',
    positions: [
      [6.2510, -75.5660],
      [6.2505, -75.5780],
      [6.2498, -75.5900],
      [6.2490, -75.6000],
    ],
    weight: 4,
  },
  {
    id: 'bello',
    name: 'Troncal de Bello',
    positions: [
      [6.3350, -75.5580],
      [6.3500, -75.5490],
      [6.3650, -75.5440],
      [6.3780, -75.5400],
    ],
    weight: 4,
  },
  {
    id: 'envigado',
    name: 'Vía Envigado',
    positions: [
      [6.1760, -75.5780],
      [6.1650, -75.5830],
      [6.1530, -75.5870],
      [6.1420, -75.5910],
    ],
    weight: 4,
  },
];

// Hourly congestion profile [0..23] for weekdays (0 = free, 1 = gridlock)
const WEEKDAY_PROFILE = [
  0.12, 0.08, 0.07, 0.07, 0.10, 0.22, // 00-05
  0.52, 0.88, 0.96, 0.72, 0.56, 0.62, // 06-11
  0.72, 0.66, 0.55, 0.57, 0.68, 0.93, // 12-17
  0.97, 0.86, 0.70, 0.54, 0.38, 0.22, // 18-23
];

// Weekend profile — later and softer peaks, active at night
const WEEKEND_PROFILE = [
  0.28, 0.20, 0.14, 0.10, 0.08, 0.12, // 00-05
  0.18, 0.28, 0.42, 0.54, 0.60, 0.66, // 06-11
  0.68, 0.68, 0.65, 0.63, 0.66, 0.72, // 12-17
  0.78, 0.80, 0.75, 0.68, 0.58, 0.40, // 18-23
];

// Per-corridor bias (multiplier on top of hourly profile)
const CORRIDOR_BIAS = {
  autopista_norte: 1.08,
  ferrocarril: 0.88,
  regional: 1.05,
  calle80: 0.92,
  poblado: 1.00,
  lasvegass: 0.87,
  colombia: 0.82,
  oriental: 0.95,
  guayabal: 0.90,
  calle30: 0.85,
  bello: 0.80,
  envigado: 0.78,
};

/** Deterministic noise: returns a small delta for a given corridor + frame index */
function corridorNoise(corridorId, frameIndex) {
  const h = (corridorId.charCodeAt(0) * 31 + frameIndex) % 1000;
  return (h / 1000 - 0.5) * 0.08;
}

/** Returns congestion score [0..1] for a corridor at a given Date */
export function getCongestionScore(date, corridorId) {
  const hour = date.getHours();
  const dow = date.getDay();
  const isWeekend = dow === 0 || dow === 6;
  const profile = isWeekend ? WEEKEND_PROFILE : WEEKDAY_PROFILE;
  const base = profile[hour];
  const bias = CORRIDOR_BIAS[corridorId] ?? 1.0;
  // small frame-index noise using timestamp seconds
  const noise = corridorNoise(corridorId, Math.floor(date.getTime() / 3600000));
  return Math.min(1, Math.max(0, base * bias + noise));
}

/** Map congestion score to display color */
export function scoreToColor(score) {
  if (score < 0.32) return '#22C55E';  // green — fluido
  if (score < 0.55) return '#EAB308';  // yellow — lento
  if (score < 0.75) return '#F97316';  // orange — congestionado
  return '#EF4444';                     // red — muy congestionado
}

/** Map congestion score to label */
export function scoreToLabel(score) {
  if (score < 0.32) return 'Fluido';
  if (score < 0.55) return 'Lento';
  if (score < 0.75) return 'Congestionado';
  return 'Muy congestionado';
}

/** Map congestion score to approximate km/h */
export function scoreToSpeed(score) {
  return Math.round(80 - score * 72);
}

/** Generate hourly frames for the past 7 days up to now */
function generateFrames() {
  const frames = [];
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 7);
  start.setMinutes(0, 0, 0);
  for (let d = new Date(start); d <= now; d.setHours(d.getHours() + 1)) {
    frames.push(new Date(d));
  }
  return frames;
}

export function useTrafficReplay() {
  const [frames] = useState(() => generateFrames());
  const [currentIndex, setCurrentIndex] = useState(() => frames.length - 3);
  const [playing, setPlaying] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef(null);

  // Jump to live (latest frame)
  const goLive = useCallback(() => {
    setIsLive(true);
    setPlaying(false);
    setCurrentIndex(frames.length - 1);
  }, [frames.length]);

  // Exit live mode
  const exitLive = useCallback(() => {
    setIsLive(false);
  }, []);

  // Auto-advance playback
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!playing || isLive) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(i => {
        if (i >= frames.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 250);
    return () => clearInterval(intervalRef.current);
  }, [playing, isLive, frames.length]);

  // When user drags the slider, exit live mode
  const handleSetIndex = useCallback((idx) => {
    setIsLive(false);
    setCurrentIndex(idx);
    setPlaying(false);
  }, []);

  const currentFrame = frames[currentIndex] ?? frames[frames.length - 1];

  // Compute per-corridor scores for the current frame
  const corridorScores = useCallback(() => {
    return CORRIDORS.map(c => ({
      ...c,
      score: getCongestionScore(currentFrame, c.id),
    }));
  }, [currentFrame]);

  // Overall city congestion index (weighted average)
  const cityScore = useCallback(() => {
    const scores = CORRIDORS.map(c => getCongestionScore(currentFrame, c.id));
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [currentFrame]);

  // Hourly profile for current day (for the mini chart)
  const dayProfile = useCallback(() => {
    const base = new Date(currentFrame);
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 24 }, (_, h) => {
      const d = new Date(base);
      d.setHours(h);
      const score = CORRIDORS.map(c => getCongestionScore(d, c.id));
      const avg = score.reduce((a, b) => a + b, 0) / score.length;
      return { hour: h, score: avg };
    });
  }, [currentFrame]);

  return {
    frames,
    currentIndex,
    setCurrentIndex: handleSetIndex,
    playing,
    setPlaying,
    isLive,
    goLive,
    exitLive,
    currentFrame,
    corridorScores,
    cityScore,
    dayProfile,
  };
}

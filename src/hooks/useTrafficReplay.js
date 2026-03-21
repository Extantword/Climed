import { useState, useEffect, useRef, useCallback } from 'react';

// Medellín's main traffic corridors — coordinates from OpenStreetMap (ODbL)
// Each corridor traced with enough points to follow the actual road curves
export const CORRIDORS = [
  {
    id: 'autopista_norte',
    name: 'Autopista Norte (Av. Regional)',
    // OSM: Avenida Carrera 62/63 alt "Avenida Regional" — trunk road along the river valley
    positions: [
      [6.245799, -75.579135],
      [6.251490, -75.578255],
      [6.257017, -75.575038],
      [6.262561, -75.572297],
      [6.266798, -75.572303],
      [6.270239, -75.571534],
      [6.274335, -75.570470],
      [6.277767, -75.569703],
      [6.280862, -75.568069],
      [6.281684, -75.568052],
      [6.283092, -75.569084],
      [6.283956, -75.568713],
      [6.285284, -75.567997],
      [6.288177, -75.566252],
      [6.294026, -75.563409],
      [6.297950, -75.560120],
      [6.302042, -75.558341],
      [6.306793, -75.558270],
      [6.310896, -75.557181],
      [6.314995, -75.555641],
      [6.318008, -75.555572],
    ],
    weight: 6,
  },
  {
    id: 'regional_sur',
    name: 'Autopista Sur / Av. Regional',
    // OSM: Avenida Carrera 49 alt "Avenida Regional" — southern trunk
    positions: [
      [6.155979, -75.620186],
      [6.156604, -75.617894],
      [6.161533, -75.609014],
      [6.162613, -75.605557],
      [6.173994, -75.596915],
      [6.176805, -75.593193],
      [6.178453, -75.591805],
      [6.183738, -75.588301],
      [6.185126, -75.586895],
      [6.187375, -75.583878],
      [6.188210, -75.583159],
      [6.196746, -75.581282],
      [6.210000, -75.577800],
      [6.225000, -75.576500],
      [6.237573, -75.576211],
      [6.245799, -75.579135],
    ],
    weight: 6,
  },
  {
    id: 'guayabal',
    name: 'Av. Guayabal / Autopista Sur',
    // OSM: Avenida Carrera 42 alt "Autopista Sur"
    positions: [
      [6.167497, -75.607549],
      [6.169095, -75.605355],
      [6.169599, -75.604641],
      [6.172304, -75.600866],
      [6.172830, -75.600143],
      [6.174819, -75.597423],
      [6.176317, -75.595045],
      [6.177875, -75.593240],
      [6.178861, -75.592435],
      [6.184065, -75.589024],
      [6.185207, -75.587944],
      [6.187409, -75.585009],
      [6.188587, -75.583835],
      [6.189657, -75.583316],
      [6.193541, -75.582404],
      [6.196746, -75.581282],
    ],
    weight: 5,
  },
  {
    id: 'ferrocarril',
    name: 'Av. El Ferrocarril',
    // OSM: Avenida Carrera 55/57 alt "Avenida del Ferrocarril"
    positions: [
      [6.220000, -75.576400],
      [6.225000, -75.576200],
      [6.230000, -75.576000],
      [6.235000, -75.575800],
      [6.240000, -75.575600],
      [6.244074, -75.575459],
      [6.245527, -75.575418],
      [6.248408, -75.575097],
      [6.249263, -75.574979],
      [6.255000, -75.574200],
      [6.260000, -75.573500],
      [6.265000, -75.572800],
      [6.270000, -75.571800],
    ],
    weight: 5,
  },
  {
    id: 'calle80',
    name: 'Calle 80 / Metroplús',
    // OSM: Avenida 80 / Diagonal 80 / Carrera 80
    positions: [
      [6.261000, -75.607000],
      [6.261500, -75.602000],
      [6.262000, -75.598500],
      [6.263763, -75.596476],
      [6.264069, -75.596508],
      [6.266509, -75.595979],
      [6.278141, -75.588833],
      [6.278515, -75.588456],
      [6.278602, -75.588137],
      [6.278752, -75.587857],
      [6.279060, -75.587767],
      [6.279500, -75.587000],
      [6.281000, -75.585200],
      [6.283500, -75.582500],
      [6.285500, -75.580000],
      [6.287000, -75.578000],
    ],
    weight: 5,
  },
  {
    id: 'poblado',
    name: 'Av. El Poblado',
    // OSM: Carrera 43A alt "Avenida El Poblado"
    positions: [
      [6.173313, -75.586764],
      [6.173695, -75.586493],
      [6.176182, -75.585465],
      [6.192453, -75.576395],
      [6.193633, -75.576459],
      [6.194255, -75.576313],
      [6.194665, -75.576140],
      [6.195248, -75.575563],
      [6.198603, -75.573905],
      [6.211641, -75.570044],
      [6.212408, -75.569947],
      [6.226610, -75.569242],
      [6.226942, -75.569271],
      [6.228590, -75.569726],
      [6.234832, -75.570225],
    ],
    weight: 5,
  },
  {
    id: 'las_vegas',
    name: 'Av. Las Vegas',
    // OSM: Avenida Las Vegas alt Carrera 48 / Avenida Industriales
    positions: [
      [6.160315, -75.605712],
      [6.161412, -75.604108],
      [6.187786, -75.581434],
      [6.190117, -75.580414],
      [6.192841, -75.579987],
      [6.193147, -75.579757],
      [6.194665, -75.579457],
      [6.196696, -75.578563],
      [6.212880, -75.576343],
      [6.213680, -75.576136],
      [6.214962, -75.576148],
      [6.218460, -75.575672],
      [6.231866, -75.574413],
      [6.232878, -75.574546],
    ],
    weight: 5,
  },
  {
    id: 'oriental',
    name: 'Av. Oriental',
    // OSM: Carrera 46 alt "Avenida Oriental"
    positions: [
      [6.228923, -75.573673],
      [6.233102, -75.572811],
      [6.236453, -75.570246],
      [6.237450, -75.570314],
      [6.238385, -75.570588],
      [6.239721, -75.570330],
      [6.240974, -75.569580],
      [6.243150, -75.568731],
      [6.244084, -75.568757],
      [6.244305, -75.568117],
      [6.245405, -75.567315],
      [6.246584, -75.566685],
      [6.247551, -75.565956],
      [6.248281, -75.565410],
      [6.249173, -75.564593],
      [6.251154, -75.563490],
      [6.258434, -75.559041],
      [6.259033, -75.558638],
    ],
    weight: 5,
  },
  {
    id: 'calle30',
    name: 'Calle 30 / San Juan',
    // OSM: Calle 44 alt "San Juan" / "Avenida San Juan"
    positions: [
      [6.253998, -75.610196],
      [6.252223, -75.607363],
      [6.250688, -75.604546],
      [6.250613, -75.601337],
      [6.250062, -75.598279],
      [6.249955, -75.594513],
      [6.249236, -75.589312],
      [6.248699, -75.583498],
      [6.248188, -75.582182],
      [6.249000, -75.579159],
      [6.246856, -75.576877],
      [6.246150, -75.575734],
      [6.246279, -75.574625],
      [6.245516, -75.572473],
      [6.243818, -75.568302],
      [6.242225, -75.564112],
      [6.241346, -75.563032],
    ],
    weight: 5,
  },
  {
    id: 'colombia',
    name: 'Av. Colombia / Calle 50',
    // OSM: Carrera 70 + extended trace along Calle 50 through Laureles
    positions: [
      [6.262088, -75.584206],
      [6.261729, -75.584363],
      [6.261242, -75.584614],
      [6.260897, -75.584777],
      [6.260391, -75.585132],
      [6.259665, -75.585522],
      [6.258985, -75.585879],
      [6.258487, -75.586144],
      [6.257500, -75.586900],
      [6.256300, -75.587800],
      [6.255000, -75.588700],
      [6.253800, -75.589500],
      [6.252400, -75.590500],
      [6.251200, -75.591300],
      [6.249800, -75.592200],
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
  regional_sur: 1.05,
  guayabal: 0.90,
  ferrocarril: 0.88,
  calle80: 0.92,
  poblado: 1.00,
  las_vegas: 0.87,
  oriental: 0.95,
  calle30: 0.85,
  colombia: 0.82,
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

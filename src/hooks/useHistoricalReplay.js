import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchHistoricalPrecipitation } from '../api/openMeteoPrecip';

/**
 * Velocity presets: label shown in UI → interval in ms between frames.
 * Lower interval = faster playback.
 */
export const VELOCITY_PRESETS = [
  { label: '0.5×', ms: 1400 },
  { label: '1×', ms: 700 },
  { label: '2×', ms: 350 },
  { label: '4×', ms: 175 },
  { label: '8×', ms: 90 },
];

/**
 * Builds a time-indexed structure from Open-Meteo station data.
 */
function buildFrames(stationsData) {
  if (!stationsData.length) return { timeSlots: [], frames: new Map() };

  const timeSlots = stationsData[0]?.hourly?.time || [];
  const frames = new Map();

  timeSlots.forEach((t, i) => {
    const points = stationsData.map((station) => ({
      name: station.name,
      lat: station.lat,
      lng: station.lng,
      precip: station.hourly.precipitation?.[i] || 0,
      rain: station.hourly.rain?.[i] || 0,
      showers: station.hourly.showers?.[i] || 0,
      weathercode: station.hourly.weathercode?.[i] || 0,
    }));
    frames.set(t, points);
  });

  return { timeSlots, frames };
}

export function useHistoricalReplay() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [frames, setFrames] = useState(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [velocityIdx, setVelocityIdx] = useState(1); // default 1× speed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const velocity = VELOCITY_PRESETS[velocityIdx];

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistoricalPrecipitation();
      const { timeSlots: ts, frames: fr } = buildFrames(data);
      setTimeSlots(ts);
      setFrames(fr);
      // Start at the beginning (7 days ago) for replay
      setCurrentIndex(0);
    } catch (e) {
      setError(e.message);
      console.error('Historical replay load failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Playback animation — re-creates interval when velocity changes
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!playing || timeSlots.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => {
        const next = i + 1;
        if (next >= timeSlots.length) {
          setPlaying(false);
          return i;
        }
        return next;
      });
    }, velocity.ms);
    return () => clearInterval(intervalRef.current);
  }, [playing, timeSlots.length, velocity.ms]);

  const currentTimeSlot = timeSlots[currentIndex] || null;
  const currentPoints = frames.get(currentTimeSlot) || [];
  const currentTime = currentTimeSlot ? new Date(currentTimeSlot) : null;

  // Separate past vs forecast
  const now = new Date();
  const pastCount = timeSlots.filter((t) => new Date(t) <= now).length;
  const isForecasting = currentIndex >= pastCount;

  // Points at the most recent past time slot (closest to "now")
  const nowSlot = pastCount > 0 ? timeSlots[pastCount - 1] : null;
  const nowPoints = nowSlot ? (frames.get(nowSlot) || []) : [];

  return {
    timeSlots,
    currentIndex,
    setCurrentIndex,
    currentPoints,
    currentTime,
    nowPoints,
    pastCount,
    isForecasting,
    playing,
    setPlaying,
    velocityIdx,
    setVelocityIdx,
    velocity,
    loading,
    error,
    refetch: load,
  };
}

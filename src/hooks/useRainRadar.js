import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchRadarFrames } from '../api/rainViewer';

export function useRainRadar() {
  const [host, setHost] = useState('');
  const [past, setPast] = useState([]);
  const [nowcast, setNowcast] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const frames = [...past, ...nowcast];
  const pastCount = past.length;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRadarFrames();
      setHost(data.host);
      setPast(data.past);
      setNowcast(data.nowcast);
      // Start at the latest past frame (most recent real radar)
      setCurrentIndex(data.past.length - 1);
    } catch (e) {
      console.error('Failed to load radar:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Refresh radar data every 10 minutes
    const refresh = setInterval(load, 10 * 60 * 1000);
    return () => clearInterval(refresh);
  }, [load]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!playing || frames.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => {
        const next = i + 1;
        // Pause briefly at last frame before looping
        if (next >= frames.length) return 0;
        return next;
      });
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, [playing, frames.length]);

  const currentFrame = frames[currentIndex] || null;
  const isNowcast = currentIndex >= pastCount;

  const frameTime = currentFrame
    ? new Date(currentFrame.time * 1000)
    : null;

  return {
    host,
    frames,
    past,
    nowcast,
    pastCount,
    currentIndex,
    setCurrentIndex,
    currentFrame,
    frameTime,
    isNowcast,
    playing,
    setPlaying,
    loading,
    refetch: load,
  };
}

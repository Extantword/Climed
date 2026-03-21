import { useState, useEffect, useCallback } from 'react';
import { fetchDatosGovPrecipitation } from '../api/datosGov';
import { fetchIdeamPrecipitation } from '../api/ideamForecast';
import { fetchOpenMeteoPrecipitation, summarizePrecipitation } from '../api/openMeteoPrecip';

/**
 * Aggregates precipitation data from 3 open-data sources:
 *   1. datos.gov.co  — IDEAM station readings (Socrata SODA)
 *   2. IDEAM          — Precipitation dataset (s54a-sgyg)
 *   3. Open-Meteo     — Hourly precipitation across 8 Medellín points
 */
export function usePrecipitationData() {
  const [datosGov, setDatosGov] = useState({ data: [], loading: true, error: null });
  const [ideam, setIdeam] = useState({ data: [], loading: true, error: null });
  const [openMeteo, setOpenMeteo] = useState({ data: [], summary: [], loading: true, error: null });
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchAll = useCallback(async () => {
    // Fetch all 3 sources in parallel
    const [dgResult, ideamResult, omResult] = await Promise.allSettled([
      fetchDatosGovPrecipitation({ limit: 30 }),
      fetchIdeamPrecipitation({ limit: 30 }),
      fetchOpenMeteoPrecipitation(),
    ]);

    // datos.gov.co
    if (dgResult.status === 'fulfilled') {
      setDatosGov({ data: dgResult.value, loading: false, error: null });
    } else {
      console.warn('datos.gov.co fetch failed:', dgResult.reason?.message);
      setDatosGov({ data: [], loading: false, error: dgResult.reason?.message || 'Error' });
    }

    // IDEAM
    if (ideamResult.status === 'fulfilled') {
      setIdeam({ data: ideamResult.value, loading: false, error: null });
    } else {
      console.warn('IDEAM fetch failed:', ideamResult.reason?.message);
      setIdeam({ data: [], loading: false, error: ideamResult.reason?.message || 'Error' });
    }

    // Open-Meteo
    if (omResult.status === 'fulfilled') {
      const summary = summarizePrecipitation(omResult.value);
      setOpenMeteo({ data: omResult.value, summary, loading: false, error: null });
    } else {
      console.warn('Open-Meteo fetch failed:', omResult.reason?.message);
      setOpenMeteo({ data: [], summary: [], loading: false, error: omResult.reason?.message || 'Error' });
    }

    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    fetchAll();
    // Refresh every 15 minutes
    const interval = setInterval(fetchAll, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const loading = datosGov.loading || ideam.loading || openMeteo.loading;

  return {
    datosGov,
    ideam,
    openMeteo,
    loading,
    lastUpdate,
    refetch: fetchAll,
  };
}

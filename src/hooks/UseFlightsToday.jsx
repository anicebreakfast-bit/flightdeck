import { useEffect, useRef, useState } from 'react';
import { fetchFlightsToday } from '../api/flights';

export function UseFlightsToday(opts) {
  const [flights, setFlights] = useState([]);
  const [status, setStatus]   = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError]     = useState(null);
  const timerRef = useRef(null);

  async function load() {
    setStatus('loading');
    setError(null);
    try {
      const data = await fetchFlightsToday(opts);
      setFlights(data);
      setStatus('success');
    } catch (err) {
      setError(err);
      setStatus('error');
    }
  }

  useEffect(() => {
    // first load
    load();

    // refresh every 5 minutes
    timerRef.current = setInterval(load, 300_000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    
  }, [JSON.stringify(opts)]); // re-run if bounds/limit change

  return { flights, status, error, reload: load };
}

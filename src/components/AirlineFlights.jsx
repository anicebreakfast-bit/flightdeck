import { useEffect, useState } from 'react';
import { fetchFlightsByAirline } from '../api/flightsByAirline';

import '../css/flights.css'; 

function formatFlightLevel(flightLevel){
  if (flightLevel == null) return '—';
  const fl = Math.round(Number(flightLevel) / 100);
  return isFinite(fl) ? `FL${fl}` : '—';
}
 
export default function AirlineFlights({ airline, limit = 10, airlineName }) {
  const [flights, setFlights] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel = false;
    async function fetchDataFlights() {
      setStatus('loading'); 
      setError(null);
      try {
        let data = await fetchFlightsByAirline({ airline, limit: Math.max(limit, 50) }); 
        if (!cancel) {
          setFlights(data.slice(0, limit));
          setStatus('success');
        }
      } catch (error) {
        if (!cancel) { setError(error); setStatus('error'); }
      }
    }

    if (airline) fetchDataFlights();

    return () => { cancel = true; };
  }, [airline, limit]);

  if (status === 'loading') return (
    <section id="airline-flights" className="p-3">
      <p className="display-flex align-center text-lg text-white  text-center"><span>Loading {airlineName}…</span></p>
    </section>
  );
  if (status === 'error')   return (
    <section id="airline-flights" className="p-3">
      <p className="p-3 text-red-600">Failed: {String(error?.message || '')}</p>
    </section>
  );

  return (
    <section id="airline-flights" className="p-3"> 
      {flights.length === 0 ? (
          <h2 className="text-s text-white font-semibold mb-2 rounded-xl"> 
            {airlineName} has no current flights.
          </h2>  
      ) : (
        <div> 
          <h2 className="text-s text-white font-semibold mb-2 rounded-xl">
            {airlineName} has {flights.length} flight{flights.length !== 1 ? 's' : ''}.
          </h2> 
          <ul className="rounded-xl margin-y-16 flight-items-scroll">
            {flights.map((f, i) => (
              <li key={f.id || f.hex || f.callsign || i} className="rounded-xl text-white p-4 hover:bg-white/5 border mb-4">
                <div className="font-medium">{f.callsign || f.flightNumber || '—'}</div>
                <div className="opacity-80">{f.airline || '—'}</div>
                <div className="opacity-90">{(f.origin || '—') + ' → ' + (f.destination || '—')}</div>
                <div className="text-sm opacity-70">
                  {f.aircraft && <span>{f.aircraft}{f.reg ? ` (${f.reg})` : ''} • </span>}
                  {formatFlightLevel(f.altitude_ft)} • {Math.round(Number(f.speed_kt) || 0)} kt
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

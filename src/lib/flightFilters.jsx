const TOKYO_TZ = 'Asia/Tokyo';

// robust getter for various shapes
const get = (o, path) => path.split('.').reduce((v,k)=>v?.[k], o);

// true if any timestamp (sec/ms) is today in given TZ
export function isTodayInTZ(ts, tz = TOKYO_TZ){
  if (ts == null) return false;
  const ms = Number(ts) < 2_000_000_000 ? Number(ts) * 1000 : Number(ts);
  const d  = new Date(ms);
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year:'numeric', month:'2-digit', day:'2-digit' });
  const today = fmt.format(new Date());
  const that  = fmt.format(d);
  return today === that;
}

/** Try to read “origin/destination” IATA/ICAO in many possible shapes */
function readCodes(item){
  const originIata = get(item,'origin.iata') || get(item,'departure.iata') || item?.from || item?.dep?.iata;
  const destIata   = get(item,'destination.iata') || get(item,'arrival.iata') || item?.to || item?.arr?.iata;
  const originIcao = get(item,'origin.icao') || get(item,'departure.icao');
  const destIcao   = get(item,'destination.icao') || get(item,'arrival.icao');
  return { originIata, destIata, originIcao, destIcao };
}

/** Keep flights where route touches HND/RJTT */
export function filterForHaneda(items){
  return items.filter(f => {
    const { originIata, destIata, originIcao, destIcao } = readCodes(f);
    const routeStr = [originIata, destIata, originIcao, destIcao].map(v=>String(v||'').toUpperCase());
    return routeStr.includes('HND') || routeStr.includes('RJTT');
  });
}

/** Keep flights that are “today” in Tokyo based on any plausible scheduled/actual field */
export function filterForTodayJP(items){
  const fields = [
    'time.scheduled.departure', 'time.scheduled.arrival',
    'departure.scheduled', 'arrival.scheduled',
    'scheduled.departure', 'scheduled.arrival',
    'time.real.departure', 'time.real.arrival',
    'timestamp', 'updated'
  ];
  return items.filter(f => fields.some(p => isTodayInTZ(get(f, p))));
}

/** A small projector for UI */
export function toDisplay(item){
  const callsign = item?.callsign || get(item,'flight.number') || item?.ident || item?.code || '—';
  const airline  = item?.airline || get(item,'flight.airline.name') || item?.operator || '—';
  const { originIata, destIata } = (()=>{
    const o = get(item,'origin.iata') || get(item,'departure.iata') || item?.from;
    const d = get(item,'destination.iata') || get(item,'arrival.iata') || item?.to;
    return { originIata:o||'—', destIata:d||'—' };
  })();
  const aircraft = get(item,'aircraft.model') || item?.aircraft || item?.plane || '—';
  const alt = item?.altitude ?? item?.alt ?? null;
  const spd = item?.speed ?? item?.gs ?? null;
  return {
    id: item?.id || item?.hex || item?.icao || callsign,
    callsign, airline,
    route: `${originIata} → ${destIata}`,
    aircraft, alt, spd
  };
}

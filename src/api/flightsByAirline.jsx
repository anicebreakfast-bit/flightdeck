const HOST = 'flight-radar1.p.rapidapi.com';
const KEY  = import.meta.env.VITE_RAPIDAPI_KEY;

/** Map one row from the "aircraft" array-of-arrays into a readable object */
function mapAircraftRow(r) {
  if (!Array.isArray(r)) return null;
  return {
    // indexes based on the payload you posted
    id: r[0],               // internal id
    hex: r[1],              // transponder hex
    lat: r[2],
    lon: r[3],
    heading: r[4],          // deg
    altitude_ft: r[5],      // feet
    speed_kt: r[6],         // knots
    squawk: r[7] || null,
    src: r[8],              // radar/source
    aircraft: r[9],         // e.g., B789, B77W
    reg: r[10],             // registration (JAxxxA)
    lastSeen: r[11],        // epoch seconds
    origin: r[12] || null,  // IATA
    destination: r[13] || null, // IATA
    flightNumber: r[14] || null, // e.g., NH125
    onGround: r[15] === 1,
    verticalRate_fpm: r[16] || 0,
    callsign: r[17] || r[14] || null, // e.g., ANA125/NH125
    airline: r[19] || null, // e.g., ANA
  };
}

export async function fetchFlightsByAirline({ airline = 'ANA', limit = 20 }) {
  const url = new URL(`https://${HOST}/flights/list-by-airline`);
  url.searchParams.set('airline', airline);
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-key': KEY,
      'x-rapidapi-host': HOST,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  const json = await res.json();
  // Your payload = { full_count, version, aircraft: [ [...], ... ] }
  const rows = Array.isArray(json?.aircraft) ? json.aircraft : [];
  return rows.map(mapAircraftRow).filter(Boolean).slice(0, limit);
}

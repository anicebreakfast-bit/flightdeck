const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'flight-radar1.p.rapidapi.com';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

/** Bigger box around Haneda (HND/RJTT). radiusDeg=0.7 ≈ wide Tokyo Bay area */
export async function fetchFlightsNearHaneda({ radiusDeg = 0.7, limit = 500 } = {}) {
  const HND_LAT = 35.5533333333;
  const HND_LNG = 139.7811111111;

  const bl_lat = HND_LAT - radiusDeg;
  const bl_lng = HND_LNG - radiusDeg;
  const tr_lat = HND_LAT + radiusDeg;
  const tr_lng = HND_LNG + radiusDeg;

  const url = new URL(`https://${RAPIDAPI_HOST}/flights/list-in-boundary`);
  url.searchParams.set('bl_lat', String(bl_lat));
  url.searchParams.set('bl_lng', String(bl_lng));
  url.searchParams.set('tr_lat', String(tr_lat));
  url.searchParams.set('tr_lng', String(tr_lng));
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  const payload = await res.json();
  console.log('Raw payload from list-in-boundary:', payload); // <— inspect this

  const flights =
    Array.isArray(payload?.flights) ? payload.flights :
    Array.isArray(payload?.result)  ? payload.result  :
    Array.isArray(payload?.data)    ? payload.data    :
    [];

  return flights;
}

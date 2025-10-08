const HOST = 'flight-radar1.p.rapidapi.com';
const KEY  = import.meta.env.VITE_RAPIDAPI_KEY;

function pickLogoUrl(logoList, meta = {}) {
  const icao = (meta.icao || '').toUpperCase();
  const iata = (meta.code || '').toUpperCase();
  const name = (meta.name || '').toUpperCase();
  const airlineId = meta.airlineId ? String(meta.airlineId) : null;

  const items = Array.isArray(logoList) ? logoList : [];

  // helpers
  const has = (n, token) => n.includes(token);
  const by = (pred) => items.find(x => {
    const n = (x?.file?.name || '').toUpperCase();
    return pred(n, x);
  });

  // 1) Prefer explicit ICAO in filename (common pattern: IATA_ICAO.png)
  const icaoHit = by(n =>
    has(n, `_${icao}.`) || has(n, `-${icao}.`) || has(n, `${icao}.`) ||
    has(n, `_${icao}_`) || has(n, `${icao}_`) || has(n, `_${icao}-`)
  );
  if (icaoHit?.file?.url) return icaoHit.file.url;

  // 2) Try IATA (sometimes only IATA is present)
  const iataHit = by(n =>
    has(n, `_${iata}.`) || has(n, `-${iata}.`) || has(n, `${iata}.`) ||
    has(n, `_${iata}_`) || has(n, `${iata}_`) || has(n, `_${iata}-`)
  );
  if (iataHit?.file?.url) return iataHit.file.url;

  // 3) Numeric id (some airlines use a numeric asset name, e.g., "3088.png")
  if (airlineId) {
    const idHit = items.find(x => (x?.file?.name || '').startsWith(airlineId));
    if (idHit?.file?.url) return idHit.file.url;
  }

  // 4) Prefer PNG if multiple
  const pngHit = items.find(x => x?.file?.name?.toLowerCase().endsWith('.png'));
  if (pngHit?.file?.url) return pngHit.file.url;

  // 5) Fallback to first
  return items[0]?.file?.url ?? null;
}

export async function fetchAirlineLogosByList(airlineList = []) {
  const out = [];

  for (const airline of airlineList) {
    const url = new URL(`https://${HOST}/airlines/get-logos`);
    url.searchParams.set('airline', airline.name); // query by name

    try {
      const res = await fetch(url.toString(), {
        headers: {
          'x-rapidapi-key': KEY,
          'x-rapidapi-host': HOST,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      // The payload you logged shows: { result: { response: { airlines: { item, logotypes }}}}
      const response = json?.result?.response;
      const item = response?.airlines?.item ?? null;
      const logoList = response?.airlines?.logotypes ?? [];

      // In case you’re on a different version, keep fallbacks:
      const logos =
        Array.isArray(logoList) ? logoList
        : json?.airlines?.logotypes ?? json?.logos ?? [];

      // Pull a numeric id if available (helps with files like "3088.png")
      const airlineId =
        item?.id ?? item?.airlineId ?? item?.aid ?? null;

      const logoUrl = pickLogoUrl(logos, {
        name: airline.name,
        icao: airline.icao,
        code: airline.code,
        airlineId,
      });

      // Debug so you can see why a match failed
      console.log(
        `🧩 ${airline.name} (${airline.icao}) →`,
        { airlineId, picked: logoUrl, files: logos.map(l => l?.file?.name) }
      );

      out.push({ ...airline, logoUrl });
    } catch (err) {
      console.error(`❌ Logo fetch failed for ${airline.name}`, err);
      out.push({ ...airline, logoUrl: null });
    }
  }

  return out;
}
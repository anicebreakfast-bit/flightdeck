import { useEffect, useState } from 'react';

import { AIRLINE_LIST } from "../data/AirlineList.jsx";
import { fetchAirlineLogosByList } from "../api/airlinelogos.jsx";


function AirlineDropdown({ onChange, value }) {
  function handleChange(e) {
    const selectedCode = e.target.value;
    const selectedAirline = AIRLINE_LIST.find(a => a.code === selectedCode); 

    // Pass both code and name (or full object) to parent
    onChange({
      code: selectedAirline.code,
      name: selectedAirline.name,
    });
  }

  return (
    <select
      className="bg-white text-gray-800 p-2 border rounded-md"
      value={value}
      onChange={handleChange}
    >
      {AIRLINE_LIST.map(airline => (
        <option key={airline.icao} value={airline.code}>
          {airline.name} ({airline.code})
        </option>
      ))}
    </select>
  );
}


export default AirlineDropdown; 

{/*

export default function AirlineLogosGrid() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLogos() {
      setLoading(true);
      const data = await fetchAirlineLogosByList(AIRLINE_LIST);
      setLogos(data);
      setLoading(false);
    }

    loadLogos();
  }, []);

  if (loading) return <p>Loading airline logos...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {logos.map(a => (
        <div key={a.icao} className="text-center">
          {a.logoUrl ? (
            <img src={a.logoUrl} alt={a.name} className="mx-auto h-10 object-contain" />
          ) : (
            <div className="h-10 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              No logo
            </div>
          )}
          <p className="mt-1">{a.name}</p>
        </div>
      ))}
    </div>
  );
}

*/} 
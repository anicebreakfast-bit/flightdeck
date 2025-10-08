import { useState, useRef, useContext } from 'react';
import './App.css';
import FlightItems from './components/FlightItems.jsx';
import { FLIGHT_LIST } from './data/FlightList.jsx';
import FlightDetails from './components/FlightDetails.jsx';
import Header from './components/Header.jsx';
import NewFlight from './components/NewFlight.jsx';
import { ThemeContext } from './store/ThemeCtx.jsx';
import { FlightContext } from "./store/FlightCtx.jsx";
import { StaffContext } from './store/StaffCtx.jsx';  
import AirlineFlights from './components/AirlineFlights.jsx'; 
import AirlinePicker from './components/AirlinePicker';
import { AIRLINE_LIST } from './data/AirlineList.jsx';

import Staff from './components/Staff.jsx'

function App() { 
  const themeCtx = useContext(ThemeContext);
  
  const {
    dialog,
    handleNewFlight,
    addFlight,
    handleSelectDropdown,
    clearFilter,
    isFlightsFiltered,
    arrivalRoute,
    filterLabel,
    filterRoute,
    handleClearFilter,
    flightFindByRoute,
    selectedFlight,
    findFlightByNum,
    handleClickDepartureRoute,
    handleClickArrivalRoute,
    handleClickFlightItem,
    isFlightsDetailedClicked,
    handleFlightDetailClick, 
  } = useContext(FlightContext);

  const { 
    handleResetStaffAll,
  } = useContext(StaffContext);

  const { flights } = useContext(FlightContext);
 
  const [newFlights, setFlights] = useState([]);
  const modalRef = useRef(); 

  const defaultAirline = AIRLINE_LIST.find(a => a.icao === "ANA");
  const [selectedAirline, setSelectedAirline] = useState(defaultAirline);

  function handleAddFlight(newFlight) {
    setFlights((prev) => [...prev, newFlight]);  
  }

  return ( 
    <div id="flight-app" className={themeCtx.theme}> 
      <div className="flight-list">
        <NewFlight onAddNewFlight={handleNewFlight} onAdd={addFlight}/> 
        <div id="flights-dropdown"> 
          <label>Search by Flights</label>
          <select onChange={handleSelectDropdown}> 
            {
              FLIGHT_LIST.map(flight => (
                  <option key={flight.flightNum}>{flight.departure}</option>  
              ))
            }
          </select>
        </div> 
        <div id="filter">
          <div id="filter-list">  
            <p id="filter-label">Filter: </p>
            { (clearFilter && isFlightsFiltered) ? ( 
              <div>
                <div className={`filter-item ${arrivalRoute ? 'arrival-item' : 'departure-item'}`}>{`${filterLabel} ${filterRoute}`}</div> 
              </div>
            ) : (
              <><p>No Filters</p></>
            )}
          </div> 
          { filterRoute && <button onClick={handleClearFilter}>Clear Filter</button> }
        </div>
        <div id="flight-items">  
          {flights.map(flight => (
            <FlightItems
              key={flight.flightNum}
              flightNum={flight.flightNum}
              departure={flight.departure}
              arrival={flight.arrival}
              date={flight.date}
              time={flight.time}
              status={flight.status}
              groundStatus={flight.groundStatus}
              handleClickDepartureRoute={() => handleClickDepartureRoute(flight.departure)}
              handleClickArrivalRoute={() => handleClickArrivalRoute(flight.arrival)}
              isFlightSelected={selectedFlight === flight.flightNum}
              onClick={() => handleClickFlightItem(flight.flightNum)}
            />
          ))} 
        </div>
      </div> 
      <div id="flight-main"> 
        <Header />
        <main> 
          <div className="display-flex align-center flex-direction-column justify-space-between mb-3">
            <AirlinePicker value={selectedAirline?.code} onChange={setSelectedAirline} />
            <AirlineFlights airline={selectedAirline?.code} airlineName={selectedAirline?.name} limit={20} />  
          </div>
          <div className="staff-log"> 
            <h2 className="text-white">Active Staff</h2>
            <button className="staff-reset" onClick={handleResetStaffAll}>Reset Staff Count</button>
            <Staff staffLabel="GND"/>
            <Staff staffLabel="TWR"/>
            <Staff staffLabel="APP"/>
            <Staff staffLabel="DEP"/> 
          </div>  
          <div className="flight-log">
            {selectedFlight && (
              <FlightDetails
                flightNum={selectedFlight}
                departure={findFlightByNum.departure}
                arrival={findFlightByNum.arrival}       
                departureTime={findFlightByNum.departureTime}
                arrivalTime={findFlightByNum.arrivalTime}
                flightDuration={findFlightByNum.duration}
                departureGate={findFlightByNum.departureGate}
                arrivalGate={findFlightByNum.arrivalGate}
                onDetailsClick={handleFlightDetailClick}
                isViewingMoreDetails={isFlightsDetailedClicked} 
              />
            )} 
          </div>
        </main>
      </div>
    </div> 
  );
}

export default App;

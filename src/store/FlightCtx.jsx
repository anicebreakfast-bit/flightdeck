import { createContext, useRef, useState, useReducer } from "react";
import { FLIGHT_LIST } from "../data/FlightList.jsx";

export const FlightContext = createContext(null);

const initialState = {
  flights: FLIGHT_LIST, // seed from your static list once
};
 

function flightReducer(state, action) {
  switch (action.type) {
    case "ADD_FLIGHT": {
      const exists = state.flights.some(flight => flight.flightNum === action.payload.flightNum);
      const next = exists
        ? state.flights.map(flight =>
            flight.flightNum === action.payload.flightNum ? { ...flight, ...action.payload } : flight
          )
        : [action.payload, ...state.flights];
      return { ...state, flights: next };
    }
    case "REMOVE_FLIGHT": {
      return {
        ...state,
        flights: state.flights.filter(flight => flight.flightNum !== action.payload),
      };
    }
    case "UPDATE_FLIGHT": {
      return {
        ...state,
        flights: state.flights.map(flight =>
          flight.flightNum === action.payload.flightNum ? { ...flight, ...action.payload } : flight
        ),
      };
    }
    case "RESET_FLIGHTS":
      return { 
        ...state, 
        flights: FLIGHT_LIST 
    };
    default:
      return state;
  }
}

export default function FlightContextProvider({ children }) {

  const [{ flights }, dispatch] = useReducer(flightReducer, initialState);

  // state
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isFlightsDetailedClicked, setIsFlightDetailedClicked] = useState(false);

  const [isDepartureRouteClicked, setIsDepartureRouteClicked] = useState(false);
  const [isArrivalRouteClicked, setIsArrivalRouteClicked] = useState(false);

  const [departureRoute, setDepartureRoute] = useState(null);
  const [arrivalRoute, setArrivalRoute] = useState(null);

  const [filterRoute, setFilterRoute] = useState(null);
  const [isFlightsFiltered, setIsFlightsFiltered] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);

  const dialog = useRef();

  function addFlight(flight) {
    dispatch({ type: "ADD_FLIGHT", payload: flight });
  }
  function removeFlight(flightNum) {
    dispatch({ type: "REMOVE_FLIGHT", payload: flightNum });
    if (selectedFlight === flightNum) setSelectedFlight(null);
  }
  function updateFlight(partialFlight) {
    dispatch({ type: "UPDATE_FLIGHT", payload: partialFlight });
  }

  // handlers
  function handleFlightDetailClick() {
    setIsFlightDetailedClicked((prev) => !prev);
  }

  function handleClearFilter() {
    setClearFilter(true);
    setIsDepartureRouteClicked(false);
    setIsArrivalRouteClicked(false);
    setIsFlightsFiltered(false);
    setFilterRoute(null);
    setDepartureRoute(null);
    setArrivalRoute(null);
  }

  function handleClickFlightItem(flightNum) {
    // toggle select/deselect by id (no separate isFlightSelected state)
    setSelectedFlight((curr) => (curr === flightNum ? null : flightNum));
  }

  function handleClickDepartureRoute(route) {
    if (arrivalRoute) setArrivalRoute(null);
    setIsDepartureRouteClicked((prev) => !prev);
    setIsFlightsFiltered(true);
    if (!isFlightsFiltered) setClearFilter(true);
    setDepartureRoute(route);
    setFilterRoute(route);
  }

  function handleClickArrivalRoute(route) {
    if (departureRoute) setDepartureRoute(null);
    setIsArrivalRouteClicked((prev) => !prev);
    setIsFlightsFiltered(true);
    if (!isFlightsFiltered) setClearFilter(true);
    setArrivalRoute(route);
    setFilterRoute(route);
  }

  function handleSelectDropdown(e) {
    const value = e.target.value;
    setFilterRoute(value);
    setIsFlightsFiltered(true);
    if (!isFlightsFiltered) setClearFilter(true);
    // reset toggles so dropdown is the source of truth
    setDepartureRoute(null);
    setArrivalRoute(null);
    setIsDepartureRouteClicked(false);
    setIsArrivalRouteClicked(false);
  }

  function handleNewFlight() {
    // assumes your ModalNewFlight exposes .open()
    dialog.current?.open?.();
  }
  

  // -------- derived values (computed directly; no useMemo) --------
  let flightFindByRoute = flights;
  if (isFlightsFiltered && filterRoute) {
    flightFindByRoute = flights.filter(
      (flight) => flight.arrival === filterRoute || flight.departure === filterRoute
    );
  }

  const findFlightByNum = flights.find((flight) => flight.flightNum === selectedFlight);

  const filterLabel = arrivalRoute ? "Arrivals at" : "Departures from";

  const value = {
    flights,
    selectedFlight,
    isFlightsDetailedClicked,
    isDepartureRouteClicked,
    isArrivalRouteClicked,
    departureRoute,
    arrivalRoute,
    filterRoute,
    isFlightsFiltered,
    clearFilter,

    // derived
    flightFindByRoute,
    findFlightByNum,
    filterLabel,

    // handlers
    handleFlightDetailClick,
    handleClearFilter,
    handleClickFlightItem,
    handleClickDepartureRoute,
    handleClickArrivalRoute,
    handleSelectDropdown,
    handleNewFlight,
    
    // flights
    addFlight,
    removeFlight,
    updateFlight,

    // refs
    dialog,
  };

  return <FlightContext.Provider value={value}>{children}</FlightContext.Provider>;
}
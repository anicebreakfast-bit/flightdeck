import { useState, useRef } from 'react';
import React from 'react';
import '../css/flights.css';  
import { FLIGHT_LIST } from '../data/FlightList.jsx'; 
import GroundStatus from './GroundStatus.jsx';


export default function FlightItems({ 
  flightNum, 
  departure, 
  arrival, 
  date, 
  time, 
  status, 
  className, 
  isFlightSelected, 
  handleClickDepartureRoute, 
  handleClickArrivalRoute, 
  groundStatus,
  ...props 
}) {

let itemClassNames = `flight-item ${className ? className : ''} ${isFlightSelected ? 'selected' : ''}`;

const [flightStat, setFlightStatus] = useState(status || 'On Time');
const [statusEditing, setStatusEditing] = useState(false);
const [groundStatusState, setGroundStatusState] = useState('');
const [currentEditing, setCurrentEditing] = useState(null);

const [flightItems, setFlightItems] = useState(FLIGHT_LIST);

const groundStatusRef = useRef();
const statusWrapperRef = useRef();
  

function handleIsEditing(e){
  setStatusEditing((statusEdit) => !statusEdit);  
  if(!statusEditing){ 
    setFlightStatus(flightStat);
    //updateFlightListStatus(flightNum, flightStat);
  }
}

function handleChangeStatus(e){
  setFlightStatus(e.target.value);
}

function handleGroundStatusCheck(e){  
  e.stopPropagation();
  if(groundStatusRef.current.classList.contains('closed')){
    groundStatusRef.current.classList.remove('closed');
  } else {
    groundStatusRef.current.classList.add('closed');
  }
}

/*
function updateFlightStatus(flightNum, flightStat) {
  setFlightItems(prevItems => 
    prevItems.map(item => 
      item.flightNum === flightNum ? { ...item, status: flightStat } : item
    )
  ); 
}

function updateFlightListStatus(flightNum, flightStat) { 
  updateFlightStatus(flightNum, flightStat);
}
*/

let flightStatus; 

if(statusEditing){ 
  flightStatus = <span><p>Status: </p><input type="text" required value={flightStat} placeholder="Enter status" onChange={handleChangeStatus} /></span>
} else { 
  flightStatus = <p>Status: {flightStat}</p>
}

if(groundStatus === null){
  groundStatus = "Filed"
}

  return (  
      <div className={itemClassNames} {...props}>
        <div className="flight-header">
          <h2>{flightNum}</h2>
          <div className="flight-route">
            <p onClick={handleClickDepartureRoute}>{departure}</p> <p onClick={handleClickArrivalRoute}>{arrival}</p>
          </div>
        </div>  
        <div className={`status-wrapper ${statusEditing ? 'editing' : ''}`} ref={statusWrapperRef}>
          { flightStatus }
          <button onClick={handleIsEditing}>{ statusEditing ? 'Save Status' : 'Edit Status' }</button>
        </div>

          <div className="ground-status-content"><GroundStatus/></div>
        <div className="ground-status closed" ref={groundStatusRef}>
          <div className="ground-status-wrapper" onClick={handleGroundStatusCheck}><p>Check Ground Status</p> <span className="arrow"></span></div>
        </div>
        
      </div>  
  );
}
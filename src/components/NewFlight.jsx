import { useContext } from 'react';
import NewFlightModal from '../modal/NewFlight.jsx';  
import { FlightContext } from "../store/FlightCtx.jsx";

export default function NewFlight({ flights, onAddNewFlight }) {
 
    const {
        dialog,
        addFlight,
        handleNewFlight
    } = useContext(FlightContext);

    return (
        <div className="add-new-flight-wrapper">
            <button className='add-new-flight' onClick={handleNewFlight}>+ Add New Flight</button>
            <div id="modal-root reset">
                <NewFlightModal ref={dialog} onAddFlight={addFlight} />
            </div> 
            {/*
            {flights.map((flight, index) => (
                <div className="flight-item" key={index}>{flight}</div>
            ))} 
            */}
        </div>
    )
}
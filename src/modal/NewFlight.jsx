import { forwardRef, useImperativeHandle, useRef} from "react"; 
import Input from "../components/Input.jsx";
import Dropdown from "../components/Dropdown.jsx";
import { AIRPORT_LIST } from "../data/AirportList.jsx";

const NewFlightModal = forwardRef(function NewFlightModal({ onAddFlight }, ref) {    
    const dialog = useRef();
    const formRef = useRef();

    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            },
            close() {
                dialog.current.close();
            }
        }
    });

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const newFlight = Object.fromEntries(formData.entries()); 

        const allFilled = Object.values(newFlight).every(value => value.trim() !== "");

        if (!allFilled) {
            alert("Please fill in all fields.");
            return;
        }

        const flightWithDefaults = {
            groundStatus: "Filed",  
            ...newFlight
        };

        onAddFlight(flightWithDefaults);   
 
        formRef.current.reset(); 
        dialog.current.close();   
    } 
     
    return(
        <dialog ref={dialog} className="new-flight-modal p-2" style={{all: 'revert'}}>
            <form onSubmit={handleSubmit} ref={formRef}>
                <h2>Add New Flight</h2>
                <div className="form-group mt-4">
                    <Input label="Flight Number" name="flightNum" type="text" placeholder="AB123"/> 
                    <Dropdown label="Departure From" name="departure" id="departureFlight" placeholder="ABC" defaultValue=""> 
                        {
                            AIRPORT_LIST.map(airport => (
                                <option key={airport.code} value={airport.code}>{airport.code}</option>  
                            ))
                        } 
                    </Dropdown>
                    <Dropdown label="Arrival To" name="arrival" id="arrivalFlight" placeholder="CDE" defaultValue=""> 
                        {
                            AIRPORT_LIST.map(airport => (
                                <option key={airport.code} value={airport.code}>{airport.code}</option>  
                            ))
                        } 
                    </Dropdown> 
                    <Input label="Date" name="date" type="date" placeholder="MM/DD/YYYY" />
                    <Input label="Departure Time" name="departureTime" type="time" placeholder="00:00" />
                    <Input label="Arrival Time" name="arrivalTime" type="time" placeholder="00:00" />
                    <Input label="Departure Gate" name="departureGate" type="text" placeholder="A1" />
                    <Input label="Arrival Gate" name="arrivalGate" type="text" placeholder="B2" />
                    <Input label="Status" name="status" type="text" placeholder="On Time" />
                </div>
                <button type="submit">Add Flight</button>
            </form>
            <button className="modal-close" onClick={() => dialog.current.close()}>&times;</button>
        </dialog>
    );
});

export default NewFlightModal;
import FlightItems from './FlightItems'; 
import { styled } from 'styled-components';

const FlexDiv = styled.div` 
    display: flex;
    justify-content: space-between;
    align-items: center;  
    & h2,
    & p{
        margin: 0;
        padding: 0;
    }
`

const FlightDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    text-align: center;
    margin: 20px 0 20px;
    flex: 1;
    background: #00000035;
    border-radius: 10px;
    padding: 8px;

    & strong,
    & p {
        color: #ffffff;
        margin: 0;
    }
    strong{
        font-size: 2.4em
    }
    p{
        font-size: 1.2em
    }
`

const InnerDetails = styled.div`
  & p{
    background: #0000008a;
    padding: 5px 12px;
    margin: 1px 0;
    color: #a8a8a8;
  }
`

export default function FlightDetails({
    flightNum, 
    departure, 
    arrival, 
    departureTime, 
    arrivalTime, 
    flightDuration, 
    departureGate, 
    arrivalGate, 
    className,
    onDetailsClick,
    flightDetailsClass,
    isViewingMoreDetails,
...props}){
 
    let flightDetailsDivClass = `flight-details ${isViewingMoreDetails ? 'checked' : ''} ${className ? className : ''}`;

    let flightDetails = ( 
        <div className={flightDetailsDivClass} {...props}>
            { !isViewingMoreDetails ? ( 
                <div className={`inner-details ${isViewingMoreDetails ? 'hide' : 'show'}`}> 
                    <FlexDiv>
                        <h2>Flight {flightNum}</h2> 
                        <p>Boeing 737-800</p> 
                    </FlexDiv>
                    <div className='flight-route-wrapper'>
                        <FlightDiv>
                            <strong>{departureTime}</strong>
                            <p>{departure}</p>
                        </FlightDiv>
                        <i className="fa-solid fa-plane"></i>
                        <FlightDiv>
                            <strong>{arrivalTime}</strong>
                            <p>{arrival}</p>
                        </FlightDiv>
                    </div> 
                    <button onClick={onDetailsClick}>See More Details</button>
                </div>
            ) : (
                <InnerDetails className={`inner-details ${isViewingMoreDetails ? 'show' : 'hide'}`}> 
                    <h2>Flight {flightNum}</h2> 
                    <p><strong>Duration:</strong> {flightDuration}</p>
                    <p><strong>Departure Gate:</strong> {departureGate}</p>
                    <p><strong>Arrival Gate:</strong> {arrivalGate}</p>
                    <button onClick={onDetailsClick}>Back</button>
                </InnerDetails>
            )
            } 
        </div> 
    )
    return (
        <>
            {flightDetails}
        </>
    );
}
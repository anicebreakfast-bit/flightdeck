import { useState } from 'react'
import GROUNDSTATUS_LIST from '../data/GroundStatusList.jsx'

export default function GroundStatus(){
    const [activeIndex, setActiveIndex] = useState(0);  
    function handlePrev() {
        setActiveIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : GROUNDSTATUS_LIST.length - 1
        );
    }

    function handleNext() {
        setActiveIndex((prevIndex) => 
            prevIndex < GROUNDSTATUS_LIST.length - 1 ? prevIndex + 1 : 0
        );
    }

    function handleGroundClick(e){
        e.stopPropagation();
    }

    return (
        <div id="ground-status" onClick={handleGroundClick}>
            <button onClick={handlePrev} disabled={activeIndex === 0}>←</button>
            <p>{GROUNDSTATUS_LIST[activeIndex].name}</p>
            <button onClick={handleNext} disabled={activeIndex === GROUNDSTATUS_LIST.length - 1}>→</button>
        </div>
    )
}
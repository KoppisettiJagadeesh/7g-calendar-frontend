import React, { useState, useRef, useContext } from 'react'
import { OverlayPanel } from 'primereact/overlaypanel';
import { CalendarContext } from './Calendar.Context';
import gaugepng from "../../assets/images/gauge.png"
import eventGrouping from "../../assets/images/event-group.svg"
function CalendarEvent(props) {
    const { eventType, dataTip, eventCount, eventHeader, eventText, eventImg} = props;
    const panelRef = useRef(null);
    const { calendarType } = useContext(CalendarContext);
    const handleMouseOver = (e) => {
        e.isDefaultPrevented();
        if(calendarType?.name === "Week" &&  eventCount < 15 || calendarType.name ==="Month" && eventCount < 5 || calendarType.name !=="Day"){
            panelRef.current?.show(e, e.target);
            const showOverLay = ()=>{
            const overlayPanel = document.getElementById("event-info");
            if (overlayPanel) {
                // overlayPanel.style.left = e.clientX + 18 + "px"
                // overlayPanel.style.top = e.clientY - 15 + "px"
                overlayPanel.style.opacity = 1
            }
         }
         setTimeout(showOverLay(), 200);
        }
    };

    const handleMouseOut = (e) => {
        e.isDefaultPrevented();
        panelRef.current?.hide();
    };
    return (
        <>
            <div className={`event ${eventType} mt-1`} data-for="event-info"
                onMouseMove={handleMouseOver}
                onMouseLeave={handleMouseOut}>
                <span className='event-header'>
                    {<img src={eventImg}></img>}
                    <span className='event-header-text'>
                        {eventHeader}
                    </span>
                    <span className='crc'>
                        { eventCount > 1 ? eventCount : ""}
                    </span>
                </span>
                <span className='event-text'>
                    {eventText}
                </span>
            </div>
            <OverlayPanel id="event-info" className="protean-tooltip prime-tooltip" ref={panelRef}>
                {
                    dataTip?.map((data) => (
                        <div key={data.id} className="event-tooltip">
                            <div className="event-title">{data.name}</div>
                            <div className="event-type">{data.title}</div>
                        </div>
                    ))
                }
            </OverlayPanel>
        </>
    )
}

export default CalendarEvent
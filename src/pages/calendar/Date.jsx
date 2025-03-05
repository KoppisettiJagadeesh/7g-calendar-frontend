import { Button } from 'primereact/button';
import React, { useContext, useState, useRef } from 'react'
import { CalendarContext } from './Calendar.Context';
import { OverlayPanel } from 'primereact/overlaypanel';
function Date(props) {
    const { calendarType } = useContext(CalendarContext);
    const [tooltip, setTooltip] = useState('');
    const { data } = props;
    const panelRef = useRef(null);

    const getEventType = (client) => {
        let count = false, items = Object.values(client?.items);
        items?.forEach(element => {
            element?.length > 1 ? count = true : ""
        });
        return count ? "grouped" : "single";
    }
    const getEventText = (data) => {
        let count = false, items = Object.values(data), text = "Multiple items";
        items?.forEach(element => {
            element.length > 1 ? count = true : ""
        });
        if (count) {
            return text;
        } else {
            items?.forEach(element => {
                if (element?.length > 0) {
                    text = element[0]?.title;
                }
            })
            return text;
        }
    }
    const getEventCounts = (value) => {
        let items = Object.values(value), count = 0;
        items?.forEach(element => {
            if (element?.length > 0) {
                count += element.length;
            }
        })
        return count;
    }
    const dataTipData = (value) => {
        let data = [], name = value?.name, items = Object.entries(value?.items);
        items?.forEach(([key, values]) => {
            if (values?.length > 0) {
                values.forEach(element => {
                    data.push({ id: element?.id, planned_date: element?.planned_date, title: element?.title, name: name, type: key })
                });
            }
        });
        return JSON.stringify(data);
    }
    const handleMouseOver = (e) => {
        e.isDefaultPrevented();
        const tooltipText = e.target.closest('[data-tip]').getAttribute('data-tip');
        setTooltip(JSON.parse(tooltipText));
        panelRef.current?.show(e, e.target);
        const overlayPanel = document.getElementById("event-info");
        if (overlayPanel) {
            overlayPanel.style.left = e.clientX + 18 + "px"
            overlayPanel.style.top = e.clientY - 15 + "px"
            overlayPanel.style.opacity = 1
        }
    };

    const handleMouseOut = (e) => {
        e.isDefaultPrevented();
        panelRef.current?.hide();
    };

    return (
        <>
            <div className={`calendar-body ${calendarType?.name}`}>
                <div className='calendar-col'>
                    {
                        data?.map((client, index) => {
                            if (index < 7) {
                                return (
                                    <div key={client?.id} className={`event ${getEventType(client)} mt-1`} data-for="event-info"
                                        data-tip={`${dataTipData(client)}`} onMouseMove={handleMouseOver}
                                        onMouseLeave={handleMouseOut}>
                                        <span className='event-header'>
                                            {/* svg */}
                                            <span className='event-header-text'>
                                                {client?.client?.name}
                                            </span>
                                            <span className='crc'>
                                                {getEventType(client) === "grouped" ? getEventCounts(client?.items) : ""}
                                            </span>
                                        </span>
                                        <span className='event-text'>
                                            {getEventText(client?.items)}
                                        </span>
                                    </div>)
                            } else {
                                return null
                            }
                        }
                        )
                    }
                </div>
                <OverlayPanel id="event-info" className="protean-tooltip prime-tooltip" ref={panelRef}>
                    {
                        tooltip && tooltip?.map((data) => (
                            <div key={data.id} className="event-tooltip">
                                <div className="event-title">{data.name}</div>
                                <div className="event-type">{data.title}</div>
                            </div>
                        ))
                    }
                </OverlayPanel>
            </div>
            <div className={`calendar-footer ${calendarType?.name} false`}>
                <div className="calendar-col">
                    <div className='facility-row'>
                        <div className='calendar-item'>
                            {
                                Object.values(data).length > 6 && <button type="button" className='proteam-btn'>View more</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Date;
import { Button } from 'primereact/button';
import React, { useContext, useState, useRef } from 'react'
import { CalendarContext } from './Calendar.Context';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from 'primereact/dialog';
function Date(props) {
    const moment = require("moment");
    const { calendarType } = useContext(CalendarContext);
    const [tooltip, setTooltip] = useState('');
    const { dayDate,data } = props;
    const panelRef = useRef(null);
    const [weekData] = useState(data);
    const [visible, setVisible] = useState(false);
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
        const showOverLay = () => {
        const overlayPanel = document.getElementById("event-info");
        if (overlayPanel) {
            // overlayPanel.style.left = e.clientX + 18 + "px"
            // overlayPanel.style.top = e.clientY - 15 + "px"
            overlayPanel.style.opacity = 1
        }
    }
        setTimeout(showOverLay, 100)
    };

    const handleMouseOut = (e) => {
        e.isDefaultPrevented();
        panelRef.current?.hide();
    };
   const Header =()=>{
    return(
        <div className ="card-header header-elements-inline">
        <div className="card-title">{moment(dayDate).format("dddd, MMMM YY")}</div>
       </div>
    )
   }
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
                                Object.values(data).length > 6 && <Button type="button" className='proteam-btn' onClick = {()=>setVisible(true)}>View more</Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Dialog header={Header} visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>
                <div className ="card mb-0 flex-fill base-modal">
                <div className ="card-body events">
                 <div className ="search-input">
                  <input className="protean-default-input" placeholder="Search" type="text"></input>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><g fill="none" fill-rule="evenodd"><path d="M0 0L20 0 20 20 0 20z"></path><path class="search-icon-path" fill="#616674" d="M12.917 11.667h-.659l-.233-.225c.817-.95 1.308-2.184 1.308-3.525 0-2.992-2.425-5.417-5.416-5.417C4.925 2.5 2.5 4.925 2.5 7.917c0 2.991 2.425 5.416 5.417 5.416 1.341 0 2.575-.491 3.525-1.308l.225.233v.659l4.166 4.158 1.242-1.242-4.158-4.166zm-5 0c-2.075 0-3.75-1.675-3.75-3.75s1.675-3.75 3.75-3.75 3.75 1.675 3.75 3.75-1.675 3.75-3.75 3.75z"></path></g></svg>
                 </div>
                </div>
                </div>
            </Dialog>
        </>
    )
}

export default Date;
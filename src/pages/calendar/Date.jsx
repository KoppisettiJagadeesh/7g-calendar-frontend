import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useContext, useState, useEffect, useRef } from 'react'
import { CalendarContext } from './Calendar.Context';
import { Dialog } from 'primereact/dialog';
import searchSvg from "../../assets/images/search.svg";
import TestsImg from "../../assets/images/ic_testing_small.svg"
import CompletedInspectionImg from "../../assets/images/event-inspection.svg"
import EventGroupImg from "../../assets/images/event-group.svg"
import PlannedInspectionImg from "../../assets/images/event-permit.svg"
import PermitImg from "../../assets/images/event-rout-plan.svg"
import PICOneDayImg from "../../assets/images/calendar-inspection-completed.svg"
import Event from "./CalendarEvent";


function Date(props) {
    const moment = require("moment");
    const { dayDate, data } = props;

    const { calendarType, activeEventTab } = useContext(CalendarContext);
    const [filteredData, setFilteredData] = useState([]);
    const [viewMoreData, setViewMoreData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [visible, setVisible] = useState(false);
    useEffect(
        () => {
            let tabIndex = activeEventTab;
            if (tabIndex === 0) {
                setFilteredData(data);
            }
            else {
                let newData = data.map((element) => {
                    let changedItems = {};
                    if (tabIndex === 1) {
                        if (element.items.tests && element.items.tests.length > 0) {
                            changedItems.tests = element.items.tests;
                            changedItems.permits = [];
                            changedItems.completed_inspections_with_rp = [];
                            changedItems.route_plans = [];
                            changedItems.inspections = [];
                        }
                    }
                    else if (tabIndex === 2) {
                        if (element.items.permits && element.items.permits.length > 0) {
                            changedItems.permits = element.items.permits;
                            changedItems.tests = [];
                            changedItems.completed_inspections_with_rp = [];
                            changedItems.route_plans = [];
                            changedItems.inspections = [];
                        }
                    }
                    else if (tabIndex === 3) {
                        if (
                            (element.items.completed_inspections_with_rp && element.items.completed_inspections_with_rp.length > 0) ||
                            (element.items.route_plans && element.items.route_plans.length > 0) ||
                            (element.items.inspections && element.items.inspections.length > 0)
                        ) {
                            changedItems.completed_inspections_with_rp = element.items.completed_inspections_with_rp;
                            changedItems.route_plans = element.items.route_plans;
                            changedItems.inspections = element.items.inspections;
                            changedItems.tests = [];
                            changedItems.permits = [];
                        }
                    }

                    if (Object.keys(changedItems).length > 0) {
                        element.items = changedItems;
                        return element;
                    }
                    return null;
                }).filter(item => item !== null);

                setFilteredData(newData);
            }
        }, [activeEventTab]
    );
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
        return data;
    }
    const Header = () => {
        return (
            <div className="card-header header-elements-inline">
                <div className="card-title">{moment(dayDate).format("dddd, MMMM YY")}</div>
            </div>
        )
    }
    const viewMoreCall = (value) => {
        let data = []
        value?.forEach((e) => {
            let name = e?.name, items = Object.entries(e?.items);
            items?.forEach(([key, values]) => {
                if (values?.length > 0) {
                    values.forEach(element => {
                        data.push({ id: element?.id, planned_date: element?.planned_date, title: element?.title, name: name, type: key })
                    });
                }
            });
        })

        setViewMoreData(data);
        setSearchData(data);
        setVisible(true);
    }
    const getSVGImage = (value) => {
        let srcName = EventGroupImg;
        if (value === "tests") {
            srcName = TestsImg;
        }
        else if (value === "route_plans") {
            srcName = PlannedInspectionImg;
        }
        else if (value === "permits") {
            srcName = PermitImg;
        }
        else if (value === "inspections") {
            srcName = CompletedInspectionImg;
        }
        else if (value === "completed_inspections_with_rp") {
            srcName = PICOneDayImg;
        }
        return srcName;
    }
    const getEventImg = (value) => {
        let items = Object.entries(value), imSrc = "";
        items?.forEach(([key, element]) => {
            if (element?.length > 1) {
                return imSrc = EventGroupImg;
            }
            else if (element?.length === 1) {
                imSrc = getSVGImage(key);
            }
        })
        return imSrc;
    }
    const userSearchData = (e) => {
        e.isDefaultPrevented();
        let Data = viewMoreData.filter(
            (element) => {
                return (element.name?.toLowerCase()?.includes(e.target?.value?.toLocaleLowerCase())
                    || element.title?.toLowerCase()?.includes(e.target?.value?.toLocaleLowerCase()))
            })
        setSearchData(Data);
    }
    return (
        <>
            <div className={`calendar-body ${calendarType?.name}`}>
                <div className='calendar-col'>
                    {
                        filteredData?.map((client, index) => {
                            if (calendarType?.name === "Week") {
                                if (index < 7) {
                                    return (
                                        <Event key={client?.id} eventType={getEventType(client)}
                                            dataTip={dataTipData(client)} eventCount={getEventCounts(client?.items)}
                                            eventHeader={client?.name} eventText={getEventText(client?.items)} tooltip={true} eventImg={getEventImg(client?.items)} />
                                    )
                                } else {
                                    return null
                                }
                            }
                        })
                    }
                </div>
            </div>
            <div>
                {
                    calendarType?.name === "Week" && <div className={`calendar-footer ${calendarType?.name} false`}>
                        <div className="calendar-col">
                            <div className='facility-row'>
                                <div className='calendar-item'>
                                    {
                                        filteredData?.length > 6 && <Button type="button" className='proteam-btn' onClick={() => viewMoreCall(filteredData)}>View more</Button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <Dialog header={Header} visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                    <div className="card mb-0 flex-fill base-modal">
                        <div className="card-body events">
                            <div className="search-input">
                                <InputText className="protean-default-input" placeholder="Search" type="text" onInput={(e) => userSearchData(e)}></InputText>
                                <img src={searchSvg}></img>
                            </div>
                            {searchData?.map((value) => (

                                <div className="events-wrapper">
                                    <div className="event">
                                        <div>{<img src={getSVGImage(value.type)} ></img>}
                                            {value?.name}</div>
                                        <div className="event-description">{value?.title}</div>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    )
}

export default Date;
import React, { useState, useEffect, useContext } from "react"
import { CalendarContext } from './Calendar.Context';
import Date from './Date';
import { WeekData } from './data'
const Week = () => {
    const moment = require("moment");
    const { selectedDate } = useContext(CalendarContext);
    const [weekDays, setWeekDays] = useState([]);
    useEffect(() => {
        let today = selectedDate ? moment(selectedDate) : moment();
        let days = [];
        for (let i = 0; i < 7; i++) {
            let day = today.clone().startOf('week').add(i, 'days');
            days.push({ day: day.format('ddd DD'), date: day.format('YYYY-MM-DD') });
        }
        setWeekDays(days)
    }, [selectedDate])
    const getIsCurrent = (value) => {
        let dateToCheck = moment(value), today = moment().startOf("day");
        let diffInDays = dateToCheck.diff(today, "days");
        return diffInDays === 0 ? "current" : "false";
    }
    return (
        <>
            <div className="d-flex align-items-center justify-content-start flex-wrap calendar  calendar-grid" >
               
                    {weekDays?.map((day, index) => (
                        <div key={index} className="calendar-header mb-1">
                            <div className="calendar-col">
                                <div className="d-inline-flex ml-8">
                                    <a className={`${getIsCurrent(day?.date)} active`}> {day?.day}</a>
                                </div>
                            </div>
                        </div>
                    ))}
                    {Object.values(WeekData)?.map((day, index) => (
                        <div key={day?.id} className="week-card">
                            <Date key={day?.id} data={day} ></Date>
                        </div>
                    ))}
            </div>
        </>
    )
}
export default Week;
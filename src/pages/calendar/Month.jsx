import React, { useState, useEffect, useContext } from 'react';
import { CalendarContext } from './Calendar.Context';
const Month = () => {
    const moment = require("moment");
    const { selectedDate } = useContext(CalendarContext);
    const [monthDays, setMothDays] = useState({ days: [], startWeek: [], endWeek: [] });
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    useEffect(() => {
        let today = selectedDate ? moment(selectedDate) : moment();
        let days = [];
        for (let i = 0; i < today.daysInMonth(); i++) {
            let day = today.clone().startOf('month').add(i, 'days');
            days.push(day.format('DD'));
        }
        let start_of_month = today.clone().startOf("month").format("YYYY-MM-DD");
        let end_of_month = today.clone().endOf("month");
        let weekStartDay = [];
        let weekEndDay = [];
        let week_start = today.clone().startOf("month").startOf("week")
        let week_end = today.clone().endOf("month").endOf("week").format("YYYY-MM-DD");
        let startWeekDay = week_start.clone();
        let endMonthDay = end_of_month.clone().add(1, 'days');
        while (startWeekDay.format("YYYY-MM-DD") < start_of_month) {
            weekStartDay.push(startWeekDay.format('DD'));
            startWeekDay.add(1, 'days');
        }

        while (endMonthDay.format("YYYY-MM-DD") <= week_end) {
            weekEndDay.push(endMonthDay.format('DD'));
            endMonthDay.add(1, 'days');
        }
        setMothDays({ days: days, startWeek: weekStartDay, endWeek: weekEndDay })
    }, [selectedDate])
    return (
        <div className="calendar-grid">
            {weekday.map((day, index) => (
                <div key={index} className="calendar-header">{day}</div>
            ))}
            {monthDays.startWeek.map((day, index) => (
                <div key={index} className="calendar-empty day_card">
                    <div className="dayLabel ">
                        {day}
                    </div>
                </div>
            ))}
            {monthDays.days.map((day, index) => (
                <div key={index} className="calendar-day day_card">
                    <div className="dayLabel day_active ">
                        {day}
                    </div>
                </div>
            ))}
            {monthDays.endWeek.map((day, index) => (
                <div key={index} className="calendar-empty day_card">
                    <div className="dayLabel ">
                        {day}
                    </div>
                </div>
            ))}
        </div>
    )

}
export default Month;
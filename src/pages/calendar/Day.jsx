import React,{useContext} from 'react'
import { CalendarContext } from './Calendar.Context';
function Day() {
    const { calendarType, selectedDate } = useContext(CalendarContext);
  return (
    <div>Day</div>
  )
}

export default Day
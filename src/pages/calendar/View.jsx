import { useContext } from 'react';
import { CalendarContext } from './Calendar.Context';
import Month from './Month';
import Week from './Week';
import Day from './Day';
// import "../../assets/scss/protean-colors.scss"
// import "../../assets/scss/protean-calendar.scss"
const CalendarView = () => {
  const { calendarType, selectedDate } = useContext(CalendarContext);
  if (calendarType.name == 'Month')
    return (
      <div className="bg-white">
        <div className = "flex-row calendar-widget mb-2">
          <Month ></Month>
        </div>
      </div>
    );
  if (calendarType.name == 'Week') 
  return(
   <div className ="bg-white">
     <div className = "flex-row calendar-widget mb-2">
    <Week ></Week>
     </div>
   </div>
  )
  if (calendarType.name == 'Day') 
    return (
    <div className='bg-white'>
       <div className = "flex-row calendar-widget mb-2">
        <Day></Day>
       </div>
    </div>
  );
};

export default CalendarView;

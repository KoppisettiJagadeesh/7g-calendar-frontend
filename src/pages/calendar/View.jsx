import { useContext } from 'react';
import { CalendarContext } from './Calendar.Context';
const CalendarView = () => {
  const { calendarType, selectedDate } = useContext(CalendarContext);
  console.log(calendarType, selectedDate);
  if (calendarType.name == 'Day')
    return (
      <div className="bg-white">
        <div></div>
      </div>
    );
  if (calendarType.name == 'Week') return <></>;
  if (calendarType.name == 'Day') return <></>;
};

export default CalendarView;

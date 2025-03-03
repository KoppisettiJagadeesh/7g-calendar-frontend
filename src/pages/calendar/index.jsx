import CalendarOptions from './Options';
import CalendarTab from './Tabs';
import CalendarView from './View';
import { CalendarProvider } from './Calendar.Context';

const Calendar = () => {
  return (
    <div className="card">
      <div className="col-lx-11 card protean-dashboard calendar-page">
        <h1 className="dashboard-title">Calendar</h1>
        <div className="pl-3 pr-3">
          <CalendarProvider>
            <CalendarTab></CalendarTab>
            <CalendarOptions></CalendarOptions>
            <CalendarView></CalendarView>
          </CalendarProvider>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

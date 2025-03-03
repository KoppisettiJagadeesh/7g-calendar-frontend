import { createContext, useState } from 'react';
const CalendarContext = createContext();
const CalendarProvider = ({ children }) => {
  const [calendarType, setCalendarType] = useState({ name: 'Week', code: 'Week' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const updateCalendarType = type => {
    setCalendarType(type);
  };
  const updateSelectedDate = date => {
    setSelectedDate(date);
  };
  return <CalendarContext.Provider value={{ calendarType, updateCalendarType, updateSelectedDate, selectedDate }}>{children}</CalendarContext.Provider>;
};

export { CalendarProvider, CalendarContext };

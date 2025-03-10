import { createContext, useState } from 'react';
const CalendarContext = createContext();
const CalendarProvider = ({ children }) => {
  const [calendarType, setCalendarType] = useState({ name: 'Week', code: 'Week' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeEventTab, setActiveEventTab] = useState(0);

  const updateCalendarType = type => {
    setCalendarType(type);
  };
  const updateSelectedDate = date => {
    setSelectedDate(date);
  };
  const handleEventTypeTabChange = (e) => {
    setActiveEventTab(e.index);
};
  return <CalendarContext.Provider value={{ calendarType, updateCalendarType, updateSelectedDate, selectedDate ,handleEventTypeTabChange,activeEventTab}}>{children}</CalendarContext.Provider>;
};

export { CalendarProvider, CalendarContext };

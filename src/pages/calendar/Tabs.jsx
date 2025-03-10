import {TabView, TabPanel} from "primereact/tabview";
import React, { useContext } from 'react'
import { CalendarContext } from "./Calendar.Context"
const CalendarTab = () => {
  const { activeEventTab,handleEventTypeTabChange } = useContext(CalendarContext);
  return (
    <TabView activeIndex={activeEventTab} onTabChange={handleEventTypeTabChange}>
      <TabPanel header="All"></TabPanel>
      <TabPanel header="Tests"></TabPanel>
      <TabPanel header="Permits"></TabPanel>
      <TabPanel header="Inspections"></TabPanel>
    </TabView>
  );
};

export default CalendarTab;

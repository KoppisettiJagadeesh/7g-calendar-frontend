import {TabView, TabPanel} from "primereact/tabview";

const CalendarTab = () => {
  return (
    <TabView>
      <TabPanel header="All"></TabPanel>
      <TabPanel header="Tests"></TabPanel>
      <TabPanel header="Permits"></TabPanel>
      <TabPanel header="Inspections"></TabPanel>
    </TabView>
  );
};

export default CalendarTab;

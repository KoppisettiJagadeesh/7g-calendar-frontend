import React, { useState, useContext } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { ReactComponent as CalendarIcon } from '../../assets/images/calendar-month.svg';
import { Button } from 'primereact/button';
import { CalendarContext } from './Calendar.Context';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
const CalendarOptions = () => {
  const { updateCalendarType, calendarType, updateSelectedDate } = useContext(CalendarContext);
  const [dates, setDates] = useState(null);
  const [selectedCalendarType, setCalendarType] = useState(null);
  const calendarTypeDD = [
    { name: 'Month', code: 'Month' },
    { name: 'Week', code: 'Week' },
    { name: 'Day', code: 'Day' }
  ];
  return (
    <div className="flex justify-content-end bg-white">
      <div className="pr-3">
        <Dropdown
          placeholder="Month"
          value={calendarType}
          onChange={e => {
            if (e.value.name == 'Month') {
              const today = new Date();
              setDates(new Date(today.getFullYear(), today.getMonth(), 1));
            }
            else if(e.value.name=="Week"){

            }
            else{
              setDates(new Date());
            }
            updateCalendarType(e.value);
          }}
          options={calendarTypeDD}
          optionLabel="name"
        ></Dropdown>
      </div>
      <div className="pr-3">
        <label htmlFor="range">Pick a date</label>
        {calendarType.name == 'Week' ? (
          <Calendar
            id="range"
            style={{ width: '350px' }}
            value={dates}
            onChange={e => {
              setDates(e.value);
              updateSelectedDate(e.value);
            }}
            showIcon
            selectionMode="range"
            numberOfMonths={2}
            icon={options => <CalendarIcon width="14px" {...options.iconProps} />}
          />
        ) : calendarType.name == 'Month' ? (
          <Calendar
            id="cldMonth"
            style={{ width: '350px' }}
            value={dates}
            onChange={e => {
              updateSelectedDate(e.value);
            }}
            showIcon
            view="month"
            dateFormat="mm/yy"
            icon={options => <CalendarIcon width="14px" {...options.iconProps} />}
          ></Calendar>
        ) : (
          <Calendar
            id="calendar"
            style={{ width: '350px' }}
            value={dates}
            showIcon
            view="date"
            onChange={e => {
              updateSelectedDate(e.value);
            }}
            icon={options => <CalendarIcon width="14px" {...options.iconProps} />}
          ></Calendar>
        )}
      </div>
      <div className="pr-3">
        <Button
          label="Today"
          className="protean-btn"
          onClick={e => {
            updateCalendarType({ name: 'Day', code: 'Day' });
          }}
        ></Button>
      </div>
      <div className="pr-3">
        <Dropdown optionLabel="name" editable placeholder="Search by Facility" showClear></Dropdown>
      </div>
    </div>
  );
};

export default CalendarOptions;

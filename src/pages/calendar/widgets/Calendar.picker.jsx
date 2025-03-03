import React from 'react';
import { ReactComponent as CalendarIcon } from '../../../assets/images/calendar-month.svg';
const CalendarPicker = () => {
  return (
    <Calendar
      id="range"
      style={{ width: '350px' }}
      value={dates}
      onChange={(e) => setDates(e.value)}
      showIcon
      selectionMode="range"
      icon={(options) => <CalendarIcon width="14px" {...options.iconProps} />}
      readOnlyInput
      hideOnRangeSelection
    />
  );
};

export default CalendarPicker;

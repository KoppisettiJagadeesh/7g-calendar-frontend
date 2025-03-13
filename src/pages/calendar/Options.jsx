import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { ReactComponent as CalendarIcon } from '../../assets/images/calendar-month.svg';
import { ReactComponent as CloseIcon } from "../../assets/images/cross.svg"
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left.svg"
import { ReactComponent as ArrowRightIcon } from "../../assets/images/arrow-right.svg"
import { ReactComponent as InfoCalanderIcon } from "../../assets/images/info-calendar.svg"
import { Button } from 'primereact/button';
import { CalendarContext } from './Calendar.Context';
import { InputMask } from 'primereact/inputmask';
import moment from "moment";
import { addDays, format, startOfWeek, endOfWeek, parseISO } from "date-fns";

const getDefaultDates = () => ({
  Month: [new Date()],
  Week: [moment().startOf("week").toDate(), moment().endOf("week").toDate()],
  Day: [new Date()],
});

const CalendarOptions = () => {
  const { updateCalendarType, calendarType, updateSelectedDate } = useContext(CalendarContext);

  const calendarRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState(getDefaultDates);
  const [currentDate, setCurrentDate] = useState(getDefaultDates);
  const [inputMaskValue, setInputMaskValue] = useState(getDefaultDates);

  const calendarTypeDD = [
    { name: 'Month', code: 'Month' },
    { name: 'Week', code: 'Week' },
    { name: 'Day', code: 'Day' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOnApplyDate = (datetype, date) => {
    setCurrentDate((prevState) => ({
      ...prevState,
      [datetype]: date[datetype],
    }));
    updateSelectedDate(date[datetype]);
    setShowCalendar(false)
  };
  const getCurrentDate = (datetype, date) => {
    const selectedDate = datetype === "Week" ? date["Week"][0] : date[datetype];
    if (!selectedDate) return "";
    const formatMap = {
      Month: "MMMM YYYY",
      Week: "MMMM YYYY",
      Day: "dddd D",
    };

    return moment(new Date(selectedDate)).format(formatMap[datetype]);
  };
  const getCurrentWeek = (datetype, date) => {
    const selectedDate = datetype === "Week" ? date["Week"][0] : date[datetype];
    if (!selectedDate) return "";
    const weekNumber = moment(new Date(selectedDate)).isoWeek();
    return `Week ${weekNumber}`;
  };

  const updateStates = (datetype, value) => {
    const dateValue = datetype === "Week" ? value : [value];
    setDates((prev) => ({ ...prev, [datetype]: dateValue }));
    setCurrentDate((prev) => ({ ...prev, [datetype]: dateValue }));
    setInputMaskValue((prev) => ({ ...prev, [datetype]: dateValue }));
  };

  const updateWeek = (selectedDate, operation) => {
    const adjustedDate = moment(selectedDate)[operation](1, "week").toDate();
    return [
      startOfWeek(adjustedDate, { weekStartsOn: 0 }),
      endOfWeek(adjustedDate, { weekStartsOn: 0 }),
    ];
  };
  const dateChangeHandler = (datetype, date, operation) => {
    if (!date || !date[datetype]) return;

    let selectedDate = new Date(datetype === "Week" ? date["Week"][operation === "add" ? 1 : 0] : date[datetype]);

    if (datetype === "Week") {
      updateStates(datetype, updateWeek(selectedDate, operation));
    } else {
      const unitMap = { Month: "month", Day: "day" };
      updateStates(datetype, moment(selectedDate)[operation](1, unitMap[datetype]).toDate());
    }
  };
  const handlePreviousClick = (datetype, date) => dateChangeHandler(datetype, date, "subtract");
  const handleNextClick = (datetype, date) => dateChangeHandler(datetype, date, "add");

  const handleDropDownChange = (e) => {
    const { name } = e.target.value;
    let dateValue = [];
  
    if (name === "Month") {
      dateValue = [moment().startOf("month").toDate()];
    } else if (name === "Week") {
      dateValue = [moment().startOf("week").toDate(), moment().endOf("week").toDate()];
    } else if (name === "Day") {
      dateValue = [new Date()];
    }
    updateSelectedDate(dateValue);
    updateCalendarType(e.value);
  };

  const getPlaceholders = (dateType, placeholderType) => {
    const placeholders = {
      Placeholder: {
        Day: "MM/DD/YYYY",
        Week: "DD/MM/YYYY - DD/MM/YYYY",
        Month: "YYYY/MM",
      },
      Mask: {
        Day: "99/99/9999",
        Week: "99/99/9999 - 99/99/9999",
        Month: "9999/99",
      },
    };

    return placeholders[placeholderType]?.[dateType] || "";
  };
  const getViewDateFormate = (dateType, viewDateFormate) => {
    const formate = {
      View: {
        Day: "date",
        Week: "date",
        Month: "month",
      },
      DateFormate: {
        Day: undefined,
        Week: undefined,
        Month: "mm/y",
      },
    };

    return formate[viewDateFormate]?.[dateType] || "";
  };
  const formateInputMaskValue = (maskValue, dateType) => {
    if (!maskValue || maskValue.length === 0) {
      return "";
    }
    return maskValue.map((date) => {
      const modifiedDate = date instanceof Date ? date : new Date(date);
      const year = modifiedDate.getFullYear();
      const month = String(modifiedDate.getMonth() + 1).padStart(2, "0");
      if (dateType === "Month") {
        return `${year}/${month}`;
      }
      if (dateType === "Day") {
        const day = String(modifiedDate.getDate()).padStart(2, "0");
        return `${month}/${day}/${year}`;
      }
      const day = String(modifiedDate.getDate()).padStart(2, "0");
      return `${month}/${day}/${year}`;
    })
      .join(dateType === "Week" ? " - " : " ");
  }

  const handleInputMaskChange = (e, dateType) => {
    const inputValue = e.target.value;
    setInputMaskValue((prevState) => ({
      ...prevState,
      [dateType]: inputValue
    }));
    if (dateType === "Week" && inputValue) {
      const rangeRegex = /^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2})\/(\d{2})\/(\d{4})$/;
      const rangeMatch = inputValue?.match(rangeRegex);
      if (rangeMatch) {
        const startDate = new Date(
          parseInt(rangeMatch[3]),
          parseInt(rangeMatch[1]) - 1,
          parseInt(rangeMatch[2])
        );
        const endDate = new Date(
          parseInt(rangeMatch[6]),
          parseInt(rangeMatch[4]) - 1,
          parseInt(rangeMatch[5])
        );
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          setDates((prevState) => ({
            ...prevState,
            [dateType]: [startDate, endDate]
          }));
        }
      }
    }
    if (dateType === "Month" && inputValue) {
      const monthRegex = /^(\d{4})\/(\d{2})$/;
      const monthMatch = inputValue.match(monthRegex);
      if (monthMatch) {
        const year = parseInt(monthMatch[1], 10);
        const month = parseInt(monthMatch[2], 10) - 1;
        const selectedDate = new Date(year, month, 1);
        if (!isNaN(selectedDate.getTime())) {
          setDates((prevState) => ({
            ...prevState,
            [dateType]: [selectedDate],
          }));
        }
      }
    }
    else {
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const dateMatch = inputValue.match(dateRegex);
      if (dateMatch) {
        const month = parseInt(dateMatch[1], 10) - 1;
        const day = parseInt(dateMatch[2], 10);
        const year = parseInt(dateMatch[3], 10);

        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          setDates((prevState) => ({
            ...prevState,
            [dateType]: [date]
          }));
        }
      }
    }
  };
  const handleDateChange = (e) => {
    const selected = e?.value;
    const dateType = calendarType.name;
    let value = selected;
    if (!value) return;
    if (!Array.isArray(value)) {
      value = [value];
    }
    if (dateType === "Week") {
      value = [startOfWeek(value[0], { weekStartsOn: 0 }), endOfWeek(value[0], { weekStartsOn: 0 })];
    }
    setDates(prevState => ({ ...prevState, [dateType]: value }));
    setInputMaskValue(prevState => ({ ...prevState, [dateType]: value }));
  };
  const dateTemplate = (date, dateType) => {
    if (date.selectable) {
      const selectedWeek = dates?.Week;
      if (dateType === "Week" && Array.isArray(selectedWeek) && selectedWeek.length === 2) {
        const startDate = new Date(selectedWeek[0]);
        const endDate = new Date(selectedWeek[1]);
        const modyfiedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
        const modyfiedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
        const currentDate = new Date(date.year, date.month, date.day);
        if (currentDate > modyfiedStartDate && currentDate < modyfiedEndDate) {
          return <strong className={"range-between-date"}>{date.day}</strong>
        }
      }
      return date.day;
    } else {
      return null
    }


  };

  const footerTemplate = () => {
    return (
      <div className="flex justify-content-end mt-3 gap-3 false">
        <button type="button" className="protean-btn cursor-pointer" onClick={() => setShowCalendar(false)}>
          Cancel
        </button>
        <button type="button" className="protean-btn cursor-pointer protean-btn-default" onClick={() => handleOnApplyDate(calendarType.name, dates)}>
          Apply
        </button>
      </div>
    )
  }
  const getCalenderStyles = (dateType) => {
    if (dateType === "Week") {
      return `custom-picker-protean range ${showCalendar ? "block" : "hidden"}`
    }
    else {
      return `custom-picker-protean calender-size ${showCalendar ? "block" : "hidden"}`
    }
  }
  const handleTodayDate=()=>{
    updateCalendarType({ name: 'Day', code: 'Day' });
    setDates(prevState=>({...prevState,Day:[new Date()]}))
    setCurrentDate(prevState=>({...prevState,Day:[new Date()]}))
    setInputMaskValue(prevState=>({...prevState,Day:[new Date()]}))
  }
  return (
    <div className="col-12 flex justify-content-center align-items-center p-0 bg-white">
      <div className='col-6 flex justify-content-start align-items-center'>
        <div className='calendar-left-side'>
          <button type="button" className="reset-btn arrow-btn" onClick={() => handlePreviousClick(calendarType.name, currentDate)}>
            <ArrowLeftIcon />
          </button>
          <span className="current">{getCurrentDate(calendarType.name, currentDate)}</span>
          <button type="button" className="reset-btn arrow-btn" onClick={() => handleNextClick(calendarType.name, currentDate)}>
            <ArrowRightIcon />
          </button>
          <span className="week">{getCurrentWeek(calendarType.name, currentDate)}</span>
          <InfoCalanderIcon className='cursor-pointer' />
        </div>
      </div>
      <div className='col-6 flex justify-content-end align-items-center'>
        <div className="flex flex-column pr-3">
          <div className='mb-3'></div>
          <Dropdown
            key={"code"}
            placeholder="Month"
            value={calendarType}
            onChange={handleDropDownChange}
            options={calendarTypeDD}
            optionLabel="name"
          />
        </div>
        <div className="flex flex-column pr-3" ref={calendarRef}>
          <label htmlFor="range">Pick a date</label>
          <div>
            <div className="flex custome-calender-group w-auto bg-white" id='calenderGroup'>
              <InputMask
                id='inputMask'
                value={
                  typeof inputMaskValue[calendarType?.name] === "string"
                    ? inputMaskValue[calendarType?.name]
                    : formateInputMaskValue(inputMaskValue[calendarType?.name], calendarType.name)
                }
                onClick={() => {
                  const input = document.querySelector("#inputMask");
                  input?.blur();
                  setShowCalendar(true)
                }}
                key={calendarType.name}
                onChange={(e) => handleInputMaskChange(e, calendarType.name)}
                className="w-100 fw-bold pe-4 text-start position-relative"
                tabIndex="0"
                placeholder={getPlaceholders(calendarType.name, "Placeholder")}
                mask={getPlaceholders(calendarType.name, "Mask")}
              />
              <div className="flex items-center gap-2 mr-3 bg-white">
                <CloseIcon
                  width="14px"
                  className="h-full cursor-pointer"
                  onClick={() => {
                    setInputMaskValue((prevState) => ({
                      ...prevState,
                      [calendarType.name]: []
                    }));
                    setDates((prevState) => ({
                      ...prevState,
                      [calendarType.name]: []
                    }));
                    setShowCalendar(false);
                  }}
                />
                <CalendarIcon
                  width="14px"
                  className='h-full cursor-pointer'
                  onClick={() => {
                    setShowCalendar(true);
                  }}
                />
              </div>
            </div>
            <div className="card flex justify-content-center">
              <Calendar
                id="cldWeek"
                key={calendarType.name}
                className={getCalenderStyles(calendarType.name)}
                value={calendarType.name === "Week" ? dates[calendarType.name] : new Date(dates[calendarType.name])}
                onChange={handleDateChange}
                selectionMode={calendarType.name === "Week" ? "range" : "single"}
                numberOfMonths={calendarType.name === "Week" ? 2 : 1}
                inline
                hideOnRangeSelection={calendarType.name === "Week"}
                autoFocus
                view={getViewDateFormate(calendarType.name, "View")}
                dateFormat={getViewDateFormate(calendarType.name, "DateFormate")}
                dateTemplate={(e) => dateTemplate(e, calendarType.name)}
                footerTemplate={footerTemplate}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-column pr-3">
          <div className='mb-3'></div>
          <Button
            label="Today"
            className="protean-btn"
            onClick={()=>handleTodayDate()} 
          ></Button>
        </div>
        <div className="flex flex-column pr-3">
          <div className='mb-3'></div>
          <Dropdown optionLabel="name" editable placeholder="Search by Facility" showClear></Dropdown>
        </div>
      </div>
    </div>
  );
};

export default CalendarOptions;


import React from 'react';
import s from '../style.module.css';
import { getDay } from '../helpers';
import { CalendarItem } from "types";

interface CalendarType {
  calendar: CalendarItem[];
  setActiveDay: React.Dispatch<React.SetStateAction<number>>;
  activeDay: number;
  isMonthly: boolean;
}

function Calendar({ calendar, setActiveDay, activeDay, isMonthly }: CalendarType): JSX.Element {
  const [days, setDays] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (calendar && calendar[0] && calendar[0].fullDate) {
      setDays(getDay(calendar[0].fullDate));
    }
  }, [calendar])
  
  
  return (
    <div className="grid grid-cols-7 grid-rows-6 w-full m-auto max-w-claendar min-w-calendar rounded-xl">
      {
        days.map((elem, idx) => (
          <div key={idx} className={`${idx === 0 ? 'rounded-tl-xl' : idx === 6 ? 'rounded-tr-xl' : ''} ${s.caledarDayName} `}>{elem}</div>
        ))
      }

      {calendar.map((elem, idx) => (
        <div
          key={idx}
          className={`${idx === 28 ? 'rounded-bl-xl' : idx === 34 ? 'rounded-br-xl' : ''} 
                     ${s.calendarDate} 
                     ${idx === activeDay ? ' bg-oBg font-bold' : ''}
                     ${!isMonthly && idx > 27 ? 'bg-calLight' : ''}
                    `}
          onClick={() => setActiveDay(idx)}
        >
          {elem.date}
        </div>
      ))}
    </div>
  );
}


const MemoCalendar = React.memo(Calendar, (prevProps, nextProps) => {
  return prevProps.activeDay === nextProps.activeDay && prevProps.isMonthly === nextProps.isMonthly;
});

export default MemoCalendar;

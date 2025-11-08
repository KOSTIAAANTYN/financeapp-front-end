import React from 'react'
import s from './style.module.css'
import MemoCalendar from './parts/Calendar'
import MemoChart from './parts/MyChart'
import Date from './parts/Date'
import Chart from "chart.js/auto";
import MemoSwitch from './parts/Switch'
import MemoSave from './parts/Save'
import { CategoryScale } from "chart.js";
import { useAppSelector, useAppDispatch } from 'hooks'
import { addHistory } from '@slices/userHistorySlice'
import axios from 'axios'
import { setHistoryObj } from './helpers'
import { mainUrl } from 'urls'
Chart.register(CategoryScale);

type UserIncomeType = {
  setIsLoading: (value: boolean) => void
  setErrorText: (value: string) => void
  setIsError: (value: boolean) => void
}

export default function UserIncome({ setIsLoading, setErrorText, setIsError }: UserIncomeType): JSX.Element {

  const dispatch = useAppDispatch()
  const [activeDay, setActiveDay] = React.useState<number>(34)
  const { calendar, globalTotal, weekTotal, isMonthly, indicate } = useAppSelector(state => state.userPage)
  const { userId } = useAppSelector(state => state.profile)
  const [mounted, setMounted] = React.useState(false);

  const saveCurrentData = React.useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const jwt = localStorage.getItem('token');
      const sortedCalendar = [...calendar].sort((a: { id: number }, b: { id: number }) => a.id - b.id);
      await axios.post(`${mainUrl}updateCalendar`, {
        id: userId,
        calendar: sortedCalendar,
        messages: sortedCalendar.map(item => ({
          id: item.id,
          date: item.date,
          fullDate: item.fullDate,
          total: item.total,
          calendarId: userId,
          messages: item.messages || []
        }))
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      })
      setIsLoading(false)
      setIsError(false)
    } catch (error) {
      setErrorText('Server error')
      setIsError(true)
      setIsLoading(false)
    }
  }, [calendar, userId, setIsLoading, setIsError, setErrorText]);

  React.useEffect(() => {
    if (mounted) {
      if (indicate) {
        saveCurrentData();
      }
    } else {
      setMounted(true);
    }
  }, [globalTotal, indicate, mounted, saveCurrentData]);

  const addToHistory = async () => {
    const currentTotal = isMonthly ? globalTotal : weekTotal;
    const historyEntry = setHistoryObj(currentTotal)
    setIsLoading(true)
    setIsError(false)
    try {
      const jwt = localStorage.getItem('token');
      await axios.post(`${mainUrl}addToHistory`, {
        ...historyEntry,
        id: userId
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      })
      dispatch(addHistory(historyEntry))
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setErrorText('Server error')
      setIsError(true)
    }
  }

  return (
    <div className='h-full'>
      <Date
        activeDay={calendar[activeDay]}
        activeIdx={activeDay}
      />
      <div className={s.calendarBlock}>
        <MemoCalendar calendar={calendar} isMonthly={isMonthly} setActiveDay={setActiveDay} activeDay={activeDay} />
        <MemoChart calendar={calendar} globalTotal={globalTotal} weekTotal={weekTotal} isMonthly={isMonthly} />
      </div>
      <div className={s.totalBlock}>
        <MemoSwitch isMonthly={isMonthly} />
        <MemoSave isMonthly={isMonthly} addToHistory={addToHistory} />
        <div className='text-2xl font-bold'>
          Total:
          <span
            className={`${isMonthly ? globalTotal < 0 ? 'text-red-500' : 'text-green-500' : weekTotal < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {isMonthly ? globalTotal : weekTotal}
          </span></div>
      </div>

    </div>
  )
}

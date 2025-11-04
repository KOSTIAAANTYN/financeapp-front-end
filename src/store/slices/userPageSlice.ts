import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CalendarItem } from "types";



const initialState: { calendar: CalendarItem[], globalTotal: number, weekTotal: number,isMonthly:boolean, indicate:boolean } = {
  globalTotal: 0,
  weekTotal: 0,
  isMonthly: true,
  indicate: false,
  calendar: [
    { id: 1, date: '22', fullDate: '22.12.2023', total: 0, messages: [], calendarId: 1 },
    { id: 2, date: '23', fullDate: '23.12.2023', total: 0, messages: [], calendarId: 1 },
    { id: 3, date: '24', fullDate: '24.12.2023', total: 0, messages: [], calendarId: 1 },
    { id: 4, date: '25', fullDate: '25.12.2023', total: 0, messages: [], calendarId: 1 },
    { id: 5, date: '26', fullDate: '26.12.2023', total: 0, messages: [], calendarId: 1 },
    { id: 6, date: '27', fullDate: '27.12.2023', total: 0, messages: [], calendarId: 1 },
    { id: 7, date: '28', fullDate: '28.12.2023', total: 0, messages: [], calendarId: 1 },
    { id: 8, date: '29', fullDate: '29.12.2023', total: 0, messages: [], calendarId: 1 },
    { id: 9, date: '30', fullDate: '30.12.2023', total: 0, messages: [], calendarId: 1 },
    { id: 10, date: '31', fullDate: '31.12.2023', total: 0, messages: [], calendarId: 1 },
    { id: 11, date: '01', fullDate: '01.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 12, date: '02', fullDate: '02.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 13, date: '03', fullDate: '03.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 14, date: '04', fullDate: '04.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 15, date: '05', fullDate: '05.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 16, date: '06', fullDate: '06.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 17, date: '07', fullDate: '07.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 18, date: '08', fullDate: '08.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 19, date: '09', fullDate: '09.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 20, date: '10', fullDate: '10.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 21, date: '11', fullDate: '11.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 22, date: '12', fullDate: '12.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 23, date: '13', fullDate: '13.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 24, date: '14', fullDate: '14.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 25, date: '15', fullDate: '15.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 26, date: '16', fullDate: '16.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 27, date: '17', fullDate: '17.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 28, date: '18', fullDate: '18.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 29, date: '19', fullDate: '19.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 30, date: '20', fullDate: '20.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 31, date: '21', fullDate: '21.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 32, date: '22', fullDate: '22.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 33, date: '23', fullDate: '23.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 34, date: '24', fullDate: '24.01.2024', total: 0, messages: [], calendarId: 1 },
    { id: 35, date: '25', fullDate: '25.01.2024', total: 0, messages: [], calendarId: 1 },
  ]
}

export const userPageSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCalendar(state, actions: PayloadAction<CalendarItem[]>) {
      state.calendar = actions.payload
    },
    setOtherState(state, actions: PayloadAction<[globalTotal: number, weekTotal: number, isMonthly: boolean]>) {
      state.globalTotal = actions.payload[0]
      state.weekTotal = actions.payload[1]
      state.isMonthly = actions.payload[2]
    },
    changeIsIncomeR(state, action: PayloadAction<[act: number, i: number]>) {
      const [activeIdx, idx] = action.payload;
      state.calendar[activeIdx].messages[idx].isIncome = !state.calendar[activeIdx].messages[idx].isIncome;
    },
    changeDescriptionR(state, action: PayloadAction<[activeIdx: number, idx: number, e: string]>){
      const [activeIdx, idx, e] = action.payload;
      state.calendar[activeIdx].messages[idx].description = e
    },
    changePriceR(state, action: PayloadAction<[activeIdx: number, idx: number, e: number]>) {
      const [activeIdx, idx, e] = action.payload;
      state.calendar[activeIdx].messages[idx].price = e
    },
    addOneMessageR(state , action: PayloadAction<number>) {
      state.calendar[action.payload].messages.push({isIncome: true, description: '', price: 0})
    },
    removeMessageR(state, action:PayloadAction<[activeIdx: number, idx: number]>) {
      const [activeIdx, idx] = action.payload
      state.calendar[activeIdx].messages.splice(idx, 1)

    },
    saveR(state, action:PayloadAction<number>) {
      state.indicate = true
      state.globalTotal = 0
      state.weekTotal = 0
      const activeIdx = action.payload
      state.calendar[activeIdx].total = 0
      state.calendar[activeIdx].messages.forEach((elem) => {
        if (elem.isIncome) {
          state.calendar[activeIdx].total += elem.price
        } else {
          state.calendar[activeIdx].total -= elem.price
        }
      })
      state.calendar.forEach((elem, idx) => {
        if (idx > 27) {
          state.weekTotal += elem.total
        }
        state.globalTotal += elem.total
      })
    },
    setIsMonthly(state) {
      state.isMonthly = !state.isMonthly
    },
    setIndicator(state) {
      state.indicate = false
    }

  },
})


export const { 
  setCalendar,
  changeIsIncomeR, 
  changeDescriptionR, 
  changePriceR ,
  addOneMessageR,
  removeMessageR,
  saveR,
  setIsMonthly,
  setOtherState,
  setIndicator} = userPageSlice.actions

export default userPageSlice.reducer
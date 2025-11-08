import { HistoryElemType } from "types"

export const setHistoryObj = (total: number) => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
    
    const resObj: HistoryElemType = {
        date: formattedDate,
        type: total >= 0 ? 'income' : 'expense',
        total: Math.abs(total)
    }
    return resObj
}

export const getDay = (dateString: string) => {
    const [day, month, year] = dateString.split('.').map(num => parseInt(num, 10));
    const lastDate = new Date(year, month - 1, day);
    
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    const startDate = new Date(lastDate);
    startDate.setDate(lastDate.getDate() - 34);
    const startDayOfWeek = startDate.getDay();
    
    const result = [];
    for (let i = 0; i < 7; i++) {
        const dayIndex = (startDayOfWeek + i) % 7;
        result.push(daysOfWeek[dayIndex]);
    }
    
    return result;
}

interface Message {
    isIncome: boolean;
    description: string;
    price: number;
}

export interface CalendarItem {
    id: number;
    date: string;
    fullDate: string;
    total: number;
    calendarId: number;
    messages: Message[];
}


export type HistoryElemType = {
    type: string
    date: string,
    total: number,
}
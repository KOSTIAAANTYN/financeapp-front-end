import React from 'react'
import s from '../style.module.css'
import arrow from '@imgs/arrow.png'
import cross from '@imgs/cross.png'
import add from '@imgs/add.png'
import { CalendarItem } from "types";
import { changeIsIncomeR, 
         changeDescriptionR, 
         changePriceR,
         addOneMessageR,
         removeMessageR,
         saveR } from '@slices/userPageSlice'
import { useAppDispatch } from 'hooks'

type DateType = {
    activeDay: CalendarItem;
    activeIdx: number;
}

export default function Date({ activeDay, activeIdx }: DateType): JSX.Element {
    const dispatch = useAppDispatch()
    const [oldData, setOldData] = React.useState<string>(JSON.stringify(activeDay.messages))
    const [equal , setEqual] = React.useState<boolean>(true)
    
    React.useEffect(() => {
        setOldData(JSON.stringify(activeDay.messages))
        if (oldData === JSON.stringify(activeDay.messages)) {
            setEqual(true)
        } else {
            setEqual(false)
        }
    }, [activeDay])
    React.useEffect(() => {
        setOldData(JSON.stringify(activeDay.messages))
        setEqual(true)
    }, [activeIdx])

    const changeDescription = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        dispatch(changeDescriptionR([activeIdx, idx, e.target.value]))
    }

    const changePrice = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        if (+e.target.value / 1 !== +e.target.value) return;
        dispatch(changePriceR([activeIdx, idx, +e.target.value]))
    }

    const changeIsIncome = (idx: number) => {
        dispatch(changeIsIncomeR([activeIdx, idx]))
    }

    const addOneMessage = () => {
        dispatch(addOneMessageR(activeIdx))
    }

    const removeMessage = (idx: number) => {
        dispatch(removeMessageR([activeIdx, idx]))
    }

    const save = () => {
        dispatch(saveR(activeIdx))
    }

    return (
        <div className={s.container}>
            <div className={s.title} >{activeDay.fullDate}</div>
            <div className="pt-7 flex flex-col justify-center gap-5">
                {
                    activeDay.messages.length === 0 && <div className=' text-xl sm:text-2xl text-gray-400 font-bold' >No incomes/expenses</div>
                }
                {
                    activeDay.messages.map((elem, idx) => (
                        <div key={idx} className={s.dateBlock}>
                            <div className="text-2xl ">{idx+1})</div>
                            <input 
                                type="text" 
                                placeholder='Description' 
                                value={elem.description} 
                                onChange={(e) => changeDescription(e, idx)}
                                className={s.description} />
                            <input 
                                type="text" 
                                placeholder='Price' 
                                className={s.price}
                                value={elem.price}
                                onChange={(e) => changePrice(e, idx)} />
                            <button onClick={() => changeIsIncome(idx)} className={`${s.btn} border-oBut`}>
                                {elem.isIncome? 'Income' : 'Expense'}
                                <img src={arrow} 
                                    alt="" 
                                    className='h-5 w-auto duration-500' 
                                    style={{transform: elem.isIncome? 'rotate(0deg)' : 'rotate(180deg)'}} />
                            </button>
                            <button 
                                onClick={() => removeMessage(idx)} 
                                className={`${s.btn} border-red-500`}>
                                Delete
                                <img src={cross} alt="" className='h-4 w-auto' />
                            </button>
                        </div>
                    ))
                }

            </div>

            <div className='flex gap-5 pt-7'>
                <div
                    onClick={addOneMessage} 
                    className='w-10 h-auto cursor-pointer'>
                    <img src={add} alt="Add" />
                </div>
                <div>
                    <button onClick={save} className={`${s.btn} ${equal ? 'bg-green-400 text-white': ''} border-green-500 text-green-500`}>Save</button>
                </div>
            </div>
        </div>
    )
}

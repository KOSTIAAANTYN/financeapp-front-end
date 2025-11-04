import React from 'react'
import s from '../style.module.css'
import Button from 'components/Button'
import { mainUrl } from 'urls'
import axios from 'axios'

type ContactsType = {
    settingsForm: number;
    setIsLoading: (value: boolean) => void
    setErrorText: (value: string) => void
    setIsError: (value: boolean) => void
}

export default function Contacts({setIsLoading, setErrorText, setIsError, settingsForm} : ContactsType): JSX.Element {

    const [mail, setMail] = React.useState<string>('')
    const [question, setQuestion] = React.useState<string>('')
    const contactHandler = async () => {
        setIsLoading(true)
        setIsError(false)
        try {
            const jwt = localStorage.getItem('token');
            await axios.post(`${mainUrl}contact`, { email: mail, question: question },{
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }})
            setIsLoading(false)
            setMail('')
            setQuestion('')
        } catch (error) {
            setErrorText('Server error')
            setIsError(true)
            setIsLoading(false)
        }
        
    }

    return (
        <div className={` ${s.settingsForm}  ${settingsForm === 3 ? 'h-64 pb-10' : 'h-0 pb-0'}`}>
            <div className='text-2xl pb-3 font-bold'>Contact us</div>
            <div className='flex flex-col gap-5 w-72 items-center'>
                <div className='flex flex-col gap-4 w-full'>
                    <input 
                        placeholder='Enter your email' 
                        className={s.formInput}
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        type="text" />
                    <input 
                        placeholder='Enter question' 
                        className={s.formInput} 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        type="text" />
                </div>
                <Button 
                    text='Send question' 
                    fc={contactHandler} 
                    extraClasses=' w-full h-sett flex items-center rounded-xl justify-center'   />
            </div>
        </div>
    )
}

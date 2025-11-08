import React from 'react'
import s from '../style.module.css'
import Button from 'components/Button'
import { useAppSelector } from 'hooks'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import eye from '@imgs/eye-visib.svg'
import eyeNo from '@imgs/eye-no-visib.svg'
import { mainUrl } from 'urls'

type DeleteAccType = {
    settingsForm: number
    setIsLoading: (value: boolean) => void
    setErrorText: (value: string) => void
    setIsError: (value: boolean) => void
}

export default function DeleteAcc({setIsLoading, setErrorText, setIsError, settingsForm}: DeleteAccType): JSX.Element {

    const [passwordLocal, setPasswordL] = React.useState<string>('')
    const navigate = useNavigate()
    const {userId} = useAppSelector(state => state.profile)
    const [type, setType] = React.useState<'password' | 'text'>('password')
    const sendHandler = async () => {
        setIsError(false)
        setIsLoading(true)
        try {
            const jwt = localStorage.getItem('token');
            await axios.post(`${mainUrl}deleteAccount`, { 
                id: userId,
                password: passwordLocal 
            }, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                }
            })
            setIsLoading(false)
            localStorage.removeItem('token')
            navigate('/')
        } catch (error) {
            setIsLoading(false)
            setErrorText('Server error')
            setIsError(false)
        }
    }

    return (
        <div className={`${s.settingsForm}  ${settingsForm === 2 ? ' h-48 sm:h-32 pb-10' : 'h-0 pb-0'}`}>
            <div className='text-2xl pb-3 font-bold'>Delete account</div>
            <div className='flex flex-col sm:flex-row gap-5 items-center'>
                <div className='relative'>
                    <input 
                        placeholder='Enter password' 
                        className={s.formInput}
                        value={passwordLocal}
                        onChange={(e) => setPasswordL(e.target.value)} 
                        style={{paddingRight: '40px'}}
                        type={type} />
                    <img 
                        src={type === 'password' ? eyeNo : eye}
                        onClick={() => setType(type === 'password' ? 'text' : 'password')} 
                        alt="" 
                        style={{top: '13px'}} 
                        className={s.imgEye} />
                </div>
                <Button 
                    text='Confirm' 
                    fc={sendHandler} 
                    extraClasses=' h-sett flex items-center w-full justify-center rounded-xl border-red-500 hover:bg-red-200'   />
            </div>
        </div>
    )
}

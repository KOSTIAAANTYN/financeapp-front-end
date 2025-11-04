import React from 'react'
import s from '../style.module.css'
import Button from 'components/Button'
import { useAppSelector, useAppDispatch } from 'hooks'
import { setUserName } from '@slices/profileSlice'
import axios from 'axios'
import { mainUrl } from 'urls'

type ChangeNameType = {
    settingsForm: number;
    setIsLoading: (value: boolean) => void
    setErrorText: (value: string) => void
    setIsError: (value: boolean) => void
}

export default function ChangeName({ setIsLoading, setErrorText, setIsError ,settingsForm}: ChangeNameType ):JSX.Element {

  const [newName, setNewName] = React.useState<string>('')
  const dispatch = useAppDispatch()
  const { userId } = useAppSelector(state => state.profile)
  const sendHandler = async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const jwt = localStorage.getItem('token');
      await axios.post(`${mainUrl}changeName`, { id: userId, username: newName }, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      })
      dispatch(setUserName(newName))
      setIsLoading(false)
      setNewName('')
    } catch (error) {
      console.log(error);
      setErrorText('Server error')
      setIsError(true)
      setIsLoading(false)
    }
    
  }

  return (
    <div className={` ${s.settingsForm}  ${settingsForm === 1 ? ' h-48 sm:h-32 pb-10': 'h-0 pb-0' }`}>
        <div className='text-2xl pb-3 font-bold'>Change name</div>
        <div className='flex flex-col sm:flex-row gap-5 items-center'>
          <input 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            placeholder='New name' 
            className={s.formInput} 
            type="text" />
          <Button text='Save' fc={sendHandler} extraClasses=' h-sett flex items-center rounded-xl w-full justify-center'   />
        </div>
      </div>
  )
}

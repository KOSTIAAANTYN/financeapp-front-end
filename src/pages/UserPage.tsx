import React from 'react'
import Settings from 'modules/settings/Settings';
import History from 'modules/history/History';
import UserIncome from 'modules/user-income/UserIncome';
import SwitchUserModules from 'modules/switch-user-modules/SwitchUserModules';
import gh from '@imgs/github.png'
import Spinner from 'components/Spinner';
import { useAppSelector } from 'hooks'
import { useNavigate } from 'react-router-dom';

export default function UserPage(): JSX.Element {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [errorText, setErrorText] = React.useState<string>('Server error');
  const { userId, username } = useAppSelector(state => state.profile);
  const navigate = useNavigate();

  React.useEffect(()=> {
      if (userId === '') {
          navigate('/')
      }
  }, [userId, navigate])

  const [selectedModule, setSelectedModule] = React.useState<number>(1);
  const changeModule = (value: number) => {
    if (value === selectedModule) return;
    setSelectedModule(value)
  }


  


  return (
    <div>
      <div className='welcome-cont'>
        <div className='user-cont-white'>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="text-4xl">Hello</span>
              <span className="user-name">{username}</span>
            </div>
            {isLoading && <Spinner />}
          </div>

          <SwitchUserModules selectedModule={selectedModule} changeModule={changeModule} />


          {isError && <div className='user-error'>{errorText}</div>}


          <div className='user-modules-cont'>
            <div className={`user-modules`}>
              {selectedModule === 1 && <UserIncome setIsLoading={setIsLoading} setErrorText={setErrorText} setIsError={setIsError} />}
              {selectedModule === 2 && <History setIsLoading={setIsLoading} setErrorText={setErrorText} setIsError={setIsError} />}
              {selectedModule === 3 && <Settings setIsLoading={setIsLoading} setErrorText={setErrorText} setIsError={setIsError} />}
            </div>
          </div>

          <div className=" absolute flex gap-5 bottom-3 gh ">
            <a href="https://github.com/KOSTIAAANTYN/financeapp-front-end" target='blanc'><img title='Frontend Part' className=' w-10 h-auto' src={gh} alt="gh-front" /></a>
            <a href="https://github.com/KOSTIAAANTYN/financeapp/tree/JWTv2" target='blanc'><img title='Backend Part' className=' w-10 h-auto' src={gh} alt="gh-back" /></a>
          </div>
        </div>
      </div>
    </div>
  )
}

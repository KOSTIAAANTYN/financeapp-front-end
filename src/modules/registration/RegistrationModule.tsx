import React from 'react'
import s from './style.module.css'
import axios from 'axios';
import { mainAuthUrl } from 'urls';
import FormInput from 'components/FormInput';
import FormBtn from 'components/FormBtn';
import eyeVisib from '@imgs/eye-visib.svg'
import eyeNo from '@imgs/eye-no-visib.svg'
import Spinner from 'components/Spinner';
import { Link } from 'react-router-dom';
import { isValidEmail } from 'helpers';

type RegistrationModuleType = {
  setUserCode: (value: string) => void;
  setEmailLocal: (value: string) => void;
}

function RegistrationModule({ setUserCode, setEmailLocal }: RegistrationModuleType): JSX.Element {

  const [emailLocal, setEmailLocalLocal] = React.useState<string>('');
  const [passwordLocal, setPasswordLocal] = React.useState<string>('');
  const [userName, setUserName] = React.useState<string>('');

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [errorText, setErrorText] = React.useState<string>('Error login or password');

  // ⬇️ Коли користувач вводить email — зберігаємо і тут, і в RegistrationPage
  const handleEmailChange = (value: string) => {
    setEmailLocalLocal(value);
    setEmailLocal(value); // <-- передаємо наверх
  };

  const registration = async () => {
    if (isValidEmail(emailLocal) === false) {
      setErrorText('Invalid email');
      setIsError(true);
      return;
    }
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await axios.post(`${mainAuthUrl}sendEmail`, {
        username: userName,
        email: emailLocal,
        password: passwordLocal
      });
      if (res.status === 204) {
        setErrorText('You already have account');
        setIsError(true);
        setIsLoading(false);
      } else if (res.status === 200) {
        setUserCode(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setErrorText('Server error');
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.singinLogo}>Create <span className='text-oBut font-semibold'>account</span></div>
      <div className=' text-lg sm:text-xl pb-0 sm:pb-8 pt-2'>Your personal Financial diary </div>
      {isError && <div className={s.error}>{errorText}</div>}
      <FormInput
        value={userName}
        changeValue={setUserName}
        placeholder='Enter user name'
        name='User name'
      />
      <FormInput
        value={emailLocal}
        changeValue={handleEmailChange} // 👈 заміна тут
        placeholder='Enter your email'
        name='Email'
      />
      <FormInput
        value={passwordLocal}
        changeValue={setPasswordLocal}
        placeholder='Enter your password'
        name='Password'
        eyeV={eyeVisib}
        eyeN={eyeNo}
      />
      {isLoading && (
        <div className={s.spinnerCont}>
          <div className={s.spinner}><Spinner /></div>
        </div>
      )}
      <div className='lg:-mb-20'></div>
      <FormBtn name='Create account' fc={registration} />
      <div className={s.reg1}>
        Already have account? <Link to={'/login'} className={s.reg2}> Sign in</Link>
      </div>
    </div>
  );
}

export default RegistrationModule;

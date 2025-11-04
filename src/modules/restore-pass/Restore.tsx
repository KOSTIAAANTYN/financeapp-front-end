import React from 'react'
import s from './style.module.css'
import axios from 'axios';
import { mainAuthUrl, mainUrl } from 'urls';
import FormInput from 'components/FormInput';
import FormBtn from 'components/FormBtn';
import eyeVisib from '@imgs/eye-visib.svg'
import eyeNo from '@imgs/eye-no-visib.svg'
import Spinner from 'components/Spinner';
import { Link } from 'react-router-dom';
import { isValidEmail } from 'helpers';

type RestoreModuleType = {
    setUserCode: (value: string) => void;
    setEmailLocal: (value: string) => void;
    setPasswordLocal: (value: string) => void;
}

function Restore({ setUserCode, setEmailLocal: setParentEmail, setPasswordLocal: setParentPassword }: RestoreModuleType): JSX.Element {

    const [emailLocal, setEmailLocal] = React.useState<string>('');
    const [passwordLocal, setPasswordLocal] = React.useState<string>('');
    const [repeatPassword, setRepeatPassword] = React.useState<string>('');

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isError, setIsError] = React.useState<boolean>(false);
    const [errorText, setErrorText] = React.useState<string>('Error login or password');

    const registration = async () => {
        if (isValidEmail(emailLocal) === false) {
            setErrorText('Invalid email');
            setIsError(true);
            return;
        }
        if (passwordLocal !== repeatPassword) {
            setErrorText('Passwords do not match');
            setIsError(true);
            return;
        }
        setIsLoading(true)
        setIsError(false)
        try {
            const res = await axios.post(`${mainAuthUrl}changePassword`, {
                email: emailLocal,
                password: passwordLocal
            });
            setUserCode(res.data)
            setParentEmail(emailLocal)
            setParentPassword(passwordLocal)
            setIsLoading(false)
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                setErrorText('You do not have an account');
                setIsError(true);
                setIsLoading(false)
            } else {
                console.log(error)
                setErrorText('Server error');
                setIsError(true);
                setIsLoading(false)
            }
        }
    }

    return (
        <div className={s.container}>
            <div className={s.singinLogo}>Restore <span className='text-oBut font-semibold'>password</span></div>
            {
                isError && (
                    <div className={s.error}>{errorText}</div>
                )
            }

            <FormInput
                value={emailLocal}
                changeValue={setEmailLocal}
                placeholder='Enter your email'
                name='Email'
            />
            <FormInput
                value={passwordLocal}
                changeValue={setPasswordLocal}
                placeholder='Enter new password'
                name='Password'
                eyeV={eyeVisib}
                eyeN={eyeNo}
            />
            <FormInput
                value={repeatPassword}
                changeValue={setRepeatPassword}
                placeholder='Repeat new password'
                name='Password'
                eyeV={eyeVisib}
                eyeN={eyeNo}
            />
            {
                isLoading && (
                    <div className={s.spinnerCont}><div className={s.spinner}><Spinner /></div></div>
                )
            }

            <div className='lg:-mb-20' ></div>

            <FormBtn
                name='Change pass'
                fc={registration}
            />

            <div className={s.reg1}>Miss click?  <Link to={'/login'} className={s.reg2}> Go back</Link></div>
        </div>
    )
}

export default Restore;

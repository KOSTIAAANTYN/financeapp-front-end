import React from 'react'
import s from './style.module.css'
import axios from 'axios';
import { mainAuthUrl, mainUrl } from 'urls';
import FormInput from 'components/FormInput';
import FormBtn from 'components/FormBtn';
import eyeVisib from '@imgs/eye-visib.svg';
import eyeNo from '@imgs/eye-no-visib.svg';
import Spinner from 'components/Spinner';
import { setHistory } from '@slices/userHistorySlice';
import { setUserData } from '@slices/profileSlice';
import { setCalendar, setOtherState } from '@slices/userPageSlice';
import { useAppDispatch } from 'hooks';
import { useNavigate, Link } from 'react-router-dom';
import { isValidEmail } from 'helpers';
import { startTokenRefresh, stopTokenRefresh } from 'auth';

function LoginModule({ isLoginPage }: { isLoginPage?: boolean }): JSX.Element {

    const dispatch = useAppDispatch();

    const [emailLocal, setEmailLocal] = React.useState<string>('');
    const [passwordLocal, setPasswordLocal] = React.useState<string>('');

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isError, setIsError] = React.useState<boolean>(false);
    const [errorText, setErrorText] = React.useState<string>('Error login or password');

    const navigate = useNavigate();

    const getAutorUser = React.useCallback(async () => {
        setIsLoading(true)
        setIsError(false)
        try {
            const jwt = localStorage.getItem('token');
            if (!jwt) {
                setIsLoading(false);
                return;
            }

            const res = await axios.post(`${mainUrl}loginAndCalendar`, {}, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Backend response:', res.data);
            
            dispatch(setUserData({
                email: res.data.email,
                username: res.data.username,
                userId: res.data.id,
                password: res.data.password 
            }));
            const sortedCalendar = [...res.data.calendar].sort((a: { id: number }, b: { id: number }) => a.id - b.id);
            dispatch(setCalendar(sortedCalendar));
            dispatch(setOtherState([res.data.globalTotal, res.data.weekTotal, res.data.isMonthly]));
            dispatch(setHistory(res.data.userHistory));
            
            navigate('/user-pannel');

            startTokenRefresh();
            setIsLoading(false);
        } catch (error: any) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                stopTokenRefresh();
            }
            setIsLoading(false);
        }
    }, [dispatch, navigate]);

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            getAutorUser();
        }
    }, [getAutorUser]);

    const login = async () => {
        if (isValidEmail(emailLocal) === false) {
            setErrorText('Invalid email');
            setIsError(true);
            return;
        }
        setIsLoading(true)
        setIsError(false)
        try {
            const res = await axios.post(`${mainAuthUrl}login`, { email: emailLocal, password: passwordLocal });
            
            const [jwt, refreshToken] = res.data.split(';');
            
            localStorage.setItem('token', jwt);
            localStorage.setItem('refreshToken', refreshToken);
        
            
             const userDataRes = await axios.post(`${mainUrl}loginAndCalendar`, {}, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            dispatch(setUserData({
                email: userDataRes.data.email,
                username: userDataRes.data.username,
                userId: userDataRes.data.id,
                password: userDataRes.data.password
            }));
            
            const sortedCalendar = [...userDataRes.data.calendar].sort((a: { id: number }, b: { id: number }) => a.id - b.id);
            dispatch(setCalendar(sortedCalendar));
            dispatch(setOtherState([
                userDataRes.data.globalTotal, 
                userDataRes.data.weekTotal, 
                userDataRes.data.isMonthly
            ]));
            dispatch(setHistory(userDataRes.data.userHistory));
            
            navigate('/user-pannel');

            startTokenRefresh();
            setEmailLocal('');
            setPasswordLocal('');
            setIsLoading(false);
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setErrorText('Invalid email or password');
                setIsError(true);
            } else {
                setErrorText('Server error');
                setIsError(true);
            }
            setIsLoading(false);
        }
    }

    return (
        <div className={`max-w-form w-full ${isLoginPage && 'bg-white p-5 sm:p-8 rounded-3xl'}`}>
            <div className={s.singinLogo}>Sing in <span className='text-oBut font-semibold'>{isLoginPage && 'Financary'}</span></div>
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
                placeholder='Enter your password'
                name='Password'
                eyeV={eyeVisib}
                eyeN={eyeNo}
            />
            <Link to={'/reset-password'} className={s.forgotPass} >Forgot password?</Link>
            {
                isLoading && (
                    <div className={s.spinnerCont}><div className={s.spinner}><Spinner /></div></div>
                )
            }

            <FormBtn
                name='Sing in'
                fc={login}
            />

            <div className={s.reg1}>New to Financary?  <Link to={'/registration'} className={s.reg2}> Create account</Link></div>
        </div>
    )
}

export default LoginModule;

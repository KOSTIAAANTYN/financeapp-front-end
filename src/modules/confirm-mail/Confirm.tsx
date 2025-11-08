import React from 'react'
import s from './style.module.css'
import FormInput from 'components/FormInput';
import FormBtn from 'components/FormBtn';
import Spinner from 'components/Spinner';

function Confirm({code, setCode, confirm, isLoading}: {isLoading: boolean;code: string; setCode: (value: string) => void; confirm: () => void}):JSX.Element {

    const [userCode, setUserCode] = React.useState<string>('');
    const [isDisabled, setIsDisabled] = React.useState<boolean>(true);
    React.useEffect(()=> {
        if (userCode === `${code}`) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [userCode, code])

    return (
        <div className={s.container}>
            <div className={s.singinLogo}>Confirm <span className='text-oBut font-semibold'>email</span></div>
            <div className='text-lg sm:text-xl pb-0 sm:pb-8 pt-2'>We sent code to your email</div>

            <FormInput
                value={userCode}
                changeValue={setUserCode}
                placeholder='12345678'
                name='Code'
            />
            {
                isLoading && (
                    <div className={s.spinnerCont}><div className={s.spinner}><Spinner/></div></div>
                )
            }

            <div className='lg:-mt-20' ></div>
            <FormBtn
                name='Create account'
                fc={confirm}
                isDisabled={isDisabled}
            />
            
            <div className={s.reg1}>Wrong email?  <span onClick={() => setCode('')} className={s.reg2}>Go back</span></div>
        </div>
    )
}

export default Confirm;

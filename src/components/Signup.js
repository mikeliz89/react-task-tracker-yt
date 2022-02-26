import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

export default function Signup() {

    const { t } = useTranslation();

    //states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {signup} = useAuth()
    const navigate = useNavigate()

    async function onSubmit(e) {
        e.preventDefault()

        //validation
        if(!email || !password || !passwordConfirm) {
            setError(t('please_fill_all_fields'))
            return
        }

        if(password != passwordConfirm) {
            setError(t('passwords_do_not_match'));
            return
        }

        try {
            //clear the error
            setError('')
            setLoading(true)
            await signup(email, password);
            //navigate to dashboard
            navigate('/');
        } catch(error) {
            setError(t('failed_to_create_account'));
            console.log(error)
        }

        setLoading(false)

        //clear the form
        setEmail('')
        setPassword('')
        setPasswordConfirm('')
    }

    return (
        <>
            <header className="header">
                <h1>{t('sign_up')}</h1>
            </header>
            { error && <div className="error">{error}</div> }
            <form className='add-form' onSubmit={onSubmit}>
                <div className='form-control'>
                    <label>{t('email')}</label>
                    <input type='email' placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='form-control'>
                    <label>{t('password')}</label>
                    <input type='password' placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='form-control'>
                    <label>{t('password_confirmation')}</label>
                    <input type='password' placeholder={t('password')} value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                </div>
                <input disabled={loading} type='submit' value={t('sign_up')} className='btn btn-block' />
            </form>

            <div className="text-center">
                {t('already_have_an_account')} <Link to="/login">{t('log_in')}</Link>   
            </div>
        </>
    )
}

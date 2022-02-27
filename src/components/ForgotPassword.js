import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {

    const { t } = useTranslation();

    //states
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const {resetPassword} = useAuth()

    async function onSubmit(e) {
        e.preventDefault()

        try {
            //clear 
            setError('')
            setMessage('')
            setLoading(true)
            await resetPassword(email);
            setMessage(t('check_your_inbox'));
        } catch(error) {
            setError(t('failed_to_reset_password'));
            console.log(error)
        }

        setLoading(false)
    }

    return (
        <div className="login-container">
            <header className="header">
                <h2>{t('password_reset')}</h2>
            </header>
            { error && <div className="error">{error}</div> }
            { message && <div className="success">{message}</div> }
            <form className='add-form' onSubmit={onSubmit}>
                <div className='form-control'>
                    <label>{t('email')}</label>
                    <input type='email' placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <input disabled={loading} type='submit' value={t('reset_password')} className='btn btn-block' />
            </form>
            <div className="text-center">
                <Link to="/login">{t('log_in')}</Link>
            </div>
            <div className="text-center">
                {t('need_an_account')} <Link to="/signup">{t('sign_up')}</Link>
            </div>
        </div>
    )
}

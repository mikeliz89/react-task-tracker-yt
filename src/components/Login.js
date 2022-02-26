import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

export default function Login() {

    const { t } = useTranslation();

    //states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {login} = useAuth()
    const navigate = useNavigate()

    async function onSubmit(e) {
        e.preventDefault()

        try {
            //clear the error
            setError('')
            setLoading(true)
            await login(email, password);
            //navigate to dashboard
            navigate('/');
        } catch(error) {
            setError(t('failed_to_log_in'));
            console.log(error)
        }

        setLoading(false)
    }

    return (
        <>
            <header className="header">
                <h1>{t('log_in')}</h1>
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
                <input disabled={loading} type='submit' value={t('log_in')} className='btn btn-block' />
            </form>

            <div className="text-center">
                {t('need_an_account')} <Link to="/signup">{t('sign_up')}</Link>
            </div>
        </>
    )
}

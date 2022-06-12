//react
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
//auth
import { useAuth } from '../../contexts/AuthContext';
//buttons
import Button from '../../components/Button';

export default function ForgotPassword() {

    const { t } = useTranslation('auth', { keyPrefix: 'auth' });

    //states
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { resetPassword } = useAuth()

    async function onSubmit(e) {
        e.preventDefault()

        try {
            //clear 
            setError('')
            setMessage('')
            setLoading(true)
            await resetPassword(email);
            setMessage(t('check_your_inbox'));
        } catch (error) {
            setError(t('failed_to_reset_password'));
            console.log(error)
        }

        setLoading(false)
    }

    return (
        <div className="login-container">
            <h3>{t('password_reset')}</h3>
            {error && <div className="error">{error}</div>}
            {message && <div className="success">{message}</div>}
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="forgotPasswordFormEmail">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control type='email' placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Button disabled={loading} type='submit' text={t('reset_password')} className='btn btn-block' />
            </Form>
            <div className="text-center">
                <Link to="/login">{t('log_in')}</Link>
            </div>
            <div className="text-center">
                {t('need_an_account')} <Link to="/signup">{t('sign_up')}</Link>
            </div>
        </div>
    )
}

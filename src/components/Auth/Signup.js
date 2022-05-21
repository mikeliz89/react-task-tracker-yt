import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap'
import Button from '../../components/Button'

export default function Signup() {

    const { t } = useTranslation();

    //states
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signup } = useAuth()
    const navigate = useNavigate()

    async function onSubmit(e) {
        e.preventDefault()

        //validation
        if (!email || !password || !passwordConfirm) {
            setError(t('please_fill_all_fields'))
            return
        }

        if (password !== passwordConfirm) {
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
        } catch (error) {
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
        <div className="login-container">
            <h3>{t('sign_up')}</h3>
            {error && <div className="error">{error}</div>}
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="signupFormEmail">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control type='email' placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="signupFormPassword">
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control type='password' placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="signupFormPasswordConfirmation">
                    <Form.Label>{t('password_confirmation')}</Form.Label>
                    <Form.Control type='password' placeholder={t('password')} value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                </Form.Group>
                <Button disabled={loading} type='submit' text={t('sign_up')} className='btn btn-block' />
            </Form>

            <div className="text-center">
                {t('already_have_an_account')} <Link to="/login">{t('log_in')}</Link>
            </div>
        </div>
    )
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Buttons/Button';
import Alert from '../Alert';
import PageTitle from '../Site/PageTitle';
import CenterWrapper from '../Site/CenterWrapper';
import { TRANSLATION, NAVIGATION, VARIANTS } from '../../utils/Constants';

export default function Login() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.AUTH });

    //states
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //auth
    const { login } = useAuth();

    //navigate
    const navigate = useNavigate();

    async function onSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            clearMessages();
            await login(email, password);
            //navigate to dashboard
            navigate('/');
        } catch (error) {
            setError(t('failed_to_log_in'));
            setShowError(true);
            console.log(error);
        }

        setLoading(false);
    }

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    return (
        <div className="login-container">

            <PageTitle title={t('log_in')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={VARIANTS.SUCCESS} onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="loginFormEmail">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control type='email' placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="loginFormPassword">
                    <Form.Label>{t('password')}</Form.Label>
                    <Form.Control type='password' placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button disabled={loading} type='submit' text={t('log_in')} className='btn btn-block' />
            </Form>
            <CenterWrapper>
                <Link to={NAVIGATION.FORGOT_PASSWORD}>{t('forgot_password')}</Link>
            </CenterWrapper>
            <CenterWrapper>
                {t('need_an_account')} <Link to={NAVIGATION.SIGNUP}>{t('sign_up')}</Link>
            </CenterWrapper>
        </div>
    )
}

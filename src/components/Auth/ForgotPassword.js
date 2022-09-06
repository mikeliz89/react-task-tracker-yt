//react
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
//auth
import { useAuth } from '../../contexts/AuthContext';
//buttons
import Button from '../../components/Button';
//alert
import Alert from '../Alert';
//pagetitle
import PageTitle from '../PageTitle';
import CenterWrapper from '../CenterWrapper';

export default function ForgotPassword() {

    const { t } = useTranslation('auth', { keyPrefix: 'auth' });

    //states
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    async function onSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            clearMessages();
            await resetPassword(email);
            showSuccess();
        } catch (error) {
            console.log(error);
            showFailure();
        }

        setLoading(false);
    }

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    function showSuccess() {
        setMessage(t('check_your_inbox'));
        setShowMessage(true);
    }

    function showFailure() {
        setError(t('failed_to_reset_password'));
        setShowError(true);
    }

    return (
        <div className="login-container">

            <PageTitle title={t('password_reset')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='info' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="forgotPasswordFormEmail">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control type='email' placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Button disabled={loading} type='submit' text={t('reset_password')} className='btn btn-block' />
            </Form>
            <CenterWrapper>
                <Link to="/login">{t('log_in')}</Link>
            </CenterWrapper>
            <CenterWrapper>
                {t('need_an_account')} <Link to="/signup">{t('sign_up')}</Link>
            </CenterWrapper>
        </div>
    )
}

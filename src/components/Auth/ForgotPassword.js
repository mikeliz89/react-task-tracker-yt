import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Buttons/Button';
import Alert from '../Alert';
import PageTitle from '../Site/PageTitle';
import CenterWrapper from '../Site/CenterWrapper';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';

export default function ForgotPassword() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.AUTH });

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
                variant={VARIANTS.INFO} onClose={() => { setShowMessage(false); setShowError(false); }} 
            />

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="forgotPasswordFormEmail">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control type='email' placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Button disabled={loading} type='submit' text={t('reset_password')} className='btn btn-block' />
            </Form>
            <CenterWrapper>
                <Link to={NAVIGATION.LOGIN}>{t('log_in')}</Link>
            </CenterWrapper>
            <CenterWrapper>
                {t('need_an_account')} <Link to={NAVIGATION.SIGNUP}>{t('sign_up')}</Link>
            </CenterWrapper>
        </div>
    )
}

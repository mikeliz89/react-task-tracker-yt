

//states

import { useState } from 'react';

import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { TRANSLATION, NAVIGATION, VARIANTS } from '../../utils/Constants';
import Alert from '../Alert';
import Button from '../Buttons/Button';
import { useAlert } from '../Hooks/useAlert';
import CenterWrapper from '../Site/CenterWrapper';
import PageTitle from '../Site/PageTitle';

export default function Signup() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.AUTH });
const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    //auth
    const { signup } = useAuth();

    //navigate
    const navigate = useNavigate();

    async function onSubmit(e) {
        e.preventDefault();

        //validation
        if (!email || !password || !passwordConfirm) {
            showFailure('please_fill_all_fields');
            return;
        }

        if (password !== passwordConfirm) {
            showFailure('passwords_do_not_match');
            return;
        }

        try {
            setLoading(true);
            clearMessages();
            await signup(email, password);
            //navigate to dashboard
            navigate('/');
        } catch (error) {
            showFailure('failed_to_create_account');
            console.warn(error);
        }

        setLoading(false);

        clearForm();
    }


    const clearForm = () => {
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
    }

    return (
        <div className="login-container">

            <PageTitle title={t('sign_up')} />

            <Alert 
            message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

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
            <CenterWrapper>
                {t('already_have_an_account')} <Link to={NAVIGATION.LOGIN}>{t('log_in')}</Link>
            </CenterWrapper>
        </div>
    )
}




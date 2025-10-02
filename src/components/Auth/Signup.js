import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import Alert from '../Alert';
import PageTitle from '../Site/PageTitle';
import CenterWrapper from '../Site/CenterWrapper';
import * as Constants from '../../utils/Constants';

export default function Signup() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_AUTH });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

    //states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

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
            console.log(error);
            showFailure('failed_to_create_account');
        }

        setLoading(false);

        clearForm();
    }

    function showFailure(content) {
        setShowError(true);
        setError(t(content));
    }

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
    }

    return (
        <div className="login-container">

            <PageTitle title={t('sign_up')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS} onClose={() => { setShowMessage(false); setShowError(false); }} 
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
                {t('already_have_an_account')} <Link to={Constants.NAVIGATION_LOGIN}>{t('log_in')}</Link>
            </CenterWrapper>
        </div>
    )
}

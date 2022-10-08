import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import Alert from '../Alert';
import * as Constants from '../../utils/Constants';

export default function Logout() {

    //auth
    const { logout } = useAuth();

    //navigate
    const navigate = useNavigate();

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_AUTH, { keyPrefix: Constants.TRANSLATION_AUTH });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    async function handleLogout() {
        try {
            clearMessages();
            await logout();
            navigate(Constants.NAVIGATION_LOGIN);
        } catch (error) {
            console.log(error);
            setError(t('failed_to_log_out'));
            setShowError(true);
        }
    }

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    return (
        <>
            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <Button
                iconName={Constants.ICON_SIGN_OUT_ALT}
                onClick={() => handleLogout()}
                text={t('log_out')}
                color="gray"
                className="btn" />
        </>
    )
}

//react
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//auth
import { useAuth } from '../../contexts/AuthContext';
//button
import Button from '../../components/Button';
//alert
import Alert from '../Alert';
//utils
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
            navigate('/login');
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
                iconName='sign-out-alt'
                onClick={() => handleLogout()}
                text={t('log_out')}
                color="gray"
                className="btn" />
        </>
    )
}

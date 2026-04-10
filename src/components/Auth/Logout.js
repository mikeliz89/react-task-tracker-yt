

//navigate

import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { TRANSLATION, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import Alert from '../Alert';
import Button from '../Buttons/Button';
import { useAlert } from '../Hooks/useAlert';

export default function Logout() {

    //auth
    const { logout } = useAuth();

const navigate = useNavigate();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.AUTH });

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

    async function handleLogout() {
        try {
            clearMessages();
            await logout();
            navigate(NAVIGATION.LOGIN);
        } catch (error) {
            showFailure(t('failed_to_log_out'));
            console.warn(error);
        }
    }


    return (
        <>
            <Alert message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

            <Button
                iconName={ICONS.SIGN_OUT_ALT}
                onClick={() => handleLogout()}
                color={COLORS.BUTTON_GRAY}
                className="btn"
            />
        </>
    )
}




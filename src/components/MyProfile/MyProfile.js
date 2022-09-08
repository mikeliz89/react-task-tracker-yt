import Button from '../../components/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Constants from "../../utils/Constants";

export default function MyProfile() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MYPROFILE, { keyPrefix: Constants.TRANSLATION_MYPROFILE });

    //navigate
    const navigate = useNavigate();

    //location
    const location = useLocation();

    const navigateTo = () => {
        if (location.pathname !== Constants.NAVIGATION_MANAGE_MY_PROFILE) {
            navigate(Constants.NAVIGATION_MANAGE_MY_PROFILE);
        }
    }

    return (
        <>
            <Button
                iconName='user-alt'
                text={t('button_myprofile')}
                onClick={() => navigateTo()} />
        </>
    )
}

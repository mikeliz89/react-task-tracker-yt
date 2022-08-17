//Buttons
import Button from '../../components/Button';
//react
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MyProfile() {

    //translation
    const { t } = useTranslation('myprofile', { keyPrefix: 'myprofile' });

    //navigate
    const navigate = useNavigate();

    //location
    const location = useLocation();

    const navigateTo = () => {
        if (location.pathname !== '/managemyprofile') {
            navigate('/managemyprofile');
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

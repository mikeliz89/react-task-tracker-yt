import Button from '../../components/Button'
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MyProfile() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const navigateTo = () => {
        if(location.pathname !== '/managemyprofile') {
            navigate('/managemyprofile');
        }
    }

    return (
        <>
            <Button 
                text={t('button_myprofile')}
                onClick={() => navigateTo()} />
        </>
    )
}

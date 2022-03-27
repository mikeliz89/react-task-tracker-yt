import Button from '../../components/Button'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {

    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <Button 
                text={t('button_myprofile')}
                onClick={() => navigate('/managemyprofile')} />
        </>
    )
}

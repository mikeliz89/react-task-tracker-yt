import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';

export default function ManageMyProfile() {
    
    const { t } = useTranslation();

    return (
        <div> 
            <GoBackButton />
            <h3 className="page-title">{t('manage_myprofile_title')}</h3>
            <p className="text-center">{t('manage_exercises_coming_soon')}</p>
        </div>
    )
}

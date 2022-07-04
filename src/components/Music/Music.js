//react
import { useTranslation } from 'react-i18next';
//buttons
import GoBackButton from '../GoBackButton';

export default function Music() {

    const { t } = useTranslation('music', { keyPrefix: 'music' });

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('music_title')}</h3>
            <p className="text-center">{t('coming_soon')}</p>
        </div>
    )
}

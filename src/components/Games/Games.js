//react
import { useTranslation } from 'react-i18next';
//buttons
import GoBackButton from '../GoBackButton';

export default function Games() {

    const { t } = useTranslation('games', { keyPrefix: 'games' });

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('games_title')}</h3>
            <p className="text-center">{t('coming_soon')}</p>
        </div>
    )
}

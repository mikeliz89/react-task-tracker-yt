//react
import { useTranslation } from 'react-i18next';
//buttons
import GoBackButton from '../GoBackButton';
import PageTitle from '../PageTitle';

export default function Games() {

    const { t } = useTranslation('games', { keyPrefix: 'games' });

    return (
        <div>
            <GoBackButton />
            <PageTitle title={t('games_title')} />
            <p className="text-center">{t('coming_soon')}</p>
        </div>
    )
}

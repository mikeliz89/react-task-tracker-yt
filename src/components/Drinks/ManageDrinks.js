import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';

export default function ManageDrinks() {

    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('manage_drinks_title')}</h3>
            <p className="text-center">{t('coming_soon')}</p>
        </div>
    )
}

//react
import { useTranslation } from 'react-i18next';
//buttons
import GoBackButton from '../GoBackButton';

export default function ManageBackPacking() {

    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('manage_backpacking_title')}</h3>
            <p className="text-center">{t('coming_soon')}</p>
        </div>
    )
}

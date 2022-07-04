//react
import { useTranslation } from 'react-i18next';
//buttons
import GoBackButton from '../GoBackButton';

export default function Car() {

    const { t } = useTranslation('car', { keyPrefix: 'car' });

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('car_title')}</h3>
            <p className="text-center">{t('coming_soon')}</p>
        </div>
    )
}

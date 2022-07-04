//react
import { useTranslation } from 'react-i18next';
//buttons
import GoBackButton from '../GoBackButton';

export default function LinksList() {

    const { t } = useTranslation('links', { keyPrefix: 'links' });

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('links_list_title')}</h3>
            <p className="text-center">{t('coming_soon')}</p>
        </div>
    )
}

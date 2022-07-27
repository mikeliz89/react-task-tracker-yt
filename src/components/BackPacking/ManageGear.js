//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//buttons
import GoBackButton from '../GoBackButton';

export default function ManageGear() {

    //translation
    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('manage_backpacking_title')}</h3>

            <div className="page-content">
                <p>Varusteeni</p>
            </div>
        </div>
    )
}

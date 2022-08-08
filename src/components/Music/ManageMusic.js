//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//buttons
import GoBackButton from '../GoBackButton';

export default function ManageMusic() {

    const { t } = useTranslation('music', { keyPrefix: 'music' });

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('music_title')}</h3>
            <div className="page-content">
                <Link to="/bandsseenlive" className='btn btn-primary'>{t('manage_bands_seen_live_button')}</Link>
            </div>
        </div>
    )
}

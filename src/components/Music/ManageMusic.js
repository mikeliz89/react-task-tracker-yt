//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//buttons
import GoBackButton from '../GoBackButton';
import PageTitle from '../PageTitle';

export default function ManageMusic() {

    const { t } = useTranslation('music', { keyPrefix: 'music' });

    return (
        <div>
            <GoBackButton />
            <PageTitle title={t('music_title')} />
            <div className="page-content">
                <Link to="/bandsseenlive" className='btn btn-primary'>{t('manage_bands_seen_live_button')}</Link>
            </div>
        </div>
    )
}

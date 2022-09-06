//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//buttons
import GoBackButton from '../GoBackButton';
//icon
import Icon from '../Icon';
//page
import PageContentWrapper from '../PageContentWrapper';
//pagetitle
import PageTitle from '../PageTitle';

export default function ManageMusic() {

    //translation
    const { t } = useTranslation('music', { keyPrefix: 'music' });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('music_title')} />
            {/* <Link to="/bandsseenlive" className='btn btn-primary'>{t('button_bands_seen_live')}</Link>
                &nbsp; */}
            <Link to="/managemusiclists" className='btn btn-primary'>
                <Icon name='list-alt' color='white' />
                {t('button_music_lists')}
            </Link>
        </PageContentWrapper>
    )
}

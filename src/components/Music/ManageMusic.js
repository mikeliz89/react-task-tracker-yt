import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GoBackButton from '../Buttons/GoBackButton';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import * as Constants from '../../utils/Constants';

export default function ManageMusic() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('music_title')} />
            <Link to={Constants.NAVIGATION_MANAGE_MUSICLISTS} className='btn btn-primary'>
                <Icon name={Constants.ICON_LIST_ALT} color='white' />
                {t('button_music_lists')}
            </Link>
        </PageContentWrapper>
    )
}

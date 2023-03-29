import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GoBackButton from '../Buttons/GoBackButton';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import * as Constants from '../../utils/Constants';

export default function Games() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MOVIES, { keyPrefix: Constants.TRANSLATION_MOVIES });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('movies_title')} />
            <div>
                <Link to={Constants.NAVIGATION_MANAGE_MOVIELISTS} className='btn btn-primary'>
                    <Icon name={Constants.ICON_LIST_ALT} color='white' />
                    {t('button_movie_lists')}
                </Link>
            </div>
        </PageContentWrapper>
    )
}

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GoBackButton from '../GoBackButton';
import Icon from '../Icon';
import PageContentWrapper from '../PageContentWrapper';
import PageTitle from '../PageTitle';
import * as Constants from '../../utils/Constants';

export default function Games() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MOVIES, { keyPrefix: Constants.TRANSLATION_MOVIES });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('movies_title')} />
            <div>
                <Link to="/managemovielists" className='btn btn-primary'>
                    <Icon name='list-alt' color='white' />
                    {t('button_movie_lists')}
                </Link>
            </div>
        </PageContentWrapper>
    )
}
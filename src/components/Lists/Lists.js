import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GoBackButton from '../GoBackButton';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import * as Constants from '../../utils/Constants';

export default function Lists() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_LISTS, { keyPrefix: Constants.TRANSLATION_LISTS });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('games_title')} />
            <div>
                <Link to={Constants.NAVIGATION_MANAGE_LISTS} className='btn btn-primary'>
                    <Icon name={Constants.ICON_LIST_ALT} color='white' />
                    {t('button_lists')}
                </Link>
            </div>
        </PageContentWrapper>
    )
}

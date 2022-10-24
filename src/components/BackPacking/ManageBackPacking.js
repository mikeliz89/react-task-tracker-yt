import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GoBackButton from '../GoBackButton';
import PageTitle from '../Site/PageTitle';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import * as Constants from '../../utils/Constants';

export default function ManageBackPacking() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('manage_backpacking_title')} />
            <Link to={Constants.NAVIGATION_MANAGE_GEAR} className='btn btn-primary'>{t('button_manage_gear')}</Link>
            &nbsp;
            <Link to={Constants.NAVIGATION_MANAGE_GEAR_MAINTENANCE} className='btn btn-primary'>
                {t('button_manage_gear_maintenance')}
            </Link>
            &nbsp;
            <Link to={Constants.NAVIGATION_MANAGE_BACKPACKINGLISTS} className='btn btn-primary'>
                <Icon name={Constants.ICON_LIST_ALT} color='white' />
                {t('button_manage_backpacking_lists')}
            </Link>
        </PageContentWrapper>
    )
}

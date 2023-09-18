import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GoBackButton from '../Buttons/GoBackButton';
import PageTitle from '../Site/PageTitle';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import * as Constants from '../../utils/Constants';
import { ButtonGroup, Row } from 'react-bootstrap';

export default function ManageBackPacking() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    return (
        <PageContentWrapper>

            <PageTitle title={t('manage_backpacking_title')} />

            <Row>

                <ButtonGroup>
                    <GoBackButton />
                    <Link to={Constants.NAVIGATION_MANAGE_GEAR} className='btn btn-primary'>
                        {t('button_manage_gear')}
                    </Link>

                    <Link to={Constants.NAVIGATION_MANAGE_GEAR_MAINTENANCE} className='btn btn-primary'>
                        {t('button_manage_gear_maintenance')}
                    </Link>

                    <Link to={Constants.NAVIGATION_MANAGE_BACKPACKINGLISTS} className='btn btn-primary'>
                        <Icon name={Constants.ICON_LIST_ALT} color={Constants.COLOR_WHITE} />
                        {t('button_manage_backpacking_lists')}
                    </Link>
                </ButtonGroup>
            </Row>
        </PageContentWrapper>
    )
}

import { useTranslation } from 'react-i18next';
import GoBackButton from '../Buttons/GoBackButton';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import * as Constants from '../../utils/Constants';
import { ButtonGroup, Row } from 'react-bootstrap';
import NavButton from '../Buttons/NavButton';

export default function ManageBackPacking() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    return (
        <PageContentWrapper>

            <PageTitle title={t('manage_backpacking_title')} />

            <Row>

                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={Constants.NAVIGATION_MANAGE_GEAR}>
                        {t('button_manage_gear')}
                    </NavButton>
                    <NavButton to={Constants.NAVIGATION_MANAGE_GEAR_MAINTENANCE}>
                        {t('button_manage_gear_maintenance')}
                    </NavButton>
                    <NavButton to={Constants.NAVIGATION_MANAGE_BACKPACKINGLISTS}
                        icon={Constants.ICON_LIST_ALT}>
                        {t('button_manage_backpacking_lists')}
                    </NavButton >
                </ButtonGroup>
            </Row>
        </PageContentWrapper>
    )
}

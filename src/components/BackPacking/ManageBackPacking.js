import { ButtonGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, ICONS, NAVIGATION } from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import NavButton from '../Buttons/NavButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';

export default function ManageBackPacking() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
    return (
        <PageContentWrapper>

            <PageTitle title={t('manage_backpacking_title')} iconName={ICONS.CAMPGROUND} />

            <Row>

                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={NAVIGATION.MANAGE_GEAR}>
                        {t('button_manage_gear')}
                    </NavButton>
                    <NavButton to={NAVIGATION.MANAGE_GEAR_MAINTENANCE}>
                        {t('button_manage_gear_maintenance')}
                    </NavButton>
                    <NavButton to={NAVIGATION.MANAGE_BACKPACKINGLISTS}
                        icon={ICONS.LIST_ALT}>
                        {t('button_manage_backpacking_lists')}
                    </NavButton >
                </ButtonGroup>
            </Row>
        </PageContentWrapper>
    )
}




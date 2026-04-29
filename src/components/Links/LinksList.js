import { ButtonGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { pushToFirebase } from '../../datatier/datatier';

import { TRANSLATION, DB, ICONS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import GoBackButton from '../Buttons/GoBackButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';

import LinkComponent from './LinkComponent';

export default function LinksList() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.LINKS });
    const addLink = (link) => {
        link["created"] = getCurrentDateAsJson();
        pushToFirebase(DB.LINKS, link);
    }

    return (
        <PageContentWrapper>

            <PageTitle title={t('header')} iconName={ICONS.EXTERNAL_LINK_ALT} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>
            <LinkComponent onSaveLink={addLink} url={DB.LINKS} />
        </PageContentWrapper>
    )
}




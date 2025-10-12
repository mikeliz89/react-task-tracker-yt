import GoBackButton from '../Buttons/GoBackButton';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebase } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import LinkComponent from './LinkComponent';
import PageTitle from '../Site/PageTitle';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row } from 'react-bootstrap';

export default function LinksList() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.LINKS });

    const addLink = (link) => {
        link["created"] = getCurrentDateAsJson();
        pushToFirebase(DB.LINKS, link);
    }

    return (
        <PageContentWrapper>
            <PageTitle title={t('header')} />
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>
            <LinkComponent onSaveLink={addLink} url={DB.LINKS} />
        </PageContentWrapper>
    )
}

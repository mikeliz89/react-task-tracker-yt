import GoBackButton from '../Buttons/GoBackButton';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebase } from '../../datatier/datatier';
import * as Constants from '../../utils/Constants';
import LinkComponent from './LinkComponent';
import PageTitle from '../Site/PageTitle';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row } from 'react-bootstrap';

export default function LinksList() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_LINKS });

    const addLink = (link) => {
        link["created"] = getCurrentDateAsJson();
        pushToFirebase(Constants.DB_LINKS, link);
    }

    return (
        <PageContentWrapper>
            <PageTitle title={t('header')} />
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>
            <LinkComponent onSaveLink={addLink} url={Constants.DB_LINKS} />
        </PageContentWrapper>
    )
}

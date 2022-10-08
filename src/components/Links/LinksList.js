import GoBackButton from '../GoBackButton';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import PageContentWrapper from '../PageContentWrapper';
import { pushToFirebase } from '../../datatier/datatier';
import * as Constants from '../../utils/Constants';
import LinkComponent from './LinkComponent';

export default function LinksList() {

    const addLink = (link) => {
        link["created"] = getCurrentDateAsJson();
        pushToFirebase(Constants.DB_LINKS, link);
    }

    return (
        <PageContentWrapper>
            <GoBackButton />
            <LinkComponent onSaveLink={addLink} url={Constants.DB_LINKS} />
        </PageContentWrapper>
    )
}

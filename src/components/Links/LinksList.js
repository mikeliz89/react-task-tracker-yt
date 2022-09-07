import GoBackButton from '../GoBackButton';
import AddLink from './AddLink';
import Links from './Links';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import PageContentWrapper from '../PageContentWrapper';
import { pushToFirebase } from '../../datatier/datatier';
import * as Constants from '../../utils/Constants';

export default function LinksList() {

    const addLink = (link) => {
        link["created"] = getCurrentDateAsJson();
        pushToFirebase(Constants.DB_LINKS, link);
    }

    return (
        <PageContentWrapper>
            <GoBackButton />
            <AddLink onSaveLink={addLink} />
            <Links url={'links'} />
        </PageContentWrapper>
    )
}

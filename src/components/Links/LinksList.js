import GoBackButton from '../GoBackButton';
import AddLink from './AddLink';
import Links from './Links';
import { ref, push } from 'firebase/database';
import { db } from '../../firebase-config';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import PageContentWrapper from '../PageContentWrapper';

export default function LinksList() {

    const addLink = (link) => {
        link["created"] = getCurrentDateAsJson();
        const dbref = ref(db, '/links');
        push(dbref, link);
    }

    return (
        <PageContentWrapper>
            <GoBackButton />
            <AddLink onSaveLink={addLink} />
            <Links url={'links'} />
        </PageContentWrapper>
    )
}

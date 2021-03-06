//buttons
import GoBackButton from '../GoBackButton';
//Links
import AddLink from './AddLink';
import Links from './Links';
//firebase
import { ref, push } from 'firebase/database';
import { db } from '../../firebase-config';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

export default function LinksList() {

    const addLink = (link) => {
        link["created"] = getCurrentDateAsJson();
        const dbref = ref(db, '/links');
        push(dbref, link);
    }

    return (
        <div>
            <GoBackButton />
            <div className="page-content">
                <AddLink onSaveLink={addLink} />
                <Links url={'links'} />
            </div>
        </div>
    )
}

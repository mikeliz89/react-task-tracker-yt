import { useState } from 'react';

import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { DB } from '../../utils/Constants';
import ListRow from '../Site/ListRow';
import AddGarnish from './AddGarnish';

export default function Garnish({ garnish, drinkID, onDelete }) {

    const [editable, setEditable] = useState(false);

    const updateGarnish = (drinkID, newGarnish) => {
        updateToFirebaseByIdAndSubId(DB.DRINK_GARNISHES, drinkID, garnish.id, newGarnish);
        setEditable(false);
    };

    return (
        <>
            <ListRow
                headerTitle={garnish.name}
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={drinkID}
                deleteSubId={garnish.id}
            />
            {editable && (
                <AddGarnish
                    garnishID={garnish.id}
                    drinkID={drinkID}
                    onSave={updateGarnish}
                    onDelete={onDelete}
                    onClose={() => setEditable(false)}
                />
            )}
        </>
    );
}
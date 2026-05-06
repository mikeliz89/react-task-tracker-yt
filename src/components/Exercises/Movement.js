import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TRANSLATION, NAVIGATION, DB } from '../../utils/Constants';
import { getMovementCategoryNameByID } from '../../utils/ListUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import ListRow from '../Site/ListRow';
import { useState } from 'react';
import AddMovement from './AddMovement';

export default function Movement({ movement, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
    const [editable, setEditable] = useState(false);

    const updateMovement = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.EXERCISE_MOVEMENTS, movement.id, object);
        setEditable(false);
    };

    return (
        <ListRow
            item={movement}
            dbKey={DB.MOVEMENT}
            headerProps={{
                title: <Link
                    style={{ textDecoration: 'none' }}
                    to={`${NAVIGATION.MOVEMENT}/${movement.id}`}>{movement.name}</Link>
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={movement.id}
            section={
                <>
                    <p>
                        {movement.category > 0 ?
                            (<span> {'#' + t('movementcategory_' + getMovementCategoryNameByID(movement.category))}</span>) : ('')}
                    </p>
                    <p>{movement.description}</p>
                </>
            }
            modalProps={{
                modalTitle: t('modal_header_edit_movement'),
                modalBody: (
                    <AddMovement
                        movementID={movement.id}
                        onSave={updateMovement}
                        onClose={() => setEditable(false)}
                    />
                )
            }}
        />
    );
}



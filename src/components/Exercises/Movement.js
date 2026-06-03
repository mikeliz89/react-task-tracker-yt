import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TRANSLATION, NAVIGATION, DB } from '../../utils/Constants';
import { getMovementCategoryNameByID } from '../../utils/ListUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import ListRow from '../Site/ListRow';
import { useState } from 'react';
import AddMovement from './AddMovement';

export default function Movement({ item, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
    const [editable, setEditable] = useState(false);

    const updateMovement = (id, payload) => {
        payload["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.EXERCISE_MOVEMENTS, id, payload);
        setEditable(false);
    };

    return (
        <ListRow
            item={item}
            dbKey={DB.MOVEMENT}
            headerProps={{
                title: <Link
                    style={{ textDecoration: 'none' }}
                    to={`${NAVIGATION.MOVEMENT}/${item.id}`}>{item.name}</Link>
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            section={
                <>
                    <p>
                        {item.category > 0 ?
                            (<span> {'#' + t('movementcategory_' + getMovementCategoryNameByID(item.category))}</span>) : ('')}
                    </p>
                    <p>{item.description}</p>
                </>
            }
            modalProps={{
                modalTitle: t('modal_header_edit_movement'),
                modalBody: (
                    <AddMovement
                        movementID={item.id}
                        onSave={updateMovement}
                        onClose={() => setEditable(false)}
                    />
                )
            }}
        />
    );
}



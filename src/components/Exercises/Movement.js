import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TRANSLATION, NAVIGATION } from '../../utils/Constants';
import { getMovementCategoryNameByID } from '../../utils/ListUtils';
import DeleteButton from '../Buttons/DeleteButton';

import StarRating from '../StarRating/StarRating';
import ListRow from '../Site/ListRow';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import AddMovement from './AddMovement';

export default function Movement({ movement, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
    const [editable, setEditable] = useState(false);

    const updateMovement = (object) => {
        // TODO: implement update logic if needed
        setEditable(false);
    };

    return (
        <>
            <ListRow
                headerTitle={
                    <Link
                        style={{ textDecoration: 'none' }}
                        to={`${NAVIGATION.MOVEMENT}/${movement.id}`}>{movement.name}</Link>
                }
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={movement.id}
                starCount={movement.stars}
            >
                <p>
                    {movement.category > 0 ?
                        (<span> {'#' + t('movementcategory_' + getMovementCategoryNameByID(movement.category))}</span>) : ('')}
                </p>
                <p>{movement.description}</p>
            </ListRow>
            <Modal show={editable} onHide={() => setEditable(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_movement')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddMovement
                        movementID={movement.id}
                        onSave={updateMovement}
                        onClose={() => setEditable(false)}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}



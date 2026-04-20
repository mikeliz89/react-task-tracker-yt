//alert
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { Languages } from '../../Languages';
import { TRANSLATION, NAVIGATION, DB } from "../../utils/Constants";
import { getCurrentDateAsJson, getJsonAsDateString } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import ListRow from '../Site/ListRow';
import { Modal } from 'react-bootstrap';

import AddPerson from './AddPerson';

export default function Person({ person, onDelete }) {
    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.PEOPLE });
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages
    } = useAlert();
    const [editable, setEditable] = useState(false);
    const updatePerson = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.PEOPLE, person.id, object);
        setEditable(false);
    };
    return (
        <>
            <ListRow
                headerTitle={person.name}
                headerTitleTo={`${NAVIGATION.PERSON}/${person.id}`}
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={person.id}
                alert={{
                    message,
                    showMessage,
                    error,
                    showError,
                    onClose: clearMessages,
                }}
            >
                {!editable && (
                    <>
                        <p>{t('birthday') + ": "}{getJsonAsDateString(person.birthday, Languages.FI)}</p>
                        <p>{person.description}</p>
                    </>
                )}
            </ListRow>
            <Modal show={editable} onHide={() => setEditable(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_person')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddPerson
                        personID={person.id}
                        onSave={updatePerson}
                        onClose={() => setEditable(false)}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}




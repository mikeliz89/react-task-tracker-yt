//alert
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import i18n from 'i18next';
import { TRANSLATION, NAVIGATION, DB } from "../../utils/Constants";
import { getCurrentDateAsJson, getJsonAsDateString } from '../../utils/DateTimeUtils';
import dayjs from 'dayjs';
import { useAlert } from '../Hooks/useAlert';
import ListRow from '../Site/ListRow';

import AddPerson from './AddPerson';

export default function Person({ person, onDelete }) {
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
    // Laske ikä jos syntymäpäivä on olemassa
    let age = null;
    if (person.birthday) {
        const birth = dayjs(person.birthday);
        const now = dayjs();
        age = now.diff(birth, 'year');
    }
    return (
        <ListRow
            item={person}
            dbKey={DB.PEOPLE}
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
            section={
                <>
                    <p>{t('birthday') + ": "}{getJsonAsDateString(person.birthday, i18n.language)}{age !== null ? ` (${age} ${t('years')})` : ''}</p>
                    <p>{person.description}</p>
                </>
            }
            modalTitle={t('modal_header_edit_person')}
            modalBody={
                <AddPerson
                    personID={person.id}
                    onSave={updatePerson}
                    onClose={() => setEditable(false)}
                />
            }
        />
    );
}




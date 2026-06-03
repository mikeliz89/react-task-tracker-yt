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

export default function Person({ item, onDelete }) {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.PEOPLE });

    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages
    } = useAlert();

    const [editable, setEditable] = useState(false);

    const updatePerson = (updatePersonID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.PEOPLE, updatePersonID, object);
        setEditable(false);
    };

    // Laske ikä jos syntymäpäivä on olemassa
    let age = null;
    if (item.birthday) {
        const birth = dayjs(item.birthday);
        const now = dayjs();
        age = now.diff(birth, 'year');
    }
    return (
        <ListRow
            item={item}
            dbKey={DB.PEOPLE}
            headerProps={{
                title: item.name,
                titleTo: `${NAVIGATION.PERSON}/${item.id}`,
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            alert={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
            }}
            section={
                <>
                    <p>{t('birthday') + ": "}{getJsonAsDateString(item.birthday, i18n.language)}{age !== null ? ` (${age} ${t('years')})` : ''}</p>
                    <p>{item.description}</p>
                </>
            }
            modalProps={{
                modalTitle: t('modal_header_edit_person'),
                modalBody: (
                    <AddPerson
                        personID={item.id}
                        onSave={updatePerson}
                        onClose={() => setEditable(false)}
                    />
                )
            }}
        />
    );
}




import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import ListRow from '../Site/ListRow';

import AddEvent from './AddEvent';

export default function Event({ item, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const [editable, setEditable] = useState(false);

    const updateEvent = (updateEventID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.MUSIC_EVENTS, updateEventID, object);
        setEditable(false);
    }

    const eventTitle = `${item.name} ${item.eventYear > 0 ? `(${item.eventYear})` : ''}`.trim();

    return (
        <ListRow
            item={item}
            dbKey={DB.MUSIC_EVENTS}
            headerProps={{
                title: eventTitle,
                titleTo: `${NAVIGATION.MUSIC_EVENT}/${item.id}`
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            section={<p>{item.description}</p>}
            modalProps={{
                modalTitle: t('modal_header_edit_event') || 'Edit Event',
                modalBody: (
                    <AddEvent
                        eventID={item.id}
                        onClose={() => setEditable(false)}
                        onSave={updateEvent}
                        showLabels={true}
                    />
                )
            }}
        />
    )
}




import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import ListRow from '../Site/ListRow';

import AddEvent from './AddEvent';

export default function Event({ event, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const [editable, setEditable] = useState(false);

    const updateEvent = (updateEventID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.MUSIC_EVENTS, updateEventID, object);
        setEditable(false);
    }

    const eventTitle = `${event.name} ${event.eventYear > 0 ? `(${event.eventYear})` : ''}`.trim();

    return (
        <ListRow
            headerTitle={eventTitle}
            headerTitleTo={`${NAVIGATION.MUSIC_EVENT}/${event.id}`}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={event.id}
            starCount={event.stars}
            section={<p>{event.description}</p>}
            modalTitle={t('modal_header_edit_event') || 'Edit Event'}
            modalBody={
                <AddEvent
                    eventID={event.id}
                    onClose={() => setEditable(false)}
                    onSave={updateEvent}
                    showLabels={true}
                />
            }
        />
    )
}




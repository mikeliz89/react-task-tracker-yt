


//states

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import NavButton from '../Buttons/NavButton';
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

    return (
        <ListRow
            headerLeft={
                <span>
                    <NavButton to={`${NAVIGATION.MUSIC_EVENT}/${event.id}`} className="">
                        {event.name} {event.eventYear > 0 ? '(' + event.eventYear + ')' : ''}
                    </NavButton>
                </span>
            }
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={event.id}
            starCount={event.stars}
        >
            {!editable &&
                <p>
                    {event.description}
                </p>
            }

            {
                editable && <AddEvent
                    eventID={event.id}
                    onClose={() => setEditable(false)}
                    onSave={updateEvent}
                    showLabels={false} />
            }
        </ListRow>
    )
}




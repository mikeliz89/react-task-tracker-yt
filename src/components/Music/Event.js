import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddEvent from './AddEvent';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

export default function Event({ event, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });

    //states
    const [editable, setEditable] = useState(false);

    const updateEvent = (updateEventID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.MUSIC_EVENTS, updateEventID, object);
        setEditable(false);
    }

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    {event.name} {event.eventYear > 0 ? '(' + event.eventYear + ')' : ''}
                </span>
                <RightWrapper>
                    <EditButton
                        editable={editable}
                        setEditable={setEditable}
                    />
                    <DeleteButton
                        onDelete={onDelete}
                        id={event.id}
                    />
                </RightWrapper>
            </h5>
            {!editable &&
                <p>
                    {event.description}
                </p>
            }
            {!editable &&
                <p>
                    <Link className='btn btn-primary' to={`${NAVIGATION.MUSIC_EVENT}/${event.id}`}>{t('view_details')}</Link>
                </p>
            }
            <StarRating starCount={event.stars} />

            {
                editable && <AddEvent
                    eventID={event.id}
                    onClose={() => setEditable(false)}
                    onSave={updateEvent}
                    showLabels={false} />
            }
        </div>
    )
}
import { useTranslation } from 'react-i18next';
import { FaCheckSquare } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddEvent from './AddEvent';

const Event = ({ event, onDelete, onEdit }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //states
    const [editable, setEditable] = useState(false);

    const updateEvent = (updateEventID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_MUSIC_EVENTS, updateEventID, object);
        setEditable(false);
    }

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    {event.name} {event.eventYear > 0 ? '(' + event.eventYear + ')' : ''}
                </span>
                <RightWrapper>
                    <Icon name={Constants.ICON_EDIT} className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon className='deleteBtn'
                        name={Constants.ICON_DELETE} color='red' fontSize='1.2em' cursor='pointer'
                        onClick={() => {
                            if (window.confirm(t('delete_music_event_confirm_message'))) {
                                onDelete(event.id);
                            }
                        }} />
                </RightWrapper>
            </h5>
            {!editable &&
                <p>
                    {event.description}
                </p>
            }
            {!editable &&
                <p>
                    <Link className='btn btn-primary' to={`${Constants.NAVIGATION_MUSIC_EVENT}/${event.id}`}>{t('view_details')}</Link>
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

export default Event
import i18n from 'i18next';
import { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import Button from '../Buttons/Button';
import CommentComponent from '../Comments/CommentComponent';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import useFetchChildren from '../Hooks/useFetchChildren';
import { useToggle } from '../Hooks/useToggle';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import FoundItems from '../Selectors/FoundItems';
import DetailsPage from '../Site/DetailsPage';

import AddEvent from './AddEvent';
import EventBands from './EventBands';

export default function EventDetails() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });

    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure
    } = useAlert();

    //states
    const [showLinkBands, setShowLinkBands] = useState(false);
    const [linkedBandName, setLinkedBandName] = useState('');
    const [foundBands, setFoundBands] = useState([]);

    //params
    const params = useParams();

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { originalData: originalBands } = useFetch(DB.MUSIC_BANDS);
    const { data: event, loading } = useFetch(DB.MUSIC_EVENTS, "", params.id);
    const { data: eventBands } = useFetchChildren(DB.MUSIC_EVENT_BANDS, params.id);

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

    const inputRef = useRef();

    useEffect(() => {
        const bands = Object.values(originalBands || {});
        if (linkedBandName === "") {
            setFoundBands(bands);
        } else {
            var filtered =
                bands.filter(
                    e => e.name != null && e.name.toLowerCase().includes(linkedBandName.toLowerCase())
                );
            setFoundBands(filtered);
        }
    }, [linkedBandName, originalBands]);

    const updateEvent = async (updateEventID, event) => {
        try {
            const eventID = params.id;
            event["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.MUSIC_EVENTS, eventID, event);
        } catch (error) {
            showFailure(t('failed_to_save_music_event'));
            console.warn(error);
        }
    }

    const addCommentToEvent = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.MUSIC_EVENT_COMMENTS, id, comment);
    }

    const addLinkToEvent = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.MUSIC_EVENT_LINKS, id, link);
    }

    const selectedBandChanged = (band) => {

        var currentEventBands = eventBands;

        //lisää listaan vain jos ei vielä löydy tällä ID:llä
        if (currentEventBands.filter(e => e.id === band.id).length === 0) {
            currentEventBands.push({ id: band.id, name: band.name });
        }

        const id = params.id;
        updateToFirebaseById(DB.MUSIC_EVENT_BANDS, id, currentEventBands);
        updateToFirebaseById(DB.MUSIC_BAND_EVENTS, band.id, currentEventBands);
    }

    const deleteEventBand = (band) => {
        var currentEventBands = eventBands;
        //poimitaan vain muut kuin tämän bändin id eli tämä filtteröityy pois
        currentEventBands = currentEventBands.filter(e => e.id !== band.id);
        const id = params.id;
        updateToFirebaseById(DB.MUSIC_EVENT_BANDS, id, currentEventBands);
    }

    return (
        <DetailsPage
            item={event}
            id={params.id}
            dbKey={DB.MUSIC_EVENTS}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={toggleShowEdit}
            title={event?.name}
            summary={`${t('description')}: ${event?.description || '-'}`}
            metaItems={[
                { id: 1, content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(event?.created, i18n.language)}</span></> },
                { id: 2, content: <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{event?.createdBy || '-'}</span></> },
                { id: 3, content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(event?.modified, i18n.language)}</span></> }
            ]}
            editModalTitle={t('modal_header_edit_event')}
            editSection={<AddEvent onSave={updateEvent} eventID={params.id} onClose={toggleShowEdit} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
            preImageSection={
                <>
                    <Button
                        disableStyle={true}
                        className={showLinkBands ? 'btn btn-danger' : 'btn btn-primary'}
                        text={showLinkBands ? tCommon('buttons.button_close') : t('add_bands_to_event')}
                        onClick={() => {
                            setShowLinkBands(!showLinkBands);
                        }}
                    />

                    {
                        showLinkBands &&
                        <>
                            <Form style={{ paddingBottom: 0 }}>
                                <Form.Group className="mb-3" controlId="linkBandForm-BandName">
                                    <Form.Label>{t('band_name')}</Form.Label>
                                    <Form.Control type='text'
                                        ref={inputRef}
                                        autoComplete="off"
                                        placeholder={t('band_name')}
                                        value={linkedBandName}
                                        onChange={(e) => setLinkedBandName(e.target.value)} />
                                </Form.Group>
                            </Form>
                            <FoundItems itemsToFind={foundBands}
                                nameField='name'
                                onSelection={selectedBandChanged}
                                linkedName={linkedBandName}
                            />
                        </>
                    }

                    {
                        eventBands != null && eventBands.length > 0 ? (
                            <EventBands bands={eventBands} onDelete={deleteEventBand} />
                        ) : (
                            t('no_bands_to_show')
                        )
                    }
                </>
            }
            imageSection={<ImageComponent url={DB.MUSIC_EVENT_IMAGES} objID={params.id} />}
            commentSection={<CommentComponent objID={params.id} url={DB.MUSIC_EVENT_COMMENTS} onSave={addCommentToEvent} />}
            linkSection={<LinkComponent objID={params.id} url={DB.MUSIC_EVENT_LINKS} onSaveLink={addLinkToEvent} />}
        />
    )
}




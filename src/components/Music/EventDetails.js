import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Row, ButtonGroup, Col, Form } from 'react-bootstrap';
import i18n from 'i18next';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import CommentComponent from '../Comments/CommentComponent';
import { useAuth } from '../../contexts/AuthContext';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import Button from '../Buttons/Button';
import AddEvent from './AddEvent';
import Alert from '../Alert';
import LinkComponent from '../Links/LinkComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AccordionElement from '../AccordionElement';
import FoundItems from '../Selectors/FoundItems';
import EventBands from './EventBands';
import useFetch from '../useFetch';
import useFetchChildren from '../useFetchChildren';
import { Modal } from 'react-bootstrap';
import { useToggle } from '../useToggle';

export default function EventDetails() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_MUSIC });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //states
    const [showLinkBands, setShowLinkBands] = useState(false);
    const [linkedBandName, setLinkedBandName] = useState('');
    const [foundBands, setFoundBands] = useState([]);

    //params
    const params = useParams();

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { originalData: originalBands } = useFetch(Constants.DB_MUSIC_BANDS);
    const { data: event, loading } = useFetch(Constants.DB_MUSIC_EVENTS, "", params.id);
    const { data: eventBands } = useFetchChildren(Constants.DB_MUSIC_EVENT_BANDS, params.id);

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

    const inputRef = useRef();

    useEffect(() => {
        if (linkedBandName === "") {
            setFoundBands(Object.values(originalBands));
        } else {
            var filtered =
                Object.values(originalBands).filter(
                    e => e.name != null && e.name.toLowerCase().includes(linkedBandName.toLowerCase())
                );
            setFoundBands(filtered);
        }
    }, [linkedBandName]);

    const updateEvent = async (updateEventID, event) => {
        try {
            const eventID = params.id;
            event["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(Constants.DB_MUSIC_EVENTS, eventID, event);
        } catch (error) {
            setError(t('failed_to_save_music_event'));
            setShowError(true);
            console.log(error);
        }
    }

    const addCommentToEvent = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_MUSIC_EVENT_COMMENTS, id, comment);
    }

    const addLinkToEvent = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_MUSIC_EVENT_LINKS, id, link);
    }

    const saveStars = async (stars) => {
        const eventID = params.id;
        event["modified"] = getCurrentDateAsJson()
        event["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_MUSIC_EVENTS, eventID, event);
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(event.created, i18n.language) },
            { id: 2, name: t('created_by'), value: event.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(event.modified, i18n.language) }
        ];
    }

    /*
    const logBands = async () => {
        console.log(bands);
    }
    */

    const selectedBandChanged = (band) => {

        var currentEventBands = eventBands;

        //lisää listaan vain jos ei vielä löydy tällä ID:llä
        if (currentEventBands.filter(e => e.id === band.id).length === 0) {
            currentEventBands.push({ id: band.id, name: band.name });
        }

        const id = params.id;
        updateToFirebaseById(Constants.DB_MUSIC_EVENT_BANDS, id, currentEventBands);
        updateToFirebaseById(Constants.DB_MUSIC_BAND_EVENTS, band.id, currentEventBands);
    }

    const deleteEventBand = (band) => {
        var currentEventBands = eventBands;
        //poimitaan vain muut kuin tämän bändin id eli tämä filtteröityy pois
        currentEventBands = currentEventBands.filter(e => e.id !== band.id);
        const id = params.id;
        updateToFirebaseById(Constants.DB_MUSIC_EVENT_BANDS, id, currentEventBands);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_EDIT}
                        text={showEdit ? t('button_close') : ''}
                        color={showEdit ? Constants.COLOR_EDITBUTTON_OPEN : Constants.COLOR_EDITBUTTON_CLOSED}
                        onClick={() => toggleShowEdit()} />
                </ButtonGroup>
            </Row>

            <AccordionElement array={getAccordionData()} title={event.name} />

            <Row>
                <Col>
                    {t('description') + ':'} {event.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRatingWrapper stars={event.stars} onSaveStars={saveStars} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        disableStyle={true}
                        className={showLinkBands ? 'btn btn-danger' : 'btn btn-primary'}
                        text={showLinkBands ? t('button_close') : t('add_bands_to_event')}
                        onClick={() => {
                            setShowLinkBands(!showLinkBands);
                            //logBands();
                        }}
                    />
                </Col>
            </Row>

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

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showEdit} onHide={toggleShowEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_event')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddEvent onSave={updateEvent} eventID={params.id} onClose={() => toggleShowEdit()} />
                </Modal.Body>
            </Modal>

            <hr />

            {
                eventBands != null && eventBands.length > 0 ? (
                    <>
                        <EventBands bands={eventBands} onDelete={deleteEventBand} />
                    </>
                ) : (
                    <>
                        {t('no_bands_to_show')}
                    </>
                )
            }

            <ImageComponent url={Constants.DB_MUSIC_EVENT_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={Constants.DB_MUSIC_EVENT_COMMENTS} onSave={addCommentToEvent} />
            <LinkComponent objID={params.id} url={Constants.DB_MUSIC_EVENT_LINKS} onSaveLink={addLinkToEvent} />
        </PageContentWrapper>
    )
}

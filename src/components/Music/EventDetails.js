import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, ButtonGroup, Col, Form } from 'react-bootstrap';
import i18n from 'i18next';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
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
import useFetch from '../useFetch';
import FoundBands from './FoundBands';

export default function EventDetails() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //states
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState({});
    const [showEdit, setShowEdit] = useState(false);
    const [showLinkBands, setShowLinkBands] = useState(false);
    const [linkedBandName, setLinkedBandName] = useState('');
    const [foundBands, setFoundBands] = useState([]);
    const [selectedBand, setSelectedBand] = useState({});

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getEvent = async () => {
            await fetchEventFromFirebase();
        }
        getEvent();
    }, [])

    const fetchEventFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_MUSIC_EVENTS}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setEvent(data);
            setLoading(false);
        })
    }

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

    const getBands = async () => {
        console.log(bands);
    }

    //fetch data
    const { data: bands, setData: setBands,
        originalData: originalBands, counter } = useFetch(Constants.DB_MUSIC_BANDS);

    const inputRef = useRef();

    useEffect(() => {

        /*
        if (linkedBandName === "ray") {
            inputRef.current.select();
        }
        */

        if (linkedBandName === "") {
            console.log("pöö");
            setFoundBands(Object.values(originalBands));
        } else {

            var filtered = Object.values(originalBands).filter(e => e.name != null && e.name.toLowerCase().includes(linkedBandName.toLowerCase()));
            setFoundBands(filtered);
        }

    }, [linkedBandName]);

    const selectedBandChanged = (band) => {
        const id = params.id;
        //TODO: Tarkista onko jo
        pushToFirebaseChild(Constants.DB_MUSIC_EVENT_BANDS, id, {id: band.id, name: band.name} );
        pushToFirebaseChild(Constants.DB_MUSIC_BAND_EVENTS, band.id, id );
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_EDIT}
                        text={showEdit ? t('button_close') : ''}
                        color={showEdit ? Constants.COLOR_EDITBUTTON_OPEN : Constants.COLOR_EDITBUTTON_CLOSED}
                        onClick={() => setShowEdit(!showEdit)} />
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
                        color={showLinkBands ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                        text={showLinkBands ? t('button_close') : 'Lisää bändejä tapahtumaan'}
                        onClick={() => { setShowLinkBands(!showLinkBands); getBands(); }}
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
                    <FoundBands bands={foundBands} onSelection={selectedBandChanged} linkedBandName={linkedBandName} />

                </>
            }

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            {showEdit &&
                <AddEvent onSave={updateEvent} eventID={params.id} onClose={() => setShowEdit(false)} />
            }
            <hr />
            <ImageComponent url={Constants.DB_MUSIC_EVENT_IMAGES} objID={params.id} />
            <CommentComponent objID={params.id} url={Constants.DB_MUSIC_EVENT_COMMENTS} onSave={addCommentToEvent} />
            <LinkComponent objID={params.id} url={Constants.DB_MUSIC_EVENT_LINKS} onSaveLink={addLinkToEvent} />
        </PageContentWrapper>
    )
}

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import * as Constants from '../../utils/Constants';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import CenterWrapper from '../Site/CenterWrapper';
import Events from './Events';
import { useState, useEffect } from 'react';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddEvent from './AddEvent';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';

export default function ManageMusicEvents() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //states
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const [events, setEvents] = useState();
    const [originalEvents, setOriginalEvents] = useState();

    //modal
    const [showAdd, setShowAdd] = useState(false);
    const handleClose = () => setShowAdd(false);
    const handleShow = () => setShowAdd(true);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        let cancel = false;

        const getEvents = async () => {
            if (cancel) {
                return;
            }
            await fetchEventsFromFirebase();
        }
        getEvents();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchEventsFromFirebase = async () => {
        const dbref = await ref(db, Constants.DB_MUSIC_EVENTS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
            setLoading(false);
            setEvents(fromDB);
            setOriginalEvents(fromDB);
        })
    }

    const deleteEvent = async (id) => {
        removeFromFirebaseById(Constants.DB_MUSIC_EVENTS, id);
    }

    const addEvent = async (eventID, event) => {
        try {
            clearMessages();
            event["created"] = getCurrentDateAsJson();
            event["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_MUSIC_EVENTS, event);
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
            setShowError(true);
        }
    }

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    const editEvent = (event) => {
        const id = event.id;
        updateToFirebaseById(Constants.DB_MUSIC_EVENTS, id, event);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('music_events_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Link to={Constants.NAVIGATION_MANAGE_MUSICLISTS} className='btn btn-primary'>
                        <Icon name={Constants.ICON_LIST_ALT} color='white' />
                        {t('button_music_lists')}
                    </Link>
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success'
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showAdd} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_event')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddEvent onSave={addEvent} onClose={() => setShowAdd(false)} />
                </Modal.Body>
            </Modal>

            {
                originalEvents != null && originalEvents.length > 0 ? (
                    <SearchSortFilter
                        onSet={setEvents}
                        originalList={originalEvents}
                        //search
                        showSearchByText={true}
                        showSearchByDescription={true}
                        //sort
                        defaultSort={SortMode.Name_ASC}
                        showSortByName={true}
                        showSortByStarRating={true}
                        showSortByCreatedDate={true}
                        //filter
                        filterMode={FilterMode.Name}
                        showFilterHaveAtHome={true}
                        showFilterNotHaveAtHome={true}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={Constants.ICON_PLUS}
                    color={showAdd ? 'red' : 'green'}
                    text={showAdd ? t('button_close') : t('button_add_music_event')}
                    onClick={() => setShowAdd(!showAdd)} />
            </CenterWrapper>

            {
                events != null && events.length > 0 ? (
                    <>
                        <Counter list={events} originalList={originalEvents} counter={counter} />
                        <Events events={events} onDelete={deleteEvent} onEdit={editEvent} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_events_to_show')}
                        </CenterWrapper>
                    </>
                )
            }

        </PageContentWrapper >
    )
}

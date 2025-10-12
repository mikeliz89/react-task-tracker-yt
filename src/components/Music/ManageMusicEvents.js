import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import * as Constants from '../../utils/Constants';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import CenterWrapper from '../Site/CenterWrapper';
import Events from './Events';
import { useState } from 'react';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddEvent from './AddEvent';
import { useAuth } from '../../contexts/AuthContext';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';
import NavButton from '../Buttons/NavButton';

export default function ManageMusicEvents() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_MUSIC });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

    //fetch data
    const { data: events, setData: setEvents,
        originalData: originalEvents, counter, loading } = useFetch(Constants.DB_MUSIC_EVENTS);

    //modal
    const { status: showAddEvent, toggleStatus: toggleAddEvent } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    const deleteEvent = async (id) => {
        removeFromFirebaseById(Constants.DB_MUSIC_EVENTS, id);
    }

    const addEvent = async (eventID, event) => {
        try {
            clearMessages();
            event["created"] = getCurrentDateAsJson();
            event["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_MUSIC_EVENTS, event);
            showSuccess();
        } catch (ex) {
            showFailure();
        }

        function showFailure() {
            setError(t('save_exception'));
            setShowError(true);
        }

        function showSuccess() {
            setMessage(t('save_success'));
            setShowMessage(true);
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
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('music_events_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={Constants.NAVIGATION_MANAGE_MUSICLISTS}
                        icon={Constants.ICON_LIST_ALT}>
                        {t('button_music_lists')}
                    </NavButton>
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showAddEvent} onHide={toggleAddEvent}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_event')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddEvent onSave={addEvent} onClose={toggleAddEvent} />
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
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={Constants.ICON_PLUS}
                    color={showAddEvent ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAddEvent ? tCommon('buttons.button_close') : t('button_add_music_event')}
                    onClick={toggleAddEvent} />
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

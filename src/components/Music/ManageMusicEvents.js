import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import ManagePage from '../Site/ManagePage';

import AddEvent from './AddEvent';
import Events from './Events';

export default function ManageMusicEvents() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: events, setData: setEvents,
        originalData: originalEvents, counter, loading } = useFetch(DB.MUSIC_EVENTS);

    //modal
    const { status: showAddEvent, toggleStatus: toggleAddEvent } = useToggle();

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    //user
    const { currentUser } = useAuth();

    const deleteEvent = async (id) => {
        removeFromFirebaseById(DB.MUSIC_EVENTS, id);
    }

    const addEvent = async (eventID, event) => {
        try {
            clearMessages();
            event["created"] = getCurrentDateAsJson();
            event["createdBy"] = currentUser.email;
            pushToFirebase(DB.MUSIC_EVENTS, event);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const editEvent = (event) => {
        const id = event.id;
        updateToFirebaseById(DB.MUSIC_EVENTS, id, event);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('music_events_title')}
            iconName={ICONS.MUSIC}
            topActions={(
                <>
                    <NavButton to={NAVIGATION.MANAGE_MUSICLISTS}
                        icon={ICONS.LIST_ALT}>
                        {t('button_music_lists')}
                    </NavButton>
                </>
            )}
            alert={{
                message,
                showMessage,
                error,
                showError,
                variant: VARIANTS.SUCCESS,
                onClose: clearMessages,
            }}
            modal={{
                show: showAddEvent,
                onHide: toggleAddEvent,
                title: t('modal_header_add_event'),
                body: <AddEvent onSave={addEvent} onClose={toggleAddEvent} />,
            }}
            searchSortFilter={{
                onSet: setEvents,
                originalList: originalEvents,
                //search
                showSearchByText: true,
                showSearchByDescription: true,
                //sort
                defaultSort: SortMode.Name_ASC,
                showSortByName: true,
                showSortByStarRating: true,
                showSortByCreatedDate: true,
                //filter
                filterMode: FilterMode.Name,
                showFilterHaveRated: true,
            }}
            addButton={{
                show: showAddEvent,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_music_event'),
                onToggle: toggleAddEvent,
            }}
            hasItems={events != null && events.length > 0}
            emptyText={t('no_events_to_show')}
        >
            <>
                <Events
                    items={events}
                    onDelete={deleteEvent}
                    onEdit={editEvent}
                    originalList={originalEvents}
                    counter={counter}
                />
            </>
        </ManagePage>
    )
}




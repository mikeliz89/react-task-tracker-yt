import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { removeFromFirebaseById, pushToFirebase } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, VARIANTS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import ManagePage from '../Site/ManagePage';

import AddMovement from './AddMovement';
import Movements from './Movements';

export default function ManageMovements() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: movements, setData: setMovements,
        originalData: originalMovements,
        counter, loading } = useFetch(DB.EXERCISE_MOVEMENTS);

    //modal
    const { status: showAddMovement, toggleStatus: toggleAddMovement } = useToggle();

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

    const deleteMovement = async (id) => {
        removeFromFirebaseById(DB.EXERCISE_MOVEMENTS, id);
    }


    const addMovement = async (movementID, movement) => {
        try {
            clearMessages();
            movement["created"] = getCurrentDateAsJson();
            movement["createdBy"] = currentUser.email;
            pushToFirebase(DB.EXERCISE_MOVEMENTS, movement);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('movement_save_exception'));
            console.warn(ex);
        }
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('manage_movements_title')}
            alert={{
                message,
                showMessage,
                error,
                showError,
                variant: VARIANTS.SUCCESS,
                onClose: clearMessages,
            }}
            searchSortFilter={{
                onSet: setMovements,
                originalList: originalMovements,
                //search
                showSearchByText: true,
                //sort
                showSortByCreatedDate: true,
                showSortByStarRating: true,
                showSortByName: true,
                //filter
                filterMode: FilterMode.Name,
                showFilterHaveRated: true,
            }}
            addButton={{
                show: showAddMovement,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: tCommon('buttons.button_save'),
                onToggle: toggleAddMovement,
            }}
            modal={{
                show: showAddMovement,
                onHide: toggleAddMovement,
                title: t('modal_header_add_movement'),
                body: <AddMovement onSave={addMovement} onClose={toggleAddMovement} />,
            }}
            hasItems={movements != null && movements.length > 0}
            emptyText={t('no_movements_to_show')}
        >
            <Movements
                movements={movements}
                originalList={originalMovements}
                counter={counter}
                onDelete={deleteMovement}
            />
        </ManagePage>
    )
}



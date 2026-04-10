import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, VARIANTS } from "../../utils/Constants";
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import ManagePage from '../Site/ManagePage';

import AddGear from './AddGear';
import Gears from './Gears';

export default function ManageGear() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: gear, setData: setGear,
        originalData: originalGear, counter, loading } = useFetch(DB.BACKPACKING_GEAR);

    //modal
    const { status: showAddGear, toggleStatus: toggleAddGear } = useToggle();

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

    const addGear = async (gear) => {
        try {
            clearMessages();
            gear["created"] = getCurrentDateAsJson();
            gear["createdBy"] = currentUser.email;
            pushToFirebase(DB.BACKPACKING_GEAR, gear);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
        }
    }

    const deleteGear = (id) => {
        removeFromFirebaseById(DB.BACKPACKING_GEAR, id);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('my_gear_title')}
            iconName={ICONS.WRENCH}
            alert={{
                message,
                showMessage,
                error,
                showError,
                variant: VARIANTS.SUCCESS,
                onClose: clearMessages,
            }}
            modal={{
                show: showAddGear,
                onHide: toggleAddGear,
                title: t('modal_header_add_gear'),
                body: <AddGear onSave={addGear} onClose={toggleAddGear} />,
            }}
            searchSortFilter={{
                onSet: setGear,
                originalList: originalGear,
                //search
                showSearchByText: true,
                //sort
                defaultSort: SortMode.Name_ASC,
                showSortByName: true,
                showSortByStarRating: true,
                //filter
                filterMode: FilterMode.Name,
                showFilterHaveRated: true,
            }}
            addButton={{
                show: showAddGear,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_gear'),
                onToggle: toggleAddGear,
            }}
            hasItems={gear != null && gear.length > 0}
            emptyText={t('no_gear_to_show')}
        >
            <>
                <Gears gears={gear}
                    originalList={originalGear}
                    counter={counter}
                    onDelete={deleteGear} />
            </>
        </ManagePage>
    )
}




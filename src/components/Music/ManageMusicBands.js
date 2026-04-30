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

import AddBand from './AddBand';
import Bands from './Bands';

export default function ManageMusicBands() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: bands, setData: setBands,
        originalData: originalBands, counter, loading } = useFetch(DB.MUSIC_BANDS);

    //modal
    const { status: showAddBand, toggleStatus: toggleAddBand } = useToggle();

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

    const deleteBand = async (id) => {
        removeFromFirebaseById(DB.MUSIC_BANDS, id);
    }

    const addBand = async (bandID, band) => {
        try {
            clearMessages();
            band["created"] = getCurrentDateAsJson();
            band["createdBy"] = currentUser.email;
            pushToFirebase(DB.MUSIC_BANDS, band);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const editBand = (band) => {
        const id = band.id;
        updateToFirebaseById(DB.MUSIC_BANDS, id, band);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('music_bands_title')}
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
                show: showAddBand,
                onHide: toggleAddBand,
                title: t('modal_header_add_band'),
                body: <AddBand onSave={addBand} onClose={toggleAddBand} />,
            }}
            searchSortFilter={{
                onSet: setBands,
                originalList: originalBands,
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
                showFilterSeenLive: true,
                showFilterHaveRated: true,
            }}
            addButton={{
                show: showAddBand,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_music_band'),
                onToggle: toggleAddBand,
            }}
            hasItems={bands != null && bands.length > 0}
            emptyText={t('no_bands_to_show')}
        >
            <>
                <Bands
                    items={bands}
                    onDelete={deleteBand}
                    onEdit={editBand}
                    originalList={originalBands}
                    counter={counter}
                />
            </>
        </ManagePage>
    )
}




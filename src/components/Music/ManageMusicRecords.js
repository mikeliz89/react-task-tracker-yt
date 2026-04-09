import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Records from './Records';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddRecord from './AddRecord';
import { useAuth } from '../../contexts/AuthContext';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import ManagePage from '../Site/ManagePage';

export default function ManageMusicRecords() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: records, setData: setRecords,
        originalData: originalRecords, counter, loading } = useFetch(DB.MUSIC_RECORDS);

    //modal
    const { status: showAddRecord, toggleStatus: toggleAddRecord } = useToggle();

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

    const deleteRecord = async (id) => {
        removeFromFirebaseById(DB.MUSIC_RECORDS, id);
    }

    const addRecord = async (recordID, record) => {
        try {
            clearMessages();
            record["created"] = getCurrentDateAsJson();
            record["createdBy"] = currentUser.email;
            pushToFirebase(DB.MUSIC_RECORDS, record);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const editRecord = (record) => {
        const id = record.id;
        updateToFirebaseById(DB.MUSIC_RECORDS, id, record);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('music_records_title')}
            iconName={ICONS.MUSIC}
            topActions={(
                <>
                    <NavButton to={NAVIGATION.MANAGE_MUSICLISTS}
                        icon={ICONS.LIST_ALT} >
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
                show: showAddRecord,
                onHide: toggleAddRecord,
                title: t('modal_header_add_record'),
                body: <AddRecord onSave={addRecord} onClose={toggleAddRecord} />,
            }}
            searchSortFilter={{
                onSet: setRecords,
                originalList: originalRecords,
                //search
                showSearchByText: true,
                showSearchByDescription: true,
                //sort
                defaultSort: SortMode.Name_ASC,
                showSortByName: true,
                showSortByStarRating: true,
                showSortByCreatedDate: true,
                showSortByPublishYear: true,
                //filter
                filterMode: FilterMode.NameOrBand,
                showFilterHaveAtHome: true,
                showFilterHaveRated: true,
            }}
            addButton={{
                show: showAddRecord,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_music'),
                onToggle: toggleAddRecord,
            }}
            hasItems={records != null && records.length > 0}
            emptyText={t('no_records_to_show')}
        >
            <>
                <Records
                    records={records}
                    onDelete={deleteRecord}
                    onEdit={editRecord}
                    originalList={originalRecords}
                    counter={counter}
                />
            </>
        </ManagePage>
    )
}

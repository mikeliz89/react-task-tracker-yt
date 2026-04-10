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

import AddPerson from './AddPerson';
import PeopleList from './PeopleList';

export default function ManagePeople() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.PEOPLE });
const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: people, setData: setPeople,
        originalData: originalPeople, counter, loading } = useFetch(DB.PEOPLE);

    //modal
    const { status: showAddPerson, toggleStatus: toggleAddPerson } = useToggle();


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

    const addPerson = async (person) => {
        try {
            clearMessages();
            person["created"] = getCurrentDateAsJson();
            person["createdBy"] = currentUser.email;
            pushToFirebase(DB.PEOPLE, person);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const deletePerson = (id) => {
        removeFromFirebaseById(DB.PEOPLE, id);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('title')}
            iconName={ICONS.USER_ALT}
            alert={{
                message,
                showMessage,
                error,
                showError,
                variant: VARIANTS.SUCCESS,
                onClose: clearMessages,
            }}
            modal={{
                show: showAddPerson,
                onHide: toggleAddPerson,
                title: t('modal_header_add_person'),
                body: <AddPerson onSave={addPerson} onClose={toggleAddPerson} />,
            }}
            searchSortFilter={{
                onSet: setPeople,
                originalList: originalPeople,
                //search
                showSearchByText: true,
                showSearchByDescription: true,
                //sort
                defaultSort: SortMode.Name_ASC,
                showSortByName: true,
                showSortByBirthday: true,
                //filter
                filterMode: FilterMode.Name,
            }}
            addButton={{
                show: showAddPerson,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_person'),
                onToggle: toggleAddPerson,
            }}
            hasItems={people != null && people.length > 0}
            emptyText={t('no_people_to_show')}
        >
            <>
                <PeopleList people={people}
                    originalList={originalPeople}
                    counter={counter}
                    onDelete={deletePerson} />
            </>
        </ManagePage>
    )
}




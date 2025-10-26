import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import AddPerson from './AddPerson';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS, VARIANTS } from "../../utils/Constants";
import { useAuth } from '../../contexts/AuthContext';
import PeopleList from './PeopleList';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from '../SearchSortFilter/SortModes';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import { useAlert } from '../Hooks/useAlert';

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

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

            <Modal show={showAddPerson} onHide={toggleAddPerson}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_person')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddPerson onSave={addPerson} onClose={toggleAddPerson} />
                </Modal.Body>
            </Modal>

            {
                originalPeople != null && originalPeople.length > 0 ? (
                    <SearchSortFilter
                        onSet={setPeople}
                        originalList={originalPeople}
                        //search
                        showSearchByText={true}
                        showSearchByDescription={true}
                        //sort
                        defaultSort={SortMode.Name_ASC}
                        showSortByName={true}
                        showSortByBirthday={true}
                        //filter
                        filterMode={FilterMode.Name}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={ICONS.PLUS}
                    color={showAddPerson ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddPerson ? tCommon('buttons.button_close') : t('button_add_person')}
                    onClick={toggleAddPerson} />
            </CenterWrapper>

            {
                people != null && people.length > 0 ? (
                    <>
                        <Counter list={people} originalList={originalPeople} counter={counter} />
                        <PeopleList people={people}
                            onDelete={deletePerson} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_people_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}

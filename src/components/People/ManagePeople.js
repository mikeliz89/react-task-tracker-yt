import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import AddPerson from './AddPerson';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from "../../utils/Constants";
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

export default function ManagePeople() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_PEOPLE, { keyPrefix: Constants.TRANSLATION_PEOPLE });

    //states
    const [people, setPeople] = useState();
    const [originalPeople, setOriginalPeople] = useState();
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);

    //modal
    const [showAddPerson, setShowAddPerson] = useState(false);
    const handleClose = () => setShowAddPerson(false);
    const handleShow = () => setShowAddPerson(true);

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

        const getPeople = async () => {
            if (cancel) {
                return;
            }
            await fetchPeopleFromFirebase();
        }
        getPeople();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchPeopleFromFirebase = async () => {
        const dbref = await ref(db, Constants.DB_PEOPLE);
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
            setPeople(fromDB);
            setOriginalPeople(fromDB);
        })
    }

    const addPerson = async (person) => {
        try {
            clearMessages();
            person["created"] = getCurrentDateAsJson();
            person["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_PEOPLE, person);
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

    const deletePerson = (id) => {
        removeFromFirebaseById(Constants.DB_PEOPLE, id);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showAddPerson} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_person')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddPerson onSave={addPerson} onClose={() => setShowAddPerson(false)} />
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
                    iconName={Constants.ICON_PLUS}
                    color={showAddPerson ? 'red' : 'green'}
                    text={showAddPerson ? t('button_close') : t('button_add_person')}
                    onClick={() => setShowAddPerson(!showAddPerson)} />
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

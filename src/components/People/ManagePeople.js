import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import AddPeople from './AddPeople';
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

export default function ManagePeople() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_PEOPLE, { keyPrefix: Constants.TRANSLATION_PEOPLE });

    //states
    const [showAdd, setShowAdd] = useState(false);
    const [people, setPeople] = useState();
    const [originalPeople, setOriginalPeople] = useState();
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);

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
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_PLUS}
                        color={showAdd ? 'red' : 'green'}
                        text={showAdd ? t('button_close') : t('button_add_person')}
                        onClick={() => setShowAdd(!showAdd)} />
                </ButtonGroup>
            </Row>

            <PageTitle title={t('title')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {
                showAdd && <AddPeople onSave={addPerson} onClose={() => setShowAdd(false)} />
            }

            {
                originalPeople != null && originalPeople.length > 0 ? (
                    <SearchSortFilter
                        onSet={setPeople}
                        originalList={originalPeople}
                        useNameFiltering={true}
                        showSortByName={true}
                        showSortByBirthday={true}
                        showSearchByDescription={true}
                        defaultSort={SortMode.Name_ASC} />
                ) : (<></>)
            }
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

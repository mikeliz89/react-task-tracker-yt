import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Button from '../Button';
import GoBackButton from '../GoBackButton';
import AddGear from './AddGear';
import { db } from '../../firebase-config';
import { ref, push, onValue, remove } from 'firebase/database';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from "../../utils/Constants";
import { useAuth } from '../../contexts/AuthContext';
import Gears from './Gears';
import PageTitle from '../PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from '../SearchSortFilter/SortModes';
import Alert from '../Alert';
import PageContentWrapper from '../PageContentWrapper';
import CenterWrapper from '../CenterWrapper';
import Counter from '../Counter';

export default function ManageGear() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //states
    const [showAdd, setShowAdd] = useState(false);
    const [gear, setGear] = useState();
    const [originalGear, setOriginalGear] = useState();
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

        const getGear = async () => {
            if (cancel) {
                return;
            }
            await fetchGearsFromFirebase();
        }
        getGear();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchGearsFromFirebase = async () => {
        const dbref = await ref(db, Constants.DB_GEAR);
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
            setGear(fromDB);
            setOriginalGear(fromDB);
        })
    }

    const addGear = async (gear) => {
        try {
            clearMessages();
            gear["created"] = getCurrentDateAsJson();
            gear["createdBy"] = currentUser.email;
            const dbref = ref(db, Constants.DB_GEAR);
            push(dbref, gear);
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

    const deleteGear = (id) => {
        const dbref = ref(db, `${Constants.DB_GEAR}/${id}`);
        remove(dbref)
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName='plus'
                        color={showAdd ? 'red' : 'green'}
                        text={showAdd ? t('button_close') : t('button_add_gear')}
                        onClick={() => setShowAdd(!showAdd)} />
                </ButtonGroup>
            </Row>

            <PageTitle title={t('my_gear_title')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {
                showAdd && <AddGear onSave={addGear} onClose={() => setShowAdd(false)} />
            }

            <SearchSortFilter onSet={setGear} originalList={originalGear} useNameFiltering={true} showSortByName={true} defaultSort={SortMode.Name_DESC} />
            {
                gear != null && gear.length > 0 ? (
                    <>
                        <Counter list={gear} originalList={originalGear} counter={counter} />
                        <Gears gears={gear}
                            onDelete={deleteGear} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_gear_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}

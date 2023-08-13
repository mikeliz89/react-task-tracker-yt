import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import AddGear from './AddGear';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from "../../utils/Constants";
import { useAuth } from '../../contexts/AuthContext';
import Gears from './Gears';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from '../SearchSortFilter/SortModes';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../UseToggle';

export default function ManageGear() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //states
    const [gear, setGear] = useState();
    const [originalGear, setOriginalGear] = useState();
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);

    //modal
    const { status: showAddGear, toggleStatus: toggleAddGear } = useToggle();

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
        const dbref = await ref(db, Constants.DB_BACKPACKING_GEAR);
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
            pushToFirebase(Constants.DB_BACKPACKING_GEAR, gear);
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
        removeFromFirebaseById(Constants.DB_BACKPACKING_GEAR, id);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('my_gear_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showAddGear} onHide={toggleAddGear}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_gear')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddGear onSave={addGear} onClose={toggleAddGear} />
                </Modal.Body>
            </Modal>

            {
                originalGear != null && originalGear.length > 0 ? (
                    <SearchSortFilter
                        onSet={setGear}
                        //search
                        showSearchByText={true}
                        originalList={originalGear}
                        //sort
                        defaultSort={SortMode.Name_ASC}
                        showSortByName={true}
                        showSortByStarRating={true}
                        //filter
                        filterMode={FilterMode.Name}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={Constants.ICON_PLUS}
                    color={showAddGear ? Constants.COLOR_ADDBUTTON_OPEN  : Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAddGear ? t('button_close') : t('button_add_gear')}
                    onClick={toggleAddGear} />
            </CenterWrapper>

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

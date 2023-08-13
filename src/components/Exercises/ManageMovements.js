import { ButtonGroup, Modal, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import GoBackButton from '../Buttons/GoBackButton';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import Movements from './Movements';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseById, pushToFirebase } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import Button from '../Buttons/Button';
import AddMovement from './AddMovement';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

function ManageMovements() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

    //states
    const [loading, setLoading] = useState(true);
    const [movements, setMovements] = useState();
    const [counter, setCounter] = useState(0);
    const [originalMovements, setOriginalMovements] = useState();

    //modal
    const [showAddMovement, setShowAddMovement] = useState(false);
    const handleClose = () => setShowAddMovement(false);
    const handleShow = () => setShowAddMovement(true);

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

        const getMovements = async () => {
            if (cancel) {
                return;
            }
            await fetchMovementsFromFirebase();
        }
        getMovements();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchMovementsFromFirebase = async () => {
        const dbref = await ref(db, Constants.DB_EXERCISE_MOVEMENTS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
            setMovements(fromDB);
            setOriginalMovements(fromDB);
            setLoading(false);
        })
    }

    const deleteMovement = async (id) => {
        removeFromFirebaseById(Constants.DB_EXERCISE_MOVEMENTS, id);
    }


    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    const addMovement = async (movement) => {
        try {
            clearMessages();
            movement["created"] = getCurrentDateAsJson();
            movement["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_EXERCISE_MOVEMENTS, movement);
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('movement_save_exception'));
            setShowError(true);
        }
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('manage_movements_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>

            {
                originalMovements != null && originalMovements.length > 0 ? (
                    <SearchSortFilter
                        onSet={setMovements}
                        originalList={originalMovements}
                        //search
                        showSearchByText={true}
                        //sort
                        showSortByCreatedDate={true}
                        showSortByStarRating={true}
                        showSortByName={true}
                        //filter
                        filterMode={FilterMode.Name}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={Constants.ICON_PLUS}
                    color={showAddMovement ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAddMovement ? t('button_close') : t('button_add_movement')}
                    onClick={() => setShowAddMovement(!showAddMovement)} />
            </CenterWrapper>

            <Modal show={showAddMovement} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_movement')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddMovement onSave={addMovement} onClose={() => setShowAddMovement(false)} />
                </Modal.Body>
            </Modal>

            {
                movements != null && movements.length > 0 ? (
                    <>
                        <Counter list={movements} originalList={originalMovements} counter={counter} />
                        <Movements movements={movements}
                            onDelete={deleteMovement} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_movements_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}

export default ManageMovements
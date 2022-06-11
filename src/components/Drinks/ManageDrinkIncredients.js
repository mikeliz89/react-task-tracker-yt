import { Row, ButtonGroup, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import GoBackButton from '../GoBackButton';
import Button from '../Button';
import { useState, useEffect } from 'react';
import AddDrinkIncredient from './AddDrinkIncredient';
import { ref, push, onValue, remove } from "firebase/database";
import { db } from '../../firebase-config';
import DrinkIncredients from './DrinkIncredients';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';

const ManageDrinkIncredients = () => {

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //states
    const [showAddDrinkIncredient, setShowAddDrinkIncredient] = useState(false);
    const [drinkIncredients, setDrinkIncredients] = useState();
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [error, setError] = useState('')

    //load data
    useEffect(() => {
        let cancel = false;

        const getDrinkIncredients = async () => {
            if (cancel) {
                return;
            }
            await fetchDrinkIncredientsFromFirebase()
        }
        getDrinkIncredients()

        return () => {
            cancel = true;
        }
    }, [])

    const addDrinkIncredient = (drinkIncredient) => {
        try {
            drinkIncredient["created"] = getCurrentDateAsJson();
            drinkIncredient["createdBy"] = currentUser.email;
            const dbref = ref(db, '/drinkincredients');
            push(dbref, drinkIncredient);
            setMessage(t('incredient_save_successfull'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('incredient_save_exception'));
        }
    }

    const deleteDrinkIncredient = (id) => {
        const dbref = ref(db, `/drinkincredients/${id}`);
        remove(dbref)
    }

    /** Fetch Drink Incredients From Firebase */
    const fetchDrinkIncredientsFromFirebase = async () => {
        const dbref = await ref(db, '/drinkincredients');
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setDrinkIncredients(fromDB);
            //setOriginalDrinkIncredients(fromDB);
        })
    }

    return (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        color={showAddDrinkIncredient ? 'red' : 'green'}
                        text={showAddDrinkIncredient ? t('button_close') : t('button_add_drinkincredient')}
                        onClick={() => setShowAddDrinkIncredient(!showAddDrinkIncredient)} />
                </ButtonGroup>
            </Row>
            <h3 className="page-title">{t('manage_drink_incredients_title')}</h3>
            {error && <div className="error">{error}</div>}
            {message &&
                <Alert show={showMessage} variant='success' className="success">
                    {message}
                    <div className='d-flex justify-content-end'>
                        <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                    </div>
                </Alert>}
            {showAddDrinkIncredient && <AddDrinkIncredient onAddDrinkIncredient={addDrinkIncredient} />}
            {
                drinkIncredients != null && drinkIncredients.length > 0 ? (
                    <DrinkIncredients drinkIncredients={drinkIncredients}
                        onDelete={deleteDrinkIncredient} />
                ) : (
                    t('no_drink_incredients_to_show')
                )
            }
        </div>
    )
}

export default ManageDrinkIncredients

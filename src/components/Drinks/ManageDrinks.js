import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Drinks from './Drinks';
import DrinkButton from './DrinkButton';
import { Row, ButtonGroup, Alert } from 'react-bootstrap';
import { ref, push, onValue, remove } from "firebase/database";
import { db } from '../../firebase-config';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';
import AddDrink from './AddDrink';

export default function ManageDrinks() {

    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    const [showAddDrink, setShowAddDrink] = useState(false);

    //states
    const [drinks, setDrinks] = useState();
    const [originalDrinks, setOriginalDrinks] = useState();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        let cancel = false;

        const getDrinks = async () => {
            if (cancel) {
                return;
            }
            await fetchDrinksFromFirebase()
        }
        getDrinks()

        return () => {
            cancel = true;
        }
    }, [])

    /** Fetch Drinks From Firebase */
    const fetchDrinksFromFirebase = async () => {
        const dbref = await ref(db, '/drinks');
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const drinksFromDB = [];
            for (let id in snap) {
                drinksFromDB.push({ id, ...snap[id] });
            }
            setDrinks(drinksFromDB);
            setOriginalDrinks(drinksFromDB);
        })
    }

    /** Add Drink To Firebase */
    const addDrink = async (drink) => {

        try {
            drink["created"] = getCurrentDateAsJson();
            drink["createdBy"] = currentUser.email;
            const dbref = ref(db, '/drinks');
            push(dbref, drink);
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
        }
    }

    const deleteDrink = (id) => {
        const dbref = ref(db, `/drinks/${id}`);
        remove(dbref)
    }

    return (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <DrinkButton
                        onShowAddDrink={() => setShowAddDrink(!showAddDrink)}
                        showAdd={showAddDrink}
                    />
                </ButtonGroup>
            </Row>
            <h3 className="page-title">{t('manage_drinks_title')}</h3>
            {message &&
                <Alert show={showMessage} variant='success' className="success">
                    {message}
                    <div className='d-flex justify-content-end'>
                        <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                    </div>
                </Alert>}
            {showAddDrink && <AddDrink onAddDrink={addDrink} />}
            {
                drinks != null && drinks.length > 0 ? (
                    <Drinks drinks={drinks}
                        onDelete={deleteDrink} />
                ) : (
                    t('no_drinks_to_show')
                )
            }
        </div>
    )
}

//react
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Form, Col, Row, ButtonGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
//firebase
import { ref, push, onValue, remove } from "firebase/database";
import { db } from '../../firebase-config';
//drinks
import Drinks from './Drinks';
import AddDrink from './AddDrink';
//buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
//pagetitle
import PageTitle from '../PageTitle';
//icon
import Icon from '../Icon';
//searchsortfilter
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';

const SortMode = {
    None: "None",
    Name_ASC: "Name_ASC",
    Name_DESC: "Name_DESC",
    Created_ASC: "Created_ASC",
    Created_DESC: "Created_DESC",
}

export default function ManageDrinks() {

    //constants
    const DB_DRINKS = '/drinks';
    const DB_DRINK = '/drink';

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //navigate
    const navigate = useNavigate();

    //states
    const [loading, setLoading] = useState(true);
    const [showAddDrink, setShowAddDrink] = useState(false);
    const [drinks, setDrinks] = useState();
    const [originalDrinks, setOriginalDrinks] = useState();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    //user
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        let cancel = false;

        const getDrinks = async () => {
            if (cancel) {
                return;
            }
            await fetchDrinksFromFirebase();
        }
        getDrinks();

        return () => {
            cancel = true;
        }
    }, [])

    /** Fetch Drinks From Firebase */
    const fetchDrinksFromFirebase = async () => {
        const dbref = await ref(db, DB_DRINKS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const drinksFromDB = [];
            for (let id in snap) {
                drinksFromDB.push({ id, ...snap[id] });
            }
            setLoading(false);
            setDrinks(drinksFromDB);
            setOriginalDrinks(drinksFromDB);
        })
    }

    /** Add Drink To Firebase */
    const addDrink = async (drink) => {
        try {
            drink["created"] = getCurrentDateAsJson();
            drink["createdBy"] = currentUser.email;
            const dbref = ref(db, DB_DRINKS);
            push(dbref, drink)
                .then((snap) => {
                    const key = snap.key;
                    navigate(`${DB_DRINK}/${key}`);
                })
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
        }
    }

    const deleteDrink = (id) => {
        const dbref = ref(db, `${DB_DRINKS}/${id}`);
        remove(dbref);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        color={showAddDrink ? 'red' : 'green'}
                        text={showAddDrink ? t('button_close') : t('button_add_drinks')}
                        onClick={() => setShowAddDrink(!showAddDrink)} />
                </ButtonGroup>
            </Row>
            <PageTitle title={t('manage_drinks_title')} />
            <div className="page-content">
                <Link to="/managedrinkingproducts" className='btn btn-primary'>{t('manage_drinkingproducts_button')}</Link>
                {error && <div className="error">{error}</div>}
                {message &&
                    <Alert show={showMessage} variant='success'>
                        {message}
                        <div className='d-flex justify-content-end'>
                            <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                        </div>
                    </Alert>}
                {showAddDrink && <AddDrink onAddDrink={addDrink} onClose={() => setShowAddDrink(false)} />}

                <SearchSortFilter
                    useTitleFiltering={true}
                    onSet={setDrinks}
                    showFilterHaveRated={true}
                    showFilterNotHaveRated={true}
                    showSortByTitle={true}
                    showSortByCreatedDate={true}
                    originalList={originalDrinks} />
                {
                    drinks != null && drinks.length > 0 ? (
                        <Drinks drinks={drinks}
                            onDelete={deleteDrink} />
                    ) : (
                        t('no_drinks_to_show')
                    )
                }
            </div>
        </div>
    )
}

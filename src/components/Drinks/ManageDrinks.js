import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Drinks from './Drinks';
import DrinkButton from './DrinkButton';
import { Form, Col, Row, ButtonGroup, Alert } from 'react-bootstrap';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { ref, push, onValue, remove } from "firebase/database";
import { db } from '../../firebase-config';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';
import AddDrink from './AddDrink';
import { Link } from 'react-router-dom';
import Button from '../Button';

const SortMode = {
    None: "None",
    Name_ASC: "Name_ASC",
    Name_DESC: "Name_DESC",
    Created_ASC: "Created_ASC",
    Created_DESC: "Created_DESC",
}

export default function ManageDrinks() {

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //states
    const [showAddDrink, setShowAddDrink] = useState(false);
    const [drinks, setDrinks] = useState();
    const [originalDrinks, setOriginalDrinks] = useState();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    //search
    const [searchString, setSearchString] = useState('')

    //sorting
    const [sortBy, setSortBy] = useState(SortMode.None);

    //user
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

    useEffect(() => {
        filterAndSort();
    }, [sortBy, searchString])

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

    const filterAndSort = () => {
        if (!originalDrinks) {
            return;
        }
        let newDrinks = originalDrinks;
        //haut
        if (searchString !== "") {
            newDrinks = newDrinks.filter(drink => drink.title.toLowerCase().includes(searchString.toLowerCase()));
        }
        //filtterit: TODO
        //sortit
        if (sortBy === SortMode.Name_ASC || sortBy === SortMode.Name_DESC) {
            newDrinks = [...newDrinks].sort((a, b) => {
                return a.title > b.title ? 1 : -1
            });
            if (sortBy === SortMode.Name_DESC) {
                newDrinks.reverse();
            }
        } else if (sortBy === SortMode.Created_ASC || sortBy === SortMode.Created_DESC) {
            newDrinks = [...newDrinks].sort(
                (a, b) => new Date(a.created).setHours(0, 0, 0, 0) - new Date(b.created).setHours(0, 0, 0, 0)
            );
            if (sortBy === SortMode.Created_DESC) {
                newDrinks.reverse();
            }
        }
        setDrinks(newDrinks);
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
            <div className="page-content">
                <Link to="/managedrinkincredients" className='btn btn-primary'>{t('manage_drink_incredients_button')}</Link>
                {error && <div className="error">{error}</div>}
                {message &&
                    <Alert show={showMessage} variant='success' className="success">
                        {message}
                        <div className='d-flex justify-content-end'>
                            <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                        </div>
                    </Alert>}
                {showAddDrink && <AddDrink onAddDrink={addDrink} />}
                <Form className='form-no-paddings'>
                    <Form.Group as={Row}>
                        <Form.Label column xs={3} sm={2}>{t('sorting')}</Form.Label>
                        <Col xs={9} sm={10}>
                            <Button onClick={() => {
                                sortBy === SortMode.Created_ASC ? setSortBy(SortMode.Created_DESC) : setSortBy(SortMode.Created_ASC);
                            }} text={t('created_date')} type="button" />
                            {
                                sortBy === SortMode.Created_DESC ? <FaArrowDown /> : ''
                            }
                            {
                                sortBy === SortMode.Created_ASC ? <FaArrowUp /> : ''
                            }
                            &nbsp;
                            <Button onClick={() => {
                                sortBy === SortMode.Name_ASC ? setSortBy(SortMode.Name_DESC) : setSortBy(SortMode.Name_ASC);
                            }
                            }
                                text={t('name')} type="button"
                            />
                            {
                                sortBy === SortMode.Name_DESC ? <FaArrowDown /> : ''
                            }
                            {
                                sortBy === SortMode.Name_ASC ? <FaArrowUp /> : ''
                            }
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
                        <Col xs={9} sm={10}>
                            <Form.Control
                                type="text"
                                id="inputSearchString"
                                aria-describedby="searchHelpBlock"
                                onChange={(e) => setSearchString(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                </Form>
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
